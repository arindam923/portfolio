import { NextRequest } from "next/server";

const OPENAI_TRANSCRIPTIONS_URL = "https://api.openai.com/v1/audio/transcriptions";

export async function POST(req: NextRequest) {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		return new Response(
			JSON.stringify({ error: "OpenAI API key not configured for speech-to-text" }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}

	let formData: FormData;
	try {
		formData = await req.formData();
	} catch {
		return new Response(
			JSON.stringify({ error: "Invalid form data" }),
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}

	const file = formData.get("file") ?? formData.get("audio");
	if (!file || !(file instanceof Blob)) {
		return new Response(
			JSON.stringify({ error: "Missing audio file (field: file or audio)" }),
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}

	// Whisper needs a filename with extension; browser usually sends webm
	const ext = file.type === "audio/webm" ? "webm" : file.type === "audio/mp4" ? "m4a" : "webm";
	const filename = `audio.${ext}`;

	const openaiForm = new FormData();
	openaiForm.append("file", file, filename);
	openaiForm.append("model", "whisper-1");
	openaiForm.append("language", "en");

	const res = await fetch(OPENAI_TRANSCRIPTIONS_URL, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			// Let fetch set Content-Type with boundary for FormData
		},
		body: openaiForm,
	});

	if (!res.ok) {
		const err = await res.text();
		console.error("Whisper API error:", res.status, err);
		return new Response(
			JSON.stringify({ error: "Transcription failed", detail: err }),
			{ status: res.status, headers: { "Content-Type": "application/json" } }
		);
	}

	const data = (await res.json()) as { text?: string };
	const text = typeof data.text === "string" ? data.text.trim() : "";
	return new Response(JSON.stringify({ text }), {
		headers: { "Content-Type": "application/json" },
	});
}
