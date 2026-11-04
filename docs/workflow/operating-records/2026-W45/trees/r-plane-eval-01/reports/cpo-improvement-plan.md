# r-plane-eval-01 · 改进计划卷（CPO 小乔）

> 树 id=r-plane-eval-01 · 配套卷=cpo-product-maturity-assessment.md（成熟度评估卷）
> 范围纪律：每项不超当前工程现实；范围变动必附取舍与回退；派工执行面归 CTO 域，本卷只裁产品优先级与验收判据。

## Now（本阶段·低成本高杠杆）

### N1 · TriPilot 质量门禁补齐
- **依据**：GUI 面判 P2 的主因——unit 仅 sseParser 一文件，E2E 仅骨架。
- **动作**：unit 扩到 chatHistory / trilcClient（SSE 直连）/ tripilot-cli 参数解析；E2E 按 TESTING_FRAMEWORK.md 既定路线接入 `@vscode/test-electron`，跑通一条冒烟链（webview 打开→发消息→收流式回复）。
- **验收判据**：`npm run test:unit` + `test:integration` 全绿；一条 e2e 冒烟 PASS 留痕。
- **取舍**：不追求覆盖率数字，只保门禁存在——覆盖率先保三个高风险件（SSE 解析/直连客户端/CLI 解析）。

### N2 · TriRLC 产品面文档两页补齐
- **依据**：评估卷第四节——registry 滞后实现约两个迭代；CLI/API 无产品文档页。
- **动作**：TriRLC/docs/product/ 补「8711 端点族一页」+「CLI 命令族一页」，registry Current Progress 勘正到现实现态口径。
- **验收判据**：两页真源落位且 registry 引用；端点清单与 app.ts 实测端点族一致（30+ 条对得上）。

### N3 · bin 双名收口
- **依据**：`trirlc`/`trilc` 双名并存，命名锚定只写了叙事面更名，bin 收口时点未定。
- **动作**：与治理 registry 的权威 alias 表对齐，定兼容面退役时点（建议随下个 minor 版本）。
- **验收判据**：alias 表三处（README/治理 registry/package.json bin）一致，退役时点入册。

## Next（下一阶段）

### X1 · TriPilot 发布形态定型
- **动作**：publisher=`local` → 正式 VSIX 打包链 + 语义化版本节奏（自 v0.1.0 起）+ changelog 建立。
- **验收判据**：VSIX 可装可卸留痕；changelog 首版发布。
- **依赖**：N1 门禁在位后才发布——不带门禁上发布形态。

### X2 · 8711 API 契约稳定化
- **动作**：`/internal/v1/*` 端点族契约文档化（请求/响应/错误码），加契约测试护住——改动破契约即红；`/v1/messages` 对外兼容面单独标注稳定性承诺。
- **验收判据**：契约测试在位跑通；端点文档与 N2 页互链。
- **取舍**：internal 端点只做文档+测试，不承诺对外 SLA——对外承诺属平台化评估（BS 边界，另案）。

### X3 · extension.ts 单文件拆解
- **动作**：10011 行按职责拆（webview chat / settings / sessions / 审批代理 / trilcDirect 客户端），先易后难。
- **验收判据**：每步拆后 compile+全测试绿；终态单文件 <3000 行。
- **风险注**：纯重构零行为变更，与 N1 顺序可互换，但都须在 X1 发布前完成。

## Later（候产品验证后）

### L1 · 多项目路由 GUI 化
- 底座已在（multi-project-router + projects API 三端点），候 N1/X2 后做 GUI 呈现。验收：GUI 内可见多项目切换与 inspect 读数。

### L2 · wallet-upgrade 产品流
- src 计划模块位已在（README Planned modules），涉商业模式（钱包/计费），候中央战略输入，本卷不排期。

### L3 · 崩溃恢复链 E2E 演示化
- TWF-001（TriPilot→TriMMC fallback）现有 registry 口径、无端到端演示验证。候 X1 后做崩溃注入演示。验收：演示脚本+录痕。

## 优先级总表

| 项 | 优先级 | 前置 | 验收核心 | 回退 |
|---|---|---|---|---|
| N1 质量门禁 | P0 | 无 | 三高风险件测试绿+e2e 冒烟 | 退回仅 sseParser 现状 |
| N2 文档两页 | P0 | 无 | 两页+registry 勘正 | registry 保持首版口径 |
| N3 bin 收口 | P1 | 治理对表 | alias 三处一致 | 双名继续并存（无害） |
| X1 发布形态 | P1 | N1+X3 | VSIX+changelog | 维持 local 形态 |
| X2 契约稳定 | P1 | N2 | 契约测试红绿在位 | 文档-only 降级 |
| X3 拆解 | P1 | 无 | 拆后全绿+<3000 行 | 停留在当前分块 |
| L1-L3 | P2 | 各自前置 | 见各条 | 不启动无损 |

## 使用依据

- 配套评估卷：`cpo-product-maturity-assessment.md`（同树 reports/）
- 仓面证据与 registry 引用同评估卷第五节
- 派工边界：本卷为产品优先级裁决面；工程实现排程归 CTO 域（D-15 联审门：涉功能/模块改动双席签认后动工）
