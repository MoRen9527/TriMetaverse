# 成熟度评估分席卷 · r-duty-ste · 测试与质量门禁域 · r-plane-eval-01

- sourceOfTruth: 本卷（trees/r-plane-eval-01/reports/r-duty-ste-maturity-test-quality-gate.md）
- syncMode: static（分席评估卷·值席汇卷制）
- lastSyncedAt: 2026-11-04T05:31:49Z（date 现查原值·京时 13:31:49+08；本卷签发时刻≈13:45+08 以此为基）
- 执行席: r-duty-ste（ST 小柯）；令源=M 面 COO 评估动员令 2026-11-04T12:52:29+08（投递手 m-sde）
- 施工约束遵行: 全程只读（源码/配置/仓面零写）·写面限本树·8710/443/8791 零碰（未触）
- 水位自估（M-001④）: 中；末次活动=会话 transcript mtime 不可得，以签发时刻代之并标注（M-001⑤）

## 一、域判定（测试决策三分法）

| 评估面 | 判定 | 依据概要 |
| --- | --- | --- |
| TriRLC 测试面 | **CONDITIONAL_PASS** | 套件规模与证据链成型（64 文件/既有全量读数链），但当日 merge 后无全量读数+模块 test-state 陈旧+无 CI |
| TriPilot 测试面 | **FAIL（作 production-grade 质保主张时）** | 本地套件 2 文件/79 行 vs src ~12.6k 行；有 CI 门禁骨架与轻门禁脚本，无肉 |
| 8711 族 API 面测试 | **CONDITIONAL_PASS（静态）** | 测试族在册（power-follower/roster-gating 等）；现役无 8711 监听，live 面在只读约束下不可评 |
| R 本地域测试域整体 | **CONDITIONAL** | RLC 侧可用·Pilot 侧门禁骨架无肉 |

## 二、实测读数（全部现场只读采得·非转抄）

### 2.1 TriRLC（/srv/fleet/TriRLC）

- 仓面基线：HEAD=`067fbfd`（2026-11-04 12:25:33+08，merge 并入 origin/dev 25a6850「Read tool offset 修复·10-23 sg 侧」）·分支 dev·本地=origin（behind 0）·porcelain 仅 2 untracked（见 §2.4）
- 测试基建：`npm test` = `node --import tsx --test test/**/*.test.ts`（node:test+tsx）；`npm run check` = tsc --noEmit；测试文件 **64** 件；静态 grep 直陈 it/test ≈**518** 处（`t.test` 子测不计·实际全量大于此数）
- 既有全量读数链（docs/testing 存档）：392+1skip（09-11 模块 test-state）→ **730/730**（10-14 LG-069 合并窗终验·HEAD 2e1e594）→ **758/758·suites 137**（10-20 seg2a ACP 验证·HEAD 5586fb3/01ccd41）
- **覆盖缺口（本域最重发现）**：11-04 当日 merge（067fbfd）后**无全量套件复跑读数在档**——10-20 读数锚的是 5586fb3，今日 HEAD 与之隔多笔（含 10-23 sg 侧修复并入），现势全量绿否无读数背书。按纪律：无读数不说充分。
- CI：**无 .github/workflows**——门禁纯人肉（STE/FSD 双面互证纪律在档，但无机器护栏）
- 跑法陷阱（历史在档·仍现役）：bash 直跑 `**` glob 退化单层→假读数 235（≠758）；全量必走 `npm test` 正形
- 模块 test-state.md：synced 2026-09-11，落后现势近 8 周；「TriLC/TriRLC 双线分叉冻结项」与「8713 degraded 疑案族」两条已知缺口在册

### 2.2 TriPilot（/srv/fleet/TriPilot）

- 仓面基线：HEAD=`a23d2a0`（2026-08-28 13:02+08，LG-002 daemon token 门配套）·分支 dev·本地=origin（behind 0）·porcelain 净
- **休眠读数**：origin/dev 同在 08-28——整条 dev 线自 08-28 起 **约 10 周零推进**（同期 TriRLC 推进至 11-04）；R 本地域 Pilot 现势=LG-002 时点快照
- 测试基建（骨架完好）：vitest（unit 带 coverage+integration+extension e2e `tests/e2e/run-extension-e2e.mjs`）；**CI 有**：`.github/workflows/quality-gate.yml`（compile→fixtures→coverage→artifact→extension-host-e2e 双 job·dev/main push+PR 触发）
- **套件本体极薄**：本地测试 2 文件共 **79 行**（unit sseParser 46+integration chunking 33）vs src 10 文件 ~12,619 行——覆盖比 ~0.6% 线级
- 轻门禁脚本（正资产）：`check:reference-tools`+`check:tool-impl` 一致性门已入 compile 链
- lint：显式 `'No lint configured'`

### 2.3 8711 族 API 面

- 端口面：`src/cli.ts` DEFAULT_PORT=**8711**；`src/power-follower.ts` = LG-069 二期从闸（8711 只跟随 8713 主闸 healthz 闸态·三裁据）；tray `DaemonChecker.cs` 探 8711
- 现役读数：`ss -tlnp` **无 8711 监听**（本机现听 8710/8791/443）——命令行为主姿态与「daemon 未起」现势自洽；live API 面成熟度在只读约束下不可评，静态测试族评（power-follower.test.ts/cron-*/session-* 等边界案组在册）
- 对比基准面（sg 现役形态）：以 git 现势+docs/testing 既有读数锚定；本席未跨机现勘（只读+机位面限制·如实标注局限——hostname=iZf8ziw57ydktu77fsld9yZ，D-24 机位断言以值为席复核为准）

### 2.4 卫生面

- TriRLC test/ 内 2 件 untracked 点前缀临时测试文件（.tmp-frame-dump/.tmp-stream-dump）——dot 前缀不被 npm test glob 拾取（零跑测影响），属树面卫生债
- TriPilot tests/fixtures 生成物走 CI artifact 面，本地零残留 ✓

## 三、缺陷/缺口分类（阻塞/非阻塞）

**阻塞性（对成熟度结论本身）**：无——评估任务自身零阻塞。

**非阻塞挂账（按重排序）**：

| # | 项 | 面 | 类 |
| --- | --- | --- | --- |
| N1 | TriRLC 11-04 merge 后无全量读数（当日 HEAD 067fbfd 无绿读背书） | RLC | 缺口 |
| N2 | TriPilot dev 线 10 周休眠（08-28 快照态·与 RLC 推进节奏脱节） | Pilot | 风险 |
| N3 | TriPilot 套件极薄（2 文件/79 行 vs 12.6k 行 src） | Pilot | 缺口 |
| N4 | TriRLC 无 CI 机器护栏（纯人肉门禁单点） | RLC | 缺口 |
| N5 | 两模块 test-state 登记陈旧（RLC 模块级 09-11·中央 09-11） | 共享 | 登记 |
| N6 | test/ 内临时测试文件卫生债 | RLC | 卫生 |
| N7 | Pilot 无 lint 配置 | Pilot | 卫生 |

## 四、使用依据

- /srv/fleet/TriRLC（package.json/test/64 件/git 现势/docs/registry/test-state.md）
- /srv/fleet/TriPilot（package.json/tests/2 件/quality-gate.yml/git 现势）
- /srv/fleet/TriCompany/docs/testing/（lg069-merge-window-gate-final-20261014.md·trilc-dp-seg2a-acp-verify-20261020.md·test-state.md）
- ss -tlnp 现役端口读数（只读）·git 本地 ref 现势（零 fetch·守只读约束）

## 五、改进面

→ 见姊妹卷 `r-duty-ste-improvement-test-quality-gate.md`（同目录）。
