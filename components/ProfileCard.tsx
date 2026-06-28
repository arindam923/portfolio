"use client";

import Image from "next/image";
import { ArrowUpRight, FileText, Mail, Github, Twitter } from "lucide-react";
import { useState } from "react";
import { ContactModal } from "./ContactModal";

const getTechStyles = (name: string) => {
	const lower = name.toLowerCase();
	if (lower.includes("react")) {
		return {
			text: "text-[#087EA4] dark:text-[#61DAFB]",
			bg: "bg-[#61DAFB]/5 hover:bg-[#61DAFB]/10",
			border: "border-[#61DAFB]/20 dark:border-[#61DAFB]/10 hover:border-[#61DAFB]/40 dark:hover:border-[#61DAFB]/30",
			glow: "hover:shadow-[0_0_15px_rgba(8,126,164,0.1)] dark:hover:shadow-[0_0_15px_rgba(97,218,251,0.15)]",
		};
	}
	if (lower.includes("typescript")) {
		return {
			text: "text-[#3178C6] dark:text-[#3178C6]",
			bg: "bg-[#3178C6]/5 hover:bg-[#3178C6]/10",
			border: "border-[#3178C6]/20 dark:border-[#3178C6]/10 hover:border-[#3178C6]/40 dark:hover:border-[#3178C6]/30",
			glow: "hover:shadow-[0_0_15px_rgba(49,120,198,0.1)] dark:hover:shadow-[0_0_15px_rgba(49,120,198,0.15)]",
		};
	}
	if (lower.includes("next.js") || lower.includes("nextjs")) {
		return {
			text: "text-zinc-800 dark:text-zinc-100",
			bg: "bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10",
			border: "border-zinc-300 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30",
			glow: "hover:shadow-[0_0_15px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]",
		};
	}
	if (lower.includes("node")) {
		return {
			text: "text-[#1b6b17] dark:text-[#3C873A]",
			bg: "bg-[#3C873A]/5 hover:bg-[#3C873A]/10",
			border: "border-[#3C873A]/20 dark:border-[#3C873A]/10 hover:border-[#3C873A]/40 dark:hover:border-[#3C873A]/30",
			glow: "hover:shadow-[0_0_15px_rgba(27,107,23,0.1)] dark:hover:shadow-[0_0_15px_rgba(60,135,58,0.15)]",
		};
	}
	if (lower.includes("rust")) {
		return {
			text: "text-[#9c4221] dark:text-[#DEA584]",
			bg: "bg-[#DEA584]/5 hover:bg-[#DEA584]/10",
			border: "border-[#DEA584]/20 dark:border-[#DEA584]/10 hover:border-[#DEA584]/40 dark:hover:border-[#DEA584]/30",
			glow: "hover:shadow-[0_0_15px_rgba(156,66,33,0.1)] dark:hover:shadow-[0_0_15px_rgba(222,165,132,0.15)]",
		};
	}
	if (lower.includes("go")) {
		return {
			text: "text-[#007d9c] dark:text-[#00ADD8]",
			bg: "bg-[#00ADD8]/5 hover:bg-[#00ADD8]/10",
			border: "border-[#00ADD8]/20 dark:border-[#00ADD8]/10 hover:border-[#00ADD8]/40 dark:hover:border-[#00ADD8]/30",
			glow: "hover:shadow-[0_0_15px_rgba(0,125,156,0.1)] dark:hover:shadow-[0_0_15px_rgba(0,173,216,0.15)]",
		};
	}
	if (lower.includes("tailwind")) {
		return {
			text: "text-[#0f766e] dark:text-[#38BDF8]",
			bg: "bg-[#38BDF8]/5 hover:bg-[#38BDF8]/10",
			border: "border-[#38BDF8]/20 dark:border-[#38BDF8]/10 hover:border-[#38BDF8]/40 dark:hover:border-[#38BDF8]/30",
			glow: "hover:shadow-[0_0_15px_rgba(15,118,110,0.1)] dark:hover:shadow-[0_0_15px_rgba(56,189,248,0.15)]",
		};
	}
	if (lower.includes("postgres")) {
		return {
			text: "text-[#336791] dark:text-[#4169E1]",
			bg: "bg-[#4169E1]/5 hover:bg-[#4169E1]/10",
			border: "border-[#4169E1]/20 dark:border-[#4169E1]/10 hover:border-[#4169E1]/40 dark:hover:border-[#4169E1]/30",
			glow: "hover:shadow-[0_0_15px_rgba(51,103,145,0.1)] dark:hover:shadow-[0_0_15px_rgba(65,105,225,0.15)]",
		};
	}
	return {
		text: "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white",
		bg: "bg-zinc-100 dark:bg-white/[0.02] hover:bg-zinc-200 dark:hover:bg-white/[0.04]",
		border: "border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10",
		glow: "",
	};
};

const ProfileCard = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const skills = [
		{ name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
		{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/ffffff" },
		{ name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
		{ name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/3c873a" },
		{ name: "Rust", icon: "https://cdn.simpleicons.org/rust/DEA584" },
		{ name: "Golang", icon: "https://cdn.simpleicons.org/go/00ADD8" },
		{ name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
		{ name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
	];

	return (
		<div className="relative pt-12 pb-16 md:pt-20 md:pb-24 w-full">
			{/* Mesh Glow Background */}
			<div className="absolute -top-20 -left-20 w-96 h-96 bg-zinc-500/5 rounded-full blur-[120px] pointer-events-none" />
			<div className="absolute top-20 -right-20 w-80 h-80 bg-zinc-400/5 rounded-full blur-[100px] pointer-events-none" />

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
				
				{/* Left Column: Bold Typographic Hero Details (lg:col-span-8) */}
				<div className="lg:col-span-8 flex flex-col gap-8">
					<div className="flex flex-col gap-4">
						{/* Subtle tech tag */}
						<div className="inline-flex items-center gap-2">
							<span className="text-[11px] font-mono tracking-[0.2em] uppercase text-zinc-500">
								[ based in kolkata, india ]
							</span>
						</div>

						{/* Headline - Big Bold and Asymmetrical */}
						<h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter text-foreground leading-[0.9] mt-2">
							Arindam <br />
							<span className="text-zinc-400 dark:text-zinc-500">Roy.</span>
						</h1>

						<h2 className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 tracking-tight font-medium mt-4 max-w-lg">
							Full Stack Engineer from India. 6+ years in the trenches of the web.
						</h2>
					</div>

					<p className="text-sm md:text-base text-zinc-500 dark:text-zinc-500 leading-relaxed max-w-xl">
						Over the last 6 years, I've worked with startups of every size, all over the world — jumping between frontend, backend, DevOps, and tech lead roles. I like building things that work well, ship fast, and don't fall apart at 3 a.m.
					</p>

					{/* Core Technologies Minimal Grid */}
					<div className="flex flex-col gap-3.5 mt-2">
						<span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600">
							// Selected Technologies
						</span>
						<div className="flex flex-wrap gap-2">
							{skills.map((skill) => {
								const styles = getTechStyles(skill.name);
								return (
									<div
										key={skill.name}
										className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-full border transition-all duration-300 cursor-default ${styles.text} ${styles.bg} ${styles.border} ${styles.glow}`}
									>
										<Image
											src={skill.icon}
											alt={`${skill.name} icon`}
											width={12}
											height={12}
											className="w-3 h-3 object-contain opacity-80 hover:opacity-100 transition-opacity"
											unoptimized
										/>
										{skill.name}
									</div>
								);
							})}
						</div>
					</div>

					{/* Primary CTAs */}
					<div className="flex flex-wrap items-center gap-4 mt-4">
						<button
							type="button"
							onClick={() => setIsModalOpen(true)}
							className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold rounded-full transition-colors group cursor-pointer text-xs uppercase tracking-wider shadow-md dark:shadow-none"
						>
							<Mail className="w-3.5 h-3.5" />
							Let&apos;s talk
							<ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
						</button>
						<a
							href="/ArindamRoyResume.pdf"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold rounded-full border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/[0.04] text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-colors"
						>
							<FileText className="w-3.5 h-3.5" />
							View Resume
						</a>
					</div>
				</div>

				{/* Right Column: Premium Framed Graphic/Image (lg:col-span-4) */}
				<div className="lg:col-span-4 w-full flex flex-col gap-6 items-center lg:items-end justify-center">
					{/* Portrait frame with glowing overlay */}
					<div className="relative group w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 p-3 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.05)] dark:shadow-[0_0_50px_rgba(0,0,0,0.8)]">
						
						{/* Animated Border Glow Overlay */}
						<div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
						
						<div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 shadow-inner">
							<Image
								src="/arindam.JPG"
								alt="Arindam Roy"
								fill
								sizes="(max-width: 768px) 256px, 320px"
								className="object-cover scale-105 group-hover:scale-100 grayscale hover:grayscale-0 transition-all duration-1000 ease-out"
								priority
							/>
						</div>
					</div>

					{/* Clean, detailed social handles bar */}
					<div className="flex items-center gap-4 border-t border-zinc-200 dark:border-white/5 pt-6 w-full max-w-[280px] lg:max-w-none justify-center lg:justify-end">
						<a
							href="https://github.com/arindam923"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
						>
							<Github className="w-4 h-4" />
							<span>GitHub</span>
						</a>
						<span className="text-zinc-300 dark:text-zinc-800 font-mono text-xs">/</span>
						<a
							href="https://x.com/mars87153"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
						>
							<Twitter className="w-4 h-4" />
							<span>Twitter</span>
						</a>
					</div>
				</div>

			</div>

			<ContactModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
};

export default ProfileCard;
