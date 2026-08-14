import type { Metadata } from "next";
import { PublicFooter, PublicHeader } from "../components/PublicHeader";
import { ApplicationForm } from "./ApplicationForm";

export const metadata: Metadata = { title: "简历投递" };

export default function ApplyPage() {
  return (
    <main className="site blueprint-shell">
      <PublicHeader active="apply" />
      <div className="blueprint-apply">
        <aside className="blueprint-apply-copy">
          <p className="bp-kicker"><span>加入我们</span> RM TEAM / RECRUITMENT</p>
          <h1>从一张空白<br />蓝图开始。</h1>
          <p>你的经验不必完美。清晰地告诉我们：你做过什么、学到了什么、下一步想去哪里。</p>
          <ol>
            <li className="done"><i>01</i><span><b>了解组别方向</b><small>找到最想投入的战场</small></span></li>
            <li className="active"><i>02</i><span><b>填写投递信息</b><small>最多选择两个意向组别</small></span></li>
            <li><i>03</i><span><b>上传 PDF 简历</b><small>必交项目，最大 10 MB</small></span></li>
          </ol>
          <div className="apply-side-links">
            <a href="/groups"><b>还没想好方向？</b><span>查看战队组别介绍 →</span></a>
            <a href="/guide"><b>第一次准备简历？</b><span>阅读完整投递指南 →</span></a>
          </div>
        </aside>
        <ApplicationForm />
      </div>
      <PublicFooter />
    </main>
  );
}
