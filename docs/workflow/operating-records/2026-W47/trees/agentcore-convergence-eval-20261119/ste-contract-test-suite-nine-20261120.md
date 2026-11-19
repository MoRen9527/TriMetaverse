# orchestration-kit 九件契约测试套件卷（P1 契约先行·STE 车道·notice-238 sprint C1）

- **seat**：STE（小柯）·契约测试套件设计席（P1 契约先行·FSD 实现门前置门——契约绿=实现依据）
- **输入**：CTO 设计主卷 97c8c70a3（两包形荐/P1 编排九件/判据四条）+分歧深化三层全谱（notice-236 两包形终裁·cpo-orchestration-divergence-deepening §一-§五共认承录）
- **九件实锚**（sg 双仓 orchestration/ 面现勘·名集零差）：capability-router/cost-controller/dispatch-proxy/employee-registry/employee-scheduler/index/session-bridge/trilc-executor/types（.ts）
- **契约基准形**：**断言基准=现役实形**（CTO 断言基准裁 cto-suite-baseline-ruling-20261120·TC 9db66c084——原「交集为契约正形」形随裁勘正·C4-C7 设计形词面已对表现役签名·沿革与挂账见 §五）；C2 前置两裁已落（cto-c2-dualruling-20261120：候裁①=含 family 过滤段 MMC 形为正形·候裁②=独立 sibling 新仓 TriOrchKit）
- lastSyncedAt: 2026-11-20（commit 时戳锚）

## §一 套件总形（TDD 门·契约测试形）

- **测试位**：`@tricompany/orchestration-kit/test/contract/*.contract.test.ts`（九件逐件+跨件集成——node --test·loader 直引形 sg 试收先例同）
- **契约绿判据**：全量 contract 套件绿（0 fail）+双侧现役行为对表读数零意外差——**契约绿=FSD 实现依据**（实现=使契约绿的非 kit 侧接线·kit 本体按契约实现）
- **契约红语义**：任一红=实现未达标停手面（禁删断言凑绿·期望校正双件套教义承）
- **落位协同**：本卷落树即达 FSD（不候汇总）·notice-212 节点短报制随跑

## §二 九件逐件契约面

### C1·types.ts（类型契约基座件）

- **契约面**：九件公共类型（SpawnResult 含 sessionId? 可选字段/OrchestrationError 族/调度参数族）导出面零断链；类型仅编译期零运行时副作用（import 零 side-effect 断言）。
- **断言**：`import types 后全九件类型引用可解析（tsc --noEmit 零 TS2307 于 kit 面）`+`types.ts 无可执行语句（AST 面仅 interface/type export）`。

### C2·index.ts（出口聚合契约）

- **契约面**：八件出口全量再导出（`export * from` 面·零漏导出）；index 面零业务逻辑（纯聚合件断言）。
- **断言**：`kit 入口 import { <每件主符号> } 全数可解`+`index.ts AST 面零函数体（纯 re-export）`。

### C3·employee-registry.ts（席位注册契约）

- **契约面**：loadEmployeeRegistry(source) → {employees: EmployeeRecord[], errors: []}；13 席真源形（TriMMC 面 LOADED=13 承）；坏 contract 优雅跳过零抛（fail-closed 降级面）。
- **断言**：`合法 v3 contracts 装载零错+席位 id 唯一`+`单件坏 contract→errors 记录+零抛`+`空目录→零席空 errors 非抛`+`幂等：同源两次装载逐字段等值`+`**family 过滤双侧同值案（C2 候裁①裁落·施工门禁新增）**：board/business-strategy 两 Registry 席被过滤且**零入 errors**·roster=Role-only（MMC/RMC 同断言值面——若 RMC 侧真有隐藏全量装载消费方，该案活体对表显性失败 fail-visible 回勘面在）。

### C4·employee-scheduler.ts（任务状态机契约·现役实形勘正版）

- **契约面（现役实形）**：任务生命周期状态机形——`transition(task, to, reason?) → {success, task, error?}`（VALID_TRANSITIONS 表校验·返回不可变新对象）+`assign(task, employee, activeTasks, config?) → {success, task, error?}`（queued 态守卫+maxConcurrentTasks 容量守卫 hasCapacity）+`escalate(task, reason)`（→escalated+清 assignee）+`isTimedOut(task, timeoutMs?)`/`getConfig()` 族。
- **断言**：`合法迁移→success:true+返回新对象（原 task 对象零变·immutable 断言）`+`非法迁移→success:false+error 列出该态合法迁移表（VALID_TRANSITIONS 值面对表）`+`assign 非 queued 态拒（error 值面）`+`assign 超容量拒（activeTasks≥maxConcurrentTasks·error 值面）`+`isTimedOut 边界（窗内 false/超窗 true）`。
- **设计意图挂账（原卷词面·不灭失）**：池选取轮转形（next(profile)→EmployeeRecord|null·循环轮转/空池 null）——→ §五 演进清单。

### C5·dispatch-proxy.ts（同步编排管道契约·现役实形勘正版）

- **契约面（现役实形）**：`dispatch(request, deps) → DispatchResult` 同步六步编排管道（classify→load→estimate→route→budget→schedule[assign+transition]→dispatch）——成功形 `{success:true, assignedTo, costEstimate{estimatedTokens, estimatedCostUSD, modelTier}, trace[]}`·失败形 `{success:false, rejectionReason, trace[]}`（预算拒/调度穷尽/迁移失败三面·**结构化回执零裸抛**）；`dispatchAsync(request, deps)`=同管道+executor.execute 真执行回写 `output`/`executionError`。
- **断言**：`六步管道 trace 步序断言（classify/load/estimate/route/budget/schedule 步名齐序）`+`正常路由成功回执形（assignedTo+costEstimate 三字段+trace 完整）`+`预算拒→success:false+rejectionReason 值面（budget 段·零裸抛）`+`route 不匹配→success:false 回执（rejectionReason 值面）`+`dispatchAsync executor 失败→success:false+executionError 回写形`。
- **设计意图挂账（原卷词面·不灭失）**：routed_to/latency_ms 回执形·timeout opt→TIMEOUT 码·OrchestrationError 类型化·幂等守卫（同 task id 不双重派发·原「双侧差异面候裁标注」位随之归档）——→ §五 演进清单。

### C6·capability-router.ts（路由判定契约·现役实形勘正版）

- **契约面（现役实形）**：`route(employees, routingRequest) → RoutingDecision` **纯判定打分形**——matched/primary/score/matchDetails（含 ioCoverage）/alternatives 回退序；判定=选择·零执行零 side-effect（真执行在 dispatch/executor 面）。
- **断言**：`matched=true 形（primary 非空+score 数值+matchDetails.ioCoverage 值面）`+`不匹配→matched=false 回执形（dispatch 面按拒收走·零抛）`+`纯函数幂等判定（同输入双调 RoutingDecision 等值）`+`alternatives 序稳定（主选不可用时回退序可复现）`。
- **设计意图挂账（原卷词面·不灭失）**：capability handler 注册表执行形（route(capability, payload)→handler 执行结果）·CAPABILITY_NOT_FOUND 码·handler 异常隔离零传染——→ §五 演进清单。

### C7·cost-controller.ts（预算契约·现役实形勘正版）

- **契约面（现役实形）**：`estimateCost(employee, expectedOutputs) → {estimatedTokens, estimatedCostUSD, modelTier}`+`checkBudget(employee, estTokens, estCost) → {approved: boolean, reason?: string}`（reason=**人话字符串**·三 cap 面：company daily/employee daily/per-task）+`recordCost/getBudgetState/getModelTierPolicy/resetBudget` 族。
- **断言**：`estimateCost 回执三字段形（modelTier 合法枚举值面）`+`预算内 checkBudget→approved:true+reason 缺省（undefined 面断言）`+`三 cap 逐面超限→approved:false+reason 非空人话字符串（值面含对应 cap 名·逐面对表）`+`recordCost→getBudgetState 读数对表（记账可见性）`。
- **设计意图挂账（原卷词面·不灭失）**：can_spend 形·BUDGET_EXCEEDED 错误码·记账幂等（同 spend id 双记单计）·并发 record×100 余额守恒——→ §五 演进清单。

### C8·session-bridge.ts（会话桥契约·八阶段面）

- **契约面**：三 API dsh CLI 形（spawn headless boot/list sessions 扫描/send --session-id 定向——T2 线 f70a3bf 现役语义承）；resolveDshBin 三段解析序；SpawnResult 含 sessionId? 可选；五态状态机全谱。
- **断言**：`resolveDshBin 三段序（PATH 段一/二/兜底）`+`mock dsh 三 API 端到端（boot/list/send 回执形）`+`状态机迁移表全谱（合法迁移绿/非法迁移拒）`+`零凭据声明面（凭据零硬编码 grep 守卫）`——**承 T2 白盒族 7/7 形**（现有 test/session-bridge-dsh.test.ts 迁 kit 面契约化）。

### C9·trilc-executor.ts（R 面执行器契约·跨面件候裁标注）

- **契约面**：execute(plan) → {rc, stdout_tail, stderr_tail}；R 面 trilc 权威路径调用形（pidfile 先验·禁裸杀承）；RC 守卫（非零 rc=结构化回执零裸抛）。
- **断言**：`权威路径调用形断言（pidfile 先验在调链）`+`rc=0 回执形`+`rc≠0→结构化回执（rc/stdout_tail/stderr_tail 三字段）`+`超时强杀进程树回执形`——**跨面件标注**：trilc-executor 面特性=「跨面编排件」（R 面语义·orchestration-kit 收敛面内零面特性违反判据②「agent 域语义」——候 CTO 裁标注面：kit 内容或 P2 挪出）。

## §三 跨件集成契约（C10 补面）

- **全链形**：registry 装载→scheduler 选取→dispatch 分发→capability 路由→cost 记账——五件串联端到端回执形（mock 面）；**隔离面**：单件故障注入→链路降级回执零级联崩（error isolation 断言）。
- **side-effect 零面**：全套件运行零生产触碰（mock dsh/mock fs 隔离·TRIMC_CONFIG_DIR 等环境敏感位零触——sandbox 纪律承）。

## §四 FSD 协同形（notice-212 节点短报制）

- 本卷落树即达 FSD（契约绿=实现依据·FSD 按 §二逐件实现使契约绿）；
- 节点短报制：每件契约绿/红随跑短报值席（不候全量汇总）；
- 双侧差异面标注汇总（§二内「候裁标注」位）：dispatch 幂等形/session-bridge 现役承形/trilc-executor 跨面件归属——三标注候 CTO 裁·裁前契约面按交集保守形跑。

## §五 勘正注记（CTO 断言基准裁随动·2026-11-20）

- **裁锚**：CTO 契约套件断言基准裁决（cto-suite-baseline-ruling-20261120.md·TC 9db66c084·COS 767 落账 30cf4e68c）——**断言基准=现役实形**（锁设计形=C3 必炸信号淹没·自反收敛目的）；fsd 四实锚勘定（fsd-c2-dualside-survey dc9c9d42a+中段短报转·COS 分诊）触发本席勘正（裁后随动·CTO 知会 2026-11-19T23:03:26Z）。
- **勘正沿革（四实锚+C4 同族一并）**：C4 `next(profile)` 轮转形→任务状态机形（transition/assign/escalate·isTimedOut）；C5 `routed_to/latency_ms`/OrchestrationError/timeout/幂等守卫→DispatchResult 六步管道结构化回执形；C6 handler 执行/CAPABILITY_NOT_FOUND→RoutingDecision 纯判定形；C7 `can_spend`/BUDGET_EXCEEDED→checkBudget `{approved, reason 人话字符串}`+recordCost 族。C3 增双侧同值 family 过滤断言案（CTO 裁卷 §一·施工门禁新增）。
- **设计意图挂账（不灭失·C2 P1 演进清单·sprint 后窗评估）**：C4 池选取轮转形·C5 timeout 形/幂等守卫/OrchestrationError 类型化·C6 capability handler 执行形/异常隔离·C7 记账幂等/并发守恒——kit 收敛毕后演进候选·裁前不铸不删。
- **独立验注**：本席勘正词形以 **TriMMC src/orchestration/ 现役源码直读为锚**（transition/assign 签名+dispatch 六步+RoutingDecision/checkBudget 返回形逐一实勘）·非转抄 fsd 转述；双侧八件零语义差（fsd strip-cr 谱·真差=registry family 段一处·候裁①已裁含段=正形）——fsd 方法论采认：后续契约断言体铸形以运行时探针打印键面 JSON 为唯一抄写源+编译器值面 diff 回路（防手打词族拼形漂移·c7 两稿三词族全错实证教训）。
- **落位随注**：kit 仓=独立 sibling 新仓 TriOrchKit（npm 包名 @tricompany/orchestration-kit 保持）·新仓 .gitattributes 钉 `* text=auto eol=lf`（strip-cr 假漂移家族仓级根除）·九件落装=MMC 形为基直拷+executor 新名投影+family 过滤段并入。

## 使用依据

CTO 设计主卷 97c8c70a3（两包形/P1 九件/判据四条/md5 六对）；cpo-orchestration-divergence-deepening §一-§五（15 项四族/共认差异标注）；sg 双仓 orchestration/ 面现勘（九件名集零差实锚）；T2 线 session-bridge 白盒族 f70a3bf（C8 基座）；notice-238 sprint C1 派工令。

—— STE 小柯（m-ste·契约测试套件设计席）·2026-11-20（commit 时戳锚）
