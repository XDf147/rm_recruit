import type { Metadata } from "next";
import Link from "next/link";
import { GROUP_DETAILS } from "../../lib/groups";
import { PublicFooter, PublicHeader } from "../components/PublicHeader";

export const metadata: Metadata = { title: "战队组别" };

export default function GroupsPage() {
  return (
    <main className="site blueprint-shell">
      <PublicHeader active="groups" />
      <div className="content-page">
        <section className="content-hero">
          <p className="bp-kicker"><span>战队组别</span> FIND YOUR POSITION</p>
          <h1>不同的专长，<br />同一辆冲向赛场的车。</h1>
          <p>没有“最重要”的组别，只有彼此咬合的工程链路。选择最想投入的方向；如果仍拿不准，投递时选择“不确定”，队长会协助分流。</p>
          <div className="hero-index">05 <small>TEAM UNITS</small></div>
        </section>

        <section className="group-detail-grid" aria-label="战队组别介绍">
          {GROUP_DETAILS.map((group, index) => (
            <article className="group-detail-card" key={group.name}>
              <header><span>{String(index + 1).padStart(2, "0")} / {group.code}</span><b>{group.name}</b></header>
              <div className={`group-symbol symbol-${index}`}><strong>{group.code}</strong><i>RM UNIT</i></div>
              <h2>{group.slogan}</h2>
              <p>{group.description}</p>
              <section><small>你将参与</small><ul>{group.work.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <div className="skill-tags">{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              <aside><b>适合这样的你</b><p>{group.fit}</p></aside>
            </article>
          ))}
        </section>

        <section className="uncertain-callout">
          <span>?</span><div><small>NOT SURE YET</small><h2>还不确定选哪个组？</h2><p>选择“不确定”不会降低优先级。队长和各组组长会根据你的经历与兴趣共同判断。</p></div><Link href="/apply">带着问题去投递 →</Link>
        </section>
      </div>
      <PublicFooter />
    </main>
  );
}
