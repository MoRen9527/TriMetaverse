# CTO 评估卷 · Q1 TriMC 旧名残留 · 2026-10-15

- sourceOfTruth: 本卷（docs/workflow/operating-records/2026-W42/trees/q1-trimc-legacy-name-assessment-20261015/cto-assessment-20261015.md）
- syncMode: static（评估卷呈候批·系统面改名=不可逆类候 CEO 批后 SDE 施工）
- lastSyncedAt: 2026-10-15T17:16:20+08:00（date 现查·写前跑）
- 令源: CEO 17:02 两评估令 Q1（17:04 BOD 转达）——「TriMC 系历史部署旧名」全残留评估+修正方案分步
- 勘验方式: fleet SSH 只读五发（17:05-17:14）+本机两发·全程零写 sg 面（唯一次 P0 快报触发 BOD 侧施工·见 §二 P0-1 处置记录）

## 〇·结论先行

1. **旧名残留不止「名字问题」——双目录分裂已造成两次实际现役缺陷**（P0-1 白名单分裂已修复+P0-2 提示链断链待修）——归一紧迫性实证成立。
2. 修正方案=**三步分阶**：步1 换装（BOD 已毕）→步2 poller 路径一行修（急·候授权）→步3 目录归一+顺手轮换（候批窗）。service 正名**建议不更名**（两案呈裁）。
3. 代码标识符面（TRIMC_* env/源码内 trimc 字串）**建议不动**——正名范围=部署面，代码命名空间改名=全仓 refactor，成本≫收益且零现役缺陷收益。

## 一·现状全景（勘验实锚·17:05-17:14 读数）

### sg 面（M-SG-47.245.122.61·/srv/fleet/）

| 对象 | 现状 | 读数锚 |
|---|---|---|
| TriMC/ | git 工作目录（顶 60496df=今晨补录笔）·**今晨施工位** | .git 在·mtime 10-14 21:22 |
| TriMC/dist | 今晨 09:54 七席新 emit（**运行时不消费**·P0-1 修复后已换装入役） | outbox.js grep trirlc-conn=1 |
| TriMC/notify-outbox.json | **死文件**（mtime 2026-09-29 04:15·366KB） | stat 17:14:22 时点 |
| TriMMC/ | git 工作目录（顶 82a3d52 正名大线）·**现役运行位** | 进程 cwd=readlink 实锚 |
| TriMMC/dist | P0-1 修复前=9-29 旧物五席；**17:13-17:14 BOD 换装后=七席现役** | BOD 毕报·候 18:0x 回零拍 |
| TriMMC/notify-outbox.json | **活信箱**（17:14:04 活写·2.98MB·每分钟重写） | 同上·daemon 运行时写 |
| trimc.service | unit 名=trimc（旧）·描述「TriMC Main Controller」·running | systemctl cat 全文勘验 |
| trimc-start.sh | 首行 `cd /srv/fleet/TriMMC`（**现役指向正确**） | ExecStart 链实锚 |
| start 备份×2 | bak-20260928T201527Z + tsx-bak——**均含旧 TriMC 路径**（历史备份） | grep -rl 实锚 |
| notify-poller.sh | `BOX=/srv/fleet/TriMC/notify-outbox.json`——**指旧目录死文件** | fleet crontab `* * * * *` 现役（【17:26 勘误】原记 root crontab 系误·BOD 步2 毕报 9e6ab7b6e 实锚 root crontab 零 poller 行） |
| unit env | TRIMC_CONFIG_DIR=/var/lib/trimc·TRIMC_PORT=8712·TRIMC_NOTIFY_DUTY_SEATS=m-duty-cos 等 | **TRIMC_* 前缀+token 行见 §四注** |
| fleet crontab | 10 条——唯 notify-poller.sh 引旧路径·其余（disk-hygiene/bare-perm-heal/duty-night-patrol/seat-watchdog/bare-fetch/worktree 系/duty-urge 系）零 TriMC 引用 | crontab -l 全量过（【17:26 勘误】poller 调度源=fleet crontab 非 root·root crontab 零 poller 行·BOD 毕报实锚） |
| 隧道面 | sg 侧零 autossh/ssh 隧道进程——keeper=TriRLC 内嵌段（非独立进程）·本机 URL 结构面无目录依赖 | ps+配置结构面 |

### 本机面

- D:/Code/ai/TriMC **不存在**·TriMMC 在——本机目录正名毕·零残留。
- 本机侧引用链零 sg 路径依赖（TriRLC NOTIFY 出向=127.0.0.1 端口转发形）。

### 文档面

- 存量文档旧名=**不溯改**（BOD 标准称谓令 2026-10-15「存量不溯改」已裁）——本卷沿用：新写换用（M面TriMMC/M-SG·8712 等）·存量带历史限定语引用。

## 二·双 P0 实证与处置现势

### P0-1：部署目录与施工目录分裂（**已修复·BOD 17:13-17:14**）

- **机理**：正名大线（82a3d52）把 start 指向切 TriMMC 后，dist 换装缺位——今晨补录施工在 TriMC（git 正确位）emit 七席·09:54:32 重启载 TriMMC/dist=9-29 旧物五席。
- **影响窗**：09:54:32-17:14（约 7.3h）——trirlc-conn 白名单补录未生效+m-duty-coo（10-13 已验收项）回退被拒态。
- **处置毕**：BOD 照我快报建议案 root 施工——备份 mv dist-bak-pre-swap-20261015T1715→cp -a 七席换装→restart→断言链全绿（pid 3973025·cwd=TriMMC·运行路径 trirlc-conn=1/m-duty-coo=2）→属主归还 fleet。勘误卷 13f227846。候 18:0x 回零拍终验。
- **定性**：双目录并存+「改的目录≠跑的目录」无断言门=结构性事故源——归一前任何 sg 施工须先断言现役目录（教训已并 P0 快报）。

### P0-2：notify-poller 读死信箱（**已修复·BOD 步2 施工毕 17:2x**）

- **机理**：fleet crontab 每分钟 `notify-poller.sh`→`BOX=/srv/fleet/TriMC/notify-outbox.json`=9-29 04:15 停更死文件；daemon 活信箱在 TriMMC（17:14:04 活写实锚·时戳字段=enqueued_at）。
- **修复实录（BOD 毕报 9e6ab7b6e·照本卷步2 护栏执行）**：换源前重放断言发现直接换源将重放 274 封（KNOWN 死文件遗产仅 7 行）→正形=预填 KNOWN 272 封历史 id+留今日 2 封不预填→备份两文件→预填→sed 改 BOX→无重启（fleet crontab 每分钟自然拉起）→活体 17:23/17:24 两拍恰好只 NEW 今日 2 封 liveness 信·零风暴·KNOWN 279→281 poller 自写=写回链活——**16 天来 sg 值席 tmux 新信提示链首次恢复**。回滚=两 .bak-20261015 还原即净。毕报卷=trees/sg-8712-allowlist-conn-20261015/bod-poller-fix-closeout-20261015.md。
- **影响窗**：**自 2026-09-29 起 16 天**——sg 值席（m-duty-cos）tmux 新信提示链读死文件。实际受损程度候值席自查：duty-urge-patrol 系冗余通道（crontab 三条现役）可能掩盖了提示缺失（值席是否一直有收到 urge 系通知·poller 通道静默无人察觉）。
- **修正**：一行 sed——`BOX=/srv/fleet/TriMC/...`→`/srv/fleet/TriMMC/...`（文件属主 fleet·crontab 以 root 跑但不影响改 fleet 属主文件）+下分钟自证（观察下次真信 tmux 提示·或 fleet 身份手动跑一轮对照）。
- **回滚**：sed 反向一行·零风险。
- **附带核查项**（修正时一并）：poller 新信判定逻辑若按全量 diff 需确认换源后**零积压重放**（2.98MB 活信箱 vs 死文件 366KB 差量=16 天信件——若 poller「筛新信」按文件轮转游标则安全；若按内容 diff 则首跑可能重放误提示——**修正前先读 poller 判定段 10 行**）。

## 三·修正方案分步（呈候批）

**步1（已毕）**：P0-1 换装——BOD 17:13-17:14 施工毕（见 §二）。

**步2（急·候授权即做）**：notify-poller BOX 路径修——先读判定段断言零重放→sed 一行→下分钟自证。归 BOD/值席 fleet 面·预计 5 分钟。**建议与 m-duty-coo 自查（已转 COO）同窗并行**。

**步3（归一窗·候批）**：sg daemon 勘修窗一次清三件（与候考池项 4 token 顺手轮换同窗摊入）：
- a. **TriMC 工作目录归一**：TriMC 未推笔对表（60496df 已 push 对 bare 顶核）→归一方案二选一：(i) TriMC 改作 TriMMC 的 link/worktree（保 git 双检出工作流）(ii) rm TriMC+后续施工统一 TriMMC 单目录（推荐·简·split 根因即双检出无断言门）。删除前置断言：TriMC 顶==bare 顶+`git status` 干净。
- b. start 备份×2 归档或清理（历史备份含旧路径·留则改名注记防误用）。
- c. token 顺手轮换（候考池项 4·本席已裁摊入窗）。
- d. 回零拍+poller 通道活体终验。

**步4（两案呈裁·CEO 定）——service 正名**：
- **案 A（建议）**：unit 名保留 `trimc`——服务名=稳定接口（watchdog/运维脚本/值班习惯引用链长）·「TriMC 系历史部署旧名」限定语由文档承载（称谓令口径：M面TriMMC(M-SG·8712)）·unit Description 字段可改 TriMMC（一行·随步3 窗）。成本≈0·零风险。
- **案 B**：unit 正名 trimmc.service——涉 unit 文件+start 脚本名+`systemctl` 运维面全链切换+crontab 无引用（已核）——成本中·收益=字面归一。若裁 B 须与步3 同窗一次做+断言链（旧名 disable→新名 enable→healthz）。
- 代码标识符（TRIMC_* env/源码 trimc 字串/`/var/lib/trimc`）**两案均不动**——应用命名空间与部署目录名两回事·refactor 无现役缺陷收益。

## 四·风险与残留注记

1. **归一前高危窗**：双目录并存+无「现役目录断言门」=P0-1 型事故可复发——步2/步3 之间任何 sg 施工先断言 `readlink /proc/$(pgrep -f 'node dist/src/index.js')/cwd`。
2. **D-46 新泄露通道一例（自捕）**：本卷勘验中 `systemctl cat trimc` 输出含 `Environment=TRIMC_INTERNAL_TOKEN=<明文>` 进 transcript（暴露面=会话终端+transcript 副本·未进外部可达面·不升级轮换裁·按触发器护栏照旧）——**unit 文件面=token 泄露第 7 例通道**：后续 unit cat 前须 `grep -vE 'TOKEN|SECRET'` 滤行·记忆条已补。
3. tricode 链接建立时点不明（BOD 疑点留观察注）——步3 窗一并核 TriMMC/node_modules 三链接健康。
4. poller 断链 16 天为何未暴露=观察项并入灰度/巡检面评估（duty-urge 冗余通道掩盖效应）——非本卷展开面。

## 五·候批清单（呈 CEO 经 BOD）

1. ~~步2 notify-poller 修正授权~~——**已毕**（BOD 17:2x 施工毕·见 §二 P0-2 修复实录·候批①销）。
2. 步3 归一窗批（合并 token 轮换·候 sg 勘修窗排程·D-23 对轨）——**已并呈 CEO 候批**（BOD 17:27）。
3. service 正名两案裁定（建议案 A=保留 trimc 名+Description 随窗改）——**已并呈 CEO 候批**（BOD 17:27）。
4. P0-2 影响面值席自查令（16 天提示缺失实际受损程度·归 COO/值席面）——提示链已恢复·受损回溯面自查仍候 COO 面。

## 使用依据

- CEO 17:02 两评估令（Q1 面）·BOD 17:04 转达；
- 勘验读数：fleet SSH 五发+本机两发（17:05-17:14·读数时点内嵌各节）；
- BOD 毕报：P0 三事答毕（17:16·换装毕 13f227846）；
- 在案纪律：D-46 值面（unit cat 泄露通道第 7 例自捕）·D-47 落款双保险·D-24 机位断言·标准称谓令（存量不溯改）；
- 历史卷：cto-trimc-whitelist-change-plan-20261013.md（10-13 六席验收链·本卷 P0-1 回退机理对表）。

—— CTO 小狄（落款 date 现查原值 2026-10-15 17:16:20 +0800）
