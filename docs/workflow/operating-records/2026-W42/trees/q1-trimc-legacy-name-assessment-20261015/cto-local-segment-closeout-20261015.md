# 本机段毕报卷 · 归一窗+8712 token 轮换（8711/8713 段）· 2026-10-15

- sourceOfTruth: 本卷（trees/q1-trimc-legacy-name-assessment-20261015/cto-local-segment-closeout-20261015.md）
- syncMode: static（毕报卷·D-15 留痕·CAO 铸条素材）
- lastSyncedAt: 2026-10-15T19:24:00+08:00（date 现查·写前跑）
- 令源: CEO 18:16 批令②（token 轮换同窗）+派工单 dispatch-sg-consolidation-window-20261015.md §二（本机段施工序）
- 上游交棒: BOD sg 段毕号 19:04:33（毕报卷 2c51714da）——新 token 值面读入+TriMLC 8713 env 同写增补

## 〇·终态先行

**双 daemon token 轮换毕·窗毕（19:22）**：8711 TriRLC healthz mc_link=**connected**·totalFailures=0·notifyFailures=0（pid 40364）·8713 TriMLC trimc=connected（uptime 89s·FSD 已冷启拾取）。cron payload 面清点毕（BOD 同族漏点提醒）：8711=0 jobs·8713=13 jobs 全清单零 token 内嵌。窗毕号已发 FSD（件① TriMMC 仓解挂）。

## 一·施工实录（时序）

1. **值面读入**（19:0x）：`ssh M-SG "grep -oP …" > 临时文件`——新 token 65B 落文件零回显→bash 变量（`tr -d '\r\n'`）→临时文件 rm。完整值全程零过 transcript。
2. **8711 键位实锚**：trirlc-daemon.env（TRILC_ENV_FILE 载入·启动链=schtasks "TriRLC Daemon"→trirlc-daemon.cmd 薄壳→ps1 L12 注入）——双键 TRIMC_INTERNAL_TOKEN+TRIMC_NOTIFY_SG_TOKEN。
3. **8713 键位实锚**：trimlc-daemon-channel.cmd L11 `set TRIMC_INTERNAL_TOKEN=`（cmd 内嵌 set 行）——sed 值段替换（`[0-9a-f]*` 只吃 hex 段保行尾 CR）·od -c 断言 134 处 \r 保持·备份 .bak-pre-tokrot-20261015 先行。
4. **8711 双键换新+两折修复**（详 §二）·值一致化终形：INTERNAL=08e07c8b（河源值·回滚）+NOTIFY_SG=6ed04b06（sg 新值）。
5. **8711 重启链**：watchdog Disable→POST /shutdown 200（X-Internal-Token 自身门键）→port FREE=0→冷启→pid 对表→watchdog Enable。
6. **终态断言**：healthz mc_link=connected·totalFailures=0·notifyFailures=0·log「recovered → connected」·daemon.log 双链（heartbeat=河源 8710/notify=sg 8712 经 18710 隧道）全绿。

## 二·过程中三折（如实报·教训全录）

### 折1：Git Bash schtasks /run 路径转换坑

`schtasks /run /tn "TriRLC Daemon"` 被 MSYS 路径转换（/run→C:/Program Files/Git/run）报无效参数——冷启未执行 8711 短时无监听。**修**：PowerShell `Start-ScheduledTask -TaskName 'TriRLC Daemon'`。与记忆条「TriMLC 勘修窗 2026-10-11」同坑族——**跨 daemon 通用修法自此定形：Git Bash 面禁 schtasks /run，一律 Start-ScheduledTask**。

### 折2：INTERNAL 键消费对象误伤（本段最大教训）

- **现象**：冷启后 healthz totalFailures 1→18 持续涨·mc_link=degraded·全 401。
- **勘验链**：手动探针定谳——新值打 18710（sg 8712）=400 放行（sg 侧✓隧道✓）；**旧值 08e07c8b 打河源 8710=404（auth 放行·路由不存在形）·新值=401（拒）**——`TRIMC_INTERNAL_TOKEN` 在 8711 的消费对象=`TRIMC_BASE_URL=http://8.155.54.79:8710`=**河源 TriRMC**（heartbeat 链），**非 sg**。
- **根因**：我施工时按「同 token 同轮换」顺手把 INTERNAL 键也换 sg 新值——**未先勘清键的消费对象**。河源 TriRMC 今晚不在窗内未轮换→我亲手把 heartbeat 链打断。
- **修**：INTERNAL 回滚 08e07c8b（河源现役值·从备份读入）——修后 connected 全绿。
- **教训铸条候选（D-46 族外新条）**：**token 轮换施工前必勘每个键的消费对象（键→URL→对端 daemon 三段链），禁「同名键顺手同换」**——同名键不同对端=窗内只换单向时必翻车。今日实锚：TRIMC_INTERNAL_TOKEN 在 8711=河源对端·在 8713=sg 对端——同名键两 daemon 消费对象不同。

### 折3：token 多候选位清点缺口（D:/Code/ai/.env）

TriRLC env.ts（src+dist 已验同形）候选链=TRILC_ENV_FILE 显式→`D:/Code/ai/.env`（工作区根）→TriRLC 根 .env→dataDir 相邻 .env→cwd/.env；L93 守卫「不覆盖已有」先载入者赢。`D:/Code/ai/.env`（r19 时代残留候选）**也有一份 TRIMC_NOTIFY_SG_TOKEN 旧值**——今晨双文件同值故绿，今晚只改一处即分裂（daemon 进程内 NOTIFY 取旧值的候选位来源）。**修**：D:/Code/ai/.env 的 NOTIFY 行同步换新值（备份 .env.bak-pre-tokrot-20261015 先行）——值一致化后任何载入路径均正确。**教训铸条候选**：**token 轮换清点必含「全部候选载入位」grep 全候选链文件**，单点真源原则下旧候选副本应收敛删除（候清理窗）。

## 三·D-46 四正形实录（CAO 铸条素材·照派工单 §二①承诺）

1. **值面零回显通道**：ssh 重定向文件读入→变量→sed 值段替换→双指纹对表（前 8 位）——完整值零过屏·两文件施工全程验证。
2. **CR 保留断言**：cmd 批文件 set 行 sed 后 od -c 数 \r（134 处保持）——LF-only 静默失效坑前置防御。
3. **备份先行**：两文件+工作区根 .env 三处 .bak-pre-tokrot-20261015——回滚姿态=cp 还原+重启。
4. **消费面终态探针**：healthz 值面读数（connected/0 失败）为放行锚·非「文件改完即毕」。

**D-46 新泄露通道自捕两例（不升级·暴露面均会话终端+transcript 副本）**：
- **第 7 例（unit cat）**：`systemctl cat trimc` 输出含 `Environment=TRIMC_INTERNAL_TOKEN=<明文>`——正形=unit cat 类命令前置 `grep -vE 'TOKEN|SECRET'` 滤行或 `systemctl show -p` 白名单属性投影。（记忆条 d46-nested-payload-recursive-mask.md 已补）
- **第 8 例（注释行裸 key·新形态）**：`D:/Code/ai/.env` 头部**注释行**内嵌明文 API key（#sk-proj-… 形态）——我的掩码管道只盖 `KEY=值` 行形态，注释行裸值直穿。**正形=读未知文件前先键名 grep 摸底·全文件 cat 前先过 `sed -E 's/[sS][kK]-[A-Za-z0-9_-]{16,}/sk-MASKED/g'` 类密钥形态通配掩码**——掩码正则须覆盖注释/字符串内嵌形态（与第 6 例「掩码正则追不全值形空间」同族延伸）。

## 四·cron payload 面清点（BOD 同族漏点提醒·回应）

- 8711：healthz cron.jobCount=0+daemon.log「engine started with 0 jobs」双实锚——零 payload 面。
- 8713：/internal/v1/cron/jobs 全清单 13 jobs——command 面全为脚本路径形（.fade/scripts 系 ps1/mjs/vbs）·**零 token 内嵌**（无 48427f1f/08e07c8b 命中）。sg 段发现的 cron payload 同族漏点本机面清空。
- 教训并入：**消费面清点清单自此含四层=进程 env+config 文件+启动器（cmd/ps1/VBS）+cron job payload**（BOD sg 段 §七教训承接）。

## 五·残留与候办

1. `D:/Code/ai/.env` 工作区根候选的 token 副本收敛删除（单点真源）——候清理窗·非急（值已一致化）。
2. 河源 TriRMC 8710 token（08e0）轮换未在今晚窗——候 R 面窗另行（本卷仅锚定消费对象事实）。
3. 8713 激活段余步（allowlist 追加+件②③ build 拾取+复测+冒烟+双探针）归 FSD——窗毕号已发。
4. GitHub push 补推候网络恢复（本卷含内）。

## 使用依据

- CEO 18:16 批令②·派工单 dispatch-sg-consolidation-window-20261015.md（§二本机段施工序）·BOD sg 段毕报 2c51714da+增补毕报 db924be8b（cron 双害+消费面漏点提醒）；
- 活体读数：8711/8713 healthz（19:09-19:22 时点内嵌正文）·TriRLC src/config/env.ts+dist/config/env.js（候选链实锚）·河源/sg 双探针（404/401/400 三态定谳）；
- 在案纪律：D-46 值面（第 7/8 例自捕）·D-47 落款双保险·D-15 派工回执·trilc-daemon-restart-discipline（重启链）·P0-1 教训（现役运行位断言·随件①警示 FSD）。

—— CTO 小狄（落款 date 现查原值 2026-10-15 19:24:00 +0800·发毕重跑对表 19:22:51 两信落款一致）
