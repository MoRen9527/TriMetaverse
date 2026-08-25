# TriCode 代码审计报告（audit-campaign-001 / AC-CODE）

- 审计节点：AC-CODE（FullStackDeveloper 视角，fresh 单次实例）
- 目标仓：`/srv/fleet/TriCode`
- 审计日期：2026-08-25
- 结论速览：P0 = 0，P1 = 4，P2 = 8

## 概述

TriCode 是多代码 AI 工具的统一 glue 层，当前处于 Tier-1 MVP 阶段：仅实现了 `opencode` adapter，其余四个工具（claude/codex/zcode/copilot）在注册表中以注释占位。src 共 4 个文件（types / router / index / adapters/opencode），约 200 行有效代码。整体架构清晰、类型契约完整、使用 `execFile`（非 shell）避免了命令注入大类问题；但 adapter 在平台假设（Windows）、CLI 参数边界（选项注入）、子进程树生命周期（超时只杀直接子进程）三面上存在真实缺陷，且 `mode: 'plan'` 这一安全语义被静默忽略。

## 范围与方法

- **范围**：`src/**`（types.ts、router.ts、index.ts、adapters/opencode.ts）全文通读；`package.json`、`docs/registry/product-state.md` 通读；`dist/` 为构建产物未审；`test/` 目录经 Glob 确认不存在。
- **方法**：先 Glob 摸清布局（仓库极小，src 仅 4 文件），对 runtime 核心 + adapter 全文精读，按审计焦点六条（协议边界/并发污染/进程泄漏/错误归一化/平台假设/DI 面）逐条对照取证；每条发现均落到 file:line。
- **约束**：被审仓全程只读，未执行任何 git 写操作。

## 发现清单

### P0

未发现。（当前 MVP 无网络面、无持久化、无 shell 拼接，未构成安全/数据损坏/崩溃级证据。）

### P1

| # | 发现 | 证据 | 影响 |
|---|------|------|------|
| P1-1 | **Windows 平台假设失效**：默认二进制名 `opencode` 及 `execFile` 调用在 Windows 上无法解析 npm 安装产生的 `.cmd` shim——spawn 不做 PATHEXT 补全，显式指向 `.cmd` 时 Node 会抛 `EINVAL`（Node ≥18 对 `.bat/.cmd` 的安全限制） | `src/adapters/opencode.ts:13,20,32` | TriCade 主分发形态是 Windows 桌面包，Tier-1 工具在目标平台上大概率恒为 `unavailable`，glue 层核心价值落空 |
| P1-2 | **`mode: 'plan'` 被静默忽略**：请求类型定义了 `execute \| plan` 双模式，但 adapter 的 `execute()` 从未读取 `req.mode`，不向 opencode 传任何对应 flag | `src/types.ts:8,18-19`（定义）；`src/adapters/opencode.ts:27-55`（全函数无引用） | 调用方以 plan（只读规划）语义下发任务时实际会执行写操作，属于静默违背调用方安全预期的功能缺陷 |
| P1-3 | **超时仅杀直接子进程，孙进程泄漏**：300s 超时后 `execFile` 只对直接子进程发 SIGTERM，opencode 自身派生的 shell/server 等 孙进程不在击杀范围，也未用进程组/detached 方案兜底 | `src/adapters/opencode.ts:32-36`（timeout 项无 `killSignal`/进程组处理） | 长 Agent 任务超时后在用户机器上残留孤儿进程，与审计焦点"进程生命周期泄漏"直接命中 |
| P1-4 | **CLI 选项注入**：`req.task` 作为裸位置参数拼入 argv，任务文本若以 `-` 开头会被 opencode 解析为 flag（未插入 `--` 终止符）；`req.cwd` 同理受控于调用方 | `src/adapters/opencode.ts:31` | 上游任务描述可改写 CLI 行为（如注入配置覆盖类 flag），协议转换缺少参数边界防护 |

### P2

| # | 发现 | 证据 | 影响 |
|---|------|------|------|
| P2-1 | **exitCode 归一化产生 NaN**：错误路径对 `err.code` 做 `parseInt`，但当 code 是 errno 字符串（`ENOENT`/`ETIMEDOUT`/`EACCES`）时得到 `NaN` 而非 `undefined` | `src/adapters/opencode.ts:51` | 二进制不存在/超时场景下 `exitCode: NaN`，JSON 序列化为 null，下游数值判断行为不可预期 |
| P2-2 | **原始堆栈与根因丢失**：结果仅保留 `error.message`，无 stack 字段；`checkAvailability` 的 catch-all 把权限错误、超时、找不到二进制一律折叠为 `unavailable` | `src/adapters/opencode.ts:50,22-24` | 排障时无法区分"没安装/装坏/权限拒绝"，违背错误归一化应保留根因的原则 |
| P2-3 | **auto 探测串行、无缓存、超时线性放大**：每次请求都重新按 tier 顺序 await 探测，每个探测自带 5s 硬超时；五档齐全时最坏 ~25s 才开始真正执行 | `src/router.ts:25-31`；`src/adapters/opencode.ts:20` | 高频调用面（TriLC 本地循环）延迟被可用性探测支配 |
| P2-4 | **零测试覆盖**：`test` 脚本指向 `test/**/*.test.ts`，但仓库不存在任何测试文件；且 `node --test` 的 glob 支持随 Node 版本变化，engines 允许 ≥20.0 | `package.json:22`；Glob `{test,tests}/**/*.ts` = 空 | CI 门禁形同虚设，adapter 边界行为无回归保护 |
| P2-5 | **CJS 导出声明在部分支持版本上不可用**：`type: module` 下 `"require": "./dist/index.js"` 映射到 ESM 文件，Node 20.0–20.18 / 22.0–22.11 会抛 `ERR_REQUIRE_ESM`，而 engines 未设下限护栏 | `package.json:9-17` | CJS 消费方（如 TriLC 若为 CommonJS）在合法版本区间内加载即崩 |
| P2-6 | **`'auto'` 混入注册表键类型**：`CodeTool` 联合类型同时承担"选择器值"和"adapter 键"两个职责，导致 `Map<CodeTool,…>` 中 `'auto'` 永远不可能有值，router 需特判 | `src/types.ts:5`；`src/index.ts:11`；`src/router.ts:20` | 类型建模含糊，后续接入 Tier-2 时易复制错误模式 |
| P2-7 | **硬编码超时无配置面**：可用性探测 5s、执行 300s 均写死，唯一可配置项是二进制路径 env | `src/adapters/opencode.ts:20,33` | 合法长任务超过 5 分钟必被强杀且无逃生口 |
| P2-8 | **产品状态文档与代码漂移**：`product-state.md` 仍写"尚无工程代码，处于 DISCOVERY 阶段"，而 src 已落地 Tier-1 MVP | `docs/registry/product-state.md:62`（对照 `src/index.ts:14`） | 违反 source-of-truth 秩序，后续编排层据文档决策会误判模块成熟度 |

## 质量总评

**评级：C+（MVP 可接受骨架，但不可直接承载生产调用）。**

优点是实在的：接口契约（`CodeToolAdapter`）干净、router 以依赖注入方式接收 adapters Map（可测性好）、`execFile` 非 shell 调用从根上规避了命令注入、结构化错误结果契约一致、模块级单例无可变共享状态因此并发污染风险很低。缺点集中在 adapter 实现深度不足：它本质上是"能跑通 POSIX + 短任务 + 正常退出"这一条窄路径，Windows 分发形态、plan 语义、超时进程树清理、errno 归一化四处都还没对齐真实运行环境。建议 Wave 2 动工前优先修 P1-1/P1-2（Windows 探活与 plan 透传），并把 P1-3/P1-4 作为 adapter 接口演进的一部分（引入 `--` 终止符与进程组终止策略）。

## 未覆盖

- `dist/` 构建产物未逐一比对源码（视为生成物）。
- `tsconfig.json` 未读，编译严格度（strict/noUncheckedIndexedAccess）未核实。
- opencode CLI 自身的真实 flag 语义（`--cwd`、plan 模式对应项）未实测验证，P1-2/P1-4 基于 argv 协议通用规则推断。
- git 历史/提交规范、CI workflow 配置未检查。
- Tier 2–3 四个占位 adapter 无实现，无从审计。
