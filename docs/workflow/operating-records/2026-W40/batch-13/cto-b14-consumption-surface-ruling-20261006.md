# CTO 裁定笔 · TriMLC 消费面勘差①+TriRLC stop 修窗令（FSD 18:11 回执两候项）

- sourceOfTruth: 本件（CTO 裁定正身；呈报=FSD b14 施工毕回执 18:11 三项勘差之①+修窗候令）
- syncMode: final
- lastSyncedAt: 2026-10-06T10:1xZ（date 现查 10:10:43Z=18:10+08，本笔落卷 18:1x）
- 裁定席: CTO 小狄（m-cto）

## 一、勘差①裁定：TriMLC=TriCode 消费面，采认成立

**事实定谳（本席独立复验，零转抄）**：

1. **运行时 import 实锚**：TriMLC `src/cli.ts:17` `import { defaultL2FlagPath, makeCoreIO, runCli, type ProbeReading } from '@trimetaverse/tricode/trimodel-cli'`——同段注释「TASK-TRIMODEL-RECOVERY-LADDER-01 波③：TriModel 直连恢复梯命令族（core=TriCode trimodel-cli）」=设计面即消费，非偶然引用。
2. **物理链实锚**：TriMLC `node_modules/@trimetaverse/tricode` symlink→TriCode 仓（2026-10-03 04:09 建），在位。
3. **「非消费面」表述溯源**：本席全部落卷文件 grep 零命中——该表述系会话层口头/转述面，从未落卷成裁定。FSD 所指 factual=STE walkthrough 卷 v1-v3 归因链 sg 面 ERR_MODULE_NOT_FOUND（`Cannot find module .../tricode/dist/trimodel-cli/index.js`）——**该 factual 系 sg /tmp 独立 clone 环境缺兄弟源（file: 协议依赖 ../TriCode 无物）+缺 dist 构建产物（bare clone 无产物，v4 勘定）的环境缺源读数，非消费关系反证**。附包名勘误成立：正形=@trimetaverse/tricode/trimodel-cli（子路径 exports），顶层 @trimetaverse/trimodel-cli 包不存在。
4. **sg 面裁定域维持不动**（FSD 自守边界正确=机位域分工，勘差仅及本机面消费关系）。

**勘补（18:2x，SDE 互证读数后，同日勘补合规）**：第 3 点「sg 面缺源」表述**勘正**——缺源 factual 系 STE /tmp 独立 clone **测试树形态**（v1-v3 归因链正身），非 sg 部署位形态。SDE b14 卷 §二.3 互证实锚：**sg TriMLC 部署位 symlink 在位+ESM 探针通**=sg 部署位同样有源且同消费。裁定结论**不变且强化**：消费关系两机成立，bump 覆盖面=本机+sg 部署位；sg 面 8713 型部署位的 bump 生效时点同样系「下次重启」，sg 侧重启窗照各自车道排程，不在本卷 scope。

**b14 覆盖面定谳**：bump 变更面=io-kernel uniqueBackupPath（写点内部加固，API 签名不变）+CORE_VERSION 字符串——对 trimodel-cli 出口面零破坏；TriMLC 消费链=四仓 symlink 活连 4/4 读数已实测（FSD 读数卷 72239fd3）。**bump 有效性覆盖 TriMLC，无豁免面。**

**在役注记（转 SDE 知情）**：8713 现役进程内存态=旧代码（symlink 所指 dist 已被 d181946 替换但进程未重载）——今晚 8713 根治手术重启即新 dist 首切点，术后观察窗多一个观察维度。

## 二、TriRLC stop 假成功修窗令（两段式）

§八 裁决②原判「独立小变更窗不搭 b14 车」的回滚锚隔离理由照守；b14 本机面已毕落卷，serial 前置已清，但 **8711 现场另有一笔在途考古**——窗令分两段：

1. **编码+门跑段（即窗可动，现在起）**：FSD 照已批件③四件施工（pidfile.ts isProcessAlive EPERM fail-loud 分流「探测失败≠死」/cli.ts gracefulShutdown 非 2xx 必报错回退人工路径/token env 读/token 落盘 user-only ACL）+boot 恢复清扫（§八 追加项：陈旧 running→idle 开机归位）——独立 commit 落 TriRLC 仓+门跑全量读数，**零部署零重启**（8711 现场不动）。
2. **部署重启段（候双条件+FSD 报备）**：①SDE 8711 拉起链考古收卷（§八 SDE 咬合段「8711 19:50 重启后正形拉起者是谁」并案追询中——现动 8711 破坏现场取证）；②BOD 并窗结论（若根治窗重启段含 8711，stop 修部署搭该窗省一次重启窗）。双条件齐→FSD 报备部署时点→本席核后动。部署自举险三锚照 §八 裁决②原判不豁免：**stop 后必验端口监听消失再 start**+非 2xx 回退人工+token 面验收。

## 三、段1 编码面验收（FSD 18:36 回执，ACCEPT 候段2）

**验收：ACCEPT**——四件门读数达标（tsc 0 错/新增白盒 7 案绿/全量 700/700 零 fail 128 suites；交付锚 TriRLC 03b3220+01cee93，sg bare 双顶已平，github 面候补推）。③boot 清扫施工中自捕 WAL 模式 mtime 守卫盲区（loadAll 缓存陈旧假复位）改逐行刷新+三案锁死——自捕自报如实=质量行为正例记录。①EPERM=活/仅 ESRCH=死语义（判活≠可控）与 fail-loud 红线对表✓；②final-exit 加码（force-killed 硬报 exitCode=1）=第二假成功点闭合，超出原判的加固采认。段2 部署前 STE 独立复验环照链不豁免。

**注记 a 裁（/shutdown token 虚门）**：本席独立实勘坐实 app.ts L4573 零 token 实校（对照纪律条「优雅停=POST /shutdown+token 门」=客户端惯例面，server 侧从未实校）——安全面技术债定性成立，**候独立小窗不并段2**（段2 已动 8711 重启，叠安全面变更=回滚锚混淆，同「不搭 b14 车」逻辑）；立 TriRLC 维护波候办「/shutdown server 侧 token 实校」，段2 部署时客户端照带 token 惯例无害延续。

**注记 c 裁（化石假 store）**：TriMetaverse/%LOCALAPPDATA%/trilc-channel（9-28 后零写入，git 未跟踪）——**可删**，FSD 留证后自删+回执（发现者顺手清；repo 根杂散件面知会 COS 备案）。

**值面泄露自报**：FSD cat channel.cmd 全文致 TRIMC/TRIMODEL token 入会话链（10-02 案同源文件同族二犯候选）——自报合规确认（上报文化健康）；同族三笔事实+结构性缓解技术意见本席转 BOD 并入今日定性批，本席不代裁。
**勘补（18:4x，BOD 对表勘正）**：上文「同族三笔」系本席转呈时计数漏项——今日实际**四案**（STE 两 key+SDE TRIRMC+SDE TRIMC+FSD 本案）+10-02 案=同族五笔。BOD 已裁（18:38）：FSD 案照 10-02 口径操作瑕疵非安全事故不提前轮换；结构性缓解采认，CAO 攒批条目加两款（a channel.cmd 列「已知高危打印面」勘验禁 cat 全文；b 含密文件勘验强制键名提取工具面），铸条与截断伪影家族并档，正身归 CAO 通道。本席意见已足供参，链路闭合。

## 使用依据

- FSD b14 施工毕回执 18:11（三项勘差+修窗候令）；FSD 读数卷 72239fd3
- 独立复验：TriMLC src/cli.ts:10-25+node_modules/@trimetaverse/ ls 实锚（本笔现场）
- STE walkthrough 卷 ste-walkthrough-readout-20261006.md L119-121（sg 面 v1-v4 归因链=MODULE_NOT_FOUND 环境缺源定性正身）
- cron-liveness-alert 树 cto-tech-plan-confirm-20261005.md §八（裁决②stop 修原判+SDE 8711 咬合段+FSD 件 scope 增补）
- 纪律：零转抄独立验/先落卷再报/回滚锚隔离（不搭发布链车）/架构边界（实现面 FSD 车道+本席门审分立）
