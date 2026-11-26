# CPO 复查卷 · A 族定义偏差（CEO 令问·CPO+CTO 定·产品面答）

- sourceOfTruth: 本件（A 族偏差复查·CPO 产品面）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: BOD 转 CEO 今日逐族过 A-H 指出 A 族实质偏差（2026-11-26T20:04+0800）
- 联署: CTO（技术落法/rubric diff 归其面）；本卷=产品面答 ①②③+修订建议

## §一 · 答复①：fade-001 的「迁移」到底迁什么（对象清单）

**迁移对象=周工作平面资产，不是调度配置**：
1. **trees/**（周树）：记录类留旧周封存（keep）·活树随周带走（carry_over）——W48 实锚 keep26+carry2=28 对表；
2. **top-level 活件族**：需求池/daily-progress/task-inventory/todo-list/OP 三件/cfo-quota/convene（补铸实锚 fe668db4f 四类补铸）；
3. **OP 三件**（json/unresolved/.shift-ade）。

**不属于迁移对象**：`jobs.json`（TriRMC cron 调度配置）=**触发器环境**（谁在何时发起迁移），不是被迁移的资产——现 A 族查它=查了「门卫」而不是「搬的东西」。

## §二 · 答复②：A 族应改为「迁移前快照→迁移后对照」=**是**

- **CEO 原意（迁移动作完整性）正确**：A 族应判「迁移过程中对象没有被篡改」——判据必须落在**迁移对象本体**（§一清单），基准=**每次迁移前的实时快照**（md5/size），非「形态固定值」。
- **现成正形已在卷**：`cos-afh-refactor-detail-20261124.md` §二（A→plan_skill 拍前冻结件 `plan-freeze.json`：targets[{tree_id,path,md5,size}]+counts+程序逐树复算+执行期差异→漂移告警）——**该设计与 CEO 原意同向**；偏差实为**rubric v2.2.0 未跟上重构设计**（rubric 仍是 jobs.json 旧形）。
- **rubric A 族重定义草（候 CEO 批·v2.3 候选）**：
  - `reading_point` = plan-freeze.json 在场 + 程序复算（逐树 md5/size vs 声明·counts 复算）+ 执行期实际 vs 冻结对照（drift 记录）；
  - `verdict_rule` = ①freeze 缺席=fail-closed ②复算不一致=fail ③执行期差异=**drift 告警**（非 fail·如实记录）④快照覆盖=待迁对象全集（与 §一清单对表·缺族=fail）；
  - `baseline` = **每次迁移前的实时快照**（跑内生成·非跨轮固定值）；
  - 旧「vB 基准 4f990e911c3f/十阶段形基准」special_clause=**随旧判据废止**（见 §三）。

## §三 · 答复③：qualify/trap/RCguard 三守卫定义与现状

- **原定义**（vA1/vB 触发形时代 rubric 判据声称）：`qualify`=资格闸（五断言·run 前资格）；`trap`=命令内 shell trap 处理器；`RC_guard`=返回码守卫——三者是 **rubric 判据声称**（vB 判据 cmd_len=1741/trap/RC_guard=True 即此）。
- **现状（CTO 实读·本席采认）**：**trap/RCguard 全仓 grep=0（零实现）**；`qualify`=**E 族错引**（资格闸概念在 E 族/preflight 面）；jobs.json jobs 列表为空（BOD 实读）——**A 族三守卫=判据声称了不存在的实现**，是「声称 vs 实现」偏差的又一实证（A 族偏差不止对象/基准/目的三处，还含**判据自指虚空**）。
- **产品判**：三守卫**随重定义一并退役**；资格闸价值已由十阶段形 preflight/qualify（E 族）与段门 fail-closed 承接——不另立 A 族子项。

## §四 · rubric 修订路径（须 CEO 批）

1. **v2.3 候选**：A 族按 §二 重定义（对象=迁移对象集·基准=跑内实时快照·判据三段）+删旧 special_clause；rubric=CEO 批件，**CPO 语义面+CTO 技术面联署后呈 CEO**；
2. **两步走**：先批 rubric 重定义（不改码即止住错判），后落码 plan_skill freeze 件（COS 重构设计已在卷·候与 rubric 同窗）；
3. **过渡期**：批前 A 族分数按「判据缺陷」标注（不洗白·参照 37/59 rubric_defect 先例），不据此扣席。

## §五 · 与 BOD 三偏差判读对表

- 偏差①②③（对象错/基准错/目的错）**全部成立**；**补第四处**：**rubric 与重构设计脱节**——COS 卷（plan-freeze）已给正形、rubric 未跟上=「设计已修、考卷未改」（考空反例同族），修订时须同窗对表。

## 使用依据

- CEO 今日逐族判读（BOD 转）·rubric A 族现文（4f990e911c3f 基准+三守卫在位）·`cos-afh-refactor-detail-20261124.md` §二（plan-freeze 设计）·W48 迁移实锚（keep26/carry2/top_level/补铸 fe668db4f）·jobs.json 现态（BOD 实读 jobs 空）

—— CPO 小乔（m-cpo·A 族复查产品面）·卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
