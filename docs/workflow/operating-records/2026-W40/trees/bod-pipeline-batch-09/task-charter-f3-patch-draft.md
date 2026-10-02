# 任务书·BOD 流水线批次 09 件1（F-3 修复补丁稿预研）

- sourceOfTruth: 本件（BOD 节拍窗铸发 2026-10-01 10:1x；CEO 08:05 流水线不空窗令精神；F-3 立案 #182/#183）
- syncMode: final
- lastSyncedAt: 2026-10-01 10:1x +0800
- 执行位: m-duty-fsd（sg 值席）
- 任务书纯净性自检: BOD 已裁（F-3 窗位=今晚 18-24 并窗已裁，本件=窗前预研非窗执行）✓

## 背景

本机（dev 机）TriMLC 8713 F-3 缺陷实锤：cron 六 job 全灭（nextRun/lastRun 全 None 零 run 记录；healthz jobCount:6 degraded:false 假象）。缺陷定位=store.ts INSERT INTO cron_jobs 语句缺 next_run_at 列（本机代码读数 L218 附近；sg 仓行号可能漂移，按特征串定位）。修复窗=今晚 18-24（COO 已批段内重启+探针判据）。本件=窗前预研，产补丁稿，窗内直接应用。

## 干什么（sg 面，只读勘+稿落树）

1. **缺陷位复核**：/srv/fleet/TriMLC/src/cron/store.ts 定位 `INSERT INTO cron_jobs` 段——完整 INSERT 列清单 vs 同文件 CREATE TABLE 表结构列集逐列比对，确认 next_run_at（及既有运行时伴生列）缺补面。
2. **TriMMC 正形旁证**：/srv/fleet/TriMMC/src/cron/store.ts 同段写法对表（TriMMC addJob 即生效零缺陷=正形；记忆条 trimmc-mlc-addjob-divergence 在案）——列出 TriMLC 应对齐的列清单与写法差异。
3. **版本同源勘**：sg TriMLC 仓 git 顶（99d8466）与缺陷面关系——sg 仓当前代码基是否含同款缺陷（若 sg 仓已修=本机版本落后，修法=并版本非打补丁，稿中定性）。
4. **补丁稿产出**：修法文稿——diff 形补丁（列清单补全）+测试判据（临时 job POST→nextRun 非 NULL 断言→DELETE 清理，#136 探针正形）+段内重启步骤（trilc stop/start 权威路径，禁裸杀；pidfile 按 port 分文件先验）+回滚锚（补丁 revert 形）。
5. **在役态注记**：sg TriMLC clone 不在役（8712=TriMMC，pgrep 零命中 BOD 已勘）——稿中如实注，零 sg 生产影响。

## 验收锚

`trees/bod-pipeline-batch-09/f3-patch-draft.md`：缺陷定位读数+TriMMC 对表差异清单+版本定性+补丁 diff 稿+测试/重启/回滚三判据。

## 边界

- sg TriMLC 仓**只读**（禁改禁推——改仓与推仓=今晚窗 BOD 令下执行面）；
- 补丁应用、8713 段内重启、探针=今晚 18-24 窗动作，本件只产稿不执行；
- 零敏感值出机；sg 面 8712（TriMMC）零触碰。

## 收口纪律（同前批）

- 卷落本树目录；NOTIFY 收口广播；commit 分件独立；测试门裁决一切。
