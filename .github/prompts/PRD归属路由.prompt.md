---
name: "PRD归属路由"
description: "适用场景：PRD 归属未明、docs bootstrap 落点不清、需要向 ChiefProductOfficer 发起标准归属路由请求，或让自然语言请求与 PRD_OWNERSHIP_ROUTING JSON 草案对齐时使用。"
argument-hint: "输入 PRD 引用、候选模块、候选落位仓、当前证据和阻断影响，或让系统基于当前上下文补齐 PRD_OWNERSHIP_ROUTING 草案"
agent: "ChiefProductOfficer"
tools: [read, search]
---
你现在要执行一次正式的“PRD 归属路由”动作。

把本次 prompt 命令的触发视为：发起人已经明确要求 `ChiefProductOfficer` 先判断某个 PRD 应归属哪个模块 / 项目、落到哪个仓和哪个 `docs/` 根，再决定后续是否交给技术侧。`CEOChiefOfStaff` 只负责公司级任务分派、排程、催办、升级与跨域收口，不再代替产品侧做 PRD 归属判断。若本次事项进一步触发岗位 / 职责交接流程设计或完成度监督，再交由 `ChiefHumanResourcesOfficer` 主责治理。除非用户另有说明，从这次 prompt 触发起，相关 docs bootstrap 应默认处于冻结状态，直到形成可执行的路由结论。

在输出前，优先遵循以下文件中的规则：

- [PRD 归属路由 Intake 模板](../../docs/workflow/prd-ownership-routing-intake-template.md)
- [Workflow Runbook](../../docs/workflow/workflow-runbook.md)
- [虚拟公司标准交接对象](../../docs/workflow/cyber-company-handoff-objects.md)
- [PRD 归属路由样板 JSON](../../docs/workflow/handoff-templates/prd-ownership-routing.example.json)
- [PRD 归属路由 Schema](../../docs/workflow/prd-ownership-routing.schema.json)
- [产品总裁主规范](../agents/chief-product-officer.agent.md)
- [总助主规范](../agents/ceo-chief-of-staff.agent.md)

基于用户输入和当前上下文，完成以下动作：

1. 判断当前信息是否足以受理一份 `PRD_OWNERSHIP_ROUTING` 请求。
2. 如果关键信息不足，只补问最小缺口，优先补：
   - `prdRef`
   - `requestReason`
   - `candidateModules`
   - `candidateRoots`
   - `currentEvidence`
   - `blockingImpact`
   - `requestedDecisionBy`
3. 当前阶段默认由 `ChiefProductOfficer` 受理；`CEOChiefOfStaff` 只负责公司级任务分派、催办、升级和收口，不要把产品归属判断再退回给总助。
4. 判断本次是否需要先询问 `BusinessStrategy`；若需要，必须说明触发原因；若不需要，也必须说明原因。
5. 如果信息足够，优先整理出一份 `PRD_OWNERSHIP_ROUTING` 草案，尽量对齐：
   - [PRD 归属路由样板 JSON](../../docs/workflow/handoff-templates/prd-ownership-routing.example.json)
   - [PRD 归属路由 Schema](../../docs/workflow/prd-ownership-routing.schema.json)
6. 在路由结论未形成前，明确写出“docs bootstrap 继续冻结”，不要默认放行创建目录、补五层 docs 或进入 `DESIGNING`。

如果信息足够，默认输出结构如下：

## 受理确认
- 是否正式受理本次 `PRD_OWNERSHIP_ROUTING`。
- 当前受理人是谁。
- 公司级协调 owner 是谁。
- docs bootstrap 是否冻结。

## 当前缺口
- 如信息不足，只列最小缺口。

## 路由判断
- 是否需要升级到 `BusinessStrategy`。
- 后续是否应切给 `ChiefTechnologyOfficer`，以及原因。
- 若事项转成岗位 / 职责交接、handoff checklist 或 completion tracking，是否应交给 `ChiefHumanResourcesOfficer`。

## PRD_OWNERSHIP_ROUTING 草案
- 按对象结构整理最小草案。
- 至少覆盖 `payload` 中的关键字段。

## 下一步
- 当前谁负责。
- 什么时候给出结论。
- 若路由完成，后续由谁承接技术落地或公司级排程。

## 升级项
- 仍需 `BusinessStrategy`、CEO 或其他 owner 决策的事项。

禁止事项：

- 不要因为当前工作区正好打开某个仓，就默认把该仓当成 PRD 的归属落点。
- 不要在证据不足时直接给出模块归属最终结论。
- 不要把 `PRD_OWNERSHIP_ROUTING` 默认等同于 `CENTRAL_REGISTRY_CLOSEOUT`。
- 不要把 `PRD_OWNERSHIP_ROUTING` 的产品归属判断退回给 `CEOChiefOfStaff`。
- 不要绕过 `ChiefProductOfficer` 直接把问题推给 `ChiefTechnologyOfficer`。