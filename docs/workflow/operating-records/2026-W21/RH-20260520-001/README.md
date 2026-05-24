# RH-20260520-001 真实交接记录目录

本目录用于存放 `RESPONSIBILITY_HANDOFF` 的首条真实 operating record。

说明：

- 本目录不是演示目录，相关 JSON 代表当前真实治理状态。
- 当前记录表达的是：`ChiefHumanResourcesOfficer` 已完成 source-side 定义与交接治理真源补齐，但仍处于 `source-side-not-live`，因此交接治理继续由 `CEOChiefOfStaff` 代执行。
- 只有在后续独立 live binding 判断完成后，才可以继续追加新的 lifecycle 快照；不得回写覆盖当前 `submitted` 快照。

目录结构：

- `RH-20260520-001.submitted.json`：当前正式提交态快照
- `RH-20260520-001.submitted.sha256.txt`：提交态指纹侧车

推荐规则：

1. 当前外层 `status` 使用 `submitted`，细粒度交接进度使用 `payload.completionTrackingStatus=blocked`。
2. 若后续进入独立 live binding 评估或完成交接验收，应新增新的状态快照，不覆盖当前文件。
3. 若后续中央边界、正式宿主边界或长期岗位结构发生变化，应先升级 `BusinessStrategy` 或 CEO 再继续推进。
