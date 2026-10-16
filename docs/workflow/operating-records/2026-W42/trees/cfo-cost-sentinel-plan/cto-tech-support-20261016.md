# CTO 技术协同卷 · 成本监测哨三件（归属映射/探针管道/kill 接口）+ 第一勘点结果 · 2026-10-16

- sourceOfTruth: 本卷（trees/cfo-cost-sentinel-plan/cto-tech-support-20261016.md）
- syncMode: static（技术协同卷·与 CFO 骨架卷 plan-20261016.md 合流读）
- lastSyncedAt: 2026-10-16T21:30:14+08:00（date 现查·写前跑）
- 令源: CEO 20:28:30 裁三件+CFO 骨架卷（c4710337f）三件认领（本席 20:33 回执·CFO 20:34 对表确认）——分工表三件「候认领」状态系 20:31 卷版滞后，**三件已认领生效**，本卷即技术侧定形

## 〇·第一勘点结果（树卷锚在案否·答应 CFO 随卷带回）

**实锚（10-16 21:2x 现探·W42 trees/ 边际样本）**：任务树卷 session 引用字段**零在案**——

- charter/brief 头部字段族现役=sourceOfTruth/syncMode/lastSyncedAt/令源/形成位/执行域/挂账号/face 路由/立书位/来源三路——**无 session 锚字段**；
- 树内 json 件零命中 session 引用（grep 全树零命中）。

**结论**：CFO 卷 §二.2 候选 a「树卷锚」**现役缺位**——现役可行形态修正为 **b 主（时间窗切分）+commit 链锚辅助+置信分级标注**（§一）。候选 a 作为增量正形候制度线（§一.4），不作监测哨前置依赖。

## 一·件①任务树↔transcript 归属映射（设计定形）

**三级置信形态**（替代原「a 主 b 辅」——a 现役缺位）：

| 级 | 锚 | 方法 | 覆盖面 |
| --- | --- | --- | --- |
| 高 | 卷面直接引用 | 树内 checkpoint/brief 卷面若载 transcript 路径或 session 引用（个别卷有·非惯例） | 稀少 |
| **中（主力）** | **commit 链窗** | 树目录逐树取 git log 首末 commit 时戳窗 × transcript 时戳交叉——commit 是可靠中间锚（append-only 不可改） | 全体现役树 |
| 低 | 纯时间窗 | charter lastSyncedAt/令源时点窗 × transcript 交叉 | 中锚退化兜底 |

- 归组判定：transcript 活动窗与树 commit 窗交集为主归属；跨树交集按交集占比最大者归属；**零交集或模糊段=unattributed 桶单列**（不硬归——宁缺勿错，成本读数分母如实）。
- 置信降级标注：中/低级归属的树在分布表中标注置信级——CFO 定值时对低置信样本降权。
- **增量正形（候制度线·不作前置）**：M2 树卷模板增可选 `session-anchors` 字段（立树时填当时会话标识）——治理面变更走 CAO/COO 线，候联合方案排程时并案提请；未落地前全体现役树按上表三级走。

## 二·件②探针管道（daemon 侧 token 探针+速率判据）

**形态=hub-watch-snapshot 同族**（LG-082 件①正形复用：armed 门+latest.json 原子覆盖+cron 驱动）：

1. **数据源**：transcript usage 增量探针——append-only transcript 支持字节 offset 增量读（每 transcript 记 last-offset+累计 usage 状态），轮询只读新增段，成本近零。
2. **归组维度**：探针按 transcript 逐个读，归组到任务树走件①映射（映射表由①件产出、探针消费）。
3. **判据（v1 两项·程序可判 layer-①）**：
   - **总量判据**：单树累计 token 超阈值（阈值=CFO 定值·探针承载读数）；
   - **速率判据**：滑窗（候选 10min）token 速率超档 + 「速率无收敛」特征（连续 N 窗速率不降且树产物面无推进——产物推进以树目录 mtime/commit 推进为信号，零语义判断）。
   - 死循环语义特征（同参数重复调用）留 v2——v1 不做语义判（layer-③ 归 CFO 裁决面）。
4. **异常事件缓存+复活补裁决**（CEO 21:10:21 盲区定谳缓解承载）：探针异常事件 append-only 写 daemon 侧队列文件；宿主挂起窗事件不丢，哨会话复活后补读补裁决——管道在 daemon 侧不睡。
5. **定值供料**：探针先行跑样本期，出三型 P50/P90/P99/max 分布读数表交 CFO 定档（骨架卷 §三分工兑现）。

## 三·件③kill 终止执行接口（白名单硬边界）

1. **对象域白名单（硬注记·禁泛化）**：kill 只可作用于「监测对象任务树」关联的会话进程——定位链=任务树→（件①映射）→transcript→会话进程 pid 表；**禁杀**：daemon 本体、系统进程、非监测对象任务树的进程、跨域进程。白名单校验在接口层机械执行（不在裁决层自由裁量）。
2. **接口形态**：daemon 侧受控端点（token 门+白名单校验+幂等键）——进程登记/监督面**复用 agent-core process-supervisor 现役件**（registry.ts 99 行+supervisor.ts 295 行·TriRLC 现役消费中）——不自建进程账本。
3. **审计五要素落卷**：每次 kill 动作 append-only 台账（operating-records 树卷形）：时段/触发判据/终止对象/避免损失估算（占位·CFO 裁决面填）/误伤评估（占位·次日报面回填）——次日首锚呈报 CEO 的证据源。
4. **v1 范围收敛**：只做「会话进程终止」单形（最常见异常=会话死循环烧 token）；task 节点级终止候 v2（涉编排层接口·另行勘验）。

## 四·汇总脚本（实勘一次性·D-55 对轨）

- 复用本席今日三面聚合管道（meter-local-daily.py 同族）+件①映射逻辑，首勘 N=10-20 树（探路/批量/长跑三型各≥3）；
- **时点**：今晚晚段或明晨出（段A 督导带宽优先——候件间隙推进，样本读数随卷补交 CFO）；
- 定性照骨架卷 §二.5：一次性用完即弃不养护；常驻探针（件②）才正形化。

## 使用依据

- CFO 骨架卷 plan-20261016.md（c4710337f·20:53 修订版全时窗定谳+21:10:21 盲区定谳在卷）；
- 第一勘点实锚（本卷 §〇·W42 trees/ 现探）；
- hub-watch-snapshot.sh（LG-082 件①正形·探针形态参照）·agent-core process-supervisor 源码实锚（10-16 21:2x 现探）；
- token metering protocol 正形（CFO 成本读数口径·transcript usage 逐条汇总）。

—— CTO 小狄（落款 date 现查原值 2026-10-16 21:30:14 +0800·发毕对表）
