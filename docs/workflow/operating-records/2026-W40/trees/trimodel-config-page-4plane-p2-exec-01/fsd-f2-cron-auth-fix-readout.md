# FSD·F-2 cron 族鉴权修复完工读数（今夜批·BOD 验收候件）

- sourceOfTruth: 本件（FSD 完工读数卷；令源=CEO 2026-09-29 22:05 直令经 BOD 22:08 转达+COS 22:11 流转；技术裁卷=cto-f2-cron-auth-verdict.md @dcbaa3b4）
- syncMode: working
- lastSyncedAt: 2026-09-29T14:39Z（date 现查=2026-09-29 22:39 +0800）
- 施工席: FSD 小全（m-fsd）；四步照 CTO 裁卷①补头②TriRLC 同修③build+重启④补测

## 交付锚（双仓）

| 仓 | commit | 变更 |
| --- | --- | --- |
| TriMLC | ee5d7fe | src/cli.ts cronRequest 补 x-internal-token（configRequest 同构四行：env 读取+条件挂头），7+/1- |
| TriRLC | 18cd777 | 同漏即同修——与 TriMLC 逐字同构同漏（勘钉 L866-880 在案），同 patch 7+/1- |

## 四步读数（CTO 裁卷口径逐项）

1. **补头**：TriMLC L867-881/TriRLC L866-880 cronRequest——`process.env.TRILC_INTERNAL_TOKEN` 读取+`if (token) headers['x-internal-token']=token`；dist 双点验证（752=config 族既有+844/843=cron 新点）。
2. **TriRLC 同修**：镜像同漏实锤后同 patch（非只勘钉——COS 令文「同漏即同修防复踩」照办）。
3. **build+重启 8713**：全链正形——pidfile/pid 对表（5348==5348 ✓）→ POST /shutdown+token 门 200 → 端口释放 → 父链消亡验（node 5348+channel cmd 全退 ✓）→ channel launcher 再启 → **pid 35520==pidfile 35520**（registerPid 活体自证）。零裸杀。
4. **补测翻绿**：`trimlc cron list` 带 token → **4 job(s) 表格渲染翻绿 200**（trimodel-l2-scan/l3-remind/plane-shift-local-/tree-node-patrol 在列）；无令对照 → 401 unauthorized（fail-closed 门保留，双层全谱）。

## TriRLC 8711 门活体钉死（候裁项销案）

- 带令（shell env token）`trirlc cron list` 新 dist → 200「No cron jobs.」exit=0；无令 → 401 unauthorized。
- **8711 门实测开着**——COO 上午判读「8711 token 门未开故不显」**翻正**：门一直开着，TriRLC cronRequest 漏头同样致命（跑 trirlc cron list 也会 401），同修防复踩必要性实测坐实。

## 全量读数（两仓）

| 仓 | 读数 | 归因 |
| --- | --- | --- |
| TriMLC | 617 tests/612 pass/5 fail | 与今晨 F-1 批完全同谱：replay-flow/P0 通道端到端/tui components=3 既有（上午 stash 对 HEAD 独立验在案）+FADE-ASSESS-005×2 run-order 干扰（单跑过）；cron 族零测试锚（grep 实勘）——零新增失败 |
| TriRLC | 662 tests/657 pass/5 fail | 镜像仓同源既有谱（同上五族）；cron 族零测试锚——零新增失败 |

## 回归健康

- F-1 读数保持：新 8713 daemon `config show` → face=mlc+tier2-cache-fresh（22:2x 新鲜拉取）零回归。
- 8711 daemon 未重启（CLI 侧改动 node 每进程即读新 dist，daemon 面零变更）。

## 协同注记

- COS allowlist 新条目（channel cmd L19 ledger-watchlist-patrol.mjs）随同一次重启生效——一次重启双件（F-2 新码+allowlist 条目），COS 协同序原案兑现。
- 本件=watchlist 首笔真实 waiting 项（COS 新规：完工读数落树自动触发到件通知候 BOD 验收）。

## 候办与如实报

- **下午窗件A/件C/件D（TriModel 侧）未施工**：git 实勘顶=995c2f7+工作区零 src/test/ui 改动——午后本席无该三件执行记录，如实报不装完成；候 COO 示下（补窗或改派）。
- TriModel 全量四读数候件A/件C 施工后一并出（本件不涉 TriModel 仓，无读数义务）。

## 使用依据

- CEO 22:05 直令（BOD 22:08 转达/COS 22:11 流转）
- CTO 裁卷 cto-f2-cron-auth-verdict.md @dcbaa3b4
- 09-18 误杀族重启纪律+CEO 双控制器端口口径（8713/8711）
- 活体实测：本机 8711/8713（时点见各段）
