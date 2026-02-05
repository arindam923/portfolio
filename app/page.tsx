import ProfileCard from "@/components/ProfileCard";
import Experience from "@/components/Experience";
import GithubStats from "@/components/GithubStats";
import Projects from "@/components/Projects";
import Blogs from "@/components/Blogs";
import { getBlogPosts } from "@/lib/blogs";
import { FadeInStagger, FadeInItem } from "@/components/MotionComponents";

export default function Home() {
	const posts = getBlogPosts();

	return (
		<div className="min-h-screen bg-background text-foreground selection:bg-foreground/10">
			<main className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
				<FadeInStagger>
					<FadeInItem>
						<ProfileCard />
					</FadeInItem>
					<FadeInItem>
						<GithubStats />
					</FadeInItem>
					<FadeInItem>
						<Projects />
					</FadeInItem>
					<FadeInItem>
						<Experience />
					</FadeInItem>
					<FadeInItem>
						<Blogs posts={posts} />
					</FadeInItem>
				</FadeInStagger>
			</main>
		</div>
	);
}
