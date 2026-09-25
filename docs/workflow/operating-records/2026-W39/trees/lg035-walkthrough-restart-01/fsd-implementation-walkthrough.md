# TASK-LG035-WALKTHROUGH-RESTART-01 · FSD 实现面走查报告

- **席**：FSD（小全，m-fsd）｜**派工**：COO 2026-09-25 19:4x 补段令（CEO 19:31 开闸线，任务书 4717f20d）
- **签发**：2026-09-25 20:00（date 现查 11:59:56Z 折算）｜**截点**：今晚 22:00（即时制）——**本报告 20:00 交，早于截点**
- **域**：实现行为层（CTO 主办段=概念/四族/spec 对照层，并行不撞——本报告补其实现细节面）
- **对象**：`D:\Code\ai\TriModel`（git 顶 6fa5dbc，工作树 clean 实勘）
- **spec 正身**：`2026-W38/lg-035-local-ui-spec.md`（frozen 交付窗态）
- **边界遵守**：全程只读零写（policy/card 未触、3333 活体只读不扰、O 族窗维持冻结未混线）

## 一、四问逐答（实现面份额）

### 问1 概念建模对照（策略=命名一等实体）——实现面判定：**一致 ✓**

- 策略实体 v4 引用式表单（`ui/index.html` L1133-1146 `tcOpenStrategyForm`）：字段=名+目的+引用模型集下拉+规则多选——无内嵌条目直选，「命名+目的+引用」三要素齐；
- `trimmc-card.ts` L819 侧注释明记「D19→v4 三实体（策略=一等实体；策略={命名,目的,引用模型集,引用规则[]}）」；
- 切换=选名字：`tc-strategy-sel` 下拉按策略名展示（L1056 `tcStrategies[id].name + '（活动中）'`），`tc-str-switch` 仅写 `active_strategy_id`（L1174）——非选条目；
- 「活动策略」词汇全 UI 面统一（L769/775/792/1069/1116 等），L821 注释「『活动策略』词汇定稿，『当前策略』退役」实证。

### 问2 四族排查（实现面读数；检具=LG-035 七条否决清单）

| 族 | 读数 | 判定 |
| --- | --- | --- |
| 术语族 | 「活动策略/条目/模型集/规则/已回落」全 UI 一致；两处 CPO 警示文案逐字同句（L103/L117，d012e1e「两栏同构同句」实证） | ✓ |
| 命名族 | 控件 id 前缀 `tc-*` 一致；三实体区/规则窗/chips 分区 id 无撞名 | ✓ |
| 布局族 | 本席只验 DOM 结构完整性（五空态元素 `tc-wr-empty/tc-ms-empty/tc-r-empty/tc-str-list-empty/tc-strategy-sel` 均在位）；视觉布局归 CTO 主办段/CEO 真人窗 | 分域 ✓ |
| 逻辑双路径族 | 保存成功/失败、连接三态、apply 成/败、hydrate 有/无令牌、五处空态/有态——全双路径在位；**例外见发现⑤（保存失败路径文案）** | ✓（1 处例外） |

### 问3 实现态走查（spec 逐条对照）——本席主段

**I1-I11 对照表**（实现位全在 `ui/index.html`，除注明外）：

| spec 项 | 实现位 | 判定 |
| --- | --- | --- |
| I1 首启引导 | `boot()` L268-292：无令牌→`conn-settings.open=true`+引导 div+面板禁用；L70 HTML `open` 属性双保险；`runtime-info.ts` 域标签 spec §2.3.1 逐字合规 | ✓ |
| I2 连接探针（卡 GET）+三态点 | `conn-save` L309-337：200→绿「已连接」/401·503→黄「已填入未验证」/网络→灰+错误面板+重试 | ✓ |
| I3 策略空态 | L192 `<option>暂无策略，请先新增</option>` 逐字 | ✓ |
| I4 条目 CRUD | L626-679 + L834-902（模型集）/L906-1048（规则）：级联过滤 L643、base_url 预置 L644、密钥占位符防呆 L666、长度≥16 L667 | ✓ |
| I5 切换策略 | L1171-1177：写 `active_strategy_id`+「保存卡片后生效」显式时机告知 | ✓（文案见发现⑥） |
| I6 清除策略 | L1179-1183：「已清除策略（不使用策略）」人话 | ✓ |
| I7 新增表单校验 | L659-679：名/钥/地址三必填+占位符+长度校验，保存不自动 PUT（脏徽标语义） | ✓ |
| I8 应用到本机门控+流 | 门控 L688 `applyBtn.hidden = !local_apply_enabled`；apply L692-709：防双击「应用中…」+服务端人话 message 直显+`refreshEffective()` 生效值刷新 | ✓（活体态见发现①） |
| I9 保存防双击+2xx 绑定 | L711-755：「保存中…」禁用+finally 恢复；D17 注释明记「徽标翻转仅在 PUT 2xx 服务端确认后发生」 | ✓ |
| I10 跨 id 去重 | `trimmc-card.ts` L116-121：provider+model 对去重，旧 id 静默丢弃=spec I10 一致（代码合规，注释措辞旧→发现④） | ✓ |
| I11 用户面零 HTTP 码/黑话 | `humanize()` L246-253 五映射；连接/apply/401 专文案路径全部人话 | ✓（例外见发现⑤⑥） |

**§2.3 五项（LG-035 本地侧新增）**：runtime-info 三字段逐字合规 ✓；apply 四态人话（404 暂无卡片/400 未选策略/400 挂起规则×3 变体/400 空规则）+硬门 ≥1 time-or-default 规则 ✓；apply 成功消息含策略名+规则数+默认模型 ✓；域标签默认值「本地域（TriMLC/TriRLC）」逐字 ✓；本机应用开关门控按钮 ✓。

**spec §3.2 走查发现修复回归核验**（走查历史两项）：

- 空显根因①（无令牌静默 return）：修复仍在位——`loadTrimmc` L1187-1194 failPanel 引导+自动展开连接设置 ✓；
- 空显根因③（规则窗直显生效）：修复仍在位——`tcRenderWindowRules` L765-788 活动策略 time 规则窗行只读直显 ✓；
- **发现②修复（策略 hydrate 缺失）回归核验：在位**——L1210-1215 四赋值（model_sets/rules/strategies/active_strategy_id）+L1216-1217 deleted 通道清零+L1218-1224 七渲染链全调；注释明记「真浏览器走查实证缺此赋值=下拉永空，jsdom/断言双盲区（2026-09-14）」。

**LG-036 冻结后增补「只增不改」核验**：

- 路由层（`routes.ts` L113-121）：`claude-fallback/sg/*` 独立 URL 空间，LG-035 面（`trimmc-card/runtime-info/apply`）路由零改动 ✓；
- `runtime-info.ts`/`trimmc-card.ts` apply 处理器行为与 frozen spec 语义一致（含 v4 演进点，见发现②③）；
- 定性：**LG-036 增补未触碰 LG-035 行为面，「只增不改」在实现层成立**（全景回归读数归 STE 段）。

### 问4 首启链验证——本席份额=源码层首启链走读；真人手测归 CEO 测试窗

源码层链路完整性走读（boot→连接→hydrate→切换→保存→apply→生效值）：

```
boot() L1228
 ├─ localStorage 令牌回填 → loadRuntimeInfo（域标签+apply 门控）
 ├─ 无令牌：conn-settings 自动展开+引导+面板禁用（spec I1）
 └─ 有令牌：loadTrimmc → failPanel 清空 → tcMirror 重建（D7 只读镜像）
     → v4 三实体 hydrate（发现②修复位）→ 七渲染链
切换 tc-str-switch → active_strategy_id + 脏徽标 → 保存 tc-save（防双击+D17 2xx 绑定）
 → apply tc-apply（门控按钮→应用中…→服务端 message→refreshEffective 生效值刷新）
```

链路无断点、无静默吞错（各环节失败均有 failPanel/tcMsg 出口）。**保存→reload→断言仍在完整周期**（第四型盲区检具）：数据面=PUT 持久化 card→reload 后 `loadTrimmc` 重拉全量 hydrate——源码层闭环成立；**实测留 CEO 真人窗**（本席禁写，PUT/reload 周期不动活体）。

## 二、发现清单（8 项，零修复全记录）

| # | 发现 | 位置 | 定性 | 严重度 |
| --- | --- | --- | --- | --- |
| ① | 活体 `local_apply_enabled:false` → apply 按钮按门控隐藏——CEO 测试窗若要验「应用到本机」闭环，需先置 `TRIMODEL_LOCAL_APPLY=1`（**测试窗就绪度前置项，候 BOD/CEO 决**；本席只记录未动活体） | `runtime-info.ts` L12 + 活体探针 | 测试窗就绪度缺口 | **中（阻 CEO 闭环测试）** |
| ② | v4 schedule id 三段式 `strategy:${activeId}:${rid}:${wi}`（窗级条目，BOD 09-14 22:2x 勘正后形态）vs frozen spec 两个字段示例 `strategy:<sid>:<i>`——版本演进差异非缺陷，spec 候随走查轮更新 | `trimmc-card.ts` apply 侧 | 版本差记录 | 低 |
| ③ | `default_model: base.default_model ?? null`（PUT 恒取基卡，derived-cache 只经 apply 同步）vs 同行注释「一致时透传」——代码行为对（spec 精神），注释漂移 | `trimmc-card.ts` PUT 侧 | 注释漂移 | 低 |
| ④ | D15 去重注释「同条目名+同厂商+同模型」vs 代码实际 provider+model 对（名不参与）——代码=spec I10 合规，注释措辞旧 | `trimmc-card.ts` L116 | 注释漂移 | 低 |
| ⑤ | **tc-save 非 200 失败路径 `L743` 把 `r.status` 数字拼进用户文案**（`'保存未成功（' + r.status + '）'`）——401 有专文案、200 成功，但 503/5xx 兜底路径泄漏 HTTP 码，违反 spec I11「零 HTTP 码」验收；`humanize()` 在同文件已存在未复用 | `ui/index.html` L743 | I11 破功点 | **中** |
| ⑥ | tc-str-switch 成功文案 `'已切换至策略 ' + id`（L1176）——用户面显示内部 id（`st_xxx`）而非策略名（`tcStrategies[id].name` 可得未用），内部标识泄漏用户面 | `ui/index.html` L1176 | I11 破功点（黑话族） | 中低 |
| ⑦ | `document.querySelectorAll('.card-main, #local-zone')`（L297）——`#local-zone` 为 D13 删除区的死引用（选择器空匹配无害），删除残留 | `ui/index.html` L297 | 删除残留 | 低 |
| ⑧ | 连接路径 401 文案「令牌不正确或未填写…」（humanize）与保存路径 401「管理令牌被拒：…」（L739 专文案）不同源——两者各自合规（spec I11 字面=「管理令牌被拒」），仅同码双文案一致性观察 | `ui/index.html` L250/L739 | 一致性观察 | 低 |

**汇总**：spec 交互面 11/11+§2.3 五项+修复回归 3/3 全合规；破功点集中在**失败路径文案层**（⑤⑥），无逻辑/数据面缺陷新发现。①为测试窗就绪度候决项，②-⑧为记录项（冻结窗内不动，候 CEO 终验收后随走查轮排修）。

## 三、边界遵守声明

- 走查全程只读：TriModel 源码 6 文件读毕（routes/runtime-info/trimmc-card/ui 全文+spec+任务书），活体仅 GET 探针（runtime-info/keys 401），零 PUT/POST/apply、零 policy/card 写；
- O 族窗（O-1/O-2/O-3）与 N-1 修法维持冻结未混线（TC 工作树未提交态原样）；
- 3333 活体健康未扰（任务书 §四 19:3x 勘 HTTP 200 与本席探针一致）。

## 使用依据

- 任务书：`2026-W39/task-charter-lg035-walkthrough-restart-01.md`（4717f20d）
- spec 正身：`2026-W38/lg-035-local-ui-spec.md`（frozen 态）
- 实现源：`D:\Code\ai\TriModel`（顶 6fa5dbc clean）——`src/api/{routes,runtime-info,trimmc-card}.ts`、`ui/index.html`（1231 行全文）
- 纪律：UI spec 必附实现态走查／活体优先诊断法／MVP 划线纪律（memory 族）
