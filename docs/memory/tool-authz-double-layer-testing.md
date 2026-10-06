---
name: tool-authz-double-layer-testing
description: 工具权限黑盒须探双层——清单可见面+执行授权面（default-deny 规则层），M12 教训 LG-026 实证
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3cc652b9-c7b5-4db7-a9f2-a219e9c2326c
  modified: 2026-09-02T08:40:44.905Z
---

测试 agent 工具白名单时必须双层探边：①清单可见面（getToolDefinitions/注册表过滤）②执行授权面（TriRLC ALLOW/DENY default-deny 规则层、agent-core canUseTool 导出面）。LG-026 P2 门禁③只探了 ①+agent-core 导出面，漏了 TriRLC 内部规则层——组长工具清单可见但执行全被 `[blocked] not explicitly allowed` 拦（第五型阻塞），活模型 E2E 三轮才定位。

**Why:** 「清单可见≠执行放行」——两层机制独立演进（minTier 清单过滤 vs allow 规则注入），任一层单独绿不代表链路通；CTO 已将此教训转正为 P4 验收门禁（授权面黑盒 actor×工具执行矩阵必列）。

**How to apply:** 验收 agent 工具链时，断言矩阵加一格：清单过滤后对每个工具实际调用一次，断言非 `[blocked]`；活模型 E2E 里 agent 行为异常（多轮空转/转通报）优先查会话记录（session-store 落库）中的 blocked 标记，再查模型问题。相关：[[verification-style-confirmed]]（独立重测+交叉验证+盲区单列）。
