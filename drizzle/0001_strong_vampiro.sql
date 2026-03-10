ALTER TABLE `messages` ADD `ip` text;--> statement-breakpoint
CREATE INDEX `messages_ip_created_at_idx` ON `messages` (`ip`,`created_at`);