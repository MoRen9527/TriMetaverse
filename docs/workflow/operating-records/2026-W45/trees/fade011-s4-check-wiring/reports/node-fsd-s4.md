# 节点收口报告 S4（FADE-011 工序 4·T6 校验器编排层接线·零新写只接线）

```json
{
  "nodeId": "node-fsd-s4",
  "agent": "FSD",
  "startedAt": "2026-11-03T19:06:58Z",
  "finishedAt": "2026-11-03T19:14:53Z",
  "baselineCommit": "TriMLC@dev 4573eba（施工前 HEAD·S3 交付件·commit 时戳 2026-11-04 02:58:28+0800 现查原值）",
  "trigger": "manual（CTO D-15 派工令落款 2026-11-04T03:06:13+0800 原值·S4 brief bf272815a@TMV 本树 brief.md·FSD 接令回执 2026-11-04T03:06:58+0800 Δ45s·本树 dispatch-intake.jsonl d15-intake-ack-s4 行·03:06 轮 S3 验收同窗派工）",
  "actions": [
    {"t": "in-window#1", "act": "接令回执六步施工序承诺（dispatch-intake.jsonl d15-intake-ack-s4·Δ45s·D-65 预注收讫：spawn 壳=CLI 消费面族三五查+R2.1+R4.3）+校验器 CLI 合同现勘（node_report_check.py 退出码 0/1/2 全谱——RC≠0 含用法错 2 一律 fail-closed）", "commit": "—"},
    {"t": "in-window#2", "act": "S1 收口翻转位现勘接线位定谳：state-machine 收口段=CLOSING→FINALIZING→terminal（finalize actor·§8.3 L478）+store advanceRun 事务面（BEGIN IMMEDIATE+assertTransition+audit 行原子）——门组合正形=「to terminal 前置门+门过才 advanceRun」·law table 边检前置（注定败的翻转不烧校验器跑）", "commit": "—"},
    {"t": "in-window#3", "act": "src/fade/closing-gate.ts 落卷：resolveTmvRepoRoot（**TMV_REPO_ROOT env 优先→dev 兄弟仓探测默认·绝对路径零硬编码**·D-24 sg 机 /srv/fleet/ 可移植）+resolvePythonExecutable（TRILC_FADE_PYTHON env→文档化默认 \"python\"·解释器解析显式化零 PATH 探测魔法）+spawnWithTimeout（argv 数组零 shell+windowsHide+R2.1 显式超时上界默认 30s 到点 kill）+runClosingGate（RC=0 放行；**任何非 0 结果 fail-closed=拒翻转**：RC≠0 含用法错 2/spawn ENOENT/超时三 fail 面）+finalizeWithGate（§2.7 机械执行：门过→advanceRun actor=finalize·门败→recordGateRejection 落明细+gated:false 状态不动）·校验器=**TMV 015bab659 现役件零新写**（live 直调·零副本）", "commit": "TriMLC 1606734"},
    {"t": "in-window#4", "act": "store.ts 扩展落卷（**纯新增·S1 冻结 schema 零触碰**）：fade_gate_rejections 表（id/run_id/gate/reason/detail/created_at）+recordGateRejection/listGateRejections 两方法——拒翻转失败明细落卷面（fail-closed 可见性非静默）", "commit": "TriMLC 1606734"},
    {"t": "in-window#5", "act": "test/fade-closing-gate.test.ts 16 用例落卷：resolver 显式性 4（override trim/env 胜默认/解释器三源序/dev 默认真身校验器在位）+spawnWithTimeout 2（真 python sleep 5s vs 500ms 上界→timedOut kill 实锚+ENOENT 显面不挂起）+runClosingGate 5（PASS fixture 真跑门 RC=0 放行/缺键 FAIL fixture→checker-fail exit 1+明细/校验器件缺失→spawn-error/坏解释器→spawn-error/真身冒烟=S3 树 reports/ 现役 PASS 面 skip 形）+finalizeWithGate 5（门过翻转落地 actor=finalize 审计行/门败拒翻转=状态不动+零新审计行+rejection 行落卷断言/spawn-error fail-closed+落卷/非终态目标门前置拒/未知 run 拒）", "commit": "TriMLC 1606734"},
    {"t": "in-window#6", "act": "首跑 15/16 两处即修（自测链抓获·实现面一型错一测试面一套层错）：①tsc TS2322 exitCode number|null→?? undefined（spawn code null 面收口）②dev 默认根断言多套一层 TriMetaverse/——resolveTmvRepoRoot 语义=仓根本身（resolve(scriptDir,../../..,TriMetaverse)）非工作区根·测试断言改 join(root,\"scripts\",...) 对表实现语义——修后 16/16 RC=0+tsc 零错", "commit": "TriMLC 1606734"},
    {"t": "in-window#7", "act": "全量回归+stash 基线对照（触现役 store.ts→钦定标准形态）：fade 全家七件 62/62 RC=0（S1 两件+S2 三件+S3 一件+S4 一件·前序件零回归）·全量 776/770/6 既有四族同谱——基线（stash store.ts）776/768/8：多败=gate 三子测+finalizeWithGate 套件聚合（**store 方法 stash 后接线依赖缺失自然败——恰证拒翻转路径真被测试触达**）·既有四族名单两卷全在·含改动侧零新增（notify 两行=replay-flow 既有族行级显隐噪声·行级账闭环）·tsc 复验 RC=0+TriMLC commit 锁笔（三件 575 行）+本报告落树", "commit": "TriMLC 1606734 + 本报告 commit"}
  ],
  "actionsTimeNote": "动作#1-7 序贯执行于 startedAt–finishedAt 时窗内·宁缺勿造用时窗序号形；finishedAt=报告落笔前 date 现查原值 2026-11-03T19:14:53Z",
  "artifacts": [
    {"path": "TriMLC:src/fade/closing-gate.ts", "note": "编排层收口复跑门（live 校验器直调零新写·路径配置化 TMV_REPO_ROOT·解释器显式化·R2.1 超时·三 fail 面 fail-closed·finalizeWithGate 机械执行组合）（TriMLC 1606734）"},
    {"path": "TriMLC:src/fade/store.ts", "note": "拒翻转明细落卷面：fade_gate_rejections 表+recordGateRejection/listGateRejections（纯新增·S1 冻结面零触碰）（TriMLC 1606734）"},
    {"path": "TriMLC:test/fade-closing-gate.test.ts", "note": "16 用例：resolver 显式性+spawnWithTimeout R2.1+runClosingGate 真跑/负路径/spawn-error+真身冒烟+finalizeWithGate 机械执行全谱（TriMLC 1606734）"},
    {"path": "docs/workflow/operating-records/2026-W45/trees/fade011-s4-check-wiring/reports/node-fsd-s4.md", "note": "本报告"}
  ],
  "gateResults": [
    {"gate": "S4→S5 gate① 接线实锚一：真跑门（现役全 PASS 面 spawn 校验器 RC=0 放行）", "result": "PASS（runClosingGate 对 PASS fixture 面→ok=true+output 含 PASS；**真身冒烟**：对 S3 树 reports/（现役双门过面）spawn 真校验器→ok=true——live 通道活证据·校验器=TMV 仓现役件非副本）"},
    {"gate": "S4→S5 gate② 接线实锚二：负路径 FAIL 面拒翻转+失败明细落卷", "result": "PASS（缺键件 fixture→checker-fail exit 1+output 含 missing key/FAIL；**finalizeWithGate 拒翻转全断言**：state 仍 FINALIZING 不动+审计行数不变（零新审计行）+fade_gate_rejections 恰一行（gate=closing-report-check/reason=checker-fail/detail 含 missing key）——§2.7 exit≠0 不得翻转机械执行三重实锚）"},
    {"gate": "S4→S5 gate③ python 可用性面：解释器解析显式化+超时上界+spawn 失败 fail-closed 显式标注", "result": "PASS（解析序显式：TRILC_FADE_PYTHON env→文档化默认 python·零 PATH 魔法·spawn argv 零 shell+windowsHide；R2.1：spawnWithTimeout 超时上界显式（默认 30s）·真 python sleep 5 vs 500ms 窗实测 timedOut=true+kill；spawn 失败面：坏解释器+校验器件缺失两形均→spawn-error→fail-closed 拒翻转+rejection 落卷（非静默非挂起））"},
    {"gate": "S4→S5 gate④ 全量 RC 含 fade 61 例回归+触现役件 stash 基线对照", "result": "PASS（fade 全家七件 62/62 RC=0 含 S1+S2+S3 回归零触碰；全量 npm test 776 tests/770 pass/6 fail——既有四族同谱（replay-flow notify 失败计数/rmc-TriLC P0-1 healthz 门前豁免/FADE-ASSESS-005 派工门禁 409 两子测+ownerRoleId/TUI 组件）；**独立验非转抄**：改动触现役 store.ts→git stash 基线对照——基线 776/768/8（既有 6+gate 三子测+套件聚合=store 方法缺失自然败·拒翻转路径真触达反证）→stash pop→含改动 776/770/6——既有名单逐行同零新增零修复·行级账闭环）"},
    {"gate": "施工纪律·路径配置化（D-24 机位断言）", "result": "PASS（TMV_REPO_ROOT env 优先（trim 形）→dev 兄弟仓探测默认——绝对路径零硬编码·sg 机 /srv/fleet/ 布局 env 一设即移植·run 树根经 ClosingGateOptions.reportsDir 由调用方传入（run 元数据/配置取——S5 驱动面挂点·S4 不硬编码）·resolver 显式性 4 用例断言在案）"},
    {"gate": "施工纪律·独立键空间零触现役 8713", "result": "PASS（纯新增 closing-gate.ts+test 件·store.ts 只加 fade_gate_rejections 独立表（fade.db 键空间内·现役 cron.db/sessions.db 零触碰）·无 app.ts 接线（驱动面归 S5）·测试独立 tmpdir dataDir+真 python 子进程即退）"},
    {"gate": "施工纪律·D-65 四族十三条写码自查", "result": "PASS（族一数据面：R1.1 零键名字符类（本件无键名匹配面·spawn 参数=--tree-dir 值传递）；族二边界：R2.1 超时上界显式（DEFAULT_GATE_TIMEOUT_MS=30s 导出常量+opts 覆盖+到点 kill）+spawn 失败三 fail 面全部显式返回（error 字段随报·禁静默）+明细 DETAIL_CAP=4000 尾段截断防爆卷；族三 CLI 五查：spawn 壳=argv 数组零 shell 拼接+解释器显式 env 覆盖序+退出码全整数面判定（code===0 放行·其余含 null 一律 fail-closed——signal 死/null code 不漏放）+超时 kill 显式+诊断输出尾段截断留明细；族四机制接口：R4.3 时戳=store nowIso() 进程内原生（rejection created_at）·零 spawn date·零正则解析时戳面新增）"}
  ]
}
```

## 实现方案（关键路径）

- **零新写只接线**：校验器=TMV 仓现役 `scripts/node_report_check.py`（015bab659·live 直调 `resolve(repoRoot,"scripts","node_report_check.py")`+existsSync 前置探测）——daemon 侧零校验逻辑副本（排期单 §七 风险③同族精神：单一执行通道）。
- **fail-closed 语义全谱**（§2.7「exit≠0 不得翻转」机械执行）：`runClosingGate` 只认 spawn RC===0 为过——RC≠0（含用法错 2）/spawn error（ENOENT·权限）/超时 kill 三 fail 面一律 `ok:false`；`finalizeWithGate` 对 fail 一律 `recordGateRejection` 落明细+返回 gated:false（run 状态不动·零审计行）——翻转调用方拿到 gated:false 即不得翻转（S5 驱动面唯一合法通道）。
- **law table 前置**：门跑之前先 assertTransition（from/to/actor=finalize）——注定败的非法边不烧校验器进程；门只护 FINALIZING→terminal 终态翻转（非终态目标 pre-gate 拒 INVALID_STATE）。
- **路径配置化**（D-24）：`TMV_REPO_ROOT` env 优先（sg 机 /srv/fleet/ 布局 env 一设即移植）→dev 兄弟仓探测默认；run 树 reportsDir=调用方传参（S5 从 run 元数据取）——实现零绝对路径。
- **拒翻转可见性**：fade_gate_rejections 独立表（纯新增·S1 冻结 schema 零触碰）——拒翻转不是静默丢弃，明细（reason+tail-capped output）落卷可审计。

## 异常与处置

1. **首跑 15/16+tsc 一错（自测链全抓获·定向即修）**：①tsc TS2322——spawnWithTimeout 的 code 类型 number|null 直赋 exitCode?: number→`?? undefined` 收口；②「dev 默认根」测试断言多套一层 `TriMetaverse/`——resolveTmvRepoRoot 语义=TriMetaverse 仓根本身（实现 closing-gate.ts 内 checker 解析即此语义），测试断言与实现语义对表修正（测试面错·实现面零嫌疑）。修后 16/16+tsc 零错。
2. **超时路径实测形态**：真 python `-c "import time; time.sleep(5)"` vs 500ms 上界→timedOut=true+进程被杀——R2.1 上界语义活体实锚（非纸面常量）；python 缺位环境探针先测（exit 0 探测·败则如实 skip 非假绿）。
3. **既有名单行级显隐噪声（如实注记）**：两轮 npm test 并行输出交错——replay-flow 既有族在基线轮显套件行、含改动轮显子测行+套件行（行级 8 vs 6 的对位差）——四族名单两卷全在+含改动侧零新增族·行级账已闭环非读数矛盾。

## 自测结果

- 定向：`node --import tsx --test test/fade-closing-gate.test.ts` → **16/16 pass·RC=0**（首跑 15/16 两处即修后全绿）。
- fade 全家回归：七件（S1 两件+S2 三件+S3 一件+S4 一件）→ **62/62 pass·RC=0**·前序件零触碰零回归。
- 类型面：`npx tsc --noEmit` **RC=0 零错**（含 stash 往返后复验）。
- 全量回归：`npm test` → **776 tests / 770 pass / 6 fail**（既有四族同谱）。**独立验证非转抄**：改动触现役 store.ts → git stash 基线对照（钦定标准形态）——基线（store.ts 回退）776/768/8=既有 6+gate 三子测+finalizeWithGate 套件聚合自然败（**拒翻转路径真触达实证：recordGateRejection 缺失时拒翻转面如实暴露**）；含改动 776/770/6——既有名单逐行同·零新增零修复·铁证。

## 技术债务标记

1. **S4 范围内无新增代码债**：closing-gate.ts 零 TODO/零 hack——三 fail 面全部 fail-closed 显式（不静默不挂起）。
2. **python 解释器默认名="python" 的环境面**（如实注记）：Windows/sg 机 PATH 上 python 在位（本窗双门+测试真跑实锚）——缺位环境经 TRILC_FADE_PYTHON env 显式指路·失败面 spawn-error fail-closed 不炸 daemon（S5 驱动面决定重试/升级语义）。
3. **门组合不防绕过（设计边界如实注记）**：store.advanceRun 仍公开——绕过 finalizeWithGate 直翻终态在类型层面可行；防线=S5 驱动链统一走 finalizeWithGate（brief §一 范围划线：驱动面归 S5·S5 联调时门在链上是唯一通道）。
4. **TriMLC github pushurl 候批窗**（S1-S3 承袭未闭）：本窗 commit 1606734 本地 dev·gate 面无 push 要求·候批窗合并处理。

## 断点交接

S5（缺口③·十段链驱动面·候 CTO 派工）——S4 消费面移交四件：①`finalizeWithGate(store, runId, toState, {reportsDir, ...})`=收口翻转唯一合法通道（门过自动 advanceRun actor=finalize·门败拒+落卷·gated:false 分支=驱动面重试/升级决策点）；②`runClosingGate`=独立门原语（非终态翻转外的门禁需求可直调）；③store 扩展 `listGateRejections(runId)`=拒翻转明细读面（S5 重试判断/驱动面显面）；④`TMV_REPO_ROOT`+`TRILC_FADE_PYTHON` 两 env knob=部署面配置点（reportsDir 每 run 从 run 元数据传）。STE 门禁验证面：`node --import tsx --test test/fade-closing-gate.test.ts`（~2s·真 python spawn+真身冒烟需 TMV 仓在位 dev 形态即满足）+fade 全家七件回归。S4→S5 gate 四件读数全 PASS（本报告 gateResults 前四条）。

## 使用依据

- FADE-011 排期单 `docs/execution/fade-011-automation-phase2-plan-20261103.md`（cd1a13f6c·工序 4/§四 gate/§六 独立键空间）
- S4 派工 brief 本树 `brief.md`（bf272815a·§一任务面三条/§二门禁三件/§四施工纪律五条含 D-47 铁则同束/§五回执链）
- 法条锚 `TriCompany/docs/engineering/fade-protocol-spec.md` §2.7 前置门（置 done 前必须运行 node_report_check·exit≠0 不得翻转·编排层全节点复跑双门）+ §8.3 L478 终态准入（be0fe20 批认正身）
- 校验器现役件 `TriMetaverse/scripts/node_report_check.py`（TMV 015bab659·本窗 S3 收口双门活跑实锚）+双门读数卷 aeefc6cee（T6 追认判据 CEO 令闭环）
- CTO 派工令落款 2026-11-04T03:06:13+0800（D-15 分派·落款原值·03:06 轮 S3 验收同窗）
- S1-S3 交付链 TriMLC 7e41d01→19b19c5→4573eba（store/state-machine/recovery/skill-loader·三席验收全过）
- D-65 代码审查规范（四族十三条·族三 CLI 五查+R2.1+R4.3）·D-24 机位断言纪律（TMV_REPO_ROOT 配置化）
- house 先例：S2/S3 stash 基线对照标准形态（CTO 钦定）·S3 resolveTriSkillSkillsRoot env 优先形（同族 resolver 显式性先例）
