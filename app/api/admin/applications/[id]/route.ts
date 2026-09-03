import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../../db";
import { getRequestAdmin } from "../../../../../lib/auth";
import { getAccessibleApplication, serializeApplication } from "../../../../../lib/applications";

export const runtime = "nodejs";
const allowedStatuses = new Set(["新投递", "评估中", "待面试", "已通过", "未通过"]);

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = getRequestAdmin(request);
  if (!admin) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id } = await context.params;
  if (!getAccessibleApplication(admin, id)) return NextResponse.json({ error: "无权查看该简历" }, { status: 403 });

  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  if (payload.status !== undefined && (typeof payload.status !== "string" || !allowedStatuses.has(payload.status))) {
    return NextResponse.json({ error: "无效的审核状态" }, { status: 400 });
  }
  if (payload.score !== undefined && (typeof payload.score !== "number" || !Number.isFinite(payload.score))) {
    return NextResponse.json({ error: "评分必须是 0–100 的数字" }, { status: 400 });
  }
  if (payload.reviewNote !== undefined && typeof payload.reviewNote !== "string") {
    return NextResponse.json({ error: "审核评语格式无效" }, { status: 400 });
  }

  const score = typeof payload.score === "number" ? Math.max(0, Math.min(100, Math.round(payload.score))) : undefined;
  const reviewNote = typeof payload.reviewNote === "string" ? payload.reviewNote.trim().slice(0, 2000) : undefined;

  getDb().prepare(`
    UPDATE applications SET
      status = COALESCE(?, status),
      review_note = COALESCE(?, review_note),
      score = COALESCE(?, score),
      updated_at = ?
    WHERE id = ?
  `).run(typeof payload.status === "string" ? payload.status : null, reviewNote ?? null, score ?? null, Date.now(), id);

  const updated = getAccessibleApplication(admin, id);
  return NextResponse.json({ application: updated ? serializeApplication(updated) : null });
}
