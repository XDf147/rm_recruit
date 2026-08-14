import { NextRequest, NextResponse } from "next/server";
import { getRequestAdmin } from "../../../../lib/auth";
import { listApplications, serializeApplication } from "../../../../lib/applications";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  const admin = getRequestAdmin(request);
  if (!admin) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const applications = listApplications(admin).map(serializeApplication);
  return NextResponse.json({ applications, scope: admin.role === "captain" ? "all" : [admin.groupName, "不确定"] });
}
