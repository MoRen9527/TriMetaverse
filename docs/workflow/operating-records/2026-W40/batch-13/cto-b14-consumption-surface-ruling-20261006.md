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
4. **sg 面裁定域维持不动**（FSD 自守边界正确）：sg 面缺源是部署形态事实，勘差仅及本机面消费关系。

**b14 覆盖面定谳**：bump 变更面=io-kernel uniqueBackupPath（写点内部加固，API 签名不变）+CORE_VERSION 字符串——对 trimodel-cli 出口面零破坏；TriMLC 消费链=四仓 symlink 活连 4/4 读数已实测（FSD 读数卷 72239fd3）。**bump 有效性覆盖 TriMLC，无豁免面。**

**在役注记（转 SDE 知情）**：8713 现役进程内存态=旧代码（symlink 所指 dist 已被 d181946 替换但进程未重载）——今晚 8713 根治手术重启即新 dist 首切点，术后观察窗多一个观察维度。

## 二、TriRLC stop 假成功修窗令（两段式）

§八 裁决②原判「独立小变更窗不搭 b14 车」的回滚锚隔离理由照守；b14 本机面已毕落卷，serial 前置已清，但 **8711 现场另有一笔在途考古**——窗令分两段：

1. **编码+门跑段（即窗可动，现在起）**：FSD 照已批件③四件施工（pidfile.ts isProcessAlive EPERM fail-loud 分流「探测失败≠死」/cli.ts gracefulShutdown 非 2xx 必报错回退人工路径/token env 读/token 落盘 user-only ACL）+boot 恢复清扫（§八 追加项：陈旧 running→idle 开机归位）——独立 commit 落 TriRLC 仓+门跑全量读数，**零部署零重启**（8711 现场不动）。
2. **部署重启段（候双条件+FSD 报备）**：①SDE 8711 拉起链考古收卷（§八 SDE 咬合段「8711 19:50 重启后正形拉起者是谁」并案追询中——现动 8711 破坏现场取证）；②BOD 并窗结论（若根治窗重启段含 8711，stop 修部署搭该窗省一次重启窗）。双条件齐→FSD 报备部署时点→本席核后动。部署自举险三锚照 §八 裁决②原判不豁免：**stop 后必验端口监听消失再 start**+非 2xx 回退人工+token 面验收。

## 使用依据

- FSD b14 施工毕回执 18:11（三项勘差+修窗候令）；FSD 读数卷 72239fd3
- 独立复验：TriMLC src/cli.ts:10-25+node_modules/@trimetaverse/ ls 实锚（本笔现场）
- STE walkthrough 卷 ste-walkthrough-readout-20261006.md L119-121（sg 面 v1-v4 归因链=MODULE_NOT_FOUND 环境缺源定性正身）
- cron-liveness-alert 树 cto-tech-plan-confirm-20261005.md §八（裁决②stop 修原判+SDE 8711 咬合段+FSD 件 scope 增补）
- 纪律：零转抄独立验/先落卷再报/回滚锚隔离（不搭发布链车）/架构边界（实现面 FSD 车道+本席门审分立）
