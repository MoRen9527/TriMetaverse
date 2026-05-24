# TriCompany Published Copy Refresh Checklist

版本：V0.1
日期：2026-04-27
状态：当前 host operator 快速执行版

## 文档同步元信息

- sourceOfTruth: TriCompany/docs/workflow/published-copy-refresh-sop.md
- publishedFrom: TriCompany/docs/workflow/published-copy-refresh-sop.md
- syncMode: published-copy
- lastSyncedAt: 2026-04-28
- publishTier: active-published-copy
- derivedAssetType: support-operator-checklist
- sourceSyncRule: source SOP 稳定语义变更后，当前 quick checklist 需在同轮或下一轮追平

## 1. 用前先判定资产类型

先看 `TriCompany/.github/manifests/tricompany-published-copy-manifest.json`，确认目标属于：

1. `activePublishedCopies`
2. `onDemandPublishedCopies`
3. `executionConclusionLinks`
4. `executionOperatorRunbooks`
5. `executionAuditEvidence`
6. `executionArchiveIndexes`

如果 manifest 里没有，先补清单，不要直接双写。

如果目标属于 `runtime/cognition/**`、`vendor/reference/**`、`TriCompany-copilot-host-assets/knowledge/chief-of-staff/**`、`TriCompany-copilot-host-assets/knowledge/roles/**`、`TriCompany-copilot-host-assets/knowledge/employees/**`、`TriCompany-copilot-host-assets/knowledge/org/**`、`TriCompany-copilot-host-assets/knowledge/audit/**`、`TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/schedules/*.json` 或 `TriMetaverse/.github/manifests/tricompany-copilot-host-backport.json`，则回迁移矩阵、host-object-manifest 或 backport manifest 处理；不要把它误补进 published-copy 清单。只有未来需要跨宿主发布或统一枚举时，才另建对应对象清单。

如果目标其实是运行态或生成产物，再加一道快判：

1. `.env`、`.env.*`、`.tricompany-cognition/**`、Python cache / coverage 产物，以及治理锚点之外的自定义 JSON / 日志 / 调试输出，按 `runtime-state` 保持本地并忽略。
2. `knowledge/chief-of-staff/audit/**`、`knowledge/chief-of-staff/workbench/{index.html,snapshot.json}` 与 `knowledge/chief-of-staff/workbench/approval-report/{snapshot.json,summary.md}` 虽由 runtime 生成，但当前属于受治理的 `support-object-set`，继续跟踪。
3. `docs/execution/hermes-copilot-host/phase-1/SUPERMEMORY-LIVE-VALIDATION.latest.json` 这类固定 execution JSON 证据属于 `audit-record`，继续跟踪；只有自定义 report 输出到治理锚点之外时，才先本地化。

## 2. 快速动作

### active published-copy

1. 先改 `TriCompany/` source 真源。
2. 同轮或下一轮追平 support 副本。
3. 更新 support 元信息中的同步时间或等价字段。

### on-demand published-copy

1. 默认只改 `TriCompany/` source 真源。
2. 只有 batch publish 或当前 host 重新显式依赖时，才改 support 副本。

### stable execution summary

1. 稳定结论只先回写 `TriCompany/docs/execution/`。
2. support 同名页只在新增 phase 证据、迁移说明或审计需要时更新。

### operator-runbook

1. 当前 host 步骤、边界口径或回滚条件变化时，直接改 support runbook。
2. 若规则已稳定成长期制度，再补回 source 真源。

### phase-evidence

1. 新证据只写 support execution。
2. 稳定结论再提炼回 source execution / workflow / registry。

### archive-index

1. 仅在 baseline 构成、回滚说明或入口说明变化时更新。
2. 新增 baseline 目录时，补 `README.md` 并登记 manifest。
3. baseline 目录内的 agent / prompt / memory 等快照文件默认视为冻结 archive payload，不单独补元信息，也不参与 published-copy 刷新。

## 3. 最小验证

1. 对改动文件跑静态检查。
2. 对 manifest 新增条目做 grep 确认。
3. 若动了 active published-copy，确认 source 与 support 口径一致。
4. 若动了 execution，确认没有把 evidence / runbook / archive-index 误写成 published-copy。

## 4. 禁止事项

1. 不先在 support bundle 写长期真源，再想着以后回源。
2. 不把 operator-runbook、phase-evidence、archive-index 误写成 active published-copy。
3. 不把当前 Copilot-host support root 的专用步骤写成未来 `TriMC` 正式宿主规则。

## 5. 回看入口

- source SOP：`TriCompany/docs/workflow/published-copy-refresh-sop.md`
- machine-readable 清单：`TriCompany/.github/manifests/tricompany-published-copy-manifest.json`
- 中央治理：`TriMetaverse/docs/workflow/tricompany-copilot-host-assets-governance.md`
- 迁移矩阵：`TriMetaverse/docs/workflow/tricompany-copilot-host-assets-migration-matrix.md`
