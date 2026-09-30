# 候验初读供弹卷·四组三态（batch-03 件3，初读非终验）

- 执行: m-duty-cos 1001 00:5x+08；只读；观测面=sg TriMMC 8712（loopback）jobs API+/var/lib/trimc/cron/logs 文件名面
- **判读限界如实注**: 执行日志内容 root-only（fleet 可列不可读，API 无 run-state/detail 端点）——本卷三态判定基于**在册态+文件名级 cadence 实证**，内容级绿判候 root 通道或 API 扩面；BOD 明晨哨窗亲验终判

## 四组逐行

| 组 | 在册/实证 | 三态 | 读数 |
|----|----------|------|------|
| tree-node-patrol | 8712 jobs 零注册；日志面零文件 | **缺席** | 未落位 sg 面——疑 TriMLC 8713 侧（跨机不可达）或候注册；候 CTO/枢纽指认落位 |
| watchlist-patrol（sg-watchlist-patrol） | 在册 enabled=true；**302 轮日志**；5min 节律（18:25-18:45Z 连续轮实证）；最新轮 02:45+08 | **绿（cadence 级）** | 节律稳定高频在跑；内容级候权 |
| hub-silent-detect（按 sg-8460-probe 认定，d15-8460-probe-job-01 构建树互证） | 在册 enabled=true；00:12Z（00:12+08）轮日志在卷=D-15 00:20 窗内执行实证 | **绿（执行级）** | 首轮执行实证；内容级候权 |
| D-15 哨 00:20 首轮 | 即上组 00:12Z 轮（窗口贴合规差 8min 如实注） | **绿（执行级）** | 同上；读数内容候权 |

## 观察项（如实录不擅判）

1. tree-node-patrol 缺席面落位归届（TriMLC/未注册）候指认；
2. 日志内容级判读需 root 通道或 cron API run-state/detail 端点扩面（候 CTO 线，可与 E-0011 restart 同窗议）；
3. 8712 实例 job 条目普遍无 run-state 键（weekly job 亦仅 runCount）——实例级状态回写面疑未启用（「服务暂不可用 vs 写面未启用」两态勘别承 recovery-ladder 偏-2 案先例），归 LG-056/改制线观察。
