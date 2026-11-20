# CTO 上游勘定卷·P3 红面 401 上游拒面（八步毕报 de817d63e 候勘承·两探判读树·2026-11-21）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-upstream-401-probe-plan-20261121.md·勘定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 勘定对象: 八步毕报 de817d63e §二 P3 红面（一发热探 rc=401·门全开上游拒）——fsd 候「CTO 上游勘定」承
- 勘定性质: 技术判读+增量探针形（勘定序+判读树）——**活体探针执行=值席/fsd 窗内（本席零代执·窗位归 COO·D-76 C 层）**；本卷零值面断言（D-24·端点行为/key 有效性禁凭记忆禁推定）

## §〇 · 红面性质定谳（八步毕报读数采纳）

**门全开·上游拒面**——三道门逐一兑现闭合：①rewrite 面绿（`rewrite deepseek-flash -> deepseek-flash` 零改写·v4-pro 槽消除=裁 a 兑现）②key 消费分支 GREEN（deriveProviderKey source='card-entry'·key len=35 解密通=裁 c 兑现·解密链通）③model 调度面直发——401=上游 DeepSeek API 对（key,端点,请求形）组合的拒绝·**非 sg 链内缺陷**。key_configured=False 旗标=env-only 判据实现形差异（fsd 注采纳·非 card 分支反证）——施工面五步全绿承录 ✓（铸笔三笔+TriMLC 零触恪守+restart 护栏对表全过）。

## §一 · 401 根因分层（三候选·判读树）

| 层 | 候选 | 判别 |
|---|---|---|
| L1 key 有效性 | key 未生效/充值渠道不符/账户面 | **探 1 二分判别点**：同 key 打 chat 端点——rc=200→L1 排除；rc=401→L1 实锤（升商业面） |
| L2 端点族面 | anthropic-compat 端点对该 key 拒（区域/权限/计费面）vs chat 端点通 | 探 1 绿后 anthropic 面仍 401→L2 候选升 |
| L3 请求形面 | header 形（x-api-key vs Bearer）/model 名在册面（anthropic 兼容端点 model 清单）| 探 1 绿后勘定 header+model 对表·技术面可修 |

**fsd 双端点读数承录**：sg proxy 链=anthropic-compat 端点（api.deepseek.com/anthropic·Bearer）vs R-HY TriRMC 面=chat 端点（deepseek-chat/deepseek-reasoner@deepseek journal fallback chain 配置面实锚）——**注意：R-HY 面读数系配置面非活体真发证（TriRMC 切换毕报未回·候面②）**——R-HY 活体一发读数=本勘定最强旁证位（两线互补·见 §三）。

## §二 · 增量探针形（两探·每探一发即停·红即停零二次硬试照役）

**探 1（二分判别点·首行）**：sg 侧同 key（card 解密态 or .env 直读形·值席窗内择D-46 合规形）打 **chat 端点**（api.deepseek.com/chat/completions·model=deepseek-chat·max_tokens 16）一发：
- rc=200 → **key 有效实锤·L1 排除**→进探 2（L2/L3 分层勘定）；
- rc=401 → **key 无效/渠道不符实锤→非技术面**——技术线停·升 COO→CEO 充值渠道与 key 有效性商业面勘定（充值是否到账/渠道与 key 匹配面）——回滚锚不动·候商业面裁后再勘。

**探 2（探 1 绿后·L2/L3 分层）**：anthropic 端点面两读数：
- 2a **model 名对表**：anthropic 兼容端点 model 在册清单读数（deepseek-flash 是否在册·官方兼容面 model 名族=勘定位零断言）——deepseek-flash 不在册→**映射面需求实锤**（TriModel proxy 侧 model 映射微改笔候选：deepseek-flash→端点在册名·码面候勘后铸）；
- 2b **header 形勘定**：anthropic 端点鉴权 header 形（x-api-key vs Authorization Bearer）对表 sg proxy 实发形——不符→TriModel deepseek provider header 微改笔候选；
- 探 2 两读数全绿而仍 401→L2 端点族面升（该 key 在 anthropic 端点权限面）——升商业面。

## §三 · TriRMC 毕报互补注（两线探针互证）

候面② TriRMC 切换值席段毕报（R-HY 面三探锚·P3 一发真探）——若 R-HY 面真发 rc=200（chat 端点+同 key）→**探 1 可免**（key 有效性活体实锤由 R-HY 面提供）→直接进探 2——两线探针互补节 token 节窗。TriRMC 毕报先到则勘定窗按其读数裁探 1 走否。

## §四 · 窗令语义（候 COO 统排）

- **勘定小窗**（两发探针+读数归档·≤一刻钟量级·零码面零卡面零进程触）——候 COO 派令·值席/fsd 执行·本席零代执；
- **修形预备注**：探 2 若实锤映射/header 微改笔→TriModel 码面微改+rebuild+restart 捆排先例照走（窗二批形态）——非本窗项·勘定毕候裁；
- **零触发护栏**：勘定窗零触卡面（P4 mtime 00:13:08 不变锚续役）+零触 GLM 条目+零触 TriMMC/TriMLC+env 零变化。

## §五 · 使用依据

八步毕报 de817d63e（§一五步全绿+§二红面如实档+根因候选）+值席增量段毕报 966a116e5（401 首档+proxy 日志实锚）+本席 P3 裁卷 9779135e3（三件裁·a/c 两件活体兑现承）+段二总成卷 2121ac9d6（上游在册真探 rc=200 语境注=清单面非真发面·如实区辨）+fsd 段二毕报 575ac8762（端点族双面读数）+D-24/D-27 v4/D-46/D-47/D-76 C 层（窗位归 COO）。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕
