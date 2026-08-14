import { NextRequest, NextResponse } from "next/server";
import { authenticate, clearSessionCookie, destroyRequestSession, getRequestAdmin, setSessionCookie } from "../../../../lib/auth";
import { getDb } from "../../../../db";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  const admin = getRequestAdmin(request);
  return admin ? NextResponse.json({ admin }) : NextResponse.json({ error: "未登录" }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => ({}))) as { username?: string; password?: string };
  const username = payload.username?.trim() ?? "";
  const password = payload.password ?? "";
  if (!username || !password) return NextResponse.json({ error: "请输入账号和密码" }, { status: 400 });

  const adminCount = (getDb().prepare("SELECT COUNT(*) AS count FROM admins").get() as { count: number }).count;
  if (adminCount === 0) {
    return NextResponse.json({ error: "尚未初始化队长账号，请先配置 CAPTAIN_USERNAME 和 CAPTAIN_PASSWORD 后重启容器" }, { status: 503 });
  }

  const result = authenticate(username, password);
  if (!result) return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
  const response = NextResponse.json({ admin: result.admin });
  setSessionCookie(response, result.token);
  return response;
}

export function DELETE(request: NextRequest) {
  destroyRequestSession(request);
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
