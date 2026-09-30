# ink 补装攻坚·执行读数卷（batch-03 件 2 执行段·FSD 照 CTO 方案 A' 裁条）

- 执行: m-duty-fsd（FD）；裁条正身=本目录 ink-testlib-strategy-verdict.md（V1-V6）
- 交付锚: TriRLC 仓 dev **6b845be**（5 files, +77/−506：helpers 新件+import 换指+V4 校准+stale 注勘正+devDeps/lock 回撤）

## 验收锚四条对表（方案卷 §三）

### 锚 1·components.test.ts 27 it() 全绿

- **27/27 pass / 0 fail**（node --test 单文件实测）
- V4 精确字面校准 **3 处逐处留痕**（均在 it 标题内联注记）：
  | # | 原断言（npm-ink 时代） | 校准后（现役） | 锚 |
  |---|---|---|---|
  | 1 | pending 含 braille 旋转符⠋-⠏ | pending 含 `●`（blink 仅 TTY 色面，headless 不可断言） | ToolCallLine.tsx:7 头注 |
  | 2 | done 含 `✓` | done 含 `●`（solid） | ToolCallLine.tsx:8 头注 |
  | 3 | error 含 `✗` | error 含 `失败` 标（`●`+`失败`，:74 语义） | ToolCallLine.tsx:9/:74 |
- 校准定性：该文件自 W38 起因 ink-testing-library 缺装从未跑通，期望面停在 npm-ink 时代形；组件已演进（●+useBlink+本地化标签，头注自证）——字面更新非语义放宽，断言强度保留（error 独有`失败`标可辨、工具名断言全保留），**禁删断言凑绿边界遵守 ✓（零删断言）**

### 锚 2·撤库断言

- `npm ls ink ink-testing-library` = **(empty)** ✓
- package-lock diff 净：**−491 行**（两包子树纯移除）；package.json devDeps −2 ✓
- `from 'ink'` 直引复扫 = **0 import**（唯一命中=src/tui/ink/ink/hooks/use-input.js:11 文档注释示例，非依赖面）

### 锚 3·全量测试四项读数（node22）

| 项 | 件 1 基线（f45885e） | 件 2 后（6b845be） | 变化 |
| --- | --- | --- | --- |
| 总数 | 203 | **229** | +28（−1 tui 文件级挂 +27 its 实跑） |
| 通过 | 199 | **226** | +27 |
| 失败 | 4 | **3** | −1（tui 挂点消=W38 残留终解·V6） |
| 跳过 | 0 | 0 | = |

- 残 3 全预存 out-of-face（承 batch-02 件 3 卷 §四归因，零变化）：letters R1 事件帧漂移、FADE-005 派工门禁 409、FADE-005 可见性 metrics 计数——**如实记不凑数 ✓**
- tsc 门: 本件面零错（lead-tools.ts 5 处预存 API 代差不变，在案）

### 锚 4·适配件声明

- `test/tui/helpers/test-renderer.ts` = **62 行**（≤80 ✓）
- 适配件原理：包 root.js `renderSync` 的 **stdout 注入原生挂点** + fake stdout（Writable 内存帧缓冲，headless isTTY=false）→ 暴露 `{frames, lastFrame(), rerender, unmount}` 最小面
- 三个技术挂点（探针实证）：①`NODE_ENV=test` 置位→reconciler resetAfterCommit 走 `onImmediateRender` 直发路径（reconciler.js:214-222）＝**同步 lastFrame() 契约正门**（探针：非 test 环首帧滞后至 throttle tick，test 环同步落帧）②stdin 用 PassThrough（零 fd 环引用；默认 process.stdin Socket 扣环=首跑 120s 挂因）③setImmediate 自清钩（断言同 tick 同步完成后下一宏任务 unmount，清 Spinner 内部 interval——首挂第二因）
- **零引擎 import 语义变更声明：src/tui/ink/ 零触碰**；本件 diff 面=helpers 新件+components.test.ts import 行与 V4 校准 3 处+render.tsx 头注勘正+package.json/lock 回撤——引擎行为语义零变更 ✓

## V5/V6 闭合

- V5: TriMMC 无 ink deps+无 ink-testing-library 测试引用（batch-02 件 3 卷+package.json 复勘）→ 单仓执行闭合 ✓
- V6: components.test.ts 挂点消=W38 ERR_MODULE_NOT_FOUND 残留终解；**CARRY-001 链销账判候 BOD**，本卷+方案卷供锚

## 使用依据

- 裁条正身 ink-testlib-strategy-verdict.md（方案 A' V1-V6）+ 其 §四 依据链（W30 absorption-plan L114/W38-39 BUG-20260805-003·CARRY-001/W30 cto-compliance-audit P12）
- TriRLC 仓 6b845be diff 为改动唯一真源
