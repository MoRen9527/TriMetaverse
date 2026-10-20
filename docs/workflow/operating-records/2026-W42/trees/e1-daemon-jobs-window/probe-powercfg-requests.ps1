# E1-6 完工判据探针 —— powercfg /requests 值面验证（healthz 绿 != 生效）
# LG-089 charter-2026-W42-005 E1-2 门禁预置件（CTO 小狄 2026-10-17）
# 用法: pwsh -NoProfile -File probe-powercfg-requests.ps1 -ExpectPid <8713 daemon pid>
# 注1: 须 pwsh 7 执行（本仓脚本族 pwsh7 正形；PS5.1 中文注释乱码但不断语法·输出全 ASCII 兼容）
# 注2: powercfg /requests 须管理员权限——非管理员窗运行时输出权限错误文本、pid 断言自然 FAIL，不静默放行
param(
    [int]$ExpectPid = 0
)
$out = powercfg /requests 2>&1 | Out-String
Write-Output $out
if ($ExpectPid -gt 0) {
    if ($out -match [regex]::Escape("$ExpectPid")) {
        Write-Output "PROBE RESULT: PASS - pid $ExpectPid present in SYSTEM requests (keepalive ENGAGED)"
    } else {
        Write-Output "PROBE RESULT: FAIL - pid $ExpectPid NOT in requests (keepalive not effective OR probe lacks admin - see raw output above)"
        exit 1
    }
} else {
    Write-Output "PROBE RESULT: READOUT-ONLY (no -ExpectPid given)"
}
