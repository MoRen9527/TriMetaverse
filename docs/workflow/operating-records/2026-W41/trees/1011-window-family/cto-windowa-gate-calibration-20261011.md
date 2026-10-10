# 栏 A · DEM-003 资格门 段1 脚手架+段2 干跑校准判读卷（CTO·2026-10-11 晨窗）

- sourceOfTruth: 本卷（trees/1011-window-family/cto-windowa-gate-calibration-20261011.md）
- syncMode: static（窗内判读卷·毕报回点 COO+BOD）
- lastSyncedAt: 2026-10-11T03:26:55+08:00（date 现查原值·UTC 19:26:55Z）
- 执行席: CTO 小狄（m-cto 直做）；窗框 03:30-08:00（BOD 03:18 窗令变更·CEO 03:16 令）
- 方案正身: cto-window-a-gate-three-checks-plan-20261010.md（同树目录）；门禁终裁卷=cto-windowb-gate-verdict-20261010.md

## 一、段1 脚手架毕：`scripts/fade/eligibility-gate.mjs`（v1.1）

- 三查正身照方案稿 §一：
  - 查一 结构 schema：头部三件套（sourceOfTruth/syncMode/lastSyncedAt）+owner 起始位+准入标记 AUTOMATION-READY+节点六要素齐（执行者/输入/动作/输出/完成判据/失败行为）+树尾 COS 收口段。
  - 查二 自含 resolve：输入料指针逐条 resolve（路径实存+@hash 可解）·零悬空。
  - 查三 锚机读化：完成判据=断言形（断言词族命中）+失败行为含 停/报/回滚+节点段内零待裁词；全文级待裁词=WARN 人工复核（历史叙述段合法）。
- 红线落码：**零写面**（只读扫树·输出仅 stdout 或显式 `--out`）·零网络·token/值面零接触。
- 姿态落码：readiness 输出=**建议值**（机先判人后签·COS 签挂为准）；FAIL=影子期只读数不拦截。

### 判据边界修正两条（段1 内自证暴露·非迁就测试）

1. fixture 好树输入行引合成假路径被查二判悬空→改指真实实存文件——fixture 必须自含真实依赖。
2. **sourceOfTruth 行=自指声明非输入依赖；`输出:` 行=待产物**（产出后才有）——两行豁免提取；「零悬空依赖」语义域=输入料指针。修后双向验证 PASS，系判据域正确修正。

### v1.1 解析路由（段2 校准增量·本窗）

- R1 直解析：绝对路径/仓根相对。
- R2 周平面短形：`trees/...` 系周平面 cwd 惯例指针（差 `docs/workflow/operating-records/<week>/` 前缀）→全周扫描解析。
- R3 兄弟仓根尝试：`src|test|docs|scripts/` 开头失败路径→遍历兄弟仓根（TriRLC/TriMLC/TriModel/TriCode/TriPilot/TriCompany/TriRMC/TriMMC·dev 机 D:/Code/ai/ 布局·机位断言 D-24）。
- 判据不放松：「必须 resolve 到实存」不变，只扩解析面——真悬空仍 FAIL。

## 二、段2 干跑校准读数（5 件现役树·影子期只读判读）

| 树件 | c1 schema | c2 resolve | c3 anchor |
| --- | --- | --- | --- |
| 1011-window-family/coo-window-family-order-20261011.md | FAIL（预期） | **PASS** | FAIL（预期） |
| s3-channel-maintenance-wave/sde-s3-window-readout-20261010.md | FAIL（预期） | **PASS** | FAIL（预期） |
| stopwork-drill-20261009/coo-schedule-adjust-and-drill-chain-plan-20261009.md | FAIL（预期） | FAIL→**PASS**（v1.1 修正后） | FAIL（预期） |
| window-order-20261007/unified-window-order-20261008.md | FAIL（预期） | FAIL→**PASS**（v1.1 修正后） | FAIL（预期） |
| window-order-20261007/window-order-20261007.md | FAIL（预期） | FAIL→**PASS**（v1.1 修正后） | FAIL（预期） |

- **判读方向校验：零反向误报**（无一现役树被误判 PASS——FAIL 全部落在「模板 v1 要件未推广」的预期形态差上）。
- v1 首轮 c2 假悬空 4 条全列（SDE 毕报）：`src/cron/store.ts`/`test/cron-addjob-nextrun.test.ts`/`src/server/app.ts`（跨仓指针·TriRLC 仓内路径被按 TriMetaverse 仓根解析）+`trees/s3-channel-maintenance-wave/cto-s3-technical-closeout-20261010.md`（周平面短形·该卷实存在 W41 树）——四条均系解析路由缺口**非真悬空**，v1.1 三路由全解。
- c1/c3 FAIL 归因：现役树头部三件套基座在跑但 owner 行/准入标记/节点段=模板 v1 新增要件，模板未推广前属预期形态差——非判据错，恰为模板推广价值的实证。

## 三、自验读数（BOD 令「自验读数落卷」）

- `node scripts/fade/eligibility-gate.mjs --selftest` → **PASS（好树全 PASS+坏树复现 FAIL=双向验证过）**。
- 好树 fixture：六要素齐+AUTOMATION-READY+收口段+输入指真实实存文件→c1/c2/c3 全 PASS。
- 坏树 fixture：缺 sourceOfTruth/lastSyncedAt/owner/准入标记/收口段+悬空指针+叙述型判据「看起来正常即可」+失败行为「随机应变（候 CEO 裁）」→11 条 FAIL 证据逐条合理（含零待裁红线命中「候 CEO」）。
- 机器可判定性：三查输出=结构化 JSON（checks 三段 pass/evidence/fail）·判读全程零人工解释介入——BOD 门条件「三查对影子件试判机器可判定」达成。

## 四、段3 剩余（本窗内续做）

1. 影子期接线：readiness 写入规范一页+影子期选件判读流程（机先判人后签·COS 签挂）。
2. 脚手架+校准成果 commit 推平（写后即 commit 锁笔）。
3. 毕报→COO+BOD（DEM-003 七锚+N=5 首锚进度随报）。

## 五、勘注（COO 03:23 窗位勘正连带件①）

- 本席门禁终裁卷 §二认项「时序收敛窗 22:46-22:58」**随原夜窗作废**：晨窗 08:30-11:00 无硬红线拍，收敛约束降级常规绕拍（正身勘正块 @2202cbf2）。施工序列与增量锚本体不变；job② POST<09:30 与硬锚 11:00 两点维持。
- 栏 B 毕报链照旧（CTO 收 FSD 毕报→COO→窗收口 BOD）；21:00 绩效跑=栏 B 重启后首验点（next_run_at 验证门覆盖）。

——CTO 小狄，段1+段2 判读毕。毕报随段3 续出。
