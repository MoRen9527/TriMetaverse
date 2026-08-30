# LG-016 定稿：治理记忆索引可移植 + R 面治理记忆接入

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/lg-016-governance-memory-analysis.md
- syncMode: source-only
- lastSyncedAt: 2026-08-30
- 性质：**双席已审·定案 2026-08-30**（初稿 577146f6 → CPO/CTO 双席意见书 → 董事会合成定案 board-verdict-20260830-lg016；本稿为定稿，状态=待实施）
- 排期位次（定案）：件 2/3 本工程窗（件 2 为件 3 前置）；件 1 随下轮联审收口；件 4 随 LG-010；件 5 随周检齿条
- 实勘基线：2026-08-30T13:1xZ（本机 TriCompany/TriRMC 仓 + heyuan SSH 只读侦察；CTO 席实勘 rmc_tick.py 全文 + context-builder/soul-loader/memory-injector 三模块）

---

## 一、治理记忆索引可移植（件 1）

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

### 1.3 索引 schema（定案 v1）

落点：`TriCompany/docs/engineering/governance-memory-index.md`。

每条目字段（定案）：

```markdown
### <DOC-ID> <文档名>
- path: <TriCompany 仓内路径>
- domains: [记录与落盘, 时刻纪律, ...]   ← 十一域词表受控（下方词表）
- platforms: [claude-code, copilot, agent-core, ...]   ← 可选；缺省=全平台（定案④与①过滤联动）
- host-pointers: {claude-code: "...", copilot: "...", agent-core: "...", any: "..."}
- note: <一句话覆盖范围>
```

**域词表（定案④：十一域）**：`时刻纪律 / 记录与落盘（收 D-01/D-06） / 工具选型 / 权限与审批 / git 与裸仓卫生 / daemon 与进程 / 发布与派生 / FADE 协议 / 台账治理 / 角色授权 / 通信与心跳`。

**域治理规则（写入索引头部，定案④）**：域数上限 **12**（超限强制合并审视）；新域**两击准入**——≥2 篇文档可映射方可立域（「记录与落盘」恰过两击规则的先例）。

**宿主指针建议表（索引的消费者契约）**：

| 宿主 | 指针落位 | 机制 |
| --- | --- | --- |
| Claude Code（董事会/助理） | 个人记忆目录指针（一行一条，指 TriCompany path） | 索引 host-pointers.claude-code 列应建指针清单；新会话按索引自检补齐 |
| Copilot 宿主 | `.github/agents/*.agent.md` 正文指引节 | published-copy 渲染面（FADE-002） |
| agent-core（R 面） | context-builder 接入（件 4，归 LG-010 扩词） | LG-010 工程线 |
| 新宿主 | 按本索引自发现：读 index→按 platforms+宿主能力选指针形态 | 索引即注册表，新宿主=新 platforms 键 |

### 1.4 治理与传播

- 索引本身 syncMode=source-only（TriCompany 真源）；个人记忆只留指针行——**指针行的"该建哪些"由索引裁决，索引变更时记忆侧补指针**（修订规则写入索引头部）。
- 新增治理文档的入册动作并入该文档立法流程（FADE-002 或联审收口时同步登记索引）——防再滞后（1.2 盲区教训）。
- 个人记忆索引（MEMORY.md）头部已有一行"记忆治理分工"指针——索引落地后该行升级为指向 governance-memory-index。
- **渲染模板零独立件（定案·CTO-1）**：rmc_tick 直接解析索引 `host-pointers.agent-core` 字段渲染——**索引即模板**，禁止独立渲染模板常驻 rmc_tick.py（否则手抄副本只是上移一层）。

---

## 二、R 面治理记忆接入

### 2.1 现状事实（实勘）

1. **三治理面全盲**（LG-009 缺口矩阵在案）：agent-core 39 ts 零治理文档引用；resolver 仅员工合同 schema；治理责任全在调用方。
2. **heyuan TriCompany clone 在盘但滞后**：`/srv/fleet/TriCompany` dev @ 6a6847e（08-28 时代）；**无自动拉取**（config-sync-apply 的 pull --ff-only 在 sg cron，不覆盖 heyuan；heyuan trirmc cron 引擎在但零注册 job）。
3. **手抄副本现状**（LG-010 现状保障条款）：RFACE_SYSTEM_PROMPT（TriRMC scripts/rmc_tick.py:48）内嵌行为规则，纪律集/协议对 tick 派工的会话不可见。
4. **天然接入锚点在位**（初稿勘出 context-builder/soul-loader；**定案补记 CTO 席实勘**：context-builder 的 `ContextSources/buildContext` 本就是注入 seam 且有现成测试面；`memory-injector` 模块为又一现成锚）：治理注入不必新造通道。
5. R 面执行体**有文件读取工具**（RA-3 自主工程实证）——"按需读盘"在能力上成立。

### 2.2 方案维度（定案合成）

**维度一：接入通道——B 过渡 + A 根治 + C 随长期档（双席一致直接定案）**

| 方案 | 内容 | 窗口 |
| --- | --- | --- |
| A. 加载层补齐（治理平价） | context-builder 组装时按索引读治理文档注入 | **归 LG-010 扩词**（定案③；小贾判定前提：LG-010 现状=入册待工程窗、**未 in-flight** → 扩词路线成立；回归门=context-builder 单测+一条集成断言，治理注入纯增量只读不改现有宿主行为） |
| B. rmc_tick 派工注入 | RFACE_SYSTEM_PROMPT 真源化渲染+注入物 | **本工程窗**（件 3，前置=件 2） |
| C. 合同扩展 | resolver 员工合同 schema 扩治理面 | LG-015 长期档 |

**维度二：注入粒度（定案①）**

- **索引摘要（<1K）+ 三条纪律全文（总预算 ≤2K tokens）**；FADE 协议摘要**不注入**（双席一致：tick 任务契约已由 BRIEF 试卷承载）。
- 三条遴选**按平台过滤**（CTO 平台论）：schema `domains` 预选后按 platforms 取——heyuan Linux R 面（沙箱内无审批面）取 **D-04 时刻 / D-01 落盘 / D-10 git 裸仓**；D-11 审批与 D-12 PowerShell 选型不适用不注入（不照抄 M 面清单）。
- **重裁触发**：R 面执行体若扩为可发起/续接 FADE 流程，本条重开（CPO 风险条款）。

**维度三：更新传播**

1. **读盘即最新原则**：注入点都在"组装时读盘"——零传播机制。
2. **clone 拉取 job（件 2，双席一致：15min cron 同构，不随 tick）**——heyuan trirmc cron 注册 config-sync 同构 job。**实施清单四项（双席并集）**：① safe.directory 核查（clone 属主≠fleet 时 pull 直接拒）② pull job 非零退出+留日志 ③ 失败告警通道 ④ fleet 单身份+sharedRepository 前置核查。ff-only 静默 diverged 风险由件 5 sha1-12 周检兜底（**必要配套，非可选**）。
3. 漂移核对（件 5）：周检增"R 面注入物版本 vs TriCompany 真源版本" sha1-12 比对+违规复发抽样；**注入机器锚（定案·CTO-2）**：tick 台账/BRIEF 记录注入时 TriCompany HEAD sha1-12——漂移比对锚格式由此定。

### 2.3 交付件清单（定案版）

| 件 | 内容 | 归属/排期 |
| --- | --- | --- |
| 1 | governance-memory-index.md v1 立法（§1.2 盘点+§1.3 schema+十一域+platforms） | TriCompany，**下轮联审收口** |
| 2 | heyuan TriCompany clone 自动拉取 job（15min cron 同构+四项实施清单） | R 面基建，**本工程窗（件 3 前置）** |
| 3 | RFACE 真源化渲染+注入（摘要+三纪律全文按 platforms 过滤；实施同窗清点旧手抄条目逐条标注「由注入取代/保留」〔CPO-2〕；验收附 tick BRIEF 注入物存在性断言〔CPO-1〕） | rmc_tick 脚本层，**本工程窗** |
| 4 | 加载层治理平价扩展（context-builder/memory-injector seam；LG-010 扩词） | **LG-010 工程线**；非 tick 通道空窗风险（CPO-3）登记在案，**A 落地即销不得静默挂起** |
| 5 | 周检漂移核对（sha1-12 锚+违规复发抽样） | 周检齿条 |

### 2.4 双席盲区吸收对账（定案五条全落位）

| # | 盲区 | 落位 |
| --- | --- | --- |
| 1 | 注入有效性不得凭能力推定（CPO-1） | 件 3 验收断言+件 5 抽样（§2.3） |
| 2 | B 过渡期双真源冲突（CPO-2） | 件 3 同窗清点旧手抄条目（§2.3） |
| 3 | 非 tick 通道空窗（CPO-3） | 登记在案，A 落地即销（§2.3 件 4） |
| 4 | 渲染模板零独立件（CTO-1） | §1.4 第四条+件 3 实施约束 |
| 5 | 注入机器锚 sha1-12（CTO-2） | §2.2 维度三第 3 条+件 5 锚格式 |
