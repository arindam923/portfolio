"use client";

import { motion } from "framer-motion";

export const FadeInStagger = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={{
				visible: {
					transition: {
						staggerChildren: 0.15,
						delayChildren: 0.2,
					},
				},
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
};

export const FadeInItem = ({ children }: { children: React.ReactNode }) => {
	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
				visible: {
					opacity: 1,
					y: 0,
					filter: "blur(0px)",
					transition: { duration: 0.5, ease: "easeOut" },
				},
			}}
		>
			{children}
		</motion.div>
	);
};
