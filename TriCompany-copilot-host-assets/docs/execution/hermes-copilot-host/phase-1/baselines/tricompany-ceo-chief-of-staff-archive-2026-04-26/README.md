# tricompany-ceo-chief-of-staff archive baseline

## 文档同步元信息

- sourceOfTruth: 当前文件（support-only baseline index）
- publishedFrom: 当前文件（baseline index）
- syncMode: audit-record
- executionTier: archive-index
- updateRule: 仅在 archive 构成、回滚说明或当前 live 入口说明变化时更新
- sourceBackfillRule: 当前文件只服务 support 侧回滚与审计，不要求同名回源
- lastSyncedAt: 2026-04-28

本目录用于封存 `tricompany-*` 总助套件在 2026-04-26 降级为归档参考前的完整快照。

用途：

- 作为当前 live `tricompany-*` 资产去活入口前的 baseline。
- 为后续显式删除 live `tricompany-*` 文件提供可回看的 archive 副本。
- 保留 phase-1 shadow-test 到本地正式接管这段迁移链路的可核对证据。

注意：

- 本目录是 archive / baseline，不是当前主入口。
- 当前主入口仍以 `TriMetaverse/.github/agents/ceo-chief-of-staff.agent.md` 及公司级共享 prompt 为准。
- 若未来需要删除 live `tricompany-*` 资产，应先确保本目录与相关执行文档仍能独立支撑回滚与审计说明。
