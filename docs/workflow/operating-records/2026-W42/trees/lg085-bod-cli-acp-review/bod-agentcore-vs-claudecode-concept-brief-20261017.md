# BOD 概念对齐卷 · agent-core daemon 形态 vs claude code runtime vs M 面 13 席 · 2026-10-17

- sourceOfTruth: 本卷（CEO 概念问询答复底稿·真源引注见文末）
- syncMode: static（问询答复留痕·决策输入件候 Sunday 评审并表）
- lastSyncedAt: 2026-10-17T15:20:39+08:00（date 现查·写前跑）
- 问源: CEO 15:16 亲问「R面agent-core是daemon形态具体含义/与claude code runtime及claude -n区别/是否剥离CLI壳的claude code内核/会话历史在哪管/13席支持么」

## 一·daemon 形态=「进程」与「agent 会话」解耦

| 形态 | 进程与会话关系 | 关了界面后 | 进程死了后 |
| --- | --- | --- | --- |
| claude code CLI（claude -n / claude --resume） | **一进程=一会话** | 进程还在跑（tmux 守着时）| agent 死——transcript 是档案非活体，--resume=新进程从档案重建（尸体复活式） |
| agent-core daemon（TriRLC 形） | **daemon 常驻进程，会话=daemon 内托管对象** | 会话在 daemon 里继续存在（历史状态热持），重连即 attach | daemon 停=会话停——所以配看门狗/heartbeat（scheduler+process-supervisor 现成件） |

TriRLC/src 目录实锚：runtime/daemon.ts + session-store/ + task-runtime + server——「detached local runtime」（与会话界面分离的运行时）即 CEO 所述设计意图的正身。

## 二·与 M 面 13 席形态异同（CEO 类比 80% 对·两处校准）

- 同：都达成「界面断了 agent 还在、进程死了能恢复」。
- 异①：M 面 13 席会话引擎=claude code 进程本身，看门狗拉起**新进程从 transcript/CLAUDE.md 重建**；agent-core=daemon 内对象常驻热持，**idle 零 API 成本·有事才推理**（CTO 答卷「免唤醒的正确打开」）。
- 异②：M 面 TriMLC 8713 daemon 只管机制层（cron/信箱）**不管会话**（会话在 tmux 里的 claude 进程，两个世界）；agent-core 形态 daemon 与会话是同一个世界（daemon 托管会话）。

## 三·「剥离 CLI 壳的 claude code 内核么？」——不是 claude code 剥的，是自家 TriMC 剥的

CTO 答卷 10-16 实锚（现探源码）：`@tricompany/agent-core` 0.1.0·4664 行 TS·loop.ts 头注「**Mirror of TriMC's agent-loop/loop.ts, extracted to agent-core for reuse by TriLC**」·依赖 trimodel（TriModel 统一模型层）·**零 claude code/agent-sdk 依赖**。角色定位≈「无头 claude code」，实现全自研，模型后端走 TriModel（可换·与 dsh 化同向）。

| agent-core 件 | ≈ claude code 对应件 | 缺口 |
| --- | --- | --- |
| loop.ts | 主 agent 循环 | 小 |
| tools.ts（118 行） | 内建工具系统+MCP+插件生态 | **大**（通用编码）/可控（判断力场景 6-8 件可枚举） |
| permissions-engine | permission modes/hooks | 小（骨架在规则面补） |
| scheduler+process-supervisor | （claude code 无此件） | ——daemon 底座正是「一直运行」承载 |
| context-builder/prompt-cache | auto-compact/prompt cache | 中（压缩策略自建） |
| sub-agent spawn（188 行） | Task/subagent | 骨架级 |

## 四·会话历史/transcript/用户系统

- 会话历史=TriRLC **session-store**（SQLite·node:sqlite·源码头注实锚）：sessions 表（id/model/system_prompt/cwd/status/云同步字段）+session_messages 表（有序全字段消息·含 reasoning_content）。
- agent-loop 每轮完成**自动整批落库**；中断恢复=检测 status='active' 无 close 事件的会话——「从上一次聊天记录恢复」读的是**自家 SQLite，不是 ~/.claude/projects transcript**。
- 用户系统：**无**——session 表无 user 字段，单租户自用形（TriMem=占位模块）。

## 五·agent-core 启动 13 席支持么

- **机制支持**：会话按 session_id 分区，13 席=13 个 session+13 份 system_prompt（按席注入）+各席 cwd——命名/会话/历史天然分开管。
- **现实差距**（CTO 答卷口径）：工具链缺口大（施工编码面）/技能体系无/长跑成熟度未证；判断力场景工具 6-8 件可控。
- **当下路标**：R 面 13 席现走 dsh（第三方 harness·10-17 接退中）；agent-core 承载=CTO 建议 **P3 勘验窗双案 A**（周-双周级工程量），双案实测读数后裁——非今天切换件。
- 引擎全景：claude code（M 面 13 席+BOD）/dsh（R 面 13 席新装·LG-087 v4）/agent-core（TriRLC 8711 现役底座）三套并存各就其位；接入协议同族（ACP），引擎不同。

## 真源引注

- CTO 答卷：trees/lg085-bod-cli-acp-review/cto-bod-judgment-plugin-agentcore-answer-20261016.md（四面对照表/免唤醒形态/P3 双案）
- 架构真源：docs/三元宇宙架构与模块说明.md §模块表（TriRLC=detached local runtime·RMC/RLC 共用 agent-core·§六师徒总纲）
- dsh 关系：docs/execution/dsh-rplane-harness-design-20261014.md §1.1（机制层/执行层分层·TriMLC+agent-core 对称参照）
- 源码实锚（10-17 15:1x 现探）：TriRLC/src/session-store/store.ts 头注+DDL；TriCompany/packages/agent-core/src/ 目录结构；core-agent/README（归档件·非现役·勿混引）

—— BOD 2026-10-17 15:20:39 +0800（date 现查·发毕重跑对表）
