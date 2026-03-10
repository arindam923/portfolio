"use client";

import { useState } from "react";
import { ContactModal } from "./ContactModal";
import { ArrowUpRight } from "lucide-react";

const Connect = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<section className="mt-28 md:mt-36 w-full max-w-3xl mx-auto md:mx-0 border-t border-zinc-800/80 pt-16">
			<div className="flex flex-col md:flex-row justify-between items-start gap-12">
				<div className="max-w-md">
					<h2 className="text-3xl font-semibold tracking-tight text-white mb-4">
						Looking for a <br className="hidden md:block" />
						development partner?
					</h2>
					<p className="text-zinc-500 text-[15px] leading-relaxed mb-8">
						I frequently partner with individuals and teams to build
						high-performance products. If you have a project in mind, let's
						connect and discuss how I can help bring it to life.
					</p>

					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors group"
					>
						Get in Touch
						<ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
					</button>
				</div>

				{/* Location / Meta */}
				<div className="flex flex-col gap-6 shrink-0 w-full md:w-auto">
					<div>
						<h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">
							Location
						</h3>
						<p className="text-sm font-medium text-zinc-400">
							Kolkata, India
							<span className="block text-zinc-600 font-mono mt-1">
								GMT+5:30
							</span>
						</p>
					</div>

					<div>
						<h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">
							Social
						</h3>
						<div className="flex flex-col gap-3">
							<a
								href="https://github.com/arindam923"
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
							>
								GitHub
							</a>
							<a
								href="https://twitter.com/mars87153"
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
							>
								X (Twitter)
							</a>
						</div>
					</div>
				</div>
			</div>

			<ContactModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</section>
	);
};

export default Connect;
