# FSD 根治设计小方案 · TriMLC 8713 cronEngine「run 永卡 running 无自愈」

- sourceOfTruth: 本件（FSD 施工侧设计提案，候 CTO 审；架构裁决权归 CTO，本席在既判边界内定形）
- syncMode: draft
- lastSyncedAt: 2026-10-07T02:5xZ（date 现查 10:5x+08；输入=CTO 方案审 cto-n2-scheme-review-20261006.md 加固条件 2+timer.ts/store.ts/types.ts 全文实读）
- 提案席: FSD 小全（m-fsd）；候审席: CTO 小狄；部署窗: 10-08 后首个合法重启窗（窗令避让条款）

## 一、缺陷画像与泄漏路径类（timer.ts 全文实读）

CTO 知情条款正身（本方案根因类以其为准）：「完成链断裂」daemon 级缺陷（spawn error 未处理/boot 补跑洪峰竞态→state=running 泄漏+互斥永不重触发；实证=l2-scan 补跑轮永卡；签名=nextRun 冻结+不自愈）。

施工侧实读补全泄漏路径类（凡命中即运行期永卡，重启前无自愈通道）：

| # | 路径 | 机理（行号=现役 dev） | 现状覆盖 |
| --- | --- | --- | --- |
| P1 | settle 写失败 | `executeJobScheduled` L150 先写 state=running；run 结束后 L161/L168 settle 写（addExecutionLog/updateJobRun）任一抛错且落 catch 后 L209/L210 二次写再抛→异常穿 withLock（finally 释锁）→L112 仅记「timer tick failed」→**行永卡 running，后续 tick L133 过滤永跳** | 零覆盖（boot sweep 只管重启） |
| P2 | 补跑洪峰竞态 | `runMissedJobs` L336-346 启动补跑串行执行候选，洪峰窗内 daemon 再受创（非清理退出）→running 行残留；若 daemon 未死但 executor 半亡（TriMMC executor「调度活执行停」同族）→运行期无人归位 | boot sweep 覆盖「重启后」；「不重启的半亡态」零覆盖 |
| P3 | spawn/agent 链不回落 | `runHeartbeatAgent` 链上异常形态若既不 resolve 也不 reject，race 兜底（executeJobCoreWithTimeout L324）10min 必回 timeout→settle 正常——此路径已被 race 堵死；残余面=agent 内部子进程句柄泄漏（无状态面影响，非本方案 scope） | race 已覆盖状态面 |

核心结论：**状态机层（store 行面）缺一道运行期对账**——boot sweep（store.ts L400，03c6197）只封「重启」一个入口；daemon 长活期间任何 settle 断链即永卡（互斥与 tick 过滤双重封死 API/调度两路复活，PATCH 亦不可写 state——store.ts L397 注记在案）。

## 二、根治设计：运行期 stale-running 对账 sweep（引擎内自愈）

### 2.1 判据（事实为主红线对表）

```
stale ⇔ job.state === 'running'
     AND (now − job.updatedAt) > (DEFAULT_JOB_TIMEOUT_MS + RECLAIM_GRACE_MS)
```

- `updatedAt`=行面突变事实（L150 state=running 写入时 updateJobRun 无条件盖 updated_at=启动时刻；settle 前无第二写）——**lastRun/updated_at 执行事实判读，nextRun 滚动禁入判据**（TriMMC executor 家族红线·CTO 方案审二.2 正身对表）。
- 阈值=job 超时 10min+缓冲 grace 120s：合法 run（race 10min 必 settle）与 sweep 判 stale 零重叠；timeout-run settle 后行已翻 failed/idle 不入判。
- **零 schema 变更**：不新增 run_started_at 列（updatedAt 代理启动时刻的语义边界见 §五候裁点①）。

### 2.2 处置动作（归位+记账+重排三件）

对每个 stale 行（store 层新 helper `reclaimStaleRunningJobs(): number`，形态对齐 boot sweep 同族）：

1. `UPDATE cron_jobs SET state='idle', last_run_status='error', error_count=error_count+1, updated_at=now WHERE state='running' AND updated_at <= ?cutoff`（单 SQL 条件更新=并发安全，cutoff 由 timer 层传入）；
2. `addExecutionLog(jobId, 'error', startedAt=updatedAt, durationMs=null, errorMessage='stale running reclaimed (runtime sweep): exceeded timeout+grace')`——执行账补记（boot sweep 不补账的缺口本方案封住）；
3. 重排 nextRunAt：按 job 自身 schedule 取**下一未来槽位**（parseCronSchedule.nextRunMs，对齐 L197-202 既有形态，Math.max(槽位, now+MIN_REFIRE_GAP)）——**不立即补跑**，断热循环（互备非循环红线对表：every 类 job 下一槽=now+everyMs，cron 类=下一定位点，均>0 延迟）；
4. 内存行逐行刷新（boot sweep L410-415 WAL mtime 守卫同款坑避让，禁 loadAll）+saveCronStore（Maintenance ④ json 备份同步形态）；
5. `console.warn`+`publish({type:'cron:stale_reclaimed', count})` 观察面两件。

### 2.3 挂载点与节拍

`onTimerTick` 锁内最前（L128 withLock 体内、dueJobs 过滤前）调 sweep——零新 timer（armTimer ≤60s 节拍天然驱动；stale 行 nextRunAt 冻结在保使 timer 持续有臂→tick 持续到岗→sweep 持续巡检，闭环成立）；与 tick/enqueueRun 同锁串行=零新增并发面。

### 2.4 降级与回滚参数

- `TRIMLC_CRON_STALE_RECLAIM=0` → sweep 整体禁用（回滚通道，缺省开）；
- `TRIMLC_CRON_RECLAIM_GRACE_MS`（缺省 120000）→ 缓冲窗可调；
- boot sweep 原样保留（重启入口不撤，两层同判据族不同生命周期点）。

### 2.5 degraded 耦合（候裁点③）

reclaim 记 error_count（账面）但**不动** timer 内存 consecutiveFailures/degraded——reclaim 是历史 run 的迟到记账，非当前调度失败；若 CTO 裁耦合（reclaim 即 degraded 信号），一行接入点已在 timer.ts 作用域内，改动面零差。

## 三、边界与不解决面（如实）

| 面 | 本方案是否解决 | 归属 |
| --- | --- | --- |
| 运行期 state=running 永卡（P1/P2 状态面） | ✅ sweep 12min 级自愈 | 本方案 |
| 重启残留 running | ✅ 既有 boot sweep（不撤） | 03c6197 已闭环 |
| withLock 互斥本体永不释放（锁楔死） | ❌ sweep 同锁即同亡 | daemon 级=TriMLC-Watchdog 保活/心跳域（CTO 方案审二.2 兜底链对侧互备承接）；如实划出 |
| timeout 后孤儿 jobPromise 后台续跑 | ❌ 维持现役行为（状态面已 settle，无泄漏） | 现状注记，不动 |
| agent 子进程句柄泄漏（P3 残余） | ❌ 非状态面 | 候办另记不入本窗 |

## 四、写入面清单与测试锚

**写入面**（施工候审后）：`src/cron/store.ts`（+reclaimStaleRunningJobs ~30 行）+`src/cron/timer.ts`（tick 挂载+常量/env 读 ~15 行）+`test/`（行为锚卷）。零 schema 变更、零 API 面变更、零 types.ts 变更。

**测试锚五条**（对齐 2b1709d 行为锚先例）：
1. 人工造 stale 行（state=running+updated_at 回拨 15min）→ tick 后归位 idle+执行账 error 行在+error_count+1+nextRunAt=未来槽位；
2. 合法在跑行（updated_at 新鲜）→ 不误收；
3. timeout-run 正常 settle 后 → sweep 零触碰（无双写竞态）；
4. `TRIMLC_CRON_STALE_RECLAIM=0` → sweep 禁用零行为；
5. 非循环断言：reclaim 同 tick 不补跑（nextRunAt 严格未来）。

## 五、候 CTO 裁三点

1. **updatedAt 代理 vs 专列**：本方案主案=updatedAt 代理（零迁移，语义边界=「settle 前行面无第二写」——API PATCH 改名/排程会刷新 updatedAt 使 sweep 顺延一轮，语义无害但非精确启动时刻）；精确形态=ALTER TABLE ADD COLUMN run_started_at（SQLite 原生秒级，+迁移步）。候裁取形态。
2. **reclaim 补跑取舍**：本方案=归位+重排不补跑（防热循环保守面）；若需补跑语义（l2-scan 类关键 job 丢一轮不可接受），可加「reclaim 后下槽位补跑标记」——复杂度+1，候裁。
3. **degraded 耦合取舍**（§2.5）。

## 六、部署与关系对表

- 部署=**10-08 后首个合法重启窗**（窗令避让条款；本方案零 schema=冷起即生效，无 SQL 迁移步——若候裁点①取专列形态则迁移步随窗）；
- 与 N2 关系=CTO 加固条件 2 原文：「cronEngine 兜底修复与 N2 并行推进，N3 实测前若已修则本机面压力降级」——本方案审毕施工毕即兑现该降级条件；
- 与今晚段③ SQL 归位关系=段③治存量（korw 行），本方案治将病（运行期泄漏类），正交不重叠。
