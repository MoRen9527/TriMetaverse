# CTO 定谳·FSD 实施偏离两项（TASK-INCIDENT-SDE-SETTINGS-01 §六方案悬置点闭合）

- sourceOfTruth: 本件（偏离裁决树内正身；定谳权 CTO，已直回 COO 转 BOD）
- syncMode: final
- lastSyncedAt: 2026-09-25 10:2x +0800（date 现查回合链）
- 实勘对象: TriCompany `fix/restore-claude-config-01` f887b27（脚本 340 行改动+README 95 行+模板单键化+.gitignore）+ 沙箱回归 25/25 自测在卷

## 裁决

| # | 偏离 | 裁决 | 要点 |
| --- | --- | --- | --- |
| ① | 修-2 注钥落点：README 一行式→脚本 `-InjectKey` 模式 | **APPROVE** | 方案四要素逐字对齐（keyfile 优先/双键探测/非空断言/全空 fail-closed）；补齐一行式做不到的三能力（-WhatIf 跟随注入/写盘前后双断言/沙箱可测）；FSD 理由「转义脆+不可沙箱测」均成立；README 已注原一行式废止，真源单一化达成 |
| ② | 修-5：单键制+活体键形同形生成组合 | **APPROVE 且优于原案** | 「活体 known-good 键形=权威形」系复盘 §②-1 键名错位定谳的直接推论；方案原案字面（AUTH_TOKEN 单占位符死锁）落地反而重蹈键名错位（活体权威键形=API_KEY）；模板双占位符已删（diff 实勘），生成恒单键 |

## 附加实勘读数（全绿）

- 修-1 健康门双层：PLACEHOLDER 全键扫描+凭据族 `IsNullOrWhiteSpace`（空/纯空白拦截）；
- 修-3：`-WhatIf` 全路径干跑（键值 diff 零写）+`-TargetDir` 沙箱+活体警告行+`FROZEN-BACKUPS` 轮换豁免哨兵（P-3 脚本级前置落地）；
- 脱敏：`Format-ValueForLog` 凭据键 len-only，钥值全程不经输出/日志/transcript（README 红线 v2 已注）；
- 模式互斥门（CaptureRelay×InjectKey）+`.gitignore` 补 `.deploy-key`；
- 修-4/6：写后回读断言+自动回滚+`-SmokeTest` 三态（2xx/401·403/不可达）+RESULT/FAIL 结构化行；
- 冻结哨兵 897b0da 未触（分支基点 88a6988，解冻 revert 链干净）。

## 解冻链注记（候 BOD）

revert 897b0da+本分支合入（时序 BOD 裁）；STE 独立复验照常为终验收门；dev 侧四锚+CaptureRelay 候解冻窗按沙箱方式执行（-TargetDir；CaptureRelay 部署日 3333 健康窗），不重犯活体形态。
