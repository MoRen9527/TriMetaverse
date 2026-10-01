# LG-059/060 三段链技审裁决卷（BOD 流水线 batch-07 件 1·CTO）

- date 现查: 2026-10-01 08:1x CST（技审段 0-9 内补跑 ✓）
- 裁决人: CTO 小狄；输入: tc502-canonical-suspense-readout.md（batch-01 件 1）+ batch-02 件 2/3 两卷挂名单 + 今晨 T5 渲染抽验读数（BOD 亲跑，见任务书）+ batch-02/03 已裁卷
- 边界: 技审与方案裁；TC 源侧写面候本卷裁条由 FSD 段（18-24）执行，本件零源侧写面

## 一、LG-060 三族期望修复方案审（TriRLC 面·tui ink 已毕不重审）

| 族 | 挂形 | 技审修法裁 |
| --- | --- | --- |
| letters R1 live push | 流事件帧 `task_error` ≠ 期望 `letter`（LG-026-P2/P3 行为/测试漂移） | **测试期望面跟新至 LG-026-P2/P3 现役形**——LG-026 两段系已验收现役行为（行为定形在先），测试停旧形=漂移侧在测试。禁反向改行为凑旧期望 |
| FADE-005 owner_not_active 409 | 409 行为与期望差（roster-gating 产品面） | **候产品定性，不发修法工单**——roster-gating 门行为属 FADE-005 spec 裁决面（产品语义：409 该不该/何时发），技术侧冒进改测试或改行为都会抢产品裁决；挂账维持，定性后随裁跟新 |
| FADE-003 metrics 可见性 | routing_error 计数 2 < 期望 ≥3（计数漂移） | **fixture 校准路线**——构造足额 routing_error 场景（≥3 次触发）使计数达阈，禁把断言阈值下调到 2 凑绿（阈值=可观测性纪律面，动阈值=削监视）；归 FSD fixture 面 |

## 二、LG-059 残段清扫方案审（TriMMC 面+TC 源侧）

| 挂 | 根因（batch-02 卷） | 技审修法裁 |
| --- | --- | --- |
| ctx.cwd propagation ×3 | shell_exec cwd 回退语义 stdout 空——sg 环境依赖 | **环境哨兵+显式 skip**：套件前置探针（探测 sg shell 环境可用性），不可用=显式 skip 留痕（skip 理由行），可用=照跑；禁为绿改 shell_exec 语义（行为面无恙，是测试环境假设脆弱）。归 FSD 测试卫生面 |
| config-sync 401+cron 401+internal token auth gate ×8 | `401≠200/201`：03fecb0（09-30 fail-closed 门升）对 08-25 旧测试（legacy-allow 断言）落差 | **测试面跟新至 fail-closed 正形**：三族期望统一改「未带有效 token → 401 拒」断言+补 token 装配路径（正形 happy path 一例=200/201）。03fecb0 系安全门升=行为正形，旧 legacy-allow 断言=待更面；与 8712 迁移窗并批亦可，今夜段可直接办（纯测试面零行为变更） |
| Employee Registry v3 花名册 | expected 14, got 12（席位数据漂移，计数型） | **对表真源定值**：FSD 实勘 source-agents 现役席位数（roster 真源口径：13 员工+board+治理席的计数构成逐项核），期望值跟真源不凑挂名单；若真源=12 则期望改 12 并留痕计数构成，若=14 则数据面缺席补齐另裁。禁盲改任何一侧 |
| TC 源侧 6 处同句（本件 §三） | 禁令句「写成 TriMC 正式 X」旧名 | **机械正名入 LG-059 族**（裁详 §三） |

## 三、TC 源侧 6 处残留修复裁（cso 98/87、fsd 115/97、ste 118/100）

**裁：机械正名 TriMC→TriMMC，入 LG-059 族，今夜 FSD 段执行。** 理由三条：

1. **alias 规则直 apply**：大写连写=叙事名（真源 company-governance-state.md 规则行），禁令句系行为护栏叙事面——护栏守护对象须跟现名（TriMMC），旧名护栏=护已改名之人，语义失效向；
2. **非 tc502 两族**：143 行批次决策的两族=①护栏句族（语境=历史叙事的）②路径引用族（功能性正确候目录窗）；本 6 处系**活护栏句**（现役行为规则文本），非历史叙事非路径——不属两族任一，属正名族活性面，机械改无语义风险（禁令句式与限定义词原样保留，仅名替换）；
3. **T5 抽验已证渲染名字空间就绪**（第二段 22 agent 全通）——改名后渲染第三段复验即闭环。

执行规格：3 席×2 文件（agent-body+席位文件）6 处同句，仅 `TriMC`→`TriMMC` 单 token 替换；改后 TMV 两面旧名复扫=2K+0 残断言。

## 四、16 件 revert 案+143 行批次决策材料（整理呈裁）

**16 件 revert 案闭环条件已成立**（三段链证据）：
- 卡点唯一解=本机 TC 源侧追平（tc502 §3.1：`git pull --ff-only`，dev 已含全部正名族，git 层零内容冲突）；
- 解冻复验已实证：今晨 T5 第二段渲染 22 agent 全通（渲染链活体）；
- **批次决策建议**：①本机追平+渲染全量复验+旧名零回流=revert 案闭环销案（本机窗动作，非 sg 面）②LG-048/051 连带解窗已由 BOD 批外总裁笔裁定（渲染并流随本技审工单执行）✓ 对表③防复发=渲染管线增「源侧正名态前置断言」（旧名超阈即拦，091x 拦截机制常态化为前置门）——建议随渲染链工单入第 2 段脚本，候 FSD 段一并报价。

**143 行批次决策框架**（两族定性维持 tc502 卷，本卷加裁）：
- 护栏句族（历史叙事语境）：**不值得现在办**——历史叙事改写=篡史向；已由 alias 留痕规则覆盖（正名投影非事实抹除）；仅当单件被活引用时随件处理；
- 路径引用族（`TriMC/src/...` 功能性正确）：**与 TriMC→TriMMC 目录改名同窗**（物理目录冻结终态下=不改；若未来解冻窗，引用与目录同批原子切换）——维持挂窗；
- 6 处活护栏句（§三）：不属两族，机械正名即办（今夜段）。

## 五、FSD 执行段（18-24）工单预开

| 工单 | 面 | 改动面 | 测试门 | 硬门 |
| --- | --- | --- | --- | --- |
| **WO-A** | TC 源侧（LG-059 族） | 6 处同句机械正名（行号锚 cso 98/87、fsd 115/97、ste 118/100） | TMV 两面旧名复扫=2K+0 残+渲染第三段抽验（22 agent 通+零回流） | 复扫有残=停手回卷 |
| **WO-B** | TriRLC letters R1 | 期望面跟新 LG-026 现役形（task_error 帧） | letters endpoints 套件绿 | 需改行为面=停手回卷 |
| **WO-C** | TriMMC 401 三族 | 期望改 fail-closed 正形+token 装配 happy path 一例 | config-sync/cron/internal-token 三套件绿 | 需动 03fecb0 行为=停手回卷 |
| **WO-D** | TriMMC 花名册 | 实勘席位数→期望值对真源（构成留痕） | Employee Registry v3 套件绿 | 数据面缺席需补数据=先回卷报点 |
| **WO-E** | TriMMC ctx.cwd | 环境哨兵+显式 skip 留痕 | 套件绿（skip 显性化计数如实报） | 欲改 shell_exec 语义=停手回卷 |
| **WO-F** | TriRLC FADE-003 | fixture 校准 ≥3 场景 | metrics 套件绿 | 下调阈值=停手回卷 |
| 挂账 | TriRLC FADE-005 | 候产品定性（不发工单） | — | — |
| 随批 | 渲染链 | 源侧正名态前置断言入第 2 段（防复发） | 断言自测 | 候 FSD 段报价确认 |

**全段通用硬门**：新增 fail（既有挂全等基线外）=停手回卷；禁动 TriMC 目录现名；commit 分件独立。

## 使用依据

tc502-canonical-suspense-readout.md（batch-01 件 1 三答）；batch-02 lg059-trimmc-fix-readout.md §四/lg060-field-follow-readout.md §四挂名单；batch-07 任务书 T5 抽验读数（BOD 08:0x 亲跑）；company-governance-state.md:198-211 alias 真源；batch-02/03 已裁卷（03fecb0 fail-closed 正形/ink 面已毕）；LG-046 Phase 0-2 读数（host-assets 面）。
