# black-formatter LSP 泄漏链清理脚本（BOD 2026-10-09，CEO 点头令）
# 签名精确匹配：Name like 'python%' AND CommandLine 含 black-formatter 路径子串
# 边界：不碰其他 python 进程；输出计数+回卷日志
# 2026-10-15 COS 治理修订（CEO 09:09 直跑令·BOD 白名单检查毕转直跑·修正案「三选或并施」并施=挪出仓+7 天轮转）——任务 XML/launcher 未动；BOD 属主面如判不妥可整体回滚本笔
$ErrorActionPreference = 'Continue'
# log 治理：输出挪出仓（%LOCALAPPDATA%）+启动面轮转清 7 天前旧卷（留样汇总卷=同目录 patrol-log-treatment-20261015.md）
$logDir = Join-Path $env:LOCALAPPDATA 'TriCompany\patrol\black-formatter'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
Get-ChildItem -Path $logDir -Filter 'cleanup-result-*.log' -ErrorAction SilentlyContinue |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
    Remove-Item -Force -ErrorAction SilentlyContinue
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
$report | Out-File -FilePath (Join-Path $logDir "cleanup-result-$(Get-Date -Format 'yyyyMMdd-HHmmss').log") -Encoding utf8
