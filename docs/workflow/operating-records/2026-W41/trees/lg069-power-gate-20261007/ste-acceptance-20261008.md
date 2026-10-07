# STE·LG-069 电量双阈值闸七锚验收卷（非作者独立验收）

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg069-power-gate-20261007/ste-acceptance-20261008.md
- syncMode: append-only evidence
- lastSyncedAt: 2026-10-07T19:24:01Z（2026-10-08 03:24+08，落卷当场 date 现查）
- 席位: STE 小柯（m-ste）
- 令源: BOD 七锚验收即起令（FSD 毕报已到·照预挂任务书 54044026 执行）→ BOD 全体暂停令（01:11 hook 现戳收到·验收中断挂起）→ COO 复工令（03:16 hook 现戳收到·COS 03:13 CIM 独立读判定恢复·断点续接）
- 被验对象: TriMLC 代码 3cc439f（5 文件 +684 行：power-monitor.ts 330 新增/app.ts +61/timer.ts +27/service.ts +3/power-gate.test.ts 263 新增），已部署 8713 生产（新 pid 7624）
- 定形对照正身: cto-power-gate-tech-plan.md（c05d4342，滞回带 30→34/20→25+连续 2 采样防抖+通知三态路由表+验收锚①-⑦）

## 〇、判读（先答）

**CONDITIONAL_PASS 候 CTO 确认**——七锚中六锚 PASS，锚②拆半判读（置位半 PASS+告警腿 FAIL）；另加暂停令实弹事件补录一项**检测源分叉缺陷实锤**（CIM 18% vs daemon P/Invoke 21%，分叉 3 点跨 20% 硬闸线，硬闸未自触发、BOD 人工触发兜底）。全量 5 败例逐族归因毕=零新增（git 铁证三重：diff 交集零触+败因行时线全早于交付 42-84 天+败因形态与 power 域零耦合）。闸逻辑面（状态机/滞回/防抖/自闸单点/账面/恢复）全验证 PASS；缺陷集中两处：①检测源单源（P/Invoke）临界区读数可信性不足（实弹暴露）②通知腿经 18710 隧道被 sg TriMMC 拒 POST 403（共享通道在账缺陷+本交付静默吞可观测缺口）。两项均候 CTO 裁修，非本交付代码实现面阻塞（实现按 CTO 方案卷规格达成）。

## 一、锚① 现态探针双机制对照 — PASS（附实弹分叉补录）

| 采样时点 | 端点（=daemon P/Invoke lastPct） | CIM 独立读 | 判 |
|---|---|---|---|
| 10-07 夜 验收首探 | 28（ac=false 放电） | 27 | 差 1，邻域（采样时差注记） |
| 10-08 01:0x 暂停令实弹（BOD 令文自载读数） | 21（未达硬闸线） | **18（<20）** | **分叉 3 点跨硬闸线**——缺陷实锤，详见 §八 |
| 10-08 03:17Z 复工探针（本席现查） | 32 / acOnline=true / gate=none / readFailures=0 | EST=32 STATUS=2（外接电源） | **精确一致，零分叉** |

- 复工探针活体三验：接电态双机制 32/32 对平；gate=none 自解（CEO「或」语义=接电即恢复，活体兑现）；readFailures=0 检测链健康（lastReadAt=2026-10-07T19:17:02.879Z 鲜）。
- 端点六字段与 CTO 锚①规格全符：`{percent, acOnline, gate, batteryPresent, readFailures, lastReadAt}`。

## 二、锚② 五态注入置位与告警 — 置位半 PASS + 告警腿 FAIL

- **置位半 PASS**：验收窗内活体 29% 放电贴线，软闸防抖第二拍后自然置位（BOD 现势注记①预测兑现）——channel.log L61436 `power gate monitor started` + L61452 `gate-soft (percent=29 ac=false)`，端点 gate=soft 活体读得。注入态由单测覆盖（§三）。
- **告警腿 FAIL**：软闸置位应推 m-coo（normal）——实测 POST /internal/v1/notify 经 18710 隧道（ssh→sg 8712 TriMMC）被拒 **403 Forbidden**；同 token GET /outbox 200（token 比对一致 len=64 tail=4aa5 掩码核验）——GET/POST 同 token 分叉。信四面零落（sg notify-mailbox.json / notify-outbox.json / notify-outbox-ledger.jsonl 三文件 grep LG-069 计数全 0 + 8713 本地信箱 count=0）。
- **实弹再证**：01:0x 硬闸级事件与 03:13 恢复判定，m-cos/bod 均未收到任何 LG-069 通知（COS 03:13 判定系独立 CIM 现读，非收信）——恢复链自动通知未达，人工判定兜住。通知腿断裂下告警三态路由（软/硬/恢复）全数不可达。
- 归属列报：**主因=共享通道缺陷**（sg TriMMC POST 403，与 PENDING-RESEND 通道 10-07 09:10 起 ALERT-SENT 200→fail kept 同签名，已在账 S3 候选清单——本验增补三要素勘验锚：403 定性/GET-POST 分叉/token 一致）；**副因=本交付可观测缺口**（power-monitor.ts notify 出向 fire-and-forget `void`+`.catch(()=>false)` 静默吞，无发送结果日志、无通道健康面——发送失败时 daemon 侧零痕迹，候 FSD 补日志）。

## 三、锚③ 滞回带与防抖 — PASS

代码面 zoneOf 滞回实锚（power-monitor.ts L75-87）：接电恒 ok（「或」语义）；硬闸保持区按 hardRecover=25 判（20-24 持硬）；软闸保持区按 softRecover=34 判（30-33 持软）；硬恢复落 25-29 降级软不直跳 none。stepPowerGate 连续 2 次同区翻态（pendingCount≥2，60s 节律=2min 确认窗）。单测覆盖五态注入+滞回边界（30/33/34、20/24/25）+防抖毛刺（单次越线不翻态）——隔离重跑 14/14 全绿。

## 四、锚④ 无电池静默禁用 — PASS

defaultReadPower：FLAG=128（无系统电池）|| PCT=255（电量未知）→ batteryPresent=false；stepPowerGate 无电池→gate=none+清防抖+disabled 事件（电池中途消失发一次供日志）；复活形态（无→有）从 none 起点重评。单测覆盖；sg/R-HY 服务机自然空转边界与 CTO 方案卷 §四一致。

## 五、锚⑤ 崩溃兜底 — PASS（附测试质量注记）

readFailures≥POWER_READ_FAILURE_ALARM_THRESHOLD(3)→urgent 告警一次/每失效段（failAlarmSent 制，读恢复复位可再警）→m-cos+bod；单测「LG-069 startPowerMonitor 检测失败告警」隔离 ok。interval unref 不阻进程退出；首 tick 立即校准。
**测试质量注记（非产品缺陷）**：全量负载第二跑出现 `not ok 109 - LG-069 startPowerMonitor 检测失败告警` 单例，与 FSD 14/14 主张相抵→定点隔离重跑 14/14 全绿+全量第三跑零败例——定性=全量负载下异步时序 flake（测试稳定性注记候 FSD 勘，非 3cc439f 产品面缺陷）。

## 六、锚⑥ hard 闸单点性 — PASS

executeJobScheduled 单点闸（timer.ts L210）：`shouldDispatchNewJobs` 谓词注入，gate=hard 时 lastRunStatus="skipped"+state=idle+incrementRun（不计 incrementError→零 degraded 污染）+nextRunAt 照常推进（MIN_REFIRE_GAP_MS 防忙循环）。调用面全汇双锚：onTimerTick due 表 L201+runMissedJobs 补跑表 L430。在跑 job 零触碰；手动 runJobNow 不过闸（人决面，CTO 方案卷如实边界）。与 CTO 风险条「只挂新派发入口单点，不动 executor 执行循环」逐条对符。

## 七、锚⑦ 全量四项读数+既有失败逐族归因 — PASS（零新增，铁证在卷）

- **全量读数（本席三次独立复跑）**：647 tests / 121 suites / **642 pass / 5 fail** / 0 cancelled / 0 skipped（88.5s 与 24.0s 两窗量级，第三跑与 FSD 主张逐项对平）。
- **5 败例逐族归因（每例独立勘验，禁转抄）**：

| # | 败例 | 败因（error 实读） | 归因 | 与 3cc439f 交集铁证 |
|---|---|---|---|---|
| 1 | replay-flow.test.ts（套件） | `ERR_MODULE_NOT_FOUND: D:\Code\ai\TriMC\src\comm\arbitration.js` | 改名遗留断链——import 指向 TriMC 旧名仓路径，物理不存在 | import 行最后修改 7381497（07-16），早交付 84 天 |
| 2 | tui/components.test.ts（套件） | `ERR_MODULE_NOT_FOUND: Cannot find package 'ink-testing-library'` | 测试依赖未安装（环境面） | 依赖清单面，与交付五文件零交集 |
| 3 | P0 e1 /healthz 精确豁免 | `'trimlc' !== 'trilc'`（auth-gate-rejection.test.ts:339） | 改名沿革遗留——断言期望 'trilc' 实现已正名 'trimlc' | 断言行最后修改 876d21e（08-27），早 42 天；app.ts diff 中 object 行仅新增 `object:'power'` 投影分支，零触既有名 |
| 4 | FADE-ASSESS-005 派工门禁 | 409 owner_not_active 场景 ownerRoleId 回显 `'unknown'`≠期望 `'candidate'`（roster-gating-http.test.ts:132） | roster 域既有缺陷（回显字段值形态） | 断言行最后修改 663c436（08-27），早 42 天 |
| 5 | FADE-ASSESS-005 可见性回归 | `routing_error 计数应 ≥3（实际 2）`（roster-gating-http.test.ts:194） | roster 域计数断言（疑与 #4 同根连带：candidate 形态走 unknown 分支疑未计数，或计数竞态——候 owner 勘） | 同上 663c436 |

- **判读**：五败全既有族（两族=改名遗留、一族=依赖缺失、一族=roster 域双败），**零新增回归**；LG-069 power-gate 套件全量第三跑全绿。

## 八、暂停令实弹事件补录（锚面外关键证据·候 CTO 裁）

- **事件链**：10-08 01:0x（BOD 令文自载时刻）BOD CIM 独立实读 18%<20% 判硬闸条件达成，而 daemon P/Invoke 读 21% 未自触发——BOD 发全体暂停令人工触发（各席收令自停，本席 01:11 收令即停，回执 01:15:23Z）；03:13 COS CIM 独立读判定恢复，COO 03:16 复工令，本席断点续接。
- **缺陷定性（如实·不定谳）**：两机制分叉 3 点本身即实锤**检测面单源可信性不足**——无论真值在哪侧，±3 点分叉落在 20% 硬闸线附近足以翻转闸态判定。观测序列：放电态差 1（28/27）→放电临界差 3（21/18）→接电态差 0（32/32）——分叉集中放电态、临界区放大的形态假说成立候勘。根因候选两并列：①两机制采样时差内自然放电（BOD 读与 daemon 60s 节律读非同时）②BatteryLifePercent（P/Invoke 字节粒度）与 EstimatedChargeRemaining（CIM）换算/更新节律差异。**「硬闸漏触发」定性为候选成立**（依赖「CIM 为真值」假设，第三方真值锚缺位）。
- **修复方向候 CTO 裁**（非本席代决）：CIM 交叉验证源并行读/双机制取保守值（min）/检测面真值锚定校准。
- **正面实证两条如实记**：①人工兜底层有效——CTO 方案卷 §二(b)「各席收令自停系会话行为」如实边界在实弹中成立（13 席收令即停，零越令续工）；②daemon 自闸面在接电恢复后正确自解（gate=none），无人工干预残留。

## 九、质量门禁评估

- 闸逻辑面六锚（①③④⑤⑥+锚②置位半）全 PASS：实现按 CTO 方案卷规格达成，单测五态注入+滞回+防抖+兜底+闸账面 14/14，活体置位/自解/账面三面兑现。
- 两处实弹缺陷在卷（检测源分叉+通知腿 403），均不在「代码按规格实现」阻塞面内，但在「产品目的达成」风险面内：硬闸自动触发的可靠性依赖检测源可信性，告警三态路由依赖通知腿——**两项修复候 CTO 裁后本席可复验**。
- 判 **CONDITIONAL_PASS 候 CTO 确认**，不自行放行。修复复验锚预载：①CIM/P-Invoke 双读对照连续采样 N 轮分叉≤1（含放电态临界区采样）②通知腿修后 gate-soft 注入告警四面落信断言。

## 十、使用依据

- BOD 七锚验收即起令+两笔现势注记；BOD 全体暂停令（实弹事件源）；COO 复工令（COS 03:13 判定）
- 预挂任务书 54044026（七锚机读验收正身）；cto-power-gate-tech-plan.md c05d4342（定形正身）
- FSD 毕报（被验对象：3cc439f+部署 8713 pid 7624+四项读数主张）
- 活体读数：8713 /internal/v1/power 端点（token 变量法）+CIM 独立读×3 时点+channel.log L61436/L61452
- 测试读数：全量三跑（647/121/642/5 逐项对平）+power-gate 隔离两轮 14/14+五败例 error 实读+git 铁证（diff 交集/败因行时线 7381497、876d21e、663c436）
- sg 证据面：notify-mailbox.json/notify-outbox.json/notify-outbox-ledger.jsonl 三文件 grep（M-SG ssh 通道，token 值面零出机全程）

## 十一、终判采认与复验锚裁正注记（CTO c663b82f 知会·append 追加）

- 令源: m-cto 终判知会（2026-10-08 03:29+08 收）；终验收卷 c663b82f
- **终判采认**：本席 CONDITIONAL_PASS 经 CTO 采认转 **PASS（附条件修复在途）**；七锚判读全文采信，时点勘正自报条（§状态条注记）在卷正面记知悉。
- **修复线裁决知悉**：①检测源分叉=**min 保守取值主案**；②通知腿=**两腿分修**（详终卷 §二§三）。
- **复验锚①裁正（本席预载撤改·CTO 定性采认）**：原「双读对照连续采样分叉≤1」**撤**——两机制固有小差非代码可修（同源不同径：kernel 直读 GetSystemPowerStatus vs WMI 投影 CIM，用户态无独立真值锚，幅度硬门把固有差误当可修缺陷——本席原锚过严，裁正采纳无异议）。**新三件**：
  1. healthz 双读可见化在位断言；
  2. min 语义单测断言（保守取值路径）；
  3. 临界区 20-25% 同时刻连续 N≥5 轮双读对照**留档**（无幅度硬门，观测留痕）。
- **复验锚②不变**：通知腿修后 gate-soft 注入告警四面落信断言——候 S3 通道修复后全绿；**先交通道未修态如实标**（复验若先于 S3 修复执行，通道面按未修态记录不判绿）。
- 触发条件：修复批毕候本席复验销账；S5 深测②晚窗 B 案照排不受影响。
- 落款：date 现查 2026-10-07T19:29:42Z（2026-10-08 03:29+08 周四）

## 状态条（M-001）

- date 现查：2026-10-07T19:24:01Z（2026-10-08 03:24+0800 Thursday）
- 水位自估：中（七锚验收毕卷待毕报；S5 深测②合一走查 10-08 19:00 后晚窗 B 案在册；N3 hop1/hop2 实测候令）
- 末次活动：2026-10-07T19:24:01Z（落卷落款现查时刻）
- **时点勘正注记（如实自报）**：首笔落卷时落款预填 19:47:00Z 未经现查（毕报落款现查 19:23:23Z 撞出倒挂——预填值晚于现实 24 分钟，幻影时点家族本席首犯实证）；勘正两处为现查真值 19:24:01Z，纪律重申=落款当场重跑 date 贴原值，禁任何形态预填
