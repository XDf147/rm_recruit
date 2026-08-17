"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { APPLICATION_GROUPS } from "../../lib/groups";

function GroupIcon({ group }: { group: string }) {
  if (group === "硬件组") {
    return (
      <svg className="group-option-icon" aria-hidden="true" viewBox="0 0 512 512">
        <path d="M0 0h512v512H0z" fill="none" />
        <rect width="352" height="352" x="80" y="80" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" rx="48" ry="48" />
        <rect width="224" height="224" x="144" y="144" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" rx="16" ry="16" />
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M256 80V48m80 32V48M176 80V48m80 416v-32m80 32v-32m-160 32v-32m256-176h32m-32 80h32m-32-160h32M48 256h32m-32 80h32M48 176h32" />
      </svg>
    );
  }

  if (group === "算法组") {
    return (
      <svg className="group-option-icon" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5">
          <path strokeLinecap="round" d="M10.5 2v2m3-2v2M8 6.5H6m2 3H6m12-3h-2m2 3h-2M13.333 4h-2.666C9.41 4 8.78 4 8.39 4.39C8 4.782 8 5.41 8 6.668v2.666c0 1.257 0 1.886.39 2.277c.391.39 1.02.39 2.277.39h2.666c1.257 0 1.886 0 2.277-.39c.39-.391.39-1.02.39-2.277V6.667c0-1.257 0-1.886-.39-2.276C15.219 4 14.59 4 13.333 4" />
          <path d="M3.617 21.924c.184.076.417.076.883.076s.699 0 .883-.076a1 1 0 0 0 .54-.541C6 21.199 6 20.966 6 20.5s0-.699-.076-.883a1 1 0 0 0-.541-.54C5.199 19 4.966 19 4.5 19s-.699 0-.883.076a1 1 0 0 0-.54.541C3 19.801 3 20.034 3 20.5s0 .699.076.883a1 1 0 0 0 .541.54Zm7.5 0c.184.076.417.076.883.076s.699 0 .883-.076a1 1 0 0 0 .54-.541c.077-.184.077-.417.077-.883s0-.699-.076-.883a1 1 0 0 0-.541-.54C12.699 19 12.466 19 12 19s-.699 0-.883.076a1 1 0 0 0-.54.541c-.077.184-.077.417-.077.883s0 .699.076.883a1 1 0 0 0 .541.54Z" />
          <path strokeLinecap="round" d="M12 19v-7m-7.5 7c0-1.404 0-2.107.337-2.611a2 2 0 0 1 .552-.552C5.893 15.5 6.596 15.5 8 15.5h8c1.404 0 2.107 0 2.611.337c.218.146.406.334.552.552c.337.504.337 1.207.337 2.611" />
          <path d="M18.617 21.924c.184.076.417.076.883.076s.699 0 .883-.076a1 1 0 0 0 .54-.541c.077-.184.077-.417.077-.883s0-.699-.076-.883a1 1 0 0 0-.541-.54C20.199 19 19.966 19 19.5 19s-.699 0-.883.076a1 1 0 0 0-.54.541c-.077.184-.077.417-.077.883s0 .699.076.883a1 1 0 0 0 .541.54Z" />
        </g>
      </svg>
    );
  }

  if (group === "运营组") {
    return (
      <svg className="group-option-icon" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path fill="currentColor" d="M12 11a5 5 0 0 1 5 5v6h-2v-6a3 3 0 0 0-2.824-2.995L12 13a3 3 0 0 0-2.995 2.824L9 16v6H7v-6a5 5 0 0 1 5-5m-6.5 3q.42.001.81.094a6 6 0 0 0-.301 1.575L6 16v.086a1.5 1.5 0 0 0-.356-.08L5.5 16a1.5 1.5 0 0 0-1.493 1.355L4 17.5V22H2v-4.5A3.5 3.5 0 0 1 5.5 14m13 0a3.5 3.5 0 0 1 3.5 3.5V22h-2v-4.5a1.5 1.5 0 0 0-1.355-1.493L18.5 16q-.264.001-.5.085V16c0-.666-.108-1.306-.308-1.904c.258-.063.53-.096.808-.096m-13-6a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5m13 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5m-13 2a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1m13 0a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1M12 2a4 4 0 1 1 0 8a4 4 0 0 1 0-8m0 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4" />
      </svg>
    );
  }

  const legacyIcons: Record<string, { glyph: string; className: string }> = {
    "机械组": { glyph: "⚙", className: "group-option-icon-mechanical" },
    "电控组": { glyph: "⌁", className: "group-option-icon-control" },
    "不确定": { glyph: "?", className: "" },
  };
  const icon = legacyIcons[group];
  return <i className={`group-option-icon ${icon.className}`} aria-hidden="true">{icon.glyph}</i>;
}

export function ApplicationForm({ initialGroup }: { initialGroup?: string }) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(initialGroup ? [initialGroup] : []);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function toggleGroup(group: string) {
    setMessage(null);
    setSelectedGroups((current) => {
      if (current.includes(group)) return current.filter((item) => item !== group);
      if (current.length >= 2) {
        setMessage({ type: "error", text: "最多选择 2 个意向组别" });
        return current;
      }
      return [...current, group];
    });
  }

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setMessage(null);
    if (!file) return setFileName("");
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      event.target.value = "";
      setFileName("");
      return setMessage({ type: "error", text: "简历必须使用 PDF 格式" });
    }
    if (file.size > 10 * 1024 * 1024) {
      event.target.value = "";
      setFileName("");
      return setMessage({ type: "error", text: "PDF 简历不能超过 10 MB" });
    }
    setFileName(file.name);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (!selectedGroups.length) return setMessage({ type: "error", text: "请至少选择 1 个意向组别" });
    const resume = formData.get("resume");
    if (!(resume instanceof File) || !resume.size) return setMessage({ type: "error", text: "PDF 简历为必交项目" });

    setSubmitting(true);
    setMessage(null);
    try {
      const response = await fetch("/api/applications", { method: "POST", body: formData });
      const payload = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !payload.id) throw new Error(payload.error || "提交失败，请稍后重试");
      form.reset();
      setSelectedGroups([]);
      setFileName("");
      setMessage({ type: "success", text: `投递成功，申请编号：${payload.id.slice(0, 8).toUpperCase()}` });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "提交失败，请稍后重试" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="application-form" onSubmit={submit} encType="multipart/form-data">
      <div className="form-heading"><div><small>APPLICATION FORM</small><h2>提交你的申请</h2></div><span><b>01</b> / 01</span></div>
      <div className="form-progress"><i /><i /><i /></div>
      <div className="field-grid">
        <label><span>你的姓名 <b>*</b></span><input name="name" required autoComplete="name" maxLength={40} placeholder="例如：林予安" /></label>
        <label><span>手机号码 <b>*</b></span><input name="phone" required type="tel" autoComplete="tel" maxLength={30} placeholder="用于接收面试通知" /></label>
        <label><span>年级 <b>*</b></span><select name="year" required defaultValue=""><option value="" disabled>请选择年级</option><option>大一</option><option>大二</option><option>大三</option><option>大四</option><option>研究生</option></select></label>
        <label><span>专业 <b>*</b></span><input name="major" required maxLength={80} placeholder="你的主修专业" /></label>
      </div>
      <fieldset>
        <legend>意向组别 <b>*</b><small>最多选择 2 个</small></legend>
        <div className="group-options">
          {APPLICATION_GROUPS.map((group, index) => (
            <label htmlFor={`group-${index}`} key={group}><input id={`group-${index}`} aria-label={group} type="checkbox" name="group" value={group} checked={selectedGroups.includes(group)} onChange={() => toggleGroup(group)} /><span><GroupIcon group={group} /><b>{group}</b></span></label>
          ))}
        </div>
      </fieldset>
      <label className="wide-field"><span>关于你 <b>*</b><small>经历、技能，或一件让你有成就感的事</small></span><textarea name="about" required placeholder="不用写得很正式，真诚地告诉我们你是谁……" maxLength={1000} /><i>最多 1000 字</i></label>
      <label className={`upload ${fileName ? "has-file" : ""}`}>
        <input name="resume" type="file" required accept=".pdf,application/pdf" onChange={selectFile} />
        <span className="upload-icon">PDF</span>
        <span><b>{fileName || "上传 PDF 简历"}</b><small>{fileName ? "文件已准备好，点击可重新选择" : "必交项目 · 仅支持 PDF · 最大 10 MB"}</small></span>
        <i>{fileName ? "重新选择" : "选择文件"}</i>
      </label>
      <div className="pdf-security-note"><span>▣</span><p><b>简历仅对有权限的管理员开放</b><small>组长仅可查看本组及“不确定”投递，队长可查看全部投递。</small></p></div>
      {message && <div className={`form-message ${message.type}`} role="status">{message.text}</div>}
      <div className="form-submit"><label><input required type="checkbox" /><span>我同意信息仅用于本次战队招新与联系</span></label><button disabled={submitting}>{submitting ? "正在上传…" : "提交申请"}<span>→</span></button></div>
    </form>
  );
}
