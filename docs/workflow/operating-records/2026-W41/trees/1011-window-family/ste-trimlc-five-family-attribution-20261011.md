# STE 归因卷 · TriMLC 既有 5 fail 五族资料面归因（勘修窗毕报候排件·搭车不扩窗）

- sourceOfTruth: 本件（trees/1011-window-family/ste-trimlc-five-family-attribution-20261011.md）
- syncMode: static（资料面归因卷·只归因不施工）
- lastSyncedAt: 2026-10-11T14:08:32+08:00（date 现查原值）
- 执行席: STE 小柯（m-ste）；令源=COO 排工令（10-11 13:34）搭车项
- 基线: 勘修窗毕报 cto-repair-window-report-20261011.md §二——修前 656 例 5 fail 五族/修后 668 例 663 pass/5 fail 同集合不增不减；本席对 HEAD（f612b9e·668+6 新例=674 例）独立复跑
- 边界: **资料面归因·不扩窗不施工**——修法方向仅列候勘修窗另排；既有定性禁转抄，五族逐一本席第二方法重跑重读

## 一、独立复跑读数（HEAD f612b9e）

- `npm test`（node --import tsx --test test/**/*.test.ts）→ **674 tests / 669 pass / 5 fail / 0 cancelled / 0 skipped**
- not-ok 名单 5 行与勘修窗 §二五族**同集合不增不减** ✓（674=668+6·f612b9e 新增 6 例全绿——FSD 注记「新测试 6/6 绿」独立复核同向）
- **读数分歧注记（如实录）**：f612b9e commit 注记自载「6 既有 fail stash 对照同名单（PID/replay/tui 稳定坏+P0/FADE×2 全量环境型）」——本席 HEAD 全量实测 **5 fail 无 PID 项**，且五族实锚（§二）与该注记的「全量环境型」定性不符（实为测试腐化面·见 §二）。分歧候选=FSD stash 对照窗的中间态读数/PID 族环境瞬态本窗未复现。本卷以实测读数与逐族实锚为准；FSD 注记原样保留不入质量结论。

## 二、五族逐族归因（第二方法实锚）

| 族 | 失败实锚 | 根因 | 类型定性 |
| --- | --- | --- | --- |
| ① replay-flow | `ERR_MODULE_NOT_FOUND: Cannot find module 'D:\Code\ai\TriMC\src\comm\arbitration.js'`（文件级加载崩·零子测试起跑） | test/integration/replay-flow.test.ts **L8 import 旧仓名路径** `'../../../TriMC/src/comm/arbitration.js'`——TriMC→TriMMC 2026-09 改名后旧目录不存在（本席 ls 实锚：`D:/Code/ai/TriMC` NOT EXIST·`TriMMC/src/comm/arbitration.ts` 在位） | **跨仓改名断链**（测试腐化·加载级） |
| ② auth-gate P0 e1 | `'trimlc' !== 'trilc'` AssertionError @test/server/auth-gate-rejection.test.ts:339（e1 子测试·suite 内其余 40 例全过） | e1 断言 /healthz 响应服务名期待旧名 `trilc`，服务正名后自报 `trimlc`——**门行为本身零缺陷**（e2 query 不豁免 401/e3 fail-closed 均绿，仅服务标识值断言陈旧） | **跨仓改名断链**（测试腐化·断言级·非安全缺陷） |
| ③ roster-gating ownerRoleId | `'candidate' !== 'unknown'` @roster-gating-http.test.ts L132（派工 test-engineer 期待 rosterStatus=candidate） | **岗位 id 跨仓改名漂移**：TriCompany `docs/registry/employee-roster.json` L124 STE 条目 id=**`senior-test-engineer`**（已随源侧正身改名），测试样本仍派工旧 id `test-engineer`→getRoleCatalog（contract-resolver.ts L355，以 roster.id 为主键）无此 roleId→staffing.ts L121 返回 `unknown`——**服务端行为正确**（目录不存在岗恰应 unknown），测试样本 id 未跟 | **跨仓硬编码漂移**（测试腐化·与 10-06 TriRMC 流水线族④「14→15」同家族） |
| ④ roster-gating 可见性 | metrics 子测试：`routing_error 计数应 ≥3` 不成立（同文件 L176-194） | **族③同根连坐**：该测试文件串行依赖前置用例的 409 触发数（candidate×2+unknown×1）——族③ 在 L132 断言炸出后 L134-141（candidate 第二派工+unknown 派工）**未执行**→409 实发数<3→metrics 断言不成立。修族③自愈 | 同根连坐（随③愈） |
| ⑤ tui components | `ERR_MODULE_NOT_FOUND: Cannot find package 'ink-testing-library'`（文件级加载崩） | test/tui/components.test.ts **L8 import 未声明依赖**——`ink-testing-library` **从未入 package.json**（`git log -S` 全历史考古零记录）；该件生于 8ac7f5f「正式接入 CC ink fork」；同目录 components-smoke.test.ts 文件头自述「Does NOT require ink-testing-library」=**已知缺依赖的 smoke 替代形在役** | **依赖悬空**（测试腐化·替代形已存在） |

## 三、归因总评与修法方向（候勘修窗另排·本窗零施工）

- **五族零一落产品代码缺陷**：①②③为跨仓改名/漂移后测试期待值未跟（服务端行为在③经链路追读验证为正确）、④为③连坐、⑤为依赖悬空——**全族=测试腐化面（维护债）非功能回归**。
- 修法方向参考（工量极小·供排窗估价）：①import 路径 TriMC→TriMMC 一处；②期待值 trilc→trimlc 一处；③样本 id test-engineer→senior-test-engineer 一处（④自愈）；⑤声明 devDependencies `ink-testing-library` 或将 components.test.ts 收敛到 smoke 形（先例在位）。
- 修复后预期：674 例全绿（含 f612b9e 新 6 例）——五族清零后 TriMLC 全量基线转绿，候勘修窗施工+门禁复跑确认。

## 四、使用依据

- 独立复跑：TriMLC HEAD f612b9e 全量（674/669/5）+三族单文件重跑（replay-flow/auth-gate/roster-gating/tui components）拿 TAP error 实锚
- 跨仓对表：`D:/Code/ai/TriMC`（不存在）/`TriMMC/src/comm/arbitration.ts`（在位）·`TriCompany/docs/registry/employee-roster.json` L124（id=senior-test-engineer）·TriMLC src 链路追读（contract-resolver L355-372/staffing L113-121）
- git 考古：`git log -S ink-testing-library -- package.json`（零记录）·components.test.ts 出生 commit 8ac7f5f
- 基线卷：cto-repair-window-report-20261011.md §二（五族名单+668 基线）·f612b9e commit 注记（分歧对象·如实录 §一）
- 记忆条：全量读数回报纪律（五族归因逐族实锚）/既有定性禁转抄须独立验/跨仓硬编码漂移族（10-06 TriRMC 族④同家族）
