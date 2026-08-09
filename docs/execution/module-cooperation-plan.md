# TriMetaverse 模块配合方案（V2 · 扩展层级）

> **制定**：小贾（CEO Chief of Staff）综合小狄（CTO）+ 小乔（CPO）重审
> **日期**：2026-08-06
> **状态**：待磨人审批

---

## 一、模块分层（六层架构）

```text
L0 入口层（并列多入口，无从属）
   桌面端入口: TriCade = VSCodium 宿主壳 + TriPilot（IDE 入口）+ trilc chat（CLI 入口，可独立使用）
   web端入口: TriAvatar chat
   移动端入口: TriMobile chat
   社交入口:   TriGateway（社交入口）
L1 运行层（核心引擎/调度层）
   TriLC（本地核心引擎：自主决策/编排调度/heartbeat/cron/session/onboarding 检测）
   TriMC（云端核心引擎：与 TriLC 既互为fallback又有服务域与本地域的协同）
L2 公司层   
   TriCompany（赛博公司：岗位/治理/周平面/记录）
   TriOPC （SaaS 平台：OPC相关服务落地）
L3 服务层   TriModel（模型路由）+ TriStaciss（Token计费）
L4 能力层   TriCode（Coding Agent glue）+ TriDev/TriTest/TriDeployment + TriAuto（自动化编排占位）
              + TriSkill（技能库）+ TriTraining（培训双轨）
L5 数据审计层  TriMem（身份中枢 SSOT）+ TriChain（链上账本，审计数据上链）
              + TriWeb4（web3/web4 钱包，系统经济运转数据贡献方）
              （审计语义：TriChain 承载审计数据上链；CAO域/TriDev ASSURANCE 数据入层审计；
                TriWeb4 是数据贡献方而非审计承载方）

```

**分层语义**：

| 层 | 定位 | 用户可见性 |
| --- | --- | --- |
| L0 | 用户接触面（获客入口 TriGateway + 体验入口其余） | 可见 |
| L1 | **核心引擎/调度层**（自主决策、编排调度、运行时本体） | 半可见 |
| L2 | 公司价值兑现层：TriCompany（赛博公司）+ TriOPC（SaaS 平台，OPC 服务落地） | 可见（内容层） |
| L3 | 模型与计费供给：TriModel（模型路由）+ TriStaciss（Token 计费） | 不可见 |
| L4 | 公司执行能力（员工工具为主，TriCode 为产品底座） | 不可见 |
| L5 | 数据审计层：TriMem 身份中枢 + TriChain 审计上链 + TriWeb4 经济数据贡献（钱包） | 不可见 |

---

## 二、模块核查（CTO 实测）

| 模块 | 状态 | 代码 | 层级 |
| --- | --- | --- | --- |
| TriCade | v0.3.0+ 安装包 | MSI 构建中 | L0 |
| TriPilot | DISCOVERY→CODING | VS Code 扩展 | L0 |
| trilc chat | 已可用 | TriLC CLI | L0 |
| TriAvatar | DISCOVERY | **React 前端已有**；chat 为占位界面 | L0（web 端入口） |
| TriMobile | 占位 | chat 为占位界面 | L0（移动端入口） |
| TriGateway | 占位 | 无（OAuth 捕获通道语义） | L0 |
| TriLC | daemon 三层合入 dev | 现役 v0.9.0 | L1 |
| TriMC | 骨架 + Phase 1/2 | monorepo | L1 |
| TriCompany | V1.0（13 员工） | 纯资产仓 | L2 |
| TriModel | 配置平面已上线 | library + API | L3 |
| TriStaciss | CTO-004 APPROVED | Python + Docker | L3（Token 计费） |
| TriOPC | reference 吸收待启动 | PHP 骨架 | L2（SaaS 平台，OPC 服务落地） |
| TriCode | DISCOVERY（无代码） | glue 层 | L4 |
| TriDev | super-dev 吸收中 | **Python 引擎开发中** | L4 |
| TriTest | 完整 | **tritest CLI 可用** | L4 |
| TriDeployment | 完整 | **trideploy CLI 可用** | L4 |
| TriAuto | 占位模块 | 利用 TriDev/TriTest/TriDeployment 能力形成自动化（编排层） | L4 |
| TriSkill | Wave 0-3 完成 | 18 个 skill（内容） | L4 |
| TriTraining | 产品定位完成 | 占位；获客轨 + 内训轨 | L4 |
| TriMem | DISCOVERY→DESIGNING | **身份 SSOT（auth/wallet 有代码）** | L5 |
| TriChain | 占位 | 审计数据上链载体 | L5 |
| TriWeb4 | 占位 | web3/web4 钱包，经济运转数据贡献方 | L5 |

---

## 三、分发形态决策矩阵

| 模块 | 分发形态 | 裁决依据 |
| --- | --- | --- |
| TriCade / TriPilot / trilc chat / TriLC | **进安装包** | 用户旅程必经 |
| TriCompany | **双形态**：@tricompany/core npm + 内嵌快照 | 开箱即用 + 独立演进 |
| TriSkill | **随 @tricompany/core 进包**（岗位资产）+ 研发仓 | 技能是岗位标配，开箱即有 |
| TriModel | **双形态**：npm library + 配置平面随 daemon | 已如此 |
| TriStaciss | **独立服务**（云端计费端点） | 不变 |
| TriMC | **独立云服务**，不进包 | 云端实体 |
| TriMem | **研发仓**，Phase 1 L2 用户注册上线时评估随包（本地形态） | 当前旅程不经过用户注册 |
| TriGateway | **研发仓**，随 TriMem 就位后独立/随云部署 | 获客是 Phase 1 后段 |
| TriAvatar | **网页独立部署**（Phase 2+） | 与桌面壳无关 |
| TriMobile | 研发仓（Phase 2+） | 占位 |
| TriCode | 留研发仓 | 无代码不承诺 |
| TriDev / TriTest / TriAuto | **留研发仓 + npm 独立发布** | 公司能力，运营侧旅程不经过 |
| TriTraining | 研发仓；获客轨随 TriAvatar 网页部署 | 双轨拆分 |
| TriChain / TriWeb4 | 研发仓（Phase 2+） | 占位，禁止进发布管线 |
| TriOPC | **独立 SaaS 平台部署**（Phase 2+ 评估） | 服务外部 OPC 群体，利用 TriCompany 能力 |

**进包三原则**：1) 用户旅程必经；2) 成熟度达"随包即承诺"（滞后 ≤2 周）；3) 不因进包失去独立演进通道。

---

## 四、用户旅程（扩展层级）

```text
获客环（Phase 1 L2+）: 社交平台 → TriGateway 捕获 → TriMem 注册（L5 身份）
  → TriTraining 免费课程 → 首次对话 → 奖励 → 晋级社区成员

现役核心（Phase 1）: 安装（L0 TriCade）→ 开张（L1 检测 → L2 公司 onboarding）
  → 建项目/模块/分配员工（L2，ADE）→ 运营循环（L0 入口 → L1 daemon → L3 模型+计费）

资产环（Phase 2+）: TriChain 链上迁移 → TriWeb4 钱包 → TriMem 股东晋级
  → TriOPC 商户生态 → TriAvatar 元宇宙形态
```

**关键变化**：社交获客提升为 L0 第一环（外部用户第一站 = 社交平台，非网页）。

---

## 五、关键治理项（CTO）

| 项 | 状态 | 处置 |
| --- | --- | --- |
| **TriAuto 模块** | CEO 裁决：TriDeployment 不改名；TriAuto 为占位模块（编排层） | TriAuto 利用 TriDev/TriTest/TriDeployment 能力，独立占位登记 |
| TriLC contracts 路径已设计但 CI 未创建 | 生产 0 agents | Phase 0：模板进包 + 门禁断言 |
| TriPilot vsix 缺 tricode | 生产 MODULE_NOT_FOUND | Phase 1：install-links + vsce 带依赖 |
| 6 仓同名 tag 发布脆弱 | 任一缺失构建失败 | Phase 1：release manifest |
| TriLC 版本双源 | package 0.9.0 vs version.json 1.0.0 | Phase 1：发布管线派生 |
| TriStaciss 双物理目录 | Tricistaspas/Tristaciss | 治理：Tristaciss 为现行 |
| file: 依赖无版本锁定 | 构建随源变化 | build-desktop.ps1 加依赖快照 |

---

## 六、分阶段落地

| 阶段 | 内容 |
| --- | --- |
| **Phase 0** | TriCompany 模板进包（CI + contracts + 门禁）+ TriPilot vsix 修复 |
| Phase 1 | 版本治理（release manifest + install-links + version 派生）+ **TriAuto 命名裁决执行** + TriDev→TriTest/TriAuto CLI 打通 |
| Phase 2 | TriMem Phase 1 收口（auth/wallet + 门禁）+ TriGateway 社交接入 + TriAvatar 容器化 |
| Phase 3 | 各仓独立 CI + 聚合发布 CI + TriMC 云端主控上线 |
| Phase 4 | @tricompany/core 工程化 + TriChain/TriWeb4 就绪后评估 |

---

## 七、CEO 裁决记录（V2.2 已确认）

1. **L5 数据审计层**：保留。TriMem 身份中枢；TriChain 审计数据上链；TriWeb4 是 web3/web4 钱包 + 经济运转数据贡献方（非审计承载）
2. **TriDeployment 不改名**；TriAuto 占位模块（自动化编排层，利用 TriDev/TriTest/TriDeployment）
3. **桌面 TriCade** = VSCodium 宿主壳 + TriPilot（IDE 入口）+ trilc chat（CLI 入口，可独立使用）；TriMobile/TriAvatar 与 TriCade **并列无从属**
4. **入口层**：TriPilot / trilc chat / TriAvatar chat（占位界面）/ TriMobile chat（占位界面）/ TriGateway（社交入口，获客将来再定）
5. **L1 核心引擎层**：TriLC/TriMC 体现自主决策、编排调度、核心引擎地位
6. **TriOPC 归 L2 公司层**：SaaS 平台（OPC 相关服务落地），利用 TriCompany 能力
7. **TriAvatar/TriMobile 为纯入口**（web/移动端 chat），TriTraining 归 L4（培训双轨）
8. **TriSkill 进包**（随公司模板开箱即有）
9. **TriMem 进包时点**（Phase 1 L2 用户注册上线时评估）
