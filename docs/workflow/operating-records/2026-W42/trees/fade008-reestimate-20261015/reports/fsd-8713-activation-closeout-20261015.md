# FSD 8713 激活段毕报（Q2 反向通道一期·件②③运行位激活）

- 令源：BOD sg 段毕号（2026-10-15 19:04:33 +0800「sg 段毕·8713 激活段可动」）+ CTO 窗毕号（19:22:51 +0800·件①解挂）
- 施工席：FSD 小全（m-fsd）·窗口：19:09-19:27 +0800（GLM 轨黄金窗内·与 CTO 本机段并行零冲突）
- 状态：**全绿毕**（七步+三增值发现）

## 一、七步实录（各步实锚）

| 步 | 内容 | 锚 |
|---|---|---|
| 1 | P0-1 改前复断言 | schtasks `\TriMLC Daemon` /TR=`C:\Users\jedih\AppData\Local\trimlc-daemon-channel.cmd` ✓ |
| 2 | launcher allowlist 追加+CRLF 归一 | 16 entries（+`node D:/Code/ai/TriMetaverse/scripts/fade/echo-pull.mjs`）·CR=39/LF=39·纯 ASCII·备份 `.bak-pre-echopull-allowlist-20261015` |
| 3 | `npm run build`（TriMLC） | dist/server/app.js+letter-store.js 19:20 新鲜·SOURCE_SEAT_WHITELIST×3 在 dist |
| 4 | 重启链 | watchdog Disable→POST /shutdown（旧 pid 3016）→port FREE 1s→schtasks 冷启→新 pid 30624 node.exe（parent cmd.exe）→CIM 对表 ✓→watchdog Enable（Ready） |
| 5 | 值面探针 | healthz 200·`mc_link=connected`·`trimc=connected`（新 token 出向 sg 18710→8712 全通） |
| 6 | 本地腿真投+负探针 | 冒烟件 `q2-activation-smoke-001` 落箱 **advisory=true**（红线③服务端硬打标）+markRead 毕；负探针 bod 席→**403 source_seat_not_allowed**+零落箱（红线②机器可判形） |
| 7 | cron 注册三查（F-3） | POST 201·id=`cron_mv9g96zl_e7mo`·nextRunAt=11:25:00Z 值面 ✓·enabled=true ✓·command=allowlist 串精确等值 ✓·**首跑 19:25:04 `queue 404（件① 未部署期·armed 前不计数）`·state armed=false failStreak=0 保持·runCount=1 errorCount=0** |

## 二、三增值发现（激活段排障副产品）

1. **CTO sed 通道剥 CR 实证**：`.bak-pre-tokrot-20261015`（sed 前）CR=39/LF=39 纯 CRLF → sed 后 CR=0/LF=39——`[0-9a-f]*` 值段替换连同行尾 CR 一并剥除（「CR 保留断言过」系假阴性）。本席编辑段已全量 CRLF 归一修复。**教训归 cmd-batch-crlf-preservation 族**：程序化改 cmd 后必须重断 CR/LF 计数，禁信上游「保 CRLF」声明。
2. **`/etc/trimc-internal-token`=8710 时代旧值残留**（md5_8=302988aa ≠ 新值）：echo-pull.mjs sg 腿原读 /etc → 轮换后必 401。已改 token 源→`/srv/fleet/TriMMC/docker/.env` 的 TRIMC_INTERNAL_TOKEN（8712 时代权威位·BOD 毕报指定），sgQueueGet+sgAck 两处，commit TriMetaverse `c52bc6690`；活测：queue GET→404 not_found（认证过+件①未部署·armed 门预期态）。
3. **L18 TRIMC_NOTIFY_SG_TOKEN 照 8711 env 先例同步新值**：CTO 8711 侧 `trirlc-daemon.env` 两 token 键（TRIMC_INTERNAL_TOKEN/TRIMC_NOTIFY_SG_TOKEN）同写新值——8713 cmd L18 原为旧值（出向 notify 自告警链会 401），已从 L11 已验证值同步（值全程变量内零回显·md5_8 对表 c86a47ae）。

## 三、值面对表记录（零值面·指纹口径注记）

- 三方同值实证（md5_8 口径）：sg `.env` 文件 == sg 8712 进程 environ（pid 4162441）== 本机 cmd L11 == **c86a47ae** → sg 侧已拾新 token 生效。
- CTO 毕报指纹 6ed04b06 vs 本席 sha256(value) 前 8=6c3b6fbc：**派生式差异非值差异**（四变体 sha256±NL/md5±NL 均不含 6ed04b06）——值面对表以 md5_8 三方同值实锚为准，值无误。
- R 面观察（中途 8711 401 归因探针）：河源 TriRMC 8710 进程 2026-10-09 19:03 CST 起 5 天未动·environ 无 TRIMC_INTERNAL_TOKEN 键（R 面 token 面独立）——8711 冷启后短暂 auth-rejected 已由 CTO 本机段 19:22 毕报闭合（8711 connected），R 面同步议题归 CTO 轮换单 scope 裁量。

## 四、技术债/limitations 如实

- **daemon console 留痕落点未定谳**：403 reject 的 console.log 输出经 schtasks 冷启链 stdout 落点未验（负探针响应面+零落箱已机器可判，console 留痕面候后续窗勘定）。
- echo-pull armed 门现势：armed=false（正确态——首封真信落箱才 armed）；件① 部署后首拉成功自动 armed。
- 本机 cmd 历史备份群（11 份 .bak）含 token 旧值面——轮换单 scope 若含旧值清理，备份群属候选清单（值面文件在用户 AppData 本机域，非仓面零外泄）。

## 五、使用依据

- BOD sg 段毕号 19:04:33 +0800·CTO 窗毕号 19:22:51 +0800·CTO 值面通道信 19:07:0x +0800
- CTO 派工单 046caf7cb（CEO 18:16 批）·技术卷 reports/cto-q2-reverse-channel-tech.md
- D-23 v3 窗控（勘修重启类正当入窗）·D-46 值面纪律·P0-1 教训·F-3 家族性记忆·cmd-batch-crlf-preservation 记忆
- 件② commit TriMetaverse `c52bc6690`（token 源切换）·件③ commit TriMLC `82e8fc1`（19:14 窗前已毕报）
