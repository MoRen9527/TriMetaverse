# FADE-011 Phase 2 · S4 派工 brief（T6 校验器编排层接线）

- sourceOfTruth: 本 brief（树内派工正身·施工读数归节点报告 node-fsd-s4.md）
- syncMode: write-time（D-15 分派面·FSD 接令回执后施工）
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 卷面正形·本席铁则 2026-11-04 自领后适用）
- 派工席: CTO 小狄（D-15 分派枢纽）
- 施工席: FSD（S1-S3 交付件为基座·接令回执→施工→节点收口）
- 令源: 排期单 cd1a13f6c 生效（COS 裁②·S1-S5 工序序顺序推进）+ S3 gate 过本席验收 APPROVE（抽验四绿·fade011-s3-skill-loading/dispatch-intake.jsonl 03:05:17 行）
- 排期单正身: `docs/execution/fade-011-automation-phase2-plan-20261103.md`（cd1a13f6c@dev）
- 法条锚: `TriCompany/docs/engineering/fade-protocol-spec.md` §2.7 前置门（置 done 前必须运行 node-report-check·**exit≠0 不得翻转**·编排层收口全节点复跑双门）+ §8.1 批认正身 be0fe20 承袭

## 一、任务面（S4=排期单工序 4·校验器接线·零新写只接线）

1. TriMLC daemon 编排层收口复跑门**程序化**：十段链收口节点处 spawn 校验器 `python <TMV_REPO_ROOT>/scripts/node_report_check.py --tree-dir <run树>/reports`——RC=0 方可翻转，RC≠0 拒翻转并落失败明细（§2.7 法条机械执行）。
2. 校验器现役件=`TriMetaverse/scripts/node_report_check.py`（TMV **015bab659**·T6 补机跑双门 exit 0 实锚·读数卷 aeefc6cee）——**零新写，只接线**。
3. **路径配置化要求（D-24 机位断言纪律）**：仓库根走 `TMV_REPO_ROOT` env 形·默认 dev 机布局值·**禁硬编码绝对路径**——sg 机布局（/srv/fleet/）可移植；run 树根同理从 run 元数据/配置取，不硬编码。

范围划线：十段链全链驱动面不入 S4（S5 联调域）——S4 只做「收口复跑门程序化接线」这一件+可独立实测的门禁路径。

## 二、门禁（S4→S5 gate·排期单 §四）

- 接线实锚两例：①真跑门——对 S1 树 reports/（现役全 PASS 面）spawn 校验器断言 RC=0 放行；②负路径——构造 FAIL 面（缺键件树）断言 RC≠0 **拒翻转**+失败明细落卷。
- 全量单测 RC=0（含 fade 六件 61 例回归）+ 触现役件沿 git stash 基线对照标准形态。
- python 可用性面：spawn 解释器解析（python/pythonw/PATH 面）显式化+超时上界（R2.1）+spawn 失败 fail 行为显式标注（fail-closed=拒翻转）。

## 三、前置已办（派工席落实读数）

- S1-S3 交付链=TriMLC 7e41d01→19b19c5→**4573eba**（本席抽验 30/30、12/12、61/61 RC=0 全绿）
- 校验器现役=015bab659+双门读数卷 aeefc6cee（T6 追认判据已 CEO 令闭环）
- S3 消费面移交：loadFade011Skills+validateSkillOutput/parseSkillOutput+S2 两 getter——S4 与该附着面并勘接线位

## 四、施工纪律（同 S1-S3）

1. 独立键空间零触现役（8713 现役 store/cron 零触碰）。
2. D-65 四族十三条写码自查（spawn 壳=CLI 消费面·族三五查+R2.1 超时上界+R4.3 进程内时戳原生禁 spawn date）。
3. 节点收口：`reports/node-fsd-s4.md` 九键落树·收口过 `node_report_check.py --tree-dir <树>/reports`（reports/ 子目录·glob 单层）。
4. 写后即 commit 锁笔·Co-Authored-By·排窗已废顺序推进。
5. 全量读数回报+既有失败逐族归因；**卷面/信面时戳零手打**（卷面=commit 时戳代·信面=写前 date 现查原值粘贴·本席 2026-11-04 自领铁则同束施工席）。

## 五、D-15 回执链

- FSD 接令 → 回执确认接手（SendMessage → m-cto）→ 施工 → gate 读数（两实锚+全量 RC）→ 节点报告落树 → 收口双门 → 毕报回 m-cto。

—— CTO 小狄 派工（S3 验收同窗·卷面时戳以 commit 时戳为准）
