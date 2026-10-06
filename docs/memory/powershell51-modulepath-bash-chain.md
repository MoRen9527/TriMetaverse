# Bash 链调 powershell 5.1 的 PSModulePath 污染坑

- **现象**：Bash 工具链里调 `powershell.exe`（5.1），继承的 `PSModulePath` 混入 pwsh7 目录（`Documents\PowerShell\Modules`、`Program Files\PowerShell\Modules`、`...\PowerShell\7\Modules`）→ 5.1 按目录序加载 **pwsh7 版 Microsoft.PowerShell.Utility** → `Get-FileHash` 报「无法识别为 cmdlet」，而 `ConvertFrom-Json` 却正常（同模块不同 cmdlet 导出存活）——极易误判为脚本 bug。
- **修法**：脚本/驱动入口处净化：`$env:PSModulePath = (($env:PSModulePath -split ';') | Where-Object { $_ -and ($_ -notmatch '\\PowerShell\\Modules') -and ($_ -notmatch '\\PowerShell\\7\\') }) -join ';'`，再断言关键 cmdlet 可用（`Get-Command Get-FileHash`）不过即 throw——防全量假阴性；子进程继承净化后的 env 一并受益。
- **关联坑（同链）**：ps1 中文须 UTF-8 BOM；嵌套 pwsh -Command 的 $env 转义；PowerShell 工具（非 Bash）起 5.1 时 env 较干净、坑不现形——**坑随父链 env 走，跨入口结论不可互推**。
- 实证：2026-09-25 ste-postunfreeze 驱动 R1 轮 11/15 假 FAIL（TC restore-claude-config 复验），净化后 R3 干净。
