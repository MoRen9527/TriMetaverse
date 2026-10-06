---
name: mr-face-task-routing
description: M/R 面任务路由纪律——TriRMC 仅跑生产任务（周平面迁移），代码修改/审计/优化一律走 TriMMC（CC 宿主）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3ce184e6-6a9a-42ee-a7a4-8410d4fb6576
  modified: 2026-08-26T03:25:11.106Z
---

2026-08-26 CEO 纠正：TC-001 代码修改任务被错误派发到还在调试中的 TriRMC（heyuan）。正确分工：

- **TriRMC（heyuan）**= 仅生产任务：周平面迁移（确定性脚本）。不跑正式代码修改。
- **TriMMC（sg-server）**= 所有开发/审计/优化任务：CC 宿主持久执行，脚手架完备。

**Why:** R 面 agent-core 还在训练期（早停/持续性缺失），让它做代码修改等于用未成熟的工具做需要成熟度的工作。

**How to apply:** 创建树时 domainRouting 字段决定路由——server-executable 仅限生产运维任务；代码修改类任务路由到本地研发仓或 TriMMC 编排。相关：[[weekly-plane-shift-executor]]、[[mr-face-maturity-gap]]
