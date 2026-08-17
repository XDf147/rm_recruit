export const GROUP_NAMES = ["机械组", "电控组", "硬件组", "算法组", "运营组"] as const;
export const APPLICATION_GROUPS = [...GROUP_NAMES, "不确定"] as const;

export const GROUP_DETAILS = [
  {
    name: "机械组", code: "ME", slug: "mechanical", role: "承载与运动", studio: "STRUCTURE SHOP", slogan: "让设计经得住赛场冲击",
    description: "负责机器人结构、传动与机构设计，从建模、仿真一路做到加工装配和赛场维护。",
    work: ["机器人结构与机构设计", "加工装配与故障抢修", "轻量化、可靠性与迭代验证"],
    skills: ["SolidWorks", "CAD", "3D 打印", "机械加工"],
    fit: "喜欢动手、空间想象力强，愿意在图纸与车间之间反复验证。",
    lead: "从一条受力路径、一套传动关系开始，把屏幕里的模型变成能承受碰撞、便于维护的赛场机器。",
    pipeline: ["需求拆解", "三维建模", "加工装配", "赛场维护"],
    media: [
      { label: "整车结构", hint: "预留战车全景或总装照片", ratio: "16 : 10" },
      { label: "机构细节", hint: "预留底盘、云台或发射机构特写", ratio: "4 : 3" },
      { label: "制造现场", hint: "预留加工、装配与测试过程记录", ratio: "4 : 3" },
    ],
  },
  {
    name: "电控组", code: "EC", slug: "control", role: "控制与通信", studio: "CONTROL LAB", slogan: "给钢铁装上神经系统",
    description: "负责嵌入式软件、运动控制和整车通信，让每个执行器精准、稳定地响应。",
    work: ["STM32 嵌入式开发", "电机控制与底盘算法", "CAN 总线、传感器与系统联调"],
    skills: ["C / C++", "STM32", "CAN", "控制理论"],
    fit: "享受定位问题，对软硬件联调、控制和系统稳定性有兴趣。",
    lead: "在传感器、控制器和执行器之间建立可靠闭环，让每条指令都能被看见、被验证、被稳定执行。",
    pipeline: ["控制目标", "固件实现", "整车联调", "日志复盘"],
    media: [
      { label: "整车联调", hint: "预留调车、参数整定或测试照片", ratio: "16 : 10" },
      { label: "控制界面", hint: "预留波形、日志或调试工具截图", ratio: "4 : 3" },
      { label: "赛场支持", hint: "预留备场与现场维护记录", ratio: "4 : 3" },
    ],
  },
  {
    name: "硬件组", code: "HW", slug: "hardware", role: "电路与供能", studio: "CIRCUIT BENCH", slogan: "把可靠写进每一块电路",
    description: "负责机器人电路、供电和 PCB 设计，为高强度比赛打造可靠的硬件基础。",
    work: ["原理图与 PCB 设计", "电源、驱动与信号链路", "焊接调试和硬件可靠性验证"],
    skills: ["KiCad / Altium", "模拟电路", "数字电路", "焊接调试"],
    fit: "对电路细节敏感，愿意使用仪器测量、排障并持续改版。",
    lead: "从接口定义到上电验证，把复杂连接收束成可靠电路，让机器人在高负载与强干扰环境下持续工作。",
    pipeline: ["接口定义", "原理图与 PCB", "焊接上电", "可靠性验证"],
    media: [
      { label: "核心电路", hint: "预留自研 PCB 或电控系统总览", ratio: "16 : 10" },
      { label: "焊接调试", hint: "预留工作台、示波器与焊接照片", ratio: "4 : 3" },
      { label: "版本迭代", hint: "预留多版电路板或测试记录", ratio: "4 : 3" },
    ],
  },
  {
    name: "算法组", code: "AI", slug: "algorithm", role: "感知与决策", studio: "VISION STACK", slogan: "让机器人看懂赛场并作出判断",
    description: "负责机器人视觉感知、目标识别、定位预测与算法部署，让决策在真实赛场稳定运行。",
    work: ["装甲板与能量机关识别", "目标跟踪、预测与弹道解算", "模型训练、推理优化与整车联调"],
    skills: ["Python / C++", "OpenCV", "PyTorch", "ROS2"],
    fit: "喜欢用数学与代码拆解问题，愿意面对噪声、延迟和算力约束反复调试。",
    lead: "把光线、运动和噪声转化为可用信息，在算力与延迟约束中建立从感知到决策的实时链路。",
    pipeline: ["数据采集", "训练与仿真", "部署优化", "实车验证"],
    media: [
      { label: "视觉效果", hint: "预留识别框、跟踪或预测效果截图", ratio: "16 : 10" },
      { label: "数据与训练", hint: "预留数据集、训练曲线或实验记录", ratio: "4 : 3" },
      { label: "实车验证", hint: "预留相机标定与场地测试照片", ratio: "4 : 3" },
    ],
  },
  {
    name: "运营组", code: "OP", slug: "operations", role: "内容与协作", studio: "TEAM DESK", slogan: "让团队持续高效地向前",
    description: "负责赛事支持、内容传播、资源协调和团队文化，让工程成员能专注于赛场。",
    work: ["赛事与日常运营", "公众号、视频号内容", "赞助外联与活动策划"],
    skills: ["内容策划", "沟通协作", "项目管理", "新媒体"],
    fit: "沟通主动、执行可靠，能把复杂事项拆成清楚的计划并推动落地。",
    lead: "连接赛场内外的人与资源，把训练、赛事、内容和合作组织成清晰节奏，让团队被支持也被看见。",
    pipeline: ["目标拆解", "资源协调", "内容执行", "复盘沉淀"],
    media: [
      { label: "赛事现场", hint: "预留赛场、备场或团队合影", ratio: "16 : 10" },
      { label: "内容作品", hint: "预留推文、视频或招新物料展示", ratio: "4 : 3" },
      { label: "团队活动", hint: "预留宣讲、培训与文化活动照片", ratio: "4 : 3" },
    ],
  },
] as const;
