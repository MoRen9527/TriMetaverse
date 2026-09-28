# sg 切后对照实照证据清单（N6-scope2 / A2 后半·两半合判制）

- captured_at_utc: 2026-09-28T20:45:09Z （+0800 = 2026-09-29 04:45:09 周二）
- 取证对象: sg M-SG-47.245.122.61 /srv/fleet/TriModel（trimodel-config.service active + trimc.service active，经 SSH 隧道 localhost:13333 只读取证）
- sg TriModel 活体代际: git 8de8fe7（SDE 切换窗 04:32 收口全绿；新 pid 2518071/2518072，port 3333/3334）
- 性质: 活体只读取证；与切前件（../evidence-sg-preswitch/）成前后对照，N6 口径前后同一人（FSD 帙）
- 触发链: SDE 小布 04:35 知会入场（切换窗已闭，无撞窗风险）；COO 04:03 令③「切后对照实照」义务执行

## 件列表

| 件 | 内容 | 对照面（vs 切前） |
| --- | --- | --- |
| ui-live.html | 切后活体 UI 原始 HTML（76189B『TriModel 模型配置』代） | **md5 bbd33abe… = 盘面/HEAD 8de8fe7 一致**——重启加载新代实证（切前：live 12857B 策略面代 ≠ 盘面新代，进程 09-16 起未重启） |
| ui-live-screenshot.png | 切后活体 UI 视觉实照（无令牌态） | P1 代 UI 活体照；令牌输入框纯 placeholder 零实值（敏感面自查过）。P2 四卡页 UI=FSD 本地未部署件，候 P2 发布（见注记③） |
| cards-route-live-reading.json | GET /v1/config/cards/mmc?view=pull → **401** `{"error":"Unauthorized: invalid or missing pull token for this face"}` | **断链三角闭合对照：切前 404（无路由）→ 切后 401（路由在场+鉴权门活）** |
| effective-reading.json | GET /v1/config/policy → 200（GLM-5.3/deepseek-flash 双窗调度真值，version 1） | 降级通道切后仍活（策略调度面零扰动对照） |
| ledger-presence.txt | face-events.jsonl（1611B/11 行）+ face-ledger.json（195B）在场证明+字段名样本+ledger 摘要面全文 | **台账断链闭合对照：切前双文件不存在 → 切后双文件在场且在增长**（mmc face pull/write/status 全族事件流） |
| capture-stamp.txt | 取证时戳锚 | — |

## 重大现势注记（如实）

1. **主卡 md5 流转=写回心跳，非结构变更**：SDE 04:35 读数 md5 422a1d98 → 本席 04:40 读数 md5 e7e14187。实勘 trimmc-card.json vs bak-3（04:31 基线）结构化 diff=**唯一字段 status.at**（2026-09-28T20:16:08Z→20:31:08Z）。与 SDE 读数「diff 唯一 .status.at」自洽——tier1 拉取在役，每次写回心跳更新 status.at，卡体结构零变更。备份链 bak-1/2/3（04:15/04:16/04:31）轮转在位，bak-1=切换前基线（SDE 供料一致）。
2. **face-ledger last_pull_result=denied（取证留痕如实）**：本席 cards-route 401 探针（无令牌）本身即一次 loopback pull-denied 流量，会写入台账 pull/denied 事件——observer effect，恰为台账写路径活体副产物证明，非接入异常。Tier1 正常拉取成功面由 SDE 读数卷（trees/trimodel-config-page-4plane-01/sg-trimmc-switch-readout-20260929.md，commit 64fc75e8）承载，本席不重复断言。
3. **活体 UI 代际=P1『模型配置』代，非 P2 四卡页**：8de8fe7 盘面 UI 即 P1 代（76189B）；P2 四卡页=FSD 本地 995c2f7（未发布、未上 sg）。故本实照对照语义=「cards API+台账+新代 UI 进程装载」三件切后事实；「四卡配置页视觉」候 P2 部署窗另照（COO 令③原文「四卡配置页」指 P2 页面上线后的对照态，P2 骨架今日刚过全量绿，部署候正常流程）。
4. **值面守卫（主卡 at-rest）**：grep 命中 1 行=字段名 `api_key_encrypted`（值=密文，lgmMQT 前缀）；全卡零 `sk-` 值、零明文 token 形。密文零暴露。
5. 事件字段面：`etype/face/result/ts/detail(+reason)`——无敏感载荷结构。

## 对照结论（A2 两半合判制供料）

- 切前半（../evidence-sg-preswitch/）：UI 断链态+台账断链态+消费端零接线，三角互证闭合（CPO A2 切前半收稿合格，641d6f57）。
- 切后半（本目录）：cards 路由 404→401（路由活）+ 台账双件 0→在场增长（写路径活）+ live==盘面 8de8fe7（新代装载）——**断链三证全部翻转，接入切换活体生效**。
- 剩余对照项：P2 四卡页 UI 视觉（候 P2 部署窗）；消费端 TriMMC env 接线读数（SDE 读数卷已含 tier1 拉取在役，本席未重复取证）。
- 本目录由 FSD 小全取证落盘，转 CPO 作 A2 完整判（两半合判）基料。
