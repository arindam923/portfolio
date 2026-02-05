"use client";

import Image from "next/image";

const ProfileCard = () => {
	return (
		<div className="pt-10 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-10">
			{/* Avatar Container */}
			<div className="relative flex-shrink-0 mb-6 sm:mb-0">
				<div className="w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-2xl bg-[#ffeb3b] overflow-hidden flex items-center justify-center border-4 border-primary/10">
					<Image
						src="/arindam.JPG"
						alt="Arindam Roy Avatar"
						width={180}
						height={180}
						sizes="(max-width: 640px) 150px, 180px"
						placeholder="blur"
						blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
						className="w-full h-full object-cover"
						priority
					/>
				</div>
			</div>

			{/* Info Container */}
			<div className="flex-grow">
				<h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
					Arindam Roy
				</h1>
				<p className="text-muted-foreground text-lg leading-relaxed max-w-xl mb-8">
					I&apos;m a Full Stack web developer and Open Source Contributor, I
					love building products to solve real-world problems. I&apos;m
					specialized in building MVP&apos;s.
				</p>

				<div>
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
						Skills
					</h3>
					<div className="flex flex-wrap gap-4 items-center">
						{/* React */}
						<Image
							src="https://cdn.simpleicons.org/react/61DAFB"
							width={24}
							height={24}
							className="h-6 w-auto"
							alt="React"
							unoptimized
						/>
						{/* TS */}
						<Image
							src="https://cdn.simpleicons.org/typescript/3178C6"
							width={24}
							height={24}
							className="h-6 w-auto"
							alt="TypeScript"
							unoptimized
						/>
						{/* MongoDB */}
						<Image
							src="https://cdn.simpleicons.org/rust/ffffff"
							width={24}
							height={24}
							className="h-6 w-auto dark:invert-0 invert"
							alt="Rust"
							unoptimized
						/>
						<Image
							src="https://cdn.simpleicons.org/go/00ADD8"
							width={24}
							height={24}
							className="h-6 w-auto"
							alt="Golang"
							unoptimized
						/>
						{/* Next.js */}
						<Image
							src="https://cdn.simpleicons.org/nextdotjs/FFFFFF"
							width={24}
							height={24}
							className="h-6 w-auto dark:invert-0 invert"
							alt="Next.js"
							unoptimized
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileCard;
