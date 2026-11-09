# FADE-011 S5.1 派工 brief（plan skill 正身接线·B 件转正承接）

- sourceOfTruth: 本 brief（树内派工正身·施工读数归节点报告 node-fsd-s51.md）
- syncMode: write-time（D-15 分派面·FSD 接令回执后施工）
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形 e56206f 现役）
- 派工席: CTO 小狄（D-15 分派枢纽）
- 施工席: FSD（S1-S5+UAT 交付链作者）
- 令源: B 件正身转正（tri-fade011-plan 立法 CAO 1fa8a94 03:58:01+BOD 复核 PASS a9e6852 03:59·COS 知会 04:04:38 信）+UAT 验收 APPROVE（7cb454715）——技术债①销项承接·接线同窗顺序推进
- 法条锚: tri-fade011-plan SKILL.md 正身（TriSkill/skills/engineering/·本席已勘位）+新立法「skill 可达性确认」检查项+spec §8.3 schema+S3 skill-loader 交付面

## 一、任务面（小单·同形接法）

1. **plan 段真身装载接线**：driver.ts plan worker 从程序化 MVP 换 `loadFade011Skills('tri-fade011-plan')`+`parseSkillOutput` 结构门——与 score/close 两段同形接法（S5 已留 worker 注入点·零架构变更）。
2. **新立法「skill 可达性确认」检查项落实**：run 登记卷载三包指针（score/close/plan 三 SKILL.md 路径）+AGENTS.md 映射行·**Unknown skill=FAIL-EXPECTED 禁替身逻辑**——立法正身现勘（CAO 1fa8a94 全文·施工序①）后按条款落实。
3. plan 段产物 schema 对立法正身+spec §8.3 现勘定谳后落结构门（逐键校验同 S3 形）。

范围划线：event-watch 自动触发工程不入本单（②径定候 COS 肯·独立立窗）；只接线+可达性确认这一件面。

## 二、门禁（S5.1 gate）

1. 真身装载实锚：进程级/进程内测试 plan 段装载 tri-fade011-plan 真身+结构门过（正身 SKILL.md 在位·本机 TriSkill 仓）。
2. 负路径两例：Unknown skill 名=FAIL-EXPECTED 断言（禁替身）+坏 plan 输出=段失败不静默（FadeDriverError 同 score/close 形）。
3. 全量回归：fade 全家十件（84+新增）RC=0+触 driver.ts 沿 stash 基线对照（Phase 2 件基线形态同束）+kill-drive 两轮仍绿（plan 段真身化后全链验收门不破）。
4. UAT 树回归面：接线后对既有三 run 树 node_report_check 复跑 RC=0×3（历史树产物不因接线失门）。

## 三、前置已办（派工席落实读数）

- plan 正身在位：`TriSkill/skills/engineering/tri-fade011-plan/`（本席 ls 勘·SKILL.md 存在）——立法内容 FSD 施工序①现勘全文。
- S5 消费面：driver.ts 段映射 PLANNING=plan worker（程序化 MVP 现形）+workers 注入点+loadFade011Skills/parseSkillOutput（S3 件·score/close 现役同形两段）。
- UAT 实战锚：TRILC_FADE_PYTHON 已注入 D:/Code/ai/.env（TRILC_ENV_FILE 消费面）·dist 构建产物加载面（重启前 npm run build·UAT 方法论记档）。

## 四、施工纪律（同 S1-S5+UAT）

1. 独立键空间零触现役（测试实例独立 DATA_DIR/端口 0·禁动现役 8713 与现役 fade.db）。
2. D-65 四族十三条写码自查+D-46 值面零回显（UAT 自报教训同束：键查询用计数形）。
3. 节点收口：`reports/node-fsd-s51.md` 九键落树·收口过 node_report_check（reports/ 子目录）。
4. 写后即 commit 锁笔·Co-Authored-By·排窗废顺序推进·D-47 时戳铁则（卷面=commit 时戳代·信面=写前现查粘贴）。
5. 全量读数回报+既有失败逐族归因。

## 五、D-15 回执链

- FSD 接令 → 回执确认接手（SendMessage → m-cto）→ 施工 → gate 读数 → 节点报告落树 → 收口双门 → 毕报回 m-cto → 本席验收 → 随下轮毕报 COS（②event-watch 径定候 COS 肯后立窗·接线毕为立窗前置）。

—— CTO 小狄 派工（UAT 验收同窗·卷面时戳以 commit 时戳为准）
