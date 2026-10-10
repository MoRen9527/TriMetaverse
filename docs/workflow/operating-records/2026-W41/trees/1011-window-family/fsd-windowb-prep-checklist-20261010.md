# FSD 栏 B 窗前预备施工单 · 8713 并批三件一次重启（就位确认供料·候 CTO 门禁）

- sourceOfTruth: 本件（trees/1011-window-family/fsd-windowb-prep-checklist-20261010.md）
- syncMode: static（预备卷·落盘即锚）
- lastSyncedAt: 2026-10-10T15:08:32+08（date 现查原值·周六）
- 执行位: FSD 小全（m-fsd）
- 令源链: COO 10-11 周日窗族令 @87871894（BOD 认账 14:57 生效）栏 B——施工=FSD·门禁=CTO·窗=10-11（周日）22:30-01:00·硬 deadline≈10-16
- 窗令要求: 窗前回点 COO 施工面就位确认（含白名单追加行清单过 CTO 门禁）——本卷即供料件

## 一、预备实勘六锚（全部活体/正身面，非推定）

| # | 勘点 | 读数 | 锚 |
|---|---|---|---|
| 1 | 白名单代码正形 | `TRILC_CRON_COMMAND_ALLOWLIST`（TriMLC 沿用 TRILC 前缀）·逗号分隔**精确等值**（trim 后比对，无前缀无通配）·仅 HTTP POST 门·不携带 command 的 job 不受影响 | TriMLC `src/server/app.ts` L239-251（CTO 实勘点位同源） |
| 2 | allowlist 运行值真源位 | `%LOCALAPPDATA%\trimlc-daemon-channel.cmd` 内 `set TRILC_CRON_COMMAND_ALLOWLIST=...`（fade lib cron-allowlist.mjs 头注明注·该 lib 只解析不写）·现役 **12 条精确串** | channel.cmd 实读（4227B·10-09 09:48 mtime） |
| 3 | 现役 jobs 全清单 | jobCount=10（store 直读 `%LOCALAPPDATA%\trilc-channel\cron.db.json`）·10 条 command 对 allowlist 12 串**零孤儿** | store 直读 07:00Z 读数 |
| 4 | 避触件在册确认 | 21:00 绩效 job `cron_mv0bq1v2_zgw8`（expr `0 0 21 * * 0`·nextRun 10-11 21:00+08）✓ / 12:00 联审 job `cron_muqyqy4g_ippm`（周六件·nextRun 10-17）✓——两件零触碰 | store 直读 |
| 5 | 行尾形态 | channel.cmd = **CRLF**（file 实勘 + od \r 计数 145）——施工追加/修改必保 CRLF（LF-only set 区静默失效族·10-02 M2 落位件在案） | file/od 实勘 |
| 6 | 重启链正身 | schtasks `TriMLC-Watchdog` → wscript `trimlc-watchdog-launch.vbs` → powershell `trimlc-watchdog.ps1`（5min 三探针·logon guard fail-closed·3 连败 stand down）→ revive 走 channel.cmd 权威启动器。token 行同文件在册（值面零回显·watchdog L23 进程内读取惯例） | watchdog ps1 全文实读 |

## 二、三 job 施工设计（command 行拟稿·标候定项）

### job① DEM-004 读数行（一期·挂 09:30 daily）

- command（拟）: `node D:/Code/ai/TriMetaverse/scripts/ops-local/glm-quota-obs.mjs`
- schedule（拟）: cron `0 30 9 * * *`（6 字段带秒形·与周平面迁移件同族）→ 09:30+08 daily
- 脚本落点: `scripts/ops-local/glm-quota-obs.mjs`（本机运维件惯例位·观测件非 fade 系）
- schema v1 消费面（CPO 定稿 @5ceb13e9 全文已勘）: jsonl 每行一对象·四组字段全表照抄；**五要素全必填**（plane/service_domain/account/model/metric_basis）·`metric_basis` 一期恒 `provider`·account 禁明文 key（尾指纹 8 位）·ts 机写禁手填·pair_ref 非重置日=null
- 阈值注入形（CPO 施工注记①）: thresholds_snapshot 落**结构**，数值由配置文件注入禁硬编码——拟 `scripts/ops-local/glm-quota-obs.thresholds.json`（CFO 正身到位前结构在位数值候注入，阈值调整不改代码）
- jsonl 落点（CPO 施工注记②）: 8713 运行数据目录 `%LOCALAPPDATA%\trilc-channel\`（CFO input①·两腿分离不入 git）
- **候 CTO 定稿项**: bigmodel usage API 端点形（source 字段+取数路径）

### job② 8713 预派 job（第五面 shadow 配套·过渡形不投资过度）

- **command/schedule 候 CTO 定稿**（窗令未附 command 形——本席槽位设计已就绪：node 脚本形+allowlist 追加同流程，CTO 给串即插）
- 槽位预置: allowlist 追加流程与 job①/③ 同批（一次重启覆盖条款内零额外成本）

### job③ 活性探针 tri-liveness 并批（CTO 认领件）

- command（拟）: `powershell -NoProfile -ExecutionPolicy Bypass -File C:/Users/jedih/AppData/Local/tri-liveness-l1.ps1`
- schedule（拟）: every 300000（5min·对齐现 schtasks l1 节拍）——与在册 `tri-watchdog-n2.ps1`（every 600s powershell 形·allowlist 串 #10）同族形
- **双跑防（候 CTO 门禁确认退役步骤）**: 并批生效后现役 l1 schtasks 任务须同窗停/删（防同脚本双跑日志互踩+failcount 竞态）——退役动作窗内执行
- 部署拷贝现役=本席 pending 修复批后形（36679c4b/34ee74c1·语法门绿·生产轮复证绿）

## 三、白名单追加行清单（候 CTO 门禁审）

| # | 追加串（精确等值·逐字节） | 对应 job | 状态 |
|---|---|---|---|
| A | `node D:/Code/ai/TriMetaverse/scripts/ops-local/glm-quota-obs.mjs` | job① | 拟稿候审 |
| B | （job② command·候 CTO 定稿） | job② | 候定 |
| C | `powershell -NoProfile -ExecutionPolicy Bypass -File C:/Users/jedih/AppData/Local/tri-liveness-l1.ps1` | job③ | 拟稿候审 |

- 现役 12 串 + 追加 ≤3 串 = 15 串上限（channel.cmd 单行逗号分隔）
- 施工法（照纪律册）: 改前备份 channel.cmd（`.bak-pre-windowb-20261011`+md5 双录）→ 追加保 CRLF → 写后 od 断 CR 数差=追加行数 → 重启 → POST 三 job（allowlist 命中放行）

## 四、时序红线（窗内避触对表·三拍绕行）

**重启收敛窗 = 22:46-22:58**（理由三拍）:

| 拍 | 时点 | 绕行理由 |
|---|---|---|
| bod-tick | 22:37 / 23:07（`7,37 * * * *`） | 重启段避开两拍前 2min |
| hub-silent-detect | 22:45 / 23:00（`*/15`） | 22:45 拍后启动重启=零丢拍 |
| 周平面迁移 | **23:10**（`0 10 23 * * 0`·周日） | **硬红线：重启+POST+验证段必须 <23:05 全毕**——迁移 job 在 daemon down 窗错过=丢拍事故；23:10 正常触发作毕报旁证 |

- 22:30-22:45 段: 备份+channel.cmd 修改（文件面零风险·不重启）+POST 前置自检
- 22:46-22:58 段: daemon 重启 → healthz/pidfile 三探针绿 → POST 三 job → next_run_at 值面断言
- 预期瞬态（非告警，知情项）: 重启 down 2-3min 内 l1（schtasks 形）至多 1 轮 `ISSUES x1`（debounce 2 不触发告警）·tree-patrol/l2-stub 高频 patrol 件丢 1-2 轮无状态自愈·watchdog 至多记 1 fail 远离 3 连败 stand down 线
- 施工序列硬顺序: 改 channel.cmd → 重启（env 重载）→ POST 三 job（allowlist 未生效前 POST 新串=403 拒）→ F-3 验证

## 五、完工门映射（窗令三项·本席执行法）

| 完工门 | 执行法 |
|---|---|
| ① 重启后进程内生效验证 | healthz ok + pidfile==listen pid + `/internal/v1/cron/jobs` 200（token 面·jobCount=13 预期）+ allowlist 生效旁证（新 job POST 201 非 403） |
| ② 两新 job next_run_at 值面非空 | store 直读（sqlite 只读探针的 JSON 等价）+ API 双路断言；空则 PATCH {schedule} 同值触发 recompute（API 正途禁手写库） |
| ③ DEM-004 首验行 schema v1 合规 | 次日 09:30 首跑后按 CPO 五锚判法⑤逐行机扫（五要素+ts+quota_used 全非空）——窗内交付脚本+落点，首验行候次日晨读数（如实标注窗内/窗后面分界） |

- 回滚锚: channel.cmd 备份回拷+daemon 重启（≤5min）；三 job DELETE（API 正途）；l1 schtasks 不停（若 job③ 回滚）
- F-3 家族警示在带: POST 201≠会触发·next_run_at 必验（8713 F-3 已修 09-30 照验不豁免）

## 六、候 CTO 门禁定稿项汇总

1. job② command+schedule（第五面 shadow 配套·窗令未附形）
2. job① bigmodel usage API 端点形
3. job③ l1 schtasks 退役步骤（同窗停/删确认）
4. 白名单追加串 A/C 逐字节审（本卷 §三）
5. 阈值数值注入的 CFO 正身缺位处理确认（结构先落·数值候注入）

## 使用依据

- COO 窗族令正身 coo-window-family-order-20261011.md @87871894（d1061a17 收编）栏 B 全文
- TriMLC app.ts L239-251 / channel.cmd / trimlc-watchdog.ps1 / trimlc-watchdog-launch.vbs 活体实勘（本卷时点）
- CPO DEM-004 schema v1 定稿卷 @5ceb13e9（99 行全文）
- 现役 store `%LOCALAPPDATA%\trilc-channel\cron.db.json`（10 jobs 直读）
- 8713 healthz 窗前基线（14:59:29·ok=true·jobCount=10·degraded=false）
- 纪律册: cmd 批 CRLF 保存法（10-02 M2 实证条）/TriRLC cron command 白名单精确等值条/F-3 家族警示条
