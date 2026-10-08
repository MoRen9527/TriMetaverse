# black-formatter LSP 泄漏链清理脚本（BOD 2026-10-09，CEO 点头令）
# 签名精确匹配：Name like 'python%' AND CommandLine 含 black-formatter 路径子串
# 边界：不碰其他 python 进程；输出计数+回卷日志
$ErrorActionPreference = 'Continue'
$targets = Get-CimInstance Win32_Process -Filter "Name like 'python%'" |
    Where-Object { $_.CommandLine -match 'black-formatter' }
$killed = @()
$failed = @()
foreach ($t in $targets) {
    try {
        Stop-Process -Id $t.ProcessId -Force -ErrorAction Stop
        $killed += $t.ProcessId
    } catch {
        $failed += "$($t.ProcessId):$($_.Exception.Message)"
    }
}
$remain = Get-CimInstance Win32_Process -Filter "Name like 'python%'" |
    Where-Object { $_.CommandLine -match 'black-formatter' }
$ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'
$report = @"
[$ts] black-formatter 泄漏链清理回卷
- 快照匹配: $($targets.Count) 个
- 击杀成功: $($killed.Count) 个 [PID: $($killed -join ',')]
- 击杀失败: $($failed.Count) 个 $(if ($failed) { $failed -join ' | ' })
- 清理后残留: $(@($remain).Count) 个
"@
$report
$report | Out-File -FilePath "$PSScriptRoot\cleanup-result-$(Get-Date -Format 'HHmmss').log" -Encoding utf8
