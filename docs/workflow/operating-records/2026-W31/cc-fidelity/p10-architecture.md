# P10 CTO 架构评估 -- CC 终端输入层最小移植范围

版本：V1.1 (追加 bridgeMain 双域体系评估)
日期：2026-07-30
作者：CTO 小狄 (ChiefTechnologyOfficer)
父节点：TREE-OP-cc-fidelity-p10 node p10-1
追加触发：CEO 发现 bridgeMain.ts 与 trilc 双域体系高度一致，要求追加移植价值评估

---

## 1. 评估结论摘要

**CC 与 npm ink 在 stdin 读取层采用完全相同的机制：`setRawMode(true)` + `stdin.on('readable')` + `stdin.read()`。**

两者都不使用 `readline.emitKeypressEvents()`，也都没有显式的 IME/composition 事件处理代码。

**真正的差异在输入解析与事件分发层**。移植不需要碰 bridgeMain.ts（全为 IPC/多进程/session 管理，与终端输入无关）。

**最小移植集估算：~600 行新增/替换代码，涉及 3 个核心模块。**

---

## 2. CC 与 npm ink 输入管线对比

### 2.1 stdin 读取层（相同）

```
process.stdin.setRawMode(true)
process.stdin.setEncoding('utf8')
process.stdin.addListener('readable', handleReadable)

handleReadable():
  while (chunk = stdin.read()) !== null:
    dispatch(chunk)
```

两者实现完全一致。`bridgeMain.ts` 不参与 stdin 读取 -- 它是多进程 bridge 的 IPC/会话管理，与键盘输入无关。

### 2.2 解析与分发层（不同）

| 维度 | npm ink (v5.2.0) | CC (2.1.88) |
|---|---|---|
| parse-keypress | 简单正则匹配，无状态机 | tokenize.ts 状态机 + parse-keypress.ts |
| 跨 chunk 边界处理 | 不支持 (ESC 序列跨 chunk 会断裂) | 支持 (tokenizer 内部缓冲 incomplete 序列) |
| 不完整序列超时刷新 | 无 | 50ms normal / 500ms paste |
| 事件负载 | 原始 string chunk | InputEvent 对象 (预解析 key + sequence + raw) |
| bracketed paste | 不启用 | 启用 (EBP/DBP) |
| extended key protocol | 不启用 | 启用 (kitty + modifyOtherKeys) |
| Ctrl+C 拦截位置 | App.handleInput (ESC/Tab 也在 App 层处理) | processKeysInBatch (App.handleInput 仅处理 Ctrl+C) |
| Error 恢复 | 无 | 重新挂载 readable listener |
| stdin 长时间静默检测 | 无 | 5s gap → re-assert terminal modes |

### 2.3 bridgeMain.ts 核查结果

全文 2999 行，全部为 IPC 通信、多进程 session 管理、token 刷新、worktree 维护、heartbeat、at-capacity 排队逻辑。**与键盘输入/IME 零相关，完全不需要移植。**

---

## 3. IME 问题根因分析

### 3.1 直接假设对证

任务描述称"npm ink 的 `useInput` + `setRawMode` 导致 Windows IME 不工作"。经源码对读，发现：

1. **npm ink 并不使用 `readline.emitKeypressEvents`** -- 它走的是和 CC 完全相同的 `setRawMode(true)` + `stdin.on('readable')` + `stdin.read()` 路径。
2. 两者都没有显式的 IME/composition 处理代码。
3. `bridgeMain.ts` 与 IME 无关。

### 3.2 实际差异因素（按可能性排序）

**因素 A（高概率）：parse-keypress 的错误处理**

npm ink 的 `handleInput` 在 App.js 中处理 ESC/Tab/ShiftTab **在** `emit('input')` 之前。如果 IME 在 composition 期间产生被 npm ink 误判为 ESC 或 Tab 的字节，这些字节会被 App.handleInput 消费掉而不到达 useInput 回调。

CC 的 `processKeysInBatch` 将终端响应、mouse、focus、Ctrl+Z 在 App 层路由后，其余所有 key 事件都通过 `emit('input', InputEvent)` 分发 -- App 的 `handleInput` 只处理 Ctrl+C，不会拦截 ESC/Tab。

**因素 B（中概率）：不完整 ESC 序列无超时刷新**

npm ink 的 parseKeypress 每次对单个 chunk 调用。如果一个 IME 产生的多字节序列恰好跨越了两次 `stdin.read()` 的边界（极罕见但可能），npm ink 会将其断裂为两个独立 chunk 分别解析，产物可能异常。CC 的 tokenizer 保持状态机跨 chunk，50ms 超时后才将 incomplete 序列 flush。

**因素 C（中概率）：bracketed paste 模式缺失**

CC 启用 bracketed paste 模式，终端在 paste 时用 `\x1b[200~...\x1b[201~` 包裹内容。在 Windows Terminal 上，这可能也会影响 IME 输入如何被交付到应用程序。npm ink 未启用此模式。

**因素 D（低概率）：extended key protocol 缺失**

CC 启用 kitty keyboard protocol + modifyOtherKeys，改变了终端传递 key events 的编码方式。在不启用时，某些修饰键组合（如 Ctrl+Shift+letter）可能与 IME 的 key event 产生冲突。

### 3.3 结论

根本原因最可能是**因素 A**（npm ink 的 App.handleInput 过于激进地拦截 ESC/Tab），其次可能涉及因素 B（跨 chunk 解析）。完整的 CC parse-keypress 管线替换可以解决这些。

---

## 4. 最小移植集

### 4.1 必须移植的文件（新增/替换）

```
# ── 核心：替换 npm ink 的 parseKeypress ──
termio/tokenize.ts    (~200 行)  # ★ CC 的状态机 tokenizer，跨 chunk 保持状态
termio/ansi.ts        (~60 行)   # ESC 序列字节分类 (isEscFinal 等，tokenize 依赖)
termio/csi.ts         (~90 行)   # CSI 序列字节分类 + PASTE_START/END 常量

# ── 解析：替换 npm ink 的 parse-keypress ──
parse-keypress.ts     (~800 行)  # ★ CC 的增强解析器：Kitty/modifyOtherKeys/SGR mouse/DA1响应/轮子事件/X10鼠标/bracketed paste

# ── 事件：替换 npm ink 的 input event ──
events/input-event.ts (~100 行)  # InputEvent + Key 类型 (预解析 key 结构)
events/emitter.ts     (~30 行)   # CC 的 StrictEventEmitter (比 node EventEmitter 多类型安全)

# ── App 适配 (部分替换/增强) ──
App.tsx adapter       (~150 行)  # ★ 不搬 CC 的 App.tsx 全量，只将 handleReadable/processInput/flushIncomplete/processKeysInBatch 逻辑合并进 trilc 现有的 render.tsx + app.tsx
```

**总代码量估算：~600 行新增/替换代码。**

### 4.2 确定不移植的文件及原因

| 文件/模块 | 原因 |
|---|---|
| `bridge/bridgeMain.ts` (2999行) | IPC、多进程、session 管理，与输入无关 |
| `App.tsx` 的 mouse/selection 处理 (200+行) | trilc 不需要鼠标交互 |
| `App.tsx` 的 TerminalQuerier 路由 (30行) | trilc 不查询终端能力 |
| `App.tsx` 的 hyperlink/open 逻辑 (40行) | trilc 无终端 hyperlink 点击需求 |
| `App.tsx` 的 DOM dispatch (keyboardEvent) | trilc 用 hooks 不是 DOM 树 |
| `App.tsx` 的 SUSPEND (Ctrl+Z) 逻辑 | Windows 不支持 SIGSTOP |
| `App.tsx` 的 ClockProvider/CursorDeclarationContext | trilc 用 useInterval 替代 |
| `App.tsx` 的 bracketed paste (EBP/DBP) | trilc 内部用 \n→空格 替换，不需要 paste 边界检测 |
| `terminal-querier.ts` | trilc 不查询终端能力 |
| `selection.ts`, `terminal-focus-state.ts` | trilc 无文本选择 |
| kitty/modifyOtherKeys extend key | 可能引起副作用，先不启用 |
| `earlyInput.ts` | trilc 不需要早期输入捕获（无多进程 bridge） |

---

## 5. 适配方案

### 5.1 架构变更

**现状（使用 npm ink）**：

```
render.tsx (npm ink render)
  └→ npm ink App.js
       └→ handleReadable() → handleInput() → emit('input', rawChunk)
            └→ npm ink use-input.js
                 └→ parseKeypress(rawChunk) → inputHandler(input, key)
```

**目标（移植后）**：

```
render.tsx (自研 render + 摘抄自 CC 的输入管线)
  └→ InputPipeline (摘抄自 CC App.tsx 的 stdin 管理)
       └→ handleReadable() → processInput() → parseMultipleKeypresses()
            └→ emit('input', InputEvent)
                 └→ 自研 useInput adapter
                      └→ inputHandler(input, key, event)
```

### 5.2 具体变更点

#### A. `render.tsx` -- 替换 npm `ink` 的 App 为自研输入管线

当前 `render.tsx`:

```typescript
import { render } from 'ink';  // npm ink
// ...
const { unmount, waitUntilExit: inkWait } = render(
  React.createElement(ThemeProvider, null, React.createElement(App, {...})),
  { exitOnCtrlC: false, patchConsole: true }
);
```

改为使用 trilc 已有的 `vendor/ink/root.ts` 的 `createRoot`（即 CC 的 render 引擎去掉 ThemeProvider 包裹），但输入管线不再依赖 npm ink 的 App.js 和 parseKeypress。

**关键变化**：在 `createRoot` 创建的实例上，将 CC 的 `handleReadable` / `processInput` / `flushIncomplete` 逻辑作为独立模块 (`InputPipeline`) 注入，替代 npm ink App.js 中的 stdin 处理。

#### B. `useCursorInput.ts` -- 适配 CC 的 InputEvent 类型

当前 trilc 的 `useCursorInput` 使用 npm ink 的 `useInput`:

```typescript
import { useInput } from 'ink';

useInput((inputChar, key) => {
  // key 类型: ink 的 Key (简单对象)
  // inputChar 类型: string
  ...
});
```

CC 的 `useInput` 传入的是 `InputEvent` 对象，其中 `input` 和 `key` 都已预解析。适配方式：

```typescript
// 新增 trilc 自己的 useInput adapter
import { useInput } from '../ink-cc/hooks/use-input.js';  // CC 移植版

useInput((inputChar, key, event) => {
  // key 类型: CC 的 Key (包含 name, ctrl, meta, shift, super, fn, option, sequence, raw)
  // inputChar 类型: string (与 npm ink 兼容)
  // event 类型: InputEvent (可访问 raw, isPasted 等)
  ...
});
```

CC 的 `Key` 类型与 npm ink 的 `Key` 类型字段几乎一致，但增加了：
- `fn` (是否为功能键)
- `super` (Super/Win/Cmd 修饰键)
- `option` (Alt/Option 修饰键，与 meta 独立)
- `isPasted` (是否来自粘贴)

现有的 `useCursorInput` 中的 `keyEx` cast 可以保留兼容。

#### C. `parse-keypress.ts` -- 直接使用 CC 版本

CC 的 `parse-keypress.ts` 需要：
- `termio/tokenize.ts` (tokenizer 状态机)
- `termio/csi.ts` 中的 `PASTE_START`/`PASTE_END` 常量
- `termio/ansi.ts` 中的 `C0`/`ESC_TYPE`/`isEscFinal` 辅助函数

这些文件从 CC 源码直接复制，修改 import 路径为本地相对路径即可。**不需要 shim**（均无 CC 专属依赖）。

#### D. `events/input-event.ts` + `events/emitter.ts` -- 轻量增强

CC 的 `InputEvent` 包装了预解析的 `Key` 对象：

```typescript
export class InputEvent extends Event<'input'> {
  readonly input: string;
  readonly key: Key;
  readonly isPasted: boolean;
  constructor(key: ParsedKey) { ... }
}
```

替换 npm ink 的简单 string emit 为 `InputEvent` 对象 emit。

### 5.3 不替换的部分（保持 npm ink 现有逻辑）

- **npm ink 组件**：`Box`, `Text`, `Newline`, `Spacer` -- 不更换，npm ink 的渲染组件正常工作
- **npm ink hooks**：`useStdin`, `useApp` -- 不更换
- **npm ink 的 `measureElement`**, `wrapText` 等工具 -- 不更换
- **npm ink 的 reconcile/render 管线** -- 不更换

**仅替换 stdin 输入解析 + 事件分发管线。**

---

## 6. 实现顺序与门禁

### Phase A：核心移植（阻塞项）

```
A.1  从 CC 复制 termio/tokenize.ts, termio/ansi.ts, termio/csi.ts
      到 trilc/src/tui/ink-cc/termio/  (修改 import 为本地路径)
A.2  从 CC 复制 parse-keypress.ts 到 trilc/src/tui/ink-cc/
      (修改 import 路径，删除 parseMouseEvent 导出 -- trilc 不需要)
A.3  从 CC 复制 events/input-event.ts, events/emitter.ts
      到 trilc/src/tui/ink-cc/events/
A.4  从 CC 适配 CC 的 use-input.ts → trilc/src/tui/ink-cc/hooks/use-input.ts
      (修改 import 路径：StdinContext → 本地 shim, useEventCallback → react useCallback)
```

**门禁**：`tsc --noEmit` 零错误 + 单元测试：`parseMultipleKeypresses()` 正确解析已知输入序列

### Phase B：集成适配

```
B.1  创建 trilc/src/tui/input-pipeline.ts
      摘抄 CC App.tsx 的 handleReadable + processInput + flushIncomplete + processKeysInBatch
      去掉：鼠标、hyperlinks、terminal querier、focus events、SUSPEND、DOM dispatch
      保留：stdin resume 检测、error recovery、key 批量处理
B.2  修改 render.tsx：替换 npm ink render 的 stdin 管理为 InputPipeline
B.3  修改 useCursorInput.ts：从 npm ink useInput 切换到 CC useInput
      验证：key 的 ctrl/meta/shift 字段语义一致
B.4  修改 InteractionPrompt.tsx 中的 useInput：同步切换到 CC 版本
      验证：上下箭头/数字选择/Esc 取消行为不变
```

**门禁**：端到端回归：backspace、Ctrl+A/E/K/U/W、Ctrl+Y (yank)、Alt+Y (yank-pop)、中文输入、粘贴截断 -- 全部通过

### Phase C：IME 验证

```
C.1  Windows Terminal 上测试 Microsoft Pinyin IME
     场景：输入中文 "你好" → 候选窗正常弹出 → 确认后字符正确插入
C.2  Windows Terminal 上测试 Microsoft Japanese IME
     场景：平假名/片假名输入正常
C.3  PowerShell (conhost) 上测试 IME
C.4  纯英文输入回归（确保 IME 关闭时行为不变）
```

**门禁**：两款 IME 在两种终端环境下候选窗弹出正常、字符正确插入

---

## 7. 风险与缓解

### 风险 1：parse-keypress 移植后 key 语义不兼容 (MEDIUM)

- **描述**：CC 的 `Key` 类型中 `meta` 和 `option` 是独立的（npm ink 合并在 `meta` 中），`super` 是新增的。可能 break 现有的 key 条件判断。
- **缓解**：在 adapter 层做字段映射，保持 npm ink 的 `Key` 语义
- **验证**：Phase B.3 回归测试

### 风险 2：tokenizer 状态机泄漏 (LOW)

- **描述**：CC 的 tokenizer 保持跨 chunk 状态，如果输入管线被销毁后 recreate，旧状态可能泄漏到新实例
- **缓解**：`createTokenizer()` 每次创建新实例；`InputPipeline` 在 unmount 时调用 `tokenizer.reset()`
- **备选**：如果不启用 bracketed paste，tokenizer 状态更简单，风险约等于零

### 风险 3：bracketed paste 与现有 paste 处理冲突 (LOW)

- **描述**：如果移植后启用 EBP（bracketed paste 模式），paste 内容会被 `\x1b[200~...\x1b[201~` 包裹，trilc 现有的 `useCursorInput` 中的 paste truncation 逻辑可能重复处理
- **缓解**：最小移植集中**不启用 EBP**（tokenizer 的 paste 路径也不用）。paste 截断保持在 `useCursorInput` 层完成
- **验证**：Phase B.4 粘贴测试

### 风险 4：CC 的 App 逻辑纠缠过深 (LOW)

- **描述**：CC 的 `App.tsx` 中 stdin 读取、mouse、selection、hyperlinks、DOM dispatch 等逻辑紧密耦合
- **缓解**：只摘抄 `handleReadable` + `processInput` + `flushIncomplete` + `processKeysInBatch` 的独立逻辑。这些方法不依赖 App 的 state/props（除了 `stdin` 和 `stdout` 的写入权），可以干净地提取
- **实际代码耦合度核查**：
  - `handleReadable` 依赖：`this.props.onStdinResume()` (可选), `this.props.stdin.read()`, `this.processInput()`
  - `processInput` 依赖：`this.keyParseState`, `parseMultipleKeypresses()`, `reconciler.discreteUpdates()`, `processKeysInBatch()`
  - `processKeysInBatch` 依赖：`app.handleInput()`, `app.internal_eventEmitter`, `app.querier`(可删), `app.props.dispatchKeyboardEvent`(可删), mouse/selection 逻辑(可删)
  - **简化后核心依赖仅为**：stdin, stdout(写), EventEmitter, reconcile/discreteUpdates

---

## 8. 工作量评估

| 项 | 代码量 | 难度 | 预计时间 |
|---|---|---|---|
| A.1-A.3 核心文件复制+import修正 | ~1100 行复制，~20 行修改 | LOW | 30min |
| A.4 CC use-input adapter | ~90 行 | LOW | 20min |
| B.1 InputPipeline 摘抄 | ~150 行 | MEDIUM | 1h |
| B.2 render.tsx 对接 | ~30 行修改 | MEDIUM | 30min |
| B.3 useCursorInput 适配 | ~20 行修改 | LOW | 20min |
| B.4 InteractionPrompt 适配 | ~10 行修改 | LOW | 10min |
| C.1-C.4 IME 验证 | - | MEDIUM | 45min |
| **合计** | **~600 行新增 + ~1400 行复制** | **MEDIUM** | **~3.5h** |

---

## 9. 发布姿态

### 验收条件
- [ ] `tsc --noEmit` 零错误
- [ ] 现有输入回归：backspace、Ctrl+A/E/K/U/W、Ctrl+Y、Alt+Y、上/下箭头历史、Enter 提交、Shift+Enter 换行
- [ ] 中文输入：在 Windows Terminal 中启用 IME，候选窗正常弹出，确认后字符正确输入
- [ ] 日文输入：同中文测试
- [ ] 粘贴截断：>10K chars 粘贴行为不变
- [ ] 无副作用：`trilc chat` 启动/退出行为不变

### 回滚姿态
- `InputPipeline` 作为独立模块，可在 `render.tsx` 中通过一个 flag 切换回 npm ink 管线
- 如果移植后出现严重问题，回退到 npm ink 的 `render()` 调用即可 -- 改动范围局限在 `render.tsx` + `useCursorInput.ts`

### 不做的
- 不移植 CC 的 mouse/selection/hyperlink 逻辑
- 不移植 CC 的 terminal querier
- 不移植 CC 的 DOM keyboard dispatch
- 不启用 kitty keyboard protocol / modifyOtherKeys（先观察是否需要）
- 不启用 bracketed paste mode（paste 截断留在 useCursorInput 层）
- 不移植 `earlyInput.ts`（trilc 无多进程 bridge）

---

## 10. 使用依据

| 依据 | 路径 |
|---|---|
| CC App.tsx (stdin 处理, 658行) | `TriLC/vendor/claude-code-full/src/ink/components/App.tsx` |
| CC parse-keypress.ts (输入解析, 802行) | `TriLC/vendor/claude-code-full/src/ink/parse-keypress.ts` |
| CC tokenize.ts (tokenizer, ~200行) | `TriLC/vendor/claude-code-full/src/ink/termio/tokenize.ts` |
| CC use-input.ts | `TriLC/vendor/claude-code-full/src/ink/hooks/use-input.ts` |
| CC input-event.ts | `TriLC/vendor/claude-code-full/src/ink/events/input-event.ts` |
| CC bridgeMain.ts (确认无关, 2999行) | `TriLC/vendor/claude-code-full/src/bridge/bridgeMain.ts` |
| npm ink App.js (对比基准) | `TriLC/node_modules/ink/build/components/App.js` |
| npm ink use-input.js (对比基准) | `TriLC/node_modules/ink/build/hooks/use-input.js` |
| trilc render.tsx (适配点) | `TriLC/src/tui/render.tsx` |
| trilc useCursorInput.ts (适配点) | `TriLC/src/tui/hooks/useCursorInput.ts` |
| trilc InteractionPrompt.tsx (适配点) | `TriLC/src/tui/components/InteractionPrompt.tsx` |
| trilc tech-design.md (TUI架构) | `TriLC/src/tui/tech-design.md` |
| tree-op-p10.json | `TriMetaverse/docs/workflow/operating-records/2026-W31/cc-fidelity/tree-op-p10.json` |
| Code Registry | `TriLC/docs/registry/code-state.md` |

---

## 11. bridgeMain.ts 对 trilc 双域体系的移植价值评估 (V1.1 追加)

CEO 在审阅 P10 评估时指出 bridgeMain.ts 的架构与 trilc 双域体系高度一致：**bridgeMain 将本地机器注册为可被云端调度的远程执行节点（挂机等派活 -> 接活拉子进程干），这与 trilc 的服务域（TriMC k8s 主控/Worker）+ 本地域（TriLC 开钱包后节点化）定位重叠。** 以下为系统评估。

### 11.1 架构对照

| 概念 | bridgeMain.ts (CC) | trilc 双域体系 | 重叠度 |
|---|---|---|---|
| **云端控制平面** | Anthropic API (claude.ai) -- 调度环境、下发工作、接收结果 | TriMC (k8s 主控) -- 服务域编排与路由 | **100% 概念重叠** |
| **本地执行节点** | CC CLI running `bridgeMain` -- 注册 environment、poll 工作、spawn 子进程 | TriLC daemon -- 本地域节点生命周期与能力执行 | **100% 概念重叠** |
| **节点注册** | `registerBridgeEnvironment()` -- 将本地机器报告给云端 | TriLC local-node 心跳 + TriMC ConnectionManager | **~80%** -- trilc 有本地心跳但缺云端注册 API |
| **工作拉取** | `pollForWork()` -- 长轮询 / 间歇轮询，处理 capacity 上限 | **当前缺失** -- trilc 无云端向本地反向调度工作的通道 | **GAP** -- bridgeMain 可直接填补 |
| **Session/工作单元** | `Session` -- 隔离的子进程，有独立的 working dir、SDK URL、token | `SessionStore` -- trilc 已有 SQLite session 持久化，`sync_status` 状态机 | **~60%** -- trilc 有会话存储但缺云端下发的工作生命周期 |
| **子进程 spoiler** | `createSessionSpawner()` -- `spawn()` child process with `--sdk-url --session-id` | **当前缺失** -- trilc 的 agentLoop 是同进程的，没有独立子进程隔离 | **GAP** -- bridgeMain 提供完整的子进程模板 |
| **隔离模式** | `same-dir` vs `worktree` -- 共享目录 vs git worktree 隔离 | trilc 当前单进程单目录，无工作隔离需求 | **P2+** -- 当前非 MVP 必需 |
| **心跳/租约** | `heartbeatWork()` -- JWEB 认证的心跳延长工作租约 | trilc 有通用 ConnectionManager 心跳，但缺 per-work JWT 租约机制 | **~50%** -- trilc 有基础心跳，缺 work-level 租约 |
| **token 刷新** | `createTokenRefreshScheduler()` -- 5min 提前刷新 JWT/OAuth | trilc 的 `key-cache.ts` -- 15min 定时刷新 Provider Key | **~60%** -- 概念相同，token 类型不同 |
| **推后重试** | `BackoffConfig` -- 连接/一般错误独立 backoff，10min give-up | 可从 Openclaw 吸收的 `Backoff` 模块复用 | **~70%** -- 退避逻辑概念相同 |
| **崩溃恢复** | `bridgePointer.json` -- 单 session 模式下写指针文件，--continue 恢复 | **当前缺失** | **P2** -- 后续可考虑 |
| **Headless 模式** | `runBridgeHeadless()` -- daemon worker 线性子集，由 supervisor 管理，通过 IPC 接收配置 | trilc daemon 的 `install-service` -- Windows Service 管理，通过 CLI 接收命令 | **90% 概念重叠** |
| **双协议支持** | v1 (Session-Ingress WebSocket) + v2 (CCR /v1/code/sessions/{id}) | trilc 的 `/chat/completions` (OpenAI SSE) + `/v1/messages` (Anthropic API) | **~40%** -- 协议不同但路由概念相同 |

### 11.2 关键 Gap 清单

trilc 当前双域体系的**三个结构性缺失**，bridgeMain.ts 恰好全部覆盖：

#### GAP-1：云端到本地的反向调度通道 (CRITICAL)

- **现状**：trilc 只能从本地向 TriMC 推数据（`/chat/completions`、mirror 模块）。TriMC 不能主动向 trilc 下派工作（比如手机端发起的代码审查任务、云端定时触发的自动化任务）。
- **bridgeMain 方案**：`pollForWork()` -- 长轮询/间歇轮询，`acknowledgeWork()` 确认接收，`stopWork()` + `stopWorkWithRetry()` 优雅结束。完整的从拉取工作到确认完成的生命周期。
- **移植路径**：将 `pollForWork` 的 API 端点从 Anthropic 的 `/v1/environments/{id}/work` 替换为 TriMC 的对应端点。

#### GAP-2：工作隔离的子进程生命周期 (CRITICAL)

- **现状**：trilc 的所有任务执行都在主进程内完成。无法做工作级别的隔离（不同 session 不能并发、不能在不同目录执行、不能限制资源）。
- **bridgeMain 方案**：`createSessionSpawner()` -- spawn 子进程 + SDK URL 接入 + `--print` 模式 + NDJSON stdout 解析 activity + `onSessionDone` 完成回调。`safeSpawn()` 包含完整的错误处理和 cleanup。
- **移植路径**：`sessionRunner.ts` (300行) 可直接移植，只需替换 `sdkUrl` 的目标地址。

#### GAP-3：容量感知的并发控制 (MEDIUM)

- **现状**：trilc 无最大并发 session 限制。
- **bridgeMain 方案**：`activeSessions.size >= config.maxSessions` 检查 + `capacityWake` 信号唤醒机制 + `HeartbeatMode`（满容量时不 poll 新工作但保持心跳）+ GrowthBook 动态配置轮询间隔。
- **移植路径**：`capacityWake.ts` (57行) 可直接移植；capacity 检查逻辑是纯整数比较，可摘抄。

### 11.3 最小移植集（bridgeMain 双域版本）

| 优先级 | 模块 | 源文件 | 行数 | 移植方式 | 适配点 |
|---|---|---|---|---|---|
| **P0** | Session Spawner | `sessionRunner.ts` | ~400行 | **直接复制** + 替换 sdkUrl | 替换 `--sdk-url` 为 trilc 自己的 SSE/API 端点 |
| **P0** | Types & Interfaces | `types.ts` | ~260行 | **直接复制** + 裁剪 | 删除 `BridgeWorkerType`，改为 trilc 自己的 worker_type |
| **P0** | Capacity Wake | `capacityWake.ts` | 57行 | **直接复制** | 无适配，纯通用逻辑 |
| **P0** | Poll Loop Core | `runBridgeLoop()` from `bridgeMain.ts` | ~400行摘抄 | **摘抄精简** | 替换 `api.pollForWork` / `ackWork` / `stopWork` 的实际 API 调用 |
| **P1** | Headless Bridge | `runBridgeHeadless()` from `bridgeMain.ts` | ~160行 | **摘抄精简** | 连接到 trilc daemon 的 lifecycle 管理 |
| **P1** | Generic Backoff | `addJitter()` / `BackoffConfig` logic | ~80行摘抄 | **摘抄** | trilc 可以复用 Openclaw 吸收的 Backoff 模块 |
| **P2** | Worktree Isolation | `createAgentWorktree()` / `removeAgentWorktree()` | ~50行调用 | **引入调用** | 依赖 CC 的 `utils/worktree.js`，需适配 |
| **P2** | Bridge Pointer | `bridgePointer.ts` | ~150行 | **引入** | Crash recovery 机制，读写 JSON 指针文件 |
| **SKIP** | Interactive TUI Logger | `bridgeUI.ts` | 大量 | **不移植** | trilc 有自己的 TUI 渲染 pipeline |
| **SKIP** | Anthropic API Client | `bridgeApi.ts` | 大量 | **不移植** | trilc 用 TriMC 自己的 API |
| **SKIP** | OAuth/Token 管理 | `bridgeConfig.ts` / `jwtUtils.ts` / `trustedDevice.ts` | 大量 | **不移植** | trilc 有自己的 key-cache + TriModel auth |
| **SKIP** | QR Code / stdin 交互 | bridgeMain's `onStdinData` handler | ~30行 | **不移植** | trilc 的 TUI 有更完整的输入处理 |

**总代码量估算**：~1,360 行可直接复制（sessionRunner + types + capacityWake + bridgeHeadless），~480 行摘抄简化（poll loop core + backoff），~200 行需要适配修改。合计 **~2,000 行，P0 部分约 1,100 行。**

### 11.4 与 P10 终端输入层移植的关系

P10（终端输入层移植）和 bridgeMain 双域移植是**可独立交付的两个工作流**，共享底层基础设施但无代码耦合：

| 维度 | P10 (终端输入层) | bridgeMain (双域桥接) |
|---|---|---|
| **作用层** | L0: 用户键盘 -> TUI 文本输入 | L2: 云端调度 -> 本地子进程执行 |
| **与用户的交互** | 直接（键盘事件） | 间接（通过远程 web/移动端触发） |
| **进程模型** | 主进程内，React 组件管线 | 子进程 spawn/管理，独立 PID |
| **共享点** | 都使用 `process.stdin` (但 P10 用 readable 模式解析按键，bridgeMain 用 data 模式监听切换键) | |
| **可独立交付?** | **是** -- P10 不依赖 bridgeMain 任何代码 | **是** -- bridgeMain 不依赖 P10 的 parse-keypress/IME 修复 |
| **建议优先级** | P10 先做（修复用户体验立即可感知的 IME bug） | bridgeMain 并行启动架构评估和 API 规划 |

**共享的底层模块**（两个工作流都会使用但各自独立）：
- `sessionRunner.ts` 的 `createSessionSpawner()`：P10 修复后 trilc 的 TUI 会在主进程中运行，而 bridgeMain 移植后 trilc 能从云端 spawn 独立的子进程 session。两者通过**同一个 spawner 接口**但**不同的实例**运行。
- `parse-keypress.ts` + `tokenize.ts`：P10 修复了 TUI 内的输入解析，bridgeMain 的头模式（`runBridgeHeadless`）不需要任何终端输入处理。

**实际协同**：如果 bridgeMain 移植后 trilc daemon 跑 `runBridgeHeadless` 模式，云端下发的 session 子进程会以 `--print` 模式运行（纯 stdout 输出 NDJSON），不需要 TUI 输入层。P10 的终端输入层修复只影响用户直接通过 `trilc chat` 本地交互时的体验。两者互不阻塞。

### 11.5 架构风险

#### 风险 1：远程执行权限边界 (HIGH)

- **描述**：bridgeMain 模式下，云端可让本地节点执行任意 CLI 命令（子进程 spawn claude CLI with arbitrary tool calls）。TrilLC 当前没有 per-session permission scope 的概念。
- **影响面**：如果被恶意的云端 work payload 利用，攻击者可控制本地文件系统。
- **缓解**：
  - P0 不启用 bridgeMain 模式对外网暴露（仅 127.0.0.1 loopback 通信）
  - 移植时增加 `--permission-mode` scope 检查
  - TrilLC 已有 `install-service` 权限检测骨架，可复用
  - 子进程 sandbox 模式（`sandbox: true` flag）

#### 风险 2：多进程安全与 zombie 防护 (MEDIUM)

- **描述**：子进程 spawn 后需要可靠的 kill + cleanup。bridgeMain 的 `SessionHandle.kill()` + `forceKill()` (SIGKILL fallback) + `onSessionDone` 的 cleanup 链（stopWork + archiveSession + worktree removal）是完整的。但在 Windows 上，`kill()` 使用的 `process.kill(pid, 'SIGTERM')` 不存在，需要改用 `taskkill /PID`。
- **缓解**：
  - 使用 CC 已有的 `safeSpawn()` 错误处理模式
  - Windows 兼容性：子进程管理需要 `taskkill` fallback（在 `sessionRunner.ts` 的 Windows 适配中补齐）
  - TrilLC 已有的 `local-node` 生命周期管理经验可直接复用

#### 风险 3：一致性平面复杂度 (MEDIUM)

- **描述**：TrilLC 有三条数据流： (1) 本地 TUI 用户输入直接通过 agentLoop (2) HTTP API 调用通过 `/chat/completions` (3) bridgeMain 移植后云端下发的 session 子进程。三条路径共享同一个 TriMC 后端，但 session 隔离策略不同（本地 TUI 无隔离，bridgeMain 子进程有工作目录隔离）。
- **缓解**：
  - TrilLC 已有的 `session-store.ts` 的 `sync_status` 状态机可以从 `{local, pending, syncing, synced}` 扩展为 `{local, pending, syncing, synced, remote}`，统一管理三条路径
  - BridgeMain 的 session 使用独立的 `--session-id` 命名空间，通过 SessionStore 的 `cloud_session_id` 字段关联

#### 风险 4：bridgeMain 与 Anthropic API 的脱耦复杂度 (MEDIUM)

- **描述**：bridgeMain.ts 虽然架构清晰，但 `bridgeApi.ts`（Anthropic API client）、`bridgeConfig.ts`（OAuth/bridge 配置）、`jwtUtils.ts`（JWT token 刷新）、`trustedDevice.ts`（设备信任）等多个模块与 CC 的认证基础设施深度耦合。
- **缓解**：
  - 最小移植集中在 `runBridgeLoop()` 的逻辑摘抄上，它通过接口 `BridgeApiClient` 依赖 API 实现 -- `BridgeApiClient` 是一个接口，可以完全替换为 trilc 的实现
  - 不在 P0 移植 `bridgeApi.ts`，只在 trilc 侧实现自己的 `BridgeApiClient`（使用 TriMC REST API）
  - `sessionRunner.ts` 的 `spawn()` 方法是纯 Node.js `child_process.spawn()`，无 API 耦合

### 11.6 建议实施顺序

```
Phase 1: Session Spawner 吸收（与 P10 并行，互不阻塞）
  P1.1  复制 sessionRunner.ts → trilc/src/node/session-srunner.ts
  P1.2  复制 types.ts (裁剪) → trilc/src/node/session-types.ts
  P1.3  复制 capacityWake.ts → trilc/src/node/capacity-wake.ts
  P1.4  单元测试：spawn child node echo / timeout kill / cleanup
  门禁：spawn + kill 回路正常

Phase 2: Poll Loop 核心摘抄
  P2.1  摘抄 runBridgeLoop() 核心逻辑 → trilc/src/node/poll-loop.ts
  P2.2  实现 trilc 的 BridgeApiClient（调用 TriMC REST API）
  P2.3  集成到 trilc daemon lifecycle
  门禁：register → poll → ack → spawn → session→done→stopWork→archive 全链路通过

Phase 3: Headless Bridge 适配
  P3.1  摘抄 runBridgeHeadless() → trilc/src/node/headless-bridge.ts
  P3.2  对接 trilc daemon 的 service lifecycle
  P3.3  E2E：云端向本地节点下发工作，节点 spawn 子进程执行并回报结果
  门禁：triMC -> trilc 异步调度闭环可用

Phase 4: 安全加固
  P4.1  per-session permission scope
  P4.2  Windows 子进程管理兼容
  P4.3  session 隔离策略 (same-dir / worktree MVP 只需 same-dir)
```

### 11.7 使用依据（bridgeMain 双域评估）

| 依据 | 路径 |
|---|---|
| bridgeMain.ts (2999行) | `TriLC/vendor/claude-code-full/src/bridge/bridgeMain.ts` |
| bridgeMain types.ts (263行) | `TriLC/vendor/claude-code-full/src/bridge/types.ts` |
| sessionRunner.ts (~400行) | `TriLC/vendor/claude-code-full/src/bridge/sessionRunner.ts` |
| capacityWake.ts (57行) | `TriLC/vendor/claude-code-full/src/bridge/capacityWake.ts` |
| trilc Code State (双域骨架) | `TriLC/docs/registry/code-state.md` |
| trilc DESIGN (本地域控制器) | `TriLC/docs/engineering/DESIGN.md` |
| trilc session-store (sync_status) | `TriLC/src/session-store/store.ts` |
| trilc local-node (心跳+生命周期) | `TriLC/src/local-node/` |
| TrilCompany Entry Routing (双域路由) | `TriCompany/docs/engineering/entry-routing-layer-design.md` |
| TrilCompany product-state (双域+Host切换) | `TriCompany/docs/registry/product-state.md` |
| TrilCompany code-state (TriLC 节点定位) | `TriCompany/docs/registry/code-state.md` |
