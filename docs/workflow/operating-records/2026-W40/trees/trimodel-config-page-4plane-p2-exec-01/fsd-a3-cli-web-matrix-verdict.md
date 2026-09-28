# FSD·A3 CLI/网页能力矩阵终对表（施工中·候件态如实）

- sourceOfTruth: 本件（FSD A3 施工卷；基座=CTO §5.2 底表 cto-implementation-plan.md @76d58282 + CPO 基线 cpo-cto-plan-reconcile.md 8/10+三裁 + STE C1 判据）
- syncMode: working
- lastSyncedAt: 2026-09-28T21:35Z（date 现查=2026-09-29 05:35 +0800）
- 施工席: FSD 小全（m-fsd）；判据=每格「CLI 有/网页有/差异标注」三值如实，差异面显式标注归档（STE C1）
- 候件态声明: 本件=施工中卷。本地 live 格已实测（时点+读数留痕）；sg/河源 live 格+部署窗格=候工时窗/部署窗，**候件不虚验**（STE §三）

## 一、活体缺陷候裁 F-1（A3 首笔实测产出，候 CTO 裁定）

**TriMLC CLI `DEFAULT_PORT=8711` 镜像继承缺陷——trimlc config 族默认打 TriRLC daemon。**

- 实证链：①TriMLC src/cli.ts L22 `DEFAULT_PORT = 8711`（与 TriRLC cli.ts L22 同值同文，N4 镜像注释在案）②活体：`trimlc config show` 与 `trirlc config show` 输出**逐字全同**（face=rlc，同 cache 时戳 2026-09-28T21:50:23Z）——8711=TriRLC daemon（面定谳 8713=TriMLC/8711=TriRLC，CEO 2026-09-17 面授口径）③daemon 本体面布线**正确**：本地 TriModel face-ledger 实读 mlc face 在拉 ok（last_pull 2026-09-28T22:20:21Z loopback）——错指仅在 CLI 入口层。
- 危害面：`trimlc config pull`（触发 TriRLC 的拉取）/`trimlc stop|restart`（误停 TriRLC daemon）默认 port 全错指；与 09-18 pidfile 误杀 8711 事故族同根（镜像继承未随部署位分叉）。
- 候裁归属：CTO（CLI 默认端口=部署拓扑语义；候修方向=TriMLC DEFAULT_PORT→8713，与 registerPid 常规窗批件同仓可并批勘定）。
- 本席不擅修：待裁后随批实施。

## 二、逐格对表（§5.2 底表 6 行×三端）

判值口径：✅=有+活体验；🟡=有（纸面/码锚验，live 候窗）；❌=无/差异（显式标注）；⏳=候件不虚验

### R1 查看现效配置+来源归因

| 端 | 判 | 锚/读数 |
| --- | --- | --- |
| 网页 | 🟡 | P2 UI @995c2f7：panel-card-<f> cf-cfg 现役配置区+cf-badge 三态+cf-pull 拉取状态行（ledger.last_pull_at/from/result）；live 点验候部署窗/本地 boot（工时窗） |
| API | 🟡 | GET /v1/config/cards/<face>?view=managed @3e6ab37（jsdom 族 7/7+全量绿；真 HTTP 链路案=A4 R3 候窗） |
| CLI | ✅(rlc)/⏳(mlc·mmc·rmc) | rlc bin 实测 PASS：`trirlc config show`→face=rlc、effective GLM-5.3、source=tier2-cache-fresh（归因读数在outputs）、cache fresh+expires+refresh=900s、last fetch 时戳齐（实测 2026-09-29 05:2x+0800）。mlc bin=F-1 错指（读数无效不作数，候裁后重测）；mmc/rmc bin 候 sg/河源 live（SSH 只读 show，工时窗） |
| 覆盖列「4/4」 | ❌→候 | F-1 致 mlc bin 现不能计入；裁定+重测后 4/4 复核 |

### R2 修改条目/模型集/规则/策略（卡面写）

| 端 | 判 | 锚/读数 |
| --- | --- | --- |
| 网页 | 🟡 | 底表「卡编辑（S4 只写待应用）」：P2 UI 四卡面=诚实三态呈现+模板/备份槽位（rlc/mmc/rmc=tpl/bak 槽 scaffold）；**差异标注 D-1**：卡编辑表单（PUT cards/{face} 写面 UI）P2 骨架期=槽位在位、编辑表单未布满——候 CPO IA 对表确认骨架期口径（呈现优先 IA §4 一致面八项之③④⑤槽位语义） |
| API | 🟡 | PUT cards/{face} @8de8fe7（P0 在役：merge 语义+400 人话拒 P1 范围6①） |
| CLI | ✅(差异①终核) | **CLI 无卡写命令=设计既定非缺陷**（CTO §5.2 差异①+CPO 采认「卡写不开 CLI」两写面分列）；四 bin 实装面 grep 终核：config 族=pull/show/cache/verify 零写子命令（TriMLC cli.ts L797-838/TriRLC L798-839/TriMMC L470-514/TriRMC L478-522 实勘）——差异①**闭合** |
| 覆盖列「网页 4 卡」 | 🟡 | 卡编辑 UI 布满度候 D-1 对表 |

### R3 应用+结果回写

| 端 | 判 | 锚/读数 |
| --- | --- | --- |
| 网页 | 🟡 | 底表「应用按钮+徽章」：徽章 ✅（cf-badge 三态+CPO 徽章双字段之①服务端卡状态）；**差异标注 D-2**：四卡「应用按钮」（apply+PUT status）P2 骨架=未布（应用面随卡编辑 D-1 同族候对表）；策略卡 apply 按钮=既有在役（LG-035 走查冻结面，呈现词按 CPO §五.2 口径候 P2 策略卡页重构窗） |
| API | 🟡 | apply+PUT status 状态机 @P0（tri-state+write-back 机单测绿；sg 活体 status 写回实证=切后实照 status.at 心跳） |
| CLI | ✅语义 | 底表「`config pull`（拉取即生效语义）」=CPO §三双通道之「拉取生效」通道（非网页 apply 通道）——分名分显闭合；rlc bin pull 实测候工时窗（pull=状态变更面，夜窗不触生产写面自律） |
| 覆盖列「4/4」 | 🟡 | 命令族四 bin 实装 grep 全同构（镜像族）；live 候窗 |

### R4 手动拉取/生效

| 端 | 判 | 锚/读数 |
| --- | --- | --- |
| 网页 | 🟡 | 底表「刷新按钮」：P2 UI refreshAll 含四卡 managed 重拉（读刷新）；**差异标注 D-3**：底表语义=view=pull（服务端拉取）vs P2 UI 刷新=managed 读——「网页手动触发服务端 pull」按钮未布（与 D-2 同族，候对表定口径：网页是否需开 pull 触发或保持「拉取=daemon/CLI 通道」分离） |
| API | 🟡 | GET view=pull @P0（sg 活体 401 门实证=切后实照） |
| CLI | ✅(rlc 读链)/⏳(pull live) | pull 命令四 bin 实装（grep 锚同 R3）；rlc bin live pull 候工时窗 |
| 覆盖列「4/4」 | 🟡 | 同上 |

### R5 健康体检

| 端 | 判 | 锚/读数 |
| --- | --- | --- |
| 网页 | 🟡 | 底表「徽章+台账」：cf-badge（含 failed 红系）+cf-audit 台账行 ✅ 码锚；failed 态活体呈现=候降级窗 |
| API | 🟡 | GET 试拉链=verify 后端 @P0（sg 切换窗 verify HEALTHY 三 ok=SDE 读数卷 64fc75e8 供） |
| CLI | ⏳ | verify 四 bin 实装（TriMLC L838/TriRLC L839/TriMMC L514/TriRMC L522）；live 候工时窗（verify=试拉产生台账流量，夜窗自律不触） |
| 覆盖列「4/4」 | ⏳ | live 候窗 |

### R6 降级梯检视

| 端 | 判 | 锚/读数 |
| --- | --- | --- |
| 网页 | 🟡 | 底表「台账面板」：cf-pull+cf-audit（ledger 摘要面：applied_state+last_pull_*）✅ jsdom 实测（ui-fourplane ④）；**差异标注 D-4**：三层梯逐层明细（tier1/2/2.5/3 全梯视图）四卡面=摘要级呈现（梯语义全显=CLI cache show 面更全）——候 CPO IA 对表摘要级 vs 全梯级口径 |
| API | 🟡 | ledger 端点（managed 投影 ledger.faces ✅ 实测+raw face-events 不进 UI ✅ 边界绿） |
| CLI | ✅(rlc) | `config show` 隐含梯读数（source=tier2-cache-fresh+cache fresh/stale-grace 分支码锚 cli.ts L828-833）；`cache show` 独立子命令=show 同义分支（L810-812 实勘）；live 读数=R1 同测（05:2x 实测） |
| 覆盖列「4/4」 | 🟡/⏳ | 同族 |

## 三、差异②终核（应用双通道分名分显）

- CPO §三裁：网页「应用」vs daemon「拉取生效」分名+徽章双字段（①服务端卡状态②本域面消费态）。
- P2 UI 实装对照：①cf-badge=服务端卡状态（pending/applied/failed+诚实三态）✅；②本域面消费态（tier 几在生效+归因+时刻）——**现呈现面=cf-pull 行（last_pull_at/from/result+applied_state）**，tier 序号显式字段未单列——**差异标注 D-5**：双字段之②的「tier 在生效」显式化候对表（CLI config show 的 source=tierX 读数已有，UI 摘要面候定口径）。
- 混词防线：UI 全文件通道词汇零出现（ui-boot 断言⑤ 14 词全文件扫）✅；「应用/拉取生效」分名在 P2 UI 话术面=降级话术 DEG_LINE 族（jsdom ②实测每卡在位）。

## 四、CPO 八项↔底表残项（候 CTO 确认①②的 P1 落位回报）

- 确认①卡面写备份：**已落位**——sg 活体实证 trimmc-card.json.bak-1/2/3 轮转（切后实照 ledger-presence+manifest 注记①；写守卫 keep=5 族）。
- 确认②卡写审计：**已落位**——face-events.jsonl pull/write/status 全族（切后实照 11 行；CPO A2-E 判词「who/when/op/result 含 denied 全量留痕=审计账预期形态」e6c6f188）。
- 两确认在生产活体闭合→CPO 对表 8/10→**10/10 材料齐**（本节供 CPO 对表卷引用）。

## 五、候窗清单（候件不虚验，逐格 ID）

1. ⏳ R1/R5/R6 CLI mmc+rmc bin live（sg/河源 SSH 只读 show/cache show，工时窗）
2. ⏳ R3/R4 CLI pull live（状态变更面，工时窗+候 sg 稳定窗）
3. ⏳ R5 verify live 四 bin（试拉流量，工时窗）
4. ⏳ mlc bin CLI 全族重测（候 F-1 裁定+修后）
5. ⏳ 网页侧活体点验全格（本地 P2 UI boot 点验=工时窗；部署窗后 sg 活体=CEO 亲测面预验材料）
6. ⏳ D-1/D-2/D-3/D-4/D-5 五差异标注候 CPO IA 对表+CTO 口径裁定
7. ⏳ F-1 候 CTO 裁定（可并 registerPid 常规窗批）

## 使用依据

- CTO 底表：cto-implementation-plan.md §5.2+§5.1（@76d58282）
- CPO 基线：cpo-cto-plan-reconcile.md（8/10+三裁+§五.2 策略卡呈现词）+cpo-p2-ia-conformance.md（AC3 零悬空）
- STE 判据：ste-test-plan-p2.md A3/C1（三值如实+差异显式标注归档+读数留痕）
- P1 落位锚：N9（TriRMC 496613b/TriMMC 99ed6d0/TriMLC 99d8466/TriModel 8de8fe7）
- 活体实测：本机 8711/8713/3333 + face-ledger 实读（时点见各格）
