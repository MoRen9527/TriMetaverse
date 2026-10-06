---
name: claude-code-model-env-semantics
description: "Claude Code 模型 env 键语义（_MODEL 系=真 ID / _NAME 系=仅 /model 展示名 / [1M]=客户端 1M 开关发请求前剥除 / HAIKU=小快副查询通道）"
metadata: 
  node_type: memory
  type: reference
  originSessionId: e11343a2-e97e-4a90-8c4a-5ac637545af8
  modified: 2026-09-15T06:15:41.084Z
---

2026-09-15 为「兜底按钮」A/B 裁决所做核查（claude-code-guide 出品，源=官方 model-config/env-vars 文档 + 本地源码快照 `TriMetaverse/reference/claude-code-2.1.88/`）：

- `ANTHROPIC_DEFAULT_{OPUS,SONNET,HAIKU,FABLE}_MODEL` = 各档别名解析的真 API 模型 ID；`ANTHROPIC_MODEL` = 主循环模型。
- `*_MODEL_NAME` 系 = **仅 `/model` 选择器的展示标签**（非 API ID）；`_DESCRIPTION`/`_SUPPORTED_CAPABILITIES` 同族。仅非一方路由（第三方 base URL）下生效。
- 模型串 `[1m]`（大小写不敏感）= **客户端 1M 上下文开关**：auto-compact 按 1M 计、加 context-1m beta 头，**发请求前被剥除**（provider 不见括号）。挂 `ANTHROPIC_MODEL`/`DEFAULT_*` 均可。
- `ANTHROPIC_DEFAULT_HAIKU_MODEL` 非死键 = 小快副查询通道（标题生成/搜索预处理/钩子等）；`ANTHROPIC_SMALL_FAST_MODEL` 为前身。
- 双凭据键并存：AUTH_TOKEN（Bearer）与 API_KEY 同写同值→任何优先级下生效值都=输入（故「全族同值」写在应急按钮里成立）。

**版本敏感**：FABLE 键系较新（文档有/2.1.188 快照无）；细节随 CC 版本漂移，用前速查。关联 [[llm-limits-never-from-memory]]。
