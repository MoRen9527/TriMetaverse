# P3 验收随附两件顺手勘定卷（SDE·CTO 验收令 16abd9615 随附项）

- sourceOfTruth: 本件（勘定读数卷·非真源）
- syncMode: recon-notes
- lastSyncedAt: 2026-11-04T12:16:55+08:00（date 现查原值·写前锚·04:16:55Z 同锚）
- 令源: CTO P3 验收令 2026-11-04T12:12:20+08（留痕 16abd9615）随附两件——①观察项 audit id6 候勘（非阻塞）②token 成本字段存在性勘定（并入周报·存在性先勘·不指定读不出的口径）
- 状态: 两件勘毕·纯读面零写源码面零部署面

## 勘一：audit id6（b863e067 无前置 debounce-pending 行）根因勘定

**结论：非审计漏记 bug，系 watch.ts「非首见跳变不重复落行」设计语义的审计留白。**

落行条件源码读数（TriMLC src/fade/watch.ts L206-217）：

- L210-212：`debounce-pending` audit 行**仅在变化首见 tick 落行**（判据 `!pending`）
- L208-209：首见后窗内指纹再跳变（`pending.fp !== fp`）→ pending 更新为新指纹但**不落行**（`!pending` 为 false 短路）
- L215-216：同指纹窗未过 → 静默 pending（零审计零日志·事件类型注释明示）

id6 成因链：30s 扫描间隔下，首见 tick（指纹 A·落 audit 行）与窗过触发 tick（30s 后）之间，目录再变（A→B 跳变·恰逢毕报后施工落卷高频窗——FSD/施工 commit 并发正落 docs 面）→ B 的首见不落行 → B 过窗直触发 b863e067 → audit 链中该 run 无前置 debounce-pending 行。

末态面：触发行 detail 完整（created/finalState/gated 全在）·run 本身 APPROVED 合法——**末态正确·仅前置审计链缺行**。补法候选（候 CTO/FSD 裁·我席不擅改源码面）：L209 set 后不论首见与否一律落行，或 audit 行关联 pending.since。

## 勘二：fade run 链 usage/token 字段存在性（三向全谱）

**结论：全谱不存在——FADE run 链当前零 LLM API 成本计量数据，周报成本面如实报「读不出·零字段」。**

| 勘向 | 对象 | 读数 |
|---|---|---|
| ①产物文件面 | fade011-ew-runs 全 8 run 树（plan/dce/qualify/score/verify/close 报告+close-output.json） | grep usage/token 全量**零命中** |
| ②DB 面 | fade.db 六表（fade_runs/transitions/gate_rejections/watch_state/watch_audit） | schema 列名全谱**零 usage/token/cost 类列**；值面抽验：checkpoint 嵌 JSON=segment/at/treeDir/reportsDir 路径面零 token·LIKE '%token%'/'%usage%' 三表零命中 |
| ③日志面 | channel.log（trilc-channel） | usage 零命中；token 唯一命中=`[trilc:keys]` 解密失败告警行内 JSON.parse 错误消息词「Unexpected token」——**非成本计量字段** |

机理对表：watch 触发的 run 链=daemon 本地编排（createAndDriveRun 落树+状态机驱动）+gate 机械门拒+skill 双席直读 SKILL.md——**全程不调 LLM API·无 usage 数据产生点**。首周成本面=触发观察本身（磁盘 IO+审计行），模型调用成本=零。

## 附注

- 勘定零写面声明：TriMLC 源码/部署面零触碰·fade.db 只读打开（readOnly: true）·channel.log 只读 grep 值面掩码
- 周报并入建议：触发量现势读数（OBS2 纪律·引 fade_watch_audit 现势）+成本面一句「run 链零 LLM API 成本字段（三向勘毕 2026-11-04）」
- D-23 对照：本勘=一般读面任务直跑（无排程前置）·D-29/D-30 不触（无计划任务·无部署位脚本写入）

---

落款：2026-11-04T04:16:55Z（date 现查原值·与 lastSyncedAt 同锚）
