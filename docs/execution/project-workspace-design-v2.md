# TriCade 项目级工作区设计 v2

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/project-workspace-design-v2.md
- syncMode: source-only
- lastSyncedAt: 2026-08-14

> 版本：v2026.W34.3
> 日期：2026-08-14
> 状态：联合设计最终稿（产品面小乔 × 技术面小狄；CTO 复核确认 v2026.W34.3）。本设计不动代码、不建 worktree、不改安装脚本，实施树另建
> 修正记录：v2026.W34.2（CEO 设计修正）——彻底切断 TRILC_WEEKLY_PLANE_ROOT 兼容牵扯：不兼容回退、不旧值推导、不留旧值后门；旧 env 从安装脚本移除注入，升级 install 清旧写新一次性切换（§五.②）；v2026.W34.3（CTO 小狄复核尾改）——CEO 术语修正并入：三入口同步跟随 = 项目平面（项目级焦点），周平面为项目内子维度；对接点微调：关联向导治理提示分阶段呈现、落点校验与失败分类补入技术链路、交叉引用与编号修正（MVP 节 2.10 重复编号拆为 2.11）；小贾收口补记：项目平面口径补齐至职责分工、§五.③ 同步机制、V4 指标与 §八 OP 引用
> owner：小乔（CPO，产品面）× 小狄（CTO，技术面）
> 前置设计：`docs/execution/worktree-architecture-design.md`（v1，定案 WORKTREE-ARCH-DESIGN-20260814-001，保持冻结，作为本设计的事实基线）
> 关联：`docs/workflow/operating-records/2026-W34/OP-202608-W34-001.json`（v1 派单 + r4 收官 + R4-RELEASE-MERGE 登记）；`docs/execution/server-fleet-m0.md`（服务器舰队）；`docs/execution/v0.9.x-dual-track-tricompany-plan.md`（dual-track）；`TriLC/src/project/weekly-plane-root.ts`（周平面解析现状）；`TriLC/src/server/app.ts:1983`（会话 cwd 契约）；`TriPilot/src/extension.ts:6166`（workspaceRoot 传递现状）

## 〇、与 v1 的关系（升级声明）

v1（一仓三面：研发主 checkout / ProgramData 固定生产面 worktree / 服务器舰队）解决的是"公司自用生产面"问题——安装器单一路径、迁移验收零影响。CEO 新决策方向（ARCH-20260814-002）把问题升级为"项目级工作区"——**用户任意路径、TriCade 主动建立与认领、多项目演进、全项目改动走 PR 治理**。

升级条款：

| v1 定案 | v2 演进 |
| --- | --- |
| 生产面 = 安装器固定路径 `C:\ProgramData\TriCade\workspace\TriMetaverse` | 生产面 = 用户任意路径的项目 worktree，由 TriCade 建立/认领 |
| TRILC_WEEKLY_PLANE_ROOT 指向 worktree 内周平面路径（安装脚本候选补档） | TRILC_PROJECT_WORKTREE_ROOT 指向项目 worktree 根，周平面路径由 project root 派生；WEEKLY_PLANE_ROOT **彻底切断**（不兼容回退、不旧值推导、不留后门；升级 install 清旧写新） |
| 例外写走 PR（仅生产面） | 全项目改动走 PR（目标态），研发面直写按阶段收紧 |
| 树 A（ProgramData worktree 建立）待排期 | **树 A 停止排期，被 v2 实施树取代**（ProgramData 固定路径方案不实施） |
| 树 B（TriMC 本地 worktree 同构，可选） | 保留可选，与 v2 无冲突 |
| 迁移验收前行为逐字节不变 | 表述更新（CEO 修正）：验收时部署为旧版本故行为不变；切换断点 = 升级 install（清旧写新一次性完成），无新旧并存期 |

v1 保留为事实基线（分支纪律、junction 事故纪律、fleet 对称性教训全部继承），不再单独实施。

## 一、CEO 设计输入（v2 范围）

1. TriCade（IDE 层）自己打开工作区：用户开文件夹 → 关联项目仓（现 TriMetaverse，将来多项目）→ 自动 `git worktree add` → 与研发仓 + 服务器 TriMC 联动。
2. worktree 项目级资产：TriCade + trilc chat 双入口读同一 project worktree root。
3. 环境变量升级：TRILC_WEEKLY_PLANE_ROOT → TRILC_PROJECT_WORKTREE_ROOT（项目级，周平面自然包含）。**CEO 修正（v2026.W34.2）：彻底切断旧 env 兼容——不兼容回退、不旧值推导、不留旧值后门；升级 install 清旧写新一次性切换（见 §五.②）。**
4. 项目维度治理：全项目改动走 PR（建分支→改→PR→TriMC 审核→merge dev→三端同步）；TriMC 审核记入项目级仓库管理规则。
5. worktree 用户任意路径。

设计职责分工：产品面（§二，小乔）——用户旅程、首次体验、onboarding 关系、多项目切换、MVP 与验证指标；技术面（§三~§七，小狄）——现状基线、总体模型、自动化链路、环境注入点与兼容迁移、项目平面同步（双入口 + 周平面跟随）、PR/审核/merge 技术流程、r4 对齐、多项目演进。只设计不动代码。

## 二、产品面：用户旅程与交互设计（小乔）

### 2.1 产品定位与语义对齐（回应技术面 §四 尾部对齐请求）

v1 生产面 = 安装态必读面（daemon 周平面数据源）；v2 项目 worktree = 用户工作区（交互、改动、PR 发起地）。产品口径：**用户先有工作区，公司机制（周平面只读视图）自动附着在工作区之上**——v1 的"生产面"降级为 v2 的一个使用场景（无用户交互的 daemon 仍经 env/注册点读 project root，技术面 §五.2/3）。叙事顺序对应 CEO 决策 2 的"项目级资产"语义。

本面交互三原则：
- **零命令**：全程 GUI 引导，用户不需要 git CLI 知识。
- **零强制**：任一环节失败或用户拒绝，回退为普通文件夹打开，不阻塞（对齐技术面 §五.1 失败回退）。
- **状态可见**：工作区/同步/PR 状态随时可见，不藏进度。

### 2.2 工作区状态机（每项目维度）

| 状态 | 含义 | 用户可见呈现 |
| --- | --- | --- |
| UNLINKED | 文件夹未关联任何项目仓（普通文件夹/非 git/其他 git 仓） | 「未关联项目」徽标 + 关联入口 |
| CREATING | worktree 创建中（克隆/检出/同步/登记） | 进度条 + 可取消 |
| LINKED-SYNCED | 已关联 + project/<key> 与 dev 同步 | 绿色「已同步」徽标 |
| LINKED-BEHIND | 已关联 + 落后 dev（可 ff 同步） | 黄色「落后 N 个提交」+ 一键同步 |
| LINKED-DIRTY | 已关联 + 有未提交改动或未合入 PR | 蓝色「改动中」+ PR 状态 |
| ERROR | 创建/同步失败 | 红色错误卡 + 重试/诊断入口 |

状态机与 onboarding 公司开张状态机（UNINITIALIZED→ONBOARDING→INITIALIZED）**互不触碰**（§2.9）。

### 2.3 首次启动（新用户）

1. 启动 TriCade，无历史工作区记录 → 欢迎空状态页。
2. 两个主动作：**打开文件夹**（已有项目文件）/ **新建项目工作区**（从关联项目仓开始）。
3. 新建路径直达 §2.4 关联向导；打开文件夹进入 §2.5 识别分流。

### 2.4 关联向导（核心流程；技术面 §五.1 链路五步的用户视角）

| 步骤 | 用户看到 | 对应技术面 |
| --- | --- | --- |
| Step 0 项目清单 | 可关联项目列表（现仅 TriMetaverse），每项显示项目名 + 一句话定位 + 治理提示（改动走 PR、TriMC 审核；按阶段呈现——P4 上线前显示「PR 治理待上线」，与 §2.6 禁用态一致） | §五.6 项目仓注册表 + §五.4 治理规则（提示文本来源） |
| Step 1 选择落点 | 默认建议 `<用户路径>/TriMetaverse-<suffix>`（可改任意路径）；校验：不落在研发仓检出内、不与其他 worktree 重叠、空目录或不存在可创建 | §五.1 第 4 步 |
| Step 2 确认信息卡 | 项目名、来源仓、落点路径、分支与治理说明（dev 基线 / feature 分支 / PR / TriMC 审核） | — |
| Step 3 创建反馈 | 进度：克隆/检出 → 同步 → 登记；失败分类提示（网络/磁盘/权限/分支冲突）+ 重试；可取消 | §五.1 第 4 步 + 失败回退 |
| Step 4 加载 | IDE 自动切换到新 worktree 路径 | — |

npm 门禁触达（hasNpmFileDeps 仓）：阻塞提示 + 原因说明（junction 事故纪律）+「手动评估」指引，不做任何自动动作（对齐技术面 §五.1 前置门禁）。

### 2.5 打开文件夹的识别分流

| 文件夹形态 | 判定 | 用户呈现 |
| --- | --- | --- |
| 已是项目 worktree（.git 文件） | 认领登记（绝不重复 add）→ LINKED-* | 项目面板激活，直接工作 |
| 项目仓普通克隆（.git 目录） | 非受管 | 提示「检测到项目仓克隆，但不是受管工作区」；推荐升级（引导至 §2.4），允许普通打开（无项目治理、trilc chat 不联动） |
| 其他 git 仓 / 非 git | 未关联项目 | 普通工作区打开 + 轻提示关联入口 |

产品判断：普通克隆不自动升级、不强制——升级是推荐动作而非阻塞动作；面板持续显示「非受管」徽标，防治理旁路被静默接受。是否升级为强制拦截待 CEO 口径（§2.9）。

### 2.6 日常项目工作（PR 治理流用户视角；技术面 §五.4）

1. **改动**：用户在项目 worktree 中正常编辑。
2. **改动清单**：项目面板列出未提交改动。
3. **建分支**：面板内建 `feature/<key>-<slug>`（起点 = 最新 project/<key>；命名规约由项目级仓库管理规则承载）。
4. **提交 + 发起 PR**：面板内提交并推送 → 开 PR（target = dev）。
5. **TriMC 审核**：面板显示审核状态流转（已提交 → 审核中 → 通过 / 驳回+意见）；驳回意见回显面板，修改后重走流程。
6. **merge dev**：审核通过后合并（执行主体主案/降级案见技术面 §五.4，用户侧只看到结果状态）。
7. **三端同步**：面板显示同步状态（worktree ff 回同步、feature 分支删除；研发面/舰队面状态可见）。

项目面板最小状态集：当前分支、落后/领先 dev 计数、未提交改动数、PR 状态（审核人/意见）、上次同步时间。

### 2.7 多项目关注模型与切换（产品面）

**两层模型（CEO 扩展范围，2026-08-14）**：

- **关注层（watch set）**：本机关注的项目集合，持久状态 = 注册点 projects 全量。每个项目 = 一个 git 仓 + 一个 worktree 集（同项目可有多个 worktree：主线 project/<key> 常驻 + 实验 feature worktree）+ 治理规则指针。打开文件夹认领即自动加入关注集；移除关注**不删 worktree**（物理资产保留，重新打开可重新认领）。
- **焦点层（focus）**：当前焦点项目 = 注册点 activeProjectKey（数据结构零改，语义从"唯一活跃"升级为"当前焦点"）。焦点自动 = 最近打开/认领；可手动指定。焦点决定：CLI 无请求级 cwd 时跟随、`TRILC_PROJECT_WORKTREE_ROOT` env 单值指向、欢迎页高亮、项目平面视图（周平面默认视图作为项目内子维度跟随切换）。

**焦点切换旅程（完整流程）**：

1. **触发**：项目切换器（侧栏 / 命令面板 / 欢迎页）选目标项目，或打开某项目 worktree 窗口自动切焦点。
2. **TriCade**：IDE 加载焦点项目 worktree；项目面板 / 状态栏切到该项目状态视图。
3. **trilc chat**：新会话跟随焦点（daemon 热更新，免重启）；**既有会话不回溯**（会话级 cwd 快照契约，技术面 §三 基线）——产品呈现：既有会话顶部提示「本会话仍指向项目 X；切换后请开新会话」。
4. **项目平面视图**：焦点项目的项目平面整体切换（项目面板 / 状态栏 / 项目视图）；周平面是项目内子维度——默认视图自动切到焦点项目的项目轨（§2.8），跟随项目切换；公司轨（TriMetaverse）恒可达。
5. **反馈**：切换完成提示（状态栏焦点徽标 + 项目名）；失败回退不阻塞。

**多项目关注时的视图/状态呈现**：

- 项目列表视图（欢迎页 / 侧栏）：每项目一行——名称、worktree 数、同步状态徽标、PR 状态、焦点标记（当前焦点高亮）。
- 焦点项目状态视图：展开分支 / 改动 / PR / 周平面 / 任务树。
- 非焦点项目：仅列表级状态徽标，不展开；点击切换焦点。
- 项目维度隔离：分支 / PR / 同步状态视图按项目独立，不跨项目混显。

### 2.8 多项目与周平面的关系（产品判断，含升级项）

判断：**每项目一套独立周平面（项目轨），公司轨保持唯一（TriMetaverse）**。理由：

1. 项目维度治理要求项目自含经营记录——任务树、PR 审核 ledger、项目周报是项目资产（CEO 决策 4 的自然延伸）。
2. 写权隔离：项目轨由该项目的编排/审核链写，单主体原则按项目划分，不跨项目混写。
3. 现成落点：项目轨 operating-records（`{projectRoot}/docs/execution/operating-records`）已在 `multi-project-router.ts` 实现自动创建。
4. 公司轨（`TriMetaverse/docs/workflow/operating-records`）保持公司级唯一：公司经营（周平移、公司会议、跨项目协调）不按项目拆。

分层规则：公司轨 = 公司级经营；项目轨 = 项目级经营。TriMetaverse 当前双轨合一（既是项目又是公司经营载体）——多项目出现时是否拆出独立公司仓属中央战略裁决，本设计只预埋分层，不裁决拆仓（升级项，§2.10）。

术语口径（CEO 修正，2026-08-14）：**三入口同步跟随的对象 = 项目平面（项目级焦点）**——TriCade 工作区 / trilc chat 新会话 / 项目视图三入口跟随的是项目平面整体；**周平面是项目内子维度**（项目轨 operating-records 视图），跟随项目切换但不等于项目平面。

焦点跟随：项目平面跟随焦点；周平面视图 = 焦点项目的项目轨为主 + 公司轨恒可达。技术对接：焦点 = TriMetaverse 时项目轨与公司轨重合；其余项目为焦点时公司轨读取来源待技术面定（与 §五.② 解析链对齐）。

### 2.9 与现有 onboarding 的关系（产品判断，APPROVE）

事实：ONBOARDING-FROZEN-20260813（CEO 指令冻结）——chat 选人/公司开张状态（6.4 会话初始化器 chat 交互面）冻结，不再修不再验证；理由 = CEO 收窄验证目标（先测周平面迁移）；启动条件 = 迁移验收闭环后另行启动。现有 onboarding（playbook 1.2）= 公司级初始化（开张 → 选人 → 装配骨架）。

判断：**本功能独立设计，不并入 frozen onboarding**。理由：
1. 层级不同：公司开张是公司级初始化；项目工作区是项目级 IDE 体验。工作区功能对开张状态无前置依赖——项目清单是产品预置的，未开张也能建立项目工作区（「打开文件夹」的自然延伸）。
2. frozen 纪律：onboarding chat 交互面冻结 = 不再修不再验证；挂接会迫使冻结面变更，违反 CEO 冻结指令。独立设计零触碰。
3. 衔接点预埋（解冻后）：开张的「装配骨架」步骤需要运营项目落点，可直接引用已建项目工作区；工作区功能无需回改。衔接规则：onboarding 不重复建立工作区，只引用（检测已存在 → 采用；不存在 → 引导走 §2.4 向导）。
4. 升级项：若 CEO 期望工作区向导并入开张 onboarding 主流程（统一首次体验），需解冻裁决——列入 §2.10，本设计不预设。

### 2.10 产品面风险与升级

| 风险 | 处置 | 升级条件 |
| --- | --- | --- |
| CEO 要求工作区向导并入 onboarding | 本设计独立（§2.9）；触发则升级解冻裁决 | ESCALATE |
| TriMC 审核的产品形态（审核 UI/通知/驳回流） | 跨模块：本设计只定用户侧状态接口（§2.6 步骤 5）；TriMC 侧形态路由 TriMC ProductRegistry | TriMC 侧无承接者时升级 |
| 普通克隆治理旁路 | §2.5 推荐升级 + 非受管徽标；强制拦截与否待 CEO 口径 | 旁路实际发生时升级 |
| 多用户同机器各建 worktree | 写主控不变（dev 唯一写面）；多 worktree 只读 + PR 例外写不冲突；例外写多主体并发 PR 需治理规则明确 | 多用户实际出现时升级 |
| 用户 worktree 路径迁移（移动文件夹） | 注册点惰性清理 + 认领重登记（技术面 §六 幽灵路径缓解）；产品面：移动后重打开自动重新认领 | — |
| 多项目出现时是否拆出独立公司仓 | 本设计只预埋分层（§2.8）不裁决；属中央战略裁决 | 多项目实际出现时升级中央（ESCALATE） |

### 2.11 MVP 定义与验证指标（产品面剪裁）

MVP 边界（对齐技术面 §七 树 P1-P4）：P1（识别与认领）+ P2（建立与注入）+ P3（消费端升级）为 v2 首版产品面范围；P4（PR / TriMC 审核 / 三端同步）为项目治理目标态，其用户侧流程（§2.6）在 P4 实施后验收。

| 编号 | 指标 | 目标 |
| --- | --- | --- |
| V1 | 新用户首次关联成功率（含失败重试后） | ≥ 95% |
| V2 | 首次关联完成时长（含克隆） | 中位数 ≤ 5 分钟 |
| V3 | 三端同步一致性：dev merge 后项目 worktree ff 同步可见 | 实测通过（一次真实改动；P4 验收——merge 动作属 P4） |
| V4 | 项目平面一致性：TriCade 与 trilc chat 读同一 project worktree root，周平面视图随焦点项目自然切换（项目内子维度） | 实测通过（同文件可见） |
| V5 | PR 治理闭环：建分支→改→PR→TriMC 审核→merge dev→三端同步 | 至少一次真实改动全程走通（P4 验收） |
| V6 | 零命令体验：新用户全程 GUI 完成关联，无 git CLI 操作 | 定性验收 |

## 三、现状事实基线（2026-08-14 核查）

| 事实 | 现状 | 来源 |
| --- | --- | --- |
| v1 定案 | 一仓三面模型定案（WORKTREE-ARCH-DESIGN-20260814-001），树 A/B 未建树实施 | `docs/execution/worktree-architecture-design.md` + OP 1.46.0 |
| 会话 cwd 契约 | TriLC `/v1/tasks/stream` 请求 `body.context.workspaceRoot ?? env.cwd` → session cwd → agent loop `ctx.cwd`（r4 已修下游五读工具跟随 ctx.cwd） | `TriLC/src/server/app.ts:1983` + `app.ts:1999` |
| IDE 侧 workspaceRoot 传递 | TriPilot 已把 `workspaceFolders[0]` 作为 workspaceRoot 传入请求（现役字段，零新字段需求） | `TriPilot/src/extension.ts:6166-6172` |
| r4 状态 | 五读工具 ctx.cwd 修复 + 周平面提示注入收官 APPROVE（TriLC a6df674 + TriMC 7e15ecf），本地 dev 未 push，合并挂迁移验收后（R4-RELEASE-MERGE-20260817-001，预估 v0.4.10-r20） | OP 1.46.0 + `trees/prod-grade-4-lscwd-fix/tree-op.json` |
| 周平面解析 | `weekly-plane-root.ts`：env 显式（existsSync 校验）> 源码态 sibling 发现 > undefined；公司轨只读绝不写入 | `TriLC/src/project/weekly-plane-root.ts` |
| 安装态 env 注入 | 已实现（8574d51a）：install-tricade.ps1 三态解析 + 用户级 setx + NSSM AppEnvironmentExtra；install.bat [3/4] 段同构 | `scripts/install-tricade.ps1:428-472` + `scripts/build-desktop.ps1:188-198` |
| 远端拓扑 | origin（github，PR 面）+ sg-server（裸仓，同步中转）；服务器舰队克隆 ×5 ff-only | v1 §二 |
| 分支现状 | dev 单线真源（origin/HEAD -> dev）；v1 的 prod/windows-local 未创建 | `git remote -v` + v1 |
| TriMC 形态 | 服务器 Meta Controller（HTTP agent 服务，具 shell_exec/glob 等工具与 executeTool 链） | r4 树 + OP |
| 事故纪律 | INCIDENT-20260814-001：禁 worktree + npm install 组合；`worktree remove --force` 全仓禁用 | v1 §五 + OP risks |

关键既有契约（v2 延续）：周平面写权单主体（编排层），TriLC 只读；写方向单主体与 git 身份单一纪律；ff-only 只读面纪律。

## 四、总体模型：一仓 + N 项目 worktree 面

```
TriMetaverse 仓（dev = 唯一真源线；origin = PR 面；sg-server = 裸仓中转）
│
├─ 研发面（项目主 checkout）：D:/Code/ai/TriMetaverse    @ dev（阶段一保留直写；目标态同走 PR）
│
├─ 项目 worktree 面（用户任意路径，1..N 个，按项目命名）：
│       <user-path>/TriMetaverse-<suffix>     @ project/<key> 常驻分支（ff-only 同步 dev）
│       改动走 feature/<key>-<slug> 分支 → PR → TriMC 审核 → merge dev
│
├─ 服务器舰队面（只读）：/srv/fleet/TriMetaverse          克隆 @ dev，ff pull 裸仓
│
└─ 中转：sg-server /srv/git/TriMetaverse.git（裸仓）
```

与 v1 的差异：v1 的"本地生产面"从单一路径（ProgramData）升级为"项目 worktree 面"（用户任意路径、可多个、由 TriCade 建立/认领）。面不变的原则延续：**线不变、面改变**、写方向单主体（目标态收紧为 PR 流）、只读面 ff-only。

项目 worktree 与 v1 生产面的语义差别（产品面对齐见 §二.1）：v1 生产面是"安装态必读面"（daemon 周平面数据源）；v2 项目 worktree 是"用户工作区"（交互、改动、PR 发起地）。前者是后者的一个使用场景（无用户交互的 daemon 仍通过 env 读 project root）。

## 五、核心设计

### ① TriCade 打开工作区自动化链路

**触发**：VS Code `onDidChangeWorkspaceFolders` / 启动时 `workspaceFolders[0]` 变化（TriPilot 扩展层）。单文件夹场景为主案；多根工作区取首个含项目仓标记的文件夹。

**链路五步**（每步可独立失败回退为"普通文件夹"行为，零强制）：

1. **检测**：文件夹是否为 git 仓（`.git` 目录 = 主 checkout 或普通克隆；`.git` 文件 = 已是某仓 worktree，内容指向主仓 `.git/worktrees/<name>`）。
2. **关联判定**：读 `git remote origin` URL，与**项目仓注册表**（新增注册点，见 §六）比对。命中 = 项目仓；未命中 = 询问用户是否关联（产品交互归小乔面，技术面只定义判定接口）。
3. **worktree 认领**（已是 worktree）：读 `.git` 文件确认 gitdir 属项目仓 → 经 daemon 认领端点登记（路径 + gitdir + 分支）→ 完成，**绝不重复 add**。
4. **worktree 建立**（非 worktree 且用户确认关联）：
   - **执行主体**：trilc daemon 内部端点（如 `POST /internal/v1/projects/link`，localhost-only 同现有 internal 面）。TriPilot 只发指令 + 收 SSE 进度/错误，不本地执行 git（W30 架构契约：TriPilot 零本地执行；git 操作身份单一纪律——OBS-20260814-002 教训映射）。vscode.git API 直调否决（多执行方多身份 + 进度/错误路径分裂）。
   - 前置门禁：项目仓 `hasNpmFileDeps` 标记为 true 的仓**拒绝自动建立**（INCIDENT-20260814-001 纪律），提示用户手动评估；
   - 主 checkout 定位：注册表中项目仓主 checkout 路径（现 `D:/Code/ai/TriMetaverse`）；
   - 目标分支：`project/<key>`（不存在则 `-b` 从 `sg-server/dev` 最新 ff 起点创建；已存在则 `--detach` 后 checkout 或 `-b` 新 feature 分支，见 §④）；
   - 落点校验：空目录或不存在（可创建）、不落在主 checkout 检出内、不与其他 worktree 路径重叠——git 原生拒绝为主，端点预检给出可读错误（对应关联向导 Step 1，§2.4）；
   - 执行：`git -C <main-checkout> worktree add <user-path> -b project/<key>`（同分支多 worktree 被 git 原生拒绝——去重由 git 保证，认领由注册点保证）；端点内**原子完成** add + 注册点登记 + daemon 内存态 project root 热更新（§③）；
   - 用户级 env：`setx TRILC_PROJECT_WORKTREE_ROOT` 由 TriPilot 在**用户上下文**执行（Windows 事实：LocalSystem 服务形态 daemon 写不了用户级 env；setx 属配置面不属工具执行面，不违反零本地执行契约）；失败不阻塞（新进程经注册点 active 兜底，§②第 2 条）。
5. **去重**：注册点以「绝对路径 + gitdir」为主键；`git worktree list` 为交叉验证源。同项目多 worktree 允许（不同分支），同路径重复 add 拒绝（git 原生 + 注册点双重）。

**失败回退**：任一步失败（主 checkout 缺失、网络不可达、磁盘/权限、分支冲突）→ 文件夹按普通工作区打开，诊断信息记日志 + 用户可重试。**不阻塞、不强制、不弹阻塞式错误**。

### ② TRILC_PROJECT_WORKTREE_ROOT 演进

**语义**：项目 worktree 根（绝对路径）。周平面路径 = `<root>/docs/workflow/operating-records` 派生，不再单独注入周平面根。

**解析顺序**（消费端，TriLC `weekly-plane-root.ts` 演进为 project-root resolver 的输入）：

1. `TRILC_PROJECT_WORKTREE_ROOT` env 显式（existsSync 校验，最高优先）；
2. 注册点当前项目（`%LOCALAPPDATA%\trilc\project-registry.json` 的 active 项，§③）——chat CLI 与 daemon 热更新消费；
3. 源码态 sibling 发现（现状第 2 条，开发态语义保留）；
4. 缺席 → 默认项目根（undefined）：会话默认 cwd = env.cwd、周平面按现状解析——与现状回退行为一致，无项目级语义。

**切断声明（CEO 设计修正 v2026.W34.2）**：`TRILC_WEEKLY_PLANE_ROOT` **彻底切断**——TriLC 消费端不再读取该变量、不做旧值推导、不留回退分支；安装脚本不再写入该变量。旧值只存在于已部署实例的用户级 env 中，由升级 install 一次性清除（见迁移动作）。周平面读取在新架构下仅两条来源：project root 派生（第 1/2 条）与源码态 sibling 发现（第 3 条）。

**注入点改动清单**（实施树执行，本设计只登记）：

| 注入点 | 改动 |
| --- | --- |
| TriPilot（TriCade IDE 层） | 发指令（link/claim）收 SSE 进度/错误；成功后 `setx TRILC_PROJECT_WORKTREE_ROOT`（用户上下文——服务形态 daemon 写不了用户级 env）；**不执行 git、不写注册点**（W30 零本地执行契约） |
| `scripts/install-tricade.ps1` `Resolve-WeeklyPlaneRoot` | 升级为 project root 解析三态：显式参数 > 注册点 active 项 > sibling 检测（研发仓根）；**清除旧 TRILC_WEEKLY_PLANE_ROOT 用户级 env + 写入新 TRILC_PROJECT_WORKTREE_ROOT**——一次性切换，无新旧并存期 |
| `scripts/build-desktop.ps1` install.bat [3/4] 段 | 同构升级（含旧 env 清除段） |
| NSSM `AppEnvironmentExtra` | 复用解析结果写新变量（同 v1 策略）；若历史 NSSM 配置含旧变量，升级时一并清除 |
| `TriLC/src/project/weekly-plane-root.ts` | 解析顺序改为读 `TRILC_PROJECT_WORKTREE_ROOT` 派生周平面（第 1 条）；**删除 TRILC_WEEKLY_PLANE_ROOT 读取分支**；周平面路径派生仍走 existsSync 校验（幽灵路径防护延续） |
| trilc chat CLI 会话默认 cwd | `TRILC_PROJECT_WORKTREE_ROOT` > 注册点 active > env.cwd（现状回退） |

**迁移动作（一次性切换，断点 = 版本升级 install）**：

1. 新版本 TriLC 消费端与安装脚本**同一 release 发布**（不允许消费端先于注入端或反之——消费端切新 env 后旧注入即失效，反序则新注入无消费方）；
2. 升级 install 执行顺序：清除旧用户级 env（TRILC_WEEKLY_PLANE_ROOT）→ 解析三态写新 env（显式 > 注册点 active > sibling 研发仓根）→ NSSM AppEnvironmentExtra 同构；
3. 已部署实例（如 CEO 机器，当前 env 为旧值）：升新版 install 时同一步完成清旧写新，无需人工干预；兜底动作 = 手动 `setx TRILC_WEEKLY_PLANE_ROOT ""` + 重跑 install 注入新变量；
4. 迁移验收（08-16 23:00）时部署的是旧版本：旧版 TriLC 读旧 env，行为不变，验收不受影响；升级到新版本的那一刻即完成切换，断点明确、无过渡期双路径。

### ③ 项目平面同步机制（双入口 + 周平面跟随）

**同步语义（CEO 术语修正）**：本机制承载 §2.8 术语口径——三入口同步跟随的对象 = **项目平面**（项目级焦点，当前 active 项目）；周平面是项目内子维度，跟随项目切换自然切换，不构成同级同步入口。

目标：TriCade 建 worktree 后，trilc chat（及 daemon 会话）读同一 project worktree root，**daemon 不重启**。

三载体：

1. **注册点文件**（单一真源）：`%LOCALAPPDATA%\trilc\project-registry.json`——`{ activeProjectKey, projects: { <key>: { repoUrl, mainCheckoutPath, worktrees: [{ path, gitdir, branch }], hasNpmFileDeps } } }`。**写入主体 = trilc daemon**（经 link/claim 端点原子写，单写主体 + 临时文件 rename 原子写）；TriPilot 只读呈现（UI 状态面板数据源），不直写文件。路径固定不随 TRILC_DATA_DIR 覆盖移动（与数据区默认路径同根）：TriCade 与 daemon 两侧都按固定路径访问；测试隔离（TRILC_DATA_DIR 场景）读到共享注册点为只读无害，写入侧仅 daemon 单主体。
2. **用户级 env**（进程投影）：setx TRILC_PROJECT_WORKTREE_ROOT——新进程（trilc chat 新会话、重启后的 daemon）自然继承。
3. **daemon 端点内自热更新**（免重启通道）：link/claim 端点在登记完成后**同一请求内**更新 daemon 内存态 project root——无需独立热更新端点（外部认领场景也经 claim 端点，覆盖所有更新路径）。降级路径：端点未就绪的窗口期，注册点 active 变更对运行中 daemon 暂不生效，提示重启 daemon（实现树定端点契约）。

发现顺序（trilc chat 启动 / 会话默认 cwd）：env 显式 > 注册点 active > env.cwd（现状回退，同 §② 解析顺序）。

IDE 侧不走 env：TriPilot 每会话传 `body.context.workspaceRoot`（现役字段，app.ts:1983 已消费）——**多项目正确性由请求级 workspaceRoot 保证，全局 env 只是 CLI 入口默认值**。这是多项目演进的基石：TriCade 同时开两个项目 worktree 时，两个会话各自 workspaceRoot，互不污染。

### ④ 项目级 PR / 审核 / merge 技术流程

**分支策略**（v1 §四.2 的扩展）：

| 分支 | 用途 | 纪律 |
| --- | --- | --- |
| dev | 唯一真源线 | merge 入口仅 PR 合入（目标态）；阶段一研发面保留直写 |
| project/<key> | 项目 worktree 常驻分支 | ff-only 同步 dev；**禁止直接 commit**（改动一律 feature 分支） |
| feature/<key>-<slug> | 项目改动分支（worktree 内 `git checkout -b`，同 worktree 换分支即可，无需新 worktree） | 建→改→push origin→PR→合入后删除 |

**命名演进**：v1 的 `prod/windows-local`（生产面常驻分支）升级为 `project/<key>`。理由：v1 分支名绑定单一生产面（windows-local 单机），v2 生产面升级为多项目多 worktree 面，按 project-key 命名才可多项目隔离。`prod/windows-local` 从未创建（v1 树 A 未实施），演进零迁移负担；若历史树 A 部分执行过，`prod/windows-local` 视为 key = windows-local 的既有项目分支沿用，不强制改名。

**改动流程**（项目 worktree 内）：

1. `git checkout -b feature/<key>-<slug>`（起点 = 最新 project/<key>，即最新 dev 的 ff 点）；
2. 改动 + commit（写权边界检查：项目 worktree 禁写 `docs/workflow/operating-records/`——周平面写权单主体不变，同 v1）；
3. `git push origin feature/<key>-<slug>` → 开 PR（target = dev）；
4. **TriMC 审核**（服务器侧 gate）：
   - 触发：PR 事件（webhook 或 TriMC 轮询，实现树定）；
   - 检查面：工程门禁（构建/测试/格式，按仓能力清单）+ 规则检查（写权边界、文件路径纪律、junction 风险仓标记）+ 审核裁决记录；
   - 裁决落点：PR comment + 项目级仓库管理规则 ledger（审核记录，见下）；
5. merge dev：执行主体两案，**主案 = 服务器侧 TriMC 执行 merge**（审核通过后：舰队克隆 `checkout dev` → merge PR 分支 → `push sg-server` + `push origin`），降级案 = 研发面编排层执行 merge（v1 写主体零改，TriMC 只审不 merge）。merge 策略（--no-ff merge commit 保留审核溯源 vs squash vs ff）记入项目级仓库管理规则，实施树定；主案写主体定义升级：dev 写主体 = {研发面（阶段一）, TriMC 审核链（审核后 merge）}——记入项目级仓库管理规则；
6. **三端同步**：push origin + sg-server → 研发面 pull → 项目 worktree `ff-only` 回同步（回到 dev 点，feature 分支删除）→ 舰队 ff pull 裸仓。

**TriMC 审核记入项目级仓库管理规则**：规则落点 = 项目仓治理文件（TriMetaverse 现 `docs/github-repo-governance.md`；多项目时每仓同构），新增条目：审核 gate 定义、写主体清单、分支/PR 命名规约、审核记录 ledger 位置、例外与豁免流程。ledger 建议落在项目仓 `docs/governance/` 下（不入周平面，保持周平面单主体）。

**阶段化收紧**（裁决 + 理由）：CEO 输入"全项目改动走 PR"为目标态。实施分两段——**阶段一**：项目 worktree 面全部走 PR，**生效时点 = P4 实施完成**（P1-P3 窗口期 PR 通道未上线，产品面 §2.6 流程呈禁用态 + 面板提示"PR 治理待上线"；改动留本地，LINKED-DIRTY 状态可见），研发面保留直写（迁移验收窗口与日常研发流不重排，最近的 r15-r19 全部依赖研发面直写节奏）；**阶段二**：TriMC 审核 gate 稳定运行 N 周后（判定口径实施树定），研发面收进 PR 流。目标态（全项目 PR）写入规则文档即日生效，节奏分阶段。

### ⑤ r4 对齐

CEO 要求：新架构定了再做新增优化。对齐关系：

- **r4 本身不改、不重开**：r4 修的是下游缺陷（五读工具不跟随 ctx.cwd）；v2 定义的是上游语义（ctx.cwd 应该 = project worktree root）。两者正交——r4 的 `ctx?.cwd ?? process.cwd()` 机制在新架构下恰好是正确载体，零冲突。
- **R4-RELEASE-MERGE 排期不变**：合并仍挂迁移验收后（v0.4.10-r20 预估），v2 实施树不与 r4 合并抢排期；r4 合并时附带项（装后 ls/cwd 活体验证）的口径升级为"安装态工具调用落 project worktree root 或会话工作区"。
- **v2 定案后的新增优化清单**（新树排期，不在本设计实施）：
  1. `buildWeeklyPlaneHint` 升级：周平面根提示 → project root + 周平面派生双事实提示（一次注入两信息，模型一次得知工作区根与周平面）；
  2. C-EXT-ENDPOINTS-20260814-001 在新架构下重评（外部端点是否强制追加 project root 提示）；
  3. 会话 cwd 默认值链升级（§②消费端改动）随 v2 实施树落地，r4 的 `env.cwd` 回退点被 project root 优先取代——属上游升级，不回头改 r4 commit。

### ⑥ 多项目演进

- **项目仓注册表**（新注册点）：`project-key → { repoUrl, mainCheckoutPath, hasNpmFileDeps, defaultBranch }`。现阶段单项目（TriMetaverse），结构预留多项目；注册表源建议 TriCade 配置层（用户级）+ 可选公司级默认清单（TriCompany 中央 registry 发布），实现树定。
- **命名与隔离**：目录名建议 `<RepoName>-<suffix>`（用户可改，路径任意）；分支名 `project/<key>` / `feature/<key>-<slug>` 以 project-key 前缀隔离；多项目 worktree 物理隔离（各自路径、各自 gitdir），互不影响。
- **env 多项目选择**：TRILC_PROJECT_WORKTREE_ROOT 保持**单值** = active 项目（最近打开/认领的 worktree）。多项目正确性由请求级 workspaceRoot 承载（§③）——env 单值不是限制，CLI chat 无请求级 cwd 时才读 env/注册点 active。未来若出现"daemon 同时服务多项目会话的 cwd 需求"，注册点文件已是完整映射源，无需 env 多值化（TRILC_PROJECT_WORKTREE_ROOTS 多值方案明确不做，避免 Windows env 长度与解析负担）。
- **服务器侧多项目**：裸仓/舰队克隆按仓 ×5 布局（server-fleet-m0 已有），新项目仓入列 = 裸仓创建 + 克隆 + sg-server remote 登记，流程模板化沿用 m0 checklist；TriMC 审核 gate 按 project-key 路由审核规则。

## 六、风险与护栏

| 风险 | 缓解 |
| --- | --- |
| 用户任意路径 + npm file: 依赖 junction 事故（INCIDENT-20260814-001 形态） | 项目仓注册表 `hasNpmFileDeps` 标记强制门禁：标记仓拒绝自动 worktree add；`worktree remove --force` 全仓禁用（v1 纪律继承） |
| 主 checkout 不可用（换机/重装）时 worktree add 无从发起 | 阶段一仅支持主 checkout 在位场景（现 TriMetaverse 恒在研发机）；换机场景 = 克隆建立新主 checkout 后再关联，列入后续树（克隆 → 注册为主 checkout → 关联旧 worktree 路径） |
| 双源不一致（setx 改了但 daemon 未热更新） | 注册点为单一真源、env 为投影；daemon 热更新端点为主通道，降级提示重启；chat 启动读注册点而非只信 env |
| 幽灵 worktree 路径（目录被删但注册点残留） | 消费端 existsSync 校验（weekly-plane-root 既有模式）；注册点读取时惰性清理无效项 |
| PR 流与 dev 并发写冲突（多 worktree 同时 PR） | ff-only 常驻分支 + TriMC 审核串行化（审核队列按项目 key）；merge 前 ff 检查失败即退回更新 |
| TriMC 服务器侧 merge 的 git 身份纪律（OBS-20260814-002 教训映射） | merge 执行固定 fleet 单身份；root 只做 chown 修复（v1 §四.4 + m0 runbook 继承）；主案不可行即降级案（研发面 merge） |
| 迁移验收阻塞 | v2 纯设计零代码零脚本；阶段一不重排研发面直写节奏；08-16 23:00 验收时部署旧版本行为不变；切换绑定升级 install 一次性完成，断点明确无并存期 |
| 注册点被多进程并发写（TriCade 多窗口） | 写入采用原子写（临时文件 + rename）；读端容忍解析失败回退 env |

## 七、实施拆分建议（另建树，本设计不做）

- **树 P1（识别与认领，只读）**：项目仓注册表 + TriPilot 检测/关联判定/认领/去重（无 add 动作）——先让 IDE 能正确识别现有 worktree 与项目仓。
- **树 P2（建立与注入）**：link/claim daemon 端点（worktree add/认领原子执行 + 注册点登记 + 内存态自热更新，TriPilot 发指令收 SSE）+ 分支规约 + setx（TriPilot 用户上下文）。
- **树 P3（消费端升级，一次性切换）**：TriLC project-root 解析顺序（读 TRILC_PROJECT_WORKTREE_ROOT + 删除 WEEKLY_PLANE_ROOT 读取分支）+ chat CLI 默认 cwd 链 + install-tricade.ps1 / install.bat 注入升级（清旧写新，消费端与注入端同 release 发布）。
- **树 P4（项目级治理）**：PR 流程 + TriMC 审核 gate + 三端同步 runbook + 仓库管理规则落盘（含写主体与审核 ledger）。
- r4 对齐新增优化项（§⑤）随 P3/P4 排期。
- v1 树 A **取消排期**（被 P2/P3 取代）；树 B（TriMC 本地 worktree 同构）保留可选。

## 八、使用依据

- `TriMetaverse/docs/execution/worktree-architecture-design.md`（v1 事实基线，WORKTREE-ARCH-DESIGN-20260814-001）
- `TriMetaverse/docs/workflow/operating-records/2026-W34/OP-202608-W34-001.json`（v1.48.0：派单、r4 收官、R4-RELEASE-MERGE、TRICADE-ENV-INJECT 实现状态 8574d51a、v2 定稿登记 ARCH-20260814-002 与 402 中断恢复收口）
- `TriMetaverse/docs/workflow/operating-records/2026-W34/trees/prod-grade-4-lscwd-fix/tree-op.json` + `briefs/r4-2-20260814033515.md`（r4 定案 A+C、ctx.cwd 链、executeTool 透传）
- `TriMetaverse/docs/execution/server-fleet-m0.md`（裸仓/克隆布局、身份纪律 OBS-20260814-002）
- `TriMetaverse/docs/execution/v0.9.x-dual-track-tricompany-plan.md`（dual-track、PR/CI 流程现状）
- `TriLC/src/project/weekly-plane-root.ts`（解析顺序现状、只读契约）
- `TriLC/src/server/app.ts:1950-2003`（tasks/stream 会话 cwd 契约 `body.context.workspaceRoot ?? env.cwd`）
- `TriPilot/src/extension.ts:6166-6172`（workspaceRoot 传递现状）、`:1220`（workspaceFolders 消费）
- `TriCompany/docs/registry/business-state.md` + `TriCompany/docs/registry/code-state.md`（中央口径：技术归 CTO、CodeRegistry 边界）
- 本地 `git worktree list` / `git remote -v` 实测（2026-08-14）
