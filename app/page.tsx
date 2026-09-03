import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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

export default function Home() {
  return (
    <main className="entry-page">
      <div className="entry-slideshow" aria-hidden="true">
        {landingImages.map((image, index) => (
          <figure key={image.src}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes="100vw"
            />
          </figure>
        ))}
      </div>
      <div className="entry-overlay" />

      <div className="entry-brand" aria-label="北极熊机器人战队">
        <Image src="/images/brand/polarbear.png" alt="" width={54} height={54} priority />
        <span><b>北极熊机器人战队</b><small>POLAR BEAR ROBOTICS</small></span>
      </div>

      <section className="entry-content" aria-labelledby="entry-title">
        <p>ROBOMASTER · 2027 RECRUITMENT</p>
        <h1 id="entry-title">让热爱<br />抵达赛场</h1>
        <Link href="/apply">加入我们 <span>→</span></Link>
      </section>

      <footer className="entry-footer">
        <span>SCROLLING FIELD MOMENTS</span>
        <i />
        <span>POLAR BEAR · RM</span>
      </footer>
    </main>
  );
}
