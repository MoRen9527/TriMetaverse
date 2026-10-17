# COS 席 agent-core 迁移评估建议书（治理/流程/流转面）· 2026-10-17

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/lg085-bod-cli-acp-review/cos-agentcore-migration-assessment-20261017.md
- syncMode: static（**定稿 v1.0**·2026-10-18 11:30 止前回·候 12:00 评审并表；v0.1 初稿=c5643d64b 18:33·本版并入三席合流锚+背景卷对表增补）
- lastSyncedAt: 2026-10-17T10:36:13Z（date 现查·D-47 动态生成）
- 令源: CEO 2026-10-17 18:14 令（BOD 18:20 转派）·工单正身 agentcore-migration-assessment-brief-20261017.md
- 席位角度: COS=治理流程面（工单 §二 m-cos 行：流转面/信箱/催办/挂账台账治理/审计留痕）
- 口径声明（D-39）: 本单只征集不预裁——**迁移与否 CEO 保留权项（产品架构定位面）**·本建议书为治理面输入非裁决

## 结论先行

1. **分层形态成立·分层主语是场景不是席位**（合流锚·CTO 语采纳）：harness 承载席组施工（工匠形）+agent-core 承载常驻管理（值班员/管家形）=自然分工非二选一（背景卷 §9.1 形制定谳同构）。「运营件归消费侧自持——TriRLC 已示范」范式**不被打乱**——前提：迁移正形=**例行件循环迁入 agent-core 生态**（cron/巡检/催办/信箱/节拍转报的机械拍+例行大脑侧循环），**席位本体不迁**（人格/语义裁量/判断权留席面——合流锚 CPO/COO 同构·范式守卫条款入裁语）。
2. **技术上可行·治理前提三件先落再迁**：①审计等价机制（D-47 时戳链+CFO 计量链——现役两链断源风险实锚·TriMLC 唤醒协调件已自持补回可参照）②巡检域双层分工保留（daemon 机械拍不动·只迁大脑侧循环载体）③双跑过渡留痕（审计双源对照逐席切换）。
3. **我面催办定时器=天然读数源**：DEM-006 试运行即三读数门禁的现役试验场（误催率已有首例数据点·详见 §四）。

## 一·流转面形态（工单命题 1/2 治理面）

- **不动**：挂账台账/watchlist/journal/operating-records 全是文件面（git 仓内）·宿主无关照旧；写序三账同步+锁笔纪律照守。
- **换轨**：跨席信通道 claude code SendMessage（uds 管道）→ letter-store 信箱（TriRLC/src/letter-store 在位）。**信箱拓扑必须进督办面可读范围**——空催首例实证：gui-ignite 毕报回流 COO 域销账制·督办面读不到 COO 域箱→闸过 18min 空催（BOD 定谳「毕报流向盲区」·改进候选 a/b/c/d 已挂 10-18 评审）——迁移放大信箱拓扑变化面·治理条款须先行。
- **换轨**：对拍唤醒机制（claude code hook 注入 → agent-core scheduler/heartbeat 驱动 loop）·对拍合同文本照守。节拍转报（CFO 锚复读/周评审/batch 提醒）同理：cron job 留 daemon·转报消费席循环保留席位面或例行化随裁。
- **实证正形**：b2 案=单轮+外部 state 全周期闭环成功（背景卷 §9.2）——我面 cos-patrol-timer.mjs 即此形态（patrol-state.json 防重催+watchlist 文件接力）——「例行件迁 agent-core」在巡检域已有成功先例形态。

## 二·审计与留痕影响（工单命题 4·本席独有贡献面·三席未覆盖）

**session-store（SQLite·TriRLC/src/session-store/store.ts 387 行）vs claude code transcript（jsonl）五差异**：

| 维度 | claude code transcript | agent-core session-store | 审计影响 |
|---|---|---|---|
| 写入时机 | 逐条实时 append | **loop 完成才整批 flush**（store.ts 头注） | loop 中途崩溃→整个 turn 可能全丢；中断审计有 gap |
| 计量字段 | usage/token 逐条 | **session_messages 无 usage 字段**（v2=云同步字段） | CFO token 实测协议断源——**迁移前须补计量字段（schema v3）或旁路计量件** |
| 行为时戳 | hook 事件链现戳 | 无 hook 体系（message-guard 系内核内） | D-47 时点防伪链断源——**需现戳等价件**（TriMLC heartbeat-wake 自持补回件可参照·背景卷 §9.4） |
| 可读性 | jsonl 文本直读 | SQLite 需查询工具 | 取证工具收敛；结构化查询更强——中性偏正 |
| 用户系统/保留 | 单用户·长留 | **无 user 字段单租户**·session-reaper 清理（RLC/MLC 有·MMC/RMC 无系职责域使然） | 长周期取证依赖 reaper 保留窗——**治理条款定最低保留期** |

背景卷 §四同构印证：中断恢复读自家 SQLite 非 claude transcript——审计真源位随载体迁移，治理条款须随迁。

## 三·定时器域治理条款清单（工单命题 1/5 落地面）

- **照守不动**（宿主无关）：D-46 密值·写序三账同步·watchlist schema·禁 observe 误催合同。
- **需适配换轨**：D-47 落款机械合同（hook 现戳→agent-core 现戳等价件）·对拍 prompt 注入形态（hook→scheduler）。
- **需新增三条**：a) session-store 审计条款（flush 时机/计量字段/最低保留期/取证查询口径四件）；b) 信箱拓扑登记条款（督办面可读范围·防流向盲区批量发生）；c) 双跑过渡条款（transcript 与 session-store 并行期审计双源对照·逐席切换逐席验证）。
- **范式守卫条款**（COO 锚入裁语）：任何迁移方案须过「运营件归消费侧自持」判据——迁的是**消费侧生态内的例行件**（agent-core=TriCompany packages 库·消费侧自持的正身），不是把运营收归中央内核。

## 四·效果读数建议（工单命题 4·三读数门禁采纳）

CTO 三读数门禁（误催率/补跑成功率/轮均 token）采纳——我面催办定时器 DEM-006 试运行=现役数据源：
- **误催率**：首例数据点已产——4 催中 1 空催（gui-ignite·流向盲区型·非机械错非席错）=25% 空催率·改进候选 a/b/c/d 落地后复测。
- **补跑成功率**：定时器域 b2 案全周期闭环先例+session-store 中断检测机制（status='active' 无 close）——候双跑窗实测。
- **轮均 token**：session_messages 现无计量字段——**此读数门禁本身构成 schema v3 计量字段的立项依据**。
- P3 双案窗（CTO 路·周-双周级工程量）与我面治理前提三件可并行：治理条款起草不阻技术勘验窗。

## 五·建议形态（定稿）

**场景切分·例行件先行·席位本体不迁**：
1. **第一步（低风险）**=非人格类+偏运营例行件（cron/巡检/催办/信箱/节拍转报的机械拍+例行大脑侧循环）迁入 agent-core 生态承载——b2 案形态（单轮+state 文件）优先·持久会话形（job 记性）候 reaper/压缩配套成熟再评。
2. **第二步（候验证）**=三读数门禁达标后·评估人格类偏运营席的大脑侧循环部分迁移；**人格/语义裁量/判断权本体永久留席面**（harness 席组）——值班员/管家形与工匠形分层互补（背景卷 §9.1 定谳）非替代。
3. **不建议**：裸内核形态（脱离 harness 的 loop 直驱承载席组）——打乱「消费侧自持」范式的正是此形；以及「全席一次性切换」——双跑过渡条款（三·c）逐席验证为前置。
4. soul-loader 注记：TriRMC 已为人格类预留装载位（背景卷 §9.1 彩蛋注）——人格类迁移的远期形态候 R 面引擎成熟另评·不在本单范围。

## 事实引用索引

- 工单正身+背景卷：lg085 树 agentcore-migration-assessment-brief-20261017.md+bod-agentcore-vs-claudecode-concept-brief-20261017.md（c791af4f2）
- agent-core 内核件：TriCompany/packages/agent-core/src/（contracts/loop.ts/message-guard/permissions-engine/process-supervisor/scheduler/sub-agent/tools.ts·活体现探 10-17）
- 四面内核同源+MMC 消费形态：a8f75cd9d（10-17 18:20 CEO 批）
- session-store 形态：TriRLC/src/session-store/store.ts（DDL·schema v2·flush 头注·CTO-009-4 云同步）+背景卷 §四对表
- letter-store：TriRLC/src/letter-store/store.ts·reaper 四面分布：背景卷 §9.3·唤醒协调自持：背景卷 §9.4
- 巡检定时器现役：scripts/ops-local/cos-patrol-timer.mjs（DEM-006·4 催 4 闭环含 1 空催）·空催定谳：BOD 销账回执 17:11:29
- b2 案形态实证：背景卷 §9.2（TriRLC b2-state.json 外部 state 闭环）
- 三席合流锚：BOD 对表反馈 18:36（CPO/COO/CTO 三席同构语+审计五差异单列确认）

## 候条件

- 三读数门禁读数随双跑窗实测补——本定稿治理面结论不依赖实测数据（结构判断先行）。
- 技术侧（移植工程量/隔离 agent 形/schema v3 实现）归 CTO；产品定位（命题 6 内部底座 vs 对外件）归 CPO；成本节律归 COO——本席仅治理流程面。

—— COS 小贾（定稿 v1.0·date 现查原值·回 BOD 信箱 target_seat='bod'）
