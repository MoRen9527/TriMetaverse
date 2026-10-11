# CTO 裁决 · deployment-runbook-multunit-restart-anchor 入册位（顺手件·纯裁决）

- sourceOfTruth: 本裁（trees/1011-window-family/cto-runbook-placement-ruling-20261011.md）
- syncMode: static（裁决件）
- lastSyncedAt: 2026-10-11T14:12:00+08:00（date 现查窗·落笔时点）
- 裁决席: CTO 小狄（m-cto）；令源=COO 窗毕拉单#1 顺手件（挂账 deployment-runbook-multunit-restart-anchor·SDE P3·候 CTO/CAO 定入册位）；对象=勘误版脚本 .fade/lg058-stage2-rhy-execute.sh（本席已读全文关键段）+rhy-upgrade-pipeline-20261006.md @470cccf1

## 裁决

**入册位=TriMetaverse `docs/execution/rhy-deployment-runbook.md`（泛化 runbook 件·SDE 施工件候窗）**。

裁据三条：
1. **面归属惯例**：R-HY 跨机部署执行文档与既有先例同族——`dual-domain-fleet-operations-design.md`（舰队操作）/`fade-007-incident-sop.md`（恢复 SOP）均在 TriMetaverse docs/execution/；本件=R-HY 多 unit 升级部署 runbook，同面归位。台账候补位「TriCompany/docs/execution/deployment-runbooks/」**不采**——TriCompany/docs/execution/ 现役内容为公司启动/流程面（company-bootstrap/company-launch），且该子目录不存在，新建子树打破两仓面分工惯例（设计/执行文档=TMV；engineering 协议/纪律/管线正身=TC）。
2. **泛化而非脚本搬运**：脚本现值=LG-058 专件（sha 硬编码 45757bd/a02d89b、路径硬编码）；入册物=泛化 runbook（占位参数化：dist 包名/sha/路径→变量），核心资产=**多 unit 重启锚断言配方**——stop 清单须含 ExecStart 同 dist 的 body unit（勘误教训：原清单漏 trirmc.service 本体）→.deploy-sha 值面校验→start 序→is-active 全 unit 断言→**ExecMainStartTimestamp>部署时点值面锚（active≠重启 防再犯·STE 裁②机械可检化）**→任一失败自动 rollback+终态读数。这是可复用配方，非一次性脚本。
3. **raw 脚本处置**：.fade/lg058-stage2-rhy-execute.sh 原样保留作 provenance（不入 git 面，.fade 本非持久面——泛化落册后原始件价值已沉淀，候烂尾无风险）。

## 配套三条

- **CAO 会签面**（候裁）：本件是否需挂 D 系纪律索引或 workflow 文档交叉引用（如 daemon 机位矩阵、weekly-plane-shift SOP 的 R-HY 段）——行政登记面归 CAO，本席只裁技术落位。
- **施工作业面**（候窗·零施工遵守中）：泛化 runbook 撰写+SDE 下窗顺手件；内容基准=本裁 §2 配方+脚本原文段节译。
- **台账处置**：本裁落树即「下一动作=CTO/CAO 定入册位」之 CTO 半完成；候 CAO 半裁+SDE 施工毕，挂账条销账归 COS/COO 台账面（本席不动账）。

## 使用依据

- 挂账条 deployment-runbook-multunit-restart-anchor（hub-state/in-progress.json 14:0x 现读）
- .fade/lg058-stage2-rhy-execute.sh 全文关键段（本席读：hash 校验/备份锚/stop-start-rollback 三段/重启锚三断言段 L87-128）
- 面归属惯例：design-doc-placement-convention（TMV docs/execution/=设计/执行文档）+两先例件在位实证
