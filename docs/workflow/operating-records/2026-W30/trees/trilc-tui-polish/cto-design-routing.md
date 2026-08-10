# TriLC CLI TUI — T2 体验打磨 CTO 设计路由

> 路由节点：`trilc-tui-polish-1`
> 路由人：总助 小贾（CEOChiefOfStaff）
> 目标：CTO 小狄（ChiefTechnologyOfficer）
> 时间：2026-07-24
> 产出要求：`trilc-tui-polish-design.md`（写入本目录）

---

## 一、上游状态

### T1 收口结论
- ✅ MVP 五组件实现完成（app.tsx + 5 组件 + 2 hooks + render.tsx + 85 vendor ink 吸收）
- ✅ tsc --noEmit 零错误
- ✅ 8 项验证 CONDITIONAL_PASS，7 项阻塞缺陷已在 T1 测试中修复
- ✅ `trilc chat` 入口已打通

### 关键代码文件（T2 修改面）

| 文件 | 当前角色 | T2 变更 |
|------|---------|---------|
| `src/tui/hooks/useChat.ts` | 状态管理：`isLoading` 布尔值 | 需区分 `isWaitingForFirstToken` vs `isStreaming` |
| `src/tui/hooks/useSSE.ts` | SSE 流解析：`onToken` / `onDone` / `onError` | 需新增 `onFirstToken` 回调 + `onToolCall` 解析 |
| `src/tui/components/Spinner.tsx` | 盲式动画：`isLoading` 期间一直显示 | 需接收 `visible` prop，首个 token 到达后消失 |
| `src/tui/components/Messages.tsx` | 消息列表 + Spinner + 错误展示 | 需穿插工具调用一行 + 区分 loading 阶段 |
| `src/tui/components/MessageResponse.tsx` | 单条消息渲染 | 需增加 tool 类型消息分支 |
| `src/tui/render.tsx` | `exitOnCtrlC: true`，一次 Ctrl+C 退出 | 需改为双段拦截 |

---

## 二、T2 三项目标（来自吸收方案 §七 Phase T2 + 联审裁决）

### 目标 1：thinking 动画

**用户感知**：发送消息 → Spinner "Thinking..." → 首个 token 到达 → Spinner 消失 → 流式内容出现。

**当前缺陷**：`isLoading` 是单一布尔值，Spinner 在整个 SSE 周期（含流式阶段）都显示，不符合 Claude Code 体验。

**设计要求**：
- useChat 需要暴露两阶段状态：`isWaitingForFirstToken`（true：尚未收到任何 token）和 `isStreaming`（true：正在接收 token）
- Spinner 仅在 `isWaitingForFirstToken` 期间可见
- 第一条 assistant 消息的内容为空时（`content === ''`）显示 Spinner；收到首个 token 后 Spinner 自然消失
- 或：useSSE 增加 `onFirstToken` 回调，在第一次收到 content delta 时触发一次

### 目标 2：工具调用一行

**用户感知**：在消息流中看到 `[工具] read_file(src/foo.ts) ✓` 或 `[工具] search_content("pattern") ✗` 的简洁一行，不展开完整 JSON。

**当前缺陷**：useSSE 只解析 `delta.content`，完全忽略工具调用 chunk。

**设计要求**：
- SSE chunk 中工具调用存在于 `choices[0].delta.tool_calls` 数组（OpenAI 兼容格式）
- 解析逻辑：遇到 `tool_calls[0].function.name` + `tool_calls[0].function.arguments`（增量拼接）
- 消息模型中增加 `Message` 类型区分：
  - 现有 `role: 'user' | 'assistant'` 
  - 新增 `role: 'tool'` 用于工具调用一行，`content` 为 `[工具] name(args) ✓/✗`
- 渲染：`MessageResponse` 对 `role === 'tool'` 使用黄色/灰色前缀 `⚙` 而非 `⎿`，显示单行文本不经过 Markdown
- **不做**：折叠面板、参数展开、tool 结果流式渲染、完整 ToolUseLoader

### 目标 3：Ctrl+C 双段行为

**用户感知**：第一次 Ctrl+C → 取消当前 SSE 连接，daemon 会话保留；第二次 Ctrl+C → 退出 TUI。

**当前缺陷**：`exitOnCtrlC: true` 直接退出，用户误触也退，且不取消 daemon 侧任务。

**设计要求**：
- 需要在 `render.tsx` 或 `app.tsx` 层拦截 SIGINT
- 状态机：`IDLE → (Ctrl+C) → CANCELLING → (Ctrl+C again) → EXITING`
- 第一次 Ctrl+C：
  - 若有活跃 SSE（`isLoading`），调用 `abortRef.current()` 取消
  - 同时可选：POST 到 daemon 的 `/sessions/{id}/cancel` 端点（若 daemon 支持）
  - 显示 `⚠ Cancelled. Press Ctrl+C again to exit.` 
- 第二次 Ctrl+C（在 CANCELLING 状态下）：
  - 调用 `process.exit(0)` 正常退出
  - 或在 unmount 后让 Ink 的 exitOnCtrlC 自然退出
- 如果无活跃请求时按 Ctrl+C，直接退出
- Ink 引擎的 `exitOnCtrlC` 可能需要设为 `false`，改由自建 SIGINT handler 接管

---

## 三、设计产出要求

C T O 小狄请产出 **`trilc-tui-polish-design.md`**（写入目录 `docs/workflow/operating-records/2026-W30/trees/trilc-tui-polish/`），包含：

1. **状态模型变更**：useChat 新状态字段设计（两阶段 loading + tool messages）
2. **SSE 解析扩展**：useSSE 如何处理 tool_calls chunk
3. **Message 类型扩展**：新增 tool 消息类型，数据结构定义
4. **组件修改矩阵**：每个受影响文件的修改点、新增 props、删除逻辑
5. **Ctrl+C 双段状态机**：事件流、状态转换、与 Ink exitOnCtrlC 的交互
6. **向后兼容**：不破坏现有 T1 MVP 行为
7. **门禁条件**：
   - tsc --noEmit 零错误
   - thinking 动画在首个 token 前显示、到达后消失
   - 工具调用一行在消息流中正确渲染
   - Ctrl+C 双段行为正确（第一次取消 SSE，第二次退出）

---

## 四、红线清单（不可触碰）

- ❌ 不做完整 ToolUseLoader 组件
- ❌ 不做 VirtualMessageList
- ❌ 不做文件编辑 diff 展示
- ❌ 不修改 vendor/ 下任何文件
- ❌ 不新增 npm 依赖（T2 是纯逻辑变更）
- ❌ 代码写入 `TriLC/src/tui/`，不漂移到 TriMetaverse 根目录

---

## 五、参考依据

| 依据 | 路径 |
|------|------|
| tree-op.json | `docs/workflow/operating-records/2026-W30/trees/trilc-tui-polish/tree-op.json` |
| 吸收方案 T2 节 | `docs/workflow/operating-records/2026-W30/trees/trilc-tui-absorb/absorption-plan.md` §七 Phase T2 |
| T1 技术设计 | `TriLC/src/tui/tech-design.md` |
| T1 测试报告 | `TriLC/src/tui/test-report.md` |
| 当前 useChat | `TriLC/src/tui/hooks/useChat.ts` |
| 当前 useSSE | `TriLC/src/tui/hooks/useSSE.ts` |
| 当前 render.tsx | `TriLC/src/tui/render.tsx` |

---

## 六、下一步

- **CTO 小狄**：产出 `trilc-tui-polish-design.md`
- **总助 小贾**：设计产出后将 tree-op.json 推进到 polish-2（FullStack 小全实现）
- **预计工时**：设计 30-45min，实现 60-90min，验证 30min
