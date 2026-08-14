CREATE TABLE `applications` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`year` text NOT NULL,
	`major` text NOT NULL,
	`primary_group` text NOT NULL,
	`secondary_group` text,
	`about` text NOT NULL,
	`resume_key` text NOT NULL,
	`resume_filename` text NOT NULL,
	`resume_content_type` text DEFAULT 'application/pdf' NOT NULL,
	`resume_size` integer NOT NULL,
	`status` text DEFAULT '新投递' NOT NULL,
	`score` integer DEFAULT 80 NOT NULL,
	`review_note` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_applications_status_created_at` ON `applications` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_applications_primary_group` ON `applications` (`primary_group`);--> statement-breakpoint
PRAGMA optimize;
