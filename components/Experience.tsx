"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ArrowUpRight, Github, Twitter, Linkedin, ExternalLink } from "lucide-react";
import { experiences } from "@/lib/experience-data";
import type { ExperienceEntry } from "@/lib/experience-data";

const getTechStyles = (name: string) => {
	const lower = name.toLowerCase();
	if (lower.includes("react")) {
		return {
			text: "text-[#61DAFB]",
			bg: "bg-[#61DAFB]/5 hover:bg-[#61DAFB]/10",
			border: "border-[#61DAFB]/10 hover:border-[#61DAFB]/30",
			glow: "hover:shadow-[0_0_15px_rgba(97,218,251,0.15)]",
		};
	}
	if (lower.includes("typescript")) {
		return {
			text: "text-[#3178C6]",
			bg: "bg-[#3178C6]/5 hover:bg-[#3178C6]/10",
			border: "border-[#3178C6]/10 hover:border-[#3178C6]/30",
			glow: "hover:shadow-[0_0_15px_rgba(49,120,198,0.15)]",
		};
	}
	if (lower.includes("next.js") || lower.includes("nextjs")) {
		return {
			text: "text-zinc-100",
			bg: "bg-white/5 hover:bg-white/10",
			border: "border-white/10 hover:border-white/30",
			glow: "hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]",
		};
	}
	if (lower.includes("node")) {
		return {
			text: "text-[#3C873A]",
			bg: "bg-[#3C873A]/5 hover:bg-[#3C873A]/10",
			border: "border-[#3C873A]/10 hover:border-[#3C873A]/30",
			glow: "hover:shadow-[0_0_15px_rgba(60,135,58,0.15)]",
		};
	}
	if (lower.includes("rust")) {
		return {
			text: "text-[#DEA584]",
			bg: "bg-[#DEA584]/5 hover:bg-[#DEA584]/10",
			border: "border-[#DEA584]/10 hover:border-[#DEA584]/30",
			glow: "hover:shadow-[0_0_15px_rgba(222,165,132,0.15)]",
		};
	}
	if (lower.includes("go")) {
		return {
			text: "text-[#00ADD8]",
			bg: "bg-[#00ADD8]/5 hover:bg-[#00ADD8]/10",
			border: "border-[#00ADD8]/10 hover:border-[#00ADD8]/30",
			glow: "hover:shadow-[0_0_15px_rgba(0,173,216,0.15)]",
		};
	}
	if (lower.includes("tailwind")) {
		return {
			text: "text-[#38BDF8]",
			bg: "bg-[#38BDF8]/5 hover:bg-[#38BDF8]/10",
			border: "border-[#38BDF8]/10 hover:border-[#38BDF8]/30",
			glow: "hover:shadow-[0_0_15px_rgba(56,189,248,0.15)]",
		};
	}
	if (lower.includes("postgres")) {
		return {
			text: "text-[#4169E1]",
			bg: "bg-[#4169E1]/5 hover:bg-[#4169E1]/10",
			border: "border-[#4169E1]/10 hover:border-[#4169E1]/30",
			glow: "hover:shadow-[0_0_15px_rgba(65,105,225,0.15)]",
		};
	}
	if (lower.includes("convex")) {
		return {
			text: "text-[#EE342F]",
			bg: "bg-[#EE342F]/5 hover:bg-[#EE342F]/10",
			border: "border-[#EE342F]/10 hover:border-[#EE342F]/30",
			glow: "hover:shadow-[0_0_15px_rgba(238,52,47,0.15)]",
		};
	}
	if (lower.includes("solana")) {
		return {
			text: "text-[#14F195]",
			bg: "bg-[#14F195]/5 hover:bg-[#14F195]/10",
			border: "border-[#14F195]/10 hover:border-[#14F195]/30",
			glow: "hover:shadow-[0_0_15px_rgba(20,241,149,0.15)]",
		};
	}
	if (lower.includes("docker")) {
		return {
			text: "text-[#2496ED]",
			bg: "bg-[#2496ED]/5 hover:bg-[#2496ED]/10",
			border: "border-[#2496ED]/10 hover:border-[#2496ED]/30",
			glow: "hover:shadow-[0_0_15px_rgba(36,150,237,0.15)]",
		};
	}
	if (lower.includes("kubernetes")) {
		return {
			text: "text-[#326CE5]",
			bg: "bg-[#326CE5]/5 hover:bg-[#326CE5]/10",
			border: "border-[#326CE5]/10 hover:border-[#326CE5]/30",
			glow: "hover:shadow-[0_0_15px_rgba(50,108,229,0.15)]",
		};
	}
	if (lower.includes("ton")) {
		return {
			text: "text-[#0088CC]",
			bg: "bg-[#0088CC]/5 hover:bg-[#0088CC]/10",
			border: "border-[#0088CC]/10 hover:border-[#0088CC]/30",
			glow: "hover:shadow-[0_0_15px_rgba(0,136,204,0.15)]",
		};
	}
	if (lower.includes("kafka")) {
		return {
			text: "text-[#FF9900]",
			bg: "bg-[#FF9900]/5 hover:bg-[#FF9900]/10",
			border: "border-[#FF9900]/10 hover:border-[#FF9900]/30",
			glow: "hover:shadow-[0_0_15px_rgba(255,153,0,0.15)]",
		};
	}
	if (lower.includes("javascript")) {
		return {
			text: "text-[#F7DF1E]",
			bg: "bg-[#F7DF1E]/5 hover:bg-[#F7DF1E]/10",
			border: "border-[#F7DF1E]/10 hover:border-[#F7DF1E]/30",
			glow: "hover:shadow-[0_0_15px_rgba(247,223,30,0.15)]",
		};
	}
	if (lower.includes("html")) {
		return {
			text: "text-[#E34F26]",
			bg: "bg-[#E34F26]/5 hover:bg-[#E34F26]/10",
			border: "border-[#E34F26]/10 hover:border-[#E34F26]/30",
			glow: "hover:shadow-[0_0_15px_rgba(227,79,38,0.15)]",
		};
	}
	if (lower.includes("css")) {
		return {
			text: "text-[#157EFB]",
			bg: "bg-[#157EFB]/5 hover:bg-[#157EFB]/10",
			border: "border-[#157EFB]/10 hover:border-[#157EFB]/30",
			glow: "hover:shadow-[0_0_15px_rgba(21,126,251,0.15)]",
		};
	}
	if (lower.includes("websocket")) {
		return {
			text: "text-[#010101] dark:text-zinc-100",
			bg: "bg-white/5 hover:bg-white/10",
			border: "border-white/10 hover:border-white/30",
			glow: "hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]",
		};
	}
	return {
		text: "text-zinc-400 hover:text-white",
		bg: "bg-white/[0.02] hover:bg-white/[0.04]",
		border: "border-white/5 hover:border-white/10",
		glow: "",
	};
};

type Experience = ExperienceEntry;

const ExperienceItem = ({
	experience,
	isExpanded,
	onToggle,
	index,
}: {
	experience: Experience;
	isExpanded: boolean;
	onToggle: () => void;
	index: number;
}) => {
	const displayIndex = String(index + 1).padStart(2, "0");

	return (
		<div
			className={`group border-b border-white/5 py-8 transition-colors duration-500 cursor-pointer ${
				isExpanded ? "bg-white/[0.005]" : "hover:bg-white/[0.002]"
			}`}
			onClick={onToggle}
		>
			<div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
				{/* 1. Monospaced Index & Period (Col 3) */}
				<div className="md:col-span-3 flex items-center gap-3 font-mono">
					<span className="text-[10px] text-zinc-600 font-medium select-none">
						{displayIndex}
					</span>
					<span className="text-[11px] font-semibold tracking-wider text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase">
						{experience.period}
					</span>
				</div>

				{/* 2. Brand Identity & Role (Col 8) */}
				<div className="md:col-span-8 flex items-center gap-4">
					{/* Logo Frame */}
					<div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-zinc-950 border border-white/5 p-1.5 flex items-center justify-center transition-all duration-500 group-hover:border-white/10 group-hover:scale-105">
						<Image
							src={experience.logo}
							alt={`${experience.company} logo`}
							width={28}
							height={28}
							className="object-contain w-full h-full opacity-60 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0"
							unoptimized
						/>
					</div>

					<div className="flex flex-col gap-0.5">
						<h3 className="font-display font-bold text-zinc-300 group-hover:text-white transition-colors text-base md:text-lg flex items-center gap-3">
							{experience.company}
							{experience.status && (
								<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-semibold border border-emerald-500/20 font-mono tracking-wider uppercase">
									<span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
									{experience.status}
								</span>
							)}
						</h3>
						<p className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase">
							{experience.role}
						</p>
					</div>
				</div>

				{/* 3. Interactive Chevron Trigger (Col 1) */}
				<div className="md:col-span-1 hidden md:flex justify-end">
					<div
						className={`p-1.5 rounded-full border border-white/5 text-zinc-600 transition-all duration-500 bg-white/[0.01] ${
							isExpanded
								? "bg-white text-black rotate-180 border-transparent shadow-[0_0_15px_rgba(255,255,255,0.1)]"
								: "group-hover:text-white group-hover:border-white/10"
						}`}
					>
						<ChevronDown className="w-3.5 h-3.5" />
					</div>
				</div>
			</div>

			{/* Collapsible Panel via CSS Grid Row Animation */}
			<div
				className={`grid transition-all duration-500 ease-in-out ${
					isExpanded
						? "grid-rows-[1fr] opacity-100 mt-6"
						: "grid-rows-[0fr] opacity-0"
				}`}
			>
				<div className="overflow-hidden">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-white/5 text-left items-start">
						{/* Left Column: Asymmetric monospaced bullet achievements (Col 8) */}
						<div className="lg:col-span-8 flex flex-col gap-4">
							<span className="text-[9px] font-mono tracking-[0.2em] text-zinc-600 uppercase block mb-1">
								// Achievements & Impact
							</span>
							<ul className="space-y-3.5">
								{experience.description &&
									experience.description.map((point, i) => (
										<li
											key={i}
											className="text-xs md:text-sm leading-relaxed text-zinc-400 flex items-start gap-4"
										>
											<span className="text-zinc-600 font-mono text-[10px] pt-0.5 select-none font-bold">
												{String(i + 1).padStart(2, "0")}.
											</span>
											<span className="text-zinc-400 hover:text-zinc-300 transition-colors">
												{point}
											</span>
										</li>
									))}
							</ul>
						</div>

						{/* Right Column: Stack & Links Assets (Col 4) */}
						<div className="lg:col-span-4 flex flex-col gap-6 lg:border-l lg:border-white/5 lg:pl-6">
							{/* Tech Stack */}
							{experience.technologies && experience.technologies.length > 0 && (
								<div className="flex flex-col gap-3">
									<span className="text-[9px] font-mono tracking-[0.2em] text-zinc-600 uppercase">
										// Technologies Used
									</span>
									<div className="flex flex-wrap gap-1.5">
										{experience.technologies.map((tech) => {
											const styles = getTechStyles(tech.name);
											return (
												<div
													key={`${experience.id}-${tech.name}`}
													className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-medium rounded border transition-all ${styles.text} ${styles.bg} ${styles.border} ${styles.glow}`}
													title={tech.name}
												>
													<Image
														src={tech.icon}
														alt={`${tech.name} icon`}
														width={10}
														height={10}
														className="w-2.5 h-2.5 object-contain opacity-80 hover:opacity-100 transition-opacity"
														unoptimized
													/>
													<span>{tech.name}</span>
												</div>
											);
										})}
									</div>
								</div>
							)}

							{/* Linked Channels */}
							{experience.links && experience.links.length > 0 && (
								<div className="flex flex-col gap-3">
									<span className="text-[9px] font-mono tracking-[0.2em] text-zinc-600 uppercase">
										// Experience Links
									</span>
									<div className="flex items-center gap-2">
										{experience.links.map((link, i) => (
											<a
												key={`${experience.id}-link-${i}`}
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group/link"
												title={`Visit ${link.type}`}
											>
												{link.type === "globe" && (
													<ExternalLink className="w-3.5 h-3.5 group-hover/link:rotate-12 transition-transform" />
												)}
												{link.type === "github" && <Github className="w-3.5 h-3.5" />}
												{link.type === "x" && <Twitter className="w-3.5 h-3.5" />}
												{link.type === "linkedin" && (
													<Linkedin className="w-3.5 h-3.5" />
												)}
											</a>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const ExperienceSection = () => {
	const [expandedId, setExpandedId] = useState<string | null>(experiences[0].id);

	return (
		<section id="experience" className="mt-24 md:mt-32 w-full scroll-mt-28">
			{/* Asymmetric Header */}
			<div className="mb-14 max-w-xl">
				<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 mb-4">
					<span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
						// history
					</span>
				</div>
				<h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tighter text-white mb-3">
					Experience
				</h2>
				<p className="text-zinc-500 text-sm md:text-base leading-relaxed">
					A technical chronicle of my architectural contributions, team leadership, and engineering ventures in the web ecosystem.
				</p>
			</div>

			{/* Timeline Rows Container */}
			<div className="flex flex-col border-t border-white/5">
				{experiences.map((exp, index) => (
					<ExperienceItem
						key={exp.id}
						experience={exp}
						index={index}
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
