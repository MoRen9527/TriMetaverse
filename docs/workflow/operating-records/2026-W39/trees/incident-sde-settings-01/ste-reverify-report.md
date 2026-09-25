# STE 独立复验报告（TASK-INCIDENT-SDE-SETTINGS-01 · BOD 终验收门）

- sourceOfTruth: 本件（STE 独立复验门正身；读数全部自产，PASS/FAIL 判定直报 COO+BOD）
- syncMode: final
- lastSyncedAt: 2026-09-25 11:03 +0800（date 现查）
- 复验席: STE 小柯（m-ste）；派令: m-coo 执行 BOD 终验收令（接令回执 msg_id 43607b0d）
- 被测: TriCompany `fix/restore-claude-config-01` @ f887b27 `scripts/ops/local/restore-claude-config.ps1`（worktree 沙箱副本 `D:\Code\ai\TriCompany-worktrees\fix-restore\`）
- 驱动: 本树 `ste-sandbox-reverify.ps1`（STE 自建 25 用例，PowerShell 5.1 子进程逐案执行）

## 复验判定

**PASS**（终验收门通过）——附 4 项非阻塞发现（发现①/O-1/O-2/O-3），候 CTO/FSD 处置，不阻验收。

## 一、测试判断（范围与结论）

三令执行完毕，全部读数自产：

| 令项 | 结果 |
| --- | --- |
| (a) 25 案独立沙箱重跑 | **25/25 PASS, 0 FAIL** |
| (b) 四锚沙箱（T1a-c 健康门 / T2b 同形注入 / T3c 轮换豁免 / T4b 自动回滚） | 全 PASS（含于正册） |
| (c) 两偏离实现核（-InjectKey 断言路径 / 单键制探测序） | 均与 CTO 定谳一致（APPROVE 实证） |

## 二、测试策略（独立复验如何保证「真独立」）

- **驱动自建**：25 用例清单、夹具、断言全部独立设计，未读 FSD 驱动（其声称的 `fsd-sandbox-regression.ps1` 实盘缺失，见发现①）；FSD/CTO 读数仅作对照，不作输入。
- **执行位保真**：每案以 powershell.exe 5.1 子进程执行（生产实况位），经 `[Console]::OutputEncoding=UTF8` 包装取回 stdout；断言三维=退出码+stdout 正则+文件内容回读（含字节级 BOM 检查）。
- **沙箱门禁双防呆**：驱动内 `Assert-SandboxPath` 对目标路径断言——与活体路径字符串相等即拒绝、不在 WorkRoot 下即拒绝；所有被测调用均走 `-TargetDir`。
- **探针补盲**：正册外另设 P1（预设外空凭据键残留→写后断言行径）与 P2（活体双空灾备态 keyfile 注入→缺省键形分支）两探针，覆盖用例矩阵外的分支。

## 三、测试结果（自产读数全文）

沙箱 `C:\Users\jedih\AppData\Local\Temp\ste-reverify-20260925-110015\`，起跑 2026-09-25T11:00:32+08:00：

```
汇总: 25/25 PASS, 0 FAIL
PASS | T1a 占位符拒切 | exit=2 fail-line=True sentinel-unchanged=True baks=0
PASS | T1b 空串拒切 | exit=2 fail-line=True sentinel-unchanged=True baks=0
PASS | T1c 纯空白拒切 | exit=2 fail-line=True sentinel-unchanged=True baks=0
PASS | T2a 钥源全空fail-closed | exit=2 preset-written=False
PASS | T2b 同形注入(API_KEY形) | exit=0 keyshape-line=True gen-api-val-match=True gen-auth-prop=<absent-prop>
PASS | T2c keyfile优先 | exit=0 keysrc-line=True val-match=True
PASS | T2d 双键探测序(AUTH_TOKEN先) | exit=0 val-match=True
PASS | T2e 注钥WhatIf零写 | exit=0 whatif-line=True preset-absent=True
PASS | T3a WhatIf干跑零写 | exit=0 sentinel-unchanged=True diff-line=True
PASS | T3b 沙箱全流程+警告块静态审计 | exit=0 written=True content-ok=True warn-src-block=True
PASS | T3c 轮换豁免哨兵 | exit=0 baks-after=8（期望8=7旧+1新，零淘汰） rotation-note=True
PASS | T3d 正常轮换保留5 | exit=0 baks-after=5（期望5）
PASS | T3e bundled回退健康门前置拦截 | exit=2 installed(期望false)=False sentinel-unchanged=True
PASS | T4a 写后断言pass+键保留 | exit=0 preserve-otherKey=True
PASS | T4b 断言失败自动回滚 | exit=1 rollback-line=True restored=True
PASS | T4c smoke 2xx PASS | exit=0（期望0） expect-line=True
PASS | T4d smoke 401 FAIL | exit=1（期望1） expect-line=True
PASS | T4e smoke 不可达跳过 | exit=0（期望0） expect-line=True
PASS | T5a 5.1 JSON保真(CaptureRelay) | exit=0 cap-keys=7/7 fidelity=True
PASS | T5b UTF8无BOM字节断言 | exit=0 bom-present=False
PASS | T6b CaptureRelay WhatIf零写 | exit=0 preset-absent=True
PASS | T7a 预设坏JSON拒切 | exit=2 sentinel-unchanged=True
PASS | T7b relay预设缺位fail | exit=2
PASS | T8 CaptureRelay×InjectKey互斥 | exit=2
PASS | T2f 注钥写后回读值面 | exit=0 val-match=True top-keys=env
```

探针读数：

- **P1**（O-2 实证，`110015\p1-residual-emptykey\`）：活体夹具含 `ANTHROPIC_API_KEY: ""` 残留（凭据族内预设外空键）+ AUTH_TOKEN 正常 → 脚本写入后回读断言判「凭据键为空」→ 自动回滚 exit=1，备份 `settings.json.bak-20260925-110032` 恢复原内容实勘（含残留原样）。fail-closed，符合修-4 字面。
- **P2**（灾备态分支，`ste-p2c-110252\`）：活体双凭据键全空+`.deploy-key` 存在 → exit=0，`RESULT | op=inject-key | ... | keyshape=ANTHROPIC_AUTH_TOKEN | assert=pass`；生成预设单凭据键 `ANTHROPIC_AUTH_TOKEN=keyfile-disaster-VAL`（值面回读核对一致），共 11 env 键。键形探测序第三分支（keyfile+活体双空→缺省 AUTH_TOKEN 形）实证。

### 驱动调试迭代史（如实记录，读数以终跑为准）

| 轮 | 沙箱 | 读数 | 归因（全部为驱动自身缺陷，非被测缺陷） |
| --- | --- | --- | --- |
| R1 | 104721 | 1/25 | 驱动无 BOM UTF-8 中文被 5.1 按 GBK 误读致语法破坏（教训 ps1-utf8-bom 二次踩坑；pwsh7 解析器 SYNTAX-OK 系假阴性） |
| R2 | 105131 | 17/25 | 子进程 stdout 编码包装补齐后，断言串与实际输出不符（钥源行格式等 18 案假 FAIL） |
| R3-R4 | 105737/105914 | 24/25 | T4a 驱动断言查错 JSON 层级（otherKey 为顶层兄弟键非 env 内） |
| **R5 终跑** | **110015** | **25/25** | — |

## 四、两偏离实现核（对照 CTO 定谳 10:2x 件）

### 偏离① -InjectKey 断言路径 → **与定谳一致**

定谳四要素逐项实证：

| 要素 | 证据 |
| --- | --- |
| keyfile 优先 | T2c（钥源=keyfile:，值匹配）+ P2 灾备态（活体双空仍走 keyfile，exit 0） |
| 双键探测 | T2b（仅 API_KEY 非空→API_KEY 形生成）/ T2d（双非空→AUTH_TOKEN 先）/ P2（双空→缺省 AUTH_TOKEN 形）——三分支全覆盖 |
| 非空断言 | T1a/b/c 健康门三分支（占位符/空串/纯空白→exit 2）+ T2a 全空 fail-closed（exit 2，零写） |
| 写盘前后双断言 | T2f 写后回读值面核对；T4b 断言失败→exit 1+自动回滚 restored=True |

附带核：README v2 已改版且原一行式注废止（README L67「原单键一行式命令 v2 废止」grep 实锚）；CTO 定谳「真源单一化达成」与实况一致。

### 偏离② 单键制+同形生成 → **与定谳一致**

- 模板单键化：f887b27 diff 实勘 `presets/direct.json` 已删 ANTHROPIC_API_KEY 占位行；`.gitignore` 补 `scripts/ops/local/presets/.deploy-key`。
- 生成恒单键：T2b 生成件 `gen-auth-prop=<absent-prop>`（无 AUTH_TOKEN 键）+ P2 生成件单凭据键——两键形路径均产单键。
- 定谳②「活体 known-good 键形=权威形，APPROVE 且优于原案」与实现行为吻合；「方案原案字面落地反而重蹈键名错位」的判断经 T2b 同形生成读数支持。

## 五、发现清单（全部非阻塞，候处置）

| # | 级别 | 内容 | 处置建议 |
| --- | --- | --- | --- |
| 发现① | 非阻塞·交付面 | FSD commit 声称「驱动=TMV W39 树 `fsd-sandbox-regression.ps1` 可复跑」——实盘缺失（TMV 树/TC worktree/TEMP/未跟踪面四查无；TEMP 仅存其 21 案目录+mock-listener 残件）。其「25/25 自测在卷」主张因驱动缺失不可独立复跑 | 候 FSD 补落驱动或 commit 注记降级为「不可复跑」；不影响本复验（STE 驱动独立自建） |
| O-1 | 非阻塞·文档-实现偏差 | README v2 L99 与脚本头注 L135 称 RESULT 行「keyshape=default 标注」，实现（L215）实际输出字面键名 `keyshape=ANTHROPIC_AUTH_TOKEN`，无 `default` 字样 | 一行修：改文档或改实现取其一，功能无损 |
| O-2 | 非阻塞·语义观察 | 预设外空凭据键残留（如历史 `ANTHROPIC_API_KEY: ""`）在活体时：写后断言按全凭据族断空→判失败→自动回滚 exit 1，阻断切换。CTO 修-4 原文「凭据键非空」未限定断言域，实现取全凭据族（更严，fail-closed 姿态可辩护）；P1 探针实证 | 部署日影响：部署位若有空键残留会阻断切换——部署前清理或 CTO 定谳断言域（排除空串残留 vs 维持全族严格） |
| O-3 | 非阻塞·代码卫生 | 主流程 bundled 补装分支（L278-281）不可达：bundled 模板恒含 PLACEHOLDER（密钥红线），健康门（L241-254）在补装前必拒——`presetNeedsInstall` 真跑路径永不可达。T3e 实证（补装未发生+健康门拦截 exit 2） | 非功能缺陷（fail-closed 语义正确），候 FSD 清理或注记 |

## 六、硬约束遵守声明

1. **「禁动现役 settings.json」（含读取）**：全程零触——无任何调用指向 `%USERPROFILE%\.claude\`；活体路径仅作驱动防呆的字符串参照。首版 T3b 的 HOME 重定向方案在实跑前被驱动防呆拦截，经探针（ste-homeprobe）证实 5.1 `$HOME` 不读 HOME 环境变量后废弃，改为沙箱全流程+警告块静态源码审计（T3b 终态）。
2. **dev 冻结哨兵 897b0da 原样**：仅只读 worktree（f887b27 checkout）+沙箱写；dev 主树零写。
3. **读数自产**：25 案断言与全部读数为 STE 自建驱动产出；FSD/CTO 读数仅出现在对照语境。

## 七、质量门禁评估

- 冻结通告四解冻条件对照：①缺陷 1/2 修复——正册 T1a-c/T2a/T4b 实证；②沙箱纪律——双防呆+全程 -TargetDir 实证；③自断言+smoke——T4a/T4c/d/e 实证；④复盘闭环——CAO 受理批在卷，本复验门为终验收门读数。
- 四锚全部 PASS；两偏离实现与 CTO 定谳一致；无阻塞性缺陷。**复验门 PASS**，解冻链（revert 897b0da+合入时序）归 BOD 裁。

## 使用依据

- 派令: m-coo 转 BOD 终验收令（本会话 msg_id 43607b0d 接令回执）
- 定谳对照: 本树 `cto-verdict-fsd-deviation.md`（CTO 2026-09-25 10:2x）
- 方案原文: 本树 `cto-review-report.md`（修-1..6）
- 被测源: TriCompany f887b27 `scripts/ops/local/restore-claude-config.ps1`（worktree 副本实勘，含 L131-217 注钥块/L241-254 健康门/L283-302 轮换/L325-355 写后断言/L357-385 smoke）
- 冻结通告: `TriCompany/scripts/ops/local/FROZEN-NOTICE-restore-claude-config-20260925.md`
- 证据: 驱动=本树 `ste-sandbox-reverify.ps1`；读数=`%TEMP%\ste-reverify-20260925-110015\ste-reverify-readings.txt`（五轮沙箱 104721→110015 全留痕）；P1=`110015\p1-residual-emptykey\`；P2=`ste-p2c-110252\`；FSD 残件勘验=`%TEMP%\fsd-restore-sandbox-20260925-*\`
