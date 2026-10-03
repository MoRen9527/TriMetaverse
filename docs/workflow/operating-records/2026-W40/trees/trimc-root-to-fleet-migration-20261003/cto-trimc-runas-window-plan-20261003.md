# trimc.service root→fleet 准修窗定+重启预案卷（CTO 车道，批C 复核③+⑥）

- sourceOfTruth: 本件（修窗定+重启预案正身；令源=COO 10:0x 批C 复核令 BOD #305 ③⑥）
- syncMode: final
- lastSyncedAt: 2026-10-03 10:22:35 +0800（date 现查贴原值；sg 实勘时点 10:12-10:15 随文标注）
- 裁定席: CTO 小狄（m-cto）；本卷=窗定+预案，施工面候派（SDE 车道候 COO，修毕 ④80 件 chown 由 SDE 接）
- 实锚: sg SSH 只读一轮（10:1x）——unit 面/进程身份/data 属主/job store/NTP daemon/时钟读数

## 一、窗定裁决（批C ③）

- **建议窗=今日 15:00-16:00 北京时间（sg 同区 UTC+8）**，备选=17:00 后。判据：①TriMMC 8710 notify/cron 面低峰（晨窗组单毕+晚间收口批前空档）；②避开 12:00 DEM-001 联审席位注意力窗；③避开 M-SG NOTIFY 高频投递时段。窗长约 30 分钟（含快照+单次 restart+验收+校时顺带）。
- 最终窗点 COO 拍板（本席给窗型与判据）；与 B 件 R 面施工、批A 首序零冲突（异机异面）。

## 二、sg 现态实锚（10:1x 只读勘）

| 项 | 读数 |
|---|---|
| 跑法 | **root 确认**——unit 零 User=/Group= 段（systemctl show 双空），MainPID 3681229 属 root |
| unit 形 | Type=simple，ExecStart=/usr/local/sbin/trimc-start.sh（脚本包装），Requires=docker.service；drop-in 三段 [Service]：TRIMC_CONFIG_DIR=/var/lib/trimc + **HOME=/root**（root 跑法伴随痕） |
| root 属主面 | /var/lib/trimc 全树 root——**find -user root 计数=14080 件**（含 cron/logs 全树；远超 ④「80 件」估计——SDE chown 按 -R 全树口径备料，实数以施工时复勘为准） |
| cron store | /var/lib/trimc/cron/{jobs.json, jobs.json.bak, jobs.json.manual-bak, logs/} |
| NTP daemon | **chrony/systemd-timesyncd/ntp 全 inactive，chronyc/ntpdate 二进制均不在**——钟+20s 漂移成因=无校时 daemon 在役（⑥根因） |
| 时钟读数 | 10:1x 本机与 sg 各自 date 读数比对差≈+20s（与令面一致，施工窗复测） |

## 三、修法预案（SDE 施工单素材）

### 步 1 预改面就绪（零重启动作）

1. 勘 trimc-start.sh 内部：有无 root 硬编码路径/HOME 依赖/git 操作（施工时实勘；脚本若有 root HOME 引用随 User= 切换一并改）。
2. unit drop-in 改法：`systemctl edit trimc.service` 增 `[Service] User=fleet / Group=fleet / Environment=HOME=/home/fleet`（覆盖原 HOME=/root 段）——**禁直接改原 unit 文件**（drop-in 覆盖=可回滚：删 drop-in 即还原）。
3. **前置权限核对**：fleet 用户对 ExecStart 脚本+TRIMC_CONFIG_DIR+程序位（dist/）读执行权——若 /usr/local/sbin/trimc-start.sh 零 fleet 执行位则先 chmod（属主不改）。

### 步 2 快照（回滚锚）

- `cp -a /var/lib/trimc/cron/jobs.json jobs.json.pre-runas-<ts>`（同目录留存）——TriMMC store 持久化 nextRunAtMs，重启后 executor 自 store 恢复；快照=store 异常时回写锚。
- cron-job-state-hygiene 纪律声明：补课只 patch 目标字段，**禁抹 nextRunAtMs**（缺它永不调度）；手动改 state 后 nextRunAtMs 重算。

### 步 3 单次 restart（禁二次重启）

- 前置门=步 1 全就绪+步 2 快照在——**一次 `systemctl restart trimc.service` 完成跑法切换**；禁窗内反复 restart（纪律适用）。
- restart 失败（fleet 起不来）fallback=删 drop-in+restart 还原 root 跑法（一次还原动作计入预案，非「二次重启」违例——还原属回滚锚行使）；还原毕另勘原因再排窗。

### 步 4 验收锚（D-04 三层）

| 层 | 锚 |
|---|---|
| 辅锚 1 | `systemctl show trimc.service` MainPID 属主=fleet+healthz 200（8710） |
| 辅锚 2 | cron store 面：jobs.json 完整（job 数与快照对表）+executor tick 活（logs/ 新增行时戳>restart 时点） |
| **主锚** | **notify 链端到端**：TriMMC /internal/v1/notify 投递→TriMLC 8713 poller 拾取（或 face-events 侧 ok 读数）——进程内生效真值，非仅进程活 |
| 补课预案 | 逐 job nextRunAtMs 对表快照；缺失/漂移者依快照回写（只 patch 目标字段）；九件补课=以 jobs.json 快照内现役 job 清单为准（施工时清点） |

### 步 5 ④80 件 chown 交接（SDE 接，顺序纪律）

- **顺序=③修毕④后行**：User=fleet 生效后 trimc 新写件即 fleet 属主——此窗后 chown -R fleet:fleet /var/lib/trimc 一次过→`find /var/lib/trimc -user root | wc -l`=0 清零断言（一次性稳定，防 root 新写件再生污染断言）。
- 14080 件实勘数供 SDE 备料（chown -R 全树口径，非逐件 80）。

### 步 6 ⑥校时顺带（同窗，零 trimc 重启）

- 根因=sg 无校时 daemon。修法两分支：**首选=systemd-timesyncd 启用**（systemd 内建零新包：`timedatectl set-ntp true`+`systemctl enable --now systemd-timesyncd`）——sg 发行版若无内建（施工时 `systemctl status systemd-timesyncd` 勘），备选=apt/yum 装 chrony（**装包=新依赖引入，候 COO 一次性准**）。
- 验收=`timedatectl` NTP synchronized=yes+时钟差收敛读数（对表本机 date，±1s 内）。
- 校时动作在 trimc restart **后**执行（时间跳变不干扰本轮 restart 验收读数）。

## 四、风险与缓解

| 风险 | 缓解 |
|---|---|
| fleet 权限不足起不来 | 步 1.3 前置 chmod 核对；fallback=drop-in 删除还原（一次还原动作预案内） |
| store/写路径权限（fleet 写 /var/lib/trimc） | 现态全树 root 属主=**fleet 起初不可写**！——修正：restart 前**须先 chown 数据面**（/var/lib/trimc 归 fleet）或至少 cron/config 写位——**顺序修订：chown 数据面 →restart→验收→全树 chown 复扫清零断言（④收尾）**；否则首次写即 EACCES 崩 |
| notify/cron 链短暂中断 | restart 秒级+poller 60s 自愈；低峰窗影响面小；主锚验收=链恢复真值 |
| HOME=/root 残留引用 | 步 1.1 脚本实勘+drop-in HOME=/home/fleet 覆盖；git 身份面随 HOME 归 fleet=根治 root 属主再生 |
| 时钟跳变干扰验收 | 校时排 restart 后 |

> **步 5 顺序修订要义（施工单显式化）**：原令序「③修毕 SDE 接 ④chown」隐含「chown 全部后行」——但 fleet 进程需要数据面**先可写**才能起：正确序=「数据面 chown（/var/lib/trimc 整树一次过）→restart→验收→find 清零断言」——chown 与 restart 同窗衔接（数据面 chown 后至 restart 前的 root 进程写窗=秒级可接受；如求零窗口可 restart stop→chown→start，同属单次停起纪律）。

## 使用依据

- COO 10:0x 批C 复核令（BOD #305 ③⑥）；cron-job-state-hygiene 纪律（memory+册）；D-04 完工判据；禁二次重启纪律
- sg 实勘（10:1x SSH 只读）：systemctl cat/show trimc.service+ps 属主+find -user root 计数 14080+cron store 面清单+is-active 三 NTP daemon+chronyc/ntpdate which 双空+date 读数
- 关联在案：trimc cron 日志 token 嵌 header+root 身份 git 操作教训（memory 2026-10-02）；TriMMC addJob 即生效族（executor.tick 实勘 09-30）
