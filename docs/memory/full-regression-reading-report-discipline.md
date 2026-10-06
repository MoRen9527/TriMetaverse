---
name: full-regression-reading-report-discipline
description: 完工回报必须含全量测试读数+既有失败归因，不能只报增量自测
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4c270512-3fd1-4afe-af35-e431485aa6d7
  modified: 2026-09-14T15:24:58.040Z
---

完工回报的测试读数必须含**全量测试**读数（tests/pass/fail/skipped 全四项），并**一并归因**既有失败项（备案项/漂移族/与本窗增量有无接触）；只报增量自测读数=漏报（CTO 2026-09-04T10:39Z 指正：LG-032 案 a 回报漏全量 552/556、3 fail）。

**Why:** 增量自测绿≠全量绿；全量读数+归因是 CTO 判定「本窗是否引入回归」的直接证据，缺了就得核验方自己跑。

**How to apply:** 交付回报前跑一次全量套件（如 TriRMC `npm test`、TriCompany 389 门 discover），报文含四项读数；有 fail 逐族归因（suite 名+漂移根因+与本次增量接触面判定）；既有备案项引备案锚。相关：[[subagent-persist-discipline]]（先写后报+证据）、[[chained-command-assert-abort]]（验证输出禁截断）。

**「既有」二字必须独立验证，不可转抄（2026-09-14 补强）**：LG-035 层 1 审中，CTO 复核了败案计数与套件归属（真），但把「5 败=既有面」的**既有**定性转抄自 FSD/BOD 归因——BOD 当晚重审出 W2/W4 实为 v4 层 1 引入的活回归（2/5 归因错误被「既有」遮住）。独立验法：对增量前基线树重跑同套件，或直接读败讯内容判断新旧（引 v4 形态的败讯=新）。**归因转抄即便来源是监督方（BOD）也不豁免**——计数与归属可复核，「新旧」定性必须自己证。
