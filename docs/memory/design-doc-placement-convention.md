---
name: design-doc-placement-convention
description: 设计/执行文档落点惯例——TriMetaverse 仓 docs/execution/，engineering/ 层级专属 TriCompany 技术真源
metadata: 
  node_type: memory
  type: project
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-08-13T19:00:33.924Z
---

TriMetaverse 仓自己的设计/执行文档真源惯例落 `TriMetaverse/docs/execution/`（先例：server-fleet-m0.md、production-dualrun-runbook.md、worktree-architecture-design.md）。`docs/engineering/` 层级是 **TriCompany** 技术真源的专属结构（TriCompany/docs/engineering/DESIGN.md），TriMetaverse 仓 docs/ 下无 engineering/ 目录。

**Why:** 两仓文档层级分工——engineering/ 是公司技术真源，execution/ 是仓级执行层设计。2026-08-14 我曾误建议小狄把 worktree 设计落 docs/engineering/，被纠正后留痕。

**How to apply:** 路由设计/执行类文档落点时，TriMetaverse 仓相关 → docs/execution/；涉及公司级技术真源 → TriCompany/docs/engineering/。与 [[doc-metadata-header]] 元信息头约定叠加使用。
