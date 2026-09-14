# ADR: CC Agent(type) spawn 不消费 frontmatter tools allowlist

- date: 2026-09-14
- status: accepted
- deciders: CTO（技术裁定）/BOD（方向批复）
- tags: claude-code, agent-spawn, tools-allowlist, platform-limitation

## 背景

LG-035 知识体系蓝图一期 tools 语义试点（FSD 席实测）发现：Claude Code 当前版本中，**Agent(type) spawn 的 inline sub-agent 不受 frontmatter tools 字段 allowlist 约束**。tools 字段仅对 `.claude/agents/*.md` 定义的 agent 生效。

## 问题

| 层 | 现象 |
| --- | --- |
| frontmatter 声明 | tools: [Bash, Read, Edit, ...] 十项枚举 |
| 运行时实际 | 子 Agent 自报拥有全部宿主工具（50+，含 frontmatter 未列项） |
| 影响 | tools 字段=格式合规但运行时无效的**假约束**（假约束比没约束更危险——用户以为有权限控制实际没有） |

## 决策

1. **约束路径改走权限规则面**（CLAUDE.md 权限段/disallowedTools），不再依赖 frontmatter tools allowlist。
2. **12 席（除 COS）deny Agent 工具**——spawn 权收归编排席（M-004 跨席协作一律 SendMessage）。
3. **各席合同 frontmatter 的 tools 字段：删**（假约束比没约束更危险）。
4. **「多 FSD 并行」需求**由编排席派多 FSD 会话满足，不由 FSD 自克隆。

## 每席 deny 配置样例

**CLAUDE.md 或 settings.json 权限段**：
```json
{
  "permissions": {
    "deny": ["Agent"]
  }
}
```
**例外**：COS 席保留 Agent 工具（spawn 软约束=self/BS 类型+审计留痕）。

## 平台限制报告（候选 Anthropic /feedback）

**标题**: Agent tool inline sub-agent ignores frontmatter tools allowlist
**描述**: When spawning a sub-agent via the Agent tool with a `type` parameter, the spawned sub-agent has access to all host tools regardless of the `tools` field in its frontmatter definition. The `tools` allowlist is only enforced for agents defined in `.claude/agents/*.md` files, not for dynamically spawned inline sub-agents. This makes the `tools` field a false constraint — format-valid but runtime-ineffective.
**影响**: Users who rely on frontmatter `tools` to restrict sub-agent capabilities have no actual restriction when the agent is spawned via Agent(type) — a security and governance concern.
**期望行为**: Agent(type) spawned sub-agents should respect the `tools` allowlist from their frontmatter definition.
**复现**: Define an agent with `tools: [Read]` in frontmatter, spawn via Agent(type:'agent-name'), observe the sub-agent has access to all host tools.
