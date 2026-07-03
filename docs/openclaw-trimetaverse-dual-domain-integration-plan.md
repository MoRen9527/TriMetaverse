# OpenClaw 与 TriMetaverse 双域融合改造方案

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/openclaw-trimetaverse-dual-domain-integration-plan.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-04

当前文件是 TriMetaverse `OpenClaw` 双域融合改造方案的本地真源，用于维护当前架构吸收判断和模块边界；它不是 TriCompany 公司级 workflow 或产品真源。

补充说明：当前阶段更窄的最小落地拆解见 `docs/trimc-shadow-phase-0-plan.md`。

## 1. 目标与结论

本方案的目标，不是把 OpenClaw 原样嵌进 TriMetaverse，而是把它已经验证过的三类能力拆出来，接入 TriMetaverse 白皮书定义的双域执行体系：

- 第一，复用 OpenClaw 已成熟的 Gateway WebSocket 控制面、设备配对、Node 能力暴露与 node.invoke 调用链，作为 TriMetaverse 双域调度体系的底层传输与设备接入基线。
- 第二，在服务域把 TriStaciss 定位为统一模型 API 转接平台与任务入口网关，把真正的主控编排、节点调度、权限门禁和执行桥接沉淀到 TriMC 中，而 TriMC 的底层实现以 “OpenClaw Gateway + Policy Gate + Audit Pipeline” 组合为主，不再以 VS Code 或 VSCodium 宿主融合为前提。
- 第三，在本地域把 PC、移动端设备侧的双态安装体、节点、本地 Planner、ToolBus 和执行反馈，从 TriPilot 中剥离出来，沉淀为独立项目 TriLC，让 TriPilot、TriAvatar、TriMobile 回归任务入口和观察面。

同时，用户体系不再分散在各前台项目内部：

- TriPilot、TriAvatar、TriMobile 共同作为用户注册和登录入口。
- 注册与登录请求由 TriStaciss 转发到 TriMem。
- TriMem 作为用户与社区成员后台管理系统，承接用户主档、成员关系、权限和审核。
- TriMem 再与 TriChain 和 TriWeb4 建立钱包、身份、合约权限的关联。

结论是：

- OpenClaw 适合作为 TriMetaverse 的“本地域节点接入层 + 服务域 WS 基线 + 设备控制面基线”。
- TriStaciss 应主要承担统一 OpenAI API 兼容入口、tag 路由、provider key 托管和任务入口网关，而不是直接承载本地执行宿主耦合逻辑。
- TriMC 应作为服务域主要代码实现，负责 Service Controller、节点调度、执行桥接、风险门禁、隐私保护和审计汇聚。
- TriLC 应作为本地域主要代码实现，负责客户端态到节点态升级、本地 Planner、ToolBus、任务执行反馈和本地状态持久化。
- TriMem 应作为统一用户与社区成员后台系统，TriChain 与 TriWeb4 分别承担链上身份与合约能力承载。
- 最合理的路径是“TriStaciss 做 API Gateway，TriMC 做服务域主控，TriLC 做本地域主控，TriPilot、TriAvatar、TriMobile 统一做任务与注册入口，TriMem 统一管用户，TriChain 和 TriWeb4 提供链上身份与合约能力”。

## 2. 与白皮书的对齐边界

TriMetaverse 白皮书已经明确了几个关键约束，本方案全部遵守：

- 服务域发行版与本地域发行版是两套不同代码制品，不是同一程序换部署位置。
- 本地域安装体有双态：未开通钱包时是客户端态，完成钱包绑定与节点登记后才升级为节点态。
- 服务域控制面必须区分热路径控制与冷路径存证，区块链只做资格、治理与结算，不直接承担秒级控制动作。
- 本地域 active 节点集合必须由调度与资源能力域维护，不能把所有已安装设备都当成同等级执行节点。

因此，OpenClaw 进入 TriMetaverse 后的定位应当是：

- 在服务域，它为 TriMC 提供 Gateway 协议、WebSocket 接入、Node Registry、设备控制面与远程执行基线；风险确认、高危拦截、隐私脱敏由 TriMC 的 policy gate 叠加实现。
- 在本地域，它为 TriLC 提供 Node Host、设备能力上报、node.invoke、本地命令暴露与远程执行转发。
- 在 TriStaciss 之前，它不直接替代统一模型 API 网关，也不直接替代 provider 路由层。

同时，TriStaciss 的定位应当明确为：

- 统一 OpenAI API 兼容入口。
- 基于 tag 和辅助字段的 provider plus model 路由层。
- 统一托管平台侧 provider key、模型目录、路由策略和请求审计。
- 面向 AI 任务和用户入口请求的网关，收到任务后把任务转发给服务域主控，收到注册和身份关联请求后转发给 TriMem。

同时，TriMem、TriChain、TriWeb4 的职责应当明确为：

- TriMem：用户主档、社区成员管理、权限、审核、注册登录、钱包关联记录。
- TriChain：链上身份、公链账户、链上确权、节点收益结算底层承载。
- TriWeb4：Web3 or Web4 合约、DID、权限合约、钱包连接和前端合约适配。

OpenClaw 当前的强项在“单用户个人助手”和“单 Gateway + 多外围节点”模式，而 TriMetaverse 白皮书要求的是“平台级双域任务网络”。两者之间至少有六个必须补齐的差距：

### 4.1 服务域控制面层级不够

OpenClaw 的 Gateway 可以作为单活控制面基线，但白皮书要求的服务域结构是：

- 服务网关集群
- 主控编排池
- 一致性与身份平面
- 服务调度器
- 服务域 Worker Pods

这意味着不能直接把 OpenClaw Gateway 当成最终主控池，而应把它放到服务域接入层或单活控制面基线层。

### 4.2 设备配对不等于节点身份

OpenClaw 的设备配对解决的是“这台设备是否被允许接入 Gateway”。

TriMetaverse 白皮书要求的节点身份还包括：

- 钱包绑定
- 节点登记
- 可承载角色能力申报
- 节点信誉与能量积分账本
- 服务域主控角色或本地域 active/备用状态

因此，设备配对只能作为节点接入前置，不可直接替代钱包身份与节点治理身份。

### 4.3 node.invoke 缺少平台级任务语义

OpenClaw 的 node.invoke 更像“在某个已接入设备上调用一个本地命令”。

TriMetaverse 需要的是：

- 任务创建
- 任务约束下发
- 工件分片上传
- 证据归档
- 结果判定
- 挑战与复核
- 奖励记账

所以 node.invoke 适合做执行面 RPC，不适合直接做任务市场协议本身。

### 4.4 OpenClaw 默认是设备外围语义，不是双态安装体语义

OpenClaw 的 node 是外围设备。TriMetaverse 的本地域安装体则必须具备双态：

- 客户端态：仅作为用户入口、本地工具入口、任务发布入口。
- 节点态：钱包绑定后进入可调度设备池，参与贡献记账与收益结算。

因此，本地域产品包装不能直接照搬 OpenClaw 的“Node App”表达，而应提升为“TriPilot 本地域安装版”。

### 4.5 审计、证据与结算未接入 TriMetaverse 账本

OpenClaw 有日志、状态与配对存储，但没有白皮书要求的：

- 任务证据清单
- 结果摘要上链
- 节点级奖励账本
- 用户级归属账本
- 平台级分账账本

### 4.6 单 Gateway 不是最终高可用形态

白皮书强调服务域不能无上限扩张活跃主控，但也不能永久停留在单 Gateway。最终需要：

- 候选主控
- 热备主控
- 活跃主控租约
- 网关路由摘要刷新

OpenClaw 当前更适合阶段 0-1 的单活基线，不是阶段 2 之后的最终控制面。

## 5. 目标融合架构

### 5.1 服务域总体结构

服务域建议拆成两层，而不是全部放进 TriStaciss：

1. TriStaciss API Gateway Layer

- 提供统一 OpenAI API 兼容入口。
- 接收 tag、modelTag、workspace、policy、taskHint 等辅助字段。
- 依据 tag 和辅助字段把请求路由到具体 provider 和 model。
- 统一托管平台在上游 provider 申请到的 key，不向客户端暴露真实上游凭据。
- 对于普通模型调用，直接完成 API 转接；对于任务型请求，转发给服务域主控；对于用户注册与身份请求，转发给 TriMem。

1. TriMem Identity And User Layer

- 承接用户注册、登录、社区成员管理、审核与权限。
- 维护用户主档、成员关系、账号状态、钱包绑定记录。
- 对 TriPilot、TriAvatar、TriMobile 提供统一用户真相源。

1. TriChain And TriWeb4 Chain Layer

- TriChain 提供链上账户、收益确权、节点奖励与身份锚定。
- TriWeb4 提供 DID、钱包连接、合约适配、Web3 or Web4 能力封装。
- 该层不直接承载热路径控制，而承载身份和结算的链上映射。

1. Service Controller Layer

- 由 OpenClaw Gateway、TriMC task controller、policy gate 和 audit pipeline 组合形成。
- 承担主控编排、节点控制、任务下发、任务回执、执行桥接与安全门禁。
- 这是白皮书中的“主控编排池”真正落点。

1. Identity And Consensus Layer

- 管理设备配对结果、钱包绑定结果、节点登记状态、角色授予、租约授予、active or standby 状态。
- 对 TriStaciss、Service Controller、TriPilot 本地域节点提供统一身份真相源。

1. Scheduler And Worker Layer

- 负责服务域任务分流。
- 一部分任务走模型 API 转接。
- 一部分任务走 Service Controller 到本地域节点。
- 一部分任务走服务域 Worker Pods、批处理任务或长期服务进程。

1. Evidence And Settlement Layer

- 负责工件索引、执行摘要、验证回执、节点贡献记录和收益结算。
- 仍与热路径主控解耦。

### 5.2 本地域总体结构

本地域建议以 TriLC 为宿主，把 OpenClaw Node Host 作为执行引擎，把 TriPilot 从执行载体中剥离出来：

1. TriLC Runtime Shell

- 作为本地域常驻控制器存在，不依赖 TriPilot 窗口是否打开。
- 负责与服务域保持长连接、恢复任务、维持本地状态和执行生命周期。

1. Local Planner

- 负责本地任务拆解、状态判断、失败重规划、人工确认点触发。
- 它消费服务域任务约束，但保留本地执行自治。

1. Local ToolBus

- 统一封装本地 shell、browser、desktop automation、mobile bridge、file ops、build/test 工具。
- 在具体实现上，可把 OpenClaw node.invoke 作为远程调用接口层，把本地工具适配器封成 commands。

1. Local Context Adapter

- 负责在需要代码仓库、文件系统、终端、浏览器或移动设备上下文时，以统一 capability 适配层对外暴露本地能力。
- TriLC 只消费能力抽象，不依赖 VS Code、VSCodium 或任意特定 IDE 宿主。

1. OpenClaw Node Host Runtime

- 负责与服务域 Gateway 建立 WS 连接。
- 上报设备能力、平台、命令、权限状态。
- 执行来自服务域的 node.invoke 或任务执行指令。

1. Wallet Upgrade Adapter

- 在客户端态下不启用节点记账。
- 当用户完成钱包绑定并明确同意加入节点网络后，触发 Node Identity Service 完成节点升级：
  - device paired -> wallet bound -> node registered -> eligible -> active or standby

1. TriPilot And TriAvatar And TriMobile Client Views

- 只承担用户注册、任务发起、审批、节点状态展示和收益展示。
- 可以随时打开查看本地域和服务域状态，但不再承载本地执行生命周期。

### 5.3 两条发行线

必须明确拆成两条发行线：

#### A. 服务域发行线：TriMC Distribution

制品内容：

- TriStaciss FastAPI Gateway
- Provider Router
- Provider Key Vault Adapter
- Task Ingress Gateway
- User Ingress Forwarder
- TriMem Identity Adapter
- TriMC Service Controller
- Policy Gate And Privacy Guard
- OpenClaw Gateway Core
- Identity And Consensus Service
- Scheduler
- Audit/Evidence Service
- Wallet/Settlement Adapter

部署形态：

- 单机 docker compose 版，先跑 MVP
- k8s 版，进入阶段 2 以后

#### B. 本地域发行线：TriLC Distribution

制品内容：

- TriLC Runtime Shell
- Local Planner
- Local ToolBus
- Local Context Adapter
- OpenClaw Node Host Runtime
- Wallet Upgrade Adapter

外部接入端：

- TriPilot
- TriAvatar
- TriMobile

部署形态：

- Windows/macOS 常驻安装版优先
- iPhone/Android 移动轻节点后续进入

## 6. 协议设计建议

不建议重造全部传输层，建议采用“OpenClaw Gateway WS 作为传输基线 + TriMetaverse 任务协议作为上层语义”。

### 6.1 保留的 OpenClaw 原生协议能力

- connect 握手
- role: operator / node
- device identity
- pairing approval
- node.list / node.describe / node.invoke
- 基础事件推送

### 6.2 新增的 TriMetaverse 任务协议事件

在 Gateway 之上新增 TMV 命名空间事件或 RPC：

- tmv.task.create
- tmv.task.offer
- tmv.task.accept
- tmv.task.progress
- tmv.task.artifact.commit
- tmv.task.result.submit
- tmv.task.verify.request
- tmv.task.verify.result
- tmv.node.wallet.bind
- tmv.node.register
- tmv.node.active.promote
- tmv.node.active.demote
- tmv.node.reward.append

### 6.3 节点身份升级流程

节点身份建议采用四层递进，而不是一步到位：

1. Device Paired

- 仅说明设备被 Gateway 接纳。

1. Operator Client Ready

- 可作为本地客户端使用 TriPilot、TriAvatar 或 App。

1. Wallet Bound

- 设备和钱包身份产生绑定关系。

1. Registered Node

- 节点进入 TriMetaverse DeviceNode 编目体系。
- 之后才有 active/standby、贡献记账、收益分账资格。

这一步能直接满足白皮书里“本地安装体先是客户端，再升级为节点”的语义。

## 7. 组件映射表

| OpenClaw 现有概念 | TriMetaverse 中的落点 | 是否直接复用 | 说明 |
| --- | --- | --- | --- |
| Gateway | 服务域控制器中的 WS 接入层 | 部分复用 | 不再等价于 TriStaciss API 网关，而是 Service Controller 内部的控制面基线 |
| Control UI / WebChat | TriLC 调试面与客户端观察面的辅助基础 | 部分复用 | 正式产品 UI 仍应由 TriPilot/TriAvatar/App 主导 |
| role: operator | 社区成员客户端、运维客户端、审批客户端 | 复用 | 需增加用户级上下文和权限模型 |
| role: node | 本地域设备节点、服务域执行节点 | 复用 | 需叠加钱包绑定和节点登记 |
| device pairing | 设备接入审批 | 复用 | 只能做接入前置，不能替代节点身份 |
| node.invoke | Local ToolBus 远程执行通道 | 复用 | 适合执行动作，不适合直接承载任务市场语义 |
| Node Registry | DeviceNode 在线状态基础 | 部分复用 | 需增加 active/standby、信誉、钱包和角色字段 |
| system.run approvals | 本地域策略门禁的一部分 | 部分复用 | 需统一纳入 TMV policy gate 和审计事件 |

## 8. 最小闭环场景

建议先做两个最小闭环，不要一开始同时追求全平台、全端和全结算。

### 场景 A：服务域触发，本地域执行

目标任务：监控商品降价，触发本地截图和归档。

执行流：

1. 用户在 TriAvatar、TriPilot 或 TriMobile 创建监控任务。
2. TriStaciss FastAPI 作为任务入口网关接收请求并写入任务单。
3. TriStaciss 把任务转发给 TriMC Service Controller。
4. 服务域轻量监控 Worker 或 TriMC Service Controller 持续轮询价格。
5. 价格触发后，Scheduler 向某个已登记且已获用户授权加入网络的 TriLC 节点发送 tmv.task.offer。
6. 本地域节点通过 OpenClaw Node Host 接收执行指令。
7. Local Planner 调用 browser automation 或 system.run 完成截图。
8. 本地生成缩略图、结果摘要、证据清单。
9. 结果回传 Audit Ledger，摘要上链，节点贡献进入 reward append。

这个场景能同时验证：

- 服务域轻任务常驻
- 本地域重动作执行
- node.invoke 与 Local ToolBus 联动
- 客户端态到节点态升级后的真实价值

### 场景 B：本地域发起，服务域辅助

目标任务：用户在 TriPilot 发起代码生成和构建任务，本地编码，服务端完成评测与报告。

执行流：

1. 用户在 TriPilot、TriAvatar 或 TriMobile 发起任务，其中 PC 端优先承接需要代码仓库、文件系统和构建链路上下文的任务。
2. TriLC 的 Local Planner 调度本地编码 Worker。
3. 如需要服务域资源，则 TriStaciss 负责模型 API 转接，TriMC Service Controller 负责把评测、回归或批量分析任务发往服务域 Worker。
4. 服务域返回评测报告与审计摘要。
5. 最终结果、证据和奖励归属进入用户级上下文与节点级账本。

这个场景能验证“本地生产力 + 服务域评测”的双向协同。

## 9. 实施阶段建议

### 阶段 0：参考集成验证

目标：不改白皮书语义，只验证 OpenClaw 能否承接双域底座。

交付：

- 在 TriPilot/reference/openclaw 基础上，跑通一个独立 Gateway。
- 跑通一个本地 node host 接入。
- 跑通 node.invoke 调用一个受控本地命令。
- 输出命令能力清单与权限模型映射。

### 阶段 1：最小双域 MVP

目标：跑通“服务域任务创建 -> 本地域执行 -> 证据归档 -> 节点记账”。

交付：

- TriStaciss 增加 OpenAI 兼容 API 网关、tag 路由器、任务入口转发器。
- TriStaciss 增加用户注册入口转发器与 TriMem 适配层。
- TriMC 增加 Service Controller、Node Bridge、Policy Gate 与审计回执桥接。
- TriLC 增加 Node Host Runtime、Local Planner、Wallet Upgrade Adapter。
- 新增 provider 路由表、DeviceNode 表和 TaskExecution 表。
- 完成 TriLC 客户端态与节点态切换，并让 TriPilot、TriAvatar、TriMobile 退回纯入口端。

建议此阶段保持：

- 单活 TriStaciss Gateway
- 单活 Service Controller
- Postgres 持久化
- 本地域 active 节点数按 min(3, 可用数) 降级运行

### 阶段 2：服务域高可用与节点治理

目标：从单活基线升级到白皮书要求的受控高可用。

交付：

- 候选主控、热备主控、活跃主控租约
- active 本地域节点集合和备用池维护
- 节点健康、负载、信誉和设备能力画像
- 网关路由摘要刷新

此阶段才开始逐步把 OpenClaw Gateway 从单机控制面基线抬升到集群入口组件。

### 阶段 3：链上确权与收益回流

目标：把节点贡献、用户归属和平台分账拆账落地。

交付：

- 用户级归属账本
- 节点级奖励账本
- 平台级金库账本
- 结果摘要上链
- 钱包结算与能量积分展示

## 10. 仓库级模块落位

### 10.1 TriStaciss：统一模型 API 转接平台与任务入口网关

建议优先落在 api-server 下，保持 FastAPI 形态，主职责是模型转接、provider 路由和任务入口，而不是承载本地执行宿主或工作区运行时。

| 建议路径 | 作用 | 对应白皮书语义 | 备注 |
| --- | --- | --- | --- |
| api-server/provider_router/ | 解析 tag、modelTag、辅助字段并路由到具体 provider 和 model | 统一模型 API 入口 | 统一 OpenAI API 兼容层 |
| api-server/provider_catalog/ | 维护 provider、model、tag、路由策略、熔断和权重 | 路由策略层 | 参考业内 API 转接平台 |
| api-server/credential_broker/ | 托管平台级 provider key 和凭据注入 | 密钥托管层 | 不向客户端暴露上游 key |
| api-server/task_ingress/ | AI 任务入口、参数校验、任务落单、主控转发 | 服务域入口网关 | 收到任务后转发给 Service Controller |
| api-server/user_ingress/ | 用户注册、登录、成员入口、身份关联转发 | 用户入口网关 | 收到用户请求后转发给 TriMem |
| api-server/request_audit/ | 请求审计、计费打点、trace id、调用日志 | 平台审计层 | 同时服务模型转接和任务入口 |
| api-server/tmv_api/ | 给 TriAvatar、TriPilot、App 暴露统一 REST or WS API | 平台 API 门面 | 避免前台直接调用内层模块 |

建议同时补三类接口面：

- 模型 API：OpenAI 兼容 chat completions、responses、models 查询。
- 任务 API：任务创建、任务查询、审批、节点查看、收益查看。
- 用户 API：注册、登录、成员资料、钱包绑定状态查询。
- 内部转发 API：到 TriMC 的任务投递、状态同步、节点事件同步；到 TriMem 的注册、身份与钱包关联同步。

### 10.1.1 TriMem：用户与社区成员后台系统

TriMem 作为独立仓库和独立服务，负责所有用户和社区成员的权威状态。

| 建议路径 | 作用 | 备注 |
| --- | --- | --- |
| TriMem/src/user-core/ | 用户主档、注册、登录、会话、状态机 | 权威用户主表 |
| TriMem/src/member-core/ | 社区成员、角色、团队、审核流程 | 社区成员后台 |
| TriMem/src/wallet-link/ | 钱包绑定、链上身份关联、地址校验 | 对接 TriChain、TriWeb4 |
| TriMem/src/access-control/ | 权限、审批、风控、实名或 KYC 扩展点 | 统一访问控制 |
| TriMem/src/api/ | 对 TriStaciss 和前台提供统一用户接口 | 用户平台 API |

### 10.1.2 TriChain 与 TriWeb4：链上身份与合约能力

TriChain 和 TriWeb4 也应视为与 TriPilot 等同级的独立仓库：

| 项目 | 作用 | 备注 |
| --- | --- | --- |
| TriChain | 公链、账户、收益确权、链上结算、节点身份锚定 | 底层链能力 |
| TriWeb4 | DID、钱包连接、身份合约、前端 Web3 or Web4 适配 | 面向应用层合约能力 |

### 10.2 服务域主控：OpenClaw Gateway + Policy Gate 控制器

真正的服务域主控建议收敛到独立项目 TriMC 中，其底座是 OpenClaw Gateway 与 Tri 自有 task controller、policy gate、audit pipeline 的组合，而不是塞进 TriStaciss。

| 建议路径 | 作用 | 备注 |
| --- | --- | --- |
| TriMC/src/server/ | 封装 HTTP、WS、内部服务入口和 Tri 业务桥接 | 服务域入口面 |
| TriMC/src/task-controller/ | 任务状态机、任务转发、审批协同、回执汇聚 | Service Controller 核心 |
| TriMC/src/node-bridge/ | 对接 OpenClaw Gateway、Node Registry、节点控制事件 | 服务域设备控制层 |
| TriMC/src/policy-gate/ | 风险控制、用户确认、高危拦截、隐私脱敏 | 任务安全层 |
| TriMC/src/contracts/ | TriStaciss to TriMC and TriLC 协议模型 | 便于独立发布 |
| TriMC/src/observability/ | 吸收 TriMC (原 TriMC (原 Core-Agent)) 的 audit mapping、timeline query、replay 和 SQL runtime | 服务域观测与回放子系统 |

补充说明：

- TriMC (原 TriMC (原 Core-Agent)) 不应整体替代 TriMC。
- TriMC (原 TriMC (原 Core-Agent)) 更适合作为 TriMC 中 observability and replay 子系统的来源仓库。
- 任务编排、节点调度、审批门禁仍属于 TriMC 主控核心，不属于 TriMC (原 TriMC (原 Core-Agent)) 当前范围。

### 10.3 TriLC：本地域主要代码实现

TriLC 作为本地域主要代码实现，承接双态安装体、常驻执行、节点接入、本地 Planner、ToolBus 和执行反馈。

| 建议路径 | 作用 | 依赖现有入口 | 备注 |
| --- | --- | --- | --- |
| TriLC/src/local-node/ | 节点握手、节点状态机、心跳、接单、结果上报 | TriLC runtime | 本地域节点态核心 |
| TriLC/src/task-runtime/ | 任务执行上下文、task offer 接收、任务回执、失败恢复 | TriLC runtime | 和本地状态库绑定 |
| TriLC/src/planner/ | 本地任务拆解、审批点、失败重规划、工具调用决策 | TriLC runtime | 面向任务语义，不直接面向 WS |
| TriLC/src/toolbus/ | shell、文件、浏览器、构建测试、移动桥等工具总线 | 本地执行环境 | 对外暴露 capability catalog |
| TriLC/src/context-adapter/ | 读取工作区、文件系统、终端、浏览器、移动桥等本地上下文并标准化暴露 | 本地 capability 层 | 不依赖特定 IDE 宿主 |
| TriLC/src/wallet-upgrade/ | 客户端态到节点态升级、钱包绑定、授权检查 | 本地身份流程 | 要和服务域 identity API 对齐 |
| TriLC/src/contracts/ | tmv.task、tmv.node、tmv.audit 等协议模型 | 全局共享 | 建议未来抽到独立包 |

建议对 TriLC 的入口做两处要求：

- 常驻运行时负责执行生命周期，不能依赖 TriPilot 窗口或 IDE 是否打开。
- 本地域状态存储必须独立于聊天历史和前台 UI 缓存。

### 10.4 TriPilot、TriAvatar、TriMobile：统一任务入口与节点运营面

TriPilot、TriAvatar、TriMobile 都不承担执行引擎，但应成为用户最稳定的“任务前台”和用户入口。建议按页面、服务、状态三层扩展。

| 建议路径 | 作用 | 备注 |
| --- | --- | --- |
| src/pages/TaskCenterPage.tsx | 用户任务列表、任务详情、执行证据查看 | 对接 TriStaciss task API |
| src/pages/NodeConsolePage.tsx | 节点状态、钱包绑定状态、收益概览、active or standby 状态 | 面向运营与节点拥有者 |
| src/pages/ApprovalCenterPage.tsx | 人工审批、风险确认、任务复核 | 对接 Service Controller policy gate |
| src/services/taskApi.ts | 任务创建、查询、取消、重试 API | 从现有 api.ts 拆出任务域 |
| src/services/nodeApi.ts | 节点查询、钱包状态、收益查询 API | 新增服务层 |
| src/store/taskSlice.ts | 任务列表、详情、执行状态、工件摘要 | Redux 新 slice |
| src/store/nodeSlice.ts | 节点在线态、活跃态、能力、收益 | Redux 新 slice |
| src/store/rewardSlice.ts | 节点奖励、用户归属、平台抽成展示态 | Redux 新 slice |

TriPilot、TriAvatar、TriMobile 只读服务域与用户域真相源，不持有权威后端状态，不再单独设计一套业务主库。

### 10.5 本地能力接入策略：去 VS Code 化

代码工作区、终端、浏览器、文件系统这些能力确实需要统一接入，但它们只是本地 capability，不应该被设计成 VS Code 或 VSCodium 的架构依赖。建议如下：

| 建议路径 | 作用 | 备注 |
| --- | --- | --- |
| TriLC/src/context-adapter/ | 读取工作区、终端、浏览器、文件系统、移动桥等本地上下文 | 统一能力抽象层 |
| TriLC/src/toolbus/ | 把 capability 组合成可审批、可审计、可拦截的动作调用 | 对外暴露最小动作面 |
| TriMC/src/policy-gate/ | 根据风险等级、隐私等级、确认策略做放行或拦截 | 不关心能力来自哪个宿主 |

这里的核心原则是：

- TriMetaverse 只依赖“本地 capability 抽象”，不依赖任何特定 IDE 宿主。
- 如果 TriPilot 或其他桌面壳提供代码工作区上下文，它只是 context adapter 的一个 provider，而不是架构中心。
- 所有高危动作必须先经过确认、风险评估和隐私检查，再进入 OpenClaw node.invoke 或本地工具适配器。

同时，服务域的 observability and replay 运行时建议也并入 TriMC，而不是继续作为独立主控候选保留在 TriMC (原 TriMC (原 Core-Agent)) 中。

### 10.6 TriMetaverse 文档层

建议把本文件作为白皮书的实施补充，不替代白皮书本身。白皮书负责原则，本文件负责工程分层、组件替换和阶段推进路径。

## 11. 统一表结构建议

### 11.1 TriStaciss 平台库：模型转接与任务入口表

TriStaciss 的库主要保存模型转接平台和任务入口相关数据，不直接承担全部节点执行真相源。

| 表名 | 主键 | 关键字段 | 作用 |
| --- | --- | --- | --- |
| tmv_provider_account | id | provider_key, provider_type, credential_ref, status, quota_policy | 上游 provider 账号登记 |
| tmv_model_route | id | tag, model_tag, provider_account_id, provider_model_id, route_policy, weight | tag 到 provider and model 路由 |
| tmv_api_request_log | id | request_id, caller_id, route_tag, resolved_provider, resolved_model, status_code, latency_ms | 模型 API 调用审计 |
| tmv_task_ingress | id | task_type, creator_user_id, source_client, payload_json, forwarded_controller, status | 任务入口主表 |
| tmv_task_ingress_event | id | ingress_id, event_type, payload_json, created_at | 任务入口事件流 |
| tmv_user_workspace | id | user_id, workspace_key, source, status, last_seen_at | 绑定用户与任务空间 |
| tmv_wallet_binding | id | user_id, node_id, wallet_address, chain_id, status, bound_at | 用户钱包与节点绑定 |
| tmv_user_ingress_log | id | user_id, source_client, action_type, status, trace_id, created_at | 用户入口审计 |

最小索引建议：

- tmv_model_route on tag, model_tag
- tmv_api_request_log on request_id unique
- tmv_task_ingress on status, created_at
- tmv_wallet_binding on user_id, wallet_address

### 11.2 服务域主控库：节点、执行、审计与收益权威表

服务域主控库由 TriMC Service Controller 维护，保存节点、执行、审计和收益真相源。

| 表名 | 主键 | 关键字段 | 作用 |
| --- | --- | --- | --- |
| tmv_device_pairing | id | device_fingerprint, pairing_code, paired_by, paired_at, revoked_at | 记录 OpenClaw 设备配对结果 |
| tmv_node_registry | id | node_key, device_pairing_id, runtime_type, role, state, active_flag, consent_status, last_heartbeat_at | 节点主表 |
| tmv_node_capability | id | node_id, capability_key, capability_version, permissions, cost_hint, updated_at | 节点能力画像 |
| tmv_node_lease | id | node_id, lease_type, holder_id, lease_started_at, lease_expires_at, status | active 主控 or active 节点租约 |
| tmv_task | id | ingress_id, task_type, creator_user_id, source_domain, priority, status, policy_gate, created_at | 服务域任务主表 |
| tmv_task_offer | id | task_id, target_node_id, offer_status, offered_at, responded_at | 调度派单记录 |
| tmv_task_execution | id | task_id, node_id, execution_status, started_at, finished_at, exit_code, summary_hash | 执行记录 |
| tmv_task_artifact | id | task_execution_id, artifact_type, uri, hash, size_bytes, created_at | 工件索引 |
| tmv_audit_event | id | aggregate_type, aggregate_id, event_type, event_payload, actor_id, created_at | 审计事件流 |
| tmv_verification_result | id | task_execution_id, verifier_type, result, score, report_uri, created_at | 验证与复核结果 |
| tmv_reward_ledger | id | subject_type, subject_id, reward_type, amount, token_symbol, source_execution_id | 奖励账本 |
| tmv_settlement_batch | id | batch_no, status, total_amount, settlement_ref, settled_at | 出账批次 |

### 11.3 TriLC 本地域状态库：SQLite or State DB

本地域不保存平台权威状态，只保存执行期状态、缓存与恢复信息。建议使用 SQLite 或现有 VS Code State DB 能力承载。

| 表名 | 主键 | 关键字段 | 作用 |
| --- | --- | --- | --- |
| local_runtime_session | id | workspace_path, session_kind, started_at, ended_at, status | 本地运行会话 |
| local_task_inbox | id | remote_task_id, payload_json, offer_status, received_at, acked_at | 接收到的任务单 |
| local_task_run | id | remote_execution_id, local_status, planner_state, started_at, updated_at | 本地执行态 |
| local_tool_invocation | id | local_task_run_id, tool_name, input_hash, output_hash, exit_code, created_at | 工具调用流水 |
| local_checkpoint | id | local_task_run_id, checkpoint_type, payload_uri, created_at | 本地回滚与恢复点 |
| local_wallet_context | id | wallet_address, binding_status, bound_node_id, updated_at | 钱包升级上下文 |
| local_context_session | id | context_provider, workspace_id, endpoint, auth_state, updated_at | 本地上下文会话缓存 |

这些表可以先从轻实现开始：

- 阶段 1 用 SQLite 文件即可。
- 阶段 2 再决定是否并入 TriPilot 本地状态库或独立 sidecar 状态库。

### 11.4 TriPilot、TriAvatar、TriMobile 前台状态：只保留缓存模型

TriPilot、TriAvatar、TriMobile 不建议引入独立业务主库。它们只消费 TriStaciss 和 TriMem API，并在前端状态层维持页面态缓存：

- taskSlice 对应 tmv_task plus tmv_task_execution 聚合视图
- nodeSlice 对应 tmv_node_registry plus tmv_node_capability 聚合视图
- rewardSlice 对应 tmv_reward_ledger 聚合视图
- userSlice 对应用户主档、登录态、钱包绑定态聚合视图

## 12. 本地能力接入策略

### 12.1 为什么要去 VS Code 化

本项目真正需要的不是某个 IDE 的远端 server，而是三类本地能力：

- 工作区与文件系统访问。
- 终端、构建、浏览器等执行能力。
- 可确认、可拦截、可审计的高危动作门禁。

因此，架构中心应该是 capability 抽象和 policy gate，而不是 IDE 宿主本身。

### 12.2 推荐的整合方式

建议采用“单主控、单执行面、强门禁”模式：

- TriStaciss 是统一模型 API 平台与任务入口。
- TriMC Service Controller 是任务执行和节点调度主控。
- TriLC 负责把本地工作区、文件系统、终端、浏览器等能力包装成 TMV 能力模型。
- OpenClaw 负责设备接入、WS 控制面和 node.invoke 执行通道。

执行链路建议为：

1. 客户端请求先进入 TriStaciss。
2. 普通模型请求由 TriStaciss 直接完成 provider 转接。
3. 用户注册和身份请求由 TriStaciss 转发给 TriMem，并由 TriMem 关联 TriChain 与 TriWeb4。
4. 任务型请求由 TriStaciss 转发给 TriMC Service Controller。
5. TriMC 根据风险等级、隐私等级和确认策略决定是否下发到 TriLC。
6. TriLC localNode 接收任务，并由 planner 选择需要的本地 capability。
7. TriLC 通过 context adapter 和 toolbus 与工作区、终端、浏览器、文件系统交互。
8. TriLC 汇总结果，经 TriMC Service Controller 回传到 TriStaciss 与审计层。

这样可以避免两类坏结果：

- 把架构绑死在某个 IDE 生命周期上，导致后台执行不稳定。
- 让任务入口直接操作高危本地能力，绕过确认、拦截和隐私策略。

### 12.3 运行时打包策略

建议分场景处理：

- 服务域发行版优先用容器镜像，不依赖任何 IDE 宿主。
- 本地域优先使用 detached daemon 或 sidecar 运行时，保证前台关闭后任务仍可继续。
- 如需复用 TriPilot 桌面壳提供的本地上下文，也只能作为可插拔 provider，不能成为唯一执行路径。

## 13. 风险与反模式

以下做法应明确避免：

- 直接把 OpenClaw Gateway 当成最终版主控编排池。
- 把设备配对结果直接当成钱包身份或链上身份。
- 把 node.invoke 直接暴露为无任务上下文的高权限远程执行入口。
- 把所有本地安装体都计为节点供给。
- 把用户前台看到的虚拟工作空间直接等同为真实执行资源节点。
- 在阶段 1 就强行做多活主控和复杂链上治理。
- 把本地能力绑定到某个 IDE 宿主生命周期，导致脱离前台后无法稳定执行。
- 把 TriStaciss 的模型转接平台职责和 TriMC Service Controller 的节点调度职责混成一个进程内大泥球。
- 继续让 TriPilot 直接承担本地执行生命周期，导致前台关闭即任务中断。

## 14. 推荐的落地顺序

如果只选一条最稳妥路径，建议按下面顺序推进：

1. 先把 TriStaciss 的统一 OpenAI API 兼容层、tag 路由和 provider key 托管能力收敛清楚。
2. 打通 TriStaciss 到 TriMem 的用户注册与身份转发链路，并建立 TriMem 到 TriChain、TriWeb4 的钱包与身份关联。
3. 用 OpenClaw 打通本地域节点接入、设备配对和 node.invoke。
4. 建立 TriMC policy gate，先把执行确认、高危操作拦截、隐私脱敏和最小权限模型做清楚。
5. 建立 TriLC context adapter，把工作区、终端、文件系统、浏览器等本地能力收敛成中性 capability。
6. 建立 TriLC，让用户只有在明确同意加入节点后才升级进入本地执行域。
7. 让 TriPilot 从执行载体中剥离，只保留任务入口、审批、节点状态展示和收益展示。
8. 用 TriAvatar、TriMobile 接上任务中心、审批中心、节点控制台、收益展示和用户注册入口。
9. 跑通一个“TriStaciss 接任务 -> TriMC 编排 -> TriLC 执行”的最小真实任务。
10. 再开始做 active 节点维护、候选主控 or 热备主控和收益记账。

这样改造后的 OpenClaw，不再只是“个人 AI 助手”，而会成为 TriMetaverse 白皮书里“服务域调度链路 + 本地域任务计划链路”的一个现实可用底座。
