# CPO↔CTO 方案对表件 · TASK-TRIMODEL-CONFIG-PAGE-4PLANE-01（三方对表产品侧回执）

- sourceOfTruth: 本件（CPO 对 CTO 实施方案件的三方对表回执正身；CTO 件=cto-implementation-plan.md @ 76d58282，CPO 件=cpo-product-plan.md @ e8eb515a）
- syncMode: working（候 CTO 两条确认回应→三方一致→BOD/CEO 合审）
- lastSyncedAt: 2026-09-28T04:4x+0800
- 对表范围: CTO 件候对表三处（§4.3 层级裁/§5.2 差异①②）+功能项清单↔能力矩阵底表逐项

---

## 一、对 CTO §4.3 双源层级合并裁：**采认，产品裁如下**

CTO 裁序 `env 显式覆盖 > TriModel 卡面（tier1）> fleet bundle（tier2）> 常量兜底（tier3）`——**本席采认，产品语义成立**：

1. **活配置压基座=页面承诺的诚实性前提**：配置页产品承诺是「改了就生效」（getter 读盘零重启）；若 bundle 能压卡面，页面显「已应用」而实际不生效=假成功态，违反诚实三态纪律。序单调（显式>活>基座>兜底）无环，漂移可由 `config show` 来源归因可见（CTO R2 缓解承接）。
2. **env 逃生门最高=运维兜底不依赖产品层**：与零自依赖铁律同族——救火通道不因产品面改动失效。采认。
3. **默认模型语义指谁（CTO 候对表项）**：卡面 default_model=管理员**显式管理的现役意图**（网页/CLI 可改可审计）；bundle model.defaultModel=**随仓分发的出厂基座**（低频）；常量=最后防线。产品语义一句话：**显式意图压出厂默认**。本裁只定「序」不定「值」——fallback 常量收敛（deepseek-v4-pro 该不该换）系 model-fallback-sweep-01 线 CPO 对表前置在账候办，本件不预支其结论，两线同窗对表时并裁（与 CTO 件 §4.3 预告一致）。

## 二、对 CTO §5.2 差异① CLI 写面：**采认「卡写不开 CLI」，两写面显式分列**

1. **采认最小授权面裁**：MVP 阶段卡面写=网页单通道（ADMIN token fail-closed 门），CLI 只读+拉取（pull/show/verify/cache）。写凭据面零扩张——写 token 只在管理位流转，不进 daemon/用户 shell。
2. **本席清单两写面澄清（对表修正项）**：功能项 4「模板切换」实为**连接配置写**（presets 三件套→env/settings 链，fb-zone 五门内核，CLI `restore-direct` 在役合法）——非卡面写，与 CTO 裁不冲突。清单修正注记：**卡面写（PUT cards/{face}）=网页 only；连接配置写=CLI 在役**。两写面在 UI 上分属不同区块（卡编辑 vs 连接配置），不得混词。
3. 未来 CLI 卡写需求成立（headless 管理位）→ face 写凭据面另议授权链（CTO 已留口，本件不启）。

## 三、对 CTO §5.2 差异② 应用双通道：**分名分显，禁混词**

两通道改变的状态真身不同，混用一个「应用」=「TriMMC 卡管河源」式语义错位复发温床。产品裁：

| 通道 | UI 呈现词 | 语义 | 状态真身 |
| --- | --- | --- | --- |
| 网页 apply（LG-035 流） | **「应用」** | 卡内容→服务端现役（pending→applied） | 服务端卡生效域 |
| daemon `config pull` | **「拉取生效」** | 拉卡→本地重加密→立即生效+回写 | 本域面 daemon 现役 |

**徽章双字段裁定**：每卡显示两个独立状态——①服务端卡状态（pending/applied/failed+时刻）②本域面消费态（tier 几在生效+归因+时刻）。单字段混显会重演「pending 挂 12 天答不出下一步」教训（cpo-pending-card-eval.md 观察项同族）：状态必须答得出「现在是什么/该做什么」。

## 四、功能项清单↔能力矩阵逐项对表读数

| 本席八项 | CTO 底表对应 | 判 |
| --- | --- | --- |
| 1 卡头身份行 | 「查看现效配置+来源归因」+face pull ledger | ✓ 对上（daemon 存活态=runtime-info 数据源，CTO §1.1） |
| 2 拉取状态区+降级梯层显 | 手动拉取+台账+§四三层梯 | ✓ 对上（判梯序/归因码/台账形态四域同构=CTO §4.1 与本席一致） |
| 3 现役配置查看（masked） | view=managed+`config show` | ✓ 对上 |
| 4 模板切换（连接配置写） | claude-fallback 族（写 admin fail-closed） | ✓ 对上（CLI 侧在役；卡写面见本件 §二分列） |
| 5 备份与回滚 | **连接配置面：backups/rollback 端点+CLI 在役 ✓；卡面写备份：底表未列** | ⚠ **候 CTO 确认①**：PUT cards/{face} 卡面写是否含写前备份轮换（fb-zone keep=5+哨兵豁免同款）——影 P0 实现量级与治理面完整性 |
| 6 审计行（who/when/op/result len-only） | **face pull ledger 只覆盖拉取** | ⚠ **候 CTO 确认②**：卡写操作审计（谁在何时改了卡）是否入 P0——admin 写面无审计=治理盲区，本席视为产品必备项非增强项 |
| 7 降级话术 503 子型 | 503 fail-closed 语义在役（§1.1） | ✓ 对上（输出话术族 CLI/网页同源） |
| 8 CLI 对照行 | 能力矩阵即对照本体 | ✓ 对上（本对表件+终版矩阵即其产出） |

卡特有项对表：TriMLC 特有项（L2 flag/watchdog 态）CTO 件未列 UI 数据源细节——P0/P2 实施时以恢复梯在役读数为准，非对表阻塞；「fb-zone 本机栏并入 TriMLC 卡」（本席 IA 裁定）CTO 件 §1.4 D13 注记方向一致（本机直生效语义归位）。TriRLC 部署位：CTO §1.3 河源 8711+本机 8711 双位与本席矩阵（TriRLC·本机 行+TriRLC·R-HY 实例 行）同构，对上。

## 五、对表副产物两笔

1. **卡文件名勘正候办（本席件 §七.3）可闭**：CTO §2.1 新卡族 `<face>-card.json` 正名+§六迁移 bak 保留——旧 `trimmc-card.json` 名实不符随迁移线自然消解，候办改挂迁移执行单验收锚（§6.3）。
2. **「应用」词在策略卡的沿用**：LG-035 走查面「应用到本机」按钮（D2）语义=pull 类（服务端卡→本机生效）——按本件 §三应呈「拉取生效」族；但系走查走界面冻结面，**不回改现役文案**，本裁定作 P2 UI 重构时策略卡页的呈现口径输入。

## 六、对表结论

**三方一致度：8/10 对上，2 条候 CTO 确认（卡面写备份/卡写审计），3 条产品裁已回（层级序采认/CLI 写面采认+分列/应用双通道分名）。** 无结构性分歧——两件在「四卡=泛化非新建、域锚不变量、降级梯同构、R-HY server 域内迁移、P0-P2 分期」上完全同向。候 CTO 回两条确认后即可判三方一致，呈 BOD/CEO 合审。

## 使用依据

- CTO 实施方案件 cto-implementation-plan.md @ 76d58282（全文对表）
- 本席产品规划件 cpo-product-plan.md @ e8eb515a（§三 清单/§四 IA/§七 依赖）
- 既批在账资产：cpo-pending-card-eval.md（状态语义教训）/cpo-503-semantics.md（503 子型）/model-fallback-sweep-01 CPO 对表前置（在账候办，本件 §一.3 不预支）

—— CPO 小乔，2026-09-28 04:4x +0800（三方对表产品侧回执；候 CTO 两条确认）
