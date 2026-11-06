# SDE β 三件切流毕报（候选 A·CLI 现役挂载·全绿收口）

- sourceOfTruth: 本卷（β 切流施工毕报正身·活体读数全谱+回滚姿态+语义边界注）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 施工席: SDE 小布·令源=COO β 切流派工单（13:23:17Z）→前置勘定卷（本树 sde-cutover-preflight-20261106.md·TMV e21703096）→COO 裁决候选 A 准即施工（21:34+0800 信到·三判据在 preflight 卷 §四）
- 交付锚: TriRLC `cafe1b42f50e4befb1469ace503770f31999c915`（dev·sg bare 顶 ls-remote 双验平·75f2e29..cafe1b4）

## §一 · 变更面（最小 diff·两文件 5+/1-）

| 文件 | 变更 | 内容 |
|---|---|---|
| `package.json` | scripts +1 行 | `"v2": "tsx src/v2/tui.ts"`——v2 命令面现役挂载（tsx=devDependencies 在位 ^4.20.5·零新依赖） |
| `.gitignore` | +2 行 | `.trirlc-v2/`（v2 Engine state 目录·npm run 入口 cwd=包根→stateDir 恒=TriRLC/.trirlc-v2 固定语义·零代码改动） |

**零 src 代码改动**——tui.ts main 薄壳（N8 交付·直跑守卫 import.meta.url）原样消费；零 bin 段改动（bin 候观察·避免 npm link 面牵动）；daemon 8711 进程零接线零触碰（COO 裁决③派工单 daemon 条款条件式未触发）。

## §二 · 活体读数全谱（npm run v2 四步实录·2026-11-06T13:35-13:39Z 窗）

| 步 | 命令 | 读数 | 判定 |
|---|---|---|---|
| 1 | `v2 -- seats list` | **15 席全谱**（13 员工+BS/PM·四字段 name/address/status/host·ORDER BY name 稳定序）·首次跑 Engine.open 种子幂等建库 v2.db（73728B） | PASS |
| 2 | `v2 -- seats get senior-deployment-engineer` | `senior-deployment-engineer	m-sde	idle	dev` | PASS |
| 3 | `v2 -- send senior-deployment-engineer "<smoke text>"` | `queued seat-send → senior-deployment-engineer (m-sde)`（kind='seat-send'·payload={address,text,at} 落行） | PASS |
| 4+5 | `v2 -- status` ×2（两次独立进程） | `passes	no pass yet`+`pending seat-send	true` 双读同值——**跨 reload 持久实证**（硬门①同族·独立进程 Engine.open 真重开） | PASS |
| 6 | `npm run check`+`npm test` | check RC=0·**733/733 pass 145 suites 0 fail RC=0**（31.1s·施工前基线同谱零回归） | PASS |
| 7 | git 面 | porcelain=0（.trirlc-v2/ 被 gitignore 吸收零污染）·commit cafe1b4·push sg bare `75f2e29..cafe1b4`·ls-remote 顶 hash==commit hash 双验平 | PASS |

## §三 · 语义边界如实注（三笔）

1. **正名 vs 别名勘定**：seat 主键 name=职务正名（senior-deployment-engineer）·`m-sde`=address 通信别名——seats.ts L107 明文「正名精确等值——别名不采」。施工中首查误用别名得 unknown seat RC=1·正名重跑全通——**非缺陷**·CLI 使用面须知注：seats get/send 传参=职务正名非 m-别名（别名面=address 字段只读展示）。
2. **零 handler=行留库候消费（正形）**：seat-send 落行后无 effects.handle 消费→status 面 `pending seat-send true` 恒在+零 effect 行零 passes health——与 N8 毕报案 13「零 handler 零 health 面」+案 15「passes 不自动 start」裁定语义逐字对表。真消费 handler（`effects.handle('seat-send',...)` 单点接驳·payload 契约已铸）+Eval evaluateDue+send→ticket 转化面=**嫁接域·候 CTO 嫁接令+FSD 设计卷**（COO 裁决「切流≠嫁接·嫁接是切流后下一议程」对表）。
3. **devDep 依赖注**：v2 script 用 tsx（devDependencies）——`--omit=dev` 安装形态下 script 不可用；本环境两面皆研发环境（meta-narrative 定谳）·npm run 开发安装全量 deps 形态可用性成立·如实注备查。

## §四 · 回滚姿态（随卷交付）

- **主回滚**：`git revert cafe1b4` 单锚即净（两文件 5+/1- 行级全回·v2 面 script/bin 零残留）——判定书 N8/N7 双锚（c3f76c01/89a87688）语义不变·本切流锚叠加其上互不牵连。
- **数据面**：`.trirlc-v2/` 目录删除即净（SQLite 独立产物·git 面零轨）。
- **终放行读数**（判定书 §二同款条款）：回滚后 `npm run check` RC=0（本锚 revert 后 v2 面=75f2e29 原形·类型门必绿）。
- daemon 8711 全程零触碰——无 daemon 面回滚需求。

## §五 · 现役链路读数（COO 派工单⑤必载项·切流后终态）

- v2 CLI 现役入口：`npm run v2 -- <seats list|seats get <正名>|send <正名> <text>|status>`（TriRLC 仓根）·stateDir=TriRLC/.trirlc-v2/v2.db
- 终态三读：15 席列席全谱 ✓ / pending seat-send=true（冒烟行在库候消费）✓ / passes no pass yet（零 pass 正形）✓
- daemon 8711 现役链路读数：零变化（daemon 零触碰·无重启无中断·healthz 面不受本施工影响）

## §六 · 使用依据

- COO β 切流派工单（13:23:17Z）+候选 A 裁决信（21:34+0800·三判据）+CTO 切流验收判定书（TMV 20ee14aa5·照卷执行件）
- preflight 卷（本树 sde-cutover-preflight-20261106.md·基线定格+勘定定谳）
- TriRLC 活体实录（npm run v2 四步+check/test+git 三面·本卷 §二表全载）
- N8 完成卷（fsd-n7n8-completion-report.md·main 薄壳/命令谱/案 13/15 裁定语义对表源）

—— SDE 小布（毕报信=COO 主送·CTO/COS 知会·卷面时戳=commit %cI）
