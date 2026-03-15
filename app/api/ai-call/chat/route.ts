import { getSystemContext } from "@/lib/ai-context";
import { NextRequest } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OPENROUTER_CHAT_MODEL || "google/gemini-2.5-flash-preview-05-20";

export async function POST(req: NextRequest) {
	const apiKey = process.env.OPENROUTER_API_KEY;
	if (!apiKey) {
		return new Response(
			JSON.stringify({ error: "OpenRouter API key not configured" }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}

	let body: { messages?: { role: string; content: string }[] };
	try {
		body = await req.json();
	} catch {
		return new Response(
			JSON.stringify({ error: "Invalid JSON body" }),
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}

	const messages = body.messages as { role: string; content: string }[] | undefined;
	if (!Array.isArray(messages) || messages.length === 0) {
		return new Response(
			JSON.stringify({ error: "messages array is required" }),
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}

	const systemContext = getSystemContext();
	const openRouterMessages = [
		{ role: "system" as const, content: systemContext },
		...messages.map((m) => ({
			role: m.role as "user" | "assistant" | "system",
			content: m.content,
		})),
	];

	const res = await fetch(OPENROUTER_URL, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			"HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
		},
		body: JSON.stringify({
			model: MODEL,
			messages: openRouterMessages,
			stream: true,
		}),
	});

	if (!res.ok) {
		const text = await res.text();
		return new Response(
			JSON.stringify({ error: "OpenRouter request failed", detail: text }),
			{ status: res.status, headers: { "Content-Type": "application/json" } }
		);
	}

	const reader = res.body;
	if (!reader) {
		return new Response(
			JSON.stringify({ error: "No response body" }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}

	return new Response(reader, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
}
