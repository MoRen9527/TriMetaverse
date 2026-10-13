# FSD 勘验卷：python 泄漏疑活态三态定性（活）

- sourceOfTruth: 本件
- syncMode: static
- lastSyncedAt: 2026-10-13T08:40:04Z（16:40:04+08·date 现查原值·16:38 巡杀轮观测补段版；首写 08:40:57Z 系推算造值晚真值 53 秒·写完对表自查抓到即勘正）
- 勘验位: FSD 小全（m-fsd）；令源: BOD 派工 16:26（CEO 16:24 清仓令一小时窗·勘活态三态定性+毕报落树）
- 状态条: ①date 现查 2026-10-13T08:32:13Z ②水位=中 ③联审证据=本卷+schtasks 任务详情+活体进程读数原文 ④末次活动=本卷落盘

## 三态定性：**活**（泄漏链现役在跑·非死非自愈）

## 依据链五条

1. **活体进程清单**（16:26-16:28 现探）：python 系进程 54 个，**54/54 全部命中 cleanup 脚本同签名谓词**（CommandLine 含 `black-formatter`）——ms-python.black-formatter-2026.6.0 扩展 `lsp_runner.py` 进程族。内存占压：工作集合计 1544MB / 私有内存合计 1143MB。
2. **繁殖树**：`Code.exe(8400·VS Code 扩展宿主·13:10:01 起) → python3.12 lsp_server.py(19364) → uv cpython lsp_runner.py(27976) → 49 个 runner 子进程`+`2 个 .venv python runner（TriMetaverse/TriStaciss）`+`2 个 C:\Python312 runner`。
3. **时间形态=批量触发型非持续繁殖型**：启动直方图单桶——54 个全部 StartTime=16:08:04-16:08:24（20 秒窗批量）；16:08→16:28 双点读数数量持平（54→54），零新增零退出。
4. **历史佐证=清后复发实锚**：cleanup-result-010646/010701.log（10-09 01:06/01:07）两轮击杀 54+11 个、失败 0+1——今日 16:08 新批 54 个=清理后 2.5 天复发，量级与 10-09 首杀时（54）持平。
5. **巡杀兜底实效面**：schtasks `\BOD-BlackFormatterLeakPatrol` 在册 Ready、30min 节律、**Last Run=16:08:01 Last Result=0**（本轮跑了且 rc=0），54 进程 StartTime=16:08:04-24（**巡杀后 3-23 秒**）——「巡杀杀旧批→VS Code 扩展宿主秒级重新 spawn 新批」形态实锚，与 c9b5dd5b7 注记「再生源=VS Code 主进程秒级重启 LSP，杀进程治标」一致。巡杀存活但泄潚常态在册 ~54 个/轮（每轮间 30min 常驻占压 ~1.5GB WS）。

## 内存曲线面（如实边界）

- 历史：10-09 两轮 log 仅计数无内存采样——历史曲线不可得。
- 现役：T1 16:28:17=54 个 / T2 16:28:34=54 个·1544MB WS——双点持平稳定态。
- 「泄漏」形态=**进程数量累积型**（runner spawn 后不退出）非单进程内存膨胀型（单进程 ~52MB 全族均匀无增长）。

## 情报勘正（BOD 派工令附注）

「该树 cleanup-result-\*.log 一批未提交（git status 在册）」**系陈旧情报**——git 勘验：c9b5dd5b7（10-09 01:11:26）已将四件（cleanup 脚本+两个 result log+patrol-launcher.vbs）全量入库；本卷落卷时点该树零未提交面。处置面=无需处置。

## 候裁面（本席不动·BOD 裁）

1. **是否再杀本轮 54 个**：破坏性动作令面未含——且按实锚形态杀后秒级复批，杀=无效动作；候 BOD 裁（候裁期间本轮 54 个将活到 16:38 下轮巡杀被自然接手）。
2. **根治面候窗**：巡杀治标循环已实锚（杀→秒级复批→30min 常驻）。根治方向候选：①black-formatter 扩展 runner 不退出缺陷侧（升级/禁用/换 ruff-format）②VS Code 侧触发源（何事件批量 spawn 49+ runner）③巡杀改杀 lsp_server 父进程（19364）断繁殖根——均候窗勘，本席不擅动。
3. **16:38 巡杀轮活体观测**：下轮巡杀跑后复活形态读数（复批数量/间隔）候补勘——本卷先落主体，观测读数到手补段。

## 16:38 巡杀轮活体观测（补段·候裁面③闭环）

- schtasks Last Run=**16:38:01 rc=0**（下一轮准点跑）
- T3=16:39:18（巡杀后 77 秒）：total=**54 个**·启动直方图**16:38 单桶 x54**·WS 1538MB（与上轮持平）——旧批被杀、新批 77 秒内批量复活，数量分毫不差。
- **巡杀循环形态定谳**：每 30min「杀 54→秒级复批 54→常驻 30min」——巡杀兜底对泄漏**零收敛实效**（杀多少回多少），泄漏链「活」定性终锚；根治必须回到候裁面①②（runner 不退出缺陷侧/触发源侧/杀 lsp_server 父断根侧），巡杀线不动根治不动。

## 使用依据

- 活体现探：Get-Process/Get-CimInstance Win32_Process（16:26/16:28 双点·CommandLine+ParentProcessId+StartTime 原值上引）
- schtasks `\BOD-BlackFormatterLeakPatrol` /v 详情（Last Run 16:08:01 rc=0·Next 16:38 Ready）
- 树内件：cleanup-result-010646.log / cleanup-result-010701.log / cleanup-blackformatter-leak.ps1 / patrol-launcher.vbs（均已入库 c9b5dd5b7）
- git 勘验：c9b5dd5b7（10-09 01:11:26·四件+sg 任务书六文件入库注记含「再生源」情报）
