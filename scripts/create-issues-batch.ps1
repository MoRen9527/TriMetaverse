param(
  [string]$Repo = 'MoRen9527/TriMetaverse'
)

$ErrorActionPreference = 'Stop'

function Ensure-Label {
  param([string]$Name, [string]$Color, [string]$Description)
  try {
    gh label create $Name --repo $Repo --color $Color --description $Description 2>$null | Out-Null
  } catch {
  }
}

function Ensure-Issue {
  param([string]$Title, [string[]]$Labels, [string]$Body)

  $existingJson = gh issue list --repo $Repo --state all --search ('"' + $Title + '" in:title') --json title,url --limit 50
  if (-not [string]::IsNullOrWhiteSpace($existingJson)) {
    $existing = $existingJson | ConvertFrom-Json
    $exact = $existing | Where-Object { $_.title -eq $Title } | Select-Object -First 1
    if ($null -ne $exact) {
      Write-Host "EXISTS: $($exact.url)"
      return
    }
  }

  $args = @('issue','create','--repo',$Repo,'--title',$Title,'--body',$Body)
  foreach ($label in $Labels) {
    $args += @('--label',$label)
  }

  $url = gh @args
  Write-Host "CREATED: $url"
}

# labels
Ensure-Label 'type: epic' '5319E7' 'Epic issue'
Ensure-Label 'type: task' '0E8A16' 'Task issue'
Ensure-Label 'area: architecture' '1D76DB' 'Architecture'
Ensure-Label 'area: contracts' '1D76DB' 'Contracts'
Ensure-Label 'area: core-agent' 'FBCA04' 'Core-Agent'
Ensure-Label 'area: socialfi' 'FBCA04' 'SocialFi'
Ensure-Label 'area: tristaciss' 'FBCA04' 'TriStaciss'
Ensure-Label 'area: observability' 'C2E0C6' 'Observability'
Ensure-Label 'area: api' 'C2E0C6' 'API'
Ensure-Label 'area: ui' 'C2E0C6' 'UI'
Ensure-Label 'priority: P0' 'B60205' 'Highest'
Ensure-Label 'priority: P1' 'D93F0B' 'High'
Ensure-Label 'stage: plan' 'EDEDED' 'Planning'
Ensure-Label 'stage: design' 'EDEDED' 'Design'
Ensure-Label 'stage: dev' '0052CC' 'Development'
Ensure-Label 'stage: test' '5319E7' 'Testing'
Ensure-Label 'stage: harden' 'BFD4F2' 'Hardening'

# Phase 0/1
Ensure-Issue '[Epic][Phase0] 契约先行：冻结边界并完成跨仓接口定义' @('type: epic','area: architecture','priority: P0','stage: plan') '来源：docs/refactor-phase0-1-issue-pack.md（Epic A）'
Ensure-Issue '[Phase0][Contract] 定义 Message/Session/ToolCall/Audit 四类 Envelope' @('type: task','area: contracts','priority: P0','stage: design') '来源：docs/refactor-phase0-1-issue-pack.md（Issue P0-1）'
Ensure-Issue '[Phase0][Contract] 定义 Core-Agent -> TriStaciss LLM 调用契约' @('type: task','area: tristaciss','priority: P0','stage: design') '来源：docs/refactor-phase0-1-issue-pack.md（Issue P0-2）'
Ensure-Issue '[Phase0][Contract] 定义 SocialFi <-> Core-Agent 输入与回包契约' @('type: task','area: socialfi','priority: P0','stage: design') '来源：docs/refactor-phase0-1-issue-pack.md（Issue P0-3）'
Ensure-Issue '[Phase0][Policy] 定义 Safe Stop / Force Stop 与 lease-fencing 语义' @('type: task','area: architecture','priority: P0','stage: design') '来源：docs/refactor-phase0-1-issue-pack.md（Issue P0-4）'
Ensure-Issue '[Epic][Phase1] Core-Agent MVP：单会话最小闭环' @('type: epic','area: core-agent','priority: P0','stage: dev') '来源：docs/refactor-phase0-1-issue-pack.md（Epic B）'
Ensure-Issue '[Phase1][Core-Agent] 初始化项目骨架（gateway/router-queue/runner/runtime）' @('type: task','area: core-agent','priority: P0','stage: dev') '来源：docs/refactor-phase0-1-issue-pack.md（Issue P1-1）'
Ensure-Issue '[Phase1][Core-Agent] 实现 Gateway -> Router/Queue -> Runner 最小链路' @('type: task','area: core-agent','priority: P0','stage: dev') '来源：docs/refactor-phase0-1-issue-pack.md（Issue P1-2）'
Ensure-Issue '[Phase1][TriStaciss] 接入统一 LLM 出口（流式 + fallback 语义）' @('type: task','area: tristaciss','priority: P0','stage: dev') '来源：docs/refactor-phase0-1-issue-pack.md（Issue P1-3）'
Ensure-Issue '[Phase1][Observability] 接入最小 AuditEvent 与单会话 smoke' @('type: task','area: observability','priority: P0','stage: test') '来源：docs/refactor-phase0-1-issue-pack.md（Issue P1-4）'

# Observability O2/O3/O4
Ensure-Issue '[Epic][Phase2][Observability] 事件桥接与基础时间线上线' @('type: epic','area: observability','priority: P1','stage: dev') '来源：docs/observability-phase2-4-issue-pack.md（Epic O2）'
Ensure-Issue '[Phase2][Bridge] 实现审计事件 -> 统一观测事件适配器' @('type: task','area: observability','priority: P1','stage: dev') '来源：docs/observability-phase2-4-issue-pack.md（Issue O2-1）'
Ensure-Issue '[Phase2][Contract] 接入 observability-event-mapping v1 契约校验' @('type: task','area: contracts','priority: P1','stage: dev') '来源：docs/observability-phase2-4-issue-pack.md（Issue O2-2）'
Ensure-Issue '[Phase2][API] 提供 timeline/replay 查询接口（session/trace）' @('type: task','area: api','priority: P1','stage: dev') '来源：docs/observability-phase2-4-issue-pack.md（Issue O2-3）'
Ensure-Issue '[Epic][Phase3][Observability] 3D 场景与子代理可视化接入' @('type: epic','area: observability','priority: P1','stage: dev') '来源：docs/observability-phase2-4-issue-pack.md（Epic O3）'
Ensure-Issue '[Phase3][UI] 子代理关系树与事件跳转' @('type: task','area: ui','priority: P1','stage: dev') '来源：docs/observability-phase2-4-issue-pack.md（Issue O3-2）'
Ensure-Issue '[Epic][Phase4][Observability] 培训复盘与运维可解释收口' @('type: epic','area: observability','priority: P1','stage: harden') '来源：docs/observability-phase2-4-issue-pack.md（Epic O4）'
