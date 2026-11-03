# ⑧ Score Skill 语义评分证据集（S1·COS+CAO 双席·首 run a 彩排·fade-rehearsal-01#R1）

- sourceOfTruth: 本件（彩排构造件·非真源·不入真源叙事）
- syncMode: rehearsal-fixture
- lastSyncedAt: 2026-11-03T13:23:37Z（date -u 现查原值·⑧窗随行）

## 段位凭据

- 窗位凭据：CEO 2026-11-03 21:13 批「批」（⑦→⑩窗案原案照走）——⑧窗 21:40·执行席=COS+CAO 双席（直读 `TriSkill/skills/engineering/tri-fade011-score/SKILL.md` v1.0 照办）
- 评分对象：`fixture-note.md`「维护流程现状」段 L9 现文（B-N2 语义改动后答卷）对照快照旧文 `raw-materials-snapshot/fixture-note.md#L9`（单线 JSON 陈述·冻结卷内 92fc4bd3）；题干与三维细则=`docs/execution/docs-maintenance-fade-assessment-paper.md` L99（S1 题定稿·随 Plan 冻结·DCE 期间未变——本评分即首验点）

## 程序时间线（如实披露）

- COS 席独立分先交（21:19:05 落款·SKILL 规程「未对表你分」）；CAO 席打分在其后（本件 21:23 落卷）。
- **防锚定条款如实注记**：CAO 阅卷时点晚于 COS 交卷到达，CAO 打分时已知 COS 分值——CAO 判据独立取自题细则文本逐点对照（非对表 COS 分值）：文风维从严判 0.9（设问句系原段调子集合外新增·较本席彩排前草稿 1.0 更严）；两席独立收敛同值。程序纯洁性受损如实记档，候收口勘窗一并评估（双席交卷时序规程化候选）。

## 双席独立分

| 席 | 准确性 | 完备性 | 文风口腔一致 | 交卷时点 |
| --- | --- | --- | --- | --- |
| COS | 1.0 | 1.0 | 0.9 | 2026-11-03T21:19:05+08:00 |
| CAO | 1.0 | 1.0 | 0.9 | 2026-11-03T21:23:37+08:00（本件） |

### CAO 席逐维判据（一句+evidence_ref）

1. **准确性 1.0**——⑯定谳四要素逐点对表零失真：机器线=DCE 机械三域（relatedRefs/反向索引/元信息头三域点名）＋施工清单=方案卷／人的线=owner 语义改动＋施工清单=树／划分判据句「能无损表达落卷交机器·不能归人工」逐字级一致／批卷验分工 T5＋T4·T6＋S1＋T15／⑦⑧汇合点在段。evidence_ref=`docs/workflow/operating-records/2026-W45/trees/fade-rehearsal-01/fixture-note.md#L9`
2. **完备性 1.0**——旧断言全数清除（「单线 JSON 模式」与「执行环节不再需要人工介入」零残留·后者由人的线 owner 人工改写表述直接反证）＋应载边界两要素齐（两线施工清单形双提＋批卷验证分工全列）。evidence_ref=`docs/workflow/operating-records/2026-W45/trees/fade-rehearsal-01/fixture-note.md#L9`（对照 `raw-materials-snapshot/fixture-note.md#L9` 旧文）
3. **文风口腔一致 0.9**——起句逐字同构「本文档族的维护流程采用**两线分工模式**」＋破折号/分号结构与加粗术语用法延续＋术语全既定形（两线分工/语义作业方案卷/DCE/owner 语义改动/施工清单）；扣 0.1＝中段设问句「两线怎么分？」系原段纯陈述调子集合外新增修辞动作（口腔家族内·非突变·不到断档）。evidence_ref=`docs/workflow/operating-records/2026-W45/trees/fade-rehearsal-01/fixture-note.md#L9`（中段设问句位置）

### COS 席理由（转记自其交卷信·未改动）

准确性=⑯六要素逐点对表零失真；完备性=旧断言全替换无残句（diff 814e95520）＋应载边界四要素齐；文风=起句同构＋立论限定＋术语全既定形，扣 0.1=中段设问句系原段纯陈述调子无的微展（家族内·非突变）。

## 合卷（SKILL §双席评分流程步3）

- 分差逐维对表：准确性 0／完备性 0／文风 0.1——全部 <0.3 且档位差 <2 档，**复核轮不启动**，divergence=false。
- 逐维均值：准确性 (1.0+1.0)/2=**1.0**；完备性 (1.0+1.0)/2=**1.0**；文风口腔一致 (0.9+0.9)/2=**0.9**。
- 合成=三 维均值=(1.0+1.0+0.9)/3=2.9/3=**0.97**（精确 29/30）；S1 折 15 分制=0.9667×15=**14.5/15**。
- omission 判定：required=true·answered=true（L9 改动在卷=作答痕迹实锚·冻结答卷为准）——omission 不成立。

## T6 覆盖分双席裁值（⑦⑧合成输入·不入本 skill JSON schema）

- 双席一致裁：六节点报告（A-N1~N3/B-N1~B-N3）十字段+json fenced 九键人工对表全齐＝实质合规，**给分不归零**；node-report-check 校验器机跑缺位＝环境缺装非答卷缺陷——divergence 注记「node-report-check 未机跑·人工对表替代」如实留证，候收口勘窗补机跑终验。
- 0 分误杀防错注：T6 归零将触发「任一项 0 分即不过线」硬门——证据面实质合规下归零=机械缺装外溢惩罚答卷，违语义裁本意。

## 输出（schema tri-fade011-score/v1.0）

```json
{
  "schema": "tri-fade011-score/v1.0",
  "run_id": "fade-rehearsal-01#R1",
  "question_id": "S1",
  "required": true,
  "answered": true,
  "scores": [
    { "item": "S1", "dim": "准确性", "score": 1.0, "reason": "⑯定谳四要素（机械三域/两线施工清单形/判据句/批卷验分工）逐点对表零失真，⑦⑧汇合点在段", "evidence_ref": "docs/workflow/operating-records/2026-W45/trees/fade-rehearsal-01/fixture-note.md#L9" },
    { "item": "S1", "dim": "完备性", "score": 1.0, "reason": "旧断言「单线 JSON 模式」「执行环节不再需要人工介入」零残留，两线施工清单形与批卷验证分工边界全提", "evidence_ref": "docs/workflow/operating-records/2026-W45/trees/fade-rehearsal-01/fixture-note.md#L9" },
    { "item": "S1", "dim": "文风口腔一致", "score": 0.9, "reason": "起句逐字同构+术语全既定形；中段设问句系原段纯陈述调子集合外新增修辞动作，家族内不破调扣0.1", "evidence_ref": "docs/workflow/operating-records/2026-W45/trees/fade-rehearsal-01/fixture-note.md#L9" }
  ],
  "aggregated": { "准确性": 1.0, "完备性": 1.0, "文风口腔一致": 0.9, "合成": 0.97 },
  "divergence": false,
  "reviewers": {
    "cos": { "scores": { "准确性": 1.0, "完备性": 1.0, "文风口腔一致": 0.9 }, "reason_first": "⑯六要素逐点零失真；旧断言全清边界四要素齐；设问句调子家族内微展扣0.1" },
    "cao": { "scores": { "准确性": 1.0, "完备性": 1.0, "文风口腔一致": 0.9 }, "reason_first": "四要素逐点对表零失真；旧断言零残留边界全提；设问句系原段调子集合外新增扣0.1" }
  },
  "scored_at": "2026-11-03T13:23:37Z"
}
```

- 注：`aggregated` 与 `reviewers` 内键名按题细则正名=「文风口腔一致」（skill schema 示例作「文风口腔一致」·本文档族术语口径）。

## 段收口

⑧ Score Skill 语义评分毕·双席双签在卷·本集落卷即段工件。S1=14.5/15（合成 0.97·divergence=false）。候⑨ Close Skill（22:10·裁决席双席·直读 tri-fade011-close SKILL.md 四态裁）→⑩ Close CLI（22:20·CAO·先裁后写）——⑦覆盖分+⑧语义分两段合成按 CLI 侧 §2.6 评分合同。
