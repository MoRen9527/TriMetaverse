# FADE-001 第一阶段五要点联审 · CTO 分卷（技术面三问主答）

- sourceOfTruth: 本卷（COS 组审派工 2026-11-12T23:12:30+0800 承接·CTO 三问主答席）
- syncMode: static（联审意见卷·审只出意见零改动）
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源链: CEO 22:47 总令→CEO 23:06 勘正+联审授权（COS 批即可）→BOD 集散流转→COS 组审六要素→本卷
- 素材链: intake.md 六要素+映射总表 1c0ebf66e+BOD 研究笔记 be5737eed+真源 §三（7da350710）全读毕；本卷出稿前另做五处代码实勘（TriCompany 迁移器/TriRMC cron 面/agent-core job-store/ TriRMC allowlist 面/payload 史料）——三问答案以实勘读数为锚，非纸面推演。

## §零 实勘发现总览（先于三问——两条勘误影响全部答案的地基）

1. **P1 改点 A/B 机制已在迁移器内实装（11-10 施工窗·TMV fa69fcd9d）**：`weekly_plane_shift.py` L256-289 `_preflight_bare_sync`（fetch-only 分叉门·left>0 拦·`_diverge_verdict` L233-245 四态判）+main 第一步调用（L371）+拦截面 exit 3+ADE 落卷+`_notify_blocking` 双址 blocking 告警（L383-397）+改点 B notify_failures blocking（exit 4 升级语义 L460-463）——**「分叉预检+拦截+blocking 告警」全链代码已在，位置不对**。
2. **执行序死区（要点 2 的真实缺口）**：payload ①段 `git pull --ff-only` 在迁移器之前——diverging 时 pull 先 exit 128、`bash -e` 短路、迁移器内预检**跑不到**。映射总表 §三要点 2「跑不到就永远检不了」判读与代码实勘精确吻合。**推论：BOD 研究「11-15 若 diverging 再现原样再炸」判读在 payload 未改前提下成立——11-10 装的预检防不住现役病灶形**。
3. **勘误一（COS 组审令文护栏预设）**：TriRMC 侧 cron **无 ALLOWLIST 机制**——本机 TriRMC `src/cron/`（command-handler/service/routes/index/week-math 五文件）grep allowlist/ALLOW 零命中。ALLOWLIST 精确全串比对+改形必 403+追加须重启=**TriRLC（本机 8711）侧家族纪律，非 TriRMC 现役面**。河源 payload 改形=改 jobs.json+重启即生效，无 403 门槛（河源部署版同源推定·施工窗活体复核一道）。**组审令文「ALLOWLIST 护栏改形必 403 须追加+重启双步施工序」对河源不适用——施工序反而简化，但护栏摩擦不存在=改形窗须自带防护纪律（改前备份 jobs.json+改后值面三查+enabled/nextRunAtMs 不抹）**。
4. **勘误二（四断言「四」与代码现势出入）**：真源口径「plan 前置断言四条（hostname/ff 断言/无进行中 git 操作/8710 healthz）」——迁移器 main 段实勘只见**分叉预检一条显式实装**；hostname/无进行中 git 操作/8710 healthz 三条未见独立断言代码（或以更弱形态存在）。上移施工不是「搬四条」而是「抽取一条现役+补装三条」——工作量评估据此修正。

## §一 问①可行性（五要点逐件·文件/函数级+工作量级）

### 要点 1 铸 run id

- 改动面：**payload command 片段（bash 内）**——`RUN_ID="shift-W{fromWeek}-$(date -u +%Y%m%dT%H%M%SZ)"`；run 目录 `/var/lib/trirmc/cron/runs/$RUN_ID/` 由 bash 自管（mkdir+tee 聚合后续输出）——**daemon executor 侧零改动**（executor 在 bash 跑之前已按自己时间戳建 per-run log，run id 在 bash 内铸 executor 不知悉——两层 log 并存：executor log=daemon 视角照旧，run 目录=run 视角新增，F1 判据读 job-store 状态非 log 文件，无冲突）。
- 形制建议：W 段挂 **fromWeek（迁出周）**——run 语义主体=「把 W(n) 平移到 W(n+1)」，日志/考卷记录对象是被迁移的旧周；且 fromWeek 来自 payload 占位符（daemon L4 周算术已展开传入 bash）——**run id 的 week 与实际迁移周同源，天然防 run id 与迁移周脱节**。形制定谳=方案稿面（CEO 阅面五件之一），本卷供技术建议。
- 边界注：executor 原生 run id env 注入（改 TriRMC 引用的 agent-core job-executor）留 DCE 段重构窗（§二）。
- 工作量：**0.5 天**（payload 片段+run 目录约定+一轮实弹验证）。

### 要点 2 preflight 上移

- 改动面：**TriCompany 仓内新入口模块**（候选 `runtime/cognition/preflight.py` 薄壳：调 `_preflight_bare_sync` + 补装三断言 + 统一退出码语义）+payload 前置调用 `cd /srv/fleet/TriCompany && python3 -m runtime.cognition.preflight --from {fromWeek} --to {toWeek}`。**抽取而非新写**——分叉预检现役代码已实测（11-10 窗施工+L237 注释判据完整），入口化=薄壳+补装。
- 落位论证：preflight 落 TriCompany 仓内=①随 pull 自动分发（更新零部署成本）②检的正是该仓态自包含③与迁移器同仓同测试纪律面。**鸡蛋注（如实）**：触发段用的 preflight=pull 前版本（不随本轮 pull 更新）——四断言皆为环境探针（hostname/git 态/分叉/healthz），不依赖自身版本新鲜度，可接受；版本差=显式打印 preflight 版本进 run 目录留痕。
- 补装三断言的技术形：hostname=常数比对（河源机名）；无进行中 git 操作=`git status --porcelain` 非空+`MERGE_HEAD`/`rebase-merge` 存在探针；8710 healthz=curl 127.0.0.1:8710/healthz 带 timeout。三条皆一行级探针，与分叉预检共用退出码/告警链。
- 工作量：**1 天**（入口化+三断言+单测+河源活体验证）。

### 要点 3 触发告警闸

- 改动面：**TriRMC daemon 内新告警模块**（`src/cron/` 新文件·候选 alarm.ts）+service.ts 挂载一行+单测。判据 per-job 读 job-store 状态（非读 log 文件）：a) 漏拍分支=`now > nextRunAtMs + grace` 且无新 run 记录；b) 败跑分支=`lastRunStatus=error` 持续 N 分钟无成功。**独立 timer**（与 job-executor 平行）不侵入执行循环。
- dedup 形=**TriMLC power-monitor 11-12 窗同构先例直接复用**：时间窗 30min（窗内至多 1 条）+稳定窗重臂（连 N 拍成功才重臂）+**复位不清窗锚**（11-12 窗自查勘定修正——稳定窗短路时间窗病灶的回归锚专测双案同款）。
- N 值参考：grace/败跑窗=30min（23:50 拍→00:20 前无 run 记录=漏拍告警，覆盖 30min 到岗窗）——精确值=方案稿面定，本卷供参考形。
- 工作量：**2-3 天**（五要点最大件·外发通道联调占半）。

### 要点 4 bash 改形

- 改动面：payload command 全串重写（jobs.json）+TriRMC systemd 重启——**无 ALLOWLIST 门槛**（勘误一），成本=一次改形窗+一次重启窗。
- **与拆分批统筹（关键窗序约束）**：拆分批（fade001-split-review 联审毕候批）同样动 payload.command（迁移域收窄改形）——两改形动同一字段=**必须一次写齐防两窗两重启**。合并窗（拆分+五要点一次改形：preflight→run id→轻量同步/迁移器）优先；若拆分批先落窗已定，五要点随其后增量改形（第二次重启窗成本可接受）。两形成本对表供 COS+COO 树权门禁窗统筹裁——本席技术判=**倾向合并窗**。
- 交棒两态（详见 §二）：过渡态（本阶段落地）bash 含迁移调用；目标态 bash 终点=交棒信号落卷。
- 工作量：**0.5 天**施工（前置=统筹裁决）。

### 要点 5 F5 顺手修

- 病灶实锚：agent-core `packages/agent-core/src/scheduler/job-store.ts` **L32-34**（`TRIMC_CONFIG_DIR ?? path.resolve(process.cwd(), "data")`）vs TriRMC `src/config/env.ts` L31（`TRIRMC_CONFIG_DIR ?? data`）——键错位实勘吻合；河源 systemd WorkingDirectory=/srv/fleet/TriRMC→store 落仓内 `./data/cron/jobs.json`，logs 落 `$TRIRMC_CONFIG_DIR/cron/logs`（command-handler.ts L37）——分家两目录机理全链条勘清。
- **顺手修裁=观测投影形（c2）**：job-store 路径解析结果投影到 TriRMC healthz（新增 `storePath`/`logPath` 字段）+启动日志一行——运维找 store 从「猜 env 键」变「healthz 直读真值」，扑空根治。**选形理由**：agent-core 是共享包（TriRMC/TriMLC/TriMMC 全引）——env 键对齐（a 形）或 store 搬家（b 形）=store 位迁移停窗+四 daemon 配置面波及，超「顺手」预算；投影形=纯增量零行为变化零搬家零波及。a/b 形留 DCE 段重构窗统一处理。
- 工作量：**0.5 天内**（job-store 投影接口+TriRMC healthz 挂载+单测）。

### 合计

一周施工窗内可毕。窗序三段：**preflight 先行窗（11-13，见 §三缓解形α）→主窗（合并统筹后：告警闸+run id+payload 改形）→顺手窗（F5 投影）**。

## §二 问②边界（归本阶段 vs 留 DCE 段重构·防过度设计）

**归本阶段**：

1. run id 铸形——bash 轻形（executor 原生注入不做）。
2. preflight 入口化+上移——含算周断言（γ 缝隙闸：validate 步加 `toWeek==预期周` 断言，成本极低；CEO 23:06 勘正「L4 周算术=触发参数定形+算周断言」正身要求，随 preflight 入口化一并落）。
3. 告警闸第一落位——daemon 内·job 级·dedup 先例形（外监护不做）。
4. payload 过渡态改形（bash 含迁移调用）。
5. F5 投影形。

**留 DCE 段重构窗**：

1. DCE 四段统一自愈标准（BOD Q2 制度面解法：pull/push/迁移器段统一 fallback 标准）——**等拆分后新链形定谳再设计，防改造一个即将消失的形态**（BOD Q8 判读本席认同）。
2. executor 原生 run id env 注入（agent-core job-executor 改动·四 daemon 波及面）。
3. qualify/plan 的 agent 承接面实现（阶段 2/3 是后续阶段本体）。
4. 告警外监护探针（daemon 全死盲区——跨机监护）。
5. ζ 重试语义验证+notify 链勘修（归 MMC/后续窗）。
6. env 键对齐+store 搬家（F5 a/b 形）。

**交棒点：接口预留 vs 承接实现切面（COS 追问件）**——**本阶段做接口预留、不做承接实现**：

- 预留=两份格式约定随 run 目录落卷：①run 目录结构约定（`runs/$RUN_ID/{preflight.json,manifest,聚合 log}`）②preflight 结果文件格式（verdict/readback/退出码语义——`_preflight_bare_sync` 现役返回三元组已是好接口，照抄）。
- 过渡态承接=bash 内直接调迁移器（现役 L6-L7 原样·内含 P1 自愈）——周迁移不停摆；目标态接线（到岗 agent 拾取 run 目录→qualify→plan→DCE）=流水线建成窗，届时格式约定已备好，agent 侧按约定读——**这是「预留」的全部含义：落卷格式一次定对，承接面后来者不返工**。
- 过度设计防线三条：不建告警配置系统（阈值硬编码常量起步，治理面候数据积累）；不建 run 目录轮转治理（沿现役 rotating 形）；不预写 agent 拾取协议实现代码（格式约定文档一份即可）。

## §三 问③风险（三件显式答）

### 件一·告警器归属裁决（三子件显式）

- **job 级挂点**：TriRMC daemon 内 alarm 模块（独立 timer 读 job-store）——挂点归属域=本席（CTO）技术裁决，登记面随方案稿批入真源。BOD「service 级 degraded 3 周窗」判读本席认同且补一刀：max 聚合抹掉「哪个 job 在败」——job 级判定+dedup 是唯一正确粒度，无第二选形。
- **守护面**：告警模块与 daemon 同生命周期=河源 systemd 守护已有；值席 patrol 人工兜底保留（G3 教训：人兜底降级为最后防线而非唯一防线）。**盲区如实挂账**：daemon 全死形态（systemd 救不了·宿主宕机）层1 告警同死——外部探针（跨机监护 TriMLC/独立 watchdog 拉河源 job 状态）留后续阶段，非本阶段 scope，缺口感知=告警闸的已知边界，写进方案稿知情面。
- **告警外发通道**：**SMTP 主形**（独立性最好——不依赖任何可能同时死的 daemon；nodemailer 新依赖=可接受成本）+**HTTP POST 8712 NOTIFY 辅形**（现役链路有已知缺口：落箱缺口 r51 复现在账·MMC 勘修窗候——**依赖有缺口链路做主通道=告警可靠性打折，故辅形位**）；外发重试=通道自带 3 次退避，不依赖 ζ 验证结果（ζ 未定性不阻塞本件）。终裁=方案稿面（CEO 阅面五件之一）。

### 件二·施工窗序定性（含在途三件勘）

- **在途三件与本线零冲突**：registry 现役态注记（fade-registry.md）/patrol 改名施工（候批态·daily_progress_patrol.py）/docstring 勘修（同 patrol 文件）——本线触面=weekly_plane_shift.py+preflight 新模块+TriRMC src/cron/+agent-core job-store 投影——**共享文件冲突面为零，三件可并行无阻塞**。但 11-13 preflight 先行窗优先于三件（11-15 时钟权重更高）——窗序建议：11-13 preflight 先行（缓解形α）＞11-15 值守窗（缓解形β）＞主窗（统筹后）＞顺手窗（F5）——三件穿插任意顺手窗。
- **11-15 F4 临时缓解形态（技术可行性显式答·两形可叠）**：
  - **缓解形α（推荐·payload 一行级改形）**：①段 `git pull --ff-only sg-bare dev` 改为 `… || true`（pull 败不短路）+迁移器内预检接手拦截（exit 3+blocking 告警**已实装**）——「同样死，死得早、死得响、死在正确阶段」的最小实现，即本阶段要点 2 设计的直接预演。**前提验真一项**：河源检出须已含 P1 改点 A 版迁移器（11-10 窗后某轮 pull 成功即分发·推定成立，α 施工窗活体验一道）。风险面=pull 败后迁移器在旧检出上跑预检（旧检出代码旧但预检功能在——判 diverging 拦截 exit 3，不往下跑六步，无带病迁移面）。改形成本=一行+重启+改前备份+改后值面三查。
  - **缓解形β（零改动·值守窗）**：11-15 23:50 前后值席值守窗（COO 排班）+值席手工跑 preflight 探针（bash 单行 git fetch+rev-list 判分叉）+diverging 即时人工处置（fetch+merge 或按 11-08 处置先例）+炸则 runbook §5 补跑兜底——纯人工零现役风险。
  - α+β 叠加=技术防护+人工防护双保险；α 施工窗=11-13 或 11-14（SLA 日或次日），赶在 11-15 前有 1-2 天观察余量。
- **合并窗 vs 增量窗**（§一要点 4 已展开）：倾向合并窗；裁决权=COS+COO 树权门禁窗统筹，本席供成本对表。

### 件三·F4 深层风险注

拆分批与五要点批的关系若悬而不决，payload 改形可能被迫三窗三次（拆分改形→五要点改形→α 缓解改形）——每次重启窗都是河源 cron 服务瞬断窗（11-12 勘修窗实测≈40s）。**建议联审结论显式含「payload 改形统筹单窗原则」**：11-15 前只允许 α 一行级缓解改形，其余改形等合并窗一次写齐——三窗收敛为一窗+一次缓解。

## §四 无意见明示条

除上述 §零-§三意见外，**无其他意见**。五要点方向全部同意（可行性成立·边界划清·风险有解），分歧点仅窗序统筹权归 COS+COO（本席不裁树权）。

## 使用依据

素材三件（intake.md 六要素/映射总表 1c0ebf66e §二三五/BOD 研究笔记 be5737eed §二三四六/真源 fade-001-improvement-20261110.md §三全节含 G1-G3）/代码实勘五处（weekly_plane_shift.py L222-289+L346-463 预检与 main 全序；TriRMC src/cron/ 五文件清单+allowlist 零命中；agent-core packages/agent-core/src/scheduler/job-store.ts L32-34 读键；TriRMC src/config/env.ts L19-31+command-handler.ts L37；operating-records W33 r1-1 brief+W42 cto-verdict payload 史料）/本席 11-12 勘修窗毕报（dedup 同构先例·TriMLC 8fa3b97）/11-10 P1 改点 A/B 施工（TMV fa69fcd9d）。

—— CTO 小狄（m-cto·五要点联审技术面主答），2026-11-12 23:24 CST（写前现查 2026-11-12T15:24:26Z=23:24:26+08 原值）
