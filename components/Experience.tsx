"use client";

import { useState } from "react";
import Image from "next/image";
import {
	ExternalLink,
	Github,
	Twitter,
	Linkedin,
	ChevronDown,
} from "lucide-react";

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
		period: "2025 - Present",
		location: "Remote",
		logo: "https://promote.fun/logo/logo_green.png",
		status: "Current",
		links: [{ type: "globe", url: "https://www.promote.fun" }],
		technologies: [
			{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
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
			{ name: "Bun", icon: "https://cdn.simpleicons.org/bun/FBF0DF" },
		],
		description: [
			"Architected and developed the complete frontend infrastructure for the platform, a comprehensive solution for creating and managing promotional campaigns.",
			"Led a comprehensive codebase refactoring initiative that improved maintainability, scalability, and development velocity across the entire platform.",
			"Integrated and optimized backend API connections, implementing efficient data fetching strategies and error handling mechanisms.",
		],
	},
	{
		id: "2",
		company: "Paisadekho",
		role: "Senior Full stack Engineer",
		period: "2024 - 2024",
		location: "Jaipur, India",
		logo: "https://www.paisadekho.com/images/Header_New.svg",
		links: [
			{ type: "globe", url: "#" },
			{ type: "github", url: "#" },
		],
	},
	{
		id: "3",
		company: "Gululu Coin",
		role: "Senior Full-Stack Developer",
		period: "2024 - 2025",
		location: "Remote",
		logo: "https://swap.gululu.in/logo.png",
		links: [
			{ type: "globe", url: "#" },
			{ type: "github", url: "#" },
		],
	},
	{
		id: "4",
		company: "Trupay",
		role: "Full Stack Developer",
		period: "2023 - 2024",
		location: "Delhi, India",
		logo: "https://trupay.com/wp-content/uploads/2025/07/images.png",
		links: [
			{ type: "globe", url: "#" },
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
			// Prevent triggering if focused on a link/button within the content
			if (
				(e.target as HTMLElement).tagName !== "A" &&
				(e.target as HTMLElement).tagName !== "BUTTON"
			) {
				e.preventDefault();
				onToggle();
			}
		}
	};

	return (
		<div
			className={`group relative flex flex-col rounded-3xl transition-all duration-500 overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 ${
				isExpanded
					? "bg-zinc-950 border border-zinc-700 shadow-[0_0_40px_-15px_rgba(255,255,255,0.05)]"
					: "bg-zinc-950/40 border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-950/80"
			}`}
			onClick={(e) => {
				// Don't toggle if clicking on a link inside the expanded area
				if ((e.target as HTMLElement).closest("a")) return;
				onToggle();
			}}
			onKeyDown={handleKeyDown}
			tabIndex={0}
			role="button"
			aria-expanded={isExpanded}
		>
			{/* Header (Always Visible) */}
			<div
				className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10 transition-all duration-500 ${
					isExpanded
						? "p-6 md:p-8 pb-4 border-b border-zinc-800/60"
						: "p-5 md:p-6"
				}`}
			>
				<div className="flex items-center gap-4">
					{/* Logo */}
					<div
						className={`shrink-0 rounded-2xl flex items-center justify-center p-2.5 transition-all duration-500 ${
							isExpanded
								? "w-14 h-14 bg-zinc-900 border border-zinc-700 shadow-inner scale-105"
								: "w-12 h-12 bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700"
						}`}
					>
						<Image
							src={experience.logo}
							alt={`${experience.company} logo`}
							width={36}
							height={36}
							className="object-contain"
							unoptimized
						/>
					</div>
					<div>
						<h3
							className={`font-semibold tracking-tight flex items-center gap-3 transition-colors ${
								isExpanded
									? "text-xl text-white"
									: "text-lg text-zinc-100 group-hover:text-white"
							}`}
						>
							{experience.company}
							{experience.status && (
								<span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
									{experience.status}
								</span>
							)}
						</h3>
						<p
							className={`font-medium mt-1 transition-colors ${
								isExpanded
									? "text-sm text-zinc-400"
									: "text-[13px] text-zinc-500"
							}`}
						>
							{experience.role}
						</p>
					</div>
				</div>
				<div className="flex items-center sm:items-end justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0 gap-4 sm:flex-col">
					<div className="flex flex-col text-left sm:text-right">
						<span className="text-sm font-medium text-zinc-500 font-mono">
							{experience.period}
						</span>
						<span className="text-xs text-zinc-600 mt-1 font-medium">
							{experience.location}
						</span>
					</div>
					<div
						className={`p-1.5 rounded-lg border flex items-center justify-center transition-all duration-300 ${
							isExpanded
								? "bg-zinc-800 border-zinc-700 text-white rotate-180"
								: "bg-transparent border-transparent text-zinc-500 group-hover:bg-zinc-900 group-hover:border-zinc-800 group-hover:text-zinc-300"
						}`}
					>
						<ChevronDown className="w-4 h-4" />
					</div>
				</div>
			</div>

			{/* Collapsible Content */}
			<div
				className={`grid transition-all duration-300 ease-in-out ${
					isExpanded
						? "grid-rows-[1fr] opacity-100"
						: "grid-rows-[0fr] opacity-0"
				}`}
			>
				<div className="overflow-hidden">
					<div className="p-6 md:p-8 pt-4">
						{/* Description */}
						<div className="relative z-10 mb-8">
							{experience.description && (
								<ul className="space-y-3">
									{experience.description.map((point, i) => (
										<li
											key={i}
											className="text-[15px] leading-relaxed text-zinc-400 flex items-start gap-3"
										>
											<span className="text-zinc-600 mt-1 shrink-0 text-lg leading-none">
												▹
											</span>
											<span>{point}</span>
										</li>
									))}
								</ul>
							)}
						</div>

						{/* Footer: Tech & Links */}
						<div
							className="pt-6 border-t border-zinc-800/60 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 w-full cursor-default"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex flex-wrap gap-2 w-full md:w-auto">
								{experience.technologies &&
									experience.technologies.slice(0, 6).map((tech) => (
										<div
											key={`${experience.id}-${tech.name}`}
											className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-default"
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
											<span className="hidden sm:inline-block md:hidden lg:inline-block">
												{tech.name}
											</span>
										</div>
									))}
							</div>

							{experience.links && experience.links.length > 0 && (
								<div className="flex items-center gap-2 shrink-0 md:ml-auto w-full md:w-auto justify-start md:justify-end">
									{experience.links.map((link, i) => (
										<a
											key={`${experience.id}-link-${i}`}
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-800 hover:border-zinc-700"
											title={`Visit ${link.type}`}
										>
											{link.type === "globe" && (
												<ExternalLink className="w-4 h-4" />
											)}
											{link.type === "github" && <Github className="w-4 h-4" />}
											{link.type === "x" && <Twitter className="w-4 h-4" />}
											{link.type === "linkedin" && (
												<Linkedin className="w-4 h-4" />
											)}
										</a>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Hover Gradient Overlay */}
			<div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />
		</div>
	);
};

const ExperienceSection = () => {
	const [expandedId, setExpandedId] = useState<string | null>(
		experiences[0].id,
	);

	return (
		<section id="experience" className="mt-28 md:mt-36 w-full scroll-mt-24">
			<div className="mb-12 max-w-2xl">
				<h2 className="text-3xl font-semibold tracking-tight text-white mb-2">
					Experience
				</h2>
				<p className="text-zinc-500 text-sm">
					A summary of where I've contributed.
				</p>
			</div>

			<div className="flex flex-col gap-4">
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
		</section>
	);
};

export default ExperienceSection;
