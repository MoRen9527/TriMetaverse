# TriMetaverse Mermaid 资产台账

本目录用于管理 TriMetaverse 仓内的 Mermaid 图资产，方便单独预览、导出图片、复用到 PPT/网页/汇报材料，并作为白皮书与架构文档的图表索引入口。

## 1. 管理范围

当前扫描到的 `.mmd` 文件分为四类：

1. **白皮书图资产**：位于本目录 `mermaid/`，作为白皮书正文图的可复用源文件。
2. **核心架构图资产**：位于本目录 `mermaid/`，不一定是白皮书当前主图，但属于核心模块、主控编排与关键能力结构的长期参考图。
3. **架构设计图资产**：位于 `docs/`，作为系统架构讨论与设计演进的源文件。
4. **外部参考/镜像文件**：位于 `reference/` 或其他第三方代码镜像目录，仅做参考，不作为本项目图资产主索引。

## 2. 白皮书图资产（受控）

- `tmv-end-to-end-value-flow-architecture.mmd`
  - 对应章节：`3.5 端到端系统框架（参考实现映射）`
  - 图题：图 3-1：TriMetaverse 端到端价值流转与架构核心
  - 用途：从《三元宇宙价值流动.md》抽象出白皮书可直接复用的端到端总览图，统一呈现“元宇宙经济入口 -> AI 任务网络 -> 数据与证据系统 -> 链上登记与结算 -> 用户与生态回流”的闭环关系。
  - 状态：**受控主文件**

- `tmv-module-capability-mapping.mmd`
  - 对应章节：`3.3 核心模块`
  - 图题：能力域与核心模块映射简图
  - 用途：用低复杂度关系图直观展示“三元模块”与“平台能力域”的主导映射关系，其中审计与验证被标为跨模块共享能力域，而调度与资源收敛到更贴近元现实模块的主导映射。
  - 状态：**受控主文件**

- `tmv-ai-dev-mobile-loop.mmd`
  - 对应章节：`3.5 端到端系统框架（参考实现映射）`
  - 图题：图 3-3：AI Dev/Mobile Worker 最小内部循环
  - 用途：说明本地域任务如何沿 `Local Task Plan -> Planner -> Local ToolBus -> AI Dev/Mobile Worker -> Feedback -> Judge / Replan -> Memory` 构成闭环，并体现 AI Dev/Mobile Worker 可按需经 Local ToolBus 调用其他本地专业 workers。
  - 状态：**受控主文件**

- `tmv-task-settlement-sequence.mmd`
  - 对应章节：`3.5 端到端系统框架（参考实现映射）`
  - 图题：图 3-4：任务发布到链上结算的最小时序
  - 用途：说明从任务发布、调度、执行、验证到链上结算的最小时序，并区分“服务域任务经 Kubernetes Pod 执行服务器类智能处理”和“本地域任务经 Planner / Local ToolBus / AI Dev/Mobile Worker 执行桌面 / 浏览器 / 手机 App 自动化及终端计算任务”两条路径。
  - 状态：**受控主文件**

- `tmv-core-ai-orchestration-architecture.mmd`
  - 对应章节：`3.5 端到端系统框架（参考实现映射）`
  - 图题：图 3-2：TriMetaverse AI 核心服务（任务处理网络）端到端细化架构
  - 用途：作为图 3-1 中 AI 核心服务（任务处理网络）的细化展开图，展示其在 Local / Server 双域中的参考实现，强调 `Task Main Controller -> Service Scheduler -> Service Pods` 的服务域链路，以及 `Task Main Controller -> Planner -> Local ToolBus -> AI Dev/Mobile Worker` 的本地域链路，并补入验证、报告回写与审计证据沉淀。
  - 状态：**受控主文件**

## 3. 仓内其他 Mermaid 资产（设计文档）

- `tmv-five-layer-architecture.mmd`
  - 类型：抽象分层参考图
  - 内容特征：以任务层、调度层、执行层、验证层、结算层五层抽象概括 TriMetaverse 的端到端实现，并把执行层继续拆分为服务域执行与本地域执行。
  - 状态：**核心参考文件**
  - 备注：该图已不再作为白皮书 3.5 的主图，但仍适合在架构讨论、汇报或教学场景中作为简化抽象视图保留。

- `../docs/architecture-overall-unified.mmd`
  - 类型：总体统一架构图
  - 内容特征：覆盖 Local / Client / Server / SocialFi / Core-Agent / TriStaciss / Observability 等统一架构视图。
  - 状态：**设计源文件**
  - 备注：适合用于系统总览，不建议直接替代白皮书中的精简图。

- `../docs/architecture-socialfi-core-agent-tristaciss.mmd`
  - 类型：服务域拆分架构图
  - 内容特征：聚焦 SocialFi、Core-Agent、TriStaciss 三块服务域及其参考映射关系。
  - 状态：**设计源文件**
  - 备注：适合用于产品/服务域分层讨论。

## 4. 外部参考文件（不纳入主资产管理）

- `../reference/vscode-copilot-chat/src/platform/testing/node/setupTestDetector.mmd`
  - 来源：外部参考代码镜像
  - 类型：第三方测试流程图
  - 状态：**外部参考**
  - 备注：仅随参考代码存在，不属于 TriMetaverse 自有 Mermaid 资产。

> 说明：本次扫描还发现工作区其他仓中的 `.mmd` 文件，例如 `TriPilot/reference/.../setupTestDetector.mmd`。这类文件属于其他仓或外部镜像，不纳入本 README 的管理范围。

## 5. 管理规则

- 白皮书正文所引用的新图，优先在 `mermaid/` 下创建独立 `.mmd` 文件，并在本 README 登记。
- 系统设计讨论图，优先放在 `docs/` 下，并在本 README 的“仓内其他 Mermaid 资产”中补充记录。
- 外部参考目录中的 `.mmd` 文件不作为主资产管理对象，不在白皮书中直接引用。
- 若正文 Mermaid 代码块被修改，应同步更新对应 `.mmd` 文件，保持“正文图”和“源文件”一致。
- 若某张图虽然不是白皮书当前主图，但仍描述核心模块、主控编排或关键能力关系，应保留在 `mermaid/` 根目录，并标注为“核心架构文件”。
- 仅当某张图明确不再参与当前方案讨论时，才迁入 `mermaid/archive/`。

## 6. 使用建议

- 适合在 Mermaid 预览工具中单独打开查看。
- 适合导出为 PNG/SVG 后插入汇报材料。
- 适合在架构评审时对比“白皮书图”和“设计源图”的表达粒度。
