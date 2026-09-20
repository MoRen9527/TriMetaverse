# LG-035 本地侧 Web UI — 设计 spec + 走查记录

- sourceOfTruth: 本文件（LG-035 本地侧 web UI 设计+实现+走查；交付窗记录）
- syncMode: frozen（交付窗；修订须注明）
- lastSyncedAt: 2026-09-14T16:10+0800
- 派工源: BOD 转 CEO 令 2026-09-14 15:48+0800（第一优先级）
- 实现落点: `D:\Code\ai\TriModel`（本地 3333 实例；sg 侧 d0bf218 为形态范本）

## 一、交付概述

**本地侧 web UI = 本机 TriModel 实例（`http://127.0.0.1:3333/ui`）**，服务本地域（TriMLC 8713 / TriRLC 8711）的 glm/deepseek 时段切换配置。

- **本机入口**：`http://127.0.0.1:3333/ui`
- **令牌**：连接设置区填 API 令牌 + 管理令牌（本地环回面，值见就绪声明）
- **不放服务器**：本单交付=本机实例（127.0.0.1 环回）；sg 侧部署=COS 域另窗
- **本地半自动**：策略编辑→「应用到本机」直生效（不经 COS 应用链）

## 二、设计

### 2.1 架构位

```
[本地侧 web UI 127.0.0.1:3333/ui]
   │ 读/写
   ▼
[TriModel 本机实例]
   ├─ 卡 trimmc-card.json（策略实体库：strategies/active_strategy_id）
   ├─ policies/local.json（生效面：schedules）
   └─ /v1/config/keys → default_model（三层求值：窗口命中→卡默认→env 出厂）
   ▲
   │ key-cache 拉取（TRILC_TRIMODEL_API_URL，默认 127.0.0.1:3333）
[本地域 daemon：TriMLC 8713 / TriRLC 8711]
```

- 词汇对齐 sg 在役 UI（LG-035 v3 增补件族）：策略/模型集/时段规则/活动策略/默认模型——零自创术语。
- 引擎零改动：本单只加 UI 语义层与「应用到本机」桥（传输非转换，`evaluatePolicy` 未动）。

### 2.2 交互级 spec（逐交互）

| # | 交互 | 行为 | 验收 |
|---|---|---|---|
| I1 | 打开 `/ui`（未连接） | 连接设置自动展开+引导；**域标签无鉴权即显示**（runtime-info） | 域标签=「本地域（TriMLC/TriRLC）」 |
| I2 | 填双令牌→「连接」 | 探针校验（卡 GET）→三态状态点；成功自动重拉全部数据 | 绿色「已连接」+策略/生效值渲染 |
| I3 | 「策略」下拉 | 列出卡内策略名（未启用标「已停用」）；空态「暂无策略，请先新增」；**选中=活动策略回显** | 下拉含策略名+value=active_strategy_id |
| I4 | 策略详情区 | 活动策略/目的/默认模型/模型集/规则数+**规则列表**（时段→模型映射可视） | 三窗规则逐行可见 |
| I5 | 「切换至选中策略」 | 本地意图置 active（保存卡片后持久） | 保存后 reload 回显 |
| I6 | 「清除（不使用策略）」 | active=null（回落时段规则执行） | 保存后详情「无（按时段规则执行）」 |
| I7 | 「新增策略」 | 名称必填/目的选填/模型集/默认模型/启用 | 保存后下拉+列表出现 |
| I8 | 「应用到本机」（`TRIMODEL_LOCAL_APPLY=1` 显） | 活动策略 rules→`policies/local.json`（schedules）+卡 default_model 同步；成功提示+刷新生效值 | 提示「已应用到本机：…」+生效值按窗命中 |
| I9 | 「保存卡片」 | 防双击（「保存中…」）+服务端确认绑定（2xx 才翻「待应用」） | 401 红态人话不翻 |
| I10 | D15 幂等 | 同厂商+同模型条目跨 id 去重（静默更新） | 连点保存条目数不变 |
| I11 | 失败态 | 401「管理令牌被拒」/503「管理写面未启用」/网络「无法连接配置服务」+重试钮 | 人话无 HTTP 码/黑话 |

### 2.3 本单新增（相对 d0bf218 范本）

1. `GET /v1/config/runtime-info`（无鉴权只读）=域标签+本机应用开关+机器名——UI 免令牌即可正确标注作用域。
2. `POST /v1/config/trimmc-card/apply`（admin 鉴权）=「应用到本机」：活动策略→policy 文档（rules→schedules，id=`strategy:<sid>:<i>`）→`policies/local.json`+卡 default_model 同步；无卡 404/无活动策略 400/悬挂 400/空规则 400（全人话）。
3. UI：域标签动态化（`tc-domain-label`）+「应用到本机」按钮（`TRIMODEL_LOCAL_APPLY=1` 门控显示）+策略 hydrate（`tcStrategies`/`tcActiveStrategy` 载入回填）+策略详情规则列表。
4. `policies/` 路径规范化（D9 同族）：`TRIMODEL_POLICIES_DIR` > 进程 cwd；boot 迁移 legacy 编译邻接旧位（幂等）——**本地侧部署实证 dist 构建版写 `dist/policies/`**（随 dist 清理丢策略）已根治。
5. 环境变量：`TRIMODEL_DOMAIN_LABEL`（sg 部署须设 `TriMMC（sg）`）/`TRIMODEL_LOCAL_APPLY`/`TRIMODEL_POLICIES_DIR`（README 本地侧节已载）。

## 三、走查记录（2026-09-14 15:5x-16:0x）

### 3.1 三档验证

| 档 | 方法 | 读数 |
|---|---|---|
| 单测 | `npm test` 全量 | **186 测 181 过/1 失败/2 skip**（失败=GATE UI E2E 的 STE 对表面，非本单引入） |
| jsdom | `test/ui-boot.test.ts` 13 案（含本单 3 新断言位） | 13/13 绿 |
| **真浏览器** | playwright 实探 `127.0.0.1:3333/ui`（全链：打开→连接→策略→规则→应用） | 全绿+截图 1 张（`lg035-local-ui-connected.png` 同目录） |

### 3.2 真浏览器走查发现（**两处真缺陷，jsdom 双盲区**）

1. **D16 调试探针残留**：`console.error('[D16dbg]/[D16-a]/[D16-b]/[D16-c]')` ×4 遗留 UI（生产 console 噪音）——**已清**。
2. **策略 hydrate 缺失**：`loadTrimmc` 未把卡 `strategies`/`active_strategy_id` 赋给前端态 → 策略下拉永空「暂无策略」（但卡内策略在）——**已修 + jsdom 回归断言补位**（连接后下拉必含卡内策略+规则列表行数）。
   → 教训归族：LG-035「纸面/单测绿≠真浏览器可用」；本单实证「jsdom 只测已断言面、真浏览器暴露实际渲染面」——**真浏览器走查 = UI 交付硬门**不可省。

### 3.2b CTO 独立走查（非作者手测，2026-09-14 16:1x）

**结论：PASS**。证据链（独立脚本 `.cto-walkthrough/findings.json`+4 截图；token 从 .env 自读注入）：

- I1 首启 ✓（连接设置自动展开+引导+**域标签无鉴权即显示**+面板禁用态）；I2 连接 ✓（双 token→「已连接」）；I4-I8 ✓（策略下拉 hydrate 生效/新增/apply 按钮）。
- **I8 全链 ✓（核心）**：选策略→切换→保存卡→apply→「已应用到本机：时段切换策略（3 条时段规则，默认模型 GLM-5.3）」→`policies/local.json` 落盘实证。
- **三层值链追加实证 ✓**：policy 在时 `keys.default_model=deepseek-v4-pro`（16:1x 命中 14:00-18:00 窗）／policy 清空后=GLM-5.3（回落卡 default 层）——**CEO 演示例（14-18 deepseek/其余 glm）运行时语义逐字成立**。
- 旁路修复（CTO 域）：daemon launcher cmd 内 token 过期双修+8711 重启（keys.json 16:08 刷新）；8713 待自然重启载入。
- CTO 脚本两次假阴性自记（apply 按钮 ID 猜测）——非产品缺陷。

### 3.3 E2E 真链路冒烟（原始读数）

```
PUT /v1/config/trimmc-card（时段切换策略）→ 200
POST /v1/config/trimmc-card/apply → 200
  {"ok":true,"applied":{"strategy_id":"s-hourly","schedules":3,"default_model":"GLM-5.3","machine":"local"}}
GET /v1/config/keys → default_model = deepseek-v4-pro   （16:04 命中 14:00-18:00 窗）
GET /v1/config/policy → effective=deepseek-v4-pro | source=policy | matched=strategy:s-hourly:1
policies/local.json → 3 条 schedules（00:00-14:00 GLM / 14:00-18:00 deepseek / 18:00-23:59 GLM）
卡 default_model=GLM-5.3 | active=s-hourly
```

### 3.4 演示策略（已预置于本机）

`时段切换策略`（目的：闲时用 glm 忙时用 deepseek）：00:00–14:00→GLM-5.3；14:00–18:00→deepseek-v4-pro；18:00–23:59→GLM-5.3。
**18:00 后本机生效面自动翻 GLM-5.3**（CEO 交互测试时点正对切换后态）。

## 四、已知边界与观察项

1. **跨午夜窗不支持（已裁定）**：`start ≥ end` 全链（表单/卡校验/策略校验）拒；24h 覆盖用相邻窗表达（本演示三窗）。引擎有跨午夜能力（U5-U8），暴露候后版。
2. **daemon key-cache（CTO 域，已修）**：本地缓存陈旧根因=launcher cmd 内 `TRIMODEL_API_TOKEN` 过期（cmd 侧 tm-loc\*→401；env 侧 a5cbb1\*→200）；CTO 已双 cmd 对齐修复+8711 重启（keys.json 16:08 刷新），8713 待自然重启载入。
3. **并发写冻结窗（BOD 16:3x 宣贯）**：16:09:18 `policies/local.json` 被清空＝本席 16:08-16:10 全量测试窗（含跑真链门禁件写根 policies）所致——已自领并**停跑一切测试**；17:30 起 policy/card 冻结（各席禁写，必需写先报 BOD），解冻=CEO 测试结束。演示态 16:10:42 现查完好。
4. `TRIMODEL_DOMAIN_LABEL` sg 部署须设 `TriMMC（sg）`（否则 sg 重部署后域标签显示默认本地域值）——部署 checklist 事项。
5. 策略「编辑/删除」按钮已挂 UI（active 禁删守卫在服务端）；本轮 UI 走查未逐一点验编辑流——候补充。

## 五、就绪声明（报 BOD 转 CEO）

本地侧 web UI **就绪**：本机 `http://127.0.0.1:3333/ui` 可交互（连接→策略→规则→应用到本机→生效值闭环）；演示策略已预置；真浏览器+jsdom+单测三档验证在卷；走查两发现已修闭环。交互所需令牌随就绪声明附送（本地环回面）。
