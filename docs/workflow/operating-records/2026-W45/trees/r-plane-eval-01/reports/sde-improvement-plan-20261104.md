# r-plane-eval-01 改进计划卷·SDE 域（部署/发布/环境管理）· 2026-11-04

- sourceOfTruth: 本卷（trees/r-plane-eval-01/reports/sde-improvement-plan-20261104.md）
- syncMode: static（改进计划卷 SDE 域章节·候排程裁·非即行令）
- lastSyncedAt: 2026-11-04T05:39:30Z（date 现查 05:38:05Z·写前跑）
- 承接: 姊妹卷 `sde-maturity-assessment-20261104.md` §五总判——本卷逐项给改进路径·每项带依赖/窗建议/回滚面
- 施工约束沿袭: 评估只读照旧·本卷系建议面（执行候 COO 排程+CTO 门禁面核）

## P0·段二 TriRLC 河源装机窗（评估对象主体落地位·最高优先）

| 项 | 内容 |
| --- | --- |
| 路径 | npm ci（142 包先例+@trimetaverse/tricode workspace 链接复刻照 code-state.md 走查形）→ tsc build → dist 产物核 → trilc CLI 装设（PATH/npm link 形候裁）→ TRILC_DATA_DIR 隔离实例先行（8726/8727 候选轮先例）→ prod 8711 systemd unit 化（照 trirmc 模板：MemoryMax/CPUQuota/Restart 护栏+**EnvironmentFile 外置 token**）→ healthz/token 门/X-Internal-Token（TriPilot LG-002 配套）端到端烟测 |
| 依赖 | 段一锚已推前（067fbfd 在库）·TriCode 符号链接源在位·窗位候 COO 排程（D-23 对轨·daemon 勘修重启类） |
| 回滚面 | 隔离实例先行的两段式=prod 8711 未启前零现役扰动；unit 停用即回（无数据迁移面）；dist/gitignore 形照 D-03 重启纪律 |
| 前置门 | CTO 门禁面（装机方案核）+CTO token 门配套验（TriPilot X-Internal-Token 注入对表） |

## P1·部署卫生清理窗（§四发现五件逐件消账）

1. **relay3.service 处置**：停用+disable+归档卷注（上游 18791 已死·功能被 dsh-web-prod masked runner 替代实锚）——或候值席确认 18791 用途后重指；回滚=re-enable 一条命令。
2. **trirmc token 外置**：EnvironmentFile=/etc/trirmc-internal-token（0600 fleet）替 unit 内明文行·照 runbook §一旧形回归——涉 TriRMC 机制面重启（D-03 两步纪律·权威路径）·候独占小窗·healthz 前后对表。
3. **TriModel .env 收权**：chmod 600（TriModel 属主 fleet 自改·零重启面·读链不变）。
4. **TriRLC 2 件调试残留**：仓面收敛（删或 gitignore·FSD/值席裁·零风险）。
5. **deployment-runbooks/ 初始化**：五件起步清单=①TriRLC 河源装机 runbook（P0 产物即首卷）②dsh-web-prod 常驻 runbook（masked runner/token 轮换/8791 面）③TriRMC 运维 runbook 迁入（docs/runbook.md 复制+勘正 8712→8710 漂移注）④relay 清理 runbook（①处置时顺产）⑤密钥轮换 runbook（token/.dsh_tok/DEEPSEEK 面位图）。

## P2·TriPilot R 面装机窗（命令行+GUI 双形态）

- 产物链：prepack（compile+build:cli）→ .vsix 构建落 output/ → **版本钉住纪律**（exact 版本·preview 期照 dsh 先例不追新）→ vscodium AppImage 构建走通（recipe.yml+build.sh 在·产物候建）→ 扩展装设+LG-002 token 门对表 → e2e（test:e2e:extension）收口。
- 依赖：P0（TriRLC daemon 在役=TriPilot 连接面对象）·窗候排程·构建产物落 output/（本席工作落点惯例）。
- 回滚面：扩展卸载即回·vsix 版本回退（钉住版在库）。

## P2·常驻钥匙面落地（承 LG-087 常驻形态选项）

- DEEPSEEK 凭证 provisioning：credentials-local 文件形态（`.credentials.yaml` 0600·热载）替代 spawn env——照 CTO 2026-10-16 裁（常驻=文件·临时=env）·管道直传 M→R 照 002 先例三道门（D-46/D-54）。
- 依赖：M 面授权面执行·值席手册入运维序（KV cache 运营序四钉之一并档）。

## P3·M/R 面一致性台账（防漂移机制）

- 部署清单矩阵表（sg vs 河源：unit×端口×版本×护栏×token 面）入值席手册+deployment-runbooks 库——每装机窗后同步·runbook 库 P1-5 承载。
- 8711 族 API 面装机后：R 面版 healthz/token 门对表纳矩阵。

## 排程建议汇总（候 COO 裁）

| 序 | 窗 | 内容 | 阻塞关系 |
| --- | --- | --- | --- |
| 1 | 候排 | P0 TriRLC 装机窗 | P2 依赖此 |
| 2 | 候排 | P1 卫生清理窗（五件·含 TriRMC 重启小窗） | 独立可并 |
| 3 | 候排 | P2 TriPilot 装机窗 | 依赖 1 |
| 4 | 候排 | P2 钥匙面+P3 一致性台账 | 随 1/3 顺手窗 |

—— 落款（date 现查原值）: 2026-11-04 13:39:30 +0800（SDE 小布·r-duty-sde）
