# docs 维护 FADE 实例试卷（出卷稿·候 CEO 审题）

## 文档同步元信息

- sourceOfTruth: 本件（TriMetaverse/docs/execution/docs-maintenance-fade-assessment-paper.md）
- syncMode: source-only
- lastSyncedAt: 2026-11-02T22:35:24+08:00（date 现查原值；修订随行）
- 状态: **未冻结草稿·候 CEO 审题**——考题经 CEO 审核后方可用于首 run（CEO 五决 2026-11-02 决 2）；冻结时点=首 run 的 Plan 时点（spec §2.6 v2.0.3 立法），冻结程序见 §四
- 出卷令源: CEO 五决 2026-11-02（决 1 归口 CAO·决 2 CAO 出卷·决 4 阈值自声明），BOD 流转信 2026-11-02 21:47 达本席
- 出卷准绳: `TriCompany/docs/engineering/fade-protocol-spec.md` **v2.0.6** 现行——§2.6「设计思路」段+出卷方法指引（3945fd3）＋§2.8 Plan 协同作业规则（c5a392f）——考题=测试集→答卷=证据集→得分=评分 JSON，三件套同构大模型评测打榜
- 格式参照: fade-assessment-paper-template.md v1.1.0＋FADE-007 试卷（E-3 卷形）
- 实例背景: `docs/workflow/operating-records/2026-W45/trees/file-family-maintenance/draft-ceo-bod-session-20261102.md` §八（十段映射正身）
- 修订记录: 2026-11-02——①§1.1 规则面补全路径（CEO 审题意见·BOD 代勘 7aed547e1）；②本席随勘增补 **Plan 段协同作业口径**（CEO 口审定调同日·见 §1.3/§五，首 run 选型 a 同令定谳）；③协议对表 v2.0.5→**v2.0.6**（c5a392f §2.8 Plan 协同作业规则立法·本卷口径通用化正身）＋T14 增补「Plan 协同作业对表」判据（随案增补·尺=v2.0.6）

## 一、固定部分（冻结对象）

### 1.1 工件清单

- 协议正身：`TriCompany/docs/engineering/fade-protocol-spec.md` v2.0.6（3945fd3→c5a392f）＋试卷模板 v1.1.0＋先例卷 `docs/execution/fade-007-assessment-paper.md`
- 机制资产：`doc-graph-scan.py`＋`docs/doc-graph.json`＋`--who-cites` CLI（基线读数=333 节点/679 边/77 external）
- 规则面：`TriMetaverse/docs/文档治理与真源文件系统.md` §3.4.1 标准文档头四层（层三变更记录红线/层四关联面 dependsOn+consumers+反向索引）
- 判据面：`TriCompany/docs/workflow/code-review-standards.md`（R1.1/R1.2/R1.3 案源即本机制事故族，D-65 锚）
- 治理定调：实例复用现役岗、**归口=CAO**（CEO 五决决 1，2026-11-02；专岗再议候运行观察）

### 1.2 检查项与权重（合计 100）

> 用法：评审者逐项过审，任一项 0 分即不过线；执行体开工前自对照。验证方法可复算优先（CLI/脚本断言），语义判定项声明判定载体。

| # | 检查项 | 权重 | 验证方法（可复算口径） | 判定载体 |
| --- | --- | --- | --- | --- |
| T1 | 触发可重放可归因（①触发段） | 6 | 触发记录含扫描时点＋变更文件集＋事件源三要素；同输入重放产出同差异集断言 | Score CLI |
| T2 | 登记四不变量（②登记段） | 6 | run 聚合键=扫描日期+变更文件集哈希：唯一（一键单 run）/去重（同事件重达不新建）/关联（键可聚合十段工件）/恢复锚（断点可定位）逐项断言；周平面登记行在案 | Score CLI |
| T3 | Qualify 机械门留痕（③） | 6 | qualify 记录含影响面清单（非空）＋原材料可读＋边界明/验收锚齐判定留痕；空影响面=skip 不产空 run | Score CLI |
| T4 | 三件 Plan 时点冻结＋收口对卷（④） | 10 | 原材料卷封＋语义作业方案卷封＋试卷三件在案；整卷双 hash raw+LF 留痕；DCE 期间 hash 零变更；收口实际用卷 hash=冻结卷 hash——**防自改考卷核心门** | Score CLI（_fadehash 口径） |
| T5 | DCE 确定性更新＋副作用守卫（⑤） | 10 | 裸跑（无写参数）断言零写面（dry-run 默认）；写入显式参数触发且 diff 可复现；CLI 无 LLM 混入；更新域=relatedRefs/反向索引/元信息头三域（spec §2.4+反模式五条） | Score CLI |
| T6 | 节点收口报告双门（多节点·§2.7） | 8 | 每节点 `reports/node-<ID>.md` 十字段齐＋内嵌 JSON 九键；`node-report-check` exit 0 双门（节点翻转前＋编排收口复跑） | Score CLI |
| T7 | Verify 独立后置校验（⑥） | 7 | 图谱校验器独立于执行体后置跑：引用存在性/格式/一致性，exit code 断言；校验器版本与 run 关联在案 | Score CLI |
| T8 | Score 双段合成＋evidence_ref（⑦⑧） | 7 | 评分 JSON=Score CLI 覆盖（omission/required_all_passed）＋Score Skill 逐项 score 合并；逐项 evidence_ref 可回指工件；schema 对照 §2.6 评分合同 | Score CLI |
| T9 | Close 顺序四态＋审计落账（⑨⑩） | 6 | Close Skill 先裁→Close CLI 后写终态（审计时序断言）；终态∈APPROVED/FROZEN/ESCALATED/RETRY 值域；不达线不写终态；审计含 before/after＋时戳；被裁决会话不自证终值（§2.5） | Score CLI＋Skill |
| T10 | 关联知会完备（专属风险①漏报） | 10 | 变更集×图谱 citedBy 反查清单与实际知会清单 diff 零漏；逐件知会留痕（发信记录在案——「已发」主张先查发信记录）；owner 席路由与治理定调对表 | Score CLI 对表＋Skill 抽验 |
| T11 | 反向索引真实性（专属风险②失真） | 8 | 图谱抽边（≥5 条含中文路径边）回源文件 grep 实锚命中；scan 复跑边计数与 run 基线一致，漂移须归因 | Score CLI |
| T12 | 图谱新鲜度三键对表（专属风险③过期） | 6 | run 内 doc-graph.json 三键对表：generatedAt ≥ 触发扫描时点、repoHead=run 时仓顶、来源标注在案（R4.2）；过期图谱反查即 FAIL | Score CLI |
| T13 | 跨仓 external 边完整（专属风险④断链） | 4 | 现役边界（域外只记不扫）下 external 边两端路径落盘可解析；域外引用零静默丢失（外引计数对表）；扩面升真节点后判据升级走随案增补程序 | Score CLI |
| T14 | 治理对齐三查（§1.3 维度收口） | 6 | 职责范围与最新治理定调一致/无模板误植/段-实现映射与实跑载体一致三查＋**Plan 协同作业对表**（v2.0.6 §2.8：主负责 agent 随映射表声明·任务书 COS 协铸+拆树 COO 协定协同留痕，缺一即不过）；违者与证据缺失同级扣减（fade-quality-lessons 口径） | Score Skill |

权重合计：6+6+6+10+10+8+7+7+6+10+8+6+4+6=100。

**十段覆盖对表**：前置说明书→T3/T10；①触发→T1；②登记→T2；③Qualify→T3；④Plan 三件冻结→T4；⑤DCE→T5/T6；⑥Verify→T7；⑦Score CLI＋⑧Score Skill→T8；⑨Close Skill＋⑩Close CLI→T9；专属风险四族→T10–T13；治理对齐→T14。

### 1.3 治理对齐项（Score Skill 必查维度）

- **职责范围**：实例产出与最新治理定调一致——归口 CAO、知会按文档 owner 席路由；触 CEO 保留权域（组织架构/授权矩阵/排窗）升级不代裁。**Plan 段协同作业口径（CEO 口审 2026-11-02）**：发起/负责/收口本 FADE 的 agent=CAO，但任务书与 COS 协同铸、拆树与 COO 协同定（接 FADE-008 现役分工正形：COS 备料铸条主负责·COO 总调度拆树复核）——用公司资源不单打独斗。
- **无模板误植**：评分证据不含他实例卷形/他域条款混入（防跨角色内容串写）。
- **绑定事实**：段-实现映射表（§五基稿）与实跑载体一致——防「评分查存在性、不查与治理事实对齐」。

### 1.4 及格线（双门槛·本卷自声明）

- **必选门槛**：T1–T14 **全部通过**（任一项 0 分即不过；不过→RETRY 补证据重跑或 ESCALATED 升级裁决，不得写终态）。
- **总分门槛**：**≥85/100**（本卷自声明值·CEO 五决决 4 授权）——沿用 FADE-007 档：与标准期实例同标准，新实例首卷从严不放宽。
- 阈值声明依据：协议 §2.6「及格线阈值由实例自声明（双门槛结构不可免）」＋出卷方法指引（v2.0.5）。

### 1.5 实时部分（Plan Skill 实例化·随 Plan 落盘）

- **彩排 run**（首 run 选型 a 若采）：构造变更集须含边界三探针——中文路径件/越界归一（`../` 前缀）件/同名兜底件（R1.1/R1.2/R1.3 案源族回打），否则风险项覆盖停留纸面；写入面隔离（副本仓或 dry-run＋真写小样本），跑毕以真实 re-scan 对冲图谱真身，防彩排残留污染现役。
- **真实变更 run**：T10 知会清单按实际变更集×图谱反查实例化；T4 三件卷封按当次变更内容封存；余项照固定部分执行。

## 二、证据注记（**非冻结文本**——时变读数只住本节，不入冻结判定）

- 基线读数（2026-11-02）：333 节点/679 边/77 external，图谱刷新至 975475cee（BOD 20:2x 实测；主仓未提交增量候收口批）。
- 现役红面三缺口在案（10-25→11-02）：图谱过期 8 天/巡检慢通道失跑/覆盖域单仓——T11/T12/T13 即对其设防；巡检执行体挂靠（daemon 化）属实例运维线，不随本卷冻结。

## 三、判定人与抽验义务

- 归口 owner=CAO（CEO 五决决 1·复用现役岗）；Plan 段执行体=域 owner agent（届时指派）。
- **自证风险声明**：出卷者与归口者同席（CAO）——结构性利益声明照 FADE-007 §三先例在案；对冲=T10/T11/T14 **首 3 个 run 双席抽验常设**（建议抽验席=BOD 或 COS，首 run 时点定席），Score/Close 段证据双席可随时调卷复核。
- 条款语义争议归出卷 owner（CAO）解读；效力争议归协议正身 owner 链（CPO/CTO/CEOCS 三方联审域）。

## 四、冻结程序（首 run 的 Plan 时点执行）

1. CEO 审题通过令达→首 run 触发（选型候 CEO 挑：a 人为构造彩排/BOD 建议，b 等真实变更——本席意见随毕报附）。
2. 本卷按当日实况定稿 §1.5 实时部分；如有修订逐条留痕（修订记录随卷）。
3. 定稿卷以 `_fadehash` 口径计算整卷双 hash（raw+LF canonical，行尾漂移按 SOFT-DRIFT 留痕不按污染裁决）。
4. 双 hash＋卷引用写入 run 登记段与 run root 引用集；DCE 期间卷不可变；收口对卷（实际用卷 hash=冻结卷 hash）。
5. 首跑通过后附逐段工件＋段-实现映射表入册 fade-registry（§九·实例号届时授予，本卷以场景名立卷，入册时登记册补号回链本件）。

## 五、段-实现映射表基稿（入册候实测修订·录自背景卷 §八）

| 段 | 载体 |
| --- | --- |
| 前置说明书 | 关联知会工单（目标=受影响文件更新·材料指针=变更 commit+doc-graph 边·验收期望=本卷） |
| ①触发 | doc-graph-scan.py 差异读数（文件修改扫描触发源；定时巡检链候 daemon 挂靠——§八 CEO 四点指示 3，任务书面候批不入本卷） |
| ②登记 | run 等价聚合键=扫描日期+变更文件集哈希；周平面登记行+TriMLC job 锚 |
| ③Qualify | 机械门：影响面非空+原材料可读+边界明/验收锚齐/无需 CEO 逐条拍板 |
| ④Plan | 域 owner agent=CAO（协同口径：任务书 COS 协铸+拆树 COO 协定·CEO 口审 2026-11-02）：树分解（每受影响文件=节点）+三件冻结（原材料卷封/语义作业方案卷封/试卷） |
| ⑤DCE | CLI 机械更新（relatedRefs/反向索引/元信息头）；agent 会话承载走载体降级合同（细则 4） |
| ⑥Verify | 图谱校验器（引用存在性/格式/一致性·exit code） |
| ⑦Score CLI | 本卷覆盖检查（omission） |
| ⑧Score Skill | 逐项评分+evidence_ref（含治理对齐/内容归属维度） |
| ⑨Close Skill | 四态终裁（引用评分证据·不得覆盖 CLI 证据） |
| ⑩Close CLI | 写终态+审计落账；不达线 RETRY/ESCALATED |

## 六、关联件

- 协议正身：`TriCompany/docs/engineering/fade-protocol-spec.md` v2.0.6（§2.6 设计思路段＋§2.8 Plan 协同作业规则=本卷准绳；§2.4 副作用守卫；§2.5 终态合同；§2.7 节点报告；§2.8 细则 10 接线+实测）
- 模板与先例：`TriCompany/docs/engineering/fade-assessment-paper-template.md` v1.1.0；`docs/execution/fade-007-assessment-paper.md`（E-3 卷形基准）
- 机制判据：`TriCompany/docs/workflow/code-review-standards.md` R1.1/R1.2/R1.3（案源=doc-graph-scan 事故族，2026-10-25）
- 背景卷：`docs/workflow/operating-records/2026-W45/trees/file-family-maintenance/draft-ceo-bod-session-20261102.md` §八/§九

—— CAO 小行 出卷（2026-11-02·候 CEO 审题）
