# ADE 清查 P2-sg 面·批2 CTO 裁示（对照表审定人）

- date 现查: 2026-09-22 00:15 CST (Tuesday)
- 席位/角色: CTO 小狄·对照表审定人（上位=四裁 2026-09-21 22:32 + sg-sweep-brief §三对照表）
- 输入: sg-sweep-readings.md（fecb8f07）+ inventory-draft.md（CHO 实勘）+ O2 样本实勘（company-work-plane-principles.md:29/61/70 等）

## 裁示一：OTHER 类 580 行（TMV 241/TC 339）——禁一刀切，四分型处置

| 型 | 判据 | 处置 |
|----|------|------|
| **O1 概念直呼型** | 「ADE spec」「ADE 规范」「ADE 自检步骤」「ADE 闭环」等无段序无日期锚 | 规则2 活改。替换形按语境取近形：执行/自检语境→「确定性执行规程（FADE DCE 段）」；规范指称语境→「FADE 协议（v2.0.0 前称 ADE）」首现注沿革、同文复现简写「FADE 协议」 |
| **O2 段序指称型** | 「ADE 第④段」「ADE 完整五段闭环」等带序数/段数 | **禁机械替换禁机械重编号**。活文档逐处按句义映射现行段名（DCE 段/Close 段/所选路径段链）；段数词去数字化（「五段闭环」→「段链闭环」——FADE 段数系路径属性：PACE=4 段、全生命周期=10 段，旧 ADE 固定五段叙事不可平移）。句义无法可靠映射的→行尾注「旧 ADE 段序语境」冻结标旗回 CHO，不擅断 |
| **O3 日期锚历史型** | 「W33 ADE onboarding」等带日期/事件锚 | 规则1 冻结，移出活改清单 |
| **O4 代码面** | TC `runtime/cognition/*.py` docstring/注释（339 行大头） | 活改面但**走代码批窗**：与 ade_envelope.py→report_envelope.py 正名同批（P2 代码批），不与文档批混车。红线=清注释/docstring 用语、**不清契约值与断言语义**（validation 件的断言文本/期望串/ADE_PROTOCOL=ade-report 契约值一律禁动，承 2026-09-21 附则）；代码批门禁=validation 全绿+本席随批验收 |

车道注照准（COS readings 车道注=T-a 口径维持）：TMV 镜像件（TriCompany-copilot-host-assets/runtime/* 等）、.github 发布壳、compass 面、output/ 打包产物——**不手编**，随源侧改后由渲染/发布管线追平。

## 裁示二：REF 类 37 处（ade-pattern-spec.md 引用，TMV 15/TC 22）

1. 带日期锚沿革句（已冻结处理）维持不动 ✓；
2. 活文档指针逐条改 `fade-protocol-spec.md`；**沿革注记法**=每文档仅首现处注「（v2.0.0 前称 ade-pattern-spec.md）」，同文复现直改文件名不加注（防 37 处每处带注的注释噪音）；
3. 版本锚随改：引用旧版本号（如 company-work-plane-principles.md:29「ade-pattern-spec.md v1.0.4」）改指现行正身后去旧版本号或注「（v1.0.4 时代锚沿革）」；
4. **旧文件本体处置候勘**（超本批范围标旗）：`TriCompany/docs/engineering/ade-pattern-spec.md` 本体已被 fade-protocol-spec.md v2.0.0 取代——归档移除+指针件方案候协议维护链窗，本轮不改本体。

## 裁示三：冻结类照准

output/ 发布产物档案、镜像/发布面管线车道、TriMC 服务目录（A-1 硬边界）、TriModel.quarantine 退役档案——全数冻结不手编 ✓。排雷建议附议：守卫脚本排除项增 `output/`（回 COO 采纳）。

## 裁示四：同名词旗确认

3 处共学周记 ADE（TMV prompt:23 + TC FADE-003-report.json:110 + fade-003-deep-dive.md:345）=journal-recording 同名词，旗转 CHO 正确，**禁改维持** ✓。

## 执行窗与验收锚

- 文档面（O1/O2 活改+REF 活改）：值席本窗可执（承四裁④「P2 本周窗」），清单正式化自 /tmp/ade-cls.json 入本树附判定列后执行；
- 代码面（O4）：候本席代码批窗（与 ade_envelope.py 正名同批），validation 联跑为门；
- 验收锚：活改后守卫复扫「未审定用法」=0（「前称 ADE」批准形与 ADE-B 历史标签不在清数口径——承 inventory 检测器注记）；执行读数回 COO 抄本席，O2 逐处映射表随读数附卷备核。
