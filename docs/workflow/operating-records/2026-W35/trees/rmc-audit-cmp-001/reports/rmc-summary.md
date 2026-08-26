# rmc-summary.md — rmc-audit-cmp-001 发现计数汇总（收口件）

## 节点头

- 节点：rmc-audit-cmp-001 / 树级收口件（doneCondition「发现计数汇总」半项）
- tick：20260826T203116Z（收口轮，零派工）
- 依据：CEO 勘正（tree-op notes 2026-08-27~04+08，commit 41a788f7）——AC-R4 改派 M 面(TriMMC)，本汇总覆盖本树归档三报告；doneCondition「四份报告齐」据此调整为三报告归档+R4 改派，非臆造完成
- 编制：编排实例；分级计数以各报告自带发现清单为基准，编排侧独立 grep 清点条目数复核（19/28/23 条，与三报告自报全对）

## 汇总表

| 报告 | 审计范围 | 行数 | P0 | P1 | P2 | 小计 |
| --- | --- | --- | --- | --- | --- | --- |
| rmc-TriRMC.md | TriRMC src/ 四焦点域（cron/session-bridge/config-sync/agent-loop） | 136 | 3 | 8 | 8 | 19 |
| rmc-agent-core.md | TriCompany packages/agent-core/src 13 源文件全量 | 141 | 4 | 10 | 14 | 28 |
| rmc-TriLC.md（round4 精修版） | TriLC server/app.ts + config/ + cron/ 三域 14 文件 | 139 | 1 | 8 | 14 | 23 |
| **合计** | — | 416 | **8** | **26** | **36** | **70** |

## TriLC 双版本口径

现存 139 行精修版（41a788f7 收录）取代 89 行先发版（bfefa3e1，P0=4/P1=8/P2=6）：精修版将先发 4 项 P0 合并为单一复合 P0-1（全 HTTP 面零认证 + cron command / MCP add / 默认 bypass 任务流三条执行通道 + 无 Host 校验 DNS rebinding 可达），P2 扩充至 14。本汇总以精修版为准，先发版留 git 历史。

## 各报告门禁结论（摘）

- TriRMC：P0-1/P0-2 修复前，8710 端口不应视为已加固（同机任意本地进程可未认证注册 root 级 cron 作业）。
- agent-core：P0 修复并补齐模式矩阵与边界穿越回归测试之前，不应接入任何非 bypass 场景宿主。
- TriLC：测试判断 FAIL——认证层、Host 校验、默认权限模式收紧、cron command 白名单四项落地前，不应在「完全可信单用户本机」以外环境启用 daemon HTTP 面。

## 跨报告同源缺陷谱系（M 面 TriMMC 对照价值）

| 谱系 | TriRMC | agent-core | TriLC | 级别 |
| --- | --- | --- | --- | --- |
| 权限引擎内容匹配退化为全文子串匹配 | decision-pipeline.ts:100-108（本地拷贝，连 dontAsk 都无） | decision-pipeline.ts:417-430（同源真源侧） | （精修版定点核验 decision-pipeline.ts:95-142 不重复计数） | P0×2 |
| cron/任务通道任意命令直执行 | command-handler.ts:85-88（runAs 反用提权） | — | timer.ts:234-245（/bin/sh -c 直执行）+app.ts:3402-3405 | P0×2 |
| /internal 面鉴权缺失 | app.ts:121-122（token 未配置=fail-open 零鉴权） | — | app.ts:1419-3777（全端点零认证+DNS rebinding 可达） | P0×2 |
| bypassPermissions fail-open 缺省 | — | loop.ts:346 + spawn.ts:31-39（子代理恒 bypass） | app.ts:4079（任务流缺省 bypass） | P0×2 |

四条谱系在 ≥2 仓同源复现，与「M 面 TriMMC 审计对照」的树题直接对应：修复应按谱系跨仓收敛（如权限引擎收敛到共享真源，TriRMC loop.ts:1-11 注释已声明 agent-core 为 shared truth）。

## 边界

- AC-R4（TriModel config/client/providers/api）不在本汇总：按勘正改派 M 面 TriMMC 承接，产物以 M 面侧树为准，本树不做任何 TriModel 侧结论。
- 三报告均为静态逐行审计，未做动态利用验证（各报告「测试判断与门禁评估」节自述）。
- 本汇总计数经编排独立清点复核；精修版 TriLC 另补两处 file:line 抽查属实（key-cache.ts:56 · app.ts:1235）。
