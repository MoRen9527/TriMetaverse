---
name: design-doc-placement-convention
description: 设计/执行文档落点惯例——TriMetaverse 仓 docs/execution/，engineering/ 层级专属 TriCompany 技术真源
metadata: 
  node_type: memory
  type: project
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-10-08T16:28:54.352Z
---

TriMetaverse 仓自己的设计/执行文档真源惯例落 `TriMetaverse/docs/execution/`（先例：server-fleet-m0.md、production-dualrun-runbook.md、worktree-architecture-design.md）。`docs/engineering/` 层级是 **TriCompany** 技术真源的专属结构（TriCompany/docs/engineering/DESIGN.md），TriMetaverse 仓 docs/ 下无 engineering/ 目录。

**Why:** 两仓文档层级分工——engineering/ 是公司技术真源，execution/ 是仓级执行层设计。2026-08-14 我曾误建议小狄把 worktree 设计落 docs/engineering/，被纠正后留痕。

**How to apply:** 路由设计/执行类文档落点时，TriMetaverse 仓相关 → docs/execution/；涉及公司级技术真源 → TriCompany/docs/engineering/。与 [[doc-metadata-header]] 元信息头约定叠加使用。

**制度件统一归 CAO（CEO 裁 2026-10-09 00:28）**：凡**纪律正身/流程规范/治理规则**类文档（纪律册附录、D 系纪律条、流程规范、治理规则正身），正身位统一归 **CAO 纪律册域**（TriCompany/docs/workflow/engineering-disciplines.md 附录体系）——脚本/代码可以住施工仓，其纪律面正身归 CAO 域，施工仓只留执行实例与指针。起因=mirror-hook 方案稿「脚本在 TriMetaverse、纪律归 TriCompany」split 被 CEO 问维度归属，BOD 给两案（现状 split vs 制度件统一归 CAO），CEO 裁后者。适用判据：问「这文档是不是在定规矩/立纪律/建流程」——是→CAO 域正身；否（施工卷/树/毕报/快照）→各 operating-records 周平面照旧。
