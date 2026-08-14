# 初始化到协同设计（INIT-TO-COLLAB-DESIGN-20260814-001）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/init-to-collab-design.md
- syncMode: source-only
- lastSyncedAt: 2026-08-14

> 版本：v2026.W34.1
> 日期：2026-08-14
> 状态：联合设计进行中（产品面小乔 × 技术面小狄；技术面已落，产品面待合成）
> 修正记录：（暂无，首版）
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

## 二、产品面：用户旅程与交互设计（小乔，待合成）

> （占位：小乔产品面骨架已对齐——全流程用户旅程 / 两入口一致性 / worktree 向导交互 / 员工开业结构化选择 / 五维同步可见性，合成时填充本节。）

## 三、现状事实基线（2026-08-14 核查）

| 事实 | 现状 | 来源 |
| --- | --- | --- |
| trilc/tripilot 可用基线 | install-tricade.ps1 三态解析注入 + NSSM AppEnvironmentExtra + 装后自检拉起 schtasks/RegRun 形态 daemon（r19 修复 99594063）；verify-trilc-24h.ps1 稳定测试 | `scripts/install-tricade.ps1` + `scripts/verify-trilc-24h.ps1` + OP |
| 会话 cwd 契约 | TriLC `/v1/tasks/stream` 请求 `body.context.workspaceRoot ?? env.cwd` → session cwd → agent loop `ctx.cwd`（r4 已修下游五读工具跟随） | `TriLC/src/server/app.ts:1983` |
| IDE 侧 workspaceRoot 传递 | TriPilot 已把 `workspaceFolders[0]` 作为 workspaceRoot 传入请求（现役字段，零新字段需求） | `TriPilot/src/extension.ts:6166-6172` |
| onboarding 状态机现状 | TriLC `company/onboarding.ts`：Step1-5 prompt 叙事态（heartbeat 注册 agent 自动推送），进度靠对话历史追踪，**无持久状态机、无端点** | `TriLC/src/company/onboarding.ts` |
| 员工会话初始化器 | TriLC `company/session-initializer.ts`：合同加载 → 五件套装配校验 → 工作目录就绪；TriMC 侧同源实现（互为 fallback）——**本设计不改此契约** | `TriLC/src/company/session-initializer.ts` + `TriMC/src/onboarding/session-initializer.ts` |
| TriModel Phase 1 配置平面 | HTTP 3333：`GET /v1/models`（公开）、`GET /v1/config/keys`（Authorization token）、`POST /v1/config/keys/refresh`（admin-only）；keys 面三条目 deepseek/openai/trimetaverse；default_model = tmv-deepseek-v4-pro | `TriModel/src/api/routes.ts` + `keys.ts` |
| TriLC key-cache | 拉取 /v1/config/keys → 落盘（S1 明文 600 / S2 AES-256-GCM）→ 15 分钟刷新带 stagger；安装态已实证拿到完整三条目 | `TriLC/src/config/key-cache.ts` + OP 1.49.0 |
| TriMC 形态 | 服务器 Meta Controller：`src/server/app.ts` HTTP 面 + agent-loop + onboarding/session-initializer（同源）；**无现成五维配置接收端点**；CEO 口径：非开箱即用，初始化后同步 | `TriMC/src/` + CEO-20260814-003 |
| 项目注册点 | design-v2 §③ 设计态（`%LOCALAPPDATA%\trilc\project-registry.json`），**未实施**（P1/P2 未建树）——本设计初始化链路包含其建立 | design-v2 §③/§七 |
| 周平面解析 | `weekly-plane-root.ts`：env 显式（existsSync 校验）> 源码态 sibling 发现 > undefined；公司轨只读绝不写入；平移 = 周目录切换（W34 → W35） | `TriLC/src/project/weekly-plane-root.ts` + design-v2 §三 |
| 排期事实 | R4-RELEASE-MERGE-20260817-001（r4 本地未 push，合并挂迁移验收后）；08-16 23:00 迁移验收原口径（部署旧版本行为不变 + 升级 install 切换） | OP 1.46.0 + design-v2 §五.② |
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

### 4.2 自检段（SELFCHECK）

- 检查面：daemon healthz + heartbeat（装后自检既有机制复用）、TriPilot 可用（workspaceFolders 传递链路）、TriModel 3333 可达（§五 key 流前置）、服务链（TriStaciss 8008，端口标准终案）。
- 任一失败：呈现诊断卡 + 重试；不阻塞整体（key 类失败降级继续，§五）。

### 4.3 公司面初始化（ONBOARDING）

- 执行主体：daemon 端点（onboarding 状态机升级后承载），装配动作 = 端点内原子完成（Write 工具链复用或专用装配端点，挂实施树）。
- 装配落点：公司载体仓（现 TriMetaverse 研发仓，双轨合一——design-v2 §2.8 判断沿用；拆仓属中央战略裁决，本设计不裁决）。
- 装配产物：`.claude/agents/<role>.md` + `docs/registry/company-state.json` + `business-state.md` + `AGENTS.md`（现状 Step5 产物不变，升级为端点执行而非模型叙事态）。
- 员工开业结构化选择（产品面 §二 第 4 条）：daemon 状态机支持结构化步骤载荷（岗位目录卡片数据 + 名字输入），TriPilot 渲染卡片、trilc chat 文本化同一状态——**6.4 交互面解冻后的技术改动主体 = daemon 状态机，渲染层两入口各一份**。

### 4.4 项目面初始化（PROJECT-LINK）

worktree 向导 = design-v2 §2.4 五步（Step 0 项目清单 → Step 1 落点 → Step 2 确认 → Step 3 创建反馈 → Step 4 加载）转正为初始化主流程，技术链路 = design-v2 §五.1 链路五步（检测 → 关联判定 → 认领 → 建立 → 去重），hasNpmFileDeps 门禁与失败回退纪律全部继承。

**新增 GitHub 链接源（CEO 设计输入）**：design-v2 的「换机场景：克隆建立新主 checkout 后再关联」（§六 风险表后续树）升级为第一版初始化选项：

1. 用户提供 GitHub 链接（或项目清单预置 repoUrl，现仅 TriMetaverse）；
2. 校验：URL 与项目仓注册表 repoUrl 比对（防克隆非项目仓）、hasNpmFileDeps 门禁（junction 纪律）；
3. 克隆建立主 checkout（落点：研发仓位或用户位，实施树定；git 凭据走系统凭据管理器，失败分类提示）；
4. 注册为主 checkout（注册点 mainCheckoutPath）→ 自动 `git worktree add`（design-v2 §五.1 第 4 步同构，含落点校验与原子登记）；
5. 主 checkout 已存在时与本地仓源同路径（去重由注册点主键保证）。

**两入口一致性**：TriPilot 面板与 trilc chat CLI 发同一组 daemon 指令（link/claim/init 指令集），收同一 SSE 进度流——入口差异仅在渲染层，状态机与执行体唯一。

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

### 6.1 方向决策：推模式（TriLC → TriMC）

- 初始化执行体 = 本地 TriLC daemon（CEO 在场、写权单主体）；TriMC = 服务器被动接收 + 校验。
- 拉模式否决：TriMC 会变成初始化编排方，违背 CEO 口径「TriMC 非开箱即用而是初始化后同步」。

### 6.2 协议草案（端点新增，挂实施树定契约）

- 端点：TriMC 新增配置同步面（如 `POST /internal/v1/sync/config`，本地 network 面同构 discipline），载荷 = 五维快照 + 版本号。
- 幂等：快照全量覆盖 + 版本单调递增，重复同步无害。
- 重试：失败重试队列（daemon 侧），确认卡显示「未同步/同步中/已同步」三态。

| 维度 | 载荷 | TriMC 侧落点（草案） |
| --- | --- | --- |
| 模型 | 模型注册表（/v1/models 快照 + default_model） | TriMC config（模型清单） |
| key | provider key 密文（S2 加密面；仅同步已就绪条目，缺失条目标待补） | TriMC config（同构缓存 + S2） |
| 员工 | 员工名单（role + 名字）+ 合同指针 | TriMC contracts/roster（同源 v2 合同面） |
| 公司 | CEO 名 + 开张状态 + 公司状态文件指纹 | TriMC company-state |
| 项目 | project key + repoUrl + mainCheckoutPath + worktrees[] | TriMC 项目注册表面 |

### 6.3 失败姿态

本地初始化完成不因同步失败回滚（本地可用先营业）；「协同确认」（§七）以 TriMC 同步成功为前提——同步未达时协同确认卡呈「未就绪」，提示重试，不进入协同态。

## 七、协同确认机制（技术面）

### 7.1 验证口径：三方同源比对（不信声明）

**三元素一致即确认协同就绪**：project key + repoUrl（git remote origin）+ worktree 路径。

| 侧 | 数据源 | 比对元素 |
| --- | --- | --- |
| 研发仓 | git remote origin（主 checkout）+ 注册表 repoUrl | repoUrl |
| TriCade(TriLC) | project-registry.json（activeProjectKey + worktrees[].path）+ 会话 workspaceRoot | project key + worktree 路径 |
| TriMC | 五维同步落盘的 project 维（§六） | project key + repoUrl + worktree 路径 |

### 7.2 确认动作

1. 五维同步响应携带 TriMC 侧一致性校验结果（同步即校验）；
2. 确认卡三方显示同一三元素（路径用哈希/短指纹防截断）；任一元素不一致 → 确认卡红色差异提示 + 诊断入口（重新登记/重新同步）；
3. 全部一致 → CONFIRM 通过 → READY，周平面平移测试可触发。

## 八、周平面平移测试衔接（技术面）

### 8.1 新口径（CEO 期望流程第 5 步）

初始化全链验收 PASS（SELFCHECK → ONBOARDING → PROJECT-LINK → SYNC → CONFIRM）后，**周平面平移测试 = 第一个协同工作**：平移（W34 → W35 周目录切换）作为真实业务动作执行，验证三面（研发面 / 项目 worktree 面 / TriMC）读同一周平面。

原 08-16 23:00「部署旧版本 + 行为不变」独立验收事件被初始化验收吸收——初始化验收的自检段（trilc/tripilot 可用）即原验收的第一段；升级 install 切换断点（design-v2 §五.② 清旧写新一次性切换）维持不变。

### 8.2 排期取舍（报 CEO 裁决点）

- R4-RELEASE-MERGE-20260817-001：r4 commit 不回改；merge 排期挂初始化实施树后的发布窗口（初始化验收与 r4 合并同批发布，或初始化先行——实施树定，本设计给两个选项及风险）。
- 原 08-16 23:00 迁移验收：若初始化实施树排期晚于 08-16，原验收按旧口径继续执行（不阻塞）还是顺延至初始化验收（全链一次验收）——**报 CEO 裁决**，本设计倾向：08-16 维持旧口径验收（已部署旧版本行为不变），初始化实施后增量验收平移测试（两次验收互不替代，旧口径验证回滚安全，新口径验证协同）。

## 九、风险与护栏（技术面）

| 风险 | 缓解 |
| --- | --- |
| GitHub 链接源克隆非项目仓（供应链/治理旁路） | repoUrl 与项目仓注册表白名单比对 + hasNpmFileDeps 门禁；不在白名单拒绝自动流程 |
| 克隆凭据失败/网络 | 系统凭据管理器 + 失败分类提示 + 可改走本地仓源 |
| 初始化状态机与 onboarding 叙事态并存冲突 | 状态机为唯一真源；旧叙事态在实施时下线（同 release 切换，无并存期——design-v2 一次性切换纪律同构） |
| 五维同步泄密（key 明文入 TriMC） | key 维仅同步 S2 密文面（或仅就绪布尔 + 密钥由 TriModel 面统一分发，实施树定）；TriMC 侧落盘同构 S2 |
| 装配动作写权越界（员工面写公司文件） | 装配端点限定落点白名单（.claude/agents + docs/registry），周平面写权单主体不变 |
| 双入口指令竞态（面板与 CLI 同时操作状态机） | daemon 状态机单执行体 + 指令串行化（同一状态机互斥，挂实施树） |
| 原 08-16 验收与新验收口径漂移 | §八.2 报 CEO 裁决，两口径各自留痕不互相替代 |

## 十、实施拆分建议（另建树，本设计不做）

- **树 I1（自检 + 状态机底座）**：SELFCHECK 端点 + 初始化持久状态机（onboarding.ts 叙事态升级）+ 步骤事件流。
- **树 I2（公司面装配升级）**：装配端点（原子完成 + 落点白名单）+ 结构化员工选择载荷 + 两入口渲染升级（TriPilot 卡片 / trilc chat 文本化）。
- **树 I3（项目面 + 注册点）**：worktree 两源链路（本地仓 + GitHub 链接源）+ project-registry.json 落地（吸收 design-v2 P1+P2）。
- **树 I4（五维同步 + 协同确认）**：TriMC 同步接收端点 + 推同步（重试队列）+ 三态确认卡 + 三方比对。
- **树 I5（平移测试 runbook）**：初始化全链验收清单 + 平移测试 runbook（W34→W35 平移 + 三面一致性验证）。
- 与 design-v2 树关系：I3 吸收 P1（识别与认领）+ P2（建立与注入）；P3（消费端升级，env 切换）与 P4（项目级治理）维持独立排期，发布窗口与 R4-RELEASE-MERGE 的合并按 §八.2 裁决执行。

## 使用依据

- `TriMetaverse/docs/workflow/operating-records/2026-W34/OP-202608-W34-001.json`（1.49.0：派单 INIT-TO-COLLAB-DESIGN-20260814-001；CEO-20260814-003 五步期望流程；ONBOARDING-FROZEN 解冻登记；TriModel/TriStaciss 定案 A' 接线与端口终案 8008）
- `TriMetaverse/docs/execution/project-workspace-design-v2.md`（v2026.W34.3 最终稿：§2.4 向导五步、§2.9 onboarding 关系、§五.1 链路五步、§③ 注册点、§七 P1-P4）
- `TriLC/src/company/onboarding.ts`（Step1-5 叙事态现状）+ `TriLC/src/company/session-initializer.ts`（员工会话契约）
- `TriLC/src/config/key-cache.ts`（S1/S2 落盘、15 分钟刷新）+ `TriLC/src/server/app.ts:1983`（会话 cwd 契约）
- `TriModel/src/api/routes.ts` + `keys.ts`（Phase 1 配置平面：/v1/models、/v1/config/keys、refresh）
- `TriMC/src/server/app.ts` + `TriMC/src/onboarding/session-initializer.ts`（接收面现状）
- `TriPilot/src/extension.ts:6166-6172`（workspaceRoot 传递现状）
