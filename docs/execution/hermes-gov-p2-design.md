# 治理体系二期设计正身（hermes 对标·消化管道）

- sourceOfTruth: 本件
- syncMode: static（设计正身；CEO 2026-09-14 18:0x 终批「批，转设计正身」）
- lastSyncedAt: 2026-09-24T03:56+0800（§3 示例基线两处勘正：content_empty 置首+target_page 补 .md——CTO 2026-09-24 03:54 定稿，FSD 随 LG-035 一期完工附带修订；终批形态出处不变）
- 技术主笔: CTO（小狄）；会稿=CPO（小乔）；统筹验域=COS
- 底本: 合流终版 `2026-W38/hermes-gov-p2-summary.md`（三席件全齐：COS 汇总+CPO 两件+CTO 修正版 15bd6b13）+上游对比件 e9ec74dd（@5eb99eb）
- 上位令: CEO 13:31/13:5x 立项令+16:2x 正名令（知识体系→治理体系）+~17:0x schema 勘正+18:0x 终批

---

## §1 定位与总纲

**治理体系二期=[消化管道] + [三层分发] + [注入范式] 三件一体**——把零散知识（agent 工作过程自然产物）经消化管道成体系，按三层分发纪律注入员工 wiki/手册体系。

- **消费范式定谳（产品根命题）**：启动注入，非检索 → wiki 作「**注入页**」（结论前置/自包含/可整段用弃/体积预算），非搜索词条。
- **schema=消化管道**（CEO 勘正口径）：agent 接入消化之后，结构化输出对接员工自己的 wiki——四段全貌非三选一。
- **吸收原则**（CPO 总纲）：吸收「使体系更可靠/更省成本」机制，不吸收「对外发布形态」。

## §2 消化管道四段（产品×技术咬合定稿）

| 段 | 产品语义（CPO） | 技术实现（CTO） |
| --- | --- | --- |
| ①接入 | 来源三路＋信任分级＋来源标注强制 | inbox 单据进入（会话收口触发；7 字段白名单已有） |
| ②消化 | 消化者=本席 agent；schema=可执行判据（示例/反例）；提炼→归并→阀门 | digest-rules.yaml + daemon 消化器（shallow 零 LLM）；**阀门=digest\|reject\|escalate 三选一（消化段一环）** |
| ③输出 | 注入页四约束＋两态（working/stable）＋节律 | 产物契约（编译五段：摘要/事实/判断/待确认/来源）＋async prefetch 骨架（异步消化不在注入热路径） |
| ④wiki 对接 | 累计并入为主＋幂等标记＋升格通道 | v2.0 三表零动＋digest_log 增量；升格=promotion 人工门+provenance |

## §3 技术实现形态：digest 域六件族（上游 state_* 模块族教训吸收）

**设计纪律**：照 hermes_state_* 模块族范式（20+ 单一职责文件+registry 总控）组织 digest 域，**防 schema 层单体膨胀**：

| 件 | 职责 |
| --- | --- |
| `digest_rules` | 规则加载/校验（digest-rules.yaml 解析+schema 校验） |
| `digest_classify` | 三选一阀门（match 判定 digest\|reject\|escalate） |
| `digest_executor` | 消化执行（shallow 模板变换/deep LLM 蒸馏分流调度） |
| `digest_render` | 结构化输出（编译五段产物+注入页约束校验） |
| `digest_log` | 事件/审计（消化事件+reject 日志+escalate 队列汇入学习审计） |
| `digest_registry` | 总控（席侧配置聚合+幂等状态+promotion 事件） |

**执行协议**：触发=会话收口/事件（不在注入热路径）→执行者=daemon 侧消化器（TriRLC knowledge-injector 扩展）→深度分级（阈值候 CFO 体积实测）→幂等=content_hash 延伸（源变页标 stale 重消化）→失败姿态=inbox 保留+错误入审计绝不静默丢。

**消化规则声明式形态**（示例基线；〔勘正 2026-09-24，CTO 03:54 定稿、FSD 随一期完工附带修订〕声明序=首匹配优先级：content_empty 守门规则**置首**防被 source_kind 规则遮蔽；target_page 带 `.md` 扩展名）：
```yaml
rules:
  - match: { content_empty: true }
    action: reject
    reason: "空内容"
  - match: { source_kind: "daily-note" }
    action: digest
    target_page: "工作日志/{date}.md"
    depth: shallow
  - match: { source_kind: "decision-record" }
    action: escalate
    escalate_to: "本席+相关席"
```

## §4 知识分发三层（token 预算纪律正解）

| 层 | 装载 | 注入成本 | 承载 |
| --- | --- | --- | --- |
| 核心 | 注入 | 每席成本 | 全员必读（org/shared 核心层+私域 wiki） |
| 可选 | 岗位装载 | 按需 | 岗位相关（wiki 可选集） |
| 目录 | 可发现/不装载 | **零** | 「想学但不在必读」——CGR 目录索引面（已转 CAO 候确认） |

## §5 org/shared 重定义

- **定位**=「全员该会什么」（非公司统一规则）；现役实勘=2026-07-14 两条乱码 daily-close 残留（垃圾桶化警示）。
- **成本纪律**：13× 注入乘数——必须分层（核心层全员全量/扩展层按岗位）；单品判据=「**不进会怎样？不怎样=不进**」。
- **写权**：提案制+单一收口（禁单席直写）。
- **升格管道（wiki→org/shared＝组织知识库）**：唯一上行通道；判据=**去域化检验**（「脱离我的岗位语境还成立吗？」）——人工门（MVP）+provenance 字段溯源。

## §6 与既有基座衔接（零破坏）

- **不动**：knowledge.db v3 三表（knowledge_documents/consumption/metrics）+同步链路+注入链路（v2.0 全保留）。
- **增量**：digest-rules.yaml（席侧配置件，`{TRICOMPANY_COGNITION_HOME}/` 或 wiki 目录约定件候设计窗定）+digest_log 表（候评审）；〔显式化 2026-09-24〕一期 reject 仅结构化 outcome 无日志面——§7②「丢弃有日志」依赖 digest_log 件，随二期排期显式带上（STE 防语义悬空注记，digest-executor 源头同注）。
- **落点**：消化器=TriRLC knowledge-injector 扩展（既有件演进非新建）。

## §7 验收锚（合流六条+质量基线三指标）

**六条**：①org/shared 分层落地（核心/扩展双档可见）②reject 规则生效（丢弃有日志）③escalate 队列汇入学习审计（待确认不静默丢）④promotion 去域化判据人工门（provenance 留痕）⑤消化不在注入热路径（shallow 零 LLM 实测）⑥体积预算门（org/shared 注入面不爆 bootstrap 窗）。
**质量基线三指标（CPO 对表增量）**：归并正确率／注入页去链可读（抽 3 页断链可读）／reject·escalate 复现性。

## §8 吸收清单（上游八项并入）

①async prefetch（骨架级）②dynamic reasoning level（深度分级）③AI peer identity formation（SOUL 概念，五件套远承）④state_* 模块族（六件族）⑤三层分发生态（§4）⑥evals 一等公民（验收锚 eval 化心智）⑦watchdog 互证（D21/D22 方案佐证）⑧SOUL 成熟态（default_soul.py——合同体系吸收轨参照）。
**不吸收**（CPO 明文五条不吸收清单在 CPO 件）：对外发布形态为主。

## §9 排程（避夜航窗资源撞车）

- **候窗**：digest-rules.yaml+digest_log 形态实施评审（候晚于今晚夜航窗——夜航窗=compass 迁移+合同瘦身+13 对去重专用）。
- **一期并行**：合同 tools 修订（已落）／compass 迁移（夜航窗）。
- **跨域转记已分送**：soul 模板化→CHO（59ee43b6）／文档面边界→CGR（40ff9e44）。

## §10 风险

- 消化质量不可测（LLM 蒸馏主观）→缓解：MVP shallow 为主+deep 限高影响类+人工裁决兜底。
- 体积膨胀（消化页增多→注入成本涨）→缓解：三层分发+预算守卫+单品判据。
- org/shared 垃圾桶化复发→缓解：升格人工门+provenance+提案制收口。

---

## 大白话摘要

**干了什么**：把三席（技术/产品/统筹）对知识沉淀体系的设计意见合成正式设计文件——核心是一套「消化管道」：agent 干活过程中产生的零散记录，自动经过「接入→消化→结构化→写入个人知识页」四步变成体系化知识，再按「核心必读/按岗可选/只放目录不占预算」三层分发给各个 AI 员工。
**结果如何**：设计正式定稿（老板已批），技术实现拆分方案（六个单一职责模块）也定了，防止越做越臃肿；和现有系统零冲突（数据库和注入链路都不动，只加消化环节）。
**候什么决定**：实施评审排在今晚的夜间工程窗之后（那个窗口专用于另一批改名/瘦身作业，避免撞车）。
