"use client";

import { useState, useId, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface ContactModalProps {
	isOpen: boolean;
	onClose: () => void;
}

function isValidEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
	const nameId = useId();
	const contactId = useId();
	const subjectId = useId();
	const messageId = useId();

	const [error, setError] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);

	// Form fields
	const [name, setName] = useState("");
	const [contact, setContact] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [timeString, setTimeString] = useState("");

	// Live clock for sidebar console
	useEffect(() => {
		if (!isOpen) return;
		const updateTime = () => {
			const options: Intl.DateTimeFormatOptions = {
				timeZone: "Asia/Kolkata",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: false,
			};
			setTimeString(new Date().toLocaleTimeString("en-US", options));
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, [isOpen]);

	const validateEmail = useCallback((value: string) => {
		if (!value) {
			setEmailError(null);
			return;
		}
		setEmailError(isValidEmail(value) ? null : "Please enter a valid email address");
	}, []);

	const canSubmit = name.trim() && contact.trim() && isValidEmail(contact) && subject.trim() && message.trim() && !isLoading;

	const handleSubmit = useCallback(async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!canSubmit) return;

		setIsLoading(true);
		setError(null);
		const payload = { name, contact, subject, message };
		onClose();
		setTimeout(() => {
			setName("");
			setContact("");
			setSubject("");
			setMessage("");
			setError(null);
			setEmailError(null);
		}, 300);

		const requestPromise = fetch("/api/contact", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}).then(async (res) => {
			const data = await res.json().catch(() => ({}));
			if (!res.ok || !data.success) {
				throw new Error(data.error || "Failed to queue message.");
			}
			return data;
		});

		toast.promise(requestPromise, {
			loading: "Sending your message...",
			success: "Message received! You'll get a confirmation email shortly.",
			error: (err) => (err instanceof Error ? err.message : "Could not send message."),
		});

		try {
			await requestPromise;
		} catch (err) {
			console.error("Submission failed:", err);
		} finally {
			setIsLoading(false);
		}
	}, [canSubmit, name, contact, subject, message, onClose]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;
			if (e.key === "Escape") onClose();
			if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
				if (canSubmit) handleSubmit();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, canSubmit, onClose, handleSubmit]);

	const handleClose = () => {
		onClose();
		setTimeout(() => {
			setName("");
			setContact("");
			setSubject("");
			setMessage("");
			setError(null);
			setEmailError(null);
		}, 300);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 bg-black/60 backdrop-blur-md">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={handleClose}
						className="absolute inset-0"
					/>

					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.95 }}
						transition={{ type: "spring", damping: 30, stiffness: 300 }}
						className="relative w-full sm:max-w-3xl bg-zinc-950 sm:rounded-3xl border-t sm:border border-white/10 shadow-2xl h-[90vh] sm:h-auto sm:max-h-[640px] flex flex-row overflow-hidden z-10"
					>
						{/* Left Brand Panel */}
						<div className="hidden md:flex w-72 shrink-0 bg-white/[0.01] border-r border-white/5 p-8 flex-col justify-between font-mono select-none">
							<div className="flex flex-col gap-6">
								<div className="flex items-center gap-2.5">
									<span className="relative flex h-2 w-2">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
										<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
									</span>
									<span className="font-display font-bold tracking-tight text-white text-base">
										arindam.
									</span>
								</div>

								<div className="flex flex-col gap-1.5 border-t border-white/5 pt-6">
									<span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
										// INBOX CONSOLE
									</span>
									<span className="text-xs text-zinc-400">
										Kolkata, IN
									</span>
									<span className="text-[10px] text-zinc-600">
										22.5726° N, 88.3639° E
									</span>
								</div>
								
								<div className="flex flex-col gap-1.5">
									<span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
										// LOCAL TIME
									</span>
									<span className="text-xs text-zinc-300 font-semibold">
										{timeString || "Loading..."}
									</span>
									<span className="text-[10px] text-zinc-600">
										Asia/Kolkata (GMT+5:30)
									</span>
								</div>
							</div>

							<div className="flex flex-col gap-2 border-t border-white/5 pt-6 text-[10px] text-zinc-600 font-semibold tracking-wider uppercase">
								<div>STATUS: ACTIVE</div>
								<div>MODE: COMPOSER v2</div>
								<div>SSL ENCRYPTED</div>
							</div>
						</div>

						{/* Right Composer Panel */}
						<div className="flex-grow flex flex-col h-full bg-zinc-950 overflow-hidden relative">
							{/* Header */}
							<div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0 bg-zinc-950">
								<div className="flex flex-col">
									<span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
										// connection channel
									</span>
									<h2 className="text-lg font-display font-bold text-white mt-0.5">
										Compose Message
									</h2>
								</div>
								<button
									onClick={handleClose}
									className="w-8 h-8 rounded-full border border-white/5 hover:border-white/20 flex items-center justify-center text-zinc-500 hover:text-white transition-all cursor-pointer"
									aria-label="Close"
								>
									<X className="w-4 h-4" />
								</button>
							</div>

							{/* Form */}
							<div className="flex-grow overflow-y-auto p-6 md:p-8">
								<form
									onSubmit={(e) => handleSubmit(e)}
									className="flex flex-col gap-7"
								>
									{/* Input 1 — Name */}
									<div className="flex flex-col gap-2 group/input">
										<label
											htmlFor={nameId}
											className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-focus-within/input:text-white transition-colors"
										>
											// 01 / Your Name
										</label>
										<input
											id={nameId}
											required
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder="Jane Smith"
											className="w-full bg-transparent text-white border-b border-white/5 focus:border-white/20 pb-3 pt-1 text-sm font-medium focus:outline-none transition-colors placeholder:text-zinc-700"
											autoFocus
										/>
									</div>

									{/* Input 2 — Email */}
									<div className="flex flex-col gap-2 group/input">
										<label
											htmlFor={contactId}
											className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-focus-within/input:text-white transition-colors"
										>
											// 02 / Your Email
										</label>
										<input
											id={contactId}
											type="email"
											required
											value={contact}
											onChange={(e) => {
												setContact(e.target.value);
												validateEmail(e.target.value);
											}}
											onBlur={(e) => validateEmail(e.target.value)}
											placeholder="jane@example.com"
											className="w-full bg-transparent text-white border-b border-white/5 focus:border-white/20 pb-3 pt-1 text-sm font-medium focus:outline-none transition-colors placeholder:text-zinc-700"
										/>
										{emailError && (
											<span className="text-[11px] text-red-400 font-mono mt-0.5">{emailError}</span>
										)}
									</div>

									{/* Input 3 — Subject */}
									<div className="flex flex-col gap-2 group/input">
										<label
											htmlFor={subjectId}
											className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-focus-within/input:text-white transition-colors"
										>
											// 03 / Subject
										</label>
										<input
											id={subjectId}
											required
											value={subject}
											onChange={(e) => setSubject(e.target.value)}
											placeholder="What are we building or discussing?"
											className="w-full bg-transparent text-white border-b border-white/5 focus:border-white/20 pb-3 pt-1 text-sm font-medium focus:outline-none transition-colors placeholder:text-zinc-700"
										/>
									</div>

									{/* Input 4 — Message */}
									<div className="flex flex-col gap-2 group/input">
										<label
											htmlFor={messageId}
											className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-focus-within/input:text-white transition-colors"
										>
											// 04 / Message
										</label>
										<textarea
											id={messageId}
											required
											value={message}
											onChange={(e) => setMessage(e.target.value)}
											placeholder="Hey Arindam, I would love to collaborate on..."
											className="w-full bg-transparent text-zinc-300 border-b border-white/5 focus:border-white/20 pb-3 pt-1 text-sm font-medium focus:outline-none resize-none leading-relaxed min-h-[120px] transition-colors placeholder:text-zinc-700"
										/>
									</div>

									{error && (
										<div className="px-4 py-2.5 rounded-lg bg-red-950/20 text-red-400 text-xs border border-red-900/30 font-mono">
											{error}
										</div>
									)}

									{/* Submit controls */}
									<div className="flex items-center justify-between border-t border-white/5 pt-5">
										<div className="hidden sm:flex items-center gap-2 text-zinc-600 font-mono text-[10px]">
											<kbd className="px-1.5 py-0.5 border border-white/5 bg-white/[0.01] rounded">⌘</kbd>+
											<kbd className="px-1.5 py-0.5 border border-white/5 bg-white/[0.01] rounded">Enter</kbd>
											<span>to dispatch</span>
										</div>
										<button
											type="submit"
											disabled={!canSubmit}
											className="ml-auto inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group uppercase tracking-wider text-xs cursor-pointer shadow-lg hover:shadow-white/5"
										>
											{isLoading ? "Sending..." : "Send Message"}
											{!isLoading && (
												<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
											)}
										</button>
									</div>
								</form>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
