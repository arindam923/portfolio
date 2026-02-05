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

	const radius = 12;
	const circumference = 2 * Math.PI * radius;
	const dashOffset = useTransform(smoothProgress, [0, 1], [circumference, 0]);

	return (
		<motion.div
			className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-sm"
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5, duration: 0.8, ease: [0.2, 0, 0, 1] }}
		>
			<div className="bg-white/90 dark:bg-black/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full h-12 flex items-center px-4 justify-between shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
				<div className="flex items-center gap-3 overflow-hidden ml-1">
					<div className="relative flex h-2 w-2 shrink-0">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
						<span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
					</div>
					<span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[180px]">
						{blog.title}
					</span>
				</div>

				<div className="flex items-center gap-3 flex-shrink-0">
					<span className="text-[11px] font-mono font-bold text-zinc-500 tracking-tighter">
						{percent}%
					</span>

					<div className="relative flex items-center justify-center w-8 h-8">
						<svg className="w-full h-full -rotate-90">
							<circle
								cx="16"
								cy="16"
								r={radius}
								className="stroke-zinc-300 dark:stroke-zinc-800"
								strokeWidth="2.5"
								fill="transparent"
							/>
							<motion.circle
								cx="16"
								cy="16"
								r={radius}
								className="stroke-blue-500"
								strokeWidth="2.5"
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
