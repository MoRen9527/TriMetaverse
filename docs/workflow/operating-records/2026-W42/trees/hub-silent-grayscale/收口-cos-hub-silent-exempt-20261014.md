# COS 收口卷：值守候令静默态豁免窗（FSD 三件毕）

- sourceOfTruth: 本件（docs/workflow/operating-records/2026-W42/trees/hub-silent-grayscale/收口-cos-hub-silent-exempt-20261014.md）
- syncMode: static（收口定格）
- lastSyncedAt: 2026-10-14T04:49+08:00（date 现查·写前跑）
- 收口对象: FSD 毕报 fsd-quiet-hours-build-20261014.md（04:46:59 落款·窗 04:40-06:10 提前毕）
- **收口判定: 收讫·五项抽验全绿·抄 COO 归档**

## 一、独立抽验读数（非转抄）

1. **commit 链五笔实证 ✓**——10393c34f（A 辅 04:31:14）/1665ad3b1（B 主 04:35:59）/59a4c0f2c（毕报主体）/30ba1acdd（补段）/cc20d9324（merge 五轮）全在 TMV dev；cc20d9324=sg-server/dev 顶（fetch 后 merge-base --is-ancestor 断言过）。
2. **quiet-hours.mjs ✓**——isQuietHours 谓词 h>=22||h<8 在位；头注语义三条齐全（anchor-error 不豁免/reminder 不豁免/豁免不写 state 出窗首轮即告警）。
3. **duty-tick-signal.mjs ✓**——内容节拍时戳 ≤35min（mtime 弃用理由=sg checkout 不保源·两机一致正形）/allIdle·dutyIdle 双语义/fail-open 断供照发——与毕报逐条对得上。
4. **dispatch 豁免段 ✓**——hub-silent-detect.mjs L229 isQuietHours+L232 双判据映射（duty-escalate→tick.dutyIdle·idle-escalate→tick.allIdle）+skipped 留痕数组（log-only 不写 state 形态吻合）。
5. **信号源活体 ✓**——tick-latest.md 04:37:06 拍在位：「m-duty-cos=候令」13 席+「本地在干活 m-fsd」⇒ allIdle=false/dutyIdle=true——与 FSD 04:45 拍真读一致（施工态区分正确·条目告警照发=设计行为）。

## 二、如实边界（承毕报·不加重不减轻）

- 豁免分支生产实触读数未取得（今夜 alerts 全 reminder 级未及 30min 线）——机制面证据=真值表+信号真读+端到端零炸；首个自然实触窗=下个 30min+ 全席静默段（候灰度评估）。
- FSD lastSyncedAt 预填造值 +47 秒自查抓到即勘正（D-47 纪律实证·本卷不另立观察项）。

## 三、候考项转呈（不随本收口闭）

1. **reminder 夜间照发实锚**（04:45 拍 4 条 nudge）——「reminder 入否豁免域」候灰度周 BOD/COO 评估裁。
2. **sg TriMMC 8710 healthz 空回疑 executor 停**（TriRMC 10-04 同族先例）——FSD 已报 BOD·候晨检 M 面勘。
   - **勘正注（2026-10-14T01:35:24Z 现查·COS）**：机位矩阵勘正——8710=河源 TriRMC 端口·sg 侧 TriMMC 现役端口=**8712**（docs/memory/daemon-plane-locality-matrix.md 现值+MEMORY 索引行同勘）；sg 探 8710 空回=探错端口预期形，**假缺口定谳非 executor 停**（「探错端口空回≠服务停」）——本候考项销项，晨检 M 面免勘。
3. 技术债三条（FSD 已标）：豁免时段硬编码粗粒度/豁免分支无自动化单测/拍文断供窗噪声回归（fail-open 代价）。

## 四、收口面

- 抄 COO（毕报转你收口抄 COO 令兑现）·journal 增量随落。
- 附带旁证：tick ②四口 8713 行 pwr=100% ac=true——LG-069 终态（CEO 亲插·机器活）daemon 面再证。
