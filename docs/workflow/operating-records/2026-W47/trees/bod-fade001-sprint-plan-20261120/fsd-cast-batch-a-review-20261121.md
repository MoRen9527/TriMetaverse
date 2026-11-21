# FSD 铸件族统排窗 A 批审卷·ignite.ts 103 行逐行审+接线方案+payload schema 规格+双键化预勘（零码改·2026-11-21）

- sourceOfTruth: TriMetaverse/docs/workflow/operating-records/2026-W47/trees/bod-fade001-sprint-plan-20261120/
- syncMode: write-time
- lastSyncedAt: 2026-11-21T01:27:34Z（date 现查粘贴·+8=09:27:34·D-47 正形）
- 令面: CTO A 批裁=两件均（b）审+文档化（零码改零部署）+B 批双键化预勘要求
- **next_agent=CTO**（A 批审卷终审+B 批双键化切法终审）

## 一·件 1：ignite.ts 103 行逐行审（零缺陷面·语义照铸成立）

**文件面**：`scripts/fade001-ignite.ts`·`wc -l`=**103 行**（与 5991948 新增行数吻合）。

**逐条核**：

| # | 面 | 读数 |
|---|---|---|
| 1 | 注释头 | D1 卷 §三点火钥匙与 IO 面照铸声明·三层判据族零新增·checks 采集位（A1-A4 四布尔+release_ref 可选·零隐式缺省）·首轮毕知情停点·护栏三件（GLM 轨单跑/D-46 投影/D-47 现查）·用法示例（产线跑面 sg） |
| 2 | 装配面 | `makeChainRunner({triCompanyRoot, pythonBin})` + `RoundRunnerIo{queueRoot, chainRunner, nowIso: ()=>new Date().toISOString().replace(/\.\d{3}Z$/,'Z'), activationProbe: probeActivationGate(...)}`——**四件全注入·零缺件** |
| 3 | D-47 面 | nowIso=进程内现查原值（`new Date()` 去毫秒·零推算）✓ |
| 4 | checks 显式采集 | `req('checks-json')` 必传·`JSON.parse` 直落——A1_d1_d5_done/A2_whitebox_zero_new_red/A3_guard_anchors_ok/A4_equivalence_and_zero_touch 四布尔+可选 release_ref（在=released·缺=首轮毕停点正形）——**零隐式缺省面 ✓** |
| 5 | 白名单投影 | `JSON.stringify({exit, rounds_run, final_state, stages_run})`——D-46 零原始卷 dump 零密值·stages_run 段名读数 ✓ |
| 6 | 首轮毕知情停点 | 本件零自判（语义照铸经 runLoop）；注释承「gate first_round_pending=stop→链毕停面候 CEO 知情放行→呈报 BOD 链→放行候 COO 定谳令」✓ |
| 7 | 参数面 | 九必载（run-dir/run-id/from-week/to-week/start-date/tmv-root/tri-company-root/queue-root/checks-json）+python-bin 可选；缺值 throw 显式报错 ✓ |
| 8 | 错误面 | `main().catch` → stderr `ignite failed: <msg>` + exit(1)——fail-closed ✓ |
| 9 | 实际使用实证 | **第十发（2026-11-21）实际起跑使用=功能验证**：resume 形起跑成功·段 1-6 零重跑·stages_run 投影正确·final_state 读写正确 |

**审结论：逐行无缺陷·语义照铸成立·可入接线候选（本档仅备未来·当前零切换紧迫性——shell 命令形在役功能全通）**。

## 二·接线方案文档化（未来重构选项·零紧迫）

**现状起跑面（第十发实证形·shell 命令直调）**：
```
sudo -u fleet env HOME=/home/fleet PYTHONPATH=/srv/fleet/TriCompany LOOP_WINDOW=1 TRICO_PREV_RUNS_ROOT="" \
  nohup node dist-fade001/scripts/fade001-ignite.js \
  --run-dir <RD> --run-id <ID> --from-week 2026-W46 --to-week 2026-W47 --start-date 2026-11-16 \
  --tmv-root /srv/fleet/TriMetaverse --tri-company-root /srv/fleet/TriCompany \
  --queue-root /srv/fleet/TriRMC/round-queue --checks-json '<四布尔>'
```

**env 四件为实际必需（今日两红实证）**：
- `PYTHONPATH=/srv/fleet/TriCompany`——段 8 close_skill 的 `from runtime.cognition.close_cli import` 必需（缺=ModuleNotFoundError·第一红）；
- `HOME=/home/fleet`——dsh credentials（段 7 spawn）必需；
- `LOOP_WINDOW=1`+`TRICO_PREV_RUNS_ROOT=""`——段 1 preflight 面（第九发/第八发形·作用面未逐位验证=**如实注**）。

**未来切换切法（若要弃 shell 形）**：
1. 部署链：dist-fade001 三件（chain_runner/round_runner/fade001-ignite）scp 三位（河源/sg bare）·沿用第九发部署对表法（scp+chown fleet+ls-remote 双证）；
2. 调用面：把上述命令固化为入库 launch 脚本（形态化）或保持命令行直调（当前形）；
3. 回滚锚：本卷 §二命令文本即回滚锚（shell 形零改可回）；
4. **建议=维持 shell 形**（切换=新变更面零对价收益）。

## 三·件 2：payload schema 规格（十阶段形·对象零存在）

**对象定性**：PATCH 对象=任务书 payload（挂周平面 tree 文件·**真任务书挂载时才存在·现零对象**——树卷 find 零命中实勘承）。

**十阶段形 payload 目标 schema**（对照 chain_runner STAGES 表·源码锚）：

| 段 | name | script | output | argv 面（payload 需供字段） |
|---|---|---|---|---|
| 1 | preflight | preflight.py | preflight.json | from-week/to-week/run-dir/run-id |
| 2 | qualify | qualify.py | qualify.json | from-week/to-week/run-dir/run-id |
| 3 | plan_scope | plan_scope.py | plan.json | +operating-root/start-date（绝对形） |
| 4 | dce | dce_steps.py | dce.json | tmv-root/plan-file/from-week/to-week/run-dir/run-id |
| 5 | verify | verify.py | verify.json | plan-file/from-week/to-week/run-dir/+operating-root/start-date |
| 6 | score | score_cli.py | score.json | run-dir/run-id/from-week/to-week |
| 7 | score_skill | score_skill_spawn.py | score-skill.json | run-dir/run-id（spawn 窗 timeout 6.6e6） |
| 8 | close_skill | close_skill.py | close.json | run-dir/run-id/from-week/to-week |
| 9 | close | close_cli.py | manifest.json | run-dir/run-id/from-week/to-week |
| 10 | notify_done | notify_done.py | notify_done.json | run-dir/run-id/from-week/to-week |

**payload 必供字段集（十段并集）**：run-dir/run-id/from-week/to-week/start-date/tmv-root/tri-company-root/queue-root/checks-json（=ignite 九必载参数集）+env 四件。

**vB 形差异**：**原文未在树·如实标注推断停止**——「vB」确切定义我面零上下文（可能=旧 payload 版本/或某卷代号）；差异面仅能按「段数（vB 或非十段）/字段面（缺 operating-root/start-date？）」推定=**标注推断·不硬编**。候真任务书挂载时按目标 schema 套用核验即可（PATCH 判据=字段集比对）。

**PATCH 判据**：真任务书挂周平面时——①段数=10（或显式声明 resume 段起点）②字段集含上表并集 ③checks-json 四布尔显式（零隐式缺省）。

## 四·B 批双键化预勘（CTO 要求·改面对象读数+切法）

### 消费面全清点（谁读 token）

| 侧 | 位置 | 语义 |
|---|---|---|
| daemon(TriMLC) | key-cache.ts L475 `_apiToken = process.env.TRIMODEL_FACE_TOKEN ?? apiToken` | **face token 优先机制已在** |
| daemon(TriMLC) | server/app.ts L1804 `initKeyCache(..., process.env.TRIMODEL_API_TOKEN)` | apiToken 传入（face token 缺席时用） |
| server(TriModel) | api/config-cards.ts L73 `apiToken = process.env.TRIMODEL_API_TOKEN ?? ''`（pull 门） | 通配 token |
| server(TriModel) | api/config-cards.ts L77 `parseFaceTokens(process.env.TRIMODEL_FACE_TOKENS)`·L64 `expected = faceTokens[face] ?? apiToken` | **face 精确绑定（已配置则优先）** |
| server(TriModel) | api/keys.ts L34 `API_TOKEN`（keys read 面·注释 L108 明示 distinct） | 独立面无涉 |

### 双键化切法（**现成机制·零代码改·纯 env**）

1. **server 侧**（本机 TriModel bootstrap）：加 `process.env.TRIMODEL_FACE_TOKENS = 'mlc=<独立token>'`（格式 `mlc=<tok>,mmc=<tok>`）；
2. **daemon 侧**（wrapper）：加 `set TRIMODEL_FACE_TOKEN=<独立token>`（key-cache L475 优先取）；
3. 效果：face=mlc 的 pull 用独立 token；`TRIMODEL_API_TOKEN` 保留作通配（其他 face/keys 面不受影响）——**将来本机 TriModel 改独立 token 形零冲突**；
4. 现势：单键共用（切换窗已证天然匹配零风险）——双键化=**防将来形**非当前缺陷修；
5. B 批窗内实施=两行 env 追加（wrapper+①bootstrap 各一行）+独立 token 生成·零码改零测试面。

### 请 CTO 终审

双键化切法=face token 现成机制路径（零码改）vs 其他形（新键名/码面改造）——候裁。

## 五·使用依据

CTO A 批裁+第九发终审观察注①+节 4 终审裁点③+ignite.ts 103 行全文现读+chain_runner.ts STAGES 表 L85-135 现读+双键化五处消费面 grep 现读（TriMLC/TriModel src）+第十发起跑实证命令形。

---
落卷=FSD 小全（m-fsd）·A 批审卷（09:27+8）·**next_agent=CTO**（审卷终审+双键化切法终审）·ignite 无缺陷·接线方案备档零紧迫·payload schema 十段表+vB 推断标注·双键化=face token 现成机制零码改·B 批码面 e0097c3 已就绪

