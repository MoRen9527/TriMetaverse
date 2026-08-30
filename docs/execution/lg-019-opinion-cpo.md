# LG-019 意见书：本地 TriRLC worktree 去留（CPO 小乔，产品总裁席）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/lg-019-opinion-cpo.md
- syncMode: source-only
- lastSyncedAt: 2026-08-31
- 性质：LG-019 双席联审 CPO 席意见书（回填评估底稿 §五裁决记录前提交）。**边界：只评估+立法建议，未执行任何分支/worktree/daemon 变更。**
- 评审人对底稿事实做独立实勘复核（rmc_tick.py / app.ts / 协议正身 / W36 现势 / WorkTree 目录），两处与底稿记载不符或底稿未勘的新事实已标注（见 §三盲区 1/2 与 §四建议 6）。

## 一、总表态

**方案 X 为主案，同意助理席初判；但建议在 X 内部拆两步执行：退役即刻、clone 懒建。**

- 退役即刻：worktree `remove` + project/trimetaverse 按 tc001-canonical 先例转历史发布跟踪锚（零迁移损失底稿已实证：dev 领先 202/0 独有=严格祖先）。
- clone 懒建：独立 clone 自 sg-bare **不即刻建**，随首个本地 R 面执行通道立项（过 §6.2 门禁评估）作为该立项件 1 同步建。触发器定义见 §二质证点 1。
- Y 维持排除；Z 不保留（与 CEO 对齐倾向相悖，且为已零演进的分支付常驻双分支心智税）。

产品位姿理由：

1. **R 面现势产品面=零**（实勘）：W36 周索引 `activeTrees: []`（OP-202608-W36-001.json:39）；唯一 R 面生产任务（周平面迁移）在 heyuan TriRMC；R 面能力门禁（协议 §6.2）未通过，步骤 3/4 现阶段归 M 面（CEO 2026-08-27 纠正在案；rmc-audit-cmp-001 撤 r-face 标签先例留档）。
2. **clone 不是能力资产，是形态对齐资产**（实勘）：rmc_tick 整条 R 面生产合同 heyuan-bound——`REPO = /srv/fleet/TriMetaverse`（rmc_tick.py:25）、brief 内工作目录硬编码同路径（:177）、`TRILC_MESSAGES = http://127.0.0.1:8711`（:35）。本地建 clone 不激活任何 R 面执行能力；「本地 R 面实验」需要一个比 clone 大一个量级的独立立项（参数化路径+本地派工通道+§6.2 门禁）。
3. **即刻建的真实成本不是磁盘，是对齐面扩大**：CEO 目标是「两生产环境操作同一版本代码尽量对齐」，而拓扑正身时点读数显示对齐目标形态本身——heyuan 生产检出（f284c19b）落后 dev 正源（41499531）≥4 提交（严格祖先链：eb39129b→b31a5532→7b5c9162→41499531；零自动化 pull 机制下无追平证据，若其后 heyuan 手工 pull 则已追平，标注为拓扑时点读数）。**漂移对齐纪律在现有两个生产检出上尚未证明，先加第三个检出=把未解的对齐问题乘以 1.5。**懒建把对齐面锁在两检出，直到纪律被证明。

## 二、质证点回答

### 质证点 1（CPO 主答）：懒建，不即刻建

- 判据：当前商业实验（v0.9.x 双轨+TriCompany 经营）没有任何一项验证指标依赖「本地 R 面检出」存在。clone 建成后 utilization 不是「低」，是「零」——因为本地 R 面执行通道不存在（见 §一理由 2），clone 唯一的即时用途是「将来可能用」。
- 懒建触发器（防 lazy 变 never，必须入裁决记录+产品 STATE）："首个需要本地执行通道的 face=r-face 能力立项**通过 §6.2 门禁评估**时，clone 作为该立项件 1 同步创建"。触发器挂在门禁评估而非树创建上——因为本地通道本身就受过门禁管，树先到通道不在也不该跑。
- 退役部分不等懒建：worktree remove 可即刻执行。过渡期本地 daemon cwd 无需任何变动——协议 §九「TriRLC daemon cwd 配置指向 WorkTree」**从未勾选**，即 daemon 大概率从未以 WorkTree 为 cwd，退役不产生 daemon 断链（此事实为底稿未勘，见 §三盲区 1）。

### 质证点 2：方案 X/Y/Z 表态

- **X（主案）**：d/e 不变量论证独立复核成立——face 门在 `evaluate_backlog` 逻辑层（rmc_tick.py:134-139，显式 face=r-face 严格制），与检出形态正交；`push origin dev` git 合同写在 R 面 brief 内（:198），dev 单 clone 天然契合。产品侧加分：R 面执行与董事会工作区隔离，产出归属干净。
- **Y（排除）**：产品理由补强助理席——主仓 9 modified 在途（CEO 会话工作区），daemon 会话与董事会同树操作=产品产出归属污染面（R 面回声/commit 混入在途物直接违反事实可溯源纪律的物理基础）。不是「不优雅」，是「归属事故待发」。
- **Z（排除）**：project/trimetaverse 已零演进且事实转历史锚（先例=tc001-canonical），维持 worktree=为不存在的产能付常驻同步与心智成本。

### 质证点 3：立法窗口——建议独立树，条件性接受并轨

- 理由：v2.0 内容由 LG-019 裁决**完全决定**，属「转录型立法」非「裁量型立法」，独立小树一天内可闭环（v1.1 冻结留档→v2.0 出炉→§九重勾）。并轨下轮联审则裁决签署与合同生效之间出现「拓扑正身已改、协作合同仍旧版」的不一致窗；形态裁决与操作合同不同步超过一个经营周=registry 漂移，违反产品真源纪律。
- 条件放宽：若下轮联审在 48 小时内且议程有余量，并轨可接受；否则独立树。

## 三、盲区指认（底稿未覆盖的产品面风险）

1. **本地 daemon cwd 现值未勘**：底稿 §一 row 5 勘了机制（env/projectRoot 决定，app.ts:1287-1290/:1378/:1394 复核属实）但没勘**现值**。协议 §九该项从未勾选→「退役 worktree 影响 daemon」的评估前提是未验证假设。执行前必须实测本地 daemon 启动配置（env/projectRoot 指向）。
2. **WorkTree 内疑似 untracked 本地态**：实勘发现 `.ime-deploy-status.txt`、`.trilc-ime-deploy-status.txt`、`.claude/plans/trilc-ime-fix.md` 等 IME 部署实验遗留文件。评审人无 git 执行环境未定类 tracked/untracked——`git worktree remove` 前必须 `git status` 全勘确认零未提交本地态（含深层 node_modules/会话目录），否则零迁移损失结论只对已提交物成立。
3. **「同一版本对齐」无可审计锚**：CEO 目标当前只能手工两机 git log 比对，且 heyuan 现势即滞后（§一理由 3）。LG-016 件 3 已有治理注入记 TriCompany HEAD sha12 的先例（rmc_tick.py:237-254）——同构方案：R 面执行回声/registry 记录执行时 TriMetaverse HEAD sha，周审计 diff 两生产环境 HEAD，「尽量对齐」从纪律愿望变可验收指标。**此项属 LG-016/LG-018 线，不阻塞 LG-019，但应随裁决转投。**
4. **协议 §二 staging 分支处置未提**：`project/trimetaverse-staging` 在 v1.1 §二有定义，是否在任何远端存在过未勘。v2.0 修 §二时须显式裁决（删除或标注未启用），不留僵尸分支定义给五实例心智模型。
5. **WorkTree 路径的文档幽灵引用**：协议 §6.1 表/§九之外，heyuan-branch-switch-impact.md、TriCompany 侧文档、本地启动配置可能引用 `TriMetaverse WorkTree` 路径。v2.0 修订须做全仓引用清查，不只改协议本体——否则退役后路径引用逐步腐化成新的排查成本。
6. **clone 命名即路由**：底稿示例 `TriMetaverse-rmc`——「rmc」是 heyuan 调度面实例名，本地 clone 的服务对象是本地 TriRLC 执行位。五实例模型里名字就是路由，建议编码角色（如 `TriMetaverse-trilc-local`），避免 TriRMC/TriRLC 本就高发的混淆再添一层。

## 四、建议清单（随董事会裁决）

1. 采纳方案 X，拆两步：**退役即刻、clone 懒建**；懒建触发器按 §二质证点 1 定义入裁决记录与产品 STATE。
2. project/trimetaverse 按 tc001-canonical 先例转历史锚；GitHub 分支保留不删（4e4fdc2c 在册，拓扑 §三实证）。
3. 执行令内嵌三查前置：daemon cwd 现值实测 / WorkTree git status 全勘（含 untracked 定类）/ 确认无活跃会话以 WorkTree 为 cwd。
4. 协议 v2.0 走独立树立法；§九三项未勾全部显式处置——「daemon cwd」改条件项（随懒建触发）、「heyuan 克隆同步」路由 LG-016/LG-018（现势滞后，见 §一理由 3）、「分支备份」闭（事实已达成）。
5. 对齐可审计锚（执行回声记 TriMetaverse HEAD sha）立项转投 LG-016/LG-018 线。
6. 底稿勘误一项：§一 row 3 记初始化清单「3 勾 2 未勾」与协议正身不符——正身实为 **2 勾 3 未勾**（v1.1 §九原文：前两项 [x]，daemon cwd/heyuan 同步/分支备份三项 [ ]）。v2.0 转录时以正身为准。

## 五、使用依据

- D:/Code/ai/TriMetaverse/docs/execution/lg-019-worktree-retirement-assessment.md（评估底稿）
- D:/Code/ai/TriMetaverse/docs/execution/repo-topology-20260831.md（拓扑正身，§一/§二/§三读数）
- D:/Code/ai/TriMetaverse/docs/execution/2026-08-24/mr-worktree-collaboration-protocol.md（v1.1 正身，§五/§六/§九原文核读）
- D:/Code/ai/TriRMC/scripts/rmc_tick.py（face 门 :134-139；git 合同 :198；路径硬编码 :25/:35/:177；sha12 注入先例 :237-254）
- D:/Code/ai/TriLC/src/server/app.ts（cwd 透传机制 :1287-1290/:1378/:1394）
- D:/Code/ai/TriMetaverse/docs/workflow/operating-records/2026-W36/OP-202608-W36-001.json（activeTrees 空）
- D:/Code/ai/TriMetaverse/docs/workflow/operating-records/2026-W35/trees/rmc-audit-cmp-001/tree-op.json（r-face 撤除先例）
- D:/Code/ai/TriMetaverse WorkTree/ 目录 glob 实勘（IME 遗留文件在册，tracked/untracked 未定类）

未验证项汇总（禁编造边界）：本地 daemon cwd 现值；WorkTree untracked 定类；project/trimetaverse-staging 远端存在性；heyuan 拓扑时点后是否已手工 pull。
