# 认知资产审计·CTO 技术思路件（命题 4：三类资产共用审计技术方案）

- sourceOfTruth: 本件（CTO 技术思路；与 CPO 产品思路件合流，双签呈 CEO——节奏令=思路不落码）
- syncMode: draft（思路件终态即本阶段交付）
- lastSyncedAt: 2026-09-20T21:4x+0800（date 现查 21:35:04，本回合执行）
- 命题书: task-charter-20260920-cognition-assets-audit.md
- 实勘基线: 既有审计资产五类（§〇；letter 台账/kernel audit/knowledge audit 区/transition JSONL/session-store——全现役或在库形态）

---

## 〇、设计起点：既有审计资产盘点（复用优先，不发明新机制）

| 资产 | 形态 | 可抽象的模式 |
| --- | --- | --- |
| letter-store 台账（LG-026/036） | letters+ledger 分表，一信多行（actor/action/at）状态流转流水 | **事件流水模式**：主体+动作+时戳三元组 append-only |
| kernel audit 面（源侧九件） | org 共享命名空间 audited writes（bundle.audit_namespace） | **写入伴生审计**：写资产同事务写审计 |
| transition JSONL（TriModel） | 模型切换 append-only JSONL（append errors never throw=审计写入零阻断业务） | **append-only 文件流**+失败不阻断 |
| session-store（heartbeat） | 会话持久化 recovery+audit 双用途 | **存算分离**：持久层天然可审计 |
| knowledge/audit 区（学习腿骨架） | 目录位在、机制空 | 本方案的落点位（非新造目录） |

**结论**：本方案=把这五种分散形态**统一为一种审计事件信封+三条接线原则**，落点各归其位。

## 一、设计原则（四条，思路核心）

1. **伴生流原则**：审计是资产写入的伴生流——**写资产必写审计，同事务**（kernel bundle 模式推广）；审计写入失败不阻断资产写入但必须告警（transition 模式——审计可用性≠业务可用性，但审计缺失须可见）。
2. **append-only 原则**：审计流只追加不改写（letter ledger 模式）——变更追溯=读追加序列，不做 UPDATE。「变更可追溯」的实现=对资产的每次变更产生一条 diff 摘要事件，而非维护资产历史副本。
3. **分域不混流**：审计事件按资产腿分域落（学习腿→knowledge/audit/；运行腿→cognition home audit/）——**审计流跟资产腿走**，与认知层归一双腿裁定同构；跨腿查询靠统一信封字段（非物理合流——不制造第三真源）。
4. **四问可答**：CEO「记住了啥」四问=信封字段直接映射（§二）——审计方案合格判据=四问皆可在两次查询内回答。

## 二、审计事件信封（统一数据结构）

```jsonc
{
  "eventId": "cae-<UTC日期>-<8hex>",       // cae = cognition asset event
  "asset": {
    "class": "memory|colleague|social",     // 三资产类
    "leg": "learning|runtime",              // 双腿（social 前瞻期=预置字段）
    "seat": "<席id>",                        // 资产归属席（org 级=organization）
    "path": "<资产相对路径>",                 // 腿内定位
  },
  "action": "write|update|promote|archive|inject",  // 五动词（注入=消费侧）
  "actor": { "type": "seat|daemon|pipeline|human", "id": "<id>" },
  "when": "<ISO+Z>",
  "why": "<依据指针：任务书/令/任务书锚/自动策略 id>",   // 写入可溯源的关键字段
  "evidence": { "diff": "<摘要或指针>", "commit": "<sha 若走 git>" },
  "inject": { "consumer": "<id>", "scope": "<注入范围>" }  // 仅 action=inject 时
}
```

**设计要点**：
- `why` 字段强制（空值仅允许 daemon 自动策略类，且须带策略 id）——「写入可溯源」的核心是**依据可指**，这正是认知层线「归档复活纪律」（引用归档件须评审）的审计面落地；
- `evidence.commit`：走 git 的资产（学习腿策展件）以 commit sha 为证据——**git 即审计流的物理载体之一**，不重复存 diff；
- `inject` 事件=消费侧审计——「注入可核对」的回答（谁在什么时候被注入了什么资产），与 knowledge-injector 的 sync 对接。

## 三、三级留痕机制

| 级 | 回答 | 机制 | 落点 |
| --- | --- | --- | --- |
| L1 写入级 | 谁何时写了什么 | 伴生流（信封 append） | 各腿 audit 流文件（JSONL，transition 模式） |
| L2 变更级 | 改了什么（diff） | git commit（策展件）/版本链（运行态） | git 本体+信封 evidence 指针 |
| L3 注入级 | 谁被注入了什么 | injector/会话装配点发 inject 事件 | 注入方 audit 流（与 L1 同构异域） |

- **运行态高频写**（kernel sync_turn）：L1 按**会话聚合**（session-end 一条汇总事件+指向运行明细），非逐 turn 追加——审计流不成为运行腿性能税（体积预算门思想同 p2）。
- **学习腿策展件**：git commit 即 L1+L2（commit message 模板含 why）——策展件的审计几乎零新增机制，**纪律面而非技术面**（commit 模板化）。

## 四、查询接口（两查询答四问）

- **按资产轴**：`query(asset={class,seat,leg}, time窗)` → 该资产全部事件流水（列举 WHAT+溯源 WHO/WHEN）；
- **按消费轴**：`query(inject={consumer|seat}, time窗)` → 注入流水（核对 WHAT-WAS-INJECTED）；
- 实现形态 MVP=**文件流+脚本查询**（JSONL grep/jq 级，零新依赖——triage 先例）；P2=入 knowledge.db（injector 已有 DB 位）提供结构化查询。**不先建库**——审计量级未到，文件流先行（MVP 划线纪律）。

## 五、分界裁定（与 audit 区及 runtime 审计）

| 面 | 管什么 | 与本方案关系 |
| --- | --- | --- |
| **knowledge/audit + cognition home audit/**（认知资产审计） | 资产内容事件（本方案域） | 本方案落点 |
| **runtime 审计**（trilc session-store/daemon 审计） | 进程/会话/任务执行面 | **分界线=对象**：审计「资产内容变更」归本方案，审计「谁跑了什么任务」归 runtime——同一事件双面皆涉时各记各面（例如 pipeline 写资产：runtime 记任务执行，资产审计记内容变更，信封 evidence 互指） |
| **SEC 白名单日志**（transition/安全面） | 凭据/安全事件 | 不混流：SEC 日志永不入认知资产审计流（密钥零落盘纪律延伸）；资产审计永不载敏感值 |
| **绩效/经营记录**（CHO/COS 域） | 人的产出评价 | 审计流是**客观输入**可被其引用，但不承担评价语义——审计流写事实，评价在别处（分域纪律） |

## 六、三资产接线差异（注记级，细节随各命题合流）

- **记忆（双腿）**：学习腿=git 模板化+inject 事件（近零成本）；运行腿=kernel bundle 伴生流+会话聚合（接线 kernel 已有 audit_namespace，半现成）。
- **colleague（动态化）**：动态资产的每次**关系变更**（新增协作/升级收口矩阵/派工绑定）=update 事件（why=派工单/联审锚）——与 M-004 派工留痕天然同构，接线成本低；静态契约件的维护归 git 常规。
- **social（前瞻）**：预置信封字段（asset.class=social/leg 预留），前瞻期**只定结构不实现**——角色社交的审计需求随 CPO 命题 3 形态清晰后再接线（不提前造）。

## 七、分期思路（节奏令=慢优化逐步落实）

- **思路阶段（本件）**：只定信封/原则/分界——不动现役。
- **首落（候批后）**：学习腿 commit 模板化（纪律面）+injector inject 事件（两处小改）——四问中「注入可核对」先通（现役 injector 是唯一活跃消费方）。
- **次落**：运行腿 kernel 伴生流接线（候 kernel 复活/运行需求触发——与归一线 kernel 收编计划同里程碑）。
- **不落**：查询库/social 实现（各自候触发）。

## 八、使用依据

- 命题书 task-charter-20260920-cognition-assets-audit（CEO 21:33 四条定调）
- 实勘五类：letter-store store.ts（ledger 分表模式）/kernel meta_cognition_kernel.py（audit_namespace）/knowledge audit 区（骨架位）/transition.ts（JSONL append 模式）/session-store（recovery+audit 双用）
- 认知层归一线定案（双腿/审计分域同构/knowledge 路径仓前缀）；LG-036 通道（letter 台账现役）；M-004 派工留痕（colleague 动态化同构）；knowledge-injector sync.ts（注入面唯一活跃消费方）
