# scripts/fade/ — 中枢常驻执行体（daemon spawn 面·脚本本体树内化位）

- sourceOfTruth: 本目录（FADE 管线常驻执行体脚本本体；.fade/ 为其运行时区对照位——CTO 案 B 树内化裁定 2026-09-30：脚本本体入 git，写回数据留本地/树真源位）
- syncMode: source
- 裁定锚: CTO 案 B（否 scp，2026-09-29 深夜）+TriMetaverseCodeRegistry 落位裁（2026-09-30 02:5x，域名制先例=同族 node-report-check.py/hub-watchdog.py 在驻）

## 件清单（mjs 族，2026-09-30 树内化首批）

| 件 | 用途 | cron 节律 | 写回数据落点 |
|---|---|---|---|
| `tree-node-patrol.mjs` | LG-057 树节点收口巡检催办执行体（任务书 8c242679；CTO 技术门 16327ad7） | 60s（TriMLC job cron_muk3951d_b8ah） | node-status.jsonl 催办记录（operating-records 周目录树内） |
| `ledger-watchlist-patrol.mjs` | 判据型「候裁读数落树触发」到件通知执行体（提案卷+裁卷 34aef5c2，三钉契约） | 300s（TriMLC job cron_mumsuxup_pu0y） | watchlist 状态写回（树内真源=docs/workflow/hub-state/watchlist.json，录账即推锚） |

## 运行注记

- daemon spawn 环境含 TRIMC_NOTIFY_SG_URL/TOKEN（watchlist 发信通道依赖）；allowlist 按脚本名放行（本批两脚本名已在列，位置迁移不涉 allowlist 变更——CTO 边界澄清 2026-09-30 02:38）。
- `.fade/` 同名旧位已替换为指针注释件，仅防历史引用；job command 已切本目录路径。
- `__pycache__/` 系 py 族运行产物，不入库。
