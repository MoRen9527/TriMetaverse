# 绩效复活 · 执行编排卷（BOD 23:41 裁断「按你案执行」·备案件）

- sourceOfTruth: 本件（trees/performance-scoring-revival-01/coo-orchestration-20261007.md）
- syncMode: static
- lastSyncedAt: 2026-10-07 23:5x +0800（实勘毕成卷；date 现查 23:41 BOD 裁断信）
- 编排席: COO 小营（排程域；裁决源=BOD 23:41 四件裁断+CHO 校准语义修正并入）
- 性质: 制度复活=执行 CEO 已批制度（2026-09-18 生效）非新制——BOD 裁毕事后呈报知情制
- 硬时点: **W41 首跑=本周日 10-11 21:00**

## 一、job 参数（挂载单）

| 字段 | 值 | 依据 |
| --- | --- | --- |
| name | `performance-sunday-settle` | 正身周期语义 |
| schedule | `{kind:'cron', expr:'0 0 21 * * 0', tz:'Asia/Shanghai'}` | 周日 21:00（BOD 令时点照录）；六段 expr 同构现役 `plane-shift-local-align` |
| command | `node D:/Code/ai/TriMetaverse/scripts/fade/performance-sunday-settle.mjs` | scripts/fade 形态同构 `tree-node-patrol`/`joint-review-remind` |
| enabled | true | — |

## 二、挂载序（实勘现形全带·含白名单缺口如实）

实勘（2026-10-07 23:4x 活体）：TriMLC 8713 在役（jobCount=8），cron 白名单 `TRILC_CRON_COMMAND_ALLOWLIST`=**10 条逗号分隔精确全串比对**——新脚本路径不在册，POST 新 job 命令若不加白名单会被拒（TriRLC 家族纪律同门）。挂载序五步：

1. **脚本落位**：`scripts/fade/performance-sunday-settle.mjs`——照 `joint-review-remind.mjs` 三钉 contract 克隆（①anchor-check failure speaks：需求池/台账定位失败→error notify never silent skip；②send-failure not marked notified：STATE 只在 sendNotify resolve 后写；③parse-failure never crashes：process exits 0 always）；STATE/LOG 落 `.fade/tmp/`+`.fade/probe-logs/` 同构。
2. **白名单追加**：启动器 `trimlc-daemon-channel.cmd` 的 ALLOWLIST 追加一项（精确全串=§一 command 值，零变形）。
3. **8713 优雅重启**：`trilc stop/start` 权威路径（禁裸杀·pidfile 对名址·双 daemon 主机 stop 前验监听 pid==pidfile pid）——**候重启窗，避开 10-08 全日窗**（合一施工占用+TriModel 重启在窗，daemon 面不动），建议窗=10-09 白窗或 10-10 联审（12:00）后；10-11 21:00 首跑前闭合。
4. **值面验证**（重启窗完工判据·POST 201≠会触发家族缺陷防线）：jobs 列表 GET 断言 job 在册+`nextRunAtMs` 值面非空且对表 10-11 21:00；空则 PATCH 同值 schedule 触发 recompute 补值（API 正途禁手写库）。
5. **首跑观察**：10-11 21:05 核 LOG+STATE 值面（notified 态+BOD 收信）。

## 三、叫醒设计（通道现形如实·两动作）

- **通道现形（实勘 23:4x）**：`sendNotify targets=['bod']`=唯一实证形态（seats.json 全员 `bod-addressable:false`·三席信箱直寻址未实证）；toast=兜底网；pipe 主道=COO 在席转告（joint-review-remind 先例口径照录）。
- **job 动作**：notify BOD（title「绩效周日结算窗到」body=W41 周指针+两动作提醒）+toast 兜底+STATE 记 notified——job notify BOD 即正身「呈 BOD 观察」输出条款的机械落地。
- **转告链（pipe 主道）**：本席自醒（会话级 cron 10-11 20:55 另挂·候首跑窗）→21:00 job 触发后本席读数核（LOG/STATE）→SendMessage 直达 CHO+COS（席位直达=本席实证通道，10-07 三信全 success）。
- **叫醒文本（两动作）**：
  - →CHO：「绩效周日结算窗到（W4x）——请办周期结算：效率源=当周每日读数行 `[scoring-eff]` 行汇引；成本源=BUDGET_CHECK 触线台账（CFO 面现役留痕直引）；事件账=当周树卷事件按正身四要素计分。毕报落当周经营记录 `scoring-ledger-w4x.md`+知会 COS 收口+回执 COO。」
  - →COS：「绩效结算收口窗到——CHO 结算毕报（scoring-ledger-w4x.md）落当周经营记录收口+呈 BOD 观察（正身输出条款）。」

## 四、供料行格式（零新增流程·正身「账面记录为据」原则内）

- **效率源行**（本席供料位·挂每日读数行）：
  `[scoring-eff] W4x | 席位 | 事件族（时限未达/返工/BLOCK）| 令文或任务锚 | 状态（成立/候选/否·裁据一句话）`；无事件日写 `[scoring-eff] W4x | 无`。周日 CHO 铸账直接汇行，零回问。
- **成本源**：不新设格式——CHO 结算直引 BUDGET_CHECK 触线台账（CFO 现役留痕形态），CFO 侧零新增动作；编排只钉「结算取数位=BUDGET_CHECK 触线台账」。
- **事件账（加分/豁免）**：沿 W40 账面既有形态（裁据链三段式·源席验席分离），零新设。

## 五、校准语义修正并入（CHO 修正案照 BOD 裁并入）

- **10-18 校准窗：只校节律与供料通道运行态**——job 是否触发/供料行是否在跑/结算是否闭环（机制面）。
- **数值档位校准（2/3/5）：候 W42-W43 完整周期读数**（正身「首月试运行后校准」语义对齐），候 CEO 批条款不变。

## 六、执行序总览（BOD 裁断序照录）

CHO W40 挂账补录（COS 主办在办·不阻塞挂载）→ 脚本+白名单+重启+值面验证（候窗·§二五步）→ W40 补结算（候 CHO 窗）→ **10-11 21:00 首跑**（首跑后本席读数核+CHO/COS 转告+呈 BOD 观察）。

## 附注（如实呈报两笔）

1. `joint-review-demand-pool` job（周六 12:00 联审提醒·`joint-review-remind.mjs`）**在册但 enabled=false**——非本卷范围不擅动：若是刻意 disabled 忽略本条；若无主，候示下是否同批复活（联审自醒现由本席会话级 cron 557d5922 过渡承载）。
2. 本卷=BOD「备案即走」备案件；挂载施工（脚本+白名单+重启）候窗执行，首跑 10-11 21:00 硬时点。

## 使用依据

- BOD 23:41 裁断信（四件采认+CHO 校准修正并入+执行序+备案即走令）；BOD 23:21 盘点令与 23:26 认收信；正身 `TriCompany/docs/workflow/performance-scoring-workflow.md`（2026-10-07 实读）；`2026-W40/scoring-ledger-w40.md`（账面形态参照）。
- 活体实勘（23:4x）：8713 healthz（trimlc·jobCount=8）；jobs 列表 8 job 全形态；ALLOWLIST 10 条值面；`joint-review-remind.mjs` 三钉 contract+通道现形注释；`notify-sender.mjs` resolveNotifyConfig/sendNotify 形态。
