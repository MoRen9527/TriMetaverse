# Wiki

这里用于承接由 inbox 原始资料整理出来的 wiki 页面。

当前目标已经从单页最小闭环推进到页索引 + recall + 知识工作台联动：这里仍承接真实 wiki 页面，而前台工作台入口会从 `../workbench/` 聚合展示这些页面与其审批/审计状态。

`page-specs.json` 是当前批处理 refresh、reviewer route 和审批 SLA 的页规格真源；多主题 batch refresh 会按它来选择来源、生成页面并分配审批路由。
