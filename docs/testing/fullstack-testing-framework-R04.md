# 全栈测试框架与环境方案（R04）

更新时间：2026-03-03
适用范围：Tripilot、Tristaciss、Avatar-react、Opentride、VSCodium、未来新增子项目

---

## 1) 全项目测试框架总览（主流测试框架）

| 项目 | 技术栈 | 主流测试框架（目标） | 当前状态 |
|---|---|---|---|
| Tripilot | VS Code Extension + TypeScript | Vitest（Unit/Integration）+ @vscode/test-electron（Extension-host E2E） | 已接入 |
| Avatar-react | React + Vite | Vitest + Testing Library + Playwright | 已接入 |
| Tristaciss(api-server) | FastAPI/Python | pytest + pytest-asyncio + httpx + pytest-cov | 目前脚本测试，待框架化 |
| Opentride | Bun/TS monorepo | bun turbo test + Playwright（按 package） | 已有 CI 流程 |
| VSCodium | 发行/构建工程 | 构建发布流水线 + 冒烟验证脚本 | 以构建发布为主 |
| 未来子项目 | 待定 | JS/TS: Vitest/Jest；Python: pytest；E2E: Playwright/Cypress | 采用统一模板准入 |

---

## 2) 现状评估（按你的 12 条问题）

### Q1 测试层级是否完整（单元/集成/系统/验收/专项）
- 现状：
  - Tripilot：已具备 Unit/Integration + Extension-host E2E 基础。
  - Avatar-react：已具备 Unit + E2E。
  - Tristaciss：有脚本测试，缺少标准化分层。
  - Opentride：已有较完整 test/typecheck/e2e。
  - VSCodium：以构建发布为主，业务测试策略需补。
- 方案：统一五层（Unit/Integration/System/专项/验收）和门禁。

### Q2 有没有端到端测试
- 现状：Avatar-react 有 Playwright；Tripilot 已接 extension-host E2E smoke。
- 方案：Tripilot 扩展 E2E 从 smoke 扩展到会话/工具调用/回放/审批关键链路。

### Q3 有没有主流测试框架（测试框架维度）
- 现状：
  - JS/TS：Vitest/Playwright 已在多个项目使用。
  - Python：Tristaciss 尚未统一 pytest。
- 方案：
  - JS/TS 单元与集成：Vitest（或兼容包用 Jest）
  - Python：pytest + pytest-cov
  - 扩展宿主 E2E：@vscode/test-electron
  - Web E2E：Playwright（必要时 Cypress）

### Q4 有没有自动生成测试数据
- 现状：Tripilot 已有 fixture 生成器。
- 方案：其他项目补同类数据工厂（前端 mock、后端 factory/seed）。

### Q5 有没有用 VSCode 辅助配置测试框架与环境
- 现状：Tripilot 已补测试扩展推荐与 testing settings。
- 方案：按项目栈在各子仓补 `.vscode/extensions.json`。

### Q6 有没有 CI/CD 自动化回归（GitHub Actions/Jenkins）
- 现状：
  - Tripilot：已有 quality-gate（含 extension-host E2E）。
  - Avatar-react：已有 E2E workflow。
  - Opentride：已有 test workflow。
- 方案：Tristaciss、VSCodium 业务层回归门禁补齐。

### Q7 有没有优化与维护测试套件
- 现状：Tripilot 已有治理文档；其余项目不统一。
- 方案：统一 flaky 管理、覆盖率阈值、缺陷回归补测制度。

### Q8 业务逻辑/安全关键/性能敏感是否人工审查
- 现状：缺少统一 Gate。
- 方案：PR 模板加入强制勾选审查项（Security/Business/Performance）。

### Q9 是否按栈选择 Jest、pytest、Mocha、Cypress，并配置 VSCode 扩展
- 现状：Tripilot 现为 Vitest + Mocha(用于 extension-host test runner)；Avatar-react 为 Vitest+Playwright。
- 方案：
  - Tripilot：Vitest + @vscode/test-electron（Mocha runner）
  - Tristaciss：pytest
  - Avatar-react：Vitest + Playwright
  - Opentride：bun test + Playwright
  - VSCode 扩展：Vitest Explorer / Test Explorer UI / Docker

### Q10 是否设计测试集并勾选结果
- 现状：Tripilot 已有模板。
- 方案：将模板推广到所有子项目（统一字段与签核流程）。

### Q11 覆盖率能否可视化
- 现状：Tripilot 已支持 text/html/lcov；Avatar-react 可扩展统一覆盖率上报。
- 方案：全仓统一 coverage 产物命名与汇总看板。

### Q12 有没有利用容器保证本地与 CI 一致
- 现状：Tripilot 已加测试容器；其他项目不统一。
- 方案：每个项目至少一个 test Dockerfile + compose/CI 使用说明。

---

## 3) 已落地改造（Tripilot）

- 测试框架：Vitest + coverage
- 扩展宿主级 E2E：@vscode/test-electron + Mocha runner
- 测试样例：
  - `tests/unit/sseParser.test.ts`
  - `tests/integration/sseParser.chunking.test.ts`
  - `tests/e2e/suite/extension-smoke.test.cjs`
- 自动数据：`tests/fixtures/generate-chat-events.mjs`
- CI/CD：`.github/workflows/quality-gate.yml`
- 容器：`docker/test.Dockerfile`, `docker-compose.test.yml`
- VSCode：`.vscode/extensions.json` + testing settings
- 治理文档：`tests/TESTING_FRAMEWORK.md`, `tests/test-cases-checklist.md`

---

## 4) 统一执行流程（开发即测试）

1. 开发前：先写测试清单与验收项
2. 开发中：`compile -> test:data:generate -> test:coverage`
3. 提交前：关键路径人工审查 + 覆盖率检查
4. PR：CI 必须全绿（包含 E2E smoke）
5. 合并后：每周维护 flaky 与覆盖率趋势

---

## 5) 下一阶段（全项目）

- Tristaciss：正式接入 pytest + pytest-cov + 安全扫描
- Avatar-react：补专项测试（性能/安全）与 Alpha/Beta 验收模板
- Opentride：将现有 test workflow 指标纳入统一看板
- VSCodium：补业务级冒烟与发布后健康检查
- 未来子项目：按“技术栈->框架”映射模板强制准入
