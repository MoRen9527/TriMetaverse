# P3 event-watch 接入·候触发期侦察读数卷（SDE）

- sourceOfTruth: 本件（侦察读数卷·非真源·供 P3 启动窗 CTO 会裁引用）
- syncMode: recon-notes
- lastSyncedAt: 2026-11-04T11:23:22+08:00（date 现查原值·写前锚）
- 令源: COO 派工令 2026-11-04T11:17:34+08 P3 主体项 1（WATCH_DIRS 终值与 CTO 实勘会裁·裁量留痕）
- 状态: 候触发期无副作用侦察（零写源码面·零部署面动作·P3 主体启动触发=FSD P1/P2 毕报）

## 一、watch.ts c52f5bc 语义复核（fail-closed 三键）

- TriMLC HEAD=c52f5bc（立窗 commit 即现顶·src/fade/watch.ts 在卷）
- env 键读取面：L53 `TRILC_FADE_WATCH_DIRS`／L54 `TRILC_FADE_WATCH_TREE_ROOT`／L60 `TRILC_FADE_WATCH_INTERVAL_MS`——commit 信息明示「env三键缺省全关 fail-closed 禁自行发明业务映射」✓
- **第四键发现**：L62 `TRILC_FADE_WATCH_NAME`（可选·缺省 "default"）——COO 令三键之外的可选命名键，接入窗区分用，部署面建议显式赋值（多窗共存时区分接入面）
- 指纹机制：文件 hash ∪ git HEAD/refs 首扫建基线；**commit 后 HEAD 变化=新指纹→触发一次真 run**（噪音面估算的关键语义）
- fail-closed 确认：三键缺一拒启（watch.ts c52f5bc 缺键拒启语义与 COO 令一致）✓

## 二、噪音面三重防线（现役常量读数）

| 防线 | 常量 | 语义 |
|---|---|---|
| 防抖 | FADE_WATCH_DEBOUNCE_MS=2_000（L30） | 2s 显式常量·合并风暴 |
| 速率护栏 | FADE_WATCH_RATE_WINDOW_MS=60_000／FADE_WATCH_RATE_MAX=2（L33/37） | 60s 窗最多 2 次 run·超限显面跳过 |
| 指纹记忆化 | fade_watch_state 表 | 同指纹零重驱零风暴·gated:false 合法态不重试 |

结论：速率护栏对**瞬时风暴**有效（合并窗口内压至 2/min）；对**日均触发量级**不构成瓶颈——真正的裁量点=execution 高频变更的日均 run 负载（见三）。

## 三、接入目录噪音面实勘（2026-11-04 11:2x 读数）

| 目录 | 文件面 | 近 30 天 git 变更 | 近 7 天 | 触发量级估算 |
|---|---|---|---|---|
| docs/archive/ | 24 件（P1 迁移填充中） | 1 commit | — | 归档动作时偶发触发·近零日常负载 |
| docs/execution/ | 150 md 件 | 56 commits | 26 commits | **日均 ~4 commits→日均 ~4-8 次真 run**（每 commit 新 HEAD 指纹 1 次+同窗防抖合并变量） |

- execution=现役执行文档高频区（计划书/彩排记录/排期单等日常写入面）
- 并集 execution 的语义收益：B 组 2 件落 execution（排期单 B 组注记面）·「落点即接入面」闭环成立
- 并集 execution 的成本面：日均 4-8 次 FADE run（run 链=skill 链/评分/收尾·非零成本）——速率护栏不拦此量级

## 四、裁量建议（供 SDE/CTO 会裁·裁量留痕）

- **方案甲（COO 建议值·archive+execution 并集）**：接入面语义最全·日均 4-8 run 负载需 CTO 门禁面认可 run 成本（FADE run 链真实成本候 CTO 评估）
- **方案乙（仅 archive）**：日常近零负载·仅归档动作触发——但 B 组 execution 落点不入接入面·CEO 令「落点即接入面」语义缺角
- **折衷面（甲′·候选）**：并集 execution 但调高 INTERVAL_MS+依赖速率护栏——不改变触发语义只调巡检节奏（INTERVAL_MS 是扫描节奏键非触发上限键·对日均量级影响有限·如实注记）
- 本席倾向：**方案甲**（语义闭环优先·run 成本面若 CTO 评估超载再降乙）——终值以会裁为准，本卷只供读数。

## 五、附注

- 值面探针键名族：目标 env 值面探针=重启窗完工判据件（探 TRILC_FADE_WATCH_DIRS/TREE_ROOT/INTERVAL_MS 三键进程内生效值）
- 320 封标 read 处置与首验真 run 证据卷随 P3 主体窗执行（本卷不含）
- 侦察零写面声明：本卷为 operating-records 记录面落卷，TriMLC/TriMetaverse 源码与部署面零触碰

---

落款：2026-11-04T03:23:22Z（date 现查原值·与 lastSyncedAt 同锚）
