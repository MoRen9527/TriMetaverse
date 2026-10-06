---
name: m004-scope-registry-agents-spawn-ok
description: M-004 约束对象=13 员工常驻席；BusinessStrategy 等 registry agent 非常驻、spawn 合规（CEO 2026-09-16 勘正）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e11343a2-e97e-4a90-8c4a-5ac637545af8
  modified: 2026-09-16T13:27:11.777Z
---

M-004「派工默认 SendMessage 直达常驻席」的**约束对象=13 员工常驻席**（COS/CTO/CAO/CPO/CFO/CHO/CMO/COO/CSO/DE/FSD/STE/RDT）。**BusinessStrategy（及 CompanyGovernanceRegistry 等 registry 型）= 非人格 agent，不属于常驻员工席——对它们 spawn 合规**（CEO 2026-09-16 21:2x 勘正）。

**Why:** BOD 曾误把「COS spawn BS 审 CPO 域件」判为 M-004 违规并发纠偏令——被 CEO 勘正撤回。判据不是"agent 列表里有没有"，而是"是不是员工常驻席"（本机 12 peer 会话矩阵/sg 13 m-duty 矩阵 = 常驻面；registry 型无席位会话）。

**How to apply:** 派工前先分类：员工席→SendMessage 直达；registry/非人格 agent→spawn 正常走；不确定时查该 agent 是否有常驻会话位（ListAgents peer 名单/sg m-duty 矩阵）。纠偏令发出前先做这一步分类核验。关联 [[m004-seat-dispatch-via-sendmessage]]。
