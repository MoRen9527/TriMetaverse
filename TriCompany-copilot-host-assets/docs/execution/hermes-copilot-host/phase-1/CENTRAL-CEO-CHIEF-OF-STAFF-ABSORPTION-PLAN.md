# Central CEO Chief Of Staff Absorption Plan

## 文档同步元信息

- sourceOfTruth: 当前文件（support-only operational asset）
- publishedFrom: 当前文件（support-only runbook）
- syncMode: audit-record
- executionTier: operator-runbook
- updateRule: 当前 host 的命名吸收策略、回滚条件或宿主边界变化时更新
- sourceBackfillRule: 若规则沉淀为长期中央 workflow 或模块边界，再回写对应真源；否则不要求同名回源
- lastSyncedAt: 2026-04-28

日期：2026-04-18
状态：中央总助吸收已执行；live 补充验证已恢复通过

## 目的

- 定义本地 Copilot-host 下总助完成 shadow-test 并进入正式接管之后，如何吸收回中央 `ceo-chief-of-staff` 命名。
- 明确吸收范围、support root 目标命名、回滚方案，以及与未来 `TriMC` 新宿主资产的关系。

## 当前结论

- 当前已完成的是：本地 Copilot-host 已完成 shadow-test 并进入正式接管、中央 `ceo-chief-of-staff` 五件套命名吸收，以及中央 baseline 快照落档。
- 当前未完成的是：正式宿主切换、`TriMC` 新宿主适配文档，以及真实 Supermemory live 补充验证的持续稳定性。
- 因此，当前阶段应写成“中央总助吸收已完成，进入吸收后验证 / 观察阶段”，而不是写成正式宿主切换完成。

## 吸收范围

### 本轮吸收

- 只吸收 `ceo-chief-of-staff` 总助套件。
- 2026-04-18 当轮吸收具体包括：
  - `.github/agents/ceo-chief-of-staff.agent.md`
  - `.github/agents/ceo-chief-of-staff.soul.md`
  - `.github/agents/ceo-chief-of-staff.memory.md`
  - `.github/agents/ceo-chief-of-staff.colleagues.md`
  - `.github/agents/ceo-chief-of-staff.social.md`
- 2026-05-21 起当前 live `.github/agents` 只保留 `.agent.md` 可调用入口；`soul/memory/colleagues/social` 四层契约回到 `TriCompany/.github/source-agents/ceo-chief-of-staff/` 源侧五件套与 support employee workspace。

### 本轮不吸收

- `.github/prompts/开始会议.prompt.md`
- `.github/prompts/结束会议.prompt.md`

原因：会议 prompt 属于公司范围共享入口，不应因为总助 shadow 接管完成就被 TriCompany 专用版本直接覆盖。

## support root 决策

### 当前路径

- 当前 support root 物理路径名是 `TriCompany-copilot-host-assets`。
- 原路径名 `TriCompany-shadow-host` 仅保留为 phase-1 历史证据中的旧路径名。

### 目标正式名

- 目标正式名：`TriCompany-copilot-host-assets`

### 采用原因

- 该目录当前已承载总助、registry、workflow、runtime、vendor/reference 与执行层资产，不是只服务总助岗位。
- 该目录是当前 `Copilot-host` 的赛博公司宿主资产包，应按“模块 + 宿主 + 资产包”命名，而不是按岗位命名。
- 该命名能与未来 `TriMC` 新宿主适配形成平行结构，例如：`TriCompany-trimc-host-assets`。

### 最终部署位置

- 当前建议继续作为 `TriMetaverse` 根目录下的平行支撑包存在。
- 不建议迁入 `.github/`，因为它承载的不只是 prompt / agent 文件，还包括 docs、runtime、vendor/reference 与执行证据。
- 该目录仍保持单独 git、单独提交的支撑包属性。
- support root 物理目录重命名与引用改写清单，见 `SUPPORT-ROOT-RENAME-PLAN.md`。

## 回滚方案

### 执行前准备

- 已为当前中央 `ceo-chief-of-staff` 套件保留 baseline 快照：`TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/baselines/central-ceo-chief-of-staff-2026-04-18/`。
- 已为 `tricompany-ceo-chief-of-staff.*` 源套件补建 archive baseline：`TriCompany-copilot-host-assets/docs/execution/hermes-copilot-host/phase-1/baselines/tricompany-ceo-chief-of-staff-archive-2026-04-26/`。
- 2026-04-26 已删除 live `tricompany-ceo-chief-of-staff.*` 文件；当前迁移源与回退参考统一由 archive baseline 承接，不再保留 live 主入口副本。
- 2026-05-21 已删除中央 `ceo-chief-of-staff.soul/memory/colleagues/social.md` live 兼容副本；如需回滚，只能从 baseline 或 TriCompany source 重建临时验证副本，不把它们重新设为常态 live 资产。

### 吸收步骤

1. 已完成 support root 目录从 `TriCompany-shadow-host` 到 `TriCompany-copilot-host-assets` 的迁移与生效引用更新。
2. 已保持中央 `开始会议`、`结束会议` prompt 不变。
3. 已用当前 TriCompany 总助套件内容吸收回中央 `ceo-chief-of-staff.*` 命名；当前 live 常态入口收敛为 `ceo-chief-of-staff.agent.md`。
4. 已完成中央总助文件诊断、共享会议 prompt 连线静态校验，以及 runtime 非 live 套件复跑验证。
5. 已确认 2026-04-18 的 Supermemory live 复跑在真实 `/v3/documents` 调用阶段曾出现长尾超时；在提高 timeout 并补上 transport-timeout retry 后，live 复跑已恢复通过。

### 回滚触发条件

- 中央 `ceo-chief-of-staff` 出现 support root 路径漂移。
- 中央总助把当前本地接管口径误写成正式宿主切换。
- 中央会议入口与中央总助之间出现行为不一致或职责冲突。

### 回滚动作

1. 恢复中央 `ceo-chief-of-staff.*` baseline 快照。
2. 恢复吸收前的 support root 路径引用。
3. 必要时可优先恢复 `tricompany-ceo-chief-of-staff.*` archive baseline，并从该 baseline 重建临时影子验证副本。
4. 将失败原因回填到 phase-1 执行层与 manifest，不把本次吸收写成完成态。

## 与 TriCompany / TriDev / TriMC 的关系

- `TriCompany`：赛博公司研发仓，也是当前 `Copilot-host` 赛博公司宿主资产的产出与维护仓。
- `TriDev`：沉淀研发流程、自动化开发与工作流规则，不承担赛博公司员工宿主资产包本身。
- `TriMC`：未来 `Task Main Controller` 与 `Autonomy Main Controller` 的正式宿主承载侧。
- 当前本地 Copilot-host 接管完成，不等于未来 `TriMC` 新宿主适配已经完成。
- 当 `TriMC` 新宿主需求明确后，应新建一套按新宿主要求组织的赛博公司 agent 文档，复用 workflow、制度和角色结论，但不继续沿用 `Copilot-host` 的 support root 物理命名。

## 建议标准口径

- 当前推荐统一写法：本地 Copilot-host 已完成 shadow-test，现进入正式接管；中央 `ceo-chief-of-staff` 命名吸收已完成；以上结论不等于正式宿主切换。
- 下一步推荐写法：进入中央 `ceo-chief-of-staff` 吸收后的持续观察阶段；开始会议、结束会议 prompt 继续保持公司级共享入口；Supermemory live 已恢复通过，但仍建议持续观察远端写入长尾。
- 未来 `TriMC` 阶段推荐写法：按新宿主要求另建赛博公司宿主资产文档，复用工作流，不直接复用当前 Copilot-host support root 物理布局。
