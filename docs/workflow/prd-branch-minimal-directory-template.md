# PRD 分支最小目录样板

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/workflow/prd-branch-minimal-directory-template.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-04

目的：给目标模块或项目根提供一份可直接照着建的 `模块六层文档协同系统` 最小样板，使 `INTELLIGENCE` 审核通过后的 PRD 分支能在正确落位点上进入标准落地面。

---

## 1. 适用时机

- 使用本样板前，必须先拿到 PRD 归属路由结论，确认当前应该在哪个模块根或项目根建立五层结构。
- 新模块第一次接入中央 workflow
- 现有模块第一次从 `INTELLIGENCE` 进入 PRD 分支执行
- 某模块此前只有零散文档，准备收敛到 `模块六层文档协同系统`

### 1.1 强制前置判断

- 当前阶段，若 PRD 需要判断模块设计、归属模块 / 项目与目标落位点，应先询问 `ChiefProductOfficer`；`CEOChiefOfStaff` 只负责公司级任务分派、催办、升级与收口；涉及新的长期主模块或边界变化时，再升级 `BusinessStrategy`。
- 若 PRD 描述的是既有模块能力，则应在该模块根下套用本样板，而不是默认落到当前工作区根仓的 `docs/` 下。
- 若 PRD 描述的是当前项目根自身能力，则可在当前项目根下套用本样板。
- 若 PRD 描述的是尚未存在的新模块，则应先建立与现有模块同级的新模块根，再在新模块根下套用本样板。
- 若当前阶段尚未形成 `ChiefProductOfficer` 的模块设计 / 归属结论，则不得直接创建下面的目录树。
- 例：若某 PRD 实际描述 `TriMC` 运行面能力，不应由执行者直接认定落位，而应先请 `ChiefProductOfficer` 给出模块设计与归属结论；`CEOChiefOfStaff` 只负责公司级任务协调与升级。

---

## 2. 最小目录树

以下目录树是在“目标落位点已经确定”之后，于对应模块根或项目根下创建：

```text
docs/
  product/
    PROJECT.md
    REQUIREMENTS.md
    ROADMAP.md
    STATE.md
  engineering/
    DESIGN.md
    ROADMAP.md
    STATE.md
  execution/
    README.md
    prd001-base-platform/
      designing/
        PLAN.md
        SUMMARY.md
        VERIFICATION.md
      coding/
        PLAN.md
        SUMMARY.md
        VERIFICATION.md
      verify-integration/
        PLAN.md
        SUMMARY.md
        VERIFICATION.md
      redteam/
        PLAN.md
        SUMMARY.md
        VERIFICATION.md
      qa/
        PLAN.md
        SUMMARY.md
        VERIFICATION.md
      deployment/
        PLAN.md
        SUMMARY.md
        VERIFICATION.md
      assurance/
        PLAN.md
        SUMMARY.md
        VERIFICATION.md
  registry/
    README.md
    business-state.md
    product-state.md
    code-state.md
  workflow/
    README.md
```

说明：

- `prd001-base-platform/` 只是示例名，实际应替换为稳定的 PRD / workstream 标识，例如 `prd002-user-identity`、`prd003-payment`。
- 这个示例目录树描述的是“目标落位点内部长什么样”，不表示样板必须建在当前正在编辑的仓库根 `docs/` 下。
- `docs/product/`、`docs/engineering/`、`docs/registry/`、`docs/workflow/` 是模块级稳定入口，不建议为每个 PRD 再复制一套平行目录。
- PRD 分支的阶段执行证据，优先进入 `docs/execution/<prd-or-workstream>/<phase>/`。

---

## 3. 每层最小职责

### `docs/product/`

- `PROJECT.md`：模块定位、边界、目标用户
- `REQUIREMENTS.md`：需求、验收口径、待确认项
- `ROADMAP.md`：产品优先级与版本顺序
- `STATE.md`：产品当前状态、阻塞与变更

### `docs/engineering/`

- `DESIGN.md`：PRD 对应 Spec、架构、接口、关键 trade-off
- `ROADMAP.md`：技术交付顺序、依赖和治理计划
- `STATE.md`：技术状态、风险、发布准备度

### `docs/execution/`

- `README.md`：解释 workstream / phase 的命名与分层方式
- `<prd-or-workstream>/<phase>/PLAN.md`：准备做什么
- `<prd-or-workstream>/<phase>/SUMMARY.md`：实际做了什么
- `<prd-or-workstream>/<phase>/VERIFICATION.md`：是否验证通过

### `docs/registry/`

- `business-state.md`：业务定位、边界、阶段口径
- `product-state.md`：产品侧稳定事实与当前进展
- `code-state.md`：代码结构、技术状态与质量缺口
- `README.md`：索引与使用说明

### `docs/workflow/`

- `README.md`：本模块内部流程、迁移、编排、handoff、治理机制入口

---

## 4. 推荐初始化顺序

1. 先拿到当前阶段 `ChiefProductOfficer` 的模块设计 / 归属结论与目标落位点；`CEOChiefOfStaff` 只负责公司级任务协调与升级。
2. 在目标落位点创建五层目录与最小占位文件。
3. 把已审核 PRD 的范围和验收口径回填到 `docs/product/REQUIREMENTS.md` 与 `STATE.md`。
4. 在 `docs/engineering/DESIGN.md` 建立对应分支的 Spec 入口。
5. 创建 `docs/execution/<prd-or-workstream>/designing/`，先写 `PLAN.md`。
6. 随 `DESIGNING -> ASSURANCE` 推进，逐阶段补齐对应 `SUMMARY.md` 与 `VERIFICATION.md`。
7. 当分支形成稳定结论后，同步回写 `docs/registry/*.md` 和 `docs/workflow/README.md` 的相关入口。

---

## 5. 占位写法建议

对低成熟模块，可以先写最小占位，不要求一步到位：

```md
# DESIGN.md

当前模块已创建 `模块六层文档协同系统` 最小入口。
本文件用于承接 PRD001 的设计规格、接口与技术约束；当前待 `DESIGNING` 阶段补齐。
```

```md
# PLAN.md

阶段：designing
对应 PRD：PRD001-v1.0.0
目标：补齐该分支的 Spec、接口和关键设计决策。
当前状态：待执行。
```

---

## 6. 对齐规则

- `INTELLIGENCE` 之后的 PRD 分支，不应跳过这套最小目录初始化。
- `INTELLIGENCE` 之后的 PRD 分支，也不应跳过“先询问当前阶段 `ChiefProductOfficer` 做模块设计 / 归属，再决定落位点；`CEOChiefOfStaff` 只做公司级协调”的前置门禁。
- `docs/execution` 的标准阶段目录优先直接对齐主线：`designing`、`coding`、`verify-integration`、`redteam`、`qa`、`deployment`、`assurance`。
- 如需 `discuss`、`plan`、`execute`、`verify`、`ship` 之类更细粒度节奏，应放到上述标准阶段目录下作为二级结构，而不是替代主线阶段名。
- 执行层文档必须显式引用上层真源，至少要能回连 `docs/product/` 与 `docs/engineering/` 的对应文档。
