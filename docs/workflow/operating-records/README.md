# 赛博公司真实经营记录目录

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/README.md
- syncMode: source-only
- lastSyncedAt: 2026-06-29

本目录用于存放赛博公司经营层的真实执行记录，与以下目录严格分开：

当前文件是 TriMetaverse 的 operating-record / audit-record 目录规则真源，用于维护发布侧经营记录、审计留痕和跨模块执行证据的归档边界。它不是 TriCompany 公司级 workflow 书面主真源，也不替代 TriCompany 对 IPD、岗位职责或公司制度的源侧定义。

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

周记录闭合与平移规则：

- 同一时点需要继续跟踪的未决事项，默认只维护在**当前周维护面**（即最新周的 `OPERATING_PLAN` 与配套未决事项清单）里。
- 历史周一旦完成“闭合并平移”，该周记录只保留历史事实、闭合说明、证据和 successor ref，不再继续作为 active 待办面追加新事项。
- 若历史周仍有未闭环事项，需要在最新周记录中显式写明：来源周、当前状态、下一步、owner、恢复条件和引用真源。
- 单事项跨周平移达到 **4 周** 时，标记“预警”，并要求对应 owner 给出处理动作。
- 单事项跨周平移达到 **8 周** 时，标记“高预警”，并进入 CEOChiefOfStaff 催办面；若下一周仍无处理意见，应升级 CEO 裁定或明确冻结。
- 平移后的最新周记录应在 `metadata` 或 `payload` 中保留 carry history；历史周记录应回填 successor `OPERATING_PLAN` 引用。
- 周度平移可使用 `.github/prompts/周度平移.prompt.md` 触发；该 prompt 负责把最新 active 周闭合为历史周，并同步生成新周 JSON / Markdown 维护面。

## 公司级状态术语对齐

- **当前周维护面**：指当前最新 active 周的 `OPERATING_PLAN` 与配套未决事项清单。它是最新周唯一维护入口，不等于其中每条事项都处于 `active`。
- **单条事项状态**：当前默认沿用 `CompanyGovernanceRegistry` 的四类：
  1. `active`：当前正在推进，本周有明确 owner 动作。
  2. `frozen`：当前暂停推进，但未结项；保留 owner、恢复条件或升级路径。
  3. `stale-review`：因超过约定时间未续推而进入审查池，尚未完成 `active` / `frozen` / `closed` 定性。
  4. `closed`：事项已结项、取消或已从当前周维护面移出，只保留历史事实和 successor ref。
- 若需要描述 `frozen` 的更细原因，写在正文说明或 `statusDetail` 中，不额外扩成新的公司级主状态名。
- 若经营记录中引用模块边界，模块成熟度默认使用“现役模块 / 占位模块 / 待初始化模块 / 待迁移模块 / 待归档兼容仓”，不要与单条事项状态混写。
- 当前公司级术语 owner 为 `CompanyGovernanceRegistry`，经营记录侧只负责对齐使用，不另起一套平行状态名。

## 单条经营事项标准头

- 写入未决事项清单时，每条事项至少显式写出：
  1. **事项 ID**
  2. **事项名称**
  3. **事项简介**
  4. **事项状态**
  5. **当前进度**
- 推荐继续补齐：
  1. 来源
  2. 跨周情况 / 预警级别
  3. 当前动作
  4. 下一步
  5. 恢复条件或截止时间
  6. Owner
- 若使用 JSON，推荐字段映射为：`id`、`title`、`summary`、`status`、`statusDetail`、`currentProgress`、`nextAction`、`resumeCondition`、`owner`。
- 若使用 Markdown，默认按上述字段顺序书写，避免出现“只有标题和一段说明、却缺失事项 ID / 状态 / 当前进度”的不完整条目。

## 单条经营事项 ID 前缀标准

- 单条经营事项默认使用以下前缀：
  1. `ITEM-YYYYMMDD-序号`：当前周期新建的一般事项。
  2. `CARRY-YYYYMMDD-序号`：跨周 / 跨月平移进当前周维护面的续记项。
  3. `BLOCK-YYYYMMDD-序号`：明确阻塞主线推进、需要 owner 解阻的阻塞事项。
  4. `RISK-YYYYMMDD-序号`：需持续观察、可能升级的风险事项。
  5. `ESC-YYYYMMDD-序号`：已进入升级链、等待上级裁定的升级事项。
- **ID 前缀不等于事项状态。** 例如 `CARRY-*` 仍可处于 `active` / `frozen` / `stale-review` / `closed` 中任一状态。

## 复查触发规则

- 当 CEO 或秘书处要求“检查待办”“三天后复查”“复查当前经营事项”时，默认走待办复查入口，而不是直接把超过 3 天的事项全部改成 `frozen`。
- 默认斜杠命令：
  - `/待办复查`
  - `/review-backlog`
- 复查顺序默认是：
  1. 读取最新 active 周记录，确定当前周维护面。
  2. 对每条事项核对最新证据、owner 动作和恢复条件。
  3. 先判断是否进入 `stale-review`，再决定是否需要转成 `frozen`。
  4. 只有在确认“当前暂停推进 / 等待裁定 / 等待恢复条件”后，才把事项改成 `frozen`。
- 若复查结论改变了事项状态、当前进度、下一步或 owner，默认同步更新当前周维护面的 Markdown 与 JSON。

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

当前最新 active 周经营记录位于：

- `2026-W35/OP-202608-W35-001.json`
- `2026-W35/OP-202608-W35-001.unresolved-items.md`

当前用于演示 `PRD_OWNERSHIP_ROUTING` 生命周期落盘方式的目录位于：

- `2026-W17/POR-20260426-001/`

当前首条真实 `RESPONSIBILITY_HANDOFF` 记录位于：

- `2026-W21/RH-20260520-001/`

当前首份项目级 AI 共学周记位于：

- `2026-W18/project-ai-community-weekly-2026-W18.md`

项目级 AI 共学周记签发版归档目录位于：

- `项目级 AI 共学周记/`
