# node-fsd-uat · FADE-011 实用化验证（现役 8713 真 run 三条）节点收口报告

```json
{
  "nodeId": "node-fsd-uat",
  "agent": "FSD",
  "startedAt": "2026-11-03T19:58:36Z",
  "finishedAt": "2026-11-03T20:09:06Z",
  "baselineCommit": "TMV@dev c51baeec5 (brief 正身) + TriMLC@dev d7129a1 (Phase 2 五工序交付链 HEAD)",
  "trigger": "CTO 小狄 D-15 派工令（信面落款 2026-11-04T03:57:52+0800·令源=COS A 件径裁① BOD 授权 COS 域径裁）·FSD 接令回执 msg_id e691f88f Δ44s·本行 startedAt=接令回执起算",
  "actions": [
    "①现役 8713 受控重启第一遍（SOP 全链逐步断言）：cron idle 勘（16 jobs·无 state=running）→ TriMLC-Watchdog Disable → POST /shutdown（token 门·根路径）→ 验 pid 1312 退出 + port 8713 FREE → npm run build（dist 加载面勘定：启动器跑 node dist/index.js·重启前必须构建·brief §三.3 偏差如实注记）→ Start-ScheduledTask 冷启 → pid/CIM 对表（新 pid 28832=node.exe）→ healthz ok=true + uptime 重置断言 → 新端点 fail-closed 探针（POST /internal/v1/fade/runs 无 token=拒·零真 run 触发）",
    "②真 run 01 触发：POST /internal/v1/fade/runs 带 token 真身触发 fade011-uat-01 → 十段驱动至 FINALIZING → 收口门拒（spawn python ENOENT：启动器 PATH guard v2.1 钉死无 python·gated=false 卡 FINALIZING 不可达——S4 fail-closed 防线真环境实战成立）",
    "③环境修复（根因修非补丁）：勘 TRILC_ENV_FILE 消费面（src/config/env.ts loadEnvFileFallback 不覆盖已存在进程 env·启动器未设 TRILC_FADE_PYTHON 键）→ D:\\Code\\ai\\.env 追加 TRILC_FADE_PYTHON=C:\\Python312\\python.exe → 第二遍受控重启同链全步断言（pid 28832→32876）",
    "④boot sweep 恢复实战：boot sweep 识别 run 01 in place FINALIZING（checkpoint present）→ S5 resume 挂点从 FINALIZING 直跑收口门 → 门过 APPROVED（channel.log 三行形：resumed in place / swept=1 resumed=1 / attempted=1 terminal=1）——恢复即重验全链真环境走通",
    "⑤真 run 02/03 触发：POST 真身触发 fade011-uat-02/03 → 一次直达 APPROVED（HTTP 200·0.1227s/0.1242s·gated=true·segmentsRun 九步全谱·门真跑 checked=6 failed=0）",
    "⑥完工判据五断言全谱：三 run 全 APPROVED（fade_runs 终读）+ 逐 run 编排层门 RC=0×3 + rejection 面 1 行历史 spawn-error（已归因已恢复·如实注记）+ unfinished_residual=0 + 现役栈零副作用（fade 面数据全落 fade.db 独立库·sessions.db/cron.db schema 零 fade 表·cron job 清单 before/after-restart/终三对照 16 jobs id_set_identical + enabled_face_identical）",
    "⑦SOP 收尾：TriMLC-Watchdog Enable（State=Ready）+ healthz 终读（ok=true·pid 32876·uptime 243s·power acOnline=true gate=none）",
    "⑧本报告落树 + runs/ 三树产物收口双门"
  ],
  "artifacts": [
    "runs/fade011-uat-01/reports/（六件九键真身落卷：qualify/dce-output/plan/verify/score/close）",
    "runs/fade011-uat-02/reports/（六件同形）",
    "runs/fade011-uat-03/reports/（六件同形）",
    "reports/node-fsd-uat.md（本报告）",
    "D:\\Code\\ai\\.env 追加两行（TRILC_FADE_PYTHON=C:\\Python312\\python.exe·跨仓 env 面·非本树 artifact 如实记档）"
  ],
  "gateResults": [
    {"gate": "完工判据①三 run 终态", "result": "PASS", "detail": "fade011-uat-01/02/03 全 APPROVED（fade_runs 终读三行）"},
    {"gate": "完工判据②逐 run 收口门", "result": "PASS", "detail": "node_report_check --tree-dir 三树 RC=0×3"},
    {"gate": "完工判据③rejection 面", "result": "PASS（注记）", "detail": "fade_gate_rejections 1 行=run 01 spawn-error（2026-11-03T20:02:42Z·已归因 PATH guard·已恢复·历史行非新增异常）"},
    {"gate": "完工判据④boot sweep 无残留", "result": "PASS", "detail": "unfinished_residual=0（终态外 run 计数）"},
    {"gate": "完工判据⑤现役栈零副作用", "result": "PASS", "detail": "fade 面数据全落 fade.db 独立键空间（fade_runs/fade_run_transitions/fade_gate_rejections 三表）·sessions.db/cron.db schema 零 fade 表·cron 16 jobs 三对照一致（id_set+enabled_face）"},
    {"gate": "终态审计面", "result": "PASS", "detail": "fade_run_transitions actor=finalize 三行：run01 seq=10 / run02 seq=20 / run03 seq=30 均 FINALIZING→APPROVED reason='closing gate PASS (§2.7 RC=0)'"},
    {"gate": "新端点 fail-closed 探针", "result": "PASS", "detail": "POST /internal/v1/fade/runs 无 token=拒·零真 run 触发"},
    {"gate": "重启链 SOP 全步", "result": "PASS×2", "detail": "两遍重启链逐步断言全绿（watchdog Disable→shutdown→port FREE→冷启→pid/CIM 对表→healthz+uptime 重置→探针→watchdog Enable 收尾）"}
  ]
}
```

## 实现方案

现役 8713 受控重启加载 Phase 2 代码（勘修窗 2026-10-11 同形 SOP）→ 真 run 三条真身触发走十段全自动 → 完工判据五断言 → SOP 收尾。重启链两遍（第一遍揭出环境面缺口·第二遍全绿+boot sweep 恢复实战），真 run 三条全 APPROVED，现役栈零触碰。

**关键发现——dist 加载面**：brief §三.3「工作区检出即重启加载源」勘的是检出状态；实际加载面=schtasks 启动器跑 `node D:\Code\ai\TriMLC\dist\index.js`（构建产物非 src）→ 重启前必须 `npm run build`。本次执行即按此序（build→重启），Phase 2 交付件全部加载生效。偏差如实注记，非阻判据。

**关键发现——PATH guard 与 TRILC_FADE_PYTHON**：brief §二.3「TRILC_FADE_PYTHON 缺省 python 本机 PATH 在」勘的是交互 shell PATH；daemon 宿主启动器 PATH guard v2.1 钉死四路径无 python → run 01 门拒 spawn-error 实战。修复走 `.env` 注入（TRILC_ENV_FILE 消费面·`loadEnvFileFallback` 不覆盖已存在进程 env·启动器未设该键 → .env 值生效），侵入面小于改启动器 cmd（LG-033 byte-exact 禁改域）。此修复路径=sg 机部署同路（env knob 一设即移植）。

## 异常与处置

1. **run 01 门拒（spawn python ENOENT）**：处置=根因勘定（PATH guard）→ .env 修复 → 第二遍重启 → boot sweep 从 FINALIZING 恢复 → 门复跑 APPROVED。S4 fail-closed 防线真环境实证（门拒→卡 FINALIZING 不可达→rejection ledger 落行）；S5 resume 挂点实战验证（恢复即重验全链）。
2. **D-46 值面触碰自报（本席行为面）**：勘 .env 结构时用 `grep -nE "^# "` 意图只查结构，但把含密钥的注释行**值面**全文带出（输出进 transcript）——违「含密值面禁进打印路径」。处置：后续键查询改 `grep -c "^KEY"` 计数形；此条如实自报入技术债标记，候 D-46 族谱登记。
3. **宿主睡眠干扰**：brief §二.4 预案（睡眠中断→checkpoint resume 续跑）。实际三 run 窗（04:01-04:05 本地）全在 awake 窗·零睡眠中断——预案未触发，如实记。

## 断点交接

- 现役 daemon=pid 32876（healthz ok=true·uptime 243s@终读·Phase 2 代码已加载）·TRILC-Watchdog=Enabled（State=Ready）·.env 含 TRILC_FADE_PYTHON。
- fade.db 三 run 全终态 APPROVED·unfinished 零残留·rejection 1 行历史（run 01 spawn-error）。
- **§六门拒重试通道意见（并入毕报）**：本席同意 CTO 初步意见=不立自动重试轮维持现形。UAT 实战支撑：本次门拒根因=环境缺（python 不在 daemon PATH）——自动重试对此根因无效（重试 N 次仍 ENOENT）；真恢复路径=修环境→重启 boot resume→门复跑，已实战走通且可见性闭环（rejection ledger+resume stopped 日志+boot sweep 三显面）。门拒根因几乎总需人工/上游介入，自动重试对真根因无效反添重试噪音面。
- 后续工程项（非本单）：event-watch 自动触发（automation-backlog·排期单 §8.6 定谳）·plan skill 正身接线（tri-fade011-plan 候件·B 件 CAO 立法在途——本单 plan 段=程序化 MVP 如实划线）。

## 自测结果

- 完工判据五断言全过（读数见 gateResults 八条·全部真身真环境）。
- 三 run 逐条：run01=APPROVED（经门拒→恢复通道·终审计 seq=10 20:04:11Z）·run02=APPROVED（一次直达·0.1227s·seq=20 20:04:50Z）·run03=APPROVED（一次直达·0.1242s·seq=30 20:04:50Z）；每 run segmentsRun 九步全谱 QUALIFYING→…→APPROVED·gated=true·门真跑 6 报告 checked=6 failed=0。
- cron job 清单 before/after-restart/终三对照：16 jobs·id_set_identical=true·enabled_face_identical=true（零漂移）。
- 现役栈零副作用：fade 面数据全落 fade.db（fade_runs 3 行/fade_run_transitions 30 行/fade_gate_rejections 1 行）；sessions.db/cron.db schema 扫 fade 字样零命中。

## 技术债务标记

1. **D-46 值面触碰自报**（异常节第 2 条·本席行为面·非代码）：grep 模式选型失误致注释行密钥值面进 transcript——纪律在案（正形=计数形 grep -c·值段全替掩码）·候族谱登记。
2. **plan skill 候件**（承袭 S5）：tri-fade011-plan 正身立法在途（B 件 CAO）·现 plan 段=程序化 MVP 产物——接线候正身。
3. **门拒重试通道**：本席意见不立自动重试轮（§六同·理由见断点交接）·候 automation-backlog 排窗随案例复盘终裁。
4. **python env knob 部署面**：本机 .env 注入实战走通——sg 机部署时同路（env 一设即移植）·候 sg 侧窗。
5. **brief 环境面读数偏差两处**（dist 加载面/daemon PATH guard）：非代码债·勘读方法论记档=「环境面读数须分交互 shell 与 daemon 宿主两谱勘」。

## 使用依据

- 派工 brief 正身：`docs/workflow/operating-records/2026-W45/trees/fade011-uat-live-run/brief.md`（TMV c51baeec5）
- Phase 2 交付链：TriMLC d7129a1（driver/app/两 test 四件 1003 行）
- 法条：fade-protocol-spec §2.7（收口门）/§8.1（十段链·批认 be0fe20）/§8.6（event-watch 现役件）
- 重启 SOP 同形：勘修窗 2026-10-11（trimlc-repair-window-20261011 记忆条）
- 纪律：D-47（时戳·卷面=commit 时戳代）/D-46（值面）/D-29（计划任务无窗）·排窗废顺序推进
