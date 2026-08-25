# TriPilot 代码审计报告（audit-campaign-001 / AC-PILOT 本地补审）

- 审计节点：AC-PILOT（**本地补审**——原战役在 sg-server 因无该仓记 blocked_env，本报告由 TestEngineer 小柯在持有该仓的 Windows 工作域 `D:/Code/ai/TriPilot` 补齐，覆盖原环境受限占位记录 [2026-08-25T05:53+08:00]）
- 审计人：TestEngineer 小柯（CTO acting 工程门禁框架内，只读审计未修码）
- 目标仓：`D:/Code/ai/TriPilot`
- 审计日期：2026-08-25
- 结论速览：P0 = 1，P1 = 2，P2 = 12

## 概述

TriPilot 是 VS Code/VSCodium 聊天扩展（`tripilot-chat` v0.0.11）：sidebar/editor 双 webview 宿主 + Settings 面板，LLM 调用全部委托本机 TriLC daemon（zero-key 设计，W30 后扩展不持任何 API key），经 tasks/submit + SSE 流消费回显；另含 stdio/http/ws/sse 四传输 MCP 客户端和一个独立 CLI（`bin/tripilot` → `src/cli/tripilot-cli.ts`，直连 TriLC 并本地执行工具）。src 共 9 个 TS 文件，其中 `extension.ts` 单文件 10005 行（约 345KB），承载激活生命周期、webview 消息协议、会话/检查点管理、patch 引擎与 60+ 工具 schema。

扩展主体的安全工程素养高于预期：两个 webview 均带 nonce CSP（`extension.ts:2719,6943`），markdown 渲染先 escape 再拼标签、动态数据普遍走 `textContent`（`media/main.js:1193-1346`），edits 有 pre/post 审批流与 sensitiveGlobs。主要问题集中在三处：CLI 侧完全绕过扩展的审批体系（P0）、SSE 协议四套手写实现各自带健壮性缺陷（P1）、以及 `mcpServers` 配置可被工作区设置注入并在激活期自动 spawn（P1）。

## 范围与方法

- **范围**：`src/**` 全部 8 个实现文件 + 1 个 `.d.ts` 全文精读（extension.ts 分块通读 10005 行）；`media/main.js`（3746 行）与 `media/settings.js`（907 行）webview 脚本全文精读；`bin/tripilot`、`package.json` 通读；`tests/` 经 Glob 确认仅 sseParser 相关 4 文件。
- **方法**：按审计焦点六条（激活生命周期/webview 渲染注入面/SSE 解析健壮性/命令执行面/密钥与配置处理/错误处理与资源泄漏）逐条对照取证，每条发现落到 file:line。
- **约束**：被审仓全程只读，未执行任何 git 写操作，未做运行时验证（纯静态审计）。

## 发现清单

### P0

| # | 发现 | 证据 | 影响 |
| --- | --- | --- | --- |
| P0-1 | **CLI 模型驱动任意命令执行，零审批门禁**：`tripilot` CLI 将 `run_command`/`write_file` 等 6 个工具随请求下发给模型（`tools: CLI_TOOLS`），模型返回的 tool_call 由 `executeTool` 无条件本地执行——`run_command` 把模型控制的 command 字符串直接送入 `powershell.exe -NoProfile -Command` 或 `/bin/sh -c`；`write_file` 接受任意绝对路径全盘写入。整个 agentic 循环（MAX_TOOL_ROUNDS=10）无确认、无 allowlist、无沙箱、无敏感路径保护，工具执行仅打印 `▶ name ... ✓` 即完成 | `src/cli/tripilot-cli.ts:50-126`（工具定义）、`:467`（下发模型）、`:184-190`（分发）、`:269-288`（shell 执行）、`:159-165`（任意路径写）、`:554`、`:586-590`（静默循环） | 典型 lethal trifecta：CLI 默认读取工作区任意文件（`read_file`/`search_files`），被读文件中埋藏的 prompt injection 即可获得任意代码执行与数据外传通道。扩展侧精心构建的 edits 审批/approvalMode/sensitiveGlobs 体系在 CLI 形态下完全不存在。属安全/数据损坏级缺陷 |

### P1

| # | 发现 | 证据 | 影响 |
| --- | --- | --- | --- |
| P1-1 | **同一 SSE 协议四套手写实现，行为互不一致且各有解析缺陷**：(a) `sseParser.ts` 仅按 `\n\n` 切事件，CRLF 结尾流（SSE 规范允许）永不产生事件且缓冲无界增长；(b) `TriLCClient.streamSession` 内联解析对多行 `data:` 后行覆盖前行（丢数据），且单个事件 JSON.parse 失败即 reject 整条流（keep-alive 类噪声可杀死会话流）；(c) `trilcClient.streamChat` 对坏行静默吞掉（与 b 行为相反），`input_json_delta` 无上限累积；(d) `extension.ts` init-events 又是第四套（反而是最完整的一套：CRLF 处理+watchdog）。仅 (a) 有单元测试 | `src/trilcDirect/sseParser.ts:43-50`；`src/TriLCClient.ts:184-203,393-420`；`src/trilcDirect/trilcClient.ts:276-336`；`src/extension.ts:3283-3339` | SSE 消费是聊天主链路：解析缺陷直接表现为流卡死/断流/丢 delta；四套实现使修复与回归无法收敛，违背单一真源 |
| P1-2 | **`tripilot.mcpServers` 可被工作区设置注入，激活期自动 spawn stdio 进程**：该配置项未声明 `scope`（VS Code 默认 window scope，可写入工作区 `.vscode/settings.json`）；扩展激活时无条件 `mcpManager.refresh(readMcpServersFromConfig())`，stdio 传输用配置的 `command`+`args` 直接 spawn。克隆恶意仓库 → 打开工作区 → 任意命令执行（防护完全依赖 Workspace Trust 对未声明扩展的默认禁用，扩展自身未声明 `untrustedWorkspaces` 能力，也未对 spawn 前做任何确认） | `package.json:402-466`；`src/extension.ts:876-877,1516-1531`；`src/mcpClient.ts:211-226` | 供应链式攻击面：把"打开仓库"升级为"执行仓库指定的二进制"。用户级配置自装 MCP 属正常设计，但缺 workspace 来源隔离与首连确认 |

### P2

| # | 发现 | 证据 | 影响 |
| --- | --- | --- | --- |
| P2-1 | **HTTP 层错误归一化缺失**：`TriLCClient.jsonRequest` 不检查 statusCode，非 200 响应体直接进 JSON.parse，错误信息退化为 "Invalid JSON response"+前 200 字符；`TrilcDirectClient` 两处硬编码 `node:http`（port 兜底 80），配置成 https baseUrl 时静默明文连错端口 | `src/TriLCClient.ts:340-371`；`src/trilcDirect/trilcClient.ts:244-247,370-398` | 排障根因丢失；baseUrl 配置面与实际协议能力不符 |
| P2-2 | **TriLC 自启所有权竞态 + shell 插值**：auto-start 的子进程 exit 0 即标记 `triLCAutoStarted=true`，若端口上本就有用户自己的 daemon（`trilc start` 幂等退出 0），deactivate 会发出 `trilc stop` 误杀外部 daemon；spawn 用 `shell: true`（win32）且 port 取自设置值字符串拼入 cmd.exe 命令行 | `src/extension.ts:1069-1113,1422-1495,1497-1513` | 关闭窗口可能停掉用户独立部署的 TriLC；设置值类型不受信时的注入脆弱模式 |
| P2-3 | **McpClientManager 生命周期缺陷**：dispose 先 `_onDidChange.dispose()` 再异步调 `disconnect()`（其内部 fire 已销毁的 emitter，且不 await client.close，子进程可能来不及收尾）；`callToolByLmName` 无超时无取消，MCP server 挂起则整轮对话永久挂起 | `src/mcpClient.ts:61-68,177-192,202-209` | 退出清理不可靠；坏 MCP server 变成 UI 死锁点 |
| P2-4 | **AbortSignal 监听竞态**：`streamChat` 在请求发出后才 `addEventListener('abort')`，signal 已 aborted 时监听器永不触发，请求无法取消 | `src/trilcDirect/trilcClient.ts:350-353` | 取消操作偶发失效，流继续消耗资源 |
| P2-5 | **CLI search_files 依赖系统 grep 且 fallback 名存实亡**：Windows 默认无 grep → 工具恒失败；catch 分支只 push 提示文案，与注释"fall back to a simple Node.js search"不符（fallback 根本没实现）；`-P`（Perl regex）在 BSD/macOS grep 不可用 | `src/cli/tripilot-cli.ts:235-267` | 三大平台两档不可用/降级，注释与行为漂移 |
| P2-6 | **10005 行单文件巨石 + 成片死代码**：extension.ts 同时承载激活、双 webview 协议、settings 面板、patch 引擎等；`getCopilotToken/createAutoModelsSession` 等 deprecated stub 返回 null/undefined 但 `ensureTrilcAutoSession` 仍在调用；约 1500 行 `getToolDefinitions()` 仅剩 UI 兼容用途；welcome 向导 maxStep=0，step1-3（含"API Key 将安全保存"文案）为死界面 | `src/extension.ts:162-180,3593-3621,7636-9131`；`src/welcome/welcome-setup.ts:40-55,210` | 可测性归零的直接原因（见 P2-7）；误导性文案与 W30 zero-key 口径相悖 |
| P2-7 | **测试近乎为零**：`tests/` 仅 sseParser 单测/集测 + e2e fixture 共 4 文件；10005 行主文件、CLI、MCP、两个 HTTP client 均无测试；`lint` script 为 `echo` 占位 | `package.json:485-495`；Glob `tests/**` 结果 | 回归保护形同虚设，P0/P1 缺陷长期存活的结构性原因 |
| P2-8 | **welcome 向导无 CSP + JSON 内插脚本模式**：向导 HTML 未设 Content-Security-Policy（enableScripts=true）；i18n 经 `'${JSON.stringify(...)}'` 内插进单引号 JS 字符串，数据含 `'` 或 `</script>` 即破坏语境（当前数据为静态常量，未实际可利用） | `src/welcome/welcome-setup.ts:101-107,207-218,366-375` | 违反 webview 安全基线（同仓其他视图均有 nonce CSP）；模式脆弱 |
| P2-9 | **init 卡渲染两处未转义插值**：assemble 结果的 `body.warning.current/recommendedMin`（daemon 控制值）直接拼进 innerHTML；nonce CSP 可拦 script 注入但拦不住 HTML 注入式钓鱼/仿冒 UI。同卡片其余字段均已 escapeHtml | `media/main.js:3202`（对照 `:3224`） | 信任了自家 daemon 输出；daemon 被攻破或中间人时 webview 呈现面失守 |
| P2-10 | **治理动作从编辑器以硬编码身份无鉴权发起**：上岗申请/CHO 审批端点调用固定 `requester:'ceo-panel'`、`approver:'panel-cho'`；叠加 TriLC minimal 模式的本地无鉴权面，等于把公司治理写操作又开了一扇任意本地进程可及的门 | `src/TriLCClient.ts:290-299`；`src/extension.ts:1825-1864` | 身份伪造成本为零；治理留痕的可信度依赖端点而非身份 |
| P2-11 | **sessionId 未校验即拼文件路径**：`resumeSession`/`loadSessionIntoHost`/删除/导出均以 `${sid}.jsonl` 拼 global storage 路径，无字符白名单；当前 sid 来源均为内部（目录列举/globalState），暂无外部注入通道，属防御缺口 | `src/chatHistory.ts:130-136`；`src/extension.ts:4292,4564,6319` | 未来任何新入口（如导入/恢复协议）引入外部 sid 时即成路径穿越写/删原语 |
| P2-12 | **常驻轮询与会话列表全量重读**：激活起两个 30s interval（健康检查+阶段卡兜底）永不休眠（视图关闭照跑）；每条消息 append 后触发 sessions 刷新，`listStoredHistorySessions` 对每个历史会话整文件 readFile，O(会话数×体积)/条消息 | `src/extension.ts:800-808,4622-4637,4005-4147` | 空闲资源占用；会话累积后输入延迟线性恶化 |

## 密钥与配置处理专项结论

zero-key 设计基本落实：`getTrilcConfig()` 不再读取 `trilcDirect.apiKey`（`extension.ts:4643-4650`），package.json 中该设置已标注 DEPRECATED；chatHistory 默认关闭、workspace 路径只存 SHA-256 hash（`chatHistory.ts:95-101`）是好实践。残留问题：`TrilcClientConfig.apiKey` 字段仍会在配置传入时发送 Bearer 头（`trilcClient.ts:254,380`），属死接口未摘除；welcome 向导死步骤仍宣传"API Key 安全保存在本地"（见 P2-6）。未发现密钥明文落 settings 或日志的新增写入点。

## 质量总评

**评级：C-（扩展主体可用，CLI 形态存在必须先堵的安全缺口）。**

加分项是真实的：webview 渲染面 escape/textContent 纪律性强且有 CSP 兜底、edits 审批/检查点/undo-redo 链路完整、zero-key 架构方向正确、错误处理普遍 try-catch 包裹不致崩扩展宿主。扣分集中在：CLI 把扩展侧积累的安全设计整体绕过（P0，唯一必须阻塞放行的项）；SSE 四实现并存说明缺一层共享协议库（P1-1）；配置面缺少 workspace 信任隔离（P1-2）；以及巨石文件+近零测试使上述缺陷难以被既有流程拦截（P2-6/7）。建议修复顺序：P0-1（CLI 加审批门禁或至少 opt-in 显式开关）→ P1-1（收敛到 sseParser 单一实现并补 CRLF/多行 data 用例）→ P1-2（mcpServers 声明 machine scope 或首连确认）。

## 未覆盖

- `node_modules/` 第三方依赖未做供应链审计（@modelcontextprotocol/sdk、ws、diff、sql.js 等）。
- `out/`、`dist/` 构建产物视为生成物未比对；`script/build-cli.ts`、`scripts/check-*.js` 构建辅助脚本未审。
- `tsconfig.json` 编译严格度未核实；git 历史/CI workflow 未检查。
- 纯静态审计：未运行扩展/CLI 实测 SSE 断流、Workspace Trust 实际拦截行为、TriLC daemon 侧实际 SSE 帧格式（P1-1 各缺陷的实际触发频率取决于 daemon 输出格式）。
- `media/settings.js` 已全文精读未见注入面；`media/main.css`、`resources/` 未审（纯样式/图标）。

---

- 同步修订：[2026-08-25] [本地补审] TestEngineer 小柯——blocked_env 占位替换为实审报告（P0=1/P1=2/P2=12），审计范围与方法见上文
