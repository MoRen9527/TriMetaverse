# SDE 毕报 · LG-092 首触发缺陷修复（CTO 裁案②·本机侧收口）

- sourceOfTruth: 本卷（案②施工收口正身·三件+五要件读数全谱）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 施工席: SDE 小布·令源=COO 派令（落款锚 2026-11-04T19:52:39Z）·授权锚=CTO 裁定卷（本树 cto-ruling.md·TMV 5d915b2a9·案②否案①）·死线=11-06 03:30 再触发前（达成）

## §一 · 即办三件（对表裁定卷）

| # | 件 | 落形 | 证据 |
|---|---|---|---|
| 1 | 源形副本入仓（bf414156d 恢复·机位区隔命名） | `scripts/fade/fade-daily-sweep.local.mjs`（65 行=源形 64 行+头注机位区隔防呆行）·值面三锚=CMD_FILE 本机启动器 cmd/OP_ROOT D:/Code 形/PORT 8713·node --check SYNTAX_OK | 施工面 diff（见 §三） |
| 2 | 8713 job command 改指副本 | PATCH cron_mw1rdhym_7pwt→command=`node D:/Code/ai/TriMetaverse/scripts/fade/fade-daily-sweep.local.mjs`·**200 ok**（非 403=白名单生效同窗实证） | job 对象回读（§四） |
| 3 | 仓内现文件（sg 形）零触碰 | `scripts/fade/fade-daily-sweep.mjs` 本笔零 diff（sg 8712 消费面不动·sg 工作区不经本机 push 触碰） | git status 本席两文件外零增 |

## §二 · TriMLC ALLOWLIST 勘定+重启链（要件②）

- **形态勘定**（TriMLC src/server/app.ts 实勘·勿套 8711 先例的勘正在册）：TriMLC **有白名单**=`TRILC_CRON_COMMAND_ALLOWLIST` env 逗号分隔**精确等值**（L260-267·fail-closed 空集全拒）——双门覆盖：POST 造件（L4384）+**PATCH 更新入口同口径拦截**（L4437「P0-3 命令白名单（更新入口）」）——TriMLC 系 TriRLC 代码族 M 面构建形（同族不同实例·白名单键面/值面各自独立）
- **现行值面**（启动器 cmd 活体读数）：19 条目（.fade 族+scripts/fade 族+ops-local 族+watchdog/l1 powershell 族）·末条=旧 command（fade-daily-sweep.mjs）·**零 .local 条目**
- **追加**：程序化精准替换（Temp/sde-allowlist-append.py·CRLF 保真断言 bare_lf=0+字节核算 7158→7296+token 行零触碰 Counter 逐行 diff 断言）·两行 set ALLOWLIST 均追加 `,node D:/Code/ai/TriMetaverse/scripts/fade/fade-daily-sweep.local.mjs`·备份=trimlc-daemon-channel.cmd.bak-20261105T0358Z
- **重启链**（env 进程固化）：POST /shutdown（token 门·ok）→port FREE 显式验（grep RC=1=零监听·管道吞 RC 假绿自避）→**护航自拉实证 +10s 新 pid=13652**（原父链 svchost 计划任务护航族——零手动冷启需要）→healthz 复验 ok·uptime 25s 重置·mc_link 自愈
- **PATCH 200=白名单生效真值探针**（env 未生效则 403 command_not_allowed——非 403 即新 env 在跑实证）

## §三 · 施工面 diff 锚

- `scripts/fade/fade-daily-sweep.local.mjs` **新建**：从 bf414156d 全量恢复（与 sg 形 16+/16- 差异=机位四处+注记行）+头注 L2 机位区隔行（「本文件=.local 副本（本机 8713 TriMLC 形·源形 bf414156d）——禁 sg 化覆盖本文件；sg 形=兄弟文件」）
- `C:/Users/jedih/AppData/Local/trimlc-daemon-channel.cmd`（盘外运行资产·不入仓）：ALLOWLIST 行×2 追加一条件（§二）
- job 面（8713 store）：command 字段单键 PATCH·schedule/systemPrompt/enabled 零触碰

## §四 · 手动触发真验证（要件③·非 dry）

- POST /internal/v1/cron/jobs/cron_mw1rdhym_7pwt/run（force:true）→ `{ok:true,ran:true,reason:"status=ok"}`
- **job 三查**（F-3 家族性对表）：runCount 2→**3**·**lastRunStatus=ok**（error→ok 复位）·**state failed→idle**·enabled=true·nextRunAt=2026-11-05T19:30:00Z（北京 11-06 03:30·schedule 未动重算正确·死线内）·errorCount=1 留痕（今晨 ENOENT 历史面不清零）
- **产出树实证**：`fade011-daily-20261105-040253`（北京 04:02:53·与 lastRunAt 20:02:53Z 秒级对表）·reports 七件全谱·close-output.json **verdict=APPROVED·score=100（阈值90）·required_all_passed=true·hash_match=true**——与 214104 族正态同构
- 改前基线留痕（勘定读数）：改前 command=…fade-daily-sweep.mjs·state=failed·lastRunStatus=error（今晨 03:30:22+08 ENOENT 81ms·裁定卷根因对表）·runCount=2/errorCount=1（11-04 午后源形 ok 343ms 旁证自洽）

## §五 · 流程教训（要件④·候域知识入册）

**改仓内共享脚本前先勘双机消费面**——全域 grep job command 引用（TriMLC/TriRLC 本机双 store+sg TriMMC/TriRMC 面）+codegraph callers——本缺陷=sg 化改写（935838591·ew 工序3⑤）时未勘本机 8713 job 指向同仓路径=并行窗互踩族变体（写入面纪律缺口）。候入册条目名（候选）：`shared-script-cross-plane-consumer-sweep`——正形=共享面脚本改动前三查（哪机消费/哪 daemon job 引用/哪 cwd 语义）。

## §六 · 使用依据

- CTO 裁定卷（本树 cto-ruling.md·TMV 5d915b2a9）·COO 派令（落款锚 2026-11-04T19:52:39Z·COS 转投 03:52:06+08）
- bf414156d（源形）vs 935838591（sg 化改写·缺陷引入 commit·11-04T17:51:59+08）
- TriMLC src/server/app.ts 实勘（L260-267 白名单谓词/L4370-4510 cron API 五端点）·src/cron/types.ts（CronJob.command 平铺形——TriMLC 勿套 TriMMC payload 嵌套形）
- 8713 活体读数全程 token 只进 shell 变量（D-46 零回显）·启动器 cmd 改动过 CRLF+Counter 断言（cmd-batch-crlf-preservation 纪律同族）
