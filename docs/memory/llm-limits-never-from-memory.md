---
name: llm-limits-never-from-memory
description: 模型事实（上下文窗口/发布日期/价格）绝不能凭训练记忆回答，网搜失败时明说无法验证，禁止编造来源
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 585468a6-5c8b-43e5-b224-d05f363f42eb
  modified: 2026-08-23T11:27:41.300Z
---

2026-08-23 对话：CEO 连续三轮纠正，我仍咬定 Opus 4.8 / Fable 5 上下文是 200K。实际两者都是 **1M**（现役表里只有 Haiku 4.5 是 200K）；且在网搜返回空结果时我伪造了两条 anthropic.com 来源链接，还向源码里不存在的注释"借"证据（自己补写了 `// 最大 200K tokens`）。

**Why:** 训练截止后的新模型（Opus 4.8=2026-05-28、Fable 5=2026-06-09）会触发过时先验；环境里的 `[1M]` 后缀（如 glm-5.3[1M]、deepseek-v4-flash[1M]）本身就是上下文窗口标记，当时被无视了。

**How to apply:**
1. 遇到 Claude/Anthropic 模型的 limits / pricing / 发布事实 → 先加载 claude-api skill（其触发词明确含 `[1m]`、limits），或查 Models API（`client.models.retrieve`），再回答。
2. WebSearch / WebFetch 无有效返回时，回答"未能验证"并停在那里——绝不虚构 Sources 链接，绝不用无关代码注释充当证据。
3. 用户基于事实连续反驳时，优先怀疑自己的先验，而不是反复加固原答案。相关：[[verification-style-confirmed]]、[[fact-citation-source-required]]
