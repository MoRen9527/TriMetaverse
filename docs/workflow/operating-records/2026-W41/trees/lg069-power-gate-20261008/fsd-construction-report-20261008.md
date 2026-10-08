# LG-069 电量双阈值闸·FSD 施工卷

- sourceOfTruth: docs/workflow/operating-records/2026-W41/trees/lg069-power-gate-20261008/fsd-construction-report-20261008.md
- syncMode: snapshot-on-close
- lastSyncedAt: 2026-10-08T00:49:50+08:00
- 树节点: FSD 施工收口件（任务书 54044026）
- 状态: 施工毕·生产部署毕·值面探针闭合——候 STE 七锚转正式验收

## 〇、任务锚

- CEO 令原文（2026-10-07 深夜今夜加道令，BOD 施工令转述时点见其令文存照，本卷不复制估读值）：「本地域daemon挂一个本机电量检测，发现低于30%不让coo新增派单，低于20%本地域全体暂停工作，待接通电源或电量高于20%时，cos通知coo恢复全员工作。」
- BOD 施工令：今晚施工，段窗 ≈2-3h，LG-066 毕后接续。
- CTO 方案卷：c05d4342（判据正身）；N1 认收后施工令下发。

## 一、实现方案与关键代码路径

TriMLC（8713，M 面本地域 daemon）仓库 D:\Code\ai\TriMLC，交付锚 commit `3cc439f`（2026-10-08T00:34:53+08:00，5 文件 +684 行）：

1. `src/power-monitor.ts`（新，~290 行）——纯状态机 `stepPowerGate`（targetGate 比对式：稳态零事件防 60s 告警轰炸；连续 2 采样同区翻态防抖；滞回带 软 30→34 / 硬 20→25；无电池静默禁用、disabled 事件幂等一次/段、电池复活从 none 重评估）+ 检测面 `defaultReadPower`（P/Invoke GetSystemPowerStatus 单行 spawn：PSModulePath 净化、windowsHide、10s 超时、FLAG=128/PCT=255 判无电池）+ `startPowerMonitor`（60s 进程内 setInterval，零 cron store 零白名单面；读失败 streak ≥3 → urgent 告警一次/失效段，读恢复复位可再警）。
2. `src/cron/timer.ts`——硬闸单点挂 `executeJobScheduled` 入口（tick 与补跑两表面全汇）：闸停记 skipped 账面（incrementRun 不 incrementError——degraded 面零污染）、nextRunAt 照常推进（防 0 延迟重臂忙循环）、onJobTrigger 零触发；deps 增 `shouldDispatchNewJobs?: () => boolean`（缺省无闸零行为变化）。
3. `src/cron/service.ts`——deps 透传一线。
4. `src/server/app.ts`——GET `/internal/v1/power` 只读端点（token 门内，稳定 fallback 形态）+ healthz `power` 投影 + start()/stop() 装配（通知出向=sg `/internal/v1/notify`，x-internal-token；未配置/不通=通知降级仅日志闸照跑）。
5. `test/power-gate.test.ts`（新，14 例）——A 族状态机五态注入+滞回+临界抖动 19/21 交替不翻；B 族失效段告警 streak 制；C 族 cron 闸停账面+无闸对照派发。

实现决策三分法自评级：`READY_FOR_REVIEW`。

## 二、自测读数（全量四项）

- 模块单测：14/14 绿（`npx tsx --test test/power-gate.test.ts`）。
- tsc：`npm run check` 零错；`npm run build` 零错（dist 2026-10-08 00:40 刷新，launcher 消费 `dist\index.js`——重启前强制 build 一环在案）。
- 全量回归：647 测，642 过，5 败。基线归因=git stash 干净 HEAD 复跑四败文件同败：auth-gate-rejection（service 名 'trilc'≠'trimlc' 字面漂移，改名时代遗留）/ tui/components / integration/replay-flow / roster-gating-http ×2——**全部既有，零新增回归**（逐族独立验非转抄）。
- 活体检测预验（重启前）：repo 内探针实读本机 `percent=37, acOnline=false`（放电中），P/Invoke 链真通。

## 三、重启窗闭合验证（禁裸杀·优雅停守约）

配方（N2 段2 先例）：watchdog job `cron_muxxy5w7_wbb7`（n2-watchdog-dev）PATCH disable → POST `/shutdown` 200（x-internal-token，token 运行时解析零回显）→ 端口 8713 释放断言 → `schtasks /run "TriMLC Daemon"` 冷启 → healthz 一次绿。

值面探针八项（全闭合）：

| # | 探针 | 读数 |
| --- | --- | --- |
| 1 | GET /internal/v1/power | 全形态 `{"object":"power","percent":30,"acOnline":false,"gate":"none","batteryPresent":true,"readFailures":0,"lastReadAt":"2026-10-07T16:42:20Z"}` |
| 2 | 同值双机制对照 | 独立 P/Invoke（生产 snippet 逐字节 EncodedCommand）`AC=0;FLAG=2;PCT=30` ⇔ 端点三字段逐一对上 |
| 3 | healthz power 投影 | `power:{percent,acOnline,gate,batteryPresent}` 在卷 |
| 4 | 启动日志 | `[trilc:power] power gate monitor started (60s interval, LG-069)` 在 channel.log |
| 5 | 新 boot 证据 | pid=7624，进程 CreationDate=00:42:13 +0800（ExecMainStartTimestamp 判据精神等价） |
| 6 | store 完整 | 8/8 job 存活，enabled 面零 NULL nextRunAt |
| 7 | watchdog 复能 | PATCH enabled:true HTTP 200，nextRunAt 值面非空（F-3 纪律） |
| 8 | 60s tick 推进 | lastReadAt 16:42→16:44Z 两拍推进；percent 30→29 放电自然演进 |

## 四、生产现势与自然置位观测

- 00:44 +0800 本席读数：29% 放电（soft 区第一拍）；CTO 独立复验（其信面自载现查时点 00:46）：`gate:"soft"` 已自然置位——防抖确认窗走满、m-coo 告警链按设计出向。冷启 4 分钟内在真实低电量场景按设计工作=比注入测试更强的验收实证（CTO 评语引述）。
- cron 面：8 job 零 degraded、consecutiveFailures=0，闸停对 degraded 面零污染的设计目标现势成立。

## 五、候决裁定回执（CTO 00:5x 信）

- gate-recover 落点维持方案卷 m-cos（CEO 恢复链=COS 通知 COO 归人）——**照办，未改**。
- targetGate 状态机形态**认**——无需改动。

## 六、如实边界与技术债

1. 手动 runJobNow 人决面不过闸（保留人工通道，CTO 认）。
2. 各席收令自停系会话行为，daemon 不强杀（如实边界，方案卷原文）。
3. 通知隧道（TRIMC_NOTIFY_SG_URL=127.0.0.1:18710→sg）断=通知降级仅日志闸照跑（设计内）。
4. 既有失败族 auth-gate 'trilc'≠'trimlc' 名漂移：非本件引入，随全量归因在案，偿还候独立维护批。

## 七、收口链

- BOD 收讫转验（信面时点 00:45）：全量四项读数齐全+重启窗守约+八探针闭合记格；已转 STE 七锚验收。
- CTO 施工收卷认收（信面时点 00:5x）：活体独立复验+两候决裁定+既有归因四族采信；候 STE 七锚走查毕+本卷落树转正式验收（本卷即落树件）。

## 使用依据

- CEO 令原文（BOD 施工令转述）；BOD 施工令 54044026 任务书；CTO 方案卷 c054342 正身与 00:5x 认收信；TriMLC commit 3cc439f；N2 段2 重启窗配方先例；全量回归读数与 stash 基线归因记录（会话链）。
