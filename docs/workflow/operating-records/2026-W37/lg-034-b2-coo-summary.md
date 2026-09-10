# LG-034 B2 批（根两件）·联审汇总输入稿（COO 视角）

- sourceOfTruth: 本件=COO 对 B2 五席独立稿的汇总（五席全文归档同目录：cto/cos/cao/cpo 口头稿+bs-spawn 104 行归档件）
- syncMode: input-draft（转 COS 联签，随晨报 BOD 附件）
- lastSyncedAt: 2026-09-11T04:32+0800（COO 签发）
- 靶标: TriMetaverse/project.md（17117B/343 行）+ TriMetaverse/tricompany.md（44014B/1003 行）
- 批元数据: LG-034-B2；组审 04:23-04:29；参与席 COS/CTO/CAO/CPO+BS spawn；单批 cap 3000 万（CFO 核签件①）

## 大白话摘要（D-25）

我们让五个评审席独立审了根目录的两份老文档（项目流程书和公司简介摘要），结论一致：两份都该搬进 docs/ 文件夹（和昨天搬的白皮书同一种治理），内容整体换新而不是逐句修补。主要问题都是同一批：还在讲「TriMC 时代」的旧架构故事（那套架构今年八月已经改名换轨了）。改法：项目流程书搬到位后按现役架构重写并升版本；公司摘要保留历史附录一字不动（那是指定归档件），只修正正文里过时的状态描述，并加一行「附录是历史档案，引用别拿它当现行口径」。另有四件小事我们按规矩不自己拍板、已挂起等 CEO 定：文档里「未来 CPO 上岗后由 CPO 主责」的职责交接怎么写、宿主现状一句话怎么落、历史附录要不要搬出去单独存放、以及一处少数派意见（有席建议项目书留根目录不搬，四席多数支持搬，按多数执行但记录在案）。

## 一、五席趋同项（即执行）

1. **双移 docs/ 根**：project.md→docs/project.md、tricompany.md→docs/tricompany.md（CTO/CAO/CPO/COS 四席支持；CAO 补强：文档治理 §2 明载中央摘要层=TriMetaverse/docs/；CPO 备选口径接受 docs/ 根+改写修正名实错位。少数派记录：BS spawn 方案 A 建议留根位改写为项目总述——不采纳为结论、记录在案，其引用同步约束条款全盘采纳）。引用面 ≈47+≈15-20 件按 refcount 工艺全量复数+改写（冻结豁免）；文档治理 §1 表第 2/3 行随迁改写（第 3 行改指针式表述防双真源错觉——CAO③）。
2. **整体换代而非逐句补丁**（五席一致）：project.md 版本升级+头部修订说明段（退役旧口径逐条带新口径出处，BS P4 体例=白皮书修订说明式）；tricompany.md 主文追平+版本表增行。
3. **过时叙事清改簇**（五席清单合并）：标题「TriMC 运行面版」/宿主边界节（copilot chat shadow/正式接管/V1 切换/TriPilot→TriLC/Tride 句）按首件⑤基线整体换代（M 面 claude code runtime 实然/R 面 agent-core 应然/服务域 TriMMC+TriRMC/本地域 TriMLC+TriRLC/TriCade=TriRLC 层/IDE=TriPilot/CLI=trilc chat）；tricompany.md §3 write master/§9 退役清单自嵌旧口径/§5.3「待 BS 裁决」（BS 职权内定谳：白皮书 §3.3.1 已入表，无待裁分歧）等。
4. **商业真源指针化**：project.md 不再作商业真源（BS P1/CTO/CAO/CPO 四席同判）；tricompany.md §1 真源分工清单移除 project.md（BS T2）；两件改写含「商业真源=docs/tmv-whitepaper.md」显式指针；tricompany.md §1 加「不重述、只指针」原则句+附录防误引指引行（BS T4/T5）。
5. **tricompany.md 双重身份沿 published-summary 纪律**（CAO/CPO/BS 三席同构）：元信息拆双身份条目（宪章指针+摘要同步源）+sourceRevision 重算（BS T1，事实回填）；§4.1 COS 行与今日 ⑦ 改排冲突行追平（CAO②）。
6. **信息源节建立/重排**（BS P5+CPO 排序）：两件各建与 CLAUDE.md 序列一致的信息源节（含 CLAUDE.md 条目+CGR 登记注记）；business-strategy body 信息源清单按 CPO 七级新排序增量更新（源侧小改，渲染债入窗）。
7. **元信息头/版本表**：project.md 补 sourceOfTruth/syncMode/lastSyncedAt（BS P6）；tricompany.md 附录 V0.1 一字不动（diff 为零声明）+版本表增行。
8. **技术面校对单**（CTO）：模块名换代/CI-CD 工具枚举收敛现役（GitHub Actions+可扩展）/TWF-001 触发语义重述/§6 技术线追平单（候办，源侧 engineering 域另出）。
9. **COS 主焦点落点**：两件与 operating-records 零重复边界明文化（「动态经营事实真源=operating-records 周面+registry state，本件不承载周度进度」入 tricompany.md §1）；流程定义/执行记录分离原则行；§10 任务清单注时点+经营记录面处置（COS 域自办）。
10. **CPO 三问落点**：文档推导链升级（白皮书→PRD→产品真源→engineering→execution→testing 与八件套兼容）；CLAUDE.md:60 定性修正（「design document」→「TriCompany 中央摘要（宪章真源=TriCompany/tricompany.md）」）——**rides B3 批**（claude-md 真源面，本批只登记待办）；两件 CLAUDE.md/AGENTS.md 引用入 CGR 宿主随附登记。

## 二、挂起候 CEO（晨报裁决项，批内冻结）

1. **「未来 CPO 上岗后」主责翻转**：CPO 主张产品收口域生效动作 vs 红线②岗位职责变动候 CEO——两句式全文退役改现状事实句，主责归属表述候 CEO 裁后追平。
2. **宿主 write master 现状**（BS T3-2）：两处口径不一致已标，孰真候 CEO；改写窗按 CEO 裁定更新。
3. **tricompany.md 附录外移/拆出**：BS T4 默认不动候 CEO vs COS 拆出独立归档件提案（体积治理）——候 CAO 表态后并呈，本批只加防误引指引行不拆不移。
4. **少数派记录**：BS spawn 方案 A（project.md 留根位）不采纳为结论，记录在案。

## 三、执行派工

批元数据：LG-034-B2-EXEC；执行位=CTO 枢纽（fsd 改→cto 审，迁移+两件改写）+CAO（治理验收：§1 表+published-summary 纪律+CGR 登记）+COS（§10 经营记录面自办）；预估 ≤1200 万窗级（含引用改写），cap 内。挂起四项批内冻结；render debt 累计（business-strategy 增量+两件新引用）并入 B2-EXEC 后渲染合并窗。

——COO（m-coo）B2 汇总签发，2026-09-11 04:32+0800（date 现查）
