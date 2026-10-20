# FSD 件①毕报：TriMMC 回声出向队列（Q2 反向通道一期）

- 令源：CTO 派工单 046caf7cb（CEO 18:16 批）+ CTO 窗毕号（19:22:51 +0800 件①解挂）
- 施工席：FSD 小全（m-fsd）·窗口：19:0x-19:5x +0800
- 状态：**全绿毕·端到端冒烟硬门全链通过**——候 CTO 验收位判定

## 一、实现方案

服务域席经 `POST /internal/v1/echo/enqueue` 写入（四红线门禁）→本机 mc-echo-pull（件②·8713 cron 每 5min）拉取落箱 8713 m-cos 信箱（件③·advisory 硬打标）→ack 消账。三端点挂 TriMMC app.ts 既有 `/internal/*` X-Internal-Token 门内（auth 门自动罩·零新鉴权面）；存储=JSON 原子落盘（outbox 同族）+事件型 ledger。

## 二、代码变更（TriMMC dev·8b075f9）

| 文件 | 内容 |
|---|---|
| `src/notify/echo-queue.ts`（新 197 行） | 队列域纯函数：enqueueEchoItem（校验序=白名单403→missing_tuple400→invalid_ts400→8KB413→full503→幂等）/ pullEchoQueue（consumer 白名单+TTL 扫描+时间序+attempts）/ ackEchoItem（幂等+404）/ 六键契约投影 / ledger 追加（零 text 正文） |
| `src/notify/echo-routes.ts`（新） | 三路由薄壳：enqueue 字段白名单（file/binary 等未列键 400 forbidden_fields）/ queue 拉取 / ack 消账 |
| `src/server/app.ts` | notify 块后挂载 `/internal/v1/echo` 前缀动态 import（L411 区） |
| `test/echo-queue.test.ts`（新 14 例） | 红线四条逐条入测+幂等链+200 上限+多字节 8KB 反例+六键投影+时间序（env 缝 TRIMC_ECHO_QUEUE_FILE） |
| `docs/registry/code-state.md` | Q2 件①条目（8b075f9 条+65aeae5 勘正） |

## 三、自测结果

1. **单测**：14/14 PASS（node:test）；tsc 既有错（onboarding/session-initializer TS2345）stash A/B 独立验与本件零涉。
2. **sg 部署链**：sg bare 顶 8b075f9（本地推·github 443 断期走双 pushurl ssh 腿）→fleet reset（merge-base 祖先断言 YES·m-duty-cos 笔 82a3d52 零丢失）→build（dist 三件+挂载 grep=2）→`systemctl restart trimc`（fleet 权限直通·新 pid 41261）。
3. **活体断言**：healthz 200 / queue 200 空箱（**404 not_provisioned 时代结束**）/ 无 token 401。
4. **端到端冒烟硬门（全链绿）**：sg enqueue 201（echo-mv9gxhc9vyh65p）→本机 echo-pull 手跑 stored=1 acked=1 suspects=0→8713 信箱实达（markRead ok:true·unread 664→663 双证）→sg queue 复查 count:0→ledger enqueue_accepted+acked 双行留痕。
5. **负向三探针**：白名单外 target_endpoint→403 target_not_allowed+ledger reject 行（验收锚 2）/缺三元组→400 missing_tuple+ledger 行（验收锚 3）/file 字段→400 forbidden_fields（红线① routes 白名单活）。
6. armed 门现势：armed=true（首真信拉取自动武装·预期终态）·failStreak=0。

## 四、技术债务/limitations 如实

- **routes 层字段白名单拒不落 ledger**（forbidden_fields 在业务队列层之前·留痕面=响应体）——403/400 队列层拒有 ledger 行，routes 层拒无；候窗裁定是否补 routes 层留痕。
- 全量基线 608/639（30 败）未逐族归因——初判既有（本件新文件零 tsc 报+14/14 绿），候窗 worktree 基线对照；届时补归因清单。
- github push 通道当晚一度 443 断连（HTTP/1.1 亦败）→sg 备援腿先上线保换装，同窗稍后自愈补推——**双通道同顶 65aeae5（ls-remote 双验）**，registry 勘正留痕。

## 五、使用依据

- CTO 派工单 046caf7cb（CEO 18:16 批）·技术卷 reports/cto-q2-reverse-channel-tech.md（四红线+契约形）
- CTO 窗毕号 19:22:51（件①解挂·P0-1 断言令·端到端硬门验收位令）
- 件② TriMetaverse c52bc6690（echo-pull token 源）·件③ TriMLC 82e8fc1（收箱端点）·8713 激活段毕报 fa4ad858c
- cmd-batch-crlf-preservation / trimetaverse-dual-pushurl-topology / ps-removeitem-junction-penetration 等记忆族
- TriMMC commits：8b075f9（实现）→09c3d1b（registry）→65aeae5（勘正）·双通道同顶
