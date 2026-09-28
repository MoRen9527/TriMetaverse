# 生产依赖锁锚纪律（TriCode detached 锚·CTO 裁定）

- sourceOfTruth: 本件（SDE 席运行知悉件；裁定真源=CTO 裁定+TMV 88a2c0b5 ②）
- syncMode: mirror-of-ruling
- lastSyncedAt: 2026-09-29T04:49+0800（date 现查 UTC=2026-09-28T20:49Z 段）
- 裁定链: CTO 裁定（LG-058 候裁三项裁定卷 88a2c0b5 ②）→COO 转本席 04:40（from=m-coo 跨会话件）；registry 锚注记候入（随下一 registry 窗，CTO 已记）

## 裁定本体

TriCode sg 机 HEAD=detached `d20cb6b` 系**有意锚定，非事故态**（河源同形）——sg TriModel/TriRMC/TriMMC build 依赖的 `@trimetaverse/tricode` 载荷锚。

## 执行面两条（SDE 域）

1. **禁按事故态误修**：禁 `git checkout` 分支顶/顺手追顶——未验漂移，构建载荷锚即漂。
2. **对平策略=两机同锚保持**：dev 机与 sg 机 TriCode 生产 checkout 同锚 `d20cb6b`；**TriCode 生产升级走显式窗**：fetch+checkout 新锚+受影响仓（TriModel/TriRMC/TriMMC）重 build+活体验收——禁散点升级。本机 dev 主线照常解耦（不适用 detached）。

## 本席兑现实录（窗内先例）

- 2026-09-29 sg TriMMC 接入窗：sg TriCode `1c7bdee→d20cb6b` 显式窗内对平（读数卷=TMV 树 `sg-trimmc-switch-readout-20260929.md`，commit 64fc75e8 §三.2）——即本纪律的窗内正形。
- 偏差申报语义同窗裁定①：md5 恒等=无写回链充分投影；diff 除 status=带写回链一般判据。

## 关联

- org 纪律册：`TriCompany/docs/workflow/engineering-disciplines.md`（候 CTO 面随 registry 窗入注记）
- 域路由指针：本席 session-body「DE 域路由与核心域知识」
