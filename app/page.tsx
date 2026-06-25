import ProfileCard from "@/components/ProfileCard";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import GithubStats from "@/components/GithubStats";
import Blogs from "@/components/Blogs";
import Connect from "@/components/Connect";
import { getBlogPosts } from "@/lib/blogs";
import { FadeInStagger, FadeInItem } from "@/components/MotionComponents";
import { GitHubCalendarClient } from "@/components/GitHubCalendarClient";

export default function Home() {
	const posts = getBlogPosts();

	return (
		<div className="min-h-screen bg-background text-foreground selection:bg-foreground/10 relative bg-dot-grid overflow-hidden">
			{/* Glow backdrop light leak */}
			<div className="absolute inset-0 glow-overlay pointer-events-none" />

			<main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20 pb-40">
				<FadeInStagger>
					<FadeInItem>
						<ProfileCard />
					</FadeInItem>
					
					<FadeInItem>
						<div className="border border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.01] rounded-2xl p-6 md:p-8 mt-4">
							<div className="mb-4">
								<span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-500">
									// GitHub Activity
								</span>
							</div>
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
