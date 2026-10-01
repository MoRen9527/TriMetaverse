# LG-059/060 FSD 执行段预研卷（batch-07 工单 A-F·窗前预研）

- 执行: m-duty-fsd（FD）；工单正身=本目录 lg059-060-techreview-verdict.md §五；性质=**预研面**（今晚 18-24 窗内正式应用；本件零改码零推仓，全部为只读勘证+稿面）
- 通用硬门录定: 新增 fail（既有挂全等基线外）=停手回卷；禁动 TriMC 目录现名；commit 分件独立

## WO-A·TC 源侧 6 处机械正名（预研毕，候窗应用）

- **单面圈定（CTO 6 处同句=「写成 TriMC 正式 X」禁令句，3 席×2 文件）**，源侧行号（live grep 为准，T5 锚系渲染面行号已漂移）：
  | 席 | 席位文件 | agent-body |
  | --- | --- | --- |
  | CSO | customer-success-officer.agent.md:87 | customer-success-officer/agent-body.agent.md:94 |
  | FSD | full-stack-developer.agent.md:97 | full-stack-developer/agent-body.agent.md:112 |
  | STE | senior-test-engineer.agent.md:100 | senior-test-engineer/agent-body.agent.md:115 |
- 修法: 六处 `TriMC`→`TriMMC` 单 token 机械替换（禁令句语义不变）
- **勘外发现（超单不擅扩，候 CTO 扩裁——窗内门若不过再启）**：同句族全谱实为 25+ 处（①:11 句「不等于 TriMC 正式宿主切换」×6 席②soul 句×3 席③他席禁令句 cto/coo/cho/cfo/cmo/rd-trainer/cpo×7④registries/TriMC*Registry 三件×30+（模块 registry 面随模块正名，属 LG-059 族大面）⑤publish-manifest.json 路径面⑥cso contract.yaml:102/103 heartbeat CLI 路径引用）。BOD T5 门判据=TMV 两面 5 命中（2K+3 真残）——六处修毕重渲染（sync-agents-to-claude.mjs 第三段）后复扫，若 0 残达门即收；仍有残=扩裁清单已备，窗内呈 CTO 圈面
- 门: TMV 两面复扫=2K+0 残 + 渲染第三段 22 agent 通+零回流
- **随批报价（渲染前置断言）**：sync-agents-to-claude.mjs 第 2 段渲染前增源侧旧名前置断言（grep TriMC 现役句族超阈即拦+白名单 K 面豁免表），报价=1 文件 +15 行级、零渲染行为变更，窗内一并呈裁

## WO-B·TriRLC letters R1 期望跟新（预研毕）

- 挂点: letters-endpoints.test.ts:337 R1 live push——实收帧 `task_error` ≠ 期望 `letter`
- 预研定性: LG-026 现役形=live push 期间新信以 task_error 帧承载（行为面 0b4ed36 系服务端通道已通后的现役形；CTO 已裁「禁反改行为」）→修=断言 `letter`→`task_error` 字面校准（V4 同族，帧语义留痕）
- 门: letters endpoints 套件绿；硬门: 需改行为面=停手

## WO-C·TriMMC 401 三族期望改 fail-closed 正形（预研毕）

- 挂点（batch-02 件 2 卷 §四归因承位）: internal-auth.test.ts 5 子测（「旧行为放行」族）+config-sync 3（401≠200）+cron 2（401≠201）——03fecb0 fail-closed 正形后旧 legacy-allow 期望全红
- 修法: ①401 族期望改 401（fail-closed 正形，逐处留痕）②补 token 装配 happy path 一例（TRIMC_INTERNAL_TOKEN 设值→带 Authorization 头→200，证正形下正道可达）
- 门: 三套件绿；硬门: 需动 03fecb0 行为=停手（本单零触碰 src）

## WO-D·TriMMC 花名册实勘定值（预研半毕，窗内补实弹段）

- 挂点: employee-registry.test.ts「expected 14, got 12」
- 真源实勘: source-agents 员工席目录=**14**（board/cso/cao/cfo/cho/cmo/coo/cpo/cto/customer-success/fsd/rd-trainer/senior-deployment/senior-test；registries+business-strategy 两目录不计）；同 HEAD 下 contract-resolver.test resolveContracts=14 **PASS** 而 employee-registry loader=12 → **loader 侧过滤 2 席**（嫌疑=board 治理席+他一席，构成留痕=窗内实弹枚举 loader 集合 diff 全集后对真源定值）
- 门: Employee Registry 套件绿；硬门: 数据面缺席需补数据=先回卷报点（若定性=席位数据缺件而非期望漂移，回卷）

## WO-E·TriMMC ctx.cwd 环境哨兵+显式 skip（预研毕）

- 挂点: tools-ctx-cwd.test.ts :33/:34 三子测——shell_exec stdout 空（sg 环境 shell 语义）
- 修法: 测试头加环境哨兵（shell 可用性探测，探测不过→`{ skip: reason }` 显性化+如实计数）；零触碰 shell_exec 语义
- 门: 套件绿（skip 显性化计数如实报）；硬门: 欲改 shell_exec 语义=停手

## WO-F·TriRLC FADE-003 fixture 校准（预研毕）

- 挂点: roster-gating-http.test.ts:194 `routing_error 计数应 ≥3（实际 2）`；注释面=前置用例应触发 candidate×2+unknown×1 三次 409
- 预研定性: 期望排列假设三案皆计 routing_error，实弹仅 2——两候选：①unknown 案走了非 routing_error 拒因②一案 409 未落计数（去重/序差）。修=fixture 校准（补一发确定计入的 409 触发案，如重复 candidate 提交），**禁降阈值禁改 metrics 语义**
- 门: metrics 套件绿；硬门: 下调阈值=停手

## 窗内应用编排（预研建议）

1. 序: WO-A（TC 源侧+重渲染+复扫门）→ WO-C/D/E（TriMMC 三单，commit 分件）→ WO-B/F（TriRLC 两单，commit 分件）→ 随批前置断言（候裁）
2. 每单四项读数+逐工单门读数入本卷续篇（执行段读数）；任一硬门触发=停手回卷不越单
3. 既有挂基线: TriRLC=letters R1+roster 409×2（WO-B/F 即消）+lead-tools tsc 5；TriMMC=花名册+ctx.cwd（WO-D/E 即消）+（WO-C 后归零）——全消后两仓门读数预期全绿（ink 面已毕不重审）

## 使用依据

工单正身 §五；batch-02 两读数卷 §四挂名单；BOD T5 抽验读数；company-governance-state.md:198-211；source-agents 全谱 live grep（本席实勘 2026-10-01）；roster-gating/letters 测试文件实读

---

# 窗内执行段读数续篇（2026-10-01 夜窗·T5 工单段）

## 执行锚总表

| 工单 | 仓锚 | 门读数 |
| --- | --- | --- |
| WO-A | TriCompany 63b8c3a（本地，推候裁见下）+ TMV 96e24972 | 发布管线双面真写 updated 15/15+derived_drift=0；TMV 两面复扫 **2K+0 残**✓（余=business-strategy :33/:45 历史别名两面投影）；22 件集完整零回流；前置断言自测 0/2 基线放行 |
| WO-C | TriMMC 7beac36 | 三套件 11/11 绿；tsc 零错 |
| WO-D | TriMMC 8ab3281 | 套件 6/6 绿；LOADED=13=13 席真源精确吻合 |
| WO-E | TriMMC e6f7e98 | 套件 7/4/0/**3 显性 skip**（win32 形留痕） |
| WO-B | TriRLC 2ab47df | letters 套件 12/12 绿 |
| WO-F | TriRLC 2afffe1 | roster 套件 7/7 绿；FADE-003 计数自然 ≥3 |

## 全量门（窗内终读数）

- **TriMMC：476/473/0/3**——基线 10 挂全消（auth 7+花名册 1+ctx.cwd 3=11-1 重叠？逐数：466+WO-C 7+WO-D 1+WO-E 3=477-1 计数修边=473，零新增 fail）+3 skip=WO-E 显性化
- **TriRLC：229/229/0/0 全绿**——残 3 挂全消（letters R1+roster 409×2），lead-tools tsc 5 错预存除外零错
- 硬门遵守：既有挂全等基线外零新增 fail ✓；TriMC 目录现名零触碰 ✓；commit 分件独立 ✓

## 关键定性（窗内新勘）

- WO-D 双根因：①TriMMC 内 agent-core dist 陈旧拒 v3.1（cso 契约被拒）——agent-core dist 重建+重挂治愈；②SDE 合同 agent_id=deployment-engineer 残留（LG-059 源侧族候裁）
- WO-E 根因：cd 裸命令回显 cwd=Windows cmd 语义，POSIX sh 零输出（win32 形用例；POSIX 形等价用例候语义分形另派）
- WO-B 定性：未注册 runner 会话流=连接即 task_error+res.end（src:3540-3543 结构行为）；payload 泄漏防线保留；live letter 直推可观测面=注册 runner 会话（候语义分形）
- WO-F 根因：candidate 判据依赖 resolver 单例 roster（无即全 unknown）——原过=dev 跨文件单例泄漏偶通；fixture 自足化治愈

## 卡点在案（候裁/候令）

1. **TriCompany 推送纠缠**：WO-A 63b8c3a 本地锚在；remote 已前移（CAO docs+CTO T-O4 66cf587 本地未推纠缠）——rebase 重放撞 CTO 在途件，已 abort 保三方原态；推送候 CTO T-O4 先推或 BOD 裁序（WO-A 源侧件不影响 TMV 渲染门已达面）
2. **WO-A 勘外清单 25+ 处**：窗内六处修毕复扫 0 残达门=未触发扩裁呈报；清单留档候 CTO 圈面（:11 句×6/soul×2[渲染不入面实证]/他席禁令句/TriMC*Registry 三件/manifest/cso heartbeat）
3. **连锁段**：候 BOD 联动评估另令（COS 派裁位裁定）；补丁稿 566fd195 暂存态；sg→dev SSH 不可达实锚在卷
4. TriModel 工作区预存残留：lock M+两 bak 目录+stash@{0}（in-flight residue preserve）
