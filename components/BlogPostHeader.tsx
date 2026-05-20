"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { Heart, Share, Calendar, Code, Eye, Check, Terminal, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogPostHeaderProps {
	title: string;
	subtitle?: string;
	date?: string;
	tags?: string[];
	image?: string;
}

export function BlogPostHeader({
	title = "",
	subtitle = "",
	date = "",
	tags = [],
	image = "",
}: BlogPostHeaderProps) {
	const [viewMode, setViewMode] = useState<"visual" | "yaml">("visual");
	const [liked, setLiked] = useState(false);
	const [shared, setShared] = useState(false);

	// Generate a deterministic but very realistic 7-character commit SHA based on title
	const commitSha = useMemo(() => {
		let hash = 0;
		for (let i = 0; i < (title || "").length; i++) {
			hash = (title || "").charCodeAt(i) + ((hash << 5) - hash);
		}
		const sha = Math.abs(hash).toString(16).substring(0, 7);
		return sha.padStart(7, "a");
	}, [title]);

	// Calculate fake yet stable byte size based on text length
	const docSizeKB = useMemo(() => {
		const baseSize = (
			(title?.length || 0) +
			(subtitle?.length || 0) +
			((tags || []).join("").length || 0)
		) * 12;
		return (baseSize / 1024 + 4.2).toFixed(1);
	}, [title, subtitle, tags]);

	const handleShare = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setShared(true);
			setTimeout(() => setShared(false), 2000);
		} catch (err) {
			console.error("Clipboard copy failed", err);
		}
	};

	return (
		<header className="mb-12 mt-4 md:mt-6">
			{/* Simulated Shell Path */}
			<div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-500 font-mono mb-4 px-1 overflow-hidden min-w-0 select-none">
				<Terminal className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
				<span className="opacity-60 shrink-0">~</span>
				<span className="text-zinc-600 shrink-0">/</span>
				<span className="text-zinc-400 shrink-0 hidden sm:inline">portfolio</span>
				<span className="text-zinc-600 shrink-0 hidden sm:inline">/</span>
				<span className="text-zinc-400 shrink-0 hidden sm:inline">blogs</span>
				<span className="text-zinc-450 shrink-0 sm:hidden">...</span>
				<span className="text-zinc-600 shrink-0">/</span>
				<span className="text-emerald-400 font-medium truncate min-w-0">
					{(title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "untitled"}.mdx
				</span>
			</div>

			{/* IDE Pane Container */}
			<div className="border border-zinc-800 bg-zinc-950/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
				{/* Tab Bar / Header Control */}
				<div className="flex items-center justify-between gap-3 px-4 py-3 bg-zinc-900/60 border-b border-zinc-850 select-none">
					{/* Window control dots */}
					<div className="hidden sm:flex items-center gap-2 shrink-0">
						<span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/30" />
						<span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/30" />
						<span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/30" />
					</div>

					{/* IDE Active Tab */}
					<div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-950 border border-zinc-850 rounded-lg text-xs font-mono text-zinc-300 min-w-0 max-w-[150px] sm:max-w-xs overflow-hidden">
						<FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
						<span className="truncate min-w-0">{(title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "untitled"}.mdx</span>
						<span className="text-[10px] text-zinc-600 hover:text-rose-400 transition-colors ml-1 cursor-pointer shrink-0">×</span>
					</div>

					{/* Mode Toggles */}
					<div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-850 shrink-0">
						<button
							onClick={() => setViewMode("yaml")}
							className={`flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-mono font-medium transition-all cursor-pointer ${
								viewMode === "yaml"
									? "bg-zinc-850 text-emerald-400 font-bold"
									: "text-zinc-500 hover:text-zinc-300"
							}`}
							title="View YAML Frontmatter"
						>
							<Code className="w-3 h-3" />
							<span>YAML</span>
						</button>
						<button
							onClick={() => setViewMode("visual")}
							className={`flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-mono font-medium transition-all cursor-pointer ${
								viewMode === "visual"
									? "bg-zinc-850 text-emerald-400 font-bold"
									: "text-zinc-500 hover:text-zinc-300"
							}`}
							title="View Formatted Info"
						>
							<Eye className="w-3 h-3" />
							<span>PREVIEW</span>
						</button>
					</div>
				</div>

				{/* Panel Content Area */}
				<div className="p-6 font-mono">
					<AnimatePresence mode="wait">
						{viewMode === "yaml" ? (
							<motion.div
								key="yaml"
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -5 }}
								transition={{ duration: 0.2 }}
								className="text-xs sm:text-sm leading-relaxed overflow-x-auto selection:bg-emerald-500/20"
							>
								{/* Syntax Highlighted YAML Rendering */}
								<pre className="text-zinc-400 whitespace-pre">
									<span className="text-zinc-600">---</span>{"\n"}
									<span className="text-zinc-500">title</span>: <span className="text-emerald-400">&quot;{title}&quot;</span>{"\n"}
									<span className="text-zinc-500">subtitle</span>: <span className="text-zinc-300">&quot;{subtitle}&quot;</span>{"\n"}
									<span className="text-zinc-500">date</span>: <span className="text-amber-400">&quot;{date}&quot;</span>{"\n"}
									<span className="text-zinc-500">commit</span>: <span className="text-purple-400">&quot;{commitSha}&quot;</span>{"\n"}
									<span className="text-zinc-500">status</span>: <span className="text-teal-400">&quot;STABLE_BUILD&quot;</span>{"\n"}
									<span className="text-zinc-500">read_time</span>: <span className="text-sky-400">&quot;4 min&quot;</span>{"\n"}
									<span className="text-zinc-500">size</span>: <span className="text-orange-400">&quot;{docSizeKB} KB&quot;</span>{"\n"}
									<span className="text-zinc-500">tags</span>: [<span className="text-emerald-500">{(tags || []).map(t => `&quot;${t}&quot;`).join(", ")}</span>]{"\n"}
									<span className="text-zinc-600">---</span>
								</pre>
							</motion.div>
						) : (
							<motion.div
								key="visual"
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -5 }}
								transition={{ duration: 0.2 }}
								className="flex flex-col gap-6"
							>
								{/* GUI Telemetry View */}
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
									<div className="p-2.5 sm:p-3.5 bg-zinc-900/40 rounded-xl border border-zinc-850 flex flex-col gap-1">
										<span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Commit SHA</span>
										<span className="text-xs sm:text-sm text-purple-400 font-bold truncate">{commitSha}</span>
									</div>
									<div className="p-2.5 sm:p-3.5 bg-zinc-900/40 rounded-xl border border-zinc-850 flex flex-col gap-1">
										<span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Build Status</span>
										<span className="text-xs sm:text-sm text-emerald-400 flex items-center gap-1.5 font-bold">
											<span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
											STABLE
										</span>
									</div>
									<div className="p-2.5 sm:p-3.5 bg-zinc-900/40 rounded-xl border border-zinc-850 flex flex-col gap-1">
										<span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">File Weight</span>
										<span className="text-xs sm:text-sm text-orange-400 font-bold">{docSizeKB} KB</span>
									</div>
									<div className="p-2.5 sm:p-3.5 bg-zinc-900/40 rounded-xl border border-zinc-850 flex flex-col gap-1">
										<span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Read Speed</span>
										<span className="text-xs sm:text-sm text-sky-400 font-bold truncate">4 Min Read</span>
									</div>
								</div>

								<div className="border-t border-zinc-900/80 pt-4">
									<h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white font-sans leading-tight mb-2">
										{title}
									</h2>
									<p className="text-sm text-zinc-400 font-sans leading-relaxed">
										{subtitle}
									</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* IDE Action Bar / Bottom Toolbar */}
					<div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-zinc-900">
						{/* Metadata badges */}
						<div className="flex flex-wrap gap-1.5">
							{(tags || []).map((tag) => (
								<span
									key={tag}
									className="px-2 py-0.5 text-[10px] text-zinc-400 bg-zinc-900/80 border border-zinc-850 rounded hover:border-emerald-500/35 transition-colors cursor-default"
								>
									#{(tag || "").toLowerCase()}
								</span>
							))}
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-3">
							{/* Timestamp/Date */}
							<div className="flex items-center gap-1.5 text-xs text-zinc-500 mr-2">
								<Calendar className="w-3.5 h-3.5 text-zinc-600" />
								<span>{date}</span>
							</div>

							<div className="h-4 w-px bg-zinc-900 hidden sm:block" />

							{/* Actions */}
							<div className="flex gap-2">
								<button
									onClick={() => setLiked(!liked)}
									className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all cursor-pointer ${
										liked
											? "border-rose-500/30 bg-rose-950/20 text-rose-400"
											: "border-zinc-850 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800"
									}`}
									title="Bookmark"
								>
									<Heart className={`w-3.5 h-3.5 ${liked ? "fill-rose-400" : ""}`} />
								</button>
								<button
									onClick={handleShare}
									className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all cursor-pointer ${
										shared
											? "border-emerald-500/30 bg-emerald-950/25 text-emerald-400"
											: "border-zinc-850 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800"
									}`}
									title="Copy Link"
								>
									{shared ? <Check className="w-3.5 h-3.5" /> : <Share className="w-3.5 h-3.5" />}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Decorative grid pattern separator */}
			<div className="w-full h-1 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_70%)] mt-12 mb-1" />
		</header>
	);
}

