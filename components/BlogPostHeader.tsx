"use client";

import { useState, useMemo } from "react";
import { Heart, Share, Calendar, Check, Terminal, FileText, Clock, GitCommit } from "lucide-react";

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
}: BlogPostHeaderProps) {
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
			{/* Simulated Shell Path - Minimal Tech Detail */}
			<div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground/60 font-mono mb-6 px-0.5 select-none">
				<Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0" />
				<span className="opacity-60">~</span>
				<span>/</span>
				<span>blog</span>
				<span>/</span>
				<span className="text-emerald-600 dark:text-emerald-400 font-medium truncate">
					{(title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "untitled"}.mdx
				</span>
			</div>

			{/* Main Title & Subtitle styled like the main Blog listing page */}
			<div className="space-y-4 mb-8">
				<h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground font-display leading-[1.1] selection:bg-emerald-500/20">
					{title}
				</h1>
				{subtitle && (
					<p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base md:text-lg max-w-3xl font-sans leading-relaxed selection:bg-emerald-500/20">
						{subtitle}
					</p>
				)}
			</div>

			{/* Metadata and Actions Row */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-y border-zinc-100 dark:border-zinc-900 font-mono text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 select-none">
				{/* Informative Stats */}
				<div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
					<div className="flex items-center gap-1.5">
						<Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500/80" />
						<span>{date}</span>
					</div>
					<span className="text-zinc-300 dark:text-zinc-800 hidden xs:inline">|</span>
					<div className="flex items-center gap-1.5">
						<Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500/80" />
						<span>4 Min Read</span>
					</div>
					<span className="text-zinc-300 dark:text-zinc-800 hidden sm:inline">|</span>
					<div className="flex items-center gap-1.5">
						<FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500/80" />
						<span>{docSizeKB} KB</span>
					</div>
					<span className="text-zinc-300 dark:text-zinc-800 hidden md:inline">|</span>
					<div className="flex items-center gap-1.5">
						<GitCommit className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500/80" />
						<span className="text-zinc-400 dark:text-zinc-500">{commitSha}</span>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="flex items-center gap-2">
					<button
						onClick={() => setLiked(!liked)}
						className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
							liked
								? "border-rose-200 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/10 text-rose-600 dark:text-rose-400"
								: "border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/20 dark:hover:border-rose-500/20"
						}`}
						title="Bookmark post"
					>
						<Heart className={`w-3.5 h-3.5 transition-transform duration-300 active:scale-125 ${liked ? "fill-rose-600 dark:fill-rose-400 text-rose-600 dark:text-rose-400" : ""}`} />
						<span className="text-[10px] font-bold tracking-wider">
							{liked ? "SAVED" : "SAVE"}
						</span>
					</button>

					<button
						onClick={handleShare}
						className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
							shared
								? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/15 text-emerald-600 dark:text-emerald-400"
								: "border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/20 dark:hover:border-emerald-500/20"
						}`}
						title="Copy share link"
					>
						{shared ? <Check className="w-3.5 h-3.5" /> : <Share className="w-3.5 h-3.5" />}
						<span className="text-[10px] font-bold tracking-wider">
							{shared ? "COPIED" : "SHARE"}
						</span>
					</button>
				</div>
			</div>

			{/* Tags display */}
			{tags && tags.length > 0 && (
				<div className="flex flex-wrap gap-1.5 mt-4">
					{tags.map((tag) => (
						<span
							key={tag}
							className="px-2.5 py-0.5 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 rounded-md hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default"
						>
							#{tag.toLowerCase()}
						</span>
					))}
				</div>
			)}
		</header>
	);
}
