# TriMetaverse 模块配合方案

> **制定**：小贾（CEO Chief of Staff）综合小狄（CTO）+ 小乔（CPO）评估
> **日期**：2026-08-06
> **状态**：待磨人审批

---

## 一、模块分层（产品视角：用户只接触 L0）

```text
L0 入口层   TriCade（桌面壳，承载多入口）
              ├─ TriPilot（IDE 入口：VS Code/VSCodium 扩展）
              ├─ trilc chat（CLI 入口：终端对话）
              ├─ TriAvatar（网页入口 + 未来元宇宙入口）
              └─ TriMobile（移动端入口）
L1 运行层   TriLC（本地 daemon：heartbeat / cron / session / onboarding 检测）
L2 公司层   TriCompany（赛博公司：岗位 / 治理 / 周平面 / 记录）
L3 服务层   TriMC（云端主控）+ TriModel（模型路由）+ TriStaciss（计费）
L4 能力层   TriCode（代码工具 glue）
```

**原则**：用户只接触 L0 的任一入口；L1-L2 是"公司开张后自动在场"的运行层；L3-L4 用户无感。所有产品价值在 L0 兑现，所有公司价值在 L2 兑现。**多入口共享同一 daemon 与公司状态**——IDE/CLI/网页/移动只是同一公司的不同交互面。

---

## 二、分发形态决策矩阵

| 模块 | 成熟度 | 分发形态 | 版本节奏 |
| --- | --- | --- | --- |
| TriCade | v0.3.0+ | **安装包本体** | 周级（双轨 ≤2 周） |
| TriPilot | DISCOVERY→CODING | **进安装包**（VS Code 扩展） | 随安装包 |
| trilc chat | 已可用 | **进安装包**（CLI，daemon 自带） | 随安装包 |
| TriAvatar | DISCOVERY | 研发仓 → 网页入口独立部署（Phase 2+） | 独立 |
| TriMobile | DISCOVERY | 研发仓（Phase 2+） | 独立 |
| TriLC | daemon 三层合入 dev | **进安装包**（核心 daemon） | 随安装包；dev 可更快 |
| TriCompany | V1.0（13 员工） | **双形态**：@tricompany/core npm + 安装包内嵌模板快照 | npm 周级；快照随包 |
| TriModel | 可工作 library | **双形态**：npm library + 配置平面随 daemon 进包 | npm 独立 |
| TriMC | 骨架 | **独立服务**（云端），不进安装包 | 独立发布 |
| TriCode | DISCOVERY（无代码） | **留研发仓**，工程化后独立版本化 | 不承诺 |
| TriMem 等 | DISCOVERY | 研发仓 | Phase 2+ |

**进包三原则**（裁决未来新模块）：

1. 用户旅程必经步骤（无它则开张/建项目/运营断链）
2. 成熟度达到"随包即承诺"（安装版滞后 ≤2 周）
3. 不因进包失去独立演进通道（必要时双形态）

---

## 三、TriCompany 模板分发（双形态）

```text
模板真源 = @tricompany/core npm 包（可更新）
安装包内嵌 = 发布时点的出厂快照（开箱即用）
```

**三个机制**：

1. **真源分离**：模板真源 = @tricompany/core；安装包内嵌 = 出厂快照
2. **版本对齐**：内嵌快照标注 npm 版本；TriLC 启动静默检测新版 → 提示更新（不自动覆盖）
3. **用户数据隔离**：用户定制（CEO 名/岗位/记录）只在项目工作区；模板升级"只新增不覆盖 + diff 报告"

**明确不做**：模板自动热升级、模板与用户数据混存。

---

## 四、依赖与构建架构（CTO）

### 三层依赖

```text
编译期（file: 依赖，保留）          运行期（MSI node_modules）      发布期（分发产物）
TriModel ──→ agent-core ──→ TriLC    trilc/node_modules:             npm pack tarball（演练）
TriCode ──→ TriPilot                  ├ agent-core（真实目录）       模板资产包（MSI assets）
                                      └ trimodel + transitive         VERSION.json 组件矩阵
```

### 构建顺序

```text
TriModel → TriMC/agent-core → TriCode → TriLC → TriPilot → TriCompany 模板 → TriCade 聚合
```

### 关键治理（CTO 发现的问题）

| 问题 | 修复 |
| --- | --- |
| TriLC contracts 路径已设计（staging\trilc\contracts\）但 CI 从未创建 → 生产 0 agents | **Phase 0**：CI 加 TriCompany checkout + staging 创建 contracts（git archive 冻结快照）+ 门禁断言 agent 数 > 0 |
| TriPilot vsix `--no-dependencies` 缺 tricode → 生产 MODULE_NOT_FOUND | Phase 1：`npm ci --install-links` + vsce 带依赖 |
| 6 仓同名 tag 才可发布（任一缺失构建失败） | Phase 1：组件 release manifest（按 tag/SHA 分别锁定） |
| TriLC 版本双源（package 0.9.0 vs version.json 1.0.0） | Phase 1：发布管线从 package.json 派生 |
| file: 依赖 symlink 进 node_modules 产物损坏 | Phase 1：统一 `npm ci --install-links` |
| VSCodium 壳未标准化 | Phase 2：接入 staging + VERSION.json |

---

## 五、资产归属（产品证据链 vs 出厂资产）

| 资产 | 归属 | 分发 |
| --- | --- | --- |
| 白皮书 WP-v* / 黄皮书 YP-v* / PRD | **项目资产**（IPD 证据链） | 不进安装包（只提供模板骨架） |
| 十件套 / 岗位五件套 / 治理资产 | **出厂资产**（随公司骨架） | 进安装包（模板快照） |
| 周工作平面 / OP 记录 | **运行时产物** | 产生于运营仓，不进包 |

**边界**：安装包是"能力载体"，不是内容仓库。

---

## 六、分阶段落地

| 阶段 | 内容 | 优先级 |
| --- | --- | --- |
| **Phase 0** | TriCompany 模板进包（CI + staging contracts + wxs + 门禁）+ TriPilot vsix 依赖修复 | **立即** |
| Phase 1 | 版本治理（version.json 派生 + release manifest + install-links） | 随 Phase 0 |
| Phase 2 | VSCodium 壳标准化（REQ-007/009）+ TriAvatar 网页入口评估 | 随 P1 |
| Phase 3 | 各仓独立 CI + 聚合发布 CI | 后续 |
| Phase 4 | @tricompany/core 工程化（npm 包 + CLI） | 双形态前提 |

---

## 七、待 CEO 裁决

1. **分发矩阵**：TriCompany 双形态（npm + 内嵌快照）、TriMC 独立服务不进包、TriCode 留研发仓、TriAvatar/TriMobile 研发仓 Phase 2+——同意？
2. **Phase 0 开工**：TriCompany 模板进包 + TriPilot vsix 修复？
3. **@tricompany/core 治理**：谁 publish、版本纪律、开源许可（开源已裁决，npm 治理需明确）
