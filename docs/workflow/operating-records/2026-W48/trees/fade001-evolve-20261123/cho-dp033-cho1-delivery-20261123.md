# CHO 席·DP-033 cho-1 交付卷（意见逐条处置表·堵 FUSE 静默丢弃）

- sourceOfTruth: 本卷（fade001-evolve-20261123/cho-dp033-cho1-delivery-20261123.md·cho-1 交付与对表正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令锚: charter v2（rN-task-20261123-v2·approved 2026-11-23T22:21:43+0800·DP-20261123-033）items[cho-1]
- 写前现查: 2026-11-23 22:28:26 +0800

## §一 · items 原文（照 charter v2 精读·target/change/verify/rollback）

- title：**补 7→2 意见逐条处置表，堵 FUSE 静默丢弃**（注意：即 **7/2 评分口径/FUSE 默认值面**·同一项）
- target：`/srv/fleet/TriRMC/fade001-runs/shift-W48-resume10-20261123T115623Z/close.json`
- change：close.json 增 `opinion_dispositions[]`：逐条列 round1-snap-20261123/opinions.json 的 7 席 opinion_id/seat/state(consumed|rejected|deferred)/owner_seat/reason/evidence_ref；5 条因五字段缺失被 charter-hook 退回的意见标 rejected，填责任席（CTO 定形接线/COS 流程面）与补件时限；items_consumed/digest_rate 改由该表计算，禁只报 opinions_in=2。
- verify：len==7；set(opinion_id)==round1-snap 7 条；每条 owner_seat/state/reason 非空；digest_rate==items_consumed/7；close.json 不再出现未列处置的 opinion。
- rollback：以改前 close.json（sha256 ff8ce9537b193b7d100e5258e271cee7d4eb950d474f2b2c8ae67f366be8edee）原卷回退；不重跑评分、不投递。

## §二 · 对表结果（施工前实核·三项）

| # | 面 | 实核结果 | 处置 |
|---|---|---|---|
| 1 | **代码面** | `close_skill_spawn.py` 已有 opinions_in/items_consumed/digest_rate（L243-265 旧形）；`opinion_dispositions` **零命中**（grep 实核）→ 需新增表生成逻辑 | **已施工毕**（§三） |
| 2 | **target 可达面** | target=`/srv/fleet/...`（sg 面 run 产物）——本席 dev 本地域席**无 sg 写通道**（跨机路由：sg 面任务归值席/SDE/BOD 通道） | 需 sg 面执行三步（§五） |
| 3 | **数据源面** | `round1-snap-20261123/opinions.json` 在 sg run 面·本地无副本（find 零命中）；5 条 rejected 明细=charter-hook 退回记录（COS 流程面持有） | 需值席导出 opinions.json + COS 提供 5 条 rejected 明细 |

## §三 · 代码面交付（本机实跑）

- **实现**：`runtime/cognition/close_skill_spawn.py` 增 `_build_opinion_dispositions()`（优先级：run_dir/`opinion_dispositions.json` 覆盖 > charter 收录 consumed > 默认 deferred）+ `_build_close_fields()` 扩展（items_consumed=表内 consumed 计数·digest_rate 由表算·reserve 向后兼容旧形）。
- **单测**：`test_close_skill_spawn.py` 增 `test_opinion_dispositions_seven`（7 条·consumed/rejected/deferred·digest_rate=0.286·resume10 origin）——**6 passed**；close 族三件 **37 passed**（本机实跑）。
- **提交归属如实注**：实现代码（`_build_opinion_dispositions` 等）**已随他席批次提交 1356d45（22:26:20·dp033-cfo1 四 spawn 脚本统一）带入**——并行窗「批量 add 卷走」实锤（非本笔 commit 归属·结果正确但归属如实注）；本席测试文件独立提交 **TC@9757890**（sg 顶含验证✓）。**并行写警示**：同树 `dce_steps.py`/`test_dce_steps.py` 正被他席（coo-1/cto-1 items）在改——后续施工请按文件级 add 禁批量 add。

## §四 · verify 断言脚本（照 items.verify 列·sg 面执行）

```
python3 - <<'PY'
import json, glob
rd="/srv/fleet/TriRMC/fade001-runs/shift-W48-resume10-20261123T115623Z"
close=json.load(open(rd+"/close.json",encoding="utf-8"))
rows=close.get("opinion_dispositions") or []
ops=json.load(open(rd+"/round1-snap-20261123/opinions.json",encoding="utf-8")).get("opinions") or []
ids={str(o.get("opinion_id") or "") for o in ops}
assert len(rows)==7, f"len={len(rows)}"
assert {str(r.get("opinion_id") or "") for r in rows}==ids, "set mismatch"
for r in rows:
    assert r.get("owner_seat") and r.get("state") and r.get("reason"), f"empty field {r}"
consumed=sum(1 for r in rows if r.get("state")=="consumed")
assert close.get("digest_rate")==round(consumed/7,3), "digest_rate mismatch"
assert close.get("items_consumed")==consumed, "items_consumed mismatch"
print("VERIFY OK", {"opinions_in":7,"items_consumed":consumed,"digest_rate":close.get("digest_rate")})
PY
```

## §五 · sg 面三步（候派工·非本席 ETA）

1. **落 override**：`run_dir/opinion_dispositions.json`（5 条 rejected 明细：opinion_id 从 round1-snap opinions.json 取·state=rejected·owner_seat=CTO（定形接线）/COS（流程面）·reason=五字段缺失 charter-hook 退回·补件时限）——提供方=COS（流程面持有 hook 记录）；
2. **重生成 close.json**：按新代码跑 close 段（同 run_dir·幂等重写·不重跑评分不投递）；
3. **跑 §四 断言**：VERIFY OK 即毕；rollback 备=改前 sha256 ff8ce953… 原卷。

## §六 · D-88 三步遵行

①挂账：DP-20261123-033（COS 取号在案）→②施工：本卷 §三/§五→③回执双落：回 COS（记账面）+派工方。

## 使用依据

- charter v2 `charter-20261123T134432Z-v2.json`（items[cho-1] 原文）·charter 批件 2973f2c39
- 代码实读：close_skill_spawn.py L243-265 旧形/L269-306 新 helper/L310-352 扩展（HEAD 实读）
- 单测实跑：test_close_skill_spawn 6 passed·close 族 37 passed
- D-88（挂账三步）·D-90（专业下沉·非人人代码）·本席真核底稿 bae20b8f3

—— CHO 小源（m-cho）·写前现查 2026-11-23 22:28:26 +0800（date 现查原值·D-47 正形）
