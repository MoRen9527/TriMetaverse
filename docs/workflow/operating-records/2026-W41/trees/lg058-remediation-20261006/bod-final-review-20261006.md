# BOD 终复核卷 · LG-058 R-HY 升版全链（含本体重启缺陷闭合）

- sourceOfTruth: 本件（BOD 终复核裁定正身；随读数链呈 CEO 终验）
- syncMode: 快照件
- lastSyncedAt: 2026-10-06T13:54+0800（date 现查 13:52 星期二，落卷 13:54）
- 复核对象: SDE 读数卷 310c8561（含 §二.7 闭合段，commit 470cccf1）+ CTO 追认卷 89c1bb46 + STE 序④卷 b0e9d467（含增补段，commit 595cbc06）
- 复核方式: 三卷采认 + BOD 两轮独立活体抽验（13:45 发现疑点 → 13:49 验闭终态）

## 一、终复核裁定：PASS（升版有效，终态闭合，候 CEO 终验）

五环读数全✅ + CTO 追认在卷 + STE 序④独立复验零矛盾 + BOD 独立抽验发现的一处部署半程疏漏已闭合——LG-058 R-HY 升版全链终态成立。

## 二、BOD 独立抽验两轮（本卷核心增量）

| 轮 | 时点 | 动作与发现 |
| --- | --- | --- |
| 第一轮 | 13:45 | 活体抽验：trirmc 本体 ActiveEnterTimestamp 仍=10-05 23:18:35（未重启），与读数卷「双 unit 重启」表述矛盾；dist 已换 a02d89b 而 node 进程不热加载——13:46 问实 SDE/STE，明示疑点闭合前不呈 CEO |
| 定谳 | 13:46-13:48 | **非设计内**——SDE 认领系 stage2 环B 脚本 stop/start 清单漏本体（实锚：脚本 L84/L89/L100-112 只碰 trirmc-mc+trimodel；两 unit 同 ExecStart 同 WorkingDirectory 同 dist，仅 env/端口差异）；STE 独立补验同结论；补重启 13:46:38 由 SDE 依 BOD 令执行（pid 2019007→2064924，systemd 正形） |
| 第二轮 | 13:49 | 独立复验终态：本体 MainPID=2064924 ActiveEnter=13:46:38；journal loaded cached→pulled fresh config (2 providers)=本体新 dist 拉取链活体绿；13:40-13:46:38 窗 trirmc 单元 journal 零条目（部署窗本体确未动，与第一轮互证） |

**终态三进程全在役新 dist**：trimodel 13:25:43／trirmc-mc 13:25:47／trirmc 本体 13:46:38。

## 三、缺陷定性（升版有效性不受损）

- **性质**：部署半程缺陷（restart 清单枚举不全），非升版内容缺陷（dist 内容 a02d89b 无涉，CTO 追认行为等价三重自证在卷）。
- **影响窗**：13:25:47→13:46:38 本体旧映像 ~21 分钟；期间本体拉取链照常（旧进程 15min refresh 序列在卷）、类型修零行为差、零行为故障——不构成升版有效性质疑。
- **探针盲区如实入卷**：环C 值面探针面=TriModel 3333+trirmc-mc 8710，环E journalctl 仅 -u trirmc-mc——本体 8712 进程面三卷均未覆盖。STE 自领序④环3 缺口（active≠重启，只验 active 未验起动时戳）；SDE 自领探针面盲区。两自领笔随卷候 CAO 并档。

## 四、教训铸条候 CAO（候 D-44 或与 D-43 同批）

1. **多 unit 消费同一 dist 的部署纪律**：部署脚本 stop/start 清单须枚举全部消费该 dist 的 unit（按 ExecStart/WorkingDirectory 对表枚举，非按端口想当然）；完工判据必含「ExecMainStartTimestamp＞部署时点」，禁以 is-active 代重启验证。（STE/SDE 双自领在卷）
2. **token 值面回显三案并档**（同 10-02 channel.cmd 族，操作瑕疵非安全事故、零外发、同盘同权限面增量≈零，不提前轮换口径沿用）：①SDE TRIRMC_INTERNAL_TOKEN（探针回显）②STE provider keys 两枚（entries_decrypted 整 dict 回显，BOD 已裁定性）③SDE TRIMC_INTERNAL_TOKEN（systemctl cat 未滤 Environment 值面，13:48 自报）——候 CAO 攒批并档同口径定性。

## 五、观察项采认（不阻链，随卷）

- SDE 卷观察项四条：①锚脚本指纹路径笔误（已勘，回滚路径不依赖该指纹）②trirmc-mc cron enabled=false 系设计（cron 归本体主实例）③bundle 备援缺失（候办：下次构建环补或裁撤）④演练 backups 路径形勘误（不影响回滚链实证）。
- 卷面观察项三条：跨机 ssh 读闪烁 P2（候 CTO/网络面勘）／TriMMC addJob 字形三形态分野再+1／N2 演练 rlc 卡候建态如实 skip。

## 六、候 CEO 终验与现势注

- **亲测**：http://8.155.54.79:3333/ui 逐条对九条打回面（N1 拉取状态卡／N3 来源二分／N4 文案／N5 三件／R 面双卡切换与备份回滚）。
- **sha 变更点**（升版对象显式管理）：TriModel 161d0ca→45757bd；TriRMC 496613b→99806cf→**a02d89b**（末笔源码车道类型修，COO 类推准裁+BOD 采认+CTO 事后追认 89c1bb46）。
- **CEO 亲测收尾三件**：`Temp\rhy-trimodel-tokens.txt` 销毁／安全组放行规则撤（CEO 控制台）／隧道已收✓。
- **候解锁**：M 面两卡（TriMMC/TriMLC 切换）维持候建文字态（CEO 03:10 令暂缓，候解锁令）；TriRLC 卡候建态（R-HY 无 trirlc-card.json，与 N2 演练 SKIP 互证）。

## 使用依据

- CEO 08:17 令「N5 毕了升版走服务域流水线，全链读数落完呈我」；任务书 task-charter-lg058-remediation-20261006.md（384000f5）
- 三卷：310c8561（含 §二.7）/ 89c1bb46 / b0e9d467（含 595cbc06 增补）；BOD 问实信 13:46 与 SDE/STE 回执 13:48
- BOD 独立探针读数两轮（本卷 §二，ssh 活体现探非转抄）
