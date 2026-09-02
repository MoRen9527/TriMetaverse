# LG-026 组长形态重审报告（CEO 两项新前提触发，CTO 席如实重析）

- sourceOfTruth: TriMetaverse/docs/execution/lg026-leader-form-re-review.md
- syncMode: source-only
- lastSyncedAt: 2026-09-02
- 性质：CEO 令设计收回重审（两项设计前提错误）；CTO 席技术面重析，如实报不护短；候 BOD 裁；只重审设计不动已交付代码
- 重审公理（CEO 定）：①TriCode 定位=glue 层（驱动/链接 coding agent），非共享信件库——加篇路线 a 撤回；②M/R 通信能力代差——M 面=CC 会话原生跨会话通信，R 面 agent-core 自 CC 移植**无跨会话消息能力**，R 面组长=哑巴会话；M 面正解形态=业务组长为**被 daemon 拉起的独立 CC session**

## 一、公理采纳与自查（如实）

- **公理②源码级实证**：TriRLC `src/tools/send-message.ts:1-6` 头注释自证——「A级直接复制 from CC … **CC 支持 bridge/uds 跨会话 → TriLC 仅支持进程内消息**」。R 面 SendMessage 移植时明确砍掉跨会话通道，组长「转通报」只能进 daemon 进程内——CEO 判断与代码事实完全一致。
- **本席设计盲区自查（不护短）**：联审意见①我将「组长会话」实现为 in-process agentLoop 时，把「会话」降格成了「函数调用」，且把 agent-core（CC 的移植子集）当作 CC 等价物评估组长能力——未质疑移植子集与 CC 全量的能力差。P2 验收亮点「组长被拦后正确推理转通报收 turn」恰是盲区的正面呈现：它通报给了 daemon，而非对话给员工席。§8.6 立法「状态在信件 DB 与台账不吃对话上下文」仍然成立，但「业务组长」的对话本职（与员工席实时沟通）在 in-process 形态下结构性缺失。
- **不受影响的判断**：minTier 双层纵深/严格冻结版/sweeper 升级链/假成功三连显式化等技术判断独立于组长形态，维持有效。

## 二、重审三问结论

### 问 1：TriRLC letters 设施何去何从——**保留且升格为「存储+唤醒基建」**

- 组长变 CC 会话后更需此基建：CC 会话本体易逝（上下文有限、重启丢内存），§8.6 立法「状态在信件 DB 与台账、不吃对话上下文」正是新形态的硬需求——信件 DB=组长的持久状态面，账本不随会话灭。
- 唤醒链语义不变：daemon 守候+来件即醒+办完即眠（§8.6 会话形态条款原样适用），变的只是「办」的执行体（in-process agentLoop → spawn CC session）。
- SSE 直推价值降级如实报：员工席 CC 会话不连 daemon SSE（它们走 CC 原生通信），M 面正解下组长↔员工席对话走 CC 原生通道，SSE 降为终端观测面；代码保留（R 面形态+观测面仍用）。

### 问 2：daemon 拉起独立 CC session 机制草案

- **Spawn**：daemon 经 ProcessSupervisor（`registerShellExecTool`+`getDefaultSupervisor` 先例）spawn `claude -n BL -p --append-system-prompt-file <组长职责文件> --allowedTools <白名单>`；组长职责=现 systemPrompt 文本资产迁移为文件（§8.6 业务规则锚不变）。
- **触发**：wake 链原样（信箱入件→`requestHeartbeatNow({reason:'action'})`）——wake handler 目标从 `runHeartbeatAgent` 换为 `spawnCCLead`（一次投递待办批，办完即眠）。
- **双通道分工（关键设计）**：**信箱 API=任务队列+审计轨迹**（组长 spawn 时待办摘要注入初始 prompt，全文/办结经 letters 端点读写——信件状态机/台账/审计不变）；**CC 原生跨会话消息=组长↔员工席实时对话**（哑巴会话问题的正解通道）。两通道不混用：跨会话对话不留审计，故涉账务的动作一律回写信箱。
- **看护/重生**：进程监督（超时杀/崩溃重启计数/僵尸回收，session-reaper+ProcessSupervisor 先例）；`-p` 输出 JSON 解析→台账回写；Windows 句柄教训（reload 幽灵坑/8713 SYSTEM 悬案）入监督器设计。
- **工具白名单**：`--allowedTools`=信件 API 面（HTTP 工具/自定 MCP）+台账读；§8.6 三件套同构迁移（白名单=CC 工具集裁剪、目录=组长工作目录钉 DATA_DIR、凭据=CC 会话持模型凭据〔必要〕但不持 repo 凭证/git 身份）。
- **立法落点**：§8.7 附则（M 面组长 CC 会话解锁）——LG-020 §8.2 修正理由原文直接适用（「无人值守 agent 须 job 白名单/目录约束/凭据面立法先行」）；501 闸口径重述：daemon 不做 agent 宿主服务面，做的是「进程监督的 CC 会话管理器」（组长本体=CC 进程）。
- **风险如实列**：token 成本（每 spawn 一个全量 CC 会话 vs in-process subagent tier）；时延（CC 启动秒级 vs 毫秒级）；Windows 进程管理面。均以「业务组长对话本职」价值换，候 BOD 权衡。

### 问 3：FD 771 行真实价值重估（如实，不护短）

| 资产 | 处置 | 理由 |
| --- | --- | --- |
| letter-store（store 353 行+types 60） | **保留·升格** | 信箱 API 即新形态组长的读写面，零改动服务 |
| sweeper 升级链（188 行+整改） | **保留** | 业务规则（超时/升级/冻结）与执行体形态无关 |
| letters 端点五件+ACL+限流+契约 | **保留** | 同上，CC 组长经此读写 |
| wake 接线+eventDriven runner | **保留·改造点一处** | 触发面不变；wake handler 目标换 spawnCCLead |
| lead-tools 五工具+minTier（~140 行） | **降级·R 面遗留形态** | in-process 形态专属；M 面组长用 CC 工具面；若 BOD 裁 M 面正解唯一形态则冻结不再演进 |
| permissionRules per-agent 注入（03b660d） | **降级·同上** | CC `--allowedTools` 同构替代；先例价值留 |
| 组长 systemPrompt 段 | **迁移** | 文本资产迁 `--append-system-prompt-file` 职责文件 |

- **如实总评**：771 行中约 85%（数据层+sweeper+端点+wake）在新形态下**保留且地位升格**（从组长的一部分变为组长的基础设施）；约 15%（lead-tools+minTier+permissionRules）降为 R 面遗留形态——非白做（in-process 形态作为轻量降级模式仍可用，且 minTier 跨仓改动对 agent-core 白名单立法有独立价值），但不再是对路径径。**P1-P3 验收结论不推翻**：验收的是「letters 基建+in-process 组长形态」，基建部分全面继承，形态部分按本报告候裁更换。

## 三、加篇勘误（候修）

- 路线 a「letters 抽 TriCode」**撤回**——TriCode=glue 层非共享库，定性错误；加篇 c（转发员）结论在新形态下被「M 面组长本体」自然替代（M 面不需要转发员——M 面直接是组长宿主）；b（cherry-pick）排除结论不变。
- TriCode 正确定性（CEO 定）：驱动/链接 coding agent 的 glue 层——组长 CC 会话若需编程能力，TriCode 是其驱动面而非信件库。

## 四、候 BOD 裁点汇总

1. M 面组长正解形态采纳与否（本报告机制草案为实施蓝本）；
2. R 面组长降级模式去留（轻量降级 vs 冻结归档）；
3. §8.7 附则立法授权（CC 会话解锁+三件套迁移版）；
4. FD 资产处置表照准与否（保留 85%+降级 15%）；
5. P4 fallback 主线与新形态的关系（P4 验的是 letters 基建的 fallback，基建继承后 P4 不返工；组长 spawn 面属 P5 级新线候排期）。
