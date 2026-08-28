# node-V1 收口报告（fade-tutorial-001-deep · tick 20260828T193147Z）

```json
{
  "nodeId": "V1",
  "agent": "TestEngineer",
  "startedAt": "2026-08-28T19:31:47Z",
  "finishedAt": "2026-08-28T20:30:13Z",
  "baselineCommit": "8abbc24b041729dae893fcc28cd44feea5318028",
  "trigger": "hook/tick 20260828T193147Z",
  "actions": [
    { "time": "2026-08-28T19:31:47Z", "action": "接单开工（tick 锚）：通读被核验教程 /srv/fleet/TriCompany/docs/training/fade-001-maintenance-deep-dive.md 全文 428 行，确认结构完整（〇/一/二/三/四/五/六/使用依据共 8 个二级章节+待核验清单）" },
    { "time": "2026-08-28T20:45:00Z(约)", "action": "亲读被引真源 9 件：registry FADE-001 条目 L24-67／paper-① 全卷／paper-② 全卷／protocol-spec 被引区段（L60-199+L200-314）／daily_progress_patrol.py 全文 952 行／W35 daily-progress.md 全文 63 行／f7spec §6.4+§七（L95-129）／fade-pipeline-design §九§十（L100-157）／engineering-disciplines D-02..D-04（L18-50）；Glob 确认姊妹篇 fade-001-deep-dive.md 存在" },
    { "time": "2026-08-28T21:30:00Z(约)", "action": "file:line 逐条比对（8 个被引文件全部短名:行号引用逐一亲读被引行）：内容相符项全数确认；产出 5 处 progress 行号 +1 漂移（A1-A5）与 3 处表述精度观察项（B1-B3），零内容失真" },
    { "time": "2026-08-28T22:10:00Z(约)", "action": "hash 语境比对：21 枚 commit hash 引用语境逐条对照编排层机械门转录（git log -1 实测 subject，2026-08-28T20:2xZ），归属仓与 subject 语境全部相符；非 hash 令牌性质核对——d0f87756/1993028566bc=job UUID 两段（教程 L54/L257/L376 均标「job」）、82e34df7=扩维卷双 hash 前 8 位（教程 L211/L415 标「双 hash」，全串与 registry L64 逐字一致），均无冒充 commit 引用" },
    { "time": "2026-08-28T22:40:00Z(约)", "action": "评分数字六源对照：90/100（registry L62）、threshold 80（paper-① L5）、total_min 90（paper-② L82+patrol L69）、部署日 65/80（registry L65+progress L24+6d42612 subject）、E-3 及格 85（f7spec L113+progress L21/L22+67cbdecb subject）、T2 780s=600+180（patrol L64-66+paper-② L29）；数学自洽复核：SCORE_WEIGHTS 六项和=80、加 SCORE_SKILL_EXTERNAL 20=100=weights_total，『CLI 满分也到不了 90』论断成立" },
    { "time": "2026-08-28T23:10:00Z(约)", "action": "W1 待核验 4 项逐项 disposition（第④项辅助 hash 13 枚经编排层机械门全证实=可销账；①②③留痕）+口径差呈现核对（registry L51 合写口径 vs patrol L14-17 服务器实现，教程两侧原文如实）" },
    { "time": "2026-08-29T00:40:00Z(约)", "action": "撰写本核验报告（本文件，占位注释行整体替换）" },
    { "time": null, "action": "本报告入库 commit——编排层收账（finishedAt 估注请按入库时戳校正）" }
  ],
  "artifacts": [
    { "path": "/srv/fleet/TriCompany/docs/training/fade-001-maintenance-deep-dive.md", "lines": 428, "note": "被核验对象（TriCompany 工作树未入库态，入库留 C1）；行数=编排层机械门实测，本会话亲读末行 428 复核一致" },
    { "path": "/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W35/trees/fade-tutorial-001-deep/reports/node-V1.md", "note": "本核验报告本体；占位注释行已整体替换" }
  ],
  "gateResults": [
    { "gate": "①file:line 比对（教程全部短名:行号引用 vs 现行文件）", "result": "PASS", "evidence": "8 个被引文件全部亲读：registry（条目界 L24-67、范围扩维 L26、①表 L28-36、②表 L45-57、两阶段/重建锚 L59-60、补齐项 L61、首评 90/100 L62、扩维档位 L63、扩维卷双 hash L64 全串逐字、Score CLI 五约束+65/80 L65、Close 双段立法 L66、齿条 L67）；paper-②（freeze L6-11/载体定版同盘 L8/_fadehash L8-9、scoreable_run L12、phases L13-16 引文逐字、T1-T8 L17-78 含 T2 780 L29/boundary L31/T3 L33-40/双席抽验 L36-37/GitHub 容差 24h L52-54/T7 D-02 nextRun L67、weights_total 100 L79、threshold total_min 90 L82/note L83 逐字、transfer_domain L85-88、honesty L89）；paper-①（threshold 80 L5）；spec（十段 L63-77、双门槛 L89/L183、Close Skill L91、§2.5 L168-174 含 L173 逐字、§2.6 L187-193、§2.8 L225-266 含原则 L227/十段合同 L240-249 逐行/细则 9 L265/细则 10 L266、反模式 L301）；patrol 952 行（docstring L2-36 含 L9-10/L14-17/L17/L22-24/L26-28、常量 L61-70 逐行、身份 L57-58、L95-98/L97 前缀 regex、L101-104、L119、L133-145、commits_since L177-208 含缺陷 docstring L180-181 逐字/核心行 L186、L211-230、build_increment L246-258、build_day_section L261-278/文件头 L267-271、verify 四查 L288-290/291-294/295-296/297-298、rollback L430-436、patrol_once L352-466 全序列分点、五约束 L469-474、T1 L489-507、T2 L511-514/L541-542、T5 L557-573、PATROL_MSG_RE L576-579、run_score L603-668 全字段分点 L651/L658-661/L664、Case H L775-778/Case I L784-802 含 L786-787/L801/L802、argparse L909-926/L922/L925）；progress L4/L18/L19/L20/L21/L22/L24 逐行吻合；f7spec（L98-109/L111/L112/L113 五硬门+85/L114/L115/L118-129）；pipeline（§十 L110-115/node-report-check L115、§九 L117-157）；disciplines（D-02 L23-25/口诀 L25、D-03 v2 L31/v3 L33 逐字、D-04 L39-46/双轨 L43-46）——引文与教程转述逐字/逐义相符；仅 5 处 progress 行号 +1 漂移（引文在 +1 位逐字命中，A1-A5 见核验明细二）+3 处精度观察项（B1-B3），均非内容失真" },
    { "gate": "②commit hash 归属与语境（依编排层机械门）", "result": "PASS", "evidence": "编排层机械门（git log -1 实测转录，2026-08-28T20:2xZ）21 枚全部证实存在，仓归属与 subject 语境逐条相符：三跳主链 2014ef40/c9300421/8ad1ab4a=TM 进度提交、3082d7d=TC 拓扑门限修复、fbadf21/bfad13f=TC patrol v1.0、50b3024a=TM 活体标本（subject 与 patrol L444-446 模板逐字同构、与 progress 03:40 块一致）、辅助 13 枚（ea64927/49287fc/d0cb4d9/6d42612/83753b74/17a4af84/cea46cdb/c9770a36/caeec035/1fac24e1/a9c6a143/67cbdecb/2a6af9d）subject 与教程转述逐条相符；教程 L5/L425 互斥归属声明与机械门一致；d0f87756-e941-4984-9919-1993028566bc（cron job UUID）与 82e34df7（扩维卷 sha256 前 8 位）均被教程正确标注性质，无冒充 commit 引用" },
    { "gate": "③评分数字对照", "result": "PASS", "evidence": "90/100=registry L62 原文（2026-08-20 首评 PASS 90/100）；80=paper-① L5 原文；90=paper-② L82 total_min+patrol L69 SCORE_THRESHOLD 双源一致；65/80=registry L65 原文+progress L24+6d42612 subject 三源一致；85=f7spec L113 原文+progress L21/L22+67cbdecb subject 三源一致；780s=600+180=patrol L64-66 表达式+paper-② L29；权重数学自洽（SCORE_WEIGHTS 和=80 与 patrol L67 注一致；+SCORE_SKILL_EXTERNAL T3/T7 各 10=100=paper-② L79 weights_total；『CLI 满分也到不了 90，必须等 Score Skill 补足』论断成立）" },
    { "gate": "④深度 wc -l ≥400", "result": "PASS", "evidence": "编排层机械门实测 428 行 ≥400；本会话亲读全文复核：末行 428、8 个二级章节+使用依据+待核验清单齐备，结构完整" },
    { "gate": "⑤W1 待核验 4 项 disposition", "result": "PASS", "evidence": "①自测 21/21 与 30/30：运行复现超出本会话（无 Bash），编排层机械门 commit subject 提供独立第二来源（fbadf21 自测 19/19→bfad13f 自测 21 检查=两 commit 合成与 progress L18 归属一致；6d42612 subject 自测 30/30），维持『文本记录+subject 佐证、未实跑复现』标注；②20:30:06/6 秒闭环：超出本会话可验证范围（cron 日志 /var/lib/trimc/cron/logs/ 服务器侧不可达），progress L19 与 f7spec L128 marker 行互洽，时值留痕不可独立复核；③活体标本长 hash：短 hash 50b3024a+subject 经机械门证实且与模板/补写块一致，40 位长串后 32 位无 git 不可复核，维持『沿编排层开工实测』标注；④辅助 hash 13 枚：全部机械证实（subject 逐条相符）——该项可销账升级为『已核验』（逐项详见核验明细三）" },
    { "gate": "⑥口径差呈现（registry L51 vs patrol L14-17）", "result": "PASS", "evidence": "教程 L90 两侧原文均如实呈现：registry L51 原文『确定性收集（ledger-mirror+当日 commits→粗粒度三节）』逐字在卷；patrol L14-17 原文『ledger-mirror 为机器本地不入仓（TriMetaverse .gitignore .fade/），服务器巡检不可读——故门限仅用 git commits…均为确定性收集，无 LLM』逐字在卷；教程结论『registry 该行是设计注册时的合写口径，服务器侧以 patrol 实现为准，修订权在 registry 侧』为如实转述，呈现不失真" },
    { "gate": "finishedAt 真实性", "result": "需编排层复核", "evidence": "本实例无 Bash/时钟工具，startedAt=编排层 tick 锚，finishedAt 为估计值（格式合规 UTC Z），请编排层收账时按入库 commit 时戳校正" }
  ]
}
```

## 核验明细一：file:line 比对全数相符项（按被引文件归组）

- **registry**（/srv/fleet/TriCompany/docs/engineering/fade-registry.md）：条目界 L24-67、范围扩维 L26、①十段表 L28-36、②十段表 L45-57、L47（事件驱动主+巡检兜底）、L48（日期锚/去重/三端）、L49（拓扑门限+mtime 删裁原文逐字）、L50（三节结构）、L51（DCE 合写口径）、L52-L57 逐行、L59-L60（两阶段/23h→10min/重建验收原文逐字）、L61、L62（90/100）、L63（ea64927/49287fc）、L64（双 hash 82e34df7…24153 全串逐字）、L65（五约束+65/80+83753b74 regime 边界）、L66（Close 双段立法/时序链）、L67——教程全部 registry 引用逐行相符。
- **paper-②**（FADE-001-paper-maintenance.json）：freeze L6-11（载体定版同盘 L8、_fadehash 双 hash 不入卷 L8-9）、scoreable_run L12、phases L13-16（shadow_first_score/gate_wiring 教程引文逐字）、T1-T8 L17-78（T2 780s L29、部署日 boundary L31、T3 L33-40 含双席抽验 L36-37、T5 GitHub 容差 24h L52-54、T7 D-02 nextRun L67）、weights_total 100 L79、threshold L80-84（total_min 90 L82、note『定值=对齐①迁移域 90 分档位带』L83 逐字）、transfer_domain L85-88、honesty L89——全部相符。
- **paper-①**（FADE-001-paper.json）：threshold 80 在 L5——相符。
- **spec**（fade-protocol-spec.md）：生命周期十段 L63-77、双门槛 L89/L183、Close Skill 最后语义判断者 L91、§2.5 终态门 L168-174（L173『Close Skill 之前的 CLI 不能提交不可逆终态』逐字）、§2.6 试卷 Plan 时点冻结 L187-193、§2.8 段合同 L225-266（原则『协议管不变量，实例管载体』L227、十段合同 L240-249 逐行、细则 9 L265、细则 10 L266）、反模式『CLI 包含 LLM 推理』L301——全部相符。
- **patrol**（/srv/fleet/TriCompany/runtime/cognition/daily_progress_patrol.py，952 行）：docstring L2-36（L9-10 禁 3.10+ 语法、L14-17 ledger-mirror 机器本地不入仓、L17 确定性无 LLM、L22-24 recovery push、L26-28 审计等效载体）、L31-33 用法、退出码 L35、身份常量 L57-58、Score 常量 L61-70 逐行（600/180/780/权重/external/threshold/scan cap）、L72-74 仓路径、now_cn L80-82、day_section_index L95-98（L97 前缀 regex）、git_env L101-104、run_git 默认 90s L107、pull 重试 L119-130、file_last_touch L133-145、recent_commits L148、commits_since L177-208（缺陷 docstring L180-181 逐字、核心行 L186）、registry_snapshot L211-230、build_increment L246-258（清单上限 L252-256）、build_day_section L261-278（文件头 L267-271）、verify 四查 L288-290/291-294/295-296/297-298、commit 内联身份 L308-309、push 120s L316、check_time L341/L652、patrol_once L352-466 全序列分点（L362-370/L369-370/L372-379/L386/L389/L394-395/L406-412/L420-428/L430-436/L438-442/L444-451/L453-458/L460-464）、五约束注释 L469-474（约束 1 L470/约束 4 L473）、T1 L489-507、T2 基线 L511-514/违例判定 L541-542、T5 L557-573、PATROL_MSG_RE L576-579、run_score L603-668（L604/L612-614/L645-647/L627/L642/L658-661/L664 分点逐行）、自测 Case H L775-778/Case I L784-802（同秒日期 L786-787、I1 L801、I2 L802）、argparse L909-926（--max-commits 15 L922、--score-ends 默认 sg-server,origin L925）——全部相符；另核实教程 L218 论断『现行代码里没有任何一处读取评分结果来决定 push 与否』为真（patrol_once 的 push 调用均不以评分结果为条件）。
- **progress**（/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W35/daily-progress.md，63 行）：L4（三端）、L18（21/21+job UUID 全串+*/10+runAs fleet+nextRun 20:10）、L19（三跳弧线引文逐字+『本销账行即事件驱动主第二次执行』逐字+『误标节容错识别』）、L20（D-02 四 job nextRun 逐位不变+dist 崩循环 21:08-21:11）、L21（试卷草案双门槛建议 85）、L22（67cbdecb 五要素逐字）、L24（TCO d0cb4d9+6d42612/65/80/自测 30/30/T2 基线规则校准）——L18-24 全部逐行吻合；L41+ 补写块区段存在 +1 漂移，见核验明细二。
- **f7spec**（/srv/fleet/TriMetaverse/docs/execution/fade-007-context-reservoir-spec.md）：L98-109 诚实档位表、L111 统计 1/6/4、L112（daily-progress 建档 17a4af84/第六源 83753b74）、L113 升完整五硬门+总分 ≥85、L114 组织者利益声明、L115 一具两段、L103 E-3 Plan 时点冻结、L118-129 运行日志——全部相符。
- **pipeline**（/srv/fleet/TriMetaverse/docs/execution/2026-08-26/fade-pipeline-design.md）：§十工具合同 L110-115（node-report-check 九键 L115）、§九卷封制 L117-157——相符（该文件 §十排在 §九 之前的版式为文件自身现状，教程行号引用无误）。
- **disciplines**（/srv/fleet/TriCompany/docs/workflow/engineering-disciplines.md）：D-02 L23-25（诊断口诀 L25 逐字）、D-03 v2 L31、D-03 v3 L33（『旧进程内存存活会长期掩盖潜伏损坏』逐字）、D-04 v2-v4 L39-46（v4 双轨 L43-46）——全部相符。
- **姊妹篇**：/srv/fleet/TriCompany/docs/training/fade-001-deep-dive.md 存在性经 Glob 实测确认。

## 核验明细二：偏差逐条清单（全部非阻塞；实质性错误=0）

按任务书「行号漂移=错误」口径，记漂移类偏差 5 处（A1-A5，涉及 6 个行号区间）+表述精度观察项 3 处（B1-B3）；零内容失真类错误。

| 编号 | 教程行号 | 偏差内容 | 实证（现行文件实测） |
| --- | --- | --- | --- |
| A1 | L157 | progress:42 指向 83753b74 条目 | 现行 progress L42=补写行（仅含 17a4af84，不含 83753b74）；83753b74 条目在 L43 |
| A2 | L162 | progress:41-42 指 20:10 补写块原文 | 现行块在 L42-L43（引文文字逐字命中于 +1 位） |
| A3 | L183 | progress:44-45 指 20:30 补写块原文 | 现行块在 L45-L46（cea46cdb/8ad1ab4a 逐字命中） |
| A4 | L336 | progress:53-54 指 03:40 补写块 | 现行块在 L54-L55（1fac24e1/a9c6a143 逐字命中） |
| A5 | L420 | 使用依据『补写块原文（L41-46）』『08-29 跨日节（L47-55）』 | 现行=L42-L46；08-29 节起于 L48（教程写作后 03:50/04:10 两次 append 已使该节延至 L63） |

漂移成因注记：教程对 progress 的 L4/L18-L24 引用与现行文件逐行吻合，偏移仅现于 L41+ 区段——推测 W1 写作基线（50b3024a）之后 progress 中段存在一次行级变动；本会话无 git log 工具，无法定位确切成因 commit。教程头部 L7 已声明『行号对应当前读到的版本，后续版本行号可能漂移，以文件为准』、L413 声明『行号为开工时版本』，且全部引文在 +1 位逐字命中——定性为活文件漂移类非阻塞偏差，不构成打回 W1 重写事由；处置建议：C1 通过后由 W1 侧或编排层将 A1-A5 五处 progress 行号 +1 修正，或维持漂移声明、由读者按教程自带的学习路径第 5 步交叉复核。

| 编号 | 教程行号 | 观察项 | 实证 |
| --- | --- | --- | --- |
| B1 | L64 | 『patrol:97 注释原文』：L97 为实现行（日期前缀 regex），对应注释/docstring 在 L96 | patrol L96-L97 亲读；教程 L168 同点位引用指 regex 行成立，实质不受影响 |
| B2 | L228 | 『三模式（--sync/--self-test/--score，patrol:31-33/909-947）』：L31-33 docstring 用法仅列 dry-run/--sync/--self-test，--score 在 L923 | 合引 L909-947 可完整支撑论断；单看 L31-33 不含 --score |
| B3 | L213 | progress:24 引文『剩余=shadow 首评→gate 接线→扩评达标』省略原文括注『（下个自然日）』与尾段『→登记册三方备案升完整』 | 语义无损的节引；progress L24 原文在案 |

## 核验明细三：W1 待核验四项 disposition

1. **①自测 21/21（progress:18）与 30/30（progress:24）——留痕+第二来源佐证**：本会话无 Bash 不能复跑 --self-test；编排层机械门 commit subject 提供独立于 progress 文本的佐证（fbadf21『内置自测 19/19』→bfad13f『自测 21 检查』，两 commit 合成与 progress L18 对 fbadf21/bfad13f 联合标注 21/21 的归属一致；6d42612 subject『自测 30/30』与 progress L24 一致）。维持『文本记录、未实跑复现』标注，不算错误。
2. **②20:30:06 检出与 6 秒闭环（progress:19）——超出本会话可验证范围**：cron 日志在 /var/lib/trimc/cron/logs/（服务器侧，本会话无访问面）；progress L19 销账行与 f7spec L128『本行兼作巡检门限核验 marker』互洽，6 秒时值无法独立复核，如实留痕，不算错误。
3. **③活体标本长 hash 50b3024a2c07…c6——部分核实**：短 hash 50b3024a 与 subject 经编排层机械门证实、与 patrol L444-L446 提交消息模板逐字同构、与 progress 03:40 补写块一致；40 位长串后 32 位本会话无 git 工具不可复核，维持『沿编排层开工实测』标注，不算错误。
4. **④辅助 hash 13 枚——已核实（可销账）**：ea64927/49287fc/2a6af9d/83753b74/17a4af84/cea46cdb/c9770a36/caeec035/1fac24e1/a9c6a143/67cbdecb/d0cb4d9/6d42612 全部经编排层机械门证实存在，subject 与教程引用语境逐条相符（含 d0cb4d9 subject 内嵌『双 hash raw=lf=82e34df7…24153』与教程 L211/registry L64 逐字一致）。W1 该项可由『未逐一机械预检』升级为『已机械核验』。

## 异常与处置

1. **工具面约束**：本实例仅 Read/Glob/Edit、无 Bash——git log 存在性与 subject 验证由编排层机械门代跑（转录于任务书附表，2026-08-28T20:2xZ），本会话全部 hash 结论引用该机械门并逐处注明；行号/引文/数字/内部一致性比对由本实例亲读完成，未伪称任何机械验证。
2. **偏差发现与定性**：共 8 项（A1-A5 漂移+B1-B3 精度观察），全部非阻塞、零内容失真、零实质性错误；属教程头部已预声明的活文件行号漂移风险，处置建议见核验明细二，不构成打回 W1 重写事由。
3. **时间戳纪律**：finishedAt 为估注（无现查手段），已在 gateResults 单列『需编排层复核』，未伪称实测。
4. **归属路由与写入边界**：本报告为测试工程/事实核验产出，落本树 reports/ 目录；除本文件占位锚替换外未改动任何文件（教程、真源、registry、patrol、progress 均未触碰），未执行 git 操作。

## 断点交接

V1 核验已收口：五项核验+口径差呈现全部 PASS，实质性错误 0；A1-A5 五处 progress 行号漂移留待 C1 裁定（+1 修正或接受教程漂移声明），W1 待核验第④项可销账升级为已核验（①②③维持留痕标注）。接续者（C1/编排层）需知：①若采纳行号修正，教程 L157/L162/L183/L336/L420 五处 progress 引用各 +1，改完建议重跑 node-report-check 并抽查；②教程入库（TriCompany 仓）由编排层执行；入库后 progress 仍会持续 append，行号漂移将随版本继续累积——中期可考虑教程改用『节锚+引文摘录』替代裸行号或标注引用基线 commit；③本报告 finishedAt 请按入库 commit 时戳校正。

## 使用依据

- 被核验对象：/srv/fleet/TriCompany/docs/training/fade-001-maintenance-deep-dive.md（428 行全文亲读）。
- 行号/引文比对真源（全部本会话亲读）：/srv/fleet/TriCompany/docs/engineering/fade-registry.md（L1-100）；/srv/fleet/TriCompany/docs/engineering/fade-papers/FADE-001-paper.json、/srv/fleet/TriCompany/docs/engineering/fade-papers/FADE-001-paper-maintenance.json（全卷）；/srv/fleet/TriCompany/docs/engineering/fade-protocol-spec.md（L60-199、L200-314）；/srv/fleet/TriCompany/runtime/cognition/daily_progress_patrol.py（952 行全文）；/srv/fleet/TriCompany/docs/workflow/engineering-disciplines.md（L18-52）；/srv/fleet/TriMetaverse/docs/workflow/operating-records/2026-W35/daily-progress.md（63 行全文）；/srv/fleet/TriMetaverse/docs/execution/fade-007-context-reservoir-spec.md（L95-134）；/srv/fleet/TriMetaverse/docs/execution/2026-08-26/fade-pipeline-design.md（L100-157）。
- hash 存在性与 subject 真值：编排层机械门 git log -1 实测转录（任务书附表，2026-08-28T20:2xZ；21 枚含两仓互斥不存在项）。
- 姊妹篇存在性：Glob /srv/fleet/TriCompany/docs/training/fade-001-*.md 实测两文件在册。
- 格式契约：spec §2.7 节点收口报告十字段/结构化核心九键（fade-protocol-spec.md L195-223）；同树 node-W1.md 的九键与散文节先例。

## 编排层机械门回填（tick 20260828T193147Z 收账转录）

- **翻转前置门**：`python3.8 scripts/fade/node-report-check.py --tree-dir <本树> --node V1` → `[OK] node-V1: ok / RESULT: PASS (1/1)`，exit 0。
- **编排抽查**：A1 漂移项亲读复核吻合（progress 现行 L42=20:10 补写行仅含 17a4af84、83753b74 在 L43，与核验明细二 A1 行逐字一致）；registry L62「PASS 90/100」与教程引用相符（编排层开工时 grep 实测在卷）。
- **finishedAt 校正**：估注 2026-08-29T00:40:00Z→实测收账 2026-08-28T20:30:13Z（编排层 date -u，见 json 核心块；子实例无时钟工具如实估注在案）。
- **合稿事实（核验对象演变，C1 裁定输入）**：本会话 V1 核验进行期间，并行治理线（总助本地 C1 职能，董事会归一裁定 a+备份令）已将本教程 428 行全文并入合稿 **fade-001-maintenance-deep-dive.md 788 行 @ TriCompany bare 190212a**（2026-08-29T04:29:42+08 push /srv/git/TriCompany.git；卷首互补对照表+第一部分本地全景篇 324 行+第二部分 sg 纵深篇 428 行）。编排层保全验证：bare 对象 `git grep` 特征锚两处逐字命中（L365 授课行含 40 位基线 hash 50b3024a2c07…c6、L366 hash 归属声明行）+ 总行数 788 与「324+428+卷首」算术吻合；逐行 diff 未执行（避免 788 行转储），拼接边界 ±1 行级差异不排除。**即：本报告核验的 428 行正文以全文保全形态进入权威合稿，A1-A5 行号漂移随文转移至合稿第二部分，处置权随载体归属并行线，建议=接受漂移声明+中期改节锚（见断点交接②）。**
- **工作树散稿处置**：编排层在保全验证成立后移除本机 TriCompany 工作树 untracked 散稿（428 行），避免合稿随 patrol pull 同步本机检出时被 untracked 冲突阻塞；留档三重=190212a 合稿全文+并行线备份令（.fade/hub-snapshots/ md5 ba2368ec，在其侧）+本仓 W1/V1 报告与 commit 链记述。
