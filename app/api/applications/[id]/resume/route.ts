import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { applications } from "../../../../../db/schema";

function encodedFilename(filename: string) {
  return encodeURIComponent(filename).replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const [application] = await getDb().select({
      resumeKey: applications.resumeKey,
      resumeFilename: applications.resumeFilename,
    }).from(applications).where(eq(applications.id, id)).limit(1);

    if (!application) return Response.json({ error: "未找到该投递记录" }, { status: 404 });

    const runtime = env as unknown as { RESUMES: R2Bucket };
    const object = await runtime.RESUMES.get(application.resumeKey);
    if (!object) return Response.json({ error: "PDF 文件不存在" }, { status: 404 });

    return new Response(object.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename*=UTF-8''${encodedFilename(application.resumeFilename)}`,
        "Content-Length": object.size.toString(),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取 PDF 失败";
    return Response.json({ error: message }, { status: 500 });
  }
}
