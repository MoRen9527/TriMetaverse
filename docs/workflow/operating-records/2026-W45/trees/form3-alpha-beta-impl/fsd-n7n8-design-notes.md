# FSD N7/N8 设计卷（形三 α 链收尾·单卷双节·门①同形）

- **seat**：FSD（小全·m-fsd）
- **落款**：卷面时戳=commit %cI（D-47 卷面正形·零手写预填）
- **令源**：CTO 准动令 N7/N8 同把令（形三 α 链收尾两节点·门③ PASS 判定书 86e8c0913 之后）
- **形制**：照 N5/N6 先例——设计卷门①→施工两 commit 独立 revert 锚→毕报门③同形

---

## §一 谱位对表

| 令面 | 谱位正身 | 本卷对应 |
|---|---|---|
| N7=Passes 调度环+status 联动 | effect 行消费面（start/deliver-input/executor/reply）+SeatRecord.status 联动（门①裁⑧收口） | §二 |
| N8=TUI seats+send 命令族 | ListAgents/SendMessage 等价·address 零拨号红线 | §三 |
| N4 裁减表边界对表（06f8cd16c 正身） | Executor/worker Session=嫁接域·emit handler=行留库候消费·interrupted/restart=嫁接域 | §二.2 逐面对表 |
| 门禁谱 | 跨 reload 持久案（status 联动+TUI 效果行双面）+全量逐 commit+β 27/27+tsc RC=0 | §四 |

**N4 划出域边界对表**（fsd-n4-design-notes.md 划出表正身）：
- Executor/worker Session 面=嫁接域→start/deliver-input/executor 行的**真消费 handler 不落 N7**（行留库候消费=N4 现状语义延续）——Passes 落调度环本体+可注入 handler 注册面（reply 已通=N1 落形）。
- Eval/evaluateDue=嫁接域（门①裁⑥）→PassesHost.evaluateDue=留位可注入（缺省 noop·注释锚）。
- triggers/receive 面=嫁接域→Passes 不落 receive（原型 Passes.receive 不移植·注释锚）。
- interrupted/restart=嫁接域→不落。

## §二 N7·Passes 调度环+status 联动

### 2.1 原型锚表（SSH 只读·dsh-superagent-proto）

| 原型锚 | 内容 | v2 落形 |
|---|---|---|
| app/passes.ts L1-69（全 69 行） | Passes 类正形：PassesHost{engine Pick(receive/evaluateDue), effects Pick(kick/idle), health, lifetime: AbortSignal, configured(), closing()}；start=setInterval 2000ms request；stop=清 timer+allSettled(pumping/pumpAgain)；receive=engine.receive+stored→request（**不移植**·triggers 嫁接域）；request=pump+health error→ready 恢复；idle=等 pumping/pumpAgain+effects.idle 循环；pump=并发合并单飞（pumping/pumpAgain 双 promise 槽）；pumpOnce=effects.kick()+engine.evaluateDue() | 正形移植·Host 收敛（见 2.2） |
| app/runtime.ts（组合面） | Passes 组合=`new Passes({engine:{receive,evaluateDue}, effects, health, lifetime, configured, closing})`；handler 注册面=sessions.install()/executor.install()（Executor/worker=嫁接域正身）；初始化序=…→executor.resume()→passes.start()→effects.start() | Engine 不自动 start Passes（组合方显式调）·handler 注册 API 位 |
| effects.ts（β-2 已落） | kick/idle/handle/pending/cancel+dispatch 单飞 | 现成零改 |

### 2.2 v2 落形

**新件 `src/v2/passes.ts`**：
- `PassesHost` 收敛形：`{ effects: Pick<Effects,'kick'|'idle'>, health: HealthEntry, closing(): boolean, evaluateDue?: () => void }`——engine.receive/triggers 不移植（嫁接域）·lifetime AbortSignal 不移植（v2 closingFlag holder 形已通·closing() 收口）·configured 不移植（v2 无 Setup 面·恒可泵）。
- `class Passes`：start(intervalMs=2000)/stop()/request()/pump()/pumpOnce()/idle() 全谱照原型——pumpOnce=effects.kick()+(host.evaluateDue?.() ?? noop 注释锚 Eval 嫁接位)；health 面=轻量 HealthEntry 注入形（`{ get(): {state,detail,at}|undefined; set(entry): void }` Pick 形——零引现役 HealthBoard）。
- interval 可注入（测试面 10ms 级·缺省 2000 照原型）。

**status 联动**（裁⑧收口·落形裁量点④）：
- `TicketDomainDeps` 扩可选面：`seats?: Pick<SeatRepo, 'get' | 'put'>`——票域零回引 Seats 类（Pick 注入形·undefined=零联动=N4 测试组合零改兼容）。
- 联动点两处（**事务内 get→改→put 同事务原子**）：`Assignments.started`（L518 段·票 mandate.actor.id 经 seats.get 命中席→status='busy'）+`Tickets.end`（L360 段·命中席→status='idle'）。
- 映射语义：actor.id 恰好是席名（get 命中）才联动——人名/未知 actor 零写（案 7 零联动断言）。多票并发同席=单票双态首版（activeTickets 计数候 N9·如实注）。
- 联动写经 Seats.put（validateSeat 门+幂等 upsert 正形复用）。

### 2.3 自测门（案 1-9·v2-passes.test.ts+v2-seats.test.ts 扩或独立件）

| 案 | 面 |
|---|---|
| 1 | 泵消费链：Passes.start(10ms)→test kind handler spy→due 行被消费+enqueue→pump 即跑（kick 生效） |
| 2 | coalesce：慢 handler+并发双 pump→pumpOnce 执行数合并（pumping/pumpAgain 槽语义） |
| 3 | health 恢复：handler 败→health error→后续 pump 成功→ready（原型 request 恢复面） |
| 4 | closing 面：closing() true→pump 零跑·stop 后 pump 零跑+idle() 收敛 |
| 5 | status busy：席 actor 票 Assignments.started→seat busy（同事务） |
| 6 | status idle：票 end→seat idle |
| 7 | 零联动：人名 actor（seats.get 未命中）→started/end 零写席 |
| 8 | status 跨 reload（硬门①同族）：busy 写→真重开→busy 仍在 |
| 9 | 兼容面：deps.seats 缺省 undefined→started/end 零害（N4 组合零改） |

## §三 N8·TUI seats+send 命令族

### 3.1 落形

**新件 `src/v2/tui.ts`**（v2 域内命令族·**零改现役 cli.ts**——v2 shadow 零接现役红线）：
- `runCommand(engine: Engine, argv: readonly string[]): string` 纯函数（返回输出串·零 console 副作用=测试纯断言）+`main()` 薄壳（tsx 直跑入口·stateDir 参数+console.log(runCommand(...))·process.exitCode 面）。
- 命令谱：
  - `seats list`——engine.seats.list() 全谱表（name/address/status/host·ORDER BY name 稳定序照语义注③现形）
  - `seats get <name>`——单席四字段（未知名=错误输出）
  - `send <name> <text...>`——engine.seats.resolve（正名精确等值·未知名错误输出零落行）→命中落 **seat-send 效果行**（kind='seat-send'·key=name·payload={address, text, at}）——**零拨号**：无 transport/handler 注册·行留库候消费（传输真连=嫁接域）·落形裁量点⑥
  - `status`——health snapshot+effects pending 概览（视图面）
- 落行 API：Effects.enqueue 直调（Engine.effects 公开已通）。

### 3.2 自测门（案 10-14·v2-tui.test.ts）

| 案 | 面 |
|---|---|
| 10 | seats list：15 席谱输出（计数+首尾谱名断言+稳定序） |
| 11 | send 命中：resolve 命中→seat-send 行落库（kind/key/payload 三断言）+pending true |
| 12 | send 未知名：resolve undefined→错误输出+零行落（pending false） |
| 13 | 零拨号：send 后 handler 未注册行留库+payload 只含 address/text/at（无连接面·结构断言） |
| 14 | seat-send 行跨 reload（硬门①同族）：send→真重开→行 pending 仍在 |

## §四 施工序与门禁

1. **N7 commit**：passes.ts 新建+tickets.ts deps 扩 seats 面+started/end 联动钩+engine.ts 组合（Passes 不自动 start·deps 注入闭包）+测试（案 1-9）→tsc RC=0→β 三套 27/27→全量（commit 锚读数）→锁笔（逐路径精确 add+numstat 断言）→push sg+ls-remote 验真。
2. **N8 commit**：tui.ts 新建+测试（案 10-14）→tsc→β 复跑→全量（commit 锚读数）→锁笔→push 验真。
3. 毕报门③同形（单卷双节）→呈 CTO。

## §五 红线

- v2 shadow 零接现役进程（零改现役 cli.ts/daemon 面）
- β 三件零改动
- TriMMC sg 8712 零触碰
- **address 零拨号**（send 只落行·无 transport/连接面）
- 禁 production-ready 表述
- 全量回归逐 commit 各跑一次（门①裁量注②同形）

## §六 门①裁量点汇总

| # | 点 | 提案 | 候裁 |
|---|---|---|---|
| ① | Passes interval | 缺省 2000ms 照原型·构造可注入（测试 10ms 级） | 缺省值采认 |
| ② | PassesHost 收敛形 | {effects, health, closing, evaluateDue?}——receive/configured/lifetime 不移植（嫁接域·注释锚） | 收敛面采认 |
| ③ | evaluateDue 留位 | host.evaluateDue?: () => void 缺省 noop（Eval 嫁接位注释锚） | 采认 |
| ④ | status 联动形 | deps 可选 Pick<SeatRepo,'get'|'put'> 注入·started→busy/end→idle·actor.id=席名命中才联动·单票双态（计数候 N9）·事务内同写 | 联动语义采认 |
| ⑤ | start/deliver-input/executor handler | 嫁接域不注册=行留库候消费（N4 现状延续·reply 已通）——Passes 只落泵本体+注册 API 位 | 不注册形采认 |
| ⑥ | send 落形 | seat-send 效果行（消息语义·SendMessage 等价）非票域 create（工单语义候后续需求）·key=name·payload={address,text,at} | 行形 vs 票形 |
| ⑦ | N8 TUI 形 | src/v2/tui.ts 命令族（seats list/get·send·status）+runCommand 纯函数返回串+main 薄壳——零改现役 cli.ts | 命令谱采认 |

## §七 依据

- CTO 准动令 N7/N8 同把令（信面·门③ PASS 判定书 86e8c0913）
- N4 判定书 06f8cd16c+N4 设计卷（划出表正身·fsd-n4-design-notes.md）
- 原型补读（SSH 只读）：dsh-superagent-proto app/passes.ts 全 69 行+app/runtime.ts 全 254 行
- N5/N6 毕报 0c98342b6（rebind holder 形/SeatRepo 正形/TicketDomainDeps 现形）
- 方案卷 cto-form3-alpha-beta-plan.md §四 α 表 N7/N8 行+§六跨机边界注
