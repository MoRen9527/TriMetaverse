# CTO 裁点卷增补·b「零重启」措辞勘正+shutdown 门共同前置+执行顺序链（CEO 令即刻起第二拍·COO 转达请托回达·2026-11-21）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-timer-refill-ruling-addendum-20261121.md·增补正身·主卷 815b7fa63）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 08:3x 裁定（经 BOD 转达·条件具备立即起第二拍·不等 10:00 锚）+COO 转达（00:33:12Z）请托「码面三笔捆批窗口技术面前置要求即刻一句达面」

## §一 · b 主形「零重启」措辞勘正（实质技术点·防执行误读）

- b=不依赖重启**触发装填**（修复语义·装填与 boot cache 状态解耦），**≠ 部署零重启**——b 码面修形（key-cache.ts）部署到 8713 daemon 生效**必含一次 daemon 重启**（Node 进程加载启动时代码·无法热更）；
- **故全量分支最终态也含一次 daemon 重启**——与 a 备形同一扇 shutdown 门；a/b 分野在「装填触发机制」不在「重启有无」。

## §二 · shutdown 通道 token 门勘定=a/b 共同前置（不随读数分岔）

- 面位分野：TriModel 在役化=3333 独立 server **新启动**（零重启面·不触 shutdown 通道·可即行）；shutdown 通道是 TriMLC daemon 8713 的面；
- 建议并入 COO 释放件①（0ac89be9·8713 internal token 配置位勘定）扩一句：同窗实证 shutdown token 门与 internal token 是否同源/同门——一次勘定覆盖两门零额外窗。

## §三 · 执行顺序链（前置依赖）

①TriModel 在役化+card 灌 key（零重启面·即行）→②件①勘定毕（含 shutdown 门实证）→③手动 pull 激活+三笔捆批施工（registry 铸笔+兜底勘正+timer 补装填 b 形）→④daemon 重启（shutdown 门勘毕后·窗位 COO·重启纪律族照役=shutdown→验 port FREE→起·完工判据=uptime 重置+pid/CIM 对表+**L557「refresh timer: every Ns」装填行值面探针现形**——healthz 绿≠装填生效）→⑤周期热载自愈验收（timer 在役则 15min 刷新行可观测）。

判据面本席无异议（<95%→全量/b 主形·≥95%→最小面+a 备）——与主卷 815b7fa63 §二同构。

## §四 · 使用依据

CEO 令知会（00:33:12Z·COO 转达）+本席裁点主卷 815b7fa63+fsd 毕报卷 ccf224226+TriMLC key-cache.ts L545-568/L808-811 直勘承+TriModel server.ts L19-20（3333 独立面）+DAEMON 重启纪律族+restart-window-completion-criteria+D-15/D-24/D-46/D-47/D-76 C 层。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕
