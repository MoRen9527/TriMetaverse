# R-HY 401 修复工序审定单（CTO 技审，10-03 凌晨窗）

- sourceOfTruth: 本件（R-HY 401 修复工序审定正身；令源=COO 01:5x 技审令，BOD 复核 PASS 附裁准）
- syncMode: final
- lastSyncedAt: 2026-10-03 02:03:53 +0800（date 现查贴原值；补勘读数时点 02:02:08 随文标注）
- 审定人: CTO 小狄（m-cto）
- 施工面: FSD（候本单开工；本单为工序审定，非施工授权——窗点归 COO 裁）
- 输入: `rhy-401-key-audit-readout-20261003.md`（FSD 三勘面实锚卷，01:52 版）+ D-04 正形 + 本席补勘两轮（02:02，channel.cmd 结构/进程面/计划任务面，只读零写）
- 边界遵守: 技审面零写面 ✓（本审定单落盘除外）；token/GLM key 值零出机 ✓（全程指纹形）；R-HY/sg 域施工动作全数候 FSD 窗 ✓

## 零、审定结论总览

| 项 | 审定态 | 一句话 |
|---|---|---|
| a 项（TriMLC 8713 token 同步+重启） | **审定通过，七步序** | 本机侧对齐门面权威值（3608..cee7），重启走 watchdog 自然拉起形态，D-04 三层完工锚主锚=face-events mlc 转 ok |
| b 项（GLM_API_KEY sg 对照勘） | **审定通过，四步工序（只读）** | sg 形态勘定有/无+配置位参照；值源授权面候 COS/CEO，补齐写操作另窗独立施工单 |
| 附勘（漂移引入时点） | **维持候勘，不阻塞修复** | 本席补勘实锚 channel.cmd mtime=10-02 20:48:21 系 COS 行尾还原窗（非值面变更窗），更早引入窗维持 FSD 候勘 |

## 一、a 项工序步序（七步）

### 步 0 前置实勘（施工时现做，三条断言）

1. **监听 pid 断言**：8713 监听 pid 必须仍=22556（FSD 勘验时点值；本席 02:02 复验同值）。pid 已变=中途有重启，须重核 L11 值面指纹（a5cb..13a7）未被动过再继续。
2. **watchdog 节奏勘**：`schtasks /query /tn "\TriMLC-Watchdog" /v` 读「下次运行时间」→定步 6 stop 后的拉起观察窗（本席 02:02 读数：任务 Ready、下次运行 2:07:00，分钟级节奏）。
3. **优雅停端点实勘**：TriMLC 代码位=`D:\Code\ai\TriMLC`（本席补勘实锚：channel.cmd L37/L38，cd 后 node dist/index.js 冷起）。停=优雅停 POST /shutdown+TRILC_INTERNAL_TOKEN 门（L15 键在册；同族协议 8711 实锚）——施工时以 TriMLC 源/dest 实勘为准，若端点形态有差以代码为准。

### 步 1 备份（回滚锚建立）

- `trimlc-daemon-channel.cmd` 全文件拷贝→同目录 `trimlc-daemon-channel.cmd.bak-20261003-<hhmm>`。
- 备份件登记清理时点：完工+24h 观察期后清（避免重演 TriModel bak 族悬空——T7 裁决 10-03 立案教训）。

### 步 2 取值（跨机管道，零出机）

- SSH R-HY 读 `/srv/fleet/trimodel-data/api-token.env` **L1** 值段（`cut -d= -f2` + `tr -d '\r\n'`）——**管道直传不落会话不 cat 不 echo**；值面全程只在管道内。
- 跨机行尾坑预置：PS→ssh stdin CRLF 粘连族（09-30 实证）——接收侧必须 `tr -d '\r'` 后再落笔，写前指纹断言兜底。

### 步 3 行级替换（保 CRLF）

- 正形：读全文件行数组→**仅替换 L11 值段**→拼回单次写（append 脚本 open-w 二犯教训同族——禁手写变形禁嵌套结构）。
- CRLF 三查：写前记基线 **CR=38**（本席 02:02 实测，38 行全 CRLF 健康形态）→写后断 CR 数**差=0 为过**→LF-only 或 CR 数漂移=立即停+追源（10-02 M2 落位件教训：LF-only set 区静默失效→EADDRINUSE 冷起崩）。

### 步 4 文件面验证（四对表）

1. L11 指纹：`len=64 head4=[3608] tail4=[cee7]`（=R-HY 门面权威值指纹，FSD 勘验卷锚值）；
2. 行数不变=38；
3. 邻行零扰动：L10/L17 指纹仍同值 `4842..4aa5`、L15 仍 `0641..5693`（TRIMC 族三 token 勿混淆禁区见 §五.8）；
4. CR 复测=38。

### 步 5 安全形态实跑探针（禁直接 call 生产启动器）

- 剥启动行临时 cmd：L1-L36 原样+尾行 PowerShell 指纹行（只输出 `len/head4/tail4`，禁 echo 全值）→实跑断言批文件 set 区可解析+TRIMODEL_API_TOKEN 值=期望指纹。
- 临时件即用即删。

### 步 6 重启 8713（watchdog 自然拉起形态）

1. 优雅停：POST /shutdown（L15 门）→**验证死**（8713 监听消失；禁裸杀禁区见 §五.3）；
2. **等 TriMLC-Watchdog 下一轮自然拉起**（观察窗=步 0 勘定节奏×2 为超时线）——与 LG-055 CMO 回位同款形态，不与 watchdog 手动竞争；
3. 超时 fallback：查 watchdog 任务状态→确认异常才手动冷起（channel.cmd）——fallback 前置门=watchdog 确认不在拉起，防双实例 EADDRINUSE 竞争；
4. 活体读数：新 pid+8713 监听恢复+healthz 绿+启动时点>stop 时点。

### 步 7 D-04 完工判据落位（三层完工锚）

| 层 | 锚 | 判据 |
|---|---|---|
| 辅锚 1 | healthz 绿 | 必要不充分（D-04 正身明示≠生效） |
| 辅锚 2 | 文件面+探针面 | 步 4/步 5 全过 |
| **主锚（完工唯一定谳）** | **R-HY `face-events.jsonl` 出现 face=mlc pull `ok`** | poller 15 分钟节奏下一轮（≤15min）；denied 序列（92 连）终止+ok 实锚=端到端值面真值，排除「文件改了进程没吃」整族假阴性 |
| 观察期 | 主锚过后续看 1 个 poller 周期持续 ok | 非偶发单条 |
| 可选加速 | TriMLC 手动 pull 触发端点（步 0 一并实勘，有则触发一次） | 不作门，仅缩短等待 |

- **探针设计注（F-3 缺陷规避）**：TriMLC addJob 系 F-3 缺陷在案（INSERT 缺 next_run_at 列=永不调度，TriMLC 特有非家族性）——「临时 job POST+DELETE」**不可用作 token 生效判据**（job 永不执行→pull 永不发生→探针恒假阴性）；如需 API 面活性验证可用之，但仅限活性且必须 DELETE 清场。本单主锚绕开 cron job 面，走 poller 内建节奏+门面侧对表。

## 二、a 项回滚锚

- **回滚点 A（步 5 前）**：探针/文件验证失败→bak 覆盖还原+CR 断言→**零重启**（进程未动，状态无扰）。
- **回滚点 B（步 7 后）**：主锚 2 个 poller 周期（30min）仍 denied（排除门面侧并发变化后）→bak 覆盖还原+CR 断言+重启（同步步 6 全形态含 watchdog 协同）→回到 401 现状（可接受：现态本就 denied）。
- 回滚后残留物：bak 件+临时件清理；face-events 侧 denied 计数继续属现态自然延续，非新增事故。

## 三、b 项工序（sg 对照勘，只读四步）

### 步 b1：sg 门面进程活体 env 键名扫描

- SSH sg：trimodel 门面进程 `/proc/<PID>/environ` 键名面（`tr '\0' '\n' | cut -d= -f1`）grep GLM_API_KEY 计数——**只出有/无+计数，零值面**。

### 步 b2：sg 配置文件面定位

- api-token.env 同族配置位+systemd unit EnvironmentFile 面 grep GLM_API_KEY——只报「有无+文件路径+行位+指纹（若有无：len+head4+tail4）」。

### 步 b3：结论三分支

1. **sg 形有**→补齐形态可行+配置位参照确立；**值不跨机复制**——R-HY 补齐值源独立走授权面（§五.7）；
2. **sg 形无**→GLM_API_KEY 缺件系双机性，值源=bigmodel key 台账/新申请（CFO/COS 面），补齐窗顺延；
3. **sg 配置位形异**（如 env 名不同/注入方式不同）→形态结论带回勘验卷附录，补齐工序照 sg 实形修订后再排窗。

### 步 b4：补齐写操作工序框架（另窗独立施工单，本单不定谳）

- 增行形态：`api-token.env` 增行（LF 行尾、`GLM_API_KEY=<值>`）→写后指纹对表→门面重启（`systemctl restart trimodel`，照 D-04：完工锚=进程活体 env 键名出现 GLM_API_KEY+代理转发链 smoke——GLM 模型请求由 401/上游缺 key 形态转为正常转发应答）。
- **窗点与值源授权均为前置件**：候 b3 结论+COS/CEO 值源裁，非 FSD/CTO 工序面可自决。

## 四、附勘：漂移引入时点（本席补勘读数，维持候勘）

- channel.cmd mtime=**2026-10-02 20:48:21** + L12 注释行实锚「2026-10-02 M2 cutover … batched with token rotation, single cold start, no second restart」+ 全文件 CR=38 健康（=10-02 M2 落位件 LF-only 事故后 COS 还原笔）——三读数并读：20:48 窗系**行尾还原窗（COS），非值面变更窗**（还原保内容修行尾）。
- FSD 勘验卷时间线：门面 token 9-27 19:58 定值；mlc denied 始于 10-01T16:49Z（北京 10-02 00:49）——早于 20:48 窗，故 a5cb..13a7 漂移值在更早窗已写入、M2/COS 窗被原样保留。**更早引入窗维持 FSD「候勘」原态**（channel.cmd 无版本管理，历史形不可得，考古价值有限）；本附勘结论=漂移引入考古**不阻塞修复**，修复窗无需等待该项。

## 五、禁区（逐条，施工面+技审面共守）

1. **方向性禁区（最高优先）**：R-HY 门面 `api-token.env` L1（3608..cee7）=**权威值，零改零轮换零触碰**——修复方向恒=本机对齐权威；禁任何形态的反向修改（把门面改成漂移值）。
2. **值面零出机**：token/GLM key 完整值禁进会话链/工具输出/文档/commit 讯息；指纹形（len+head4+tail4）为唯一允许出机面；管道侧取值禁 cat/echo 全值。
3. **禁裸杀**：8713 停起走优雅停+watchdog 协同正形；stop 前必验 8713 监听 pid==22556（或步 0 复验值）——双 daemon 主机（8711 在役 pid 45040，本席 02:02 实锚）防误杀邻 daemon。
4. **CRLF 三查**：写前测行尾、写后断 CR 数、反常形态必追源；LF-only 检出=立即停。
5. **禁直接 call 生产启动器验证**：验证一律走剥启动行临时 cmd（步 5 形态）。
6. **b 项只读**：sg 对照勘零写面；R-HY 补齐写操作（增行+门面重启）候另窗独立施工单，本单不授权。
7. **值源授权面**：GLM_API_KEY 值源（bigmodel key 归属/台账/新申请）候 COS/CEO 裁——任何施工面不得自行取值补齐。
8. **TRIMC 族三 token 勿混淆**：本单仅动 L11 TRIMODEL_API_TOKEN（R-HY 门面门）；L10 TRIMC_INTERNAL_TOKEN / L17 TRIMC_NOTIFY_SG_TOKEN（sg TriMMC 8710 门，4842..4aa5，10-02 工序 1' 已换新族）与 L15 TRILC_INTERNAL_TOKEN（本机 daemon 门）零触碰。
9. **「single cold start」约束尊重**：L12 注释载 M2 窗 BOD 硬约束「single cold start, no second restart」——本单重启系 M2 后独立修复窗的显式动作（COO 裁窗+本单审定），不属 M2 窗内二次重启，但施工毕报须显式标注重启事实与令源链，避免与 M2 约束面混淆。

## 六、风险与缓解

| 风险 | 缓解 |
|---|---|
| F-3 缺陷使 cron job 探针恒假阴性 | 主锚绕开 job 面走 poller 内建节奏+门面 face-events 对表（§一步 7 注） |
| watchdog 与手动 start 双实例竞争 | 步 6 主形态=等自然拉起；fallback 前置门=watchdog 状态确认 |
| poller 节奏实测偏差（15min 系时间线推断） | 主锚超时判据放宽 2 周期；超时先查 TriMLC 侧 poll 日志形态再判回滚 |
| channel.cmd 非唯一消费方残留疑虑 | FSD 勘验已实锚 8713→cmdline→channel.cmd 单链；本席 02:02 复验 8711（45040，09-30 起）与此文件无启动链交集（TriRLC Daemon 独立任务） |
| 跨机取值行尾粘连 | 步 2 接收侧 `tr -d '\r'`+步 4 指纹断言双兜底 |

## 七、施工毕报要件（FSD 照此报）

- 路径+行数证据（审定单要求的先写后报同款）；七步逐步读数（含步 0 三断言值）；三层完工锚读数（主锚 face-events mlc ok 行原文时间戳）；回滚锚状态（bak 件路径+清理时点登记）；禁区遵守声明（逐条或豁免说明）。

## 使用依据

- COO 01:5x 技审令（本席四环回执 01:57）；BOD 复核 PASS 附裁准；D-04 完工判据正形
- FSD 三勘面实锚卷 `rhy-401-key-audit-readout-20261003.md`（01:52，全文 69 行）——401 根因（门面 token 不同步族）/GLM 缺件定性/face-events 时间线/键链路图
- 本席补勘两轮（02:02:08，只读零写）：channel.cmd 结构面（38 行全 CRLF、L11 指纹 a5cb..13a7 复验一致、L10/L17/L15 指纹、L12/L37/L38 形态——值面零回显）；进程面（8713 pid 22556 起于 10-02 20:52:18 / 8711 pid 45040 起于 09-30 04:01:04 / watchdog 常驻进程零）；计划任务面（TriMLC-Watchdog Ready 分钟级、TriRLC Daemon 独立在册）
- 关联纪律在案：daemon 重启纪律（禁裸杀/pidfile 验对）、cmd 批 CRLF 三查（10-02 M2 件）、值面禁进打印路径（10-02 回显件）、TriMLC F-3 缺陷（TriMLC 特有非家族性）、append open-w 二犯（10-02 BOD 件）
