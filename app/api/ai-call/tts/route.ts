import { NextRequest } from "next/server";

const ELEVENLABS_URL = "https://api.elevenlabs.io/v1/text-to-speech";

export async function POST(req: NextRequest) {
	const apiKey = process.env.ELEVENLABS_API_KEY;
	if (!apiKey) {
		return new Response(
			JSON.stringify({ error: "ElevenLabs API key not configured" }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}

	let body: { text?: string; voice_id?: string };
	try {
		body = await req.json();
	} catch {
		return new Response(
			JSON.stringify({ error: "Invalid JSON body" }),
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}

	const text = typeof body.text === "string" ? body.text.trim() : "";
	if (!text) {
		return new Response(
			JSON.stringify({ error: "text is required" }),
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}

	const voiceId =
		typeof body.voice_id === "string" && body.voice_id
			? body.voice_id
			: process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Rachel default

	const res = await fetch(`${ELEVENLABS_URL}/${voiceId}`, {
		method: "POST",
		headers: {
			"xi-api-key": apiKey,
			"Content-Type": "application/json",
			Accept: "audio/mpeg",
		},
		body: JSON.stringify({
			text,
			model_id: "eleven_turbo_v2_5",
		}),
	});

	if (!res.ok) {
		const err = await res.text();
		return new Response(
			JSON.stringify({ error: "TTS failed", detail: err }),
			{ status: res.status, headers: { "Content-Type": "application/json" } }
		);
	}

	const audioBuffer = await res.arrayBuffer();
	return new Response(audioBuffer, {
		headers: {
			"Content-Type": "audio/mpeg",
			"Cache-Control": "no-store",
		},
	});
}
