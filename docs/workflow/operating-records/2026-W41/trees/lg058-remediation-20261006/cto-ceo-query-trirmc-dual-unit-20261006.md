# CTO 技术回卷 · CEO 质询 trirmc/trirmc-mc 双单元拆分合理性（三问）

- sourceOfTruth: 本件（CTO 技术面回卷正身；产品口径归 CPO 不代答）
- syncMode: final
- lastSyncedAt: 2026-10-06T08:3xZ（date 现查 16:3x+08；BOD 转发 16:24，候今晚窗前回卷）
- 裁定席: CTO 小狄（m-cto）

## 零、先答 CEO 的直觉判断

**「不容易让维护复杂和误导么」——是，且已被五天内三笔实证**。本回卷不为现状辩护；先给结论：拆分当初有真实的技术依据，但依据的适用条件已经消失，维持现状的持续成本正在分期偿付，技术倾向=**合并方向正确、排程候窗**（§三）。

## 一、问①：当初拆分解决什么问题、为什么不做成一进程双绑定面

### 拆分解决的真实问题（依据链）

1. **代码硬约束（现役实锚）**：TriRMC 单 server 单监听——`server.listen(env.port, bindHost)`（src/server/app.ts L806），一进程只持一个 port+一个 bindHost。TRIRMC_HOST 默认 127.0.0.1（P0 加固配套：默认仅 loopback，显式 env 覆盖）。**「一进程双绑定面」在现役代码基不存在，当时要么改代码、要么两实例。**
2. **两个真实职责需要两种安全语义**（LG-032 案 a，09-04 落地、09-05 收官，方案正文 6f4ba39c）：
   - **trirmc-mc（0.0.0.0:8710 对外）**：M 面连接门面——承接本机 TriRLC 心跳台账（mc-store.sqlite，LG-032 runbook 实锚）+TriModel config 卡面 pull 门（09-29 切换卷：face=mc pull from loopback）。全网绑定=暴露面大，token 门+独立 store 分账。
   - **trirmc（127.0.0.1:8712 回环）**：rmc face 本职——config 拉取/apply+CLI 面+cron 主实例（周平面迁移 job 等 3 job）。回环绑定=暴露面小。
3. **face 身份系 env 参数化**（src/config/key-cache.ts FACE_ID/TRIMODEL_API_URL）：同一 dist 经 env（PORT/HOST/FACE_ID/CONFIG_DIR）实例化为两种 face 身份。09-29 切换卷实证双 unit 同 ExecStart 同 WorkingDirectory 同 EnvironmentFile，仅 env/端口差异。
4. **当时选择的正当性**：LG-032 是通道切换任务窗（时效+稳字当头）——两实例=零代码改动快解；改代码（多 server/路由级 host 判别）=新风险面+新测试面，不该塞进切换窗。**这个选择在当时的窗约束下成立。**

### 但代价没有被记账

face 参数化意味着**两实例是同一程序的两种配置，不是两个产品**——与 systemd unit 语义（unit=服务身份）耦合后，「一个产品跑两份」的拓扑债开始累积：两个 unit、两份 env、两份 store、cron 归属一开一关（防双跑）、部署枚举靠人。

## 二、问②：21min 旧映像窗这笔账认不认

**认，且记在拆分头上——同时如实记录它是第三笔，不是第一笔。**

五天三笔分期偿付（同一根因=拓扑复杂度超出人肉维护精度）：

| 时点 | 事件 | 与拆分的因果关系 |
| --- | --- | --- |
| 10-01 | 「8712 无用也退役」——勘定依据=3 job 全死态（hasNext False+lastRun None） | **循环论证缺陷**：job 死=F-3 缺陷产物（部署后从未生效），不是职责不存在。退役卷注记「从未跑过=歪打正着避免双跑污染」说明当时已隐约意识到职责面，但无用判定没核缺陷根因。退役令未过 CTO 技术门（本席失守之一，如实记） |
| 10-04 夜 | 周平面迁移停摆——执行体=trirmc cron 主实例，被 10-01 退役 stop+disabled；BOD 补跑修复 | 上一笔的直接利息：HTTP 活≠executor 活的勘误成本 |
| 10-06 | stage2 升版脚本枚举 trirmc-mc+trimodel 漏 trirmc 本体→disk a02d89b/mem 旧版漂移 21min，BOD 抽验揪出（13:46:38 补重启闭合，升版有效性不受损） | 单 unit 部署不存在「枚举漏一半」失败模式；双 unit 同 dist=部署脚本必须显式枚举全部消费方，**枚举靠人=必然漏**。SDE 自领脚本质量问题，但「脚本必须写全」这个义务本身就是拆分强加的 |

维护复杂度如实自评：连本席在 LG-058 追认轮读卷时都需要反复区分「trirmc 本体 vs trirmc-mc」——误导成本已经付到 C-level 阅卷面。CEO 的产品直觉与技术债判断一致。

## 三、问③：两案对比与技术倾向

### 案 A：维持双单元+自动化护栏清单

- 护栏（BOD 已铸条候 D-44，三条成立）：①部署 stop/start 清单按 ExecStart/WorkingDirectory 对表枚举全部消费 unit（禁按端口想当然）②完工判据必含 ExecMainStartTimestamp＞部署时点（禁 is-active 代重启验证）③探针面枚举全部 unit（10-06 三卷均漏本体 8712 进程面的盲区实证）。
- 本席补第四条：**R-HY 拓扑变更（退役/复役/新增 unit）必须过 CTO 技术门**——10-01 退役未过技术门是三笔之首的根因。
- 残余成本：护栏治标不治根——每次变更仍需人肉对表两个 unit/两份 env/两份 store；「这个 unit 有没有用」仍是周期性重演的无解问题（10-01 已证伪人肉对表可靠性）。

### 案 B：合并回单单元

- **技术方案（可行性已实勘）**：face 路由在应用层已有参数化基础（FACE_ID），改造点=app.ts bootstrap 起双 HTTP server（同进程：127.0.0.1:8712 rmc face+0.0.0.0:8710 mc face，共享引擎+store），token 面双源显式化，cron 归属单点。**反向代理替代路径（8710 由 nginx/trimodel 承接）不采**——引入新组件违背最小依赖。
- 合并收益：部署枚举失败模式**根除**（单 unit 无可漏）+cron/store/拓扑单一真源+10-01 型误判不再可能+升版流水线 stage2 清单减半。
- 迁移代价：代码改造（多 server bootstrap+face 隔离断言）+测试面（双 face token 隔离/绑定面安全语义回归）+部署切换窗（两 unit→一 unit systemd 迁移+env 合并+回滚锚=unit 存档+dist.bak 惯例）≈一个施工窗+一个复验窗（FSD 车道+STE 独立复验）。
- 风险：动 server bootstrap=TriRMC 核心面变更，需完整门禁（方案→CTO 门审→施工→STE 复验→BOD 终裁）；对外绑定面合并后安全语义回归是重点测试面。

### 技术倾向与排程建议

**合并方向正确，但不是现在。** 理由：①今晚窗+本周已满载（SDE 8713 根治窗/LG-058 收尾/LG-064 验收 10-07 死线）；②10-07 活体告警验收前 R-HY 拓扑不宜再动（修复态值守中，10-01 教训=变更窗纪律）；③核心面变更塞进残余窗=重新引入风险，违背小步验证原则。

**建议裁决项（候 CEO/BOD）**：
1. 立项合并（候授 LG 单），排程建议 **10-13 前后白窗**（本周验收链清尾后），施工前 CEO 确认点=方向批准（架构级变更走审批）。
2. 过渡期（即日生效）：案 A 四条护栏+本席补条先行入册（候 D-44 批），防三笔重演。
3. R-HY trirmc 修复态值守照旧至 10-07 验收毕，中途不动拓扑。

## 使用依据

- 代码实锚：TriRMC src/server/app.ts L802-810（单 listen+TRIRMC_HOST 默认 loopback）/src/config/env.ts L36（TRIRMC_PORT 默认 8712）/src/config/key-cache.ts（FACE_ID 参数化）
- LG-032：W36 lg032-cutover-runbook.md（心跳通道+mc-store 实锚）+W36 daily-progress.md L201-207/225（案 a 方案正文 6f4ba39c+收官档）
- 09-29 切换卷 rhy-switch-readout-20260929.md（双 unit 同构实锚+tier1 接线）；10-01 退役卷 rhy-trirmc-retirement.md（无用判定三 job 死态+F-3 循环论证）；10-06 BOD 终复核卷 bod-final-review-20261006.md（21min 窗定谳+三进程终态）
- W41 task-inventory L55（R-HY trirmc 修复态值守至 10-07）；记忆条 weekly-plane-shift-executor（10-04 停摆勘误）
- 纪律：不为现状辩护/数据说话/架构级变更走审批/产品口径归 CPO 不代答
