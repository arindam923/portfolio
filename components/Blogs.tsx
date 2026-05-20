"use client";

import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/blogs";
import { ArrowUpRight } from "lucide-react";

interface BlogsProps {
	posts: BlogPost[];
}

const Blogs = ({ posts }: BlogsProps) => {
	const router = useRouter();

	return (
		<section
			id="blogs"
			className="mt-20 md:mt-28 w-full scroll-mt-28"
		>
			<div className="mb-10 max-w-xl">
				<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 mb-4">
					<span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
						{"// thoughts"}
					</span>
				</div>
				<h2 className="text-3xl font-display font-bold tracking-tight text-white mb-2">
					Writing
				</h2>
				<p className="text-zinc-500 text-sm">
					Insights and deep dives on full stack architectures, smart escrow design, and frontend aesthetics.
				</p>
			</div>

			<div className="flex flex-col border-t border-white/5">
				{posts.map((post) => (
					<article
						key={post.title}
						onClick={() => router.push(`/blog/${post.slug}`)}
						className="group flex flex-col md:flex-row gap-4 md:gap-8 py-7 border-b border-white/5 cursor-pointer items-start justify-between transition-colors duration-300 hover:bg-white/[0.005]"
					>
						{/* Date */}
						<div className="w-32 shrink-0 pt-0.5">
							<span className="text-xs font-mono tracking-wider text-zinc-500">
								{post.date}
							</span>
						</div>

						{/* Content and Title */}
						<div className="flex flex-col flex-grow gap-2 max-w-xl">
							<h3 className="text-base md:text-lg font-display font-bold text-zinc-200 group-hover:text-white transition-colors leading-snug">
								{post.title}
							</h3>
							<p className="text-xs md:text-sm leading-relaxed text-zinc-500 max-w-lg">
								{post.description}
							</p>

							<div className="flex flex-wrap gap-1.5 mt-2 max-w-full">
								{post.tag.map((tag: string) => (
									<span
										key={tag}
										className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-medium text-zinc-400 bg-white/[0.02] border border-white/5 rounded uppercase tracking-wider whitespace-nowrap shrink-0 transition-all duration-200 hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-950/10 select-none"
									>
										<span className="text-emerald-500/50 font-bold">#</span>
										{tag}
									</span>
								))}
							</div>
						</div>

						{/* Interactive Arrow Button */}
						<div className="hidden md:flex w-8 h-8 rounded-full border border-white/5 group-hover:border-white/20 items-center justify-center text-zinc-500 group-hover:text-white transition-all shrink-0">
							<ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
						</div>
					</article>
				))}
			</div>

			<div className="mt-8">
				<button
					type="button"
					className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-2 group transition-colors"
				>
					View all posts
					<ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
				</button>
			</div>
		</section>
	);
};

export default Blogs;

