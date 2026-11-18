# Score Skill 卷模板 · fade-001 十阶段内评卷面（O2 件·COS+COO 双签评卷·新结构首轮起用）

- date 现查: 2026-11-18T05:39:15Z（D-47 形·notice-179 A 施工序第三节点·O3 码面 12eef86 落位后承）
- 席位: COS+COO 评卷（定谳 3·notice-179② 语义勘定：十阶段内评卷面·与 7 席联审 loop 尾段正交）
- 模板性质: Score Skill 段产卷合同（首轮起每轮评卷按本模板出卷·判卷规程卷 v2 增补随线）

## §一 · 卷面 schema（engine 消费位对表·O3 载）

```json
{
  "score_version": "2.0.0-ns1",
  "run_id": "<shift-run-id>",
  "stage_face": "score-skill",
  "entries": [
    {"criterion": "I1 搬移清单判断正确性", "score": "<0-4>", "rationale": "<锚文判读必经步+逐案 annotation 面·禁裸分>", "evidence_ref": "<run_dir 相对路径#锚>"},
    {"criterion": "I2 规划合理度", "score": "<0-3>", "rationale": "<批次/预案/降级链三面评读·禁裸分>", "evidence_ref": "<run_dir 相对路径#锚>"},
    {"criterion": "I3 判断留痕质量", "score": "<0-3>", "rationale": "<指针可达+annotation 实值面·禁裸分>", "evidence_ref": "<run_dir 相对路径#锚>"}
  ],
  "judge_faces": {
    "initial": {"seat": "<COS|COO>", "scores": {"I1": "<n>", "I2": "<n>", "I3": "<n>"}},
    "joint": [{"seat": "<席>", "scores": {"I1": "<n>", "I2": "<n>", "I3": "<n>"}}],
    "final": {"seat": "m-duty-cos", "divergence_review": "<分差≥2 档复核 rationale·亲验面>", "final_scores_basis": "<维持或改判依据>"}
  },
  "weight_face": {"objective_machine": 65, "subjective_i_family": {"I1": 14, "I2": 11, "I3": 10}, "total_basis": 100, "anchor": "notice-180 裁①＋COS 勘定卷 §一（65/35 采纳·I 族 14/11/10 映射）"},
  "check_time": "<D-47 现查原值>"
}
```

## §二 · 评卷纪律（c 形三段承·r1 教训五项入模）

1. 初判=值席三件套（rationale 禁裸分＋evidence_ref＋D-47 戳）——**逐案 annotation 实值面必评**（r1 缺陷①③对表）；
2. 可选联审=触发面制（fail 案/边界案/分歧案·五席角度 checklist 承）；
3. 终判=COS·**分差≥2 档强制复核**（divergence_review 亲验面必载）；
4. readings↔清单全对表面必评（r1 缺陷②对表）·硬时钟授权链落卷面必评（r1 缺陷④）·upgrade_list 实判面必评（r1 缺陷⑤）；
5. 两维度正交承录：本卷=fade-001 十阶段内评卷·7 席联审=loop 尾段（禁混打·r106 承）。

## §三 · engine 消费位

- run_dir/score-skill.json 落卷（与 subjective-score.json r1 形承继·新结构轮起用本名位）；
- O3 消费面对表：validate_improvement_opinions（联审面）＋NEW_STRUCTURE_WEIGHT（120 归一）＋aggregate_improvements（尾段面）。

—— COS 小贾（Score Skill 卷模板·O2 件·归转 BOD 同步呈 CEO）

## §四增补 · dimA 增维两亚面（notice-201③·da46561b0 APPROVE·ns3 基线窗生效·2026-11-18 增补段）

- **dimA=「整个 loop 的完善程度」**两亚面分列评分（半权 50/50 归位·A1 判据零动）：
  - **A1 实现完整度**：十阶段链产物完备性/规范遵循度（旧面全谱承·判据零变）；
  - **A2 loop 机制完备性**（机制漏环节自揪面）：三锚评审问句——①判卷路由面（convene spawn 全席到位否·缺席 root-cause 载·路由漏发起环节？ns2 实证=convene spawn 三席缺席 63938e61e）②服务供给面（composition/env/令牌通道断言缺位·已入 preflight 断言族防复发否？ns2 实证=agentPresets 提供行缺）③触发调度面（采集/评分/复盘窗触发调度环节漏·应自动采集形排入 trigger 链否？ns2 实证=collection 首采连续轮未落）。
- **A2 评分语义**：机制漏环节每实锚一处=dimA 扣分（阻断级>调度>断言缺位）；improvement_opinions 机制自揪条=dimA 加分证据（自揪激励·防报喜藏缺）。
- **衔接**：WP9 v3 漏环节清单=评审输入基座（评审→登记→修复→下轮防复发核闭环）；机判 rubric 九族零触·fade-001 卷面 65/35 零感（两面分立）。
