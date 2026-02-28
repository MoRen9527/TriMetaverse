param(
  [string]$SourceMmd = "docs/architecture-overall-unified.mmd",
  [string]$OutputSvg = "docs/agent_platform_arch.svg",
  [switch]$KeepTemp
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$sourcePath = (Resolve-Path (Join-Path $repoRoot $SourceMmd)).Path
$outputPath = Join-Path $repoRoot $OutputSvg
$outputDir = Split-Path -Parent $outputPath

if (-not (Test-Path $outputDir)) {
  New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$lines = Get-Content -Path $sourcePath -Encoding UTF8
$start = -1
$end = -1

for ($i = 0; $i -lt $lines.Count; $i++) {
  $line = $lines[$i].TrimStart([char]0xFEFF).Trim()

  if ($start -eq -1 -and $line -match '^```mermaid') {
    $start = $i
    continue
  }
  if ($start -ne -1 -and $line -match '^```$') {
    $end = $i
    break
  }
}

if ($start -ne -1 -and $end -ne -1 -and $end -gt ($start + 1)) {
  $diagramLines = $lines[($start + 1)..($end - 1)]
  $diagram = [string]::Join([Environment]::NewLine, $diagramLines)
} else {
  $diagram = [System.IO.File]::ReadAllText($sourcePath, $utf8NoBom)
}

$tmpPath = Join-Path $outputDir ".tmp_agent_platform_raw.mmd"
$compatPath = Join-Path $outputDir ".tmp_agent_platform_compat.mmd"

function Invoke-Mmdc {
  param(
    [string]$InputPath,
    [string]$TargetPath
  )

  $null = & npx -y @mermaid-js/mermaid-cli -i $InputPath -o $TargetPath -b transparent
  return [int]$LASTEXITCODE
}

[System.IO.File]::WriteAllText($tmpPath, $diagram, $utf8NoBom)
$exitCode = Invoke-Mmdc -InputPath $tmpPath -TargetPath $outputPath

if ($exitCode -ne 0) {
  $fwOpenParen = [string][char]0xFF08
  $fwCloseParen = [string][char]0xFF09
  $fwColon = [string][char]0xFF1A
  $fwComma = [string][char]0xFF0C
  $fwSemi = [string][char]0xFF1B

  $compatDiagram = $diagram `
    -replace [Regex]::Escape($fwOpenParen), '(' `
    -replace [Regex]::Escape($fwCloseParen), ')' `
    -replace [Regex]::Escape($fwColon), ':' `
    -replace [Regex]::Escape($fwComma), ',' `
    -replace [Regex]::Escape($fwSemi), ';'

  [System.IO.File]::WriteAllText($compatPath, $compatDiagram, $utf8NoBom)
  $exitCode = Invoke-Mmdc -InputPath $compatPath -TargetPath $outputPath

  if ($exitCode -ne 0) {
    throw "mmdc export failed. Check Mermaid syntax or mmdc compatibility."
  }
}

if (-not $KeepTemp) {
  Remove-Item $tmpPath -ErrorAction SilentlyContinue
  Remove-Item $compatPath -ErrorAction SilentlyContinue
}

Write-Output "Exported: $OutputSvg"
