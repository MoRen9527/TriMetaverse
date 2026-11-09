# N5/N6 设计卷（单卷双节·同把令并行形·FSD 席·门①候 CTO 对表裁）

- sourceOfTruth: 本件（N5 Policy 门族完整谱+N6 Seats registry 名址 Pick·开工前设计卷）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形·卷面禁手写预填）
- 令源: N4 门③ PASS 判定书（TMV 06f8cd16c）+准动令（同把令·N5/N6 并行·「开工前设计卷呈门①同形·小门可裁大方向」）+谱位勘正 371f66dc3（初版误书 N6=事件源域系 N2/N3 裁定④嵌值复用错套·任务书 α 表正身=N5 Policy 门族+N6 Seats registry 名址 Pick·本席回执自述=正身零污染）
- 补读: 原型 policy.ts L105-242（嫁接域转正范围·本窗 SSH 补读）+tickets.ts L195-250（policyChanged/addInput 消费面）+ids.ts key() L3-5+研究报告名址段 L18——SSH 只读 cat -n 零写入

## §一 · 谱位与范围对表

任务书 α 表正身（b76dce4e §三）：

| 节点 | 件 | 依赖 | 自测门（任务书正身） |
|---|---|---|---|
| N5 | Policy 门族（gate 强度+basis/mandate revalidate/policyVersion 哈希/sender 名单） | N4（已 PASS） | 未授权 sender 拒收案+policy 变更增量通知案 |
| N6 | Seats registry+名址 Pick（方案卷 §二 第六 Pick·名址面） | N1（已 PASS） | 13 席列席断言+点名解析案+host 机位字段断言（D-24 投影） |

N4 设计卷 §三裁减表划出的嫁接域（gate L191-211/settings schema/policyVersion/policyEffects）=本卷 N5 的转正范围——谱位正身演进（N4 最小门→N5 完整门族），非范围外新增。

## §二 · N5 段：Policy 门族完整谱

### 2.1 原型转正域全读锚（本窗补读·行号直引）

| 原型面 | 锚 | 语义 |
|---|---|---|
| POLICY_REVISION+policyVersion | policy.ts L111-118 | `'mandate-v3'`+`key(REVISION, JSON.stringify({rules, mode, sources}))`——key()=**sha256 前 32 hex**（ids.ts L3-5 实勘·哈希词面成立）；**只授权影响面进哈希：模型/并发/pause/轮询变更不失效既有决定（L114 注）** |
| allowedSender/listedBot | L119-126 | sources[source].allowed / bots 表 sameName 查找；bots 面经 z.array().catch([]) 容错 |
| admissionCell/admissionOf | L135-140 | (allowed,addressed)→cell 四象限（listed+addressed=undefined 直过）；per-source 表覆盖 ?? ADMISSION_DEFAULTS |
| 原型 STRENGTH 三档 | L141 | `{ignore:0, inferred:1, explicit:2}`——表值谱（Admission）三档含 ignore；v2 N4 STRENGTH=授权强度两档（Strength）——**两谱分立非同一表（见 2.2 裁面③）** |
| policyEffects | L144-165 | settings 变更 diff→Map<ticketId, PolicyEffect>：①rules 面（disabled/changed·JSON 等值判）②sender 授权丢失面（before.revalidate∧!after.revalidate 且 old-rules-as-before 仍不过→requesterAllowed=false+requester）③proactive 降级面（inferred+auto→非 auto→proactive=false）；空 effect 不入 |
| machineGate | L171-188 | 非 human：bot 表在→inferred candidate（mode≠off）；senderless 系统事件→scope listened+addressed/observed→unlistedUnaddressed cell 判；其他 bot 拒 not_human |
| gate（human 面） | L191-211 | allowed+addressed→explicit via='addressed'；cell=admissionCell(allowed,addressed)；receivable=addressed∨(listened∧observed)；**explicit 直过先于 followup（L203 注：线程票不把显式请求弱化为 followup）**；followup 支 L206-208（participating+allowed∨mode≠off+非 direct-unlisted 组合）；inferred 需 mode≠off；拒 reason 谱 L210（not_a_member/admission_ignored/no_mention） |
| admitsInferred | L212 | mode=auto∧rules 全 enabled |
| revalidate 完整谱 | L213-240 | N4 三支之外新增：scope 失听拒 L217-218／followup inferred 需 auto+rulesOn L221／bot 表失格拒 L223／admission cell 迁移升格 L229-234（unlistedUnaddressed+现 listed→listedUnaddressed 迁移·listedUnaddressed 失格即拒·强度不降判）／非 bot 非 admission 的 listed/addressed 需 allowedSender 在册 L236／observation 支 L238（mode=auto∧rulesOn） |
| tickets.policyChanged | tickets.ts L200-208 | 逐 open 票 **oldest first**（createdAt 升序=投递按接受序）·effect 命中→addInput({id: key('input', ticketId, 'policy', from, to, at), kind:'policy-changed', from, to, at, effect})——**id 含 at：同版本对反复切换仍记新输入（L205 注）** |
| addInput 尾注 | tickets.ts L230-245 | 「a Policy change alone does not launch it again」L232 注正身=pending 且 launch-failed 的 assignment 只在无人在等时由 addInput 重启——policy-changed 输入走 addInput 同一路径（held 让位语义自然适用：waitsForPerson 票的 policy-changed 入队不投） |

### 2.2 v2 落形与裁面点（门①候裁六点）

**件谱**：`src/v2/policy.ts` 升形（SettingsRepo+Settings 类型+policyVersion+allowedSender/listedBot+admissionCell/admissionOf+ADMISSION_STRENGTH+policyEffects+Policy.build 工厂）+`src/v2/tickets.ts` 小改（TicketInput kind 谱+'policy-changed'+Tickets.policyChanged 方法）+`src/v2/engine.ts` 小改（组合序 SettingsRepo→Policy.build+applySettings API）+`test/v2-policy.test.ts` 新建。**N4 件在 N5 范围内升形=任务书谱位正身**（如实注：N4 测试件案 7 revalidate 谱随升形微调——mode 显式注入案面；β 三件零改面维持不变）。

- **裁面①Settings 最小 schema+持久面**：v2 零 zod 依赖（TriRLC 现役栈对表）——手写类型+轻量校验函数：`Settings{paused; policy:{rules: Rule[]; sources: Record<string, SourcePolicy>}; eval:{mode: AcceptMode}}`；SourcePolicy=`{allowed: AllowedEntry[]; bots?: AllowedEntry[]; admission?: Partial<Record<string, Partial<Record<AdmissionCell, AdmissionStrength>>>>}`；Rule=`{id; name; instruction; enabled}`。持久=**KV 单行表 policy_settings（id='settings'·value JSON）**——applySettings 原子写+重启仍在（硬门①同族案在谱）。原型 ExecutorConfig/timeoutSeconds/SettingsBlock/SettingsOrigin=嫁接域划出（executor/panel 面不采）。
- **裁面②mode 缺省谱+N4 三支升形**：缺省 DEFAULT_SETTINGS `eval.mode='off'`（原型 EvalConfig 默认 off 对表）——N4 恒 auto 谱如实注的补全面：revalidate observation 支升形=`mode==='auto'&&rulesOn`（原型 L238 正形）；N4 案 7 升形=显式注入 mode='auto' 案面（N4 语义「观察票 rules 非空放行」在 auto 下行为不变）。缺省 off=fail-safe 保守（gate 只 explicit 过·admission inferred 拒）。
- **裁面③强度表分立**：原型单表三档混用（Admission ⊇ Strength）——v2 落形**两表分立**：N4 STRENGTH（Strength 两档）不动零改+新增 `ADMISSION_STRENGTH: Record<AdmissionStrength, number>={ignore:0, inferred:1, explicit:2}`（`type AdmissionStrength='ignore'|'inferred'|'explicit'`）——revalidate L234 跨表比数（数值谱 0/1/2 同构）。ADMISSION_DEFAULTS 值类型谱随之放宽（'ignore' 可入配置·缺省表值三格不变）。
- **裁面④scope/followup 投影**：真 sources 面（GitHub/飞书）=DeepSeek 绑定面不采——`ScopeResolver=(source, meta?)=>{listened: boolean; observed?: boolean; row?: string}` **可注入，缺省恒 `{listened:true, observed:true, row:undefined}`**（单机 shadow 全收形）。followup participating 投影：原型 gate 签名 gate(trigger, thread, tickets) 依赖 threads 面——v2 首版 threads 划出嫁接域（N4 同裁）——**gate 签名=`gate(trigger: GateTrigger, context?: {participating?: boolean})`**——participating 由调用方算（channels 面：∃open ticket 该 channel——消费链候 N8 send 集成时落真值），缺省 false=保守（followup 支不过）。如实注：真 thread 订阅谱=嫁接域候。
- **裁面⑤POLICY_REVISION 定值**：v2 谱系独立——定 `'v2-mandate-1'`（原型 'mandate-v3' 系其谱系标识；两库不同源混用会误导哈希谱对表）。哈希实现照原型正形：node:crypto sha256·JSON.stringify(values)·hex slice 0,32。
- **裁面⑥gate 谱裁减**：machineGate+gate human 面+admitsInferred+revalidate 完整谱落形；Eval 谱（assessmentOutcome/DEFAULT_RULES 内容面/RuleMatch 评估转换）=**划出候事件源嫁接**（方案卷 §五 诚实边界同源——v2 rules 首版只进 policyVersion 哈希与 rulesOn 判·无评估执行面）——如实注。

**policyEffects→policyChanged 消费链落形**：`Engine.applySettings(next: Settings)`——store.atomic 内：old=settingsRepo.get()??DEFAULT→settingsRepo.put(next)→oldPolicy/newPolicy 双 build→policyEffects(openTickets, old, now) diff→tickets.policyChanged(fromVersion, toVersion, effects) fanout（input 行同事务落库=settings 变更与增量通知原子）。Policy 实例替换=Engine 持引用换新（后续 gate/wake/revalidate 即新谱）。sameName 语义裁量：v2 用 id 精确等值（正名纪律同构·别名不采）——原型 sameName 实现面未深读（如实注候勘）。

### 2.3 N5 自测门案谱（任务书两案+扩四案）

| 案 | 门 |
|---|---|
| A 未授权 sender 拒收（任务书①） | 名单外 human addressed→gate 拒 not_a_member；名单内 addressed→explicit via='addressed' 过；集成案：gate 过→tickets.create 落票 |
| B policy 变更增量通知（任务书②） | applySettings 四支 diff（rule disabled/changed/requesterAllowed=false/proactive=false）→票收 policy-changed input（effect 面断言）+waitsForPerson 票入队不投（held）+pending 非 waits 票走 start 效果行 |
| C policyVersion 哈希 | 授权面变更（rules/mode/sources）→version 变；paused 变→version 不变（L114 注锚）+哈希形 32 hex 断言 |
| D gate 全谱 | explicit 直过先于 followup/admission cell 表三格/inferred 需 mode≠off/machine 面 bot 表+senderless+拒 reason 谱三值 |
| E revalidate 完整谱 | N4 三支+scope 失听拒/cell 迁移升格（L229-234）/bot 表失格拒/observation 支（mode 显式 auto） |
| F settings 跨 reload 持久 | applySettings→真重开 Engine→settings 仍在+version 对表（硬门①同族） |

## §三 · N6 段：Seats registry+名址 Pick（第六 Pick）

### 3.1 直答锚与对表面

方案卷 §二直答正身：**seat-registry 席位名址表——13 席名字→地址/通道+状态（busy/idle）+host 机位四字段**；做 Engine 的**第六种 Pick（Seats Pick）**新名址视图；TUI `seats`/`send` 两命令=N8（本卷不涉）。研究报告 L18 对表面：原型名址机制=角色限权 Pick 五种（EngineForSources/MainSession/People/Settings/Executor）+workerSessionId=ticket.id 派生（确定性工单派生·非席位列表）——**无自由名址无列席面**=v2 第六 Pick 补位正形。

### 3.2 v2 落形与裁面点（门①候裁三点）

**件谱**：`src/v2/seats.ts` 新建（SeatRecord/SeatRepo/Seats 类）+`src/v2/engine.ts` 小改（组合序 SeatRepo→Seats·engine.seats 公开）+`test/v2-seats.test.ts` 新建。

- **落形·SeatRecord 四字段**：`{name: string; address: string; status: 'busy'|'idle'; host: HostId}`——`type HostId='dev'|'sg'|'r-hy'`=D-24 机位断言投影（dev=本机／sg=M-SG-ip 新加坡 M 面机／r-hy=R-HY-ip 河源 R 面机——映射注注释带）。表形照票域同构：`seat(name TEXT PK, value JSON)` 单表。
- **裁面⑦status 联动首版静态**：status 首版=可写字段（put upsert 可设）——票域联动（assignment started→busy 等）=候 N7/N8 集成面（自测门三案不打 status 联动）——如实注。
- **落形·第六 Pick**：Seats 类 API=`put(seat)`（幂等 upsert PK）/`list()`（列席·插入序）/`get(name)`/`resolve(name)`（点名解析·命中返 SeatRecord·未知名返 undefined）——Engine 公开 `engine.seats`。权限谱（角色限权 Pick 面）v2 首版不采（单角色调用方——如实注：限权视图候嫁接）。**address 字段=记录面零拨号**（N8 send 效果行消费用·传输真连=现役通道面——红线 v2 shadow 零接现役自然含）。
- **裁面⑧种子谱 13 vs 15 对表**：TriCompany source-agents 实勘（本窗 `ls`）=15 员工目录（business-strategy/ceo-chief-of-staff/CAO/CFO/CHO/CMO/COO/CPO/CTO/CSO/full-stack-developer/product-manager/rd-trainer/senior-deployment-engineer/senior-test-engineer；board+registries 两目录=机构面非员工不在谱）——任务书词面「13 席」系 V1.0 原始班底谱（13=COS/CTO/CAO/CFO/CHO/CMO/COO/CPO/CSO/FSD/SDE/STE/BS·后加 PM/RDT=今 15）。**本席裁量提案：种子谱按 source-agents 现役实勘 15 席**（registry=活体名址非历史班底名址·列席断言按种子清单计数+逐席在册）——13/15 谱位勘定候门①裁。种子注入面=`put` 逐席（fixture 内联·shadow 纪律零读现役文件）——真 staffing 面对接=嫁接域候。

### 3.3 N6 自测门案谱（任务书三案+扩两案）

| 案 | 门 |
|---|---|
| G 列席断言（任务书①） | 种子 15 席逐席在册+list 计数=种子数（谱位勘定随门①裁定值） |
| H 点名解析（任务书②） | resolve 命中返四字段全谱+未知名返 undefined+正名精确等值（别名不采案） |
| I host 机位断言（任务书③） | 种子行 host∈{dev,sg,r-hy} 值域断言+resolve 回读 host 对表（D-24 投影） |
| J put 幂等+status 可写 | 同名 upsert 覆盖+status 翻转读回 |
| K 跨 reload 持久 | 种子落库→真重开→列席仍在（硬门①同族） |

## §四 · 施工序与 revert 锚形

N5/N6 同把令并行——**施工分两 commit（每件独立 revert 锚=方案卷 §五门禁正形）**：commit 1=N5（policy.ts 升形+tickets.ts 小改+engine.ts 第一扩+test/v2-policy.test.ts）；commit 2=N6（seats.ts 新建+engine.ts 第二扩+test/v2-seats.test.ts）。engine.ts 组合序两步扩（SettingsRepo→Policy.build 先·SeatRepo→Seats 后）——两 commit 各自动一次 engine.ts·逐路径精确 add+numstat staged 断言照锁笔纪律。全量回归=两 commit 后 npm test 全绿+β 三套零改动复跑 27/27。

## §五 · 红线对表

v2 shadow 形零接现役进程（seats address 零拨号/gate 零接现役 trigger 面）·β 三件零改动（receipts/effects/read-tracker 不在本卷件谱）·TriMMC sg 8712 零触碰·全程禁 production-ready 表述（新写最小件+实测门放行）。

## §六 · 门①裁量点汇总（候 CTO 裁）

①mode 缺省谱='off'（fail-safe·N4 案 7 升形随）②强度表分立（STRENGTH 零改+ADMISSION_STRENGTH 新表）③scope 缺省全收注入形 ④followup participating 调用方算缺省 false ⑤POLICY_REVISION='v2-mandate-1' ⑥Eval 评估面划出候事件源 ⑦种子谱 15（现役实勘）vs 13（V1.0 班底）——列席断言计数随裁 ⑧status 联动首版静态候 N7/N8。

## §七 · 使用依据

- N4 门③ PASS 判定书（TMV 06f8cd16c）+准动令+谱位勘正（371f66dc3）+N4 设计卷（eea70d9c6）与条件执行注（948171ee0）
- 任务书 b76dce4e §三 α 表+方案卷 7ecd788f5 §二名址直答/§四拆树/§五门禁
- 原型补读（本窗 SSH 只读）：policy.ts L105-242（gate/policyVersion/policyEffects/machineGate/revalidate 完整谱）+tickets.ts L195-250（policyChanged L200-208/addInput L230-245）+ids.ts key() L3-5（sha256 前 32 hex）+src 目录清单（Pick 面无专件——五 Pick=角色视图研究报告 L18 实勘）
- 研究报告 cto-superagent-mechanism-report.md L18 名址段+D-24 机位正名（sg=M-SG-ip/r-hy=R-HY-ip）
- TriCompany source-agents 目录实勘（本窗 ls·15 员工谱）
