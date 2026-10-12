# Q3.2 UI 升版施工单 · TriModel 卡面端口文案 8712→8710（CTO 窗前对料卷）

- sourceOfTruth: 本卷（trees/q32-ui-upgrade/cto-q32-construction-order-20261010.md）
- syncMode: static（窗前对料·窗内照走·毕报回点 COO）
- lastSyncedAt: 2026-10-10T15:2x（date 现查 15:24 前后·UTC 07:2x）
- 窗位: 10-10 16:30-17:30（BOD 采认+本席工量自估 ≤1h·closeout-track @closeout L42 落定行）
- 任务定性: 单点文案改动+升版渲染+发布位追平——本席直做（单点判据面活省派工环）

## 一、改动面锁定（窗前实勘·四行文案+两行断言）

**正名核验**: TriMMC=M-SG **8710**（trimmc 现役·sg loopback）/TriRMC=R-HY **8710**（S3 卷 B4 活体裁定 jobCount=3 实锚）——8712=旧值残留，两卡同改。

| 文件 | 行 | 改 |
| --- | --- | --- |
| `TriModel/ui/index.html` | L344 | `meta: 'M 面 · 服务域 · M-SG 8712'` → `M-SG 8710` |
| `TriModel/ui/index.html` | L352 | `meta: 'R 面 · 服务域 · R-HY 8712'` → `R-HY 8710` |
| `TriModel/ui/index.html` | L1504 | `'TriMMC · M-SG 8712'` → `8710` |
| `TriModel/ui/index.html` | L1506 | `'TriRMC · R-HY 8712'` → `8710` |
| `TriModel/test/ui-fourplane.test.ts` | L538-539 | 端口对等断言同步（`'M-SG 8712'`→`'M-SG 8710'`·`'R-HY 8712'`→`'R-HY 8710'`·注释端口表 8712/8713/8712/8711→8710/8713/8710/8711）——BOD 21:44 打回钉断言族，**测试与文案必须同批改**（改文不改测=假绿） |

- 不动项: rlc 卡 8711（L341 special 行+断言）/mlc 卡 8713——正名值正确原样。

## 二、施工序（窗内）

1. 六行改动一次落（§一表）。
2. `npm test` **全量**（全量读数回报纪律：全量读数+既有失败逐族归因·ui-fourplane 族必绿含端口对等断言新值）。
3. `npm run build`（渲染 ui/→dist/ui·build:verify 加冒烟）。
4. commit+push 双腿双验（TriModel 仓 github+origin(sg bare) 双 remote·**推后必双验**惯例）。
5. 跨机发布位追平：**归值席/COS 通道**（README Deployment 节分工定谳·LG-035 P3-sg 切片 2「部署面归 COS」）——本席毕报列明候值席段（sg/R-HY 服务机侧 pull+build+重启服务为值席施工面），不在本窗硬凑跨机施工。
6. 毕报回点 COO（读数+双腿顶 hash+追平边界声明）。

## 三、门与回滚

- 门: 全量测试绿+端口对等断言新值在场+build 零错。
- 回滚: 单 commit revert 即回（零持久副作用·dist/ui 重建即还原）。
- 风险: 近零（纯文案+断言同步·无逻辑面）——唯一注意=测试先跑基线读数（改前全量既有失败族录档防混账）。

——CTO 小狄，窗前对料毕。
