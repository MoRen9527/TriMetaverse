# Support Root Rename Plan

## 文档同步元信息

- sourceOfTruth: 当前文件（support-only operational asset）
- publishedFrom: 当前文件（support-only runbook）
- syncMode: audit-record
- executionTier: operator-runbook
- updateRule: 当前 support root 命名、迁移步骤或回滚原则变化时更新
- sourceBackfillRule: 若规则沉淀为长期发布流程要求，再回写 workflow 真源；否则不要求同名回源
- lastSyncedAt: 2026-04-28

日期：2026-04-18
状态：已完成物理目录重命名、生效引用改写与首轮验证

## 目的

- 为当前 support root 从 `TriCompany-shadow-host` 迁移到 `TriCompany-copilot-host-assets` 提供一份单独可执行的方案。
- 把“物理目录重命名”和“历史证据保真”分开处理，避免为了统一命名反向污染 phase-1 证据链。

## 当前路径与目标路径

- 当前物理路径：`TriCompany-copilot-host-assets`
- 历史物理路径：`TriCompany-shadow-host`
- 当前语义：当前 `Copilot-host` 专用的赛博公司宿主资产包长期正式名
- 历史语义：phase-1 shadow-test 已验证的 support root 临时路径

## 重命名原则

1. 先区分“生效引用”和“历史证据引用”。
2. 当前生效的 agent / prompt / manifest / registry / README / runtime 说明，在真正执行迁移时应改为目标路径。
3. 已形成历史证据的执行记录、会议演练记录、验证记录，不应被直接改写成仿佛当时就叫新路径；必要时只追加“后续已迁移”的说明。
4. 在中央命名吸收前，先完成 support root 重命名与新路径验证，再决定是否吸收回中央 `ceo-chief-of-staff`。
5. 本轮已完成物理目录重命名、生效引用改写与首轮验证；后续只保留历史证据注释与中央吸收准备。

## 执行顺序

### 阶段 1：迁移前冻结（已完成）

1. 冻结当前 `TriCompany-shadow-host` 作为 phase-1 已验证路径，不再继续扩大新引用。
2. 为中央 `ceo-chief-of-staff` 套件保留 baseline 快照。
3. 为当前 support root 相关 machine-readable 资产保留 baseline：
   - `.github/manifests/tricompany-shadow-backport.json`（形成时文件名；当前现行文件名已整理为 `.github/manifests/tricompany-copilot-host-backport.json`）
   - phase-1 执行文档
   - registry 状态文档

### 阶段 2：物理目录重命名（已完成）

1. 将 `TriCompany-shadow-host` 重命名为 `TriCompany-copilot-host-assets`。
2. 确认该目录仍保持 TriMetaverse 根目录下的平行支撑包位置。
3. 不把该目录迁入 `.github/`。

### 阶段 3：生效引用改写（已完成）

1. 先改 TriMetaverse `.github` 内当前生效引用。
2. 再改 support root 内的 README、registry、workflow、engineering、runtime 说明等活文档。
3. 再改 machine-readable manifest、runtime 字符串和工具说明。
4. 完成后重新验证：总助、registry、会议入口、runtime 说明均指向新路径。

### 阶段 4：历史证据保真处理（已完成）

1. 对 phase-1 已验证记录，默认保留当时的原路径文字。
2. 如果需要降低歧义，只追加一条注释：
   - “本记录形成时 support root 路径名为 TriCompany-shadow-host；后续已迁移为 TriCompany-copilot-host-assets。”
3. 不把历史执行命令、历史 JSON 证据路径、历史会议纪要中的旧路径整体替换成新路径。

## 引用改写清单

### A. 当前生效引用，迁移时必须改

- `.github/manifests/tricompany-copilot-host-backport.json`
- `.github/prompts/tricompany-开始会议.prompt.md`
- `.github/prompts/tricompany-结束会议.prompt.md`
- `.github/agents/tricompany-ceo-chief-of-staff.agent.md`
- `.github/agents/TriCompanyProductRegistry.agent.md`
- `.github/agents/TriCompanyCodeRegistry.agent.md`

原因：这些文件决定当前生效层回看哪套支撑资产，必须在目录真正重命名时同步切换。

### B. support root 自身活文档，迁移时应改

- `README.md`
- `docs/registry/product-state.md`
- `docs/registry/code-state.md`
- `docs/engineering/STATE.md`
- `docs/workflow/github-backport-manifest.md`
- `runtime/cognition/README.md`
- `runtime/cognition/supermemory_live_finalize.py`
- `runtime/cognition/supermemory_live_validation.py`

原因：这些文件描述的是当前生效状态、当前操作方式或当前路径约定，不应长期保留旧物理路径名。

### C. phase-1 历史记录，默认不整体替换，只追加迁移说明

- `docs/execution/hermes-copilot-host/phase-1/PLAN.md`
- `docs/execution/hermes-copilot-host/phase-1/VERIFICATION.md`
- `docs/execution/hermes-copilot-host/phase-1/SUMMARY.md`
- `docs/execution/hermes-copilot-host/phase-1/MEETING-LIFECYCLE-REHEARSAL.md`
- `docs/execution/hermes-copilot-host/phase-1/SUPERMEMORY-LIVE-VALIDATION.md`
- `docs/execution/hermes-copilot-host/phase-1/CHIEF-OF-STAFF-PHASE-1-TAKEOVER-CHECKLIST.md`
- `docs/execution/hermes-copilot-host/phase-1/CHIEF-OF-STAFF-PHASE-1-TAKEOVER-VALIDATION.md`

原因：这些文件承担证据职能，直接替换旧路径会让历史记录看起来像当时就是新路径。

### D. 代码与配置中需要重点复核的路径字符串

- `runtime/cognition/supermemory_live_finalize.py`
- `runtime/cognition/supermemory_live_validation.py`
- `runtime/cognition/README.md`
- `.github/manifests/tricompany-copilot-host-backport.json`

原因：这些地方不只是自然语言描述，还涉及工具行为、machine-readable 状态和命令入口。

## 建议迁移后新增的补充动作

1. 在新的 support root 顶部 README 里补一条“旧路径名到新路径名”的迁移说明。
2. 在 phase-1 历史文档顶部统一追加一条说明，避免读者误会旧路径是当前生效路径。
3. 在中央吸收动作开始前，再做一次 `.github` 到 support root 的路径复查。

## 回滚原则

- 如果目录重命名后出现路径漂移、总助引用失效、registry 路由失效，优先回滚 support root 物理目录名，而不是先覆盖中央总助资产。
- 目录重命名与中央总助吸收视为两个独立变更，可分开回滚。

## 当前结论

- 当前已完成 support root 物理目录重命名、生效引用改写与首轮验证。
- 下一步应在该基线上推进中央 `ceo-chief-of-staff` 命名吸收准备与回滚基线校验。
