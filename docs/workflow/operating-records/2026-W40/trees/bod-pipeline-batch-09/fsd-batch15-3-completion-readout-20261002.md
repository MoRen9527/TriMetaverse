# FSD·batch-15 件③完工读数卷（10-02 21 窗·CTO 追裁令四细则施工毕）

- sourceOfTruth: 本件（FSD batch-15 件③完工卷；令源=COO 21:15 转 CTO 追裁令 verbatim（案一采纳+细则四条「即续施工」）+21:02 任务书全文+21:05 落点勘正确认；任务书正身=sg 树 task-charter-batch-15-3.md 2bd0d8c9）
- syncMode: static（施工毕全验收锚达；push 候裁照先例）
- lastSyncedAt: 2026-10-02T21:26+08:00（date 现查=2026-10-02 21:26:18 +08:00）
- 施工席: FSD 小全（m-fsd，本机 dev 机车道）
- 施工锚: TriCompany **2fb1292**（agent-core schema 分支笔）+TriMMC **cf177f1**（期望校准+连带闭环笔）——分件两笔照单

## 一、实现方案（追裁四细则落码形）

1. **细则①io_contract nullish 形**：`IOContractSchema.nullish()` 非 `.optional()`——yaml 空段解析 null 防二次翻车（本席实勘注记：源侧正身 board.contract.yaml 本席 Read 全文 58 行无 io_contract 段头+普查正则零命中+zod「Required」语义=键缺失形；CTO 追裁令「L80 有段头无内容」与本人实勘存在面差，两态 nullish 全防不阻施工，如实入卷候勘）。
2. **细则②superRefine Role 分支扩**：family=Role → io_contract 键缺失（undefined）与空段（null）两形均打回；inputs/outputs min1 由 IOContractSchema 自身维持；员工席强约束零松动。
3. **细则③interfaces 放行**：顶层 `z.record(z.unknown()).optional()` 显式单键宽松节——不选 passthrough（全未知键放行=strict 全废，约束面过大）；不进 domain shape（toDomain 不映射，消费面零外溢）。
4. **细则④第二测条件化**：io_contract.inputs 非空断言 Role 席 only，Registry 席跳过。
5. **连带闭环两处（resolve 15/15 必然波及面，随到随报在案）**：
   - resolver.toDomain io_contract 空值兜底 `{inputs:[],outputs:[]}`——domain 类型 Required 不动，消费方零改动；
   - **employee-registry 显式 family 过滤**——原 13 席 roster 纯度系 schema 拒绝「恰好排除」（board/bs 被拒=errors.length=2 构成面断言），Registry 分支后两席合法加载，该机制消解→`loadEmployeeRegistry` 加 `family==='Role'` 过滤，roster 13 席语义保真，合法排除自 errors（2→0）移为过滤面；测试构成断言随之校准+Registry 席不入 roster 显式断言。

## 二、代码变更清单

| 仓/文件 | 变更 | 锚 |
| --- | --- | --- |
| TriCompany/packages/agent-core/src/contracts/agent-contract.ts | PathsSchema 四件套 optional+superRefine（paths 四键+io_contract Role 强约束）+io_contract nullish+interfaces optional 节 | 2fb1292 |
| TriMMC/src/contracts/resolver.ts | toDomain io_contract 空值兜底 | cf177f1 |
| TriMMC/src/orchestration/employee-registry.ts | Role family 显式过滤（roster 纯度闭环） | cf177f1 |
| TriMMC/test/contract-resolver.test.ts | 期望 14→15+runtime_equivalent 容缺省+runtime_baseline 容 undefined+第二测 Role only | cf177f1 |
| TriMMC/test/orchestration/employee-registry.test.ts | 构成断言校准（errors 2→0）+Registry 排除显式断言 | cf177f1 |

## 三、自测结果（全量读数四项+独立归因）

- **resolve 全族 15/15**：contract-resolver 套件 **11/11 绿**（15 contracts+errors=0）。
- **62/63 两测试绿**：CTO describe 全组+resolve 期望 15 全绿（含于全量）。
- **TriMMC 全量四项读数**：**625/592/32/1**（tests/pass/fail/skip）vs 变更前基线 625/589/35/1——**净转绿 3 条零新增**；终挂名单与首跑名单 diff 实证=仅「loads 13 employees」一条翻绿，new-fails=**none**（机器 diff 输出实证）。
- **32 条既有失败逐族归因**（与基线同名单零异动）：族A 测试进程 dotenvx 吸宿主 `.env`（TRIMC 族键）→401 fail-closed 门连坐（agent 管线/chat endpoint 族）；族B shell_exec ctx-cwd 族（win32 cmd 语义形）——均 T5 卷在案既有，非本变更引入。
- **TriRLC 溢出检查**：agent-core 消费面 6 套件（tools-ctx-cwd/harness-scaffold/heartbeat-runner/lead-tools/stream-dedup/qa-stream-runtime）=**58/55/3**——3 挂=shell_exec ctx-cwd 族；**旧 dist 反事实实测**（限路径 stash agent-contract.ts→build HEAD 形→同跑同 3 挂→pop 还原重建 55/55）钉死**非本席变更溢出**，归因=TriRLC 本仓 dev 18cd777 在途 8 笔形/环境形既有（T5 时点全绿形=worktree@2afffe1 origin 形，代码形不同源）。
- **agent-core 包门**：build 零错+**55/55 绿**（施工毕+stash 往返校验双读数一致）。
- **源侧零 diff 断言**：`git status/diff -- source-agents` 双空实证（任务书禁面守约）。

## 四、技术债务标记

1. **board/bs 合法化后 roster 面语义分移**：employee-registry「13 席」由「schema 拒绝余集」变「family 过滤正集」——语义更强但消费面（dispatch-proxy 等）今后新增须自维持 family 意识（过滤在 registry 层统一做，下游无感，已闭环）。
2. **TriRLC 在途形 tools-ctx-cwd 3 挂**：非本席面（反事实钉死），候 TriRLC 并线序裁决（10-03 候裁项）一并处置。
3. **SDE 合同 agent_id=deployment-engineer 残留**：resolve ids 实证重现（WO-D 定性②/LG-059 源侧族候裁在案，不阻本单）。
4. **测试 env 隔离债**：族A 401 连坐根因（dotenvx 吸宿主 env），T5 卷候裁项原样在案。

## 五、push 候裁

- 两笔 commit 入库（本地 dev 顶）；push 照先例候 COO 收口批并卷（TriCompany/TriMMC 两仓各一笔）。

## 六、使用依据

- CTO 追裁令 verbatim（COO 21:15 转达）：案一采纳+细则四条+验收锚不变
- 任务书 sg 树 task-charter-batch-15-3.md（2bd0d8c9）：任务①②+验收锚+禁面四条
- 本席卡点卷 fsd-batch15-3-blocker-readout-20261002.md（三案候裁前置卷）
- 实测证据：三跑全量 log（TEMP/trimmc-full-batch153*.log）+溢出 log+反事实实验序列（stash hash e444645d）
- 治理面：board.contract.yaml 全文 58 行实勘+15 份持有面普查（卡点卷表）
