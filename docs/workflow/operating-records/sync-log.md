# 源侧→发布侧同步日志

> 本文件记录每次 `source_publish_check --check --sync` 的执行结果。
> 由 TriCompany 模块 agent（小赛）在同步后自动追加条目。
> 每周 OP 通过 `syncLogRef` 指向当周最新条目。

## 同步记录

### 2026-07-24 08:13 CST — 首次正式同步（Phase C 收口）

- **触发方**：TriCompany 模块 agent（小赛）
- **CLI**：`python -m runtime.cognition.source_publish_check --check --sync --scope --format json`
- **检测范围**：
  - 源侧：`D:/OneDrive/Code/ai/TriCompany`
  - 发布侧：`D:/OneDrive/Code/ai/TriMetaverse`
  - 纳入目录：`.github/source-agents/registries/`（源侧独有，发布侧不存在时不触发缺失告警）、`docs/`、`.github/`（非员工内容）
  - 排除：员工五件套（soul/memory/colleagues/social）、binding-profiles、live entry
  - 策略：文档类 hash diff / 源码类 git diff + hash / manifest JSON semantic diff / 结构性 CodeGraph

- **同步结果**：
  - 检测文件总数：356
  - 同步前 out_of_sync：2
  - 同步后 out_of_sync：0
  - 已同步文件：
    1. `docs/registry/company-governance-state.md` — Phase C 治理规则升级
    2. `docs/workflow/chief-of-staff-rd-orchestration.md` — §4.11 规则升级引用 CLI
  - 已跳过：0
  - 错误：0

- **同期累积变更**（本会话多次同步累计，发布侧 38 files / +2,896 -1,062）：
  - Agent 指令 5 个：CodeGraph-first 规则（4 个）+ 小赛上线记录
  - 治理与 Registry 4 个：code-state.md 刷新纪律、company-governance-state.md 规则升级
  - 产品文档 3 个：PROJECT/REQUIREMENTS/ROADMAP
  - 工程文档 3 个：DESIGN/ROADMAP/STATE
  - Workflow 14 个：角色文档、host-object-publish-flow 等
  - 经营记录 3 个：W30 OP + unresolved + tree-op
  - 其他 6 个：prompt/README 等

- **关联**：`docs/workflow/operating-records/2026-W30/OP-202607-W30-001.json` §syncLogRef

### 2026-07-24 10:24 CST — Q3 Phase 3: 统一发布管线首次正式 agent publish 执行

- **触发方**：CTO（小狄）
- **CLI**：`python -m runtime.cognition.source_publish_check --check --sync --publish-agents --agent-execute --scope --format json`
- **模式**：EXECUTING（非 dry-run），首次启用 `--agent-execute`
- **检测范围**：
  - 源侧：`D:/OneDrive/Code/ai/TriCompany`
  - 发布侧：`D:/OneDrive/Code/ai/TriMetaverse`
  - Agent publish 范围：manifest `liveEntries` 中 `status ∈ {source-published-live-entry, current-copilot-host-live}` 的全部 14 个 entry
  - 纳入：9 个 role-agent（ceo-chief-of-staff, chief-product-officer, chief-technology-officer, chief-marketing-officer, chief-operating-officer, chief-financial-officer, chief-human-resources-officer, chief-administrative-officer, rd-trainer）+ 5 个 registry/governance agent（business-strategy, CompanyGovernanceRegistry, TriMetaverseBusinessStrategyRegistry, TriMetaverseCodeRegistry, TriMetaverseProductRegistry）
  - 排除：员工五件套（soul/memory/colleagues/social）、binding-profiles、live entry 保护路径

- **Agent Publish 结果**：
  - 总 entry 数：14
  - Updated：13（`--agent-execute` 实际写入）
  - Skipped (identical)：1（chief-product-officer，源→发布 hash 一致）
  - Created：0
  - Errors：0
  - 发布后 SHA-256 验证：**14/14 MATCH** ✅

- **文件同步结果**：
  - 检测文件总数：356
  - 同步前 out_of_sync：0（Phase 2 已追平）
  - 同步后 out_of_sync：0
  - in_sync：31
  - gaps：177
  - synced_count：0
  - 错误：0

- **回归测试**：
  - `source_publish_check_validation.py`：33/33 passed ✅

- **备注**：
  - 13 个 agent 经首次 `--agent-execute` 从 `source-agents/` → `TriMetaverse/.github/agents/` 统一发布完成
  - `full-stack-developer.agent.md` 与 `test-engineer.agent.md` 在 `TriMetaverse/.github/agents/` 中存在但不在当前 manifest `liveEntries` 中，为遗留 agent，本次不覆盖
  - 本条目由 CTO 手工追加（首次 --agent-execute 由 CTO 直接发起）
