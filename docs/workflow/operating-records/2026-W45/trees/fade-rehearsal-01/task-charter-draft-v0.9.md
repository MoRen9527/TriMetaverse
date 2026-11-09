# 任务书草案 v0.9（首 run a 彩排·候 COS 协铸转正）

- sourceOfTruth: 本件（彩排构造件·非真源·不入真源叙事）
- syncMode: rehearsal-fixture
- lastSyncedAt: 2026-11-03T20:08:00+08:00
- 状态: **草案 v0.9——候 COS 协铸**（COS 定稿 v1.0 后随 Plan 同窗冻结·五件一套）

## 任务

首 run a 彩排：对四构造件变更集（隔离面=本树目录）执行 FADE 十段全流程演练，验收=试卷定稿卷全部门（T1–T15＋S1 全过·总分 ≥90）。

## 始于链

- 上游=前置任务说明书（[pre-task-brief.md](pre-task-brief.md)·触发源=BOD 彩排启动令 2026-11-03 20:00）＋Qualify 影响面清单（[qualify-impact-list.md](qualify-impact-list.md)·四构造件过门）。
- 本任务书生效后→COO 协定拆树→全树清单（下游产物·随 Plan 同窗冻结）。

## 范围与分工（两线·⑯定谳）

- **机器线（DCE 执行）**：机械三域（relatedRefs/反向索引/元信息头）改四构造件——施工清单=语义作业方案卷（JSON/YAML·CLI 经参数传入解析逐条执行·Plan 时点另铸另冻）；批卷验=T5＋T4。
- **人的线（树·组织编排）**：owner 语义改动=件 3 `fixture-note.md`「维护流程现状」段由「单线 JSON 模式」过时陈述更新为两线分工定谳口径（S1 题定稿见试卷 §1.5）——施工清单=树（每棵树一个文件族·COS 根节点开头→owner agent 节点改正文→COS 收口检查·节点完成报告=故障恢复锚）；批卷验=T6＋S1＋T15。

## 拆树要求（给 COO）

- 树集覆盖：机器线一棵（DCE 机械三域·四件）＋人的线一棵（S1 语义靶件 3）；COS 根节点开头（root_agent 默认 CEOChiefOfStaff）、owner agent 执行节点、COS 收口检查收尾（协议 §12）；每树含节点链与完成状态位。
- 全树清单随 Plan 同窗 hash 冻结；T15 逐树核对；T4 五件一套 hash 门（试卷＋任务书＋全树清单＋三件卷）。

## 冻结与不可变

- 任务书 v1.0（COS 协铸定稿）＋全树清单随 Plan 同窗 `_fadehash` 双 hash 冻结（raw+LF）；DCE 期间不可变（T4 门）。
- 跑毕真实 re-scan 对冲残留；彩排构造字样随身不入真源叙事。

## 验收

试卷定稿卷（TMV 1ef511160）全部检查项；逐段工件留痕本树目录；Close 按 tri-fade-close v1.0 四态裁。
