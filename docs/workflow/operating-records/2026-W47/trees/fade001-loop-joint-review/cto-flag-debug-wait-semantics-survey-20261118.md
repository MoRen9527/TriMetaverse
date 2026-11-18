# notice-199 勘定卷·flag=debug 等待语义四点（CTO·CEO 22:36 增补令承·196/198 增量段归段）

- date 现查: 2026-11-18 23:0x CST（D-47）
- 勘定人: CTO 小狄（勘定令承·WP9 v3 增量段=notice-196/197/198/199 登记衔接面）
- 勘定形: heyuan 在役权威实锚（TriRMC cron jobs.json weekly-plane-shift payload 全读/四件 loop 源 grep/joint_review_trigger 契约面）——零触现役运行面

## a) 现役 loop 循环体载体与推进控制权（权威实锚）

- **载体**=TriRMC cron job `weekly-plane-shift`（id 9c81c7ec·schedule `50 23 * * 0` Asia/Shanghai=周日 23:50·enabled·runCount 46·lastRunStatus ok·nextRunAtMs=1795362600000=下次周日窗）；
- **推进控制权**=cron 时钟驱动（**非 verdict 驱动**）——十段链=单一 shell payload **进程内顺序推进**：preflight→qualify→tmv pull→plan_scope→dce_steps --execute→verify --strict→score_cli（rc 0|2 容忍）→score_rubric→close_skill→close_cli→notify_done；段间衔接=`&&` 链同 run_dir 落卷（WP4 修正注在 payload 内链注承）；
- 链尾=notify_done 毕→**joint_review_trigger（best-effort·fail 不阻链·log 审计面）**→arrival.json 收卷——联审召集在链尾 best-effort 位，**不参与推进判定**；
- 轮（round）推进=下个周日窗自动／人令加跑（runs/ 同形 run_id 家族·ns1/ns2 即人令加跑形）——**CEO 裁决现役零介入推进**（缺口即本令问点正体）。

## b) flag=debug 现状语义（程序内勘定）

- **程序内零 debug 分支零等待点**：weekly_plane_shift.py／loop_convene.py／loop_convene_auto.py／joint_review_trigger.py 四件源 grep debug=**零命中**（现勘）；
- 现役「debug 态停点呈批」=**组织层人工形**：convene letters 渲染（verdict+run 上下文·loop_convene.py build_convene_letters）→值席值守拾取发送→七席评分 sheet→aggregate 初判（缺席如实标注）→**人联评终审签认位（r119④ 防线双层）**——等待发生在组织层（值席/BOD 盯守呈报），**进程不等待**（跑完即退·cron 照走下窗）；
- 判：CEO 语「flag=debug 等待输入」在现役程序内=**无此语义**；等待语义=会话层人工停点形属实（呈批链在 convene 段后·线外挂起）。

## c) 等待输入机制三形勘定（verdict 落卷后挂起等 CEO 裁决）

裁决真值源共同前提=**签批件落卷**：`run_dir/ceo-ruling.json`（{decision: continue|terminate, ruling_ref, signed_at}·值席经 BOD 通道落卷·sha 留痕·D-47 签批时点）。

| 形 | 机制 | 勘定 | 判 |
|---|---|---|---|
| ①轮询形 | cron tick 读裁决文件（现役 rmc-orchestrate-tick `17,47 * * * *` 可宿·或下轮 gate 内 probe） | 实现最小·合现役 fail-closed 文化·零新组件 | **荐（作探测机制）** |
| ②事件形 | 文件监视/daemon 订阅真事件 | 现役无 in-loop 事件面——TriRMC cron `every` kind=轮询换装非真事件；需新增 watcher 移动件 | 不荐（零净收益） |
| ③轮间分离形 | 轮推进门=下轮 preflight 读上轮裁决文件：缺席→`awaiting-ruling` skip（cron 照走下 tick 再探） | 最小侵入零新进程·复用 preflight 分叉闸模式（现役 P1 改点 A 同构）·「门不豁免」哲学合 | **荐（作主形）** |

**荐形=③主形（轮间分离门）+①探测机制（门内轮询）**——互补不冲突。

## d) 程序化等待形设计（荐案正身·候裁）

1. **等待点**：链尾 close/notify 毕·joint_review_trigger 落 verdict+aggregate→run_dir 置 `round-state=pending-ceo-ruling`；
2. **输入源**：`run_dir/ceo-ruling.json` 落卷即输入（值席执行落卷·签批 sha）；
3. **超时缺省**：**候裁不超时（fail-closed：无裁决=不进下轮）**；升级形=3 天无裁决→gate 升级 notify 催办（照 BOD 缺位缓存协议形·循环保持挂起不自行推进）；
4. **下一轮判定**：gate 三态——absent→skip 续探／continue→本轮照跑（carry_over 承接）／terminate→落 terminated 态+job 停用（值席执行 cron disable）；
5. **兼容面**：人令加跑=裁决文件预置形（手工预填 continue）——现役手动轮形**零回归**；改动面=preflight 增一可选 gate 检+trigger 增 round-state 字段，**job payload 结构零改**；
6. **WP9 v3 归段**：notice-196（preset 组合修复=已闭合·复验 027c7e913）／197／198（程序化工作流增量）／本 199（等待语义）四令登记衔接——施工候令（SDE/值席面）。

## 使用依据

heyuan 在役实锚：/srv/fleet/TriRMC/data/cron/jobs.json（weekly-plane-shift payload 全读+state 面）；weekly_plane_shift.py／loop_convene.py／loop_convene_auto.py／joint_review_trigger.py 源 grep+契约面现勘；notice-199 令原文；r119④/告示面承录；D-24/D-46/D-47 纪律。
