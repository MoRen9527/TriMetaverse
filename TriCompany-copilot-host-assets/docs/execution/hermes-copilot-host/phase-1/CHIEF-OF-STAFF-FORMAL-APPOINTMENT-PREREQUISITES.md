# Chief Of Staff Formal Appointment Prerequisites

## 文档同步元信息

- sourceOfTruth: 当前文件（support-only operational asset）
- publishedFrom: 当前文件（support-only runbook）
- syncMode: audit-record
- executionTier: operator-runbook
- updateRule: 任职签发前置条件、证据入口或正式签发包要求变化时更新
- sourceBackfillRule: 若内容沉淀为长期制度或组织规则，再回写 CompanyGovernanceRegistry / workflow 真源；否则不要求同名回源
- lastSyncedAt: 2026-04-28

日期：2026-04-20
状态：候选清单；用于支撑后续 CEO 书面签发，不等于已经签发

## 文档定位

本文用于把“总助正式任职前置条件”整理成单独清单，便于后续签发前核对。

本文服务的是当前本地 Copilot-host 正式接管阶段下的总助正式任职判断，不等于正式宿主切换，不等于 production 级 Hermes 集成完成，也不等于 CPO / CTO 已正式上岗接管。

## 当前硬边界

- 当前 live 口径仍是：本地 Copilot-host 已完成 shadow-test，现进入正式接管；该结论不等于正式宿主切换。
- 当前不把 Copilot-host 本地正式接管写成 `TriMC` 已正式切换。
- 当前不把 Hermes 风格 cognition substrate 写成“production 级 Hermes 已完成”。
- 当前不把 CPO / CTO 待上岗事项写成“已经完成接管”。

## 任职签发前置条件清单

### A. 理解对齐与岗位边界

- [x] CEO 与总助已完成正式能力检验和项目对齐会议。
- [x] 总助当前第一优先级已明确为：先与 CEO 在 TriMetaverse 的整体理解与后续工作上形成稳定对齐。
- [x] 当前四层记忆系统口径已明确为：身份层、阶段记忆层、组织共享层、审计层。
- [x] 耐久记忆升级规则已明确为：先提出写入建议，再由 CEO 明确确认后回填。
- [x] 当前未发现“总助整体理解方向根本错误”的结论。

### B. 宿主资产与文档主档稳定度

- [x] 当前生效总助套件已固定在 `TriMetaverse/.github`。
- [x] 当前 support root 已固定为 `TriCompany-copilot-host-assets`。
- [x] phase-1 takeover checklist 与 validation 文档已形成闭环证据。
- [x] 四层记忆协同系统长期概念文档已独立落档。
- [ ] 如需正式任职签发，需再做一轮针对当前 live 口径的最终读审，确认无边界漂移。

### C. Cognition 与 workflow 验证

- [x] `python -m runtime.cognition.chief_of_staff_bridge_validation` 已通过。
- [x] `python -m runtime.cognition.chief_of_staff_workflow_validation` 已通过。
- [x] 当前已验证 workflow 写回可以落入 private/shared/audit 三类命名空间。
- [x] 当前已验证 repo 主档与 cognition 托管摘录的双向同步策略。
- [ ] 需继续补齐“持续性运行”证据，证明这条链不只是一轮验证可用。

### D. Hermes 风格工程准备度

- [x] 已明确当前吸收的是 Hermes 风格 memory / metacognition 主干，而不是 Hermes 全量产品面。
- [x] 已明确当前只具备 LLM wiki 底座雏形，不宣称完整 LLM wiki 已实现。
- [x] private/shared/audit 命名空间与相关验证基线已经建立。
- [x] 总助专属 LLM wiki 第一优先级 MVP 已形成可验证闭环：专属目录、`inbox/` 投放、`wiki/` 页面生成 / 更新、`audit/` 来源追踪。
- [x] 总助专属 LLM wiki 首版半自动编译链已落地，并已通过独立 validation 命令与真实资料刷新验证。
- [x] 通用 schedule / cron / automation staging 路线已完成首条真实闭环验证：两轮 staged refresh -> promotion -> stable recall checkpoint 已跑通并落档。
- [ ] 在 CPO / CTO 正式上岗前，不把 production 级 Hermes 集成写成已完成事实。

### E. 工作节奏与组织接力

- [x] 已确认 daily communication 与 retrospection 应继续推进。
- [ ] 需要把 daily communication 的最小执行节奏写成稳定工作法。
- [ ] 需要把 retrospection 的最小执行节奏写成稳定工作法。
- [ ] 需要继续准备 CPO / CTO 的正式上岗入口与接管接口。
- [ ] 需要形成更多负责人到岗后的分诊路径草案。

### F. 正式签发包要求

- [ ] 任职候选对象需有明确版本号。
- [ ] 任职候选对象需附书面签发记录。
- [ ] 任职候选对象需生成 `sha256` 指纹侧车文件。
- [ ] 若候选对象内容发生变化，必须升级版本号并重新生成指纹。
- [ ] 未完成 CEO 书面明确同意前，状态只能写成 `draft` 或 `submitted`，不能写成 `approved`。

## 当前判断

- 当前已经具备“可以整理正式任职签发条件”的基础。
- 当前还不适合直接写成“总助已正式任职签发完成”。
- 当前距离正式签发最近的剩余门槛，是持续性 cognition 证据、daily communication / retrospection 稳定化，以及最终书面签发包准备。

## 签发时建议附带的证据入口

- `docs/workflow/operating-records/2026-W17/meeting-2026-04-20-ceo-chief-of-staff-capability-and-alignment.md`
- `docs/engineering/virtual-company-four-layer-memory-collaboration-system.md`
- `docs/execution/hermes-copilot-host/phase-1/CHIEF-OF-STAFF-LLM-WIKI-MVP-VALIDATION.md`
- `docs/execution/hermes-copilot-host/phase-1/CHIEF-OF-STAFF-SCHEDULE-STAGING-VALIDATION.md`
- `docs/execution/hermes-copilot-host/phase-1/CHIEF-OF-STAFF-PHASE-1-TAKEOVER-CHECKLIST.md`
- `docs/execution/hermes-copilot-host/phase-1/CHIEF-OF-STAFF-PHASE-1-TAKEOVER-VALIDATION.md`
- `runtime/cognition/README.md`
- `knowledge/chief-of-staff/wiki/chief-of-staff-llm-wiki-semi-auto-current-state.md`
- `knowledge/chief-of-staff/audit/wiki-refresh-2026-04-20-151649.json`
- `knowledge/chief-of-staff/audit/wiki-promotion-2026-04-20-172505-698372.json`
- `knowledge/chief-of-staff/audit/wiki-promotion-2026-04-20-172505-988181.json`
- `knowledge/chief-of-staff/audit/wiki-recall-checkpoint-2026-04-20-172506-005925.json`

## 下一步建议

1. 继续把总助专属 LLM wiki 的 stable 页面扩到更多主题，而不是只停留在当前状态页。
2. 再把 daily communication 与 retrospection 的最小固定工作法写成正式执行规则。
3. 再准备正式任职候选对象、版本号与指纹侧车文件，等待 CEO 书面签发。
