# N4 设计卷（票域 Tickets/Assignments+Policy 最小门·FSD 席·门①终审候）

- sourceOfTruth: 本件（N4 施工设计·双门形门①终审物·PASS 后动笔）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 上游: 补读小门判定 cto-n4-preread-gate1-ruling.md（40b1b2411·六点裁面全裁）+补读笔记（9f37e4e75·行号锚直引原型）+门③判定 7178f409d（两点裁量）+迁移表裁定 14:18:10Z
- 原型思想源: dsh-superagent src/core/{tickets,assignments}.ts+src/policy.ts（805 行全读在案）

## §一 · 范围锁定与表形（判定书裁面①②落形）

- **范围**（判定书②采认形）：Tickets 生命周期核心（create/addInput/end/retry/report/wake/stop/rebind 面裁减）+Assignments 报告面（started/delivered/read/turnEnded/report）+Policy 最小门（paused+revalidate+admission cell 表）。**划出**：threads/triggers/disposition/Eval/Executor/worker Session 面=现役嫁接域（N5/N6+事件源域）——letGo 落基础形（owners 空判+未 ack 剔除·queueForEval=嫁接时接留 API 位）
- **表形**（SQLite 拆表·判定书①「PK 索引/JOIN 消解」落形）：
  ```sql
  CREATE TABLE IF NOT EXISTS ticket (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL   -- 主体 JSON：title/mandate/channels/follows/assignments/undelivered/ended/attention/answers
  );
  CREATE INDEX IF NOT EXISTS ticket_open ON ticket(id) WHERE json_extract(value, '$.ended') IS NULL;  -- open() 扫描
  CREATE TABLE IF NOT EXISTS ticket_input (
    ticket_id TEXT NOT NULL, input_id TEXT NOT NULL, kind TEXT NOT NULL, value TEXT NOT NULL, at TEXT NOT NULL,
    PRIMARY KEY (ticket_id, input_id)   -- addInput 幂等=INSERT OR IGNORE（PK 天然·消解原型 L235 线性扫描）
  );
  ```
  - **三段零重复注**：input 的 readAt/deliveredTo 面归 ReadTracker 独立表（β-3 已落·§二映射裁定依据链）——ticket_input 表不设 read 列（单一真源）
  - **assignment 嵌 ticket value JSON**（原型正形·生命周期 state 转换简单·不拆表——如实注）
  - undelivered 序列嵌 ticket value JSON（序面·票域 mutation 全走 V2Store.atomic）
- **落点**：`src/v2/tickets.ts`（TicketRepo 表形+Tickets+Assignments 两类）+`src/v2/policy.ts`（Policy 最小门）+`src/v2/errors.ts`（UserError）+`test/v2-tickets.test.ts`——4 新件；`src/v2/engine.ts`（closingFlag holder+组合序扩）+`src/v2/store.ts`（reporter 可选注入）两小改

## §二 · API 面与依赖图（组合序扩）

- **组合序**（engine.ts 扩）：lock→store→Effects→ReceiptsStore→ReadTracker→**Policy→Tickets→Assignments**→start。依赖单向：Tickets 持（repo/effects/readTracker/receipts/policy/closingFlag）·Assignments 持（repo/tickets/replies 位=closingFlag）——**零环形**（原型 EngineOptions port 形映射为构造注入·判定书三.1「不采 Engine 注入守卫环形」正形）
- **closingFlag holder**（判定书三.1 裁定形）：`interface ClosingFlag { closing: boolean }`——Engine 内 `readonly closingFlag: ClosingFlag = { closing: false }`，stop() 置 true；Engine.closing 改 getter 引 holder（deliverAndTrack 现守卫同源）；票域 mutation 方法入口 `if (this.closing.closing) throw new UserError('closing')`
- **Tickets 类 API**（原型裁减谱）：create/addInput（幂等 PK+held 让位）/end（liveTicket 幂等+letGo 基础形）/retry（canRetry 谱裁减=retriable report 态判定）/report→Assignments 面（原型 report 在 Assignments L99）/wake（只 human 复活+paused 拒+revalidate 拒 refuse）/stop/rebind=bind 面候嫁接（**首版落 create/addInput/end/retry/wake/stop 六核心+Assignments 五面**）
- **Assignments 类 API**：started/delivered/read（→ReadTracker.ack）/turnEnded/deliveryFailed/report（attention 谱裁减=question+state 校验谱·replies.withdrawAttention=嫁接位注释锚）
- **executor port 映射**（原型 options.executor.start/deliver/stop）：v2=effects.enqueue 投递效果行（handler 注册面=deliverAndTrack 链——Engine 注册 `effects.handle('deliver', ...)` 消费 receipts pending 行→deliverAndTrack）+Assignments.started/delivered 状态落库。**首版 handler 链落形**：enqueue('deliver', receiptId)→handler 调 receipts.deliver(id, transport 注入)+sent→readTracker.markDelivered（deliverAndTrack 正身移植·transport=Engine 组合注入候选位）

## §三 · Policy 最小门裁减表（原型 settingsPolicy L167-242→v2）

| 原型面 | v2 首版 | 裁定 |
|---|---|---|
| paused flag | 保留（wake/addInput 门） | 全采 |
| revalidate L213-240 | 保留三支：followup explicit 免/admission cell 强度不降（STRENGTH 表）/observation→rulesOn | eval mode 面=v2 首版恒 auto 谱（mode 配置候事件源嫁接）·如实注 |
| gate L191-211 | **划出**（事件源嫁接域 N5/N6） | 判定书②范围 |
| admission cell 表+ADMISSION_DEFAULTS | 保留表形常量（cell 谱 3×2） | revalidate 依赖 |
| policyVersion/policyEffects/settings schema/zod | **划出**（settings 面候嫁接） | 最小门边界 |
| assessmentOutcome/EvalConfig | **划出**（Eval 嫁接域） | 同上 |

- Policy 落形：`class Policy { paused=false; revalidate(mandate): boolean }`+ADMISSION_DEFAULTS 常量+STRENGTH 表——mandate 最小形 `{ via, strength, actor, source, rules?, cell?, observation? }`

## §四 · emit→Effects enqueue 谱（判定书④落形）

- `emit(eventName, payload)` → `effects.enqueue('emit', `${eventName}.${ticketId}`, payload)`——**kind='emit' 统一·key=event.ticketId**（coalesce 幂等防级联·不同事件不同 key 零误并·同事件重发=generation+1 覆盖）
- N4 落 emit 点：ticket.created/ended/resumed/assignment.started/ended（原型谱裁减）——消费 handler=嫁接域（N5/N6+现役挂接·**首版只 enqueue 不注册 handler=行留库候消费**·如实注）
- 即时 UI 回调不入 N4（判定书④附注）

## §五 · 自测门案表（判定书十案基谱+三硬门必含+补两案）

| # | 案 | 门 |
|---|---|---|
| 1 | 全生命周期链 create→pending→started→delivered→read→report ready→end completed | 主链 |
| 2 | addInput 幂等（重复 id PK 拒零重入）+held（waitsForPerson 时 automatic 不入 undelivered） | 输入面 |
| 3 | end letGo 基础形（undelivered 清+assignments 标 ended+liveTicket 幂等二调零变） | 终局面 |
| 4 | retry（retriable 态门+requeueUntaken 重排队首） | 赋值面 |
| 5 | report UserError 谱（questionWithResult/askerWithoutQuestion/assignmentEnded/ticketEnded） | 校验面 |
| 6 | wake 复活门谱（paused 拒/revalidate 拒 refuse/只 human 复活/bot 同排等待） | 复活面 |
| 7 | policy revalidate 谱（followup explicit 免/admission cell 强度不降/observation rulesOn） | 授权门面 |
| 8 | **硬门①跨 reload 持久**（票+input 写→store.close→同库重开→票在+input 幂等仍在） | 验收门①同族 |
| 9 | **硬门②settleTicket 批量收敛断言**（report ready→readTracker delivered→settled 直跳·delivered 未读票末收敛支） | β-3 挂接 |
| 10 | **硬门③closing 拒新**（closingFlag 置 true→票域 mutation 全谱 UserError('closing')） | 语义注②落形 |
| 11 | emit→effects enqueue 断言（kind='emit'·key=event.ticketId·coalesce generation+1） | 判定书④落形 |
| 12 | reporter spy 断言（committed 回调抛→reporter 收 error·事务不败） | 判定书三.2 |
| 13 | β 三套零改动复跑 27/27+全量 | 并入零改面 |

## §六 · β 零改面对表

- β 三件（receipts/effects/read-tracker）**零改动**——N4 改面=engine.ts（closingFlag holder+组合序扩）+store.ts（reporter 可选注入缺省参）两 N1 件——β 三套零改动复跑照案 13 验收
- store.ts 改形：`constructor(stateDir, dbName='v2.db', onCommittedError?: (error: unknown) => void)`——缺省 console.error（现行为零变·测试 spy 注入断言）

## §七 · 候 CTO 勘定点

1. **ticket_input 拆表形**（本卷 §一）vs 单表 value JSON（O(n) 留锚）——本席建议拆表（判定书①「PK 索引/JOIN 消解」忠实落形+ReadTracker 单一真源注）
2. **首版 handler 链落形**（§二 executor port 映射：effects.enqueue('deliver')+Engine 注册 handler→deliverAndTrack 移植）vs 票域直调 receipts.send——本席建议 enqueue 形（照 committed 分野+β-2 退避/死信面天然继承）
3. **retriable 态判定裁减**（原型 stage.ts canRetry 未深读——本席按 report 态谱 retried=report∈{failed,blocked} 判·设计注如实标注原型差）——候认或令补读 stage.ts
4. **replies 依赖划出确认**（attention withdraw=嫁接位注释锚·首版不落 withdraw 面）

## §八 · 使用依据

- 补读小门判定（40b1b2411·六点裁面）+补读笔记（9f37e4e75·原型行号锚直引）+门③判定（7178f409d）+迁移表裁定（14:18:10Z）
- 原型分件：tickets.ts/assignments.ts/policy.ts（805 行全读在案）+任务书 b76dce4e §三 α 表+方案卷 7ecd788f5 §三 N4 段
- β 先例：receipts value JSON 形+effects 拆列形+read_state 单一真源+V2Store atomic/committed（222726c 在役）
