# R8 场景 2 技术设计：k8s pod daemon / 随处接入 / --reconnect / pod 分身（2026-08-21）

分身：CTO 小狄（TMV-R-8）｜性质：场景 2 技术设计与覆盖分析（CEO 2026-08-21 新增），非实施决定｜排期影响归 §五，与 R6/R7 联审

## 文档同步元信息

- sourceOfTruth: docs/workflow/operating-records/2026-W34/trees/tmv-minimal-restructure-analysis/R8-scenario2-design.md
- syncMode: source-only
- lastSyncedAt: 2026-08-21

输入：CEO 场景 2 原文（编排层转述）＋ R1/R2/R4/R6（同目录）＋ 本篇补核实证（TriMC/k8s/trimc/ 五文件）。方案选项＋推荐＋理由，事实引 R1/R2/R4/R6 行号；【实证】=文件可查（含本篇补核）／【推断】=推断需核实。理念价值判断归 R5，本文不做。

## 〇、场景 1 衔接与场景 2 定位

**场景 1（元虚拟模拟云＋本地协同→结论指导元现实）已由 R4 覆盖**：服务器↔本地的元虚拟协同＝bridge-1（ssh 隧道＋三原语，R4:69-89），实验结论跨系统流转＝bridge-2（git 仓主信道，R4:91-109），R5 已完成理念侧论证——本篇不重复。

**场景 2 定位判断（本篇总纲）**：CEO 想象的「k8s 跑 agent-core daemon 的 pod＋随处接入＋resume/reconnect＋pod 分身」不是新系统，是**元现实服务域 TriRMC 的部署形态与远程接入面**：

1. 「agent-core 的 daemon 在 pod」＝TriRMC 容器化部署——R4 §3.3 已裁决 TriRMC 承接路径 B 资产为服务域种子（R4:165-169），R6 1.2 方案 A 已排 6-7 批；k8s/docker-compose 资产已在（R1:49，本篇补核五文件明细，§4.2）。
2. 「原来是服务域和本地域协同」——CEO 记忆正确：R4 §2.3 bridge-3 即此设计（心跳/镜像/投影 push/只读 pull 四面，R4:113-126），parity 文档为合同基座。本篇 §一验证该设计在场景 2 下仍成立，并裁决 PC 分身形态。
3. 场景 2 的真实增量有三：**--reconnect 会话接管**（§二）、**任意入口接入**（§三）、**pod 水平扩展语义**（§四）；PC 分身形态（§一）是裁决项非新建项。

## 一、pod 落 PC vs 本地 daemon 协同（CEO 主问）

### 1.1 任务-资源亲和矩阵

「任务适合本地跑」（CEO 例：本地写代码）的资源需求逐维对比：

| 资源维度 | 方案 A：本地 daemon（TriRLC 原生进程） | 方案 B：pod 落 PC（容器执行） |
| --- | --- | --- |
| 本地文件系统 | 原生完整访问（filesystem 工具直访工作区，17 内置工具 R2:21） | 需卷挂载＋Windows→容器路径翻译；WSL2 跨界 IO 性能损耗【推断，未实测】 |
| IDE 集成 | TriPilot 直连回环 127.0.0.1:8711（R2:43） | 容器端口需 NAT/转发，链路脆弱 |
| claude code 宿主（元虚拟协作面） | 本地宿主可直接协作（TriMLC 形态，R4:247） | 容器内 ~/.claude 与宿主会话体系割裂 |
| 离线能力 | 完全离线可用 | 镜像拉取需网络；运行期可离线 |
| PC 算力利用 | 原生，零损耗 | 可用，多一层 VM 开销 |
| 环境一致性（与服务器同构） | 无（Windows 原生 ≠ 服务器 Linux 容器） | 有（本维 B 唯一优势） |
| 沙箱隔离（不受信代码） | 无（进程级） | 有（容器级） |

**判读**：写代码类任务 7 维中 5 维 A 断然占优；B 的两项优势（环境一致＋沙箱）在**服务器容器上同样可得**（docker-compose/k8s 已在，R1:49）——即 B 落 PC 的相对价值仅剩「用这台特定 PC 的算力」。而算力维度 A 同样原生可用且无虚拟化损耗。**矩阵结论：CEO 例举的「本地写代码」任务画像，容器化恰恰隔离了它最需要的资源（本地文件/IDE/宿主）——编排层初判成立**。置信度：高。

### 1.2 Windows PC 容器化的实际成本

- **运行时底座重量**：Windows 容器化＝WSL2 轻量 VM 或 Docker Desktop（内嵌 WSL2）——常驻 vmmem 进程内存占用 GB 级、占用宿主虚拟化特性【推断：通用工程事实，未在本项目目标 PC 实测】。
- **装机负担**：需启用虚拟化平台特性＋WSL2 内核更新＋Docker Desktop 安装（数 GB）；企业策略环境可能禁用。现役 TriCade 装机零容器依赖——daemon 为 Windows 原生守护注册（schtasks，任务名 "TriLC Daemon"，R2:9；install-tricade.ps1 `-InstallService`，CLAUDE.md 命令面），「MSI 装完即用」形态会被推翻。
- **休眠/关机行为**：PC 合盖/睡眠→WSL2 VM 冻结→pod 内进程挂起；k8s 语义（liveness 失败→重启/驱逐）对「用户随时关机的个人 PC」失效——PC 不是可靠的调度资源池【推断】。
- 结论：PC 容器化的引入成本是「装机体＋运维体」双增，收益仅 §1.1 两维。

### 1.3 与 R4 placement 字段的融合

R4 §四 placement 四值 `mainControllerOnly | preferServer | preferLocal | either`（R4:187）＋ CHO 按域分账（R4:188）。

**裁决：四值不动，不细分 daemonLocal vs podEdge。理由**：

1. placement 是岗位级 JD 声明（固定资产层），表达的是**资源域偏好**（服务器算力 vs 本地就近），不是运行时形态指令；执行形态（原生进程 vs 容器）是 TriRLC 本地运行时的实现细节。
2. 若 JD 层出现 daemonLocal/podEdge 二值，岗位定义者必须理解运行形态概念——违背「岗位说明书」抽象层级；资源画像已有既定方向（clone-dispatch §4.6 resourceProfile，R4:187 引）。
3. 容器形态若未来需要，归 resourceProfile 可选维度（如 `runtimeForm: native | container`，MVP 只有 native 默认值），触发者应是任务沙箱画像而非域偏好。

**either 语义确认**：＝CHO 分账裁决（按域编制总量分账后择域落位，R4:188），不是自动负载均衡，也不是 k8s 调度语义（§4.4）。

**podEdge 的架构归位（关键区分）**：CEO 说「直接分过来一个 pod」有两种可能形态，须分开裁决：

- **B1（否决）：PC 加入服务器 k8s 集群被远端调度**——PC 在 NAT 后不可正向调度；节点可靠性问题（§1.2）直接进控制面；证书/注册/网络打通全是新增运维面。
- **B2（可选第三形态，MVP 不做）：TriRLC 在本机派生的边缘容器执行单元**——TriRLC daemon 常驻原生（管本地资源与聚合代理），仅在「无本地资源依赖＋要本机算力＋要沙箱隔离」的任务画像时以容器形态起分身会话。复杂度归 TriRLC 本地管辖，无集群面。

### 1.4 双 daemon 协同 vs pod 边缘化：复杂度对比

- **双 daemon 协同（A）**：协同面＝R4 bridge-3 四面，其中三面已运营（心跳/镜像/events replay，R2:50-57），第四面（只读投影）为期 2 新增（R6 §五期 2）；写权威按域分账已定（parity §5，R4:126）。**复杂度已被 R4 架构消化，剩余是执行量不是设计量**。
- **pod 边缘化（B1）**：集群注册/证书轮换/反向网络通道/不可靠节点驱逐处理/Windows 节点支持限制——全为新增运维面，且与「PC 是用户日常机器」根本冲突。
- **B2**：保留 Docker Desktop 依赖（§1.2 成本仍在），但无集群面——仅当沙箱任务画像实际出现才值得。

### 1.5 裁决与混合规则

**推荐：方案 A——本地写代码类任务走本地域 daemon（TriRLC 原生），原「服务域＋本地域协同」设计正确，场景 2 不推翻它**。pod 落 PC（B2 形态）列为本地域可选第三形态，MVP 不做；B1（PC 入集群）否决。置信度：高（本地资源亲和判断）；中（B2 画像出现频率——当前无实证任务需求）。

混合裁决规则表（什么任务走哪条）：

| 任务画像 | 走向 | 依据 |
| --- | --- | --- |
| 需本地文件/IDE/宿主（写代码类，CEO 例） | TriRLC 原生 daemon（主路径） | §1.1 矩阵 5/7 维占优 |
| 7×24 / 公网面 / 服务器数据源 | TriRMC 服务器容器 | R4:159 服务域 adapter 定位 |
| 不受信代码 / 需沙箱 | **服务器**容器（compose/k8s 已在，R1:49），不落用户 PC | 沙箱不必牺牲装机形态 |
| 无本地依赖＋必须用特定 PC 算力＋要隔离 | podEdge（B2），可选第三形态，MVP 不做 | §1.3/§1.4 |

## 二、--resume / --reconnect 会话连续性设计

### 2.1 语义分档

- **--resume**：恢复**已结束**会话继续（历史重载＋续跑）——claude code 已有（session-bridge send 即 `--resume <sessionId> --fork-session`，R1:15）。
- **--reconnect**：接管**正在运行**的会话（live session takeover）——CEO 提议的新参数，本节主设计对象。
- 中间态（运行中会话的只读观察）＝SSE 订阅＋投影，已有大半基础（§2.2）。

### 2.2 TriLC 现有基础与差距

**已有【实证 R2】**：

1. 会话生命周期独立于客户端连接——submitTask 后台执行模型，daemon 侧持续运行，客户端断开不影响执行（R2:44＋runtime/ 任务执行壳 R2 §一）。**这是 reconnect 的天然地基：TriLC 模型下「接管正在运行的会话」不需要改造执行面，只需要改造观察/交互面**。
2. SSE 流订阅（streamSession 六事件，R2:44）。
3. recoverSession 拿回任意会话 session＋messages 全量——消息级恢复已在（R2:44）。
4. fork（从既有会话分叉，R2:44）。

**缺（R2 未记载，标待核）**：

| # | 缺口 | 说明 |
| --- | --- | --- |
| 1 | SSE 重连游标 | 六事件未见游标语义；SSE 协议原生 Last-Event-ID header，服务端重放窗口实现待核 |
| 2 | 消息单调序号 | session-store schema v2（sessions＋session_messages，R2:13）是否有 per-session 单调 seq 待核——**与 R6 1.3 bridge-3 ①schema 漂移核对专项（R6:69）是同一专项，可合批** |
| 3 | 多客户端并发订阅 | 同一会话多订阅者行为未记载 |
| 4 | 接管 vs 旁观角色 | interactions 用户问答回答权（R2 §一）现模型假设单客户端 |
| 5 | 客户端身份 | 全仓无 token/鉴权（R2:23）——takeover 需最小身份声明，token 是共同前置（§3.3） |

### 2.3 实现设计建议

**reconnect＝带游标的 SSE 重放＋订阅移交**（推荐方案，置信度中高）：

1. 客户端持久化 sessionId＋lastSeq（游标）。
2. 重连时带 `since=lastSeq`（或 SSE Last-Event-ID header）请求 `GET /sessions/{id}/stream`。
3. daemon 从 session_messages 重放 `> lastSeq` 消息（重放窗口），发 replay-done 边界事件，再接续 live 流——边界事件防重放/live 交界处乱序或漏发。
4. 交互权：**session 级单写者锁＋多读者广播**——读面（流订阅）允许多客户端并发；写面（interactions 问答回答、send 指令）同一时刻一个持有者，后连者 takeover 抢占式获得锁＋被顶替方收通知（符合「手机接管 PC 会话」直觉）。
5. 服务器侧 TriRMC 同构：reconnect 语义归 daemon 骨架层与存储 repository 合同（R4:151-152），PG adapter 天然支持任意实例重放——跨 pod 恢复复用同一底座（§4.1）。

**resume 的 MVP 承载**：用 fork 语义承载（fork 已有，新 sessionId＋血缘保留，R2:44），原生同 id 续跑后置。理由：agent loop 续跑需消息历史重注入＋上下文重建，fork 已是该语义的安全实现（新会话＝干净状态＋历史前载）；「id 连续性」是体验优化非功能缺口。置信度中高。

**底座统一（重要）**：重放游标、投影 push（R4 §五）、recoverSession 三面共用 session_messages 单调 seq——一个序号底座喂三个能力面，seq 核对专项一次投入三处收益。

### 2.4 与 R4 会话投影的关系

| 面 | reconnect（本节） | 投影（R4 §五） |
| --- | --- | --- |
| 性质 | 交互面（写指令＋live 流接管） | 观测面（跨域只读，R4:202-208） |
| 客户端 | TriPilot/TUI/web 交互面板 | web 只读面板/聚合代理 |
| 共享 | 会话存储底座＋同一 seq | 同左 |
| 不共享 | 交互权锁、live 接管 | 投影不做交互权、容忍延迟 |

手机「看」场景走投影面，手机「接管」场景走 reconnect 面——两面不混，安全边界也分别收口（§3.3）。

## 三、任何入口接入（PC / 手机）

### 3.1 现有入口盘点与缺口

【实证 R2】TriPilot（VSCode/VSCodium 扩展，回环直连 127.0.0.1:8711，R2:43）、TUI（Ink 终端，R2:21）、CLI（trilc 入口，R2:21）。跨机器入口＝零（「看到所有 agent 上下文」现只限本机本 daemon，R2:45）。

### 3.2 入口架构方案

- **协议：HTTP＋SSE 不变**——浏览器 EventSource 原生支持 SSE；两 daemon 已同构此协议（R4:124「bridge-3 无需引入第二协议」同理适用于客户端面）。不引入 websocket/gRPC。

**方案 A（推荐）：薄 web 面板＝第二客户端形态**——静态页（fetch＋EventSource）消费既有面：只读投影 API（期 2 交付，R6 §五期 2）＋reconnect 面（§二）＋interactions。只读观察面板落 TriRMC（数据大本营、与投影 API 同域）；交互面板 MVP 仅 PC（TriPilot），手机交互随 reconnect＋token 成熟后开。不建独立 API 网关、不建 BFF。

**方案 B（否决）**：手机原生 app——MVP 无必要，web 面板零安装已覆盖场景。
**方案 C（否决）**：独立网关服务——违背单一出口原则（TriPilot 不直连公网、代理模式，R4:207）；聚合代理已在 R4 §五步 2，网关＝多余一层。

**与 TriPilot 的关系**：source 参数三态（local | trirmc | trimmc，R4:207）是客户端协议扩展；web 面板与 TriPilot 是同一聚合代理的两个消费者，代理天然多客户端，TriPilot 零额外改动。

### 3.3 安全模型路径

R4 §七已定基线：TriRMC 禁裸公网、回环或内网面＋读写分离 token（R4:244-247）；TriRLC 保持回环＋出向代理 token（R4:246）。手机接入路径三选：

| 选项 | 形态 | 裁决 |
| --- | --- | --- |
| 局域网直连 | 同网段访问＋token，绑定从回环扩内网面 | **MVP 最小形态**——增量 0.5 批并入期 3 安全收口批（R6:100-101） |
| overlay VPN（Tailscale 类） | 设备组网后走内网面，零公网暴露 | **跨网接入的缺省答案**——纯部署配置不占批；符合 R4:245 禁裸公网 |
| 反代＋TLS＋token | 公网域名经 caddy/nginx | 留给对外演示场合，MVP 不建 |

**不过度设计声明**：MVP 只做「局域网＋token」；token 是共同前置（现零鉴权，R2:23/R2:56），reconnect 的 takeover 身份声明与远程读面共用同一 token 批。

### 3.4 排期互锁

session-management P0（两入口 id 同步，CEO 已排 W34，R6:189）与本节 web 面板同属会话客户端面——沿用 R6 §3.4 同面竞争避让原则：session P0 先行，web 面板排期 3 后。

## 四、pod 水平扩展（分身到更多服务器）

### 4.1 无状态/有状态分析与状态归属

- agent-core＝执行内核，无状态（R4 §3.2 裁决表：存储合同进 agent-core、实现留端，R4:152）。
- 有状态＝会话存储＋**会话执行态**：消息已持久化（SQLite/PG），但 loop 执行态在进程内（TaskRuntime 状态机＋runtime 执行壳，R2 §一）——多 pod 时执行态不迁移。

**方案 A（推荐）：多 pod 共享 PG＋会话粘性调度**——每 pod 无状态启动，会话粘性绑定执行 pod；pod 挂→会话标 recoverable→任意 pod 经 recover 语义重建（recoverSession 的跨 pod 扩展，R2:44；PG 侧重放复用 §2.3 同一游标底座）。符合 R4:152/159 存储 adapter 裁决，投影/可见性单路径不被复杂化。
**方案 B（否决 MVP）：每 pod 独立库＋投影聚合**——TriRLC→TriRMC 一层投影之外再加 pod 间聚合层，违背 R4 §五可见性单路径设计；reconnect 跨 pod 恢复失效。

**前置事实（重要）**：MVP 阶段连多 pod 都不需要——单 pod 多会话容量远未触达（现役负载＝13 员工心跳＋周平面 cron＋分身会话，数十并发量级；TriMC 容器资源画像 requests 才 100m/128Mi，§4.2 实证）。

### 4.2 R1 k8s manifests 复用度

【本篇补核实证，D:/Code/ai/TriMC/k8s/trimc/ 五文件】：

- deployment.yaml：replicas:3＋podAntiAffinity（每节点一 pod）＋readiness/liveness 双 probe（/healthz:8710）＋资源画像 requests 100m/128Mi、limits 500m/512Mi。
- hpa.yaml：autoscaling/v2，CPU 70% 利用率目标，min 2 / max 10。
- pdb.yaml / service.yaml / kustomization.yaml 齐备。
- docker-compose（trimc＋postgres16，R1:49）＝单机容器化种子。

**复用度：高**。部署骨架（Deployment＋probe＋PG 依赖＋compose）改名即用——已含在 R6 1c 服务器侧改名批（2 批内，R6:35）。**部署形态三阶梯**：systemd（现状在营，R1:49）→ docker-compose（容器化第一步）→ k8s（多节点才需要）——MVP 停在 systemd/compose，k8s manifests 作为已验证资产备用。

### 4.3 HPA 对「分身员工数」的适配裁决

【实证】hpa.yaml 是 CPU 利用率驱动的流量型伸缩——**与员工分身语义不匹配**：分身有岗位身份（JD/contract）、有 roster 门禁（staffing isRoleActive 三处门禁，R4 §四）、生命周期＝任务或常驻——不是无差别副本，CPU 阈值伸缩无法表达「按编制扩」。

**裁决（推荐）**：分身编排归 CHO/clone-dispatch 协议（R4 §四三件），执行面统一 spawn 接口（本地 spawn 与服务器 spawn 同契约，R4:189）；k8s 只做 TriRMC 自身的基础设施部署（Deployment 部署 daemon），**分身＝TriRMC 进程内会话调度**（agent-core scheduler/cron 全家桶已在，R2 §二）。k8s 原生分身（常驻岗位＝每岗位 Deployment replicas=编制、任务分身＝Job）语义对得上，但引入 CHO↔k8s 双真源问题（k8s 不懂 roster 门禁与 HC 审批）——登记为后置观察项（§六），MVP 否决。HPA 保留给无状态 HTTP 面过载场景（投影 API 查询流量），与分身扩展正交，部署文档须标注防误用。

### 4.4 与 clone-dispatch placement 的编排关系

两层各管各的：**k8s 调度器＝基础设施层**（pod 落哪个节点，antiAffinity/probe 语义）；**CHO＝业务编制层**（分身总量按域分账，R4:188）。placement 四值（R4:187）在 CHO 层消化（preferServer 落「服务器池」＝当前单 TriRMC 实例、未来多实例），**不透传给 k8s**（不做 nodeSelector 映射）——业务语义不漏进基础设施层，CHO 保持编制单一真源（服务器侧 spawn 补 roster 门禁已列 R4 风险 8/R6 处置）。

### 4.5 扩展阶梯（触发条件制，逐级不提前做）

| 阶梯 | 形态 | 触发条件 | 现状距离 |
| --- | --- | --- | --- |
| 0（MVP） | 单 TriRMC 实例（systemd→compose 容器化），分身＝进程内会话 | 无 | 当前形态 |
| 1 | 单机多 pod 共享 PG＋会话粘性 | 单实例资源持续 >70% 或故障隔离需求 | 远（资源画像富余，§4.2） |
| 2 | 多服务器 k8s＋跨节点 | 单机不够＋会话持续增长；且 reconnect 游标底座已成熟（§2.3） | 远 |
| 3 | PC 边缘节点（podEdge B2，§1.3） | 出现「本地算力＋沙箱」任务画像（当前无实证需求） | 未立项 |

CEO「分身到更多服务器」的想象在阶梯 2 才需要——架构上已留好位（共享 PG＋游标底座＋CHO 分账），当前不投入。

## 五、任务量增量（对 R6 总表影响）

| 项 | 批数 | 归期建议 | 与 R6 关系 |
| --- | --- | --- | --- |
| placement runtimeForm 细分 | **0** | — | 本篇 §1.3 裁决不加，R6 1.5 不变 |
| reconnect/resume 线 | **3-4** | 期 4（与 session P0 同面避让，R6:189） | **新增线**：SSE 重放＋游标 1-1.5（seq 核对与 R6 1.3 ①合批可省 0.5-1）；单写者锁＋多订阅广播 1-1.5；TriPilot/TUI 断线重连＋游标持久化 1 |
| web 面板（只读 MVP） | **1-2** | 期 3 后半（硬依赖期 2 投影 API，R6 §五期 2） | **新增**：消费聚合代理，TriPilot 零改动 |
| token＋内网绑定增量 | **0.5** | 并入期 3 安全收口批（R6:100-101） | 增量不新批 |
| overlay VPN（Tailscale 类） | **0** | — | 纯部署配置非批 |
| k8s/compose 改名复用 | **0** | 期 3 | 已在 R6 1c（2 批）内，R6:35 |
| 多 pod 水平扩展 | 0（可选设计 0.5） | 期 4 观察项 | 后置，触发条件制（§4.5） |
| podEdge PC 容器形态 | **0** | — | MVP 不做，登记后置选项（§1.5） |

**总增量 ≈4.5-6.5 批**（若 seq 核对合批净 3.5-6 批），全部落在期 3 后半/期 4，**期 1/期 2 零新增，不冲击 R6 主线 28-34 批关键路径**。性质归类：reconnect 线与 web 面板同会话管理线性质——改善面非门禁，可整体缓做（同 R6:120-122 口径）；CEO 若压 3 期可全部后置，无功能缺失（本地 TriPilot 链路不受影响）。R6 总表 34-44 批含缓做线；若 R8 增量全纳则上限至 ≈50，全纳非建议案。

## 六、风险与观察项

| # | 风险/观察项 | 依据 | 处置建议 |
| --- | --- | --- | --- |
| 1 | session_messages 单调 seq 是否存在未核（reconnect 游标＋投影 push 双依赖） | §2.2 缺口 2 | 并入 R6 1.3 schema 漂移核对专项（R6:69）——一专项双收益 |
| 2 | SSE 现实现是否已带 lastEventId 重放待核 | §2.2 缺口 1 | reconnect 批前置探查（半日） |
| 3 | interactions 多客户端路由改造影响现役 TriPilot 链路 | §2.2 缺口 4 | 单写者锁设计以「单客户端现状零回归」为验收线 |
| 4 | 手机交互面扩大攻击面 | §3.3 | MVP 只开只读投影＋局域网；交互面随 token＋takeover 成熟再开 |
| 5 | k8s 原生分身双真源风险（k8s 不懂 roster/HC 审批） | §4.3 | MVP 否决；CHO 保持编制单一真源（R4 §四）；后置观察项 |
| 6 | PC 容器化被误当主路径传播 | §1.5 | 混合裁决规则表随期 1 叙事批落架构文档 §4/§5（R6 1a） |
| 7 | HPA CPU 驱动被误用于分身扩展 | §4.3 | 部署文档标注 HPA 仅服务 HTTP 面 |
| 8 | WSL2 资源/休眠行为在目标 PC 未实测 | §1.2【推断】 | podEdge 若立项先做半日实测批 |
| 9 | web 面板与 session-management P0 同面并行冲突 | §3.4 | 沿用 R6 §3.4 避让：P0 先行（W34），面板排期 3 后 |

## 七、使用依据

- 同目录：ceo-redefinition-brief.md（场景 1 原文与五问）；R1-trimc-inventory.md（:13-15 三原语 / :24 路径 B / :48 功能面 23 模块 / :49 部署形态 compose＋k8s＋systemd / :50 无 ssh / :52 双路径隔离）；R2-trilc-agentcore-inventory.md（:8 app.ts / :9 schtasks 守护 / :13 session-store / :21 工具与 TUI / :23 回环无 token / :43 TriPilot 直连 / :44 能力面含 recoverSession/fork / :45 本机限制 / :50-57 四单向面＋0.0.0.0）；R4-architecture-analysis.md（:69-89 bridge-1 / :91-109 bridge-2 / :113-126 bridge-3 / :147-159 §3.2 裁决与分层 / :165-169 §3.3 / :186-190 placement 三件 / :198-221 §五三步与可见性 / :238-251 §七安全表）；R6-workload-phasing.md（:35 1c / :69 bridge-3 批 / :84-92 调度线 / :94-102 可见性线 / :100-101 安全收口 / :113-126 总表 / :120-122 会话线可缓做 / :149 排期权衡 / :189 session P0 / §五期次）
- 本篇补核实证：D:/Code/ai/TriMC/k8s/trimc/（deployment.yaml / hpa.yaml / pdb.yaml / service.yaml / kustomization.yaml，2026-08-21 读）
- CEO 场景 2 原文要点经编排层转述（任务简报）；「NSSM 服务」表述按 R2:9 实证修正为 schtasks 注册（Windows 任务名 "TriLC Daemon"）
- 置信度总标注：现状事实【实证】（引行号＋补核）；批数为【推断】（锚点法，同 R6 §〇口径）；WSL2 行为特征为【推断】（通用工程事实，未在本项目目标机实测，观察项 8）

