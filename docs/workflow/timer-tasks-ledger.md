# 定时任务全量台账（正身件）

- sourceOfTruth: 本件（COS 域经营记录·CEO 2026-11-08 17:42 全批令 COS 域①立项·圆桌呈批件 8344f0667 §六候裁 8 批准）
- syncMode: live（月度体检窗更新+事件窗随更）
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）

## §一 · 定位与真源

- 本件=公司四 daemon+本机宿主层定时任务的**全量台账正身**：盘点读数、体检机制、drift 告警记录、退役/核销注记统一落此。
- daemon 机位正身=`memory/daemon-plane-locality-matrix.md`（TriRMC=河源 8710 / TriRLC=本机 8711 / TriMMC=sg 8712 / TriMLC=本机 8713·状态叙述先活体现探禁推定）。
- 首轮盘点来源=COS 圆桌产出卷（quad-roundtable-20261108/cos-quad-roundtable-20261108.md @ ebd1aae1f §六+四附表）·CEO 12 项全批令后立本件承接。

## §二 · 首轮全量盘点读数（2026-11-08 16:5x–17:1x 实勘·基准版）

### 2.1 四 daemon 面

| 面 | daemon | jobs | enabled | 通道注 |
|---|---|---|---|---|
| 本机 M-本地域 | TriMLC 8713（uptime 156854s） | 17 | 17/17 | TRILC_INTERNAL_TOKEN 门内 /internal/v1/cron/jobs 实探·全名单=附录 A |
| sg M-服务域 | TriMMC 8712 | 16 | 候值席 token 门内调取 | 计数实锚；明细=体检批首批施工项 |
| 河源 R-本地域 | TriRMC 8710（healthz ok·mcLedger ok） | 4 | 4/4 | jobs.json 直读=附录 D（id-only 形态现锚·域内态变候 TriRMC 域勘·不阻塞） |
| 本机 R-本地域 | TriRLC 8711 | 候体检批探 | — | 8711 主闸勘正随 CTO 域即刻办（CEO 批令 CTO 域③） |

### 2.2 本机宿主层 schtasks（Tri/bod 系·附录 B 转录）

10 条 Tri/bod 系：BOD-BlackFormatterLeakPatrol（Ready）/ bod-dsh-tunnel（Ready）/ TriHubWatchdog（Ready）/ **TriLiveness-L1（Disabled）** / TriLiveness-L2（Ready）/ TriMLC Daemon（Running）/ TriMLC-Watchdog（Ready）/ **TriModel-Watchdog（Disabled）** / TriRLC Daemon（Ready）/ TriRLC-Watchdog（Ready）。

- **两层分立实证（体检必查）**：TriLiveness-L1 schtasks Disabled vs 8713 job 面 tri-liveness-l1 enabled=True——宿主层与 job 层状态不同步，体检四读数必卡此读数。
- PlatformExperiencesHelper_Metrics / RunPlatformExperienceHelper_Metrics=系统自带噪音·非我司件。

### 2.3 sg 面遗留勘明

- root tmux default 会话残留（9-24 起 pid 1272108）=纯陈旧终端·**退役安全**（BOD 活体探锚勘明）——退役排窗：今晚迁移链毕后窗·退役前活体勘验在途进程（禁裸杀）·候值席面派工。
- sg 8710 陈旧探条随清（d3 随清注）；e15 已退役核销（e15-modern-standby-ruling 树在案）。

## §三 · 定期体检机制（立项·CEO 批令 COS 域②）

1. **月度全盘点 job**（8713 新立 cron·addJob 施工候 CTO 批）：每月首周末拍一次·四 daemon 全探（8711/8712/8710/8713）+schtasks 全扫·对表本件。
2. **健康四读数**：①jobs 计数对账（盘点 vs 本件 §二）②enabled 态逐 job③lastRunStatus④healthz——两层分立必查（schtasks 态 vs job 态双读）。
3. **drift 告警**：盘点读数 vs 本件差集>0→即告 BOD/COS（禁静默漂移）·告警后本件随更并记 §五变更记录。
4. **首批施工项**（体检批启动时）：sg 8712 16 jobs 明细调取（token 门内）+河源 4 jobs 名单复核+8711 面探明。
5. 拍面细节（拍频/通知链）随施工批任务书定谳后回填本节。

## §四 · 归档注记（批令确认项）

- **d3 修复授权面**：维持确认归档——纯发现零修复·修复授权面=BOD/人位令（值席⑤设计边界·CEO 批令确认维持）。
- **在途 run 指针形定谳**：获批（指针形照办）——CAO 产出② FADE 跑后记录规范联动：在途 run 留旧周+新周滚动指针·制度成文面归 CAO 批程（本席会签在卷 §九）。

## 附录 A · 8713 jobs 全名单（17·2026-11-08 17:0x 实探·全 enabled）

cron_muh6shv trimodel-l2-scan ／ cron_muh6vt2 trimodel-l3-remind ／ cron_muk382i plane-shift-local-align（周日 23:10）／ cron_muk3951 tree-node-patrol ／ cron_mumsuxu ledger-watchlist-patrol ／ cron_muo2mj6 hub-silent-detect（*/15）／ cron_muqyqy4 joint-review-demand-pool（周四 14:00）／ cron_muxxy5w n2-watchdog-dev ／ cron_mv0bq1v performance-sunday-settle（周日 21:00）／ cron_mv0bvbz bod-tick-30min（7,37）／ cron_mv3505v glm-quota-obs（09:30）／ cron_mv3506h window-dispatch-remind（9,18 点）／ cron_mv3506j tri-liveness-l1 ／ cron_mv9g96z echo-pull ／ cron_mvbe9tp e1-window-reminder ／ cron_mvbzgj3 cos-patrol-timer ／ cron_mw1rdhy fade011-daily-sweep（03:30）

## 附录 B · 本机 schtasks Tri/bod 系（10 条·同 §2.2）

（表转录见 §2.2·本附录为快速索引位。）

## 附录 C · sg 8712 jobs（16 计数·明细候体检批）

计数实锚 2026-11-08·名单明细=体检批首批施工项落卷后回填本附录。

## 附录 D · 河源 8710 jobs（4·2026-11-08 17:0x jobs.json 直读·id-only 形态）

9c81c7ec-ed76-4489-98c0-81c6601f541b（weekly-plane-shift·正身 job）/ 381a1886-f270-45dd-a216-c3002c873134 / fba9d2c7-9f97-406b-b2be-17ae38e076ac / dbc9229f-be7f-4d57-bcd8-6f042e59a712
（名单明细=上轮实勘在案+体检批复核回填。）

## §五 · 变更记录

- 2026-11-08：立件（CEO 17:42 全批令 COS 域①②）·首轮盘点读数入册（基准版）·体检机制立项·d3 授权面归档+指针形定谳注。
