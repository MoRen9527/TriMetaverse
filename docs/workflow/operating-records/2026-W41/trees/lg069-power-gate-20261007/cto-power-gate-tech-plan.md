# CTO 技术方案卷 · LG-069 本机电量双阈值闸（CEO 23:52 令·BOD 23:54 加令今晚施工）

- sourceOfTruth: 本卷（trees/lg069-power-gate-20261007/cto-power-gate-tech-plan.md）
- syncMode: final（方案正身·够施工精度；施工=FSD 按 COO 树单，本卷即判据）
- lastSyncedAt: 2026-10-07T15:58:00Z（date 现查 23:58+08 周三）
- 方案席: CTO 小狄（m-cto）；四问照答+实勘锚在卷

## 〇、实勘锚（今夜现查，非估读）

1. **本机=Surface 电池机**：Win32_Battery=SurfaceBattery，现读数电量 55%、ACLine=0（电池供电中）——**真闸非空转**，CEO 场景成立；
2. **检测双机制实测同值**：CIM Win32_Battery（EstimatedChargeRemaining=55/BatteryStatus=1 放电中）与 P/Invoke GetSystemPowerStatus（Percent=55/ACLine=0）一致——选型有实测依据；
3. **TriMLC 8713 通知链现役**：notifyPoller 出向（LG-036，env.notifySgBaseUrl/notifySgToken 门）+heartbeat POST TriMMC（token 门）——告警通知零新建链；
4. 施工目标仓=`D:/Code/ai/TriMLC`（src/daemon+src/cron+src/notify 结构现役）。

## 一、Q1 检测面

- **机制主案**：node `child_process` 每 tick spawn `powershell.exe -NoProfile` 单行 P/Invoke `GetSystemPowerStatus` 查询（一次 Add-Type 编译缓存脚本文件，后续 tick 调用读字段）——字段全（ACLineStatus/BatteryLifePercent/BatteryFlag）、零 WMI 服务依赖。**备案**：CIM `Win32_Battery`（两机制实测同值，CIM 作交叉验证源）。
- 施工注意两条（教训族在档）：spawn 环境 PSModulePath 净化断言（PS5.1 污染坑）；首步验收含 cmdlet 可用性探针。
- **节律**：daemon 进程内 `setInterval` 60s——**不进 cron store**（电量闸=常驻语义状态非时间任务，零 F-3 族 nextRunAt 坑、零白名单坑）。
- **挂载形态**：内嵌 `powerMonitor` 模块（内存态：percent/acOnline/gate/batteryPresent）+`GET /internal/v1/power` 只读端点（与 /internal/v1 同族 token 门）+healthz 扩 power 字段一行。

## 二、Q2 闸语义精确化

- **软闸 <30%＝COO 派工前置核查项+告警推送，非 API 硬拦**。技术事实：COO 派工是会话行为（SendMessage/树挂单），daemon 层不存在可拦的 API——硬拦无处安装。正解=阈值触发 notify 告警 m-coo+状态端点可查；「自动化边界止于信号，裁决归人」（与流水线接单触发器全自动否决同哲学，红线同源）。
- **硬闸 <20%＝三层执行，边界如实标**：
  (a) **daemon 自闸**（daemon 能管的自己管）：TriMLC cron 面暂停派发新 job（在跑 job 不中断，只停新派发）；
  (b) **广播暂停令**：notify urgent 推全本地域席+COO+COS——**各席收令自停是会话行为，daemon 不能强制杀会话，执行依赖收令自停**（如实标注，非承诺全自动）；
  (c) 端点 gate=hard_paused 显式置位。
- **恢复判定：CEO 字面「或」确认采**——恢复条件=`acOnline==1 || percent>20`，直接可判零歧义（接电即恢复，即使<20%；电量回 20+ 即恢复，即使未接电）。**补充建议候认**：恢复侧滞回上浮（percent 侧用 >25 而非 >20），防 19-21% 临界循环触发——不采则按字面 20 直判，功能等价仅防抖差异。

## 三、Q3 通知链与防抖

| 态 | 通知 | 载体 |
| --- | --- | --- |
| <30% 软闸触发 | m-coo（normal） | notifyPoller 出向链现役 |
| <20% 硬闸触发 | m-cos（恢复责任人）+m-coo+BOD 告警面（urgent） | 同上+l2 线 A+D 通道候接 |
| 恢复达成 | m-cos「恢复条件达成」（CEO 令恢复动作链 COS→COO 归人）+daemon 自解硬闸 | 同上 |
- **防抖**：滞回带（软 30 触发→34 恢复；硬 20 触发→25 恢复）+**连续 2 次采样同态才切状态**（60s 节律=2 分钟确认窗，防电池读数毛刺）。

## 四、Q4 边界如实标

1. **无电池机**（BatteryFlag=128/Win32_Battery 空集）：闸静默禁用——端点显式 `batteryPresent:false`+启动日志一行，**不告警不误触发**；sg/R-HY 服务机自然空转，闸仅本机有意义。
2. **TriMLC 崩溃=闸失效**：daemon 死则闸死，如实标；兜底=TriMLC-Watchdog 现役保活+**检测连续 3 次失败→notify 告警**（闸失效本身走告警面）；不承诺 daemon 外独立守护。
3. **TriRLC 8711 不在本闸 scope**：CEO 令只点 TriMLC——一期按令落 TriMLC 单点；TriRLC 从闸（轮询 /internal/v1/power）候二期另批，不混本窗。
4. 不做电量续航预测（剩时分钟估算）超 scope。

## 五、工期与验收锚（机读）

- 量级：**半窗内**——powerMonitor 模块+端点+告警接线三件+单测（mock 读数函数驱闸状态机，不依赖真电量）。
- 验收锚：①`GET /internal/v1/power` 返回 `{percent, acOnline, gate: none|soft|hard, batteryPresent}`；②现态探针 percent∈[50,60] 且 gate=none；③注入 30%→gate=soft+notify 出站记录在；④注入 18%→gate=hard+cron 新派发暂停断言；⑤注入 acOnline=1→gate 解除+恢复 notify 在；⑥注入无电池→batteryPresent=false+gate=none 断言；⑦全量测试四项读数+既有失败逐族归因。
- 风险一条：hard 闸 cron 派发暂停与现役 cron job 面（hub-silent-detect 等）交互——施工时只挂「新 job 派发」入口单点，不动 executor 执行循环，防误伤在跑 job。

## 使用依据

- CEO 23:52 令 verbatim（BOD 转达）+BOD 23:54 加令（今晚施工）
- 本机活体实勘（Win32_Battery+GetSystemPowerStatus 双机制同值，SurfaceBattery 55%/ACLine=0）
- TriMLC src 结构实勘（src/notify/puller.js notifyPoller+heartbeat token 门+端点族）
- LG-064 l2 告警面（硬闸告警候接通道）；TriRLC F-3 教训族（不进 cron store 的理由）
