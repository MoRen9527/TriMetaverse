# SDE patch-runner 面挂账卷（V2-3 交付面双缺陷实锚·止损线照走零恋战）

- sourceOfTruth: 本卷（patch-runner 面挂账卷正身·承 v3 部署窗执行令）
- syncMode: write-time
- 执行席: SDE 小布；令源=BOD 裁 135 v3 部署窗准执行令（止损线：受阻即挂账如实报候裁零恋战）
- 执行窗: 2026-11-17T0x-1xZ 段
- 判定: **patch-runner 面受阻挂账（V2-3 交付面双缺陷实锚·候 FSD 修/CTO 面）·止损线照走零恋战**

## §一 · 实弹读数（patch-runner 首跑·七席形）

- mode=auto+deliver_via=patch-runner+letters=7（召集件渲染面 ✓·dimb 面 ✓——**渲染/初判段全绿**（loop_convene_auto 前段面实锚）
- **delivered=[]+failures=7 席 rc=1**（stderr_tail="dsh: fsd-adopt-runner: dsh 1." 截断形——全席一致形态）

## §二 · 双缺陷实锚（源读面·FSD 交付面域）

| # | 缺陷 | 源读实锚 |
|---|---|---|
| ① | **session_id 形不匹配（同文件两函数）** | `seat_session_id(target_seat)` 产出 vs `build_patch_runner_overlay` 校验 `_SEAT_SESSION_RE（席名形）or ^session-[A-Za-z0-9._-]+`——**产出 UUID 形越形 ValueError 正形**（run_deliver 实弹 rc=1 形根因·直调复现同款 ValueError 实锚） |
| ② | **overlay yml 首行注释形 dsh 解析器不支持** | 产出首行=`# v3 fsd-adopt-runner overlay…`（L93 注释行）——dsh --patch 直跑复现 **YAMLException bad indentation (1:39)**（注释行=炸点·dsh overlay 解析器受限 YAML 形实锚） |

- 源段：loop_convene_auto.py L82-104（build_patch_runner_overlay 全段实读·脱敏形）

## §三 · 候修面（FSD 域·候 CTO 复核）

1. ①修=seat_session_id 产出形对齐 overlay 校验形（席名形直通/或 UUID 形入 _SEAT_SESSION_RE——**形定=FSD+CTO**）
2. ②修=overlay 产出首行注释删/或 dsh 解析器注释支持面（**解析器域=V2-3 交付面修**）
3. 修毕复验=build_patch_runner_overlay 单测+patch-runner 实弹复跑（前跑读数卷=复验对照基线）

## §四 · 挂账面遵行

止损线照走（挂账零恋战——patch-runner 面受阻即停·legacy-staging 缺省面零漂维持）✓｜护栏四族+D-46 照走 ✓｜七席 letters 渲染/初判段成果=在卷保留（非弃面）

## 使用依据

BOD 裁 135 v3 部署窗令（止损线）；92432ea 交付面 delta+loop_convene_auto.py L82-104 源读实锚；实弹首跑 failures 读数实录。

—— SDE 小布（毕报=落卷+SendMessage 直达值席·卷面时戳=commit %cI）
