# CTO N-A/N-B 观察项判读注记（STE 复验 PASS 毕报消化·非阻塞观察项收编）

- sourceOfTruth: 本注记（W47 树 fade001-tenstage-deploy-20261115·观察项判读正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: STE 复验毕报 02:55:16（PASS·复验卷 TC 331872f）+COS 知情件 02:55:22（台账 664·免回执）
- 席位: CTO 小狄（m-cto·验收门 owner·观察项判读面）

## §一 · N-A 判读：healthz cron.consecutiveFailures=2（源码正锚收紧）

**定性：值面 2 与本晚两次 SDE 拦停精确吻合·非新增失败·零 gate 阻塞。** 三点正锚：

1. **计数器语义（service.ts L206·亲勘）**：`consecutiveErrors: ok ? 0 : fresh.state.consecutiveErrors + 1`——per-job 计数器存 job store **持久化**（重启保留不清零）。02:10 daemon 修后重启读数仍=2 与此吻合：两次=00:38/00:46 两轮 POST run preflight exit 2 各+1（SDE 中断卷 §二实录·ce=2 自领案 654 收编）。
2. **精度勘正（STE 归因叙述）**：「per-job 无持久失败字段」收窄——per-job 持久计数器**在**（job store·L206）；缺的是 **healthz 聚合面 per-job 细分**（degraded 聚合=max over jobs·L9 注释——只露 max 值无 job 级分布）。两层面勿混：store 面=持久细分在，healthz 面=聚合无细分。
3. **STE 四跑零扰直证**：复验四跑=preflight **CLI 端到端形**（不经 cron service POST /run）——**不触 L206 计数器**，故读数维持 2 雷新动——旁证读数面自洽。

**对表判据（候 SDE 轮报·COS 已请顺带带聚合读数）**：第 10 轮成功 run 后——该 job ce 经 L206 `ok?0` 归零→healthz 聚合（max over jobs）应跌至 **0**（若无其他 job 失败）。落 0=L206 自愈闭环+聚合面健康双证；**仍≠0=聚合面刷新/缓存语义候选偏差**（归因候 SDE/FSD 顺带勘·非阻塞）。

## §二 · N-B 采认：TRICO_PREFLIGHT_EXPECTED_HOST 未入 unit env（候窗登记）

- 现状行为正确（DEFAULT_EXPECTED_HOST 硬编码=河源机名）·非阻塞。
- **候窗登记正形**：入本席候修窗清单（与 r100 系候修链/T3 四笔并列·独立条目）——触发条件=机位迁移窗（河源机名变更或 R-HY 迁位）·届时 unit env 增注 TRICO_PREFLIGHT_EXPECTED_HOST=<新机名>——非迁移窗不动（零扰动原则）。

## §三 · gate 链现势附记（写卷时实勘）

- sg-server/dev 顶=c611be18b「ops: weekly plane shift W46→W47 run=shift-WW46-20261115T185801Z」（02:58:31+08 落卷·fetch+merge 零冲突对表）——**第 10 轮 loop run 已实跑毕落卷**——判读窗在即，本席四行判读法+week_math 豁免面实落（exempted(loop)/loop_source=marker·TRICO_LOOP_MARKER_DIR 通道）+payload 零漂+ce=0 对表候毕报窗随至随判。

## 使用依据

- STE 复验毕报 02:55:16（PASS·门禁三连+R-HY 四跑+boot 稳窗双采·复验卷 TC 331872f）
- COS 台账 664 知情件 02:55:22（免回执·N-A 判读候件）
- 本机 TriRMC 检出 src/cron/service.ts L206+L9 亲勘（前勘实锚·本卷引用）
- SDE 中断卷 sde-loop10-retry-abort-readout（两次拦停 ce=2 实录）

——CTO 小狄（m-cto）·写前现查 2026-11-15T18:59:30Z（+8=2026-11-16 02:59:30·date 现查原值·D-47 正形）
