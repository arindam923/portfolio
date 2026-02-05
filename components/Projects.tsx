"use client";

import Image from "next/image";

interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	logo: string;
	links: { type: "globe" | "github"; url: string }[];
	technologies: { name: string; icon: string }[];
	status: string;
}

const projects: Project[] = [
	{
		id: "1",
		title: "NotesBuddy",
		description:
			"A comprehensive study platform with notes, flashcards, quizzes, AI chatbot, and interactive learning tools",
		image: "linear-gradient(to bottom right, #4c1d95, #1e3a8a)", // Placeholder gradient
		logo: "https://api.dicebear.com/7.x/pixel-art/svg?seed=notes",
		links: [
			{ type: "globe", url: "#" },
			{ type: "github", url: "#" },
		],
		technologies: [
			{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
			{
				name: "TypeScript",
				icon: "https://cdn.simpleicons.org/typescript/3178C6",
			},
			{ name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
			{ name: "Vercel", icon: "https://cdn.simpleicons.org/vercel/FFFFFF" },
			{ name: "MongoDB", icon: "https://cdn.simpleicons.org/mongodb/47A248" },
			{
				name: "Tailwind",
				icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
			},
			{ name: "Prisma", icon: "https://cdn.simpleicons.org/prisma/2D3748" },
			{ name: "Markdown", icon: "https://cdn.simpleicons.org/markdown/FFFFFF" },
		],
		status: "All Systems Operational",
	},
	{
		id: "2",
		title: "Appwrite MCP Server",
		description:
			"Model Context Protocol server for seamless Appwrite database operations with 7 powerful tools and 99.9% success rate.",
		image: "linear-gradient(to bottom right, #1e3a8a, #0c4a6e)", // Placeholder gradient
		logo: "https://api.dicebear.com/7.x/pixel-art/svg?seed=server",
		links: [
			{ type: "globe", url: "#" },
			{ type: "github", url: "#" },
		],
		technologies: [
			{
				name: "TypeScript",
				icon: "https://cdn.simpleicons.org/typescript/3178C6",
			},
			{ name: "Bun", icon: "https://cdn.simpleicons.org/bun/FFFFFF" },
			{ name: "Vercel", icon: "https://cdn.simpleicons.org/vercel/FFFFFF" },
			{ name: "Appwrite", icon: "https://cdn.simpleicons.org/appwrite/FD366E" },
		],
		status: "All Systems Operational",
	},
	{
		id: "3",
		title: "Syncify",
		description:
			"A premium music streaming interface with personalized recommendations and social listening features.",
		image: "linear-gradient(to bottom right, #831843, #4c1d95)", // Placeholder gradient
		logo: "https://api.dicebear.com/7.x/pixel-art/svg?seed=music",
		links: [
			{ type: "globe", url: "#" },
			{ type: "github", url: "#" },
		],
		technologies: [
			{ name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
			{
				name: "Tailwind",
				icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
			},
			{ name: "Spotify", icon: "https://cdn.simpleicons.org/spotify/1DB954" },
		],
		status: "Building in Progress",
	},
	{
		id: "4",
		title: "Passandit Murat",
		description:
			"Something lovely is coming. A high-end e-commerce platform for curated lifestyle products.",
		image: "linear-gradient(to bottom right, #f472b6, #831843)", // Placeholder gradient
		logo: "https://api.dicebear.com/7.x/heart/svg?seed=love",
		links: [
			{ type: "globe", url: "#" },
			{ type: "github", url: "#" },
		],
		technologies: [
			{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
			{ name: "Stripe", icon: "https://cdn.simpleicons.org/stripe/008CDD" },
		],
		status: "Coming Soon",
	},
];

const Projects = () => {
	return (
		<div id="projects" className="mt-20 w-full scroll-mt-24">
			<div className="mb-12">
				<h4 className="text-sm font-medium text-zinc-500 mb-1">Featured</h4>
				<h2 className="text-4xl font-bold text-white tracking-tight">
					Projects
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{projects.map((project) => (
					<div
						key={project.id}
						className="group bg-[#0c0c0e] border border-zinc-800/50 rounded-3xl overflow-hidden flex flex-col transition-all hover:border-zinc-700/50 hover:shadow-2xl hover:shadow-white/[0.02]"
					>
						{/* Image Header */}
						<div
							className="h-48 w-full relative overflow-hidden"
							style={{ background: project.image }}
						>
							<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

							{/* Mockup Overlay Effect */}
							<div className="absolute inset-0 flex items-center justify-center translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
								<div className="w-[85%] h-full bg-[#121212] rounded-t-xl border-x border-t border-zinc-800/50 shadow-2xl relative">
									{/* Inner mockup content placeholder */}
									<div className="absolute inset-4 overflow-hidden rounded-md bg-zinc-900/50 flex flex-col gap-2">
										<div className="h-4 w-1/3 bg-zinc-800 rounded animate-pulse" />
										<div className="h-2 w-2/3 bg-zinc-800/50 rounded" />
										<div className="h-2 w-1/2 bg-zinc-800/50 rounded" />
									</div>
								</div>
							</div>

							{/* Project Icon Overlay */}
							<div className="absolute -bottom-4 left-6 w-12 h-12 rounded-xl bg-[#121212] border border-zinc-800 flex items-center justify-center p-2.5 z-10 shadow-xl group-hover:scale-110 transition-transform">
								<Image
									src={project.logo}
									alt={`${project.title} logo`}
									width={24}
									height={24}
									className="w-full h-full object-contain"
									unoptimized
								/>
							</div>
						</div>

						{/* Content */}
						<div className="p-6 sm:p-8 pt-10 flex flex-col flex-grow text-left">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold text-white group-hover:text-zinc-300 transition-colors">
									{project.title}
								</h3>
								<div className="flex items-center gap-3">
									{project.links.map((link) => (
										<a
											key={`${project.id}-link-${link.type}`}
											href={link.url}
											className="text-zinc-500 hover:text-white transition-colors"
											aria-label={`${link.type} link for ${project.title}`}
										>
											{link.type === "globe" ? (
												<svg
													className="w-5 h-5"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													role="img"
													aria-hidden="true"
												>
													<title>Website</title>
													<circle cx="12" cy="12" r="10" />
													<line x1="2" y1="12" x2="22" y2="12" />
													<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
												</svg>
											) : (
												<svg
													className="w-5 h-5"
													viewBox="0 0 24 24"
													fill="currentColor"
													role="img"
													aria-hidden="true"
												>
													<title>GitHub</title>
													<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
												</svg>
											)}
										</a>
									))}
								</div>
							</div>

							<p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
								{project.description}
							</p>

							<div className="mt-auto">
								<h5 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">
									Technologies
								</h5>
								<div className="flex flex-wrap gap-2.5 mb-8">
									{project.technologies.map((tech) => (
										<div
											key={`${project.id}-tech-${tech.name}`}
											className="group/tech transition-transform hover:-translate-y-0.5"
										>
											<Image
												src={tech.icon}
												alt={`${tech.name} icon`}
												width={18}
												height={18}
												className="w-4.5 h-4.5 opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
												unoptimized
											/>
										</div>
									))}
								</div>

								<div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
									<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-medium border border-emerald-500/20">
										<span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
										{project.status}
									</div>
									<button
										type="button"
										className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white transition-all group/btn"
									>
										View Details
										<svg
											className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round"
											role="img"
											aria-hidden="true"
										>
											<title>Details arrow</title>
											<line x1="5" y1="12" x2="19" y2="12" />
											<polyline points="12 5 19 12 12 19" />
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Projects;
