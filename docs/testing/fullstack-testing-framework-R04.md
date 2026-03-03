# 全栈测试框架与环境方案（R04）

更新时间：2026-03-03
适用范围：Tripilot（VS Code 扩展）/ Avatar-react（前端）/ Tristaciss（后端）

---

## 1) 现状评估（按你的 12 条问题）

### Q1 测试层级是否完整（单元/集成/系统/验收/专项）
- 现状：
  - Tripilot：以 compile + check 脚本为主，缺少标准化单元/集成/系统测试。
  - Avatar-react：已有单元（Vitest）+ 端到端（Playwright）。
  - Tristaciss：有脚本化 API 测试，但缺少统一框架化报告。
- 方案：
  - Tripilot 已补齐 Unit/Integration 自动化骨架（Vitest）。
  - 系统/E2E、专项（性能/安全/可靠性）与验收（Alpha/Beta）纳入统一清单与门禁。

### Q2 有没有端到端测试
- 现状：Avatar-react 有 Playwright；Tripilot 暂无扩展宿主级 E2E。
- 方案：
  - Phase-A：保留 Avatar-react Playwright 作为前端 E2E。
  - Phase-B：Tripilot 接入 `@vscode/test-electron` 做扩展级 E2E（下一阶段）。

### Q3 有没有主流测试框架
- 现状：Avatar-react 已用 Vitest + Playwright；Tripilot 之前无。
- 方案：Tripilot 已新增 Vitest（含 coverage）。

### Q4 有没有自动生成测试数据
- 现状：缺少统一机制。
- 方案：Tripilot 已新增 `npm run test:data:generate` 生成可复现事件样本。

### Q5 有没有用 VSCode 辅助配置测试框架与环境
- 现状：Tripilot 有调试/任务配置，无测试扩展建议。
- 方案：已补 `.vscode/extensions.json` 与测试相关 settings。

### Q6 有没有 CI/CD 自动化回归（GitHub Actions/Jenkins）
- 现状：Avatar-react 有基础 workflow；Tripilot 缺。
- 方案：Tripilot 已新增 GitHub Actions `quality-gate.yml`（compile + fixture + coverage）。

### Q7 有没有优化与维护测试套件
- 现状：缺少统一规范。
- 方案：已补 `tests/TESTING_FRAMEWORK.md`，定义 flaky 处理、回归补测、覆盖率治理。

### Q8 关键路径是否提请人工审查
- 现状：流程分散。
- 方案：定义三类强制人工审查门禁：安全关键路径/业务关键逻辑/性能敏感模块。

### Q9 是否按技术栈选择 Jest/pytest/Mocha/Cypress 并配 VSCode 扩展
- 现状：前端以 Vitest+Playwright 为主；后端脚本化；扩展侧缺标准化。
- 方案：
  - Tripilot：Vitest（已落地）+ 后续 @vscode/test-electron。
  - Avatar-react：继续 Vitest + Playwright。
  - Tristaciss：建议 pytest + pytest-cov（下一阶段接入）。
  - VSCode：推荐 Vitest Explorer / Test Explorer UI / Docker。

### Q10 是否设计测试集并勾选结果
- 现状：缺少统一模板。
- 方案：已补 `tests/test-cases-checklist.md`，覆盖 Unit/Integration/System/专项/验收。

### Q11 覆盖率能否可视化
- 现状：Tripilot 之前没有。
- 方案：Tripilot 已输出 `text/html/lcov`，可直接打开 `coverage/index.html`。

### Q12 有没有用容器保证本地与 CI 一致
- 现状：未形成统一测试容器。
- 方案：Tripilot 已新增 `docker/test.Dockerfile` 与 `docker-compose.test.yml`。

---

## 2) 已落地改造（Tripilot）

- 测试框架：Vitest + coverage
- 测试样例：
  - `tests/unit/sseParser.test.ts`
  - `tests/integration/sseParser.chunking.test.ts`
- 自动数据：`tests/fixtures/generate-chat-events.mjs`
- CI/CD：`.github/workflows/quality-gate.yml`
- 容器：`docker/test.Dockerfile`, `docker-compose.test.yml`
- VSCode：`.vscode/extensions.json` + settings 测试项
- 治理文档：`tests/TESTING_FRAMEWORK.md`, `tests/test-cases-checklist.md`

---

## 3) 统一执行流程（开发即测试）

1. 开发前：更新/新增测试用例清单（先写验收项）
2. 开发中：本地 `compile -> test:data:generate -> test:coverage`
3. 提交前：覆盖率报告检查 + 人工审查关键路径
4. PR：GitHub Actions 自动回归必须全绿
5. 合并后：按周维护覆盖率趋势与 flaky 清单

---

## 4) 下一阶段（建议）

- Tripilot：补扩展宿主级 E2E（`@vscode/test-electron`）
- Tristaciss：引入 pytest、pytest-cov、安全扫描（bandit/pip-audit）
- 全仓库：建立统一质量看板（覆盖率、失败率、平均修复时长）
- 发布门禁：Alpha/Beta 验收清单正式纳入 release checklist
