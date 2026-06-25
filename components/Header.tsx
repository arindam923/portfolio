"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const Header = () => {
	const [scrolled, setScrolled] = useState(false);
	const { setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
		const isDark = resolvedTheme === "dark";

		if (
			typeof document === "undefined" ||
			!document.startViewTransition ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			setTheme(isDark ? "light" : "dark");
			return;
		}

		const x = event.clientX;
		const y = event.clientY;
		const endRadius = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y)
		);

		document.documentElement.style.setProperty("--theme-x", `${x}px`);
		document.documentElement.style.setProperty("--theme-y", `${y}px`);
		document.documentElement.style.setProperty("--theme-r", `${endRadius}px`);

		document.startViewTransition(async () => {
			setTheme(isDark ? "light" : "dark");
			// Wait for the class changes on <html> to be committed by next-themes
			await new Promise<void>((resolve) => {
				const timeoutId = setTimeout(resolve, 100);
				const observer = new MutationObserver(() => {
					clearTimeout(timeoutId);
					observer.disconnect();
					resolve();
				});
				observer.observe(document.documentElement, {
					attributes: true,
					attributeFilter: ["class"],
				});
			});
		});
	};

	return (
		<header
			className={`fixed top-0 left-0 right-0 w-full z-50 transition-[background-color,border-color,padding] duration-300 border-b ${
				scrolled
					? "bg-background/80 backdrop-blur-xl border-zinc-200 dark:border-white/5 py-4"
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
						<span className="font-display font-bold tracking-tight text-foreground text-base">
							arindam.
						</span>
					</Link>

					{/* Nav Links */}
					<nav className="hidden sm:flex items-center gap-8">
						<Link
							href="/#experience"
							className="text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-foreground dark:hover:text-white transition-colors"
						>
							Work
						</Link>
						<Link
							href="/blog"
							className="text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-foreground dark:hover:text-white transition-colors"
						>
							Writing
						</Link>
					</nav>
				</div>

				{/* Theme Toggle */}
				<button
					onClick={toggleTheme}
					className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 hover:bg-zinc-200 dark:hover:bg-white/10 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center"
					aria-label="Toggle theme"
				>
					{!mounted ? (
						<div className="w-4 h-4" />
					) : resolvedTheme === "dark" ? (
						<Sun className="w-4 h-4" />
					) : (
						<Moon className="w-4 h-4" />
					)}
				</button>
			</div>
		</header>
	);
};

export default Header;
