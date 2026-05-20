"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingBarProps {
	blog: {
		title: string;
	};
}

const FloatingBar = ({ blog }: FloatingBarProps) => {
	const { scrollYProgress } = useScroll();

	const smoothProgress = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	const [percent, setPercent] = useState(0);

	useEffect(() => {
		return scrollYProgress.on("change", (latest) => {
			setPercent(Math.round(latest * 100));
		});
	}, [scrollYProgress]);

	const radius = 11;
	const circumference = 2 * Math.PI * radius;
	const dashOffset = useTransform(smoothProgress, [0, 1], [circumference, 0]);

	return (
		<motion.div
			className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-sm"
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5, duration: 0.8, ease: [0.2, 0, 0, 1] }}
		>
			<div className="bg-zinc-950/85 backdrop-blur-xl border border-zinc-800 rounded-xl h-11 flex items-center px-3.5 justify-between shadow-2xl">
				{/* File/Post title status */}
				<div className="flex items-center gap-2 overflow-hidden ml-0.5">
					<div className="relative flex h-1.5 w-1.5 shrink-0">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
					</div>
					<span className="text-[11px] font-mono font-medium text-zinc-400 truncate max-w-[170px] uppercase tracking-wider">
						{blog.title}
					</span>
				</div>

				{/* Telemetry percentage and ring */}
				<div className="flex items-center gap-2.5 flex-shrink-0">
					<span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-1.5 py-0.5 rounded">
						SYS.READ: {percent}%
					</span>

					<div className="relative flex items-center justify-center w-7 h-7">
						<svg className="w-full h-full -rotate-90">
							<circle
								cx="14"
								cy="14"
								r={radius}
								className="stroke-zinc-900"
								strokeWidth="2"
								fill="transparent"
							/>
							<motion.circle
								cx="14"
								cy="14"
								r={radius}
								className="stroke-emerald-400"
								strokeWidth="2"
								strokeDasharray={circumference}
								style={{ strokeDashoffset: dashOffset }}
								strokeLinecap="round"
								fill="transparent"
							/>
						</svg>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default FloatingBar;

