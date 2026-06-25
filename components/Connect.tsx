"use client";

import { useState, useEffect } from "react";
import { ContactModal } from "./ContactModal";
import { ArrowUpRight, Mail, MapPin, Globe, Clock } from "lucide-react";

const Connect = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [timeString, setTimeString] = useState("");

	useEffect(() => {
		const updateTime = () => {
			const options: Intl.DateTimeFormatOptions = {
				timeZone: "Asia/Kolkata",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: false,
			};
			const time = new Date().toLocaleTimeString("en-US", options);
			setTimeString(time);
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<section className="mt-24 md:mt-32 w-full border-t border-zinc-200 dark:border-white/5 pt-16 pb-12 relative overflow-hidden">
			{/* Mesh Glow Background */}
			<div className="absolute bottom-0 right-0 w-80 h-80 bg-zinc-500/5 rounded-full blur-[100px] pointer-events-none" />

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
				
				{/* Left Column: Headline and main button */}
				<div className="lg:col-span-7 flex flex-col gap-6 max-w-lg">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 w-fit">
						<span className="text-[10px] font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
							// collaborate
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tighter text-foreground leading-tight">
						Looking for a <br className="hidden sm:block" />
						development partner?
					</h2>
					<p className="text-zinc-500 text-sm md:text-base leading-relaxed">
						I frequently partner with startup founders and technical leaders to engineer performant, visual-grade digital products. If you have an idea or contract work, let's construct it.
					</p>

					<div className="mt-2">
						<button
							type="button"
							onClick={() => setIsModalOpen(true)}
							className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold rounded-full transition-colors group cursor-pointer text-xs uppercase tracking-wider shadow-md dark:shadow-none"
						>
							<Mail className="w-3.5 h-3.5" />
							Get in Touch
							<ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
						</button>
					</div>
				</div>

				{/* Right Column: Meta details and location specs */}
				<div className="lg:col-span-5 flex flex-col gap-8 w-full border border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.01] rounded-2xl p-6 md:p-8 font-mono">
					
					{/* Location Row */}
					<div className="flex items-start gap-4">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-white/[0.02] text-zinc-500 dark:text-zinc-400">
							<MapPin className="h-4 w-4" />
						</div>
						<div className="flex-1">
							<h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
								Location
							</h3>
							<p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-1">
								Kolkata, India
							</p>
							<span className="block text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
								22.5726° N, 88.3639° E
							</span>
						</div>
					</div>

					{/* Timezone Row */}
					<div className="flex items-start gap-4">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-white/[0.02] text-zinc-500 dark:text-zinc-400">
							<Clock className="h-4 w-4 animate-pulse" />
						</div>
						<div className="flex-1">
							<h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
								Local Time
							</h3>
							<p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-1">
								{timeString || "Loading..."}
							</p>
							<span className="block text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
								Asia/Kolkata (GMT +5:30)
							</span>
						</div>
					</div>

					{/* Channels Row */}
					<div className="flex items-start gap-4 border-t border-zinc-200 dark:border-white/5 pt-6">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-white/[0.02] text-zinc-500 dark:text-zinc-400">
							<Globe className="h-4 w-4" />
						</div>
						<div className="flex-1">
							<h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
								Active Channels
							</h3>
							<div className="flex flex-col gap-2.5 mt-2">
								<a
									href="https://github.com/arindam923"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors w-fit group"
								>
									GitHub
									<ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
								</a>
								<a
									href="https://x.com/mars87153"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors w-fit group"
								>
									Twitter / X
									<ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
								</a>
							</div>
						</div>
					</div>

				</div>

			</div>

			<ContactModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</section>
	);
};

export default Connect;
