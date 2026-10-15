# SDE 毕报卷 · 8711 obs 出向启用窗（白名单①勘修窗·TD-obs-1 案 B 落地）

- sourceOfTruth: 本卷（trees/mc-link-verify-20261014/reports/sde-8711-obs-enable-window-20261015.md）
- syncMode: static（毕报留档卷·令源=COO 09:12:07 窗令（M-004 直达·BOD 09:09 晨令唯一留窗件·窗 09:40-10:10）+COO 09:22:38 三自裁全认+CTO 09:31:27 技术评审过）
- lastSyncedAt: 2026-10-15 09:43:00+08:00（date 现查原值）
- 执行席: SDE 小布（m-sde）；对象=本机 TriRLC 8711；毕报=COS 链+COO+CTO 知会；卡③收口附本树指针

## 窗前勘验四发现（09:14-09:23·零停摆写面只备份）

| # | 发现 | 读数 | 处置 |
| --- | --- | --- | --- |
| 1 | env 名勘定（禁猜名令） | `TRIMC_NOTIFY_SG_URL`/`TRIMC_NOTIFY_SG_TOKEN`（src/config/env.ts L169-170·注释自证「空串=告警禁用」·与 8713 同名同构·TriRLC 侧无 TARGET_SEAT/SEATS_FILE 两键） | 只涉两键 |
| 2 | **令文「补行」前提与活体差异** | NOTIFY 两行已在 trirlc-daemon.env（mtime 10-14 11:03=TD-obs-1 勘报前公网直连初始施工）·URL 现值=`http://47.245.122.61:8710`（sg 公网直连形·勘报已定性死路·实测 HTTP=000 超时）·token 与 8713 DIFF（md5h 302988aa≠ebfb2736·零回显对比法） | 施工实质=**改值对齐**（授权链完整：勘报→COO 令）·COO/CTO 双认 |
| 3 | 落点层 D-15 判断 | cmd=thin shim（头注自证「Secrets live in trirlc-daemon.env」）·ps1=非密 pin 层（policy「contains NO token values」）·env file=唯一 secrets 位（boot 经 TRILC_ENV_FILE 载入·loadEnvFileFallback 全键解析+`split(/\r?\n/)` CRLF 兼容+**不覆盖已存在 env**·ps1 无同名 pin 无压制） | env file 两行改值·**cmd/ps1 零触碰**（双认） |
| 4 | 终验探针正形 | Windows 无他进程 env 直读原生工具面（WMI 无 env·StartInfo 系坑）·TriRLC 无 notify 投影端点（config/show 只投 key cache 面） | 组合证代（双认·证据等级如实标注） |

- 窗前备料：两 .bak 回滚锚（trirlc-daemon.ps1/.env.bak-pre-obs-enable-20261015·冷起失败即还原回禁用态）；pid 基线 pidfile=listen=23780 ✓；改值/复演两脚本预写+%TEMP% 干跑（replay 对坏值态预期 FAIL 证解析器在工作·10 keys 出·旧值逐字合勘验）；18710 keeper 口活（HTTP 404/0.17s=TCP+HTTP 栈在）。

## 执行段（09:39:59 窗准点开链）

| 步 | 动作 | 读数 | 自检 |
| --- | --- | --- | --- |
| 1 | env file 两行改值（node 脚本·8713 token 抽取→md5h 门→内存全量替换→单次写回） | URL→`http://127.0.0.1:18710`·token md5h=ebfb2736 对平 8713 ✓·CRLF=10/bareLF=0 行尾保真 | ✓ |
| 2 | 同款载入复演（daemon 同款 parser 逐字复刻·终验组合证②） | 10 keys 载出·URL/TOKEN 双键=目标值·REPLAY OK | ✓ |
| 3 | Disable TriRLC-Watchdog | State=Disabled ✓ | ✓ |
| 4 | POST /shutdown（token=trirlc-daemon.env TRILC_INTERNAL_TOKEN·变量化零回显） | 200 shutting down ✓ | ✓ |
| 5 | port FREE 轮询 | 09:40:31 poll#1 ✓ | ✓ |
| 6 | Start-ScheduledTask `TriRLC Daemon` 冷启+healthz 轮询 | UP 09:40:41（poll#1）uptime 0→10 | ✓ |
| 7 | 三断言 | listen=22900==pidfile ✓·CIM start=09:40:38 ✓ | ✓ |

- 停摆实测≈10s（FREE 09:40:31→UP 09:40:41·窗令预期 18s 内）。

## 终验段（组合证四件·「进程内生效验证非 healthz 绿」锚）

| 证 | 内容 | 读数 | 判 |
| --- | --- | --- | --- |
| ①值面对 | env file 改后值面（token 只 md5h） | URL=18710+md5h=ebfb2736（①静态链证） | ✓ |
| ②载入复演 | 同文件同解析器确定性 | REPLAY OK（boot 必然同值） | ✓ |
| ③新 uptime 段计数面 | healthz mc 段七字段（**notifyFailures/alarmSent 计数面在位**·CTO 条件探针形态成立） | 首读 09:40:4x→65s 防抖终读 09:42:1x 同形：`{"link":"connected","totalFailures":0,…,"degradedFailures":0,"alarmSent":false,"notifyFailures":0}`·totalFailures 归零=卡④新段起点（护栏②·前段累计 12 录档） | ✓ |
| ④出向链活探针 | 18710 错 token 门探针（假值构造·零真值·D-46） | **HTTP=401/0.16s**=应用层鉴权响应——请求穿过 keeper 隧道达 sg 8712 token 门（较昨日 TCP 层瞬拒/超时强一层级·出向链活直接证据） | ✓ |

- notifyFailures 行为面读数：现值 0=零触发态（真实出向候 degraded 触发·窗内不制造不加码·CTO 条件形态照办）。
- 步7 Enable TriRLC-Watchdog：State=Ready ✓（watchdog.log 旁证位未勘·递归搜超时放弃·非毕锚要件如实记）。

## 注记

- pid 代际更替如实记：窗前基线 23780（与昨晚毕报 32576 不同代·uptime 段连续吻合昨晚 21:28 起·代际更替原因未勘不阻窗）→本窗毕 22900。
- 临时脚本两件（%TEMP%\obs-enable-patch.mjs/obs-env-replay.mjs）用毕删除；token 真值全程零进命令行/日志/卷（md5h 对比法）。
- 回滚通道：两 .bak 还原+冷启即回禁用态（URL 空串=告警禁用·现役态零损）。

## 使用依据

- COO 窗令（09:12:07）+窗前简报三自裁双认（COO 09:22:38/CTO 09:31:27）；TD-obs-1 勘报（昨 21:50·案 B 隧道形=本窗落地）；D-23 v3 白名单①窗
- 活体读数：TriRLC src（env.ts/app.ts/key-cache.ts）·8711 healthz/shutdown（token 门零回显）·18710 假 token 探针·schtasks/CIM·trirlc-daemon.env（md5h 面）
- 记忆条：trilc-daemon-restart-discipline（正形链+三断言）/value-face-never-print-path/trimmc-mlc-addjob-divergence（三 daemon 分野勿互套——TriRLC notify 计数面独立核验不推定）/cmd-batch-crlf-preservation（CRLF 保真断言）
