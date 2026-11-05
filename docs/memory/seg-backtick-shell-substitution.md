---
name: seg-backtick-shell-substitution
description: python-replace 落卷段文里禁用 markdown 反引号——bash 双引号层会把反引号对当命令替换吞掉内容
metadata:
  node_type: memory
  type: feedback
  originSessionId: 7184895f-8596-45be-ad7c-c8d9a159fe15
  modified: 2026-11-05T19:52:12.333Z
---

落卷正形（python -c "..." 双引号包裹）中，段文里习惯性写的 markdown 行内代码反引号 `` `X` `` 会被 bash 当**命令替换**执行：X 被当作命令跑（赋值形静默成功出空串、路径形报错 No such file），替换结果=空串写进文件——内容静默丢失，commit 照常落，只有 bash stderr 一行可察觉。

**实证**（2026-11-06 03:51，底稿 ㊿+275）：段文两处反引号（TRILC_DATA_DIR 值+TriMetaverse 路径段）双双向内丢空，`66915e71b` 带伤落卷，追加勘正 commit 补回。

**Why:** python -c 段经 shell 双引号转发，反引号在 shell 层先于 python 执行；与 [[nested-pwsh-command-dollar-escape]]（$env 同族）同根=嵌套壳层字符先被外层消费。

**How to apply:** ①落卷段文行内代码一律用「」替代反引号；②写完落卷段若 stderr 出现 bash 行号报错=必有吞段，commit 前先核段文完整；③外层双引号内的 `$(date)` 是有意保留的唯一替换点，其余 `$`/反引号出现即事故。关联 [[chained-command-assert-abort]]。
