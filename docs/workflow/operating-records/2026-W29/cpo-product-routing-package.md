# CPO 产品路由包（2026-W29）

> 发起人：CEOChiefOfStaff（小贾）
> 受理人：ChiefProductOfficer（CPO）
> 状态：CPO 已裁决（2026-07-16）
> 发起日期：2026-07-16
> 期望裁决日期：2026-07-18（W29 周四前）

---

## 前置说明

本路由包将近期 CEO 关于产品侧的全部决策输入整理为结构化任务单，交付 CPO 进行产品归属判断、模块设计裁决和 MVP 优先级排序。

CPO 裁决完成后，技术侧事项将统一路由给 CTO 接手落地。

---

## 一、TriMem 统一用户身份体系

### 1.1 产品定位

TriMem 是 TriMetaverse 生态的**统一用户中枢**，承载全平台用户身份、账户、资产和权限数据。一账户贯通以下全部模块：

| 模块 | 用户场景 | 身份层 |
|------|---------|--------|
| TriPilot / vscodium | PC 端 AI 助手 + 插件开发 | 同一用户 |
| TriMobile | 移动端入口 | 同一用户 |
| TriTraining | AI 培训学习晋级、获取奖励 | 同一用户 |
| TriAvatar | 数字形象（见第四节） | 同一用户 |
| TriStaciss | Token Key 发放 | 同一用户 |
| TriMC | 云端 Agent 调度 | 同一用户 |
| TriLC | 本地 CLI 执行 | 同一用户 |
| TriOPC | OPC 商户系统 | 同一用户（含营业执照验证） |
| TriGateway | 社交账户绑定 | 同一用户可绑定多社交账户 |
| TriCompany | 赛博公司 CEO 身份 | 同一用户 + NFT 身份锚定 |
| TriChain / TriWeb4 | 钱包 / 区块链账户绑定 | 同一用户绑定私钥/钱包地址 |

**唯一例外**：TriCode glue 层下的代码工具（opencode / claude code / codex / zcode / copilot 等）允许用户使用各自工具独立账户登录，不与 TriMem 主账户强制绑定。

### 1.2 用户四层晋级模型

```
注册用户 → 社区成员 → OPC → 股东
  │          │         │       │
  │          │         │       └── 持有 TriMetaverse 项目/主体公司股权或数字货币
  │          │         │
  │          │         └── 提交营业执照，可开发并发布 AI 应用到 PC/Web/Mobile
  │          │
  │          └── 获得 TriMetaverse 平台数字货币，拥有投票治理权
  │
  └── 注册即获得 TriMem 账户
```

**重要澄清（CEO 2026-07-16）**：
- 注册用户和社区成员获得的数字货币和股权，**归属于 TriMetaverse 项目及其关联主体公司**，而非某个 OPC 自有资产。
- 晋级逐级解锁，不可跳跃。
- 股东身份 = 持有 TriMetaverse 平台数字货币或股权 + 投票治理权。
- OPC 身份 = 提交营业执照 + 可开发发布 AI 应用；OPC 商户对应 TriCompany 关联实体公司。

### 1.3 TriCompany 员工 NFT 桥接

**两个独立域，双向 NFT 锚定**：

| | TriCompany 域（内部） | TriMem 域（平台） |
|---|---|---|
| **主体** | 赛博公司岗位员工（CPO/CTO/CEO/小贾等） | 平台参与者（用户/社区成员/OPC/股东） |
| **身份来源** | 岗位职责 + 授权矩阵 | 注册 + 晋级 + 持有资产 |
| **NFT 身份** | ✅ 员工有私钥+钱包+NFT身份 | ✅ 用户绑定钱包+NFT身份 |
| **权限逻辑** | 岗位权限（公司治理） | 资产权限（平台参与） |

- 两个域**不可复用同一数据模型**——身份来源、权限逻辑、生命周期完全不同。
- 但双方都通过 **TriChain NFT** 做身份锚定，构成桥接层：TriCompany 员工的 NFT 可作为治理授权凭证在 TriMem 平台侧被识别；TriMem 用户的 NFT 资产也可在 TriCompany 公司治理流程中被引用。

### 1.4 CPO 待裁决事项

| # | 裁决项 | 说明 |
|---|--------|------|
| 1 | **四层身份数据模型边界** | 哪些字段存 TriMem 数据库，哪些存 TriChain 链上？NFT 元数据放链上还是链下？ |
| 2 | **晋级触发条件与业务流程** | 注册→社区成员：获币阈值？社区成员→OPC：营业执照审核流程？OPC→股东：持股门槛？ |
| 3 | **TriCode 多工具独立登录策略** | opencode/claude code/codex/zcode/copilot 各自独立账户与 TriMem 主账户的关系：完全独立？可选绑定？工具侧账户映射？ |
| 4 | **TriGateway 社交账户绑定模式** | 一个 TriMem 账户可绑定多个社交账户（1:N）还是仅 1:1？ |
| 5 | **MVP 用户故事优先级** | 第一阶段（AI 商业）TriMem 最小交付范围：注册/登录/钱包绑定/营业执照审核/社区身份——哪些先做？ |
| 6 | **数据库设计起点** | 在四层模型裁决后，TriMem 数据库 schema 的首版范围与 ER 边界。 |

---

## 二、TriOPC 产品定位

### 2.1 当前状态：FREEZE

TriOPC 的 PHP 源码（点餐系统，含营业执照验证、代理层级、连锁商户管理）尚未放入 `reference/` 目录。在源码就位并完成架构审阅前，**暂不做产品设计决策**。

### 2.2 已知信息（供参考）

- 源码系统为 PHP 点餐/门店管理系统，含：
  - 营业执照验证（申请支付必需）
  - 代理层级（运营者层面）
  - 连锁商户级（管理者→OPC→线下实体门店）
- 改造方向：对接抖音商户运营（短视频/团购/直播）+ 线下点餐收银/打印机等
- 最小 MVP：从源码提取核心功能，作为 TriOPC 模块基线
- OPC 商户对 TriCompany 关联实体公司，独立模板

### 2.3 CPO 待裁决事项

| # | 裁决项 | 说明 |
|---|--------|------|
| 7 | **TriOPC MVP 范围预判** | 基于已知信息，初步划定 MVP 功能边界（不必等源码即可给出方向性判断） |
| 8 | **TriOPC 与 TriMem 用户模型对接** | OPC 营业执照审核如何嵌入用户晋级流程？ |

---

## 三、CTO-008-P PC 端产品方向

### 3.1 CEO 已明确的决策

以下方向 CEO 已定调，CPO 在此基础上细化验收标准：

| 决策项 | CEO 定调 |
|--------|---------|
| **PC 端定位** | 双重角色：① 普通用户的 AI 助手（拥有一整套赛博公司，可发布任务让公司解决）；② 开发者的 AI 工具平台（可让赛博公司开发 AI 工具，发布到插件赚钱） |
| **MVP 策略** | 用 TriPilot 现有功能（聊天入口 + TriMC 配置）+ 任务下发链路（用户→总助→翻译分派→员工执行） |
| **分发策略** | 各模块独立更新 + 统一分发壳（Electron 打包） |
| **简化模式** | 仅 UI 简化（隐藏高级设置），功能不裁剪，一键恢复全功能界面 |
| **打包形态** | Electron 应用，内嵌 vscodium + TriPilot 插件 + TriCode glue 层 + TriLC 本地 CLI 自启动 |
| **上线后 Copilot** | 不考虑——Copilot 仅开发阶段临时环境。正式上线只存在 TriMC（服务端 K8s 三热备）和 TriLC（本地） |

### 3.2 CPO 待裁决事项

| # | 裁决项 | 说明 |
|---|--------|------|
| 9 | **PC 端 MVP 验收标准** | "聊天入口+任务下发"的最小可用定义：用户故事、交互流程、done criteria |
| 10 | **简化模式默认预设** | 首次启动默认进简化模式还是全功能模式？简化模式隐藏哪些设置项？ |
| 11 | **插件市场形态** | 第一阶段是否需要插件市场？还是先走 IPD→TriDev 直发？ |

---

## 四、TriAvatar 产品方向

### 4.1 CEO 定调

- **Avatar = 用户自己的数字形象**（2D/3D 数字人形象，对应 TriMem 账户）
- **数字宠物另行规划**——不捆绑在 Avatar 模块内，作为独立产品线在后续阶段设计

### 4.2 CPO 待裁决事项

| # | 裁决项 | 说明 |
|---|--------|------|
| 12 | **TriAvatar MVP 范围** | 第一阶段仅做静态数字形象（头像级）还是轻量 3D？ |
| 13 | **数字宠物独立路线** | 是否需要在当前阶段预留 pets 模块占位？ |

---

## 五、TriCode 多工具策略

### 5.1 CEO 定调

TriCode glue 层需支持以下代码工具（及未来更多）：

- opencode
- Claude Code
- Codex (OpenAI)
- zcode
- Copilot
- 其他可接入的 AI coding 工具

每个工具允许用户使用各自独立账户登录（不与 TriMem 主账户强制绑定）。

### 5.2 CPO 待裁决事项

| # | 裁决项 | 说明 |
|---|--------|------|
| 14 | **多工具支持优先级** | MVP 阶段先支持哪几个？建议至少 opencode + Claude Code |
| 15 | **工具账户与 TriMem 的可选绑定体验** | 虽不强制绑定，是否提供"可选关联"以解锁跨工具统一计费/统计？ |

---

## 六、CPO 裁决（2026-07-16）

> 裁决人：ChiefProductOfficer（小乔）
> 前置核查：路由包 ✅ | 商业模式（三元宇宙价值流动.md）✅ | 架构（三元宇宙架构与模块说明.md）✅ | TriCompany 产品真源（product-state.md）✅
> 依据：第一阶段 = AI 商业（Phase 1），MVP 策略 = L0→L1 最小闭环，TriChain 尚未运行。

---

### 裁决 #1：四层身份数据模型边界（DB vs 链上）

**APPROVE**——分阶段，DB 先行，链上渐进。

| 数据类别 | Phase 1（当前） | Phase 2（TriChain 上线后） |
|----------|----------------|--------------------------|
| 用户基础信息（用户名/邮箱/密码/注册时间） | TriMem DB | 不变 |
| 钱包地址绑定 | TriMem DB（记录绑定关系） | DB + 链上验证 |
| NFT 元数据 | 链下（IPFS/DB），DB 存引用哈希 | 链上 NFT + 链下扩展元数据 |
| 身份级别（user/community/OPC/shareholder） | TriMem DB + 审计日志 | 不变（DB 为主，链上为辅） |
| 营业执照数据 | TriMem DB（加密存储） | 不变 |
| 代币/Token 余额 | DB 记账（内部账本） | 迁移至 TriChain，DB 保留缓存 |
| 股权记录 | DB 记账（内部账本） | 迁移至 TriChain，DB 保留缓存 |

理由：Phase 1 TriChain 未运行，DB 承担全部数据存储。代币/股权以内部账本形式起步，TriChain 上线后逐步迁移。NFT 铸造 Phase 2 再启动。

---

### 裁决 #2：晋级触发条件与业务流程

**APPROVE**——三级触发，逐级不可跳跃。

| 晋级 | 触发方式 | 条件 | Phase |
|-------|---------|------|-------|
| 注册用户 → 社区成员 | **自动** | 首次收到平台奖励（完成培训/任务奖励/空投等任一来源） | Phase 1 |
| 社区成员 → OPC | **手动** | 提交营业执照 + 平台审核通过 | Phase 1 |
| OPC → 股东 | **阈值自动** | 持有 TriMetaverse 平台代币达最低股权门槛 | Phase 2 |

流程链路：
```
注册 → TriMem 写用户记录 → 首次收币 → 自动标记 community → 解锁投票入口
                                              ↓
                              提交营业执照 → TriOPC 审核 → TriMem 标记 opc → 解锁 OPC 面板
                                              ↓
                              代币达标 → 自动标记 shareholder → 解锁治理权
```

理由：自动化晋级降低运营成本。OPC 涉及法定资质，必须人工/半自动审核。股东级依赖 TriChain，延后。

---

### 裁决 #3：TriCode 多工具独立登录策略

**APPROVE**——完全独立，可选关联。

```
TriMem 账户 ←──可选关联──→ opencode 账户
                ←──可选关联──→ Claude Code 账户
                ←──可选关联──→ Codex 账户
                ←──可选关联──→ zcode 账户
                ←──可选关联──→ Copilot 账户
```

- 各工具维护自身认证，TriMem **不作为**工具侧的 Auth Provider。
- TriMem 提供"关联工具账户"功能：用户主动在 TriPilot 设置中绑定各工具账户。
- 关联行为**非强制**——不关联不影响工具正常使用。
- 关联后解锁：跨工具用量统计面板、统一 Token 消耗视图。

理由：代码工具各有独立生态和账户体系，TriMem 不应也无法统一接管。可选关联提供增值价值而不引入耦合。

---

### 裁决 #4：TriGateway 社交账户绑定模式

**APPROVE**——1:N，一账户多社交绑定。

- 一个 TriMem 账户可绑定多个社交平台账户（微信 / 抖音 / X / Discord / Telegram 等）。
- 同一社交平台内，一个社交账户只能绑定一个 TriMem 账户（防刷）。
- 绑定后支持：社交登录、社交渠道用户来源追踪、跨平台统一用户画像。

理由：Phase 1 社交获客策略需要多渠道触达能力，1:N 是增长基础设施。

---

### 裁决 #5：MVP 用户故事优先级

**APPROVE**——分三级，P0 先跑通，P1/P2 渐进。

| 优先级 | 用户故事 | 所属 Phase |
|--------|---------|-----------|
| **P0** | 注册/登录（含密码找回） | Phase 1 L0 |
| **P0** | 钱包地址绑定（记录绑定关系） | Phase 1 L0 |
| **P1** | 基础用户资料（昵称/头像/简介） | Phase 1 L1 |
| **P1** | 社区成员自动升级（首次收币触发） | Phase 1 L1 |
| **P2** | 营业执照上传 + OPC 升级审核 | Phase 1 L2 |
| **P2** | 社交账户绑定（1:N） | Phase 1 L2 |
| **P2** | 代码工具账户可选关联 | Phase 1 L2 |
| **P3** | 股东身份跟踪 | Phase 2 |
| **P3** | NFT 身份铸造 | Phase 2 |

理由：L0 = 注册闭环（能进来），L1 = 基本身份闭环（能升级），L2 = 商业身份闭环（能变现）。

---

### 裁决 #6：数据库设计起点

**APPROVE**——首版 Schema 范围。

```
MVP Phase 1 L0-L1 建表清单：

users
  id, username, email, password_hash, display_name, avatar_url,
  identity_level(enum: user/community/opc/shareholder),
  created_at, updated_at

wallet_bindings
  id, user_id(FK→users), chain_type, wallet_address, verified, verified_at

social_bindings
  id, user_id(FK→users), platform, platform_user_id, platform_username, bound_at

Phase 1 L2 追加：

business_licenses
  id, user_id(FK→users), license_number, company_name, document_url,
  status(pending/approved/rejected), reviewed_by, reviewed_at, created_at

code_tool_links
  id, user_id(FK→users), tool_name, tool_account_id, linked_at

token_ledger（Phase 2 前 DB 记账过渡）
  id, user_id(FK→users), token_type, amount, transaction_type, description, created_at
```

理由：先建用户核心表 + 钱包绑定 + 社交绑定（L0-L1），L2 阶段追加商业相关表。token_ledger 作为 Phase 2 前的过渡账本。

---

### 裁决 #7：TriOPC MVP 范围预判

**FREEZE**——等待 PHP 源码进入 `reference/` 后再做最终裁决。但给出方向性预判供 CTO 做技术准备。

方向性预判（待源码确认后生效）：
```
TriOPC MVP（L2 阶段启动）：
  ① 营业执照上传 + OCR 校验 + 人工/半自动审核
  ② 商户基础信息（门店名称/地址/联系方式）
  ③ 应用发布入口（IPD→TriDev→OPC 应用列表）
  ④ 收益看板（披露发布应用的 Token/法币收益统计）

Phase 1 不做：
  ❌ 商城/团购/点餐/收银（等源码吸收后再评估）
  ❌ 抖音对接（Phase 2+）
  ❌ 代理层级/连锁商户管理（Phase 2+）
  ❌ 独立支付系统（复用 TriStaciss）
```

FREEZE 理由：TriOPC 源码尚未进入 reference/，产品决策缺少事实依据。方向性预判不替代最终裁决。

---

### 裁决 #8：TriOPC 与 TriMem 用户模型对接

**APPROVE**——OPC 升级流程嵌入 TriMem 晋级体系。

流程图：
```
用户 → TriPilot 点击"申请 OPC" → TriMem 校验当前级别=community
     → 上传营业执照 → TriMem 存储 + 创建 business_license 记录(status=pending)
     → TriOPC 审核服务轮询 pending → OCR 校验 → 人工复核
     → TriOPC 返回审核结果 → TriMem 更新：
         - 通过：identity_level → opc, business_license.status → approved
         - 拒绝：business_license.status → rejected, 附拒绝原因
     → 通知用户结果 + 解锁 OPC 面板（通过时）
```

接口约定：
- TriOPC 审核结果回调 TriMem API → TriMem 负责写回身份级别
- **TriOPC 不直接写 TriMem 数据库**——保持数据主权在 TriMem

理由：TriMem 是身份数据 SSOT，所有身份变更必须由 TriMem 仲裁。OPC 审核是验证服务，只读不写。

---

### 裁决 #9：PC 端 MVP 验收标准

**APPROVE**——一条端到端任务链即为 MVP Done。

```
用户故事：
  "作为一名新用户，我安装 Electron 应用后，
   可以看到聊天界面，输入一个任务，
   任务被总助理解并分派给员工执行，
   最终我收到执行结果。"

验收门禁（按顺序全部通过 = MVP Done）：
  G1: Electron 安装包可正常安装启动（Win/Mac/Linux）
  G2: 启动后自动拉起 TriLC 本地服务（后台静默）
  G3: 聊天界面连接成功（优先连 TriMC，断线自动切 TriLC）
  G4: 输入"帮我整理本周工作" → 消息发送成功，返回 agent 思考过程
  G5: 任务被 ChiefOfStaff 解析 → 路由到对应员工 agent
  G6: 员工 agent 完成执行 → 结果展示在聊天窗口
  G7: 任务历史可回溯（会话列表）
  G8: 基础设置页可配置 TriMC 连接地址

不做（Phase 1 后）：
  ✗ 离线模式全功能（TriLC 仅保障基础可用）
  ✗ 多会话并行
  ✗ 任务模板市场
```

理由：一条任务链路闭环 = 核心价值可验证。离线模式做最小保底不做全功能。

---

### 裁决 #10：简化模式默认预设

**APPROVE**——首次启动默认简化模式，一键恢复。

```
简化模式（默认）：
  保留：
    ✅ 聊天输入框
    ✅ 任务历史列表
    ✅ 基础设置（主题/语言）
    ✅ "切换到全功能模式"按钮（醒目位置）
  隐藏：
    ❌ TriMC 高级配置（端点/超时/重试策略）
    ❌ Agent 选择器 / 员工编排面板
    ❌ 调试日志控制台
    ❌ 插件管理入口
    ❌ TriLC 本地服务管理面板
    ❌ 开发工具链菜单

全功能模式（点击切换后）：
  所有功能可见可用，切换按钮变为"简化模式"，可随时切回。
  模式偏好保存到本地（不跨设备同步）。
```

理由：降低新用户认知负荷，保留一键逃生路径。Power user 知道自己在做什么。

---

### 裁决 #11：插件市场形态

**APPROVE**——Phase 1 不设插件市场，IPD→TriDev 直发。

```
Phase 1 L0-L1: 无插件市场
  - AI 应用通过 IPD 流程 → TriDev 构建 → 发布到用户可见的"我的应用"列表
  - 不引入应用审核、评价评分、支付结算、版本管理界面

Phase 1 L2（重新评估）：
  - 当 OPC 商户数 ≥ 5 且发布应用 ≥ 10 时，评估是否启动插件市场 MVP
  - MVP 市场：应用列表 + 一键安装 + 基础评分

Phase 2+：
  - 完整市场：付费、审核、版本管理、排行榜
```

理由：Phase 1 核心是跑通"AI 公司帮你干活"的端到端链路，应用发布走最简路径。市场是分发层优化，不是 MVP 刚需。

---

### 裁决 #12：TriAvatar MVP 范围

**APPROVE**——Phase 1 静态头像级，3D 后置。

```
Phase 1 MVP:
  - 上传自定义头像（PNG/JPG/GIF）
  - AI 生成头像（基于文字描述，调用 TriModel 图像生成）
  - 头像与 TriMem 账户绑定，跨模块显示一致
  - 默认头像池（10-15 个预置选项）

Phase 2:
  - 轻量 3D 数字形象（WebGL 渲染，无需客户端安装）
  - 骨骼动画 + 表情驱动
  - NFT 化数字形象（链上铸造、交易）

Phase 1 不做：
  ❌ 3D 渲染引擎
  ❌ 骨骼动画 / 表情捕捉
  ❌ VRM / glTF 标准支持
  ❌ 虚拟试衣 / 配饰系统
```

理由：Phase 1 = AI 商业，不是元宇宙。头像满足身份辨识即可。3D 技术与 Phase 1 核心价值不相关。

---

### 裁决 #13：数字宠物独立路线

**APPROVE**——预留模块占位，当前不投入。

- 在 20 模块全景中预留模块名 `TriPet`（或 CEO 最终命名）。
- Phase 1 交付范围**不包含** TriPet 的任何功能。
- 模块表中标记状态为 `DISCOVERY / 待规划`。

理由：数字宠物是独立产品线，不应与 Avatar 耦合。Phase 1 资源聚焦 AI 商业核心链路。

---

### 裁决 #14：多工具支持优先级

**APPROVE**——opencode → Claude Code → 其他。

```
接入顺序：
  Tier 1（Phase 1 L1）：opencode
    - 已有 TriCode glue 层代码
    - ACP 协议对接已验证
    - 优先级最高：先跑通一个完整工具链路

  Tier 2（Phase 1 L2）：Claude Code
    - 与 TriMC infra（Claude Code 底座）同源
    - 用户群体大，产品吸引力强
    - 技术风险低（共享 infra 选型）

  Tier 3（Phase 2+）：Codex / zcode / Copilot
    - 按市场反馈和接入成本排序
    - Copilot 开发环境在用，但上线不依赖（CEO 已定调）
```

理由：已有 glue → 同源底座 → 外部扩展，风险递增排序。

---

### 裁决 #15：工具账户可选关联 TriMem

**APPROVE**——可选关联，增值不解耦。

```
关联流程：
  TriPilot 设置 → 工具账户管理 → 选择工具 → 输入工具侧凭证
  → TriMem 存储关联关系（不存储工具侧密码/Token）
  → 关联完成

关联后解锁：
  ✅ 跨工具用量统计面板（opencode X 次 + Claude Code Y 次 = 总计）
  ✅ 统一 Token/API 消耗视图（按工具分列）
  ✅ "最近使用的工具"快捷切换

不关联影响：
  - 工具正常独立使用，无任何功能限制
  - 用量统计仅在工具自身界面可见
  - 不影响 TriPilot 聊天/任务下发等核心功能
```

理由：可选关联 = 降耦设计 + 增值功能。不强绑 = 尊重工具独立性。未来若 TriStaciss 统一计费，关联关系作为计费归因基础。

---

## 七、裁决后流转

CPO 完成以上 15 项裁决后，按以下顺序流转：

1. **产品文档回填**：CPO 将裁决结论写入对应模块 `docs/registry/product-state.md`（如模块 registry 未初始化，先创建占位）
2. **技术路由**：统一交付 CTO，启动以下技术任务：
   - CTO-008-P：PC 端 Electron 打包（依赖 #9-11）
   - CTO-008-M：TriMC↔TriLC 通信协议设计（依赖 TriMem 裁决背景）
   - CTO-008-S：TriMC K8s HA 运维方案
3. **TriOPC 建仓**：源码放入 `reference/` 后启动（当前 FREEZE）
4. **TriMem 激活**：CPO 裁决完成后，CTO 接手数据库设计与模块初始化

---

## 附录：关键真源引用

| 文档 | 路径 | 说明 |
|------|------|------|
| 商业模式真源 | `三元宇宙价值流动.md` | 三阶段升级路径、三重身份、二十模块映射 |
| 白皮书 | `tmv-whitepaper.md` | §3.3.1/§5.3/§7.3/§8 已含商业模式内容 |
| 架构全景图 | `docs/architecture-overall-unified.mmd` | 20 模块四层全景 |
| 模块说明 | `docs/三元宇宙架构与模块说明.md` | 模块表中央 SSOT |
| 架构设计 | `../TriCompany/docs/engineering/DESIGN.md` | TriMC/TriLC 架构约束 |

---

*本路由包由 CEOChiefOfStaff（小贾）代表 CEO 发起，CPO 裁决后进入下一流转环节。*
