# SDE 施工卷 · n1 13 席串行起树毕（12:15-12:23·13/13 全活）

- tree-id: 1（13 席逐席串行起树·charter-002 §二 序1）
- charter: charter-2026-W42-002
- syncMode: static（施工在案卷·单席失败即停红线全程未触发）
- lastSyncedAt: 2026-10-16 12:24:00+08:00（时刻锚见文内 date 读数）
- 执行席: SDE 小布（m-sde）；施工位=河源 R-HY

## 首启异常三连诊断（12:09-12:15·死因两段定谳）

抽验席首启三连失败→诊断 pane 留尸直证（即删·零残留）→死因与 001 竞态**完全不同**：

| 拍 | 形态 | 死因直证 |
| --- | --- | --- |
| ① | 裸 claude 名（manifest 模板原形）·ssh root 起 | **status 127** claude not found——ssh root 非交互会话起的 tmux server env PATH 无 `~/.local/bin`→pane 继承→找不到 claude |
| ② | 绝对路径+pane 内 PATH 前置（belt-and-suspenders 修复形） | server 整体消失·终经 tee 落盘取证直证：**`--dangerously-skip-permissions cannot be used with root/sudo` EXIT=1**——root 身份+skip-permissions 组合被 claude CLI 安全机制拒 |
| ③（正形） | **`su - fleet -c` login 形起 tmux** | fleet（uid 1000）login PATH 首位即 `.local/bin`·fleet 身份过 skip-permissions 门——**r-duty-sde 活体三绿** |

- **定谳**：席位 tmux server 必须以 **fleet 用户身份**起（M 面 fleet 属主同构·socket=/tmp/tmux-1000/default）；root 通道两段死因（PATH 127→身份拒 1）与 001 死因（tmux 并发 new-session pane spawn env 竞态·1cc01687b）互异——本窗单发即死非竞态。
- **假读数家族新向（在案）**：root 身份查 fleet socket 报「no server running」假阴性——root 查 `/tmp/tmux-0/default`（root 位）而 fleet server 在 `/tmp/tmux-1000/default`（fleet 位）——**活体断言必须同 uid 对 socket**；stale root socket 已清（rm /tmp/tmux-0/default）。
- 勘补注：manifest 卷 57cf86b64 启动模板系 M 面活体正形转录（M 面 server=fleet 交互登录起）——R 面 ssh root 通道施工必须套 `su - fleet -c` 外壳+模板其余不变。护栏段（unset CHILD+FORCE PERSIST）不变且活体断言过。

## 串行起树读数（12:15-12:23·红线严守）

- 顺序：r-duty-sde（抽验 12:15:07）→批 1 cto/coo/cos/cao/cpo/cfo（12:16:52-12:19:53）→批 2 cmo/cho/cso/fsd/rdt/ste（12:20:08-12:23:09）。
- 逐席间隔 **30s 整**（脚本 sleep 30）·禁并发 2 红线零违·单席失败即停未触发（13/13 一次通过）。
- 总耗时 12:15:07→12:23:09 = **8min02s**（含抽验断言与诊断窗——纯串行 13 席 6min17s）。

## n1 收口断言（12:23 拍）

| 面 | 读数 | 判 |
| --- | --- | --- |
| tmux 会话 | **session_count=13**（名册 13 席逐一对表齐·fleet socket） | ✓ |
| claude 进程 | **claude_count=13**（pid 抽验 cmdline 正形） | ✓ |
| env 护栏（sde 席断言·计数面） | CHILD_SESSION=0（unset 兑现）·FORCE_PERSISTENCE=1（置位兑现） | ✓ 双绿 |
| 内存 | used 1611MB·available 5659MB（首启 onboarding 屏·席均内存爬坡中·sg 稳态席均 377MB 参照→稳态需求 ~4.9GB 观察项） | ✓ 现态够 |
| proxy | active（13 席 API 面前置活） | ✓ |
| pane 抽查（cto/ste） | Welcome to Claude Code v2.1.296 首屏活 | ✓ |

## 止损现态

- 诊断 pane 全删（diag-path/diag2/diag3·零残留断言过）·/tmp/diag3.log 删·stale root socket 清——**施工面零残留**。
- 回退基线=tmux kill-server（fleet 形）回零会话态。

## 使用依据

- charter-002 §二 序1（串行红线+绝对路径 belt-and-suspenders·本次实锚兑现）+manifest 卷 57cf86b64（名册+模板）
- 拍读数：ssh 远端 date/`pgrep -a`/`tmux list-sessions`/`tr '\0' '\n' /proc/<pid>/environ | grep -c`（计数面·值面零打印 D-46）
