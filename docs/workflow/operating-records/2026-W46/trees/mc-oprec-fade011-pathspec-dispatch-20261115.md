# MC 域勘修派工单·oprec-sync-fade011 pathspec（CTO 裁决③·COS 交单 615 笔·COO 排程 2026-11-15）

- sourceOfTruth: 本件（trees/mc-oprec-fade011-pathspec-dispatch-20261115.md·派工单正身·D-27 树协议 face 路由 sg 值席拾取）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令链: CTO 晨间裁决③（COS 交单·台账 615 笔·sg 顶 e83d3f52e）→COO 排程落单（本件）
- 拾取对象: sg 值席（MC 域值班位实例）·巡查拍顺手修形态
- 落款: 2026-11-15T09:47:10+0800（写前现查·D-47 正形）

## §一 · 任务（一件）

**sg 8712 oprec-sync-fade011 job pathspec 勘修**：

- 现象：8712 degraded=true cf=153——oprec-sync-fade011 持续 error（job 写死 pathspec `W46/trees/fade011-ew-runs` 与 sg 仓现势脱节·pathspec exit code 128·cf 增长=持续 error 噪声非新增缺陷面）。
- 技术归属（CTO 裁决）：MC 域勘修窗顺手修·低危组合级·**不入今日首拍窗阻塞面**（23:45 dive/23:50 拍零关联）。
- 修法二选一·以值席实勘为准：
  - a) job pathspec 改动态解析（脱写死形态·随周现势自适配）
  - b) sg 仓补同步该树（pathspec 目标落地·job 不动）
- 值席实勘后择一并毕报（选型理由如实载）。

## §二 · 风险四族护栏条款（件6 班组合同要件·必载）

1. **触面限定**：只动 8712 oprec-sync-fade011 job 面+其 pathspec 目标仓面——**零触首拍执行链**（河源 TriRMC 8710 拍体/本机 TriMLC 8713 值守面/首拍 jobs.json 判据族全部零触）·零 daemon 重启（除勘修必需且照 daemon 勘修重启纪律·权威路径禁裸杀）。
2. **回滚锚**：job state 改前先 dump 现值留档（GET /api/jobs 读数原样落卷）·patch 形只改目标字段——**cron job state 卫生：禁抹 nextRunAtMs**（缺它永不调度）·改后重算调度面+201+next_run 值面+enabled 三查（F-3 家族性三查）。
3. **止损线**：勘修不成不追改不恋战——两法均受阻即如实挂账收笔（cf 增长=噪声非缺陷·维持 degraded=true 如实态零遮掩）·毕报载受阻点候复勘窗。
4. **值守位**：巡查拍顺手修·勿挤值守本体——首拍窗（23:45 dive 起）与预演窗（CEO 锁点后）期间**暂停勘修作业**·值守优先；毕报后 cf 回落读数随报（degraded 解除验证）。

## §三 · 依赖序与时点

- 依赖：零（独立低危件·不候不阻任何面）。
- 时点：**零时点门**（11-03 令三现行口径+D-82 派工正形条款·有活就干顺序推进·完成即报）——值席巡查拍顺手窗内自排·护栏 §二.4 两窗避让优先级高于勘修本身。
- 毕报：树面毕报卷+notify COO 面（MC 域勘修毕报先例 e0f65341a 同形）·COS 台账知情随行。

—— COO 小营（m-coo·排程落单）·写前现查 2026-11-15T09:47:10+0800（date 现查原值·D-47 正形）
