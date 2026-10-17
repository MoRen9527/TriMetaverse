# COS 席 agent-core 迁移评估建议书（治理/流程/流转面）· 2026-10-17

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/lg085-bod-cli-acp-review/cos-agentcore-migration-assessment-20261017.md
- syncMode: static（评审建议稿·初稿 v0.1·候 BOD 工单正身 agentcore-migration-assessment-brief-20261017.md 落盘对表补差后定稿）
- lastSyncedAt: 2026-10-17T10:24:49Z（date 现查·D-47 动态生成）
- 令源: CEO 2026-10-17 18:14 令（BOD 18:20 转派）
- 席位角度: COS=治理/流程/流转面（三问：①流转形态 ②审计留痕 ③定时器域治理条款）
- deadline: 2026-10-18 11:30（周日 12:00 评审并表）

## 结论先行

1. **「运营件归消费侧自持」分层范式不被打乱——前提是迁「harness 载体」而非迁「裸内核」**。agent-core 是 library（`TriCompany/packages/agent-core/`，loop/permissions-engine/scheduler/sub-agent/tools 内核件），它本就被四面消费（MMC=机制面 job 形态·RLC=完整 harness 形态·勘正锚 a8f75cd9d 2026-10-17 CEO 批）。人格类偏运营 agent 迁移的正形=**换常驻 harness 载体**（claude code 交互会话 → dsh/TriRLC 席形常驻会话），不是「迁入 library」——消费侧自持逻辑照旧，变的是具体 harness 与审计面。
2. **技术上可行（信箱件已在位：`TriRLC/src/letter-store/`），治理前提三件先落再迁**：审计等价机制、巡检域双层分工保留、双跑过渡留痕。缺第一件则 D-47 防伪链与 CFO 计量链断源——这两链是现役纪律的取证地基。
3. **巡检/催办定时器域迁移不动机械层**：双层分工（daemon cron 机械拍 + 常驻席会话大脑对拍）中，机械拍在 daemon 侧（8713 TriMLC cron·cos-patrol-timer.mjs）本就不随会话宿主走；只迁大脑侧载体——**唤醒机制换轨**（claude code UserPromptSubmit hook 注入 → agent-core scheduler/heartbeat 驱动 loop），对拍合同文本照守。

## 三问逐答

### ① 迁移后流转面形态

- **不动**：挂账台账/watchlist/journal/operating-records 全是文件面（git 仓内），宿主无关照旧；巡检催办「写序三账同步+锁笔」纪律照守。
- **换轨**：跨席信通道 claude code SendMessage（uds 管道）→ agent-core 生态 letter-store 信箱（今日实证：BOD 销账回执即经 sg 箱 idx 287 流转·「毕报流向盲区」空催案证明信箱拓扑变化直接改变督办可见面——**迁移时信箱拓扑必须进督办面可读范围**，否则流向盲区类空催会批量发生）。
- **换轨**：对拍唤醒机制（上节）。节拍转报（CFO 锚复读/周评审/batch 提醒）同理：cron job 留 daemon，转报消费席换载体。

### ② 审计与留痕影响（session-store vs claude transcript 五差异）

| 维度 | claude code transcript (jsonl) | agent-core session-store (SQLite·`TriRLC/src/session-store/store.ts` 387 行) | 审计影响 |
|---|---|---|---|
| 写入时机 | 逐条实时 append | **agent-loop completion 全量 flush**（store.ts 头注"Auto-save on agent-loop completion"） | loop 中途崩溃→整个 turn 消息可能全丢；中断审计有 gap（status='active' 无 close 检测在，但内容缺失） |
| 计量字段 | 含 usage/token 逐条 | **session_messages 表无 usage 字段**（v2 加的是 cloud sync 字段） | CFO token 实测协议（transcript usage 逐条汇总）断源——**迁移前须补计量字段（schema v3）或旁路计量件** |
| 行为时戳 | hook 事件链现戳（UserPromptSubmit/PostToolUse） | 无 hook 体系（message-guard/permissions-engine 系内核内非外置 hook） | D-47 时点防伪链断源——**需 agent-core 等价机制：信面落款强制现戳注入或 loop 侧声明式时戳锚** |
| 可读性 | jsonl 文本直读（grep/tail 全员可用） | SQLite 需查询工具（node:sqlite/sqlite3 CLI） | 取证工具面收敛到有查询能力席位；但结构化查询（按席/按时窗）更强——中性偏正 |
| 保留策略 | 本地 transcript 长留 | session-reaper cron 有清理机制 | 长周期取证（跨周回溯）依赖 reaper 保留窗口设定——**治理条款须定最低保留期** |

### ③ 督办/巡检定时器域迁移的治理条款清单

照守不动（宿主无关）：D-46 密值纪律、写序三账同步、watchlist schema、禁 observe 误催合同。
需适配换轨：D-47 落款机械合同（hook 现戳→agent-core 现戳等价件）；对拍 prompt 注入形态（hook→scheduler）。
**需新增**：a) session-store 审计条款（flush 时机/计量字段/最低保留期/取证查询口径四件）；b) 信箱拓扑登记条款（督办面可读范围·防流向盲区）；c) 双跑过渡条款（transcript 与 session-store 并行期审计双源对照·迁移席逐席切换逐席验证）。

## 建议形态

分两步走：**第一步（低风险先行）**=人格类偏运营 agent 迁入 agent-core 生态常驻 harness（dsh 席形/TriRLC letter 席形），前提=治理前提三件落位（审计等价机制先行）；**第二步（候验证）**=双跑过渡期后收 claude code 侧常驻位。不建议：裸内核形态（脱离 harness 的 loop 直驱）——那才是打乱「消费侧自持」范式的形态。

## 事实引用索引

- agent-core 内核件清单：`TriCompany/packages/agent-core/src/`（contracts/loop.ts/message-guard/permissions-engine/process-supervisor/scheduler/sub-agent/tools.ts·活体现探 2026-10-17）
- 四面内核同源+MMC 消费形态：勘正 commit a8f75cd9d（2026-10-17 18:20 CEO 批·docs/三元宇宙架构与模块说明.md MMC 行）
- session-store 形态：`TriRLC/src/session-store/store.ts`（DDL 全文·schema v2·flush 时机头注·CTO-009-4 cloud sync）
- letter-store 在位：`TriRLC/src/letter-store/store.ts`
- 巡检定时器双层分工现役实证：`scripts/ops-local/cos-patrol-timer.mjs`（8713 cron·DEM-006 试点·4 催 4 闭环含 1 空催流向盲区案）
- 信箱拓扑督办盲区实锚：BOD 销账回执 2026-10-17 17:11:29（gui-ignite-chief3 毕报 sg 箱 idx 287·空催根因定谳）

## 候条件

- BOD 工单正身（agentcore-migration-assessment-brief-20261017.md）+背景卷（bod-agentcore-vs-claudecode-concept-brief-20261017.md 八节+增补四）落盘后对表补差——本稿基于 BOD 信三问+活体现探独立成稿，两卷到即对（明早 11:30 前）。
- 技术侧裁决归 CTO（harness 形态选型/审计机制实现）；本席仅治理/流程/流转面。
