# TriLC 双线合并台账（trilc-lineage-merge）

- 合并方向: 本地 28 提交线 → sg-dev 基线（876d21e，含 canonical c4f9e0f/ba32bc7 + p0fix3 系）
- 甄别: 保留 27（staffing/FADE-004 系×5、PSEUDO-CHAT 修复链×9、knowledge×3、安全注入×2、批次收口×2、fallback 透传×2、SSE/修 bug×3、脚本/docs×1）；**放弃 1**：8ad6d5c 旧版 TC-s1 草案（被 sg 正式架构 c4f9e0f 取代，计划 §二既定）
- 冲突: 1 处（qa-json-runtime-stub.test.ts 双 env 并集解）；修正案 2（接口双声明去重 / roster-gating 套件 fail-closed 适配）
- 门禁: tsc --noEmit clean；npm test 585/1（唯一 fail=tui components 预置债 HS-3）
- 终态: dev=ff2f970 单线化（GitHub force-with-lease 重置+sg-bare FF，双远端推平）；backup/local-dev-premerge 留档 GitHub
- **heyuan 生产线决策**（doneCondition 要求明示）：dev 现为超集单线；**决策=heyuan 生产下次验收窗口切回 dev 线**，tc001-canonical 分支保留为历史发布跟踪锚不再演进。切换动作不在本树内执行（daemon 重启纪律+窗口约束）。
- 卷封: sourceMaterials ×2 verify=0（封卷后零改动）
