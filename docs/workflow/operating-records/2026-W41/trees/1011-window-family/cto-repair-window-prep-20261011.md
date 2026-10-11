# CTO 勘修窗施工草案 · 窗前预研定稿（14:00-16:00 窗消费件）

- sourceOfTruth: 本件（trees/1011-window-family/cto-repair-window-prep-20261011.md）
- syncMode: static（施工草案·窗开即施工）
- lastSyncedAt: 2026-10-11T02:19:35Z（10:19:35+08·date 现查原值）
- 席位: CTO 小狄（m-cto·主刀）；窗令=BOD 10:13 排窗令（14:00-16:00 硬锚 16:00·拍点避让知情）
- 窗前守约: 零代码写面——本件=读码+基线+草案，代码改动全落窗内

## 一、预研读数（独立路）

### 1.1 注入点与结构（src/index.ts 读毕 192 行）
- 入口 main()：SIGTERM/SIGINT 优雅停（L156-170）+exit 钩子清 pidfile（L175-184）**在位**；顶层 try/catch（L187-192）只捕**启动期** await main() rejection。
- **运行期异步异常零接手实锚**：uncaughtException/unhandledRejection 全 src 零命中（栏 B 勘读段实锚）——运行期任何未捕获异常=node 默认静默 crash（43480 死因「独立崩溃」向源码面成立）。
- 注入点定稿=main() 内 server 起来前后皆可，取 **SIGINT 注册后（L170 后）**插入 installCrashHandlers()——启动早期覆盖面最大。

### 1.2 race 缺口实锚（本席预研新发现·修复包件B 依据）
- `timer.ts L398-413 executeJobCoreWithTimeout`：`Promise.race([jobPromise, timeoutPromise])`——jobPromise 在 timeout 先 settle 后**滞后 reject**→rejection 无人接=unhandledRejection→零 handler→crash。
- 对表 FSD 10-07 自愈方案卷（fsd-cronengine-selfheal-design-20261007.md）：P1 settle 写失败/P2 补跑洪峰/P3 race 兜底三路径——**P3「race 已堵死」判定仅状态面成立，rejection 传播面是方案未覆盖缺口**。方案主体（sweepStaleRunning）已在役；本缺口为增量实锚。
- 43480 死因机制收窄：98s 死窗与「agent 型 job 滞后 rejection→crash」机制自洽（command 型 executeCommand 全 resolve 路径不触发；agent 型 runCronAgent throw 可触发）——不深挖个案，机制面修复+死因可锚双落即闭。

### 1.3 spawn error 嫌疑面勘伪
- executeCommand L379-384 `child.on("error")` → resolve error **在位**——10-06 考古「spawn error 事件未处理」嫌疑点不成立，如实记档。

### 1.4 测试基线（修前 d7693c6 顶·本席独立实跑两遍）
- `npm run check`（tsc --noEmit）=**exit 0 绿**。
- `npm test`=656 例 **651 pass / 5 fail**——五族既有失败（与施工三件零交集）：
  1. test/integration/replay-flow.test.ts（文件级 exit 1）
  2. test/server/auth-gate-rejection.test.ts（P0 通道一二 e1 /healthz 豁免 1 例）
  3. test/server/roster-gating-http.test.ts（FADE-ASSESS-005 派工门禁 ownerRoleId 409）
  4. test/server/roster-gating-http.test.ts（FADE-ASSESS-005 可见性回归）同文件第二例
  5. test/tui/components.test.ts（TUI 组件）
- 窗内验收判据=修后五族**同集合不增不减**+三新件单测绿+check 绿。既有失败归因候另勘不扩窗。

### 1.5 工作区现势
- TriMLC dev 顶 **d7693c6**（LG-069 通知链勘修批④）；未跟踪 scripts/digest-inbox.mjs（非本席面·不动不删·施工 add 走明确路径）。
- node 22.21.1；build=tsc（dist 产物）；测试链=node --test。

## 二、施工三件草案（全部最小面）

### 件A · 崩溃 handler（新文件 src/crash-handler.ts + index.ts 注入一行+import）
- `installCrashHandlers(opts: { dataDir: string })`：
  - uncaughtException / unhandledRejection 双接。
  - 结构化日志 appendFile `%LOCALAPPDATA%\trilc-channel\crash.log`（JSON 行：ts/kind/message/stack·appendFile 失败降级 console.only 防递归）+console.error 双写。
  - 处置=记日志→尝试 app/daemon 优雅停不可得则直退→`process.exit(1)`——watchdog 3 拍 DOWN→revive 链兜底（现有防线，不变）。
  - 回滚通道=`TRIMLC_CRASH_LOG_ONLY=1` 降级仅日志不退出（对齐 TRIMLC_CRON_STALE_RECLAIM 惯例）。
  - 单测：test/crash-handler.test.ts——spy 注入断言 handler 注册+日志行格式（不真 exit：handler 内部回调可注入）。
- 设计裁据：unhandledRejection 也走退出＝把「静默僵活」转「快速崩溃+watchdog 自动恢复+死因可锚」；crash 循环风险由 watchdog fail 计数+crash.log 可见化兜住。

### 件B · race guarded（timer.ts L402-410 一处·约 3 行）
```ts
const jobPromise = executeJobCore(deps, job);
const guardedJob = jobPromise.catch((err): JobExecutionResult => ({
  status: "error", error: err instanceof Error ? err.message : String(err),
}));
const result = await Promise.race([guardedJob, timeoutPromise]);
```
- 语义：状态面零变（race 收 error 结果照旧 settle）；rejection 传播面归零（滞后 reject 被 catch 吸收转 error 结果·timeout 先到时结果被弃且零 unhandled）。
- 单测：test/ 既有 cron timer 测试文件加 1 例——jobPromise 滞后 reject 场景断言结果 error+process 无 unhandledRejection（node --test 内监听）。

### 件C · F-3 第三型补丁（store.ts L252 一处+类型面顺手）
- `input.enabled ? 1 : 0` → `((input.enabled ?? true)) ? 1 : 0`——undefined→1（对齐 schema L28 DEFAULT 1 意图）；显式 false 保持 0。
- 类型面：CronJobCreate.enabled 若必填改可选 `enabled?: boolean`（窗内看实型定·最小面）。
- 单测 +1 例：create 无 enabled 字段→回读 enabled=true。
- app.ts L4099 路由面**不动**（store 层归一即全入口覆盖）。

## 三、窗内工序表

| # | 步 | 门禁 |
|---|---|---|
| S1 | 件A 件B 件C 三笔**独立 commit**（各含单测） | 每笔 check 绿+新例绿 |
| S2 | 全量 npm test 对表五族基线 | 同集合不增不减 |
| S3 | npm run build（dist 产物） | build exit 0+dist mtime 新锚 |
| S4 | 重启窗（**拍点避让**：14:07-15:37 常规拍区外选段·watchdog Disable→POST /shutdown→验 port FREE→channel.cmd 冷启→watchdog Enable——/end 已证不可靠禁用） | 锚A 三断言（uptime 重置+pid/CIM 对表+watchdog.log 旁证）+**executor 滚拍断言**（execution_log 连续 2 拍 ok） |
| S5 | 崩溃 handler 活体探针（临时进程内 throw 验证 crash.log 落行+exit 1——生产进程不动，用一次性子进程验） | crash.log 行格式+退出码断言 |
| S6 | 三查门回归（新建验证 job POST 走三查→验毕 DELETE） | 201+next_run_at 非空+enabled=1 双路 |
| S7 | 毕报链（BOD→COO·含 21:00 拍读数预案）+记忆条回写 | — |

## 四、回滚姿态

- 三件独立 commit 可单独 revert；dist 备份（bak-pre-*）照 10-07 手术卷惯例 S0 建。
- channel.cmd/store 数据面零触碰；TRIMLC_CRASH_LOG_ONLY=1+TRIMLC_CRON_STALE_RECLAIM=0 双 env 回滚通道在。
- watchdog 全程兜底不变。

## 五、依据

- BOD 10:13 排窗令+10:05 认收；COO 10:1x 反馈（两惯例+21:00 双语义+收口卷 @47838b89）
- 终裁卷 cto-windowb-gate-verdict-20261011.md+修复窗提案 cto-repair-window-proposal-20261011.md @21efe249
- FSD 10-07 自愈方案卷 fsd-cronengine-selfheal-design-20261007.md（P1-P3 对表）
- TriMLC 源码读毕：index.ts 192 行/timer.ts L258-307+L352-413/store.ts L240-260
- 测试基线：d7693c6 顶 check 绿+656 例 651/5 五族在册（本席独立两跑）

——CTO 小狄，窗前预研毕·草案定稿。14:00 窗开即施工。
