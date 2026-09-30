# sg 切前实照证据清单（N6-scope1-evidence-photo-gate / BOD 03:37 哨窗令）

- captured_at_utc: 2026-09-28T19:56:36Z （+0800 = 2026-09-29 03:56:36 周二）
- 取证对象: sg M-SG-47.245.122.61 /srv/fleet/TriModel（trimodel-config.service, 127.0.0.1:3333, 经 SSH 隧道 localhost:13333 只读取证）
- sg TriModel 构建版本: git 8de8fe7（P1 范围6① 头，03:40 重构建）
- 性质: 活体只读取证，禁 mock 顶替（N6 硬门）；切换=SDE sg TriMMC 接入切换窗（候本实照毕排定）

## 件列表

| 件 | 内容 | 断言面 |
| --- | --- | --- |
| ui-live.html | 切前活体 UI 原始 HTML（09-16 代『策略面』页，/ui 路由） | UI 断链态：face 台账四卡 UI 未上线（P2 施工中），页内 sg 栏=降级通道活体 |
| ui-live-screenshot.png | 切前活体 UI 视觉实照 | 同上（非作者 A2 基料） |
| effective-reading.json | 降级通道活体读数（GET /v1/config/policy：GLM-5.3/deepseek-flash 三窗策略调度真值） | 降级态（CPO 收稿回执①勘名：原清单误写 sg-status-reading.json，实盘件名=effective-reading.json，本行已勘正） |
| cards-endpoint-absent-reading.json | GET /v1/config/cards/mmc?view=pull → 404 活体读数（进程旧代无 cards 路由） | 断链三角第三证+切换窗硬前置实证（CPO 收稿回执①勘漏：原清单漏列，本行已补） |
| ledger-absence.txt | face-ledger.json / face-events.jsonl 缺席证明（ls+find 原样输出） | 台账断链态：mmc face 零拉取记录（文件从未生成） |
| trimmc-env-nowiring.txt | sg TriMMC daemon 进程 env（脱敏） | 消费端零 TRIMODEL 接线=断链 |
| trimmc-card-atrest.json | trimmc-card.json at-rest 快照（密文，8de8fe7 现役卡，Sep 28 22:55） | 卡在位（策略卡过渡位）；明文零暴露 |

## 断链定性（如实）

- 台账面：face-ledger.json 与 face-events.jsonl 均不存在=mmc face 自服务启动零 pull 流量（8de8fe7 台账写路径仅由 pull 触发）——真断链态原样留档。
- 消费端面：sg TriMMC（pid 1406906, /srv/fleet/TriMC, :8710）进程环境无 TRIMODEL_* 变量=接入切换未发生。
- 本目录由 FSD 小全取证落盘，转 CPO 作 P2-A2 诚实三态验收基料（切换后对照态候切换窗前后席位入场实照）。
- 补注：sg 8710 daemon 单元名=trimc.service（active，旧名兼容面）；pid 1406906 为活体证据锚。

## 重大现势注记（切换窗硬前置，实照毕即报 COO/SDE）

- **sg TriModel 服务进程=2026-09-16 02:51:55 启动（ps lstart 实读），内存运行=09-16 旧代 dist**；
- 盘面 ui/index.html md5 bbd33abe…=HEAD 8de8fe7（76189B，『TriModel 模型配置』代）——但服务实发 HTML=12857B『TriModel 策略面 · default-model 调度』代（09-16 启动时代盘面），进程启动后未重启；
- **活体进程无 P0 泛化卡面路由**：GET /v1/config/cards/mmc?view=pull → 404（cards-endpoint-absent-reading.json 原样读数）——sg TriMMC 若在进程重启前切拉取=404 断链；
- **切换窗硬前置=trimodel-config.service 重启**（加载 8de8fe7 dist：cards API+台账写路径+新 UI）；03:40 盘面已重构建（package.json mtime），重启即生效；
- 切后对照态（A2 后半）候切换窗：重启+接入后 UI=四卡面代+台账文件生成，与本次切前件成对照。

## 敏感面自查（走查纪律）

- 截图视觉核：令牌/密钥输入框=纯 placeholder（零实值渲染），keys 写面=401 诚实态；policy 窗表=非敏感调度读数。快照可归档。
