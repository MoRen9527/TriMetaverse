# STE·批B③测试隔离性归因与修法主张卷（晨窗）

- sourceOfTruth: 本件（批B③ 归因卷+修法主张；对象=TriMLC 2b1709d 测试门三失败域：P0 auth-gate 向量差/全量并发干扰族/contract-resolver 4×TS2322）
- syncMode: static（归因毕+修法主张候裁；动态复验受事故 collateral 阻，候批A build，见 §五）
- lastSyncedAt: 2026-10-03T01:39:41Z（date 现查）
- 归因席: STE 小柯（m-ste）；令源=COO BOD #300 批B③ 晨窗令（07:57）；BOD #302 A 件起草令（09:3x）知悉，排本卷收口后接，批B③ 不顺延
- 零转抄声明：FSD 卷读数仅作对表（差异如实注记），本卷归因全部独立得出（自跑日志+源码实勘）

## 一、测试判断（总）

三失败域归因毕：**①P0 auth-gate 向量差=测试过期（非实现回归），一行对齐可修**；**②全量并发干扰族=metrics 异步落账一致窗竞态**（非功能缺陷，测试同步断言撞落账滞后；并勘正 FSD 卷的失败文件映射误标）；**③contract-resolver 4×TS2322=既有（结构面确认，精确枚举候 build 后类型门）**。三域修法主张见 §六，均候裁不自改。动态复验（隔离 41 子测全绿断言+全量门复猎）受 agent-core/tricode dist 双缺阻（事故 collateral），候批A build 窗——与维护批④余块②类型门 baseline 同窗同序。

## 二、①a P0 auth-gate 向量差归因：测试过期（非实现回归）

### 定性证据链

1. **断言差实锚**（本席事故前夜全量门日志 /tmp/ste-maint34-fullrun-2b1709d.log，dist 在位轮）：suite 内唯一挂子测=e1，错误原文 **`'trimlc' !== 'trilc'`**（ERR_ASSERTION）——e1 断言 `res.json?.service === 'trilc'`，而 TriMLC healthz 实返 `service: 'trimlc'`（src/server/app.ts L1692）。
2. **血统源**：test/server/auth-gate-rejection.test.ts 头注自述=「树 p0fix3-trilc-http／节点 PD-T／TestEngineer 小柯 fresh 实例（20260827T074800Z）／审计真源 rmc-TriLC.md P0-1（发现 8）／行号为 TriLC HEAD=26720dd 实证」——**08-27 TriLC 时代产物，TriMLC 分叉时继承**，service 钉名未随分叉适配。
3. **实现完好旁证**：41 子测中 40 过（仅 e1 挂）——e2（/healthz?x=1 不豁免→401）/e3-e15（fail-closed/门序/Bearer 兜底/Host/Origin 全向量）全过；门序契约（healthz 精确豁免 L1684 exact-match 先行→Host 门→Origin 门→token 门，L1735 顺序契约注释）与向量对表零漂移。**实现零回归，唯 e1 钉名过期。**

### 对齐方案（候裁）

- **主案**：e1 期望 `'trilc'`→`'trimlc'` 一行修（FSD 车道施工）；随附头注 TriLC 时代行号锚（:1548 等）加一行「TriMLC 分叉适配注，行号为 TriLC 26720dd 历史锚」免后人再误读（非行为面，可选）。
- 验证锚：build 后隔离跑该套件 **41/41 全绿**（现受 dist 缺阻，§五）。

### 读数差异如实注记

FSD 卷该 suite 读「挂 40/41」与本席「41 中挂 1（e1）」形态不同——本席读数以断言差原文为锚；FSD 读数未获原始日志核对（禁转抄不猜），差异不闭候 build 后复跑对表。

## 三、①b 全量并发干扰族归因：routing_error 异步落账一致窗竞态

### 勘正（FSD 卷失败文件映射）

本席夜跑日志 location 实锚：not ok 158/159（FADE-ASSESS-005 派工门禁/可见性回归）**均住 test/server/roster-gating-http.test.ts**（HTTP e2e 文件，自带 mkdtemp+port 0 卫生）；FSD 卷归因映射的 cron-role-gating/agent-tool-roster-gating 系纯函数单测（shouldRunJob/enforceRosterGate，零 OS 资源面），本席轮全过——**映射误标勘正**。

### 根因链（静态+动态双锚）

1. 动态锚：挂子测=「FADE-ASSESS-003 指标」，错误原文 **`routing_error 计数应 ≥3（实际 2）`**（roster-gating-http.test.ts:194）；前置用例已触发 3 次 409 拒绝（candidate×2+unknown×1+pending-cho×1=4 次埋点、断言 ≥3）。
2. 静态锚：409 处理器（app.ts L3409-3418）`recordKnowledgeMetric({...})` **无 await**（fire-and-forget），紧接同步 `res.writeHead(409)+res.end()`；metrics GET（L2424-2429）走 `getKnowledgeMetricSnapshot(env.projectRoot)` 直读存储快照。
3. 定性：**409 门禁本身同步正确（功能零缺陷）**；埋点落账异步，测试在无轮询下同步断言读数——落账未及落盘时读到滞后计数。全量门并发（多文件子进程并行）CPU 争用拉大落账滞后窗 → 轮间随机挂；隔离跑落账先于断言 → 全绿。**一致窗竞态（eventual consistency），非资源冲突非功能缺陷。**

### 修法主张（候裁）

- **主案（测试侧，零产码动）**：该子测 metrics GET 改有界轮询——≤10 次×250ms 重试至 routing_error≥3，终值断言（终值仍 <3 才翻红）。保留语义锚强度，承认 eventual consistency。
- 备案（产码侧，候 CTO 单独裁）：409 拒绝路径 `await recordKnowledgeMetric(...)` 后再响应——读数即时可见，但产码 4+ 调用点（app.ts L1409/1542/3412+timer.ts L240+agent-tool.ts L94 族）行为面联动，拒绝路径增落账延迟，非本席可拍板。
- 否决案：放宽断言 ≥3→≥2——弱化 FADE-ASSESS-003 语义锚，不采。

### 未复现残余（如实报）

FSD 轮 roster-gating.test.ts+tools-ctx-cwd.test.ts（not ok 181/182）本席轮未复现（我轮全过）。假说级归因=负载敏感族（ctx-cwd 经 agent-core createProcessSupervisor 走 shell spawn 型，并发争用下进程创建延迟；roster-gating 纯 fs 型或同族），**未证**，不落修法主张；候 build 后全量门复猎（≥2 轮）取证后再议。

## 四、①c contract-resolver 4×TS2322 baseline：结构面确认

- **既有定性成立（结构面）**：文件末触=**16f56b7（LG-035 TriCode 共用包切包）**，先于维护批④/批B①②/FSD P2-P3 全部在途施工——批B①②（TriRLC/TriMLC cli.ts 状态码修+L361/L380 真因化）与本文件零接触面，FSD「既有」主张与 git 史一致。
- **报错位定性**：4×TS2322 全落 L173-178=loadOne 内六行 paths 适配块（`AgentContractV3.paths`→`Required<AgentContract['paths']>`）——agent-core v3 schema 类型与本地合同类型的边界适配位，类型摩擦合理位。
- **精确枚举候补**：现 tsc 被 TS2307（agent-core dist 缺）盖面，4/6 行枚举须 dist 重建后类型门出——**并入维护批④余块②（类型门 baseline）同窗同序**，本席候批A build 毕报后跑。

## 五、动态复验受阻注记（事故 collateral，候批A build）

- 本窗隔离跑 auth-gate 套件现**整文件 crash**（ERR_MODULE_NOT_FOUND `@tricompany/agent-core/dist/index.js`，tests 1/fail 1）——与事故前夜「套件可跑、e1 挂」形态不同，根因=事故中 agent-core dist 删（gitignored build 产物，checkout 不恢复）。
- **追加实锚：`@trimetaverse/tricode` dist 同缺**（node_modules 链接目标 TriCode 仓 main=dist/index.js，现仓 dist 无；recordKnowledgeMetric/injectKnowledgeContext 等均经此链）——app.ts 运行时导入面双断，批A build 范围=agent-core+**TriCode**+TriModel 三 dist（与 CTO P1 卷「TriCode+agent-core build 补 dist 与 TriModel build 同窗」口径一致，本席实锚补位）。
- 受阻影响：P0 41/41 断言、全量门复猎、类型门三面全部候 build；**本席不越权自建**（批A=FSD 主刀）。

## 六、修法主张汇总（候裁表）

| # | 对象 | 主案 | 备案/否决 | 施工车道 | 验证锚 |
| --- | --- | --- | --- | --- | --- |
| 1 | P0 e1 过期钉名 | `'trilc'`→`'trimlc'` 一行修+头注历史锚注 | 无 | FSD | build 后隔离跑 41/41 |
| 2 | routing_error 竞态 | 测试侧有界轮询（≤10×250ms） | 备案=产码 await（4+ 位联动候裁）；否决=放宽 ≥3 | FSD | 全量门 ≥2 轮该 suite 零挂 |
| 3 | 负载敏感残余（ctx-cwd/roster-gating） | 候 build 后复猎取证，暂无修法主张 | — | STE 复猎 | 全量门 ≥2 轮 |
| 4 | 复验清单提案 | build 毕报后：①auth-gate 隔离 41/41 ②全量门×2 轮（roster/FADE 域专盯）③类型门（=维护批④余块②） | — | STE | 毕报回 COO |

## 七、纪律遵守

- 围栏：零 build 零重启零 3333 触零 TriModel 仓写面 ✓（测试跑=只读+tmp 沙箱；本卷纯文本+自席树落盘）。
- 零转抄 ✓（FSD 读数仅对表注差异，全部归因独立复得）；值面零出机 ✓（本卷无涉）。
- 候裁纪律 ✓：三域修法均主张形，未自行改码；P0 对齐与竞态修施工面归 FSD 车道，本席候复验。

## 八、使用依据

- COO BOD #300 批B③ 晨窗令（07:57）+BOD #302 A 件令（09:3x，排后知悉）
- 实锚：/tmp/ste-maint34-fullrun-2b1709d.log（事故前夜全量门，本席自跑）/tmp/ste-b3-authgate-isolated.log（本窗隔离 crash 取证）；TriMLC src/server/app.ts L1684/1692/1735/2424-2429/3409-3418、L60-75 导入面；test/server/auth-gate-rejection.test.ts 全文（头注血统+41 向量）；test/server/roster-gating-http.test.ts 全文；test/cron-role-gating.test.ts+test/agent-tool-roster-gating.test.ts 头段（纯单测定性）；test/tools-ctx-cwd.test.ts 头段（spawn 型）；src/config/contract-resolver.ts L140-210+git log（16f56b7 末触）；node_modules/@trimetaverse/tricode/package.json（main=dist 现缺）
- FSD 卷对表：fsd-maint34-completion-readout-20261003.md §二/§三.3（读数差异如实注记，未转抄）
- 关联：维护批④验证卷 ste-maint34-verification-readout.md（事故专节+复验余块序）
