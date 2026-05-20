"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
	Terminal,
	Layers,
	Calendar,
	ArrowUpRight,
	Activity,
	Hash,
	Filter,
	FileText,
	Clock
} from "lucide-react";
import type { BlogPost } from "@/lib/blogs";

interface BlogListContainerProps {
	posts: BlogPost[];
}

export default function BlogListContainer({ posts }: BlogListContainerProps) {
	const [selectedTag, setSelectedTag] = useState<string | null>(null);

	// Get tags and their counts
	const tagCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		posts.forEach((post) => {
			post.tag.forEach((t) => {
				counts[t] = (counts[t] || 0) + 1;
			});
		});
		return counts;
	}, [posts]);

	const sortedTags = useMemo(() => {
		return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
	}, [tagCounts]);

	// Filtered posts based on active tag
	const filteredPosts = useMemo(() => {
		if (!selectedTag) return posts;
		return posts.filter((post) => post.tag.includes(selectedTag));
	}, [posts, selectedTag]);

	// Latest post's SHA for terminal telemetry
	const latestPostSha = useMemo(() => {
		if (posts.length === 0) return "8c2f109";
		let hash = 0;
		const title = posts[0].title;
		for (let i = 0; i < title.length; i++) {
			hash = title.charCodeAt(i) + ((hash << 5) - hash);
		}
		return Math.abs(hash).toString(16).substring(0, 7).padEnd(7, "b");
	}, [posts]);

	return (
		<div className="w-full flex flex-col gap-8 sm:gap-12 font-mono">
			{/* Diagnostics HUD Terminal Header */}
			<section className="border border-zinc-800 bg-zinc-950/60 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
				{/* Terminal Header Bar */}
				<div className="flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-2.5 bg-zinc-900/60 border-b border-zinc-800 select-none gap-3">
					<div className="flex items-center gap-1.5 font-mono min-w-0">
						<Terminal className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
						<span className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-wider truncate">
							System Console - Diagnostic HUD
						</span>
					</div>
					<div className="hidden sm:flex items-center gap-1.5 shrink-0">
						<span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 border border-rose-600/30" />
						<span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 border border-amber-600/30" />
						<span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 border border-emerald-600/30" />
					</div>
				</div>

				{/* Terminal Content Screen */}
				<div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed text-zinc-400">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4 border-b border-zinc-900 pb-4">
						<div className="flex items-center justify-between">
							<span className="text-zinc-600">SYS.HOST:</span>
							<span className="text-zinc-200">arind.space</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-zinc-600">SYS.ENV:</span>
							<span className="text-zinc-200 flex items-center gap-1.5">
								<span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
								production
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-zinc-600">SYS.MODULES:</span>
							<span className="text-zinc-200">{posts.length} compiled blocks</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-zinc-600">SYS.KERNEL:</span>
							<span className="text-zinc-200">Next.js 16.x (v8)</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-zinc-600">SYS.SHELL:</span>
							<span className="text-zinc-200">zsh/portfolio-cli</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-zinc-600">LATEST_COMMIT:</span>
							<span className="text-purple-400 font-bold">{latestPostSha}</span>
						</div>
					</div>

					<div className="text-emerald-400/80 select-none">
						<span>$ portfolio-cli --fetch-logs --active-topics</span>
						<br />
						<span className="text-zinc-500">Retrieving technical journals... OK</span>
					</div>
				</div>
			</section>

			{/* Filterable Tag Config Pills */}
			<section className="flex flex-col gap-4">
				<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-600 px-1 font-mono">
					<Filter className="w-3.5 h-3.5 text-emerald-500/80" />
					<span>SELECT COMPILER TARGETS:</span>
				</div>

				<div className="flex flex-wrap gap-2">
					{/* ALL Posts Toggle Pill */}
					<button
						onClick={() => setSelectedTag(null)}
						className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-[10px] sm:text-[11px] font-mono font-medium transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
							selectedTag === null
								? "bg-emerald-950/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-bold"
								: "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800"
						}`}
					>
						<Layers className="w-3 h-3 shrink-0" />
						<span>ALL_MODULES</span>
						<span className="opacity-40">({posts.length})</span>
					</button>

					{/* Tag Specific Pills */}
					{sortedTags.map(([tag, count]) => (
						<button
							key={tag}
							onClick={() => setSelectedTag(tag)}
							className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-[10px] sm:text-[11px] font-mono font-medium transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
								selectedTag === tag
									? "bg-emerald-950/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-bold"
									: "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800"
							}`}
						>
							<Hash className="w-3 h-3 shrink-0" />
							<span>{tag.toUpperCase()}</span>
							<span className="opacity-40">({count})</span>
						</button>
					))}
				</div>
			</section>

			{/* Decorative dynamic compiler status */}
			<div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2 border-y border-zinc-900/60 font-mono text-[9px] sm:text-[10px] text-zinc-500 select-none">
				<Activity className="w-3.5 h-3.5 text-emerald-500/70 animate-pulse shrink-0" />
				<span>LISTING ACTIVE:</span>
				<span className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 shrink-0">
					{selectedTag ? `${selectedTag.toUpperCase()}_LOGS` : "ALL_LOGS"}
				</span>
				<span>COUNT: {filteredPosts.length}</span>
			</div>

			{/* Compiled Posts Module List */}
			<section className="flex flex-col gap-6">
				<motion.div layout className="flex flex-col gap-6">
					<AnimatePresence mode="popLayout">
						{filteredPosts.map((blog, idx) => {
							// Unique deterministic hash for this blog
							let hVal = 0;
							for (let k = 0; k < blog.title.length; k++) {
								hVal = blog.title.charCodeAt(k) + ((hVal << 5) - hVal);
							}
							const hashString = Math.abs(hVal).toString(16).substring(0, 7).padEnd(7, "c");
							const sizeKB = ((blog.title.length + blog.description.length) * 11 / 1024 + 3.8).toFixed(1);

							return (
								<motion.div
									key={blog.slug}
									layout
									initial={{ opacity: 0, scale: 0.98 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.98 }}
									transition={{ duration: 0.25, delay: idx * 0.03 }}
									className="group"
								>
									<Link
										href={`/blog/${blog.slug}`}
										className="block bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 sm:p-5 hover:border-emerald-500/40 hover:bg-zinc-950/80 transition-all duration-300 no-underline relative overflow-hidden shadow-sm"
									>
										{/* Highlighted active scan line on hover */}
										<div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

										{/* Telemetry Bar Header */}
										<div className="flex items-center justify-between gap-4 border-b border-zinc-900 pb-3 mb-4 font-mono text-[10px] text-zinc-500 min-w-0">
											<div className="flex items-center gap-2 min-w-0">
												<FileText className="w-3.5 h-3.5 text-zinc-600 group-hover:text-emerald-500 transition-colors shrink-0" />
												<span className="font-semibold text-zinc-400 tracking-wider truncate min-w-0 text-[9px] sm:text-[10px]">
													~/blogs/{blog.slug}.mdx
												</span>
											</div>
											<div className="flex items-center gap-3 shrink-0">
												<span className="hidden sm:inline bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
													HASH: {hashString}
												</span>
												<span className="hidden sm:inline bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
													{sizeKB} KB
												</span>
											</div>
										</div>

										{/* Content */}
										<div className="flex flex-col gap-2">
											<div className="flex items-start justify-between gap-4">
												<h3 className="text-base sm:text-lg font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors leading-snug font-display">
													{blog.title}
												</h3>
												<div className="w-7 h-7 rounded-lg border border-zinc-900 flex items-center justify-center text-zinc-600 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all shrink-0">
													<ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
												</div>
											</div>

											<p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl font-sans mt-1">
												{blog.description}
											</p>

											{/* Module status bar footer */}
											<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-zinc-900/60 pt-3.5 mt-3 text-[10px]">
												{/* Tech tags */}
												<div className="flex flex-wrap gap-1.5 max-w-full">
													{blog.tag.map((tag: string) => (
														<span
															key={tag}
															className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono text-zinc-400 bg-zinc-900/50 border border-zinc-800/80 rounded uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-950/10 select-none"
														>
															<span className="text-emerald-500/50 font-bold">#</span>
															{tag}
														</span>
													))}
												</div>

												{/* Read time and date */}
												<div className="flex items-center gap-3 sm:gap-4 text-zinc-500 font-mono text-[9px] sm:text-[10px] shrink-0 mt-0.5 sm:mt-0">
													<span className="flex items-center gap-1 shrink-0">
														<Calendar className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
														{blog.date}
													</span>
													<span className="flex items-center gap-1 shrink-0">
														<Clock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
														{blog.readTime}
													</span>
												</div>
											</div>
										</div>
									</Link>
								</motion.div>
							);
						})}
					</AnimatePresence>
				</motion.div>
			</section>
		</div>
	);
}
