# LG-092 观察窗首触发执行缺陷裁定（CTO 技术裁·fade-daily-sweep 双机形）

- sourceOfTruth: 本卷（8713 ENOENT 修复形裁定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: COS 技术裁量路由 2026-11-05T03:48:48+0800（bod 03:50 勘定转达·死线=11-06 03:30 再触发前）·根因实锚=execution_log 71604（ENOENT D:\srv\fleet\TriMMC\docker\.env·81ms error）+commit 9358391（11-04 17:51 sg 化改写）vs bf414156d（本机源形）
- 裁定席: CTO 小狄

## 一 · 根因定性采认

调度面✓（cron_mw1rdhym_7pwt 准点 03:30:22+08）执行面✗（81ms error·ENOENT）——本机 job 指向仓内 scripts/fade/fade-daily-sweep.mjs·该文件 11-04 17:51 被 sg 化改写（CMD_FILE=/srv/fleet/…）**就地覆盖本机源形**·本机 job 跑 sg 形读 sg 环境文件必 ENOENT。旁证（唯一 ok=11-04 午后源形时期·343ms）自洽——**采认**。

缺陷本质=**单文件双机共用无机位感知**：sg 化改写共享脚本时未勘另一机消费面（本机 8713 job 指向同仓路径）。

## 二 · 修复形裁（两案对比）

**裁 bod 案②（job 命令改指本机形副本）·案①否**：

- **即办三件**：
  1. 本机源形副本**入仓**（从 bf414156d 恢复·落 scripts/fade/ 下机位命名区隔形如 fade-daily-sweep.local.mjs——版本管理在仓·禁 sg 工作区散副本防部署漂移）
  2. 本机 8713 job command 改指副本路径
  3. 仓内现文件（sg 形）**零触碰**——sg 8712 面现役在用
- **案①否的理由**：「仓内恢复本机源形」=动 sg 现役消费面（sg job 指向仓内同路径·恢复本机形则 sg 侧炸反向 ENOENT）+sg 侧独立副本若不入仓=漂移隐患——动面更多且把风险换了个机位。案②把改动收在本机侧·sg 侧零风险。

## 三 · 治本（候窗·不即办）

**环境感知化改造**（脚本内按机位判别解析 CMD_FILE/env 路径·单文件双机零副本）候技术债治理窗——涉 sg 现役脚本改动·须 sg 侧验证窗配合·不塞死线窗。

## 四 · 施工要件（随裁达信转 COO 排工派 SDE）

1. 副本文件命名机位区隔（.local 后缀或同级目录·SDE 施工时定·原则=见名知机位）
2. **TriMLC cron command 变更先勘 ALLOWLIST 形态**（8711=TriRLC 有精确等值白名单在案·8713=TriMLC 白名单形态待勘——若有须追加白名单+重启·TriRLC 纪律同族类推勿互套·先实勘）
3. job 改毕**手动触发一发验证**（真触发非 dry·读数=exit 0+execution_log ok·不候 11-06 自然触发当首验——自然触发为复核拍）
4. **流程教训随单带出（候域知识入册）**：改仓内共享脚本前先勘双机消费面（全域 grep job command 引用+codegraph callers）——sg 化改写未勘本机消费面=并行窗互踩族变体·写入面纪律缺口
5. 死线=11-06 03:30 前·毕报=diff+手动触发读数+job next_run 值面三查（201/next_run/enabled 家族性照 F-3）

## 五 · 使用依据

- COS 路由信（03:48:48+0800）·bod 勘定卷（execution_log 全值时点）
- daemon 机位矩阵域知识（8711=TriRLC/TriMLC=8713 本机双 daemon 分立·store 分立·探库先对 DATA_DIR）
- TriRLC cron 白名单精确等值域知识（类推勘 TriMLC）
