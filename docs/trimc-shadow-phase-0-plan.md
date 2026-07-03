# TriMC Shadow Phase-0 方案

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/trimc-shadow-phase-0-plan.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-04

当前文件是 TriMetaverse 关于 `TriMC shadow Phase-0` 的本地方案真源，用于记录当前阶段的宿主切换前方案、边界和最小闭环判断；它不是 TriCompany 公司级 workflow 或产品真源。

版本：V0.1
日期：2026-04-19
状态：当前阶段方案

## 1. 文档定位

本文用于把当前已经形成的判断，收口为一份可执行的 `TriMC shadow Phase-0` 方案。

本文只回答五个问题：

1. 当前阶段为什么不是直接做 `TriMC` 正式宿主切换，而是先做 `TriMC shadow`。
2. `OpenClaw` 在当前阶段应如何被吸收进 `TriMC`。
3. 最小版 `OpenClaw` 应先跑通哪些能力，哪些能力应后置。
4. 如何同时满足 TriMetaverse 架构适配、上游开源复用、平滑升级和后向兼容。
5. 哪些事项要等 `CPO / CTO` 正式上岗后再进入“完全复刻”阶段。

本文不表示以下事项已经完成：

- `TriMC` 已完成正式宿主切换
- `OpenClaw` 已被 `TriMC` 全量复刻
- `CPO / CTO` 已正式上岗接管
- `TriMC` 已进入生产级服务域高可用形态

## 2. 当前成立的判断

当前阶段成立的判断如下：

1. `TriMC` 吸收 `OpenClaw` 的正确方向，不是“把一个独立 OpenClaw 服务先跑起来再说”，而是把它作为 `TriMC shadow` 的能力基线，先服务于未来服务域主控的最小可运行验证。
2. 当前总助宿主仍保留在本地 `copilot` 宿主；`TriMC shadow` 是当前宿主可调用的服务域模拟面，不等于正式宿主切换已经成立。
3. `OpenClaw` 对 `TriMC` 的价值主要在 `gateway / web / cli / cron / webhook / channel / hook` 这些服务域或控制面相关能力。
4. `Hermes` 的价值主要在 memory 与 cognition 侧；它不需要为了“充分利用开源”而额外复刻 `gateway / cli / cron / web` 这类不属于其目标层的表面能力。
5. 当前阶段要先跑通一个最小版 `OpenClaw`，等 `CPO / CTO` 正式上岗后，再决定是否进入“完整复刻上游项目”的后续阶段。

## 3. 两条链必须分开

当前阶段有两条不同的演进链，不能混写。

### 3.1 开源吸收链

开源吸收链统一写为：

`reference -> 本地仓/vendor -> 本地仓真实实现`

含义分别是：

- `reference`：上游阅读、比对和架构拆解材料，不是当前运行时真源。
- `vendor`：本地冻结的上游基线快照，优先保持上游代码原貌，便于回看、升级和提交 PR。
- `本地仓真实实现`：在本地架构语义下新增的 wrapper、adapter、policy gate、audit pipeline、task semantics 和运行时桥接层。

### 3.2 宿主演进链

宿主演进链统一仍写为：

`源码 -> shadow test -> 正式接管`

这里的 `TriMC shadow Phase-0` 只属于“目标正式宿主切换前的 shadow 验证与最小闭环方案”，不等于 `TriMC` 已经完成正式接管。

## 4. Phase-0 核心原则

### 4.1 先适配 TriMetaverse 总体架构，再谈复刻深度

`OpenClaw` 的吸收第一优先级不是“尽快像上游一样全能”，而是“先符合 TriMetaverse 的总体架构边界”。

因此，任何局部实现都应先回答：

1. 它在 `TriMC` 中的角色是什么。
2. 它是否服务于未来服务域主控语义。
3. 它是否破坏了 `TriMC` 自有的 policy、audit、task semantics 边界。

如果答案不清楚，就不进入当前阶段最小实现。

### 4.2 先从最小架构抽取实现验证，再渐进式扩展

当前阶段不直接追求“完整复刻 OpenClaw”。

当前阶段只做三件事：

1. 抽出最小服务域闭环。
2. 验证这条闭环能否被当前总助宿主真实调用。
3. 在不破坏上游可升级性的前提下，逐步补进更多能力。

### 4.3 尽量使用原项目代码，降低长期维护成本

当前默认策略应是：

1. 优先直接使用上游代码。
2. 其次通过 wrapper、adapter 和 config overlay 增加本地语义。
3. 只有在上游代码无法支撑当前阶段目标时，才做最小必要本地 patch。

这样做有四个好处：

1. 出现通用问题时，可以向上游提交 PR 修复。
2. 上游项目继续演进时，本地升级成本更低。
3. 本地不会过早演变成难以回溯的重 fork。
4. `TriMC` 自有层和 `OpenClaw` 上游层的边界更清楚。

### 4.4 明确排除项不必复刻

充分利用开源代码，不等于必须把上游全部表面能力都照搬。

如果某类能力已经被 TriMetaverse 架构明确排除，或不属于当前模块的目标层，就不进入当前复刻范围。

例如：

- `Hermes` 吸收时，不需要额外复刻 `gateway / cli / cron / web` 这类不属于其核心目标层的能力。
- `TriMC` 吸收 `OpenClaw` 时，则恰恰需要利用它在 `gateway / web / cli / cron / webhook / channel` 这些服务域表面的成熟实现。

### 4.5 完整复刻是后续阶段目标，不是当前现状

在 `CPO / CTO` 正式上岗前，文档中只能把“完整复刻上游项目”写成后续阶段目标，不能写成当前现状或当前前置。

## 5. Phase-0 目标

`TriMC shadow Phase-0` 的目标不是完成 `TriMC`，而是跑通一个最小可运行服务域闭环。

最小目标应同时满足以下五点：

1. `TriMC shadow` 能在 Windows 的 `WSL` 中本地运行。
2. 当前总助宿主可以把它当作一个可调用的服务域模拟面使用。
3. 底层优先复用 vendored `OpenClaw` 代码，而不是先重写一套平替。
4. 至少跑通一条调度闭环，例如 `web / cli -> agent -> cron or heartbeat -> delivery`。
5. 整条链条可继续渐进式扩展到 chat channel、email hook、task dispatch 和更多服务域能力。

## 6. Phase-0 不做什么

当前阶段明确不做以下事项：

1. 不宣称 `TriMC` 已经完成正式宿主切换。
2. 不追求完整复刻 `OpenClaw` 的全部渠道矩阵和全部外围节点能力。
3. 不先做服务域高可用、主控租约、热备主控和多节点集群。
4. 不先打通 `TriMem / TriChain / TriWeb4 / TriLC` 的全量正式集成。
5. 不先把当前 Copilot 宿主迁出，只把它与 `TriMC shadow` 接起来。
6. 不把所有 `OpenClaw` 代码都改造成 `TriMC` 自有代码；当前阶段仍以 vendor 基线复用为主。

## 7. 推荐吸收方式

### 7.1 `reference` 层

`reference` 层用于：

- 阅读上游设计
- 比对上游行为
- 判断哪些模块值得进入 `vendor`
- 为后续升级和 PR 提交保留参照

它不应被写成当前运行时真源。

### 7.2 `vendor` 层

`vendor` 层用于：

- 冻结当前选定的上游基线
- 尽量原样保留上游代码结构
- 记录本地使用的是哪个上游提交或版本语义
- 让后续 diff、升级和回归检查更直接

当前阶段对 `vendor/openclaw` 的原则应是：

1. 尽量不改
2. 若必须改，只做最小 patch
3. 能回 upstream 的 bug fix 尽量回 upstream

### 7.3 `TriMC` 自有实现层

`TriMC` 自有实现层只承载 TriMetaverse 特有语义，例如：

- `Service Controller`
- `Task semantics`
- `Policy Gate`
- `Audit Pipeline`
- `host bridge`
- `task dispatch`
- `identity overlay`

原则上应避免把这些 TriMetaverse 自有语义直接侵入上游 `OpenClaw` 源码深处。

## 8. 当前最小架构切片

当前建议从一个单机、单活、单服务域切片开始。

### 8.1 运行载体

- 运行位置：Windows 本机上的 `WSL`
- 运行形态：单机 `TriMC shadow`
- 控制面基线：vendored `OpenClaw Gateway`
- 当前宿主：本地 `copilot` 宿主继续保留

### 8.2 模型路径

模型路径建议按下面顺序使用：

1. 第一优先：`OpenClaw` 内置 `github-copilot` provider
2. 第二优先：`GLM / Z.AI` 作为 fallback provider
3. 当前阶段不优先依赖 `copilot-proxy` 这种 VS Code 强依赖路径

原因：

- `TriMC shadow` 需要尽量贴近未来服务域模拟，而不是继续依附 VS Code 进程本身
- 直连 `github-copilot` provider 更符合当前“服务域影子面”的目标

### 8.3 最小能力面

当前阶段建议先保留以下能力：

1. `gateway`
2. `web`
3. `cli`
4. `agent runtime`
5. `cron or heartbeat`
6. `webhook` 基础能力

渠道和邮件能力不必一开始全开，但应保留可增量接入的结构。

## 9. Phase-0 的推荐子阶段

为了满足“最小闭环先跑通，再渐进式扩展”，当前建议把 `Phase-0` 再拆成三个小步。

### 9.1 Phase-0A：运行基线跑通

目标：先让 `TriMC shadow` 作为单机服务域模拟面启动成功。

最小交付：

1. `WSL` 内单机 gateway 可启动
2. `github-copilot` provider 可完成登录与一次最小调用
3. `web` 或 `webchat` 可完成一次最小会话
4. `cli` 可完成一次最小 agent 触发

验收重点：

- 当前总助宿主可以确认 `TriMC shadow` 已成为一个可调用的外部执行面
- 不要求外部社交通道和 email 已接入

### 9.2 Phase-0B：调度闭环跑通

目标：在 `TriMC shadow` 内先跑通一条最小调度链。

最小交付：

1. `cron` 或 `heartbeat` 二选一先跑通
2. 至少有一个固定任务能被自动触发
3. 触发结果能回到 `webchat`、`last delivery` 或当前控制面
4. 有最小审计记录或运行日志可供复盘

建议优先级：

- 先做 `heartbeat` 或单条 `cron`
- 暂不追求多任务编排

### 9.3 Phase-0C：外部入口增量接入

目标：在基线稳定后，补入一个外部入口能力。

候选入口：

1. 一个外部 chat channel
2. `Gmail` webhook or hook path
3. 一个最小 task dispatch 入口

当前建议：

- 优先只选一个外部入口，不并行开多个入口
- 若 `Gmail` 依赖链过重，则先上一个更轻的 chat channel

## 10. 当前推荐的最小闭环

当前最值得先跑通的不是“全能力 OpenClaw”，而是下面这条最小闭环：

1. 当前总助宿主发起一个服务域请求
2. 请求进入 `TriMC shadow`
3. `TriMC shadow` 通过 vendored `OpenClaw` 跑通一次 agent 执行
4. 定时器或 heartbeat 能再触发一次最小自动任务
5. 结果通过 `web / webchat / last delivery` 回到当前观察面

这条链一旦成立，就说明：

- `TriMC shadow` 已经具备最小服务域模拟价值
- 后续可以沿着 channel、email、task dispatch 继续增量扩展
- 当前 Copilot 宿主与未来 `TriMC` 之间已经出现真实桥接面，而不再只是文档概念

## 11. 向后扩展顺序

在 `Phase-0` 跑通后，建议按下面顺序扩展，而不是一次性全补：

1. 再补一个外部 chat channel
2. 再补一个 `email hook` 或 `Gmail` 入口
3. 再补 `Task Controller` 级别的 task envelope 与 dispatch 语义
4. 再补更完整的 `policy gate` 和 `audit pipeline`
5. 最后再评估是否进入“接近完整复刻上游项目”的阶段

## 12. 对“完全复刻”的当前口径

“完全复刻”在当前阶段只能这样写：

1. 它是后续阶段目标
2. 它以当前最小闭环成功为前提
3. 它以 `CPO / CTO` 正式上岗后的产品与技术接管判断为前提
4. 它仍应优先保持上游可升级性，而不是把本地变成不可回退的深 fork

因此，当前正确口径不是：

- 立刻完整复刻 `OpenClaw`

而是：

- 先跑通一个最小版 `OpenClaw`
- 再沿 `reference -> vendor -> 本地仓真实实现` 逐步扩展
- 直到在需要时进入接近完整复刻的后续阶段

## 13. 当前结论

当前阶段最合理的方案是：

1. 在 `TriMC` 内继续以 vendored `OpenClaw` 作为能力基线。
2. 先在 Windows 的 `WSL` 上运行单机 `TriMC shadow`。
3. 让当前总助宿主继续保留，但开始把 `TriMC shadow` 当作可调用服务域模拟面使用。
4. 先用上游原生能力跑通最小 `gateway + web + cli + agent + cron or heartbeat` 闭环。
5. 把完整复刻、全渠道接入、服务域高可用和更深层双域治理，保留到后续阶段和 `CPO / CTO` 上岗后再推进。

这条路线能同时满足：

- TriMetaverse 架构优先适配
- 充分利用开源代码优势
- 平滑升级
- 后向兼容
- 当前阶段最小可运行验证
