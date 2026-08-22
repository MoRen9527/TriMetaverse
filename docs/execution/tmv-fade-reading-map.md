# 三元宇宙重定义 × FADE 阅读资料树图（2026-08-22）

用途：CEO 阅读地图——把白皮书、重定义计划、FADE 体系、流水线优化按依赖关系组织成树，标注阅读顺序与每篇一句话定位。
sourceOfTruth: TriMetaverse/docs/execution/tmv-fade-reading-map.md ｜ syncMode: source-only ｜ lastSyncedAt: 2026-08-22

## 阅读树（★ = 推荐先读）

```text
三元宇宙知识体系
│
├─ ① 理念层：三元宇宙是什么（读 3 篇，约 40 分钟）
│   ├─ ★ tmv-whitepaper.md v1.0〔已签发 2026-08-22，仓库根，1358 行〕
│   │     总纲。重点三节：§3.1 三层模型（双层表述：最小实现实例对+能力域，2026-08-22 重定义核心）
│   │     → 图 3-2 价值流转（:253，六步闭环：任务→执行→评估→奖励，AI/元宇宙/区块链三组成）
│   │     → §8.1 四层推进（L0-L3，含新模块名）
│   ├─ ★ docs/三元宇宙架构与模块说明.md v0.5〔中央架构口径〕
│   │     模块总清单（§4 表：TriMMC/TriMLC=元虚拟对、TriRMC/TriRLC=元现实对）
│   │     + 命名治理（§5：alias 双名过渡+TriMLC≠TriModel 消歧）+ 训练/生产叙事合流
│   └─ trees/tmv-minimal-restructure-analysis/R9-vision-mapping.md〔愿景映射〕
│         终态愿景（创业者多租户+区块链激励）×图 3-2 的对应表：
│         FADE 评分段=图中"AI 评估"环节的最小实现种子
│
├─ ② 计划层：为什么这么改、分几期（读 2 篇，约 30 分钟）
│   ├─ ★ R7-synthesis.md〔同目录，联审综合，五问全答+六决策〕
│   │     最浓缩的一篇：服务器 claude 零 agent-core 实证 / 三条 bridge / 任务量 34-44 批 / 4 期分期表
│   ├─ ★ R6-workload-phasing.md〔任务量与分期，276 行〕
│   │     七线任务量表+依赖图+17 风险+期 1-4 每期"目标一句话+批数+交付物"；
│   │     §3.2=FADE 流水线与大改造的排期关系表
│   ├─ R4-architecture-analysis.md〔架构方案，275 行〕三 bridge 方案/会话管理分界/分身调度三件
│   ├─ R8-scenario2-design.md〔场景 2，248 行〕k8s pod/随处接入/--reconnect/pod 落 PC 裁决
│   └─ （按需）R1/R2/R3 现状盘点、R5 理念分析、ceo-redefinition-brief.md 重定义原文
│
├─ ③ FADE 层：FADE 是什么（读 2 篇，约 40 分钟）
│   ├─ ★ TriCompany/docs/engineering/fade-registry.md〔实例登记册〕
│   │     四个已投产实例一览：FADE-001 周平面迁移（cron 链）/ 002 发布域（93 分）/
│   │     003 共学周记 / 004 员工域（上岗）——每实例十段工件表+评分记录
│   ├─ ★ TriCompany/docs/engineering/ade-pattern-spec.md v1.2.1〔协议规范，430 行〕
│   │     重点：§一 定义（智能发现→确定性执行→智能审核→CLI 收口）/ §2.6 试卷-答卷-评分 /
│   │     §6.2 多宿主渲染模型 / §8.6 触发链（定时巡检+即时指令两模式）
│   ├─ docs/training/fade-beginner-course.md〔小白版教程，174 行，带差异标注〕
│   └─ （按需）fade-product-guide / fade-code-deep-dive〔产品版 230 行/代码版 311 行〕
│
├─ ④ 优化方向层：FADE 流水线（已批待开工）
│   ├─ ★ 周平面 OP-202608-W34-001.json 的 FADE-PIPELINE-ANALYSIS-20260821-001 条目
│   │     六链环（检测-规划/即时指令/周期任务/平面审核门/重排/建树）×CFO 成本控制；
│   │     您的三裁决（治理三档/批次 A-D/事件触发提级）；A/B/D 已解锁可开工、C 挂期 2 后
│   └─ docs/workflow/operating-records/项目级 AI 共学周记/automation-backlog.md §7.1
│         事件自动触发在册条目（FADE-002 唯一遗留）
│
└─ ⑤ 支撑层：执行时按需查
    ├─ TriRMC/MIGRATION.md〔期 2 迁移蓝图：五批项四要素+回滚+硬时点〕
    ├─ docs/execution/clone-dispatch-protocol.md v0.3〔分身调度 placement 规格472+〕
    ├─ TriCompany/docs/engineering/agent-core-daemon-contract-design.md〔期 4 内核合同设计稿 320 行〕
    ├─ TriCompany/docs/engineering/session-sync-schema-alignment.md〔投影 schema 基线 164 行〕
    └─ docs/execution/agent-governance-alignment-design.md〔AGENTS/宿主治理 TODO 1-8，您保留待定调〕
```

## 推荐阅读路线（三程）

- **第一程·懂全局（~40 分钟）**：白皮书 §3.1+图 3-2 → 架构文档 §4/§5 → R7 综合
- **第二程·懂计划（~30 分钟）**：R6 分期表（§五）→ 期 2 看 TriRMC/MIGRATION.md → R8（若关心 k8s/手机接入）
- **第三程·懂 FADE（~40 分钟）**：fade-registry 四实例 → spec §一/§2.6/§8.6 → 流水线条目 → 小白教程补感

## 关键概念速查

| 概念 | 一句话 | 详见 |
| --- | --- | --- |
| 三层最小实现 | 元虚拟=TriMMC+TriMLC（用 claude 可换 codex）/ 元现实=TriRMC+TriRLC（自研 agent-core）/ 元认知=项目仓 | 白皮书 §3.1 |
| FADE | 十段生命周期全落地+评分通过的 ADE 成熟实例徽章 | spec §1.1、附录 B 词条 |
| 三条 bridge | 元虚拟内 ssh+bridge / 元虚拟↔元现实走 git 仓 / 元现实内四面复用 | R4 §2 |
| 试卷-评分 | 每次执行有考卷（必做项+验证法）、Score CLI 查覆盖、Score Skill 评质量、双门槛 | spec §2.6 |
| 治理三档 | 样本期逐项审批→类别白名单→类别全自动（5 条可观测升级条件） | 流水线条目 |
| 期 1-4 | 定名立项(已完成)→TriRMC 落座→可见性+bridge-1→内核收敛(可缓) | R6 §五 |
