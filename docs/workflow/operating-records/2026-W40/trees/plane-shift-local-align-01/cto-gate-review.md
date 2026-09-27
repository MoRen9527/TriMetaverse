# CTO 技术门审·LG-056 落位件+LG-057 巡检器同载（SDE 周一窗提请，COO 转达）

- sourceOfTruth: 本件（两件联合技术门门审正身；D-15 枢纽门审留痕；LG-057 面指针树=trees/tree-node-closure-01/）
- syncMode: final
- lastSyncedAt: 2026-09-28 01:0x +0800（date 现查 00:57 hook 链）
- 门审对象: align-rehearsal-and-form-study.md §六 @ 4a87013a（LG-056）+ procedure-supplement-draft.md @ aaece6f8（LG-057 规程草稿 §九 执行体面）

## 门审总判：**LG-056 APPROVE + LG-057 同载 APPROVE（技术载体面）——门过即落位**

## 一、LG-056 执行体候选①定谳：**APPROVE**

- **活体抽验（本席 01:0x 现勘）**：8713 healthz ok、cron.enabled=true、jobCount=2、degraded=false、consecutiveFailures=0、uptime 与 SDE 读数时移一致——在役生产调度器非空转面**本席独立复核坐实**。
- **候选比对裁**：①在役先例（l2-scan 每 2 分钟级 996 次 ok）+API 全族+croner 6-field 原生 cron+tz（`0 10 23 * * 0`+Asia/Shanghai 语义核验=周日 23:10:00 ✓）+白名单门现成配置（launcher cmd 自持 env 加条目即得）；②403 实测须注入 allowlist 改动量≥①+R 面 daemon 挂 M 面任务跨面语义不顺——**①定谳正确**；③ D-29 约束维持荐度降 ✓。附带勘正（cron.db 0 行=数据目录勘错）采认。
- **白名单门定性正面**：P0-3 精确等值匹配（app.ts L239-246）+CLI 同端点非旁路（cli.ts L837）——受控扩展面，追加固定命令全串=最小授权增量 ✓。
- **A4 通知零新建**（TRIMC_NOTIFY_SG_URL 在 daemon env）✓。

### 执行注记三条（落位时随读数留痕）

1. **白名单条目全串显式留痕**：追加的 align 命令全串（含参数）在部署读数中原文记录（白名单=安全面配置，条目内容可审计）；
2. **重启窗语义**：D-03 纪律重启致在役 2 job 中断一个调度窗——l2-scan（120s 周期）重启后自愈，无需补跑；重启后 GET /healthz 留痕（对齐电池门窗纪律族）；
3. **23:10 时窗余量语义**：本机核心对齐目标=河源翻周提交（先例 23:00:11，余量 10 分钟充足）；河源翻周迟超 10 分钟时本机当轮拉空——自愈路径=下轮或 `/{id}/run` 手动补触发，不算缺陷，SOP diverged 策略成文时并列收录「拉空」分支。

## 二、LG-057 巡检器同载：**APPROVE（技术载体面）；判定口径与规程定稿链分界如下**

- **同载裁**：巡检 job 与对齐 job 共享白名单条目+同一重启窗一次落位——减一次 D-03 重启+一条白名单条目两用，合批正确。
- **判定逻辑实现依据裁**：巡检器超时判定以**任务书 §四「不含承接席作业时长」口径为实现依据**（执行型节点 5 分钟卡「认领」=接令回执到账，收口件随作业毕落账）——该口径系 CEO 定稿令原文，SDE §四细化勘定=其操作化，巡检器可依此实现不候规程章形式定稿；规程章（V0.6→V0.7）定稿走其自有批准链（CEO 定稿令/COS 面归口），**本技术门不审规程内容面**——两链并行不互阻。
- **实现留痕要求一条**：巡检 job 的「在途树枚举来源」（树目录扫描/台账指针）须在落位读数中明示——枚举面决定漏检面，可审计。
- notify 走 TRIMC_NOTIFY_SG_URL 现成通道 ✓；every 60s 轻读比对负载可忽略 ✓。

## 使用依据

align-rehearsal-and-form-study.md §五/§六（4a87013a）；procedure-supplement-draft.md §四/§九（aaece6f8）；任务书 87d1b44b（LG-056）+8c242679（LG-057，§四口径）；本席 8713 healthz 活体抽验（01:0x）；BOD 载体勘正令（§五）；COO 转达令（00:57）。
