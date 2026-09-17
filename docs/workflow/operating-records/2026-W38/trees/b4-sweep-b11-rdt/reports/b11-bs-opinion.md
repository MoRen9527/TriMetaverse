# B4 扫尾批11 rd-trainer 域联审——BS 席独立意见

- **席位**：BS（BusinessStrategy，spawn 型出席；BOD 2026-09-16 裁定 BS 系非人格 registry agent、spawn 合规）
- **时点**：2026-09-17T13:13+0800（date 现查）
- **程序位**：审——零改动，唯一写盘=本意见件
- **席位焦点**：商业战略对齐（商业模式表述、模块边界、归属路由阀门、裁决面越权）
- **独立性声明**：未读任何既往批次意见件/汇总件原文（含自家既往稿；指针实勘 grep 仅返回路径名，未打开任何命中文件）；跨批基线仅以派工令所列六族名为准；本稿仅据靶标 9 件现勘与指针落点实勘（2026-09-17）独立成文。
- **批号**：B4-sweep-b11；**靶标**：`TriCompany/source-agents/rd-trainer/` 全 9 件（wc -l 实测合计 589 行）

## 一、表态总表（9 件全读全表态）

| # | 文件 | 行数 | 意见摘要 | 级别 |
|---|------|-----|----------|------|
| 1 | agent-body.agent.md | 121 | 现行真源体。商业护栏完备：不替代 BS/CPO/CTO/registry（L15）、归属路由阀门四向收口（L16）、培训材料≠商业承诺/战略裁决（L28）、涉模块边界与商业路径先咨询 BS（L69）、不自行裁决中央战略（L105）——与总商业模式真源及中央路由一致。附建议：L73 固定前置核查 compass 指针有正名无真源路径（D-16 指针两要素缺一），且 grep 实勘 12 席 agent-body 同模板命中，属族级单点修，不入本席单件裁 | PASS（附建议） |
| 2 | agent-frontmatter.agent.md | 5 | name=RAndDTrainer、user-invocable=true 与 contract identity 一致；description 属投影制族（§二-2） | PASS |
| 3 | rd-trainer.agent.md（壳） | 128 | L6 退役横幅在（真源已切 agent-body，D1b manifest 已切源），退役使内容漂移惰性。两残缺：①L93 悬行——「技能技艺」第 2 条已见 L88，又以直引号变体复现于第 5 条之后，序错重复；②L70-79 保留旧版五项前置核查全文，与 body 的 compass 指针形态已分叉。建议候事实回填窗一并清残 | 建议 |
| 4 | rd-trainer.contract.yaml | 133 | 四项：①L130-133 runtime_baseline 块（copilot-host/planned/migration_ready=false）命中换代窗族→随族（红线二）；②L45 reports_to=CEO 与 colleagues L5 汇报 CTO 相抵→候裁（红线一，§三-3）；③L25-26 responsibilities 第 6 项误成 `- description: …`+`priority: medium` 键映射，余 5 项纯字符串，YAML 同构破坏，修法已录（§三-2）；④tools read 域命中 P2 paths 族（§二-5） | 挂起 |
| 5 | colleagues.agent.md | 39 | L5 汇报线=CTO 与 contract L45 相抵（候裁，§三-3）；协作面（CPO 产品素材/CHO onboarding 衔接/COS-CHO 接需回传）与归属路由阀门一致，L24「不替工程面背书」边界正确 | 挂起（候裁项） |
| 6 | memory.agent.md | 37 | 写入边界三条（不写入代码实现/不评判产品决策优劣/技术事实必标真源路径）为商业-工程边界正确收口；L19-23 落点与前文小重复，无害 | PASS |
| 7 | session-body.agent.md | 46 | 名址纪律（RDT 正名+D-13 注册锚、ListAgents 对名址、date 现查禁估读）与跨仓路径纪律（LG-023）齐备；域路由指针本批逐条实勘全通（training README/落点分配件/onboarding 路径件/教学范式件/binding profile/tricompany 课程族 README+01-05+appendix 均在盘）。两意见：L30 对 tmv-whitepaper 定位表述降格（BS 焦点，§三-1）；L38-46 内嵌五项前置核查与 body 的 compass 指针双形态并存，手册真源落定后有漂移风险 | 建议 |
| 8 | social.agent.md | 27 | L13 对外分发授权边界护栏（未经工程面确认不外发、标注适用版本与真源路径）——对外商业边界正确；小吴命名留 CEO 正式命名+上岗日期锚，可溯 | PASS |
| 9 | soul.agent.md | 53 | 禁止退化三条含「禁止把培训材料写成商业承诺或正式战略裁决」——BS 焦点正锚；L26-53 四块（认知分层约束/当前原则/运行资产落点/层契约）与 agent-body L18-43 逐字级重复（对读未见异文），单边修订即漂移，建议渲染链或校验锚保同步 | PASS（附观察） |

**分布**：PASS 5（#1、2、6、8、9，其中 #1、9 附建议/观察）｜建议 2（#3、7）｜挂起 2（#4、5）。

## 二、跨批基线命中族清单（仅族名+一句话）

1. **runtime_baseline 换代窗**：命中——contract L130-133 `copilot-host/planned/migration_ready=false` 块在窗内，随族统一处理，本席不单裁。
2. **description 投影制**：命中——contract identity.description 为定义点；frontmatter（适用场景式）与壳 frontmatter（句子式）两投影异文，壳侧因退役惰性，body 侧投影与 contract 异文是否合规随族投影规则核。
3. **E2 命名**：未发现需直录修法的命中——name 链 RAndDTrainer/rd-trainer/小吴 全族拼写一致、各有注册锚。
4. **execution 悬空标注群+反向撤注群**：未命中——9 件无 docs/execution 类悬空标注与撤注残留；agent-body compass 指针属 D-16 指针缺径，另列 §一#1 建议，不入此族。
5. **P2 paths 群**：命中——contract tools read 域 `src/` 于 TriCompany、TriMetaverse 两仓根实勘均不存在（悬空路径；TriCompany 实有根=packages/runtime/scripts/docs/source-agents），`*.md` 泛 glob 过宽，且 `docs/training/` 被 `docs/` 包含而冗余。
6. **名址拼写精度（RAndDTrainer 驼峰对表）**：命中且通过——全 9 件 RAndDTrainer 驼峰拼写零漂移；RDT（session-body L7 通信正名）、rd-trainer（目录名/agent_id/binding-profile 文件名）、小吴（D-13 注册中文名）各有锚，不混用。

## 三、重点意见

### 1.〔BS 焦点〕session-body L30 白皮书定位表述降格——建议

- **意见**：L30 将 `docs/tmv-whitepaper.md` 标注为「仓库根白皮书，全局架构/部署拓扑」。
- **理由**：该件是总商业模式唯一真源；培训指针是新人商业认知第一站，漏「商业模式」定位位会引导新人把白皮书当纯架构件读，与「商业定位→模块定位→技术实现」认知分层相悖，属商业表述一致性偏差。因系培训面降维、不越权改写真源，定建议级不入挂起。
- **修改建议**：改为「`docs/tmv-whitepaper.md`（总商业模式白皮书=商业模式唯一真源，兼全局架构/部署拓扑参考）」。
- **验收锚**：修订后指针含「商业模式唯一真源」定位词；路径当次实勘在盘（本批 2026-09-17 已勘通过）。

### 2. contract.yaml L25-26 responsibilities 第 6 项 YAML 结构缺陷——建议（修法直录）

- **意见**：`- description: 在培训内容中保留真源路径，不让教程替代真源` + `priority: medium` 构成键映射，与前 5 项纯字符串不同构，疑迁移期键名误植；机器解析得混合类型数组，破坏契约可读性。
- **修改建议**：还原为纯字符串项 `- 在培训内容中保留真源路径，不让教程替代真源`；`priority: medium` 是否保留随契约 schema 定。
- **验收锚**：YAML 解析 responsibilities 为 6 元素纯字符串数组。本席零改动，修法留执行窗。

### 3. reports_to 跨件相抵——挂起候裁（本席不代裁）

- **意见**：contract L45 `reports_to: CEO` 与 colleagues L5「汇报给：CTO 小狄……培训优先级和受众范围由 CTO 确定」直接相抵。
- **理由**：两说各有支撑文本（contract：escalate 培训策略→CEOChiefOfStaff、peers 含 CTO；colleagues：技术准确性 CTO 终审、培训优先级受众 CTO 定），非笔误级可径改。
- **归属**：岗位汇报线属治理制度与岗位边界，归 CompanyGovernanceRegistry（会同 CHO）裁；BS 仅登记相抵，不代裁。裁决前 contract、colleagues 两件均不宜单边改动。

## 四、挂起与候裁清单（三红线）

| 红线 | 事项 | 候裁位 |
|------|------|--------|
| 一·跨件相抵待上位裁 | reports_to：CEO（contract L45）vs CTO（colleagues L5），详见 §三-3 | CompanyGovernanceRegistry 会同 CHO |
| 二·族基线窗未落定 | runtime_baseline 块（contract L130-133） | 换代窗族统一处理 |
| 三·证据不足不臆断 | compass 手册〈开工前置核查〉节真源形态：实勘到 `.claude/compass`（宿主侧）与 `docs/execution/compass-rename-plan.md`（更名计划件），节级内容与真源文档落定未勘→待确认；`TRICOMPANY_COGNITION_HOME`、`.tricompany-cognition/org/*` 为运行态落点，本批未勘不判 | 候手册真源落定后复核 |

## 五、依据链与合规

- **依据**：派工令所列任务书 `docs/workflow/operating-records/2026-W38/task-charter-20260916-msg-resume.md` 任务2（按令转述，未读原文）、D-27 树协议、联审工作流 V0.2、批号=B4-sweep-b11。
- **合规**：程序位=审，靶标 9 件零改动；读面压缩二级令遵守（未读任何既往意见件/汇总件原文）；指针实勘仅用 ls/grep 路径名与靶标文件本身。
- **唯一写盘**：本件（`trees/b4-sweep-b11-rdt/reports/b11-bs-opinion.md`）。
