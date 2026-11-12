# FADE-001 拆分联审 · CTO 段稿（CEO 11:17 直令·组审三焦点全量表态）

- sourceOfTruth: 本件（拆审 CTO 独立分卷·程序位=审零改动·禁参考他席稿遵行）
- syncMode: static（段稿定稿·分歧项标注候裁）
- lastSyncedAt: 2026-11-12T03:23:42Z（写前现查 11:23:42+08 原值·D-47）
- 令链: CEO 11:17 直令（BOD 组审令六要素）→接令回执（8810df2b）→四源实勘→本稿

## 〇·结论三态（先行）

**支持拆**——条件面全在文档/registry/培训层·**代码零改动**·调度零改动。拆分不是「解除代码耦合」（耦合本不存在）而是「登记面追认代码事实」：两域实现从第一天起就是两套独立载体，合并形态只存在于 registry 条目与培训叙事层。

## 一·焦点①技术审计：耦合度定谳（代码零耦合·组织五耦合）

**代码面实勘（四源：daily_progress_patrol.py 965 行全文+weekly_plane 家族四件互引 grep+runbook+registry 条目）**：

| 域 | 载体 | 位置 | 互引 |
|---|---|---|---|
| 域②维护 | daily_progress_patrol.py（965 行单文件自包含·含 Score T1-T8） | TriCompany/runtime/cognition/ | **零**引迁移家族 |
| 域①迁移 | weekly_plane.py+weekly_plane_shift.py（496 行）+weekly_plane_shift_fade.py+weekly_plane_shift_validation.py（家族四件） | 同目录 | 引 weekly_plane（家族内共享）·**零**引 patrol |

- **代码共享面=零**：patrol 不 import weekly_plane 家族任何件·反向亦然——两域唯一共居形态=同仓同包目录（组织共居非代码耦合）；
- **调度面已两分**：域②=sg TriMC cron 每 10 分钟（TICK_SECONDS=600+timeout 180s）·域①=河源 TriRMC job 9c81c7ec 周日 23:50 北京（10-18 令改形）——不同 daemon 不同机·**拆分零调度改动**；
- **runtime.fade_protocol.score_engine 已拆**（N-D3）：三态/双类门原语已接协议层引擎·判据集留实例文件——协议层与实例层分层先例已立·registry 拆条目与此同构。

**组织耦合五点（拆分真实工程面）**：

| # | 耦合点 | 现势 | 拆分动作 |
|---|---|---|---|
| A | registry 单条目混装 | v2.0.2 扩维（08-28 CEO 提案「迁移→维护」）单条目承载两域·档位=两域双门槛合取（CPO 域级分卷采纳） | 条目拆二（§三清单） |
| B | 考卷三卷分裂 | 主卷 threshold=80/maintenance 卷 100 分/plane-shift 卷 145 分零主观零阈值——**三卷分裂正是混装病征**（improvement 单 J6 已挂账） | 卷随条目走（§三清单·⑥规范化候批联动） |
| C | commit 身份共享 | 两域 commit 身份同为 TriMC Scheduler——审计面靠 PATROL_MSG_RE 消息正则区分（脆弱区分面） | 拆后两域 commit 身份分设（域① TriRMC Scheduler 候议·实现一行级）**候裁**（涉 TriRMC/sg 面改动·超出纯文档边界） |
| D | 产物目录共居 | 同在 operating-records（迁移整树操作 vs patrol daily-progress.md 追加）——同仓 git 并发写面（patrol pull --rebase 冲突重试机制即为此设计） | **不解除**（同仓事实·拆分仅消语义混淆） |
| E | 培训叙事混装 | fade-001-deep-dive.md+fade-001-maintenance-deep-dive.md（788 行双稿）挂同一编号 | 域②内容改挂新编号（§三清单） |

**拆分工程成本总评**：**极低**——代码/调度/keeper 拓扑零改动；工程面=registry 条目拆分+考卷迁移+培训内容剥离+一处 docstring 锚行·全部文档层操作。

## 二·焦点②编号资源归属方案

**首选案：迁移域保 FADE-001·维护域②拆出=FADE-012**。

- **FADE-011 实质已被占号**：TriMLC ew-run 形态三面在役——runId 族（fade011-daily-*/fade011-ew-runs·8713 每日拍现役）+培训目录（TriCompany/docs/training/fade-011/ 五文件+improvement-draft·本席 B 形态升维清单即此族）+改进草稿线——registry 未登记=**登记滞后非编号空闲**（007 先例：探索期在途不占正式编号——011 转正登记时注明即可）；
- 012 跳号防名址漂移：若维护域强行用 011=与 TriMLC 形态同号不同物（registry 实例号×培训目录号双轨撞名=名址漂移源——fade-registry 与 training 目录两序号面本就不严格同构：005/010 无培训目录·fade-011 有目录无 registry 条目——**拆分恰好是序号面对表契机**）；
- **备选案（不推荐）**：维护域用 011+TriMLC 形态改名——反对理由：改名牵动 runId/脚本/培训三面在役资产=拆分外新增工程·违反最小改动原则·且 ew-run 形态候升格登记面正好补 011 空位。

**分歧项挂起标注**：编号终裁权=registry owner（CAO 归口链）+涉 RDT 培训面——本席首选案=技术勘定供裁·非径裁。

## 三·焦点③培训/文档/registry 改动技术清单（供 RDT 执行面）

| # | 面 | 动作 | owner 面 |
|---|---|---|---|
| 1 | registry 条目 | FADE-001 条目拆二：①迁移域全保（十段表+补课三件+首评 90+plane-shift 卷·原锚零动）；②维护域整段迁出为 FADE-012 新条目（十段设计表+扩评中标注+maintenance 卷随迁+patrol 载体锚）；两条目各加互见注（互见不互绑）+版本行升版+011 占号注记（007 先例同款） | registry owner 链（CAO）·技术面本席复核 |
| 2 | registry 现势勘正随条 | 域①执行点登记滞后勘正：registry 表格「TriMC cron 0 23 * * 0 Asia/Singapore」→现役「河源 TriRMC job 9c81c7ec 周日 23:50 北京（10-18 令改形·W35 起执行点迁移）」——拆条目时随勘（一石二鸟） | 同上 |
| 3 | 培训·域① | fade-001/ 目录五文件（01-05+README）域①内容保留——05-trigger-chain-draft 十阶段重组线继续（RDT 现役线不受扰·BOD 每段拆解→RDT 丰富机制照旧）；fade-001-deep-dive.md 域②章节剥离 | RDT |
| 4 | 培训·域② | fade-001-maintenance-deep-dive.md（788 行）改挂 FADE-012（文件名改 fade-012-maintenance-deep-dive.md 或目录化 fade-012/——随 training 目录规范候裁）+新编号交叉引用 | RDT |
| 5 | 培训·源定位档 | training-source-and-directory-allocation.md 随批更新（序号面对表注） | RDT+registry owner |
| 6 | 考卷 | FADE-001-paper-maintenance.json 改挂 FADE-012（双 hash 冻结仪式重走=文件改名后载体身份变更）；**时序建议=⑥出卷规范化候批先行**——拆分后新条目首评直接按 100 分制新规范出卷·免「先迁旧卷再改新规范」二次返工 | CTO 域（出卷冻结链） |
| 7 | 代码 | **零改动**；唯一触点=patrol docstring 真源锚行（L5「FADE-001 维护项②」→FADE-012）——一行注释级·随下个代码窗顺手（非本拆分必需·注释滞后不破运行） | 本席裁量窗 |
| 8 | runbook | trimc-cron-plane-shift-runbook.md（域①文档）不随拆分动·归属注已清 | 无动作 |

**「迁移可用维护产物但不硬绑」技术落位核验**：现役迁移家族 grep patrol/progress **零命中**=迁移链不读 daily-progress.md——**现役已满足不硬绑**；未来迁移链若需引用周进度（carry-over 增强）=读文件非 import·零硬绑定由代码规约保持（本席架构约束随拆分决议立：跨域产物引用一律走文件/数据面·禁代码级 import 依赖）。

## 四·验收锚（BOD 知会行用）

- 段稿锚=本卷 commit SHA；三焦点全量表态毕·零分歧空位；分歧项两处显式挂起（编号终裁 CTO-2/commit 身份分设 CTO-C）候裁面；
- 预授权链姿态：若四席一致同意拆→执行清单以本卷 §三为技术正身（RDT 面按清单执行·registry 拆条以本卷 §二首选案为默认·分歧项候裁后落）；有异议→本卷 §一/§二论证面供 CEO 裁。

## 使用依据

daily_progress_patrol.py 965 行全文实读/weekly_plane 家族四件互引 grep 实勘（patrol 零引用·shift 引 weekly_plane 家族内）/TriMMC runbook（§7 时区条+五段链幂等）/fade-registry.md FADE-001 条目全景（v2.0.2 扩维+双门槛合取+三卷分裂+齿条）/fade-001-improvement-20261110.md（J1-J8+十阶段拆解坐标系+第一段过审中）/training 目录实列（fade-011 目录五文件实占）/memory 面执行点迁移令（10-18 f72bdc64e·河源 TriRMC 9c81c7ec 23:50 北京）。

—— CTO 小狄（m-cto·拆审段稿），2026-11-12 11:23 CST（写前现查 2026-11-12T03:23:42Z=11:23:42+08 原值）
