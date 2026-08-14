import { NextRequest, NextResponse } from "next/server";
import { getDb, type AdminRecord } from "../../../../../db";
import { getRequestAdmin } from "../../../../../lib/auth";

export const runtime = "nodejs";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = getRequestAdmin(request);
  if (!admin || admin.role !== "captain") return NextResponse.json({ error: "仅队长可以删除账号" }, { status: 403 });
  const { id } = await context.params;
  if (id === admin.id) return NextResponse.json({ error: "不能删除当前登录账号" }, { status: 400 });
  const target = getDb().prepare("SELECT * FROM admins WHERE id = ?").get(id) as AdminRecord | undefined;
  if (!target || target.role === "captain") return NextResponse.json({ error: "只能删除组长账号" }, { status: 400 });
  getDb().prepare("DELETE FROM admins WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
