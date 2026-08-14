import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const applications = sqliteTable(
  "applications",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    year: text("year").notNull(),
    major: text("major").notNull(),
    primaryGroup: text("primary_group").notNull(),
    secondaryGroup: text("secondary_group"),
    about: text("about").notNull(),
    resumeKey: text("resume_key").notNull(),
    resumeFilename: text("resume_filename").notNull(),
    resumeContentType: text("resume_content_type").notNull().default("application/pdf"),
    resumeSize: integer("resume_size").notNull(),
    status: text("status").notNull().default("新投递"),
    score: integer("score").notNull().default(80),
    reviewNote: text("review_note").notNull().default(""),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [
    index("idx_applications_status_created_at").on(table.status, table.createdAt),
    index("idx_applications_primary_group").on(table.primaryGroup),
  ],
);

export type Application = typeof applications.$inferSelect;
