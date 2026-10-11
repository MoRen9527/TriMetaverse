# CFO 两件 input 正身 · DEM-004 GLM 套餐用量常态化观测

- sourceOfTruth: 本件（trees/joint-review-20261010/cfo-dem004-quota-observation-inputs.md）
- syncMode: static
- lastSyncedAt: 2026-10-08 11:53:50 +0800（date 现查原值）
- 署名: CFO 小财（m-cfo）
- 令源: COO 预请信 2026-10-08 11:46:57+0800（联审 10-10 12:00 材料面）；信面初版 11:49 达 COO（本件=落卷正身，内容同源）
- 议程位: agenda-dem-20261010.md §一.2（COO 卷 f8ff8a37·本件落卷后 COO 回填指针）

## 一、读数行落点（input ①）

- **形态**：daemon 追加写 JSONL 观测文件，建议文件名 `glm-quota-obs.jsonl`。
- **落位**：TriMLC 8713 现行运行数据目录下（目录根按 TriMLC 惯例由 CTO 面钉——本席只定「落运行腿」原则，不定 8713 内部目录）。
- **硬要求：不落 git 工作树**。理由：机器高频追加进 git 面 = index 污染 + 多席收口冲突；观测数据系运行态非记录态。
- **两腿分离**：
  - 运行腿 = 观测文件（daemon 独占写，追加型）
  - 记录腿 = CFO 每日/每周从观测文件取数产 digest → operating-records + commit（人/席写 git）
- **行格式**（每读一行）：

```json
{"ts":"2026-10-08T09:30:05+08:00","weekly_pct":1,"weekly_reset":"2026-10-14T20:44:33+08:00","fiveh_pct":1,"fiveh_reset":"2026-10-08T01:47:52+08:00","level":"max"}
```

## 二、三线阈值表（input ②，bigmodel 周窗口径）

| 线 | 引擎阈值 | 名义值 | 动作 |
|---|---|---|---|
| 观测线 | weekly_pct ≥ **70** | 1.89B / 2.7B | 报 COO+BOD |
| 日 pace 警告 | 单日增量 ≥ **15** | 400M 点/日 | 报 COO |
| 暂停线 | 单日增量 ≥ **30** | 800M 点/日 | 报 COO+BOD+制停建议 |
| 5h 窗 watch | fiveh_pct ≥ **70** | — | 读数行内注记 |
| 5h 窗减速 | fiveh_pct ≥ **90** | — | 即报 COO+BOD 减速 |

**口径注记**：

1. **整数粒度取整**：端点 percentage 系整数粒度（实测 1%/77%），名义分数 14.8/29.6 入引擎取整为 15/30，防取整边界抖动；名义分数留本件备查。
2. **单日增量算法**：同锚跨日差——三锚（09:30/14:00/18:00）各自对昨日同锚求差（24h 净增），锚内触线即时判。
3. **谱系**：观测线/日 pace 警告/暂停线三线承 M6 批令（触发面挂 bigmodel 口径，CEO 2026-10-07 11:27 批）；5h 窗两级线系 CEO 22:49 令提权常态关注后本席判定（90% 线给排工留减速反应窗，BOD 22:5x 认收）。
4. **本席定位**：数值系 CFO 财务判定，候联审核定（COO 议程单已标不预采）。

## 三、首窗实证数据备查（阈值标定依据）

- 首窗轨迹：66%（09:24）→68%（10:45）→75%（16:55）→**77% 终值**（20:29 锚）；20:50 基线核验 77%→1% 重置正常（+7 天秒级吻合三重实证）。
- 单窗浪费外推：¥3,939.6×23%≈¥905.11/年（单样本算例非预测）。
- 观测线 70% 于首窗 16:55（75%）实际触发一次，报告义务执行实证（M6 护栏空转解除首笔）。

## 使用依据

- M6 批令（CEO 2026-10-07 11:27，BOD 知会）——三线触发面挂 bigmodel 口径
- CEO 22:49 令（BOD 22:50 转达）——14:00/18:00 双锚+5h 窗常态关注
- BOD 定谳卷 ccswitch-quota-endpoint-research.md（bcec4e825）——端点形态与响应结构
- 本席入账卷 cfo-adjudication-followup-20261007.md（1f26577e/ca7f963e/083ebb65/bfc7f090/82af13f3）——首窗读数与阈值判定全链

## 六、正身确认补记（2026-10-11 09:44+08，CFO 对 FSD 窗内落盘件对表）

COO 09:43 催办（DEM-004 deadline≈10-16）：FSD 窗内按本件 input 落 config `glm-quota-obs.thresholds.json`（observe70/pace15/pause30/5h70/90·asof 10-08）+端点独立实测。本席对表现状：

1. **阈值五值：确认，零更正**——observe70/pace15/pause30/5h70/90 与本件 §二五值逐一吻合（含整数粒度取整口径 14.8→15/29.6→30）。
2. **端点：确认为正身**——`GET https://open.bigmodel.cn/api/monitor/usage/quota/limit`、`Authorization` 裸值零 Bearer、200 `success:true` `level:"max"`、三型 limits（周窗 TOKENS_LIMIT unit6/5h 窗 unit3/TIME_LIMIT unit5）——与本席 10-07 起六次锚读活体形态全同（本卷 §三+日报卷全链佐证）。
3. **动作面映射随值正身**（触发→上报路由，属正身组成非可选注记）：观测线 70→报 COO+BOD；日 pace 15→报 COO；暂停线 30→报 COO+BOD+**制停建议**；5h 70→读数行注记 watch；5h 90→即报 COO+BOD 减速。config 文件若仅载数值，本映射以本件为载体（第 3 点系 CPO v2 收编候选一并归一）。
4. **首滚对表认收**：daemon 首行 09:30 quota_used=32%/5h 1%/weekly_reset=2026-10-14T12:44:33Z——与本席昨 18:00 锚（30%/1%）同向自洽、重置秒级吻合✓；观察线现役正常区。
5. 附加键（fiveh_pct/weekly_reset/plan_level/fiveh_watch）超 CPO schema v1 字段表——知情，本席行样例候 v2 一并归一，现不阻塞。
