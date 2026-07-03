# 分支与发布规范（8行口令版）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/branching-release-policy-8lines.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-06

当前文件是 TriMetaverse 分支与发布规范的本地摘要口令真源，用于快速引用当前 Git 治理规则；它不是 TriCompany 公司级 workflow 或产品真源。

详细正文见 `branching-release-policy.md`。

1. 日常开发默认走 `dev`：`git checkout dev; git pull --ff-only origin dev`
2. 成熟仓稳定基线走 `main`；占位 / 过渡仓继续 `dev-only`
3. 发布不从 `dev` 直接出包，必须先走 `release/*`
4. A 类成熟仓发布闭环：`dev -> release/* -> main -> dev`
5. B / C 类无 `main` 仓发布闭环：`dev -> release/* -> dev`
6. 紧急修复走 `hotfix/*`：从当前稳定 / 生产基线切出
7. `hotfix/*` 修完必须回灌：A 类回 `main + dev`；无 `main` 仓回 `稳定基线 + dev`
8. Tride 继续从已验证 commit 切 `release/*`；vscodium 优先从 upstream tag 切 `release/*`；本文件只作摘要口令，不替代正文
