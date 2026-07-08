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
- 7 项操作的触发条件、当前执行方式与未来 TriMC 自动化接手点（含 B→A→C→D 回写顺序全称标注：B=公司执行真源 → A=书面主真源 → C=联审输入面 → D=操作与实例面）
- 2 个已完成真实编排案例：backfill-001 through-pass merge（标准双线闭环）、intake 回退路径补全（⚠️ 应急修复，未走完整双线验证）
- 自动化接手决策框架（4 维度判断表）
- 引擎 / 总助 / TriMC 的职责边界图

所有协调当前均为人工执行，IPD 引擎不提供程序化跨 case 编排。未来 TriMC 编排能力上线时，以此节为需求输入判断哪些交 TriMC、哪些自建编排模块。

### 5.2 V0.5 新增（2026-07-08）

- **编排目标第 7 条**：将各模块 CodeGraph 成果与模块 CodeRegistry 结合使用，汇总收拢到中央 registry，降低总助 token 消耗
- **§3 补充**：标注 TriMetaverse 中央 registry（BusinessStrategy、Product、Code、Governance）为项目级独立真源，冲突时以中央 BusinessStrategy 边界裁决为准
- **§4.2 分诊扩 CCO**：Chief Customer Officer，管理 CSM/客服/体验线，当前未上岗
- **§5 澄清**：runtime 执行入口位于 TriMetaverse/TriCompany-copilot-host-assets/runtime/，TriCompany 源侧维护源码真源
- **§6 明确**：下一阶段 = 从 Copilot-host live 进入 TriMC 正式宿主运行阶段
