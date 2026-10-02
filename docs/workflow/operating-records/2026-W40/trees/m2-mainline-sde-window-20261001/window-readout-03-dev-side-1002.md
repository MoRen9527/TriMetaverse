# M2 主链 SDE 车道·窗读数③（10-02 18-24 并窗·dev 机侧段）

- 执行: m-sde（dev 机）；窗令=COO 10-02 17:58 发（送达 18:18，延迟 20 分钟无矛盾）；车道B主链+⓷改指激活验证主验位
- 时点: 全部读数 2026-10-02 18:19-19:11+08 现采（date 现查锚，原值粘贴）

## 一、接令段

- 车道B三项接领：①item2 候供信号维持勿自取值 ②item4 观察周低频维持采样 ③伴窗两项（chromium runbook 就绪态/CORE_VERSION 候 FSD 动笔 checklist 四项+双签）
- 值面落位段四环确认补录：channel.cmd L12 rem/L13 TRILC_TRIMODEL_API_URL/L14 NODE_EXTRA_CA_CERTS/L15 TRILC 新值（0641 面）与 COO 今晨物证勘验逐项吻合——销项 ✓
- α 两笔候确认销项：ac461cbb（18:11:57）+874f2d88（18:12:44）TriMMC Orchestrator 落 item5-definition-anchor.md（+4/-2，@m-duty-sde）——SDE 三确认：α 裁据与 batch-05 卷一致零冲突/禁二次重启语义勘定（同一单元禁反复）两域零重叠/trimmc 三件同批与本机 channel.cmd 落位形同构交叉印证

## 二、item4 观察周·低频维持采样①（18:19:29Z 现采）✅

- R-HY 8710 healthz 200 全绿（ok:true/service:trirmc/cron enabled:false jobCount:0 degraded:false consecutiveFailures:0）
- 区间法：t0=10:19:29.015Z／Date 头=10:19:30 GMT／t1=10:19:29.219Z → **钟漂∈[+0.78s, +0.99s]**
- 与前三采样（值席 ≈1s／10-01 本机 −0.27~+1.4s／≈0s）同族=稳定同步级维持；旧疑快 6m22s 持续不复现

## 三、⓷ M2 键链端到端主验=支②坐实（401 定谳）⏸

### 三态探针（19:03-19:04Z）

| 面 | 读数 |
| --- | --- |
| 本机 8713 healthz | 200 全绿·冷起新形态（uptime 474s≈18:55 冷起；trimc:"connected"+mc_peer:"trimmc"；cron 6 jobs degraded:false；daemon.mode=schtasks）——端口 8713 生效=COS CRLF 还原后冷起成功佐证 |
| sg 8712 经隧道 18710 | 200（ok:true/service:trimc/cron 9 jobs degraded:false） |
| R-HY 443 | 网络层+TLS 层通（openssl TLSv1.3 CONNECTION ESTABLISHED，leaf CN=trimodel-r-hy 正常出示）；8710 对照 200 |

### 键链行为级读数（8713 日志实勘）

- 69 行全 `[trilc:keys] refresh failed (attribution: pull_denied): TriModel card pull denied (401)`
- **行号定谳：最后 401=L44205 < 冷起横幅=L44211（cron engine started）=冷起前末态**；冷起后 9 分钟零新拉取记录
- 源码实锚：刷新周期默认 15min+stagger（TriMLC src/config/key-cache.ts L212 `KEY_REFRESH_INTERVAL_S_DEFAULT=15*60`）——冷起后无记录=首刷未到（正常）非成功静默
- **首刷监视命中（19:11:07 现戳）：401 复现**——`refresh failed (attribution: pull_denied) 401` + 新形态 `status report failed → 401 (non-blocking)`
- **⓷终态=支②坐实**：键值未在位（行为级），候键值窗顺延申报照准；今夜收口记⓵⓶⓹绿+⓷开项条件形态

### 401 件归因材料（候 10-03 明晚窗排程）

1. 链路分层实锚：网络通（8710 对照 200）→TLS 通（openssl established）→HTTP 层到达（401 为 gate 应答）——**信任面 NODE_EXTRA_CA_CERTS 工作正常实锤**；断层唯一收敛在 gate Bearer 校验面
2. 拒面横跨读（card pull）/写（status report）两面→收敛于 R-HY gate 侧 token 配置/对表面，非单端点问题
3. non-blocking 降级设计在役实证（拉取失败不阻塞本地运行，cached config 承载——M2 安全语义 ✓）
4. **归因分层**：TRIMODEL_API_TOKEN 门对表面（401 直因）≠GLM_API_KEY 模型服务上游键——两键不同面，明晚排程分两独立项不混排（COO 采纳入档）

### 探针工具局限注（防误读）

curl(schannel) 对 R-HY 443 报 000=**工具侧 IP-SAN 主机名匹配限制**（schannel 对 IP SAN 走 DNS 条目比对，选 localhost 条目失败），非 R-HY 面故障；daemon 侧 Node/OpenSSL 走标准 IP-SAN 匹配（401 到达 HTTP 层即证）。COO 收讫归档。

## 四、车道B候态（窗内零写面维持）

- item2：候供信号（随 FSD 工序1'+BOD root 链，供值经 COO/COS 转接，机内 PUT 零重启）——勿自取值维持
- chromium R-HY：runbook 就绪态（候 BOD root 链窗口触发）
- CORE_VERSION：候 FSD 动笔信号（checklist 四项+双签）
- 禁二次重启维持：冷起归 FSD 工序③（18:55 已冷起 ✓），本机 8713 本窗零触碰零重启

## 五、使用依据

- 窗令：COO 10-02 17:58（车道B三项+⓷主验+四环催线）；α 采信通报+⓷支②收口形态锁定（19:12）
- 前窗卷：window-readout-02-dev-side.md（f9c4c531，改指落点重勘四件+item4 采样 2/3）+window-readout-01（946afdfc 值席）
- 源码实锚：TriMLC src/config/key-cache.ts L212（15min 周期）/L325-380（pull 形态+attribution 码）/L535-536（pull_denied→reportCardStatus）
- 活体探针：8713/18710 隧道/8710/443 四面（全只读 GET）；日志 channel.log 44231 行行号定谳
- 纪律：D-04 时刻现查/掩码纪律（token len+sha8 only，值零出机）/零写面（本窗全段只读探针+日志读）/机位前缀（河源 8710 唯一对外、sg 8712 隧道形、本机 8713）
