"use client";

import * as React from "react";
import { Command } from "cmdk";
import {
	Search,
	Monitor,
	Moon,
	Sun,
	Laptop,
	FileText,
	Briefcase,
	User,
	Github,
	X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export interface CommandMenuProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
	const { setTheme } = useTheme();
	const router = useRouter();
	const [isVisible, setIsVisible] = React.useState(false);
	const [isAnimating, setIsAnimating] = React.useState(false);

	// Handle open/close animations
	React.useEffect(() => {
		if (open) {
			setIsVisible(true);
			// Small delay to trigger CSS transition
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setIsAnimating(true);
				});
			});
		} else {
			setIsAnimating(false);
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, 200); // Match transition duration
			return () => clearTimeout(timer);
		}
	}, [open]);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				onOpenChange(!open);
			}
			if (e.key === "Escape") {
				onOpenChange(false);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [open, onOpenChange]);

	const runCommand = React.useCallback(
		(command: () => void) => {
			onOpenChange(false);
			command();
		},
		[onOpenChange],
	);

	if (!isVisible) return null;

	return (
		<div className="fixed inset-0 z-[100] overflow-hidden">
			{/* Backdrop with smooth transition */}
			<button
				type="button"
				aria-label="Close command menu"
				className="fixed inset-0 transition-all duration-200 ease-out cursor-default border-none outline-none"
				style={{
					backgroundColor: isAnimating
						? "rgba(0, 0, 0, 0.6)"
						: "rgba(0, 0, 0, 0)",
					backdropFilter: isAnimating ? "blur(8px)" : "blur(0px)",
					WebkitBackdropFilter: isAnimating ? "blur(8px)" : "blur(0px)",
				}}
				onClick={() => onOpenChange(false)}
			/>

			{/* Modal container with page slide effect */}
			<div
				className="fixed inset-0 flex items-start justify-center transition-all duration-200 ease-out"
				style={{
					paddingTop: isAnimating ? "15vh" : "12vh",
					opacity: isAnimating ? 1 : 0,
				}}
			>
				<Command
					className="relative w-[90%] max-w-[560px] overflow-hidden transition-all duration-200 ease-out"
					style={{
						transform: isAnimating
							? "scale(1) translateY(0)"
							: "scale(0.96) translateY(-10px)",
						borderRadius: "16px",
						backgroundColor: "rgb(var(--popover))",
						border: "1px solid rgb(var(--border))",
						boxShadow: isAnimating
							? "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)"
							: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
					}}
					loop
				>
					{/* Search input area */}
					<div
						className="flex items-center gap-3 px-4 py-4"
						style={{
							borderBottom: "1px solid rgb(var(--border))",
						}}
					>
						<Search
							className="shrink-0 transition-colors"
							style={{
								width: "18px",
								height: "18px",
								color: "rgb(var(--muted-foreground))",
							}}
						/>
						<Command.Input
							className="flex-1 bg-transparent outline-none placeholder:transition-colors"
							style={{
								fontSize: "15px",
								fontWeight: 400,
								fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
								letterSpacing: "-0.01em",
								color: "rgb(var(--foreground))",
							}}
							placeholder="Search commands, pages, actions..."
							autoFocus
						/>
						<button
							onClick={() => onOpenChange(false)}
							className="shrink-0 p-1 rounded-md transition-all hover:scale-110"
							style={{
								color: "rgb(var(--muted-foreground))",
							}}
							type="button"
						>
							<X style={{ width: "16px", height: "16px" }} />
						</button>
					</div>

					{/* Command list */}
					<Command.List
						className="overflow-y-auto overflow-x-hidden"
						style={{
							maxHeight: "360px",
							padding: "8px",
						}}
					>
						<Command.Empty
							className="flex flex-col items-center justify-center gap-2"
							style={{
								padding: "32px 16px",
								color: "rgb(var(--muted-foreground))",
							}}
						>
							<Search style={{ width: "32px", height: "32px", opacity: 0.4 }} />
							<span style={{ fontSize: "14px", fontWeight: 500 }}>
								No results found
							</span>
							<span style={{ fontSize: "12px", opacity: 0.7 }}>
								Try searching for something else
							</span>
						</Command.Empty>

						{/* Navigation Group */}
						<Command.Group>
							<div
								style={{
									padding: "8px 12px 6px",
									fontSize: "11px",
									fontWeight: 600,
									textTransform: "uppercase",
									letterSpacing: "0.05em",
									color: "rgb(var(--muted-foreground))",
									opacity: 0.7,
								}}
							>
								Navigation
							</div>
							<CommandItem
								onSelect={() => runCommand(() => router.push("/"))}
								icon={<User />}
								label="Home"
								shortcut="G H"
							/>
							<CommandItem
								onSelect={() => runCommand(() => router.push("/#experience"))}
								icon={<Briefcase />}
								label="Work Experience"
								shortcut="G W"
							/>
							<CommandItem
								onSelect={() => runCommand(() => router.push("/#projects"))}
								icon={<Monitor />}
								label="Projects"
								shortcut="G P"
							/>
							<CommandItem
								onSelect={() => runCommand(() => router.push("/#blogs"))}
								icon={<FileText />}
								label="Blog Posts"
								shortcut="G B"
							/>
						</Command.Group>

						{/* Separator */}
						<div
							style={{
								height: "1px",
								backgroundColor: "rgb(var(--border))",
								margin: "8px 12px",
								opacity: 0.5,
							}}
						/>

						{/* Theme Group */}
						<Command.Group>
							<div
								style={{
									padding: "8px 12px 6px",
									fontSize: "11px",
									fontWeight: 600,
									textTransform: "uppercase",
									letterSpacing: "0.05em",
									color: "rgb(var(--muted-foreground))",
									opacity: 0.7,
								}}
							>
								Theme
							</div>
							<CommandItem
								onSelect={() => runCommand(() => setTheme("light"))}
								icon={<Sun />}
								label="Light Mode"
							/>
							<CommandItem
								onSelect={() => runCommand(() => setTheme("dark"))}
								icon={<Moon />}
								label="Dark Mode"
							/>
							<CommandItem
								onSelect={() => runCommand(() => setTheme("system"))}
								icon={<Laptop />}
								label="System Default"
							/>
						</Command.Group>

						{/* Separator */}
						<div
							style={{
								height: "1px",
								backgroundColor: "rgb(var(--border))",
								margin: "8px 12px",
								opacity: 0.5,
							}}
						/>

						{/* Socials Group */}
						<Command.Group>
							<div
								style={{
									padding: "8px 12px 6px",
									fontSize: "11px",
									fontWeight: 600,
									textTransform: "uppercase",
									letterSpacing: "0.05em",
									color: "rgb(var(--muted-foreground))",
									opacity: 0.7,
								}}
							>
								Socials
							</div>
							<CommandItem
								onSelect={() =>
									runCommand(() =>
										window.open("https://github.com/Arindam200", "_blank"),
									)
								}
								icon={<Github />}
								label="GitHub Profile"
								shortcut="↗"
							/>
						</Command.Group>
					</Command.List>

					{/* Footer with keyboard hints */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							padding: "10px 16px",
							borderTop: "1px solid rgb(var(--border))",
							backgroundColor: "rgb(var(--muted) / 0.3)",
						}}
					>
						<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
							<KeyboardHint keys={["↑", "↓"]} label="Navigate" />
							<KeyboardHint keys={["↵"]} label="Select" />
							<KeyboardHint keys={["Esc"]} label="Close" />
						</div>
					</div>
				</Command>
			</div>
		</div>
	);
}

function CommandItem({
	icon,
	label,
	shortcut,
	onSelect,
}: {
	icon: React.ReactNode;
	label: string;
	shortcut?: string;
	onSelect: () => void;
}) {
	return (
		<Command.Item
			className="group"
			style={{
				display: "flex",
				alignItems: "center",
				gap: "12px",
				padding: "10px 12px",
				margin: "2px 0",
				borderRadius: "10px",
				cursor: "pointer",
				transition: "all 0.15s ease",
				outline: "none",
			}}
			onSelect={onSelect}
		>
			{/* Icon container */}
			<div
				className="group-aria-selected:scale-110"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: "32px",
					height: "32px",
					borderRadius: "8px",
					backgroundColor: "rgb(var(--secondary))",
					color: "rgb(var(--muted-foreground))",
					transition: "all 0.15s ease",
				}}
			>
				<span
					style={{
						width: "16px",
						height: "16px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{icon}
				</span>
			</div>

			{/* Label */}
			<span
				className="group-aria-selected:text-foreground"
				style={{
					flex: 1,
					fontSize: "14px",
					fontWeight: 500,
					fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
					letterSpacing: "-0.01em",
					color: "rgb(var(--foreground) / 0.8)",
					transition: "color 0.15s ease",
				}}
			>
				{label}
			</span>

			{/* Keyboard shortcut */}
			{shortcut && (
				<span
					className="group-aria-selected:opacity-100"
					style={{
						fontSize: "11px",
						fontWeight: 500,
						fontFamily: "monospace",
						padding: "3px 6px",
						borderRadius: "4px",
						backgroundColor: "rgb(var(--secondary))",
						color: "rgb(var(--muted-foreground))",
						opacity: 0.6,
						transition: "opacity 0.15s ease",
					}}
				>
					{shortcut}
				</span>
			)}

			{/* Selection indicator styles via CSS */}
			<style jsx>{`
				:global([cmdk-item][aria-selected="true"]) {
					background: linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--secondary)) 100%) !important;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				}
				:global([cmdk-item][aria-selected="true"]) > div:first-child {
					background: linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--primary) / 0.8) 100%) !important;
					color: rgb(var(--primary-foreground)) !important;
				}
			`}</style>
		</Command.Item>
	);
}

function KeyboardHint({ keys, label }: { keys: string[]; label: string }) {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
			<div style={{ display: "flex", gap: "3px" }}>
				{keys.map((key) => (
					<kbd
						key={key}
						style={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							minWidth: "20px",
							height: "20px",
							padding: "0 5px",
							fontSize: "10px",
							fontWeight: 500,
							fontFamily: "system-ui, -apple-system, sans-serif",
							backgroundColor: "rgb(var(--secondary))",
							color: "rgb(var(--muted-foreground))",
							borderRadius: "4px",
							border: "1px solid rgb(var(--border))",
						}}
					>
						{key}
					</kbd>
				))}
			</div>
			<span
				style={{
					fontSize: "11px",
					color: "rgb(var(--muted-foreground))",
					opacity: 0.7,
				}}
			>
				{label}
			</span>
		</div>
	);
}
