---
name: chained-command-assert-abort
description: 命令链断言失败必须中断整条命令链+验证输出禁 head 截断关键文件行（r6 merge 冲突标记入库事故双教训）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 85f22528-5773-4301-ab5a-59e47b3efda4
  modified: 2026-09-02T20:00:30.577Z
---

2026-09-03 r6 merge 归账事故（dc8bab38 带 conflict marker 入库，未推即 amend 修复）双教训，董事会回执批「随案入档」：

1. **断言失败必须中断整条命令链**：python 校验脚本断言失败（exit≠0）后，同一 Bash 调用里后续独立语句（`git add`/`git commit`）照跑不误——校验失败≠流程停止。
2. **验证输出禁 head 截断关键文件行**：提交前 `git status --short | head -3` 把刚 add 的关键文件行截掉，没看到冲突标记件已入暂存区——验证要看的东西被自己的截断藏掉了。

**Why:** 校验的价值在"失败时挡住后续"，链式命令里校验与动作不连通时校验形同虚设；截断的验证输出=没验证。

**How to apply:** ①校验脚本与依赖其结果的动作必须用 `&&` 连接或合成同一脚本内联（失败即停），禁「校验一行、动作另起一行」的写法；②提交/落盘前的验证输出以目标文件为中心取证（`git diff --cached --stat` 全量+对关键文件 grep 断言），head 只用于浏览不用于门禁；③坏提交未推远端时 amend 修复合法（零外泄前提），已推则新提交修复并如实披露。关联 [[multi-agent-git-index-hygiene]]（提交前三查）。
