# D-96 铸条候选稿·dce 非 pass 停链红线（charter-203018Z item-3 归口并档·候 CEO 批入册）

- sourceOfTruth: 本件（trees/fade001-evolve-20261123/cao-charter3-clause-candidate-20261124.md·候选稿正身）
- syncMode: write-time
- lastSyncedAt: 2026-11-24T04:37:31+08:00（date 现查原值·写前跑·D-47 正形）
- 令锚: CEO 04:3x 批令「批锚表接线，charter 也批」（BOD 2026-11-24T04:37 转达）+ charter-203018Z 5 items 全批（item-3=cao-1「第 2 红线归口并档生效」）
- **件性：候选稿**——报 BOD 呈 CEO 批（与 D-95 稿并呈）；批后本席入册（D 系唯一通道）·本卷零即铸

## 〇 · item-3 归口读法（先对齐再铸）

**cao-1 item 原文要点**（`charter-20261123T203018Z.json` 实读）：target=resume14 opinions.json；change=「为 cos-1/coo-1 意见回填（条款号/commit 锚/effective_at）·close.json disposition 由 deferred 改 consumed·items_consumed=2·digest_rate=1.0」；verify=jq 验 2/2 三件齐 + close 两值对表。

**读法**：item-3 **不是「铸新条」的指令，是「两条同源意见并档为一条条款」的归口动作**——故本席铸**一条**（D-96）承载 cos-1+coo-1 两面，**不分成两条**（防条款碎片化）。

## 一 · 条款正文（候选·六款）

### D-96 dce 非 pass 停链红线——下游全段不启动·不 notify（2026-11-24，charter-203018Z item-3·CAO 铸条）

**案由**：resume13 failed 的直接遗留——**dce 失败面未拦→下游空转**（verify/score/close/notify 在 dce 非 pass 时仍推进）。两条同源意见并档：cos-1（chain_runner 第 4/5 段 fail-closed 强化）+coo-1（dce 非 pass 即停·不进下游）。

1. **红线定死**：**dce 结果非 pass**（rc≠0 或 verdict≠pass）→ **链即停**——**verify / score / close / notify 全段不启动**（零空转·零下游推进）。
2. **不 notify 语义（防「失败却报完成」）**：dce 非 pass **禁发 notify_done**；失败面走**专门告警通道**（P0 shift-failure alert·DEM-009 面已建·stage-fail marker→urgent COS notify）。
3. **实现落点（引锚零转写·D-26）**：`chain_runner` 第 4/5 段 fail-closed 强化（cos-1 面）+ dce 非 pass 即停（coo-1 面）——**实现细节归 DP 施工面（候取号）**，本条款不定代码形。
4. **归口并档注**：本条=cos-1+coo-1 的**同源并档**（同主题「dce 非 pass 停链」的链层与行为层两面）——opinions.json 两条均回填**本条款号+commit 锚+effective_at**（item-3 change 面照行）。
5. **verify 形（可机械判·item-3 verify 面照行）**：①opinions 2/2 各有 `clause_id`/`commit`/`effective_at` ②`close.items_consumed==2` 且 `digest_rate==1.0` ③条款号与 opinion_id 一一对应（`jq` 可验）。
6. **生效与回溯**：**新立不溯及**——resume13 已 failed 不回溯（truth-record）；**此后每轮 dce 非 pass 即停**（点火前置核）。

**效力边界如实注**：纪律层 + 实现候选（DP 施工）——实现落地前依 `chain_runner` 现役 fail-closed 面（部分已在·resume13 暴露的缺口未补），落地后转机械面（照 D-91 两阶段形·禁打包宣称）。

## 二 · 与既有条款关系（防重复自查）

- **与 DEM-009（迁移可靠性三读数+失败告警）**：DEM-009 建告警通道；本条定**停链语义**（告警是「告知」·停链是「阻断」）——两层互补不互代。
- **与 D-91（跑中更新纪律）**：D-91 管「链跑期间禁推业务码」；本条管「链内 dce 失败即停」——**运行窗口面 × 链内流程面**两分。
- **与 D-86（loop 治理）**：D-86 §二 停损三硬线之①「施工异常即停+警报」是本条在 loop 面的既有近亲；本条=**其在 dce 段的具体化与红线化**（细化非重复）。

## 三 · 呈批与回填

- **呈批**：本稿与 D-95 稿**并呈** BOD → CEO 批（两稿独立·批一入一）。
- **回填**：CEO 批后入册 → opinions.json 两条回填（clause_id=D-96/commit/effective_at）→ close.json disposition deferred→consumed·items_consumed=2·digest_rate=1.0（item-3 verify 面兑现）。

## 使用依据

- CEO 04:3x 批令（BOD 04:37 转达）；charter-20261123T203018Z.json（cao-1 item 全文实读）；cos-batch-submission-charter-203018Z（§二 items 清单·§三 出稿注记）；DEM-009（P0 告警面）；D-86 §二（停损硬线）/D-91（两阶段形）。

—— CAO 小行（m-cao）·2026-11-24 04:37:31 +0800（date 现查原值·写前跑）
