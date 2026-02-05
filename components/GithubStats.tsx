"use client";

import { useEffect, useState } from "react";

interface ContributionDay {
	date: string;
	count: number;
	level: number;
}

const GithubStats = () => {
	const [data, setData] = useState<{
		total: number;
		weeks: ContributionDay[][];
	} | null>(null);

	useEffect(() => {
		const demoContributions: ContributionDay[] = [];
		const startDate = new Date("2025-01-01");
		const endDate = new Date("2025-12-31");
		let totalCount = 0;

		for (
			let d = new Date(startDate);
			d <= endDate;
			d.setDate(d.getDate() + 1)
		) {
			// Make it dense: 85% chance of contribution
			const hasContributed = Math.random() > 0.15;
			const count = hasContributed ? Math.floor(Math.random() * 12) + 1 : 0;
			let level = 0;
			if (count > 0) {
				if (count < 3) level = 1;
				else if (count < 6) level = 2;
				else if (count < 9) level = 3;
				else level = 4;
			}

			demoContributions.push({
				date: d.toISOString().split("T")[0],
				count,
				level,
			});
			totalCount += count;
		}

		const weeks: ContributionDay[][] = [];
		for (let i = 0; i < demoContributions.length; i += 7) {
			weeks.push(demoContributions.slice(i, i + 7));
		}

		setData({ total: totalCount, weeks });
	}, []);

	if (!data) {
		return (
			<div className="mt-16 w-full animate-pulse">
				<div className="h-24 bg-zinc-900/50 rounded-xl mb-6"></div>
				<div className="h-48 bg-zinc-900/50 rounded-xl"></div>
			</div>
		);
	}

	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	return (
		<div className="mt-12 w-full">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-2">
				<div>
					<h4 className="text-sm font-medium text-muted-foreground mb-1">
						Featured
					</h4>
					<h2 className="text-2xl font-bold text-foreground mb-1">
						2025 Activity
					</h2>
					<p className="text-sm text-muted-foreground">
						Total in 2025:{" "}
						<span className="text-foreground font-semibold">
							{data.total.toLocaleString()}
						</span>{" "}
						contributions
					</p>
				</div>

				<div className="mt-4 sm:mt-0 flex items-center gap-2 text-sm text-muted-foreground">
					<span className="flex items-center gap-1.5">
						<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
						Online
					</span>
				</div>
			</div>

			<div className="bg-card border border-border/50 rounded-xl p-6 overflow-x-auto">
				<div className="min-w-[700px]">
					<div className="flex text-[10px] text-muted-foreground mb-2 pl-4">
						{months.map((month) => (
							<div key={month} className="flex-1">
								{month}
							</div>
						))}
					</div>

					<div className="flex gap-[3px]">
						{data.weeks.map((week, weekIndex) => (
							<div
								key={`week-${weekIndex}`}
								className="flex flex-col gap-[3px]"
							>
								{week.map((day) => {
									const colors = [
										"bg-secondary/50", // 0
										"bg-[#0e4429]", // 1
										"bg-[#006d32]", // 2
										"bg-[#26a641]", // 3
										"bg-[#39d353]", // 4
									];
									return (
										<div
											key={day.date}
											title={`${day.count} contributions on ${day.date}`}
											className={`w-[10px] h-[10px] rounded-[2px] ${colors[day.level]} transition-colors hover:ring-1 hover:ring-foreground/20`}
										/>
									);
								})}
							</div>
						))}
					</div>

					<div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-muted-foreground">
						<span>Less</span>
						<div className="flex gap-[3px]">
							<div className="w-[10px] h-[10px] rounded-[2px] bg-secondary/50" />
							<div className="w-[10px] h-[10px] rounded-[2px] bg-[#0e4429]" />
							<div className="w-[10px] h-[10px] rounded-[2px] bg-[#006d32]" />
							<div className="w-[10px] h-[10px] rounded-[2px] bg-[#26a641]" />
							<div className="w-[10px] h-[10px] rounded-[2px] bg-[#39d353]" />
						</div>
						<span>More</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GithubStats;
