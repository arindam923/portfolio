import { db } from "@/db";
import { messages } from "@/db/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq, gt, count } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Pre-configured model instance for better performance
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", // Using faster flash model
    generationConfig: {
        maxOutputTokens: 150, // Limit output for faster response
        temperature: 0.7,
    },
});

const AI_PERSONA_PROMPT = `You are Arindam Roy's AI assistant. Arindam is a Full Stack Developer and Open Source Contributor. Respond professionally and friendly to people reaching out through his portfolio. Acknowledge their message briefly and thank them for the shoutout. Since we don't collect contact info here, suggest they reach out on Twitter or LinkedIn if they need a direct response. Keep it to 2-3 sentences. Be humble and tech-focused.

Subject: {{subject}}
Message: {{message}}`;

// Constants
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_MESSAGES_PER_WINDOW = 3;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const subject = body.subject?.trim();
        const message = body.message?.trim();

        // 1. Input Validation (fast, before any DB/API calls)
        if (!subject || !message) {
            return NextResponse.json(
                { error: "Subject and message are required" },
                { status: 400 }
            );
        }

        if (subject.length > MAX_SUBJECT_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
            return NextResponse.json(
                { error: "Subject or message exceeds maximum length" },
                { status: 400 }
            );
        }

        // 2. Get IP for rate limiting
        const headersList = await headers();
        const forwardedFor = headersList.get("x-forwarded-for");
        const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

        const twentyFourHoursAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

        // 3. Rate Limiting - Use COUNT for better performance (uses index)
        const [{ messageCount }] = await db
            .select({ messageCount: count() })
            .from(messages)
            .where(
                and(
                    eq(messages.ip, ip),
                    gt(messages.createdAt, twentyFourHoursAgo)
                )
            );

        if (messageCount >= MAX_MESSAGES_PER_WINDOW) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Please try again after 24 hours." },
                { status: 429 }
            );
        }

        // 4. Generate AI response
        const prompt = AI_PERSONA_PROMPT
            .replace("{{subject}}", subject)
            .replace("{{message}}", message);

        const result = await model.generateContent(prompt);
        const aiReply = result.response.text();

        // 5. Save to DB (non-blocking for faster response)
        db.insert(messages).values({
            ip,
            subject,
            message,
            aiReply,
        }).then(() => {
            // Silent success
        }).catch((err) => {
            console.error("Failed to save message to DB:", err);
        });

        return NextResponse.json({ success: true, aiReply });
    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json(
            { error: "Failed to process message" },
            { status: 500 }
        );
    }
}
