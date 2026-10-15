# CTO 评估卷 · LG-082「daemon 为主中枢持久层」架构评估+方案稿 · 2026-10-15

- sourceOfTruth: 本卷（trees/lg082-daemon-hub-persistence/cto-assessment-20261015.md）
- syncMode: static（评估卷·候裁态·D-15 留痕）
- lastSyncedAt: 2026-10-15T22:54:05+08:00（date 现查·写前跑）
- 令源: CEO 22:46 方向指示（BOD 22:46:35 转呈）·COS 派工（CTO 评估域·只读护栏·非施工）
- 本席判定: **方向成立·试点可行（收窄形态）·候裁后可动**——「存/判」两下沉对现役三 daemon 是小改造级缺口，首场景今晚 TriMMC 试点建议收窄为**零 daemon 代码改造**形态

## 〇·总判断（大白话）

CEO 方向技术上成立，而且**一半已经在跑**：sg daemon 现役 10 个 cron job 里，`bod-progress-report`（30min 拍进度快照）和 `sg-watchlist-patrol`（5min 巡 watchlist）就是「daemon 拍+存」的现役先例——今晚断档期真正的缺口只剩两小块：①拍的**读数面**没覆盖「sg 箱分布」②复活后的**补读追平**没有固定形态。补上这两块=首场景试点，**纯注册一个 cron job 即可，daemon 代码零改动**，可秒级回滚。「判」下沉有现役出向链（outbox 三态送达）可依托，护栏按今晚刚生效的 D-55 三层判据钉死：daemon 只做①层程序判，③层语义判断全归席面。

## 一·能力面对表（活体现探 22:50-22:54·非推定）

| daemon | 机位 | cron | 「存」能力 | 「判」能力 | 对两下沉覆盖 |
| --- | --- | --- | --- | --- | --- |
| TriMLC 8713 | 本机 M 面本地域 | ✓ 14 jobs | ✓ store+信箱面（letter-store） | ✓ 出向 NOTIFY 链 | **受宿主电源面约束**（healthz power 面 22:50 实锚：acOnline=false·battery 57%）——断电窗自身难保，只宜做有电期补充留存，**不宜作断档期主存** |
| **TriMMC 8712** | sg M 面服务域 | ✓ 10 jobs（清单已勘） | ✓ notify-mailbox.json+outbox（JSON 原子落盘 tmp+rename）+notify-ledger.jsonl+tasks mirror | ✓ outbox 出向三态（accepted→forwarded→delivered·TTL 24h·pending 上限 200·限速 10/min） | **7×24 首选试点位**——serverless 机不受本机电源面约束；「拍+存+判→报」三链现役全通 |
| TriRMC 8710 | 河源 R 面服务域 | ✓ 3 jobs | ✓ mcLedger 面 | ✓（R 面·非本场景域） | 覆盖但域不对——M 面中枢读数留存落 M 面服务域（sg），河源留作 R 面同型扩展候选 |

现役先例卷（直抄正形）：`/srv/fleet/bin/bod-progress-snapshot.sh` v2.1——30min 快照落 `/srv/fleet/var/bod-progress/`（**非 git 区**·state.json 跨轮指纹）·BOD 复活后读 progress-snapshot.md 即追平。「补读追平」的读出形态现役已验证。

## 二·缺口与加固项（4 项·如实）

1. **补读聚合面缺**：快照文件有，但没有「列出/聚合快照」的现役 API——BOD 补读现阶段走 ssh 读文件（可行，试点够用）；常态化后候一个小只读端点（`/internal/v1/watch/snapshot` 列目录+返回最新 N 份）——**候窗小改造·非试点阻塞项**。
2. **job payload 内嵌 token 形态债（本次实锚·D-46 族）**：`config-sync-apply` job 的 payload command 仍内嵌明文 token——BOD 19:20 换了值没换形态，job 清单/日志打印路径即泄露面（本评估探针已实锚穿越一次）。**加固正形：payload 改走 env 文件读入（sg .env 权威位），payload 面零 token 内嵌**——建议与试点同窗顺手修（一行级）。
3. **判下沉护栏（D-55 对表·钉死）**：①层程序判（阈值比较/超时检查/未读计数/urgent 标志翻转）→可下沉✓；②层窄域快判（jev 类·如催办类消息窄域分类）→预留不急；**③层语义判断（消息定性/裁决取舍/催办意图判读）→禁下沉，全归席面**——daemon 告警文案只陈述机械读数事实，禁定性语。
4. **快照落点治理（现役教训继承）**：append 式快照**禁挂 git 工作树**（bod-progress-snapshot 头注实锚：30min append 弄脏工作树→post-receive 冲突复炸·已改非 git 区）——试点快照落点照抄 `/srv/fleet/var/` 非 git 区形。

## 三·方案稿（试点形态·候裁后动）

**job 名 `hub-watch-snapshot`·TriMMC 8712·纯 job 注册零代码改造**：

- **节律**：every 10min（与 daily-progress-watcher 同族；断档期拍密一点，BOD 追平读数粒度 10min 够用）。
- **拍**（脚本 stdin 读箱·程序域）：notify-mailbox.json 全量解析→投影**元数据面**（各席 unread 计数/urgent 计数/最新一条 message_id+时戳·**零 body 正文**——照 SEC 白名单口径）+watchlist.json 现势+8712 healthz 三字段+本机树 git 顶 hash（ls-remote 形）。
- **存**：追加落 `/srv/fleet/var/hub-watch/hub-snapshot.jsonl`（每拍一行·非 git 区·自建目录）+`latest.json` 覆盖写（BOD 补读单文件即追平）。
- **判**（①层程序域）：urgent unread>0 或某席 unread 增量>阈值（首版=5）→**outbox 出向告警**（走现役 `/internal/v1/notify` 链→TriMLC 拉走·文案纯读数陈述）——armed 门形：首拍基线前不告警（防假告警·Q2 件①同族）。
- **补读**：BOD 复活→读 `latest.json`（一文件追平现势）+需要历史读 jsonl 尾部 N 行——零新端点。
- **门禁**：注册后首拍断言三查（job runCount 递增+latest.json 值面在位+jsonl 行数增）；回滚=job remove+目录删除（秒级·零残留）；冻结带内 sg 机不受本机电源面影响，但**注册动作候裁后才动**（本阶段「禁改现役运行态配置」护栏全程有效——本卷只评估不动手）。
- **候 CEO 意面**（如实呈报）：本试点=中枢例行读存形态的首步变更（读与转自 BOD 会话依赖→daemon 承接「存+①层判」，BOD 保留③层判与转报裁决）——按 COS 分诊属「执行形态变更面候 CEO 意」，**裁前不注册**。

## 四·时点与姿态

- 冻结带预期 ~00:45±30min（重载提前族）：本卷 22:54 毕呈，若 CEO 意在窗前到位→注册+断言 ~5 分钟内毕（不占窗）；候不到→试点顺延窗后，**不硬压**（评估质量已毕，施工随时可动）。
- 后续演进面（非今晚）：②层 jev 窄域快判引擎接入选型、跨 daemon 快照互备（sg 主+河源备）、补读聚合端点小改造——候周报线排程，不入试点范围。

## 使用依据

- 活体：三 daemon healthz（22:50）·sg 8712 cron jobs 全清单+API 端点全景（app.ts 路由面+notify/echo/cron/config 四族）·bod-progress-snapshot.sh v2.1 头注+mailbox store 位（22:52-22:54 ssh 现探）；
- 源码结构：TriMMC src/notify/{outbox,routes,echo-routes,duty-consumer}.ts·server/app.ts（本机仓·与 sg 部署同源线）；
- 纪律：D-55 程序优先母原则（今晚 21:42 生效·三层判据=判下沉护栏正身）·D-46（payload 面加固项正身）·D-24（机位断言活体现探）·D-52（mailbox 程序读写）；
- 在案先例：bod-progress-report/sg-watchlist-patrol 现役 jobs·LG-036 outbox 送达三态·Q2 件① armed 门形。

—— CTO 小狄（落款 date 现查原值 2026-10-15 22:54:05 +0800）
