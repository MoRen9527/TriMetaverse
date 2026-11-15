# CTO 设计定稿·plan 段 agent 判断面施工设计（CEO 三点裁决 14:26:37 定谳·今晚可用形）

- sourceOfTruth: 本卷（fade001-tenstage-deploy-20261115 树·施工设计正身·设计冻结形）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: CEO 14:26:37 三点裁决定谳（候裁点 a=首拍前改后链上拍·今晚 23:50 用修正后的链·台账 623）——本卷=620 派工令①设计定稿+②回滚预案+③dive 锚关系三合一
- 席位: CTO 小狄（m-cto·设计冻结·施工窗 owner）
- 架构基准: cto-plan-agentization-ruling-20261115.md（e604bb5d8·快慢道分诊+脚本守门裁决卷）——本卷=其施工级细化

## §一 · 架构形（施工级）

### 1.1 快慢道分诊（plan_scope.py 内改造）

```
扫描全集 S = from_week/trees/ 全条目（现役零改）
  │
  ├─ 快道（现役机械判据·零改）：证据链完整树
  │    tree-op.json status ∈ 判定集 且 authorization.json expiry 有效且无冲突
  │    → 现役三分类直出（零 agent 消耗）
  │
  └─ 慢道（新增 agent 判断面）：歧义树
       a) degrade 链走到「默认 keep」的树（缺 tree-op.json 或 expiry 缺失/过期）
       b) 证据冲突树（status 与 expiry 判向不同）
       → agent 语义判断：
         输入 = {tree_name, evidence_summary(现役证据面读数), tree_brief(目录内容摘要·≤2KB:
                 README 首段/workbench 面/最近文件清单), from_week, to_week}
         输出 = {family: "migrate"|"keep"|"carry_over", confidence: 0.0-1.0, reasons: str}
```

### 1.2 agent 调用点（机位与形态）

- **调用形态=plan_scope.py 进程内 HTTP 调用河源 daemon agent loop**（localhost:8710·R-HY 面）——**payload 串零触**（jobs.json cmd 照旧 `python3 -m runtime.cognition.plan_scope ...`·见 §四 dive 锚关系）。
- **调用协议**：POST /internal/v1/agent-run（或 daemon 现役 agent loop 端点——FSD 施工时以 8710 现役路由实勘为准·设计约束=端点不存在/超时→走 fail-closed 分支）。
- **超时与重试**：单树 agent 判断超时=60s·重试 0 次（超时即 fail-closed·不重试——23:50 时序刚性下重试=不确定性放大）。
- **fail-closed 分支**（设计硬约束·段不炸）：agent 调用失败（超时/端点 404/返回非契约形）→该树降级 **keep + reason="agent_call_failed: {异常类名}"** + `agent_readings` 标 failed——段照跑·plan.json 照落卷（与 score 引擎降级面同构·哑卷≠段坏）。

### 1.3 守门面（脚本保留·三护栏）

1. **结构校验**：family 值域枚举外/confidence 非 float[0,1]/reasons 空→该树降级 keep+reason="agent_output_malformed"（替身禁令精神：agent 输出不可信面=按 fail-closed 处理·不盲收）。
2. **置信度门槛**：confidence<0.6→保守 keep+reason="agent_low_confidence"（误封存可候审补救·误迁移不可逆·保守方向=可辩护方向）。
3. **双向断言照走**：M∪K=S 零遗漏零重叠断言含 agent 判定树——agent 面只是「分类读数生产者」·断言权在脚本（替身禁令/双向枚举/exit 2 拦停全保留）。

### 1.4 契约面（冻结形）

- plan_version：**"1.1.0"**（1.0.0→1.1.0·minor 升——既有字段零动）。
- 增补字段：`agent_readings: [{tree, family, confidence, reasons, source: "agent"|"fast_path"|"failed_fallback"}...]`——审计面（值守读 plan.json 即审 agent 判断质量）。
- 既有字段（migrate[]/keep[]/carry_over[]/counts/bidirectional_ok/index_drift 等）**零动**——下游 verify/dce/score/close 消费面零波及。

## §二 · 施工面清单（FSD 四笔预排·每笔 HEAD 态全绿回滚粒度）

- **笔 1**：plan_scope.py 慢道分诊+agent 调用面（HTTP 调用+fail-closed+结构校验+置信度门槛）——机械判据快道零改（既有行为零变·回归钉）。
- **笔 2**：契约 1.1.0+agent_readings 字段+PLAN_VERSION 升版。
- **笔 3**：test_plan_scope 增案族——快道回归钉案（既有案零改全绿）/慢道 agent mock 案（正常判定形/结构门拒收形/低置信降级形/调用失败 fail-closed 形/超时形）/双向断言协作案（agent 判定树入 M∪K=S）。
- **笔 4**：payload 零触验证笔（jobs.json md5 对表 4e1c7df5 零变断言+CLI 手跑 smoke=快道树判定与 1.0.0 同值对表）。
- **门禁**：184+新增案全绿·validation 基线零漂——STE 独立复验+CTO 验收确认链（同 γ 序形）。
- **R-HY 同步**：施工毕验收毕→R-HY tricompany-pull 同步+检出顶值断言（值席面）。

## §三 · 回滚预案（三梯度+四检查点止损线）

### 3.1 回滚梯度

- **L1（agent 慢道失败·快道正常）**：fail-closed 降级 keep 已内建——**零回滚**（设计内护栏·链照跑·清单缺陷=已知态可候审）。
- **L2（plan 段异常/结构门炸）**：段 3 exit 2=范围拦停·本拍不执行零破坏（现役行为）——首拍 failed 读数经 COS 升级；回滚=**git revert 笔 1+笔 2**（保留笔 3 测试面+笔 4 验证面·零产码损）→plan_version 回 1.0.0→R-HY 同步回滚版→回现役链形。
- **L3（改后链全链异常）**：dive 或预演发现→revert 全部改链产码笔（笔 1+2）→R-HY ff-only 同步→**回现役链形=已验证基线（readiness APPROVE 态·十阶段形锚在役）**→首拍照旧现链 23:50。

### 3.2 四检查点止损线（go/no-go·任一 no-go 即报 COS「首拍照旧现链」候 CEO 再裁·**不硬赶**）

| 检查点 | 时点（+08） | 判据 | no-go 动作 |
|---|---|---|---|
| T1 | 20:30 | FSD 施工毕+门禁 184+新增全绿 | 未达→revert→回现役链 |
| T2 | 21:30 | STE 复验+CTO 验收毕 | 未达→revert→回现役链 |
| T3 | 22:30 | **新链预演拍读数全预期**（SDE 手动触发·段 3 agent 面真值+十段全链） | 非预期形→revert→回现役链 |
| T4 | 23:00 | R-HY 同步毕+dive 前置探读毕（检出顶=验收 commit） | 未达→revert→回现役链 |

**新链预演拍=硬前置**（裁决卷既定·CEO 选项 1 隐含）——预演拍=新 plan 段+agent 面**唯一真值验证窗**·跳过=T3 不可判→默认 no-go。

### 3.3 首拍中新形响应（事后面）

首拍 23:50 若段 3 新形炸（降级面外未知异常）→段 3 exit 2 拦停·零搬家零破坏→首拍 failed 读数经 COS 升级（判读表外新形如实报）→R2 复原时点顺延·revert 回滚窗开·补拍细节候 CEO 裁（零自动重拍）。

## §四 · 23:45 dive 判据锚更新关系（③确认读数）

**结论：payload 形锚（十阶段形 2750/4e1c7df5）照旧零换锚。**

- 依据：本设计**payload 串零触**（jobs.json cmd 照旧·agent 调用在 plan_scope 进程内 HTTP 到 daemon·不嵌 payload 序列）——cmd_len/md5 零变→值席 dive 判据面主体零换。
- **dive 检查单增补三行**（随改后链）：
  1. R-HY 检出顶值=验收 commit 逐字对表（现役 ddda8dcd 锚值作废·换新值——值席换锚流程照走）
  2. plan_version 断言=1.1.0（预演拍 plan.json 读取·首拍 dive 时预演产物在）
  3. agent_readings 字段存在性+source 分布读数（预演拍产物·首拍判读对照基线）
- 托转序列零影响（托转一/二对象=jobs.json 形态·本改零触）——预告五条 83b77b2cd 照役。

## §五 · 时序总表（倒排·+08）

> **排程 governs 注记（commit 前增补）**：工序排期归 COO——正式排期=COO 倒排排期卷（79b07e576·G 系六 gate：G1 设计 15:30/G2 施工毕 17:00/G3 门禁毕 18:30/G4 R-HY 同步毕 19:30/G5 新链预演毕 21:00/G6 冻结死线 23:30→23:45 dive→23:50 首拍）。本表=技术面可行性参考·**§三 3.2 四检查点改 gate 事件绑定形：T1↔G2 施工毕门禁全绿 / T2↔G3 门禁毕（含 STE 复验+CTO 验收确认链）/ T3↔G5 预演读数全预期 / T4↔G6 死线前 R-HY 同步毕+dive 前置探读毕**——钟点列降为参考值·与 G 系冲突时 **G 系 governs**·no-go 语义不变（任一 gate 失守→如实报 COS「首拍照旧现链」候 CEO·不硬赶）。

| 时点 | 事项 | owner |
|---|---|---|
| 14:30-15:30 | 设计定稿（本卷）+FSD 接令 | CTO |
| 15:30-19:30 | 四笔施工（每笔 HEAD 全绿） | FSD |
| 19:30-20:30 | STE 独立复验 | STE |
| 20:30-21:30 | CTO 验收确认链 | CTO |
| 21:30-22:30 | R-HY 同步+**新链预演拍**（SDE 主刀） | SDE/值席 |
| 22:30-23:00 | 预演读数判读+T3/T4 检查点 | CTO/值席 |
| 23:00-23:45 | dive 前置探读（增补三行+锚换值） | 值席 |
| **23:50** | **首拍·修正后链上拍** | 链自动 |

COS 搬移全量分析清单（agent 输出形真值样本）随到随并入笔 3 mock 案真值面（{family,confidence,reasons} 形对表）。

## 使用依据

- CEO 14:26:37 三点裁决定谳（COS 更新令 14:28:14·台账 623 笔·sg 顶 b7b4e0e53）
- cto-plan-agentization-ruling-20261115.md（e604bb5d8·架构裁决卷）
- plan_scope.py 现勘（416 行·快道判据/双向断言/替身禁令/退出码族）
- score 引擎降级面同构先例（2905840）·FADE 域 fail-closed 族规
- 十阶段形锚在役判据（e672f3f50·2750/4e1c7df5）·托转序列预告 83b77b2cd

——CTO 小狄（m-cto）·写前现查 2026-11-15T06:29:05Z（+8=14:29:05·date 现查原值·D-47 正形）
