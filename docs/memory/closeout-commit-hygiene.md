---
name: closeout-commit-hygiene
description: "收口/落文档后必须自己 git commit，或明说\"落盘未提交\"由编排层补"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-08-13T08:01:34.661Z
---

2026-08-14 team-lead 反馈：小贾落 7/7 文档 + 首树后未 commit，编排层代提交推送（99af5237）。

**Why:** 编排层统一 push 是运营已知项（团队 agent 本地 push 不稳定，收口门禁 v2 规定编排层复核 git ls-remote 补齐），但 commit 是节点收口的一部分——漏 commit 造成落盘与 git 不同步，舰队克隆看不到新文档，补提交延迟了服务器侧生效。

**How to apply:** 每次文档/树落盘后检查 git status，未提交则自己 commit（规范：中文主题 + Co-Authored-By: Claude Fable 5）；若因环境限制无法 commit，回报时明确写"落盘未提交"交由编排层补。关联 [[tree-file-path-convention]]（树文件规范路径）。
