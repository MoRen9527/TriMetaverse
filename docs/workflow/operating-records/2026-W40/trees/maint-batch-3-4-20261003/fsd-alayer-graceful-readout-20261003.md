# FSD·A 层 graceful 施工卷（BOD #304，COO 14:2x 开工令）

- sourceOfTruth: 本件（A 层 graceful 施工卷；令源=COO 14:2x 即插开工令，审定单=cbd0abab cto-graceful-auth-posture-review-20261003.md）
- syncMode: static（施工毕四态全绿；毕报→STE 验→BOD 复核链）
- lastSyncedAt: 2026-10-03T14:38+08:00（date 现查 06:36:45Z 后）
- 施工席: FSD 小全（m-fsd，本机 dev 机车道）

## 一、施工读数全链

### 1. 值源锁定（gate 四验）

- 施工单「用户级现值」勘定=**HKCU\Environment 注册表面**（审定单 L21 考古锚：LG-002 时代 4f94..e217 用户级令，9-30 env file 迁移窗切源后留存）。
- 首验假阴性如实记：`[Environment]::GetEnvironmentVariable('...','User')` 报 ABSENT 系**坏参数假阴性**（-SingleQuote 非 powershell.exe 合法 switch，错误被 2>/dev/null 吞）——重验（Get-ItemProperty 直读注册表）=len=64 hex64 ✓。
- gate 四验全过：len=64 / hex64 正则 / head4=4f94 / tail4=..e217——**对表不过即停条款备而未用**（一把过）。

### 2. 写盘（append 安全形单次原子写）

- trirlc-daemon.env 九键→十键：单进程读注册表值→gate→查重（KEY_EXISTS_ABORT 防线）→保 CRLF→WriteAllText ASCII 单次写。
- 写后断言：lines=10 / CRcount=10（全 CRLF 保形）/ size=677B / 尾键=TRILC_INTERNAL_TOKEN ✓。
- 值面零出机：全程管道提取+指纹断言，token 全值未入会话链未入卷。

### 3. 停起链（权威路径）

- 停前三断言：pidfile 42524==监听 pid 42524 match=True ✓。
- stop=`node dist/cli.js stop --port 8711`：graceful accepted 措辞+pid 42524 still alive→SIGTERM fallback（旧进程无令=401 gate 时代设计内形，③车道同）→监听清+pid 死 ✓。
- start=trirlc-daemon.ps1 生产同形链（三 pin：TRILC_DATA_DIR/TRIMC_BASE_URL=8.155.54.79:8710/TRILC_ENV_FILE+PATH pin+node guard+env file gate→cli.js start daemonize）。

### 4. 新进程与探针（14:32）

- 新 pid=**52752**，pidfile==52752 ✓，daemon.log `[trilc] ready — pid=52752` ✓。

| 探针 | 读数 | 判 |
| --- | --- | --- |
| 辅锚1 healthz | HTTP 200 | ✓ |
| 门验·无令 /internal/v1/config/show | HTTP 401 | ✓（gate 启用） |
| 门验·错令 | HTTP 401 | ✓ |
| **主锚·对令（注册表管道取值 X-Internal-Token）** | **HTTP 200** | ✓（审定单 §41 主锚过） |

- D-04 完工锚三层全绿（辅锚1/辅锚2 文件面+三态/主锚带令 200）。

## 二、勘正与如实记录

### 勘正①：ps1 启动 90s 超时但 daemon 幸存（执行形注记）

- Bash 调 ps1 卡 90s 超时（143）——cli.js start 的 daemonize=**detached 子进程**形，ps1 链被杀不影响已 detach 的 daemon（52752 活体实证）。非缺陷；后续窗直接调 cli start/ps1 建议后台包裹+timeout 保护。

### 勘正②：「face-events mlc pull 转 ok」本机勘定=与 8711 无直链

- g10 卷 L49 先例：face-events.jsonl 系令文称谓，实落证据面=config-cache.json/attribution 字段。
- 本机 8713（channel.cmd 链，pid 51600）勘定：TRIMC_BASE_URL=127.0.0.1:18710（TriMMC 隧道面）；keys 源=TRILC_TRIMODEL_API_URL（R-HY 8711 桥）——**8713 与本机 8711 零直链**，「mlc pull」主锚语汇系 R-HY 窗（修 R-HY 8713→R-HY 8711 链）借用；本机 A 层主锚=审定单 §41 curl 200（已过）。
- 8713 侧正面读数：channel.log（%LOCALAPPDATA%\trilc-channel\）card absent 刷止 L48277（BOD ④同款复现）；pull_denied 401 族尾迹 L46283（.env 缺失期，源头=R-HY 桥 401 族=候明晚窗 R-HY 修复窗，与本窗无关）。

### 自查案：值头泄入会话链（**已定性毕**：BOD 裁 14:4x 转达 COO）

- channel.cmd 键名勘时 awk 第二规则（substr(toupper($0),5,40)）将 4 行 set 行前 40 字符带出=**四键值头 15-21 字符泄入会话链**（TRIMC_INTERNAL_TOKEN/TRIMODEL_API_TOKEN/TRILC_INTERNAL_TOKEN/TRIMC_NOTIFY_SG_TOKEN，均 64 位 hex 的头部片段）。附带观察点：L10 与 L17 值头相同=TRIMC_INTERNAL_TOKEN≡TRIMC_NOTIFY_SG_TOKEN 疑同值。
- **定性（BOD 14:4x，COO 转达）**：操作瑕疵，非安全事故——援引 10-02 先例同形（同盘同 ACL 权限面增量≈零+值头系短截非全值+三未实锚不触发 token 轮换，不提前轮换不变）。入册面=值面回显族第二笔，候 CAO 册与首笔合并同条修订。

### 观察点（**已销案**：CTO 勘定 b4bf42b8，COO 14:4x 转达——系本席误报）

- ~~channel.cmd L5 TRILC_DATA_DIR=TRILC-CHAN vs 现役 trilc-channel 疑切空面~~——CTO 实勘四版 L5 全部=trilc-channel 同值（目录 mtime 今日 11:29 活跃写入实锤），TRILC-CHAN 形四版演化史零出现，**误报销案**。
- **误报根因自勘**：本席读数源 awk `substr(toupper($0),5,40)` 40 字符截断恰丢行尾「NEL」——`set TRILC_DATA_DIR=%LOCALAPPDATA%\trilc-channel`（47 字符行）显示成假名「TRILC-CHAN」=**截断伪影造假读数**（与 10-02 值头泄漏案同根反向：彼案截断泄值、此案截断造缺失）。呈报流程本身合规（禁区零触+候裁不擅动）；教训=set 行值面显示须锚行尾对表（length 全行 vs 显示段差=伪影信号），截断边界读数禁当完整值引。

## 三、回滚锚

- trirlc-daemon.env 删第 10 行（TRILC_INTERNAL_TOKEN）+stop/ps1 链重启=回原全拒态。单行回滚，零级联。

## 四、消费链预期（零改码即刻复活，自然态）

- TriPilot trilc-auth（extension.ts L741 全局注入）/CLI 双 helper（cronRequest/configRequest）令源=process.env.TRILC_INTERNAL_TOKEN 继承用户级值（4f94..e217）——daemon 配同值后即刻过门（审定单 §28/29 判定）；TriPilot 宿主面=VS Code 自然态不主动扰。

## 五、疲劳自评（COO 令：A 层毕报带）

- **中水位**：03:3x 连夜窗+批A 全链（P2/build/P3 双异常高压段）+A 层，连续施工 11h+。精度现态尚可（本窗零返工），疲劳有累积。19:00 批B 线前有休整窗=可执行；若提前至 17:30 前需再评；跌破中位即报顺延。

## 六、使用依据

- COO 14:2x 开工令+#304 批立施工单+审定单 cbd0abab（cto-graceful-auth-posture-review-20261003.md：L21 考古锚/L22 消费方令在位/L39 值源建议/L41 D-04 三层锚/L43 禁区）
- COO 14:3x 增令（8713 禁区解除/值源闸①并勘/批B 19:00 线）
- 实勘：trirlc-daemon.env（九键 CRLF）/HKCU\Environment/cli.ts stop·start 族/trirlc-daemon.ps1 三 pin/channel.cmd 键名面/TRILC-CHAN vs trilc-channel/channel.log L46283·L48277/g10 卷 L49 face-events 先例
- 关联纪律：值面零出机（指纹形）；禁裸杀（stop 权威路径+三断言）；append 单次原子写（open-w 二犯教训）；CRLF 保形；执行令时点交叉核对（14:26 hook 现戳 vs 令文 14:2x ✓）
