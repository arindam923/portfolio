"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ code }: { code: string }) {
	const [isCopied, setIsCopied] = useState(false);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<button
			type="button"
			onClick={copy}
			className="absolute top-5 right-5 z-20 h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 shadow-sm opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700"
			aria-label="Copy code"
		>
			{isCopied ? (
				<Check size={14} className="text-emerald-600 dark:text-emerald-400 stroke-[3]" />
			) : (
				<Copy size={14} className="stroke-[2.5]" />
			)}
		</button>
	);
}
