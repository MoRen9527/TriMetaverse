# CTO 对表卷·DP-20261123-026 三如实注（ⓐM3-v2×aggregate 未对齐／ⓑM9 FUSE 按态／ⓒA/B 口径输入）

- sourceOfTruth: 本卷（trees/fade001-evolve-20261123/cto-dp026-parity-table-20261123.md·对表正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: DP-026 取号（COS 13b73a22b·三如实注对表·CTO 主责ⓐⓑ·CAO/CHO 协ⓒ）+RDT 教程 526fbc0（三如实注来源·不裁决转对表）

## §一 · ⓐ M3-v2 双对象门槛 × 代码 flag 边 aggregate average（对表）

**条款面（M3-v2·CEO 2026-11-23 03:33）**：debug→test 需 **A>90 且 B>90**；test→prod 需 **A>95 且 B>95**——两对象分立·不加总·任一不达标停留原态。

**代码现状（教程 08-loop L113 如实注·本席复核 6220331+bbа27a0 态）**：`nextFlagEdge` 的 E1/E2/E5 判据取「最近一轮 **aggregate.average**」（**单值**）——与 M3-v2 双对象**并存未对齐**；`computeJointGrade`（轮末判级面）已按 A/B 双对象（DP-021 后单一源）。

**对表结论=差距确证·裁形（本席 11-22 已出·重申）**：
1. `nextFlagEdge` 增**双信号入参 `{avgA, avgB}`**——全 edge 判据统一双对象（E2/E5 双达标判·E3 人机环+分数面照旧）；
2. **单 side 判定废止**（aggregate.average 不再作 flag 边输入·保留供趋势/展示）；
3. 落点=**P4 补件批**（本席排窗·非本轮施工·候 COO 取号派）。

## §二 · ⓑ M9 FUSE 仅 test 按态分支（对表）

**条款面（M9·CEO 裁）**：**FUSE 仅 test 态生效**——test=8 轮上限照役（M8 语义）；debug=不适用（每轮停「出稿→候 CEO 批」审批步·天然节流）；prod=单轮直走不适用。

**代码现状（教程 L122 如实注·本席复核 bba27a0）**：`runLoop` 的 FUSE 判断在循环体内对 `round_count` **统一检查**（`if (st.round_count >= FUSE_MAX_ROUNDS)`）·**未按 flag 分支**。

**对表结论=差距确证·裁形**：
1. 代码**按态收窄**：`if (flagVol.flag === 'test' && st.round_count >= FUSE_MAX_ROUNDS)`——debug↑不熔断（审批步节流为界）/prod 不入 loop（既有拦截）；
2. **debug 态的无限轮保护**=审批步+M4-v2 呈批（非 FUSE）——如实注；
3. 落点=与ⓐ 同批（P4 补件批·同文件 round_runner）·候 COO 取号。

## §三 · ⓒ A/B 对象语义两套口径（CTO 面输入·冻结归 CAO/CHO）

**本席技术面输入（供冻结窗）**：
1. **对象定义（唯一语义·本席认可）**：**A=周迁移完成质量**（CEO 11-23 18:02 联审召集口径）/ **B=fade-001 自身对 fade 协议的遵循和实现度**；
2. **计算口径（已定形·本席 M3 聚合卷）**：**mean-of-seat-means**（每席对象内维均→跨 7 席等权均·防维度数偏权）·M3 卷 §一；
3. **「两套口径」之实指（本席判读）**：①**aggregate.average（单值·flag 边现役）** ②**A/B 双对象（M3-v2 条款+computeJointGrade 现役）**——即**主口径与遗留口径并存**·非对象语义分歧；
4. **冻结建议**：以「A/B 双对象（mean-of-seat-means）」为唯一评分口径·aggregate.average 降级为展示面——**终裁归 CAO/CHO 冻结窗**（我面技术输入止此）。

## §四 · 使用依据

M3-v2（CEO 2026-11-23 03:33）+M9（CEO 裁·教程 §2.3）+RDT 教程 526fbc0（三如实注来源）+本席 M3 聚合卷（mean-of-seat-means + nextFlagEdge 双信号 11-22 裁形）+代码复核（bba27a0/6220331）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-23T12:13:04Z（+0800=20:13）〔commit 时戳锚·D-47 正形〕
