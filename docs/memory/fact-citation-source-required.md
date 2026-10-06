---
name: fact-citation-source-required
description: 技术设计引用事实必须可溯源（OP 条目/commit/代码路径），无来源推断要显式标注，不可混为事实
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-08-14T04:32:06.618Z
---

2026-08-14 联合设计对账事件：我在 init-to-collab 技术面初稿里引用「服务器自有密钥现状」作为 key 维同步设计依据，小乔对账时要求给来源——溯源后该说法无直接证据（TriMC code-state 仅有 e2e 测试需 DEEPSEEK_API_KEY 的记录，无服务器部署侧密钥配置事实），属未验证推断，最终撤回该设计立场。同稿的 SEC-20260813-001、r3 冒烟口径均有 OP W34 risks 条目可溯源，对账无争议。

**Why:** 设计文档会被对账、仲裁和 CEO 审批；无来源推断混入事实基线会让下游基于错误前提做决策（这里导致我设计了错误的 key 同步方案并为此多写了一个载体方案）。

**How to apply:**
1. 技术设计里每个「现状」断言附来源（OP 条目编号 / commit / 代码路径行号），引用前自己先验证来源真实存在。
2. 推断必须显式标注「推断，未经验证」并给出验证方法，不得与事实同表混排。
3. 对账发现引用无来源时，立即撤回立场重新裁决，不辩护。

关联：[[parallel-design-file-discipline]]
