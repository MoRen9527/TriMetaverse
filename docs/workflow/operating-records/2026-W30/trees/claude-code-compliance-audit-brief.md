# Claude Code 吸收遵循度审计简报

日期：2026-07-24
来源：CEO 指令
审计驱动：总助（小贾）
树节点：`claude-code-compliance`

---

## 一、背景

CEO 发现当前 TUI 实现偏离了 Claude Code 吸收目标，要求 **100% 遵循 Claude Code 设计模式**，不要臆想。

CPO（小乔）+ CTO（小狄）已于 2026-07-24 完成吸收方案联审（`trilc-tui-absorb`），批准了 vendor Ink 引擎方案。但后续实现（`trilc-tui-impl`，FullStackDeveloper 小全执行）**绕过了已批准的方案**，产生系统性偏离。

## 二、偏离事实清单（总助核查确认）

| # | 偏离项 | 已批准方案（CPO+CTO） | 实际实现（小全） | 严重度 |
|---|--------|----------------------|-----------------|--------|
| 1 | **渲染引擎** | vendor Ink 引擎（React + Yoga + 自研 reconciler，156 文件基线） | 纯 `readline` + `process.stdout`，手动 ANSI 转义码拼接 | 🔴 根本性偏离 |
| 2 | **API 端点** | 应走 Anthropic `/v1/messages`（Claude Code 原生协议） | 走 OpenAI `/chat/completions`（`useChat.ts:30`） | 🔴 根本性偏离 |
| 3 | **SSE 数据格式** | Anthropic SSE: `content_block_delta` / `content_block_start` | OpenAI SSE: `choices[0].delta.content` | 🔴 协议级偏离 |
| 4 | **组件架构** | React 组件树（Box/Text/Messages/MessageRow 等） | 无组件，单文件 `app.ts` 内嵌 `renderDelta()` 函数 | 🔴 架构级偏离 |
| 5 | **布局引擎** | Yoga flexbox（已通过烟雾测试） | 无布局系统，纯行式输出 | 🔴 能力降级 |
| 6 | **虚拟滚动** | VirtualMessageList（长对话性能保障） | 无虚拟滚动，全量重绘 | 🟡 功能缺失 |
| 7 | **Markdown 渲染** | vendor Markdown 组件（marked + ANSI） | 手写 7 条正则替换（`app.ts:34-44`） | 🟡 严重降级 |
| 8 | **Session 管理** | Claude Code 有完整 session 持久化+recovery | 无 session 概念，纯内存消息数组 | 🟡 功能缺失 |
| 9 | **Permission 系统** | Claude Code 有权限询问机制 | 无 permission 系统 | 🟡 功能缺失 |
| 10 | **Tool use 展示** | Claude Code 有完整 ToolUseLoader UI | 折叠为一行 `[tool] name status` 文本 | 🟡 功能降级 |

## 三、关键矛盾

1. **vendor 引擎已就绪但被无视**：test-report 确认 Ink 引擎冒烟通过（Yoga OK），所有 156 文件 + 17 npm 依赖已安装——但 `app.ts` 开篇写 "pure Node.js readline, no React/Ink"。
2. **CTO 技术设计被绕过**：`tech-design.md` 详细设计了 Ink 引擎裁剪方案（45 文件最小子集），但实现完全未采用。
3. **daemon 的能力被浪费**：TriLC daemon 第 677 行起有完整 `/v1/messages` Anthropic 端点（含 SSE 流式、tool use 转换），但实现选择走 `/chat/completions`。

## 四、吸收链规则引用

来源：`docs/三元宇宙架构与模块说明.md` §2：
- "优先复用其成熟、稳定、已被验证的优势能力"
- "项目级目标不是机械复刻上游，而是形成符合 TriMetaverse 总体架构的最优解"
- 吸收链：`TriMetaverse/reference → 模块/vendor → 模块真实实现`

当前偏离 = vendor 到位但真实实现跳过 vendor 自建平替，违反吸收链。

## 五、路由指令

### CPO 小乔 — 产品审计（node: claude-code-compliance-1）

1. Claude Code TUI 的完整功能列表 vs 我们实现了什么——差距在哪？
2. MVP 边界需要重新定义吗？当前 P0 五组件（PromptInput + Messages + MessageResponse + Markdown + Spinner）够不够？
3. Anthropic API 优先 vs OpenAI 兼容——产品定位是什么？
4. 当前纯 readline 实现的产品体验损失评估。

### CTO 小狄 — 技术审计（node: claude-code-compliance-2）

1. `/chat/completions` → `/v1/messages` 切换的技术方案与成本评估。
2. daemon 已有 `/v1/messages` 端点（line 677），为什么不走它？实现侧决策追溯。
3. vendor Ink 引擎继续使用 vs 轻量替代——结合 "100% 遵循 Claude Code" 要求给出裁决。
4. Session 管理、permission、tool use UI——哪些是 TUI MVP 必须吸收的？给出 P0/P1/P2 分级。

### 联合输出（node: claude-code-compliance-3）

由总助汇总 CPO + CTO 审计为《吸收遵循度审计报告》，包含：
- 偏离清单（我们 vs Claude Code）
- 必须修正的偏离（P0）
- 可接受的差异（说明理由）
- 修正路线图

写入路径：`docs/workflow/operating-records/2026-W30/trees/claude-code-compliance/`

---

## 核查依据

- `TriLC/src/tui/app.ts`（纯 readline 实现）
- `TriLC/src/tui/render.ts`（"pure Node.js readline, no React/Ink"）
- `TriLC/src/tui/hooks/useChat.ts`（`/chat/completions` 端点）
- `TriLC/src/tui/hooks/useSSE.ts`（OpenAI SSE 格式解析）
- `TriLC/src/tui/tech-design.md`（CTO 批准的 vendor Ink 方案）
- `TriLC/vendor/claude-code-tui/`（156 文件基线）
- `TriLC/src/server/app.ts`（daemon `/v1/messages` 端点于 line 677）
- `docs/workflow/operating-records/2026-W30/trilc-tui-cpo-review.md`（CPO 已批准方案）
- `docs/workflow/operating-records/2026-W30/trilc-tui-cto-review.md`（CTO 已批准方案）
- `docs/三元宇宙架构与模块说明.md` §2（吸收链规则）
