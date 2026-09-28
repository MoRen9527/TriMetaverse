# CTO 门审卷·R-HY rmc 卡纠正迁移预检（P1 令①）

- sourceOfTruth: 本件（预检报告门审正身；门审对象=rhy-precheck-report-20260929.md @ 42f1c584）
- syncMode: final
- lastSyncedAt: 2026-09-29 02:35:34 +0800（date 现查原样粘贴）
- 令链: CEO 02:10 显式令→COO 02:14 拆派（231fca65）→SDE 预检 02:33 达笔→本席门审

## 一、门审四项判定

| 审点 | 判定 | 依据 |
|---|---|---|
| ① 解密验证充分性 | **PASS** | root 首测 UNDECRYPTABLE→指纹派生含 username（key-encryptor.js L21）→su fleet 复测全 DECRYPTABLE——翻案方法论正确（活体优先诊断法兑现），掩码纪律全程；分发面活体闭环（GET /v1/config/keys 掩码与卡条目逐一吻合=card-entry 实供实锤+fail-safe 语义自洽）为充分性加分项 |
| ② snapshot 留档 | **PASS** | snapshot-pre-rmc-migration-20260928T182642Z.json+md5 双向一致；唯一写面=令文授权动作，零触原卡 |
| ③ 映射归属（含无法归属处置） | **PASS** | 三键+策略实体全可归 TriRMC 域，§6.2② 无法归属分支零触发；密文搬运可行性源码级实锚（D7 水合「api_key_encrypted 原样保留」+同机同用户指纹不变→搬运后解密照常）；两案呈报裁见 §二 |
| ④ 切换就绪判定 | **CONDITIONAL READY** | 条件三项见 §四；硬前置依赖序成立（范围 2 在先范围 3 在后）本席裁准 |
| 附：A2 回滚脚本分钟级判定 | **成立** | R-HY systemd 形态 Restart=always（非孤儿，比 dev 孤儿态更强）；主案=dist bak 目录级还原+systemctl restart；主卡改名 .bak 原位+反向脚本成文路径在 |

## 二、三处不擅断·本席裁

### ⓐ 策略实体：**案A=全量随卡搬运**（附护栏）

理由：①schema 同构实锚在（server 端同一 v4 handler 族，整卡 JSON 换 face）；②UI 重配=人工易错面且无对照锚，违背小步验证纪律反面；③全量搬运保留 active 状态=切换后 TriRMC 消费策略链与 dev 现势同构，**可对表验证**（结构 diff+pull view strategy 字段非空+default_model 投影=GLM-5.3 期望值）。
**护栏**：搬运后策略链活体三验（strategy 字段/default_model 投影/评估序不回 fallback）——若河源端 model 名失配致评估异常，回滚锚兜底（主卡改名还原），观察窗 900s 内可检。machine 元数据随案A 搬运但按 ⓑ 正名处理。

### ⓑ machine 元数据：**写河源实锚**

`machine.name=iZf8ziw57ydktu77fsld9yZ`（河源 hostname）+`connection.name=R-HY`（可读名）。
理由：①语义正名=卡物理归属机，hostname 是 md5/台账对表的天然锚；②「本机」中文残留=dev 语义污染须清；③face display 语义（「TriRMC（R·服务域·河源）」）是 FACES 注册表职责，不进卡内 machine 字段——不混装。

### ⓒ A3 mmc 空白态：**剥离出本单关键路径，另窗另单**

裁点：SDE 依赖链分析成立——mmc 卡空白→分发面 glm/deepseek 键消失→env 无此二键（实测进程 env 无 DEEPSEEK/GLM 系）→**分发面残缺为真**。且现役分发面=card-entry 实供（§五.5 实锤），主卡是河源 glm/deepseek 唯一供源。
**裁**：切换步=rmc 建卡（新增）+TriRMC pull 验证；**trimmc-card 主卡保留不动**（迁出语义=复制+确认，非移动+清空）；mmc 空白态=M2 键收敛窗另行单开，前置=GET /v1/config/keys 消费方盘点+退役确认。三机三键收敛未毕前，主卡保留=现役分发面兜底。
**排期影响**：切换步不再被 A3 卡——排期形态由 ⓒ 裁定简化为「FSD 范围 2 落位→升级窗→切换步」单链。

## 三、依赖序版本锚裁

1. **TriModel 河源升级锚=e9938cc**（裁准报告候选）——P0-EXEC-01 门审 03854395+A5 正式 PASS 终判卷 de76b2d3 定谳的现役最新绿锚；bc72ea4 无泛化端点不合用。
2. **升级窗强制自检（本席加钉一条）**：unit 显式 `TRIMODEL_DISABLE_BOOT_MIGRATIONS=1`——seam 实锚在 e9938cc 系（policy.ts L259/L313+trimmc-card.ts L177-185）；server.ts L97 boot 即跑 migrateLegacyDistCard，**不钉则升级首启自动迁移触主卡**，正撞 ⓒ 主卡保留裁定。TRIMODEL_CARDS_DIR=/srv/fleet/trimodel-data 显式（报告 §七.1 原案照准）。
3. **TriRMC 河源升级锚=TriRMC dev `496613b`**（本席锚定确认笔，2026-09-29 03:0x）——§四.条件 1 达成。COO 02:53 知会有主（FSD 范围 2 绿锚），本席独立抽验三项全过后确认：
   - **commit 在位+内容面对表**：dev HEAD=496613b 工作树净；diff 面（key-cache +824/key-encryptor +63 泛化移植+default-model §4.3 四级 ladder+app.ts config 五路由+boot tier1 接线+cli config 族）与条件 1「config pull 能力」逐项吻合，正补预检 §七.2 a459491 无 config pull 缺口；
   - **测试读数定点独立抽验**（40 测同跑）：新测三件（key-cache/ladder/config e2e）零挂全绿；4 挂身份逐一对表=Contract Resolver×2+Employee Registry v3，全落 TriCompany source-agents v3 契约域与改动面零交集——「既有」定性独立成立（FSD stash A/B+COO 实勘之外第三刀）；
   - **tsc 净复现**：--noEmit exit 0。
   - 锚效力=切换步部署源；TriModel 侧升级锚 e9938cc+seam 钉制（§三.2）不变，两锚并行候切换步连窗。

## 四、切换就绪判定（CONDITIONAL READY·条件三项）

1. FSD 范围 2（TriRMC 河源 config pull 能力）落位绿锚；
2. TriModel 河源升级窗按 §三执行（e9938cc+seam 钉制+CARDS_DIR 显式+migrate 行为实测）；
3. 建卡载荷按本案成文（ⓐ案A 密文搬运+ⓑ正名+主卡保留）；双门=本卷+CEO 知悉窗。

## 五、调度面跟排结论（回 COO）

- **P1 关键路径=范围 2 → TriModel 河源升级窗 → 切换步**（单链，A3 已剥离不在链上）；
- FSD 范围 2 落位为切换步前置不变；升级窗与切换步可同窗连做（seam 钉制使升级对主卡零接触，两步解耦风险低）；
- 观察窗≥900s（报告 §一原案照准）；A2 分钟级回滚已备（systemd 自拉活+目录级还原）。

## 六、闭卷笔（CTO 门审面·2026-09-29 03:4x——升级窗+切换步连窗读数复核后 CLOSED）

**读数卷**：rhy-switch-readout-20260929.md（2e262c9d，本席亲验在位）——三阶段连窗（TriModel 8de8fe7 升级→rmc 建卡+TriRMC 496613b 升级→900s 观察窗终验）全录，COO 03:31 汇转三条件达成。

### 6.1 §四 条件三项终核（对照读数卷逐项）

| 条件 | 判定 | 复核证据 |
|---|---|---|
| ① 范围 2 绿锚 | **达成** | 496613b 本席锚定确认笔（27cd91b5）在卷 |
| ② 升级窗按 §三执行 | **达成** | 本席加钉三检点全兑现：TRIMODEL_DISABLE_BOOT_MIGRATIONS=1 drop-in（读数卷 §二.3）+boot 日志 `card migration: already-canonical`（强钉+canonical 判定双证=迁移链零动作实测，§二.4）+TRIMODEL_CARDS_DIR 显式（§二.3） |
| ③ 建卡载荷按本案成文 | **达成** | ⓐ案A 密文原样搬运+护栏三验（计数 1/3/2 对表+active 一致+default_model 投影 tier2-cache-fresh+ladder=card-fresh 非兜底梯=评估序不回 fallback）✓；ⓑ machine=河源 hostname+connection=河源 ✓；ⓒ 主卡 md5 bac279a6 三时点全等零触碰 ✓。双门中 CEO 知悉窗=CEO 02:43 显式令免除（读数卷令链在卷） |

### 6.2 部署锚取舍事后核（SDE 申报→本席核）

- **e9938cc ⊂ 8de8fe7 独立实锤**：merge-base --is-ancestor ANCESTOR-OK；`git log e9938cc..8de8fe7` **恰一 commit**=8de8fe7（候修①）——零夹带，「无内容偏差」申报成立。
- **候修① 裁据溯源记档**：「PUT 无 provider_entries 载荷 500→400 人话拒」修复语义独立审查成立（校验失败 400 人话拒=正形，500 裸错=缺陷）；卷面唯一出处=**STE X1 候修清单**（ste-test-plan-p1.md L54）。commit 标注「CTO 候修裁」在本席可查树面卷**无直接出处**——候 transcript 面查证（跨会话消息裁可能未落卷）或勘误标注。**不阻闭卷**（additive 守卫改善+子集零夹带+STE 清单编号连续性在），记档候勘。

### 6.3 A2 回滚形态升级核

「主卡自始零触碰」使反向迁移从 rename 还原简化为「rm rmirmc-card+撤钉」——比门审时预判的形态更简，分钟级判定维持成立；四层回滚锚（双 dist.bak+双 git 回退点+override 移除序列+rmc 卡 rm）读数卷 §七 在位未动用。G5 轮转备份防线河源侧首次实战兑现（写回备份 5 件，§八.5）。

### 6.4 §六.4 候裁项裁定：主卡 root 属主——**不动，M2 窗候办**

SDE 申报：主卡 trimmc-card.json 属主=root（09-27 flash 批产物）在 fleet 700 目录内，server 读无碍，UI 编辑 mmc 卡走 PUT 会 EACCES。
**裁**：①**EACCES 定性=属主防线 fail-closed 生效，非缺陷**——意外写主卡被拒=摩擦面即审计面，方向正确；②ⓒ 红线语义下「UI 直接编辑主卡」本就是应退役的旧工作流（新流程=编辑 rmc 卡），不为旧工作流恢复便利而触碰主卡元数据；③**M2 键收敛窗动 mmc 卡时随窗一并 chown**（有专人窗有门审，不零散触碰）；④本项挂 M2 候办清单，不阻任何现役面。

### 6.5 闭卷判定

**CLOSED-PASS——门审簿本单（R-HY rmc 卡纠正迁移）闭卷。**挂账续项不变：status write-back 404 recurring（dev 侧）/G2b 候 CPO/键沾染轮换/M2 候办清单+主卡属主项。§四条件全达成，观察窗终验全绿，回滚锚全单在位未动用。

## 使用依据

预检报告 42f1c584 全卷（本席直读）；seam 源码实锚 TriModel src/policy.ts L259/L313+src/trimmc-card.ts L177-185+src/server.ts L97（本席独立勘）；CTO 补注 078f0cf7（三层回滚序+拉起令成文=SOR §八照准入卷）；终判卷 de76b2d3（e9938cc 锚定谳）；门审纪律=D-04 报时/实勘先行/门不豁免。闭卷笔新增依据：执行读数卷 rhy-switch-readout-20260929.md（2e262c9d 亲验）+本席 git 层独立核（merge-base/log 区间）+STE X1 清单（ste-test-plan-p1.md L54）+TriRMC 锚定确认笔 27cd91b5。
