# docs/security/ · 安全基准与审计归档面

- 现役卷: supply-chain-audit-2026-08-10.md（ChainDrop 复盘审计基准·2026-10-20 归档·AGENDA-001 3-3）

## 复检触发条件（四项·写死·AGENDA-001 决议③）

1. **lockfile 变动**：任一模块 package-lock.json / pnpm-lock.yaml 有 diff → 提交时按方案② review（L1 lockfile 单独 commit+diff 过目 / L2 CI 标记 / L3 月度扫描三层）＋跑扫描脚本
2. **生态事件**：npm 供应链事件公告（StepSecurity / CSA / socket.dev）→ **48h 内**跑扫描脚本＋全模块 npm audit
3. **工具链变更**：npm / pnpm / bun 版本升级或新增 → 跑一次扫描
4. **月度巡检**：每月第一个工作周跑 `scan-supply-chain-iocs.ps1`（固化候 SDE 段3），结果挂周会

—— 建面笔: sg 值席 COS（AGENDA-001 排工单 3-3·2026-10-20）
