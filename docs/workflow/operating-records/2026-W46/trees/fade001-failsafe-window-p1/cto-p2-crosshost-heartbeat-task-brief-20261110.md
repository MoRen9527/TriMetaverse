# P2 施工任务书 · 跨宿主冗余心跳（R-HY 8710 cron 隔宿拍探本机 8713·候 CEO 确认生效即行）

- sourceOfTruth: 本件（CTO P2 简案定稿=施工任务书·候选 a 定形）
- syncMode: static（【CEO 22:34 大裁勘止·候 CEO 确认生效】生效即行·有活就干顺序推进——原 COO 排窗字样「周三 11-11 20:00-24:00」勘止·排窗废止令 11-03 重申·BOD 22:35 集散转办）
- lastSyncedAt: 2026-11-10T14:39:03Z（勘止改版·写前现查 22:39:04+08 原值·D-47）
- 令链: CTO 终验 APPROVE（a8af43624）→P2 读数转 COO→COO 排窗裁→本任务书→**CEO 22:34 大裁件一退回勘止**（候 CEO 确认生效·窗字样勘止·改毕回执报 BOD+COS）
- 执行形: FSD 主刀（前置预读已毕+接令回执毕+三标记点裁定毕）+值守位在岗·验收=CTO 终验——【勘止注】开工=CEO 确认生效回执后即行·原「窗开唤醒信」形态随窗令勘止作废

## 一、施工对象与拓扑

**对象**：①本机 schtasks keeper `\bod-dsh-tunnel`（现役 cmdline=`ssh -N -L 18710:127.0.0.1:8712 -o ServerAliveInterval=15 … fleet@47.245.122.61`·探③活体读数）②R-HY 拍探脚本（新增·落 /srv/fleet/ 正身位）③R-HY TriRMC cron 新 job（everyMs 30min 拍）。

**拓扑（候选 a 定形）**：R-HY →(ssh 经 sg)→ sg loopback:**18713** →(keeper `-R` 反向隧道)→ 本机 8713 healthz+tick-latest mtime——本机全停时 R-HY 隔宿兜底探测=LG-014 双跑合同的跨宿主维度（联审 I2 设计落地）。

## 二、改点两件

**改点 A · keeper 加 -R 反向监听（本机侧单点）**：
- keeper 定义加 `-R 18713:127.0.0.1:8713`——**-L 原参与全部 -o 参数零触**（TriMMC 通道保活面）；
- 改定义后**立即 schtasks /run 起新进程**+验三件：18710 监听 pid 换新+ss 验 sg 侧 18713 LISTEN+本机 8713 经 sg 侧二跳 curl 200——**-L 通道中断窗最小化**（重启瞬断秒级自愈）。

**改点 B · R-HY 拍探脚本+cron job（河源侧）**：
- 脚本（python3·<80 行）：ssh 经 sg 拍 `127.0.0.1:18713` 转 8713 `/healthz`+tick-latest mtime 双探→状态文件计数（连续失败 N 拍）；
- **判级窗=08:00-24:00+08 日间**：连续 3 拍（≈1.5h）不可达→SMTP 告警（P1 同通道单址先形）+告警文带分诊提示（「宿主睡眠/停工带先验·判活看 mtime 与电源 evt」——照 05:03 真阳性先例）；**夜间（00:00-08:00）只记状态文件不发告警**（宿主睡眠=合法停摆面·防误报风暴·照 FADE-002 C3 时段过滤原则）；
- cron addJob：schedule everyMs=30min·enabled=1·三查 201（F-3 家族：201+next_run 值面+enabled=1）。

## 三、止损线与坑位

- **止损线**：keeper -L 原参/全部 -o 参数零触·TriMLC 8713/TriRLC 8711 daemon 本体零触·R-HY 四现役 job 零触（含 9c81c7ec）·sg 侧零落盘（18713 仅为监听位）；
- 坑位：①keeper=schtasks Interactive only——改定义后需 /run 显式起（不等 Logon）②root git 操作 sudo -u fleet（若涉 repo 面）③PS→ssh stdin CRLF 剥 \r 族（heredoc 独立跑）④token 零批量窗⑤禁裸杀 keeper 进程（走任务定义改+/run 正形）。

## 四、回滚锚

1. keeper 原定义 xml 导出备份（`schtasks /query /tn bod-dsh-tunnel /xml`·落 /srv/fleet/p2-window-backups/ 同 P1 惯例树外位）——回滚=重建原定义+/run·-L 通道恢复秒级；
2. 拍探 job DELETE 可回（+脚本文件移除）；
3. sg 侧零落盘=零回滚面。

## 五、施工序（七步）

| # | 步 | 门 |
|---|---|---|
| 1 | 前置三断言：keeper 在役形（18710 LISTEN pid）+sg 侧 18713 空闲+R-HY 8710 healthz | 断言绿方动 |
| 2 | keeper xml 导出备份 | 备份件在位 |
| 3 | keeper 定义加 -R 18713+/run 新进程 | 18710 新 pid+sg 侧 18713 LISTEN |
| 4 | 二跳验证：sg 侧 curl 127.0.0.1:18713 → 8713 healthz 200 | 200 读数落卷 |
| 5 | R-HY 拍探脚本落位+cron addJob | 三查 201 绿 |
| 6 | 首拍验收：新 job 手动 POST /run 一次（新施工件验收拍·非 CEO 例外面） | 双探读数+状态文件落位 |
| 7 | 收口：施工卷落树+registry 回写+CTO 终验 | APPROVE 方毕·观察期周四五六三日 |

## 六、验收与观察期

- 窗内验收=首拍活体（§五步 6）+终验四查形（三断言证据/keeper 新定义读数/首拍双探读数/基线对表）；
- 观察期=周四五六三日（COO 节律意图：周日 23:50 迁移轮时心跳在位=回归锚质量最大化）——观察期读数候收（不可达误报/告警触发形/夜间静音形各验）；
- P2 落位第二收益随至=迁移告警双席到箱通道（技术债注② env WEEKLY_SHIFT_NOTIFY_TO 值填两席名·P2 通道毕后补发）。

## 使用依据

COO 排窗裁（2026-11-10T13:39:15Z 原值）/FSD 探勘卷 464764253 §一探③（-L 单向活体读数+三候选）/毕报 §七（倾向候选 a）/CTO 联审分卷 I2（385afbec9）/FADE-002 C3 时段过滤校准原则/05:03 真阳性先例（告警带分诊提示）/P1 窗全案手法（回滚锚树外位·三查形·终验四查形）。

—— CTO 小狄（m-cto·P2 简案定稿），2026-11-10 21:4x CST（写前现查 2026-11-10T13:40:21Z=21:40:21+08 原值）
