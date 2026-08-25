# EXPER_ASSET：OpenRouter 回喂轮 400 invalid 的教训——出站消息规范化缺失（五要素简版）

> 本文件为演练树 `rmc-ra3-001` 节点 RA3-N1 产出（R 面最小闭环验收演练；执行实例 = TriRLC headless R-face executor，agent 名义 FullStack）。
> 依据：`experience/README.md` schema v0.1（2026-08-24 quadmig-1 Q1-3 冻结）。
> 五要素（触发场景/做法/验证证据/适用边界/成本收益）简版齐全；status=draft；未过 L3 签收，只落 staging/。

## 资产头（schema v0.1 字段）

- objectType: EXPER_ASSET
- objectId: ra3-normalization-lesson
- status: draft（append-only 状态机起点：draft → validated → consumed/deprecated）
- ownerRole: FullStack（产出与持有）
- securityLevel: internal（不含 restricted 级原始数据——服务器 IP/密钥等敏感基础设施细节不入资产，仅以 commit/文件指针引用）

### producer（溯源必填，L1 门）

- treeId: rmc-ra3-001
- nodeId: RA3-N1
- opRef: docs/workflow/operating-records/2026-W35/OP-202608-W35-001.json（W35 周经营维护索引，实存确认）

### payload（五要素简版，执行判断只采信本区）

- scenario（触发场景 / 现象）:
  - R 面 TriRLC headless 执行体经 trilc 后端管线跑编排树节点时：第一轮工具执行成功（shell_exec/LS 返回 is_error:false），进入**回喂轮**（assistant tool_use + user tool_result 结构回传模型续推）即被 OpenRouter Anthropic 兼容面判 **HTTP 400「Invalid Anthropic Messages API request」**，会话中断、多轮任务无法继续。
  - 第一层根因（执行体早停）之外的第二层独立根因：出站消息构造不符合 OpenRouter 对 Anthropic Messages API 的校验口径——空文本块、tool_result 内容格式细节、assistant 消息 null 字段等未被净化即出站。
- method(做法):
  - 处方 = 在 trilc→OpenRouter 出站方向加**消息规范化层**，已立项 `training-camp-001` 节点 **TC-4b**（FullStack）：trilc→OpenRouter Anthropic 兼容面的请求净化，至少覆盖三件事——①空文本块剥离；②tool_result 内容数组化；③assistant 消息 null 字段清理；同族参考 CC 原版请求构造。
  - 可复现的排查步骤（本次实际走法）：SSE 全量捕获出站请求与上游响应 → 定位 400 发生轮次（首轮成功/回喂轮失败的结构差异）→ 归因到出站消息形态而非工具执行 → 立项专项修复节点并把根因写回编排树存档。
- evidence（验证证据）:
  - 2026-08-25 深夜（部分记录误书 08-26，勘误见 commit 20d2d9912a3ba09378877ea71c9d5059f565e0bf）SSE **全量捕获**实证：请求体逐轮留痕，第一轮 tool 执行成功、回喂轮 400 invalid_request 的完整报文在案——现象非推测而是报文级实锤。
  - commits（全 hash 经 rev-parse 验证为 commit 对象）:
    - `1e44919e8a85583515b9468f8f56b0cab0522af9`（1e44919e）：RA-2 第二层根因锁定 commit——「OpenRouter 回喂轮 400 invalid（出站消息规范化缺失）」立项 TC-4b，本教训的直接存档锚。
    - `d3e5a99c0fbebc92d5ab0110c5d996c3551a67d8`（d3e5a99c）：RA-2 关键发现 commit——R 面执行体成熟度缺口实锤（第一层根因），与本教训第二层根因构成完整归因链。
    - `ab261eca30421b9fb71dd908379b650752783f0c`（ab261eca）：rmc-autonomy-001 tick 编排开工 commit——SSE 捕获所在演练线的 state/log 落盘起点。
  - 文件指针：
    - docs/workflow/operating-records/2026-W35/trees/rmc-autonomy-001/tree-op.json（RA-2 节点 action 内含 SSE 全量捕获结论原文：「第一轮工具执行成功…回喂轮…被 OpenRouter Anthropic 兼容面判 400『Invalid Anthropic Messages API request』——出站消息规范化层缺失」）。
    - docs/workflow/operating-records/2026-W35/trees/training-camp-001/tree-op.json（TC-4b 节点：规范化层修复项立项正文）。
- boundary（适用边界）:
  - 适用：trilc 经 **OpenRouter Anthropic 兼容面**转发的多轮工具调用会话；凡出现「首轮成功、回喂轮 400 invalid」形态的故障，优先怀疑出站消息形态不符而非模型/工具本身。
  - 不适用：
    - 直连 Anthropic 官方端点或其它厂商兼容面（校验口径不同，本教训未经复放不得外推）；CC 原版宿主链路（其请求构造本就通过校验）；
    - 第一层根因（裸循环早停/持续性缺口）问题域——那是 harness 成熟度课题，归 TC-001 主轨道；
    - 入站方向（响应解析）的消息处理——本教训只锁出站请求侧。
- costBenefit（成本收益）:
  - 避免的返工：规范化层就位后，R 面多轮任务不再在回喂轮整轮报废重来——省掉每轮 400 后的人工排障与全树重跑；根因报文级留痕也使后续同类故障可按图索骥，不必重新抓包定位。
  - 沉淀收益：**R 面多轮任务解锁**的前提项——出站规范化是 trilc 会话能连续驱动工具循环的硬依赖；TC-4b 落地前所有多节点树的自治执行都被此 400 卡死，落地后编排树才能吃满 R 面持续执行能力。

### narrative（自由文本，non-actionable: true）

本资产是对一次真实故障（回喂轮 400 中断 R 面自治演练）的教训沉淀，写作时点修复尚未实现——「做法」要素记录的是已立项的处方（TC-4b）与本次验证过的排查路径，不宣称已修复。日期纪律：事件发生于 2026-08-25 深夜，个别在库记录误书 08-26 已经勘误 commit 存证；引用时以 0825 为准。

### metadata

- schemaVersion: v0.1（五要素简版：要素齐全、每要素压缩至最小可审计集）
- shadow: true（影子期产出：只落 staging/，未过 §5.2 判据不进 confirmed/）
- signOffLine: CTO 线（工程类，experience/README.md L3 门映射）；draft 态签收未过
- domainRouting: server-executable（与树顶层一致）
