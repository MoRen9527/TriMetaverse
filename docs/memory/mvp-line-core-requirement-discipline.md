---
name: mvp-line-core-requirement-discipline
description: MVP 划线纪律——核心原始需求不得划出首版；划线须对 CEO 原始令逐条回对（LG-035 时段切换被走查推翻教训 2026-09-12）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0612be9f-4255-47ef-b9ca-f91444749099
  modified: 2026-09-12T01:07:59.572Z
---

LG-035 划线翻车：CEO 原始需求「14:00-18:00 deepseek 定时切换」是核心路径，我 v2 评估件按实现复杂度把「时段切换 UI」划去 P2，TriMMC 卡首版因此没有时段入口——CEO 复走查实测推翻（09:05+0800），被迫随修复窗补设计。

**Why:** 按实现复杂度单方后置会漏看「这是谁的原始需求」——复杂度低≠可后置，原始需求核心路径的划线权不在实现侧评估。
**How to apply:** ①MVP 划线前对 CEO 原始令逐条回对：每条原始需求要么进首版、要么显式标注「后置+理由+CEO 知情」，不得静默降级；②「增强项」与「核心路径」分账管理；③被形态变更取代的 P2 项及时销项（如「多机卡片列表」被四卡令取代）。

关联：[[ui-spec-needs-implementation-walkthrough]]、[[verification-style-confirmed]]。
