# 跨仓 git hash 混读教训

> 2026-10-06 FSD 实证（TriModel/TriMetaverse 双仓连作窗）。拓扑断言族延伸：机位断言要活体现探，仓向断言要 pwd+remote 双证。

## 事故形

连作两仓（TriModel 代码修 + TriMetaverse 树单笔）后，在 TriMetaverse 仓跑 push 被拒→fetch→rebase→reflog 考古，把 **TriMetaverse 的并行 docs 链**（12be50c7/30699063 等）误读成「我的 TriModel lint 笔被并行席挤落」——推导出一整套错误结论（「rebase todo 挤出我的笔」「CTO 笔父直连跳过我的」），还差点对 TriModel 做「找回重做」的冗余动作。

## 根因

1. `git log/reflog/show` 的 hash 断言不带仓向——切 cwd 后旧 hash 语境还在脑内，新 cwd 的 git 顺着新仓解析。
2. `git show HEAD:path 2>/dev/null | grep` 静默吞 fatal（bad path），假阴性又叠一层。
3. 「push 拒+rebase+reflog」三连读数全部属于 TriMetaverse，但我当时的**意图对象**是 TriModel 的 lint 笔——意图锚和操作仓错位，读数被意图染色。

## 幸运零损害的原因（非设计，是运气）

TriModel 侧我全程只做了 `git commit`（12caab0），rebase/push 等一切 ref 操作恰好全落在 TriMetaverse——若任一破坏性 ref 操作发生在 TriModel，后果不同。

## 正形

- 跨仓操作后第一步：`pwd` + `git remote -v` 断言仓向，再做任何 hash/reflog 推演。
- hash 在当前仓解析失败（bad revision）= **仓向错的强信号**，立即停推演。
- reflog 考古结论先做内容面验证（`git show <hash>:<file>` 是否真在链），再讲叙事。
- 多席共享仓并行时，reflog 是**全席共享序列**——先分清哪几笔是谁的，再谈「我的笔去哪了」。
