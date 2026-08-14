"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SafeAdmin } from "../../lib/auth";
import { GROUP_NAMES } from "../../lib/groups";

type CandidateStatus = "新投递" | "评估中" | "待面试" | "已通过" | "未通过";
type Candidate = {
  id: string;
  name: string;
  initials: string;
  phone: string;
  year: string;
  major: string;
  group: string;
  secondaryGroup: string | null;
  intro: string;
  project: string;
  skills: string[];
  status: CandidateStatus;
  score: number;
  reviewNote: string;
  resumeFilename: string;
  resumeSize: number;
  pdfUrl: string;
  submitted: string;
  createdAt: number;
};

type AdminAccount = {
  id: string;
  username: string;
  displayName: string;
  role: "captain" | "leader";
  groupName: string | null;
  active: boolean;
};

const statuses: CandidateStatus[] = ["新投递", "评估中", "待面试", "已通过", "未通过"];

export function AdminDashboard({ admin, initialApplications }: { admin: SafeAdmin; initialApplications: Candidate[] }) {
  const router = useRouter();
  const [applications, setApplications] = useState(initialApplications);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState("");

  const announce = useCallback((text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 3000);
  }, []);

  async function refresh(showNotice = true) {
    setRefreshing(true);
    try {
      const response = await fetch("/api/admin/applications", { cache: "no-store" });
      if (response.status === 401) return router.replace("/admin/login");
      const payload = (await response.json()) as { applications?: Candidate[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "同步失败");
      setApplications(payload.applications || []);
      if (showNotice) announce("已同步最新投递记录");
    } catch (error) {
      announce(error instanceof Error ? error.message : "同步失败");
    } finally {
      setRefreshing(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return applications.filter((candidate) => {
      const matchesFilter = filter === "全部" || candidate.status === filter || candidate.group === filter || candidate.secondaryGroup === filter;
      const haystack = `${candidate.name}${candidate.major}${candidate.group}${candidate.secondaryGroup || ""}${candidate.phone}`.toLowerCase();
      return matchesFilter && (!keyword || haystack.includes(keyword));
    });
  }, [applications, filter, query]);

  const stageCounts = ["新投递", "评估中", "待面试", "已通过"].map((status) => applications.filter((candidate) => candidate.status === status).length);
  const scopeGroups = admin.role === "captain" ? GROUP_NAMES : ([admin.groupName, "不确定"].filter(Boolean) as string[]);

  function onUpdated(candidate: Candidate) {
    setApplications((current) => current.map((item) => item.id === candidate.id ? candidate : item));
    setSelected(candidate);
  }

  return (
    <main className="site blueprint-shell admin-shell">
      <header className="admin-header">
        <a className="brand" href="/admin"><span className="brand-mark">R</span><span className="brand-copy"><b>RoboMaster</b><small>审核工作台 · ADMIN</small></span></a>
        <div className="admin-scope"><i>{admin.role === "captain" ? "CAPTAIN" : "GROUP LEADER"}</i><span>{admin.role === "captain" ? "全部简历权限" : `${admin.groupName} + 不确定`}</span></div>
        <div className="admin-profile"><span><small>当前管理员</small><b>{admin.displayName}</b></span><button onClick={logout}>退出登录</button></div>
      </header>

      <div className="blueprint-page admin-page">
        <section className="blueprint-intro">
          <div><p className="bp-kicker"><span>招新季</span> REVIEW WORKSPACE</p><h1>审核工作台 <i>／ BLUEPRINT</i></h1><p>当前权限范围内有 <b>{stageCounts[0]} 份</b>新投递等待查阅。</p></div>
          <div className="permission-plate"><small>ACCESS SCOPE</small><b>{admin.role === "captain" ? "全队" : admin.groupName}</b><span>{admin.role === "captain" ? "可查看全部简历与管理账号" : "可查看本组和不确定投递"}</span></div>
        </section>

        <section className="pipeline-panel pipeline-overview">
          <div className="bp-title"><div><small>APPLICATION PIPELINE</small><h2>招新进度</h2></div><button onClick={() => refresh()} disabled={refreshing}>{refreshing ? "同步中…" : "↻ 同步投递"}</button></div>
          <div className="pipeline">
            {["新投递", "评估中", "待面试", "已通过"].map((status, index) => <article key={status}><span>{String(index + 1).padStart(2, "0")}</span><b>{String(stageCounts[index]).padStart(2, "0")}</b><small>{status}</small>{index < 3 && <i>→</i>}</article>)}
          </div>
          <p className="storage-note"><i>✓</i> SQLite 持久化已启用 · {applications.length} 份权限内简历 · PDF 仅登录后可预览</p>
        </section>

        <div className="blueprint-main-grid admin-main-grid">
          <section className="candidate-panel">
            <div className="candidate-toolbar"><div><small>CANDIDATE ARCHIVE</small><h2>候选人方形档案</h2></div><label className="candidate-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索姓名、专业、电话或组别" /></label></div>
            <div className="filter-pills">
              {["全部", ...statuses, ...scopeGroups].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
            </div>
            <div className="blueprint-square-grid">
              {filtered.map((candidate, index) => (
                <button key={candidate.id} className="blueprint-square-card" onClick={() => setSelected(candidate)}>
                  <span className="square-ticket"><i>FILE {candidate.id.slice(0, 6).toUpperCase()}</i><StatusBadge status={candidate.status} /></span>
                  <span className={`square-avatar paper-${index % 5}`}><b>{candidate.initials}</b><i>{candidate.score}<small>%</small></i></span>
                  <span className="square-person"><small>{candidate.group}{candidate.secondaryGroup ? ` / ${candidate.secondaryGroup}` : ""}</small><b>{candidate.name}</b><i>{candidate.major} · {candidate.year}</i></span>
                  <span className="square-skills"><i>PDF 已归档</i><i>{candidate.submitted}</i></span>
                  <span className="square-open"><b>{candidate.resumeFilename}</b><i>审核档案 ↗</i></span>
                </button>
              ))}
              {!filtered.length && <div className="empty-state"><b>没有匹配的候选人</b><span>换一个筛选条件，或同步最新投递</span></div>}
            </div>
          </section>

          <aside className="admin-side-column">
            <GroupDistribution applications={applications} />
            {admin.role === "captain" && <AccountManager announce={announce} />}
          </aside>
        </div>
      </div>

      {selected && <CandidateDrawer candidate={selected} onClose={() => setSelected(null)} onUpdated={onUpdated} announce={announce} />}
      <div className={`toast ${notice ? "show" : ""}`} role="status"><span>✓</span>{notice}</div>
    </main>
  );
}

function StatusBadge({ status }: { status: CandidateStatus }) {
  return <span className={`status-badge status-${status}`}><i />{status}</span>;
}

function GroupDistribution({ applications }: { applications: Candidate[] }) {
  const rows = [...GROUP_NAMES, "不确定"].map((group) => ({ group, count: applications.filter((item) => item.group === group || item.secondaryGroup === group).length }));
  const max = Math.max(...rows.map((row) => row.count), 1);
  return (
    <section className="group-panel admin-group-panel">
      <div className="bp-title"><div><small>TEAM DEMAND</small><h2>权限内投递分布</h2></div></div>
      <p>同一份双意向简历会计入两个组别</p>
      <div className="group-stats">{rows.map((row, index) => <div key={row.group}><span><i>{String(index + 1).padStart(2, "0")}</i><b>{row.group}</b><small>{row.count} 份</small></span><em><i style={{ width: `${Math.max(8, row.count / max * 100)}%` }} /></em></div>)}</div>
    </section>
  );
}

function CandidateDrawer({ candidate, onClose, onUpdated, announce }: { candidate: Candidate; onClose: () => void; onUpdated: (candidate: Candidate) => void; announce: (text: string) => void }) {
  const [previewing, setPreviewing] = useState(true);
  const [reviewNote, setReviewNote] = useState(candidate.reviewNote || "");
  const [score, setScore] = useState(candidate.score);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  async function save(status?: CandidateStatus) {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/applications/${candidate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewNote, score, ...(status ? { status } : {}) }),
      });
      const payload = (await response.json()) as { application?: Candidate; error?: string };
      if (!response.ok || !payload.application) throw new Error(payload.error || "保存失败");
      onUpdated(payload.application);
      announce(status ? `${candidate.name} 已更新为“${status}”` : "审核信息已保存");
    } catch (error) {
      announce(error instanceof Error ? error.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="drawer-backdrop">
      <button className="drawer-dismiss" onClick={onClose} aria-label="关闭候选人档案" />
      <aside className={`candidate-drawer ${previewing ? "with-preview" : ""}`} aria-modal="true" role="dialog" aria-label={`${candidate.name}的候选人档案`}>
        <div className="drawer-bar"><span>CANDIDATE FILE / 候选人档案</span><div><button onClick={() => setPreviewing((value) => !value)}>{previewing ? "收起 PDF" : "预览 PDF"}</button><button onClick={onClose} aria-label="关闭">×</button></div></div>
        <div className="drawer-layout">
          <div className="drawer-details">
            <div className="drawer-person"><span className="drawer-avatar">{candidate.initials}</span><div><StatusBadge status={candidate.status} /><h2>{candidate.name}</h2><p>{candidate.major} · {candidate.year}</p></div><label className="score-control"><input type="number" min="0" max="100" value={score} onChange={(event) => setScore(Math.max(0, Math.min(100, Number(event.target.value))))} /><small>%</small><i>匹配度</i></label></div>
            <div className="drawer-meta"><span><small>意向组别</small><b>{candidate.group}{candidate.secondaryGroup ? ` / ${candidate.secondaryGroup}` : ""}</b></span><span><small>联系方式</small><b>{candidate.phone}</b></span><span><small>投递时间</small><b>{candidate.submitted}</b></span></div>
            <div className="pdf-file-row"><span>PDF</span><div><b>{candidate.resumeFilename}</b><small>{(candidate.resumeSize / 1024 / 1024).toFixed(2)} MB · 必交简历</small></div><a href={candidate.pdfUrl} target="_blank" rel="noreferrer">新窗口打开 ↗</a></div>
            <section><small>ABOUT / 个人介绍</small><p>{candidate.intro}</p></section>
            <section className="review-note"><small>INTERNAL REVIEW / 内部审核评语</small><textarea value={reviewNote} maxLength={2000} onChange={(event) => setReviewNote(event.target.value)} placeholder="记录判断、待确认事项或面试建议……" /></section>
            <section className="status-actions"><small>REVIEW STATUS / 更新状态</small><div>{statuses.map((status) => <button key={status} className={candidate.status === status ? "active" : ""} disabled={saving} onClick={() => save(status)}>{status}</button>)}</div></section>
            <div className="drawer-actions compact-actions"><button disabled={saving} onClick={onClose}>关闭档案</button><button disabled={saving} onClick={() => save()}>{saving ? "保存中…" : "保存评分与评语 →"}</button></div>
          </div>
          {previewing && <div className="pdf-preview"><div><span>PDF PREVIEW · 受权限保护</span><a href={candidate.pdfUrl} target="_blank" rel="noreferrer">全屏查看 ↗</a></div><iframe src={candidate.pdfUrl} title={`${candidate.name}的 PDF 简历`} /></div>}
        </div>
      </aside>
    </div>
  );
}

function AccountManager({ announce }: { announce: (text: string) => void }) {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/accounts", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as { accounts?: AdminAccount[]; error?: string };
        if (!response.ok) throw new Error(payload.error || "读取账号失败");
        if (active) setAccounts(payload.accounts || []);
      })
      .catch((error: unknown) => { if (active) announce(error instanceof Error ? error.message : "读取账号失败"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [announce]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setCreating(true);
    try {
      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password"), displayName: form.get("displayName"), groupName: form.get("groupName") }),
      });
      const payload = (await response.json()) as { account?: AdminAccount; error?: string };
      if (!response.ok || !payload.account) throw new Error(payload.error || "创建失败");
      setAccounts((current) => [...current, payload.account!]);
      formElement.reset();
      announce(`已创建 ${payload.account.groupName}组长账号`);
    } catch (error) {
      announce(error instanceof Error ? error.message : "创建失败");
    } finally {
      setCreating(false);
    }
  }

  async function remove(account: AdminAccount) {
    if (!window.confirm(`确定删除账号 ${account.username}？该账号会立即失去审核权限。`)) return;
    const response = await fetch(`/api/admin/accounts/${account.id}`, { method: "DELETE" });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) return announce(payload.error || "删除失败");
    setAccounts((current) => current.filter((item) => item.id !== account.id));
    announce(`已删除账号 ${account.username}`);
  }

  return (
    <section className="account-panel">
      <header><div><small>ACCESS CONTROL</small><h2>组长账号</h2></div><span>{accounts.filter((item) => item.role === "leader").length} 个</span></header>
      <p>每个组长账号只能查看负责组及“不确定”的简历。</p>
      <div className="account-list">
        {loading && <span className="account-loading">读取账号中…</span>}
        {accounts.map((account) => <article key={account.id}><i>{account.role === "captain" ? "C" : account.groupName?.slice(0, 1)}</i><span><b>{account.displayName}</b><small>@{account.username} · {account.role === "captain" ? "队长" : account.groupName}</small></span>{account.role === "leader" && <button onClick={() => remove(account)} aria-label={`删除 ${account.username}`}>×</button>}</article>)}
      </div>
      <form className="account-form" onSubmit={create}>
        <strong>创建组长账号</strong>
        <input name="displayName" required maxLength={40} placeholder="显示名称，如：机械组长" />
        <input name="username" required minLength={3} maxLength={32} pattern="[a-zA-Z0-9_.-]+" autoComplete="off" placeholder="登录账号" />
        <input name="password" required type="password" minLength={10} autoComplete="new-password" placeholder="初始密码（至少 10 位）" />
        <select name="groupName" required defaultValue=""><option value="" disabled>选择负责组别</option>{GROUP_NAMES.map((group) => <option key={group}>{group}</option>)}</select>
        <button disabled={creating}>{creating ? "创建中…" : "+ 创建账号"}</button>
      </form>
    </section>
  );
}
