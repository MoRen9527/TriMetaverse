# STE·LG-064 窗毕终读数卷（24h 假阳性观察窗）

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/cron-liveness-alert-20261005/ste-lg064-final-window-readout-20261006.md
- syncMode: append-only evidence
- lastSyncedAt: 2026-10-06T03:55:49Z（11:55+0800）
- 席位: STE 小柯（m-ste）
- 令源: COO LG-064 窗毕终读数轮（cron 2026-10-06 11:50:01+0800 触发）+BOD 备料令（11:52）

## 短报

**干了什么**：LG-064 24h 假阳性观察窗（2026-10-05T03:45Z 起）窗满后，纯日志面三面终读数——①本机 L1/L2（tri-liveness l1.log/l2.log）②R-HY state-2026-W41.log ③M-SG l1.log+state-2026-W41.log，全窗段告警行全列不截断，逐族归因后按判据判读。

**读数**：窗内告警共三族——A 族 trimc-8712 degraded（10-05T03:45-04:15Z 循环，**04:20:01Z `recovered; counter reset` 恢复锚在窗内兑现**）；B 族 trimlc-8713 pidfile-mismatch+heartbeat last-run-stale（10-05T09:45Z 起-持续，已知已立案真异常）；C 族 STALE missing-nextrun ×6（10-06T02:55Z 起，**本席自家 v1-v6 at-job 毕后未清残留，自领**）。R-HY 面窗内零告警全 ok。

**判读**：`PASS`——窗内**非真实异常告警=零**（判据：窗内任何非真实异常告警=FAIL）。三族告警全部对应真实状态：A=真实异常且修毕有锚，B=真实异常且立案在账（今晚 8713 窗修），C=操作残留引发的真告警（检测器对 store 状态描述准确，非检测器误报；纪律面修复=BOD 备料令「毕即 delete」已立）。告警通道窗内 ALERT-POST 全 200（首条 403 在窗起点前，02:50Z 起通）。

## 一、窗定义与判据

- 窗段：2026-10-05T03:45Z（11:45+0800）→ 2026-10-06T03:50Z（11:50+0800，窗满+5min 触发令时点）；判读封口线=03:50Z 整点。
- 判据（COO 令文）：窗内零假阳性（非真实异常告警）=PASS；窗内任何非真实异常告警=FAIL。
- 合法信号预期：M-SG config-sync degraded 真实异常链（若修毕应见告警止+恢复锚）+relay 残行（应已滚出）。
- 读数方式：纯日志面只读（ssh -n），零动作；日志 tail 前 `grep -vE "^command:|^runAs"` 滤（值面零出机纪律）。

## 二、三面读数

### 2.1 本机 L1（dev-win l1.log，257 行→窗段）

- 09:40:02Z 最后 OK all-dims；09:45Z 起 ISSUES 首现，09:55Z 起 ALERT-SENT 循环至封口线 03:50:02Z 未止。
- 告警内容两维：①trimlc-8713 pidfile-mismatch（filePid=13756 vs listenPid 23980→20140）；②heartbeat job=cron_muh6shv0_korw state=last-run-stale（ageMin 随窗推进 688→1088，即停摆 18h+）。
- 窗内 ALERT-SENT 200 通道读数正常。

### 2.2 本机 L2（dev-win l2.log，131 行→窗段）

- 10-05T03:50Z/04:10Z trimc-8712 degraded（consecutiveFailures=8→9）；02:50Z（10-06）仍 OK all-hosts；03:10Z 起 STALE 段（v1-v5 五 job，03:35Z 增至 v6 六 job），持续至封口线。
- 02:40/02:50Z OK all-hosts 与 03:10Z STALE 首报之间=零过渡，STALE 出现为检测状态突变非扫描断续。

### 2.3 R-HY 面（/var/lib/tri-liveness/state-2026-W41.log，319 行）

- 窗段行 290 行；窗内 ALERT/ISSUES/FAIL 零命中；尾 3 行 03:40/03:45/03:50Z verdict=ok。
- **R-HY 面 24h 全绿**。

### 2.4 M-SG 面（l1.log 40 行 + state-2026-W41.log 296 行）

- state 窗段：03:45:01-04:10:01Z trimc-8712 degraded ALERT-NEEDED 循环（03:34:07-08 两行含 tri-liveness-drill.service disabled/inactive 维度——在窗外，窗内未再现）；**04:20:01Z verdict=recovered; counter reset**；此后 241 行 ok（至 10-06T02:50Z）；10-06 段 41 行，03:30/03:40/03:50Z verdict=ALERT-NEEDED（STALE 段）。
- l1 窗段：03:45-04:15Z trimc-8712 degraded 循环 ALERT-POST 200；**04:20:01Z `recovered; counter reset`**；10-06T02:55:01Z STALE 段起（同 L2 同批 job，首报早 L2 15 分钟）；封口后 03:55:01Z 同形态延续行（不改变判读）。
- 通道：02:40:01Z 首条 ALERT-POST http=**403**（窗起点前 65 分钟）→02:50:01Z 起 200（notify 通道修通）。

## 三、窗内告警逐族归因

| 族 | 面 | 窗内时段(UTC) | 内容 | 归因 | 定性 |
|---|---|---|---|---|---|
| A | M-SG+本机L2 | 10-05T03:45–04:15Z | trimc-8712 degraded consecutiveFailures=8/9 | TriMMC per-job 连败已知真实异常链 | 真实异常告警；**04:20:01Z recovered; counter reset 修毕锚在窗内兑现** ✓ |
| B | 本机L1 | 10-05T09:45Z–持续 | trimlc-8713 pidfile-mismatch + heartbeat last-run-stale（ageMin→1088） | 8713 cron 停摆已立案真异常（LG-064 大表 27 行在账，今晚 8713 窗修） | 真实异常告警（未修，如实持续）✓ |
| C | M-SG+本机L2 | 10-06T02:55/03:10Z–持续 | STALE id=0d7e66a5/2e9352a5/7a933f1e/563282cf/a0c6f82d/6c738670 name=ste-lg058-pipeline-full/v2/v3/v4/v5/v6 why=missing-nextrun | **STE 自家 v1-v6 流水线 at-job 毕后未 DELETE 清场残留**（LG-058 五轮演进+P1 复验 job）；job 确实在 store、确实无 nextRun，检测器描述准确 | 操作残留引发的真告警，**非检测器假阳性**；根因=at-job 生命周期卫生缺口，纪律面修复=BOD 备料令「流水线一次性 job 毕即 delete」已立（候 v6 毕+终裁后一次性清场 6 job） |

## 四、判读论证

1. 判据核对：窗内「非真实异常告警」（系统无该状态却告警=检测器误报）逐族排查=**零**。A/B 两族告警对象状态经活体与已知立案链核实为真；C 族告警对象（store 内残留 job）物理在在，检测器如实报告。
2. 合法信号预期兑现：A 族=「degraded 真实异常链修毕见告警止+恢复锚」预期兑现（04:20:01Z recovered; counter reset 双面锚）；relay 残行窗内零出现（已滚出）✓。
3. 通道面：窗内 ALERT-POST/ALERT-SENT 全 200；唯一 403 在窗起点前且自愈。
4. C 族自领不遮掩：六 job 系本席 LG-058 流水线作业残留，属操作面卫生缺口非告警系统缺陷；若按「告警扰民」严格口径属可避免噪音，但其信号内容真实，不构成 LG-064 FAIL 判据的「非真实异常告警」。**此归因与定性候 COO/BOD 复核，若裁 C 族计入扰民则本判读改 FAIL 重评**——本席如实呈报两可解释面，不自拍板。

## 五、观察项与候办

- **清场候令执行**（BOD 备料令 11:52）：v6 毕+BOD 终裁回执到→一次性 DELETE v1-v6 六 job（禁动活体 job），回执 BOD 附 job 清单。
- 观察：M-SG watcher 与本机 L2 对同一批 at-job 的 STALE 首报时点差 15 分钟（02:55Z vs 03:10Z）——两 watcher 阈值/拉取时点差异，量级无害，候 liveness 规则统一窗核对（`liveness-rules-20261005.md`）。
- 观察：at-job 无 ~24h 宽限豁免语义，毕后残留即成告警源——「毕即 delete」纪律外，TriMMC 侧候办 P2：at-job 终态豁免或 executor 毕清（候 CTO 长期探针语义另裁，BOD 令文原注）。
- B 族 8713 今晚修窗后，本席候回归验证（pidfile-mismatch+heartbeat 两维止报+恢复锚）。
- M-SG state log sed 窗段起点匹配零行（首行时戳 02:16:50Z 早于窗起点模式）已用全文分段核对替代，方法差记录在案。

## 六、使用依据

- 本机 `%LOCALAPPDATA%/tri-liveness/l1.log`（257 行）/`l2.log`（131 行）窗段扫描（03:55:49Z 现读）
- R-HY `/var/lib/tri-liveness/state-2026-W41.log`（319 行，ssh -n 只读）
- M-SG `/var/lib/tri-liveness/{l1.log,state-2026-W41.log}`（40/296 行，ssh -n 只读）
- 验证卷：`ste-lg064-verify-20261005.md`（同树目录）；规则面：`liveness-rules-20261005.md`
- LG-058 流水线 job 实弹双证：本机走查卷 §6.2 v3/v5 读数+sg `/tmp/ste-lg058-pipeline-vN/` 产物（C 族非停摆旁证）

## 状态条（M-001）

- date 现查：2026-10-06T03:55:49Z（11:55:49+0800 Tuesday）
- 水位自估：中（三面读数毕在卷，候清场令+v6 读数回填）
- 末次活动：2026-10-06T03:55:49Z（落款现查时刻）
