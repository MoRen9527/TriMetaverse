# Chief Of Staff Phase 1 Takeover Checklist

## 文档同步元信息

- sourceOfTruth: 当前文件（support-only operational asset）
- publishedFrom: 当前文件（support-only runbook）
- syncMode: audit-record
- executionTier: operator-runbook
- updateRule: 当前 host 的操作步骤、边界口径或回滚条件变化时更新
- sourceBackfillRule: 若结论沉淀为长期模块规则，再回写 TriCompany/docs 或 workflow 真源；否则不要求同名回源
- lastSyncedAt: 2026-04-28

日期：2026-04-18
状态：已完成本地 Copilot-host 下总助 phase-1 接管收口；本记录用于支撑当前本地正式接管（非正式宿主切换）

## 迁移说明

- 本记录形成时 support root 路径名为 `TriCompany-shadow-host`。
- 自 2026-04-18 起，当前生效目录已迁移为 `TriCompany-copilot-host-assets`。
- 为保留 phase-1 证据链，正文中的旧路径表述不做整体替换。

## 转阶段说明

- 本文保留的是 phase-1 shadow-test 闭环证据，不回写成“当时已经正式接管”。
- 当前 live 口径已升级为：本地 Copilot-host 已完成 shadow-test，现进入正式接管；该结论不等于正式宿主切换。

## 目的

- 用于判断 TriCompany 总助 phase-1 接管资产是否已完成闭环，并据此支撑本地 Copilot-host 的正式接管。
- 本清单只服务 phase-1 shadow-test 闭环与当前本地正式接管，不等于正式宿主切换，不等于 TriMC 承载的后续 MVP 上线。

## 标准表述

- phase-1 历史写法：本地 Copilot-host 下总助 shadow 接管已完成；该结论仅适用于当时的 shadow-test 边界。
- 当前 live 写法：本地 Copilot-host 已完成 shadow-test，现进入正式接管；该结论不等于正式宿主切换。
- 若需补足上下文，可追加：当前生效层位于 TriMetaverse/.github，support root 固定为 TriCompany-shadow-host。
- 避免单独写成：已完成本地 shadow 接管、总助 shadow 完成接管、已完成接管；这些简写如果脱离边界说明，后续容易被误读成正式宿主切换。

## 当前生效路径

- 生效 agent、prompt 与 manifest 位于 TriMetaverse/.github。
- support root 位于 TriMetaverse 根下的 TriCompany-shadow-host。
- support root 指当前生效 shadow-test 资产统一回看的支撑根目录，用于提供 docs、runtime 与 vendor 参考副本真源。
- 验证期间不得回退到 reference/tricompany-shadow-host，也不得把 TriCompany-shadow-host 写成正式宿主根。

## 已完成证据

- TriCompanyProductRegistry、TriCompanyCodeRegistry、TriCompanyCEOChiefOfStaff 三条 smoke test 已确认 support root 稳定指向 TriCompany-shadow-host。
- tricompany-开始会议 与 tricompany-结束会议 两条历史会议入口 smoke test 已通过；2026-04-26 起这两条入口已降级为 archive / rollback reference。
- 已完成一轮完整会议生命周期演练，覆盖开始会议、产品汇报、技术汇报与结束会议收口。
- 已完成 2026-04-18 总助接管验证会读审与场景演练，覆盖开始会议正向路径、会中 APPROVE、越界事项 ESCALATE，以及结束会议结构化收口。
- 已补齐极简“开始会议。”触发下的关键缺口补问真实交互证据。
- 已补齐补齐信息后的正式开始会议真实交互证据。
- 已补齐独立的“事实不足即 FREEZE”真实交互证据。
- 已补齐基于本轮补证会结论的真实结束会议收口证据。
- runtime/cognition 的 smoke、contract、integration、backend、external 与 HTTP backend 六层验证已在 TriCompany-shadow-host 根目录通过。
- Supermemory 官方 schema 与 SDK seam 验证已通过。
- Supermemory 首轮 live smoke 已基于真实账号执行完成，并生成 JSON 证据与固定记录页。
- 技术状态、phase-1 执行文档与当时名为 tricompany-shadow-backport.json、当前名为 tricompany-copilot-host-backport.json 的机器清单已同步到 live smoke validated 口径。

## 本轮阻塞项

- 已关闭：同一 support root 下的连续多轮会议链路证据已完成补齐。
- 当前不再存在阻塞“本地 Copilot-host 已完成 shadow-test 并进入正式接管”结论的 phase-1 主门禁。

## 非本轮前置

- Supermemory 账号级 rate limit / 配额语义与长期稳定性验证。
- 真实官方 SDK 包接入验证。
- CPO / CTO 上岗后的协作验证。
- TriMC 承载的后续 MVP 上线验证。

## 建议执行顺序

- 当前如需继续开展正式验证，使用 TriMetaverse/.github/prompts/开始会议.prompt.md 发起；若要回看 phase-1 历史入口，转看 `docs/execution/hermes-copilot-host/phase-1/baselines/tricompany-ceo-chief-of-staff-archive-2026-04-26/`。
- 连续覆盖开始会议、汇报分流、冻结/升级、结束会议四类场景。
- 每轮都检查 support root、边界口径、决策结论与回填格式。
- 若出现边界漂移、错误升级或错误宣称正式宿主切换，默认 FREEZE，并先修正文档或 prompt 再重试。

## 当前判断

- 当前技术验证与 live 证据已基本齐备。
- 当前口径级验证、真实交互补证与连续会议链路已覆盖开始会议缺口补问、正式开始、会中 APPROVE、事实不足即 FREEZE、越界事项 ESCALATE 与结束会议结构收口。
- phase-1 历史结论已经成立：本地 Copilot-host 下总助 shadow 接管已完成。
- 当前 live 结论应写成：本地 Copilot-host 已完成 shadow-test，现进入正式接管；该结论不等于正式宿主切换。
- 当前仍不写成正式宿主切换、中央资产覆盖或 production 级 Hermes 已完成接入。

## 2026-04-18 补充验证

- 本轮补充验证记录位于 CHIEF-OF-STAFF-PHASE-1-TAKEOVER-VALIDATION.md。
- 本轮先完成读审与场景演练，后续又补齐三类真实交互证据。
- 本轮最终又补齐连续会议链路闭环，并确认 support root、shadow-test 边界与升级逻辑均未漂移到正式宿主口径。
