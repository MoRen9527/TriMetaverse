# r-plane-eval-01 · 改进计划卷 · CFO 节（成本护栏节）

> 席位=CFO（小财）· 签发时刻=2026-11-04T13:34:18+08（date 现查）
> 状态条（M-001）：首读数 UTC 2026-11-04T05:34:18Z / CST 13:34:18+08 原样粘贴；水位自估=高；末次活动时刻=不可得→以签发时刻代之并标注
> 上游依据=同树 `reports/cfo-maturity-cost.md`（F1-F8 事实面与 L1 总评）
> 边界声明：本节为财务口径与验收锚供给；代码改动点裁决归 CTO，实施归 FSD，门禁归 STE，排程对轨 D-23。评估约束下本节零代码零配置写入。

## 改进主轴：护栏即判断——产品侧成本维度 L1→L3 三步走（L4 随商业化节奏）

### P0 计量落盘（L1→L1.5 · 最小改动优先）
- 改动点（供 CTO 勘裁）：两 stream 末端（`openai-stream.ts` emitUsage 处 / `anthropic-stream.ts` usage 汇总处）追加 per-call 追加式落盘：`{ts, session, model, in_tokens, out_tokens}` → 面级 jsonl 账本（data-dir 内，随 watchdog data-dir 约定）。
- 财务验收锚：任一会话结束可从账本回读该会话 token 总量；账本只追加不改写（审计律）。
- 成本语义：纯本地写盘，零新增模型调用、零新增 recurring 成本。

### P1 护栏机械化（L1.5→L2）
- 改动点：watchdog 既有 rateLimit 骨架（F5）扩维——新增**累计 token 阈值**检查（面级+席位级两级 cap，配置化）；触线行为=先报后停两段式（80% 预警 / 100% 停工）+升级链播报（COS→BOD；CEO 阈值机制在案：累计>2 亿/单次>1 亿 token 升级 CEO）。
- 8711 API 面增益：新增只读 burn 读数端点（免写、随 healthz 只读面惯例，F8 从闸定位不破）。
- 财务验收锚：模拟触线→daemon 停工且升级播报发出；阈值配置改后即生效。
- 联裁项：阈值初始值=CTO+本席联裁（宽起步防误伤长任务）。

### P2 口径统一出报（L2→L3）
- 改动点：账本→burn 读数出报器：GLM/DS 对轨分列；周平面出读数，入 operating-records 当周（对轨 M 面 burn 口径统一原则：先对齐口径再报数）。
- 财务验收锚：周记录含「面级 burn 读数」段，口径=账本直读零估算。

### P3 经营闭环（L3→L4 · 候商业化节奏，非本期承诺）
- 货币化换算层（公开报价表配置化，报价源现查后接入）+单位经济（成本/任务·成本/席位·成本/周）+结算映射（provider 账单↔面级账本归因）。
- 与 M 面 BUDGET_CHECK schema 七必填打通（budgetWindow / fixedCostEstimate / variableCostEstimate / runwayImpact / guardrails / stopConditions / assumptions）——R 面账本即 fixed/variable cost 的事实来源，结论回写 registry 不滞留记忆层。

## 分工与路由（供值席收口参考）

- 技术可行性/改动点裁决=CTO → 实施=FSD → 门禁=STE；排程按 D-23 对轨（批量 token 窗/专注窗判据）。
- 本席保留面：P1 阈值定值联裁、P3 报价源与结算映射口径——届时以 BUDGET_CHECK 件族走正式审查（回执=BUDGET_CHECK 意见单）。

## 风险与升级

- 全计划 P0-P2 **零新增 recurring 成本**（本地写盘+读数），不触发授权矩阵新增支出分级；实施中如涉新工具订阅/云资源，先补 BUDGET_CHECK 再动工。
- P1 停工护栏误伤面（长任务被截断）→ 两段式（先报后停）+宽起步阈值缓释；具体值候 CTO+本席联裁。
- 本计划不承诺时间表——排窗归 D-23 纪律与 COO 节律面，本节只锚验收条件。

## 使用依据

- 同树成熟度评估卷 CFO 节（F1-F8、L1 总评、两面对轨结论）。
- 勘验源码只读证据（路径见评估卷事实表）。
- 财务框架参照：本席财务制度面（BUDGET_CHECK schema、授权矩阵分级、CEO token 阈值在案口径）。
