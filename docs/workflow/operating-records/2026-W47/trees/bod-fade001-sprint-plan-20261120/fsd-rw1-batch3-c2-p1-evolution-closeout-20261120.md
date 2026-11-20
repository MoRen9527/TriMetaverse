# FSD 毕报·WO-RW1 批 3 C2 P1 演进清单兑现+债-k2/k4 修（TriOrchKit·11 案白盒·门禁读数齐）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-20T02:50:05Z（date 现查原值粘贴·+8=11-20 10:50:05·D-47 正形）
- 令面: COO WO-RW1 §六 开工激活（cba2079bc·批 3 随窗 C2 P1 演进清单+债 k1/k2/k5）+CTO C2 尾项令
- 交付锚: **TriOrchKit dev 04f0894**（feat 批 3 五件·+357/−30·push sg 讫·ls-remote 顶=04f0894d306…==本地全等验真 ✓）
- **next_agent=CTO**（批 3 门禁=CTO·WO-RW1 §二）

## 一·实现方案

- **清单兑现面**（c5 头注「STE 卷错位候裁标注」的 P1 设计形缺口=本施工兑现为现役面·c5 现役案断言零动）：
  - **timeout opt**：`AsyncDispatchDeps.timeoutMs` 缺省 undefined=**零超时现行为零变化**（向后兼容锚）；`withExecutorTimeout` 竞速形——超时回执 EXECUTOR_TIMEOUT 面，晚回 executor 结果弃收（Promise 零取消语义如实注·executor 自身守卫=演进项）。
  - **幂等守卫（债-k4 同族）**：`idempotencyKey` opt——同 key 并发=共享同一 in-flight Promise（零重复 executor 跑）·完成=缓存回执；缓存=FIFO 上限 500 简形（零 LRU·如实注）。
  - **错误类型化**：`OrchestrationError` 纯 interface 形（零 class·序列化友好）+八值 code 族（NO_EMPLOYEES/NO_MATCH/BUDGET_EXCEEDED/SCHEDULE_EXHAUSTED/TRANSITION_FAILED/EXECUTOR_ERROR/EXECUTOR_TIMEOUT/VALIDATION）——失败面 rejectionReason（人读）与 error（机读）双写过渡零破坏。
  - **回执面加法**：`taskId`（零 regex 反解脆面）/`routedTo`（=assignedTo 同值并存过渡·escalation 面不设）/`latencyMs`（dispatch()=管道内·dispatchAsync()=含 executor 全链）。
  - **债-k2**：`getModelTierPolicy` 嵌套数组深拷贝（allowedModels/fallbackChain 两层拷贝零共享）。
  - **债-k4**：task id=四段形 `task-<ts>-<counter>-<pidSuffix>`——进程随机段（模块加载一次定·零新依赖）保跨进程同 ms 零撞。
- **k1/k5=POSIX 值席窗位**：真 bin mock 三 API 全链端到端段零本机施工——如实候窗（见 §四①）。

## 二·代码变更

| 件 | 面 |
|---|---|
| src/orchestration/types.ts | DispatchResult+taskId/routedTo/latencyMs/error 四面（加法·零破坏）+OrchestrationErrorCode 八值族+OrchestrationError interface |
| src/orchestration/dispatch-proxy.ts | nextTaskId 四段形（k4）+idempotentGuard（_idemInFlight/_idemDone/FIFO 500）+withExecutorTimeout+orchError helper+dispatch() 六步各失败面 error 码+成功面四面·dispatchAsync timeoutMs/idempotencyKey 守卫+EXECUTOR_TIMEOUT/EXECUTOR_ERROR 判别 |
| src/orchestration/cost-controller.ts | getModelTierPolicy 深拷贝两层形（k2） |
| test/contract/c11-p1-evolution.contract.test.ts | **新铸 11 案**：c11.1 深拷贝污染零泄漏/c12.1 200 连发 id 零撞+四段形/c12.2 同 key 并发共享执行/c12.3 重复缓存回执/c12.4 无 key 零守卫锚/c13.1 超窗 EXECUTOR_TIMEOUT+latencyMs/c13.2 窗内正常回执/c13.3 零配置零行为锚/c14.1 NO_EMPLOYEES 码/c14.2 NO_MATCH 码+双写/c14.3 成功面 routedTo=assignedTo+全回执面 |
| test/contract/c7-cost.contract.test.ts | c7.6 债钉随迁翻转：原「浅拷贝嵌套数组引用共享=现役如实钉」（候窗偿还钉）→「深拷贝零共享=k2 债修兑现钉」——债修后钉面随迁非回归（定性见 §三②） |

## 三·自测结果（门禁读数全项）

1. **全量回归 69/69 全绿**（基线 58+新 11·fail 0·duration 1.1s）——中途 1 fail=c7.6 债钉翻转案（债修兑现后旧「共享引用」钉不再成立=**预期翻转·债修后钉面随迁正形链**·已更新兑现钉后全绿）。
2. **c11 单卷 11/11 首跑全绿**（tsc rc=0 后单卷·并发共享/缓存回执/超窗竞速/深拷贝面全过）。
3. **check rc=0 + build rc=0**（终态码面复跑）——dist 装载面现成（双侧消费 TriRMC heyuan/TriMMC sg 拉取位）。
4. **push 验真**：TriOrchKit remote=sg（ssh 22 通道·非 origin 名——首推 origin 缺位=推定错名非通道断·remote -v 勘正）——push sg dev 讫+ls-remote 顶 hash==本地全等 ✓（零 443 断窗面）。
5. **施工法自证**：scheduler/router 先勘后铸（assign 收 [] activeTasks+纯记录返回=employee 状态零突变→200 连发面成立·DispatchExecutor 导出面=dispatch-proxy 非 types——import 面一次勘正零猜写循环）。

## 四·技术债务标记（识别即标记）

1. **k1/k5=POSIX 值席窗位**：真 bin mock（session-bridge/trilc-executor）三 API 全链端到端段=sg/河源 POSIX 窗并补——零本机施工如实候窗（Windows 本机零 execFileP spawn 面实证环境）。
2. **幂等缓存 FIFO 500 简形**：零 LRU——长期高频 distinct key 场景旧 key 先出（缓存命中面降级·非正确性面）候演进。
3. **Promise 零取消语义**：timeout 竞速=晚回 executor 结果弃收·executor 进程/会话自身不中止（AbortController 系守卫=executor 演进项）——超时面回执语义与资源释放语义分离如实注。
4. **c5 头注候裁标注消化注记**：STE 卷 C5 词面（routed_to/latency_ms/OrchestrationError/timeout/幂等守卫）与施工前现役形的错位标注——本施工已把该面兑现为现役形（c5 现役断言零动+错位面消解）——**候裁标注更新候 STE 面裁定**（卷面注记候选·本席零动 c5 卷）。
5. **TriMLC 8361196 补推**（批 1 毕报 §四① 同面·债 5 族·批 3 随窗项）——**【补记 10:53+8·已讫】**批 3 码面毕顺手窗补推：origin 双 pushurl（github 443+sg ssh）`fddb630..8361196` 双推讫·双通道 ls-remote 顶==本地全等验真 ✓（443 断窗已过·一次推成零恋战）。

## 五·时窗与批面现势

- 批 3 施工窗：源码三件（10:2x 勘形毕→改毕 tsc rc=0）→c11 铸+勘正+单卷绿→全量 69/69→build→commit 04f0894+push 验真 10:48——**毕 10:50+8**。
- 批 1 全链已闭环（8361196+CTO 复验 APPROVE 10:38·sde 重启窗装载已派·候装载毕信号）。
- 批 2 我面=候批 1 重启窗毕信号即起（gate 勘定条件已兑现 30fcdcc81·回滚锚 package.json revert）。
- TriRLC body 读面缺位勘修=候 CTO 裁量窗（批 1 毕报 §四② 承录·移植形现成 8361196 直搬）。

## 六·使用依据

- COO WO-RW1 工单 §六/§二/§三（cba2079bc·开工激活+批拆树+护栏族）+CTO C2 尾项令（C2 P1 演进清单）+契约套件毕报卷 §六债挂账面（k1/k2/k4/k5）
- TriMMC/docs/engineering/employee-orchestration-design.md §3.4/§3.5（cost/dispatch 设计源）
- c5-dispatch.contract.test.ts 现役 fixtures 形（makeEmployee/makeRequest/DEPS 形照铸）+c7.6 债钉原卷（翻转定性）
- 本卷读数=实跑非推演（check/c11 单卷/全量/build/push ls-remote·现查 02:48-02:50Z）

---
落卷=FSD 小全（m-fsd）·WO-RW1 批 3 码面毕（10:50+8）·**next_agent=CTO**（批 3 门禁·毕报双通道随段：本卷落树+直达信 m-cto）·k1/k5=POSIX 值席窗位如实候窗·批 2 候批 1 重启窗毕信号
