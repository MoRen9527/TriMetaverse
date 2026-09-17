# 跨面席位通知通道·CTO 独立意见（daemon 路由·三方联审）

- sourceOfTruth: 本件（CTO 技术实现面意见；合成稿归任务书 1943f597 收口区）
- syncMode: static
- lastSyncedAt: 2026-09-17T22:4x+0800（date 现查 22:41:43，本回合执行）
- 实勘基线: 本机 8713 healthz 活体（mc_link=connected/mc_peer=trimmc）+ TriRLC `src/server/app.ts`（ConnectionManager/event-queue）+ TriRLC `src/letter-store/`（LG-026 信箱）+ TriMMC `src/internal-token.ts`（LG-012）

---

## 〇、总判断

**本方案几乎不需要发明新机制——四件既有资产恰好拼出全链**：X-Internal-Token（鉴权）+ ConnectionManager（链路状态机）+ event-queue（断链缓存重投）+ letter-store（送达确认语义）。设计工作=把它们按通知语义接线，而非新建系统。风险最集中的 hops 不是跨机段（资产成熟），而是**最后一跳（daemon→bod 活会话注入）**——现无现成机制，须明选定型。

## 一、跨机链路可靠性（审点①）

**现状实锚**：
- 互联链方向=**接收端外拨**（TriRLC ConnectionManager 主动连 trimcBaseUrl——8713 侧外拨 sg TriMMC；healthz `mc_link:connected` 为证）。此方向性是本方案的**第一设计约束**：sg→本机的推送只能 riding 在本机建立的外拨连接上。
- ConnectionManager 已有成熟断线姿态：failThreshold=3 判 degraded、recoverThreshold=2 复位、degraded>5min 转慢跳（60s）——**无需新建重连机制**。
- **event-queue（CTO-008-M §3.2）即现成缓存重投资产**：TriMC 不可达时入队、重连后 replay、上限 10k、TTL 1h——语义与本需求「断链时消息缓存、链通重投」同构。

**裁**：
1. 传输形态 **MVP=HTTP-pull 收件箱制**：TriMMC 侧建 notify outbox（SQLite 表，复 event-queue 存储模式），TriMLC 外拨心跳顺路拉取（或独立 GET `/internal/v1/notify/pull`）。**不选 WS 双工**（MVP 不引新连接形态；外拨 HTTP 与现 ConnectionManager 完全同构）。
2. 缓存重投参数沿用 event-queue 惯例（TTL 1h 起步、上限 1k 足够——通知非任务）。**重投幂等键=message_id**，TriMLC 侧去重表防 replay 重复投递（letter-store seqNo 模式可借）。
3. 链路状态可观测：两端 healthz 各加 `notify_link`/`notify_backlog` 字段（照 mc_link 双字段先例），缺位兜底看板化。

## 二、鉴权（审点②）

**裁=全面复用 X-Internal-Token 体系**（LG-012）：TriMMC `/internal/v1/notify/*` 全族挂既有 token 门（TriMMC app.ts 已有 /internal/* 先例）；TriMLC 侧 pull 端点同门。**不新增令牌族**——跨机令牌分发是独立运维问题，本方案不扩它。附加两条：
- m-duty-cos→TriMMC 这一跳是**同机环回**，token 走 sg 侧 docker/.env 既有解析链（LG-012 三链探测），零新配置。
- token 拒绝=401 人话码透传回源席（`sg 内部令牌被拒`），不静默吞。

## 三、送达确认语义（审点③）

**裁=复用 letter-store 状态机，三级精简为两级**：
- LG-026 信箱已有完整语义：`pending→delivered→read→done`（+escalated 旁路）+台账留痕+TTL——本方案直接继承。
- **MVP 两级**：`delivered`=TriMLC daemon 已收且落盘（跨机段完成）；`read`=已注入 bod 会话（最后一跳完成）。`done` 级（bod 处理回执）列 P2——回执要求反向通道闭环，MVP 不必。
- 源席查询面：TriMMC 加 `GET /internal/v1/notify/<message_id>` 或列表端点，m-duty-cos 可查「已送达/已注入/超时」——**发送方可见状态**是屏扫兜底被替代的前提（屏扫的本质痛点=不可见）。

## 四、安全边界（审点④：谁有资格发「给 bod」）

**裁=双端 ACL+三硬约束**：
1. **TriMMC 入口 ACL**：源席白名单（MVP=m-duty-* 家族+MCP 编排位；非白名单 403）；**目标白名单**=跨面可路由席名册（MVP=`bod` 单条；扩面=名册治理，勿硬编码蔓延）。
2. **TriMLC 出口 ACL**：只注入**本机在册会话**（bod 在册=可投；不在册=退信回源+`target_unreachable` 态——不许「投给不存在的会话」造成假送达）。
3. **三硬约束**：消息体上限（4KB MVP——通知非文档）；速率限制（同源 10/min 起步，防失控循环）；**全量台账**（每次投递落 ledger，照 letter-store 台账制——审计面是安全边界的证据链）。
4. 内容不设密级字段（MVP）——通道本体已过 token 门+环回/互联链，无第三方可见面；密级列 P2 议题。

## 五、最后一跳（daemon→bod 活会话）——风险集中点，明选定型

**实锚**：daemon 是进程不是会话，无 SendMessage 工具面；tmux send-keys 有 Enter 吞噬前科（两次实证）；letter-store 的 deliver 语义=落库标记，收件人经 state 端点拉——**交互式活会话没有「被注入」现成机制**。

**裁=MVP=「信箱+hook 注入」混合**：
1. TriMLC 落信箱（letter-store 表复用）+**Windows 桌面通知**（急件类同步触发 OS toast——bod 是活人值守席，toast 即达意，且本机已实证此路）；屏扫兜底（MSG-Alert）保留为二线。
2. 会话内消费=bod 侧 **UserPromptSubmit hook 注入**：bod 下一回合（任何人发任何消息）时 hook 把未读信箱件以 system-reminder 形态带进上下文——延迟=下一回合边界，但**机制可靠、零新协议**（hook 面现成）。
3. **P2 候选**：daemon 直呼会话 CLI 桥（若 CC 后续提供 headless 注入通道再评估）；急件要求秒级进上下文时才值得做。

**诚实声明**：此 hop 是全链唯一「有延迟而非即时」的段（MVP 急件=toast 即时+上下文延迟到下一回合；缓件=完全随回合）。若 CEO 需求=急件必须即时进上下文，须升级 P2 桥——请在合成稿标注此取舍供裁决。

## 六、分期取舍（共同审点）

**MVP（先通一类）**：sg 席→bod 单向、候裁决优先级类、白名单双单（m-duty-*→bod）、两级确认、toast+hook 注入。**全量消息面（任意席→任意席）明确 P2**——寻址/ACL/台账的泛化成本不低，且跨面需求现仅 bod 一条实证，勿为想象需求扩面（MVP 划线纪律）。

## 七、使用依据

- 任务书 1943f597（CEO 22:38 令+22:5x 方向补充）
- 活体：8713 healthz `mc_link:connected, mc_peer:trimmc`（本回合 curl 实测）
- TriRLC `src/server/app.ts`（ConnectionManager :878 断线姿态/event-queue 引用 :1133/:1597）
- TriRLC `src/event-queue/`（CTO-008-M §3.2 断链重投）+ `src/letter-store/`（LG-026 状态机/台账/TTL）
- TriMMC `src/internal-token.ts`（LG-012 token 三链解析）
