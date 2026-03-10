"use client";

import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";

interface GitHubCalendarClientProps {
	username: string;
}

export function GitHubCalendarClient({ username }: GitHubCalendarClientProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="min-h-[128px] w-full" aria-hidden />;
	}

	return <GitHubCalendar username={username} />;
}
