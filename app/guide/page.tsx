import type { Metadata } from "next";
import Link from "next/link";
import { PublicFooter, PublicHeader } from "../components/PublicHeader";

export const metadata: Metadata = { title: "投递指南" };

const steps = [
  ["01", "了解方向", "阅读各组介绍，选择 1–2 个意向组；暂时拿不准时可选“不确定”。"],
  ["02", "准备简历", "把项目、技能和真实贡献讲清楚，导出一份不超过 10 MB 的 PDF。"],
  ["03", "在线投递", "完整填写联系方式与个人介绍，上传 PDF 后提交；成功页会显示申请编号。"],
  ["04", "等待联系", "管理员完成初筛后会通过你填写的手机号联系，网站暂不提供公开进度查询。"],
] as const;

export default function GuidePage() {
  return (
    <main className="site blueprint-shell">
      <PublicHeader active="guide" />
      <div className="content-page guide-page">
        <section className="content-hero guide-hero">
          <p className="bp-kicker"><span>投递指南</span> APPLICATION MANUAL</p>
          <h1>把真实的你，<br />放进这份 PDF。</h1>
          <p>我们看重你的思考过程、动手经历和成长潜力。模板不重要，真实、清楚、可追问更重要。</p>
          <div className="hero-index">04 <small>KEY STEPS</small></div>
        </section>

        <section className="guide-flow">
          {steps.map(([number, title, description], index) => <article key={number}><i>{number}</i><div><small>STEP {number}</small><h2>{title}</h2><p>{description}</p></div>{index < steps.length - 1 && <b>→</b>}</article>)}
        </section>

        <div className="guide-columns">
          <section className="guide-panel resume-checklist">
            <header><small>PDF CHECKLIST</small><h2>简历建议包含什么</h2></header>
            <ol>
              <li><b>基本信息</b><p>姓名、年级、专业和可靠的联系方式。</p></li>
              <li><b>项目与作品</b><p>描述你的角色、做法、遇到的问题和结果；课程作业、社团经历、个人作品都可以。</p></li>
              <li><b>技能与熟悉程度</b><p>避免只罗列软件名，可以写“用 STM32 完成过麦轮底盘控制”这样的证据。</p></li>
              <li><b>作品链接（可选）</b><p>GitHub、视频或作品集链接请确保审核期内可访问。</p></li>
            </ol>
          </section>
          <section className="guide-panel file-rules">
            <header><small>FILE SPECIFICATION</small><h2>文件规范</h2></header>
            <dl><div><dt>格式</dt><dd>仅 PDF，必须提交</dd></div><div><dt>大小</dt><dd>最大 10 MB</dd></div><div><dt>页数</dt><dd>建议 1–3 页</dd></div><div><dt>文件名</dt><dd>建议：姓名-意向组.pdf</dd></div></dl>
            <aside><b>上传前再检查一次</b><p>打开 PDF 确认中文字体、图片、链接和页面方向显示正常。不要在简历中放身份证号、住址等非必要敏感信息。</p></aside>
          </section>
        </div>

        <section className="faq-section">
          <header><small>FAQ</small><h2>常见问题</h2></header>
          <div className="faq-grid">
            <details open><summary>没有竞赛经历可以投吗？</summary><p>可以。课程项目、社团工作、个人练习和你解决问题的过程同样有价值。</p></details>
            <details><summary>可以同时选择两个组吗？</summary><p>可以，系统最多允许两个意向组。相关组长都能看到这份申请。</p></details>
            <details><summary>选“不确定”会有影响吗？</summary><p>不会。该投递会由队长和各组组长共同查看，再根据经历与兴趣协助分流。</p></details>
            <details><summary>提交后还能修改吗？</summary><p>当前版本不支持自助修改。发现关键信息错误时，请直接联系招新负责人。</p></details>
          </div>
        </section>

        <section className="guide-cta"><div><small>READY TO BUILD?</small><h2>准备好就开始投递。</h2></div><Link href="/apply">填写申请 <span>→</span></Link></section>
      </div>
      <PublicFooter />
    </main>
  );
}
