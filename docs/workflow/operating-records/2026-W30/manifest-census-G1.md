# G1 普查：trimetaverse-live-agent-publish-manifest.json 逐条迁移状态

> **普查日期**：2026-07-24  
> **执行人**：CEOChiefOfStaff（小贾）  
> **数据源**：`TriCompany/.github/source-agents/registries/trimetaverse-live-agent-publish-manifest.json`（canonical source）  
> **活体验证**：`TriMetaverse/.github/agents/` + 15 个 pilot 模块 `../<Module>/.github/agents/`  
> **关联审批**：ET-20260723-001（CPO）、ET-20260723-002（CTO）、ET-20260723-003（CAO）

---

## 总览

| 分类 | 数量 | 摘要 |
|------|------|------|
| 角色 Agent（role-agent） | 9 | 全部 `current-copilot-host-live`，在中央 live surface |
| 中央 Registry/Governance Agent | 5 | 全部 `source-published-live-entry`，在中央 live surface |
| 模块 Orchestrator Agent | 1 | `module-local-live-entry`，TriCompany 模块侧 |
| 已迁移模块 Registry Agent（triplet） | 45 | 15 模块 × 3 triplet，全部 `migrated-module-local-live-entry` ✅ |
| **Manifest 登记条目合计** | **60** | |
| 中央 live surface 未登记文件 | 2 | full-stack-developer、test-engineer ⚠️ |
| **中央 live surface 实际文件数** | **16** | |

---

## §1 角色 Agent（role-agent）— 9 条

> 全部 `status: current-copilot-host-live`，源侧定义在 `TriCompany/.github/source-agents/<role>/`，发布目标 `TriMetaverse/.github/agents/`。  
> **统一迁移建议：保留在 `TriMetaverse/.github/agents/`**——这些是公司级员工角色，不属于任何单一模块。

| # | objectId（文件名） | kind | source | target | 当前状态 | 迁移建议 |
|---|-------------------|------|--------|--------|---------|---------|
| 1 | `ceo-chief-of-staff.agent.md` | role-agent | `TriCompany/.github/source-agents/ceo-chief-of-staff/` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留** |
| 2 | `chief-product-officer.agent.md` | role-agent | `TriCompany/.github/source-agents/chief-product-officer/` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留** |
| 3 | `chief-technology-officer.agent.md` | role-agent | `TriCompany/.github/source-agents/chief-technology-officer/` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留** |
| 4 | `chief-marketing-officer.agent.md` | role-agent | `TriCompany/.github/source-agents/chief-marketing-officer/` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留** |
| 5 | `chief-operating-officer.agent.md` | role-agent | `TriCompany/.github/source-agents/chief-operating-officer/` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留** |
| 6 | `chief-financial-officer.agent.md` | role-agent | `TriCompany/.github/source-agents/chief-financial-officer/` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留** |
| 7 | `chief-human-resources-officer.agent.md` | role-agent | `TriCompany/.github/source-agents/chief-human-resources-officer/` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留** |
| 8 | `chief-administrative-officer.agent.md` | role-agent | `TriCompany/.github/source-agents/chief-administrative-officer/` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留** |
| 9 | `rd-trainer.agent.md` | role-agent | `TriCompany/.github/source-agents/rd-trainer/` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留** |

---

## §2 中央 Registry/Governance Agent — 5 条

> 全部 `status: source-published-live-entry`，源侧在 `TriCompany/.github/source-agents/registries/`，发布目标 `TriMetaverse/.github/agents/`。

| # | objectId | kind | source | target | 当前状态 | 迁移建议 |
|---|----------|------|--------|--------|---------|---------|
| 10 | `business-strategy.agent.md` | registry-or-governance-agent | `TriCompany/.github/source-agents/registries/business-strategy.agent.md` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留**（G5） |
| 11 | `CompanyGovernanceRegistry.agent.md` | registry-or-governance-agent | `TriCompany/.github/source-agents/registries/CompanyGovernanceRegistry.agent.md` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留**（G5） |
| 12 | `TriMetaverseBusinessStrategyRegistry.agent.md` | registry-or-governance-agent | `TriCompany/.github/source-agents/registries/TriMetaverseBusinessStrategyRegistry.agent.md` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留**（G5） |
| 13 | `TriMetaverseCodeRegistry.agent.md` | registry-or-governance-agent | `TriCompany/.github/source-agents/registries/TriMetaverseCodeRegistry.agent.md` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留**（G5） |
| 14 | `TriMetaverseProductRegistry.agent.md` | registry-or-governance-agent | `TriCompany/.github/source-agents/registries/TriMetaverseProductRegistry.agent.md` | `TriMetaverse/.github/agents/` | 仍在中央 live surface | **保留**（G5） |

---

## §3 模块 Orchestrator Agent — 1 条

| # | objectId | kind | source | target | 当前状态 | 迁移建议 |
|---|----------|------|--------|--------|---------|---------|
| 15 | `TriCompany.agent.md` | module-orchestrator-agent | `TriCompany/.github/source-agents/registries/TriCompany.agent.md` | `TriCompany/.github/agents/` | 已迁移 module-local ✅ | 不参与本次搬出 |

> **备注**：2026-07-24 经 CPO/CTO/CAO 三方 APPROVE 上线。负责源侧→发布侧同步链路总控、发布清单维护与发布纪律执行。  
> 治理审批：`ET-20260723-003`。`target` 已是 `TriCompany/.github/agents/`，无需搬出。

---

## §4 已迁移模块 Registry Agent（triplet）— 45 条

> 全部 `status: migrated-module-local-live-entry`。15 个 pilot 模块，每个模块 3 件套（BusinessStrategyRegistry + CodeRegistry + ProductRegistry），共 45 条。  
> **已全部落地至对应模块 `../<Module>/.github/agents/`，文件系统验证通过。**

### 4.1 Triavatar（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 16 | `TriavatarBusinessStrategyRegistry.agent.md` | `Triavatar/.github/agents/` | ✅ 存在 |
| 17 | `TriavatarCodeRegistry.agent.md` | `Triavatar/.github/agents/` | ✅ 存在 |
| 18 | `TriavatarProductRegistry.agent.md` | `Triavatar/.github/agents/` | ✅ 存在 |

### 4.2 TriChain（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 19 | `TriChainBusinessStrategyRegistry.agent.md` | `TriChain/.github/agents/` | ✅ 存在 |
| 20 | `TriChainCodeRegistry.agent.md` | `TriChain/.github/agents/` | ✅ 存在 |
| 21 | `TriChainProductRegistry.agent.md` | `TriChain/.github/agents/` | ✅ 存在 |

### 4.3 TriCompany（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 22 | `TriCompanyBusinessStrategyRegistry.agent.md` | `TriCompany/.github/agents/` | ✅ 存在 |
| 23 | `TriCompanyCodeRegistry.agent.md` | `TriCompany/.github/agents/` | ✅ 存在 |
| 24 | `TriCompanyProductRegistry.agent.md` | `TriCompany/.github/agents/` | ✅ 存在 |

> 注：TriCompany 同时有 module orchestrator（`TriCompany.agent.md`），与 triplet 不冲突。

### 4.4 Tride（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 25 | `TrideBusinessStrategyRegistry.agent.md` | `Tride/.github/agents/` | ✅ 存在 |
| 26 | `TrideCodeRegistry.agent.md` | `Tride/.github/agents/` | ✅ 存在 |
| 27 | `TrideProductRegistry.agent.md` | `Tride/.github/agents/` | ✅ 存在 |

### 4.5 Trideployment（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 28 | `TrideploymentBusinessStrategyRegistry.agent.md` | `Trideployment/.github/agents/` | ✅ 存在 |
| 29 | `TrideploymentCodeRegistry.agent.md` | `Trideployment/.github/agents/` | ✅ 存在 |
| 30 | `TrideploymentProductRegistry.agent.md` | `Trideployment/.github/agents/` | ✅ 存在 |

### 4.6 TriDev（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 31 | `TriDevBusinessStrategyRegistry.agent.md` | `TriDev/.github/agents/` | ✅ 存在 |
| 32 | `TriDevCodeRegistry.agent.md` | `TriDev/.github/agents/` | ✅ 存在 |
| 33 | `TriDevProductRegistry.agent.md` | `TriDev/.github/agents/` | ✅ 存在 |

> 注：TriDev 另有 `tridev.agent.md`（maintenance-oriented module agent），不在 triplet 范围内，也不在 manifest 登记中。

### 4.7 TriLC（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 34 | `TriLCBusinessStrategyRegistry.agent.md` | `TriLC/.github/agents/` | ✅ 存在 |
| 35 | `TriLCCodeRegistry.agent.md` | `TriLC/.github/agents/` | ✅ 存在 |
| 36 | `TriLCProductRegistry.agent.md` | `TriLC/.github/agents/` | ✅ 存在 |

### 4.8 TriMC（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 37 | `TriMCBusinessStrategyRegistry.agent.md` | `TriMC/.github/agents/` | ✅ 存在 |
| 38 | `TriMCCodeRegistry.agent.md` | `TriMC/.github/agents/` | ✅ 存在 |
| 39 | `TriMCProductRegistry.agent.md` | `TriMC/.github/agents/` | ✅ 存在 |

### 4.9 TriMem（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 40 | `TriMemBusinessStrategyRegistry.agent.md` | `TriMem/.github/agents/` | ✅ 存在 |
| 41 | `TriMemCodeRegistry.agent.md` | `TriMem/.github/agents/` | ✅ 存在 |
| 42 | `TriMemProductRegistry.agent.md` | `TriMem/.github/agents/` | ✅ 存在 |

### 4.10 TriMobile（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 43 | `TriMobileBusinessStrategyRegistry.agent.md` | `TriMobile/.github/agents/` | ✅ 存在 |
| 44 | `TriMobileCodeRegistry.agent.md` | `TriMobile/.github/agents/` | ✅ 存在 |
| 45 | `TriMobileProductRegistry.agent.md` | `TriMobile/.github/agents/` | ✅ 存在 |

### 4.11 Tripilot（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 46 | `TripilotBusinessStrategyRegistry.agent.md` | `Tripilot/.github/agents/` | ✅ 存在 |
| 47 | `TripilotCodeRegistry.agent.md` | `Tripilot/.github/agents/` | ✅ 存在 |
| 48 | `TripilotProductRegistry.agent.md` | `Tripilot/.github/agents/` | ✅ 存在 |

### 4.12 Tristaciss（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 49 | `TristacissBusinessStrategyRegistry.agent.md` | `Tristaciss/.github/agents/` | ✅ 存在 |
| 50 | `TristacissCodeRegistry.agent.md` | `Tristaciss/.github/agents/` | ✅ 存在 |
| 51 | `TristacissProductRegistry.agent.md` | `Tristaciss/.github/agents/` | ✅ 存在 |

### 4.13 TriTest（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 52 | `TriTestBusinessStrategyRegistry.agent.md` | `TriTest/.github/agents/` | ✅ 存在 |
| 53 | `TriTestCodeRegistry.agent.md` | `TriTest/.github/agents/` | ✅ 存在 |
| 54 | `TriTestProductRegistry.agent.md` | `TriTest/.github/agents/` | ✅ 存在 |

### 4.14 TriWeb4（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 55 | `TriWeb4BusinessStrategyRegistry.agent.md` | `TriWeb4/.github/agents/` | ✅ 存在 |
| 56 | `TriWeb4CodeRegistry.agent.md` | `TriWeb4/.github/agents/` | ✅ 存在 |
| 57 | `TriWeb4ProductRegistry.agent.md` | `TriWeb4/.github/agents/` | ✅ 存在 |

### 4.15 vscodium（3/3 ✅）

| # | objectId | target | 文件系统确认 |
|---|----------|--------|-------------|
| 58 | `VscodiumBusinessStrategyRegistry.agent.md` | `vscodium/.github/agents/` | ✅ 存在 |
| 59 | `VscodiumCodeRegistry.agent.md` | `vscodium/.github/agents/` | ✅ 存在 |
| 60 | `VscodiumProductRegistry.agent.md` | `vscodium/.github/agents/` | ✅ 存在 |

---

## §5 中央 Live Surface 未登记文件 — 2 条 ⚠️

> 以下文件存在于 `TriMetaverse/.github/agents/`，但**未在 `trimetaverse-live-agent-publish-manifest.json` 登记**。

| # | 文件名 | 判断 | 建议 |
|---|--------|------|------|
| U1 | `full-stack-developer.agent.md` | 角色 agent（小全），中央 live surface 文件存在，manifest 缺失 | **保留在中央 + 补登记**。属于公司级员工角色，源侧应在 `TriCompany/.github/source-agents/` 补齐，manifest 补 `liveEntry` |
| U2 | `test-engineer.agent.md` | 角色 agent（小柯），中央 live surface 文件存在，manifest 缺失 | **保留在中央 + 补登记**。同上，源侧补齐 + manifest 补 `liveEntry` |

---

## §6 G5 专项分析：中央 Registry 的去留

### 6.1 `business-strategy.agent.md`（BusinessStrategy）

- **性质**：中央商业战略 agent，负责跨模块商业边界裁定、模块优先级排序、MVP 范围裁决。
- **不属于任何单一模块**：其职责是对 15+ 模块做跨模块商业判断，搬到任一模块都会造成治理偏斜。
- **当前 manifest 状态**：`source-published-live-entry`，target `TriMetaverse/.github/agents/`
- **Recommendation：保留在 `TriMetaverse/.github/agents/`**
- **理由**：BusinessStrategy 是公司级而非模块级能力。即使 TriMetaverse 自身有 `TriMetaverseBusinessStrategyRegistry`（模块级），后者负责 TriMetaverse 模块的商业边界，前者负责全公司跨模块商业裁定。两者分工不同，不可合并。

### 6.2 `CompanyGovernanceRegistry.agent.md`

- **性质**：中央治理 agent，负责 agent 发布纪律、CHO/CAO 边界、discovery 唯一性监督。
- **不属于任何单一模块**：治理是横切关注点。
- **当前 manifest 状态**：`source-published-live-entry`，target `TriMetaverse/.github/agents/`
- **Recommendation：保留在 `TriMetaverse/.github/agents/`**
- **理由**：公司级治理不可能下沉到任一模块。

### 6.3 TriMetaverse 三件套（TriMetaverseBusinessStrategyRegistry / CodeRegistry / ProductRegistry）

- **当前 manifest 状态**：`source-published-live-entry`（非 `migrated-module-local-live-entry`）
- **target 路径**：`TriMetaverse/.github/agents/`
- **关键判断**：TriMetaverse 自身是一个模块，`TriMetaverse/.github/agents/` **就是**它的 module-local 位置。与其它 14 个模块不同，TriMetaverse 的 registry triplet 没有"从中央搬出到模块"的动作——它们从一开始就在"既是中央又是模块"的位置。
- **是否算"已 module-local"**：**效果上是，manifest 状态字段上不是**。
  - 效果上：target 路径 `TriMetaverse/.github/agents/` 对 TriMetaverse 模块而言就是 module-local。文件系统验证通过（3/3 存在）。
  - 状态字段上：manifest 用 `source-published-live-entry` 而非 `migrated-module-local-live-entry`，因为源侧在 `TriCompany/.github/source-agents/registries/`，发布到 TriMetaverse live surface。这不是"迁移"而是"源侧发布到模块侧 live surface"。
- **Recommendation：保留在 `TriMetaverse/.github/agents/`，但建议在 manifest 中将这三个条目的 `kind` 补充标注为 `module-registry-agent`（当前是 `registry-or-governance-agent`），并在 `status` 加注 `effectively-module-local`，以区别于 business-strategy 和 CompanyGovernanceRegistry 两个真正的跨模块中央 agent。**
- **不影响本次搬出**：这三个文件不需要移动。

### 6.4 G5 总结

| Agent | 归属 | 建议 | 是否需要搬出 |
|-------|------|------|-------------|
| `business-strategy.agent.md` | 公司级跨模块 | 保留在 `TriMetaverse/.github/agents/` | ❌ 不需要 |
| `CompanyGovernanceRegistry.agent.md` | 公司级治理 | 保留在 `TriMetaverse/.github/agents/` | ❌ 不需要 |
| `TriMetaverseBusinessStrategyRegistry.agent.md` | TriMetaverse 模块 | 保留（已在 module-local） | ❌ 不需要 |
| `TriMetaverseCodeRegistry.agent.md` | TriMetaverse 模块 | 保留（已在 module-local） | ❌ 不需要 |
| `TriMetaverseProductRegistry.agent.md` | TriMetaverse 模块 | 保留（已在 module-local） | ❌ 不需要 |

---

## §7 完整迁移矩阵（汇总）

| 状态分类 | 条目数 | 当前落点 | 动作 |
|---------|--------|---------|------|
| 角色 Agent，中央 live | 9 | `TriMetaverse/.github/agents/` | 保留，无需搬出 |
| 中央 Registry/Governance | 2 | `TriMetaverse/.github/agents/` | 保留，无需搬出（G5） |
| TriMetaverse 模块 registry | 3 | `TriMetaverse/.github/agents/` | 保留（效果上已是 module-local） |
| Module orchestrator | 1 | `TriCompany/.github/agents/` | 已完成，无需搬出 |
| 已迁移模块 triplet | 45 | 各模块 `../<Module>/.github/agents/` | ✅ 全部完成，文件系统验证通过 |
| 中央未登记角色 agent | 2 | `TriMetaverse/.github/agents/` | ⚠️ 需补登记到 manifest |
| **退休条目** | 2 | archive | `board-oversight`、`chief-sales-officer`，已归档 |

---

## §8 发现与建议

### 8.1 已确认正常

- ✅ 15 个 pilot 模块 triplet 全部 `migrated-module-local-live-entry`，文件系统交叉验证全部通过（45/45）。
- ✅ TriCompany 模块 orchestrator（`TriCompany.agent.md`）2026-07-24 正式上线，三方审批（CPO + CTO + CAO）全部 APPROVE。
- ✅ `source_publish_check` CLI 首次全链路同步已完成（total=356, out_of_sync=0, in_sync=31）。
- ✅ 中央 live surface 无同名冲突（TriMetaverse/.github/agents/ 下不存在任何模块 triplet agent 残留）。

### 8.2 待处理

| ID | 事项 | 优先级 | 负责人建议 |
|----|------|--------|-----------|
| G1-U1 | `full-stack-developer.agent.md` 未在 manifest 登记 | P1 | CAO / 总助 |
| G1-U2 | `test-engineer.agent.md` 未在 manifest 登记 | P1 | CAO / 总助 |
| G1-F1 | TriMetaverse triplet 的 manifest `kind` 字段建议从 `registry-or-governance-agent` → `module-registry-agent`，`status` 建议加注 `effectively-module-local` | P2 | 总助（小贾）提交 PR，CAO 审批 |

### 8.3 Phase C 后续联动

- `TriCompany.agent.md`（小赛）上线后，后续 manifest 条目变更应由小赛通过 `source_publish_check --check --sync` 自动追踪。
- 本次普查发现的 U1/U2 登记缺口，应在补登记后纳入小赛的第一次自动同步范围。

---

## §9 验证证据

- **Manifest canonical source**：`TriCompany/.github/source-agents/registries/trimetaverse-live-agent-publish-manifest.json`（412 行，60 条 liveEntries + 2 条 retiredEntries）
- **中央 live surface**：`TriMetaverse/.github/agents/`（16 个文件，其中 14 个已登记 + 2 个未登记）
- **15 模块文件系统交叉验证**：全部通过（每模块 BSR=1, CR=1, PR=1）
- **治理审批链路**：ET-20260723-001（CPO APPROVE）、ET-20260723-002（CTO APPROVE）、ET-20260723-003（CAO APPROVE）

---

**普查完成时间**：2026-07-24T10:05+08:00  
**下一步**：U1/U2 补登记 → CAO 确认 → 纳入小赛 Phase C 首次自动同步
