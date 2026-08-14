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

  const payload = (await request.json().catch(() => ({}))) as { status?: string; reviewNote?: string; score?: number };
  if (payload.status !== undefined && !allowedStatuses.has(payload.status)) return NextResponse.json({ error: "无效的审核状态" }, { status: 400 });
  const score = payload.score === undefined ? undefined : Math.max(0, Math.min(100, Math.round(payload.score)));
  const reviewNote = payload.reviewNote?.trim().slice(0, 2000);

  getDb().prepare(`
    UPDATE applications SET
      status = COALESCE(?, status),
      review_note = COALESCE(?, review_note),
      score = COALESCE(?, score),
      updated_at = ?
    WHERE id = ?
  `).run(payload.status ?? null, reviewNote ?? null, score ?? null, Date.now(), id);

  const updated = getAccessibleApplication(admin, id);
  return NextResponse.json({ application: updated ? serializeApplication(updated) : null });
}
