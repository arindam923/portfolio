"use client";

import { useState, useId, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CornerDownRight } from "lucide-react";

interface ContactModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
	const subjectId = useId();
	const messageId = useId();
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [aiReply, setAiReply] = useState<string | null>(null);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

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
			if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
				if (subject && message && !isLoading && !isSubmitted) {
					handleSubmit();
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, subject, message, isLoading, isSubmitted, onClose]);

	const handleDone = () => {
		onClose();
		setTimeout(() => {
			setSubject("");
			setMessage("");
			setAiReply(null);
			setIsSubmitted(false);
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
						onClick={onClose}
						className="absolute inset-0"
					/>

					<motion.div
						initial={{ opacity: 0, y: "100%" }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="relative w-full sm:max-w-2xl bg-zinc-950 sm:rounded-3xl border-t sm:border border-zinc-800 shadow-2xl h-[85vh] sm:h-auto sm:min-h-[500px] flex flex-col overflow-hidden"
					>
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-zinc-900">
							<span className="text-sm font-medium text-zinc-400">
								{!isSubmitted ? "New Message" : "Reply Received"}
							</span>
							<button
								onClick={onClose}
								className="text-zinc-500 hover:text-white transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="flex-grow flex flex-col relative">
							{!isSubmitted ? (
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
										<div className="hidden sm:flex items-center gap-2 text-zinc-600 font-mono text-xs">
											<kbd className="px-1.5 py-0.5 border border-zinc-800 rounded">
												⌘
											</kbd>{" "}
											+
											<kbd className="px-1.5 py-0.5 border border-zinc-800 rounded">
												Enter
											</kbd>
											<span>to send</span>
										</div>

										<button
											type="submit"
											disabled={isLoading}
											className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 group uppercase tracking-wide text-xs"
										>
											{isLoading ? "Sending..." : "Send"}
											{!isLoading && (
												<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
											)}
										</button>
									</div>
								</form>
							) : (
								<div className="flex flex-col h-full p-6 bg-zinc-950 overflow-y-auto">
									<div className="flex flex-col gap-6 w-full max-w-xl mx-auto mt-6">
										<div className="flex gap-4">
											<div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0 border border-zinc-700" />
											<div className="flex flex-col">
												<span className="text-sm font-medium text-white mb-1">
													You
												</span>
												<div className="p-4 rounded-2xl rounded-tl-sm bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm leading-relaxed">
													<p className="font-semibold text-white mb-2 pb-2 border-b border-zinc-800">
														{subject}
													</p>
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
													Arindam (AI){" "}
													<CornerDownRight className="w-3 h-3 text-zinc-600" />
												</span>
												<div className="p-4 rounded-2xl rounded-tl-sm bg-white text-black text-sm leading-relaxed font-medium">
													{aiReply}
												</div>
											</div>
										</div>
									</div>

									<div className="mt-auto pt-8 flex justify-center">
										<button
											onClick={handleDone}
											className="px-6 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-700 rounded-xl"
										>
											Close
										</button>
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
