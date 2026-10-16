# CTO 权威作答卷 · LG-085② 追加五问（消息通路机制层细勘·CEO 终裁前最后一轮）· 2026-10-16

- sourceOfTruth: 本卷（trees/lg085-bod-cli-acp-review/cto-messaging-mechanism-five-q-20261016.md）
- syncMode: static（权威作答卷·经 COS 呈 CEO·LG-085② 终裁候卷）
- lastSyncedAt: 2026-10-16T21:45:56+08:00（date 现查·写前跑）
- 令源: CEO 21:32:58 五问原话（BOD 21:33:18 转办·COS 21:38 转请）——「①本地域席位无定时器不会读信箱吧？②跨域仅支持 4 daemon 间投递信箱吧？实时通话实现了么？③到域后席位也得设定时器拉取吧？④dsh 13 席怎么互发怎么取信？⑤cli+daemon+脑子——脑子需要 daemon 能支持像 SendMessage 一样的四个域互发消息的能力。」
- 实证基线: 本卷全部机制定性=源码现探实锚（TriMLC/TriMMC/TriRLC/TriRMC/agent-core·10-16 21:3x-21:4x 现探），非推演。

## 〇·总图一句话

**现役消息通路=「活会话 uds 直推（同机准实时）+ 跨域 outbox 低频拉取（分钟级信箱投递）」两形并存；跨域实时通话未实现；席位级定时器拉信现役不存在（CEO 判断①③正确）；「推送到席」的最后一跳（落箱→席会话）是全链唯一结构性缺口——补齐归 daemon delivery 层，天-周级工程量，正嵌 P1。**

## 一·问① 本地域席位收信机制现状——推+拉双形·席位无定时器（CEO 判断正确）

【现役实证】
- **推模式（主形·准实时）**：uds SendMessage=Claude Code 宿主原生机制（同机活会话直弹）——本席与 COS/COO/CFO 互发现役即此形。**BOD 现役收信=SendMessage 直推**（CEO「目前 bod 是 SendMessage」正确）。
- **拉模式（信箱·非自动）**：daemon 信箱=TriMLC 8713 letter-store（源码实锚：POST notify-in 落箱→GET /internal/v1/notify/mailbox 计数+POST markRead）——**席位侧无定时器轮询**，落箱不自动进席会话。
- **兜底现役=外挂监视器**：hub-watch-snapshot（LG-082）cron 级监视信箱 unread 增量≥5→告警 COS 转席——「席不读信箱」的现役兜底是外挂脚本+人工链，非席位自动。
- **复活补读**：会话重启时补读信箱/transcript（D-52 义务）——拉模式的复活时点特化形。

【缺口】席位级「新信自动到达」机制不存在——活会话靠发端推（uds），死信靠人/外挂发现。

【补齐方案】见问⑤统一答（daemon delivery 层活性路由）。

## 二·问② 跨域「实时」定性——现役=分钟级拉取投递，实时通话未实现（CEO 判断正确）

【现役实证】（源码实锚 TriMMC outbox.ts + TriMLC puller.ts）
- 跨域链（LG-036）：发端 TriMMC（sg 8712）outbox **入队**（幂等/TTL 24h/4KB 红线/三态 accepted→forwarded→delivered）→ **TriMLC puller「独立低频 interval」拉取**（GET sg outbox→逐件落箱）→ urgent=Windows toast（推给人）· normal=落箱即 delivered（信箱可见=送达）。
- **定性：拉取形非推送·分钟级（intervalMs 低频配置）**——「跨域仅支持 4 daemon 间投递信箱」正确。
- **实时通话跨域未实现**；同机 uds=准实时但不出机。ssh/tmux send-keys 形=人工通道非系统通道。

【缺口】跨域「推送到席」双跳都缺：域间传输段=拉取（分钟级）+最后一跳（落箱→席）=无。

【补齐方案】域间段保留 outbox 拉取（可靠+幂等+审计已成型·改推送收益小风险大）；**补的是最后一跳**（问⑤）。若 CEO 需要跨域低时延告警类，可加 urgent 提频通道（专用小队列·秒级 interval）——候裁项非必选。

## 三·问③ 目标域席位取信机制——席位级定时器现役不存在（CEO 判断正确）

【现役实证】
- M 面 claude code 席取信：**无自动机制**——活会话靠发端 uds 直推；信箱件靠席主动查/复活补读/hub-watch 外挂告警转席。**tmux 提示形=TriRMC 值席时代形态**（树协议值席拾取·人工位）非系统拉信。
- 定时器分层实态：**席位级无·daemon 级有**（TriMLC puller interval/cron tick/mirror pusher）——「到域后席位也得设定时器拉取」的现状=没有，靠复活补读+外挂。
- R 面 dsh 域（TriRMC 8710）：session-bridge 管会话生命周期（new/prompt/update·120s 超时已勘）——**无 notify/mailbox 面**（源码 grep 零命中）。

【缺口】同问①——全谱系席位取信自动化缺位，dsh 域更缺（信箱面整个不在）。

【补齐方案】见问⑤；dsh 域信箱面随序2 ACP 适配层施工补形（问④）。

## 四·问④ dsh 13 席互发与取信——进程内可发·跨 daemon 不可用·取信靠 ACP 桥（段A 施工中）

【现役实证】（源码实锚 TriRLC src/tools/send-message.ts + agent-core）
- dsh 席 SendMessage 工具=「CC SendMessageTool A 级复制·TriLC localbus 适配」——源码头注明书：**「TriLC 仅支持进程内消息·Cross-daemon messaging and remote control features are not available」**。
- 即：dsh 13 席同一 daemon 进程内=localbus 互发可用；**跨 daemon（跨域/跨机）不可用**。
- 取信：dsh 席无 uds（非 Claude Code 宿主）——正确形=**ACP 适配层桥接**（段A 施工件②·合同定稿）：daemon 信箱件经适配层转 ACP session/prompt 注入会话流。**此件今晚序2 施工+实测首验**——exact 注入形以段A 实测读数为准，本卷不断言细节。
- 与 claude code 席差异：claude code 席=宿主 uds 直推+复活读；dsh 席=ACP 桥接（若按合同落地，**dsh 席反而是 daemon 主动注入的推送形**——比 claude code 席的拉形更接近 CEO 要的终态）。

【缺口】dsh 跨 daemon 互发=同问⑤缺口；dsh 信箱面=序2 施工补形中。

【补齐方案】同问⑤统一 delivery 层；dsh 侧落点=TriRMC 信箱面+ACP 注入桥（段A 序2 正在装，补「信箱→注入」接线为其增量）。

## 五·问⑤ SendMessage 等价四域互发推送补齐——daemon delivery 层统一·天-周级·正嵌 P1

【总架构要求回应】CEO 要求「脑子需要 daemon 能支持像 SendMessage 一样的四个域互发消息的能力——不是信箱等席来拉·是推送到席」——**架构判断完全正确且正当分层**：推达语义归 daemon delivery 层（脑子只调「发信 API」，到达性由 daemon 保证），与 LG-085 已批分层（ACP 管会话驱动·HTTP 面管状态消息）同构延伸。

【现役缺口几何】
1. 同机推送到活席=uds 现役✓——但系 Claude Code 宿主机制非 daemon 能力（dsh 席无此面）；
2. **最后一跳（落箱→席会话）全谱系缺**——信箱落箱即终态，无活性路由；
3. 跨域域间段=拉取已可用（分钟级·可靠），不必改；
4. 席不活时=复活补读形（半自动·义务制非机制制）。

【补齐方案（daemon delivery 层·三件）】
- **件 A 活性路由**：letter-store 落箱时查目标席会话注册表（daemon session-store 现役有账）→活=直推（claude code 席走 uds pipe·dsh 席走 ACP 注入桥）+落箱双写幂等；不活=落箱+待读标记（复活注入）。
- **件 B 发信 API 统一**：daemon 暴露 `send(seat, body)` 单端点（域内直达+跨域转 outbox）——脑子/CLI/席工具全走同一 API，四域语义一致。
- **件 C 到达回执闭环**：直推 ack+复活注入 ack 回写 delivered 三态（outbox 现役三态自然延伸）。

【工程量】单域（TriMLC）件 A+B=**天级**（落箱点已有·活性查 session-store 已有·uds 推送复用现役形态）；四域推广+件 C=**周级**。TriRMC 侧随段A 序2 适配层顺路（信箱面本就在施工中）。

【与 P0-P3 嵌入】P0（只读镜像）零依赖不动；**P1（审批写回）正嵌件 A/B**（写回面同属 daemon 写路·同一门禁同一审计）；P3 脑子驱动直接消费统一 API。建议：P1 范围声明加「delivery 层件 A/B」一行，工程量并入 P1 周-双周估算不单列窗。

## 六·随卷三件（协作面批注·不占本卷主线）

1. **required:true 裁（COO 21:40 随判件）**：裁**接受现状+suppress 场景运行期监控+上游 types 增补挂候窗项**——理由：等上游=段A 命脉挂外部依赖违小步验证；suppress=边缘态可监控覆盖；三验①compass 渲染对表仍是接位硬门不受影响。SDE 可照此归档候窗项。
2. **监测哨样本读数初勘已出**（15 树两轮·top8 探形）：探路型 0.5-90M 区间/批量型 36M-1.08B/长跑型 67M-452M——**top8 探最大者含共享长会话消耗（高估）·方法论局限如实标注**，读数作 CFO 定参考区间不作定值锚；CEO「1 亿对长跑型必然误伤」预判获实证（长跑型 3/5 超 1 亿）。卷随明晨交 CFO（一并呈）。
3. 段A 督导位：n2b 发布 v2 全绿收讫·n3 候三验读数随判。

## 使用依据

- 源码现探（10-16 21:3x-21:4x）：TriMLC src/notify/{letter-store,puller}.ts+src/server/app.ts L3430-3490（notify-in 落箱/mailbox 计数/markRead 端点·无席推送端点）；TriMMC src/notify/outbox.ts（三态/TTL/4KB）；TriRLC src/tools/send-message.ts（进程内限定明注）；TriRMC src/orchestration/session-bridge.ts（无 notify 面）；agent-core permissions/loop（问⑤活性查 session-store 依托）；
- LG-036 outbox 三态链现役·LG-082 hub-watch 外挂监视现役·D-52 复活补读义务；
- dsh-window1-contract-20261014.md 件②（ACP 适配件·段A 施工中）。

—— CTO 小狄（落款 date 现查原值 2026-10-16 21:45:56 +0800·发毕对表）
