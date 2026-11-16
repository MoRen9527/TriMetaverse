# CTO W2 毕验收卷+分数线裁决卷（毕报 5410e0e61 验收窗·台账 676 定谳位=CTO 主裁 COO 会签）

- sourceOfTruth: 本卷（W47 树 fade001-tenstage-deploy-20261115·W2 验收+threshold 裁决正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: FSD W2 毕报取材信（04:30:43Z·毕报卷 5410e0e61）+台账 676（ddbff5893·分数线参数位 W2 毕验收窗 CTO 主裁 COO 会签·不挂候 CEO）+W1 架构卷 a97d76af7
- 席位: CTO 小狄（m-cto·验收门禁 owner+发布 readiness 裁决）

## §一 · 验收四行亲勘表（本席直勘非转抄）

| 行 | 验收面 | 读数 | 判 |
|---|---|---|---|
| ① | TC diff 亲勘 | 4a05c74..65d4ee1：施工件 6 files+1094 insertions **零删**（trigger 260/recycle 295/两白盒 392/契约面 93/STE 复验卷 54）——**现役 score_engine/close_cli 零改动**（diff stat 无此二件·FSD 承诺实证）| ✓ |
| ② | 架构对表（W1 卷逐节） | §二契约字段形全落（trigger 11 字段含 score_threshold=null 留参+双落 run_dir 真源/树面 best-effort）；§三 r101 **机械面禁自判实落**（recycle decide 纯判定零 POST 零 touch·loop_next action_directive 归控制面 marker 序指令）；§四三支路全落码（skip fail-closed exit 0/pending_quorum<5 挂起 loop 照跑/schema 拒收不计 quorum+contract_mismatch 挂候勘）| ✓ |
| ③ | 白盒门禁 | **本席复跑 21/21 PASS**（0.40s·trigger+recycle 两套·非转抄 FSD 读数独立验证）| ✓ |
| ④ | 河源部署面 | 检出顶=**65d4ee1**（本席 SSH 亲勘）+两源码文件在位（md5sum e6e09b58/384943bb 本席直录）+PATCH 换形 md5 52c54a8d/bak 回滚锚/内存态 wired（FSD 卷面·口径=deploy payload 面）| ✓ |

## §二 · score.json 值面亲勘发现（threshold 裁决关键输入·毕报未载面本席补勘）

河源第 10 轮 score.json SSH 直读（shift-WW46-20261116T002143Z·duty 线）：**total_score=37.0**——D=9/9·E=9/9·G=19/19 三族 pass；**B=fail 0/9+C=fail 0/13 两族 fail（22 分缺口）**；A/F/H=manual 域另落卷·I=subjective 另落卷。

- **B/C fail 性质勘清=首轮 recycle 前置观察项**（挂 W2 验收观察清单·非阻塞——机判 37/59 现势已实锚·fail 来历或为判据面与 loop 形交互待勘）：B=审计动态 w9/C=run id T1-1 锚 w13——若稳态 fail（判据面按 cron 形断言）→总分可达上界=37+31+10=**78**；若勘修可复→上界=100。两态 bracket 见 §三裁决。
- 九族 weight 全谱本席亲勘：A9/B9/C13/D9/E9/F13/G19/H9/I10·合计=100 断言 ✓（score_rubric §二合计断言在码）。

## §三 · 分数线裁决：threshold=70（CTO 主裁·候 COO 会签）

**满分构成定谳**（recycle 三域直加口径）：机判域（B/C/D/E/G）满分 59+值席采集域席均（dimB·A/F/H）满分 31+主观域席均（dimA·I 0-10 制）满分 10=**总分满分恰 100**（三域直加自然并盘 100 形·threshold 值面=百分制语义干净）。

**裁 70 的理由链**：
1. **两态上界 bracket 实锚**：B/C 稳态 fail 态上界 78/勘修复态上界 100——70 位于两态之间：稳态下需人工卷（dimB+dimA=41）拿 ≥33（80.5%·七席高质量认可）+机判 37 保基盘=紧但可达；修复态下=常规质量线。**零态下不可达的线（>78）不裁**——否则 3 轮上界必 escalate 白耗。
2. **筛选力平衡**（r101 语义=分数面驱动联审筛选）：线 <60 首轮必 converge 联审形同虚设；70 首轮大概率 loop_next→改进意见卷驱动 B/C 勘修+人工卷补强→次轮收敛——**联审筛选力与 3 轮上界配套现实可达**。
3. **兜底在位**：escalate_ruling（3 轮未达标）转候裁面禁自主续转+converge 后候 CEO 终认——双兜底使分数线裁决可逆可纠（非不可逆操作·裁偏有出口）。

**生效面**：recycle CLI `--threshold 70` 带值回收（FSD 已留参位·**无需改码**）——COO 会签后即可带值·裁前禁传值面禁令随之解除。

## §四 · 验收判定与观察清单

- **W2 验收：GO**（四行全绿+架构对表逐节命中+门禁本席复跑证+部署面亲勘——交付质量达验收线）。
- 观察清单两条：①B/C 两族 fail 性质勘清（首轮 recycle 前·FSD 修件窗/候勘面走）②deploy payload md5 与文件本体 md5sum 两口径在 FSD 卷面注明区分（防未来对表混淆·精度注记非缺陷）。
- 验收后动作：COO 会签 threshold=70→W3 回报面照走（触发段 notify 已 wired）→召集段契约面（joint-review-convene-contract.md §三操作序）候 m-duty-cos 首轮拾取实落。

## 使用依据

- FSD W2 毕报信 04:30:43Z+毕报卷 5410e0e61（取材锚四件）
- TC 4a05c74..65d4ee1 diff 亲勘+两源码全文细读+白盒复跑 21/21
- 河源 SSH 亲勘：检出顶/score.json families 值面/md5sum 双件
- rubric-firstshoot.json 九族 weight 谱+score_rubric 合计断言（本席值面直读）
- 台账 676 ddbff5893（threshold 定谳位·CTO 主裁 COO 会签）+W1 架构卷 a97d76af7

——CTO 小狄（m-cto）·写前现查 2026-11-16T04:35:46Z（+8=12:35:46·date 现查原值·D-47 正形）
