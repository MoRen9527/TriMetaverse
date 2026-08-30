# LG-019 双席联审意见书——CTO 席（小狄，技术视角）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/lg-019-opinion-cto.md
- syncMode: source-only
- lastSyncedAt: 2026-08-31
- 性质：LG-019「本地 TriRLC worktree 去留」双席联审 CTO 席意见书。边界：只评估+立法/执行建议，不动任何分支/worktree/daemon（执行另令）。依据=评估底稿+拓扑正身+协议 v1.1+rmc_tick.py 源码+本席独立实勘（附录 A）。

## 一、总表态

| 方案 | 表态 | 技术理由 |
| --- | --- | --- |
| X（弃 worktree，独立 clone 自 sg-bare） | **APPROVE，为主案**（附 C1-C2 增补条件） | 唯一同时满足三约束的形态：与 heyuan 同形态同合同（rmc_tick `push origin dev` 天然契合）；R 面与董事会/CEO 主仓工作区隔离（主仓 9 modified 在途=隔离价值的现势实证）；单一 dev 分支模型与 CEO 对齐倾向同构 |
| Y（daemon CWD 直指主仓） | **REJECT**（与助理席一致，补技术理由） | 见下 |
| Z（维持 worktree 现状） | **不推荐**（比底稿评估更弱） | 见下 |

- Y 的三条技术理由：(1) 共享工作树脏干扰——主仓现势 9 modified 在途（拓扑正身 §一 row 5），daemon 会话/心跳/cron 落在主仓即互相可见可踩；(2) `push origin dev` 合同下主仓推送会裹挟 CEO 未提交在途物之外的本地 dev 提交，写路径语义与「对齐 heyuan」目标相悖；(3) 主仓 remote 语义是 origin=GitHub 优先+sg-server 次之（.git/config 实勘），与「sg-bare 为 dev 唯一正源」的读侧形态不一致。
- Z 的追加否决理由：双分支模型**在生产侧已经死亡**——heyuan 生产线 rmc_tick 合同就是 `push origin dev`（rmc_tick.py:198），v1.1 §四冲突预防规则 1「R 面 agent 不直接 push dev」与生产事实直接矛盾（协议 v1.1:60 vs rmc_tick.py:198）。保留 worktree=维持一套无生产线使用的分支模型法条虚构，法效成本高于底稿估计。
- 底稿 d/e 不变量论证核实：d 成立（但需 B2 服务端兜底补强）；e 成立——face 门在 `evaluate_backlog` 逻辑层（rmc_tick.py:138-139 严格 face=r-face 制），与检出形态正交，形态切换不触门禁不变量。

## 二、质证点 2 回答：漂移对齐起步形态（手工+派工前 pull 前置 vs 即刻自动化）

**判断：手工起步足够，不必即刻自动化——但必须带机器可查痕迹和明确的自动化触发线（tripwire）。**

依据（本席实勘）：

1. 本地无自动派工通道：本地 daemon cron 现势仅 1 个 `test-echo` 测试任务（C:\Users\jedih\AppData\Local\trilc\cron.db.json 实勘，runCount 226/errorCount 18 的 echo 任务）。漂移暴露面=派工频次，本地现势≈0。
2. 本地 r-face 树=0（底稿 §一 row 现势），utilization 近零，漂移窗内无人踩。
3. heyuan 先例即对齐目标本身：手工 pull+迁移 payload 前置 ff 拉取，形态对齐优先于通道先行；自动化应等 LG-018 镜像/对账统一裁决，避免先造第三条自动通道再改（底稿 §三 f 项判断正确，本席背书）。
4. 但漂移是**实然非假设**：拓扑实勘 heyuan=f284c19b 落后 sg-bare dev ≥3 commit——手工纪律的漂移窗已经在生产发生，只是 R 面队列静默所以爆炸半径≈0。这既支持「手工可跑」，也支持「必须预设 tripwire 而非凭自觉」。

**clone 磁盘/维护成本未见项（底稿成本清单外，实勘补充）：**

- U1 **ProjectRegistry 挂账未列**：project-registry.json 存有 WorkTree claim（branch=project/trimetaverse，claimedAt 2026-08-18，实勘）。退役必须同步清除/重指该注册，否则悬空 claim。底稿 §三 b 项清单（拓扑正身+§九）未含此项。
- U2 **daemon 实际 CWD 与底稿叙事有差**：daemon 进程 CWD 现势=C:\Users\jedih（trilc-daemon.cmd:11 `cd /d`，实勘），并非 WorkTree；§九「daemon cwd 指向 WorkTree」未勾与事实一致。WorkTree 挂接靠 ProjectRegistry claim 而非 daemon CWD。因此「切 CWD」的执行面是三处：daemon cmd 的 cd 行、project-registry claim、派工会话 cwd（app.ts:1287/1378/1394 实勘 env.cwd 透传 heartbeat+cron+companyInitState）——必须一次原子切换，否则重演今日「注册表指 WorkTree/进程指主目录」的半切换态。
- U3 磁盘：新 clone 重打包压缩，而主仓 .git 是 `compression = 0`（.git/config:8 实勘，对象未压缩存储），新 clone 体积大概率不大于主仓 .git；精确数字本席无命令执行面，执行时以 `git count-objects -vH` 实测（**未验证项，显式标注**）。R 面平面作业零构建依赖——rmc_tick 合同只写 operating-records 树内与 execution 树内（rmc_tick.py:197-198），无需 node_modules。
- U4 子模块差：主仓带 reference/vscode-copilot-chat submodule（OneDrive 本地路径，.git/config:9-11 实勘），新 clone 不带。R 面作业无关，执行时勿「顺手修复」。
- U5 维护成本实为「第二条手工对齐线」（heyuan+本地两条 manual pull 线），纪律执行点翻倍——这正是需要 C4 tripwire 的结构性原因。

## 三、协议 v2.0 修订量技术评估（双席质证点 3 前半）

**判断：底稿「四节修订」低估，不是高估。** §一/§二/§六/§九是核心破裂面，但按法条全文一致性标准，v2.0 必须触达：

| 节 | 修订内容 | 依据 |
| --- | --- | --- |
| §一 | 拓扑改单 clone（worktree 节点除名） | 底稿已列 |
| §二 | 双分支→单 dev；**project/trimetaverse-staging 一并除名**（生产零使用） | 底稿+本席补充 |
| §三 | 写入权矩阵列头「R 面 (worktree)」改语汇 | v1.1:33 |
| §四 | 迁移协作「WorkTree: git merge dev」步骤作废；**冲突预防规则 1 与生产合同矛盾必须重写** | v1.1:53,60 vs rmc_tick.py:198 |
| §五 | 步骤 4「commit 到 project/trimetaverse → push origin」、合并纪律「禁止在 worktree 中直接 push dev」整段作废重写 | v1.1:76,83-85 |
| §六 | 五实例表 TriRLC（本地 PC）行改独立 clone 形态 | v1.1:97 |
| §七 | §7.4 安全表第一行（WorkTree 追平 dev）、§7.5 第 1 层机器表「本地 WorkTree」行清理 | v1.1:180,190-194 |
| §八 | 「WorkTree 过旧」行作废；**新增「分叉即升级 M 面人工对账」处置行**（见 B1） | v1.1:239+本席新增 |
| §九 | 清单整体重立基线（旧清单 2 勾 3 未勾，见附录 B E1） | v1.1:243-249 |

即 9 节中 6 节实质改+3 节局部清理。文本量不大（249 行底子），但必须按**「全文一致性重写」立项**，不是四节 patch——否则 v2.0 内部残留「R 面不直接 push dev」与生产合同的法条自我打架。v2.0（模型级）版本判定正确。立法窗口：建议**独立树立法**（模型级变更值得独立评审窗，塞进下轮联审易被压缩），本席附录 B 勘误可直接喂入。

## 四、盲区指认（技术面）

- **B1（最关键）分叉恢复无预案且 agent 被禁自救**：漂移故障模式不是「浪费一次会话」。若 R 面会话已在本地 dev 产出 commit 而 push 被拒（上游已动），此后 `pull --ff-only` 必然失败（diverged），而 brief 禁 rebase/禁 force（rmc_tick.py:198，禁得正确）→ 只能 M 面人工对账。该故障形态已在线性史上发生过一次（TriLC 双线 28 commit 分叉人工合并先例）。手工纪律是预防，但 v2.0 §八必须预先写好「push 被拒即停+升级 M 面」处置行，否则第一次事故是即兴处理。
- **B2 sg-bare 无 pre-receive hook**：拓扑实勘「pre-receive 无」。协议 §7.5 第 3 层的 force-push 服务端防护（连代码都写好了，v1.1:210-221）**从未部署**。单 dev 模型把全部写入方集中到 dev，防护只剩 prompt 纪律。方案 X 落地应把该 hook 部署列为配套硬化项，d 项「天然对齐」才有服务端兜底。
- **B3 切换期半切换态**：退役序错置会制造悬空（registry 仍 claim 已 remove 的 worktree、或会话仍在 WorkTree 内运行时 remove）。执行序见 C2。
- **B4 凭据/账户绑定**：sg SSH 通道现成（~/.ssh/config sg-ecs-server 别名+独立 pem 密钥，实勘 :8-23）——新 clone 复用零新增凭据，这是 X 的加分项；但未来自动化（LG-018）的拉取 job 必须跑在同一 Windows 用户（jedih）下，换服务账户即断通道。现势无风险，立法时留一行注意即可。
- **B5 并发派工无跨 clone 互斥**：rmc_tick 的锁/指纹是 heyuan 本机文件（/srv/fleet/shadow-plane），对「未来本地派工器」无互斥。现势无风险（本地无派工器），v2.0 应写「同树单派工器」原则预留。
- **B6（低优先观察项）**：WorkTree FETCH_HEAD 记录的是 GitHub「tag 'dev'」（实勘 .git/worktrees/TriMetaverse-WorkTree/FETCH_HEAD）——GitHub 侧疑似存在名为 dev 的 tag，本席未联网验证；退役清理时顺带核一眼，避免未来 fetch 混淆。
- **正面项**：X 附带消除一条 GitHub 依赖（WorkTree 推 project/trimetaverse 走 GitHub，而本机连 GitHub 间歇超时多次实证，拓扑正身 §一）——退役反而缩小网络脆弱面。X 的新 clone 应直接 origin=sg-bare，不经 GitHub。

## 五、建议清单（随裁决，执行另令）

1. **C1 采纳方案 X，clone 参数**：origin=sg-bare（ssh://sg-ecs-server/srv/git/TriMetaverse.git，复用既有别名/密钥；勿从 GitHub clone——正源在 sg-bare 且 GitHub 通道间歇不稳）；目录名不带空格（如 D:/Code/ai/TriMetaverse-rmc）；单分支 dev；不装构建依赖。
2. **C2 切换序（原子性）**：project-registry claim 重指新 clone → 原子改 daemon cmd cd 行 → `git pull --ff-only` smoke → 一次会话冒烟 → 清除 WorkTree claim 条目 → `git worktree remove` → project/trimetaverse 留 GitHub 历史锚（tc001-canonical 先例）→ 拓扑正身 §一 row 6* 回填+§九重立。
3. **C3 漂移纪律机器可查化**：每次派工留痕记录「派工时 HEAD sha」；pull 强制 `--ff-only`；会话运行期禁 pull（heyuan 同规）。
4. **C4 自动化 tripwire（满足其一即触发 LG-018 通道评估）**：首棵 r-face 树挂载本地 / 30 天内 ≥2 次漂移致 push 拒绝 / LG-018 镜像通道落地。
5. **C5 v2.0 立法**：按第三节修订面（6+3）全文一致性重写立项，独立树；随案裁决 B2 hook 部署与 §八分叉处置行。
6. **C6 底稿勘误回填**（附录 B E1-E4）后，合成建议再报董事会。

## 附录 A：本席实勘核证清单（路径锚）

| # | 事实 | 锚 |
| --- | --- | --- |
| A1 | daemon 进程 CWD=C:\Users\jedih（非 WorkTree）；node 起 dist/cli.js | C:\Users\jedih\AppData\Local\trilc\daemon\trilc-daemon.cmd:11-12 |
| A2 | WorkTree 经 ProjectRegistry claim 挂接（branch=project/trimetaverse，claimedAt 2026-08-18） | C:\Users\jedih\AppData\Local\trilc\project-registry.json |
| A3 | WorkTree HEAD=refs/heads/project/trimetaverse；gitdir 共享主仓 .git | D:/Code/ai/TriMetaverse/.git/worktrees/TriMetaverse-WorkTree/HEAD；D:/Code/ai/TriMetaverse WorkTree/.git |
| A4 | 主仓双 remote：origin=GitHub HTTPS、sg-server=ssh://sg-ecs-server/srv/git/TriMetaverse.git；compression=0 | D:/Code/ai/TriMetaverse/.git/config:8,12-14,28-30 |
| A5 | sg SSH 别名+独立密钥现成（ServerAlive/Timeout 齐备） | C:\Users\jedih\.ssh\config:8-23 |
| A6 | 本地 daemon cron 仅 1 个 test-echo 任务 | C:\Users\jedih\AppData\Local\trilc\cron.db.json |
| A7 | env.cwd 透传 companyInitState/heartbeat/cron 三处（CWD=启动时决定，换 CWD 非代码改动） | D:/Code/ai/TriLC/src/server/app.ts:1287,1378,1394 |
| A8 | rmc_tick 合同：`git limited to: add/commit/push origin dev; no force, no rebase`；REPO 与 brief 硬编码 /srv/fleet/TriMetaverse；face 门严格制 | D:/Code/ai/TriRMC/scripts/rmc_tick.py:25,138-139,180,197-198 |
| A9 | 协议 v1.1 §四规则 1/§五步骤 4 与 A8 矛盾的行号 | docs/execution/2026-08-24/mr-worktree-collaboration-protocol.md:60,76,83-85 |

未验证标注：clone 精确磁盘体积（本席无命令执行面，执行时实测）；heyuan clone 的 remote 命名细节（拓扑间接锚，未直接登机核）；GitHub 侧 dev tag 存在性（仅 FETCH_HEAD 间接证据）。

## 附录 B：底稿勘误（回填评估底稿用）

- **E1**：底稿 §一 row 3「5 项：3 勾 2 未勾」→ 实为 **2 勾 3 未勾**；漏计「heyuan 克隆确认与 sg-bare 同步」未勾项（v1.1:248），且该项现势未达成（heyuan f284c19b 落后 sg-bare dev ≥3，拓扑正身）。
- **E2**：row 5 补充——daemon 进程 CWD 现势=C:\Users\jedih 非 WorkTree（A1）；WorkTree 挂接靠 ProjectRegistry claim（A2）；「换 CWD」执行面=cmd cd 行+registry claim+派工会话 cwd 三处，须原子切换。
- **E3**：d 项补充——v1.1 §四规则 1/§五步骤 4 与 rmc_tick `push origin dev` 生产合同**直接矛盾**（A9），v2.0 必须一并改写，此为修订量低估的主因之一。
- **E4**：§三 c 项「四节修订」→ 修订面低估，实为 6 节实质改+3 节局部清理（见本意见书第三节）。

（意见书完；待 CPO 席意见书+合成建议报董事会裁决。）