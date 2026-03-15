import fs from "fs";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import { Metadata } from "next";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { MDXComponents } from "@/components/mdx-components";
import { BlogPostHeader } from "@/components/BlogPostHeader";
import FloatingBar from "@/components/floating-bottom-bar";
import BlogCommentSection from "@/components/blog-comment-section";

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

	const title = frontmatter.title as string;
	const subtitle = frontmatter.subtitle as string;
	const date = frontmatter.date as string;

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
		<article className="max-w-4xl mx-auto py-10 px-8 pb-32">
			<BlogPostHeader
				title={frontmatter.title as string}
				subtitle={frontmatter.subtitle as string}
				date={frontmatter.date as string}
				tags={(frontmatter.tags as string[]) || []}
				image={frontmatter.image as string}
			/>
			<div className="max-w-none">
				{content}
			</div>
			<BlogCommentSection />
			<FloatingBar
				blog={{
					title: frontmatter.title as string,
				}}
			/>
		</article>
	);
};

export default BlogPost;
