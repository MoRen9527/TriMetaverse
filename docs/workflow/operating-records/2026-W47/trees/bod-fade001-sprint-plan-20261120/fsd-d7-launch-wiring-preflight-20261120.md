# FSD 卷·D7 起跑接线段节 1——施工前置定形（WO-D7 §四释放令兑现·GLM 触线窗节报形·候切可续蓝图）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-20T14:46:55Z（date 现查粘贴·+8=11-20 22:46:55·D-47 正形）
- 令面: COO 起跑令释放（台账 730·74e9df101·四锚齐终判+CFO 22:42:31 现值 74%<75% 双前置兑现）·接线段三节随毕随报——本卷=**节 1 前置定形**（GLM 74% 距线 1pt·耗速 4.7pt/h·触线预测 ~22:55 量级〔COO 旁注非定谳〕——蓝图先钉·触线停时 DeepSeek 轨零蓝图损耗可续）
- 施工位: TriRMC 河源 R-HY 现位（929 例外承录·D-83 随行例外河源零改道）·零子代理直跑

## 一·round_runner 落位定形（施工选定形·候 CTO 终审注——D4/D5/D6 三笔同族先例）

| 面 | 定形 | 依据 |
|---|---|---|
| 仓/语言 | **TriRMC 仓 TS 件**（河源现位施工·929 例外）——新建 `src/fade001/round_runner.ts`+`src/fade001/__tests__/round_runner.test.ts` | D1 §三「round_runner 归位=loop 引擎宿主」+TriRMC src TS 现役布局（agent-loop/orchestration 同族）+orchestration/=TriMC 员工编排面非轮编排面（实勘零 round_runner 骨架=纯新铸） |
| 状态面 | `round-queue/state/flag.json`（D1 §二原文路径·TriRMC 仓根 round-queue/）——read_flag/set_flag+authority_ref fail-closed+**唯一程序自动边=EXIT≥95→prod** | D1 §二照铸 |
| gate 接线 | **子进程 CLI 调 TC gate**：TriRMC runner spawn `python -m runtime.cognition.activation_gate --checks-json …`（TC 仓=/srv/fleet/TriCompany 检出在位·0713521·四件 blob 双端全等已钉）——D6 件直跑 CLI 入口现役支撑（D6 铸时自带 --checks-json 面=跨进程消费形设计原意） | 929 现位+D6 CLI 入口现役+河源 TC 检出活体勘定（D7 验证段④） |
| resume 面 | retry_flag.json pending-retry 轮→下轮点火指令携带 `--resume-stage 7`（D5 拟稿 schema 承·轮间第三分支=续跑边四分支族） | D1 §六A+勘面卷 §七.3 |
| 点火面 | cron 周日窗/start_loop 点火指令双源过同一 preflight 轮间门（D1 §三·tick=点火触发器 probe 同款尾挂形） | D1 §三照铸 |

## 二·施工分节拆解（触线停后 DeepSeek 轨按节续·节界=毕报锚）

- **节 1（本卷·已毕）**：前置定形——落位/接口/分节/疑点呈裁面；
- **节 2**：round_runner.ts 本体铸形（D1 §一 loop 伪码照铸：while 体+状态机四支+FUSE 8+flag 三态路由+EXIT≥95 程序边+失败冒泡 fail-closed）+白盒案族（S4 断言四案 F-1..F-4+款三 fail-closed 断言+点火/裁决 IO 断言+FUSE 7→8 边界案钉〔验证段承录四族之一〕）；
- **节 3**：D6 gate 接线（起跑前置检查位=A1-A4 状态采集喂入+first_round_pending=stop 停点挂起消费+呈报载荷出链〔大白话一行+终态读数+停面态声明〕+放行令 authority_ref 消费）+resume 轮间指令面（--resume-stage 7 形）+D-46 白名单投影/D-47 现查落款两护栏随铸白盒；
- **节 4**：spawn 七席通道接装+点火 IO 面+接线段毕报（→ns9 起跑执行毕报→首轮毕知情停点呈报 BOD 链——令文毕报链三节）。

## 三·疑点单列候 CTO（节 2 开工前一句话裁定或默认走施工选定形）

1. **gate 跨进程调用形**：子进程 CLI 调（本卷选定形·TC 检出活体支撑）vs gate TS 复刻（TriRMC 内零依赖）——若 CTO 裁复刻形=节 3 改形（gate 判读逻辑 TS 转译+白盒随译）；
2. **spawn 七席通道**：TriRMC sub-agent spawn（built-in 四席面）vs orchestration-kit bridge 面 vs 值席会话面——七席组（COS/COO/CTO/CPO/FSD/STE/CFO）spawn 形勘定=节 4 前置（D1 §四「Skill 段脚本化 spawn」的 Skill 段现位勘定）；
3. **round-queue/ 现位**：TriRMC 仓根新建（D1 §二路径照铸）vs 既有面复用——节 2 开工时实勘（零命中即新建）。

## 四·护栏承录（WO-D7 §五三条款·本席侧兑现形）

1. GLM 74% 触线即停：节 1 落树 push+呈报后若触线=停面态如实报·节 2+候 DeepSeek 轨续（蓝图本卷全量承载·节界毕报锚零损耗）；
2. 切换联动：TriRMC 实切 DeepSeek 毕（实切态=CFO 复读直报）→施工轨转 DeepSeek——**实切执行归 CTO/值席域·fsd 零自切承录**；
3. 红即停零二次硬试照役。

## 五·使用依据

- COO 起跑令释放（台账 730·令面四件+风险三条款）
- D1 设计卷 cto-round-programming-design-20261119 §一/§二/§三/§四/§六A（v2 重构版 loop 本体正形·全文现读）
- TriRMC orchestration/ 实勘（员工编排面非轮编排面·round_runner 零骨架确认）
- D7 验证段毕报 41905b835（河源 TC 检出/四件 blob 全等/承载位勘定承录）
- 现查 14:46:55Z

---
落卷=FSD 小全（m-fsd）·节 1 毕（22:46+8）·**节 2 候续**（DeepSeek 轨按节续铸·零蓝图损耗）·GLM 触线窗节报形承·实切零自切承录
