CREATE TABLE `request_rate_limits` (
	`ip` text PRIMARY KEY NOT NULL,
	`spam_count` integer DEFAULT 0 NOT NULL,
	`blocked_until` integer,
	`updated_at` integer
);
--> statement-breakpoint
ALTER TABLE `messages` DROP COLUMN `ai_reply`;