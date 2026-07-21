# validate-tree-status-enums.ps1
# Trees protocol v0.3 status enum validation
# Scans all tree-op.json and reports non-compliant status values

param(
    [switch]$Fix,
    [switch]$Verbose
)

$ErrorActionPreference = 'Stop'
$baseDir = $PSScriptRoot
$repoRoot = Split-Path -Parent $baseDir
$recordsDir = Join-Path $repoRoot 'docs\workflow\operating-records'

# Valid enums per protocol v0.3
$validNodeStatuses = @('pending', 'in_progress', 'done', 'escalated')
$validTreeStatuses = @('active', 'done', 'escalated')

$issues = @()
$fixed = @()
$checked = 0

Write-Host "=== Trees Protocol v0.3 Status Enum Validation ==="
Write-Host ""

$treeOps = Get-ChildItem -Path $recordsDir -Recurse -Filter 'tree-op.json' -ErrorAction SilentlyContinue

foreach ($treeOp in $treeOps) {
    $checked++
    $relPath = $treeOp.FullName.Replace($recordsDir, '').TrimStart('\')

    try {
        $json = Get-Content $treeOp.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
    } catch {
        $issues += "[PARSE] $relPath - JSON parse error: $_"
        continue
    }

    # Check tree-level status
    if ($json.status -and $json.status -notin $validTreeStatuses) {
        $issues += "[TREE] $relPath - status '$($json.status)' invalid"
    }

    # Check node-level status
    if ($json.nodes) {
        foreach ($node in $json.nodes) {
            if ($node.status -notin $validNodeStatuses) {
                $detail = "[NODE] $relPath -> $($node.nodeId) = '$($node.status)'"
                $issues += $detail
                if ($Verbose) { Write-Host "  $detail" }
            }
        }
    }

    # Check phases (TWF-002 pattern)
    if ($json.phases) {
        foreach ($phase in $json.phases) {
            if ($phase.status -and $phase.status -notin $validNodeStatuses) {
                if ($phase.status -eq 'active' -and $Fix) {
                    $phase.status = 'in_progress'
                    $json | ConvertTo-Json -Depth 6 | Set-Content $treeOp.FullName -Encoding UTF8 -NoNewline
                    $msg = "FIXED: Phase $($phase.phase) active -> in_progress"
                    $fixed += $msg
                    Write-Host "  $msg"
                } else {
                    $issues += "[PHASE] $relPath Phase $($phase.phase) = '$($phase.status)'"
                }
            }
        }
    }
}

# Report
Write-Host ""
Write-Host "=== Results ==="
Write-Host "Scanned : $checked files"
Write-Host "Issues  : $($issues.Count)"
Write-Host "Fixed   : $($fixed.Count)"

if ($issues.Count -gt 0) {
    Write-Host ""
    Write-Host "--- Issues ---"
    foreach ($issue in $issues) { Write-Host "  $issue" }
}

if ($fixed.Count -gt 0) {
    Write-Host ""
    Write-Host "--- Auto-fixed ---"
    foreach ($f in $fixed) { Write-Host "  $f" }
}

if ($issues.Count -eq 0) {
    Write-Host ""
    Write-Host "OK - All tree-op.json status enums compliant"
    exit 0
} else {
    Write-Host ""
    Write-Host "FAIL - Found $($issues.Count) non-compliant items"
    exit 1
}