# CTO 席技术评估·双 COS 对等互备双轨提议（CEO 21:08 提议·联审件）

- sourceOfTruth: 本卷（trees/cos-dual-track-peer-eval-20261007/cto-eval-dual-track.md）
- syncMode: static（评估阶段产物·零施工零改流程·LG-066 冻结面零触碰）
- lastSyncedAt: 2026-10-07T13:18:21Z（date 现查 21:18:21+08 周三）
- 令源: CEO 21:08 提议（BOD 21:08 评估令）·时限 10-08 12:00 前意见回 BOD/COO（汇总人）
- 评估席: CTO 小狄（m-cto）·技术面四维+运行腿读写边界

## 〇、结论先行

**技术面支持双轨方向，无否决项。** 核心勘正：BOD 令文前提「现势本机→sg 值席只有树协议异步+send-keys 单行（长文禁走）」**不完整**——本席 sg 活体实勘（今晚）证实**双向 notify 信道现役已在**：出向=LG-036 链（sg 值席 POST TriMMC notify→outbox→TriMLC 8713 poller→信箱+toast），入向=**LG-052 阶段二 duty-consumer**（本机 POST notify target_seat=m-duty-cos→sg outbox→TriMMC 同进程定向拉取→值席信箱落箱/urgent 弹显，TriMMC src/notify/duty-consumer.ts 头注自述）。因此维度①正解=**现役链正名化+零星补件**，非新建信道；COS 卷「缺口 a·双向低摩擦信道（最大缺口）」按此收窄为「信道已有，缺正名化与发送侧包装」。四维齐答如下。

## 一、维度①跨机长文通道：候选对比与裁决

### 通道候选表

| 候选 | 内容 | 裁决 |
| --- | --- | --- |
| **A·notify 双向链正名化** | 长文=树卷（git push sg bare，持久化+diff 审计+双席各取）；叫醒=notify 短消息（树指针+一行摘要进 body，经现役双向链）；status 三态查询已备回执面 | **采·主案** |
| A+·body 载荷扩容 | 若 body 长度上限低（routes.ts 是否设限候施工窗首步实勘），增分片/引用语义 | 候补·随施工窗实勘定 |
| B·SSE/长连接推送 | daemon 增推送面+断线重连+连接管理 | **否决**：BOD 令→COS 是低频高可靠场景，SSE 工程量中-大属过度设计；留作远期演进不否死 |
| C·纯树协议异步（无叫醒） | 只走 git，靠轮询/拾取周期 | **降级保留**为 A 的失败兜底（notify 链断时退化路径，S2 首笔线即此形态全链实证中） |
| send-keys 单行 | BOD root 降身 tmux send-keys | **收缩专用**：叫醒/单行急件保留，长文禁令维持（今日 relay 伪令案+tmux Enter 吞噬/暗示提示两坑实证——正文走 send-keys=已知事故家族） |

### 工期量级（评估口径，施工窗校准）

1. **正名化（纪律面）**：长文走树+notify 叫醒+target_seat 路由约定成文——0.5 天文档面，零代码。
2. **零星补件**：body 上限实勘+发送侧低摩擦包装（本机席 curl/脚本一行形态，l2 探针已有先例）+值席信箱读法约定+token 凭据分发（TriMMC notify 门=X-Internal-Token，app.ts L402 注释）——**半窗~1 维护波**。
3. token 门凭据分发搭 **四 daemon 鉴权门形统一标准**（S3 立项在途）同窗办，不另开窗。

### 附带实勘注记

- TriMMC healthz 现探 ok（cron 10 jobs，degraded false，21:1x）；notify 门形有 X-Internal-Token 门（源码注释），env 现值活体探针留施工窗首步（S2 同族零副作用探针工序：401=门活/400=门死）。
- duty-consumer env 门（TRIMC_NOTIFY_DUTY_SEATS/TRIMC_NOTIFY_DUTY_TMUX）现值候同窗核对——未设=不启动，若今晚实探信箱链在役则已设。

## 二、维度②sg 侧班子形态：席位现成，零补建

本席 20:4x 勘验卷（c44de340，BOD 已认现行基线）读数直接作答：

1. **sg 侧 14 个 m-duty-\* 席（含 cos/coo/sde 全 C-level）已在**——fleet 名下 tmux-1001 socket，两代进程+cos 复活代。「服务域需补 COO 等席位」是**伪命题：席位现成，补建成本为零**；真命题=指挥权路由激活——双轨后 m-duty-cos 指挥 m-duty-coo 等=同机同 socket send-keys 单行现役可达（跨域指挥错位自消）。
2. **daemon 资源面**：14 席常驻 sg 机已承载 20 天，TriMMC/TriRMC daemon 现役健康——双轨零新增 daemon 面；增量只在「激活既有席位的使用率」（token 曲线随任务量走，不随席位存在性走）。
3. 席位代际冗余盘点已在值席车道（COO 转达在走，不归本面）；m-duty-sde「族外直跑」已翻案族内现役（见 §六勘误）。
4. 残余风险认同 COS 卷缺口 b：值席恢复配方薄（值班态不加载台账快照）——对等主办复杂令前需配方升级，CHO/CAO 会签面，技术面不涉。

## 三、维度③R 面 4 COS 互备：纸面预研（LG-066 冻结零触碰红线内）

1. **R-HY 现役=TriRMC 8710**（cron 七端点+internal token 门，本席 13:3x 实勘在案）——**无 notify/信箱面**（src/notify 不存在）。R 面信箱面=真前置缺口①：TriMMC notify 三件套（outbox/routes/duty-consumer）平移件，工程量中。
2. R 面席位进程承载形态=真前置缺口②：R 面现役无全席族先例，sg 模式（tmux 会话族+fleet 身份）可复制，但 claude 进程配置/名址注册（CLAUDE_CODE_CHILD_SESSION 陷阱族）需专门勘验。
3. **冲突点与红线**：LG-066 冻结=双 unit 零触碰——席位新起不触 unit 本体，但起停实验保守起见候解冻窗；本卷纸面预研不受限。
4. **前置依赖链**：S2 全链闭（cronRequest 派工实证在走）→R 面任务书面通道即有；notify 面移植候解冻后预研窗。**排期主张：LG-066 解冻后 1 个预研窗**（信箱面移植可行性+席位形态试起），本评估期零动作。
5. 机制面背书 COS 卷：号池/标签/分账按 N 席可泛化设计成立——4 COS 只加号段不换机制，技术面无异议。

## 四、维度④N2 hop1/hop2 实测衔接：读数先出再钉终选

N3 10-08 hop1/hop2 实测（STE 预载）=notify 双跳链 T1-T4 时效/可靠性读数——正是①主案（notify 叫醒段）的实证前置：

- hop 达标（分钟级）→①正名化即闭，工期承诺按实测校准；
- confirm 双跳有洞→补件范围按读数定位（poller 间隔/confirm 回写/urgent 弹显分段归因）。
- **时序建议：正名化纪律面可先行（零代码不受阻），①终选与工期数字候 N3 读数钉死**——互不阻塞，评估→实测→定稿自然衔接。

## 五、上下文互备·运行腿读写边界（COO 增维）

1. **台账真源唯一·技术面背书**：COS 卷「不设第二本账」技术护栏现成齐备——git 树唯一真源+fetch 速推纪律+pre-commit gate 双机在位（今日 sg 面 0197f638）+index.lock 撞锁退避有档。
2. **分钟级滞后窗如实认**：上下文互备≠实时同步——树+notify 链同步延迟分钟级（poller 60s 间隔实证形态）。这不是技术障碍，是**语义边界**：双轨纪律面须认「互备=分钟级 eventual 一致」，强一致场景（门签认/死线件）走硬门签认必落卷直达纪律（既有），不依赖信道实时性。
3. 运行腿 org 区（共享记忆/审计）读写边界：双 COS 均可写、写前 fetch 写后速推同律；审计面天然多席共写=设计预期非冲突。

## 六、技术风险三条+附带勘误

1. **relay/send-keys 面不可靠**（今日 relay 伪令案实证）——随①正名化消除：正文通道切 notify/树后 send-keys 降为叫醒专用，暴露面收窄。
2. **notify 链进程单点**（TriMMC 8712 死=双向信道断）——兜底=候选 C 降级保留（纯树异步）；与 ssh 单通道评估卷同构定性：可用性不依赖（业务走树），损失的是低摩擦，观测面 l2 线已在盯。
3. **token 凭据分发面**（跨面 POST 需 X-Internal-Token）——搭四 daemon 门形统一标准同窗分发，凭据管理走既有 root store/环境面纪律，不新开面。

**附带勘误条（m-duty-sde 翻案认账）**：本席今日勘验卷附带发现「m-duty-sde 族外直跑疑漂移」经 SDE 勘查三面铁证**翻案**（PPID=tmux-1001 server+pane_pid 直认+/proc environ TMUX 键）——族内现役值班席定性认账，本卷 §二 引用读数已按族内口径使用。本席原判读过程根因自勘列候选（ps 判读过滤条件缺陷或 PPID 列误读），勘验卷本体结论（fleet 可达+无需开权）不受影响。

## 七、意见回执要点（供 BOD/COO 摘呈）

- **技术面支持双轨方向，无否决项**；①主案=notify 双向链正名化（现役 LG-036+LG-052 链，非新建）+长文走树，工期量级小（纪律面 0.5 天+补件半窗~1 波）；
- ②sg 班子席位现成零补建，真命题=指挥权路由激活；③R 面 4 COS=真前置缺口两个（信箱面+席位形态），排 LG-066 解冻后预研窗，机制可泛化成立；④N3 读数先出再钉①终选，互不阻塞；
- 与 COS 卷四步走建议兼容：本席技术面供给其第三步「双向信道补缺」的底座——**该步工程量比 COS 卷预估小，信道现役已在**；
- 评估阶段零施工零改流程，LG-066 冻结面零触碰（照令）。

## 使用依据

- TriMMC `src/server/app.ts` L402-408 notify 四端点注释+`src/notify/duty-consumer.ts` 头注（本席 21:2x sg 活体实勘）；TriMMC healthz 现探读数
- 本席勘验卷 c44de340（sg duty tmux socket 归属面·BOD 认现行基线）；S2 任务书面 35e55381（TriRMC cron 七端点+token 门实勘）；ssh 单通道评估卷 3445cf46
- TriRMC `src/server/app.ts` L145-161/src/cron/routes.ts（13:3x 实勘）
- COS 评估卷 cos-eval-dual-track.md（e2e801cb，联审对表）；BOD 18:38 N2 域知信；relay 伪令案（S2 链志）
