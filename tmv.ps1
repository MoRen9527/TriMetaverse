param(
    [Parameter(Position = 0)]
    [string]$Command = "",

    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments = @()
)

$triMetaverseRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$devTaskScript = Join-Path $triMetaverseRoot "scripts\dev-task.ps1"

function Show-Usage {
    Write-Output "TriMetaverse CLI"
    Write-Output ""
    Write-Output "Usage:"
    Write-Output '  .\tmv.cmd dev-task "<task description>"'
    Write-Output '  .\tmv.ps1 dev-task "<task description>"'
    Write-Output '  .\tmv.cmd dev-task --intake-only "<task description>"'
    Write-Output ""
    Write-Output "Commands:"
    Write-Output "  dev-task    Create an IPD case and run autopilot until real execution evidence is required."
}

if ($Command -eq "" -or $Command -eq "/help" -or $Command -eq "help" -or $Command -eq "-h" -or $Command -eq "--help") {
    Show-Usage
    exit 0
}

if ($Command -eq "dev-task") {
    & $devTaskScript @Arguments
    exit $LASTEXITCODE
}

throw "Unknown tmv command: $Command"
