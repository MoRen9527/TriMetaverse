# FSD sgB 修复备码毕报 · 两锚改码+单测两族全绿（备码不部署）

- sourceOfTruth: 本件（trees/sg-duty-trial-20261009/fsd-sgb-fix-code-report-20261009.md）
- syncMode: static（毕报卷·备码段落盘）
- lastSyncedAt: 2026-10-09T10:36:36+08:00（date 现查原值）
- 执行位: FSD 小全（m-fsd·CTO 10:20 派工令·BOD 10:18 批）
- 分支: TriCompany 仓 `fsd-sgb-fix-20261009` @ **1713614**（基线=origin/dev 顶 59610ce）·sg bare 落位验真毕（ls-remote 对表）；GitHub 腿 443 超时未达（候恢复补推·sg bare=sg 面权威不受阻）
- 方案稿: cto-sgb-fix-plan-20261009.md @ffa9c748（本卷为源码级精勘后的施工实锚·差异点见 §三）

## 一、结论

**两锚改码毕+G1 单测四案一次过+G2 三面全绿。READY_FOR_REVIEW·候部署窗（10-11 深夜窗族 sg 段值席面）·本卷只备码零部署。**

## 二、精勘读数（改码前源码级 proof·方案稿三符号两悬空一证伪）

| # | 方案稿符号 | 精勘实锚 | 处置 |
| --- | --- | --- | --- |
| 1 | `maxJobRuntime`（agent-core） | **不存在**（src 全零命中）——agent-core 无 runtime 上限体系 | 阈值落为新 executor 选项 `staleRunningMs`，默认 20min=消费侧 DEFAULT_JOB_TIMEOUT_MS(10min)×2·对齐方案稿 ×2 语义（注释锚明） |
| 2 | `job.timeoutMs`（CronJob 字段） | **不存在**——types.ts CronJob/CronSchedule 零 timeout 概念；timeout 体系全在 TriMMC 消费侧 payload（CommandJobPayload.timeoutMs→runWithTimeout） | 同上收敛为单一阈值选项；消费侧对齐（payload.timeoutMs 族映射）候部署窗集成决策，不属本备码扩面 |
| 3 | `runWithTimeout` 工厂同步 throw | **位于 TriMMC src/cron/command-handler.ts L127**（非 agent-core）·精勘证伪方案稿该点：spawnFn 调用在 Promise executor 内（L135），同步 throw 经 Promise 构造器语言语义**自动转 reject**——现码无此缺陷 | **零改动**·如实记 |

**新证（方案稿未及）**：job-store.ts `loadJobStore` 吞一切读错返空 store（L108-117）→executeJob settle 段存在**第三路径「静默放弃」**：settle re-read 得空 store→`freshJob` 缺失→silent return→磁盘 runningAtMs 残留。该路径同样由锚 1 stale guard 定期回收——**双锚联动=家族缺陷全闭环**（新案 4 实测覆盖）。

**「调度活执行停」家族机理链（源码级）**：①锚 1 面——daemon 崩溃/重启于执行中→runningAtMs 永久非 null→L97 skip 门永久跳过该 job（=TriMMC 10-01/10-02 两形态同签名）；②锚 2 面——settle 段 loadJobStore/saveJobStore 抛→异常逃逸 executeJob→scheduleNext 的 for 循环中断+setTimeout 不再挂=**全 scheduler 死**（unhandled rejection）+该 job 卡 running。

## 三、代码变更（6 文件·+265/-21）

| 文件 | 变更 |
| --- | --- |
| `packages/agent-core/src/scheduler/job-executor.ts` | **锚 1**：scheduleNext 循环 skip 门前置 stale 守卫（`now-runningAtMs > staleRunningMs`→patchJobState 清+saveJobStore 持久化+warn「job id+卡死秒数+schedule resumed」→本 tick 照跑；持久化失败 warn+下 tick 重试不冒进）。**锚 2**：settle 段抽 `settleJob()`（原 L150-168 等价搬移·staggerMs/startedAt 传参保原语义）+executeJob 内 try/catch 兜底（catch=warn+本地 patchJobState 清 runningAtMs·磁盘面归锚 1）。**选项**：`JobExecutorOptions.staleRunningMs`（默认 `DEFAULT_STALE_RUNNING_MS=20min`） |
| `packages/agent-core/src/scheduler/__tests__/job-executor.test.ts` | **G1 四新案**（§四）+既有 5 处 TS18048 断言收紧（updated possibly-undefined→assert.ok+`!`·零语义变化） |
| `packages/agent-core/src/scheduler/__tests__/backoff.test.ts` | 存量 5 处类型错最小修（sync return→Promise.resolve×2+索引断言收紧×3） |
| `packages/agent-core/src/scheduler/__tests__/job-store.test.ts` | 存量 3 处索引断言收紧 |
| `packages/agent-core/tsconfig.tests.json`（新） | extends 主 tsconfig·仅去 `**/*.test.ts` 排除（测试编译进 dist/\*\*/\_\_tests\_\_/·生产 build 零受影响·dist 零测试残留实证） |
| `packages/agent-core/package.json` | scripts 增 `build:tests`+`test:scheduler`（原 test 脚本零动） |

## 四、自测结果（G1+G2 全读数）

**G1 新案四案（node:test·一次过）**：
1. `stale guard: clears a stale running mark and lets the job fire again`——runningAtMs=1s 前/阈值 100ms→断言清（持久化 null）+本 tick 执行 ✓
2. `stale guard: does not touch a fresh running mark`——runningAtMs=50ms/阈值 5s→断言不执行+标记保持 ✓
3. `settle containment: keeps the scheduler alive when settle persist throws`——sabotage 形=jobs.json 换目录（warm cache 进 settle→copyFile 抛）→断言 loop 活+handler 跑过+修复后重 tick 再打（calls≥2）✓
4. `settle containment: keeps the scheduler alive when settle finds the job missing (silent abandon)`——store 中删形→断言 loop 活+恢复后再打 ✓

**G2 三面**：
- agent-core 生产 build：**0 类型错**（clean+rebuild·dist 零测试产物残留）
- agent-core 包级既有全量（npm test）：**55 pass 0 fail**
- agent-core scheduler 全量（test:scheduler）：**69 pass 0 fail**（65 既有含 11 处存量错修复回归+4 新案）
- TriMMC 侧类型错：**现勘 1 处**（onboarding/session-initializer.ts L91·既有在册族）——CTO 信载「既有 2」与本机现勘 1 存在计数差（如实注记·或 sg 面文件态差/其一已修·候对表）；非 onboarding/contracts 错=零·与本改（agent-core+TriMMC 零改动）**零交集**

**测试管线缺口（前置修复·如实）**：scheduler 5 测试文件自 3288e13 迁移带入后**从未被编译执行**（tsconfig exclude test.ts+包 test 脚本只跑手写 .mjs 4 文件）——本卷 tsconfig.tests.json+双脚本修通；非 scheduler 的两测试文件存量错（message-guard 缺 vitest 依赖·process-supervisor 2 处类型错）**如实排除在管线外不掩盖**，候 CTO 裁是否入修窗。

## 五、边界与纪律对照

- 只备码不部署 ✓（生产 TriMMC node_modules 侧 dist 为本机 build 产物·sg 面现役 8710/8712 零触碰）
- CEO TriMMC 口位裁（8710/8712）与本备码无关照跑 ✓（未涉及口位语义）
- 排窗修①②（skip 埋点+空壳检出）：**顺延不并批**——两锚+管线修复已具合理增量（6 文件），①②候部署窗后按 CTO 排窗；已在本卷如实挂账
- 工作区并行笔（TriCompany 仓 scripts/ops+source-agents 三文件 M）零卷入（只 add 本改 6 文件）

## 六、部署窗交接要点（候 sg 值席）

1. 部署=TriCompany 仓拉 `fsd-sgb-fix-20261009` @1713614→`npm run build`（packages/agent-core）→TriMMC 侧 npm install（file: 依赖重链）→重启 TriMMC daemon（窗内照 restart 清单纪律）。
2. 完工判据（进程内生效验证）：制造一次 stale 场景（手写 store runningAtMs=过去 1h）→重启后下 tick warn+job 恢复调度——或以 G1 案 1 同构活体验证。
3. GitHub 腿恢复后补推分支（sg bare 已为权威·fsd-sgb-fix-20261009@1713614）。

## 使用依据

- CTO 派工信（10:20·BOD 10:18 批）+方案稿 cto-sgb-fix-plan-20261009.md @ffa9c748
- TriCompany/packages/agent-core 源码实勘（job-executor.ts/job-store.ts/types.ts/command-handler.ts 精勘链）
- sgB-rootcause-report-20261009.md（家族缺陷根因卷·本卷机理链与其对表）
