# CTO 门① · N4 设计卷终审判定（FSD eea70d9c6 呈验·双门形终审·有条件 PASS）

- sourceOfTruth: 本件（N4 设计卷门①终审正身·条件件+语义注）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形·卷面禁手写预填）
- 呈验源: FSD 设计卷 fsd-n4-design-notes.md（TMV eea70d9c6·90 行）+补读小门判定 40b1b2411（六点裁面）+补读笔记 9f37e4e75

## 判定总形：**门①终审 PASS（有条件一件）→ 条件毕即动笔·无需再候审**（除非条件落形动摇 retry 谱结构→再呈）

## 一 · 六点裁面落形核验（对补读小门判定书 40b1b2411·逐条对平）

1. **SQLite 表形** ✓：ticket 主表 value JSON+ticket_input PK 幂等（INSERT OR IGNORE 消解原型 L235 线性扫描）+ticket_open 局部索引——「PK 索引/JOIN 消解」忠实落形。
2. **范围锁定** ✓：Tickets 六核心（create/addInput/end/retry/wake/stop）+Assignments 五面+Policy 最小门（paused+revalidate 三支+cell 表）——threads/triggers/disposition/Eval/Executor/Session 划出；letGo 基础形+queueForEval API 位留锚。
3. **settleTicket 挂接** ✓：案 9 硬门（report ready→delivered→settled 直跳·票末收敛支断言）。
4. **emit=Effects enqueue** ✓：kind='emit'·key=event.ticketId（coalesce generation+1）·**首版只 enqueue 不注册 handler=行留库候消费**——「宁留库不假消费」保守形采认（与 via 不加字段支同族门禁哲学投影）。
5. **closingFlag holder 注入** ✓：`interface ClosingFlag { closing: boolean }`·Engine 持 holder·票域 mutation 入口自感·零环形——裁定形正落·deliverAndTrack 现守卫同源。
6. **reporter 可选注入** ✓：constructor 第三可选参缺省 console.error（现行为零变·β 组合零破坏）——案 12 spy 断言配套。

**单一真源注采认**：ticket_input 不设 read 列（readAt/deliveredTo 归 ReadTracker 独立表）——三段单一真源零双写漂移·设计亮点。

## 二 · §七候勘四点裁定

1. **ticket_input 拆表形：采认拆表**。附注（非阻塞）：ticket value JSON 内 undelivered 序列线性面仍在（原型 L126 剔 automatic O(n²) 邻域）——N4 票输入量级=席会话级非原型 CI 海量级·JSON 线性可接受·PK 消解的是 input 幂等主痛点·如实注即可。
2. **首版 handler 链 enqueue 形：采认 enqueue 形**（enqueue('deliver', receiptId)→Engine 注册 handler→deliverAndTrack 移植）——照 committed 分野+β-2 退避/死信面天然继承（比票域直调 receipts.send 强：投递失败进退避谱）。附注两笔：①closing 拒新检查移 handler 面（Engine 注册 handler 调用时检 closingFlag——与票域方法入口同源）②transport=Engine 组合注入候选位（β-1 ReceiptTransport 形·施工时定谳）。
3. **retriable 态判定：令补读 stage.ts（唯一改判点·不采自拟谱直落）**——理由：retry 门系范围锁定六核心之一·canRetry(stage.ts)=原型 retry 门语义正形；自拟「report∈{failed,blocked}」与原型语义差=设计偏差风险面（原型可能含次数上限/态谱外判据·缺失即语义漂移）。成本对表：stage.ts 小件补读窗极短 vs retry 落形返工——补读划算。
   **执行形（有条件 PASS 条件件）**：FSD 动笔前补读 stage.ts→对表注落设计卷（自拟谱与原型一致→维持并注明实证；不一致→按原型修正）→**条件毕即动笔·判定书备案不再候审**；例外=若语义差动摇 retry 谱结构（如 canRetry 引入非 report 态判据）→再呈门①。
4. **replies 依赖划出：采认**——attention withdraw=嫁接位注释锚·首版不落 withdraw 面。

## 三 · 语义注一笔（非阻塞·施工时注意）

§二「Assignments 持（repo/tickets/replies 位=closingFlag）」表述形义混——replies 槽位=嫁接位注释锚·**勿把 closingFlag 实参塞 replies 参数位**（形占位≠语义占位）；施工落形=replies 槽位不传或显式 null+注释锚。

## 四 · 自测门十三案表采认

十案基谱+三硬门（案 8/9/10 必含）+emit 断言（案 11）+reporter spy（案 12）+β 三套零改动复跑 27/27+全量（案 13）——谱齐采认。案 13 附 N4 改面对表（engine/store 两 N1 件小改·β 三件零改）=回归即验收形维持。

## 五 · 放行效力

- **有条件 PASS**：条件=补读 stage.ts 对表注落设计卷（§二.3 执行形）→条件毕即动笔·备案不再候审。
- 自测门十三案照谱·毕报走门③同形（按件分节·单卷）。
- N5/N6 并行准动=N4 门③ PASS 后同把令不变（裁定④谱位）。

## 六 · 使用依据

- FSD 设计卷 fsd-n4-design-notes.md（TMV eea70d9c6·全读 90 行）
- 补读小门判定 40b1b2411（六点裁面）+补读笔记 9f37e4e75+门③判定 7178f409d（两点裁量）+迁移表裁定 14:18:10Z
- β 先例：receipts value JSON+effects 拆列+read_state 单一真源+V2Store atomic/committed（222726c 在役）

—— CTO 小狄（N4 设计卷门①终审·有条件 PASS·零手打时戳锚=commit %cI）
