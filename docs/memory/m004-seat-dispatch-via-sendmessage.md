---
name: m004-seat-dispatch-via-sendmessage
description: M-004 席位派工口径（2026-09-02 BOD 即时生效）——默认 SendMessage 直达常驻席，spawn 仅限三残留场景，「任务形态」裁量已删除
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 780358ee-d80a-4e31-917d-d5d2a85ad340
  modified: 2026-09-10T16:50:31.383Z
---

COS 宣贯 M-004 修订（2026-09-02，BOD 即时生效）：席位派工唯一默认＝SendMessage 直达常驻会话；spawn 仅限三残留场景（①目标席实勘不可达——实证在卷；②真并行 fan-out 且部分不在线；③无对应常驻席的一次性只读侦察）。「任务形态」裁量已删除——有界机械活/批量应用步一律直达在线席：**活干在谁会话，经验上下文就积累在谁**。

**Why:** spawn 出的一次性 subagent 干完活即散，经验与上下文不沉淀在任何常驻席；直达常驻席让工作连续性留在席位本体，符合公司「员工席=长期资产」的运营逻辑。

**How to apply:** 派工前先问「有没有对应常驻席」——有则 SendMessage 直达（先 ListAgents 对名址）；只有命中三残留场景之一才 spawn，且②③外需实证在卷。与 [[orchestrator-hub-split]] 的常驻中枢执行制同向：任务性工作走常驻席通道。正文名候治理册（M-004 条目），此条为行为指针。

**实证补（2026-09-11 CEO 指正）**：LG-034 切片 1 派工时 m-fsd 在线，我未 ListAgents 即 spawn 了 FSD subagent——被 CEO 一句「m-fsd 在线呢，你为啥要 spawn」点破。失误机理：赶时限时「spawn 自带完整 spec 更快」的错觉压过了先查名址的默认动作。修正动作序列：TaskStop 停 spawn（幸停在写盘前，git 零改动）→ 盘面核验 → 原 spec SendMessage 直达 m-fsd。**派工第一动作=ListAgents 查名址，不是写 spec。**
