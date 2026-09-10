# LG-034 阶段 1 首件组审·联审汇总输入稿（COO 视角）

- sourceOfTruth: 本件=COO 对五席独立稿的联审汇总（五席全文归档于同目录，本件逐条标注席别可回溯）
- syncMode: input-draft（候 COS 会签后报 BOD 转 CEO）
- lastSyncedAt: 2026-09-11T00:02+0800（COO 签发）
- 靶标: `TriCompany/source-agents/business-strategy/agent-body.agent.md`（74 行）
- 证据包: `docs/workflow/operating-records/2026-W37/lg-034-stage1-agentbody-{ceo-input,bs-spawn,cos-draft,cto-draft,cao-draft,cpo-draft,coo-summary}.md`

## 审执台账

- CEO 发起令 2026-09-10 23:33+0800（铁律条 0 触发）→ COO 组审下发 23:38 → 五稿回收：COS 23:34（经董事会通道先行触发，合规）/ CTO 23:44 / CAO 23:49 / CPO 23:56（CEO 23:47 增补席位）/ BS spawn 23:5x 归档 98 行（M-004 残留场景③首例，落盘+回报核验一致）。
- SLA 全达标（标准门 00:09/00:18 均未触发催办）；五稿独立性保住了——派工与转播隔离，收敛系独立实读后自然形成；全程零文件改动（靶标面），归档件仅 operating-records 证据面。
- 名单基列修订（CEO 23:47 令）：项目维度商业/模式文档类靶标，CPO 默认入列。

## 总判断（五席一致）

靶标须**重写级修订**而非词句修补：非人格 registry-ification 成立（人格四件系模板错配）；「商业模式统筹+模块功能边界+治理配合」三支柱重定位成立；席位无需撤销，按新口径重写。**CPO 边界保障条款随批**：contract.yaml:40 forbidden「产品功能优先级排序」原样保留，「统筹商业模式」不得吸收产品优先级裁决权。

## A. 趋同项（≥3 席独立收敛，可入改写方案候选）

1. **人格件处置**：soul/memory/colleagues/social 删除或改「非人格 registry 型」显式声明（COS 1/CAO 总判/CPO ②/BS spawn 实证空模板）；删除走 D-07 通道+manifest 同步，删前抽验运行态内容（CAO 独立发现 1）。
2. **agent-frontmatter.agent.md 空壳删除**+contract paths 悬空修正（COS 2/CTO 发现 A）。
3. **description 单一真源化**：body L3 与 contract.yaml:10 双写收敛为一处定义（COS 4/CTO 发现 B 建议以 contract.yaml 为源、body 渲染生成）；另 registries/business-strategy.agent.md L3 为第三处同串（CTO ④/CPO 发现 1——与处置方案联动）。
4. **description 五词**：「TriMC 统一运行面」「正式上线切换阶段」无争议移除（5/5）；「入口策略」移除或移交产品面（CTO/CAO/CPO/BS spawn）；「赛博公司经营载体」有条件保留（BS spawn 拆裁/CAO 限定主语/CPO 改措辞——共识=保留 TriCompany 模块定位语义、去运行载体语义、边界句指向 CGR）；「TriModel」见分歧项 1。
5. **L30-38 基线节重写级**：L32「TriMC 标准名」条删（CTO 判全件最大过时源）；L35「Tride=orchestration 底座」错误断言修正——四席独立命中（CTO ⑤d/BS spawn 证伪 1/CPO ⑤d/COS 相关条）；L36 shadow 条删；L37 切换里程碑条删候 ⑤f；L33/L34 同步；L38 旧三主控名历史映射条保留（BS spawn 证伪后站得住项）。
6. **yaml runtime_baseline 三废字段**（host: copilot-host / tri_mc_status: planned / migration_ready）同步重写（COS 7/CPO ⑤e 最硬样本/BS spawn 8）；runtime_equivalent: openclaw 三处候勘（COS 8/CPO 发现 2）。
7. **tools 字段规范**：`search` 非宿主原生工具名，对表渲染管线消费行为后统一（COS 12/CTO 规范 1/CPO 发现 2）。
8. **白皮书收归 docs/**（四席支持）：docs/ 根落位、不埋 docs/product/（CPO）；「真源迁移切片」一次闭环=git mv+活体引用全量改写+registry 登记+信息源清单同步；历史冻结件豁免；根级禁同文副本、指针件合法（CAO/CTO/CPO/BS spawn 共识）。
9. **信息源清单改写同步**：补 CLAUDE.md（宿主随附属性+CGR 登记）+AGENTS.md（CPO 补）+三元宇宙架构与模块说明.md；根路径注仓前缀（CPO）；project.md/tricompany.md 改写后按新身份回列。
10. **⑧更新策略二分**：事实回填（名称/路径/状态）可 fade 自动化+commit 留痕+逐真源 FADE 条目登记；裁决面（商业模式表述/模块边界/优先级）人工门不豁免——四席同构（COS FADE 指针最保守同向）；负路径断言验收（CAO）；两段式落地（CTO）；分层白名单（CAO）。
11. **registry 死名件处置**：Tride*/TriMC*/TriLC* 前缀 ≥10 件出处置清单，死名件优先（CPO ②/CAO 发现 2）；CGR 拆件对齐「非人格 registry 源侧结构标准」（CAO ②/CPO ②）。
12. **V1 readiness 护栏**：「成熟点」钉措辞前置条件=TriDev 门禁读数+可验收判据清单+CEO 确认门（CTO ⑤f/CPO ⑤f/BS spawn ⑤f 三席护栏）；「主开发=agent-core」入稿须实然/应然切分标注（BS spawn/CPO）。
13. **存量过时叙事清扫专项**：CGR 登记裁定口径→多文档扫描改写；首批命中=TriRMC/README.md（CTO 发现 C）、CLAUDE.md「.github/agents/（Copilot-host entry）」与 TriCode="orchestration" 句（CPO ⑤e/⑤d）、文档治理与真源文件系统.md §2.1 旧名集中带（CAO ⑤e 注记）。
14. **⑦技术/域 owner 会签位**：收口流程含技术项会签节点（CTO ⑦）、产品/工程 owner 判定事实不入中央排程（CPO ⑦a）、BS 保留商业边界被调参与席+模块说明 §2/§4 前置线（BS spawn ⑦）、COS 保留升级链与董事会通道（CAO ⑦）。

## B. 分歧项（两案并呈候裁）

1. **「TriModel Provider/Model 配置层」在 description 的去留**：案 1=保留改准（CTO「模型 Provider/Model 路由与配置层」/BS spawn「TriModel 模块边界（Provider/Model 统一配置层）」）；案 2=自 description 移除、如需保留归 body 基线段（CAO/CPO）。共识：「宿主适配与切换配置层」旧语义必死；「类 CC Switch」仅理解用不入档（5/5）。
2. **③runs 件立否**：倾向不立或显式划界后方可立（CAO：与公司级 operating-records+publish-flow §3 动态数据纪律三处打架风险；CPO：须先划模块级运行记录 vs 公司级经营记录边界）vs 交联审不单独反对（CTO）/支持 CGR 牵头并对表六层口径（BS spawn）。候 CEO 终裁。

## C. CEO「联审裁」五处对照速览

- ③ contract/prd/testing=三席裁「立」且边界定义已给（contract=CTO+CPO 双域会签；prd=CPO 单版本需求正本 vs product 登记面；testing=CTO/STE 验证面 vs engineering 技术真源；CAO 另提醒对表 governance-state 六件套防第三平行真源+分级标配防空架）；runs 见分歧 2。
- ④ 三问=见 A4/B1（赛博公司有条件保留为多数意见；入口策略移除为多数意见；TriModel 两案并呈）。
- ⑤ 核实=CTO 逐项核实（a/b/c/d/e 成立，d 附「orchestration 仅在 MC 层」表述过强修正案，f 护栏）；BS spawn 白皮书 §3.1/§3.3.1/LG-031 证据链可销 ⑤a「待确认」；CAO 治理面对表+⑤c 承办对照表增行；⑤b/⑤d 采 CTO 核实结论。
- ⑦=五席均支持方向，程序条件集合见 D-1。
- ⑧=共识结构见 A10；模块管理 agent 实名勘正=**TriCompany.agent.md**（CPO 勘正 CEO 令文「tricompany.agent.md」笔误，⑧落点注意）。

## D. 程序条件（⑦ 定谳的前置要件，非普通修改建议）

1. **⑦ 系 owner 矩阵级变更**（CAO ⑦）：governance-state L15+Current Ownership 表+github-repo-governance.md §8 三处同步改写；涉 COS 岗位职责变动须走 CHO handoff 核对（governance-state L31 程序）——**COS 本席为当事方，其会签仅覆盖本汇总件的事实组织准确性，⑦ 的职权变更裁决走矩阵修订程序+CHO 核对**；「管理」动词须定义（CAO 建议=收口督办与节奏管理，分派权/升级权随迁与否逐项列明）；CGR 主笔重写 central-registry-closeout-workflow.md（BS spawn ⑦ 建议，该文件 2026-06-03 版已过时）。
2. **白皮书引用面计数差异**（CAO 59 件/CPO ≥41/BS spawn 确证 4 处）：系扫描范围差异（冻结件/派生面口径），执行前按 CAO 审计根声明口径全量复数。
3. 双真源歧义处置：BusinessStrategy 五件套 vs registries/business-strategy.agent.md 平铺件，改写前先裁决真源落点（CPO 发现 1，归 CHO/CGR 处置）。

## E. 下轮靶标候选（供 CEO 排期，本轮未动）

CEO 已预定：project.md+TriCompany.md 优化案（CPO 已给处置建议：project.md 改短导航件或并入白皮书叙事；tricompany.md 收敛 TriCompany 源侧真源）。席位新增候选：文档治理与真源文件系统.md（lastSyncedAt 2026-07-03，CAO 发现 3）；根目录 32 md 污染取舍清单（CPO ①）；registries/ 平铺族处置（CPO/CAO）。

## F. COO 执行切片预案（批后按 v3 条 6/7 批次授权+小件快通道运行，未批不动）

切片 1=靶标件重写（body+contract+description 同步，④⑤裁决落地）；切片 2=白皮书迁移切片（①+⑥关联）；切片 3=registry 结构标准切片（②+死名件处置）；切片 4=过时叙事清扫专项（⑤e+13 项清单）；切片 5=closeout workflow 重写（⑦，预设 CHO 程序）。纯文档改动豁免 ste（阶段 0 已裁），涉 contract.yaml/发布管线面由 CTO 线验收。

——COO（m-coo）汇总签发，2026-09-11 00:02+0800（date 现查）
