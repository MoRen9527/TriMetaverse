# FSD 嫁接域窗设计卷骨架（四件候令随动版 v0.1）

- **seat**：FSD（小全·m-fsd）
- **写前现查**：date 读数原样粘贴=`2026-11-06T13:45:00Z`（+8=`2026-11-06 21:45 +0800`）——卷面时戳=commit %cI（D-47）
- **令源**：CTO 信（嫁接域窗开·COO 13:41:15Z 知会切流毕·候令先行备骨架·要面=嫁接点语义/契约面/回滚姿态三要素）——**骨架候令·嫁接令未到零施工**
- **现势基座**：α 链 N1-N8 全毕（N7=TriRLC 89a8768879 泵环/N8=c3f76c0156 TUI）·切流 ACCEPT 在卷（cafe1b4·红线三条全绿）·β 27/27·全量 733/733
- **v2 域现势实勘**（本卷备卷时活体勘定）：12 件谱·effects `handle()` API 位存立（同 kind 唯一/retry 退避 A 形/ordered 串行/quiet）·`TicketInputKind` **已含 `'text'`**（转化面落点已铸）·Passes `pumpOnce()` 内 `this.host.evaluateDue?.()` 留位锚（N7 裁③）

---

## §一 四件骨架总览

| # | 件 | 嫁接点 | 契约面 | 回滚姿态 |
|---|---|---|---|---|
| G1 | Executor 真消费 handler | `effects.handle('seat-send', …)` 单点接驳（Engine.open 组合面·现役零改） | payload={address,text,at}·key=seat name（N8 已铸·零变更） | 独立 commit revert 即回（handler 注册行单点拆除） |
| G2 | worker Session | 新件 `src/v2/worker-session.ts`（会话执行面·v2 域内零接现役 daemon） | WorkerSession 接口（spawn/input/output lifecycle）候 CTO 细裁 | 新件独立·revert 删件即回 |
| G3 | evaluateDue 事件源注入 | `this.host.evaluateDue?.()` 现位真注入（Engine 组合面传 Eval 驱动闭包） | 无签名变更（host.evaluateDue 可选位不动）·注入面=Engine 组合参 | 组合参缺省回 noop= revert 单点 |
| G4 | send→ticket 转化面 | seat-send 消费链内转化（G1 handler 内或独立转化函数·候裁） | `TicketInputRecord{kind:'text'}`+ChannelRef{source,thread,address}（tickets.ts 已铸类型面） | 转化函数独立·revert 单点 |

## §二 G1·Executor 真消费 handler（骨架）

- **嫁接点语义**：N8 `send` 命令 enqueue seat-send 行留库候消费（裁⑤正形）——真消费=Engine.open 组合面注册 `effects.handle('seat-send', handler)`，dispatch 循环自动消费（retry/退避/health 面全部白得·β effects 11 案已证）。**现役 cli.ts/daemon 零接**（v2 shadow 红线守恒）——消费端动作形（真拨号到席位 session）候 CTO 裁：候选形 a=写 transport 投递（复用现役 session 面·涉现役接驳=越 v2 shadow 线须 CTO 明裁）·候选形 b=效果行→G4 票转化（v2 域内闭环零拨号·最稳起步形）。
- **门谱草案**：handler 注册后 dispatch 消费案/退避案（run 抛→due 重排）/跨 reload 消费案（行存库重启续消）/零注册回退案（revert 后行留库不消费=现行为不变）。
- **候裁点**：消费端动作形 a/b 选型·ordered 串行 vs 并发（席位投递语义）。

## §三 G2·worker Session（骨架·候裁最重件）

- **嫁接点语义**：R 面席位会话执行面——票 assignment.started 后由 worker session 承接执行（TriRLC 能力族=session reaper/agent loop 现役面）。v2 域内先铸接口壳（`WorkerSession` lifecycle：open/deliver/await/close+状态查询）·真 spawn 面（claude CLI 调用/进程管理）系现役域嫁接=**须 CTO 明裁边界**（现役 daemon 代码零改红线下的接驳形）。
- **门谱草案**：接口壳 lifecycle 案/fake worker 注入案（测试零真拨号）/与 ReadTracker receipts 面联动案。
- **候裁点**：真 spawn 形归属（v2 域内 wrapper vs 现役域接驳）·worker 与票 assignment 的对应粒度（1:1 vs 池化）。

## §四 G3·evaluateDue 事件源注入（骨架）

- **嫁接点语义**：N7 `pumpOnce()` 内 `this.host.evaluateDue?.()` 留位锚（裁③）——真注入=Engine 组合时传 Eval 驱动闭包（票 repo 到期扫描→state 迁移→pass 泵 kick 联动）。签名零变更（PassesHost.evaluateDue 可选位原样）。
- **门谱草案**：到期票扫描案/无到期零害案/闭包抛→泵 health error 恢复案（N7 案 3 已覆盖链路·补注入面集成案）/组合缺省 noop 兼容案（N7 案 9 同族）。
- **候裁点**：扫描频率耦合形（随泵频 vs 独立拍）·Eval 驱动闭包的 deps 注入形（repo 直接引用 vs Port 面）。

## §五 G4·send→ticket 转化面（骨架）

- **嫁接点语义**：seat-send 行→`Tickets.create`/`TicketInputRecord(kind='text')`——类型面已铸（tickets.ts `TicketInputKind` 含 'text'+`ChannelRef{source,thread,address}`）·转化函数纯函数形（payload+seat→TicketInput 映射·零副作用可测）·挂接位候裁（G1 handler 内联 vs Engine 组合面独立步骤）。
- **门谱草案**：映射纯函数案（payload 三键→ChannelRef.address 面）/票创建联动案/缺 ticket deps 降级案（裁⑥组合零改兼容）/幂等案（同 seat-send 行重放零重复建票——key=seat name 的幂等语义候裁）。
- **候裁点**：转化触发面（消费时转化 vs 行留库待转化）·`text` kind 语义确认（send 文本=会话输入 vs 票输入）。

## §六 施工纪律对表（候令展开时适用）

- 红线全谱：v2 shadow 零接现役·零改现役 cli.ts·address 零拨号（G1/G2 真拨号面候 CTO 明裁后才有豁免可能）·β 三件零改动·TriMMC sg 8712 零触碰·禁 production-ready 表述·全量回归逐 commit。
- 回滚锚序：先 N8（c3f76c0156）后 N7（89a8768879）在卷·嫁接件各独立 commit 各自带 revert 面。
- 门禁形：照门③先例（类型门 tsc+新案门+β 复跑零改动+全量锚读数+sg bare 推达验真）·单卷毕报双节形。
- 本骨架=候令随动版——嫁接令到后逐件展开施工细节卷（照 N7/N8 设计卷形制）·令未到零施工零改码。

## §七 依据

- CTO 信（嫁接域窗开·骨架要面三要素）+COO 13:41:15Z 知会（切流毕）+切流 ACCEPT cafe1b4
- N7/N8 毕报（TMV 0159e7e37·§三 next 候裁项四件清单）+门③ PASS 判定书 99bcecec1（语义注⑤件跑 loader）
- v2 域现势活体实勘（12 件谱·effects handle API/tickets 'text' kind/Passes evaluateDue 留位·本卷备卷时勘定）
