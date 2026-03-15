"use client";

import { useState, useId, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	X,
	ArrowRight,
	CornerDownRight,
	MessageSquare,
	Phone,
	PhoneOff,
	Mic,
	Square,
	Send,
} from "lucide-react";
import { AudioVisualizer } from "./AudioVisualizer";
import type { VisualizerState } from "./AudioVisualizer";

interface ContactModalProps {
	isOpen: boolean;
	onClose: () => void;
}

type ModalMode = "choose" | "message" | "call";

interface ChatMessage {
	role: "user" | "assistant";
	content: string;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
	const subjectId = useId();
	const messageId = useId();
	const transcriptEndRef = useRef<HTMLDivElement>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	// Shared
	const [mode, setMode] = useState<ModalMode>("choose");
	const [error, setError] = useState<string | null>(null);

	// Message flow (existing)
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [aiReply, setAiReply] = useState<string | null>(null);
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Call flow
	const [callMessages, setCallMessages] = useState<ChatMessage[]>([]);
	const [streamingContent, setStreamingContent] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [isPlayingTTS, setIsPlayingTTS] = useState(false);
	const [visualizerState, setVisualizerState] = useState<VisualizerState>("idle");
	const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null);
	const [isListening, setIsListening] = useState(false);
	const [speechTranscript, setSpeechTranscript] = useState("");
	const [isTranscribing, setIsTranscribing] = useState(false);
	const [callTextInput, setCallTextInput] = useState("");

	const scrollToBottom = useCallback(() => {
		transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [callMessages, streamingContent, scrollToBottom]);

	// Play TTS for a string: call API, play audio, set character state
	const playTTS = useCallback(async (text: string) => {
		if (!text.trim()) return;
		setVisualizerState("talking");
		setIsPlayingTTS(true);
		try {
			const res = await fetch("/api/ai-call/tts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: text.trim() }),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				setError(data.error || "Voice unavailable");
				return;
			}
			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			const audio = new Audio(url);
			audioRef.current = audio;
			setPlayingAudio(audio);
			await new Promise<void>((resolve, reject) => {
				audio.onended = () => {
					URL.revokeObjectURL(url);
					setPlayingAudio(null);
					resolve();
				};
				audio.onerror = () => {
					setPlayingAudio(null);
					reject(new Error("Playback failed"));
				};
				audio.play().catch(reject);
			});
		} catch (e) {
			console.error("TTS error:", e);
			setError("Could not play voice");
		} finally {
			setIsPlayingTTS(false);
			setVisualizerState("idle");
		}
	}, []);

	const sendWithTranscript = useCallback(
		async (transcript: string) => {
			const trimmed = transcript.trim();
			if (!trimmed || isStreaming) return;

			const userMessage: ChatMessage = { role: "user", content: trimmed };
			setCallMessages((prev) => [...prev, userMessage]);
			setError(null);
			setStreamingContent("");
			setSpeechTranscript("");
			setIsStreaming(true);
			setVisualizerState("thinking");

			const messagesForAPI = [...callMessages, userMessage].map((m) => ({
				role: m.role,
				content: m.content,
			}));

			try {
				const res = await fetch("/api/ai-call/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ messages: messagesForAPI }),
				});

				if (!res.ok) {
					const data = await res.json().catch(() => ({}));
					throw new Error(data.error || "Chat request failed");
				}

				const reader = res.body?.getReader();
				const decoder = new TextDecoder();
				let fullContent = "";
				let buffer = "";

				if (reader) {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						buffer += decoder.decode(value, { stream: true });
						const lines = buffer.split("\n");
						buffer = lines.pop() || "";
						for (const line of lines) {
							if (line.startsWith("data: ") && line !== "data: [DONE]") {
								try {
									const json = JSON.parse(line.slice(6));
									const delta = json.choices?.[0]?.delta?.content;
									if (typeof delta === "string") {
										fullContent += delta;
										setStreamingContent(fullContent);
									}
								} catch {
									// ignore
								}
							}
						}
					}
				}

				setCallMessages((prev) => [...prev, { role: "assistant", content: fullContent }]);
				setStreamingContent("");
				setVisualizerState("idle");
				await playTTS(fullContent);
			} catch (e) {
				setError(e instanceof Error ? e.message : "Something went wrong");
				setVisualizerState("idle");
			} finally {
				setIsStreaming(false);
			}
		},
		[callMessages, playTTS, isStreaming]
	);

	const stopListening = useCallback(() => {
		const mr = mediaRecorderRef.current;
		if (mr && mr.state !== "inactive") {
			mr.stop();
			mediaRecorderRef.current = null;
		}
		// Stream will be stopped in MediaRecorder onstop after we get the blob
	}, []);

	const startListening = useCallback(() => {
		if (isStreaming || isListening || isTranscribing) return;
		setError(null);
		setSpeechTranscript("");
		chunksRef.current = [];

		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				streamRef.current = stream;
				setIsListening(true);
				setVisualizerState("listening");

				const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
				const recorder = new MediaRecorder(stream, { mimeType });

				recorder.ondataavailable = (e) => {
					if (e.data.size > 0) chunksRef.current.push(e.data);
				};

				recorder.onstop = async () => {
					streamRef.current?.getTracks().forEach((t) => t.stop());
					streamRef.current = null;
					setIsListening(false);
					setVisualizerState("idle");

					const chunks = chunksRef.current;
					chunksRef.current = [];
					if (chunks.length === 0) {
						setError("No audio recorded. Try again.");
						return;
					}
					const blob = new Blob(chunks, { type: mimeType.split(";")[0] });
					if (blob.size < 500) {
						setError("Recording too short. Speak for a second or two.");
						return;
					}

					setIsTranscribing(true);
					setError(null);
					try {
						const formData = new FormData();
						formData.append("file", blob, "audio.webm");
						const res = await fetch("/api/ai-call/stt", { method: "POST", body: formData });
						const data = await res.json();
						if (!res.ok) throw new Error(data.error || "Transcription failed");
						const text = (data.text ?? "").trim();
						if (text) sendWithTranscript(text);
						else setError("No speech detected. Try again.");
					} catch (err) {
						setError(err instanceof Error ? err.message : "Could not transcribe. Type your question below.");
					} finally {
						setIsTranscribing(false);
					}
				};

				recorder.start(100);
				mediaRecorderRef.current = recorder;
			})
			.catch((err) => {
				console.warn("getUserMedia failed:", err);
				setError(
					err.name === "NotAllowedError"
						? "Microphone access denied. Allow the mic in your browser to use voice."
						: "Microphone access is required for voice input. Check permissions and try again."
				);
			});
	}, [isStreaming, isListening, isTranscribing, sendWithTranscript]);

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!subject || !message) return;

		setIsLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ subject, message }),
			});

			const data = await res.json();
			if (res.ok && data.success) {
				setAiReply(data.aiReply);
				setIsSubmitted(true);
			} else {
				setError(data.error || "An unexpected error occurred.");
			}
		} catch (err) {
			console.error("Submission failed:", err);
			setError("Failed to connect to the server.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;
			if (e.key === "Escape") onClose();
			if (mode === "message" && (e.metaKey || e.ctrlKey) && e.key === "Enter") {
				if (subject && message && !isLoading && !isSubmitted) handleSubmit();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, mode, subject, message, isLoading, isSubmitted, onClose]);

	const handleClose = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current = null;
		}
		onClose();
		setTimeout(() => {
			setMode("choose");
			setSubject("");
			setMessage("");
			setAiReply(null);
			setIsSubmitted(false);
			setError(null);
			setCallMessages([]);
			setStreamingContent("");
		}, 300);
	};

	const handleDone = () => {
		onClose();
		setTimeout(() => {
			setSubject("");
			setMessage("");
			setAiReply(null);
			setIsSubmitted(false);
			setError(null);
			setMode("choose");
		}, 300);
	};

	const backToChoice = () => {
		setError(null);
		setMode("choose");
		setCallMessages([]);
		setStreamingContent("");
		setCallTextInput("");
		setSpeechTranscript("");
		stopListening();
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current = null;
		}
	};

	const switchToMessageWithContext = () => {
		const lastUser = [...callMessages].reverse().find((m) => m.role === "user");
		const lastAssistant = [...callMessages].reverse().find((m) => m.role === "assistant");
		if (lastUser) setSubject("Follow-up from AI call");
		if (lastUser && lastAssistant) {
			setMessage(`Previous question: ${lastUser.content}\n\nAI reply: ${lastAssistant.content}\n\n[Your follow-up here]`);
		}
		setMode("message");
		setCallMessages([]);
		setStreamingContent("");
		stopListening();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-black/40 backdrop-blur-sm">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={handleClose}
						className="absolute inset-0"
					/>

					<motion.div
						initial={{ opacity: 0, y: "100%" }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="relative w-full sm:max-w-2xl bg-zinc-950 sm:rounded-3xl border-t sm:border border-zinc-800 shadow-2xl h-[85vh] sm:h-[80vh] sm:max-h-[700px] flex flex-col overflow-hidden"
					>
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-zinc-900 shrink-0">
							<span className="text-sm font-medium text-zinc-400">
								{mode === "choose" && "Get in touch"}
								{mode === "message" && !isSubmitted && "New Message"}
								{mode === "message" && isSubmitted && "Reply Received"}
								{mode === "call" && "Live AI call"}
							</span>
							<button
								onClick={handleClose}
								className="text-zinc-500 hover:text-white transition-colors"
								aria-label="Close"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="flex-grow flex flex-col relative overflow-hidden">
							{/* Choice screen */}
							{mode === "choose" && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="flex flex-col sm:flex-row gap-4 p-6"
								>
									<button
										type="button"
										onClick={() => setMode("message")}
										className="flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 transition-colors text-left group"
									>
										<div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
											<MessageSquare className="w-6 h-6 text-zinc-300" />
										</div>
										<span className="font-semibold text-white">Send message</span>
										<span className="text-sm text-zinc-500 text-center">
											Drop a note and get a quick AI reply. Best for short questions.
										</span>
									</button>
									<button
										type="button"
										onClick={() => setMode("call")}
										className="flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-emerald-800 hover:bg-emerald-950/20 transition-colors text-left group"
									>
										<div className="w-12 h-12 rounded-xl bg-emerald-900/50 flex items-center justify-center group-hover:bg-emerald-800/50 transition-colors">
											<Phone className="w-6 h-6 text-emerald-400" />
										</div>
										<span className="font-semibold text-white">Start AI call</span>
										<span className="text-sm text-zinc-500 text-center">
											Chat with an AI that knows Arindam — experience, stack, and more. With voice.
										</span>
									</button>
								</motion.div>
							)}

							{/* Message form (existing) */}
							{mode === "message" && !isSubmitted && (
								<form
									onSubmit={(e) => handleSubmit(e)}
									className="flex flex-col h-full bg-zinc-950"
								>
									<div className="flex items-center border-b border-zinc-900/80 px-6 py-4">
										<label
											htmlFor={subjectId}
											className="text-zinc-500 font-mono text-xs uppercase tracking-widest w-20 shrink-0"
										>
											Subj
										</label>
										<input
											id={subjectId}
											required
											value={subject}
											onChange={(e) => setSubject(e.target.value)}
											placeholder="What's this regarding?"
											className="w-full bg-transparent text-white placeholder:text-zinc-700 focus:outline-none text-base font-medium"
											autoFocus
										/>
									</div>
									<div className="flex flex-col flex-grow px-6 py-6 border-b border-zinc-900/80">
										<textarea
											id={messageId}
											required
											value={message}
											onChange={(e) => setMessage(e.target.value)}
											placeholder="Hey Arindam, I'm reaching out because..."
											className="w-full h-full bg-transparent text-zinc-300 placeholder:text-zinc-700 focus:outline-none resize-none leading-relaxed text-[15px]"
										/>
									</div>
									{error && (
										<div className="px-6 py-3 bg-red-950/20 text-red-500 text-sm border-t border-red-900/30">
											{error}
										</div>
									)}
									<div className="p-4 px-6 flex items-center justify-between bg-zinc-950 shrink-0">
										<button
											type="button"
											onClick={backToChoice}
											className="text-zinc-500 hover:text-white text-sm"
										>
											Back
										</button>
										<div className="hidden sm:flex items-center gap-2 text-zinc-600 font-mono text-xs">
											<kbd className="px-1.5 py-0.5 border border-zinc-800 rounded">⌘</kbd>+
											<kbd className="px-1.5 py-0.5 border border-zinc-800 rounded">Enter</kbd>
											<span>to send</span>
										</div>
										<button
											type="submit"
											disabled={isLoading}
											className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 group uppercase tracking-wide text-xs"
										>
											{isLoading ? "Sending..." : "Send"}
											{!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
										</button>
									</div>
								</form>
							)}

							{/* Message success (existing) */}
							{mode === "message" && isSubmitted && (
								<div className="flex flex-col h-full p-6 bg-zinc-950 overflow-y-auto">
									<div className="flex flex-col gap-6 w-full max-w-xl mx-auto mt-6">
										<div className="flex gap-4">
											<div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0 border border-zinc-700" />
											<div className="flex flex-col">
												<span className="text-sm font-medium text-white mb-1">You</span>
												<div className="p-4 rounded-2xl rounded-tl-sm bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm leading-relaxed">
													<p className="font-semibold text-white mb-2 pb-2 border-b border-zinc-800">{subject}</p>
													{message}
												</div>
											</div>
										</div>
										<div className="flex gap-4">
											<div className="w-8 h-8 rounded-full bg-white shrink-0 flex items-center justify-center text-black font-bold">
												A
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-medium text-zinc-400 mb-1 flex items-center gap-2">
													Arindam (AI) <CornerDownRight className="w-3 h-3 text-zinc-600" />
												</span>
												<div className="p-4 rounded-2xl rounded-tl-sm bg-white text-black text-sm leading-relaxed font-medium">
													{aiReply}
												</div>
											</div>
										</div>
									</div>
									<div className="mt-auto pt-8 flex justify-center gap-3">
										<button
											onClick={handleDone}
											className="px-6 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-700 rounded-xl"
										>
											Close
										</button>
									</div>
								</div>
							)}

							{/* Call view */}
							{mode === "call" && (
								<div className="flex flex-col h-full min-h-0">
									{/* Audio visualizer */}
									<div className="shrink-0 pt-8 pb-4 flex justify-center">
										<AudioVisualizer
											state={visualizerState}
											audioElement={visualizerState === "talking" ? playingAudio ?? undefined : undefined}
											mediaStream={visualizerState === "listening" ? streamRef.current ?? undefined : undefined}
											size={180}
											className="ring-2 ring-zinc-800/80 ring-offset-4 ring-offset-zinc-950 rounded-full"
										/>
									</div>
									{/* Transcript */}
									<div className="flex-1 min-h-0 overflow-y-auto px-5">
										<div className="space-y-4 py-3 max-w-xl mx-auto">
											{callMessages.length === 0 && !streamingContent && !speechTranscript && (
												<p className="text-center text-zinc-500 text-sm leading-relaxed">
													Tap the mic to ask anything about Arindam — experience, stack, or projects.
												</p>
											)}
											{callMessages.map((m, i) => (
												<div
													key={i}
													className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
												>
													{m.role === "assistant" && (
														<div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 shrink-0 flex items-center justify-center text-emerald-400 text-xs font-semibold">
															AI
														</div>
													)}
													<div
														className={`max-w-[82%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${
															m.role === "user"
																? "bg-zinc-800 text-zinc-100 rounded-br-md"
																: "bg-zinc-800/60 text-zinc-200 border border-zinc-700/60 rounded-bl-md"
														}`}
													>
														{m.content}
													</div>
													{m.role === "user" && (
														<div className="w-9 h-9 rounded-full bg-zinc-700/80 shrink-0 flex items-center justify-center text-zinc-400 text-xs">
															You
														</div>
													)}
												</div>
											))}
											{streamingContent && (
												<div className="flex gap-3 justify-start">
													<div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 shrink-0 flex items-center justify-center text-emerald-400 text-xs font-semibold">
														AI
													</div>
													<div className="max-w-[82%] px-4 py-3 rounded-2xl rounded-bl-md text-[15px] leading-relaxed bg-zinc-800/60 text-zinc-200 border border-zinc-700/60">
														{streamingContent}
														<span className="inline-block w-0.5 h-4 ml-0.5 bg-emerald-400 animate-pulse align-middle" />
													</div>
												</div>
											)}
											{speechTranscript && (
												<div className="flex gap-3 justify-end">
													<div className="max-w-[82%] px-4 py-3 rounded-2xl rounded-bl-md text-[15px] leading-relaxed bg-zinc-800/80 text-zinc-300 border border-zinc-600/60">
														{speechTranscript}
														<span className="inline-block w-0.5 h-4 ml-0.5 bg-zinc-500 animate-pulse align-middle" />
													</div>
													<div className="w-9 h-9 rounded-full bg-zinc-700/80 shrink-0 flex items-center justify-center text-zinc-400 text-xs">
														You
													</div>
												</div>
											)}
											<div ref={transcriptEndRef} />
										</div>
									</div>
									{error && (
										<div className="shrink-0 px-5 py-2.5 bg-red-950/30 text-red-400 text-sm border-t border-red-900/40">
											{error}
										</div>
									)}
									{/* Voice input + End call */}
									<div className="shrink-0 p-5 pt-4 border-t border-zinc-800/80 space-y-4">
										<div className="flex flex-col items-center gap-3">
											<button
												type="button"
												onClick={isListening ? stopListening : startListening}
												disabled={isStreaming || isTranscribing}
												className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none ${
													isListening
														? "bg-red-500 hover:bg-red-600 focus:ring-red-500 animate-pulse"
														: "bg-emerald-500 hover:bg-emerald-400 focus:ring-emerald-500"
												}`}
												aria-label={isListening ? "Stop recording" : "Tap to speak"}
											>
												{isListening ? (
													<Square className="w-7 h-7 text-white fill-white" />
												) : (
													<Mic className="w-8 h-8 text-white" />
												)}
											</button>
											<span className="text-xs text-zinc-500">
												{isTranscribing
													? "Transcribing…"
													: isListening
														? "Recording… tap again to send"
														: "Tap to speak your question"}
											</span>
										</div>
										{/* Type fallback — always available when voice fails or user prefers typing */}
										<div className="flex gap-2 w-full">
											<input
												type="text"
												value={callTextInput}
												onChange={(e) => setCallTextInput(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														if (callTextInput.trim()) sendWithTranscript(callTextInput.trim());
														setCallTextInput("");
													}
												}}
												placeholder="Or type your question…"
												disabled={isStreaming}
												className="flex-1 min-w-0 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/50 focus:border-transparent text-sm"
											/>
											<button
												type="button"
												onClick={() => {
													if (callTextInput.trim()) sendWithTranscript(callTextInput.trim());
													setCallTextInput("");
												}}
												disabled={isStreaming || !callTextInput.trim()}
												className="shrink-0 px-4 py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-medium disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center gap-1.5"
											>
												<Send className="w-4 h-4" />
												Send
											</button>
										</div>
										<div className="flex items-center justify-between">
											<button
												type="button"
												onClick={switchToMessageWithContext}
												className="text-zinc-500 hover:text-white text-sm transition-colors"
											>
												Send follow-up message
											</button>
											<button
												type="button"
												onClick={backToChoice}
												className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
											>
												<PhoneOff className="w-4 h-4" />
												End call
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
