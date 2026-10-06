---
name: doc-metadata-header
description: 项目约定——所有文档必须有文档同步元信息头（sourceOfTruth/syncMode/lastSyncedAt 三字段），格式见 docs/文档治理与真源文件系统.md §3.4
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-09-20T15:18:58.844Z
---

用户在 2026-08-11 要求：**所有文档要有文档元信息头**（TriMetaverse 项目）。

**Why:** 项目有文档真源/同步/归档治理体系，元信息头是文档在"真源 → support/live → archive"链路中的登记凭证，缺头文档无法进入治理链路。

**How to apply:** 创建或修改 `docs/` 下任何 .md 时：
1. 标题后紧跟 `## 文档同步元信息` 块，三字段：
   - `sourceOfTruth: TriMetaverse/docs/<相对路径>`（注意项目文档用 `TriMetaverse/` 前缀）
   - `syncMode: source-only`（真源文档）或 `audit-record`（周记/运行记录类）
   - `lastSyncedAt: <当天日期 YYYY-MM-DD>`
2. 文档头信息（版本/日期/状态/适用范围/owner 等）用普通 blockquote，放在元信息块之后，**不与元信息混用**。
3. 规范原文：`docs/文档治理与真源文件系统.md` §3.4。

2026-09-20 追加（批程元信息纪律，LG-038/D-27 活案例·CHO 笔）：**参数获批≠拟制件生效**——CHO 绩效工作流正身元信息写「三批全准即日生效」，实为参数获准（09-18）而正身批程当晚未走，CEO 09-20 23:15 补批才生效（TC 68b22c1 勘正）。**How to apply：**拟制件呈批时元信息批程状态写「候批」；批后据实更新为「X 月 X 日 CEO 批」；禁止把「参数获批」「令文收到」写成「生效」——生效只认批文本身。
