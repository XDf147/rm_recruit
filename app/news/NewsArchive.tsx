"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { news, newsCategories } from "../showcase/content";

export function NewsArchive() {
  const [category, setCategory] = useState<string>("全部");
  const items = news.filter((item) => category === "全部" || item.category === category);
  return <main className="dispatch-archive" aria-label="战队情报">
    <div className="dispatch-grid" key={category}>{items.map((item) => <Link key={item.slug} className="dispatch-card" href={"/news/" + item.slug}>
      <div><Image src={item.image} alt="" fill sizes="(max-width: 700px) 92vw, 34vw" /></div>
      <p><small>{item.category}</small><span><em>{item.en}</em><b>{item.title}</b></span></p>
    </Link>)}</div>
    <aside className="dispatch-rail"><strong aria-hidden="true">INFO</strong>
      <div className="dispatch-filters" aria-label="情报分类">{newsCategories.map((name) => <button type="button" key={name} aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}</div>
      <Link href="/#information">‹ 返回首页 <small>GO BACK</small></Link>
    </aside>
  </main>;
}
