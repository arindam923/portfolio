import fs from "fs";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { MDXComponents } from "@/components/mdx-components";
import { BlogPostHeader } from "@/components/BlogPostHeader";
import FloatingBar from "@/components/floating-bottom-bar";
import BlogCommentSection from "@/components/blog-comment-section";

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
		<article className="max-w-4xl mx-auto py-26 px-6 text-foreground">
			<BlogPostHeader
				title={frontmatter.title as string}
				subtitle={frontmatter.subtitle as string}
				date={frontmatter.date as string}
				tags={(frontmatter.tags as string[]) || []}
				image={frontmatter.image as string}
			/>
			<div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
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
