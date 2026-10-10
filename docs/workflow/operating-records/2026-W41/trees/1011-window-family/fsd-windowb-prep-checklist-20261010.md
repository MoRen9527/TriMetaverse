# FSD 栏 B 窗前预备施工单 · 8713 并批三件一次重启（就位确认供料·v2 归一版）

- sourceOfTruth: 本件（trees/1011-window-family/fsd-windowb-prep-checklist-20261010.md）
- syncMode: static（预备卷·落盘即锚）
- lastSyncedAt: 2026-10-10T15:20:00+08（date 现查基点 15:08+08·v2 归一改版）
- 执行位: FSD 小全（m-fsd）
- 令源链: COO 10-11 周日窗族令 @87871894（BOD 认账 14:57 生效）栏 B——施工=FSD·门禁=CTO·窗=10-11（周日）22:30-01:00·硬 deadline≈10-16
- v2 归一: CTO 栏 B 门禁稿 cto-window-b-allowlist-append-list-20261010.md（15:02:50+08·sg-server/dev 28287b8b）读毕——**分叉归一从 CTO 形**（v1 占位 ops-local/LOCALAPPDATA 形作废·差异与归一理由 §七）+COO 认收回执（15:12:13·迁移时点 23:10 勘正采认·收敛窗批注合理照执行）

## 一、预备实勘八锚（全部活体/正身面，非推定）

| # | 勘点 | 读数 | 锚 |
|---|---|---|---|
| 1 | 白名单代码正形 | `TRILC_CRON_COMMAND_ALLOWLIST`（TriMLC 沿用 TRILC 前缀）·逗号分隔**精确等值**（trim 后比对，无前缀无通配）·仅 HTTP POST 门·不携带 command 的 job 不受影响 | TriMLC `src/server/app.ts` L239-251（与 CTO 12:06 实勘同点位互证） |
| 2 | allowlist 运行值真源位 | `%LOCALAPPDATA%\trimlc-daemon-channel.cmd` L25 行（set 形）·现役 **12 条精确串**——与 CTO 栏 B 稿 §一 12 条**逐字节一致**（双席独立实勘互证零漂移） | channel.cmd 实读（4227B·10-09 09:48 mtime）+CTO 稿对表 |
| 3 | 现役 jobs 全清单 | jobCount=10（cron.db.json 投影直读 07:00Z）·10 条 command 对 allowlist 12 串**零孤儿** | store 投影直读 |
| 4 | 避触件在册确认 | 21:00 绩效 job `cron_mv0bq1v2_zgw8`（expr `0 0 21 * * 0`·nextRun 10-11 21:00+08）✓ / 12:00 联审 job `cron_muqyqy4g_ippm`（周六件·nextRun 10-17）✓——两件零触碰 | store 投影直读 |
| 5 | 行尾形态 | channel.cmd = **CRLF**（file 实勘 + od \r 计数 145）——施工追加/修改必保 CRLF（LF-only set 区静默失效族·10-02 M2 落位件在案） | file/od 实勘 |
| 6 | 重启链正形（v2 补勘） | schtasks **`TriMLC Daemon`** State=Running·EXEC=channel.cmd 直启（无包装）——重启正形=/end→/run 此任务**禁裸杀**；`TriMLC-Watchdog` State=Ready·PT5M·vbs→watchdog ps1（三探针·logon guard fail-closed·3 连败 stand down·revive 同走 channel.cmd） | Get-ScheduledTask 实勘（15:1x） |
| 7 | store 双形态（v2 定谳） | `trilc-channel\cron.db`=**SQLite WAL 活写**（主 db 13:08 checkpoint 后静置正常形·-wal 4.1MB 15:15 活刷）+`cron.db.json`=**投影面**（5607B·15:15 与 WAL 同拍同步刷）——F-3 值面验证双路：sqlite 只读（CTO 稿路径）+JSON 投影（l1 读法）对表 | ls/stat/file 实勘（15:1x） |
| 8 | token 落位 | channel.cmd set 行（TRILC_INTERNAL_TOKEN·watchdog L23 进程内读取惯例）——值面零回显维持 | watchdog ps1 实读 |

## 二、三 job 施工设计（v2 从 CTO 形·窗内实落脚本路径为准刷清单）

CTO 栏 B 稿占位三串+占位名注记（「窗内可改脚本名但**串禁含逗号**·以窗内实落脚本路径为准刷本清单再改 cmd」）全盘采认：

### job① DEM-004 读数行（一期·挂 09:30 daily）

- command: `node D:/Code/ai/TriMetaverse/scripts/fade/glm-usage-readout.mjs`（CTO 占位形·fade/ 同位惯例=窗令「复用 hub-silent-detect 形」正解）
- schedule: cron `0 30 9 * * *`（6 字段带秒形·与周平面迁移件同族）→ 09:30+08 daily
- schema v1 消费面（CPO 定稿 @5ceb13e9 全文已勘）: jsonl 每行一对象·四组字段全表照抄；**五要素全必填**（plane/service_domain/account/model/metric_basis）·`metric_basis` 一期恒 `provider`·account 禁明文 key（尾指纹 8 位）·ts 机写禁手填·pair_ref 非重置日=null
- 落盘名: `glm-quota-obs.jsonl`（CPO 卷定·与脚本名 glm-usage-readout 无冲突——脚本名≠数据文件名）·落点 8713 运行数据目录 `%LOCALAPPDATA%\trilc-channel\`（CFO input①·两腿分离不入 git）
- 阈值注入形（CPO 施工注记①）: thresholds_snapshot 落**结构**数值配置注入禁硬编码——拟 `scripts/fade/glm-usage-readout.thresholds.json`（CFO 正身到位前结构在位数值候注入）
- 窗内定稿项: bigmodel usage API 端点形（source 字段+取数路径）

### job② 预派 job（第五面 #3·CTO 稿已给形——v1 候定项 2 得答）

- command: `node D:/Code/ai/TriMetaverse/scripts/fade/window-dispatch-remind.mjs`（CTO 占位形）
- schedule: 候窗内 CTO 定（窗令未附·过渡形不投资过度）

### job③ 活性探针 job（CTO 认领件·CTO 稿给新脚本形）

- command: `node D:/Code/ai/TriMetaverse/scripts/fade/liveness-healthz-probe.mjs`（CTO 占位形·新写轻探针）
- schedule: 候窗内 CTO 定（拟 every 300000 对齐现 l1 节拍）
- **双跑防（窗内确认项）**: CTO 形=新轻探针非 l1 本体复用——若轻探针职责=l1 子集（healthz+cron degraded），现役 l1 schtasks（全功能 5min 面）是否保留并存或同窗退役，候 CTO 窗内明确（防同职责双告警源互踩）

## 三、白名单追加行清单（v2 从 CTO 稿形·三串）

| # | 追加串（精确等值·逐字节·串禁含逗号） | 对应 job | 状态 |
|---|---|---|---|
| A | `node D:/Code/ai/TriMetaverse/scripts/fade/glm-usage-readout.mjs` | job① | CTO 稿占位形·窗内实落刷 |
| B | `node D:/Code/ai/TriMetaverse/scripts/fade/window-dispatch-remind.mjs` | job② | CTO 稿占位形·窗内实落刷 |
| C | `node D:/Code/ai/TriMetaverse/scripts/fade/liveness-healthz-probe.mjs` | job③ | CTO 稿占位形·窗内实落刷 |

- 现役 12 串 + 追加 3 串 = 15 串上限（channel.cmd L25 单行逗号分隔）
- 追加形（CTO 稿）: L25 行尾各加 `,`+新串（三行合一改一处·逐条追加亦可）
- 施工法（照纪律册+CTO 注意 1）: 改前备份 channel.cmd（`.bak-pre-windowb-20261011`+md5 双录）→ 改前测行尾 → 追加保 CRLF → 写后 od 断 CR 数差=追加行数 → 验证用**临时剥启动行 echo 探针**（禁直接 call 生产启动器）

## 四、时序红线+重启序列（v2 并 CTO 注意 2/4）

**重启收敛窗 = 22:46-22:58**（COO 批注合理照执行·理由三拍）:

| 拍 | 时点 | 绕行理由 |
|---|---|---|
| bod-tick | 22:37 / 23:07（`7,37 * * * *`） | 重启段避开两拍前 2min |
| hub-silent-detect | 22:45 / 23:00（`*/15`） | 22:45 拍后启动重启=零丢拍 |
| 周平面迁移 | **23:10**（`0 10 23 * * 0`·周日·store 实勘值面·COO 采认勘正） | **硬红线：重启+POST+验证段必须 <23:05 全毕**——迁移 job 在 daemon down 窗错过=丢拍事故；23:10 正常触发作毕报旁证 |

**施工序列（v2 正形）**:

1. 22:30-22:45 段: 备份 channel.cmd → 修改 L25 追加三串（文件面零风险·daemon 不动）→ od 断 CR → 临时剥启动行 echo 探针（语法/值面验证·不真启动）
2. 22:46 段: **先停 watchdog**（`schtasks /end TriMLC-Watchdog`·CTO 注意 2 防抢拉竞争；5min 轮窗内复探到新进程 healthy 零动作·稳法=/end+完成段复位确认 Ready）→ `schtasks /end TriMLC Daemon`（优雅停正形·禁裸杀）→ `/run TriMLC Daemon`（新 env 重载）
3. 22:48-22:58 段: 完工门四项验证（§五）→ POST 三 job（allowlist 命中放行）
4. 23:10: 周平面迁移 job 正常触发作毕报旁证读数

- 预期瞬态（非告警，知情项）: 重启 down 2-3min 内 l1（schtasks 形）至多 1 轮 `ISSUES x1`（debounce 2 不触发告警）·tree-patrol/l2-stub 高频 patrol 件丢 1-2 轮无状态自愈
- F-3 家族警示在带: POST 201≠会触发·next_run_at 必验（8713 已修 09-30 照验不豁免）

## 五、完工门（窗令三项+CTO 增量·四项执行法）

| 完工门 | 执行法 |
|---|---|
| ① 重启后进程内生效验证 | healthz ok + **uptime 重置断言**（CTO 注意 4：uptime 延续旧值=旧进程活着=改行未生效路径·即停追因）+ pidfile==listen pid + `/internal/v1/cron/jobs` 200（token 面·jobCount 预期 10→13） |
| ② 三新 job next_run_at 值面非空 | **双路断言**：sqlite 只读（CTO 稿路径）+ cron.db.json 投影对表（§七锚）；空则 PATCH {schedule} 同值触发 recompute（API 正途禁手写库） |
| ③ allowlist 生效探针=新串 job **实际触发过**（CTO 注意 3④·强于光 POST） | 临时 every-60000 同串探针 job POST→滚一轮→execution_log 增行断言+首滚 status=ok→DELETE 探针 job（三正式 job 光 POST 201+next_run 非空为窗内门·触发链实证由探针 job 代理） |
| ④ DEM-004 首验行 schema v1 合规 | 次日 09:30 首跑后按 CPO 五锚判法⑤逐行机扫（五要素+ts+quota_used 全非空）——窗内交付脚本+落点，首验行候次日晨读数（如实标注窗内/窗后面分界） |

- 回滚锚: channel.cmd 备份回拷+TriMLC Daemon /end→/run（≤5min）；三 job DELETE（API 正途）；watchdog 复位 Ready 确认

## 六、候定项汇总（v2 削减·CTO 稿已答三）

| # | 项 | 状态 |
|---|---|---|
| 1 | 白名单三串 A/B/C 逐字节审 | CTO 稿已给占位形·窗内实落刷（自审通过：fade/ 同位+串禁逗号合规） |
| 2 | job② command+schedule | command 已答（window-dispatch-remind.mjs）·schedule 候窗内定 |
| 3 | job③ l1 schtasks 处置（并存 vs 退役） | **候窗内 CTO 明确**（轻探针形下新问题） |
| 4 | DEM-004 bigmodel usage API 端点形 | 候窗内定（脚本施工首步） |
| 5 | 阈值数值注入 CFO 缺位处理 | 结构先落 thresholds.json 数值候注入（CPO 施工注记①已覆盖·窗内知会 CFO 即可） |

## 七、v1→v2 归一差异注记（版本差如实）

| 项 | v1（我拟） | v2（从 CTO 形） | 归一理由 |
|---|---|---|---|
| job① 落点 | ops-local/glm-quota-obs.mjs | fade/glm-usage-readout.mjs | fade/=窗令「复用 hub-silent-detect 形」正解·与现役 8-12 条同位惯例 |
| job③ 形 | 复用现役 tri-liveness-l1.ps1 | 新写 liveness-healthz-probe.mjs | CTO 认领件 CTO 定形权·落盘名 glm-quota-obs.jsonl 不变（CPO 卷定） |
| 重启法 | watchdog 不动·直接重启 daemon | 先 /end watchdog→TriMLC Daemon schtasks /end→/run | CTO 注意 2（防 watchdog 抢拉竞争）+禁裸杀纪律 |
| 完工门 | 三项（healthz/next_run/schema） | 四项（+uptime 重置断言+触发链实证探针） | CTO 注意 3④/4 增量 |
| store 认知 | 单一 JSON 形 | 双形态：sqlite WAL 活写+JSON 投影 | v2 补勘定谳（§一锚 7）——v1「store 直读」实为投影读法，F-3 验证升双路 |

## 使用依据

- COO 窗族令正身 coo-window-family-order-20261011.md @87871894（d1061a17 收编）栏 B 全文+COO 认收回执 15:12:13
- CTO 栏 B 门禁稿 cto-window-b-allowlist-append-list-20261010.md（15:02:50+08·28287b8b）全文
- TriMLC app.ts L239-251 / channel.cmd / trimlc-watchdog.ps1 / schtasks 双任务（TriMLC Daemon/TriMLC-Watchdog）活体实勘（本卷时点）
- CPO DEM-004 schema v1 定稿卷 @5ceb13e9（99 行全文）
- store 双形态实勘（cron.db sqlite WAL+cron.db.json 投影·15:1x ls/stat/file）
- 8713 healthz 窗前基线（14:59:29·ok=true·jobCount=10·degraded=false）
- 纪律册: cmd 批 CRLF 保存法（10-02 M2 实证条）/TriRLC cron command 白名单精确等值条/F-3 家族警示条/禁裸杀条（trilc-daemon-restart-discipline）/重启窗完工判据条（restart-window-completion-criteria）
