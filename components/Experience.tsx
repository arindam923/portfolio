"use client";

import { useState } from "react";
import Image from "next/image";

interface Experience {
	id: string;
	company: string;
	role: string;
	period: string;
	location: string;
	logo: string;
	status?: string;
	links?: { type: "globe" | "x" | "github" | "linkedin"; url: string }[];
	technologies?: { name: string; icon: string }[];
	description?: string[];
}

const experiences: Experience[] = [
	{
		id: "1",
		company: "Promote.fun",
		role: "Founding Engineer",
		period: "March 2025 - December 2025",
		location: "United States (Remote)",
		logo: "https://ramx.in/_next/image?url=%2Fcompany%2Fpromote.png&w=256&q=75",
		status: "last Working",
		links: [{ type: "globe", url: "https://www.promote.fun" }],
		technologies: [
			{
				name: "Next.js",
				icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF",
			},
			{
				name: "Tailwind CSS",
				icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
			},
			{
				name: "TypeScript",
				icon: "https://cdn.simpleicons.org/typescript/3178C6",
			},
			{ name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
			{ name: "Figma", icon: "https://cdn.simpleicons.org/figma/F24E1E" },
			{ name: "Vercel", icon: "https://cdn.simpleicons.org/vercel/FFFFFF" },
			{ name: "Postman", icon: "https://cdn.simpleicons.org/postman/FF6C37" },
			{ name: "Bun", icon: "https://cdn.simpleicons.org/bun/FFFFFF" },
		],
		description: [
			"Architected and developed the complete frontend infrastructure for the platform, a comprehensive solution for creating and managing promotional campaigns.",
			"Led a comprehensive codebase refactoring initiative that improved maintainability, scalability, and development velocity across the entire platform.",
			"Integrated and optimized backend API connections, implementing efficient data fetching strategies and error handling mechanisms.",
			"Enhanced user experience and interface design through implementation of consistent design systems, accessibility standards, and performance optimizations.",
		],
	},
	{
		id: "2",
		company: "Paisadekho",
		role: "Senior Full stack Engineer",
		period: "March 2024 - December 2024",
		location: "Jaipur, India (On-Site)",
		logo: "https://www.paisadekho.com/images/Header_New.svg",
		links: [
			{ type: "globe", url: "#" },
			{ type: "x", url: "#" },
			{ type: "linkedin", url: "#" },
			{ type: "github", url: "#" },
		],
	},
	{
		id: "3",
		company: "Gululu Coin",
		role: "Senior Full-Stack Developer",
		period: "April 2024 - February 2025",
		location: "Remote (India)",
		logo: "https://swap.gululu.in/logo.png",
		links: [
			{ type: "globe", url: "#" },
			{ type: "github", url: "#" },
		],
	},
	{
		id: "4",
		company: "Trupay",
		role: "FUll Stack Developer",
		period: "Aug 2023 - April 2024",
		location: "Delhi, India (On-Site)",
		logo: "https://trupay.com/wp-content/uploads/2025/07/images.png",
		links: [
			{ type: "globe", url: "#" },
			{ type: "x", url: "#" },
			{ type: "linkedin", url: "#" },
			{ type: "github", url: "#" },
		],
	},
];

const ExperienceItem = ({
	experience,
	isExpanded,
	onToggle,
}: {
	experience: Experience;
	isExpanded: boolean;
	onToggle: () => void;
}) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			if ((e.target as HTMLElement).tagName !== "A") {
				e.preventDefault();
				onToggle();
			}
		}
	};

	return (
		<div className="last:mb-0">
			<div
				className="w-full flex items-start gap-4 cursor-pointer group text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/20 rounded-xl p-2 -m-2 transition-all"
				onClick={(e) => {
					if ((e.target as HTMLElement).closest("a")) return;
					onToggle();
				}}
				onKeyDown={handleKeyDown}
				tabIndex={0}
				role="button"
				aria-expanded={isExpanded}
			>
				{/* Logo */}
				<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-secondary border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
					<Image
						src={experience.logo}
						alt={`${experience.company} logo`}
						width={48}
						height={48}
						className="w-full h-full object-cover"
						unoptimized
					/>
				</div>

				<div className="flex-grow min-w-0">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
						<div className="flex items-center gap-2 overflow-hidden">
							<h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-muted-foreground transition-colors truncate">
								{experience.company}
							</h3>
							<div className="flex items-center gap-2">
								{experience.links?.map((link) => (
									<a
										key={`${experience.id}-${link.type}`}
										href={link.url}
										className="text-muted-foreground hover:text-foreground transition-colors p-1"
										onClick={(e) => e.stopPropagation()}
										aria-label={`${link.type} link for ${experience.company}`}
									>
										{link.type === "globe" && (
											<svg
												className="w-4 h-4"
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
										)}
										{link.type === "x" && (
											<svg
												className="w-3.5 h-3.5"
												viewBox="0 0 24 24"
												fill="currentColor"
												role="img"
												aria-hidden="true"
											>
												<title>X (Twitter)</title>
												<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
											</svg>
										)}
										{link.type === "github" && (
											<svg
												className="w-4 h-4"
												viewBox="0 0 24 24"
												fill="currentColor"
												role="img"
												aria-hidden="true"
											>
												<title>GitHub</title>
												<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
											</svg>
										)}
										{link.type === "linkedin" && (
											<svg
												className="w-4 h-4"
												viewBox="0 0 24 24"
												fill="currentColor"
												role="img"
												aria-hidden="true"
											>
												<title>LinkedIn</title>
												<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
											</svg>
										)}
									</a>
								))}

								{experience.status && (
									<span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-medium border border-emerald-500/20">
										<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
										{experience.status}
									</span>
								)}

								<div
									className="text-muted-foreground group-hover:text-foreground transition-transform duration-200 ml-1"
									style={{
										transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
									}}
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										role="img"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>
						</div>
						<span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
							{experience.period}
						</span>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
						<h4 className="text-muted-foreground font-medium">
							{experience.role}
						</h4>
						<span className="text-sm text-muted-foreground">
							{experience.location}
						</span>
					</div>

					{/* Expanded Content */}
					{isExpanded && (
						<div className="mt-8 animate-in fade-in slide-in-from-top-2 duration-300">
							{experience.technologies && (
								<div className="mb-8">
									<h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
										Technologies & Tools
									</h5>
									<div className="flex flex-wrap gap-2">
										{experience.technologies.map((tech) => (
											<div
												key={`${experience.id}-${tech.name}`}
												className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-foreground/20 transition-colors"
											>
												<Image
													src={tech.icon}
													alt={`${tech.name} icon`}
													width={14}
													height={14}
													className="w-3.5 h-3.5 opacity-80"
													unoptimized
												/>
												<span className="text-xs text-foreground/80">
													{tech.name}
												</span>
											</div>
										))}
									</div>
								</div>
							)}

							{experience.description && (
								<ul className="space-y-3">
									{experience.description.map((point, i) => (
										<li
											key={`${experience.id}-desc-${i}`}
											className="text-muted-foreground/80 text-sm leading-relaxed flex gap-3"
										>
											<span className="text-foreground mt-1.5 flex-shrink-0">
												▪
											</span>
											{point}
										</li>
									))}
								</ul>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const ExperienceSection = () => {
	const [expandedId, setExpandedId] = useState<string | null>(
		experiences[0].id,
	);

	return (
		<div id="experience" className="mt-5 w-full scroll-mt-24">
			<div className="mb-12">
				<h4 className="text-sm font-medium text-muted-foreground mb-1">
					Featured
				</h4>
				<h2 className="text-4xl font-bold text-foreground tracking-tight">
					Experience
				</h2>
			</div>

			<div className="space-y-6">
				{experiences.map((exp) => (
					<ExperienceItem
						key={exp.id}
						experience={exp}
						isExpanded={expandedId === exp.id}
						onToggle={() =>
							setExpandedId(expandedId === exp.id ? null : exp.id)
						}
					/>
				))}
			</div>

			<div className="mt-16 flex justify-center">
				<button
					type="button"
					className="px-6 py-2.5 rounded-xl bg-secondary border border-border text-muted-foreground text-sm font-medium hover:bg-secondary/80 hover:text-foreground transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
				>
					Show all work experiences
				</button>
			</div>
		</div>
	);
};

export default ExperienceSection;
