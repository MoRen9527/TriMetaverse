# FSD·TriRLC/TriMLC 缺陷修批四件读数（D-15·时点前移即刻批）

- sourceOfTruth: 本件（FSD 施工读数卷；令源=CTO 00:00 D-15 四件令+COO 03:16 时点前移令；裁定卷=cto-bod-three-items-rm-verdict-20260929.md §四/§六/§七 @e07ff9ab）
- syncMode: static（完工终态）
- lastSyncedAt: 2026-09-30T04:1x+0800（date 现查=2026-09-30 04:1x +0800）
- 施工席: FSD 小全（m-fsd）

## 批总览

| 件 | 态 | 锚 |
| --- | --- | --- |
| 件1 F-2 review-only | 三点复核全过 | TriMLC ee5d7fe / TriRLC 18cd777 |
| 件2 F-3 addJob 缺列 | 机理勘明+修复+活体验证闭环 | **TriMLC 0fd9c6f** |
| 件3 8711 ENV_FILE 正形 | 三件套落位（cmd 薄壳+ps1+env） | 本机 %LOCALAPPDATA%\trirlc\daemon\ |
| 件4 身份无关实弹 | **一次过**（复活路径全链实测） | watchdog.log 04:01:03 触发 |

## 件2·23:23 自愈机理勘明结论（BOD 钉：机理不明不得销账）

**自愈写入路径=runJobNow（force run）跑后回写**（timer.ts L384-391：`updateJobRun(id, { nextRunAt: ... })`）。

证据链四锚：
1. **PATCH 路径排除**：cron.db.json 镜像冻结于插入态（run_count=0、无 nextRunAt、updated_at=created_at=22:56:48+0800）——updateJob 必调 saveCronStore（store.ts L327），该 job 从未被 PATCH 过；
2. **首轮必为 force run**：timer 三调度入口（armTimer L93/onTimerTick L132/runMissedJobs L335）全过滤 nextRunAt 真值——NULL 态不可能被调度触发，execution_log 首条 started_at=2026-09-29T15:23:10.138Z（=23:23:10+0800，与 BOD 钉的 23:23 分毫不差）必来自 runJobNow（其无需 nextRunAt）；
3. **触发源=COS 活体自证**：裁定卷 §六「活体自证 PASS：cron_mumsuxup_pu0y 双轮 ok」与前两轮 off-cadence 执行（23:23:10→23:25:21）吻合，23:35 起整齐 5min 节律=回写后续航；
4. **pid 恒定**：35520 全程无重启——进程内回写路径自洽。

**缺陷定性**：addJob INSERT 缺 next_run_at 列 → 新 job 对 timer 全不可见（永待「点亮」）——「cron job state 卫生」教训的同族代码根因版。

## 件2·修形与验证

- 修形选择：**INSERT 算首次触发点**（addJob 内 parseCronSchedule().nextRunMs() 写入，与 updateJob PATCH 路径语义对齐；unparseable fail-open NULL 同 updateJob 语义）。候选二（NULL+timer 补算显式化）需动 timer 热路径，爆炸半径大，不取。
- TriMLC **0fd9c6f**（src/cron/store.ts 修 + test/cron-store-nextrun.test.ts 新增 4 案：every/cron/fresh-instance round-trip/fail-open）。
- 测试：tsc 零错；cron 族 16/16；**全量零回归实证**——stash 对照基线 617 tests/609 pass/8 fail ↔ 带修 621/613/8 fail（+4 全为新 F-3 案；既有 8 fail 独立归因=TriMC 旧名路径残留 ERR_MODULE_NOT_FOUND×replay-flow + ink-testing-library 缺包×tui/components，与 F-3 无关）。
- 8713 重启全纪律：身份核验（35520=TriMLC dist/index.js）→ POST /shutdown 带 x-internal-token 200 → 停净（监听消失）→ channel cmd 同形复活 → 新 PID **8036**（03:50:44 起）healthz 200。
- 活体验证：probe job 插入 → `next_run_at=2026-09-29T19:55:00.000Z`（raw JSON；插入时刻 19:51:53Z，边界+3min07s 未来值）→ DELETE 清场；现役 5 job 全员带 nextRunAt；CLI cron list 翻绿（5 job，last run 全新鲜）。

## 件3·8711 launcher 三件套（ENV_FILE 正形）

- **trirlc-daemon.cmd 重写为薄壳**（329B ASCII 0、零令牌）：powershell -File 调 ps1；**路径保持不变**=watchdog 复活令零改动（§四.2 同步核验 ✓）。
- **trirlc-daemon.ps1 新建**（1351B ASCII 0、**PSParser 0 错**、零令牌）：非密 env pins（TRILC_DATA_DIR/TRIMC_BASE_URL=8.155.54.79:8710/TRILC_ENV_FILE 指向）+PATH pin+node 双路守卫（pin 失败回退 where）+env 文件存在性门。
- **trirlc-daemon.env 新建**（590B ASCII、9 键、ACL current-user）：TRIMC_INTERNAL_TOKEN+TRIMODEL_API_TOKEN 自旧 cmd 提取（len64×2，值零出机零入 git）+7 键继承自 D:\Code\ai\.env（OPENAI_*/LOCAL_MODEL_PATH/DEEPSEEK_API_KEY/TRIMODEL_TRIMETAVERSE_API_KEY/TRIMC_NOTIFY_SG_URL/TOKEN——旧 cmd TRILC_ENV_FILE 指向该文件的现行继承面，逐值脚本搬运）。
- 回滚锚：`trirlc-daemon.cmd.bak-pre-envfile-20260930T0355+0800`。
- TRILC_DEBUG=1 未迁移（正形对齐 8713 侧不设 debug；读数如实标注）。

## 件4·身份无关实弹（复活路径全链）

- 受控停：8711 /shutdown 被 P0 fail-closed 门锁（源码 L1800-1806：未配置=401 internal_auth_disabled；实测响应=401 unauthorized——门令=User 级环境变量 TRILC_INTERNAL_TOKEN len64，schtasks 上下文自带）→ 身份验核后（15708=TriRLC dist/index.js）受控 taskkill，03:59:13 停净。
- **watchdog 自然复活一次过**：TriRLC-Watchdog tick 04:01:03.86 「DOWN (fail 1/3) -> reviving」→ **04:01:20 healthz 200**（17 秒）；新链（schtasks→vbs→watchdog.ps1→cmd 薄壳→ps1→cli.js start→detached index.js）首弹即成。
- 三查读数：①pid=**45040**（04:01:04 起，cmdline `node D:\Code\ai\TriRLC\dist\index.js` ✓）②token 门：no-token→401 unauthorized / 错令→401 unauthorized（fail-closed 生效）/ User 级令→internal 面 200 ③监听 8711 LISTEN ✓。
- env 链功能证明：healthz `trimc: connected`（新 env 文件令牌对 R-HY 8710 认证通过）+ daemon.log `ready pid=45040`。

## 双 daemon 健康三查（批末）

| daemon | pid | 监听 | healthz | 内面 |
| --- | --- | --- | --- | --- |
| 8713 TriMLC | 8036 | ✓ | 200 | config/show fresh（GLM-5.3 tier2-cache-fresh）；cron list 5/5 翻绿 |
| 8711 TriRLC | 45040 | ✓ | 200 | config/show 200；trimc:connected |

## 技术债务/候裁项（如实标记）

1. **TriRLC 镜像同漏未修**：TriRLC src/cron/store.ts addJob 同款 INSERT 同缺 next_run_at（同漏实锤，本批读数留证）。令文 scope=TriMLC，未擅动——候 CTO 裁（F-2 前例=同漏即同修 18cd777；修形同构可即刻镜像，8711 侧 cron jobCount=0 现无受累 job，非急）。
2. 8711 内面令牌=User 级环境变量供给（非 ENV_FILE）——分值分存未覆盖此键（键不在旧 cmd 内、非本批迁移对象）；如需收编入 env 文件候裁。
3. TRILC_INTERNAL_TOKEN 在 D:\Code\ai\.env 无键——8711 令牌面现役依赖 User env，文档面未见记载（本卷即为记载）。
4. updateJobRun 不调 saveCronStore → cron.db.json 镜像恒滞后（观测到 run_count=0 冻结镜像）——观察项非缺陷，候 CTO 裁是否补写。
5. TriMLC 全量 8 个既有 fail（TriMC 旧名路径残留 + ink-testing-library 缺包）——测试基建债，非本批引入，候维护窗。
6. 8711 fail-closed 门锁使优雅停不可达（/shutdown 401）——本批以验核 taskkill 替代；长效解=给 8711 配 TRILC_INTERNAL_TOKEN（候裁，涉新密钥供给）。

## 使用依据

- CTO 00:00 D-15 四件令（transcript line 11004 恢复全文）+00:04 验收修正
- COO 03:16 时点前移令（即刻开工）
- 裁定卷 cto-bod-three-items-rm-verdict-20260929.md §四/§六/§七 @e07ff9ab
- TriMLC ee5d7fe/0fd9c6f；TriRLC 18cd777
- 实测证据：trilc-channel\cron.db 只读探针、execution_log、watchdog.log、daemon.log、healthz/token 门四态探针
