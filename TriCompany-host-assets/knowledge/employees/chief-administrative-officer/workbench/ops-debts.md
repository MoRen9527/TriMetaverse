# 操作欠账台账（CAO workbench·多仓推送/补推面）

> sourceOfTruth: 本件（TriCompany-host-assets/knowledge/employees/chief-administrative-officer/workbench/ops-debts.md）
> syncMode: write-time
> lastSyncedAt: 2026-11-21T15:34:12+08:00（date 现查原值·写前跑·D-47 正形）
> 用途：记录「内容已落盘并已推达至少一通道、但另一通道暂不可达」的操作性欠账——候恢复窗补推，防漏。制度候选不记本件（走 d-series-candidate-queue.md）。

## 在欠（open）

### OD-001 · TC github 补推欠账（2026-11-21 立）

- **欠账内容**：TriCompany 仓 github 通道缺一笔 `69afa67`（R6 §四登记格式细目回填闭项笔·docs/workflow/weekly-demand-review-workflow.md +3/-3）。
- **现势读数**：sg bare 顶=69afa6732ea3b5e38207e76047951b1f1204613f（本地 HEAD 全等）；github 顶=902dd6673b33a3d5ef4e58874a492c4fc0cb6a8c（缺 69afa67 一笔·2026-11-21 15:3x ls-remote 实测）。
- **故障形**：github 443 瞬断族——试推三次：21s 连接超时×2 / `Recv failure: Connection was reset`×1；ls-remote 同窗一通一断（网络瞬通瞬断，非凭据面故障）。
- **处置形**：候网络恢复窗补推（攒批形·非急件）；补推后 ls-remote 顶 hash 对表 69afa67+ 即销账。
- **影响面**：零阻断（内容已在 sg bare 完整可达；引锚指 69afa67 内容面准确）。
- **落袋** 2026-11-21 15:34:12+08（CAO·date 现查原值）。

### OD-002 · TMV github 通道现势未验（2026-11-21 立）

- **欠账内容**：TriMetaverse 仓 github 通道**现势顶 hash 未能取得**（443 连接超时 21s·同一瞬断窗）——欠账笔数**未知**，非零即可能多笔（本窗 TMV 已推 sg 三笔：d533150d4 机制卷+入池三行 / feeb9f038 候态 / c7fd8d501 候态 / c40390908 本台账；均以 sg bare 顶验真）。
- **处置形**：候网络恢复窗——①先 ls-remote 取 github 顶 ②与本地链对表算欠账笔数 ③一次补推 ④顶对表销账。
- **影响面**：零阻断（sg bare 完整可达·内容面零缺）。
- **落袋** 2026-11-21 15:34:58+08（CAO·date 现查原值）。

## 已销（closed）

（暂无）
