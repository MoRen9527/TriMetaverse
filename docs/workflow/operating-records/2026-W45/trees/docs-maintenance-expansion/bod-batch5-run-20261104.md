# docs-maintenance · 批 5 验证令执行卷（CEO 21:36 直令·BOD 执跑）

- sourceOfTruth: 本卷（批 5 手动跑读数正身·两形试跑全谱）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CEO 2026-11-04 21:36 直令「现在你跑下批5吧」·bod 执跑（不等串行窗·11-03 排窗废止令口径第三次适用）
- 原串行条件: 候 ew 迁 TriMMC 阶段二实施毕（CTO scope-ruling 25 行）——CEO 本令解除提前跑

## 一 · 跑法全谱（两形）

| 形 | 端点 | 读数 | 判 |
|---|---|---|---|
| sg 8712 迁移形（批 5 正形对象） | TriMMC POST /internal/v1/fade/runs | http=**404 not_found**（runId fade011-daily-20261104-214027·脚本就位 17:27·env 就位·node v18.20.8） | 端点未部署=阶段二今晚 23:30 窗实施内容的现势实锚·非施工失败 |
| 本机 8713 现役形（阶段一零改动照跑面） | TriMLC POST /internal/v1/fade/runs | http=**200**·runId=fade011-daily-20261104-214104·finalState=**APPROVED**·gated=true·elapsed 0.8s | 一发过闸 |

- 8713 形跑法注：现役 scripts/fade/fade-daily-sweep.mjs 已 sg 化覆盖（935838591）——本机形按源版语义（bf414156d）等效直发：token 从 trimlc-daemon-channel.cmd 提取进变量（D-46 零回显）→POST body={runId,treeDir}→值面投影只落状态键。

## 二 · 产出树值面（214104 跑）

- 树位: trees/fade011-ew-runs/fade011-daily-20261104-214104/（plan.md+artifacts/dce-output.md+reports 九件）
- close-output.json: verdict=**APPROVED**·gate_check score_total=**100**（阈值 90）·required_all_passed=true·hash_match=true·pending_list 零项·decided_by=fade-driver
- 与预演三跑（141144/141202/145209·全 APPROVED）同族正态——fade011 daily sweep 管线现役健康

## 三 · 批 5 终态定性

- 阶段一现役形（8713）验证=**毕**（本卷 APPROVED 读数）
- 批 5 完整语义残余=**8712 迁移形验证候今晚 23:30 窗毕**（fade 栈部署后补跑一发即完整闭环·404 实锚已证端点未部署非脚本事）
- 观察窗义务不变（CTO scope-ruling：11-05 03:30 首触发+11-06 日报核对）
