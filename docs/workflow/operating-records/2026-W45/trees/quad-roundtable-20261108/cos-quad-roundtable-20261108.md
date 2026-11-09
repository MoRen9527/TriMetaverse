# 圆桌会议 COS 席产出卷（四席圆桌·BOD 主持·CEO 2026-11-08 16:43 直连令）

- sourceOfTruth: 本卷（COS 席产出·候圆桌并议·BOD 21:00 前整理呈 CEO 候批）
- syncMode: draft（圆桌评审前 COS 席面定稿）
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: CEO 16:43 直连令 → BOD 转召四席圆桌（CPO/CTO/COS/CAO）→ 产出今晚 20:30 前回 BOD → T-0 今晚 22:3x 前七项议程
- COS 席位说明: 本卷为 COS 席（m-cos）产出·七议程逐项落笔；议程 1 系 CTO 主答+本席对表迁移 SOP·议程 4/6 本席主答·议程 5 本席落表·议程 2/3 本席出方案稿候并议
- 备料锚: 备料实勘窗 16:49–17:06（sg 面值席供料卷五件 ac7079134 / CAO 四稿 ca5e534f3 / N-D3 毕报 3e0994b / N-D5 预案卷+§八勘正 16:52 / 三 daemon 活体 / 8713 17 jobs+河源 4 jobs+schtasks 全盘点）——读数均带现查时戳如实录

---

## §零 · 令链与议程对照

CEO 令七议程+流转单三项+sg 原文对表+BOD 活体探锚，本卷逐项承接：

| 议程 | 事项 | 本卷节 | COS 席位角色 |
|---|---|---|---|
| 1 | FADE-001 今晚迁移承接评估 | §一 | 对表迁移 SOP+时点勘正链 |
| 2 | 四层盯守全景图方案 | §二 | 方案稿（呈 CEO 核心） |
| 3 | daily-progress-watcher 语义面扩围 | §三 | 方案稿（FADE 实例形） |
| 4 | 台账机制重审 | §四 | 主答 |
| 5 | 需求大表两条 | §五 | 落表 |
| 6 | 定时任务全量台账+体检机制 | §六 | 落表（首轮盘点读数已实勘） |
| 7 | FADE-011 carryover+W45 梳理 | §七 | 承接落笔 |
| 流转单 | tree-op 复盘立项/制度位选型/5-6-7 落单 | §八 | 立项文+裁量 |

---

## §一 · 议程 1：FADE-001 今晚 W45→W46 迁移承接评估（CTO 主答·COS 对表）

### 1.1 时点正形勘正链（本席对表结论）

正形时点=**今晚 2026-11-08（周日）23:50**（河源 TriRMC cron weekly-plane-shift·LG-056·10-18 CEO 令 f72bdc64e）。三处陈旧面如实列：

1. **N-D2 冻结卷随卷条**（「11-08 23:00 系笔误→11-09」）——**反向误勘**（11-08 方为周日·date 断言 2026-11-08=Sunday 实锚），待 CTO 席随卷勘回（候办·非裁）；
2. **N-D5 试跑预案卷**标题与 §一「11-09（周日）23:00」双重误勘——本席已于 16:52 落 §八 erratum 勘正（随卷·卷面其余内容不变）；
3. **SOP 正身** `docs/workflow/weekly-plane-shift-local-align-sop.md` 内「23:00」旧值——第三处陈旧面，升版候批（§十候裁面 1）。

### 1.2 承接评估·T-0 前置五清单预勾读数（COS 备料面）

| # | 清单项 | 预勾读数（2026-11-08 实勘） | 勾选位 |
|---|---|---|---|
| 1 | N-D3 四骨架落位 | ✓ commit 3e0994b（毕报交付锚三证平：四骨架+patrol 接线+spec/registry 升版） | 已平 |
| 2 | 冻结态 sha | bf8ba0e0ed275546（N-D2 冻结卷） | 值席 22:3x 勾 |
| 3 | VER-002 双源 | 4976dda 系 | 值席 22:3x 勾 |
| 4 | 河源 cron job | 9c81c7ec（weekly-plane-shift）在册·4 jobs 全 enabled ✓（17:0x jobs.json 直读实锚·id-only 形态见 §六注）·lastRunStatus 细值候值席勾 | 值席 22:3x 勾 |
| 5 | R-HY 面健康 | 8710 healthz ok·jobCount=4·mcLedger ok ✓ | 已平 |

### 1.3 本机联动与风险注

- 本机对齐链就位：8713 `plane-shift-local-align`（cron_muk382i·周日 23:10）fetch+merge 零推·冲突即停——迁移后本机对齐 SOP 六步照 LG-056 A3 正身。
- **承接评估=能实弹**（五清单 2 项已平+3 项值席勾位明确·预案卷 N-D5 在卷且时点已勘正）。风险注一条：河源 jobs.json 域内形态变（list[dict]→id-only 列表）候 TriRMC 域勘——数据面读法已适配，非调度面，不阻塞迁移。

---

## §二 · 议程 2：四层盯守全景图方案稿（呈 CEO 核心）

> CEO 图景：sg duty 组（d1-d4）+本地组引擎化+8713 节拍升全公司共用底座+8711 主闸勘正+河源 dsh+tui+自研 SendMessage 同构。逐项「哪里/哪个/盯什么/为什么能盯住/风险怎么规避」。sg 原文对表取值席供料卷（ac7079134）实文。

### L1 · 服务域值班面（sg duty 组 d1-d4·现役实文对表）

| 具 | 盯什么 | 拍频 | 为什么能盯住 | 风险规避 |
|---|---|---|---|---|
| d1 daily-progress-watcher | 各席 daily-progress 卷增量 | 6×/时（10min 拍） | 卷面增量=席位产出物硬锚·禁口头 | 断链双探防抖（10min 拍+防抖窗） |
| d2 hub-watch-snapshot | 信箱+中枢快照面 | 10min | 快照面写时镜像·账实对表 | **覆盖缺口：现=信箱派生形 2 席非 14 席名册形**→候扩面（联动 §五 a 重启批+CAO 席位名址稿 roster 直读同族·根治） |
| d3 sg-watchlist-patrol | sg 面信箱/watchlist | 5min | watchlist 清单+mailbox 双面 | **修复授权面=BOD/人位令**（值席⑤设计边界维持：纯发现零修复·不自动改生产面） |
| d4 bod-progress-report | BOD 卷面进度 | 30min | BOD tick 卷面+14 席读数旁证 | tick 与席读数差集告警（假空闲缺口·CAO 名址稿 §一实证=漏补窗口期 tick 读数缺席） |

### L2 · 本地域引擎面（本机 8713 patrol 族引擎化）

- 基座=N-D3 四骨架 3e0994b 已落位（Verify runner / Score 引擎〔自 patrol --score 拆·不破现役〕/ Close 三件骨架 / Plan 门）——引擎化=拍→判→分诊→派工闭环。
- 为什么能盯住：换实例测试法验收锚（骨架零 FADE-001 域词残留断言）+tree-node-patrol 现役 5min 拍接线。
- 风险规避：引擎不破现役（Score 拆出旧路保留·fallback patrol 旧形=N-D5 post-run 主态）。

### L3 · 节拍升全公司共用底座（8713 节拍族）

- 现役 17 jobs（首轮全量台账锚·§六附一）全 enabled·异频共存（10min/15min/30min/小时拍/日拍/周拍）——底座判据=拍频分层×域间无重叠×幂等。
- 为什么能盯住：8713=本地域 daemon 常驻+watchdog 双保险（TriMLC Daemon Running+TriMLC-Watchdog Ready）。
- 风险规避：**两层分立实证入册**（TriLiveness-L1 schtasks Disabled vs 8713 job 面 enabled=True——宿主层与 job 层状态不同步，体检机制必查四读数·§六）；余量=单点 daemon 仍存，watchdog+healthz 巡检兜底。

### L4 · 边域面（8711 主闸+河源+跨域信面）

- 8711 主闸勘正：TriRLC Daemon Ready+TriRLC-Watchdog Ready（本机 R 面）——勘正项候 CTO 域排（§十注·非本卷裁）。
- 河源：dsh 通道（bod-dsh-tunnel keeper 在役）+tui——R 面 cron 4 jobs 现役（§六附四）。
- 自研 SendMessage 同构：跨域信面现役=notify 门+mailbox（**教训已入册：mailbox 直 append=死信；normal notify 只落箱不唤醒 idle 值席——信到箱≠信到人·必跟唤醒**）——同构方向=对齐宿主 SendMessage 语义（直达+必达+对话流增量验证），候 CTO 域方案批。

---

## §三 · 议程 3：daily-progress-watcher 语义面扩围方案稿（FADE 实例形）

> CEO 判：现役只盯 commit+push 不足·需 AI 读卷归纳。有考试有评分。

**方案：FADE 实例「daily-progress-semantic-watcher」**

1. **拍**：与 d1 同族 10min 拍（sg duty 组·值席面落）；读卷取增量 diff。
2. **归纳**：增量非零→AI 读卷归纳（model 轨 glm 面）；增量零→零调用（成本护栏：不空转不重复归纳）。
3. **产出**：语义摘要段落卷（树内 daily-progress-semantic-*.md）+异常分诊三型（进度停滞/口径漂移/挂账失联）→notify 链=BOD/COS（必达+唤醒正形）。
4. **考试与评分**（验收锚三件）：
   - ①归纳一致性抽验：归纳段与卷面实文逐条对表（禁演绎禁脑补·事实引用须可溯源）；
   - ②异常三型注入测试：假停滞卷/漂移卷/失联卷喂入判真（STE 门框架）；
   - ③成本读数：月度调用计数+token 汇总（CFO 成本源 token-metering-protocol·冷/热双口径）。
5. **联动**：N-D3 Score 引擎（已拆出·3e0994b）可承评分位——骨架现成候接线（候办·不抢现役 patrol --score）。
6. **分工建议**：需求裁决=CPO·实例施工=CTO/FSD 线·评分门=STE·成本读数=CFO——圆桌并议后落单。

---

## §四 · 议程 4：台账机制重审（本席主答）

### 4.1 现状三方联动

| 面 | 真源 | 机制 | 现势锚 |
|---|---|---|---|
| ① LG 系挂账台账 | `memory/open-items-ledger.md` + 镜像 `.fade/hub-snapshots/ledger-mirror.md`（写时镜像 sync-mirror.py） | 挂账/催办/销账必附验证锚（禁裸销） | 5547↔5607 行 SYNC-OK（今日 17:0x 前现锚） |
| ② board-journal 增量记事本 | `.fade/hub-snapshots/board-journal.md` | 董事会令流转逐笔 | 在卷 |
| ③ 树协议台账 | 节点台账+树投影（tree-op.json） | FADE 树节点收口 | **tree-op.json 缺失实锚：W45 47 树仅 1 树有/W44 零**（§八①立项） |

### 4.2 「小事才记账」偏差勘定（CEO 判偏差成立·本席勘处方案）

- **偏差定性**：判据失准——「小事不记」导致断链/交接/委托时无账可查，回溯成本高于记账成本（实证：今日 N-D3/N-D5 两案派发链断链勘处成本 > 若首令即挂账的记账成本）。
- **正形**：「一切承诺必记账·粒度按风险不按大小」——挂账触发线从「产出物」扩到**承诺/交接/委托三类**（接令确认、毕报承诺、候办移交均落账）。
- **机制挂接**：ledger-watchlist-patrol（8713 cron_mumsuxu 现役）已盯台账面——扩围=判据复核+拍频复核（体检批·§六）。
- **制度落点**：D 系纪律候批条（CAO 域会签·本席供料·§十候裁面 4）。

---

## §五 · 议程 5：需求大表两条（本席落表）

### a. 重启 14 席应用新配置（FADE 实例）

- **需求行**：重启生效+验证——config-sync 两层分立实证（值席④：git pull+config-sync apply 拉平面≠daemon 生效面·不重启配置不生效）。
- **FADE 实例形**：分批重启（sg 14 duty 席一批/本地 13 席一批）+逐席 healthz+**配置值面探针**（restart-window-completion-criteria 正形：healthz 绿≠配置生效·完工锚必含目标变更值面探针）。
- **通道纪律挂接**：pwsh 零宽窗教训（真宽窗+父环境 POWERSHELL_UPDATECHECK=Off）+CLAUDE_CODE_CHILD_SESSION=1 环境遗传清位（本机席位复活名址缺口正形）——两正形入实例任务书必载。

### b. 文件命名规则（CAO 主笔）

- **DEM-007 已入池**（company-demand-pool.md 同批入池·CAO 稿锚）——R1-R9 初稿在卷（naming-rules-draft-v0.1）。
- 本席落表补两条：①R3 周缀换缀（-w<WW>）归周平面迁移器标准件清单（W46 施工批同批落）；②R6 周日评审流转=joint-review-demand-pool 周四 14:00 拍（cron_muqyqy4 现役）例行评审位挂接。

---

## §六 · 议程 6：定时任务全量台账+定期体检机制（本席落表·首轮盘点已实勘）

### 6.1 首轮盘点读数表（2026-11-08 16:5x–17:0x 实勘）

| 面 | daemon | jobs | enabled | 明细锚 |
|---|---|---|---|---|
| 本机 M-本地域 | TriMLC 8713（uptime 156854s） | 17 | 17/17 | 全名单=附一（本轮 TRILC_INTERNAL_TOKEN 门内实探） |
| sg M-服务域 | TriMMC 8712 | 16 | 候值席 token 门内调取 | 计数实锚；明细=体检批首批施工项 |
| 河源 R-本地域 | TriRMC 8710（healthz ok·mcLedger ok） | 4 | 4/4 | jobs.json 直读=附四（id-only 形态现锚）；名单明细=上轮实勘在案+体检批复核 |
| 本机宿主层 | schtasks | Tri/bod 系 10 | 8 Ready+2 Disabled | 附二（PlatformExperiencesHelper 两件=系统自带噪音·防误录） |

### 6.2 陈旧探条随清与退役案

- sg 8710 陈旧探条随清（d3 随清注：8710=河源正身机位·sg 侧该探条系历史残留·daemon 机位矩阵 memory 正身已勘）；e15 已退役核销（e15-modern-standby-ruling 树在案）。
- root tmux 残留：sg root default 会话（9-24 起 pid 1272108）=**纯陈旧终端·退役安全**（BOD 活体探锚勘明）——退役执行候批（§十候裁面 2·d1 视野缺口残留源消除）。

### 6.3 体检机制设计（月度定检+drift 告警）

1. **月度全盘点 job**（8713 新立 cron·候批）：四 daemon 全探（8711/8712/8710/8713）+schtasks 全扫，对表台账正身件。
2. **健康四读数**：jobs 计数对账 / enabled 态 / lastRunStatus / healthz——**两层分立必查**（TriLiveness-L1 实锚：schtasks Disabled vs job 面 enabled=True，宿主层与 job 层状态不同步=体检必卡读数）。
3. **drift 告警**：盘点读数 vs 台账件差集>0→即告 BOD/COS（禁静默漂移）。
4. **台账正身件**：`docs/workflow/` 下立定时任务台账正身件（候批立件·制度位联动产出③·§十候裁面 8）。
5. **首批施工项**：sg 8712 16 jobs 明细调取（token 门内）+河源 4 jobs 名单复核。
6. **注**：河源 jobs.json 域内形态变（list[dict]→id-only）=TriRMC 域内态变候勘（数据面读法已适配·不阻塞）。

---

## §七 · 议程 7：FADE-011 未完测试进度+W45 周工作梳理

- **intake 现势**：61 run 扫描毕+CTO 短评（PASS+修注 2+裁定 3）·N-D3 前置已毕（3e0994b·M1/M5/M6 解锁）。
- **未完测试主体**：四骨架单元测试族候 STE 门（STE 测试批候排）。
- **carryover 落行（W45→W46）**：①「FADE-011 骨架单元测试族（STE 门）」②「引擎完整抽取批（fsd 候排窗）」两行入周平面 carryover。
- **W45 周工作梳理进 FADE-001 plan skill**：联动=N-D5 试跑=今晚 23:50 迁移实弹=plan skill 首验现场；W45 周工作素材（47 树现势+台账 5547 行+结算链收口）已构成 plan skill 输入样例——候 N-D5 post-run 复盘并录。
- **在办树现势清单（N-D5 §六空缺供料）**：W45 现勘 47 树目录（17:0x 实勘·16:5x 初勘 43 树后续落卷至 47·以现勘为准）=附三；台账现役挂账行=ledger 现役段（5547 行现锚）。

---

## §八 · 流转单三项（CEO 已裁·本席落单）

1. **tree-op.json w45 缺失复盘立项**：实锚=W45 47 树仅 1 树有 tree-op.json/W44 零树（17:0x 实勘）——立项文=「tree-op.json 落卷工序缺失复盘」（CEO 图景第一层：w40-w44 产出形态验收标准缺失）——建议入 company-demand-pool 候批（DEM 号候编·CAO 域）。
2. **周工作平面常用文件标准化制度位选型（本席裁量·与 CAO 合）**：采 CAO 稿主选（b）**单一制度正身件** `docs/workflow/weekly-plane-file-standard.md`——不选每周 readme 形（52 份/年=漂移面复发·对账基座=制度面单点真源+registry 指针）——候圆桌追认+CEO 批。
3. 议程 5/6/7 落单见 §五/§六/§七（已按单落笔）。

---

## §九 · CAO 四稿会签意见（本席会签位·圆桌并议）

> CAO 四稿@ca5e534f3 树 cao-gov-standard-drafts-20261108/ 全读毕。

| 稿 | COS 会签意见 |
|---|---|
| 产出① R1-R9 命名规则 | 采认。补两条：R3 周缀换缀归迁移器标准件清单（§五 b）；R8 禁改面一致性铁律与台账纪律联动（改面必过账）。 |
| 产出② FADE 跑后记录规范（**本席联合主笔件**） | 采认制度形。两补：①`trees/fade-runs/<instance-id>/` 迁移槽挂接进 P2 池系标准件族清单（W46 迁移器施工批同批落）；②在途 run 留旧周+新周滚动指针的标准化形态候圆桌定谳——本席倾向**指针形**（复刻 README-POINTER 一致性逻辑+fade-audit-latest.json 同族先例）。分工自领：制度形=CAO／周平面收口与迁移器对表=COS（本节即会签）／机制落盘（driver 落盘）=CTO 候。 |
| 产出③ 周平面文件标准化 | 采认主选（b）单一制度正身件形；本席裁量落 §八② 与 CAO 稿一致。 |
| 产出④ 席位名址同步工序（CHO 确权案） | 采认。两点：①机制候选 A（LOCAL_SEATS 改 roster 直读·根治）=本席支持（单一真源·防漏根治·与 hub-watch 扩面同族联动 §二 d2）；②三查断言验收锚=机械断言正形合规（M-001 同族）。owner 分层（CHO 发起/COS 销账验收/机制实现=CTO）与分工面无冲突——CHO 确权随圆桌并议。 |

---

## §十 · 候裁面清单（候裁件不入任务书·与执行面分装）

1. SOP 正身 `weekly-plane-shift-local-align-sop.md`「23:00→23:50」升版（CTO/COS 域·候批）；
2. root tmux 残留退役执行（BOD 活体探锚已勘明·候批）；
3. d3 修复授权面（=BOD/人位令设计边界维持·监督面扩围候选候议）；
4. 台账机制制度条（D 系候批·CAO 域·本席供料 §四）；
5. tree-op 复盘立项 DEM 号编配（CAO 域）；
6. 产出②在途 run 指针形定谳（圆桌/CEO）；
7. watcher 语义面扩围 FADE 实例立案（§三·圆桌/CEO 候批→CPO/CTO 分工）；
8. 全量台账正身件立件+月度体检 job 立项（候批）；
9. N-D2 卷勘正随卷条勘回（CTO 席随卷办·非裁）。

---

## 附一 · 8713 jobs 全名单（17·2026-11-08 17:0x 实探·全 enabled）

| id | name | schedule |
|---|---|---|
| cron_muh6shv | trimodel-l2-scan | （事件/默认拍） |
| cron_muh6vt2 | trimodel-l3-remind | （事件/默认拍） |
| cron_muk382i | plane-shift-local-align | 0 10 23 * * 0（周日 23:10） |
| cron_muk3951 | tree-node-patrol | （默认拍） |
| cron_mumsuxu | ledger-watchlist-patrol | （默认拍） |
| cron_muo2mj6 | hub-silent-detect | */15 * * * * |
| cron_muqyqy4 | joint-review-demand-pool | 0 0 14 * * 0（周四 14:00） |
| cron_muxxy5w | n2-watchdog-dev | （默认拍） |
| cron_mv0bq1v | performance-sunday-settle | 0 0 21 * * 0（周日 21:00） |
| cron_mv0bvbz | bod-tick-30min | 7,37 * * * * |
| cron_mv3505v | glm-quota-obs | 0 30 9 * * * |
| cron_mv3506h | window-dispatch-remind | 0 0 9,18 * * * |
| cron_mv3506j | tri-liveness-l1 | （默认拍） |
| cron_mv9g96z | echo-pull | （默认拍） |
| cron_mvbe9tp | e1-window-reminder | （默认拍） |
| cron_mvbzgj3 | cos-patrol-timer | （默认拍） |
| cron_mw1rdhy | fade011-daily-sweep | 30 3 * * * |

## 附二 · 本机 schtasks Tri/bod 系（10 条·2026-11-08 17:0x 实探）

| 任务名 | State |
|---|---|
| BOD-BlackFormatterLeakPatrol | Ready |
| bod-dsh-tunnel | Ready |
| TriHubWatchdog | Ready |
| TriLiveness-L1 | **Disabled**（vs 8713 job 面 enabled=True=两层分立实证·§六 6.3） |
| TriLiveness-L2 | Ready |
| TriMLC Daemon | Running |
| TriMLC-Watchdog | Ready |
| TriModel-Watchdog | **Disabled** |
| TriRLC Daemon | Ready |
| TriRLC-Watchdog | Ready |

（PlatformExperiencesHelper_Metrics / RunPlatformExperienceHelper_Metrics 两件=系统自带噪音·非我司件·防误录。）

## 附三 · W45 在办树现势名单（47 树目录·2026-11-08 17:0x 实勘）

a1-run-tree-loss-triage / a4-test-expectation-debt / board-gov-proposal-roundtable-20261105 / bod-roundtable-watch-base-20261108 / bod-tick / bodtick-mailbox-cease / cao-gov-standard-drafts-20261108 / coo-supervision-w45 / cos-patrol-timer / dispatch-progress-design-roundtable-20261106 / docs-maintenance-expansion / dsh-glm-switch / dsh-superagent-research / e1-daemon-jobs-window / e15-modern-standby-ruling / ew-stage3-trimmc-deploy / fade-rehearsal-01 / fade-sweep-8713-enoent-ruling / fade011-ew-auto-trigger / fade011-ew-daily-form / fade011-ew-runs / fade011-ew-week-template / fade011-maintenance-wiring / fade011-quality-review / fade011-s1-state-machine / fade011-s2-recovery / fade011-s3-skill-loading / fade011-s4-check-wiring / fade011-s5-integration / fade011-s51-plan-wiring / fade011-uat-live-run / file-family-maintenance / form2-live-test-01 / form3-alpha-beta-impl / pm-seat-enable / sg-tricompany-divergence-r6 / silent-detect-anchor-tune / source-publish-gate-ruling / tricade-build-ci-red-ruling / trilc-trimc-naming-cleanup / trimlc-repair-20261106 / trimmc-8712-restart / trimmc-pickup-port-ruling / tripilot-e2e-gate-ruling / tui-shared-move / w45-carryover-fade001-upgrade / w45-carryover-local-execution

（注：值席供料卷 cos-roundtable-supply-20261108.md 为树目录外文件·不计树数。）

## 附四 · 河源 8710 jobs 现文（4·2026-11-08 17:0x jobs.json 直读·id-only 形态）

9c81c7ec-ed76-4489-98c0-81c6601f541b（weekly-plane-shift·正身 job）/ 381a1886-f270-45dd-a216-c3002c873134 / fba9d2c7-9f97-406b-b2be-17ae38e076ac / dbc9229f-be7f-4d57-bcd8-6f042e59a712

（名单明细=上轮实勘在案·体检批首批复核项 §六 6.3-5。）

---

—— COS 小贾（m-cos）·写前现查 2026-11-08T17:06:10+0800（date 原值·D-47 正形）
