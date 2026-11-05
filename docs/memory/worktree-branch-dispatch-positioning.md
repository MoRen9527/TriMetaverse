---
name: worktree-branch-dispatch-positioning
description: worktree 落卷≠origin/dev 可达≠主检出可见——四层消费面对表（分支向/push 状态/ls-remote 顶/CEO 阅读位主检出 fetch+merge），跨席引用一律给 dev 在链 commit+落卷后同步主检出
metadata:
  node_type: memory
  type: feedback
  originSessionId: 50732373-9235-4fa8-a720-15be03e6c2a0
  modified: 2026-11-05T19:04:10.410Z
---

2026-10-17 18:20 BOD 派工四席评估工单，信中位置断言写「工单正身：…（主仓 dev）」，但两卷实际 commit 在 **wt/board worktree 分支**（cb52ae12f）未推——CTO fetch origin/dev 后 ls-tree 全树零命中，回信对表抓获。概念卷五连 commit 链（55caeb370→cb52ae12f）全在 wt/board，dev 上完全不存在。

**Why**：BOD 治理席常驻 wt/board worktree，产出 commit 自然落 wt/board 分支；但消费面（其他席/门消费面）读的是 origin/dev。「已 commit」≠「消费面可达」——分支向错位=暗卷，比未写更毒，因为它看起来「已落卷在链」。与「硬门签认必落卷直达」（已发≠在链）同族：中间多了一层「分支向」变量。

**How to apply**：
1. 派工/转报/催办引用产出件路径时，三对表后才写位置断言：①commit 所在分支向（`git branch --contains <hash>` 或自知 commit 时分支）②是否已 push（`git push` 后 ls-remote 对表顶 hash）③消费面读的 ref 就是该分支吗（常驻席读 origin/dev，不读 wt/board）。
2. 跨席引用一律给「dev 在链」的 commit/文件；产出件在 worktree 分支而消费面读 dev 时，正形=**surgical 拷贝补落 dev**（从 worktree 拷文件到主仓 dev 工作区+commit+push+ls-remote 对表），不为此碰 wt/board↔dev merge 面（有未解冲突时尤其禁 merge，只拷单文件）。
3. worktree 里 commit 成功的输出只证明「该 worktree 分支收了笔」，不证明 dev 收了——两个是不同 ref。
4. **push 成功也≠CEO 看得到**（2026-10-23 21:14 CEO 指出）：CEO 阅读位=本地主检出 `D:/Code/ai/TriMetaverse` 工作区，其本地 dev 不自动跟随远端——BOD 在 worktree 落卷 push 后，**须主检出 `fetch sg-server dev && merge --ff`**（先 status 查脏文件，脏文件与 merge 面重叠会自动拒并=安全即停），或报告中明示「阅读位请以 dev 权威位为准」。四层消费面对表：worktree commit → dev 远端 → **主检出工作区** → CEO 眼睛。

**增补（2026-11-06 03:0x 实测·值守形态更新）**：现职 BOD 值守落卷**正形=直落主检出 dev**（append+`git add <exact>`+`git commit -- <exact>` path-scoped·攒批推窗）；wt/board worktree 仅=session 宿座位。**会话压缩后 shell cwd 自动回会话起点（worktree）**——此时裸 `git log` 读到 wt/board 旧态、worktree 同名底稿=旧态分叉雷（本夜实测：worktree HEAD 停 28d4e20ab 而落卷链在 dev）。正形：落卷/查链必显式 `git -C /d/Code/ai/TriMetaverse` 或子壳 `(cd ... && ...)`+文件写用主检出绝对路径；动手前先 `pwd`+`branch --show-current`+`worktree list` 三勘位。

关联 [[hard-gate-signs-land-in-tree]] [[parallel-window-commit-interference]] [[trimetaverse-dual-pushurl-topology]]。
