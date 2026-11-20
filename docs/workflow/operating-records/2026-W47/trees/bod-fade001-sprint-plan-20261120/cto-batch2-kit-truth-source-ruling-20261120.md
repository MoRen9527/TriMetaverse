# CTO 批 2 ③接线窗升裁卷（kit 双真源分叉·裁 A=TriOrchKit 唯一真源·五段复启）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·kit 真源收敛裁决正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 升裁对象: fsd-batch2-wiring-kit-dual-source-survey-20261120.md（cade30550·NEEDS_CLARIFICATION·三裁面候选备全）
- 裁定: **裁 A（细化形）——TriOrchKit 独立仓=kit 唯一真源·bridge-core（adapter-face 形）移植+根出口·旧 claude 直调形退役·TC 包候退役标注**——批 2 ③接线窗照 §五五段复启
- 复验方法: 收稿三查（cade30550=sg 顶/TriOrchKit 04f0894=批 3 复验基线/TC 2786b0e fetch 后对象库直读）+独立抽勘四处（TriOrchKit bridge 面 grep+TC index 出口面全读+TC bridge-core export 面+两包形原文）+谱系主干三卷对读（97c8c70a3 承录卷/d9fa1d283 C2 两裁卷/cade30550 勘定卷）

## §一 · 谱系主干勘定（裁决地基·四笔时序）

| 时序(+8) | 件 | 定谳内容 | 真源位 |
|---|---|---|---|
| 11-20 02:00 | TC 包铸 2786b0e（m-duty-fsd 主刀） | packages/orchestration-kit 九件+**bridge-core adapter-face 新形**（bridge-types 56 行+session-bridge-core 57 行·notice-232 增补承面） | TC 仓（sg dev 推讫） |
| 11-20 06:36 | 本席 C2 两裁卷 d9fa1d283 | 候裁②=**kit 落位独立 sibling 新仓 TriOrchKit**（裁据四条：双侧消费/独立版本独立回滚/sibling 同构/TriCode workspaces=终局候选）·附则②=九件落装**MMC 形为基直拷** | TMV 树 |
| 11-20 上午 | TriOrchKit 建仓+演进（8bd095b→366cd0c→04f0894） | 照附则②直拷 MMC 形基（**session-bridge=claude CLI 直调旧形随基**）+契约 31 案+批 3 P1 演进（本席 APPROVE a387de991） | 独立仓（sg bare 同步） |
| 11-20 01:54 | sg 手装野生面 | TC 包 build 产物手装 node_modules（真目录零 git 锚·dist 含 createSessionBridge） | sg 面（野生） |

**分叉根因勘定（如实认领·本席承录）**：C2 两裁卷附则②「MMC 形为基直拷」未并入 TC 包 bridge-core 增量——2786b0e 先于裁面 4.5h 已在 sg dev 推讫，本席裁时未对表 TC 包=**本席裁面漏勘**（gate 卷 §四根因条同族第二例·fsd 0b78db4da 技术输入漏勘=同族第三例）。缝在裁不在执——fsd 直拷系照本席附则照铸，执行面零责。

## §二 · 三裁面裁决（A 细化采认·B/C 否）

- **裁 A（细化）**：TriOrchKit 04f0894 为基（批 3 演进基全谱保）+TC 包 src/bridge/ 二件移植+根出口（照 TC index L26-40 形：createSessionBridge/buildRegistry 值+SessionBridgeDriver/SessionBridge type）+**旧形退役**+白盒案随铸→接线指向 TriOrchKit（令面 file:../TriOrchKit 范式保·kit 独立仓=唯一真源收敛顶）。
  - **旧形退役判据三条**（TriOrchKit orchestration/session-bridge.ts claude 直调形+orchestration/index L12-13 出口）：①唯一跨仓消费者 TriMMC 8811220 shim 已删旧形消费（迁 adapter-face）=零现役消费面；②buildRegistry **同名异形双定义**（旧形 `(sessions, employeeNames)` vs core driver 侧签名）=根出口撞名·语义分叉永续险；③claude CLI 硬编码在 kit=daemon 耦合面，违 kit 收敛判据③「无 daemon 专有耦合」（97c8c70a3 §四）——adapter-face 收敛语义正形=daemon 耦合实装（claude/dsh CLI driver）归 TriMMC adapter 侧（8811220 已承）。
  - **c8 契约案随形重铸**：旧形退役→c8 改铸锚新 core 面（driver 注入形纯函数契约：buildRegistry/createSessionBridge 工厂案）+claude CLI 调形契约归 TriMMC 侧测试域（TriMMC 自己的案位）——c8 卷面已有错装标注预告同构逻辑（executor/dsh 归 c9 同款）。
- **否 B（接线指 TC 包）**：①推翻本席 C2 仓落位定谳（d9fa1d283 裁据②③独立版本独立回滚语义）=方向倒退；②TC 包九件=旧基（无批 3 P1 演进·11 案契约绿全在 TriOrchKit）=演进弃置或反向移植（新→旧仓）双劣；③TriOrchKit 独立仓刚毕建仓+三锚+批 3 收口即废=收敛自身失败。**勘正注**：B 裁理由「TC index 零直出·TC 亦需补笔」不成立——2786b0e index.ts L26-40=**createSessionBridge/buildRegistry/SessionBridgeDriver 直出在卷**（本席对象库直读实锚）——TC 包出口面已齐 shim 三符号（bin 待勘）——但基线差+仓落位定谳在先仍是主判据，勘正不改 A/B 取向。
- **否 C（shim 改形）**：fsd 同判承（8811220 已删实现回迁=劣·反收敛向）。

## §三 · TC 包处置与 sg 野生面处置

- **TC packages/orchestration-kit=候退役标注**（非本窗施工·零阻接线）：C1 过渡铸件（2786b0e 单笔·revert 一键形自承）·真源收敛 TriOrchKit 后=历史铸件——收口窗部署项=TC 包 README/头注标注「真源已迁 TriOrchKit 独立仓（d9fa1d283 裁·本卷承）」+显式退役窗（候 COO 统排）。@tricompany/agent-core 包形语义不受影响（两包形=包分工定谳照承·97c8c70a3 §四：agent-core=运行时原语/orchestration-kit=编排语义件——**分工语义与仓落位两层面勿混**·cade30550 B 裁「双仓关系重对表」据此勘正=包分工不变·仓落位已裁）。
- **sg 手装野生面=退役·增量勘定回收前置**：本席抽勘勘正「比 TC 顶还新」判断——TC 顶 index 本就直出 createSessionBridge，野生 dist 八成=TC 包 build 产物直装（真增量差=待勘项：bin 出口面/构建配置面）。接线窗 sg 侧段=①增量勘定（野生 dist vs TC 包 build 产物 diff·bin 符号勘源）→②TriOrchKit 新顶 install 替换手装真目录→③退役注记。**若勘出实质源码差（非 build 伪影）→回收进 TriOrchKit 后再退役**（野生增量零丢弃）。
- **bin 符号面=段①前置勘定项**：8811220 shim import bin 属性——TC/TriOrchKit 出口面均无 bin。预判=claude bin 路径属 daemon adapter 侧配置（TriMMC 自带·非 kit 出口）——若然 shim 改 import 源一行=施工面小事；若 kit 须出 bin=移植面加一行。施工窗细勘·非裁决阻塞。

## §四 · 护栏两条

1. **engines 差（sg node v18.20.8 vs kit engines>=20）**：npm engines=声明面警告非硬错（非 engine-strict）·运行兼容性=**接线窗值面探针实证**（kit import 面+业务探针绿=兼容成立·run 时崩=探针显性失败回勘面在）——批 3 演进语法面=ES2018+ 基本兼容域·探针为准不定谳。
2. **纪律条升级候窗**（本席自领承录随裁）：跨仓铸件增量对表入 sibling 新仓建仓 checklist（hash 断言前先 fetch+建仓前全仓谱系 grep 双查）——同族三例（gate 卷 §四/fsd 0b78db4da/本席两裁卷）实锚·候 D 系窗入册。

## §五 · 批 2 ③接线窗五段复启（施工候 COO 统排确认·D-27 v4）

| 段 | 内容 | owner | 门禁 |
|---|---|---|---|
| ① | 基线差勘定收口（TC 九件旧基 vs 04f0894 演进基·cade30550 已勘面采认）+bin 消费语义勘+sg 野生增量勘定（值席窗配合·只读） | fsd（本机面）+sg 值席面（野生勘·BOD SSH 链候排） | 只读·毕报落树 |
| ② | kit 移植施工：bridge 二件移植+根出口+旧形退役+c8 重铸+白盒案（单笔族·回滚锚=revert） | fsd | 69/69 回归锚零漂移+新桥案绿 |
| ③ | **本席门禁复验**（复验位承接·根出口三符号 TS 面实锚+diff 抽勘） | CTO | 复验卷落树·APPROVE 后进④ |
| ④ | 接线施工：TriMMC package.json file:../TriOrchKit+本机 tsc 面绿+sg 侧 install 替换+双侧重启窗·值面探针（含 node 18 兼容+kit import 面）——**sg 野生面暂留至探针绿后退役**（回滚锚双份：package.json revert+手装面还原） | fsd（本机+码面）+sg 值席线（install/重启·候排） | 活体值面探针（非 healthz） |
| ⑤ | 退役收尾：sg 野生面退役注记+TC 包候退役标注（收口窗部署项） | fsd+sde | 注记落树 |

- C3 P1 验收门连锁挂起维持（COO 台账 645 采认形）——候④毕触发·C3 四仓活体对表照裁扩=kit 双侧（本机+sg）同值面。
- 批 2 其余段（②债 1/债 6 供给+③cleanup 真跑已毕）不受本裁阻塞·照 COO 统排并行。

## §六 · 使用依据

cade30550 勘定卷+TriOrchKit 04f0894 本地检出抽勘（bridge 面 grep/index 出口 rc=1 实锚/c8 卷标注面）+TC 2786b0e fetch 后对象库直读（index.ts 全文/bridge-core export 面/--stat 12 件面）+97c8c70a3 承录卷 §四两包形原文（sg-server/dev 树面直读）+本席 d9fa1d283 C2 两裁卷全文+COO 台账 645（47c907c05·接线窗中止采认）+8811220 shim 消费面（cade30550 §一转引·本席零 TriMMC 检出复勘标注）+D-15/D-24/D-27 v4/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T03:16:07Z（+8=2026-11-20 11:16:07·date 现查原值·D-47 正形）
