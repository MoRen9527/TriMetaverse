# TriMLC 8713 daemon 形态治理方案稿（去 console 生命周期绑定）

- sourceOfTruth: 本件（docs/execution/trimlc-daemon-hardening-plan-20261009.md）
- syncMode: draft（候 BOD 认账·10-11 周日窗族施工）
- lastSyncedAt: 2026-10-09T10:32:00+08:00（date 现查原值）
- 死因勘正身: docs/workflow/operating-records/2026-W41/trees/lg066-window-order-20261009/cto-8713-death-cause-20261009.md @b1323f31
- 并窗件: ①TriMLC cron enable recompute 缺陷修复（F-3 家族第三形态·挂载窗 S6 发现·一次重启带两修）②R 面 8711 复活（R1 窗另稿·同族治理对照）

## 一、目标与非目标

**目标**：8713（TriMLC daemon）脱离控制台进程生命周期——待机恢复/会话清理不再杀进程，消灭 watchdog.log 11 次 DOWN→revive 复发循环。

**非目标**：不改系统电源策略；不动 TriRLC/TriMMC 面（各自治理件）；不重构 TriMLC 应用代码（notifyFailures/新锚语义照旧）。

## 二、方案：S4U 计划任务非交互形（推荐）+ 两入口合一

### 治理对象（两入口同形改造）

| 入口 | 现状 | 改后 |
| --- | --- | --- |
| 「TriMLC Daemon」schtasks 任务 | LogonTrigger·交互控制台窗（Action=trimlc-daemon-channel.cmd 直跑）·0xC000013A 死态出处 | **重注册为 S4U 非交互**（LogonType=S4U·jedih 账号·开机触发+登录触发双留）·窗口不生=无控制台可杀 |
| watchdog revive 段 | `Start-Process cmd /c trimlc-daemon-channel.cmd -WindowStyle Hidden`（hidden 仍 console=复发循环根） | 改 `Start-ScheduledTask`（经任务框架拉起=同 S4U 形）——**两入口合一**，watchdog 只判活+触发不再自 spawn |

### 技术形态取舍

| 案 | 判 | 
| --- | --- |
| **S4U 计划任务（推荐）** | 零新依赖·PowerShell `Register-ScheduledTask -LogonType S4U` 原生·jedih 用户域权限保持（cwd/env/LOCALAPPDATA 读写全兼容）·非交互会话=无控制台生命周期 |
| 服务化（NSSM/WinSW） | 引第三方依赖+SYSTEM 账号跑则数据目录权限面碎（jedih 域）·改本地账号服务又要管密码——重 |
| D-29 VBS 包装 | **否**——hidden 窗仍 console 进程·Modern Standby 清理面同险·不解决根因（D-29 管的是「闪窗扰人」非「console 生命周期」） |

### 实施要点

1. 旧任务定义先 `schtasks /query /tn "TriMLC Daemon" /xml` 导出备份（回滚锚）。
2. 新任务以 PowerShell XML/S4U 注册：Action=同 cmd（cmd 内部 PATH guard/env 链保留）·Trigger=AtStartup+AtLogOn 双留·`SettingsDisallowStartIfOnBatteries=$false`（笔记本电池态也要能拉起——LG-069 电源门协同）·ExecutionTimeLimit=0（daemon 无限时限）。
3. watchdog.ps1 revive 行单点替换（Start-Process→Start-ScheduledTask）·探活三带/logon guard/3-fail stand-down 全保留。
4. channel.cmd 本体不动（S4U 下 cmd 照跑·env/PATH guard 链复用）。

## 三、门判据（H1-H4）

| 门 | 判据 | 验形 |
| --- | --- | --- |
| H1 | 重启换形后 healthz 绿+8713 监听 pid 一致+cron jobCount=8 照旧 | 读数贴毕报 |
| H2 | **待机-恢复存活专项**：窗内人为触发一次待机→恢复→断言 8713 进程同一 pid 存活+watchdog.log 零新 DOWN | 窗内实测·本方案核心门 |
| H3 | 通知链回归：probeA/B 双 200（挂载窗同款命令单）+notifyFailures 恒 0 | 双刻读数 |
| H4 | 7 天自然观察：watchdog.log 零 DOWN→revive 新笔（对照史 11 次/14 天基线） | 10-18 收口巡检 |

## 四、回滚姿态

旧任务 XML 备份+watchdog.ps1 改前 cp 备份→新形异常（H1/H2 fail 或窗内异常）即恢复旧定义+旧 revive 段+重启——单机单 daemon·回滚链两文件干净。

## 五、风险与缓解

| 风险 | 缓解 |
| --- | --- |
| S4U 会话下 node 行为差（网络/文件句柄/环境变量） | cmd env 链原样随车；H1 全值面探针；异常即回滚 |
| 待机期间进程仍被挂起（S0ix 挂起不杀） | 挂起≠终止·恢复后 pid 不变即达标（H2 判据语义） |
| 双触发器重复拉起（开机+登录撞车） | cmd 起手已有单例语义（pidfile+端口占用即退·TriMLC 内建）；观察 H1 |
| 与 CEO 电源门场景互作（电池态） | DisallowStartIfOnBatteries=false 显式设·LG-069 门语义协同 |

## 六、施工窗与分工

- 窗位：10-11 周日窗族**本机段**（R1 窗前后·与 sg 段 TriMMC 修复分机分带）·正式排定走 COO 面。
- 施工位：FSD（本机）·复核位：CTO·值席知情：BOD。
- 并件同窗：cron enable recompute 修复（FSD 裁量已并·改码+单测同批）。

## 使用依据

- cto-8713-death-cause-20261009.md @b1323f31（0xC000013A 实锚·11 次 revive 史·两入口同形根因）
- BOD 09:52 认账信（结构修候 10-11 周日窗族预排意向）
- trimlc-watchdog.ps1 全文实勘（revive 形·logon guard·3-fail stand-down 保留面）
- D-29 纪律（Windows 计划任务无窗纪律·本方案 S4U 为其根因级上位形）
