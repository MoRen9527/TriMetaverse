# CTO 勘验附卷 · LG-069 读链 timeout 风暴（10-11 13:39-14:01 实弹·只读勘验）

- sourceOfTruth: 本卷（trees/lg069-power-gate-20261007/cto-power-read-storm-survey-20261011.md）
- syncMode: static（勘验快照·零施工零触碰·8713 禁二次重启约束内完成）
- lastSyncedAt: 2026-10-11T14:10:06+08:00（date 现查原值）
- 勘验席: CTO 小狄（m-cto）；令源=BOD 知会（13:47 实弹数据包）+COO 改派裁主件并行件
- 判读对象: TriMLC baf800d 现役（power-monitor.ts 修复批后形）+活体 channel.log/healthz//internal/v1/power/cron.db

## 一、事件时间线（重建自 channel.log+endpoints+db 只读面）

| 时点(+08) | 事件 | 证据 |
| --- | --- | --- |
| 全日背景 | 读链间歇性 flapping（成对 timeout+自愈复位循环）——counter 序列 #1,#2,复位,#1,#2 反复，均未达阈 | channel.log uniq 计数序列+当日两段 notify（68537/69182 行）+BOD 报 09:14 段 |
| 13:39 | 风暴起点（#1） | channel.log L69951 区+BOD 知会窗 |
| ~13:41 | 中途单次成功（cache 被刷新一次——此成功即后续陈旧缓存的数据源） | counter 序列 #2 后复位再现 #1+缓存值成因推定 |
| 13:43 | #3 达阈→notify 已发一次 | L69958 notify delivered+修复批③ await 化出向活体兑现 |
| 13:42:50 | bod-tick-30min 派发（**距 :37 锚点延迟 5 分**）→runner 未落盘→悬挂 | cron.db execution_log started_at 05:42:50Z |
| 13:52:50 | bod-tick 600s timeout 兜住→status=timeout 落账（error_count=1） | cron.db 同行 duration_ms=600012——**件A/件B 修复面第二次实弹兑现（daemon 未崩·crash.log 零基线保持）** |
| 13:39-14:01 | 连续 timeout ~19 次（除 ~13:41 单成功） | counter 序列 #3→#19 单调段+healthz readFailures=17@13:55:39 |
| 14:01:11 | 恢复成功读数落账，缓存回归真值 | /internal/v1/power lastReadAt=06:01:11.991Z·percent=85/raw=86/cim=85/**acOnline=true**/readFailures=1（恢复后或余单次残留） |

## 二、活体真值反转与缓存语义

- 真值：机器全程**接着电源**（AC=1·85-86%），无真实电切事件——healthz 风暴窗陈旧缓存（acOnline=false/percent=88）系读链故障产物，gate=none 恰好蒙对（真值本就在 none 域）；若缓存值恰低于阈值，风暴窗内闸态将冻结在错误值——**「读失败→闸态冻结在最后已知值」是一期语义缺口**（详见 §四.F）。
- 手工复现（同 snippet 原文）：内部耗时 1.7s（cold）/0.9s（warm），Add-Type 503-710ms+CIM 即答；Winmgmt Running；powershell.exe 进程表零僵尸（唯一长驻实例 10-05 起=无关）——**系统级 spawn/WMI 健康**，故障面收敛至 daemon 进程上下文 spawn 管线。

## 三、根因候选排序（只读勘验可收敛到的边界）

1. **daemon 上下文 child spawn 管线退化（最强候选）**：power 读（spawn powershell）与 13:37 runner 派发（spawn agent/command 链）同窗同受累+派发延迟 5 分旁证；系统级手工 spawn 同窗健康（13:58 实测）排除机器级资源枯竭；daemon 自身高频 spawn 自竞争/句柄面/Job 对象限制为具体机制候选——**深勘需窗内仪表化（spawn 耗时埋点+句柄计数）**，候修复窗不扩本卷。
2. powershell 冷启开销+10s 阈值裕度过薄（背景 flapping 解释）：健康态 wall 6.3s（cold）对 10s 阈值仅 3.7s 裕度——daemon 高负载窗裕度击穿即 flapping；与 1 叠加成 13:39 锁死形态。
3. 电切相关性（BOD 假设）：**本轮证伪**（真值全程 AC=1）；09:14 段候同法回勘（历史真值不可得，挂观察项不追）。

## 四、发现清单（候办面·随合并窗/修复窗处置）

- **A. healthz.power 缺 lastReadAt 投影**（snapshot 有·投影落——可见性缺口本体）：一行+单测，随 21:00 后窗；**LG-069 二期从闸 staleness 判定的前置件**（二期方案稿 §五引用）。
- **B. gate 字段「冻结语义」缺口**：读失败期 healthz gate 显示最后已知值，与「实测 none」不可区分——建议下窗补 gateStale 布尔（readFailures>0 即 true）或 unknown 态投影；消费面（含二期从闸）须能识别不可信读数。
- **C. 读链结构性加固候选**：spawn-per-tick → 进程内 P/Invoke（koffi/ffi-napi 直调 GetSystemPowerStatus，消 spawn+消 powershell 冷启）——量级性根治，涉新依赖选型（本席选型裁决权内，候窗另勘：CIM 腿保留 spawn 单腿或改 WMI 直连面权衡）。
- **D. 10s 超时裕度**：候 C 落前过渡面——timeout 提至 25-30s（代价=故障发现延迟，可接受于 flapping 治理）候窗裁。
- **E. 派发延迟观测**：锚点→实际 started_at 延迟无现役读数面——execution_log 补 scheduled_at 列或 log 行内联延迟值，候修复窗。
- **F. 风暴窗闸控语义**（与 B 同根）：读失败期闸不演化（冻结）属现行设计如实边界——B 落地即天然可见化，无需新机制。

## 五、双防线战果记录（正面实证）

风暴 22 分钟+bod-tick 600s 悬挂双重压力下：daemon 零崩溃、crash.log 零行（件A）、timeout→error 结果落账零 rejection 泄漏（件B）、notify 达阈即发一次不重复（修复批③）——**10-11 勘修窗三件在实弹下全部按设计兑现**，修复前该形态（悬挂 rejection）有 crash 风险面。

## 使用依据

- BOD 知会 13:47（实弹数据包四条）；本席中报 14:03（BOD 收悉面）
- 活体读数：channel.log（L69573/69878/69951-69995 区+uniq 计数序列）、/healthz 13:55:39Z、/internal/v1/power 14:01 读数、cron.db execution_log/cron_jobs 只读查询、手工 snippet 计时两跑、Winmgmt+powershell 进程表
- 源码：TriMLC src/power-monitor.ts L164-228/300-402（baf800d 现役）
