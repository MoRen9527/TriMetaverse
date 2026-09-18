# 认知层落点归一 · CPO 产品域意见（命题 1/3/5）

- sourceOfTruth: 本件（CPO 产品域主笔；与 CTO 技术域合流为一件方案）
- syncMode: static
- lastSyncedAt: 2026-09-19T01:00+0800
- 任务书: task-charter-20260919-cognition-knowledge-landing.md；边界遵行（不推翻 p2/方案件非执行件/单一真源红线）
- 复核声明: BOD 事实包五点独立复核完毕，四点证实、两点精度勘误（§〇.2）

---

## 〇、复核读数（独立实勘）

### 〇.1 证实四点
1. COO `memory.agent.md` 原文实锚：「知识工作区：runtime cognition 私域（TRICOMPANY_COGNITION_HOME）」——声明断裂属实（13 席同构候 CTO 全量核）。
2. 死残留：`TriCompany/.tricompany-cognition/org/{shared,audit}.md` 末写 2026-07-14 21:20——停摆两月属实。
3. knowledge 活体：`TriCompany-copilot-host-assets/knowledge/employees/` 四区骨架（COO 例：inbox/wiki/workbench/audit+README）属实。
4. 活脚本 `TriCompany/runtime/cognition/source_publish_check_validation.py` 在位（勿误伤线确认）。

### 〇.2 精度勘误两笔（CTO 对表）
1. knowledge/employees/ 实测 **11 目录**（非 15）——差 2 席骨架缺失与否候 CTO 清点（影响批量追平范围）。
2. `TriCompany-copilot-host-assets/employees/`（DE 孤例派送）**实测不存在/已空**——死层清单该项或已自清或路径误引，处置定案前 CTO 复核。

## 一、命题 1：落点归一——**推荐 B 案（契约追平）+ 双腿登记**

### 先立概念分界（判案的根）
认知层实际是**两种生命周期的东西**，四层能力模型本就分立：
- **运行腿**（.tricompany-cognition）：机器写入的运行态——session-end consolidate、namespace 过滤的 provider 写入、运行审计元数据。append-only、env 驱动、无人工评审。
- **学习腿**（knowledge/employees/）：人工/agent 策展的学习资产——inbox 资料、page-specs 规则、评审 SLA 的 wiki 页、promotion 门槛。版本化、受治理、p2 管道的落地骨架（四区已建）。

### 两案并评
| 维度 | A=knowledge 迁入 cognition home | B=契约追平 knowledge |
| --- | --- | --- |
| 数据迁移 | 跨区搬活体（15→11 目录+33 条审计+COS 4 页），触碰 p2 路径假设 | **零迁移**，声明追平现实 |
| 生命周期 | 运行态与学习资产同根——**重新耦合四层模型刻意分立的两层** | 两腿各归本位，生命周期不混 |
| p2 兼容 | 破坏管道路径假设（违背命题 5 边界风险） | 全兼容（§三） |
| 死名包袱 | .tricompany-cognition 名下有两代死残留，迁入=继承死名历史 | 死层另行处置（命题 4），与新声明解耦 |
| CEO 提示响应 | 「可以放」=许可非指令 | 以「不合适」的论证回应提示：运行态邻居可以，资产整体并入不建议 |
| 回滚锚 | 数据搬移回滚=双向搬 | 声明改写回滚=git revert |

**推荐：B 案**。理由浓缩：断裂的本质是**声明滞后于现实**，不是现实放错了地方——knowledge/ 正是 p2 设计的管道落点（四区骨架即为其而建），契约追平=让 Layer 3 声明说真话；A 案用一次高风险迁移去迁就一句滞后声明，方向反了。

### B 案落点声明（契约追平后的标准表述，13 席批量素材）
> 认知层=双腿：**学习腿**=`TriCompany-copilot-host-assets/knowledge/employees/<席>/`（inbox/wiki/workbench/audit 四区，hermes-gov-p2 员工层管道落点）；**运行腿**=`TRICOMPANY_COGNITION_HOME`（.tricompany-cognition：employee 私域运行态/org 运行共享记忆/org 运行审计——机器写入，runtime cognition backend 驱动）。memory/colleagues/social 契约的「运行资产落点」按此两腿改写；soul 覆盖层语义不动（命题 2 素材，CTO 主笔批量方案）。

### 附带发现（本席核勘新增，供命题 1/3 合流）
**org/shared 同构双腿**：学习面升格目的地=knowledge/org/（组织知识库，策展）；运行面共享记忆=.tricompany-cognition/org/shared（机器写入，现死待运行腿复活）。两处同名异物——若不正名，B 案落定后这里是**下一个断裂点**。正名建议见命题 3 对照表。

## 二、命题 3：命名区分规范（三概念+对照表）

**命名法**：三概念三词、路径随概念、禁同名异实；概念名进文档与契约，物理路径为实现细节（今后搬路径不再破契约）。

| 概念 | 正名 | 物理落点 | 旧名/撞名 | 迁移动作 |
| --- | --- | --- | --- | --- |
| 学习资料入口（p2 管道①） | **学习入口**（learning inbox） | knowledge/employees/<席>/inbox/ | 裸称「inbox」易与通信撞 | 文档/契约统一加「学习」限定词；路径不动 |
| 跨面通信信箱（LG-036） | **通信信箱**（notify mailbox） | TriMLC 8713 信箱（通道自有） | 「信箱」裸称 | 8713 信箱**沿用不更名**（LG-036 现役通道，正名记录于文档层即可） |
| 一次性派送落点（DE 孤例） | **派送落点**（drop point，概念备用） | 实测不存在（§〇.2.2） | 顶层 employees/ 撞 knowledge/employees/ | 死层归档（命题 4）；概念名留档不落路径；若未来真需要派送件，落点避开 knowledge/（物流≠学习） |

**员工通信通道取舍**：**沿用 LG-036 独立，不并入 p2**。理由：通信=运行时消息（时效状态机、信箱、TTL 升级），学习=资产管道（消化、页、promotion）——机制与生命周期全异，并入=制造概念融合；共享的只有命名法（本表）。

**org/shared 双腿正名**（§一附带发现落表）：**组织知识库**（org knowledge，学习腿 knowledge/org/，promotion 目的地）≠**运行共享记忆**（org runtime shared，运行腿 .tricompany-cognition/org/shared，机器写入）。p2 去域化检验的升格目的地=组织知识库。

## 三、命题 5：与 hermes-gov-p2 兼容声明（逐条）

| p2 定稿项 | B 案关系 | 声明 |
| --- | --- | --- |
| 管道四段（①inbox 接入…④wiki 对接） | 落点定案不改管道行为 | **兼容零翻案**——knowledge/ 本就是设计落点 |
| 两轨分层（公司层/员工层 1× 注入） | 零影响 | 兼容 |
| org/shared 重定义+三层分发 | 需一处显式标注 | promotion 目的地=**组织知识库**（学习腿）；运行腿 org/shared 为机器写入非升格对象——p2 文字若泛指 org/shared，转正身时按此精确化（**修订点 1，候 CEO**） |
| 验收锚①org/shared 分层 | 双腿正名强化之 | 兼容 |
| ②reject 日志/③escalate 汇审计 | 消化段行为不变 | 兼容；**审计双腿分立声明**：学习审计（knowledge/<席>/audit/，操作证据链）≠运行审计（.tricompany-cognition/org/audit，运行元数据）——p2「汇审计」指学习审计（**修订点 2 精确化，候 CEO**） |
| ④promotion 人工门+去域化检验 | 目的地正名后照旧 | 兼容（跨腿语义显式化见上） |
| ⑤消化不在热路径/⑥体积预算门 | 零影响 | 兼容 |
| 边界「knowledge 不是员工通信 inbox」（CEO 原话） | 命名法直接承接 | 兼容——三概念对照表即其制度化 |

## 四、留予 CTO 主笔的接口

命题 1 工程路径（契约批量改写走源侧→发布管线，先收割再切断）／命题 2 的 13 席批量执行与 11 vs 15 清点／命题 4 死层处置技术定案（两代死残留+30 脚本+活脚本隔离）／TRICOMPANY_COGNITION_HOME env 现值与 backend 现状核。本件产品语义半部就此合流就绪，时点随 CTO。
