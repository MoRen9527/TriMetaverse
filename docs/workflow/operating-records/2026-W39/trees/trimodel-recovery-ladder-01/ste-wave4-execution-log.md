# STE 波④ 执行日志（工作证据卷，随臂续写；终报另出）

- sourceOfTruth: 本件（波④ 执行过程证据卷；终态结论以终报正身为准）
- syncMode: working
- lastSyncedAt: 2026-09-26 08:0x +0800（date 现查 hook 链）
- 执行席: STE 小柯（m-ste）；派单=dispatch-wave4.md @ 7f1c62ed；方案正身=joint-plan.md 24ba1ccc
- 窗管理（CTO 四条款）: 进窗时点=候 FSD 钉位就位即记（F1 在窗外，不依赖钉位）；窗长上限 2h；出窗还原义务+三读数核验候 F2-F4 毕

## 前置核验读数（2026-09-26 07:2x-07:5x）

| 前置项 | 读数 | 判定 |
| --- | --- | --- |
| ① ⑹ L2 status 读数接线 | TriCode dist/trimodel-cli/env.js 含 TRIMODEL_L2_FLAG（mtime 07:19）；TriMLC dist/cli.js 含 l2FlagPath（07:23）；CLI 实测 `model status` 输出 `l2_flag = {"present":false}`（env 钉位形态）+version 0.2.0-wave3——**src 未提交（TriCode M×3+TriMLC M×1），已催 FSD** | ✅ 功能面绿 |
| ② cron job 实体 | GET /internal/v1/cron/jobs（token=daemon 启动 cmd，验讫）：trimodel-l2-scan everyMs=120000 enabled runCount=154；trimodel-l3-remind everyMs=1800000 enabled runCount=21；TRILC_CRON_COMMAND_ALLOWLIST 两串精确匹配在位；近 30 条执行全 ok | ✅ |
| ③ 沙箱钉位 | cron 链零钉位实锤：CronJob schema 无 env 字段+daemon 启动 cmd（trimlc-daemon-channel.cmd）env 无 TRIMODEL_CLAUDE_SETTINGS/DEPLOY_KEY/AUDIT_LOG/L2_FLAG+stub 本体不设钉位；真 legacy 钥在位（~/.claude/settings.presets/.deploy-key 存在，per-provider .bigmodel 不存在）——现态落真 flag=读真钥写真活体（红线） | ⛔ 候 FSD 方案 A（CTO 已裁可+钉位清单五项） |

- CTO 裁可件：方案 A 采（daemon 启动 cmd 演练窗钉位+stop/start 纪律重启）；窗管理四条款（窗≤2h/出窗还原三读数/进窗知会+CEO 窗前必出窗/窗内真降级=意外实弹样本记读数）；钉位清单五项（PORT/ADMIN_TOKEN/CLAUDE_SETTINGS/AUDIT_LOG/DEPLOY_KEY 路径，转 FSD 落位核）；F1 先行裁可。

## F1 臂读数（kill 3333 → L1 重启实弹，2026-09-26）

基线（T0 前）：

- 3333 pid=16248（node，start 2026-09-22T11:41:19）；watchdog.log 尾行 `2026-09-26T07:51:35+08:00 revive attempt up=True rounds=0`（存量行，见观察-1）
- 真活体 settings.json hash=`491F33353D50F938B6B6DFD26CC8C7804500E10BE55AC52CAEBB6E633CD778B2` mtime=2026-09-25T04:09:35；flag 零落盘；唯一 keeper=TriModel-Watchdog 任务（无第二复活源）

断言表：

| 断言 | 读数 | 判定 |
| --- | --- | --- |
| 注入 kill | T0=2026-09-25T23:56:27.290Z（07:56:27 +0800）Stop-Process pid 16248；T0+2s 探活 FAIL（确认死） | ✓ |
| watchdog ≤70s 探活 fail→拉起 | 拉起行 `2026-09-26T07:57:01+08:00 revive attempt up=True rounds=0`——T0→拉起行=33.7s | ✓ ≤70s |
| health 200 恢复 | 2026-09-25T23:57:05.605Z（07:57:05 +0800）独立轮询 200——T0→up=38.3s | ✓ |
| log `revive attempt up=true` | 日志逐字在卷（上行） | ✓ |
| 进程重启=设计行为（L1 例外条款） | 新 pid=25208 start=2026-09-26T07:56:48（launch.cmd 链 `node dist\src\server.js` 拉起）；旧 16248 已终 | ✓ |
| L2 不误触发（首轮复活成功） | `.fade/trimodel-l2-flag` 零落盘（rounds=0<3） | ✓ |
| 真活体零接触 | POST hash 同基线逐字（`491F…78B2`），mtime 未动 | ✓ |

- health body 终态：`{"ok":true,"service":"trimodel","version":"0.1.0",...}`（service 身份字段在卷）。
- **观察-1（非本臂产物·存量）**：F1 前 07:51:35 有一条 revive 行（瞬时探活 fail 触发拉起，旧进程仍持 3333）——watchdog 拉起前不验端口持有者，重复拉起的新 node 会 EADDRINUSE 静默退出（探针仍见旧进程 up=True）。无害（fail-safe 方向），录档候 FSD 知悉；不阻本波。

## F2 臂读数（端口占位×3 轮 → L2 标记+cron 拾取+restore，2026-09-26 09:04-10:42）

注入技术线（三代迭代，如实记录）：

| 代 | 技术 | 结果 |
| --- | --- | --- |
| v1 | 普通 TcpListener 占 3333 | ✗ 被 node SO_REUSEADDR 二绑抢注（08:09:19 复活成功）——注入缺陷非产品缺陷 |
| v2 | ExclusiveAddressUse 独占+黑洞不 accept | ✗ PS5.1 IWR 对「可连不应答」-TimeoutSec 8 失控，一轮 probe 挂 ~35min（08:18:04→08:54:08）——观察-2 |
| v3 | 独占+accept 即关（快速失败） | ✓ L1 检测节律正常，本臂主注入（up 09:04:56，自限 09:25:08 释放） |

L1 检测+flag 链（✓）：

- T0''=2026-09-26T01:04:28Z（09:04:28 +0800）kill node pid 21544；09:04:56 squatter3 独占 3333（pid 40584，探针快速失败实证）
- rounds 节律：09:05:26 rounds=1（T0+58s）→每轮 3 败即写 flag，共六次 revive-exhausted 落盘：09:07:50 / 09:11:29 / 09:15:03 / 09:18:53 / 09:22:27 / 09:26:23；rounds 间隔均值 ~71s（60s 循环+8s 超时内+复探）
- 六次 flag 全部 reason=revive-exhausted detail=health down after 3 revive rounds（与 v3 watchdog 副本契约逐字一致）

cron 拾取链（✓ 拾取；✗ restore 执行——阻塞发现）：

- 拾取时延：flag#1 09:07:50→stub 首拾 09:08:07=**17s**；flag#2 09:11:29→09:11:48=19s；后续 flag 逐 tick 重试拾取（≤2min 节律）——cron 通道本身工作正常
- **restore 八连败（阻塞）**：09:08:07 / 09:11:48 / 09:14:59 / 09:18:37 / 09:21:22 / 09:24:20（revive-exhausted）+ 09:51:59 / 09:59:19（auth-dead，见发现-B）——`'node' 不是内部或外部命令` exit=1：**cron spawn 环境 PATH 无 node**，stub `cmd /c "node …"` 裸调必败；fail-closed 契约正确工作（八次全保留 flag 重试）
- 波③⑦ 接线成功样本（stub.log 05:53:56 restore-done exit=0）为桌面 PATH 上下文所跑——**接线验证环境盲区：桌面 PATH 有 node、daemon cron spawn PATH 无**
- drill-settings.json / drill-audit.log 从未产生——与 restore 未跑进 core 一致：**FSD 钉位在位但从未被触达验证**（restore 死在 node 解析层，env 键读不到）
- 双层探活自愈清 flag ✓：09:26:43（squatter 释放服务回后）clear-flag healthy；10:03:46（auth-dead 事件后）同

发现-B（非阻塞·机制观察·auth-dead 误报定性）：

- 09:50:10 `l2-flag reason=auth-dead detail=keys-unreachable`——非注入产物，意外实弹样本
- 定性：**keys 探针 8s 超时误报**。证据链：服务恢复后 watchdog 仍每 6-20min 出一轮 `revive attempt up=True rounds=0`（09:40:29/09:48:53/10:03:04/10:09:23/10:29:08/10:42:23）=probe 8s 线误判 down→拉起 node EADDRINUSE 静默死（观察-1 模式持续）→10s 复探撞上服务响应记 up=True；09:50:10 同源——health 200 过活分支后 keys 探针 8s 内未返回（服务慢响应）→连接层失败→auth-dead。现态 keys 探针 200 in 0.14s 带值（快照 10:2x）
- 影响：auth-dead 为跳 L1 直写 L2 的高权重信号，存在慢响应误报率；窗内真实记录，候 CTO/FSD 定改进（如 keys 探针重试二次确认）

出窗前快照（10:2x-10:4x）：

- 3333 listener pid=25784（node）；health 200；keys 200 五组键全带值（值面本卷不抄录，敏感掩码）；真活体 settings hash=`491F…78B2` 与基线逐字同、mtime 未动——**真活体零接触全程守住**
- 窗管理如实记：进窗 08:07，cap 10:07，F2 收证延至 ~10:45——**超窗 ~38min**（stub 八连败取证+log 全量回读耗时超预估），上报 CTO

## F2 臂小结（停臂候裁依据）

- 主注入链绿：L1 检测节律 / flag 落盘 / cron 拾取 / fail-closed 保留 / 自愈清理 / 真活体零接触 全 ✓
- **发现-A（阻塞·候 CTO 裁）**：L2 restore 经 daemon cron 通道功能不存在（spawn env PATH 无 node，八连实证）。修复归属 FSD（stub 显式 node 全路径或 PATH 补齐，同 launch.cmd PATH guard 模式）；修复前 F3/F4 链尾同踩此断点，硬走无验收价值
- 发现-B（非阻塞）：auth-dead 探针误报率实证一例（8s 超时线）
- 观察-2（非阻塞）：PS5.1 IWR -TimeoutSec 对「TCP 可连不应答/慢应答」失控（v2 黑洞 35min、v3 后 probe 误判循环）——L1 检测时延口径「≤70s」仅对 connect-refused 进程死成立

### 发现-A 根因实锤（10:3x 补勘）

- channel cmd L19-28：DRILL WINDOW 四钉位在位 ✓（CLAUDE_SETTINGS/DEPLOY_KEY/AUDIT_LOG→Temp 沙箱、L2_FLAG→真 flag 路径）
- channel cmd L29-31：**PATH guard v2（2026-09-26 新加，FSD）**——`set PATH=C:\Windows\System32;C:\Windows;…\Wbem;…\WindowsPowerShell\v1.0` 瘦四段，**不含 C:\nvm4w\nodejs**。guard 修「daemon spawn(env-cwd) breaks」问题顺带钉瘦 PATH，漏 node 目录
- daemon（pid 45972）uptime 11018s→启动 ≈08:01:56 +0800（FSD 落钉位重启那次）——**瘦 PATH 自该刻起生效**
- 时间线自洽：波③ restore-done 成功样本 05:53:56 在 guard 引入前（daemon 旧 env 含桌面 PATH）；本波 08:02 重启后 09:08 首次 restore 即败，八连败全在瘦 PATH 窗内
- launch.cmd 拉起 TriModel 用 node 全路径（`C:\nvm4w\nodejs\node.exe`）故 L1 复活链不受 guard 影响；stub 裸调 `node` 独踩
- 修法建议（归属 FSD 裁）：PATH guard 行追加 `;C:\nvm4w\nodejs`，或 stub 改 node 全路径（一处改动任一即可，前者覆盖面更全）

## 25/25 对照（R1 首过完成，2026-09-26 08:0x-09:0x）

- 基线：ste-reverify-report.md（incident-sde-settings-01 树）25/25 @ f887b27，R5 终跑 110015。
- 重跑对象：`node D:\Code\ai\TriMLC\dist\cli.js model restore-direct`（core 路径=TriMLC bin 实链，与 stub 生产调用同形）。
- 沙箱根：`D:\tmp\ste-wave4\map25\`，逐案独立目录+逐案 env 钉位（CLAUDE_SETTINGS/DEPLOY_KEY/AUDIT_LOG 三键全案钉沙箱；零触真钥目录）。
- **结论：19 直接重跑 PASS + 6 MAPPED 处置 + 0 FAIL**（对照表全文候终报；MAPPED 逐条 disposition 如下，一条不丢）：

| 案 | disposition |
| --- | --- |
| T2d（deploy-key 源序：per-provider→legacy） | CLI 不可实跑（默认落点在真 ~/.claude/settings.presets，实跑=真钥目录布雷，禁区）→代码审读映射（presets.ts readDeployKey fail-closed 源序 env→per-provider→legacy）+债注记 |
| T2b（同形注入防漏） | 形态演进映射：ps1 时代生成恒单键（API_KEY 形）→core 既有 API_KEY 载体同写同值消灭残留，候 CTO 认可映射 |
| T4b（verify-fail 自动回滚） | 债线映射：verify-fail 端到端不可注入（需 mock 文件系统竞态）；测套 five-gates.test.ts L159/L173 承载（WRITE_FAILED_ROLLED_BACK 断言在套） |
| T4c/T4e（写后 smoke） | 形态迁移：ps1 写时 smoke 特性未迁 core（core 五门=备份/键名/健康门/回读断言/掩码审计，smoke 由上层承接）——注记非缺陷 |
| T4d（备份轮换 keep=5） | MAPPED-F3：哨兵/轮换已测套承载（five-gates L127/L140）+候 F3 实弹回填（F3 挂起候发现-A 修复） |
| T7a（坏 JSON 预设拒载） | 测套承载：presets.test.ts L39 断言在套，CLI 实跑与套断言同源 |

- exit 码形差异如实记：ps1 时代业务拒=exit 2→core 业务拒=exit 1（用法错=2）——对照表逐案标注，非缺陷系契约演进，候 CTO 知悉。
- 观察项：T5b UTF-8 无 BOM 断言在 core 由尾换行随原文件策略覆盖，读数绿。
