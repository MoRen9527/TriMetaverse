# LG-064 演练收款证据件（三机×三维矩阵+告警账+实证时间线）

- sourceOfTruth: 本件（LG-064 施工交付三件之一：演练证据；判据/阈值真源=liveness-rules-20261005.md）
- syncMode: final
- lastSyncedAt: 2026-10-05 11:47:00 +0800（date 现查贴原值 11:46:5xZ 段落）
- 编写席: FSD 小全（m-fsd）；日志正身=本机 `%LOCALAPPDATA%\tri-liveness\{l1,l2}.log`、M-SG `/var/lib/tri-liveness/{l1.log,state-*.log,notify-resp.json}`、R-HY `/var/lib/tri-liveness/state-*.log`

## 一、演练收款矩阵（全绿项打 ✓；本机 degraded 维=设计缺口改记录覆盖）

| 维度 | 本机（dev win） | M-SG | R-HY（A 形） |
| --- | --- | --- | --- |
| process | ✓ 03:16:51 ALERT-SENT 200 `dim=process unit=trimlc-18799 state=no-listener`（-ProbePort 注入 ×2 轮） | ✓ 03:34:08 ALERT-POST 200 `dim=process unit=tri-liveness-drill.service state=inactive` + ntf-muup44srtrcrbs | ✓ 03:25:39 L2 中继 200 `dim=relay host=R-HY …dim=process unit=tri-liveness-drill.service state=inactive`（state 判据 03:25:02 ×2） |
| disabled | ✓ 02:50:18 首条+03:05:23/03:13:28/03:15:04 复发 `dim=disabled task=TriLiveness-Drill-Normal state=missing`（任务缺实 ×2 轮 debounce） | ✓ 03:34:07 ALERT-POST 200 `dim=disabled unit=tri-liveness-drill.service state=disabled`（disable-only 相位） | ✓ 03:38:29 L2 中继 200 `dim=disabled unit=tri-liveness-drill.service state=disabled`（state 判据 03:38:18 ×2） |
| heartbeat | **不可演练（设计缺口）**：TriMLC degraded=全局计数任一 ok 清零，健康分钟级 job 掩蔽单 job 连败（8 连败实验 degraded 恒 false，rules §二.4）；store 精判 stale 面=幻影事件双向实证（02:41 误发→修后零发，窗口数学活体验证） | ✓ 真实 degraded 02:40:02 L2 cf=3→03:10:06 cf=5 报→03:37:38 cf=7 持续报（config-sync-apply 连败，真因 §三）；演练 job e432e54c consErr=3 独立计数佐证 per-job 语义；自检通道 03:25:01/03:28:20 ALERT-POST 200 + ntf-muuowofa66paor | ✓ 03:37:38 L2 中继 200 `dim=heartbeat host=R-HY unit=trirmc-8712 state=degraded consecutiveFailures=4`（演练 job b2ee8d77 `/bin/false` consErr=4，TriRMC per-job max 语义实证） |
| 通道自检（款4） | ✓ 03:38:51 显式探针 HTTP 200 ntf-muupa76l8x3rge（指纹 len=64 head4=4842 tail4=4aa5，值面零出机） | 自检通道同上（notify-resp.json 回执形） | A 形中继链=L2 通道（同左） |

## 二、告警账（施工窗 02:00-03:45Z 全量）

### 2.1 本机 L1（l1.log）
- ALERT-SENT 200 共 **7 条**：02:41:26（**污染**，x7 issues=6 幻影+1 真 drill 项）/02:50:18/02:55:34/03:05:23/03:13:28/03:15:04（清洁 disabled x1）/03:16:51（清洁 process x1）。
- **假阳性合计=1 条**（02:41:26，解析幻影，根因+修复+双宿主复验见 rules §3.2）；任务轮（PS5.1 宿主）零污染。
- 恢复锚：03:15:17 注入面撤→OK all-dims；03:17:07/03:20:04/03:25:03/03:28:55-03:40:03 连续 OK。

### 2.2 本机 L2（l2.log）
- ALERT-SENT 200 共 **6 条**：02:50:18（真实 M-SG degraded cf=4）/03:10:06（真实 cf=5）/03:25:39（drill R-HY process 中继+真实 M-SG）/03:30:03（drill 复发+真实）/03:37:38（drill R-HY heartbeat 中继+真实）/03:38:29（drill R-HY disabled 中继+真实）。
- **假阳性=0**；R-HY 粗判瞬报 1 轮（02:24:36 no-fresh-log-90min，02:27:06 自愈恢复，建窗期观察项非误报定谳——R-HY 日志轮转窗）。

### 2.3 M-SG L1（l1.log ALERT-POST）
- 200 共 **4 条**：03:25:01/03:28:20（真实 degraded）+03:34:07（disabled 相位）/03:34:08（process 相位，ntf-muup44srtrcrbs）。
- state 文件 verdict 行：ok→ALERT-NEEDED（degraded）→+drill 维逐轮，append-only 全程可审计。

### 2.4 R-HY（A 形，state 文件判据行）
- verdict=ok（03:25:01，drill unit 停前 cron 自然轮）→ALERT-NEEDED dim=process ×2（03:25:02）→ok（03:33:18 清场后）→ALERT-NEEDED dim=heartbeat ×2（03:37:23）→ALERT-NEEDED dim=disabled ×2（03:38:18）→ok（03:38:19 清场后）。
- **R-HY 验收锚成立形态=上述 verdict 行经 L2 中继抵达值席（03:25:39/03:37:38/03:38:29 三条 200 回执）**。

## 三、真实异常捕获与升级（非本席修线，已升级事实）

1. **M-SG config-sync-apply（5a8e6eac）连败**：triage=sg 工作树 `docs/workflow/operating-records/2026-W41/task-inventory-20261005.md` 本地未提交改动阻塞 git pull（`error: Your local changes … would be overwritten by merge. Aborting`，exit 1，日志正身 5a8e6eac__2026-10-05T03-17-24-131Z.log）。degraded 起点回溯=02:35Z 前后（02:40:02 L2 首见 cf=3）。**修复域=COS（运营记录/config-sync 面）**；值席已收持续真实告警（设计行为：持续异常每 ~2 轮重发）。
2. **TriMLC degraded 全局计数掩蔽**（8 连败实验，degraded 恒 false，健康 job 每 分钟 清零）——判据设计缺口，rules §二.4 登记候 CTO（TriMLC 源码形态，本窗禁修）。
3. **TRILC_CRON_COMMAND_ALLOWLIST 2 条死路径**（.fade/tree-node-patrol.mjs、.fade/ledger-watchlist-patrol.mjs）——卫生项 rules §六.6。
4. allowlist 门禁正向验证：POST 死路径 command 过门=exact-match 命中在册（P0-3 门工作正常）；任何新令 403 拦截（本窗未实测 403 形，语义由源码 cronCommandHttpAllowed 静读+在册条目实证）。

## 四、24h 零假阳性窗

- **窗起点：2026-10-05T03:45Z（施工收口：三维矩阵收款毕+注入面全撤+演练 job 全删+文档落卷）**。
- 窗内已知将 legitimately 触发的真实信号：M-SG degraded（config-sync 未修期间持续）；R-HY relay 残行 ~03:48Z 前自然滚出 tail-3 窗。
- 判失败标准：任何**非真实异常**的告警出闸（幻影 stale/unreachable 误定性/解析类假读数）。真实异常告警不计假阳性。

## 五、施工终态清单

- 本机：TriLiveness-L1（5min）/TriLiveness-L2（10min）计划任务现役跑绿（D-29 wscript 无窗形）；extra-tasks.list 已删；演练任务已删；演练 job 已删（含 alert-drill-hb LLM 形，成本记账 rules §六.7）；l1-pending/l2-pending 空。
- M-SG：/etc/cron.d/tri-liveness 现役；tri-heartbeat-check.py+tri-liveness-l1-msg.sh 落 /usr/local/sbin；extra-units.list+drill unit+演练 job 全撤。
- R-HY：/etc/cron.d/tri-liveness 现役；tri-liveness-l1-rhy.sh 落 /usr/local/sbin；A 形 state 文件滚动中；extra-units.list+drill unit+演练 job 全撤。
- 解析修复：tri-liveness-l1.ps1 双宿主安全形已部署（'o' 回环+Invariant+AssumeUniversal）。
