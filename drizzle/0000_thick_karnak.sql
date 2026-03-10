CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`ai_reply` text,
	`created_at` integer
);
