# COO 窗志 · LG-065 今晚窗（提前开窗·五段串行·滚动记录）

- sourceOfTruth: 本件（trees/lg065-duty-seat-bc-20261006/coo-window-log-20261007.md）
- syncMode: rolling（窗程事件即刷即 commit）
- lastSyncedAt: 2026-10-07 17:20 +0800（date 现查 09:19:59Z；首刷）
- 编排席: COO 小营（GO 门两候：≤18:10 段2 验收绿判读+≤18:45 N2 GO）
- 窗令源: CEO 16:49:29 亲令「开」（原 17:50 窗框与提醒段作废；段序不变；断点按实绩重算）

## 断点定版（本席精算·BOD 16:55 认账）

- 段1 admin 提权 16:55-17:10（SDE 执，CEO 在场 UAC）／段2 8713 合流冷起 17:10-18:00（48min 定标承 10-06 实绩）／验收绿判读 ≤18:10／段3 STE 补测 18:10-18:40（五锚单遍）／N2 GO ≤18:45（FSD，双前置=冷起毕+三件套绿）／N2 完工目标 ≤19:45·上界 ≤20:00（过点自动循兜底形报 BOD，宁停不挤）。
- korw 对齐裁（BOD 16:51 补令→本席裁+BOD 认）：korw 真刀=段2 冷起内置工序（S0-S5 daemon-down-gated），非独立活；SDE 自排「korw 窗 18:20-19:00」系同名异标=同段别名，随段前移，零并发冲突。
- 纪律全款照守：走查冻结／R-HY 双 unit 冻结面零触碰／长文分段 commit／时点现查（UTC Z 后缀 +8）。

## M3#9 额度水位首跑（排程前置核查第 9 条首次执行）

- CFO 取数 16:55:07Z（quota 端点直调，key 零回显）：周窗 **75% ≥70% 观测线触发**，报告义务执行（CFO 双达本席+BOD）；5h 窗 11%（重置 19:06:58+08）；剩余 ~675M 点至重置 ~3h49m；晚窗速率可能 2-4×——判定=今晚窗可跑非宽裕。
- 节流注记三席附达（SDE/STE/FSD）：机械段零重试循环／工序最小 sufficient+失败即停／单遍走查读数一次采齐异常单列禁重跑。
- 口径注记：今日暂停线/日线无法判定（10-08 双锚后才有）；CFO raw 行 10-08 起，console 读数 relay 候 CEO 定（CHO 审查件同口径）。

## 段1 GO 刻（SDE 16:57 报·三件全绿）

- ①TaskScheduler watchdog 日志启用 false→true（wevtutil 双读数在卷）；②systemprofile 探针 exists=True；③TriMLC Daemon 注册 REGISTER-OK+四点补验全绿（Status Ready／Task To Run=trimlc-daemon-channel.cmd 正身／Run As User=jedih LeastPrivilege InteractiveToken／At logon）——零 /run 零 StartScheduledTask（anti-run guard 自证），真触发=下个自然 logon（CTO 裁 A 口径）。
- 判读：段1 GO（16:57）；段2 候 17:10，S0 只读基线即刻预采。

## 段2 毕报（SDE 17:13 报·毕 17:12:30·七步全绿 ~2.5min）

- S0-S5 七步全绿：备份锚 20261007T091014Z → watchdog Disabled → build exit 0（仓顶 6f832a1，build 时点 09:10:43Z）→ shutdown 200+pid 1604 退+端口空 → 冷启新 pid 31796（jobCount=7 store 完整带出）→ korw 真刀 → watchdog Enabled（Next 17:17:00 恢复巡检）。
- **korw 根治闭环**（SQL 兜底分支未触发，分支 A 直达）：state=idle＋last_run 09:11:31Z status=ok（boot 补跑成功）＋next_run 恢复滚动。
- 完工判据 PASS：pid 31796 created 17:11:29.742+08 ＞ build 17:10:43（46.7s 差=新 build 消费实证）；healthz 三读全绿。卷=trimlc-8713-surgery-readout-20261007.md @7b12988f（bare 顶核平）；备份保留至观察窗毕。
- S2b 勘差注记：首发 401 即停（锚2 正确触发）——旧 build 带 X-Internal-Token 门而源码现顶 L4275 无门形（版本差行为分叉）；带 token 重发 200 过；token 门随新 build 行为=观察项候录。
- 窗志笔：实绩 ~2.5min vs 定标 48min（定标冗余被备料前置+工序预演吸收；带宽假设差如实录，排期不受影响反超前）。

## 本席判读 · 段2 验收绿 PASS（17:15·双证）

- 双证成立：SDE 卷 7b12988f 读数＋本席独立活体抽验（healthz ok／uptime 219s 与冷启时点吻合／pid 31796 node 活体／127.0.0.1:8713 LISTENING 一致／cron jobCount=7 degraded=false consecutiveFailures=0）。
- 判读窗对照：17:15 判毕 vs ≤18:10 上界——超前 ~55min。

## 三路放行（17:1x）

- **STE**：补测进场前移 17:30（候 SDE 17:24 korw 12min 复读锚先落，锚5 korw 读数以复读后态为准保单遍纪律）；S2b 勘差注记随达（探针带 token 调用，401 不判失败按勘差归因）。
- **SDE**：判读 PASS 认收（活体双证清单回附）+STE 17:30 进场对齐+12min 复读毕补行候；毕补行后即静默勿再触发写面。
- **BOD**：GO 刻报（段1 GO 刻+段2 毕报+双证判读 PASS 17:15+两笔窗志+S2b 注记+STE 前移+N2 GO 估 ≤18:05 守完工 ≤20:00）。

## 候续（滚动）

- SDE 17:24 korw 复读锚毕补行（SDE 面）／STE 17:30 进场五锚单遍（读数两道本席+BOD，毕估 ~18:00）／STE 毕本席判读→N2 GO 放行（双前置已满足候 STE 绿）／FSD N2 完工 ≤20:00／窗毕毕报两刻制。

## 使用依据

- CEO 16:49:29 开窗令（BOD 转达 16:49）／BOD 16:51 korw 对齐补令+16:55 定版认账／CFO 16:55 M3#9 读数／SDE 段1 GO 刻 16:57+段2 毕报 17:13（卷 7b12988f）／本席活体抽验（healthz/tasklist/netstat 三探）／STE 16:54 接令+17:19 回执。
