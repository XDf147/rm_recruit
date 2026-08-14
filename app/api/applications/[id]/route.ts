import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { applications } from "../../../../db/schema";

const allowedStatuses = new Set(["新投递", "评估中", "待面试", "已通过", "未通过"]);

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as { status?: string; reviewNote?: string };
    const changes: { status?: string; reviewNote?: string; updatedAt: number } = { updatedAt: Date.now() };

    if (payload.status !== undefined) {
      if (!allowedStatuses.has(payload.status)) return Response.json({ error: "无效的审核状态" }, { status: 400 });
      changes.status = payload.status;
    }
    if (payload.reviewNote !== undefined) changes.reviewNote = payload.reviewNote.trim().slice(0, 2000);

    const [updated] = await getDb().update(applications).set(changes).where(eq(applications.id, id)).returning();
    if (!updated) return Response.json({ error: "未找到该投递记录" }, { status: 404 });

    return Response.json({ application: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新审核状态失败";
    return Response.json({ error: message }, { status: 500 });
  }
}
