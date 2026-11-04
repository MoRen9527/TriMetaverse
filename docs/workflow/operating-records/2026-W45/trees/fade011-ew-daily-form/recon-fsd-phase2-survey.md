# recon-fsd-phase2-survey · ew 迁 TriMMC 阶段二工序 1 勘定卷（FSD 施工侧·只读）

- sourceOfTruth: 本卷（LG-092 阶段二工序 1 勘定正身·FSD 面——回执 CTO 候核后进工序 2）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO 派工两件工单（08:08Z）件 B·重排令 08:19Z（连续 tree 形态·工序 2 零等窗）
- 上游: cto-phase2-migration-plan.md（e3f10ba10+重排勘注 6c29739d4）·cto-mmc-migration-recourse.md（43cd92e54）
- 勘定纪律: 全只读·活体优先（sg 侧 ssh 活体现探两轮）·TriMLC 无 codegraph 索引降级直读（令面在案）

## 勘① · fade 模块文件组清单化+依赖面

**移植面 7 文件 1969 行**（watch.ts 320 行不随迁·裁示在卷）：

| 文件 | 行数 | 外部依赖 | 内互依赖 |
|---|---|---|---|
| types.ts | 133 | node:sqlite（type-only） | 无（纯类型+常量·RUN_STATES 十三态链） |
| state-machine.ts | 150 | 无 | ./types.js |
| store.ts | 495 | node:sqlite DatabaseSync+node:fs+node:path | ./state-machine.js+./types.js |
| closing-gate.ts | 231 | node:child_process+fs+path+url | ./types.js+./state-machine.js+./store.js（type） |
| skill-loader.ts | 351 | node:fs+path+url | 无（零内互——独立解析面） |
| driver.ts | 481 | node:crypto+fs+path | ./closing-gate.js+./skill-loader.js+./state-machine.js+./types.js+./store.js（type） |
| recovery.ts | 128 | 无 | ./state-machine.js+./store.js+./types.js |

- **依赖闭包定谳**：内互依赖全在 fade 目录内闭环·外部依赖纯 node 内建——与回询卷 §一.2「自含」实锚吻合（**但其 node:sqlite 版本可用性面=回询卷盲区·见勘⑤**）。
- **TriMLC app.ts 挂接面三点**（工序 2 移植对照）：import 段 L119-141（recovery/driver/types/watch 五组）·boot 链 L1613-1655（openFadeStoreAndRecover(env.dataDir)+resumeUnfinishedRuns fire-and-forget+watch env 三键 fail-closed——watch 段不随迁）·端点段 L1975-2020（POST /internal/v1/fade/runs：body {runId,treeDir[,idempotencyKey]}→createAndDriveRun 同步驱动至终态·fadeBoot null→503·runId/treeDir 缺→400·树元数据请求体贯通零硬编码）。
- **writeAuthority 语义字段**：端点段硬编码 `writeAuthority: 'daemon:trmlc'`（+homeDomain 'M-plane-local'·profile 'runtime-owned-durable'·version 'fade011-s5-driver'）——TriMMC 侧值候裁（'daemon:trmmc' 形？DDL CHECK 无约束此字段·纯语义标识）。

## 勘② · TriMMC app.ts 端点挂接点+鉴权复用面

- TriMMC src/server/app.ts **869 行**（vs TriMLC 5554——面小挂接轻）。
- **统一 token 门在位**：L153-173 `TRIMC_INTERNAL_TOKEN` fail-closed 门（未配置=401 全拒 internal_auth_disabled）——`/internal/` 前缀统一鉴权·**fade/runs 分支照挂即自动入门·零新中间件**（复用面成立·回询卷预设吻合）。
- 端点谱 17 条 /internal/v1/*（agents/tasks/notify/echo/chat/agent/heartbeat/mirror/cron/config/events）——挂接位风格 `req.url === '...' && req.method === '...'` 精确匹配形，fade/runs 照此形插分支。
- **boot 链挂接位**：TriMMC app start() 内对应 TriMLC L1613 段位（openFadeStoreAndRecover(env.dataDir) 形——TriMMC env.dataDir 键名对表候工序 2 施工时核）。

## 勘③ · fade.db schema/初始化面

- 后端=**node:sqlite DatabaseSync**（node 内建·非 better-sqlite3）。
- `createFadeStore(dbPath)`（store.ts L265）：PRAGMA journal_mode=WAL+foreign_keys=ON·五表 DDL IF NOT EXISTS——fade_runs（十三态 CHECK 约束+idempotency_key UNIQUE+retry_budget/count+checkpoint+三 skill_version 列）/fade_run_transitions（审计链·actor CHECK 四值）/fade_gate_rejections（S4 拒翻转明细）/fade_watch_state+fade_watch_audit（watch 两表）。
- **watch 两表随迁形态**：零改动直搬正形下 store.ts DDL 含 watch 两表（零消费者·冗余无害）vs 剥离（改 store.ts 破直搬正形）——**建议保留零改动**（直搬正形优先·冗余表零行为面）候 CTO 裁。
- dbPath 落点：TriMLC 形=join(env.dataDir, 'fade.db')（env.ts L156-158 注记防 drive-root/cwd 相对形）——TriMMC env.dataDir 对表施工时核。

## 勘④ · tri-skill 技能栈 sg 解析面

- `resolveTriSkillSkillsRoot(envOverride?)`（skill-loader.ts L25）：env 覆盖优先→缺省 `dirname(fileURLToPath(import.meta.url))` 上三级=`TriSkill/skills/engineering`。
- `resolveTriSkillAgentsMd(skillsRoot)`（L349）：`resolve(skillsRoot, '..', '..')/AGENTS.md`。
- **dev 机双仓同构**：TriMMC cwd 布局与 TriMLC 同构（D:/Code/ai 平级）——src 形解析正形成立零改动。
- **sg 活体现探（2026-11-04 只读两轮）**：
  - TriSkill 布点在位：`/srv/fleet/TriSkill`+`AGENTS.md`+`skills/engineering` 全存在——/srv/fleet 工作区根同构成立。
  - **src/dist 深度差实锚**：src 形 `/srv/fleet/TriMMC/src/fade`→../../..=`/srv/fleet` ✓ 正形可达；**dist 形 `/srv/fleet/TriMMC/dist/src/fade`→../../..=`/srv/fleet/TriMMC`（仓根）→TriSkill 解析落仓根下=不存在**。
  - **sg 8712 现役=dist 形实锤**（trimc-start.sh `exec node dist/src/index.js`·cutover 2026-09-29 SDE）→**sg 正形=env 覆盖强制**（envOverride 参数已在位——工序 2 施工形：挂接面传 process.env 显式键或缺省回退不改——env 键名候 CTO 裁，候选 `TRIMC_TRI_SKILL_ROOT` 形）·或 sg 侧补 `/srv/fleet/TriMMC/TriSkill` 链接（不推荐·布局污染）。resolveTriSkillAgentsMd 在 env 覆盖形下=skillsRoot 上两级=`/srv/fleet/TriSkill/AGENTS.md` ✓ 活体在位。

## 勘⑤ · 【blocker 级新发现】sg node 版本 vs node:sqlite 可用性

- **sg node=v18.20.8 实锤**（fleet 态 `node --version`·nvm 零候选·PATH=/bin/node）。
- node:sqlite（DatabaseSync）需 **node ≥22.5**（22 系 experimental flag/23+ 无 flag）——TriMLC 本机现役跑通系本机 node 版本在位。
- **fade store 在 sg node 18 下 import 即崩**（ERR_UNKNOWN_BUILTIN_MODULE 类）——全 fade 栈（store/recovery→app boot 链）不可运行·**移植后 8712 端点 503 化**。
- **回询卷 §一.2 适配面盲区自勘**：该条只勘了「外链全 node 内建」的内建性·未勘内建模块的**版本可用性**——本席续勘补齐。
- **处置三候选呈裁**（CTO）：
  - **a) sg node 升级 ≥22.5（建议）**：一次性基建升级·零代码改动保住「零改动直搬」正形；代价=8712 在役服务 node 18→22 跳版回归面（agent-core/croner/pg/依赖面兼容性·start.sh 零改）——**工序 3 SDE 窗关键项前置**·升级窗回滚=nvm/双版本共存形。
  - b) store.ts 后端替换 better-sqlite3：破坏直搬正形+新增 native 依赖编译面（dev/sg 双面构建复杂度+1）·不推荐。
  - c) 维持 node 18+polyfill：不可行（API 面差异大·禁 hack 形）。
- 若采 a)：工序 2 代码窗照进（代码面零阻塞）·工序 3 部署面增「sg node 升级+8712 回归验证」前置步——**连续 tree 形态下 SDE 面并行动作**。

## 勘⑥ · sweep 脚本适配面（fade-daily-sweep.mjs 63 行实锚）

- 四硬编码定位：OP_ROOT=L12（'D:/Code/ai/TriMetaverse/docs/workflow/operating-records'→sg='/srv/fleet/TriMetaverse/docs/workflow/operating-records'）·PORT=L13（8713→8712）·token 提取正则=L41（`^set TRILC_INTERNAL_TOKEN=…$` 从启动器 cmd 文本抽→**sg=TRIMC_INTERNAL_TOKEN**·键名换+**token 载体换**：本机=trimlc-daemon-channel.cmd·sg 候选=unit drop-in/独立 env 文件/start.sh 侧载体——**工序 3 SDE 勘定项**·D-46 值面纪律）·CMD_FILE=L40 邻（本机启动器路径→sg 对应载体路径）。
- fetch 形=L50 `http://127.0.0.1:${PORT}/internal/v1/fade/runs`——sg 照形零改。
- 8712 新 job 形：嵌套 payload `{command, cwd}`（TriMMC 无 ALLOWLIST·平铺 400 形异构实锚在卷）——command=`node /srv/fleet/TriMetaverse/scripts/fade/fade-daily-sweep.mjs` 形+cwd=/srv/fleet/TriMetaverse 形候工序 4 定谳。

## 勘⑦ · 8713 现役 job 对照+白名单面

- fade011-daily-sweep=cron_mw1rdhym_7pwt·`30 3 * * *`·enabled=1·command=`node D:/Code/ai/TriMetaverse/scripts/fade/fade-daily-sweep.mjs`（node 绝对路径直调·不含 bin 名——白名单零改动实锚吻合）。
- 8713 cron store 正位=**trilc-channel\cron.db**（TRILC_DATA_DIR=C:\Users\jedih\AppData\Local\trilc-channel·启动器 trimlc-daemon-channel.cmd 实锚——非 trilc\cron.db 空表位·双 store 分立禁路径直觉教训自领）。
- 8713 照跑不中断（观察窗 11-05/06 两发）——迁移窗内零动作（裁 Z' 语义）。
- env 面注记：TRILC_FADE_WATCH_TREE_ROOT 现值已为 {week} 模板形（段二件1 部署面 env 已切·watch DIRS 空值 fail-closed off 维持）。

## 工序 2 执行终态（2026-11-04·CTO 四裁达落笔毕）

CTO 核令 08:43Z 采认勘定全谱+四裁达，工序 2 当窗连续进毕：

**四裁落笔**：
- 裁① 勘⑤=sg node ≥22.5 隔离升形（双版本共存·单 unit 定向切换硬约束）——工序 3 SDE 面执行，代码面零阻塞。
- 裁② writeAuthority=`'daemon:trimmc'` 端点落笔（TriMLC 旧值禁直搬成立）。
- 裁③ watch 两表随搬零改动正形（store.ts DDL 直搬·死表注记在卷）。
- 裁④ env 键=`TRIMMC_TRI_SKILL_ROOT` 端点+boot resume 双接入（未设=缺省 scriptDir 解析 dev 布局·sg dist 形由工序 3 SDE 落 unit env）。
- 裁⑤ 门禁基线「新增零红+既有不扩散」采认执行。

**三 commit 链（TriMMC dev·与移植分 commit 达成）**：
- `838cc23` TS2345 勘修单（前置消解·session-initializer.ts paths.soul optional 三元收窄一行——PathsSchema soul optional（agent-core batch-15 件③ Registry 无四件套）+L96 filter(Boolean) 组装天然容忍=语义正形最小 diff；stash 双态证据链：BASE_BUILD_RC=2→FIX RC=0·test 642/610/31/1 双态全同+not ok 名单 diff 全同）。
- `634902f` 件 A 残项四仓扩面 TriMMC description（amendment 08:51Z·CAO 裁 54f054d；TriRMC 3a39751 同形另仓——D-68 阶段一 naming 残项全闭环）。
- `0de548a` 工序 2 移植正身（16 files·+3777：src/fade 7 文件 cmp IDENTICAL 直搬+app.ts 三挂接+测试随搬+wiring 案+.gitignore data/ 行）。

**挂接面实施要点（勘定卷外新增勘定）**：
- TriMMCEnv 无 dataDir 字段（vs TriMLC env.dataDir）——store 落位定谳=`process.env.TRIMC_CONFIG_DIR ?? path.resolve('data')`（defaultConfigDir 同形·config-sync/cron 现役同位惯例）。
- skillsRoot 消费链实锚：FadeDriverOptions.skillsRoot→defaultWorkers→resolveTriSkillSkillsRoot（envOverride 参数在位·TriMLC 现役零 env 键消费=TriMMC 侧显式接入为新增面）。
- fadeBoot 作用域=TriMMC start() 内局部 let+createServer 回调闭包捕获（TriMLC 同构形）。
- homeDomain 沿直搬原值 'M-plane-local'（四裁未涉·**候裁注记**：TriMMC=M 面 sg 服务域语义是否须别值·候 CTO）。

**测试面终态**：
- 随搬 fade 模块单测 7 文件全绿（fade-store 15/skill-loader 15/state-machine/closing-gate/driver/recovery 全谱）。
- 不随迁三件（TriMLC 仓原样零动）：fade-watch.test（watch 同族）·fade-kill-drive/kill-restart（**TriMLC daemon 级 E2E 实锚**：TRILC_* env 全谱+`[trilc] ready` 启动序+TriMLC index 入口耦合——非 fade 模块单测·勘定卷门禁「fade 模块单测随搬」边界外）·fade-boot-wiring（createTriLCApp 面）。
- fade-skill-loader 尾部「env dataDir guard」suite=TriMLC config/env.ts 层测试（TRILC_DATA_DIR 断言）非 fade 面——不随迁+适配注记入件。
- 新增 fade-runs-endpoint.test.ts 端点 wiring 案 4 tests 全绿（401 统一门/400 形×2/200 envelope 壳契约——真驱动深度归 TriMLC 在役 E2E+工序 3 sg 活体验证）。

**门禁读数**：build RC=0·test 723/691/31/1——红集合与工序 2 前基线（642/610/31/1）逐名相同仅序号平移（剥序号归一 diff 零差=零新增红零扩散铁证）·fade 面零红。

**教训自领**：sed 行号段删 wrapper 头坑（fade-skill-loader 适配时 `264,300d` 吞掉文件尾 after(()=>{ 头致孤儿块 transform 错·全量才暴露）——段删除后必须单文件跑验证+边界行断言，非全量兜底。

**工序 2 状态=毕（READY_FOR_REVIEW）**。候 CTO 门禁审查；工序 3（SDE 部署面+sg node 22 升级+unit env 落键+8712 单重启窗双变）候 CTO 施工单。

## 工序 2 前置清单（原卷留痕·已执行毕）

1. 移植面=7 文件直搬（src/fade/ 零改动）+app.ts 三挂接（import/boot 链/端点）+boot 链 watch 段剥离。
2. 候裁三点：writeAuthority 语义值（'daemon:trmmc' 形？）/watch 两表保留剥离/env 键名（TRIMC_TRI_SKILL_ROOT 形？）。
3. **blocker 勘⑤ 处置裁决先行**（建议 a：sg node 升级入工序 3 SDE 面前置）。
4. 自测门禁形：TriMMC test 642 既有 31 红+build 既有债（TS2345 session-initializer.ts:91,49 在案）——移植面新增测试对照面=fade 模块单测随搬+端点集成案·门禁判据候 CTO 对既有红基线裁定（新增零红+既有不扩散为基线）。

## 使用依据

- CTO 派工令 08:08Z 件 B+重排令 08:19Z·排窗卷 e3f10ba10/6c29739d4·回询卷 43cd92e54
- TriMLC src/fade/ 七文件全卷+src/server/app.ts L119-141/1595-1660/1955-2045 直读·src/config/env.ts dataDir 链
- TriMMC src/server/app.ts L153-173/端点谱·src/internal-token.ts 键名（回询卷实锚承引）
- sg 活体现探两轮（sg-ecs-server ssh 只读：TriSkill 布点+node 版本+unit/start.sh 形态·token 值面全程掩码）
- 本机活体：trilc-channel\cron.db job 谱·trimlc-daemon-channel.cmd 结构（token 值面滤除读）
- D-15 派工链·D-46（值面掩码）·D-47（卷面时戳=commit 时戳）
