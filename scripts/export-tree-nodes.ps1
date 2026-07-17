# export-tree-nodes.ps1 — Task Tree Export Script (Plan A/B Shared)
# ============================================================================
# TWF-001 A.4 constraint 4: SQLite session DB does not survive sessions;
# tree_nodes must be persisted to git repo as JSON.
# TWF-001 B.4.2: TriMC syncs same JSON format on every state change.
#
# Usage:
#   Copilot CLI (manual):  After each tree change, export via SQL tool -> JSON
#   TriMC (auto):          API layer triggers on node state change
#   Validate mode:         .\export-tree-nodes.ps1 -Validate
#
# Exit codes: 0=OK, 1=format error, 2=data inconsistency

param(
    [switch]$Validate,          # Validate existing JSON only, no export
    [string]$DbPath,           # SQLite DB path (TriMC auto mode)
    [string]$OutputPath = "docs/workflow/tree-nodes-export.json"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Resolve-Path "$ScriptDir/.."
$FullOutputPath = Join-Path $RepoRoot $OutputPath

# ============================================================================
# Validate Mode
# ============================================================================
if ($Validate) {
    if (-not (Test-Path $FullOutputPath)) {
        Write-Host "[EXPORT] VALIDATE: tree-nodes-export.json not found — export needed" -ForegroundColor Red
        exit 2
    }

    try {
        $data = Get-Content $FullOutputPath -Raw | ConvertFrom-Json
    } catch {
        Write-Host "[EXPORT] VALIDATE: JSON parse failed: $_" -ForegroundColor Red
        exit 1
    }

    # Check required fields
    $errors = @()
    if (-not $data.format_version) { $errors += "Missing format_version" }
    if (-not $data.exported_at) { $errors += "Missing exported_at" }
    if (-not $data.trees) { $errors += "Missing trees array" }

    if ($data.trees) {
        foreach ($tree in $data.trees) {
            if (-not $tree.id) { $errors += "tree missing id" }
            if (-not $tree.nodes) { $errors += "tree '$($tree.id)' missing nodes" }
            if ($tree.nodes) {
                foreach ($node in $tree.nodes) {
                    if (-not $node.id) { $errors += "node missing id" }
                    if (-not $node.status) { $errors += "node '$($node.id)' missing status" }
                }
            }
            # Cross-check: tree.status vs nodes consistency
            $activeNodes = $tree.nodes | Where-Object { $_.status -eq 'active' -or $_.status -eq 'pending' }
            if ($tree.status -eq 'done' -and $activeNodes.Count -gt 0) {
                $errors += "tree '$($tree.id)' status=done but has $($activeNodes.Count) active/pending nodes"
            }
        }
    }

    if ($errors.Count -gt 0) {
        Write-Host "[EXPORT] VALIDATE: $($errors.Count) issues:" -ForegroundColor Yellow
        $errors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
        exit 2
    }

    # Output stats
    $totalTrees = $data.trees.Count
    $totalNodes = ($data.trees | ForEach-Object { $_.nodes.Count } | Measure-Object -Sum).Sum
    $activeCount = ($data.trees | ForEach-Object { ($_.nodes | Where-Object { $_.status -eq 'active' }).Count } | Measure-Object -Sum).Sum
    Write-Host "[EXPORT] VALIDATE PASS: $totalTrees trees, $totalNodes nodes, $activeCount active" -ForegroundColor Green
    exit 0
}

# ============================================================================
# Export Mode (TriMC auto / SQLite direct read)
# ============================================================================
if ($DbPath) {
    if (-not (Test-Path $DbPath)) {
        Write-Host "[EXPORT] SQLite DB not found: $DbPath" -ForegroundColor Red
        exit 1
    }

    $sqliteExe = Get-Command sqlite3 -ErrorAction SilentlyContinue
    if (-not $sqliteExe) {
        Write-Host "[EXPORT] sqlite3 CLI not found. Install it or use TriMC API to trigger export." -ForegroundColor Yellow
        Write-Host "[EXPORT] In Copilot CLI env, export via SQL tool by CEOChiefOfStaff." -ForegroundColor Yellow
        exit 1
    }

    $treesJson = & sqlite3 -json $DbPath "SELECT * FROM task_trees"
    $nodesJson = & sqlite3 -json $DbPath "SELECT * FROM tree_nodes ORDER BY tree_id, seq"

    $trees = $treesJson | ConvertFrom-Json
    $nodes = $nodesJson | ConvertFrom-Json

    $exportData = @{
        format_version = "1.0"
        exported_at     = (Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz")
        exported_by     = if ($env:TRIMC_AGENT) { $env:TRIMC_AGENT } else { "export-tree-nodes.ps1" }
        environment     = if ($env:TRIMC_AGENT) { "trimc" } else { "copilot-cli" }
        trees           = @()
    }

    foreach ($tree in $trees) {
        $treeNodes = $nodes | Where-Object { $_.tree_id -eq $tree.id } | ForEach-Object {
            @{
                id             = $_.id
                parent_node_id = if ($_.parent_node_id -eq "") { $null } else { $_.parent_node_id }
                agent          = $_.agent
                title          = ""
                action         = $_.action
                status         = $_.status
                delivery       = if ($_.delivery -eq "") { $null } else { $_.delivery }
                next_agent     = if ($_.next_agent -eq "") { $null } else { $_.next_agent }
                seq            = [int]$_.seq
            }
        }

        $exportData.trees += @{
            id           = $tree.id
            op_action_id = $tree.op_action_id
            title        = $tree.title
            root_agent   = $tree.root_agent
            status       = $tree.status
            created_at   = $tree.created_at
            updated_at   = $tree.updated_at
            nodes        = @($treeNodes)
        }
    }

    $exportJson = $exportData | ConvertTo-Json -Depth 10
    $exportJson | Set-Content -Path $FullOutputPath -Encoding UTF8
    Write-Host "[EXPORT] Exported to $FullOutputPath" -ForegroundColor Green
    Write-Host "[EXPORT] $($trees.Count) trees, $($nodes.Count) nodes" -ForegroundColor Green
    exit 0
}

# ============================================================================
# Copilot CLI Manual Mode Notice
# ============================================================================
Write-Host "[EXPORT] Copilot CLI env: cannot access session SQLite directly." -ForegroundColor Yellow
Write-Host "[EXPORT] Export via SQL tool by CEOChiefOfStaff, then validate:" -ForegroundColor Yellow
Write-Host "[EXPORT]   .\export-tree-nodes.ps1 -Validate" -ForegroundColor Yellow
Write-Host "[EXPORT] Or manually write to $FullOutputPath" -ForegroundColor Yellow
exit 0
