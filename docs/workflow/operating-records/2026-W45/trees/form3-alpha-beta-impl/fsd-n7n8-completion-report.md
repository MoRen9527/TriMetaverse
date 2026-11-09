# FSD N7/N8 毕报（形三 α 链收尾·单卷双节·门③同形）

- **seat**：FSD（小全·m-fsd）
- **写前现查**：date 读数原样粘贴=`2026-11-06T00:11:25Z`（+8=`2026-11-06 08:11:25 +0800`）——卷面时戳=commit %cI 零手写预填（D-47 卷面正形）
- **令源**：CTO 门① PASS 判定书 TMV c8544a1e7（设计卷 ec79feb7d 七项裁量全裁零改判点）→接令回执→施工即起
- **形制**：照 N5/N6 先例——毕报单卷双节·双交付锚双 revert 锚·红线对表·next·技术债标记单

---

## §一 N7·Passes 调度环+status 联动

### brief/checkpoint

| 项 | 读数 |
|---|---|
| 交付锚 | TriRLC `89a87688799bd7e1b497c8d12b27aee86d7519c7`（dev·2026-11-06T08:02:12+08:00=%cI） |
| revert 锚 | 独立 commit revert 即回（四文件 363+/3-：passes.ts 新/tickets.ts 18+/engine.ts 32+3-/v2-passes.test.ts 新） |
| 类型门 | `npm run check`（tsc --noEmit）RC=0 |
| 自测门 | v2-passes 9/9 绿（fail 0） |
| β 复跑 | 三套 27/27 零改动（receipts 9+effects 11+read-tracker 7） |
| 全量锚读数 | 首跑 725/726（1 败=integration/pidfile-flow flake·归因见实录③）→复跑 **726/726 RC=0**（双读数如实注） |
| bare 推达 | `git push sg-server dev` 89a8768 验真平（ls-remote 顶 hash==commit hash） |
| 红线 | v2 shadow 零接现役✓·β 三件零改动✓·TriMMC sg 8712 零触碰✓·禁 production-ready 表述✓ |

### 落形对表（门①七裁值）

| # | 裁值 | 落形 |
|---|---|---|
| ① | interval 2000 缺省+可注入 | `constructor(host, intervalMs = 2000)`——测试 10ms 级注入 |
| ② | Host 收敛形 | `PassesHost {effects Pick<'kick'\|'idle'>, health, closing, evaluateDue?}`——receive/configured/lifetime 不移植（头注释嫁接域锚·closingFlag holder 收口） |
| ③ | evaluateDue 留位 noop | `pumpOnce()` 内 `this.host.evaluateDue?.()`——Eval 嫁接位注释锚 |
| ④ | status 联动形 | deps 可选 `seats?: Pick<SeatRepo,'get'\|'put'>`+`touchSeat()` 模块级函数（get 回读展开 `{...seat, status}` 全字段写经 validateSeat 门=裁量注①）——started→busy/end→idle 事务内同写 |
| ⑤ | handler 不注册形 | Passes=泵环消费机制本体·Effects.handle API 位存立·start/deliver-input/executor 零注册行留库（N4 挂账收口义=泵环落形非真 executor handler） |
| — | engine 组合 | seatRepo 共享实例+票域 deps 注入+Passes 组合（health holder 注入形+passesHealth() 读面·closingFlag 收口·**engine 不自动 start**） |

### 实录（如实注）

1. **Effects.start() 直组合旗**：案 1/案 3 首轮 handled 空——Effects dispatch 有 `started` 旗（Engine.open 才调 start），直组合测试须显式 `effects.start()`（Engine.open 同构位·已注释锚）。
2. **health 两分**：Passes host.health=泵链 rejection 面（evaluateDue 同步抛触发 error·成功泵 ready 恢复=案 3）；Effects handler 失败走内部退避/health 面——案 3 断言 handler boom 零染泵 health（`state` 保持 ready）。
3. **全量 flake 归因**：首跑唯一败案=`test/integration/pidfile-flow.test.ts`「REQ-018 daemon PID self-registration」suite（duration 19920ms=起真 daemon 进程集成面）——两连单跑一败一绿=flake 实证（在案技术债「flake 族两套件（pidfile+init-confirm）候 STE 合并勘」·N2 窗在案）；与 N7 改面（v2 域四件）零交集·复跑 726/726 RC=0 干净锚。
4. **裁量注①落形**：touchSeat 全字段写（禁部分字段写）·非席名/零 deps/同态幂等零写——案 7 人名零联动+案 9 兼容面双断言。
5. **案 8 硬门**：busy 写→store.close→buildDomain(true) 真重开→busy 仍在+种子幂等零冲（INSERT OR IGNORE 不覆写已改记录）+end 联动照常——status 联动跨 reload 持久闭合（硬门①同族）。

---

## §二 N8·TUI seats+send 命令族

### brief/checkpoint

| 项 | 读数 |
|---|---|
| 交付锚 | TriRLC `c3f76c0156baf2f52258bde992f7dec1ff7fc3ca`（dev·2026-11-06T08:10:59+08:00=%cI） |
| revert 锚 | 独立 commit revert 即回（两文件 237+：tui.ts 新 102 行/v2-tui.test.ts 新 135 行） |
| 类型门 | `npm run check` RC=0 |
| 自测门 | v2-tui 7/7 绿（fail 0·首跑即绿） |
| β 复跑 | 三套 27/27 零改动（独立命令逐套读数：9/9+11/11+7/7） |
| 全量锚读数 | **733/733 RC=0**（726+7 新案·零 flake·单读数干净锚） |
| bare 推达 | `git push sg-server dev` c3f76c0 验真平（ls-remote 顶 hash==commit hash） |
| 红线 | **零改现役 cli.ts**✓·**address 零拨号**（无 transport/handler 注册·行留库候消费）✓·v2 shadow 零接现役✓·β 三件零改动✓·TriMMC sg 8712 零触碰✓·禁 production-ready 表述✓ |

### 落形对表（门①裁值+裁量注三笔）

| 项 | 落形 |
|---|---|
| ⑦ TUI 形 | `runCommand(engine, argv, now?): string` 纯函数（零 console 副作用·请求面错误抛 UserError 照 errors.ts 正形）+`main()` 薄壳（Engine.open→命令→stop finally·直跑守卫 import.meta.url·TRIRLC_V2_STATE_DIR） |
| 命令谱 | seats list（15 席四字段表·ORDER BY name 稳定序=语义注③现形）/seats get <name>（未知名 UserError）/send <name> <text...>（resolve 正名精确等值→seat-send 效果行）/status（passes health+effects snapshot+pending 概览） |
| ⑥ send 行形 | kind='seat-send'·key=name·payload={address,text,at}——**at=数据字段注入形**（runCommand 第三参 now 缺省 Date·测试 fixedNow 固定值=裁量注③·与 D-47 落款时戳两分勿混） |
| 裁量注② | seats get 未知名 UserError+用法面（缺参 usage/text 缺失/未知命令）——案 12b 顺手补断言在谱 |
| 裁⑤续 | 零拨号结构断言=案 13（dispatch 循环沉降后行 pending 仍在+payload 恰三键+`'seat-send' in snapshot()==false` 零 handler 零 health 面） |
| 硬门①同族 | 案 14 跨 reload：send→stop→Engine.open 真重开→行 pending 仍在+payload 原样持久+种子幂等零冲（15 席） |

### 实录（如实注）

1. **案谱微调如实注**：设计卷案 10-14 谱+裁量注②延伸=施工落形七案（案 10/11/12/12b/13/14+案 15 status 冒烟·施工顺手补非门①案谱扩权——照裁量注②「施工顺手补断言」先例）。
2. **案 15 依赖确定性**：status 视图初态两行断言成立前提=Engine.open 无 transport（零 reply handler→snapshot 空）+passes 不自动 start（N7 落形·passesHealth=undefined）——两前提均系在卷裁值非巧合。
3. **tsc 零波折**：N8 窗类型门首跑 RC=0（N7 窗 tsc 超时一次系机器负载窗异常·N8 窗未复现）。
4. **旁路 NOTIFY 三条知情录**（同窗 M-SG NOTIFY·非主线）：①v4.3 复跑回执=知情零行动；②Q2 件② ssh echo-pull ETIMEDOUT=已自停等下节律零倒补；③silent-detect 18710 隧道连败 6 拍=与②同窗 ssh 通道间歇（04:09 push sg bare 曾通）——三者均非本卷阻塞，施工毕照行为维持（详见技术债标记单）。

---

## §三 next（候 CTO 裁量）

- 形三 α 链收尾两节点已毕（N7/N8）——α 链谱面照方案卷 §四 全表对齐；β 链收口面+嫁接域窗（Executor/worker Session handler/Eval evaluateDue 真消费/send→ticket 转化面）候 CTO 裁量下一把令。
- N8 send 效果行现势=行留库候消费（裁⑤正形）——真消费 handler 嫁接窗开时 `effects.handle('seat-send', ...)` 单点接驳即通（payload 契约已铸）。

## §四 技术债标记单

| # | 债 | 候窗 |
|---|---|---|
| 1 | flake 族两套件（integration/pidfile-flow+init-confirm）——本窗又一实证（N7 全量首跑 725/726） | 候 STE 合并勘（N2 窗在案延续） |
| 2 | TriRLC/TMV GitHub HTTPS 通道（N5/N6 窗 Connection was reset 在案） | 候网络窗补推（sg bare 保险线在） |
| 3 | 18710 keeper 隧道探活连败 6 拍（旁路知情录③） | 施工毕后勘（本毕报即毕） |
| 4 | Q2 件② echo-pull ssh ETIMEDOUT 已自停 | 等下节律零倒补 |
| 5 | send→ticket 转化面（裁⑥候后续需求嫁接窗） | 嫁接域窗 |
| 6 | evaluateDue 留位 noop（裁③·Eval 嫁接位） | 候事件源域注入 |
| 7 | 单票双态计数（N7 裁④如实注·activeTickets 候 N9） | 候 N9 |

## §五 依据

- CTO 门① PASS 判定书 TMV c8544a1e7+准动令（信面）
- N7/N8 设计卷 ec79feb7d（本树 fsd-n7n8-design-notes.md·七项裁量+门禁谱）
- N4 判定书 06f8cd16c+划出表（嫁接域边界对表）
- N5/N6 毕报 0c98342b6（门③同形制先例）
- 双交付锚：TriRLC 89a8768879（N7）/c3f76c0156（N8）·sg bare 顶 hash 双验平
