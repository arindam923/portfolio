import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const messages = sqliteTable("messages", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    ip: text("ip"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    aiReply: text("ai_reply"),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (table) => [
    // Composite index for rate limiting queries (ip + createdAt)
    index("messages_ip_created_at_idx").on(table.ip, table.createdAt),
]);
