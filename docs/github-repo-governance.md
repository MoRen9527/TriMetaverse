# GitHub Repo Governance

- sourceOfTruth: 本件
- syncMode: static
- lastSyncedAt: 2026-09-14T00:47+0800
- 立: CEO 2026-09-14 00:42 架构定谳；00:46 措辞勘正

## Git Hub 星型拓扑（常设节）

**拓扑**：GitHub ↔ M-SG（唯一中枢，M 面服务域机）↔ {本地机（TriMLC+TriRLC 双本地核心同机承载）、R-HY（R 面服务器）、未来任何新机}——星型。

- **M-SG**（M-SG-47.245.122.61）= git 中枢：唯 M-SG 与 GitHub 双向沟通。
- 本地域成员=本机一台（TriMLC+TriRLC 双本地核心同机承载）；服务域成员=sg（M）+R-HY（R）。所有 git 远端一律指向 M-SG bare（`ssh://fleet@M-SG/srv/git/*.git`），不经直连 GitHub。
- 面纪律不破：M-SG 中枢只做 git 转运，不改变面职责（M 面活仍 M 面、R 面活仍 R 面）。
- GitHub 侧同步职责由 M-SG watcher 家族承接。
- 首例：R-HY origin=sg-bare（`ssh://fleet@R-HY/srv/git/*.git` 或等价路径）——此为全局标准非个例。
- **纪律条**：域标签跟机走——本地域成员=本机一台（双核心）；服务域成员=sg（M）+R-HY（R）；禁造「本地 R」「服务 M」类杂交词。
