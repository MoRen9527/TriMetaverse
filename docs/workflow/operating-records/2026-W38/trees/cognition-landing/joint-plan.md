# 认知层落点归一·联审合流方案（CPO×CTO）

- sourceOfTruth: 本件（两域意见合流正身；**CEO 已终批 2026-09-19 02:46**）
- syncMode: approved（终批后执行态；执行令=周平面 task-charter-20260919-cognition-landing-exec.md）
- lastSyncedAt: 2026-09-19T02:4x+0800
- **CEO 终批批注（2026-09-19 02:46，三项全批）**：①第三棵树=**归档**（候决二选一定为归档，§四#4）；②副本卫生总注记升格 governance 明文=批（§六）；③p2 两处表述精确化=批（§五 promotion 目的地=组织知识库/汇审计=学习审计）。方案主体连同批注意见一并生效。
- 拼稿: CTO（小狄）；终审签认: CPO（小乔，随到随审）
- 输入件: 任务书 20260919-cognition-knowledge-landing + CPO 件 `trees/cognition-landing/cpo-view.md`（fa5f7a71，§〇.2 勘正后版）+ CTO 件 `cognition-landing-cto-opinion.md`（v2.1，3efef456+）+ BOD 数字定谳（01:0x）
- 双签区: CTO 小狄（拼稿毕，01:05）/ **CPO 小乔 签认（终审通过，2026-09-19 01:10+0800 date 现查）**——终审读数：三保真达成（§〇.2 勘正版/命题5 候 CEO 标注原样/命名对照表合并版）；四裁定全融入；BOD 数字修正采纳；DE runbook 目录归档+内容收编分层=对 CPO 裁定的合理精化采认；§四.1 归档域选择（源侧残留归 docs/workflow/archive/ 史料属性）核为可接受。零阻塞。

---

## 〇、联审复核汇总（三源交叉后的共同事实基线）

1. **断裂实锚**：13 席 memory/colleagues/social 契约声明落点=`TRICOMPANY_COGNITION_HOME`，活体学习资产在 `knowledge/employees/`——双轨断裂属实（两席独立实勘一致）。
2. **真源/副本双位定谳（BOD 数字修正版）**：真源位 `TriCompany/runtime/cognition/`=**活体**（77 项 7 子目录，__pycache__ 09-19 00:41 更新=有活进程消费）；宿主副本位=85 文件停 08-10 滞后漂移（合法副本位，管线未跑新）。任务书「30 py 停 06-11」作废。
3. **kernel 资产**：源侧 kernel 九件完整（05-24，含 wiki 四件）——运行腿代码底座在库，复活即用。
4. **第三棵树**：`D:\Code\ai\TriCompany-copilot-host-assets` 非 git 裸目录老快照（employees=11 漂移 4 项）——拷贝散落→真源漂移活标本（CTO 席 v1 实勘误入此树的教训随件留痕）。
5. **勘误留痕**：CPO 两笔精度勘误经 BOD 复核定谳（15=13+2 脏目录；DE runbook 权威位实存）——本方案以定谳版为准。

## 一、命题 1：落点归一=**B 案（契约追平）+双腿登记**

**裁**：契约追平现实，不动活体。A 案（knowledge 迁入 .tricompany-cognition）否决——断裂本质是**声明滞后于现实**而非现实放错地方（CPO 判语采认）；A 案高风险迁移翻 p2 路径基线，违边界。

**双腿登记（两席齐裁，四条技术硬依据）**：
- **运行腿**：`TRICOMPANY_COGNITION_HOME`（.tricompany-cognition：employee 私域/org 运行共享记忆/org 运行审计）——机器写入、append-only、env 驱动、无人工评审。
- **学习腿**：`TriCompany-copilot-host-assets/knowledge/employees/<席>/` 四区——人工/agent 策展、版本化、p2 管道落点骨架。
- 硬依据：①生命周期/保留策略本质不同（机器高频写 vs 策展资产；混树则 git 卫生互污）；②LG-036 letter-store 既有先例（运行态独立于策展面）；③kernel 读 env 零改动、复活即用；④**真源位活体消费实证**（BOD 01:0x：__pycache__ 今夜仍更新——运行态有真实消费方，非可合并的死面）。
- **单一真源红线自查**：两腿=两类数据各归其位（运行产出 vs 策展资产），非同数据双真源——红线不破。

**A 案对 CEO 条件句的回答**（「knowledge 放入 .tricompany-cognition 合适的话可以放」）：「可以放」=许可非指令；实勘论证=不合适（迁移成本/翻 p2 边界/双腿已实现语义归一）。

### 运行腿小节：kernel 收编计划（候运行需求触发，非本批执行）

运行腿现死（kernel 停 07-14）但代码底座完整——**复活=kernel 收编计划**：p2 消化管道 wiki 对接段实现时优先评估收编源侧 kernel 九件（含 wiki_page_registry 族，勿重复造轮）；里程碑=候运行需求触发。真源位活体进程（__pycache__ 消费）与 kernel 复活的关系随执行件甄别登记。

### B 案落点声明标准表述（13 席批量素材，两席合订版）

> 认知层=双腿：**学习腿**=`TriCompany-copilot-host-assets/knowledge/employees/<席>/`（inbox/wiki/workbench/audit 四区，hermes-gov-p2 员工层管道落点；org 层=knowledge/org/ 组织知识库）；**运行腿**=`TRICOMPANY_COGNITION_HOME`（.tricompany-cognition：employee 私域运行态/org 运行共享记忆/org 运行审计——机器写入，runtime cognition backend 驱动，复活时初始化）。memory/colleagues/social 契约的「运行资产落点」按此两腿改写；soul 覆盖层语义不动。

## 二、命题 2：五件套声明批量修订（CTO 主笔，单批双段段一）

- **改写模板**：上节引用块即批量素材（13 席同构≈40 文件）。
- **节奏（CPO 裁定）**：**单批双段**——一个批次窗内：段一=声明追平（13 契约+validator 联动+渲染窗），段二=死层处置（§四）；单批一次过门验收（防两窗间半态被误读为定案），段间回滚锚各自独立（源侧单 commit revert+渲染产物在版本库）。
- **validator 联动（硬前置）**：employee_source_kit :553/576 标记族同步改（双声明锚=新 required 集；旧单标记过渡兼容或同窗切——同窗优先，单批纪律下不留 warn 窗）。
- **管线纪律**：全部走源侧 commit→发布管线重渲，禁手工拷贝位。

## 三、命题 3：命名区分规范（CPO 裁定全文）

**命名法**：三概念三词、路径随概念、禁同名异实；概念名进文档与契约，物理路径为实现细节。

| 概念 | 正名 | 物理落点 | 迁移动作 |
| --- | --- | --- | --- |
| 学习资料入口（p2 管道①） | **学习入口**（learning inbox） | knowledge/employees/<席>/inbox/ | 文档/契约统一加「学习」限定词；路径不动 |
| 跨面通信信箱（LG-036） | **通信信件**（notify letter） | TriMLC 8713 通道自有 | 沿用不更名；正名记录于文档层 |
| 一次性派送落点（DE 孤例） | **派送件**（dispatch drop，概念备用） | **无常设路径** | 死层归档（命题 4）；未来真启用落点命名 dispatch/ 且避开 knowledge/（物流≠学习） |

**纪律两条**：三键不得互称；文档与 UI 首用必须带限定词（裸「inbox/信箱/件」=禁用，E2 四载体教训前置防）。

**org/shared 双腿正名**（CPO 附带发现采认）：**组织知识库**（学习腿 knowledge/org/，promotion 目的地）≠**运行共享记忆**（运行腿 .tricompany-cognition/org/shared，机器写入）——两处同名异物，不正名即下一个断裂点。

**员工通信通道取舍**：沿用 LG-036 独立，**不并入 p2**（通信=运行时消息，学习=资产管道，机制与生命周期全异）。

## 四、命题 4：死层处置（七项定案，单批双段段二）

| # | 对象 | 定案 | 执行要点 |
| --- | --- | --- | --- |
| 1 | `TriCompany/.tricompany-cognition/`（07-14 停，3 文件） | 归档 | `docs/workflow/archive/`（文档域；CPO 路径语）+README 头注（停跑时点/乱码如实「保史不保读」） |
| 2 | 权威位 `.tricompany-cognition/`（04-20 停，3 文件） | 归档 | `TriCompany-copilot-host-assets/_archive/2026-04-cognition-run/`（宿主资产域 _archive 新 namespace+CPO 批次 README 制）；**腿位声明保留**（kernel 复活初始化新目录），归档的是死数据非腿位 |
| 3 | 权威位 `runtime/cognition/`（85 文件停 08-10） | **甄别+副本追平（双动作非归档）** | 真源活体不动；宿主副本走**发布管线重发布追平**（禁手工同步）；副本内无源对应物项→死层候选归档（判据 governance:107） |
| 4 | 第三棵树 `D:\Code\ai\TriCompany-copilot-host-assets` | **候 CEO 二选一：归档或删除** | 删前抽查两差异目录（employees/runtime/vendor）确认零独有内容；与 sg 部署副本口径对齐（部署副本≠权威位） |
| 5 | 脏目录 `randd-trainer/` | 更名或归档 | 内容=rd-trainer 旧名期资产→更名归位；空壳/重复→归档（执行时二查一定） |
| 6 | 脏目录 `project-trainer/` | 归档 | 名册无此席；验证件活于 TriCompany/runtime 不涉 |
| 7 | DE runbook（权威位 `employees/deployment-engineer/inbox/windows-seat-remote-control-runbook.md` 实存） | **收编** | runbook 迁 knowledge/employees/deployment-engineer/inbox/（学习入口语义恰位）；顶层 `employees/` 派送目录清空后删除（目录=死层归档，内容=收编——分层处理）；DE 操作注记改指 |

**复活纪律（CPO 裁定）**：任何现役 spec 引用归档件=须先走评审解除归档，防「引用复活」绕过处置。

**红线自查**：TriCompany/runtime/cognition 活验证件族不在处置域 ✓；归档区=史料非真源，无第三真源 ✓。

## 五、命题 5：与 hermes-gov-p2 衔接声明

| p2 定稿项 | 关系 |
| --- | --- |
| 消化管道四段 | 兼容零修订（学习腿路径不动） |
| 两轨分层 | 兼容；双腿使分层更精确（运行/学习/公司三层各归位） |
| 六验收锚 | 不受影响（锚行为非路径）；**promotion 目的地=组织知识库**、汇审计=学习审计（两处表述候 CEO 精确化，CPO 件原样保留） |
| kernel 收编 | 入命题 1 运行腿小节（候触发非本批） |

## 六、副本卫生总注记（常设条，候批升格 governance 明文）

今后任何宿主资产复制**须走发布管线留痕**（发布 commit+manifest 登记），**禁手工拷贝散落**——本联审第三棵树+两代死残留同族根因；与 governance 件 :107-108 精神一致。

## 七、验收锚对照（任务书五命题全覆盖 ✓）

任务书 §三命题 1-5 ↔ 本件 §一/§二/§三/§四/§五 逐条对位；命名对照表=CPO 件 §二表+本件 §三裁定合并版（保真要求③达成）。

## 八、双签与流程位

- CTO 拼稿毕（本件）；CPO 终审签认后双签齐→报 BOD→候 CEO 终批（CEO 在眠，呈批时点候醒）。
- 批后执行：单批双段一个批次窗（FSD 主执行+CTO 监督验收），三仓联动（TriCompany 源侧/TriMetaverse 权威位/host-assets 副本追平）。
