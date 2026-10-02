# TRIMC_INTERNAL_TOKEN 轮换工序单（runbook）·候审版

- sourceOfTruth: 本件=COS 铸（2026-09-30 22:2x+0800 date 现查 22:22；令源=CEO 22:19 批令「轮换提请，批」经 BOD #157 转录；执行窗=BOD 裁 10-01 夜窗 18-24 批首件；本件=明早哨窗随件呈 BOD 审的工序正形）
- syncMode: static（**三裁后版** 10-01 12:0x——BOD 裁 A-a/A-b/B 已落正文 [§一勘正+§三·补联动序+机位前缀全文自勘]，候审点 1-4 维持候哨窗审；18:00 窗令执行以本版为准）
- 驻留面清单真源: CTO 8710 审计卷 §六.4 五处全录（2a4f46cf）；泄露事件两起=09-30 BOD 自报案+CTO 载录案（同值无新增泄露面，双席定性在卷）
- 〔10-01 06:1x 对表定谳增注（BOD 本机面自勘毕，令面转录）〕**五处驻留面全部实锚**（sg 3 处+本机 channel.cmd 双键 L10/L14）；本机双键指纹 d2cd…e075 与 sg 三处**全同值**——「同值双键一并换」前提成立✓；transcript 面溢出处置=轮换后旧值自然失效不另动作（历史冻结纪律不冲突）。工序面按 §二/§三 原案执行不变。
- 〔10-01 12:00 范围扩展增注（COO M2 正式判定令 11:59 窗首落判同步）〕**今晚轮换范围扩展：TRILC_INTERNAL_TOKEN（8713 门令）纳入轮换**——与 §一「不换 TRILC_INTERNAL_TOKEN」边界直接矛盾，**不静默改 §一，矛盾显式标记候 BOD 审裁**（§六 候审点 5）；扩展触发背景=8713 段内重启窗在今晚 F-3 段，门令轮换搭同窗冷起零额外重启成本。TRILC 侧新值落位与冷起联动序（F-3 修复重启窗先修缺陷后换令 vs 换令搭 F-3 重启一次完成）候 BOD/COO 窗内裁。另：§三 工序 0「sg 8712 在役」基线复测对象与判定令拓扑注记「8711/8712 退役」存表述冲突，端口对象候 BOD 勘正。〔12:0x 裁落注〕BOD 三裁毕：候审点 5 已裁（TRILC 纳入轮换，§三·补 联动序正形）；工序 0「sg 8712 在役」本身正确勿改——退役的是河源 8712（sg 8712=TriMMC 主控 9 job 绿）；裁 B 机位前缀纪律（8710/8711/8712 三端口 sg/河源/本机两机位同号，禁裸写端口号）本单全文自勘落笔。
- 署名: cos（COS/小贾）
- 〔10-02 00:1x FSD 预勘增注（COO 并档，来源=fsd-chain-precheck-readout-20261002.md 2a04d559）〕①**执行窗顺延**：10-01 夜窗 A 段未执行（窗尾时点+SDE 落位回执门双卡如实申报，零压缩零抢跑），顺延 **10-02 夜窗 18-24**（COO 排程确认 00:1x，§五执行案为准）。②**第 6 驻留面（五处清单外）**：`D:\Code\ai\.env` 含 `TRIMC_NOTIFY_SG_TOKEN` 键（TRILC_ENV_FILE 经 channel.cmd L17 挂链）——工序 1 落位点扩「channel.cmd 双键 L10/L14+.env 同族键」**三处**，值面指纹（是否同 d2cd 值）候执行窗机内比对。③**新值集合数建议两套**（A=TRIMC 族一套/B=TRILC 独立一套，依据=门面独立性+维护批③ 8711 另配令+泄露半径收敛，卷 §三.5）——**技术方案面候 CTO 追认，不阻塞窗令组文**。④**F-3 版本差勘正**：Part A 已在役（TriMLC HEAD=0fd9c6f，09-30 缺陷批+CTO 验收卷在案+hub-silent-detect 94 轮活证），稿面「dev 含同款缺陷/存量六 job 全死」两前提不成立（勘源=sg clone @99d8466 滞后态）；五步探针照跑不误（⓹ 六 job 复活断言=现值即满足的正式化）；维护批①（mirror 移植）实锚=0fd9c6f 本体随卷销项；Part B（service.ts +17 行自愈）已成未提交，候冷起窗 commit+check+build 随手带出（COO ④「随窗顺手」支）。⑤**冷起触发前置不变**：SDE item1 落位四环回执（COO 23:41 联动序标记，BOD 已直告本机执行席 COS+20 分钟无回执升级条款）。
- 〔10-02 18:5x sg 段执行读数增注（COO 并档，来源=BOD root 链全毕回执 18:5x）〕sg 段全绿毕：①token sg 侧落点 PATCH 形验过（TriMMC/.env+TriMC/.env+override.conf+fleet internal-token；门三态 无令 401/新令 200/旧令 401 全绿）②trimc+trimodel-proxy 双 active 各单次重启③**工序 4 空集销项**：jobs.json 正身=`/var/lib/trimc/cron/`（TRIMC_CONFIG_DIR 活体 fd 反推），9 job command 零嵌 token（走活体 env）无需 PATCH④TriMLC clone=origin/dev **a66b3b2** 同顶（零手工补丁；F-3 Part B 随 clone 就位）⑤路由键顺录（TRIMC_TRIMODEL_API_URL=https://8.155.54.79+NODE_EXTRA_CA_CERTS pem 在位）=落点二择一裁素材。过程坑：token 暂存件 Windows 侧 CRLF 粘 \r 首探 401→剥 \r 后 200（行尾族第三型实锚，候 CAO 纪律条）。疑点裁落：**override.conf 挂 trimmc.service 空壳（unit 本体不存在）无效却持新值——COO 裁删**（rm+daemon-reload 免重启+门双态复测闭）。/tmp 暂存 shred 零留。
- 〔10-02 18:57 精化注（COO 勘正自 18:5x 条两件混述，来源=BOD B 项闭+一请素材实录）〕被删者=**trimmc.service.d/override.conf 孤儿件**（连目录 rmdir 净）；**在役侧 trimc.service.d/override.conf 存续**（root 链内锚修正 trimmc→trimc 后成，=trimc 五 drop-in 之一，Environment=TRIMC_INTERNAL_TOKEN= 单行形，本次 token PATCH 位）与 docker/.env（trimc-start.sh source，非 EnvironmentFile= 行）**双源并存**——双源重复注入形态收敛仍归 CTO 维护窗（§一 形态边界不变，本次仅清孤儿件）。门双态复测绿系运行进程 env 未重启存续所致，非删除安全性之证——删除安全性之证=孤儿路径定位+systemctl cat 现势五件实录。**单元命名正名（后续 root 链操作者基准）**：trimc.service（在役 8712）/trimmc.service（不存在，壳已清）/trimodel-proxy.service（3334）。#234 落账毕（origin 双 URL ls-remote=7c2acad1）；过程坑第二件=append 脚本 open-w 清空自伤 git 秒恢复（并档）。

## 一、对象与边界

**换什么**：`TRIMC_INTERNAL_TOKEN`（=TriMMC /internal 门令；本机 `TRIMC_NOTIFY_SG_TOKEN` 与之**同值双键**，一并换）；**`TRILC_INTERNAL_TOKEN`（本机 8713 门令，10-01 12:0x BOD 裁 A-a 纳入今晚轮换，原「不换」文本作废；值=TRIRMC_INTERNAL_TOKEN 同值〔BOD 原录〕，与 TRIMC 族值关系候值席勘验对表；sha8 38731fd9 commit 面已露出该值，轮换即覆盖闭环）**。
**不换什么**：`TRIMODEL_API_TOKEN`（另一族）；河源面 `TRIRMC_INTERNAL_TOKEN` 是否随本轮换=候值席消费方勘验结果+窗令裁（同值牵涉，防断链勘验前置）。
**形态边界**：本单只**换值**不消形态——「在役 job command 内嵌 token」「sg .env+unit drop-in 双源重复注入」两个结构性形态收敛**不在本单**（候维护窗另案，CTO 观察项在卷）；换值后新值仍以内嵌/双源形态存在，如实声明。
**溢出面**（transcript 溢出两起）：历史 transcript 不改写（历史冻结纪律）；换值即令溢出值作废，此为唯一处置。

## 二、新值生成法（零出机）

- 生成位=**本机侧**（Windows PowerShell，.NET RNG）：
  `$b=[byte[]]::new(32);[Security.Cryptography.RandomNumberGenerator]::Fill($b);($b|ForEach-Object{$_.ToString('x2')})-join ''`
  → 64 hex 字符，与现行值形态一致。
- 新值**全程变量/管道流**：生成即存变量→直写本机 channel.cmd 双键→经 ssh stdin 管道写入 sg 两处——**禁落**消息面/SendMessage/transcript/命令行参数/任何落盘中间件（不留明文 bak 之外的暂存件）。
- 已验通道形态：BOD 09-30 复跑「token 管道流注入零出机零回显」实证在卷（#129）。

## 三、执行序（10-01 夜窗 18-24 批首件；sg 侧=BOD root 代执链，本机侧=COS 自执）

| # | 工序 | 面 | 要点 |
|---|---|---|---|
| 0 | 前置核验 | 双面 | sg 8712 在役（无令 401+带令 200 基线复测）；本机 8713 mc_link=connected 基线；18710 隧道活；**回滚锚就位**（见 §五） |
| 1 | 新值生成+本机双键落 | 本机 | §二 生成→channel.cmd `TRIMC_INTERNAL_TOKEN` 与 `TRIMC_NOTIFY_SG_TOKEN` **双键同值**替换（现 L10/L14 两行）；替换后 `findstr` 验四特征：行在/值长 64/两键同值/旧值零残留（旧值比对用变量禁回显） |
| 2 | sg .env 真源写入 | sg(root) | 新值经 `ssh fleet@47.245.122.61 "cat > /path/.env.tmp"` stdin 管道注入→root 原子替换 .env 对应行→`grep -c` 值面验证（行计数不回显值）→tmp 清除。**防 PS→ssh stdin CRLF 坑**：管道侧统一 LF 或落 sg 后 `sed -i 's/\r$//'` |
| 3 | sg unit drop-in 同步+restart | sg(root) | drop-in Environment= 行同值替换→`systemctl daemon-reload`→`systemctl restart trimmc`→`systemctl show trimmc -p Environment` 计数验证+`curl 127.0.0.1:8712` 无令 401（旧值已废=401 正形）/新值带令 200（值经 sg 机内变量注入 curl 头，零回显） |
| 4 | 在役 job command 内嵌全扫 PATCH | sg(root)/API | TriMMC cron store **job JSON 值面全文扫描**含旧值的 command 字段（逐 job 全扫禁抽样）→逐 job API PATCH command 字段换新值（**TriMMC addJob/patch 即生效零重启，command 字段 PATCH 合法性候 BOD 审裁注**）→PATCH 后重扫=旧值零命中断言 |
| 5 | 本机 8713 冷起 | 本机 | 带令 shutdown（X-Internal-Token 401 门已勘明）→正规冷起=`Start-Process cmd -ArgumentList '/c','"C:\Users\jedih\AppData\Local\trimlc-daemon-channel.cmd"' -WindowStyle Hidden`（**禁猜路径禁 SilentlyContinue 吞错，先 Test-Path**）→healthz `mc_link=connected`+`trimc` 双字段断言（判据=app.ts L1685 connected 铁门，uptime 短不误判） |
| 6 | 端到端试信复验闭环 | 双面 | POST `/internal/v1/notify` 经 18710 隧道（targets=bod）→sg outbox→8713 puller 拉→delivered；计时锚（对照今夜 15 秒闭环基线） |
| 7 | 旧值失效终断言 | 双面 | 旧值作 curl 头打 8712 带**旧**令=401（新门下旧值即无效值）；本机 channel.log 无旧值字串（新值同样禁查值只查计数） |
| 8 | 收口 | 双面 | 读数卷落周平面+in-progress 条对表闭+三层推平+呈 BOD/CEO |

**次序刚性**：1→2→3→4→5→6→7 不可乱序（sg 侧新值生效先于本机冷起，防 8713 拿新值打旧门白屏）；3 与 4 之间 sg 面连续操作不落中间态（restart 后旧值 job 打新门=401 失败重试噪音，窗内可接受如实注记）。

## 三·补、TRILC_INTERNAL_TOKEN 扩展联动序（10-01 12:0x BOD 三裁转录落正文）

**裁 A-a 转录**：§一「不换」旧文本作废——本机 8713 门令 `TRILC_INTERNAL_TOKEN` 纳入今晚轮换；值=TRIRMC_INTERNAL_TOKEN 同值（BOD 原录；与 TRIMC 族值关系候值席勘验对表），sha8 38731fd9 commit 面已露出该值，轮换即覆盖闭环（案底并档）。

**联动序（窗令正形，四步刚性）**：
1. 新值落位=凭据源+全部消费方同步（TRIMC 族+TRILC 面一并；含 job command 内嵌全部换新）；
2. F-3 补丁 A+B 应用→check；
3. 段内一次冷起同时带出 F-3 修复+新 token 生效（两变更一次重启，不二次冷起）；
4. 双向探针=新值 200+旧值 401 断言（#136 完工判据正形）。

**前置约束（入令）**：换值前值席先勘本机 8713 门令消费方清单（客户端/配置/跨机引用全查），新值同步全覆盖防断链；勘出跨机引用→窗令列跨机同步项，勿只换 daemon 侧；河源 `TRIRMC_INTERNAL_TOKEN` 同值牵涉候勘验结果定同步项。我面两哨+三 job 重挂候令将带新值内嵌（F-3 修毕重挂族）。

**回滚锚**：各自独立——F-3 补丁 revert 一锚；token 还原值一锚（§五 bak 机制同理扩展至 TRILC 侧值）。

## 四、验证锚（逐条机械）

1. channel.cmd 双键同值 64 hex+旧值零残留（计数断言）
2. sg .env 行在+unit drop-in 行在（grep -c 计数）
3. systemctl restart 后 show Environment 含新键（计数）
4. sg 8712：无令 401/旧值 401/新值 200 三态谱
5. job store 全扫旧值零命中
6. 本机 8713 healthz mc_link=connected（L1685 判据）
7. 端到端 delivered 闭环+时耗对照
8. 全程 transcript/消息面新旧值零出现（收口时 grep 抽验 transcript 尾段，只验「零出现」不引值）
9. 本机 8713 门令双向探针：新值 200+旧值 401（§三·补 步 4；#136 完工判据正形延伸）

## 五、回滚锚（窗前就位，异常即停）

- **触发**：§四 4-9 任一锚不过，或本机 8713 冷起后 mc_link≠connected 超 5 分钟。
- **锚件**：①channel.cmd 换前整文件 bak（`channel.cmd.bak-pre-rotation`，本机，含旧值——回滚后此 bak 即时删除防双份驻留）②sg .env 换前行 bak（sg 机内 600）③sg drop-in bak。
- **序**：本机恢复 bak channel.cmd→8713 冷起 connected→sg 恢复 .env+drop-in bak→daemon-reload+restart→无令 401/旧值 200 基线复测→三 bak 即时删除（回滚毕旧值回归在役，泄露面复位如实呈报）→事件卷落笔候 CEO/BOD 判后续。
- **回滚后义务**：轮换失败事件如实入台账+候再排窗（不默转自动重试）。

## 六、候 BOD 审裁点（明早哨窗随件呈审）

1. 工序 4 的 TriMMC command 字段 PATCH 合法性（TriMLC 有 allowlist 门、TriMMC 实勘无门——PATCH 非 POST add，行为面候裁注）。
2. 新值生成位=本机侧（本单 §二）vs sg root 侧生成 ssh 拉回——BOD 通道偏好裁。
3. sg 侧 root 代执链的具体交接形态（照 #141 root 包六锚先例 vs 本单 §三表格逐工序）。
4. 回滚 bak 删除时点（回滚毕即删 vs 观察窗后删——本单采即删防双份驻留，候裁）。
5. **范围扩展（10-01 12:00 COO 判定令新增；12:0x BOD 三裁·裁 A-a 裁毕）**：TRILC_INTERNAL_TOKEN（本机 8713 门令）纳入今晚轮换——已裁纳入，§一 正文已勘正、联动序落 §三·补，本点自候裁态收束。候审点 1-4 维持候 BOD 哨窗审。

## 七、排窗与凭据

- 执行窗=**2026-10-01 夜窗 18-24，批首件**（BOD 裁；今夜不动——裁据三条：23:00 锚+同夜第三轮生产 daemon 重启变更疲劳>泄露边际≈0+工序单宜正形走审，BOD 转录在卷）。
- 执行链=sg 侧 BOD root 代执+本机侧 COS 自执；BOD 夜窗候命。
- 本单呈审：**10-01 晨哨窗随件呈 BOD**；审后修订以审后版为准，审毕即挂批首件位候窗。
