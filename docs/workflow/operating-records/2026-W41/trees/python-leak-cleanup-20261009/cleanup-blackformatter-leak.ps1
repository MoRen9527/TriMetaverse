# black-formatter LSP 泄漏链清理脚本（BOD 2026-10-09，CEO 点头令）
# 签名精确匹配：Name like 'python%' AND CommandLine 含 black-formatter 路径子串
# 边界：不碰其他 python 进程；输出计数+回卷日志
# 2026-10-15 COS 治理修订（CEO 09:09 直跑令·BOD 白名单检查毕转直跑·修正案「三选或并施」并施=挪出仓+7 天轮转）——任务 XML/launcher 未动；BOD 属主面如判不妥可整体回滚本笔
# 2026-10-17 P 案修订（BOD 02:54:53 裁准·CTO 小狄落笔·触发源定谳卷=LG-089-E2 118f94f48）：谓词收窄——只杀 lsp_runner 族、保留 lsp_server（server 存续则扩展宿主零重生代；被杀 runner 的池条目由扩展监视线程自动清除自愈）。回滚=还原两处谓词（删 -notmatch 段）异常即回滚零门槛
$ErrorActionPreference = 'Continue'
# log 治理：输出挪出仓（%LOCALAPPDATA%）+启动面轮转清 7 天前旧卷（留样汇总卷=同目录 patrol-log-treatment-20261015.md）
$logDir = Join-Path $env:LOCALAPPDATA 'TriCompany\patrol\black-formatter'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
Get-ChildItem -Path $logDir -Filter 'cleanup-result-*.log' -ErrorAction SilentlyContinue |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
    Remove-Item -Force -ErrorAction SilentlyContinue
$targets = Get-CimInstance Win32_Process -Filter "Name like 'python%'" |
    Where-Object { $_.CommandLine -match 'black-formatter' -and $_.CommandLine -notmatch 'lsp_server\.py' }
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
    Where-Object { $_.CommandLine -match 'black-formatter' -and $_.CommandLine -notmatch 'lsp_server\.py' }
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
