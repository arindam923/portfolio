"use client";

const ProjectPage = () => {
	return (
		<main className="max-w-4xl mx-auto px-6 mt-10 py-20">
			<section className="mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
				<h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground">
					Project
				</h1>
				<p className="text-muted-foreground text-lg max-w-2xl font-medium">
					My projects and work across different technologies and domains.
				</p>
			</section>

			<section className="mb-16">
				<h2 className="text-xl font-bold mb-6 text-foreground">Popular Tags</h2>
			</section>

			<section className="mb-16">
				<h2 className="text-xl font-bold mb-6 text-foreground">All Projects</h2>
			</section>
		</main>
	);
};

export default ProjectPage;
