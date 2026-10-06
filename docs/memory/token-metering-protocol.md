---
name: token-metering-protocol
description: CFO token 实测口径——本机 transcript jsonl 逐条汇总 message.usage，窗级读数+cacheR 占比警示
metadata: 
  node_type: memory
  type: project
  originSessionId: 6c40e264-188b-444b-98da-de502d94852d
  modified: 2026-10-02T12:54:52.864Z
---

CFO 成本读数实测协议（LG-034 起为常设，晨报成本段/CFO1 认领项均用此法）：

1. **定位**：会话 transcript 在 `C:\Users\jedih\.claude\projects\<project-dir>\*.jsonl`；用本席曾发出的 SendMessage msg_id 或独有文本 grep 定位本席/相关窗（跨会话信封可能带 msg_id，一 pattern 多命中属正常）。
2. **汇总**：逐行 `ConvertFrom-Json` 取 `.message.usage`，累加 input_tokens / output_tokens / cache_creation_input_tokens / cache_read_input_tokens；窗 span 用条目 timestamp 首尾（**UTC 显示**，+8 转本地，见 [[session-forensics-basics]]）。勿依赖时间 cutoff 切分——Kind 混比较已实证不可靠，改按 span 全量读；**跨窗合并前按精确键 (timestamp,input,cacheR,output) 去重**——fork/compact 谱系会复制条目（本机实测 12.7%，不去重峰值虚高 ~28%）；**按 model 字段分账**可得平台归因（转录只记服务模型，账户归属不在其中）。dup 率逐语料实测（本机 12.7%／sg 0.1%，不跨语料复用）；模型族聚合须列全 id 清单（本机 deepseek 族 5 id：flash／v4-flash／v4-flash-0731／v4-flash-vision-exp／v4-pro-0813——pro≠flash 价，路由须认价）；读数须带「口径行」五要素（目录范围/时间过滤基准/去重键/族 id 清单/**校准行**：转录/后台因子——须同 id 同窗、随后台读数更新、版本化）方可复算对表。
3. **口径三警示**：会话窗累计≠单任务净耗（无轮级标记）；cacheR 占比 ~92% 为结构性重读（每 turn 重载上下文），报数必须分列；现金口径未接（本地/代理部署无单价账本），token=负担读数不折钱。**地区变体（2026-09-14 BOD 代采实勘）：sg 值席无 MEMORY.md 记忆层（本地 12.2KB），sg CLAUDE.md +17%——sg 席 bootstrap 估 ~40K vs 本地 47-48K，两地读数不可直接硬比，静态层构成先问面。** **平台账户变体（2026-09-15 现查实据）：本机=deepseek 直连（api.deepseek.com/anthropic）、sg=bigmodel 经 8460 代理——跨平台跨账户，两地 token 读数不可相加/比价，对表前先现查平台归属（本机模型可切，会话内见证 GLM→deepseek 切换）。**
4. **轮级净耗**：需排期单每批带「批号+起止时刻+参与席名单」标记，CFO 按窗切账；标记未落地时不硬凑净耗，明示缺口。
5. **实测基线（2026-09-11 夜）**：单席窗 80 万-5,500 万 tokens；12 窗单夜累计 2.30 亿。「每席次 1.5-4 万」类假设口径在本环境作废。**sg 侧基线（2026-09-15 实勘）**：7 日 ≈1.77 亿，活跃日 40-68M/日（高位稳态非突增），cacheR ~95%；部署批日可达 1.9-2.3 亿/日（批量作业例外通道之据）。证据=TMV docs/workflow/operating-records/2026-W38/sg-burn-curve-7d-20260915.md。
6. **turn 级冷/热拆分（2026-09-14 增补，系统提示词评估单实测定型）**：逐呼 input_tokens 数组取 first/min/max/avg + >30K 冷呼计数。冷呼（cache TTL 失效/新会话）=全量 re-prefill，是 fresh input 成本主承载（重窗实测 6% 冷呼承载 ~86% fresh input）；热呼 fresh input 0.4-10K + cacheR 33-43K/呼。bootstrap 三窗互证 47-48.4K tokens（文件层 10-15K + harness 固定层 ~30-35K + 首消息 1-3K）；warm-seed resume 窗的首呼 input 偏小（11-16K）+cacheR 大（33-36K），认冷启要看全口径（input+cacheR）。

7. **约束形态（2026-09-15 CEO 口径，窗值待控制台）**：GLM=**年订阅 coding plan，5h/7d 双窗限额**（非按量）；deepseek 直连=无限侧（无 429 观测）但**按量计费=边际现金成本（单价待供）**——溢出路由非免费，次序=GLM 用满→不急活排队至下窗→溢出为最后手段+现金上限。**本机近史（09-10..09-15 转录实勘）：GLM 族 3.31B（78%）／deepseek 943M——「本机=deepseek」仅现势快照；本机 GLM 键=TriModel 卡 `e-glm-anthropic` 尾 `VRyY` ≠ sg `qwH7`（异键；**键载体含 settings 与 TriModel 卡两处**）；**同户已定谳（2026-09-16 CEO 直答）→ 闸门=账户级（本机+sg 同纳），面级读数降为分项**；本机=耗尽主贡献（转录侧 ~50×，校准后仍 1-2 个数量级）。**账户级合并实测（2026-09-16）**：合计 8.38B（本机 **98.3%**／sg 1.7%）；账户 5h 峰 **9.97 亿**（09-14 13:33-18:14 +0800，窗内本机占 99.9%）——闸门实际对象=本机消耗。跨平台借因子禁用（如用 deepseek 因子折 GLM 数=违规占位，须先反推 GLM 因子）。**校准锚**：deepseek-flash ≈1.71×（959M 转录 vs 560M 后台）；GLM 因子待 bigmodel 后台。**首笔现金读数**：deepseek 侧 ¥64-132/10 日（语料口径差，单价空闲 0.02/1/4、高峰 0.04/2/8 元每百万）→ 现金不 binding、GLM 配额 binding；现金口径自此入晨报（月一行；后台锚定后 ≈十元级/10 日）。**CFO 闸门承载体=**5h 窗**（软 70%/硬 90%），溢出=预测性路由至 deepseek + 改道量照记（「无限」假设失效时保有基线）；TriModel v4 已有「额度型规则」骨架、额度信号钩子待接（与我侧闸值同批开发）。

8. **临时停止条件（2026-09-24 日限三数终版·CEO 20:46 批）**：容量口径终版=**周窗 27 亿 tokens（v2 特殊包年档，CEO 定谳）+积分并轨 100K 分（v2 换算率 27,000 tokens/分，独立非倍率表外推）**。**日限阶梯（tokens/日，终版）**：**预警线 4 亿**（日对账标注+趋势提示，达线即报 BOD）/**暂停线 8 亿**（当日 GLM 非刚需调用停、刚需维持）/**触暂停→通知 BOD 升级 CEO 决策**（BOD 不自裁，上呈）。旧积分空间线（130.6K/167.9K，挂 186.5K 锚）作废——186.5K 锚疑 ~18.65× 偏差候 BOD 复核。积分口径并存（控制台 20% 分母语义候一句确权）。b=日对账挂双线检测（执行件=`W38/ops-sg-rows.py`+`ops-merged-burn.py`；自动暂停件候 TriModel 额度规则，现阶段达线即报人工执行）；**日耗判定基线=本机+服务域合计（CEO 09-24 20:49 裁）——单侧读数禁止作安全/超限结论（CFO 09-24「0.28 亿/日安全」 premature 判定已撤回，两犯单侧样本结论入档防三犯）；合成读数出来前只报分侧数据不下判定**；c=批量报备+错峰排程照旧；a=「刚需」边界 CEO 09-24 20:21 口径=预算内正常业务均走 GLM，DeepSeek 仅限流应急备份（CFO「非时限全量走 DeepSeek」建议系口径漂移已撤回）；LG-046 迁移批=走 GLM+三护栏（错峰/报备/余量跌破 30% 停转应急）；备号冻结维持。**闸门上线后 CFO 出「护栏退役确认」一行**（2026-09-16 与 BOD 约定）。

9. **GLM 积分制与档位勘误（2026-09-24 对账定稿·CEO 终版吸收）**：**档位终版——账户=v2 历史特殊包年套餐，周窗 27 亿 tokens 容量（CEO 定谳）+积分并轨 100K 分**；09-16 起沿用的「Max 5h 28,000/周 140,000」系档位引用错全废（09-24 控制台 20% 对账闭合过程：本机 2,007 分÷10,000（Lite 反推）=20.07% 命中——Lite 系中间假设，终版以 v2/27 亿为准）；「Lite 周 10,000 分」降为风险注记情景（CFO「149% 外推」判断的假设前提，保留为 Lite 口径另一情景参考，终版以 tokens 容量为准）。积分折算公式（Flash 2.3/0.56/8+峰谷 ×1.5/×0.5）经对账反证正确；周=下单起 7 天固定周期；控制台不提供按键分账。f 双口径沿用；上周期打穿叙事历史冻结仅标注分母存疑。CEO 政策①现行=「刚需」边界 09-24 20:21 口径（见第 8 条）。

10. **跨面消息计量（2026-09-18 预留条，四 daemon 矩阵域消化产物）**：面（M/R）升为成本归集一等实体——归集四元键=**面(M/R)+服务域(TriMMC/TriRMC)+账户+模型**（k8s 化后宿主漂移不断链）；跨面链路（MMC↔RMC 主控对、LG-036 notify 通道 outbox→poller→confirm 双跳）为可计量单元（条数/字节/T1 时效/失败重试）。待办：①role 文档成本口径段增补候白皮书 1d 定稿对齐；②盘点表 A/B/C 档命名对齐四 daemon 服务域（协同项已转 m-cos 汇总）。

11. **盈利供数合同（2026-10-02 COO 对表定稿，BOD 知悉采信）**：运营计划表（CEO 10-02 20:39 盈利锚令，COO 建）成本/burn/收入读数=CFO 常设供数面。**频次=周五收口一供+周六 12:00 联审前补一版**；**形=三行式**（token 实测行：本机+服务域合计/分侧/冷热分列+口径行｜现金行：deepseek 按量+GLM 包年沉没｜收入模型现状行：真实账本缺口给框架+假设标注不编数）；另备**一次性基线三件套**（近 4 周成本曲线+单位经济现状+日限阶梯现势）候 COO 拉数令（预计 10-03 晨窗，执行件=W38 ops-sg-rows.py+ops-merged-burn.py 在卷可即算）。

**Why:** CFO1/晨报合同要求「token 实测 vs 预算」，实测是 CFO 唯一不编数的供料方式；假设锚已被实测证伪 2-3 个数量级。

**How to apply:** 席内 PowerShell 一轮完成 census（mtime 过滤）+usage 汇总；读数报 in/out/cacheR 三列+窗 span+口径警示；caps 判定用「窗-席」口径。关联 [[bod-date-check-before-report]]（回报先 date 现查）。
