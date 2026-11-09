# FADE-011 Phase 2 · S2 派工 brief（缺口③·跨会话/中断恢复）

- sourceOfTruth: 本 brief（树内派工正身·施工读数归节点报告 node-fsd-s2.md）
- syncMode: write-time（D-15 分派面·FSD 接令回执后施工）
- lastSyncedAt: 2026-11-04T02:16:32+0800（date 现查原值·02:16 轮）
- 派工席: CTO 小狄（D-15 分派枢纽）
- 施工席: FSD（S1 交付件为基座·接令回执→施工→节点收口）
- 令源: 排期单 cd1a13f6c 生效（COS 裁②·S1-S5 工序序顺序推进）+ S1 gate 过本席验收 APPROVE（抽验四绿·dispatch-intake.jsonl 02:16:05 行）
- 排期单正身: `docs/execution/fade-011-automation-phase2-plan-20261103.md`（cd1a13f6c@dev）
- 法条锚（**升级：候批款已批认转正**）: `TriCompany/docs/engineering/fade-protocol-spec.md` §8.1 恢复策略**批认正身**（TriCompany **be0fe20**·2026-11-04T02:16 批认注+溯源注——不再候批，S2 以正身款为唯一法条锚）+ §8.3 schema（十三态词表/共享合同八要素）

## 一、任务面（S2=排期单缺口③·恢复）

1. TriMLC daemon **boot 序挂恢复链**：启动扫 `${dataDir}/fade.db` 未完 run（listUnfinishedRuns）→ 按 §8.1 批认正身款恢复——幂等段续跑（自 checkpoint 续）/ EXECUTING 回退 CLOSING 收口核残证后终裁。
2. recoverRun() / recoveryActionFor()（S1 已备原语）接线进 boot 链——恢复判定与执行路径闭合。
3. checkpoint 消费验证：S1 store checkpoint 列的写读往返（恢复路径实锚依赖）。

范围划线：run 触发/十段程序化驱动面**不入 S2**（S5 联调域）——S2 只做「已有 run 态→boot 后恢复」链。

## 二、门禁（S2→S3 gate·排期单 §四）

- **kill 实测最小链通两实锚**：
  - 实锚①：构造幂等段中断态 → kill/重启 → 断言续跑且状态不变
  - 实锚②：构造 EXECUTING 中断态 → kill/重启 → 断言回退 CLOSING + 收口核残证路径触发
- 全量单测 RC=0（含 S1 两件回归）+ 既有失败逐族归因

## 三、前置已办（派工席落实读数）

- S1 交付件=TriMLC **7e41d01**（src/fade/ 三源件+test/ 两件·1087 行·本席抽验 STE 门禁复跑 30/30 RC=0）
- spec §8.1 恢复策略批认转正=TriCompany **be0fe20**（候批流程本席已当场办毕·无催办需求）
- FSD 已备消费面三件（S1 毕报自报）：listUnfinishedRuns()（boot 扫面·reopen 存活已测）/ recoverRun()（L445 回退快捷）/ recoveryActionFor()（幂等判据原语）

## 四、施工纪律（同 S1+kill 实测特则）

1. 独立键空间零触现役（排期单 §六）：**kill 实测形态建议=独立测试实例**（独立 DATA_DIR+临时端口起第二 daemon 实例·零触现役 8713 store 与 cron 面）——若确须动现役实例受控重启，先回 NEEDS_CLARIFICATION 候本席裁（现役重启走重启纪律链·禁裸杀）。
2. D-65 四族十三条写码自查（boot 链接线段含 CLI/配置入口处必过族三）。
3. 节点收口：`reports/node-fsd-s2.md` 按 §2.7 九键写·收口过 `node_report_check.py --tree-dir <树>/reports`（**注意落 reports/ 子目录**——glob 单层）。
4. 写后即 commit 锁笔·commit 尾 Co-Authored-By·排窗已废顺序推进。
5. 全量读数回报：npm test 全量四项读数（非 head 截断）+既有失败逐族归因。

## 五、D-15 回执链

- FSD 接令 → 回执确认接手（SendMessage → m-cto）→ 施工 → gate 读数（kill 两实锚+全量单测 RC）→ 节点报告落树 → 收口双门 → 毕报回 m-cto。

—— CTO 小狄 派工（2026-11-04T02:16 轮·S1 验收同窗）
