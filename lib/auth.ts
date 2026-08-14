import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { getDb, type AdminRecord } from "../db";
import { verifyPassword } from "./password";

export const SESSION_COOKIE = "rm_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 12;

export type SafeAdmin = {
  id: string;
  username: string;
  displayName: string;
  role: "captain" | "leader";
  groupName: string | null;
};

function sessionId(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function safeAdmin(admin: AdminRecord): SafeAdmin {
  return { id: admin.id, username: admin.username, displayName: admin.display_name, role: admin.role, groupName: admin.group_name };
}

export function authenticate(username: string, password: string) {
  const db = getDb();
  const admin = db.prepare("SELECT * FROM admins WHERE username = ? AND active = 1").get(username) as AdminRecord | undefined;
  if (!admin || !verifyPassword(password, admin.password_hash)) return null;

  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  db.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").run(now);
  db.prepare("INSERT INTO admin_sessions (id, admin_id, expires_at, created_at) VALUES (?, ?, ?, ?)")
    .run(sessionId(token), admin.id, now + SESSION_MAX_AGE * 1000, now);
  return { token, admin: safeAdmin(admin) };
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(),
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: shouldUseSecureCookie(), path: "/", maxAge: 0 });
}

function shouldUseSecureCookie() {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;
  return process.env.NODE_ENV === "production";
}

function adminForToken(token: string | undefined) {
  if (!token) return null;
  const admin = getDb().prepare(`
    SELECT a.* FROM admins a
    INNER JOIN admin_sessions s ON s.admin_id = a.id
    WHERE s.id = ? AND s.expires_at > ? AND a.active = 1
  `).get(sessionId(token), Date.now()) as AdminRecord | undefined;
  return admin ? safeAdmin(admin) : null;
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  return adminForToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export function getRequestAdmin(request: NextRequest) {
  return adminForToken(request.cookies.get(SESSION_COOKIE)?.value);
}

export function destroyRequestSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM admin_sessions WHERE id = ?").run(sessionId(token));
}

export function canAccessGroup(admin: SafeAdmin, primaryGroup: string, secondaryGroup?: string | null) {
  if (admin.role === "captain") return true;
  return primaryGroup === "不确定" || secondaryGroup === "不确定" || primaryGroup === admin.groupName || secondaryGroup === admin.groupName;
}
