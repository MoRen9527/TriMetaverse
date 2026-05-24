# central ceo-chief-of-staff baseline snapshot

## 文档同步元信息

- sourceOfTruth: 当前文件（support-only baseline index）
- publishedFrom: 当前文件（baseline index）
- syncMode: audit-record
- executionTier: archive-index
- updateRule: 仅在 baseline 构成、回滚说明或当前 live 入口说明变化时更新
- sourceBackfillRule: 当前文件只服务 support 侧回滚与审计，不要求同名回源
- lastSyncedAt: 2026-04-28

本目录用于保留 2026-04-18 中央 `ceo-chief-of-staff` 吸收动作对应的 baseline 快照。

用途：

- 作为中央 `ceo-chief-of-staff` 五件套吸收前后的回滚参考。
- 为当前本地正式接管阶段提供可核对的中央 baseline 证据。
- 为后续解释“中央总助命名吸收已完成，但不等于正式宿主切换”提供快照支撑。

注意：

- 本目录是 baseline / rollback 参考，不是当前 live 主入口。
- 当前 live 主入口仍以 `TriMetaverse/.github/agents/ceo-chief-of-staff.agent.md` 及其同名套件文件为准。
- 本目录只包含中央 `ceo-chief-of-staff` 五件套快照，不包含公司级共享 `开始会议`、`结束会议` prompt。
