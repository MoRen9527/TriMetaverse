# STE 正式读数卷 · LG-058 台账 N3/N4/N5 走查并批窗（台账销账验收材料）

- sourceOfTruth: 本件（trees/lg058-remediation-20261006/ste-lg058-n3n4n5-readout-20261011.md）
- syncMode: static（正式读数卷·终态；台账销账依据=in-progress.json lg058-N3/N4/N5 三条）
- lastSyncedAt: 2026-10-11T14:08:32+08:00（date 现查原值·裸 date 本地时区输出）
- 执行席: STE 小柯（m-ste）；令源=COO 排工令（10-11 13:34·令源链=CEO 13:28 质询→BOD 13:30 裁即刻拉单→COS 盘点卷五簇①）
- 窗位: 即起-17:30（13:44 开工前置毕→14:08 读数卷落卷）
- 台账对象: lg058-N3-config-source-binary（e099329）/lg058-N4-copy-domain-wording（c4d9137）/lg058-N5-product-plan-three（366eecb+45757bd 回炉）——owner=FSD·三条 note 均「候 STE 走查+流水线正式读数/候 STE 序④」
- 走查形: 非作者（三条作者=FSD）·源码面+R-HY served 面双面核+git 链断言+全量独立复跑（禁转抄）

## 〇、判定汇总（先答）

| 条目 | 判定 | 锚 |
| --- | --- | --- |
| lg058-N3-config-source-binary | **PASS** | 编造概念「直连/中转」双面零命中+来源二分列现役在位（§二） |
| lg058-N4-copy-domain-wording | **PASS** | 「本卡特有」双面零残留+「本域特有」在位（§三） |
| lg058-N5-product-plan-three | **PASS** | 序④ 10-06 已毕（b0e9d467）+现役面增量核全过+全量 374/360/0/14 同构全绿（§四） |
| 流水线正式读数 | 全绿 | TriModel 全量 **374 tests / 360 pass / 0 fail / 14 skipped**（HEAD 独立复跑·与 S5 卷 e30ea20 顶读数逐字同构）（§五） |

**三条全部满足台账销账锚**。本卷随附版本基线勘正专节（§六）与一段台账滞后澄清（§〇.1）。

### §〇.1 台账滞后澄清（重要·不改变判定）

台账三条「候 STE 走查」系**滞后态**：N3/N4 实际已于 10-06 走查卷 PASS（ste-walkthrough-readout-20261006.md df1ab55d §七「N1/N3/N4：PASS」）；N5 的序④独立复验已于 10-06 13:44 毕 PASS（ste-seq4-independent-verify-20261006.md b0e9d467·五环+锚漂移差分零漂移→BOD 13:53 终复核 PASS）——台账 note 未随后续收口链刷账。本窗价值=以台账条目为锚的**销账正式读数**+对 R-HY 现役在役面（e30ea20·10-06 走查后经历 r2-r5b/批A/深测②共 13 笔演化）的**增量复核**——10-06 读数不可平移到现役面，本卷补的正是这一段。

## 一、版本链断言（走查对象定谳·D-24 活体现探非推定）

| 断言 | 方法 | 读数 |
| --- | --- | --- |
| N3/N4/N5 commit 全为 HEAD 祖先 | `git merge-base --is-ancestor`（TriModel 仓） | e099329/c4d9137/366eecb/45757bd/e30ea20 全 YES（HEAD=a17deaf） |
| R-HY TriModel 在役版本 | curl `http://8.155.54.79:3333/ui` 全量 sha256 对表 | served `8ca70d3d…` ≡ `git show e30ea20:ui/index.html` **逐字节相同**（139927B·S5 卷同尺寸同指纹）；HEAD 文件 8c2e251f… 不同（Q3.2 未部署·预期内） |
| 版本差窄度 | `git diff --stat e30ea20..HEAD` | 仅 3 文件：ARCHIVED.md +10（退役标记·零代码）/ui-fourplane.test.ts 4 行/ui/index.html 8 行（Q3.2 端口文案 8712→8710）——HEAD 全量读数对 e30ea20 面基本等价 |
| R-HY TriRMC 8710 在役 | curl healthz | 200 `ok:true/mcLedger:ok/cron jobCount=3/degraded:false/consecutiveFailures:0`（S3 判定卷 V4 同构稳定） |
| TriRMC 版本链 | merge-base | 8249eb7/99806cf/a02d89b 全为 HEAD 祖先；99806cf→a02d89b 仅 1 笔 |

**走查对象定谳：R-HY 在役=e30ea20**（深测②终态·10-08 部署版）。

## 二、N3 销账锚（config-source-binary·e099329·打回 #4 后半）

| # | 锚 | 实测 | 判 |
| --- | --- | --- | --- |
| N3-1 | git 链 | e099329 ⊆ HEAD ⊆ e30ea20 链（§一） | ✓ |
| N3-2 | 「直连/中转」源码面 | TriModel ui/+src/ 全扫：UI 文案零命中；命中仅两类——ui/index.html L883 **判据注释**（「『直连/中转』系编造概念不入 UI」防回潮注记·非渲染文案）+L1659「Anthropic Messages 直连」与 claude-fallback 族（API 连接方式技术语义·10-06 走查卷 §四#4 既定口径非 #4 对象域） | ✓ |
| N3-3 | 「直连/中转」served 面 | R-HY served UI：「中转」=1 处（即 L883 注释）·「直连」=2 处（同上两注释/warn 形）——零用户可见文案 | ✓ |
| N3-4 | 来源二分列现役在位 | served 面 `menuOriginLabel` ×3（溯源标注）+`ledger.applied_tier` 判据链注释在位；条目表来源列 10-06 走查 §2.4 过（tier1/2=远程拉取配置/tier3=本地配置/null=暂无回写）·S2 结构骨架重构后现役面锚在位 | ✓ |
| N3-5 | 测试面 | verify-three-state（257 行·S1 新件）+config-cards 套件在全量 374/360/0 全绿内 | ✓ |

## 三、N4 销账锚（copy-domain-wording·c4d9137·打回 #7）

| # | 锚 | 实测 | 判 |
| --- | --- | --- | --- |
| N4-1 | git 链 | c4d9137 ⊆ HEAD ⊆ e30ea20 链 | ✓ |
| N4-2 | 「本卡特有」源码面 | TriModel ui/+src/ 全扫**零命中** | ✓ |
| N4-3 | 「本卡特有」served 面 | R-HY served UI 计数=**0** | ✓ |
| N4-4 | 「本域特有」在位 | served 面 ×2·源码面 ui/index.html 在位 | ✓ |

## 四、N5 销账锚（product-plan-three·366eecb+45757bd·打回 #2/#8/#9）

| # | 锚 | 实测 | 判 |
| --- | --- | --- | --- |
| N5-1 | 序④独立复验 | 10-06 13:44 毕 PASS（b0e9d467：五环零矛盾+锚漂移差分零漂移+per-face 补位闭合）→BOD 13:53 终复核 PASS（c354a580）——**升版链 STE 面已闭** | ✓（引证） |
| N5-2 | P1 复验 | 10-06 §七.2 PASS（真浏览器几何断言 menuRect.right 420 ≤ mainRect.left 434·CEO #1「分左右」视觉兑现） | ✓（引证） |
| N5-3 | 现役面演化知情 | 45757bd→e30ea20 间 13 笔=r2-r5b 六笔（各轮 BOD playwright 复验+CEO 亲测）+批A改名（72d3099）+深测② S1-S4b 五笔（各段走查+S5 终走查+CEO 终验 PASS 10-08）——N5 对象域 UI（index.html 842 行改动）经多轮叠加演化**但每轮均有独立验收环**，终态=CEO 亲验 | ✓ |
| N5-4 | 现役面结构锚抽验 | served 面：「兜底模型」×7（批A改名后形态·CEO 亲批派工非走样）/「菜单外」×7（方案二手填标注）/溯源 menuOriginLabel×3（方案二）/「密钥禁入」×1（守卫文案）/四域签「服务域」×8+「本地域」×8+三段式机器位 M-SG×8·R-HY×3（r3 正名形） | ✓ |
| N5-5 | verify 端点门形 | GET /v1/config/verify 无 token → **401** fail-closed 在岗；「rmc 卡 applied tier=1」值面=引 S5 卷活体探针读数（verify 四 face rmc=applied）——本席无 admin token 未复探值面·如实标注 | ✓（门形实测+值面引证） |
| N5-6 | 测试面 | 全量 374/360/0 全绿（§五）；N5 对象域套件（config-cards/ui-fourplane/ui-boot/verify-three-state）全含 | ✓ |

**形态演化如实注记**：方案三「连接配置」页现名「兜底模型」（批A 72d3099·19 处用户可见改名·BOD 派工 CEO 走查反馈链）——**系演化非缺陷**；五步数据流/三态徽章/密钥禁入守卫在 S5 终走查（e30ea20 面）全锚清单实测全绿。

## 五、流水线正式读数（走查门②·独立复跑禁转抄）

- **TriModel 全量（HEAD a17deaf·本机独立复跑）**：`npm test` → **374 tests / 360 pass / 0 fail / 0 cancelled / 14 skipped，exit 0**（duration 333s）。
- 与 S5 卷（e30ea20 顶·10-08）读数 **374/360/0/14 逐字同构**——版本差 8 行 UI 文案+4 行断言面零涟漪。
- 14 skip=env-gated E2E 设计跳过（既有口径·零新增）。
- **既有失败逐族归因**：零失败——无归因面。

## 六、版本基线勘正专节（COO 令读数基线·如实勘正不阻塞任务）

- COO 排工令载「读数基线=**13:25 R-HY 部署全毕** TriModel 45757bd+TriRMC a02d89b·rmc 卡 applied tier=1」——**「13:25:52」系台账 N5 note 无日期前缀时点被盘点转抄误读为今日**，实际=**2026-10-06 13:25:52**（10-06 升版五环毕时点·rhy-upgrade-pipeline-20261006.md §二.6）。
- 45757bd 版本基线亦系陈旧值：10-08 R-HY 部署链已把全量积码升至 **e30ea20**（深测②终态·S5 卷活体对象版本）——本席 §一 served 指纹逐字节钉死在役=e30ea20。
- 勘正不阻塞：N3/N4/N5 改动全为 e30ea20 祖先（§一 git 链断言），走查以现役在役面完成——**读数效力覆盖 COO 令原基线并前移至当前在役版**。
- COS 盘点卷/台账 note 的日期前缀缺省=转抄陷阱族（候 COS 刷账时补日期·本卷代锚）。

## 七、三分法与门禁评估

- N3 **PASS**／N4 **PASS**／N5 **PASS**——三条全满足台账销账锚，零阻塞项，零升级项。
- 非阻塞注记两条：①N5-5 值面（rmc applied tier=1）本席无 token 未复探·引 S5 活体读数（门形 401 已独立实测）②§六版本基线勘正系令面信息差非施工面问题。
- CTO 工程门禁框架：LG-058 面已 10-08 CEO 终验 PASS 整单闭账（本三条属闭账后台账销账材料补齐）；本卷读数在 CTO 门禁框架内成立，判定建议供 COO 督办销账+BOD 知情。

## 八、使用依据

- 台账：`docs/workflow/hub-state/in-progress.json` lg058-N3/N4/N5 三条（13:4x 现读）
- 令源链：COS 盘点卷 cos-open12-pushdown-review-20261011.md（五簇①）→COO 排工令（10-11 13:34）
- 历史卷：ste-walkthrough-readout-20261006.md（df1ab55d·N3/N4 原 PASS 锚+九条回对表）/ste-seq4-independent-verify-20261006.md（b0e9d467·序④）/bod-final-review-20261006.md（c354a580）/ceo-final-acceptance-package-20261008.md（LG-058 闭账卷·§八 CEO 终验 PASS）/fsd-rhy-deploy-gapfix-20261008.md（e30ea20 部署链）
- 独立验通道：git merge-base/diff（TriModel+TriRMC 两仓）·curl R-HY 3333 /ui 全量 sha256+8710 healthz+v1/config/verify 401·served/源码双面 grep（N3/N4 词面+结构锚）·npm test 全量独立复跑
- 记忆条：ui-delivery-render-gate（非作者手测）/值面三查/拓扑断言禁由恢复源推定（版本活体现探）/fact-citation-source-required（S5 读数引证标注）
