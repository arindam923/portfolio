"use client";

import { useState, useId, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface ContactModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
	const contactId = useId();
	const subjectId = useId();
	const messageId = useId();

	const [error, setError] = useState<string | null>(null);

	// Message flow
	const [contact, setContact] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = useCallback(async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!contact || !subject || !message) return;

		setIsLoading(true);
		setError(null);
		const payload = { contact, subject, message };
		onClose();
		setTimeout(() => {
			setContact("");
			setSubject("");
			setMessage("");
			setError(null);
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
			loading: "Queueing your message...",
			success: "Message received. Added to review queue.",
			error: (err) => (err instanceof Error ? err.message : "Could not send message."),
		});

		try {
			await requestPromise;
		} catch (err) {
			console.error("Submission failed:", err);
		} finally {
			setIsLoading(false);
		}
	}, [contact, subject, message, onClose]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;
			if (e.key === "Escape") onClose();
			if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
				if (contact && subject && message && !isLoading) handleSubmit();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, contact, subject, message, isLoading, onClose, handleSubmit]);

	const handleClose = () => {
		onClose();
		setTimeout(() => {
			setContact("");
			setSubject("");
			setMessage("");
			setError(null);
		}, 300);
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
						<div className="flex items-center justify-between p-6 border-b border-zinc-900 shrink-0">
							<span className="text-sm font-medium text-zinc-400">New Message</span>
							<button
								onClick={handleClose}
								className="text-zinc-500 hover:text-white transition-colors"
								aria-label="Close"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="flex-grow flex flex-col relative overflow-hidden">
							<form
								onSubmit={(e) => handleSubmit(e)}
								className="flex flex-col h-full bg-zinc-950"
							>
								<div className="flex items-center border-b border-zinc-900/80 px-6 py-4">
									<label
										htmlFor={contactId}
										className="text-zinc-500 font-mono text-xs uppercase tracking-widest w-20 shrink-0"
									>
										Contact
									</label>
									<input
										id={contactId}
										required
										value={contact}
										onChange={(e) => setContact(e.target.value)}
										placeholder="Email or phone/Telegram/LinkedIn"
										className="w-full bg-transparent text-white placeholder:text-zinc-700 focus:outline-none text-base font-medium"
										autoFocus
									/>
								</div>
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
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
