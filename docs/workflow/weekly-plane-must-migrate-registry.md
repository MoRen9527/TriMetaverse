# 周工作平面必迁文件制度位（weekly-plane-must-migrate-registry）

- sourceOfTruth: 本件（docs/workflow/weekly-plane-must-migrate-registry.md）
- syncMode: source-only
- lastSyncedAt: 2026-11-15T20:36:25+08:00（date 现查原值·写前跑·D-47 正形）
- 制度 owner: CAO（制度化面·制度件归域规则正身位）；判定 owner: COS（线 1 清单定谳面·r72/r76 重估卷滚动）
- 生效: 线 2 制度定义面落档即生效（W46→W47 loop 第 1 轮从零态起·r76 轮次正形）；keep 族两件=**候裁附款**（CEO 候两裁，裁推翻改 migrate→线 3 白名单补施工·定义面不返工主体）
- 令源链: CEO 11-15 19:31:48 直令（线 2 必迁清单制度化）→线 1 COS 清单定谳卷 6cfe91276（§一八件判定）→本制度位落档
- 边界: 本件=定义面（必迁/留置定义+机判判分依据固化）；执行面=迁移器（R-HY weekly_plane_shift）+线 3 写死脚本（候首拍施工窗）；**零链面改动 ✓**（本笔纯新增制度文件，未触迁移器/白名单/脚本）

## 一、必迁族（migrate·五件·W46 起点验收判据）

| # | 载体 | 定义 | 机判判据（线 3 判分面固化基础） |
|---|---|---|---|
| 1 | OP json（`OP-YYYY-Wnn-001.json`） | 周索引机器对象 | 新周目录存在 `OP-<新周号>-001.json` 且 JSON 可解析 |
| 2 | unresolved-items（`OP-YYYY-Wnn-001.unresolved-items.md`） | 未决事项现役区载体（LG-072 改形：只动现役区·历史面冻结归档件） | 新周目录存在同名 `.unresolved-items.md` 且含「现役区」节；旧周件不被修改（历史冻结） |
| 3 | `company-demand-pool.md` | 需求池表正身=**跨周资产随 weekly-plane-shift 平移不重建**（旧周件带「已平移」归档注记留史只读） | 新周目录存在 `company-demand-pool.md`；旧周件含平移归档注记 |
| 4 | `daily-progress.md` | 仓库级粗粒度进度兜底流水（事件驱动主+巡检兜底 watcher 双维护） | 新周目录存在 `daily-progress.md` 且非空 |
| 5 | `task-inventory-YYYYMMDD.md`（日期形） | 任务进度大表当周现役真身（周内原地滚动文件名不动+跨周强制迁移：上周在途+毕候验逐单迁入·CEO 10-13 定谳；r78 增补入必迁族） | 新周目录存在 `task-inventory-*.md`（glob 日期形）；上周未清零时禁空表（空表合法仅当上周真零未完成） |

## 二、留置族（keep+expected_absent·两件·候裁附款）

| # | 载体 | 定义 | 机判判据 |
|---|---|---|---|
| K1 | `cfo-quota-daily-wNN.md` | CFO 额度日报周界件（随周新建·append-only 周内） | **expected_absent**：新周目录**不应**出现旧周同名件副本（出现=误迁缺陷告警）；新周自有 w<新周> 件照 CFO 节律自建非迁移面 |
| K2 | `scoring-ledger-wNN.md` | 评分台账周界件（同上形态） | 同 K1 |

- **候裁附款**（CEO 候两裁·11-15 BOD r81 面载）：若 CEO 裁 K1/K2 推翻判 migrate → 白名单改形走线 3 补施工（候裁知会机制在案）；**制度定义面主体不返工**——届时本表 K1/K2 行改判+判据翻转，必迁族五件不动。
- 树三族（`trees/**`）=keep：树目录不随迁移器搬移（翻周归位口径：产出写当周·已收口件留原周——BOD 2026-09-22 示下）；机判不检树面（跨周活动树双落位系既有形态，W42 补查卷 L4/L7 在档）。

## 三、机判判分基础总则（线 3 写死脚本固化依据）

1. **判分单位=周对（Wn→Wn+1）**；从零态起评（W46→W47 loop 第 1 轮为首个判分窗·r76 轮次正形）。
2. **硬判据五项**=必迁族表 1-5 存在性判据全过；任一缺失=判分不过→触发补迁告警（告警路由=值席信箱面·D-37 通道族）。
3. **expected_absent 校验两项**=K1/K2 旧周副本存在性（出现即误迁缺陷告警）。
4. **形态校验两附**=unresolved 含现役区节（LG-072 形）+task-inventory 空表合法性（上周未清禁空表）。
5. **判分读数落档**=每轮判分结果入当周周平面（机判卷·候线 3 施工定形），供周会/大表复核。

## 四、定义依据链（逐项可溯）

- 线 1 卷=6cfe91276（§一八件判定：五件族 migrate/两件 keep+expected_absent/树三族 keep）
- r78=必迁族四扩五（task-inventory 入族·CEO 11-15 20:06:45 指正）
- W42 补查卷素材=task-inventory 逐周断档三周（W43/W44/W46·机判缺口活体实证）+需求池「迁移器 carry-over 未含池系」CPO 手工补课注（10-19）+LG-072「只动现役区」条（CAO 归口欠账候窗与本件同窗补铸候选）
- 翻周归位口径=BOD 2026-09-22 示下（已收口件留原周/在办随人迁新周/产出写当周）
- SOP 面=weekly-plane-shift-sop.md（生产链）+weekly-plane-shift-local-align-sop.md（本机对齐·LG-056）——指针行候窗补（本笔不加，防链面歧义）

## 五、落款与留痕

- 本件落盘未提交（候值席/编排面收编·如实注记）；毕报归转=CAO→值席（loop 第 1 轮触发）→BOD 呈 CEO。
