# FADE-001 十阶段重审 · CTO 技术方案主笔稿（前两段回审+第 3 段先行+4-10 框架）

- sourceOfTruth: TriMetaverse/docs/execution/fade001-ten-stage-techplan-cto-20261113.md（本件·技术方案主笔稿）
- syncMode: write-time（随段落卷·候 COS 代裁+COO 拆树后按段施工）
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: CEO 17:26 大会组织令（ad36d191·台账 529 笔 74a97c36f）+追加令 17:26:42（530 笔·裁决归 COS 代裁）→COS 托转 17:32→本稿
- 双并行注: CPO/PM 产品方案并行（产品语义面接口=§二.5 候审面）；FSD=实现协同席（本稿=架构与路线正身·实现细节施工随拆树）
- 坐标系锚: FADE 规范十阶段（CEO 2026-11-10 20:53 定谳）=触发执行→Agent qualify→plan skill→DCE→verify cli→score cli→score skill→close skill→close cli→结论与动作；映射总表+第一阶段五要点正身=`docs/execution/fade-001-improvement-20261110.md`+树面拆解稿（7da350710·CEO 11-12 22:47 定调）·五要点联审生效锚=36bf14a1d

## §一 前两段技术回审（第 1 格触发执行+第 2 格 Agent qualify）

判据面=映射总表十格+第一阶段五要点（联审生效版）。现役基线=TriRMC e408da5（alarm 三分支+47/47）+TriCompany bf3c954（qualify 19/19）+河源 daemon vB 在值（4f990e911c3f·next=1794757800000）。

### 第 1 格对表（五要点逐条）

| 要点 | 现役实锚 | 回审 |
|---|---|---|
| 1 铸 run id | vB payload `RUN_ID="shift-W{fromWeek}-$(date -u ...)"`·全链携带（run dir/log/manifest） | ✅ 达成（形制与要点稿一致·`shift-W{week}-{ts}Z`） |
| 2 preflight 上移 | vB 序 preflight 第一步+RC guard（非零即 exit）+manifest 记 preflight_exit+EXIT trap 告警——分叉预检挂=这拍不执行·业务零触 | ✅ 达成（F4 主解「死得早死得响死在正确阶段」成立） |
| 3 触发告警闸 | alarm.ts missed-run/failed-run/arrival-missing 三分支·job 级挂法（circuit per kind）·arrival 35min grace | ✅ 达成·**判据形升格注**：要点稿写「无 per-run 成功日志即告警」，现役判据=job.state 窗+exit status+run dir arrival.json 三面结构化判定（manifest+arrival 双件承载「per-run 成功」语义）——等价升格入档 |
| 4 bash 改形交棒 | vB 仍一杆（preflight→qualify→pull→迁移→push 全在 payload） | ⚠️ **部分达成**——qualify 入链=过渡形；「bash 只干第 1 格」未达成·残余归第 4 格施工项（DCE 拆段时 payload 瘦身为交棒形） |
| 5 F5 store/logs 分家 | 河源 store=`./data/cron/jobs.json`·logs=`/var/lib/trirmc/cron/logs`（11-12 深探实证） | ❌ 未做——两行级 config 显式化·归第 1 格残余（可并入第 4 格施工顺手窗） |

### 第 2 格对表

| 判据 | 现役实锚 | 回审 |
|---|---|---|
| 到岗窗断言+告警 | F2 arrival-missing（35min grace·touch 豁免·job 名单连字符形·mtime 序判定 e408da5） | ✅ 达成（勘偏③字典序劫持已单测钉死） |
| 健康探针（8710 healthz） | 住在 preflight 四条（第 1 格内） | ✅ 分工合理——探针归 preflight（先于资格断言）·无需移动·如实注 |
| 准入资格断言 | qualify.py 五断言（执行身份/run dir 可写/git 身份/告警凭据/磁头余量）·演练首拍 root 实锚=存在价值实证 | ✅ 达成+**扩展语义注**：映射稿第 2 格原列「到岗窗+健康探针」·qualify 五断言=准入资格面实质扩展（联审 36bf14a1d 已过）·稿面语义扩展入档 |

### 回审总结论

前两段技术面=**通过（带残余清单）**：第 1 格 3/5 全达成+2 项残余（bash 一杆未拆→第 4 格·F5 分家→顺手窗）；第 2 格达成（F2+qualify 扩展入档）。残余不阻第 3 段推进。

## §二 第 3 格 plan skill 技术方案先行稿（本席主笔面）

### 定位与形态

- **段语义**（映射稿）：L4 扩展=迁移范围分析——哪些周迁/哪些不迁/carry_over 清单预审（上周手动迁移的准备工作归此段）·产出迁移清单候审。
- **形态裁（APPROVE·FSD 协作稿 §二.1 采纳）**：独立薄模块 `plan_scope.py`（TriCompany `runtime/cognition/`·照 preflight/qualify 先例形同族：stdlib only/退出码 0/2 族/JSON 单份落卷）——三段业务面切片零重叠（preflight=该不该跑·qualify=有没有资格·plan_scope=迁什么不迁什么·单点探针纪律）；γ 二道闸 verify 归位接口预留（阶段 5 verify.py 以 plan.json 为对表基准）。不并入迁移器（现 weekly_plane_shift 的「迁什么」隐式逻辑升格为显式清单）。
- **产物**：`$RUN_DIR/plan.json`——全链下游（DCE/verify/close）以此为准入与对表锚。
- **段产物命名契约对表（PM 供稿 17:50·CPO 授权 17:49:19·本席收讫采认）**：run id 正形 `shift-W{fromWeek}-{YYYYMMDD}T{HHMMSS}Z`（fromWeek 显标·定死不再改名）/段产物文件族=arrival/preflight/qualify（三件在役）+plan/verify/score/close/manifest（全 JSON 机械可解析·段名→文件名一一映射）/job 正名 `weekly-plane-shift`（连字符形·勘偏①正名）/告警文案必带 run id/「取最新」判定禁字典序 mtime 序正形——与本稿 §二.4+§三表产物列一致零漂移。**范围钉子采认**：本契约只载机械契约名+run id 形制；迁移语义判据走档面正身（08f135f16 §五 CPO 语义锚+STE §三锚草案五条）不随本契约——施工引语义判据时引档面锚。

### 设计要点

1. **周算术归位**（L4）：`--from {fromWeek} --to {toWeek} --start-date {startDate}` 与 vA1/vB 模板变量同族——plan 段内做周值合法性断言（from<to·连续性·γ 防错周静默消解的第一道）。
2. **输入面**：`--operating-root` 扫描 fromWeek 树面——trees 开放项归集+unresolved-items 存量+carry-over 清单源三输入。
3. **判定面（迁/不迁）**：语义锚直引（CPO 产品稿对接点 5·08f135f16 §五照档施工）——「这是一周的记录还是这一周的活——**记录随周封存·活随人带走**」；树面开放项按 face 路由归位出迁移清单；不迁项=显式豁免清单（带豁免理由字段——非静默丢弃）；carry_over 预审=跨周挂账项核（挂账带主检查·J2 同构·非空必带状态去向字段——STE 锚③）。
4. **预期周断言**（γ 缝隙主解）：plan.json 载 `{from, to, tree_counts, carry_over_count, exempt_count}`——verify 段对表同值（二道闸）。
5. **候审面**（产品语义接口·CPO 会签前置点）：plan.json 落 run dir 后+DCE 段执行前——迁移清单取舍属经营/产品语义（哪些周平面内容进新周）·十阶段完整形下此候审=agent 承接面读取点；首拍全链形=清单随 run 卷面留痕候审（自动链止于清单产出+留痕·不引入人工卡点阻塞 23:50 拍——**候审语义=留痕可审**·非阻塞闸，边界如实注候 CPO 产品方案对齐）。

### 验收锚（第 3 格·两层锚形显标+失败方向标注·STE 六原则对表）

| # | 锚 | 收口点 | 失败方向 |
|---|---|---|---|
| P1 | plan.json schema 断言（可机器解析·非自由文本·照 tri-fade011-plan 结构门先例——STE 锚①） | 单测面（schema 毒化注入案）+生产面（首拍） | 漏报毒（schema 门非橡皮图章） |
| P2 | 双向枚举断言：迁移清单∪不迁清单=周 plane 内容全集·零遗漏零重叠（STE 锚②） | 单测面（遗漏/重叠注入案） | 漏报毒（静默丢项=迁移缺口） |
| P3 | 周断言过（错周输入=非零退出+manifest 告警） | 单测面 | fail-closed |
| P4 | 零迁移周=显式 `migrate_count: 0`+理由字段 | 单测面 | 漏报毒 |
| P5 | γ 二道闸对表锚：verify 段 plan 清单 vs 实迁对表（STE 锚④·第 5 格咬合） | 生产面（首拍） | 漏报毒 |
| P6 | 替身禁令负路径：plan 不可达/schema 毒化=FAIL-EXPECTED 不造替身（S51 三向先例——STE 锚⑤） | 单测面 | fail-closed |
| — | 单测族：周算术+树面扫描+豁免显式+schema+双向枚举+负路径（目标 ≥20 案·runner=glob 文件形口径·STE 原则 5） | 施工毕报必载 | — |

## §三 第 4-10 格逐段技术路线框架

| 格 | 现状承载 | 改造件 | 验收锚 | 依赖 |
|---|---|---|---|---|
| 4 DCE | vB 后半一杆（pull→迁移→push） | 拆独立段：payload 瘦身交棒形（preflight→qualify→plan→交棒）+段内统一自愈标准（pull 失败重试 N=2→告警不硬滚·F4 副解） | DCE 段独立日志段+自愈路径单测+交棒形 payload 骨架断言 | 3 格 plan.json |
| 5 verify cli | L7 步 4 validate（部分·在迁移器内） | 独立 `verify.py`：新周 index active 断言+**对表 plan.json 清单**（γ 二道闸——清单逐项落地核） | verify.json+清单逐项对表读数+不一致拦截案 | 3+4 格 |
| 6 score cli | fallback patrol 旧形 | score_engine 实弹（J5-J7 退出条件落地：首拍强制实弹·引擎缺席=升级不静默 fallback）·产物 score.json 落 run dir | 真轮实弹一案（J6 骨架验收=实弹）+缺席升级路径 | 5 格 verify.json |
| 7 score skill | 评分卷面 | 不变（考卷侧零改动） | — | — |
| 8 close skill | L7 步 5 agent_close（部分） | 拆扩：复核+升级清单提取（升级项=J7/J5 触发面+告警面聚合） | close 段产物+升级清单非空路径案 | 6 格 |
| 9 close cli | 无显式 | run 收口：`close.json` run id 终态聚合落卷（每次巡检 commit 即该 run 终态·FADE-012 适配语义） | run dir 终态四件齐（manifest/plan/verify/close） | 5-8 格 |
| 10 结论与动作 | L7 步 6 聚合+notify | 结论聚合+通知+**F 系登记销项面**（ζ 成功通知不可达候验证定性：notify 200 读数+落箱核验双证） | 聚合卷+notify 双证读数+F 系销项记录 | 9 格 |

### 段×退出码→告警级→收件人映射表（CPO 对接点 3·告警闸与升级路由判据面）

| 段 | 退出码 | 语义 | 告警级 | 收件人 |
|---|---|---|---|---|
| 1 preflight | 0=过 / 拦截码入 manifest | 前置检查拦 | 败跑（failed-run 级） | COS+CEO 双址（alarm 现役路由） |
| 2 qualify | 0=过 / 2=资格拦（0/2 族既有） | 准入资格拦 | 败跑级+manifest 记 qualify_exit | COS+CEO |
| 3 plan | 0=过 / 周断言/schema 败=非零 | 范围分析败 | 败跑级 | COS+CEO |
| 4 DCE | 0=过 / 段内自愈失败=非零 | 执行败 | 败跑级+arrival 缺席=00:25 前 arrival-missing | COS+CEO |
| 5 verify | 0=过 / 对表不一致=非零 | γ 二道闸拦 | 败跑级（拦错比放过好·fail-closed） | COS+CEO |
| 6 score | 0=过 / 引擎缺席=升级路径（非静默） | 评分败/缺席 | 升级面（J7：强制评分轮缺席=升级不静默） | COS→候裁面（D-39 分级） |
| 8 close skill | 升级清单非空=清单提取（非失败） | 复核产出 | 清单随 close.json 流转 | COS |
| 全链 trap | payload EXIT 任何非零 | 败跑兜底 | shift_notify_fail 链 | COS+CEO |

（升级分级对表 D-39：CEO 三类之外全 COS 代裁·530 笔追加令现行口径。）

## §四 施工拆段与依赖序（候 COS 代裁+COO 拆树·排工单候 COO）

1. **先行批（即启·文档与代码面·零生产触点）**：第 3 格 plan.py 骨架+单测（CEO 令点名 plan skill）→第 5 格 verify.py 骨架+对表逻辑→第 9 格 close 收口形骨架——三 CLI 骨架与 vB 生产面零触·单测面推进。
2. **第二批**：第 4 格 DCE 拆段设计定稿+交棒形 payload vC 文稿预制（**PATCH 动作候新树新授权双签**）+F5 顺手修代码面。
3. **第三批**：第 6 格 score 实弹接入+第 8 格 close skill 拆扩+第 10 格聚合销项面。
4. **生产触点纪律重申+「实现≠部署」两层窗（COS 裁决 A·531 笔 cfe70c958 定谳·本稿对表）**：今晚 21:00=**实现面**（骨架+代码+测试落仓落绿·预演形最小判据全真·零生产面触·现役 vB 保持·裁决 B=骨架段验收锚预演形最小判据每段产物落卷即验）；周日 23:50 首拍=**部署+十阶段全链实走**（生产面触窗=首拍前置授权窗·新树新授权件双签承载·payload vB→十阶段形在授权窗内排布）。静置冻结链维持（jobs.json vB 值面 4f990e911c3f+next=1794757800000+首拍前三面冻结·STE §三.6 对表）。
   11-15 23:50 硬时钟不动；值守判据族随十阶段落形更新（届时本席出稿 COS 托转值席）。
5. **首拍语义**：十阶段全链实走迁移预演+评分——vB 现役形=首拍 fallback 基线（若十阶段形授权窗内未毕·首拍照跑 vB=合规降级·J5 反例注：此 fallback 有明确退出条件=十阶段形部署）。

## §五 风险与如实边界

- **21:00 窗现实边界**：3.5h 内十格全施工不现实——本稿按「框架先行+分段落形·不虚标完整」推进（CEO 令「如实推进不虚标」同构）；今窗可交付=回审+第 3 格方案先行+三 CLI 骨架单测面；DCE 拆段与 score 实弹候批后窗。
- **qualify/plan/verify 职责重叠风险**：三段均产出 run dir 件——run dir 文件契约（manifest/qualify.json/plan.json/verify.json/close.json 命名与读取方）需一段内定谳防接口漂移——本稿 §二.4+§三表产物列=契约初稿·候 FSD 实现时对表。
- **CPO/PM 接口**：迁移清单取舍语义（§二.5）=产品面会签点——本席只出技术承载形态，取舍判据归产品方案稿。
- **score 实弹风险**：score_engine 中性冒烟 28/28（3e0994b）但未实弹（J5-J7 实锚）——实弹接入独立 gate·不与 plan/verify 并批。

## §六 使用依据

映射总表+五要点=`docs/execution/fade-001-improvement-20261110.md`+fade001-ten-stage-mapping-20261112.md（7da350710）·联审生效=36bf14a1d·CEO 令=529/530 笔（74a97c36f）·现役基线=TriRMC e408da5+TriCompany bf3c954+河源 vB 4f990e911c3f·COO 验收=522 笔（8cc6d529f）·COS 采认信 17:19。

## §七 架构裁决记录（FSD 协作稿 7c21224b9 候裁三项·域内专业裁决·裁毕留痕）

| # | 候裁件 | 裁定 | 理由与条件 |
|---|---|---|---|
| 1 | plan_scope.py 独立薄模块形（FSD §二.1） | **APPROVE**（名采纳：本稿原 plan.py→plan_scope.py） | 防段名/模块名歧义+scope 语义贴切；stdlib only/0-2 族/JSON 单份落卷同族纪律 ✓；三段业务面切片零重叠 ✓；词面判据误分类残余（FSD §二.2 如实注）可接受——verify 对表可捕+carry_over 兜底·漏报毒于误报方向下正确取舍 |
| 2 | score/close RC2=非阻塞告警·COS 单址·不拦终态（FSD §三） | **APPROVE 附两精化** | ①score RC2（跑了但败）与引擎缺席（J7 升级面）两路径分立勿混——映射表行 6 升级语义保留；②close RC2 非阻塞但漏报方向护栏：close.json 必须显式载 `upgrade_list_state:"not_extracted"`（升级清单提取缺=禁静默缺省）+COS 告警知情可人工补提取 |
| 3 | 妆容 run dir 双 W 债 DCE 段顺手窗清理=FSD 承接 | **APPROVE·窗位定谳=首拍验收毕后的授权窗** | 清理=河源生产面触点（runs 数据删除）——今晚实现窗零生产触（裁决 A）+历史 run dir=演练/首拍证据链首拍验收前保留；执行须新授权件白名单载明删除触点+删除前 mtime 序清单留痕（防审计断链） |
| 4 | CARRY 日期形正则漏匹配现役缺陷候选（FSD §二.8 发现③·候裁） | **定性不成立·驳回修复（本席实勘裁定）** | 实勘 `TriCompany/runtime/cognition/weekly_plane_shift.py` L103-123：①`_CARRY_ID_RE=r"CARRY-\d+"` 用途=**行识别**（L107 `.search()` 子串匹配）非 id 全串提取——日期形 `CARRY-20260728-NNN` 被 `CARRY-20260728` 前缀命中·识别零漏（FSD 按全串匹配心智读取=引用面误读）；②bump 本体=`_WEEK_CELL_RE` 周计数 token（`Nw+`→`(N+1)w+`）与 CARRY id 形态正交·id 不参与 bump 判定；③8w 升级面 L189=substring 检查（`"CARRY" in line`）形态无关；④实盘 blast path 实锚：dated 形（CARRY-20260728-* 六笔+CARRY-20260629-* 一笔）就在迁移对象 W46 `OP-*.unresolved-items.md` 内——首拍 W46→W47 bump 面两形态全覆盖零漏行；⑤引用勘正：正则真身=weekly_plane_shift.py L103（FSD 引名 shift_carry_over.py 系误记）。**次级知情注**：识别正则宽松形（CARRY-数字前缀即认）方向=误报面非漏报面·现势零实害（实盘无第三形态）不修·verify γ 二道闸（P5）可捕未来污染形态；**plan_scope 采纳面**：carry_over 清单计数自带显式双形态正则 `CARRY-(?:\d{8}-)?\d+`（清单计数精度面·非缺陷修复面——plan.json carry_over_count 须两家族数得准）。另发现①②④（全集落实盘/index 元数据域/tree-op 非普适 degrade keep）=知情采纳·入 plan_scope 设计约束（§二.2 输入面落文件系统实盘扫描不从 index 读） |

—— CTO 小狄（m-cto·十阶段技术方案主笔稿 v1），写前现查 〔commit 时戳锚·D-47 增补款正形〕
