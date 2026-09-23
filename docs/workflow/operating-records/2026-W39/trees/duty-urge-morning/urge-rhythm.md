# 报备一：定时催办节律（BOD 批令件一③，催办节律下沉 sg 值席）

- sourceOfTruth: 本件；机制载体=/home/fleet/duty-urge-patrol.py + sg crontab（45 */2 催办巡检、5 8 晨检）；状态=/home/fleet/.duty-urge-state.json
- 频次: **催办巡检每 2h（:45 错峰）**；晨检每日 08:05+08
- 触发条件: ①执行面=operating-records 当周+前周 md 面内「截点/deadline」日期扫描（临期≤36h/逾期>0h 即触发）②BOD 呈批面=unresolved-items 候批/候验/候裁/候终验行（每日一轮摘要）
- 逾期判据: 按台账常驻指令区三类口径——**不可逆/保留权/硬约束**触线才升级 BOD，其余常规催办（本脚本只探测+通报，升级动作归值席会话判）
- 通道: BOD 呈批面=M-SG NOTIFY（8713 信箱现役，target_seat=bod）；执行面席间催办=M-004 SendMessage 直达（值席会话执行，脚本只供读数）
- 去重: 每条目每日至多触发一次（状态文件按日去重）
- 判据数据源（0923 两轮校准·总攻件④+追补单）: **三源判据**——①树上任务书截点 ②COO/COS 变更通报 ③台账销账态（COS mirror 销账记录推导，销账单跳过逾期判定；假阳性二型：LG-042/044/043 三任务书已销已入白名单）——树上任务书截点+COO/COS 变更通报；凡截点顺延/取消/变更经 COS→COO→sg 值席通报链显式广播，值席更新白名单（/home/fleet/.duty-urge-whitelist.json，现役 4 条：LG-046 取消/LG-051 改 09-24 12:00/core-agent 终批/LG-039 明晨窗）后再判逾期。
- 策略变更权: 台账真源与催办策略变更权归 COS（本件照 BOD 批令记录，不自行改）
