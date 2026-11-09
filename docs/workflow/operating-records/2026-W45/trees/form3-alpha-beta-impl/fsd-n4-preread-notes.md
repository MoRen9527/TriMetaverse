# N4 补读笔记小卷（原型 Tickets/Assignments/policy 分件·FSD 席·门①候 CTO 对表）

- sourceOfTruth: 本件（N4 开工前置补读小卷·准动令 2026-11-05T15:01:21Z+门③判定 7178f409d 裁定②小门）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 深读通道: sg clone SSH 只读（`cat -n`·零写入零副本入仓——N1 深读门同通道同纪律）
- 分件: `/tmp/dsh-superagent-proto/src/core/tickets.ts`（423 行）+`src/core/assignments.ts`（140 行）+`src/policy.ts`（242 行）=805 行全读

## §一 · 三件结构谱（方法面+行号锚）

### tickets.ts——票生命周期主面（Tickets extends EnginePart）

| 面 | 方法（行号） | 语义锚 |
|---|---|---|
| 诞生 | create L37-56 | accept 决定→票+Mandate+channels 去重（sameChannel L12 JSON 比对）+first Assignment+subscribe triggers' threads+ack（replies.acknowledgeAccepted L53）+executor.start 排队+emit ticket.created |
| 订阅 | bind L61-72/threadClosed L77-90/followsDone L95-101/dropSubscriptions L214-229/subscribe L417-422 | follows own 语义（own 一旦 true 不降 L68）·followsDone=own 优先计数·全 closed 取最晚 close；subscriptions 与 context 互斥（L420 context 剔除） |
| 挂接 | attachable L106-115/attach L121-144 | attachable 门谱（unknownTrigger/leftToWorkers/ticketStopped/mandateRevoked=revalidate）；attach=input 幂等（id=key(input,ticket,trigger)）+disposition fanout 记录+requeued/context 复位支重投（L139-141 带 at 后缀 id） |
| 输入 | addInput L234-245/note L395-401/requestStatus L150-155/policyChanged L200-208 | **addInput 幂等核心**：input id 已存在 return；held=liveTicket+automatic(input)+waitsForPerson→不入 undelivered（自动输入让位给人等待 L237-239）；running→executor.deliver / pending 且非 waitsForPerson→executor.start——**Policy change 不复活 pending（L232 注）** |
| 复活 | wake L252-270 | 门谱：ended+非 human stop+undelivered 非空；policy.paused 拒；revalidate 拒→refuse；**只 human trigger 复活**（L259 bot/CI 与 end 前输入同排等待）；resumed marker unshift 队首（先于积压投递） |
| 终局 | end L345-363/stop L160-163/letGo L294-309/refuse L311-316/unfinished L370-379 | end 核心：liveTicket 守卫（幂等 return）；until=readUntil(ticket)（L350）；waiting=undelivered 未达/left=untaken 未读（**readBefore L19-20 判**）；ended 记录+undelivered 清+assignments 标 ended（L358）；letGo（fanout 剔除+owners 空+未 ack+未 decided→queueForEval L307）；emit ticket.ended；executor.stop 逐个 |
| 赋值 | retry L168-180/restart L318-327/requeueUntaken L333-337/newAssignment L381-386/endAssignment L387-390 | retry 门=canRetry（stage.ts）；requeueUntaken=未 readAt（null 哨兵）+deliveredTo=replaced 的 trigger input 重排队首；assignment id=key(assignment,ticket,序号) |

### assignments.ts——赋值报告面（Assignments extends EnginePart）

| 面 | 方法（行号） | 语义锚 |
|---|---|---|
| 生命周期 | started L34-43/delivered L48-58/turnEnded L66-71/deliveryFailed L72-77 | delivered：undelivered 剔除+deliveredAt 记+**input.readAt ??= null+deliveredTo=assignmentId**（readAt=null=已投未读哨兵——readBefore 判定输入）；started：pending→running+startedAt 首记（??=）+undelivered flush+emit assignment.started |
| 已读 | read L60-65 | **input.readAt ??= now——worker Session 把 input 拿进 step 时记（β-3 read 段原型正身）** |
| 中断 | interrupted L83-92 | host restart：busy=deliveredAt>=report.at；settled=report∈{waiting,ready,blocked,failed} 且非 busy→settled ? flush undelivered : tickets.restart(hostRestarted+RECOVERY_NOTE L21) |
| 报告 | report L99-134 | UserError 谱（ticketEnded/questionWithResult L102/askerWithoutQuestion L103/notAsker/notAnswerable/unknownAssignment/assignmentEnded）；attention question 生命周期（换问→replies.withdrawAttention L121）；assignment.report={state,summary,at}；answers→takeUp；blocked/failed→undelivered 剔 automatic（L126）；**ready/dropped→followsDone 联动 end 票**（L129-132 outcome 谱） |

### policy.ts——授权门面（schema+评估转换+Policy 正身）

| 面 | 锚 | 语义 |
|---|---|---|
| schema 谱 | L13-109 | Rule/RuleMatch（reason 1-500）/RuleAssessment/AdmissionDirection（implementation_requested+target_basis≠undetermined+无 open design decision L26-29）/EvalConfig（mode off/observe/auto+timeout 120 默认）/ExecutorConfig（maxWorkers 3 默认+directory+prepare+blockedCommands）/Settings（paused+sources+policy+eval+executor·strict） |
| 评估转换 | assessmentOutcome L40-61 | accept 门谱：rule_assessments 对 enabled 规则全覆盖恰好一次（L44-46 throw）/directionAllowed/noRuleMatched/intent_evidence 必需（L53 throw）/inferred 非 auto→would_accept 观察不 accept（L55-58） |
| 默认规则 | DEFAULT_RULES L62-66 | copy+visual 两条 instruction 全文（visual 含「不定 direction 只观察」细则） |
| 版本 | policyVersion L116-118/POLICY_REVISION L111 | 'mandate-v3'+{rules,mode,sources} hash——**模型/并发/pause 变更不失效既有决定（L114 注）** |
| Policy 正身 | settingsPolicy L167-242 | gate L191-211：human→allowedSender+admission 表 cell 判（explicit 直过 L204·followup 支 L206-208 participating·admission inferred 需 mode≠off L209）/machine→machineGate L171-188（bot 表+senderless 系统事件）；admitsInferred L212（mode auto+全规则 enabled）；revalidate L213-240（followup explicit 免/bot 表在/admission cell 强度不降级 STRENGTH L141/listed 升格 L229-232/observation→auto+rulesOn L238） |
| 变更效果 | policyEffects L144-165 | settings 变更→逐 open 票 PolicyEffect（rules disabled/changed/requesterAllowed L158-160/proactive L161）——tickets.policyChanged 消费面 |

## §二 · β-3 三段原型正身映射（readAt/deliveredAt/readUntil→ReadTracker）

| 原型面 | 位置 | v2 映射 |
|---|---|---|
| delivered（投达） | assignments.delivered L48-58（readAt ??= null+deliveredTo） | ReadTracker.markDelivered（β-1 sent 事件挂接已落 N2/N3） |
| read（读入 step） | assignments.read L60-65（readAt ??= now） | ReadTracker.ack（显式 ack·裁定候选 A） |
| settled（票末计已读） | tickets.end L350 readUntil(ticket)+readBefore L19-20 判定式 | Engine.settleTicket（批量 settle·**delivered→settled 直跳支=原型票末收敛语义正身**——迁移表裁定 14:18:10Z 同构） |
| readUntil | model.ts（readBefore L19-20 引用） | 票末已读截止线=latest report or turn end 时点——v2 票域落 report API 时随真信源定 |

## §三 · v2 票域落形裁面对表（候 CTO 对表勘定）

1. **依赖面映射**：原型 repo（tickets/triggers/threads/decisions 仓储）+options.executor（start/stop/deliver）+replies+emit 事件面——v2 现有三件=V2Store（atomic+committed）+Effects（退避队列）+ReceiptsStore（投递）+ReadTracker（三段）。**票域持久落 SQLite 表形**（ticket/assignment/input 面）vs 内存 repo+committed 快照——**候裁**：本席建议 SQLite 表形（跨 reload 持久=验收门①同族·β-2/β-3 先例）
2. **范围裁面**：原型票域体系大（threads/triggers/disposition/Eval/Executor/worker Session 面）——任务书 N4=票域 Tickets/Assignments 并入（+policy 门面）。**本席建议 v2 票域=Tickets 生命周期核心（create/addInput/end/retry/report）+Assignments 报告面（started/delivered/read/turnEnded/report）+Policy 最小门（paused+revalidate+admission cell 表）**；threads/triggers/Eval/Executor/Session 面=嫁接现役事件源时再勘（N4 设计卷细化）
3. **Inputs 三段与 ReadTracker 挂接**：原型 input.readAt 字段嵌入 ticket JSON——v2=ReadTracker 独立表（β-3 已落）——票域 report/turn-end 时点调 settleTicket 批量收敛（§二映射）
4. **emit 事件面**：原型 emit（ticket.created/ended/resumed/assignment.started/ended/thread.*）——v2=Effects enqueue（持久事件→现役消费面挂接候）vs 内存回调——**候裁**：Effects enqueue（持久+跨 crash·照 committed 分野注释「跨 crash 持久副作用=committed 回调」谱）

## §四 · 准动令附加两点裁量落形候选（门③判定书语义注②）

1. **closing 检查落票域方法**：原型无 closing 概念（EnginePart 面）——v2 落形候选=票域公开 mutation 方法（create/addInput/end/report 等）入口感 `if (engine.closing) throw`（Engine 注入守卫 vs 票域持 closing flag 注入——设计卷细化）；N1 Engine.stop 已有 closing flag（deliverAndTrack 消费形同族）
2. **console.error→结构化 report 面**：V2Store.reportCommittedError 现为 console.error 轻量形（毕报如实注④）——升形候选=注入 reporter（constructor 可选参·缺省 console.error——β 组合零改）或 effects.health 面挂靠——**候斟**（β 零改面约束下：可选注入参数零破坏）

## §五 · 缺陷候选对照（N1 深读笔记第三§八条+票域新读）

- 原型八条在案面零新增冲突；票域新读记档三点：①addInput 幂等靠 input.id 线性扫描（ticket.inputs.some L235）——票输入量大时 O(n) 面（v2 表形=PK 天然索引·自然消解）②report L126 undelivered 剔 automatic 用 `!automatic(...)` 谓词反查 find——一次遍历嵌套 find O(n²) 面（v2 表形同消解）③wake L259 undelivered.map(find) 逐 id 全扫——同上（表形 JOIN 消解）。三点均系原型 JSON 形固有·非语义缺陷
- letGo L307 `!this.owners(trigger).length`=owners 空+未 ack+未 decided 三条件与——v2 席位语境 owners 映射候设计卷定（TriCompany 无 multi-ticket owners 竞争形态·可能简化）

## §六 · N4 自测门候选案（设计卷细化·先谱）

| 案 | 门 |
|---|---|
| 票 create→assignment pending→started→delivered→read→report ready→end completed 全生命周期链 | 生命周期主链 |
| addInput 幂等（重复 id 零重入）+held（waitsForPerson 时 automatic 不入队） | 输入面 |
| end letGo（未达/未读 message 放手+queueForEval 面） | 终局面 |
| retry（canRetry 门+requeueUntaken 重排队首） | 赋值面 |
| report UserError 谱（questionWithResult/askerWithoutQuestion/assignmentEnded） | 校验面 |
| wake 复活门谱（paused 拒/revalidate 拒 refuse/只 human 复活） | 复活面 |
| policy revalidate 谱（followup explicit 免/admission cell 强度不降/observation auto+rulesOn） | 授权门面 |
| report ready→settleTicket 批量收敛（delivered→settled 直跳）断言 | β-3 挂接案 |
| 跨 reload 持久（票域 SQLite 表形——若裁采表形） | 验收门①同族 |
| closing 拒新（票域方法入口感） | 语义注②落形 |

## §七 · 使用依据

- 门③判定书 cto-alpha-n1n2n3-gate3-review.md（TMV 7178f409d·裁定②小门+N4 两点裁量）
- 准动令 2026-11-05T15:01:21Z+裁定卷 84f50517a（裁定②补读小门原文）
- N1 深读笔记 fsd-n1-deepread-notes.md（§三缺陷候选八条+§四取舍表 N1/N4 面）
- 任务书 b76dce4e §三 α 表（N4=票域 Tickets/Assignments 并入）+方案卷 7ecd788f5 §三 N4 段
- 原型分件全读：tickets.ts 423+assignments.ts 140+policy.ts 242（SSH 只读 cat -n·行号锚直引）
