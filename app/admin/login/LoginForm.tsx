"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "登录失败");
      router.replace("/admin");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "登录失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="login-card">
      <header><span>01</span><div><small>IDENTITY VERIFICATION</small><h2>管理员登录</h2></div></header>
      <form onSubmit={login}>
        <label><span>管理员账号</span><input name="username" required autoComplete="username" placeholder="输入账号" /></label>
        <label><span>密码</span><input name="password" required type="password" autoComplete="current-password" placeholder="输入密码" /></label>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button disabled={submitting}>{submitting ? "验证中…" : "进入审核台"}<span>→</span></button>
      </form>
      <aside><i>▣</i><p><b>账号由队长统一创建</b><small>若无法登录，请联系队长检查负责组别和账号状态。</small></p></aside>
      <Link href="/apply">← 返回队员投递端</Link>
    </section>
  );
}
