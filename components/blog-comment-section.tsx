"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface Comment {
	id: string;
	author: string;
	avatar: string;
	content: string;
	date: string;
	likes: number;
	replies?: Comment[];
}
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

const BlogCommentSection = () => {
	const [isCommentsOpen, setIsCommentsOpen] = useState(false);
	const [commentText, setCommentText] = useState("");

	return (
		<motion.section
			className="mt-20 pt-12 border-t border-zinc-200 dark:border-zinc-800"
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
		>
			<div className="flex items-center justify-between mb-8">
				<h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
					Comments
					<motion.span
						className="px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-900 text-sm text-zinc-600 dark:text-zinc-400 font-normal"
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
					className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
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
							className="mb-8 p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.1 }}
						>
							<div className="flex gap-4">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
									You
								</div>
								<div className="flex-1">
									<textarea
										value={commentText}
										onChange={(e) => setCommentText(e.target.value)}
										placeholder="Add to the discussion..."
										className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none min-h-[100px]"
									/>
									<div className="flex justify-end mt-3 gap-3">
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => setCommentText("")}
											className="px-4 py-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm"
										>
											Cancel
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											disabled={!commentText.trim()}
											className="px-6 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
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
											className="w-10 h-10 rounded-full bg-zinc-300 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-700 dark:text-zinc-200 flex-shrink-0"
											whileHover={{ scale: 1.1, rotate: 5 }}
										>
											{comment.avatar}
										</motion.div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<span className="font-semibold text-zinc-900 dark:text-white">
													{comment.author}
												</span>
												<span className="text-zinc-400 dark:text-zinc-500 text-sm">•</span>
												<span className="text-zinc-500 text-sm">
													{comment.date}
												</span>
											</div>
											<p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
												{comment.content}
											</p>
											<div className="flex items-center gap-4">
												<motion.button
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
													className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm"
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
													className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm"
												>
													Reply
												</motion.button>
											</div>

											{/* Replies */}
											{comment.replies && (
												<div className="mt-4 ml-4 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-4">
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
															<div className="w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-200 flex-shrink-0">
																{reply.avatar}
															</div>
															<div className="flex-1">
																<div className="flex items-center gap-2 mb-1">
																	<span className="font-semibold text-zinc-900 dark:text-white text-sm">
																		{reply.author}
																	</span>
																	<span className="text-zinc-500 text-xs">
																		•
																	</span>
																	<span className="text-zinc-500 text-xs">
																		{reply.date}
																	</span>
																</div>
																<p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-2">
																	{reply.content}
																</p>
																<button
																	type="button"
																	className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-xs"
																>
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
						className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900/50 transition-colors"
						onClick={() => setIsCommentsOpen(true)}
					>
						<div className="flex -space-x-2">
							{mockComments.slice(0, 3).map((comment, i) => (
								<motion.div
									key={comment.id}
									initial={{ scale: 0, x: -10 }}
									animate={{ scale: 1, x: 0 }}
									transition={{ delay: i * 0.1 }}
									className="w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-200"
								>
									{comment.avatar}
								</motion.div>
							))}
							{mockComments.length > 3 && (
								<div className="w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-xs text-zinc-500 dark:text-zinc-400">
									+{mockComments.length - 3}
								</div>
							)}
						</div>
						<p className="text-zinc-600 dark:text-zinc-400 text-sm">
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
	);
};

export default BlogCommentSection;
