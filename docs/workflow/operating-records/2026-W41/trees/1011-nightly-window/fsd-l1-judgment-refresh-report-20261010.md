# FSD 任务②毕报 · R-HY l1 判定面刷新（LG-066 seg2 后旧拓扑 latch 根治）

- sourceOfTruth: 本件（trees/1011-nightly-window/fsd-l1-judgment-refresh-report-20261010.md）
- syncMode: static（毕报卷·落盘即锚）
- lastSyncedAt: 2026-10-10T11:40:59+08（date 现查原值）
- 执行位: FSD 小全（m-fsd）
- 令源链: BOD 01:28 复职令任务②（定位→备份先行+回滚锚→新拓扑判据→两路不同步矛盾一并勘→测试轮≥2 轮验证→毕报落卷·token 值面禁回显·date 现查）+ BOD 08:05 认收令（准任务②继续·毕报两刻照常）

## 一、结论

**R-HY l1 判定面刷新毕：旧拓扑 latch 根治（statefile 误报源清除）·新拓扑判据部署·验证轮 4 连绿（00:09:42Z 手动+00:10/00:15/00:20Z cron 生产轮）·绿态持续至 03:40Z（近 3.5h 全 ok）·端到端闭环（l2 08:20「recovered; fail counter reset」+「OK all-hosts」relay dim 全清）·两路不同步矛盾勘明三线一致（§四）。零本地脚本变更；随程勘出 pending 重发 400 缺陷根因全链，属任务②域外零动刀候裁（§五）。**

## 二、变更实锚

| 项 | 读数 |
|---|---|
| 对象 | `/usr/local/sbin/tri-liveness-l1-rhy.sh`（R-HY root；调度源=`/etc/cron.d/tri-liveness` root 每 5min·systemd 零 timer·crontab 全空实勘） |
| 旧版判定（误报源） | dual-unit `trirmc+trirmc-mc` active+enabled 双查+8712 cron master face+8710 ok-only（label 陈旧 trirmc-mc-8710）+extra-units.list——LG-066 seg2 后 trirmc-mc inactive/not-found+8712 空置=**预期态**，旧脚本全数当缺陷报=ALERT-NEEDED latch 源 |
| 新版判定 | 单 unit trirmc；8710 升全身体断言（`"ok":true` 必在+`"cron":{"enabled":false` 拒+`"degraded":true` 拒 case 匹配）；头注记 post-LG066-seg2 变体+旧 8710 规则 retired 注记 |
| 部署 | ssh -T+heredoc 传送·bash -n 语法门过·**md5 ff801684··2782B**（ls+md5 双断言） |
| 备份/回滚锚 | `/usr/local/sbin/tri-liveness-l1-rhy.sh.bak-pre-lg066l1fix-20261010`·md5 787437fe827c490573d7ad79df9d90ab（与旧版逐字节同）·恢复=`cp -p` 回·零参数歧义 |
| 本地面 | l1/l2 脚本+任务定义**零变更** |

## 三、验证轮读数（≥2 轮门满足·实为 4 连绿+持续绿）

1. **00:09:42Z 手动轮** `verdict=ok`（部署后即时）
2. **00:10:01Z / 00:15:02Z / 00:20:01Z cron 生产轮** `verdict=ok` ×3（调度链真跑非手工注入）
3. **持续绿**：statefile 03:30/03:35/03:40Z verdict=ok（部署后近 3.5h 无一回 ALERT-NEEDED）
4. **l2 端到端闭**：08:10 轮 ISSUES x1 debounce 1/2（tail-3 残留 00:05 旧行·读时序差·预期瞬态）→ 08:20 轮 **recovered; fail counter reset + OK all-hosts**；03:30/03:40Z 双 OK all-hosts 维持——relay dim 全清·L2 链恢复正常态

## 四、两路不同步矛盾勘定（令一并勘项·三线一致闭）

1. **R-HY statefile ALERT-NEEDED（00:05:01Z 尾行）= 旧拓扑误报**：trirmc-mc inactive/not-found 在 seg2 新拓扑是预期态，旧脚本判缺陷——本刷根治后 statefile 翻 ok，矛盾源消除。
2. **本机 l1「OK all-dims」一直正确**：判本地 trimlc 8713 的本地判定与非本地 statefile 判的是两个对象，「OK」非掩盖。
3. **L2 中继=忠实转发非误报源**：ALERT-NEEDED 行进 relay dim 转发无误；上游根治后 relay 自清（08:20 实证）——勘定结论：**无第二缺陷，单点根治即全链恢复**。

## 五、随程发现与候裁项（零动刀·如实呈）

1. **l1/l2 pending 重发 400 缺陷根因全链（本窗新勘·任务②域外）**：
   - 现象：l1-pending.txt（mtime 10-07 11:25 陈旧件）每轮 `PENDING-RESEND fail (kept)` 已三天；l2-pending（01:40 醒后落）同 fail；同内容手动重放 **200**。脚本 catch 只落静态文本不落异常（可观测性缺陷在案）。
   - 诊断链：复刻重发块→**PS 5.1=400 BadRequest / pwsh 7=200**（同 token 同 payload）→死端 TcpListener 抓包对表：**5.1 payload 1044B vs 7 288B**——根因=**PS 5.1 `ConvertTo-Json` 把 `Get-Content` 字符串上的 ETS 注记属性（PSPath/PSDrive/ReadCount 系）一并序列化**，title 变嵌套对象→sg 8712 notify 对 title 严格校验（string 期望收 object）拒 400（**服务端行为正确**）。文件字节全 ASCII，编码族证伪。
   - 时序 reconcile：新鲜告警 title=脚本内拼串（无注记）→ 10-09 23:30 在 5.1 下 200✓；重发路径 title 读自文件→恒撞 bug✓；l2-pending 落盘 01:40 系醒后隧道未愈连接失败（01:40:54 healthz trimc=degraded/18710=False 实锚）非 400✓——三段全洽。
   - 影响面：**pending 重发通道自 10-07 起静默失效**（l1 三天/l2 半日）；新鲜告警通道不受影响（23:30+各轮 200 已证）。
   - 候裁修复：两脚本重发块各一行 `$pt = [string]$pl[0]`（tri-liveness-l1.ps1/l2.ps1·备份先行照例）+**耦合必做：修后首轮会把两条已恢复的陈旧告警（10-07 heartbeat stale / 01:40 旧拓扑 relay）真发出去——修复批须同步清双陈旧 pending（条件均已恢复且已留卷）**；可观测性小改候：catch 行附 HTTP status。
   - 域外注记：本地脚本面=任务②域外，按窗令「不滑步」纪律零动刀候裁。
2. l1 08:05 轮 3 条 heartbeat stale（ageMin 358-385）=6h 睡眠伪影→08:10 recovered+OK all-dims 自清（零代码变更·H2 报告 §四.1 同族注记）。
3. keep-awake keeper 60min 版 ~09:02 自熄（零残留·零动作）。

## 六、代码变更

- R-HY 侧 `tri-liveness-l1-rhy.sh` 单文件重写（§二·唯一变更面）。
- 仓内零代码变更（本卷为本 commit 唯一内容）；本地 l1/l2 脚本零变更（§五.1 候裁件待批后另批）。

## 七、回滚锚

- R-HY：`cp -p /usr/local/sbin/tri-liveness-l1-rhy.sh.bak-pre-lg066l1fix-20261010 /usr/local/sbin/tri-liveness-l1-rhy.sh`（md5 双同已验）。
- 本地：零变更零回滚。

## 八、随收知情项登记（BOD 11:40 信）

- CAO `d634fe4`（LG-071 铸条初笔）误落本席 `fsd-sgb-fix-20261009` 分支顶（共享工作区 HEAD 漂移所致）·dev 净线 `b1fcc7a` 已由 CAO worktree cherry-pick 重落·drop 动作归本席该分支收口 rebase 时顺带（patch-id 同则 cherry-pick 自动跳过·零实害）。
- 本席只验读未动（遵令「不急办·随收口批顺带」）；验读补充：该分支现顶两笔 CAO 笔=`33152bd`（勘正记实）→`d634fe4`，rebase 对表时两笔并核（33152bd 若 dev 缺席则 surface CAO 不擅 drop）。候办在案。

## 使用依据

- BOD 01:28 复职令（任务②条款）+ BOD 08:05 认收令 + BOD 11:40 知情信
- LG-066 seg2 后新拓扑正身（单 unit trirmc·8710 全身体·trirmc-mc inactive/8712 空置=预期态）
- 活体读数（本卷时点）：R-HY statefile/`cron.d`/`systemctl`/`crontab` 实勘·md5 双断言·l1.log/l2.log 尾读·抓包 capture（payload 1044B/288B 对表）·`git log` 验读（TriCompany 仓 read-only）
