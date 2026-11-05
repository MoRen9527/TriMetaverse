# FSD 轮 3 勘定申报单（池构成+域序取数·recon-fsd-r3-round3-pool-apply）

- sourceOfTruth: 本件
- syncMode: recon-record
- lastSyncedAt: 2026-11-05T09:02:56Z（date 现查原值·勘定终态落卷写前现查）
- 令源：环 3 起跑令（COO 08:42:55Z·即刻起跑零空窗）+派工单 `coo-dispatch-r2-round3-v1.0.md`（1adc90a8cd）
- 性质：**池构成申报面——候 COO/RDT 锁值后施工**（派工单§一「池件清单勘定段申报后为准」）

## 一 · R2 域现势扫描读数（Python 单进程·同窗实跑·读数先于本单写前现查 2026-11-05T08:45:53Z·护栏③活体现勘）

- 域计 **47 件**（TriCompany/docs/training/ 全树含子目录）·分层现势=**full 44 / partial 1 / none 2**；版本形态=v1xx 21 / vold 2（初扫正则判·见 §三伪影注）/-24。
- **与勘十一基数差值如实注**：勘十一（d09febea2·11-04 22:3x 扫）记 R2=full 20/partial 18/none 9/vold 6——**现势 full 44/none 2**=机械层缺口大幅收口，**成因=SDE 规范头批挂轮间推进**（勘十一 TriTraining 行同款先例「SDE 批 3 迁移毕」）·非扫描口径漂移（同口径 Python 单进程）。**申报即以现势读数为基准**（勘十一域级表基数作历史对照不入池判据）。

## 二 · 池构成申报（13 件=R2 域首批切片·~13 预勘值吻合）

### A 组·机械层缺口 3 件（处置形候 RDT 裁·不径动笔）

| 件 | 行数 | 现势 | 勘定初读 |
|---|---|---|---|
| fade-002-deep-dive.md | 333 | none | **实读=自声明历史档**（L5-9 版本差注记 2026-09-05 在位：行号锚基于 4344 行版 CLI·现行 4688 行·「本文保留为 2026-08-29 时点历史档·现行版见 fade-002/04-deep-research.md」）——处置形候选=**封存形**（W12 同款补头 syncMode=archived·正文零改写）vs 活件补头，**候 RDT 裁** |
| fade-003-deep-dive.md | 523 | none | 同系 deep-dive·头部形态候施工勘定对表（疑同自声明历史档形） |
| fade-006-deep-dive.md | 432 | partial | 三件套缺字段面·候施工勘定补齐形（SDE 梳理域 vs 本轮池分野候 RDT 裁——勘十一判读①注「规范头补挂属 SDE 梳理域施工面」） |

### B 组·内容级高危抽验 10 件（行号锚/过时叙述风险面·FADE 域为主）

| 件 | 行数 | 入池判据 |
|---|---|---|
| fade-001-deep-dive.md | 330 | deep-dive 系·行号锚风险面（fade-002 自注版本差实证同族） |
| fade-004-deep-dive.md | 418 | 同上 |
| fade-005-deep-dive.md | 361 | 同上 |
| fade-007-deep-dive.md | 356 | 同上 |
| fade-beginner-course.md | 179 | 课程正文·过时叙述风险面 |
| fade-product-guide.md | 235 | 同上 |
| fade-code-deep-dive.md | 320 | 同上 |
| ipd-usage-guide.md | 401 | IPD 系主课程 |
| ceo-demand-to-discovery-beginner-course.md | 201 | CEO 系轻件（deep-dive 1939 行重件**不入本轮池**·摊派另计披露·候 R4 域序或专窗） |
| training-source-and-directory-allocation.md | 172 | 目录分配制度叙述·路径断链风险面 |

- 域序申报：本轮=R2 域首批切片 13 件（余 34 件候后轮）；R3-R9 域序候本轮毕对表衔接。
- 池件计口径：锁值定谳口径照轮 2（动笔池件+零改动占位分列计数）。

## 三 · 脚本伪影自领（勘十一教训同族·如实注）

- 初扫「vold 2 件」系**正则宽匹配误桶**：`fade-002/01-beginner-guide.md` 实读头部=GOVERNANCE 注释+三件套**全在**（vold 判读伪影实锚·疑前 4000 字符内「协议 v2.x」字样误中）——两件 vold 判读**候人工复核不入池判据**；run_discovery_stage_automation函数解读.md 同候复核。
- 申报面只采信：三件套在位性（直读头部实锚）+行数（wc 实测）——版本形态列作线索不作判据。

## 四 · 护栏对表（六条·两条新条已纳入）

- ⑤**--numstat 唯一读数口径**：本申报单零 diff 读数面·施工段起 diff 读数一律 numstat ✓
- ⑥**item6 留置面前置警告**：本池 13 件零涉 W14 §10 item6 关联面（--dry-run/--execute 值域+gate 联动）——但 B 组施工勘定若现勘中触及发布链叙述关联面，先活体重勘报 RDT 裁禁径直改写 ✓

## 五 · 锁值定谳与施工终态（09:02:56Z 落卷）

### 5.1 锁值链定谳

- **池构成锁值**：COO 08:52:14Z 锁值信六笔采认——池 13 件照申报+B 组即刻动笔+CEO deep-dive 不入池+vold 两件人工复核候办窗+差值采认 ✓
- **A 组处置形裁定**：RDT 08:51:09Z 三笔裁定——①三件统一 a 案封存形（W12 同款·fade-006 并入同判：实勘三件全带版本差注记自声明历史档·006 注记 2026-09-07 在位）②域界注记（见 5.3）③B 组 10 件照报推进·护栏⑥认可维持。
- 「候裁期 A 组零动笔」条件随裁定落达解除（裁定 08:51:09Z 早于 COO 锁值信 08:52:14Z·双锚齐备即落笔）。

### 5.2 施工终态（TC 工作区·numstat 终值·护栏⑤唯一口径）

| 件 | 处置形（裁定锚） | 读数 |
|---|---|---|
| fade-002-deep-dive | A 组裁定①封存形：补三件套 syncMode=archived+封存注记·正文零改写 | 9+/0- |
| fade-003-deep-dive | 同上 | 9+/0- |
| fade-006-deep-dive | 同上 | 9+/0- |
| fade-001-deep-dive | 裁②判据引用句正文形：TriMC→TriMMC 两处（TriMMC 路径存在性实勘 OK）+勘误行 | 3+/2- |
| fade-004-deep-dive | 零改动占位（三锚三中：init-chain.ts L116/L434/L453 抽验语义吻合+基线声明在位）·W13 形记录即毕 | 零 diff |
| fade-005-deep-dive | 零改动占位（真源两件在位=TMV execution/ 实勘·初探 MISS 系探径错误已撤回；timer.ts:146 单锚不定性=观察项登记）·W13 形 | 零 diff |
| fade-007-deep-dive | 勘误头形：lastSyncedAt 刷+勘误行（spec 现势 09-04 修订注记差异声明） | 2+/1- |
| fade-beginner-course | 勘误头形：刷头+滞后声明（对齐基线 v2.0.0-3·现势 v2.0.6·联动修订候 RDT 排程） | 2+/1- |
| fade-product-guide | 同上 | 2+/1- |
| fade-code-deep-dive | 同上 | 2+/1- |
| ipd-usage-guide | 正文形+勘误头：状态行「Copilot-host live」叙述勘误（现势三宿主位）+刷头 | 4+/2- |
| ceo-demand-to-discovery-beginner-course | 勘误头形：supportSyncRule 旧宿主名括注（LG-046·勘十四口径）+刷头+滞后声明 | 3+/2- |
| training-source-and-directory-allocation | **零动笔·裁定请托候 RDT 裁**（见 5.4） | 零 diff |

**净面 45+/10- · 10 件动笔 + 2 件零改动占位 + 1 件候裁**（分件加总=总计核验：45/10 ✓）。回滚锚=TC a4b7894（施工前基线·工作区他面在途三件未卷入=精确 pathspec 承诺）。

### 5.3 RDT 裁定②域界注记（照裁定文录·候 COO 转 SDE 链）

> fade-002/003/006-deep-dive 三件规范头已由 R 域序以 archived 封存形补挂（环 3 轮 3）——SDE 批挂到该件按已补跳过·D-67 版本号存量迁移语义（1.x.x 起算）仍归 SDE 保留面。

### 5.4 升报面（4 笔·裁定/排程请托）

1. **dir-allocation 处置形裁定请托**：本件系 2026-06-14 制度叙述档（v1.0.0）——实勘 `tritraining/` 子目录引用 3 处（L111 节头/L127/L160·该形态已消亡=勘十四 A6③ 同款）+旧宿主根名 2 处+「候 CPO/CTO 评估」事项已决；**演进头注记形**候选（头部声明现势差异+现行分工真源指针·正文零改写——节级叙述改写超一行笔面）vs 封存形 vs 逐节改写——**裁定未覆盖形·候 RDT 裁再动笔**（派工单§一）。
2. **池外新发现·圈外补员请托**：`fade-001-maintenance-deep-dive.md` L44/L352 同族 TriMC→TriMMC 断链两处（组 4 残留扫描捕获·池外件零触碰）——照勘十四圈外补员先例候 RDT 裁（裁则同款两行改+勘误行）。
3. **课程三件联动修订排程请托**：对齐基线停 v2.0.0-3·规范现势 v2.0.6（v2.0.4 业务定性/v2.0.5 登记性/v2.0.6 §2.8 协同作业规则实质增补）——实质内容更新（非一行笔面）候 RDT 培训域排程（勘误行已声明滞后）。
4. **命令面复勘排程请托**：ipd（宿主面三宿主位演进后命令面）+ceo-course（2026-06 后产品流程面）——实质复勘候 RDT 培训域排程（勘误行已声明）。

1. 池构成 13 件（A 组 3+B 组 10）锁值；
2. A 组处置形三笔（fade-002/003 deep-dive 封存 vs 补头·fade-006 补齐归属域）；
3. CEO deep-dive（1939 行）重件面摊派另计窗（本轮不入池·披露候裁）；
4. 锁值后工序：施工勘定段（B 组逐件内容三读数）→逐件动笔→自测五组→呈 RDT review→毕报。

## 六 · 使用依据

- 派工单 coo-dispatch-r2-round3-v1.0.md（1adc90a8cd·池定义+护栏六条）
- 勘十一域级表（d09febea2·R2 基数作历史对照）+勘十判读（R2 起 ≤10 件逐件走·域序 R1-R9）
- 裁定链：勘十三/十四/十五（4f6725222/f08b04ffe/371878d9d）——TriTraining 域裁定·R2 域处置形延伸候 RDT 裁
- 现势扫描实跑读数（§一·同窗锚=写前现查 2026-11-05T08:45:53Z）+fade-002 头部实读（§二 A 组初读）
