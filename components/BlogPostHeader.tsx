"use client";

import Image from "next/image";
import { Heart, Share, Calendar } from "lucide-react";

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
		<header className="mb-12 mt-16 md:mt-24">
			<div className="flex items-center gap-3 text-zinc-500 font-mono text-sm mb-6">
				<Calendar className="w-4 h-4" />
				<time>{date}</time>
				<span className="text-zinc-700 mx-2">/</span>
				<span>4 min read</span>
			</div>

			<h1 className="text-3xl sm:text-5xl font-semibold text-white mb-6 tracking-tight leading-[1.1]">
				{title}
			</h1>

			{subtitle && (
				<p className="text-lg md:text-xl text-zinc-400 mb-8 leading-relaxed max-w-2xl font-medium">
					{subtitle}
				</p>
			)}

			<div className="flex items-center justify-between py-6 border-y border-zinc-800/80 mb-10">
				<div className="flex flex-wrap gap-2">
					{tags.map((tag) => (
						<span
							key={tag}
							className="px-2.5 py-1 text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg cursor-default"
						>
							{tag}
						</span>
					))}
				</div>

				<div className="flex items-center gap-3">
					<button
						type="button"
						className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
						title="Like"
					>
						<Heart className="w-4 h-4" />
					</button>
					<button
						type="button"
						className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
						title="Share"
					>
						<Share className="w-4 h-4" />
					</button>
				</div>
			</div>

			{image && (
				<div className="w-full aspect-[2/1] relative mb-12 rounded-3xl overflow-hidden border border-zinc-800/80 bg-zinc-900">
					<div className="absolute inset-0 bg-black/5 z-10" />
					<Image
						className="object-cover"
						src={image}
						fill
						alt={title}
						priority
						unoptimized
					/>
				</div>
			)}
		</header>
	);
}
