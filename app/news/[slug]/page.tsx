import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { news } from "../../showcase/content";

type StoryPage = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return news.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: StoryPage): Promise<Metadata> {
  const { slug } = await params;
  return { title: news.find((item) => item.slug === slug)?.title };
}
export default async function Story({ params }: StoryPage) {
  const { slug } = await params;
  const item = news.find((story) => story.slug === slug);
  if (!item) notFound();
  return <main className="dispatch-article">
    <article>
      <header><h1><span>{item.category}</span>{item.title}</h1><small>{item.en}</small></header>
      <Image src={item.image} alt={item.title} width={1150} height={630} sizes="(max-width: 700px) 94vw, 72vw" priority />
      <p>{item.text}</p><a className="dispatch-action" href={item.href}>{item.action} ↗</a>
    </article>
    <aside className="dispatch-rail"><strong aria-hidden="true">INFO</strong>
      <Link href="/news">‹ 返回列表 <small>GO BACK</small></Link><Link href="/#information">返回首页 <small>HOMEPAGE</small></Link>
    </aside>
  </main>;
}
