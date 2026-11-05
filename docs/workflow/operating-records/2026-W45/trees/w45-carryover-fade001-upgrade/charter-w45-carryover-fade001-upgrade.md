# 任务书 · W45 周平面盘点挪移＋标准件补齐＋翻周标准立制＋FADE-001 十段升档（一气呵成单任务书）

- sourceOfTruth: 本件（任务书正身；CEO 2026-11-05 15:02:41 四令直裁·15:04 增补令随卷）
- syncMode: static
- lastSyncedAt: 2026-11-05T15:06:31+0800（date 现查原值·立书即生效·候 CEO 确认面由 CEO 直令本身承担）
- 立书位: 董事会 BOD（CEO 直令立书·任务书生效=CEO 令「把任务书做出来…直接 18:00 后自动拾取一次跑完」）
- face 路由: **M 面服务域 sg duty 席组全体**（不跟本地混）——值席 COS 拾取拆树·COO 排工·CPO/CTO/CAO 分辨与立制·FSD/SDE 施工·STE 验证
- 施工窗: **2026-11-05 18:00 后**（CFO 停工窗 14:30-18:00 结束即拾取·一次跑完·不分期不排期不拖窗）

## 一、令源（CEO 原文四段·本任务书=四令合一执行体）

1. 「先把 w40-w44 的周平面任务检查一遍，把遗漏的整理，全部挪到 w45。」
2. 「w45 目前周共学、任务进度大表、需求大表等标准件都没有，这也是未来 plan skill 在工作前要梳理的，不能遗漏工作，完结的任务怎么处理，未完结的怎么处理，哪些标准件必须搬家，其中内容如何变动等等，一周的工作如何搬到新一周，要有标准有规划。」
3. 「不要排期，可以立项，把任务书做出来，挂 M 面服务域 M-SG 直接 18:00 后自动拾取一次跑完，不要跟本地混。以后立项的，有任务书，直接一气呵成，跑完所有，不要拖拖拉拉，搞一堆段、期什么的，一个任务书一次搞定。」
4. 「plan skill 是针对不同 fade 实例做不同规划的 skill，让 cpo 和 cto 考虑哪些是通用的，哪些是 fade 个性化的，出题和评分等其他环节也是一样，需要考虑。」

## 二、范围（四包一气呵成·包内节点=工序序·非分期）

### 包 A · W40-W44 周平面遗漏检查与挪移（SDE/COO 面）

- 逐周（2026-W40～W44）扫 operating-records/<周>/ 标准件齐性，对照基准清单：OP-YYYYMM-WNN-001.json＋unresolved-items.md／daily-progress.md／scoring-ledger-wNN.md（任务进度大表）／company-demand-pool.md（需求大表）／weekly-meeting（周会件）／weekly-plane-shift-runbook.md／task-inventory（任务盘点件）／周共学 journal（项目级 AI 共学周记目录按周件）。
- 已知迹象（BOD 预勘·施工席复核为准）：company-demand-pool 至 W42 后断档；weekly-plane-shift-runbook 至 W42 后断档；weekly-meeting/task-inventory 至 W42 后断档；W43/W44 周根仅 5-8 件=翻周标准工序 W43 起执行退化。
- 遗漏任务三分类处理：**完结**→按台账纪律销账留痕（销账必附证据锚）；**未完结**→carry-over 到 W45（照 2026-10-19 整树迁移三面分工口径：新周挂未完成标记·原周记录留发生周不改写不物理搬移）；**存疑**→逐件列 BOD+CEO 面候裁清单（不得自行丢弃）。
- 产出：周盘点报告一件（逐周齐性表+遗漏清单+三分类处置账）。

### 包 B · W45 标准件补齐（COO/COS 面）

- 建齐 W45 缺失标准件：company-demand-pool.md（需求大表·从 W42 件承续+增量）／周共学 journal（照 journal-recording-ade-spec 四问三查五查规范·格式基准取最近周）／weekly-plane-shift-runbook.md（恢复挂周）／task-inventory（W45 盘点件·吸收包 A 盘点报告）。
- 已有件核对：scoring-ledger-w45／daily-progress／OP json+unresolved 逐件开箱核对内容完整性，缺节补节如实标注。
- 产出：W45 周平面标准件齐性断言（逐件路径+行数证据）。

### 包 C · 翻周标准立制（=未来 Plan Skill 工作前梳理的正形模板·CAO 主笔 COS/COO 会签）

- 正形回答 CEO 令 2 全部问项并成文：一周的工作如何搬到新一周——**完结任务处理规则／未完结 carry-over 规则／必须搬家的标准件清单／搬家时内容如何变动（周号替换/挂账重挂/记录留原周）/翻周前检查单（checklist 逐项可打勾）**。
- 正身落点：翻周 SOP v2（升版 fade-001-plane-shift-agent-plan.md 或新立正身·二选一由 CTO 包 D 分辨结论定·交叉引用不双头维护）；与 FADE-001 考卷 T7-T9 三题联动（在办树随迁/台账对表/新周实质非空）。
- 产出：翻周标准正身一件+本周（W44→W45 补做轮）按新标准走一遍的实练记录（标准立制即实练验证）。

### 包 D · FADE-001 十段升档施工（CTO/CPO/FSD/STE 面）

- **N-D1 通用/个性分辨联审（CEO 15:04 令·先决节点）**：CPO+CTO 联合出分辨结论——Plan Skill／出题（考卷）／评分（Score CLI/Skill）／Verify／Close 各环节，**哪些是跨实例通用件（机制骨架·一套）／哪些是 FADE 实例个性化件（每实例自己的题面与判据·001 的九题≠011 的题面·不可直接复用）**。结论正身落卷（建议形态=spec 增补节或独立分辨卷·CTO 定）。
- N-D2 考卷冻结仪式：fade-papers/FADE-001-paper-plane-shift.json 1.1-draft→正式冻结（双 hash raw+LF canonical+authority·照 FADE-001-paper-maintenance.json 卷先例）。
- N-D3 升档接线（按 N-D1 分辨结论施工·题面全按 001 自己的九题卷·机制骨架复用通用件）：Qualify 准入门程序化（D-24 机位断言+三端回流+在办树断言→机械谓词·不过门=ESCALATED 报警）／Verify CLI（迁移毕回读断言=T7/T8/T9 机械化）／Score CLI+Score Skill 接线（评分 runner 通用骨架可对齐 FADE-011 立法机制·题面判定细则按 001 定制）／runId 显式化（周号即幂等键·一周一 run）／Close Skill 三态判定（通过/RETRY/ESCALATED）／Close CLI 终态门（shift-ade.json 升 run 收口文件写 APPROVED/FROZEN/ESCALATED/RETRY 四态词+登记册台账行·废「push 即终态」——对齐 spec §2.5）。状态机承载面由 N-D1/CTO 结论定（候选=河源 TriRMC 现 cron 位／TriMLC 011 状态机件位·机位断言先活体现探禁推定）。
- N-D4 齿条清账：登记册齿条①「服务器回流复评」（警告线 09-17 已过 49 天未销）随本包一并清；齿条②run↔段索引现场化确认在案。
- N-D5 试跑预案：下个翻周窗（2026-11-09 周日 23:00）跑升档后首个完整十段 run→首评→升完整档（照 FADE-006 升档路径）；试跑前 Qualify 门人工彩排一轮（不动现役 cron job·保自动）。
- 产出：分辨结论正身+冻结卷+接线毕报+登记册升档条（registry owner 落条）。

## 三、验收门（全包毕·STE 独立验证）

1. 包 A 盘点报告落卷且 W40-W44 逐周齐性表全填（缺件逐件有处置账·零静默遗漏）。
2. 包 B W45 标准件齐性断言过（逐件路径+行数证据·照全量读数回报纪律）。
3. 包 C 翻周标准正身落卷且含 CEO 令 2 全部问项答案+checklist；W44→W45 补做实练记录在卷。
4. 包 D N-D1 分辨结论正身落卷（CPO+CTO 双署）；考卷冻结卷双 hash 可验；升档接线毕报含各段载体与退出码；齿条①销账留痕。
5. 全量毕报四项读数（照全量回归读数纪律：毕报含全量读数+既有失败逐族归因）·毕报直达 BOD 面（BOD 转呈 CEO）。

## 四、边界与纪律

- W40-W44 历史记录冻结不改写（盘点只读·挪移=新周标注·原周文件不动）。
- 不动现役 cron job（含 fade011-daily-sweep 保自动·8712 十六 job·河源翻周 job）——本包施工不动任何 daemon 触发面，N-D3 接线只加不改。
- CFO 停工令 14:30-18:00 照行：本任务书 18:00 后拾取即合规；拾取后一次跑完中途不停窗。
- token 值面禁进打印/毕报路径（D-46）；落款一律 date 现查原值（D-47）；共享仓 git 卫生+写后即 commit 锁笔。
- 毕报用语大白话+摘要段（干了什么→结果→候 CEO 决什么）。
