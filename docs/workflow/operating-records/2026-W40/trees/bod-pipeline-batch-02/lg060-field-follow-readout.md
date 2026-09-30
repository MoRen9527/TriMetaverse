# LG-060 件 3 读数卷·字段族测试面跟新至 source-agents v3 现役

- 执行: m-duty-fsd（FD）；任务书=本目录 task-charter-bod-pipeline-batch-02.md 件 3；供弹=batch-01 lg060-drift-inventory.md（TriRLC 三族零断言=结构型漂移主体）
- 交付锚: TriRLC 仓 dev **3800e2d**（8 files, +583/−3）
- 面归属勘定: 供弹卷对平面=TriRLC（sg 副本）三族；TriMMC 面 contract-resolver.test.ts 已 assert 字段族 v3 形（现势复核），故本件面=TriRLC 三族。**45 处计数复现**：三族 it() = 5+3+38 = **46**（值席记 45，±1 系计数法差〔疑一例 skip/todo 口径〕，本卷按实勘 46 逐处对表，不凑数）

## 一、实现方案（投影穿透先例形）

- 漂移本质: TriRLC resolver 域投影丢弃 v3 字段族（loadContractV3 解析后仅存 paths/decisionRights/systemPrompt/toolControl），测试期望面无从断言
- 修形（TriMMC src/contracts/resolver.ts:24/53 同构先例）:
  - `src/config/contract-resolver.ts`: AgentContract 增 `tools: AgentContractV3['tools']` + `runtime_baseline` 透传；新增 getTools/getRuntimeBaseline
  - `src/company/session-initializer.ts`: SessionConfig 增 tools/runtime_baseline 携带
  - 类型注记: 包根 `ToolSpec` 绑 loop 面（camelCase riskLevel），契约面经 `AgentContractV3['tools']` 直取——零新增导入
- 期望面现役形（真源=source-agents v3 + agent-core AgentContractV3Schema strict）: `tools[].runtime_equivalent: trimc:*`（小写=兼容面值）+ `runtime_baseline: {host, tri_mc_status, tri_mc_migration_ready}` 对象形

## 二、46 处逐处对表

### contract-resolver.test.ts（5 处）

| # | 用例 | 处置 |
| --- | --- | --- |
| 1 | resolves contract paths from the source-agents root | ✏️ fixture 增字段族+新增 tools/runtime_equivalent/runtime_baseline 断言 |
| 2 | uses agent body frontmatter when dedicated frontmatter empty | 🔧 fixture 跟新（随 v3Contract() builder 携带字段族；用例断言面不涉字段族） |
| 3 | rejects v2-shaped contracts (negative path) | ⚪ 负路径 v2 形无字段族落点，共享 builder 跟新即视跟；断言不变 |
| 4 | getRoleCatalog: identity 面解析+roster tier/isGovernance | 🔧 fixture 跟新（随 builder；断言面=role catalog 非字段族） |
| 5 | getRoleCatalog: roster 未加载→null | 🔧 fixture 跟新（随 builder；负路径断言不变） |

### session-initializer.test.ts（3 处）

| # | 用例 | 处置 |
| --- | --- | --- |
| 6 | initializes a session with contract assembly+workspace ready | ✏️ inline fixture 增字段族+SessionConfig.tools/runtime_baseline 断言 |
| 7 | ensureWorkspaceDir is idempotent | ⚪ 非契约面（工作目录语义），无字段族落点 |
| 8 | throws SessionInitError for unloaded agent | ⚪ 负路径（未加载 agent），无字段族落点 |

### knowledge-injector.test.ts（38 处）

| # | 用例（describe→it） | 处置 |
| --- | --- | --- |
| 9-10 | router path：knowledgeDbPath 落点/同源 | ⚪ 非契约面 |
| 11-16 | sync：全量三层落库/幂等重入/hash 重写/增量/dry-run/空文件 | ⚪ 知识库同步面（fixtures 为五件套 md，非 contract 结构） |
| 17-18 | project isolation：跨项目拒绝/双项目独立 | ⚪ 非契约面 |
| 19-23 | injection：块组装/追加/重复留痕/无知识降级/空 prompt | ⚪ 注入块面（消费三层 md 契约层，不触字段族） |
| 24-27 | behavior metrics：v1→v3 库迁移/计数聚合/快照/isEscalationBlockReason | ⚪ 指标面（此处 v3=knowledge schema 版本，非合同 v3） |
| 28-29 | cron shouldRunJob/agent-tool spawn 门禁 | ⚪ 门禁面 |
| 30 | session-initializer main path·before() inline contract fixture | ✏️ fixture 增字段族（v3 现役形） |
| 31 | initializeSession systemPrompt 含知识注入块 | ✏️ 增 config.tools/runtime_baseline 透传断言 |
| 32-34 | heartbeat 挂接点：env 注入/显式 projectRoot/无库降级 | ⚪ heartbeat 注入面 |
| 35 | resolveContentRoot 推导 | ⚪ 非契约面 |
| 36-40 | 内容层：wiki 注入/幂等/过期移除/agentFilter/inbox 窗口 | ⚪ 内容层面 |
| 41 | dry-run 内容层 | ⚪ 非契约面 |
| 42 | contentRoot 未部署契约层照常 | ⚪ 降级面（fixtures 无 contract 结构） |
| 43 | parseInboxRecord 纯函数 | ⚪ 非契约面 |
| 44 | inbox 注入块消费链路 | ⚪ 注入面 |
| 45 | layerDomain 契约层=contract | ⚪ 域后缀面 |
| 46 | schema v2→v3 migration（describe 尾例） | ⚪ knowledge 库 schema 迁移面（非合同字段族） |

- 处置汇总: ✏️ 断言+fixture 双跟 = 5 处；🔧 fixture 级跟新（随共享 builder）= 4 处；⚪ 非契约面无落点（跟新判定=不适用，非跳过）= 37 处
- ⚪ 判据: 字段族落点=contract YAML 结构构造/解析/断言行；零落点用例跟新属过改（禁过改纪律）

## 三、测试门全量读数（四项，同件 2 门）

- 运行时前置: sg 系统 node=v18.20.8 无 `node:sqlite`（server/* 面整文件加载失败）；**sg 用户级 node22 已装**（~/node22 v22.23.3，仅测试面 PATH 注入，零系统变更），门读数以 node22 为准

| 项 | 基线·node18 | 基线·node22（装依赖后） | 件 3 后·node22 |
| --- | --- | --- | --- |
| 总数 | 77 | 203 | 203 |
| 通过 | 64 | 190* | 199 |
| 失败 | 13 | 13 | 4 |
| 跳过 | 0 | 0 | 0 |

- *node22 基线应为 190/13（77/64/13 为 node18 半瘫读数）；件 3 净收口: 13→4（−9）
- tsc 门（npm run check）: 本件面零错 ✓；**预存 5 错=src/letter-store/lead-tools.ts**（agent-core file: 依赖 API 代差 Expected 2 args got 3，非本件面）——卡点在案

## 四、卡点在案（4 挂+5 tsc，全部预存·out-of-face）

| # | 挂点 | 根因 | 归属 |
| --- | --- | --- | --- |
| 1 | letters endpoints·R1 live push | 流事件帧 `task_error` ≠ `letter`（LG-026-P2/P3 行为/测试漂移） | 候 CTO/STE |
| 2 | FADE-005 派工门禁·owner_not_active 409 | 409 行为与期望差（roster-gating 产品面） | 候 CTO |
| 3 | FADE-003 metrics 可见性 | routing_error 计数 2 < 期望 ≥3（计数漂移） | 候 STE |
| 4 | tui components.test.ts | ink 嵌套 react-reconciler 与仓 react@19.2.8 冲突（reconciler init 崩）——devDeps 已补 ink/ink-testing-library，版本对齐候专窗 | 候 CTO |
| 5 | lead-tools.ts tsc 5 错 | agent-core API 代差（构建门预存红） | 候 CTO |

- 顺手修复（LG-059 同族残余，候裁注）: `src/server/app.ts:1740/:2903` 改名事故字 `'trirlc'`→`'trilc'`（service/owned_by 字符串值；测试期望面为锚）——auth-gate e1 随之转绿
- 测试基建（LG-059 缺装实证半件）: devDeps +ink@^5.2.1 +ink-testing-library@^4.0.0；package-lock.json +497 行随件提交

## 五、使用依据

- batch-01 lg060-drift-inventory.md + task-charter-bod-pipeline-batch-02.md 件 3
- source-agents v3 契约现役（full-stack-developer.contract.yaml 等 13+ 文件）+ agent-core AgentContractV3Schema（strict）
- TriMMC src/contracts/resolver.ts:24/53（投影穿透同构先例）
- TriRLC 仓 3800e2d diff 为改动唯一真源
