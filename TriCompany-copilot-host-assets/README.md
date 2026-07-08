# TriCompany Copilot Host Assets

本目录是当前 Copilot-host 的 TriCompany 宿主支撑包，用于承接本地正式接管阶段所需的 runtime 脚本、knowledge workbench、host-object manifest 与 frozen vendor reference。

它当前直接放在 TriMetaverse 根下，是为了让当前阶段 Copilot-host 的正式接管路径稳定落地；这不等于正式宿主已经切换到 TriMC。

TriCompany 模块真源仍在 `TriCompany/`。本目录不是模块真源，也不是平行研发面；凡是回答“TriCompany 自己怎么设计、怎么实现、怎么演进”的内容，应回到 `TriCompany/docs/`、`TriCompany/runtime/` 与 `TriCompany/.github/`。

## 当前定位

- 承载当前宿主运行时脚本与验证辅助代码（`runtime/`）
- 承载当前宿主 knowledge workbench（`knowledge/`），供 agent 运行态读写
- 承载当前宿主 `host-object-manifest.json`，登记 employee/role/org 绑定关系
- 保留当前宿主侧 frozen reference 副本（`vendor/reference/`）

## 文档真源纪律

- **本目录不承载文档真源。** 所有产品/工程/workflow/registry 文档真源统一在 `../TriCompany/docs/` 维护，agent 直接读取 TriCompany 源侧文件，不再通过本目录中转或副本同步。
- 本目录过去承载的 published-copy 文档层（`docs/product/`、`docs/engineering/`、`docs/registry/`、`docs/workflow/`）已于 2026-07-08 按 CPO/CTO 批准正式删除。
- `docs/execution/` 下的 phase-1 执行证据与 schedule 对象属于 audit-record / support-object-set，维持原有治理路径。
- knowledge 对象（`knowledge/`）是运行时 workbench，不是文档真源副本，继续由 `host-object-manifest.json` 登记管理。

## 当前状态

- 当前为 V0.2 宿主支撑包（published-copy 层已移除）
- 模块级设计、实现、制度与长期演进，统一在 `TriCompany/` 真源收口
- 当前 live 宿主入口仍在 `TriMetaverse/.github/`；本目录只提供支撑资产，不承担 live 入口职责
- 当前阶段的宿主资产属于本地正式接管承载，不等于正式宿主切换
- 当前直接放在 TriMetaverse 根下是当前本地正式接管布局，不是未来 TriMC 正式宿主的长期路径
- CPO / CTO 已在当前 Copilot-host live 阶段上岗；RAndDTrainer 与 CHO 当前仍是 source-side / support payload，不等于 live 入口已发布

## support root 含义与目标命名

- 当前物理目录名已迁移为 `TriCompany-copilot-host-assets`，作为当前 Copilot-host 的正式支撑包命名。
- 原目录名 `TriCompany-shadow-host` 仅保留为 phase-1 历史证据中的旧路径，不再作为当前生效目录名。
- 当前 support root 的真实作用不是"只服务总助"，而是给当前 Copilot-host 下的赛博公司宿主资产提供统一支撑根目录，承载 runtime、knowledge、vendor/reference 与执行证据。
- 当前宿主直接消费的 support-only machine-readable 对象：`knowledge/roles/**`、`knowledge/employees/**`、`knowledge/org/shared/**`、`knowledge/audit/**` 与 `docs/execution/hermes-copilot-host/phase-1/schedules/*.json`。
- 这些对象当前按 `support-object-set` 分层治理：它们不等于 live `.github` 入口资产；其中 RAndDTrainer、CEOChiefOfStaff、ChiefProductOfficer、ChiefTechnologyOfficer 与 ChiefHumanResourcesOfficer role / employee workspace 已由 `host-object-manifest.json` 登记，phase-1 schedules 仍按既有目录 / pattern 锚点治理。
- 因为这套支撑目录已经服务总助、registry、会议入口、后续 CPO / CTO / COO 等赛博公司员工资产，而不是只服务 `ceo-chief-of-staff`，所以目标正式名不采用岗位导向命名。
- 当前正式名为 `TriCompany-copilot-host-assets`。
- 采用这个命名的原因是：
  - `TriCompany` 表示资产归属仍是赛博公司研发仓。
  - `copilot-host` 表示这是当前宿主的专用资产包，而不是未来所有宿主的统一目录。
  - `assets` 表示该目录承载的是可复用的宿主资产集合，而不是单一岗位文件夹。
- 后续如果进入 `TriMC` 新宿主适配，应新建平行的宿主资产包，例如 `TriCompany-trimc-host-assets`，复用 workflow 与制度层结论，但按新宿主要求维护独立 agent / prompt / support root 布局。

## 默认查阅顺序

- 文档事实：直接查 `../TriCompany/docs/`（产品/工程/workflow/registry 真源）。
- 模块归属与边界：查 `TriMetaverse/docs/三元宇宙架构与模块说明.md` 和 `docs/github-repo-governance.md`。
- 当前宿主运行时状态：查本目录 `knowledge/`、`runtime/`、`host-object-manifest.json`。
- 当前 support bundle 不是文档事实的默认入口；只有在确实需要当前宿主专用 operator-runbook、phase 证据、baseline、archive-index 或 `support-object-set` 时，才应回看本目录下的具体路径。

## 写入纪律

- 模块级 docs / runtime / 制度语义统一在 `TriCompany/` 源侧修改，不再通过本目录副本同步。
- 当前宿主专用的 runbook、phase 证据、baseline、archive-index 与 `support-object-set`，可以继续在本目录维护。
- 当前 live 入口相关吸收、替换与回滚，继续回 `TriMetaverse/.github/` 处理，而不是在本目录发展入口实现。

## 运行态与跟踪边界

- `.env`、`.env.*`、`.tricompany-cognition/`、Python cache / coverage 产物，以及治理锚点之外的自定义 JSON / 日志 / 调试输出，属于 host-local `runtime-state`，应保持本地化并忽略；`.env.example` 这类模板除外。
- `.tricompany-cognition/employee/<actor>.md` 只会在对应 actor 实际写入 cognition 后出现；RAndDTrainer 当前没有运行态文件是预期状态，不表示 support payload 缺失。
- `.tricompany-cognition/org/shared.md` 与 `.tricompany-cognition/org/audit.md` 是全公司共享运行态命名空间，不按员工拆分。
- `knowledge/employees/ceo-chief-of-staff/audit/**` 与 `knowledge/employees/ceo-chief-of-staff/workbench/{index.html,snapshot.json}` 虽由 runtime 生成，但当前属于受治理的 `support-object-set`，继续跟踪，不按 runtime-state 忽略。
- `docs/execution/hermes-copilot-host/phase-1/SUPERMEMORY-LIVE-VALIDATION.latest.json` 这类固定 execution JSON 证据属于 `audit-record`，继续跟踪；只有当自定义 report 输出到治理锚点之外时，才先按 runtime-state 处理。

## 目录约定

- `runtime/cognition/`: 当前宿主运行副本与验证辅助代码，不是模块源码真源
- `knowledge/`: employee/role/org workbench，由 `host-object-manifest.json` 登记，agent 运行态直接消费
- `vendor/reference/`: 宿主侧冻结 reference 副本
- `docs/execution/`: operator-runbook、phase 证据、baseline 与 archive-index
- `docs/execution/hermes-copilot-host/phase-1/schedules/`: 当前宿主 resident / cron staging 直接消费的 schedule 对象集

其中：

- `knowledge/roles/rd-trainer/**`、`knowledge/employees/rd-trainer/**`、`knowledge/roles/ceo-chief-of-staff/**`、`knowledge/employees/ceo-chief-of-staff/**`、`knowledge/roles/chief-product-officer/**`、`knowledge/employees/chief-product-officer/**`、`knowledge/roles/chief-technology-officer/**`、`knowledge/employees/chief-technology-officer/**`、`knowledge/roles/chief-human-resources-officer/**`、`knowledge/employees/chief-human-resources-officer/**`、`knowledge/org/shared/**` 与 `knowledge/audit/**` 由 `host-object-manifest.json` 登记为当前 employee host object payload；这不等于 RAndDTrainer 或 CHO 已进入 live `.github` 宿主入口，也不等于总助 live 入口已经替换。
- `docs/execution/hermes-copilot-host/phase-1/schedules/*.json` 不在 host-object-manifest 登记范围内，当前按 `docs/workflow/tricompany-copilot-host-assets-migration-matrix.md` 中的 `support-object-set` 分层治理。
- 总助当前只保留 `knowledge/roles/ceo-chief-of-staff/**` 与 `knowledge/employees/ceo-chief-of-staff/**` 作为 support payload；已退役的 legacy `knowledge/chief-of-staff/**` 不再恢复。

## 与 TriMetaverse 的关系

- TriMetaverse 继续承担中央战略、模块边界和正式宿主地位判断
- TriCompany 当前负责赛博公司研发、Hermes 融合和 Copilot 本地正式接管宿主资产
- 形成稳定结论后，再同步回 TriMetaverse 的 Product Registry、Code Registry 和相关制度文档

## 中央吸收原则

- 当前已完成的是"本地 Copilot-host 已完成 shadow-test，现进入正式接管"，不等于正式宿主切换。
- 下一步若要吸收回中央命名，原则上只替换 `ceo-chief-of-staff` 总助套件，不替换公司级通用的 `开始会议`、`结束会议` prompt。
- 通用会议 prompt 继续保持中央共享入口，供公司范围内多个角色使用；总助替换只发生在总助套件本身。

## 当前下一步

1. 在 TriCompany 内继续把 Hermes 融进总助分层与编排
2. 把当前阶段 Copilot 宿主资产统一收拢并稳定在 TriCompany/.github
3. 让 CPO 与 CTO 上岗，共同优化 TriCompany 与整个 TriMetaverse 项目
