# Opentride 目录清理收尾记录

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/archive/opentride-cleanup-closeout-2026-04-09.md
- syncMode: audit-record
- lastSyncedAt: 2026-06-04

## 1. 当前结论

- 新的 `Tride` 工作树已在 `<父目录>\Tride` 建立并继续作为当前活跃主仓使用。
- `Tride` 工作树的 `origin` 已切换到 `https://github.com/MoRen9527/Tride.git`。
- 旧目录 `<父目录>\Opentride` 已从工作区根路径删除。

## 2. 处理过程摘要

本轮恢复收尾时，旧目录先因为当前会话中的进程句柄被锁定，无法直接重命名或删除。

为避免阻塞收口，处理顺序改为：

1. 先复制出新的 `Tride` 工作树并切好 Git 远端。
2. 将旧 `Opentride` 目录内容清空。
3. 定位锁目录的进程句柄。
4. 释放持锁的 PowerShell 与 VS Code utility 子进程后，删除旧目录空壳。

## 3. 最终状态

- `Test-Path <父目录>\Opentride` 返回 `False`。
- `Test-Path <父目录>\Tride` 返回 `True`。
- 活跃 workspace 与 TriPilot 本地配置已切到 `Tride` 路径。

## 4. 边界说明

- 本次收尾解决的是目录与宿主配置收口，不要求批量重写历史 run / phase 记录中的 `Opentride` 字样。
- `opencode`、`opencode-dev` 仍然保留为上游 runtime / 目录名，不做机械替换。
- 若后续继续做第二轮全仓清理，应只处理活跃配置和当前真源文档中的旧名残留，不动历史审计记录。
