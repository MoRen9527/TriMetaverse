# 知识注入规范（FADE-ASSESS-003，runtime 侧知识形态与注入链路）

版本：v2.0（2026-08-21 升版）
日期：2026-08-21
状态：当前工程规范（CEO 2026-08-20 启动，MVP APPROVED；2026-08-20 批次 3-2 内容层落地，2026-08-21 升版对齐）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/knowledge-injection-spec.md
- syncMode: source-only
- lastSyncedAt: 2026-08-21

来源：CEO 2026-08-19 定调（FADE-ASSESS-003）+ 2026-08-20 设计定案（CTO 小狄 APPROVE + CPO 小乔语义）
上位规范：[TriCompany ADE 模式规范](../../TriCompany/docs/engineering/ade-pattern-spec.md) + [ade-consolidation-proposal.md](../../TriCompany/docs/engineering/ade-consolidation-proposal.md)（双部署模型：runtime 侧知识形态）

变更记录：

- v2.0（2026-08-21，FADE-LEFTOVER-20260821-001 批 2）：升版对齐已落地实现——knowledge.db v3（layer 枚举扩展 wiki|inbox，契约层三件套 + 内容层两件）、内容层注入链路（wiki 主 / inbox 辅，7 天过滤 + 字段白名单）、注入块 sources 来源标签、内容层从"后置"移入"已落地"；验证基线补批次 3-2
- v1.0（2026-08-20）：立册——MVP（契约层三件套 + boot injection + 消费记录 + 指标）

## 一、问题背景

三端（研发仓/TriLC/TriMC）无知识注入功能：knowledge 资产（TriCompany-copilot-host-assets 知识工作区 + 五件套 layer contracts + wiki 消费记录）"只生成、无消费"。runtime 侧知识载体实证：五件套（静态契约）+ `.tricompany-cognition/`（SQLite 每项目隔离已实现）——缺宿主形态知识工作空间的 runtime 等价物与**内容注入链路**（TRICOMPANY_COGNITION_HOME 在 TriLC/TriMC 源码零使用）。

## 二、语义边界

- **五件套 = layer contracts**（用途/写入边界/落点），非消费记录；消费记录属 wiki 或 runtime cognition state
- runtimeNamespaces（employee/<id> / org/shared / org/audit）与 hermes NamespacePolicy 完全一致
- **org/audit 不注入**（审计是 kernel 写回面非注入面）；org/shared MVP 无内容源（预留）

## 三、runtime 侧知识形态（knowledge.db，现 v3）

`{projectRoot}/.tricompany-cognition/knowledge.db`（multi-project-router 隔离，PRAGMA user_version 迁移 + WAL）：

| 表 | 面 | 关键字段 |
| --- | --- | --- |
| knowledge_documents | 契约层 + 内容层注入面 | namespace / layer（memory\|colleagues\|social\|wiki\|inbox）/ agent_id / content_hash（SHA-256 幂等键）/ source_path / source_mtime；UNIQUE(namespace,layer,agent_id,content_hash) |
| knowledge_consumption | 消费记录面 | namespace / agent_id / content_hash / session_id / injection_mode（boot\|reload）/ consumed_at |
| knowledge_metrics | 验证指标分子面 | escalation_blocked（越权升级）/ routing_error（路由错误） |

**layer 两族（v3）**：契约层（memory / colleagues / social，源自五件套）+ 内容层（wiki / inbox，批次 3-2 落地）——wiki 消费记录为主注入面（每页一文档），inbox 单据为辅（每单据一文档）。

## 四、注入链路

- **写入者**：TriLC `src/knowledge-injector/`（读源→hash→upsert）；启动全量 + watch 增量（agentFilter，Linux 降级为仅启动全量）
- **幂等**：content_hash 唯一键 upsert，hash 相同跳过；hash 变更按 source_path 重写；空文件 → 删除既有行
- **内容层过滤（v3）**：inbox 只取 open 与近 7 天 closed 单据；字段按白名单裁剪（7 字段）后入库
- **安全门**：源只读、dry-run 不建库不写库、项目隔离（跨项目拒绝）；audit 排除
- **supermemory phase-1**：归档为实验证据，不演进生产链路；MetaCognitionKernel 抽象保留作 hermes 全量对接接口

## 五、消费路径（boot injection，非检索）

- 注入块：`<knowledge-context namespace="employee/<id>">` 按 **契约层在前（Memory→Colleagues→Social）、内容层在后（wiki→inbox）** 固定顺序，带 **sources 来源标签**（每段标注来源层与路径）
- 挂接点三处（**注入层不污染身份真源**——getSystemPrompt 保持 soul+agent_body 不变）：① session-initializer 主路径 ② `/agents/{id}/system-prompt` ③ heartbeat 会话
- 每次注入写 knowledge_consumption 一行；无知识/失败降级原 prompt 不阻断

## 六、验证指标（CPO 三条可观测改善的量化面）

| 指标 | 分子埋点 | 分母 |
| --- | --- | --- |
| 越权类升级/路由错误下降 | escalation_blocked（heartbeat tool_blocked 权限/合同类拒绝） | knowledge_consumption 注入成功数 + 会话覆盖 |
| 角色首轮响应即符合口径 | —（消费覆盖素材） | distinctSessions / withSession |
| 协作审批按契约对齐 | routing_error（tasks/submit 409 / spawn 门禁拒 / cron 非在岗 skipped） | 同上 |

可观测端点：`GET /internal/v1/knowledge/metrics`（只读）。

## 七、范围界定

**已落地**：

- MVP（2026-08-20）：knowledge.db 三表 + 启动全量/watch 增量同步 + 三挂接点注入 + 消费记录 + 指标 + 测试（29/29 + 475/474）
- 内容层（2026-08-20 批次 3-2）：knowledge.db v3（layer CHECK 扩展 + 迁移缺陷修复）+ wiki 消费记录（主）+ inbox（辅，open/近 7 天 closed 过滤 + 字段白名单）+ 注入块 sources 标签

**后置**：TriMC 同构（§8.5 parity）、org/shared 内容注入、org/audit 写回面、hermes 全量（recall/consolidate/外部 provider）、主会话越权埋点、heartbeat 注入单测、检索/向量化（体积未到阈值）。

## 八、验证基线

- MVP（2026-08-20）：29/29 新用例 + 475/474（TUI 既有 fail）+ tsc 零错误；小柯独立验证 PASS（9 项）+ 25/25 独立 fixture；真实数据冒烟 11 agent × 3 层 = 33 文档同步
- 内容层批次 3-2（2026-08-20，180cfbf + 4b4d8ba）：v3 迁移与 inbox 过滤用例全绿（周平面 FADE-ASSESS-20260819-003 登记）
