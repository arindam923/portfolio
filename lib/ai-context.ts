import { experiences } from "./experience-data";
import fs from "fs";
import path from "path";

/**
 * Builds the structured "about Arindam" summary from experience data.
 * Used by the AI call chat API as system context.
 */
export function getExperienceSummary(): string {
	const lines: string[] = [
		"## Experience (company, role, period, location)",
		...experiences.map(
			(e) =>
				`- ${e.company}: ${e.role} (${e.period}, ${e.location})${e.status ? ` [${e.status}]` : ""}`
		),
	];

	const techSet = new Set<string>();
	experiences.forEach((e) => {
		e.technologies?.forEach((t) => techSet.add(t.name));
	});
	if (techSet.size > 0) {
		lines.push("", "## Tech stack (from experience)");
		lines.push(Array.from(techSet).join(", "));
	}

	experiences.forEach((e) => {
		if (e.description?.length) {
			lines.push("", `### ${e.company} — highlights`);
			e.description.forEach((d) => lines.push(`- ${d}`));
		}
	});

	return lines.join("\n");
}

/**
 * Reads the freeform about-me markdown from content/about-me.md.
 * Call from server only (uses fs).
 */
export function getAboutMeMarkdown(): string {
	try {
		const filePath = path.join(process.cwd(), "content", "about-me.md");
		return fs.readFileSync(filePath, "utf-8");
	} catch {
		return "";
	}
}

/**
 * Full system context for the AI call: experience summary + about-me markdown.
 */
export function getSystemContext(): string {
	const experience = getExperienceSummary();
	const aboutMe = getAboutMeMarkdown();

	return `You are a friendly AI assistant representing Arindam Roy. You are having a live text chat with someone who visited Arindam's portfolio. Answer questions about Arindam based only on the context below. Be concise, warm, and professional. If asked something you don't know, say so. Suggest they reach out on Twitter (@mars87153) or GitHub (arindam923) for direct contact.

---

${experience}

---

## Additional context (current focus, interests)

${aboutMe || "(No additional context.)"}`;
}
