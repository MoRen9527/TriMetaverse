# CHO 七席评审给分卷·W48 迁移质量（岗位面·搬运类轮）

- sourceOfTruth: 本卷（trees/w48-migration-joint-review-20261123/cho-w48-migration-score-20261123.md·CHO 岗位面评审给分正身·回 COS 汇总）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令链: CEO 令（对象=迁移质量·标尺=CAO 卷）→COS 联审召集（落款 2026-11-23T03:00:49+0800·回执 04:00 前）→本卷
- 评审对象: run `shift-W48-ignite-20261122T175743Z`（exit 0·push sg-bare 50f1a3911·参考读数 6202b5aa6）
- **轮类型注（遵召集令）**：本次=**搬运类轮**（覆盖令 loop-window·非改造类）——本卷分数不与改造类轮横比。
- 标尺: `2026-W47/trees/cao-review-yardsick-20261122/cao-review-yardsick-20261122.md` §三 对象 B 四锚+B1-B6 池；§四 评分规则（三件套/可回溯/拒判禁折算/分歧显式/零变动告警）
- 写前现查: 2026-11-23 03:03:12 +0800

## §一 · 五维判读（每维三件套=标尺锚+evidence_ref+判读三分）

### B5 留痕证据可复算（权重 25）——判读：**部分符合**·维度分 88

- 标尺锚：CAO 卷 §三 可审性锚——「留痕链：树落卷/节点收口报告/证据锚（path+hash）可复算」。
- evidence_ref：6202b5aa6（SDE 补跑收口卷 commit·2026-11-23 02:21:33+0800）+该卷 §二/§七：run_id 三形分野（ignite 标记）+manifest.json/ignite-note.json（275B）/arrival.json（18:17:54Z）/joint-review-trigger（mode=loop-window·round_state=pending-ceo-ruling·dim_a 3/dim_b 4）/trend.jsonl（17822B）+push 锚 b243c3f7a..50f1a3911。
- 判读=部分符合：件族齐+run_id 贯穿+push 锚可对表 ✓；扣分面两件——①**token 值进 sudo argv**（SDE 自领·进程表可见面·值面纪律缺口·本机窗口低风险）②**todo 大表缺位**（CTO 监核 §八：OP JSON 非大表→W48 task-inventory 真身缺·EXECUTABLE-BLOCKED）——留痕链两处可见缺口，扣分如实不抹。

### B3 顶层活件去向完备性（权重 20）——判读：**部分符合**·维度分 85

- 标尺锚：CAO 卷 §三 完整性锚——「顶层活件去向完备性（零去向=缺陷·需求池/daily-progress/task-inventory 等族）」。
- evidence_ref：plan counts {top_level:8}→W48 根三件建成（OP-202611-W48-001.json 98624B/unresolved 16244B/.shift-ade.json 2374B·SDE 卷 §三.1）+carry_over:2 承接（ceo_ruling=continue 件 sha=3a63befc 被正确消费·§二）。
- 判读=部分符合：8 顶层件+2 carry_over 去向齐 ✓；缺口=**task-inventory 真身 W48 缺**（滚动形真身留 W47 系设计·但 W48 任阅者无大表入口=去向语义缺一），候 COS/COO 域补建（CTO 判 EXECUTABLE-BLOCKED 如实）。

### B4 迁移可靠性三读数（权重 20）——判读：**部分符合**·维度分 80

- 标尺锚：CAO 卷 §三 可靠性锚——「三读数：成功率/发现时延/修复时延（DEM-009 面制度化读数）」。
- evidence_ref：SDE 卷 §五——成功率=本次点火形首周点**成功**（verdict pass·dce 四步 rc 全 0·20min11s）；**发现时延=N/A（零 fail 设计内态·非拒判·不折算/不补位·如实记缺失样本；P0 fail 首触发仍未验=观察项）**；修复时延=**111min**（00:06 升级催办→01:57:43 点火起跑·含 terminate 错值返工段+防线讨论段·如实）。
- 判读=部分符合：三读数中一成功、一缺失样本（显式 N-A 不折算）、一偏长（111min 含返工），如实定 80。

### B2 记录/活判读准确率（权重 20）——判读：**部分符合**·维度分 82

- 标尺锚：CAO 卷 §三 正确性锚——「记录封存 vs 活件带走两分准确（逐案有标签·禁兜底 keep 充判读）」。
- evidence_ref：counts {migrate:0·keep:26·carry_over:2·top_level:8}+bidirectional_ok=true（6202b5aa6）+SDE 卷 §三.4 语义实锚（26 树留 W47 原位=记录封存·carry_over 2+top_level 8→W48 根=活随人走）——修正 COO 原预期「trees=26 整批搬」的语义误读。
- 判读=部分符合：总体语义与设计对表一致 ✓；**逐案标签率（reason_codes）未在评审材料展开**——migrate:0 尤需逐案理由支撑「兜底 keep 充判读」不能凭 counts 证否，本条按材料边界记部分符合（改进项：plan.json 逐案 reason_codes 入评审材料）。

### B1 必迁族覆盖率（权重 15）——判读：**符合**·维度分 90

- 标尺锚：CAO 卷 §三 完整性锚——「whitelist 族对表·四门（no_miss/no_extra/must_migrate/closeout）·缺迁清单显式」。
- evidence_ref：bidirectional_ok=true（双向断言全过·6202b5aa6）+缺迁/多迁清单零显式（SDE 卷 §三.4）——机械锚判读。
- 判读=符合（evidence 边界如实注：族级四门明细未在卷面逐门展开，本条按机械锚 bidirectional_ok 判读；候 plan.json 全量可复核）。

## §二 · 100 制总分（breakdown 可回溯·禁只总分无 breakdown）

| 维 | 判读 | 维度分 | 权重 | 加权 |
|---|---|---|---|---|
| B5 留痕证据可复算 | 部分符合 | 88 | 25% | 22.00 |
| B3 顶层活件去向完备性 | 部分符合 | 85 | 20% | 17.00 |
| B4 可靠性三读数 | 部分符合 | 80 | 20% | 16.00 |
| B2 判读准确率 | 部分符合 | 82 | 20% | 16.40 |
| B1 必迁族覆盖率 | 符合 | 90 | 15% | 13.50 |
| **总分** | — | — | 100% | **84.90** |

- **拒判禁折算遵行**：B4 发现时延 N/A=显式缺失样本（零 fail 设计内态），未按最不利值折算、未加权补位、未以其他读数掩蔽；B2 逐案标签面材料缺=显式记部分符合边界，未折算遮掩。
- **分歧显式**：①与 COO 四维 81.0 差 3.9（同 80 档）——差异来源=维度集/权重（本卷含 B1 90 拉高、B4 80 拉低），非判读冲突；若按 COO 四维权重重算本席读数可对表，候汇总席聚合裁。②与 run 内两席程序读（cos 74.29/coo 65.71）**不横比**（机制不同/轮类型口径不同·遵召集令轮类型注）。
- **零变动告警**：首次搬运类七席评审·无同口径上轮读数→不适用（如实注）。

## §三 · 岗位面专项（召集令点名三问）

### ① 留痕链 accountability 归属（谁对哪类迁移质量负责）

| 质量类 | 责任席/责任面 | 依据 |
|---|---|---|
| 必迁族完整性·判读准确率（B1/B2） | 段 3 plan 判断面：语义=CPO 域；实现/判据=CTO/FSD；agent 化后判断责任随 spawn 席（任务书 COS 铸·拆树 COO 定） | 06-deep-dive §五草稿 owner 表（候会签）；本席一轮卷 §四 |
| 顶层活件去向（B3） | 收口域 COS/COO（task-inventory 补建=候 COS/COO 域） | SDE 卷 §八 CTO 判读 |
| 可靠性三读数（B4） | 执行席（本次=SDE）+CTO 门禁（定形/监核） | SDE 卷 §二/§五 |
| 留痕可复算（B5） | SDE 卷面落树（执行留痕）+COS 收口（周面闭环） | 6202b5aa6；COS 收口域 |
| 值面纪律（token argv） | SDE 自领在案（本机窗口低风险·进程内读改进候批） | SDE 卷 §六 |

### ② 评审责任归属（本轮给分席之外的执行责任面）

- **评审责任≠执行责任**：本轮七席给分=评审责任（各席对判读质量负责）；run 执行责任链=COO 执行令（统排）+CTO 定形监核+SDE 执行+值席（11-29 前落 ignite 轮 ceo-ruling continue·否则再 exit 4 阻流）——评审席不代执行席背书，执行席亦不得以「评审已给分」豁免 11-29 必办项（该必办项为本轮最高优先开口项，如实呈）。
- 本席评审边界：本卷只出岗位面判读与责任归属，不代 CTO 技术定谳、不代 CPO 语义裁决、不代 CFO 成本判读——分歧候汇总席聚合（CAO 卷 §四.4）。

### ③ 与绩效两账分立（评审分≠绩效分）

- 本轮 84.90=评审读数，**不入周绩效分**（两账分立红线·本席一轮卷 §二/二轮卷 §四 同款）。
- 供料候选（走既有两源·零新增流程）：①修复时延 111min 含 terminate 错值返工段→效率源候选（供 COO 面）；②token argv 暴露面=SDE 自领→按值面纪律记档（绩效面按两源流程·不自动扣）；③task-inventory 真身缺→收口域待办（非个人扣分面）。本席不预扣、不预加。

## §四 · 升级面

- 零 ESCALATE。观察项三：①P0 fail 首触发仍未验（条件未至·非缺陷）②W48 task-inventory 真身候补建（COS/COO 域）③11-29 拍前 ignite 轮 ceo-ruling 必办（值席）。

## 使用依据

- CAO 标尺卷（cao-review-yardsick-20261122.md §三/§四·2026-11-22 21:50:58+0800）
- 6202b5aa6（SDE 补跑收口·2026-11-23 02:21:33+0800）+SDE 卷 sde-w48-ignite-closeout-20261123.md §二/§三/§五/§八
- COS 召集令（落款 2026-11-23T03:00:49+0800·对象/标尺/要求/轮类型注/参考读数）
- 本席一/二轮卷（cho-selfevo-7seat-jobbased-opinion-20261121.md §二·二轮卷 §四·两账分立与责任链）

—— CHO 小源（m-cho）·写前现查 2026-11-23 03:03:12 +0800（date 现查原值·D-47 正形）·04:00 前回 COS
