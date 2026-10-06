---
name: tree-file-path-convention
description: 树文件（tree-op.json + briefs）必须写 operating-records 规范路径，禁止写仓库根
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-08-12T18:09:14.165Z
---

树文件（`tree-op.json`、`briefs/*.md`）永远写在 `docs/workflow/operating-records/<current-week>/trees/<treeId>/` 下，不是仓库根 `trees/<treeId>/`。

**Why**: 2026-08-12 r7-1 交付时小全把 tree-op.json 和 brief 写到了仓库根 `trees/r7-eng-gate/`，违反了 V0.6 协议 §12 和 CLAUDE.md 的定位。小贾（CEO 总助）修正合并后明确指出"这是交接纪律的核心条款"。

**How to apply**: 写树文件前先确认当前周目录（如 `docs/workflow/operating-records/2026-W33/`），树文件路径 = `<week>/trees/<treeId>/tree-op.json` + `<week>/trees/<treeId>/briefs/<nodeId>-<timestamp>.md`。发现写错路径立即 `git rm` 清理并在正确路径重建。
