# Core-Agent / SocialFi 目录与部署决策（服务域）— 已归档

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/core-agent-repo-layout-decision.md
- syncMode: source-only
- lastSyncedAt: 2026-07-03

当前文件是 TriMetaverse `core-agent` 目录与部署决策的历史真源。**当前状态：Core-Agent 已废弃，observability 子系统已迁入 `TriMC/src/observability/`，物理目录 `core-agent/` 标记为 D 类冻结。** 本文保留作为架构决策记录（ADR）。

更新时间：2026-02-28
状态：已确认执行

相关专项文档：

- `docs/socialfi-repo-layout-decision.md`

## 决策结论

- `core-agent` 运行在服务域（7x24 在线），作为单独核心主控。
- `core-agent` 按 Kode 方向重写。
- `core-agent` 采用独立目录/仓推进，目标层级与 `TriPilot` 同级。
- `socialFi` 运行在服务域，作为单独渠道接入与回包适配层。
- `socialFi` 同样采用独立目录/仓推进，目标层级与 `TriPilot` 同级。

## 推荐目录位（示例）

- `d:/Code/ai/core-agent`（与 `TriPilot` 同级）
- `d:/Code/ai/socialFi`（与 `TriPilot` 同级）

## 为什么不采用“先 packages 调通再迁移”

1. 避免二次迁移：路径、脚本、依赖、CI 配置会重复改动。  
2. 降低耦合风险：核心主控与文档治理仓、前端仓保持边界清晰。  
3. 便于服务域部署：独立仓更容易接入独立发布与运维策略。  

## 与当前计划关系

- 本轮（R01）先完成独立 core-agent 骨架，再推进：
  - `#16` 最小事件适配器
  - `#17` 契约校验输入准备
- 同步建立 `socialFi` 独立骨架（先壳层、后渠道实现），确保 `SocialFi <-> Core-Agent` 契约对接位置固定。

## 执行约束

- 观测层不反向改写主控决策。  
- 先打通最小主路径，再扩展非关键功能。  
- 所有执行细节回填到 `docs/runs/run-Rxx-...md`。
