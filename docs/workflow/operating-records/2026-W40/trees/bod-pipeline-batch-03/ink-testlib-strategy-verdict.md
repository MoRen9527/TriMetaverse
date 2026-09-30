# ink 补装攻坚·方案裁决卷（BOD 流水线 batch-03 件 2 方案裁·CTO）

- date 现查: 2026-10-01 02:5x CST
- 裁决人: CTO 小狄（件 2 方案裁位）；执行: FSD 照裁条
- 输入: 任务书三历史判据（W30 absorption-plan L114／W38-39 BUG-20260805-003·CARRY-001 链／W30 cto-compliance-audit P12 constants-bridge）+ batch-02 件 3 卷 + 本席实勘六面（components.test.ts 用法面/src/tui 结构/fork barrel/组件 import 面/npm ink 直引面/root.js 签名面）

## 一、根因定性（确认 BOD 三判据，细化到 import 面）

**双 ink 宇宙并存——被测组件属自研 fork 宇宙，测试 harness 属 npm ink 宇宙，两宇宙 reconciler 不同世**：

1. **组件侧=自研 fork**：W30 依 absorption-plan L114 吸收 CC 2.1.88 自研终端引擎（~80 文件）入 `src/tui/ink/`；`src/tui/fork.tsx` barrel 已供 `Box/Text/render` 三原语（export 自 `./ink/ink/components/Box.js|Text.js`+`./ink/ink/root.js`）；被测组件 Markdown.tsx:5 实证 `import { Box, Text } from '../fork.js'`——**组件零依赖 npm ink**。
2. **测试侧=npm ink 宇宙**：ink-testing-library 是为 npm ink 包写的测试库，其渲染链走 npm ink 内嵌 react-reconciler（5.2.1 系锁 react 18）；仓主线 react@19.2.8 → reconciler init 崩（今夜失败形）。
3. **runtime 残留=零**：src 全树 `from 'ink'`（npm ink 直引）实勘 **0 处**；`src/tui/render.tsx` 头注「Rendering components still use npm ink」系 **stale 注**（与 fork barrel 现势矛盾，随批勘正）。
4. **W38 ERR_MODULE_NOT_FOUND 与今夜 reconciler 崩=同一根因两时代**：前者=库缺装（npm ink 宇宙未进场），后者=库进场后拖 npm ink 引擎撞 react19——补装不但不解反而显影冲突。

**非版本对齐可解定谳**：升 npm ink 6（react19 系）=组件宇宙迁回 npm ink=弃自研引擎=违 W30 vendor 冻结决策；钉 react 18=违仓主线。两路皆断，唯撤库改适配件。

## 二、裁决（方案 A'·自研轻量测试 renderer 适配件）

| # | 裁条 | 内容 |
|---|------|------|
| V1 | **撤 ink-testing-library 测试链** | `test/tui/components.test.ts` 的 `import { render } from 'ink-testing-library'` 改指自研适配件（V2 件）；27 个 it() 断言面原则上不动 |
| V2 | **新建 `test/tui/helpers/test-renderer.ts`（≤80 行适配件，测试面非引擎面）** | 包 `src/tui/ink/ink/root.js` 的 `renderSync`/`createRoot`（**stdout 参数可注入**=引擎原生测试挂点）+内存 fake stdout 帧缓冲 → 暴露 `{frames, lastFrame(), rerender, unmount}` 最小 API 面（对齐 ink-testing-library 三原语，迁移成本=单行 import）；**零改动 src/tui/ink 引擎行为语义**（任务书边界重申） |
| V3 | **devDeps 回退** | `ink@^5.2.1`+`ink-testing-library@^4.0.0` 自 package.json 移除+lock 回净（runtime 零直引实勘=移除零波及）；batch-02 件 3「测试基建补装半件」随本裁回撤；render.tsx stale 头注同批勘正 |
| V4 | **断言校准边界** | 引擎输出空白/换行/着色码差异允许**精确字面校准**（逐处留痕）；禁语义放宽禁删断言凑绿；校准不过=按失败归因回卷，不硬凑 |
| V5 | **TriMMC 同构裁定=不同构不同修** | 实勘 TriMMC 无 ink deps+无 ink-testing-library 测试引用——件 2 执行面=**TriRLC 单仓**；charter「两仓若同构同修」条件分支闭合 |
| V6 | **CARRY-001 链衔接** | 本修消 components.test.ts 挂点=W38 残留终解；CARRY-001 链销账判候 BOD（本卷+执行卷供锚） |

## 三、验收锚（FSD 执行卷 ink-testlib-fix-readout.md 应载）

1. components.test.ts 27 it() 全绿（或 V4 口径逐处校准留痕）；
2. 撤库后 `npm ls ink ink-testing-library`=空+package-lock diff 净；`from 'ink'` 直引复扫=0；
3. 全量测试四项读数（基线 203/199/4/0@node22 → 件 2 后 tui 挂消=预期 3 残，如实记不凑数）；
4. test-renderer.ts 行数+适配件零引擎 import 语义变更声明（diff 面=import 行+helpers 新件）。

## 四、使用依据

W30 absorption-plan.md L114-127（自研引擎基线+vendor 冻结）；W30 cto-compliance-audit.md P12（constants-bridge 桥接）；W38/W39 OP 记录 BUG-20260805-003 链（yoga 别名修复 89ad689→smoke 30/30）；batch-02 件 3 卷（今夜 reconciler 崩+devDeps 补装）；本席实勘：test/tui/components.test.ts import 面（:8 ink-testing-library/被测件 :5 fork import）、src/tui/fork.tsx barrel、src/tui/ink/ink/root.js 签名（renderSync/createRoot stdout 注入）、src 全树 npm ink 直引=0、TriMMC package.json+test 面（零 ink 触点）。
