# 研发仓 × TriCade 生产面 Git Worktree 架构设计

> **superseded**：本设计的固定路径方案已被 `docs/execution/project-workspace-design-v2.md`（ARCH-20260814-002）取代，树 A 取消排期；本文保持冻结作为 v2 的事实基线（分支纪律、junction 事故纪律、fleet 对称性教训继承），不再单独实施。

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/worktree-architecture-design.md
- syncMode: source-only
- lastSyncedAt: 2026-08-14

> 版本：v2026.W33.1
> 日期：2026-08-14
> 状态：设计定案（WORKTREE-ARCH-DESIGN-20260814-001）；实施树另建，本设计不动代码、不建 worktree、不改安装脚本
> owner：小狄（CTO）
> 关联：`docs/workflow/operating-records/2026-W33/OP-202608-W33-001.json`（派单登记）；`docs/execution/server-fleet-m0.md`（服务器舰队模式）；`TriLC/src/project/weekly-plane-root.ts` + `scripts/install-tricade.ps1`（周平面注入现状）；INCIDENT-20260814-001（worktree 事故纪律）

## 一、背景与目标

CEO 架构指令：研发仓与 TriCade 工作区改为**同一仓库的不同 git worktree**，与 TriMC 仓版本协同——任何一方改动互不影响，通过标准 git 流程合入同一 dev 仓。

目标形态：**一仓（dev 单线真源）+ 三 checkout 面（研发 / 本地生产 / 服务器舰队）+ 一裸仓中转**。所有面共享同一仓库历史，物理隔离，写方向单主体。

护栏（本设计全程遵守）：
1. 禁 worktree + npm install 组合（INCIDENT-20260814-001 纪律：`git worktree remove --force` 会穿透 npm `file:` 依赖 junction 误删工作区）。
2. 周日 08-16 23:00 迁移验收不阻塞——本设计为纯文档，实施另建树。
3. 周平面文件（`docs/workflow/operating-records`）写权单主体不变：编排层。

## 二、现状事实基线（设计依据）

| 面 | 现状 | 事实来源 |
| --- | --- | --- |
| 研发面 | 主 checkout `D:/Code/ai/TriMetaverse` @ dev，唯一 worktree | `git worktree list`（2026-08-14） |
| 远端 | `origin` = github MoRen9527/TriMetaverse（PR 面）；`sg-server` = `ssh://sg-ecs-server/srv/git/TriMetaverse.git`（裸仓，同步中转） | `git remote -v`（2026-08-14） |
| TriCade 安装区 | `C:\Program Files\TriCade`（`$InstallDir`，TriLC 在 `trilc\` 子目录）——MSI 所有区 | `scripts/install-tricade.ps1:36` |
| TriLC 数据区 | `%LOCALAPPDATA%\trilc`（TRILC_DATA_DIR 可覆盖） | `TriLC/src/config/env.ts:127` |
| 服务器舰队 | 裸仓 `/srv/git/<repo>.git` ×5 + 克隆 `/srv/fleet/<repo>` ×5（fleet 用户，只读 ff pull，写方向单主体） | `docs/execution/server-fleet-m0.md` §三.8/9 |
| 周平面注入（安装态） | `install-tricade.ps1` 三态：显式参数 > sibling 检测（`D:\Code\ai`、`C:\Code\ai`、`~/Code\ai` 下 TriMetaverse 检出）> 不注入；用户级 env + NSSM AppEnvironmentExtra 双注入 | `scripts/install-tricade.ps1:428-472,520-525` |
| 周平面注入（ZIP 装后脚本） | `install.bat` [3/4] 段 setx 三态同构 | `scripts/build-desktop.ps1:188-198` |
| 周平面读取（TriLC） | `weekly-plane-root.ts`：env 显式（existsSync 校验）> 源码态 sibling 发现 > undefined（项目轨旧行为）；公司轨**只读、绝不创建、绝不写入** | `TriLC/src/project/weekly-plane-root.ts` |
| 版本协同 | v0.9.x dual-track：dev 代码版本 → prod 安装版本；TriMC 仓同构（origin + sg-server 双 remote、dev 单线） | `docs/execution/v0.9.x-dual-track-tricompany-plan.md` |

关键既有契约：周平面写权在编排层（CEOChiefOfStaff），TriLC 只读——本设计的生产面延续此契约。

## 三、总体模型：一仓三面

```
TriMetaverse 仓（dev = 唯一真源线）
│
├─ 面1 研发面（写主体）：D:/Code/ai/TriMetaverse       主 checkout @ dev
│       写 dev → push origin（PR 备份）+ sg-server（裸仓）
│
├─ 面2 本地生产面（只读+例外写）：C:\ProgramData\TriCade\workspace\TriMetaverse
│       worktree @ prod/windows-local；ff pull sg-server；例外写走 PR
│
├─ 面3 服务器舰队面（只读）：/srv/fleet/TriMetaverse   克隆 @ dev
│       fleet 用户 ff pull 裸仓
│
└─ 中转：sg-server /srv/git/TriMetaverse.git（裸仓，无 checkout）
```

原则：
- **线不变，面改变**：worktree 不引入新版本线、不改 dual-track 机制，只把"TriCade 所见仓库面"从研发仓 checkout 切换为独立 worktree。
- **写方向单主体**：dev 只由研发面写；生产面默认只读，例外写走 prod 分支 + PR（§四.2）。
- **只读面一律 ff-only**：生产面与舰队面不做 merge/rebase 类非线性操作。

## 四、四要素设计

### ① worktree 布局

候选对比：

| 候选 | 否决/采纳理由 |
| --- | --- |
| `C:\Program Files\TriCade\workspace` | **否决**：MSI 所有区，升级/卸载目录清理风险；Program Files 需管理员写权，git 操作身份与安装生命周期纠缠；junction 敏感区叠加事故纪律 |
| `%LOCALAPPDATA%\trilc\workspace` | **否决**：用户级路径，服务形态（LocalSystem）跨用户 ACL 读取障碍；与 daemon 数据区（`%LOCALAPPDATA%\trilc`）混居，隔离语义模糊 |
| `D:\Code\ai\TriCade-workspace` | **否决**：与研发仓同工作区树——`install-tricade.ps1` sibling 检测在 `D:\Code\ai` 下先命中研发仓产生二义；生产面与研发面物理共存违反路径污染纪律（先例：TriMetaverse/TriSkill 路径污染处置） |
| `C:\ProgramData\TriCade\workspace\TriMetaverse` | **定案**：机器级标准应用数据落点；服务（LocalSystem）与登录用户（RegRun）双可达，两注入形态共用同一路径；与 MSI 安装区物理分离，MSI 升级不触碰；路径唯一稳定，安装脚本单一候选命中 |

定案细节：
- worktree 路径：`C:\ProgramData\TriCade\workspace\TriMetaverse`，`git worktree add <path> -b prod/windows-local`（由研发面发起，见 §四.2）。
- ACL：由安装器（管理员上下文）创建目录并 `icacls` 显式授权（daemon 读、安装器/git 操作身份读写）；与 MSI 组件清单无交集（不在 INSTALLFOLDER 下）。
- 内容：仅 TriMetaverse 仓 checkout（文档 + 脚本仓，**无 npm 包面**，junction 风险天然为零——本仓不触发 INCIDENT-20260814-001 事故形态）。
- fetch/pull 源：`sg-server`（与舰队面同源语义：研发 push → 裸仓 → 生产面 pull；github 仅作 PR/备份面）。

### ② 分支策略

- **dev**：唯一真源分支（当前开发主线，`origin/HEAD -> dev`）。main 保持现状，不参与本流程。
- **prod/windows-local**：生产面常驻分支，创建于 worktree add 时（起点 = dev HEAD）。日常同步 = `git fetch sg-server && git merge --ff-only sg-server/dev`，保证 prod 分支永不与 dev 非线性发散。
- **例外写流程**（生产面需要落仓内容时，如迁移记录、运行报告）：
  1. 生产面 commit 至 prod/windows-local（**禁止写入 `docs/workflow/operating-records/`**——周平面写权单主体不变）；
  2. push origin → PR 到 dev；
  3. 审核（编排层/小贾门禁）→ merge dev；
  4. 生产面 ff-only 回同步（merge --ff-only 后回到 dev 点）。
- **周平面冲突规避**：生产面产生的候选内容落 prod 分支独立路径（如 `production-notes/`），PR 审核时由编排层决定是否并入 operating-records；生产面绝不直接提交 operating-records 下文件。ff-only 保证 prod 与 dev 在文件层面零并发写。
- **生产面禁止**：手动 checkout 实验分支、merge 非线性操作、`worktree remove --force`（事故纪律）。

### ③ TRILC_WEEKLY_PLANE_ROOT 演进

目标态：安装态注入指向生产面 worktree 对应路径 `C:\ProgramData\TriCade\workspace\TriMetaverse\docs\workflow\operating-records`。

解析顺序变更（仅安装脚本侧，`Resolve-WeeklyPlaneRoot`）：

1. 显式参数 `-WeeklyPlaneRoot`（不变）；
2. **生产面 worktree 候选**（新增，置顶于 sibling 检测之前）；
3. 研发面 sibling 候选（`D:\Code\ai`、`C:\Code\ai`、`~/Code\ai`，保留为迁移期回退）；
4. 不注入回退（不变）。

顺序理由：安装态 = 生产 TriCade，应优先读生产面；worktree 建立前新候选 `Test-Path` 不命中，自动落回研发面候选——**迁移前行为逐字节不变，08-16 23:00 迁移验收零影响**；worktree 建立后新装/重注入自动切换。

注入点改动清单（实施树执行，本设计只登记）：

| 注入点 | 改动 |
| --- | --- |
| `scripts/install-tricade.ps1` `Resolve-WeeklyPlaneRoot` | 候选列表新增生产面 worktree 一条（第 2 优先） |
| `scripts/build-desktop.ps1` install.bat [3/4] 段 | 同构补一档 if exist 分支 |
| NSSM `AppEnvironmentExtra` | **零改**（复用 Resolve-WeeklyPlaneRoot 结果，自动随解析顺序升级） |
| `TriLC/src/project/weekly-plane-root.ts` | **零改**（env 显式最高优先已覆盖安装态；sibling 发现是源码态语义，不增加生产面探测——避免源码态 TriLC 误读生产面） |

迁移动作清单（实施树）：
1. 创建生产面 worktree + ACL（§四.1）；
2. 验证 worktree 内 `docs/workflow/operating-records` 与研发面 dev HEAD 一致（ff 同步）；
3. 重跑 `install-tricade.ps1`（新解析顺序自动命中生产面候选）覆盖用户级 env；服务形态同步 `nssm set AppEnvironmentExtra`；
4. 验收：TriLC 周平面视图可见 + 服务/登录双形态读取实测；
5. 回滚：重注入旧路径（研发面候选仍在列表，`setx`/`nssm set` 单命令可回）。

迁移影响面：
- 存量用户 env（指向研发仓路径）在重注入前继续生效——过渡期双路径并存无冲突（env 单值，切换靠重注入覆盖）；
- 幽灵路径防护：worktree 建立前新候选 Test-Path 不命中不注入（现有逻辑天然覆盖）；
- MSI 卸载不清用户 env 的现状不变（worktree 不改变卸载行为，与现有设计一致）。

### ④ 与服务器 /srv/fleet 对称性

三态协同表（统一模型 = 仓库 checkout 形态 + 裸仓同步）：

| 面 | checkout 形态 | 分支 | 写权 | 同步源 | 纪律 |
| --- | --- | --- | --- | --- | --- |
| 研发面 | 主 checkout `D:/Code/ai/TriMetaverse` | dev | 写 dev（唯一写主体） | push origin + sg-server | 唯一主动写面 |
| 本地生产面 | worktree `C:\ProgramData\TriCade\workspace\TriMetaverse` | prod/windows-local | 只读（例外写走 PR） | ff pull sg-server | 禁非线性、禁 worktree+npm install |
| 服务器舰队面 | 克隆 `/srv/fleet/TriMetaverse` | dev | 只读 | ff pull 裸仓 | fleet 用户单一身份、ff-only |
| 服务器裸仓 | `/srv/git/TriMetaverse.git` | 无 checkout | 中转 | 收 push 供 pull | HEAD 指向 dev |

纪律统一（服务器教训本地映射）：
- **写方向单主体**：fleet 不直接改 main ↔ 本地生产面不直接写 dev——同一原则两种形态。
- **git 操作身份单一**：服务器教训 OBS-20260814-002（root pull 污染 `/srv/fleet/TriMetaverse/.git` 属主致 fleet 不可写）本地映射 = 生产面 worktree 的 git 操作固定单一身份（安装器管理员上下文），禁多身份混用；对应 ACL 显式授权写入 runbook。
- **TriMC 仓版本协同**：TriMC 仓已同构（origin + sg-server 双 remote、dev 单线）。本设计的"面模型 + 分支 + 纪律"为**仓级模板**：TriMC 本地 worktree 如需（本地跑 TriMC 实例场景），按同构复制，不提前实施。版本协同机制（v0.9.x dual-track）不动——worktree 只改面，不改线。

## 五、风险与护栏

| 风险 | 缓解 |
| --- | --- |
| worktree + npm 依赖 junction 穿透删除（INCIDENT-20260814-001 形态） | TriMetaverse 仓无 npm 包面，本 worktree 天然零风险；纪律封死：含 npm `file:` 依赖的仓（TriCompany/TriLC/TriCode）**禁建本地 worktree**，除非专项隔离措施实施并验证；`worktree remove --force` 全仓禁用，remove 失败先查 junction 再处置 |
| ProgramData ACL 配置错误致 daemon 读不到周平面 | 安装器创建时显式 icacls；实施树验收含服务形态（LocalSystem）与登录形态双读取实测 |
| MSI 升级触碰 workspace | workspace 不在 INSTALLFOLDER 下、不入 MSI 组件；升级验收含 worktree 完好检查项 |
| prod 分支与 dev 漂移 | ff-only 同步 + 例外写即时 PR 流程（§四.2），merge 后回同步 |
| 迁移期双路径并存误读 | 解析顺序保证生产面候选未建立时不命中；env 单值切换，回滚单命令 |
| 08-16 23:00 迁移验收阻塞 | 本设计零代码零脚本变更；实施树独立排期，验收前行为逐字节不变（§四.3） |

## 六、实施拆分建议（另建树，本单不做）

- 树 A（迁移实施）：worktree 建立 + ACL → 安装脚本候选补档（install-tricade.ps1 + build-desktop.ps1）→ 重注入 + 双形态验收 → runbook 落盘（git 身份纪律 + 回滚步骤）。
- 树 B（可选，后续）：TriMC 仓本地 worktree 同构（本地跑 TriMC 实例场景出现时启动）。

## 七、使用依据

- `TriMetaverse/docs/workflow/operating-records/2026-W33/OP-202608-W33-001.json`（派单 + INCIDENT-20260814-001 事故记录）
- `TriMetaverse/docs/execution/server-fleet-m0.md`（服务器舰队模式、裸仓/克隆布局、OBS-20260814-002 教训）
- `TriMetaverse/docs/execution/v0.9.x-dual-track-tricompany-plan.md`（dual-track 版本协同）
- `TriMetaverse/scripts/install-tricade.ps1`（InstallDir、Resolve-WeeklyPlaneRoot 三态、NSSM 注入）
- `TriMetaverse/scripts/build-desktop.ps1`（install.bat [3/4] 段）
- `TriLC/src/config/env.ts`（dataDir、weeklyPlaneRoot 直通）
- `TriLC/src/project/weekly-plane-root.ts`（解析顺序、只读契约）
- `TriMetaverse/docs/workflow/operating-records/2026-W33/trees/prod-grade-2-trilc-plane-view/briefs/r2-1-20260813184459.md`（周平面路径契约定案）
- `TriCompany/docs/registry/business-state.md` + `TriCompany/source-agents/registries/business-strategy.agent.md`（中央口径：operating-records 归 CEOChiefOfStaff、技术归 CTO）
- `TriCompany/docs/engineering/DESIGN.md`（技术真源结构）
- 本地 `git worktree list` / `git remote -v` 实测（2026-08-14）
