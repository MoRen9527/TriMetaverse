# FSD N5/N6 毕报（门③同形·单卷双节）

- **seat**：FSD（小全·m-fsd）
- **落款**：写前现查 2026-11-05T19:35:48Z（+08=2026-11-06 03:35:49）·D-47 三轮
- **任务源**：CTO 准动令（同把令·N5/N6 并行）→门① PASS 判定书 2cfe40575（裁量八项全裁·无条件件）→即起施工（D-69 树内顺连）
- **设计卷**：TMV 72edda33b（fsd-n5n6-design-notes.md·单卷双节）·谱位勘正承接 371f66dc3

---

## §一 N5 节·Policy 门族完整谱

### brief

| 项 | 值 |
|---|---|
| 交付锚（commit1） | TriRLC **76c442fa0d03b88f449a1273cda6ed0c31e9a52b**（dev·2026-11-06T03:29:12+08） |
| revert 锚① | `git revert 76c442fa0d`（单 commit 独立锚·五文件 829+/73-） |
| bare 推达 | sg-server dev 顶=76c442fa0d（ls-remote 验真平） |
| 交付面 | policy.ts 全量升形（81→~390 行）+tickets.ts 小改（+policyChanged/openTickets/value 谱）+engine.ts 第一扩（SettingsRepo→Policy+applySettings 原子链）+test/v2-policy.test.ts 新建六案+test/v2-tickets.test.ts 案 7 升形 |
| 类型门 | tsc --noEmit RC=0 |
| 自测 | v2-policy+tickets **18/18 绿** |
| β 复跑 | receipts 9+effects 11+read-tracker 7=**27/27 零改动** |
| 全量（commit1 锚） | **712/712 绿**（141 suites·裁量注逐 commit 读数①） |

### 关键代码路径

- **八裁值落形**（门①判书 §二逐项对表）：①mode 缺省 'off'（DEFAULT_SETTINGS）②STRENGTH 两档零改+ADMISSION_STRENGTH={ignore:0,inferred:1,explicit:2} 分立 ③scope 注入（Engine.open options.scope·缺省 DEFAULT_SCOPE 全收）④gate(trigger, context?{participating}) 调用方算 ⑤POLICY_REVISION='v2-mandate-1' ⑥Eval 评估面划出（settings.eval 只存不消费·候事件源）⑦⑧归 N6/后续。
- **Policy.rebind holder 形**（施工落形勘定·照 closingFlag holder 先例）：票域 deps.policy 注入实例引用——applySettings 若换实例会留旧引用（wake/revalidate 读旧谱组合级 bug）——落 rebind(next, scope)（引用不变·version/paused/mode/settings/scope 内部重绑）；applySettings 事务毕调 rebind·失败回滚零换谱。
- **applySettings 原子链**：`store.atomic(settingsRepo.put + policyEffects(openTickets, old, next, scope) + tickets.policyChanged(version(old), version(next), effects))`→事务毕 rebind→返回逐票效果 Map。
- **policyEffects 三支 diff**（原型 L144-165 正形移植）：rules 面（disabled/changed·JSON 等值判）／sender 丢失面（before 过∧after 拒∧asBefore 同拒→requesterAllowed=false+requester）／proactive 降级面（inferred+old auto→非 auto→proactive=false）·空 effect 不入 Map。
- **policyChanged 消费链**（原型 L200-208 正形）：逐 open 票 oldest first·effect 命中→addInput（id=`policy:${ticketId}:${from}->${to}:${at}`·kind='policy-changed'·automatic=true）→held 让位（waitsForPerson 票入队不投）／pending 非 waits 票→start 效果行。
- **revalidate 完整谱**（原型 L213-240 正形）：scope 失听拒／followup explicit 免·inferred=auto+rulesOn（vacuous true）／bot 表失格拒／admission cell 迁移升格+强度判／listed/addressed 需在册／observation 支（settings mode auto+rulesOn）。

### 自测门（六案谱）

| 案 | 面 | 结果 |
|---|---|---|
| A | 未授权 sender 拒收：名单内 addressed→explicit·名单外 unaddressed→not_a_member·集成链 gate→create 落票 | 绿 |
| B | 变更增量通知：四支 diff（bot 剔除 requesterAllowed×2／mode 降级 proactive／rules disabled）+held 让位零投递+pending start 效果行+同版本对反复 id 含 at 新输入 | 绿 |
| C | policyVersion：32 hex 形·rules/mode/sources 进哈希·paused 不进（原型 L114 正形） | 绿 |
| D | gate 全谱十支：off 拒/auto admission inferred/listed explicit 直过/followup participating/explicit 直过先于 followup/machine bot/senderless/mode off bot→admission_ignored/not_human/scope 拒听 | 绿 |
| E | validateSettings 校验谱七面+SettingsRepo 单行持久读写 | 绿 |
| F | settings 跨 reload 持久（硬门同族）：applySettings→真重开→mode/version 对平 | 绿 |
| 案 7（tickets 件） | revalidate 完整谱升形（三翻转+observe 判据勘正·见实录②③） | 绿 |

---

## §二 N6 节·Seats registry 第六 Pick

### brief

| 项 | 值 |
|---|---|
| 交付锚（commit2） | TriRLC **f143cb72130aa5ade6396c9df5ab5b33313aea2d**（dev·2026-11-06T03:34:53+08） |
| revert 锚② | `git revert f143cb7213`（单 commit 独立锚·三文件 272+/1-） |
| bare 推达 | sg-server dev 顶=f143cb7213（ls-remote 验真平·1a94bad→76c442f→f143cb7 全链） |
| 交付面 | src/v2/seats.ts 新建（135 行）+engine.ts 第二扩（seedSeats→SeatRepo→Seats 组合序+engine.seats 公开）+test/v2-seats.test.ts 新建五案 |
| 类型门 | tsc --noEmit RC=0 |
| 自测 | v2-seats **5/5 绿** |
| β 复跑 | **27/27 零改动**（commit2 态复跑） |
| 全量（commit2 锚） | **717/717 绿**（142 suites=712+5·裁量注逐 commit 读数②） |

### 关键代码路径

- **SeatRecord 四字段**（任务书 α 表 N6 行正身）：{name, address, status:'busy'|'idle', host:HostId}·HostId='dev'|'sg'|'r-hy'（D-24 机位投影）。
- **裁⑦种子谱=15**：source-agents 目录现役实勘（business-strategy/ceo-chief-of-staff/chief-{administrative,financial,human-resources,marketing,operating,product,technology}-officer/customer-success-officer/full-stack-developer/product-manager/rd-trainer/senior-{deployment,test}-engineer）·board/registries 机构面不入谱（案 G 断言计数=15）。
- **name 值域**（门①裁注落形）：source-agents 目录正名 kebab-case（NAME_PATTERN=/^[a-z0-9]+(-[a-z0-9]+)*$/）——工作名/大写别名不采（案 H 三面断言）·别名谱候嫁接需求另立。
- **Seats 类语义分层**：put=登记/更新（validateSeat 校验门·幂等 upsert ON CONFLICT 覆写）·list=列席面（ListAgents 等价·TUI seats 命令族消费位）·get=仓储读·resolve=点名解析（N8 send 消费面入口·正名精确等值·未知名 undefined 由调用方裁决）。
- **种子幂等**（案 K 硬门）：seedSeats=INSERT OR IGNORE 灌 15 席——重开零冲运行时已改记录（status 翻转+host 迁移跨 reload 双断言）·计数恒 15。
- **address 零拨号**：本件只存不连（N8 send 消费面）·status 首版静态（裁⑧候 N7/N8 联动）·权限谱限权视图首版不采。

### 自测门（五案谱）

| 案 | 面 | 结果 |
|---|---|---|
| G | 列席断言：15 席逐席在册+计数=15+全谱 kebab-case 形判+board 不在谱 | 绿 |
| H | 点名解析：resolve 四字段完整回读+未知名 undefined+工作名/大写/大小写变体三面不采 | 绿 |
| I | host 机位断言：dev 种子回读+sg/r-hy put 迁移回读+值域外两形 UserError | 绿 |
| J | put 幂等零重增+status 翻转/回翻+validateSeat 校验谱五面+合形回读 | 绿 |
| K | 跨 reload 持久（硬门同族）：已改两席真重开零冲+计数 15+未改席初值仍在 | 绿 |

---

## §三 施工实录（如实注）

1. **gate explicit 直过无 allowedSender 前置**（案 A/D5 首跑败勘定·测试案面预期修正非实现改）：原型 gate L203 `admission==='explicit'` 直过支无名单前置——admission 缺省谱 unlistedAddressed='explicit'→陌生人 addressed 直过（admission 表 explicit 值本身=授权决定·收紧面=表配置）。拒面落点=unaddressed+inferred 需 mode≠off→not_a_member。N5 完整谱与 N4 最小门的关键语义差（N4 无 admission 直过支）。
2. **L238 判据勘正**（案 7 首跑败勘定）：revalidate observation 支判据=**settings eval.mode**（`mode==='auto' && rulesOn`）——mandate.observation.mode 是票面标记非判据（observation.mode='observe' 票在 settings auto 下仍过）。升形时判据误置已勘正·断言双面补（auto 过+off 拒）。
3. **gateFace 投影 undefined 键**（首跑败）：node loose deepEqual 判键存在性——投影对象 undefined 字段剔除后落形。
4. **rebind holder 形**：门① PASS 后施工中新落形勘定（初拟换实例→票域 deps 旧引用隐患推演捕获）——归 closingFlag holder 同族先例·非谱位变更。
5. **host/address 种子值落形**：设计卷未细裁——落 dev 初值+通信正名初值（纯数据字段·值谱演进归 N8 派工登记面·非架构裁决）。
6. **案 E 归并如实注**：设计卷案 E=revalidate 完整谱——实际落 v2-tickets.test.ts 案 7 升形（同把令对应形）·v2-policy.test.ts 六案实为 A/B/C/D/E(validateSettings)/F·两件合计十一案全绿。

## §四 红线对表

| 红线 | 状态 |
|---|---|
| v2 shadow 零接现役进程 | ✓（engine 只组合根·零 daemon/TUI 挂接） |
| β 三件（receipts/effects/read-tracker）零改动 | ✓（复跑 27/27 两轮零改动实证） |
| TriMMC sg 8712 零触碰 | ✓（全程未出 dev 机代码面） |
| 禁 production-ready 表述 | ✓（shadow 阶段交付） |
| 全量回归逐 commit 各跑一次（门①裁量注） | ✓ commit1 锚 712/712+commit2 锚 717/717·逐锚带读数 |

## §五 next（尽力判断）

- **N7 Passes 调度环**：effect 行消费面（start/deliver-input/executor/reply）+status 联动（裁⑧候 N7）——候 CTO 准动令。
- **N8 TUI 命令面**：seats/send 命令族（ListAgents/SendMessage 等价·seats.list/resolve 消费面已备）——候 CTO 准动令。

## §六 技术债标记单

| 债 | 因 | 偿还计划 |
|---|---|---|
| flake 族两套件（pidfile+init-confirm） | N2 窗在案 | 候 STE 合并勘（既有债·本窗零涉） |
| TriRLC/TMV GitHub 通道未推 | 网络窗 | sg bare 保险线在（双锚推达）·候网络窗补推 |
| Eval 评估面划出 | 门①裁⑥ | 候事件源域（N2/N3 裁定④谱系） |
| status 静态 | 门①裁⑧ | 联动候 N7/N8 |
| threads/participating 嫁接域 | 门①裁④（调用方算） | 候嫁接需求落形 |
| host/address 种子 dev 初值 | 落形选择 §三.5 | N8 派工登记演进 |

## §七 使用依据

- CTO 门① PASS 判定书 TMV 2cfe40575（八裁值+两裁量注）·准动令（同把令信面）·谱位勘正 371f66dc3
- FSD 设计卷 TMV 72edda33b（fsd-n5n6-design-notes.md）
- 原型补读锚（SSH 只读）：dsh-superagent-proto policy.ts L105-242/tickets.ts L195-250/ids.ts key()
- 方案卷 cto-form3-alpha-beta-plan.md（TMV 7ecd788f5）§二/§四/§五/§六
- N4 判定书 TMV 06f8cd16c（裁减表=本窗转正域边界）
