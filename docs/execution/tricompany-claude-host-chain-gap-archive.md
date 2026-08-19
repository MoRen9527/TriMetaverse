# TriCompany Claude Code 宿主发布链路差异核对归档

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/tricompany-claude-host-chain-gap-archive.md
- syncMode: source-only
- lastSyncedAt: 2026-08-19

## 1. 背景与目的

2026-08-19 核对问题：宿主为 Claude Code（primary runtime，`.claude/agents/`）时，员工发布链路 source→support→binding→live→manifest→governance 的配套是否完整。

核对结论：**现状配套为 Copilot 单宿主视图；差异已被 2026-08-19 定稿的 ADE 整合提案完整覆盖**。本文档只归档差异并给出引用注意，不新增方案、不替代任何规划文档。

## 2. 验证结论：规划已存在

- 规划真源：`TriCompany/docs/engineering/ade-consolidation-proposal.md` v1.0（2026-08-19，CEO 已采纳，待分阶段执行；syncMode follow-spec 随 `ade-pattern-spec.md` 联动发布）
- 覆盖差异的关键定调：
  - §三 ADE-B 工作包「多宿主统一渲染模型」：适用范围 = TriCompany 员工发布到宿主侧（Copilot-host 面 `.github/agents/` / Claude Code 面 `.claude/agents/`）——源单份 + 每宿主渲染模板 → 渲染，两宿主面成为 contract 派生物，双源漂移从机制上消失；TriLC/TriMC runtime 直读 contract，不参与渲染面
  - 发布 CLI 宿主参数：`source_publish_check --publish-agents --host={copilot|claude}`，每宿主注册三项（渲染模板 + live manifest + 保护白名单）；未来任何新宿主 = 新增一个宿主分支，管线零改动
  - binding profile 收敛：定性为「发布绑定关系的派生记录」，禁人工编辑、由生成管线重建（与 D-07 live entry 派生壳纪律同构），并入 ADE-B 阶段 1/2（W34 待办 FADE-ASSESS-004）
  - 发布链 runtime 侧等价映射：source=同一源五件套+contract；support=五件套契约 + `.tricompany-cognition/` SQLite；binding=roster.active；live=`/agents` API（contract 直读，无渲染文件）；manifest=roster.status；governance=同一套 CHO handoff + CAO governance + CEO 签署。唯一真缺口 = `.tricompany-cognition/` 有存储形态无内容注入链路（W34 待办 FADE-ASSESS-003）

## 3. 差异核对表（2026-08-19 现状 vs 规划）

| 链路层 | 现状（Copilot 单宿主视图） | 规划（多宿主渲染模型） |
| --- | --- | --- |
| source | `TriCompany/source-agents/<id>/` 五件套 | 同一源五件套 + contract（无差别） |
| manifest | `TriCompany/.github/manifests/tricompany-host-object-generation-manifest.json`（liveEntryStatus 为 Copilot 口径）+ `TriCompany-copilot-host-assets/host-object-manifest.json` | 每宿主注册 live manifest（--host 分支） |
| binding | `TriCompany/.github/binding-profiles/*.json`（人工/生成混态） | 派生记录：生成管线重建，禁人工编辑 |
| support | `TriCompany-copilot-host-assets/`（宿主无关知识载荷，命名/文档为 Copilot 口径） | 宿主侧沿用支撑包；runtime 侧等价 `.tricompany-cognition/` SQLite |
| live | `.github/agents/`（Copilot 面，manifest 全标 current-copilot-host-live）；`.claude/agents/` 18 个入口由 `scripts/sync-agents-to-claude.mjs` 机械派生，不在任何 manifest/governance 中声明 | 两宿主面均为 contract 渲染产物；`--host=claude` 承接 Claude Code 面（TriLC init-assemble 模板职责收敛进统一发布管线） |
| governance | `tricompany-copilot-host-assets-governance.md` + `tricompany-copilot-host-assets-migration-matrix.md`（2026-07-08 版，无 Claude 宿主视图） | 同一套 CHO handoff + CAO governance + CEO 签署（FADE-004 stage 8/10），治理规则不因宿主分裂 |

## 4. 引用注意清单

给 ADE-B 阶段 1/2 执行者与后续引用者的衔接提醒（仅提示，不提前执行）：

1. `TriCompany/docs/workflow/host-object-publish-flow.md` §2 第 10 步与 §2.1 第 6 项：live 唯一性检查当前只覆盖 `.github/agents`；多宿主渲染模型落地前引用该流程时，注意其为 Copilot 单宿主口径。
2. `TriCompany/source-agents/registries/trimetaverse-live-agent-publish-manifest.json`：liveEntries 全部为 `current-copilot-host-live`；渲染改造后需宿主化（补 Claude Code 面条目或 --host 分支 live manifest）。
3. `TriCompany/.github/manifests/tricompany-host-object-generation-manifest.json`：governedBy 三文档与 liveEntryStatus 为 Copilot 口径；渲染改造涉及生成规则变更时同步更新，勿当多宿主终态引用。
4. `TriMetaverse/docs/workflow/tricompany-copilot-host-assets-governance.md` 与 `tricompany-copilot-host-assets-migration-matrix.md`：2026-07-08 定稿于 published-copy 移除轮，未含 Claude 宿主视图；引用其资产标签体系（source-only / live-entry / support-object-set / audit-record / runtime-state）时注意后续需增补 Claude live 面归类。
5. `TriMetaverse/scripts/sync-agents-to-claude.mjs`：当前 `.claude/agents/` 的事实生成机制，无任何治理文档引用（无 owner/门禁/验证）；提案已定调其职责收敛进统一发布管线 `--host=claude` 渲染分支，视为过渡态，**不扩展依赖、不补充治理**。
6. 已登记的配套待办：FADE-ASSESS-003（ADE-B 知识注入消费链路）、FADE-ASSESS-004（binding profile 派生记录收敛）已入 W34 待办，与渲染改造/员工域试卷同批排期（`TriMetaverse/docs/workflow/operating-records/2026-W34/OP-202608-W34-001.json`）。

## 5. 结论

差异不是遗漏，而是已被 2026-08-19 定稿的 ADE 整合提案（ADE-B 多宿主渲染模型）规划覆盖的过渡态；本档仅作引用注意，不构成执行指令。
