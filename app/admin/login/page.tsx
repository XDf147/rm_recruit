import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "../../../lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "队员登录" };

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");
  return (
    <main className="admin-login-page">
      <div className="login-blueprint" aria-hidden="true"><span>RM / MEMBER</span><i /><i /><i /></div>
      <section className="login-copy">
        <Link className="brand login-brand" href="/">
          <span className="brand-mark brand-logo">
            <Image src="/images/brand/polarbear.png" alt="" width={44} height={44} />
          </span>
          <span className="brand-copy">
            <b>北极熊机器人战队</b>
            <small>招新系统 · Polar Bear</small>
          </span>
        </Link>
        <div>
          <p className="bp-kicker"><span>成员登录</span> MEMBER ACCESS</p>
          <h1>战队成员<br />登录入口。</h1>
          <p>使用战队账号登录。系统会根据账号身份开放相应功能。</p>
        </div>
        <footer>以我之眼，探索无限 · МОИМИ ГЛАЗАМИ — К БЕСКОНЕЧНОСТИ</footer>
      </section>
      <LoginForm />
    </main>
  );
}
