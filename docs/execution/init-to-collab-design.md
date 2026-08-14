# 初始化到协同设计（INIT-TO-COLLAB-DESIGN-20260814-001）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/init-to-collab-design.md
- syncMode: source-only
- lastSyncedAt: 2026-08-14

> 版本：v2026.W34.4
> 日期：2026-08-14
> 状态：联合设计最终稿（产品面小乔 §二 × 技术面小狄 §三~§十，CTO 联合评审吸收并行初稿四点差异后定稿 v2026.W34.4），报小贾收口后呈 CEO 审批。本设计不动代码，实施树另建
> 修正记录：v2026.W34.2（小乔产品面合成）——§二 填充完成，与技术面逐段回注：状态机命名沿用 §四（SELFCHECK→ONBOARDING→PROJECT-LINK→SYNC→CONFIRM→READY）、key 失败分类对齐 §5.2 四分类、五维三态对齐 §6.2/§6.3、协同确认三元素对齐 §7.1、平移测试衔接对齐 §8.1/§8.2、实施树对齐 §十；v2026.W34.3（CTO 小狄复核尾改）——对接点复核：§4.1 载体拆分映射回注 §2.2、§4.4 向导六步编号对齐 §2.5、两入口端点级验收口径补入、§九 补 SELFCHECK 前置缺陷行（r19 问周面）、§6.2 接收端点缺口显式入实施树 I4 范围；v2026.W34.4（CTO 联合评审，吸收 xiaodi-m2-4 并行初稿四点技术差异）——①key 维同步改为密钥配置面 + 指纹，不传密钥材料（SEC-20260813-001 纪律）②五维同步载体改为 git bundle 链（复用已实证 fleet 双仓闭环，不新建 HTTP 接收端点；TriMC 侧新增 sync-apply cron + status 端点最小集）③补周日自然触发显式条款（08-16 前完成 init+确认则自然触发=首个协同工作，否则确认后显式触发一次）④三端回退升级 + init-sync 域与 operating-records 域隔离；§三 基线修正（keys 面四条目、迁移链 r1-2、REQ-016/017/019、TriMC 旧名残留）；§七 升级 L1-L4 分层验证；§十 树 I4/I5 范围改写
> owner：小乔（CPO，产品面）× 小狄（CTO，技术面）
> 派单：`docs/workflow/operating-records/2026-W34/OP-202608-W34-001.json`（1.49.0，INIT-TO-COLLAB-DESIGN-20260814-001；CEO-20260814-003）
> 前置设计：`docs/execution/project-workspace-design-v2.md`（v2026.W34.3 最终稿，保持冻结，作为本设计的事实基线）；`docs/execution/worktree-architecture-design.md`（v1 定案基线）

## 〇、与既有设计/冻结的关系（升级声明）

本设计承接三项既有事实，不取代：

| 既有事实 | 本设计关系 |
| --- | --- |
| ONBOARDING-FROZEN-20260813（chat 选人/公司开张 6.4 交互面冻结） | **解冻承接**：CEO 裁决 2026-08-14 解除冻结，变更通道重新开放；本设计正面设计解冻后的交互面升级（不回头修冻结期状态） |
| design-v2 §2.9 升级项「工作区向导并入 onboarding 主流程」 | **裁解决定落地**：CEO 已裁（先解冻 onboarding 把初始化到协同做对），本设计把该升级项转正为设计要求——worktree 向导（§2.4 五步）成为初始化项目面主流程 |
| design-v2 实施树 P1-P4 排期 + R4-RELEASE-MERGE + 08-16 迁移验收 | **排期由本设计定**（§八）：初始化链路吸收 P1/P2（识别认领 + 建立注入），P3/P4 维持独立排期；原 08-16 23:00 验收口径与新初始化验收的关系见 §八 |

v1 / design-v2 的纪律全部继承：写权单主体（编排层）、ff-only 只读面、junction 事故纪律（hasNpmFileDeps 门禁）、TriPilot 零本地执行（W30 架构契约）、git 身份单一纪律。

## 一、CEO 设计输入（CEO-20260814-003，五步期望流程）

1. 建立可用 trilc + tripilot（安装态自检）。
2. 解冻赛博公司（ONBOARDING-FROZEN 解除）。
3. 公司面 + 项目面初始化——worktree 选择（本地仓或 GitHub 链接 → 自动 worktree add）、TriCade 经 TriPilot 或 trilc chat 两入口初始化都成功、从 TriModel 拿模型和 key、选择员工开业、配置同步 TriMC（模型/key/员工/公司/项目五维同步，TriMC 非开箱即用而是初始化后同步）。
4. 开启协同——确认研发仓 + TriCade(TriLC) + TriMC 操作同一项目。
5. 周工作平面平移测试 = 第一个协同工作。

设计职责分工：产品面（§二，小乔）——全流程用户旅程、两入口体验一致性、worktree 向导交互（含 GitHub 链接源）、员工开业选择体验、五维同步可见性；技术面（§三~§十，小狄）——现状基线、初始化链路架构、TriModel key 流、五维配置同步协议、协同确认机制、周平面平移测试衔接、风险护栏、实施拆分。只设计不动代码。

## 二、产品面：用户旅程与交互设计（小乔）

### 2.1 产品定位与语义

产品口径：**「初始化到协同」是把"安装完成"推进到"公司与项目开张、三端协同、第一个协同工作落地"的端到端首次体验**。三段式叙事：

- **安装可用**（CEO 流程 ①）：TriCade 装上后 trilc daemon 与 TriPilot 面板自检可用。
- **初始化**（CEO 流程 ②③）：解冻的 onboarding 统一承载公司面（CEO 名、员工开业）与项目面（worktree 向导、模型与 key、五维同步 TriMC）。
- **协同**（CEO 流程 ④⑤）：三端确认同一项目后，周平面平移测试作为第一个协同工作跑通。

本面交互三原则（继承 design-v2 §2.1，全旅程适用）：

- **零命令**：全程 GUI/对话引导，用户不需要 git CLI、不需要手写配置。
- **零强制**：任一环节失败或用户拒绝，回退为可续跑状态，不阻塞、不弹阻塞式错误；用户随时可跳过非关键步骤（跳过项在状态面板标记「待补」，不静默消失）。
- **状态可见**：初始化进度、同步状态、协同确认全程可见，不藏进度、不藏失败。

### 2.2 用户视角阶段旅程（与 §四 状态机逐段对应）

初始化是一个**可断点续跑的多阶段旅程**，状态真源 = daemon 侧持久初始化状态机（§4.1），产品面按同一状态命名呈现。启动 TriCade / 打开面板时链路状态为 UNINITIALIZED（未初始化），用户可见旅程从 SELFCHECK 开始：

| 阶段 | 名称 | 关键动作（用户视角） | 成功判据（用户可见） | 失败/跳过行为 |
| --- | --- | --- | --- | --- |
| SELFCHECK | 安装态自检 | TriCade 启动后自动检查 daemon 健康 + 面板连通 + 模型服务可达性 | 「环境就绪」绿卡：daemon ✓ / 面板 ✓ / 模型服务可达 | 红色诊断卡 + 修复指引（重启 daemon 等），不进入初始化；key 类失败降级继续（§2.6） |
| ONBOARDING | 公司开张与员工开业 | 问候 → CEO 名字 → 员工开业选择（§2.4） | 「公司已开张」卡：CEO 名 + 已开业员工名单 | 中途退出 → 下次启动从断点续跑；不支持 0 人开张 |
| PROJECT-LINK | 项目面初始化（worktree 向导） | 选择项目源（本地仓 / GitHub 链接）→ 落点 → 创建 worktree（§2.5） | 「项目工作区已建立」卡：项目名 + 路径 + 分支 | 跳过 → 面板标记「项目未关联」待补；可稍后重进向导 |
| SYNC | 五维同步 TriMC | 模型/key/员工/公司/项目逐维同步（§2.7） | 「TriMC 已同步」卡：五维全绿 | 本地初始化完成不因同步失败回滚（本地可用先营业）；单维失败标红 + 重试入口 |
| CONFIRM | 协同确认 | 确认研发仓 + TriCade(TriLC) + TriMC 操作同一项目（§2.8） | 「协同已开启」卡：三端同项目证据 | 确认失败 → 诊断卡列出不一致点 + 重新登记/重新同步；以 TriMC 同步成功为前提（§6.8） |
| READY | 周平面平移测试 | 三端共同执行第一个协同工作（§2.9） | 「平移测试通过」卡：周平面迁移三面可见 | 失败 → 结果报告 + 挂后续树；不阻塞日常使用 |

**断点续跑**：每阶段完成即落盘（daemon 状态文件 + 注册点），重启 TriCade / 重开 trilc chat 从最近未完成阶段继续；已完成阶段显示 ✓ 可回看。**跳过**：PROJECT-LINK / SYNC 允许「稍后再说」，面板常驻「待补」入口；SELFCHECK / ONBOARDING / CONFIRM / READY 为关键路径不提供跳过（分别为环境前提、公司存在前提、CEO 流程 ④⑤ 的验收本体）。

### 2.3 两入口一致性（TriPilot 面板 × trilc chat CLI）

CEO 要求「两个入口初始化都做成功（两入口体验）」。产品面判断：**两入口是同一状态机的两种投影，不做两套流程**（技术面 §4.1/§4.4 同构：入口差异仅在渲染层，状态机与执行体唯一）。

- **状态真源单一**：初始化进度、阶段状态、错误信息全部由 daemon 状态机承载；TriPilot 面板与 trilc chat 都是只读投影 + 指令发起方，不各自维护流程状态。
- **入口形态**：
  - TriPilot 面板 = 结构化向导：进度条 + 阶段卡 + 表单（名字输入、岗位多选、路径选择）+ 状态徽标。适合首次完整初始化。
  - trilc chat = 对话叙事：同一状态机经 chat 对话呈现（问候 → 提问 → 确认 → 汇报），与现有 onboarding chat 引导（onboarding.ts Step 1-5 叙事）同源同味。适合轻量推进与续跑。
- **一致性规则**：
  1. 任一入口推进到新阶段，另一入口下次交互时读到同一阶段（不重复提问、不跳阶段）。
  2. 中途切换入口不丢进度：chat 里开张到一半 → 打开 TriPilot 面板 → 从同一断点继续。
  3. 冲突防护：同一状态机同一时刻只接受一个入口的写指令（daemon 状态机单执行体 + 指令串行化，§九 双入口指令竞态护栏）；另一入口显示「正在另一入口操作中」而非并发写。
- **验收口径（两入口体验）**：同一次初始化旅程中，SELFCHECK→SYNC 至少两个阶段在 TriPilot 完成、至少两个阶段在 trilc chat 完成，断点续跑与状态一致无重复提问——即两入口交替使用全程走通，证明投影一致性（技术面补充端点级验收口径）。

### 2.4 公司开张与员工开业（解冻 onboarding 重设计）

**现状**：onboarding.ts 为一次性 chat 引导（Step 1 打招呼 → Step 2 问 CEO 名 → Step 3 岗位列表 → Step 4 逐个起名 → Step 5 assemble skeleton → INITIALIZED）；playbook 1.2 已有「最小员工推荐配置（5 人起步，含治理角色）」与核心原则「岗位是标准资产（来自 TriCompany source-agents 岗位目录），名字是用户资产（由 CEO 起名，不预设研发仓名字）」。

**解冻后的重设计判断**：原则继承，交互升级。

1. **保持 chat 叙事、增加结构化选择**：Step 3-4（岗位列表 → 逐个起名）从纯文本流升级为结构化选择（TriPilot 面板为岗位目录卡片多选 + 名字输入表单；trilc chat 保持对话式多选 + 命名问答）。理由：岗位目录来自 TriCompany `source-agents/` 全量岗位定义，纯文本流逐个确认冗长易错；结构化多选把「选哪些、起什么名」一次收敛，chat 叙事保留人味。技术承载 = daemon 状态机结构化步骤载荷（§4.3），渲染层两入口各一份。
2. **岗位目录卡片**：每岗位显示 role 名 + 一句话定位（来源 = TriCompany `source-agents/` 岗位定义与 registry，只读展示）；默认勾选 playbook 1.2 最小推荐 5 岗（含治理角色），可增可减。
3. **员工开业 = 写公司注册表 + 装配员工骨架**（现有 Step 5 机制沿用，执行主体升级为装配端点）：`.claude/agents/<role>.md`（员工定义，名字写入）+ `docs/registry/company-state.json`（CEO 名 + 员工名单）+ `business-state.md` + `AGENTS.md`（§4.3 装配产物不变）。产品面不发明新落点，只定义选择体验。
4. **开业人数口径**：最小 5 人起步（推荐配置），全量岗位可选；不支持 0 人开张（公司开张必须至少有 CEO 与最小治理骨架——与 playbook 1.2 一致）。
5. **解冻边界声明**：本次解冻重新开放「chat 选人 / 公司开张交互面」的变更通道。变更范围 = 交互呈现与选择体验（本条 1-2）+ daemon 侧持久状态机的结构化步骤载荷（新增 SSE 事件类型，替代叙事态进度追踪）；落点机制（本条 3）沿用不改；6.4 会话初始化器（TriLC / TriMC 同源）零改动（§4.1）。**不把 onboarding 改写成生产级组织运行**（TriCompany 仍非正式宿主，STATE.md 风险口径不变）。

### 2.5 项目面初始化：worktree 向导（本地仓 / GitHub 链接两源）

**衔接声明**：design-v2 §2.9 判断「工作区向导并入开张 onboarding 主流程」是解冻触发的升级项（§2.10）；CEO-20260814-003 期望流程 ③ 已将 worktree 选择放在初始化主流程内——**该升级项已裁决落地，本设计承接**（§〇 升级声明）。design-v2 正文（v2026.W34.3）保持冻结，其 §2.4 五步向导、§2.5 识别分流、状态机（UNLINKED/CREATING/LINKED-*）与树 P1-P4 排期全部作为本步骤的机制层事实基线直接引用；技术链路 = §4.4。

**向导步骤（用户视角，在 design-v2 §2.4 基础上扩展源选择）**：

| 步骤 | 用户看到 | 变化说明 |
| --- | --- | --- |
| Step 0 项目源选择 | 两个源卡片：**本地仓库**（本机已有克隆/检出，浏览选择路径）/ **GitHub 链接**（粘贴仓库 URL） | **新增**——design-v2 只有项目清单（产品预置单项目）；本设计按 CEO 输入扩展两源 |
| Step 1 项目清单 / 链接校验 | 本地源 → 可关联项目列表（design-v2 §2.4 Step 0 沿用）；GitHub 源 → URL 校验（与项目仓注册表 repoUrl 白名单比对 + 可达性），校验中/通过/失败分类 | 本地源沿用 v2；GitHub 源新增校验态（防克隆非项目仓，§九） |
| Step 2 选择落点 | 默认 `<用户路径>/<RepoName>-<suffix>`（可改任意路径）；校验同 design-v2（不落研发仓检出内、不重叠、空目录或可创建） | 沿用 v2 |
| Step 3 确认信息卡 | 项目名、来源（本地路径 或 GitHub URL）、落点、分支与治理说明 | 沿用 v2，来源字段双态 |
| Step 4 创建反馈 | 进度：克隆/检出 → 同步 → 登记（GitHub 源先克隆建立主 checkout 再 worktree add，§4.4）；失败分类 + 重试；可取消 | GitHub 源 clone 失败分类（网络/凭据/仓库不存在）新增；凭据走系统凭据管理器，失败提示可改走本地仓源 |
| Step 5 加载 | IDE 切换到新 worktree | 沿用 v2 |

**两源语义差别（产品面口径）**：

- 本地仓库源：适用「研发机已有主 checkout / 已有克隆」场景——认领优先（已是 worktree 绝不重复 add，design-v2 §2.5），新建走主 checkout worktree add。
- GitHub 链接源：适用「全新机器 / 没有本地仓」场景——克隆建立主 checkout（注册为主 checkout）→ 自动 worktree add；主 checkout 已存在时与本地仓源同路径（注册点主键去重，§4.4）。
- 两源终点一致：都收敛为「受管项目 worktree + 注册点登记 + LINKED-* 状态」，后续日常与 PR 流（design-v2 §2.6）零差别。

**npm 门禁触达**（design-v2 §2.4 沿用）：`hasNpmFileDeps` 标记仓拒绝自动建立，阻塞提示 + 手动评估指引，两源同规。

### 2.6 TriModel 模型与 key 就绪体验

**产品口径**：用户看到的是「模型就绪清单」，不是裸 key。key 是配置资产，只呈现就绪态/缺失态，绝不回显值（与现有 key-cache S2 加密缓存面一致）。

| 呈现 | 内容 | 来源 |
| --- | --- | --- |
| 模型清单卡 | 可用模型名 + provider 标记 + default_model 高亮，N 个可用 | TriModel `/v1/models`（经 TriLC 中转，TriLC 是 TriPilot 模型发现统一路径） |
| key 就绪态 | 每 provider 一行：已就绪（绿）/ 缺失（红 + 「配置指引」）/ 刷新中 | TriModel `/v1/config/keys`（就绪态判定，不回显值） |
| 刷新动作 | 「重新拉取」按钮 / chat 内「刷新模型」 | `/v1/config/keys/refresh`（admin-only 面） |

**失败分类（产品面可见口径，技术面判定 §5.2）**：

| 失败类别 | 用户提示 | 行为 |
| --- | --- | --- |
| 网络不可达（TriModel 3333 无监听） | 「模型服务未响应」+ 重试 | 重试 + 降级继续，key 可后补，不阻塞 |
| 认证失败（安装态 .env/token 问题） | 「模型服务认证失败」+ 配置指引 | **阻塞提示**（唯一阻塞类）——认证是安装态配置问题，需修复后才能拿 key |
| 条目缺失 | 「<provider> 条目待补」逐 provider 标 | 逐 provider 降级，缺的标「待补」，不阻塞开业 |
| 缓存损坏/权限 | 「本地 key 缓存异常，正在重建」 | 自动重建，无感 |

**非阻塞判断**：模型/key 就绪是 SYNC 前触点，但**除认证失败外不阻塞**公司开张与项目 worktree 建立——员工开业依赖员工配置、不依赖模型 key；开工后模型调用失败会自然暴露并给出同类诊断。理由：CEO 流程 ③ 把「从 TriModel 拿模型和 key」列为初始化步骤之一，但初始化本体是公司面 + 项目面；模型面做成可见步骤 + 非硬阻塞（认证失败除外），符合「零强制」原则且不掩盖真实失败（失败时卡上红字明确「开工后调用会失败」）。「key 就绪态」作为五维同步的 key 维与协同确认卡的输入（§5.2 决策）。

### 2.7 五维配置同步 TriMC 的可见性

**产品口径（CEO 语义）**：TriMC 不是开箱即用，而是**初始化后同步过去**。产品文案统一为：「TriMC 同步 = 把本机初始化结果推送到服务域主控，让 TriMC 获得与你一致的配置」（推模式 = §6.1）。

**逐维进度呈现**（三态：未同步 / 同步中 / 已同步 ✓；单维失败标红 + 重试）：

| 维 | 同步内容（用户可见描述） | 用户判断点 |
| --- | --- | --- |
| 模型 | 模型清单与路由配置 | 模型名与数量与 TriModel 一致 |
| key | key 就绪态（不含裸值；仅同步已就绪条目，缺失标「待补」） | TriMC 侧 key 可用性 ✓/✗ |
| 员工 | 已开业员工名单（role + 名字） | 员工数与开业名单一致 |
| 公司 | CEO 名 + 开张状态 | 公司开张信息一致 |
| 项目 | project key、repoUrl、worktree 路径 | 与项目工作区一致 |

**失败姿态（用户可见）**：本地初始化完成不因同步失败回滚——「本地可用先营业」；同步未达时协同确认卡呈「未就绪」态 + 提示重试（§6.8）。单维失败呈现该维红标 + 上次尝试时间 + 重试入口，其余维正常显示已同步。

### 2.8 协同确认卡（CONFIRM）

**产品口径**：「协同 = 研发仓 + TriCade(TriLC) + TriMC 操作同一个项目」。验证口径 = 三方同源比对，不信声明（§7.1）；**确认以 TriMC 同步成功为前提**（§6.8）——同步未达时确认卡呈「未就绪」，提示先完成同步。

| 端 | 展示证据 | 比对元素 |
| --- | --- | --- |
| 研发仓 | 主 checkout 的仓库地址 | repoUrl（git remote origin） |
| TriCade(TriLC) | 项目注册点 active 项目 + worktree 路径 | project key + worktree 路径 |
| TriMC | 五维同步落盘的 project 维 | project key + repoUrl + worktree 路径 |

**交互**：证据卡展示三元素一致性（路径用哈希/短指纹防截断，§7.2）→ 用户确认「开启协同」→ 成功后协同状态持久化，面板切换为「协同中」常驻徽标，周平面平移测试可触发（READY）。**不一致时**：确认卡红色差异提示 + 诊断入口（重新登记 / 重新同步），列出哪端、什么元素、期望值 vs 实际值。

**验收口径（产品面）**：三元素一致 + 用户一次确认完成，即协同开启成功；技术面协议级验证口径见 §七。

### 2.9 周平面平移测试 = 第一个协同工作（READY）

**产品口径**：平移测试不再是孤立的技术验收动作，而是**协同开启后的第一个协同工作**——三端共同执行、结果三端可见（§8.1 新口径）。产品面呈现为「协同后的第一项任务」：

1. **任务卡**：「周工作平面平移测试」——把周平面（公司轨 operating-records）平移作为真实业务动作执行（W34 → W35 周目录切换），验证研发面 / 项目 worktree 面 / TriMC 三面读同一周平面；发起端 = TriCade 或 trilc chat 任一入口。
2. **三端参与呈现**：TriCade 面板显示测试进度；trilc chat 可对话跟进；TriMC 侧状态同步可见（五维同步链路自然承载）。
3. **结果呈现**：通过 → 「平移测试通过」卡（三面可见周平面迁移生效）；失败 → 结果报告（哪一步、什么错误）+ 挂后续树，不阻塞日常使用。

**与 08-16 迁移验收的衔接**：原「部署旧版本 + 行为不变」独立验收事件被初始化验收吸收（初始化自检段 = 原验收第一段，§8.1）；升级 install 切换断点维持不变。**排期取舍报 CEO 裁决**（§8.4）：本设计产品面倾向——08-16 维持旧口径验收（已部署旧版本行为不变，验证回滚安全），初始化实施后增量验收平移测试（验证协同）；两次验收互不替代。触发语义按 §8.2 条款（自然触发/显式触发）。

### 2.10 MVP 定义与验证指标（产品面剪裁）

**MVP 边界**：单机全流程走通——一个用户、一台机器、TriMetaverse 单项目（本地仓源优先，GitHub 链接源作为本机已有克隆的等价路径）、最小 5 员工开业、五维同步 TriMC、协同确认、平移测试通过。**不在 MVP**：多项目关注模型（design-v2 §2.7 已设计，多项目出现后验收）、PR 治理流（design-v2 树 P4）、多用户同机、GitHub 源远程认证链路的完整产品化（首版按本地克隆等价路径验收，远程克隆凭据异常挂后续）。

| 编号 | 指标 | 目标 |
| --- | --- | --- |
| I1 | 新装 TriCade 全流程初始化成功率（SELFCHECK→CONFIRM，含失败重试） | ≥ 90% |
| I2 | 首次初始化完成时长（不含克隆网络耗时） | 中位数 ≤ 15 分钟 |
| I3 | 两入口交替使用走通 SELFCHECK→SYNC（§2.3 验收口径） | 实测通过（一次真实旅程交替完成） |
| I4 | 员工开业体验：从岗位目录选出 5 岗 + 起名到骨架装配完成 | ≤ 3 分钟，零命令 |
| I5 | 五维同步可见性：逐维三态呈现且与真源一致（含单维失败重试） | 实测通过（注入一次单维失败验证可见与重试） |
| I6 | 协同确认：三元素一致 + 一次确认开启 | 实测通过（三端字段比对一致） |
| I7 | 周平面平移测试三面走通（= 初始化全链验收 PASS + 平移测试） | 实测通过 |
| I8 | 零命令体验：全程 GUI/对话完成，无 git CLI / 手写配置 | 定性验收 |

### 2.11 产品面风险与升级

| 风险 | 处置 | 升级条件 |
| --- | --- | --- |
| 解冻后 onboarding 变更范围膨胀（从"重开交互面"滑向"重写开张机制"） | §2.4.5 边界声明：交互升级 + 状态机结构化载荷，落点机制沿用；实施树逐项过门禁 | 出现机制层改动需求时升级 CEOChiefOfStaff |
| TriMC 五维同步接收侧为新开发（现无配置平面，§三） | 技术面已定同步协议（§六，git 载体最小集）+ 树 I4；MVP 不因 TriMC 骨架化而裁掉五维同步（CEO 流程 ③ 明确要求） | 接收侧工作量超 MVP 可承载时升级 |
| r19 未解决的 TriPilot 问周面崩构成 SELFCHECK 前置风险 | SELFCHECK 把该问题显式暴露为诊断卡；修复挂实施树前置项 | 修复影响排期裁决时升级 |
| 08-16 迁移验收与新设计实施排期冲突 | §2.9/§8.4：产品面倾向旧口径验收 + 增量验收，报 CEO 裁决 | 无法衔接时升级 CEOChiefOfStaff |
| GitHub 链接源的远程认证/网络失败路径 | 失败分类 + 重试 + 可改走本地仓源；首版远程凭据异常挂后续 | 用户实际依赖远程源而不可用时升级 |
| 两入口并发操作同一阶段 | daemon 状态机单执行体 + 指令串行化（§九护栏）+ 「另一入口操作中」提示 | 并发写冲突实际发生时升级 |
| 协同确认的"同一项目"口径与 TriMC 侧理解不一致 | 技术面已定三元素比对（§7.1），产品面证据卡按协议字段呈现 | 口径无法收敛时联合裁决，仍不行升级 CEOChiefOfStaff |

## 三、现状事实基线（2026-08-14 核查）

| 事实 | 现状 | 来源 |
| --- | --- | --- |
| trilc/tripilot 可用基线 | install-tricade.ps1 三态解析注入 + NSSM AppEnvironmentExtra + 装后自检拉起 schtasks/RegRun 形态 daemon（r19 修复 99594063）；verify-trilc-24h.ps1 稳定测试 | `scripts/install-tricade.ps1` + `scripts/verify-trilc-24h.ps1` + OP |
| 会话 cwd 契约 | TriLC `/v1/tasks/stream` 请求 `body.context.workspaceRoot ?? env.cwd` → session cwd → agent loop `ctx.cwd`（r4 已修下游五读工具跟随） | `TriLC/src/server/app.ts:1983` |
| IDE 侧 workspaceRoot 传递 | TriPilot 已把 `workspaceFolders[0]` 作为 workspaceRoot 传入请求（现役字段，零新字段需求） | `TriPilot/src/extension.ts:6166-6172` |
| onboarding 状态机现状 | TriLC `company/onboarding.ts`：Step1-5 prompt 叙事态（heartbeat 注册 agent 自动推送），进度靠对话历史追踪，**无持久状态机、无端点** | `TriLC/src/company/onboarding.ts` |
| 员工会话初始化器 | TriLC `company/session-initializer.ts`：合同加载 → 五件套装配校验 → 工作目录就绪；TriMC 侧同源实现（互为 fallback）——**本设计不改此契约** | `TriLC/src/company/session-initializer.ts` + `TriMC/src/onboarding/session-initializer.ts` |
| TriModel Phase 1 配置平面 | HTTP 3333：`GET /v1/models`（公开，tmv-* 别名 + capabilities）、`GET /v1/config/keys`（Authorization token）、`POST /v1/config/keys/refresh`（admin-only）；keys 面四条目 deepseek/anthropic/openai/trimetaverse；default_model = tmv-deepseek-v4-pro | `TriModel/src/api/routes.ts` + `keys.ts` |
| TriLC key-cache | 拉取 /v1/config/keys → 落盘（S1 明文 600 / S2 AES-256-GCM）→ 15 分钟刷新带 stagger；离线容忍（过期缓存 7d 内继续用，无缓存且拉取失败 = chat disabled）；安装态已实证拿到完整条目 | `TriLC/src/config/key-cache.ts` + OP 1.49.0 |
| 公司状态文件 | `{dataDir}/company/state.json`：state（uninitialized/onboarding/initialized）+ ceoName + employees + progress；原子写（tmp→rename）；REQ-016 断点续接 / REQ-017 debug reset → uninitialized / REQ-019 开张 baseline commit | `TriLC/src/company/init-state.ts` + `onboarding.ts` |
| 员工合同源 | TriCompany `source-agents/` 13 岗合同（ROLE_CATALOG 同源），contract-resolver 装配；TriLC `GET /internal/v1/agents?scope=company` 已能列出员工（decisionRights/rosterInfo） | `TriLC/src/config/contract-resolver.ts` + `app.ts:978-1037` |
| TriMC 形态 | 服务器 Meta Controller：HTTP agent 面 + cron 域（七端点）；**无模型/key/公司/项目配置平面**；`/hello` 等端点仍用旧模型名 deepseek-v4-pro/flash（与 tmv-* 正典不一致，已知观察）；CEO 口径：非开箱即用，初始化后同步 | `TriMC/src/` + `TriMC/docs/registry/code-state.md` + CEO-20260814-003 |
| 项目注册点 | design-v2 §③ 设计态（`%LOCALAPPDATA%\trilc\project-registry.json`），**未实施**（P1/P2 未建树）——本设计初始化链路包含其建立 | design-v2 §③/§七 |
| 周平面解析 | `weekly-plane-root.ts`：env 显式（existsSync 校验）> 源码态 sibling 发现 > undefined；公司轨只读绝不写入；平移 = 周目录切换（W34 → W35） | `TriLC/src/project/weekly-plane-root.ts` + design-v2 §三 |
| 周平面迁移链（r1-2） | TriMC cron job weekly-plane-shift：周日 23:00 Asia/Singapore 自然触发（run 兜底），五段 ADE 链 fleet 身份执行；两期全真实演练通过（REHEARSAL-20260813-001/002），无痕回退已实证（裸仓 update-ref + 克隆 reset --hard + job 态复位） | OP risks 段 + `TriMC/docs/ops/trimc-cron-plane-shift-runbook.md` |
| 舰队拓扑 | sg-server 5 裸仓 + `/srv/fleet/<repo>` ×5 ff-only 克隆（fleet 单身份）；「本地 push → 裸仓 → fleet pull」双仓闭环已实证 | `docs/execution/server-fleet-m0.md` |
| 排期事实 | R4-RELEASE-MERGE-20260817-001（r4 本地未 push，合并挂迁移验收后）；08-16 23:00 迁移验收原口径（部署旧版本行为不变 + 升级 install 切换）；08-16 为周日（自然触发日） | OP 1.46.0 + design-v2 §五.② |
| 公司面落点现状 | onboarding Step5 装配落点 = workspaceRoot（现 TriMetaverse 研发仓双轨合一）：`.claude/agents/<role>.md` + `docs/registry/company-state.json` + `business-state.md` + `AGENTS.md` | `TriLC/src/company/onboarding.ts` + design-v2 §2.8 |

关键既有契约（本设计延续）：周平面写权单主体（编排层）、TriPilot 零本地执行（W30）、git 身份单一纪律、工作区状态机与 onboarding 状态机分离（design-v2 §2.2）。

## 四、初始化链路架构（技术面）

### 4.1 总体模型：单状态机 + 两入口瘦客户端

**状态机真源 = trilc daemon 侧持久状态机**（初始化状态文件 + 步骤事件流），TriPilot 面板与 trilc chat CLI 两个入口只发指令 + 收 SSE 进度/状态，不本地执行（W30 零本地执行契约同构沿用 design-v2 §五.1）。

初始化状态机（每步可独立失败回退，零强制原则沿用 design-v2）：

```
UNINITIALIZED
  → SELFCHECK（trilc/tripilot 可用 + TriModel 3333 可达 + 服务链自检）
  → ONBOARDING（公司面：开张引导 → CEO 名 → 选员工 → 装配骨架）
  → PROJECT-LINK（项目面：源选择【本地仓 | GitHub 链接】→ worktree 建立/认领 → 注册点登记）
  → SYNC（五维同步 TriMC，§六）
  → CONFIRM（协同确认三方比对，§七）
  → READY（可协同；周平面平移测试 = 第一个协同工作）
```

现状缺口：onboarding.ts Step1-5 是 prompt 叙事态（进度靠对话历史），本设计升级为持久状态机——daemon 侧状态文件（与公司 init-state 同落点，schema 挂实施树）+ 步骤事件流（SSE 事件类型挂实施树），两入口消费同一真源。6.4 会话初始化器（员工级会话契约）零改动。

**状态机载体拆分（公司态 vs 链路进度，本设计新增）**：公司态载体维持现状 `CompanyInitState`（uninitialized → onboarding → initialized，`init-state.ts`）三态不变——公司开张是公司级语义；本设计的链路进度状态机（上列 7 态）是初始化过程态，与公司态分离、独立持久。产品面用户视角阶段（§2.2）与链路状态的映射以技术面为准（产品面引用本表）：

| 产品面用户阶段（§2.2，已对齐） | 链路状态 |
| --- | --- |
| 启动 TriCade / 打开面板 | UNINITIALIZED |
| 安装态自检 | SELFCHECK |
| 公司开张引导 + 公司面初始化 | ONBOARDING |
| 项目面初始化（worktree 向导） | PROJECT-LINK |
| 五维同步 TriMC | SYNC |
| 协同确认卡 | CONFIRM |
| 可协同（平移测试入口） | READY |

### 4.2 自检段（SELFCHECK）

- 检查面：daemon healthz + heartbeat（装后自检既有机制复用）、TriPilot 可用（workspaceFolders 传递链路）、TriModel 3333 可达（§五 key 流前置）、服务链（TriStaciss 8008，端口标准终案）。
- 任一失败：呈现诊断卡 + 重试；不阻塞整体（key 类失败降级继续，§五）。

### 4.3 公司面初始化（ONBOARDING）

- 执行主体：daemon 端点（onboarding 状态机升级后承载），装配动作 = 端点内原子完成（Write 工具链复用或专用装配端点，挂实施树）。
- 装配落点：公司载体仓（现 TriMetaverse 研发仓，双轨合一——design-v2 §2.8 判断沿用；拆仓属中央战略裁决，本设计不裁决）。
- 装配产物：`.claude/agents/<role>.md` + `docs/registry/company-state.json` + `business-state.md` + `AGENTS.md`（现状 Step5 产物不变，升级为端点执行而非模型叙事态）。
- 员工开业结构化选择（产品面 §二 第 4 条）：daemon 状态机支持结构化步骤载荷（岗位目录卡片数据 + 名字输入），TriPilot 渲染卡片、trilc chat 文本化同一状态——**6.4 交互面解冻后的技术改动主体 = daemon 状态机，渲染层两入口各一份**。

### 4.4 项目面初始化（PROJECT-LINK）

worktree 向导 = design-v2 §2.4 五步转正为初始化主流程 + 产品面新增源选择呈现（§2.5 六步：Step 0 项目源选择 → Step 1 清单/链接校验 → Step 2 落点 → Step 3 确认信息卡 → Step 4 创建反馈 → Step 5 加载），技术链路 = design-v2 §五.1 链路五步（检测 → 关联判定 → 认领 → 建立 → 去重），hasNpmFileDeps 门禁与失败回退纪律全部继承。

**新增 GitHub 链接源（CEO 设计输入）**：design-v2 的「换机场景：克隆建立新主 checkout 后再关联」（§六 风险表后续树）升级为第一版初始化选项：

1. 用户提供 GitHub 链接（或项目清单预置 repoUrl，现仅 TriMetaverse）；
2. 校验：URL 与项目仓注册表 repoUrl 比对（防克隆非项目仓）、hasNpmFileDeps 门禁（junction 纪律）；
3. 克隆建立主 checkout（落点：研发仓位或用户位，实施树定；git 凭据走系统凭据管理器，失败分类提示）；
4. 注册为主 checkout（注册点 mainCheckoutPath）→ 自动 `git worktree add`（design-v2 §五.1 第 4 步同构，含落点校验与原子登记）；
5. 主 checkout 已存在时与本地仓源同路径（去重由注册点主键保证）。

**两入口一致性**：TriPilot 面板与 trilc chat CLI 发同一组 daemon 指令（link/claim/init 指令集），收同一 SSE 进度流——入口差异仅在渲染层，状态机与执行体唯一。**端点级验收口径（技术面补充，对应 §2.3 验收口径）**：两入口指令集同构（同一端点同一载荷 schema）；任一入口状态推进后，另一入口读状态文件与事件流得到同一阶段快照（状态文件比对 + 事件序号单调）；验收时两入口交替推进全程，各阶段入口来源与状态快照一致即 PASS。

## 五、TriModel key 流（技术面）

### 5.1 链路现状（可用，沿用）

```
TriLC daemon (key-cache)
  → GET http://127.0.0.1:3333/v1/config/keys  (Authorization: TRIMODEL_API_TOKEN)
  → KeysResponse { keys: {deepseek, openai, trimetaverse}, default_model, refresh_interval_s, expires_at }
  → 落盘 S1 明文 600 / S2 AES-256-GCM（自动迁移）
  → 15 分钟刷新带 stagger；POST /v1/config/keys/refresh admin-only 强制刷新
```

安装态已实证拿到完整三条目；`/v1/models` 供模型清单展示（项目清单/自检段消费）。

### 5.2 初始化时机与失败分类（本设计新增）

初始化链路中的 key 流三个触点：SELFCHECK（可达性探测）→ ONBOARDING 完成前（不依赖）→ SYNC 前（key 就绪态入五维同步）。

| 失败类 | 判定 | 处置 |
| --- | --- | --- |
| 网络不可达（3333 无监听） | 连接拒绝 | 重试 + 降级继续，key 可后补 |
| 认证失败（token 错） | 401/403 | 阻塞提示（安装态 .env/token 问题），初始化暂停待修 |
| 条目缺失（某 provider 无 key） | keys 面缺条目 | 逐 provider 降级：有 key 的用，缺的标「待补」，不阻塞开业 |
| 缓存损坏/权限 | 读失败/校验失败 | 重建缓存，重拉 |

**决策：初始化不因 key 缺失硬阻塞**——员工开业依赖员工配置（装配产物），不依赖模型 key；模型调用是开业后工作。「key 就绪态」（仅就绪/缺失布尔，不显示裸值）进五维同步与协同确认卡（产品面第 5 条对齐）。

## 六、五维配置同步协议（技术面）

### 6.1 方向决策：推模式 + git 载体（TriLC 写面 → TriMC 读面）

- 初始化执行体 = 本地 TriLC daemon（CEO 在场、写权单主体）；TriMC = 服务器被动接收 + 校验。拉模式否决：TriMC 会变成初始化编排方，违背 CEO 口径「TriMC 非开箱即用而是初始化后同步」。
- **载体 = git bundle 链**（复用已实证 fleet 双仓闭环：本地 push → sg-server 裸仓 → fleet ff pull），**不新建 HTTP 接收端点**。理由：零新网络面、零新安全面、零新失败面；commit 历史即审计链；TriMC 侧只需 cron job + 只读 status 端点（最小集）。密钥材料不入 git 由 §6.7 裁决保证（SEC-20260813-001 纪律）。
- TriMC 接收端点缺口（§三 基线：无配置平面）由实施树 I4 以「sync-apply cron job + status 端点」最小集闭合，不再新建配置写入端点。

### 6.2 五维 × 载体

| 维度 | 内容 | 来源（本地真源） |
| --- | --- | --- |
| 模型 | 模型目录 + default_model + provider 链（base_url/端口） | TriModel `/v1/models` + keys 响应 |
| key | **配置面**：provider 列表、base_url、启用模型、key 指纹（SHA-256 前 8 位，不含材料） | TriModel `/v1/config/keys`（§6.7 裁决） |
| 员工 | 开业员工名单（role/name/agentId）+ 合同源 commit（TriCompany HEAD）+ 决策权摘要 | company/state.json + contract-resolver + TriCompany git |
| 公司 | state / companyName / ceoName / onboardedAt | company/state.json |
| 项目 | activeProjectKey + repoUrl + 分支 + worktree 清单 + devHead | project-registry.json + 本地 git |

### 6.3 bundle 落点与 schema

- 落点：项目仓 `docs/registry/init-sync/sync-config.json`（MVP 单项目：TriMetaverse 双轨合一，公司维暂同仓；多项目出现后公司维迁 TriCompany 仓——对应 design-v2 §2.10 拆仓升级项，schema 按维度分段预留迁移）。
- schema：`schemaVersion` + `bundleId`（uuid）+ `generatedAt` + `generatedBy`（trilc-init-<version>@<host-hash>）+ 五维分段载荷（company / model / keys / employees / project）。bundle 生成端 schema 校验**拒绝 api_key 字段**（实现树加测试门禁）。

### 6.4 传输链与 TriMC 应用端

- 传输链：daemon 生成/更新 bundle → 写入项目仓工作树 → commit（git 身份单一纪律，本地 commit 用编排层单身份，OBS-20260814-002 映射）→ push origin + sg-server → 舰队 ff pull。
- **TriMC 应用端（新增最小集，树 I4）**：
  1. cron job `config-sync-apply`（fleet 身份，复用 cron 域服务，周期建议 15min 或迁移 job 前置钩子）：读 `/srv/fleet/TriMetaverse/docs/registry/init-sync/sync-config.json` → 版本比对 → 应用到 `TRIMC_CONFIG_DIR/init-sync/`（applied.json 标记 + 各维度落地文件）→ 内存态热更新（模型 default、员工名单）；
  2. `GET /internal/v1/config/sync/status`（只读：applied bundleId/generatedAt、fleet HEAD、各维度摘要、lastAppliedAt——协同确认 §七 的服务器侧事实源）；
  3. TriMC 模型层 default 读取改为「applied bundle.model.defaultModel 优先，env 兜底」——顺带收敛已知观察「`/hello` 等端点旧模型名 deepseek-v4-pro/flash 与 tmv-* 正典不一致」。

### 6.5 幂等与冲突

- 幂等：bundleId + generatedAt 单调版本。TriMC 应用规则：同 bundleId = no-op；generatedAt 更旧 = 忽略 + 日志；更旧但内容 hash 不同 = 告警（时钟回拨/多机写，MVP 记日志不动作）。重放任意次数结果收敛。
- 冲突：单写主体（初始化流是 bundle 唯一写方，服务器 apply 只读）。TriMC 侧人工改过的服务器配置与 bundle 重叠时 **bundle 赢**（初始化记录为正典），例外：服务器 env 密钥材料（自有材料优先，bundle 只带指纹）。多机初始化（两台用户机开同一公司）为已知升级项（design-v2 §2.10 多用户条款）：applied.json 记录 sourceInstanceId，不匹配则告警 + 挂起。

### 6.6 触发时机

P1 完成（公司维）、P2 完成（项目维）、P3 完成（模型/key 维）各生成一次中间 bundle；P4 统一生成最终 bundle 一次性 commit/push；此后变更触发（员工名单变更、key 轮换、项目切换）→ 重新生成 + push（幂等）。daemon 重启时 re-sync 检查（fleet 侧已 applied 则 no-op）。

### 6.7 key 维同步裁决（不传密钥材料）

同步到 TriMC 的是**密钥配置面 + 指纹**，**不是密钥材料本身**。依据：

1. SEC-20260813-001 纪律（密钥入 git 历史 = 事故）：bundle 走 git 载体，密钥材料入 bundle = 重犯事故形态。
2. 服务器侧密钥现状：TriMC 部署面 env 已配置自有密钥（e2e 实证模型调用可用）；TriMC 用配置面 + 自有材料即可对同一 provider 链工作。**实施树需在服务器侧复核该前提**（部署 env 面实际条目）。
3. 升级项（非 MVP）：若 CEO 要求公司密钥统一托管到服务器（单源计费/轮换），另设 HTTPS 直推端点 + 服务器 S2 加密落盘 + 轮换协议——列入 §九 升级项，不在本设计实施。

### 6.8 失败姿态

本地初始化完成不因同步失败回滚（本地可用先营业）；同步未达 = sync-pending 挂起 + 重试；「协同确认」（§七）以 TriMC 侧 applied 为前提——未 applied 时协同确认卡呈「未就绪」，提示重试，不进入协同态。TriMC HTTP 面不可达时主链不受影响（git 载体不依赖 TriMC HTTP），status 端点不可达按 §七 降级口径。

## 七、协同确认机制（技术面）

### 7.1 验证口径：三方同源比对（不信声明）

**三端定义**：研发仓（本地 dev 主 checkout `D:/Code/ai/TriMetaverse`）、TriCade 端（用户 worktree + TriLC daemon 会话面）、TriMC 端（`/srv/fleet/TriMetaverse` @ dev + agent/cron 面）。

**分层验证**（廉价 → 全量；前两层零新网络面）：

| 层 | 验证内容 | 方法 | 通过标准 |
| --- | --- | --- | --- |
| L1 注册同一性 | 项目身份一致（project key + repoUrl + worktree 路径三元素） | bundle.project.repoUrl ↔ TriMC fleet 仓映射（`/srv/fleet/<repo>` ↔ repoUrl）比对 + 本地注册点 activeProjectKey/worktrees[] | 完全匹配；不匹配 = ERROR（错误仓/错误分支） |
| L2 版本一致 | 三端同 dev 线 | 本地 dev HEAD（daemon 读 git）== bundle.devHead == fleet HEAD（status 端点回报） | 三值相等；不等 = 落后/领先诊断（ff 同步收敛） |
| L3 写读闭环（正向） | 本地写 → 服务器读 | 五维 sync commit 本身即探针：本地 commit → push → fleet pull → TriMC applied bundleId 回读 == 本地 bundleId | applied 回读成功 = 正向链路实证（无需额外探针文件） |
| L4 写读闭环（反向） | 服务器写 → 本地读 | 周平面迁移 commit：TriMC 写 → 裸仓 → 本地 dev/worktree pull 可见 W34→W35 产物 | 首个协同工作验收（§八） |

### 7.2 确认动作与失败分类

1. 确认卡三方显示同一三元素（路径用哈希/短指纹防截断）+ dev HEAD 一致性徽标（L2，实施树产品细节）；任一不一致 → 红色差异提示 + 诊断入口（重新登记/重新同步）。
2. 失败分类：网络不可达（push 失败 → sync-pending 挂起重试）、身份冲突（git 身份纪律违规 → 阻断）、版本滞后（ff 未拉取 → 提示同步）、注册表漂移（幽灵路径 → design-v2 §六 惰性清理）。
3. **降级路径**：TriMC HTTP 面不可达时，L2 的服务器侧事实退化为「本地 push 成功 + 迁移 cron 日志/裸仓 reflog 可见」（人工确认口径），MVP 接受。
4. 全部通过（L1-L3 达、L4 由首个协同工作承载）→ CONFIRM 通过 → READY，周平面平移测试可触发。

## 八、周平面平移测试衔接（技术面）

### 8.1 新口径（CEO 期望流程第 5 步）

初始化全链验收 PASS（SELFCHECK → ONBOARDING → PROJECT-LINK → SYNC → CONFIRM）后，**周平面平移测试 = 第一个协同工作**：平移（W34 → W35 周目录切换）作为真实业务动作执行，验证三面（研发面 / 项目 worktree 面 / TriMC）读同一周平面。迁移（TriMC 写面 → 本地读面）与五维同步（本地写面 → TriMC 读面）互为反向闭环，两者都通过后「三端操作同一项目」完整成立。

原 08-16 23:00「部署旧版本 + 行为不变」独立验收事件被初始化验收吸收——初始化验收的自检段（trilc/tripilot 可用）即原验收的第一段；升级 install 切换断点（design-v2 §五.② 清旧写新一次性切换）维持不变。

### 8.2 与周日自然触发的关系（显式条款，本设计新增）

- r1-2 的自然触发（周日 23:00 cron，08-16 即周日）**保留为稳态节奏**，不拆除不重排——它是生产链，两期演练已实证。
- 「首个协同工作」语义按初始化完成时点认定：**若 init + 五维同步 + L1-L3 确认在 08-16 23:00 前完成 → 周日自然触发即首个协同工作**（真实 W34→W35 平移，非演练）；**若未完成 → 自然触发照常运行**（迁移不依赖初始化，r1-2 现状），首个协同工作 = 协同确认后**显式触发一次** run（复用演练期已验证的手动触发路径），此后回归稳态。
- 与 §8.4 报 CEO 裁决点的关系：本条款是裁决点 ① 的技术实现路径，无论 CEO 裁「旧口径验收」还是「顺延全链验收」，触发语义均按本条款执行——自然触发不阻塞、确认后补一次显式触发。

### 8.3 三端回退与域隔离（本设计新增）

- **三端回退**：演练验证的两端回退（裸仓 update-ref + 克隆 reset --hard + job 态复位）升级为三端——本地 dev/worktree 若已 pull 迁移 commit，回退时同步 ff 复位到回退目标 HEAD（runbook 扩展一项）；「无痕」定义扩展为三端 HEAD + job 态 + 本地读面一致复位。
- **域隔离**：迁移回退**不回退初始化域**——迁移 commit 只触及 operating-records 域；init-sync bundle 在 `docs/registry/init-sync/`（写权归初始化流），两者路径域不重叠（迁移脚本写权边界已限 operating-records，r1-2 现状）。
- 写权纪律延续：迁移全程 TriMC 侧 fleet 单身份（OBS-20260814-002）；本地侧（研发仓/worktree/TriLC）对 operating-records 只读——协同的「分工」= 单主体写 + 多端读。

### 8.4 排期取舍（报 CEO 裁决点）

- R4-RELEASE-MERGE-20260817-001：r4 commit 不回改；merge 排期挂初始化实施树后的发布窗口（初始化验收与 r4 合并同批发布，或初始化先行——实施树定，本设计给两个选项及风险）。
- 原 08-16 23:00 迁移验收：若初始化实施树排期晚于 08-16，原验收按旧口径继续执行（不阻塞）还是顺延至初始化验收（全链一次验收）——**报 CEO 裁决**，本设计倾向：08-16 维持旧口径验收（已部署旧版本行为不变），初始化实施后增量验收平移测试（两次验收互不替代，旧口径验证回滚安全，新口径验证协同）。触发语义按 §8.2 条款执行。

## 九、风险与护栏（技术面）

| 风险 | 缓解 |
| --- | --- |
| GitHub 链接源克隆非项目仓（供应链/治理旁路） | repoUrl 与项目仓注册表白名单比对 + hasNpmFileDeps 门禁；不在白名单拒绝自动流程 |
| 克隆凭据失败/网络 | 系统凭据管理器 + 失败分类提示 + 可改走本地仓源 |
| 初始化状态机与 onboarding 叙事态并存冲突 | 状态机为唯一真源；旧叙事态在实施时下线（同 release 切换，无并存期——design-v2 一次性切换纪律同构） |
| 五维同步泄密（key 材料入 git，SEC-20260813-001 重演） | key 维只同步配置面 + 指纹（§6.7 裁决）；bundle 生成端 schema 校验拒绝 api_key 字段（实现树加测试门禁） |
| 装配动作写权越界（员工面写公司文件） | 装配端点限定落点白名单（.claude/agents + docs/registry），周平面写权单主体不变 |
| 双入口指令竞态（面板与 CLI 同时操作状态机） | daemon 状态机单执行体 + 指令串行化（同一状态机互斥，挂实施树） |
| 原 08-16 验收与新验收口径漂移 | §8.4 报 CEO 裁决 + §8.2 触发条款，两口径各自留痕不互相替代 |
| SELFCHECK 前置缺陷（TriPilot 问周面崩，r19 未完全解决） | SELFCHECK 显式暴露为诊断卡（§4.2）；修复挂实施树 I1 前置项，不静默吞 |
| TriCompany 仓在服务器 fleet 滞后（员工合同源过期） | bundle 员工维携带 sourceCommit；TriMC apply 时校验 fleet TriCompany HEAD，不等则触发 TriCompany fleet pull（与 TriMetaverse 同一 sync-apply 周期） |
| 多机初始化写 bundle（design-v2 §2.10 多用户） | applied.json 记录 sourceInstanceId，不匹配告警挂起；多用户完整方案 = 升级项 |
| TriMC 模型层旧名残留（deepseek-v4-pro/flash） | 同步面收敛：apply 后 default 读 applied bundle（§6.4），旧名残留一并清理列入 I4 树 |
| init-sync 文件与周平面迁移文件域重叠 | 路径域隔离（docs/registry/init-sync/ vs docs/workflow/operating-records/）+ 迁移脚本写权边界已限 operating-records（r1-2 现状） |
| 服务器自有密钥前提不成立（§6.7 依据 2） | 实施树 I4 先在服务器部署面复核 env 密钥现状；不成立则回退为「TriMC 用本地拉取面」或提前启动密钥托管升级项 |

升级项登记（非 MVP，触发时另开树）：① 密钥材料服务器托管（HTTPS 直推 + S2 加密落盘 + 轮换协议）；② 多机初始化仲裁；③ 多项目后公司维 bundle 迁 TriCompany 仓；④ TriMC HTTP 全量同步通道（替代 git 载体候选）。

## 十、实施拆分建议（另建树，本设计不做）

- **树 I1（自检 + 状态机底座）**：SELFCHECK 端点（含 r19 基线确认：daemon 环境继承 + key fetch + chat 冒烟）+ 初始化持久状态机（onboarding.ts 叙事态升级）+ 步骤事件流。依赖：无。前置：CEO 机器 r19 装后状态复验。
- **树 I2（公司面装配升级）**：装配端点（原子完成 + 落点白名单）+ 结构化员工选择载荷 + 会话初始化器 init 模式路由 + 两入口渲染升级（TriPilot 卡片 / trilc chat 文本化）+ 解冻面缺陷修复验证（解冻 ≠ 豁免验证）。依赖：I1。
- **树 I3（项目面 + 注册点）**：worktree 两源链路（本地仓 + GitHub 链接源）+ 向导接入 init 状态机 + project-registry.json 落地（吸收 design-v2 P1+P2）。依赖：design-v2 树 P1 + P2。
- **树 I4（五维同步 + 协同确认）**：bundle schema（生成端拒绝 api_key 字段 + 测试门禁）+ TriLC 生成/commit/push 链 + TriMC sync-apply cron job + status 端点 + 模型层 default 收敛（含旧名残留清理）+ 服务器自有密钥前提复核（§九 对应行）。依赖：I2/I3（bundle 内容源）；实现可与 I2 并行设计。
- **树 I5（协同确认验收 + 首个协同工作）**：L1-L4 校验实现 + 迁移三端回退 runbook 扩展 + 首个协同工作验收执行（§8.2 触发条款）。依赖：I4 + r1-2 迁移链。
- 排期原则：I1 → I2 → I3 → I4 → I5 主线；design-v2 树 P1/P2 是 I3 前置（编排层排期合并考虑）；P3（消费端升级，env 切换）与 P4（项目级治理）维持独立排期；发布窗口与 R4-RELEASE-MERGE 的合并按 §8.4 裁决执行。

## 使用依据

- `TriMetaverse/docs/workflow/operating-records/2026-W34/OP-202608-W34-001.json`（1.49.0：派单 INIT-TO-COLLAB-DESIGN-20260814-001；CEO-20260814-003 五步期望流程；ONBOARDING-FROZEN 解冻登记；TriModel/TriStaciss 定案 A' 接线与端口终案 8008）
- `TriMetaverse/docs/execution/project-workspace-design-v2.md`（v2026.W34.3 最终稿：§2.4 向导五步、§2.9 onboarding 关系、§五.1 链路五步、§③ 注册点、§七 P1-P4）
- `TriLC/src/company/onboarding.ts`（Step1-5 叙事态现状）+ `TriLC/src/company/init-state.ts`（REQ-016 断点续接 / REQ-017 reset / REQ-019 baseline commit）+ `TriLC/src/company/session-initializer.ts`（员工会话契约）
- `TriLC/src/config/key-cache.ts`（S1/S2 落盘、15 分钟刷新、7d 离线容忍）+ `TriLC/src/server/app.ts:1983`（会话 cwd 契约）+ `app.ts:978-1037`（/internal/v1/agents 公司视图）
- `TriModel/src/api/routes.ts` + `keys.ts` + `models.ts`（Phase 1 配置平面：/v1/models、/v1/config/keys 四条目、refresh）
- `TriMC/src/server/app.ts` + `TriMC/src/onboarding/session-initializer.ts` + `TriMC/docs/registry/code-state.md`（接收面现状：无配置平面、cron 域、旧模型名观察）+ `TriMC/docs/ops/trimc-cron-plane-shift-runbook.md`（r1-2 迁移链）
- `TriPilot/src/extension.ts:6166-6172`（workspaceRoot 传递现状）
- `TriMetaverse/docs/execution/server-fleet-m0.md`（5 裸仓 + fleet ×5 克隆、fleet 单身份纪律、双仓闭环）
