# TriMMC 宿主驱动面设计文档（草案）

## 文档元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/mmc-host-driver-design-draft.md
- syncMode: source-only
- 文档版本: **v0.1-draft**
- lastSyncedAt: 2026-08-24
- 状态: `draft —— quadmig-1 树 Q1-1 节点产出（CTO 小狄设计线）；待评审升版，未经 APPROVE 不得作为实施依据`
- 树挂接: `docs/workflow/operating-records/2026-W35/trees/quadmig-1-mmc-shell/tree-op.json` 节点 Q1-1
- 授权来源: quad-migration-spec.md v1.0 §四 Phase 1 DoD①（CEO 2026-08-24 签发）

## 0. 文档定位与红线声明

### 0.1 定位

本文档回答一个问题：**TriMMC 作为"驱动 claude code（下称 CC）在 fleet 工作的壳"，壳与宿主的边界画在哪里、壳自己长什么样**。它是 Phase 1 DoD① 交付物，后续 FullStack 实施派工以本文为技术真源起点。

设计对象只有壳的**驱动面**：触发、拉起、回收、比对、落盘。CC 内部发生什么（会话、loop、上下文压缩）全部是宿主原生能力，壳不感知、不复刻、不兜底——这是白皮书 §3.1 元虚拟层定义的直接翻译（"元虚拟不自建会话管理与执行内核……只负责两件事：把员工定义经 FADE 发布线灌入宿主，以及把实验成果落盘到元认知仓"）。

### 0.2 三条红线（违反任意一条即为设计缺陷）

| # | 红线 | 来源 |
| --- | --- | --- |
| R1 | 不自建会话管理 / loop / 上下文（用宿主原生能力） | 白皮书 §3.1；spec §四 Phase 1"明确不做" |
| R2 | 不动现役 cron 生产链路（确定性五段链保持生产主路径） | spec §四 Phase 1"明确不做"；§5.1 终态收敛 |
| R3 | 不改兼容面任何一项（trimc.service、TRIMC_CONFIG_DIR、/srv/fleet/*、remotes、healthz 8710 等，全量清单见 spec §三.5） | spec §三.5 |

### 0.3 命名纪律

本文遵守 alias 单一真源（CompanyGovernanceRegistry §模块命名权威对照表，as-of 2026-08-24）：操作命令语境只出现兼容面旧名；叙事名首现括注。文中 `trimc` 均指兼容面物理标识符，TriMMC 均指叙事名。

### 0.4 输入材料与证据基线

1. `quad-migration-spec.md` v1.0（已签发）——范围、红线、§八分身生命周期十条、§九桥梁定案
2. `TriCompany/docs/engineering/claude-code-spawn-resume-context-innovation-record.md` V1.0.1——CC 2.1.88 spawn/resume/context 机制实证（file:line 证据链在册）
3. `TriMC/src/cron/command-handler.ts` + `week-math.ts`——现役 scheduler adapter 肌肉记忆
4. 白皮书 v1.0 §3.1 + 附录 B 词条（FADE / TriMMC / TriMLC）
5. `.shift-ade.json` 实样（W35，五段结构在册）+ 治理 registry execute 默认策略

已知缺口：`reference/claude-code-2.1.88/` 源码快照当前不在本地工作区（Glob 实证无此目录）。创新记录的 file:line 证据以记录本身为准引用；实施前如需复核宿主行为，需恢复快照或以现役 CC 版本重新锚定（见 §七 Q-02）。

---

## 一、架构总览

### 1.1 组件边界图

```
┌────────────────────────── sg-server（兼容面物理机，冻结） ──────────────────────────┐
│                                                                                     │
│  ┌─ 触发面（P1a 零持久变更，见 §5.2） ─┐                                            │
│  │  ssh 触发 / CI scheduled job        │                                            │
│  └──────────────┬──────────────────────┘                                            │
│                 ▼                                                                    │
│  ┌─────────── TriMMC 壳进程（确定性代码，零 LLM） ─────────────────────────────┐    │
│  │  mmc-shell CLI:                                                              │    │
│  │   ① 组装 brief + 校验 FADE 渲染位锚点                                        │    │
│  │   ② spawn CC 会话（runuser 降级 + detached 进程组）                          │    │
│  │   ③ timeout 守护 + stdout/stderr 捕获                                        │    │
│  │   ④ per-run 日志落盘                                                         │    │
│  │   ⑤ 调比对器（独立确定性脚本）                                                │    │
│  └───────┬──────────────────────────────────────────────────┬─────────────────┘    │
│          ▼                                                  │                      │
│  ┌─ CC 会话（宿主原生能力域，壳不进入） ──────────┐         │                      │
│  │  cwd=/srv/fleet/TriMetaverse（fleet 克隆）      │         │                      │
│  │  加载 .claude/agents/（FADE 渲染位）             │         │                      │
│  │  主会话 → Agent tool spawn 执行分身              │         │                      │
│  │  产物：[shadow] 工件 + EXPER_ASSET draft        │         │                      │
│  └───────┬────────────────────────────────────────┘         │                      │
│          ▼                                                  ▼                      │
│  /srv/fleet/TriMetaverse 内 shadow 分支           $TRIMC_CONFIG_DIR/cron/logs/     │
│   （shadow-root + experience/staging/）            mmc-shadow__<stamp>.log (0600)  │
│                                                                                     │
│  ┌─ 现役生产主路径（R2 红线：零触碰） ─────────────────────────────────────────┐    │
│  │  trimc.service 内置 cron → 确定性五段链（python3.8）→ dev 分支周平面         │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────────┘
          │ git push shadow/experience 分支（唯一回写通道）
          ▼
  元认知仓（TriMetaverse origin）：shadow 分支 → PR（三门 CI 挂载点）→ dev 合入 = confirmed 晋级路径
```

### 1.2 进程/会话边界表

| 层 | 进程/会话 | 智能来源 | 寿命 | 壳的责任边界 |
| --- | --- | --- | --- | --- |
| 触发面 | ssh / CI runner | 无 | 单次触发 | 只发起，不驻留 |
| TriMMC 壳 | node 进程（trimc bin 子命令或独立 CLI） | **零 LLM，纯确定性代码** | ≤ timeoutMs | spawn/守护/日志/回收 |
| CC 主会话 | claude code headless 进程 | 宿主 LLM | 单次任务完即退 | 无（壳只在进程级守护） |
| 执行分身 | CC Agent tool spawn（subagent_type 指定） | 宿主 LLM | 随树生灭（§八） | 无 |
| 比对器 | python3.8 确定性脚本 | 无 | 单次运行 | 壳负责调用，不实现 |

关键边界判断：**LLM 只存在于被拉起的宿主会话内；壳本体不含任何模型调用**。壳的全部智能上限 = 参数组装与错误传播。这使壳的可信级别与现役确定性五段链同级，是影子结果可信的前提。

### 1.3 端到端链路（五跳）

1. **触发**：周日白天窗口（§5.3），触发面以 fleet 用户身份 ssh 至 sg-server 执行壳 CLI。
2. **壳拉起 CC 会话**：壳校验 FADE 渲染位锚点（§3.3）→ 组装 brief（任务指令 + 读盘三件指针 + 影子隔离约束）→ `runuser -u fleet --` 降级启动 CC 非交互会话，cwd=`/srv/fleet/TriMetaverse`，detached 进程组（肌肉记忆：command-handler.ts L82-99）。
3. **CC 在 fleet 克隆内工作**：主会话加载仓内 `.claude/agents/` 渲染位获得员工定义，按需 spawn 执行分身；执行周迁移五段的 agent 化版本（§5.2），全程限定 dry 模式与 shadow-root。
4. **产物落盘**：过程工件写 shadow-root，经验资产写 `experience/staging/`（§四）；git 提交至 `shadow/experience` 分支并 push。
5. **成果回写**：壳回收退出码与日志 → 调比对器产出 `[shadow]` 比对报告 → 周报按"主路径 X，影子对照 Y"口径消费（spec §四影子写入隔离）。

### 1.4 壳的模块组成（复用现役肌肉记忆）

| 模块 | 职责 | 复用来源 |
| --- | --- | --- |
| payload 契约 | `{command, cwd, timeoutMs, runAs}` 四字段语义原样继承 | command-handler.ts L19-26 |
| token 替换 | `{fromWeek}/{toWeek}/{startDate}` ISO 周算术 | week-math.ts L58-78（纯函数，直接复用） |
| 降级执行 | `runuser -u fleet --` + `HOME=/home/fleet` 覆盖 | command-handler.ts L82-95 |
| 超时守护 | detached 进程组 SIGKILL（bash→cc→git 整组死亡） | command-handler.ts L96-99, L147-160 |
| 日志落盘 | `{jobId}__{runStamp}.log`、mode 0600、error tail 1000 字符 | command-handler.ts L104-122 |
| 比对器 | 逐字段 diff（§5.4） | 新建，python3.8 与主路径同栈 |

---

## 二、宿主生命周期管理

### 2.1 机制对照：为什么壳必须是 spawn-only

创新记录实证结论（file:line 证据在其 §5 清单）直接决定壳侧策略：

| CC 机制 | 实证结论 | 对壳的含义 |
| --- | --- | --- |
| SendMessage → resume | 从 transcript 全量恢复，仅过滤三类残缺消息，**无压缩**（resumeAgent.ts:63-74） | 壳侧**禁用 resume 类续接**；每次派工 fresh start |
| Agent tool spawn | subagent_type 指定时近零上下文起步（AgentTool.tsx:86；员工 frontmatter 未写 model → 继承会话模型） | 壳的 brief 走 spawn 路径，1M 窗口留给当前任务 |
| fork 类 | 继承父会话当前占用（forkSubagent.ts:51-52, :65） | 演练主会话保持轻载，避免 fork 子代带包袱 |
| auto-compact | 阈值 ≈967K、有损、连败 3 次熔断、BQ 生产实锤大量发生（autoCompact.ts:28-49, :62-91, :67-70） | 不依赖 compact 兜底；靠任务粒度控制（§2.4）让 compact 永不触发 |
| 缓存经济 | 满窗 resume 输入 ≈$10/次且压缩致缓存全 miss | spawn-only 同时是成本纪律 |

### 2.2 壳侧会话策略

1. **一次演练 = 一个 CC headless 会话 = 一个进程寿命**。会话结束即释放，不存在"常驻命名 agent"。这与创新记录公司化改进点 2（spawn-per-task）同构，只是承载者从编排层换成壳。
2. **禁止事项**：壳不使用 `--resume` / `--continue` / SendMessage 回拉历史会话；失败重试 = 新 spawn + 读盘接续（§2.3）。spec §八 T1（释放=禁复活）在壳语境下的直译：**上次演练的会话对本次演练不可见**。
3. **brief 注入而非定义修改**：壳传给 CC 的是任务指令（brief），不碰 `.claude/agents/` 渲染位内容——员工定义只经 FADE 发布线变更（§三）。

### 2.3 接续协议：读盘三件（T3 直译）

演练中断或分身替换时，接续方（新 spawn 的分身或下一次演练）的认知重建只依赖磁盘三件：

1. **checkpoint**：clone-dispatch protocol §4.3 结构化断点；
2. **brief**：壳组装的任务指令（幂等，随 per-run 日志归档）；
3. **git log**：shadow 分支提交历史（artifactCommit 序列）。

**禁 transcript 摘要注入**（spec §八条件 7 原文）：摘要跨节点累积即 resume 低配版，有损不可校验。不够时扩 checkpoint schema，默认不加。

### 2.4 爆窗处置：拆节点不续命

- 预警阈值沿用 clone-dispatch §4.1：工具 ≥50 次 / 轮次 ≥10 / token ≥100K。壳从 per-run 日志读取用量尾迹（CC 输出的 usage 段），越限即在下一轮拆分。
- 处置 = 以最后 artifactCommit 为界回收产物，新 spawn 自 resumePoint 接续；**爆掉的会话 transcript 只归档复盘，永不回灌**（spec §八条件 8）。
- 设计含义：周迁移演练的 brief 必须写成**可分段结构**（五段各自可独立成节点，见 §5.2），而不是一整块叙事任务。

### 2.5 与 §八分身生命周期的衔接

- 演练树适用分身机制（spec §8.4：drill 树同样一树一批、关树不变量）；壳作为编排层之外的第二个 spawn 发起方，其 spawn 动作**必须登记进同一 CHO 审计 json 底座**，不得形成编制外分身暗面。
- C-level 常驻治理角色不经壳 spawn（§8.1 适用范围排除项）；壳只承载执行分身。

---

## 三、FADE 灌入面

### 3.1 员工定义资产结构（现状实态）

源侧单一真源位于 `TriCompany/source-agents/<role>/`，每员工一组：

- 五件套：`<role>.soul.md`（身份气质）/ `.memory.md` / `.colleagues.md` / `.social.md`（认知层契约，只定义写入边界与落点）/ `contract.yaml`（工具合同）
- 渲染入口：`<role>.agent.md` + `*.agent.md` 渲染片段
- 阶段事实：`.github/binding-profiles/<role>.json`（live 入口、support payload、宿主阶段事实）——**不在源侧五件套内固化**

### 3.2 发布线流向（合同单源方向）

```
TriCompany/source-agents/<role>/（合同/五件套，唯一可编辑真源）
        │  统一发布管线渲染（--host=claude / copilot 双宿主位；人工编辑禁改渲染产物）
        ▼
TriMetaverse/.claude/agents/*.md（Claude Code 渲染位）+ .github/agents/*.agent.md（Copilot 位）
        │  git 分发（fleet 克隆 pull 即灌入）
        ▼
/srv/fleet/TriMetaverse/.claude/agents/ ← CC 会话启动时原生加载 = 灌入生效点
```

方向判断：**灌入是"合同 → 渲染位"的单向流，fleet 侧永远是 published copy**。与 CLAUDE.md 真源序一致（source wins；frozen source stale 时报告而不静默覆盖）。白皮书 FADE 词条的"经 FADE 发布线灌入宿主"在本阶段的工程含义即此三条箭头，ADE 十段生命周期规范见 `TriCompany/docs/engineering/ade-pattern-spec.md`（本文引用不复制）。

### 3.3 fleet 侧灌入路径与版本锚定

1. **加载机制**：CC 以 `/srv/fleet/TriMetaverse` 为 cwd 启动时自动加载仓内 `.claude/agents/`——无需壳做任何注入动作，壳只保证前提成立。
2. **锚点校验（壳的新增职责）**：spawn 前校验 fleet 克隆的渲染位新鲜度——比对 fleet HEAD 与 origin dev 渲染位路径的 commit 是否一致，不一致则中止并报 `[shadow] stale-agents`，防止分身带着过期人格上场。校验本身是 git 比较，零 LLM。
3. **binding-profiles 联动**：哪个入口 live、support payload 指向谁，由 binding-profiles 决定；壳不解读其内容，只要求其随仓分发到位（同一锚点校验覆盖）。

### 3.4 壳在灌入面的角色边界

壳**不渲染、不修改、不缓存**员工定义。三者分别归：发布管线（渲染）、源侧合同（修改）、git 分发（缓存面）。壳的唯一动作是 §3.3 的锚点校验。这条边界防止壳演化成"第二发布线"——那将是第二真源。

---

## 四、成果落盘面

### 4.1 两区分性：过程隔离 vs 入库资格

| 区 | 承载物 | 制度闸门 | 落点 |
| --- | --- | --- | --- |
| 影子过程区（shadow-root） | `[shadow]*` 前缀工件、dry `.shift-ade.json`、per-run 日志副本、checkpoint | 影子写入隔离三规则（spec §四；Q1-2 编排层搭建） | fleet 克隆内独立 operating-root，`shadow/experience` 分支 |
| experience 区（§9.1 目录约定） | EXPER_ASSET 经验资产 | 三门（L1 格式 / L2 验证 / L3 签收） | `experience/staging/`，同分支 |

两条制度串联（spec §9.5）：影子隔离管**产出资格**，三门管**入库资格**。`[shadow]` 前缀 → staging 分区 = 输出隔离延伸为准入隔离。

### 4.2 写入协议（FullStack 实施契约）

1. **分区硬约束**：CC 会话的一切写操作限定在 shadow-root 与 `experience/staging/` 两个路径前缀内；brief 中显式声明，越界写 = 该次演练判 failed（壳按 diff 审计，非自觉）。
2. **前缀规则**：一切产物文件名带 `[shadow]` 前缀；EXPER_ASSET 的 `metadata.shadow=true` + `status=draft` 双标记。
3. **staging-only**：影子期产出**永不直写 `confirmed/`**；未过 §5.6 判据不得晋级（spec §9.5）。R 侧消费面默认只读 confirmed/。
4. **append-only 状态机**：`draft → validated → consumed / deprecated`；修正走新版本 + 旧条 deprecated 标注（spec §9.3）。
5. **分支与晋级路径**：全部落 `shadow/experience` 分支；staging → confirmed 的唯一通道 = **PR 合入 dev**（编排层发起），三门 CI 校验挂载在 PR 上——格式门机械可查（schema/溯源字段/securityLevel）、验证门查 evidence commit 可达性、签收门按域路由 owner。PR 即审计链，revert 即回滚。

### 4.3 EXPER_ASSET 最小字段约定

继承 handoff-objects envelope 骨架（spec §9.3 原文为准）：`objectType / objectId / status / ownerRole / evidence / payload / metadata`。本设计追加两条壳侧强制项：

- `producer` 必填 = `treeId / nodeId / OP 条目引用`，`evidence.commit` 必填——无溯源无入库资格，由 L1 门 CI 机械拒绝；
- narrative 自由文本限位进 `payload.narrative` 并标 `non-actionable: true`（注入消费条款 2 的降权对象）。

### 4.4 注入消费防线

experience/ 内容被任何会话（含未来 R 侧）消费时，适用 spec §9.4 五条款全文：显式资料标记框架包裹、结构化字段优先、效力锚点外置于流程事实、上行对称、违例登记。本设计不新增也不削弱条款；壳侧落地形式 = brief 模板内置读取包装语。

---

## 五、周迁移影子测试设计（第一优先场景）

### 5.1 双轨定义

| 轨 | 执行体 | 写面 | 状态 |
| --- | --- | --- | --- |
| 主路径 | 确定性五段链（python3.8，trimc cron，周日 23:59 北京） | dev 分支现役周平面 + `.shift-ade.json` + per-run 日志 | 生产，R2 红线保护 |
| 影子 | 壳驱动的 CC 会话 agent 化五段 | dry 模式 + 独立 shadow-root + `[shadow]` 前缀 + shadow 分支 | 实验，长期影子位（spec §5.1），转正另需 CEO 裁决 |

### 5.2 dry 五段链的 agent 化包装方案

现役五段（W35 实样 `.shift-ade.json` steps 在册）：`create → migrate → carry_over → validate → agent_close`。agent 化包装 = 每段翻译为一个**可独立执行、可独立验收的 brief 节点**：

| 段 | agent 化任务语义（brief 要义） | 产物（dry） |
| --- | --- | --- |
| create | 按 token 生成新周 OP json 结构（只序列不落 dev） | `[shadow]` 新周 OP 对象于 shadow-root |
| migrate | 读 fromWeek 树面，计算应迁树清单与 doneTreesFromPreviousWeek 口径（W35 台账补全教训：双基差异致漏登 2 树——正是 agent 化复核的价值试点） | 迁移清单 changes[] |
| carry_over | 解析 unresolved-items 并生成新周平移面 | `[shadow]` unresolved-items.md |
| validate | 16 项结构校验同款复刻（total_checks 对齐主路径） | 校验 summary |
| agent_close | new_index_active / unresolved_items_present / escalation_8w 断言 | close 段 checks |

包装纪律：五段顺序执行但**每段结束即 artifactCommit**（§2.4 拆节点边界）；段间传递只经磁盘工件，禁止会话内口头交接。dry 模式由 brief 强制声明并写入产物 `dry_run: true`。

### 5.3 运行窗口与 token 语义对齐（week-math 实证支撑）

`computeWeekShiftTokens()` 规则 = `toWeek = ISO week of (today + 1 day)`（week-math.ts L58-66）。由此得出本设计的关键窗口判断：

- **周一至周六任意时刻运行，token 与周日触发完全同语义**（tomorrow 仍在同一 ISO 周）——week-math.ts L9-10 注释原文即此设计意图；
- 因此影子窗口定为 **周日 12:00 – 22:00（北京时间，冻结窗口 23:00 开始前）**：token 等价、避开冻结窗口（spec 风险 2）、且运行时周平面尚未切换（观测的是与主路径相同的 pre-state）；
- 错过窗口顺延即弃（下次窗口重跑），**禁止补跑追帧**——补跑会撞上周平面已切换的 post-state，比对面失配。

### 5.4 逐字段比对工件设计

比对器（确定性 python3.8 脚本）产出 `compare-report.json`，三件 diff：

1. **`.shift-ade.json` 字段级 diff**：
   - 参与比对：`steps[].step` 集合与顺序、各段 `result.status`、summary 业务键值（created/object_id/trees_migrated/total_checks/errors/close 段 checks）、`escalation_8w` 内容、changes[].action；
   - **expected-diff 白名单**（结构性预期差异，不计不一致）：`dry_run`（影 true / 主 false）、`target` 路径的 shadow-root 前缀（root 归一化后比对）、`check_time` 类时间戳字段（排除）；
   - 其余任何字段差异记一条 mismatch。
2. **git commit 内容 diff**：dry 下主路径当周真实 commit 集 vs 影子预期产物树（shadow 分支），按"预期 commit 集"语义比对而非裸 diff。
3. **per-run 日志 diff**：步骤序列与 RESULT 行同构性（exit code / timeout 语义），自由文本不比。

比对器独立性红线：**比对器不是 agent，不进 CC 会话**。agent 既当运动员又当裁判不可接受；比对结论必须出自确定性代码。

### 5.5 故障注入点矩阵

注入一律作用于 **shadow-root fixture**（预置的异常种子目录），永不触碰真实周平面：

| 注入位 | 注入内容 | 期望观测（主影子一致） |
| --- | --- | --- |
| create 前 | fromWeek OP json 缺失 / JSON 损坏 | fail-fast，错误信息同构 |
| migrate 中 | tree-op.json 损坏条目 | 跳过/报错策略一致 |
| carry_over | unresolved-items.md 缺失 | 行为一致（生成空面或报错，二选一同款） |
| validate | 人为制造 index 断言失败（如 active 周指针陈旧——W35 真实发生过 README 指针陈旧 6 周） | errors>0 且升级语义一致 |
| agent_close | new_index_active=false | fail 判定一致 |
| 壳层 | timeoutMs 触发 | 进程组整体 SIGKILL，日志 RESULT: timeout（肌肉记忆路径） |

判据挂钩：spec §5.2 要求 N 窗口内**至少一次完整成功迁移 + 一次注入故障对比演练**。

### 5.6 判据与 N 值裁定（CTO 技术面裁量，spec §5.2 授权）

- **N = 2 周**为门槛（spec 下限），附加三个必要条件：(a) 两周均为主路径成功周；(b) 其中至少一周为**非空负载周**（trees_migrated>0 或 carry-over 非空——空迁移周比对价值趋零，W34→W35 实样即 trees_migrated=0）；(c) 窗口内完成 ≥1 次注入对比演练。
- 出现任一非预期 mismatch：计数清零重计。
- 观察项：建议满 N 后继续影子至 TriRMC 移植窗口，持续积累 agent 化与确定性行为差异样本。

---

## 六、安全边界

### 6.1 权限面

- 员工分身 execute 权限遵循治理 registry 默认策略（company-governance-state.md §员工工具权限默认策略）：默认持有，`risk_level: high`、`requires_approval: true`；岗位细则未出前不收回默认。壳语境追加：execute 的作用域已被 §4.2 分区硬约束 + §5.1 影子隔离物理收窄，"有权"且"够不着"生产面。
- 壳自身权限最小化：只需写自己的 logDir 与触发 git 只读比较；不需要 TRIMC_CONFIG_DIR 写权以外的任何敏感面。

### 6.2 runAs 降级与进程边界

- CC 会话一律经 `runuser -u fleet --` 启动，`HOME=/home/fleet` 覆盖（command-handler.ts L82-95 同款；fleet=uid/gid 1001 系统账户）。
- detached 进程组 + 超时整组 SIGKILL：bash→cc→git 无孤儿残留。
- 禁触清单（brief 显式声明 + 壳审计）：`/srv/git/*.git` bare 面、TRIMC_CONFIG_DIR、现役 cron logs 以外的一切 trimc 状态、dev 分支写权。

### 6.3 低信域隔离

- experience/ 与一切跨层流入文本按 §9.4 属低信域：读取必包装、narrative 降权、效力只认流程事实。
- 壳拉起的 CC 会话对 fleet 克隆而言是**受控本地主体**，不持有对外网络凭据；模型 API 凭据经 fleet 用户环境注入，scope 仅推理调用。
- 上行产物禁携生产敏感数据（spec §9.2 通道④）；restricted 级原始数据不入仓只入摘要+指针（白皮书 §3.7 隐私分层，spec §9.1）。

### 6.4 失败隔离

- 影子失败不进现役告警通道；告警文案固定含链路身份，主路径文案含"主路径"字样（spec §四 B1 三规则，Q1-2 先满足后开跑）。
- 壳崩溃 = 本次影子弃跑，对主路径零影响（进程、分支、目录三重隔离）。

---

## 七、开放问题清单

| # | 问题 | 联动项 | 建议裁决时机 |
| --- | --- | --- | --- |
| Q-01 | **Q4 部署形态联动**：TriRMC cron 接管调度宿主后（spec §5.2 第二行），壳触发面是否随之迁移；TriMC 退役为纯壳后的常驻触发器归属与命名 | Phase 2 移植批 | 影子判据通过后、trirmc 部署窗前 |
| Q-02 | `reference/claude-code-2.1.88/` 快照本地缺失；创新记录 file:line 无法就地复核；且 fleet 侧 CC 版本演进可能改变 §2.1 机制事实 | FullStack 实施前置 | 实施开工前恢复快照或以现役版本重锚 |
| Q-03 | CC headless 在 sg-server 的安装形态、版本锚定与升级策略（首次服务器端部署 CC CLI） | TriDev 部署面 | Q1-2 影子面搭建同期 |
| Q-04 | 触发面 P1b 定型：CI scheduled job（需核查 sg-server ssh 凭证面）vs 临时 systemd timer（新物理名一次定终身） | 本文 §5.2/§1.1 | 影子开跑前二选一 |
| Q-05 | 模型成本预算门：spawn-only 已控累积成本，但单次演练 token 预算上限与超限熔断值未定（模型价格事实须查权威参考，禁凭记忆） | 成本纪律 | Q1-4 开跑前 |
| Q-06 | staging→confirmed 晋级的操作 SOP 归属（建议：编排层发起 PR + 三门 CI + 域 owner 签收） | spec §九三门 | Q1-3 P0 条款冻结时一并落 |
| Q-07 | auto-compact 盲区③（resume 回灌首调前压缩检查时序）为推断级结论；壳场景下 subagent 侧 compact_boundary 实测观察项 | 创新记录 §4 后续观察项 | 影子期顺带采集 |
| Q-08 | 多演练并发资源限位（对齐 Phase 2 cgroup/MemoryMax 思路，但 TriMMC 侧是否需要独立限位未决） | spec Phase 2 部署形态 | 出现第二次并发场景时 |
| Q-09 | drill 树的 CHO 编制审批在壳侧的登记接口（壳 spawn 必须入 CHO 审计 json，§2.5）——接口字段与克隆派工协议对齐细则 | clone-dispatch protocol | 首个正式 drill 树立项时 |

---

## 八、使用依据

| 依据 | 版本/位置 | 用途 |
| --- | --- | --- |
| quad-migration-spec.md | v1.0，`TriMetaverse/docs/execution/2026-08-24/`（已签发） | 范围、红线、§八十条、§九桥梁 |
| claude-code-spawn-resume-context-innovation-record.md | V1.0.1，`TriCompany/docs/engineering/` | §2.1-2.2 全部宿主机制结论 |
| command-handler.ts / week-math.ts | `D:/Code/ai/TriMC/src/cron/`（现役源码，本日实读） | §1.4 肌肉记忆、§5.3 窗口判断 |
| tmv-whitepaper.md | v1.0（修订 1+1a+1b），§3.1 L114-129、附录 B L1201-1206 | 元虚拟层定义、FADE/TriMMC 词条 |
| company-governance-state.md | as-of 2026-08-24，`TriCompany/docs/registry/` | execute 默认策略、alias 真源表 |
| quadmig-1 tree-op.json + W35 `.shift-ade.json` | `docs/workflow/operating-records/2026-W35/` | 验收口径、五段实样 |
| source-agents/chief-technology-officer/ 目录结构 | `TriCompany/source-agents/`（本日 Glob 实证） | §3.1 五件套实态 |
| binding-profiles/*.json ×13 | `TriCompany/.github/binding-profiles/`（本日 Glob 实证） | §3.3 阶段事实承载 |

## 变更记录

- 2026-08-24：v0.1-draft 初稿。quadmig-1 Q1-1 产出，CTO 小狄设计线。零代码，深度到可派 FullStack 实施的接口/契约/判据粒度。
