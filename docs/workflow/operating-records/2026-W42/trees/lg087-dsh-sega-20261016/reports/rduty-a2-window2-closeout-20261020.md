# 施工回报 · BOD-ORDER-a2-20261020（LG-087 段B 补验件·窗2 四件 + DAEMON_NAME 连带批）

- 令源：BOD 2026-10-20 11:32 落件 `BOD-ORDER-a2-20261020.md`（A2 派工令补达·CEO 2026-10-19 21:38:53 照准）+ 11:31:42 窗位补注（今晚非高峰段）
- 施工席：r-duty-cos（河源 R 面，本机 shell 面自施工）
- 签发时刻（date 现查）：UTC **2026-10-20T11:05:50Z** ＝ 北京 **2026-10-20 19:05:50 +0800**
- 施工时段：**18:57-19:10 北京（18:00 后非高峰段·DeepSeek 半价档）**；模型调用 2 次（隔离实例探针 + selftest 各 1 次）
- 水位自估：中（连续施工约 1h，剩余窗约 4h50m，未临界）
- 末次活动时刻（transcript mtime 现查）：2026-10-20 19:05:50（session.v4.jsonl.zstd，527589B）

## 一句话结论

**#1 桥分型超时修订已验绿并推平远端（2c5395e，此前仅本地 commit 未 push）；#4 credentials 勘验复核：现役已是 store 形（600 私文件），隔离实例仅凭 store 即完成模型调用，迁移 C 无待办；#7 a 案 Gateway Remote 最小客户端勘写毕并落 TriRMC dev（ac5f01a，隔离 8799 实例端到端绿，现役 8791 零触碰）；#3 ACP 适配件按令「设计先行·未毕不硬塞」改道并入 CTO D' 段1（FSD），本席不重复施工；连带批项① DAEMON_NAME 已由 CTO 10-19 施工毕（431d9e754），r-duty 无动作。**

---

## 一、逐件读数

### #1 TriRMC 桥分型超时修订（轻）——**毕·已落远端**

- 现场实锚：本机 `/srv/fleet/TriRMC` HEAD=`2c5395e`（10-17 13:14 施工·commit message 载 CTO 门禁一读放行 13:11:38），但 **sg 裸仓 dev 仍停在 `a02d89b`**——即「施工毕、未推平」，正是窗2 候补验的真实缺口。
- 本次：workspace 克隆复核 → `npm run check` 绿 → 全量 `npm test` 462/467 pass，5 fail；**同一 5 fail（同计数同套件数 467/124/462/5）在父提交 `a02d89b` 基线重跑复现**（ctx.cwd 传播 / pre-receive 三闸 / Employee Registry 等，环境性非本件引入）→ 快进推平 sg `refs/heads/dev`。
- 推平读数：`a02d89b..2c5395e`；sg 裸仓 `git log -1 dev` = `2c5395e fix(bridge): per-message timeout 覆盖形（P1·LG-087 段B）`。
- 行为口径（照 diff）：`body.timeoutMs` 仅显式 finite number 覆盖、夹紧 30s-600s；其余走缺省 120s，零行为变化；接口层零改。

### #4 credentials service 勘验（轻）——**毕·现状即 B 形，迁移 C 无待办**

| 勘面 | 现查读数（2026-10-20 19:0x） |
|---|---|
| dsh 版本 | 0.2.0-rc.2（`dsh --version`） |
| store 文件 | `/home/fleet/.dsh/.credentials.yaml`，`mode=600 owner=fleet:fleet size=223 mtime=2026-10-17 13:34:44 +0800` |
| store 结构（值面零回显·D-46） | `records.client-connection/browser-session`（签名 secret）+ `refs.DEEPSEEK_API_KEY`（direct 落 store，**非 env 引用**） |
| lookup 优先序 | launch env → store → project `.env` → harness-home `.env`（dsh-credentials-local README 直读） |
| 轮换语义 | rotated stored key **下一请求即生效·零重启零配置改动**（dsh-credentials README 直读） |
| 活体证 | 隔离 `DSH_HOME` 仅复制该 600 store（cp 不 cat），**无任何 env 注入**，`dsh web --port 8799` 下 `session/prompt` 真实模型调用成功并落 assistant 回复——证明解析链确实走 store |
| 边界 | 官方明示 store 不能隔离 agent 本身（同 OS 用户）；席间同 fleet 用户为路径级分离非强隔离——与 P2 卷结论一致 |

- 结论：**现役已是「store 形（B）」，且 key 已长驻于 600 私文件**；P2 卷所议「C 混合迁移一次」在现行盘面已无对象。候 CTO 裁面可据此收口（建议：确认 B 为现役定谳，env 注入退役时点入账）。
- 未动作：未读值、未改 store、未轮换 key、未重启任何 daemon。

### #7 a 案 web API WS 客户端勘写（主件·半日级）——**毕·勘写双落（代码+卷）**

- 交付物（TriRMC dev，commit **`ac5f01a`**，单笔可 revert）：
  - `scripts/dsh-gateway-client.mjs`（319 行·零依赖·Node>=22）
  - `test/dsh-gateway-client.test.ts`（11 用例）
  - `docs/dsh-gateway-client.md`（协议实锚+边界+活体读数）
- 协议定谳（dsh 0.2.0-rc.2 源码只读实锚）：
  - 认证：`GET /?token=<launch-token>` → 303 + 签名 HttpOnly Cookie（host:port 绑定）；
  - unary：`POST /api/<namespace>/<method>`，封套 `{type:'client-request',rpcId,method,payload:{args}}`，回 `{type:'server-response',rpcId,result:{ok,value|error}}`；
  - WS：`/api/remote.mux`，帧 `open/item/end/error/cancel`（streamId 分流）；
  - 端点：`session/list`、`session/create`、`session/prompt`（`content:[{type:'text',text}]`，回 `{accepted:true}`）、`$events` 首帧 `ready`。
- 活体证据（**隔离实例 8799 + 临时 DSH_HOME，零触碰现役 8791/13 席库**）：
  1. token 交换 HTTP 303，Cookie 落位；
  2. `session/list` 200；
  3. `$events` WS 首帧 `ready`；
  4. `session/create` → `session-5ddce6d4-…`；
  5. `session/prompt` → `{accepted:true}`；
  6. `waitSettled` 观测 running=false + updatedAt 前进；
  7. transcript 落盘 `assistant/message` 文本=**「收到」**，`turn/end reason=completed`（不是只收单，是真回复）。
- 单测：`node --import tsx --test test/dsh-gateway-client.test.ts` → **11/11 pass**。
- 关键判读：**ACP `resume` 对 web 存量段不可寻址（目录名 `session-` 前缀），但 session controller 按 `sessionId` 直投不经过 `findLog`——本客户端因此能对既有 web 席发消息，补上 D' 红侧降级面**。机制面成立；**对现役席的活体首句未发**（硬护栏零触碰），候 BOD 批准单席探针后补锚。

### #3 acp 适配件（设计先行·未毕不硬塞）——**不重复施工·改道并入 D' 段1**

- 现势：CTO 已于 **2026-10-20 18:21** 落 D' 主线定稿 `docs/execution/dprime-tui-acp-architecture-20261020.md`（686e489c7）：TriRLC TUI 经 `useAcpSession` 接 `dsh --profile acp`，自写 newline-delimited JSON-RPC 帧层；**段1（acp-client + hook + CLI 接线 + 假流端到端）施工位=FSD 连夜段**，段2 候窗。
- 本席判定：A2 #3 原议「mailbox 桥 + per-session 注入」已由 D' 设计承接并改换施工位（TUI 客户端面），本席若另起一版=重复施工/双实现冲突。按令「CTO 设计先行·未毕不硬塞」→ **不施工，标注改道**；本席 #7 客户端已覆盖「向既有 web 席投递」的 mailbox 功能面，可与 D' 段1 并读。
- 候 BOD 对表口径：A2 #3 建议按「并入 D' 段1 销账」处理（或 BOD 明示仍要独立适配件，则本席另排小窗）。

### 连带批项① DAEMON_NAME per-daemon 化——**CTO 已毕·r-duty 无动作**

- CTO 10-19 21:45 毕报 `trees/e1-daemon-jobs-window/cto-daemon-name-build-closeout-20261019.md`，施工笔 `431d9e754`；五门中①-④绿，**⑤真窗身份实证候自然拍**（不阻收口）。
- r-duty 部署衔接注记（照 CTO 卷 §四）：8712/8710 壳显式 `TRILC_WR_DAEMON_NAME='TriMMC@8712(sg-m-duty-host)'` / `'TriRMC@8710(r-hy-r-duty-host)'`；r-duty 面 fetch dev 即得新版，无需二次改造。

---

## 二、硬护栏复核（本节点）

| 护栏 | 实况 |
|---|---|
| 现役 web 会话 / 8791 | **零触碰**：未发消息、未重启；期间 `curl 127.0.0.1:8791` = HTTP 401（活），pid 243543 ELAPSED 3-04:33 未变 |
| 13 席会话库 | 未写入；活体测试全部落隔离 `DSH_HOME`（临时目录，用后即删） |
| D-46 token/凭据值面 | 零回显：store 只列键名与长度、token 经 `--token-file` 读取且代码级 `redact()` 掩形、报告不载任何值 |
| daemon/cron | 零触碰（未起/未停/未 PATCH） |
| 现役代码 | #1 为既有 commit 推平（行为已 CTO 门禁一读）；#7 为纯新增三文件，零改现役代码 |
| 回滚锚 | #7 `git revert ac5f01a` 单笔；#1 `git revert 2c5395e`+按需重启 |

## 三、三送状态与候裁

1. **落卷（应达面）**：本文件，r-duty-cos 工作区 ✅（BOD 直读收执）
2. **回信本会话**：✅（同轮回复）
3. **COO/CTO/COS 三送**：⚠️ 本机无可用 notify 入箱通道（TriMMC outbox 消费端 10-16 起未在跑、写面亦被沙箱拒），**以「TriMetaverse 树内报告」代偿**：本卷副本落 `docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/reports/rduty-a2-window2-closeout-20261020.md`（CTO 遥审直达·禁会话中继暗签），BOD 可转知 COO 督办台账。
4. **候裁/候批**：
   - #7 现役席活体首句探针（单席、可撤回、需 BOD 明令）——本席不擅动；
   - #3 口径：并入 D' 段1 销账 vs 另排独立适配件；
   - #4 CTO 裁：确认 store(B) 为现役定谳；
   - DAEMON_NAME ⑤ 真窗身份实证：候自然提醒窗（非本席面）。

## 四、风险与未验

- **#7 未对 8791 实发**：机制面与隔离活体绿，但「现役 13 席存量段的真实投递」=候批准后的单席探针；未验前不得写成「13 席通道全绿」。
- **token 来源**：`dsh web` 启动 token 只在启动行出现；生产使用时建议 BOD/CTO 约定 token 文件落点（600），禁 argv/报告回显。
- **全量测试 5 fail 为存量环境项**：已在父提交基线复现，不阻塞本件；但若 CI 以全绿为门，需另立清淤项（非本窗范围）。
- **端口 8799 临时实例**：已于签发前停止（`ss` 无 8799 LISTEN）并删除临时 `DSH_HOME`（含凭据副本），`find` 复核工作区无 `.credentials.yaml` 残留。
- **R 面本地 checkout**：`/srv/fleet/TriRMC` 现停 `2c5395e`（#1 已含）；`ac5f01a`（#7）在 sg dev，R 面本地需 `git fetch && git merge --ff-only` 才见（本席沙箱写面限 `/srv/fleet`，未直改本地仓）。

—— r-duty-cos · 2026-10-20 19:05:50 +0800（date 现查原值粘贴·D-47 机械闸）
