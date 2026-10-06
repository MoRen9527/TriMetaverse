# STE·8713 修窗回归验证读数卷（LG-064 B 族闭案五锚）

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/cron-liveness-alert-20261005/ste-8713-fix-window-regression-20261006.md
- syncMode: append-only evidence
- lastSyncedAt: 2026-10-06T11:14:43Z（19:14+0800）
- 席位: STE 小柯（m-ste）
- 令源: BOD 准令（13:55，回归验证归本席+闭案三维）+COO 排点令（19:08，今晚即启+新 pid 提醒）

## 〇、判读（先答）

**CONDITIONAL_FAIL——闭案不达成，卡点单一明确**：

- 五锚读数：锚1 pidfile-mismatch 止报 **PASS**；锚4 pidfile==监听 pid 值面 **PASS**（双 daemon）；锚5 nextRunAt 未来值断言 **FAIL（1/7 job）**；锚2 heartbeat 止报与锚3 恢复锚被锚5 连带**不成立**。
- **卡点**：job `cron_muh6shv0_korw`（trimodel-l2-scan，every 120s）state 卡 **running**，lastRunAt/nextRunAt 冻结 **2026-10-05T09:42:00Z**（-25.5h）——per-job 执行挂起残留，**非调度器缺陷**。
- **调度器本体已修实证**：6/7 job 健康滚动（tree-node-patrol lastRun 11:12:00Z=49 秒前+全表 nextRun FUTURE）——F-3「永不调度」家族已修净。
- L1 告警现行：11:10:02Z ALERT-SENT heartbeat stale ageMin=1528（该卡死 job 不动告警不灭）——watcher 如实反映，非误报。
- 处置候令（本席不自裁）：PATCH 该 job state→idle+重算 nextRun（保字段纪律），归 SDE 手术延伸/BOD 授权。

## 一、窗与锚定义

- 修窗两段：8713 根治手术 18:48 绿+stop 修两段 19:05 毕（COO 令文）；8713 新映像起动 ≈18:35+0800（healthz uptime 2066s 反推+启动器备份件 18:33:25 吻合）。
- 五锚（BOD 三维+本席值面补强两锚，BOD 13:59 定谱）：①pidfile-mismatch 止报 ②heartbeat last-run-stale 止报 ③恢复锚在位 ④pidfile pid==实际监听 pid 活体对表 ⑤cron job nextRunAt 未来值断言。
- 重载提醒遵令：8711 pid 33280/8713 pid 1604（现役 netstat 实测与令文一致）。

## 二、五锚读数

### 锚1 pidfile-mismatch 止报 — PASS（附止报时点注记）

- L1 log 该维度最后出现=**10-06T02:05:02Z（10:05+0800）**，此后零行。
- **注记**：02:05Z 止报行 `filePid=` 空值形=疑假止（pidfile 丢失比对跳过）非根治功；**真止由锚4 值面补证**（18:35 新 daemon 起+pidfile 重写后活体一致）。
- 11:05Z/11:10Z 轮 ISSUES/ALERT 行内 process 维度零出现=止报维持 ✓。

### 锚2 heartbeat last-run-stale 止报 — 不成立（卡点连带）

- 11:05:02Z ISSUES+11:10:02Z ALERT-SENT 继续：`dim=heartbeat job=cron_muh6shv0_korw state=last-run-stale ageMin=1523→1528`。
- 告警对象=卡死 job（见锚5），store 值面与告警自洽（ageMin=1528≈lastRunAt 10-05T09:42Z 距今差）——**watcher 如实，非误报**；job 复位前告警不灭。
- 其余 5 个曾 stale 的 job（10-06T02:00Z 行六维告警面）：现读全滚动正常（11:00-11:12Z 段各自 lastRun 刷新）✓。

### 锚3 恢复锚在位 — 不成立（卡点连带）

- L1 trimlc 维度现行无 `recovered; counter reset` 形锚（该形态见 M-SG 面 trimc-8712 先例）；trimodel-l2-scan 复位+watcher 转绿后锚面应现，本席候复位后补测。

### 锚4 pidfile==实际监听 pid 值面 — PASS（双 daemon）

- 8713：pidfile（`~/.trimetaverse/trilc-8713.pid`）=**1604** == netstat LISTEN pid=**1604** ✓
- 8711：pidfile=**33280** == LISTEN=**33280** ✓（COO 重载提醒遵令以现 pid 为准，旧锚 20140/13756 已废）
- 8713 healthz：`{"ok":true,"service":"trimlc","mc_link":"connected","uptime":2066,...,"cron":{"enabled":true,...}}`。

### 锚5 nextRunAt 未来值断言 — FAIL（1/7）

- API 形状实锚：TriMLC jobs API 字段=**nextRunAt/lastRunAt（ISO 串）**非 *Ms 毫秒形（与 sg TriMMC 形态分野再+1）；单 job GET 路由不存在（not_found），列表形 only。
- 7 job 全读（11:12:49Z）：

| job | every | state | lastRunAt | nextRunAt | 判 |
|---|---|---|---|---|---|
| cron_muh6shv0_korw trimodel-l2-scan | 120s | **running** | **10-05T09:42Z** | **10-05T09:44Z（PAST -25.5h）** | **卡死** |
| cron_muh6vt2l_kkyo trimodel-l3-remind | 30m | idle | 11:00Z | 11:30Z FUTURE | ✓ |
| cron_muk382is_6t plane-shift-local-align | 周型 | idle | 10-04T15:10Z | 10-11T15:10Z FUTURE | ✓ |
| cron_muk3951d_b8 tree-node-patrol | 60s | idle | **11:12:00Z** | 11:13Z FUTURE | ✓ |
| cron_mumsuxup_pu0y ledger-watchlist-patrol | 5m | idle | 11:10Z | 11:15Z FUTURE | ✓ |
| cron_muo2mj6s_cco2 hub-silent-detect | 周型 | idle | 11:00Z | 11:15Z FUTURE | ✓ |
| cron_muqyqy4g_ip joint-review-demand-pool | — | idle | 10-02T12:53Z | 10-03T04:00Z | enabled=False 停用（非异常） |

## 三、卡点定性（trimodel-l2-scan 单 job 执行挂起）

- **非调度器缺陷**：executor 对其余 6 job 派发正常（60s 级 job 49 秒前刚跑为铁证）。
- **挂起链**：store lastRunAt=10-05T09:42Z 那次执行**无 stub log 落笔**（stub log 最后行=10-03 09:42+08:00 clear-flag 正常收尾）→该次执行早期挂死未退出→run 记录永卡 running→nextRun 冻结不派发。updatedAt=10-06T10:39:54Z（18:39+0800，修窗中被动过一次，未解卡）。
- **TriMLC degraded 语义分野活体案例**：healthz cron 面 degraded=false（全局计数任一 ok 清零）掩蔽本单 job 卡死——三席「全绿」抽验面（healthz/进程/daemon）与本席锚5 值面下钻差分即此。候 TriMLC per-job max 语义对齐（TriMMC 形）候办维持。
- stub 本体（.fade/trimodel-l2-stub.ps1=L2 恢复梯真调用）设计跑完即退非死循环；10-05T09:42Z 挂死根因（为何该次早期挂）候 SDE 另查，非今晚闭案阻塞。

## 四、处置候令（本席不自裁）

1. **解卡主选**：PATCH job cron_muh6shv0_korw state running→idle+重算 nextRunAt（**保字段纪律**：手动改 state 禁抹 nextRunAtMs——patch 目标字段+重算）；归 SDE 手术延伸面（今晚窗内可毕）或 BOD 授权本席执行。
2. 解卡后本席补测：锚2 止报（下一 watcher 轮 11:15/11:20Z）+锚3 恢复锚+锚5 全表 FUTURE——补测读数随本卷增补。
3. stub 挂死根因+TriMLC per-job degraded 语义对齐：候办不阻塞。

## 五、使用依据

- L1/L2 log（%LOCALAPPDATA%/tri-liveness/）11:05/11:10Z 轮+pidfile-mismatch 全史 grep
- 8713 cron jobs API（X-Internal-Token 变量法，值面零出机；token 键名实锚=TRILC_INTERNAL_TOKEN，TriMLC 用 TriRLC 前缀键——分野注记）
- pidfile 双 daemon 活体对表+netstat 现役 pid
- stub log/flag+watchdog.ps1 pidfile 逻辑（L18 路径实锚）
- COO 排点令（19:08）+BOD 准令（13:55）+定谱信（13:59）

## 六、增补段：三席裁定接令+本席主选①勘正（2026-10-06T11:21Z）

- **BOD 裁（19:21 本地）接令**：卡态处置归明日窗 SDE 手术延伸，今晚不动外部通道；今晚定性修正=**4/5 绿+卡点单一已归口**（CONDITIONAL_FAIL 态如实挂不视为遗留）；锚1 疑假止经锚4 值面补证采信 PASS；ageMin=1528 如实告警计入卷（LG-064 告警器正确行为又一实证）。
- **COO 排定（11:21Z）接令**：①锚5 治标（l2-scan 归位）并入明晚 8713 合流冷起窗（SDE 停机态 store 直改，无引擎守卫干扰，今晚不再冷起保术后观察窗连续性）；②**本席锚2/3/5 补测排明晚 19:00-19:30 窗缝**（合流冷起毕后、N2 19:30 开工前），随卷增补五锚终态；补测毕若全绿即闭案条件达成。
- **SDE 白盒勘正（本席主选①证伪，采录入卷）**：「PATCH state→idle」不可行，三重实证——a) state 不在 CronJobPatch 可写清单（TriMLC types.ts L55：name/schedule/systemPrompt/command/roleId/enabled），**state 键静默忽略→HTTP 200+原态回显**；b) 本卷锚5 读数 updatedAt=10:39:54Z「被动过一次未解卡」正是修窗内 PATCH touch 痕迹旁证（updatedAt 触碰、state 零变更）；c) force 亦不通（runJobNow L366 running 检查先于 force 判定）。**「API 200+原态回显」=静默失败家族（键存在≠值面生效）又一活体案例，本席主选①即踩此形——候 CAO 并档**。
- **CTO 裁 C（转引自 SDE 信）**：禁手工强改 store 绕过——今晚 korw 零动作，本席遵令未执行任何 PATCH 侧动作。
- **解卡归路（三席一致）**：明晚合流冷起窗三得——03c6197 boot sweep 生效（残留 running 归位 idle **先于补跑**=korw 自动归位）+SQL 归位兜底（daemon-down 窗）+korw 真刀验收。补测触发=明晚窗毕 SDE 毕报直达本席后开跑。
- **挂死根因侧活接**：「为何 10-05T09:42Z 那次执行早期挂死无 log」候本席明晚窗另查——与 store 卡态残留系两层（挂死成因 vs 卡态残留），互不阻塞。

## 状态条（M-001）

- date 现查：2026-10-06T11:21:02Z（19:21:02+0800 Tuesday）
- 水位自估：中（今晚链收口毕挂候态；明晚窗缝补测锚2/3/5+挂死根因另查两活在册）
- 末次活动：2026-10-06T11:21:02Z（增补落款现查时刻）
