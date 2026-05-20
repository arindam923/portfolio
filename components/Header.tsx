"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 right-0 w-full z-50 transition-[background-color,border-color,padding] duration-300 border-b ${
				scrolled
					? "bg-background/80 backdrop-blur-xl border-white/5 py-4"
					: "bg-transparent border-transparent py-6"
			}`}
		>
			<div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
				<div className="flex items-center gap-10">
					{/* Logo / Title Monogram */}
					<Link href="/" className="flex items-center gap-2.5 group">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
						</span>
						<span className="font-display font-bold tracking-tight text-white text-base">
							arindam.
						</span>
					</Link>

					{/* Nav Links */}
					<nav className="hidden sm:flex items-center gap-8">
						<Link
							href="/#experience"
							className="text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
						>
							Work
						</Link>
						<Link
							href="/blog"
							className="text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
						>
							Writing
						</Link>
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Header;

