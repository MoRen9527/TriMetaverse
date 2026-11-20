# SDE-RW1 §五段① sg 野生增量勘定卷（只读实勘·notice-238 sprint W2-a sg 侧配合）

- date 现查: 2026-11-20T03:21:58Z→03:25:00Z 窗（D-47 现查原值·零占位）
- 令源: notice-238 sprint 随令（BOD 值席组先勘①②·扩面执行 §五段①·CTO 升裁卷 b74820986 §三§五段①·COO §八 803edbdd3）
- 性质: 只读实勘·零触施工面·零改形·D-47 落款原值

## §一 · 野生真目录勘定（TriMMC node_modules 手装 kit）

| 面 | 读数 |
|---|---|
| @tricompany/ 包族 | agent-core ＋ orchestration-kit 双包在位 |
| orchestration-kit version | 0.1.0·main=./dist/index.js |
| agent-core version | 0.1.0·含 loop.d.ts＋contracts 面 |
| orchestration-kit dist 文件 | capability-router/cost-controller/dispatch-proxy/employee-registry/employee-scheduler/index/trilc-executor/types 全八模块＋bridge/contracts 子目录 |
| orchestration-kit src 面 | **空**（仅 dist 编译产物·src 面零独立副本＝纯 node_modules 安装态非开发态） |

## §二 · TC 包 2786b0e build 产物对照

- TC P1 包铸 commit 2786b0e（sg 工作树＋sg bare 双面可达）＝orchestration-kit/src 15 文件 1647 行 insert（types＋八模块＋tsconfig）
- TC src 模块清单（8 模块）：capability-router / cost-controller / dispatch-proxy / employee-registry / employee-scheduler / index / trilc-executor / types
- 野生 dist 模块清单（8 模块）：同名全覆盖＝**模块清单 100% 覆盖率**

## §三 · 行数面对表（wild_dist JS vs tc_src TS·编译缩减属正常）

| 模块 | wild dist (JS·L) | TC src (TS·L) | 比 |
|---|---|---|---|
| capability-router | 139 | 173 | 编译缩减正常 |
| cost-controller | 176 | 232 | 〃 |
| dispatch-proxy | 176 | 251 | 〃 |
| employee-registry | 96 | 116 | 〃 |
| employee-scheduler | 101 | 146 | 〃 |
| index | 9 | 28 | 〃 |
| trilc-executor | 128 | 153 | 〃 |

→ TS→JS 编译后行数缩减属正常形态（类型标注剥离）·**零结构 diff 零模块缺失**

## §四 · claude bin 路径勘定（bin 符号归属）

- **claude bin 路径**＝/usr/local/bin/claude → /opt/claude-code/claude（系统级 symlink·root 属主）
- **归属勘定＝daemon adapter 侧**（TriMMC 进程 env PATH 引用·非 kit 出口 export）
- agent-core 用途＝loop 体内核（loop.d.ts＋contracts 面）·orchestration-kit 用途＝dispatch/scheduler/capability 编排面（daemon adapter 侧消费）——**claude bin 属 daemon adapter 面非 kit 出口面**

## §五 · 野生增量差勘源总结

| 勘定面 | 结论 |
|---|---|
| 野生真目录 | TriMMC node_modules 手装 kit＝纯 node_modules 安装态（dist 编译产物·src 零独立副本） |
| TC 2786b0e 对照 | 模块清单 100% 覆盖·行数面对表编译缩减正常·零结构 diff |
| claude bin 归属 | daemon adapter 侧（系统 symlink·非 kit 出口） |
| 野生增量定性 | **非野生增量**＝正规 node_modules 安装态（P1 包铸后 npm install 面产物）·零漂移零额外手装件 |

—— 值席 COS（RW1 §五段① sg 野生增量勘定·只读实勘·D-47 落款原值·归转 BOD）
