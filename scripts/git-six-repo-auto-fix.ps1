param(
    [string[]]$RepoPaths = @(
        'D:\Code\ai\TriMetaverse',
        'D:\Code\ai\TriPilot',
        'D:\Code\ai\TriStaciss',
        'D:\Code\ai\TriAvatar',
        'D:\Code\ai\Tride',
        'D:\Code\ai\vscodium',
        'D:\Code\ai\TriDeployment',
        'D:\Code\ai\TriTest',
        'D:\Code\ai\TriMMC',
        'D:\Code\ai\TriRLC',
        'D:\Code\ai\TriMobile',
        'D:\Code\ai\TriMem',
        'D:\Code\ai\TriWeb4',
        'D:\Code\ai\TriChain',
        'D:\Code\ai\TriCompany',
        'D:\Code\ai\TriDev',
        'D:\Code\ai\TriGateway',
        'D:\Code\ai\TriModel',
        'D:\Code\ai\TriSkill',
        'D:\Code\ai\TriTraining'
    ),
    [switch]$Apply
)

$ErrorActionPreference = 'Stop'

function Invoke-Git {
    param(
        [string]$RepoPath,
        [string[]]$GitArgs
    )

    $output = & git -C $RepoPath @GitArgs 2>$null
    $ok = ($LASTEXITCODE -eq 0)

    return [pscustomobject]@{
        Ok  = $ok
        Out = if ($null -eq $output) { '' } else { ($output | Out-String).Trim() }
    }
}

function Test-RemoteBranchExists {
    param(
        [string]$RepoPath,
        [string]$BranchName
    )

    if ([string]::IsNullOrWhiteSpace($BranchName)) {
        return $false
    }

    $check = Invoke-Git -RepoPath $RepoPath -GitArgs @('show-ref', '--verify', '--quiet', "refs/remotes/origin/$BranchName")
    return $check.Ok
}

$mode = if ($Apply) { 'APPLY' } else { 'DRY_RUN' }
Write-Host "Mode: $mode"

$rows = @()

foreach ($repo in $RepoPaths) {
    $name = Split-Path $repo -Leaf

    if (-not (Test-Path $repo)) {
        $rows += [pscustomobject]@{
            Repo    = $name
            Fixes   = 'PATH_NOT_FOUND'
            Result  = 'SKIPPED'
            Changed = 'NO'
        }
        continue
    }

    $inside = Invoke-Git -RepoPath $repo -GitArgs @('rev-parse', '--is-inside-work-tree')
    if (-not $inside.Ok -or $inside.Out -ne 'true') {
        $rows += [pscustomobject]@{
            Repo    = $name
            Fixes   = 'NOT_A_GIT_REPO'
            Result  = 'SKIPPED'
            Changed = 'NO'
        }
        continue
    }

    $branchRes = Invoke-Git -RepoPath $repo -GitArgs @('branch', '--show-current')
    $currentBranch = if ($branchRes.Ok -and -not [string]::IsNullOrWhiteSpace($branchRes.Out)) { $branchRes.Out } else { 'DETACHED' }

    $upstreamRes = Invoke-Git -RepoPath $repo -GitArgs @('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}')
    $upstreamUnset = -not $upstreamRes.Ok

    $originHeadRes = Invoke-Git -RepoPath $repo -GitArgs @('symbolic-ref', '--short', 'refs/remotes/origin/HEAD')
    $originHeadUnset = -not $originHeadRes.Ok

    $plannedFixes = @()
    $changed = $false

    if ($upstreamUnset -and $currentBranch -ne 'DETACHED') {
        if (Test-RemoteBranchExists -RepoPath $repo -BranchName $currentBranch) {
            $plannedFixes += "set-upstream: origin/$currentBranch"
            if ($Apply) {
                $setUpstream = Invoke-Git -RepoPath $repo -GitArgs @('branch', '--set-upstream-to', "origin/$currentBranch", $currentBranch)
                if ($setUpstream.Ok) { $changed = $true }
            }
        } else {
            $plannedFixes += 'set-upstream: skipped(remote branch missing)'
        }
    }

    if ($originHeadUnset) {
        $targetHead = $null
        if ($currentBranch -ne 'DETACHED' -and (Test-RemoteBranchExists -RepoPath $repo -BranchName $currentBranch)) {
            $targetHead = $currentBranch
        } elseif (Test-RemoteBranchExists -RepoPath $repo -BranchName 'dev') {
            $targetHead = 'dev'
        } elseif (Test-RemoteBranchExists -RepoPath $repo -BranchName 'main') {
            $targetHead = 'main'
        } elseif (Test-RemoteBranchExists -RepoPath $repo -BranchName 'master') {
            $targetHead = 'master'
        }

        if ($null -ne $targetHead) {
            $plannedFixes += "set-origin-head: $targetHead"
            if ($Apply) {
                $setHead = Invoke-Git -RepoPath $repo -GitArgs @('remote', 'set-head', 'origin', $targetHead)
                if ($setHead.Ok) { $changed = $true }
            }
        } else {
            $plannedFixes += 'set-origin-head: skipped(no candidate branch)'
        }
    }

    if ($plannedFixes.Count -eq 0) {
        $plannedFixes += 'none'
    }

    $rows += [pscustomobject]@{
        Repo    = $name
        Fixes   = ($plannedFixes -join '; ')
        Result  = if ($Apply) { 'APPLIED' } else { 'PLANNED' }
        Changed = if ($changed) { 'YES' } else { 'NO' }
    }
}

$rows | Sort-Object Repo | Format-Table -AutoSize

if ($Apply) {
    $changedCount = ($rows | Where-Object { $_.Changed -eq 'YES' }).Count
    Write-Host "`nSummary: $($rows.Count) repos scanned, $changedCount repos changed."
} else {
    $planCount = ($rows | Where-Object { $_.Fixes -ne 'none' }).Count
    Write-Host "`nSummary: $($rows.Count) repos scanned, $planCount repos need fixes."
    Write-Host "Run with -Apply to execute fixes."
}
