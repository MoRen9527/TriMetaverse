# TriRLC R 侧职责差距清单（quadmig-3 Q3n-2 交付物）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/trirlc-duty-gap-checklist.md
- syncMode: source-only
- lastSyncedAt: 2026-08-24
- 性质：**清单即结论**——按 spec Phase 3 DoD，本清单盘点后即交付；无阻断性大改，各缺口已有归属通道

## 对照基准

白皮书附录 B TriRLC 词条职责面：本地会话持久化、调度、cron、心跳、审计自持；与 TriRMC 共用 agent-core 承接稳定执行/无人值守/权限审计/跨节点协同。

## 现状盘点（证据均为 2026-08 会话在案事实）

| 职责 | 现状 | 判定 |
| --- | --- | --- |
| 本地会话持久化 | session reaper 在役；init-chain 持久状态机（I1）；chatHistory 面 | ✅ 具备 |
| 调度 / cron | minimal cron engine（jobs/degraded 状态机/jobstore 原子写+.bak） | ✅ 具备 |
| 心跳 | heartbeat enabled，POST /internal/v1/heartbeat 增强端点（CTO-008-M） | ✅ 具备（指向见缺口 G3） |
| daemon 自持 | schtasks install/stop/start 权威路径；环境继承兜底（r19） | ✅ 具备 |
| agent loop / 工具面 | HTTP+SSE agent loop（agent-core 共用） | ✅ 具备 |
| 组织面 | staffing.ts RosterGate + 审计 json 先例 | ✅ 具备 |
| 项目面 | project-registry + link/claim（I3）；五维同步生成链（I4） | ✅ 具备 |

## 缺口清单（4 项，均有归属）

| # | 缺口 | 归属通道 |
| --- | --- | --- |
| G1 | **进程监督/watchdog 守护化**未落地（现靠 schtasks 拉起+健康自检主动拉起非服务形态） | 既有后续树挂账（r18 观察项在册），非本迁移新增 |
| G2 | **会话长期运行的 compact 策略**：auto-compact 未移植（创新记录 §1 登记 cc-fidelity 审计线跟踪中）——R 侧自研内核长期无人值守需自有上下文管理 | cc-fidelity 审计线 → 后续树 |
| G3 | **指向切换**：心跳/镜像/events 现指向 TriMC(:8710)，需切 TriRMC(:8712) | quadmig-2 迁移批项 4（协议不变可回切），不属本树 |
| G4 | **多 session 并行对话能力**（claude code Linux 多 session 级）缺失——训练盲区发现线已登记 | 能力差距反向流线（CEO 已批首轮手动盘点） |

## 结论

Phase 3 无阻断项：叙事换轨（Q3n-1 README 锚定注记）+ 本清单即全部交付。G1-G4 全部既有通道消化，不新开树。
