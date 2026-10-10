# 栏 B 前置件 · 8713 白名单追加行清单+施工注意（CTO）

- sourceOfTruth: 本件（trees/1011-window-family/cto-window-b-allowlist-append-list-20261010.md）
- syncMode: static
- lastSyncedAt: 2026-10-10T15:02:50+08:00（date 现查原值）
- 实勘依据: `%LOCALAPPDATA%\trimlc-daemon-channel.cmd` L5/L25/L32/L39（15:0x 直读）+TriMLC src/server/app.ts L239-249（12:0x 实勘）

## 一、实勘定谳（12:06 判定的落地版）

- 8713 DATA_DIR=`C:\Users\jedih\AppData\Local\trilc-channel`（cmd L5 显式·store=`trilc-channel\cron.db`）。
- **allowlist 现值 12 条**（cmd L25·逗号分隔精确等值 fail-closed）：
  1. `powershell -NoProfile -ExecutionPolicy Bypass -File D:/Code/ai/TriMetaverse/.fade/trimodel-l2-stub.ps1`
  2. `wscript.exe D:\Code\ai\TriMetaverse\.fade\trimodel-l3-toast.vbs`
  3. `node D:/Code/ai/TriMetaverse/.fade/plane-shift-local-align.mjs`
  4. `node D:/Code/ai/TriMetaverse/.fade/tree-node-patrol.mjs`
  5. `node D:/Code/ai/TriMetaverse/.fade/ledger-watchlist-patrol.mjs`
  6. `node D:/Code/ai/TriMetaverse/scripts/fade/tree-node-patrol.mjs`
  7. `node D:/Code/ai/TriMetaverse/scripts/fade/ledger-watchlist-patrol.mjs`
  8. `node D:/Code/ai/TriMetaverse/scripts/fade/hub-silent-detect.mjs`
  9. `node D:/Code/ai/TriMetaverse/scripts/fade/joint-review-remind.mjs`
  10. `powershell -NoProfile -ExecutionPolicy Bypass -File C:/Users/jedih/AppData/Local/tri-watchdog-n2.ps1`
  11. `node D:/Code/ai/TriMetaverse/scripts/fade/performance-sunday-settle.mjs`
  12. `node D:/Code/ai/TriMetaverse/scripts/fade/bod-tick-runner.mjs`
- **判定：必追加**——栏 B 三件（DEM-004 读数 job/预派 job/活性探针 job）均为新 command 串，与现役 12 条零重合（「复用 hub-silent-detect 形」=复用形态模式非复用同一串，精确等值比对下仍是新串）。

## 二、追加行清单（候选串·窗内脚本名定稿后同步刷新）

| 件 | 追加串（占位名·窗内可改脚本名但**串禁含逗号**） |
| --- | --- |
| DEM-004 读数 job | `node D:/Code/ai/TriMetaverse/scripts/fade/glm-usage-readout.mjs` |
| 预派 job（第五面 #3） | `node D:/Code/ai/TriMetaverse/scripts/fade/window-dispatch-remind.mjs` |
| 活性探针 job | `node D:/Code/ai/TriMetaverse/scripts/fade/liveness-healthz-probe.mjs` |

- 追加形=cmd L25 行尾各加 `,` + 新串（三行合一改一处·逐条追加亦可）。
- **占位名注记**: 脚本落点建议 `scripts/fade/`（与现役 8-12 条同位）；若窗内改用 powershell 形则整串随形态变——**以窗内实落脚本路径为准刷本清单再改 cmd**（串与脚本路径逐字一致是 job POST 命中的前提）。

## 三、施工注意四条（12:06 裁词+今日实勘增量）

1. **cmd 批改行保 CRLF+实跑探针**（cmd-batch-crlf-preservation 条）：改 L25 前测行尾、改后断 CR 数；验证用临时剥启动行 echo 探针，**禁直接 call 生产启动器**。
2. **重启走 TriMLC Daemon schtasks+watchdog 先停**：TriMLC-Watchdog 现态 Ready（保活位）——重启窗内**先 `schtasks /end` watchdog 或确认其拉起间隔**，防优雅停后 watchdog 抢先拉起旧 env 进程（allowlist 不生效假象）。
3. **完工判据=进程内生效验证**（restart-window-completion-criteria 条）：重启后 ①healthz 绿 ②探针 job POST 201+`next_run_at` 值面非空（sqlite 只读 `trilc-channel\cron.db`·F-3 家族性警示）③同值 PATCH 幂等（照 S3 窗 A 区四步形）④**allowlist 生效探针=新串 job 实际触发过**（execution_log 增行——光 POST 过=只验门禁放行，触发过才验执行链）。
4. **旧进程 uptime 矛盾信号禁放过**：重启后 healthz uptime 应重置；若 uptime 延续旧值=旧进程还活着（cmd 改行未生效路径），即停追因。

## 四、窗内值面验证点（store 直读族）

- jobCount 变化（现 10→预期 +2~3）·新 job next_run_at 非空·degraded=false·首滚 execution_log status=ok。
- 读数行 schema v1 合规（CPO 今日交付 @5ceb13e9 五要素全必填·metric_basis 灵魂字段）——首验行照 schema 对表。

——CTO 小狄，清单毕。
