# FSD G3 毕报——FADE-001 十阶段·G3 段落仓收口（段 4/7 骨架+段 5/8 深化扩形）

> 树：fade001-tenstage-impl-20261113｜席：FSD 小全（m-fsd）｜交付锚：TriCompany **`173be2b`**（本地 dev·8 files +747/−16）
> 落款（写前现查）：2026-11-13T12:18:49Z（+8 = 20:18:49）｜先决：CTO 19:43 落仓准令（落仓与测试面零阻）+COO 19:15「G3 即开跑」裁+COS 20:13 裁决 B 语义三源对表毕即启（候裁定卷过度候批自领定性已另发 COS 回执 1a70ce7f）

## 一、实现方案（段范围与关键路径）

**G3=段 4 DCE 骨架+段 7 score skill 结构门（两段骨架化）+段 5 verify 生产形深化扩形+段 8 close 升级条目五字段 spec（两段深化）**。零生产触铁律遵行：段 4 默认 dry-run（`args.dry_run = not args.execute`），--execute 为部署树生产 wiring 保留位今晚零调用（subprocess.run 零调用有机械断言案常备）。

| 段 | 件 | 关键路径 |
|---|---|---|
| 4 DCE | `runtime/cognition/dce_steps.py`（新） | `DCE_STEPS` 四步表 pull（ff-only·rc_guard）→migrate（`weekly_plane_shift` CLI 全名消歧·CTO 勘正在案）→commit（统一 add+commit）→push（rc_guard=False·断通道降级如实注）；`render_steps` 模板渲染零执行；`run_dce` rc_guard 拦=停段 exit 2 带 `failed_step`+后续步骤零执行；`OVERFLOW_CHECKS` 零外溢三判据位（week_dir_structure/carry_over_semantics/commit_message_shape·aca95877c 口径原样）骨架态 checked=False 落卷 |
| 5 verify | `runtime/cognition/verify.py`（改） | `check_migrate_against_index` 改三元组返回 `(ok, reasons, items)`；items=[{entry, status: landed\|missing}] 逐项读数（PM §一段 5 行）；strict 面出列·非 strict 不出列（两层锚显标）；docstring 带 CTO 注一措辞精化（doneFromPrev=迁移器落点写实装·activeTrees=周内开工面落点只建 key 兼容·锚 weekly_plane.py L282-283/L208）；run_verify 挂 `entry["items"]`（非空时） |
| 7 score skill | `runtime/cognition/score_rubric.py`（新） | **考卷侧零改动遵行**（首拍清单卷正身零复制零改动）；结构承载=`RUBRIC_COLUMNS` 八列族+`validate_rubric` 四门（列族完整/族号 A-H/权重合计=100/族号唯一）+红灯上限映射 `_REDLINE_CAPS` C=79·G=59+F2 免评分母 `F2_ZERO_TRIGGER_FULL_SCORE=True`；**T1 定谳填位**=`T1_CANDIDATE_NOTES`（a2c246908 三断言原样零修订+「候施工验收毕生效」标注·CPO 裁③落位≠改卷生效+零权重条款+联合覆盖语义注·CTO 19:44 补注全文+五指针） |
| 8 close | `runtime/cognition/close_skill.py`（改） | `scan_stage_artifacts(run_dir, run_id="")` 扩签名；升级条目五字段 spec（PM §二·CPO 主稿 §六点名）：run_id（`shift-W\d+-\d{8}T\d{6}Z` 贯穿）/stage+trigger（三枚举 stage_artifact_fail·J7_score_engine_absent·artifact_unreadable）/routing（候 COS 二值·D-39 对表终裁归 COS 分诊）/evidence（段产物路径指针·禁零锚）/state（open\|routed 默认 open）；防蠕变划线：清单=提取与承载不做裁决·零裁决语义字段进 schema |

配套：`test_dce_steps.py`（8 案）+`test_score_rubric.py`（10 案）新写；`test_verify.py`/`test_close_skill.py` 案扩断言（items 断言+五字段 spec 案）。**家族输出编码修**：`sys.stdout.reconfigure(encoding="utf-8", errors="replace")` try/except 兜底插于 `print(out)` 前（GBK 炸 ⊂ 实锚·落卷面 write_text 原有 utf-8 不变）——G3 八件随批落形。

## 二、自测结果（全量读数·三面）

1. **沙箱 94 案全绿**（落仓前）：dce_steps 8+verify 18+close_skill 11+score_rubric 10+既有四件（plan 27/score_cli 5/close_cli 7/notify_done 8）。
2. **仓内回归 135 案全绿**（落仓后·glob 文件形=正形基准·毕报声明形态）：`unittest discover -s runtime/cognition -p "test_*.py"` → Ran 135 tests·OK·11.387s（94 G3 面+41 既有案）。
3. **389 门 post 全量对表**：`*_validation.py` discover → **Ran 438 tests·FAILED (failures=5, skipped=1)·48.155s**——对 pre 基线@679ed67（提前跑毕存档 `.fade/fsd-drafts/gate389-pre-g3-baseline.log`·读数同构 438/5/1）**FAIL 名单五案逐字同名零漂移**（frontmatter parity/lg024 test_6/lg025_m0d test_1/seats pipeline 两案·source-agents 契约演进 vs 测试期望滞后既有族）——**零新引入·对表判定过**。

runner 形态声明（STE 设计基座第六条）：本毕报读数=glob 文件形；显式模块指定形与 glob 文件形同源同读数（G2 毕报勘注已声明·本批同形）。

## 三、技术债务标记（识别即标记·偿还计划随行）

| # | 债项 | 原因 | 偿还计划 |
|---|---|---|---|
| 1 | `dce.json`=段 4 产物文件名（PM §二文件族表未列段 4 产物） | 骨架先行·文件族表缺位 | 候 CTO 对表注记（落仓审面窗） |
| 2 | OVERFLOW_CHECKS 三判据 checked=False | 骨架态=口径位声明·真值对表需生产 wiring | 部署树授权窗实走真值对表 |
| 3 | 段 7 改卷生效未发生 | CPO 裁③程序位钉子：落位≠改卷生效 | 生效动作锚施工验收毕时点（施工毕→段门验收毕→改卷生效→周日 23:50 首拍） |
| 4 | J5 首拍 fallback 与告警面聚合不在升级条目枚举 | 骨架枚举三触发=段产物域·J5 属运行时域 | 生产形候项（如实不在骨架·候部署树窗扩形） |
| 5 | push 步 rc_guard=False+ls-remote 验真未实装 | 断通道降级如实注·验真属部署树 wiring | 部署树窗 wiring 实装 |
| 6 | G2 六件编码修不 amend（已推 sg 顶） | amend 纪律禁推后改写 | 随本批推 sg 即同步（通道恢复后一并到位） |
| 7 | **sg 双推通道断挂账**（19:25 起 47.245.122.61:22 timed out·三源实锚含 Q2 拉取器自告警 11:40Z；20:18 复探 push/ls-remote 双零输出仍断） | 基础设施面·非本席域 | **commit 本地毕+恢复后 push+ls-remote 验毕再报**（CTO 19:43 令遵行）——TriCompany/TMV 双仓补验 |

## 四、候批挂账项（如实·裁决 B 语义：候批不挡骨架/深化面）

- 段 4 DCE=部署树份额（生产形 wiring+零外溢真值对表）——候部署树授权窗。
- 段 7 考卷改卷生效——候施工验收毕时点（CPO 裁③工序序）。
- sg 推+ls-remote 验真——候通道恢复（债项 7）。

## 五、使用依据

- CTO 19:43 定谳令（3d5b7dc3f·T1 填位指令+G3 落仓预告）+19:44 补注（联合覆盖语义注）+19:13 审面两注（activeTrees 措辞/per-item nice-to-have）。
- STE 草案正身 a2c246908（T1 三断言原样源）。
- PM `pm-stages4-10-product-segment-20261113.md`（§一段 4/5/7/8 行必填+§二五字段 spec）+`pm-firstshoot-reading-checklist-20261113.md`（考卷侧零改动遵行源）。
- COO 拆树任务书 `dispatch-plan-coo-20261113.md`（G3 段序七步）+COO 自省卷 §四（随到随验）。
- COS 20:13 催办令（裁决 B 语义：候批只挡生产形终稿）。
- 389 门 pre 基线存档 `.fade/fsd-drafts/gate389-pre-g3-baseline.log`（@679ed67）+post log `.fade/fsd-drafts/gate389-post-g3-landing.log`。

—— FSD 小全（m-fsd）·毕报毕·next_agent=STE（段门验收随到随验）→CTO（随段跟审）
