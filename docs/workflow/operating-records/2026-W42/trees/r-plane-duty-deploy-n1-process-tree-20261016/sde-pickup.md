# SDE 拾取卷 · n1 R 面 duty 席位进程树部署（要素①）

- tree-id: 1
- charter: charter-2026-W42-001
- canonical 树名: r-plane-duty-deploy-n1-process-tree-20261016
- 执行席: SDE 小布（m-sde）·施工位=河源 R-HY（ssh root@8.155.54.79）
- 状态: 拆树落卷·候 COO 总调度复核（复核回前不开工）
- 依赖序: n1 首位（②③④前置）

## 节点内容（任务书 §二 序1）

R 面 duty 席位进程树部署，与 M 面 sg 13 席同构对表（/srv/fleet/ 两面同构布局）。

## 施工草案（候复核）

1. 对表勘验：M 面 sg 13 席形态只读参照（tmux 会话名/席位启动形/env 面）——本机侧已有 sg 面知识+BOD 背景读数；河源侧重探已毕（零 tmux 会话·零 claude 进程·/srv/fleet/ 三仓在位·py3.12.3/node v22.23.2）。
2. 启动器脚本落位（/srv/fleet/ 下·含 n4 护栏变量前置——清 CLAUDE_CODE_CHILD_SESSION+置 FORCE_SESSION_PERSISTENCE=1）。
3. tmux 会话树冷启（fleet 用户侧·与 M 面同构）。
4. 活体断言：13 席进程在跑+tmux 会话在册+读数落卷。

## 门禁/毕锚

- 13 席进程树活体在跑+tmux 会话在册；同构对表读数落卷（本树 reports/）。

## 止损

- 进程树 kill 回退·零残留断言（tmux kill-server+pgrep 清点）。

## 护栏引用（任务书 §四 全条适用）

D-24 机位断言/席位复活名址坑启动前清变量（与 n4 联动·启动器即护栏载体）/D-47 落款/活体断言禁推定。
