# LG-028 内容域路由治理立法·CTO 主审意见件（D-15）

- sourceOfTruth: TriMetaverse/docs/execution/lg-028-content-routing-review.md
- syncMode: source-only
- lastSyncedAt: 2026-09-03
- 性质：CEO 立法令主审（CTO 席：FADE 管线/publish flow S0-S8 控死机制+裁点 b/c+两案关系）；候 COS 合成转 BOD
- 立法意图（照录）：CLAUDE.md 只留公司结构客观描述／域知识随席路由（产品→CPO、技术架构主体→CTO、细节→FD、测试→ST 全员推）／约束三面=CLAUDE.md+.session.md+spawn agent 面／规则真源立法经 FADE 发布控死（禁直改发布件）

## 一、控死三面落点图（主审①：S0-S8 门链对三约束面的传导）

**规则真源→发布管线→约束面的传导链**（LG-023 治理链活样本实证）：

```
规则真源（FADE 立法，CAO/CHO 内容面）
  → S0 对账归一（过目制，CHO 状态机为门——三代漂移不归一不融合）
  → S2 源侧段（source-agents 真源，唯一可编辑面）
  → S3 校验段（validate + check-sync 传播漂移=0 + unittest）
  → S4 CHO 门（内容面验收，独立第二方法）
  → S5-S6 数据面/管线面（binding profile + HOST_RENDER_REGISTRY，definition 驱动）
  → S7 主窗 execute+对拍+冒烟（三约束面渲染落位）
  → S8 治理回填（registry/台账销账）
```

**三约束面的控死落点**：

| 约束面 | 控死闸（已实证机制） | LG-028 增量 |
| --- | --- | --- |
| CLAUDE.md | 仓库真源+commit 审计；**缺**渲染级闸（历来手编） | 立法后=FADE 规则真源驱动的受管面，手编=derived_drift 违例 |
| .session.md | HOST_RENDER_REGISTRY 渲染（sessionBody 声明派生+golden 节集+无 frontmatter 断言，LG-024 批 0 在役） | 域知识路由规则进 sessionBody 模板（真源侧），渲染面自然传导 |
| spawn agent 面 | binding profile definition 驱动（host_object_generation，fd8db82 双源教训后 S5 再生成机制化） | spawn 面工具/域裁剪规则进 definition（代码常量），禁 manifest 手补 |

**防直改闸的技术形态（三件套，本役全部有在役先例）**：①definition 驱动（手落键被再生成取代，fd8db82/M0d 双源教训固化）；②派生一致校验（derived_identical/drift，ADE-B 词表+LG-024 批 0 golden）；③渲染物禁手编辑（LG-023 S5-S7 惯例+通道 spec §8.6 同款条文）。

## 二、裁点 b：在途时序（主审②）

**裁「产出窗为界，非溯及既往；批内复审窗自然收编」**：

- 在途批=LG-024 批 1-3+M0e 批 2-3 渲染产物——LG-028 规则生效时点前的已产出件**不回溯重渲**（避双窗打架与渲染窗空转）；
- 收编路径=各批既有的复审/验收窗自然对表新规则：批 1 候 CHO 复审窗（在即）——复审时点已过 LG-028 生效点，**复审清单加一页「内容域路由对表」**即可（增量极小）；批 2-3 尚未产出，实施时点直接按新规则（CLAUDE.md 减法面在批 2-3 落地，见④）；
- 唯一硬性回溯项：CLAUDE.md 本体（约束面第一面）——生效后其「域知识内容」段落迁移属新规则实施件，候批 2-3 窗统一动，生效窗内 CLAUDE.md 冻结构造型改动（防生效前夜突击改写）。

## 三、裁点 c：spawn/session 分工矩阵定谳（主审③，三源合一）

三源：§8.7 附则（daemon spawn CC 组长立法）+M-004（席位派工 SendMessage 直达默认+spawn 三残留场景）+LG-024 矩阵草案（批 0 实证）。**定谳矩阵**：

| 面 | 本体形态 | 唯一正解通道 | 上下文语义 |
| --- | --- | --- | --- |
| 常驻席（13 席） | CC 交互会话（.session.md 合同） | SendMessage 直达（M-004 唯一默认） | 活干在谁会话，经验上下文积累在谁 |
| 业务组长（M 面） | daemon spawn 独立 CC session（§8.7） | 信箱 API（任务队列审计）+CC 原生跨会话（实时对话） | 事件驱动唤醒，状态在信件 DB 不吃上下文 |
| 一次性侦察 | spawn `claude -p` 只读（M-004 场景③） | 结果落盘回传 | 无状态，即用即弃 |
| in-process agent（R 面） | heartbeat-runner agentLoop（§8.6 降级模式，冻结） | 信箱 API | 哑巴会话局限如实立法在案 |

**收编 LG-024 矩阵草案**：批 0 实证的 sessionBody 渲染机制=常驻席合同面的唯一管线通道——spawn 面与 session 面在 LG-028 下是**同一规则真源的两个渲染目标**（.session.md vs spawn agent 定义），不存在第三种席位合同形态。

## 四、两案关系（主审④）

- **LG-028 规则约束 LG-024 批 1-3 产物**：约束的是产物内容（CLAUDE.md 减法+域知识随席），不是管线（LG-024 渲染管线即 LG-028 控死机制的执行载体——两案同构互补非竞合）；
- **实施时点耦合**：CLAUDE.md 减法面=LG-024 批 2-3 的实施内容之一（批 2-3 触及的席次合同随批载新域路由规则；CLAUDE.md 本体减法候批 2-3 窗一次执行，不做游离小改）；
- **管线侧增量**：LG-028 生效后 HOST_RENDER_REGISTRY 的 CLAUDE.md 渲染条目（若立法裁 CLAUDE.md 入管线面）需 CTO 域扩宿主注册表——候 BOD 裁 CLAUDE.md 是否入渲染管线（技术面两案皆通：入=全控死；不入=保留手编+commit 审计+drift 检查——**我倾向入**，CLAUDE.md 是三面中唯一无闸面，立法意图「禁直改发布件」应含之）。

## 五、候 BOD 裁点汇总

1. 控死三面落点图与三件套防直改闸照准；
2. 裁点 b 产出窗为界+批 1 复审窗加路由对表页；
3. 裁点 c 分工矩阵四行定谳（含 in-process 降级模式冻结维持）；
4. CLAUDE.md 入不入渲染管线（CTO 倾向入——三面同闸）；
5. CLAUDE.md 减法实施窗=LG-024 批 2-3 统一执行。
