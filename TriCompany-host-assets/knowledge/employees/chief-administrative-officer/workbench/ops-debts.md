# 操作欠账台账（CAO workbench·多仓推送/补推面）

> sourceOfTruth: 本件（TriCompany-host-assets/knowledge/employees/chief-administrative-officer/workbench/ops-debts.md）
> syncMode: write-time
> lastSyncedAt: 2026-11-21T15:37:03+08:00（date 现查原值·写前跑·D-47 正形·OD-001/002 双销账批）
> 用途：记录「内容已落盘并已推达至少一通道、但另一通道暂不可达」的操作性欠账——候恢复窗补推，防漏。制度候选不记本件（走 d-series-candidate-queue.md）。

## 在欠（open）

（暂无——OD-001/OD-002 立账后同窗销账，沿革见「已销」段）

## 已销（closed）

### OD-001 · TC github 补推欠账 —— **已销 2026-11-21 15:36:45+08**

- 补推毕：`902dd66..044f22f`（含欠账笔 69afa67 R6 回填 + 044f22f D-85 铸条两笔一次补清）；github 顶验真=044f22fd4d574c074b3815a8deda25dfa5a59660 = sg bare 顶 = 本地 HEAD **三面全等**。
- 通路注：补推前同窗试推一次即通（此前三次失败全在瞬断窗内）——`git -c http.version=HTTP/1.1 push` 直推即达，零特殊处置。瞬断族=纯网络面，非配置/凭据面，实证再确认。

### OD-002 · TMV github 通道现势未验 —— **已销 2026-11-21 15:36:45+08**

- 验顶毕：github 顶=832f801f5668e6e356dd2748c52d1ea617784d1e = 本地 HEAD = sg bare 顶 **三面全等**——**零欠账**（本窗 TMV 各笔 sg 推送均已同步达 github，仅本席未能实时验顶，实为「验顶欠账」非「推送欠账」）。
- 形态勘正：OD-002 立账时定性「欠账笔数未知」——现验=**零笔**；原定性偏保守，如实勘正（保守立账·实证销账=正形）。
