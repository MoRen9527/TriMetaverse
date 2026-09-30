# 任务书·BOD 流水线批次 03（排程内提前+ink 攻坚+候验初读）

- sourceOfTruth: 本件（CEO 02:41 令「排程内/候验往当前批次放，服务器不闲着」+ink 老问题搜证令；BOD 铸发）
- syncMode: final
- lastSyncedAt: 2026-10-01 02:4x +0800
- 执行位: 件 1+2→m-duty-fsd／件 2 方案裁→m-duty-cto／件 3→m-duty-cos
- 任务书纯净性自检: 三件均 BOD 已裁（COO 明晚窗件经 CEO「不闲着」令提前，范围不变；差量已同步面候 COO 认）✓

## 件 1·LG-059 剩面·TriRLC 仓旧名残留修复（派 m-duty-fsd，带测试门）

- 背景: batch-02 件 2 TriMMC 半仓收口成立（bfbfcfe）；本件=原 COO 明晚 18-24 窗「另一仓修复」提前（CEO 02:41 令）。
- 干什么: TriRLC 仓旧名路径引用修复（batch-01 供弹卷 TriRLC 段逐条），**ink 补装明确排除**（归件 2 专攻）；改后必跑仓测试门。
- 验收锚: `trees/bod-pipeline-batch-03/lg059-trirlc-fix-readout.md`：改动清单+全量测试读数（含既有挂独立归因）+复扫零命中。
- 硬门: 测试非全绿（扣除既有挂全等基线外新增 fail）=停手回卷；禁动 TriMC 目录现名。

## 件 2·ink 补装攻坚（方案裁→执行两段；派 m-duty-cto 方案裁，裁后 m-duty-fsd 执行）

- 背景: 今夜 FSD 实测 npm ink-testing-library 拖入 npm ink→其内嵌 react-reconciler 与仓 react@19.2.8 冲突（reconciler init 崩）。
- **历史判据（BOD 搜证 02:4x，三周记录链）**：
  1. W30 `trees/trilc-tui-absorb/absorption-plan.md` L114：**TriRLC 终端 UI=自研 src/ink（约 80 文件），核心依赖 react 19+react-reconciler+yoga——不用 npm ink 包**；
  2. W38/W39 OP 记录 BUG-20260805-003 链：yoga 别名修复（89ad689→smoke 30/30 转绿）后，残留 components.test.ts 以 ERR_MODULE_NOT_FOUND ink-testing-library 失败，**归 CARRY-001 TUI 链**——此挂今夜实证仍在（8 挂既有归因之二）；
  3. W30 `trees/claude-code-compliance/cto-compliance-audit.md` P12：自研 ink reconciler import 桥接改造记录（constants-bridge）。
  - **根因定性：双 ink 并存**——仓用自研 src/ink，npm ink-testing-library 是给 npm ink 包写的测试库，补装必拖 npm ink 全家→与自研/react19 冲突，非版本对齐可解。
- 干什么两段: ①CTO 方案裁：读上列三记录+今夜两卷，裁「放弃 npm ink-testing-library 改自研轻量测试 renderer」或「components.test.ts 改行为测试不依赖 ink-testing-library」或其他修法，出方案裁条落卷 ②FSD 照裁执行：消 components.test.ts 挂点（TriRLC+TriMMC 两仓若同构同修），测试门同件 1。
- 验收锚: 方案卷 `bod-pipeline-batch-03/ink-testlib-strategy-verdict.md`+执行卷 `ink-testlib-fix-readout.md`：挂数变化+全量读数。
- 边界: 禁动 src/ink 自研面行为语义；CARRY-001 链销账判候 BOD。

## 件 3·候验初读供弹（派 m-duty-cos，只读）

- 背景: 三 job 首轮（tree-node-patrol/watchlist-patrol/hub-silent-detect 新路径自动轮）+D-15 哨 00:20 首轮读数=今晨候验项，CEO 令候验提前初读。
- 干什么: 初读四组 execution_log/读数（8713 cron 面+D-15 哨卷），逐组判「绿/异常/缺席」，异常如实录不擅判；产出供弹卷。
- 验收锚: `bod-pipeline-batch-03/morning-readings-firstpass.md`：四组逐行读数+三态判。
- 边界: 只读；BOD 明晨哨窗亲验终判（初读非终验）。

## 收口纪律（同 batch-01/02）

- 各卷落本树目录；commit 分件独立；NOTIFY 收口广播；零敏感值出机。
