# STE 收稿 review·D2 令 1 ScoreCLI 白盒 26 案（FSD 候收稿三查·2026-11-20）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·STE review 正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- review 对象: `.fade/fsd-drafts/runtime/cognition/score_cli.py` v2.0.0（md5 05472e0e…·228 行）+test_score_cli.py（md5 13b3533f…·269 行·毕卷 fsd-d2-scorecli-closeout-20261120·TMV 725ddae99）

## §一 · 独立复跑读数（禁转抄·双口径）

| 面 | 读数 | 判 |
|---|---|---|
| score_cli 单件 | **26/26 passed**（pytest rc=0 真值直取·0.09s） | ✓ |
| unittest 口径 | rc=0（`python -m unittest runtime.cognition.test_score_cli`·包根跑位） | ✓ |
| drafts 全谱 | **115 passed** 独立复跑同值（FSD 读数独立验证非转抄） | ✓ |

五族清点对表：ScorePathSplit 4+ScoreWrite 1+ExtractInternalScore 5+RetryGatePure 7+RetryStateIO 3+RetryIntegration 6=**26 ✓**（现役 5 案零改+新铸 21 形成立·三态路径分立零改面读源码确认）。

## §二 · 三锚点判读（FSD 指定 review 面）

1. **escalate exit 0 零熔断：PASS**——两面锚齐：纯函数案（test_capped_then_escalate_not_fuse·escalated:true+封顶后 retry_count 零递增+reasons 含「非熔断」）+集成案（test_ok_escalate_exit_zero_not_fuse·**exit 0 断言在案**+retry_state.json count=2 零写零递增）。语义链完整：呈报面=gate 落卷（escalated:true+reasons）→编排/值席域消费——CLI 面零阻断交棒，D1 §一B「呈报非熔断」成立。
2. **跨周重置域正确性：PASS**——域锚=from_week 单源（score_cli.py L180 当周域锚）·三面案齐：同周累计（roundtrip+集成重跑 count 1→2）+跨周重置（test_week_reset·W46 state→W47 load→0）+坏卷零起步（test_corrupt_state_zero_start）+源码负值防御（L67 count<0→重置）。
3. **键集白名单完备性：PASS（形勘正注）**——案形=**正向白名单**（allowed 11 键+`unknown=set(s)-allowed` 断言空=**完备形**·任何多出键 fail-visible，不依赖禁键枚举谱齐）+四禁键逐一 assertNotIn=冗余第二道（防 allowed 集未来误扩容）。allowed 11 键对源码 score dict 构造面（L167-187：基础 8 键+score+internal_score/retry_gate 条件键）逐键对表 ✓ 零误伤零漏合法键。

## §三 · 观察项三件（非阻塞·如实档）

1. **NaN/inf 域外值面未守**：extract 对 nan/inf isinstance 过→gate 判 `nan>=90`=False→pending_retry 轮，且 `json.dumps(nan)="NaN"` 字面=非严格 JSON（JS 严格解析器炸下游风险）——engine 现役不产 nan·防御面候选（extract 加 `math.isfinite` 守卫）·候修窗随件非本令 scope。
2. **state 负值防御 test 缺案**：源码 L67 负值重置防御已铸·test 无负值直证案（防御面覆盖小缺口·非行为缺陷）。
3. **白名单 scope 边界如实注**：白名单守 CLI **顶层键面**·`score=payload 原样投影`（零改面自证承）——payload 内嵌键不在守域·联审域混挂防线在 engine/aggregate 面（令 2 承）——双分数分立=三层防线中 CLI 层 scope 如此·令 2 aggregate 案补全谱。
4. （随注）**week 值形域约定=编排面契约**：from_week 传什么算什么（CLI 单源锚自洽）——令 2 编排面钉 from_week 值形规范防同值域假重置（state.week≠from_week 即重置）。

## §四 · 收稿结论

**收稿通过**（零阻塞缺陷·三观察项如实档候随件）——ScoreCLI 机械面 v2.0.0 白盒 26 案五族成立·escalate 零熔断/跨周重置/白名单三锚全过·独立复跑双口径同值。令 2 ScoreSkill 承接面条件达成（顺序锁 CLI 毕→Skill 起）。

## 使用依据

- FSD 毕卷 fsd-d2-scorecli-closeout-20261120.md（TMV 725ddae99）+收稿请求（三锚点指定）
- CTO D2 排工令 16db059a3 §三门禁五项·D1 设计卷 v3-final（90e06cddd 语义承）
- 施工件源码直读（md5 双锚在卷）+独立复跑 log（/tmp/ste-scorecli-rerun.log·pytest/unittest 双口径）

—— STE 小柯（m-ste·收稿 review 窗）·写前现查 〔commit 时戳锚·D-47 正形〕
