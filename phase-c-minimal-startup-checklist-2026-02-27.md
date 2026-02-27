# Phase C 最小启动清单（本周）

更新时间：2026-02-27

执行记录：见 [phase-c-pilot-record-2026-02-27.md](phase-c-pilot-record-2026-02-27.md)。

## 1. 目标（仅保留最小可执行范围）

- 在不破坏 Tripilot 四项硬门禁的前提下，启动架构迁移与验证。
- 本周只做“可留痕、可回滚、可复盘”的最小动作，不扩展新功能面。

## 2. 启动前置（已满足）

- Phase B 已完成（B1/B2/B3/B4 全通过）。
- Tripilot 门禁基线可运行：
  - `npx tsc --noEmit` 通过。
  - `scripts/acceptance/daily-smoke.ps1` 可产出 txt/json 证据。

## 3. 本周执行项（W1）

### W1-1 建立“当周基线证据”

在 `Tripilot` 根目录执行：

```powershell
npx tsc --noEmit
powershell -ExecutionPolicy Bypass -File scripts/acceptance/daily-smoke.ps1
```

通过标准：

- `artifacts/acceptance/` 下生成当日 `daily-smoke-*.txt/.json`。
- `overallPass=true`，且 alias gate 满足 `MISSING=0`、`BAD_ALIAS_TARGETS=0`。

### W1-2 做一次主路径人工回归（opencode-acp）

回归动作：

1. 设置 `tripilot.chatProvider=opencode-acp`。
2. 在 Tripilot Chat 发送一条最小指令（例如读取工作区根目录并返回文件数）。
3. 确认工具调用开始/结束卡片成对出现并有最终文本输出。

通过标准：

- 无卡死、无持续 loading、无红色错误。

### W1-3 建立 Phase C 每日回归节奏（轻量）

- 每天至少 1 次执行 `daily-smoke.ps1`。
- 每次调整后追加一次执行（不要求 CI 先行）。

通过标准：

- 当周至少保留 3 份 `daily-smoke` 产物。

### W1-4 锁定“硬门禁优先级”

PR 描述模板：见 [phase-c-w1-pr-template.md](phase-c-w1-pr-template.md)。

- 任何架构调整提交前，必须先过：
  1) 编译门禁
  2) alias 门禁
  3) smoke 产物留存
  4) 主路径手工回归

通过标准：

- PR 描述中包含上述 4 项结果或证据链接。

## 4. 本周不做（避免扩散）

- 不新增 provider 大范围一致性矩阵。
- 不重写 Webview 外观。
- 不引入新的跨仓复杂流程。

## 5. 风险与口径（当前已知）

- `node scripts/check-tool-implementations.js` 当前输出与 `daily-smoke` alias gate 结果存在口径差异。
- 本周统一以 `daily-smoke` 里的 alias gate 作为硬门禁判定源；脚本口径统一作为后续修复项，不阻塞 Phase C 启动。

## 6. W1 完成判定（DoD）

满足以下全部条目，视为“Phase C 本周启动完成”：

1. 至少 1 份当日 `daily-smoke` 产物 `overallPass=true`。
2. 至少 1 次 `opencode-acp` 主路径手工回归通过并留痕。
3. 至少 1 个架构调整提交附带四重回归证据。

当前状态（2026-02-27）：以上 3 条已满足，W1 DoD 达成。证据汇总见 [phase-c-pilot-record-2026-02-27.md](phase-c-pilot-record-2026-02-27.md)。