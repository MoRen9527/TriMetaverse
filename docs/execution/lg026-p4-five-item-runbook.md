# LG-026 P4 五事项执行单（备妥稿，候开窗令即执行）

- sourceOfTruth: TriMetaverse/docs/execution/lg026-p4-five-item-runbook.md
- syncMode: runbook｜lastSyncedAt: 2026-09-07（FD 小全备妥稿，CTO 派工令 BOD 催办批）
- **硬停条款：22:00+08 全窗硬停**——任一事项 22:00 未达判据即就地冻结留痕（半成品标注+回滚点），不跨夜续跑；开窗令未到本单零执行。
- 依赖总表：①c 项硬前置=cmd 重挂 CEO 提权（8713 可起）——前置不备 c 项整体跳过不硬闯；②d 项前置=TriModel serve 面在役（healthz 现状勘定 5 分钟）；③a 项合成样本走 TriRMC probe 通道（scripts/mc-probe.mjs 同族，禁触真实任务流）。

## a. seq 冲突对账实录（TriRMC events/seq-report 端点实读）

**脚本序**（TriRMC 仓根执行，node:sqlite 直读+probe 注入）：
1. 基线读数：`GET /internal/v1/events/seq-report?nodeId=<真实 nodeId>`（header X-Internal-Token）→记录 {total,gaps,duplicates,lastSeqNo} 基线；
2. 合成断链样本：本地构造 events 3 件（seqNo=基线 lastSeqNo+101/102/103，eventId=lg026p4-synth-*）→`POST /internal/v1/events/replay`→断言响应 accepted=3 conflicts=[]；
3. 断链模拟：临时 iptables/断网面**不实做**（sandbox 原则）——以「先发 seq+103 后发 +101/102」乱序提交复现冲突/洞→seq-report 复读验 gaps 出现→再补发缺序件→复读 gaps=0（对账闭环全录）；
4. 全程逐条录响应 JSON+时间戳→落 `docs/test/evidence/lg-026-p4/seq-reconcile.log`。

**判据**：冲突检出（乱序 gaps>0）→仲裁（replay accepted+conflicts 结构化）→对账闭环（补发后 gaps=0）三段全录=过；任一段无录=不过。
**依赖**：TriRMC 服务面（8710）在役+token。

## b. BOD 点名实录（转正/回归+leader/replica 角色切换全录）

**脚本序**：
1. 观察期弧线导出：mc_heartbeats 全量（切指时刻 2026-09-04T20:53Z 起）→按小时桶聚合 {每小时: 总数/degraded 数/gaps 数}→弧线 CSV 落 evidence；
2. 角色切换实录：TriRLC（leader 候补）与 TriRMC（leader）心跳在位性+8711/8710 双面 healthz 并时采样（5 分钟窗×10s 采样）→leader/replica 判定表（谁是主上送端/谁是服务端，现役形态=TriRLC→TriRMC 单向，replica 语义=TriRMC 台账承接）如实录；
3. 转正/回归判读：TriRMC 服务面「转正」=8711 上送对端且 24h 观察 ARC 通过（BOD 终裁已批早切）——实录引用观察满读数+终核保险执行记录（恶化弧自恢复判读在卷）。

**判据**：弧线 CSV 完整+双面并时采样≥10 点+角色判定表落档=过。
**依赖**：无新增（只读实录）。

## c. 8713 部署窗组长 live 面（**硬前置链候①**）

**硬前置**：cmd 重挂 CEO 提权（8713 可起）——前置不备本事项**整体跳过**（runbook 头条款）。
**部署步骤（备妥，候前置）**：
1. trimlc-channel 仓 build（`npm run build`，D:\Code\ai\trimlc-channel）；
2. 8713 起动（CEO 提权 cmd 重挂后）：照仓内 serve 惯例+TRILC 侧通道 env 接线；
3. 组长注册断言：`GET http://127.0.0.1:8711/healthz` → `heartbeat.agentCount==2`（组长+既有 agent）；
4. service 面 healthz：8713 端口 healthz 探活 200。
**判据**：agentCount=2+8713 healthz 200 双断言过=组长 live 面成立；任一不过=回滚（停 8713 进程，记录 stderr）。
**依赖**：硬前置①（候 CEO 提权窗）。

## d. rateLimitedCount 上 healthz（code-state 勘定后落字段+断言）

**勘定步**（开窗首 5 分钟）：code-state.md「rateLimitedCount」现役语义勘定（当前 code-state 零记载=候 code-state 域补记，勘定记录落 evidence）；数据源=TriModel relay.ts tokenStats（reason='rate_limited' 计数现成）。
**落字段步**：TriModel serve 面 healthz json 增 `"rateLimitedCount": <tokenStats 中 rate_limited 事件数>`（一行 getter，b149952 后形态 relay.ts 已备）；
**断言步**：注入一枚 429 合成错（sandbox fake provider 或直调 recordRelayEvent）→healthz rateLimitedCount +1 →复零（reset）不残留。
**判据**：healthz 字段在位+注入断言 +1/-复零双读数=过。
**依赖**：TriModel serve 面在役；code-state 补记候域（不阻塞字段落地，注记跟踪）。

## e. 授权面黑盒门禁（P2 验收预案正用）

**矩阵**（actor×工具，default-deny）：

| actor | Read/Glob/Grep | Bash | Write/Edit | 网络面（WebFetch 等） |
| --- | --- | --- | --- | --- |
| 白名单 agent（组长席） | ✅ | 白名单命令集 | 工作目录内 ✅ | deny |
| 未登记 agent | deny 全列（default-deny） | — | — | — |

**脚本序**：逐格黑盒调用（真执行非清单读）→每格录 {actor,tool,allowed?,实际 rc/错误}→default-deny 断言=未登记 actor 全格 deny 且无旁路（LG-026 工具权限双层探边教训：清单可见≠执行放行，断言实调用非 blocked 清单）。
**判据**：矩阵全格实录+default-deny 零旁路=过；任一「应 deny 实 allow」=门禁失效即停窗升级。
**依赖**：P2 验收预案原表格（黑盒用例直接复用，实测口径）。

## 硬停与回滚总则

- 22:00+08 硬停：任一事项未毕就地冻结——半成品 commit 标 `wip(lg-026-p4): 22:00 freeze`+evidence 落档+回滚点注明；
- c 项前置不备即跳；a 项禁触真实任务流；d 项 sandbox 注入后必须复零；
- 全窗零触：河源接收面/现有连接/8711 注入（LG-032 通道保持态）。
