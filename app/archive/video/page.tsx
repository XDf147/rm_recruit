import type { Metadata } from "next";
import { PublicFooter, PublicHeader } from "../../components/PublicHeader";
import { FilmLibrary } from "../../showcase/MediaTheater";
import "../../showcase/media.css";

export const metadata: Metadata = { title: "影像列表｜北极熊机器人战队" };

export default function VideoArchivePage() {
  return <div className="video-archive-page"><PublicHeader active="media" /><FilmLibrary /><PublicFooter /></div>;
}
