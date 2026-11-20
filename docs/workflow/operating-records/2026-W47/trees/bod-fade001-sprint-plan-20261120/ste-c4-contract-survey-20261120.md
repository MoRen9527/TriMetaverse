# STE 契约先行勘面卷·C4 批 2a loop 配套族 8 件（WO-C4D3 §三.2·CTO 拆树令 28ac4728e §四·2026-11-20）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·C4 批 2a 契约勘面正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 勘面位: **sg TriMMC 活体**（/srv/fleet/TriMMC·HEAD e812485 2026-11-20T16:13:01+08）× **河源 TriRMC 活体**（/srv/fleet/TriRMC·HEAD 5c993fc 2026-11-20T13:49:17+08）——双侧权威活体面（D-24 机位断言·非 dev 检出投影）·RMC 侧读数=ssh -J M-SG R-HY 值席通道现役形（CTO 直连缺口承录·两试即停纪律遵行）

## §一 · 勘法

ssh 批取双侧 8 件全文（一次连接/侧·1303 行/侧）→本地落盘逐件 `diff --strip-trailing-cr`（strip-cr 假漂移家族教训承·fsd C2 同构法）→真差逐处定性（代码/注释分面）+exports 双侧计数对表。取数链三勘：文件数 8+8 ✓·行数逐对等 ✓·标记行无尾换行拼接坑一处（task-controller 末行 `}` 与标记行无缝——拆分器中位切修形·三拆收口如实档）。

## §二 · 分档终表（8 件·三档判据）

| # | 件（文件） | 行数 MMC/RMC | md5 双侧 | strip-cr 真差 | **分档** |
|---|---|---|---|---|---|
| 1 | context-builder.ts | 110/110 | 041446b8/0ce5c41b | 4 行=L1 头注释（TriMMC/TriMC 改名投影） | **A** |
| 2 | cache-control.ts | 229/229 | 6ee5dad2/30bd7682 | 4 行=L1 头注释同族 | **A** |
| 3 | prompt-cache/index.ts | 35/35 | cc5f81f7/3dfcc846 | 4 行=L1 头注释同族 | **A** |
| 4 | policy-gate/service.ts | 42/42 | **e3b65b6a=双侧全等** | 0 | **A（md5 直等）** |
| 5 | tool-gater/gater.ts | 106/106 | 47b3abd2/26fa624a | 4 行=L1 头注释同族 | **A** |
| 6 | task-controller/controller.ts | 145/145 | 6cfa16d4/205f7e65 | 4 行=L2 头注释同族 | **A** |
| 7 | soul-loader/soul-loader.ts | 137/137 | b07da653/446dad5e | 4 行=L1 头注释同族 | **A** |
| 8 | memory-injector/memory-injector.ts | 404/404 | 6d4d2de4/2c4b67b1 | 4 行=L1 头注释同族 | **A** |
| 9 | pipeline/assemble.ts（prompt-cache 计 2 文件·件 9 行=pipeline） | 129/129 | a829d03a/690015f4 | 12 行=L1 头注释+L31/L112 注释 env 名投影（TRIMC/TRIRMC_DEFAULT_MODEL——**两处均注释行·代码面 import 8 行逐行全等+L113 调用行全等·resolveDefaultModel=外部 config-sync/default-model.js（批外件·env 读取逻辑不在本件）**——注释各映本仓非漂移） | **A** |

**分档定谳：8/8 全 A 档（零 B·零 C）——红门（C 档>4 件重裁）不触·范围维持 8 件零剔批。**
真差定性=头注释改名投影词面族（TriMC→TriMMC 2026-09 改名·fsd C2 谱 trilc-executor 同族「纯改名投影语义零差」）——**语义零差判据实锚**：7 件 diff 全谱仅头注释行+pipeline 三行注释（代码/exports/import/调用面逐行等）。

## §三 · exports 契约快照（双侧计数逐件全等）

| 件 | exports 双侧 | 主面 |
|---|---|---|
| context-builder | 3=3 | ContextSources/buildContext/mergeContextWithPrompt |
| prompt-cache/cache-control | 11=11 | CacheState/CacheMetrics/computeSystemPromptHash/computeToolsHash/createCacheState/updateCacheState/estimateCacheHit/buildCacheMetrics/CacheControlConfig/getCacheControlConfig/resetCacheStateForNewSession |
| prompt-cache/index | 5=5 | 聚合再导出面 |
| policy-gate | （md5 全等·快照随全等承） | service 形 |
| tool-gater | 7=7 | AgentTier/PermissionResult/ToolSpec/checkToolPermission/ToolGaterFn/createToolGater/GaterSummary/summarizeGater |
| task-controller | 5=5 | TaskPriority/TaskStatus/Task/AcceptedTaskPlaceholder/**class TaskController**（批 2a 唯一 class 形件） |
| soul-loader | 2=2 | contractToPrompt/contractToContextSources |
| memory-injector | 15=15 | MemoryLayer 四层/MemoryFrontmatter/SoulMemory/EpisodicMemory/ColleagueMemory/SocialMemory/MemoryPayload/InjectResult/injectSoul/injectMemories/injectColleagues/injectSocial/injectAll/buildMemoryContext/contractToSoulMemory |
| pipeline | 3=3 | PipelineAssemblyOptions/PipelineAssembly/**assemblePipelineOptions**（async） |

**跨件依赖面（kit v2 扩容施工面如实注）**：pipeline imports 批内三件（soul-loader/memory-injector/context-builder·kit 内同构路径承载）+**批外三域**——contracts/agent-contract.ts（AgentContract/ToolSpec）+agent-loop/loop.ts（AgentLoopOptions）+agent-loop/permissions.ts（AgentTier）+config-sync/default-model.ts（resolveDefaultModel·env 读取位）——kit v2 扩容时四域=kit 内追加或外部投影=收敛施工选形面（候 CTO 实现门裁量·本卷只注依赖事实）。

## §四 · 行为冒烟断言面（八件形·P1 契约套件同构·FSD 实现门输入）

- **M1 context-builder**：`buildContext(sources)→string 非空形`+`mergeContextWithPrompt(prompt, sources) 双参合成形`
- **M2 cache-control**：`computeSystemPromptHash 空→null/非空→hash 形`+`createCacheState 初值形`+`updateCacheState/estimateCacheHit 回执形`+`resetCacheStateForNewSession 重置形`
- **M3 prompt-cache/index**：5 exports 聚合可解形（零漏导出）
- **M4 tool-gater**：`checkToolPermission(tier, tool) 判定形`+`createToolGater 返 ToolGaterFn`+`summarizeGater 汇总形`
- **M5 task-controller**：`TaskController 接受任务→queued`+`状态机迁移守卫（合法迁移绿/非法拒）`+`优先级四枚举面`
- **M6 soul-loader**：`contractToPrompt(contract)→string 形`+`contractToContextSources→ContextSources 形`
- **M7 memory-injector**：`injectAll/四层 inject 异步回执形`+`buildMemoryContext 合成形`+`contractToSoulMemory 投影形`
- **M8 pipeline**：`assemblePipelineOptions(options)→PipelineAssembly async 形`+`model 三级解析承接形（resolveDefaultModel 注入位·mock 形零真实 env）`+批内三件联动冒烟
- 全套件 sandbox 纪律：零生产触碰零 env 真读（mock/注入形）——P1 §三 side-effect 零面同构。

## §五 · 收敛正形建议与门禁预形

- **收敛正形**：8 件=MMC 形为基直拷（A 档判据）+头注释归一 kit 现役名（TriOrchKit·改名投影词面收敛位）——kit v2 exports 追加形零破现役 20 exports（追加非改形·§四.5 消费面纪律）；批外依赖四域选形（kit 内追加 vs 外部投影）候 CTO 实现门裁·本卷依赖事实已注 §三。
- **回归绿判据预形（段一过门硬项·照拆树令 §四.4）**：kit build 绿+kit 全测试绿+TriMMC 全测试套件绿+活体面探（healthz/cron）零退化+TS2307 族零新增——施工=FSD 段一（kit 扩容+TriMMC import 切换）·候明晨窗 CFO 切换实锚起算（统排件 §五·零硬塞）。
- **红门读数**：C 档 0 件·不触。
- **护栏**：本卷=勘面+契约先行（零活体触·零施工）·D-46 值面零嵌（md5/exports=非值面）·GLM 75% 止损线联动（本窗读数批取+本地 diff·零模型消耗）。

## 使用依据

CTO 拆树令 cto-c4-p2-teardown-20261120.md（28ac4728e·§一清单+§四判据）+COO 转派令（18:57:44 落款现查）+fsd C2 双侧勘验卷 dc9c9d42a（strip-cr 同构法+假漂移家族教训）+ste-contract-test-suite-nine-20261120（P1 契约套件先例·a44b9ceaf 勘正版）+双侧活体 ssh 批取读数（/tmp/c4/ 落盘·mmc-all/rmc-all 1303 行×2）+跨管道行尾族三坑/D-24/D-27 v4/D-46/D-47。

—— STE 小柯（m-ste·C4 契约先行勘面窗·今晚轻量）·写前现查 〔commit 时戳锚·D-47 正形〕
