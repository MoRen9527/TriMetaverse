---
name: manifest-identity-verification
description: 「实盘未落」级断言前必须先验证勘验文件身份——host-objects 有支撑面/生成计划面/发布登记册三 identity，勘错文件即伪阴性
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 142b839b-781d-4c51-98ce-ccc8d36b8ff2
  modified: 2026-10-02T16:14:12.689Z
---

「某配置实盘未落」级断言前，必须先验证**勘验文件本身是不是该断言的真源文件**。2026-09-02 LG-024 批 0 实证：host-object 体系一名多文件三 identity——①TriCompany-copilot-host-assets/host-object-manifest.json（支撑面）②.github/manifests/tricompany-host-object-generation-manifest.json（生成计划面）③source-agents/registries/trimetaverse-live-agent-publish-manifest.json（发布登记册，渲染管线真消费源）。FD 勘①报「sessionBody 实盘未落」，CTO 席两轮核验未质疑文件身份即转报；COS 以 json 解析反证（liveEntries=70、sessionBody 条目=1 在③），复勘撤回误报。

**Why**：grep 单文件零命中≠实盘未落（可能勘错文件/格式空格差异/BOM）；「措辞 vs 实盘偏差」类审计发现一旦误报会污染历史交付评价。

**How to apply**：①断言「未落/缺失」前先列全同名/近名文件清单并确认语义身份（谁消费它——追消费端 import/路径引用字符串反推真源）；②矛盾证据到来先对表 json 解析原始值而非 grep 格式；③审计发现转报上级前，把「勘验文件全路径+方法」写进证据链（可被反证复核）。关联 [[fact-citation-source-required]] [[verification-style-confirmed]]。

**跨仓变体（2026-10-03 00:1x BOD 实证）**：commit 归属仓先核再查——rev-parse 零命中≠commit 不存在（可能查错仓）。LG-062 收尾实证：fba8899b（COS 扫描单终态列回填笔）系 **TMV 仓** docs 面 commit，BOD 拿去查了 **TC sg bare** 得 not found，伪阴性外推出「不在 sg bare/三层同顶修正为两层」错判；COO 三重证据（push old-value 行/merge-base 断言/ls-remote 双通道同值）反证后独立复跑全过撤回。根因=两仓并验场景（施工源侧在 TC source-agents、扫描单记录层在 TMV docs）未先验 commit 归属。修法=查 commit 前先看其内容路径归属（`git show --stat` 首行文件路径在哪个仓的树里）；对表主Keywords：施工笔=TC、扫描单/账目/记录笔=TMV docs。
