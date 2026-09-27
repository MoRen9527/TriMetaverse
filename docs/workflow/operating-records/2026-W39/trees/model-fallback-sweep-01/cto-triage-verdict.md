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

## 使用依据

BOD 转呈（2026-09-27 16:25）；SDE 回执 f23c0b43（数据面两机已清）；TriModel HEAD 实勘五处（16:2x）；sg 3333 裸实例实证（BOD 卷）；keys.ts 设计头注与 secure 红线对读。
