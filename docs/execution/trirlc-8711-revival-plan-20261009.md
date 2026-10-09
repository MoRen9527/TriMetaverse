# TriRLC 8711 复活方案稿（R 面 trilc-headless.service 恢复性两步）

- sourceOfTruth: 本件（docs/execution/trirlc-8711-revival-plan-20261009.md）
- syncMode: final（BOD 认账 PASS·11:19 回信三点批注收编）
- lastSyncedAt: 2026-10-09T11:20:11+08:00（date 现查原值）
- 死因考古身: 本件 §一（河源活体现探 11:01-11:05·root 通道只读）
- 并窗件: 本机 8713 结构修稿（trimlc-daemon-hardening-plan-20261009.md·同族 daemon 形态治理对照）；与 R-HY 401 pull_denied 同域不同因（401=token 门，本件=unit 停用）

## 一、死因与现态（考古实锚·含 BOD 件③表述勘正）

### 死亡实锚

| # | 证据 | 读数 |
| --- | --- | --- |
| 1 | journalctl -u trilc-headless 终段 | **2026-10-01 10:42:07 收 SIGTERM 优雅停机**（systemd Stopping→Deactivated successfully→Stopped·累计 CPU 8min29s）——unit 级有意停机，非崩溃非 OOM |
| 2 | unit 现态 | `trilc-headless.service` **文件在位但 disabled**（list-unit-files: disabled/vendor-preset enabled） |
| 3 | 存活史 | 死前正常运行至 10-01 10:42（heartbeat/reaper/cron 引擎日志连续）；store wal 最后写入 09-13（cron 面后期低活跃） |

### 死因判定：10-01 人工 stop+disable 波及+10-04 修复轮漏网

与既录事实吻合：10-04 夜 TriRMC executor 停摆勘定「trirmc.service 人工 stop+disabled 三日·BOD 补跑修复」——**同一波 R 面人工停用操作**（10-01 起）停了 trirmc 也停了 trilc-headless；BOD 10-04 补跑恢复 trirmc（现役 active），**trilc-headless 被修复轮漏掉**=8711 死态至今。非「无保活设计」——unit 定义 Restart=always 保活在位，随 disable 失效。

### BOD 件③表述勘正

「无进程无 unit 无保活」→ 勘正为「**无进程+unit 在但 disabled+保活定义在但随 disable 失效**」——复活性质=**恢复性两步，非新部署**（风险面大幅低于新装）。

## 二、复活方案：enable+start 原样拉起（恢复语义）

### P0 对象身份断言（施工第一动作·BOD 批注①收编——daemon 名近亲防错）

```bash
# 施工对象逐字=trilc-headless.service（TriRLC 8711·R 面本地域）
# 近亲防错对照：trirmc(.service)=TriRMC 8712 服务域【禁动】/trimlc=本机 TriMLC 8713【不在本机】/trimmc=sg TriMMC【不在本机】
systemctl cat trilc-headless.service | grep Description
# EXPECTED: Description=TriRLC Headless Execution Node (R-side autonomy rmc-autonomy-001)
# 非 TriRMC 非 TriMLC 非 TriMMC 字样→对象错即全停（BOD 10-04 补跑「恢复 trirmc 漏 trilc-headless」即本族混淆实证）
```

### 施工序（断言过才动手）

```bash
# 河源 root 通道（窗内施工形）
systemctl enable trilc-headless.service   # 恢复开机自启=保活语义复位
systemctl start trilc-headless.service    # 拉起（After=trirmc.service 依赖已满足）
```

| 项 | 裁量 | 依据 |
| --- | --- | --- |
| **dist 原样不动** | 复活拉起现役 dist/cli.js（mtime 08-27·version 1.0.0·死前原样跑了 38 天）——**复活≠升级分离**：仓顶 ff2f970 与 dist 的版本差挂升级候办另排（build+重启单独窗），不混入复活窗 | 改动最小面纪律；恢复语义=回到 10-01 前原状 |
| **unit 零改动** | 定义健康（Restart=always/RestartSec=5/MemoryMax=700M/fleet 身份/EnvironmentFile 齐）——不修不重写 | 实勘 §一 |
| **.env 零改动** | 七键齐（ANTHROPIC 三键/TRIMC 两键/TRILC_DATA_DIR/TRILC_INTERNAL_TOKEN·键名面实勘值面未触） | 启动依赖完整 |
| **git dubious ownership 不处理** | root 视角看 fleet 仓报 dubious=已知坑；复活不经 git 面，无需 safe.directory 豁免 | 已知坑记忆条 |

## 三、门判据（V1-V4）

| 门 | 判据 | 验形 |
| --- | --- | --- |
| V1 | start 后 healthz 绿：8711 监听在（ss）+pid 活+进程身份 fleet+**systemd Restart 计数=0**（NRestarts 读数——Restart=always 会掩蔽反复崩，计数非零=升报不滑步） | curl+systemctl show 双读数贴毕报 |
| V2 | store 存量值面：cron.db job 清单实读（河源无 sqlite3 CLI→node 一行式只读或本机拉档离线读）与 09-13 前基线对表——**job 存量数如实记**（死 8 天期间零写入，存量应=死前原样）；**过期 job 触发面裁口=BOD 面随三栏窗令裁**（BOD 批注②收编） | 只读贴毕报 |
| V3 | **F-3 家族纪律（TriRLC 8711 同源缺陷现役在册）**：复活后任何新建 cron job，POST 201 后必验 next_run_at 值面（sqlite 只读），空则 PATCH {schedule} 同值触发 recompute 补值（API 正途禁手写库）——复活窗内做一次活体验证（临时 job POST→验 next_run_at→DELETE） | 活体探针贴毕报 |
| V4 | 72h 观察窗：零意外 restart（NRestarts 恒 0）+cron 滚动痕迹（store/logs 或 journal heartbeat 节拍）——10-14 收口巡检 | 巡检贴毕报·挂 BOD 认账 |

## 四、回滚姿态

`systemctl stop+disable trilc-headless.service` 两步回死态（=现态原样）——回滚链零残留（enable 的 symlink 一并 disable 移除）。回滚判据=V1 任一 fail 或窗内异常。

## 五、风险与缓解

| 风险 | 缓解 |
| --- | --- |
| dist 38 天旧+仓顶漂移（ff2f970 等近期提交未 build） | 恢复语义下可接受（死前同版跑了 38 天）；升级候办另排窗；V1 异常即回滚 |
| Restart=always 掩蔽反复崩 | V1 内含 NRestarts=0 断言+V4 观察窗盯计数 |
| store 8 天死档含过期 job（复活即触发误跑） | V2 先盘点存量 schedule/next_run——**发现 next_run_at 已过期 job 先如实报候裁再定触发面**（默认不动存量，触发面=job 属主面裁量） |
| 8711 端口/身份面残留（死前消费者重连） | After=trirmc 序健康；消费者面（心跳/夜航）复活后自动回对——V4 观察窗验证 |
| 与 TriRMC 8712 互作（同机双 daemon） | 8712 现役独立 active；8711=本地域（TriRLC）8712=服务域（TriRMC）角色不同端口不同，零互斥面 |

## 六、窗位与分工

- 窗位：10-11 周日窗族 **R1 段**（与 sg 段 TriMMC 部署/本机段 8713 结构修三栏分机分带）·正式排定候 COO。
- 施工位：河源可达席（值席/BOD 通道 root 形）·复核位：CTO·认账：BOD。
- 升级候办（不入本窗）：①仓顶→dist build 追平+重启（单独窗）②R-HY 401 pull_denied（token 门·同域另因）③TriRLC cron addJob F-3 缺陷根治（与 TriMLC 修复同族对表）。

## 使用依据

- 河源活体现探 2026-10-09 11:01-11:05（root 通道只读：journalctl/unit 定义/unit-files 现态/.env 键名/dist mtime/version.json/store 目录面/NRestarts 面）
- BOD 09:38 四件转域信件③（8711 死态候排窗复活·与 R-HY 401 同域）
- trilc-daemon-restart-discipline（daemon 操作纪律）·trimmc-mlc-addjob-divergence（F-3 家族三形态与 V3 正途）·10-04 TriRMC 修复既录事实（死因吻合链）
- 本机 8713 结构修稿（同族治理对照·trimlc-daemon-hardening-plan-20261009.md）
