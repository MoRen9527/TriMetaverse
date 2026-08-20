# Agent 治理与对齐设计（AGENTS.md 真源化 + 模块宿主配套 + 多宿主退役）

版本：v1.0（设计稿）
日期：2026-08-20
状态：CEO 定调待办（分析完成，不开工；FADE 质量手动审核后启动）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/agent-governance-alignment-design.md
- syncMode: source-only
- lastSyncedAt: 2026-08-20

来源：CEO 2026-08-20 指令（AGENTS.md 对齐 / 模块宿主配套 / TriMC-TriLC 模块配套）+ 四问深化（双真源/契约缺口/真源收回/新模块标准化）+ 三点修正（独立文档/宿主退役/增量管理范围）
分析：小贾牵头 × 小狄（技术）× 小乔（产品），xiaojia-alignment-analysis 交付

## 一、AGENTS.md / CLAUDE.md 分层收敛

**现状**：AGENTS.md（agent 行为规则真源：families/路由/命名/纪律）与 CLAUDE.md（工程操作手册：命令/CodeGraph/模块目录/文件约定/周 OP）并存，**Source of Truth 与 Registry Routing 两段双真源漂移**（各一份不同列表）。

**设计（分层收敛，不合并）**：

| 文件 | 职责 | 管理形态 |
| --- | --- | --- |
| AGENTS.md | 治理规则（families/路由/纪律/真源顺序） | **TriCompany 真源发布**：模板 + 项目差异段（extraSections 同构），禁手动修改（D-07 派生壳纪律），漂移由管线检出 |
| CLAUDE.md | 项目操作手册（命令/CodeGraph/模块目录/文件约定） | 项目侧维护（有效性=跟随项目代码演化）+ 重叠段改"见 AGENTS.md §X"引用 |

- 重叠段唯一化：Source of Truth 顺序与 Registry Routing 只存 AGENTS.md，CLAUDE.md 引用不复制
- 模块 AGENTS.md（TriLC/TriPilot/TriMC/TriCompany 已是统一五段式模板）：从手工复制改为发布管理（范围是否含模块级待 CEO 定）

## 二、模块 registry 三件套 contract 化（运行时面）

**实证**：模块侧 0 份 contract.yaml（仅 TriCompany 中央 14 份 v2）；模块 registry（如 TriLCBusinessStrategyRegistry）是纯 `.agent.md` 咨询面资产——**职责/边界/决策权无程序化承载**，TriLC /agents company 面 14 个全无模块 registry；TriMC/TriLC 运行时消费 TriCompany contract.yaml，**模块 .github/agents 不被任何运行时消费**。

**设计**：模块 registry 三件套 **contract 化**（轻量声明：职责/边界/上游/消费方/owner）——进运行时加载面（TriLC /agents 扩展模块 scope / TriMC registry 扩展模块面），模块治理信息程序化可消费。

**三份定义交叉校验**：`.agent.md`（live discovery）/ `.contract.yaml`（运行时）/ `binding-profile`（宿主 binding）三条维护链 → 校验入管线（TODO-6）。

## 三、已有模块真源收回与多宿主发布

与员工同构的"源侧真源 → 多宿主渲染 → 发布"模型：

| 环节 | 设计 |
| --- | --- |
| 真源收回 | 模块三件套源侧收 TriCompany（中央真源区）；模块 owner 内容输入 → TriCompany 收口（写回模型） |
| copilot 面 | manifest 登记模块 registry → 管线渲染发布到各模块 `.github/agents/`（替代手工维护态） |
| claude 面 | 同一真源 → claude 宿主注册表渲染 → 各模块 `.claude/agents/`（补全缺失形态） |
| 纪律 | D-07 同构：发布产物禁手动修改，漂移由管线检出 |

## 四、多宿主演进与**宿主退役机制**（CEO 修正 2）

多宿主渲染是"先 copilot 后 claude"的演进——**未来可发布任何宿主**（注册表新增条目，管线零改动）；同时**为避免宿主 agents 过多，需支持宿主退役**：

- **退役宿主**：清理该宿主的 agents 发布面 + 关联资产（binding profile liveEntry 段、manifest 条目转 retiredEntries、知识资产/宿主命名空间）——与 live entry 退役预案（TriMC 切换时点）同构
- **生命周期**：宿主注册表 = 可增可减（新增=模板+manifest+白名单；退役=清理+归档+审计）
- 退役触发器：宿主弃用（如 Copilot-host 切换 TriMC 时点）、agents 冗余（多宿主重复面清理）

## 五、增量管理全链路（CEO 修正 3：不只是模块记忆）

**registry 三件套随模块变化而变化**——增量管理 = 全链路：

1. **模块内容增量**：模块职责演进 → registry 三件套内容变化 → 源侧更新 → 管线增量渲染发布（copilot/claude 双面）
2. **模块记忆增量**：模块 wiki/inbox 消费记录 → 知识注入内容层（`module/<id>` 命名空间扩展）→ 会话注入
3. **契约增量**：模块 registry contract 化后，职责/边界变化 → contract 更新 → 运行时加载同步
4. **联动**：模块变化事件（event-watch 已落地）→ 发布检查 → 变更审计

## 六、新模块标准化配套（Q4）

新模块标准配套 = **四件套进管道**（建模块一步就位，同模块六件套纪律）：

1. AGENTS.md 模板（五段式，发布管理）
2. registry 三件套（contract 化）
3. manifest 登记（→ copilot/claude 双面渲染发布，进管道是标配）
4. 知识命名空间预留（module/<id> 记忆 + 内容层）

TriMC/TriLC runtime：模块 registry contract 化后进运行时加载面（模块职责程序化可消费）。

## 七、TODO 清单（已记录周平面，均不开工）

| 编号 | 项 | 优先级 |
| --- | --- | --- |
| TODO-1 | AGENTS.md 真源化（TriCompany 模板发布 + 禁手动修改） | P0 |
| TODO-2 | CLAUDE.md/AGENTS.md 分层收口（重叠段唯一化） | P0 |
| TODO-3 | 模块三件套进管道（contract 化 + 双面渲染 + 跨仓写形态定案） | P0 |
| TODO-4 | TriMetaverse/.github/agents 游离残留清理（retiredLiveEntries） | P0 |
| TODO-5 | TriCode 模块标准配套补建 | P1 |
| TODO-6 | 三份定义（.agent.md/contract/binding）交叉校验入管线 | P1 |
| TODO-7 | 宿主退役机制（清理 agents + 关联资产 + 归档审计） | P1 |
| TODO-8 | 增量管理全链路（模块内容/记忆/契约三增量 + event-watch 联动） | P1 |

## 八、CEO 定调点（FADE 质量审核后确认）

1. AGENTS.md 真源化范围：仅根 or 含各模块（模块已是统一五段式）
2. CLAUDE.md 治理形态：分层收敛确认（项目手册本地维护 + 真源段引用）
3. 模块三件套管道形态：跨仓渲染 vs 只读校验（涉跨仓写授权）
4. 模块 registry 是否补 claude 面发布（默认是）
5. TriCode 正式模块地位（BusinessStrategy 边界裁决）
6. 宿主退役触发条件与首个候选（Copilot-host 切换时点？）
