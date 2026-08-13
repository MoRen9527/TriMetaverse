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
        'D:\Code\ai\TriMC',
        'D:\Code\ai\TriLC',
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
    )
)

$ErrorActionPreference = 'Stop'

function Invoke-Git {
    param(
        [string]$RepoPath,
        [string[]]$GitArgs
    )

    $prevEAP = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    $raw = & git -C $RepoPath @GitArgs 2>$null
    $exitCode = $LASTEXITCODE
    $ErrorActionPreference = $prevEAP
    if ($exitCode -ne 0) {
        return $null
    }

    if ($null -eq $raw) {
        return ''
    }

    return ($raw | Out-String).Trim()
}

$rows = @()

foreach ($repo in $RepoPaths) {
    $name = Split-Path $repo -Leaf

    if (-not (Test-Path $repo)) {
        $rows += [pscustomobject]@{
            Repo       = $name
            Branch     = 'N/A'
            Upstream   = 'N/A'
            OriginHead = 'N/A'
            Dirty      = 'N/A'
            Status     = 'PATH_NOT_FOUND'
            Issue      = 'YES'
        }
        continue
    }

    $inside = Invoke-Git -RepoPath $repo -GitArgs @('rev-parse', '--is-inside-work-tree')
    if ($inside -ne 'true') {
        $rows += [pscustomobject]@{
            Repo       = $name
            Branch     = 'N/A'
            Upstream   = 'N/A'
            OriginHead = 'N/A'
            Dirty      = 'N/A'
            Status     = 'NOT_A_GIT_REPO'
            Issue      = 'YES'
        }
        continue
    }

    $branch = Invoke-Git -RepoPath $repo -GitArgs @('branch', '--show-current')
    if ([string]::IsNullOrWhiteSpace($branch)) { $branch = 'DETACHED' }

    $porcelain = Invoke-Git -RepoPath $repo -GitArgs @('status', '--porcelain', '-b')
    if (-not [string]::IsNullOrWhiteSpace($porcelain)) {
        $lines = $porcelain -split "`r?`n"
        $status = $lines[0]
        $dirtyCount = $lines.Count - 1
    } else {
        $status = 'STATUS_UNKNOWN'
        $dirtyCount = 0
    }

    $upstream = Invoke-Git -RepoPath $repo -GitArgs @('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}')
    if ([string]::IsNullOrWhiteSpace($upstream)) { $upstream = 'UPSTREAM_UNSET' }

    $originHead = Invoke-Git -RepoPath $repo -GitArgs @('symbolic-ref', '--short', 'refs/remotes/origin/HEAD')
    if ([string]::IsNullOrWhiteSpace($originHead)) { $originHead = 'ORIGIN_HEAD_UNSET' }

    $hasIssue = $false
    if ($upstream -eq 'UPSTREAM_UNSET') { $hasIssue = $true }
    if ($originHead -eq 'ORIGIN_HEAD_UNSET') { $hasIssue = $true }
    if ($status -match '\[ahead|behind') { $hasIssue = $true }
    if ($dirtyCount -gt 0) { $hasIssue = $true }

    $rows += [pscustomobject]@{
        Repo       = $name
        Branch     = $branch
        Upstream   = $upstream
        OriginHead = $originHead
        Dirty      = $dirtyCount
        Status     = $status
        Issue      = if ($hasIssue) { 'YES' } else { 'NO' }
    }
}

$rows | Sort-Object Repo | Format-Table -AutoSize

$issueCount = ($rows | Where-Object { $_.Issue -eq 'YES' }).Count
Write-Host "`nSummary: $($rows.Count) repos checked, $issueCount issues found."

if ($issueCount -gt 0) {
    exit 1
}

exit 0
