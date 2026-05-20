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
	readTime: string;
}

// Cache for blog posts to avoid repeated filesystem reads
let cachedPosts: BlogPost[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function getBlogPosts(): BlogPost[] {
	const now = Date.now();

	// Return cached posts if still valid
	if (cachedPosts && (now - cacheTimestamp) < CACHE_TTL_MS) {
		return cachedPosts;
	}

	const postsDirectory = path.join(process.cwd(), "blogs");
	const filenames = fs.readdirSync(postsDirectory);

	const posts = filenames.map((filename) => {
		const filePath = path.join(postsDirectory, filename);
		const fileContents = fs.readFileSync(filePath, "utf8");
		const { data } = matter(fileContents);
		const tags = data.tags ?? data.tag;
		const tagArray = Array.isArray(tags) ? tags : tags ? [tags] : ["Engineering"];

		// Calculate realistic dynamic read time
		const wordCount = fileContents.split(/\s+/).length;
		const minutes = Math.max(2, Math.ceil(wordCount / 200)); // Average 200 WPM, minimum 2 mins

		return {
			slug: filename.replace(/\.(mdx|md)$/, ""),
			title: data.title,
			date: data.date,
			image: data.image,
			description: data.description ?? data.subtitle ?? "A brief overview of this post...",
			tag: tagArray,
			readTime: `${minutes} MIN`,
		};
	});

	// Sort by date (newest first)
	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	// Update cache
	cachedPosts = posts;
	cacheTimestamp = now;

	return posts;
}
