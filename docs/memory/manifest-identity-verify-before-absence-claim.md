---
name: manifest-identity-verify-before-absence-claim
description: 「实盘未落」级断言前必须先验证勘验文件身份——manifest 一名多文件（支撑面/生成计划面/发布登记册），勘错文件即伪阴性
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fde30832-3b99-4dba-b265-d9668f7e0233
  modified: 2026-09-02T15:39:55.845Z
---

LG-024 批 0（2026-09-02）：我断言「manifest sessionBody 键实盘未落、liveEntries count=0」——实为勘验文件身份错认。真身=`TriCompany/source-agents/registries/trimetaverse-live-agent-publish-manifest.json`（liveEntries=70、sessionBody 在位）；我勘的 `TriCompany-copilot-host-assets/host-object-manifest.json` 是支撑面（liveEntries 本就 0）。CTO 复勘撤回我的发现并指出自己也踩同一坑两轮。

**Why:** manifest 一名多文件三 identity（支撑面/生成计划面/发布登记册），文件名相似、内容结构不同；grep「无命中」证明不了「实盘未落」——只证明「这个文件里没有」。伪阴性断言会触发错误的勘误/整改链（本次被 COS 反证撤回，消耗三轮往返）。

**How to apply:**
1. 断言「X 未落盘/不存在」前，先用 `git ls-files | Select-String <关键词>` 全仓列出**同名/同类文件清单**，逐一验身份（对表 json 解析取数，不靠 grep 格式判断）。
2. 消费端代码读哪个路径（`MANIFEST_REL_PATH`/常量定义），就勘哪个文件——先读代码锚定真身，再勘实盘。
3. 矛盾证据在先（如 commit 消息称已落而勘验不见）=勘验方法可疑优先于实盘可疑，先自查文件身份再定性。
4. 佐证先例：TriLC fade-registry「首勘误误判无实盘」同族（跨仓相对路径审计须显式声明审计根）。相关 [[fact-citation-source-required]] [[source-verification-discipline]] [[tool-authz-double-layer-testing]]
