---
name: post-receive-gitdir-trap
description: git hook 内跨仓操作 unset GIT_DIR——纪律真源已入 TriCompany engineering-disciplines D-08
metadata: 
  node_type: memory
  type: reference
  originSessionId: 3ce184e6-6a9a-42ee-a7a4-8410d4fb6576
  modified: 2026-08-27T01:56:44.698Z
---

**真源（2026-08-27 起）**：`TriCompany/docs/workflow/engineering-disciplines.md` **D-08**。

速记：git 给 hook 注入 GIT_DIR 系变量压过 `git -C`——hook 内操作其他工作仓前必须 unset GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_OBJECT_DIRECTORY GIT_ALTERNATE_OBJECT_DIRECTORIES。相关：[[org-memory-governance-split]]
