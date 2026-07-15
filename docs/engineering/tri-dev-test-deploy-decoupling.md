# TriDev ↔ TriTest ↔ TriDeployment 解耦架构设计

版本：V1.0
日期：2026-07-13
状态：联审通过（CPO+CTO+CEO），已落档

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/engineering/tri-dev-test-deploy-decoupling.md
- syncMode: source-only
- lastSyncedAt: 2026-07-13
- 关联决议：2026-07-13 CPO+CTO联审+CEO中央裁决

## 1. 背景

2026-07-13 CPO（小乔）+ CTO（小狄）联审三项议题，CEO 中央裁决：

| 议题 | 决议 |
|---|---|
| TriTest 归属 | **独立模块**（CPO+CTO一致） |
| TriDeployment 归属 | **独立模块**（CEO采纳CTO，否决CPO"回归TriDev"） |
| 验证器第四层 | **APPROVE**（横切面，非平级层） |

此前 `docs/三元宇宙架构与模块说明.md` 将 TriTest/TriDeployment 写成"并入 TriDev"的历史兼容占位，已与代码现实脱节。本文档确立三者解耦架构，替代旧口径。

## 2. 核心设计原则

### 2.1 职责切分

```
TriDev（流程编排器）    → 管 WHEN（阶段顺序）和 WHO（gate owner）
TriTest（测试执行引擎）  → 管 HOW（测试怎么跑）
TriDeployment（部署执行引擎）→ 管 HOW（部署怎么执行）
```

### 2.2 解耦 interface：CLI Contract

TriDev 不包含 TriTest/TriDeployment 的代码，只通过 CLI 命令调用它们：

```
TriDev Phase Engine (Python)  ──shell exec──→  tritest <command> <args>
TriDev Phase Engine (Python)  ──shell exec──→  trideploy <command> <args>
```

类比：TriDev = GitHub Actions workflow 文件，TriTest = Jest/pytest，TriDeployment = Docker/kubectl。

### 2.3 独立治理

- 各自独立版本号、独立发布周期
- 各自独立 Git 仓库（`../TriTest/`、`../TriDeployment/`）
- 各自独立 registry agent（`TriTestBusinessStrategyRegistry` 等）
- 换测试框架只改 TriTest，不影响 TriDev

## 3. 架构图

```
┌─────────────────────────────────────────────────────────┐
│                    TriDev（IPD 流程编排）                  │
│                                                         │
│  DISCOVERY → INTELLIGENCE → DESIGNING → CODING          │
│      ↓           ↓             ↓           ↓            │
│  VERIFY-INTEGRATION → REDTEAM → QA → DEPLOYMENT         │
│      ↓                ↓         ↓        ↓              │
│  ASSURANCE → DELIVERY                                   │
│                                                         │
│  每个 gate 的职责：                                      │
│    1. 调用外部工具执行（CLI call）                        │
│    2. 接收结构化结果（stdout/JSON）                       │
│    3. 做 gate 决策（APPROVE / FREEZE / ESCALATE）        │
└───────┬───────────────────────────┬─────────────────────┘
        │ CLI call                   │ CLI call
        ▼                            ▼
┌──────────────────┐     ┌──────────────────────────┐
│   TriTest         │     │   TriDeployment           │
│   （测试执行引擎） │     │   （部署执行引擎）         │
│                   │     │                           │
│  · CLI            │     │  · CLI                    │
│  · unit-runner    │     │  · deployer.ts            │
│  · integration    │     │  · registry.ts            │
│  · system         │     │  · targets/ (local, ...)  │
│  · security       │     │  · 环境生命周期管理        │
│  · e2e            │     │                           │
│  · 验证器框架     │     │                           │
│  · reporters      │     │                           │
│                   │     │                           │
│  输出：test-report│     │  输出：deployment-evidence │
│        validator  │     │        deploy-result      │
│        -result    │     │                           │
└──────────────────┘     └──────────────────────────┘
```

## 4. Phase Gate → CLI 映射表

基于 `TriDev/tridev.config.json` 十阶段定义，各 gate 调用关系：

| TriDev Phase | Gate Owner | CLI 调用 | 输入 | 输出 | Gate 决策点 |
|---|---|---|---|---|---|
| VERIFY-INTEGRATION | CTO | `tritest run --phase integration --module <path>` | 模块代码路径 | `TestRunSummary` | CTO 审阅报告后裁决 |
| REDTEAM | CTO | `tritest run --phase security --module <path>` | 模块代码路径 | `TestRunSummary` | CTO 审阅报告后裁决 |
| QA | CTO | `tritest validate --spec-baseline <hash> --module <path>` | spec hash + artifact 路径 | `ValidatorResult` | CTO 审阅验证结果后裁决 |
| DEPLOYMENT | CTO | `trideploy deploy --target <env> --module <path>` | deploy target + 模块 | `DeployResult` | CTO 审阅部署证据后裁决 |
| ASSURANCE | CTO | `tritest run --phase e2e --endpoint <url>` | 部署后端点 | `TestRunSummary` | CTO 审阅报告后裁决 |

> 注：上表为当前设计基线。实际 CLI 接口参数和输出格式由 CTO 在 `TriTest`/`TriDeployment` 侧精确定义，TriDev 侧按约定调用。

## 5. 第四层验证器框架（TriTest 横切能力）

验证器是 TriTest 的核心横切能力，不绑定具体测试阶段：

```
积木产物 + spec基线 → Validator → PASS/FAIL + 差距报告
```

- 每个 IPD 积木产出（code / doc / config）都经过对应的验证器
- 验证器 contract：(积木产物, spec基线) → { result: PASS|FAIL, gapReport }
- 验证器可组合：unit 验证器 → integration 验证器 → system 验证器 → e2e 验证器
- 复用性：TriTest 的验证器框架可供 TriCompany 直接调用（不经 TriDev 编排）

## 6. 与旧口径的差异

| 项目 | 旧口径（V0.2） | 新口径（V1.0） |
|---|---|---|
| TriTest 归属 | 并入 TriDev，待归档 | **独立模块**，第四层验证器框架 |
| TriDeployment 归属 | 并入 TriDev，待归档 | **独立模块**，部署执行引擎 |
| 与 TriDev 关系 | 包含（子模块） | **CLI contract 解耦**（调用） |
| TriDev 职责 | 含测试+部署实现 | 纯流程编排+gate决策 |
| 技术栈一致性 | 假设同语言 | TriDev=Python, TriTest/Deployment=TypeScript（接受差异） |

## 7. 后续工程行动

以下由 CTO 牵头，TriDev/TriTest/TriDeployment 三模块协同：

1. ~~**CLI interface spec 精确定义**~~ ✅ 已交付 → `docs/engineering/tri-dev-test-deploy-cli-interface-spec.md` V1.0
2. **TriDev phase engine 实现**：按 CLI contract 在对应 phase gate 调用 `tritest`/`trideploy`
3. **TriTest SpecDrivenValidator runner 实现**：验证器框架核心引擎
4. **TriDeployment target 扩展**：从 local 扩展到 staging/production 等目标
5. **集成测试**：TriDev phase engine → TriTest/TriDeployment 端到端验证
