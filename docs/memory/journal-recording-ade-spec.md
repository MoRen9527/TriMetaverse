---
name: journal-recording-ade-spec
description: 记入共学周记必须先走 ADE 规范（Qualify 四问/Plan 三查/Close 五查），格式基准取最近周
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09468c16-026b-403b-9070-654973b0f8de
  modified: 2026-08-18T03:36:03.815Z
---

2026-08-18 CEO 纠正：写共学周记时我跳过规范查找、拿 W29 当模板（应取最近周 W33）、自创结构还塞了内部 commit 台账。

**Why:** 周记有完整规范体系——`.github/prompts/项目级 AI 共学周记.prompt.md`（条目固定格式真源）+ `operating-records/项目级 AI 共学周记/README.md`（归档/版本/周期规则）+ 新立的 `ade-journal-recording-spec.md`（ADE 动作规范：入册资格四问、格式与落点三查、收口五查）。格式随周演进，旧周模板会过期。

**How to apply:** 收到"记入周记/共学"类指令时，走完整 ADE 链（已公司化为 TriCompany 工程纪律 **D-06**）：agent 只做语义四问 + 草拟 entry.json（七字段），写入必须走 CLI——`node scripts/journal/journal-cli.mjs qualify|append|close`（TriMetaverse 仓根执行，格式由代码保证）；文件缺失先 init；CLI 非零退出码不得跳过（REJECTED 补字段、ESCALATED 升级 CEO）。规范真源：`operating-records/项目级 AI 共学周记/ade-journal-recording-spec.md`。相关：[[doc-metadata-header]]、[[tree-file-path-convention]]。
