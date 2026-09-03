import { NextRequest, NextResponse } from "next/server";
import { getDb, type AdminRecord } from "../../../../db";
import { getRequestAdmin } from "../../../../lib/auth";
import { hashPassword } from "../../../../lib/password";

export const runtime = "nodejs";
const leaderGroups = new Set(["机械组", "电控组", "硬件组", "算法组", "运营组"]);

export function GET(request: NextRequest) {
  const admin = getRequestAdmin(request);
  if (!admin || admin.role !== "captain") return NextResponse.json({ error: "仅队长可以管理账号" }, { status: 403 });
  const rows = getDb().prepare("SELECT * FROM admins ORDER BY role ASC, created_at ASC").all() as AdminRecord[];
  const accounts = rows.map((row) => ({
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    role: row.role,
    groupName: row.group_name,
    active: Boolean(row.active),
    createdAt: row.created_at,
  }));
  return NextResponse.json({ accounts });
}

export async function POST(request: NextRequest) {
  const admin = getRequestAdmin(request);
  if (!admin || admin.role !== "captain") return NextResponse.json({ error: "仅队长可以创建账号" }, { status: 403 });
  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const username = typeof payload.username === "string" ? payload.username.trim() : "";
  const displayName = typeof payload.displayName === "string" ? payload.displayName.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const groupName = typeof payload.groupName === "string" ? payload.groupName.trim() : "";
  if (!/^[a-zA-Z0-9_.-]{3,32}$/.test(username)) {
    return NextResponse.json({ error: "账号需为 3–32 位字母、数字、点、下划线或连字符" }, { status: 400 });
  }
  if (password.length < 10) return NextResponse.json({ error: "密码至少需要 10 位" }, { status: 400 });
  if (!displayName || displayName.length > 40) return NextResponse.json({ error: "请填写 1–40 字的显示名称" }, { status: 400 });
  if (!leaderGroups.has(groupName)) return NextResponse.json({ error: "请选择有效的负责组别" }, { status: 400 });

  try {
    const now = Date.now();
    const id = crypto.randomUUID();
    getDb().prepare(`
      INSERT INTO admins (id, username, password_hash, display_name, role, group_name, active, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'leader', ?, 1, ?, ?)
    `).run(id, username, hashPassword(password), displayName, groupName, now, now);
    const account = { id, username, displayName, role: "leader", groupName, active: true, createdAt: now };
    return NextResponse.json({ account }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE")) {
      return NextResponse.json({ error: "该账号已存在" }, { status: 409 });
    }
    return NextResponse.json({ error: "创建账号失败" }, { status: 500 });
  }
}
