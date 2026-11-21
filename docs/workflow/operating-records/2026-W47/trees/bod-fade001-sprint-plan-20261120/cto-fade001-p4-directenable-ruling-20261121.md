# CTO P4 设计定稿卷·直接启用形（CEO 决议戊·自动拾取链接口定形·2026-11-21）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-fade001-p4-directenable-ruling-20261121.md·P4 直接启用形设计正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 定夺（自动拾取=直接启用·COS 传达 17:16）+本席定谳卷 7c389cac3（原设计）+对齐结论 77e937d9（勘正「P6 后启用」→本卷直接启用形）
- 分工: 任务书生成器=COS 主笔（COS 805 落账 53eb3a43a）·P4 状态机源码=fsd（已毕 177feb8/cc61354）·本席=P4 设计正身+接口终审

## §一 · 落形序（直接启用形·七步）

debug 联审（7 席 opinions）→ **任务书生成器**（COS 主笔·opinions 五字段映射·缺 target/verify/rollback=退回人工）→ **CEO 批（审批 gate·人环内建）**→ 挂载 `trees/<week>/trees/fade001-evolve-<ts>/`（现役树协议）→ TriRMC 拾取（现役 cron executor）→ 施工（fsd 面·源码+测试）→ 毕（候验收态）→ **点火触发**（新一轮 test 态 chain_runner 起跑）。

## §二 · 接口两字段（P4 状态机预留·fsd 已落）

- `pending_charter_ref`：待批任务书指针（debug 联审毕→生成器输出→审批前的挂起点）；
- `charter_approval`：审批态枚举（`CEO`｜`COS`·按 flag 态分配——debug=CEO 批／test+prod=COS 代批·**审批 gate 内嵌非新流程**）。

## §三 · 两红线（直接启用下更关键·脚本层兜死）

1. **自动施工范围=源码+测试**——dist/部署/重启/配置生效=人工窗位令照役（不可逆面零自动）；
2. **`auto_dispatch:true`=CEO 批面显式赋予·默认缺省不置**——生成器脚本层面默认不写该字段（COS 主笔落笔时兜死）·防自动面被误扩大到非 fade-001 线。

## §四 · 安全与回滚

- 点火自动=资源消耗面：七席≈25min/轮·护栏四件（余额门 floor20/累计门/cost-log 读/轮级告警）spawn 面保底；
- fail-safe 停不重试（施工红→停+毕报挂候裁）；
- 回滚：四开关（spawn/CLI 双形·两席/七席·意见注入·flag 切换）+任务书 rollback 字段逐件。

## §五 · 我的建议作废自领（如实）

「先人工闭环一轮+P6 后启用」建议=**作废**（CEO 论证：debug 任务书 CEO 批=天然先手动一轮·审批 gate 内建人环）——本席推理惰性自领：把已内建人工环误当缺失项（与「源码现状≠设计真源」同族）。

## §六 · 使用依据

CEO 定夺（决议戊·COS 17:16 传达）+COS 805 落账 53eb3a43a（生成器主笔+两红线承录）+本席 7c389cac3/77e937d9/f46628ec（五字段 schema 来源）+fsd P4 源码面 177feb8（接口两字段已落）+COO c87bd869（无人值守红线）+D-15/D-24/D-27 v4/D-46/D-47/D-76/D-84。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕
