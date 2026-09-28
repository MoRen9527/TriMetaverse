# CTO 架构门审清单·TASK-TRIMODEL-CONFIG-PAGE-4PLANE-P0-EXEC-01（A5 签发前置对照面）

- sourceOfTruth: 本件（门审对照面底稿；门审结论另落 cto-gate-verdict.md）
- syncMode: working
- lastSyncedAt: 2026-09-28 10:4x +0800（date 现查 10:38 hook 链）
- 对照正身: 方案 v3 @ afb0180c（cto-implementation-plan.md）+ 执行单 @ d9df61bc
- 性质声明: 方案已 CEO 终审冻结——本清单=验收对照面非修订面；门审≠修案权，发现方案缺陷/疑义停手经 COO 转 COS 裁

## 门审项（G1-G10，逐项 PASS/FAIL+实勘证据留痕）

| # | 门审项 | 对照锚 | 核对面 |
|---|---|---|---|
| G1 | face registry 静态声明式 | §2.1 | FACES 四值常量（mmc/mlc/rmc/rlc）；元组含 face_id/显示名/卡文件名/部署位语义；face-ledger.json 落 TRIMODEL_DATA_DIR；无动态注册协议 |
| G2 | 泛化端点族+别名零破坏 | §2.2 | `/v1/config/cards/{face}` 三族（根/status/apply）；GET 两档视图（managed/pull）；不在册=404、凭据不绑=401；trimmc-card 全族别名原样保留（A1 回归实测）；卡面引擎核心零改 |
| G3 | 鉴权双层制 | §2.3 | 写面 TRIMODEL_ADMIN_TOKEN fail-closed 原样；pull 面 API_TOKEN+TRIMODEL_FACE_TOKENS 可选通配（P0 态）；机内 PUT 零重启语义保留 |
| G4 | 域锚不变量三条 | §3.1-3.3 | 拉取流不传 at-rest 密文文件只传受控载荷；明文仅存响应生命周期不落 server 盘；消费机 PBKDF2 域内重加密落 config-cache；失败 fail-closed 三归因码（pull_denied/decrypt_failed/apply_rejected）；cache 域不匹配→丢弃直落 tier3+告警 |
| G5 | 卡写备份轮换 | §十 P0① | claude-fallback L28 机制泛化：备份先行+keep=5+FROZEN-BACKUPS 哨兵豁免+幂等短路（A3 实弹留痕） |
| G6 | face-events 审计账 | §十 P0② | 单一 jsonl；事件型四族（pull/write/apply/status）；len-only 不落键值明文（A2 核验） |
| G7 | CLI config 族 | §5.1/5.2 | 四命令族 config pull/show/verify/cache show+clear；**CLI 不开卡写面**；TriMLC model 命令保留并列；TriMMC/RMC config-sync 族不混义；CLI 走 HTTP 同端点非旁路（A4 对表底表逐格） |
| G8 | 本机两卡接入 | §3.2/§4.1/§4.4 | TriMLC 8713/TriRLC 8711 config-cache 泛化（key-cache 机制泛化非重写）；判梯序/归因码/台账四域面同构；寄居过渡注记随卡；卡文件 mlc-card.json/rlc-card.json 语义 |
| G9 | commit 结构= revert 单 commit 语义 | 执行单 A6/边界 | 泛化层纯新增独立 commit（混不进无关改动）；老路径零改动可证（diff 断言）；revert 演练实测回滚干净 |
| G10 | 部署步纪律 | COO 令③ | 两 daemon 重启照 TriLC 重启纪律：trilc/trimlc stop+start 权威路径、pidfile/port 断言（pidfile 按 port 分文件）、禁裸杀；重启后 healthz 留痕；R-HY 生产写面零触碰 |

## A5 签发双条件

1. STE 测试族全绿读数（执行单范围 6：API 族+cache 泛化单测；全量读数回报纪律——既有失败逐族归因）；
2. 本门审 G1-G10 全 PASS（任一 FAIL=停手升级或退回 FSD 修复，不签发）。

## 门审触发与产出

- 触发：FSD 实现 commit 到位+STE 读数到；
- 产出：cto-gate-verdict.md（逐项判定+实勘证据+签发/不签发结论）+节点收口件（时点+回执 id+done）经 COO 交 COS 记账。

## 使用依据

方案 v3 afb0180c（§2/§3/§4.1/§5/§十）；执行单 d9df61bc（范围六项/A1-A6/边界）；COO 拆派令门审面四条；TriLC 重启纪律（工作区记忆条+pidfile 分文件裁点）。
