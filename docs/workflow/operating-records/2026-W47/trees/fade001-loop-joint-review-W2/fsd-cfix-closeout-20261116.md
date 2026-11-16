# FSD C 族修毕报卷（run_id 双 W bug·payload 模板归一单 W）

- sourceOfTruth: 本卷（trees/fade001-loop-joint-review-W2/·C 族修毕报正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 席位: FSD 小全（m-fsd·实现交付面）
- 落款: 2026-11-16T04:46:39Z（+8=2026-11-16 12:46:39·date 现查原值粘贴）
- 法源链: CTO B/C 修向裁决卷（46afd9bc3·C 族裁 A+B 族 owner=STE·修件窗 11-22 首拍前毕）→W2 验收 GO（cto-w2-acceptance-threshold-ruling-20261116.md·7f6575934）→threshold=70 COO 会签生效（9625290f9）
- 施工锚: **TC 13f7bcd**（白盒钉案·+20 零删）+ **R-HY payload PATCH**（52c54a8d→09644869a812ed16579624cb3287a4f0·bak-cfix 回滚锚在位）

## §〇 · 修向（CTO 裁 A 遵行）

payload 模板 `shift-W{fromWeek}`→`shift-{fromWeek}`（run_id 归一单 W 形=T1-1 门禁契约正形 a2c246908）——修实现归一就契约·判据零改动（B 案判据迁就 bug 拒·脏形固化不可倒置遵行）。B 族（rubric loop 判据增补）owner=STE 非本席·本席零触 rubric-firstshoot.json（「rubric 零改卷」禁令维持）。

## §一 · 施工链（四实锚）

1. **TC 白盒钉案**（13f7bcd·test_score_engine.py +20）：`test_run_id_double_w_bug_shape_rejected`——第 10 轮实锚形 `shift-WW46-20261116T002143Z` B/C 两族正则拒直证+单 W 正形对照 pass——防模板回退与判据放宽二向回退钉。
2. **门禁三连**：score_engine 22/22（21+1 新案）·cognition 全量 262 OK·validation 438/5/1 基线零漂。
3. **河源同步+活体**：fetch+ff-only→13f7bcd 零冲突·score_engine 单测河源真跑 22/22 OK。
4. **payload PATCH 正形通道**（X-Internal-Token 值面零回显）：
   - 替换断言：`shift-W{fromWeek}` 唯一命中（count==1）→归一后无双 W 残留
   - **md5 三换形**：52c54a8d16ac78828706287b6ee361fc（W2 接线形）→**09644869a812ed16579624cb3287a4f0**（C 族修形·现役基准）
   - 回滚锚：jobs.json.bak-cfix-runid（PATCH 前先行·护栏②）
   - 读回四查：单 W 形 ✓+trigger 接线 intact（joint_review_trigger 在）+md5 一致（daemon 内存态=进程内生效）+enabled/schedule 保持（50 23 * * 0）+healthz ok/cron enabled
5. **dry 全展开断言**（零真跑）：模拟 TriRMC command-handler 双段展开（{fromWeek}=W47+$(date…)→20261122T235000Z）→run_id=`shift-W47-20261122T235000Z`·**T1-1 正则 match True**（assert 精确等通过）——11-22 首拍展开形直证合契约。

## §二 · 下游兼容面（勘实证汇总）

| 消费面 | 新形兼容 |
|---|---|
| score_engine._RUN_ID_RE `^shift-W\d+-…` | ✓（shift-W46- 形即合） |
| rubric collection_cmd `grep '^shift-W'` | ✓（前缀不变） |
| 三处 grep 同串计数=3 判据 | ✓（当轮 RUN_ID 同串·旧 WW46 件不入同串计数） |
| joint_review_trigger loop_run_id | ✓（无硬编码依赖·如实载新形） |
| joint_review_recycle run_id | ✓（透传面） |

## §三 · 技术债与观察面

1. **旧 WW46 形 run_dir 十件在库**（/var/lib/trirmc/cron/runs/shift-WW46-…）——历史件零回改（历史冻结）·值席采集窗判据「同串计数」按当轮新形不受扰（§二判据行）。
2. dry regex 设计缺陷一笔如实（首版 PATCH 脚本静态 regex 抓不到 `$(date…)` bash 命令替换段→None 假阴性——补版全展开模拟正形偿还）：「验证脚本须对运行时展开段做模拟展开再断言」候记。
3. B 族 rubric loop 判据增补=STE owner·本席候 STE 卷出后消费面复验（recycle/trigger 对 B 族 verdict 面无码依赖——纯卷面流·零改动预期）。

## §四 · 验收门对照（CTO 修件窗令三条件）

| 门 | 读数 |
|---|---|
| 白盒复跑（21 案+新 run_id 形案） | 22/22 OK（本机+河源活体双跑） |
| validation 基线零漂 | 438/5/1 逐字同基线 |
| 河源 dry 双验 | PATCH 读回四查+dry 全展开断言 DRY-EXPAND-OK |

11-22 首拍前毕 ✓（今日 11-16 Monday·真拍 2026-11-22 周日 23:50——修复态机判上界回 100·首轮 recycle 评分质量最大化）。

## 使用依据

- CTO 修向裁决卷 46afd9bc3+验收卷 7f6575934+threshold 会签 9625290f9
- 毕报卷勘清段（251402d17·C 族双 W 根因实锚）+基线锚卷 1ff86cee3（PATCH 通道正形）
- W2 施工毕报（5410e0e61·W1 契约面）·score_engine.py L120-140 判据码面+rubric-firstshoot.json L26-27 T1-1 锚

—— FSD 小全（m-fsd）·2026-11-16T04:46:39Z（+8=2026-11-16 12:46:39·date 现查原值·D-47 正形）
