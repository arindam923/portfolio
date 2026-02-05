"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ code }: { code: string }) {
	const [isCopied, setIsCopied] = useState(false);

	const copy = async () => {
		await navigator.clipboard.writeText(code);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	return (
		<div className="relative w-full flex justify-end">
			<button
				type="button"
				onClick={copy}
				className="z-20 h-8 w-8 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 p-2 text-zinc-500 dark:text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 opacity-0 group-hover:opacity-100"
				aria-label="Copy code"
			>
				{isCopied ? <Check size={14} /> : <Copy size={14} />}
			</button>
		</div>
	);
}
