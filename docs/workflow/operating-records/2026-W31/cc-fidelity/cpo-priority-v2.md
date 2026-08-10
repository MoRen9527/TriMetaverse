# CPO 优先级决策 v2

**决策人**: CPO 小乔
**决策时间**: 2026-07-29
**决策基准**: CTO 真实源码覆盖率审计报告 v2
**版本**: v2.0 (修正版)

---

## 执行摘要

**核心决策**: 重新排序优先级，聚焦单机用户刚需，控制本批次规模为 3 项高质量 A 级复制

**关键修正**:
1. 将 CTO 排序的 teammate 基础设施（TaskCreate/SendMessage）退到 P1
2. 调整本批次为 3 项高质量完成，而非 5 项半成品
3. 确认批次1的 /compact 和 TodoWrite 用 A 级源码替换

---

## 一、本批次清单（修正版）

### 1.1 本批次 3 项（按优先级排序）

| 顺序 | 功能 | 移植级别 | 预估成本 | 还原度提升 | 用户价值 | 是否替换 |
|------|------|---------|---------|-----------|---------|---------|
| 1 | **/compact** | A 级直接复制 | 4h | 30% → 95% | 长会话刚需 | **是** |
| 2 | **/init** | A 级直接复制 | 3h | 0% → 100% | 项目记忆刚需 | 否 |
| 3 | **TodoWrite** | A 级直接复制 | 1h | 40% → 100% | 任务管理 | **是** |

**本批次总成本**: 8 小时
**本批次总价值**:
- 解决长会话上下文爆炸痛点（/compact）
- 建立项目记忆机制（/init）
- 提升任务管理还原度（TodoWrite）

### 1.2 功能详解

#### 优先级 1：/compact（替换批次1 C 级 stub）

**CC 源码路径**: `services/compact/compact.ts`（1705 行）

**替换原因**:
1. CC 有完整压缩引擎：智能消息分组/图像剥离/PTL 重试/技能重注入预算控制
2. 我们的批次1实现只是简单裁剪 fallback（200 行），功能严重不足
3. 还原度提升显著：30% → 95%
4. 用户价值高：长会话刚需

**移植指令**:
- 用 CC 的 `services/compact/` 完整替换我们的 C 级实现
- 适配 TriLC 的依赖：消息模型、PTL 机制、技能系统
- 确保 tsc 零错误

#### 优先级 2：/init（新增功能）

**CC 源码路径**: `commands/init.ts`（100+ 行）

**优先级原因**:
1. CLAUDE.md 生成是 CC 的核心项目记忆机制
2. 对所有用户（包括单机用户）有高价值
3. A 级直接复制，成本可控（3h）

**移植指令**:
- 用 CC 的 `commands/init.ts` 作为基础
- 适配 TriLC 的 AskUserQuestion 机制
- 确保生成的 CLAUDE.md 符合 TriLC 的项目结构

#### 优先级 3：TodoWrite（替换批次1 C 级实现）

**CC 源码路径**: `tools/TodoWriteTool/TodoWriteTool.ts`（116 行）

**替换原因**:
1. CC 实现更简洁：116 行 vs 我们的 316 行
2. 功能更完整：CC 有 verification nudge + Task 系统集成
3. 类型安全更强：CC 有完整 zod schema

**移植指令**:
- 用 CC 的 `tools/TodoWriteTool/` 替换我们的实现
- 保留批次1已有的 UI 集成点
- 确保 verification nudge 功能可用

---

## 二、退到 P1 的功能

| 功能 | 退后原因 |
|------|---------|
| **TaskCreateTool** | teammate 系统基础设施，单机用户暂不需要 |
| **SendMessageTool** | teammate 通信机制，单机用户暂不需要 |

**退后说明**:
- 这两项是 teammate 系统的核心基础设施
- 对单机 TUI 用户无即时价值
- 等 teammate 系统启动后，在 P1 批次中实现

---

## 三、批次1替换决策

### 3.1 /compact：强烈推荐替换

**决策**: **回退批次1的 C 级 stub 实现，用 CC 的 A 级源码替换**

**评估矩阵**:

| 维度 | CC 实现 | TriLC 批次1实现 | 差距 |
|------|---------|---------------|------|
| **代码量** | 1705 行完整实现 | 200 行简单重写 | **巨大** |
| **核心引擎** | 完整压缩引擎 | 基础裁剪 fallback | **功能缺失** |
| **自动压缩** | autoCompact.ts 完整 | 无 | **功能缺失** |
| **后处理** | postCompactCleanup.ts 完整 | 无 | **功能缺失** |
| **消息分组** | grouping.ts 完整 | 无 | **功能缺失** |
| **错误处理** | 完整 PTL 重试机制 | 基础错误处理 | **质量差距** |

**替换收益**:
- 还原度从 30% 提升到 95%+
- 用户获得生产级上下文压缩能力
- 经过 CC 大规模验证，质量有保障

**替换成本/风险**:
- 成本：4h（需适配 TriLC 的依赖）
- 风险：中等（依赖适配可能引入 bug）

### 3.2 TodoWrite：推荐替换

**决策**: **回退批次1的 C 级实现，用 CC 的 A 级源码替换**

**评估矩阵**:

| 维度 | CC 实现 | TriLC 批次1实现 | 差距 |
|------|---------|---------------|------|
| **代码量** | 116 行 | 316 行 | CC 更简洁 |
| **功能完整度** | 100% | 60% | CC 更完整 |
| **verification nudge** | 有 | 无 | **功能缺失** |
| **Task 系统集成** | 有 | 无 | **集成缺失** |
| **类型安全** | 完整 zod schema | 基础 interface | CC 更强 |

**替换收益**:
- 还原度从 40% 提升到 100%
- 获得生产级 verification nudge
- 与 Task 系统统一集成

**替换成本/风险**:
- 成本：1h（需确保不破坏批次1已有的 UI 集成）
- 风险：低（工具相对独立，UI 集成点可控）

### 3.3 其他批次1项目

| 项目 | 替换决策 | 原因 |
|------|---------|------|
| diff 渲染 | 待确认 | 需进一步检查 CC 的 diff 组件实现 |
| 状态行（git/ctx%） | 待确认 | 需检查 CC 状态行的具体实现位置 |

---

## 四、给 FullStack 的执行指令

### 4.1 执行顺序

1. **第一步**：/compact 替换（优先级最高，用户价值最大）
   - 用 CC `services/compact/` 完整替换
   - 适配 TriLC 的消息模型和 PTL 机制
   - 确保 tsc 零错误

2. **第二步**：/init 实现（次优先级，项目记忆刚需）
   - 用 CC `commands/init.ts` 作为基础
   - 适配 TriLC 的 AskUserQuestion 机制
   - 确保生成的 CLAUDE.md 符合 TriLC 项目结构

3. **第三步**：TodoWrite 替换（第三优先级，提升还原度）
   - 用 CC `tools/TodoWriteTool/` 替换
   - 保留批次1已有的 UI 集成点
   - 确保 verification nudge 功能可用

### 4.2 质量门禁

1. **tsc 零错误**：所有代码必须通过 TypeScript 编译
2. **还原度验证**：确保移植功能与 CC 行为一致（非简化 stub）
3. **UI 集成**：确保 TodoWrite 不破坏批次1已有的 UI 集成

### 4.3 依赖适配指南

**/compact 依赖适配**:
- CC 的消息模型 → TriLC 的消息模型
- CC 的 PTL 重试机制 → TriLC 的重试机制
- CC 的技能系统 → TriLC 的技能系统（如果已实现）

**/init 依赖适配**:
- CC 的 AskUserQuestion 机制 → TriLC 的用户交互机制

**TodoWrite 依赖适配**:
- CC 的 Task 系统 → TriLC 的任务管理系统（如果已实现）
- CC 的工具框架 → TriLC 的工具框架

---

## 五、风险与缓解

### 5.1 本批次风险

| 风险 | 缓解措施 |
|------|---------|
| **/compact 依赖适配复杂** | FullStack 先做依赖分析，TestEngineer 重点测试边界情况 |
| **TodoWrite UI 集成破坏** | FullStack 保留批次1的 UI 集成点，仅替换底层实现 |
| **批次时间压力** | 本批次只做 3 项，质量优先 |

### 5.2 后续批次规划

**P1 批次（下一批）**:
1. TaskCreateTool（teammate 核心）
2. SendMessageTool（teammate 通信）
3. /context（上下文管理）
4. /agents（teammate 管理）
5. useCanUseTool（权限核心）

**启动 P1 条件**:
- teammate 系统启动
- 单机用户反馈需要协作功能

---

## 六、决策依据

1. **CTO 真实源码覆盖率审计报告 v2**：`D:\Code\ai\TriMetaverse\docs\workflow\operating-records\2026-W31\cc-fidelity\cto-coverage-audit-v2.md`
2. **CEO 倾向意见**：
   - 普适价值排序：/compact ≈ /init > TodoWrite > TaskCreate/SendMessage
   - 批次质量控制：3-4 项高质量完成 > 5 项半成品
3. **产品定位**：单机 TUI 产品，暂不需要 teammate 系统

---

## 七、版本历史

- **v2.0** (2026-07-29): 基于真实源码审计修正优先级，确认本批次 3 项高质量 A 级复制
- **v1.0** (已废弃): 基于 vendor/cc-tui 的错误优先级

---

**决策完成**

下一步：FullStack 基于此决策执行实现
