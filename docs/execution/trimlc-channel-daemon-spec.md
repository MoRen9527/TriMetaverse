# TriMLC 本地通道 daemon 设计 spec（LG-020 单 A）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/trimlc-channel-daemon-spec.md
- syncMode: source-only
- lastSyncedAt: 2026-08-31
- 性质：CEO 两单之单 A（立项→设计→立法→实施）；设计依据=CEO 定见七条（董事会确认口径照录）
- 配套：协议 v2.1 §六五实例表 TriMLC 行重定义（单 A 立法配套⑥）+命名真源表（单 B 联动）

## 一、定位（标准结构缺口补齐）

标准结构=2 面 ×（MC 服务器调度 / LC 服务器执行 / LC 本地执行）——全表现只缺 **M 面本地 LC** 一格，本单补齐。**边界**：R 面本地 LC=现有闲置 trilc daemon，归懒建 clone 激活批（LG-019 已立），不混入本单。

## 二、形态立法

1. **同库 profile**（董事会修正「借代码」→同库 profile 防 fork）：TriLC=LC 单一真源（同 TriCode 定位）；通道态=同一代码库 TRILC_CHANNEL_MODE=1 profile，非 fork 非新仓。
2. **通道态能力面**：常驻+心跳（外拨 TriMC）+收件箱+最小 cron+session-reaper；**关 agent 宿主能力**（/v1/messages、/internal/v1/agent、/chat/completions 三路由 501 channel_mode_no_agent_host）。
3. **客户端模型**：CC 交互会话与中枢会话=客户端（trilc chat 同款连接模式）；会话可关，重开连 daemon 拉 7×24 积压。
4. **宿主能力不预建**：CC headless 驱动（TriMC 壳角色）不预建，需用时另批。

## 三、边界如实（两条，入册）

1. 「7×24」=**PC 醒着的 24h**——睡眠/关机段本地静默（消息积压于服务器侧，醒后拉取）；服务器节点为真 24h。
2. 本地 daemon **外拨型**：出站心跳/SSE 连服务器；listener 绑 127.0.0.1（代码现成）禁外部入站——NAT 后入站派送走已建连接下行。

## 四、实施参数（Windows）

| 项 | 值 | 依据 |
| --- | --- | --- |
| 代码库 | D:/Code/ai/TriLC（dev，同库 profile） | 防 fork |
| 端口 | **8713**（实勘 8711=现役 daemon pid 27168 占用、8712/8713 空闲） | 独立端口 |
| CWD/workspace | D:/Code/ai/trimlc-channel（独立目录，勿指主仓勿与 R 面实例混用——CEO 点名 per-instance 不拷贝） | 独立 CWD |
| DATA_DIR/PID_DIR | %LOCALAPPDATA%/trilc-channel/ 独立 | per-instance |
| 启动 | 计划任务（本地 trilc 计划任务先例=Win 兼容实证） | Windows |
| env | TRILC_CHANNEL_MODE=1 + TRILC_PORT/CWD/DATA_DIR/PID_DIR/TOKEN 独立集 | 通道 profile |

## 五、能力边界（立法写明）

通道态可执行普通程序（cron/script）；**无 agent 宿主能力**；CC headless 驱动=宿主能力（TriMC 壳角色）不预建，需用时另批。

## 六、远期愿景锚（不入本期实施）

CEO 原始愿景=员工长期在岗+会话间自由通话——本通道是地基；员工连续性=常驻通道+按需苏醒+快照续命（.fade/hub-snapshots 同款机制）；员工间自由路由=phase-2。

## 七、协议 §6.1 联动（单 A 立法配套⑥）

TriMLC 行重定义：「本地 CC 宿主」→「**本地 LC daemon 通道态**+CC 交互为客户端」；命名真源表联动单 B（代码面↔叙事面对齐评估）。

## 八、增补（2026-08-31 晚，CEO 裁定两段）

### 8.1 daemon.mode 字段口径（董事会微裁决文档化）

healthz daemon.mode 字段=**宿主 OS 平台形态标识**（app.ts:1667 平台三元硬编码，win32→'schtasks'），非注册实况——字段名有误导，三态化（registered|unregistered|platform-×）挂该文件自然编辑窗顺手改（董事会自裁：8711 现役同码重启不值，不动代码）。

### 8.2 宿主能力理由修正（CEO 点破）

§二.4 宿主能力不预建的**理由修正**：本地 CC headless 二进制/凭据本就存在——解锁门槛不变（有需求另批），**理由改为治理边界**：无人值守 agent 在个人机运行须 job 白名单/目录约束/凭据面立法先行，非能力建设成本。

### 8.3 迁仓预告

通道态代码迁仓计划（TriLC 仓→新 TriMLC 仓）见 repo-rename-migration-plan-20260831.md §三阶段 3（8713 并行换源不断服）。

### 8.4 提权注册命令双口径（D-03 同型 shell 方言教训，2026-08-31 深夜）

首交付命令内嵌引号 `\"...\"` 为 **cmd.exe 惯用法**，PowerShell 解析将反斜杠粘到路径尾报「无效参数」——命令交付未注明适用 shell，教训记档（D-03 同型）。双口径正身（路径无空格故 PowerShell 式去内嵌引号）：

- **PowerShell（已采用，CEO 跑成）**：`schtasks /Create /TN "TriMLC-Channel" /SC ONSTART /DELAY 0001:30 /TR "C:\Users\jedih\AppData\Local\trilc-daemon-channel.cmd" /RU SYSTEM /F`
- **cmd.exe**：`schtasks /Create /TN "TriMLC-Channel" /SC ONSTART /DELAY 0001:30 /TR "\"C:\Users\jedih\AppData\Local\trilc-daemon-channel.cmd\"" /RU SYSTEM /F`

env 完整性说明（不变）：通道实例全部 env 承载于 cmd 文件内，任务行只引用路径。

### 8.5 重启后收尾清单（残差①二合一处置，待 CEO 重启触发；董事会批复 2026-08-31 深夜）

重启后顺序（董事会口径照录+验证锚）：

1. **双 daemon 存活验证**：schtasks ONSTART 触发 TriMLC-Channel（SYSTEM）→`curl http://127.0.0.1:8713/healthz`（预期 ok+trimc connected=SYSTEM 身份下 node/.env/D: 路径全通真凭实据）；TriLC Daemon（jedih Logon 触发）→`curl http://127.0.0.1:8711/healthz` 同验。任一失败→查 8.4 双口径 cmd 与路径。
2. **目录锁释放验证+mv 改名**：`mv D:\Code\ai\TriLC D:\Code\ai\TriRLC`（重启后进程锁清空，预期通过；再拒则 handle 定位占者升级）。
3. **三脚本路径 sed**：build-desktop.ps1/fix-nssm-paused.ps1/fix-nssm-registry.ps1 的 `D:\Code\ai\TriLC` → `D:\Code\ai\TriRLC`（ps1 BOM 纪律：二进制替换保留 BOM）。
4. **8711 拉起核活**：`schtasks /Run /TN "TriLC Daemon"`+healthz（connected+activeTasks=0）。
5. 收口三件：本地 TriRLC 仓 remote 复核（sg-server=TriRLC.git）+拓扑正身 §一 本地行回填+本清单勾销。

### 8.5.1 SYSTEM 任务悬案与验收状态（2026-08-31 深夜董事会定性，**验收进行中勿销账**）

- **悬案定性**：任务配置全对（action 路径/SYSTEM/已启用/ONSTART）、Last Run=00:01:38 Result=0、「模式: 已排队」——但 taskrun.log 两层+监听+进程全无=**调度器自认成功而实际未执行**。判=按需 /Run 撞 ONSTART+DELAY 队列的 Windows 怪癖，今晚不追。
- **侦测已就位**：cmd 标记行路径 bug 已修（硬编码绝对路径），下次触发必留痕 C:\Users\jedih\AppData\Local\trilc-channel\taskrun.log。
- **晨检/重启清单增补**：CEO 任意一次重启后，读 taskrun.log——**有标记=node 层死因在日志里**（修 node 层）；**无标记=调度层**（处置=改 RunOnce 或导出 XML 任务定义换触发器绕队列）。
- **服务现态（如实）**：8713=jedih 手动实例 connected（SYSTEM 悬案不影响通道可用性）；**「SYSTEM 身份自启」验收顺延至重启后，进行中勿销账**。

### 8.6 组长岗位解锁附则（LG-026 P0 首件；BOD 裁决 2026-09-02 全包采纳）

- **解锁对象（立法写准）**：「注册制组长 in-process agent 资格」——白名单式单 agent 注册，**不开通用 agent 入口，HTTP 宿主三路由 501 闸不动**（§8.2 条文边界由 BOD 裁决明示：LG-020 封的是对外 agent 宿主服务面，非 daemon 进程内受控 agent）。
- **治理三件套**：
  1. **工具白名单**：信件 CRUD + SendMessage（daemon 面语义=写信端点 `/internal/v1/letters` + SSE 直推，非 CC harness 工具直通）+ 台账读（`/internal/v1/ledger`）；**无仓写权**。ALLOW/DENY 规则机制现成（app.ts:1545-1547）。
  2. **目录约束**：组长 agent cwd 钉死通道实例 DATA_DIR（`%LOCALAPPDATA%/trilc-channel/`），不指主仓（HeartbeatAgentConfig.cwd per-agent 字段，REQ-014b 基准）。
  3. **凭证边界**：`X-Internal-Token` 只注入 daemon 出站层；组长 agent 上下文不持 repo 凭证、不持 git 身份、不持 TriMC token。**组长管信不管码。**
- **组长会话形态**：事件驱动唤醒（非永续对话）——`TriLCHeartbeatWake` 注册第二 handler，信箱入件即 `requestHeartbeatNow({reason:'action'})` 唤醒，heartbeat-runner 单 turn in-process agentLoop 办完即眠；状态全落信件 DB（SQLite，seq daemon 级全局单调）与台账，不吃对话上下文。
- **业务规则锚**（详见 LG-026 设计方案书 §二③④⑦）：状态机 待投→已投（组长唯一投递执行者）→已读（收件人唯一定读权）→已升级（旁路终态，新信封引用原信 id）；优先级三档判急两段式（发件人自报+组长形式复核，终裁升级权 COS）；升级数值 C-suite 4h/执行席 1 工作日（BOD 裁）；推送三级 L1 SSE 直推/L2 离线托管上线即报/L3 急件抢占；多组长扩展触发线（日均 200 封×7 天／并行项目≥3／积压事故≥1 次）。
- **上岗前置闸**：双 daemon ONSTART 自启验收闭环（§8.5.1 SYSTEM 悬案勿销账，候 CEO 插电重启终验）——闸不开组长不上 live。

### 8.7 M 面组长 CC 会话解锁附则（LG-026 重审后正解形态立法；BOD 授权 2026-09-02，CTO 起草；CHO 验收 accepted 2026-09-02 附保留意见三条候 P5 实施批——验收件见 operating-records 2026-W36）

- **解锁对象（第二次注册制解锁，§8.6 同构）**：M 面业务组长=**被 daemon 拉起的独立 CC session**（spawn/看护/重生归 daemon，组长本体=全能力 CC 会话，原生跨会话通信）。立法依据=R 面 agent-core 移植子集无跨会话消息能力（TriRLC send-message.ts:1-6 自证「CC 支持 bridge/uds 跨会话 → TriLC 仅支持进程内消息」），in-process 组长=哑巴会话（LG-026 重审报告 2026-09-02，lg026-leader-form-re-review.md）。**HTTP 宿主三路由 501 闸不动**——口径重述：daemon 不做 agent 宿主服务面，做的是「进程监督的 CC 会话管理器」（组长本体=CC 进程，非 daemon 内 agentLoop）。
- **治理三件套（§8.6 迁移版）**：
  1. **工具白名单**：CC `--allowedTools` 裁剪=信件 API 面（letters 端点读写+台账读）；无仓写权、无 shell 泛权。**组长管信不管码条文延续。**
  2. **目录约束**：组长工作目录钉通道实例 DATA_DIR（`%LOCALAPPDATA%/trilc-channel/`）。
  3. **凭证边界**：CC 会话持模型凭据（组长本体必要面），不持 repo 凭证、不持 git 身份、不持 TriMC token。
- **双通道分工（正解核心设计）**：**信箱 API=任务队列+审计轨迹**——spawn 时待办摘要注入初始 prompt，全文与办结经 letters 端点读写，状态机/台账/审计（§8.6 业务规则锚）不变；**CC 原生跨会话消息=组长↔员工席实时对话**——涉账务动作一律回写信箱留痕（跨会话对话不留审计，故账走信箱）。
- **会话形态（§8.6 条款延续）**：事件驱动唤醒不变——信箱入件→`requestHeartbeatNow({reason:'action'})`→wake handler 目标自 `runHeartbeatAgent` 换为 `spawnCCLead`（一次投递待办批，办完即眠）；状态在信件 DB 与台账、不吃对话上下文。
- **看护/重生**：ProcessSupervisor 进程监督（超时杀/崩溃重启计数/僵尸回收；session-reaper+registerShellExecTool 先例）；`-p` 输出 JSON 解析→台账回写；Windows 句柄教训（uvicorn reload 幽灵坑 2026-09-02/§8.5.1 SYSTEM 队列怪癖）入监督器设计约束。
- **R 面组长降级**：in-process 形态（lead-tools/minTier/permissionRules）降为轻量降级模式，**冻结不再演进**，去留候 BOD 另裁（资产处置表见重审报告 §二问 3）。
- **风险面（BOD 已知悉权衡）**：token 成本（全量 CC 会话 vs in-process subagent tier）/时延（CC spawn 秒级 vs 毫秒级）/Windows 进程管理面。
- **上岗前置闸（继承+新增）**：§8.6 前置闸继承（双 daemon ONSTART 自启验收闭环）；新增 CC headless 可用性预检（二进制/凭据在位）为 spawn 面前置。
