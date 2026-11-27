# CTO 技术卷·bod 换 Copilot 宿主的通信可达性（2026-11-27）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-copilot-bod-relay-tech-20261127.md·技术面）
- syncMode: write-time
- 承接: CEO 21:40 令（BOD 转 21:41）——bod 由 Claude Code 改 Copilot 宿主（加载 `.github/agents/board.agent.md`）的四问+实测项；产品面归 CPO。

## §一 · 实证读数（本机现查·2026-11-27 21:4x·只读探测）

| # | 事实 | 证据锚 |
|---|---|---|
| 1 | Copilot CLI 在位：`copilot --version`=**1.0.75**（shim=`AppData/Roaming/npm/copilot.cmd`）；VS Code=1.147.0 | 现查 |
| 2 | **Copilot CLI 包内 hook 事件枚举含 `UserPromptSubmit`**：`_vsCodeCompat: enum([SessionStart, SessionEnd, UserPromptSubmit, PreToolUse, PreMcpToolCall, PostToolUse, PostToolUseFailure, ErrorOccurred, Stop, SubagentStop, SubagentStart, PreCompact, PermissionRequest, Notification])` | 全局包 `@github/copilot` 1.0.51 `app.js`（与 shim 所报 1.0.75 非同一实装·事件面以 1.0.51 包为证） |
| 3 | `copilot --help` **不列 hook 字样**；列有 `--acp`（Agent Client Protocol server）·`--agent <agent>`·MCP 配置面 | 现查 |
| 4 | 仓内 Copilot hook 先例：`.github/hooks/ceo-chief-of-staff-workflow-sync.json`（**`PostToolUse`**→`ceo-chief-of-staff-workflow-sync.py`·输出=`systemMessage` JSON 形） | 件在仓 |
| 5 | **CC 侧信箱注入器=`~/.claude/settings.json` 的 `UserPromptSubmit`→`node D:/Code/ai/TriMLC/scripts/notify-inject.cjs`**（席位=cwd 推导·主树→`bod`·读信箱打印 `[M-SG NOTIFY]` 行·标读 token=`TRILC_INTERNAL_TOKEN` env·缺则跳过）——**仅 CC 宿主执行** | 用户级 settings（只核事件名与命令名·零值面）+注入器头注 |
| 6 | Board copilot 面 `.github/agents/board.agent.md` frontmatter=name/description/user-invocable·**无 `tools:` 行**（=继承默认工具面） | 件在仓 |
| 7 | 信箱写面=`/internal/v1/notify*`（本机 8713·`X-Internal-Token`=`TRILC_INTERNAL_TOKEN`·源=daemon env/.env·守**全部** `/internal/v1` 写面含 cron） | TriMLC 注入器头注+lg-026 设计卷+TriRMC runbook |

## §二 · 四问直答

1. **UserPromptSubmit 等价**：**Copilot CLI 面有**（§一#2 事件枚举实证）；**VS Code 聊天面会话是否执行 `.github/hooks`=未验·不得推定**。注入器可复用（逻辑宿主无关）但**输出契约须适配**：CC=stdout 文本即上下文；Copilot 先例=`systemMessage` JSON（§一#4）——Copilot 的 UserPromptSubmit 输出能否进模型上下文=**须实测**。
2. **SendMessage/ListAgents 等价**：**无**（CC 专有 uds 管道·Copilot 不参与）。候选程序化通道=`--acp`（外部控制器驱动会话·**未验**）。
3. **bod→信箱**：工具面——Board 无 `tools:` 限制→Copilot CLI 默认工具面含 shell→`curl` POST 可行（**未实跑**）；**鉴权=内部令牌·不建议交 bod**（令牌守全 `/internal/v1` 写面·与 lg-026「凭证边界」相悖）→建议 scoped 包装（端点白名单+600 文件内读 token）或 letter-store 文件落箱。
4. **回信闭环**：mailbox(target_seat=bod)→**须 UserPromptSubmit 注入才可见**·且注入只在 bod **下一次提交**时发生（CC/Copilot 同限：信到箱≠唤醒）。**闭环三条件**：①宿主执行该 hook ②注入器输出契约适配 ③CEO 下一次输入触发（与现 CC 形同）。**无 hook=不闭环**（只剩人贴原文=非闭环）。

## §三 · 实测项（CC→CC 窗间操作）——**未执行·理由**

- Windows 无 tmux 式定向通道：CC→CC 键入=**前台焦点自动化**（抢 CEO 桌面焦点·不可靠）；
- 更重：**目标会话无法区分「人打字」与「代理打字」**——「准删」是真实批准件·CAO 明示条件=**其会话直接用户一句**·代理键入=伪造用户通道（今日「peer 不能当用户批准」同族）→**不做**。
- CC→CC 的可审计窗间通道=**SendMessage**（今日在役·逐信 msg_id 可查）——这才是代理该用的「窗间操作」。
- Copilot 侧等效：ACP 控制器或 VS Code 输入自动化——同样的出处问题·**不建议作批准通道**。
- **建议**：CEO 在 CAO 窗**亲手**输入「准删」（人操作=出处完整）·或 CAO 自定「转达批准」受理形。

## §四 · 结论与建议

- **换宿主可行性**：Copilot **CLI 面=可闭环**（须先实测两件：UserPromptSubmit hook 实跑+注入器输出契约）；**VS Code 聊天面=未验**。
- **代价**：失 SendMessage（COS 代发代收=信量翻倍+时延）·失 ListAgents（路由须静态化）。
- **建议**：先实测两件再裁；**实测闭环前 CC 留为 bod 主位**。

---
—— CTO 小狄（m-cto）·写前现查 2026-11-27T13:42:32Z（+0800=21:42）
