"use client";

import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/blogs";

interface BlogsProps {
	posts: BlogPost[];
}

const Blogs = ({ posts }: BlogsProps) => {
	const router = useRouter();

	return (
		<div id="blogs" className="mt-20 w-full pb-20 scroll-mt-24">
			<div className="mb-12 text-left">
				<h4 className="text-sm font-medium text-muted-foreground mb-1">
					Featured
				</h4>
				<h2 className="text-4xl font-bold text-foreground tracking-tight">
					Blogs
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{posts.map((post) => (
					<article
						key={post.title}
						onClick={() => router.push(`/blog/${post.slug}`)}
						className="group bg-card border border-border/50 rounded-3xl overflow-hidden flex flex-col transition-all hover:border-border hover:shadow-2xl hover:shadow-foreground/[0.01]"
					>
						<div
							className="h-56 w-full relative overflow-hidden"
							style={{
								backgroundImage: `url(${post.image})`,
								width: "100%",
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						></div>
						<div className="p-8 flex flex-col flex-grow text-left">
							<h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-muted-foreground transition-colors leading-tight">
								{post.title}
							</h3>
							<p className="text-muted-foreground text-sm leading-relaxed mb-6">
								{post.description}
							</p>

							<div className="flex flex-wrap gap-2 mb-8">
								{post.tag.map((tag: string) => (
									<span
										key={tag}
										className="px-3 py-1 rounded-lg bg-secondary border border-border text-[11px] font-medium text-muted-foreground"
									>
										{tag}
									</span>
								))}
							</div>

							<div className="mt-auto flex items-center justify-between">
								<div className="flex items-center gap-2 text-muted-foreground text-[13px]">
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Calendar Icon</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									{post.date}
								</div>
								<a
									href={`/blog/${post.slug}`}
									className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-all group/link"
								>
									Read More
									<svg
										className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Arrow Right</title>
										<line x1="5" y1="12" x2="19" y2="12" />
										<polyline points="12 5 19 12 12 19" />
									</svg>
								</a>
							</div>
						</div>
					</article>
				))}
			</div>

			<div className="mt-12 flex justify-center">
				<button
					type="button"
					className="px-6 py-2.5 rounded-xl bg-secondary border border-border text-muted-foreground text-sm font-medium hover:bg-secondary/80 hover:text-foreground transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
				>
					Show all blogs
				</button>
			</div>
		</div>
	);
};

export default Blogs;
