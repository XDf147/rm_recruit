"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type ViewMode = "captain" | "applicant";
type CandidateStatus = "新投递" | "评估中" | "待面试" | "已通过" | "未通过";

type Candidate = {
  id: string;
  name: string;
  initials: string;
  phone?: string;
  group: string;
  secondaryGroup?: string | null;
  major: string;
  year: string;
  score: number;
  status: CandidateStatus;
  skills: string[];
  intro: string;
  project: string;
  submitted: string;
  reviewNote?: string;
  resumeFilename?: string;
  resumeSize?: number;
  pdfUrl?: string;
  stored?: boolean;
};

const demoCandidates: Candidate[] = [
  {
    id: "demo-linyuan", name: "林予安", initials: "LY", group: "机械组", major: "机械设计制造及其自动化", year: "大一", score: 92,
    status: "待面试", skills: ["SolidWorks", "3D 打印", "数控加工"], submitted: "今天 09:42",
    intro: "痴迷于把脑海里的结构真正做出来。高中参与机器人社团两年，希望在 RM 的极限迭代中成长。",
    project: "自主设计并制作一台三轴机械臂，完成结构、传动选型和运动学验证。",
  },
  {
    id: "demo-zhoujian", name: "周见川", initials: "ZJ", group: "视觉组", major: "工业设计", year: "大二", score: 86,
    status: "新投递", skills: ["Blender", "Figma", "C4D"], submitted: "今天 08:16",
    intro: "喜欢赛场视觉、品牌和动态设计，相信一支强队也应该有让人一眼记住的表达。",
    project: "为校级科创赛事完成整套视觉识别与现场大屏动态包装。",
  },
  {
    id: "demo-shenzhi", name: "沈知遥", initials: "SZ", group: "电控组", major: "计算机科学与技术", year: "大一", score: 79,
    status: "评估中", skills: ["C++", "STM32", "ROS2"], submitted: "昨天 21:05",
    intro: "对嵌入式和机器人控制有持续兴趣，享受定位问题、复现问题再解决问题的过程。",
    project: "基于 STM32 完成麦轮小车底盘控制，并实现串口调参与简单里程计。",
  },
  {
    id: "demo-guwen", name: "顾文澈", initials: "GW", group: "运营组", major: "新闻传播学", year: "大二", score: 88,
    status: "已通过", skills: ["摄影", "Premiere", "内容策划"], submitted: "8 月 11 日",
    intro: "记录每一次调车和赛场瞬间，希望让更多人理解工程的浪漫。",
    project: "运营学院视频号半年，独立策划 3 条播放量破万的实验室人物短片。",
  },
  {
    id: "demo-tangke", name: "唐可之", initials: "TK", group: "算法组", major: "人工智能", year: "大一", score: 83,
    status: "新投递", skills: ["Python", "OpenCV", "PyTorch"], submitted: "8 月 10 日",
    intro: "从 RoboMaster 比赛视频开始了解计算机视觉，期待把算法真正跑在赛场上。",
    project: "完成基于 YOLO 的校园车辆检测项目，并进行 TensorRT 推理部署。",
  },
  {
    id: "demo-luoxi", name: "罗希然", initials: "LX", group: "机械组", major: "材料成型及控制工程", year: "大二", score: 85,
    status: "新投递", skills: ["CAD", "机械加工", "ANSYS"], submitted: "8 月 10 日",
    intro: "喜欢用结构解决复杂问题，也愿意在车间里反复打磨每一个零件。",
    project: "完成轻量化悬挂结构设计并进行静力学仿真和加工验证。",
  },
];

const groups = ["机械组", "电控组", "算法组", "视觉组", "运营组", "不确定"];
const statusOrder: CandidateStatus[] = ["新投递", "评估中", "待面试", "已通过"];

export default function Home() {
  const [view, setView] = useState<ViewMode>("captain");
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");
  const [liveCandidates, setLiveCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [toast, setToast] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const announce = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }, []);

  const loadApplications = useCallback(async (notify = false) => {
    setLoading(true);
    try {
      const response = await fetch("/api/applications", { cache: "no-store" });
      if (!response.ok) throw new Error("读取失败");
      const payload = (await response.json()) as { applications?: Candidate[] };
      setLiveCandidates((payload.applications ?? []).map((candidate) => ({ ...candidate, stored: true })));
      if (notify) announce("已同步最新投递记录");
    } catch {
      if (notify) announce("暂时无法同步，当前展示演示候选人");
    } finally {
      setLoading(false);
    }
  }, [announce]);

  useEffect(() => { void loadApplications(); }, [loadApplications]);

  const allCandidates = useMemo(() => [...liveCandidates, ...demoCandidates], [liveCandidates]);
  const filteredCandidates = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return allCandidates.filter((candidate) => {
      const matchesFilter = filter === "全部" || candidate.group === filter || candidate.status === filter;
      const matchesQuery = !keyword || `${candidate.name}${candidate.major}${candidate.group}`.toLowerCase().includes(keyword);
      return matchesFilter && matchesQuery;
    });
  }, [allCandidates, filter, query]);

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) { setFileName(""); return; }
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      event.target.value = "";
      setFileName("");
      announce("简历必须使用 PDF 格式");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      event.target.value = "";
      setFileName("");
      announce("PDF 简历不能超过 10 MB");
      return;
    }
    setFileName(file.name);
  };

  const toggleGroup = (group: string) => {
    setSelectedGroups((current) => {
      if (current.includes(group)) return current.filter((item) => item !== group);
      if (current.length >= 2) { announce("最多选择 2 个意向组别"); return current; }
      return [...current, group];
    });
  };

  const submitApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (selectedGroups.length === 0) { announce("请至少选择 1 个意向组别"); return; }
    if (!(data.get("resume") instanceof File) || !(data.get("resume") as File).size) { announce("PDF 简历为必交项目"); return; }

    setSubmitting(true);
    try {
      const response = await fetch("/api/applications", { method: "POST", body: data });
      const payload = (await response.json()) as { application?: Candidate; error?: string };
      if (!response.ok || !payload.application) throw new Error(payload.error || "提交失败");
      setLiveCandidates((current) => [{ ...payload.application!, stored: true }, ...current]);
      form.reset();
      setFileName("");
      setSelectedGroups([]);
      announce("投递成功！你的 PDF 简历已安全送达队长审核台");
    } catch (error) {
      announce(error instanceof Error ? error.message : "提交失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  const updateCandidate = (updated: Candidate) => {
    setLiveCandidates((current) => current.map((candidate) => candidate.id === updated.id ? updated : candidate));
    setSelected(updated);
  };

  return (
    <main className="site blueprint-shell" id="top">
      <BlueprintHeader view={view} setView={setView} />
      {view === "captain" ? (
        <CaptainWorkspace
          candidates={filteredCandidates}
          allCandidates={allCandidates}
          filter={filter}
          setFilter={setFilter}
          query={query}
          setQuery={setQuery}
          setSelected={setSelected}
          loading={loading}
          refresh={() => void loadApplications(true)}
        />
      ) : (
        <ApplicantWorkspace
          fileName={fileName}
          selectFile={selectFile}
          selectedGroups={selectedGroups}
          toggleGroup={toggleGroup}
          submitting={submitting}
          submitApplication={submitApplication}
        />
      )}
      {selected && <CandidateDrawer candidate={selected} onClose={() => setSelected(null)} announce={announce} onUpdate={updateCandidate} />}
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite"><span>✓</span>{toast}</div>
    </main>
  );
}

function BlueprintHeader({ view, setView }: { view: ViewMode; setView: (view: ViewMode) => void }) {
  return (
    <header className="blueprint-header">
      <a className="brand" href="#top" aria-label="RoboMaster 招新系统首页">
        <span className="brand-mark">R</span>
        <span className="brand-copy"><b>RoboMaster</b><small>招新系统 · RM RECRUIT</small></span>
      </a>
      <nav className="blueprint-nav" aria-label="站点导航"><a className="active" href="#workspace">招新工作台</a><a href="#groups">战队组别</a><a href="#guide">投递指南</a></nav>
      <div className="role-toggle" aria-label="切换使用视角">
        <button className={view === "captain" ? "active" : ""} onClick={() => setView("captain")}>队长审核</button>
        <button className={view === "applicant" ? "active" : ""} onClick={() => setView("applicant")}>队员投递</button>
      </div>
    </header>
  );
}

type CaptainProps = {
  candidates: Candidate[];
  allCandidates: Candidate[];
  filter: string;
  setFilter: (filter: string) => void;
  query: string;
  setQuery: (query: string) => void;
  setSelected: (candidate: Candidate) => void;
  loading: boolean;
  refresh: () => void;
};

function CaptainWorkspace(props: CaptainProps) {
  const liveCount = props.allCandidates.filter((candidate) => candidate.stored).length;
  const counts = statusOrder.map((status) => props.allCandidates.filter((candidate) => candidate.status === status).length);
  const groupData = ["机械组", "电控组", "算法组", "视觉组", "运营组"].map((group) => ({ group, count: props.allCandidates.filter((candidate) => candidate.group === group).length }));
  const maxGroup = Math.max(...groupData.map((item) => item.count), 1);

  return (
    <div className="blueprint-page" id="workspace">
      <section className="blueprint-intro">
        <div><p className="bp-kicker"><span>招新季</span> 2026 FALL RECRUITMENT</p><h1>审核工作台 <i>／ BLUEPRINT</i></h1><p>下午好，队长。当前有 <b>{counts[0]} 份</b>新投递等待查阅。</p></div>
        <div className="date-stamp"><small>FRI</small><b>14</b><span>AUG · 2026</span></div>
      </section>

      <section className="pipeline-panel pipeline-overview">
        <div className="bp-title"><div><small>APPLICATION PIPELINE</small><h2>招新进度</h2></div><button onClick={props.refresh} disabled={props.loading}>{props.loading ? "同步中…" : "↻ 同步投递"}</button></div>
        <div className="pipeline">
          {statusOrder.map((status, index) => (
            <article key={status}><span>{String(index + 1).padStart(2, "0")}</span><b>{String(counts[index]).padStart(2, "0")}</b><small>{status}</small>{index < 3 && <i>→</i>}</article>
          ))}
        </div>
        <p className="storage-note"><i>✓</i> 已接入持久化投递 · {liveCount} 份真实简历已存档 · PDF 可在线预览</p>
      </section>

      <div className="blueprint-main-grid">
        <section className="candidate-panel">
          <div className="candidate-toolbar">
            <div><small>CANDIDATE ARCHIVE</small><h2>{props.filter === "全部" ? "候选人档案" : props.filter}</h2></div>
            <label className="candidate-search"><span>⌕</span><input value={props.query} onChange={(event) => props.setQuery(event.target.value)} placeholder="搜索姓名、专业或组别" /></label>
          </div>
          <div className="filter-pills">{["全部", "新投递", "评估中", "待面试", "机械组", "电控组", "算法组"].map((item) => <button key={item} className={props.filter === item ? "active" : ""} onClick={() => props.setFilter(item)}>{item}</button>)}</div>
          <div className="blueprint-square-grid">
            {props.candidates.map((candidate, index) => (
              <button key={candidate.id} className="blueprint-square-card" onClick={() => props.setSelected(candidate)}>
                <span className="square-ticket"><i>{candidate.stored ? "LIVE RECORD" : `NO. ${String(index + 7).padStart(3, "0")}`}</i><StatusBadge status={candidate.status} /></span>
                <span className={`square-avatar paper-${index % 5}`}><b>{candidate.initials}</b><i>{candidate.score}<small>%</small></i></span>
                <span className="square-person"><small>{candidate.group} / {candidate.year}</small><b>{candidate.name}</b><i>{candidate.major}</i></span>
                <span className="square-skills">{candidate.skills.slice(0, 2).map((skill) => <i key={skill}>{skill}</i>)}</span>
                <span className="square-open"><b>{candidate.pdfUrl ? "PDF 已归档" : "演示候选人"}</b><i>{candidate.pdfUrl ? "预览 PDF ↗" : "打开档案 ↗"}</i></span>
              </button>
            ))}
            {!props.candidates.length && <div className="empty-state"><b>暂时没有匹配的候选人</b><span>换一个筛选条件试试</span></div>}
          </div>
        </section>

        <aside className="group-panel" id="groups">
          <div className="bp-title"><div><small>TEAM DEMAND</small><h2>各组投递分布</h2></div></div>
          <p>当前候选人数 / 相对热度</p>
          <div className="group-stats">
            {groupData.map((item, index) => <div key={item.group}><span><i>0{index + 1}</i><b>{item.group}</b><small>{item.count} 份</small></span><em><i style={{ width: `${Math.max(12, item.count / maxGroup * 100)}%` }} /></em></div>)}
          </div>
          <div className="insight-card"><span>审核提示</span><b>先看作品，再看匹配</b><p>点击候选人卡片可查看完整资料；真实投递会显示 PDF 在线预览入口。</p><button onClick={() => props.setFilter("新投递")}>处理新投递 →</button></div>
        </aside>
      </div>
      <footer className="bp-footer"><span>RM RECRUIT SYSTEM · ENGINEERING BLUEPRINT</span><span>保持好奇 · 持续迭代 · 并肩作战</span></footer>
    </div>
  );
}

type ApplicantProps = {
  fileName: string;
  selectFile: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedGroups: string[];
  toggleGroup: (group: string) => void;
  submitting: boolean;
  submitApplication: (event: FormEvent<HTMLFormElement>) => void;
};

function ApplicantWorkspace(props: ApplicantProps) {
  return (
    <div className="blueprint-apply" id="workspace">
      <aside className="blueprint-apply-copy" id="guide">
        <p className="bp-kicker"><span>加入我们</span> RM TEAM / 2026</p>
        <h1>从一张空白<br/>蓝图开始。</h1>
        <p>你的经验不必完美，清晰地告诉我们：你做过什么、学到了什么、下一步想去哪里。</p>
        <ol>
          <li className="done"><i>01</i><span><b>填写基本信息</b><small>姓名与联系方式</small></span></li>
          <li className="active"><i>02</i><span><b>选择意向组别</b><small>最多选择两个方向</small></span></li>
          <li><i>03</i><span><b>上传 PDF 简历</b><small>必交项目，最大 10 MB</small></span></li>
        </ol>
        <div className="deadline"><small>DEADLINE</small><b>08 / 26</b><span>周三 23:59 截止</span></div>
      </aside>
      <ApplicationForm {...props} />
    </div>
  );
}

function ApplicationForm(props: ApplicantProps) {
  return (
    <form className="application-form form-blueprint" onSubmit={props.submitApplication} encType="multipart/form-data">
      <div className="form-heading"><div><small>APPLICATION FORM / 2026</small><h2>提交你的申请</h2></div><span><b>01</b> / 01</span></div>
      <div className="form-progress"><i /><i /><i /></div>
      <div className="field-grid">
        <label><span>你的姓名 <b>*</b></span><input name="name" required autoComplete="name" placeholder="例如：林予安" /></label>
        <label><span>手机号码 <b>*</b></span><input name="phone" required type="tel" autoComplete="tel" pattern="[0-9+ -]{7,20}" placeholder="用于接收面试通知" /></label>
        <label><span>年级 <b>*</b></span><select name="year" required defaultValue=""><option value="" disabled>请选择年级</option><option>大一</option><option>大二</option><option>大三</option><option>研究生</option></select></label>
        <label><span>专业 <b>*</b></span><input name="major" required placeholder="你的主修专业" /></label>
      </div>
      <fieldset><legend>意向组别 <b>*</b><small>最多选择 2 个</small></legend><div className="group-options">{groups.map((group, index) => <label key={group}><input type="checkbox" name="group" value={group} checked={props.selectedGroups.includes(group)} onChange={() => props.toggleGroup(group)} /><span><i>{["⚙", "⌁", "⌘", "◈", "◎", "?"][index]}</i><b>{group}</b></span></label>)}</div></fieldset>
      <label className="wide-field"><span>关于你 <b>*</b><small>经历、技能，或一件让你有成就感的事</small></span><textarea name="about" required placeholder="不用写得很正式，真诚地告诉我们你是谁……" maxLength={400} /><i>最多 400 字</i></label>
      <label className={`upload required-upload ${props.fileName ? "has-file" : ""}`}>
        <input name="resume" type="file" required accept=".pdf,application/pdf" onChange={props.selectFile} />
        <span className="upload-icon">PDF</span>
        <span><b>{props.fileName || "上传 PDF 简历"}</b><small>{props.fileName ? "文件已准备好，点击可重新选择" : "必交项目 · 仅支持 PDF · 最大 10 MB"}</small></span>
        <i>{props.fileName ? "重新选择" : "选择文件"}</i>
      </label>
      <div className="pdf-security-note"><span>▣</span><p><b>文件将安全存储</b><small>你的 PDF 仅用于本次招新审核，队长可在审核台内直接预览。</small></p></div>
      <div className="form-submit"><label><input required type="checkbox" /><span>我已阅读并同意信息仅用于本次战队招新</span></label><button disabled={props.submitting}>{props.submitting ? "正在安全上传…" : "提交申请"}<span>→</span></button></div>
    </form>
  );
}

function StatusBadge({ status }: { status: CandidateStatus }) {
  return <span className={`status-badge status-${status}`}><i />{status}</span>;
}

function CandidateDrawer({ candidate, onClose, announce, onUpdate }: { candidate: Candidate; onClose: () => void; announce: (message: string) => void; onUpdate: (candidate: Candidate) => void }) {
  const [previewing, setPreviewing] = useState(Boolean(candidate.pdfUrl));
  const [reviewNote, setReviewNote] = useState(candidate.reviewNote ?? "");
  const [saving, setSaving] = useState(false);

  const saveReview = async (status?: CandidateStatus) => {
    if (!candidate.stored) { announce("这是演示候选人，真实投递后可保存审核结果"); return; }
    setSaving(true);
    try {
      const response = await fetch(`/api/applications/${candidate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewNote, ...(status ? { status } : {}) }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "保存失败");
      const updated = { ...candidate, reviewNote, status: status ?? candidate.status };
      onUpdate(updated);
      announce(status ? `${candidate.name} 已更新为“${status}”` : "审核评语已保存");
    } catch (error) {
      announce(error instanceof Error ? error.message : "保存失败，请稍后重试");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className={`candidate-drawer ${previewing ? "with-preview" : ""}`} onMouseDown={(event) => event.stopPropagation()} aria-modal="true" role="dialog" aria-label={`${candidate.name}的候选人档案`}>
        <div className="drawer-bar"><span>CANDIDATE FILE / 候选人档案</span><div>{candidate.pdfUrl && <button onClick={() => setPreviewing((value) => !value)}>{previewing ? "收起 PDF" : "预览 PDF"}</button>}<button onClick={onClose} aria-label="关闭">×</button></div></div>
        <div className="drawer-layout">
          <div className="drawer-details">
            <div className="drawer-person"><span className="drawer-avatar">{candidate.initials}</span><div><StatusBadge status={candidate.status} /><h2>{candidate.name}</h2><p>{candidate.major} · {candidate.year}</p></div><strong>{candidate.score}<small>%</small><i>匹配度</i></strong></div>
            <div className="drawer-meta"><span><small>意向组别</small><b>{candidate.group}</b></span><span><small>联系方式</small><b>{candidate.phone || "演示数据"}</b></span><span><small>投递时间</small><b>{candidate.submitted}</b></span></div>
            {candidate.resumeFilename && <div className="pdf-file-row"><span>PDF</span><div><b>{candidate.resumeFilename}</b><small>{candidate.resumeSize ? `${(candidate.resumeSize / 1024 / 1024).toFixed(2)} MB` : "已归档"}</small></div>{candidate.pdfUrl && <a href={candidate.pdfUrl} target="_blank" rel="noreferrer">新窗口打开 ↗</a>}</div>}
            {!candidate.pdfUrl && <div className="demo-pdf-note"><span>i</span><p><b>演示候选人暂无 PDF</b><small>新队员通过投递端提交后，会在这里出现可预览的 PDF 简历。</small></p></div>}
            <section><small>ABOUT / 自我介绍</small><p>{candidate.intro}</p></section>
            <section><small>PROJECT / 代表经历</small><p>{candidate.project}</p></section>
            <section><small>SKILL TAGS / 技能标签</small><div className="drawer-skills">{candidate.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section>
            <section className="review-note"><small>内部审核评语</small><textarea value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} placeholder="记录你的判断，其他审核人也可以看到……" /></section>
            <div className="drawer-actions"><button disabled={saving} onClick={() => void saveReview("未通过")}>暂不通过</button><button disabled={saving} onClick={() => void saveReview()}>{saving ? "保存中…" : "保存评语"}</button><button disabled={saving} onClick={() => void saveReview("待面试")}>通过并约面试 →</button></div>
          </div>
          {previewing && candidate.pdfUrl && <div className="pdf-preview"><div><span>PDF PREVIEW</span><a href={candidate.pdfUrl} target="_blank" rel="noreferrer">全屏查看 ↗</a></div><iframe src={candidate.pdfUrl} title={`${candidate.name}的 PDF 简历`} /></div>}
        </div>
      </aside>
    </div>
  );
}
