param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments = @()
)

$workspaceRoot = ""
$tridevRoot = ""
$intakeOnly = $false
$manualCeoSignoff = $false
$noTridevBridge = $false
$nonStrictRelease = $false
$autoApproveRoles = New-Object System.Collections.Generic.List[string]
$taskParts = New-Object System.Collections.Generic.List[string]

for ($index = 0; $index -lt $Arguments.Count; $index++) {
    $argument = [string]$Arguments[$index]
    if ($argument -eq "-WorkspaceRoot" -or $argument -eq "--workspace-root") {
        if ($index + 1 -ge $Arguments.Count) {
            throw "Workspace root value is required after $argument"
        }
        $workspaceRoot = [string]$Arguments[$index + 1]
        $index++
        continue
    }
    if ($argument -eq "--tridev-root") {
        if ($index + 1 -ge $Arguments.Count) {
            throw "TriDev root value is required after $argument"
        }
        $tridevRoot = [string]$Arguments[$index + 1]
        $index++
        continue
    }
    if ($argument -eq "--auto-approve-role") {
        if ($index + 1 -ge $Arguments.Count) {
            throw "Auto-approve role value is required after $argument"
        }
        $autoApproveRoles.Add([string]$Arguments[$index + 1])
        $index++
        continue
    }
    if ($argument -eq "--intake-only") {
        $intakeOnly = $true
        continue
    }
    if ($argument -eq "--manual-ceo-signoff") {
        $manualCeoSignoff = $true
        continue
    }
    if ($argument -eq "--no-tridev-bridge") {
        $noTridevBridge = $true
        continue
    }
    if ($argument -eq "--non-strict-release") {
        $nonStrictRelease = $true
        continue
    }
    $taskParts.Add($argument)
}

$taskDescription = ($taskParts -join " ").Trim()
if (-not $taskDescription) {
    throw "Task description is required."
}

$triMetaverseRoot = Split-Path -Parent $PSScriptRoot
$triCompanyRoot = Join-Path (Split-Path -Parent $triMetaverseRoot) "TriCompany"
if (-not (Test-Path -LiteralPath $triCompanyRoot)) {
    throw "TriCompany root not found: $triCompanyRoot"
}

$intakeCommand = @(
    "-m",
    "runtime.cognition.chief_of_staff_ipd_case",
    "task-intake"
)
if ($workspaceRoot.Trim()) {
    $intakeCommand += @("--workspace-root", $workspaceRoot.Trim())
}
$intakeCommand += $taskDescription

function Invoke-PythonJsonCommand {
    param(
        [string[]]$Command
    )

    $outputText = (& python @Command) -join [Environment]::NewLine
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
        if ($outputText) {
            Write-Output $outputText
        }
        exit $exitCode
    }
    if (-not $outputText.Trim()) {
        throw "Python command returned no JSON output: python $($Command -join ' ')"
    }
    try {
        return @{
            raw = $outputText
            json = $outputText | ConvertFrom-Json
        }
    }
    catch {
        throw "Failed to parse JSON output from command: python $($Command -join ' ')"
    }
}

Push-Location $triCompanyRoot
try {
    $intakeResult = Invoke-PythonJsonCommand -Command $intakeCommand
    $caseId = [string]$intakeResult.json.caseId
    if (-not $caseId.Trim()) {
        throw "task-intake did not return a caseId."
    }

    if ($intakeOnly) {
        Write-Output $intakeResult.raw
        exit 0
    }

    $autopilotCommand = @(
        "-m",
        "runtime.cognition.chief_of_staff_ipd_case",
        "autopilot",
        "--case-id",
        $caseId
    )
    if ($workspaceRoot.Trim()) {
        $autopilotCommand += @("--workspace-root", $workspaceRoot.Trim())
    }
    if ($tridevRoot.Trim()) {
        $autopilotCommand += @("--tridev-root", $tridevRoot.Trim())
    }
    if ($manualCeoSignoff) {
        $autopilotCommand += "--manual-ceo-signoff"
    }
    if ($noTridevBridge) {
        $autopilotCommand += "--no-tridev-bridge"
    }
    if ($nonStrictRelease) {
        $autopilotCommand += "--non-strict-release"
    }
    foreach ($role in $autoApproveRoles) {
        $autopilotCommand += @("--auto-approve-role", $role)
    }

    $autopilotResult = Invoke-PythonJsonCommand -Command $autopilotCommand
    $summary = [ordered]@{
        caseId = $caseId
        intake = $intakeResult.json
        autopilot = $autopilotResult.json
    }
    $summary | ConvertTo-Json -Depth 100
}
finally {
    Pop-Location
}
