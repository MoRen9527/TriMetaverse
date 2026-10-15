# Q2 反向通道 armed 观察期台账（件①验收 APPROVE 附带义务）

- 立：2026-10-15（CTO 验收卷 c50d7a545 判定 APPROVE·观察期建议=首周每日一拍 failStreak/时效读数入周报线）
- 拍读形（每日一次）：
  1. `cat D:/Code/ai/TriMetaverse/.fade/tmp/echo-pull-state.json` → armed/failStreak（failStreak≥3=告警已发或候查）
  2. `tail -5 D:/Code/ai/TriMetaverse/.fade/probe-logs/echo-pull.log` → 末轮 pull 形（items/stored/acked/suspects）
  3. 时效判（锚 1 双时戳）：有真信轮取 log first title 对应 ts_machine vs 拉取时刻，差>10min=超窗标疑应现（无信轮跳过）
- 判读基线：armed=true 为常驻正常态；failStreak=0 正常；空轮 items=0 正常；suspects>0 逐件查因（超窗/缺三元组=第二闸工作证据非故障，但须报 CTO 域）

## 每日拍读记录

| 日期（+0800） | armed | failStreak | 末轮 | 时效 | 注 |
|---|---|---|---|---|---|
| 10-15 19:49 首拍 | true | 0 | 11:45:06Z items=0 空轮 | 首真信 24s | armed 首日·cron runCount=5 err=0（CTO 19:48 抽验同读） |
