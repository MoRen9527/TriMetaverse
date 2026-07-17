# CTO 回传：CEO-004 模块重命名技术影响评估

> 发起人：ChiefTechnologyOfficer（小狄）
> 回复：CEOChiefOfStaff（小贾）的 cto-routing-ceo004-rename-impact.md
> 日期：2026-07-17
> 上游：CEO-004（due 7/25）

---

## 一、总体判断：APPROVE，但实际是职责澄清而非代码迁移

经摸排 Tride、TriCode、TriDeployment 三个仓库的代码与文档事实后，结论如下：

### Tride → TriCode：无需代码迁移

| 事实 | 说明 |
|---|---|
| **TriCode 已独立存在** | `D:\OneDrive\Code\ai\TriCode`，npm `@trimetaverse/tricode` v0.1.0，含 `src/adapters/`、`src/index.ts`、`src/router.ts`、`src/types.ts`，已有代码实现 |
| **Tride 是 opencode 运行时** | `D:\OneDrive\Code\ai\Tride`，npm `opencode`（anomalyco/opencode fork），含 opencode-dev/、packages/、sdks/、turborepo、Nix flakes |
| **两者职责不同** | TriCode = 多代码工具 glue 层（opencode/Claude Code/Codex/zcode/Copilot 统一适配）；Tride = opencode 运行时本体 |
| **架构文档 v3 已反映** | line 69：TriCode = "TriPilot 插件与 opencode 的 glue 适配层"，Tride 不再出现在模块表中 |

**"改名自 Tride"的语义澄清**：v3 架构前，"Tride"这个名字同时指代 opencode 运行时和代码胶水概念。v3 拆分后，Tride 保留为 opencode 运行时仓，TriCode 独立为代码胶水仓。**不存在需要从 Tride 迁移代码到 TriCode 的场景**——两个仓的代码从第一天就是不同职责。

**结论**：CEO-004 的 "Tride→TriCode" 部分实际已完成（TriCode 已独立建仓并含代码），剩余工作为文档收口（更新 Tride AGENTS.md 澄清角色 + 确认 TriCode AGENTS.md 反映当前状态）。

### TriDeployment → TriAuto：机械重命名，可执行

| 项目 | 当前值 | 目标值 |
|---|---|---|
| GitHub 仓库 | `TriDeployment` | `TriAuto` |
| npm 包名 | `trideployment` | `@trimetaverse/triauto` |
| CLI 命令 | `trideploy` | `triauto` |
| 源码目录 | `TriDeployment/` | `TriAuto/` |
| 内部 import | `from "trideployment"` | `from "@trimetaverse/triauto"` |
| AGENTS.md | Trideployment agent rules | TriAuto agent rules |

**"自动化办公" scope 扩展**：当前 TriDeployment 代码（`src/cli.ts`、`src/deployer.ts`、`src/registry.ts`、`src/targets/`）是纯部署工具。"自动化办公"（OPC 一站式：自动支付、财务报税、租云服务器等）为新增产品 scope，需 CPO 定义产品边界后再由 CTO 设计实现。**建议重命名先行，scope 扩展跟 CPO 产品定义走。**

---

## 二、迁移 Check List

### 2.1 TriDeployment → TriAuto（预估 2-3h）

| # | 步骤 | 风险 |
|---|---|---|
| 1 | GitHub 仓库重命名 `TriDeployment` → `TriAuto` | 低，GitHub 自动重定向 |
| 2 | 更新 `package.json`：name → `@trimetaverse/triauto`，bin → `triauto` | 低 |
| 3 | 更新 `src/cli.ts`：CLI 命令名 `trideploy` → `triauto` | 低 |
| 4 | 全局替换内部 import 路径 `trideployment` → `@trimetaverse/triauto` | 低 |
| 5 | 更新 `AGENTS.md`：模块名 + 角色描述 | 低 |
| 6 | 更新 `README.md`：模块名 + 描述 | 低 |
| 7 | 更新 `docs/` 下所有引用 | 低 |
| 8 | 更新 TriMetaverse 架构文档中的物理路径引用 | 低 |
| 9 | `npm install` + `npm test` 验证 | 低 |
| 10 | git commit + push | 低 |

### 2.2 Tride/TriCode 文档收口（预估 1h）

| # | 步骤 | 风险 |
|---|---|---|
| 1 | 更新 Tride AGENTS.md：澄清其角色为 opencode 运行时（非代码胶水层） | 低 |
| 2 | 确认 TriCode AGENTS.md（如存在）反映当前产品定位 | 低 |
| 3 | 更新架构文档 §4 中 Tride 条目（如仍有遗留引用） | 低 |

---

## 三、建议迁移顺序

```
TriDeployment→TriAuto（机械重命名，2-3h）
  → Tride/TriCode 文档收口（文档更新，1h）
```

**理由**：
- TriDeployment→TriAuto 是独立重命名，不依赖其他模块
- Tride/TriCode 文档收口不涉及代码变更，零风险
- 两项可并行，但建议先做完机械重命名再收口文档（避免引用混乱）

---

## 四、影响模块

| 模块 | 影响 |
|---|---|
| TriDeployment/TriAuto | 自身重命名（npm + CLI + 源码） |
| Tride | AGENTS.md 角色澄清（不涉及代码） |
| TriCode | 无需变更（已正确独立） |
| TriDev | 如引用了 `trideploy` CLI，需更新为 `triauto` |
| TriMetaverse 架构文档 | 物理路径引用更新 |

---

## 五、决策请求

| 事项 | 裁决 |
|---|---|
| Tride→TriCode 代码迁移 | **不需要**。职责已拆分，代码已在正确仓库。仅需文档收口。 |
| TriDeployment→TriAuto 重命名 | **APPROVE**，可立即执行。预估 2-3h。 |
| TriAuto scope 扩展（自动化办公） | **DEFER** 给 CPO 产品定义。重命名不阻塞 scope 扩展。 |
| 执行窗口 | 7/18 前可完成 TriDeployment→TriAuto 重命名，7/25 CEO-004 due 前完成文档收口。 |

---

## 使用依据

- `TriMetaverse/docs/三元宇宙架构与模块说明.md` §4（line 69 TriCode, line 75 TriAuto）
- TriCode `package.json` + `src/` 代码事实
- Tride `package.json`（anomalyco/opencode）+ opencode-dev/ 代码事实
- TriDeployment `package.json` + `src/` 代码事实
- TriCode `docs/registry/product-state.md`（CPO 产品规格）
- `cto-routing-ceo004-rename-impact.md`（小贾摸排）
- CEO-004 OP JSON entry
