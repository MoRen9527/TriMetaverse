# CTO 技术定形卷·loop 尾段七席联审段位落点+段 3 考卷 schema（CEO 批任务书 v7 随行·2026-11-22）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-loop-jointreview-and-exam-tech-form-20261122.md·技术定形正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 批任务书 v7（04e6df8a9·「按任务书修改·完成直接点火跑一轮·看进化效果」）+COS 转达两件技术定形请

## §一 · 件 A：loop 尾段七席联审=段位落点（裁=round_runner 轮末钩）

**裁=round_runner 的轮末钩**（非 chain_runner 后置编排件）：
- **理由（层级分离原则推演）**：chain_runner=fade 层十段链驱动（每次 run 的段 1-10）·round_runner=loop 层轮编排（多轮循环/flag 态机）——**联审=loop 层动作**（CEO 层级分离定谳）→落点=loop 层载体=round_runner 轮末；
- **触发形**：round 毕（十段全毕·`stages_run` 含全段+exit:null 类停面）→**轮末钩发起联审**（七席 spawn·两对象评价·improvements·100 制）→生成器→任务书→（CEO/COS 批）→挂载→**下轮用**（每轮进化闭环）；
- **P4 组件 tie 位移**：`tryCharterHook`（联审产出→任务书）+choreography 挂载（批准后）——位从「段 7 debug 块旁」移到「round 末钩」；
- **flag 态机联动=本批不动**（联审产出走任务书链·flag 四态照旧·避免多面同变——变量隔离原则照役）；
- **成本面**：每轮联审 77min（A3 经济性）·CEO 明令自动发起→照行·候复盘（D vs A3）。

## §二 · 件 B：段 3 考卷 schema（主观题+客观题）

**产出形=独立 `exam.json`**（职责分离：plan.json=迁移规划·exam.json=考卷）：

```json
{
  "schema_version": "1.0.0",
  "objective": [  // 供段 6 score_cli 程序判
    {"id": "obj-1", "dimension": "<维度名>", "assertion": "<机器可判检查项>", "weight": 9}
  ],
  "subjective": [  // 供段 7 两席（cos initial+coo joint）agent 判
    {"id": "subj-1", "dimension": "<维度名>", "question": "<题面>", "rubric": "<评分参考>", "weight": 10}
  ]
}
```

- **客观题 assertion=程序可判形**（存在性/计数/记录核对类——如「周目录 2026-W48 存在」「迁移文件数==N」「git push 记录在」）——段 6 score_cli 读 objective 段逐项判；
- **主观题=语义判读形**（规划质量/执行严谨度类·程序不可判·段 7 两席 agent 判——与「语义类程序无法判故需 agent」对齐）；
- **接口影响面**：段 6 score_cli 输入面扩（+exam.json·读 objective 判）·段 7 两席 prompt 面扩（读 subjective 题面/rubric）——**两段输入扩=小改面**（读文件+按 schema 判）；
- **段 3 cos 出题 prompt 面**=plan_skill 的 spawn prompt 加「产出 exam.json（objective/subjective 两段·schema 如上）」要求（A3 位置效应经验：schema 模板显眼位·pre-fill 提示）。

## §三 · 影响面与回滚

- 影响件：round_runner（轮末钩·中改）／chain_runner（零改·段序不动）／score_skill_spawn（SEATS 回滚两席=即行）／plan_skill_spawn（出题 prompt 扩）／close_skill_spawn（默认 flip）／score_cli（输入面扩·读 exam.json）／exam.json（新产物）；
- **回滚**：全件 bak 三形+env 开关（`SCORE_SKILL_SEATS`/`FADE_PLAN_SPAWN`/`FADE_CLOSE_SPAWN` 现成）+轮末钩 flag 开关（联审开/关 env·建议加）——一键回退各面；
- **点火前值面探针**（本席裁）：exam.json schema 合规（两段非空+五字段/断言形）+SEATS 两席实证+段 3/8 spawn 现形+轮末钩触发实证+停面/auto_dispatch 照旧——**不过禁点火**。

## §四 · 使用依据

CEO 批任务书 v7（04e6df8a9）+COS 转达（两件定形请）+本席对表勘正版 12289ee51（层级分离/无段 11）+勘定卷 43a6dfa08（两机制分离）+P4 组件卷（177feb8/aa5a7cf/5401807）+P3 卷（plan/close spawn 存量）+A3 卷（位置效应）+D-15/D-24/D-27 v4/D-46/D-47/D-76/D-84。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕
