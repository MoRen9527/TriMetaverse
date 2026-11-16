# FSD W2 基线锚卷（护栏②·施工前现役评分面 dump 留档）

- sourceOfTruth: 本卷（trees/fade001-loop-joint-review-W2/·W2 施工基线锚正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd·实现交付面）
- 落款: 2026-11-16T04:13:18Z（+8=2026-11-16 12:13:18·date 现查原值粘贴）
- 法源链: COO W2 派工触发令（msg 6cf048fa·12:03:32·台账 676 收稿）→W1 架构卷 a97d76af7 §二契约+§五施工接口→排工单 v2 dc8ce2231 护栏②基线锚先行
- 勘面: 河源活体（ssh -J M-SG R-HY·/var/lib/trirmc/cron/runs/ + /srv/fleet/TriRMC/data/cron/jobs.json）+ 本机 TriCompany/TriRMC 检出（本机 TriRMC 顶=e408da5 与河源同顶·非分域落后检出实锚）

## §一 · 现役管线链（weekly-plane-shift job payload·25 行全链 dump）

run_id 形=`shift-W{fromWeek}-<YYYYMMDDTHHMMSSZ>`（score_engine _RUN_ID_RE 同族）；**run_dir=/var/lib/trirmc/cron/runs/<run_id>**（非 /srv/fleet/TriRMC/data——store data 位与 run 产物位分立实锚）。

段序（payload 25 行摘句面·{fromWeek}/{toWeek}/{startDate}=TriRMC command-handler 占位符展开）：

| 行 | 段 | 模块 | 产物 |
|---|---|---|---|
| L1-3 | 守卫 | set -eo pipefail + trap → shift_notify_fail --chain-exit（失败告警面） | — |
| L4 | run 位 | RUN_ID+RUN_DIR=mkdir | run_dir 建 |
| L7 | ①闸 | preflight（算周双闸/hostname/git_hygiene/healthz/diverge） | preflight.json |
| L13 | ② | qualify | qualify.json |
| L14-16 | ③ | TC/TMV pull ff-only（|| true 非硬闸） | — |
| L17 | ④ | plan_scope | plan.json |
| L18 | ⑤ | dce_steps --execute | dce.json |
| L19 | ⑥闸 | verify --strict | verify.json |
| L20 | ⑦ | score_cli（三态路径分立·rc∈{0,2} 放行） | score.json |
| L21 | ⑧ | score_rubric（rubric-firstshoot.json→rubric_report.json） | rubric_report.json |
| L22 | ⑨a | close_skill | close.json |
| L23 | ⑨b | close_cli（七段对表→manifest.json·三态 run_state） | manifest.json |
| L24 | ⑩ | notify_done | notify_done.json |
| L25 | ⑪ | arrival 时戳 | arrival.json |

## §二 · 现役评分面产物值面（第 10 轮 loop 实锚 run·shift-WW46-20261116T002143Z·今晨 00:21 跑·manifest run_state=ok 全七段 pass）

run_dir 十四件实物：preflight/qualify/plan/dce/verify/score/collection-score/subjective-score/cos-plan-judgments/rubric_report/close/manifest/notify_done/arrival。

1. **score.json**（score_cli→score_engine v2.0.0 并盘 100 形·engine_state=executed_ok）：families 九族读数——MACHINE_FAMILIES=(B,C,D,E,G) 机判·MANUAL_FAMILIES=(A,F,H) score=null 值席采集域（考卷 collection_cmd+special_clause 引用如实载）·SUBJECTIVE_FAMILIES=(I)。总分三域直加制。
2. **collection-score.json**（值席采集卷·judge_seat=m-duty-cos·CAO 评估单排班形·r118① CEO 首采令）：A/F/H 三族 entries 二值 verdict（pass 形）+weight+rationale+evidence_ref。A 族判据载荷 md5 基准=4e1c7df5c78e083a77a0be7f2a371672（十一轮零漂移）+换形注机制在卷。
3. **subjective-score.json**（值席主观卷·I 族 10 分·规程 c 形）：rubric_ref=ste-subjective-exam-paper-20261115.md+anchor_verdict+entries（criterion/score/rationale/evidence_ref）。
4. **cos-plan-judgments.json**（COS 规划判读卷）+**rubric_report.json**（判据报告）。
5. **notify_done.json**：notify_done_version/run_id/from_week/to_week/run_state。

## §三 · 通道与接缝定谳（W2 施工接线对象）

1. **触发段接缝位**=close_cli（L23）后·现役 L24 notify_done/L25 arrival 之间——W1 架构卷§三定谳「manifest close 段 pass 后收口段·r88 异步形废止」（同步管线内段·非轮询）。
2. **循环控制 POST 通道**=`POST /internal/v1/cron/jobs/weekly-plane-shift/run`（TriRMC 8710·routes.ts L71-75·鉴权头 **X-Internal-Token** 非 Bearer）。
3. **周日门豁免 marker**=TRICO_LOOP_MARKER_DIR（/var/lib/trirmc·unit drop-in 在役 4a05c74f）下 loop-window.marker——preflight.py L260 读入·one-shot 读即删·LOOP_WINDOW=1 env 双通道。
4. **notify 通道现役**=shift_notify_fail（失败·trap 面）+notify_done（成卷·notify_done.json 落卷）——触发段 notify 对表此族。

## §四 · 关键坑位标记（施工约束·技术债如实）

1. **payload md5 基准联动**：A 族 collection 考卷判据=「payload 十阶段形 md5 基准 4e1c7df5 零漂移」——触发段接线若动 weekly-plane-shift payload command，须同步落**换形注**（先例机制在卷：vB 基准→十阶段形基准替换 special_clause+值席采集卷新基准落卷）——禁无注改 payload（判据错配族=假红）。
2. **payload 变更通道**：jobs.json 经 TriRMC PATCH API（/internal/v1/cron/jobs/{id}）或 store 直改面—— TriRMC 面无 TriRLC 式 command ALLOWLIST 精确等值门（routes.ts 勘定·PATCH 即改）——但 nextRunAtMs 等字段禁抹（cron-job-state-hygiene 记忆锚同族适用）。
3. **非推翻现役**：W1§五定谳施工=触发段/召集段新件+回收段接线扩展——score_engine/close_cli 现役模块零改动（回收段=新模块读卷汇总非改引擎）。
4. **分数线/轮数/quorum 三参数现势**：轮数 3 轮+quorum≥5/7 径裁（COS 台账 676 采认）·**分数线留参**（W2 毕验收窗 CTO 主裁 COO 会签）——回收段分数线读参数位（default 待裁值+env/参数文件覆盖形）不硬编码。

## 使用依据

- COO 派工令 msg 6cf048fa（12:03:32）+W1 架构卷 a97d76af7+排工单 v2 dc8ce2231+台账 676（ddbff5893）
- 河源活体勘四轮（jobs.json 四 job 现役/编排 25 行全 dump/run_dir 十四件实物/评分卷值面）+本机 TriCompany cognition 评分族源码（score_engine.py 455 行/close_cli.py 99 行/score_cli.py 116 行/preflight.py 353 行）+TriRMC routes.ts 160 行
- 记忆锚族：cron-job-state-hygiene/活体优先诊断法/判据错配族（禁 vB 互判先例）

—— FSD 小全（m-fsd）·2026-11-16T04:13:18Z（+8=2026-11-16 12:13:18·date 现查原值·D-47 正形）
