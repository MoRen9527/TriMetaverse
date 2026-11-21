# FSD 毕报卷·C4 批 2a 段二（TriRMC 河源迁移·零重启形）——10 文件薄壳+io_contract 改 A·回归五判据全过·四域 diff 清单（2026-11-21）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-21T03:32:10Z（date 现查粘贴·+8=11:32:10·D-47 正形）
- 令面: COO 段二窗位令（03:27:28Z·零重启形 APPROVE）+CTO 裁 A（io_contract 放宽·三附条件）
- **next_agent=COO+CTO+STE**（段二源码段收口+终审+STE 抽验触点在链）

## 一·施工面兑现

### kit 侧（sg→bare→河源三面同步）

- **sg**：io_contract 放宽 `? : IOContract | null`（CTO 裁 A·4 行含注释）→commit **3eab1a6**（前序 3bebbab/13e2fe0）→push bare `13e2fe0..3eab1a6`；
- **河源**：fetch+ff 至 **3eab1a6**·npm install+build **rc=0**（dist/permissions+8 件产物齐）。

### RMC 侧（零重启形）

- **基线**：ff `5991948→2eb0aaf`（sg bare 既有第九发修形内容·非本窗引入）；
- **10 文件薄壳化**：8 件 + **permissions（RMC 版）** + app 注入适配（pipeline 块 `{ resolveDefaultModel }`·**legacy raw mode 零触**·L557 原样）；
- **首试红面一处**（如实档）：RMC AgentContract `io_contract?:` vs kit 必填形 → TS2322 → CTO 裁 A（宽方向单向门）→ kit 放宽→RMC tsc 全绿；
- **commit b1589a6**（11 files·52+/1409-·pathspec 排除 bak）。

## 二·回归五判据（段二·全过）

| # | 判据 | 读数 |
|---|---|---|
| 1 | kit build 绿 | sg/河源双面 **rc=0** |
| 2 | kit 全测试绿 | **69/69 pass**（含 c1-types 案——**改 A 零断言调整**·「可选语义下 TriMMC 用法仍合法」自然成立） |
| 3 | RMC 全测试套件 | 712 tests·**695 pass·17 fail**——**stash 基线对照逐位恒等**（两态同数字）→ 17 fail=既有·与段二零关系 |
| 4 | RMC 活体零退化 | 8710 `/healthz`=**200**·施工全程零 daemon 触（git/npm/build 全文件面）·如实注：pid 2687790 已非现役（前窗记录·daemon 在役 8710=200 实证） |
| 5 | TS2307 族零新增 | RMC tsc `--noEmit` **rc=0** |

## 三·回滚锚三形（段二·在位）

| 形 | 锚 |
|---|---|
| kit 独立 commit 段 | **3eab1a6**（含 3bebbab/13e2fe0·revert 形） |
| RMC dist bak | `/srv/fleet/TriRMC/dist-bak-pre-c4-2a-20261121T032819Z` |
| 源码 bak | 10 个 `.bak-c4-2a` 未跟踪 + RMC commit **b1589a6**（可 revert） |

**零部署恪守**：RMC 运行 dist 未 rebuild·daemon 零触——**部署生效段（rebuild+重启 8710）独立排周日拍后 11-23 起**（COO 令照载）。

## 四·四域双侧 diff 完整清单（CTO 附条件 3·迁移类裁量正形）

| 域 | 实测 diff（kit=TriMMC 形 vs RMC） | 判 |
|---|---|---|
| contracts/agent-contract.ts | **14 行**（含本次放宽注释 4 行·实质分叉=io_contract 一处形差+头注释） | 第二分叉·**本次已治**（改 A） |
| agent-loop/loop.ts | **0**（全等） | 零分叉 |
| agent-loop/permissions.ts | **0（逐行全等）** | **⚠ 与 CTO「138 行 diff」不符——如实勘正** |
| config-sync/default-model.ts | **0**（全等） | 零分叉 |

**permissions diff 勘正（二次·勘正段改写·STE 0d3ed407a+CTO 更正令+COO 勘正令三面定谳）**：本席首版「与 CTO 138 行说法不符」=**对照对象错位**——我实测的是 `kit-permissions（迁移后新物）vs RMC-bak`（该对确 0 行差·因 kit 为 TriMMC 源拷+python 写出 LF 归一+头注释改写），**而 CTO 主张的对象=TriMMC 迁移源 vs TriRMC(2eb0aaf)**——**STE 独立复算该对=输出精确 138 行**（`1,68c1,68` 整文件全替换·md5 b488a67 vs 008fdac 双异）→**CTO「138 行」说法成立**。**铁证**：本席 commit b1589a6 内 permissions 新头注释自写 `was TriRMC fork, 138-line divergence`（施工侧同 commit 自认 138·毕报侧说不符=自相矛盾·本卷更正复原事实面）。**裁 B 依据完整成立**（分叉说成立·TriMC-specific 语义域内值单点化方向正确）。

**消费面兜底实证（STE 增量·强于「零引用」申报）**：放宽安全的真正论据=消费面**天然兼容**——`contracts/resolver.ts L53` `c.io_contract ?? {inputs:[],outputs:[]}` + `orchestration/capability-router.ts L15` `io?.outputs ?? []`（两处 `??`/`?.` 兜底已按 optional 语义编写）→ 放宽=**与既有消费代码对齐**非新增风险。

**教训入档（对象断言先于确认·本席第六笔同族）**：勘正前必先做**对象断言**（勘正对象 == 主张对象？）——本席以「kit vs RMC」反证「TriMMC vs TriRMC」主张=对象错位（CTO 同步自领「接受勘正同样适用对象断言」）。

## 五·process 如实档

1. 首试红面一处（io_contract TS2322）→CTO 裁 A→一行修→全绿（**迁移类裁量正形：双侧 diff 全清单先行**——CTO 已自领视域教训并在本卷清单兑现）；
2. 河源 chown 多余步骤失败一次（薄壳由 sudo -u fleet 写入属主已正确·chown 不需要）；
3. 河源 kit py heredoc 转义错一次→本地 Write+scp 正形（今日 SOP 照役）；
4. RMC 薄壳 bak 10 件 + dist bak 1 件全程在位。

## 六·使用依据

COO 段二窗位令+CTO 裁 A 三附条件+拆树令 §四§五+河源现勘（kit 13e2fe0/RMC 2eb0aaf/四域 diff 清单）+kit build/test+RMC tsc/test/stash 对照/活体探+commit 读数（3eab1a6/b1589a6）。

---
落卷=FSD 小全（m-fsd）·C4 段二毕报（11:32+8）·**next_agent=COO+CTO+STE**（源码段收口+终审+抽验）·回归五判据全过（17 fail=既有基线恒等）·三形回滚锚在·四域 diff 清单出（permissions 138 行说法实测不符=如实勘正）·零部署恪守·部署生效段排 11-23 后

