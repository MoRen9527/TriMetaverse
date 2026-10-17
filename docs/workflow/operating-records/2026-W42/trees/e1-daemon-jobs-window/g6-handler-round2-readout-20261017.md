# G6 二轮勘·TriMMC handler 投递段勘验读数卷（CTO·只取证零改动）

- date 现查: 2026-10-17 12:5x–13:0x CST（60min 窗内 ✓）
- 勘验位: sg（源码直读 /srv/fleet/TriMMC/src + 活体 systemctl/proc/ss；D-47 落款=本卷 commit 时点）
- 铁则恪守: 只取证勿盲动 ✓（零重启零配置写零服务触）

## 四路勘验结果

### 路 1·handler POST 处理路径 ✓（钉死）

`app.ts:603` POST `/internal/v1/heartbeat`：JSON parse（坏体=400）→ **`hb.nodeId` 存在才写 `mirrorStore.recordNodeHeartbeat(nodeId,state)`（纯内存 Map，store.ts:42-58）→ 无条件 200**。两发现：①** nodeId 缺席分支=静默 200 不落表**（响应 `nodeId:"unknown"`，Map 零触——发送侧若脱 nodeId 即得 200 假绿）；②异常吞没点=无（Map 操作无异常源，handler 无 try/catch 需要）。

### 路 2·内存 map→store 持久化链 → **不存在（设计如此）**

`src/mirror/store.ts` 全文**零持久化方法**（无 save/persist/flush/sqlite/writeFile）；`app.ts:63` `new MirrorStore()` 每 boot 重建（现进程 10-15 19:40:52 起=Map 即现役全量）；TriMMC src 全树 **sqlite/MC_DB_PATH 引用=0**（/var/lib/trimc 下亦无 sqlite，唯 config-cache.json）。

**案情重定性**：「handler 收单 200→store 写入之间丢」的框架**不成立——心跳数据从未有过 store**。b2「store 末真值 09:23:15」实为 **watch job 自身状态文件记录**（e1b2 spec §一幂等条款「告警态记 job 侧本地文件」），非心跳持久化面。

### 路 3·读取端点值面 → **挂点 A 缺口实证（架构级）**

`nodeHeartbeats` **无任何 GET 读端点**（`getNodeHeartbeat`/`heartbeatCount` 零路由挂接；mirror query 端点 app.ts:432 只读 tasks 不读 heartbeats；healthz 不含 heartbeat 面）——**TriMLC 末心跳时刻的查询面不存在**。e1b2 料包 §〇 自注「存储/查询面未活体勘」——本次源勘钉死：**缺位，需建设**（b2 watch 的数据面缺口=架构级非配置级；09:23:15 后零新值机理=挂点 A 缺口下 job 无真心跳读面，或 8713 侧醒沿后心跳真断，两案同族「宿主睡眠冻结」归因已在 b2 毕报）。

### 路 4·多实例/分流排除 ✓

单实例实证（g5 形态 B：pid 41261==MainPID+ss 单监听行）；**bind=127.0.0.1**（app.ts:783 默认 loopback，TRIMC_HOST 未设）——**跨机到达=经 18710 隧道**（e1b2 spec §〇 现役注明），dev 口直连 8712 构造性不可达；channel.log 200 源=隧道内到达 ✓，路由排除。

## 案情终定性（重定性）

心跳链「200→store 丢」不成立；真缺口=**挂点 A（心跳读出面）架构缺位**+两个次要面：①发送侧 nodeId 缺席静默 200（发送侧契约核点，归 H 件/dev 面）；②心跳无持久化（进程重启即失忆——10-15 restart 后 map 全新，历史新鲜度不可考，b2 前段读数跨 restart 不可比）。

## 随办输出

- **H 件投递层归属终判输入**：handler 段无异常吞没无静默丢（nodeId 缺席分支除外）——H 件 notify 面同步钉=notify 链独立于 heartbeat 面，互不牵连。
- **E1-4 料包 v2 输入（挂点 A 定谳=缺位需建设，三选项候 v2 排窗裁）**：①TriMMC 增 GET `/internal/v1/heartbeats` 读端点（token 门内，量小）；②watch job 改 in-process 形态（TriMMC 内置 job 直读内存，零端点）；③TriMLC 侧心跳时间戳落 sidecar 文件供 sg 读。优劣随 v2 卷。

## 使用依据

/srv/fleet/TriMMC/src/server/app.ts（:63/:385/:432/:603-640/:782-795/:825）；src/mirror/store.ts（25-110 全读）；src/cron/routes.ts 委托面；g5 工单卷（41261 三证）；e1b2 料包卷（§〇/§一）；ss/systemctl 活体读数；毕报-b2勘钉并宗卷（对表料）。

## 五、优先第五路·改名迁移遗留面（CEO 12:54 点名·BOD 12:55 补单）✓（四点勘毕）

| 点 | 勘读 | 判 |
|---|---|---|
| ①unit/ExecStart/Environment 版本面 | trimc.service（Description「TriMC Main Controller (dist production form, r15-1-4)」）+7 drop-ins（CONFIG_DIR=/var/lib/trimc/HOME=/root/NOTIFY duty/PORT=8712/user-fleet）+trimc-start.sh（**09-29 cutover 形**：cd /srv/fleet/TriMMC+docker/.env+TriModel 3333 token+exec node dist/src/index.js » /tmp/trimc-run.log） | **无新旧混装**——代码树/启动脚本/配置目录全为 09-29 cutover 后新形；化妆级残留两处=Description 旧名+HOME=/root（User=fleet 错配，观察项） |
| ②[trimc:mirror] 日志流续写逻辑 | 三写点全事件条件式（store.ts:58 recovered/:92 stale→unknown/:142 terminal→running）→stdout→/tmp/trimc-run.log；**正常心跳到达零日志行**（recordNodeHeartbeat 静默） | **观测面分叉候选坐实（方向）**：若 b2 观测面锚在日志流/mirror 行位，健康期该面恒静默——「零新值」观测在健康运行期也是常态面输出，假绿根因候选成立向 |
| ③handler 登记路径名错位 | nodeHeartbeats 按**上报端原样 nodeId** 存键（零校验零归一）；watch 侧若按现役名过滤而上报端仍发旧名键 → handler 200 照收（键不同）+watch 观测面恒空 | 错位机理成立；**实证需 dev 侧上报 nodeId 值对表**（TriMLC 8713 发送端配置，sg 不可读如实转 dev 面） |
| ④10-15 17:27→19:40 窗动作对表 | 17:27 换源裁定（COS sg 箱）→override.conf.bak-pre-rotate-20261015（**token rotate 备份**）→19:40:52 restart=轮换重启+两锚修复部署同窗（agent-core @1713614=Description r15-1-4 吻合） | 窗内动作链=轮换重启+渲染部署，**无迁移半成品动作**；「同日 2h」耦合=旋转重启恰逢，非半迁移证据 |

**第五路判读**：半迁移态（混装新旧面）**排除**——现役实例=09-29 cutover 正形+10-15 轮换重启，非「目录新名/服务旧名」半成品。真观测面分叉候选收敛两支：②健康期日志面恒静默（观测面选型错配）+③nodeId 键错位（需 dev 侧对表）。两支汇同结论=**观测面重建走挂点 A 建设（E1-4 v2 三选项）**，迁移收尾归一（Description/HOME 化妆面）列低优化妆项。

## 六、终版定性（五路合并）

心跳链「200→store 丢」不成立。真缺口分层：**L1 架构层**=挂点 A（心跳读出面）缺位（路 3）+心跳零持久化（路 2，设计如此）；**L2 观测层**=b2 观测面选型错配候选（日志面健康期恒静默，路 5②）+nodeId 键错位候选（路 5③，dev 对表项）；**L3 化妆层**=Description 旧名/HOME=/root（低优）。修复方向=E1-4 v2 挂点建设（三选项）+dev 侧 nodeId 对表（转 dev 面）+化妆面随迁移收尾归一窗。服务零触碰全程 ✓。

## 七、增补二·store 新值时戳配对勘验（12:53:17 recovered 拍恢复源对表）✓

- **配对成立**：watch state 文件（/home/fleet/.trilc/e1-b2-heartbeat-watch-state.json）lastActivityEpoch=**1792212797736=12:53:17 CST**——与 R1 restart 恢复拍（12:52:30 pid 10832 重发→12:53:17 拍，差 47s=观察者拍间距内）**精确配对**。恢复源钉死=**R1 restart 8713**；投递链「时通」实证。
- **观察面真身钉死（源码+脚本头自证双源）**：watch 挂点 A=**/tmp/trimc-run.log 日志流字节面**（offset 增量读；脚本头自证「nodeHeartbeats 无读出端点（mirror/nodes|status|heartbeat/status 全 404 实勘）+18710 隧道不在 sg 侧」——与本卷路 3/路 4 独立勘勘结论互证）。「store 新值」=**日志流新字节含 [trimc:mirror] 行**，非任何持久化 store。
- **画像定性（增补二枝一命中+机理深化）**：「时通时断」画像成立，但机理=**观察面只计状态翻转行**（stale→unknown/recovered/terminal 翻转才有行；健康稳态心跳零行）——翻转行近期全为 **TABLET-0BGCRCP5-30xxx 平板节点 flap 对**（46xxx-487xx 行区），8713 本体健康稳态在该面**不可见**。即：时通时断画像=真事件（8713 醒断/重发）×观察面（翻转行only）交窗输出，健康静默段不可判读（L2 观测面选型错配的机理精化——非纯选型，系「翻转行only」本质）。
- state 文件位置勘正：DATA_DIR(/var/lib/trimc) root 属主不可写→state 迁 fleet 位 ~/.trilc（脚本自注，与本席读数吻合）。
- 本席勘误自领：前置换算误用旧值常量（1792200195857=09:23:15 系 b2 毕报值），重算现值 1792212797736 方得精确配对——读数换算禁沿用旧常量教训随卷。
