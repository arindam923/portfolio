
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
	company: "PromoteFun",
	role: "Platform Architect / Founding Engineer",
	period: "2025",
	location: "Remote",
	logo: "https://promote.fun/logo/logo_green.png",
	links: [{ type: "globe", url: "#" }, { type: "github", url: "#" }],
	description: [
		"Served as the platform architect and founding engineer, responsible for designing and scaling the core infrastructure of the platform.",
		"Led a full backend migration in under 48 hours from a legacy MongoDB + VM architecture to a Cloudflare-based edge stack using Workers and D1 for improved performance and security.",
		"Built a real-time social tracking and analytics system that processed large volumes of user content data and delivered updates every few hours.",
		"Designed wallet management and transaction systems supporting real-time platform operations and high user concurrency.",
		"Engineered infrastructure resilient against heavy traffic and malicious requests, successfully handling up to 30 million daily DDoS attempts.",
		"Developed internal tools for monitoring, analytics, and social data ingestion used by platform operators and creators."
	],
	technologies: [
		{ name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
		{ name: "Cloudflare D1", icon: "https://cdn.simpleicons.org/cloudflare/000000" },
		{ name: "MongoDB", icon: "https://cdn.simpleicons.org/mongodb/4B0082" },
		{ name: "WebSockets", icon: "https://cdn.simpleicons.org/Socket.io/88C0D0" },
		{ name: "Docker", icon: "https://cdn.simpleicons.org/docker/18179E" }
	],
},
		
	{
	id: "2",
	company: "Gululu Coin",
	role: "Senior Full-Stack Developer",
	period: "2024 - 2025",
	location: "Remote",
	logo: "https://swap.gululu.in/logo.png",
	links: [{ type: "globe", url: "#" }, { type: "github", url: "#" }],
	description: [
		"Led development of a Telegram Mini App ecosystem including a staking and prediction-style platform similar to Polymarket, supporting more than 250k active users.",
		"Designed and implemented TON blockchain integrations including deposit/withdrawal systems and early smart contracts written in Func and Tact.",
		"Built scalable backend and infrastructure capable of handling large real-time user activity using autoscaling services, efficient API architecture, and optimized database access patterns.",
		"Developed secure wallet management, transaction processing, and real-time event systems for betting, staking, and prediction markets.",
	],
	technologies: [
		{ name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
		{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
		{ name: "Node.js", icon: "https://cdn.simpleicons.org/nodejs/3C873A" },
		{ name: "TON Blockchain", icon: "https://cdn.simpleicons.org/ton/000000" },
		{ name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/336791" },
		{ name: "Docker", icon: "https://cdn.simpleicons.org/docker/18179E" },
		{ name: "AWS", icon: "https://cdn.simpleicons.org/aws/1F78B0" },
		{ name: "WebSockets", icon: "https://cdn.simpleicons.org/websockets/88C0D0" }
	],
},
{
	id: "3",
	company: "Paisadekho",
	role: "Senior Full Stack Engineer",
	period: "2023 - 2024",
	location: "Jaipur, India",
	logo: "https://www.paisadekho.com/images/Header_New.svg",
	links: [{ type: "globe", url: "#" }, { type: "github", url: "#" }],
	description: [
		"Built secure financial data processing systems handling more than 30 million records daily from multiple data providers.",
		"Designed infrastructure inside AWS including VPC networking, secure SSH pipelines, and controlled data ingestion from partner financial institutions.",
		"Developed internal analytics and ETL tooling using Hadoop and Apache Spark for large-scale credit and financial data processing.",
		"Improved system scalability using Docker, Kubernetes, load balancing, and autoscaling infrastructure.",
		"Implemented distributed job orchestration using AWS SQS and Step Functions for reliable large dataset processing.",
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
	company: "Trupay",
	role: "Full Stack Developer",
	period: "2022 - 2023",
	location: "Delhi, India",
	logo: "https://trupay.com/wp-content/uploads/2025/07/images.png",
	links: [{ type: "globe", url: "https://www.thetrupay.com/" }],
	description: [
		"Developed fintech platform infrastructure including Next.js web applications and backend services supporting high-volume financial data pipelines.",
		"Built scalable AWS-based architecture using RDS, S3, Lambda, and Glue to process large financial datasets.",
		"Maintained and optimized PostgreSQL databases processing more than 15 million records twice daily.",
		"Helped design internal ETL pipelines to transform and process financial datasets for lending and credit systems.",
		"Worked across full stack development including frontend applications, APIs, and cloud infrastructure.",
	],
	technologies: [
		{ name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
		{ name: "Node.js", icon: "https://cdn.simpleicons.org/nodejs/3C873A" },
		{ name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/336791" },
		{ name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
	],
},
{
	id: "5",
	company: "BuilderKit",
	role: "Junior Frontend Developer",
	period: "2021 - 2022",
	location: "Remote",
	logo: "https://cdn.prod.website-files.com/661adf1f90f30da22a246d41/662a2b3ae8c97f8a31946e64_Logo_256_256.webp",
	links: [{ type: "globe", url: "https://www.builderkit.ai/" }],
	description: [
		"Worked as a junior frontend developer building reusable UI components across multiple company products.",
		"Developed applications using React class components and styled them using Styled Components and CSS-in-JS solutions.",
		"Collaborated with design teams to translate UI/UX designs into functional, responsive web interfaces.",
		"Maintained and extended shared component libraries used across several internal and client projects.",
	],
	technologies: [
		{ name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
		{ name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
		{ name: "HTML", icon: "https://cdn.simpleicons.org/html5/00569A" },
		{ name: "CSS", icon: "https://cdn.simpleicons.org/css/157EFB" }
	],
}
]