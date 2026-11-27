# 席位启动器/重启件教训族（2026-11-28 实锚·CTO 值守夜）

实锚：TriCompany e5c9434（启动器三件终版：launch-seat/launch-m-cos + 共享件 seat-model-tier.ps1 + restart-seat-tier）；金丝雀 m-sde 00:53–00:56；全量滚动 14/14 于 01:05–01:20。关联条目：[重启窗完工判据=进程内生效验证](restart-window-completion-criteria.md)（本族=其在席位启动链上的展开）。

## 教训与正形

1. **新进程的 env 继承自父链，不重读注册表**（WT 主进程/调用方工具进程都是旧 env）——「env 同步后重启即生效」是错的（当晚 14 席重启后令牌仍旧值）。正解=启动器显式从权威源（注册表 User 或 600 文件）重建键；完工锚=**新进程内值面指纹对表**（sha 前 8 位·零值回显）+ 端到端行为证据（信箱文件 mtime 前移/未读下降）。
2. **主树 cwd 的所有席位 hook 都映射 bod 信箱**（notify-inject.cjs 按 cwd 推导席位：主树→bod）——「我席未读」与「bod 未读」是同一信箱的两个读数；席位专属信箱（m-cos 等）不在注入面。
3. **WT 关旧 tab**：向旧 tab 的 pwsh 注入 exit（AttachConsole+CONIN$ WriteConsoleInput）实测 6 场景目标全不退（含 cmd 目标）=机制不成立；`Stop-Process -Force`=退出码 -1（默认 closeOnExit=automatic 下 tab 去留不可保）。正解=对启动器壳 pwsh `TerminateProcess(h, 0)`（**指定退出码 0**）→ WT 自动关 tab；判据=WT 主进程下 OpenConsole.exe 子进程数 N→N−1（每 tab 一个）。禁杀 WT 主进程（一主进程挂全部席）。
4. **退出码旁证**须另开 `PROCESS_QUERY_LIMITED_INFORMATION|SYNCHRONIZE` 句柄、`WaitForSingleObject` 后再 `GetExitCodeProcess`；单 TERMINATE 句柄=ACCESS_DENIED 假读（读出 4294967295·真实 0）。
5. **`$ErrorActionPreference='Stop'` 下 try 块内 `Write-Error` 会被自家 catch 接住**=该红退判据不可达（失败也 rc=0）。红退用状态变量、try 外统一判；「席不死」与「非零退出停滚」同时成立=先照常拉起、文件末尾按状态退出。
6. **杀旧与拉起之间的代码必须被真执行过一次**（DryRun 在其前 exit=该段零执行；Add-Type 类漏声明方法到真跑才炸）。冒烟须到消费面·含「杀旧→拉起」之间每一步的一次性目标实跑。
7. **完工日志行的时间锚取「拉起时刻」**（Start-Process 前记 Get-Date），不取新进程创建时刻——启动器有慢前步（Invoke-ResumeDisambig 全库扫会话记录·实测 47.9s/2692MB）时锚进程创建必假红。
8. **「match」语义取写入后的值**（=子进程将继承的值）比对源；取写入前值=方向相反（父链旧值的席必 false）。
9. **Bash 工具→powershell.exe 5.1=PSModulePath 污染族**（`Import-PowerShellDataFile` 等 MISSING→静默回落基线）；pwsh7→powershell.exe 干净；显式 `PSModulePath=<纯 WindowsPowerShell 目录>` 前缀后调 5.1=通（D-100 闸「唯一豁免=命令自带干净模块路径」的实测依据）。重启件须 pwsh7+PSEdition 自检拒跑；期望档侧 source≠table=fail-closed。
10. **读数核验**：peer 的「已是新值」类主张须独立证（信箱零变化/日志行缺/进程启动时刻三条旁证）；我自己的一行式 awk 也会字段错位致 14 行假标——判定逻辑按分隔符取字段并回看打印行。
11. **部署位≠真源**：restart 件/看门狗消费的是 `.fade\` 部署副本（sync.ps1 单向维护）——改真源后须同步并以 `.fade` 副本对真源 diff（去横幅去 BOM）为复核标准；两轮返修都曾漏刷。
12. 滚动执行面：外层超时须 ≥ 件内自身上限（约 150s·含 48s 扫库）并放宽（420s）；超时后先读输出文件末尾再判，勿凭 rc=143 判红；停机旗（.fade\seat-watchdog.stop）滚动毕必撤，久停先撤（旗在=看门狗跳过=席意外退出不补拉）。
