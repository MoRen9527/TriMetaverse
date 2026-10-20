# 全员岗位职责审核报告（audit-report-20261013）

- **任务源**：CEO 直令 2026-10-12 23:06+08（信箱 duty-audit-cho-1791789421）；CHO 主导，CAO/COS 协同组队
- **审核对象**：`TriCompany/source-agents/` 13 席真源位（现役渲染链源=各席 `agent-body.agent.md`，含内嵌 frontmatter；13 席 `<id>.agent.md` 已退役出渲染链，真源头自载「D1b manifest 已切源」）；抽验两发布拷贝位 `TriMetaverse/.claude/agents/` 与 `.github/agents/`
- **必读真源**（六件已通读）：tmv-whitepaper.md（1492 行，§3.3/§3.3.1/§6.4 精读）、三元宇宙架构与模块说明.md（V0.5 全读）、tricompany.md（V1.2 全读）、github-repo-governance.md（全读）、engineering-disciplines.md（D-13 名址/D-15/D-23 对表抽读，CAO 主审）、hub-ledger-governance.md（全读）
- **审核四维度**：①职责描述与真源对表；②席间职责重叠与缺口；③与纪律册/治理制度冲突面；④发布拷贝漂移
- **边界**：只审不改——source-agents 本体与发布拷贝零触碰，修订候 CEO 复核后另下令
- **审核时刻**：2026-10-12T15:34Z 起；报告落树 2026-W42/trees/duty-audit-agent-roles-20261012/

---

## 一、总判

13 席岗位职责骨架健康：C-suite 8 席与执行层 5 席的归属路由阀门、公司管理层路由（2026-10-02 CEO 审查件④世代）、决策三分法、行为护栏四件套齐备，CHO/CAO/COS/COO 四方互载边界（员工生命周期 CHO 验收/CAO 制度化；编排组织 COO/路由催办 COS ⑦ 改排）与 tricompany.md §4/§8 中央摘要一致。**未发现职责错置级（P0 语义冲突）缺陷**。发布面 15/22 席归一化零实质漂移、零漏发布（COS 主审）。

主要问题集中在四个面：**A. 模板代际不同步**（2026-09-23 social 升维与 2026-10-02 CEO 审查两波改版在 13 席落地度不一，留下层契约对外连续性归置 1 vs 10 矛盾、「与与」语病族 9 席、护栏旧叙事 3 席、description 双格式并存）；**B. 名址体系多层错位**（D-13 主表行 vs 勘误映射行 vs agent 现役 name 三层不一致+BS 行缺失）；**C. 路由语代际残留**（7 席「升级到 CEOChiefOfStaff」与 D-39 裁决分级脱节——CAO 主审）；**D. 发布位双形重复族**（registry 双拼 4 件，余为零实质漂移/宿主方言设计内——COS 主审）。以上均为可批量追平面，无触及组织架构变更的升级项；修订建议 22 项（P1×7/P2×15）汇总见 §六。

---

## 二、维度 1：职责描述与真源对表

### 2.1 逐席对表锚（13 席 vs tricompany.md §4 岗位表 + 白皮书/架构真源）

| 席 | tricompany.md §4 主责 | agent-body 现役职责面 | 对表判 |
|---|---|---|---|
| COS 小贾 | 公司级路由协调催办升级；编排组织归 COO、CGR 登记收口（⑦ 改排） | §身份契约/§核心职责已载「记录和转发（执行投递常驻中枢）」+「调度与收口督办职责现行均归 COO」（2026-10-02/10-03 勘正注在卷） | ✓ 对表一致 |
| CPO 小乔 | 产品定义、PRD、MVP 边界、Product Registry | §核心职责 17 条含产品度量/信号雷达/货币化/BOD 三钉，ProductRegistry owner 明载 | ✓ |
| CTO 小狄 | 技术路线、交付架构、Code Registry、工程门禁 | 双层一体（技术战略+交付纪律）、CodeRegistry owner、D-15 分派枢纽 | ✓ |
| CHO 小源 | 岗位生命周期、交接治理、完成度监督 | 五件套链路验收+绩效体系定义权+组织文化（2026-10-02 增） | ✓ |
| CAO 小行 | 秘书处、会议制度、行政与治理资料归属 | CompanyGovernanceRegistry 经营 owner+制度唯一入册通道 | ✓ |
| CMO 小敏 | 市场信号、竞品、需求研究、PRD 前置证据 | 情报三段式交接 CPO、品牌资产（2026-10-02 增条 1） | ✓ |
| COO 小营 | 经营节奏、rollout、跨部门执行和复盘 | ⑦ 改排收口督办承接+权界三分（不握分派/升级/销账权） | ✓ |
| CFO 小财 | 预算、成本护栏、单位经济与财务风险 | FADE 全覆盖护栏+2 亿/1 亿升级阈值 | ✓ |
| FSD 小全 | 开发执行→CTO | 编码-测试流水线、架构边界内自主、CodeGraph 默认 | ✓ |
| STE 小柯 | 测试→CTO | 门禁独立、CTO acting、条件放行三分法 | ✓ |
| SDE 小布 | 部署→CTO | FADE DCE 段执行、发布 readiness 裁决归 CTO | ✓ |
| RDT 小吴 | 培训→CTO | 技术培训边界（非销售/运维等专项）+标准教学协议 | ✓ |
| CSO 小成 | 客户成功→COO | 反馈闭环路由（产品→CPO/技术→CTO/市场→CMO） | ✓ |

**对表总体结论**：13/13 席核心职责面与中央摘要 §4.1/§4.2 对表一致；汇报关系 13/13 一致（执行层 FSD/STE/SDE/RDT→CTO、CSO→COO 全司唯一特例在两源同载）。

### 2.2 维度 1 发现（滞后与失同步面）

- **F1-1【P1】tricompany.md §4.2 执行层岗位名滞后**：中央摘要（V1.2，2026-09-14）仍写「TestEngineer（小柯）/DeploymentEngineer（小布）」，而源侧现役 agent name=STE（senior-test-engineer）/SeniorDeploymentEngineer（senior-deployment-engineer，代号 SDE）；D-13 条 4 勘误（2026-09-03）与 B4 批8「小布定谳」均在摘要 V1.2 之前。中央摘要为溯源入口，岗位名滞后将误导新读者。建议：COS 下次中央追平窗按 D-13 现行口径追平 §4.2 岗位列（历史版本记录不动）。
- **F1-2【P1】description 面与正文职责面失同步（COS 席最著）**：COS agent-body frontmatter description 仍载「负责董事会令签发后的流转与执行监督、催办…配合COO将董事会令形成任务书」，未反映 2026-10-02/10-03 勘正链的「记录和转发（执行投递）」「调度收口督办归 COO」新义；正文已勘而 description 未动。同型：COO description 未含 2026-10-02 B2「公司级战略层次」半句。description 是宿主 spawn 面第一入口（description 即岗卡），失同步直接误导分派。建议：description 随正文勘正链同步为收口纪律（并入五件套增量更新 checklist）。
- **F1-3【P2】description 双格式并存**：CHO/CAO（agent-body 内嵌）用新式「XX 负责人。负责…」；其余 11 席保持旧式「适用场景：…」。两格式语义均通，但 spawn 面呈现不一。建议：候 CEO 裁定统一格式模板（属格式规范，非语义问题）。
- **F1-4【P2】SDE/CSO binding 表述旧世代**：两席 §认知分层约束仍硬编码具体 binding profile 路径（`.../binding-profiles/senior-deployment-engineer.json`），其余 11 席已泛化为「宿主绑定层（binding profile，单点双宿主）承载」。与 2026-10-02 八件套世代表述不同步。
- **F1-5【P2】CFO 阈值语义待核**：CFO 件「累计 >2 亿 / 单次 >1 亿 升级 CEO 的阈值机制在案」——「在案」未附纪律册条目号或台账号锚（对表 D 系未命中同款数值），建议 CFO 自证锚点或标注台账出处，防阈值成为无源之数。（待确认项，非断言错误。）

---

## 三、维度 2：席间职责重叠与缺口

### 3.1 重叠面判定（五组高频接壤处均有边界锚，判健康）

1. **COS↔COO**：⑦ 改排三分——COS 保留汇总呈报半环+分派/升级/销账三权；COO 承接收口督办与节奏（排程建议单对执行席与 COS 均无强制力）。两件互载且与 central-registry-closeout-workflow V0.2 对表一致。
2. **CHO↔CAO**：员工生命周期双轨——CHO=验收执行/completion tracking，CAO=流程制度化/治理资料归属；两席 agent-body 互载对方边界（CHO 件「CAO 另行负责行政管理…」、CAO 件「不接管 CHO 的人力资源、岗位启用和职责交接治理」）。✓ 互认闭环。
3. **CPO↔CTO**：双向审核闭环（需求收敛与技术可行性互锁、范围与优先级互裁）两件同款互载；选型涉产品语义 CPO 会签前置（CTO 件 :19）✓。
4. **CMO↔CSO↔CPO 信号链**：CPO 件 :376 定义双汇聚口（CMO 外部市场面+CSO 客户反馈面）+「CSO 只汇聚不裁决」；CSO 件反馈路由与 CMO 不越界条款对表一致 ✓。
5. **STE↔FSD↔SDE 交付流水线**：编码→测试→部署三段各有门禁归属（FSD 自测门禁/STE 门禁独立/SDE 回滚前置），CTO 裁决位统一 ✓。

### 3.2 缺口与不对称面

- **F2-1【P1】SDE 件缺 TriAuto 模块接口指针（与 STE 不对称）**：架构表 §4 载 TriAuto=IPD DEPLOYMENT 阶段部署执行模块（CLI contract 被 TriDev 调用）；STE 件有 TriTest 兼容指针（「需要历史兼容资料时补查 TriTest」），SDE 件全程无 TriAuto/TriDeployment 字样，部署脚本落点只写「各项目 scripts/」。岗位与模块的接口未声明，部署域事实入口悬空。建议：SDE 件 §项目真源补 TriAuto registry 兼容指针（对表 STE 同构）。
- **F2-2【P2】CSO「当前原则」空心化**：CSO 件当前原则仅 2 条机械条（date 现查+语气条），无实质业务原则；对照 FSD（4 条实质：自测即门禁/技术债如实等）。CSO 反馈闭环/健康度判断缺原则级锚，判断质量依赖 description 一句话。建议：CSO owner 补 3-4 条实质原则（客户数据不编造已下探到护栏，可上浮为原则）。
- **F2-3【P2】CSO 决策三分法第三态非标**：CSO 用 PASS/ESCALATE/**FORBIDDEN**——FORBIDDEN 语义是行为红线（护栏）而非决策态；C-suite 统一 APPROVE/FREEZE/ESCALATE，执行层域适配变体（FSD/STE/SDE）仍保持「状态」语义。建议：FORBIDDEN 条目迁入行为护栏节，第三态补 FREEZE（客户数据不可验证时冻结判断）。
- **F2-4【观察·不立项】安全/法务/数据专项 owner 缺席**：现由 CFO（合规基线轻量起步+利益方合同）、CTO（技术风险组合含安全类）分摊。当前经营阶段（内部实验、无对外商业化收入）可接受；触发条件建议预登记：对外收入上线或生产级客户数据管道建立时，安全 owner 缺口升维候裁（归 CEO/BS staffing 决策，非本审核范围）。
- **F2-5【观察】board/business-strategy/registries 目录共存于 source-agents/**：非 13 席序列（board=治理席非人格席、BS=spawn 型、registries=registry 族 61 件），不在本审对象内；registry 族命名形态混杂（大小写/kebab 并存）转维度 4 记录。

---

## 四、维度 3：与纪律册/治理制度冲突面（CAO 主审·已并入+CHO 观察卷）

> CAO 主审卷=`reports/d3-cao-conflict-audit.md`（本树，批号 duty-audit-agent-roles-20261012-D3，date 现查 23:35:48+0800）；纪律册全册结构实勘+24 条 D 系/M 系定向精读+14 席描述面全量实读+双源 diff 勘验。

### 4.1 结构级定调（CAO，合稿采纳）

- **审计对象双层实况**：13 席退役主件与 agent-body 真源双源 diff 全数漂移（37-134 行/席），漂移方向=主件落后于真源（真源已载 10-02/03 CEO 勘正，主件仍旧文）。本报告主审面=agent-body 真源位 ✓（与 CAO 合稿建议一致），退役主件按 §4.3 残影附录处理。
- **「13 席」vs 实盘 14 目录**：business-strategy 无退役主件（仅 agent-body+contract.yaml 投影制）；**D-13 命名宪法表 15 行无 BusinessStrategy 行**（BS spawn name 在役而通信面正名未入表）——名址宪法缺口候选。

### 4.2 CAO 真源位冲突清单（C1）

- **C1-①【P2】幻影区间引用**：COS agent-body 前置核查仍载「D-01..11 现行纪律」——现行纪律册已达 D-01..47+M-001/M-004+附录（D-18 族检索形态教训的描述面残留）。
- **C1-②【P1】升级路由族与 D-39 脱节（7 席 9 处）**：CAO/CFO×2/CHO×2/CMO×2/COO/CPO/CTO 的「中央收口路由」仍载「升级到 CEOChiefOfStaff」——与 D-39 裁决分级（2026-09-30：其余一切裁决 BOD 全域待裁授权，不候 CEO）+D-27 v4 枢纽（COS=记录转发）脱节，路由终点陈旧。逐条定性候勘（CAO 已列细目），建议全司路由语批量追平。
- **C1-③【P2】名址拼写分裂**：COO 用 `TriDeployment`、BS/CTO 用 `Trideployment`——同模块两拼法（架构表现行=TriDeployment）。
- **C1-④【待勘】SDE 描述面零 D-29/D-30 引用**（SDE 域相关纪律条目覆盖面）。
- **C1-⑤【待勘】D-21 落点四分类未涵盖 docs/testing/（STE）与 docs/training/（RDT）**——落点分类学与席位真源面的涵盖缺口。
- **台账治理对表（CAO）**：COS 台账条款与 hub-ledger-governance §一-§六全款零冲突；「台账现势 owner=COS」验收销账链一致 ✓。

### 4.3 退役主件残影（CAO C2·漂移附录面）

- COS 主件整体陈旧（name=TriCompanyCEOChiefOfStaff vs 真源 CEOChiefOfStaff、派工自裁旧表述、D-01..11 幻影区间）；CHO/CFO/CMO/COO 主件重复 bullet+RDT 条目复贴。**注**：主件系退役残影（头部自载），残影内容不作现役依据；其存在本身=发布链历史件，处置（清理/归档）候 CEO 复核后另议，本审只登记。

### 4.4 CAO 一致性观察（C3）与 CHO 观察卷

- **C3-1【P2】M-001/D-04/D-47 全席零引用**：全席机械合同在 13/14 席真源位零引用（仅 COS 有），全赖 session 面注入——建议描述面统一增一行 D-26 简介形引用（防 session 注入链单点）。
- **C3-2**：CSO 三分法词表偏离全司标准形——与 CHO F2-3 双席独立同判 ✓ 交叉证实。
- **C3-3（正面读数）**：BS agent-body 已载四 daemon 矩阵基线为全席最新对表率；COS 真源位勘正注记链健康。
- **CHO 观察卷**（本席维度 3 独立发现，与 CAO 清单互补）：F3-1 层契约归置 1 vs 10 矛盾；F3-2 护栏旧叙事 3 席；F3-3「与与」语病族 9 席；F3-4 CTO 编号倒排；F3-5 D-13 表内自不一致（与 CAO 名址宪法缺口同域，合并候裁）；F3-6 CAO 治理真源方向两处表述不一；F3-7 护栏通用条缺席面；F3-8 tricompany.md §9 旧名合规注记。

### 4.5 CHO 观察卷全文（F3 系细节）

- **F3-1【P1】层契约「对外事务连续性」归置跨席矛盾（1 vs 10）**：COS 件 §层契约载「外部社交事务连续性归 social 层（2026-10-02 CEO 审查勘正：原误归 colleagues 层）」；而 CHO/CAO/COO/CPO/CTO/CMO/CFO/FSD/STE/RDT 十席同节均写「对外 X 事务连续性归 **colleagues 层**」。COS 的勘正未向全司传播，两种归置并存且互斥——涉 social 层升维（2026-09-23 CEO 方向裁决）后的层契约解释权，属纪律/制度面未收口。建议：候 CEO/CAO 对「升维后对外连续性归属」一定谳，全司 13 席批量追平（一裁一改，禁各席自裁）。
- **F3-2【P1】护栏旧叙事残留（3 席）**：FSD §行为护栏「不把宿主 binding 或试运行上岗状态写成 **TriMMC 正式宿主**」、STE「**TriMMC 正式测试平台**」、CSO「**Copilot-host live** 上岗…生产级客户成功平台/**TriMMC 正式客户数据系统**」——「TriMMC 正式宿主切换」叙事已随 LG-034 ⑤e（2026-09-11）退役，CTO/CMO/CFO/COO（A11 铸形）已换新措辞「正式宿主切换/binding 口径」。护栏引用退役叙事=制度面引用失锚。建议：三席护栏措辞对表 A11 铸形件（operating-records/2026-W40/ceo-review-coo-batch-c3-scan-a11-cast-20261002.md）批量追平。
- **F3-3【P2】「与与」粘连语病族（模板级，9 席）**：层契约第二句模板「X 现势归 memory 层与 A 与与 B 协作关系归 colleagues 层」——「与与」叠字+两句粘连缺标点。实证席：CHO、CAO、CPO、COO、FSD、STE、RDT；粘连变体（缺标点无叠字）：CTO、CMO、CFO。系 2026-09-23 social 升维批量改写时的模板拼接缺陷。建议：一次性模板修复（SDE/CSO 简化版无此句免改）。
- **F3-4【P2】CTO 件核心职责编号倒排**：§核心职责第 15 条（技术部门管理）排在第 14 条（CodeGraph）之前——15/14 顺序倒置（2026-10-02 追加时插入位错误）。文案级。
- **F3-5【P2】D-13 名址表表内自不一致**：主表正名行 FD/ST/DE 与条 4 勘误映射行（FSD/STE 勘误）并存；agent 现役 name=FSD/STE/**SeniorDeploymentEngineer**——三层（主表行/映射行/agent 实名）互有先后，SDE 代号未入主表，BS 行缺失（CAO 结构级发现 2 同域）。建议：CAO/名址 owner 一次对表收口（主表行追平现役 spawn 名+补 BS 行候裁，历史沿革按映射行承载不删）。
- **F3-6【P2】CAO 件治理真源方向两处表述不一**：§运行资产落点载「TriMetaverse `docs/registry/company-governance-state.md` 与 TriCompany `docs/workflow/` 治理文档」；§当前工作落点载「`TriCompany/docs/registry/company-governance-state.md`（TriMetaverse 侧同路径为字节级副本，本席同步）」——两处真源方向互逆。候 CAO 定谳归属方向。
- **F3-7【观察】护栏通用条全司缺席面**：除 COO（A11 铸形条）外，12 席行为护栏无「宿主叙事按 CGR 现行裁定」同款通用条——护栏措辞追平（F3-2）时建议同步模板化，防下次退役叙事再留尾巴。
- **F3-8【观察·合规】tricompany.md §9 退役条自身引用旧名**（「运行面统一使用 TriMC」等）——历史退役条目按沿革冻结口径不改写 ✓ 合规，仅提示引用者勿把 §9 旧名当现行（§2/§3 已载 M/R 双面现行口径）。

---

## 五、维度 4：发布拷贝漂移（COS 主审·已并入）

> 主审卷=`dim4-release-copy-drift-20261012.md`（本树，commit b5f8ea61）；执行位 sg 值席 COS；三层比对法（裸 hash→**归一化 hash**（剥管线尾注/尾空白）→源-发布 mtime 时效）；采集 2026-10-12T15:30:02Z。

- **F4-1【P1】双形重复文件族 4 件（唯一实质漂移面）**：①`company-governance-registry`（小写）在 .claude 侧与 Camel 形代差 12 行（lower 系旧代残留，mtime 早一代），gh 侧同名件=与 Camel 逐字节全同复本（纯冗余）；②`tri-metaverse-code-registry` 同型。**CHO 定谳建议**：命名归一保留 Camel 形（新代证据面），.claude 侧 lower 旧代件退役评估，gh 侧复本随管线去重——执行候 CEO 复核后另下令（清理属「改」）。
- **F4-2【设计内·非漂移】宿主方言族**：4 registry 席 tools 字段大小写方言（[Read, Glob, Edit] vs [read, search, edit]）；deployment-engineer gh 特有 `user-invocable` frontmatter（github-agents 格式字段，**修正本席初判**——非旧 spawn 件残留，系 gh 宿主形制面，候管线 owner 确认 claude 形是否需对等字段）。
- **F4-3【P2】管线 hygiene 小项**：TriMetaverseProductRegistry gh 侧 UTF-8 BOM 头（frontmatter 前零宽字符），候发布管线 owner 顺手清。
- **F4-4【清洁判读】**：其余 15/22 席归一化 hash 全同（裸 DIFF 全系管线尾注 `--host` 行+尾换行包装）；源 16 目录→15 同名+registries 族映射成立，源片 mtime 全 ≤ 发布批（1791121212 批）=**零漏发布信号**。
- **F4-5【观察】**：gh 侧 4 席 mtime 陈旧（board/business-strategy/CAO/registry 族）但归一正文同=发布批未重渲而内容已在态，管线增量渲染行为观察项。**方法论注记**（COS）：审发布拷贝漂移须归一化比对——裸 hash 会 22/22 全量误报。
- **CHO 抽验旁证**：.claude/agents/ CHO 位头 12 行与源侧 agent-body 现役版一致；本席会话渲染面为旧版系会话龄差，非漂移。

---

## 六、修订建议汇总（候 CEO 复核裁，本审零改动）

| 级 | 编号 | 摘要 | 建议归属 |
|---|---|---|---|
| P1 | C1-② | 「升级到 CEOChiefOfStaff」路由族 7 席 9 处对表 D-39/D-27 v4 追平 | CAO 主勘+CHO 承办批量 |
| P1 | F3-1 | 层契约对外连续性归置 1 vs 10 矛盾定谳+全司追平 | CEO/CAO 裁，CHO 承办批量 |
| P1 | F3-2 | 护栏旧叙事 3 席对表 A11 追平 | CAO/名址批窗 |
| P1 | F1-1 | tricompany.md §4.2 执行层岗位名追平（TestEngineer→STE/DeploymentEngineer→SDE 现役口径） | COS 中央追平窗 |
| P1 | F1-2 | description 随正文勘正链同步（COS/COO 先行）+纳入五件套更新 checklist | CHO 门（checklist 增补）+各席 owner |
| P1 | F2-1 | SDE 件补 TriAuto registry 兼容指针 | CTO/SDE owner，走五件套增量流程 |
| P1 | F4-1 | 双形 registry 族清理（.claude lower 旧代件退役评估+gh 复本去重；保留 Camel 形——CHO 定谳建议候裁） | 管线 owner/CTO 发布链 |
| P2 | F3-5+C3 结构2 | D-13 三层对表收口+补 BusinessStrategy 行候裁 | CAO/名址 owner |
| P2 | C3-1 | M-001/D-04/D-47 描述面增 D-26 简介形引用（防 session 注入单点） | CAO 批窗 |
| P2 | C1-① | COS「D-01..11」幻影区间追平现行 D 系全表 | COS |
| P2 | C1-③ | TriDeployment/Trideployment 拼写归一（架构表现行=TriDeployment） | 名址批窗 |
| P2 | C1-④/C1-⑤ | SDE 零 D-29/D-30 引用勘+D-21 落点分类涵盖面扩（testing/training） | CAO 候勘后定性 |
| P2 | 4.3 | 退役主件残影处置（清理/归档/保留作沿革）候裁 | CEO 复核裁 |
| P2 | F4-2 | deployment-engineer gh 形制面：claude 形对等字段候管线 owner 对表 | 管线 owner |
| P2 | F4-3 | TriMetaverseProductRegistry gh 侧 BOM 头清理 | 管线 owner |
| P2 | F3-3 | 「与与」语病族 9 席模板修复 | CHO 承办批量（文案级） |
| P2 | F3-4 | CTO 职责编号 15/14 倒排勘正 | CTO |
| P2 | F3-6 | CAO 治理真源方向两处表述定谳 | CAO |
| P2 | F1-3 | description 格式统一模板候裁 | CEO 裁格式，CHO 落 |
| P2 | F1-4 | SDE/CSO binding 表述泛化追平 | 五件套增量批 |
| P2 | F1-5 | CFO 阈值「在案」锚点自证 | CFO |
| P2 | F2-2 | CSO 当前原则补实质条 | CSO owner |
| P2 | F2-3 | CSO FORBIDDEN 迁护栏+第三态补 FREEZE（与 CAO C3-2 双席同判） | CSO owner |

**升级项**：无。全部发现均为既有 13 席框架内的追平/修缮，不触及组织架构变更、headcount 或授权矩阵（F2-4 触发条件预登记除外，届时另行升级）。

---

## 七、协同席产出（均已并入）

- **维度 3 主审=CAO**：卷=`reports/d3-cao-conflict-audit.md`（批号 -D3，纪律册 24 条定向精读+14 席全量实读+双源 diff 勘验）——已并入 §四（C1 冲突清单/C2 残影/C3 观察+结构级定调）。零改动恪守声明在卷。
- **维度 4 主审=COS**：卷=`dim4-release-copy-drift-20261012.md`（commit b5f8ea61，三层比对法）——已并入 §五。只审不改恪守声明在卷。
- 合稿=本件（CHO 总收口）；两卷为本件组成部分，复核时并读。

---

## 八、使用依据

- 真源六件：tmv-whitepaper.md / 三元宇宙架构与模块说明.md（V0.5）/ tricompany.md（V1.2）/ github-repo-governance.md / engineering-disciplines.md（D-13 抽读）/ hub-ledger-governance.md
- 审核对象：TriCompany/source-agents/ 13 席 agent-body.agent.md 全读（现役渲染链源）+`<id>.agent.md` 退役件抽样（COS/COO/CHO/CSO 四席 diff 对表）+agent-frontmatter 抽样+D-13 名址表现读
- 发布位抽验：.claude/agents/ CHO 位实读；.github/agents/ 目录清点（双文件并存两例）
- 引用纪律条目：D-13 条 4（spawn 映射勘误）、LG-034 ⑤e（宿主叙事退役）、A11 铸形件（operating-records/2026-W40/ceo-review-coo-batch-c3-scan-a11-cast-20261002.md）
