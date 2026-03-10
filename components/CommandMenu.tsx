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
	ArrowRight,
	Command as CommandIcon,
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

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				onOpenChange(!open);
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

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
			{/* Backdrop */}
			<div
				onClick={() => onOpenChange(false)}
				className="fixed inset-0 bg-black/40 backdrop-blur-sm"
			/>

			{/* Command Palette */}
			<div className="relative w-[90%] max-w-[560px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
				<Command className="relative flex flex-col h-full" loop>
					{/* Header / Search */}
					<div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-900 bg-zinc-950">
						<Search className="w-5 h-5 text-zinc-500" />
						<Command.Input
							className="flex-1 bg-transparent text-white placeholder:text-zinc-600 outline-none text-base font-medium"
							placeholder="Type a command or search..."
							autoFocus
						/>
						<div className="flex items-center px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
							<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
								ESC
							</span>
						</div>
					</div>

					{/* Content */}
					<Command.List className="max-h-[380px] overflow-y-auto p-2 scrollbar-hide focus:outline-none bg-zinc-950">
						<Command.Empty className="py-12 flex flex-col items-center justify-center text-zinc-500">
							<div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-600">
								<Search className="w-6 h-6" />
							</div>
							<p className="text-sm font-medium">No results found.</p>
						</Command.Empty>

						<CommandGroup heading="Navigation">
							<CommandItem
								onSelect={() => runCommand(() => router.push("/"))}
								icon={<User className="w-4 h-4" />}
								label="Home"
								shortcut="G H"
							/>
							<CommandItem
								onSelect={() => runCommand(() => router.push("/#experience"))}
								icon={<Briefcase className="w-4 h-4" />}
								label="Work Experience"
								shortcut="G W"
							/>
							<CommandItem
								onSelect={() => runCommand(() => router.push("/#projects"))}
								icon={<Monitor className="w-4 h-4" />}
								label="Projects"
								shortcut="G P"
							/>
							<CommandItem
								onSelect={() => runCommand(() => router.push("/#blogs"))}
								icon={<FileText className="w-4 h-4" />}
								label="Blog Posts"
								shortcut="G B"
							/>
						</CommandGroup>

						<div className="h-px bg-zinc-900 my-2 mx-2" />

						<CommandGroup heading="Theme">
							<CommandItem
								onSelect={() => runCommand(() => setTheme("light"))}
								icon={<Sun className="w-4 h-4" />}
								label="Light Mode"
							/>
							<CommandItem
								onSelect={() => runCommand(() => setTheme("dark"))}
								icon={<Moon className="w-4 h-4" />}
								label="Dark Mode"
							/>
							<CommandItem
								onSelect={() => runCommand(() => setTheme("system"))}
								icon={<Laptop className="w-4 h-4" />}
								label="System Default"
							/>
						</CommandGroup>

						<div className="h-px bg-zinc-900 my-2 mx-2" />

						<CommandGroup heading="Socials">
							<CommandItem
								onSelect={() =>
									runCommand(() =>
										window.open("https://github.com/arindam923", "_blank"),
									)
								}
								icon={<Github className="w-4 h-4" />}
								label="GitHub Profile"
								shortcut="↗"
							/>
						</CommandGroup>
					</Command.List>

					{/* Footer */}
					<div className="flex items-center justify-between px-5 py-3 border-t border-zinc-900 bg-zinc-950 text-zinc-500">
						<div className="flex items-center gap-4">
							<KeyboardHint keys={["↑", "↓"]} label="Navigate" />
							<KeyboardHint keys={["↵"]} label="Select" />
						</div>
						<div className="flex items-center gap-2 text-[11px] font-medium tracking-tight">
							<CommandIcon className="w-3 h-3" />
							<span>Command Menu</span>
						</div>
					</div>
				</Command>
			</div>
		</div>
	);
}

function CommandGroup({
	heading,
	children,
}: {
	heading: string;
	children: React.ReactNode;
}) {
	return (
		<Command.Group
			heading={
				<div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase font-mono tracking-widest mb-1">
					{heading}
				</div>
			}
		>
			{children}
		</Command.Group>
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
			onSelect={onSelect}
			className="group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-zinc-900 aria-selected:border-zinc-800 transition-colors duration-150 outline-none border border-transparent"
		>
			<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-aria-selected:text-white transition-colors">
				{icon}
			</div>

			<span className="flex-1 text-sm font-medium text-zinc-400 group-aria-selected:text-white transition-colors">
				{label}
			</span>

			{shortcut ? (
				<span className="text-[11px] font-mono text-zinc-600 group-aria-selected:text-zinc-500 transition-colors">
					{shortcut}
				</span>
			) : (
				<ArrowRight className="w-4 h-4 text-zinc-700 group-aria-selected:text-zinc-500 opacity-0 group-aria-selected:opacity-100 transition-all transform translate-x-1 group-aria-selected:translate-x-0" />
			)}
		</Command.Item>
	);
}

function KeyboardHint({ keys, label }: { keys: string[]; label: string }) {
	return (
		<div className="flex items-center gap-2">
			<div className="flex gap-1">
				{keys.map((key) => (
					<kbd
						key={key}
						className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded border border-zinc-800 bg-zinc-900 text-[10px] font-medium text-zinc-500 font-mono"
					>
						{key}
					</kbd>
				))}
			</div>
			<span className="text-xs font-mono tracking-widest uppercase text-zinc-600">
				{label}
			</span>
		</div>
	);
}
