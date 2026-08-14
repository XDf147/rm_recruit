import { env } from "cloudflare:workers";
import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { applications } from "../../../db/schema";

const MAX_PDF_SIZE = 10 * 1024 * 1024;

function value(form: FormData, key: string) {
  const entry = form.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function jsonError(error: string, status: number) {
  return Response.json({ error }, { status });
}

function publicApplication(row: typeof applications.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    initials: row.name.slice(-2).toUpperCase(),
    phone: row.phone,
    year: row.year,
    major: row.major,
    group: row.primaryGroup,
    secondaryGroup: row.secondaryGroup,
    intro: row.about,
    project: "详见已提交的 PDF 简历",
    skills: [row.primaryGroup, row.secondaryGroup].filter(Boolean),
    status: row.status,
    score: row.score,
    reviewNote: row.reviewNote,
    resumeFilename: row.resumeFilename,
    resumeSize: row.resumeSize,
    pdfUrl: `/api/applications/${row.id}/resume`,
    submitted: new Date(row.createdAt).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
    createdAt: row.createdAt,
  };
}

export async function GET() {
  try {
    const rows = await getDb().select().from(applications).orderBy(desc(applications.createdAt)).limit(100);
    return Response.json({ applications: rows.map(publicApplication) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "读取投递记录失败";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let storedKey = "";

  try {
    const form = await request.formData();
    const name = value(form, "name");
    const phone = value(form, "phone");
    const year = value(form, "year");
    const major = value(form, "major");
    const about = value(form, "about");
    const groups = form.getAll("group").filter((entry): entry is string => typeof entry === "string" && Boolean(entry.trim())).slice(0, 2);
    const resume = form.get("resume");

    if (!name || !phone || !year || !major || !about || groups.length === 0) {
      return jsonError("请完整填写姓名、电话、年级、专业、意向组别和个人介绍", 400);
    }

    if (!(resume instanceof File) || resume.size === 0) {
      return jsonError("PDF 简历为必交项目", 400);
    }

    const isPdf = resume.type === "application/pdf" || resume.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) return jsonError("简历仅支持 PDF 格式", 415);
    if (resume.size > MAX_PDF_SIZE) return jsonError("PDF 简历不能超过 10 MB", 413);
    const signature = await resume.slice(0, 5).text();
    if (signature !== "%PDF-") return jsonError("上传的文件不是有效的 PDF", 415);

    const id = crypto.randomUUID();
    const safeName = resume.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "resume.pdf";
    storedKey = `applications/${id}/${safeName}`;
    const runtime = env as unknown as { RESUMES: R2Bucket };

    await runtime.RESUMES.put(storedKey, resume.stream(), {
      httpMetadata: { contentType: "application/pdf", contentDisposition: `inline; filename="${safeName}"` },
      customMetadata: { applicationId: id, originalFilename: resume.name },
    });

    const now = Date.now();
    const [row] = await getDb().insert(applications).values({
      id,
      name,
      phone,
      year,
      major,
      primaryGroup: groups[0],
      secondaryGroup: groups[1] ?? null,
      about,
      resumeKey: storedKey,
      resumeFilename: resume.name,
      resumeContentType: "application/pdf",
      resumeSize: resume.size,
      status: "新投递",
      score: 80,
      reviewNote: "",
      createdAt: now,
      updatedAt: now,
    }).returning();

    return Response.json({ application: publicApplication(row) }, { status: 201 });
  } catch (error) {
    if (storedKey) {
      const runtime = env as unknown as { RESUMES: R2Bucket };
      await runtime.RESUMES.delete(storedKey).catch(() => undefined);
    }
    const message = error instanceof Error ? error.message : "提交失败，请稍后重试";
    return Response.json({ error: message }, { status: 500 });
  }
}
