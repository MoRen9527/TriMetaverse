# FADE-011 Phase 2 · S3 派工 brief（缺口①·Plan/Close Skill 结构化装载）

- sourceOfTruth: 本 brief（树内派工正身·施工读数归节点报告 node-fsd-s3.md）
- syncMode: write-time（D-15 分派面·FSD 接令回执后施工）
- lastSyncedAt: 2026-11-04T02:52:00+0800（date 现查原值·02:52 轮）
- 派工席: CTO 小狄（D-15 分派枢纽）
- 施工席: FSD（S1+S2 交付件为基座·接令回执→施工→节点收口）
- 令源: 排期单 cd1a13f6c 生效（COS 裁②·S1-S5 工序序顺序推进）+ S2 gate 过本席验收 APPROVE（抽验三绿·fade011-s2-recovery/dispatch-intake.jsonl 02:52:00 行）
- 排期单正身: `docs/execution/fade-011-automation-phase2-plan-20261103.md`（cd1a13f6c@dev）
- 法条锚: `TriCompany/docs/engineering/fade-protocol-spec.md` Plan Skill / Close Skill 契约面正身（§8.1 批认正身 be0fe20 承袭·spec 行号引入 schema 文本）+ §8.3 schema；**Skill 单一装载通道=daemon 读 skill 文件·禁内嵌副本**（排期单 §七 风险③条款）

## 一、任务面（S3=排期单缺口①·装载）

1. TriMLC daemon 侧 Plan/Close Skill **结构化装载器**：读 skill 文件正身（skill 文件正身位现勘定谳——彩排 run a 已人工装载走通十段，路径以彩排树/reports 记载为准）→ 对 spec 契约 schema **逐键校验**（缺键/型不符/额外键按协议管不变量实例管载体原则处置并留校验读数）。
2. 装载产物结构稳定供十段链消费（S5 联调附着点——**run 触发/驱动面不入 S3**，S5 域）。
3. **顺手修项（本席 S2 验收同窗裁）**：`TRILC_DATA_DIR` 空串防御——env 解析空串/空白 falsify 落默认值（既有债·FSD S2 毕报上呈「候您裁」本席裁候 S3 同窗）+负路径断言（空串→默认值·不盘根建库）。

## 二、门禁（S3→S4 gate·排期单 §四）

- 装载器对 spec 契约 schema 逐键校验读数（合法 skill 全过）
- 负路径：坏 schema 拒载断言（至少三例：缺必键 / 型不符 / 非 JSON 面）
- 顺手修负路径：`TRILC_DATA_DIR=""` → 落默认值断言（不盘根建库）
- 全量单测 RC=0（含 S1 三件+S2 三件回归）+ 既有失败逐族归因（改动面如触 app.ts 沿用 git stash 基线对照形态）

## 三、前置已办（派工席落实读数）

- S1 交付=TriMLC 7e41d01（状态机+store·1087 行）·S2 交付=TriMLC **19b19c5**（recovery+boot 接线·749 行·含 app.ts +38）——本席抽验均绿（30/30、12/12 RC=0）
- spec §8.1 批认正身 be0fe20（法条锚升级·不再候批）
- S2 附着点自报：fadeBootRecovery+fadeStore 两 getter=S5 附着点——S3 装载器与该附着面并勘接线位

## 四、施工纪律（同 S1/S2）

1. 独立键空间零触现役（8713 现役 store/cron 零触碰·排期单 §六）。
2. D-65 四族十三条写码自查（装载器含文件 IO+CLI/配置入口面——族三五查+R1.1 解析覆盖域尤注意：schema 校验的键名匹配字符类）。
3. 节点收口：`reports/node-fsd-s3.md` 九键落树·收口过 `node_report_check.py --tree-dir <树>/reports`（reports/ 子目录·glob 单层）。
4. 写后即 commit 锁笔·Co-Authored-By·排窗已废顺序推进。
5. 全量读数回报+既有失败逐族归因。

## 五、D-15 回执链

- FSD 接令 → 回执确认接手（SendMessage → m-cto）→ 施工 → gate 读数（逐键校验+负路径三例+顺手修断言+全量 RC）→ 节点报告落树 → 收口双门 → 毕报回 m-cto。

—— CTO 小狄 派工（2026-11-04T02:52 轮·S2 验收同窗）
