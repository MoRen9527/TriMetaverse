# CTO · LG-067 活性探针影期首读数卷（窗序提前版·读数窗 08:05-08:2x）

- sourceOfTruth: 本卷（docs/workflow/operating-records/2026-W41/trees/lg067-fsd-report/cto-lg067-first-reading-20261014.md）
- syncMode: work（读数毕·候 BOD 当场裁）
- lastSyncedAt: 2026-10-14T00:14:45Z（date 现查·写前跑）
- 令源链: CEO 08:03:33 令 → BOD 08:04:05 裁准窗序前移 → COS 施工单（施工单-cos-lg067-reading-window-20261014.md@c580133ac）→ 本席执行
- 读数对象: tri-liveness-l1 探针 job（id=cron_mv3506jr_xaz7·every 5min）·影期窗=2026-10-11T01:25Z → 2026-10-14T00:10Z（72h 名义窗）
- 读数源: execution_log（%LOCALAPPDATA%\trilc-channel\cron.db 只读）+ l1.log 判定面（%LOCALAPPDATA%\tri-liveness\l1.log 全量 2373 行）+ channel.log power 面 + healthz 现值 + tri-liveness-l1.ps1 脚本现读

## 一、执行面读数（execution_log）

- **影期 72h 名义拍数 864（12 拍/h × 72h），实跑 526 拍——实跑率 60.9%，缺口 338 拍 ≈ 28h 全部为宿主睡眠冻结挂起段**（夜间睡眠约 7-9h/天 × 3 夜 + 白天短冻结，与 memory 在案睡眠形态吻合）。
- 实跑 526 拍结果分桶：**ok 523 · timeout 2 · error 1 = 执行面 99.4% ok**。
- 异常 4 拍（含 exit=1 1 拍）**全部落睡眠冻结恢复段**，无一落正常日间段：

| 拍（UTC Z） | 形态 | 对应判定面 |
|---|---|---|
| 10-12T16:10Z | timeout dur=9595012ms（2.66h 挂起） | 16:10:21Z ISSUES（job 自身 stale 40min） |
| 10-12T18:55Z | exit=1（恢复首拍·告警级触发） | 18:55:00Z ALERT-DEFERRED（详 §二） |
| 10-13T01:25Z | error dur=219s 空 msg | 01:24:04Z ISSUES→01:25:01Z recovered |
| 10-13T16:56Z | timeout dur=29966445ms（8.3h 挂起） | 17:53:44Z ISSUES（stale 109min） |

## 二、判定面读数（l1.log·三面核心）

影期窗内非 OK 行共 **7 桶**（另 2 行系影期前 10-11T01:14/01:15 试运行段不计入）。全表：

| # | 时点（UTC Z） | 类型 | 内容定性 |
|---|---|---|---|
| 1 | 10-12T01:36:56 | ISSUES debounce 1/2 | L1 job 自身 stale ageMin=521——冻结恢复拍（10-11 夜冻结） |
| 2 | 10-12T04:50:04 | ISSUES debounce 1/2 | 5 job 同 stale 73-85min——午前短冻结恢复拍（北京 12:50） |
| 3 | 10-12T16:10:21 | ISSUES debounce 1/2 | L1 job stale 40min——挂起 2.66h 恢复拍 |
| 4 | 10-12T18:55:00 | **ALERT-DEFERRED**(ssh-token-fail) | 同 job stale 165min——**影期内唯一告警级触发**；debounce 达标→真告警→ssh 拉 token 失败→pending 写入（未送达） |
| 5 | 10-13T01:24:04 | ISSUES debounce 1/2 | L1 job stale 39min——冻结恢复拍 |
| 6 | 10-13T10:00:16 | ISSUES debounce 1/2 | dim=disabled TriMLC-Watchdog Disabled——**预期内操作捕获**（本席 18:00 黄金窗重启链 Disable→Enable·探针如实检出·10:05Z 拍 recovered） |
| 7 | 10-13T17:53:44 | ISSUES debounce 1/2 | L1 job stale 109min——8.3h 挂起恢复拍 |

recovered 6 次，全部与冻结解除/重启完成时点吻合；failcount 现无文件（零挂起）。

### 三面读数定稿

1. **触发率**：告警级触发 1 次 / 526 实跑拍 = **0.19%**（唯一 1 次=挂起恢复拍·未送达形态）；ISSUES 单拍检出 7 桶 = 检出率 1.33%；全部 debounce 1/2 即恢复，零连续 2 拍。
2. **误报率：0%**——7 桶检出逐条回查**全部对应真实偏离**（5 桶睡眠冻结产物 + 1 桶预期内操作 + 1 桶告警级真触发），无一假阳性。#6 操作捕获系判定面敏感度正面实证（勘修窗操作被如实捕获并按时恢复）。
3. **对真活一致性：高**——①execution_log 4 异常拍与 l1.log ISSUES/ALERT 行时点交叉全吻合（4/4）；②18:00 重启链 watchdog Disable/Enable 全程如实映射；③recovered 时点与冻结解除吻合；④现势 healthz 全绿（ok:true·cron 13 job degraded:false·power 八字段全绿·uptime 51136s 连续）+ 探针活体（l1 尾拍 00:10Z OK·l2 旁证面尾拍 00:10Z OK all-hosts）。

## 三、睡眠冻结剔除口径

- 剔除对象：宿主睡眠冻结段的「挂起产物拍」——判据=形态而非时段硬切：执行面 timeout/error/exit≠0 拍 + 恢复后首拍集中 stale（ageMin 远超 window）+ 次拍即 recovered 三特征齐备者。
- 剔除后核心窗读数：触发 0 · ISSUES 检出 1 桶（#6·预期内操作捕获）· 误报 0。
- 注：冻结段拍点不产生（挂起非失败），执行面缺口=名义拍不达，非探针故障。

## 四、duty-cos-silent 两轮直报入统计（并行线·hub-silent-detect）

- 昨日两轮：36min 轮（北京 17:30 触发）+ 66min 轮（18:06 连续升级）——同 transcript 锚 08:53Z 未更新，值席 COS 处 R1 窗预置忙段=**真静默非误报**。
- 定性：「三源 OR」检测 + 连续升级形态符合设计；两轮均经灰度第 1 周三源 OR 豁免域投递。**检出 2/2 真实·误报 0**——与 L1 线并列佐证探针族检出质量。

## 五、power 观察面并读（44a0206 两改生效后）

- **时戳前缀活体验证 ✓**：18:00 重启后新进程段（channel.log L76147 起）power 行 5 行全部带 `[ISO Z]` 前缀——log 时戳改生产生效实锚（L76908-76913）。
- **收敛读数**：重启后至读数时点（10-13T14:30Z → 10-14T00:14Z，约 9.75h ≈ 585 拍）power 失败仅 1 段 4 拍（14:37-14:40Z=北京 22:37-22:40·三连触发 notify+第四拍自愈）——**失败率 0.68%，对照 10-12 贴线 26% timeout 率基线收敛实锚**；14:40Z 后约 9.5h 零失败零告警完全静默。
- 14:37Z 段定性：R1 窗批量重启忙时段+放电态双负载下 PS spawn 超 20s 的瞬态（COO 23:34 核查回执：WMI 交叉一致·readFailures=0 已自愈）——20s timeout 未全治该形态，属既有观察项（瞬态成因勘候勘修窗）。
- 告警链闭环核对：14:39:32Z notify delivered → 本席 22:48（北京）收到 M-SG NOTIFY——送达链走通（值席投递窗 delay ≈ 9min 属常态）。

## 六、链路缺口如实报（2 项·候治理不阻塞读数窗）

1. **pending 重发链静默落空**：10-12T18:55Z 告警写入 pending 后，重发段每拍运行但 ssh 拉 token 失败路径（$tok 空）**零记录零计数**（脚本 L142 `2>$null` + L143-147 无 else 记数分支），pending 残留 38h 无升级。**本窗运维处置**：照 FSD 10-10 先例 MANUAL-CLEAR（归档 stale-pending-archive-20261014/·log 记行 00:14:37Z·subject job 当日已恢复=陈旧告警）。治理候选：$tok 空路径补 pendingfail 计数 + 残留超时（如 24h）自动升级或告警面提示。
2. **睡眠冻结段探针失明**：实跑率 60.9%（挂起 28h）——L1 与被测对象同宿主，冻结时同步冻结；L2 远程探针亦跑在 dev 宿主同冻结。**真跨宿主补位=sg 侧值席信箱链**，属 LG-064 分层设计既有条款；真盲区补位面候下窗评估（不属本探针缺陷）。

## 七、本席评估意见（候 BOD 裁）

**建议：转正（有条件）**。依据：

1. 判定面质量达标：误报 0%（检出真值 7/7）+ 预期内操作捕获正面实证 + execution_log 交叉一致性 4/4；
2. 告警链大半走通：18:55 触发→debounce 达标→判定→pending 入队全程正确，唯 token 拉取通道时段性失败（ssh 通道问题非探针逻辑问题）；且 power 告警链另证端到端送达闭环（14:39 notify→22:48 值席信箱）；
3. 执行面 99.4% ok·异常全为宿主睡眠冻结形态（非探针故障）；
4. 附随 power 面两改收敛实锚（26%→0.68% 失败率），LG-069 勘修段价值同步确认。

转正附带条件（候勘修窗治理，不阻塞）：①pending 重发链盲点补数+残留升级机制；②睡眠冻结盲区的跨宿主补位面评估（LG-064 分层既有线）。

备选理由陈述（若 BOD 倾向继续影期）：完整告警实发（ALERT-SENT 200）影期内 0 次，送达链仅 power 面旁证、L1 线自身未走通一次完整送达——但 18:55 已验证触发-判定-入队半链+失败归因明确为通道层，本席认为不构成继续影期依据。

## 使用依据

- execution_log / cron_jobs：`%LOCALAPPDATA%\trilc-channel\cron.db` node:sqlite 只读实勘（影期窗 10-11T01:25Z→10-14T00:05Z）
- l1.log 判定面：`%LOCALAPPDATA%\tri-liveness\l1.log` 全量 2373 行统计（10-05T02:00Z→10-14T00:14Z）
- l2.log 旁证面：同目录 1001 行（非影期对象·现势 OK all-hosts 注记）
- channel.log power 面：L76147 新进程段起全量（5 行 power·时戳前缀验证）
- healthz 现值快照：00:13:18Z（ok:true·power 全绿·cron degraded:false）
- tri-liveness-l1.ps1 脚本现读（判定逻辑/debounce/alert 链/pending 路径）
- COO 23:34 电源核查回执（瞬态自愈+WMI 交叉）· COS 施工单@c580133ac
