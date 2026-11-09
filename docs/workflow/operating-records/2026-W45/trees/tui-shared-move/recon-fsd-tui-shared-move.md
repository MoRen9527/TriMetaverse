# recon-fsd-tui-shared-move · TUI 共有化段一前置勘定卷（FSD）

- sourceOfTruth: 本卷（段一施工前置勘定·施工读数归 reports/node-fsd-tui-move.md）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 勘席: FSD（COO 派工令 2026-11-04T11:52:02+0800·COS 排工令 11:51:14·CTO 两段技术裁决毕·施工序 CTO 建议照排）
- 基线: TriRLC@4976dda（worktree clean）+TriCode@d181946（worktree clean）·TriRLC 基线回归 **758/758 全绿实证（fail=0·31.8s）**

## 勘一 · react 19 peer 两 host 仓对表

- **TriRLC（现役 host）**：dependencies react ^19.2.8 + react-reconciler ^0.31.0 + @types/react ^19.2.17 + @types/react-reconciler ^0.33.0——react 19 在役。
- **TriCode（承接 host）**：react 系零声明 + peerDependencies 段不存在 + src 面零 tsx（20 ts/0 tsx）+ tsconfig 无 jsx 配置——**承接缺口三件：peer 声明新增 / tsconfig jsx+tsx 支持 / ink 族依赖声明**。
- **peer 形**：react ^19.2.8 入 TriCode peerDependencies（CTO 裁「react 19 peer」）；**react-reconciler ^0.31.0 随同入 peer**（机械延伸：reconciler 须与宿主 react 同源单实例——双实例会断渲染 context，ink npm 包同形将 react+react-reconciler 并列 peer）——延伸裁量候 CTO 确认注记。

## 勘二 · vendored ink 随迁清单

- **随迁树**：`TriRLC/src/tui/` 全树 212 files=171 js（全部在 ink/ 子树=vendored ink 本体·六段结构 _stubs/bootstrap/components/ink/ink.js/utils）+26 ts+12 tsx+3 md（tech-design.md 随迁·test-report 两件历史叙事随树不动卷）·~1.8MB。
- **裸包 import 全集**（全树含 js 重扫——首轮 ts/tsx 扫漏 js 面已修）：react(136)/react-reconciler(4)/figures(8)/chalk(5)/strip-ansi(4)/string-width(4)/@alcalzone/ansi-tokenize(3)/wrap-ansi(2)/signal-exit(2)/semver(2)/marked(2)/yoga-layout(1)/usehooks-ts(1)/supports-hyperlinks(1)/stack-utils(1)/indent-string(1)/get-east-asian-width(1)/emoji-regex(1)/code-excerpt(1)/cli-boxes(1)/auto-bind(1)——全部在 TriRLC dependencies 在役，版本号随 TriRLC package.json 抄录。
- **异面三件定性**：①`bun:bundle`(12·bun 打包器编译期 feature flag)=**import 链不可达残件面**（claude-code 上游完整组件树残留——dist 编译产物实证：dist/tui/ink/components/design-system/ 零产出=未被 import 链拉入）；②`src/...`(26·bun 项目根相对路径) 同①残件面；③裸 `ink`(1)=use-input.js 注释行豁免。残件**随树平移保 vendored 完整性·不进 TriCode 编译面**（同形：import 可达才编）。
- **运行链实锚**：dist/tui/render.js→fork.js（自研引擎 barrel）→app.js→design-system/theme.js+termio/*——npm ink 依赖已撤（batch-03 件2 V3 裁条·自研 src/tui/ink/ 引擎）。

## 勘三 · TriRLC 依赖声明锁定面

- **消费单点**：src/cli.ts L615 动态 `await import('./tui/render.js')` 唯一消费方——切换面=单行 import 改 `@trimetaverse/tricode/r-ink-tui/render.js`。
- **链路形态**：TriRLC package.json `@trimetaverse/tricode: file:../TriCode` 本地 file 链在役——exports 子路径加条目即通，零 registry 发布面。
- **依赖清理划线**：tui 迁出后 TriRLC deps 的 ink 族（react/reconciler/figures/chalk/…）**本单不清**——react+reconciler 须留（peer 供给方宿主义务）；其余族零非 tui 引用（勘四包非 tui 面全 0+全树重扫对照）属冗余无害，清理候 CTO 裁（超本单最小化）。TriRLC tsconfig 的 jsx/allowJs 同理不动（迁后成死配置·候清理面注记）。

## 勘四 · TriCode 承接面改造清单

1. tsconfig 四键：`allowJs: true`+`checkJs: false`+`jsx: "react-jsx"`+include 扩 `src/**/*.tsx`（js 面由 allowJs+import 拉入编译——TriRLC 同形照抄·module 保持 Node16 对齐 TriRLC NodeNext 差异注记：TriCode ES2022+Node16 编 vendored js 零碍·两边 outDir/rootDir 同构 dist/src）。
2. package.json：peerDependencies {react, react-reconciler}+dependencies 补 ink 族 19 包（版本抄 TriRLC）+exports 加 `"./r-ink-tui/*": {import/require/types→dist/r-ink-tui/*}` glob 形（超集零害·cli.ts 单点 render 入口即通）。
3. 产品名入册：R 面 Ink TUI（TriCode docs/registry/ 面候施工毕随 registry 更新窗）。

## 勘五 · 跨仓 git mv 实锚差异（如实注记）

TriRLC→TriCode **跨仓 git mv 技术不可行**（git mv 限仓内）。保历史正形=**SHA 双锚**：TriRLC 侧 git rm 终态 commit（旧路径历史在其 git log 永续可溯）+TriCode 侧首笔 commit message 注记源仓 SHA+迁移范围。达成 CTO「保历史可溯」意图，与字面 git mv 的差异如实注记候 CTO 知悉。

## 施工序（勘定后锁定）

①TriCode 收编施工（拷树→tsconfig/pkg/exports 三改→build+check 绿）→②TriRLC 切换施工（git rm src/tui→cli.ts 单点切换→build 绿）→③TriRLC 回归 758/758 零红（基线已锁）→④毕报回 COS+抄 COO（勘定卷+回归读数+commit 锚双仓）。

## 使用依据

COO 派工令 2026-11-04T11:52:02+0800·COS 排工令 11:51:14·CTO 两段技术裁决（react 19 peer+WATCH 甲裁同窗令面）·TriRLC package.json/tsconfig@4976dda·TriCode package.json/tsconfig@d181946·dist 编译产物实证（render 链+残件不可达）·TriRLC 基线回归读数（本卷头部）
