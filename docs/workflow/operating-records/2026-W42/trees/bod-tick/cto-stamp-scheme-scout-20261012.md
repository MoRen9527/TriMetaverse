# CTO · 指令盖章机制方案令·前置盘点留痕（轻量）

- sourceOfTruth: 本卷（trees/bod-tick/cto-stamp-scheme-scout-20261012.md）
- syncMode: static（方案令前置盘点·窗后出稿时升 work 状态）
- lastSyncedAt: 2026-10-12T22:48:00+08:00（落笔时点·date 现查 22:47:5x 见 commit 卷笔）
- 令链：BOD 22:40 方案令（CEO 22:39 定调）+BOD 22:45 素材入口补充（CEO 22:44 原令·TriChain/TriWeb4 对表）+CPO 协同草案 17ec29950（三立场三边界例）并稿候窗后首窗

## 方案令五要素

1. 密钥生成与持有面（私钥员工席持有）
2. 签名字段格式（发令附公钥签名盖章）
3. 验签点=SendMessage 收信侧（无签=数据不执行不派活）
4. 无签降级策略
5. 与既有编号防伪纪律关系

## 三大约束

- **接入前模拟**：区块链=TriMetaverse 未来接入大模块，本机制须含链上身份映射兼容路径（密钥形态/签名原语），不可一次性临时壳
- **跨平台**：linux/mac/安卓多端，密码学原语平台无关；OS 凭据箱（Win 凭据管理器/mac Keychain/Linux Secret Service）只管私钥保管面，与签名层互补不合流
- **跨平台兼容评估必含**

## 前置盘点结果（本段=轻量定位·全量对表窗后出稿段做）

- **TriChain**：`D:/Code/ai/TriChain/`——文档面同构齐备：`docs/registry/{product,code,business}-state.md` + `docs/engineering/{DESIGN,ROADMAP,STATE}.md` + `docs/product/{PROJECT,REQUIREMENTS,ROADMAP,STATE}.md` + `README.md`
- **TriWeb4**：`D:/Code/ai/TriWeb4/`——文档面同构（与 TriChain 同布局）：registry 三面 + engineering 三件 + product 四件 + README
- **出稿对表清单（候窗后首窗）**：
  1. 两仓 `docs/registry/business-state.md` + `code-state.md`——既有链形态/身份模型现状
  2. 两仓 `docs/engineering/DESIGN.md`——签名原语候选（Ed25519/secp256k1）与既有架构对齐点
  3. CPO 草案 17ec29950——三立场三边界例并稿
  4. 同批先后评估（hub-silent 调参/M-001 信面落款合同/本方案）附优先序建议
- **方向预判（呈 BOD 已报·定稿候对表）**：签名原语候选 Ed25519（跨平台库覆盖+Solana/Cardano 系原生映射；以太坊系目标则 secp256k1 对表）；降级策略预判 warn-only→enforce 两阶段灰度

## 排期

- 方案出稿=窗后首窗（新窗时点候令·R1 今晚改排 COO 22:44 知会·勿自估勿抢跑）
- 本卷 static 留痕=断电亦不丢
