import { db } from "@/db";
import { messages, requestRateLimits } from "@/db/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq, gt, count } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
	model: "gemini-2.5-flash",
	generationConfig: {
		maxOutputTokens: 16,
		temperature: 0,
	},
});

const CLASSIFIER_PROMPT = `You classify incoming portfolio contact requests.
Return exactly one token: GENUINE or SPAM.

GENUINE means a real project inquiry, collaboration request, hiring/recruiting message, or thoughtful technical/professional outreach.
SPAM means ads, scams, phishing, irrelevant promotion, gibberish, or low-effort bulk solicitation.

Subject: "{{subject}}"
Contact: "{{contact}}"
Message: "{{message}}"`;

// Constants
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_MESSAGES_PER_WINDOW = 3;
const MAX_CONTACT_LENGTH = 320;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2000;
const SPAM_BLOCK_THRESHOLD = 2;
const SPAM_BLOCK_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

type ModerationVerdict = "GENUINE" | "SPAM";

async function classifyRequest(contact: string, subject: string, message: string): Promise<ModerationVerdict> {
	if (!process.env.GEMINI_API_KEY) {
		// Fall back to accepting when classifier is unavailable to avoid dropping valid leads.
		return "GENUINE";
	}

	const result = await model.generateContent(
		CLASSIFIER_PROMPT
			.replace("{{contact}}", contact)
			.replace("{{subject}}", subject)
			.replace("{{message}}", message)
	);
	const verdict = result.response.text().trim().toUpperCase();
	return verdict === "GENUINE" ? "GENUINE" : "SPAM";
}

async function handleQueuedMessage(messageId: number, ip: string, contact: string, subject: string, message: string) {
	try {
		const [existingLimit] = await db
			.select()
			.from(requestRateLimits)
			.where(eq(requestRateLimits.ip, ip))
			.limit(1);

		if (existingLimit?.blockedUntil && existingLimit.blockedUntil > new Date()) {
			await db.delete(messages).where(eq(messages.id, messageId));
			return;
		}

		const verdict = await classifyRequest(contact, subject, message);

		if (verdict === "SPAM") {
			const nextSpamCount = (existingLimit?.spamCount ?? 0) + 1;
			const shouldBlock = nextSpamCount >= SPAM_BLOCK_THRESHOLD;
			const blockedUntil = shouldBlock ? new Date(Date.now() + SPAM_BLOCK_WINDOW_MS) : null;

			await db
				.insert(requestRateLimits)
				.values({
					ip,
					spamCount: nextSpamCount,
					blockedUntil: blockedUntil ?? undefined,
					updatedAt: new Date(),
				})
				.onConflictDoUpdate({
					target: requestRateLimits.ip,
					set: {
						spamCount: nextSpamCount,
						blockedUntil: blockedUntil ?? undefined,
						updatedAt: new Date(),
					},
				});

			await db.delete(messages).where(eq(messages.id, messageId));
			return;
		}

		// Count only already-approved genuine requests in the rolling window.
		const twentyFourHoursAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
		const [{ messageCount }] = await db
			.select({ messageCount: count() })
			.from(messages)
			.where(
				and(
					eq(messages.ip, ip),
					eq(messages.moderationStatus, "genuine"),
					gt(messages.createdAt, twentyFourHoursAgo)
				)
			);

		if (messageCount >= MAX_MESSAGES_PER_WINDOW) {
			// Valid but over quota: remove from inbox so only actionable messages remain.
			await db.delete(messages).where(eq(messages.id, messageId));
			return;
		}

		await db
			.update(messages)
			.set({ moderationStatus: "genuine" })
			.where(eq(messages.id, messageId));

		if (existingLimit) {
			await db
				.insert(requestRateLimits)
				.values({
					ip,
					spamCount: 0,
					blockedUntil: null,
					updatedAt: new Date(),
				})
				.onConflictDoUpdate({
					target: requestRateLimits.ip,
					set: {
						spamCount: 0,
						blockedUntil: null,
						updatedAt: new Date(),
					},
				});
		}
	} catch (error) {
		console.error("Queued moderation failed:", error);
		// Leave as pending so it can be retried manually if needed.
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const contact = body.contact?.trim();
		const subject = body.subject?.trim();
		const message = body.message?.trim();

		if (!contact || !subject || !message) {
			return NextResponse.json(
				{ error: "Contact, subject and message are required" },
				{ status: 400 }
			);
		}

		if (
			contact.length > MAX_CONTACT_LENGTH ||
			subject.length > MAX_SUBJECT_LENGTH ||
			message.length > MAX_MESSAGE_LENGTH
		) {
			return NextResponse.json(
				{ error: "Contact, subject or message exceeds maximum length" },
				{ status: 400 }
			);
		}

		const headersList = await headers();
		const forwardedFor = headersList.get("x-forwarded-for");
		const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

		// Fast hard block check so abusive users are rejected immediately.
		const [existingLimit] = await db
			.select()
			.from(requestRateLimits)
			.where(eq(requestRateLimits.ip, ip))
			.limit(1);

		if (existingLimit?.blockedUntil && existingLimit.blockedUntil > new Date()) {
			return NextResponse.json(
				{ error: "Rate limit exceeded. Please try again later." },
				{ status: 429 }
			);
		}

		const [queued] = await db.insert(messages).values({
			ip,
			contact,
			subject,
			message,
			moderationStatus: "pending",
		}).returning({ id: messages.id });

		// Schedule moderation after response path for snappier user-perceived latency.
		setTimeout(() => {
			void handleQueuedMessage(queued.id, ip, contact, subject, message);
		}, 0);

		return NextResponse.json({ success: true, queued: true });
	} catch (error) {
		console.error("Contact API Error:", error);
		return NextResponse.json(
			{ error: "Failed to process message" },
			{ status: 500 }
		);
	}
}
