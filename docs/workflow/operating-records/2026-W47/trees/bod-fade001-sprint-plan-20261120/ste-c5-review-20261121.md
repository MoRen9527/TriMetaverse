# STE 抽验·C5 五类件收敛（local-runtime 16acbf4+双仓薄壳·5 fail 既有性独立复核决定性成立·2026-11-21）

- date 现查: UTC **2026-11-21T04:18:39Z** / 本地 **2026-11-21T12:18:40+08**（D-47 双值形·落款=commit 对象时戳）
- 抽验席: STE 小柯（m-ste·COO 派工 39005171+补充 04:16:04Z·fsd 请托同对象·独立复跑非转抄）
- 对象: 新包 **TriLocalRuntime 16acbf4**（本机仓·首 commit）+RLC **01e0997**+MLC **b138e30**（两仓本机 fetch 达）

## §一 · 新包面（16acbf4）

| 面 | 独立读数 | 判 |
|---|---|---|
| 结构 | src/ **16 文件** = compact×4+session-store×4+sync×5+task-runtime×1+toolbus×1+index×1 | ✓（**口径注**：请托称「19 文件」实 16·差 3 如实档） |
| exports | 实=**根+5 子路径**（`.`,./task-runtime,./toolbus,./compact,./session-store,./sync 共 6 项） | ✓（**口径注**：请托「6 子路径」实=5 子+根·差 1） |
| 中性名 | `TriRLCMessage/syncSessionToTriMMC/syncSessionToTriMC` 在 src **零命中**；`CompactMessage`（compact 4 件）`syncSession`（sync 3 件）在位 | ✓ |
| LF 归一 | `.gitattributes` = `* text=auto eol=lf` | ✓ |
| devDep | devDependencies 含 **trimodel**（process 三笔③补齐实证） | ✓ |
| 根聚合 | index.ts 注释含「防 TS2308·最小根聚合」承 C4 教训 | ✓ |
| build | `tsc -p tsconfig.json` **RC=0** | ✓ |

## §二 · 两仓薄壳+别名层

- RLC 01e0997=**10 files 57+/621-** ✓ 逐字；MLC b138e30=**10 files 83+/622-** ✓ 逐字（8 薄壳文件+package+lock）；
- 薄壳形抽样 ✓：`export * from '@tricompany/local-runtime/<sub>'`；
- **别名层实证**（消费方零改的机制）：`export type { CompactMessage as TriRLCMessage } from '…/compact'`（RLC grouping+index）·`export { syncSession as syncSessionToTriMMC } from '…/sync'`（RLC sync-engine）·MLC 侧 `as TriLCMessage`/`as syncSessionToTriMC` ✓——**两仓各 3 处别名形齐**。

## §三 · 三类组迁面·搬运等价性实证（归一行尾后全谱）

**方法注（重要）**：直接 diff 时 task-runtime 报「60 行非注释差」/toolbus「20 行」——查证=**CRLF/LF 行尾差假面**（两侧 30=30 行同文）——`diff --strip-trailing-cr` 归一后归零。**此即 CTO 方法教训「diff 行数≠差异行数·行尾归一」在本次的正向实证**（差点误判为实质差异·如实档）。

| 件 | 非注释差（归一后） | 性质 |
|---|---|---|
| 组 1 task-runtime/runtime.ts | **0** | 全等（卷面「真零差」实证成立） |
| 组 1 toolbus/bus.ts | **0** | 全等 |
| 组 2 compact.ts | 8 | 全为 `TriLCMessage→CompactMessage` 类型名中性化 |
| 组 2 grouping.ts | 10 | 同上类型名中性化（interface+函数签名+局部变量） |
| 组 2 compact/index.ts·prompt.ts | 0·0 | 全等 |
| 组 3 session-store/index.ts | **0** | 全等 |
| 组 3 sync/sync-engine.ts | 4 | 全为 `syncSessionToTriMC→syncSession` 函数名（签名 1+调用 1+其余 2） |

→ **迁出=搬运+符号中性化·零逻辑差异独立实证全谱** ✓

## §四 · 回归读数独立复跑

| 判据 | 独立读数 | 判 |
|---|---|---|
| build | TriLocalRuntime build **RC=0** | ✓ |
| 双仓 tsc | RLC **RC=0** / MLC **RC=0**·**TS2307 零**（双仓 grep=0） | ✓ |
| RLC 测试 | **733/733 全绿 RC=0** 逐位复现 | ✓ |
| MLC 测试 | **869 tests·864 pass·5 fail·0 cancelled·0 skipped** 逐位复现 | ✓ |
| 活体 | 8711 `/healthz`=**200 ok:true mc_link connected** / 8713 **200 ok:true**（**如实注 mc_link degraded·既有面**·零 daemon 触承录） | ✓ |

- 跑法注：两仓 test script 均无引号 glob（`test/**/*.test.ts`）——本席用 node 侧展开形（带引号）跑全量（C4 同族跑法坑承录）。

## §五 · MLC 5 fail 既有性独立复核（CTO 唯一条件·COO 令逐项非转抄）

| # | fail 名（本席实抓） | 本席独立证据 | 归属 |
|---|---|---|---|
| 1 | replay-flow.test.ts（文件级） | `b138e30~1` 版 L8 同 import `'../../../TriMC/src/comm/arbitration.js'`（旧仓名）+ **`/d/Code/ai/TriMC` 目录实不存在**（ls 实证）→ ERR_MODULE_NOT_FOUND 必然 | **既有** ✓ |
| 2 | tui/components.test.ts（文件级） | `b138e30~1:package.json` grep ink-testing-library=**0**（C5 前就无）+ **node_modules 里也没有**（ls 实证） | **既有缺包** ✓ |
| 3 | FADE-ASSESS-005 派工门禁 | **本席自跑 HEAD~1 八文件对照**：`git checkout b138e30~1 -- <8 文件>` → 该文件 **tests 7·pass 5·fail 2** 与 C5 后**逐位同**（同 2 案）→ 还原 `git checkout b138e30 -- <8 文件>`+断言 M=0/tsc RC=0 ✅（守链+还原完整） | **既有（决定性·自跑非转抄）** ✓ |
| 4 | FADE-ASSESS-005 可见性回归 | 同 3（同文件第 2 fail·对照同现） | **既有** ✓ |
| 5 | P0 通道一/二端到端 | `test/server/auth-gate-rejection.test.ts` L339 `assert.equal(res.json?.service,'trilc')`——期望旧名 vs MLC 实际 service='trimlc'（8713 healthz 实证）→ 改名残留期望值未更新；C5 改动面=8 薄壳+package 零触该测试 | **既有（改名残留）** ✓ |

- **判定=5 fail 全部既有·零本批引入**（COO 令「任一归属存疑→红面」不触发）；
- 补充证据面：FADE-ASSESS 测试 import 面=**仅 createTriLCApp+node 标准库**（零直依赖 8 薄壳文件）+迁出等价性全谱（§三）——静态链与动态对照双证齐；
- **口径差如实注**：fsd 归因表称 2 fail 为「FADE-ASSESS-005/003」——本席实抓两案均属 **FADE-ASSESS-005**（派工门禁+可见性回归·同文件）；「003 指标」未见独立案（如实档·不影响既有定性）。

## §六 · process 三笔+回滚锚核

1. **清点缺口**：`session-store` 实 4 文件（index/store/types/safety-check）+`sync` 实 5 文件（index/payload-builder/retry/sync-engine/types）——**目录级全展开兑现实证**（卷面「补迁 7 文件」=3+4 ✓ 数面吻合）✓；
2. **替换误伤修复完整性**：双仓全扫 `syncSessionToservice`/`Toservice domain` **零残渣** ✓；中性名+别名层在位（§一§二）→ 修复面完整 ✓；
3. **compact trimodel devDep**：TriLocalRuntime devDeps 含 trimodel ✓；
4. **回滚锚三形**：kit=**16acbf4**（本机对象在）✓ / dist bak 双在（`TriRLC/dist-bak-pre-c5-20261121T040513Z`+`TriMLC/…040515Z`）✓ / 源码 **.bak-c5 实数 8+8**（find 实证·compact4+session-store1+sync1+task-runtime1+toolbus1 ×2 仓）✓ +两仓 commit 01e0997/b138e30 ✓。

## §七 · 收口

**抽验通过·无阻塞项**——新包面+薄壳别名+三类组搬运等价（归一行尾后全谱）+回归读数全同值+**5 fail 既有性独立复核决定性成立**（含本席自跑 HEAD~1 对照 5/2 逐位同+还原完整）+process 三笔核+回滚锚三形全在位。四如实注（请托口径差 19/16 文件与 6/5 子路径·CRLF 行尾假面差点误判·8713 mc_link degraded 既有·fsd 表 003 案名口径）。候 CTO 终审+COO C5 收口定谳。

## 使用依据

- COO 派工 39005171+补充令（04:16:04Z·CTO 唯一条件=5 fail 既有性核）+fsd 毕报卷 664cc5dec+5 fail 归因表（04:14:52Z）
- 独立复跑：TriLocalRuntime build+RLC/MLC tsc+test 全量+活体双探+HEAD~1 八文件对照（自跑·还原断言）/tmp/*.log
- 迁出等价：8 文件 bak-c5 vs local-runtime 源 `diff --strip-trailing-cr` 全谱
- D-46（零敏感）/D-47/D-24（机位本机）/两试即停/零转抄纪律

—— STE 小柯（m-ste·C5 抽验窗）·写前现查 〔UTC 2026-11-21T04:18:39Z 拍+落款=commit 对象时戳·D-47 双值形〕
