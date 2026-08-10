# TriLC CLI TUI 技术评审 — CTO 裁决

> 评审人：ChiefTechnologyOfficer（小狄）
> 日期：2026-07-24
> 状态：APPROVE（吸收路径可行，附带门禁条件）
> 树节点：`trilc-tui-absorb`
> 上游依据：CEO 指令 + CPO+CTO 联审简报（同目录 `trilc-tui-absorb-review-brief.md`）

---

## 前置核查

| # | 核查项 | 结论 |
|---|--------|------|
| 0 | 工作路径核查 | 本事项为 TriLC 模块扩展，写入路径为 `TriLC/src/tui/`、`TriLC/vendor/claude-code-tui/`，合规 |
| 1 | CEO 最新明确输入 | "为 TriLC 包装一个类似 Claude Code 的 TUI" |
| 2 | BusinessStrategy 边界 | 不需咨询：不引入新模块、不改变模块边界 |
| 3 | 技术真源 | `docs/engineering/cto-008-P-pc-electron-packaging.md`（TriLC daemon 架构）、`cto-008-M-tri-mc-lc-protocol.md`（HTTP API 契约） |
| 4 | 模块 Code Registry | TriLC 现有 TypeScript/Node.js ≥20.0.0，agent-core 依赖已就绪 |
| 5 | TriDev/发布 readiness | P0 阶段，不涉及正式发布 |
| 6 | 岗位授权 | CTO 为 CodeRegistry owner + TriLC 技术收口，本裁决在授权范围内 |

---

## 重大发现：Claude Code 不使用 npm `ink` 包

在评审过程中发现一个**关键事实**，直接影响吸收策略：

Claude Code 2.1.88 的终端 UI 渲染层**不是**基于 npm 公开包 `ink`（v7.1.1），而是一个**完全自研的终端渲染引擎**，位于 `src/ink/`（约 80 个文件，涵盖以下子系统）：

```
src/ink/
├── ink.tsx              # 渲染入口 (246 KB)
├── renderer.ts          # React reconciler 适配器
├── reconciler.ts        # 自定义 React reconciler
├── screen.ts            # 终端屏幕缓冲区管理
├── terminal.ts          # 终端 I/O 抽象
├── render-node-to-output.ts  # 组件树 → ANSI 输出
├── render-to-screen.ts  # diff/blit 屏幕更新
├── layout/
│   ├── yoga.ts          # Yoga 布局引擎绑定（原生模块）
│   ├── engine.ts        # 布局计算引擎
│   ├── node.ts          # 布局节点
│   └── geometry.ts      # 几何计算
├── components/
│   ├── Box.tsx          # Flexbox 容器
│   ├── Text.tsx         # 文本组件
│   ├── ScrollBox.tsx    # 滚动容器
│   ├── App.tsx          # 应用根组件
│   └── ...              # 其他 10+ 组件
├── events/              # 输入事件系统（键盘/鼠标/焦点）
├── hooks/               # React hooks（useInput/useApp/useTerminalSize等）
├── termio/              # 终端 I/O 协议（CSI/DEC/OSC/ANSI 转义码）
└── selection.ts         # 文本选择系统
```

核心依赖：`react` (v19) + `react-reconciler` + `yoga-layout`（原生模块）。

这意味着：
1. 不能简单地 `npm install ink` 来获得 Claude Code 的 TUI 能力
2. 必须吸收整个 `src/ink/` 作为 vendor 冻结基线
3. 公开 npm `ink` 与本自定义渲染引擎 API 不兼容

---

## 一、吸收路径

### 裁决：`TriMetaverse/reference/claude-code-2.1.88/ → TriLC/vendor/claude-code-tui/ → TriLC/src/tui/` — **APPROVE**

路径符合吸收链五规则（`docs/三元宇宙架构与模块说明.md` §2）。

### Step 0：先补 reference 入仓（前置条件）

当前 `TriMetaverse/reference/` 下**没有** `claude-code-2.1.88/`。第一步必须将 `D:\OneDrive\Code\ai\claude-code-2.1.88\source-repo/` 的 TUI 相关源码复制到 `TriMetaverse/reference/claude-code-2.1.88/`。

```powershell
# 建议命令
Copy-Item -Recurse D:\OneDrive\Code\ai\claude-code-2.1.88\source-repo\src\ink `
    D:\OneDrive\Code\ai\TriMetaverse\reference\claude-code-2.1.88\src\ink
Copy-Item -Recurse D:\OneDrive\Code\ai\claude-code-2.1.88\source-repo\src\components `
    D:\OneDrive\Code\ai\TriMetaverse\reference\claude-code-2.1.88\src\components
Copy-Item D:\OneDrive\Code\ai\claude-code-2.1.88\source-repo\src\ink.ts `
    D:\OneDrive\Code\ai\TriMetaverse\reference\claude-code-2.1.88\src\
# ... 补充其他文件（见下方 vendor 清单）
```

### Step 1：vendor 冻结清单

以下文件必须从 reference 提取到 `TriLC/vendor/claude-code-tui/` 并冻结（保持上游原貌，不修改）：

#### 🔴 Tier 1 — 渲染引擎核心（必须冻结，TUI 的物理基础）

| 文件/目录 | 用途 | 理由 |
|-----------|------|------|
| `src/ink/ink.tsx` | 渲染引擎入口 | 整个终端 UI 的 React 渲染循环 |
| `src/ink/renderer.ts` | 渲染器 | reconciler → 终端输出 |
| `src/ink/reconciler.ts` | React reconciler | 自定义 reconciler，连接 React 与终端 |
| `src/ink/screen.ts` | 屏幕缓冲区 | 双缓冲 diff/blit，性能关键 |
| `src/ink/terminal.ts` | 终端抽象 | 跨平台终端 I/O |
| `src/ink/render-node-to-output.ts` | 节点渲染 | 组件树 → ANSI 输出字节流 |
| `src/ink/render-to-screen.ts` | 屏幕更新 | diff 计算 + 屏幕写入 |
| `src/ink/dom.ts` | DOM 抽象 | Yoga 布局节点的 DOM 树表示 |
| `src/ink/output.ts` | 输出管理 | 终端输出缓冲与写入 |
| `src/ink/layout/*` | Yoga 布局引擎 | Flexbox 布局计算（含原生模块绑定） |
| `src/ink/components/Box.tsx` | Flexbox 容器 | 布局基础组件 |
| `src/ink/components/Text.tsx` | 文本渲染 | 带样式的文本组件 |
| `src/ink/components/ScrollBox.tsx` | 滚动容器 | 虚拟滚动基础 |
| `src/ink/components/App.tsx` | 应用根组件 | TUI 应用生命周期 |
| `src/ink/components/AppContext.ts` | 应用上下文 | 全局状态 |
| `src/ink/components/StdinContext.ts` | 标准输入上下文 | 键盘输入 |
| `src/ink/components/TerminalSizeContext.tsx` | 终端尺寸 | 响应式布局 |
| `src/ink/events/*` | 事件系统 | 键盘/鼠标/焦点/终端事件 |
| `src/ink/hooks/*` | React hooks | useInput/useApp/useTerminalSize 等 |
| `src/ink/termio/*` | 终端 I/O 协议 | CSI/DEC/OSC/ANSI 转义码解析 |
| `src/ink/colorize.ts` | 颜色处理 | ANSI 颜色转换 |
| `src/ink/styles.ts` | 样式系统 | Flexbox 样式属性映射 |
| `src/ink/measure-text.ts` | 文本测量 | 字符串宽度计算（含 CJK） |
| `src/ink/stringWidth.ts` | 字符宽度 | Unicode 字符宽度 |
| `src/ink/wrap-text.ts` | 文本换行 | 终端宽度内自动换行 |
| `src/ink/log-update.ts` | 日志更新 | 渲染帧日志 |
| `src/ink/root.ts` | 根节点创建 | createRoot/render 入口 |
| `src/ink/instances.ts` | 实例管理 | 多实例生命周期 |
| `src/ink/selection.ts` | 文本选择 | 终端文本选择与复制 |
| `src/ink/focus.ts` | 焦点管理 | 组件焦点切换 |
| `src/ink/frame.ts` | 帧管理 | 渲染帧调度 |

> **总计约 50 个文件**，构成完整的终端 UI 渲染引擎。这些文件是 TUI 的物理基础，缺一不可。

#### 🟡 Tier 2 — UI 组件（建议冻结，MVP 核心）

| 文件/目录 | 用途 | MVP 必要性 |
|-----------|------|-----------|
| `src/ink.ts` | CC 的 Ink wrapper（ThemeProvider 包裹） | 🔴 必须 |
| `src/components/Messages.tsx` | 消息列表容器 | 🔴 必须 |
| `src/components/Message.tsx` | 消息渲染分发 | 🔴 必须 |
| `src/components/MessageRow.tsx` | 消息行布局 | 🔴 必须 |
| `src/components/MessageResponse.tsx` | 助手响应包装（`⎿` 前缀） | 🔴 必须 |
| `src/components/VirtualMessageList.tsx` | 虚拟滚动消息列表 | 🟡 建议（10+ 条消息后性能关键） |
| `src/components/Markdown.tsx` | 终端 Markdown 渲染 | 🔴 必须 |
| `src/components/MarkdownTable.tsx` | Markdown 表格 | 🟡 建议 |
| `src/components/Spinner/` | 加载动画（SpinnerGlyph/glimmer 等） | 🟡 建议 |
| `src/components/TextInput.tsx` | 文本输入基类 | 🔴 必须 |
| `src/components/PromptInput/PromptInput.tsx` | 输入框主组件 | 🔴 必须 |
| `src/components/PromptInput/inputPaste.ts` | 粘贴处理 | 🟡 建议 |
| `src/components/design-system/` | ThemeProvider/ThemedBox/ThemedText/color | 🔴 必须（被 ink.ts 引用） |
| `src/cli/print.ts` | 纯文本输出 fallback | 🟡 建议（--print 模式） |
| `src/hooks/useTerminalSize.ts` | 终端尺寸 hook | 🔴 必须 |
| `src/hooks/useSettings.ts` | 设置 hook | 🟡 建议 |

#### ⚪ Tier 3 — 砍掉（TriLC 不需要）

以下 Claude Code 专属功能**明确不吸收**：

| 文件 | 理由 |
|------|------|
| `src/components/App.tsx` | CC 专属应用组件（IDE 集成、自动更新、Teleport 等） |
| `src/components/Onboarding.tsx` | CC 专属引导流程 |
| `src/components/Permissions/*` | CC 权限审批 UI（TriLC 用 bypassPermissions） |
| `src/components/Settings/*` | CC 设置面板 |
| `src/components/ModelPicker.tsx` | 模型切换（初期固定 deepseek-v4-pro） |
| `src/components/Feedback*.tsx` | 反馈/调查 |
| `src/components/ToolUseLoader.tsx` | 工具调用 UI 过于复杂，MVP 简化为文本提示 |
| `src/components/agents/*` | CC 子代理系统 |
| `src/components/mcp/*` | MCP 服务器 |
| `src/components/teams/*` | CC 协作模式 |
| `src/components/skills/*` | CC skill 系统 |
| `src/components/tasks/*` | CC 任务列表 |
| `src/components/Desktop*.tsx` | 桌面集成（IDE 连接等） |
| `src/components/ide/*` | IDE 状态指示 |
| `src/components/AutoUpdater*.tsx` | 自动更新（TriLC 走 TriCade 分发） |
| `src/main.tsx` | CC 入口（TriLC 用自己的 CLI 入口） |

### Step 2：真实实现路径

```bash
TriLC/
├── vendor/claude-code-tui/     # 冻结：Tier 1（ink 引擎）+ Tier 2（核心 UI 组件）
│   ├── ink/                    # 约 50 个渲染引擎文件（只读）
│   ├── ink.ts                  # CC wrapper（只读参考）
│   └── components/             # 约 15 个核心组件（只读参考）
│
├── src/tui/                    # 真实实现（自研）
│   ├── app.tsx                 # TriLC TUI 应用主组件
│   ├── messages-panel.tsx      # 消息列表面板（基于 vendor 的 Messages/VirtualMessageList）
│   ├── input-panel.tsx         # 输入面板（基于 vendor 的 PromptInput/TextInput）
│   ├── markdown-renderer.ts    # Markdown 渲染适配（基于 vendor 的 Markdown）
│   ├── spinner.tsx             # 加载指示器（基于 vendor 的 Spinner）
│   ├── api-client.ts           # TriLC HTTP API 客户端（SSE 消费）
│   └── index.ts                # `trilc chat` 命令入口
│
└── src/cli.ts                  # 扩展现有 CLI，添加 `trilc chat` 子命令
```

**关键实现原则**：
- vendor 保持冻结，不修改
- `src/tui/` 通过 import 引用 vendor 组件，添加 TriLC 专属逻辑（API 客户端、消息格式适配、错误处理）
- 复用 ink 渲染引擎全部能力（Box/Text/ScrollBox/useInput 等），不改渲染引擎本身
- 把自己的 App 组件替换 Claude Code 的 App.tsx

---

## 二、技术栈选型

### 裁决：Claude Code 自研 Ink 引擎（vendor 吸收）— **APPROVE**

| 对比维度 | CC 自研 Ink（推荐） | npm `ink` 7.1.1 | blessed / neo-blessed | 纯 readline |
|----------|-------------------|-----------------|----------------------|-------------|
| API 兼容 | ✅ 与 CC 源码完全一致 | ❌ 不同 API，需大量适配 | ❌ 无 React | ❌ 需自建全部 |
| 虚拟滚动 | ✅ VirtualMessageList 已实现 | ⚠️ 需自行实现 | ⚠️ 需自行实现 | ❌ 不可行 |
| 组件生态 | ✅ Box/Text/ScrollBox 等 | ⚠️ 不同实现 | ⚠️ 有限 | ❌ 无 |
| 性能 | ✅ diff/blit 屏幕更新 + mtime 预算 | ⚠️ 全量重渲染 | ⚠️ 中 | ❌ 无优化 |
| 维护成本 | ✅ 已有 vendor 基线，只改 TriLC 层 | ❌ 需重新学习 | ❌ 需从零搭建 | ❌ 极高 |
| 终端兼容 | ✅ CC 已验证（cmd/PowerShell/Git Bash） | ⚠️ 社区+部分维护 | ⚠️ 不活跃 | N/A |
| Node.js 要求 | ✅ ≥20.0.0（与 TriLC 一致） | ✅ | ⚠️ 可能需要降级 | ✅ |
| React 依赖 | react 19 + react-reconciler | react 18/19 | 无 React | 无 |

**结论**：吸收 CC 自研 Ink 是最优解。
- vendor 已经包含完整的、经过 2.1.88 版本验证的终端 UI 引擎
- 可以直接复用 Message/Markdown/VirtualMessageList 等高价值组件
- 维护成本最低：vendor 冻结不动，只在 `src/tui/` 写 TriLC 适配层

---

## 三、集成方式

### 裁决：HTTP API（Option A：`localhost:8711` SSE）— **APPROVE**

| 方案 | 描述 | 优点 | 缺点 | 裁决 |
|------|------|------|------|------|
| **A: HTTP API SSE** | TUI → `localhost:8711/chat/completions` SSE | ✅ 与 TriPilot 同协议 ✅ daemon 生命周期独立 ✅ TriMC fallback 透明 ✅ daemon crash 时 TUI 不受影响 | ⚠️ 网络栈开销（可忽略，localhost） | **推荐** |
| B: IPC (named pipe) | Windows named pipe / Unix socket | ✅ 零网络开销 | ❌ 跨平台实现复杂 ❌ 增加维护 ✅ 需定义新协议 | 否决 |
| C: 进程内嵌入 | TUI 直接调用 agent-core | ✅ 零延迟 | ❌ 破坏 daemon 架构 ❌ TriMC fallback 不可用 ❌ TUI crash → agent crash ❌ 违反 CTO-008-M 通信分层 | 否决 |

**核心理由（与 CTO-008-M/CTO-008-P 合同一致）：**

1. **TriLC daemon 是独立进程**：TUI 作为 thin client 通过 HTTP 调用 daemon，保持进程隔离
2. **SSE 流式原生支持**：TriLC daemon 已实现完整的 SSE（`text/event-stream`），TUI 直接消费即可获得实时增量渲染
3. **TriMC fallback 透明**：daemon 的 ConnectionManager 自动管理 TriMC 切换，TUI 完全无感知
4. **TriPilot 同路径验证**：TriPilot 已通过同一 HTTP API 路径完成对接和 SSE 流式验证，TUI 只是换了一个渲染面（终端而非 WebView）

**TUI API 调用链**：

```
用户输入 → TUI PromptInput
    → POST http://127.0.0.1:8711/chat/completions
    → Accept: text/event-stream
    → SSE 事件流解析
    → Message 组件增量渲染
    → VirtualMessageList 虚拟滚动更新
```

---

## 四、打包影响

### 4.1 依赖体积评估

| 依赖 | 解压体积 | 说明 |
|------|---------|------|
| `react` v19 | ~168 KB | 运行时 |
| `react-reconciler` | ~1,643 KB | CC 自研 Ink 的 reconciler 运行时 |
| `marked` | ~80 KB | Markdown 解析 |
| `chalk` | ~43 KB | 终端颜色（CC 已用） |
| yoga-layout (native) | ~200 KB | Flexbox 布局引擎原生二进制 |
| CC Ink 引擎（vendor） | ~800 KB | 约 50 个 TypeScript 文件，编译后 |
| TriLC TUI 实现（src/tui） | ~50 KB | 薄适配层 |
| **合计（新增）** | **~3.0 MB** | 解压后体积 |

对比：TriLC 当前 `node_modules/` 约 15 MB（主要是 agent-core + trimodel），新增 TUI 依赖约 +3 MB。

### 4.2 Node.js 版本兼容性

- TriLC 当前 `engines.node >= 20.0.0`
- Claude Code 2.1.88 `engines.node >= 20.0.0`
- **版本完全一致，零冲突** ✅

### 4.3 MSI 尺寸增量

TriCade MSI v0.2.4 当前结构：

```
TriCade/
├── resources/
│   ├── app/
│   │   └── tools/
│   │       └── trilc/           # TriLC 当前已打包
│   │           ├── trilc.cmd
│   │           ├── node_modules/  (~15 MB)
│   │           └── dist/
```

新增 TUI 后：
- 新增依赖 → `node_modules/` +3 MB（react, react-reconciler, marked, chalk）
- vendor 源码（编译前）→ 不打包，只编译产物进 `dist/`
- TUI 源码（编译后）→ `dist/tui/` ~50 KB
- **MSI 增量预估：约 +2-3 MB（经压缩后）**

### 4.4 构建步骤

需在 TriLC 的构建流程中新增：

```jsonc
// TriLC/package.json 新增
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "build:tui": "tsc -p tsconfig.tui.json",  // ← 新增
    "start:chat": "node dist/cli.js chat"       // ← 新增
  },
  "dependencies": {
    // 现有
    "@trimetaverse/agent-core": "...",
    "trimodel": "...",
    "yaml": "^2.9.0",
    // 新增（TUI 依赖）
    "react": "^19.2.4",
    "react-reconciler": "^0.33.0",
    "marked": "^17.0.5",
    "chalk": "^5.6.2"
  }
}
```

**注意**：CC 依赖的 `yoga-layout` 原生模块需要评估。CC 使用 `src/native-ts/yoga-layout/` 自维护绑定。TriLC 需要验证该原生模块能否在 TriCade 打包的 Node.js 环境下正常工作，或改用纯 JS yoga-layout 替代（如 `yoga-layout-prebuilt`）。

### 4.5 对 build-bundle.sh 的影响

TriCade 打包脚本（`TriLC/scripts/build-tray.ps1` 等）当前流程：

```powershell
# 当前
npm install
npm run build
# 打包 dist/ + node_modules/ 到 MSI
```

新增后：

```powershell
# 新增
npm install          # 会拉取 react/marked/chalk 等新增依赖
npm run build        # tsc 编译（含 src/tui/）
npm run build:tui    # 如有独立 tsconfig
# 打包同上，node_modules 自动包含新增依赖
```

**不需要**在 TriCade 构建脚本中新增 `npm install` 步骤，因为 TriLC 的 `npm install` 已经存在。

---

## 五、终端兼容性

### 裁决：TriCade 内置终端环境下 Ink 兼容性 — **APPROVE（有已知风险）**

Claude Code 2.1.88 已经在以下终端上验证通过。TriCade 的内置终端基于 Electron，结论如下：

| Shell 环境 | VT/ANSI 支持 | Unicode | 颜色（256/TrueColor） | 风险评估 |
|-----------|-------------|---------|---------------------|---------|
| **PowerShell (Windows Terminal)** | ✅ 完整（xterm-256color） | ✅ | ✅ | 🟢 低风险 |
| **PowerShell (conhost)** | ✅ Win10+ VT 序列 | ✅ | ✅ 256 色 | 🟢 低风险 |
| **cmd.exe** | ✅ Win10 1607+ 默认开启 | ⚠️ 部分 Unicode 需 chcp 65001 | ✅ 256 色 | 🟡 中低风险 |
| **Git Bash (Mintty)** | ✅ 完整 | ✅ | ✅ TrueColor | 🟢 低风险 |
| **TriCade Electron 终端** | ✅ xterm.js 内置 | ✅ | ✅ TrueColor | 🟢 低风险 |
| **WSL** | ✅ 完整 | ✅ | ✅ TrueColor | 🟢 低风险 |

### 已知风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| **cmd.exe Unicode** | 中文显示为乱码 | `chcp 65001` 自动设置；三元宇宙中文优先在 PowerShell/Git Bash 下使用 |
| **Yoga 原生模块** | TriCade Electron Node.js 可能不兼容 | 优先使用纯 JS fallback（`yoga-layout-prebuilt`）；vendor 中保留原生绑定供后续优化 |
| **终端尺寸查询** | 某些终端模拟器不支持 CSI 查询 | CC 的 renderer.ts 已有 fallback（使用 `process.stdout.columns/rows`） |
| **鼠标事件** | cmd.exe 不支持鼠标 | TriLC TUI MVP 不需要鼠标支持（纯键盘交互） |
| **Alt/Ctrl 组合键** | 不同终端对修饰键编码不同 | CC 的 parse-keypress.ts 已处理多数编码差异 |
| **SSE 流中断** | 终端挂起时 SSE 连接可能断开 | daemon 的 session-store 支持恢复（`POST /sessions/{id}/recover`） |

### 建议的首选环境顺序

1. 🥇 **TriCade 内置终端**（xterm.js，最一致）
2. 🥈 **PowerShell (Windows Terminal)** 
3. 🥉 **Git Bash (Mintty)**
4. ⚠️ cmd.exe（仅基础英文支持，中文需 chcp 65001）

---

## 六、分阶段实施路线图

### Phase T0：vendor 基线建立（0.5h）

```
Step 0.0: 复制 CC TUI 源码到 TriMetaverse/reference/claude-code-2.1.88/
Step 0.1: 从 reference 提取 → TriLC/vendor/claude-code-tui/
Step 0.2: TriLC/.gitignore 排除 vendor/（已有规则）
Step 0.3: TriLC/tsconfig.json 新增 paths 别名映射到 vendor
```

门禁：`ls TriLC/vendor/claude-code-tui/ink/ink.tsx` 存在 ✅

### Phase T1：核心渲染 MVP（3-4h）

```
Step 1.1: 建立 src/tui/app.tsx（最小 App 组件）
Step 1.2: 建立 src/tui/api-client.ts（SSE 客户端，POST /chat/completions）
Step 1.3: 建立 src/tui/messages-panel.tsx（消息渲染，基于 vendor Messages/Message）
Step 1.4: 建立 src/tui/input-panel.tsx（输入框，基于 vendor PromptInput/TextInput）
Step 1.5: 建立 src/tui/markdown-renderer.ts（基于 vendor Markdown）
Step 1.6: 扩展 src/cli.ts（添加 `trilc chat` 子命令，启动 TUI）
Step 1.7: 新增 package.json 依赖（react, react-reconciler, marked, chalk）
```

产出物：
- `trilc chat` 命令可用
- 能发送消息 → 看到 SSE 流式响应
- 基础 Markdown 渲染（代码块、粗体、列表）

门禁：发送 "hello" → 收到 AI 回复 → 终端可见 ✅

### Phase T2：体验提升（2-3h）

```
Step 2.1: 虚拟滚动（基于 vendor VirtualMessageList）
Step 2.2: 加载动画（基于 vendor Spinner）
Step 2.3: 历史消息恢复（GET /sessions → 上次对话）
Step 2.4: Ctrl+C 中断、会话持久化
Step 2.5: 纯文本 fallback 模式（--print）
```

门禁：30+ 条消息对话无明显卡顿；`Ctrl+C` 中断后 daemon 状态正常 ✅

### Phase T3：打包与兼容（1-2h）

```
Step 3.1: TriCade MSI 集成（确认 trilc chat 加入 PATH）
Step 3.2: 三终端冒烟测试（PowerShell/cmd/Git Bash）
Step 3.3: Electron 终端（xterm.js）冒烟测试
Step 3.4: 更新 TriLC README 和用户文档
```

门禁：三种 shell 下 `trilc chat` 都能正常启动和对话 ✅

---

## 七、风险与缓解

| 风险 | 严重度 | 缓解 |
|------|--------|------|
| CC Ink 引擎过大（~50 文件），vendor 管理复杂 | 🟡 中 | vendor 冻结不动；只在 `src/tui/` 薄封装；CodeGraph 排除 vendor/ |
| Yoga 原生模块不兼容 TriCade Node.js | 🟡 中 | 先用 `yoga-layout-prebuilt`（纯 JS），vendor 中保留原生绑定供后续优化 |
| PromptInput 耦合 CC 专属逻辑太深 | 🟡 中 | MVP 直接复用 vendor PromptInput 核心 + 替换 CC 特定 hooks 为 noop |
| 已有 `@trimetaverse/agent-core` 与 react 版本冲突 | 🟢 低 | agent-core 不含 React 依赖，无冲突 |
| 总实现时间超预算 | 🟡 中 | 严格 MVP 裁剪；Tier 3 组件全部砍掉；T2 优先虚拟滚动 |
| TriLC 现有 daemon 端口冲突 | 🟢 低 | TUI 连接 `localhost:8711`（已配置），daemon 若未启动则 TUI 提示 `trilc start` |

---

## 八、禁止事项

遵循吸收链规则（`docs/三元宇宙架构与模块说明.md` §2），明确以下红线：

1. ❌ **不得**跳过 reference 直接复制 CC 源码到 vendor
2. ❌ **不得**直接修改 vendor 中的 CC 源码（vendor 是冻结基线）
3. ❌ **不得**在 `TriMetaverse/<Module>/` 下创建 TriLC 相关文件（路径纪律：TriLC 文件在 `../TriLC/`）
4. ❌ **不得**为了"看起来完整"而吸收 CC 全部组件（Tier 3 明确砍掉）
5. ❌ **不得**把 TUI 写成独立模块（归属 TriLC，不创建新模块）
6. ❌ **不得**用 npm `ink` 包替换 CC 自研 Ink（API 不兼容，维护成本翻倍）

---

## 九、决策总结

| 决策项 | 裁决 |
|--------|------|
| 吸收路径 | APPROVE：`reference → vendor → src/tui/` |
| 技术栈 | APPROVE：CC 自研 Ink 引擎（vendor 吸收），不引入 npm ink |
| 集成方式 | APPROVE：HTTP API SSE to `localhost:8711` |
| vendor 冻结范围 | Tier 1（ink 引擎 50 文件）+ Tier 2（15 核心 UI 组件） |
| 砍掉范围 | Tier 3（agents/permissions/settings/IDE/onboarding/feedback 等 30+ 组件） |
| 打包影响 | APPROVE：+3 MB 解压，Node.js ≥20 兼容，无需改 MSI 构建流程 |
| 终端兼容 | APPROVE：PowerShell/Git Bash/Electron 终端均兼容，cmd.exe 需 chcp 65001 |
| Yoga 原生模块 | FREEZE：先用纯 JS 替代，原生绑定保留在 vendor 供后续 |
| 实施阶段 | T0 vendor → T1 MVP (3-4h) → T2 体验 (2-3h) → T3 打包 (1-2h) |

### 总体技术裁决：**APPROVE**

吸收路径可行，技术风险可控。附带条件：
1. 必须先补 `TriMetaverse/reference/claude-code-2.1.88/`（Step 0.0）
2. Yoga 原生模块优先用纯 JS fallback 跑通 MVP
3. cmd.exe 中文支持标记为 known limitation，文档注明推荐使用 PowerShell/Git Bash
4. 总实现时间 (T0+T1+T2+T3) 预算：6.5-9.5h

---

## 十、使用依据

| 依据 | 来源 |
|------|------|
| 吸收链规则 | `docs/三元宇宙架构与模块说明.md` §2 |
| TriLC daemon API | `TriLC/src/server/app.ts`（CTO-008-M 已实现） |
| TriLC↔TriMC 协议 | `docs/engineering/cto-008-M-tri-mc-lc-protocol.md` |
| PC 端打包方案 | `docs/engineering/cto-008-P-pc-electron-packaging.md` |
| TriLC package.json | `TriLC/package.json`（Node.js ≥20.0.0） |
| Claude Code 2.1.88 源码 | `D:\OneDrive\Code\ai\claude-code-2.1.88\source-repo\` |
| 模块架构说明 | `docs/三元宇宙架构与模块说明.md` §4（TriLC 角色定义） |
| CPO+CTO 联审简报 | `docs/workflow/operating-records/2026-W30/trilc-tui-absorb-review-brief.md` |
