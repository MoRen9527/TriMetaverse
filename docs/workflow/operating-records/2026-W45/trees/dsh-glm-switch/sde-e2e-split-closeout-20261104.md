# SDE 毕报 · extension-host-e2e 拆链施工（出 quality-gate 阻塞链改独立 workflow）

- sourceOfTruth: 本卷（e2e 拆链施工收口正身·CTO 门禁要件逐项对表）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 施工席: SDE 小布·令源=CTO 裁令（2026-11-04T12:16:52Z 裁 b 采）+CTO 转令（12:42:29Z·CEO 20:41 双裁「e2e 施工也提前」原排 11-05 白天窗取消立即落）·带宽自评=dsh 收口毕穿插（CTO 采认成立）

## §一 · 施工面（diff 锚）

| 仓/件 | 改形 | commit |
|---|---|---|
| TriPilot `.github/workflows/quality-gate.yml` | extension-host-e2e job 整体摘出（33 行删除）·原位留拆链注记（CTO 裁三理由+承接指针） | 38cec31 |
| TriPilot `.github/workflows/extension-host-e2e.yml` | 新建独立 workflow：workflow_dispatch 单触发·**无 continue-on-error**·job 步序与原 quality-gate 版逐字保形（checkout/node24/npm12/ci+supply 闸/compile/e2e smoke·零新增步）·头部注记=裁令三理由+既有红定性采认锚（08-25/08-28 run） | 38cec31（同笔） |
| TMV `.github/workflows/build-tricade.yml` | 发布前 gate 注记（头部块 9 行）：e2e 不内联本 release 流程·双执行入口（①dev 机手动跑 `npm run test:e2e:extension` 活体 daemon 在位=正形②TriPilot 独立 workflow 手动触发·CI 面红=既有环境性）·发布 readiness 判据=入口 1 真绿 | 9ebaee888 |

TriPilot 已推 github+sg 双通道（ls-remote 顶=38cec31 对表讫·github 腿本窗通）；TMV 推 sg 通道（github 腿闪断族复发·21:05 兜底 cron 在挂）。

## §二 · CTO 门禁要件对表（12:16:52Z 裁令·六项）

| # | 要件 | 读数 | 判 |
|---|---|---|---|
| 1 | e2e 从 quality-gate 阻塞链移除·拆独立 workflow（workflow_dispatch 形·不做 continue-on-error） | 38cec31·新 workflow 零 continue-on-error 字样 | ✓ |
| 2 | 独立链承接=发布前 gate（TriCade release 挂 e2e 步骤注记+dev 机手动跑入口） | TMV 9ebaee888 注记块+双入口形 | ✓ |
| 3 | 既有红定性采认（历史红不追责） | 新 workflow 头部注记采认锚在卷 | ✓ |
| 4 | 排窗：不与今晚 23:30 重启窗抢带宽 | 带宽自评=e2e 本机面穿插毕于 23:25 前·自唤 f3511eca 在挂 | ✓ |
| 5 | 毕报候核门禁：diff+quality-gate 摘出后首跑真绿读数+独立 workflow 手动触发验证一发 | §三读数 | ✓ |
| 6 | STE 知情随令 | 毕报链含 STE 知情面 | ✓ |

## §三 · 验证读数（CI 实证）

**quality-gate 摘出后首跑真绿**（push 触发·github MoRen9527/Tripilot）：

- run **41832763447**（headSha 38cec31）= **completed success** —— 此前同 workflow 三连 FAILURE（41822578832/41823996223/41825613883·e2e 在链期）·摘出后首跑即绿
- job 谱：`test` success（12:51:02Z）+ `supply-chain-audit` success（12:50:59Z）+ `lockfile-guard` skipped（push 面 PR-only 正确跳过）——**阻塞链两绿一正确跳过·零 e2e 在链**

**独立 workflow 手动触发验证一发**：

- `gh workflow run extension-host-e2e.yml --ref dev` → run **41833231772**（dispatch 12:53:52Z·completed）
- **管线本体全程跑通**：workflow_dispatch 触发✓→job 拾取✓→npm ci+supply 闸→compile→e2e smoke 步执行✓——拆链形成立
- 终态 failure=**既有环境性断言族原样**（PE-004「daemon should be running on 8711/uptime present」+PE-005「healthz 200」·CI 无头 runner 无活体 8711 daemon）——与 08-25 run 32817437091/08-28 run 33144564147 同断言族·CTO 裁令 3 采认定性·**非本施工引入·无 continue-on-error 掩盖（红即红如实呈现=裁令 1 之「留跑」本意）**

## §四 · 发布前 gate 运行形（承接面·候 TriCade 下次 release 启用）

- tag 构建前：dev 机跑 TriPilot `npm run test:e2e:extension`（活体 8711 daemon 在位）→真绿读数入卷→方 tag
- CI 独立 workflow 面红不阻塞 release（环境性·定性在卷）——但红面变化（新断言失败非 8711 族）须人工勘
- 本卷即首份读数锚；实际 release 时按 TMV build-tricade.yml 注记执行

## §五 · 使用依据

- CTO 裁令 12:16:52Z（裁 b 采·施工要件六项）+CTO 转令 12:42:29Z（CEO 20:41 双裁·带宽自评权）+CTO 采认回执 12:49:49Z（带宽自评成立）
- quality-gate.yml 摘出前全谱（本席段 2 施工卷 sde-seg2-closeout-20261104.md §五 run 谱·既有红独立验证读数）
- CI 读数：gh run list/view 实读（41832763447/41833231772·log-failed 断言族摘录）
