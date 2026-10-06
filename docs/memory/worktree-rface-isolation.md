---
name: worktree-rface-isolation
description: R 面执行体在 worktree 中运行——本地 TriRLC cwd=D:\Code\ai\TriMetaverse WorkTree（project/trimetaverse 分支），不碰研发主仓
metadata: 
  node_type: memory
  type: project
  originSessionId: 3ce184e6-6a9a-42ee-a7a4-8410d4fb6576
  modified: 2026-08-26T03:28:38.608Z
---

TriRMC/TriRLC 的执行面必须运行在 git worktree 中，与研发主仓隔离：

- **本地**：TriRLC daemon cwd = `D:\Code\ai\TriMetaverse WorkTree`（分支 `project/trimetaverse`，从主仓 dev 创建的 worktree）
- **服务器（heyuan）**：`/srv/fleet/TriMetaverse` 是独立克隆（等效 worktree），不与任何研发 checkout 共享

**Why:** R 面自治 agent 直接修改文件——如果在研发主仓操作会污染开发代码。Worktree 隔离保证 R 面产出走独立分支，通过 merge/PR 流入主线。

**How to apply:**
- 本地 TriLC daemon 配置 cwd 指向 WorkTree 目录
- 服务器部署用独立克隆（非研发 checkout）
- R 面产出推送到 project/trimetaverse 或专用分支，不直接推 dev
