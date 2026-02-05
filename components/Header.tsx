"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { CommandMenu } from "./CommandMenu";
import { Moon, Sun, Search } from "lucide-react";

const Header = () => {
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			<header
				className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
					scrolled
						? "bg-background backdrop-blur-md py-3"
						: "bg-transparent py-6"
				}`}
				style={{
					boxShadow: scrolled ? "0 1px 0 0 rgb(var(--border))" : "none",
				}}
			>
				<div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
					<div className="flex items-center gap-8">
						{/* Avatar */}
						<Link href="/" className="flex-shrink-0">
							<div className="w-10 h-10 rounded-xl bg-accent overflow-hidden flex items-center justify-center border-2 border-primary/10 shadow-lg hover:scale-110 transition-transform">
								<Image
									src="/arindam.JPG"
									alt="Avatar"
									width={40}
									height={40}
									className="w-full h-full object-cover"
									unoptimized
								/>
							</div>
						</Link>

						{/* Nav Links */}
						<nav className="hidden sm:flex items-center gap-6">
							<Link
								href="/#experience"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Work
							</Link>
							<Link
								href="/#blogs"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Blogs
							</Link>
							<Link
								href="/#projects"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Projects
							</Link>
						</nav>
					</div>

					<div className="flex items-center gap-3">
						{/* Search Bar */}
						<button
							type="button"
							onClick={() => setOpen(true)}
							className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-secondary/50 border border-input text-muted-foreground hover:text-foreground hover:border-ring/20 transition-all cursor-pointer group"
						>
							<Search className="w-4 h-4" />
							<span className="text-xs font-medium">Search</span>
							<kbd className="items-center gap-1 hidden sm:flex text-[10px] font-sans bg-background/50 px-1.5 py-0.5 rounded border border-border text-muted-foreground group-hover:text-foreground transition-colors">
								<span className="text-xs">⌘</span>K
							</kbd>
						</button>

						{/* Theme Toggle */}
						<button
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							type="button"
							className="p-2 rounded-xl bg-secondary/50 border border-input text-muted-foreground hover:text-foreground hover:border-ring/20 transition-all"
							aria-label="Toggle theme"
						>
							{mounted ? (
								theme === "dark" ? (
									<Moon className="w-5 h-5" />
								) : (
									<Sun className="w-5 h-5" />
								)
							) : (
								<div className="w-5 h-5" /> // Placeholder to avoid hydration mismatch
							)}
						</button>
					</div>
				</div>
			</header>

			<CommandMenu open={open} onOpenChange={setOpen} />
		</>
	);
};

export default Header;
