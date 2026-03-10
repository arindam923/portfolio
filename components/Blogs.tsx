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
			className="mt-28 md:mt-36 w-full scroll-mt-24 max-w-3xl mx-auto md:mx-0"
		>
			<div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="max-w-2xl">
					<h2 className="text-3xl font-semibold tracking-tight text-white mb-2">
						Writing
					</h2>
					<p className="text-zinc-500 text-sm">
						Thoughts on software engineering, product development, and design.
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-8">
				{posts.map((post) => (
					<article
						key={post.title}
						onClick={() => router.push(`/blog/${post.slug}`)}
						className="group flex flex-col md:flex-row gap-6 items-start cursor-pointer"
					>
						{/* Date (Left side on desktop) */}
						<div className="hidden md:block w-32 shrink-0 pt-1">
							<span className="text-sm font-medium text-zinc-500 font-mono">
								{post.date}
							</span>
						</div>

						{/* Line separator for mobile */}
						<div className="md:hidden flex items-center gap-4 w-full">
							<span className="text-xs font-medium text-zinc-500 font-mono">
								{post.date}
							</span>
							<div className="h-px bg-zinc-800 flex-grow" />
						</div>

						{/* Content */}
						<div className="flex flex-col flex-grow">
							<h3 className="text-xl font-semibold text-zinc-100 mb-2 group-hover:text-white transition-colors">
								{post.title}
							</h3>
							<p className="text-[15px] leading-relaxed text-zinc-400 mb-4 max-w-xl">
								{post.description}
							</p>

							<div className="flex flex-wrap gap-2 items-center justify-between mt-auto">
								<div className="flex gap-2">
									{post.tag.map((tag: string) => (
										<span
											key={tag}
											className="px-2.5 py-1 text-xs font-medium text-zinc-500 rounded border border-zinc-800/80 bg-zinc-900/50"
										>
											{tag}
										</span>
									))}
								</div>
								<div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-white group-hover:text-black group-hover:border-transparent transition-all duration-300">
									<ArrowUpRight className="w-4 h-4" />
								</div>
							</div>
						</div>
					</article>
				))}
			</div>

			<div className="mt-12">
				<button
					type="button"
					className="text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-2 group transition-colors"
				>
					View all posts
					<ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
				</button>
			</div>
		</section>
	);
};

export default Blogs;
