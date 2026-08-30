# LG-016 分析初稿：治理记忆索引可移植 + R 面治理记忆接入

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/lg-016-governance-memory-analysis.md
- syncMode: source-only
- lastSyncedAt: 2026-08-30
- 性质：董事长助理牵头分析初稿（董事会两项指令合并）→ 待 CPO/CTO 双席审核 → 合成定案 → 排期落地
- 实勘基线：2026-08-30T13:1xZ（本机 TriCompany/TriRMC 仓 + heyuan SSH 只读侦察）

---

## 一、指针映射可移植性——治理记忆索引设计

### 1.1 问题重述

个人记忆降格为指针后（记忆治理分工，2026-08-27 CEO 规则），"哪条记忆指向哪个 TriCompany 文档"的映射只存在于本机 `~/.claude/projects/<proj>/memory/`。宿主迁移/新会话/新员工上岗时，新宿主不知道**该建哪些指针、指向哪里**。

### 1.2 在册治理文档盘点（实勘，索引的原料）

| # | 文档（TriCompany 侧路径） | 覆盖域 | 现行指针载体 |
| --- | --- | --- | --- |
| 1 | `docs/workflow/engineering-disciplines.md` | 工程纪律集 D-01..D-12：落盘/提交卫生（D-01/D-05）/cron state（D-02）/daemon 重启与 dist（D-03 v3）/时刻（D-04）/live entry 派生（D-07）/hook GIT_DIR（D-08）/ps1 BOM（D-09）/裸仓权限（D-10）/审批匹配（D-11）/工具选型 PowerShell 优先（D-12）/周记（D-06） | 本机记忆索引散行+小贾开工前置核查 |
| 2 | `docs/engineering/fade-protocol-spec.md` | FADE 协议本体（十段/试卷/细则 10） | 六源重建 S4a+CLAUDE.md 分权制节 |
| 3 | `docs/engineering/fade-registry.md` | 实例档位/映射表/纸面法清单 | 六源重建 S4b |
| 4 | `docs/workflow/hub-ledger-governance.md` | 台账 schema/状态词表/镜像策略（2026-08-30 件二新立） | 记忆 open-items-ledger 指针 |
| 5 | `docs/project-sources/trimetaverse-claude-md.md` | TriMetaverse CLAUDE.md 真源（分权制节） | published-copy 双条目（FADE-002 manifest） |
| 6 | `docs/project-sources/trimetaverse-agents-md.md` | TriMetaverse AGENTS.md 真源 | 同上 |
| 7 | `tricompany.md`（根） | 监督契约/真源纪律 §3.4 元信息头 | TriMetaverse 根同名副本（in_sync 发布） |
| 8 | `docs/workflow/ceo-chief-of-staff-authorization-matrix.md` + `ceo-chief-of-staff-maintenance-rules.md` | 助理授权边界/维护规则 | 小贾 agent 定义固定前置核查 |
| 9 | `docs/engineering/heartbeat-dualrun-contract.md` | 心跳双跑合同（LG-014 相关） | （暂无指针） |
| 10 | `docs/workflow/project-source-document-sync-ade.md` + `published-copy-refresh-sop.md` | 发布域管线操作面 | FADE-002 条目引用 |

盲区实证：#4/#9 昨日新立，本机记忆索引**尚未建指针**——映射滞后于真源，正是可移植性缺口的最小活体案例。

### 1.3 索引 schema 提案（governance-memory-index.md v1）

落点：`TriCompany/docs/engineering/governance-memory-index.md`（董事会建议落点采纳；独立文件而非并入现有索引——它消费面是**宿主与记忆系统**，与 ROADMAP/STATE 类工程文档受众不同）。

每条目四字段（最小交付，对齐 §2.8 细则 2 最小 schema 思想）：

```markdown
### <DOC-ID> <文档名>
- path: <TriCompany 仓内路径>
- domains: [时刻纪律, 工具选型, ...]   ← 域词表受控（下方词表）
- host-pointers: {claude-code: "...", copilot: "...", agent-core: "...", any: "..."}
- note: <一句话覆盖范围>
```

**域词表（v1 提案，受控扩展）**：`时刻纪律 / 工具选型 / 权限与审批 / git 与裸仓卫生 / daemon 与进程 / 发布与派生 / FADE 协议 / 台账治理 / 角色授权 / 通信与心跳`。

**宿主指针建议表（索引的消费者契约）**：

| 宿主 | 指针落位 | 机制 |
| --- | --- | --- |
| Claude Code（董事会/助理） | 个人记忆目录指针（一行一条，指 TriCompany path） | 索引host-pointers.claude-code 列应建指针清单；新会话按索引自检补齐 |
| Copilot 宿主 | `.github/agents/*.agent.md` 正文指引节 | published-copy 渲染面（FADE-002） |
| agent-core（R 面） | context-builder 接入（见 §二 方案 A） | LG-010 工程线 |
| 新宿主 | 按本索引自发现：读 index→按宿主能力选指针形态 | 索引即注册表，新宿主=新 host-pointers 键 |

### 1.4 治理与传播

- 索引本身 syncMode=source-only（TriCompany 真源）；个人记忆只留指针行——**指针行的"该建哪些"由索引裁决，索引变更时记忆侧补指针**（修订规则写入索引头部）。
- 新增治理文档的入册动作并入该文档立法流程（FADE-002 或联审收口时同步登记索引）——防再滞后（1.2 盲区教训）。
- 个人记忆索引（MEMORY.md）头部已有一行"记忆治理分工"指针——索引落地后该行升级为指向 governance-memory-index。

---

## 二、R 面治理记忆接入方案

### 2.1 现状事实（实勘）

1. **三治理面全盲**（LG-009 缺口矩阵在案）：agent-core 39 ts 零治理文档引用；resolver 仅员工合同 schema；治理责任全在调用方。
2. **heyuan TriCompany clone 在盘但滞后**：`/srv/fleet/TriCompany` dev @ 6a6847e（08-28 时代，落后现役 3e3e3c3 等 ≥2 提交）；**无自动拉取**（config-sync-apply 的 pull --ff-only 在 sg cron，不覆盖 heyuan；heyuan trirmc cron 引擎在但零注册 job）。
3. **手抄副本现状**（LG-010 现状保障条款）：RFACE_SYSTEM_PROMPT（TriRMC scripts/rmc_tick.py:48）内嵌行为规则，纪律集/协议对 tick 派工的会话不可见。
4. **天然接入锚点在位**：TriRMC src 有 `context-builder/` 与 `soul-loader/` 模块（08-25 起）——上下文组装与角色装载已有结构位，治理注入不必新造通道。
5. R 面执行体**有文件读取工具**（RA-3 自主工程实证）——"按需读盘"在能力上成立。

### 2.2 方案维度分析

**维度一：接入通道**

| 方案 | 内容 | 优势 | 代价/风险 | 窗口 |
| --- | --- | --- | --- | --- |
| A. 加载层补齐（LG-010 扩展） | loop.ts/context-builder 组装时按 governance-memory-index 读 cwd 可达的治理文档注入（宿主平价扩为治理平价） | 根治；**读盘即最新**（传播零机制）；对齐 CC 宿主行为 | 工程窗实施；上下文成本需粒度控制（维度二） | LG-010 工程线（R 面能力门禁线） |
| B. rmc_tick 派工注入 | RFACE_SYSTEM_PROMPT 手抄副本**真源化**：tick 启动时从 /srv/fleet/TriCompany 渲染（纪律集关键条目+索引摘要注入 BRIEF） | 脚本层可即刻做；覆盖全部 tick 派工会话 | 只覆盖 tick 通道（非 tick 的 R 面会话不覆盖）；tick 需拉 TriCompany（传播件 2.4） | **本工程窗可做** |
| C. 合同扩展 | resolver 员工合同 schema 扩治理面字段 | 最正规 | 最重；LG-015 同线（session-supervisor/context API） | LG-015 长期档 |

**建议路线：B 过渡 + A 根治 + C 随长期档。** B 与 A 不冲突——B 的"真源化渲染"正是 A 落地前的手抄副本清偿，且其渲染产物（索引摘要+关键条目）即 A 的注入内容子集，A 落地后 B 降级为兜底。

**维度二：注入粒度**

- 全量注入：**否**——12 条 D-XX+534 行 spec 全量入上下文，与单次任务相关度低，成本倒挂（三份文档 >20K tokens 量级）。
- **索引摘要+关键条目+按需读盘（建议）**：常驻注入=governance-memory-index 摘要（<1K tokens）+按任务域预选的 1-2 条关键纪律全文；执行体有读文件工具，其余按需读真源（R 面可直达 /srv/fleet/TriCompany）。
- 判据：注入物必须**可指到 TriCompany 真源路径**（可溯源纪律），禁二跳转抄。

**维度三：更新传播**

1. **读盘即最新原则**：A/B 两方案的注入点都在"组装时读盘"——TriCompany 更新落盘后，下个 R 面会话自动消费，**零传播机制**（对比：手抄副本每次更新需人工同步=现状痛点本体）。
2. **clone 滞后缺口**（2.1-2 实证）：heyuan /srv/fleet/TriCompany 需自动拉取——**复用 config-sync-apply 模式**：在 heyuan trirmc cron 注册同款 job（`cd /srv/fleet/TriCompany && git pull --ff-only`，15 分钟级；heyuan TriRMC cli.ts 已有 SYNC_APPLY_PRESET 同构预设可改挂）。这是 B/C 任何方案的前置基建件。
3. 漂移核对：周检加一项"R 面注入物版本 vs TriCompany 真源版本"（sha1-12 比对，recover-brief 的机器校验模式复用）。

### 2.3 交付件清单（待双席审核后定稿）

| 件 | 内容 | 归属 |
| --- | --- | --- |
| 1 | governance-memory-index.md v1 立法（含 §1.2 盘点表+schema+域词表+宿主指针表） | TriCompany，联审收口 |
| 2 | heyuan TriCompany clone 自动拉取 job（config-sync 同构） | R 面基建，本工程窗 |
| 3 | RFACE_SYSTEM_PROMPT 真源化渲染+索引摘要注入（方案 B） | rmc_tick 脚本层，本工程窗 |
| 4 | 加载层治理平价扩展（方案 A，LG-010 条目扩词） | LG-010 工程线 |
| 5 | 周检漂移核对条目 | 登记册齿条 |

### 2.4 待双席裁决点

1. 方案 B 的注入内容边界：仅索引摘要+时刻/审批/裸仓三条高频纪律？还是加 FADE 协议摘要？（CPO 产品视角 vs CTO 成本视角）
2. heyuan clone 拉取频率（15min 同构 vs 随 tick 拉取）与 fleet 单身份纪律适用性。
3. 方案 A 归 LG-010 扩词还是 LG-016 独立条目（台账口径）。
4. 域词表 v1 是否增删。
