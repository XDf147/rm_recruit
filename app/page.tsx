import type { Metadata } from "next";
import { PublicFooter, PublicHeader } from "./components/PublicHeader";
import { IndexScene } from "./showcase/IndexScene";
import { InformationScene } from "./showcase/InformationScene";
import { MediaScene } from "./showcase/MediaScene";
import { MoreScene } from "./showcase/MoreScene";
import { RobotArchive } from "./showcase/RobotArchive";
import { Scene } from "./showcase/Scene";
import { WorldScene } from "./showcase/WorldScene";
import { ShowcaseDeck } from "./showcase/ShowcaseDeck";
import "./showcase/showcase.css";
import "./showcase/motion.css";
import "./showcase/media.css";

export const metadata: Metadata = {
  title: { absolute: "Polar Bear 战队｜以我之眼，探索无限｜Команда Polar Bear · Моими глазами — к бесконечности" },
  description: "深圳北理莫斯科大学北极熊机器人战队。浏览 RoboMaster 兵种、赛场影像与战队组别，加入北极熊。",
};

export default function Home() {
  return (
    <ShowcaseDeck footer={<PublicFooter home />}>
      <PublicHeader />
      <main className="scene-stage" id="chapter-stage" tabIndex={-1}>
        <Scene id="index"><IndexScene /></Scene>
        <Scene id="information"><InformationScene /></Scene>
        <Scene id="operator"><RobotArchive /></Scene>
        <Scene id="world"><WorldScene /></Scene>
        <Scene id="media"><MediaScene /></Scene>
        <Scene id="more"><MoreScene /></Scene>
      </main>
    </ShowcaseDeck>
  );
}
