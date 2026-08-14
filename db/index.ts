import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { hashPassword } from "../lib/password";

const globalDatabase = globalThis as typeof globalThis & { rmDatabase?: Database.Database };

export const dataDirectory = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), "data"));
export const resumeDirectory = path.join(dataDirectory, "resumes");

export function getDb() {
  if (globalDatabase.rmDatabase) return globalDatabase.rmDatabase;

  mkdirSync(resumeDirectory, { recursive: true, mode: 0o700 });
  const database = new Database(path.join(dataDirectory, "rm-recruit.sqlite"));
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  database.pragma("busy_timeout = 5000");

  database.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      year TEXT NOT NULL,
      major TEXT NOT NULL,
      primary_group TEXT NOT NULL,
      secondary_group TEXT,
      about TEXT NOT NULL,
      resume_key TEXT NOT NULL,
      resume_filename TEXT NOT NULL,
      resume_content_type TEXT NOT NULL DEFAULT 'application/pdf',
      resume_size INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT '新投递',
      score INTEGER NOT NULL DEFAULT 80,
      review_note TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_applications_status_created_at
      ON applications(status, created_at);
    CREATE INDEX IF NOT EXISTS idx_applications_primary_group
      ON applications(primary_group);
    CREATE INDEX IF NOT EXISTS idx_applications_secondary_group
      ON applications(secondary_group);

    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('captain', 'leader')),
      group_name TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at
      ON admin_sessions(expires_at);
  `);

  database.prepare("UPDATE applications SET primary_group = '算法组' WHERE primary_group = '视觉组'").run();
  database.prepare("UPDATE applications SET secondary_group = '算法组' WHERE secondary_group = '视觉组'").run();
  database.prepare("UPDATE admins SET group_name = '算法组' WHERE group_name = '视觉组'").run();
  bootstrapCaptain(database);
  database.pragma("optimize");

  globalDatabase.rmDatabase = database;
  return database;
}

function bootstrapCaptain(database: Database.Database) {
  const count = database.prepare("SELECT COUNT(*) AS count FROM admins").get() as { count: number };
  if (count.count > 0) return;

  const username = process.env.CAPTAIN_USERNAME?.trim();
  const password = process.env.CAPTAIN_PASSWORD;
  if (!username || !password) return;
  if (password.length < 10) throw new Error("CAPTAIN_PASSWORD must contain at least 10 characters");

  const now = Date.now();
  database.prepare(`
    INSERT INTO admins (id, username, password_hash, display_name, role, group_name, active, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'captain', NULL, 1, ?, ?)
  `).run(crypto.randomUUID(), username, hashPassword(password), process.env.CAPTAIN_DISPLAY_NAME?.trim() || "队长", now, now);
}

export type AdminRole = "captain" | "leader";
export type AdminRecord = {
  id: string;
  username: string;
  password_hash: string;
  display_name: string;
  role: AdminRole;
  group_name: string | null;
  active: number;
  created_at: number;
  updated_at: number;
};

export type ApplicationRecord = {
  id: string;
  name: string;
  phone: string;
  year: string;
  major: string;
  primary_group: string;
  secondary_group: string | null;
  about: string;
  resume_key: string;
  resume_filename: string;
  resume_content_type: string;
  resume_size: number;
  status: string;
  score: number;
  review_note: string;
  created_at: number;
  updated_at: number;
};
