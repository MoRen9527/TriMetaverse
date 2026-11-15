# CTO 技术裁决卷·FADE-001 plan 段 agent 化（CEO 修正令 14:21:28·台账 620 笔）

- sourceOfTruth: 本卷（fade001-tenstage-deploy-20261115 树·plan agent 化技术裁决正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: CEO 14:21:28 修正令（BOD 流转·COS 派工 14:23:23·台账 620 笔）——plan 段引入 agent 判断面取代死脚本硬编码搬移清单
- 席位: CTO 小狄（m-cto·技术主审席·架构裁决域）

## §〇 · 事实实锚（裁决依据面）

- **预演暴露**：W47 trees=**0** vs W46 trees=**35**（本席现勘 14:25）——「搬不全」实盘铁证：W46 在途活树（如 fade001-tenstage-deploy-20261115 本身）被机械判据判 keep·零迁移。
- **机理实锚**（plan_scope.py docstring 自载·416 行现勘）：机械三分类 degrade 链=tree-op.json status→authorization.json expiry→**默认 keep**——「漏迁毒于误封存」注释在卷但 degrade 终态恰是漏迁方向；判据要点 1「OP index 与实盘脱节是现势常态」=证据链不可靠性自认。
- **根因定性**：CPO 件 C 语义锚「这是一周的记录，还是这一周的活」=**判断性语言**·现役实现=零判断力的机械近似（证据链走得通否≠树实际是活是记录）——死脚本硬编码对该问题**结构性无能**·非参数可修。

## §一 · 裁决①：agent 化设计（快慢道分诊+脚本守门·契约零变）

**裁决：APPROVE 方向——agent 判断面嵌入 plan skill·脚本降级为执行体+结构守门·plan.json 契约零变。**

- **快慢道分诊形**（成本与确定性兼得）：
  - **快道=现役机械判据保留**：证据链完整（tree-op status/expiry 齐备且无冲突）的树照走现役三分类——零 agent 消耗·确定性面。
  - **慢道=agent 判断面**：degrade 链走到「默认 keep」的树+证据冲突树→**转 agent 语义判断**（输入=树名+证据面读数+树内容摘要；输出=结构化 {family: migrate|keep|carry_over, confidence, reasons}）——agent 只接歧义态·不全量接管。
- **脚本面保留·守门形**：agent 输出→结构校验（family 值域/reasons 必填）→**双向断言 M∪K=S 照走**（替身禁令照旧）→脚本写卷 plan.json——**agent 判断只改分类读数·不写卷·不碰契约**（与 score 引擎同构：判断面+守门面两分）。
- **护栏三件**（非确定性面守门）：
  1. **置信度门槛**：confidence<阈值→保守 keep+reasons 标「agent 低置信」——漏迁毒于误封存原则下保守方向=可辩护方向（误封存可候审补救·误迁移不可逆）。
  2. **审计面**：agent 判定 reasons 全量载 plan.json（逐树判定依据可判读）——值守/复核面读 plan.json 即审 agent 判断质量。
  3. **契约冻结**：plan_version 升 1.1.0（agent_readings 字段增补·既有字段零动）——下游 verify/dce/score/close 消费面零波及。
- **agent 调用点形态**：plan_scope.py 内嵌调用 daemon 侧 agent loop（TriRMC 8710 agent loop 能力族）或 payload 序列化调用——**施工形态二选一归 FSD 实勘后定**（技术细节面·设计约束=调用失败→该树降级保守 keep+reasons 标「agent 调用失败」=fail-closed 不炸段）。

## §二 · 裁决②：改链波及面+测试门禁

- **受影响**：段 3 本体（plan_scope.py 判断面+分诊面）+test_plan_scope（agent 面 mock 案）+payload 调用形（若嵌序列）+R-HY 检出同步+判读表补行（段 3 agent_readings 读数形）。
- **零波及面**：段 1/2（preflight/qualify）·段 4/5/6/8/10 契约面（plan.json 既有字段冻结=verify 断言 C/D·dce migrate cmd 消费·score G 族 plan 判据·close 扫描全不变）。
- **测试门禁**：test_plan_scope 增案族（快道回归钉案=既有案零改全绿/慢道 agent mock 案=结构门拒收形+置信度门槛形+调用失败 fail-closed 形/双向断言协作案=M∪K=S 含 agent 判定树）+门禁 184+新增案**全绿门**——STE 独立复验+本席验收确认链（同 γ 序形）。

## §三 · 裁决③：候裁点 a 技术可行性读数（首拍锚关系·归 CEO 裁）

**技术面两选项如实呈读·首拍锚裁定权=CEO·本席不预断：**

- **选项 1=首拍前改后链上拍**：设计 0.5h+施工 3-4h+验收 1-1.5h+R-HY 同步+**新链预演拍（硬前置）**≈7-9h——14:30 起→21:30-23:30 贴 23:50 顶格**零余量**。**风险铁面：新链零预演上首拍=不可接受**（agent 面=首跑·翻车即首拍 failed+周一平面缺表=目的全损）——坚持此序必须含新链预演拍（SDE 手动触发·runCount 多一次）+任一环卡壳即锚破回退。
- **选项 2=首拍照旧现链·修正随后（本席技术面倾向）**：今晚 23:50 首拍=现役链首演（链面价值=十段端到端+score 实弹首读数·达成）；plan 清单缺陷=**已知预期态**——值守判读表补一行「段 3 清单完备性=人工复核面」（值席 dive 后对 W47 需求面·漏迁树列补迁清单走 carry_over/人工补·零拦截面=verify 只对已列清单不拦漏列·如实知情）；agent 化走周内窗（周一设计→周二施工→周三验收）→**W47 末 23:50 周拍=新链真值首演**（每周期现役机制·新链自然烤毕上拍）。
- **两选项定性判据**（供 CEO 裁面）：首拍目的=**链面验证**→选项 2（现链拍零风险·新链周内上·节奏合小步验证）；首拍=**必须真迁移**（W47 周一开工即用清单）→选项 1（含新链预演硬前置·贴顶排程·卡壳即回退预案先行）。

## §四 · 护栏遵行

候裁点 a 定谳前零改链动作遵行（本卷=纯裁决面零施工）·首拍锚 23:50 现行不动·停工窗内 CEO 直令=有效派工依据即启合规。

## 使用依据

- CEO 修正令 14:21:28（COS 派工 14:23:23·台账 620 笔·sg 顶 3b80bc8e0）
- plan_scope.py 全文现勘（416 行·docstring 判据要点/degrade 链/双向断言/替身禁令）
- W46 trees=35 vs W47 trees=0 现勘（14:25·缺表铁证）
- 预演 readiness 线（本席裁决 bac1fc3f·首拍 APPROVE 态·dive 最终门）
- score 引擎同构先例（判断面+守门面两分·2905840 装批）

——CTO 小狄（m-cto）·写前现查 2026-11-15T06:25:13Z（+8=14:25:13·date 现查原值·D-47 正形）
