# TriTraining 平台架构草案（候选）

版本：V0.1  
日期：2026-06-03  
状态：架构草案（待评审）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/engineering/tritraining-platform-architecture.md
- publishedFrom: 当前文件（source）
- syncMode: source-only
- publishTier: source-only
- lastSyncedAt: 2026-06-03

## 1. 文档定位

本文用于定义 `TriTraining` 作为培训学院平台候选产品时的跨模块技术承载方式、分层边界、模块协作关系和最小实施顺序。

这里的 `TriTraining` 当前是**平台概念**，不是已成立正式模块。本文放在 `TriMetaverse/docs/engineering/`，因为它讨论的是跨模块技术承载与平台架构，而不是 `TriCompany` 仓内局部实现。本文不得被解读为中央模块边界已完成裁决。

## 2. 当前设计判断

### 2.1 这不是单一训练文档问题，而是平台问题

当前 `docs/training/tricompany/README.md` 及其同组 training 导读文档，本质上仍只是训练壳原型。  
如果目标是同时支持：

- 教学内容
- 练习交互
- 多语言代码运行
- 项目练习
- 等级与成长系统
- AI 助教与路径推荐

那它必须被拆成平台分层，而不能长期停留在单页 HTML 层面。

### 2.2 TriCompany 负责内容与规则真源，不负责吞掉整个平台

当前最合理的源侧边界是：

- `TriCompany` 负责课程内容真源、lesson 结构、trainer 产出、学习路径和 training 规则
- 但不把入口层、沙箱层、运行层和多端承载都强塞进 `TriCompany`

这既避免资源重复部署，也避免 TriCompany 过重。

补充当前执行口径：

- `TriCompany` 当前只负责本模块 training 内容，并由 `RAndDTrainer` 负责当前 Trainer 产出。
- 与 `TriCompany` 同级的 `TriTraining/docs/training/` 负责 `TriTraining` 模块 training 内容；是否作为当前阶段的 training 真源产生面，由 `CPO` / `CTO` 联审评估。
- `TriMetaverse/docs/training/tritraining/` 与同级 `tricompany/` 作用相同，只负责中央聚合面下的模块 training 包入口；宿主侧若需要 published copy，应按真源发布链进入 `TriTraining-copilot-host-assets`。

### 2.3 TriLC 必须和 TriPilot + vscodium 一起考虑安装软件打包

从产品和技术层面，必须记住：

- `TriLC` 不是一个孤立交付的本地执行层
- 它应与 `TriPilot + vscodium` 一起考虑 PC 端安装软件打包
- 用户视角下，PC 端入口、IDE 宿主和本地执行能力应尽量表现为一个连续的软件体验，而不是三个分裂模块

这也意味着：

- PC 端 training / project-run 不应只写 `TriLC` 路线
- 需要同时考虑 `TriPilot` 的入口体验与 `vscodium` 的宿主承载

### 2.4 TriLC 的本地执行应受 TriMC 协调

当前架构判断是：

- `TriMC` 负责统一 runtime、interaction、上下文与智能编排
- `TriLC` 负责本地 runtime 和本地执行生命周期
- 因此 training 平台中的本地执行，不应让 `TriLC` 单独成为主控，而应让其作为 `TriMC` 协调下的本地执行面

在 `TriMC` 尚未形成正式宿主前，当前可临时用 `copilot chat / cli` 承担一部分智能训练语义，但这不代表最终架构就是把 `copilot` 当正式训练平台主控。

### 2.5 产品理念必须从一开始就兼容“真实游戏世界”

`TriTraining` 当前虽然先从培训平台起步，但产品语义不应只按“课程系统”设计。

从设计之初就要预留：

- 与元宇宙结合后进入数字分身、数字复刻和现实世界复刻
- 与 Web3 结合后进入链上身份、社区治理、凭证和收益回路
- 从培训平台进一步演化为真实游戏化世界

这意味着课程、任务、成长、身份、收益和治理模型，应尽量从第一天就使用可扩展 contract，而不是只做一次性的页面逻辑。

但这里必须明确边界：

- `TriTraining` 仍然是培训平台
- 数字形象复刻、现实物体与环境复刻、仿真实践、DAO、NFT、GameFi 等能力，不默认由 `TriTraining` 自己实现
- 更合理的做法是由 `TriTraining` 预留对接面，再借助 `TriAvatar`、`TriMC`、`TriMem`、`TriWeb4`、`TriChain` 等相关模块逐步接入

### 2.6 全球协作与合规约束必须前置

`TriTraining` 服务的是 `TriMetaverse` 这一统一规划、分区域协作的全球项目，因此架构必须前置考虑合规：

- 国内公司承接 AI 开发
- 新加坡公益基金会承接区块链 & Web3 开发
- 香港公司承接元宇宙开发

当前特别约束是：

- 新加坡线以公益基金会形式运转
- 主要定位于知识分享、技术研究、培训等公益类活动
- 开放项目源代码，并以开源项目形式接受捐赠维持基金会运转
- 当前**不涉及加密货币发行**

因此 TriTraining 的身份、收益、治理、记录、钱包和社区机制，都不能脱离区域合规边界单独设计。

### 2.7 等级命名应避免直接借用具体商业游戏

当前更稳妥的做法是：

- 保留竞技段位语义
- 使用自定义段位命名
- 避免直接沿用具体商业游戏的现成命名体系

## 3. 平台分层

### 3.1 内容层

负责：

- lesson 内容
- 模块导读
- 项目拆解
- 概念解释
- 提示与答案
- 路线与等级任务定义

当前最适合承载：`TriCompany` 的培训部门。

说明：

- 当前在岗岗位只有 `RAndDTrainer`
- 后续可以继续补充更多培训岗位、讲师岗位或专题 trainer
- 内容层不只是文档存放区，而是课程、路线、题库、实践桥和 trainer 产出中心

### 3.2 交互层

负责：

- 课程页
- 练习交互
- 输出面板
- 进度展示
- 路线导航
- 等级与能力六边形展示

当前 Web 入口最适合承载：`TriAvatar`

当前 PC 端入口最适合承载：`TriPilot + vscodium`

当前第一批课程发布切片应先以 `TriAvatar` 承接 `course / lab / progress / review` 四类页面。

### 3.3 API 与沙箱层

负责：

- 课程 API
- 练习提交 API
- 模型调用 API
- 多语言运行请求转发
- 沙箱运行请求与结果返回

当前最适合承载：`TriStaciss`

说明：

- `TriStaciss` 更适合作为 API 平台、模型路由和后端接口承载面
- 不应把全部教学规则、等级规则和课程真源都写进 `TriStaciss`
- Web 端 code-run / project-run 的沙箱能力可继续评估 `VM + WebAssembly` 路线
- 若未来 Web 端承接更多练习与运行流量，`TriStaciss` 也应预留 `k8s` 方向的扩展与服务保障能力

当前第一批课程发布切片应先以 `TriStaciss` 承接 `course content API / lab submission API / code-run result API` 三类接口。

### 3.4 智能编排层

负责：

- AI 助教
- 路径推荐
- 练习讲解
- 学习上下文整理
- 训练任务编排
- 多 agent 协作

当前最适合承载：`TriMC`

当前候选架构方向：

- 以 `OpenClaw` 作为可吸收骨架之一，由 `TriMC` 继续承接吸收
- 保留其 harness、tools / plugin、model adapters 等成熟层
- 把现有 `pi agent` 方向替换为我们自有的 agent core
- 让 agent core 从 `react loop` 进一步升级为 `task executor`
- 引入显式 working memory
- 把 step 定义为**可执行语义**，而不是自然语言段落
- 让模型主要负责规划与决策，不直接承担执行动作

这条线当前应写成**候选架构方向**，而不是既成实现完成事实。

### 3.5 本地执行层

负责：

- 本地代码运行
- 本地工作区 project-run
- 本地任务生命周期
- 本地节点与工具调用

当前最适合承载：`TriLC`

但它必须与：

- `TriPilot`
- `vscodium`

一起被当作 PC 端安装软件的一部分来设计。

### 3.6 身份与账户层

负责：

- 学员注册
- 统一身份
- 钱包地址挂接
- NFT 徽章或其他数字凭证挂接
- 学员 / 用户 / 客户 / 社区成员 / 股东 / 合作生态 / 游戏玩家等多身份管理

当前建议协作模块：`TriMem`

说明：

- `TriMem` 不只是一个简单注册表，而应逐步承担 TriMetaverse 的统一身份层
- 数据存储当前更适合先以 `PostgreSQL` 作为主数据库候选，利用关系模型与可扩展字段并存的能力
- 如有需要，可再与 `MySQL`、`SQLite` 配合，用于兼容场景、边缘场景、轻量缓存或本地开发场景
- 当前应先定义通用字段与基础身份 contract，再逐步扩展

### 3.7 项目训练挂接层

负责：

- 与真实项目主线挂接
- project-run 的项目任务编排
- 阶段证据与项目训练结合

当前建议协作模块：

- `TriDev`：项目主线与 phase engine
- `TriTest`：产品上线后的端到端测试与训练结果校验协作面

## 4. 模块协作表

| 层 | 模块 | 当前建议职责 |
| --- | --- | --- |
| 内容真源 | `TriCompany` | 培训部门提供课程、lesson、trainer 产出、training 规则、学习路径；当前在岗为 `RAndDTrainer` |
| Web 入口 | `TriAvatar` | Web 端课程入口、学习面板、路线展示 |
| API / 后端 / 沙箱 | `TriStaciss` | 普通 API、模型 API、沙箱请求、运行结果返回，并预留 WebAssembly / VM 与 `k8s` 扩展方向 |
| 智能主控 | `TriMC` | AI 助教、上下文、任务编排、学习智能；候选方向继续吸收 `OpenClaw` 骨架与 harness 资产 |
| 本地执行 | `TriLC` | 本地运行、本地任务与本地 project-run |
| PC 宿主与入口 | `TriPilot + vscodium` | PC 端安装软件、IDE 宿主、深度训练入口，并支持云端 agent / remote agent / 本地 agent 三种连接模式 |
| 身份与账户 | `TriMem` | 统一身份、注册、钱包地址、徽章 / 凭证与多角色映射 |
| 项目训练挂接 | `TriDev + TriTest` | `TriDev` 负责项目流挂接与 project-run，`TriTest` 负责上线后的端到端测试与训练结果校验协作 |
| 未来移动入口 | `TriMobile` | 后续移动端学习入口 |

## 5. 练习模型

当前建议把练习抽象成统一 exercise contract，而不是每种练习写一套特例逻辑。

首批练习类型：

1. `choice`
2. `fill`
3. `code-run`
4. `project-run`

说明：

- `choice` / `fill` 更适合前端本地处理
- `code-run` 需要 runner 协议
- `project-run` 需要受控工作区、重置和结果校验

### 5.1 动态工作流执行模式（候选）

当前更合理的做法，不是把动态工作流直接定义成新的顶层练习大类，而是把它作为 `code-run / project-run` 的候选执行模式。

当前建议 execution mode 至少区分为：

1. `static`
2. `dynamic-workflow`

其中 `dynamic-workflow` 当前应被理解为：

- 一个受控的 `orchestrator -> workers -> verify -> summarize` 执行框架
- 外层 contract、可用路径、校验命令、失败预算和结果产物仍由系统约束
- 运行时允许根据题目上下文动态拆步骤、动态选择角色 / worker、动态决定是否继续、回退或重试

当前不应把它直接写成：

- 完整开放自治 agent
- 完整 Claude Code 式产品能力复刻
- 已经在全平台和全项目默认启用

### 5.2 动态工作流最小闭环

在 `TriTraining` 场景里，当前建议最小闭环为：

1. 读取练习题目、lesson 上下文和当前工作区状态
2. 生成 machine-readable 的 step plan
3. 按步骤调用合适的角色、工具或执行面
4. 在每一步执行后收集环境返回的真实反馈
5. 执行 `verify-command`、diff、测试或其他校验
6. 失败时按规则回退、重试或阻断
7. 输出最终反馈、证据和可复盘总结

这里的重点不是“让模型自由发挥”，而是：

- 保持过程可见
- 保持执行可控
- 保持证据可追溯
- 保持练习可重置、可回放、可复盘

## 6. lesson 模型

当前建议 lesson 使用 manifest 驱动，而不是手写大量页面特例。

最小 lesson block 应至少支持：

- `concept`
- `example`
- `exercise`
- `feedback`
- `project-bridge`

这能保证“讲一个概念 -> 立刻练一次 -> 给反馈 -> 拉回项目”的统一节奏。

### 6.1 与 TriDev 的当前衔接方式

当前最现实的执行底座不是从零重写，而是优先复用 `TriDev` 已有的执行原语，例如：

- `engine-plan / engine-step`
- `task-plan / task-step`
- `knowledge-bundle / prompt-context / executor-brief`
- `allowedPaths`
- `verify-command`
- `failureBudget`
- `artifact bindings / evidence / summary`

因此当前更合理的路线是：

- 先在 `TriTraining` 里验证一到两道受控动态工作流试题
- 再把稳定出来的 contract 从训练场景中抽离
- 最后才考虑把通用部分上收到 `TriMC agent core`

这里要强调：

- 当前 `TriTraining` 是试验入口
- 当前 `TriDev` 是最现实的执行底座来源
- `TriMC` 是未来通用承载目标，不是当前已完成事实

## 7. 成长系统在技术侧的最小实现

### 7.1 路线

- 路线是领域分类
- 可多路线并存
- 不应与等级混写

### 7.2 等级

当前建议采用：

1. 倔强青铜
2. 秩序白银
3. 锋芒黄金
4. 卓越铂金
5. 耀目钻石
6. 星阶大师
7. 冠冕宗师

### 7.3 等级徽章

- 当前正式徽章先收敛为等级徽章
- 等级徽章由等级任务达成后获取
- 等级可上可下，存在回落机制

### 7.4 能力六边形

六边形维度为：

1. 知识
2. 工具
3. 实践
4. 项目
5. 协作
6. 表达

技术上应把它当作 profile / evaluation 维度，而不是 badge name 集合。

## 8. 两条运行路径

### 8.1 Web 学习路径

最小路径：

`TriAvatar 页面 -> （按需接 TriMem 注册 / 身份） -> TriStaciss API -> TriMC 智能编排 -> 返回教学与练习结果`

适合：

- 零基础课程
- 轻交互练习
- 学习路线浏览
- 助教问答
- 受控 dynamic-workflow 练习试点

### 8.2 PC / 本地实训路径

最小路径：

`TriPilot + vscodium 入口 -> TriMC 编排 -> TriLC 本地执行 -> TriTest / TriDev 校验`

适合：

- 深度代码练习
- 本地代码运行
- 项目级 project-run
- IDE 内学习与实训

### 8.3 TriPilot 的三种 agent 连接模式

当前建议 TriPilot 未来支持三种模式：

1. **云端 agent**：由官方提供；TriPilot 主要承担管理、查看和连接入口
2. **remote agent**：由用户自己提供远端 agent；TriPilot 同样主要承担管理、查看和连接入口
3. **本地 agent**：由用户自己在本地运行，并通过 `TriLC` 与官方 `TriMC` 连接

其中：

- 云端 agent 与 remote agent 模式下，IDE 关闭不应影响 agent 继续运行；用户重新打开 IDE 后应能接回查看运行进度
- 本地 agent 模式下，才真正体现“PC 端入口、IDE 宿主和本地执行”对用户的连续体验

## 9. 沙箱与 project-run 判断

### 9.1 code-run

需要：

- 多语言 runner
- stdout / stderr
- 超时控制
- 资源限制
- Web 端沙箱的 `WebAssembly / VM` 承载路线评估

### 9.2 project-run

需要：

- 受控工作区副本
- 练习开始前快照
- 练习结束后重置
- 测试 / diff / 输出校验
- 项目证据与结果记录

这类能力不应先写死在单页 HTML 中。

当前可参考方向：

- 借鉴 `Remix` 一类 Web 端项目开发工具的交互思路
- 在浏览器端管理项目
- 允许通过 `TriPilot + vscodium` 连接 Web server，实现本地代码与服务器工作区的同步修改

### 9.2.1 动态工作流与 project-run 的关系

当前建议优先把 `dynamic-workflow` 放进：

- 一道 `code-run` 试题
- 一道 `project-run` 试题

作为最小试点，而不是一开始就把全部练习改成动态执行。

推荐原因：

- `code-run` 更容易验证步骤拆解、工具调用和即时反馈
- `project-run` 更容易验证受控工作区、快照、重置、测试、diff 和证据沉淀

这两个试点跑通后，再决定是否扩大到更多 lesson 和路线。

### 9.3 TriStaciss 的服务保障方向

`TriStaciss` 未来既承接普通 API 调用，也承接模型 API 平台能力，因此需要预留：

- 弹性扩展
- 服务隔离
- 统一网关
- 高可用
- 灰度与服务保障

当前更合理的长期方向是保留 `k8s` 方案空间，但当前阶段仍不应把它写成已上线架构。

### 9.4 TriTest 的挂接判断

- `TriTest` 当前更适合被理解为**产品上线后的端到端测试协作面**
- 对训练过程中的 project-run 验证，主执行仍应由 `TriDev` 与模块自身测试链路承担
- 当 TriTraining 进入真实上线、真实练习验收和更完整用户路径验证时，再让 `TriTest` 更深度挂接

## 10. 当前最小实施顺序

### Phase 0：收口总助与当前最小经营闭环

- 先收口 CEOChiefOfStaff 当前阶段的总助研发基线
- 先把“最小 MVP / 最小经营闭环”调整到 Web 入口优先的 `TriTraining`

### Phase A：Web MVP 基础设施

- 继续完善 `TriDev`
- 先把 `TriStaciss` 的模型 API 接口功能调通
- 先让 `TriAvatar` 与 `TriStaciss` 正常协同工作
- 让 `TriCompany` 培训部门提供最小课程真源、lesson 结构和题型 contract
- 在最小 Web 闭环里先验证一到两道受控 dynamic-workflow 试题

### Phase B：最小 TriTraining 上线

- 跑通最小 Web 学习闭环
- 先上线最小 lesson / exercise / feedback
- 补最小 token 消耗闭环
- 验证动态工作流试题的过程展示、校验反馈和复盘体验

### Phase C：用户注册与统一身份

- 让学员可以注册
- 让 `TriMem` 承接最小统一身份
- 先定义通用字段，再逐步扩展到钱包、凭证和多身份体系

### Phase D：本地与项目训练补入

- `TriLC` 承接本地执行
- `TriPilot + vscodium` 形成 PC 端安装软件体验
- 引入云端 agent / remote agent / 本地 agent 三种模式
- `TriDev` 挂接 project-run，`TriTest` 在更完整上线与验收阶段介入

### Phase E：再评估是否升格为正式模块

满足以下条件后，才讨论是否让 `TriTraining` 升格为正式模块：

1. 已有独立产品路线
2. 已有独立 engineering 路线
3. 已有跨模块复用事实
4. 已有真实平台运行骨架

### Phase F：成熟能力上收 TriMC agent core（候选）

只有在前面试点已经证明 contract 稳定后，才考虑把下列通用部分上收进 `TriMC`：

- step planning
- worker routing
- working memory
- verify / retry / rollback
- evidence / summary contract

这一步的目标是让动态工作流不只服务 `TriTraining`，而是未来可以服务整个项目。

但当前阶段不得把它写成已完成的 `TriMC agent core` 升级事实。

## 11. 当前不做

- 不把 `TriTraining` 写成已成立正式模块
- 不在当前阶段承诺完整移动端形态
- 不在当前阶段承诺生产级沙箱、完整项目练习平台和完整人才评分系统已经落地
- 不把当前 `copilot` 过渡承载写成正式长期主控架构
- 不把受控 dynamic-workflow 试点直接写成完整自治 agent 已经落地

## 12. 待确认

- `TriTraining` 正式模块化的触发条件
- 等级回落的具体算法
- token 计费与免费额度规则
- 方向路线和等级任务的配置中心放在哪里
- TriAvatar 与 TriPilot 之间的体验切换策略
