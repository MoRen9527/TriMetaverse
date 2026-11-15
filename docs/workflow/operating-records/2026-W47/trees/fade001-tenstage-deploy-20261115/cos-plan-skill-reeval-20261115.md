# COS 线 1 定谳卷·每周必迁文件清单定谳+核实链归集+I 族覆盖度确认（CEO 三道令 r72/r73/r78 并卷·BOD 第 80 轮补投）

- sourceOfTruth: 本卷（docs/workflow/operating-records/2026-W47/trees/fade001-tenstage-deploy-20261115/cos-plan-skill-reeval-20261115.md·线 1 定谳正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: CEO 三道（19:01:42 三问重估/19:31:31 体系定形线1/20:16:42 W46 完整起点）→r72/r73 并卷原令面断链（本席 646 笔未接到如实回执）→BOD 第 80 轮补投 20:31（r78 CEO 补正件随卷·task-inventory 五件定谳）→本卷
- 用途: 落卷回执 BOD→BOD 呈 CEO（19:07 显式令「重估卷出来后呈我看」）+知会值席——**落卷=三闸闭=loop 第 1 轮发令点**（线2 CAO 定义卷另面并行）
- 落款: 2026-11-15T20:33:12+0800（写前现查·D-47 正形）

## §一 · 必迁清单定谳（周期滚动族五件+固定件·逐件判定+依据）

**判定口径**：family 枚举与投影规则=清单卷 f13880a08 §一五分类+CTO 栏 A 十项终裁投影（4a6c9c0c2 §二：carry_periodic→migrate·其余四族→keep+语义标注·new_week_templated=expected_absent 预期态零产骨架首版形）。「必迁清单」语义=每周必须现位的件（迁移器物理搬运或 owner 席惯例立卷承载·两类都计入必迁面）。

| # | 件 | family | 判定 | 依据（锚） |
|---|---|---|---|---|
| 1 | company-demand-pool.md | carry_periodic | **migrate**（同名平移） | W41 起连续在位（MIG-W41-demandpool 核销定谳「模板平移已执行且在用」）；五连断档人工补课实锚（W46 补课批 0b1c6eb1a）；清单卷 §二.1·投影规则命中 |
| 2 | daily-progress.md | carry_periodic | **migrate**（新周承接段骨架或平移·首拍毕本席补课线承接） | 当前周判定锚（含 daily-progress 的最大周名目录规则——缺件=当前周判定断锚）；W46 件 11-09 duty-cos 手动建实锚迁移器零搬运（9ed2e30e2/c6a325f4f）；清单卷 §二.4 |
| 3 | cfo-quota-daily-wXX.md | new_week_templated | **keep+expected_absent 标注**（迁移器零产骨架）·内容面=CFO 周惯例立卷承载必迁面 | W46 件 CFO 手动立卷先例（58c6469d7「立W46日报件」）；周后缀参数化·CTO 投影规则四族 keep（4a6c9c0c2 §二）·清单卷 §二.5 |
| 4 | scoring-ledger-wXX.md | new_week_templated | **keep+expected_absent 标注**·内容面=CHO 周惯例立卷承载必迁面（首拍评分窗前） | W46 件 CHO 手动立卷先例（9767d07b9「W46账面立卷」）；同上投影规则·清单卷 §二.6 |
| 5 | task-inventory-YYYYMMDD.md | carry_periodic（**r78 CEO 补正入族**） | **migrate/新周铸件义务**（值席或 owner 席周起点铸·W46 起点 task-inventory-20261115 已铸验收过·值席验收卷在树） | **本席清单卷散文件族清点漏项实领修正**：原判 one_shot 不迁系 W46 顶层清点漏数该件所致——glob 实锚=周件族 W39 起连续在位（W39×2/W40×3/W41/W42/W45/W46 全在）·CTO W44 审计卷 r78 勘正项 L5「task-inventory 面=缺坐实=必迁族漏迁候选实锚（第五件）」·r78 CEO 补正定谳覆盖本席原判定 |
| 6 | OP-*.json（周索引） | carry_periodic | **migrate**（现役迁移器白名单内·机械面照走） | 唯一真迁移器产物先例（6860bf87b 11-09 17:24 ops weekly plane shift）；T3 预演 counts migrate=[fade001-phase1-build-20261114·authorization_active] 机械面实测 |
| 7 | OP-*.unresolved-items.md | carry_periodic | **migrate+dst 头部刷新四字段**（标题/真源路径/lastSyncedAt/继承链·CTO 栏 A 笔5 顺修） | 5 连实锚家族（W42-W46 头部残留）；6860bf87b 先例；清单卷 §二.3·4a6c9c0c2 ⑧项采认 |
| 8 | 树目录族 | active_tree_ongoing / weekly_selfbuild / one_shot 三族 | **keep**（不迁：挂账台账线跨周承接 / 新周自建预期态 / 历史冻结 git 可溯） | 清单卷 §三 35 条目逐条判定·CTO 投影规则「树级 migrate≈零·真迁移面=顶层 carry_periodic 文件族」（4a6c9c0c2）·T3 实测 keep:33 零误迁 |

## §二 · 迁移正确性核实链归集（六项读数逐项呈明·锚全录）

| # | 核实项 | 读数 | 锚 |
|---|---|---|---|
| 1 | bidirectional 双向一致 | **bidirectional_ok=true**（两轮全等·确定性执行面旁证） | CTO T3 终判卷 §一③（cto-t3-preview-verdict-20261115.md·a558e3f93） |
| 2 | counts 自洽 | {migrate:1, keep:33, carry_over:2}=1+33+2=36 ✓·carry 2 元 frozen 语义值面 | 同上 §一③ |
| 3 | G5-G6 对表双锚 | demand-pool 缺席=首版预期态零升级（54b4c301f §四）+清单卷对表（f13880a08）——T3 判据④命中 | 54b4c301f §四+f13880a08+T3 卷 §一④ |
| 4 | V4 ops commit 逐字对表 run id | ops commit **862357445**=sg-bare 顶实锚·run 目录 shift-WW46-20261115T084547Z 对表（SDE 补读直读 09:07:21Z·sudo python3 直读零改触·073712Z 对照轮同值） | T3 卷 §使用依据 |
| 5 | agent_readings 双向一致 | **ar_len=41 条双向一致**（=fast_path 11+tree 慢道 23+top_level 7·自洽）·其中 agent=0·failed_fallback=30（unparseable 15+skipped_over_limit 8 设计内+file entry missing 7）=**agent 面降级形如实载**·fail-closed 全谱正确工作（verdict=pass/violations=[]/八键族全在） | T3 卷 §一②+§二 |
| 6 | plan_version 契约面 | **1.1.0**（084547Z 轮+073712Z 对照轮同值） | T3 卷 §一① |

**附：预演 ops commit 三笔处置在账**——本席径裁**保持不 revert**（645 笔·裁据四条：真实经营记录 revert=破坏风险照 c98fd659 先例/幂等已证 af86f74e6/行为等价零影响首拍/CTO 无新意见·D-39 域内·BOD 呈报知情+COO 同步毕）。

## §三 · I 族 10 分判据覆盖度确认（今晚零改卷遵行·补锚建议候首拍后窗）

**判卷锚**=语义锚原句（36bf14a1d L44·STE I1 主源直验形）：「这是一周的记录，还是这一周的活——记录随周封存·活随人带走」。

**覆盖面分析**（两评估对象逐一对表）：
1. **「大表该不该搬」判断质量**：I1 锚文判读**正覆盖**——记录/活标签直判：demand-pool=活需求流（活→迁/续）·task-inventory=活进度评估面（活→周起点铸件）·daily-progress=记录面但承载判定锚功能（活功能→迁）·audit-latest 型按需刷新件=记录封存（→留置）——本卷 §一 五件判定即锚文判读的活用样例·rationale 记录/活标签可落。
2. **「任务书树完成情况评估」**：I 族现有判据（I1 锚文+验收三标准：双向断言/不迁带判据/carry_over 三标注+I 族独立附加分面）对树级判定质量**可判**——T3 counts 面 36 元（migrate 1 案 authorization_active/keep 33 案/carry 2 元 frozen）判定对错可依三标准抽验·α 五席 checklist COS 视角「汇总终判全览」承载评估位。

**覆盖度结论**：I 族 10 分判据对本卷两评估对象**覆盖面成立·基本覆盖**。

**补锚建议两条**（候 STE 改卷窗评估采纳·首拍后窗·今晚零改卷遵行）：
- a) 树收口报告质量判读位——段 6 三态（executed_ok/executed_failed/engine_absent）判读与「树完成情况评估」的显式衔接（现 I 族判据未显式挂段 6 三态判读锚）；
- b) 毕报链完整性抽验位——树终态=毕报卷在链+commit 锚可达（现判据未显式列「毕报链完整性」抽验项·I3 close-evidence 指针面弱化观察项同源呼应）。

## §四 · 令链与素材锚汇总（三闸闭声明）

- 令链三道：19:01:42 三问重估/19:31:31 体系定形线1/20:16:42 W46 完整起点——r72/r73/r78 并卷·BOD 第 80 轮补投（原令面断链定谳后补投·本席 646 笔未接到如实回执在账·自 646 笔起候令 3min 内接令开工）。
- 素材锚全录：清单卷 f13880a08（五分类+顶层 7 件+trees 35 条目）/CTO 栏 A 十项终裁 4a6c9c0c2（投影规则）/T3 终判卷 a558e3f93（核实链六项读数正身）/CTO W44 审计卷（r78 勘正项 L5·f76b3ff4a 批在链）/glob 实锚（task-inventory 周件族 W39-W46 连续）/e 锚裁决 af86f74e6（幂等）。
- **三闸闭声明**：线1 卷=本卷（落卷）+线2 CAO 定义卷（CAO 面并行）+W46 完整起点验收（已达成）→loop 第 1 轮发令点就绪。
- 护栏遵行：评估面零链面改动 ✓·23:50 cron 禁用知情 ✓·本卷纯评估定谳零施工笔。

—— COS 小贾（m-cos·线 1 定谳卷·两职之清单定谳面）·写前现查 2026-11-15T20:33:12+0800（date 现查原值·D-47 正形）
