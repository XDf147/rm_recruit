import type { Metadata } from "next";
import Link from "next/link";
import { GROUP_DETAILS } from "../../lib/groups";
import { PublicFooter, PublicHeader } from "../components/PublicHeader";

export const metadata: Metadata = { title: "战队组别" };

export default function GroupsPage() {
  return (
    <main className="site blueprint-shell groups-hub-shell">
      <PublicHeader active="groups" />

      <div className="groups-hub">
        <section className="groups-hub-hero" aria-labelledby="groups-title">
          <div className="groups-hero-copy">
            <p className="bp-kicker"><span>战队组别</span> TEAM ASSEMBLY / 05 UNITS</p>
            <h1 id="groups-title">一辆机器人，<br /><em>五种工程语言。</em></h1>
            <p>每个组都在解决不同的问题，也在同一条协作链路上彼此交接。点击任一组别，看看日常任务、技能路径和未来作品展示位。</p>
            <div className="groups-hero-actions">
              <a href="#unit-roster">浏览五个组别 <span>↓</span></a>
              <Link href="/apply">直接投递 <span>↗</span></Link>
            </div>
          </div>

          <aside className="assembly-map" aria-label="战队协作链路">
            <header><small>SYSTEM MAP</small><b>从结构到赛场表达</b></header>
            <ol>
              {GROUP_DETAILS.map((group, index) => (
                <li key={group.code}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><b>{group.name}</b><small>{group.role}</small></div>
                  <i>{group.code}</i>
                </li>
              ))}
            </ol>
            <footer><span>INPUT</span><i /><span>ROBOT</span><i /><span>ARENA</span></footer>
          </aside>
        </section>

        <section className="unit-roster" id="unit-roster" aria-labelledby="unit-roster-title">
          <header className="unit-roster-heading">
            <div><small>CHOOSE YOUR WORKBENCH</small><h2 id="unit-roster-title">找到你的工作台</h2></div>
            <p>五个入口，五套不同的详情界面。<br />键盘用户可使用 Tab 依次浏览。</p>
          </header>

          <div className="unit-roster-grid">
            {GROUP_DETAILS.map((group, index) => (
              <Link className={`unit-roster-card unit-card-${group.slug}`} href={`/groups/${group.slug}`} key={group.name}>
                <article>
                  <header><span>UNIT {String(index + 1).padStart(2, "0")}</span><i>{group.studio}</i></header>
                  <div className="unit-card-mark" aria-hidden="true">
                    <strong>{group.code}</strong>
                    <span /><span /><span />
                  </div>
                  <div className="unit-card-copy">
                    <small>{group.role}</small>
                    <h3>{group.name}</h3>
                    <p>{group.slogan}</p>
                  </div>
                  <footer><span>{group.skills.slice(0, 3).join(" · ")}</span><b>打开详情 <i>→</i></b></footer>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section className="groups-collaboration" aria-label="跨组协作说明">
          <div className="collaboration-index"><span>05</span><small>UNITS<br />ONE TEAM</small></div>
          <div><small>NOT SURE YET?</small><h2>方向可以晚一点确定，行动不必。</h2><p>投递时选择“不确定”不会降低优先级。队长和各组组长会结合你的经历、兴趣与现场沟通共同分流。</p></div>
          <Link href="/apply">带着问题去投递 <span>↗</span></Link>
        </section>
      </div>

      <PublicFooter />
    </main>
  );
}
