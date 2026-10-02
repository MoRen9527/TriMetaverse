# STE·batch-15 件①验证卷（LG-053 恢复阶梯执行面·独立复测）

- sourceOfTruth: 本件（STE batch-15 件①验证卷；验证对象=TC ce70115 后态，两脚本工作树零 diff 实锚）
- syncMode: static（验证毕；结论=全绿+4 非阻塞发现项，候 COO/CTO 知悉面收口）
- lastSyncedAt: 2026-10-02T18:43:06Z（date 现查）
- 验证席: STE 小柯（m-ste）；FSD 卷=同目录 fsd-batch15-1-completion-readout-20261003.md（**读数未转抄，全部独立复跑**）
- 沙箱: %TEMP%\ste-b15-verify-20261003-023704（全形自沙箱副本执行；工具目录零净写终验=git status 复测前后零新增+settings.json SHA256 三查不变）

## 一、测试判断

ce70115 两脚本（triladder.ps1 四子命令+direct-probe.ps1 三段检）**验证通过（PASS）**：验收锚逐条全落（A1-A3 阶梯逐级有实现+探活四态六形实测读数+直连面通），另 4 条非阻塞发现项录后，无阻塞性缺陷。

## 二、独立复测策略与全量读数

探活四态六形独立复跑（fixture 自建+真活体双源；非 FSD 读数转抄）+a1/a2/a3 零写面形复测+a3 沙箱真回滚+direct-probe 双壳复跑+5.1 兼容双读数。

| 形 | 活体/fixture | 读数（exit/state/detail） |
| --- | --- | --- |
| P1 probe 真活体带令 | 8713 TriMLC（channel.cmd 令源+X-Internal-Token） | 0/T-OK/both-green（healthz=200 probe=200） |
| P2 probe T-1 形 | fixture 18701（healthz 200+probe 503，用后即焚） | 0/T-1/probe-5xx:503 |
| P3 probe T-2 无令 | 8711 TriRLC /internal/v1/models | 0/T-2/probe-unauthenticated（401） |
| P4a probe T-2 假令 | 8711+错令 env | 0/T-2/auth-rejected（401） |
| P4b probe T-2 令域分野 | 8711+8713 令（channel.cmd） | 0/T-2/auth-rejected（401——两 daemon 独立令域实证） |
| P5 probe T-3 全亡 | 8712 | 0/T-3/all-dead |
| P6 probe T-3 进程活 | 8798+活 pid 22556 | 0/T-3/process-alive-port-dead（-Pid 与 -Pid2 双形） |
| P7 probe T-OK 树正向 | fixture 18702（200/200） | 0/T-OK/both-green（判定树正向不依赖真令独立验证） |
| A1-1 T-OK 拒 | 8713 | 1/rejected（probe=T-OK 无触发条件） |
| A1-2 T-2 拒 | 8711 | 1/rejected（指向开关/命令通道面） |
| A1-3 T-3 dry-run | 8712 | 0/dry-run plan 单行（拉活） |
| A1-4 T-1 dry-run | fixture 18701 | 0/dry-run plan 两行（shutdown+拉活；令面指纹 len=22 零值面） |
| A1-5 防环真路径 | fixture 18701+手植 watchdog-revive state（tsEpoch=fresh） | 1/rejected（watchdog 已于 0.1min 前复活且 T-OK——防环细则 3）——**真走到防环判定块**（T-1 口前置拒之后），比 FSD 卷防环行更深一档 |
| A2-1 缺回滚锚 | — | 2/stderr 校验门 |
| A2-2 缺值席判位 | — | 2/stderr 校验门 |
| A2-3 dry-run 两子件并列 | — | 0/plan[0]=配置面（restore 吸收）+plan[1]=进程面（并列另列——修改①防覆盖误读）——**CTO 意见书条款 1 修改①落位实证** |
| A2-4 -Execute restore WhatIf（工作树形） | 沙箱 restore 副本 | 0/executed-restore-whatif restore_exit=2（凭据健康门拦占位符形，与 FSD 读数一致；活体 settings mtime 未动） |
| A2-5 同上（ce70115 已提交形） | git show 版 restore | 0/executed-restore-whatif restore_exit=2——**与 WT 形一致：38 行在途 diff 对 a2 链零影响实证** |
| A3-1 缺 BOD 裁门 | — | 2/stderr 校验门 |
| A3-2 坏 JSON bak | 沙箱坏件 | 1/rejected（bak JSON 校验失败——回滚前置门工作） |
| A3-3 dry-run | 沙箱好件 | 0/dry-run |
| A3-4 沙箱真回滚 -Execute | 沙箱 target+bak | 0/executed+ASSERT pre_bak_exists=True target_eq_bak=True（写前现役再备份在位） |
| A3-5 bak 缺失 | 沙箱不存在路径 | 1/rejected（见发现项 2 文案问题） |
| D1 direct-probe pwsh7 | 活体只读 | 0/**PASS**（preset 11 键+AUTH_TOKEN 占位符=密钥卫生正形；live 三键指纹形；连通 HTTP 2xx） |
| D2 direct-probe 5.1 | 活体只读 | 0/读数形态与 pwsh7 一致 |
| M1 triladder 5.1 probe | 8712 | 0/T-3/all-dead（与 P5 一致） |
| M2 triladder 5.1 probe 带令 | 8713 | 0/T-OK/both-green（与 P1 一致——5.1 兼容双读数复验过，PSModulePath 净化形） |

只读断言：settings.json SHA256 跑前/跑后/5.1 后三查全同。

## 三、发现项（4 条，均非阻塞）

1. **a1 shutdown 令头默认值与 daemon 门头族不匹配**（A1-4 实录）：plan 行显示 shutdown 用默认 Authorization 头，而 TriRLC/TriMLC 门优先头=X-Internal-Token——真动作时 shutdown 会 401（有 catch 兜底继续拉活，安全侧不劣化，但 T-1 优雅停设计目标失效）。用法面需显式 -TokenHeader X-Internal-Token；建议 a1 用法例（头注）补注记或 shutdown 段默认头与探针段一致化。候 CTO 裁。
   > **【勘正 2026-10-03 02:5x·COO 勘正自办令】本条定性经 CTO 速裁驳回（裁卷=同目录 cto-finding1-header-verdict-20261003.md，3c0a2753）——「令头族不匹配致 shutdown 401」断言被源码+活体双重证伪：`extractInternalToken` 内建 Bearer fallback（TriMLC app.ts L138-139/TriRLC L135-142 两仓同族，本席独立复核 L138-139 在目确认）；活体三态 02:50 实测=无令 401/对令+Bearer 形 404（过门路由未命中）/对令 X-Internal-Token 404 对照。triladder.ps1 代码零修。误判根因（CTO 定性+本席认账）：本卷只测「错令+Bearer 形」（401 系令错非头形错），未测「对令+Bearer 形」组合即外推否定断言——教训=组合面未测不做否定断言，本条按裁卷为准，原定性作废。**
2. **a3 bak 缺失文案误导**（A3-5 实录）：.json 后缀 bak 不存在时报「bak JSON 校验失败」（Get-Content FileNotFound 被 catch 混入 JSON 校验败因）——拒切形态正确（rejected exit 1），文案失真；Test-Path 前置可修。候 FSD 属窗修。
3. **-Pid 别名机制与注释不符**：-Pid 形实测可用，但机制=PowerShell 参数名前缀缩写（-Pid→-Pid2 绑定），头注宣称的 BoundParameters 兼容行（L72）为死码（BoundParameters 键恒='Pid2'）。当前无歧义稳定可用；未来若加 -PidX 族参数会产生缩写歧义。观察项。
4. **（验证侧瑕疵备查，非脚本缺陷）**：pwsh 管道读 git show 输出按 GBK 解码破坏 UTF-8 中文注释致 A2-5 首跑语法错误——bash 字节流重定向修复后复跑过；同形读数见 A2-5 行。

## 四、验收锚逐条对表

| 任务书验收锚 | 读数 |
| --- | --- |
| A1-A3 阶梯逐级有实现 | a1 五形/a2 五形/a3 五形全读数（上表）；CTO 意见书两点落位对照=修改①并列分列实证（A2-3）+a3 bak JSON 校验前置实证（A3-2） |
| 探活三态实测读数 | 四态六形+树正向共 9 形独立复现（超锚要求）；T-OK 双源（真活体 8713 带令+fixture 正向） |
| 直连面通 | D1 pwsh7 PASS+D2 5.1 一致+HTTP 2xx+settings 只读三查 |
| STE 验证全绿或逐条录败因 | 全绿；4 条非阻塞发现项如实录（无阻塞、无 FSD 读数依赖） |

## 五、使用依据

- 任务书 batch-15 件①验证段（board staging）+COO 02:2x 验证令（复测纪律五条逐条认领执行）
- FSD 卷 fsd-batch15-1-completion-readout-20261003.md（对表用，读数未转抄）
- CTO 接口意见书两点（bod-pipeline-batch-13/lg053-interface-review.md）落位对照
- 实锚码位：TriMLC src/server/app.ts L1759（入站门 TRILC_INTERNAL_TOKEN fail-closed——triladder 令序正确性佐证）；trimlc-daemon-channel.cmd=8713 令源（AppData\Local，值面零出机）
- 沙箱证据：%TEMP%\ste-b15-verify-20261003-023704（25 形全读数原文在案）
