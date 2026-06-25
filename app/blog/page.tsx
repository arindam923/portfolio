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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-20 sm:mt-24 md:mt-28 pb-20">
      {/* Page Header */}
      <section className="pb-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-foreground mb-4">
          Technical Blogs
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
          Deep dives, engineering tutorials, smart contract systems, and modern
          stack architectures.
        </p>
      </section>

      {/* Main Interactive Blog List Container */}
      <BlogListContainer posts={blogs} />
    </main>
  );
}
