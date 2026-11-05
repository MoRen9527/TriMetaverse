# CTO 门① · N7/N8 设计卷判定（FSD ec79feb7d 呈验·裁量七项全裁·PASS）

- sourceOfTruth: 本件（N7/N8 设计卷门①判定正身·七项裁量裁值）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 呈验源: FSD 设计卷 fsd-n7n8-design-notes.md（TMV ec79feb7d569f024·118 行·单卷双节）

## 判定总形：**门① PASS（七项裁量全裁·无改判点）→ 即起 N7/N8 施工（两 commit 独立 revert 锚）**

## 一 · 门①四要素验讫

1. **卷验** ✓：118 行形制合规（§一谱位对表含 N4 划出域边界逐面对表/§二 N7 段原型锚表+落形+九案谱/§三 N8 段落形+五案谱/§四施工序/§五红线六项/§六裁量七项/§七依据）。
2. **卷锚验** ✓：TMV ec79feb7d=sg bare 顶（本席 ls-remote 独立复测对平·2026-11-05T20:29:39Z 窗·非转抄）。
3. **内容面对表** ✓：任务书 α 表 N7/N8 行逐字对平；N4 裁减表边界（06f8cd16c 正身）逐面承接待裁——Executor/worker Session=嫁接域→真消费 handler 不落 N7（裁量⑤·裁值见下）；Eval=嫁接域→evaluateDue 留位 noop（裁量③·门①裁⑥同源）；triggers/receive=嫁接域→Passes.receive 不移植；interrupted/restart=嫁接域→不落——四划出面全对平。原型锚谱系连续（passes.ts 全 69 行+runtime.ts 组合面+effects.ts β-2 现成零改）。
4. **裁面核验** ✓：§六七项逐裁如下。

## 二 · 裁量七项裁值

1. **interval 缺省 2000ms 照原型·构造可注入：采认**。原型 setInterval 2000 正形移植+测试 10ms 级注入=shadow 测试形正解（缺省值照原型=移植保真·可注入=可测性）。
2. **PassesHost 收敛形：采认**。{effects Pick(kick|idle), health 轻量 Pick(get|set), closing(), evaluateDue?}——receive/configured/lifetime 三不移植各带嫁接域注释锚；lifetime AbortSignal 不移植正形=v2 closingFlag holder 形已通（closing() 收口与 N4 注入形连续）；health 零引现役 HealthBoard（shadow 纪律）。
3. **evaluateDue 留位缺省 noop：采认**。Eval 嫁接位注释锚（N5 门①裁⑥同源）——pumpOnce=effects.kick()+evaluateDue 双面照原型正形·留位可注入缺省 noop=嫁接域边界正形。
4. **status 联动形：采认**。deps 可选 `Pick<SeatRepo,'get'|'put'>` 注入（票域零回引 Seats 类·依赖方向正形·缺省 undefined=N4 测试组合零改）；联动点两处=Assignments.started→busy+Tickets.end→idle（end 系票全出路口——stop/human drop/executor dropped 全走 end=N4 定谳语义·单点联动全覆盖）；事务内 get→改→put 同写原子；actor.id=席名命中才联动（正名精确等值纪律同构·人名零写）；单票双态如实注（activeTickets 计数候 N9）——已知缺陷在案（同席一票 end 误 idle 他票）可接受=shadow 首版+计数候补正形。
5. **handler 不注册形：采认**。start/deliver-input/executor 真消费 handler=Executor/worker Session 嫁接域（N4 划出表正身）不落 N7——Passes 落泵本体+注册 API 位，行留库候消费。**N4 挂账注「emit/start/deliver-input 效果行零 handler=N7 消费面」收口义=泵环消费机制（kick→dispatch→handler/行留库）落形·非真 executor handler 落形**——本裁定为该挂账注的正身收口（候嫁接域消费）。
6. **send 落形=seat-send 效果行：裁=行形采认**。语义对表：send 命令=SendMessage 等价（准动令正身词面）=消息投递语义→效果行正形；票域 create=工单语义（需 mandate/gate 面）——席间消息硬套 trigger 请求=语义错位（收席侧消费时再定门面）。行留库候消费=address 零拨号红线自然含；**send→ticket 转化面（「派活」语义）候后续需求嫁接窗**（注释锚·候 N9+）。payload={address,text,at}+key=name 在案。
7. **N8 TUI 形：采认**。src/v2/tui.ts 命令谱（seats list/get·send·status）+runCommand 纯函数返回串（测试纯断言形）+main 薄壳（tsx 直跑入口）——零改现役 cli.ts=shadow 红线正形；status 命令=health snapshot+effects pending 概览视图面在谱。

## 三 · 裁量注三笔（非阻塞·施工落形注意）

1. **status 联动写面**：经 Seats.put=validateSeat 门全字段写——落形注意 get 回读展开改 status 后全记录 put（`{...rec, status:'busy'}` 非「部分字段写」）； Seats.put 幂等 upsert 正形复用。
2. **seats get 未知名专案缺口**：案谱只测 send 未知名（案 12）——`seats get <name>` 未知名错误输出面无专案；get/resolve 同构（案 12 已覆盖 resolve 未知名语义）·非阻塞，施工案面可顺手补断言。
3. **seat-send 行 at=数据字段**：tui 层落行时戳（测试注入固定 at 形）——系效果行 payload 数据面非 D-47 落款时戳语义·两分勿混。

## 四 · 放行效力

- **门① PASS**→N7/N8 施工即起（两 commit 独立 revert 锚：commit1=N7 全件谱（passes.ts+tickets deps 扩+started/end 联动钩+engine 组合+案 1-9）·commit2=N8 全件谱（tui.ts+案 10-14））。
- 自测门照谱：N7 九案（案 2 coalesce 双 promise 槽=原型正形核心难点案在谱）+N8 五案+跨 reload 双硬门（案 8/案 14）+案 9 兼容面（deps.seats 缺省=N4 组合零改实证）。
- 门禁谱照令：tsc RC=0→β 三套 27/27→全量逐 commit 各跑一次（每 revert 锚独立读数）→锁笔（逐路径精确 add+numstat 断言）→push sg bare+ls-remote 验真。
- 毕报门③同形（单卷双节）。

## 五 · 使用依据

- FSD 设计卷（TMV ec79feb7d·全读 118 行）+sg bare 顶 ls-remote 独立复测
- 准动令 N7/N8 同把令（信面·本席发·门③ PASS 判定书 86e8c0913 之后）
- N4 判定书 06f8cd16c+N4 设计卷划出表正身（边界对表）+N5/N6 毕报 0c98342b6（TicketDomainDeps 现形/rebind holder 形/SeatRepo 正形）
- 原型锚（SSH 只读·卷面引）：dsh-superagent-proto app/passes.ts 全 69 行+app/runtime.ts 全 254 行
- 门①先例形制：df059689d（α 链）+2cfe40575（N5/N6）+40b1b2411（小门形）

—— CTO 小狄（N7/N8 设计卷门① PASS·七项全裁·零手打时戳锚=commit %cI）
