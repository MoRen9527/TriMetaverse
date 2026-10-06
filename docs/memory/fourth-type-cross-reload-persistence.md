---
name: fourth-type-cross-reload-persistence
description: 第四型测试盲区=跨刷新持久（接缝型之后）——jsdom/进程内复刻不覆盖真浏览器 reload 完整 boot 链，跨刷新态必须真浏览器层断言
metadata: 
  node_type: memory
  type: feedback
  originSessionId: cdeaa3bc-3f3b-4724-a7d2-2e5da881f2c2
  modified: 2026-09-12T02:58:11.092Z
---

LG-035 W3（TriModel 时段规则固定选择 reload 丢失，2026-09-12 实锤）：FSD jsdom 双段复刻全通 vs STE 真浏览器同树失败——**复刻面缺口**：jsdom 未复刻真 reload 完整 boot 链（重载后卡片重取+选择器重建+异步渲染时序）。第三型盲区（接缝，LG-026 族）之后的**第四型（跨刷新持久）**。

**Why:** 单页应用「保存→刷新→还在」是用户核心语义；进程内/jsdom 复刻面天然缺 reload boot 链，持久性断言在复刻面全绿≠真浏览器绿。

**How to apply:** ①凡持久化语义（保存/设置/选择）的 E2E 必含「保存→reload→断言仍在」完整周期（真浏览器层，playwright env-gated 族承担）；②复刻面（jsdom）绿不能作为持久性放行依据，只能作逻辑面快测；③发现此类红先做双态分离判定（独立复刻流 vs 门禁上下文流——机器名等必填前置漏填会产生假 W3 态，先排除）；④证据包五值=sel.value/options.length/镜像 keys（注明可达性）/服务端 rules 实文/网络 PUT-GET 序。

关联：[[key-presence-vs-value-validation]]（键存在抽验≠值面验证的持久化版）、[[manifest-identity-verification]]。
