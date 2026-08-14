import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { resumeDirectory } from "../../../../../../db";
import { getRequestAdmin } from "../../../../../../lib/auth";
import { getAccessibleApplication } from "../../../../../../lib/applications";

export const runtime = "nodejs";

function encodedFilename(filename: string) {
  return encodeURIComponent(filename).replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = getRequestAdmin(request);
  if (!admin) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id } = await context.params;
  const application = getAccessibleApplication(admin, id);
  if (!application) return NextResponse.json({ error: "无权查看该简历" }, { status: 403 });
  if (path.basename(application.resume_key) !== application.resume_key) return NextResponse.json({ error: "无效的文件记录" }, { status: 500 });

  try {
    const file = await readFile(path.join(resumeDirectory, application.resume_key));
    return new Response(file, { headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename*=UTF-8''${encodedFilename(application.resume_filename)}`,
      "Content-Length": file.byteLength.toString(),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'self'",
    } });
  } catch {
    return NextResponse.json({ error: "PDF 文件不存在" }, { status: 404 });
  }
}
