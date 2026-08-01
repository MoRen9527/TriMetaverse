# CEO 实测回归诊断 → CTO 路由

**日期**: 2026-07-28  
**发件**: CEOChiefOfStaff(小贾)  
**收件**: ChiefTechnologyOfficer(小狄)  
**触发**: CEO Yuanjun 实测 TriCade 0.4.0，发现 4 项阻塞可用性回归  
**优先级**: P0 — 阻塞 TriCade 0.4.0 基本可用性，先于 P0 移植主线修复  
**关联**: W31 OP-202607-W31-001 §3.1、W31 tree-op trilc-cc-transplant

---

## 一、问题清单

### REGR-008：工具调用无人话描述

**现象**：工具调用只显示 `● Read D:/path/to/file`，看不出"正在做什么"。

**CC 行为**：CC 在 tool_use 渲染时从 tool definition 取 `description` 字段，展示为人话动作描述（如"正在读取文件…""正在搜索…""正在执行命令…"），而非裸工具名。

**当前代码定位**：
- `TriLC/src/tui/components/ToolCallLine.tsx` — `extractArgs()` 只提取 file_path/command/pattern 裸参数
- `TriLC/src/tui/app.tsx` line 31-34 — MessageLine 直接传 `tc.name` 给 ToolCallLine

**修复方向**：
- 增加 `toolName → 人话描述` 映射层（Read→"读取文件"，Write→"写入文件"，Edit→"编辑文件"，Bash→"执行命令"，Grep→"搜索内容"，Glob→"查找文件"）
- 参数融入描述（如 `读取文件 D:/path/to/file…`）

---

### REGR-009：删除键 + 光标不可用

**现象**：Backspace/Delete 按键无反应或反应异常；`█` 光标字符不可见或无法移动位置。

**当前代码定位**：
- `TriLC/src/tui/hooks/useCursorInput.ts` line 138-155 — backspace/delete 处理逻辑（代码层面正确，但可能未触发重绘）
- `TriLC/src/tui/utils/Cursor.ts` line 236-241 — `backspace()`/`del()` 实现（逻辑正确）
- `TriLC/src/tui/app.tsx` line 116-130 — `renderInputBox()` **是普通函数，不是 React 组件**

**可疑根因（按可能性排序）**：

1. **`renderInputBox()` 函数→组件问题**（高可能）：Ink reconciler 对普通函数调用可能不做依赖追踪。当 `useCursorInput` 的 state 更新后，`renderInputBox()` 虽然被重新调用，但 Ink 可能判定返回的虚拟 DOM 无变化（因为 Box/Text 结构相同），跳过终端输出更新。

2. **`MeasuredText` 对象缓存**（中可能）：`Cursor.fromText()` 每次创建新 `MeasuredText`，但如果 `MeasuredText` 内部对相同文本做了实例缓存，外层 `Cursor` 虽是新实例但内部引用不变，React 浅比较可能跳过。

3. **`█` 字符渲染**（低可能）：U+2588 FULL BLOCK 在部分 Windows 终端字体下可能渲染为空白或方框。CC 使用 `█` 但在其自己的 Ink 包装层中有 fallback 逻辑。

**修复方向**：
- 将 `renderInputBox()` 改造为独立 React 组件 `<InputBox>`
- 排查 `MeasuredText` 是否有实例缓存
- 如 `█` 不可渲染，提供备选光标字符（`|` 或 `▌`）

---

### REGR-010：工具动画完全不出现

**现象**：工具调用 `●` 无闪烁动画，pending 状态无任何视觉反馈。

**根因**：`useBlink` 缺少 CC 的 `ref` 机制。

**CC vs TriLC 对比**：

```tsx
// CC vendor/cc-tui/hooks/useBlink.ts — 返回 [ref, isBlinking]
const [ref, isBlinking] = useBlink(shouldAnimate);
return <Box ref={ref} minWidth={2}>...</Box>

// TriLC src/tui/hooks/useBlink.ts — 只返回 isBlinking
export function useBlink(active, interval): boolean {
  const [visible, setVisible] = useState(true);
  // setInterval → setVisible(!v)  ← 仅布尔 toggle
  return visible;  // ← 没有 ref！
}
```

**为什么 ref 关键**：CC 的 `ref` 被绑定到 Box 元素上。Ink 的自定义 reconciler 使用 ref 来精确标记需要重绘的终端区域（类似 DOM 的 node ref）。没有 ref，Ink 在 `setState` 触发后做全量 diff，可能判定输出内容无实质性变化（因为 Box/Text 的 props 结构可能相同），跳过终端重绘。`setInterval` 的 `setVisible` 虽然更新了 React state，但终端屏幕从未被 Ink 更新。

**修复方向**：
- 对齐 CC 的 `useBlink` 签名：返回 `[ref, isBlinking]`
- `ToolCallLine` 的 Box 元素绑定 `ref`

---

### REGR-011：`/` 命令无实时提示

**现象**：键入 `/` 后无命令面板弹出，无可用命令列表，无模糊匹配高亮。只有回车提交后才能看到纠错提示。

**CC 行为**：CC 的 PromptInput 在键入 `/` 瞬间弹出命令面板（fuzzy match + 下拉列表），显示所有可用命令及描述。

**当前代码定位**：
- `TriLC/src/tui/hooks/useCursorInput.ts` line 95-99 — 只在 Enter 时检查 `startsWith('/')`
- `TriLC/src/tui/app.tsx` line 72-81 — COMMANDS 已定义 8 个命令，但无实时提示入口

**修复方向**：
- `useCursorInput` 增加 `slashMode` state（输入 `/` 触发）
- 新增 `CommandHint` Ink 组件（浮层显示命令列表）
- 复用已有 Levenshtein 距离做 fuzzy match
- 8 个已有命令全部纳入提示（/exit /help /clear /model /verbose /status /compact /sessions）

---

## 二、CC 对齐重审要求

以上 4 项暴露了一个系统性问题：**当前 TriLC TUI 虽然 vendor 了 CC 源码，但在集成时做了过度简化，丢失了 CC 的关键行为语义**。

请 CTO 小狄在以下维度重新审核：

| 审核维度 | 当前 TriLC | CC 2.1.88 | 差距 |
|----------|-----------|-----------|------|
| ToolCall 渲染 | 裸 tool name + args | tool description + 人话动作 + 动画 | 大 |
| 光标/输入 | 函数式 renderInputBox、无 ref | 组件化 PromptInput、ref 驱动渲染 | 大 |
| useBlink | 返回 boolean | 返回 [ref, boolean] | 关键缺失 |
| 命令提示 | 提交后纠错 | 实时 fuzzy match + 下拉面板 | 完全缺失 |
| useInput 事件 | 依赖 Ink 默认 key 映射 | CC 有 termio 层直接处理终端输入 | 待确认 |

---

## 三、执行指令

1. **CTO 小狄**：逐项对比 CC 2.1.88 源码与当前 TriLC 实现，产出对齐差距报告 + 逐项修复方案
2. **修复方案产出后**：路由给 FullStack(小全) 按方案执行修复
3. **修复完成后**：TestEngineer(小柯) 逐项验证 + 回归
4. **CTO 终审**：APPROVE 后恢复 P0 移植主线 `cc-transplant-p0-1`

W31 P0 移植树已更新，`cc-transplant-p0-1` 暂停等待 fix-6 闭合。

---

## 四、时间约束

- CTO 审核 + 方案：0.5h
- FullStack 修复（3 项并行 + 1 项串行）：预计 1.5-2h
- TestEngineer 验证：0.5h
- **总计**：预计 2.5-3h，今日内闭合

---

*路由完成于 2026-07-28。CC 对齐参考：W30 CTO 审计 `cto-compliance-audit.md`。*
