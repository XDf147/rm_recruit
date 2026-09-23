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
      <header><span>01</span><div><small>MEMBER SIGN IN</small><h2>战队账号登录</h2></div></header>
      <form onSubmit={login}>
        <label><span>账号</span><input name="username" required autoComplete="username" placeholder="请输入战队账号" /></label>
        <label><span>密码</span><input name="password" required type="password" autoComplete="current-password" placeholder="请输入密码" /></label>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button disabled={submitting}>{submitting ? "登录中…" : "登录"}<span>→</span></button>
      </form>
      <aside><i>▣</i><p><b>还没有账号或无法登录？</b><small>请联系队长开通或重置账号。</small></p></aside>
      <Link href="/">← 返回战队主页</Link>
    </section>
  );
}
