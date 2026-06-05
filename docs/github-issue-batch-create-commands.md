# GitHub Issue 批量创建命令清单（PowerShell + gh）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/github-issue-batch-create-commands.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-04

更新时间：2026-02-28
适用仓库：`TriMetaverse`

## 1) 前置准备

```powershell
Set-Location 'D:\OneDrive\Code\ai\TriMetaverse'
gh auth status
$repo = 'MoRen9527/TriMetaverse'
```

## 2) 建议先补齐标签（可重复执行）

```powershell
gh label create "type: epic" --repo $repo --color "5319E7" --description "Epic issue" 2>$null
gh label create "type: task" --repo $repo --color "0E8A16" --description "Task issue" 2>$null
gh label create "area: architecture" --repo $repo --color "1D76DB" --description "Architecture" 2>$null
gh label create "area: contracts" --repo $repo --color "1D76DB" --description "Contracts" 2>$null
gh label create "area: core-agent" --repo $repo --color "FBCA04" --description "Core-Agent" 2>$null
gh label create "area: socialfi" --repo $repo --color "FBCA04" --description "SocialFi" 2>$null
gh label create "area: tristaciss" --repo $repo --color "FBCA04" --description "TriStaciss" 2>$null
gh label create "area: observability" --repo $repo --color "C2E0C6" --description "Observability" 2>$null
gh label create "area: api" --repo $repo --color "C2E0C6" --description "API" 2>$null
gh label create "area: ui" --repo $repo --color "C2E0C6" --description "UI" 2>$null
gh label create "priority: P0" --repo $repo --color "B60205" --description "Highest" 2>$null
gh label create "priority: P1" --repo $repo --color "D93F0B" --description "High" 2>$null
gh label create "stage: plan" --repo $repo --color "EDEDED" --description "Planning" 2>$null
gh label create "stage: design" --repo $repo --color "EDEDED" --description "Design" 2>$null
gh label create "stage: dev" --repo $repo --color "0052CC" --description "Development" 2>$null
gh label create "stage: test" --repo $repo --color "5319E7" --description "Testing" 2>$null
gh label create "stage: harden" --repo $repo --color "BFD4F2" --description "Hardening" 2>$null
```

## 3) 批量创建（Phase 0/1 + Observability）

```powershell
# Epic A (Phase 0)
gh issue create --repo $repo --title "[Epic][Phase0] 契约先行：冻结边界并完成跨仓接口定义" --label "type: epic" --label "area: architecture" --label "priority: P0" --label "stage: plan" --body-file docs/refactor-phase0-1-issue-pack.md

# P0-1
gh issue create --repo $repo --title "[Phase0][Contract] 定义 Message/Session/ToolCall/Audit 四类 Envelope" --label "type: task" --label "area: contracts" --label "priority: P0" --label "stage: design" --body "来源：docs/refactor-phase0-1-issue-pack.md（Issue P0-1）。请按文档区块执行并打勾验收项。"

# P0-2
gh issue create --repo $repo --title "[Phase0][Contract] 定义 Core-Agent -> TriStaciss LLM 调用契约" --label "type: task" --label "area: tristaciss" --label "priority: P0" --label "stage: design" --body "来源：docs/refactor-phase0-1-issue-pack.md（Issue P0-2）。请按文档区块执行并打勾验收项。"

# P0-3
gh issue create --repo $repo --title "[Phase0][Contract] 定义 SocialFi <-> Core-Agent 输入与回包契约" --label "type: task" --label "area: socialfi" --label "priority: P0" --label "stage: design" --body "来源：docs/refactor-phase0-1-issue-pack.md（Issue P0-3）。请按文档区块执行并打勾验收项。"

# P0-4
gh issue create --repo $repo --title "[Phase0][Policy] 定义 Safe Stop / Force Stop 与 lease-fencing 语义" --label "type: task" --label "area: architecture" --label "priority: P0" --label "stage: design" --body "来源：docs/refactor-phase0-1-issue-pack.md（Issue P0-4）。请按文档区块执行并打勾验收项。"

# Epic B (Phase 1)
gh issue create --repo $repo --title "[Epic][Phase1] Core-Agent MVP：单会话最小闭环" --label "type: epic" --label "area: core-agent" --label "priority: P0" --label "stage: dev" --body "来源：docs/refactor-phase0-1-issue-pack.md（Epic B）。"

# P1-1
gh issue create --repo $repo --title "[Phase1][Core-Agent] 初始化项目骨架（gateway/router-queue/runner/runtime）" --label "type: task" --label "area: core-agent" --label "priority: P0" --label "stage: dev" --body "来源：docs/refactor-phase0-1-issue-pack.md（Issue P1-1）。"

# P1-2
gh issue create --repo $repo --title "[Phase1][Core-Agent] 实现 Gateway -> Router/Queue -> Runner 最小链路" --label "type: task" --label "area: core-agent" --label "priority: P0" --label "stage: dev" --body "来源：docs/refactor-phase0-1-issue-pack.md（Issue P1-2）。"

# P1-3
gh issue create --repo $repo --title "[Phase1][TriStaciss] 接入统一 LLM 出口（流式 + fallback 语义）" --label "type: task" --label "area: tristaciss" --label "priority: P0" --label "stage: dev" --body "来源：docs/refactor-phase0-1-issue-pack.md（Issue P1-3）。"

# P1-4
gh issue create --repo $repo --title "[Phase1][Observability] 接入最小 AuditEvent 与单会话 smoke" --label "type: task" --label "area: observability" --label "priority: P0" --label "stage: test" --body "来源：docs/refactor-phase0-1-issue-pack.md（Issue P1-4）。"

# Epic O2
gh issue create --repo $repo --title "[Epic][Phase2][Observability] 事件桥接与基础时间线上线" --label "type: epic" --label "area: observability" --label "priority: P1" --label "stage: dev" --body-file docs/observability-phase2-4-issue-pack.md

# O2-1
gh issue create --repo $repo --title "[Phase2][Bridge] 实现审计事件 -> 统一观测事件适配器" --label "type: task" --label "area: observability" --label "priority: P1" --label "stage: dev" --body "来源：docs/observability-phase2-4-issue-pack.md（Issue O2-1）。"

# O2-2
gh issue create --repo $repo --title "[Phase2][Contract] 接入 observability-event-mapping v1 契约校验" --label "type: task" --label "area: contracts" --label "priority: P1" --label "stage: dev" --body "来源：docs/observability-phase2-4-issue-pack.md（Issue O2-2）。"

# O2-3
gh issue create --repo $repo --title "[Phase2][API] 提供 timeline/replay 查询接口（session/trace）" --label "type: task" --label "area: api" --label "priority: P1" --label "stage: dev" --body "来源：docs/observability-phase2-4-issue-pack.md（Issue O2-3）。"

# Epic O3
gh issue create --repo $repo --title "[Epic][Phase3][Observability] 3D 场景与子代理可视化接入" --label "type: epic" --label "area: observability" --label "priority: P1" --label "stage: dev" --body "来源：docs/observability-phase2-4-issue-pack.md（Epic O3）。"

# O3-2
gh issue create --repo $repo --title "[Phase3][UI] 子代理关系树与事件跳转" --label "type: task" --label "area: ui" --label "priority: P1" --label "stage: dev" --body "来源：docs/observability-phase2-4-issue-pack.md（Issue O3-2）。"

# Epic O4
gh issue create --repo $repo --title "[Epic][Phase4][Observability] 培训复盘与运维可解释收口" --label "type: epic" --label "area: observability" --label "priority: P1" --label "stage: harden" --body "来源：docs/observability-phase2-4-issue-pack.md（Epic O4）。"
```

## 4) 可选：自动建立父子关联（如果你使用任务列表）

```powershell
# 手动将任务 issue 链接到对应 Epic 的 checklist；
# 也可安装 gh 扩展后用项目自动化规则关联。
```
