# LG-064 FSD 毕报（活体告警三机施工+演练收口）

- sourceOfTruth: 本件（FSD 毕报正身；候 STE 验证→BOD 非作者走查 10-07→CEO 知会）
- syncMode: final
- lastSyncedAt: 2026-10-05 11:50:00 +0800（date 现查贴原值 11:49:5xZ 段落）
- 编写席: FSD 小全（m-fsd）；配套=liveness-rules-20261005.md（规则）+drill-receipts-20261005.md（证据）

## 实现方案

按 CTO 方案确认卷（cto-tech-plan-confirm-20261005.md，0cdc55ae+A 形裁决）落两层监控：

- **L1 各机本地自检（5 分钟节奏）**：本机=计划任务 TriLiveness-L1（D-29 wscript 无窗形，PS5.1 宿主）探 8713 端口/pidfile 对表+healthz cron 面+cron.db.json 逐 job 精判+Watchdog 任务态；M-SG=/etc/cron.d/tri-liveness→tri-liveness-l1-msg.sh（systemctl 三态+healthz+tri-heartbeat-check.py 精判+logs 粗判）POST 8712 notify；R-HY=A 形退化 tri-liveness-l1-rhy.sh 纯判据写 state 文件（notify 404 实勘，无本地发报能力）。
- **L2 本机远程巡检（10 分钟节奏）**：计划任务 TriLiveness-L2 ssh 拉 R-HY/M-SG 三态读数+R-HY state 文件 ALERT-NEEDED 中继（A 形正解）+SSH 失联第四维（cause-undetermined 禁误判文本）；告警经 18710 隧道→sg 8712 notify 值席。
- 判据核心：store 逐 job 精判=正判据（every-job 窗 max(3×everyMs,30min)；cron-expr job nextRun 到期+30min 未执行），logs 粗判=辅助；debounce=2 连续轮，恢复清零；pending 落盘重发；告警文本零敏感值。

## 代码变更

监控面全部外挂，三 daemon 源码零改动（边界 1 成立）：

| 落点 | 件 | 说明 |
| --- | --- | --- |
| 本机 `%LOCALAPPDATA%` | tri-liveness-l1.ps1 / tri-liveness-l2.ps1 | 双探针；l1 含解析修复（DateTime→'o' 回环+Invariant+AssumeUniversal，双宿主安全） |
| 本机 | tri-liveness-l1.vbs / tri-liveness-l2.vbs | D-29 无窗启动形 |
| M-SG /usr/local/sbin/ | tri-liveness-l1-msg.sh、tri-heartbeat-check.py | 自检+store 精判；token=/proc daemon env 管道（/etc 陈旧文件不触） |
| R-HY /usr/local/sbin/ | tri-liveness-l1-rhy.sh | A 形判据写入 |
| 两 Linux 机 /etc/cron.d/tri-liveness | `*/5 * * * * root …` | 远程 printf 落，0 CR 验 |
| 本机计划任务 | TriLiveness-L1（5min）/TriLiveness-L2（10min） | jedih Interactive，schtasks 无内引号形 |

## 自测结果（=演练证据，全量读数见 drill-receipts）

- **三机×三维收款矩阵全绿**（本机 degraded 维除外→设计缺口改记录覆盖）：process 本机/M-SG/R-HY ✓✓✓，disabled ✓✓✓，heartbeat M-SG（真实 degraded 链+演练 consErr=3+自检 POST）✓、R-HY（drill consErr=4→L2 中继 200）✓、本机 stale 面幻影事件双向实证 ✓。
- 告警出闸账：L1 7 条（1 污染）/L2 6 条（0 污染）/M-SG 4 条+款4 探针 1 条；**假阳性合计 1 条（02:41:26 解析幻影，已修复+双宿主复验）**；全部回执=message_id/HTTP 200 级。
- 真实捕获：M-SG config-sync-apply 连败链（02:35Z 起）全程捕获、triage 定谳根因（工作树脏文件阻塞 pull）、真实告警持续抵值席——监控部署当日即兑现活体价值。
- 任务上下文实跑验证：两修复（ssh -n 悬挂、PS5.1 引号吞噬）后 L2 真任务轮绿（02:50:18 起 6 轮含真实告警）。

## 技术债务标记

| # | 项 | 去向 |
| --- | --- | --- |
| 1 | TriMLC degraded 全局计数掩蔽（单 job 连败不可见；TriMMC/TriRMC=per-job max 三形态分野） | 候 CTO 独立候办；rules §二.4/§六.1 |
| 2 | R-HY store 精判缺失（4 探 timebox 到，store 位置未定）+A 形双故障窗漏告 | rules §六.2/.3 残差声明 |
| 3 | notify source_seat 白名单缺口（监控面借用 m-duty-cos） | 候 CTO 毕报裁，rules §五 |
| 4 | allowlist 2 死路径+本地 LLM 测试 job 成本泄漏（~65 次调用，已删） | rules §六.6/.7 |
| 5 | L2 ServerAlive 两参（验收窗内不追改） | 验收毕维护窗，rules §四.2 |
| 6 | M-SG /etc/trimc-internal-token 陈旧（未触，消费方未知） | 已记录；权威位=/proc daemon env |
| 7 | 假读数家族第五向候选：pwsh7 ConvertFrom-Json DateTime 类型变形 | rules §3.2，候 CAO 并档 |

## 使用依据

- CTO 方案确认卷 cto-tech-plan-confirm-20261005.md（0cdc55ae+A 形裁决+10:32/10:48 追裁：判据/ssh 三件套/规则文档收编令）；task-charter.md（99f4aad1）。
- 源码静读：TriMLC src/server/app.ts（POST/PATCH 门+healthz 块）、src/cron/timer.ts+service.ts（阈值 3/全局计数语义）；TriMMC src/cron/{routes,service}.ts（per-job max/零白名单）；TriRMC src/cron/service.ts（per-job max）；TriRLC src/cron/types.ts（CronJobPatch）。
- 实证日志：本机 l1.log/l2.log 全量、M-SG l1.log/state/notify-resp.json、R-HY state、config-sync 日志 5a8e6eac__03-17-24-131Z.log。
- 既有纪律：D-04 报时/D-24 机位/D-29 计划任务/值面禁出机/禁停生产正主（演练全走注入面+测试 job 形）。

## 排窗事项（候 COO）

- 24h 零假阳性窗：**2026-10-05T03:45Z 起**（施工收口锚）；窗内唯一持续真实信号=M-SG config-sync degraded（COS 修线）。
- b14-core-bump 晚窗：族③ CORE_VERSION 门随链尾（COO 认定卷），本席候令。
- STE 验证→BOD 非作者走查（10-07）：建议走查重点=演练矩阵真实性抽验（message_id 回执可对 TriMMC 侧查询）+01 污染告警已闭环定性。
