---
name: republish-batch-rhythm
description: 发布拷贝面重渲攒批节奏——每日收口一批+FADE-008 攒批窗并批，急件单独追（BOD 裁 2026-09-20）
metadata: 
  node_type: memory
  type: feedback
  originSessionId: bab3f873-4a67-4ab1-be8c-5b4f884623f5
  modified: 2026-09-20T13:17:58.051Z
---

发布管线重渲（source_publish_check --publish-agents 三 host）节奏=**「源侧窗后攒批重渲」**：每日收口一批+FADE-008 攒批窗（周二/周五）并批；急件（功能性/安全面改动）单独追。

**Why:** 发布面=时效差豁免态（governance §12.1 滞后合法）；2026-09-20 一日两次重渲（board 席名址录+CPO 协作扩展各一次）证 commit 噪音真实成本，BOD 裁采攒批案（勘正§12.4/12.2 附注候窗随批）。

**How to apply:**
- 源侧落件后**不即时重渲**——挂「发布拷贝面滞后 N 件」轻账（合法态）；
- 每日收口/FADE-008 攒批窗跑一次三 host 重渲（管线命令同前例），读数=fm parity/seats 一致性+更新件数；
- 功能性/安全面急件破例单独追（自判标准：影响 spawn 面 agent 行为或安全 posture）；
- github push 断连时：切 `http.version HTTP/1.1`（仓级）+退避重试+fetch merge 并行线后推——「Everything up-to-date」尾行可能是 RPC 失败误导（ls-remote 核远端真值）。
