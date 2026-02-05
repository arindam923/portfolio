"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
	motion,
	useScroll,
	useSpring,
	AnimatePresence,
	useTransform,
} from "framer-motion";
import { fadeInUp, scaleIn, staggerContainer } from "@/lib/framer";

interface BlogPost {
	id: string;
	title: string;
	subtitle: string;
	date: string;
	tags: string[];
	image: string;
}

interface Comment {
	id: string;
	author: string;
	avatar: string;
	content: string;
	date: string;
	likes: number;
	replies?: Comment[];
}

const blogData: Record<string, BlogPost> = {
	"1": {
		id: "1",
		title: "How to optimise a Next.js web app",
		subtitle: "Optimise your Next.js web app to make it lightning fast!",
		date: "January 31, 2026",
		tags: ["Frontend", "Next.Js", "JavaScript", "Development"],
		image: "linear-gradient(to bottom right, #1e40af, #3b82f6)",
	},
	"2": {
		id: "2",
		title: "What is taste and how can you develop it?",
		subtitle: "Understanding what is taste, resources and how to practice",
		date: "December 7, 2025",
		tags: ["Frontend", "Design", "Product"],
		image: "linear-gradient(to bottom right, #f8fafc, #cbd5e1)",
	},
};

const mockComments: Comment[] = [
	{
		id: "1",
		author: "Sarah Chen",
		avatar: "SC",
		content:
			"This is exactly what I needed! The part about LCP optimization really helped improve our site's performance. Thanks for sharing these insights.",
		date: "2 hours ago",
		likes: 24,
		replies: [
			{
				id: "1-1",
				author: "Alex Rivera",
				avatar: "AR",
				content:
					"Totally agree! I implemented the image optimization tips and saw immediate improvements.",
				date: "1 hour ago",
				likes: 8,
			},
		],
	},
	{
		id: "2",
		author: "Marcus Johnson",
		avatar: "MJ",
		content:
			"Great write-up! Would love to see a follow-up on server components specifically.",
		date: "5 hours ago",
		likes: 15,
	},
	{
		id: "3",
		author: "Emma Wilson",
		avatar: "EW",
		content:
			"The section about caching strategies was particularly useful. Keep up the good work!",
		date: "1 day ago",
		likes: 32,
	},
];

export default function BlogDetailPage() {
	const params = useParams();
	const id = params.id as string;
	const blog = blogData[id] || blogData["1"];

	const [isCommentsOpen, setIsCommentsOpen] = useState(false);
	const [commentText, setCommentText] = useState("");

	const { scrollYProgress } = useScroll();
	const smoothProgress = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	const [_, setIsLoaded] = useState(false);

	const rotateProgress = useTransform(smoothProgress, [0, 1], [0, 360]);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={id}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5 }}
				className="min-h-screen bg-black text-white selection:bg-white/10 pb-32"
			>
				{/* Progress Bar */}
				<div className="fixed top-0 left-0 w-full h-[2px] bg-zinc-900 z-50">
					<motion.div
						className="h-full bg-blue-500"
						style={{
							scaleX: smoothProgress,
							transformOrigin: "0%",
						}}
					/>
				</div>

				<main className="max-w-4xl mx-auto px-6 py-20">
					{/* Top Navigation */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						<Link
							href="/"
							className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group"
						>
							<motion.svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								role="img"
								aria-hidden="true"
								whileHover={{ x: -4 }}
								transition={{ type: "spring", stiffness: 400 }}
							>
								<title>Back arrow</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M15 19l-7-7 7-7"
								/>
							</motion.svg>
							Back to Home
						</Link>
					</motion.div>

					{/* Hero Image */}
					<motion.div
						variants={scaleIn}
						initial="initial"
						animate="animate"
						className="w-full h-[300px] sm:h-[400px] rounded-3xl mb-12 relative overflow-hidden flex items-center justify-center"
						style={{ background: blog.image }}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.8, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={{
								delay: 0.3,
								duration: 0.8,
								type: "spring",
								stiffness: 100,
							}}
						>
							{blog.id === "1" && (
								<div className="bg-white text-black px-8 py-4 rounded-2xl font-black text-4xl shadow-2xl flex items-center gap-3">
									<svg
										viewBox="0 0 24 24"
										className="w-10 h-10 fill-current"
										role="img"
										aria-hidden="true"
									>
										<title>Next.js Logo</title>
										<path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z" />
									</svg>
									NEXT.JS
								</div>
							)}
							{blog.id === "2" && (
								<div className="text-black text-6xl font-black tracking-tighter text-center">
									TASTE
								</div>
							)}
						</motion.div>
					</motion.div>

					{/* Header */}
					<motion.header
						className="mb-12"
						variants={staggerContainer}
						initial="initial"
						animate="animate"
					>
						<motion.div
							className="flex flex-wrap gap-2 mb-6"
							variants={fadeInUp}
						>
							{blog.tags.map((tag, index) => (
								<motion.span
									key={tag}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{
										delay: 0.4 + index * 0.05,
										type: "spring",
										stiffness: 200,
									}}
									whileHover={{
										scale: 1.05,
										backgroundColor: "rgba(63, 63, 70, 1)",
										borderColor: "rgba(82, 82, 91, 1)",
									}}
									className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 cursor-default"
								>
									{tag}
								</motion.span>
							))}
						</motion.div>

						<motion.h1
							className="text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight leading-tight"
							variants={fadeInUp}
							transition={{ delay: 0.2 }}
						>
							{blog.title}
						</motion.h1>

						<motion.p
							className="text-xl text-zinc-400 mb-8 leading-relaxed"
							variants={fadeInUp}
							transition={{ delay: 0.3 }}
						>
							{blog.subtitle}
						</motion.p>

						<motion.div
							className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-zinc-800/50"
							variants={fadeInUp}
							transition={{ delay: 0.4 }}
						>
							<div className="flex items-center gap-3 text-zinc-500">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-hidden="true"
								>
									<title>Calendar icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								<span>{blog.date}</span>
								<span className="text-zinc-800">•</span>
								<span>4 min read</span>
							</div>

							<div className="flex items-center gap-3">
								{[
									{ icon: "heart", count: "167", fill: true },
									{ icon: "clap", count: "166", fill: true },
									{
										icon: "comment",
										count: mockComments.length.toString(),
										fill: false,
									},
								].map((item, index) => (
									<motion.button
										key={item.icon}
										type="button"
										whileHover={{ scale: 1.05, y: -2 }}
										whileTap={{ scale: 0.95 }}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.5 + index * 0.1 }}
										onClick={() =>
											item.icon === "comment" && setIsCommentsOpen(true)
										}
										className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
									>
										{item.icon === "heart" && (
											<svg
												className="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
											</svg>
										)}
										{item.icon === "clap" && (
											<svg
												className="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M19 8.5c0-.83-.67-1.5-1.5-1.5h-4.3c.06-.32.1-.65.1-1 0-1.66-1.34-3-3-3-.45 0-.85.1-1.21.28L6.47 5.92c-.28.14-.47.43-.47.76V14c0 .41.34.75.75.75h1.22l1.66 4.3c.18.47.64.78 1.14.78h4c.69 0 1.25-.56 1.25-1.25V17c0-.28-.22-.5-.5-.5H13v-1h4.5c.83 0 1.5-.67 1.5-1.5v-1c0-.4-.16-.76-.41-1.03.41-.27.66-.73.66-1.22v-1.25c0-.49-.25-.95-.66-1.22.25-.27.41-.63.41-1.03v-1z" />
											</svg>
										)}
										{item.icon === "comment" && (
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
												/>
											</svg>
										)}
										{item.count}
									</motion.button>
								))}

								<motion.button
									type="button"
									whileHover={{ scale: 1.05, y: -2 }}
									whileTap={{ scale: 0.95 }}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.8 }}
									className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
										/>
									</svg>
									Share
								</motion.button>
							</div>
						</motion.div>
					</motion.header>

					{/* Article Content */}
					<motion.article
						className="prose prose-invert max-w-none text-zinc-300 space-y-8 text-lg leading-relaxed"
						initial="initial"
						animate="animate"
						variants={{
							initial: {},
							animate: {
								transition: {
									staggerChildren: 0.15,
									delayChildren: 0.6,
								},
							},
						}}
					>
						<motion.p variants={fadeInUp}>
							So in this blog, I&apos;m going to talk about React&apos;s and
							Next. Js best practices. This blog will contain landing page and
							functional both types of optimisations.
						</motion.p>

						<motion.p variants={fadeInUp}>
							Let&apos;s get started, but before, let me mention common terms
							that will be used in this blog.
						</motion.p>

						<motion.ol
							className="space-y-4 list-decimal pl-6"
							variants={{
								animate: {
									transition: {
										staggerChildren: 0.1,
									},
								},
							}}
						>
							{[
								"First Contentful Paint (FCP)",
								"Largest Contentful Paint (LCP)",
								"First Input delay (FID)",
							].map((term) => (
								<motion.li
									key={term}
									variants={fadeInUp}
									whileHover={{ x: 4 }}
									transition={{ type: "spring", stiffness: 300 }}
								>
									<span className="font-bold text-white cursor-pointer hover:underline inline-flex items-center gap-2 group">
										{term}
										<motion.svg
											className="w-4 h-4 text-zinc-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											initial={{ opacity: 0, x: -10 }}
											whileInView={{ opacity: 1, x: 0 }}
											whileHover={{ scale: 1.2, color: "#3b82f6" }}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 010-5.656l4-4a4 4 0 015.656 5.656l-1.1 1.1"
											/>
										</motion.svg>
									</span>
								</motion.li>
							))}
						</motion.ol>

						<motion.p variants={fadeInUp}>
							Google uses metrics (web vitals) to rank a website on search
							pages. You can use tools like{" "}
							<motion.span
								className="font-bold text-white cursor-pointer hover:underline inline-flex items-center gap-1 group"
								whileHover={{ scale: 1.02 }}
							>
								pagespeed analytics tool
								<svg
									className="w-3.5 h-3.5 text-zinc-600 group-hover:text-blue-500 transition-colors"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 010-5.656l4-4a4 4 0 015.656 5.656l-1.1 1.1"
									/>
								</svg>
							</motion.span>{" "}
							to check core web vitals of any web page.
						</motion.p>

						<motion.div
							className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800"
							variants={fadeInUp}
							whileHover={{
								scale: 1.01,
								borderColor: "rgba(63, 63, 70, 1)",
								transition: { duration: 0.2 },
							}}
						>
							<h3 className="text-xl font-bold text-white mb-4">Summary</h3>
							<p className="text-zinc-400">
								In this deep dive, we explore how to optimize your Next.js
								application using image optimization, server-side rendering
								patterns, and advanced caching libraries to achieve a 100/100
								Lighthouse score.
							</p>
						</motion.div>
					</motion.article>

					{/* Comments Section */}
					<motion.section
						className="mt-20 pt-12 border-t border-zinc-800"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<div className="flex items-center justify-between mb-8">
							<h2 className="text-2xl font-bold text-white flex items-center gap-3">
								Comments
								<motion.span
									className="px-3 py-1 rounded-full bg-zinc-900 text-sm text-zinc-400 font-normal"
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.3, type: "spring" }}
								>
									{mockComments.length}
								</motion.span>
							</h2>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setIsCommentsOpen(!isCommentsOpen)}
								className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
							>
								{isCommentsOpen ? "Collapse" : "Expand"}
								<motion.svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									animate={{ rotate: isCommentsOpen ? 180 : 0 }}
									transition={{ duration: 0.3 }}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 9l-7 7-7-7"
									/>
								</motion.svg>
							</motion.button>
						</div>

						<AnimatePresence>
							{isCommentsOpen && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
									className="overflow-hidden"
								>
									{/* Comment Input */}
									<motion.div
										className="mb-8 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800"
										initial={{ y: 20, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{ delay: 0.1 }}
									>
										<div className="flex gap-4">
											<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
												You
											</div>
											<div className="flex-1">
												<textarea
													value={commentText}
													onChange={(e) => setCommentText(e.target.value)}
													placeholder="Add to the discussion..."
													className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none min-h-[100px]"
												/>
												<div className="flex justify-end mt-3 gap-3">
													<motion.button
														whileHover={{ scale: 1.02 }}
														whileTap={{ scale: 0.98 }}
														onClick={() => setCommentText("")}
														className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white transition-colors text-sm"
													>
														Cancel
													</motion.button>
													<motion.button
														whileHover={{ scale: 1.02 }}
														whileTap={{ scale: 0.98 }}
														disabled={!commentText.trim()}
														className="px-6 py-2 rounded-lg bg-white text-black font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors"
													>
														Post Comment
													</motion.button>
												</div>
											</div>
										</div>
									</motion.div>

									{/* Comments List */}
									<div className="space-y-6">
										{mockComments.map((comment, index) => (
											<motion.div
												key={comment.id}
												initial={{ x: -20, opacity: 0 }}
												animate={{ x: 0, opacity: 1 }}
												transition={{ delay: 0.2 + index * 0.1 }}
												className="group"
											>
												<div className="flex gap-4">
													<motion.div
														className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold flex-shrink-0"
														whileHover={{ scale: 1.1, rotate: 5 }}
													>
														{comment.avatar}
													</motion.div>
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-1">
															<span className="font-semibold text-white">
																{comment.author}
															</span>
															<span className="text-zinc-500 text-sm">•</span>
															<span className="text-zinc-500 text-sm">
																{comment.date}
															</span>
														</div>
														<p className="text-zinc-300 leading-relaxed mb-3">
															{comment.content}
														</p>
														<div className="flex items-center gap-4">
															<motion.button
																whileHover={{ scale: 1.1 }}
																whileTap={{ scale: 0.9 }}
																className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-sm"
															>
																<svg
																	className="w-4 h-4"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth="2"
																		d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
																	/>
																</svg>
																{comment.likes}
															</motion.button>
															<motion.button
																whileHover={{ scale: 1.1 }}
																whileTap={{ scale: 0.9 }}
																className="text-zinc-500 hover:text-white transition-colors text-sm"
															>
																Reply
															</motion.button>
														</div>

														{/* Replies */}
														{comment.replies && (
															<div className="mt-4 ml-4 pl-4 border-l-2 border-zinc-800 space-y-4">
																{comment.replies.map((reply, replyIndex) => (
																	<motion.div
																		key={reply.id}
																		initial={{ opacity: 0, y: 10 }}
																		animate={{ opacity: 1, y: 0 }}
																		transition={{
																			delay: 0.4 + replyIndex * 0.1,
																		}}
																		className="flex gap-3"
																	>
																		<div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
																			{reply.avatar}
																		</div>
																		<div className="flex-1">
																			<div className="flex items-center gap-2 mb-1">
																				<span className="font-semibold text-white text-sm">
																					{reply.author}
																				</span>
																				<span className="text-zinc-500 text-xs">
																					•
																				</span>
																				<span className="text-zinc-500 text-xs">
																					{reply.date}
																				</span>
																			</div>
																			<p className="text-zinc-400 text-sm leading-relaxed mb-2">
																				{reply.content}
																			</p>
																			<button className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-xs">
																				<svg
																					className="w-3 h-3"
																					fill="none"
																					stroke="currentColor"
																					viewBox="0 0 24 24"
																				>
																					<path
																						strokeLinecap="round"
																						strokeLinejoin="round"
																						strokeWidth="2"
																						d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
																					/>
																				</svg>
																				{reply.likes}
																			</button>
																		</div>
																	</motion.div>
																))}
															</div>
														)}
													</div>
												</div>
											</motion.div>
										))}
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Collapsed State Preview */}
						<AnimatePresence>
							{!isCommentsOpen && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 cursor-pointer hover:bg-zinc-900/50 transition-colors"
									onClick={() => setIsCommentsOpen(true)}
								>
									<div className="flex -space-x-2">
										{mockComments.slice(0, 3).map((comment, i) => (
											<motion.div
												key={comment.id}
												initial={{ scale: 0, x: -10 }}
												animate={{ scale: 1, x: 0 }}
												transition={{ delay: i * 0.1 }}
												className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-xs font-bold"
											>
												{comment.avatar}
											</motion.div>
										))}
										{mockComments.length > 3 && (
											<div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-xs text-zinc-400">
												+{mockComments.length - 3}
											</div>
										)}
									</div>
									<p className="text-zinc-400 text-sm">
										Join the discussion with {mockComments.length} others
									</p>
									<motion.svg
										className="w-5 h-5 text-zinc-500 ml-auto"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										animate={{ x: [0, 4, 0] }}
										transition={{ repeat: Infinity, duration: 1.5 }}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M9 5l7 7-7 7"
										/>
									</motion.svg>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.section>
				</main>

				{/* Floating Bottom Bar */}
				<motion.div
					className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-xs"
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: 1,
						duration: 0.8,
						type: "spring",
						stiffness: 100,
					}}
				>
					<motion.div
						className="bg-[#121212]/80 backdrop-blur-xl border border-zinc-800 rounded-full h-14 flex items-center px-6 justify-between shadow-2xl"
						whileHover={{
							scale: 1.02,
							borderColor: "rgba(63, 63, 70, 1)",
						}}
					>
						<div className="flex items-center gap-3 overflow-hidden">
							<motion.div
								className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"
								animate={{
									scale: [1, 1.2, 1],
									opacity: [1, 0.7, 1],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>
							<span className="text-xs font-medium text-zinc-300 truncate">
								{blog.title}
							</span>
						</div>
						<div className="flex items-center gap-1 flex-shrink-0 ml-4">
							<motion.div
								className="w-8 h-8 rounded-full border-4 border-zinc-800 border-t-blue-500"
								style={{ rotate: rotateProgress }}
							/>
						</div>
					</motion.div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
