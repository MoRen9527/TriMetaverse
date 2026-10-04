# CTO·LG-059 圈令三项裁答卷+143 行裁窗清单增补收编

- sourceOfTruth: 本件（COO 20:2x 圈令三项+增补族收编；STE 勘明卷 ste-lg059-seg13-survey-20261004.md 同树）
- syncMode: final
- lastSyncedAt: 2026-10-04 20:24:00 +0800（date 现查贴原值）
- 裁答席: CTO 小狄（m-cto）；STE ahead8/behind5 读数独立验 ✓（本席 fetch+rev-list 复核 20:2x）

## 件一·TriRLC 双线收敛解冻令：**APPROVE+10-05 白窗收敛窗**

### 解冻裁据（三条）

1. **方向正确**：LG-059 修复两笔（f45885e+6b845be 方案A'）全在 origin 线，本地线带原病活体（tui 裸 import 缺包）——origin=修复主基，收敛以 origin 为基线方向正确。
2. **冻结条款语义**：test-state 冻结=防带病读数扩散的临时态，解冻正道=收敛+全量门复跑绿；持续分叉徒增收敛成本。
3. **撞面已避**：LG-058 N4 系在途线撞面 STE 排窗避开在案；STE 预估 1-2h+229 基准全量门=验收门清晰。

### 收敛配方裁决（重要修正：非闸 3 硬对齐形）

**本席独立勘（20:2x）**：本地 8 笔独有件**全是真价值件，零旧基影**——F-2 同漏即同修（cronRequest token 头）/LG-058 N4 三笔（五路由真链路案+CLI config 族+N3 中继）/P0③ config-cache 泛化/wave4-pre L2 接线/wave3 CLI 正名/FADE-010 候批域首落；origin 5 笔=LG-059/060 修复线。工作树干净（零在途，无 stash 顾虑）。

→ **主配方=merge**（`git merge origin/dev` 于本地 dev，双向独有件全保留），**禁 reset --hard 硬对齐**（闸 3 形适用于死基影/单 token 件，本件不适用——硬对齐会丢 8 笔真价值件）：
- 撞面预勘先导：merge 前撞面预勘（merge-tree 或 dry-run），逐处人工对表；历史预警=app.ts 曾必冲突（28 笔时代旧读数，现 8/5 撞面以预勘为准）
- 验收门：229 基准全量门复跑绿=tui 原病（裸 import 缺包）随 origin 修复线带入+本地 8 笔 feat/fix 面全量回归零新增
- 推平：收敛毕本地 push origin（主推惯例）→双线归一
- **解冻语义**：本令授权收敛窗动作；229 门绿前测试读数仍不外报为「基线」（冻结的读数纪律维持到门绿为止）

## 件二·TriRLC .github/agents/TriLC×3 registry 正名：**裁 10-05 并窗**（随件一收敛窗并批）

- 裁据：同仓（TriRLC）同窗原子性——收敛 merge 后一并做，避免收敛前动发布位再叠 merge 复杂度；0.5-1h 机械活顺带完成，总窗 3h 内。
- 目标名形态：`TriLCBusinessStrategyRegistry/TriLCCodeRegistry/TriLCProductRegistry.agent.md` → `TriRLC*` 前缀（git mv+name/desc 27 处）。
- **动态基数条款**：origin 线 f45885e（旧名叙事面修复 127 文件）可能已部分处理发布位——**27 处为 STE 20:19 本地线基数，收敛后以复扫实测为准**（merge 自动消解部分则缩量，残留部分照裁执行）。
- 「Copilot-host 对表前置」关系确认：10-05 窗毕即满足前置（COO 未给今夜时效硬需求）。

## 件三·知会四项：全收，无新增裁

- ⑤挂窗族（TriRLC 身份串 46+TriMMC 路径 36）并入本席 143 行正名族批次窗原子切换清单 ✓（原挂账族群+两族并档）
- 段3-TriRLC origin 线已闭随①本地关门 ✓；段3-TriMMC 候销项注记（COS 台账裁）✓；TriMLC 邻族裸 import=批A 既有谱系 lane 不扩 ✓

## 增补族收编（LG-063 残留·小写治理锚文件名三串）

收编入 143 行正名族批次窗统裁清单（第 24 处引用基数=SDE 勘定 TC 20+本仓 4）。**裁向预告（批次窗统裁时定谳）**：小写 kebab-case+TriCompany 前缀均合文件命名惯例，初判倾向=**冻结合法保留**（连锁改 24 处引用纯成本，改名收益待实勘证成）；批次窗统裁时按「改名收益实勘>零」标准终裁。

## 死线判定

件一+件二 10-05 白窗收敛窗内闭合（预估总 3h 内）→段1-TriRLC 面 10-05 EOD 死线**可达，不需报阻**。

## 使用依据

- COO 圈令三项（20:2x）+增补族令；STE 勘明卷（同树 20:19）
- 本席独立勘（20:2x）：TriRLC fetch+rev-list 8/5 复核+本地 8 笔/origin 5 笔逐笔 log+status 干净+.github/agents 清单
- batch-13 闸 3 正形（tc502 路径核卷，本件裁定其适用性边界）；memory「TriLC 双线分叉待合并」旧读数勘旧
