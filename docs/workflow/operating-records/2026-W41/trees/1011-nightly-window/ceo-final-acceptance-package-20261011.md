# CEO 终验材料包 · 2026-10-11 窗（对象 A=今日大交付面）

- sourceOfTruth: 本件（trees/1011-nightly-window/ceo-final-acceptance-package-20261011.md）
- syncMode: static（终稿——对象 CEO 14:26:59 裁定 A；B/C 轨预置件勘空归档见 §四）
- lastSyncedAt: 2026-10-11T14:27:17+08:00（date 现查原值）
- 编制位: COO 小营（m-coo）；令源链=CEO 14:07 裁窗（今晚 19:00-20:30）→BOD 14:09 令→本席 14:16 对象断言报→CEO 14:26:59 裁对象=A（BOD 14:27 转达）
- 窗位: 今晚 19:00-20:30（19:00 CEO 不在场即顺延明晚候选·BOD 14:09 令③原文）
- 对象断言声明: 令①原表述「LG-058 九条面余八条+收尾两件」经实勘系台账 N2 note 10-06 时点刷注转抄链——LG-058 一轮九条已 10-08 23:53 CEO 亲验 PASS 整单闭账（ceo-final-acceptance-package-20261008.md §八）·门1 当场解锁·验收链 10-11 11:02 CEO 改形（末棒换 COS）。本包对象=CEO 14:26:59 裁定的今日大交付面。

## §一 验收卡面（六卡·每卡=验什么/在哪验/预期读数/证据指针）

### 卡 1 · 栏 A 资格门判读机 v1.1（FADE 影子期基础设施）

| 项 | 内容 |
|---|---|
| 验什么 | 树资格门机制成立：好树判 PASS·坏树判 FAIL·零反向误报 |
| 在哪验 | 判读机 `scripts/fade/eligibility-gate.mjs`（零写面零网络零值面接触）；selftest 读数与判读 JSON 样品在毕报卷 |
| 预期读数 | selftest 双向 PASS（好树全 PASS+坏树 11 条 FAIL 逐条合理）；现役树干 5 件跑校准 c2 全 PASS 零反向误报 |
| 证据指针 | 毕报卷 `trees/1011-window-family/` 栏 A 毕报 @107859f6+段1/2 @0f1b71db（merge cbb74fe4 双面同顶）；S1 首锚批判读 JSON 六份（提单卷 @61725826 目录内） |

### 卡 2 · 栏 B 三 job 现役+DEM-004 首滚

| 项 | 内容 |
|---|---|
| 验什么 | 8713 三 job 现役运行（window-dispatch-remind/glm-quota-obs/tri-liveness-l1 退役链）+job① 首滚正式读数行 |
| 在哪验 | 活体：`curl http://localhost:8713/healthz`（jobCount 值面）；读数：TriMLC execution_log jsonl 尾行 |
| 预期读数 | jobCount=13（重启毕在册 10 jobs+新增三 job 零丢拍三对表）；job① 首滚正式行 obs-20261011-0930-01 quota_used=32（与 CFO 昨 18:00 读数 30% 跨源自洽）；POST<09:30 红线守住 |
| 证据指针 | CTO 门禁终裁卷 cto-windowb-gate-verdict-20261011.md @5dfed913（四门独立验全绿 APPROVE）；FSD 毕报卷 fsd-windowb-execution-report-20261011.md @d0cb0db8（§八 CFO 映射消费回执 @c6d52406） |

### 卡 3 · 勘修窗三件（8713 崩溃韧性修复）

| 项 | 内容 |
|---|---|
| 验什么 | 三件修复生效且零回归：件A 崩溃 handler（exit(1)+crash.log 同步落盘）/件B race 滞后 rejection 吸收/件C F-3 第三型 store 层 enabled 归一 |
| 在哪验 | 活体：healthz degraded:false+uptime 连续性（11:51 冷启起）； TriMLC 仓三独立 commit |
| 预期读数 | uptime 自 11:51 起连续增长（21:00 绩效拍双语义验收基线）；crash.log 零基线保持（零崩溃）；14:07 拍准点落账零派发延迟 |
| 证据指针 | 勘修窗三件 fc44904/cc52c89/baf800d（TriMLC 仓·S5 探针附锚）；CTO 14:07 拍对表（06:07:00.5Z 准点·39.3s·status=ok） |

### 卡 4 · LG-067 活性探针落码（如实标注：落码毕·候部署）

| 项 | 内容 |
|---|---|
| 验什么 | next_run_at 第三字段升值面落码+单测——**未部署非今晚可验活体面**（候明晨窗与 lastReadAt 投影同段议） |
| 在哪验 | TriMLC 仓 f612b9e（3 files +88）；FSD 毕报卷 fsd-windowb-execution-report 同树 @a0dc9e4e |
| 预期读数 | 新单测 6/6+全量 674=基线 668+6+tsc 0；6 既有 fail stash 两轮对照零新增（6 vs 5 分歧以 STE 实测为准·注记面更正随 W1 窗） |
| 证据指针 | FSD 毕报+CTO 门禁 APPROVE（14:05 信·键名/纯函数导出/注释勘三裁全落） |

### 卡 5 · 拉单#1 四席产出（CEO 13:28 质询→~40min 全链闭环）

| 项 | 内容 |
|---|---|
| 验什么 | 质询触发的即刻拉单全链：STE 走查读数+COS 销账+CTO 二期方案稿+FSD 探针落码 |
| 在哪验 | 各卷树位（下列指针）；台账大表现势（open 12→8） |
| 预期读数 | STE lg058-N3/N4/N5 三条全 PASS（@31bce9f7·非作者双面核）；COS 三条销账毕 900d8dd0（LG-071 终验制亲验复核销）；CTO lg069 二期方案稿 @a00045f1 候批；FSD f612b9e 门禁 APPROVE |
| 证据指针 | ste-lg058-n3n4n5-readout-20261011.md / in-progress.json / cto-power-gate-phase2-plan-20261011.md / TriMLC f612b9e |

### 卡 6 · 树生命周期管理回路（制度面·今日两轮迭代闭环）

| 项 | 内容 |
|---|---|
| 验什么 | 14:15 指正→勘正闭环质量：v3 修正稿是否落回协议正形（§8 六节点零新机制） |
| 在哪验 | trees/tree-lifecycle-loop/tree-lifecycle-loop-v3-20261011.md @2fc19a11（BOD 14:23 已裁批·候 COS 联署→CAO 入册） |
| 预期读数 | 衔接面=§8 六节点正形回归零新机制；探测面角色=COS 持树职责正形化；「树 owner」协议外用语全清 |
| 证据指针 | v2 失效标记卷（826621ab→勘正留痕）+BOD 14:17 勘正令+CEO 14:15 指正令源链 |

## §二 动线清障（亲测/活体入口预置）

- **8713 healthz 活体探针**：`curl http://localhost:8713/healthz`（本机·现役形态免 token 返回 ok/jobCount/degraded/consecutiveFailures）——卡 2/卡 3 共用入口。
- **读数卷树位**：`docs/workflow/operating-records/2026-W41/trees/`（1011-window-family/=窗族三卷·lg058-remediation-20261006/=STE 读数卷·lg066-window-order-20261009/=本席收口跟踪卷·tree-lifecycle-loop/=回路三卷）。
- **台账大表现势**：`docs/workflow/hub-state/in-progress.json`（open=8·13:51 销账后）。
- **21:00 绩效拍旁观窗**（窗后延伸·可选）：勘修窗修复验收（uptime 连续+crash.log 零基线）+lg068 W41 首滚（CHO 铸账）双语义首验——21:0x 拍点后本席收口读数随拍呈报。
- 前置条件：全部入口零鉴权（healthz 现役形态）/零操作（只读）——亲测动线全程零写面。

## §三 窗位与应答

- 窗位：19:00-20:30。CEO 到场即验（六卡顺序建议 1→2→3→5→6·卡 4 如实标注候部署）。
- 候验应答：FSD 候验应答·STE 读数随取·本席窗内随叫。
- 窗毕动线：CEO 判词→验收销账（§8 节点6 BOD 面）→本席复盘闭环入 operating records。

## §四 B/C 轨预置件勘空归档（对象断言留痕）

- **B 轨（lg066 九条呈验现势）勘空**：实勘「九条呈验滚动 3 pass」系 LG-058 打回清单九条的 10-06/10-07 时点轻注（daily-progress L462·cos-open12 卷第 8 条转抄）——**九条已 10-08 23:53 随 LG-058 整单 CEO 终验 PASS 闭账**，无剩余 CEO 亲测面；验收链 11:02 改形后末棒=COS。B 轨无真候选验面，勘空归档。
- **C 轨（CEO 另指定面）归档**：Q3.2 卡面端口收敛（8712→8710 六行）施工毕 @a17deaff 但**未部署**（R-HY 在役=e30ea20·served 指纹钉死·候值席部署段）——今晚窗前无部署窗则不可验；若 CEO 窗内另指定面，本席窗内 30min 内可出专卡（素材链在树）。

## 使用依据

- CEO 14:07 裁窗令+BOD 14:09 支撑令+CEO 14:26:59 对象裁定（BOD 14:27 转达）；本席 14:16 对象断言报（对象面三锚实勘）；10-08 版终验材料单（LG-058 闭账卷）；今日窗族三卷（栏 A/B 毕报+CTO 门禁终裁）；STE 读数卷 @31bce9f7；勘修窗三件 TriMLC commit 链；收口跟踪卷 row 65 接续段（3be47e3d）。
