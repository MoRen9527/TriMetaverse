---
name: ui-spec-needs-implementation-walkthrough
description: UI/产品 spec 必须附实现态走查——纸面合格≠实现合格；LG-035 CEO 走查七条否决教训（2026-09-11）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0612be9f-4255-47ef-b9ca-f91444749099
  modified: 2026-09-11T13:14:27.809Z
---

LG-035 TriMMC 栏翻车链：v1/v2 纸面评估被 CEO 认可，但实现走样+纸面自身带设计缺陷（子栏N 结构词汇泄漏进 UI、未明令废除独立密钥区、页级 IA 缺位只 spec 了栏没 spec 页），CEO 走查七条否决，结语「重新设计，产品与用户思维缺失」。重设计令硬约束=基于实现态设计（亲走查现役源码/截图，禁凭想象出件）。

**Why:** 纸面 spec 不含页级信息架构与控件级语义时，实现者会自行填补——结构词汇直接变 UI 文案、旧区并存双路径；纸面对照不出生产行为，只有实现态能。
**How to apply:** ①UI 类 spec 必附实现态对照（读实现源码 file:line 或逐屏截图），spec 结构词汇与 UI 文案两层分离并明示「禁入 UI」清单；②新 UI 灰度前置=本席亲走查（读实现+任务流+破坏流三遍），全绿才见 CEO；③四族模式化排查：术语自造/命名偷懒/布局错位/逻辑混杂（含双路径混杂——双密钥路径、双生效路径型）；④spec 时对既有页面做页级 IA 裁决，不只裁新栏。

关联：[[full-regression-reading-report-discipline]]、[[verification-style-confirmed]]。
