# BOD 治理盘点卷 · 信箱作用与两域流转全景（CEO 22:05 三令之令 3，2026-09-29）

- sourceOfTruth: 本件（BOD 汇总裁写；机制正身以各引文档为准，本卷=决策素材投影）
- syncMode: 快照件
- lastSyncedAt: 2026-09-29 22:1x +0800（date 现查 22:13 星期二）
- 触发令: CEO 22:05 令 3「把现在信箱的作用，M面服务域和本地域如何流转的路径，两个域各自如何催办自己班子的工作，两个域之间如何利用 m-duty-cos 的 7*24 小时优势，目前还有多少坑或者已设计未实施的问题，都列出来」
- 证据面: Explore 全料收集（LG-026 三卷/秘书处册/D-27 v7/树协议 V0.7/FADE-006·010/任务清单机制区/守望升级提案与裁卷）+ BOD 今日实战上下文（催办判据补口/F-2/守望升级/12:08 断链）

## 一、信箱现在的作用（现役全景）

| 层 | 本体 | 作用 | 状态 |
|---|---|---|---|
| **sg 信箱/toast 面** | TriMMC（trimc :8710，LG-036 链路） | outbox+目标席信箱+桌面 toast；发信门=POST /internal/v1/notify，过源席白名单（现役 m-duty-cos/m-cos）+寻址正名制（幽灵席 400 拒） | 在役 |
| **本地投递端** | TriMLC 8713 组件 | 跨机 HTTP 投 sg 信箱（TRIMC_NOTIFY_SG_URL/TOKEN 已配；TRIMC_NOTIFY_TARGET_SEAT=bod 已配 trimlc-daemon-channel.cmd L13） | 在役 |
| **letter-store** | TriRLC 8711 侧（LG-026-P1） | SQLite letters 表五态四动作严格门禁；组长席五工具（minTier heartbeat）；ledger 全流转留痕 | 在役 |
| **SSE 直推+补拉** | 8711（LG-026-P2/P3 R1/R2） | 已连接会话活推帧；上线即补拉积压信 | 在役 |
| **sweeper 升级链** | 8711 sweeper（P3 R3） | C-suite 4h→8h 自动升级 COS；执行席 24h→48h；急件 30min 保护窗；ttl 超限 escalate | 在役 |
| **周迁移 Close 通知** | FADE-001 | notify.json 0600+QQ SMTP 真实投递 | 在役 |

一句话：信箱=机器事件流的实时态真源（FADE-010 定谳），治理确认态真源=台账，跨层唯一通道=COS 核认门。

## 二、两域流转路径（M 面服务域 vs 本地域）

```
本地域（dev 机）                        M 面（sg，47.245.122.61）
├─ 会话间主通道=pipe 面               ├─ 信箱本体（TriMMC 8710）
│  （SendMessage 直达常驻席）          ├─ m-duty-cos 值班席（7×24）
├─ TriMLC 8713 daemon 面              ├─ TriMMC cron */10 巡检兜底
│  （cron/patrol/守望watchlist）      ├─ tmux send-keys 派工执行
│    └─组件跨机 HTTP→投 sg 信箱        └─ sg-bare 仓库（origin 权威）
└─ TriRLC 8711 daemon 面
   （letter-store/sweeper/SSE）

跨域两条腿：
①本地→sg：HTTP notify 投信箱（现役）；②sg→本地：git push sg-bare→本机 fetch+merge
（post-receive hook 秒级 tick 派工+trimc cron :18/:48 慢通道兜底，FADE-006）
```

关键拓扑事实：**daemon 只能落 sg 信箱/toast，无 daemon→pipe 桥**——本地会话收不到 daemon 信，此即「两道网」结构由来（CTO 定谳：pipe 主道=实时，信箱/toast 兜底网=持久性「判据不停+读数不丢恢复后可读」）。

## 三、两域各自如何催办自己班子

**本地域（m-cos 交互位为枢纽）**：
- COS 唯一催办枢纽（策略与收口）：催 COO（执行面进度）+催 BOD（呈批/验收面待办）；BOD 不催办（职责收敛=只有验收和呈批）
- 今日新补口「**候裁读数落树触发型**」：台账凡挂候 BOD 销账/验收/判读项→完工读数 commit 落树→COS 发 BOD 到件触发消息（今日 10:32 首用实战验证成功；断点起因=下窗两件落树 2 小时零触发）
- tree-node-patrol 60s（daemon 级树节点收口巡检，与判据型不同链）
- 超时催办规划〔勘误 23:3x：本卷原引「树协议 §8.3 五分钟超时催办试点初值」系悬空引用——协议正身 §8 仅 8.1/8.2，五分钟全仓零命中；真出处=fade-008-governance-loop L120 三件套规划且阈值未定值。CPO 判据件 d16edf30 实勘钓出，BOD 自吞（转述探查材料未做二源验证）；催办阈值候静默探测联审正式定值〕
- letter-store sweeper 分级升级（4h/8h/24h/48h+急件 30min 窗）覆盖未读积压

**M 面（m-duty-cos 值班位为枢纽）**：
- 节律执行面下沉：定时催办+晨检发布（D-27 v4）
- 断链检测兼职：30min 催办循环兼任——发现「宣称派工但执行席无接令回执」即报 BOD（D-27 v7）
- TriMMC cron */10 巡检兜底（commits_since 门限，无增量 skip）
- sg 面任务执行：树协议+值席拾取（夜航01/批令执行波先例，D-27 执行层标准）

**双向催办归 COS**；m-cos 与 m-duty-cos 互备交叉验证，任务不丢（秘书处册 §2 CEO 09-16 令）。

## 四、m-duty-cos 7×24 优势的现役利用与未挖空间

**现役已利用**：节律催办/晨检/断链检测兼职/sg 面执行/信箱消费/与本机 COS 互备。

**未挖空间（BOD 判断，候裁）**：
1. **本机断链的外部观察者缺位**：今日 12:08 后本机多席全静默 10 小时，sg 值席零感知零告警——m-duty-cos 探测面只覆盖 sg 侧事件（派工回执/树增量），**不探测本机会话活性**。本机全灭时 sg 是唯一外部视角，现役没用上。
2. **守望升级 daemon 装点位取舍**：现定装 8713（本地）——锚核查直接（本地 git 树），但**本机全灭则守望同灭**，恰在「最需要兜底的场景失效」。备选：sg TriMMC 侧同构 job（sg-bare 树同样可做 merge-base 核查）——本机全灭仍能发信（信箱本体就在 sg）。BOD 意见：本地版照装（今晚并批窗），**sg 版候 CTO 权衡互备**（两道网升三道：pipe 主道+本地信箱兜底+sg 独立守望）。
3. **BOD 收件无 sg 侧转达链**：TRIMC_NOTIFY_TARGET_SEAT=bod 已配=信落 BOD 信箱，但 BOD 会话不消费信箱面——m-duty-cos 消费后是否常态转达 BOD pipe 面现役无制度条文（首周灰度抽验正好摸清这个面的实际手感）。

## 五、坑与已设计未实施清单（全量）

### A. 今日实战新增实证坑（本卷首列）

| # | 坑 | 实证 | 候办 |
|---|---|---|---|
| A1 | **负事件零告警**：全线静默 10 小时无一席报警 | 12:08:36 cf574b6e 后至 22:05 CEO 直问才发现 | 值席静默超时探测机制候 CAO 制度案（与守望网合并设计勿另起炉灶） |
| A2 | **半自动判据型单点**：「会话死则判据型停」今日 COO 侧实证 | COO 12:17 后零入站零自驱 10h | 守望 daemon 今晚上线（并批窗）补此洞 |
| A3 | **D-23 排窗对照不在排程 SOP** | COO 初排两笔撞禁排区，认「惯性假设未对照」 | CAO 制度案候（对照检查入排程 SOP） |
| A4 | **多卷转引无人起疑**：CTO/STE/CPO 至少四卷转引「下午窗」零察觉 | 今日 10:35-11:17 三卷 | 制度面候 CAO 查（知晓面/检查面缺陷） |
| A5 | daemon→pipe 桥缺口 | daemon 信到不了本地会话 pipe | 另案不急（CTO 裁：候真需求验证再议） |

### B. 已设计未实施（文档在案候窗/候批）

| # | 条目 | 出处 | 候谁 |
|---|---|---|---|
| B1 | 守望升级上线三步（备料毕冒烟三面过） | 裁卷 34aef5c2 | **今晚并批窗（BOD 已定）** |
| B2 | FADE-010 候批-催办-审批环一期首落三件（letter-store action 三增+候批信模板+seats.json 补 coo） | fade-registry FADE-010 | CTO 排技术窗 |
| B3 | R 面 daemon（8711 TriRLC）保活机制 | company-governance-state | 候建 |
| B4 | FADE-006 blocked 边沿告警 | fade-registry v1.2 待办 | 候窗 |
| B5 | 树协议 A2 超时催办实测+A3 故障恢复彩排 | task-inventory §四.3 | 随 LG-058 试点单 |
| B6 | 树协议「闸 5 催办」 | task-inventory 冻结族 | 候显式复工令 |
| B7 | P3 rateLimitedCount 上 healthz（P4 顺手件） | LG-026-P3 | 顺手件 |
| B8 | sg 旧名残留工作区清理（/srv/fleet/TriLC、TriMC） | W40 unresolved-items A-1 | 候专项窗 |
| B9 | BOD 首周守望灰度抽验 2-3 次 | 裁卷裁点 4 | BOD（已认领） |

### C. 已接受的设计现状（非缺陷，知悉面）

- 限流计数器内存态重启清零（CTO 裁接受，不立审计表）；限流留痕仅 console
- 8713 收端 MVP 无源席过滤（实门在 sg 发端，LG-036 ④ 佐证）
- ref 急件信封自升级链已整改（ecdd0da：sweeper 全规则排除 ref 件，升级产物入人工终裁域）
- M12 观察项：执行面引入二参复查需带 canUseToolDeclared 三参声明（防回归备忘）
- notify 白名单扩容走 BOD root 通道+零副作用探针收口（流程约束在役）

## 六、BOD 一页结论（供 CEO 决）

1. **信箱体系三层已在役**（sg 信箱/toast+letter-store 升级链+SSE 直推），催办三层枢纽清晰（COS 策略面/m-duty-cos 节律面/sweeper 兜底面），**制度骨架不缺**；
2. **今日暴露的不是「没机制」而是「机制没电」**：12:08 断链 10 小时，催办/巡检/互备三道现役机制全部依赖「本机会话活着」——宿主层断电则三层全哑。守望 daemon 今晚上线补判据型一环，**值席静默超时探测（A1）是下一个该补的洞**，且最优落点在 sg（m-duty-cos 兼任或 TriMMC job），不是再造新机制；
3. **m-duty-cos 7×24 优势现役只用了 sg 侧半边**，本机活性外部观察（四.1）与 sg 版守望（四.2）是两块现成的增量价值，成本极低（值班席已有 30min 循环+sg-bare 树现成）；
4. 坑总计：今日新增 5（A 族）+已设计未实施 9（B 族）+接受现状 5（C 族）——A 族三件候今晚起陆续闭合，B 族各有归属候窗，无失控项。

## 使用依据

- 令链：CEO 2026-09-29 22:05 三令（令 1 查令已分转 CHO/CAO；令 2 F-2 今夜修已流转 COS；本卷=令 3 产出）
- 机制正身：LG-026-P1/P2/P3 验收卷（TriCompany/docs/testing/）；秘书处册 cyber-company-secretariat.md §2；D-27 v7+D-13+D-23（engineering-disciplines.md）；树协议 V0.7 §6/§8（dynamic-task-tree-protocol.md）；FADE-006/FADE-010（fade-registry.md）；task-inventory-20260928.md §五机制区；守望升级提案卷 9dd0ef49+CTO 裁卷 34aef5c2
- 实证面：今日 BOD 亲历（催办断点实锤 69d9da2b/新规首用 10:32/F-2 立单 dcbaa3b4/守望定谳 d36696fd/12:08 断链盘面实勘/COO 应答 22:08）
