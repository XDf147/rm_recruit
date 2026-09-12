import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { GROUP_DETAILS } from "../lib/groups";
import { PublicFooter, PublicHeader } from "./components/PublicHeader";

export const metadata: Metadata = {
  title: "加入北极熊机器人战队",
  description: "从这里了解北极熊机器人战队，并进入招新投递页面。",
};

const landingImages = [
  { src: "/images/groups/mechanical/赛场车图.jpg", alt: "机器人在赛场上行驶" },
  { src: "/images/groups/control/赛场电控组.jpg", alt: "电控组在赛场工作" },
  { src: "/images/groups/hardware/硬件组仪器.jpg", alt: "硬件组工作台与仪器" },
  { src: "/images/groups/algorithm/赛场算法组.jpg", alt: "算法组在赛场调试" },
  { src: "/images/groups/operations/赛场.jpg", alt: "战队成员在赛事现场" },
] as const;

const eventCards = [
  { index: "01", title: "赛场竞技", text: "从赛前检录到正式对抗，让每一次技术迭代接受真实赛场检验。", image: "/images/groups/operations/赛场.jpg" },
  { index: "02", title: "整车联调", text: "机械、电控、硬件与算法共同协作，把分系统能力整合成可靠的机器人。", image: "/images/groups/control/赛场电控组.jpg" },
  { index: "03", title: "赛事传播", text: "记录训练与比赛现场，让工程过程、团队故事和赛场时刻被更多人看见。", image: "/images/groups/operations/CCTV采访.jpg" },
] as const;

const robotCards = [
  { title: "平衡步兵", label: "BALANCE INFANTRY", image: "/images/groups/mechanical/平步实车.jpg" },
  { title: "赛场机器人", label: "FIELD ROBOT", image: "/images/groups/mechanical/赛场车图3.jpg" },
  { title: "视觉自瞄", label: "VISION SYSTEM", image: "/images/groups/algorithm/视觉自瞄.jpg" },
  { title: "自主导航", label: "NAVIGATION", image: "/images/groups/algorithm/导航图.jpg" },
] as const;

export default function Home() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <main className="site home-page">
        <PublicHeader />

        <section className="entry-page" id="top">
          <div className="entry-slideshow" aria-hidden="true">
            {landingImages.map((image, index) => (
              <figure key={image.src}>
                <Image src={image.src} alt={image.alt} fill priority={index === 0} sizes="100vw" />
              </figure>
            ))}
          </div>
          <div className="entry-overlay" />

          <div className="home-hero-grid">
            <section className="entry-content" aria-labelledby="entry-title">
              <p className="home-team-name">深圳北理莫斯科大学 SMBU · 北极熊机器人战队</p>
              <p className="home-recruit-kicker">ROBOMASTER · 2027 RECRUITMENT</p>
              <h1 id="entry-title">让热爱<br />抵达赛场</h1>
              <p className="entry-lead">一群从零开始造机器人的学生。我们画图、加工、写代码，也在每一次失败后重新出发。</p>
              <div className="entry-actions">
                <Link href="/apply" transitionTypes={["nav-forward"]}>了解北极熊 <span>→</span></Link>
                <Link href="/groups">查看组别 <span>↘</span></Link>
              </div>
            </section>

            <aside className="home-hero-mark" aria-label="五个组别，一个团队">
              <span>PB</span><i />
              <div><small>05 UNITS</small><b>ONE TEAM</b><p>ME · EC · HW · AI · OP</p></div>
            </aside>
          </div>

        </section>

        <section className="home-section home-events reveal-section" id="events">
          <header className="home-section-heading">
            <div><small>ROBOMASTER EVENTS</small><h2>RM 赛事</h2></div>
            <p>比赛不是终点，而是检验设计、协作与临场判断的工程现场。</p>
          </header>
          <div className="home-event-grid">
            {eventCards.map((card) => (
              <article key={card.index}>
                <div style={{ position: "relative" }}><Image src={card.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
                <span>{card.index}</span><small>FIELD NOTE</small><h3>{card.title}</h3><p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-robots reveal-section" id="robots">
          <header className="home-section-heading home-section-heading-dark">
            <div><small>ROBOT ARCHIVE</small><h2>机器人图鉴</h2></div>
            <p>从机构、控制到感知，每一台机器人都是多组协同完成的系统工程。</p>
          </header>
          <div className="home-robot-grid">
            {robotCards.map((robot, index) => (
              <article key={robot.title} style={{ position: "relative" }}>
                <Image src={robot.image} alt={robot.title} fill sizes="(max-width: 760px) 100vw, 50vw" />
                <span>0{index + 1}</span>
                <div><small>{robot.label}</small><h3>{robot.title}</h3></div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section home-groups reveal-section" id="groups">
          <header className="home-section-heading">
            <div><small>TEAM STRUCTURE</small><h2>组别介绍</h2></div>
            <p>五种工作方式围绕同一个目标协作，找到最适合你的工作台。</p>
          </header>
          <div className="home-group-list">
            {GROUP_DETAILS.map((group, index) => (
              <Link href={`/groups/${group.slug}`} key={group.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><small>{group.code} / {group.studio}</small><h3>{group.name}</h3></div>
                <p>{group.role}</p><b>↗</b>
              </Link>
            ))}
          </div>
          <Link className="home-section-link" href="/groups">查看完整组别介绍 <span>→</span></Link>
        </section>

        <section className="home-honors reveal-section" id="honors">
          <div><small>HONOR WALL</small><h2>荣誉来自每一次<br />可靠的迭代。</h2></div>
          <p>战队荣誉资料正在整理中。这里将用于记录赛季成绩、技术突破与共同走过赛场的时刻。</p>
          <span>TO BE CONTINUED</span>
        </section>

        <section className="home-contact reveal-section" id="contact">
          <div>
            <small>READY TO BUILD?</small><h2>下一个赛场故事，<br />等你一起完成。</h2>
            <Image className="home-contact-slogan" src="/images/brand/polarbear-lockup.png" alt="北极熊机器人战队——以我之眼，探索无限" width={620} height={176} />
          </div>
          <div><p>如果你对机器人、工程实践或团队协作感兴趣，从一份真实的申请开始。</p><Link href="/apply" transitionTypes={["nav-forward"]}>加入我们 <span>→</span></Link></div>
        </section>

        <PublicFooter />
      </main>
    </ViewTransition>
  );
}
