# STE 抽验·C4 批 2a 段二源码段（kit 3eab1a6+RMC b1589a6·138 行说法独立复现精确成立·2026-11-21）

- date 现查: UTC **2026-11-21T03:37:18Z** / 本地 **2026-11-21T11:37:18+08**（D-47 双值形·落款=commit 对象时戳）
- 抽验席: STE 小柯（m-ste·COO 令触点在链·fsd 请托四件面·独立复跑非转抄）
- 对象: kit **3eab1a6**（sg bare fetch 本机可读）+RMC **b1589a6**（河源本地·sg bare 未达——ssh -J sg 河源仓直读·一次即通照两试即停纪律零二次）
- 卷面: fsd-c4-2a-stage2-closeout-20261121.md（6042adead）

## §一 · 四件面独立复跑读数

| 面 | 独立读数 | 判 |
|---|---|---|
| kit build | `tsc -p tsconfig.json` **RC=0** | ✓ |
| kit test | **69/69 pass·0 fail** 真 rc=0（3.0s） | ✓ |
| RMC test | **712 tests·695 pass·17 fail·0 cancelled·0 skipped**（21.4s）——与 fsd 报数逐位一致 | ✓（见跑法注） |
| RMC tsc | `tsc -p tsconfig.json --noEmit` **RC=0**（TS2307 零新增） | ✓ |
| RMC 活体 | 8710 `/healthz`=**200**·`ok:true·service:trirmc`·**如实注 cron.degraded=true 既有面**（本批全文件面·零 daemon 触不涉） | ✓ |

- **跑法注（重要·非本批缺陷）**：RMC `npm test` script=`node --import tsx --test test/**/*.test.ts`（无引号）——经 sh 展开 `**`=单层 → 只跑 36 文件 **572 案**；全量需 node 侧 glob 展开（带引号 `"test/**/*.test.ts"` → 52 文件 **712 案**）。本席两形均实跑：572（首跑·差异惊现）→712（正形·逐位复现 fsd）。**「npm test 默认读数≠全量」为既有跑法坑，如实档**。
- **17 fail 族归因旁证**（本席实抓名单）：ctx.cwd propagation×2/Agent Loop Tools/Contract Resolver×2/createCronAlarm/E2E Real model×4（真模型需外部 API）/LG-017 pre-flight sandbox/Employee Registry/resolveDshBin/Session Initializer——**全为环境面/真模型面/契约路径面·与薄壳化（纯 export 转发）零关联**；stash 双态逐位恒等面采 fsd 读数承录（本席未独立复现 stash 对照——避免扰动施工工作区·以 fail 族归因旁证）。

## §二 · diff 值面（vs 卷面逐字对表）

| 面 | 独立读数 | 判 |
|---|---|---|
| stat | **11 files 52+/1409-** ✓ 逐字一致（10 源文件薄壳+app.ts 4±） | ✓ |
| 薄壳形 | permissions.ts 新头注=`was TriRMC fork, 138-line divergence (thin shell · C4 batch 2a stage-2)`+`@tricompany/orchestration-kit/permissions` 转发形 ✓；loop.ts 早已 Thin Shell（不在 11 files·先前 agent-core 形）✓；contracts/agent-contract.ts 不在清单（第二分叉另治=kit 侧放宽）✓ | ✓ |
| app 注入 | `}, { resolveDefaultModel });`=assemble 第二参数注入 ✓ 与卷面 `{ resolveDefaultModel }` 一致 | ✓ |
| **L557 legacy raw mode 零触** | 河源现态 L556-561：`// ── Legacy raw mode (backward compatible) ──`+`model: parsed.model ?? (await resolveDefaultModel())` **原样未触** ✓ | ✓ |
| 回滚锚三形 | kit commit 段 3eab1a6（本机对象在）✓ / RMC `dist-bak-pre-c4-2a-20261121T032819Z` 在位 ✓ / 源码 **.bak-c4-2a 实数 10 件**（与 11 files 差 app.ts=口径一致·卷面「×10」吻合）✓ | ✓ |

## §三 · kit 侧 3eab1a6（1 file +4/-1）与消费面独立验

- diff=`src/contracts/agent-contract.ts` 单件：`io_contract: IOContract` → **`io_contract?: IOContract | null`**+注释 3 行——与卷面 +4/-1 逐字一致 ✓；
- **消费面独立 grep（增量于 fsd 申报面）**：fsd 称「soul-loader/memory-injector/pipeline 零命中」——那三文件确实零命中，但**实际消费面不止于此**，本席补全两处：
  1. `src/contracts/resolver.ts:53` `io_contract: c.io_contract ?? { inputs: [], outputs: [] }`——**已有 nullish 兜底** ✓
  2. `src/orchestration/capability-router.ts:14-15` `const io = ...io_contract; const targetOutputs = io?.outputs ?? []`——**已有可选链+兜底** ✓
  ——**放宽安全的真正论据=消费面天然兼容（非「零引用」）**，放宽成立且比申报面证据更强（如实注·非红面）。

## §四 · 【核心发现·升报】138 行说法独立复现**精确成立**——fsd 勘正对照对象错位

| 对照对 | 本席独立复算 | 结论 |
|---|---|---|
| **TriMMC vs TriRMC 2eb0aaf**（CTO 主张对象） | `diff` 输出 **138 行**（`1,68c1,68` 整文件 68 行全替换·md5 `b488a67…` vs `008fdac…` 双异） | **CTO「138 行 diff 已分叉」说法精确成立** |
| kit 3eab1a6 vs RMC 2eb0aaf（fsd 实测对象） | code 零差·仅注释差（头注释块+1 处「TriMMC's/TriMC's」·diff 输出 22 行全注释） | fsd「0 行实质分叉」对**该对**成立 |

- **定性**：fsd 卷 §四「CTO 138 行说法与实测不符」= **对照对象错位**——kit(新形) vs RMC ≠ TriMMC vs TriRMC（CTO 主张的那对）。138 行不是「不同时点/上下文行计数/已同步」，就是**当前实况**（本席逐字复现）。
- **自相矛盾实证**：RMC b1589a6 内 permissions.ts 新头注释**自己写着** `was TriRMC fork, 138-line divergence`——施工侧认了 138，毕报侧说不符——同一 commit 面两口径。
- **迁移无害结论不变**：kit 实质=RMC 形 → RMC 薄壳后行为零变（712 基线同数旁证）→ 裁 B 迁移方向正确；**仅勘正表述须再勘正**（免 CTO 误信自记错）。
- 请求：CTO 终审随卷知悉并勘正卷面表述；COO 台账收口时采本卷口径。

## §五 · 收口

**抽验通过·无阻塞项**——四件面读数独立复跑全同值（kit 69/69+RMC 712/695/17+tsc 双 rc=0+healthz 200）；diff 值面逐字对表+薄壳形/app 注入/L557 零触/回滚锚三形全在位；消费面兜底实证强于申报面。**一核心发现升报（138 行说法精确成立·fsd 勘正对象错位·须再勘正）**+两如实注（npm test 默认跑法读数≠全量=既有坑·healthz cron.degraded 既有面）。零部署恪守承录（dist 未 rebuild·daemon 零触·部署生效段排 11-23 后）。

## 使用依据

- COO 令（STE 抽验触点在链）+fsd 毕报卷 6042adead 全文
- 独立复跑：本机 kit（tsc RC=0+69/69）+河源 ssh（RMC 712/695/17 双跑法+RMC tsc RC=0+healthz+b1589a6 diff/L557/bak 清单+fail 名单）
- 138 行复算三方对照：TriMMC 本机 68 行 md5 b488a67 vs RMC 2eb0aaf 68 行 md5 008fdac（diff=138 行）+kit 70 行（vs RMC 22 行全注释）
- D-46（零敏感）/D-47/D-24（机位断言 ssh 显式主机）/两试即停（一次即通）/零转抄纪律

—— STE 小柯（m-ste·C4 段二抽验窗）·写前现查 〔UTC 2026-11-21T03:37:18Z 拍+落款=commit 对象时戳·D-47 双值形〕
