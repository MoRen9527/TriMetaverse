# CTO 8713（TriMLC）死因勘记 · BOD 转域件②

- sourceOfTruth: 本件（trees/lg066-window-order-20261009/cto-8713-death-cause-20261009.md）
- syncMode: final（勘记·初勘毕·结构修候排）
- lastSyncedAt: 2026-10-09T09:52:00+08:00（date 现查原值）
- 令源: BOD 09:38 四件转域信件②（死因勘归 CTO 域）

## 一、死因定谳（三层证据互锁）

**死因=Modern Standby 待机转换窗内控制台进程被清理（0xC000013A 族）**。非代码缺陷、非 build 副作用、非 sg 面操作牵连。

| # | 证据 | 读数 |
| --- | --- | --- |
| 1 | schtasks「TriMLC Daemon」任务（LogonTrigger·10/08 03:47:34 实例） | **LastResult=3221225786 = 0xC000013A STATUS_CONTROL_C_EXIT**（控制台被关闭/Ctrl+C 终止族退出码） |
| 2 | Windows 事件日志（System·Kernel-Power） | 08:34:11 Idle Timeout 待机→08:38 进出→**08:39:14 Power Button 进入新型待机**→08:39:22 转**断连待机（Disconnected Standby）**→09:08:25 电源更改醒→09:10:27 Input Mouse 醒 |
| 3 | watchdog.log | 09:12:39 DOWN→reviving→09:13:23 revive self-check OK（healthz 90s 内绿）——与 BOD 勘定 09:12:43 拉起吻合 |

**死亡窗精化**：08:19:49（信箱最后一笔落盘=本席四跳验证读数）之后～09:08:25（系统醒）之间；最大嫌疑=08:34-08:39 多轮待机转换窗（Idle Timeout→Power Button 长待机）。BOD 原区间「08:09-09:12」端点精化为「08:19:49-09:08·嫌疑峰 08:39 待机转换」。待机期间机器睡着（watchdog/schtasks 同眠）=09:12 首跑即拉起的延迟自洽。

## 二、复发判定：结构性，非偶发（本勘主发现）

watchdog.log 全史（2026-09-26 启用至今）：**11 次 DOWN→revive**（09-26/09-30/10-02×2/10-03×3/10-05/10-06/10-07/10-08/10-09）——8713 一直周期性死，watchdog 一直悄悄拉起（历次 self-check OK·单次空窗 4-5 分钟）。今晨仅系首次被肉眼注意到。

**结构根因**：daemon 以控制台进程形态跑（`cmd /c trimlc-daemon-channel.cmd -WindowStyle Hidden`——Hidden 仍是 console 生命周期），待机恢复/会话清理即被杀；watchdog 拉起复用同 cmd=同一形态复活=**复发循环**。「TriMLC Daemon」LogonTrigger 任务与 watchdog revive 两入口同形态。

## 三、对今日窗的影响（挂载窗）

1. **d7693c6 修件已随拉起生效（实锚）**：进程 09:13:20 起跳＞dist mtime 10-09 03:47——加载即修件；置位断言本席已替跑全绿：`grep -c "target_daemon: 'trimlc'" dist/server/app.js`=**1**·git 顶=**d7693c6**·app.js mtime 03:47。10:00 窗重启环节→复验形态（COO 面已知）；FSD 复核位两读数可引本卷或照跑双确认（推荐照跑·独立重测惯例）。
2. **探针 A/B 双 200 判据不变**（链路复验语义与进程新旧无关）。
3. **notifyFailures 终验锚语义变更（如实报）**：原锚「7 冻结→真闸成功投递自动清零」（本席 08:24 卷）——**7 基线已随本次重启物理归零（现读=0）**，7→0 验证形作废。新锚=真闸事件发生时 healthz notifyFailures 恒 0+channel.log 投递成功痕迹。命令单 probeA/B 无此判据（零卷面勘改）；BOD 08:27 认账信「归零路径知会」认知面随本卷对齐。
4. **电源门盲区如实记**：机器待机窗内 8713 死=通知链全盲（LG-069 电源门在「整机待机」场景失效）——今晨 08:39-09:08 待机 29 分钟无电源事件未触闸，无实害；盲区随结构修一并治理。

## 四、修复分级候排（CTO 裁）

| 档 | 项 | 判 |
| --- | --- | --- |
| 兜底在位 | watchdog 5 分钟探+revive+self-check | 现役有效·复发空窗≤5 分钟级——**短期可接受** |
| 结构修（候排） | 8713 daemon 去 console 生命周期绑定：计划任务非交互形（S4U/不显示窗）或服务化包装；两入口（LogonTrigger 任务+watchdog revive cmd）同改 | 与 R 面 TriRLC 8711「无 unit 无保活」同族=**本机+R 面 daemon 形态治理组合项**——本席拟方案稿候 10-11 周日窗族评估 |
| 不做 | 待机行为改造（改系统电源策略） | 越出 daemon 治理面·侵入用户环境 |

## 使用依据

- BOD 09:38 四件转域信；sgB 认账件 @trees/sg-duty-trial-20261009/bod-acceptance-20261009.md
- 实勘读数：healthz（uptime 1845s/notifyFailures=0/acOnline=true）·schtasks 双任务定义·Windows 事件日志 07:55-09:20 窗·watchdog.log 全史·trimlc-watchdog.ps1 全文·channel.log 尾
- 本席 08:24 sg power-gate 卷（原 notifyFailures 锚出处）·命令单 @e138d8da（判据不变佐证）
