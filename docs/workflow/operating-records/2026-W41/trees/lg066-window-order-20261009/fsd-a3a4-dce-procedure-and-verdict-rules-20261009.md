# FSD A3+A4 · LG-066 段1/段2 DCE 原子步骤单+判读规则确定化（终稿候选形）

- sourceOfTruth: 本件（trees/lg066-window-order-20261009/fsd-a3a4-dce-procedure-and-verdict-rules-20261009.md）
- syncMode: final（**终稿**·CTO 快核 @5c90deaa 四裁收编+BOD 03:57 X1 裁收编=P4.1 单案定稿；零候裁面残留）
- lastSyncedAt: 2026-10-09T04:02:30+08（date 现查原值；本笔=快核四裁+X1 裁收编微调毕）
- 起草席: FSD 小全（m-fsd）；令源=COO 排工令 01:42:54+08（BOD 01:34:40 知会余条件 c）；快核=CTO @5c90deaa（APPROVE 附四裁+X1/X2 呈裁）
- 对表正身: CTO sudo 动词索引 @e135f445（14 行白名单·**出集即 fail 停+报禁扩白名单**）+窗令 v2 §三/§四+方案稿 §五施工序 @055c40a7+§九注记 4/5 收敛口径
- DCE 形: 每步=命令（绝对路径）+预期输出模板（EXPECTED）+fail 行为；特权段全 `sudo -n` 形态（BOD 01:34 锁定）；非特权动词零 sudo（索引 §三）

## 〇、全局 fail 锚与通道形（A3 前置约定）

- **G-1 出集即停**：任何 sudo 步骤返回 `sudo: a password is required`（exit 1）=白名单外出集→**立即停+报 BOD，禁窗内扩白名单**（扩面=新配置变更走 BOD）。
- **G-2 步骤 fail 即停**：任一步实测输出≠EXPECTED→停+报 BOD（含截图/原样输出粘贴），不自动修不跳步；暗窗宁诚实降级过夜不放水绿门（CPO 条款）。
- **G-3 施工通道**：`ssh fleet@8.155.54.79`（fleet 身份→sudo -n 白名单审计面）。P0 预检**三形态**（CTO 快核裁 4：直连→别名→跳板序，任一通即过）：①直连 fleet 不通→②sg config 别名 `ssh -o BatchMode=yes heyuan 'echo OK'`（heyuan 别名=CTO 01:27 实勘现成资产，免 known hosts 首连交互）→③经 sg 跳板 `ssh sg-server → ssh fleet@8.155.54.79`（CTO 双验证实证通道）；三形皆不通→停+报 BOD（回退路径 2 半自动形，BOD 认可并存语义）。
- **G-4 token 红线**：全程 token 值面禁回显进会话链；卷面引用一律 `<set>` 尾指纹形。
- **G-5 root 残留清点**：任何 root 身份操作后 `find /srv/fleet /var/lib -user root -newer <marker>` 清点+chown fleet:fleet 归还。
- **G-6 时点锚**：开窗第一动作 date 现查记 TS0；完工判据全部对照 TS0。
- **G-7 停工硬界**：14:00-17:50 停工避让——任一步骤预计跨入 14:00 即收手落卷报 COO。

## 一、段1 步骤单（合并留 8712·预计 30-45min+15min 完工判据）

### P0 通道与基线预检（全非特权）

| # | 命令 | EXPECTED | fail |
|---|---|---|---|
| P0.1 | `date -u +%Y-%m-%dT%H:%M:%SZ` | 记 TS0 | — |
| P0.2 | 三形态序（任一通即过，见 G-3）：①`ssh -o BatchMode=yes -o ConnectTimeout=8 fleet@8.155.54.79 'echo OK'`→②`ssh -o BatchMode=yes heyuan 'echo OK'`（别名形）→③sg 跳板形 | `OK` | 三形态皆不通→停+报 |
| P0.3 | fleet@R-HY: `systemctl is-active trirmc trirmc-mc` | `active`×2 | 任一非 active→停+报 |
| P0.4 | fleet@R-HY: `curl -s --max-time 4 http://127.0.0.1:8712/healthz \| head -c 200` | `{"ok":true,...cron.enabled:true...}` | 不 ok→停+报 |
| P0.5 | fleet@R-HY: `systemctl show trirmc -p MainPID,ExecMainStartTimestamp,Environment` | 记基线 PID/TS/环境面（含 TRIRMC_MC_DB_PATH 有无——GO 判读 G 锚现值源） | — |
| P0.6 | fleet@R-HY: `ss -tlnp \| grep -E ':(8710\|8712)'`（sudo 免，ss 只读；若 fleet 看 pid 面受限加 `sudo -n` 不入——则读端口面即可） | 8712=127.0.0.1（pid=trirmc）/8710=0.0.0.0（pid=trirmc-mc） | 形态不符→停+报 |

### P1 备份锚先行（sudo 白名单内+数据面打包非特权）

| # | 命令 | EXPECTED | fail |
|---|---|---|---|
| P1.1 | fleet@R-HY: `sudo -n /usr/bin/cp /etc/systemd/system/trirmc-mc.service /etc/systemd/system/trirmc-mc.service.bak-lg066` | exit 0 | 出集→G-1 |
| P1.2 | fleet@R-HY: `sudo -n /usr/bin/cp /etc/systemd/system/trirmc.service /etc/systemd/system/trirmc.service.bak-lg066` | exit 0 | 同上 |
| P1.3 | fleet@R-HY: `ls -la /etc/systemd/system/trirmc*.bak-lg066` | 两 .bak 在位（尺寸与原件一致对表） | 缺件→停+报 |
| P1.4 | fleet@R-HY: `tar -czf ~/lg066-backup/dropin-and-datadirs-$(date +%Y%m%dT%H%M%SZ).tar.gz -C /etc/systemd/system trirmc.service.d trirmc-mc.service.d -C /var/lib trirmc trirmc-mc`（drop-in 目录+两数据目录打包；tar 落 fleet 家备份位，读面非特权） | tar 在位+`tar -tzf … \| wc -l`＞0 | 打包失败→停+报 |

**P1 序勘终裁（CTO 快核裁 1 收编，稿面倾向案撤）**：
- P1.1/P1.2 cp 备份**维持白名单形**（同目录 `.bak-lg066`）——稿面「cp 备份落 `~/lg066-backup/`」倾向案**否决**（CTO 裁：R2.1/R-3 回滚 mv 白名单源=`同目录 .bak-lg066`，备份落家目录=回滚 mv 无源可移=**回滚链断**）。
- cp 与 P4.1 mv 共用 `.bak-lg066` 的「自覆盖」观察（稿面 §五.1）**终裁=零损失**：P4.1 mv 过去的就是原件本体，与 P1.1 cp 副本内容一致——`.bak-lg066` 终态=原件内容，cp 步保留语义=X2 案（不 mv）唯一 unit 备份锚+两案通用时点锚。
- **双锚制成立**：`.bak-lg066`（unit 文件锚）+P1.4 tar（drop-in+数据目录锚，家目录位）——回滚链两件皆白名单内/非特权位。

### P2 窗内数据快照盘点（全非特权·窗内快照语义不前移）

| # | 命令 | EXPECTED | fail |
|---|---|---|---|
| P2.1 | fleet@R-HY: `diff /var/lib/trirmc/settings.json /var/lib/trirmc-mc/settings.json; echo "diff-exit=$?"` | `diff-exit=0`（同文）或差异逐行留档 | **有差→列差异候 COO/CTO 窗内裁，禁静默择一**（方案稿 §二表） |
| P2.2 | fleet@R-HY: `sqlite3 /var/lib/trirmc-mc/mc-store.sqlite '.tables'`+逐表 `SELECT COUNT(*)`；同法对 /var/lib/trirmc/mc-store.sqlite | 两库表清单+行数对表留档（复制前盘点锚，禁凭大小推定内容） | 库锁/损坏→停+报 |
| P2.3 | fleet@R-HY: `sqlite3 /var/lib/trirmc-mc/mc-store.sqlite 'PRAGMA wal_checkpoint(PASSIVE);'` | checkpoint 返回（停 mc 后主刷） | —（在 P3 停 mc 后再执行一次，序注：P2.3 排 P3 之后跑） |

### P3 停用 mc 面（sudo 白名单内）

| # | 命令 | EXPECTED | fail |
|---|---|---|---|
| P3.1 | fleet@R-HY: `sudo -n /usr/bin/systemctl stop trirmc-mc.service` | exit 0 | G-1 |
| P3.2 | fleet@R-HY: `sudo -n /usr/bin/systemctl disable trirmc-mc.service` | `Removed …`（disable 成功） | G-1 |
| P3.3 | fleet@R-HY: `systemctl is-active trirmc-mc; systemctl is-enabled trirmc-mc` | `inactive`+`disabled` | 非→停+报 |
| P3.4 | 重跑 P2.3 checkpoint | 返回 | — |

### P4 unit 移备份位+重载（sudo 白名单内·**P4.1 已裁 X1 单案定稿**）

**P4.1 施工方向真缺口（CTO 快核发现·如实认领）→ 已闭**：白名单 mv 条目原只有回滚方向（`.bak-lg066 → 原件`），无施工方向——**BOD 03:57 已裁 X1**（扩白名单施工方向 mv 精确枚举一条，CTO root 通道即办+双验证照 01:32 流程）——本步按 X1 单案定稿（原稿 mv 形即终形；**P4.1 执行前置断言**：CTO 扩条毕报确认在卷后才入 P4，毕报未达=G-2 停+报候令）。

| # | 命令 | EXPECTED | fail |
|---|---|---|---|
| P4.1 | fleet@R-HY: `sudo -n /usr/bin/mv /etc/systemd/system/trirmc-mc.service /etc/systemd/system/trirmc-mc.service.bak-lg066`（**前置**：BOD 03:57 X1 裁+CTO 扩白名单毕报落地确认） | exit 0（mv 目标=P1.1 已有 .bak——序勘终裁：同内容零损失，见 P1 序勘终裁注） | G-1（扩条未落地或参数序不符=出集即停） |
| P4.2 | fleet@R-HY: `sudo -n /usr/bin/systemctl daemon-reload` | exit 0 | G-1 |
| P4.3 | fleet@R-HY: `systemctl list-unit-files \| grep trirmc-mc` | 零命中（**CTO 快核裁 2 已认**：drop-in 目录 /etc/systemd/system/trirmc-mc.service.d/ 不进 unit-files 面——孤儿目录零生效原地保留=白名单外不动，回滚母 unit 回位即复完；方案稿 §一.2「连同 drop-in 移入」**降级注记**=本条落地正形，drop-in 不随母 unit 移） | 有命中→停+报 |

### P5 残留断言（全非特权）

| # | 命令 | EXPECTED | fail |
|---|---|---|---|
| P5.1 | fleet@R-HY: `curl -s --max-time 4 http://127.0.0.1:8710/healthz; echo "exit=$?"` | 非空 exit≠0（口已暗）或空响应——**8710 暗窗开始** | 口仍应答→停+报（mc 未真停） |
| P5.2 | fleet@R-HY: `ss -tln \| grep ':8710'` | 零命中 | 有→停+报 |

### P6 本体 8712 全绿验收（全非特权·段1 锚）

| # | 命令 | EXPECTED | fail |
|---|---|---|---|
| P6.1 | `curl -s http://127.0.0.1:8712/healthz` | `ok:true`+`cron.enabled:true`+`degraded` 假或 falsy | 任一不达→**窗收**（段1 未绿=窗止，报 BOD） |
| P6.2 | `systemctl show trirmc -p MainPID,ExecMainStartTimestamp` | PID 与 ExecMainStartTimestamp == P0.5 基线（本体未动实证，禁 is-active 代） | 变了→停+报 |
| P6.3 | `find /var/lib/trirmc/cron/logs -type f -newermt '-90 minutes' \| head -1` | 非空（cron 滚动活） | 空→停+报 |
| P6.4 | 段1 卷落树+第一刻报 | — | — |

## 二、GO 断点判读规则（A4 确定化·替代「人工判」）

**GO 量化条件（三条全真=GO，任一假=NO-GO 窗收报 BOD）**：

| # | 判据 | 量化读数（写死） |
|---|---|---|
| GO-1 | 段1 六步 EXPECTED 全中 | P0-P6 全表零 fail 记录（含 P2.1 有差候裁项已获窗内裁） |
| GO-2 | trirmc-mc 三残留断言零命中 | P4.3 零命中+P5.1 口暗+P5.2 零 ss（X1 单案定稿语义） |
| GO-3 | 本体 8712 三探针绿 | P6.1/P6.2/P6.3 全过 |

**MC_DB_PATH 判读锚（窗令 §九注记 5·GO 判读面必做）**：

| # | 探针 | 读数与动作 |
|---|---|---|
| MC-1 | fleet@R-HY: `systemctl show trirmc -p Environment \| tr ' ' '\n' \| grep MC_DB_PATH` | **无命中**（P0.5 现值预期）→主 unit 无该键=与现值一致→**段2 unit 不补键**（改动最小面） |
| MC-2 | fleet@R-HY: `ls -la /var/lib/trirmc/mc-store.sqlite /var/lib/trirmc-mc/mc-store.sqlite`+P2.2 行数对表 | 两 store 并存形态与 P2.2 快照一致（无新写入分叉）→一致→不立项 |
| MC-3 | 分裂实证定义（写死） | 唯当 MC-2 显示段1 窗内 mc-store-mc 侧有**新写入**（mtime 推进+行数变化＞0）**且** P2.2 盘点证实两库内容分叉→立项迁移另排窗（**本窗仍不补键不动数据**，报 COO/CTO 记新候办） |
| MC-4 | 段2 后进程读哪份 store | 合并体单实例读代码默认路径（TRIRMC_CONFIG_DIR=/var/lib/trirmc 面）；若合并后 `TRIRMC_MC_DB_PATH` 语义激活指向缺失路径=新缺陷，判读记录+按 G-2 停+报（不窗内修） |

**fail 行为**：GO 三条任一假或 MC-4 触发→**停+报，不自动修，不进段2**。

## 三、段2 步骤单（迁 8710 原子切换·预计 ~1h）

### Q1 unit 新内容写入（sudo tee stdin 形·索引 §二正形）

| # | 命令 | EXPECTED | fail |
|---|---|---|---|
| Q1.1 | fleet@R-HY: `cat /etc/systemd/system/trirmc.service` | 现值留档（改前原文，写新 unit 唯一差异=两键） | — |
| Q1.2 | **本机 dev 侧**生成新 unit 文件（现值逐行复制，仅改两键：`Environment=TRIRMC_HOST=0.0.0.0`+`Environment=TRIRMC_PORT=8710`；MC_DB_PATH 不补=MC-1 一致结论；其余行 byte 级不动）+scp 至 R-HY fleet 家 `~/lg066-new-trirmc.service`；`diff <(sed 's/TRIRMC_HOST=127.0.0.1/TRIRMC_HOST=0.0.0.0/;s/TRIRMC_PORT=8712/TRIRMC_PORT=8710/' ~/lg066-new-trirmc.service) /etc/systemd/system/trirmc.service` 对照读数=恰好两行差 | 两行差全表 | 差异≠两行→停+报（**改动最小面断言**） |
| Q1.3 | fleet@R-HY: `sudo -n /usr/bin/tee /etc/systemd/system/trirmc.service < ~/lg066-new-trirmc.service >/dev/null`（**CTO 快核裁 3 终形**：tee 喂**原件**+`>/dev/null` 丢回显——重定向由 shell 处理不进 sudo 参数序列，白名单匹配不受影响；稿面「sed 脱敏副本喂 tee」**禁**——tee 写面=生产 unit 本体，喂脱敏副本=token 行变 `<set>` 字面量写进 unit=重启服务炸） | exit 0+**事后验证**：`diff <(sed 's/TRIRMC_INTERNAL_TOKEN=.*/TRIRMC_INTERNAL_TOKEN=<set>/' ~/lg066-new-trirmc.service) <(sudo -n cat /etc/systemd/system/trirmc.service \| sed 's/TRIRMC_INTERNAL_TOKEN=.*/TRIRMC_INTERNAL_TOKEN=<set>/')` 零差（双侧同形 sed 脱敏后比对面，token 值面零出机） | diff 非零→停+报；G-1（tee -a 变体自动被拒=索引实证） |
| Q1.4 | fleet@R-HY: `sudo -n /usr/bin/systemctl daemon-reload` | exit 0 | G-1 |
| Q1.5 | fleet@R-HY: `sudo -n /usr/bin/systemctl restart trirmc.service` | exit 0 | G-1→**回滚规则 R-2 预挂**（restart 失败即触发） |

### Q2 完工判据+三判据量化判读（5min 窗·全非特权）

| # | 命令 | EXPECTED | fail |
|---|---|---|---|
| Q2.1 | `systemctl show trirmc -p MainPID,ExecMainStartTimestamp` | TS ＞ TS0（restart 真发生，禁 active 代） | 未变→R-2 |
| Q2.2 | 每 30s×10 轮：`curl -s http://127.0.0.1:8710/healthz` | `ok:true`+`cron.enabled:true`+非 degraded——**10 轮内全 ok（零 ok 轮=触发 R-2；间歇 ok 记录候判）** | 见判读规则 §四 |
| Q2.3 | **dev 侧 l2 改址触发**（段2 同窗原子）：`cp scripts/ops-local/tri-liveness-l2.post-lg066-seg2.ps1 $env:LOCALAPPDATA\tri-liveness-l2.ps1`→等 ≥2 轮计划任务轮询→`Get-Content $env:LOCALAPPDATA\tri-liveness\l2.log -Tail 4` | 出现 `OK all-hosts` 行（改址版探 8710 回对） | 2 轮内零 OK→R-2；l2 误报行记录留档 |
| Q2.4 | fleet@R-HY: `find /var/lib/trirmc/cron/logs -type f -newermt '-5 minutes' \| head -1` | 非空（cron 首滚绿） | 空→5min 末判，仍空→R-2 |
| Q2.5 | fleet@R-HY: `ss -tln \| grep -E ':(8710\|8712)'` | 8710=0.0.0.0 在听+8712 零命中（空置断言·N3 72h 观察窗并轨起点记卷） | 8712 仍在→停+报 |

### Q3 联动扫尾（绿后）

| # | 动作 | EXPECTED | fail |
|---|---|---|---|
| Q3.1 | dev 侧 sg 跳板勘正 `~/.trilc/duty-night-patrol.py` 8710 注释 docstring（陈旧注释随手勘正·只改注释行，`grep -n 8710` 前后对表留档） | diff 仅注释行 | 运行行被触→还原+停+报 |
| Q3.2 | UI 升版触发：TriModel 卡面「R 服务域」8712→8710 文案走**升版流水线**（非手工改卡）——本席候 CTO 排程面确认时点（窗令 §四「联动扫尾」在列，执行位=FSD 现役真源） | 升版单落卷 | — |
| Q3.3 | 段2 卷+毕报（→COO+BOD 两刻）+STE 72h 观察窗挂账知会 | — | — |

## 四、回滚触发规则（A4 规则化·预置脚本在挂）

**R-1 段1 任一步 fail**：不触自动回滚（段1 fail=停+报窗收，mc 已停态保留=暗窗过夜语义，BOD 裁处置；恢复 mc 需 BOD 令→回滚锚 R-3）。

**R-2 段2 回滚触发（确定性条件·任一为真即执行，禁止超 5min 宽限；判读席可提前触发=更严方向合法，更宽方向禁）**：
- T1：Q2.2 10 轮（5min）零 `ok:true` 轮；
- T2：Q2.3 l2 改址后 2 轮内零 `OK all-hosts` 且 l2.log 出现 `trirmc-8710 state=healthz-unreachable` 连续 2 轮；
- T3：Q2.4 满 5min cron fresh log 仍空；
- T4：Q1.5 restart 本身失败/服务入 failed 态。

**R-2 执行序列（白名单内全自动·预置单值回改脚本在挂）**：

| # | 命令 | EXPECTED |
|---|---|---|
| R2.1 | fleet@R-HY: `sudo -n /usr/bin/mv /etc/systemd/system/trirmc.service.bak-lg066 /etc/systemd/system/trirmc.service` | exit 0（原件复完） |
| R2.2 | fleet@R-HY: `sudo -n /usr/bin/systemctl daemon-reload` | exit 0 |
| R2.3 | fleet@R-HY: `sudo -n /usr/bin/systemctl restart trirmc.service` | exit 0 |
| R2.4 | `systemctl show trirmc -p ExecMainStartTimestamp`＞回滚 TS+`curl 8712/healthz`=`ok:true` | 复绿实证 |
| R2.5 | dev 侧 l2 回滚：cp 现役版（pre-lg066）回 `%LOCALAPPDATA%`+等 2 轮 log OK | 探针复对 8712 |
| R2.6 | 报 BOD+COO（回滚 TS+触发条件号+全读数），8712 复用续役；段2 顺延 10-10/10-13 照窗令 §三 | — |

**R-3 段1 回滚锚（白名单内·候 BOD 令执行）**：`mv trirmc-mc.service.bak-lg066 → trirmc-mc.service`+`daemon-reload`+`enable trirmc-mc.service`+`start trirmc-mc.service`→`is-active trirmc-mc`=`active` 断言。

**R-4 白名单全撤锚（root 面·施工毕或 BOD 令）**：`rm /etc/sudoers.d/fleet-trirmc-lg066`→通道自然回退路径 2（索引 §四.1）。

## 五、快核裁决收编记录（候核点五项全闭·本笔终稿依据）

- sourceOfTruth 面指针：CTO 快核卷=trees/lg066-window-order-20261009/cto-condition3-quick-review-20261009.md @5c90deaa（APPROVE 附四裁）+BOD 03:57 X1 裁（经 COO 04:02 转达）

| # | 稿面候核点 | 裁决 | 收编落点 |
|---|---|---|---|
| 1 | P4.1/P1.1 备份后缀序 | **裁 1**：P1.1/P1.2 cp 维持白名单形；「备份落家目录」倾向案否决（回滚 mv 无源=回滚链断）；cp 与 mv 同 `.bak` 终态=同内容零损失；双锚制（.bak+P1.4 tar）成立；**mv 施工方向缺口=X1 裁**（BOD 03:57 扩条，CTO root 通道+双验证） | §一 P1 序勘终裁注+P4.1 单案终形（含前置断言：扩条毕报确认才入 P4） |
| 2 | drop-in 孤儿保留正形 | **裁 2 认**：trirmc-mc.service.d/ 原地保留零生效，回滚母 unit 回位即复完；方案稿 §一.2「连同 drop-in 移入」降级 | P4.3 注记（降级注记入终稿） |
| 3 | Q1.3 tee 回显 token 脱敏形 | **裁 3**：tee 喂原件+`>/dev/null` 丢回显（重定向 shell 处理不进 sudo 参数序列）；**禁脱敏副本**（`<set>` 字面量写进 unit=重启炸）；EXPECTED=exit 0+事后 diff 双侧同形 sed 脱敏零差 | Q1.3 终形改写 |
| 4 | 施工通道预检形态 | **裁 4 认+补一形**：三形序直连→别名（`ssh heyuan`，CTO 01:27 实勘资产）→sg 跳板，任一通即过 | G-3+P0.2 三形态 |
| 5 | MC-3 分裂阈值/MC-4 激活缺陷判读 | **裁 5 认**：MC-3「mtime 推进+行数变化＞0 且内容分叉」定义确定化合格；MC-4 触发=停+报不窗内修 | §二原形保留（零改动） |

## 使用依据

- CTO sudo 动词索引 @e135f445（14 行白名单+正误对照+非特权注记+回滚锚三件+双验证读数）
- CTO 快核卷 @5c90deaa（四裁收编正身：备份后缀序/drop-in 孤儿/tee >/dev/null/通道三形/MC 认账+X1/X2 呈裁）；BOD 03:57 X1 裁（扩白名单施工方向 mv 一条·CTO root 通道即办+双验证照 01:32 流程；COO 04:02 转达）
- 窗令 v2 @a60b36b9（§三段锚断点/§四窗序/§七施工纪律五条）+§九执行实锚五注记 @7eefc95f（注记 4 L92 不动/注记 5 MC_DB_PATH 判读锚）
- FSD 合并方案稿 @055c40a7（§〇活体基线/§一端口收敛/§二数据面表/§三消费方清单/§五施工序）
- staged 改址版 scripts/ops-local/tri-liveness-l2.post-lg066-seg2.ps1（f06b60c7，Q2.3 触发件）
- COO 排工令 01:42:54+08；BOD 01:34:40 知会（sudo -n 形态锁定）
