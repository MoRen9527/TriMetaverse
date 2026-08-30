# LG-019 评估底稿：本地 TriRLC worktree 去留（对齐 heyuan dev 形态）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/lg-019-worktree-retirement-assessment.md
- syncMode: source-only
- lastSyncedAt: 2026-08-31
- 性质：董事长助理牵头评估底稿（CEO 指令 2026-08-31，董事会转投）→ 小乔（CPO）/小狄（CTO）双席评审 → 合成建议报董事会裁决。**边界：只评估+立法建议，不执行任何分支/worktree/daemon 变更（执行另令）。**
- CEO 原话要点：评估本地 TriRLC（daemon）放弃 worktree，直接从 TriRMC/TriMMC 的 bare 拉取代码；CEO 倾向=与 TriRMC 同步对齐（两者生产环境操作同一版本代码）——**强输入非结论**。

## 一、现状实勘（2026-08-31 00:4x）

| # | 事实 | 读数 | 锚 |
| --- | --- | --- | --- |
| 1 | worktree 现状 | `TriMetaverse WorkTree` @ project/trimetaverse 4e4fdc2c，与 origin 同步；dev 领先 202/0 独有（**严格祖先=零迁移损失**） | repo-topology-20260831.md §一 |
| 2 | 协议正身 | mr-worktree-collaboration-protocol.md v1.1（249 行九节）；CEO 点名 §一拓扑/§二分支模型/§六五实例独立性/§九初始化清单 | docs/execution/2026-08-24/ |
| 3 | 初始化清单 | 5 项：**2 勾 3 未勾**（双席勘误采纳；未勾=TriRLC daemon cwd/heyuan 克隆同步确认/分支备份推送） | 协议 §九 |
| 4 | 分支备份实况 | project/trimetaverse 已推 GitHub（origin 4e4fdc2c 在册）——§九未勾的「分支备份」**事实已达成**（清单滞后） | git branch -r |
| 5 | daemon cwd 机制 | TriLC daemon 的 CWD=启动时 env/projectRoot 决定（app.ts env.cwd 透传），换 CWD=改启动配置非代码改动 | TriLC src/server/app.ts:1287-1394 |
| 6 | heyuan 形态（对齐目标） | /srv/fleet/TriMetaverse 独立 clone 挂 dev、手工 pull 零自动化、trilc-headless WorkingDirectory 即该检出 | repo-topology §一 |
| 7 | rmc_tick RFACE 合同 | `push origin dev` 硬编码（rmc_tick.py:196 一带） | scripts/rmc_tick.py |
| 8 | face 门 | rmc_tick evaluate_backlog 严格制（face=r-face 才拾取），与检出形态无关 | scripts/rmc_tick.py |
| 9 | 先例 | tc001-canonical 分支退役=「保留为历史发布跟踪锚不再演进」+生产切回 dev（trilc-lineage-merge merge-log 60e9bdcd） | TriMetaverse merge-log.md |

## 二、方案空间与初判（助理席，供双席质证）

### 方案 X：弃 worktree，本地 daemon CWD 指向**独立 clone 自 sg-bare**（对齐 heyuan 形态，CEO 倾向方向）

- 形态：新 clone（如 `D:/Code/ai/TriMetaverse-rmc`）挂 dev、origin=sg-bare；TriRLC daemon 启动 CWD 改指该 clone；worktree 与 project/trimetaverse 按先例退役。
- 优势：与 heyuan **同形态同合同**（rmc_tick `push origin dev` 天然契合——d 项天然对齐）；R 面执行与董事会/CEO 主仓会话**工作区隔离**（主仓 9 modified 在途互不污染——多 agent 共享工作树的脏干扰是实测痛点）；单一分支模型心智简单。
- 代价：磁盘一份 clone；版本漂移对齐需纪律（f 项——见 §三建议）；本地 R 面实验暂无（零 r-face 树现势），clone 建后短期低 utilization。

### 方案 Y：弃 worktree，daemon CWD 直接指向**主仓**（D:/Code/ai/TriMetaverse，零新 clone）

- 优势：零新增检出。
- 代价：与董事会/CEO 会话**共享工作树**（在途改动互相可见可踩——与 heyuan/sg 的隔离形态相悖）；`push origin dev` 合同下 daemon 推送会混入主仓未推在途物（实测风险）。**助理席不推荐。**

### 方案 Z：维持 worktree 现状

- 代价：双分支模型维持（协议 v1.1 大修免了但心智与同步成本常驻）；project/trimetaverse 零演进=worktree 长期闲置；与 CEO 对齐倾向相悖。**仅当双席提出强隔离需求时保留。**

**助理席初判：X 为主案，Z 为备选，Y 排除。**

## 三、随裁决的配套建议（初判，双席质证后定稿）

1. **f 漂移对齐纪律**：本地 clone 起步=手工 `git pull --ff-only sg-bare dev`（对齐 heyuan 形态与「代码修改一律本地发起」纪律）+每次 R 面派工前 pull 前置（对齐 heyuan 迁移 job payload 前置拉取先例）；自动化（15min cron 同构 tricompany-pull）随 LG-018 镜像/对账裁决一并定（避免先造第三条自动通道再改）。
2. **b 退役路径**（按 tc001-canonical 先例）：project/trimetaverse 保留 GitHub 历史锚不再演进；worktree `git worktree remove`（零迁移损失实证 g）；拓扑正身 §一节点 6* 更新；§九清单两项——「分支备份」**闭**（已达成）、「daemon cwd」随执行改指后勾。
3. **c 协议修订量**：v1.1 249 行——§一拓扑（改单 clone 拓扑）/§二分支模型（双分支→单 dev，核心改）/§六五实例独立性（陈述性，小改）/§九清单（更新勾选）≈四节修订，建议出 **v2.0**（模型级变更）而非 v1.x 修订；旧版历史冻结留档。
4. **d/e 不变量论证**：rmc_tick `push origin dev` 与 dev 单 clone 天然对齐（d ✓）；face 门/R 面门禁在 rmc_tick 逻辑层与检出形态正交（e ✓——门禁不变量不受形态切换影响，拓扑实勘 §一第 8 行）。
5. **h 执行边界**：全部随裁决后执行另令，本评估不动任何分支/worktree/daemon。

## 四、待双席质证点

1. CPO（小乔）：R 面本地实验的产品位姿——独立 clone 建后短期零 utilization（现势零棵 r-face 树）是否值得即刻建？还是随首棵 r-face 树挂载令同步执行（懒建）？
2. CTO（小狄）：漂移对齐起步形态（手工+派工前 pull）是否足够，或必须即刻自动化？clone 磁盘/维护成本是否有未见项？
3. 双席：协议 v2.0 的立法窗口（随下轮联审 or 独立树）。

## 五、裁决记录与合成建议（双席意见书回收，2026-08-31 01:0x 合成）

**双席共识（CPO lg-019-opinion-cpo.md / CTO lg-019-opinion-cto.md）**：

1. **方案 X APPROVE（两席一致）**，且 CPO 拆两步式：**退役即刻**（worktree remove+project/trimetaverse 转历史锚不再演进）+**clone 懒建**——触发器=首个本地 R 面能力立项过门禁时 clone 作件 1 同建（现势零 r-face 树+§6.2 门禁未过+rmc_tick 生产合同硬编码 /srv/fleet，本地 clone 不激活能力只是形态资产；且 heyuan 自身落后正源 ≥4，对齐纪律未证明前不加第三检出）。
2. **Y 坚决否决（双席一致）**；Z 不推荐（CTO：rmc_tick `push origin dev` 已证双分支模型死亡）。
3. **对齐纪律起步形态（CTO 裁定足够）**：手工 `git pull --ff-only sg-bare dev`+派工前 ff-only pull 前置+派工留痕 HEAD sha；**tripwire 三触发器**（首棵 r-face 树挂载/30 天内 2 次拒推/LG-018 落地任一命中即升级自动化）。
4. **分叉恢复预案（CTO 盲区主条）**：push 被拒后 ff-only 必失败且 agent 禁自救（TriLC 28 commit 分叉先例）——协议 v2.0 §八须预写「分叉即升级 M 面」。
5. **立法窗口（CPO）**：独立树转录型立法一天闭环（仅当下轮联审 48h 内才并轨）；v2.0 修订面按 CTO 实勘=**6+3 节**（底稿"四节"低估，附录 B 在席意见书）。
6. **执行前置（CPO 盲区主条）**：daemon cwd 机制已勘但**现值未测**（§九该项从未勾选=「退役影响 daemon」是未验证假设）——执行令必须先实测 daemon 启动配置再动。
7. **底稿勘误采纳**：§九清单 2 勾 3 未勾（本稿 §一#3 已改）。

**待董事会裁决**：合成建议 1-7 可否成立；裁决后执行另令（退役动作+协议 v2.0 立法树+daemon cwd 实测前置）。
