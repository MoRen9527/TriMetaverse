# C 条修法卷 · 清空语义真落地（landLocalConfig 缺口修法判据·排 10-09 后维护波首窗基座）

- sourceOfTruth: 本件（CTO 修法判据正身；对表=cto-cd-rulings-20261007.md C 条+cpo-ste-observations-verdict L58-71）
- syncMode: final
- lastSyncedAt: 2026-10-07T05:33:55Z（date 现查 13:33:55+08 周三）
- 判据席: CTO 小狄（m-cto）；施工窗=10-09 后 TriModel 配置链维护波首窗（C 条裁决排期）

## 一、缺口机理（本席 13:33 实勘 TriRMC key-cache.ts，比裁决卷预判深一层）

1. `src/config/key-cache.ts:431-440`：`landLocalConfig(lc)` L432 `if (!lc) return null`——lc=null 直接跳过落地（CPO 卷认定的缺口点，坐实）。
2. **根因在调用点 L581-583 语义混同**：防抖表达式 `pull.localConfig && pull.localConfig.version !== cache.version ? pull.localConfig : null` 把两种 null 混进同一分支——①同版本防抖 null（设计意图，正确）；②清空卡 null（`pull.localConfig` 缺席→表达式短路 false→null→**永远被防抖吞掉**）。清空态在现协议下不可表达，缺口是结构性的。
3. **tier2 复活链实锤**：L588 缓存保旧（`_keyCache?.localConfig ?? null`）+L476-478 TK-017 stale 宽限（过期缓存仍作 fallback）——清空后缓存层继续持旧配置，daemon 侧持续用旧值，与 CPO 验收锚「settings.json 键删除/默认值+版本推进」双向不满足。

## 二、修法正形：协议显式清除指令（A 案）

1. **B 案否决记录**：「localConfig 缺席=清除」纯 daemon 侧判——TriModel 旧版响应/网络异常/部分失败均会缺席，误判=误删生产配置，fail-safe 不可接受。
2. **A 案正形（两端协同）**：
   - **TriModel 服务端**：卡清空操作下发形态增显式指令——`localConfig: { cleared: true, version: <递增版本> }`（清空也是一次版本推进，非字段删除）。
   - **TriRMC daemon**：`landLocalConfig` 增清除分支——收 `cleared:true` → 落地=删对应键/恢复默认值（writeLocalSettings 增清除模式）+缓存 localConfig 置清除态+`version_applied=清除版本`+回执 applied（report 带 write_result）。
   - **防抖不动**：L582 表达式改为清除指令旁路防抖（`cleared` 显式时不走 version 比对），同版本防抖语义保持。
3. **tier2 栅栏（裁决卷预钉判据落点）**：清除落盘同步置缓存清除态+**版本栅栏**——stale 宽限与下轮拉取拒绝 ≤清除版本 的 localConfig 回填，tier2 复活链封死。
4. 过渡期诚实注（裁决卷既定）随批 B 先上，与 A 案施工解耦无阻塞。

## 三、工程量勘正（回 CPO 口径）

CPO 卷估「工程量小」基于纯 daemon 侧改——实勘后为**两端件**（TriModel 服务端下发协议+TriRMC daemon 落地链+缓存栅栏），工程量修正为中（半窗内仍可毕，排期 10-09 后首窗不变）。四域波及面：TriRMC 为唯一 daemon 侧 settings.json 落地件（设计卷 §2.1 矩阵），其余域 harness 位落地链同构缺口施工窗一并实勘对表。

## 四、验收锚（接 CPO 卷 L65 值面断言+本卷增补）

1. 清空下发→settings.json 对应键删除/恢复默认值（值面断言）；
2. `version_applied=清除版本` 回执+卡面 status 三态如实显；
3. **栅栏断言**：清除后 stale 宽限/下轮拉取不回填 ≤清除版本 旧配置（复活链封死读数）；
4. 网络异常/服务端旧版响应（无 cleared 字段）不触发清除（fail-safe 反向锚）；
5. 全量测试套独立基线对照。

## 使用依据

- TriRMC `src/config/key-cache.ts` L431-440/L577-597/L476-478（本席 13:33 实勘）
- cto-cd-rulings-20261007.md C 条（排期+预钉判据）；cpo-ste-observations-verdict L58-71（语义定谳+验收锚）
