# TriCompany Host Object Publish Flow

## 文档同步元信息

- sourceOfTruth: TriCompany/docs/workflow/host-object-publish-flow.md
- publishedFrom: TriCompany/docs/workflow/host-object-publish-flow.md
- syncMode: published-summary
- publishTier: release-side-summary
- lastSyncedAt: 2026-06-15

## 1. 文档定位

本文件是 TriMetaverse 对 TriCompany 源侧员工对象发布流程的发布侧摘要。

它只保留从 source kit 到 support object、binding profile、live discovery 和 governance 回填的关键顺序，不重复定义源侧五件套细则。

## 2. 关键职责

- 新员工入职与现有员工职责变动走同一条发布链。
- 人力交接治理、handoff checklist 与 completion tracking 由 CHO 侧主责。
- 秘书处和行政流程归 CAO / CompanyGovernanceRegistry 侧治理。

## 3. 发布顺序

1. 先在 TriCompany 源侧更新岗位 / 员工定义。
2. 再生成或刷新 support object payload。
3. 再更新 binding profile 与 host object manifest。
4. 再判断是否需要更新 live discovery 入口。
5. 最后回填治理与验收记录。

## 4. 使用边界

- 不把临时协作写成长期 owner 迁移。
- 不把 source-side scaffold 和 live discovery 混写。
- 不把当前宿主的具体物理路径写成源侧默认真源。

当前文件只承担 TriMetaverse 发布侧摘要职责，不替代 TriCompany 真源。
