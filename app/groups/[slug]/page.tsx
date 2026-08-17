import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GROUP_DETAILS } from "../../../lib/groups";
import { PublicFooter, PublicHeader } from "../../components/PublicHeader";

type GroupPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GROUP_DETAILS.map((group) => ({ slug: group.slug }));
}

export async function generateMetadata({ params }: GroupPageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = GROUP_DETAILS.find((item) => item.slug === slug);
  return group ? { title: `${group.name}｜战队组别`, description: group.description } : {};
}

export default async function GroupProfilePage({ params }: GroupPageProps) {
  const { slug } = await params;
  const groupIndex = GROUP_DETAILS.findIndex((item) => item.slug === slug);
  if (groupIndex < 0) notFound();

  const group = GROUP_DETAILS[groupIndex];
  const previous = GROUP_DETAILS[(groupIndex - 1 + GROUP_DETAILS.length) % GROUP_DETAILS.length];
  const next = GROUP_DETAILS[(groupIndex + 1) % GROUP_DETAILS.length];

  return (
    <main className={`site unit-profile-shell unit-theme-${group.slug}`}>
      <PublicHeader active="groups" />

      <article className="unit-profile-page">
        <nav className="unit-breadcrumb" aria-label="面包屑导航">
          <Link href="/groups">战队组别</Link><span>/</span><b>{group.name}</b>
          <i>{String(groupIndex + 1).padStart(2, "0")} — {String(GROUP_DETAILS.length).padStart(2, "0")}</i>
        </nav>

        <section className="unit-profile-hero" aria-labelledby="unit-profile-title">
          <div className="unit-profile-copy">
            <p><span>{group.code}</span>{group.studio}</p>
            <h1 id="unit-profile-title">{group.name}<small>{group.role}</small></h1>
            <h2>{group.slogan}</h2>
            <p>{group.lead}</p>
            <div className="unit-profile-actions">
              <Link href={`/apply?group=${encodeURIComponent(group.name)}`}>投递这个组 <span>↗</span></Link>
              <a href="#unit-work">了解日常任务 <span>↓</span></a>
            </div>
          </div>

          <div className="unit-hero-media" role="img" aria-label={`${group.media[0].label}图片预留位`}>
            <div className="unit-media-art" aria-hidden="true"><i /><i /><i /></div>
            <span className="unit-media-corner">IMAGE SLOT / 01</span>
            <div className="unit-media-label"><small>{group.media[0].ratio}</small><b>{group.media[0].label}</b><p>{group.media[0].hint}</p></div>
          </div>
        </section>

        <section className="unit-profile-intro" id="unit-work">
          <div className="unit-profile-statement">
            <small>WHAT WE BUILD</small>
            <h2>你会把什么<br />带到赛场？</h2>
            <p>{group.description}</p>
          </div>

          <div className="unit-work-list">
            {group.work.map((item, index) => (
              <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><i>DELIVERABLE</i></article>
            ))}
          </div>

          <aside className="unit-fit-note"><small>WHO FITS HERE</small><h2>适合这样的你</h2><p>{group.fit}</p></aside>
        </section>

        <section className="unit-pipeline" aria-labelledby="pipeline-title">
          <header><small>FROM INPUT TO ARENA</small><h2 id="pipeline-title">一项工作如何抵达赛场</h2></header>
          <ol>
            {group.pipeline.map((step, index) => (
              <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><b>{step}</b>{index < group.pipeline.length - 1 && <i>→</i>}</li>
            ))}
          </ol>
        </section>

        <section className="unit-toolbox" aria-label="技能工具箱">
          <div><small>TOOLBOX</small><h2>从这里开始积累</h2></div>
          <ul>{group.skills.map((skill, index) => <li key={skill}><span>{String(index + 1).padStart(2, "0")}</span>{skill}</li>)}</ul>
        </section>

        <section className="unit-gallery" aria-labelledby="gallery-title">
          <header><div><small>FUTURE WORKS</small><h2 id="gallery-title">图片与作品展示位</h2></div><p>后续可直接替换为战车照片、项目截图或训练记录，布局与比例已经预留。</p></header>
          <div className="unit-gallery-grid">
            {group.media.slice(1).map((media, index) => (
              <div className="unit-gallery-slot" role="img" aria-label={`${media.label}图片预留位`} key={media.label}>
                <span>0{index + 2}</span><i>{media.ratio}</i><div><small>IMAGE PLACEHOLDER</small><b>{media.label}</b><p>{media.hint}</p></div>
              </div>
            ))}
          </div>
        </section>

        <nav className="unit-switcher" aria-label="切换组别">
          <Link href={`/groups/${previous.slug}`}><small>← PREVIOUS UNIT</small><b>{previous.name}</b></Link>
          <Link href="/groups"><span>查看全部组别</span></Link>
          <Link href={`/groups/${next.slug}`}><small>NEXT UNIT →</small><b>{next.name}</b></Link>
        </nav>
      </article>

      <PublicFooter />
    </main>
  );
}
