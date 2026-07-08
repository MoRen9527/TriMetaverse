# Observability 周计划模板（文本甘特 + Owner）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/observability-weekly-plan-template.md
- syncMode: source-only
- lastSyncedAt: 2026-06-04

当前文件是 TriMetaverse observability 周计划模板的本地真源，用于维护计划节奏、Owner 分工和任务跟踪样板；它不是 TriCompany 公司级 workflow 或产品真源。

更新时间：2026-02-28
适用范围：Phase2 / Phase3 / Phase4（Epic #15 / #19 / #21）

---

## 1) 关键路径（最短上线链）

1. `#16` Bridge 适配器（2~3 人天）
2. `#17` 契约校验（1~2 人天，依赖 `#16`）
3. `#18` timeline/replay API（2~3 人天，依赖 `#16/#17`）
4. `#29` 3D 状态机（2~3 人天，依赖 `#16`）
5. `#31` 回放控制（2~3 人天，依赖 `#29/#18`）

并行支线：

- `#30` 高亮联动（1~2 人天，依赖 `#29`）
- `#20` 子代理关系树（建议依赖 `#29`，可与 `#30` 并行）

---

## 2) 周节奏建议（2 人并行）

- W1：A 做 `#16`；B 做 Phase4 方案细化（不开发）
- W2：A 做 `#17 -> #18`；B 做 `#29`
- W3：A 做 `#31`；B 并行 `#30 + #20`
- W4：并行 `#25/#27` 与 `#26/#28`，周末做 O4 联调验收

---

## 3) 里程碑口径

- M1：`#16/#17/#18` 完成（可观测数据闭环）
- M2：`#29/#30/#31/#20` 完成（3D 可视化与回放闭环）
- M3：`#25/#26/#27/#28` 完成（培训复盘与值守闭环）

---

## 4) 默认 Owner 分工（初稿）

- `TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) Owner`：负责会话编排链路与事件生产侧对齐（`#16/#17` 协作）
- `API Owner`：负责查询接口、回放接口与性能门禁（`#18`）
- `Observability Owner`：负责 3D 状态模型、回放一致性与训练复盘链路（`#29/#31/#25/#26/#28`）
- `UI Owner`：负责高亮联动、子代理关系树与交互体验（`#30/#20`）
- `SRE/值守 Owner`：负责 runbook 接入与值守手册落地（`#27`）

---

## 5) 任务跟踪模板（可复制）

| Issue | 标题 | Owner | ETA | Status | 依赖 | 风险 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| #16 | Bridge 事件适配器 | TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) Owner | 2~3d | TODO | - | 事件源字段不一致 | |
| #17 | 契约校验接入 | TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) Owner + Observability Owner | 1~2d | TODO | #16 | 历史事件不满足 schema | |
| #18 | timeline/replay API | API Owner | 2~3d | TODO | #16,#17 | 查询性能/分页一致性 | |
| #29 | 3D 状态机与映射 | Observability Owner | 2~3d | TODO | #16 | 状态语义偏差 | |
| #30 | approval/tool 高亮联动 | UI Owner | 1~2d | TODO | #29 | 高频联动卡顿 | |
| #31 | 回放控制 | Observability Owner + API Owner | 2~3d | TODO | #29,#18 | 回放与实时冲突 | |
| #20 | 子代理关系树 | UI Owner | 1~2d | TODO | #29 | 树规模增长性能 | |
| #25 | 会话复盘模板 | Observability Owner | 1~2d | TODO | M2 | 模板抽象不足 | |
| #26 | 异常聚类与标签 | Observability Owner | 2~3d | TODO | M2 | 聚类准确率波动 | |
| #27 | runbook 接入 | SRE/值守 Owner | 1~2d | TODO | M2 | 手册与系统脱节 | |
| #28 | 可靠性容量基线 | Observability Owner | 2~3d | TODO | M2 | 基线采样不稳定 | |

---

## 6) Status 建议枚举

- `TODO`：未开始
- `IN_PROGRESS`：进行中
- `BLOCKED`：被依赖/问题阻塞
- `REVIEW`：开发完成待评审/验收
- `DONE`：完成并通过验收

---

## 7) 周会更新规则（建议）

- 每次周会只更新三项：`Status / ETA / Blocker`
- 每个里程碑至少保留一个“风险兜底任务”
- 若某任务 `BLOCKED > 2 天`，必须在 Epic 中补充绕行方案

---

## 8) 实名填充示例（可直接改名）

> 默认单 Owner 推进示例（当前仓库账号）：`@MoRen9527`

- `TriMC (原 TriMC (原 Core-Agent 已废弃) 已废弃) Owner`：`@MoRen9527`
- `API Owner`：`@MoRen9527`
- `Observability Owner`：`@MoRen9527`
- `UI Owner`：`@MoRen9527`
- `SRE/值守 Owner`：`@MoRen9527`

多人协作时，建议保留角色名不变，仅替换右侧实名，便于后续与 issue assignee 做一一映射。
