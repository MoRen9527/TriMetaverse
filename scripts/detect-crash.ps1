# Detect Crash -- Phase A detection (Copilot CLI, Plan A)
# TWF-001 A.3 | CTO XiaoDi | 2026-07-17
# Usage: .\detect-crash.ps1
# Exit codes: 0=no crash, 1=CRITICAL crash, 2=WARNING only

param(
    [switch]$Verbose
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Path $PSScriptRoot -Parent

$report = @{
    detectedAt   = (Get-Date -Format 'o')
    environment  = 'copilot-cli'
    crashDetected = $false
    severity      = 'none'
    signals       = @()
    activeNodes   = @()
    recommendation = ''
}

# ============================================================
# A-S3: registry declarations vs filesystem (reuse validate-declarations)
# ============================================================
function Test-A-S3 {
    Write-Output "[A-S3] Running validate-declarations -Quick..."
    $validateScript = Join-Path $repoRoot 'scripts\validate-declarations.ps1'
    if (-not (Test-Path $validateScript)) {
        $report.signals += @{ signal = 'A-S3'; status = 'SKIPPED'; reason = 'validate-declarations.ps1 not found' }
        return
    }

    $result = & $validateScript -Trigger 'startup' -Quick 2>&1
    $exitCode = $LASTEXITCODE

    if ($exitCode -eq 1) {
        $report.signals += @{ signal = 'A-S3'; status = 'TRIGGERED'; level = 'CRITICAL'; detail = 'validation found critical path mismatches' }
        $report.crashDetected = $true
        $report.severity = 'CRITICAL'
    } elseif ($exitCode -eq 2) {
        $report.signals += @{ signal = 'A-S3'; status = 'WARNING'; level = 'HIGH'; detail = 'validation found product-state gaps' }
    } else {
        $report.signals += @{ signal = 'A-S3'; status = 'PASS'; level = 'OK' }
    }
}

# ============================================================
# A-S2: tree_nodes with active status over 2h
# ============================================================
function Test-A-S2 {
    Write-Output "[A-S2] Checking tree_nodes for stale active nodes..."
    $treeExport = Join-Path $repoRoot 'docs\workflow\tree-nodes-export.json'

    if (-not (Test-Path $treeExport)) {
        # Fallback: check if we can query SQLite (within same Copilot session)
        $report.signals += @{ signal = 'A-S2'; status = 'SKIPPED'; reason = 'tree-nodes-export.json not found (new session?)' }
        return
    }

    try {
        $trees = Get-Content $treeExport -Raw | ConvertFrom-Json
        $now = Get-Date
        $staleNodes = @()

        foreach ($tree in $trees) {
            foreach ($node in $tree.nodes) {
                if ($node.status -eq 'active') {
                    $report.activeNodes += @{
                        treeId = $tree.id
                        nodeId = $node.id
                        agent  = $node.agent
                        action = $node.action
                    }

                    if ($node.updated_at) {
                        $updated = [DateTime]::Parse($node.updated_at)
                        $elapsed = $now - $updated
                        if ($elapsed.TotalHours -gt 2) {
                            $staleNodes += "$($node.id) ($($node.agent)) idle $([Math]::Round($elapsed.TotalHours, 1))h"
                        }
                    }
                }
            }
        }

        if ($staleNodes.Count -gt 0) {
            $report.signals += @{
                signal = 'A-S2'
                status = 'TRIGGERED'
                level  = 'MEDIUM'
                detail = "Stale active nodes: $($staleNodes -join ', ')"
            }
        } else {
            $report.signals += @{ signal = 'A-S2'; status = 'PASS'; level = 'OK' }
        }
    } catch {
        $report.signals += @{ signal = 'A-S2'; status = 'ERROR'; reason = "parse error: $_" }
    }
}

# ============================================================
# A-S1: scan Copilot session files for empty messages
# ============================================================
function Test-A-S1 {
    Write-Output "[A-S1] Scanning Copilot session files for empty messages..."
    $sessionDir = "$env:USERPROFILE\.copilot\session-state"

    if (-not (Test-Path $sessionDir)) {
        $report.signals += @{ signal = 'A-S1'; status = 'SKIPPED'; reason = 'session-state dir not found' }
        return
    }

    # Find most recent session directory
    $latestSession = Get-ChildItem $sessionDir -Directory |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if (-not $latestSession) {
        $report.signals += @{ signal = 'A-S1'; status = 'SKIPPED'; reason = 'no session directories found' }
        return
    }

    $checkpointDir = Join-Path $latestSession.FullName 'checkpoints'
    if (-not (Test-Path $checkpointDir)) {
        $report.signals += @{ signal = 'A-S1'; status = 'SKIPPED'; reason = 'no checkpoints in latest session' }
        return
    }

    # Look for checkpoint files that might contain empty assistant messages
    $checkpoints = Get-ChildItem $checkpointDir -Filter '*.md' |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 5

    $emptyPattern = 'content.*""\s*.*tool_calls.*null'  # Simplified pattern
    $suspiciousFiles = @()

    foreach ($cp in $checkpoints) {
        try {
            $content = Get-Content $cp.FullName -Raw -ErrorAction SilentlyContinue
            if ($content -match 'content["[\x27]]?\s*:\s*["[\x27]]?\s*["[\x27]]?\s*[,}]' -and
                $content -match 'tool_calls["[\x27]]?\s*:\s*(null|\[\])') {
                $suspiciousFiles += $cp.Name
            }
        } catch { }
    }

    if ($suspiciousFiles.Count -gt 0) {
        $report.signals += @{
            signal = 'A-S1'
            status = 'TRIGGERED'
            level  = 'CRITICAL'
            detail = "Suspicious empty messages in: $($suspiciousFiles -join ', ')"
        }
        $report.crashDetected = $true
        $report.severity = 'CRITICAL'
    } else {
        $report.signals += @{ signal = 'A-S1'; status = 'PASS'; level = 'OK' }
    }
}

# ============================================================
# A-S4: git working tree dirty + tree_node done
# ============================================================
function Test-A-S4 {
    Write-Output "[A-S4] Cross-checking git status vs tree_nodes..."
    Push-Location $repoRoot
    try {
        $dirtyFiles = git status --short 2>$null
        if (-not $dirtyFiles) {
            $report.signals += @{ signal = 'A-S4'; status = 'PASS'; level = 'OK' }
            return
        }

        # Check if any active/done tree nodes have matching delivery files that are dirty
        $treeExport = Join-Path $repoRoot 'docs\workflow\tree-nodes-export.json'
        if (-not (Test-Path $treeExport)) {
            $report.signals += @{ signal = 'A-S4'; status = 'SKIPPED'; reason = 'no tree export to cross-check' }
            return
        }

        $trees = Get-Content $treeExport -Raw | ConvertFrom-Json
        $dirtyPaths = ($dirtyFiles | ForEach-Object { $_ -replace '^\s*\S+\s+', '' })

        foreach ($tree in $trees) {
            foreach ($node in $tree.nodes) {
                if ($node.status -eq 'done' -and $node.delivery) {
                    foreach ($dp in $dirtyPaths) {
                        if ($node.delivery -match [regex]::Escape($dp)) {
                            $report.signals += @{
                                signal = 'A-S4'
                                status = 'TRIGGERED'
                                level  = 'MEDIUM'
                                detail = "node '$($node.id)' done but '$dp' has uncommitted changes"
                            }
                            return
                        }
                    }
                }
            }
        }
        $report.signals += @{ signal = 'A-S4'; status = 'PASS'; level = 'OK' }
    } finally {
        Pop-Location
    }
}

# ============================================================
# A-S5: OP JSON done vs tree_nodes consistency
# ============================================================
function Test-A-S5 {
    Write-Output "[A-S5] Checking OP JSON vs tree_nodes consistency..."
    $treeExport = Join-Path $repoRoot 'docs\workflow\tree-nodes-export.json'
    $opDir = Join-Path $repoRoot 'docs\workflow\operating-records'
    $latestOp = Get-ChildItem $opDir -Recurse -Filter 'OP-*.json' |
        Where-Object { $_.Name -notmatch 'unresolved|sha256' } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if (-not $latestOp -or -not (Test-Path $treeExport)) {
        $report.signals += @{ signal = 'A-S5'; status = 'SKIPPED'; reason = 'missing OP JSON or tree export' }
        return
    }

    try {
        $op = Get-Content $latestOp.FullName -Raw | ConvertFrom-Json
        $trees = Get-Content $treeExport -Raw | ConvertFrom-Json

        $opDoneIds = @{}
        foreach ($a in $op.nextActions) {
            if ($a.status -eq 'done') { $opDoneIds[$a.id] = $true }
        }

        $inconsistencies = @()
        foreach ($tree in $trees) {
            foreach ($node in $tree.nodes) {
                $opActionId = $tree.op_action_id
                if ($opDoneIds.ContainsKey($opActionId) -and $node.status -in @('pending', 'active')) {
                    $inconsistencies += "OP '$opActionId' done but node '$($node.id)' is $($node.status)"
                }
            }
        }

        if ($inconsistencies.Count -gt 0) {
            $report.signals += @{
                signal = 'A-S5'
                status = 'TRIGGERED'
                level  = 'MEDIUM'
                detail = ($inconsistencies -join '; ')
            }
        } else {
            $report.signals += @{ signal = 'A-S5'; status = 'PASS'; level = 'OK' }
        }
    } catch {
        $report.signals += @{ signal = 'A-S5'; status = 'ERROR'; reason = "parse error: $_" }
    }
}

# ============================================================
# Execution
# ============================================================
Write-Output "=== Crash Detection (Phase A) ==="
Write-Output ""

Test-A-S3
Test-A-S2
Test-A-S1
Test-A-S4
Test-A-S5

# Generate recommendation
$triggered = $report.signals | Where-Object { $_.status -eq 'TRIGGERED' }
$criticals = $triggered | Where-Object { $_.level -eq 'CRITICAL' }
$mediums   = $triggered | Where-Object { $_.level -eq 'MEDIUM' }

if ($criticals.Count -gt 0) {
    $report.recommendation = "IMMEDIATE: Enter Phase B recovery. $($criticals.Count) CRITICAL signal(s)."
} elseif ($mediums.Count -gt 0) {
    $report.recommendation = "WARNING: Report to CEO. $($mediums.Count) MEDIUM signal(s). No automatic recovery."
} else {
    $report.recommendation = "PASS: No crash signals detected."
}

$json = $report | ConvertTo-Json -Depth 4
Write-Output ""
Write-Output $json

if ($criticals.Count -gt 0) { exit 1 }
if ($mediums.Count -gt 0) { exit 2 }
exit 0