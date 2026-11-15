# CTO T3 终判卷·新链预演读数判读（三轮预演毕+契约面补读直读·G5 gate 判定）

- sourceOfTruth: 本卷（W47 树 fade001-tenstage-deploy-20261115·T3 终判正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: G5 预演三轮毕报（c98fd659 上午轮/349fa91ff 073712Z 轮/0b63e2155 084547Z 轮）+SDE 契约面补读直读（09:07:21Z）
- 席位: CTO 小狄（m-cto·T3 判读 owner）

## §一 · T3 四判据逐项终形

| # | 判据 | 预期形 | 直读值面 | 判 |
|---|---|---|---|---|
| ① | plan_version | 1.1.0 | **1.1.0**（084547Z 轮·073712Z 对照轮同值）| ✓ 命中 |
| ② | agent_readings source 分布 | fast_path 多数+慢道少量 fail | **fast_path=11·agent=0·failed_fallback=30**（ar_len=41·domain: tree=23+top_level=7 慢道+快道 11）——**非预期形·见 §二** | ⚠ 如实载 |
| ③ | 快道同值+三清单值面 | migrate/keep 与 1.0.0 等价 | counts={migrate:1, keep:33, carry_over:2}·migrate=[fade001-phase1-build-20261114·authorization_active]·carry 2 元 frozen 语义值面·**bidirectional_ok=true**·两轮全等（确定性执行面旁证）| ✓ 命中 |
| ④ | 顶层 demand-pool 缺席=首版预期态 | score 顶层无 demand_pool 键 | 349fa91ff §四.1 零升级+54b4c301f §四 对表命中 | ✓ 命中 |

八键族结构抽验 ✓（annotation/confidence/domain/family/plan_family/reasons/source/tree 全在）。

## §二 · agent 判断面零有效判定判读（0/30·核心如实载）

**读数形态**：慢道 30 元全 fail-closed·零成功 agent 判定（agent=0）。归因三族拆解：

| 族 | 计数 | 语义 | 判读 |
|---|---|---|---|
| `agent_output_malformed: unparseable` | 15 | agent 调用有响应·输出非契约 JSON | **根因候勘**——非 call_failed（401/404/超时族）=8710 端点路由+鉴权面通·输出面非契约形（自由文本/wrapper 形/解析层取字段错三候选）|
| `skipped_over_limit` | 8 | 慢道树数上界 15 保险丝（15+8=23 慢道 tree） | ✓ 设计内（段 3 时长失控保险丝正常工作）|
| `agent_output_malformed: file entry missing` | 7 | top_level 域输入证据缺失 | **根因候勘**——顶层 7 件枚举判定输入面证据生成失败（from_week 目录定位疑点候选）|

**链面健康旁证**：plan verdict=pass·violations=[]·bidirectional_ok=true·counts 自洽（1+33+2=36）——**fail-closed 全谱按设计正确工作·段不炸·plan.json 照落卷**（设计卷 §1.2 fail-closed 分支实测成立）。

## §三 · 行为等价性论证（T3 判定的核心依据）

- **快道**：11 元与 1.0.0 同值（笔 4 CLI smoke 逐值对表+两轮全等）——migrate 1 案 authorization_active=现役链同迁 ✓
- **慢道**：新链全 keep（fail-closed）vs 现役链慢道默认 keep（degrade 链）——**判定同向零分叉** ✓
- **顶层域**：三清单零触（54b4c301f 裁决）+迁移器白名单 2 件照搬——行为等价 ✓
- **新增面**：agent_readings 读数面=比现役链只多不少（审计面增补）——**新链首拍行为=现役链行为+读数面增补**·零新增迁移风险。

**L1 形态对表**：设计卷 §三 3.1「L1（agent 慢道失败·快道正常）：fail-closed 降级 keep 已内建——零回滚（设计内护栏·链照跑·清单缺陷=已知态可候审）」——**本预演读数=L1 形态实测成立**。

## §四 · T3 判定：GO（附条件如实载）

- **技术面 GO**：四判据三项命中+一项非预期形但 fail-closed 正确工作+行为等价成立+L1 零回滚形态——**改后链可上首拍·回滚三梯度全保持**。
- **如实载条件**：①首拍=**agent 面降级形上线**（判断面零贡献·迁移判定=快道机械+慢道全 keep·与现役链行为等价）②unparseable 15+file missing 7 两根因候首拍后勘修窗 ③首拍决策面=候 COS/CEO 知会本判读后定（本席=技术判读输入·非首拍裁决权）。
- **首拍判读表增补行**（值席面）：首拍 agent_readings 读数两分支预案——延续降级形（agent=0·与预演同形=预期态）vs 修复形（agent>0=勘修介入后新形·如实报）——两分支皆非链炸·照读数如实判。

## §五 · 候勘修窗清单（首拍后窗·非今晚改链面）

1. unparseable 15 根因勘（8710 agent loop 输出面契约传导/解析层字段形——FSD+本席联合勘·候窗）
2. file entry missing 7 根因勘（top_level 证据生成面·from_week 目录定位嫌疑）
3. V 族断言面补强（plan.json 契约面直读入预演毕报断言族·本 T3 补读流程固化）
4. （既有候窗项照挂）多树超时 call_count 补强案+PlanAllPass fixture mock 化+b54cf39 谱系面观察+close evidence 指针面

## 使用依据

- SDE 补读直读 09:07:21Z（/var/lib/trirmc/cron/runs/shift-WW46-20261115T084547Z/plan.json·sudo python3 直读零改触·073712Z 对照轮同值）
- 三轮预演毕报（349fa91ff·0b63e2155·亲勘）+ops commit 862357445（=sg-bare 顶实锚）
- 本席设计定稿卷 c691cf007 §三 3.1 L1 形+§1.2 fail-closed 分支
- 54b4c301f §四（G5 对表注记·判据④锚）+4a6c9c0c2 §二（投影规则·八键族锚）

——CTO 小狄（m-cto）·写前现查 2026-11-15T09:08:29Z（+8=17:08:29·date 现查原值·D-47 正形）
