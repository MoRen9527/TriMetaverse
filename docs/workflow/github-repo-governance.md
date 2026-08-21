# GitHub 仓库治理规则（中央摘要）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/github-repo-governance.md
- syncMode: source-only
- lastSyncedAt: 2026-07-08

当前文件是 TriMetaverse 公司级 GitHub 仓库治理规则的中央摘要，汇总模块仓库清单、多仓 workspace 布局、分支策略、提交规范、PR 规则、仓库初始化、仓库健康巡检与多仓协同纪律。各子规范的详细原文以引用的上游真源为准；本页为中央收口层，不做替代。

## 1. 模块仓库清单与分层

### 1.1 仓库清单

| 仓库 | 层级 | 功能主旨 | 当前模式 |
| --- | --- | --- | --- |
| `TriMetaverse` | A. 成熟仓 | 中央战略仓与项目级真源约束 | `main + dev` |
| `TriCompany` | A. 成熟仓 | 赛博公司研发仓与经营编排孵化仓 | `main + dev` |
| `TriDev` | A. 成熟仓 | 开发型项目十阶段流程与执行模块 | `main + dev` |
| `TriPilot` | A. 成熟仓 | VS Code 扩展与 webview 用户入口 | `main + dev` |
| `TriStaciss` | A. 成熟仓 | 模型路由中转站与 API 调用平台 | `main + dev` |
| `TriAvatar` | A. 成熟仓 | Web 入口、数字宠物、赛博分身 | `main + dev` |
| `TriMC` | A. 成熟仓 | 统一 agent runtime 与 interaction core | `main + dev` |
| `TriLC` | A. 成熟仓 | 本地域控制器 | `main + dev` |
| `Tride` | B. 过渡仓 | PC 端 vibe coding 工具适配层 | `dev-first` |
| `vscodium` | B. 过渡仓 | IDE 宿主基础设施 | `dev-first` |
| `TriDeployment` | B. 过渡仓 | 部署能力历史兼容占位 | `dev-first` |
| `TriTest` | B. 过渡仓 | 测试能力历史兼容占位 | `dev-first` |
| `TriModel` | C. 占位仓 | Provider/Model 统一配置层 | `dev-only` |
| `TriMLC` | C. 占位仓 | 元虚拟本地控制器（Meta Local Controller，TMV-P1-4 立项 2026-08-22） | `dev-only` |
| `TriRMC` | C. 占位仓 | 元现实主控（Reality Main Controller，TMV-P1-5 立项 2026-08-22，种子=路径 B 迁入） | `dev-only` |
| `TriSkill` | C. 占位仓 | 统一 skill 提供模块 | `dev-only` |
| `TriGateway` | C. 占位仓 | 社交通道连接与消息队列管理 | `dev-only` |
| `TriMobile` | C. 占位仓 | 本地域移动端入口 | `dev-only` |
| `TriMem` | C. 占位仓 | 用户系统模块 | `dev-only` |
| `TriWeb4` | C. 占位仓 | Web3 / Web4 模块 | `dev-only` |
| `TriChain` | C. 占位仓 | 公链模块 | `dev-only` |
| `TriTraining` | C. 占位仓 | 培训学院功能主承载模块 | `dev-only` |
| `core-agent` | D. 历史迁移源 | 冻结，已规划迁入 TriMC | 不再新增；迁移清单见 `docs/core-agent-to-trimc-migration-checklist.md` |

### 1.2 分层说明

| 档位 | 定义 | 日常开发线 | 稳定基线 | 判断标准 |
| --- | --- | --- | --- | --- |
| A. 成熟仓 | 有真实代码和交付需求 | `dev` | `main` | 已具备可验证行为 + 需稳定版本引用 |
| B. 过渡仓 | 有代码但稳定消费面未形成 | `dev` | 暂不强制 | 继续 `dev + release/*` |
| C. 占位仓 | 待初始化，仅有骨架或空仓 | `dev` | 暂无 | 维持 `dev-only`，禁止提前维护双轨 |
| D. 历史迁移源 | 冻结，不再投入治理精力 | 不新增 | 不新增 | 后续以现役模块为目标 |

真源：`docs/branching-release-policy.md` §4、`docs/三元宇宙架构与模块说明.md` §4。

## 2. 多仓 Workspace 结构与维护

### 2.1 Root Workspace 模型

TriMetaverse 是公司级的 **root workspace**，通过 `trimetaverse.code-workspace` 统一管理所有模块仓库：

- **TriMetaverse 自身**：`./`（root workspace 所在仓）
- **其他 20 个模块**：各自作为独立 Git 仓库，以 `../` 同级目录路径挂载到 workspace 中

每个模块仓库是**独立 Git 仓库**，拥有独立的 remote、branch 策略和提交历史。workspace 仅提供 VS Code 多根编辑和 launch/task 配置，不改变各仓的 Git 独立性。

### 2.2 Workspace 文件夹注册

`trimetaverse.code-workspace` 的 `folders` 字段定义了 21 个挂载点：

| # | 模块 | workspace path | Git 仓库 | 物理目录 |
| --- | --- | --- | --- | --- |
| 0 | TriMetaverse | `./` | ✓ | `TriMetaverse/` |
| 1 | TriPilot | `../TriPilot` | ✓ | `TriPilot/` |
| 2 | TriStaciss | `../TriStaciss` | ✓ | `TriStaciss/` |
| 3 | TriAvatar | `../TriAvatar` | ✓ | `TriAvatar/` |
| 4 | Tride | `../Tride` | ✓ | `Tride/` |
| 5 | vscodium | `../vscodium` | ✓ | `vscodium/` |
| 6 | TriDeployment | `../TriDeployment` | ✓ | `TriDeployment/` |
| 7 | TriTest | `../TriTest` | ✓ | `TriTest/` |
| 8 | core-agent | `../core-agent` | ✗ | `core-agent/` |
| 9 | TriMC | `../TriMC` | ✓ | `TriMC/` |
| 10 | TriLC | `../TriLC` | ✓ | `TriLC/` |
| 11 | TriMobile | `../TriMobile` | ✓ | `TriMobile/` |
| 12 | TriMem | `../TriMem` | ✓ | `TriMem/` |
| 13 | TriWeb4 | `../TriWeb4` | ✓ | `TriWeb4/` |
| 14 | TriChain | `../TriChain` | ✓ | `TriChain/` |
| 15 | TriCompany | `../TriCompany` | ✓ | `TriCompany/` |
| 16 | TriDev | `../TriDev` | ✓ | `TriDev/` |
| 17 | TriGateway | `../TriGateway` | ✓ | `TriGateway/` |
| 18 | TriModel | `../TriModel` | ✓ | `TriHost/`（物理目录名待同步） |
| 19 | TriSkill | `../TriSkill` | ✓ | `TriSkill/` |
| 20 | TriTraining | `../TriTraining` | ✓ | `TriTraining/` |

#### 2.2.1 `trimetaverse.code-workspace` 原始 `folders`（权威路径源）

以下为 `trimetaverse.code-workspace` 中 `folders` 字段的原始内容，是模块路径的唯一权威定义。**查找任何模块的物理位置时，优先查本段 JSON，不依赖推断。**

```json
"folders": [
    { "path": "./" },
    { "path": "../TriPilot" },
    { "path": "../TriStaciss" },
    { "path": "../TriAvatar" },
    { "name": "Tride", "path": "../Tride" },
    { "path": "../vscodium" },
    { "path": "../TriDeployment" },
    { "path": "../TriTest" },
    { "path": "../core-agent" },
    { "path": "../TriMC" },
    { "path": "../TriLC" },
    { "path": "../TriMobile" },
    { "path": "../TriMem" },
    { "path": "../TriWeb4" },
    { "path": "../TriChain" },
    { "path": "../TriCompany" },
    { "path": "../TriDev" },
    { "path": "../TriGateway" },
    { "path": "../TriModel" },
    { "path": "../TriSkill" },
    { "path": "../TriTraining" }
]
```

> **解释：** 除第 1 项 `"./"` 为 TriMetaverse 自身外，其余 20 项的 `path` 均以 `"../"` 开头——表示这些模块是 **兄弟目录**，不是 TriMetaverse 的子目录。`TriMetaverse/<模块名>/` 是错误路径；正确路径始终是 `../<模块名>/`。

### 2.3 新增/移除模块仓库

**新增模块：**
1. 在 `../` 下创建独立 Git 仓库（或 clone）
2. 在 `docs/三元宇宙架构与模块说明.md` §4 注册模块行
3. 在 `trimetaverse.code-workspace` 的 `folders` 数组中追加 `{ "path": "../新模块名" }`
4. 在本文件 §1 的仓库清单中同步更新

**移除模块：**
1. 从 `trimetaverse.code-workspace` 移除对应 `folders` 条目
2. 物理目录不自动删除，由操作者酌情处理
3. 在架构文档和本文件中标记状态变更

### 2.4 物理目录与架构文档的同步规则

- `trimetaverse.code-workspace` 中的 `path` 值必须与物理目录名一致
- 当模块发生重命名（如 TriHost → TriModel），需同步更新：
  - 物理目录名（`git mv` 或手动重命名）
  - `trimetaverse.code-workspace` 中的 `path`
  - `docs/三元宇宙架构与模块说明.md` 模块表
  - `docs/registry/` 中所有引用该模块的 registry 文件
  - 所有 workflow/training/PRD 中的引用
- 当物理目录存在但架构文档未登记（如 `core-agent`、`TriTraining`），视为待登记状态

## 3. 分支策略

详细规则见 `docs/branching-release-policy.md`，以下为中央摘要。

### 2.1 分支职责

| 分支 | 职责 | 现行规则 |
| --- | --- | --- |
| `dev` | 日常开发 / 联调主线 | 默认开发线；普通 PR 默认目标 |
| `main` | 成熟仓稳定基线 | 仅 A 类启用；禁止直接提交；只接受 `release/*` 或 `hotfix/*` 合并 |
| `release/*` | 发布候选 / 冻结线 | 从已验证的 `dev` commit 切出；发布窗口内只收必要修复 |
| `hotfix/*` | 紧急修复线 | 从当前稳定基线切出；修复后必须回灌 |
| `feature/*` | 可选短分支 | 个人或单 PR 临时使用，目标仍是 `dev` |
| `master` | 历史兼容 | 不再承接新功能或稳定语义 |

### 2.2 合并闭环

- **A 类成熟仓**：`dev → release/* → main → dev`
- **B / C 类仓**：`dev → release/* → dev`
- **A 类 hotfix**：`hotfix/* → main + dev`（有活跃 `release/*` 时额外补回）
- **B / C 类 hotfix**：`hotfix/* → 当前稳定基线 + dev`

### 2.3 禁止项

- 禁止直接从 `dev` 做正式生产发布
- 禁止把所有仓一刀切改成 `main` 默认
- 禁止发布窗口内向 `release/*` 合入无关新功能
- 禁止只修稳定线不回灌 `dev`
- 禁止继续把 `master` 写成现役稳定真源

## 4. 提交规范

### 3.1 提交信息格式

采用 Conventional Commits 格式：

```
<type>(<scope>): <subject>
```

| type | 含义 |
| --- | --- |
| `docs` | 文档变更 |
| `feat` | 新功能 |
| `fix` | 缺陷修复 |
| `refactor` | 重构（不改变外部行为） |
| `test` | 测试相关 |
| `chore` | 构建、CI、依赖等工程变更 |
| `style` | 格式、空白等不影响逻辑的变更 |

`scope` 建议使用模块名或功能域，如 `governance`、`workflow`、`TriMC`、`TriDev`。

### 3.2 提交粒度

- 一个提交做一件事；避免把无关变更混入同一提交。
- 提交信息用英文或中文均可，但同一仓库内应保持一致。
- Squash merge 时，合并提交信息应概括该 PR 的整体意图。

### 3.3 签名与作者

- 所有提交必须包含可追溯的作者信息。
- 多人协作的 PR，Squash merge 时应在正文或 trailer 中标注共同作者：
  ```
  Co-authored-by: <name> <email>
  ```

## 5. PR 规则

### 4.1 PR 生命周期

1. 从功能分支（`feature/*` 或直接 `dev` 分支）发起 PR，目标分支默认 `dev`。
2. PR 标题遵循 Conventional Commits 格式。
3. PR 描述应包含：做了什么、为什么做、影响范围、验证方式。
4. 至少一人 Review 并通过后方可合并。
5. 合并策略：优先使用 Squash merge；成熟仓 `release/* → main` 可用 Merge commit 保留发布历史。

### 4.2 PR 质量门槛

- CI 通过（如有配置）。
- 关联 Issue 或 PRD 分支已在描述中引用。
- 涉及模块边界、新模块或跨仓影响时，必须在描述中注明已完成的协调结论。
- 文档和代码变更应在同一 PR 或明确关联的 PR 链中完成，避免文档滞后。

### 4.3 跨仓 PR 协调

- 当变更涉及多个仓库（如 `TriCompany` + `TriMetaverse`），应先完成源侧变更，再同步发布侧。
- 跨仓 PR 必须在描述中列出所有关联 PR 链接和合并顺序。
- 不得在未沟通的情况下跨仓修改其他模块的真源文件。

## 6. 仓库初始化规则

### 5.1 新模块仓库

新增正式模块时，按以下顺序初始化：

1. `DISCOVERY` 阶段形成 `NewModuleBaselineRelease`（含 `vendor-extraction-profile`）。
2. 经签核后由 `TriDev init` 执行模块骨架初始化。
3. 补齐以下最低资产：
   - 根级 `README.md`、`AGENTS.md`、`.gitignore`
   - `docs/` 六件套入口（`product/`、`engineering/`、`execution/`、`registry/`、`workflow/`、`training/`）
   - `.github/agents/` 下的模块 registry agent 入口
   - 本地 `CodeGraph` 初始化
4. 未达到 `approved` 前不得写成既成模块。

真源：`docs/三元宇宙架构与模块说明.md` §2、`docs/workflow/project-repo-document-baseline.md` §3.2。

### 5.2 开源吸收链

任何开源代码吸收必须遵循：
```
TriMetaverse/reference → 模块/vendor → 模块真实实现
```

- 上游源码先放入 `TriMetaverse/reference/` 作为只读基线。
- 确认长期融合后，在目标模块内建立 `vendor/` 作为冻结基线。
- 不得跳过 reference 直接散改上游代码。
- 如开源吸收动作会引入新的长期主模块或改变既有模块边界，必须先咨询 `BusinessStrategy`。

## 7. 多仓协同纪律

### 6.1 真源唯一性

- 每个模块的事实真源只有一个物理仓。
- `TriCompany-copilot-host-assets` 和 `TriDev-copilot-host-assets` 是当前宿主支撑包，不是第二真源。
- 支撑包内发生的变更，必须回写到对应模块源仓。

### 6.2 四层资产定位

| 位置 | 角色 | 说明 |
| --- | --- | --- |
| 模块源仓（如 `TriCompany/`） | 真源 | 产品、技术、registry、workflow 的唯一书面真源 |
| 支撑包（如 `TriCompany-copilot-host-assets/`） | 宿主发布包 | published-copy、runbook、phase evidence、support object |
| live 入口（`TriMetaverse/.github/`） | 当前宿主入口 | agent 入口、共享 prompt、会议命令 |
| 中央摘要（`TriMetaverse/docs/`） | 项目级协议层 | 架构说明、模块边界、workflow 协议、registry 索引 |

真源：`docs/workflow/tricompany-copilot-host-assets-governance.md` §2。

### 6.3 仓库从 C 类升级到 A 类的条件

满足以下任意 2~3 条即可从 `dev-only` 升级为 `main + dev`：

- 已有真实代码和可验证行为，不再只是 docs / 骨架占位
- 需要对外给出"当前稳定版本"或被其他仓当作稳定依赖
- 已出现发布、部署、验收、回滚或正式 tag 需求
- CI / QA / release readiness 已开始作为真实门禁使用
- 已需要区分"当前开发线"和"当前稳定真源"

## 8. Owner 分工

| 职责 | Owner |
| --- | --- |
| 模块产品事实与 PRD 归属 | CPO（小乔） |
| 模块代码事实与技术门禁 | CTO（小狄） |
| 公司治理、秘书处与行政制度 | CAO |
| 人力资源、岗位启用与交接 | CHO |
| 公司级任务分派、协调、催办与升级 | CEOChiefOfStaff（小贾） |
| 中央战略与模块边界裁决 | BusinessStrategy |

真源：`docs/registry/company-governance-state.md` §Current Ownership。

## 9. 仓库健康巡检

### 9.1 巡检目标

定期检查公司级仓库的 Git 基础配置一致性，确保 upstream tracking、origin/HEAD 指向、分支状态健康。

### 9.2 覆盖范围

- 当前巡检脚本覆盖 **6 个核心仓库**：`TriMetaverse`、`TriPilot`、`TriStaciss`、`TriAvatar`、`Tride`、`vscodium`

### 9.3 使用方式

```powershell
# 巡检（只读）
.\scripts\git-six-repo-health-check.ps1

# 自动修复预演（不修改）
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\git-six-repo-auto-fix.ps1

# 自动修复执行
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\git-six-repo-auto-fix.ps1 -Apply
```

判定规则：
- `Issue=NO`：配置健康
- `Issue=YES`：存在 upstream 未设置、origin/HEAD 未设置、或 ahead/behind 状态

### 9.4 自动修复安全范围

- `UPSTREAM_UNSET` → 设置为 `origin/<当前分支>`
- `ORIGIN_HEAD_UNSET` → 优先当前分支，回退 `dev/main/master`
- **不执行** `reset --hard`、`push --force` 等危险操作

### 9.5 建议工作流

1. 每周例行或发版前运行巡检
2. 异常时先跑 `DRY_RUN`（默认）确认计划动作
3. 确认后用 `-Apply` 执行修复
4. 修复后再次巡检，确保 `Issue=NO`

真源：`docs/README-git-health.md`、`scripts/git-six-repo-health-check.ps1`、`scripts/git-six-repo-auto-fix.ps1`。

## 10. 当前已知差异

以下差异由最近一次（2026-07-23）全仓巡检识别，待后续处理：

| # | 差异项 | 状态 | 说明 |
| --- | --- | --- | --- |
| 1 | TriLC/TriPilot/TriModel 分支统一为 dev | ⚠️ 待修复 | 三仓当前默认分支为 `main`（C 类升级遗留），需改为 `dev` 作为日常开发默认分支，`main` 仅保留稳定基线语义。已在 W30 向 `main` 推送了累积修复，下一步将 `main` 合并回 `dev` 后切换默认分支 |
| 2 | TriModel GitHub remote 已同步 | ✓ 已修复 | GitHub 端已 rename `TriHost` → `TriModel`，本地 remote 已更新为 `MoRen9527/TriModel.git` |
| 3 | `trimetaverse.code-workspace` 已修正 | ✓ 已修复 | `"path": "../TriModel"` |
| 4 | `TriModel` 物理目录已就位 | ✓ 已修复 | `TriHost/` → `TriModel/` 重命名完成 |
| 5 | `core-agent` 废弃处理 | ✓ 已修复 | 代码已迁入 `TriMC/src/observability/`（10 文件） |
| 6 | `TriTraining` 正式登记 | ✓ 已修复 | 已添加到架构 §4、governance §1.1 |

### 10.1 分支统一规则（2026-07-23 新增）

所有仓库的日常开发提交统一走 `dev` 分支：

- **所有成熟仓（A/B/C 类）**：`dev` 是唯一日常开发线。`main` 仅作为 A 类仓的稳定基线存在，只接受 `release/*` 或 `hotfix/*` 合并。
- **C 类仓升级**：当 C 类仓满足 §6.3 升级条件（有真实代码、有发布需求），必须将默认分支从 `dev-only` 改为 `dev`，并建立 `main` 稳定基线。
- **禁止直接向 `main` 提交**：所有仓库的 `main` 分支禁止直接 `git push`，必须通过 `dev → PR → main` 或 `release/* → main` 路径合入。
- **当前遗留**：TriLC、TriPilot、TriModel 三仓因从 C 类快速升级到 A 类，W30 累积修复直接推送到了 `main`。需要在下一维护窗口执行 `main → dev` 同步，并设置 GitHub 默认分支为 `dev`。

## 11. 相关文档索引

| 主题 | 上游真源 |
| --- | --- |
| 分支与发布详细规则 | `docs/branching-release-policy.md` |
| 宿主资产治理（source/support/live/doc 四层） | `docs/workflow/tricompany-copilot-host-assets-governance.md` |
| 模块六层文档协同系统 | `docs/workflow/project-repo-document-baseline.md` |
| 模块仓库清单与职责 | `docs/三元宇宙架构与模块说明.md` §4 |
| 公司治理状态 | `docs/registry/company-governance-state.md` |
| PR 描述模板 | `docs/workflow/pr-description-waterfall-alignment.md` |
| 开源吸收链规则 | `docs/三元宇宙架构与模块说明.md` §2 |
| 仓库健康巡检 | `docs/README-git-health.md` |
| 文档治理与真源文件系统 | `docs/文档治理与真源文件系统.md` |
| Workspace 配置文件 | `trimetaverse.code-workspace`（根目录） |
