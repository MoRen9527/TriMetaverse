# FSD 实施报告·restore-claude-config v2 沙箱修复（TASK-INCIDENT-SDE-SETTINGS-01）

- sourceOfTruth: 本件（FSD 实施读数+自验报告正身；修复方案正身=cto-review-report.md §六，验收权=BOD）
- syncMode: final（候 BOD 验收）
- lastSyncedAt: 2026-09-25T02:18:28Z（+8 10:18）
- 派工: COO 单 2026-09-25 09:46+0800（BOD 裁二授权；时限 2h=11:46+0800 截，本件完稿 10:2x+0800 时限内）
- 实施席: FSD（m-fsd）；实施位=TriCompany 修复 worktree（fix/restore-claude-config-01，基点 dev 顶 88a6988）

---

## 一、实施总览与落位判断

**交付锚**：TriCompany 分支 `fix/restore-claude-config-01` 提交 **f887b27**（4 files, +357/−83；基点 dev 顶 88a6988）。

**落位判断**（约束推导，候 BOD 验收认可）：
- 修复正身落 TriCompany **修复分支**（worktree 临时挂载 `TriCompany-worktrees/fix-restore` 实施）——不触主仓工作区、不动 dev、**冻结哨兵 897b0da 原样在 dev 未触**；解冻路径=BOD 验收后 revert 897b0da + 本分支合入；
- 实施读数与自验报告随卷落本树（W39）；回归驱动脚本+读数清单随卷可复跑。

## 二、实施序对照（cto-review-report.md §六「实施序与门禁」逐项）

| §六序 | 落点（f887b27 文件行级锚） | 状态 |
|---|---|---|
| 修-1 凭据健康门 | restore-claude-config.ps1 主流程「修-1」段：PLACEHOLDER 全键扫描+AUTH_TOKEN/API_KEY 逐一 IsNullOrWhiteSpace，三态全拒 exit 2 | ✅ |
| 修-2 独立钥源注钥序 | 同脚本 `-InjectKey` 模式：keyfile(`.deploy-key`) > 活体双键探测（AUTH_TOKEN→API_KEY 取非空者）+空即 Fail 禁注入+写盘前后双断言；README v2 checklist ② 原单键命令废止 | ✅（落点偏离见 §三.1） |
| 修-3 干跑/沙箱 | `[CmdletBinding(SupportsShouldProcess)]`+`-WhatIf` 全路径干跑（diff 脱敏零写，含备份/目录创建均不发生）；`-TargetDir`（缺省=活体，醒目警告行）；`FROZEN-BACKUPS` 轮换豁免（P-3 脚本级） | ✅ |
| 修-4 断言+冒烟 | 写后回读断言（JSON 合法+逐键值一致+凭据非空）→失败自动回滚（本次备份拷回/新建态删半成品）exit 1；`-SmokeTest`：GET `{BASE_URL}/v1/models` 双认证头，2xx=PASS/401·403=Fail exit 1/不可达=跳过不阻塞 | ✅ |
| 修-5 模板单键制 | presets/direct.json 删 `ANTHROPIC_API_KEY` 行（双键同占位符废止）；`-InjectKey` 键形同形生成（见 §三.2）；README〈双键语义注〉（引 2026-09-15 双键核查在案） | ✅ |
| 修-6 结构化结果行 | 成功路径 `RESULT \| op/mode/target/backup/assert/smoke/rotation/ts`；失败路径 `FAIL \| code/msg/ts`（`\|` 防断裂转义） | ✅ |
| README 同步改版 | README.md v2 全文：v2 摘要表（五缺陷+②-6 对照）/沙箱纪律节/checklist 全锚沙箱化（原活体实证锚 v2 起废止）/退出码表/双键语义注 | ✅ |
| 沙箱全锚回归 | 25/25 PASS（见 §四）；**禁活体测试达成：全程零触现役 settings.json（含读取）** | ✅ |

另：`.gitignore` 补 `scripts/ops/local/presets/.deploy-key`（真钥防仓内手滑；密钥卫生红线 v2 扩）。

## 三、实现决策偏离声明（候 CTO/BOD 验收裁决）

1. **修-2 落点升级**：CTO 方案原文=「README 注钥命令同步改版（双键探测+断言）」一行式；本席实现为脚本 `-InjectKey` 模式（README 调用之）。理由：一行式嵌套引号转义脆（本机 2026-09-22 BOD 启动实证同族坑）且不可沙箱测；脚本模式可入回归门禁。语义面（钥源优先级/双键探测/非空断言/禁 injected）与方案逐字对齐。
2. **修-5 键形策略取「活体同形探测生成」**：方案给了「单键制**或**活体同形探测生成」二选——本席两者组合：仓库模板=AUTH_TOKEN 单键制（缺省）；`-InjectKey` 部署日按活体非空键名同形生成（活体 known-good 键形=权威形，防键名错位=事故第一清空点指令层根因复发）；活体双键全空灾备态缺省 AUTH_TOKEN 并 RESULT 行 `keyshape=default` 标注。

## 四、自测读数（沙箱回归·三轮全程记录）

驱动：`fsd-sandbox-regression.ps1`（本树随卷，powershell.exe 5.1 子进程逐用例实跑，测试钥全 TEST_ 假值）。

**终轮（裁决轮）：PASS=25/25，DRIVER-EXIT=0**（沙箱根 fsd-restore-sandbox-20260925-101626；读数清单随卷 fsd-sandbox-regression-result.txt）。前两轮如实记：

| 轮 | 读数 | 归因与处置 |
|---|---|---|
| 1 | 17 例全 PASS 后驱动整体超时被杀（4min） | **卡点取证**：黑盒复现 401 场景——子进程 25s 内正常 exit 1，复现命令卡在 `Stop-Job`；定性=Start-Job 内 HttpListener `GetContext` 原生阻塞致 Stop-Job 无限挂（**驱动侧测试基建缺陷，非被测脚本缺陷**）。处置：mock listener 改独立进程版（Start-Process/Stop-Process） |
| 2 | 24/25，T4e FAIL（exit=0 对但跳过文案不符） | T4e 用例设计失误：预设留真 bigmodel 端点构成一次假 token 外呼（非预期路径）。处置：改 loopback 拒连地址（127.0.0.1:1）=真·不可达语义+回归零外呼 |
| 3 | **25/25 全绿** | 裁决轮 |

终轮要点读数：T1a-c 健康门三态拒切 exit=2 ✓；T2a 钥源全空 Fail ✓；T2b 活体 API_KEY 同形注入（keyshape=ANTHROPIC_API_KEY+值面一致）✓；T2c keyfile 优先 ✓；T2d/T3a/T6b WhatIf 零写（hash 相等+备份零增）✓；T3c 轮换豁免（8 切备份 7 份+豁免注记）✓；T3d 正常轮换 ≤5 ✓；T4a 断言 pass+最小侵入（非 env 键保留）✓；T4b 自动回滚（hash 恢复一致）✓；T4c/d 冒烟 200/401 双态 ✓；T4e 不可达跳过 ✓；T7a-c/T8 负路径全拒 ✓。

**兼容性**：修复脚本+驱动均 UTF-8 BOM（5.1 中文红线）+Parser 零错；全程 powershell.exe（5.1）实跑。

## 五、约束合规声明

1. **活体零触（含读取）**：全程所有脚本调用显式 `-TargetDir` 独立临时沙箱；无任何缺省 -TargetDir 调用（缺省=活体路径）。**未对活体做 mtime/hash 等读取**——「活体零扰动」以「全程未触+代码路径审读（脚本无绕过 TargetDir 的硬编码路径，`$claudeDir=$TargetDir` 单点派生）」为证。
2. **T3b 活体警告行未实跑**：实跑需以活体为 TargetDir（即便 -WhatIf 干跑 diff 亦读目标 settings.json=「含读取」违禁）——以代码审读为证（警告逻辑位于脚本路径解析后、任何文件读取前），如实标注非实跑读数。
3. **冻结哨兵 897b0da 原样**：修复分支基点=dev 顶 88a6988（哨兵之后一笔），dev 未动；主仓工作区 status clean（本席曾误将 .gitignore 改至主仓工作区，**当即 git restore 恢复**，全程未 commit 未留痕主仓——如实记）。
4. 冒烟 mock 全本地（HttpListener 127.0.0.1）；终轮零外呼（轮 2 的 T4e 外呼失误已修正并复跑全量）。

## 六、坑位与技术债标记

1. **Start-Job+HttpListener.GetContext+Stop-Job 挂起坑**（本席新入册候选）：GetContext 原生阻塞打不断，Stop-Job 无限等——测试基建选型改独立进程。建议入 CAO 纪律册或工程 wiki。
2. **wt/full-stack-developer 落后 dev 28 笔+wt 独有 7 笔（LG-052×5+首切×2）未归账**：本笔落 wt 顶（新文件零冲突面）；merge/rebase 追平候归账窗——设计件「落后过久=合流冲突大」风险在案，同树 dev 侧 984bde26 复盘正身未随本笔（归账合并后自洽）。
3. **bash cd 后台链坑复现**：`cd X && git add` 复合命令后 shell cwd 被 harness 重置回主树——后续命令已改 `git -C` 绝对路径式（无实害，记录）。
4. 修-2/修-5 两项实现偏离候裁决（§三）——若 CTO 要求回归原案形态，改版成本=README 一行式补写+InjectKey 降级为可选，半天内。

## 七、解冻条件覆盖矩阵（FROZEN-NOTICE §三 对照）

| 解冻条件 | 本单状态 |
|---|---|
| ①缺陷 1、2 修复（空凭据 fail-closed+独立钥源） | ✅ 修-1+修-2+修-5（§二） |
| ②干跑/沙箱测试纪律入脚本 | ✅ 修-3（-WhatIf/-TargetDir/轮换豁免） |
| ③自验断言补 token 非空+auth 冒烟 | ✅ 修-4+修-6+终轮 25/25 |
| ④复盘单收口 | ✅ cto-review-report.md（984bde26，CTO 侧） |

四条齐备，候 BOD 验收（解冻动作=revert 897b0da+本分支合入，验收权在 BOD，本席不预动）。

## 八、使用依据

- 实施正身：cto-review-report.md §六/§七（984bde26）；FROZEN-NOTICE-restore-claude-config-20260925.md（解冻四条件）
- 冻结脚本基线：TC dev 897b0da（哨兵版）；现役脚本全文（冻结笔内原逻辑 154 行）
- README 基线：TC dev 版 README.md（L41-43 注钥命令=废止对象）
- 派工链：COO 单（2026-09-25T01:46:09Z 转出，BOD 裁二原文+P-5 约束随单引用）
- 测试基建：fsd-sandbox-regression.ps1 + fsd-sandbox-regression-result.txt（本树随卷）
