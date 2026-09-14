# 治理体系二期（hermes 对标）· CTO 技术主笔意见

- sourceOfTruth: 本件（CTO 技术/架构视角意见稿；与 CPO 产品件合流后由 COS 汇总）
- syncMode: static（第一轮对标意见，随合流件演进）
- lastSyncedAt: 2026-09-14T16:5x+0800
- 实勘依据: `reference/hermes-agent/docs/honcho-integration-spec.md`（377 行全文）+`reference/hermes-agent/agent/memory_provider.py`（ABC 全文）+`plugins/memory/`八后端实勘+`docs/execution/knowledge-injection-spec.md` v2.0+CPO 件（hermes-gov-p2-cpo-view.md）

---

## 〇、总判（技术面）

1. **hermes 无 inbox→schema→wiki 三段式**（COS 实勘已确认）；其三段式的技术近邻=**honcho 的 async prefetch+dialectic 蒸馏**——「消化」环节的技术原型不在 hermes 的目录结构里，在其**异步预取管线**里。
2. **我方已有基座优于 hermes 基线**：knowledge.db v3（契约层+内容层）+boot 注入链路+消费记录+指标三件=hermes 的 memory provider 语义域的**已落地子集**；二期不是移植，是**在既有基座上补「消化」环节**。
3. **CPO「schema=消化判据不是内容容器」技术面全盘成立**——本文档给出判据的规则形态与执行协议。

## 一、a) honcho-integration-spec porting 段深研（吸收什么）

该 spec 的方法论=**「integration-agnostic 接口形态的移植模式」**（七个 Spec 节各自「Problem→Pattern→接口契约→实现注记」）。逐模式对我方适用性：

| hermes 模式 | 机制内核 | 我方适用性 |
| --- | --- | --- |
| **async prefetch** | 回合末起 daemon 线程预取→存 per-session cache→下一回合零延迟消费；首回合冷其余零 HTTP | **★★★★★ 直接适用消化环节**——消化=慢操作（LLM 蒸馏），绝不能在注入热路径；设计=会话末/事件驱动异步消化→wiki 落页→下次注入消费（与 boot 注入天然同构：注入本来就是「下一会话消费」，异步消化恰好赶得上） |
| dynamic reasoning level | 蒸馏深度随输入长度缩放（floor=config default, cap=high） | ★★★★ 适用——消化深度分级：inbox 小条=浅消化（模板直转）/大条或高影响=深蒸馏（LLM 全链） |
| per-peer memory modes | hybrid/honcho/local 三模式+per-peer 覆盖+解析序 | ★★ 参考——我方对应=「消化介入度」配置（人工/半自动/自动三分），MVP 不做 |
| AI peer identity formation | observe_me + seedAiIdentity + 文件迁移 | ★★ 概念参考——我方对应=员工 wiki 的自观察形成（消费记录回流），已在 v3 消费记录面有雏形 |
| session naming strategies | per-directory/global/manual/title 四策略 | ★ 不适用（我方多项目隔离已由 multi-project-router 解决） |
| CLI surface injection | 管理命令注入 system prompt（<300 字符） | ★★★ 适用——员工应知「我的 knowledge 管理面」（消化状态查询/待确认项查看），候二期落地 |

**吸收结论**：async prefetch=**骨架级采用**（消化管线的运行模型）；dynamic reasoning level=消化深度分级的形态参考；CLI surface=低优先增量。

## 二、b) plugins/memory 八后端架构（可插拔设计）

**机制**：MemoryProvider ABC（20 方法：生命周期 on_turn_start/sync_turn/on_session_end/on_pre_compress/on_delegation + 注入 system_prompt_block/prefetch/queue_prefetch + 工具 get_tool_schemas/handle_tool_call + 配置 get_config_schema/save_config）＋目录发现（bundled `plugins/memory/<name>/` + user `$HERMES_HOME/plugins/`）＋**单活约束（ONE provider active at a time，config.yaml memory.provider 选择）**。

**设计教训三条（对二期）**：
1. **接口=生命周期钩子族**（turn 粒度）——我方 knowledge 注入是 boot 粒度（session 级），粒度不同：二期消化环节要挂的钩子=**session_end/closeout 粒度**（消化在会话收口后跑），不需要 turn 级复杂度。
2. **单活约束=简单性来源**——不做「多后端并行」，一个消化器一个后端（MVP 就一个：本地 LLM+knowledge.db）。
3. **配置 schema 自描述**（get_config_schema）——我方消化规则若给配置文件，照此自描述形态（UI 化候远期）。

**8 后端清单归册**（备查）：byterover/hindsight/holographic/honcho/mem0/openviking/retaindb/supermemory——均为「外部知识后端」的可插拔实现；我方当前路线=本地优先（knowledge.db），外部后端（supermemory 等）维持 v2.0 的「实验证据不演进」口径。

## 三、c) 新版 hermes 变化（候补勘）

**本机实勘限制如实**：GitHub 直连不稳（星型拓扑：本地不经 GitHub），**上游版本比对需走 M-SG 通道**（BOD SSH 面或 hub mirror）——候窗执行。**本地快照基线**：`reference/hermes-agent/`（vendor 快照，版本戳待与上游对表）。对表项建议：①`plugins/memory/` 新后端增灭②honcho-integration-spec 新版增节③`agent/memory_provider.py` ABC 方法签名变更。**不阻塞本件**（吸收模式已在手）。

## 四、d) schema 层设计输入（本件核心=真设计缺口补全）

### 4.1 schema 层技术定位

```
inbox（raw 入）──[schema=消化]──→ wiki（distilled 出）──[boot 注入]──→ 席位会话
      ↑                                  ↑
   7 字段白名单                       消费记录（v3 已有）
```

**schema 层 = 消化规则集（declarative）+ 消化执行协议（procedural）**——两层分开：
- **规则集**：什么源→归哪页/丢弃/升级（CPO 三决定的技术形态）
- **执行协议**：谁在何时以何深度执行消化（本节 4.3）

### 4.2 消化规则形态（declarative）

```yaml
# 消化规则（每席可扩展；MVP 内置基线规则）
rules:
  - match: { source_kind: "daily-note" }          # 源匹配（inbox 条目类型）
    action: digest                                 # digest | reject | escalate
    target_page: "工作日志/{date}"                  # 归页模板
    depth: shallow                                 # shallow（模板直转）| deep（LLM 蒸馏）
  - match: { source_kind: "ad-hoc" }
    action: digest
    target_page: "随笔/{slug}"
    depth: shallow
  - match: { source_kind: "decision-record" }      # 高影响类
    action: escalate                               # 提示人工裁决（CPO「升级」）
    escalate_to: "本席+相关席"
  - match: { content_empty: true }                 # 丢弃规则（CPO「现缺的一半」）
    action: reject
    reason: "空内容"
```

**三决定落地**：归页=match→target_page；丢弃=action: reject（含理由，进审计不留静默）；升级=action: escalate（高影响/拿不准→人工裁决队列，消化产物标「待确认」）。
**待确认段=诚实债务**（CPO 语）：消化产物的「待确认」段汇入 audit 面（org/audit 已有），不静默丢。

### 4.3 消化执行协议（procedural，async prefetch 模式移植）

1. **触发**：会话收口（closeout）/inbox 新增事件——**不在注入热路径**（honcho async prefetch 同一哲学）。
2. **执行者**：daemon 侧消化器（TriRLC knowledge-injector 扩展）＋LLM 蒸馏调用（deep 深度时才调；shallow=纯模板变换零 LLM）。**异步、非阻塞、可重入**。
3. **深度分级**（dynamic reasoning level 移植）：inbox 小条（< 阈值字节）=shallow 模板直转；大条/高影响类=deep LLM 蒸馏（产物=CPO 编译五段：摘要+事实+判断+待确认+来源）。阈值数值候 CFO 体积实测后定。
4. **幂等**：content_hash 既有机制延伸——wiki 页=源 hash 集合的函数，源变则页标记 stale 重消化。
5. **失败姿态**：消化失败=inbox 条目保留+错误入审计，**绝不静默丢**。

### 4.4 产物契约（wiki 注入页形态——CPO 产品定义的技术形式）

wiki 页=**注入页**（非检索词条）：①结论前置（首段=结论+判据）②自包含（无互链依赖）③可整段用/弃（每页独立价值）④**体积预算**（注入=每会话固定成本；bootstrap 已 47-48K/窗，org/shared 13 倍乘数）——页级预算上限数值候 CFO 测算。

### 4.5 与既有基座衔接（不破坏三表）

- **不动**：knowledge_documents/consumption/metrics 三表结构+同步链路+注入链路（v2.0 全保留）。
- **增量**：消化规则集=席侧配置件（`{TRICOMPANY_COGNITION_HOME}/digest-rules.yaml` 或 wiki 目录内约定件，候设计窗定）；消化事件=可入 metrics 表增列或新 `digest_log` 表（schema 增量候实施评审）。
- **升格管道（wiki→org/shared）**：CPO 的「去域化检验」=人工门（MVP）；技术面=promotion 事件+org/shared 条目 provenance 字段（溯源到源席/源页）。

### 4.6 验证锚（技术面）

1. 消化不在注入热路径（注入链路零新增 LLM 调用——boot 时延不回退）。
2. shallow 消化零 LLM（纯模板变换可单测）。
3. reject/escalate 全留痕（审计面可查，无静默丢）。
4. 幂等可重入（同 inbox 态重复消化=同 wiki 产物）。
5. 体积预算守卫（页级上限断言+org/shared 分层结构）。

### 4.7 风险

- **消化质量不可测**（LLM 蒸馏产物质量=主观）——缓解=MVP 用 shallow 为主（确定性变换）+deep 限高影响类+人工裁决兜底。
- **体积膨胀**（消化产生更多页→注入成本涨）——缓解=预算守卫+「这条不进会怎样」单品判据（CPO）。
- **org/shared 垃圾桶化**（CPO 现状警示）——缓解=升格人工门+promotion provenance。

---

## 大白话摘要

**干了什么**：研究了对标系统（hermes）的三个技术面——它的异步预取机制、它的八个可插拔知识后端架构、它的接口设计；然后设计了我们缺的那一环（inbox 原始记录 → wiki 沉淀页之间的「消化」规则层）的技术方案：什么内容进哪页、什么该丢弃、什么该交人裁决，怎么在后台异步消化（不拖慢会话）、消化出的页子什么标准算合格。
**结果如何**：确认我们不需要照抄 hermes（我们的地基比它好——已有数据库和注入链路），只需要补「消化」这一环；给出了规则形态+执行协议+五条验证标准。
**候什么决定**：与产品视角（CPO）意见合流后由总助汇总上报；新版 hermes 上游比对需走中枢通道（候窗）。
