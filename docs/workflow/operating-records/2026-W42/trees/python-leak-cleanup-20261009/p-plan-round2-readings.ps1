# P-plan round-2 readings (post 03:38 patrol kill round) - CTO 2026-10-17
# Second-round verification of Plan P (predicate narrowed: lsp_server.py servers spared)
$all = Get-CimInstance Win32_Process -Filter "Name='python.exe'"
$srv = @($all | Where-Object { $_.CommandLine -match 'lsp_server\.py' })
$nonSrv = @($all | Where-Object { $_.CommandLine -notmatch 'lsp_server\.py' })
Write-Host ("PYTHON_TOTAL=" + @($all).Count)
Write-Host ("SERVER_COUNT=" + $srv.Count)
foreach ($x in $srv) {
  $c = $x.CommandLine
  Write-Host ("server pid=" + $x.ProcessId + " start=" + $x.CreationDate.ToString("yyyy-MM-dd HH:mm:ss") + " cmd=" + $c.Substring(0, [Math]::Min(100, $c.Length)))
}
Write-Host ("NON_SERVER_PY=" + $nonSrv.Count)
foreach ($x in $nonSrv) {
  $c = $x.CommandLine
  Write-Host ("other pid=" + $x.ProcessId + " cmd=" + $c.Substring(0, [Math]::Min(80, $c.Length)))
}
