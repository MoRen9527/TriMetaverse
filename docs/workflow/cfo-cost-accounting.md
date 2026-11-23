# CFO 成本记账面正身（cost-log · accountability · 评分计分解读 · runId 贯穿）

- sourceOfTruth: 本卷（docs/workflow/cfo-cost-accounting.md·CFO 记账面口径正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源：COO 施工令·批 5 记账面（#8/#9/#14/#16·2026-11-23T00:28:42Z）
- 范围边界：本卷=**读数与口径**（CFO 面）；成本护栏执行面=P2 护栏四件（16:07 裁决·余额门/累计门/轮级读数/告警字段）；消费产生面归 COO/CTO 统排。

## §一 · #8 cost-log 面（token 实测协议实现件）

**实现**：`scripts/cfo-token-meter.py`（本仓 scripts/·可机械判）

**用法**（三形态）：
```
python scripts/cfo-token-meter.py --selftest                      # 机械判锚：空数据零值 exit 0
python scripts/cfo-token-meter.py --from 2026-11-23T00:00:00 --to 2026-11-23T23:59:59   # 时间窗汇总
python scripts/cfo-token-meter.py --day 2026-11-23 --json --turns # 日窗+机器可读+turn 级明细
```

**口径正身（四分列·不折现金）**：`input_tokens` / `output_tokens` / `cache_read_input_tokens` / `cache_creation_input_tokens` 分列报数；**禁折算现金**（现金面以平台余额扣减为硬真值）。

**口径勘正记录（2026-11-23·重要实证）**：
- **错误口径**：按 file mtime 筛「今日文件」汇总 → 单文件 400MB+ 跨多日延续 → 实为**全生命周期累计**（2026-11-22 首跑 87,332 records / cache_read 13.2B / 折算 1336 CNY vs 实扣 42 CNY = 31.8× 偏差）。
- **正确口径**：按 usage 记录 **timestamp 字段**过滤（bytes 级双层快筛：`b'"usage"'` + 日期前缀）→ 2026-11-23 真日窗 = **374 records / input 480,875 / output 276,501 / cache_read 118,501,376**。
- **结论**：31.8× 偏差真因=**口径错误（mtime 筛 ≠ 内容日窗）**，非计价差异——「不折现金」纪律与 timestamp 过滤双正形自此固化。

**读数边界（必须随读数同报）**：本脚本=**本机 transcript 可采面**（当前 project 子目录）；**不是账户全量**（sg 面席位/其他项目目录不在内）。账户全量唯一测法=余额差分（GET /user/balance·零 token）。**两数不可互推**。

## §二 · #9 accountability 面（消费面三分·可见性缺口）

**消费面三分**（余额=账户真值·无分解——任何归因不得停在「施工消耗」）：

| 面 | 有账否 | 读数通道 | 状态 |
|---|---|---|---|
| ① spawn 面（fade/loop/score_skill 等程序化 spawn） | **有账** | cost-log.jsonl（fsd 面·run 目录维度·trigger=auto\|manual+task_id 字段） | delta 因 spawn env 无 DEEPSEEK_API_KEY 全 null（降级形·补 key 挂账候裁） |
| ② 会话面（12 席常驻会话模型调用） | **无账** | 本卷 §一 脚本（本机可采面） | **结构性缺口本体**（2026-11-22 30× 跳升异常之真因候选） |
| ③ 订阅/其他面 | 无账 | N/A | 未识别 |

**问责链**（读数→归因→升级）：读数异常（速率跳变>2×）→ 先分离三面（spawn 有账可直查·会话面用 §一 脚本·残差升级）→ 残差无法归因即报 COO+CFO 联查 → 触及硬护栏（余额门/累计门）即停并升级报。

**账户级硬真值铁律**：**余额差分=唯一账户全量口径**；token 读数只作相对量（趋势/占比），不可推现金、不可反推他人消费。

## §三 · #14 评分计分解读（M3-v2 双达标·口径解读件）

**M3-v2 正身**（COS 勘正 3fd7892d9）：**两对象分立·不加总**——
- debug→test：**A>90 且 B>90**（双达标）
- test→prod：**A>95 且 B>95**（双达标）
- 任一不达标 = 停留在原态（不升级）；**禁单分数/禁加总/禁折算**。

**对象与标尺**：对象 A（fade-001 实现规范度·A1-A7 池）与对象 B（周迁移质量·B1-B6 池）各自独立评分；标尺=CAO 卷 `cao-review-yardsick-20261122.md`（版本锁：一轮内不改标尺）。

**breakdown 回溯规则**（每轮必可回溯）：判读（标尺锚+实跑读数+三分）→ 维度分 → 等权/加权 → **对象总分**；禁只有总分无 breakdown；拒判维度标 `rejected`/`N-A` 禁折算补位（D-86 §一面②款4）；七席同维分歧≥2 档显式列（不抹平）。

**成本两轴分立（D-86）**：评分 100 制=**质量面唯一口径**，**成本不入分**；成本效率作附列观测（轮级 token/元·相对量）供下轮优化，不参与扣减。理由=防「少干活=高分」反向激励；成本纪律由护栏机制管（本席域）。

**当前轮衔接实锚**（2026-11-23 本席两轮评分）：对象 B=75.0（B3 65/B4 78/B5 85/B6 72）·对象 A=58.75（A1 70/A3 40/A4 65/A6 60）→ **双不达（A 需>90/B 需>90）→ 留 debug/evolve 态**。

## §四 · #16 runId 贯穿（读数侧配合·与 FSD 协作）

**正形=runId → 时刻表 → 时间窗 → 读数归集**（非 transcript 全文搜 runId·大文件下不可行）：
1. run 有明确起止时刻（例：`shift-W48-ignite-20261122T175743Z` 起 17:57:43Z → arrival 18:17:54Z）。
2. 成本读数按该时间窗取：`cfo-token-meter.py --from <起> --to <止>`（§一 脚本）。
3. spawn 面按 run 目录直取 cost-log.jsonl（fsd 面已有 run 维度）。
4. 两面对表=该 run 的**本机可采 token 读数（§一）+ spawn 账（fsd）**；账户级仍以余额差分为准。

**接口约定**：FSD 侧 cost-log 每行含 `run_id`/`trigger`/`task_id`/`seats`/`start`/`end`；CFO 侧以 `--from/--to` 对齐·不要求 transcript 内容含 runId（辅助 `--runid` 参数保留但标注大文件较慢）。

## §五 · 使用依据
COO 施工令（2026-11-23T00:28:42Z·批 5）；token 实测协议（memory·四分列不折现金）；M3-v2（COS 3fd7892d9）；CAO 标尺卷（cao-review-yardsick-20261122）；D-46（零值出机）/D-47（落款现查）；2026-11-22 30× 异常勘实链（fsd cost-log c639832a+COO 洞察+本席余额双读实证）。

—— CFO 小财（m-cfo·记账面四件正身）
〔落款 2026-11-23 08:37:22 +0800 现查〕
- 〔自警注·D-47 近失第六笔〕本笔落款初写占位「08:39:xx 现查候勘正」——写后自检捕获·重跑 date 勘正为现查原值 08:37:22。（近失序列：19:51/20:41/05:45/08:33/18:30+本笔·正形=先 date 后写笔·占位形态零容忍。）
