"use client";

import Image from "next/image";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";

interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	logo: string;
	projectImage: string;
	links: { type: "globe" | "github"; url: string }[];
	technologies: { name: string; icon: string }[];
	status: "live" | "wip" | "soon";
	year: string;
}

const projects: Project[] = [
	{
		id: "1",
		title: "FreeTune",
		description:
			"A lightweight, cross-platform desktop music player built with Tauri, React, and Rust that aggregates royalty-free music from various free sources.",
		image: "linear-gradient(135deg, #4c1d95 0%, #1e3a8a 100%)",
		projectImage: "https://github.com/arindam923/freetune/raw/main/player.png",
		logo: "https://api.dicebear.com/7.x/pixel-art/svg?seed=notes",
		links: [
			{ type: "github", url: "https://github.com/arindam923/freetune" },
		],
		technologies: [
			{ name: "Tauri", icon: "https://cdn.simpleicons.org/tauri/FFFFFF" },
			{
				name: "Rust",
				icon: "https://cdn.simpleicons.org/rust/DEA584"
			},
			{
				name: "TypeScript",
				icon: "https://cdn.simpleicons.org/typescript/3178C6",
			},
			{ name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
			{
				name: "Tailwind",
				icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
			},
		],
		status: "live",
		year: "2026",
	},
	{
		id: "2",
		title: "Airpay",
		projectImage: "/airpay.png",
		description:
			"An optimized Model Context Protocol server wrapped around Appwrite database primitives. Provides zero-latency tooling with a 99.9% measured success rate in edge environments.",
		image: "linear-gradient(135deg,rgb(2, 3, 4) 0%,rgb(245, 68, 33) 100%)",
		logo: "https://api.dicebear.com/7.x/pixel-art/svg?seed=server",
		links: [
			{ type: "globe", url: "https://airpay-green.vercel.app/" },
			{ type: "github", url: "#" },
		],
		technologies: [
			{
				name: "TypeScript",
				icon: "https://cdn.simpleicons.org/typescript/3178C6",
			},
			{ name: "Bun", icon: "https://cdn.simpleicons.org/bun/FBF0DF" },
			{ name: "Vercel", icon: "https://cdn.simpleicons.org/vercel/FFFFFF" },
			{ name: "Appwrite", icon: "https://cdn.simpleicons.org/appwrite/FD366E" },
		],
		status: "live",
		year: "2024",
	},
	{
		id: "3",
		title: "Syncify",
		projectImage: "/flashdb-landing.png",
		description:
			"Music streaming architecture reimagined. A bespoke interface connecting directly to Spotify's APIs for real-time social listening, advanced analytics, and queued sessions.",
		image: "linear-gradient(135deg, #db2777 0%, #4c1d95 100%)",
		logo: "https://api.dicebear.com/7.x/pixel-art/svg?seed=music",
		links: [{ type: "globe", url: "https://flashdb-landing-page.vercel.app/" }],
		technologies: [
			{ name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
			{
				name: "Tailwind",
				icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
			},
			{ name: "Spotify", icon: "https://cdn.simpleicons.org/spotify/1DB954" },
		],
		status: "wip",
		year: "2025",
	},
	{
		id: "4",
		title: "Toolkit",
		projectImage: "/toolkit.png",
		description:
			"An upcoming e-commerce engine focusing on curated, high-end lifestyle products. Engineered for headless performance and seamless cross-border stripe integration.",
		image: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
		logo: "https://api.dicebear.com/7.x/heart/svg?seed=love",
		links: [{ type: "globe", url: "https://toolkit-wine.vercel.app/" }],
		technologies: [
			{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
			{ name: "Stripe", icon: "https://cdn.simpleicons.org/stripe/008CDD" },
			{
				name: "PostgreSQL",
				icon: "https://cdn.simpleicons.org/postgresql/4169E1",
			},
		],
		status: "soon",
		year: "2025",
	},
];

const ProjectCard = ({ project }: { project: Project }) => {
	return (
		<div className="group relative flex flex-col rounded-3xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-500 overflow-hidden hover:shadow-[0_0_40px_-15px_rgba(255,255,255,0.05)] cursor-pointer h-full">
			<div
				className="h-48 w-full relative overflow-hidden flex-shrink-0"
				style={{ background: project.image }}
			>
				<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
				<div className="absolute inset-x-0 bottom-0 top-4 overflow-hidden transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
					<Image
						src={project.projectImage}
						alt="Project preview"
						fill
						className="object-cover object-top rounded-t-lg"
						unoptimized
					/>
				</div>
			</div>

			<div className="p-6 md:p-8 flex flex-col h-full z-10 bg-zinc-950 relative">
				<div className="flex justify-end items-start h-8 mb-4">
					<div className="flex gap-2">
						{project.links.map((link, i) => (
							<a
								key={i}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-800 hover:border-zinc-700"
								onClick={(e) => e.stopPropagation()}
							>
								{link.type === "globe" ? (
									<ExternalLink className="w-4 h-4" />
								) : (
									<Github className="w-4 h-4" />
								)}
							</a>
						))}
					</div>
				</div>

				{/* Title and Tech */}
				<div className="mb-4">
					<div className="flex items-center gap-3 mb-2">
						<h3 className="text-xl font-semibold text-zinc-100 tracking-tight group-hover:text-white transition-colors">
							{project.title}
						</h3>
						{project.status === "live" && (
							<span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
								<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
								Live
							</span>
						)}
					</div>
					<p className="text-[15px] leading-relaxed text-zinc-400">
						{project.description}
					</p>
				</div>

				<div className="flex-grow" />

				{/* Footer Info */}
				<div className="pt-6 mt-6 border-t border-zinc-800/60 flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
							Tech Stack
						</span>
						<span className="text-xs font-medium text-zinc-600 font-mono">
							{project.year}
						</span>
					</div>

					<div className="flex items-center justify-between">
						{/* Technologies with colorful icons */}
						<div className="flex flex-wrap gap-2">
							{project.technologies.slice(0, 5).map((tech) => (
								<div
									key={tech.name}
									className="group/tech flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 transition-colors hover:border-zinc-700"
									title={tech.name}
								>
									<Image
										src={tech.icon}
										alt={`${tech.name} icon`}
										width={14}
										height={14}
										className="w-3.5 h-3.5 object-contain"
										unoptimized
									/>
									<span className="text-[11px] font-medium text-zinc-400 group-hover/tech:text-zinc-200 transition-colors">
										{tech.name}
									</span>
								</div>
							))}
						</div>

						{/* <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black shrink-0 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300 ml-2">
							<ArrowUpRight className="w-4 h-4" />
						</button> */}
					</div>
				</div>
			</div>
		</div>
	);
};

const ProjectsSection = () => {
	return (
		<section id="projects" className="mt-28 md:mt-36 w-full scroll-mt-24">
			<div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="max-w-2xl">
					<h2 className="text-3xl font-semibold tracking-tight text-white mb-2">
						Featured Work
					</h2>
					<p className="text-zinc-500 text-sm">
						A collection of products and tools I've built, focusing on speed and
						user experience.
					</p>
				</div>
				<a
					href="https://github.com/arindam923"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group"
				>
					<Github className="w-4 h-4" />
					View All on GitHub
					<ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
				</a>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{projects.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
		</section>
	);
};

export default ProjectsSection;
