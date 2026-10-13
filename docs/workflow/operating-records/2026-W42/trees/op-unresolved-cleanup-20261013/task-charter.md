# 任务书：OP unresolved-items 清淤批（LG-072 候授）

- sourceOfTruth: 本件（docs/workflow/operating-records/2026-W42/trees/op-unresolved-cleanup-20261013/task-charter.md）
- syncMode: static（立书版）
- lastSyncedAt: 2026-10-13T10:40:05+08:00（date 现查原值·写前跑）
- 令源: CEO 2026-10-13 10:39「派，转 COS 线清淤批」→BOD 立书流转
- 执行位: COS（小贾·运营记录收口域 owner）——LG 号请 COS 走授号挂账（本卷用 LG-072 候授占位）
- 树 id: op-unresolved-cleanup-20261013

## 一、对象与病灶

对象=`docs/workflow/operating-records/2026-W42/OP-202610-W42-001.unresolved-items.md`（正身单点·W41 同名件平移链）。

病灶三条（BOD 10:3x 亲勘）：①**标题失真**——正文标题仍「W32 未决事项」；②**万年流水账**——W31 起逐周往里追加，已闭历史叙事（W32 done 段/C-1..C-5 销案段/W38 补录已闭行/§4 销账行）与现役挂账混装，活跃件散落各节不可读；③**活跃态存疑**——多处「open」件为 W32-W33 时代标注（BUG-20260805 族/REQ-20260805 族/RISK-20260728-001 等），是否仍真 open 未经验证。

## 二、施工三件

1. **历史段归档**：已闭/已销案叙事切出至同目录归档件 `unresolved-items-archive-20261013.md`（W31-W42 各周已闭段原样保留·销账锚一字不动），正文留指针段（归档件路径+切出范围清单）。
2. **活跃件归拢现役区**：全件逐单亲勘定态后，现役挂账归拢至「现役区」统一节。亲勘要点：
   - frozen 件（CARRY-004/006）**只归位不解冻**（解冻=CEO 裁决链，非本批范围）；
   - 多年 open 件（BUG/REQ/RISK/VER/AGENDA 各族）须现势核验定性——已随版本演进失效的按销账纪律走锚销（附依据），仍活的留现役区并刷状态时点；
   - SEC-20260924-001（GLM key 轮换）、A-1/A-2/A-3、R-HY-401 注记态、C-4 残项、MIG-W41-demandpool（W41 迁移时核销——核销态亲勘）逐单对表现势。
3. **结构定型**：标题勘正（W42 现役命名）+元信息头补齐（sourceOfTruth/syncMode/lastSyncedAt）+节构定型（现役区/归档指针/平移说明）——此后各周平移只动现役区。

## 三、纪律

- 逐单亲勘禁转抄；「open」定性必附现势依据（活体探针/代码面/账本对表任一），禁照搬旧标注；
- 销账锚与历史叙事**冻结不改写**（truth-record 惯例）——勘正用追加注记不用抹改；
- 归档不删内容（git 可溯+归档件在树）；
- 与周迁移 runbook 铸条候办同窗联动：清淤后「各周平移只动现役区」条请随批铸入 runbook 候办清单（转 CAO 归口）；
- 完工判据：现役区逐单带状态+时点+依据；归档件切出范围清单在卷；标题/元信息头合规；毕报回 BOD。

## 四、落位面

- 毕报落本树目录（`毕报-<slug>.md`）；正身件改毕 commit 推 sg bare dev+wt/board 链同笔（与 BOD 值守链同惯例）；W42 大表「本周新增」行态由 BOD 随派工挂行（本批行=BOD 挂·销账态 COS 毕报后刷）。
