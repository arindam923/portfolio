import { getBlogPosts } from "@/lib/blogs";
import { Metadata } from "next";
import BlogListContainer from "@/components/BlogListContainer";

export const metadata: Metadata = {
	title: "Blog | Arindam Roy",
	description:
		"Technical logs, smart contracts, system architectures, and engineering deep dives by Arindam Roy.",
};

export default function BlogPage() {
	const blogs = getBlogPosts();

	return (
		<main className="max-w-4xl mx-auto px-4 sm:px-6 mt-20 sm:mt-24 md:mt-28 py-10 pb-32">
			{/* Page Header */}
			<section className="mb-10">
				<h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3 text-white font-display">
					Technical Logs
				</h1>
				<p className="text-zinc-500 text-sm sm:text-base max-w-xl font-sans leading-relaxed">
					Deep dives, engineering tutorials, smart contract systems, and modern stack architectures.
				</p>
			</section>

			{/* Main Interactive Blog List Container */}
			<BlogListContainer posts={blogs} />
		</main>
	);
}

