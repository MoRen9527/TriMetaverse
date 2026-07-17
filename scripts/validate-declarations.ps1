# Validate Declarations 鈥?澹版槑 vs 瀹為檯 浜旂淮鏍￠獙
# TWF-001 搂3 | CTO 灏忕媱 | 2026-07-17
# 鐢ㄦ硶: .\validate-declarations.ps1 [-Trigger startup|pre-commit|weekly] [-Quick]
# 閫€鍑虹爜: 0=PASS, 1=CRITICAL found, 2=HIGH found, 3=MEDIUM only, 4=LOW only

param(
    [ValidateSet('startup', 'pre-commit', 'weekly')]
    [string]$Trigger = 'startup',
    [switch]$Quick  # pre-commit 妯″紡锛氫粎妫€鏌?CRITICAL
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Path $PSScriptRoot -Parent
$report = @{
    runAt       = (Get-Date -Format 'o')
    environment = 'copilot-cli'
    trigger     = $Trigger
    results     = @{ critical = @(); high = @(); medium = @(); low = @() }
    summary     = ''
}

function Add-Finding($level, $file, $claim, $actual, $action) {
    $report.results.$level += @{ file = $file; claim = $claim; actual = $actual; action = $action }
}

# ============================================================
# 缁村害 1: code-state.md 澹版槑鐨勮矾寰?鈫?鏂囦欢绯荤粺瀹為檯瀛樺湪
# ============================================================
function Test-CodeStatePaths {
    $codeStateFile = Join-Path $repoRoot 'docs\registry\code-state.md'
    if (-not (Test-Path $codeStateFile)) {
        Add-Finding 'critical' $codeStateFile 'code-state.md exists' 'file not found' 'recreate code-state.md'
        return
    }

    # Extract path-like patterns from code-state.md prose
    # Patterns: backtick-quoted paths, lines with directory mentions
    $content = Get-Content $codeStateFile -Raw
    $patterns = @(
        '`([^`]+/)`',                          # backtick paths ending with /
        '`docs/registry/([^`]+\.md)`',         # registry .md files
        '`scripts/([^`]+)`',                   # scripts references
        '\b(docs/\S+\.md)\b',                  # bare .md paths
        '\b(scripts/\S+)\b',                   # bare scripts paths
        '\b(mermaid/\S+)\b',                   # mermaid paths
        '\b(\.github/\S+)\b'                   # .github paths
    )

    $seen = @{}
    foreach ($pat in $patterns) {
        $matches = [regex]::Matches($content, $pat)
        foreach ($m in $matches) {
            $path = $m.Groups[1].Value -replace '\(\)$',''  # strip trailing ()
            $path = $path -replace '/$',''                   # strip trailing /
            if ($path -match '\.\./|http|node_modules|\.codegraph|\.git/|vendor/') { continue }
            if ($seen.ContainsKey($path)) { continue }
            $seen[$path] = $true

            $fullPath = Join-Path $repoRoot $path
            if (-not (Test-Path $fullPath)) {
                Add-Finding 'critical' $codeStateFile "code-state references '$path'" 'path does not exist' "verify path or update code-state.md"
            }
        }
    }

    # Also check Repository Map section explicitly
    $repoMapSection = if ($content -match '## Repository Map\n((?:.|\n)*?)(?=\n## |\Z)') { $matches[1] } else { '' }
    $repoMapPaths = [regex]::Matches($repoMapSection, '`([^`]+)`')
    foreach ($m in $repoMapPaths) {
        $path = $m.Groups[1].Value
        if ($path -match '^\.{2}|^http|^node_modules') { continue }
        # Skip prose-only references (like "褰撳墠鏈缓绔嬬郴缁熷寲...")
        if ($path -notmatch '[/\\]' -and $path -notmatch '^\.') { continue }
        $fullPath = Join-Path $repoRoot $path
        if (-not (Test-Path $fullPath)) {
            Add-Finding 'critical' $codeStateFile "Repository Map lists '$path'" 'path does not exist' "verify path or update code-state.md"
        }
    }
}

# ============================================================
# 缁村害 2: product-state.md 鉁?鈫?code-state 瀵瑰簲
# ============================================================
function Test-ProductStateConsistency {
    $productStateFile = Join-Path $repoRoot 'docs\registry\product-state.md'
    if (-not (Test-Path $productStateFile)) {
        Add-Finding 'high' $productStateFile 'product-state.md exists' 'file not found' 'recreate product-state.md'
        return
    }

    $psContent = Get-Content $productStateFile -Raw
    $codeStateFile = Join-Path $repoRoot 'docs\registry\code-state.md'
    $csContent = if (Test-Path $codeStateFile) { Get-Content $codeStateFile -Raw } else { '' }

    # Check for 鉁?markers in product-state and cross-reference with code-state
    $checkMarks = [regex]::Matches($psContent, '鉁匼s*([^\n]+)')
    foreach ($m in $checkMarks) {
        $claim = $m.Groups[1].Value.Trim()
        # Check if the claimed item appears in code-state (case-insensitive keyword check)
        if ($csContent -and $claim.Length -gt 3 -and $csContent -notmatch [regex]::Escape($claim.Substring(0, [Math]::Min(20, $claim.Length)))) {
            Add-Finding 'high' $productStateFile "product-state 鉁?'$claim'" 'no matching reference in code-state.md' 'CPO澶嶆煡: 鏄惁闇€瑕佸悓姝?code-state'
        }
    }
}

# ============================================================
# 缁村害 3: OP JSON done 鈫?git commit
# ============================================================
function Test-OPJsonGitConsistency {
    $opDir = Join-Path $repoRoot 'docs\workflow\operating-records'

    # Find latest OP JSON
    $latestOps = Get-ChildItem $opDir -Recurse -Filter 'OP-*.json' |
        Where-Object { $_.Name -notmatch 'unresolved|sha256' } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 3

    foreach ($opFile in $latestOps) {
        try {
            $op = Get-Content $opFile.FullName -Raw | ConvertFrom-Json
        } catch {
            Add-Finding 'medium' $opFile.FullName 'valid JSON' "parse error: $_" 'fix OP JSON format'
            continue
        }

        if (-not $op.nextActions) { continue }

        foreach ($action in $op.nextActions) {
            if ($action.status -eq 'done' -and $action.id) {
                # Search git log for action ID reference
                $gitResult = git -C $repoRoot log --oneline --all --grep=$action.id 2>$null
                if (-not $gitResult) {
                    # Also try searching for related keywords
                    $keywords = if ($action.title) { $action.title } else { '' }
                    $gitResult2 = if ($keywords) { git -C $repoRoot log --oneline -20 --grep=$keywords 2>$null } else { $null }
                    if (-not $gitResult2) {
                        Add-Finding 'medium' $opFile.Name "OP marks '$($action.id)' done" 'no matching git commit found' 'CEOChiefOfStaff: commit or update OP status'
                    }
                }
            }
        }
    }
}

# ============================================================
# 缁村害 4: tree_nodes done 鈫?delivery field
# ============================================================
function Test-TreeNodeDelivery {
    $treeExportFile = Join-Path $repoRoot 'docs\workflow\tree-nodes-export.json'
    if (-not (Test-Path $treeExportFile)) {
        Add-Finding 'low' $treeExportFile 'tree_nodes export exists' 'no export file found' 'run tree-nodes export (not yet implemented)'
        return
    }

    try {
        $trees = Get-Content $treeExportFile -Raw | ConvertFrom-Json
        foreach ($tree in $trees) {
            foreach ($node in $tree.nodes) {
                if ($node.status -eq 'done' -and (-not $node.delivery -or $node.delivery -eq '')) {
                    Add-Finding 'low' $treeExportFile "tree_node '$($node.id)' done" 'delivery field empty' '琛ュ啓 delivery 鎻忚堪'
                }
            }
        }
    } catch {
        Add-Finding 'low' $treeExportFile 'valid JSON export' "parse error: $_" 'regenerate tree-nodes export'
    }
}

# ============================================================
# 缁村害 5: git working tree 鈫?stale changes
# ============================================================
function Test-GitWorkingTree {
    Push-Location $repoRoot
    try {
        $status = git status --short 2>$null
        if ($status) {
            $lines = ($status -split '\n').Count
            # Check if there are modified files (not just new/untracked)
            $modified = ($status | Where-Object { $_ -match '^\s*M' }).Count
            if ($modified -gt 0) {
                Add-Finding 'low' 'git working tree' 'clean working tree' "$modified modified file(s) uncommitted" 'commit or stash changes'
            }

            # W29 OP JSON specifically: check modified OP files
            $opModified = ($status | Where-Object { $_ -match 'OP-.*\.json' }).Count
            if ($opModified -gt 0) {
                Add-Finding 'medium' 'git working tree' 'OP files committed' "$opModified OP file(s) modified but uncommitted" 'commit OP changes or revert'
            }
        }
    } finally {
        Pop-Location
    }
}

# ============================================================
# 鎵ц
# ============================================================
Write-Output "=== Validate Declarations ==="
Write-Output "Trigger: $Trigger | Quick: $Quick | Repo: $repoRoot"
Write-Output ""

# 濮嬬粓杩愯缁村害 1 鍜?5锛堟枃浠剁郴缁?+ git锛?
Write-Output "[1/5] code-state paths..."
Test-CodeStatePaths

if (-not $Quick) {
    Write-Output "[2/5] product-state consistency..."
    Test-ProductStateConsistency

    Write-Output "[3/5] OP JSON 鈫?git..."
    Test-OPJsonGitConsistency

    Write-Output "[4/5] tree_nodes delivery..."
    Test-TreeNodeDelivery
}

Write-Output "[5/5] git working tree..."
Test-GitWorkingTree

# 鐢熸垚鎽樿
$c = $report.results.critical.Count
$h = $report.results.high.Count
$m = $report.results.medium.Count
$l = $report.results.low.Count
$report.summary = "$c critical / $h high / $m medium / $l low"

# 杈撳嚭 JSON
$json = $report | ConvertTo-Json -Depth 5
Write-Output ""
Write-Output $json

# 閫€鍑虹爜
if ($c -gt 0) { exit 1 }
if ($h -gt 0) { exit 2 }
if ($m -gt 0) { exit 3 }
if ($l -gt 0) { exit 4 }
exit 0
