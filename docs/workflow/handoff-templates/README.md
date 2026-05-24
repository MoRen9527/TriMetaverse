# 虚拟公司交接对象模板目录

本目录提供虚拟公司经营层标准交接对象的可直接填写样板。

## 使用方式

1. 复制最接近当前场景的 `.example.json`
2. 替换占位字段
3. 将对象提交给对应下游角色或流程
4. 如需扩展对象专属字段，优先放入 `payload`

## 当前模板

- `board-directive.example.json`
- `operating-plan.example.json`
- `demand-intake.example.json`
- `mvp-definition.example.json`
- `budget-check.example.json`
- `engineering-task.example.json`
- `sales-progress.example.json`
- `risk-escalation.example.json`
- `operating-review.example.json`
- `central-registry-closeout.example.json`
- `prd-ownership-routing.example.json`
- `skill-spec.example.json`
- `schedule-spec.example.json`

其中 `central-registry-closeout.example.json` 的最终文本化回复，默认配套使用 [中央收口输出模板](../../../.github/prompts/中央收口输出模板.prompt.md)，以保证 `CEOChiefOfStaff` 的最终回复与 JSON 样板字段保持一致。

## 说明

- 所有模板都遵循 `../virtual-company-handoff-envelope.schema.json` 的基础结构。
- 对象专属字段统一放在 `payload`。
- `schedule-spec.example.json` 表示通用定时任务模板，不只服务技能执行，也可用于提醒、邮件和固定检查点任务。
- `prd-ownership-routing.example.json` 用于 PRD 归属未明时，先冻结 docs bootstrap 并向当前阶段 `ChiefProductOfficer` 发起产品侧路由请求；`CEOChiefOfStaff` 只负责公司级任务分派、催办、升级与收口。
- 示例中的占位内容仅表示结构，不表示真实经营事实。
- `central-registry-closeout.example.json` 默认与 `../../../.github/prompts/中央收口.prompt.md` 和 `../../../.github/prompts/中央收口输出模板.prompt.md` 配套使用：前者负责判范围与组织 fan-in，后者负责生成最终回复骨架。
