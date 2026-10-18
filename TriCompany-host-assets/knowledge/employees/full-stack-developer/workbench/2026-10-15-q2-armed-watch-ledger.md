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
| 10-16 14:36 拍 | true | 0 | 06:35:07Z items=0 空轮 | —（无信轮） | 隔夜连跑零失败（log 06:20-06:35Z 四轮全绿）·停工值守窗内轻量拍 |
| 10-17 夜（22:40 眠前读数·回溯记） | true | 14（眠窗累计） | 眠窗连败 | — | **眠窗形态实锚**：宿主眠→18710/sg 全断连败 14 拍·告警链 fetch failed 同眠发不出（歪打正着零假 BOD 告警）——候选⑥眠窗抑制材料+1 |
| 10-18 09:1x 晨拍 | true | 0 | 01:15Z 恢复·连败 14 拍清零 | —（无信轮） | keeper+echo-pull 双链 01:15Z recovered（唤醒即愈）·COS 眠窗连带判读采信·陈旧 NOTIFY 附着 3 条=去重族第 3 例·duty-cos 711min escalate=灰度数据点（裁量回 COS） |
