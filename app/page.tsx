import ProfileCard from "@/components/ProfileCard";
import Experience from "@/components/Experience";
import GithubStats from "@/components/GithubStats";
import Projects from "@/components/Projects";
import Blogs from "@/components/Blogs";
import { getBlogPosts } from "@/lib/blogs";

export default function Home() {
	const posts = getBlogPosts();

	return (
		<div className="min-h-screen bg-black text-white selection:bg-white/10">
			<main className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
				<ProfileCard />
				<GithubStats />
				<Projects />
				<Experience />
				<Blogs posts={posts} />
			</main>
		</div>
	);
}
