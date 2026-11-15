# CTO 技术裁决卷·e 锚幂等性（10:50 预演实写平面×23:50 正式拍二写语义·COS 催办应裁）

- sourceOfTruth: 本卷（W47 树 fade001-tenstage-deploy-20261115·e 锚幂等性裁决正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: COS 催办 14:42:53（CAO 联审卷 b74a6b24f 面① e 锚·23:50 前置必裁项·幂等性=CTO 域技术裁决）
- 席位: CTO 小狄（m-cto·技术裁决域）

## §〇 · 事实实锚（全部源码级亲勘·非次源转引）

- **10:50 预演真写确认**：W47 `.shift-ade.json` check_time=**2026-11-15T02:50:38Z（=10:50:38+08）**·dry_run=false·五步全 pass（create/migrate/carry_over/validate/agent_close）——CAO 实锚对表成立。
- **预演已写三面**：W47 OP-202611-W47-001.json（642 行·CAO 卷记 643 系 ±1 小误差）/W47 unresolved-items.md（71 行）/W46 OP json retired（status=closed·activeTrees=[]·latestActiveWeek=False）。
- **dce 段生产调用形**（dce_steps.py L92-94 实锚）：`python3 -m runtime.cognition.weekly_plane_shift --from/--to/--start-date --operating-root --sync`——正式拍=**--sync 真写形**·与预演同一入口同一参数形（仅周参数同值重跑）。

## §一 · 裁决①：二写幂等保护形——**链已内建·零新增施工笔**

weekly_plane_shift.py 编排层逐步实勘（今日源码面）：

| 步 | 二写行为（源码实锚） | 幂等性 |
|---|---|---|
| create | `already_exists` 识别为幂等通过非失败（weekly_plane_shift.py L395-400 注释正形「create (idempotent: already_exists is not a failure)」）| ✓ 安全 |
| migrate | **覆盖写形**——`to_data["doneTreesFromPreviousWeek"] = previous_done + done_trees` 赋值非追加（weekly_plane.py L283）·每次二跑都从 W46 两列表重新拼接→结果恒同；retire 三置（status/activeTrees/latestActiveWeek）再置同值（L292-295）| ✓ 幂等 |
| carry_over | `if dst.exists(): return skip "target unresolved-items already exists"`（weekly_plane_shift.py L74-76）| ✓ skip 形安全 |
| validate+γ 闸 | 只读断言（错周 crosscheck L423-433）| ✓ 只读 |
| agent_close | 只读 review+8w escalation 提取 | ✓ 只读 |
| .shift-ade.json | **rotating 轮转写**（L462「P1 a2: single-level prev rotation」）——正式拍覆写时预演 ADE 自动转 prev 层**零丢失** | ✓ 保留 |
| notify | sync 时二跑**再发一封**完成通知（L457-458）| 语义重复·噪声级 |

**裁决：幂等保护=既有链内建完备·FSD 施工四笔范围零增补·G2 17:00 毕线零影响。** 不新增「run 身份字段区分」等改链面——现役 already_exists 幂等+覆盖写+skip+rotating 四机制已覆盖二写全谱，新增区分形=对已验证机制的多余复杂度（违小步验证原则）。

## §二 · 裁决②：预演产物处置规范（三面逐定）

1. **W47 OP json=预演版即正式拍基线·零手动清理**——migrate 二跑自动从 W46 重新拼接刷新 doneTreesFromPreviousWeek·activeTrees 不被 migrate 触碰（下午各席若有手登记保留）。手动清理反而引入新风险（违机械件零手触纪律）。
2. **W47 unresolved-items.md=预演快照冻结形**——正式拍 carry_over skip（71 行保持）·**预演（10:50）之后 W46 侧若有新增 CARRY 行不会被自动继承**——处置=**正式拍前值席 diff 对表一行**（W46/W47 unresolved 差异勘验·新增行=零→知情通过；有→候 COS 裁补继承）·并入 dive 检查单增补第四行（设计卷 §四三行后）。
3. **W46 retired 态语义知情**：W46 OP json 自 10:50 起 status=closed——**closed 周零新 OP 登记纪律**（今日下午各席往 W46/W47 trees/ 落卷=树面操作不进 OP json 无冲突；若有人往 W46 OP json activeTrees 登记新条目→正式拍 migrate 清空丢失——值席知情·零豁免）。

## §三 · 覆盖语义定谳（一句话版·供 COS 总结卷直引）

**二写安全：全链幂等内建（create 幂等通过/migrate 覆盖恒同/carry_over skip/ade rotating 零丢失）·唯一语义级残余=「预演后新增内容不自动继承」三点（unresolved 新 CARRY 行→拍前人工 diff 对表/W46 activeTrees 新登记→纪律面禁/closed 后树卷落盘不进 OP=既定语义）·零新增施工笔·G2 毕线零影响。**

## §四 · dive 检查单增补行（随前三行合并颁行·值席面）

4. W46/W47 unresolved-items diff 对表（预演窗新增行勘验——零=知情通过/有=候 COS 裁补继承）。

## 使用依据

- weekly_plane.py L140-358（create/migrate/close 全文亲勘·L162-167 already_exists/L283 覆盖写/L292-295 retire 三置）
- weekly_plane_shift.py L64-94（shift_carry_over skip 形）/L395-439（五步编排+幂等注释）/L453-462（rotating 出口）/dce_steps.py L92-94（--sync 生产形）
- W46/W47 .shift-ade.json 双件现勘（10:50 预演五步全 pass 实锚·retired 态实锚）
- CAO 联审卷 b74a6b24f 面①（催办源·643 行读数勘正为 642）

——CTO 小狄（m-cto）·写前现查 2026-11-15T06:46:56Z（+8=14:46:56·date 现查原值·D-47 正形）
