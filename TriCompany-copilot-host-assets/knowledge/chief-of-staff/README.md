# Chief Of Staff Knowledge Workspace

本目录是总助当前阶段的专属知识工作区。

当前已不再停留在最小闭环阶段；当前目标是在闭环之上继续把“零散资料投放 -> 自动整理成 wiki -> 保留审计痕迹 -> 前台工作台展示 -> 后台 task bus 常驻整理”连成同一条链。

当前治理口径：

- 本目录与 `../../docs/execution/hermes-copilot-host/phase-1/schedules/*.json` 一起，属于当前 Copilot-host 直接消费的 `support-object-set`。
- 它们不属于 docs published-copy manifest，不按 active / on-demand published-copy 追平纪律处理。
- 当前也不单独拆 host object manifest；只有在出现跨宿主分发、统一枚举或独立版本发布需求时，才再考虑单独建清单。
- 这里的 `support-object-set` 只指当前宿主消费或生成的对象载荷与工作区；LLM wiki 的机制实现、对象规范和 Hermes 吸收后的 runtime 代码，真源仍在 `TriCompany/docs/workflow/`、`TriCompany/docs/engineering/` 与 `TriCompany/runtime/cognition/`。

目录约定如下：

- `inbox/`：投放零散原始资料
- `wiki/`：自动整理或人工审核后的 wiki 页面
- `audit/`：整理、编译、写回和来源追踪痕迹
- `workbench/`：前台知识工作台静态入口与快照
- `workbench/approval-report/`：当前阶段固定审批报告锚点，承接 `snapshot.json` 与 `summary.md`

当前固定 report / report-like 锚点最少包括：

- `workbench/index.html`
- `workbench/snapshot.json`
- `workbench/approval-report/snapshot.json`
- `workbench/approval-report/summary.md`

这些文件虽由 runtime 生成，但当前都属于受治理的 `support-object-set`，不按 host-local `runtime-state` 忽略；只有治理锚点之外的临时 report / debug 输出，才先保持本地化。
当前 support execution / runtime 复扫结果是：除 `docs/execution/hermes-copilot-host/phase-1/SUPERMEMORY-LIVE-VALIDATION.latest.json` 这条固定 execution 证据锚点外，未再发现新的 report-like 子目录；当前需要单列治理的 report-like 子树仍只有 `workbench/approval-report/`。

当前阶段相关设计主档：

- `../../docs/engineering/chief-of-staff-llm-wiki-priority-plan.md`
- `../../docs/workflow/chief-of-staff-llm-wiki-object-spec.md`
- `../../../docs/workflow/tricompany-copilot-host-assets-migration-matrix.md`

当前固定 evidence / support-object-set 锚点的 machine-readable 附表草案见 `../../../docs/workflow/tricompany-copilot-host-assets-anchor-index.json`。
