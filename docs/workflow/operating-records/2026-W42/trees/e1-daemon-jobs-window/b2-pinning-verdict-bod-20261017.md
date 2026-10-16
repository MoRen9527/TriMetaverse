# E1-4 b2 分水岭勘钉定谳卷（BOD 自主值守段代勘）

- sourceOfTruth: 本卷（勘钉定谳记录·heartbeat 现势以 daemon 面为准）
- syncMode: manual
- lastSyncedAt: 2026-10-17 06:55 +0800
- 勘钉人: BOD（董事会值守·CEO 02:56 自主权令域内）
- 工单来源: b2 首拍告警（04:37 拍面）+二拍（05:08）后 BOD 派 sg 值席勘钉工单；值席回卷未达，BOD 06:49 自查代勘——值席工单随本卷销

## 一、分水岭判据应用结果

预置判据（05:08 派工令）：TriMMC store TriMLC 最后心跳值面——新值=误报 / 停 02:37±=真告警。
实勘：**两预置判据均不命中，实际第三态**——mirror 心跳登记最后活动停 **本地 04:08:12**（≠新值，≠02:37±）。

## 二、实勘读数（sg M-SG-47.245.122.61·2026-10-17 06:47-06:50 现查）

| 勘点 | 读数 | 换算/含义 |
|---|---|---|
| b2 state `/home/fleet/.trilc/e1-b2-heartbeat-watch-state.json` | `lastActivityEpoch=1792181292826` `alerting=true` `alertAt=05:08:13+08:00` | 最后活动=本地 **04:08:12**·gap 至 06:49 ≈ **161min** |
| `/tmp/trimc-run.log` 大小 | 5583655 > b2 offset 5580966 | 增量读取面正常（新字节均为 cron 行非 mirror 行） |
| `TABLET-*30340`（restart 后新 pid）行 | **0 行** | 新实例从未以 mirror 行登记 |
| `TABLET-*30624`（restart 前旧 pid）行 | 7 行·尾行=stale→unknown(lastSeen≈31s) | 旧会话 stale 收尾 |
| mirror 行总数 / 尾行时点 | 1018 行·尾=04:08± | log 本身在滚（06:49:30 仍有 cron 行）——8712 daemon 活体正常 |
| b2 job state（8712 jobs.json） | lastRun=本地 06:38:14·runCount=13·nextRun=06:53:14·lastRunStatus=ok | **调度面正常**（第一刀换算勘误已自纠：UTC 误当本地） |

## 三、定谳

**b2 告警非误报，亦非宿主/daemon 故障——实为第四态：8713 mirror 心跳登记链于 04:06 段2 restart 后未恢复。**

- 8713 主面真健康：healthz ok=true·uptime 03:06 起连续递增（3971→4678→5771→7571→9371→(06:52)10371±）零中断·mc_link=connected·ac=100%。
- 断的是观测链：restart 后新进程（pid 30340）心跳未再以 `[trimc:mirror] node` 行形态到达 8712 日志登记面（30340 零行）；TCP/API 面 connected 与 mirror 登记死亡并存。
- 时序关联：mirror 尾行 04:08:12=段2 restart（04:06 完工）后约 2 分钟——强关联 restart 次生，非独立故障。
- b2 两拍告警文本三候选（宿主睡眠/daemon 死/隧道断）全部排除——真实第四候选系 spec 预设之外，观察者面价值实证。
- 门禁设计（「勿盲目重启对端」）价值实证：若按旧形态处置必然重启健康 daemon。

## 四、处置

1. **勘修挂账**（非 BOD 半夜施工域）：TriMLC mirror 心跳上报 restart 后恢复逻辑勘修——投 COS 链转 CTO/COO 排工。影响面=仅跨机观测链（b2 会持续拍告警直至修复或阈值调定）；主功能零影响。
2. **b2 阈值/告警语义候修**：修复前 b2 将按 60min 阈值持续单发告警（已两拍 04:37/05:08 后 state 停更告警不重复——实际仅两拍）；修复窗口随排。
3. **值席工单销**：BOD 代勘闭合，值席无需回卷（如已在中途，其结论与本卷对表即可）。
4. **08:00 夜班汇总并卷**：本卷并入候 CEO 阅件。

## 五、落款

- 拍发: 2026-10-17 06:55 +0800（D-47 双保险：写前 date 现查 06:49:20 +0800（sg 侧）/发完重跑对表）
- 证据锚: sg jobs.json job `e1-b2-8713-heartbeat-watch`·state 文件 path 如上·trimc-run.log L47975 尾 mirror 行
- 关联: LG-088（电源层勘验）·段2 restart 窗（04:00-04:06）·E1-4 b2 spec 7bc56408b
