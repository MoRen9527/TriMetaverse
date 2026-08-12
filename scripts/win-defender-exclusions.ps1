<#
.SYNOPSIS
配置 Windows Defender 排除项，缓解 Claude Code 在 Windows 上的三类问题：
1. .claude.json 写后扫描锁窗 → EBUSY 并发写失败（issue #25699/#29050）
2. 杀软对 node/claude 进程的扫描开销
3. TriCade 安装目录 / 项目目录的实时扫描锁

.DESCRIPTION
以管理员运行。幂等：已存在的排除项自动跳过，可重复执行。
逐个添加并报告每项结果，失败不中断后续项。

.EXAMPLE
.\scripts\win-defender-exclusions.ps1

.EXAMPLE
# 自定义路径
.\scripts\win-defender-exclusions.ps1 -ProjectDir "D:\Code\ai" -TriCadeDir "C:\Program Files\TriCade"
#>
[CmdletBinding()]
param(
    # 项目根目录（所有仓库的父目录）
    [string]$ProjectDir = "D:\Code\ai",
    # TriCade 安装目录
    [string]$TriCadeDir = "C:\Program Files\TriCade",
    # Claude Code 全局状态文件（并发写 EBUSY 的直接受害者）
    [string]$ClaudeJsonPath = "$env:USERPROFILE\.claude.json",
    # 需要豁免扫描的进程
    [string[]]$ExclusionProcess = @("claude.exe", "node.exe")
)

$ErrorActionPreference = "Continue"

# --- 1. 管理员检查（Add-MpExclusion 需要提权） ---
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Warning "需要管理员权限：请用管理员身份重新打开 PowerShell 再执行（右键终端 → 以管理员身份运行）。"
    exit 1
}

# --- 2. 读取现有排除项（用于幂等） ---
$pref = Get-MpPreference
$existingPaths = @($pref.ExclusionPath) | ForEach-Object { $_.TrimEnd("\") }
$existingProcesses = @($pref.ExclusionProcess)

# --- 3. 路径排除 ---
$paths = @(
    $ClaudeJsonPath,                       # ~/.claude.json 状态文件
    $env:TEMP,                             # 构建临时目录（%TEMP%\tricade-bundle 等）
    $ProjectDir,                           # 项目根
    $TriCadeDir                            # TriCade 安装目录
) | Select-Object -Unique

$addedPaths = @()
foreach ($p in $paths) {
    if ([string]::IsNullOrWhiteSpace($p)) { continue }
    $norm = $p.TrimEnd("\")
    if ($existingPaths -contains $norm) {
        Write-Host "[跳过] 已存在路径排除: $norm"
        continue
    }
    try {
        Add-MpExclusion -ExclusionPath $norm -ErrorAction Stop | Out-Null
        $addedPaths += $norm
        Write-Host "[添加] 路径排除: $norm"
    } catch {
        Write-Warning "[失败] 路径排除: $norm → $($_.Exception.Message)"
    }
}

# --- 4. 进程排除 ---
$addedProcesses = @()
foreach ($proc in $ExclusionProcess) {
    if ($existingProcesses -contains $proc) {
        Write-Host "[跳过] 已存在进程排除: $proc"
        continue
    }
    try {
        Add-MpExclusion -ExclusionProcess $proc -ErrorAction Stop | Out-Null
        $addedProcesses += $proc
        Write-Host "[添加] 进程排除: $proc"
    } catch {
        Write-Warning "[失败] 进程排除: $proc → $($_.Exception.Message)"
    }
}

# --- 5. 汇总 ---
Write-Host ""
Write-Host "========== 排除项汇总 =========="
if ($addedPaths.Count -eq 0 -and $addedProcesses.Count -eq 0) {
    Write-Host "无需变更，全部排除项已存在。"
} else {
    Write-Host "本次新增路径排除 ($($addedPaths.Count)):"
    $addedPaths | ForEach-Object { Write-Host "  - $_" }
    Write-Host "本次新增进程排除 ($($addedProcesses.Count)):"
    $addedProcesses | ForEach-Object { Write-Host "  - $_" }
}
Write-Host ""
Write-Host "提示：排除项减少扫描锁，但 .claude.json 的多实例并发写碰撞（EBUSY）仍需控制并发实例数 ≤2。"
