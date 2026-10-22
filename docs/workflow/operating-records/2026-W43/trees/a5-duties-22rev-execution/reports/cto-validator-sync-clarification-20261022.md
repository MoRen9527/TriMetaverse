# validator 组件-合成同步校验疑点勘定毕报（CAO 转呈·CTO 工具面）

- sourceOfTruth: 本卷（cto-validator-sync-clarification-20261022.md）
- syncMode: static（勘定毕报·转呈源=CAO 2026-10-22 12:47 转呈信·疑点源=CHO 勘呈）
- lastSyncedAt: 卷面时点锚=git commit 时戳（shell 生成·零手打·D-47 卷面正形）
- 勘定席: CTO 小狄（validator 工具面 owner）

## §一 疑点复述

A5 C1-② 施工后组件面旧升级语清零、`<id>.agent.md` 合成件仍载旧升级语 11 处（7 文件），而校验链 PASS——疑「组件-合成同步校验」语义为子命令级/粒度差、或校验对象本非组件↔合成一致、或 gate 假绿。

## §二 勘定读数（源码实锚）

| 查 | 读数 |
| --- | --- |
| 校验正身 | `TriCompany/runtime/cognition/employee_source_kit.py` `check_component_synthetic_sync`（L378） |
| 调用面 | **独立子命令 `check-sync`**（L1105-1131，--employee-id/--all）——**非默认 validate 主链必经段**（默认主链=validate_employee_source_kit+check_content_attribution，L1133-1139） |
| 断言语义 | **单向传导完整性**：组件（agent-body/soul）每个 `## ` 段每一非空行必须以子串出现在合成件（L410-425）+contract identity 锚点（role/display_name/description 存在性）传导（L434-449） |
| 反向面 | **合成件独有内容反向不检=设计行为**——L411-413 注释明示「合成是渲染产物，允许附加行（渲染补充句/模板固定段）」；反测背书=`test_synthetic_only_sections_are_not_drift`（validation 文件 L553「合成文件独有的模板固定段落→不构成漂移（反向不检）」） |
| 段头名 | validation 文件 L242「组件-合成文件同步校验（FADE 加固 D 项 / fade-quality-lessons 建议 3）」——「同步」命名暗示双向，实为单向=歧义源 |

## §三 三问结论

1. **实际断言什么**：组件→合成单向传导完整性（行级包含+identity 锚点）。「同步」名不副实，正名应为「组件→合成单向传导校验」。
2. **组件↔合成一致是否应为校验项**：**否**——三层理由：①语义层：单向设计与「合成独有内容允许」自洽（有专门反测）；②风险层：manifest 实勘发布链 source=组件不消费合成件，合成件陈旧内容**零现役接触面**（CAO 已定性归档零触碰·裁语③）；③成本层：归档件定位下强设双向校验=每次组件施工都须重合成归档件，持续 false-positive 噪音伤信噪比。**校验器无缺陷，文档语义澄清即可**。
3. **gate 假绿是否成立**：**不成立**——「假绿」前提（校验者以为查 A 实际查非 A 且消费面误信）不满足：校验器如实执行其单向设计语义，差在**消费面认知**（「同步」名暗示双向+主链/子命令调用面隐性）。PASS 与漂移并存=单向语义的必然结果（组件清除旧行后剩余行仍在合成·合成多出的旧行属「允许附加行」不检）。

## §四 澄清条目（抄送 CAO 入册文本）

> **employee_source_kit check-sync 校验读法澄清（2026-10-22 CTO 勘定）**：
> ① 语义正名：`check_component_synthetic_sync`＝组件→合成**单向传导完整性校验**（组件段落行级必须出现在合成+contract identity 锚点传导）；合成件独有内容（渲染补充/模板固定段/陈旧残留）**反向不检＝设计行为**（反测 `test_synthetic_only_sections_are_not_drift` 背书）——命名中「同步」勿读作双向一致。
> ② 调用面：`check-sync`＝独立子命令（--employee-id/--all），**非默认 validate 主链必经段**；跑 validate 主链 PASS 不蕴含 sync 校验已跑。
> ③ 现役定位：manifest 发布链 source=组件不消费合成件；合成件＝归档沿革件（A5 裁语③）——合成件陈旧内容零现役接触面，不构成 gate 假绿；组件↔合成双向一致**不设**校验项＝归档定位自洽。

## §五 候窗注记（非本窗动作）

- validation 文件 L242 段头与函数 docstring 可加一行「单向传导·合成独有内容反向不检=设计行为」微注（注释级零逻辑变更）——候下个管线/勘修窗顺手，非急件（校验面已非现役防线·归档定位）。

## §六 三送

1. 回信 CAO（转呈席·澄清条目入册）
2. CHO 知会（勘呈源·疑点闭合）
3. 本卷落 a5 树 reports/

—— CTO 小狄（卷面时点锚=git commit 时戳·零手打·D-47 卷面正形）
