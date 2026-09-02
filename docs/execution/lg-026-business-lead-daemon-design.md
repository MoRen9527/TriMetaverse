# LG-026 「业务组长」daemon 常驻岗+双 daemon 互备·联审设计方案书（候 BOD 裁）

> sourceOfTruth: 本件（D-15 首例联审产物，候 BOD 裁后实施另令）；syncMode: static；lastSyncedAt: 2026-09-02
> 联审会：COS（主持/合成）+ CPO（业务面 ①③④⑥⑦）+ CTO（技术面 ①②③④⑤）；双席意见件=本目录 `lg026-cto-joint-review-opinion.md`（93 行，23cea463）+CPO 席联审消息（2026-09-02T03:49Z，转录§三）
> 实施路由（D-15）：BOD 裁后开发 CTO 派 FD、验证测试 CTO 派 ST；本联审全程只读不实施

## 一、案由

**CEO 原案（要点照录）**：daemon 内拉起新岗位会话「业务组长」——管信件=管项目业务，归属项目负责人（现 COS）管理；放 daemon 里即 7×24 常驻；始终可收信+定时检查推送/提醒特定员工特定任务；免复杂设计实现双向通信+全员信件寄存；业务扩大可设多组长。另：服务器 daemon 与本地 PC daemon 互为 fallback 防本地关机丢信，本地信件定时托管同步到服务器侧。

**BOD 优化八条（联审必答）**：①组长会话形态（建议事件驱动唤醒非永续对话）②宿主能力解锁（LG-020 501 通道态另批解锁首例，治理三件套）③信封 schema（正名寻址+状态机）④推送三级 ⑤双 daemon fallback（v1 非双活）⑥多组长扩展 ⑦组织归属 COS 麾下 ⑧D-15 合规首例联审。

## 二、八条逐条结论（CPO 业务面 / CTO 技术面 / COS 合成）

### ① 组长会话形态——**采事件驱动唤醒（BOD 案成立），底座现成**
- CTO：非新架构=TriRLC 已有能力组装。`TriLCHeartbeatWake`（250ms 合并+四级优先抢占+action 最高）已有 ConnectionManager 消费先例；「来件即醒」=信箱端点入件后同进程 `requestHeartbeatNow({reason:'action'})`，**零新机制（无 inotify 无新轮询）**；「办完即眠」=heartbeat-runner 单 turn in-process agentLoop 先例照用；定时检查=现役 cron 面承载。
- COS 合成：采。状态全落信件 DB+台账，会话无永续上下文——与 COS 世代机制天然解耦（BOD 防世代膨胀意图达成）。

### ② 宿主能力解锁——**解锁对象=「注册制组长 in-process agent 资格」，HTTP 宿主 501 不动**
- CTO（关键立法澄清）：501 闸只封 3 条 HTTP 宿主路由（app.ts:2389-2395），in-process agent 能力未封（DEFAULT_HEARTBEAT_AGENT 已在跑）——LG-020 封的是「对外 agent 宿主服务面」非「daemon 进程内受控 agent」。
- 三件套方案：工具白名单=信件 CRUD+SendMessage（daemon 面语义=写信端点+SSE 直推，非 CC 工具直通）+台账读，**无仓写权**（ALLOW/DENY 机制现成）；目录约束=cwd 钉通道 DATA_DIR（REQ-014b 先例）；凭证边界=X-Internal-Token 只注 daemon 出站层，组长不持 repo 凭证/git 身份/TriMC token。
- 立法落点：通道 spec §8.2 套用，出「LG-020 组长岗位解锁附则」，注册制（白名单式单 agent 注册）不开通用入口。**组长管信不管码（BOD 定）技术闭合。**

### ③ 信封 schema——**SQLite 单库分表+全局单调 seq**
- CTO：SQLite（node:sqlite 内建，session-store/event-queue 同款先例）；`letters` 表（letter_id/seq_no/from/to/priority/status/时间戳四枚/payload/ttl/retries/last_error）；台账分表 `ledger` 以 letter_id 外键一信多行。**唯一 schema 级新要求：seq 升 daemon 级全局单调**（供 fallback 仲裁）。
- CPO（状态机业务规则）：待投→已投=组长流转（唯一投递执行者）；已投→已读=**收件人唯一定读权**（组长不得代标）；已升级=旁路终态原件冻结，升级走新信封引用原信 id（防篡改轨迹）。优先级三档：常规（工作窗）/重要（上线即报+定时重推）/急件（触发升级链）；发件人自报+组长按公开标准形式复核，降档留痕防滥发。

### ④ 推送三级+双 daemon fallback——**全部现成底座；走 TriMC 侧中转，双 daemon 互不直连**
- L1 在线直推=SSE stream（在线判定=连接注册表）；L2 离线托管+上线即报=通道 spec §二.3 已立法；L3 急件=wake action 最高优先抢占即醒。
- CPO（业务规则）：判急两段式=发件人自报+组长形式复核，**终裁升级权在 COS**；升级阈值框架=重要件超时未读→组长重推一次→再超时自动升 COS；急件零等待即时升（数值建议 C-suite 4h/Execution 1 工作日，候联审定数值）；升级链固定组长→COS→BOD。
- fallback 拓扑：通道选型 **TriMC 侧中转**（NAT 现实：本地 listener 绑 127.0.0.1 禁入站；TriMMC heartbeat 承接面已实证）；**leader 心跳单列 30s 专用通道**（携 nodeId+lastSeq），阈值 3 缺席≈90s→服务器副本转正（业务心跳 30min profile 不动）；冲突 seq 高者胜（postReplay 仲裁框架复用），低者记 conflict 不丢；托管同步=事件触发+5min 兜底；本地健康判定复用 connected|degraded|local 三态持久化。

### ⑤ 信件 API 面（daemon HTTP 端点最小集，全 /internal/v1+X-Internal-Token；★=新端点）
| 端点 | 方法 | 语义 |
| --- | --- | --- |
| /internal/v1/letters ★ | POST | 寄信 → {letter_id, seq_no} |
| /internal/v1/letters?box=&to=&status=&since_seq= ★ | GET | 收信/积压重放（7×24） |
| /internal/v1/letters/{id}/state ★ | POST | 状态流转 {action: deliver/read/escalate/done} |
| /internal/v1/letters/sync ★ | POST | 托管同步 {since_seq} |
| /internal/v1/leader/heartbeat ★ | POST | leader 心跳 {nodeId, lastSeq} → {role} |
| /internal/v1/letters/wake ★ | POST | 组长唤醒触发（127.0.0.1 内部转 requestHeartbeatNow） |
| /internal/v1/ledger?since= ★ | GET | 台账读 |
| cron/jobs、sessions/{id}/stream | 已有 | 定时检查/SSE 直推复用 |

### ⑥ 多组长扩展——**裁可「候业务再定」，但先立量化触发线**
- CPO：满足其一即启动评估——日均信量连续一周超单组长容量水位／并行活跃项目≥3 且路由需按项目隔离／组长单点故障致积压事件≥1 次。BL-xxx 命名：只冻结格式 `BL-<项目代号>` 不预留名（合命名宪法「按需授名」）。宪法加席候 CAO 入册（与 D-13 同册，⑦合并办）。

### ⑦ 组织归属——**挂 COS 麾下成立**
- CPO：汇报线=组长→COS→CEO→BOD（既有链不动）；考核面=COS 考组长（投递及时率/状态准确率/升级合规率三维度，不考信件内容质量——内容责任在发件人）；BOD 直通边界=仅 COS 不可用时急件携完整轨迹直达 BOD（故障旁路+事后补报），此外无直通权。

### ⑧ D-15 合规——本案即首例联审（本书=产物）；实施候 BOD 裁，开发 CTO 派 FD/测试派 ST。

## 三、fallback 拓扑图

```mermaid
graph TB
    subgraph 本地 PC["本地 PC（leader 常态）"]
        LD[TriRLC leader<br/>信件 DB+组长 agent] -->|leader 心跳 30s<br/>nodeId+lastSeq| TriMC
        LD -->|托管同步 since_seq<br/>事件触发+5min 兜底| TriMC
        CEO 席/COS 席 -->|寄信 127.0.0.1| LD
        LD -->|L1 SSE 直推/唤醒| 在席员工
    end
    subgraph 服务器["sg 服务器（replica 常态）"]
        RD[TriRLC replica<br/>只读副本] -->|托管拉取 since_seq| TriMC
        RD -.->|90s 判缺席转正<br/>（3×30s leader 心跳缺席）| LD
    end
    TriMC[TriMMC 中转面<br/>heartbeat/letters 承接已实证]
    RD -->|转正期派送| 在席员工2[员工席]
    LD -.->|复归降回 leader<br/>seq 高者胜 postReplay 仲裁| RD
```

## 四、实施分期建议（CTO 案，BOD 裁后排期）

1. **P0 立法**：LG-020 组长岗位解锁附则（三件套）先行。
2. **P1 数据层**：信件 DB schema 定稿（全局单调 seq）。
3. **P2 唤醒链**：信箱端点→wake→单 turn（最小可用=本地寄收+直推）。
4. **P3 推送三级**：L2 托管+L3 急件抢占。
5. **P4 fallback**：leader 心跳/转正/回归演练（含 seq 冲突对账用例）=**最终门禁**。

## 五、风险与缓解（三条）

1. **条文解释边界**：in-process 组长资格与 LG-020 条文解释需 BOD 明示——本节二②已载明「解锁对象=注册制组长资格，HTTP 宿主 501 不动」，候裁即释。
2. **真 7×24 缺口**：Windows 睡眠/关机段本地静默（通道 spec §三.1 在册）——服务器副本转正恰补此缺，为 fallback 存在理由非缺陷。
3. **前置闸**：8713 SYSTEM 自启悬案未销（通道 spec §8.5.1 验收进行中勿销账）——组长上岗前置=双 daemon ONSTART 自启验收闭环。

## 六、双席签认

- CPO 席：业务面 ①③④⑥⑦ 结论如§二（2026-09-02T03:49Z 联审消息；「八条细则未见全文」已由本节全文收录对表，如有出入候其对表修订）。
- CTO 席：技术面五条结论+API 面+拓扑如§二④⑤（`lg026-cto-joint-review-opinion.md` 23cea463）。
- COS 合成：八条无冲突合流；升级数值（4h/1 工作日）与扩展触发线数值留 BOD 裁或实施期联审细定；本席无否决。
