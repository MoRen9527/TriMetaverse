# trilc CLI 中文输入法修复方案

## 诊断结论（根因）
trilc chat（CLI）中文输入"只有拼音没有候选"，根因在 `TriLC/src/tui/` 的 IME 光标处理：

- 安装版 trilc 跑的是**原版 ink**（`from 'ink'` → stock `node_modules/ink`，主屏模式，默认 `\x1b[?25l` 隐藏光标）。dist 里那个 `tui/ink/` fork 是**打包进来但没被引用的死代码**。
- "之前的修复" = `app.tsx` + `render.tsx` 里的 `imeCursorCallback` hack：在 `useEffect` 里直接 `process.stdout.write('\x1b[row;colH')` 定位光标。它有三个 bug：
  1. **从未写 `\x1b[?25h` 显示光标** —— 光标被原版 ink 隐藏，IME 没有可见物理光标可依附，候选/预编辑窗不渲染。
  2. **列号用字符数，没算 CJK 显示宽度**（中文占 2 列），输入中文后光标列漂移。
  3. **多行行号算错**（漏算底边框/总行数；单行恰好对，多行偏）。
- 对照验证：用户确认**同一终端下普通 Claude Code 中文输入正常** → 终端支持 raw-mode IME（靠光标定位触发预编辑）。CC 用的就是 ink fork 的 `useDeclaredCursor`。所以这是 trilc 的**接线 bug，代码可修**，不是终端限制。

## 修复方案（分两阶段，先低风险）

### Phase 1（主推，低风险、构建干净、命中概率高）—— 修对 hack
源码改 `D:\OneDrive\Code\ai\TriLC\src\tui\`：

1. **`render.tsx`** `setImeCursorCallback` 回调：
   - 先写 `\x1b[?25h`（显示光标）再写 `\x1b[row;colH`（定位）。
   - 修正行号：`row = terminalRows - 1(底边框) - totalInputLines + cursorLine`（从 app 传入 totalInputLines）。单行退化成 `terminalRows-2`，与现状一致。
2. **`app.tsx`** IME `useEffect`：
   - 列号改用**显示宽度**：`col = 1(左边框) + 2("> " 前缀) + displayWidth(line.substring(0, cursorCol)) + 1`，`displayWidth` 用现成依赖 `get-east-asian-width`。
   - 把 `(cursorLine, totalInputLines, col)` 传给回调。
3. **构建**：`cd TriLC && npm run build`（tsc）。
4. **部署**：把 `TriLC/dist/tui/render.js` + `app.js` 用管理员权限覆盖到 `C:\Program Files\TriCade\resources\app\tools\trilc\dist\tui\`；同步一份到仓库 `output/TriMetaverse-Desktop-v0.2.0-windows/trilc/dist/tui/`。
5. **测试**：重启 trilc chat，打中文 → 应有候选词弹出、回车选词。

> 依据：原版 ink 用 DECSC/DECRC 绝对恢复光标位置写每帧，hack 在 `useEffect`（帧写入之后）重定位 + 显示光标，帧间光标稳定停在输入处，IME 预编辑可渲染。Phase 1 只动 2 个文件、不改构建管线。

### Phase 2（兜底，仅当 Phase 1 仍无效）—— 接入 fork 原生 `useDeclaredCursor`
ink fork（`vendor/claude-code-tui/ink`，CC 同款）有 `useDeclaredCursor` 机制（yoga 布局精确算光标位、在 ink 渲染管线内定位、`displayCursor` 跟踪），是 CC 验证可行的正解。但目前是死代码。Phase 2：
- 把 fork 纳入构建（vendor 进 `src/tui/ink/` 或 .d.ts shim + allowJs）。
- `render.tsx` 改用 fork 的 `render`；`InputBox.tsx` 调 `useDeclaredCursor({line, column, active})` 并挂 ref 到输入 Box。
- 删掉 `imeCursorCallback` hack。
- 风险：构建管线改动大、fork 可能有 bun 专用代码，需小心不破坏现有渲染。

## 顺带说明（之前改错的地方）
上一轮我误改了 tripilot-chat（IDE 扩展）的 `main.js` 加 `isComposing` 守卫，并部署到了 `C:\Program Files\TriCade\resources\app\extensions\tripilot-chat\media\main.js`，还改了仓库 `output/v0.1.0`、`v0.2.0` 两份 + 写了 `deploy-ime-fix.ps1`。那个改动本身是 tripilot webview 的正确 IME 修复（无害），但不是你要的。是否回滚由你定（回滚安装版需管理员）。

## 执行与验证
- 我来改源码 + 本地构建；部署到 Program Files 需你跑一条管理员命令（或我给脚本）。
- IME 行为我无法在此测试，需你在实际终端里验证，可能要 1–2 轮迭代。
- 先做 Phase 1，验证不通过再 Phase 2。
