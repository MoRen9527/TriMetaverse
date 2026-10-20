---
name: chained-command-assert-abort
description: 命令链断言失败必须中断整条命令链+验证输出禁 head 截断关键文件行（r6 merge 冲突标记入库事故双教训）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 85f22528-5773-4301-ab5a-59e47b3efda4
  modified: 2026-10-10T03:42:08.276Z
---

2026-09-03 r6 merge 归账事故（dc8bab38 带 conflict marker 入库，未推即 amend 修复）双教训，董事会回执批「随案入档」：

1. **断言失败必须中断整条命令链**：python 校验脚本断言失败（exit≠0）后，同一 Bash 调用里后续独立语句（`git add`/`git commit`）照跑不误——校验失败≠流程停止。
2. **验证输出禁 head 截断关键文件行**：提交前 `git status --short | head -3` 把刚 add 的关键文件行截掉，没看到冲突标记件已入暂存区——验证要看的东西被自己的截断藏掉了。

**Why:** 校验的价值在"失败时挡住后续"，链式命令里校验与动作不连通时校验形同虚设；截断的验证输出=没验证。

**How to apply:** ①校验脚本与依赖其结果的动作必须用 `&&` 连接或合成同一脚本内联（失败即停），禁「校验一行、动作另起一行」的写法；②提交/落盘前的验证输出以目标文件为中心取证（`git diff --cached --stat` 全量+对关键文件 grep 断言），head 只用于浏览不用于门禁；③坏提交未推远端时 amend 修复合法（零外泄前提），已推则新提交修复并如实披露。关联 [[multi-agent-git-index-hygiene]]（提交前三查）。

**git push RC 守卫变体**（2026-10-10 COS 案）：rebase 失败/中断后禁无守卫连推——push 前 RC 检查失败即停，push 无 RC 守卫直推=把中间态推上共享顶（幸他席 merge 笔恰先落未成真，时序运气非设计）。正形=rebase 类高风险操作后，下一动作前先验上一命令 exit code（`&&` 串联或显式 `$?` 断言），非零即停盘点现场；推共享仓前 `git log -1` 确认顶笔归属再推。

## 第 2 例·heredoc 脚本炸后换行连接命令照跑（2026-10-20 20:2x unresolved-items merge 解冲突）

python heredoc 解 merge 冲突中途 ValueError 炸（exit 非零）——后续 `git add && git commit` 用**换行连接**（非 && 守卫）照跑→**带冲突标记的 merge commit 落盘**（c92a99484）。三笔链修复（勘误清标记 5dc77f3b8+补笔回填 FETCH 侧增量 0f7e2cb53）终态正确但多两笔+事故披露成本。正形=**失败会毒化后续状态的操作（add/commit/push）必须 && 链守卫在前命令 RC 上**；heredoc python 长脚本先独立跑成功（PATCH-OK 输出）再单独跑 git 面；带标记文件 grep 断言（`^(<<<<<<<|=======|>>>>>>>)` 计数=0）在 add 前作为独立闸步。整文件 `checkout --ours` 救场会连带抹掉对方非冲突增量——解冲突后必须 diff 对表 FETCH 侧勘丢失面（本案 12 删除偏大即信号）。
