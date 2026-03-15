# Live AI Call Feature — Design

**Date:** 2025-03-10  
**Scope:** Add a "Live AI call" option inside the existing Contact modal: cartoon/3D character, voice (paid TTS), OpenRouter chat (spring-2.5-fast), full "about me" knowledge.

---

## 1. Approaches Considered

### 1.1 Character & visuals

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **A) 2D illustrated avatar + Lottie/sprite gestures** | Single 2D character art; idle/talking/thinking states via Lottie or image sprites; lip-sync optional (mouth open/closed keyframes). | Fast to build, low cost, full control, works everywhere. | Not true 3D. |
| **B) Ready Player Me (or similar) 3D avatar in-browser** | Use RPM or similar to get a 3D avatar; render in Three.js/R3F; drive gestures via blendshapes or simple animations. | Real 3D, customizable look. | More setup; need rigging/animations; bundle size. |
| **C) Video-style API (D-ID / HeyGen)** | Send character image + script; get back video stream; play in call UI. | Very polished lip-sync. | Cost per minute, latency, less "live" feel; may not fit "cartoon" as well. |

**Recommendation:** **A** for v1 (ship faster, iterate on copy and UX). Option **B** can be a follow-up if you want a true 3D character later. C is not recommended for an interactive live call.

### 1.2 Text-to-speech (paid from start)

**Choice:** ElevenLabs.  
- Free tier: ~10k characters/month (~10 min).  
- Paid: e.g. Starter $5/mo for ~30 min; Turbo model low latency.  
- API: `POST /v1/text-to-speech/{voice_id}` returns audio (MP3); we can use streaming endpoint if we want to play while generating.  
- **Implementation:** Server-side only. Next.js API route receives text, calls ElevenLabs, returns audio URL or stream. API key in `OPENROUTER_API_KEY`-style env (e.g. `ELEVENLABS_API_KEY`).

### 1.3 Chat & knowledge

- **Chat:** OpenRouter with a fast model (e.g. `google/gemini-2.5-flash` or the exact OpenRouter id for "spring-2.5-fast" from their catalog). Use **streaming** so we can show tokens as they arrive and optionally feed sentence-by-sentence to TTS for lower perceived latency.  
- **Knowledge:** Single "about me" context (no vector DB for v1). Sources:  
  - **Structured:** Experience (company, role, period, tech, descriptions), location, social links — can be derived from existing `Experience` data + a small config.  
  - **Freeform:** One markdown or JSON file (e.g. `content/about-me.md` or `lib/ai-context.json`) for "current findings", interests, preferences.  
- Injected as **system message** (or a single user-style context block) at the start of each conversation so the model can answer about you accurately.

---

## 2. User flow

1. User clicks **Get in Touch** → Contact modal opens.  
2. **Choice screen:** Two options: **Send message** (current form) | **Start AI call**.  
3. If **Start AI call:**  
   - Modal expands or transitions to "call" layout.  
   - Character visible (2D or 3D); optional short "Hi, I'm Arindam's AI — ask me anything about him" intro (text + TTS).  
   - User speaks or types (v1: **type-only** is simpler; voice input can be phase 2).  
   - Each user message → OpenRouter (streaming) → display streamed text → when we have a sentence or full reply, call TTS API → play audio; character state = "talking" (e.g. Lottie talking animation).  
   - After playback, character goes to "idle" or "listening"; repeat.  
4. User can **End call** anytime; optional "Send a follow-up message" that drops back to the existing contact form with prefilled subject/message.

---

## 3. Architecture

### 3.1 Contact modal structure

- **ContactModal** stays the single entry.  
- Internal state: `mode: 'choose' | 'message' | 'call'`.  
- **Choose:** Render two cards/buttons → "Send message" sets `mode = 'message'`, "Start AI call" sets `mode = 'call'`.  
- **Message:** Current form + submit flow (unchanged).  
- **Call:** New subview: character area + transcript (streaming) + input (textarea + Send) + End call.

### 3.2 API routes

| Route | Purpose |
|-------|--------|
| `POST /api/contact` | Unchanged (existing form submission). |
| `POST /api/ai-call/chat` | Body: `{ messages: OpenRouter-style messages[] }`. Calls OpenRouter with system context (about me); returns **stream** (SSE or fetch stream). |
| `POST /api/ai-call/tts` | Body: `{ text: string }`. Calls ElevenLabs; returns **audio** (stream or buffer). Optional: `voice_id` in body for future multi-voice. |

- **About-me context:** Built in `api/ai-call/chat`: load experience data + about-me markdown/JSON, format into one system block.  
- **Secrets:** `OPENROUTER_API_KEY`, `ELEVENLABS_API_KEY` in env; never exposed to client.

### 3.3 Frontend (call mode)

- **State:** `messages: { role, content }[]`, `isStreaming`, `isPlayingTTS`, `currentAudioRef`.  
- **Flow:** User sends message → append to `messages` → `fetch('/api/ai-call/chat', { body: messages, stream: true })` → consume stream, append assistant turn, optionally split into sentences and call `POST /api/ai-call/tts` for each (or for full reply), queue playback.  
- **Character:** Component that takes `state: 'idle' | 'thinking' | 'talking'` and renders 2D art + Lottie or placeholder; later swap for 3D if desired.  
- **Transcript:** Scrollable area; user bubbles and assistant bubbles (streaming text in assistant bubble until complete).

### 3.4 Knowledge content (about me)

- **Option A:** New file `content/about-me.md` (or `lib/arindam-context.md`) — you edit this for "current findings", interests, etc.  
- **Option B:** JSON in `lib/ai-context.ts`: export `experienceSummary` (from Experience data) + `aboutMeBlurb` string.  
- Recommendation: **A + B** — structured data from code (experience, stack, location) **plus** one markdown file for long-form context. Chat API assembles both into the system prompt.

---

## 4. Error handling & limits

- **Rate limit:** Reuse or mirror contact rate limit (e.g. same IP, 3 calls per 24h or 5 conversations per 24h) to avoid abuse.  
- **TTS:** If ElevenLabs fails, show transcript only and optionally a "Voice unavailable" message.  
- **OpenRouter:** On stream error, show error in transcript and allow retry or "Send message instead".  
- **No microphone in v1:** Input is text-only; no need for browser mic permissions or speech-to-text yet.

---

## 5. Implementation order (high level)

1. **Modal choice:** Add `mode` and choice UI in ContactModal (Send message | Start AI call).  
2. **About-me context:** Add `content/about-me.md` and a small `lib/ai-context.ts` that exports experience + blurb; use in chat API.  
3. **OpenRouter chat API:** `POST /api/ai-call/chat` with streaming and system context.  
4. **ElevenLabs TTS API:** `POST /api/ai-call/tts`; return audio.  
5. **Call UI:** Transcript, input, send; connect to chat stream and TTS playback; character with idle/talking states (placeholder or 2D + Lottie).  
6. **Polish:** Rate limit for call, End call, optional "Send follow-up" back to message form.

---

## 6. Out of scope for v1

- Voice input (STT).  
- True 3D character (can add later with R3F + RPM or custom model).  
- Persisting conversation history (session-only).  
- Multiple TTS voices or language selection (single voice, English by default).

---

## 7. Environment variables

- `OPENROUTER_API_KEY` — for chat.  
- `ELEVENLABS_API_KEY` — for TTS.  
- Optional: `ELEVENLABS_VOICE_ID` (default voice).

---

**Next step:** Get your approval on this design, then create a step-by-step implementation plan (writing-plans) and implement.

---

## Implementation completed (2025-03-10)

- **Modal choice:** ContactModal now has `mode: 'choose' | 'message' | 'call'` with two options: "Send message" and "Start AI call".
- **About-me context:** `lib/experience-data.ts` (shared with Experience), `lib/ai-context.ts` (builds system prompt), `content/about-me.md` (editable long-form context).
- **APIs:** `POST /api/ai-call/chat` (OpenRouter streaming), `POST /api/ai-call/tts` (ElevenLabs). Env: `OPENROUTER_API_KEY`, `OPENROUTER_CHAT_MODEL`, `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`.
- **Call UI:** `CallCharacter` (idle/thinking/talking), transcript with streaming, text input + Send, End call, "Send follow-up message" (prefills subject/message from last exchange).
- **Rate limit for call:** Not implemented in v1; can be added later (e.g. same IP limit as contact).
