# 虚拟公司真实经营记录目录

本目录用于存放虚拟公司经营层的真实执行记录，与以下目录严格分开：

- `handoff-templates/`：仅放填写样板
- `operating-cycle-example/`：仅放样例包，不代表真实执行

当前约定：

- 真实经营记录按周或按月建立子目录
- 结构化对象优先使用 `objectId` 作为文件名
- 若同一对象需要保留多个生命周期快照（例如 `submitted -> completed`），建议建立 `YYYY-Wnn/<objectId>/` 子目录，并按 `objectId.<status>.json` 保留快照，不覆盖旧状态文件
- 若对象需要配套说明、未决事项、会议纪要，可与对象文件放在同一目录
- 若需要对外分享当周在项目推进中观察到的大模型能力问题、使用体验与实践经验，统一使用项目级 AI 共学周记，按周落在对应 `YYYY-Wnn/` 目录
- 项目级 AI 共学周记的 CEO 签发版本统一归档到 `项目级 AI 共学周记/`，便于后续按周查阅和对外分享
- 若真实执行中出现已提交或已关闭的 `PRD_OWNERSHIP_ROUTING`，也应落在本目录，而不是留在 `handoff-templates/` 或 `operating-cycle-example/`
- 公司级会议组织、纪要整理和回填规则，统一见 `../cyber-company-secretariat.md`

编号规则：

- 周计划目录使用 `YYYY-Wnn`，例如 `2026-W15` 表示 `2026` 年第 `15` 周
- 月度目标令目录或记录可使用 `YYYY-MM`，例如 `2026-04` 表示 `2026` 年 `4` 月
- `OPERATING_PLAN` 建议编号格式为 `OP-YYYYMM-Wnn-序号`，例如 `OP-202604-W15-001`
- `BOARD_DIRECTIVE` 建议编号格式为 `BD-YYYYMM-序号`，例如 `BD-202604-001`
- `PRD_OWNERSHIP_ROUTING` 建议编号格式为 `POR-YYYYMMDD-序号`，例如 `POR-20260426-001`
- `RESPONSIBILITY_HANDOFF` 建议编号格式为 `RH-YYYYMMDD-序号`，例如 `RH-20260520-001`
- 项目级 AI 共学周记建议文件名为 `project-ai-community-weekly-YYYY-Wnn.md`，例如 `project-ai-community-weekly-2026-W18.md`
- 同一时间窗口内若有多份同类对象，按末尾三位流水号递增

签发规则：

- 需要正式签发的对象必须带版本号，建议放在 `metadata.issuanceVersion` 或对象自身的业务版本字段中。
- 未正式签发前，对象状态使用 `draft` 或 `submitted`，不得写成 `approved`。
- 正式签发必须有明确的书面同意记录；当前阶段默认由 CEO 的书面明确同意作为最终签发依据。
- 对进入 `submitted` 的候选对象，生成同目录的 `*.sha256.txt` 指纹侧车文件，供 CEO 对照签发。
- 候选对象内容一旦变化，必须同时更新版本号并重新生成指纹，不允许沿用旧签发凭据。

当前首条真实记录位于：

- `2026-04/BD-202604-001.json`
- `2026-W15/OP-202604-W15-001.json`
- `2026-W15/OP-202604-W15-001.unresolved-items.md`

当前用于演示 `PRD_OWNERSHIP_ROUTING` 生命周期落盘方式的目录位于：

- `2026-W17/POR-20260426-001/`

当前首条真实 `RESPONSIBILITY_HANDOFF` 记录位于：

- `2026-W21/RH-20260520-001/`

当前首份项目级 AI 共学周记位于：

- `2026-W18/project-ai-community-weekly-2026-W18.md`

项目级 AI 共学周记签发版归档目录位于：

- `项目级 AI 共学周记/`
