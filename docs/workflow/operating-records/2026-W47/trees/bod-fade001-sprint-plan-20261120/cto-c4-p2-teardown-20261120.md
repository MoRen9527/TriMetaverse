# CTO C4 拆树令（P2 收敛批·件清单定谳+单仓试收敛选点+契约基准·WO-C4D3 §三请托承领）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-c4-p2-teardown-20261120.md·C4 拆树令正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: COO 统排件 WO-C4D3-UNIFIED-20261120（239d915e8）§三请托承领——C4 P2「配套/infra」件清单定谳+单仓试收敛选点+契约基准（技术范围裁决=CTO 域·统排件明定 COO 不代裁）
- 分批形强制条款承录: cto-agentcore-convergence-eval §四（P1→P2→P3·每批=单仓试收敛→回归绿→他仓迁移·零并批硬塞）

## §〇 · 拆树总形（一令三定谳+一裁量附笔）

| 定谳面 | 裁决 |
|---|---|
| P2 件清单 | **批 2a=loop 配套族 8 件（MMC/RMC 双仓）**；infra 族**降档出批**（候专门勘面卷·§二裁决） |
| 单仓试收敛选点 | **TriMMC（sg 侧）先行**——P1 先例同构（kit bare 仓+消费链+值席通道三现役熟面）；TriRMC（河源）=批 2a 第二段迁移位 |
| 契约基准 | §四（STE 契约先行输入·分档判据+契约测试形+回归绿判据） |
| 附笔（COO 请托③裁量） | fade.db=**归档形定谳**（零删除·§六） |

## §一 · 批 2a 件清单定谳（8 件·MMC/RMC 双仓双名单实锚）

loop 配套族八件（eval §三「MMC/RMC 共名·diff 候勘」荐面承入）：

| # | 件 | sg MMC 现位实锚（本席 18:5x 现探） | RMC 侧 |
|---|---|---|---|
| 1 | context-builder | src/context-builder/ 1 file（2b915f7a） | eval heyuan 共名实锚（昨晚）·件级 diff=STE 工序取 |
| 2 | prompt-cache | src/prompt-cache/ 2 files（8722a608） | 同上 |
| 3 | policy-gate | src/policy-gate/ 1 file（4355431c） | 同上 |
| 4 | tool-gater | src/tool-gater/ 1 file（09b424ec） | 同上 |
| 5 | task-controller | src/task-controller/ 1 file（f5636fd6） | 同上 |
| 6 | soul-loader | src/soul-loader/ 1 file（7650f14a） | 同上 |
| 7 | memory-injector | src/memory-injector/ 1 file（ff7c252a） | 同上 |
| 8 | pipeline | src/pipeline/ 1 file（e85ded41） | 同上 |

**勘面如实注（RMC 侧）**：本席河源直连两形均凭据面缺口（`ssh sg` 别名本 Bash 环境不可解析+显式跳板 fleet@8.155.54.79 publickey 拒）——**两试即停零硬闯**（R-HY 高频连触限 IP 风险+零二次硬试纪律）——RMC 侧件级读数归 STE 契约先行工序经 sg 值席通道取（`ssh -J M-SG R-HY` 现役形·树卷先例），零阻塞拆树定谳（件清单面=eval 卷昨晚 heyuan 现探 24 模块共名实锚+本表 sg 侧今勘双锚已足）。

**包形裁决**：批 2a 收敛位=**orchestration-kit 扩容形（kit v2·exports 追加）**——理由三：①语义同族（loop 配套件=agent 编排中间件·与编排九件同一消费面）；②kit 基建现役复用（sg bare 仓+build 链+TriMMC 消费链全熟·零新包基建成本）；③回滚锚=kit 仓内批 2a 独立 commit 段（revert 形·独立回滚原则不破——版本化随 kit tag 承载）。**零强扭进 agent-core 维持**（两包形边界不动）。

## §二 · infra 族降档裁决（出批·候专门勘面卷）

**裁决：cron/heartbeat/mirror/notify/observability 五件域不进批 2a**——降档=P3 前置勘件（候批 2a 毕+专门勘面卷逐件裁定）。理由四：

1. **判据②不全过**：eval §四判据②「agent 域语义（非宿主传输面）」——infra 五件=daemon 运维/传输面非 agent 语义，判据面先天存疑；
2. **daemon 耦合候选高**：eval §三同表已列「daemon 专有=不收敛（宿主面非共性）」——cron job 配置/heartbeat 生命周期钩子=各 daemon 宿主面异构候选（四仓各持形态本身=耦合面证据）；
3. **放量控制**：批 2a+infra 并批=契约勘面×（8 件双仓→13 件四仓）约 3 倍——违反统排件 §五「零重叠放量控制」+GLM 75% 止损线约束；
4. **分批形哲学**：小步验证——单批先收零混批（每批=单仓试收敛→回归绿→他仓迁移·infra 混入=批内双形态破「单仓试」纯度）。

infra 逐件过判据四条裁定位=专门勘面卷（候排·非本令范围）。

## §三 · 单仓试收敛选点与批次结构

```
批 2a 段一（今晚~明晨窗）: TriMMC（sg）试收敛
  = kit 扩容施工（8 件入 kit·exports 追加）→ TriMMC import 切换 → 全测试套件回归绿 → 活体零退化探
批 2a 段二（段一绿后·候窗）: TriRMC（河源）迁移
  = kit 侧消费（河源 kit 取件形候值席窗勘）→ RMC import 切换 → RMC 回归绿 → 活体零退化探
批 2a 毕 = C4 收口 → C5（P3 local 族）解冻
```

**选点理由（MMC 先行）**：P1 全链先例同构——sg bare 仓现役+TriMMC 消费链现役（20 exports 已绿·C3 APPROVE）+sg 值席通道现役+kit dist 勘修链现役——四熟面复用零新通道。RMC 侧河源通道形=值席面（本席直连缺口如实注 §一）。

## §四 · 契约基准（STE 契约先行输入·P1 九件套件形同构）

1. **契约勘面工序（STE 首步）**：8 件逐件 MMC/RMC 双侧对比——RMC 侧读数经 sg 值席通道取；
2. **分档判据（每件三档）**：
   - **A 档=双侧全等**（md5 等或语义等价）：直接收敛入 kit；
   - **B 档=漂移可对齐**：MMC 形为收敛基（sg 侧现役绿面）·RMC 差异面清单+对齐方案随契约卷呈本席裁定后收敛；
   - **C 档=实质异构**（语义分叉不可对齐或 daemon 耦合实证）：**剔出批 2a**·如实报（不硬塞——分批形哲学）；
3. **契约测试形**：每件 exports 契约快照+行为冒烟（ste-contract-test-suite-nine 先例同构·八件形）；
4. **回归绿判据（批 2a 段一过门硬项）**：kit build 绿+kit 全测试绿+TriMMC 全测试套件绿+TriMMC 活体面探（healthz/cron 面）零退化+TS2307 族零新增；
5. **消费面纪律**：kit v2 exports 追加零破现役 20 exports 消费面（追加形非改形——现役契约快照锁形）。

## §五 · 门禁与窗位

- **本令=技术范围定谳面**——施工时点=COO 统排域（统排件 §三.3：STE 契约先行今晚可启·迁移施工候明晨窗 CFO 切换实锚起算·零硬塞零抢跑）；
- **回滚锚**：kit 仓批 2a 独立 commit 段（git revert 形）+TriMMC dist bak 锚（root 窗形先例·dist-bak-pre-<batch>-时戳）+unit 回旧 dist 三形齐；
- **红即停**：契约勘面 C 档超半（8 件中 >4 件实质异构）=批 2a 范围重裁请回本席（零硬收）；
- **D-46 值面**：契约卷零 token/secret 嵌面（md5/exports 签名面=非值面可录）。

## §六 · fade.db 定谳附笔（COO 请托③·本席裁量）

**归档形**（零删除）——sg 窗顺手件并入残面①⑤同窗形（值席执行）：

```bash
mv /srv/fleet/TriMMC/<fade.db 现位>/fade.db <同位>/fade.db.archived-pre-c1-20261120 && ls -la <同位>/fade.db*
```

- 依据：旧 node:sqlite store 代运行数据（Nov 6 40KB）·新 store（better-sqlite3）读写面独立实证（窗 C 探⑤ tmpdir）·现役零消费引用——清险已闭；40KB 归档零成本，留审计回溯面（删除候选窗=归档毕 30 天无回溯需求后·挂账不排）；
- 注：fade.db 精确路径=值席窗现探定（窗 C 读数卷承 Nov 6 40KB·路径面值席面取·本令不估读）。

## §七 · 护栏承录

触面限定（本令=定谳文档面·零活体触）/逐字镜像族不适用（零 root 面）/止损线（§五红即停+C 档超半重裁门）/D-46/D-47 照役/本席零代派（STE 契约先行派工=COO 统排链转·本令毕报经 m-coo）。

## §八 · 使用依据

COO 统排件 WO-C4D3-UNIFIED-20261120（239d915e8·§三请托+§五预算护栏+§七分工对表）+cto-agentcore-convergence-eval（§三共名矩阵+§四判据四条+分批形强制+两包形荐）+sg TriMMC 8 件现位勘面（本席 18:5x 现探·md5 聚合面在卷）+eval 卷 heyuan RMC 共名实锚（昨晚现探）+kit 现役绿面（C3 APPROVE 807514ac5+TriMMC 20 exports 消费链·窗 C 收口卷 8b91fde08）+STE 九件契约套件先例（ste-contract-test-suite-nine-20261120）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T10:52:36Z（+8=2026-11-20 18:52:36·date 现查原值·D-47 正形）
