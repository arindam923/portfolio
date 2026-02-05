"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/framer";
import Image from "next/image";
import { MessageCircleCode, Heart, Share } from "lucide-react";

interface BlogPostHeaderProps {
	title: string;
	subtitle: string;
	date: string;
	tags: string[];
	image: string;
}

export function BlogPostHeader({
	title,
	subtitle,
	date,
	tags,
	image,
}: BlogPostHeaderProps) {
	return (
		<motion.header
			className="mb-12"
			variants={staggerContainer}
			initial="initial"
			animate="animate"
		>
			<motion.div className="w-full h-[500px] relative mb-12">
				<Image
					className="object-cover rounded-lg"
					src={image as string}
					fill
					alt=""
				/>
			</motion.div>
			<motion.div className="flex flex-wrap gap-2 mb-6" variants={fadeInUp}>
				{tags.map((tag, index) => (
					<motion.span
						key={tag}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							delay: 0.4 + index * 0.05,
							type: "spring",
							stiffness: 200,
						}}
						whileHover={{ scale: 1.05 }}
						className="px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-default hover:bg-zinc-300 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors"
					>
						{tag}
					</motion.span>
				))}
			</motion.div>

			<motion.h1
				className="text-4xl sm:text-6xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight leading-tight"
				variants={fadeInUp}
				transition={{ delay: 0.2 }}
			>
				{title}
			</motion.h1>

			<motion.p
				className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed"
				variants={fadeInUp}
				transition={{ delay: 0.3 }}
			>
				{subtitle}
			</motion.p>

			<motion.div
				className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-zinc-200 dark:border-zinc-800/50"
				variants={fadeInUp}
				transition={{ delay: 0.4 }}
			>
				<div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-500">
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
					<span>{date}</span>
					<span className="text-zinc-400 dark:text-zinc-600">•</span>
					<span>4 min read</span>
				</div>

				<div className="flex items-center gap-3">
					{[
						{ icon: "heart", count: "167", fill: true },
						{ icon: "clap", count: "166", fill: true },
					].map((item, index) => (
						<motion.button
							key={item.icon}
							type="button"
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 + index * 0.1 }}
							className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
						>
							{item.icon === "heart" && <Heart />}
							{item.icon === "clap" && <MessageCircleCode />}
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
						className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
					>
						<Share />
						Share
					</motion.button>
				</div>
			</motion.div>
		</motion.header>
	);
}
