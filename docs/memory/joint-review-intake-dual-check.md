---
name: joint-review-intake-dual-check
description: 联审/多席协作收稿必须双查消息流+树目录，查树先验现役周目录（翻周归位会迁件）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 1c4840bc-cf7a-49d6-a198-987bc373b80d
  modified: 2026-09-21T15:29:58.092Z
---

联审主办席收段稿不能只盯 SendMessage 消息流——段稿正位=树目录（`operating-records/<周>/trees/<tree-id>/`），各席落树未必发消息。

**Why**：2026-09-21 全自动化联审，本席催 BOD/CTO「欠稿」两席均回「早已落树」——双重误判：①只盯消息流没查树目录；②查树时用了旧周目录（翻周归位笔 b369f8164 已把当日 41 件产出 W38→W39 批量迁移），查了 W38 树位当然空。催办误判=主办席信用损耗+打扰被催席。

**How to apply**：收稿巡检顺序=消息流+`git log --all -- "*<件名>*"`（定位实际落盘周目录）+现役周目录树扫三查；催办前先跑三查再定「欠稿」断言。翻周日（周日 23:00 后）一切「文件不在」判断先怀疑被迁新周。关联 [[joint-review-orchestration]]、[[weekly-plane-shift-executor]]、[[task-charter-tree-protocol-restore]]。
