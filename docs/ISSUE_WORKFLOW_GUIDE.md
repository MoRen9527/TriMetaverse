# TMV 工作流使用说明：Issue 模板与任务管理指南

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/ISSUE_WORKFLOW_GUIDE.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-04

本指南帮助你用最少学习成本，直接上手使用 GitHub Issues 模板来管理三元宇宙（TMV）项目，从想法到上线的全过程都有据可依、可度量、可复盘。

---

## 1. 这是什么？

- 迭代任务卡：一张记录“要做什么、怎么做、何时完成、谁负责、如何验收”的卡片。
- GitHub Issues：GitHub 自带的“任务卡”功能，天然与代码、PR、讨论联动。
- Issues 模板：新建任务卡时的“表单模板”，保证卡片完整、清晰、可执行。

相关文件位置：

- 模板目录：`.github/ISSUE_TEMPLATE/`
  - `epic.md`（大型里程碑/项目）
  - `feature_request.md`（新功能/改进）
  - `tmv_task.md`（标准任务卡：需求→计划→设计→开发→测试→运营→上线）
  - `bug_report.md`（缺陷）
  - `spike.md`（调研/探索，时间盒）
  - `config.yml`（开启模板、引导链接）
- 本使用说明：`docs/ISSUE_WORKFLOW_GUIDE.md`

---

## 2. 三步快速开始

1) 建 Epic（里程碑）

- 进入 GitHub 仓库 → Issues → New issue → 选择“Epic”模板。
- 填写目标/KPI、范围、不做什么、时间线、预算、风险、子任务清单。

1) 拆 Task/Feature（可执行小卡）

- 针对 Epic，用“TMV Task”或“Feature request”模板拆成 5–15 张小卡。
- 每张卡填清：目标、方案、时间/成本、验收标准，勾选清单可追踪进度。

1) 上看板（Projects）与里程碑（Milestones）

- 为 Epic 设“Milestone”（如：M1、M2…）。
- 在 Projects 建“看板（Board）”：To do / In progress / Review / Done。
- 把 Issue 拖拽到看板列，流转全可视。

---

## 3. 何时用哪个模板

- Epic（epic.md）：
  - 场景：大型目标/里程碑，需跨多人或跨多周，内含多张子任务卡。
  - 例：M1 国际站+广告、M2 短视频矩阵、M3 AI 闯关教学、M4 创世 NFT、M5 SEO 扩展、M6 自动化闭环。

- Feature（feature_request.md）：
  - 场景：单个新功能/改进，属于某个 Epic。
  - 例：多语言自动切换、AdSense 接入、视频自动发布脚本。

- TMV Task（tmv_task.md）：
  - 场景：标准执行任务，按 需求→计划→设计→开发→测试→运营→上线 拆分，覆盖时间/成本/收益/验收。
  - 例：搭建 i18n 框架、配置 Sitemap 与 GSC、建立内容抽检流程。

- Bug（bug_report.md）：
  - 场景：缺陷/异常/回归，需清晰的复现步骤与环境。

- Spike（spike.md）：
  - 场景：调研/探索，时间盒，输出结论/方案对比/下一步行动。

---

## 4. 标签、里程碑、看板建议

- 标签（Labels）：
  - 类型：`type: epic` / `feature` / `task` / `bug` / `spike`
  - 领域：`area: web` / `video` / `course` / `nft` / `seo` / `infra`
  - 阶段：`stage: plan` / `design` / `dev` / `test` / `ops` / `release`
  - 优先级：`priority: P0` / `P1` / `P2`

- 里程碑（Milestones）：
  - 建立 `M1` ~ `M6`，分别对应 Phase 1 的 6 个子任务大目标。

- 看板（Projects → Board）：
  - 列：`Backlog` → `To do` → `In progress` → `Review` → `Done`
  - 规则：每张卡只在一个列中；进行中保持 WIP 限制（例如 ≤3）。

---

## 5. 与 Phase 1 计划的映射（示例）

参考 `tmv-phase-1-execution-plan.md`：

- Epic: M1 国际站+广告
  - Task: 站点信息架构与导航（stage: plan/design）
  - Task: Next.js + i18n + 缓存（stage: dev/test）
  - Task: AdSense/Ezoic 接入与A/B位测试（stage: design/dev/test/ops）
  - Task: 内容流水线（5–10篇/日）与抽检（stage: dev/ops）
  - Task: GSC 提交与基础 SEO（stage: ops/release）

- Epic: M2 AI 热点短视频矩阵
  - Task: 热点抓取与阈值（Trends/Reddit/X）（stage: dev/test）
  - Task: 脚本模板与合成管线（Runway/Pika/Heygen/ElevenLabs）（stage: dev/test）
  - Task: 多平台发布器与失败重试（YouTube/TikTok）（stage: dev/test/ops）
  - Task: 统一封面/字幕风格与UTM归因（stage: design/dev/ops）

- Epic: M3 AI 闯关教学（订阅/NFT 门票）
  - Task: 课程地图与关卡 PRD（stage: plan/design）
  - Task: AI 导师评测器与权限（stage: dev/test）
  - Task: Stripe + 加密支付接入（stage: dev/test）
  - Task: NFT 门票（Thirdweb/ERC-1155）（stage: dev/test/ops）

- Epic: M4 创世 NFT + 社区
  - Task: 权益与共创流程设计（stage: plan/design）
  - Task: 合约与铸造页（stage: dev/test）
  - Task: 白名单/预热/公售（stage: ops/release）

- Epic: M5 SEO 扩展与规模化
  - Task: 关键词库与选题评分器（stage: dev/test）
  - Task: 模板与内链策略（stage: design/dev）
  - Task: 外链合作与客座稿（stage: ops）

- Epic: M6 自动化闭环
  - Task: 收益看板与告警（Ads/YouTube/订阅/NFT）（stage: dev/test/ops）
  - Task: 二级市场监控与分润（stage: dev/test/ops）

每张 Task 请在模板中补充：人日、成本（Token/工具/托管）、预期收益（Ads/订阅/NFT）、验收标准（可量化 KPI）。

---

## 6. 小技巧与最佳实践

- 70% 原则：先创建卡、先行动，细节在进行中补全。
- 一卡一事：卡片过大就拆；过小就合并，保持“能 1–3 天完成”。
- 有始有终：每张卡要有验收标准与回滚预案。
- 数据闭环：在卡里放埋点需求与看板链接，复盘有依据。

---

## 7. 常见问题（FAQ）

- 我只有我一个人，值得用吗？
  - 更值得：能把“脑中的计划”外化，便于复盘和节奏管理。
- 模板太多记不住？
  - 记住 3 个就好：Epic（大目标）、Task（执行）、Bug（问题）。
- 会不会很重？
  - 用最轻的写法：只填关键字段，后面逐步完善。

---

## 8. 维护与更新

- 模板可按需调整字段（先复制再改），避免破坏历史卡片。
- 建议按月度复盘更新：标签体系、看板列、验收标准示例。

---

## 9. 参考

- 本仓库 Phase 1 计划：`tmv-phase-1-execution-plan.md`
- 模板目录：`.github/ISSUE_TEMPLATE/`
- GitHub Projects（看板）：建议创建一个“TMV Phase 1”项目并将 Issues 加入。
