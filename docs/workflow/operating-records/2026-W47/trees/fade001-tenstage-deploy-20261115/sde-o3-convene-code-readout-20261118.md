# SDE O3 联审码面施工毕报·loop_autoreview 四项扩展毕（notice-179①②③④·白盒单测四态全过·第六单笔 12eef86）

- sourceOfTruth: 本卷（O3 联审码面施工毕报正形）
- syncMode: write-time
- 执行席: SDE 小布；令源=BOD notice-179（CEO 三裁·O1-O4 全批·O3 联审码面派工 M-SG 席组）+O1 COS 规划卷 §三对表
- 施工窗: 2026-11-18T05:3xZ→05:37:50Z（date 现查原值·D-47 全程）
- 判定: **loop_autoreview.py 四项扩展毕（TriCompany dev 12eef86·双推 sg bare+github+河源 ff 同步·py_compile+ast+单测四态全过）——新结构轮码面 ready（候 Score/Close Skill 卷模板工序→河源执行切换）**

## §一 · 四项施工读数（notice-179①②③④ 对表）

| 项 | 施工面 | 读数 |
|---|---|---|
| ① convene schema 改善意见必付面 | `validate_improvement_opinions()`：双 topic（周迁移质量/fade-001 自身完善度）必付对表+每条三件套（rationale 禁裸意见/evidence_ref 可复核锚/check_time D-47 戳）——**缺=sheet 不完整 fail-closed 不消费不冒充**（卷面落卷留审计·聚合排除·incomplete_faces 如实列） | ✓ 单测四态全过（完整/缺 topic/裸意见/空面） |
| ② aggregate 改善意见聚合面 | `aggregate_improvements()`：14 面意见汇出（按 topic 分桶·seat/rationale/evidence_ref/check_time 全载）+sheets_consumed/incomplete_faces_excluded 对表+loop 进化方向输入面用途注（改进意见卷随触发件流转） | ✓ |
| ③ threshold 95+权重面 | `NEW_STRUCTURE_THRESHOLD=95`（判定线·自新结构首轮起用·**enforcement=joint_review_recycle --threshold 带值位·零硬编码改链**）+`NEW_STRUCTURE_WEIGHT` 十段各 10+改善意见面 20=基准 120 归一（engine 消费面对表锚）——旧 70 值=r1 存档面零触（C 款遵行） | ✓ 常量面+语义注记落码 |
| ④ 毕报四要素承载面 | `report_four_elements`（aggregate JSON 内嵌）：COS plan 实录指针/评卷实录指针（subjective-score.json judge_faces 三段）/每席评分（sheets 分列）/每席改善意见（14 面必付对表） | ✓ |

- prompt 模板随迁：spawn 输出契约增 improvement_opinions 必付面+缺面 fail-closed 注记（spawn 面即教·零事后补面）
- 权重面 scope 如实注：120 归一 engine 消费面**本体**=Score/Close Skill 卷模板工序承载位（notice-179 A 施工序下一位·本笔=loop_autoreview 语义常量对表锚·零越域改 score_engine 现役面）

## §二 · 质量面

- py_compile+ast 双检 ✓（sg+河源双机）·单测四态全过 ✓（validate 完整/缺 topic/裸意见/空面+aggregate 双面+常量值面对表）·CLI --help smoke ✓
- aggregate() 既有面零损（aggregate_initial/终审签认位 r119④ 防线双层保持·插入切割面一度误伤=编译检捕获即修·如实注）
- r1 存档面零触 ✓（scores 15 件+recycle verdict+重组呈批件零触碰·C 款）
- 单笔 revert 一键形照承（4065c32/d5f2196/7126ddd/e06b66c/12eef86 族）

## §三 · 候面

- Score/Close Skill 卷模板工序（A 施工序下一位）+判卷规程卷 v2 增补（STE 随线）+河源执行切换（新结构首轮触发面=O3 码面+模板落位件·O1 §一触发定谳）
- 新结构首轮运行形：loop_autoreview --spawn（改善意见必付面 spawn 即教）+recycle --threshold 95 带值

## 使用依据

notice-179 三裁令文+入账卷（A/B/C 款）；O1 COS 规划卷 §三（权重面/threshold/检查项⑩ 改善意见 14/14 必付）；loop_autoreview.py 12eef86 diff；单测四态实录（本卷 §一）。

—— SDE 小布（毕报=落卷+SendMessage 直达值席→m-cos→BOD→CEO·卷面时戳=commit %cI）
