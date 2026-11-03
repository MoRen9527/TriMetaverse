# ⑦ Score CLI 覆盖检查证据集（首 run a 彩排·fade-rehearsal-01#R1）

- sourceOfTruth: 本件（彩排构造件·非真源·不入真源叙事）
- syncMode: rehearsal-fixture
- lastSyncedAt: 2026-11-03T21:16:36+08:00（date 现查原值·⑦窗随行）

## 段位凭据

- 窗位凭据：CEO 2026-11-03 21:13 批「批」（⑦→⑩窗案原案照走·BOD board-be 转达 COS 21:13:49）——⑦窗 21:20·执行席=CAO（牵头席）
- 覆盖口径：⑦=Score CLI 覆盖检查（omission/required_all_passed）——证据在案性逐项对表·语义打分归⑧（COS+CAO 双席）·本集不含语义分

## T15 第二时点逐树核对（真分数打点）

| 树 | 节点链 | 判据（§12：节点全 done＋收口件齐） | 打点 |
| --- | --- | --- | --- |
| 树 A machine-line | A-N1→A-N2→A-N3 | 六报告在卷（node-A-N1/A-N2/A-N3·reports/）＋A-N3 收口判定（2e8cecc03·T5 门六 OP 逐字＋基准复断＋S1 靶面终验） | **PASS（T15=7/7·树 A）** |
| 树 B human-line | B-N1→B-N2→B-N3 | node-B-N1/B-N2/B-N3 在卷＋B-N3 收口判定（T6 门三维批卷＋窗口序终验） | **PASS（T15=7/7·树 B）** |

- 第一时点（开跑前小测）：③树清单 hash `a39746ee…` 断言 PASS（20:37·不加分留痕）。
- 状态位翻 done 以收口报告为凭·③全树清单不动（T4 冻结可溯）。

## 覆盖检查逐项读数（T1–T14·证据在案性）

| 项 | 覆盖 | 证据锚 |
| --- | --- | --- |
| T1 触发可重放可归因 | 有证据 | pre-task-brief.md 触发源段（BOD 20:00:33·三要素齐）＋run-registry 授权链表＋A-N2 报告差异集读数（RC=0·files=334） |
| T2 登记四不变量 | 有证据（⑦窗补铸） | **run 聚合键=变更文件集哈希 `281addc20dc08afc338ebfc9e2efe714f0bc315d75a2b5de4fd4d52275e688fb`**（排序路径集 sha256·四构造件）——⑦窗补铸入 run-registry（唯一/去重/关联/恢复锚四挂）；周平面登记行=本 W45 树目录在案 |
| T3 Qualify 机械门 | 有证据 | qualify-impact-list.md（影响面表＋过门结论）＋任务书边界明（④方案卷逐文件标域）＋锚齐（试卷 hash 在案 run-registry①） |
| T4 五件冻结＋收口对卷 | 有证据 | run-registry 五件读数＋二阶勘正链（6ad119aff→e09a3fc45→4c5750049）＋施工前后复算双绿（A-N2/B-N3）＋零 SOFT-DRIFT |
| T5 DCE 确定性＋副作用守卫 | 有证据（⑦窗补铸配料表） | A-N2 六 OP 逐字对表＋**配料表=doc-graph-scan.py v2·依赖=Python 标准库八件（argparse/json/os/re/subprocess/sys/collections/datetime·subprocess 限 git 调用面）·grep requests/urllib/http/socket/openai/anthropic=0 零模型 API 零网络写面**（⑦窗现场核补铸——A-N2 报告原缺显式配料表段·omission 消解）＋裸跑零写面=dry-run 语义经 OP-5/6 verify-only 实证 |
| T6 节点报告双门 | 有证据（含如实缺口） | 六报告十字段人工对表齐（A-N3/B-N3 收口核）；**node-report-check 校验器缺位承袭实录**（双门未机跑·如实记档候勘窗补验——omission 部分项·不虚标） |
| T7 Verify 独立后置 | 有证据 | re-scan RC=0（A-N2·head=697ca7d6a·internal_edges=684·external_files=78）＋校验器版本在案（doc-graph-scan.py v2·A-N2 报告 L77）＋独立后置（执行体≠校验器） |
| T8 Score 双段合成 | 段位候窗 | ⑧窗 21:40 候启（时点未到≠omission） |
| T9 Close 顺序四态 | 段位候窗 | ⑨⑩窗 22:10/22:20 候启 |
| T10 关联知会完备 | 有证据 | 引用面闭合（G1 域内/G2 归一化标注/G3 同名对）＋构造件零真源 owner（彩排构造·知会面=树链内已闭环）＋citedBy 反查=引用面在卷 |
| T11 巡检红线 | 有证据 | 真源 docs 零触碰（四构造件全在隔离面＋残留双断言全绿） |
| T12 覆盖红线 | 有证据 | 同上（三探针 G1/G2/G3 覆盖实证） |
| T13 单仓红线 | 有证据 | 同上（re-scan 对冲图谱真身·无越界挂接） |
| T14 Plan 协同作业对表 | 有证据 | 任务书 COS 协铸（043cd1e0a·增量四点）＋全树清单 COO 协定（87e0deda1）＋始于链在卷＋⑯两线分工落实 |

## omission 汇总

1. ~~T5 配料表缺位~~——⑦窗现场核补铸消解（依赖零模型 API 零网络写面断言在案）。
2. ~~T2 聚合键未铸~~——⑦窗补铸消解（`281addc2…` 入 run-registry）。
3. **T6 node-report-check 校验器缺位**——如实保留（双门未机跑·候收口勘窗补验或⑧⑨按证据裁）。

required_all_passed：required 项（T1–T7/T10–T15）证据在案 ✓（T6 含如实缺口注记）；S1=⑧窗语义项。

## 段收口

⑦ Score CLI 覆盖检查毕·本集落卷即段工件·候⑧窗（21:40 COS+CAO 双席·S1 语义评分·直读 tri-fade011-score SKILL.md 照办）。
