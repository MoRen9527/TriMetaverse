# CTO 施工毕报卷 · R1/R2 双 restart 窗（charter-2026-W42-006·8713 摊销两件+8711 站 job 全链闭合）· 2026-10-17

- sourceOfTruth: 本卷（trees/lg087-dsh-sega-20261016/cto-r1r2-restart-window-record-20261017.md）
- syncMode: static（毕报卷·链序 施工席→COO→COS→BOD）
- lastSyncedAt: 2026-10-17T12:56:17+08:00（date 现查写前跑·D-47）
- 令源: COO 12:50 开窗令（BOD 12:50 ②令·lsof 形态 B 钉定即开窗·CEO 12:35 窗位亲裁收敛）·charter-2026-W42-006（8ee3f97c）
- 窗界: 12:51:52 开步→12:56:04 终读——**总窗 4 分 12 秒**（预算 20min 内·回滚锚全程零动用）

## §一 R1 · 8713 restart 六步（12:51:52-12:53:26·94 秒）

| 步 | 时点 | 读数 |
| --- | --- | --- |
| 基线 | 12:51:14 | pid 30340（段2 冷启进程·uptime 31827s）·healthz **无 wake 四字段=旧代码在跑**（生效面待兑现证）·TriMLC Daemon=Running/WD=Ready |
| 窗内前置 | 12:51:3x | 启动链=schtasks→channel cmd→**node dist/index.js**（L39）·dist 产物 mtime=11:14:07（**2a8daa8 后构建**·F 门禁 build 对表毕）·工作区干净（git status 空） |
| 1 WD Disable | 12:51:52 | TriMLC-Watchdog=Disabled ✓ |
| 2 POST /shutdown | 12:52:08 | token 变量读入零回显·200 `{"ok":true,"message":"shutting down"}` ✓ |
| 3 port FREE | 12:52:24 | port 8713 FREE+老 pid 30340 死亡 ✓ |
| 4 schtasks 冷启 | 12:52:34 | 任务态 Running ✓ |
| 5 pid/CIM 对表 | 12:52:58 | **新 pid=10832**（CIM start 12:52:30）·uptime=26s 重置 ✓·mc_link=connected trimc=connected（回绿快于段2 先例 91s） |
| 6 WD Enable | 12:53:26 | WD=Ready·Daemon=Running ✓ |

### R1 完工锚三锚判定（齐=完工）

| 锚 | 读数 | 判定 |
| --- | --- | --- |
| ① build 对表 2a8daa8 | dist/power-monitor.js+dist/server/app.js=11:14:07（commit 后构建）·dev 头=2a8daa8 现查·工作区净 | PASS |
| ② channel.log 启动行 | `daemon started for TABLET-0BGCRCP5-10832`（pid 吻合）+`power gate monitor started (60s interval)`+`cron engine started with 15 jobs`+keepalive engaged 行延续 | PASS |
| ③ healthz wake 四字段值面 | **lastWakeSeenAt=lastHandledWakeAt=03:21:48Z（11:21 本地段）·wakePollFailures=0·lastWakeReport=null**——首拍基线吸收设计在活体正常工作：吸收今晨历史段零误报·四字段全部上值面 | PASS |
| ④ recentWake 心跳首现 | 候自然睡眠段（≥5min）·不计窗长（12:29 澄清口径·黄金段宿主活跃可能无段） | 候自然窗 |

- 终读（12:56:04）：uptime=213s 稳·**wakePollFailures=0**（wevtutil 查询线活体循环稳定）·cron 15 jobs·零异常。

## §二 R2 · 8711 restart 六步+addJob 全链（12:54:12-12:55:44·92 秒）

| 步 | 时点 | 读数 |
| --- | --- | --- |
| 基线+模板 | 12:53:45 | 8711 daemon 活（pid 40364）·WD/Daemon 双 schtasks 就绪；8713 E1-1 现役 job 模板 GET（runCount=107 ok·**command 与 env L13 串一字不差=等值性预验证 PASS**） |
| 1 WD Disable | 12:54:12 | TriRLC-Watchdog=Disabled ✓ |
| 2 POST /shutdown | 12:54:19 | token 变量读入（env 侧 TRILC_INTERNAL_TOKEN·零回显）·200 shutting down ✓ |
| 3 port FREE | 12:54:35 | port 8711 FREE+老 pid 40364 死亡 ✓ |
| 4 schtasks 冷启 | 12:54:48 | **新 pid=26472**（CIM start 12:54:43）✓ |
| 5 healthz | 12:55:01 | uptime=10s 重置 ✓ ok=true |
| 6 WD Enable | 12:55:01 | WD=Ready ✓ |

### R2 addJob+触发实测（冷启后 ALLOWLIST 生效窗）

| 验证点 | 读数 | 判定 |
| --- | --- | --- |
| 前置清点 | 现役 0 jobs·patrol 零重复 | 干净冷启态 ✓ |
| addJob | **HTTP 201**（ok:true·id=cron_mvbxayba_a4sa）——**env L13 ALLOWLIST 键冷启生效面实证**（不等值必 403 fail-closed） | ✓ |
| 三查（F-3） | 201 ✓+**nextRunAt=05:00:00Z** 值面 ✓+**enabled=true** ✓ | ✓ |
| 手动拍 | POST run→`{"ok":true,"ran":true,"reason":"status=ok"}`·runCount=1·lastRunAt=04:55:40Z 吻合·lastStatus=ok | ✓ |
| 空转形态 | 12:55 无窗段·window-reminders/ 零新卷（空转零落卷设计符合·最新卷仍=10-14 会签卷） | ✓ |
| 自然拍 | nextRunAt=05:00Z=13:00 本地首自然拍——候自然验证（runCount 1→2+nextRunAt 推进）·F-3 最后一块 | 候 13:00 |

- job 间隔=everyMs 300000（5min·照 8713 现役镜像）·command=`node D:/Code/ai/TriMetaverse/scripts/ops-local/window-reminder-patrol.mjs`（env L13 原文精确串）。

## §三 窗界判定与移交

- **R1+R2 双段全毕·总窗 4min12s（预算 20min）·回滚锚三层（2a8daa8 revert/env L13 删/cmd 段删）全程零动用·异常零**——本席施工段窗毕 12:56。
- 段B 本体（SDE 河源主力·CTO 门禁）候接续——R1/R2 完工为本体清障。
- **G 件 lsof 形态 B 知悉入卷**：sg 8712 活体 pid 41261 在听非占口——G 卷 §二③形态 B 成立→矛盾下移 TriMMC handler 投递段（收单 200→store 写入之间丢）·sg 值席面二轮勘（不入本窗）。
- 候自然窗两件（不计窗长）：8713 recentWake 心跳首现·8711 13:00 首自然拍。

## §四 使用依据

- COO 12:50 开窗令（BOD 12:50 ②）·CEO 12:35 窗位亲裁·charter-2026-W42-006（8ee3f97c·实操序承载台账 119 笔 876b1ef7）
- 段2 先例卷 cto-segment2-restart-window-record-20261017.md（六步序+锚口径）·cto-e1-construction-20261017.md §三（env L12-13 授权链）
- 本卷全部读数=窗内活体现查（时点逐条标注）

—— CTO 小狄（落款 date 现查原值 2026-10-17 12:56:17 +0800·发毕对表）
