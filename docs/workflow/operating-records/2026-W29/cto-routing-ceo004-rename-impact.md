# CTO 路由：CEO-004 模块重命名技术影响评估

> 发起人：CEOChiefOfStaff（小贾）
> 受理人：ChiefTechnologyOfficer（小狄）
> 日期：2026-07-17
> 上游：CEO-004（due 7/25），CEO 指令推进

---

## 一、当前状态摸排（小贾已完成）

### Tride → TriCode

| 仓库 | 路径 | 状态 |
|---|---|---|
| **Tride**（旧名） | `D:\Code\ai\Tride` | 大仓，含 opencode-dev/、packages/、sdks/、Nix flakes、turborepo。AGENTS.md 描述为"本地子进程 runtime/CLI + agentic orchestration 底座" |
| **TriCode**（新名） | `D:\Code\ai\TriCode` | **已独立建仓**，npm 包 `@trimetaverse/tricode`，含 src/test/dist/docs。描述为"Code Tool Glue — unified code execution interface" |

**关键发现**：TriCode 不是空仓，是已经运行的独立模块。重命名不是简单的 `mv Tride TriCode`，而是需要决策：Tride 中的哪些代码属于"代码胶水层"应迁入 TriCode，哪些留在 Tride（或废弃）。

### TriDeployment → TriAuto

| 仓库 | 路径 | 状态 |
|---|---|---|
| **TriDeployment**（旧名） | `D:\Code\ai\TriDeployment` | 完整 TypeScript 项目，npm 包 `trideployment`，含 src/test/docs/tools/profiles。AGENTS.md 描述为"自动部署、镜像族、K8s 发布面、GitOps" |
| **TriAuto**（新名） | `D:\Code\ai\TriAuto` | **不存在**，需新建 |

---

## 二、待 CTO 评估事项

### 2.1 Tride → TriCode

1. **代码归属判断**：Tride 仓库中哪些包/文件属于"代码胶水层"（应迁入 TriCode）？哪些属于 opencode-dev 运行时（留在 Tride 或另作安排）？
2. **迁移策略**：
   - A) Tride 中 code glue 代码迁入 TriCode，Tride 保留 opencode-dev 运行时代码
   - B) Tride 全量迁入 TriCode，Tride 归档
   - C) 其他方案
3. **Tride 去留**：迁移完成后，Tride 仓库是归档、保留为历史快照、还是继续作为 opencode-dev 开发环境独立存在？
4. **引用更新范围**：哪些模块/文档引用了 `Tride` 路径或包名？预估影响面。

### 2.2 TriDeployment → TriAuto

1. **重命名范围**：GitHub 仓库重命名、npm 包名（`trideployment` → `@trimetaverse/triauto`？）、CLI 命令（`trideploy` → ？）、源码目录、所有内部引用
2. **迁移 check list**：需更新的文件清单 + 验证步骤
3. **TriAuto 功能边界**：CEO 定义 TriAuto = 自动部署 + 自动化办公。当前 TriDeployment 代码是否覆盖"自动化办公"？是否需要扩展 scope？

---

## 三、输出要求

请 CTO 输出：
- **技术影响评估**（1 页以内）
- **迁移 check list**（包含影响模块、预估工时、验证步骤）
- **建议迁移顺序**（先 TriDeployment→TriAuto 还是 Tride→TriCode？还是并行？）

## 四、时效

CEO-004 due 7/25。建议 CTO 在 7/18 前回传技术影响评估，留一周执行窗口。

---

## 附：上游引用

- OP-202607-W29-001.json NA-20260715-CEO-004
- `docs/三元宇宙架构与模块说明.md` 模块全景图 v3（TriCode + TriAuto）
- 2026-07-15 CEO 架构全会决议
