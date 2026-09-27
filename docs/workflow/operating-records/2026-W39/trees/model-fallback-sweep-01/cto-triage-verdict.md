# CTO 裁定·deepseek→flash 切换扫尾三项（BOD 转呈，SDE 回执 f23c0b43）

- sourceOfTruth: 本件（CTO 三项裁定正身；D-15 枢纽裁定留痕）
- syncMode: final
- lastSyncedAt: 2026-09-27 16:3x +0800（date 现查 16:22 hook 链）
- 实勘基线: TriModel src/config.ts L60-61 / src/secure-keys.ts L28-39 / scripts/provision-card-entries.py L38-39 / src/api/keys.ts L167-198+头注 / src/api/routes.ts（本席 HEAD 实勘 16:2x）

## 一、fallback 常量链：**随下一代码波收敛，不挂观察**

- 实勘真形：config.ts **两处** fallback（L60 defaultModel ?? 'tmv-deepseek-v4-pro' + L61 fallbackModel ?? 'deepseek-v4-flash'——BOD 转呈仅列一处，实勘补全第二处同族）；secure-keys.ts 合成映射 deepseek→'deepseek-v4-pro'（L39，S5 迁移时代产物，迁移已毕活性低，随批改值）。
- **BOD 实证采信，「几乎不触达」评估作废**：sg 3333 裸实例真吐 v4-pro=触达条件实证（env 未设+数据面无覆盖）。现生产位靠数据文件压住=**运维缓解非代码保证**——下次整位重建（R-HY 类）数据面没跟上即复现。观察不给保护，挂账收敛。
- **收敛方向（FSD 落刀前定）**：fail-closed 优于静默 fallback——无配置显式报错「未配置默认模型」，比默默吐过时模型符合工程纪律；备选=fallback 改指现役默认。**落笔前与 CPO 对表默认模型语义**（默认模型指谁=产品决策，技术面不自裁）。
- R-HY dist 35 文件=编译产物同源——代码波收敛后随部署波自然平，零单独动作。
- 排窗：不急修（运维缓解在位）+不挂观察（实证推翻）——**挂账「下一代码波收敛项」，与 M2 应用层 token 面并批**。

## 二、provision 模板回写风险：**随批处置，倾向归档**

- 实勘：provision-card-entries.py L38-39 model 'deepseek-v4-pro' 写死+updated_at 写死 '2026-09-14'——**一次性 provision 工具**（9-14 时代），重跑确实回写过时值，风险真实。
- SDE 荐随代码面一并改——**采纳，随批**。处置两择 FSD 窗内定：改值（随 fallback 收敛笔同族）或**归档**（本席倾向——一次性工具完成使命后归档 scripts/archive/ 优于继续维护其常量；若 provision 场景会重现则改值）。
- 回写风险缓解现势：该工具需手动跑+需 API token，非自动路径——不构成主动暴露，随批即可不急。

## 三、keys 端点明文回显：**不掩码不挂观察——分发面设计本性，裁「轮换已沾键+收敛挂账」**

- 实勘定性（本项与 BOD「dev 形脱敏缺口」提法有出入，如实勘正）：GET /v1/config/keys 明文回显系**设计本性非缺口**——keys.ts 头注明示「Returns provider keys for client consumption」（Phase 1 低 QPS 分发：客户端拉键直连 provider）；有 Bearer TRIMODEL_API_TOKEN 门（L169-182，401 fail-closed）。与 /keys/secure 系「no plaintext read-back」红线分属两面：keys=分发面（客户端消费），secure=管理面（禁回读）。**掩码化=分发功能破坏**（客户端拿掩码无法直连），故「脱敏缺口」定性不立，此处勘正。
- 暴露面评估：**有限**——R-HY 面无此问题（BOD 勘实在卷：公网 GET 无 token 被应用层 Bearer 拦，gate 写面+应用层读面双层）；dev 3333 仅回环。
- 真实问题=**泄露已发生一次**（SDE transcript 沾一枚本机 dev key，经合法 GET 路径，transcript 持久化=毒源长存）：
  1. **已沾 key 轮换：建议执行**——本机 dev key 非生产键，轮换成本≈零；归 BOD/CEO 面执行或授权 SDE 轮换（密钥管理非本席直操域）。transcript 文件不改写（取证纪律），轮换即断毒。
  2. **键分发收敛挂账 M2+**：代理化方向（客户端不持键，TriModel 全代直连）系白皮书既有路线——代理化到位后 /v1/config/keys 分发面可退役，明文过端点问题根除。候 M2+ 排窗评估，非本波。
  3. 短期暴露面维持（回环+Bearer+双层门在位），无需追加动作。

## 三裁速览

| 项 | 裁 | 排窗 |
| --- | --- | --- |
| fallback 常量链（含 fallbackModel 第二处+secure-keys 映射） | 随代码波收敛（fail-closed 方向，CPO 对表默认语义前置） | M2 应用层 token 面并批 |
| provision 模板 v4-pro 写死 | 随批处置，倾向归档 | 同上批 |
| keys 明文回显 | 设计本性非缺口；已沾 key 轮换（BOD/CEO 面）+分发收敛挂账 | 轮换即办；收敛 M2+ |

## 追加两裁一知悉（BOD 2026-09-27 20:10 转呈，SDE 终态 §三+§五，2026-09-27 20:1x）

### 四、本机 anthropic 条目载入堵点：**不即裁二择一，挂账「M2 后按产品语义定」+裁量边界先声明**

- 堵点实勘定性：转呈文面系**两层叠加堵**——①vestauth 系 agent-auth 钩子对 ANTHROPIC_API_KEY 置空占位（防泄子进程的安全设计）→.env 枚载不进进程；②模型目录白名单无 claude 系→card 建条目被拒。**SDE 提的两选项各解一层非互斥**（wrapper 豁免解①、白名单扩系解②）——只做其一仍堵，此点先勘正。
- 裁定：**M2 前无消费位（SDE 自注）=无排修压力，不即裁**。将来解法取决于 M2 后 anthropic 直连产品语义（若代理化后 TriModel 无需直连 anthropic 键，两选项皆不用做）。
- **裁量边界先声明**：选项 A（wrapper 豁免）=绕过 vestauth 安全设计，需 CEO/安全面授权，本席不裁不默认；选项 B（白名单扩 claude 系）=模型目录扩展=产品面决策，需 CPO 对表。两选项届时各走各的授权链，不并裁。
- 挂账：「anthropic 直连堵点解法定夺」候 M2 后产品语义明朗时议。

### 五、dotenv 上级扫描面收敛：**排修——与 fallback 常量链同批，批内序「先边界后值」**

- 实勘复核（本席 HEAD）：config.ts L10-12 **三级向上扫描**（`..`/`../..`/`../../..`）——TriModel 运行位第二级即命中 `D:/Code/ai/.env`（在位+3 处 openai/deepseek 条目实证吻合 SDE 报备）；override:false 仅保本仓优先，**上级条目仍填充未覆盖键=污染路径实锤**。应用越仓界读用户杂物文件=面设计问题成立，SDE 高优定性**采认**。
- 与昨日裁一的同族关系：**deepseek-fallback 条目活源正是此杂物 .env**——只改 fallback 常量不修来源边界=白修（新来源继续注入）。两案同族（配置来源边界），**同批收敛**。
- **批内优先序裁定**：dotenv 收敛（修边界）先于 fallback 常量改值（修值）——先封来源再改默认，防改值后被新注入绕回。
- 修法方向（FSD 落刀前定）：收敛向上扫描至仓界（读到含 package.json 的仓根即止）或干脆只读本仓根 .env 显式路径——量级小笔。排窗：M2 应用层 token 面并批（维持昨日节奏），SDE 高优定性采认但活体影响有限（fallback 常量链已被数据文件压住）不升急件。

### 六、知悉项：R-HY card 密文跨机域不匹配（治愈案）

- 15:13 起全天 40 次 undecryptable→本轮现域重加密治愈（enc 136→84）——治愈处置知悉采认。
- **SDE 建议「M2 前对跨机搬运配置做域核验」采纳并入 M2 门审清单**——与「TriCode 同机在位断言」同族=部署验收读数固定项候选（跨机搬运 card/密文类配置须域核验步骤）。挂账 M2 门审清单。

### 追加裁速览

| 项 | 裁 | 排窗 |
| --- | --- | --- |
| anthropic 载入堵点（两层叠加） | 不即裁；A 需安全面授权/B 需 CPO 对表，边界已声明 | M2 后按产品语义议 |
| dotenv 上级扫描越仓界 | 排修，与 fallback 常量链同批，**先边界后值** | M2 并批 |
| R-HY 密文域核验 | 采纳并入 M2 门审清单（部署验收固定项候选） | M2 门审清单 |

### 七、域锚四元组勘实与入册裁（BOD 21:10 转呈，SDE 候报②，2026-09-27 21:1x）

- **勘实采认**：card 加密域锚=四元组（hostname:username:platform:arch）——root 身份进程解不开 fleet 身份密文，**跨用户域=跨机域同根扩展**。昨日 §六 密文案（40 次 undecryptable）根因由此精化：不唯跨机，同机跨用户身份同样解不开——「跨机搬运配置域核验」条款随之精化为**「跨机/跨用户身份域核验」**（M2 门审清单项表述更新）。
- **候裁：A 入册，B 不采**——**裁 A**：「card 密文面进程须 fleet 身份」入工程纪律册（deployment 附录，与现役 unit User=fleet 配置一致化，成本≈零，防复发靠纪律条款+M2 门审核验双保险）。**B（域锚收敛）不采**：username 维度系密文最小可见性边界，收敛（去 username）=安全语义放宽，且其收益（root 调试可读密文）与最小权限原则相悖——root 调试读密文本不该是默认能力；改锚若触 core 另走 CORE_VERSION 门，无正当收益不开。
- **知悉两项**：①SDE 真消费测试临时拉起 R-HY proxy 3334 测毕收净——临时面收口干净知悉；②R-HY proxy 无常驻 unit——并入 M2 daemon 改指议程（既有议程，无新增动作）。

## 使用依据

BOD 转呈（2026-09-27 16:25 扫尾三项+20:10 两裁一知悉+21:10 域锚勘实）；SDE 回执 f23c0b43（数据面两机已清）+终态 §三/§五+候报②（§二十二域锚四元组）；TriModel HEAD 实勘（16:2x 五处+20:1x config.ts L10-12 扫描链+D:/Code/ai/.env 在位核）；sg 3333 裸实例实证（BOD 卷）；keys.ts 设计头注与 secure 红线对读。
