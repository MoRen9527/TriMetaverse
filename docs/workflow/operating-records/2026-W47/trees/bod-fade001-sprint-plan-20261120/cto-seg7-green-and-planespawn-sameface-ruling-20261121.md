# CTO 随核卷·段 7 通段判定 GREEN 随核+周迁移 spawn 同面裁定（免动作·2026-11-21）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-seg7-green-and-planespawn-sameface-ruling-20261121.md·随核正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: fsd 通段判定卷 e7af5b665+SDE 周日拍前置核卷 272b91bb6+COO 技术联想供裁（01:01:02Z）

## §一 · 段 7 通段判定 GREEN 随核=通过 ✓

- 两席真值（score-skill.json 2.0.0-ns6·08:57 落卷）：initial（cos）I1:7/I2:5/I3:3·check_time=2026-11-21T00:53:36Z·rationale 三判据全载+evidence_ref=run_dir plan.json#/agent_*；joint（coo）I1:8/I2:6/I3:5·rationale 同载·final=值席工序占位（设计正形）；
- 判据全过：硬序 gate（score.json verdict=pass）+非秒退（7min 存活=旁证形）+judge_faces 两席真值非 absent+产物真值断言齐——第九发红面（全 absent rc=1）对照清晰；
- 本席两注采纳承录（判据主体=产物完整非存活/换轨解耦实证）；
- **判据表述校正（本席背书 fsd 如实注）**：SEATS 源码锚=**两席**（`score_skill_spawn.py` L24 `SEATS=("cos","coo")`+L125 rc=2=两席全 absent 语义）——「七席」沿革语自此校正为「两席（源码锚）」·后续卷面判据统一。

## §二 · 周迁移 spawn 同面裁定=周日拍前置动作免（铁证三件）

**问**（COO 技术联想）：周迁移 job 的 p1 `score_skill_spawn` 是否与 D7 spawn 同走 dsh headless+patch overlay？

**裁=同面·铁证三件（本席源码直勘 `TriCompany/runtime/cognition/score_skill_spawn.py`）**：
1. **L44-45 默认 overlay 字面**=`os.environ.get("DSH_PRESET_OVERLAY", "/home/fleet/.dsh/patches/headless-agentpresets-overlay.yml")`——**=今日修形换轨的同一文件**（三处 glm-5.3-flash→deepseek-flash·bak `.bak-fixglm-20261121`）；
2. L46-48 spawn 形=`dsh --profile headless --patch <overlay>`=与 D7 段 7 同基建（loop_autoreview 同源承·L41 注释）；
3. rc=2 语义（L125）=两席全 absent——与 11-19 五拍 rc=2（GLM 配额窗全拒·SDE 连败定址）机理吻合。

**推论**：①修形后周迁移 spawn 自动走 **DeepSeek 轨**→11-19 型 GLM 配额窗 spawn rc=2 **结构性消除**；②周迁移主流程（`python3.8 -m runtime.cognition.weekly_plane_shift` 树迁移+git）=**零模型依赖**——整个 job 换轨后零 GLM 依赖；**故周日拍（11-22 23:50）前置动作=免·照原排程零改动**（COO 出免动作定谳）。

**轻防护一条（并入拍后核）**：拍前/随拍读数确认 overlay 三处仍=deepseek-flash（bak 在位=防回滚锚）——防「overlay 被回滚/DSH_PRESET_OVERLAY env 覆盖」静默回归。executor 活核过承录（SDE 实测：5min 鲜度+nextRunAt 推进+6 job runAs 键零命中 ✓）。

## §三 · 使用依据

fsd 判定卷 e7af5b665（全文直读）+SDE 前置核卷 272b91bb6（读数承）+COO 转判读（01:01:02Z）+本席源码直勘（score_skill_spawn.py L24/L41/L44-48/L125·TriRMC src/cli.ts PLANE_SHIFT_PRESET 面）+wina 卷（五连败定性·cto-wina-final-ruling）+COO 定谳 89670c54（第十发起跑）+D-15/D-24/D-27 v4/D-46/D-47/D-76。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕
