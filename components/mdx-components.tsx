import React, { Fragment, Children } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CopyButton } from "./copy-button";

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const MDXComponents = {
	pre: ({ children, ...props }: any) => {
		const codeString = children.props.children ?? "";
		return (
			<div className="group relative my-8 rounded-[24px] border border-border bg-card p-2 shadow-xl">
				<CopyButton code={codeString} />

				<div className="rounded-[18px] border border-border/50 bg-muted/50 p-6 overflow-hidden">
					<pre
						{...props}
						className="bg-transparent !m-0 !p-0 text-foreground font-mono text-sm leading-relaxed"
					>
						{children}
					</pre>
				</div>
			</div>
		);
	},

	Resource: ({
		title,
		description,
		href,
	}: {
		title: string;
		description: string;
		href: string;
	}) => (
		<Link
			href={href}
			className="group block p-4 my-4 rounded-xl border border-border bg-card hover:border-blue-500/50 transition-all duration-300 no-underline"
		>
			<div className="flex justify-between items-start">
				<h4 className="m-0 font-medium text-foreground">{title}</h4>
				<ExternalLink
					size={14}
					className="text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
				/>
			</div>
			<p className="m-0 mt-1 text-sm text-muted-foreground line-clamp-1">
				{description}
			</p>
		</Link>
	),
	h1: ({ className, ...props }: any) => (
		<h1
			className={cn(
				"mt-12 scroll-m-20 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl",
				className,
			)}
			{...props}
		/>
	),
	h2: ({ className, ...props }: any) => (
		<h2
			className={cn(
				"mt-12 scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight text-foreground first:mt-0",
				className,
			)}
			{...props}
		/>
	),
	h3: ({ className, ...props }: any) => (
		<h3
			className={cn(
				"mt-8 scroll-m-20 text-xl font-semibold tracking-tight text-foreground",
				className,
			)}
			{...props}
		/>
	),
	h4: ({ className, ...props }: any) => (
		<h4
			className={cn(
				"mt-6 scroll-m-20 text-lg font-medium tracking-tight text-foreground",
				className,
			)}
			{...props}
		/>
	),

	p: ({ className, children, ...props }: any) => {
		const childrenArray = Children.toArray(children);
		const hasBlockElement = childrenArray.some((child) => {
			if (!React.isValidElement(child)) return false;
			const childType = child.type as { displayName?: string; name?: string };
			const displayName = childType.displayName || childType.name;
			return (
				displayName &&
				[
					"h1",
					"h2",
					"h3",
					"h4",
					"h5",
					"h6",
					"ul",
					"ol",
					"li",
					"blockquote",
					"pre",
					"code",
					"div",
					"figure",
					"StepHeader",
				].includes(displayName)
			);
		});

		if (hasBlockElement) {
			return <Fragment {...props}>{children}</Fragment>;
		}

		return (
			<p
				className={cn(
					"leading-7 text-muted-foreground [&:not(:first-child)]:mt-6",
					className,
				)}
				{...props}
			/>
		);
	},

	strong: ({ className, ...props }: any) => (
		<strong
			className={cn(
				"font-semibold text-foreground underline underline-offset-4 decoration-muted-foreground/30 decoration-2",
				className,
			)}
			{...props}
		/>
	),

	Image: ({
		src,
		alt,
		caption,
	}: {
		src: string;
		alt: string;
		caption?: string;
	}) => (
		<figure className="my-8">
			<div className="relative aspect-video overflow-hidden rounded-xl border border-border">
				<Image
					src={src}
					alt={alt}
					fill
					className="object-cover transition-transform duration-500 hover:scale-105"
				/>
			</div>
			{caption && (
				<figcaption className="mt-3 text-center text-sm text-muted-foreground">
					{caption}
				</figcaption>
			)}
		</figure>
	),

	ul: ({ children }: any) => (
		<div className="my-6 px-6">
			<ul className="list-none space-y-3 p-0 text-muted-foreground">
				{children}
			</ul>
		</div>
	),
	ol: ({ className, ...props }: any) => (
		<ol
			className={cn(
				"my-6 ml-6 list-decimal space-y-3 text-muted-foreground",
				className,
			)}
			{...props}
		/>
	),
	blockquote: ({ className, ...props }: any) => (
		<blockquote
			className={cn(
				"mt-6 border-l-2 border-border pl-6 italic text-muted-foreground",
				className,
			)}
			{...props}
		/>
	),

	li: ({ children }: any) => {
		const isTask = Array.isArray(children)
			? children[0]?.props?.type === "checkbox"
			: children?.props?.type === "checkbox";

		if (isTask) {
			return (
				<li className="flex items-start gap-4 transition-opacity hover:opacity-80 text-muted-foreground">
					{children}
				</li>
			);
		}

		return (
			<li className="relative pl-10 before:absolute before:left-1 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-muted-foreground/50 text-muted-foreground">
				{children}
			</li>
		);
	},

	input: ({ type, checked }: any) => {
		if (type === "checkbox") {
			return (
				<div className="relative flex mt-1 shrink-0 items-center justify-center">
					<input
						type="checkbox"
						defaultChecked={checked}
						readOnly
						className="peer h-5 w-5 cursor-default appearance-none rounded-[6px] border border-muted-foreground/30 bg-transparent transition-all checked:border-blue-500 checked:bg-blue-500"
					/>
					<Check
						className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
						strokeWidth={4}
					/>
				</div>
			);
		}
		return <input type={type} readOnly />;
	},

	StepHeader: ({ children }: { children: React.ReactNode }) => (
		<h4 className="mt-8 mb-4 text-[15px] font-medium text-foreground tracking-tight">
			{children}
		</h4>
	),
};
