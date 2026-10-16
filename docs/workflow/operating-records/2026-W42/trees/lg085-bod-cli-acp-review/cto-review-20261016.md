# CTO 评审卷 · LG-085 · BOD CLI 独立宿主+ACP 四域互通（CEO 技术构想）· 2026-10-16

- sourceOfTruth: 本卷（trees/lg085-bod-cli-acp-review/cto-review-20261016.md）
- syncMode: static（技术评审卷·候呈候裁态）
- lastSyncedAt: 2026-10-16T10:31:41+08:00（date 现查·写前跑）
- 令源: CEO 10:23:35 构想征询（BOD 10:25:53 转办）·COS 派工 LG-085（评审六聚焦·不抢时点）
- 构想六要点：①BOD 经 ACP 与四域班组互通 ②自研 BOD CLI 脱离 Claude Code/dsh/codex 类宿主 ③部署 M-SG ④微信小程序远程 ⑤桌面 tmux 近期/自研远期 ⑥BOD 24h 在线手机电脑随时可用

## 〇·总评

**可行·且大部分底座已现役——本构想的实质不是「新造 agent 框架」，是 BOD 的宿主解耦+访问面多端化。** 判断依据：TriRLC/TriMLC daemon 族（HTTP+SSE agent loop/heartbeat/cron/信箱/树协议拾取/session-store/task-runtime）已经是「宿主外常驻 agent 运行时」的现役先例——TriRLC src 结构里 runtime/task-runtime/planner/session-store/tui/toolbus 一应俱全（10-16 现探实锚）。CEO 要补的是三块：**①BOD 视角的统一客户端（CLI）②远程访问面（安全）③四域消息互通的协议规范**——三块全是增量层，不动现役底盘。建议分四阶段（§三），P0 只读镜像最小可验形一周级。

**一个战略级保留意见**：BOD「24h 在线」的正确形态不是 Claude 会话 24h 挂（内存+API 费用大头·且会话长跑质量衰减），而是 **daemon 轻常驻+agent 会话触发式复活**——daemon 承载信箱/快照/审批队列/规则判（LG-082 试点方向的直接延伸），agent 会话有事才起、处理完落快照。「手机随时看/下任务/做决策」由 CLI+移动端对 daemon 面实现，全天候可用与资源可控兼得。

## 一·「ACP 具体所指」澄清（聚焦①·协议选型）

业界「ACP」两个候选+一个近邻，**各只解决半边**（现查 10-16）：

| 协议 | 出品 | 解决什么 | 传输形 | 对本构想的贴合度 |
| --- | --- | --- | --- | --- |
| **Agent Client Protocol（ACP）** | Zed（2025-08·Google 合作推广） | **宿主↔agent**（「LSP for coding agents」） | JSON-RPC 2.0 over stdio（本地子进程）·remote 形在 spec 发展中·复用 MCP | 贴合要点②（自研 CLI 宿主接 agent）——但不解决要点①（agent 互通） |
| **A2A（Agent2Agent）** | Google（2025-04·50+ 伙伴·a2aproject 开源） | **agent↔agent**（能力发现/协作·client/remote agent 模型） | HTTP/JSON-RPC 系 | 贴合要点①（四域互通）——但不解决要点②（宿主） |
| MCP | Anthropic | agent↔工具/数据 | stdio/HTTP | 非本构想主语·已被 ACP 复用为 tool 层 |

**建议**：CEO 原话「经 ACP 协议与四域班组互发消息」语义上指的应是 **A2A 类互通协议**；「自研 CLI」对应 **Agent Client Protocol 类宿主协议**——两个词族被「ACP」缩写压叠了，裁前建议 CEO 定名。**本席技术立场**：
1. **宿主面**：现役 daemon HTTP+SSE 面本身就是「BOD CLI↔agent」的传输协议——自研 CLI 做 daemon 的 fat client 即可（零新协议依赖·复用 token 门/信箱/快照端点）。若 CEO 意属 Zed ACP 标准接口（换取生态兼容·未来 Zed/Sublime 等编辑器直连），采纳形态=加 ACP adapter 层（claude-code-acp 先例）——中成本·候裁·不阻塞 P0。
2. **互通面**：现阶段**不自引 A2A 重协议**——daemon 信箱+树协议已承载四域互通的实际流量，规范先内化（统一信封/路由/回执语义——LG-036 outbox 三态已是雏形）。A2A 留 12-24 月观察位（趋势雷达挂单）：当跨厂商 agent 互通成为真实需求（如引入第三方 agent 框架）时再评估引入，届时 A2A 生态成熟度也更可判。**理由：协议债比代码债贵——现在引是提前付利息，互通复杂度没到。**

## 二·六聚焦逐评审

**② BOD CLI 与现役基础设施关系——复用为主·缺口三件**
现役可复用面：daemon HTTP+SSE（传输）/token 门（鉴权）/notify 信箱+outbox 三态（消息）/hub-watch 快照（状态·LG-082）/树协议+值席拾取（跨机任务）/TriRLC agent loop+session-store（宿主外会话运行时）。**缺口三件**：①BOD 视角聚合视图（四 daemon 读数+信箱分布+审批队列一屏）②BOD 会话的宿主解耦（现役 BOD=Claude Code 会话·解出后跑在 TriRLC agent loop 形态·最大件）③远程通道（微信端）。
**定性：并存起步、逐步承接、不推倒**——CLI 先做现役 BOD 会话的旁路镜像面，切换判据齐了才承接会话本体（§三 P3）。

**③ 微信小程序安全面（技术底线·产品/成本面候 CMO/CFO 会审）**
技术安全底线五条：①对外暴露面最小化——只读视图+白名单动作（审批/下任务两形）先行，**禁远程裸 shell/文件系统访问**；②身份绑定——微信 openid↔CEO 身份一对一绑定+服务端会话 token 短时效；③传输全 HTTPS+API 全 token 门（现役 X-Internal-Token 形延续）；④全操作审计台账（谁/何时/何操作/何参数——operating-records 面留痕）；⑤速率限制+异常登录告警（复用 notify 链——LG-082 出向形）。
合规成本提示（候 CFO/CMO）：小程序需企业主体认证+ICP 备案+服务器境内合规——**替代轻形**：企业微信自建应用（合规成本低一档）/Telegram Bot/PWA H5（零审核）先行验证需求，微信小程序候需求证实再投。**建议 P2 移动端先走轻形，小程序候裁。**

**④ M-SG 资源占用评估**
BOD CLI 本体=轻（一个 node HTTP 服务+CLI client·内存 <100MB·占 1 端口）——增量可忽略。**真正的资源大头是「BOD 24h 在线」的实现形态**：Claude 会话常驻（≈每席会话进程内存+API 持续消耗）vs daemon 常驻+会话触发式（daemon ~百 MB 级·agent 会话按需起）——**强烈建议后者**（§〇保留意见）。M-SG 现役 13 席+postgres+daemon 族背景下，触发式形态的增量在整机预算安全线内；常驻会话形态则显著加压且与河源 13 席部署窗（今日另排）的资源规划叠加。

**⑤ 与现役 Claude Code 宿主 BOD 过渡关系**
**旁路三阶段·每阶段独立可回滚**（CLI 永远是旁路面·停用即回现役会话·零残留）：
- P0 只读镜像：CLI 聚合四 daemon 读数+信箱分布+快照（零写面·对现役 BOD 零干扰）——**一致性判据=CLI 读数与会话面读数双跑对平（LG-082 hub-watch 已给快照基线）**
- P1 审批写回：CLI 上审批/转报动作写回 daemon（token 门+审计+幂等）——与现役会话并行操作期=**同一动作双入口去重**（message_id 幂等·outbox 现役形）
- P2 远程端：轻形移动端接 CLI API
- P3 会话承接：BOD 会话本体解出 Claude Code 宿主，跑 TriRLC agent loop 形态（CLI=唯一宿主入口）——**切换判据=P0-P2 连续两周双跑一致+agent loop 承载 BOD 全例行工作零缺口验证**；切换后保留 Claude Code 会话形态作冷备一个月再退役。

**⑥ 制度面等价落地（BOD 九条正身→CLI 权限模型投影）**
九条正身（集散地/不做判断/审批权 CEO/COS 链流转/台账留痕/无小任务豁免/裁决分级/纯净性/C-level 同步）在任何宿主实现中=**CLI 的权限模型与路由规则的机械投影**：
- 「不做判断/审批权 CEO」→CLI 内 BOD 登录态**无审批权 token**——审批动作须 CEO 身份令牌（登录身份与权限分离·硬编码非配置）
- 「一切指令性投递经 COS 链」→CLI 下发动作强制路由校验（目标=COS 才放行·直投执行域=内置拒绝）
- 「台账留痕」→CLI 全操作写 operating-records 面（append-only·同信箱纪律）
- 「C-level 即时同步」→CLI 状态变更自动触发 notify 广播（outbox 现役链）
**制度面协议无关——九条正身是行为合同，宿主只是履约器。建议：CLI PRD 里把九条逐条映射为权限规则表（CHO/CAO 会签面）。**

## 三·实施路径（四阶段·每阶段独立门禁与回滚）

| 阶段 | 交付 | 门禁 | 回滚 | 估量 |
| --- | --- | --- | --- | --- |
| P0 只读镜像 CLI | 聚合视图（四 daemon healthz+信箱分布+hub-watch 快照+watchlist）·部署 M-SG | 读数与会话面双跑对平·token 门全绿 | 停用即回（零写面） | 一周级 |
| P1 审批写回 | 白名单动作（审批/转报）·幂等+审计 | 双入口去重验证·审计台账齐全 | 动作开关回只读 | 一至两周级 |
| P2 移动端轻形 | 企业微信/TG Bot/PWA 三选一（候 CMO/CFO） | 安全底线五条全落 | 端下线 CLI 不动 | 一至两周级 |
| P3 会话承接 | BOD 会话解宿主→agent loop 形态 | P0-P2 双跑两周一致+例行零缺口 | 保留冷备一个月 | 月级·候 daemon agent loop 成熟度读数 |

**依赖与顺序**：P0 零依赖即刻可排；P1 依赖 P0 双跑对平；P2 依赖 P1 动作面+CMO/CFO 会审；P3 依赖前三+TriRLC agent loop 的长会话稳定性读数（armed 观察族——候数据不拍板）。

## 四·风险与缓解

1. **协议风险（提前标准化）**：现引 ACP/A2A=付利息——缓解：内化规范+留观察位（§一）。
2. **安全风险（对外暴露）**：远程面=新增攻击面——缓解：只读先行+白名单动作+审计+速率限制（§二③五条底线）·小程序重合规面轻形替代先行。
3. **资源风险（24h 在线误形）**：常驻会话形态费用与内存失控——缓解：daemon 常驻+会话触发式（§〇）·预算护栏 CFO 面。
4. **双轨漂移风险（并行期两套 BOD 态）**：CLI 与会话面状态分裂——缓解：daemon 面为唯一状态真源（快照+信箱）·两入口只读它·写动作幂等去重。
5. **制度失守风险（新宿主绕过九条）**：CLI 实现偏离行为合同——缓解：九条→权限规则表机械化（§二⑥）+CHO/CAO 会签。
6. **P3 大件风险（会话解宿主质量）**：agent loop 长跑成熟度未证——缓解：P3 排最后+armed 观察读数门·不达标就停在 P2（P2 形态已满足「手机随时看/下任务/做决策」的 90% 诉求）。

## 五·候裁面（CEO 意三问）

1. **ACP 定名**：宿主面协议（Zed ACP 标准接口 vs daemon HTTP 自有面——本席建议后者起步）与互通面（A2A 引入时点——本席建议留观察位）。
2. **24h 在线形态**：daemon 常驻+会话触发式（本席建议）vs agent 会话常驻——涉费用模型 CFO 面。
3. **P2 移动端选形**：轻形先行（企业微信/TG/PWA）vs 直上微信小程序（合规范证+成本候 CMO/CFO 会审）。

## 使用依据

- 现查 10-16：TriRLC src 结构实探（runtime/task-runtime/planner/session-store/tui/toolbus 全在）·三 daemon healthz（LG-082 卷 d54b65f43 能力面对表·昨日现探）；
- 协议现查：Agent Client Protocol（agentclientprotocol.com·Zed 2025-08·JSON-RPC over stdio·复用 MCP）·A2A（Google 2025-04·a2aproject·client/remote agent 模型）——WebSearch 现查非记忆；
- 现役先例：LG-082 hub-watch-snapshot 全链真通（4 拍实锚）·LG-036 outbox 三态·树协议值席拾取·D-52 五款一注（d8d398b）BOD 读链+补读义务；
- 纪律：D-55 三层判据（规则判下沉护栏）·D-46（token 面）·D-24（机位活探）。

—— CTO 小狄（落款 date 现查原值 2026-10-16 10:31:41 +0800）
