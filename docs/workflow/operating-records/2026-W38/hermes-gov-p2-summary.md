# 治理体系二期·hermes 对标设计输入包（三席汇总）

- sourceOfTruth: 本件=COS 对三席产出的汇总（COS 对标研读+CPO 四问+CTO 技术主笔），供 BOD/CEO 审阅
- syncMode: input-draft（候 CEO 批后转设计正身）
- lastSyncedAt: 2026-09-14
- 上位令: CEO 2026-09-14 13:31/13:5x 立项令（「不要闭门造车」）+16:2x 正名令（知识体系→治理体系）
- 三席原件: CPO=`2026-W38/hermes-gov-p2-cpo-view.md`；CTO=`docs/execution/hermes-gov-p2-cto-view.md`（6fc6c900）；COS 研读=台账 09-14 两轮节

## 一、hermes 真实架构（对标基线，实勘定谳）

**核心发现：hermes 无「inbox/schema/wiki」三层**——三段式系我方吸收后自创演化。hermes 真实设计：

- **双 peer 模型**（honcho）：user_peer_id + assistant_peer_id，本地缓存+异步写线程同步到 AI-native 记忆系统
- **8 记忆插件可插拔**（plugins/memory/）：byterover/hindsight/holographic/honcho/mem0/openviking/retaindb/supermemory——多后端 ABC 20 生命周期方法+目录发现+单活约束
- **设计哲学**：baked-in 每会话注入一次（烤进 cached system prompt，最大化 prefix cache）＋异步预取 daemon 双线程（零阻塞）——对比 openclaw-honcho 每轮阻塞 HTTP
- **六可移植模式**（设计时明列）：async prefetch／dynamic reasoning level／per-peer memory modes／**AI peer identity formation（SOUL.md→AI peer 身份种子）**／session naming／CLI surface injection

## 二、我方位置（吸收轨正否判定）

**✅ 已同源**：命名空间策略（employee/<id>/org/shared/org/audit 与 hermes NamespacePolicy 完全一致）／boot injection（=hermes baked-in 同构）／SOUL 身份种子（五件套 soul.agent.md 远承此模式）／契约层三件套

**❌ 缺口四项**（hermes 有我方无）：①异步预取（我方仅启动全量+watch 增量）②动态推理级别（成本优化机制）③per-peer 记忆模式可切 ④多 agent 观察层级

**⚠️ 实勘警示**：org/shared.md 现役只剩 2026-07-14 两条乱码 daily-close 残留＝已是「日志垃圾桶」——升格管道不立它就是下一个垃圾桶（CPO）

## 三、schema 层设计输入（二期核心命题，hermes 无直接对应=真设计缺口）

> **【CEO 勘正 ~17:0x】**「schema 是需要 agent 接入消化之后，机构化输出对接如员工自己的 wiki，把零散的知识形成知识体系，**不是简单的三选一**」——**schema=消化管道**（接入→消化→结构化输出→wiki 对接 四段）；下方三决定（归页/reject/escalate）**降为其中一环**（消化段阀门）非全貌。正身文件按管道全貌组织。

**消化管道四段**（勘正后全貌）：①**接入**=inbox 单据进入（agent 工作过程自然产物）②**消化**=agent 接入消化（技术实现=CTO 件规则引擎/执行协议；阀门规则=digest|reject|escalate 三选一）③**结构化输出**=零散知识→成体系（编译五段：摘要/事实/判断/待确认/来源）④**wiki 对接**=输出对接员工自己的 wiki（注入页形态）

**产品定谳（CPO）**：**我们的消费=启动注入非检索**⇒wiki 做「**注入页**」非搜索词条（结论前置/自包含/可整段用整段弃/体积预算）；「待确认」=诚实体内债务汇审计不静默丢

**技术化（CTO）**：消化规则=**声明式 YAML**（match/action digest|reject|escalate/target_page/depth）+执行协议（触发=会话收口不在热路径／执行者=daemon 消化器+LLM 仅 deep 档 shallow 零 LLM／幂等=content_hash 延伸／失败不静默）＋**async prefetch 骨架级采用**（异步消化→wiki 落页→下会话注入消费，与 boot 注入天然同构）

**咬合点**：reject=丢弃／escalate+audit=待确认汇审计／promotion 人工门+provenance=去域化升格（脱离岗位语境还成立吗=唯一上行判据）

## 四、两轨分层定稿（CEO 令的落稿）

| 轨 | 内容 | 约束 |
|---|---|---|
| 公司层（hub 改名续用） | 工作沉淀+规范流程+工作流程+治理文档地图 | — |
| 员工层（inbox→schema→wiki） | 岗位知识学习管线 | 1× 注入成本（私域 wiki 全量注入可） |
| **org/shared 重定义** | **「全员该会什么」**（非公司统一规则） | **13× 成本必须分层**（核心层全员+扩展层按岗）；单品判据=「不进会怎样？不怎样=不进」；写权=提案制+单一收口 |

## 五、子题③13 对文件去重（CPO 定谳）

**非产品设计问题=发布管线卫生问题**；红线=去重不得制造第三真源；正确顺序=**先收割再切断**（①diff 审计拷贝里未回流有效改动→②回调源侧→③管线接管→④切手工拷贝——跳过①=丢失真实修正）；反模式=手工合并差异（承认双真源）禁；实勘补充=.github/agents/ 大小写双件并存非干净 1:1。

## 六、候批与候窗

1. **候 CEO 批**：三席设计输入（本件）→批后转设计正身（digest-rules.yaml+digest_log 形态候评审）
2. **候窗**：新版 hermes 上游比对（本机 GitHub 不稳走 M-SG 通道）
3. **一期并行**：合同 tools 修订（13 席全工具+定向 spawn）／hub 改名指针化——随方案排工程窗候 CEO 批后动

## 七、验收锚（CTO/CPO 双件合流的可测项）

①org/shared 分层落地（核心/扩展双档可见）②reject 规则生效（消化丢弃有日志）③escalate 队列汇审计（待确认不静默丢）④promotion 去域化判据人工门（provenance 字段留痕）⑤消化不在注入热路径（shallow 零 LLM 实测）⑥体积预算门（org/shared 注入面不爆 bootstrap 窗）

## 八、合流终版补章（2026-09-14 夜）

**三席件全齐**（合流转正身）：
- 本件（COS 汇总）＋CPO 两件（四问件＋管道全貌续件 `hermes-gov-p2-cpo-pipeline-view.md`）
- CTO 修正版（`docs/execution/hermes-gov-p2-cto-view.md` 15bd6b13——已按 CEO schema 勘正扩为管道四段）
- 上游对比件（`hermes-upstream-diff-20260914.md` e9ec74dd——@5eb99eb 八项演化）

**管道四段双席定稿咬合**（产品×技术同构）：
| 段 | CPO 产品语义 | CTO 技术实现 |
|---|---|---|
| ①接入 | 来源三路＋信任分级＋来源标注强制 | inbox 单据进入（会话收口触发） |
| ②消化 | 消化者=agent 本席；schema=可执行判据（示例/反例）；提炼→归并→阀门 | digest-rules.yaml＋daemon 消化器（shallow 零 LLM） |
| ③输出 | 注入页四约束＋两态（working/stable）＋节律 | 产物契约＋async prefetch 骨架 |
| ④wiki 对接 | 累计并入为主＋幂等标记＋升格通道 | v2.0 三表零动＋digest_log 增量 |

**上游八项并入**：hermes_state_* 模块族（防单体膨胀）／三层分发生态／evals 一等公民／SOUL 成熟态／watchdog 互印证。

**★知识分发三层定稿（CPO 上游对表最强吸收点）**：核心（注入）/可选（岗位装载）/**目录（可发现/不装载/零注入成本）**——解 token 预算纪律正解：「想学但不在必读的知识」放目录层。承载建议=核心/可选于 wiki 体系，目录层于 CGR 目录索引面（已转 CAO 候确认）。
**吸收原则定谳（CPO 总纲）**：吸收「使体系更可靠/更省成本」机制，不吸收「对外发布形态」（明文不吸收清单五项在 CPO 件）。
**跨域转记两条已分送**：soul 模板化→CHO（59ee43b6）／文档面边界→CGR（40ff9e44）。
**管道质量基线三指标（CPO 对表增量）**：归并正确率／注入页去链可读／reject·escalate 复现性。

**compass 配套**：CTO 改名方案 `docs/execution/compass-rename-plan.md`（8bde9cf3）已转 BOD 排窗；C 面架构文档 §6 正名已执行（a3dc9cf7）。

**转正身声明**：三席输入按 D-16 流程转设计正身（候 CEO 终批）；正身承载=二期蓝图定稿。
