import { db } from "@/db";
import { messages, requestRateLimits } from "@/db/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq, gt, count } from "drizzle-orm";
import { Resend } from "resend";

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
const MAX_NAME_LENGTH = 100;
const MAX_CONTACT_LENGTH = 320;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2000;
const SPAM_BLOCK_THRESHOLD = 2;
const SPAM_BLOCK_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ModerationVerdict = "GENUINE" | "SPAM";

// Lazy-init Resend so missing key just skips email without crashing
function getResend(): Resend | null {
	if (!process.env.RESEND_API_KEY) return null;
	return new Resend(process.env.RESEND_API_KEY);
}

async function sendNotificationEmail(name: string, contact: string, subject: string, message: string) {
	const resend = getResend();
	const toEmail = process.env.CONTACT_TO_EMAIL;
	const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

	if (!resend || !toEmail) return;

	await resend.emails.send({
		from: `Portfolio Contact <${fromEmail}>`,
		to: toEmail,
		replyTo: contact,
		subject: `[Portfolio] New message: ${subject}`,
		html: `
			<!DOCTYPE html>
			<html>
			<head><meta charset="utf-8"></head>
			<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #09090b; color: #fafafa; margin: 0; padding: 0;">
				<div style="max-width: 600px; margin: 0 auto; padding: 40px 24px;">
					<div style="margin-bottom: 32px;">
						<span style="font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #52525b;">Portfolio Inbox</span>
						<h1 style="font-size: 24px; font-weight: 700; margin: 8px 0 0; color: #fafafa;">New Contact Request</h1>
					</div>

					<div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
						<table style="width: 100%; border-collapse: collapse;">
							<tr>
								<td style="padding: 10px 0; border-bottom: 1px solid #27272a; width: 90px;">
									<span style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #52525b;">From</span>
								</td>
								<td style="padding: 10px 0; border-bottom: 1px solid #27272a; color: #fafafa; font-weight: 500;">${name}</td>
							</tr>
							<tr>
								<td style="padding: 10px 0; border-bottom: 1px solid #27272a;">
									<span style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #52525b;">Email</span>
								</td>
								<td style="padding: 10px 0; border-bottom: 1px solid #27272a;"><a href="mailto:${contact}" style="color: #a1a1aa; text-decoration: none;">${contact}</a></td>
							</tr>
							<tr>
								<td style="padding: 10px 0;">
									<span style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #52525b;">Subject</span>
								</td>
								<td style="padding: 10px 0; color: #fafafa; font-weight: 500;">${subject}</td>
							</tr>
						</table>
					</div>

					<div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
						<span style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #52525b; display: block; margin-bottom: 12px;">Message</span>
						<p style="margin: 0; line-height: 1.7; color: #d4d4d8; white-space: pre-wrap;">${message}</p>
					</div>

					<a href="mailto:${contact}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; background: #fafafa; color: #09090b; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 9999px; text-decoration: none; letter-spacing: 0.02em;">Reply to ${name} →</a>

					<p style="margin-top: 32px; font-size: 11px; color: #3f3f46;">This message was auto-classified as genuine and passed rate limiting checks.</p>
				</div>
			</body>
			</html>
		`,
	});
}

async function sendThankYouEmail(name: string, contact: string, subject: string) {
	const resend = getResend();
	const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

	if (!resend) return;

	await resend.emails.send({
		from: `Arindam <${fromEmail}>`,
		to: contact,
		subject: `Got your message — thanks, ${name}!`,
		html: `
			<!DOCTYPE html>
			<html>
			<head><meta charset="utf-8"></head>
			<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #09090b; color: #fafafa; margin: 0; padding: 0;">
				<div style="max-width: 560px; margin: 0 auto; padding: 40px 24px;">
					<div style="margin-bottom: 32px;">
						<span style="font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #52525b;">arindam.</span>
						<div style="width: 32px; height: 2px; background: linear-gradient(90deg, #6366f1, #8b5cf6); margin-top: 8px; border-radius: 1px;"></div>
					</div>

					<h1 style="font-size: 26px; font-weight: 700; margin: 0 0 16px; color: #fafafa; line-height: 1.3;">
						Thanks for reaching out, ${name} 👋
					</h1>
					<p style="font-size: 15px; line-height: 1.7; color: #a1a1aa; margin: 0 0 24px;">
						I received your message about <strong style="color: #d4d4d8;">"${subject}"</strong> and I'll get back to you as soon as I can — usually within a day or two.
					</p>
					<p style="font-size: 15px; line-height: 1.7; color: #a1a1aa; margin: 0 0 32px;">
						In the meantime, feel free to check out my work or connect with me on LinkedIn.
					</p>

					<div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px 24px; margin-bottom: 32px;">
						<p style="margin: 0; font-size: 13px; color: #52525b; font-style: italic; line-height: 1.6;">
							"Building things that matter, one commit at a time."
						</p>
					</div>

					<p style="font-size: 13px; color: #71717a; margin: 0;">Talk soon,<br><strong style="color: #a1a1aa;">Arindam</strong></p>

					<p style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #27272a; font-size: 11px; color: #3f3f46; line-height: 1.6;">
						You're receiving this because you submitted a contact request at arindam's portfolio. If this wasn't you, you can safely ignore this email.
					</p>
				</div>
			</body>
			</html>
		`,
	});
}

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

async function handleQueuedMessage(messageId: number, ip: string, name: string, contact: string, subject: string, message: string) {
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

		// Fire both emails concurrently — don't block on them
		await Promise.allSettled([
			sendNotificationEmail(name, contact, subject, message),
			sendThankYouEmail(name, contact, subject),
		]);
	} catch (error) {
		console.error("Queued moderation failed:", error);
		// Leave as pending so it can be retried manually if needed.
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const name = body.name?.trim();
		const contact = body.contact?.trim();
		const subject = body.subject?.trim();
		const message = body.message?.trim();

		// Field presence checks
		if (!name || !contact || !subject || !message) {
			return NextResponse.json(
				{ error: "Name, email, subject and message are required" },
				{ status: 400 }
			);
		}

		// Email format validation
		if (!EMAIL_REGEX.test(contact)) {
			return NextResponse.json(
				{ error: "Please enter a valid email address" },
				{ status: 400 }
			);
		}

		// Length guards
		if (
			name.length > MAX_NAME_LENGTH ||
			contact.length > MAX_CONTACT_LENGTH ||
			subject.length > MAX_SUBJECT_LENGTH ||
			message.length > MAX_MESSAGE_LENGTH
		) {
			return NextResponse.json(
				{ error: "One or more fields exceed the maximum allowed length" },
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
				{ error: "Too many requests. Please try again later." },
				{ status: 429 }
			);
		}

		const [queued] = await db.insert(messages).values({
			ip,
			name,
			contact,
			subject,
			message,
			moderationStatus: "pending",
		}).returning({ id: messages.id });

		// Schedule moderation after response path for snappier user-perceived latency.
		setTimeout(() => {
			void handleQueuedMessage(queued.id, ip, name, contact, subject, message);
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
