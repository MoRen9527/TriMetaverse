# SocialFi 目录与部署决策（服务域）

更新时间：2026-02-28
状态：已确认执行

## 决策结论

- `socialFi` 运行在服务域（7x24 在线），作为独立渠道接入与回包适配层。
- `socialFi` 采用独立目录/仓推进，目标层级与 `Tripilot` 同级。
- `socialFi` 只负责协议适配与消息标准化，不承载模型路由与主控编排。

## 推荐目录位（示例）

- `d:/OneDrive/Code/ai/socialFi`（与 `Tripilot` 同级）

## 与 Core-Agent 的边界

- `SocialFi -> Core-Agent`：标准化输入（消息、附件摘要、身份映射、渠道元数据）。
- `Core-Agent -> SocialFi`：标准化回包（流式片段、终态消息、错误口径）。
- 契约以 `docs/contracts/socialfi-core-agent-io.md` 为准（若变更需先更新契约再改实现）。

## 为什么不放在 TriMetaverse 内部子目录

1. 降低耦合：渠道适配与主控编排解耦，便于独立发布。
2. 便于扩展：新增渠道不影响核心主控仓结构。
3. 运维清晰：服务域组件可按独立仓进行 CI/CD 与值守。

## 与当前计划关系

- 本轮（R01）先建立 `socialFi` 独立骨架（壳层 + 契约对接位）。
- 后续按 Phase 计划推进首接渠道（优先 Telegram）。

## 执行约束

- 不在 `socialFi` 内实现 LLM 路由与 Agent 主控循环。
- 不绕过 `Core-Agent` 直接调用下游主控工具链。
- 所有变更回填到 `docs/runs/执行轮次参考模板-Rxx-...md`。
