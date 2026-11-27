# 对照卷·任务书拾取机制两代分野（MC 组织机制 vs fade001 代码机制）——报 CTO+CAO 入档

- sourceOfTruth: 本卷（对照正身·BOD 编撰·CEO 2026-11-27 14:3x 令立）
- 令源: CEO 问「TriRMC 和 TriMMC 的挂任务书和自动拾取机制是否同一套代码」→ BOD 实读四仓+sg 活体 → CEO 裁「立对照卷·报 CTO+CAO 入档·需求池记需求·暂时并行·待 TriRMC 上任务书自动拾取成熟·MC 采用它的这套代码机制实现更可靠」
- 时点: 写前现查 2026-11-27T14:39+0800（D-47）

## §一 · 两代机制对照表（实读锚全带）

| 维度 | **第一代·MC 组织机制**（现行） | **第二代·fade001 代码机制**（TriRMC·成熟中） |
|---|---|---|
| 机制性质 | **组织机制**（D-27 树协议·执行层标准） | **程序代码**（2026-11 W47-W48 新写） |
| 流程 | 任务书挂周平面 → face 路由 → **MMC 值席拾取**（人工·按树协议）→ 拆树 → 节点收口 | charter_generator（D-86 五款生成）→ **round_runner 消费侧自动拾取**（缺批不拾取 fail-closed）→ loop 自主迭代 |
| 代码载体 | **无代码**（纪律+值席操作形·TriMMC src 零命中） | TriRMC `src/fade001/` 三件（charter_generator/round_runner/chain_runner） |
| 机位 | sg 值席（M 面 7×24 duty 施工面 /srv/fleet/） | 河源 TriRMC 8710 |
| 批准门 | 纪律面（任务书格式 v1.0.1+「挂任务书须 CAO 批」·2026-11-26 CEO 立） | **代码门**（cao_approval.approved===true·三处 fail-closed：charter_generator 生成侧+round_runner 消费侧+tree_mount_gate 树挂载·今日全落） |
| 现役先例 | 夜航01/批令执行波 | fade-001 进化 loop r37-r48 |
| 成熟度 | 久经现役（组织纪律成熟） | **成熟中**（机制全落·r49 候点火） |

## §二 · FADE-011 定性（顺手勘正·防再混）

- **FADE-011 = 十段全链程序化 driver**（`src/fade/driver.ts`）——**主做记忆/文档同步管线**（FADE 管线：hook 快通道+cron 慢通道·攒批窗周二/周五）——**非任务书拾取机制·非周迁移**；
- **代码同源双部署**：TriMLC（本机 8713·**现役实例**·fade011 cron job）与 TriMMC（sg 8712）的 `fade/` **md5 完全相同**（driver `46d5ccd9`/skill-loader `e95dcc44`）——同代码两副本，sg 副本现无在跑 job（data/ 仅 fade.db·无 cron jobs）。

## §三 · 并行期规则（CEO 14:3x 裁）

1. **暂时并行**：MC 组织机制照旧（sg 值席拾取照 D-27）·fade001 代码机制在 TriRMC 成熟中（r49 起）——**两代并行·互不替代**；
2. **成熟判据候定**（建议·CTO 面）：fade001 拾取连续 N 轮零事故+CAO 批门三处零误拒/漏拒+树协议对表一致性——**判据由 CTO 提案·CEO 批**；
3. **切换目标（CEO 意向）**：待 TriRMC 自动拾取成熟 → **MC 采用这套代码机制**（更可靠·机器可检替代值席人工拾取）；
4. **切换=显性程序**：须走需求池+周日评审（范围变更显性·FADE-001 拆分挂接注先例）·届时 MC 侧部署代码门（CAO 批门随移植走）。

### §三②-CTO · 成熟判据（CTO 提案·2026-11-27·候 CEO 批）

- 出稿：CTO 小狄（m-cto）·应 BOD 14:46 入档请求追加·技术面认领——**第二代正身=fade001 三件**（TriRMC `charter_generator.ts`/`round_runner.ts` + TriCompany `tree_mount_gate.py`·CAO 批门三处 b7565d5/d404335/0122cd0/d270239）
- **如实注（前置缺陷·CTO 自领）**：第二代现**链上不可达**——自动链 `tryCharterHook`（round_runner L777）未传 caoApproval·唯一来源=opinions.json→**每轮「生成→gated→拒」永远挂不上**（d270239 读码实证·派工单只定义「门怎么判」未定义「批从哪来」）。**修前第二代=零挂载**·§一「成熟中（r49 候点火）」须读作「门全落·链未通」。两段式签批通路方案已呈（生成→pending→CAO 就地签→下一拍挂）·候 CEO 定。

| 判据 | 内容 | 读数源 |
|---|---|---|
| **P0 前置** | 签批通路落地（两段式）——不满足不计轮（零样本） | 通路 commit + 首件挂载 |
| **M1** | 连续 **5 轮**零门致事故：误拒致漏执行=0·漏拒致未批挂载=0（任一>0 计数归零重计） | 门日志 code 三值逐轮计数 |
| **M2** | 每轮三处一致性抽验 **7 反例**全过（拒因 code 一致+三要素非空） | 抽验夹具 |
| **M3** | 并行期对表：同轮同输入·一代（人工拾取）vs 二代（代码）结果一致率 **100%**；不一致逐条归因·归因不清不计入连续轮 | 双轨对表卷 |
| **M4** | CAO 抽验：每轮 1-2 条 kind 真实性 **100%** 过 | CAO 抽验记录 |
| **M5** | `tri_source_assertion` 三面齐（生成件 **100%**·doc 须指真源件·CAO 规范 C6） | charter 字段 |

- **5 轮理由**：覆盖 ≥2 次「拒→签→挂」完整周期 + ≥3 次正常挂载（CEO 可调）。
- **切换程序**：M1-M5 齐→周日评审→CEO 批→MC 采用代码机制（显性切换·承 §三④）。
- **口径**：本节=提案·批前不改现口径。

## §四 · 实读锚

| 锚 | 证据 |
|---|---|
| TriRMC fade001 三件 | 本机 `TriRMC/src/fade001/`（charter_generator D-86 头注「缺批不拾取 fail-closed」） |
| TriMMC src 零命中 | 本机仓+sg 活体（`grep -rln 拾取\|拆树\|taskcharter` 全零） |
| MMC/MLC fade 同源 | driver.ts/skill-loader.ts md5 相等（46d5ccd9/e95dcc44） |
| MC 组织机制 | D-27 执行层标准+夜航01 先例（CLAUDE.md M 面路由注） |
| CAO 批门三处 | 今日全落（charter_generator 生成侧/round_runner 消费侧/tree_mount_gate b7565d5·7 passed） |
| FADE-011 定性 | driver.ts 头注「ten-segment full-chain programmatic driver」+FADE 管线架构记忆 |

——BOD 编撰（2026-11-27 14:41）
