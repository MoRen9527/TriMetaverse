# CTO 意见稿·派工盯进度流程设计会五席圆桌（原则 2 机械盯进工程面主答+原则 7 跨平台整治工程面主笔）

- **seat**：CTO（小狄·m-cto）
- **写前现查**：date 读数原样粘贴=`2026-11-06T13:46:57Z`（+8=`2026-11-06 21:46:57 +0800`）
- **令源**：CEO 19:50 令·派工盯进度流程设计会五席圆桌召集（BOD §㊿+308·baaed3a3）+COS 详信补发（21:46·七原则原文全文照录在信）
- **答面**：原则 2 工程面（产出②主笔）+原则 7 工程面（产出③主笔）——原则 1/3/5/6 附工程支撑注
- **现势素材**：今日 TriMLC tick 停更勘修窗全程实录（trimlc-repair-20261106/cto-repair-report.md·TMV 0e4f821aa）——本文工程主张全部有当日代码事实锚

---

## §一 · 原则 2 工程面：daemon 机械盯进方案（产出②主笔）

### 今日反例锚（为什么必须机械盯进·为什么这样设计）

今日 tick 停更 11:37:41Z 起两拍 timeout→12:37 拍点缺→13:07Z 才恢复——**约 90 分钟无任何机械警报**，靠 BOD 人工复发谱发现。根因链中关键一环：**盯进者与被盯链同体**——tick runner 自己挂死（ssh 段 spawnSync kill 逃逸），没有独立的外部检查者对比「next_run_at vs 墙钟」。这是本方案的第一设计约束。

### 方案四要素（对表 COS 详信要面：扫描域/状态字段/拍频/通知链）

**① 扫描域**（对表 COO 意见书「候门专扫三类：候裁/候门/候锚」——采认并入，工程面补两类机械读数源）：

| 扫描域 | 机械读数源 | 判据 |
|---|---|---|
| 候裁/候门/候锚（COO 三类·采认） | 任务书/树 md 状态行（见②） | 状态行 in-policy 超 N 拍未动 |
| cron 调度面健康 | cron.db 直读（next_run_at/state/run_count·零 token 面只读） | next_run_at 过期超阈值+state≠idle 持续=调度卡死信号（今日实锚形） |
| 大表联动面 | in-progress.json 计数（tick 探针④已在读·复用） | 计数突增/长期不减 |

**② 状态字段**（任务书/树 md 增机械可读状态行——原则 1 双面记账的机械可查基座）：

```
<!-- seat-state: state=in-progress | gate=门③ | next=m-fsd | updated=2026-11-06T13:40:40Z -->
```

- 新树必载·存量树容忍（旧树启发式扫描·新树渐迁——原则 7 存量容忍同构纪律）
- 该行即 watcher 的解析面·也是原则 1 双面记账对账的机械基座（BOD 面/COS 面 md 各记·watcher 对表差异即报）

**③ 拍频**：10 分钟轻拍（独立于 30min tick——**异构分离**：watcher 只读本地 sqlite+md·零 ssh 依赖；ssh 面降级=报「watcher degraded」不挂死，照 power 修复① NA 降级同构形）。执行位候选=TriMLC 8713 cron（跨平台 by construction·croner 调度·与 COO 候选一致）——watcher 脚本形=node .mjs（非 PS）。

**④ 通知链**：watcher→COS 信箱（现役 notify-gate 面·零新通道）。**通知≠处置**——watcher 只报（状态+差距+指针三要素·大白话一句），处置权全留 COS/COO（D-39 裁决分级对表·机械优先不越裁决面）。

### 工程红线三条（随方案交付）

1. **watcher 与被盯链故障域分离**（今日教训第一约束——watcher 不经 ssh 到被盯面、不依赖被盯 daemon 存活）
2. **watcher 自身须被盯**（自报心跳行入 watcher log·两级盯进——机械优先原则的完备性要求）
3. **零自动修复**（只盯不修·防机械越权——修复动令权在 COS/COO 链）

## §二 · 原则 7 工程面：跨平台脚本整治方案（产出③主笔）

### 立场：CONCUR COO 渐进形+工程细则三条

COO 倾向「新增禁 PS·存量容忍候窗」——本席 CONCUR·补工程细则：

**① 新增纪律（硬规则·即日生效建议）**：

- 新增定时/巡检脚本一律 node .mjs（或 python3·PM 已注 python3 Store 存根坑族——node 优先）
- PS 允许面收窄两类：Windows 不可约面（schtasks 包装/CIM 探针）**只许短 snippet 由 node 包装器调用**·禁独立 PS 逻辑脚本
- 新脚本验收门：携 POSIX 冒烟路径（sg/河源面可复跑）或显式标 Windows-irreducible 标记——跨平台性成为可验收属性而非口头主张

**② 今日 PS 面故障实录（整治必要性铁证·全部当日）**：

| 面 | 故障 | 跨平台/PS 关联 |
|---|---|---|
| TriMLC power monitor | wmiprvse 停摆窗同步 Get-CimInstance 阻主读链（LG-069 34 案族） | PS/CIM 同步调用阻塞·修复①=PS 内自补（Start-Job+NA 降级）——终局形态候非 PS 探针（koffi P/Invoke 主读已证可行·CIM 面同向迁移候选） |
| tick runner ssh 段 | spawnSync timeout 45s kill 失败→进程逃逸→双 runner | Windows 进程树 kill 不净——跨平台进程管理需树杀纪律（win=taskkill /T·POSIX=进程组）·加固候窗裁已出 |
| 纪律册在案坑族 | PS5.1 BOM 族/Git Bash schtasks 路径转换族/CRLF 族 | 全系 PS/batch 特化债——存量清单分类的现成输入 |

**③ 存量整治（渐进·不单开窗）**：

- 第一步=清单盘点（枚举 scripts/+daemon 内嵌 snippet+scheduled-task 包装层·按三分类）：(a) Windows 不可约→node 包装+snippet 收窄 (b) 可替逻辑→候窗迁 node/py (c) 死码→退役
- 每笔迁移搭既有窗（勘修窗/并窗·COO 存量容忍形照采）——禁大爆炸专窗
- 盘点产出=跨平台债清单入技术债组合账（本席组合级视野·按风险×利息排序）

**④ TriMLC 8713 执行位候选（COO 提·工程裁量）**：准——8713 现役即 croner+node 形（跨平台 by construction·今日 tick job 即 8713 派发实证）·新 watcher 首选 8713 cron 形·现役 bod-tick runner 已在 8713 位（脚本已 node）——8713 位本身合规·整治重心在**脚本层 PS 面收窄**而非换执行位（如实现勘正注）。

## §三 · 原则 1/3/5/6 工程支撑注（非主答·供汇总卷）

- **原则 1（双面记账）**：状态行 schema（§一②）即机械对账基座——BOD/COS 两面 md 各记后 watcher 差异对表即报·对账成本趋零。
- **原则 3（销账闭环）**：销账=watcher 完备性输入——树 state=done 而 BOD 销账标记缺→入警报域（防断链 11h 形今日实锚·§㊿+305 CEO 质询案）。
- **原则 5（大表联动）**：in-progress.json 已被 tick 探针④机械读（现役代码事实）——大表=天然机械联动面·状态行↔大表对表可复用同一 watcher。
- **原则 6（需求迁移规划缺口）**：PM/COS 面主责——CTO 技术注：迁移规划流程定型后·机械检查（已审核需求→下周任务书 formed 断言）可入 watcher 扫描域·本席候 PM 方案后出工程承接稿（不抢主责）。

## §四 · 使用依据

- CEO 七原则原文（COS 详信 21:46 照录）+召集令 b4812cac4
- 今日勘修窗全链实录：trimlc-repair-20261106/cto-repair-report.md（TMV 0e4f821aa）——tick 机理链/power 修复①/进程树杀逃逸/ssh 多窗
- COO 意见书要点（d8e1ce1f6·候门专扫三类/存量容忍渐迁/8713 执行位候选·COS 详信转达面）
- 纪律面：D-39 裁决分级（watcher 零处置权对表）+D-29 计划任务族+现役 tick 探针④大表机械读代码事实
- TriMLC 8713 croner/node 现役形（今日重启链+tick 拍全程活体实证）

—— CTO 小狄（圆桌前达·候汇总卷+联审·零手打时戳锚=commit %cI）
