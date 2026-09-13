# GitHub Repo Governance

- sourceOfTruth: 本件
- syncMode: static
- lastSyncedAt: 2026-09-14T00:45+0800
- 立: CEO 2026-09-14 00:42 架构定谳

## Git Hub 星型拓扑（常设节）

**拓扑**：GitHub↔M-SG↔{本地M,本地R,任意新机}——星型。

- **M-SG**（M-SG-47.245.122.61）= git 中枢：唯 M-SG 与 GitHub 双向沟通。
- 两本地域（M 本地=TriMLC 机、R 本地=R-HY 及未来本地执行体）git 远端一律指向 M-SG bare（`ssh://fleet@M-SG/srv/git/*.git`），不经直连 GitHub。
- 面纪律不破：M-SG 中枢只做 git 转运，不改变面职责（M 面活仍 M 面、R 面活仍 R 面）。
- GitHub 侧同步职责由 M-SG watcher 家族承接。
- 首例：R-HY origin=sg-bare（`ssh://fleet@R-HY/srv/git/*.git` 或等价路径）——此为全局标准非个例。
