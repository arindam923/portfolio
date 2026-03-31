import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const messages = sqliteTable("messages", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	ip: text("ip"),
	contact: text("contact").notNull().default(""),
	subject: text("subject").notNull(),
	message: text("message").notNull(),
	moderationStatus: text("moderation_status").notNull().default("pending"),
	createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (table) => [
	// Composite index for queue/rate limit queries (ip + status + createdAt)
	index("messages_ip_status_created_at_idx").on(table.ip, table.moderationStatus, table.createdAt),
	index("messages_ip_created_at_idx").on(table.ip, table.createdAt),
]);

export const requestRateLimits = sqliteTable("request_rate_limits", {
	ip: text("ip").primaryKey(),
	spamCount: integer("spam_count").notNull().default(0),
	blockedUntil: integer("blocked_until", { mode: "timestamp" }),
	updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
