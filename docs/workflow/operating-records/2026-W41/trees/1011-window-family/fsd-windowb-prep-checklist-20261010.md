# FSD 栏 B 窗前预备施工单 · 8713 并批三件一次重启（v3 门禁终形版·窗内施工消费卷）

- sourceOfTruth: 本件（trees/1011-window-family/fsd-windowb-prep-checklist-20261010.md）
- syncMode: static（预备卷 v3·与 CTO 门禁定稿卷 cto-windowb-gate-verdict-20261010.md 配套·施工以两卷为准读卷不读信）
- lastSyncedAt: 2026-10-11T03:20:00+08（date 现查基点 03:18+08·v3.1 窗位变更改版）
- 执行位: FSD 小全（m-fsd）
- 令源链: COO 10-11 周日窗族令 @87871894（BOD 认账 14:57 生效）栏 B→CTO 门禁定稿卷 @894ec51d+补笔 @831f3f66（c4d15c11 链内·APPROVE 全五项）→**BOD 窗令变更 2026-10-11T03:18+0800（CEO 03:16 令+BOD 裁 D-39 域内）：栏 B 窗位 22:30-01:00 提前至 08:30-11:00（硬锚 11:00）·栏 A 时段（03:30-08:00）候 CTO 协作调遣·重启瞬断拍延迟=BOD 知情放开干**
- v3.1 要旨: 施工面三件+三串终形+九步序列全沿 v3（门禁终裁零变更）——**仅时序节按新窗重算**（§四 v3.1）：23:10 迁移红线解除·高频拍绕行重表·收敛窗 08:46-08:56·完工门④窗内化（09:30 首滚窗内验）

## 一、预备实勘八锚（v2 定谳沿用·CTO 认收）

| # | 勘点 | 读数 | 锚 |
|---|---|---|---|
| 1 | 白名单代码正形 | `TRILC_CRON_COMMAND_ALLOWLIST` 精确等值仅 HTTP POST 门 | TriMLC app.ts L239-251（双席互证） |
| 2 | allowlist 真源位 | channel.cmd L25·现役 12 串（双席逐字节互证零漂移） | channel.cmd 实读 |
| 3 | 现役 jobs | jobCount=10·对 12 串零孤儿 | store 投影直读 |
| 4 | 避触件 | 21:00 绩效 `cron_mv0bq1v2_zgw8`+12:00 联审 `cron_muqyqy4g_ippm` 零触碰 | store 投影直读 |
| 5 | 行尾形态 | channel.cmd=CRLF（od \r=145）——追加必保 CR+写后断差 | file/od 实勘 |
| 6 | 重启链正形 | schtasks `TriMLC Daemon`（Running·channel.cmd 直启）/end→/run 禁裸杀+`TriMLC-Watchdog`（Ready·PT5M）先 /end 防抢拉 | Get-ScheduledTask 实勘 |
| 7 | store 双形态 | cron.db=SQLite WAL 活写+cron.db.json=投影面同拍刷——F-3 验证双路对表（CTO 认收升格） | ls/stat/file 实勘 |
| 8 | job③ 基线锚（CTO 实勘） | TriLiveness-L1 schtasks→wscript tri-liveness-l1.vbs→壳内命令与终串 C **逐字等值**；l1.ps1 8571B·mtime 10-10 11:50:11（今晨修复批后形）·md5 `29C33DB551314DD1B3D278731908E661` 窗前基线 | CTO 门禁卷 §一④三锚 |

## 二、三 job 终形（门禁一锤·CTO 卷 §四终表照抄）

### job① DEM-004 读数行（一期·挂 09:30 daily）

- command（定稿）: `node D:/Code/ai/TriMetaverse/scripts/ops-local/glm-quota-obs.mjs`
- schedule: cron `0 30 9 * * *`（6 字段带秒·09:30+08 daily）
- schema v1 消费（CPO @5ceb13e9）: jsonl 四组字段照抄·五要素全必填·metric_basis 恒 provider·account 禁明文 key·ts 机写禁手填
- **端点配置化（CTO 裁②）**: 端点值入 `scripts/ops-local/glm-quota-obs.config.json`（与 thresholds.json 同形同位）——窗内 FSD 实测定端点·验收锚=**实测 200+返回含用量字段**（非文档抄录）·API key 走 env 读禁硬编码禁入 git·CFO 正身后配置面替换零代码改
- 阈值注入: `glm-quota-obs.thresholds.json` 结构先落数值候注入；**增量门 1（CTO 裁⑤）**: 缺 thresholds.json 必须显式 degraded 输出标 `thresholds=missing`——禁静默硬编码兜底
- 落盘: `%LOCALAPPDATA%\trilc-channel\glm-quota-obs.jsonl`（两腿分离不入 git）

### job② 预派 job（第五面 #3·运营域可调）

- command（定稿）: `node D:/Code/ai/TriMetaverse/scripts/ops-local/window-dispatch-remind.mjs`
- schedule 初值: `0 0 9,18 * * *`（09:00+18:00 daily）——运营域 COO 面 API PATCH 随调零重启（不入 allowlist 不锁死）
- 脚本本体: 窗内 FSD 最简交付（提醒文本+落点扫描·过渡形不投资过度）
- **POST 前门（三 job 同规）**: 脚本实存断言+`node --check` 语法门

### job③ 活性探针 job（调度器代换形·CTO 卷 §四语义校正）

- command（定稿）: `powershell -NoProfile -ExecutionPolicy Bypass -File C:/Users/jedih/AppData/Local/tri-liveness-l1.ps1`（**同脚本代换**——schtasks→8713 cron·保 LG-066 修复批全语义·md5 29C33DB5 基线对照）
- schedule: every 300000（5min·对齐现 schtasks 节拍）
- **语义**: 判定面调度器代换非新写轻探针（v2 fade 轻探针形废弃）·**并存选项不设**（双告警源正是本件消除目标）
- **退役硬序（CTO 裁③·disable 禁 delete）**: job③ execution_log **首滚 status=ok**（两形双证：next_run_at 非空+execution_log 增行·禁 nextRun 滚动单独代触发）→ `schtasks /change /tn TriLiveness-L1 /disable`（**避开下一 run 时点 30s 内执行**防撞车双跑）→ 窗内毕报前**第二滚 ok+l1.log 唯一写者断言**（8713 唯一调度源）·回滚=re-enable 零成本·7 天清理评估后再议 delete

## 三、白名单追加行清单（终表·门禁一锤）

| # | 追加串（精确等值·逐字节） | 对应 job |
|---|---|---|
| A | `node D:/Code/ai/TriMetaverse/scripts/ops-local/glm-quota-obs.mjs` | job① |
| B | `node D:/Code/ai/TriMetaverse/scripts/ops-local/window-dispatch-remind.mjs` | job② |
| C | `powershell -NoProfile -ExecutionPolicy Bypass -File C:/Users/jedih/AppData/Local/tri-liveness-l1.ps1` | job③ |

- A/C 双 APPROVE（CTO 逐字节审毕·含 vbs 壳等值三锚）·B 如①定稿
- 12+3=15 串上限·追加形=L25 行尾 `,`+新串
- 施工法: 备份（`.bak-pre-windowb-20261011`+md5 双录）→改前测行尾→追加保 CRLF→od 断 CR 差→临时剥启动行 echo 探针（禁直接 call 生产启动器）

## 四、时序+施工序列终形（v3.1 新窗重算·九步硬顺序不变）

**新窗 = 08:30-11:00（硬锚 11:00·BOD 03:18 变更令）**

**v3.1 时序重算**（23:10 迁移拍不在新窗=**迁移红线解除**·迁移 job 晚间 23:10 照常跑与施工零交叠·旁证改由窗毕报引当晚读数）：

| 拍族（上午·新窗内） | 时点 | 绕行理由 |
|---|---|---|
| bod-tick（8713 cron） | 08:37 / 09:07 / 09:37 / 10:07 / 10:37（`7,37` 族） | 重启段避开 ±2min |
| hub-silent-detect（8713 cron） | 08:45 / 09:00 / 09:15 / 09:30 / 09:45…（`*/15`） | 重启段避开拍点（丢拍=静默侦测延迟 15min） |
| l1（schtasks 现役） | 每 5min 边界（:00/:05/…） | down 2-3min 至多 1 轮 ISSUES x1·debounce 2 不告警（知情项维持） |
| 联审 job | 周六件·周日不触 | ✓ 零交叠 |
| 绩效 job | 21:00·不在窗 | ✓ 零交叠 |

**重启收敛窗 = 08:46-08:56**（主选：08:45 hub-silent 拍后·09:00 拍前·bod-tick 08:37 已过 09:07 未到）·备选 09:16-09:26（同构·若主选段被占）。

**九步序列（硬顺序·时点按新窗）**:

1. 08:30-08:45: 备份 channel.cmd→L25 追加三串→od 断 CR→剥启动行 echo 探针（文件面·daemon 不动）+三脚本就位（job①/② 窗内写·实存+node --check 双门·job③ 已在位 md5 对照 29C33DB5）
2. 08:46: `schtasks /end TriMLC-Watchdog`（防抢拉）→ `/end TriMLC Daemon`（优雅停禁裸杀）→ `/run TriMLC Daemon`（新 env 重载）
3. 08:48: healthz ok+**uptime 重置断言**（旧值延续=旧进程活着即停追因）+pidfile==listen pid
4. **在册 10 jobs 零丢拍三对表（CTO 增量锚·必做）**: jobCount=10 仍在+迁移 job next_run_at 指 23:10+绩效 job next_run_at 指 21:00——**三项全绿才进步骤 5**
5. POST 三 job（新串 201 非 403=allowlist 生效旁证）——**须 <09:30 完成步 5-6**（保 job① 09:30 首滚窗内发生）
6. 三 job next_run_at 值面断言（sqlite 只读+JSON 投影双路·空则 PATCH {schedule} 同值 recompute 禁手写库）
7. job③ execution_log 首滚 status=ok（两形双证·every 300000 形首滚≈POST 后 5min）
8. `schtasks /change /tn TriLiveness-L1 /disable`（首滚 ok 后·**避开 l1 下一 run 时点 30s 内**·禁 delete）
9. job③ 第二滚 ok+l1.log 唯一写者断言→09:30 job① 首滚→jsonl 首行 schema 机扫（完工门④窗内验）→毕报（硬锚 11:00 前全毕）

- 预期瞬态（知情非告警·BOD 知情项）: 重启 down 2-3min 内 l1 至多 1 轮 ISSUES x1·patrol 件丢 1-2 轮自愈·8713 cron 拍延迟=BOD 已知情放开
- F-3 家族警示: POST 201≠会触发·next_run_at 必验照验不豁免
- job② 副产锚: 09:00 拍若 POST 已毕=job② 首滚窗内自然发生（提醒件执行链实证·非依赖项）

## 五、完工门（四项·v2 形+CTO 增量全并入）

| 完工门 | 执行法 |
|---|---|
| ① 进程内生效验证 | healthz ok+uptime 重置+pidfile 对表+jobs API 200·jobCount=13 预期（10+3） |
| ② 三新 job next_run_at 非空 | sqlite+JSON 投影双路断言 |
| ③ allowlist 生效+执行链实证 | 新串 POST 201（门禁放行）+job③ execution_log 首滚 ok（执行链实证·v2 临时探针 job 形由 job③ 自身首滚替代——CTO 卷 §三合成段即此形） |
| ④ DEM-004 首验行 schema v1 合规 | **v3.1 窗内化**：09:30 首滚在窗内发生（POST <09:30 前提）→jsonl 首行按五锚判法⑤逐行机扫（五要素+ts+quota_used 全非空）·窗内毕报含首验行读数；若 POST 落于 09:30 后则回退「候次日晨」如实标注 |

- 回滚锚: channel.cmd 备份回拷+/end→/run Daemon（≤5min）·三 job DELETE·TriLiveness-L1 re-enable·watchdog 复位 Ready 确认
- 毕报链: 本席+CTO→窗收口毕报 BOD·旁证=当晚 23:10 周平面迁移正常读数（窗后引）+窗内 09:30 job① 首滚读数（v3.1 窗内化）

## 六、窗内 FSD 交付件清单

1. `scripts/ops-local/glm-quota-obs.mjs`+`glm-quota-obs.config.json`+`glm-quota-obs.thresholds.json`（job① 三件·端点/阈值配置化）
2. `scripts/ops-local/window-dispatch-remind.mjs`（job② 最简交付）
3. channel.cmd L25 追加三串（备份+断差）
4. 三 job POST+九步序列走毕+完工门四项
5. 毕报卷（trees/1011-window-family/·含旁证+知情项）

## 七、版本链（如实·时序交叠分叉根因录卷）

| 版 | 时点 | 要旨 | 终态 |
|---|---|---|---|
| v1 | 15:0x | ops-local 形初拟（A=glm-quota-obs·C=tri-liveness-l1.ps1 复用） | **方向被 v3 复活**（CTO 门禁终裁同向） |
| v2 | 15:17 | 归一从 CTO 15:02 fade 占位形 | **被终裁推翻**（时序交叠互为前后手——v2 基于 15:02 旧占位·CTO 门禁基于 v1） |
| v3 | 15:2x | CTO 门禁卷 §四终表一锤：ops-local 三串终形+job③ 调度器代换语义+增量锚全并入 | **现行** |

- v2 双锤（重启正形/store 双形态双路对表）经 CTO 认收升格沿用——v2 唯一作废面=三串点位归一方向（fade 形）
- 教训在卷: 双稿并行时序交叠=分叉根因，终裁以落卷门禁为准（读卷不读信）

## 使用依据

- CTO 门禁定稿卷 cto-windowb-gate-verdict-20261010.md @894ec51d+§四补笔 @831f3f66（c4d15c11 链内·全读毕）
- COO 窗族令 @87871894 栏 B+COO 认收回执 15:12:13
- v2 双锤实勘（TriMLC Daemon schtasks/store 双形态·15:1x）
- CPO schema v1 @5ceb13e9·CTO 实勘三锚（vbs 壳等值/l1.ps1 md5 29C33DB5/11:50 部署形）
- 纪律册: CRLF 保存法/精确等值白名单/F-3 家族/禁裸杀/重启窗完工判据/值面禁进打印路径（阈值缺位显式 degraded 同族哲学）
