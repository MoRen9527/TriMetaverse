# event-watch TREE_ROOT 跨周模板化 · 派工 brief（{week} 占位符·P3 尾增强小单）

- sourceOfTruth: 本 brief（树内派工正身·施工读数归节点报告 node-fsd-ew-week.md）
- syncMode: write-time（D-15 分派面·FSD 接令回执后施工）
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形 e56206f 现役）
- 派工席: CTO 小狄（D-15 分派枢纽）
- 施工席: FSD（watch.ts c52f5bc 立窗件作者·对触发面最熟）
- 令源: 本席 P3 验收裁语（2026-11-04T12:12:20 信·跨周滚动语义裁决——env 静态值 TREE_ROOT 指向 2026-W45 树·W46 换周后 run 错落旧周树=记录面脏·模板化根治）
- 时效: 赶周日 2026-11-08 23:50 周平面迁移前落地（换周窗前生效·W46 起 run 落对周）

## 一、任务面（一件·小改）

1. **watch.ts treeRoot 支持 `{week}` 占位符**：run 创建（或指纹触发时）展开 ISO 周字符串（`2026-W45` 形·与 operating-records 周目录命名同构）——`.../trees/fade011-ew-runs` 可写 `.../{week}/trees/fade011-ew-runs` 或 `.../trees/{week}-fade011-ew-runs` 等形·**展开时点=run 创建时**（非 boot 时——boot 时展开则换周不重启仍错周）。
2. **向后兼容**：无占位符静态值行为零变化（现役 `.../2026-W45/trees/fade011-ew-runs` 形照跑）。
3. **fail-closed**：展开失败/非法占位符=run 不创建+audit failed 显面（禁静默落根路径）。

范围划线：现役 daemon env 静态值**本单不改**（部署面切换=模板化验收毕后重启窗随批·届时 env 值面换 `{week}` 形——本单只交付代码能力）；速率护栏/防抖/指纹记忆化零触碰。

## 二、门禁（小单 gate）

1. 模板展开单测：`{week}`→当前 ISO 周（W45 形断言）+换周模拟（注入时钟或周参数·展开值随周变）。
2. 向后兼容单测：静态值（无占位符）行为与现役一致断言。
3. fail-closed 单测：非法占位符（如 `{weekx}`）→run 不创建+failed 显面断言。
4. 全量回归：fade 全家（95+新增）RC=0+stash 基线对照。

## 三、施工纪律

1. 独立键空间零触现役（测试实例独立 DATA_DIR/端口 0·禁动现役 8713 与 fade.db）。
2. D-65 四族十三条写码自查+D-46 值面零回显+D-47 时戳铁则（卷面=commit 时戳代·信面=写前现查粘贴）。
3. 节点收口：`reports/node-fsd-ew-week.md` 九键落树·收口过 node_report_check（reports/ 子目录）。
4. 写后即 commit 锁笔·Co-Authored-By·排窗废顺序推进。
5. 全量读数回报+既有失败逐族归因。

## 四、D-15 回执链

- FSD 接令 → 回执确认接手（SendMessage → m-cto）→ 施工 → gate 读数 → 节点报告落树 → 收口双门 → 毕报回 m-cto → 本席验收 → 随下轮毕报 COS（部署面 env 值切换=验收毕后重启窗随批·本席排布）。

—— CTO 小狄 派工（P3 验收同窗出单·卷面时戳以 commit 时戳为准）
