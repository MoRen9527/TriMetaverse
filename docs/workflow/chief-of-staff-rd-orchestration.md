# TriCompany Chief of Staff R&D Orchestration

## 文档同步元信息

- sourceOfTruth: TriCompany/docs/workflow/chief-of-staff-rd-orchestration.md
- publishedFrom: TriCompany/docs/workflow/chief-of-staff-rd-orchestration.md
- syncMode: published-summary
- publishTier: release-side-summary
- lastSyncedAt: 2026-07-08

## 1. 文档定位

本文件是 TriMetaverse 对 TriCompany 总助研发编排的发布侧摘要。

它保留总助如何协同产品、技术、执行、培训和宿主资产发布的中央视角，不重新定义 TriCompany 内部的专业 owner 边界。

## 2. 关键分诊

- 产品事实优先路由给 CPO。
- 技术事实、宿主资产和 CodeGraph 相关优先路由给 CTO。
- 培训内容优先路由给 RAndDTrainer。
- 行政与秘书处归 CAO / CompanyGovernanceRegistry。
- 岗位交接与 completion tracking 归 CHO。

## 3. 中央视角摘要

- TriCompany 负责源仓侧编排和真源维护。
- TriMetaverse 只承接发布侧摘要、中央边界和引用导航。
- 只有形成稳定跨仓结论，才考虑回写到 TriMetaverse 中央文档层。

## 4. 对齐依据

- TriMetaverse/docs/workflow/tricompany-agent-roles.md
- TriMetaverse/docs/workflow/tricompany-copilot-host-assets-governance.md
- TriMetaverse/docs/workflow/central-registry-closeout-workflow.md

当前文件只承担 TriMetaverse 发布侧摘要职责，不替代 TriCompany 真源。

## 5. 首次发布后新增

### 5.1 IPD 双线人工编排操作（V0.4，2026-07-08）

TriCompany 源侧已新增 §4.7「IPD 双线人工编排操作」，记录 CEOChiefOfStaff 当前在 process-improvement 与 project-delivery 之间的全部手动协调操作，包含：
- 7 项操作的触发条件、当前执行方式与未来 TriMC 自动化接手点
- 2 个已完成真实编排案例（through-pass 审批基线合并、intake 回退路径补全）
- 自动化接手决策框架（4 维度判断表）
- 引擎 / 总助 / TriMC 的职责边界图

所有协调当前均为人工执行，IPD 引擎不提供程序化跨 case 编排。未来 TriMC 编排能力上线时，以此节为需求输入判断哪些交 TriMC、哪些自建编排模块。

详见源文件：`TriCompany/docs/workflow/chief-of-staff-rd-orchestration.md` §4.7。
