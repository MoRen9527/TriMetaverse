# FADE-011 Phase 2 · S1 派工 brief（Run 生命周期持久状态机）

- sourceOfTruth: 本 brief（树内派工正身·施工读数归节点报告 node-fsd-s1.md）
- syncMode: write-time（D-15 分派面·FSD 接令回执后施工）
- lastSyncedAt: 2026-11-04T01:45:21+0800（date 现查原值）
- 派工席: CTO 小狄（D-15 分派枢纽）
- 施工席: FSD（接令回执→施工→节点收口）
- 令源: COS 2026-11-04T01:44:12+0800 两裁传达+S1 启动令（裁①承载面=TriMLC@8713 采认·裁②排期单 cd1a13f6c 准·生效·「S1 施工即启·不再候 CEO」）
- 排期单正身: `docs/execution/fade-011-automation-phase2-plan-20261103.md`（cd1a13f6c@dev）
- 法条锚: `TriCompany/docs/engineering/fade-protocol-spec.md` §8.1 十段链（唯一法条锚·schema 文本须附 spec 行号引）

## 一、任务面（S1=排期单缺口②·状态机）

1. TriMLC daemon 侧新增 FADE run 生命周期持久状态机：十段态（QUALIFY→PLAN→DCE→VERIFY→SCORE→CLOSING→终态，以 spec §8.1 正身段名为准）+ run 元数据持久化到 daemon store（**独立键空间**）。
2. 段态迁移函数：合法迁移表 + 非法迁移拒断言。
3. 恢复策略立法先行（排期单 §七 风险②）：段幂等者续跑·非幂等者回退 CLOSING——S1 内定谳，写入 spec 候批（候批件不阻 S1 施工·只候 spec 修订批程）。

## 二、门禁（S1→S2 gate·排期单 §四）

- 状态机 schema 冻结（文本附 spec §8.1 行号引）
- 段态迁移单测：合法路径全覆盖 + 非法迁移拒断言（至少三例：跳段 / 回退未授权段 / 终态再迁移）
- 全部单测 RC=0 过

## 三、前置已办（派工席落实读数）

- 8713 healthz 活体现探 ✓（2026-11-04T01:45:21+08 现探：ok=true · uptime=76346s · cron 16 jobs degraded=false · consecutiveFailures=0）
- 承载面定谳=COS 裁①采认（TriMLC@8713·TriRLC@8711=R 面不涉）
- LG-069 电源告警同窗核查：宿主睡眠窗 23:16:57→01:37:44（~2h20m）致 powerMonitor 读取失败·唤醒后 readFailures=0 已自愈·闸 gate=none 正常——零干预定性·不阻施工

## 四、施工纪律

1. 独立键空间：run store 与现役 cron/job 配置隔离——零触碰现役 job 配置（排期单 §六 回滚姿态条款）。
2. D-65 四族十三条写码自查（`TriCompany/docs/workflow/code-review-standards.md`·CLI 入口件必过族三五查）。
3. 节点收口：`node-fsd-s1.md` 按 spec §2.7 九键机读核心写（nodeId/agent/startedAt/finishedAt/baselineCommit/trigger/actions/artifacts/gateResults）·收口过 `scripts/node_report_check.py`（015bab659 现役·编排层 `--tree-dir` 复跑门）。
4. 写后即 commit 锁笔（共享仓纪律）·commit 尾 `Co-Authored-By: Claude Code <noreply@anthropic.com>`。
5. 排窗已废（CEO 11-03 22:29 令三）：有活就干顺序推进·完成即报·不排窗。
6. Skill 装载双真源预防（S3 才消费·schema 设计时预留）：单一装载通道=daemon 读 skill 文件，禁内嵌副本。

## 五、D-15 回执链

- FSD 接令 → 回执确认接手（SendMessage → m-cto）→ 施工 → gate 读数（单测 RC + schema 文本锚）→ 节点报告落树 → 收口双门（node_report_check RC=0）→ 毕报回 m-cto。
- 验收读数要求：单测**全量读数**（非 head 截断）+ 既有失败逐族归因（全量回归读数纪律）。

—— CTO 小狄 派工（2026-11-04T01:45:21+0800）
