# TriCade 实施手册（Implementation Playbook）V0.2

<!-- markdownlint-disable MD040 -->

> **定位**：赛博公司实施步骤标准操作文档。
> **范式**：**运营侧（TriCade 安装版）为第一真源**——周工作源头、数据源头、标准化源头都在运营侧；研发仓从运营侧拉取工作，验证后反推本手册，再进入正式运营。
> **当前实验**：TriMetaverse 项目是第一个实施对象，**从空目录从零开始**，以新项目流程检验标准。
> **状态**：V0.2 草案，待磨人审批。

---

## 〇、范式转变与孵化关系

### 0.1 双仓结构

```text
┌─────────────────────────┐     ┌──────────────────────────────┐
│  研发仓（孵化仓）        │     │  运营仓（数据真源）           │
│  Claude Code / 源码仓    │     │  TriCade 安装版               │
│                         │     │                              │
│  • 源码 + CLI + 文档     │     │  • TriMetaverse-YYYYMMDD 项目 │
│  • 各类探索/实验/历史    │     │  • 独立 git 仓库              │
│  • 冗余文件累积          │     │  • 从空仓逐步完善             │
└───────────┬─────────────┘     └──────────────┬───────────────┘
            │  孵化：标准化/产品化/上线验证      │
            └──────────── 反推 ────────────────→│
            │                                   │
            │  运营数据/需求 ←──────────────────┘
```

- **运营仓**：TriCade 建立 `TriMetaverse-20260805` 项目文件夹 + 工作区 + 独立 git 仓库——独立于源码仓的运营仓

- **从空仓开始**：逐步通过研发仓经验完善运营仓；研发仓的所有探索 = 标准化、产品化、上线验证的过程

- **过滤**：运营仓是研发仓冗余历史文件的过滤器——只有被验证、被标准化的内容才进入运营仓

- **孵化期**：TriCade 工具和 TriCompany 尚不成熟，Claude Code 作为研发仓工具孵化运营仓

### 0.2 成熟路径（孵化 → 自给自足）

阶段1（当前）: Claude Code 研发仓 ──孵化──→ TriCade 运营仓
阶段2:         运营仓代码成熟 → TriLC/TriMC/TriCode 自给自足
阶段3:         不再需要孵化研发仓 → TriCompany 拥有完整功能（运营+开发）
阶段4:         运营驱动开发范式成熟 → TriMC/TriLC 7×24 无人值守公司运营

**目标终态**：TriCompany 自己就是一个完整的公司——运营 + 开发全部内部搞定。新范式（运营驱动开发）在 TriCompany 研发功能完善后自然成立。

### 0.3 核心原则

1. 运营侧是数据真源——周工作平面、经营记录、标准化规则从安装版发起

2. 研发仓是工程验证方——从运营侧拉任务，在自己环境验证，不主动驱动

3. 本手册是"实施标准"——任何成熟的能力，先写入手册，再进 TriCade 供用户使用

4. 运营中遇到的问题 → 提需求给研发 → 研发验证 → 反推手册 → 正式运营（闭环）

5. **全程 ADE 模式**——所有流程（公司开张/雇佣/建项目/分员工/建模块/周平面）经 TriPilot 或 TriLC chat 任一入口，由 agent 引导，按 ADE（Agent → CLI → Agent）标准化严格执行，保证每次执行模板化一致

---

## 一、安装与初始化（ADE 引导）

### 1.1 MSI 安装

| 步骤 | 动作 | 说明 |
| --- | --- | --- |
| 1 | 双击 `TriCade-YYYY.MM.DD.N-windows.msi` | 标准 WiX 安装 |
| 2 | 选择安装路径 | 默认 `C:\Program Files\TriCade\`（工具名，项目无关） |
| 3 | 选择快捷方式 | 桌面 ☐ / 任务栏 ☐（可选，默认桌面） |
| 4 | 完成 | `trilc daemon` 自动注册，`/healthz` 健康检查 |

### 1.2 首次启动：公司开张（自动触发 Onboarding）

**触发机制**：TriCade 安装 → daemon 启动 → **heartbeat 检测 TriCompany 初始化状态**：

```text
状态机: UNINITIALIZED → ONBOARDING → INITIALIZED
检测: 公司骨架缺失（registry/ 无公司状态 / .claude/agents/ 无员工 / 无公司注册表）
  → UNINITIALIZED → agent 自动推送 onboarding（无需用户发起命令）
```

**Onboarding 流程（agent 自动推送，逐步骤）**：

```text
Agent（默认 agent）自动开始:
  Step 1: 跟 CEO 打招呼
         "欢迎使用 TriCade。检测到公司尚未开张，我来引导您开张赛博公司。"
  Step 2: 问 CEO 名字
         "请问您的名字？（您将是公司的 CEO）"
  Step 3: 提供岗位列表（标准岗位目录）
         请选择要启用的岗位（最小配置建议 5 个）：
         [1] CEOChiefOfStaff 总助     [2] FullStackDeveloper 开发
         [3] ChiefAdministrativeOfficer 行政官  [4] ChiefHumanResourcesOfficer 人力官
         [5] ChiefTechnologyOfficer 技术官    [6] ChiefProductOfficer 产品官
         ...（完整岗位目录）
  Step 4: CEO 选择岗位 + 为每个员工起名
  Step 5: 装配公司骨架（治理结构 + registry + 周工作平面 + 员工上岗）
CLI: tricompany init --ceo <名字> --employees <岗位:名字,...>
Agent: 验证骨架完整性 → 报告 → 状态 INITIALIZED
```

**关键原则**：

- **岗位是标准资产**（来自 TriCompany source-agents 岗位目录），**名字是用户资产**（由 CEO 起名，不预设研发仓名字）
- 开张由系统自动触发，用户零命令——TriCade 检测到未初始化即主动引导

**最小员工推荐配置（5 人起步，含治理角色）**：

| 角色 | 职责 |
| --- | --- |
| CEO（人类） | 决策、审批（名字由用户定） |
| CEOChiefOfStaff | 幕僚长、周工作平面、协调 |
| FullStackDeveloper | 执行开发 |
| ChiefAdministrativeOfficer | **行政管理、秘书处、制度流程** |
| ChiefHumanResourcesOfficer | **员工上岗、治理流程、岗位职责** |

> 无 CAO/CHO 则上岗和治理流程走不全——最小配置必须包含。

### 1.3 雇佣批注（增量上岗）

```text
trilc employee hire --role chief-technology-officer --name 小狄
trilc employee list
```

- 装配目标：**仅 `.claude/agents/`**（TriLC 属于类 Claude Code工具）

- 五件套：agent / soul / memory / colleagues / social

- 上岗记录写入公司 registry

- **部门领导上岗后**：由领导写该岗位员工职责（基于当前运营情况和任务）——如小狄上岗后，小全的岗位职责由 CTO 根据运营情况撰写更新

### 1.4 安装初始化默认 agent 的审核机制

- 负责安装/初始化的默认 agent（trilc/tripilot 默认 agent）与 CEO 一起**审核和优化**安装、初始化、标准装配的内容和质量。运营过程产生的问题，通过流程反馈给研发侧，研发侧验证成熟后反推本手册，形成闭环。

- **新项目同样遵从新项目流程和审核**——TriMetaverse 虽有研发仓做参考数据，也必须走新项目流程（这正是过滤、标准化、产品化的检验）

---

## 二、项目创建（ADE 引导）

### 2.1 创建项目

```text
Agent: "创建项目。"
  Step 1: 项目名称 [TriMetaverse]
  Step 2: 项目工作区路径 [TriMetaverse-20260805]
  Step 3: 创建独立 git 仓库（运营仓）
CLI: tricompany project create --name TriMetaverse --dir TriMetaverse-20260805 --git init
Agent: 验证 → 装配项目标配（§三）
```

**项目 = 运营租户**：独立标配结构、周工作平面、经营记录、git 仓库。多项目互不干扰，成本收益按项目核算。

### 2.2 模块创建

```text
Agent: "创建模块。"
  Step 1: 模块名称 [TriLC]
  Step 2: 模块类型 ○ 工具 ○ 业务 ○ 平台
CLI: tricompany module create --project TriMetaverse --name TriLC
Agent: 验证 → 装配模块标配（§三）
```

先建最少模块跑通链路，后期增量加入。模块成熟（研发验证 → 写入手册）可被其他项目复用。

### 2.3 为项目分配员工（模块创建之后）

```text
Agent: "为项目分配员工。"
  Step 1: 从公司在职员工中选择进入本项目的人员
  Step 2: 确认项目人力配置
CLI: tricompany project assign --project TriMetaverse --employees 小贾,小全,小行,小源
Agent: 验证 → 更新项目 registry + 员工项目绑定
```

- **步骤位置**：公司开张 → 雇佣员工 → 创建项目 → 创建模块 → **为项目分配员工** → 运营

- **增量扩展**：随着项目模块增多，可增量分配更多员工进项目

---

## 三、标配结构装配

### 3.1 项目中央标配

| # | 资产 | 说明 |
| --- | --- | --- |
| 1 | `AGENTS.md` | **固定入口**——作用等同其他宿主的 CLAUDE.md/AGENT.md |
| 2 | 十件套 | README + AGENTS + docs/product + docs/engineering + docs/registry + docs/workflow + docs/execution + docs/training + .gitignore + CodeGraph |
| 3 | 治理规则 | 项目治理规则（含项目级术语表）+ 中央 registry 三层（business/product/code） |
| 4 | 仓库治理规则 | 分支策略、PR 模板、commit 规范、发布纪律 |
| 5 | 白皮书 | 项目愿景蓝图，用可读性强的散文解释"做什么、为什么做"，面向广大受众（如中本聪的比特币白皮书、Vitalik 的以太坊白皮书），产品愿景/商业模式（Grill Me skill 逐步完善） |
| 6 | 黄皮书 | 正式的技术规范，包含大量数学符号和形式化定义，面向开发者和研究人员——典型是以太坊黄皮书，由 Gavin Wood 博士撰写，精确定义了 EVM。 |
| 7 | 模块说明 | 模块边界、吸收链规则 |
| 8 | 数据真源资产 | 源侧 → 宿主侧的产物流水线（原"发布资产/消费资产"改名） |
| 9 | 周工作平面 | 当前周目录 + OP JSON（ADE 方式创建） |

### 3.2 模块标配（十件套）

| # | 构成件 | 说明 |
| --- | --- | --- |
| 1 | `README.md` | 模块入口、定位、目标用户 |
| 2 | `AGENTS.md` | Agent 委派入口 |
| 3 | `docs/product/` | PROJECT / REQUIREMENTS / ROADMAP / STATE |
| 4 | `docs/engineering/` | DESIGN / ROADMAP / STATE + 专项设计 |
| 5 | `docs/registry/` | business-state / product-state / code-state |
| 6 | `docs/workflow/` | 流程协议、经营记录、模板 |
| 7 | `docs/execution/` | 执行计划、阶段总结、验证证据 |
| 8 | `docs/training/` | 培训课程、实验手册 |
| 9 | `.gitignore` | 仓库级忽略规则 |
| 10 | CodeGraph | 本地索引 + 忽略规则 |

### 3.3 治理体系归属（术语表分层）

| 内容 | 归属 |
| --- | --- |
| **项目级术语表** | 项目治理规则（应当设计占位文档模板，随项目发展由用户根据实际情况填写） |
| **公司级术语表** | 公司治理规则（应当设计占位文档模板，随公司发展由用户根据实际情况填写） |
| 代码规范 / 设计规范 / 专有名词 | 中央治理体系（按层级归属：项目级进项目治理，公司级进公司治理，应当有通用的规范和行业规则包含在特定目录下的文件中。） |

### 3.4 装配检测（幂等）

```text
装配前检测: .claude/ 或 docs/ 已存在?
  → 已存在: 跳过对应资产, 报告缺失项
  → 不存在: 全量装配
```

TriPilot 与 TriLC 使用同一套模板（`@tricompany/core`），避免重复冗余创建。

---

## 四、运营循环（核心闭环）

```text
TriCade 运营侧
   │
   ├─ ① 运营中发现缺口/问题（功能缺失/bug/流程不顺/标准不明）
   ▼
  ② 提需求给研发侧（当周工作平面任务）
   │
   ▼
  ③ 研发侧验证（自己环境开发+测试+验证成熟）
   │
   ▼
  ④ 反推本手册（增加标准实施步骤, 黄皮书 YP-v* 审核）
   │
   ▼
  ⑤ TriCade 正式运营（按新标准执行, 进入下一轮循环）
```

| 环节 | 责任方 | 动作 |
| --- | --- | --- |
| 发现缺口 | 运营侧（用户/daemon） | 记录到当周工作平面 |
| 提出需求 | 小贾（幕僚长） | 评估 → 路由给研发对应角色 |
| 开发验证 | 研发侧 | 在自己环境实现 + 测试 |
| 反推手册 | 研发侧 | 验证成熟 → 更新本手册 |
| 采用运营 | 运营侧 | 按手册新标准执行 |

---

## 五、周工作流（ADE 方式创建）

### 5.1 周工作平面（第一真源，ADE 执行）

```text
周日 00:00 cron 触发（TriLC）
  Agent（小贾）: "执行周度平移。"
  CLI: weekly-plane shift --from <本周>
  Agent: 验证新周目录 + carry-over 平移 → 报告
```

- **ADE 模式**：Agent plans → Deterministic CLI executes → Agent closes——保证周平面创建/平移的确定性和准确性

- 任务从 TriCade 周平面发起，研发仓拉取同步

- 新开发任务进当周任务树（跟随真实 ISO 周历，不单开周）

- carry-over 4w 预警 / 8w 升级

### 5.2 CLI 规格

```text
weekly-plane shift [--from <week>] [--dry-run]
```

---

## 六、模块引入流程（研发成熟 → 运营采用）

| 步骤 | 动作 | 产出 |
| --- | --- | --- |
| 1 | 研发侧模块成熟 | 十件套齐全 + 测试通过 |
| 2 | 验证 | 干净环境安装/升级测试 |
| 3 | 反推本手册 | 模块实施步骤写入对应章节 |
| 4 | 发布 | CI 构建新版 MSI/ZIP |
| 5 | 运营采用 | TriCade 用户按手册步骤引入模块 |
| 6 | 复盘 | 运营反馈 → 回到步骤 1 |

**模块成熟度门槛**：

- [ ] 十件套完整

- [ ] 测试通过（单元 + 集成）

- [ ] 干净环境验证

- [ ] 手册有实施步骤

- [ ] 黄皮书审核通过（如有规则变更）

---

## 七、TriMetaverse 第一个实验（从零开始）

**原则：从空目录逐步完善，全部走新项目流程**——不沿用研发仓的"已完成"标记，而是通过标准流程重新走一遍，检验标准的完备性，同时过滤研发仓冗余。

| 阶段 | 动作 | 验证点 |
| --- | --- | --- |
| ① 安装初始化 | 从空目录按 §一 执行 | MSI 安装 + 向导 + 默认 agent 审核 |
| ② 公司开张 | 按 §一.2 执行 | 最小员工（含 CAO/CHO）骨架 |
| ③ 创建项目 | 按 §二.1 执行 | 独立运营仓 + 标配装配 |
| ④ 创建模块 | 按 §二.2 执行 | 模块十件套装配 |
| ⑤ 分配员工 | 按 §二.3 执行 | 项目人力配置 + 增量扩展 |
| ⑥ 运营 | 按 §四 执行 | 运营循环闭环 |
| ⑦ 周工作流 | 按 §五 执行 | 周末 00:00 cron 自动迁移 |

**TriMetaverse 虽是首个实验且有研发仓参考，仍走新项目全流程**——参考数据可用，但标准步骤必须完整执行。

### 7.1 实验日志（2026-08-05，第一轮）

| # | 验证项 | 结果 | 发现 |
| --- | --- | --- | --- |
| 1 | 运营仓创建（空 git 仓） | ✅ | TriMetaverse-20260805 独立仓库 |
| 2 | REQ-001 onboarding agent 自动注册 | ✅ | daemon 检测 UNINITIALIZED → 注册 company-onboarding agent（60s 轮询） |
| 3 | agent 自主启动 + 行动 | ✅ | agent 自动运行 bash 检查工作区（目录/company-state.json/AGENTS.md） |
| 4 | 多步引导流程 | ❌ | **BUG-001 阻断**：agent-runner 只收集 content_delta/assistant_message，tool_use/tool_result 事件被丢弃 → agent 无工具反馈 → 引导停半路 |
| 5 | CEO 触达通道 | ❌ | onboarding 消息在后台 session，CEO 无界面可见——需主动推送/通知通道 |

**反推需求**：

| ID | 需求 | 状态 |
| --- | --- | --- |
| `REQ-20260805-004` | agent-runner 处理 tool_use/tool_result 事件（持久化 tool 消息，agent 可见工具反馈）——修 BUG-001 根因 | open — 研发侧 |
| `REQ-20260805-005` | onboarding 引导消息主动推送/通知通道（TriPilot 通知或待办列表，CEO 可见） | open — 研发侧 |
| `REQ-20260805-006` | heartbeat agent tier 启用真实工具权限（Read/Write/Edit/Bash），使多步引导可执行 | open — 研发侧 |
| `REQ-20260805-007` | **MSI 需包含 VSCodium 壳**——TriCade 完整形态 = VSCodium + TriPilot + trilc daemon 一体化。目录治理时漏打包 VSCodium 壳，导致安装版无桌面入口。修复：build 流水线把 VSCodium 模块（dist zip）纳入 staging + WiX 打包 | open — 研发侧 |
| `REQ-20260805-008` | **vsce 打包去 --no-dependencies**——TriPilot vsix 缺 node_modules（diff 等）导致激活失败。正式修复：build-tricade.yml 打包含依赖 | open — 研发侧 |
| `REQ-20260805-009` | **壳品牌化**——VSCodium 重命名 tricade.exe + product.json 九字段定制（applicationName/win32DirName→%APPDATA%\TriCade）+ 剔除 sst-dev.opencode。dev 版已具 TriCade 身份，标准化产出品牌化 zip | open — 研发侧 |
| `REQ-20260805-010` | **MSI 预装扩展**——快捷方式 `tricade.exe --extensions-dir [INSTALLFOLDER]extensions`，扩展留 MSI 层与壳解耦 | open — 研发侧 |
| `REQ-20260805-011` | **TriPilot onboarding 触达（part 2）**——TriLC 新增 `GET /internal/v1/company/state` + TriPilot 30s 轮询显示开张通知 → resume onboarding 会话（part 1 CLI auto-resume 已实现） | open — 研发侧 |
| `REQ-20260805-012` | **TriPilot 向导修正**——移除 Step2 API key 输入（现走 trilc-direct 零 key），改为本地连接确认；Step3 TriMC 连接降为可跳过 | open — 研发侧 |
| `REQ-20260805-013` | **onboarding 会话 systemPrompt 继承**——chat resume onboarding session 时，send 需携带该 session 的 systemPrompt（onboarding 引导），否则通用助手把 CEO 回复当闲聊。实测：回复"磨人"（CEO 名字）被解释为成语。修复：resume 时 fetch session 的 systemPrompt → /v1/messages 带 system 字段 | ✅ 验证通过（2026-08-06）agent 已意识到初始化流程。遗留：工具 cwd 错误 → REQ-014b |
| `REQ-20260806-014b` | **agent 工具执行 cwd 错误**——onboarding agent 的 bash/工具用 daemon cwd（System32）而非 onboarding 工作区（运营仓）。实测 agent 检查 `C:\Windows\System32\.claude\agents\`（错），应检查 `D:\OneDrive\Code\ai\TriMetaverse-20260805`。修复：agent 工具执行传入 workspaceRoot（onboarding systemPrompt 已声明工作区） | open — 研发侧 |
| `REQ-20260806-015` | **TUI /exit 退出花屏**——退出后屏幕残留对话内容（历史遗留）。修复：退出时清屏/恢复终端状态 | open — 研发侧 |
| `REQ-20260806-020` | **完整 ADE 五段闭环**（CEO 裁决）——周平面迁移补齐：① event 触发（已实现 cron）② agent plan skill（tri-weekly-shift 规划 skill）③ cli 执行（已实现 weekly_plane_shift）④ agent close（review_shift 验证 + 8w 升级清单）⑤ cli 最终落地（shift-ade 操作记录 + notify 邮件 + **TriPilot/trilc chat 推送迁移完成消息**）| open — 研发侧（①-④已实现，⑤推送待补） |
| `REQ-20260806-021` | **TriPilot/trilc chat 迁移完成推送**——周平面迁移成功后，TriLC 向接入的 TriPilot 与 trilc chat 客户端推送"迁移完成"消息（TriLC 新增通知端点 + 客户端拉取/显示）| open — 研发侧 |
| `REQ-20260806-022` | **TriGateway 定位更正**——双向通信通道层（管理者↔agent 对话 + agent 推送，对齐 OpenClaw channel 模型），非获客/拉新；邮件为单向通知归 TriCompany notify（OpenClaw 通道列表无 email）| open — 研发侧/CPO registry 回填 |
| `REQ-20260806-018` | **PID 生命周期修复**——daemon 自登记 PID（run/start/schtasks 全入口一致）+ 退出自清理 + stop 端口兜底 + start 占用者验证。✅ 已验证：前台 run 自登记清理 + PID 缺失端口兜底（"stopped via port lookup"） | ✅ 验证通过（TriLC f1f50b0） |

---

## 八、扩展与维护

- **扩展方式**：任何新能力 → 研发验证成熟 → 按 §六 反推本手册

- **版本管理**：手册变更走黄皮书审核（YP-v*），重大变更需 CEO 审批

- **关联资产**：

  - 白皮书：`tmv-whitepaper.md`

  - 黄皮书：`docs/workflow/review-release-chain.md`

  - 双轨方案：`docs/execution/v0.9.x-dual-track-tricompany-plan.md`

  - 周平面 SOP：`docs/workflow/weekly-plane-shift-sop.md`

- **发布载体**：随 `@tricompany/core` 发布，作为 TriCade 安装标配

### 开发需求登记（TriCade 运营中发现的补足 → 提需求给研发侧）

| ID | 需求 | 来源 | 状态 |
| --- | --- | --- | --- |
| `REQ-20260805-001` | TriLC heartbeat 检测 TriCompany 初始化状态（UNINITIALIZED/ONBOARDING/INITIALIZED），未初始化时 agent 自动推送 onboarding（打招呼→问 CEO 名字→岗位列表→启用员工→装配骨架） | 运营实验 §1.2 | open — 排研发侧 |
| `REQ-20260805-002` | 员工上岗时名字由用户定义，岗位为标准目录（不预设研发仓命名） | 运营实验 §1.2 | open — 排研发侧 |
| `REQ-20260805-003` | tricompany CLI（init / employee hire / project create / module create / project assign） | 运营实验 §二 | open — 排研发侧 |

---

## 附录 A：术语表（分层）

### 公司级术语表（进公司治理规则）

| 术语 | 定义 |
| --- | --- |
| 运营侧 | TriCade 安装版（生产环境），数据真源 |
| 研发侧 | 孵化仓（Claude Code工具/源码），工程验证方 |
| 运营仓 | 独立 git 仓库的运营项目（如 TriMetaverse-20260805） |
| 雇佣批注 | 员工增量上岗机制（五件套装配到 .claude/agents/） |
| ADE | Agent → Deterministic CLI → Agent（模板化执行模式） |
| 数据真源资产 | 源侧 → 宿主侧的产物流水线 |

### 项目级术语表（进项目治理规则）

| 术语 | 定义 |
| --- | --- |
| 十件套 | 模块标配文档集（README/AGENTS/docs×6/.gitignore/CodeGraph） |
| 白皮书 | 项目产品愿景/商业模式 |
| 黄皮书 | 技术描述（YP-v* 审核版本） |
| 周工作平面 | 项目周任务树（ISO 周历对齐，ADE 创建） |

---

## 附录 B：ADE 执行清单（所有流程通用）

```text

1. Agent plans:

   - 读取当前状态（registry / 现有结构）

   - 规划步骤序列

2. Deterministic CLI executes:

   - 每步执行固定 CLI 命令

   - 每步自检（输出可验证）

3. Agent closes:

   - 验证结果完整性

   - 报告 + 更新 registry
```

保证：**执行多少次，结果都是同一模板**。
