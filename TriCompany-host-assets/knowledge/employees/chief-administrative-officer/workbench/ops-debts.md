# 操作欠账台账（CAO workbench·多仓推送/补推面）

> sourceOfTruth: 本件（TriCompany-host-assets/knowledge/employees/chief-administrative-officer/workbench/ops-debts.md）
> syncMode: write-time
> lastSyncedAt: 2026-11-21T15:37:03+08:00（date 现查原值·写前跑·D-47 正形·OD-001/002 双销账批）
> 用途：记录「内容已落盘并已推达至少一通道、但另一通道暂不可达」的操作性欠账——候恢复窗补推，防漏。制度候选不记本件（走 d-series-candidate-queue.md）。

## 在欠（open）

### OD-003 · 双仓 github 通道瞬断复发（2026-11-22 立·第二次进欠）

- **欠账内容**：①**TC**：`d6c1ba2`（D-87 转办面时点义务铸条）——push **报达**（`51da4ba..d6c1ba2  dev -> dev` 服务端接受），但 `ls-remote` 三次全败（Connection reset×2 / 21s 超时×1）→ **顶未复核**（按双验纪律，未验顶不判达成）；②**TMV**：顶未复核（报错 Connection reset）——本地=sg 顶=157d166e0（本席根因卷 1587a4946 已在链·并行笔推进），github 欠账笔数未知。
- **故障形**：同 OD-001 瞬断族（第一次 OD-001/002 同窗即通销账；本次为**同夜第二次进欠**——形态=push 可报达但顶验不定期失败）。
- **处置形**：候恢复窗 ①先 ls-remote 双仓取顶 ②TC 顶若 <d6c1ba2 则补推、若≥则直接销 ③TMV 对表算欠账笔数后补推。
- **影响面**：零阻断（两仓 sg bare 均完整可达·内容面零缺·引锚指 commit hash 不受影响）。
- **落袋** 2026-11-22 21:56:51+08（CAO·date 现查原值）。
- **续记（2026-11-23 15:42:32+08 现查）**：**第三次进欠**——TC `a1878f6`（D-89 铸条）push 报 `Everything up-to-date`（**间接表明远端已含本笔**·他席并行笔带上），但 `ls-remote`+`fetch` 双失败（Connection reset / 21s 超时）→ **顶仍未复核**。形态累积观察：本族已呈「push 侧常可达、验顶侧不定期失败」稳定分形——**push 成功读数在验顶失败时不可单独采信**（对照本席 D-89 读数对照窗原则同族：单点读数不作终判）。

## 已销（closed）

### OD-001 · TC github 补推欠账 —— **已销 2026-11-21 15:36:45+08**

- 补推毕：`902dd66..044f22f`（含欠账笔 69afa67 R6 回填 + 044f22f D-85 铸条两笔一次补清）；github 顶验真=044f22fd4d574c074b3815a8deda25dfa5a59660 = sg bare 顶 = 本地 HEAD **三面全等**。
- 通路注：补推前同窗试推一次即通（此前三次失败全在瞬断窗内）——`git -c http.version=HTTP/1.1 push` 直推即达，零特殊处置。瞬断族=纯网络面，非配置/凭据面，实证再确认。

### OD-002 · TMV github 通道现势未验 —— **已销 2026-11-21 15:36:45+08**

- 验顶毕：github 顶=832f801f5668e6e356dd2748c52d1ea617784d1e = 本地 HEAD = sg bare 顶 **三面全等**——**零欠账**（本窗 TMV 各笔 sg 推送均已同步达 github，仅本席未能实时验顶，实为「验顶欠账」非「推送欠账」）。
- 形态勘正：OD-002 立账时定性「欠账笔数未知」——现验=**零笔**；原定性偏保守，如实勘正（保守立账·实证销账=正形）。
