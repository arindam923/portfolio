"use client";

import Image from "next/image";
import { ArrowUpRight, Github, Twitter, Mail } from "lucide-react";
import { useState } from "react";
import { ContactModal } from "./ContactModal";

const ProfileCard = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const skills = [
		{ name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
		{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
		{
			name: "TypeScript",
			icon: "https://cdn.simpleicons.org/typescript/3178C6",
		},
		{ name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
		{ name: "Rust", icon: "https://cdn.simpleicons.org/rust/DEA584" },
		{ name: "Golang", icon: "https://cdn.simpleicons.org/go/00ADD8" },
		{
			name: "Tailwind CSS",
			icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
		},
		{
			name: "PostgreSQL",
			icon: "https://cdn.simpleicons.org/postgresql/4169E1",
		},
	];

	return (
		<div className="pt-16 pb-8 md:pt-24 md:pb-12 flex flex-col md:flex-row items-start gap-10 md:gap-16">
			{/* Left Column: Image & Quick Links */}
			<div className="flex flex-col gap-6 w-full md:w-auto shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
				<div className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden bg-zinc-900 ring-1 ring-white/10">
					<Image
						src="/arindam.JPG"
						alt="Arindam Roy"
						fill
						sizes="(max-width: 768px) 128px, 160px"
						className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent pointer-events-none" />
				</div>

				<div className="flex items-center gap-3">
					<a
						href="https://github.com/arindam923"
						className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
					>
						<Github className="w-4 h-4" />
					</a>
					<a
						href="https://x.com/mars87153"
						className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
					>
						<Twitter className="w-4 h-4" />
					</a>
					<a
						href="mailto:[arindam92@proton.me]"
						className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
					>
						<Mail className="w-4 h-4" />
					</a>
				</div>
			</div>

			{/* Right Column: Content */}
			<div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
				<div>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 group cursor-pointer hover:bg-white/10 transition-colors">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
						</span>
						<span className="text-xs font-medium text-zinc-300">
							Available for new opportunities
						</span>
					</div>

					<h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-4">
						Arindam Roy
					</h1>

					<h2 className="text-xl md:text-2xl text-zinc-400 font-medium tracking-tight mb-6">
						Full Stack Developer framing the future on the web.
					</h2>

					<p className="text-base text-zinc-500 leading-relaxed max-w-2xl">
						I build sleek, performant products to solve real-world problems.
						With a deep focus on rapid MVP development and open-source
						contribution, I craft experiences that are as technically sound as
						they are visually compelling.
					</p>
				</div>

				{/* Minimal Skills List */}
				<div className="mt-4">
					<p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-4">
						Core Technologies
					</p>
					<div className="flex flex-wrap gap-2">
						{skills.map((skill) => (
							<div
								key={skill.name}
								className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-default"
							>
								<Image
									src={skill.icon}
									alt={`${skill.name} icon`}
									width={14}
									height={14}
									className="w-3.5 h-3.5 object-contain"
									unoptimized
								/>
								{skill.name}
							</div>
						))}
					</div>
				</div>

				{/* Primary CTA */}
				<div className="mt-4">
					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-colors group cursor-pointer"
					>
						<Mail className="w-4 h-4" />
						Let&apos;s talk
						<ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
					</button>
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
