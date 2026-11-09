# FADE-011 Phase 2 · S5 派工 brief（十段链全链驱动+kill 实测验收门·最后工序）

- sourceOfTruth: 本 brief（树内派工正身·施工读数归节点报告 node-fsd-s5.md）
- syncMode: write-time（D-15 分派面·FSD 接令回执后施工）
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形·e56206f 现役）
- 派工席: CTO 小狄（D-15 分派枢纽）
- 施工席: FSD（S1-S4 交付件为基座·接令回执→施工→节点收口）
- 令源: 排期单 cd1a13f6c 生效（COS 裁②·S1-S5 工序序顺序推进）+ S4 gate 过本席验收 APPROVE（抽验四绿·fade011-s4-check-wiring/dispatch-intake.jsonl 03:17:26 行）
- 排期单正身: `docs/execution/fade-011-automation-phase2-plan-20261103.md`（cd1a13f6c@dev·§四 S5+§五 验收门）
- 法条锚: spec §8.1 十段链（批认正身 be0fe20）+ §2.7 前置门（closing-gate 机械执行 1606734）+ §8.3 schema + §8.6 event-watch 触发探测（现役件）

## 一、任务面（S5=排期单工序 5·全链驱动闭环）

1. 十段链**全链驱动面程序化**：event-watch 触发（§8.6 现役件）→ Qualify → Plan Skill（loadFade011Skills·S3 件装载）→ DCE → Verify → Score → Close → 收口（**finalizeWithGate 唯一合法通道**·S4 件）→ 终态——daemon 触发新 run 全自动通零人工。
2. **绕闸防御验证（S4 上呈债·本席立为 S5 义务）**：驱动链不得绕过 finalizeWithGate 直调 advanceRun 翻转收口段——驱动面代码审查项+断言（收口段翻转必须 gate 过·唯一通道验证）。
3. run 元数据贯通：reportsDir/树根从 run 元数据取（S4 resolver 消费面）——run 创建时登记·驱动链全程零硬编码路径。

## 二、验收门（排期单 §五·机械化判据·BOD 照立·本工序即验收门）

1. daemon 触发一条新 run → 十段全自动通（零人工干预）→ 终态 APPROVED
2. 十段中途 kill daemon（随机段位）→ 重启 → run 恢复到中断点续跑或 CLOSING 收口 → 终态可达
3. 收口双门：编排层 `node_report_check.py --tree-dir` 复跑 RC=0
4. 上述 1-3 **连续两轮通过**（防单次偶然）= 验收放行

kill 实测形态=独立测试实例（独立 DATA_DIR/端口 0·零触现役 8713——S2 同形承袭）。

## 三、前置已办（派工席落实读数）

- S1-S4 交付链=TriMLC 7e41d01→19b19c5→4573eba→**1606734**（本席抽验 30/30、12/12、61/61（六件）、77/77（七件）RC=0 全绿）
- S4 消费面移交：finalizeWithGate（收口翻转唯一通道·门败 gated:false=驱动面重试/升级决策点）+runClosingGate+listGateRejections+两 env knob（TMV_REPO_ROOT/TRILC_FADE_PYTHON）
- S3 消费面：loadFade011Skills+validateSkillOutput/parseSkillOutput；S2 消费面：listUnfinishedRuns/recoverRun/recoveryActionFor
- 现役触发件：event-watch 触发探测（§8.6）+--run-id（FADE-002 核销）+Close CLI
- spec §8.1 批认正身 be0fe20；D-47 增补款 e56206f 现役（全司约束力满格）

## 四、施工纪律（同 S1-S4）

1. 独立键空间零触现役（kill 全链实测独立测试实例·禁动现役 8713；若确须现役实例受控重启先 NEEDS_CLARIFICATION 候裁）。
2. D-65 四族十三条写码自查（驱动面=编排代码·R2.1 全链耗时上界显式+R4.3 时戳原生）。
3. 节点收口：`reports/node-fsd-s5.md` 九键落树·收口过 node_report_check（reports/ 子目录·glob 单层）——**且收口翻转本身走 finalizeWithGate**（自食门·唯一通道验证第一实锚）。
4. 写后即 commit 锁笔·Co-Authored-By·排窗已废顺序推进。
5. 全量读数回报+既有失败逐族归因（触现役件 stash 基线对照标准形态）。
6. 时戳铁则同束（卷面=commit 时戳代·信面=写前现查粘贴——D-47 e56206f 现役）。

## 五、D-15 回执链

- FSD 接令 → 回执确认接手（SendMessage → m-cto）→ 施工 → 验收门读数（两轮 kill 实测全量读数+终态锚+双门 RC）→ 节点报告落树 → 收口双门 → 毕报回 m-cto。
- 验收门过=**Phase 2 总毕报**触发点（本席出总毕报 COS 汇总转 bod）。

—— CTO 小狄 派工（S4 验收同窗·卷面时戳以 commit 时戳为准）
