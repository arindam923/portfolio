import { getBlogPosts } from "@/lib/blogs";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function BlogPage() {
	const blogs = getBlogPosts();

	const tagCounts = blogs.reduce(
		(acc, post) => {
			post.tag.forEach((t) => {
				acc[t] = (acc[t] || 0) + 1;
			});
			return acc;
		},
		{} as Record<string, number>,
	);

	const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

	return (
		<main className="max-w-4xl mx-auto px-8 mt-10 md:mt-18 py-10 pb-32">
			<section className="mb-16">
				<h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 text-white">
					Blog
				</h1>
				<p className="text-zinc-500 text-lg max-w-2xl">
					Thoughts, tutorials, and insights on engineering and product
					development.
				</p>
			</section>

			{/* Popular Tags */}
			<section className="mb-16">
				<h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-6 font-mono">
					Popular Topics
				</h2>
				<div className="flex flex-wrap gap-2">
					{sortedTags.map(([tag, count]) => (
						<button
							key={tag}
							type="button"
							className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[13px] font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-pointer"
						>
							{tag} <span className="opacity-50">({count})</span>
						</button>
					))}
				</div>
			</section>

			<hr className="border-t border-zinc-800/80 mb-16" />

			{/* Latest Posts */}
			<section>
				<h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-8 font-mono">
					All Posts
				</h2>

				<div className="flex flex-col gap-10">
					{blogs.map((blog) => (
						<Link
							key={blog.slug}
							href={`/blog/${blog.slug}`}
							className="group flex flex-col md:flex-row gap-6 items-start cursor-pointer no-underline"
						>
							{/* Date (Left side on desktop) */}
							<div className="hidden md:block w-32 shrink-0 pt-1">
								<span className="text-sm font-medium text-zinc-500 font-mono">
									{blog.date}
								</span>
							</div>

							{/* Line separator for mobile */}
							<div className="md:hidden flex items-center gap-4 w-full">
								<span className="text-xs font-medium text-zinc-500 font-mono">
									{blog.date}
								</span>
								<div className="h-px bg-zinc-800 flex-grow" />
							</div>

							{/* Content */}
							<div className="flex flex-col flex-grow w-full">
								<h3 className="text-xl font-semibold text-zinc-100 mb-2 group-hover:text-white transition-colors">
									{blog.title}
								</h3>
								<p className="text-[15px] leading-relaxed text-zinc-400 mb-4 max-w-xl">
									{blog.description}
								</p>

								<div className="flex flex-wrap gap-2 items-center justify-between mt-auto">
									<div className="flex gap-2">
										{blog.tag.map((t: string) => (
											<span
												key={t}
												className="px-2.5 py-1 text-xs font-medium text-zinc-500 rounded border border-zinc-800/80 bg-zinc-900/50"
											>
												{t}
											</span>
										))}
									</div>
									<div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-white group-hover:text-black group-hover:border-transparent transition-all duration-300">
										<ArrowUpRight className="w-4 h-4" />
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</section>
		</main>
	);
}
