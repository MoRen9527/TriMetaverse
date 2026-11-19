# SDE W2-d 候态预勘收口卷（channel.cmd 勘形+cron job 族基线快照+三清断言与备份方案铸面）

- sourceOfTruth: 本卷（W47 树 bod-wake-chain-20261120/sde-w2d-preflight-closeout-20261120.md·W2-d 候态预勘正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=COS W2-d 派工令（2026-11-20 01:42+08·五步拆树卷 cos-w2-wake-endpoint-dispatch-20261120.md）+COS deadline 知会（01:51·09:00 指向全 Plan·W2=A3 在列——候态预勘照走认收）
- 定性: **候态预勘收口·非施工**——重启窗触发条件=m-fsd W2-b 编码毕+白盒绿+m-cto 门禁过（未达成·本席零 daemon 触碰）；本卷=预勘三件读数+施工序与护栏铸面，触发即按 §四 开走。

## §一 · channel.cmd 勘形读数（C:\Users\jedih\AppData\Local\trimlc-daemon-channel.cmd）

| 项 | 读数 | 判 |
|---|---|---|
| 文件身份 | 9392 字节·mtime=2026-11-17 22:48（与 schtasks LastRunTime 同窗·上次冷启写入面零后动） | ✓ |
| 行尾断言 | CR=50 / LF=50 逐行成对——CRLF 完整零混行尾（D-09/cmd 批文件家族断言过） | ✓ |
| 结构 | LG-033 rebuild v3 头注·env 键区（TRILC_PORT=8713/DATA_DIR/CWD/TRIMC_BASE_URL=127.0.0.1:18710 隧道族/token 四键/fade watch 族/allowlist 21 条/PATH guard v2.1）→启动行 `node.exe D:\Code\ai\TriMLC\dist\index.js >> channel.log 2>&1` | ✓ |
| token 面（D-46） | 四 token 键位勘定（TRIMC_INTERNAL_TOKEN/TRIMODEL_API_TOKEN/TRILC_INTERNAL_TOKEN/TRIMC_NOTIFY_SG_TOKEN）——值面全程零回显零落卷（掩码勘形·len-only 读入） | ✓ |
| orphan pad | EOF-append resync pad 在役（2026-11-04 SDE 加·node 行后 WATCH_DIRS 空化+ALLOWLIST 重置两行·防旧偏移续读拉起旧 env daemon）——batch 偏移错位家族防线完好 | ✓ |
| **wake 端点涉改判据** | 端点施工=TriMLC src/ 加路由→npm run build→dist/index.js 更新→**重启即加载·channel.cmd 预期零改动**（鉴权照现役 X-Internal-Token 形族·TRILC_INTERNAL_TOKEN 键已在役零新增需求）——**改动触发判据=W2-a 形定卷引入新 env 键才动 channel.cmd；触发即走 §三 全序** | ✓ |

## §二 · cron job 族基线快照（重启前对照基线·三源一致断言过）

**存储形态实勘（TriMLC≠TriRMC 分野增锚）**：TriMLC cron 存储=SQLite `cron.db`(9.8MB)+WAL(cron.db-wal/-shm)@`%LOCALAPPDATA%\trilc-channel\`+daemon 投影 `cron.db.json`——**无 jobs.json**（TriRMC 形态推定不适用·读形勘误如实记）。

**活体读数三源一致**（01:51-01:54+08 现采）：
- 端点 `GET /internal/v1/cron/jobs`（token 变量读入零回显）→HTTP 200 `{"ok":true,"count":18}`——**job 键族=平铺顶层**（command/lastRunAt/lastRunStatus/nextRunAt/runCount/errorCount）+`state` 字段=简单字符串"idle"（非 TriRMC 嵌套 dict·非 ms 时戳——TriMLC 时戳字段为 ISO 字符串）。
- 文件投影 cron.db.json→list len=18 ✓ 三源一致（端点==投影==healthz）。
- healthz.cron 聚合面→`enabled=true·jobCount=18·degraded=false·consecutiveFailures=0`（聚合键族与 TriRMC 同形——重启后对照四键）。

**18 job 基线表**（enabled 全 True·lastRunStatus 全 ok·零异常基线）：

| # | job | schedule | runCount/errCount | nextRunAt 值面 |
|---|---|---|---|---|
| 1 | trimodel-l2-scan | every 120s | 23912/29 | 17:54Z ✓ |
| 2 | trimodel-l3-remind | every 30min | 1873/13 | 18:00Z ✓ |
| 3 | plane-shift-local-align | cron 周日 23:10+08 | 13/7 | 11-22T15:10Z ✓ |
| 4 | tree-node-patrol | every 60s | 45973/9 | 17:54Z ✓ |
| 5 | ledger-watchlist-patrol | every 5min | 9468/2 | 17:55Z ✓ |
| 6 | hub-silent-detect | cron */15 | 3153/246(累计) | 18:00Z ✓ |
| 7 | joint-review-demand-pool | cron 周日 14:00+08 | 9/0 | 11-22T06:00Z ✓ |
| 8 | n2-watchdog-dev | every 10min | 3869/15 | 18:00Z ✓ |
| 9 | performance-sunday-settle | cron 周日 21:00+08 | 6/0 | 11-22T13:00Z ✓ |
| 10 | bod-tick-30min | cron 7,37 * * | 1297/15 | 18:07Z ✓ |
| 11 | glm-quota-obs | cron 09:30+08 日 | 38/3 | 11-20T01:30Z ✓ |
| 12 | window-dispatch-remind | cron 09/18+08 日 | 70/0 | 11-20T01:00Z ✓ |
| 13 | tri-liveness-l1 | every 5min | 6829/264(累计) | 17:55Z ✓ |
| 14 | echo-pull | every 5min | 5989/3 | 17:55Z ✓ |
| 15 | e1-window-reminder | every 5min | 5644/0 | 17:55Z ✓ |
| 16 | cos-patrol-timer | every 30min | 973/1 | 18:00Z ✓ |
| 17 | fade011-daily-sweep | cron 03:30+08 日(.local 版) | 18/1 | 11-19T19:30Z ✓ |
| 18 | lg099-tri-check | cron */30 | 100/0 | 18:00Z ✓ |

基线断言：①18/18 enabled=True ②lastRunStatus 全 ok ③nextRunAt 全为未来时点值面非 null ④errorCount 系历史累计值（对照时以 lastRunStatus 为末次判据·勿混读）。

## §三 · 快照备份方案+三清前置断言（铸面·施工时序组件）

**快照备份方案（TriMLC 形态修订版）**：
1. 预勘基线（已落）：`cron.db.json.snapshot-20261120T0151+08.json`（本树 sde-w2d-preflight/·10844 字节·01:51 投影时点）——对照基线非恢复源。
2. **停机窗恢复源备份（施工时序内强制步）**：daemon /shutdown→port FREE 确认后（停机=投影冻结+WAL 可一致拷）→拷 `cron.db` + `cron.db-wal` + `cron.db-shm` + `cron.db.json` 四件入同树快照区（活体禁拷 db——WAL 未 checkpoint 拷贝不一致；停机态拷贝=完全一致）。
3. 恢复形：重启后 job 缺失/状态损→停机态把四件备份放回 DATA_DIR→schtasks 冷启→三查断言（§四.7）。
4. **禁抹字段对应**：TriMLC=顶层 `nextRunAt`（ISO 字符串）——任何恢复/校改禁抹此字段（缺它永不调度·TriRMC nextRunAtMs 同族语义）。

**三清前置断言（channel.cmd 若涉改·batch 偏移错位家族正形）**：
- 改面判据（§一）触发时序=①daemon 全停（/shutdown token 门·验监听 pid==pidfile pid）②wrapper 进程三清（schtasks wrapper+残留 cmd 实例清点·port FREE 复断言）③**三清毕才动 channel.cmd**（CRLF 保真改写+写后 CR 字节计数断言+实跑探针）④冷启。
- channel.cmd 零改动路径（预期主形）：跳过 ①-③ 改面段，直接走 §四 重启序——dist 层更新无需触 wrapper。

## §四 · 重启链施工序（触发条件达成后开走·勘修窗纪律全套）

1. 触发条件断言：W2-b 编码毕+白盒绿（W2-c 门禁卷在树）+m-cto 门禁过——三绿缺一即候。
2. dist 完整性查：`D:\Code\ai\TriMLC\dist\index.js` mtime/npm run build 时戳断言（重启前置查 dist 形态纪律）。
3. watchdog：TriMLC-Watchdog schtasks → Disable。
4. 停机：POST /shutdown（X-Internal-Token token 门）→验监听 pid==pidfile pid→port 8713 FREE 断言。
5. 快照四件备份（§三.2）。
6. [若 §一 改面判据触发] wrapper 三清+channel.cmd 改写断言族——零改动路径跳过。
7. 冷启：schtasks TriMLC Daemon → Start → pid/CIM 对表（新 pid 活体+监听 pid==pidfile）。
8. **值面探针完工判据（非 healthz 绿）**：wake 端点真链路探针——正向（带 token POST → 预期形值面）+负向（无 token 拒形/伪 token 拒形）——**探针形候 W2-a 通道形定卷+W2-b 接线面定后与 m-fsd 对齐铸形**。
9. 重启后 cron 三查（TriMLC 映射形）：jobs 端点 count=18 齐+nextRunAt 值面未来时点全量+enabled=True 18/18+healthz.cron 四键（jobCount=18/degraded=false/consecutiveFailures=0/enabled=true）——对 §二 基线表逐值。
10. watchdog Enable→值面探针毕→毕报落本树 W2-d 卷+SendMessage 回 COS。
11. fade011-daily-sweep：**状态面照看勿代办**（CEO 通道·POST /run 亦属手动面）——只核其 nextRunAt/enabled 基线复归，禁手触。

## §五 · 护栏遵守（预勘面）

sg 面零直连 ✓｜禁裸杀（本面零 daemon 触碰）✓｜D-46（token 掩码勘形+变量 len-only 读入·值面零回显零落卷）✓｜D-47（写前 01:54:39+08 现查）✓｜活体禁拷 db（WAL 一致性）✓｜jobs.json 现役件禁直改（本面只读+拷贝快照）✓。

## 使用依据

COS W2-d 派工令（2026-11-20 01:42+08·五步拆树卷）+COS deadline 知会（01:51）；channel.cmd 活体勘形（01:49+08 掩码读）；trilc-channel DATA_DIR 实勘（01:51-01:54+08：cron.db.json 投影扫描+GET jobs 端点+healthz）；TriMLC 勘修窗纪律先例链（trimlc-repair-window-20261011）；batch 偏移错位家族三清正形；daemon 机位矩阵（8713=TriMLC=M 面本地域）。

—— SDE 小布（m-sde·W2-d 候态预勘收口·施工面候触发三绿）·写前现查 2026-11-20T01:54:39+0800（date 现查原值·D-47 正形）
