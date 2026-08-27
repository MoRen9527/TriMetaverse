# p0fix4-trimodel-stream 验证记录（tick 20260827T090317Z）

## §1 结论判定

**blocked-workaround-verified**——P0-1 修复设计与对抗守护在本 tick 内获得沙箱真值背书（tsc 干净+双轮隔离 29/29 全绿、既有套件与开工基线逐字同型零回退），但 **TriModel repo 内落位与 push 两 leg 被三重事实障碍封死，本 tick 无法达成 doneCondition 的完成定义**；按红线3 如实标注 blocked 并停，树顶层 status 维持 active 不臆造收口。工件三件套（fixed 文件 297 行+守卫套件 385 行+复现工具链）全部入库待授权侧解封后即取即用。

## §2 三通道核验表

| # | 核验项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 修复标的定位与审计零漂移 | PASS | rmc-TriModel.md P0-1 = client.ts stream try/catch（活体 :226-239 与审计 :216-229 行号差系 glm registry 块膨胀所致，语义点逐字对应）；PE-1 先读审计全文并在报告提取场景三要素 |
| 2 | PE-1 工件纯度 | PASS | git diff --no-index 对照活体仅三 hunk 净增 43 行零删改零外溢；glm registry（含 ：95 破损缩进行）/TEMP DEBUG/chat 区逐字未动 |
| 3 | 契约四象限实现 | PASS | pe1-fix-report.md §2.1 表＝实码一致；emitted 帧私有旗标 yield 前自增；嵌套委托帧归属链推演正确且被 g1/g2 实跑验证 |
| 4 | 门禁基线差分 | PASS | round0-a/b 双轮 22 tests/22 pass 失败集为空=T0；sandbox-round-a/b 双轮 29 tests/29 pass：既有 22 例失败集与 T0 逐字同型（新增失败集为空），守卫新增 7 例全绿 |
| 5 | tsc | PASS | 活体 npm run check 干净（外来 WIP 面）+ sandbox tsconfig --noEmit 干净（修复面）双取证 |
| 6 | 对抗守护覆盖审计向量 | PASS | g1=拼接死证（fetch 恰 1 拨=B 流从未启动）；g2=首事件前 fallback 接管（恰 2 拨）；g3/g4=无 fallback 双象限；g5 单元钉；g6/g7 回归钉 |
| 7 | 活体完整性义务 | PASS | /srv/fleet/TriModel 工作树全程零触碰（apply 尝试在写入前被 EACCES 拒绝，WIP 归档存 reports/wip-archive/src-client.ts.asfound 且 sha256=d2c7dffe… 记录在案；无 restore 负担） |
| 8 | doneCondition 达成度 | **FAIL(2/4)** | ✅P0-1 修复工件齐（沙箱背书形态）/✅两类边界测试齐；❌repo 内落位（W1 属主墙+W2 数据态墙）/❌push 完成（W3 远端分叉墙，非 fast-forward 必拒） |

## §3 残差移交（按归属）

1. **【授权侧·立即可做】TriModel 工作树解封**：src/** 属主 uid=197609、test/** 属主 uid=0（probe-fs.mjs 取证）——或放行编排会话写权，或将 p0fix4 下轮改派 uid197609 可写载体。
2. **【授权侧·glm 在途线归置裁定】**工作树 20 文件脏区含三条独立在途线（glm registry 切换+TC-4b TEMP DEBUG+trimetaverse Authorization 真实 Bearer 修复+行尾噪音 13 文件）——需裁定正式提交/收起/拆分；在归置前任何人的修复提交都无法做到不裹挟。
3. **【授权侧·分支和解】**本地 dev=a445b0e 落后 bare /srv/git/TriModel.git dev=6476812 三笔（a5638e9/aaba31b/6476812），incoming 触 keys/config/trimetaverse/client 四文件恰均处脏区——merge 必被拒、stash 白名单外、推送必 non-fast-forward。和解后下 tick 直接：固定文件覆盖 src/client.ts→守卫复制 test/→重跑门禁→两原子提交 push，预计半小时内闭环。
4. **【CTO】aaba31b 已给 chat/stream fallback 日志补 reason**——解封落位时以 bare 版行为基底再套用本补丁可少一次合并冲突；StreamAbortedError 建议同步 re-export 进 src/index.ts（消费方 import 便利，属 P2 范畴不入本树）。
5. **【运维知悉】**heyuan 生产 trimodel 符号链接消费当前工作树（未提交态）——生产实际运行的是 W1 属主 uid197609 写入的在途混合版；p0fix4 本 tick 未改变该状态分毫。

## §4 门禁口径与证据档案

- 差分法延续（p0fix2/p0fix3 固化）：round0-a/b=T0 开工基线（活体 22 tests/22 pass 空失败集）；sandbox-round-a/b=修复后镜像（29 tests/29 pass）。TAP/log/json 六份存档 reports/gate-logs/。
- 解释器：默认系统 node v18.20.8（tsx 4.20 可跑，无 TriLC 式 node:sqlite 环境性问题）；npm script glob 形态沿用显式枚举等价口径。
- 沙箱制说明：reports/sandbox-build.mjs 只读镜像 src/+test/+package/tsconfig 四件，overlay 仅 client.ts(+43)（diff -r --stat 实证唯一差异）与守卫注入，node_modules 以 symlink 锚定依赖解析；镜像本体不入库（脚本可再现，登记 untracked 由 .gitignore 语义外如实留存本机）。
- 守卫计数勘正：子实例自报 8 it，编排 grep 实测 7（29=22+7 对平），如实入账。

## §5 未证清单（诚实边界）

- 沙箱验证未覆盖真实上游 SSE 断流（mock 层注入）——与既有 client.test.ts Streaming describe 同一保真层级。
- StreamAbortedError 在 TriLC/TriMC 等 agent-core 消费方的 catch 兼容性未扫描（抛错对象新增类型，上游未辨型时表现为普通错误上抛，行为等同审计所述「向上抛错」建议分支，无拼接恶化面）。
- 守卫依赖 fetch mock 顺序性假设 T1 由实跑两轮正向兑现但未做压力重复（>2 轮隔离未执行，时间窗所限）。

## §6 使用依据

tree-op p0fix4-trimodel-stream PE-1/PE-T 两节点 action 原文；rmc-TriModel.md（TA-1 审计）P0-1 全文；p0-fix-and-trilc-merge-plan.md §一批E；gate-runner.mjs/apply-window.mjs/probe-fs.mjs/sandbox-build.mjs 与 gate-logs 七轮存档；pe1-fix-report.md（86 行）+stream-fallback-guard.test.ts（385 行）全文；probe-fs.mjs 权限取证输出与本 log.md 动作序列#1-#6。
