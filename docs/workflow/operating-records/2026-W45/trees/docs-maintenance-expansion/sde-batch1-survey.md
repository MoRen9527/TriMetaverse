# docs-maintenance 三模块梳理 · 批 1 勘探卷（SDE 主担）

- sourceOfTruth: 本卷（批 1 勘探读数+scope 勘定+批次施工计划正身·候 CTO 门禁+COS 转呈）
- syncMode: write-time
- lastSyncedAt: 2026-11-04T07:59:48Z（date 现查原值）
- 令源: COS 派工令 15:45:32+0800（CEO 15:43 令·BOD 15:44:27 转达）·D-67 条文（CAO 铸条·1057 起）·RDT 备料卷（rdt-citation-map-and-d67-opinion.md）

## 一 · 全量清点（2026-11-04 勘探·find/grep 实数）

| 仓 | docs md 总数 | 记录/镜像面 | **规范文档面（梳理圈）** | 有 sourceOfTruth 头 | 缺头 |
|---|---|---|---|---|---|
| TriMetaverse/docs | 2470 | operating-records 2021＋memory 镜像 116 | **333** | 258 | **75** |
| TriCompany/docs | 234 | 0（全规范面） | **234** | 153 | **81** |
| TriTraining/docs | 21 | 0 | **21** | 14 | **7** |
| （候裁）TriTraining/cc-tutorial | 5（仓根 docs 外） | — | **5（候裁）** | 候勘 | 候勘 |
| **合计** | 2725 | 2137 | **588–593** | 425 | **163–168** |

## 二 · scope 勘定（SDE 裁定·候 CTO 核+COS 知会）

1. **operating-records（2021 件）出圈**：运行记录面（树文件/tick log/巡检 log）——docs-maintenance 勘定卷法源语义=维护对象为**真源 docs**（构造件隔离面语义·L98「不触真源 docs」对照）；记录面无版本语义无引用网语义·三件梳理对其无对象。
2. **TriMetaverse/docs/memory/（116 件）出圈**：项目记忆自动镜像区（MEMORY.md 每小时 schtasks+hook 即时镜像·机器写入面·只增改不删）——记录面语义同上·非规范文档。
3. **cc-tutorial（5 件·TriTraining 仓根 docs 外）入圈候裁**：RDT 点名防漏圈+培训域 19 md 口径含它（COS 知会用语）——**建议入圈**·版本号按 RDT 双层语义处理（tutorialVersion 代码快照绑定版不动+维护版本 1.x.x 分列）。
4. **archive 面轻量处理候批 2 定**：TMV docs/archive 22 缺头——归档件=历史冻结面（truth-record-amendment-policy：历史叙事冻结）——建议规范头补最小形+版本号**不动**（冻结态不参与 D-67 迁移）·候 CTO 核。
5. 《文档治理与真源文件系统.md》§3.4=规范头判据法源·三键=sourceOfTruth/syncMode/lastSyncedAt（D-67 管辖版本字段另加）。

## 三 · 版本号现势形态盘点（D-67 款 3 存量迁移对象·批 3 施工面）

- **两段式存量族**（行首「版本：V0.x/V1.x」形·批 3 全扫·本表=勘探抽样）：
  - TMV：engineering 族群（DESIGN/ROADMAP/dev-degradation-plan/experiment-runbook/self-dev-loop-design/STATE/tri-dev-test-deploy-* 等V0.1/V0.2）＋archive 零星
  - TC：engineering 族群（ade-* V1.0 群·chief-of-staff-llm-wiki-priority-plan V0.5·cognition-runtime-module-plan V0.6 等）
  - TT：training 族群（host-publish 系+source-kit 系 V0.1/V0.2 群）
- **已三段形态**：混杂在案（version: 0.4.0/3.0 形等）——批 3 全扫统一对表。
- **迁移基准**（RDT 建议采认）：现 V0.x/V1.x 两段式 → 1.0.x 起算（现世代 1.x.x 形）·major 语义按 RDT 分档映射（课程结构换代/口径重构=major·章节增改=minor·勘误=patch）。
- **tutorialVersion 双层**（RDT 意见采认·cc-tutorial 五件）：`tutorialVersion: agent-core-v0.1.0` 代码快照绑定版**不动**·维护版本 1.x.x 分列。

## 四 · 规范头施工面（批 2）

- 缺头分布：TMV execution 31/archive 22/engineering 6/workflow 3/registry 3/其余零星（memory 出圈后）·TC workflow 29/testing 19/training 18/execution 6/engineering 4/project-sources 2·TT training 2+各目录 1。
- 三键正形=§3.4 规范（sourceOfTruth/syncMode/lastSyncedAt·D-67 后加版本字段位）——施工模板按现役合规件抽样定形后批量补。
- **联动触发语义**：补头即触发 docs-maintenance 扫描面变化（fade011 维护项）——分批施工防扫描风暴（rate-guard 在位·记录在 audit）。

## 五 · 引用关系施工面（批 4）

- TT 基线=RDT 备料卷直取（枢纽 README→13 出边·12/14 件零入边·断链 1 笔=beginners-guide→tricompany/03 拷贝伪影·修法候勘：改跨仓路径记法或纯文本指向·禁造占位件）。
- TMV/TC 引用面全扫候批 4（markdown 链接+反引号路径两形态·含跨仓回指面——TT 正身的 TMV/TC 镜像件回指是联动触发关键网）。
- 断链修复原则：LG-023 跨仓路径铁律+禁造占位件（RDT 意见采认）。

## 六 · 批次施工计划（批粒度自裁·锚清晰）

| 批 | 面 | 对象 | 候核点 |
|---|---|---|---|
| 批 1 | 勘探卷（本卷） | scope+清点+存量盘点 | CTO 核 scope 裁定 |
| 批 2 | 规范头补齐 | 缺头 163–168 件分模块分目录批次 | 模板形先呈 1 例 |
| 批 3 | 版本号三段式迁移 | 两段式存量（勘探 §三全扫后定数） | 迁移映射表先呈 |
| 批 4 | 引用关系重梳 | TT 全网+TMV/TC 全扫+断链修复 | 联动触发形态先呈 |
| 批 5 | 验证令 | 手动 docs-maintenance cli 看 fade011 实际效果 | **候 ew 迁 TriMMC 实施毕后串行**（令文明注） |

## 七 · 使用依据

- COS 派工令 2026-11-04T15:45:32+0800（三项工作面+验证令+毕报链原文）
- D-67 条文原文（engineering-disciplines.md L1057-1068·CAO 铸条 6f842b1）
- RDT 备料卷 rdt-citation-map-and-d67-opinion.md（引用面地图+断链+双层版本语义+分档映射）
- docs-maintenance-fade-assessment-paper.md（真源 docs 对象语义·L98 隔离面对照）
- 《文档治理与真源文件系统.md》§3.4（规范头三键法源·经 doc-metadata 记忆指针）
- 清点读数：find/grep 实数（2026-11-04 勘探·命令与计数在卷）
