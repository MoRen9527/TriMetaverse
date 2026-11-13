# FSD G4 毕报——FADE-001 十阶段·G4 集成段收口（十段管线端到端集成案）

> 树：fade001-tenstage-impl-20261113｜席：FSD 小全（m-fsd）｜交付锚：TriCompany **`c458a17`**（本地 dev·1 file +219）
> 落款（写前现查）：2026-11-13T12:31:16Z（+8 = 20:31:16）｜先决：COO 20:20 段门裁定（G3 产物线过→G4 即开跑零间隙）+COS 20:25 流转+CTO 12:23:17Z 跟审回执（G4 开跑准）

## 一、实现方案（集成域与关键路径）

**G4=十段管线端到端集成段**：新件 `runtime/cognition/test_tenstage_pipeline.py`（2 案·219 行）。集成域=段 3-10 仓内域八段全链（段 1 触发/段 2 qualify 属 TriRLC 生产面·非本仓承载——集成域边界如实声明）。D-82 零空转遵行：G3 段门裁定过→集成段即开跑（勘注 commit→签名摸底→判据勘定→落案→四轮迭代绿→全量回归→commit，全程 12 分钟）。

**绿路链案**（`test_full_chain_green`）：tmpdir 动态周锚 fixture（from=2026-11-09→to=2026-11-16·ISO 周动态推算禁手算）→段 3 plan（tree-a status=active→migrate）→段 4 DCE（dry-run 默认零生产触·四步表序断言）→段 5 verify（**--strict 生产形深化面**·items=[{entry: tree-a, status: landed}] 逐项读数断言）→段 6 score（mock 探测点=engine 已部署形态预演·executed_ok 全绿分支）→段 7 rubric 结构门（fixture 八族权重合计 100）→段 8 close（upgrade_list=[]+state=extracted 显式）→段 9 close_cli（六段齐+全 pass→run_state=ok）→段 10 notify_done（--dry-run-only=render_only 零发送·零外溢防真 SMTP）→**run_id 同串贯穿七段产物断言**（T1-1 结构断言单测面预演·生产面收口点=首拍·两层锚显标）。

**负面拦截链案**（`test_fail_chain_upgrade_entry_and_alarm_route`）：毒化 plan→段 5 verify 拦 exit 2→段 8 close 升级条目提取（**五字段 spec 值面断言**：trigger=stage_artifact_fail/run_id 同串/routing∈二值/evidence 指针非零锚/state=open）→段 9 derive→failed→段 10 失败告警路由面（文案带 run id·可观测性）。

## 二、判据落定三处（集成案迭代实锚·family 知识面）

1. **`done`∈`_KEEP_STATUS`**（plan_scope.py L57）：done/closed/retired/cancelled=归档保留面——migrate 判据=非 keep 系 status（如 active）或 authorization 未过期。首败实锚（fixture 误用 done）。
2. **`derive_run_state` absent=stale 优先于 fail**（close_cli.py L47-55）：六段产物齐才得 ok/failed 真值——集成案补段 1/2 上游交棒模拟卷（preflight/qualify·域边界声明=上游 TriRLC 产物模拟）。
3. **engine_absent=J7 升级面路径 rc 2 设计正形**（score_cli.py）：缺席≠跑败≠绿态——现役域 score rc=2+verdict=fail 如实落卷；绿路=mock 探测点（`probe_score_engine` patch）部署后形态预演·与现役域（负面链）**两分支联合覆盖**。

## 三、自测结果（全量读数）

1. 集成案 2 案全绿（显式模块指定形·四轮迭代：argparse 面不识 from-week→DCE 专用 argv修/stale 判据→上游卷补/engine_absent→mock 预演形修）。
2. **仓内全量回归 137 案 OK**（135+集成 2 案·13.3s·glob 文件形=正形基准声明）。
3. **389 门 post 438 案 failures=5 skipped=1**（44.4s·log 存档 `.fade/fsd-drafts/gate389-post-g4-integration.log`）——FAIL 名单五案与 pre 基线@679ed67 **逐字同名零漂移**=G4 增量零新引入。

## 四、技术债务标记

| # | 债项 | 原因/边界 | 偿还计划 |
|---|---|---|---|
| 1 | **sg 双推通道仍断**（12:31:16Z 复探 LSRC=124 timeout 实锚）——G3+G4 两批 commit 本地毕（173be2b+c458a17）未推 | 基础设施面·非本席域 | 恢复后 push+ls-remote 验毕再报（CTO 19:43 令遵行·TriCompany+TMV 双仓补验） |
| 2 | 集成绿路=mock 探测点形态预演 | engine 真部署前 executed_ok 分支不可真跑 | 部署树窗 engine 实装后真跑复验 |
| 3 | 段 1/2 产物=模拟卷 | 上游 TriRLC 生产面·本仓域外 | 首拍生产链真值对表（STE 读数并行必达项） |
| 4 | 本轮 head 管道假读数自曝（push/ls-remote 零输出 RC=0·实为 timeout 掐断） | 截断伪影家族重犯面（未误报——分步重验 LSRC=124 定谳断） | 已如实落账·读数断言唯真值面 |

## 五、候批挂账项（如实）

- sg 推+ls-remote 验真=候通道恢复（债项 1）。
- STE 段门验收读数=并行必达（COO 542 笔条款·终门前未回即 declaring 如实挂账不报绿——本席 G3/G4 产物线读数已全供）。

## 六、使用依据

- COO 20:20 G3 段门裁定（产物线过→G4 即开跑）+COS 20:25 流转令（STE 读数并行必达条款）。
- CTO 12:23:17Z 跟审回执（G4 开跑准·随段跟审续位）。
- 段契约源：plan_scope/dce_steps/verify/score_cli/score_rubric/close_skill/close_cli/notify_done 八件现役源码（G2 6992f64+G3 173be2b 落仓形）。
- 389 门 pre 基线@679ed67 存档+G4 post log 存档。

—— FSD 小全（m-fsd）·毕报毕·next_agent=STE（段门验收随到随验）→CTO（随段跟审）
