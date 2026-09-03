import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getDb, resumeDirectory } from "../../../db";
import { APPLICATION_GROUPS } from "../../../lib/groups";

export const runtime = "nodejs";
const MAX_PDF_SIZE = 10 * 1024 * 1024;
const allowedGroups = new Set<string>(APPLICATION_GROUPS);
const allowedYears = new Set(["大一", "大二", "大三", "大四", "研究生"]);

function value(form: FormData, key: string) {
  const entry = form.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "投递表单格式无效" }, { status: 400 });
  }

  let storedPath = "";
  try {
    const name = value(form, "name");
    const phone = value(form, "phone");
    const year = value(form, "year");
    const major = value(form, "major");
    const about = value(form, "about");
    const groups = [...new Set(
      form
        .getAll("group")
        .filter((entry): entry is string => typeof entry === "string" && allowedGroups.has(entry)),
    )].slice(0, 2);
    const resume = form.get("resume");

    if (!name || !phone || !year || !major || !about || groups.length === 0) {
      return NextResponse.json(
        { error: "请完整填写姓名、电话、年级、专业、意向组别和个人介绍" },
        { status: 400 },
      );
    }
    if (name.length > 40 || phone.length > 30 || major.length > 80 || about.length > 1000) {
      return NextResponse.json({ error: "部分字段超出长度限制" }, { status: 400 });
    }
    if (!allowedYears.has(year)) {
      return NextResponse.json({ error: "请选择有效的年级" }, { status: 400 });
    }
    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json({ error: "PDF 简历为必交项目" }, { status: 400 });
    }
    if (resume.size > MAX_PDF_SIZE) {
      return NextResponse.json({ error: "PDF 简历不能超过 10 MB" }, { status: 413 });
    }
    const signature = await resume.slice(0, 5).text();
    if (signature !== "%PDF-") {
      return NextResponse.json({ error: "上传的文件不是有效的 PDF" }, { status: 415 });
    }

    const id = crypto.randomUUID();
    const resumeKey = `${id}.pdf`;
    storedPath = path.join(resumeDirectory, resumeKey);
    await mkdir(resumeDirectory, { recursive: true, mode: 0o700 });
    await writeFile(storedPath, Buffer.from(await resume.arrayBuffer()), { mode: 0o600, flag: "wx" });

    const now = Date.now();
    getDb()
      .prepare(`
        INSERT INTO applications (
          id, name, phone, year, major, primary_group, secondary_group, about,
          resume_key, resume_filename, resume_content_type, resume_size,
          status, score, review_note, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'application/pdf', ?, '新投递', 80, '', ?, ?)
      `)
      .run(
        id,
        name,
        phone,
        year,
        major,
        groups[0],
        groups[1] ?? null,
        about,
        resumeKey,
        resume.name.slice(0, 160) || "resume.pdf",
        resume.size,
        now,
        now,
      );

    return NextResponse.json({ id, message: "投递成功" }, { status: 201 });
  } catch (error) {
    if (storedPath) await unlink(storedPath).catch(() => undefined);
    console.error("application upload failed", error);
    return NextResponse.json({ error: "提交失败，请稍后重试" }, { status: 500 });
  }
}
