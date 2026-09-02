# LG-026 业务组长岗 CTO 席技术联审意见（D-15 首例）

- sourceOfTruth: TriMetaverse/docs/execution/lg026-cto-joint-review-opinion.md
- syncMode: source-only
- lastSyncedAt: 2026-09-02
- 性质：LG-026 联审会（COS 主持 + CTO + CPO）CTO 席技术意见；业务条归 CPO 席，本件不含；候 BOD 裁后实施，本席只读联审不实施
- 证据基准：TriRLC（原 TriLC，2026-09-01 改名）源码定点行号 + TriMMC 服务器侧 + `docs/execution/trimlc-channel-daemon-spec.md`（下称通道 spec）

## ① 组长会话形态：事件驱动唤醒——可行，底座现成

**结论**：BOD 建议的「daemon 守候 + 来件即醒 + 办完即眠」不是新架构，是 TriRLC 已有能力面的组装，且是代码既有形态非新造。

要点：

- **唤醒机制现成**：`TriLCHeartbeatWake`（`TriRLC/src/heartbeat/heartbeat-wake.ts`）——`setWakeHandler` + `requestHeartbeatNow`，250ms 合并窗（:83），四级优先抢占 retry(0)＜interval(1)＜default(2)＜action(3)（:47-52），retry 冷却 1s，`timer.unref()` 不阻进程退出，generation guard 防陈旧清理。ConnectionManager 健康检查环已是它的第一个消费者（`app.ts` ConnectionManager.startHealthCheckLoop，960-1058 段）——「来件即醒」=注册第二个 wake handler，先例在库。
- **新机制最小集：既不需要 inotify 也不需要新轮询**。触发源是 HTTP 入口而非文件变化，inotify 明确不取（Windows ReadDirectoryChangesW 复杂度不值）；本地寄信走 127.0.0.1 端点入信箱后**同进程函数调用** `requestHeartbeatNow({reason:'action'})`，零新机制。唯一轮询点=服务器侧托管件拉取，挂现有心跳循环（见④），不新增调度器。
- **「办完即眠」现成**：heartbeat-runner（`heartbeat-runner.ts:13-29`）→ `runHeartbeatAgent`（`agent-runner.ts`）→ in-process `agentLoop`（`@tricompany/agent-core`）单 turn → 落 session-store → 自然眠。组长 = heartbeat-runner 注册表中一个受控 agent 项，状态全在 SQLite（信件 DB + 台账），会话无永续上下文——与 BOD「状态在信件 DB 与台账不吃对话上下文」逐字吻合。
- 「定时检查推送/提醒」由现役 cron 面承载（`app.ts:3936-4119` jobs CRUD + run + log + status），不新建。

## ② 宿主能力解锁：解锁「注册制组长资格」，HTTP 宿主 501 不动

**结论**：按 LG-020 治理三件套出方案，但解锁对象要立法写准——是「组长 in-process agent 资格（注册制）」，不是 HTTP agent 宿主路由。

要点：

- **现态如实**：501 闸只封 3 条 HTTP 路由（`app.ts:2389-2395`：POST `/v1/messages`、`/internal/v1/agent`、`/chat/completions`，`channelMode` 读 `TRILC_CHANNEL_MODE` 于 ：1643）；**in-process agent 能力未被封**——heartbeat agent 已在跑（`DEFAULT_HEARTBEAT_AGENT`，`app.ts:4382`）。即：LG-020 立法封的是「对外 agent 宿主服务面」，不是「daemon 进程内受控 agent」。
- **工具白名单**：组长 agentLoop 工具集裁剪至 信件 CRUD + SendMessage（daemon 面语义=写信端点+SSE 直推，非 CC harness 工具直通；工具集由 registerTool 裁定）+ 台账读。ALLOW/DENY 规则机制现成（`app.ts:1545-1547` TRILC_ALLOW_RULES/DENY_RULES/ADD_DIRS）。
- **目录约束**：`HeartbeatAgentConfig.cwd` per-agent 字段现成（REQ-014b 基准），组长 cwd 钉死通道实例 DATA_DIR（`%LOCALAPPDATA%/trilc-channel/`），不指主仓。
- **凭证边界**：`X-Internal-Token`（`TRIMC_INTERNAL_TOKEN`）只注入 daemon 出站层（`app.ts:1143-1147`），组长 agent 上下文不持 repo 凭证、不持 git 身份、不持 TriMC token。
- **立法落点**：通道 spec §8.2 已定性「无人值守 agent 须 job 白名单/目录约束/凭据面立法先行」——本案出「组长岗位解锁附则」挂 LG-020 三件套，注册制（白名单式单 agent 注册），不开通用 agent 入口。

## ③ 信封 schema：SQLite 单库分表，seq 全局单调

**结论**：信件 DB=SQLite（`node:sqlite DatabaseSync`，Node 22 内建），仓内两先例同款（session-store `store.ts:1-16`、event-queue `store.ts`），不引新依赖。JSONL 不取（无索引、无事务、并发追加易损）。

要点：

- **信件表** `letters`：`letter_id PK / seq_no / from / to / priority / status / created_at / delivered_at / read_at / escalated_at / payload / ttl / retries / last_error`。状态机 `待投 pending → 已投 delivered → 已读 read → 已升级 escalated →（办结 done）`。retries/last_error/status 生命周期直接复用 event-queue DDL 先例（CTO-008-M §3.2.3）。
- **信件 DB 与台账关系**：分表。台账=执行结果账（组长办件记录），`ledger` 表以 `letter_id` 外键关联，一信可多台账行（收办流水）；台账读在组长工具白名单内。
- **并发**：DatabaseSync 单进程同步写，daemon 单进程天然串行，无锁竞争。**唯一 schema 级新要求**：event-queue 的 seq_no 是 per-connection 单调（`types.ts:9`），信件 seq 须升为 **daemon 级全局单调**，供④ fallback 冲突仲裁。
- 托管同步状态机先例照抄：sync-engine 已有 `local→pending→syncing→synced/error` 门禁 + 409 去重 + 1s/2s/4s 退避（`sync-engine.ts` 头注），信件同步面同型。

## ④ 推送三级 + 双 daemon fallback 拓扑

**结论**：三级推送全部有现成底座；fallback 走 TriMC 侧中转，双 daemon 互不直连。

要点（推送三级）：

- **L1 在线席直推**：真推通道现成 = `/internal/v1/sessions/:id/stream` SSE（`app.ts:3376`）。在线判定=目标 session SSE 连接在 daemon 内存注册表存活。组长办完→落库→SSE 下行即达；SendMessage 工具语义=写信+若目标席在线则同帧直推。
- **L2 离线托管+上线即报**：离线判定=SSE 不在注册表→落库托管；「上线即报」通道 spec §二.3 已立法（会话可关，重开连 daemon 拉 7×24 积压），重连重放语义现成。
- **L3 急件升级**：`priority`+`escalated_at` 状态流转；唤醒侧 wake `reason:'action'` 为最高优先级抢占（wake 模块现成），急件即醒不被合并窗拖延。

要点（fallback 拓扑，v1 本地主+服务器副本非双活）：

- **通道选型：走 TriMC 侧中转，8711/8713/TriMC 三者取 TriMC**。理由：NAT 现实（通道 spec §三.2 本地 listener 绑 127.0.0.1 禁外部入站），本地双 daemon HTTP 互连会引入本地进程耦合且无必要；服务器侧承接面已实证——TriMMC `/internal/v1/heartbeat` 在位（`TriMMC/src/server/app.ts:537-539`），events/replay、tasks/result 同文件在位。托管同步=双 daemon 各自外拨 TriMC 信件端点，`since_seq` 增量。
- **心跳与转正阈值**：现业务心跳 profile 为 30min（production）/5min（development，`trilc-profile.ts:37/49`），作存活判定太粗。**leader 心跳单列 30s 专用通道**（携 nodeId+lastSeq），阈值 3 次缺席≈90s 判缺席→服务器副本转正（只读副本→可派送）。业务心跳照旧不动。
- **冲突以最新 seq 为准**：依赖③全局单调 seq。本地复归→leader 降回，复用 postReplay 仲裁框架（`app.ts:1176` 起，conflicts：rejected_duplicate/version_stale/already_executed/merged）做 seq 对账；转正期服务器副本发出件与本地复归件 seq 高者胜，低者记 conflict 不丢。
- **频率汇总**：leader 心跳 30s（阈值 90s）；托管同步事件触发+5min 兜底；业务心跳/会话收割照现 profile。
- 连接状态机现成可判本地侧健康：connected|degraded|local 三态持久化 `connection-state.json`（0o600，`app.ts:1068-1104`），degraded=TriMC 不可达本地兜底，正好是「本地主降级」的判定原语。

## ⑤ 信件 API 面草案（daemon HTTP 端点最小集）

全挂 `/internal/v1`，X-Internal-Token 门（沿 TriMMC token 先例）；星标=新端点，其余复用不动。

| 端点 | 方法 | 语义 |
| --- | --- | --- |
| /internal/v1/letters ★ | POST | 寄信 → {letter_id, seq_no} |
| /internal/v1/letters?box=&to=&status=&since_seq= ★ | GET | 收信/积压重放（7×24 语义） |
| /internal/v1/letters/{id}/state ★ | POST | 状态流转 {action: deliver/read/escalate/done} |
| /internal/v1/letters/sync ★ | POST | 托管同步 {since_seq}（双 daemon 各调 TriMC 侧增量） |
| /internal/v1/leader/heartbeat ★ | POST | leader 心跳 {nodeId, lastSeq} → {role: leader\|replica} |
| /internal/v1/letters/wake ★ | POST | 组长唤醒触发（127.0.0.1 本地工具/hook 入口，内部转 requestHeartbeatNow） |
| /internal/v1/ledger?since= ★ | GET | 台账读 |
| /internal/v1/cron/jobs（+run/log/status） | 已有 | 定时检查推送/提醒 |
| /internal/v1/sessions/{id}/stream | 已有 | SSE 直推下行 |

## 风险与缓解

1. **条文解释边界**：in-process 组长资格与 LG-020「无 agent 宿主能力」条文的解释需 BOD 明示——缓解：设计方案书载明「解锁对象=注册制组长资格，HTTP 宿主 501 不动」。
2. **真 7×24 缺口**：Windows 睡眠/关机段本地静默（通道 spec §三.1 已入册）——服务器副本转正恰好补此缺口，是 fallback 的存在理由而非缺陷。
3. **前置闸**：8713 SYSTEM 自启悬案未销（通道 spec §8.5.1 验收进行中勿销账）——组长上岗前置=双 daemon ONSTART 自启验收闭环。

## 发布姿态

- 本席只读联审不实施；实施候 BOD 裁。届时开发派 FD、验证测试派 ST（新规程②）。
- 建议实施顺序与门禁：三件套立法附则先行 → 信件 DB schema 定稿 → 唤醒链（信箱→wake→单 turn）→ 推送三级 → fallback 转正/回归演练（含 seq 冲突对账用例）为最终门禁。

## 使用依据

- TriRLC 源码：`src/heartbeat/heartbeat-wake.ts`、`heartbeat-runner.ts`、`agent-runner.ts`、`src/sync/sync-engine.ts`、`src/event-queue/{types,store}.ts`、`src/session-store/store.ts`、`src/config/{trilc-profile,env}.ts`、`src/server/app.ts`（1643 / 2389-2395 / 4382 / 960-1058 / 1068-1104 / 1123-1172 / 1176+ / 1520-1521 / 1545-1547 / 3376 / 3936-4119 定点行）
- TriMMC 服务器侧：`src/server/app.ts:537-539`（heartbeat 承接面实证）
- 通道 spec：`TriMetaverse/docs/execution/trimlc-channel-daemon-spec.md` §二/§三/§五/§8.2/§8.5.1
- 现勘说明：TriRLC 无 CodeGraph 索引（未 init），本次为定点源码阅读；TriMC 侧只证端点在位，未逐行审承接逻辑
