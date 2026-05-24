# Registry Layer

## 1. 作用

本目录是 TriMetaverse 的工作型登记层，用来承接：

- 当前商业模式状态
- 模块 business registry 约束
- 跨模块边界
- 当前实验路线
- 模块映射
- 需要被显式记录的策略变化

它不是白皮书和 workflow 文档的替代品，而是便于 agent 读取和更新的压缩工作层。

## 2. 真源优先级

发生冲突时，以下文档优先于本目录：

1. `../../tmv-whitepaper.md`
2. `../../project.md`
3. `../../virtual-company.md`
4. `../三元宇宙架构与模块说明.md`
5. `../workflow/virtual-company-agent-roles.md`

涉及当前 TriCompany 宿主治理、published-copy 或 support bundle 资料时，默认先回到上面的项目级真源与 `../workflow/tricompany-copilot-host-assets-governance.md`，不要把 `TriCompany-copilot-host-assets/**` 当作 registry 层的默认事实入口。

## 3. 当前文件

- `business-strategy-state.md`：当前总商业模式和当前实验状态
- `business-strategy-module-map.md`：商业模式到模块的映射
- `business-strategy-boundaries.md`：模块边界和边界变动约束
- `business-strategy-evolution-log.md`：显式记录的策略演化日志
- `business-state.md`：TriMetaverse 模块自身的商业定位、默认职责与边界
- `product-state.md`：TriMetaverse 模块自身的产品状态登记
- `code-state.md`：TriMetaverse 模块自身的代码 / 仓库状态登记
- `company-governance-state.md`：TriMetaverse 公司层的组织治理、秘书处、会议治理与文档归属状态登记

## 4. 更新规则

- 只有在用户明确要求“记录”或“更新”时才修改本目录。
- 默认只记录经过确认的状态，不记录聊天中的临时猜测。
- 对空目录或低成熟模块必须明确写成“占位 / 待初始化”。

## 5. Registry 命名

- 商业模式资料 agent：`<Module>BusinessStrategyRegistry`
- 产品资料 agent：`<Module>ProductRegistry`
- 代码资料 agent：`<Module>CodeRegistry`
- 公司治理资料 agent：`CompanyGovernanceRegistry`

模块级 `business-state.md` 是同模块 `product-state.md` 与 `code-state.md` 的业务上游约束；中央级总商业模式仍以 `business-strategy-*.md` 系列文档为准。

前三类属于模块 registry，第四类属于公司级功能 registry。

首版允许模块 registry 先不存在，但 BusinessStrategy 必须能指出未来应由哪个 registry 接手。

当前已落地：

- `BusinessStrategy`
- 模块级 `BusinessStrategyRegistry`：当前已有模块已落地，具体路由见 `business-strategy-module-map.md`
- `TriMetaverseProductRegistry`
- `TriMetaverseCodeRegistry`
- `CompanyGovernanceRegistry`
