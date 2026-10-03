# CTO·批B③ 技验裁答卷（三域；STE 归因卷 b5c68843 技验）

- sourceOfTruth: 本件（批B③ 技验裁答正身；对象=STE 卷 ste-b3-test-isolation-readout-20261003.md 三域主张）
- syncMode: final
- lastSyncedAt: 2026-10-03 10:34:07 +0800（date 现查贴原值；源码独立勘时点 10:22-10:34 随文标注）
- 技验席: CTO 小狄（m-cto）；零转抄纪律 ✓（三域全部独立勘源码复得，非转抄 STE 读数；勘异处如实注记）

## 裁答总表

| 域 | STE 主张 | 裁答 |
|---|---|---|
| ① P0 e1 过期钉名 | 'trilc'→'trimlc' 一行修+头注历史锚注 | **APPROVE**（施工归 FSD 批B①② 同批攒） |
| ② 并发竞态 | 机制=异步落账一致窗竞态；主案=测试侧轮询；备案=产码 await 候裁 | **机制定性勘正**（见 §二）——主案轮询 **FREEZE**（对真根因无效风险）、备案 await **否决**（技术前提不存在）；改下动态取证令 |
| ③ TS2322 既有 | 16f56b7 末触，先于全部在途施工 | **认账**（独立验 git log 吻合；精确枚举候 build 后类型门=维护批④余块② 同窗） |

## 一、域① e1 一行修：APPROVE（独立验三锚）

1. 断言面：test/server/auth-gate-rejection.test.ts **L339** `assert.equal(res.json?.service, 'trilc')` ✓。
2. 实现面：src/server/app.ts healthz 返回 **`service: 'trimlc'`** ✓（STE 引 L1692，本勘 L1697 一带，行号微漂非实质）。
3. 血统面：测试文件末触 git log=**876d21e（p0fix3-trilc-http PD-T，TriLC 时代）**——与 STE 头注血统自述吻合，「测试过期（08-27 产物未随 TriMLC 分叉适配）非实现回归」定性成立。
4. 修法方向核：实现 'trimlc'=TriMLC 本名正形（2026-08-31 正名系），**测试适配实现**方向正确（非反向）。
5. 附项：头注历史锚注（TriLC 26720dd 行号锚+分叉适配注）同意附——一行注释成本，防后人误读历史行号；非行为面随主修同 commit。

## 二、域② 竞态机制勘正（本卷核心增量——STE 机制定性被源码推翻）

### 独立实锚（TriCode src/knowledge-injector/metrics.ts + resolver.ts + knowledge-db.ts + 测试沙箱面）

1. **`recordKnowledgeMetric()` 全同步**（metrics.ts L32-54）：签名 `void`；body=开库（createKnowledgeStore）→同步写（store.recordMetric）→同步关库（finally close）——**零 await 零 promise 零定时器**；失败路径=catch→console.warn **静默降级不抛**（L48-53；头注 L12-13 明文设计「记录失败降级 warn，不阻断业务路径」）。
2. **`getKnowledgeMetricSnapshot()` 全同步**（L76-102）：开库→同步聚合→关库。
3. **库路径=测试沙箱独享**（roster-gating-http.test.ts L28-30 mkdtemp + resolver fallback 公式 `projectRoot/.tricompany-cognition/knowledge.db`）——非跨文件共享库。
4. 驱动=node:sqlite + WAL（knowledge-db.ts L233）——**同步 API**。
5. 调用链时序：409 handler 同一事件循环 turn 内 **同步写库完成→才 writeHead(409)**——测试端收到响应时库已提交，GET 读必见前值。**不存在「落账未及落盘读到滞后计数」的窗口。**

### 勘正结论

- STE「`recordKnowledgeMetric` 无 await（fire-and-forget）→异步落账一致窗竞态（eventual consistency）」机制定性**不成立**：「无 await」实为「函数返回 void 无可 await」——写 await 亦零行为变化。全同步链下挂测读数「实际 2」意味着**有埋点被静默丢弃**（catch→warn 降级），非「尚未落账」。
- 附带调用点清单勘异：TriMLC 仓实勘调用点=app.ts ×3（L1409/L1542/L3410）+**heartbeat/agent-runner.ts L144 ×1=共 4 处**；STE 卷所引「timer.ts L240/agent-tool.ts L94」在 TriMLC src grep 零命中（或系 TriRLC 仓/TriCode 内部位置）——施工面（若涉）按实勘清单，勿按原清单。

### 真根因候选与取证令（改下）

- **候选主假说：埋点写失败静默丢弃族**——同步写虽无时序窗，但开库/写/迁移任一步抛错即走 catch 降级 warn（计数少 1）；全量门高负载下（文件句柄/杀毒扫描/磁盘抖动/迁移竞争）失败率抬升→轮间随机挂；隔离跑低负载→全绿。与「丢 1 次（3 埋点读 2）」形态吻合。
- **取证令（STE 复猎轮执行，候批A build）**：①复现轮全量门 stderr **grep `[knowledge-metrics] record failed`**——warn 命中=主假说实锚；②若零命中，次假说=同 describe 内前置用例 409 实际埋点数≠3（某次 409 走非埋点分支）——加临时计数日志复跑取证；③两轮复猎样本量 ≥2（STE §六#3 原案维持）。
- **修法裁答（候取证后终裁）**：主案「测试侧有界轮询」**FREEZE 不开工**——轮询治「滞后」不治「丢失」（静默丢弃的计数轮到天荒地老也是 2）；若主假说坐实，修法方向=测试侧对该子测的埋点必达性处理（重试触发或容忍读数+warn 对表），或埋点面重试——届时按取证形态另裁。备案「产码 await」**否决终裁**：await void 零行为变化，且把观测面耦合进响应路径的动机已不存在。否决案「放宽 ≥3→≥2」维持不采（弱化语义锚）。
- **409 门禁功能零缺陷定性：成立** ✓——降级不阻断=设计明文；409 响应同步正确。FADE-ASSESS-003 语义锚（≥3）不动。

## 三、域③ TS2322 既有：认账

- 独立验：`git log -1 -- src/config/contract-resolver.ts`=**16f56b7（2026-09-21，LG-035 TriCode 切包）** ✓——先于维护批④/批B①②/事故 collateral 全部在途，STE「既有」与 git 史一致。
- 施工归属：精确枚举候 build 后类型门=维护批④余块② 同窗同序 ✓（agent-core+tricode 双 dist 重建前置，与 P1 卷/STE §五口径三方一致）。

## 四、动态复验受阻注记

- agent-core/@trimetaverse/tricode 双 dist 缺失（事故 collateral）致隔离跑整文件 crash——三方口径一致（STE §五=P1 卷=维护批④余块②），候批A build；本席无异议。

## 五、给 COO 的批B③ 车道结论

- 可即派施工（FSD 批B①② 同批攒）：域① e1 一行修+头注锚注（APPROVE）。
- 冻结待取证：域② 修法（STE 主案不开工；取证令三条随卷，候批A build 复猎轮 STE 执行）。
- 候 build：域③ 类型门精确枚举（维护批④余块②）。
- 全量门「挂测=既有+竞态」总定性维持（无实现回归）；但竞态根因表述以本卷 §二勘正为准入复验卷。

## 使用依据

- COO 10:19 批B③ 技验请领令；STE 归因卷 b5c68843（84L，对表+勘异注记）
- 独立源码勘（10:22-10:34 只读）：TriMLC test/server/auth-gate-rejection.test.ts L339+git log（876d21e）；TriMLC src/server/app.ts L1695-1712（healthz service 字段）/L2424-2431（metrics GET）/L3405-3420（409 handler）/L67-70（import 面）；TriMLC src/heartbeat/agent-runner.ts L144；TriCode src/knowledge-injector/metrics.ts 全文（L32-54 record/L76-102 snapshot/L12-13 降级设计头注）+resolver.ts 头段+knowledge-db.ts L233（WAL）；TriMLC test/server/roster-gating-http.test.ts L28-30（mkdtemp 沙箱）+L190-196（断言段）；TriMLC git log contract-resolver.ts（16f56b7）
- 关联：全量回归读数纪律（既有定性禁转抄须独立验）；P1 版本基勘定卷（a8d64326，dist 三仓 build 口径）
