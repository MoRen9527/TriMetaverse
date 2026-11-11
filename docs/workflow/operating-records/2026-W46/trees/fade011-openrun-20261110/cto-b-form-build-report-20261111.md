# fade011 B 形态升维·施工毕报（勘修窗 2026-11-11·两件落盘+第三向勘明录）

- sourceOfTruth: 本件（B 施工毕报·勘修窗自执行面）
- syncMode: static（施工毕·B 态首拍验收候明日自然拍）
- lastSyncedAt: 2026-11-11T05:5x 前后（写前现查随 commit %cI·D-47）
- 令链: B 设计单（acff75b71）→勘修窗开工（13:54）→施工前实勘第三向→两件施工+验证三绿→本卷

## 一、施工前实勘·第三向勘明（设计前提勘透录）

B 设计单预设「配置存在→清单生效」——「生效」的机械路径今日勘明三向：

1. **端点无清单参数**：POST /internal/v1/fade/runs body schema=`{runId, idempotencyKey?, treeDir}`（app.ts L1986-1997 实读）——清单传不进 daemon；
2. **driver 无 training 引用**：TriMLC src 全文无 training/fade-0 路径（grep 零命中）·skills 目录不存在——「plan skill」=driver 内部程序化节点（非 Claude skill）；
3. **run=程序化自包含形**：全 worker（qualify/plan/dce/verify/score/close）读写的都是 run 树内部模板件（driver.ts L153-239 实读·dce=写模板+verify=读回字样校验）——**现役 run 根本不读任何 training 培训文档**，「检查培训文档族」语义在现役机械层不存在。

**机械语义勘透（B 设计单 §二消费形落定）**：清单消费方=**sweep 脚本自己**（POST 之外另做检查段·不经过 daemon）——配置文件+脚本检查段两件即施工全量·**零 daemon 接触零重启零 ALLOWLIST 面**（B 设计单 §二挂点收益全保持）。设计单「<15 行读配置段」预估随勘（含检查逻辑实落 ~20 行·总增量克制）。

## 二、施工两件

| 件 | 落点 | 内容 |
|---|---|---|
| 配置正身 | `scripts/fade/fade-watch-config.local.json`（新建·.local 形=本机形标记·禁 sg 化覆盖同族语义） | schema=fade-training-check/v1·两族清单：fade-001 六文件（含 05-trigger-chain-draft 现势实勘录）+fade-011 六文件（含 improvement-draft）——根路径绝对形·零 env 依赖 |
| 脚本检查段 | `scripts/fade/fade-daily-sweep.local.mjs`（增量 ~22 行） | POST 读数行后加：读配置（try 包裹）→逐文件 statSync（exists/bytes/mtime）→落 `<treeDir>/reports/training-check.json`→stdout 一行读数；**缺省/解析败=空 catch 零变化**（不炸拍·设计单向后兼容落定） |

## 三、验证读数（三绿）

1. `node --check` 语法=**SYNTAX-OK**；
2. 检查段独立干跑（不 POST 不触发 run——fade011 手动运行=CEO 通道不触碰）：两族 **12 文件全 all_present=true·missing 空**——清单读数正形；
3. 缺省容错干跑：配置文件不存在→**ENOENT 静默 catch**——现役行为零变化实证。

## 四、验收锚（B 态首拍）

- **B 态首拍=明日（11-12）wake 后自然拍**——验收判据=产出树含 `reports/training-check.json` 且两族 all_present 读数在卷（培训文档族纳入每日检查面实证）；
- 对照基线=今晨拍 fade011-daily-20261111-095607（APPROVED score 100·十一文件形）——B 态=同形+training-check.json 一件；
- job config/command/schedule/enabled 全零触·daemon 零接触。

## 五、第二件裁量勘正（LG-069 读抑制+dedup·降级为勘修设计单形态）

**裁：本窗不做·施工候 daemon 勘修窗**。理由：(a) dedup+读抑制=daemon 代码改动面（notify 路径）+勘修重启链（watchdog→shutdown→port FREE→冷起→pid 对表全序）——**非低耗小改**·与 fade011 B（零 daemon 接触）成本面两分；(b) 前置档已解除（今晨 62% 充电中）·告警压力低·dedup=防重复骚扰面非功能缺口（重复告警仍可观测·信息无损）；(c) COO 观察项在账（22a6cd565）·不因本窗关闭。改点设计随勘修设计单另出（候窗·与 mount-gate 施工段错峰·8713 勘修窗 owner=本席裁量时段）。

## 使用依据

端点契约实读（app.ts L1975-2049）/driver worker 实读（driver.ts L120-239）/B 设计单 acff75b71/今晨基线拍读数卷（a1a69fff1）/验证三绿读数（本卷 §三）/fade011 手动运行=CEO 通道例外正身（验证形规避依据）。

—— CTO 小狄（m-cto·B 施工毕报），2026-11-11 13:5x CST（写前现查随 commit %cI·D-47 动态形）
