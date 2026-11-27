import type { Metadata } from "next";
import { NewsArchive } from "./NewsArchive";

export const metadata: Metadata = { title: "战队情报" };
export default function NewsPage() { return <NewsArchive />; }
