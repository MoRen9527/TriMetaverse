# TriMMC 7×24 编排运行态设计方案——CTO 技术面评审与定向补全

## 文档元信息

- sourceOfTruth: TriMetaverse/docs/execution/2026-08-24/trimmc-orchestration-design-review-cto.md
- syncMode: source-only
- lastSyncedAt: 2026-08-25
- 版本: v1.0（CTO 技术面一轮评审 + 定向补写）
- 评审对象: `trimmc-orchestration-design.md` v0.1-draft（同目录，本次未改动原文）
- 评审人: 小狄（CTO，TriCompany 技术真源 owner）
- 关联输入: `mmc-host-driver-design-draft.md` v0.1、quad-migration-spec v1.0 §八/§九、server-fleet-m0.md v2026.W33.1、TriMC 现役源码（本日实读，清单见 §六）

## 零、结论总览

**APPROVE with conditions**：方向成立（session 编排层确是当前最大缺口，CEO 四场景一机制解析准确），但 v0.1 对 sg-server 现役资产盘点不全、三处协议级缺陷需先收口才可进入实施派工。

| 类别 | 编号 | 一句话 | 落点节 |
| --- | --- | --- | --- |
| 阻断 | B1 | 现役复用面盘点缺失：src/orchestration 已有 session-bridge 三原语 + /internal/v1/agents 三端点 + cost-controller + 心跳表；新模块不得另起第二编排词汇表 | §1.2 |
| 阻断 | B2 | :8710 公网可达且 /internal/v1/* 全部无鉴权；新增 stop/tail 端点等于把"杀会话"暴露给公网 | §1.5 |
| 阻断 | B3 | 会话间通话原语未定：M1 实证通道是 --fork-session 副本语义（每条消息即 fork），与"自由通话"+编制管理冲突；CC 2.1.227 原生 teams 消息能力未实证 | §1.2 |
| 阻断 | B4 | C-level 随树修订产生自指：编排会话既当关树不变量的检查者又当被释放实例，不变量不可自洽执行 | §1.3 |
| 建议 | S1-S12 | 见各节内联标注（tick 重入互斥、周指针动态解析、systemd scope 隔离、成本骨架复用改造、排程避窗、M3 鉴权门、M4 CEO 门、tail 限流、通知传输方向、git 双写纪律等） | 全文 |

Q-A/Q-B 裁定、M0 命令序列、三项遗漏面补全分别见 §二/§三/§四/§五。

---

## 一、逐节评审

### 1.0 §一/§二（指令解析、现状实盘）——补正后可用

§一解析无偏差。§二实盘表需要补三行事实（均有现役代码实证）：

| 表述 | 实际状态 | 证据 |
| --- | --- | --- |
| "缺口：session 编排层" | 准确但不完整——**编排策略层缺，会话桥原语已在役**：spawnSession/listAgents/sendMessage 三函数 + GET/POST /internal/v1/agents + POST /internal/v1/agents/{id}/message 三端点自 M1 Phase-2 上线 | TriMC src/orchestration/session-bridge.ts L88-115/L121-149/L155-183；src/server/app.ts L118-237 |
| 未提及 | **成本护栏骨架已在役**：estimateCost/checkBudget/recordCost/getBudgetState/getModelTierPolicy（三层预算：公司日/员工日/单任务），但是 Phase-A 内存态骨架 | src/orchestration/cost-controller.ts L49-54/L100-232 |
| 未提及 | **连接态数据源已在役**：MirrorStore 节点心跳表 recordNodeHeartbeat/getNodeHeartbeat/scanStaleNodes，双阈值 30s/180s，POST /internal/v1/heartbeat 已在喂这张表 | src/mirror/store.ts L41-96；app.ts L521-556 |

另登记一条 §二漏掉的自伤面：M1 Phase-2 已知项——bg 会话继承 trimc.service cgroup，trimc 重启连带杀全部会话（server-fleet-m0.md §三.7 在册）。7×24 编排必须显式处置此条（见 S4 与 §5.1）。

### 1.1 §三 模块划分与编排协议

**[阻断 B1] 命名与复用边界**。设计提出进程内新模块 `src/orchestrator/`，而 `src/orchestration/` 已存在且承载 session-bridge/cost-controller/dispatch-proxy 等。两个仅差一个音节的并行编排命名空间必然造成认知与代码双重漂移。裁定：

- 新增组件一律并入现有物理目录 `src/orchestration/`（WorkPlaneWatcher / OrchestratorManager / SessionRegistry / NotifyRouter 作为该目录下新文件）；EmployeeSpawner **不新建**——其职责由既有 spawnSession 承担，设计文档改写为"对 session-bridge 的调用契约"。
- 若确需区分"确定性壳域 vs 会话编排域"，在 orchestration 目录内用子目录或文件名前缀表达，不新开顶层模块名。
- SessionRegistry 与既有 listAgents/buildRegistry 的关系要写明：listAgents 是"claude agents --json 的实时采集"，SessionRegistry 是"编排层自己的运行台账"，两者同步点（spawn 后、每 tick 对账时）必须在设计中定义。

**[阻断 B3] 通话原语未定**。"SendMessage 自由通话协作"一句跳过了一个未实证的机制分叉：

- M1 实证的跨会话通道 = `claude -p --resume <sessionId> --fork-session <msg>`（副本语义：每发一条消息产出一个 fork 副本，回复来自副本而非原会话）。session-bridge.ts L155-183 即此实现。
- 该语义与编制管理直接冲突：fork 出的副本算不算新实例？每次通话一份全量上下文回灌，恰是 spec §八要根治的成本形态。
- CC 2.1.227 是否已有原生 agent teams / 命名会话间直通消息，本次侦察未实证，不得凭记忆断言。

裁定：M0 步骤 0 增加"原生会话间消息原语核对"项（claude --help + 版本 release notes 存档）。核实前，M1-M2 协议限定为**单向派工语义**：编排→员工一次派工一次 fork，fork 回复收割后副本即弃，不登记为编制实例；员工→员工自由通话暂缓开放。若证实原生直通原语存在且不产生 fork，再按 CEO"自由通话"愿景放开并修订本条。

**协议步骤逐条意见**：

1. 步骤 1"读 W35 平面"硬编码了周号。[S2] WorkPlaneWatcher 必须动态解析当前周（ISO 周推算 + README active 指针交叉校验），指针周 != 当前 ISO 周 → 断言失败升级而非猜测续跑。依据：README 指针陈旧 6 周的真实事故（commit b61bbb3b 修正记录在案），待办判定不能信任单一指针。
2. 步骤 3"监听完成信号"缺机制定义。bg 会话无回调，完成信号只能来自：(a) 编排轮询 `claude agents --json` state 字段；(b) transcript 文件 mtime/尾部增长检测；(c) 员工在落盘产物上写约定完成标记（tree-op clones 段 status 流转）。建议 (a)+(c) 双通道，(b) 作僵尸检测输入（见 §5.1）。
3. 步骤 4 git commit+push：fleet 身份的 user.name/user.email 配置现状未确认，M1 前置检查补验（git config 缺失时 commit 失败或顶错身份）。写向纪律细化见 §5.2。
4. [S3] tick 重入防护缺失：上一 tick 的编排会话未退出、下一 tick 到点 → 必须互斥（skip-if-busy + SessionRegistry 中编排槽位检查），禁止并发双编排。
5. [S1] SessionRegistry JSON 落 `$TRIMC_CONFIG_DIR/orchestrator/` 子目录（沿 cron/logs 先例），不散落在配置根；配套独立 logrotate 规则文件（不动 trimc 在册规则，TriRMC 先例口径）。

### 1.2 （并入 1.1；EmployeeSpawner 归并 B1，SpawnRequest 契约沿用 mmc-host-driver §2.5 CHO 登记义务）

### 1.3 §四 C-level 随树修订

**[阻断 B4] 自指缺陷**。修订案"服务器域全员随树生灭（编排/员工一致）"与 spec §八条件 2 组合后自指：关树不变量要求"翻 done 前**由编排层**核对该树全部实例 released"——若编排会话本身是该树实例，它必须在核验自己已释放之后才能释放自己，顺序不可能成立。

裁定修订案改为**双轨生命周期**，同样消除常驻爆窗：

| 角色 | 生命周期绑定点 | 释放动作 |
| --- | --- | --- |
| 员工会话 | 绑树（spec §八原文不变） | 树 close 时由编排销编 |
| 编排会话 | 绑 tick（fresh per tick 本就是设计原意） | tick 结束自然退出；SessionRegistry 编排槽位随进程退出关闭 |

编排会话本来就不跨 tick 存活（OrchestratorManager 每 tick fresh spawn），把它绑到树上反而制造了跨 tick 归属歧义。绑 tick 后"无常驻会话累积"的目标同样达成，且关树不变量保持干净的一对一形状。§四修订文字建议按此改写后再提交小乔/CEO（Q-D）。

Q-D 技术侧输入（供小乔参考，非裁决）：服务器域与本地研发仓域的不对称有工程依据——本地域 CC 会话附着人类协作连续性（打断即损失工作上下文），服务器域知识全在盘上、会话无人类附着，故"服务器域全员生灭、本地域维持豁免"的不对称是合理的，不必强行同步。

[S10] Q-E 技术意见（最终归小乔）：默认 agent 应显式锚定渲染位 `ceo-chief-of-staff`（小贾），理由：三类升级过滤与 carry-over 裁决需要 chief-of-staff 权限框架，通用 default 无升级判断的岗位依据。锚定方式受 B3 同款机制未实证约束（headless 下 pin 会话身份的确切旗标以 M0 步骤 0 核对为准；fallback = brief 指令 + Agent tool spawn 模式）。渲染位新鲜度校验沿用 mmc-host-driver §3.3 锚点校验义务。

### 1.4 §五 观测与通知 API 面

1. **与既有端点的关系必须写明**（B1 延伸）：GET /internal/v1/sessions 与既有 GET /internal/v1/agents 并存时，前者定位为"编排运行视图"（SessionRegistry 投影，含 treeId/state/lastSeen），后者保持"claude 注册表原始视图"。两视图字段映射表应进设计文档，避免消费方（trirlc chat/tripilot）各自猜。
2. **tail 数据源按 spawn 模式分别定义**（S9）：bg 会话 → fleet HOME 下 transcript jsonl 尾读（确定性文件读取，零 LLM）；-p 进程 → 壳捕获的 per-run 日志尾读（command-handler 日志路径先例）。tail 必须限流（n ≤ 200 行），禁整段 transcript 吐出（成本+敏感面双约束）。
3. stop 端点"编排层权限才可调"没有落地机制——当前服务没有任何鉴权中间件。落地方式见 B2。
4. NotifyRouter 连接探测**不需要发明新探测**：MirrorStore.getNodeHeartbeat(nodeId) + scanStaleNodes 双阈值（30s 常规/180s degraded）就是现成的连接态判定，trirlc/tripilot 心跳已在喂这张表。设计文档应改为消费既有心跳表。
5. 笔误：§五"triirlc"应为 trirlc；§五标题行"trimc 新端点"建议标注路由版本（/internal/v2/ 或沿用 v1 追加），避免与 M1 Phase-2 端点语义静默漂移。

### 1.5 §六 安全边界

**[阻断 B2] 公网无鉴权暴露面扩大**。事实链：8710 已在阿里云安全组 + firewalld 双放行且公网可达实测通过（server-fleet-m0.md 条目 2/3），app.ts 全部 /internal/v1/* 路由零鉴权。v0.1 新增 POST .../stop 等于给公网一个"杀任意会话"接口，还可能被滥用触发 spawn 烧 API 额度。这不是理论风险——端口公网可达是已实测事实。

裁定（按优先序）：

1. 首选：app.ts 拆双监听——/healthz 留 8710（兼容面冻结项不动），/internal/v1/* 全量迁 127.0.0.1 绑定的第二监听（如 127.0.0.1:8711 服务端侧，端口号部署窗实测定死）。trirlc/tripilot 观测流经 ssh 隧道或未来 WireGuard 替代面访问。
2. 若拆监听工期不可接受：firewalld 收窄 8710 来源地址 + 最小 token 头校验（X-Trimc-Token，值落 TRIMC_CONFIG_DIR 内 600 权限文件），stop/tail/spawn 三类端点强制校验。
3. 无论哪种，M3（观测端点上线）前必须完成，列入 M3 门禁（S7）。

其余意见：

- execute 权限引用治理 registry 默认策略：同意，但注意服务器域 CC 会话实际权限形态与本地不同（root 下禁 --dangerously-skip-permissions、fleet 下可用——server-fleet-m0.md 条目 10/§三.6），brief 与权限模式选择要在 M1 定型并留档。
- 注入防线：编排 brief 读 docs/ 内容属低风险面，但 experience/ 消费必须挂 spec §9.4 五条款（壳设计 §4.4 已内置读取包装语，编排侧 brief 模板同款引用即可，不另造条款）。
- 凭据卫生：ANTHROPIC_AUTH_TOKEN 经 fleet settings.json 注入（600）已合规；补一条——per-run 日志与 tail 输出不得含 env 值，command-handler 日志模板只记 command 文本的模式保持。

### 1.6 §七 成本预算门

方向正确（CEO 决策项定位准确）。技术补全：

[S5] 不新建机制，复用 cost-controller 三层预算形状，但要如实登记骨架缺口（防止把 baseline 当 production-grade）：

1. 价格表是占位符：PRICING 表无任何 DeepSeek 条目，实际在役模型（deepseek-v4-pro/flash 系）会落到 ?? 5.0 兜底价——数值完全失真（cost-controller.ts L41-47/L78）。价格事实须查权威参考后填数（禁凭记忆），此项与 Q-C 一并呈批。
2. 预算态纯内存，trimc 重启即清零——须持久化到 $TRIMC_CONFIG_DIR/orchestrator/budget-state.json（原子写 + .bak，cron jobstore 同款纪律）。
3. 默认帽硬编码常量——改 env/config bundle 可配（TRIMC_BUDGET_* 族），超限降级动作（停 spawn 保影子）接 OrchestratorManager 准入处。
4. 用量采集源：CC headless JSON 输出含 usage 字段（M0 步骤 2 顺带验证字段名），recordCost 从此处喂入，不用估算值。

### 1.7 §八 分期

| 阶段 | 裁定 | 补强判据 |
| --- | --- | --- |
| M0 | APPROVE + 具体化 | 命令序列见 §四；新增两项判据：agent 渲染位加载证明（步骤 3）、CC 进程 RSS 实测（步骤 4，喂 Q-B） |
| M1 | APPROVE + 补门禁 | 追加：结束后 SessionRegistry 清空核对、CHO 审计 json 与 tree-op clones 段一致性核对、全程零 resume/fork 滥用审计（per-run 日志查证）、RSS/token 实测登记（校准 K 与 Q-C） |
| M2 | FREEZE 至两条前置满足 | 前置 1：§七预算门数值经 CEO 批准生效（原文已有，维持）；前置 2（新增 S6）：watcher 排程避开周日 23:00-23:59 冻结窗口与周日 03:00 disk-hygiene 窗口——无人值守循环绝不能与周迁移主路径同窗竞争 operating-records 写权 |
| M3 | APPROVE + 加门禁 | S7：B2 整改（鉴权/拆监听）作为 M3 开跑前置判据；tail 限流参数化 |
| M4 | ESCALATE 到 CEO 门 | agent_close 裁决面移交给服务器会话触碰 spec §5.1 边界（agent 化迁移长期影子位、转正需 CEO 另行裁决）——M4 从"阶段"升格为"带 CEO 放行门的里程碑"，判据除原文外加"spec §5.2 影子判据状态显式核对" |

---

## 二、Q-A 技术裁定：fleet 侧 CC 模型接入路径

**裁定：维持现役直连 env 模式（settings.json env 块），M0-M2 不引入 TriModel 服务域依赖。TriModel 3333 配置面列为 P2 条件触发项；8008/TriStaciss L2 路由不复活。**

事实基础（全部现役证据）：

1. **现役模式已是直连且实证跑通**：fleet 账号 ~/.claude/settings.json env 块照抄本地 13 键，其中 `ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic` + `ANTHROPIC_AUTH_TOKEN`；root 与 fleet 双账号 claude -p 最小对话均验证通过；API 往返基线 2.44s（deepseek-v4-flash[1M]）（server-fleet-m0.md 条目 10/12、§三.6）。编排器经 runuser fleet + HOME=/home/fleet 拉起的 CC 自动继承该配置，**零额外接线**。
2. **TriModel 3333 是配置分发面，不是推理面**：其 server 仅提供 /health、/v1/models、/v1/config/keys——客户端取 key 后直连 provider，业务流量明确不过此服务（TriModel/src/server.ts L13-14、L41 注释"Business traffic does NOT flow through this server"）。即使接入，CC 的推理连接仍是直连 provider——3333 只改变 key 的分发方式。
3. **8008 是 TriStaciss 残影**：trimetaverse provider 默认 base url http://127.0.0.1:8008/v1（TriModel/src/config.ts L54），对应 TriStaciss 平台路由——该服务于 2026-08-11 已从 sg-server 完整清线下线（server-fleet-m0.md §三.5），env.ts 里 tristacissBaseUrl 的 8008 默认值同理是遗留默认。以此为由头恢复任何 8008 依赖都与清理裁决相逆。
4. **红线与成本约束**：元虚拟不自建内核 + R3 不改兼容面 + 低成本约束下，为一个尚未需要的 key 分发能力引入新常驻服务（部署、守护、自身攻击面）负收益。

P2 触发条件（满足任一再评估，评估时 loopback-only 部署 127.0.0.1:3333）：

- 多模型分层成为真实需求（如 watcher tick 用 flash 档、编排用 pro 档，需要集中 tier 策略与 key 分离管理）；
- key 轮换/多账号额度池化管理需求出现（单账号直连的额度管理先行由壳侧 K + 成本帽承担——**无论哪条接入路径，额度硬约束都只能靠壳侧执行，provider 侧只有账号级限额**；这条同时回答"接入路径选择不解决 §七"）。

## 三、Q-B 核算：并发会话上限 K

已知规格（server-fleet-m0.md §二）：sg-server 4 核 8G、40GB 盘（清理后约 27G 余量）、出网 5Mbps（API 调用小包不受限）。

内存账（工程估算量级，M1 以实测校准）：

| 分项 | 估算 |
| --- | --- |
| OS + 内核 + 页缓存保留 | ~500MB |
| k3s control-plane（apiserver/controller/scheduler/containerd/etcd） | ~900MB |
| docker daemon | ~100MB |
| postgres 容器 | ~100MB |
| trimc.service node 进程 | ~150MB |
| **非 CC 合计保留** | **~1.75GB** |
| 可分配给 CC 进程池 | ~6GB，按 75% 利用率上限取 **~4.5GB** |
| 单 CC 会话（headless，agentic loop 中段典型 / 大文件读取峰值） | ~300-600MB / ≤1GB，规划均值 550MB |

**K_default = 4（1 编排 + ≤3 员工）**；绝对上限 6，且上调前置 = M1 实测 p95 RSS < 400MB。

CPU 论证：CC 会话主要时间在等 API 往返（RTT 2.44s 基线），属 IO-bound；工具执行的 CPU 突发短促。4 vCPU 减去 k3s 常驻占用后支撑 4 并发会话无压力，CPU 不是首要约束；内存峰值叠加才是。

执行机构三件套（写入 §六）：

1. **准入控制**：OrchestratorManager spawn 前 check SessionRegistry 计数 ≥ K 即拒绝并把任务排队下一 tick（拒绝不是失败，是节流）。
2. **cgroup 限位 + 重启隔离一并解决**（S4）：所有 CC 子进程经 systemd-run --scope --slice=trimcc.slice MemoryMax=5G CPUQuota=300% 拉起——既封内存总闸，又修复 M1 已知的"bg 会话继承 trimc.service cgroup、重启连带杀"缺陷（server-fleet-m0.md §三.7）。scope 化后 trimc 重启不再杀会话，僵尸回收责任完全归 reaper（§5.1）。
3. **会话级超时**：员工会话默认 timeoutMs 30min、编排会话 25min（< 30min tick 周期），到期整组 SIGKILL（detached 进程组肌肉记忆照用）。

联动约束：每树 CHO 批次的 planned clones 数 ≤ K-1（编排常驻 1 槽）；磁盘观察项——transcript 在 fleet HOME 下累积，40GB 盘纳入每周 disk-hygiene 报告一行。

## 四、M0 验证清单具体化（hello 任务精确命令序列）

> 操作命令语境遵守防混纪律：只出现物理旧名。以下命令在 ssh sg-ecs-server 会话内执行；所有产物文件名带 `[shadow]` 前缀（引号包裹），落 `/srv/fleet/shadow-root/m0/` 占位影子目录（正式 shadow-root 路径以 quadmig-1 Q1-2 产出为准，换算关系登记进 M0 报告）；不进 dev 分支。

```bash
# ── 步骤 0：CLI 旗标核对（一次性，输出存档；后续脚本以 help 实样为准，禁凭记忆写死旗标）──
/opt/claude-code/claude --version
/opt/claude-code/claude --help > /tmp/shadow-claude-help.txt 2>&1
grep -nE 'output-format|max-turns|allowedTools|permission-mode|--agent|agents' /tmp/shadow-claude-help.txt
# 同时核对：2.1.227 是否存在原生会话间消息原语（B3 核对项）；headless 下 pin agent 身份的旗标（S10 核对项）

# ── 步骤 1：身份/配置静态检查（只查存在性与权限位，不回显密钥值）──
runuser -u fleet -- bash -c 'echo HOME=$HOME; stat -c "%a %n" ~/.claude/settings.json ~/.claude.json; grep -c ANTHROPIC_BASE_URL ~/.claude/settings.json'
# 判据：HOME=/home/fleet；settings.json 权限 600；BASE_URL 键计数 ≥1

# ── 步骤 2：headless 读盘回显（hello 本体）──
STAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p /srv/fleet/shadow-root/m0
runuser -u fleet -- bash -c 'cd /srv/fleet/TriMetaverse && /opt/claude-code/claude -p "读取 docs/workflow/operating-records/README.md 前 10 行并逐字回显，不做任何其他动作" --output-format json --max-turns 4 --allowedTools Read' \
  > "/srv/fleet/shadow-root/m0/[shadow]hello-${STAMP}.json" \
  2> "/srv/fleet/shadow-root/m0/[shadow]hello-${STAMP}.err"
echo "exit=$?"
# 旗标名若与 2.1.227 help 不符（如 allowed-tools 连字符形），以步骤 0 实样修正；只读 hello 场景禁用 skip-permissions 类全放开

# 结果结构化抽取（JSON 字段名以实样为准，下方为常见形状）
python3 - <<'PY'
import json, glob
f = sorted(glob.glob('/srv/fleet/shadow-root/m0/*hello-*.json'))[-1]
d = json.load(open(f))
print('file:', f)
print('model:', d.get('model'))
print('session_id:', d.get('session_id'))
print('usage:', d.get('usage'))
print('content_head:', str(d.get('result'))[:200])
PY

# ── 步骤 3：agent 渲染位加载证明（子代理管道；同时预演编排默认身份）──
runuser -u fleet -- bash -c 'cd /srv/fleet/TriMetaverse && /opt/claude-code/claude -p "用 Agent 工具起一个 subagent_type=ceo-chief-of-staff 的子代理，其任务只有一句：原样回显 M0-AGENT-PIPE-OK。把子代理回复原文返回给我。" --output-format json --max-turns 8' \
  > "/srv/fleet/shadow-root/m0/[shadow]hello-agent-${STAMP}.json" \
  2> "/srv/fleet/shadow-root/m0/[shadow]hello-agent-${STAMP}.err"

# ── 步骤 4：进程内存采样（喂 Q-B 校准；另开终端在步骤 2/3 运行期间执行）──
ps -o pid,rss,etime,args -C claude
# 每 10s 采样一次至会话结束，Max RSS 记入 M0 报告
```

判据表（M0 行判据的具体化 + 扩充）：

| # | 判据 | 通过条件 |
| --- | --- | --- |
| 1 | hello exit 0 | exit=0 且 .err 无致命错误 |
| 2 | 回显正确 | JSON result 内容 == README 前 10 行（diff 比对） |
| 3 | 结构化字段在册 | model/session_id/usage 三字段非空（字段名以实样为准） |
| 4 | agent 管道通 | 步骤 3 输出含 M0-AGENT-PIPE-OK；subagent_type 被拒时降级 general-purpose 复测，并把"指定员工渲染位加载失败"登记为疑点（关联 Q-E） |
| 5 | 模型/额度确认 | model 字段落 DeepSeek 系档位；RTT 对照 2.44s 基线同量级；DeepSeek 控制台人工核对余额与限流档位并登记数值（无稳定公开余额 API 则不做脚本化探测——禁编造端点） |
| 6 | 资源基线 | 步骤 4 Max RSS 数值登记（K 核算校准输入） |
| 7 | git 身份预检 | git -C /srv/fleet/TriMetaverse config user.name/user.email 非空（M1 commit+push 前置） |

产出物：上述 7 项结果汇总为 M0 报告（落 shadow 目录 + 周平面 OP 登记），M0 关闭。

## 五、遗漏面补全

### 5.1 编排/员工会话的超时与僵尸回收

四类僵尸形态与处置（reaper 随 WorkPlaneWatcher 同 tick 扫描，逻辑确定性、零 LLM）：

| 形态 | 检测 | 处置 |
| --- | --- | --- |
| 进程死、台账开 | SessionRegistry 有条目但 pgrep/transcript 无进程迹象 | 标 dead，关槽位，按该节点失败策略走替换计数（spec §八条件 9） |
| 进程活、无进展 | transcript mtime/tail 停滞 > 30min（spec §八条件 9 同款阈值） | 标 stalled → 拆节点替换：最后 artifactCommit 为界回收，新会话读盘三件接续；旧 transcript 只归档 |
| 整树僵死 | 全员 idle 且进程活 > 2h | 标 stalled 重规划 + 升级小贾（spec §八条件 9 直译） |
| 树已 close 但实例残留 | 关树核验时 SessionRegistry 该 treeId 非空 | fail-fast 拒绝关树（RosterGate 先例），强制释放 + CHO 告警 |

trimc 重启对账：启动时 SessionRegistry × claude agents --json × 进程表三方 reconcile。S4 scope 化之前，重启=全会话死亡是预期路径（cgroup 连带），对账即全清重登记；scope 化之后改为逐条核对。

编排会话自身超时：25min（< tick 周期）整组 SIGKILL；连续 2 次 tick 编排超时 → NotifyRouter 邮件告警并自动降级暂停 watcher（防编排自身成为死循环源）。

### 5.2 git push 冲突（本地与服务器同时写 dev）

裸仓无锁，双写冲突形态 = 后推方 non-fast-forward 被拒。纪律五条：

1. **禁 force push**（双侧，含 --force-with-lease）；冲突唯一出路 = pull --rebase → 重试，≤3 次仍败 → 邮件升级人裁，绝不进入自动对抗循环。
2. **文件域分区**：服务器会话只写 trees/<treeId>/ 与其承接的 execution 文档；week-plan.md 修改限定追加式段落；本地侧（人类+本地 CC）在服务器活跃窗口内避让同一文件的改写。分区清单进 brief 模板。
3. **时间窗互斥**（S6 延伸）：周日 23:00-23:59 冻结窗口内 watcher 全停（主路径五段链独占 operating-records 写权）；周日 03:00 disk-hygiene 窗口同样避让。
4. push 失败重试期间持锁该树的写权标记（SessionRegistry 树级 lock 字段），防第二会话在同一树叠加写。
5. 观测：push 冲突计数进周报一行（趋势项，非门禁）。

### 5.3 SessionRegistry 与 §八 CHO 台账的关系——三分账制

**分账，不是投影替代。** 三本账各司其职，与 spec §八条件 3 完全对齐：

| 账 | 性质 | 真源内容 | 变更权 |
| --- | --- | --- | --- |
| CHO 审计 json | **权益真源** | CLONE_BATCH_REQUEST/APPROVAL、批次挂 treeId、配额与审批链 | CHO 审批流 |
| tree-op.json clones 段 | 树内投影 | instanceId/plane/roleId/taskRef/spawnedAt/releasedAt/status | 编排会话（树内） |
| SessionRegistry | **运行态投影** | sessionId/agentId/pid/state/lastSeen/lock——纯进程事实 | 仅编排器确定性代码 |

判定规则三条：SessionRegistry 无任何权益效力（不能凭它证明"合法在编"，只证明"进程在跑"）；spawn 动作必须先有 CHO 批次 ref 再动 Registry（无批次 ref 的 spawn = 违例，直接拒绝）；周度对账在既有"已关树未释放实例数=0"之上加两条——Registry 开放条目必须有批次 ref 映射、CHO released 而 Registry 仍 alive = 泄漏告警。

### 5.4 新发现：NotifyRouter push 传输方向不成立（NAT）

设计默认"会话连接中走 trirlc/tripilot 推送"，但现役流向全部是本地→服务器的 outbound POST（heartbeat/mirror/events，G3 在册指向 trimc:8710）；sg-server 无法主动穿过 NAT 发起到本地 PC 的连接——**服务器侧不存在可用的 push 传输**。

[S11] 两条候选（M2 前定案）：

1. **推荐：heartbeat 响应捎带**（pull-as-push）——POST /internal/v1/heartbeat 响应体已有 `commands: []` 预留字段（app.ts L552），NotifyRouter 把待推通知入队，TriLC 心跳间隔级延迟（分钟级）取走并落桌面通知。零新连接、零 NAT 问题、复用现役契约。
2. SSE 长连接反向推送（TriLC 主动连 trimc 挂流）：真推送但引入连接管理复杂度，M2 不做。

SMTP 回落通道已实证（QQ SMTP sent），维持。升级事件时效要求若未来提高到秒级，再议选项 2。

### 5.5 其他小项

- [S12] notify 凭据复用：NotifyRouter 邮件通道读 TRIMC_CONFIG_DIR/notify.json 既有配置（只读），不新增凭据存放点。
- tick 周期 N 未定值：建议 30min 起（M2 观察一周后调），与编排超时 25min、stalled 阈值 30min 保持整数倍关系便于推理。
- 设计文档 §三 ASCII 图中 EmployeeSpawner 按 B1 归并后重绘。

## 六、使用依据

| 依据 | 版本/位置 | 用途 |
| --- | --- | --- |
| trimmc-orchestration-design.md | v0.1-draft，docs/execution/2026-08-24/ | 评审对象 |
| quad-migration-spec.md | v1.0（已签发），同目录 | §八十条/§5.1-5.2/兼容面清单/冻结窗口/§9.4 |
| mmc-host-driver-design-draft.md | v0.1-draft，同目录 | R1-R3 红线、§2.5 CHO 登记义务、§3.3 锚点校验、§4.4 注入包装 |
| server-fleet-m0.md | v2026.W33.1，docs/execution/ | 服务器规格、fleet 账号、CC 认证 env、RTT 基线、TriStaciss 下线、cgroup 连带杀已知项 |
| TriMC src/orchestration/session-bridge.ts | 现役源码（本日实读） | B1/B3：spawn/list/send 三原语、--fork-session 副本语义 |
| TriMC src/server/app.ts | 现役源码 | /internal/v1/agents 三端点、trimodel 引用、commands[] 预留字段、零鉴权事实 |
| TriMC src/orchestration/cost-controller.ts | 现役源码 | §七：三层预算骨架与占位价格表事实 |
| TriMC src/mirror/store.ts | 现役源码 | 心跳表双阈值扫描（NotifyRouter 复用点） |
| TriMC src/config/env.ts、src/config-sync/default-model.ts | 现役源码 | 8008 遗留默认、模型三级解析 |
| TriModel src/server.ts、src/config.ts | 现役源码（file:../TriModel 依赖，TriMC package.json L28） | Q-A：3333 配置面定位、provider 结构 |
| commit b61bbb3b（README 指针陈旧 6 周修正） | 本仓 git log | S2：周指针不可信单一来源依据 |

## 评审记录

| 轮次 | 评审人 | 结论 |
| --- | --- | --- |
| 技术面一轮 | 小狄（CTO） | APPROVE with conditions——阻断 4（B1-B4）/建议 12（S1-S12）/Q-A·Q-B 已裁/M0 清单具体化/遗漏面 5 项补全；原文件 §十评审记录行由编排层回填 |
