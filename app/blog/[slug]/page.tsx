import fs from "fs";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import { Metadata } from "next";
import Link from "next/link";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { MDXComponents } from "@/components/mdx-components";
import { BlogPostHeader } from "@/components/BlogPostHeader";
import FloatingBar from "@/components/floating-bottom-bar";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const filePath = path.join(process.cwd(), "blogs", `${slug}.mdx`);
	const source = fs.readFileSync(filePath, "utf8");

	const { frontmatter } = await compileMDX({
		source,
		options: {
			parseFrontmatter: true,
		},
	});

	const title = (frontmatter.title as string) || "Untitled Post";
	const subtitle = (frontmatter.subtitle as string) || "";
	const date = (frontmatter.date as string) || "";

	return {
		title,
		description: subtitle,
		authors: [{ name: "Arindam Roy" }],
		openGraph: {
			title,
			description: subtitle,
			type: "article",
			publishedTime: date,
			images: frontmatter.image
				? [frontmatter.image as string]
				: ["/og-image.png"],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: subtitle,
		},
	};
}

const BlogPost = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;
	const filePath = path.join(process.cwd(), "blogs", `${slug}.mdx`);
	const source = fs.readFileSync(filePath);

	const { content, frontmatter } = await compileMDX({
		source,
		components: MDXComponents,
		options: {
			parseFrontmatter: true,
			mdxOptions: {
				remarkPlugins: [remarkGfm],
				rehypePlugins: [
					[
						rehypePrettyCode,
						{
							theme: "github-dark-default",
							keepBackground: false,
						},
					],
				],
			},
		},
	});

	return (
		<article className="max-w-4xl mx-auto pt-28 md:pt-36 px-4 sm:px-6 md:px-8 pb-32">
			{/* Terminal-Prompt Style Navigation Header */}
			<div className="mb-6 mt-0">
				<Link
					href="/blog"
					className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-zinc-900 bg-zinc-950/80 hover:bg-zinc-900/40 text-xs font-mono text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300 group shadow-md"
				>
					<span className="text-emerald-500 group-hover:translate-x-[-1px] transition-transform">❯</span>
					<span className="font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">cd ..</span>
					<span className="text-zinc-700">/</span>
					<span className="text-[10px] text-zinc-600 font-sans group-hover:text-zinc-300 transition-colors">
						index
					</span>
					<span className="w-1.5 h-3 bg-emerald-500/80 rounded-sm opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all ml-0.5 duration-200" />
				</Link>
			</div>

			<BlogPostHeader
				title={frontmatter.title as string}
				subtitle={frontmatter.subtitle as string}
				date={frontmatter.date as string}
				tags={(frontmatter.tags as string[]) || []}
				image={frontmatter.image as string}
			/>

			{/* Main MDX Content */}
			<div className="max-w-none text-zinc-300 prose prose-invert prose-headings:text-white prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-code:font-mono prose-pre:bg-zinc-950/60 prose-pre:border prose-pre:border-zinc-800">
				{content}
			</div>

			<FloatingBar
				blog={{
					title: frontmatter.title as string,
				}}
			/>
		</article>
	);
};

export default BlogPost;

