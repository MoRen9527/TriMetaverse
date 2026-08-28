# 节点收口报告 — TM-1（甄别重放）

- nodeId/agent: TM-1 / FullStackDeveloper（TriMLC 本地执行）
- 起止: 2026-08-27T14:36Z → 15:0xZ（UTC）
- 基线 commit: TriLC dev@8ad6d5c（本地）/ sg-dev@876d21e（基线改定：sg 线已含 canonical+p0fix3，按树注记预案重对齐）
- 触发来源: CEO 指令开跑；卷封制首试点（sourceMaterials ×2 预封 verify=0）
- 动作序列: 14:36 三线盘点（local=gh=8ad6d5c｜sg=876d21e｜canonical=ba32bc7）→ 甄别 28 提交（排除 1：8ad6d5c 旧 TC-s1 草案；保留 27 全业务演进）→ backup/local-dev-premerge 建立并推 GitHub → integrate 分支起 sg-dev → cherry-pick 27（180cfbf 处 1 冲突=QA stub 双 env 设置，并集解）→ 全部落位 27/27
- 工件清单: integrate/tc001-canonical 分支（27 重放提交）；无代码新增（纯重放）
- 门禁结果: （本节点无独立门禁，门禁归 TM-2）
- 异常与处置: 1 处冲突按"sg 架构为准+保留双方语义"并集解决；零 abort
- 断点交接: 无中断；TM-2 待跑（见 node-TM-2）
- 使用依据: p0-fix-and-trilc-merge-plan.md §二；fade-registry FADE-006 条目


## 机读核心（§2.7 v1.4.1 格式增补，2026-08-28；事实同上散文节）

```json
{
 "nodeId": "TM-1",
 "agent": "FullStackDeveloper（TriMLC 本地执行）",
 "startedAt": "2026-08-27T14:36:00Z",
 "finishedAt": "2026-08-27T15:02:00Z",
 "baselineCommit": "TriLC dev@8ad6d5c（基线改定 sg-dev@876d21e）",
 "trigger": "manual（CEO 指令开跑；卷封制首试点）",
 "actions": [
  {
   "t": "14:36",
   "act": "三线盘点 local=gh=8ad6d5c | sg=876d21e | canonical=ba32bc7",
   "commit": "-"
  },
  {
   "t": "14:4x",
   "act": "甄别 28 提交：排除 8ad6d5c 旧草案，保留 27",
   "commit": "-"
  },
  {
   "t": "14:4x",
   "act": "backup/local-dev-premerge 建立并推 GitHub",
   "commit": "-"
  },
  {
   "t": "14:5x",
   "act": "integrate 分支起 sg-dev，cherry-pick 27（180cfbf 处 QA stub 冲突并集解）",
   "commit": "27 重放"
  }
 ],
 "artifacts": [
  {
   "path": "integrate/tc001-canonical 分支",
   "evidence": "27 重放提交"
  }
 ],
 "gateResults": [
  {
   "cmd": "（本节点无独立门禁，归 TM-2）",
   "exit": "-"
  }
 ]
}
```
