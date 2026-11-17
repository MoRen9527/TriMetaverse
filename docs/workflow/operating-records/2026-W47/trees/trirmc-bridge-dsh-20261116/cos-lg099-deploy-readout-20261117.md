# COS LG-099 子项A 部署段毕报（BOD 托转五项请领工·全办毕·job 在役 30min 节拍）

- sourceOfTruth: 本卷（LG-099 子项A 部署段毕报正身·承 deploy/ 三件族）
- syncMode: write-time
- 施工席: COS 小贾（m-cos·承接面）；令源=BOD 托转令五项请领工（21:50+08）+BOD 补充定稿四查（14:02Z）
- 执行窗: 2026-11-17T21:50:36+08（BOD 托转令到达）-2026-11-17T22:18:02+08（首跑毕 date 现查）段
- 判定: **五项请领工全办毕——①deploy 件拉取 ✓②ALLOWLIST 精确等值追加 ✓③重启正形链 ✓④job 铸 201 ✓⑤毕报锚（脚本+注册读数卷+首跑读数）✓——lg099-tri-check=cron_mwks0klq_t9ow·enabled·nextRun=14:30Z（22:30+08）·lastRunStatus=ok**

## §一 · 五项请领工逐项闭环

| # | 项 | 读数 | 判 |
|---|---|---|---|
| ④ | deploy 件拉取 | sg 72a0f3c26（21:52:45+08 毕铸挂树）fetch+merge 本仓——三件族落 `trees/trirmc-bridge-dsh-20261116/deploy/`（tri-check.py 113 行+8713-job-define.json+8713-allowlist-append.md） | ✓ |
| ② | ALLOWLIST 精确等值追加 | channel.cmd **L32 主行+L50 orphan pad 双位同文追加**（replace_all 一次同步·写后断言：双位计数=2·CR=50=行数 CRLF 面完好·ALLOWLIST 行含 tri-check=2）——备份回滚锚=`trimlc-daemon-channel.cmd.bak-20261117` | ✓ |
| ③ | 重启照勘修窗正形链 | watchdog Disable（schtasks RC=0）+stop-flag 双保险→POST /shutdown token 门 ok→port FREE=0→schtasks /run 冷启 RC=0→healthz 200 @5s→pid/CIM 对表→值面探针→watchdog Enable RC=0+flag 撤净·**禁裸杀遵行（daemon 走 /shutdown 门）** | ✓ |
| ① | job 铸 | POST /internal/v1/cron/jobs=**HTTP 201**·F-3 家族性三查：201 ✓+nextRunAt=2026-11-17T14:30:00Z 值面 ✓+enabled=true ✓ | ✓ |
| ⑤ | 毕报锚 | 三件：tri-check.py 落 dev 实位（deploy/ 树内正位非仓库根）+job 注册读数卷（本卷 §三）+首跑读数（本卷 §四·force run status=ok+卷 tri-check-20261117T141727Z.json 落 convene/tri-check/） | ✓ |

## §二 · 定稿四查结论（BOD 补充信五点逐答·源码实锚）

1. **脚本落位**：deploy/ 树内正位（git merge 直落·零散放）✓
2. **四路径 dev 定稿**（SDE _deploy_note 明示工序·试跑验证毕）：`--ledger`/`--inventory`=W47 周平面 `task-inventory-20261130.md`（**照 SDE 铸件字面 dev 化**）·`--trees-root`=W47/trees·`--out-dir`=W47/convene/tri-check——python=`C:/Python312/python.exe` 绝对路径（**channel.cmd PATH guard 无 python 目录实锚——裸名必 ENOENT·绝对路径形绕开不动 PATH guard**）——串零逗号（等值门 split 安全）·定稿串长 523 字符
3. **ALLOWLIST 面形勘定（源码实锚）**：TriMLC 8713 门=`cronCommandHttpAllowed(body.command)`（app.ts:265-272·dist 11-12 构建同版实文）——**command 全串 trim 后精确等值**（与 TriRLC 8711 同族形·**非 job-name 行形**）——SDE 铸的「追加行=lg099-tri-check 单行」系 sg 面铸形与 8713 门语义偏差·**dev 侧定稿照 8713 现役门语义：追加条目=定稿 command 全串逐字**（job 名行加了也白加·POST 必 403）——「四 daemon cron 行为分野勿互套」正中
4. **账本面归属**：对表对象锁定 dev 本仓周平面绝对路径（不读 sg 活体）——sg/dev git 同步滞后产生的差口=真差口如实报形
5. **序勘注记（照源码语义调形·如实呈报）**：BOD 序④字面「ALLOWLIST 追加→addJob→重启」——ALLOWLIST 系 daemon 进程内 env·追加后须重启才生效（进程内 env 启动时定型）——**实际执行序=追加→重启→铸**（铸在重启后·env 新值门面放行实证=201）·本质同序（追加先于铸）+重启位置按 env 语义调

## §三 · job 注册读数卷（三查值面）

- jobCount=**18**（17+1）·degraded=false·engine running
- lg099-tri-check=`cron_mwks0klq_t9ow`：schedule={kind:cron·expr:`*/30 * * * *`}（**tz 字段未传=daemon store 层缺省**·本机=+08 时区语义等价）·command=定稿串 523 字符·enabled=true
- lastRunAt=2026-11-17T14:17:26.178Z·**lastRunStatus=ok**·runCount=1·errorCount=0·nextRunAt=14:30:00Z（=22:30+08）

## §四 · 首跑读数（force run·22:17:26+08）

- force run 响应：`{"ok":true,"ran":true,"reason":"status=ok"}` ✓
- 首跑卷=`convene/tri-check/tri-check-20261117T141727Z.json`（utf-8 正常）
- **gate=DIFF diffs_n=1**——差口=`ledger-present`：`台账面缺: ...W47/task-inventory-20261130.md`
- **「三查零差首跑读数」判据勘正如实呈报**：首跑=DIFF 形非零差——W47 大表族断档第 2 日实锚（task-inventory 三周连缺族·fade001 联审线 CFO loop11 卷已挂）——**大表缺位被 30min 机械即报显形=LG-099 三账对表督办本职正着火**·非链断非 job 缺陷·大表件补铸归值席/迁移器 owner 线（本席不越域代决）·补铸落位后差口自转零差心跳
- stdout 中文 GBK 乱码注：卷面 utf-8 无恙·观测消费面以 convene 卷为主（PYTHONIOENCODING 提议题候维护窗）

## §五 · 403 勘因录（重大运维发现·batch 偏移错位家族）

首次铸 job 403（command_not_allowed）——勘因闭环定位**根因=修改运行中 batch 启动器触发 cmd 偏移错位**：

1. 老 wrapper cmd（pid 28588·**CREATED=11-12 11:45:40**·上次重启遗留）自 11-12 起挂 L46 node 行（batch 文件偏移停在 L46）
2. 22:04:26 本席 Edit channel.cmd（+~1048 字节）→**文件变长而老 cmd 偏移不动**
3. 22:04:5x shutdown 旧 daemon（29540）→老 cmd 从 L46 旧偏移续读=读到**新文件错位字节**（跳过 L32 set·直接撞 node 行）→22:05:07 起 node 24516——**env=11-12 版旧 ALLOWLIST**（L32 set 未执行）
4. 本席 22:05:0x schtasks /run 起的新 cmd→新 node→**8713 被 24516 先占→EADDRINUSE 崩退**（channel.log L56636/56646 三行崩溃痕实锚）——**赢下 8713 的=错位体 24516（旧 env）→403**
5. 对照实验三重锚：cmd 实解析 set→env=1940 完整含新条目 ✓·node 同链读 env=1940+has_tri=true ✓·daemon 24516 实际 403——三读数矛盾唯「偏移错位体」解释全通
6. **清场重建**：/shutdown 24516 优雅停→杀错位 wrapper 28588（batch 偏移已坏必再错位·wrapper 纯宿主非 daemon 本体不违禁裸杀）→8713=0 清场验→再 schtasks /run 冷启（pid 21880·CREATED=22:16:33·全文件逐行执行 env=新值）→**POST 即 201** ✓

- **家族教训（候 D 系窗正形化候选）**：channel.cmd 类启动器修改必须在「daemon 全停+wrapper cmd 全清」后进行——修改运行中 batch=偏移错位 undefined behavior（node 被 skip-set 错位拉起·env 旧值·且与新冷启体抢 port）——本次 watchdog disable+stop-flag 双保险形照勘修窗先例已遵行·错位风险在 wrapper cmd 层（先例未覆盖）

## §六 · 护栏遵行

只读观测+告警面（tri-check.py 三账零写入·闸面=清单/验证卷落+警面零改迁移本体照任务书）✓｜ALLOWLIST 等值追加制（无模糊扩形·条目=定稿串逐字）✓｜重启正形链全程（watchdog 双保险→shutdown 门→port FREE→schtasks 冷启→pid/CIM 对表→复位·禁裸杀·daemon 面）✓｜零触施工资产/零改任务生命周期语义 ✓｜值面零出机（token 变量读入形全程·channel.cmd token 未落卷未回显）✓

## 使用依据

BOD 托转令五项请领工+补充定稿四查（14:02Z）；deploy/ 三件族（sg 72a0f3c26）；TriMLC src/server/app.ts 门函数+src/cron/types.ts schema+cli.ts addJob 形（源码实锚）；channel.cmd 写后断言+对照实验三重读数；重启链全程读数=2026-11-17 22:04-22:18+08 段现采实锚（关键锚：channel.cmd Edit 落盘 mtime 22:04:26.133+08·错位体 24516 CIM CREATED 22:05:07·清场后冷启 21880 CIM CREATED 22:16:33·首跑 lastRunAt 2026-11-17T14:17:26.178Z——均 CIM/系统原值非推算）。

—— COS 小贾（毕报=落卷树+SendMessage 直达 BOD·落款时戳=date 现查原值粘贴：2026-11-17T22:18:02+0800 拍前现查）
