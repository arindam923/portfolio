import path from "path";
import fs from "fs";
import matter from "gray-matter";

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	image: string;
	description: string;
	tag: string[];
}

export function getBlogPosts(): BlogPost[] {
	const postsDirectory = path.join(process.cwd(), "blogs");
	const filenames = fs.readdirSync(postsDirectory);

	return filenames.map((filename) => {
		const filePath = path.join(postsDirectory, filename);
		const fileContents = fs.readFileSync(filePath, "utf8");
		const { data } = matter(fileContents);
		const tags = data.tags ?? data.tag;
		const tagArray = Array.isArray(tags) ? tags : tags ? [tags] : ["Engineering"];

		return {
			slug: filename.replace(/\.(mdx|md)$/, ""),
			title: data.title,
			date: data.date,
			image: data.image,
			description: data.description ?? "A brief overview of this post...",
			tag: tagArray,
		};
	});
}
