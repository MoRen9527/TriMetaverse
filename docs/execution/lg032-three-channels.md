# LG-032 三通道工程——方案骨架（CTO 方案正文候填）

- sourceOfTruth: TriMetaverse/docs/execution/lg032-three-channels.md
- syncMode: source-only｜lastSyncedAt: 2026-09-04
- 状态：**骨架件**（CEO 明令立项；CTO 域方案正文候填——D-15 路由 CTO 方案先行）；边界=只勘定与方案，连接实切候验证门+董事会知会（案 a 关通道=第二次 CEO 级确认点）

## 案 a·TriRLC 通道迁移（真 API 通道 TriRMC 接线）

- 现状：TriRLC（8711）经 TRIMC_BASE_URL 上送 sg 中央面（47.245.122.61:8710，LG-030 三查四定）；TriRMC（8.155.54.79）现仅 cron API+git 拉取，**无长驻 MC 服务端**。
- 工程量主体：TriRMC 侧 MC 服务面新建（/internal/v1/* 端点族：心跳接收/回传/恢复回放全能力）+认证（X-Internal-Token 族对齐）+全链验证门（心跳/回传/replay 实测）。
- **硬序=先接后关**：TriRMC 服务面验证门过→才准关 TriRLC→TriMMC 旧通道；过渡期双通道并存不摘。
- 关旧通道=**第二次 CEO 级确认点**。

## 案 b·TriMLC↔TriMMC API 通道新建

- M 面本地配对通道（8713 通道 daemon 的 M 面 API 化）；与 LG-026 501 解锁线（P4/P5）联动排布——组长岗 API 化若落，本通道为其前置底座。

## 案 c·TriMMC↔TriRMC 协作方案

- 默认=git 仓库协作（现状）；**CPO+CTO 联审**「涉及审核和反馈的接口方案」——出方案候裁，不抢先实施（CEO 令）。

## 候填节（CTO 方案正文——2026-09-04 填毕，CTO 席）

### 案 a-1·TriRMC 服务面端点清单+认证+部署形态

**端点最小集（照 TriRLC 消费端协议源码实勘，TriMMC 侧实现可移植参考）**：

| 端点 | 方法 | 契约（TriRLC 消费端已固化） |
| --- | --- | --- |
| /internal/v1/heartbeat | POST | 收 {nodeId,state,queueSize,uptimeSeconds,agentCoreVersion}，X-Internal-Token 头校验，5s 超时容忍；响应 {ok:true, pendingCommands?}（v1 载荷可选） |
| /internal/v1/events/replay | POST | 收 {nodeId,connectionId,events[]}，10s 超时；响应 ReplayResponse{ok,accepted,conflicts[],lastSeqNo}——仲裁存储 sqlite events 表（seq 连续性） |
| /internal/v1/tasks/result | POST | 任务结果回传接收+台账（回调面：TRILC_TRIMC_CALLBACK_URL 切换后指向本面） |
| /healthz | GET | 服务面自检 |

**认证**：全端点 X-Internal-Token fail-closed（缺失/错值 401）——TriRLC 出站已带 TRIMC_INTERNAL_TOKEN 头（app.ts 出站层），TriRMC 侧同值 env 注入，双向同族（TriMMC token 机制同构移植）。

**部署形态裁 systemd**（河源 Linux）：MC 服务面=长驻 HTTP 服务，cron 按需形态不适用；Unit 声明 `User=fleet`（声明式避开 M0g 教训 runuser 必炸面；job 禁带 runAs 先例同源）；端口默认 8710 河源侧（无冲突，env 可配）；重试/自启 Restart=on-failure。cron 保留现有迁移职责不动（服务面独立进程零耦合）。

**回传/下派通道选型**（NAT 下 TriRMC 无法入站 TriRLC——127.0.0.1 禁外入立法在案）：v1=**心跳响应携带待办载荷**（pull-on-heartbeat，最小实现零新连接面）；v2=出站 SSE 长连（通道 spec §三.2 立法目标形态，P5+ 演进）。案 a 落 v1。

### 案 a-2·验证门判据（三实测+观察期）

| 门 | 实测标准 |
| --- | --- |
| 心跳门 | TriRLC 切指 TriRMC 后 healthz trimc=connected 持续；TriRMC 侧心跳台账连续 ≥3 周期接收成功 0 超时（验证期可将 TriRLC healthCheckIntervalMs 临时调短加速采样，验证毕复原） |
| 回传门 | 一笔 tasks/result 真实或合成样本落 TriRMC 台账且响应正确（或 replay 合成事件 accepted≥1 无异常 conflict） |
| replay 门 | 合成离线事件 N=3 注入 TriRLC event-queue→模拟断链→恢复→replay 三件全 accepted+TriRMC 侧 seq 连续无洞 |
| **门过标准** | 三门全过+**24h 观察期无 degraded 误报**→方准入「关旧通道」第二次 CEO 级确认（D-17 硬闸） |

### 案 a-3·连锁清单

- **TriRLC env（值切位）**：TRIMC_BASE_URL `http://47.245.122.61:8710`→`http://8.155.54.79:8710`——双注入位同步（User 级 env+daemon cmd，LG-030 查①同位）；**env 名/代码字段零改动**（LG-030 裁 trimc 字段语义「MC 服务基址」保留，只换值）；
- TRIMC_INTERNAL_TOKEN：TriRMC 侧新注入位（同值）；
- TRILC_TRIMC_CALLBACK_URL：若启用回调面同步切值（否则不配零影响）；
- **8713 影响=零**（通道实例独立 env 集，其切换属案 b 范畴不在案 a）；
- 周平面迁移线：服务面部署窗=工作日，**周日 23:00 迁移窗冻结期不部署**（M0g watcher 冻结先例同款避峰）。

### 案 b·LG-026 501 线联动排期

组长岗 API 化（LG-026 P4 fallback 09-09 后落地后评估）为案 b 前置底座——案 b（8713 M 面 API 通道）排期挂 **P5 线**（组长岗 live 后），不设死日期；触发条件=P4 验收过+CEO 排程令。

### 案 c·TriMMC↔TriRMC 联审排期

「审核和反馈接口方案」CPO+CTO 联审窗=**09-06（周日）日间**（历法纠偏+切指提前后定案；冻结窗 23:00 前散会合规）——出方案候裁不抢先实施（CEO 令）；联审输入=本件案 a 端点契约（复用 X-Internal-Token+sqlite 台账形态评估）+git 仓库协作现状。

### 三案排期总表

| 案 | 内容 | 排期 | 门 |
| --- | --- | --- | --- |
| a | TriRMC 服务面新建+TriRLC 切换 | BOD 排窗→实施 2-3 工作窗→三门+24h 观察→第二次 CEO 确认→关旧通道 | D-17 硬闸 |
| b | 8713 M 面 API 通道 | P5 线（LG-026 P4 后评估） | 501 解锁线 |
| c | MMC↔RMC 联审方案 | 09-09 后联审窗，候裁不实施 | CEO 令 |

## 治理锚

- D-17：连接面变更须 CEO 明令（案 a 关通道=第二次确认点）
- LG-030：三查四定+e 六点（连接零改动裁定，本工程为其后续实施立法面）
- LG-031 终裁（修正版）：星形拓扑+治理流向双向回流+元现实/元虚拟终态架构（当前 MVP 级落地——git 仓（其中项目代码、治理等经验））
- LG-026：501 解锁线/P4 09-09 后窗联动