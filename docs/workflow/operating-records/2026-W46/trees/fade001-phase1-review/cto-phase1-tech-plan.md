# FADE-001 第一阶段施工方案稿 · 技术面主笔件（CTO 五件终裁）

- sourceOfTruth: 本件（fade001-phase1-review/cto-phase1-tech-plan.md·批后方案稿技术面主笔）
- syncMode: static（方案稿技术面·呈批链=COS 合成治理面后 11-14 上午中转呈 CEO 唯一阅面）
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 令链: 联审合成径批生效（synthesis.md 36bf14a1d·COS 径批 23:30:41+08）→COS 方案稿技术主笔派工（23:34:01+08·五件）→本件
- 必载面：验收锚五条+配套五件+考卷随改清单节+plan skill 语义锚（synthesis §四）——照载于 §六-§八

## §零 五件终裁总表

| # | 件 | 终裁 | 工作量 |
|---|---|---|---|
| 1 | run id 形制 | `shift-W{fromWeek}-YYYYMMDDT{HHMMSS}Z` **终定**（采合成形·零修改）·铸形=payload 第一动作（先于 preflight） | 0.5 天 |
| 2 | preflight 脚本形态 | `runtime/cognition/preflight.py` 薄壳入口·四断言+算周双闸（γ 主闸+二道闸）·退出码语义表 §二 | 1 天 |
| 3 | 告警闸挂点+外发通道 | TriRMC `src/cron/alarm.ts`（独立 timer）·N 值表 §三·**SMTP 主+HTTP 8712 辅终裁** | 2-3 天 |
| 4 | bash 改形 | command 终形两版（§四：过渡态全文本可执行级+合并窗占位）·**必带 `set -eo pipefail`** | 0.5 天 |
| 5 | 与 11-15 关系 | 三形分层落实施工序表（§五）·告警闸不作 11-15 依赖项 | — |

## §一 run id 形制终定

- **形制终定**：`shift-W{fromWeek}-YYYYMMDDT{HHMMSS}Z`（采合成形——fromWeek 同源防脱节+UTC Z 后缀零歧义·零修改）。
- **铸形位置终裁：payload 第一动作（先于 preflight）**——理由：preflight 拦截轮也是一次 run 的终态（拦截=触发段预检正确拦截·ADE 落卷+告警文案全挂 run id 可追溯）——先铸 id 再跑 preflight，拦截轮同样全链可挂。
- **bash 铸形行**：`RUN_ID="shift-W{fromWeek}-$(date -u +%Y%m%dT%H%M%SZ)" && RUN_DIR=/var/lib/trirmc/cron/runs/$RUN_ID && mkdir -p "$RUN_DIR"`。
- run 目录结构约定（目标态接口预留·承接面后来者不返工）：`$RUN_DIR/{preflight.json, manifest.json, shift.log}`——preflight.json=preflight 模块原生输出（verdict/readback/断言读数）；manifest.json={run_id, from_week, to_week, start_date, job_id, preflight_version, preflight_at}；shift.log=迁移链聚合输出（tee）。
- daemon executor 侧零改动（executor per-run log 照旧·两层 log 并存无冲突）。

## §二 preflight 脚本形态终定

- **入口**：`TriCompany/runtime/cognition/preflight.py`（新模块·薄壳）——调用形：`cd /srv/fleet/TriCompany && python3 -m runtime.cognition.preflight --from {fromWeek} --to {toWeek} --start-date {startDate}`。
- **四断言终形**（抽取一条现役+补装三条·勘误二口径）：
  1. **分叉预检（现役抽取）**：调 `_preflight_bare_sync`（weekly_plane_shift.py L256-289 原样复用·不复制代码改 import——单点真源防两处分叉）。
  2. **hostname 断言（补装）**：`socket.gethostname()` 对配置常数比对——河源执行机名硬校验（防 job 误落他机）。
  3. **无进行中 git 操作（补装）**：`.git/MERGE_HEAD`/`.git/rebase-merge`/`.git/rebase-apply` 存在探针+`git status --porcelain` 输出对迁移面路径非空即拦（工作区脏=可能上一轮残留·不硬跑）。
  4. **8710 healthz（补装）**：`urllib` GET `http://127.0.0.1:8710/healthz` timeout=5s·ok!=true 即拦（触发段验证载体 daemon 活性·CEO 勘正 L5 载体资格前移触发段的触发侧切片）。
- **算周双闸终定**：
  - **γ 主闸（preflight 内）**：参数定形算周断言——独立重算 `{fromWeek}/{toWeek}/{startDate}`（week-math 同族逻辑 python 侧重实现·不调 TS）与占位符传入值三值比对，任一不符即拦；**含「明天=周一」边界断言**（BOD Q5 同族：toWeek 计算基准=「明天所在 ISO 周」·触发日必须周日·否则拦——防时点挪动后错周静默）。
  - **γ 二道闸（迁移器 validate 步·改判并入本阶段）**：`weekly_plane_shift.py` validate 步（步 4）旁挂一行断言 `toWeek==预期周`（重算比对）——错周静默双保险第二道。
- **退出码语义表**（与现役兼容·bash 消费面约定）：

| exit | 语义 | bash 行为 |
|---|---|---|
| 0 | 四断言全过+算周三值比对全过 | 继续（交棒迁移器） |
| 2 | hostname/脏工作区/8710 任一拦 | 本拍不执行·preflight.json 落卷·告警（exit 2≠3=断言族可区分） |
| 3 | 分叉拦（现役语义原样） | 本拍不执行·双址 blocking 告警（现役链） |
| 4 | 告警外发失败（blocking 可观测·现役语义原样） | 本拍不执行·升 4 优先于迁移 fail |

- **版本注**：preflight 打印自身版本号进 manifest.json（pull 前版本知情面·鸡蛋注登记）。
- **落位**：TriCompany 仓内随 pull 分发；单测随 TriCompany 测试纪律面（注入式拦截实锚=验收锚② DEM-009 同款）。

## §三 告警闸挂点三子件+外发通道终裁

1. **挂点（终裁）**：TriRMC `src/cron/alarm.ts` 新模块——独立 timer（与 job-executor 平行·不动执行循环）per-job 读 job-store 状态判定：
   - 漏拍分支：`now > nextRunAtMs + 30min` 且无新 run 记录（该拍没拍）
   - 败跑分支：`lastRunStatus=error` 持续 30min 无成功（拍了败了）
2. **N 值表（终定）**：grace=30min／败跑窗=30min／dedup 时间窗=30min／稳定窗=连续 3 拍成功重臂／复位不清窗锚（TriMLC power-monitor 11-12 窗先例四参数同构直用·专测双案同款复用）——**验收锚③对表：N=30min ≤ CPO-011 发现时延≤2h 同值同源满足**。
3. **形态约束（CPO 防蠕变条款照载）**：不做分级/路由/聚合——两条判据+dedup 先例形够。
4. **守护面**：与 daemon 同生命周期=trirmc-mc.service（systemd·deploy/ 实锚）守护已有+值席 patrol 兜底（G3 最后防线）；**daemon 全死盲区如实挂账知情面**（外部探针留后续窗非本阶段 scope）。
5. **外发通道（终裁）**：**SMTP 主形**——TriRMC 引入 nodemailer 依赖（package.json·独立通道不依赖任何可能同时死的 daemon）；**HTTP POST 8712 辅形**——TriMMC NOTIFY 入口（端点实位=施工窗活体勘·r51 落箱缺口在账故辅位）；重试=自带 3 次退避（1s/5s/25s）不依赖 ζ 验证结果；SMTP 凭据=部署面 env 注入（值面零回显纪律 D-46 全程适用·凭据位=trirmc-mc.service EnvironmentFile）。

## §四 bash 改形 command 终形

**终形两版（单窗统筹原则下二择一·终裁权=COS+COO 树权门禁窗并轨对表）**：

**版 A·过渡态（现役链+五要点·拆分未并轨时）**——payload command 全文本（可执行级）：

```bash
set -eo pipefail
RUN_ID="shift-W{fromWeek}-$(date -u +%Y%m%dT%H%M%SZ)" && RUN_DIR=/var/lib/trirmc/cron/runs/$RUN_ID && mkdir -p "$RUN_DIR"
cd /srv/fleet/TriCompany
if ! python3 -m runtime.cognition.preflight --from {fromWeek} --to {toWeek} --start-date {startDate} >"$RUN_DIR/preflight.json" 2>&1; then
  RC=$?; printf '{"run_id":"%s","preflight_exit":%d}\n' "$RUN_ID" "$RC" >>"$RUN_DIR/manifest.json"; exit $RC
fi
printf '{"run_id":"%s","from_week":"%s","to_week":"%s","start_date":"%s"}\n' "$RUN_ID" "{fromWeek}" "{toWeek}" "{startDate}" >"$RUN_DIR/manifest.json"
git pull --ff-only sg-bare dev || true   # 二道闸语义：preflight 已拦·pull 败不短路·迁移器内预检再拦（α 语义内化）
python3 -m runtime.cognition.weekly_plane_shift --from {fromWeek} --to {toWeek} --start-date {startDate} --operating-root {OPERATING_ROOT} --sync 2>&1 | tee "$RUN_DIR/shift.log"
git add -A && git commit -m "weekly plane shift {fromWeek}->{toWeek} run=$RUN_ID" && git push sg-bare HEAD:dev || (git fetch sg-bare && git merge --ff-only sg-bare/dev && git push sg-bare HEAD:dev)
```

- **`set -eo pipefail` 必带（施工级细节显式载）**：无 pipefail 时 `cmd | tee` 恒 exit 0（tee 成功）→bash -e 不短路→迁移器失败被吞——现役链若带 tee 必踩此坑；本终形以 pipefail 消解。
- 修正后施工序（ALLOWLIST 勘误口径）：改前备份 jobs.json→payload 改形→`systemctl restart trirmc-mc`（deploy/trirmc-mc.service 实锚）→值面三查（jobs.json json.load 断言+enabled=true+nextRunAtMs 未来值不抹）→健康探针（healthz+cron logs 尾行）。

**版 B·合并窗终形（拆分并轨时）**：§四版 A 骨架不变，迁移器调用段替换为拆分批轻量同步交棒链——**骨架（set-eo pipefail/run id 铸形/preflight 前置/manifest 落卷/值面三查）两版共用**，本方案稿载骨架为锚，替换段=COS+COO 并轨对表时一次写齐。

## §五 与 11-15 关系（三形分层落实施工序表）

| 时窗 | 动作 | 形 | 责任 |
|---|---|---|---|
| 11-13（SLA 日） | α 一行级改形：payload ①段 `git pull --ff-only sg-bare dev` → `… || true`+备份+重启+三查+**前提验真（河源检出含 P1 A 版迁移器活体验一道）** | 层 1 技术防护 | CTO 自掌窗 |
| 11-15（周日）23:45 前 | patrol 前置 diverging 预检一拍（手工探针：fetch+rev-list 判分叉） | 层 2 人工防护 | COO 排班+COS 协调值席 |
| 11-15 23:50-00:20 | 到岗窗拍频覆盖+diverging 即时人工处置+炸则 runbook §5 补跑 | 层 2 | 值席 |
| 11-14 上午 | 方案稿呈批（COS 中转·CEO 唯一阅面） | 流程 | COS |
| 11-14 午后 | 施工拆树派工（COS+COO 双签·mount-gate authorization.json 先例形）·主窗开工：**告警闸第一优先（2-3 天·不承诺 11-15 前上线·不作应对依赖项）**→run id+payload 终形→F5 顺手窗收尾 | 层 3 结构修复 | COS+COO 树权·CTO 施工 |

## §六 验收锚（synthesis §四照载）

1. run id 三处同串 grep 对表（manifest/commit message/run 目录名）
2. preflight 注入式拦截实锚（DEM-009 同款·告警达 COS 记录）
3. 告警时效 ≤N 分钟（N=30min·对表 CPO-011 发现时延≤2h 同值同源）
4. 零外溢 byte 级同形断言（W 目录/carry-over/commit 形三处）
5. F5 store 真值面 healthz 直读（storePath/logPath 字段）
+COO 三销项锚：F1/F6 告警首拍验收／F4 拦截演练／F5 探针读数；观察期条款：mount-gate 先例 2 周观察+期末三态（本席=技术面裁决 owner）。

## §七 配套五件+考卷随改清单节（方案稿必载·照载+细化）

- **配套五件**：①考卷随改清单（下表）②registry FADE-001 条目「改造后现势」对照段+CPO-011「阶段 1 落地日」读数环 ③RDT 05 稿「改造后现势」段（改造批转正后 RDT 执行）④LG-098 台账轨 COS 全程 ⑤验收锚如上。

**考卷随改清单**（一次改卷制·与件⑥合并同一卷版本一跳·先施工后改卷·改卷即重冻结 paper-maintenance 双 hash 先例）：

| 要点 | T 题号 | 改法 |
|---|---|---|
| run id | T-new1 | run id 三处同串断言（验收锚①考卷化） |
| preflight | T1 扩形 | 触发时点纪律→触发+preflight 双断言（F2 到岗窗断言随改窗口并入候选） |
| 告警闸 | T-new2 | 告警时效 ≤30min 断言（验收锚③考卷化） |
| bash 改形 | T1 判据改 | 一杆全链判→preflight+交棒断言 |
| F5 | T-new3 | store 路径真值断言（healthz storePath 直读） |
| 算周双闸 | T-new4 | 算周断言+对表断言（γ 错周静默双保险考卷化） |
| 件⑥随跳 | 全卷 | 100 分制+F3 免评分母规则·同一版本一跳重冻结 |

## §八 plan skill 语义锚（CPO 件 C 照载）

「这是一周的记录，还是这一周的活——记录随周封存·活随人带走」；产出验收三标准（清单枚举双向断言/不迁清单带判据/carry_over 带状态去向）——后段前置件非本阶段实现·方案稿留锚。

## §九 施工前置验真清单（主窗开工前·河源活体三查）

1. 河源 TriCompany 检出版本≥P1 改点 A 版（`grep _preflight_bare_sync weekly_plane_shift.py` 命中）
2. trirmc-mc.service 单元名+EnvironmentFile 位活体对表（SMTP 凭据注入位）
3. TriMMC 8712 NOTIFY 端点实位活体勘（辅通道端点定形）

## 使用依据

synthesis.md 36bf14a1d（径批正身·五件清单+必载面）/cto-segment.md 957f9a99c（实勘五处·两勘误被采纳）/COS 派工令 2026-11-12T23:34:01+0800/代码实勘（weekly_plane_shift.py L256-289·L346-463/TriRMC src/cron 五文件+deploy/trirmc-mc.service/agent-core job-store.ts L32-34/TriRMC env.ts L31）。

—— CTO 小狄（m-cto·方案稿技术面主笔），2026-11-12 23:36 CST（写前现查 2026-11-12T15:35:35Z=23:35:35+08 原值）
