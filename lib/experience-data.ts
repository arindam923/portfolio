
export interface ExperienceEntry {
	id: string;
	company: string;
	role: string;
	period: string;
	location: string;
	logo: string;
	status?: string;
	links?: { type: "globe" | "x" | "github" | "linkedin"; url: string }[];
	technologies?: { name: string; icon: string }[];
	description?: string[];
}

export const experiences: ExperienceEntry[] = [
	{
		id: "1",
		company: "VA Bear",
		role: "Head of Engineering",
		period: "01/2026 - 03/2026",
		location: "India",
		logo: "https://www.vabear.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.438e7f00.png&w=1080&q=75&dpl=dpl_GyVo8bTyqapAy2ewmhURkS8ptAJr",
		links: [{ type: "globe", url: "#" }],
		description: [
			"Led development of a real-time hiring and escrow platform for production use.",
			"Built the core application architecture with Next.js and Convex.",
			"Designed secure escrow payment workflows for transaction safety and trust.",
			"Delivered a scalable and production-ready system architecture."
		],
		technologies: [
			{ name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
			{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
			{ name: "Convex", icon: "https://cdn.simpleicons.org/convex/EE342F" },
			{ name: "WebSockets", icon: "https://cdn.simpleicons.org/socketdotio/010101" }
		],
	},

	{
		id: "2",
		company: "Promote.fun",
		role: "Tech Lead & Co-Founder",
		period: "04/2025 - 12/2025",
		location: "India",
		logo: "https://promote.fun/logo/logo_green.png",
		links: [{ type: "globe", url: "#" }, { type: "github", url: "#" }],
		description: [
			"Built the platform from scratch and scaled it to over 16K users.",
			"Designed a real-time analytics system for engagement tracking.",
			"Integrated Solana USDC payments for fast on-chain transactions.",
			"Architected the full stack system including infrastructure and deployment.",
			"Led technical roadmap and product decisions."
		],
		technologies: [
			{ name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
			{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
			{ name: "Node.js", icon: "https://cdn.simpleicons.org/nodejs/3C873A" },
			{ name: "Solana", icon: "https://cdn.simpleicons.org/solana/9945FF" },
			{ name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/336791" },
			{ name: "Docker", icon: "https://cdn.simpleicons.org/docker/18179E" }
		],
	},
	{
		id: "3",
		company: "PaisaDekho",
		role: "Tech Lead",
		period: "02/2023 - 09/2024",
		location: "India",
		logo: "https://www.paisadekho.com/images/Header_New.svg",
		links: [{ type: "globe", url: "#" }, { type: "github", url: "#" }],
		description: [
			"Led a team of 13 engineers across fintech product initiatives.",
			"Scaled the platform to over 250K users.",
			"Migrated architecture from monolith to microservices.",
			"Improved performance, reliability, and deployment pipelines.",
			"Architected scalable web and mobile applications."
		],
		technologies: [
			{ name: "Docker", icon: "https://cdn.simpleicons.org/docker/18179E" },
			{ name: "Kubernetes", icon: "https://cdn.simpleicons.org/kubernetes/3261C6" },
			{ name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/336791" },
			{ name: "Node.js", icon: "https://cdn.simpleicons.org/Node.js/3C873A" },
			{ name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
		],
	},
	{
		id: "4",
		company: "Gululu Coin",
		role: "Full Stack Developer",
		period: "10/2024 - 03/2025",
		location: "India",
		logo: "https://swap.gululu.in/logo.png",
		links: [{ type: "globe", url: "#" }],
		description: [
			"Built real-time gaming systems integrated with the TON blockchain.",
			"Implemented secure wallet and transaction workflows.",
			"Optimized backend services for high concurrency workloads.",
			"Developed event-driven APIs for game and payment events."
		],
		technologies: [
			{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
			{ name: "Node.js", icon: "https://cdn.simpleicons.org/nodejs/3C873A" },
			{ name: "TON Blockchain", icon: "https://cdn.simpleicons.org/ton/0088CC" },
			{ name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
		],
	},
	{
		id: "5",
		company: "TruPay",
		role: "Full Stack Developer",
		period: "01/2022 - 02/2023",
		location: "India",
		logo: "https://trupay.com/wp-content/uploads/2025/07/images.png",
		links: [{ type: "globe", url: "https://www.thetrupay.com/" }],
		description: [
			"Built backend services supporting over 100K users.",
			"Designed event-driven pipelines using Apache Kafka.",
			"Integrated secure banking and compliance systems.",
			"Improved reliability and performance across frontend and backend."
		],
		technologies: [
			{ name: "Node.js", icon: "https://cdn.simpleicons.org/nodejs/3C873A" },
			{ name: "Kafka", icon: "https://cdn.simpleicons.org/apachekafka/231F20" },
			{ name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/336791" },
			{ name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" }
		],
	},
	{
		id: "6",
		company: "BuilderKit",
		role: "Junior Frontend Developer",
		period: "01/2021 - 09/2022",
		location: "India",
		logo: "https://cdn.prod.website-files.com/661adf1f90f30da22a246d41/662a2b3ae8c97f8a31946e64_Logo_256_256.webp",
		links: [{ type: "globe", url: "https://www.builderkit.ai/" }],
		description: [
			"Built responsive UI using React.",
			"Improved load performance by around 30%.",
			"Developed reusable component libraries.",
			"Fixed UI bugs and improved UX consistency."
		],
		technologies: [
			{ name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
			{ name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
			{ name: "HTML", icon: "https://cdn.simpleicons.org/html5/00569A" },
			{ name: "CSS", icon: "https://cdn.simpleicons.org/css/157EFB" }
		],
	}
]