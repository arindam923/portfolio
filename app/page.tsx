import ProfileCard from "@/components/ProfileCard";
import Experience from "@/components/Experience";
import GithubStats from "@/components/GithubStats";
import Projects from "@/components/Projects";
import Blogs from "@/components/Blogs";
import Connect from "@/components/Connect";
import { getBlogPosts } from "@/lib/blogs";
import { FadeInStagger, FadeInItem } from "@/components/MotionComponents";
import { GitHubCalendarClient } from "@/components/GitHubCalendarClient";

export default function Home() {
	const posts = getBlogPosts();

	return (
		<div className="min-h-screen bg-background text-foreground selection:bg-foreground/10">
			<main className="max-w-4xl mx-auto px-4 sm:px-6 py-20 pb-40">
				<FadeInStagger>
					<FadeInItem>
						<ProfileCard />
					</FadeInItem>
					<FadeInItem>
						<div className="dark:bg-zinc-900/20 mt-12 rounded-xl p-6">
							<GitHubCalendarClient username="ramxcodes" />
						</div>
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
					<FadeInItem>
						<Connect />
					</FadeInItem>
				</FadeInStagger>
			</main>
		</div>
	);
}
