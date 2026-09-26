# 任务书·ADE 退役术语残留全公司清查

- sourceOfTruth: 本件=董事会任务书（CEO 2026-09-21 批立，承接 fade-protocol-spec v2.0.0 ADE 概念退役决议）
- syncMode: static
- lastSyncedAt: 2026-09-21
- 上位: fade-protocol-spec.md v2.0.0 变更记录明文「ADE 概念退役——ADE 协议框架/FADE 成熟实例称号双层表述废止」
- 主责: CHO（正名族主笔，SDE 正名/双腿化同族先例）
- 协同: CTO（正名替代语定谳——退役术语→正名对照表审定）

## 一、背景

fade-protocol-spec v2.0.0 架构重构明文废止 ADE 概念（正名=纯确定性执行脚本/DCE 段），但全公司 ADE 术语残留未清查。实勘已知残留：

- SDE agent-body :49/:96「按照 ADE 模式执行部署」（两处）；
- contract.yaml `runtime_equivalent: openclaw:*`（同族旧 runtime 残留，contract schema 命题已覆盖）；
- 部署日志/名册/多文档 ADE 引用（全量清查待做）。

## 二、清查范围与方法

1. **全仓 grep**：ADE/ADE 模式/ADE-only/ade-pattern（全仓 19+ 仓，排除 node_modules/git 历史/退役仓档案）；
2. **逐件甄别**：退役仓历史叙述冻结不动；活文档/活代码/活名册→正名替换；
3. **正名对照**：ADE→纯确定性执行脚本/DCE 段（CTO 审定对照表后批量替换）。

## 三、验收锚

1. 全仓活文件 ADE 术语零残留（退役仓档案除外，逐件标注）；
2. CTO 正名对照表审定；
3. validator 全绿。

## 四、流程

接单认领→全仓清查清单→CTO 对照表→批量替换→validator→回执。落树 `trees/ade-legacy-sweep/`。
