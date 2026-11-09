# node-fsd-s51 · FADE-011 S5.1 plan skill 真身接线节点收口报告

```json
{
  "nodeId": "node-fsd-s51",
  "agent": "FSD",
  "startedAt": "2026-11-03T20:15:44Z",
  "finishedAt": "2026-11-03T20:24:05Z",
  "baselineCommit": "TriMLC@dev d7129a1 (S5 交付态基线·stash 对照基准) + TMV@dev 0e03387e7 (S5.1 brief 正身)",
  "trigger": "CTO 小狄 D-15 派工令（信面落款 2026-11-04T04:15:24+0800·B 件转正承接·UAT APPROVE 同窗）·FSD 接令回执 msg_id 5831c8bb Δ20s·本行 startedAt=接令回执起算",
  "actions": [
    "①立法正身现勘：TriSkill 1fa8a94 全文（tri-fade011-plan v1.0·56 行）——关键定谳=skill 规程载体非自动化引擎·『Phase 2 daemon 段序以代码实现同款不变量·互为规程/实现两面』（接线语义锚）·可达性确认两通道条款+Unknown skill FAIL-EXPECTED 禁替身条款+输出 schema tri-fade011-plan/v1.0 四组键·AGENTS.md 映射行 L24 在位勘实",
    "②实现面现勘：driver.ts plan worker MVP 现形（L157-161·schema 门候件注释）+score/close worker 同形参照（loadXSkill→构造 output→parseSkillOutput 拒则 FadeDriverError→落 reports/x-output.json→writeReport）+skill-loader S3 交付面（loadFadeSkill NOT_FOUND=Unknown 等价面·runtime 永读文件零硬编码副本）+spec §8.3 chain vocabulary 对表+app.ts POST handler try/catch 500 fade_run_failed（fail-visible 闭环·进程不崩）",
    "③skill-loader.ts 扩三包：loadFade011Skills 返回加 plan（cache 构造三包齐载·缺位 NOT_FOUND 即抛=fail-visible）+FadePlanOutput consumer type+resolveTriSkillAgentsMd（skillsRoot→../../AGENTS.md·通道②消费面）",
    "④driver.ts plan worker 真身化：loadPlanSkill 装载→可达性确认两通道（registryPointer=三 SKILL.md existsSync·agentsMapping=AGENTS.md includes('tri-fade011-plan')）→FAIL 即 FadeDriverError('SKILL_REACHABILITY_FAIL') 段失败禁替身→方案卷 plan.md 落树→release.dce_input=sha256(plan.md 内容)（立法放行条件④代码实现）→plan-output.json 构造（freeze.items=[] 如实空/collab daemon-automated 如实声明/unknown_skill_log=[] 如实）→parseSkillOutput 逐键门（拒=PLAN_OUTPUT_INVALID）→落盘+node-plan.md 三包指针记档（run 登记卷通道①载体）·skillsRoot opt 注入点+cache 三包化按 root 失效",
    "⑤测试扩展四件：full chain 加 plan 真身断言（plan-output.json schema 对+dce_input=sha256(plan.md) 读回对表+可达性两通道 true）+负路径 a（plan 包缺→NOT_FOUND 停 PLANNING·零替身产物）+负路径 b（AGENTS.md 缺映射行→SKILL_REACHABILITY_FAIL·拒后不落盘）+负路径 c（毒化 schema 注入 extra_required_gate→PLAN_OUTPUT_INVALID·结构门非橡皮图章实锚）",
    "⑥门禁四条全谱+stash 基线对照+UAT 三树门复跑+零触现役断言（现役 fade.db 三 run APPROVED 读数不变）",
    "⑦TriMLC 79c011f commit 锁笔（3 files 224 insertions 30 deletions）+本报告落树+收口双门"
  ],
  "artifacts": [
    "TriMLC 79c011f: src/fade/skill-loader.ts（三包+FadePlanOutput+resolveTriSkillAgentsMd）",
    "TriMLC 79c011f: src/fade/driver.ts（plan worker 真身化+skillsRoot opt+cache 三包）",
    "TriMLC 79c011f: test/fade-driver.test.ts（full chain 真身断言+负路径三例·8/8）",
    "reports/node-fsd-s51.md（本报告）"
  ],
  "gateResults": [
    {"gate": "门禁①真身装载实锚", "result": "PASS", "detail": "full chain 经真身 plan worker：plan-output.json schema=tri-fade011-plan/v1.0+release.dce_input=sha256(plan.md) 逐字节对表+skill_reachability 两通道 true"},
    {"gate": "门禁②负路径 Unknown FAIL-EXPECTED 禁替身", "result": "PASS", "detail": "负 a：plan 包缺→FadeSkillLoadError NOT_FOUND·run 停 PLANNING·树面零替身产物（plan.md/plan-output.json/node-plan.md 全无）"},
    {"gate": "门禁②负路径 坏输出段失败不静默", "result": "PASS（加码第三例）", "detail": "负 c：毒化 schema 注 extra_required_gate→PLAN_OUTPUT_INVALID（missing-key）拒·plan-output.json 拒后不落盘——结构门非橡皮图章实锚；负 b（加码）：AGENTS.md 缺映射行→SKILL_REACHABILITY_FAIL（可达性确认两通道独立验证）"},
    {"gate": "门禁③全量回归", "result": "PASS", "detail": "fade 全家 87/87 RC=0（11.8s·含 kill-drive 两轮·原 84+S5.1 新增 3）；stash 基线对照=基线 d7129a1 84 全绿 vs 含改动 87 全绿·失败名单行级 diff 零行=零新增铁证"},
    {"gate": "门禁④UAT 三树门复跑", "result": "PASS", "detail": "fade011-uat-01/02/03 node_report_check RC=0×3（历史树产物不因接线失门）"},
    {"gate": "纪律·零触现役", "result": "PASS", "detail": "测试全在独立 tmp DATA_DIR/fake skillsRoot（mkdtemp 三层结构·AGENTS.md 隔离在内）；现役 fade.db 三 run APPROVED 读数不变；现役 8713 未触"},
    {"gate": "编译面", "result": "PASS", "detail": "tsc 零错（两轮 build 全绿）"}
  ]
}
```

## 实现方案

B 件转正承接：plan worker 从程序化 MVP 换 tri-fade011-plan v1.0 真身装载——与 score/close **完全同形**（loadXSkill→output 构造→parseSkillOutput 拒则 FadeDriverError→落盘→报告），S5 预留 worker 注入点兑现·零架构变更。

**接线语义定谳（立法边界条款应用）**：立法明定 skill=规程载体非自动化引擎·「daemon 段序以代码实现同款不变量」。落法三件：①结构门同形（runtime 读 SKILL.md schema fence 逐键校验·单一装载通道零内嵌副本）；②可达性确认两通道代码化（run 登记卷三包指针=三 SKILL.md existsSync+node-plan.md 报告记档·AGENTS.md 映射行=文本 includes 检查——FAIL 即段失败·禁替身不回退 MVP）；③DCE 输入声明=方案卷 sha256 内容 hash（放行条件④·非 git 对象 hash·读回逐字节对表测试锚）。

**值面如实原则**：plan-output.json 的 freeze.items=[]（程序化驱动面零五件卷冻结）/collab 三键=daemon-automated 如实声明（不造席间协铸假象）/unknown_skill_log=[]（无事件）——不编造协同事实，extra keys 不拒（协议管不变量实例管载体）。

## 异常与处置

1. **负路径断言两败（测试抓获即修）**：FadeDriverError 构造=（code, message）分离·code 在 err.code 属性不进 message——测试正则 match(/SKILL_REACHABILITY_FAIL/) 对 message 落空。处置=断言改 err.code 属性断言+message 只对实际含面（agents_md_mapping=false/extra_required_gate）。**行为本身两例全对**（错误类型/停位/零落盘全按设计）——纯断言写法勘正。
2. **fake root 隔离陷阱（设计时规避）**：resolveTriSkillAgentsMd(root)=root/../../AGENTS.md——mkdtemp 顶层 root 会指 tmpdir 全局（隔离破+污染）。规避=fake root 建三层结构 `<tmp>/skills/engineering`→AGENTS.md=`<tmp>/AGENTS.md` 隔离在 tmp 内。

## 断点交接

- TriMLC 79c011f（dev·3 files 224+/30-）·fade 全家 87 用例全绿·现役 8713 零触（daemon 未重启·仍跑 UAT 态 pid 32876）。
- **现役栈加载面注记**：本次接线落 TriMLC dev 检出+dist 已 build（tsc 零错）——现役 daemon pid 32876 加载面=UAT 时的 dist（**不含 S5.1 件**）。S5.1 属接线验证面（测试实例全谱验证）；现役栈是否随重启加载 S5.1 候 CTO 验收后定（同 UAT 先例：验收过→受控重启窗加载）。
- 技术债①（plan skill 候件）**销项**：正身接线完成——五债余四（门拒重试通道/event-watch/python env knob sg 移植/pushurl 候批）。
- 后续立窗前置就绪：event-watch 自动触发工程候 COS 肯后立窗（接线毕=前置兑现）。

## 自测结果

- 门禁四条全过（读数见 gateResults 七条·含加码例）。
- fade-driver.test.ts 8/8（full chain+绕闸防御+resume+metaFromCheckpoint+幂等+S5.1 负路径三例）·fade 全家十文件 87/87 RC=0。
- stash 基线对照：d7129a1 基线 84 全绿 vs 含改动 87 全绿——零失败·零归因差异。
- UAT 三树门复跑 RC=0×3；现役 fade.db 三 run APPROVED 不变（零触实证）。

## 技术债务标记

1. **dist 加载面现役滞后**（如实）：现役 daemon 仍跑 UAT 态 dist（不含 S5.1）——候 CTO 验收后受控重启窗加载·本单不擅动现役栈。
2. **plan skill 值面 daemon-automated 声明**（非债·设计取舍留痕）：collab/freeze 面程序化声明=如实形——若未来 daemon 驱动面要求真席间协同（COS 协铸/COO 协定），属架构级扩展候 CTO 面·不入本单。
3. 承袭四债不变：门拒重试通道（候 automation-backlog 终裁）/event-watch（候 COS 肯立窗）/python env knob sg 移植/TriMLC pushurl 候批。

## 使用依据

- S5.1 brief 正身：`docs/workflow/operating-records/2026-W45/trees/fade011-s51-plan-wiring/brief.md`（TMV 0e03387e7）
- 立法正身：TriSkill 1fa8a94（tri-fade011-plan v1.0·SKILL.md 56 行·AGENTS.md L24 映射行）+BOD 复核 a9e6852 PASS
- 法条：fade-protocol-spec §8.3（chain vocabulary）/§2.7（结构门）/§6.1 L349+§7.4 L415（skill 结构化输出）
- 同形参照：S3 skill-loader 交付面+score/close worker 现役接法（TriMLC d7129a1）
- 纪律：D-65 写码自查（R2.1 耗时上界：plan worker=进程内 ms 级 IO·不增链上界）/D-46 键查询计数形（UAT 教训同束·本单零值面回显）/D-47 时戳铁则（卷面=commit 时戳代·信面=写前现查粘贴）
