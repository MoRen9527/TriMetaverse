# LG-035 治理二期一期·执行读数件（phase1-readings）

- sourceOfTruth: 本件（一期执行读数+归因正身；随任务书 E 节节点流转）
- syncMode: append-only（阶段读数追加）
- lastSyncedAt: 2026-09-24T09:35+0800
- 执行席: FSD（m-fsd，CTO 域 lead 下）；上游=COS 派工令 03:12+CTO 四裁 03:2x
- 任务书: `trees/hermes-gov-p2-impl/task-charter.md`（本目录）

---

## 一、交付物（TriCode dev，双 commit 分立）

| commit | 内容 |
| --- | --- |
| `60268a5` | lg-036 漏线代收口（CTO 裁①a 首笔）：index.ts 补 org-layer export 一行（e7f8388 配套漏提交），独立可回滚 |
| `50bcbad` | digest 骨架三件（本case主体）：`src/knowledge-injector/digest-{rules,classify,executor}.ts` + index.ts digest 出口 + `test/digest-chain.test.ts`（14 测）+ yaml@^2.9.0 依赖（7 文件 +827 行） |

- 代码落点勘正：设计 §6「TriRLC knowledge-injector 扩展」实盘=TriCode 仓（LG-035 切包后 injector 源居 TriCode，TriRLC file: 依赖消费）——digest 三件随族落 TriCode，符合「既有件演进非新建」。
- 架构约束遵照：零 LLM 纯确定性（R1/R2）；YAML 面 snake_case=设计 §3 示例契表；阀门=声明序首匹配（first-match-wins）；零命中默认 escalate（no-rule-matched，CTO 裁②）；deep=deep-pending.jsonl 队列分流不调模型（CTO 裁④）；失败姿态=DigestRulesError 全量 issues/error outcome，绝不静默丢。

## 二、自测读数（全量自含，fade-010 整改①锚随附）

| 面 | 门 | 读数 |
| --- | --- | --- |
| TriCode | `npm run check`（tsc） | exit 0 ✓ |
| TriCode | `npm run build` | exit 0 ✓（dist 已更新，含 digest 三件） |
| TriCode | `npm test`（tsx node:test） | **14/14 全绿**（327ms）——含真文件端到端链：磁盘 yaml→加载→分类→执行→落盘断言，四判定（digest/reject/escalate/deep-pending）全走 |
| TriRLC | `npm run check`（消费方 tsc） | exit 0 ✓ |
| TriRLC | `npm test`（全量套件） | **639/644 过，5 败=既有**（归因见 §三） |

- 修测记录（自测期两轮）：初轮 11/14——①夹具 target_page 漏 `.md`（执行器忠实按模板落盘，测试期望错位，yaml 双形态实证后修夹具）②「reject/escalate 不落盘」断言误用 existsSync（mkdtempSync 本身建目录），改空目录断言。均为测试侧缺陷，实现侧零改。

## 三、5 败独立归因（A/B 实证，禁转抄口径）

失败名单：`test/integration/replay-flow.test.ts`／`test/tui/components.test.ts`／`test/server/auth-gate-rejection.test.ts`（P0 通道一/二端到端真实 HTTP 全局门）／`test/server/roster-gating-http.test.ts`（FADE-ASSESS-005 派工门禁+可见性回归，2 条）。

A/B 方法：`git worktree` 临时检出前变更基座 e7f8388→独立建 dist（类型全净，旁证其提交门禁过）→重指 TriRLC `@trimetaverse/tricode` 解析→同四文件对跑 → **45/50 过 5 败，与现 HEAD 完全同款** → 五败均先于本案存在，与 digest 变更零因果。实验后基座复原（junction 复位+功能验证 digest 导出可达+临时 worktree 移除，worktree list 归单）。失败面（HTTP 全局门/派工门禁/可见性/replay/tui）与 digest 域零名字重叠；根因细查归 owner 席（非本case范围，不在本席擅断）。

## 四、观察项与差口（如实随卷）

1. **设计示例两处勘正候 CTO 定稿**：①§3 示例基线 `content_empty: reject` 规则置尾——首匹配语义下会被 source_kind 规则遮蔽（空内容 daily-note 会走 digest），建议置首；②示例 target_page 无 `.md` 扩展名，真实规则应带（本骨架忠实按模板落盘不擅加）。已按勘正口径入测试夹具（置首+带 .md），设计正身修订候 CTO。
2. **GitHub push 暂劣化**：TriCode 两笔 GitHub 推送三次尝试均 reset/超时（03:4x；TMV 03:2x 同法曾通= transient）；sg bare 直推不认（TriCode origin 仅 GitHub，ssh 路径 auth 不通）。兜底=归账纪律晨巡检补推线；本地 commit 在卷零丢失风险。
3. **TriCode test/ 目录为本次首建**（test script 先在而目录空）——伴生测试件本次放 TriCode 本地（相对导入），与 TriRLC 伴生件（包导入）双形态并存；出口已接线（裁①a 二笔），后续伴生件可择一归一，候 CTO 口径。
4. **STE 门**：本件递验 m-ste 候窗；验后任务书 E 节补终态笔。

## 五、使用依据

- 设计正身 `docs/execution/hermes-gov-p2-design.md`（CEO 09-14 终批）§2②③/§3/§6/§7
- 任务书 9bd3ead6（A/B/C/D 节）+ CTO 四裁（2026-09-24 03:2x，对话留痕）
- TriCode e7f8388…50bcbad（git 实盘）；TriRLC 384d40a（消费方现势）
- fade-010 两条整改（端到端实测锚=§二真文件链；STE 门=§四.4 递验中）

---

## 六、STE 门结果（2026-09-24 03:5x-04:1x+0800，m-ste 独立复验 50bcbad 树）

- **总判定：PASS**——白盒读图 779 行（三正身 455+测试 324）；独立双跑 14/14+check/build=0 复现；覆盖充分/确定性扎实/语义符合诚实。
- **minor gap 三条**（均防御性低险，候二期随手补，不阻塞）：g1 `{source_kind}` 占位展开 executor 层未断言（rules 层接受已证）；g2 pageTitle >80「（无题）」分支未测；g3 写盘异常 error outcome 未注入故障（try/catch 在位）。
- **语义依赖注记（随二期 digest_log 排期显式带上，防语义悬空）**：§7②「reject 规则生效（丢弃有日志）」之日志归属 digest_log 件（非一期）——一期 reject=有 outcome 无 reject 日志持久化。
- reject 阀门首实证顺延定性：真实运营案例缺位而非实现缺口；纯确定性阀门单元穷尽=等价覆盖。

---

## 七、二期候项两件完工读数（2026-09-24 09:2x-09:3x+0800；COO 09:24 排窗令，截点当日 18:00）

**件① gap 三条随手补**（TriCode `1c7bdee`，test/digest-chain.test.ts +3 测=17/17 全绿+check=0）：
- g1 `{source_kind}` 占位 executor 层展开：`日志/{source_kind}/{date}.md` → `日志/daily-note/2026-09-24.md` 落盘断言 ✓
- g2 pageTitle 边界双断言：>80 字符取「（无题）」/恰好 80 取首行 ✓（`renderShallowPage` 导出面直测）
- g3 写盘故障注入（真 I/O 非 mock）：outDir 位置预置常规文件 → shallow/deep 双路径 error outcome（'写盘失败'/'deep 队列写盘失败'）✓
- 修测记录：初轮 16/17——g2 用 `renderShallowPage` 漏 import（测试侧笔误，一轮修）

**件② reject 日志归属 digest_log 注记显式化**（三处落地）：
- 源头：`digest-executor.ts` DigestOutcome rejected 行+executeDigest 文档头（"reject 日志持久化=digest_log 件职责（§7②）；一期仅结构化 outcome"）
- 设计正身：§6 增量行显式化条款随文（同注）
- 留痕：本件 §六 原注记+任务书 E 节——依赖链闭环，二期 digest_log 排期时该条款为现成规格输入

**门禁读数**：TriCode check=0+17/17（333ms）；实现逻辑零改（src 仅注释行，diff=49 行测试+4 行注释）。
**在途差口不变项**：本席 GitHub push 持续劣化（09:27 复试仍 reset；bare 07:30 他线 PUSH-OK=环境位差）——累计候推 7 笔（TriCode×3+TMV COS×4），晨巡检兜底线承接+SDE 支撑位候查（本席出口网络 vs 他线通，环境位断点嫌疑）。
