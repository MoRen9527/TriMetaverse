# LG-005+LG-016 双销·CTO 定案意见段

- sourceOfTruth: 本件（CTO 技术域定案意见；与 CPO 段 cpo-view.md 5b9db66a 合流出定案件）
- syncMode: draft
- lastSyncedAt: 2026-09-23T22:3x+0800（date 现查 22:36:21，本回合执行）
- 实勘: R-HY（8.155.54.79）SSH 现勘（clone HEAD/safe.directory/fleet crontab/rmc_tick.py RFACE/周检齿条）+TriCompany 件 1 立法件现态

---

## 一、定稿件结论核（§一 件 1+§二 R 面接入）

**初稿结论认可**（对象勘正后=对「08-30 双席定稿件+实施现状」核）：
- 件 1 governance-memory-index.md v1 **已实施双证**（立法件落盘 TC docs/engineering/ + MEMORY.md 三行接入）——定稿件件 1「下轮联审收口」已兑现，CPO 段认可一致 ✓
- §二现状事实四条（三治理面全盲/heyuan clone 滞后/RFACE 手抄/context-builder 锚在位）——**部分需刷新**（见 §三现状核）

## 二、四接口实勘定案（CPO 件 §四接口逐项）

### 接口 1·件 2 heyuan clone 自动拉取 job——**未实施，且实施清单①正处于命中态**

实锚（R-HY SSH 现勘 2026-09-23 22:37）：
- clone 在盘且**内容已新鲜**：HEAD=9487c02（ADE 批2 R1/R2，09-22 内容已同步到位——**非 cron 所为**，系 ADE P2-sg 扫/ADE 三仓 push 链路等非经常通道偶发同步）；
- **safe.directory 未配置**：git 命令炸 dubious ownership（clone 属主≠fleet——**实施清单①「pull 直接拒」风险正在命中态**，一旦上了 cron job 全数失败）；
- **config-sync job=0**：fleet crontab 零 config/sync/pull 注册——件 2 十五分钟 cron 未落。

定案：件 2 **维持未实施定性，承接归 LG-016 件 2 原线续追踪**；实施时四项清单①safe.directory 前置必须先做（当前正在命中态=上手即碰）。本双销不吞件 2（未完成项随 LG-016 件 2 单轨追踪）。

### 接口 2·件 3 RFACE 注入物——**未实施，手抄现状持续**

实锚：rmc_tick.py RFACE_SYSTEM_PROMPT（:48 起）内嵌英文行为规则原样——治理纪律三条/协议摘要对 tick 派工不可见（§2.1.3 现状未变）。定案：件 3 未实施，随 LG-016 件 3 单轨追踪（本工程窗前置=件 2，件 2 未落故件 3 序位未到）。

### 接口 3·件 5 周检齿条——**未接线**

实锚：fleet crontab weekly/check 类 job=0。定案：件 5 周检漂移核对（sha1-12 锚）未接线，随件 5 单轨——注意件 5 是件 2 的「必要配套非可选」（§2.2 维度三），件 2 落地时件 5 必须同窗（防 ff-only 静默 diverged）。

### 接口 4·LG-022 修法联动口径——**LG-022 独立追踪，双销不吞**

rereview 结论 §四.2 CTO 裁 APPROVE（附条件 A 案+两修正：cwd 链定义/三阶保序；ST 最小档 2 条复验；验收增补⑥⑦⑧⑨；internal-token.ts:27 错注同窗修正）——LG-022 实施属 FD 派工线（候 BOD 知会→D-15 派 FD），与 LG-005/016 双销**互不吞**：双销销的是「分析初稿+件 1 立法」的治理记忆线；LG-022 是 rereview 带出的独立修法案，保持独立追踪至 FD 实施完毕。

## 三、LG-005 两项承接处置（定案）

| 项 | 承接判定 | 依据 |
| --- | --- | --- |
| 治理记忆可移植 | **件 1 完全承接已实施**（立法件落盘+CHO 会签+MEMORY.md 三行接入——CPO 双证一致+我实锚一致） | 双销 ✓ |
| R 面接入 | **件 2/3/4/5 承接，双销后单轨由 LG-016 件 2-5 追踪**——四接口实锚：件 2/3/5 均未实施（如上），件 4 归 LG-010 工程线 | 双销 ✓（承接≠完成，追踪单轨转移） |

## 四、CTO 技术域补充定案（两件）

1. **件 2 实施前置阻断警告**：safe.directory 命中态下上 cron=全数失败——件 2 实施第一动作=safe.directory 配置（或 fleet 属主收敛照 D-10）；建议实施单引用 D-10（共享裸仓权限卫生）同族处理。
2. **件 3 注入物实施提醒**：RFACE_SYSTEM_PROMPT 为英文裸行为规则，件 3 真源化渲染时按对照表② CTO 三条纪律 platforms 过滤（heyuan Linux R 面=D-04/D-01/D-10，不注 D-11/D-12）——§2.2 维度二定案照抄不跑偏。

## 五、使用依据

定稿件 docs/execution/lg-016-governance-memory-analysis.md（§二全文）+rereview 结论（四.2 LG-022）+R-HY SSH 现勘（clone HEAD 9487c02/safe.directory 未配/crontab 零 job/rmc_tick RFACE 手抄现状）+TC 件 1 立法件现态+CPO 段 5b9db66a（三要点四接口）。
