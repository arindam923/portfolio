import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// dotenv/config only reads `.env` — mirror Next.js behaviour by loading
// `.env.local` first (overrides), then `.env` as the base.
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
    schema: "./db/schema.ts",
    out: "./drizzle",
    dialect: "turso",
    dbCredentials: {
        url: process.env.TURSO_CONNECTION_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    },
});
