# FSD 勘误卷·窗二批第一拍判读勘正——timer 实为在役·b 前提消失·对象错位根因+架构面新矛盾升报（2026-11-21）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-21T00:34:26Z（date 现查粘贴·+8=08:34:26·D-47 正形）
- 令面: COO 第二拍立即起令（00:32:59Z）+全量四件定谳令（00:33:36Z）+勘正令（00:33:58Z）——**本卷=第一拍毕报（ccf224226）件①判读勘误·最高优先防误传导**
- **next_agent=COO+CTO 双面**（b 形处置请裁+架构面矛盾请裁）

## 一·勘误对象与根因（对象错位族·三层）

**第一拍判读原文**：「timer 未装填态（三证）·「15min 自愈」不成立」。**勘正=错误**。根因=**取证对象三层错位**（D-24 活体现探在「不知道真对象是谁」时不设防）：

| 层 | 第一拍取值（错） | 真对象（现勘） | 依据 |
|---|---|---|---|
| 日志/数据目录 | `$LOCALAPPDATA\trilc\daemon\daemon.log` | **`C:\Users\jedih\AppData\Local\trilc-channel\`**（channel.log+config-cache.json） | daemon-channel.cmd L5 `TRILC_DATA_DIR=…\trilc-channel`+L46 日志重定向 |
| pull 端点 | `127.0.0.1:3333`（env.ts 缺省值） | **`https://8.155.54.79`**（河源 Caddy 443·M2 cutover） | 同 cmd L14 `TRILC_TRIMODEL_API_URL`+L15 NODE_EXTRA_CA_CERTS |
| token 变量名 | `TRIMC_INTERNAL_TOKEN` | **`TRILC_INTERNAL_TOKEN`**（8713 服务端校验 `process.env.TRILC_INTERNAL_TOKEN`） | app.ts L1950 源码实证 |

源码门控判读 `if (_keyCache) startRefreshTimer` 本身正确，但 cache 实际在位（trilc-channel/config-cache.json）→ 门控通过 → timer 装填。第一拍「cache 零文件」结论来自错目录。

## 二·timer 活体定谳（勘正后·四证）

1. **装填行**：channel.log `[trilc:keys] refresh timer: every 900s (first in {15,39,19}s stagger)` ×3（历次 boot 装填实证）；
2. **周期刷新行**：`model relay refresh (card absent): default=deepseek-v4-pro` 连续多行（15min 周期在跑）；
3. **cache 现状**：config-cache.json 在位·show 面 `hasCache:true/fresh:true/effectiveSource:tier2-cache-fresh/refreshIntervalS:900`·fetchedAt=2026-11-21T00:30:23Z（现查 00:34:05Z=4min 前·周期活体）；
4. **供给链健康**：config verify `connectivity:ok/credentials:ok`（河源 TriModel 443 可达+凭据有效）。

**定谳：timer 在役·周期热载链现役正常·「TriModel 在役化后需手动激活」前提消失**。

## 三·b 形处置请裁（误传导止损）

CTO 裁卷 815b7fa63 b 主形「refreshNow 成功后补装填」——**基于第一拍误判**（timer 零装填）。勘正后：装填门在役，b 修形**无缺陷可修**（refreshNow 不装填的行为在「cache 已在位→boot 已装填」现实下不构成缺口；仅在「boot 时 cache 空且之后手动 pull 成功」边缘态才显现，该态现役不存在）。**建议：b 撤销或降级挂账**·三笔捆批→两笔（registry 铸笔+兜底勘正）。**零自判·候 CTO/COO 裁**。

## 四·架构面新矛盾升报（P2 探针可达性）

- **现势**：8713 daemon pull 端点=**河源 TriModel**（https://8.155.54.79）；本机 TriModel 若在役化=3333 独立域——**daemon 不消费本机 card**；
- **后果**：本机 trimlc-card.json 新建后，P2 探针「daemon env 注入值=deepseek-flash」**不可达**（daemon 拿的是河源投影 `deepseek-v4-pro`）——除非 (a) daemon 端点切本机（env 面变更·需重启·与 CTO 裁⑤「env 面切换否」直接冲突）或 (b) 河源 TriModel 侧建 card（跨机 R-HY 面·非本席域）；
- **请裁**：本机在役化+card 的**消费路径语义**（纯本机域自用/候 daemon 重启窗切端点/或河源侧建卡）——P2 探针按裁定形态对表。

## 五·件①token 配置位定谳（已毕·双门覆盖）

1. **配置位**=`C:\Users\jedih\AppData\Local\trimlc-daemon-channel.cmd`（schtasks `\TriMLC Daemon` 拉起·父链 svchost=Schedule 实证·值面零回显零落卷）；
2. **双 token 分野**：L16 `TRILC_INTERNAL_TOKEN`=8713 服务端 internal 门（本次破面对象）·L11/L18 `TRIMC_INTERNAL_TOKEN`=**出站** TriMMC 18710 用（不同用途·同名近似消歧）；
3. **shutdown 门实证**：`POST /shutdown` **零 token 校验**（app.ts L4798-4806 直处理零鉴权）——记忆族「优雅停=POST /shutdown+token 门」**本版不适用**（版本差·dist 8361196 面）；实际保护=loopback 绑定。**shutdown 前置勘定=已毕零缺口**；
4. **取用路径**：`grep '^set TRILC_INTERNAL_TOKEN=' <cmd> | cut -d= -f2-` 变量直传零回显（本席探针已通·config show/verify 双绿）。

## 六·使用依据

COO 两拍制令链三封（00:32:59/00:33:36/00:33:58Z）+trimlc-daemon-channel.cmd 全文现读（L5/L11/L14/L16/L18/L46）+app.ts L1948-1960 internal 门/L4795-4806 shutdown 面+channel.log 装填行+周期行现查+config-cache.json 在位现查+config show/verify 活体双探+第一拍卷 ccf224226（勘误对象）。

---
落卷=FSD 小全（m-fsd）·第一拍判读勘误（08:34+8）·**next_agent=COO+CTO**（b 形处置+架构面消费路径双请裁）·timer 在役四证定谳·b 前提消失·对象错位三层根因如实·token 双门已毕·施工①在役化不受阻塞即行

