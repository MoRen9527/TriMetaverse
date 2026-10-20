# CTO 施工卷 · P 案巡杀谓词收窄（BOD 02:54:53 裁准·护栏三件随卷）· 2026-10-17

- sourceOfTruth: 本卷（trees/e1-daemon-jobs-window/cto-p-plan-construction-20261017.md）
- syncMode: static（施工读数卷·毕报走 CTO→COO→COS→BOD·03:08/03:38 观察门读数另呈）
- lastSyncedAt: 2026-10-17T03:01:25+08:00（date 现查原值·写前跑·D-47 正形 A）
- 令源: BOD 02:54:53 裁准 P 案（D-39 全域授权·裁毕即生效·COS 02:55:23 流转施工）·护栏三件=①diff 留痕②03:08 轮后效果断言③异常即回滚零门槛
- 定谳卷: cto-e2-trigger-source-verdict-20261017.md（118f94f48·机制与安全性依据）
- 施工面: cleanup-blackformatter-leak.ps1 谓词收窄——只杀 lsp_runner 族、保留 lsp_server（零 IDE 配置触碰·我司自装 schtasks 资产）

## §一 改动内容（护栏① diff 留痕）

谓词两处（targets+remain）同形：

```diff
-$targets = Get-CimInstance Win32_Process -Filter "Name like 'python%'" |
-    Where-Object { $_.CommandLine -match 'black-formatter' }
+$targets = Get-CimInstance Win32_Process -Filter "Name like 'python%'" |
+    Where-Object { $_.CommandLine -match 'black-formatter' -and $_.CommandLine -notmatch 'lsp_server\.py' }
```

（remain 处同形改；头注增 P 案修订行=裁准令源+定谳卷锚+回滚正形一句话）

## §二 两仓落点与真源对齐说明

| 仓/位 | 角色 | 基线→新态 |
| --- | --- | --- |
| `TriMetaverse-worktrees/board`（wt/board 分支） | **执行位**（schtasks `\BOD-BlackFormatterLeakPatrol` 动作经 patrol-launcher.vbs 所指即此件） | fb894f26c（已含 10-15 治理段）→ 本笔 P 案三 hunk |
| `TriMetaverse` dev 主仓（同路径） | **真源位** | c9b5dd5b7（10-09 原版·10-15 治理段未回同步）→ **cp 整件镜像**（字节级=worktree 改后版）·本笔含两段=**10-15 治理段补齐**（wt/board 已载 dev 未同步的历史欠账随本案一并补齐）+**P 案段** |

- 主仓 diff-vs-HEAD 全量 hunks 逐条可归属上两段，无第三方内容混入；会话起点 status 快照本件已示 M（疑行尾规范化态·cp 前 Read 前 15 行对表=旧版原形，实质内容与 HEAD 一致）——如实注记。
- 编码面：执行链=schtasks→wscript→vbs→**pwsh 7**（非 PS5.1）→ps1 无 BOM UTF-8——pwsh 7 中文安全，Edit/cp 不动 BOM 面。

## §三 谓词语义冒烟（只读计数·零杀·03:0x 现查）

| 谓词 | 命中 | 判 |
| --- | --- | --- |
| 旧（`-match 'black-formatter'`） | **54** | =定谳卷 §三 全量（server 2+runner 52） |
| 新（`+ -notmatch 'lsp_server\.py'`） | **52** | runner 族全数保留在杀名单 |
| 差值=排除 | **2** | server shim 41108+真身 38296——**分流正确·server 免杀** |

## §四 03:08 断言基线（护栏② 预置·观察门承诺）

- **基线（03:0x 现查）**：server pid=41108（shim）/38296（真身）·runner=52·python 全量=54·WS 总量 ~1.5GB 量级。
- **03:08 轮后断言读数（改后首轮巡杀）**：①38296/41108 pid 不变（server 永生）②runner 计数显著收敛（52→个位数·活动期上限=2+2×活跃 workspace 且 ≤30min 收走）③无 21 秒复批波（对照 02:38 波形态：版本探测串零重现=Black Formatter.log 无新增 INITIALIZE 段）④稳态值=下一轮 03:38 复验后出结论卷。
- **异常判据与回滚（护栏③）**：server pid 变化/复批波重现/杀名单误伤非 runner 进程——任一即回滚：还原两处谓词（删 `-and $_.CommandLine -notmatch 'lsp_server\.py'` 段）一行×2 处·下轮 30min 生效·零门槛。
- 巡杀任务 XML/launcher 未动（本笔只改 ps1）。

## §五 生效形态

- 下轮 **03:08** 巡杀窗即按新谓词跑（schtasks 每轮新起进程现读脚本·零重启面）；过点未生效则 03:38 轮兜住。
- 稳态预期：低活动期 resident≈2 进程 ~57MB（vs 改前 54 进程 ~1.5GB WS）。

## 使用依据

- BOD 02:54:53 裁准令（COS 02:55:23 流转·护栏三件原文）·charter-2026-W42-005 E2 行
- 定谳卷 cto-e2-trigger-source-verdict-20261017.md（118f94f48·§二源码三证=monitor 清池自愈=本案安全性依据）
- 两仓 git diff（03:0x 现查·本文 §一/§二 全录）·两仓该件提交史（c9b5dd5b7→fb894f26c）
- 谓词冒烟现查读数（54/52/2·本文 §三）

—— CTO 小狄（落款 date 现查原值 2026-10-17 03:01:25 +0800·发毕对表）
