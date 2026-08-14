import { getDb, type ApplicationRecord } from "../db";
import { canAccessGroup, type SafeAdmin } from "./auth";

export type CandidateStatus = "新投递" | "评估中" | "待面试" | "已通过" | "未通过";

export function serializeApplication(row: ApplicationRecord) {
  return {
    id: row.id,
    name: row.name,
    initials: row.name.slice(-2).toUpperCase(),
    phone: row.phone,
    year: row.year,
    major: row.major,
    group: row.primary_group,
    secondaryGroup: row.secondary_group,
    intro: row.about,
    project: "详见已提交的 PDF 简历",
    skills: [row.primary_group, row.secondary_group].filter((skill): skill is string => Boolean(skill)),
    status: row.status as CandidateStatus,
    score: row.score,
    reviewNote: row.review_note,
    resumeFilename: row.resume_filename,
    resumeSize: row.resume_size,
    pdfUrl: `/api/admin/applications/${row.id}/resume`,
    submitted: new Date(row.created_at).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }),
    createdAt: row.created_at,
    stored: true,
  };
}

export function listApplications(admin: SafeAdmin) {
  const db = getDb();
  if (admin.role === "captain") {
    return db.prepare("SELECT * FROM applications ORDER BY created_at DESC LIMIT 500").all() as ApplicationRecord[];
  }
  return db.prepare(`
    SELECT * FROM applications
    WHERE primary_group = ? OR secondary_group = ? OR primary_group = '不确定' OR secondary_group = '不确定'
    ORDER BY created_at DESC LIMIT 500
  `).all(admin.groupName, admin.groupName) as ApplicationRecord[];
}

export function getAccessibleApplication(admin: SafeAdmin, id: string) {
  const row = getDb().prepare("SELECT * FROM applications WHERE id = ?").get(id) as ApplicationRecord | undefined;
  if (!row || !canAccessGroup(admin, row.primary_group, row.secondary_group)) return null;
  return row;
}
