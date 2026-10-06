---
name: truth-record-amendment-policy
description: 历史叙事冻结、技术真源可修+修正记录——小贾确认的树文件修正取舍口径
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-08-13T11:11:50.656Z
---

树文件（brief/tree-op）修正取舍口径（小贾 2026-08-13 确认，后续同类照此办理）：

- **历史叙事冻结**：进度记录、时间戳、过程叙事不改（已在树的按原样保留）。
- **技术真源可修**：代码草样、设计决策、路径/配置值等可被复制执行的内容，发现错误时**改**，且必须附修正记录行（原形态 + 修正 commit 号 + 理由）。

**Why**：代码草样会被未来实现者复制——错一处传一处（实证：r2-1 brief §三.1 草样 sibling 探测两层上跳，实现/测试/草样三处同源复制，r2-3 回归才暴露）；技术真源错误有实际传播成本，历史叙事没有。

**How to apply**：同类裁决默认「改 + 留痕」，one-line 修正 + 修正记录行，commit 后报编排层；不抹历史、不静默改。关联 [[tree-file-path-convention]]。
