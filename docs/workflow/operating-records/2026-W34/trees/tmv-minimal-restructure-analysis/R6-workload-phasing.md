# R6 任务量与分期分析：三元宇宙重定义大改造排期依据（2026-08-21）

分身：CTO 小狄（TMV-R-6）｜性质：任务量估计与分期建议（供 R7 联审与 CEO 定调），非实施决定｜架构方案依据 R4，理念判断归 R5

## 文档同步元信息

- sourceOfTruth: docs/workflow/operating-records/2026-W34/trees/tmv-minimal-restructure-analysis/R6-workload-phasing.md
- syncMode: source-only
- lastSyncedAt: 2026-08-21

输入：ceo-redefinition-brief.md ＋ R1-R5（同目录）＋ 在排真源（OP-202608-W34-001.json nextActions/risks：FADE-PIPELINE-ANALYSIS-20260821-001 批次 A-D、ALIGN-ANALYSIS-20260820-001 TODO 1-8、CFO-ONBOARD-20260819-001 开业并入、I1-I4 收官、FADE-STRENGTHEN/LEFTOVER 批次记录、two-phase-architecture-roadmap v2、session P0 排期裁决、ARCH-20260814-002）。

## 〇、批单位口径与校准锚点

**1 批 = 一个可独立验收的工作包，走「一小全实现 → 一小柯独立验证 → 一小狄终审」全链**，典型 0.5-1 个工作日；跨仓 / 含服务器 ssh 操作 / 含双跑验证的复杂批可至 2 个工作日。

校准锚点（三条，全部在案）：

1. FADE-STRENGTHEN 批 1（四子项校验规则类）与批 2（spec 升版＋清扫四步定序）各约 1 个工作日闭环（OP nextActions FADE-STRENGTHEN-20260821-001 / FADE-LEFTOVER-20260821-001，2026-08-21 双批同日完成）。
2. FADE-PIPELINE 联审口径：「最小可用（即时指令链闭环）≈4-7 批、cron 全自动再 +3-5 批」（OP FADE-PIPELINE-ANALYSIS-20260821-001）——本表与其同单位制，可直接对照。
3. I1-I4 实施树各 6-7 节、约 1-2 天/树（OP doneTrees）——单树 ≈2-3 批当量。

估计性质声明：批次数为【推断】（锚点法估计，逐处标依据）；影响面与现状事实为【实证】（引 R1-R5 行号）。所有「批」按 CEO 简报 §六「分批完成防上下文爆掉」粒度设计，执行期按线建树＋分身派工（clone-dispatch HC 链已投产）。

## 〇.5 设计约束注记（R9 补，2026-08-21——对期 1-4 各批生效）

**会话=一等调度与记账单元 + 租户无全局单例**：CEO 终态愿景（图 3-2 价值闭环的多租户形态）已确认映射（R9）。期 1-4 造的会话存储/调度/投影/聚合，从第一天按「每会话归属一个主体（今天=公司 TriCompany，明天=租户/创业者账户）」建模——会话带 owner 维度、注册表/账目/投影按 owner 域隔离、禁全局单例会话状态。成本：设计期一行字段的事；收益：多租户（生产系统期）是扩展不是重写。FADE 评分段的评估对象同理预留 per-owner 记账口径（图 3-2 步 4-6 种子）。

## 一、工作包分解与任务量表（七线）

### 1.1 改名线（TriMC→TriMMC / TriLC→TriRLC）

R5 已定双名过渡规则：叙事面即刻、兼容面归本线、触发式终点（R5:144-149）。影响面事实=R3 §四六类（A 安装器 R3:30 / B CI R3:31 / C TriPilot settings 键 R3:32 / D CLI 文档 R3:33 / E binding notes R3:34 / F 装机二次迁移 R3:35）。

| 子线 | 内容 | 批数 | 依据与置信度 |
| --- | --- | --- | --- |
| 1a 叙事面（即刻） | 架构文档 §4 模块表＋§5 alias 条目＋TriMLC/TriModel 消歧条目（R5:133-137）、CLAUDE.md、各 registry、binding notes 13 处、代码注释；含 two-phase-architecture-roadmap v2 叙事合流交叉引用（见风险 14） | 1 | R3:8-18/34。机械替换＋条目登记，高置信 |
| 1b TriRLC 兼容面 | ① TriPilot settings 键双读迁移（8+ 键已持久化用户 settings.json，读旧写新＋一次性迁移）② npm bin trilc→trirlc＋alias 保留 ③ 安装器（NSSM 服务名/schtasks/安装目录/ARP）＋装机迁移（复用 -MigrateLegacy 先例，现役装机态 r20 在案） | 3-4 | R3:30/32/35。协调项：TRILC_WEEKLY_PLANE_ROOT 仍在安装器（R3:30 实证），design-v2 P3（TRILC_PROJECT_WORKTREE_ROOT 切换）若先落则该变量项被吸收，未落则本线承接（+0.5 批）。中高置信 |
| 1c TriMMC 兼容面 | ① CI：agent-core 步骤断链修复（前置）＋staging/Release 文案/产物名 ② 服务器侧：systemd trimc.service / docker-compose / k8s / runbook 改名 | 2 | R3:31；R1:49 部署形态。服务器批需 ssh 窗口。中高置信 |

小计 **6-7 批**。依赖顺序：叙事（即刻）→ CI 断链修复（强制最先，见风险 10）→ settings 键 / bin（代码面双读，随 r21+ 发布）→ 装机 / 服务器迁移（最后）→ alias 触发式终点收口（归期 4，R5:149）。

### 1.2 新建线

**TriMLC 最小功能面**：CEO 定调「目前主要就这点功能（最小）」＝本地宿主激活（brief §一.3）。FADE 发布线已投产（--host 双宿主、重渲染 12+12 收敛、binding 13/13 零 error，R5:178 ＋ git b15e53e2/72022a4e）。

| 内容 | 批数 | 依据 |
| --- | --- | --- |
| 立项四件套（contract/agent-body/registry/发布条目，按 AGENTS 对齐 TODO ⑥ 新模块标准，见 §三.3）＋ FADE claude 宿主激活声明＋命名锚定落册 | 1 | 高置信：本体零新代码；R4 定调无 daemon 侦听面（R4:247 bridge 客户端形态） |

**TriRMC 两案对比（R4 §3.3 留裁决点＝CEO 确认项 1）**：

| 批项 | 方案 A：路径 B 资产迁入为种子（R4 推荐） | 方案 B：全新建 |
| --- | --- | --- |
| 立项＋仓＋CI | 1 | 1 |
| server 骨架 / HTTP 面 | 1（路径 B loop/pipeline 归位，R1:24） | 2-3（从零；禁从 TriLC 拷贝——parity §1） |
| cron 周平面五段链 | 2（含双跑＋切换；链已投产：prod-grade-1 树＋周日 23:00 自然触发在案） | 2（重做已运营链） |
| config-sync 五维接收 | 1（迁移；I4 产线 43/43 基线） | 2 |
| 接收面（心跳/镜像/events） | 1 | 1-2 |
| observability PG | 1（可后置期 3/4） | 1-2 |
| **合计** | **6-7** | **9-12** |

差值 3-5 批，另有不可量化代价：方案 B 违反 parity「不重写第二套」既定原则、把已投产周平面链重做一遍引入纯迁移风险、运营设施滞留元虚拟侧使「整套换 codex 不真」（R4:167-169）。【推断，中置信——拆批粒度基于 R1:48 功能面 23 模块清单】

新建线小计：**7-8 批**（TriMLC 1 ＋ TriRMC 方案 A 6-7）。

### 1.3 bridge 线

| bridge | 批项 | 批数 | 依据 |
| --- | --- | --- | --- |
| bridge-1 TriMMC↔TriMLC | ① TriMMC token 中间件＋绑定收回环 127.0.0.1 ② ssh 隧道客户端＋断线保活（参照 event-queue 重放思路）③ spawn/list/send 转发（120s 语义沿用）＋服务器联调 | 3-4 | R4:73-77（新建清单三项＋零新建面）＋R4:244 安全表；ssh 面确需新建（R1:50 实证全仓零）。中高置信 |
| bridge-2 元虚拟↔元现实 | ① 流转资产落点规范（实验结论/重放任务包/效果数据的仓内 schema 约定）② TriMC 审核 gate 迁 TriRMC（project-workspace-design-v2 §五.4 已设计） | 1-2 | R4:101-106「主要是规范不是代码」。高置信；①可独立先行 |
| bridge-3 TriRMC↔TriRLC | ① schema 漂移核对专项（sync-engine 与 session-store v2 cloud sync 字段从未接线核对）② 会话投影 push 两端激活（发送端改投影＋接收端 TriRMC 落 PG，参考 sync-engine 状态机/409 幂等/退避工程模式） | 3 | R2:53 死代码＋R4:119 裁决行＋R4:126 写权威护栏。心跳/镜像/五维改指向 0 额外批（随 TriRMC 迁移批走）；只读 API 归 1.6。中置信（漂移量未核） |

小计 **7-9 批**。

### 1.4 会话管理线（agent-core 进件，R4 §3.2 裁决表 R4:149-155）

| 批项 | 批数 | 依据 |
| --- | --- | --- |
| daemon 骨架（路由注册/SSE/生命周期/鉴权中间件位）：合同设计 1＋实现 1-2＋两端 adoption 试点 1-2 | 3-5 | 两仓手写 app.ts（TriLC 4387 行＋TriMC 691 行，R4:151/R2:8）为 parity 最大重复；防大爆炸＝合同先行＋单端试点。中置信（抽象跨度最大） |
| 会话存储合同（repository interface＋conformance suite，实现留端） | 1-2 | R4:152；TriLC session-store 为本地 adapter 种子（R2:13） |
| 多 agent 注册表合同＋内存实现 | 1 | R4:154 |
| 上下文聚合引擎＋源 adapter 合同 | 1-2 | R4:153；与 1.6 解耦见 §二 |

小计 **6-10 批**。共享包改动每批走独立变更通道（纪律在案：r1-2「不就地改共享包」）。**本线可整体缓做**——现骨架虽重复但已运营，属改善面非门禁。

### 1.5 分身调度线（R4 §四三件，R4:186-190）

| 批项 | 批数 | 依据 |
| --- | --- | --- |
| contract.yaml placement 策略字段＋资源画像 | 1 | R4:187（clone-dispatch §4.6 已预留方向，字段扩展非新机制） |
| CLONE_STAFFING_REQUEST placement＋CHO 按域分账编制总量 | 1 | R4:188 |
| 双 spawn 执行面统一接口＋服务器侧 roster 门禁补齐 | 1 | R4:189＋风险 8；与 bridge-1 联动 |

小计 **2-3 批**。高置信（e2e-staffing 链路测试基座在案，R4:196）。

### 1.6 上下文可见性线（三步路径，R4:202-208）

| 步 | 批项 | 批数 | 依据 |
| --- | --- | --- | --- |
| 步 1 | TriRMC 只读投影 API 三端点（agents / sessions / sessions/{id}，数据源三路） | 2 | R4:204-206；硬依赖 TriRMC 立项＋基础迁移 |
| 步 2 | TriRLC 聚合代理（薄层，source 参数 local/trirmc/trimmc）＋ TriPilot listSessions/recoverSession/listAgents 增 source | 2 | R4:207（TriPilot 不直连公网单一出口原则）；可拆 TriLC 1＋TriPilot 1 |
| 步 3 | 安全收口增量（读写分离 token，与 bridge-1 ①共享实现） | 0.5-1 | R4:245 |

小计 **4-5 批**。中高置信（本地链路已通到消息级 R2:44，增量全在远端）。**排期解耦点：薄代理先行不等聚合引擎进件**（R4:207 本就定「薄层」），聚合引擎归期 4——可见性不被内核工程阻塞。

### 1.7 白皮书/文档线（R5 §三 9 项两波）

| 波 | 内容 | 批数 | 依据 |
| --- | --- | --- | --- |
| 波 1 先行项 1/2/3/6/7/8/9 | CPO 主笔＋CTO 复核第 5 项；前置＝BusinessStrategy 口径更新（走 R7 线，R5:184） | 1 | R5:109-117/121。高置信 |
| 波 2 后置项 4/5 | §8.1 L1 行排期确认＋CTO-008 段重写（依赖本篇分期定稿） | 0.5 | R5:112-113 |

小计 **1.5-2 批**（架构文档 §4/§5 已并入 1a 叙事批）。

### 1.8 总量表

| 线 | 批数 | 可缓做 |
| --- | --- | --- |
| 改名线 | 6-7 | 叙事面即刻；兼容面可压期 3 |
| 新建线 | 7-8 | 否 |
| bridge 线 | 7-9 | bridge-2 ①可独立先行 |
| 会话管理线 | 6-10 | **是（整线）** |
| 分身调度线 | 2-3 | 否（量小且是 CEO 问题④门面） |
| 上下文可见性线 | 4-5 | 否 |
| 白皮书/文档线 | 1.5-2 | 否（定调后即刻） |
| **合计** | **≈34-44** | 主线（不含会话管理线）≈28-34 |

区间为估计跨度；批可跨期挪动，期分配以 §五为准。

## 二、依赖图

### 硬依赖链（不可换序）

1. BusinessStrategy 口径更新（R7 线）→ 白皮书波 1 / 改名叙事批 / 各 registry 换名（治理依赖：先中央口径后模块 registry，R5:184）。
2. CEO 定调（R7 收口）→ 全部线开工（本树纯分析不开工）。
3. CI 断链修复 → 一切动 CI 的批（TriMMC CI 改名、TriRMC 仓 CI 接线、r21+ 构建）——强制最先（R2:68 / R4 风险 1）。
4. TriRMC 立项（依赖 CEO 确认项 1）→ 接收面 / cron / config-sync 迁移 → 只读投影 API → TriRLC 聚合代理 → TriPilot source 参数（三步串行，R4:202-208）。
5. TriMMC token＋收环 → ssh 隧道客户端 → 三原语联调 → TriMLC bridge 激活（bridge-1 内序）。
6. 死代码 schema 核对专项 → 投影 push 激活（R4 风险 3 前置）。
7. 改名兼容面 → 发布窗口（r21+）→ 装机迁移 → alias 触发式终点（R5:149）。
8. 开业（I5 闭环）→ TriRMC 迁移切换放行（期 1/期 2 互锁门，见 §三.1）。

### 可并行组（无文件 / 无链路交集）

- 组甲（期 1）：白皮书波 1 ∥ 改名叙事 ∥ TriMLC 立项 ∥ TriRMC 立项 ∥ placement 字段 ∥ agent-core 合同设计 ∥ schema 漂移核对。
- 组乙（期 2 内）：TriRMC 接收面迁移 ∥ 投影 push 发送端（TriRLC 侧）改造 ∥ 只读 API 骨架。
- 组丙（跨期）：bridge-2 规范批 ∥ 一切；FADE 流水线批次 A/B ∥ 一切（不同域，见 §三.2）。

### 排期权衡点（一处，本篇选边）

**agent-core 骨架进件 vs TriRMC 生长顺序**：若先进件再建 TriRMC，TriRMC 用新骨架生长更干净，但把最大抽象工程（1.4，6-10 批）插进关键路径，双跑窗口被拉长。本篇选边：**TriRMC 先用现骨架迁移落座（期 2），骨架进件归期 4 渐进 adoption**——理由：parity 禁的是复制重写、不禁先用现骨架；周平面链连续性优先；agent-core 进件无下游硬依赖（1.6 已解耦）。若 CEO 愿付日历代价换架构干净可倒置，代价 ≈期 2 推迟 1-2 周。

## 三、与在排工作的关系

### 3.1 赛博公司开业（I5/链态门）

- 现状【实证=OP 登记】：I1-I4 全部收官（OP doneTrees：I4 全链 PASS 含 Phase D 确认卡）；I5 正式收口挂 CEO 亲测通过后执行（OP risks 2026-08-15 登记），截至本篇未见闭环登记；CFO runtime 上岗已定调并入开业测试（CEO 2026-08-20，OP CFO-ONBOARD-20260819-001）。
- 链路耦合面：开业验收走 TriLC↔TriMC 现链（五维 bundle→git→TriMC config-sync cron→applied.json；I5 链态门 chainState=='ready' 否则 409，R2:64）。TriRMC 的 config-sync 迁移恰好动这条链的接收端。
- 排期关系：**开业必须先于 TriRMC 迁移切换完成（期 1/期 2 互锁门）**——开业是「第一个协同工作」，其验收结论是迁移双跑的对照基线；反序会让验收问题无法归因（链路自身问题 vs 迁移引入问题）。期 1 全部内容零触碰 I1-I4 运行链（叙事/立项/文档均不进 daemon 运行面），可与开业收官并行不阻塞。

### 3.2 FADE 流水线批次 A-D（CEO 已批待复审）

现状：分析入册不开工，**复审前置＝本树定调**（OP FADE-PIPELINE-ANALYSIS-20260821-001：「FADE 流水线执行排期待该设计定调后复审再开工」）。逐批次关系：

| 批次 | 与大改造关系 | 排期建议 |
| --- | --- | --- |
| A 任务落盘 CLI＋平面文件制审核门 | 零文件冲突（TriCompany/周平面域） | 任意期并行，不重排 |
| B 小赛巡检 skill 会话内闭环 | 无直接冲突；巡检规则引用仓路径/模块名，改名叙事批后需同步巡检口径 | 开业后随复审启动，登记改名联动即可 |
| C cron 定时巡检链（等开业/唤起实证） | **落点耦合**：唤起实证对象是 TriMC cron（路径 B 资产），R4 §3.3 裁决该资产迁 TriRMC | 建议「实证先行、实现落 TriRMC」：实证在 TriMC 现址做（验证的是 cron→agent 会话唤起能力，与宿主位置无关），实现批等 TriRMC cron 迁移落座（期 2 后）——避免二次搬家 |
| D CFO 接线（开业后） | 零冲突 | 独立，不重排 |
| 缓做清单（通用 ADE runtime 化 FREEZE 等） | 无冲突 | 维持 FREEZE |

净结论：大改造**不需要重排 FADE 批次 A/B/D**；仅批次 C 实现面建议挂期 2 之后，其先行实证不受影响。FADE 流水线复审（定调后）应引用本表。

### 3.3 AGENTS 对齐 TODO 1-8（CEO 保留）

现状：不开工；TODO 1-8（P0×4/P1×4）CEO 定调点 6 项待确认（OP ALIGN-ANALYSIS-20260820-001；FADE-LEFTOVER 裁决明确「AGENTS.md 对齐 TODO 1-8（CEO 保留）不在裁决范围」）。

关系＝**强协同、建议合批**：

- TODO ⑥ 新模块四件套进管道标配＝TriMLC/TriRMC 立项批的天然载体——新模块从第一天走四件套，否则制造新的游离残留（正是 TODO ② 要清理的对象）。
- TODO ④ 多宿主演进＋宿主退役机制＝「元虚拟可整体换 codex」的治理前置（R4:136 桥越薄替换面越小）。
- TODO ③ TriMC/TriLC 运行时消费 TriCompany contract 与 TriRMC 迁移共用合同面。

建议：期 1 的 TriMLC/TriRMC 立项批按 TODO ⑥ 标准执行（合批省 1-2 批）；TODO 1-8 整体裁决仍留 CEO，不因大改造自动启动。

### 3.4 其他在排项

| 项 | 关系 | 处置 |
| --- | --- | --- |
| session-management P0（两入口 id 同步，CEO 已排 W34） | 同仓同面竞争：与 1.6 可见性线都动 TriLC/TriPilot 会话面 | session P0 先行（既定 W34），可见性线排期 2/3，避免同面并行 |
| CARRY-001 TUI P0（W30 起源，已达 8 周升级线） | 零文件冲突，纯产能竞争（小全/小柯） | 分期产能显式留额或请 CEO 裁决取舍，不让大改造挤死 |
| two-phase-architecture-roadmap v2（训练/生产两套永续系统） | **叙事同构未合流**：元虚拟/元现实 vs 训练/生产实质同一划分的两种词汇 | 期 1 叙事批做交叉引用对齐（风险 14） |
| E2E 深度测试矩阵（28 条 A 级脚本） | 正向资产 | 各期验收复用该矩阵跑回归 |
| 能力差距反向流首轮手动盘点（CEO 已批，小狄清单在案） | 与 TriMMC 能力基准（R4 §3.1 白名单 3）相关 | 期 1/3 并行小项，不冲突 |

## 四、风险清单（R4 八项全收＋补充九项）

R4 §八（R4:255-264）八项全部进排期处置：#1 CI 断链→期 1 前置批；#2 TriMLC/TriModel 混淆→1a 消歧条目；#3 schema 漂移→期 1 专项核对；#4 迁移连续性→双跑窗口＋回滚演练批；#5 session-bridge 正则脆弱→bridge-1 联调批观察项；#6/#7 CEO 确认项→R7（见 §六）；#8 服务器 spawn 门禁→bridge-1 统一执行面批。

补充（R6 新增）：

| # | 风险 | 处置 |
| --- | --- | --- |
| 9 | 双名过渡失控（新名立不住） | 触发式终点写进 alias 条目（R5:149），期 4 收口批核验 |
| 10 | 断链＋改名叠加故障难归因 | 强制排序：CI 断链修复完成前禁动任何 CI 改名批 |
| 11 | 装机迁移半迁移态（新名起不来旧名已删） | 迁移脚本先备份可回滚（复用 -MigrateLegacy 先例 R3:35）；装机迁移独立成批＋实测验收 |
| 12 | 周日 23:00 周平面迁移硬时点 | TriRMC cron 切换窗口只选周日触发完成后；切换后首个周日人工盯守（REHEARSAL-20260813 三端同步＋属主污染教训在案） |
| 13 | 服务器 ssh 窗口排队（TriMMC 收环/token/改名批全依赖） | 窗口需求提前汇总排期；FADE-001 C 类等 ssh 窗口先例参照 |
| 14 | 顶层叙事分叉（whitepaper vs two-phase roadmap v2 两套词汇） | 期 1 叙事批强制交叉引用对齐，R7 收口检查 |
| 15 | agent-core 进件大爆炸（4387 行 app.ts 抽象一步到位） | 合同先行＋单端试点＋conformance suite 再推第二端；整线可缓做 |
| 16 | 产能竞争（大改造 ∥ session P0 ∥ CARRY-001 ∥ FADE 复审） | 分期显式分配；CARRY-001 已 8 周线，期 1 产能优先保开业＋立项轻批 |
| 17 | schema 漂移泛化（投影 push 两端＋TriRMC PG 三方） | 核对专项产出「字段对齐表」作为投影 push 批的验收基线 |

## 五、分期建议（4 期＋压 3 期选项）

每期＝目标一句话＋批数＋关键交付物。日历按周平面周次示意（W35 起），批产能假设小全/小柯主力在岗。

### 期 1「定名立项＋开业互锁」（W35-W36，8-9 批）

目标一句话：四名立住、两新模块按四件套立项、CI 断链修复、白皮书两波修订成稿，开业（I5）先行闭环不受扰。

交付物：白皮书修订稿（草案，CEO 签发）；架构文档 v0.5（模块表＋alias＋消歧＋roadmap 合流）；TriMLC/TriRMC 仓＋四件套＋CI 接线；CI 断链修复 commit；schema 漂移字段对齐表；placement 字段＋CHO 分账上线；agent-core 进件合同设计稿。

批构成：白皮书波 1（1）＋改名叙事（1）＋CI 断链修复（1）＋TriMLC 立项（1）＋TriRMC 立项（1）＋placement 字段（1）＋CHO 分账（1）＋agent-core 合同设计（1）＋schema 核对（1）。

**与开业互锁：是**——I5 闭环是本期收尾门（本期内容零触碰 I1-I4 运行链，可并行不阻塞；开业未闭环则期 2 迁移切换不放行）。

### 期 2「TriRMC 落座＋投影链」（W36-W38，9-10 批，含双跑窗口）

目标一句话：路径 B 资产双跑迁移至 TriRMC（周平面链不断流）、会话投影 push 激活、只读投影 API 上线。

交付物：TriRMC 运行态（接收面＋cron 五段链＋config-sync＋骨架）；双跑切换记录＋回滚演练记录；投影 push 链路（TriRLC→TriRMC PG）；只读 API 三端点。

批构成：TriRMC 迁移主体（5-6：骨架归位/cron 含双跑切换/config-sync/接收面/observability 可选）＋投影 push（2，schema 核对已在期 1）＋只读 API（2）。

**硬时点互锁**：切换窗口避开周日 23:00 触发前；切换后首个周日人工盯守。FADE 批次 C 唤起实证建议本期在 TriMC 现址先行。

### 期 3「可见性打通＋元虚拟成对＋安全收口」（W38-W40，10-13 批）

目标一句话：TriPilot 经 TriRLC 看到 TriRMC/TriMMC 名册与元现实消息正文、bridge-1 建成 TriMMC↔TriMLC、四 controller 安全模型收口、改名兼容面随 r21+ 发布完成。

交付物：source 参数三态＋聚合代理；bridge-1 全链（token/收环/隧道/三原语）；服务器 spawn roster 门禁＋双执行面统一；TriPilot 键迁移＋bin/安装器改名＋装机迁移实测＋服务器侧改名。

批构成：bridge-1（3-4）＋门禁统一（1）＋代理与 source（2）＋安全收口增量（0.5-1）＋1b 三项（3-4）＋1c 服务器侧（1）。

**与发布窗口互锁**：装机迁移随 r21/r22 版本发布执行。

### 期 4「内核收敛＋收尾」（W40-W42，7-12 批，**可整体缓做**）

目标一句话：agent-core daemon 骨架/存储/注册表/聚合合同与引擎进件、两端渐进 adoption、bridge-2 治理流迁 TriRMC、alias 触发式终点收口。

交付物：agent-core 新版本（骨架＋conformance suite）；TriRLC/TriRMC adoption 记录；审核 gate（TriRMC 侧）；alias 终点核验；白皮书波 2 定稿。

批构成：会话管理线剩余（5-9）＋bridge-2（1-2）＋alias 终点（0.5）＋波 2（0.5）。

**压 3 期选项**：期 4 整体缓做（会话管理线 6-10 批＋bridge-2 治理 1-2 批＋收尾 1 批全部后置）→ 主线 28-34 批三期完成。缓做代价＝双端 app.ts 重复面多养一段时间＋元虚拟↔元现实改动回流仍走人工 PR，无功能缺失。

## 六、两个 CEO 确认项的任务量差值

### 确认项 1：路径 B 资产归属（R4:174 建议 R7 显式确认）

- 选 A（迁 TriRMC 为种子，R4 推荐）：TriRMC 6-7 批（§1.2 表），周平面链双跑保连续，parity 合规。
- 选 B（全新建）：9-12 批，差值 **+3-5 批**，另含不可量化代价：重做已投产链的纯迁移风险；运营设施滞留元虚拟侧使「整套换 codex 不真」（R4:167-169）。
- 变体（若 CEO 否决迁移但保 TriRMC 最小）：TriRMC 只做投影 API 宿主 2-3 批（总量最省），但 bridge-3 接收端滞留 TriMMC、五维/心跳/镜像语义错位长期化，后续每批都要绕——不建议，列出仅供完整决策面。

### 确认项 2：元虚拟正文级可见性（R4:219 建议 R7 显式确认）

- 按现方案（元现实全级＋元虚拟名册/摘要级，R4:215-218 表）：**0 额外批**——bridge-1 list 原语已有（R1:13-15），聚合进 TriRLC 代理已在 1.6 步 2 内。
- 若 CEO 要正文级：+2-4 批（fleet ~/.claude 会话文件解析→投影→聚合三段）＋持续性架构债：claude code 会话格式非公开契约（升级即断，R4 风险 5 同族）、每换宿主重写投影层、与问题⑤「自管」定调直接冲突（R4:217-219）。
- 差值结论：本确认项＝「花 2-4 批买一个违背系统定义的能力」，R4/R5 一致建议不承诺；R7 呈报时建议附本差值表。

## 七、使用依据

- 同目录：ceo-redefinition-brief.md；R1-trimc-inventory.md（:13-15 三原语 / :24 路径 B / :48 功能面 23 模块 / :49 部署形态 / :50 无 ssh / :52 双路径隔离）；R2-trilc-agentcore-inventory.md（:8 app.ts / :13 session-store / :39 缺口五项 / :44 recoverSession / :50-57 四单向面 / :53 死代码 / :56 0.0.0.0 / :64 I5 链态门 / :68 CI 断链）；R3-concept-naming-inventory.md（:8-18 白皮书与先例 / :26 混淆排序 / :30-35 影响面六类）；R4-architecture-analysis.md（§2-§八 全文，行号随文标注）；R5-concept-analysis.md（:109-121 修订清单与两波 / :133-149 命名与过渡 / :178 FADE 就绪 / :184 升级线）
- docs/workflow/operating-records/2026-W34/OP-202608-W34-001.json：nextActions（FADE-PIPELINE-ANALYSIS-20260821-001 批次 A-D 与复审前置、ALIGN-ANALYSIS-20260820-001 TODO 1-8、CFO-ONBOARD-20260819-001 开业并入、FADE-STRENGTHEN/LEFTOVER 批次量级）；risks（CEO 两阶段论 two-phase v2、session P0 排 W34、ARCH-20260814-002 WEEKLY_PLANE_ROOT 切断设计、REHEARSAL-20260813 教训、I1-I4 收官与 I5 挂 CEO 亲测登记）
- git：b15e53e2 / 72022a4e（FADE 收口）、de18be3（FADE 加固）——批单位校准证据
- 置信度总标注：批数为【推断】（锚点法估计）；影响面/现状事实为【实证】（引 R1-R5 行号与 OP 登记）；分期为建议案，最终排期归 CEO 定调（经 R7 呈报）
