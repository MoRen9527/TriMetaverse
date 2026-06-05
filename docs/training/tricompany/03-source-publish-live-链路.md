# source -> publish -> live 链路

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/training/tricompany/03-source-publish-live-链路.md
- publishedFrom: 当前文件（central summary）
- syncMode: central-summary
- publishTier: central-summary
- lastSyncedAt: 2026-06-04

## 1. 为什么这条链必须被讲清楚

CTO review 的核心意见很简单：**如果 training 只讲理念，不讲链路，新人会以为 TriCompany 只是几篇文档和几个 agent；只有把 source -> publish -> live 讲清楚，大家才会知道到底该改哪里、发到哪里、谁是当前有效入口。**

TriCompany 当前至少有四层承载面：

| 层 | 位置 | 角色 |
| --- | --- | --- |
| source truth | `TriCompany/` | 模块源侧真源，维护规则、代码、workflow、source-agents、binding 生成逻辑 |
| support bundle | `TriMetaverse/TriCompany-copilot-host-assets/` | 当前 Copilot-host 使用的支撑包、发布副本、对象载荷与部分证据 |
| live entry | `TriMetaverse/.github/` | 当前宿主实际可发现、可调用的 live 入口 |
| central summary | `TriMetaverse/docs/` | 中央层边界、协议、治理与 operating record 摘要 |

如果不强制四层分工，最容易出现三种灾难：

1. support bundle 演化成第二真源；
2. live `.github` 被误当成长期设计面；
3. 中央 `docs` 被迫承担模块实现正文。

## 2. Source 层：规则必须先回到 TriCompany

`docs/workflow/tricompany-copilot-host-assets-governance.md` 已经明确：`TriCompany/` 是模块真源仓。  
这里维护的是：

- `.github/source-agents/` 下的源侧五件套；
- `runtime/cognition/` 下的规则实现；
- `docs/product`、`docs/engineering`、`docs/workflow`、`docs/registry`、`docs/training` 等六层真源；
- manifest、binding 生成逻辑与 workflow 规则。

也就是说，若你要定义“员工是什么”“host object 怎么生成”“wiki 编译规则是什么”“哪些路径算 runtime-state”，这些都应先改 source，而不是直接改 support bundle。

## 3. Publish 层：为什么要有 support bundle

很多新人第一次看到 `TriCompany-copilot-host-assets/` 会问：既然 source 才是真源，为什么还要跟踪这个目录？

答案是：**因为当前宿主确实需要一个可消费的 support root。**  
这个目录不是纯临时垃圾桶，也不是完整镜像，而是当前阶段的：

- published-copy；
- support-object-set；
- 宿主验证与 evidence；
- 当前 host 直接消费的知识对象目录。

治理文档已经明确这个目录可以被 git 跟踪，但前提是：

- 不能把它当成第二真源；
- `.env`、`.tricompany-cognition/`、cache 等运行态或个人环境数据必须忽略；
- 真正规则变更应回到 source；
- 这里只追踪当前宿主需要长期保留的支撑对象与证据。

## 4. Live 层：入口不是全部，但入口必须唯一

`TriMetaverse/.github/` 当前承担 live 宿主入口角色。  
对员工来说，live entry 的职责很单纯：**告诉宿主当前应该调用哪个入口文件。**

这层最容易被误用。常见错误是：

1. 把 source 五件套又复制一遍到 live 入口旁边；
2. 把 support payload 路径、运行态记忆和人格细节都堆进 live agent；
3. 一次迁移里创建两个 discoverable live entry，导致宿主不知道谁才是准入口。

TriCompany 的当前纪律是：

- 源侧五件套留在 `TriCompany/.github/source-agents/`。
- 当前真正 discoverable 的 live 入口只放在相应 `.github/agents/`。
- 如果像 `CEOChiefOfStaff` 这样已有现役入口，则优先复用现有 live entry，而不是再发第二个。

## 5. Central Summary 层：为什么中央 docs 只做摘要

`TriMetaverse/docs/` 的角色不是替代 `TriCompany/docs/`，而是记录：

- 项目级架构与模块边界；
- 中央 workflow 协议；
- handoff schema；
- registry 索引与 operating record；
- 模块之间共享的治理判断。

因此 training 文档在引用中央 docs 时，要把它理解成“中央边界与协议层”，而不是“模块全部实现都在这里”。

## 6. syncMode：四种同步状态怎么理解

治理文档要求相关文档显式声明同步元信息，核心字段之一就是 `syncMode`。当前四个模式的意义可以用 training 的语言理解成：

| syncMode | 含义 | 训练时怎么理解 |
| --- | --- | --- |
| `source-only` | 只在 source 侧维护 | 真源就在那里，support 只在需要时追平 |
| `published-copy` | source 的发布副本 | 允许宿主就近读取，但不能反向当真源改 |
| `central-summary` | 中央摘要层 | 只写边界、结论、协议，不写模块实现正文 |
| `audit-record` | 审计或证据记录 | 记录某次运行、发布、整理、验证结果，不承载长期规则 |

这四种模式一起工作，才避免“所有文件看起来都像真源”的混乱。

## 7. 当前态与目标态

### 当前态

- `Copilot-host` 是当前 live 承载面。
- `TriCompany-copilot-host-assets` 是当前实际需要的 support root。
- source 到 support 到 live 的链已经存在，但仍需严格按 source-first 纪律维护。
- 部分岗位已进入统一员工体系，但授权矩阵、成熟签字与更多自动化仍未补齐。

### 目标态

- `TriMC` 自身完成 `source -> shadow test -> 正式接管`。
- `TriHost` 承接正式宿主适配与切换。
- support bundle 更接近单向发布产物，而不是 source + evidence 的混合体。
- 更多岗位进入统一发布链，更多 handoff / validation / runtime audit 自动化。

## 8. 本章小结

source -> publish -> live 这条链，是 TriCompany 能不能从“会聊天的组织概念”长成“可运行、可维护、可切换、可审计的 AI 治理公司”的关键。对研发同学来说，它回答“代码和规则该改哪儿”；对产品同学来说，它回答“功能和岗位如何稳定上线”；对治理同学来说，它回答“谁是当前有效事实，谁只是运行结果”。这也是 CTO 强调必须把这条链讲清楚的根本原因。
