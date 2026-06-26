import { Resend } from "resend";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });

const {
	RESEND_API_KEY,
	RESEND_FROM_EMAIL,
	CONTACT_TO_EMAIL,
} = process.env;

function pass(label: string) {
	console.log(`\x1b[32m  ✓\x1b[0m ${label}`);
}

function fail(label: string, detail?: unknown) {
	console.log(`\x1b[31m  ✗\x1b[0m ${label}`);
	if (detail) console.log(`      ${detail}`);
}

async function main() {
	console.log("\n\x1b[1mResend Email Test\x1b[0m\n");

	// 1. Environment variable checks
	console.log("\x1b[1m[1/3] Environment variables\x1b[0m");
	let envOk = true;
	if (!RESEND_API_KEY) {
		fail("RESEND_API_KEY is set");
		envOk = false;
	} else {
		pass(
			`RESEND_API_KEY is set (${RESEND_API_KEY.slice(0, 8)}…${RESEND_API_KEY.slice(-4)})`,
		);
	}
	if (!RESEND_FROM_EMAIL) {
		fail("RESEND_FROM_EMAIL is set");
		envOk = false;
	} else {
		pass(`RESEND_FROM_EMAIL is set (${RESEND_FROM_EMAIL})`);
	}
	if (!CONTACT_TO_EMAIL) {
		fail("CONTACT_TO_EMAIL is set");
		envOk = false;
	} else {
		pass(`CONTACT_TO_EMAIL is set (${CONTACT_TO_EMAIL})`);
	}
	if (!envOk) {
		console.log(
			"\n\x1b[31mMissing env vars — fix your .env before continuing.\x1b[0m\n",
		);
		process.exit(1);
	}

	// 2. Resend client init
	console.log("\n\x1b[1m[2/3] Resend client\x1b[0m");
	let resend: Resend;
	try {
		resend = new Resend(RESEND_API_KEY);
		pass("Resend client initialized");
	} catch (err) {
		fail("Resend client initialized", err);
		process.exit(1);
	}

	// 3. Send a test email (notification + thank-you, mirroring contact route)
	console.log("\n\x1b[1m[3/3] Send test emails\x1b[0m");
	const fromEmail = RESEND_FROM_EMAIL || "onboarding@resend.dev";
	const toEmail = CONTACT_TO_EMAIL!;

	const results = await Promise.allSettled([
		resend.emails.send({
			from: `Portfolio Test <${fromEmail}>`,
			to: toEmail,
			subject: `[Test] Notification email from test-resend.ts`,
			html: `
				<!DOCTYPE html><html><body style="font-family:sans-serif;background:#09090b;color:#fafafa;padding:24px;">
					<h1>Notification test</h1>
					<p>This is a test notification email from <code>scripts/test-resend.ts</code>.</p>
				</body></html>
			`,
		}),
		resend.emails.send({
			from: `Arindam <${fromEmail}>`,
			to: toEmail,
			subject: `[Test] Thank-you email from test-resend.ts`,
			html: `
				<!DOCTYPE html><html><body style="font-family:sans-serif;background:#09090b;color:#fafafa;padding:24px;">
					<h1>Thank-you test</h1>
					<p>This is a test thank-you email from <code>scripts/test-resend.ts</code>.</p>
				</body></html>
			`,
		}),
	]);

	const labels = ["Notification email", "Thank-you email"];
	let allOk = true;
	results.forEach((r, i) => {
		if (r.status === "fulfilled") {
			const id = (r.value as { data?: { id?: string } | null }).data?.id;
			if (id) {
				pass(`${labels[i]} sent (id: ${id})`);
			} else {
				fail(`${labels[i]} sent`, JSON.stringify(r.value));
				allOk = false;
			}
		} else {
			fail(`${labels[i]} sent`, r.reason?.message ?? r.reason);
			allOk = false;
		}
	});

	console.log(
		allOk
			? "\n\x1b[32mAll email tests passed.\x1b[0m\n"
			: "\n\x1b[31mOne or more email tests failed — see above.\x1b[0m\n",
	);
	process.exit(allOk ? 0 : 1);
}

main().catch((err) => {
	console.error("\n\x1b[31mFatal error:\x1b[0m", err);
	process.exit(1);
});
