# 施工回报 · A2 #7 现役席活体首句探针（RDT 席）· 2026-10-20

- 令源：BOD 续令 2026-10-20（CTO 19:22 裁答全回后收官步）+ CTO 四正形（token 落 600/`--token-file`/零回显/毕删+find 断言）
- 施工席：r-duty-cos（河源 R 面·本机 shell 面）
- 签发时刻（date 现查）：UTC **2026-10-20T11:26:41Z** ＝ 北京 **2026-10-20 19:26:41 +0800**
- 水位自估：低（单次探针·只读 list + 单条 prompt）
- 末次活动时刻（transcript mtime 现查）：2026-10-20 19:26:41（本席 session.v4.jsonl.zstd，876334B）
- 探针执行段：**19:24-19:26 北京**（18:00 后非高峰段）

## 一句话结论

**探针已投递至 RDT 席（8791 内唯一 RDT 会话 `session-fb7dbf97…`），返回 `{accepted:true}`；`waitSettled` 观测 running=false，transcript 新增 9 条记录、assistant 文本=「探针收到」、**tool_records=[]**（零工具面）；token 文件已删，全工作区 token 残留扫描=0，find 断言零命中。8791 进程本体与其余 43 个会话零触碰。**

---

## 一、对象识别与一处命名口径勘正（请 BOD 确认）

- **`m-duty-rdt` 字面在 8791 `session/list`（44 项）与会话 transcript 中零命中**；8791 内 RDT 席位唯一，自报身份为 **`r-duty-rdt`**：
  - sessionId=`session-fb7dbf97-4fa9-4bca-a656-0c647ea0622f`
  - title=`r-duty-rdt 值席身份自报`
  - 首条 user message 原文含：「你是 R 面 r-duty 值席班组的一员（**席位名 r-duty-rdt**）」
  - cwd=`/home/fleet`，agentPreset=`standard`，`agentAvailable=true`，`running=false`
- 判读：**M 面宿主（8791）承载的 RDT 席位，席位自报名=`r-duty-rdt`**——`m-duty-rdt` 应为 M 面宿主口径；因 8791 内无第二个 RDT 席、且 title/首prompt 双重自证，本席按 **RDT 席位单例**投递。若 BOD 的 `m-duty-rdt` 另指他机/他会话，本探针对象需勘正（本席未触碰任何非 RDT 席）。
- 同批 14 个 `cwd=/home/fleet` 会话的 title 互证：sde/cfo/cho/cpo/cmo/cso/cao/coo/ste/fsd/rdt/cto/cos 各一（无 m-duty 命名字面）。

## 二、投前现态确认（无在飞 turn）

| 检查 | 读数 |
|---|---|
| `session/list` 条目 | `running=false`，`agentAvailable=true`，`updatedAt=1792331455427` |
| transcript 末记录 | `turn/end {turn:1, reason:{kind:"completed"}}`（seq=60） |
| 在飞 turn 判据 | turn/start 与 turn/end 配平；末条为 turn/end → 无在飞 |
| 其它席 | 未发任何 prompt；`session/list` 为只读 |

## 三、token 提取与处置（含一处必须上报的路径偏差）

### 提取

- 源=8791 进程（pid 243543，started 2026-10-17 14:32:08 +0800）启动行。`/proc/243543/fd/{0,1,2}` 读取被拒（permission denied），改由 **tmux `dsh-web-prod` pane 只读 capture** 取启动行（36 行 scrollback，`dsh web: http://127.0.0.1:8791/?token=…` 唯一一条）。
- **80 列终端换行坑（实锚）**：启动行恰好 80 字符，token 末字符被换到下一行（下一行单字符 `U`）。首次按单行提取得 **42 字符** → token 交换 HTTP **401**；按换行续接重建为 **43 字符** → token 交换 **303**，`session/list` 200。**token 提取必须做 wrap 续接**，建议后续正形入卷。
- 提取到投递全程零回显：未 `echo`/`tee`/`cat`；分析脚本只打印长度与 sha 前 8 位，不打印值。

### 路径偏差（照实上报）

- CTO 指定落点 `/home/fleet/.dsh/web-token`（600·umask 077·fleet）。实测：`install -m 600 /dev/null /home/fleet/.dsh/web-token` → **Permission denied**（DSH workspace-write 沙箱，`/home/fleet/.dsh` 在工作区外）；按流程发起 `danger-full-access` 一次性提权 → **no approval channel available**，无法落指定路径。
- 代偿落点：`/home/fleet/.dsh-workspaces/r-duty-cos/.probe/web-token`（`umask 077`，`-rw------- fleet:fleet`），客户端以 `--token-file` 读，语义与安全属性（600/属主/零回显/毕删）与指定路径一致，仅目录不同。
- 毕后处置：`rm` 文件 → 全工作区 token 值扫描（读文件流比对）**残留 0** → `find /home/fleet -maxdepth 5 -name 'web-token'` **零命中**；`pane.txt`（含 42 字符前缀）同删。

## 四、投递与验证读数

- 探针句（纯文本·含指定防误拾取字样·禁工具面）：
  > **BOD 通道探针·无需任何行动。请只回复「探针收到」四个字，不要调用任何工具、不要读写文件、不要执行命令。**
- 投前：`running=false`，`updatedAt=1792331455427`
- 投递：`session/prompt` → `{"accepted":true}`
- 收口：`waitSettled` → `running=false`，`updatedAt=1792495586447`
- transcript 断言（目标段 `session-fb7dbf97…`，seq>60 新增 9 条）：
  - 记录型：`agent/inbox/spliced, turn/start, agent/inbox/spliced, step/start, user/message, session-log-deepseek/delivery-accepted, assistant/message, step/end, turn/end`
  - 探针短语在 transcript：**true**
  - 回复短语在 transcript：**true**
  - assistant 文本：**「探针收到」**
  - **tool 类记录：`[]`（零工具面，符合禁令）**
  - 目标段 mtime/size：2026-10-20 19:26:27 / 56320B

## 五、护栏复核

| 护栏 | 实况 |
|---|---|
| 零触碰 RDT 外任何席 | 仅对 `session-fb7dbf97…` 发 1 条 prompt；其余 43 会话零 prompt、零写入 |
| 会话库 | 仅目标段新增本轮记录；其余段 mtime 未动（未做全量 before/after 哈希，如实标注） |
| 8791 进程本体 | 零触碰：未重启、未发信号、未改配置；只读 tmux pane 启动行 + `/api` 调用；全程 `curl /` = 401（活），pid 243543 ELAPSED 3-04:54 未变 |
| daemon/cron | 零触碰 |
| D-46 | token 值零打印；文件 600；毕删+残留扫描 0；报告不载任何 token 片段 |

## 六、三送与落树

1. **落卷（应达面）**：本文件，r-duty-cos 工作区 ✅（BOD 直读收执）
2. **回信本会话**：✅
3. **树内副本**：`docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/reports/rduty-a2-probe-20261020.md`，commit 见推平后补注（sg dev；post-receive pull/tick/mirror 照走）。
4. 箱投仍受 TriMMC outbox 通道限制，以树内件代偿，请 BOD 转知 COO。

## 七、候裁/待确认

1. **命名口径**：`m-duty-rdt` = 8791 内 `r-duty-rdt`（本探针对象）？如另指他机/他会话，请勘正对象后本席重投（本次探针未触碰非 RDT 席）。
2. **路径偏差确认**：`/home/fleet/.dsh/web-token` 因沙箱不可写，已用工作区 600 文件代偿；是否接受该代偿，或请 BOD 指定沙箱可写落点。
3. **提取正形**：建议把「tmux 启动行 80 列 wrap 续接」写入 token 提取 SOP（本次 42→43 字符之差即 401→303 的实锚）。

—— r-duty-cos · 2026-10-20 19:26:41 +0800（date 现查原值粘贴·D-47 机械闸）
