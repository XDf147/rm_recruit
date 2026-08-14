import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "../../../lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "管理员登录" };

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");
  return (
    <main className="admin-login-page">
      <div className="login-blueprint" aria-hidden="true"><span>RM / AUTH</span><i /><i /><i /></div>
      <section className="login-copy">
        <Link className="brand login-brand" href="/apply"><span className="brand-mark">R</span><span className="brand-copy"><b>RoboMaster</b><small>招新系统 · RM RECRUIT</small></span></Link>
        <div><p className="bp-kicker"><span>受限区域</span> ADMIN WORKSPACE</p><h1>审核台<br />安全入口。</h1><p>队长可查看全部简历并管理组长账号；组长仅能访问本人负责组和“不确定”的投递。</p></div>
        <footer>AUTHORIZED PERSONNEL ONLY · 审核记录仅限内部使用</footer>
      </section>
      <LoginForm />
    </main>
  );
}
