# CTO 实勘清单·LG-017/018 升窗条款落地现势（CEO 22:24「现在就盘」令）

- sourceOfTruth: 本件（升窗实勘正身；直呈 BOD 转 CEO 裁取舍，清单不带裁面结论）
- syncMode: final
- lastSyncedAt: 2026-09-28 22:58:42 +0800（date 现查原样粘贴）
- 实勘方法：本机五仓 remote 逐仓实勘 + sg-bare `ls-remote` 活体 + `TriRMC/scripts/rmc_tick.py` 源直读 + 协议 v2.2 现行文本 + V21-2 勘定记录（W36 树）+ P-a 设计稿（09-04）+ 台账/周记录链 W36→W40 + admin-fix-log.txt

## 一、LG-017（pre-receive 立法实施）盘面

### 已落地部分（无需重办）

- **立法面 ✓**：协议 v2.2 在役——v2.1 五条款（staging 事前审决策记录/门禁期产出流向/实绩解锁/LG-017 扩容记载/懒激活三件套挂窗条款+现状风险窗段）全入法条文本。
- **设计面双件毕 ✓**：V21-2 机制勘定（08-31，sg-bare dev 写控=邮箱允许单+distinct 身份配套+tripwire；authorized_keys 分流否决降 phase-2 备选）+ P-a 设计稿（09-04，TriRMC 河源 push 接收面三闸，BOD 裁定采认、白名单矩阵照稿）。

### 未落地条款（列一）×值不值得办（列二）

| # | 未落地条款 | 现势实勘（锚） | 值不值得办（建议，非裁） |
|---|---|---|---|
| A1 | 三件套①sg-bare 建 staging 分支 | `ls-remote sg-server` heads 无 staging（仅 dev/copilot/e2e-test-* 杂支） | **候窗办**——v2.1⑤ 明文挂「R 面代码门禁开启窗」同批激活，禁单独提前；R 面门禁未开前撞点威胁现势低，提前激活无威胁可防 |
| A2 | 三件套②rmc_tick 合同改写（push dev→staging+`-c` 身份硬规） | `rmc_tick.py:198` 仍 `push origin dev`（本席直读） | 同 A1 候窗同批（三件套同批约束=立法文本） |
| A3 | 三件套③pre-receive dev 写控 hook 部署+post-receive tripwire | 脚本正身未镜像（`TriMetaverse/scripts/hooks/` 不存在）+sg-bare 无部署踪迹；W37+ 周记录零实施事件 | **拆两半**：脚本正身镜像入仓（V21-2 §四.7）=纯入仓零服务器面、低成本可前置；hook 部署=候窗同批 |
| A4 | P-a 河源 TriRMC.git bare 仓+三闸（force-push/身份写控/tag）+拒因词表 | TriRMC push 面现仍在 sg-bare（本机 TriRMC remote push=47.245.122.61 实勘）；河源 bare 未建；上线候明令（09-04 裁定：触迁移链传输层=敏感面） | **候真外部触发再办**——TriRMC 写侧现仅 heyuan 检出单点+force-push 事故记录零；现办=收益（防未发生的事）<变更风险（动迁移链传输层）；服务面再升格/多写侧出现时值率反转，届时设计稿零过期直接用 |
| A5 | phase-2 撞点机械闭环（迁移 payload 独立身份→trirmc 移出允许单） | 未启动（V21-2 §九.4 明示另令） | **不急**——A1-A3 未激活前无前置意义；触碰迁移 payload 属敏感面 |
| A6 | trimc 字段退役小窗×2（自批转 CTO；FSD 派定 LG-017 毕后插窗） | 未开窗 | **随线走**——依赖 LG-017 主线毕；量级小（双字段+过渡），不阻不催，任意运维窗可自批补办 |

### 设计口径代差注记（勘验发现，低成本勘正项）

台账 LG-017 勘验项文本（heyuan 独立 key+authorized_keys restrict 分流）早于 V21-2 结论——该前置已被 V21-2 **否决降 phase-2 备选**（主案=邮箱允许单，迁移链爆炸半径=0 的勘定理由在卷）。两设计稿分属两仓（V21-2=sg-bare TriMetaverse.git dev 写控／P-a=河源 TriRMC.git 接收面）机制不冲突，但台账勘验项未同步 V21-2 结论——候收口顺手勘正台账文本（纯文字面）。

## 二、LG-018（远端链路卫生）盘面

### 已落地部分（销账面）

- 镜像推+对账+死挂删除 ✓（08-31）；hosts 修复+27 笔清账 ✓（09-05，admin-fix-log 实录在卷）；**cron 重注册 runbook ✓ 已落地**（W37 夜航01，`docs/execution/lg-heyuan-cron-reregister-runbook.md` commit 383ee3df：三 job 参数照现役实录+验证三步+10 分钟序）——**候台账销账一笔**。

### 未落地条款（列一）×值不值得办（列二）

| # | 未落地条款 | 现势实勘（锚） | 值不值得办（建议，非裁） |
|---|---|---|---|
| B1 | origin/sg-bare 同址冗余收敛（在册低优余项） | 本机五仓逐仓实勘：`origin` 均双 push URL（GitHub HTTPS+sg-bare SSH 同址）+`sg-server` 独立 remote 并存（TMV/TC/TriRLC/TriRMC/TriCode 五仓同形态） | **低值缓办**——前置=统一迁移 job payload remote 名（触敏感面）；冗余现症=拓扑误读混淆面（09-05 拓扑定谳实吃过「同址」亏）但三端平齐在役零实际故障；建议挂「下次触达 payload 的窗口并批」，不值得单独开窗 |
| B2 | E 项 hosts 复审纪律+AUTO-GITHUB 块评估（09-05 转 CAO 面） | docs+memory 全扫零踪迹=**未入册**；admin-fix-log.txt 留有修复实录+AUTO-GITHUB 块现势（raw 单行） | **拆两半**：复审纪律入册=低成本值得办（09-05 已实证 hosts 过期→27 笔积压事故根因，防复发纪律收益实）；AUTO-GITHUB 块自动化评估=不必办（块极小手动可控）；**归属 CAO 面**，非本席实施域 |

## 三、盘面汇总（候 CEO 取舍）

- **真候窗项**=A1-A3 后半+A5（三件套同批及其后继）——立法已把时机钉死在 R 面代码门禁开启窗，现在盘不出新动作，维持挂窗即守约。
- **可低成本前置的两笔**：A3 前半（hook 正身镜像入仓，纯文档面）；B2 前半（hosts 复审纪律入册，CAO 面）。
- **可销账的一笔**：LG-018 cron runbook（已落地候收账）。
- **建议维持候窗/缓办**：A4（P-a 河源面候外部触发）、B1（收敛候并批窗）、A6（trimc 退役随线）。
- **一句话盘面**：LG-017/018 无阻塞在途项、无失联条款——全部余项均挂明确时机锚（R 面门禁窗/敏感面触发条件/CAO 面归属），「现在就盘」的盘面结论=**无需为盘而动，两笔低成本前置+一笔销账是全部可动面**。

## 使用依据

lg017-pre-receive-design-draft.md（09-04）；v21-2-cto-mechanism.md（W36 树 106 行）；mr-worktree-collaboration-protocol.md v2.2 现行文本（§版本沿革 v2.1 五条款）；`git -C <五仓> remote -v` 逐仓实勘（22:4x-22:5x）；`git ls-remote sg-server` 活体（staging 不存在实勘）；TriRMC/scripts/rmc_tick.py:198 直读；ledger-mirror LG-017/018 条+升窗 3 条（L142-157/L978）+L309 trimc 退役依赖；W36/W37 daily-progress（v2.1 立法三节点 done/runbook 383ee3df）；admin-fix-log.txt（hosts 修复实录）；memory 条（R-HY job 9c81c7ec ff-only 迁移链现势）。
