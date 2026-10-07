# cc-switch 读取 GLM 额度机制调研（CEO 10:36 令·关联候裁①③）

- sourceOfTruth: 本件（trees/cho-weekly-scheduling-review-01/ccswitch-quota-endpoint-research.md）
- syncMode: static
- lastSyncedAt: 2026-10-07 10:4x +0800（date 现查制）
- 令源: CEO 10:36「搜互联网查 cc-switch 手册为什么能读取 GLM（bigmodel）5 小时/7 天额度」（附 cc-switch 截图：Zhipu GLM 卡片 5小时:6% 3h32m / 7天:67% 10h10m）

## 一句话答案

bigmodel 有一个**半公开监控端点** `GET https://open.bigmodel.cn/api/monitor/usage/quota/limit`，用**你现有的 Coding Plan API key** 直调即返回 5 小时窗+7 天窗两型额度百分比与重置倒计时——cc-switch 只是把这个端点封装成了「Token Plan 内置模板」（v3.13.0 起），不是它有什么特权通道。

## 机制三件（源码实锚）

1. **端点推导**（coding_plan.rs L326-347 `zhipu_quota_base()`）：cc-switch 从用户配置的 base_url 推导——含 `bigmodel.cn`→`https://open.bigmodel.cn`，含 `api.z.ai`→国际站；配额端点与 coding 端点**同 host**，quota 路径=`/api/monitor/usage/quota/limit`（两 preset 同路径同 JSON 形态）。设计注释原话：用「已在跑 coding 的同一 host 的可达性」定成败，无跨 host 兜底。
2. **认证形态**（L351）：`Authorization: <api_key>` **裸值不加 Bearer 前缀**——同一把 coding key 既跑模型调用又查额度，个人版 Coding Plan **零额外头**。团队版（Team Plan）变体（L1644-1649）：同路径+`?type=2`+额外头 `bigmodel-organization`/`bigmodel-project`（与 key 三者缺一不可，参考 token-monitor zaiTeamLimits.js）。
3. **解析显示**（L173-181）：响应 `limits` 数组逐项取 `detail.limit`/`remaining`→`utilization=(limit-remaining)/limit`→卡片底部百分比+重置倒计时（<70% 绿/70-89% 橙/≥90% 红）；启用方式=供应商卡片「用量查询」钮→开「启用用量查询」→选 Token Plan 模板（手册 2.5 节：Zhipu GLM 在 Token Plan 内置模板列，与 Kimi/MiniMax/火山方舟同列）。

## 社区生态交叉印证（非孤例，事实标准）

六+独立工具同调此端点：pi-glm-quota / opencode-glm-quota / zai-limits（PyPI）/ zai-rs（crates.io）/ coding-usage-bar（npm）/ GitHub issue #1588/#20911 脚本示例——bigmodel 未将其列入公开 API 文档主册，但属社区事实标准；变动风险自担（cc-switch 同类注释「保持宽松解析」）。官方文档（docs.bigmodel.cn 常见问题）确认 5h+周窗双限机制本身。

## 对反省会候裁项的意义

- **候裁①（console 66% 语义定谳）候选答案**：CEO 面板 66% 与 cc-switch 截图「7天:67%」同量级，**大概率同一数据源**（bigmodel 侧套餐额度百分比，按 bigmodel 计费口径计分子分母，非本地 raw token 汇总）——此系推断非定谳，标注。这同时解释 CFO 卷 raw 三口径（all-in 155.6%/非缓存 10.7%/cacheR）无一映射 66%：两套计量体系（本地 token 数 vs bigmodel 计费面）。**验证法**：用现有 key 直调该端点，读数与控制台面板对照，一次调用定谳。
- **候裁③（relay owner）现成路径**：M3「额度感知排程」数据源可直接用该端点——一段 curl/脚本（key 进 Authorization 头）即可 relay 成每日额度读数行，比人工读控制台面板机制化高一个量级；CFO raw 日耗行（10-08 起）之外补上 bigmodel 侧口径行。
- **凭据与纪律**：验证调用用 CEO coding key（key 只进请求头发往 bigmodel 官方域=正常使用形态，零值面出机）；团队版才需 organization 头（我司个人版 presumable，调用即证）；端点非公开文档化，relay 脚本须容错（端点变更风险）。

## 候令项

候 CEO 一句批即可执行验证：本机取 sg-glm-direct.txt key→curl 直调端点→读数回呈（百分比+重置时点，与面板 66% 对照定谳）。零敏感值回显（只回百分比与倒计时，不回 key）。

## 验证定谳（CEO 10:44「批」→10:45 直调 200·一次打通）

**调用形态实证**：`curl -H "Authorization: <key裸值>" https://open.bigmodel.cn/api/monitor/usage/quota/limit` → HTTP 200 零额外头（个人版 Coding Plan 确认，organization 头不需要）。

**三源对照表（周窗）**：

| 读数面 | 时点 | 5h 窗 | 周窗 | 周窗重置时点 |
|---|---|---|---|---|
| CEO 面板（09:24 令） | 09:24 | — | 66% | 20:44（令原话） |
| cc-switch 截图 | ~10:36 | 6% 3h32m | 67% | ~20:46（10h10m 倒计时） |
| **端点直调** | 10:45 | **7%** | **68%** | **10-07 20:44:33 北京（date 工具换算）** |

**定谳三件**：
1. **同源铁证**：周窗重置时点三源精确同点（端点 20:44:33 vs CEO 令 20:44，秒级吻合）；66%→67%→68% 单调爬升=同源滚动窗消耗曲线（时点差正常推进）。
2. **候裁① 定谳**：CEO 面板 66% 语义=**bigmodel Coding Plan 周窗（7 天滚动）套餐额度百分比，bigmodel 计费口径**——与本地 raw token 汇总是两套计量体系（非折算关系，CFO 卷 α≈0.382 折算假设作废）；护栏三线双口径矛盾的根解=计数基准二选一：raw 本地口径（可自查复算，程序化护栏用）或 bigmodel 口径（读数权威，须走端点 relay）。
3. **候裁③ relay 实证**：三行脚本（读 key 文件→curl→提取 percentage/nextResetTime）即可出每日额度读数行——5h 窗+周窗两行+各自重置时点；M3「额度感知排程」数据源实证可用，剩 owner 指派。

**响应结构备查**：`data.limits[]` 三型——TOKENS_LIMIT×2（5h 窗=unit:3/number:5；周窗=unit:6/number:1，各带 percentage+nextResetTime ms 时戳）+TIME_LIMIT（Z.ai 内置工具次数配额：search-prime/web-reader/zread，与套餐 token 额度无关）+`level:"max"`=套餐档位。key 值面零回显（内存态使用，tail4 掩码 …Dmsf 与 STE 卷 v3/v5 同 key）。
