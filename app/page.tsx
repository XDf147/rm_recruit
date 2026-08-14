"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type ViewMode = "captain" | "applicant";
type Candidate = {
  name: string;
  initials: string;
  group: string;
  major: string;
  year: string;
  score: number;
  status: "新投递" | "评估中" | "待面试" | "已通过";
  skills: string[];
  intro: string;
  project: string;
  submitted: string;
};

const concepts = [
  { id: 0, index: "01", name: "赛场中枢", note: "沉浸暗色" },
  { id: 1, index: "02", name: "工程蓝图", note: "理性轻盈" },
  { id: 2, index: "03", name: "冠军车库", note: "热血大胆" },
];

const candidates: Candidate[] = [
  {
    name: "林予安", initials: "LY", group: "机械组", major: "机械设计制造及其自动化", year: "大一", score: 92,
    status: "待面试", skills: ["SolidWorks", "3D 打印", "数控加工"], submitted: "今天 09:42",
    intro: "痴迷于把脑海里的结构真正做出来。高中参与机器人社团两年，希望在 RM 的极限迭代中成长。",
    project: "自主设计并制作一台三轴机械臂，完成结构、传动选型和运动学验证。",
  },
  {
    name: "周见川", initials: "ZJ", group: "视觉组", major: "工业设计", year: "大二", score: 86,
    status: "新投递", skills: ["Blender", "Figma", "C4D"], submitted: "今天 08:16",
    intro: "喜欢赛场视觉、品牌和动态设计，相信一支强队也应该有让人一眼记住的表达。",
    project: "为校级科创赛事完成整套视觉识别与现场大屏动态包装。",
  },
  {
    name: "沈知遥", initials: "SZ", group: "电控组", major: "计算机科学与技术", year: "大一", score: 79,
    status: "评估中", skills: ["C++", "STM32", "ROS2"], submitted: "昨天 21:05",
    intro: "对嵌入式和机器人控制有持续兴趣，享受定位问题、复现问题再解决问题的过程。",
    project: "基于 STM32 完成麦轮小车底盘控制，并实现串口调参与简单里程计。",
  },
  {
    name: "顾文澈", initials: "GW", group: "运营组", major: "新闻传播学", year: "大二", score: 88,
    status: "已通过", skills: ["摄影", "Premiere", "内容策划"], submitted: "8 月 11 日",
    intro: "记录每一次调车和赛场瞬间，希望让更多人理解工程的浪漫。",
    project: "运营学院视频号半年，独立策划 3 条播放量破万的实验室人物短片。",
  },
  {
    name: "唐可之", initials: "TK", group: "算法组", major: "人工智能", year: "大一", score: 83,
    status: "新投递", skills: ["Python", "OpenCV", "PyTorch"], submitted: "8 月 10 日",
    intro: "从 RoboMaster 比赛视频开始了解计算机视觉，期待把算法真正跑在赛场上。",
    project: "完成基于 YOLO 的校园车辆检测项目，并进行 TensorRT 推理部署。",
  },
];

const groupStats = [
  { name: "机械组", count: 14, percent: 82 },
  { name: "电控组", count: 11, percent: 64 },
  { name: "算法组", count: 9, percent: 52 },
  { name: "视觉 / 运营", count: 14, percent: 76 },
];

export default function Home() {
  const [concept, setConcept] = useState(0);
  const [view, setView] = useState<ViewMode>("captain");
  const [filter, setFilter] = useState("全部");
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [toast, setToast] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredCandidates = useMemo(
    () => filter === "全部" ? candidates : candidates.filter((candidate) => candidate.group === filter || candidate.status === filter),
    [filter],
  );

  const announce = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const submitApplication = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      announce("投递成功！队长将在 3 个工作日内完成初审");
    }, 700);
  };

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.files?.[0]?.name ?? "");
  };

  const shared = {
    view,
    setView,
    filter,
    setFilter,
    candidates: filteredCandidates,
    selected,
    setSelected,
    announce,
    fileName,
    selectFile,
    submitting,
    submitApplication,
  };

  return (
    <main className={`site concept-${concept}`}>
      <ConceptSwitcher concept={concept} setConcept={setConcept} />
      {concept === 0 && <NightConcept {...shared} />}
      {concept === 1 && <BlueprintConcept {...shared} />}
      {concept === 2 && <GarageConcept {...shared} />}
      {selected && <CandidateDrawer candidate={selected} onClose={() => setSelected(null)} announce={announce} concept={concept} />}
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite"><span>✓</span>{toast}</div>
    </main>
  );
}

type SharedProps = {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  filter: string;
  setFilter: (filter: string) => void;
  candidates: Candidate[];
  selected: Candidate | null;
  setSelected: (candidate: Candidate | null) => void;
  announce: (message: string) => void;
  fileName: string;
  selectFile: (event: ChangeEvent<HTMLInputElement>) => void;
  submitting: boolean;
  submitApplication: (event: FormEvent<HTMLFormElement>) => void;
};

function ConceptSwitcher({ concept, setConcept }: { concept: number; setConcept: (concept: number) => void }) {
  return (
    <nav className="concept-switcher" aria-label="三种设计方案">
      <span className="switch-label">设计方案</span>
      {concepts.map((item) => (
        <button key={item.id} className={concept === item.id ? "active" : ""} onClick={() => setConcept(item.id)} aria-pressed={concept === item.id}>
          <small>{item.index}</small><span>{item.name}</span><i>{item.note}</i>
        </button>
      ))}
    </nav>
  );
}

function RoleToggle({ view, setView }: Pick<SharedProps, "view" | "setView">) {
  return (
    <div className="role-toggle" aria-label="切换使用视角">
      <button className={view === "captain" ? "active" : ""} onClick={() => setView("captain")}>队长审核</button>
      <button className={view === "applicant" ? "active" : ""} onClick={() => setView("applicant")}>队员投递</button>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand ${compact ? "compact" : ""}`} href="#top" aria-label="RoboMaster 招新系统首页">
      <span className="brand-mark">R</span>
      <span className="brand-copy"><b>RoboMaster</b><small>招新系统 · RM RECRUIT</small></span>
    </a>
  );
}

function NightConcept(props: SharedProps) {
  return (
    <div className="night-shell" id="top">
      <header className="night-header">
        <Brand />
        <RoleToggle view={props.view} setView={props.setView} />
        <div className="user-chip"><span className="live-dot" /> 在线 <b>队长 · 陈屿</b><i>CY</i></div>
      </header>
      {props.view === "captain" ? <NightCaptain {...props} /> : <NightApply {...props} />}
    </div>
  );
}

function NightCaptain(props: SharedProps) {
  return (
    <div className="night-grid">
      <aside className="night-side">
        <p className="micro">RECRUITMENT / 2026</p>
        <h1>找到下一位<br/><em>并肩作战</em>的人</h1>
        <p className="lead">从简历筛选到面试决策，让每一位候选人的热爱被认真看见。</p>
        <button className="night-primary" onClick={() => props.setView("applicant")}>＋ 预览投递入口</button>
        <div className="batch-card"><small>当前招新批次</small><b>2026 秋季招新</b><span><i /> 距离截止还有 12 天</span></div>
        <div className="completion"><span>招新目标完成度 <b>60%</b></span><div><i /></div><small>已录取 18 / 目标 30 人</small></div>
      </aside>
      <section className="night-workspace">
        <div className="page-heading"><div><p className="micro">CAPTAIN OVERVIEW</p><h2>审核总览</h2></div><button className="soft-button" onClick={() => props.announce("招新数据已刷新")}>↻ 更新数据</button></div>
        <div className="night-metrics">
          <article><span>全部简历</span><strong>48</strong><small>较上周 <b>+12</b></small></article>
          <article><span>待你审核</span><strong>16</strong><small className="warm">需要优先处理</small></article>
          <article><span>进入面试</span><strong>9</strong><small>通过率 31%</small></article>
          <article className="metric-radar"><span>整体匹配度</span><strong>84<i>%</i></strong><div><b /></div></article>
        </div>
        <div className="filter-row">
          <div><h3>候选人队列</h3><span>{props.candidates.length} 位候选人</span></div>
          <FilterPills value={props.filter} onChange={props.setFilter} options={["全部", "机械组", "电控组", "算法组", "新投递"]} />
        </div>
        <div className="night-list">
          <div className="list-head"><span>候选人</span><span>意向组别</span><span>技能匹配</span><span>当前状态</span><span /></div>
          {props.candidates.map((candidate, index) => (
            <button className="night-candidate" key={candidate.name} onClick={() => props.setSelected(candidate)}>
              <span className={`initials tone-${index % 4}`}><b>{candidate.initials}</b><i /></span>
              <span className="candidate-id"><b>{candidate.name}</b><small>{candidate.major} · {candidate.year}</small></span>
              <span className="group-badge">{candidate.group}</span>
              <span className="score-cell"><b>{candidate.score}%</b><i><em style={{ width: `${candidate.score}%` }} /></i></span>
              <StatusBadge status={candidate.status} />
              <span className="open-resume">查看简历 ↗</span>
            </button>
          ))}
          {!props.candidates.length && <EmptyState />}
        </div>
      </section>
    </div>
  );
}

function NightApply(props: SharedProps) {
  return (
    <div className="night-apply">
      <section className="apply-hero">
        <p className="micro">JOIN THE TEAM · 2026</p>
        <h1>把热爱，<br/>装进<em>战车</em>。</h1>
        <p>别担心你还不够强。我们更在意你是否好奇、可靠，并愿意为共同目标持续迭代。</p>
        <div className="apply-facts"><span><b>06</b>招新组别</span><span><b>12</b>剩余天数</span><span><b>3d</b>预计反馈</span></div>
        <div className="tiny-note"><i>!</i><span>我们认真阅读每一份简历<br/>建议预留 8–12 分钟填写</span></div>
      </section>
      <ApplicationForm {...props} variant="night" />
    </div>
  );
}

function BlueprintConcept(props: SharedProps) {
  return (
    <div className="blueprint-shell" id="top">
      <header className="blueprint-header">
        <Brand />
        <div className="blueprint-nav"><a className="active" href="#workspace">招新工作台</a><a href="#groups">战队组别</a><a href="#guide">招新指南</a></div>
        <RoleToggle view={props.view} setView={props.setView} />
      </header>
      {props.view === "captain" ? <BlueprintCaptain {...props} /> : <BlueprintApply {...props} />}
    </div>
  );
}

function BlueprintCaptain(props: SharedProps) {
  return (
    <div className="blueprint-page" id="workspace">
      <section className="blueprint-intro">
        <div><p className="bp-kicker"><span>招新季</span> 2026 FALL RECRUITMENT</p><h1>审核工作台 <i>／ 08.14</i></h1><p>下午好，陈屿。今天有 <b>5 份</b>新投递等待查阅。</p></div>
        <div className="date-stamp"><small>FRI</small><b>14</b><span>AUG · 2026</span></div>
      </section>
      <div className="blueprint-dashboard">
        <section className="pipeline-panel">
          <div className="bp-title"><div><small>APPLICATION PIPELINE</small><h2>招新进度</h2></div><button onClick={() => props.announce("进度报告已导出")}>导出报告 ↓</button></div>
          <div className="pipeline">
            {[
              ["新投递", "16", "#1556d8"], ["简历评估", "12", "#6a5be8"], ["待面试", "09", "#e78332"], ["已录取", "18", "#168d68"],
            ].map(([label, number, color], index) => <article key={label}><span>{String(index + 1).padStart(2, "0")}</span><b style={{ color }}>{number}</b><small>{label}</small><i>→</i></article>)}
          </div>
          <div className="blueprint-candidates">
            <div className="bp-list-top"><h3>需要你处理</h3><FilterPills value={props.filter} onChange={props.setFilter} options={["全部", "新投递", "评估中", "待面试"]} /></div>
            {props.candidates.slice(0, 4).map((candidate, index) => (
              <button key={candidate.name} onClick={() => props.setSelected(candidate)}>
                <span className={`paper-avatar paper-${index % 4}`}>{candidate.initials}</span>
                <span><b>{candidate.name}</b><small>{candidate.major} · {candidate.year}</small></span>
                <em>{candidate.group}</em>
                <span className="bp-skills">{candidate.skills.slice(0, 2).map((skill) => <i key={skill}>{skill}</i>)}</span>
                <strong>{candidate.score}<small>%</small></strong>
                <span className="bp-arrow">→</span>
              </button>
            ))}
            {!props.candidates.length && <EmptyState />}
          </div>
        </section>
        <aside className="group-panel" id="groups">
          <div className="bp-title"><div><small>TEAM DEMAND</small><h2>各组招新热度</h2></div></div>
          <p>投递人数 / 目标人数</p>
          <div className="group-stats">
            {groupStats.map((group, index) => <div key={group.name}><span><i>0{index + 1}</i><b>{group.name}</b><small>{group.count} 份</small></span><em><i style={{ width: `${group.percent}%` }} /></em></div>)}
          </div>
          <div className="insight-card"><span>本周洞察</span><b>视觉组投递增长最快</b><p>近 7 天新增 6 人，相比上一周期增长 50%。</p><button onClick={() => props.setFilter("视觉组")}>查看候选人 →</button></div>
        </aside>
      </div>
      <footer className="bp-footer"><span>RM RECRUIT SYSTEM · BLUEPRINT 02</span><span>保持好奇 · 持续迭代 · 并肩作战</span></footer>
    </div>
  );
}

function BlueprintApply(props: SharedProps) {
  return (
    <div className="blueprint-apply" id="workspace">
      <aside className="blueprint-apply-copy">
        <p className="bp-kicker"><span>加入我们</span> RM TEAM / 2026</p>
        <h1>从一张空白<br/>蓝图开始。</h1>
        <p>你的经验不必完美，清晰地告诉我们：你做过什么、学到了什么、下一步想去哪里。</p>
        <ol><li className="done"><i>✓</i><span><b>基本信息</b><small>姓名与联系方式</small></span></li><li className="active"><i>02</i><span><b>能力与方向</b><small>选择意向组别</small></span></li><li><i>03</i><span><b>作品与简历</b><small>让我们更了解你</small></span></li></ol>
        <div className="deadline"><small>DEADLINE</small><b>08 / 26</b><span>周三 23:59 截止</span></div>
      </aside>
      <ApplicationForm {...props} variant="blueprint" />
    </div>
  );
}

function GarageConcept(props: SharedProps) {
  return (
    <div className="garage-shell" id="top">
      <header className="garage-header">
        <Brand />
        <p><i /> 2026 秋季招新进行中</p>
        <RoleToggle view={props.view} setView={props.setView} />
      </header>
      {props.view === "captain" ? <GarageCaptain {...props} /> : <GarageApply {...props} />}
    </div>
  );
}

function GarageCaptain(props: SharedProps) {
  return (
    <div className="garage-page">
      <section className="garage-banner">
        <div className="garage-title"><span>CAPTAIN&apos;S PIT</span><h1>招新<br/><em>作战室</em></h1><p>让合适的人，站上合适的位置。</p></div>
        <div className="garage-numbers"><article><small>ALL ENTRIES</small><b>48</b><span>全部投递</span></article><article><small>TO REVIEW</small><b>16</b><span>等待审核</span></article><article><small>ON BOARD</small><b>18</b><span>已经上车</span></article></div>
        <div className="bolt bolt-a">＋</div><div className="bolt bolt-b">＋</div>
      </section>
      <section className="garage-workspace">
        <aside className="garage-filters">
          <small>FILTER / 筛选</small><h2>挑选你的<br/>新队友</h2>
          <div>{["全部", "机械组", "电控组", "算法组", "视觉组", "新投递"].map((item) => <button key={item} className={props.filter === item ? "active" : ""} onClick={() => props.setFilter(item)}><span>{item}</span><i>{item === "全部" ? "48" : item === "新投递" ? "16" : "·"}</i></button>)}</div>
          <button className="garage-export" onClick={() => props.announce("候选人名单已生成")}>下载候选名单 ↘</button>
        </aside>
        <section className="garage-roster">
          <div className="garage-roster-head"><div><small>NEW BLOOD / 新鲜血液</small><h2>{props.filter === "全部" ? "最新投递" : props.filter}</h2></div><span>共 {props.candidates.length} 人 <i>↘</i></span></div>
          <div className="garage-cards">
            {props.candidates.map((candidate, index) => (
              <article key={candidate.name} className={`garage-card card-${index % 5}`} onClick={() => props.setSelected(candidate)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && props.setSelected(candidate)}>
                <div className="card-ticket"><span>NO. 00{index + 7}</span><span>{candidate.submitted}</span></div>
                <div className="garage-avatar"><span>{candidate.initials}</span><i>{candidate.score}</i></div>
                <div className="garage-person"><small>{candidate.group} / {candidate.year}</small><h3>{candidate.name}</h3><p>{candidate.major}</p></div>
                <div className="garage-skill-row">{candidate.skills.slice(0, 2).map((skill) => <span key={skill}>{skill}</span>)}</div>
                <button>打开档案 <span>↗</span></button>
              </article>
            ))}
            {!props.candidates.length && <EmptyState />}
          </div>
        </section>
      </section>
      <div className="garage-ticker"><span>KEEP BUILDING — KEEP FIGHTING — JOIN THE TEAM — KEEP BUILDING — KEEP FIGHTING — JOIN THE TEAM —</span></div>
    </div>
  );
}

function GarageApply(props: SharedProps) {
  return (
    <div className="garage-apply">
      <section className="garage-apply-hero">
        <div className="race-stripe"><span>RM</span><i /></div>
        <small>NEW PLAYER WANTED / 2026</small>
        <h1>准备好<br/>上场<em>了吗？</em></h1>
        <p>从零开始也没关系。把你的好奇心、执行力和不服输，带进我们的车库。</p>
        <div className="garage-tags"><span>机械</span><span>电控</span><span>算法</span><span>视觉</span><span>运营</span></div>
        <button onClick={() => document.getElementById("garage-form")?.scrollIntoView({ behavior: "smooth" })}>开始投递 ↓</button>
      </section>
      <div id="garage-form"><ApplicationForm {...props} variant="garage" /></div>
    </div>
  );
}

function FilterPills({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <div className="filter-pills">{options.map((option) => <button key={option} className={value === option ? "active" : ""} onClick={() => onChange(option)}>{option}</button>)}</div>;
}

function StatusBadge({ status }: { status: Candidate["status"] }) {
  return <span className={`status-badge status-${status}`}><i />{status}</span>;
}

function EmptyState() {
  return <div className="empty-state"><b>暂时没有匹配的候选人</b><span>换一个筛选条件试试</span></div>;
}

function ApplicationForm(props: SharedProps & { variant: "night" | "blueprint" | "garage" }) {
  return (
    <form className={`application-form form-${props.variant}`} onSubmit={props.submitApplication}>
      <div className="form-heading"><div><small>APPLICATION FORM / 01</small><h2>提交你的简历</h2></div><span><b>01</b> / 03</span></div>
      <div className="form-progress"><i /><i /><i /></div>
      <div className="field-grid">
        <label><span>你的姓名 <b>*</b></span><input required placeholder="例如：林予安" /></label>
        <label><span>手机号码 <b>*</b></span><input required type="tel" placeholder="用于接收面试通知" /></label>
        <label><span>年级 <b>*</b></span><select required defaultValue=""><option value="" disabled>请选择年级</option><option>大一</option><option>大二</option><option>大三</option><option>研究生</option></select></label>
        <label><span>专业 <b>*</b></span><input required placeholder="你的主修专业" /></label>
      </div>
      <fieldset><legend>意向组别 <b>*</b><small>最多选择 2 个</small></legend><div className="group-options">{["机械组", "电控组", "算法组", "视觉组", "运营组", "不确定"].map((group, index) => <label key={group}><input type="checkbox" name="group" defaultChecked={index === 0} /><span><i>{["⚙", "⌁", "⌘", "◈", "◎", "?"][index]}</i><b>{group}</b></span></label>)}</div></fieldset>
      <label className="wide-field"><span>关于你 <b>*</b><small>经历、技能，或一件让你有成就感的事</small></span><textarea required placeholder="不用写得很正式，真诚地告诉我们你是谁……" maxLength={400} /><i>0 / 400</i></label>
      <label className={`upload ${props.fileName ? "has-file" : ""}`}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={props.selectFile} />
        <span className="upload-icon">↥</span>
        <span><b>{props.fileName || "上传简历或作品集"}</b><small>{props.fileName ? "文件已准备好，点击可重新选择" : "支持 PDF / DOCX，最大 10 MB"}</small></span>
        <i>{props.fileName ? "重新选择" : "选择文件"}</i>
      </label>
      <div className="form-submit"><label><input required type="checkbox" /><span>我已阅读并同意信息仅用于本次战队招新</span></label><button disabled={props.submitting}>{props.submitting ? "正在投递…" : "提交申请"}<span>→</span></button></div>
    </form>
  );
}

function CandidateDrawer({ candidate, onClose, announce, concept }: { candidate: Candidate; onClose: () => void; announce: (message: string) => void; concept: number }) {
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className={`candidate-drawer drawer-${concept}`} onMouseDown={(event) => event.stopPropagation()} aria-modal="true" role="dialog" aria-label={`${candidate.name}的候选人档案`}>
        <div className="drawer-top"><span>候选人档案 / CANDIDATE FILE</span><button onClick={onClose} aria-label="关闭">×</button></div>
        <div className="drawer-person"><span className="drawer-avatar">{candidate.initials}</span><div><StatusBadge status={candidate.status} /><h2>{candidate.name}</h2><p>{candidate.major} · {candidate.year}</p></div><strong>{candidate.score}<small>%</small><i>匹配度</i></strong></div>
        <div className="drawer-meta"><span><small>意向组别</small><b>{candidate.group}</b></span><span><small>投递时间</small><b>{candidate.submitted}</b></span><span><small>简历编号</small><b>RM-260814</b></span></div>
        <section><small>ABOUT / 自我介绍</small><p>{candidate.intro}</p></section>
        <section><small>PROJECT / 代表项目</small><p>{candidate.project}</p></section>
        <section><small>SKILL TAGS / 技能标签</small><div className="drawer-skills">{candidate.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section>
        <section className="review-note"><small>内部评语</small><textarea placeholder="记录你的判断，其他审核人也可以看到……" /></section>
        <div className="drawer-actions"><button onClick={() => { announce(`${candidate.name} 已进入待定队列`); onClose(); }}>暂时保留</button><button onClick={() => { announce(`已邀请 ${candidate.name} 参加面试`); onClose(); }}>通过并约面试 →</button></div>
      </aside>
    </div>
  );
}
