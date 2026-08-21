# 上岗 gating 规范（FADE-ASSESS-20260819-005 工作包 · 并入 FADE-004 员工域，roster.active 运行态门禁）

> **编号勘误（2026-08-21，FADE-LEFTOVER 批 2）**：本规范是 FADE-ASSESS-20260819-005 工作包产物，编号已并入 **FADE-004（员工域 ADE-B）**——登记册（fade-registry.md）无独立 FADE-005 条目，整合提案明确"避免另立 FADE-005"。文件名保留以兼容历史引用（周平面 / commit 记录）。

版本：v1.0（2026-08-20 立册）
日期：2026-08-20
状态：当前工程规范（CEO 2026-08-20 启动，全链 APPROVED）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/fade-005-roster-gating-spec.md
- syncMode: source-only
- lastSyncedAt: 2026-08-20

来源：CEO 2026-08-19 定调（FADE-ASSESS-005）+ 2026-08-20 实现/验证/终审全链
上位规范：[TriCompany ADE 模式规范 §1.1](../../TriCompany/docs/engineering/ade-pattern-spec.md) + [ade-consolidation-proposal.md](../../TriCompany/docs/engineering/ade-consolidation-proposal.md)（ADE-B 员工域）

## 一、语义

- **可见性（信息面）**：`/agents` API 从 contract 全量返回（13 员工 + registry + builtin），**不按 roster 过滤**——默认看到所有 agents（CEO 2026-08-19 确认）。
- **可用性（决策面）**：roster.active 是运行态门禁——在岗 = 可被派工 / 可被 spawn 分身 / 可被调度；未上岗（pending-cho / candidate）只可见不可用。
- 上岗从「状态记录」升级为「功能门禁」。

## 二、三处门禁（单一校验真源：TriLC src/company/staffing.ts）

| 门禁 | 落点 | 非在岗语义 | 兼容性 |
| --- | --- | --- | --- |
| 派工 | `POST /internal/v1/tasks/submit` 可选 `ownerRoleId` | 409 `owner_not_active` + roleId + rosterStatus（session 创建前短路） | 不携带不校验（普通会话向后兼容） |
| 分身 | AgentTool 合同岗 spawn 前置（`setRosterGate` 注入） | 工具错误 `role_not_active`（模型可见） | built-in 4 岗豁免；未注入 gate 放行 + warn |
| 调度 | cron job 可选 `roleId` → `shouldRunJob`（gate 前移含 command job） | `skipped` + 原因 `owner_not_active`（执行日志），不 incrementError | 未绑定 roleId / 未注入校验函数 → 放行 |

错误语义：三处均不静默；`owner_not_active`（HTTP）/ `role_not_active`（工具）/ `skipped+原因`（调度）命名自洽。

## 三、degraded 语义（终审收口 ⑤）

- skipped 计入非 ok 路径：连续 3 次 skipped 会触发 `cron:degraded`（有意设计——连续非在岗应暴露）。
- **恢复仅以真实 ok 为凭**：skipped 不解除 degraded、不广播 `cron:recovered`。

## 四、兼容性口径

- `ownerRoleId` 可选：派发侧（TriPilot / 编排层）携带才触发门禁——派发侧需显式携带（能力面边界）。
- cron `role_id` 列 best-effort migration（同 command 列模式），旧库自动补列。
- 现役 command job 均未绑定 roleId → gate 前移后行为不变。
- 上线即兼容：无 gate 时全放行。

## 五、启用方式

- 派工门禁：派发请求携带 `ownerRoleId` 即启用。
- 调度门禁：cron job 绑定 `roleId` 即启用。

## 六、验证基线（2026-08-20）

- 24 新用例（roster 6 / cron 6 / agent-tool 6 / HTTP 6）+ npm test 452/451（1 fail = TUI 既有 ink 依赖，stash 确认零交集）+ tsc 零错误
- 小柯独立 HTTP 实测（隔离 daemon + curl）：派工 409 三态 / 可见性全量 / cron skipped 端到端 / degraded 三态
- 观察项挂后续：分身 spawn 级端到端、setRosterGate 多实例注入、skipped-degraded 单测固化
