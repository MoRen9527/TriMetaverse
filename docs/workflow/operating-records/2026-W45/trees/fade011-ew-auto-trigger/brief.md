# FADE-011 event-watch 自动触发 · 立窗工程派工 brief（automation-backlog 立窗·径定通道）

- sourceOfTruth: 本 brief（树内派工正身·施工读数归节点报告 node-fsd-ew.md）
- syncMode: write-time（D-15 分派面·FSD 接令回执后施工）
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形 e56206f 现役）
- 派工席: CTO 小狄（D-15 分派枢纽）
- 施工席: FSD（S1-S5.1+UAT 交付链作者）
- 令源: COS+CTO 径定（04:16:43 COS 肯·BOD 03:51 授权通道·已落台账）——「S5.1 plan 接线毕且 gate 绿→再启动 event-watch 自动触发工程立窗」；S5.1 gate 绿（本席 APPROVE ccced6b2a·04:26:33）=立窗触发点达成
- 法条锚: spec §8.6（event-watch 触发探测——现役件形态 FSD 施工序①现勘）+spec §8.1 十段链批认正身 be0fe20+排期单 cd1a13f6c §一出窗申明（本工程=automation-backlog 立窗正式转为现役工程）

## 一、任务面（文件/Git 事件→自动触发 run）

1. **触发面落卷**：文件/Git 事件自动触发→run 创建→十段全自动驱动（经 createAndDriveRun 幂等入口 S5 件·零旁路）——触发探测形态（定时巡检链/即时触发链）按 spec §8.6 条款+现役 event-queue.db 件现勘定谳后落地。
2. **防抖与去重**：同源事件风暴（多文件批量变更/Git 批量提交）→合并触发或幂等跳过——createAndDriveRun 幂等键族语义为底座·防抖窗参数显式化（常量+注释·R2.1 上界同族）。
3. **触发规则显式化**：哪些路径/事件触发哪些 run 形态——spec §8.6 条款为准；条款未覆盖处 NEEDS_CLARIFICATION 升级候裁·禁自行发明触发语义。
4. **失败语义（对齐 A 件③裁语 2026-11-04 定谳）**：门拒**不自动重试**（维持现形）·触发失败/驱动失败=可见性显面（日志+ledger 双显禁静默）·禁重试风暴。
5. **速率护栏**：单位时间触发上限（防事件风暴打爆 fade 键空间·常量显式+超限显式跳过落日志）。

范围划线：TriMLC 内部触发面增强·零模块边界变更（COS 径定授权立窗）； TriRLC 侧承接/多 run 并发等蓝图其余项不入本窗。

## 二、真环境加载面验证（gate 组成·UAT 先例承袭）

1. **受控重启一并加载**：S5.1 件+本窗件一次 SOP 全链加载（本席决策 ccced6b2a：候立窗毕一并重启避免今夜第三次重启——本工序即兑现点）。
2. 重启链=SOP 全步断言（cron idle 勘→watchdog Disable→/shutdown→port FREE→**npm run build**（dist 加载面·UAT 方法论）→冷启→pid/CIM 对表→healthz+uptime 重置→新触发面探针（fail-closed 面+带 token 形零真 run 或受控真 run 显式标注））。
3. 加载面断言：daemon 加载 dist 含 S5.1（plan 段真身化）+立窗件（触发面在）——探针读数落卷。

## 三、门禁（立窗 gate）

1. **自动触发端到端实测**：构造受控事件→自动触发 run→十段全自动→APPROVED（进程级独立实例·独立 DATA_DIR/端口 0 零触现役）。
2. **防抖去重断言**：同源事件批量注入→恰一 run（或幂等跳过读数）·零重复 run 风暴。
3. **失败可见性断言**：触发失败/驱动失败路径→显面（日志/ledger）·零静默零自动重试。
4. **速率护栏断言**：超限注入→跳过+落日志读数。
5. **全量回归**：fade 全家（87+新增）RC=0+stash 基线对照+kill-drive 两轮不破+UAT 三树门 RC=0×3。
6. **真环境加载面**（§二 SOP 全链+探针读数全绿）。

## 四、前置已办（派工席落实读数）

- S5.1 交付链：TriMLC 79c011f（plan 真身接线·87/87）+TMV 9b18564f9——dist 已 build 重启就绪。
- S5 触发面现役：POST /internal/v1/fade/runs（X-Internal-Token fail-closed）+createAndDriveRun 幂等入口+resumeUnfinishedRuns。
- 现役件线索：LOCALAPPDATA/trilc/event-queue.db（+shm/wal）在位——§8.6 现役件承载面 FSD 施工序①现勘定谳（零触读面）。
- 环境面：TRILC_FADE_PYTHON 已注入 D:/Code/ai/.env·宿主睡眠干扰预案同 UAT（遇中断按 resume 语义继续·读数如实注记）。

## 五、施工纪律（同 S1-S5.1+UAT）

1. 独立键空间零触现役（§二受控重启除外·SOP 全链逐步断言·等 cron job 跑毕再 shutdown）。
2. D-65 四族十三条写码自查+D-46 值面零回显（键查询计数形）+D-47 时戳铁则。
3. 节点收口：`reports/node-fsd-ew.md` 九键落树·收口过 node_report_check。
4. 写后即 commit 锁笔·Co-Authored-By·排窗废顺序推进。
5. 全量读数回报+既有失败逐族归因。

## 六、D-15 回执链

- FSD 接令 → 回执确认接手（SendMessage → m-cto）→ 施工 → gate 读数 → 节点报告落树 → 收口双门 → 毕报回 m-cto → 本席验收 → 毕报 COS（立窗工程收口+真环境加载面读数——FADE-011 自动化工程全谱收官线）。

—— CTO 小狄 派工（S5.1 验收同窗·卷面时戳以 commit 时戳为准）
