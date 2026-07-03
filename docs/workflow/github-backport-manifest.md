# GitHub Backport Manifest 发布侧摘要

## 文档同步元信息

- sourceOfTruth: TriCompany/docs/workflow/github-backport-manifest.md
- publishedFrom: TriCompany/docs/workflow/github-backport-manifest.md
- syncMode: published-summary
- publishTier: release-side-summary
- lastSyncedAt: 2026-06-15

## 1. 文档定位

本文件是 TriMetaverse 对 TriCompany GitHub backport manifest 的发布侧摘要。

它保留 shadow-test 回迁、本地正式接管和 .github 宿主资产回迁边界的中央引用视角，不重复定义源侧清单细则。

## 2. 中央摘要

- 当前回迁模式以 shadow-test 平行回迁起步，目标是在 TriMetaverse/.github 中稳定承载当前 Copilot-host 正式接管资产。
- 当前资产与未来 TriMC 正式宿主切换保持分离。
- 回迁重点是 agent、prompt、manifest 与维护边界的安全接管。

## 3. 适用边界

- 只保留发布侧镜像和引用入口。
- 不把 support 包、回迁清单或 smoke test 结果写成中央主真源。
- 涉及回迁范围与冲突判断时，优先回到 TriCompany 源侧 manifest。

当前文件只承担 TriMetaverse 发布侧摘要职责，不替代 TriCompany 真源。
