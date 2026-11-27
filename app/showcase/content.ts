export const chapters = [
  { id: "index", en: "INDEX", name: "首页", marker: "HOMEPAGE" },
  { id: "information", en: "INFORMATION", name: "情报", marker: "INFORMATION" },
  { id: "operator", en: "OPERATOR", name: "兵种", marker: "ROBOT ARCHIVE" },
  { id: "world", en: "WORLD", name: "组别", marker: "TEAM STRUCTURE" },
  { id: "media", en: "MEDIA", name: "战队影像", marker: "TEAM MEDIA" },
  { id: "more", en: "MORE", name: "更多内容", marker: "MORE" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

export const channels = {
  github: "https://github.com/SMBU-PolarBear-Robotics-Team",
  bilibili: "https://space.bilibili.com/3546375214074353",
  email: "mailto:polarbear_plan@163.com",
};

export const robots = [
  { id: "infantry", image: "/images/showcase/rm23-neu-infantry.webp", name: "步兵", en: "INFANTRY", role: "机动协作", description: "步兵穿行于赛场各处。底盘的灵活性和操作手的判断，让它能在不同位置与队友配合。" },
  { id: "hero", image: "/images/showcase/rm23-scut-hero.webp", name: "英雄", en: "HERO", role: "地面主力", description: "英雄是场上辨识度很高的重型地面机器人。它的移动节奏与队友密切相关，整车稳定性尤为重要。" },
  { id: "engineer", image: "/images/showcase/rm23-sjtu-engineer.webp", name: "工程", en: "ENGINEER", role: "资源搬运", description: "工程机器人用机械机构完成赛场上的取放与交接。一次顺利的资源搬运，离不开结构、控制与操作的默契。" },
  { id: "sentry", image: "/images/showcase/rm23-scut-sentry.webp", name: "哨兵", en: "SENTRY", role: "自主巡航", description: "哨兵自主感知周围环境，在赛场上定位、移动并作出决策。它是队伍里独立完成任务的成员。" },
  { id: "aerial", image: "/images/showcase/rm23-neu-aerial.webp", name: "无人机", en: "AERIAL", role: "空中支援", description: "空中机器人从高处观察赛场。飞手、地面队员和画面中的实时信息，共同构成另一种比赛视角。" },
  { id: "dart", image: "/images/showcase/rm23-scut-dart.webp", name: "飞镖", en: "DART", role: "场地专项", description: "飞镖系统是赛事中独立设置的专项装置。它在指定的比赛环节登场，与地面和空中兵种形成配合。" },
] as const;

export const newsCategories = ["全部", "招新", "赛事", "研发"] as const;

export const news = [
  { slug: "recruitment", category: "招新", en: "RECRUITMENT", title: "北极熊战队招新开放投递", image: "/images/groups/mechanical/机械组.jpg", text: "机械、电控、硬件、算法和运营五个组别开放投递。选择至多两个意向组别，在申请表中介绍自己，并上传一份 PDF 简历。", href: "/apply", action: "在线投递" },
  { slug: "arena", category: "赛事", en: "ARENA", title: "从检录区走向 RoboMaster 赛场", image: "/images/groups/mechanical/赛场车图3.jpg", text: "从准备区的最后一次检查，到操作手接过整车，比赛是整支队伍共同交付的一次工程实践。回到赛场影像，看看机器人真正上场的样子。", href: "/#media", action: "查看赛场影像" },
  { slug: "workshop", category: "研发", en: "WORKSHOP", title: "整车联调，从单个模块到整台机器人", image: "/images/groups/control/赛场电控组.jpg", text: "机械、电控、硬件与算法在同一张工作台上汇合。每次装配和测试，都让队员更清楚各个系统如何一起工作。", href: "/groups", action: "了解技术组别" },
  { slug: "open-source", category: "研发", en: "OPEN SOURCE", title: "北极熊的开源项目", image: "/images/groups/algorithm/赛场算法组.jpg", text: "战队在 GitHub 上分享导航、仿真与开发工具。你可以阅读项目说明，跟随队员留下的记录了解研发过程。", href: channels.github, action: "访问 GitHub" },
] as const;

export const gallery = [
  { src: "/images/groups/mechanical/赛场车图3.jpg", title: "赛场上的机器人" },
  { src: "/images/groups/control/赛场电控组.jpg", title: "准备区的整车联调" },
  { src: "/images/groups/mechanical/平步实车.jpg", title: "北极熊平衡步兵" },
  { src: "/images/groups/algorithm/赛场算法组.jpg", title: "赛场边的算法组" },
  { src: "/images/groups/hardware/硬件组仪器.jpg", title: "硬件组工作台" },
  { src: "/images/groups/operations/团队活动.jpg", title: "比赛之外的队员们" },
] as const;
