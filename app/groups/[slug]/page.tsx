import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GROUP_DETAILS } from "../../../lib/groups";
import { PublicFooter, PublicHeader } from "../../components/PublicHeader";
import { DraggableHeroImage } from "./DraggableHeroImage";

type GroupPageProps = { params: Promise<{ slug: string }> };
type GroupSlug = (typeof GROUP_DETAILS)[number]["slug"];

const heroImages: Record<GroupSlug, string> = {
  mechanical: "/images/groups/mechanical/赛场车图.jpg",
  control: "/images/groups/control/赛场电控组.jpg",
  hardware: "/images/groups/hardware/硬件组仪器.jpg",
  algorithm: "/images/groups/algorithm/赛场算法组.jpg",
  operations: "/images/groups/operations/赛场.jpg",
};

const toolboxImages: Record<GroupSlug, Record<string, { src: string; wide?: boolean }>> = {
  mechanical: {
    SolidWorks: { src: "/images/groups/mechanical/solidworks.png", wide: true },
    CAD: { src: "/images/groups/mechanical/cad.png" },
    "3D 打印": { src: "/images/groups/mechanical/3d-printing.png", wide: true },
    机械加工: { src: "/images/groups/mechanical/machining.png" },
  },
  control: {
    "C / C++": { src: "/images/groups/control/c.png" },
    STM32: { src: "/images/groups/control/stm32.png", wide: true },
    "VS Code": { src: "/images/groups/control/vscode.png" },
    "Keil 5": { src: "/images/groups/control/keil5.jpg" },
  },
  hardware: {
    "KiCad / Altium": { src: "/images/groups/hardware/kicad-altium.png", wide: true },
    嘉立创: { src: "/images/groups/hardware/machining.png" },
    MATLAB: { src: "/images/groups/hardware/matlab.png" },
    Multisim: { src: "/images/groups/hardware/multisim.png" },
  },
  algorithm: {
    "Python/C++": { src: "/images/groups/algorithm/python.png" },
    ROS2: { src: "/images/groups/algorithm/humble.png" },
    Navigation2: { src: "/images/groups/algorithm/navigation2.png" },
    OpenCV: { src: "/images/groups/algorithm/opencv.png" },
  },
  operations: {
    "PR 视频剪辑": { src: "/images/groups/operations/PR.png" },
    "LR 图片精修": { src: "/images/groups/operations/lightroom.png" },
    飞书团队管理: { src: "/images/groups/operations/fs.png" },
    社交媒体运营: { src: "/images/groups/operations/社交媒体.png", wide: true },
  },
};

const galleryImages: Record<GroupSlug, Record<string, string>> = {
  mechanical: {
    "3D图纸": "/images/groups/mechanical/平衡步兵.jpg",
    实车图片: "/images/groups/mechanical/平步实车.jpg",
  },
  control: {
    控制界面: "/images/groups/control/控制界面.jpg",
    操作手界面: "/images/groups/control/操作手.jpg",
  },
  hardware: {
    焊接调试: "/images/groups/hardware/电路接线.jpg",
    版本迭代: "/images/groups/hardware/电路原理图.jpg",
  },
  algorithm: {
    视觉自瞄: "/images/groups/algorithm/视觉自瞄.jpg",
    实车验证: "/images/groups/algorithm/导航图.jpg",
  },
  operations: {
    内容作品: "/images/groups/operations/内容作品.jpg",
    团队活动: "/images/groups/operations/火锅.jpg",
  },
};

const lightTextGalleryItems = new Set([
  "control:控制界面",
  "control:操作手界面",
  "algorithm:视觉自瞄",
  "hardware:焊接调试",
  "operations:团队活动",
]);

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
  const heroImage = heroImages[group.slug];

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

          <div className="unit-hero-media" role="img" aria-label={`${group.media[0].label}图片`}>
            <DraggableHeroImage src={heroImage} />
            <div className="unit-media-label">
              <b>{group.media[0].label}</b>
              <p>{group.media[0].caption}</p>
            </div>
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
          <header>
            <small>FROM INPUT TO ARENA</small>
            <h2 id="pipeline-title">我们的工作流</h2>
          </header>
          <ol>
            {group.pipeline.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{step}</b>
                {index < group.pipeline.length - 1 && <i>→</i>}
              </li>
            ))}
          </ol>
        </section>

        <section className="unit-toolbox" aria-label="技能工具箱">
          <div><small>TOOLBOX</small><h2>从这里开始积累</h2></div>
          <ul>
            {group.skills.map((skill, index) => {
              const icon = toolboxImages[group.slug][skill];
              return (
                <li key={skill}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {icon && (
                    <Image
                      className={icon.wide ? "toolbox-logo-wide" : undefined}
                      src={icon.src}
                      alt=""
                      width={icon.wide ? 56 : 32}
                      height={icon.wide ? 24 : 32}
                      unoptimized
                    />
                  )}
                  <b>{skill}</b>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="unit-gallery" aria-labelledby="gallery-title">
          <header><div><h2 id="gallery-title">图片与作品</h2></div></header>
          <div className="unit-gallery-grid">
            {group.media.slice(1).map((media, index) => {
              const classes = ["unit-gallery-slot", `unit-gallery-slot-${index + 2}`];
              const image = galleryImages[group.slug][media.label];
              if (group.slug === "mechanical" && media.label === "实车图片") classes.push("unit-gallery-mask");
              if (lightTextGalleryItems.has(`${group.slug}:${media.label}`)) classes.push("unit-gallery-light-text");

              return (
                <div className={classes.join(" ")} role="img" aria-label={`${media.label}图片`} key={media.label}>
                  {image && <Image src={image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />}
                  <span>0{index + 2}</span>
                  <div>
                    <b>{media.label}</b>
                    <p>{media.caption}</p>
                  </div>
                </div>
              );
            })}
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
