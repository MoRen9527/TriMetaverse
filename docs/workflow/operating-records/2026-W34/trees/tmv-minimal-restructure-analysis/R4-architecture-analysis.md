# R4 架构方案分析：三元宇宙最小实现目标态（2026-08-21）

分身：CTO 小狄（TMV-R-4）｜性质：架构方案分析，非实施决定｜任务量与分期归 R6，理念价值判断归 R5

## 文档同步元信息

- sourceOfTruth: docs/workflow/operating-records/2026-W34/trees/tmv-minimal-restructure-analysis/R4-architecture-analysis.md
- syncMode: source-only
- lastSyncedAt: 2026-08-21

输入：ceo-redefinition-brief.md（五问）＋ R1/R2/R3 现状盘点 ＋ 补充真源（ade-pattern-spec §8.5、trilc-trimc-runtime-parity.md、worktree-architecture-design.md v1 / project-workspace-design-v2.md、clone-dispatch-protocol.md、TriLC/src/company/staffing.ts）。每节方案 A/B＋推荐＋理由，事实引用标 R1/R2/R3 行号或文件路径；不确定处标置信度。

## 〇、总览：CEO 五问与本文章节映射

| CEO 问题 | 本文章节 | 一句话结论 |
| --- | --- | --- |
| ① 服务器 claude code 用 agent-core 吗 | R1 已答（没有，双路径完全隔离） | 本篇 §3.3 处理隔离的归位 |
| ② TriRMC/TriRLC 共用 agent-core 后，元虚拟↔元现实如何通信 | §二 | git 仓（元认知层）为主信道，跨系统零直连 |
| ③ 双系统会话/agent 管理模型 | §三 | 元虚拟 claude 自管＋薄桥（CEO 判断成立）；元现实按 parity 分层进 agent-core |
| ④ 岗位说明书式分身调度 + TriPilot/TriRLC 看全部上下文 | §四、§五 | contract 增 placement 字段＋双执行面统一；服务器只读投影 API＋本地聚合代理 |
| ⑤ 元虚拟不做会话管理、可整体换 codex | §3.1 | R1 事实直接支撑，成立度高，仅名册可见等四项最小管理 |

## 一、目标态架构定形图（先看图后看论证）

```text
┌─────────────────────────────── 服务器域（sg-ecs）───────────────────────────────┐
│                                                                                │
│  TriMMC（元虚拟主控，原 TriMC 收窄）                                             │
│  ├─ session-bridge：spawn / list / send 三原语（R1 路径 A 资产）                 │
│  ├─ 会话归官方 claude code（fleet ~/.claude），TriMMC 零会话状态（仅内存名册快照）  │
│  └─ 侦听回收环 127.0.0.1（唯一入口 = ssh 隧道，见 §8）                            │
│                                                                                │
│  TriRMC（元现实主控，新建 = 现 TriMC 路径 B 服务设施的迁入宿主，见 §3.3）          │
│  ├─ agent-core ADE runtime ＋ service adapter（PostgreSQL / 集群 / webhook）     │
│  ├─ 吸收：cron（周平面）/ config-sync（五维接收）/ observability / comm 仲裁      │
│  └─ 新增：只读投影 API（会话/任务/名册，供 TriRLC 聚合代理拉取，见 §5）            │
└────────────────────────────────────────────────────────────────────────────────┘
         ▲ ssh 隧道＋token                 ▲ HTTP+SSE（心跳/镜像/投影 push/只读 pull）
         │（bridge-1，§2.1）               │（bridge-3，§2.3）
┌─────────┴──────────────────┐   ┌─────────┴──────────────────────────────────────┐
│ 本地域                       │   │ 本地域                                          │
│  TriMLC（元虚拟本地）         │   │  TriRLC（元现实本地，原 TriLC）                   │
│  ├─ 本地 claude code 原版     │   │  ├─ agent-core ADE runtime ＋ local adapter      │
│  ├─ FADE 多宿主发布线激活     │   │  │   （SQLite / 本地 cron / TUI / 文件工具）        │
│  └─ bridge 客户端：           │   │  ├─ 现有功能面全继承（30 目录，R2 §一）           │
│     ssh LocalForward →       │   │  └─ 新增：上下文聚合代理（§5，远端源接入）         │
│     TriMMC HTTP 三原语        │   │                                                  │
└─────────────────────────────┘   │  TriPilot / TriCade ──HTTP+SSE──▶ TriRLC         │
                                  │    listSessions / recoverSession 增 source 参数   │
                                  │    （local | trirmc | trimmc）——本地看全部        │
                                  └──────────────────────────────────────────────────┘

──────────────────────────────────────────────────────────────────────────────────
元认知层：项目仓（git）＝ TriMetaverse / TriCompany / 各模块仓
  ├─ bridge-2（§2.2）：元虚拟↔元现实唯一跨系统信道
  │    实验结论 / 方案 spec / 重放任务包 / 五维配置 → git commit → push 双远端 → 对端拉取
  ├─ 五维同步模式已运营（R2 §五：bundle→git→push→cron 拉取→schema 校验→applied.json）
  └─ 消费形态：无 npm 仓用 worktree ／ 含 npm file: 仓用 clone（§六，INCIDENT-20260814-001 门禁）
──────────────────────────────────────────────────────────────────────────────────
三条 bridge 一览：
  bridge-1 TriMMC↔TriMLC ：ssh 隧道＋HTTP 三原语＋token（新建 ssh 面，复用 session-bridge HTTP 面）
  bridge-2 元虚拟↔元现实 ：git 仓异步双向（复用五维同步模式；跨系统零直连 API）
  bridge-3 TriRMC↔TriRLC ：心跳/任务镜像/五维 git 直接复用；会话同步死代码激活为投影 push；
                            新增 TriRMC 只读查询面（服务器→本地可见性的唯一新增面）
```

## 二、三条 bridge 通信方案（CEO 问题 ② 延伸）

### 2.1 bridge-1：TriMMC ↔ TriMLC（元虚拟内，服务器↔本地 claude code）

**事实基线**：服务器 session-bridge 已有 spawn/list/send 三原语及 HTTP 面（GET/POST `/internal/v1/agents`、POST `/internal/v1/agents/{id}/message`，R1 路径 A）；全仓无 ssh 调用（R1"无 ssh/bridge 面实证"）；会话归官方 claude（fleet ~/.claude），TriMC 只持内存快照。

**方案 A（推荐）：ssh 隧道＋复用现有 HTTP 面＋token 鉴权**

- 形态：TriMLC 内置 bridge 客户端模块（ssh LocalForward 本地端口→服务器回环 8710），全部元虚拟跨机通信走该隧道；TriMMC 侧加 token 中间件，绑定从 0.0.0.0 收回 127.0.0.1（§八）。
- 需新建：ssh 密钥管理＋隧道保活（断线重连，参照 event-queue 离线重放思路）、token 校验中间件、TriMLC bridge 客户端（spawn 转发/list 名册缓存/send 透传，120s 超时语义沿用 R1 :155-183）。
- 零新建：通信协议本身——session-bridge 三原语的 HTTP 语义（含三级寻址 sessionId→agentId→name）已覆盖"分身跑服务器"所需的全部执行面。

**方案 B（否决）：服务器侧独立 bridge 服务（ssh 子系统 / 新端口）**

- session-bridge HTTP 面已覆盖同等语义，独立服务=第二套协议面，违背 parity 文档"不重写第二套"精神（该原则虽针对 runtime，协议面同理）。

**方案 C（部分采纳）：git 仓中转名册/结果**

- 只作为 A 的补充（结论沉淀走仓，见 §2.2）；不能承载 send（交互式 120s 回复，R1 :155-183）与 spawn（实时性）。

**死代码复用裁决**：TriLC `sync/sync-engine.ts`（R2 §四第 3 条）不复用于本条 bridge。理由：它同步的是 TriLC session-store（自研 loop 会话）→ `{trimcBaseUrl}/internal/v1/sessions/sync`，而元虚拟会话在官方 claude（fleet ~/.claude）体系内，两者是不同会话体系；且 CEO 问题 ⑤ 定调元虚拟会话 claude 自管。其工程模式（状态机＋409 幂等＋重试退避）保留为 §2.3 会话投影 push 的参考实现——在元现实侧激活，不在元虚拟侧复用。

**置信度：高**。ssh 面确需新建（R1 实证为零），但形态选择空间小，方案 A 是最小增量。

### 2.2 bridge-2：元虚拟 ↔ 元现实（跨系统 bridge）

**语义澄清**（技术语义；理念边界归 R5）：

1. 实验结论传递：元虚拟跑通的功能 → 方案/结论/spec → 元现实实现类似功能。载体本质=文档＋代码＋合同。
2. 需求重放：元现实需求 → 任务包/prompt＋评测数据 → 元虚拟实验 → 效果数据回流。载体本质=可版本化资产。
3. 运行态数据对照：周平面数据、benchmark、观测指标。载体=仓内数据文件或查询面（§5）。

CEO 示例（"周工作平面现在在 TriMMC 和 TriMLC 就能跑通 → 制定方案整体跑到 TriRMC+TriRLC"）＝语义 1＋2：周平面本来就在 operating-records 仓内（git 资产），传递物是方案与记录，不是实时消息流。

**方案 A（推荐）：git 仓主信道＋受限只读查询辅信道，跨系统零直连 API**

- 主信道复用五维同步模式（R2 §五已运营：bundle→写仓→git commit→push 双远端→服务器 cron 拉起→schema 校验→applied.json 版本比对）：实验结论/重放任务包/效果数据按同构链路落仓流转；改动回流走 PR（project-workspace-design-v2 §五.4 已设计 TriMC 审核 gate，架构归位后由 TriRMC 承接）。
- 否决 TriMMC↔TriRMC HTTP 直连：两系统宿主技术栈不同（claude code vs agent-core），CEO 明确"元虚拟整套换 codex 也不影响"——直连 API 会在两系统间制造协议耦合，直接破坏这一定位；且 TriMMC 无 agent-core 面（R1），无对等协议基础。
- 否决独立 bridge 服务：新增常驻运维面，语义 A 已覆盖。

**方案 B（否决）：HTTP 直连 API**、**方案 C（否决）：独立 bridge 服务**——理由如上。

**置信度：中高**。若 CEO 期望"重放"含实时数据流（非结论交换），需补窄版查询面（仅 benchmark/效果数据），列为开放问题交 R5/R7 向 CEO 确认。

### 2.3 bridge-3：TriRMC ↔ TriRLC（元现实内，共用 agent-core 之外）

**逐面裁决表**（基于 R2 §四既有 4 条跨机面）：

| 面 | 现状（R2） | 裁决 | 说明 |
| --- | --- | --- | --- |
| 心跳（10s，connected/degraded） | 已运营 | **直接复用** | TriRLC 改指向 TriRMC，协议不变 |
| 任务镜像（事件驱动＋30s 兜底） | 已运营（TriMC 有 GET /tasks 可读） | **直接复用** | 接收端随 §3.3 资产迁移落 TriRMC |
| 会话云同步 | 死代码，两端未接线 | **激活改造为"会话投影 push"** | 见 §五；方向保持本地→服务器；接收端由 TriRMC 实现并落 PG |
| 五维配置同步（走 git） | 已运营 | **直接复用** | 载体是 TriCompany 仓本身（R2 §五），与 daemon 改名无关 |
| 离线事件 replay（comm 仲裁） | 已运营（POST /events/replay） | **复用** | comm 仲裁面属路径 B 资产，随 §3.3 迁移 |
| 服务器→本地只读查询 | 零 | **新建**（唯一新增面） | TriRMC 只读投影 API，§五 |

**协议统一**：HTTP+SSE（两 daemon 同构栈）。agent-core 服务域/本地域 adapter 的差异面在存储与触发（parity §4），不在传输协议，故 bridge-3 无需引入第二协议。

**写权威护栏**：投影 push 必须携带 parity §5 双域写权威元数据（homeDomain/writeAuthority/authorityEpoch/version）——代码共享不等于运行时双活写入；本地 owned 会话在 TriRMC 侧是只读投影，反向同理。

## 三、双系统会话 / agent 管理模型（CEO 问题 ③）

### 3.1 元虚拟：验证 CEO"直接应用 claude code 现有功能，不必做会话管理"的成立度

**成立度：高，R1 事实直接支撑。**

- 会话生命周期本来就归官方 claude（fleet ~/.claude），TriMC 无生命周期控制、仅内存快照（R1 路径 A）——"不做会话管理"不是放弃既有能力，是延续现状。
- claude `agents --json` 名册＋三原语（spawn/list/send）＝claude 自管面完整覆盖运行操作语义。
- 可替换性论点成立：TriMMC 不持有会话状态（快照仅缓存，丢失可由 list 重建），宿主从 claude code 换 codex 时只需替换 session-bridge 适配层——桥越薄，替换面越小。

**仍需要的最小管理（四项白名单，超出即违背问题 ⑤ 定调）**：

1. 名册可见性：本地 TriPilot 要看到服务器分身列表——bridge-1 list 原语已有，仅需聚合进 TriRLC 代理（§五）。
2. spawn 触发面：HC 审批链（clone-dispatch §1.3）执行点在服务器时经 bridge-1 spawn 触发——原语已有，缺审批链接线（§四）。
3. 成本/审计：session-bridge 无 token 计量（cost-controller 白名单在路径 B，R1）——最小实现可后置，列 §九观察项。
4. 跨机会话连续性：本地与服务器是两套独立 ~/.claude，claude code 会话不跨机——这是官方边界，元虚拟不补（补了就违背"自管"）。

### 3.2 元现实：TriRMC＋TriRLC 的会话/agent 管理分层

对 R2 §二缺口清单逐项裁决（进 agent-core / 留各端）：

| R2 缺口 | 裁决 | 理由 |
| --- | --- | --- |
| HTTP/SSE daemon 抽象 | **骨架进 agent-core**（路由注册、SSE 流、生命周期、鉴权中间件位），绑定/部署配置留端 | 两仓手写 app.ts（TriLC 4387 行＋TriMC 691 行）是 parity 最大重复；parity §4"Runtime 进程"差异面指进程形态（本地 daemon vs K8s worker），不指 HTTP 骨架 |
| 会话存储 | **合同进**（repository interface＋conformance suite），实现留端（TriRLC=SQLite WAL，TriRMC=PostgreSQL） | parity §4 明列两库为差异面 adapter；§7.4"同一 repository conformance suite"是既定原则；TriLC session-store 现实现是本地 adapter 的种子 |
| 上下文聚合 | **引擎进**（多源枚举、统一 schema、过滤分页），源 adapter 留端 | 聚合算法宿主无关；源（本 daemon store／远端投影／元虚拟名册桥）是端能力。见 §五 |
| 多 agent 运行时注册表 | **合同＋内存实现进**，持久化留端 | 现各仓自有 resolver/registry（R2）；合同化后双端同构，TriRMC 不再重写 |
| 跨节点/跨 daemon 可见性 | **不进单机内核**——agent-core 只定义投影合同（schema＋写权威元数据），实现在 bridge-3 协议面 | 单机内核不应感知远端；parity §8 Trees 投影接口是同构先例（runtime 只更新投影，组织真源在别处） |

**留各端**（parity §4 差异面全表继承）：trigger、tool、HITL、进程形态、离线策略、observability 存储。

**分层总结**：agent-core＝单 agent 会话执行内核（现状）＋daemon 骨架＋存储/注册表/聚合合同与引擎＝「双端同构的 daemon 内核」；TriRMC＝service adapter（PG/集群/webhook）＋运营设施宿主；TriRLC＝local adapter（SQLite/cron/TUI/文件工具）＋现全部功能面继承。

### 3.3 关键裁决点：现 TriMC（改名 TriMMC）路径 B 资产归属

**问题**：R1 实证路径 A（claude CLI）与路径 B（agent-core 自研 loop）完全隔离无互调。CEO 新定义 TriMMC＝"服务器上 claude code 原版＋trimc"，但 trimc 的 23 顶层模块大半服务路径 B 与公司运营设施（cron 周平面调度、config-sync 五维接收端、observability PG、comm 仲裁、heartbeat）。

**方案 A（推荐）：TriMMC 收窄为元虚拟主控（路径 A 资产：session-bridge＋orchestration 桥面＋policy-gate/cost-controller 中与桥相关部分）；路径 B 服务设施迁 TriRMC 作为服务域种子**

- 理由 1（语义归位）：cron 周平面、config-sync 五维接收、任务镜像接收、事件仲裁全部面向 TriRLC（元现实本地端）与公司运营——是元现实职能。留在 TriMMC 会让"元虚拟可整体换 codex"不真：换宿主时会把运营设施一起换掉。
- 理由 2（种子来源）：TriRMC 若无种子则"共用 agent-core"沦为口号——路径 B 的 server 骨架/cron/pipeline 是现成的 service adapter 雏形，且已消费 agent-core（R1 8 文件清单）。
- 理由 3（parity 合规）：parity 文档 §1 禁止"复制 TriLC/src 到服务域重写第二套"——TriRMC 从路径 B 资产生长，而不是从 TriLC 拷贝。

**方案 B（否决）**：全部留 TriMMC、TriRMC 新建空壳——TriRMC 无承接面，§2.3/§五的接收端无处落；运营设施语义错位。
**方案 C（否决）**：按模块双活——写权威分裂，违背 parity §5。

**置信度：中高**。方向判断基于职能归位；物理迁移批次、双跑窗口（周平面 cron 不能断）属 R6。R4 仅定方向并登记：**此裁决建议列入 R7 向 CEO 显式确认项**（影响 TriMMC 改名后的仓定位叙事）。

## 四、岗位说明书式分身调度（CEO 问题 ④ 后半）

**现状承载**（staffing.ts＋clone-dispatch-protocol v0.2）：

- 岗位-员工分离：JD（md 五件套＋contract）＝固定资产；分身实例＝流动资产（clone-dispatch §1.2）。
- roster 三态（active/pending-cho/candidate）＝运行态门禁单一真源，派工 owner 校验/分身 spawn 前置/cron 拉起前置三处门禁共用 isRoleActive（staffing.ts:7-11, :94-99）。
- HC 链：小贾（需求）→ CHO（审批，≤5 并行、2h 超时回收）→ 编排层（执行 spawn）。
- **缺口**：无 placement（跑在哪）语义——现 spawn 执行面两处且互不知晓：本地＝编排层进程（隐含本机）；服务器＝session-bridge spawn（R1，无 roster 门禁记载）。

**方案 A（推荐）：协议与 contract 增量三件**

1. contract.yaml 岗位级声明 placement 策略：`mainControllerOnly | preferServer | preferLocal | either`＋资源画像——clone-dispatch §4.6 已预留该方向（maxParallelInstances/timeout/resourceProfile/handoverProtocol 计划字段），是既有模式的字段扩展，非新机制。
2. CLONE_STAFFING_REQUEST 增 placement 字段；CHO 审批含按域分账的编制总量（服务器编制与本地编制分上限——服务器资源是公司资产，本地是 CEO 机器，成本域不同）。
3. 两个 spawn 执行面统一接口：本地 spawn 与 bridge-1 spawn 同契约（同请求/回执/审计 schema）；**服务器侧 spawn 前置 roster 门禁需补齐**（现 session-bridge 无门禁，分身跑服务器若绕过名册决策面，gating 真源就被架空）。

**方案 B（否决）**：无声明全动态路由——违背 JD 固定资产原则，CHO 无审批依据。
**方案 C（否决）**：独立调度服务——MVP 阶段编排层＋两执行面足够，新增常驻服务无增量价值。

**主控域 7×24 语义**：常驻岗位＝daemon 常驻形态（TriRMC cron/heartbeat 已是 7×24；TriMMC 侧 claude --bg 常驻＋cron 唤醒）——该语义已成立，调度面只管"分身"这一层，不重造常驻机制。

**置信度：高**（字段扩展走既有协议演进路径；e2e-staffing 链路已有，扩展有测试基座）。

## 五、TriPilot＋TriRLC 连 agent-core daemon 看全部上下文（CEO 问题 ④ 主问）

**R2 基线**：本地已基本成立（TriPilot↔TriLC 会话/agent/流全通，recoverSession 到消息级）；服务器可见性为零（4 条单向面＋死代码一条）。

**最小实现路径（三步）**：

1. **TriRMC 只读投影 API（新建，服务器侧唯一新增面）**：
   - `GET /internal/v1/projection/agents`（名册）＋`GET /internal/v1/projection/sessions`（列表＋摘要）＋`GET /internal/v1/projection/sessions/{id}`（消息正文，按需拉取）。
   - 数据源三路：TriRMC 自有会话存储（服务域会话）；TriRLC 投影 push（激活 sync-engine：发送端改推送投影而非全量同步、接收端 TriRMC 落 PG——两端 schema 以 session-store v2 的 cloud sync 字段为起点，漂移需核）；TriMMC claude 名册（经 bridge-1 list，可后置）。
2. **TriRLC 聚合代理（新建薄层）**：TriPilot 既有 listSessions/recoverSession/listAgents 增 `source` 参数（local | trirmc | trimmc）；远端请求由 TriRLC 代理转发——**TriPilot 不直连公网**，单一出口原则（TriPilot 现状唯一配置即 127.0.0.1:8711，零发现机制，R2 §三——代理模式保持该现状不被打破）。
3. **安全收口**（§八）：token＋绑定收窄＋只读面与写面分离。

**上下文聚合放哪**：agent-core 定义聚合合同＋引擎（§3.2 已裁决），TriRLC/TriRMC 各实现源 adapter。本地侧聚合 TriRLC 自己的 session-store；远端源是 TriRMC 投影 API 与 TriMMC 名册桥。

**可见性分级线（重要架构语义）**：

| 系统 | 列表/摘要级 | 消息正文级 |
| --- | --- | --- |
| 元现实（TriRLC/TriRMC） | 承诺（投影 API） | 承诺（按需拉取，会话本就在自研 session-store 体系内） |
| 元虚拟（TriMMC/TriMLC） | 承诺（名册＋任务摘要） | **不承诺**（claude code 会话正文归官方 ~/.claude，问题 ⑤ 定调自管；投影正文级=做会话管理，越线） |

CEO 问题 ④ 原文"看到服务器和本地所有 agent 的上下文"若被理解为含元虚拟消息正文级，与问题 ⑤ 自相矛盾——R4 按"元现实全级＋元虚拟名册/摘要级"定架构，**正文级边界建议 R7 向 CEO 显式确认**。

**置信度：中高**（本地链路已在、增量清晰；死代码两端 schema 漂移量未核，标观察项）。

## 六、元认知 worktree 消费的技术形态（CEO 问题 ④ 相连／简报 §四）

**事实基线**：INCIDENT-20260814-001——`git worktree remove --force` 穿透 npm `file:` 依赖 junction 误删工作区；纪律＝禁 worktree＋npm install 组合、含 `file:` 依赖仓（TriCompany/TriLC/TriCode）禁建本地 worktree、`remove --force` 全仓禁用（worktree-architecture-design v1 §五）。v2 已定案 hasNpmFileDeps 门禁＋project/<key> 常驻分支＋PR 治理流＋link/claim daemon 端点（project-workspace-design-v2 §五）。服务器 /srv/fleet 裸仓＋克隆 ff-only 模式已运营。

**方案 A（推荐）：按仓分级消费（延续 v2 门禁设计）**

- 无 npm 面仓（TriMetaverse 文档＋脚本仓）：**worktree**——v1 §四.1 已论证"本仓无 npm 包面，junction 风险天然为零"；v2 的 TriCade 关联向导/注册点/TRILC_PROJECT_WORKTREE_ROOT 消费链直接继承。
- 含 npm `file:` 依赖仓（TriCompany/TriLC/TriCode/未来 TriRMC）：**禁本地 worktree，消费形态＝独立 clone**（服务器裸仓＋克隆 ff-only 同构模式）或只读 fetch——元现实消费元认知仓以"读成果＋PR 回流"为主，clone 足够；绝不在这类仓上复刻 TriCade worktree 体验。
- Windows junction 规避细则：`worktree remove --force` 全仓禁用（v1 纪律）；daemon link/claim 端点保留 hasNpmFileDeps 前置门禁（v2 §五.1）；npm 仓标记入项目仓注册表。

**方案 B（否决）**：全仓 worktree——直接违背事故纪律。
**方案 C（否决）**：全仓 clone——保守可行，但放弃 v2 已定案的 TriCade worktree 体验与已投入设计，且本地单 clone 与服务器克隆模式趋同后失去"用户任意路径工作区"的产品语义。

**置信度：高**——本节大部分是已定案设计（v1/v2）的引用与继承，非新判断。

## 七、安全模型统一裁决（0.0.0.0 不对称收口）

**现状**：TriMC `server.listen(env.port)` 无 host 参数＝绑 0.0.0.0 且全仓无鉴权（R2 §四）；TriLC 仅 127.0.0.1、无 token（回环即安全模型，R2 §一）。重定义后四 controller 三个带跨机面，现状不可延续。

| Daemon | 目标态绑定 | 鉴权 | 理由 |
| --- | --- | --- | --- |
| TriMMC | **收回环 127.0.0.1**（唯一入口＝ssh 隧道） | token（bridge 专用） | 元虚拟无公网面需求；bridge-1 走 ssh 后公网暴露面归零 |
| TriRMC | 回环或内网面（ssh/VPN 入口），禁止裸公网 | 写面 token＋只读投影面独立只读 token | 承接心跳/镜像/投影 push 写面与投影 pull 读面，读写分离 |
| TriRLC | 保持 127.0.0.1（现状） | 现状＋远端代理出口 token | TriPilot 本地直连契约不变；新增的只是出向代理 |
| TriMLC | 无 daemon 侦听面（bridge 客户端形态） | ssh 密钥 | claude code 本地自管，不新增服务面 |

心跳/镜像/投影 push 三条既有面补共享 secret（现零鉴权，R2 实证）。agent-core daemon 骨架的鉴权中间件位为必选件（§3.2）。

**置信度：高**（方向）；具体部署形态（内网段/VPN/隧道优先级）随 R6 排期定。

## 八、风险与观察项（供 R6 排期与 R7 收口）

| # | 风险/观察项 | 依据 | 处置建议 |
| --- | --- | --- | --- |
| 1 | CI agent-core 步骤断链：build-tricade.yml:153 working-directory 指向已清理的 TriMC/packages/agent-core | R2 附带观察 | 改名/重构批次的前置修复项，R6 排入 |
| 2 | TriMLC vs TriModel 混淆（R3 四名中最高） | R3 §三 | 命名裁决归 R5/R7；本篇提示 bridge/配置键命名避开 `trimodel` 字样 |
| 3 | 死代码两端 schema 漂移：sync-engine 与接收端从未接线，session-store schema v2 cloud sync 字段是否仍匹配未核 | R2 §四/§一 | 激活前专项核对，R6 排入 |
| 4 | 路径 B 资产迁移期服务连续性：周平面 cron、五维接收端不能断 | R1 功能面/§3.3 | 迁移批次设计双跑窗口＋回滚姿态（R6） |
| 5 | session-bridge 正则解析脆弱："backgrounded · id · name" 依赖 claude code 输出格式 | R1 :88-115 | claude code 升级即断；列入 bridge-1 稳定性观察项 |
| 6 | 元虚拟消息正文级可见性边界未获 CEO 确认 | §五 | R7 显式确认（问题 ④/⑤ 潜在冲突点） |
| 7 | 路径 B 资产归属裁决（§3.3）影响 TriMMC 仓定位叙事 | §3.3 | R7 向 CEO 确认 |
| 8 | 服务器侧 spawn 无 roster 门禁 | §四 | 统一执行面时补齐，属 bridge-1/调度批次 |

## 九、使用依据

- ceo-redefinition-brief.md（五问原文）、R1-trimc-inventory.md、R2-trilc-agentcore-inventory.md、R3-concept-naming-inventory.md（同目录，2026-08-21）
- TriCompany/docs/engineering/ade-pattern-spec.md §8.5（双域同构共用 agent-core ADE runtime）
- TriCompany/docs/engineering/trilc-trimc-runtime-parity.md V1.1（共享面/差异面/写权威/parity gate——§3.2、§2.3 分层依据）
- TriMetaverse/docs/execution/worktree-architecture-design.md（v1 冻结基线：INCIDENT-20260814-001 纪律）
- TriMetaverse/docs/execution/project-workspace-design-v2.md（ARCH-20260814-002：hasNpmFileDeps 门禁、project/<key> 分支、PR 治理流——§六依据）
- TriMetaverse/docs/execution/clone-dispatch-protocol.md v0.2（岗位-员工分离、HC 链——§四依据）
- TriLC/src/company/staffing.ts（roster 三态门禁单一真源——§四依据）
- CLAUDE.md（TriLC 定位"HTTP+SSE agent loop daemon"——§2.3 协议统一佐证）
