"use client";

import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";

interface GitHubCalendarClientProps {
	username: string;
}

export function GitHubCalendarClient({ username }: GitHubCalendarClientProps) {
	const [mounted, setMounted] = useState(false);
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="min-h-[128px] w-full" aria-hidden />;
	}

	return (
		<GitHubCalendar
			username={username}
			colorScheme={resolvedTheme === "light" ? "light" : "dark"}
		/>
	);
}
