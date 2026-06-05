param(
    [string[]]$RepoPaths = @(
        'D:\OneDrive\Code\ai\TriMetaverse',
        'D:\OneDrive\Code\ai\TriPilot',
        'D:\OneDrive\Code\ai\TriStaciss',
        'D:\OneDrive\Code\ai\Avatar-react',
        'D:\OneDrive\Code\ai\Opentride',
        'D:\OneDrive\Code\ai\vscodium'
    )
)

$ErrorActionPreference = 'Stop'

function Invoke-Git {
    param(
        [string]$RepoPath,
        [string[]]$GitArgs
    )

    $raw = & git -C $RepoPath @GitArgs 2>$null
    if ($LASTEXITCODE -ne 0) {
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
            Status     = 'NOT_A_GIT_REPO'
            Issue      = 'YES'
        }
        continue
    }

    $branch = Invoke-Git -RepoPath $repo -GitArgs @('branch', '--show-current')
    if ([string]::IsNullOrWhiteSpace($branch)) { $branch = 'DETACHED' }

    $status = Invoke-Git -RepoPath $repo -GitArgs @('status', '-sb')
    if (-not [string]::IsNullOrWhiteSpace($status)) {
        $status = ($status -split "`r?`n")[0]
    } else {
        $status = 'STATUS_UNKNOWN'
    }

    $upstream = Invoke-Git -RepoPath $repo -GitArgs @('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}')
    if ([string]::IsNullOrWhiteSpace($upstream)) { $upstream = 'UPSTREAM_UNSET' }

    $originHead = Invoke-Git -RepoPath $repo -GitArgs @('symbolic-ref', '--short', 'refs/remotes/origin/HEAD')
    if ([string]::IsNullOrWhiteSpace($originHead)) { $originHead = 'ORIGIN_HEAD_UNSET' }

    $hasIssue = $false
    if ($upstream -eq 'UPSTREAM_UNSET') { $hasIssue = $true }
    if ($originHead -eq 'ORIGIN_HEAD_UNSET') { $hasIssue = $true }
    if ($status -match '\[ahead|behind') { $hasIssue = $true }

    $rows += [pscustomobject]@{
        Repo       = $name
        Branch     = $branch
        Upstream   = $upstream
        OriginHead = $originHead
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
