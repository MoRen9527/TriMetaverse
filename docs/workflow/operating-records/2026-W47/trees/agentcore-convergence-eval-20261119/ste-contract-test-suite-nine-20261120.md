# orchestration-kit 九件契约测试套件卷（P1 契约先行·STE 车道·notice-238 sprint C1）

- **seat**：STE（小柯）·契约测试套件设计席（P1 契约先行·FSD 实现门前置门——契约绿=实现依据）
- **输入**：CTO 设计主卷 97c8c70a3（两包形荐/P1 编排九件/判据四条）+分歧深化三层全谱（notice-236 两包形终裁·cpo-orchestration-divergence-deepening §一-§五共认承录）
- **九件实锚**（sg 双仓 orchestration/ 面现勘·名集零差）：capability-router/cost-controller/dispatch-proxy/employee-registry/employee-scheduler/index/session-bridge/trilc-executor/types（.ts）
- **契约基准形**：MMC/RMC 双侧现役语义**交集为契约正形**·双侧差异面=「orchestration-kit 语义正形候选」显式标注（候 CTO 裁·契约面不擅裁语义归一）
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
- **断言**：`合法 v3 contracts 装载零错+席位 id 唯一`+`单件坏 contract→errors 记录+零抛`+`空目录→零席空 errors 非抛`+`幂等：同源两次装载逐字段等值`。

### C4·employee-scheduler.ts（调度契约）

- **契约面**：调度选取形（next(profile) → EmployeeRecord | null）；循环轮转语义；空池→null 零抛。
- **断言**：`空池 next→null`+`单席池恒返该席`+`多席池循环轮转序稳定（两次全轮序等值）`+`并发调 next（Promise.all×50）零重入破坏`。

### C5·dispatch-proxy.ts（分发代理契约）

- **契约面**：dispatch(task) → {routed_to, latency_ms}；路由失败→OrchestrationError（routed_to=null）零裸抛；超时形（timeout opt→TIMEOUT error code）。
- **断言**：`正常路由回执形断言（routed_to+latency 非负）`+`目标不可达→OrchestrationError.code=DISPATCH_FAIL 零裸抛`+`timeout 触发形`+`幂等：同 task id 重复 dispatch 不双重派发（幂等守卫面·双侧差异面=候裁标注 MMC 形/RMC 形）`。

### C6·capability-router.ts（能力路由契约）

- **契约面**：route(capability, payload) → handler 执行结果；未注册 capability→CAPability_NOT_FOUND；handler 异常→隔离零传染（单 handler 崩不拖全局）。
- **断言**：`注册→路由命中→结果透传`+`未注册→NOT_FOUND 人话码`+`handler throw→错误封装回执·其余 capability 路由不受影响`。

### C7·cost-controller.ts（成本控制契约）

- **契约面**：budget 检查形（can_spend(cost) → bool+reason）+记账形（record(spend)）；预算超限→拒绝+reason=BUDGET_EXCEEDED；记账幂等（同 spend id 双记=单计）。
- **断言**：`预算内 can_spend=true`+`超限 false+reason 值面`+`record 幂等（同 id 双记余额单扣）`+`并发 record×100 余额守恒（竞态面）`。

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

## 使用依据

CTO 设计主卷 97c8c70a3（两包形/P1 九件/判据四条/md5 六对）；cpo-orchestration-divergence-deepening §一-§五（15 项四族/共认差异标注）；sg 双仓 orchestration/ 面现勘（九件名集零差实锚）；T2 线 session-bridge 白盒族 f70a3bf（C8 基座）；notice-238 sprint C1 派工令。

—— STE 小柯（m-ste·契约测试套件设计席）·2026-11-20（commit 时戳锚）
