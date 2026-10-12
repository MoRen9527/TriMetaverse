# Q3.2 UI 升版毕报 · TriModel 卡面端口文案 8712→8710（2026-10-10）

- sourceOfTruth: 本卷（trees/q32-ui-upgrade/cto-q32-readout-20261010.md）
- syncMode: static（毕报终卷）
- lastSyncedAt: 2026-10-10T16:35:56+08:00（date 现查原值·UTC 08:35:56Z）
- 执行席: CTO 小狄（m-cto 本席直做）；窗框 16:30-17:30｜施工 16:29-16:36 **提前 ~54 分钟收窗**（工量自估 ≤1h 实证）
- 对料依据: cto-q32-construction-order-20261010.md @1e940a63（窗前对料卷·六步照走）

## 一、改动面（六行一次落·与施工单 §一表逐行对平）

- `TriModel/ui/index.html` 四行: mmc 卡 nav meta（L344）/rmc 卡 nav meta（L352）/四签实例行 mmc（L1504）/rmc（L1506）——8712→8710。
- `TriModel/test/ui-fourplane.test.ts` 两行: 端口对等断言+注释端口表同步（BOD 21:44 打回钉族·改文改测同批防假绿）。
- 不动项核验: rlc 8711/mlc 8713 原样（正名值正确）。

## 二、门与读数（全量四项·全量读数回报纪律）

| 门 | 基线（改前） | 改后 | 判 |
| --- | --- | --- | --- |
| 全量测试 | **374 tests·360 pass·0 fail·14 skipped**（124s·零既有失败族） | **374·360·0·14**（148s·逐项同基线·零新增 fail） | ✓ |
| 端口对等断言 | （旧值 8712 形） | 新值 `'M-SG 8710'`/`'R-HY 8710'` 在场 pass | ✓ |
| build | — | tsc 零错+copy-ui ui/→dist/ui | ✓ |
| dist 渲染追平 | — | dist/ui/index.html: **8710×4·8712×0 残留** | ✓ |

## 三、发布与边界

- **双腿双验**: TriModel 仓 github+origin(sg bare) 同顶 **@a17deaff**（e5394a4→a17deaff·ls-remote 双腿对表过——双 remote 必双验惯例照办）。
- **跨机发布位追平=归值席/COS 通道**（README Deployment 节分工定谳·LG-035 P3-sg 切片 2「部署面归 COS」）：sg/R-HY 服务机侧 git pull+`npm run build`+服务重启为值席施工面，**不在本窗硬凑跨机施工**——候值席窗执行，毕报随窗列明。
- 回滚锚: 单 commit revert 即回（零持久副作用·dist/ui 重建即还原）——零风险窗。

## 四、窗毕读数小结

- 窗内毕（16:36）·零异常零超窗·改动面=施工单预锁六行零外溢（无范围爬升）。
- 正名一致性: 卡面 UI 文案与 daemon 机位矩阵现役正名（TriMMC=sg 8710/TriRMC=R-HY 8710）全面对齐——8712 旧值残留清零。

——CTO 小狄，Q3.2 毕报毕。毕报链: COO 督办（回点）→BOD 窗收口知情；跨机追平候值席段随窗。
