# PS5.1 Remove-Item 穿透 junction 删真实目标

> 2026-10-03 04:1x STE 复验事故实证（TriModel 仓面+agent-core 源误删，sg bare 克隆恢复）；候 CAO 册打包条。

- **坑**：`Remove-Item -Recurse` 遇 junction/symlink 不停在链接面，穿透递归删除**真实目标**内容（PS5.1 经典行为）。
- **高危场景**：worktree node_modules=junction 指主仓 node_modules，主仓 node_modules 内含仓级符号链接（先例=node_modules/trimodel 系符号链接，GLM 部署点位图）——两层链接链穿透后直达兄弟仓源码面。
- **正形清理**：worktree 用 `git worktree remove <path>`；junction 用 `rmdir`（cmd，只断链不删目标）或 `(Get-Item x).Delete()`；删除前 `Get-Item x | select LinkType,Target` 断言非链接面。
- **删除类操作双断言**：递归删除前先列计划删除面顶层条目逐个验 LinkType——「REPARSE_POINT」出现即改道。
- **事故后纪律**：destructive 操作事故即收窗（含跨席围栏），围栏先于施工；恢复优先级=活体保活（内存存活进程是最后真值，禁重启）> 代码面 git 恢复 > env/dist 候勘窗。
