# LG-035 TriMMC 卡 schema v4 终稿（三实体模型·CTO 收口）

- sourceOfTruth: 本件（增补件 6 §六「供 CTO 终稿」的终稿正身；产品语义真源=增补件 6，本件只终技术形态）
- syncMode: static
- lastSyncedAt: 2026-09-14T21:08+0800（date 现查 21:08:49，本回合执行）
- 触发: BOD 2026-09-14 21:0x 终稿令——card.model_sets/card.rules 两实体+策略 schema+boot 迁移器+求值链展开式映射；FSD 候本件动层 1（数据+引擎）
- 代码实态依据: `TriModel/src/trimmc-card.ts`（card v2+strategies v3 可选域）、`src/policy.ts`（evaluatePolicy/validatePolicyShape 零改动基线）、`src/api/trimmc-card.ts` handleApplyStrategy:215-291（现行展开点）

---

## 〇、裁决 0：`card.rules` 同名翻型（version 2→4）

增补件 6 §六预告的 `card.rules: {<rid>: {...}}` 与现行 `card.rules: CardRuleRef[]`（v2 引用清单域，数组）**同名异型碰撞**。终稿裁决：**同名翻型**——v4 起 `rules` 键即实体字典语义，旧数组在 boot 迁移中消费完毕（window 引用→time 实体），不另设 `rule_entities` 新键避让。理由：①旧清单域本就是「展示+悬挂校验」的弱域（运行真源=policy.json，注释在卷），翻型后职能完全被实体域吸收；②避免一卡两键长期并存（`rules` 数组残骸+新键）的命名混乱——正是族 2 命名纪律要防的形态。

版本号直跳 **4**（现行代码 version 字面量=2；v3 策略域未 bump 版本，strategies 为可选域）。迁移器认 2 与 2+strategies 两种入态。

## 一、schema 正身（分型字段制）

```ts
export const CARD_VERSION = 4;

export interface ModelSetEntity {
  name: string;          // 卡内唯一
  entry_ids: string[];   // 引用 provider_entries；守卫=悬挂拒绝
  created_at: string;
  updated_at: string;
}

export type RuleType = 'time' | 'default' | 'quota';

export interface RuleEntity {
  name: string;          // 卡内唯一
  type: RuleType;
  enabled: boolean;      // 停用=保留但不参与组合（§一 规则卡）
  time?: { start: string; end: string };  // time 必备；HH:MM，start<end（跨午夜=P2，引擎已支持、MVP 卡面拒绝）
  entry_id?: string;     // time/default 必备（窗内/默认用哪个条目）
  watch_entry_id?: string; // quota 必备（监控谁）
  fallback_ids?: string[]; // quota 必备（有序转入序列，≥1）
  created_at: string;
  updated_at: string;
}

export interface StrategyEntityV4 {
  name: string;          // 卡内唯一
  purpose?: string;      // 5b 沿用，可选
  model_set_id: string;  // 守卫=必须存在
  rule_ids: string[];    // 守卫=逐项存在；可含 time/default/quota 混合
  created_at: string;
  updated_at: string;
}
// v3 StrategyEntity 的 enabled/models/内嵌 rules/default_model 全部废弃（增补件 6 §五）；
// strategy.enabled 不设——活动性由 active_strategy_id 单点表达。

// 卡文档 v4 增量（machine/connection/provider_entries/status/reserved 不变）：
{
  version: 4,
  model_sets: Record<string, ModelSetEntity>,
  rules: Record<string, RuleEntity>,              // ← 翻型位
  strategies: Record<string, StrategyEntityV4>,   // ← 实体形态换代（同键新形态）
  active_strategy_id: string | null,
  deleted_entry_ids?: string[],        // PUT 合并删除通道（现行）
  deleted_model_set_ids?: string[],    // ← 新增对称通道
  deleted_rule_ids?: string[],         // ← 新增对称通道
  deleted_strategy_ids?: string[],     // （现行）
  default_model?: string | null,       // 派生缓存：apply 时自活动策略 default 规则同步；真源=规则实体，无编辑面
}
```

**分型字段必备性**（validateCardV4 硬校验）：time→`time`+`entry_id`；default→`entry_id`；quota→`watch_entry_id`+`fallback_ids(≥1)`。三型互斥多余字段不拒绝（向前容错），缺必备字段拒绝。

id 生成：沿现行策略 id 通道扩展三前缀（`ms_`/`rule_`/`st_` + 随机段），卡内唯一由键位保证。

## 二、boot 迁移器（幂等）

### 幂等判据（先判后动，任一命中即不入变换）

- **甲**：`version >= 4` → 原样返回（正常态）。
- **乙**：`rules` 为对象（非数组）或 `model_sets` 为对象 → 半迁移/手工态：只补 `version=4` 与缺失缺省键（`active_strategy_id ?? null` 等），**不重跑打包**（防「当前配置」重复生成、防 id 二次生成）。
- **丙**：变换失败（解析异常/条目解析不出的非预期态）→ **原子不落盘**，原卡保持不动（写 tmp+rename；失败即弃 tmp），下次 boot 重试。

迁移成功即写 version=4，此后永远走甲——幂等闭封。迁移前备份 `trimmc-card.pre-v4.bak.json`（保留一代，成功不删、再迁移覆盖）。

### 变换规则（v2 / v2+strategies 入态）

1. **运行真源选择**：`active_strategy_id` 命中 v3 策略（实体含 `models`+内嵌 `rules` 字段）→ 以该策略为真源；顶层 rules 数组视为陈旧展示域，清空并记日志（条数入迁移日志）。否则 → 顶层 rules（window 型）+ `default_model` 为真源。
2. **时间规则拆分**：旧 window 引用/内嵌规则的 `windows[]` 是多窗——**每窗拆一个 time 实体**（name：单窗=原名/`rule_id`；多窗=原名#i；v3 内嵌匿名规则=策略名#i；entry_id 照搬；enabled 照搬）。
3. **默认规则**：`default_model`（模型名）→ 解析条目：enabled 且 `model` 匹配，多条同模型取 **id 字典序最小**（确定性）；无匹配条目 → 不建 default 实体+迁移日志（语义=回落系统默认，与旧 null 等价）。v3 策略的 `default_model` 同法。
4. **模型集**：v3 策略 `models[]`（catalog 名单）→ 「`<策略名>集`」：entry_ids=全部 enabled 条目中 model∈models 者（按 id 字典序稳定）；无 v3 策略 → 「当前模型集」=全部 enabled 条目。
5. **策略打包**：无 v3 策略 → 打包「当前配置」（purpose=`boot 迁移自旧版卡`）引用上述集+实体，置活动。有 v3 策略 → **逐个升格**（活动者以原名保持活动，非活动者升格不置活动；各自的时间窗/default/模型集按 2-4 同法生成，命名空间独立）——用户历史策略是产品资产，不丢弃；升格复用同一套变换函数。

## 三、求值链展开式映射（引擎零改动）

### apply 改造点（handleApplyStrategy，api/trimmc-card.ts:215）

活动策略 `rule_ids` → 解析实体 → **分型分流**：

- **time 实体** → schedule：`{ id: 'strategy:<pid>:<rid>', target: 'daemon-default', model: provider_entries[entry_id].model, windows: [time], timezone: 'Asia/Shanghai', enabled: rule.enabled, priority: 100, type: 'window' }`。id 由现行序数 `<pid>:<i>` 改实体 id（重排序稳定）；priority 归一 100（同型时间规则 UI 级互斥窗保证唯一命中，重叠漏网时按 id 稳定排序兜底）。
- **default 实体** → `card.default_model = provider_entries[entry_id].model`（派生缓存同步——**保留现行 apply 时同步模式**，三层计算序 getter 零改动；v4 后卡面无 default_model 编辑面，缓存无第二真源风险）。
- **quota 实体** → 不进 schedules（异常路径层，见 §四）。

`validatePolicyShape → savePolicyForMachine` 链零改动；`evaluatePolicy` 零改动（文档级注入语义照准）。应用硬门保留：活动策略须含 ≥1 条 time 或 default 规则（与现行 `rules.length===0` 拒绝连续，防「应用了个寂寞」）；纯 quota 策略不可应用。

### 18:00 切换实证保形（验收锚）

1. 迁移前后 `policies/local.json` schedules 语义等价（id 换名 `trimmc:<entry_id>`→`strategy:<pid>:<rid>`、priority 归一除外）。
2. 全日 1440 分钟采样（00:00-23:59 每分钟）`evaluatePolicy` 结果逐点一致。
3. 手测复跑：18:00 窗切换实证（现行走查链）迁移后复跑通过。

### quota 求值层（钩子位）

effectiveModel 序插入 quota 层（仿 `registerCardDefaultModelFn` DI 模式，`registerQuotaSignalFn`，零循环导入）：

```
quota 信号就绪 且 活动策略 quota 规则的监控条目耗尽
  → fallback_ids 依序首个可用（序列耗尽=停留+「额度规则序列已用尽」失败态）
信号未就绪 / 无 quota 规则 / 未耗尽
  → 常规序不变（窗口 → default 规则（经 card.default_model 缓存）→ env 出厂默认）
```

MVP 实装=钩子位+空信号（层 inert，零影响常规链）；信号实接见 §四。

## 四、quota MVP 边界（判定信号=CTO usage 基座）

- **进 MVP（本批）**：schema 全形态（watch_entry_id+fallback_ids）/CRUD/引用守卫/UI「待额度数据」徽标（信号未就绪诚实显示，不伪造生效）/effectiveModel 钩子位+零影响回退。
- **不进 MVP（联调另排）**：判定信号实接（usage 基座→registerQuotaSignalFn 实装——素材基座=transition.ts JSONL 记录面，信号形态〔配额/余额/阈值〕联调时定）；实际触发切换联调；阈值 UI 编辑（P2）。
- 增补件 6 §三「额度触发=异常路径优先于常规」由 §三 求值序承载；触发历史入状态回写（COS 应用链回写照旧）。

## 五、引用守卫族（validateCardV4 校验矩阵）

| 操作/保存 | 守卫 | 拒绝文案（人话） |
|---|---|---|
| 删模型集 | 被策略引用 | 该模型集正被策略「X」引用，请先解除引用 |
| 删规则 | 被策略引用 | 该规则正被策略「X」引用，请先解除引用 |
| 删条目 | 被模型集引用 | 该条目正被模型集「X」引用，请先从模型集移除 |
| 删条目 | 被规则引用（entry_id/watch/fallback 任一位） | 该条目正被规则「X」引用，请先在规则中移除 |
| 删策略 | 是活动策略 | 活动策略使用中，请先切换 |
| 保存 | 悬挂引用（集内条目/策略引用集与规则逐项存在） | 指名拒绝（「引用的条目/模型集/规则不存在」） |
| 保存 | 同策略内 time 规则窗重叠 | 规则「A」与「B」的时段窗口重叠 |
| 保存 | 三实体名各自卡内唯一 | 名称「X」已存在 |
| 保存 | 分型字段必备性（§一） | 按缺失字段指名 |
| 保存 | quota fallback_ids ≥1 且全存在 | 转入序列不能为空 |

说明：条目删除守卫=被集**或被规则**引用均禁删（增补件 6 §一只列被集引用；规则三型全引用条目，校验器按全族执行——§七.2 走查断言×3 是最小集，非校验器边界）。`enabled` 条目态不进硬校验（创建时 UI 下拉过滤已启用条目；条目后停用=详情警示，不炸卡）。

## 六、「活动策略」词汇定稿（§二 裁决落地）

- 全 UI/API 错误文案/字段注释**只用「活动策略」**；「当前策略」退役入禁用词表（现存错误文案「当前策略」字样随层 2 清——含 trimmc-card.ts:236「暂无卡片配置：请先在"当前策略"区新增策略」等行）。
- 代码标识符 `active_strategy_id` 不变（英文标识符非显示词，不在禁用词域）。
- 活动态=「活动中」徽标；空态=「未启用」（系统默认直通，语义不变）。

## 七、FSD 层 1 任务面（数据+引擎；候本件即动）

1. `src/trimmc-card.ts`：CARD_VERSION=4+三实体 interface+validateCardV4（§五 矩阵）+migrateV4（§二 幂等三判据+变换）+loadCard 接入（v2 入态自动迁移）+deleted 三通道。
2. `src/api/trimmc-card.ts`：PUT 合并段透传 model_sets/rules（分型校验前置，沿 strategies 透传模式）；handleApplyStrategy v4 展开（§三 分型分流）。
3. `src/policy.ts`：**零改动**（validatePolicyShape/savePolicyForMachine/evaluatePolicy 均不动）。
4. `src/keys.ts`/`server.ts`：registerQuotaSignalFn 钩子位（空实装，层 inert）。
5. 测试门：迁移幂等（同卡跑两遍零差异）/18:00 保形三锚（§三）/守卫矩阵逐条/分型校验/全量回归四项读数（含既有失败逐族归因——全量读数纪律）。

层 2（API 合并面细化）/层 3（UI 三实体五区+§七 走查增补项）候层 1 验收后另派。

## 八、使用依据

- 增补件 6（W37/lg-035-cpo-redesign-trimodel-ui-v3-addendum6.md）§〇/一/二/三/五/六——产品语义真源
- BOD 2026-09-14 21:0x 终稿令（四要点：幂等判据/引用守卫/活动策略词汇/quota MVP 边界）
- 代码实态：trimmc-card.ts（card v2 schema+CardRuleRef+StrategyEntity v3）、policy.ts（windowMatches 跨午夜已支持/evaluatePolicy priority desc）、api/trimmc-card.ts:215-291（apply 展开点+default_model 同步模式+id 前缀先例）
- 增补件 4② D15（fixed 退役/type 收窄 window 单型）——迁移入态只含 window 的前提
