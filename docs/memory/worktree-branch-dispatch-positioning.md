---
name: worktree-branch-dispatch-positioning
description: worktree 落卷≠origin/dev 可达——派工/转报引用产出件前必验「commit 所在分支向+push 状态+ls-remote 顶」三对表，跨席引用一律给 dev 在链 commit
metadata:
  node_type: memory
  type: feedback
  originSessionId: 50732373-9235-4fa8-a720-15be03e6c2a0
  modified: 2026-10-17T10:24:00.839Z
---

2026-10-17 18:20 BOD 派工四席评估工单，信中位置断言写「工单正身：…（主仓 dev）」，但两卷实际 commit 在 **wt/board worktree 分支**（cb52ae12f）未推——CTO fetch origin/dev 后 ls-tree 全树零命中，回信对表抓获。概念卷五连 commit 链（55caeb370→cb52ae12f）全在 wt/board，dev 上完全不存在。

**Why**：BOD 治理席常驻 wt/board worktree，产出 commit 自然落 wt/board 分支；但消费面（其他席/门消费面）读的是 origin/dev。「已 commit」≠「消费面可达」——分支向错位=暗卷，比未写更毒，因为它看起来「已落卷在链」。与「硬门签认必落卷直达」（已发≠在链）同族：中间多了一层「分支向」变量。

**How to apply**：
1. 派工/转报/催办引用产出件路径时，三对表后才写位置断言：①commit 所在分支向（`git branch --contains <hash>` 或自知 commit 时分支）②是否已 push（`git push` 后 ls-remote 对表顶 hash）③消费面读的 ref 就是该分支吗（常驻席读 origin/dev，不读 wt/board）。
2. 跨席引用一律给「dev 在链」的 commit/文件；产出件在 worktree 分支而消费面读 dev 时，正形=**surgical 拷贝补落 dev**（从 worktree 拷文件到主仓 dev 工作区+commit+push+ls-remote 对表），不为此碰 wt/board↔dev merge 面（有未解冲突时尤其禁 merge，只拷单文件）。
3. worktree 里 commit 成功的输出只证明「该 worktree 分支收了笔」，不证明 dev 收了——两个是不同 ref。

关联 [[hard-gate-signs-land-in-tree]] [[parallel-window-commit-interference]] [[trimetaverse-dual-pushurl-topology]]。
