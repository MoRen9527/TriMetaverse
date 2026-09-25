# 四 daemon 角色矩阵导读（TriMMC / TriMLC / TriRMC / TriRLC）

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/training/four-daemon-matrix-guide.md
- syncMode: source-only
- 事实基线时点（D-28）：2026-09-18——CEO 四 daemon 矩阵定谳 + 命名语源勘正（白皮书修订 1e 口径）
- lastSyncedAt: 2026-09-25（落笔当日活体复验：8711/8713 healthz 双绿，见 §三）
- 维护：RAndDTrainer（小吴）

> 真源顺位：本教程是导读，不是裁决。冲突时以 `docs/三元宇宙架构与模块说明.md`（§4 模块表 / §5 命名治理 / 端口部署表）与 `docs/tmv-whitepaper.md`（§3.1 三层模型 + 附录 B 修订 1d/1e 块）为准。

---

## 一、先看大结果：一张四格表 + 三句话

| 四格 | 面 | 域 | 核心机器 | 端口 | CLI |
| --- | --- | --- | --- | --- | --- |
| **TriMMC** | M 面 | 服务域（sg） | M-SG-47.245.122.61 | 8710 | trimmc chat |
| **TriMLC** | M 面 | 本地域（本机） | TABLET-0BGCRCP5 | 8713 | trimlc chat |
| **TriRMC** | R 面 | 服务域（河源 R-HY） | R-HY-8.155.54.79 | 8710/8711/8712 | trirmc chat（待建） |
| **TriRLC** | R 面 | 本地域（本机） | TABLET-0BGCRCP5 | 8711 | trirlc chat |

三句话记住全图：

1. **四名四角色，非新旧版本、无退役一说**——四个名字同时活着，各占一格。
2. **面 × 域绑定写死**（CEO 定谳）：M/R 是面（元虚拟/现实），服务域/本地域是域；每个 daemon 的格子不可挪。
3. **三对主控对承载全部跨机通信**：TriMMC↔TriMLC（M 面）、TriRMC↔TriRLC（R 面）、TriMMC↔TriRMC（服务域跨面）——对内 healthz 可验（§三）。

---

## 二、命名语源：名字本身就是说明书

拆开读，每个字母位都有确指（CEO 2026-09-18 语源定谳）：

| 字母位 | 含义 | 取值 |
| --- | --- | --- |
| Tri | TriMetaverse 前缀 | 四名共用 |
| 第 1 位 M / R | **M**eta-Virtual（元虚拟面）/ meta-**R**eality（现实面） | 定「面」 |
| 第 2 位（MC 中）M | **M**ain（主控） | 与第 1 位 M 不同义！ |
| C | **C**ontroller | MC = 主控 |
| L | **L**ocal | LC = 本地控制器 |

所以：

- **TriMMC** = 元虚拟面·主控（第二个 M 是 Main）
- **TriMLC** = 元虚拟面·本地控制器
- **TriRMC** = 现实面·主控
- **TriRLC** = 现实面·本地控制器

**易混点**：MMC 里的 M 与 M 面的 M 不是同一个 M——前者是 Main，后者是 Meta-Virtual。历史上曾把第二字母位误读成「M=Machine（服务域机器）」，已被 CEO 勘正（白皮书修订 1e，2026-09-18）：第二位 M=Main、C=Controller，与机器无关。

---

## 三、五分钟自证：最小 MVP

新人不用信任何文档，两条命令当场验证（本机执行）：

```powershell
# 1. 看两个本地 daemon 端口在听
netstat -ano | findstr "8711 8713"    # 应各有一条 127.0.0.1 LISTENING

# 2. 问两个 daemon 各自是谁、对端是谁
curl http://127.0.0.1:8713/healthz
curl http://127.0.0.1:8711/healthz
```

期望读数（2026-09-25 08:29 实测样例，关键字段摘录）：

```json
// 8713 → service:"trimlc", mc_peer:"trimmc", mc_link:"connected"
// 8711 → service:"trirlc", mc_peer:"trirmc", mc_link:"connected"
```

`mc_peer` 就是主控对绑定：8713 认 TriMMC、8711 认 TriRMC，与 §一 四格表逐格对上——面×域绑定写死不是纸面话，是活体可验的运行事实。

---

## 四、逐格职责：两对系统，两种内核策略

四格不是四个同质 replica，是**两对策略相反的系统对**（白皮书 §3.1 三层模型）：

### M 面对子：TriMMC + TriMLC（元虚拟系统最小实现）

- 定位：**宿主可整体替换的成熟虚拟研发环境**——当前宿主为 claude code，未来可整体切到 codex 等而不改系统定义。
- 内核策略：**不自建会话管理与执行内核**。会话、loop、上下文直接用宿主原生能力；元虚拟只做两件事——①把员工定义（合同/五件套）经 FADE 发布线灌入宿主；②把实验成果落盘到元认知仓。
- TriMLC 现役职能：本地宿主激活 + **本地周平面回流自动化宿主＝8713 TriMLC cron**（勘正：周平面回流宿主是 8713，不是 8711——历史误派已废止）。
- TriMMC 演进注：其早期自研运营资产（cron 周平面/五维同步/observability）规划双跑迁入 TriRMC，迁移后收窄为宿主桥主控（架构说明 §4）。

### R 面对子：TriRMC + TriRLC（元现实系统最小实现）

- 定位：**必须自持的生产面**——稳定执行、无人值守、权限审计、跨节点协同。
- 内核策略：与 M 面相反——**共用自研内核 agent-core**，会话、调度、权限、cron、进程监督、审计全在自研代码里，不依赖任何单一宿主。
- TriRLC：本地人机协作的本域主入口（原 TriLC，本机 8711）；TriRMC：现实面主控（河源，CLI 待建）。

### 第三格关系：元认知仓

项目代码仓（本仓及其兄弟仓）是三层中**唯一没有运行时的承重底座**：元虚拟的成果落仓、元现实以 worktree 方式消费仓，双向螺旋每一跳都以仓为唯一中转，留下可审计的 git 痕迹。

一句话串起螺旋链：**元现实（数据与规则）→ 元认知（创新与建模）→ 元虚拟（仿真与试验）→ 回灌元现实（验证与升级）**。

---

## 五、部署拓扑：端口、git 星型与保活

- **端口**见 §一 四格表。本机同机承载双本地核心（8713 M 面 + 8711 R 面）——**两套并行是机制设计（不同面各一套），不是冗余、不是新旧过渡**（白皮书附录 B 修订 1c）。
- **git 星型拓扑**：GitHub ↔ M-SG（唯一中枢）↔ {本机、R-HY、未来任何新机}——所有 git 远端一律指向 M-SG bare，不经直连 GitHub（真源：`docs/github-repo-governance.md`）。
- **服务器正名**：sg＝M 面新加坡机 47.245.122.61；河源＝R 面 cn-heyuan 机 8.155.54.79——说河源=R 面、说 sg=M 面。
- **保活现状**：8713 由 TriMLC-Watchdog 保活；8711 R 面保活机制候建，建成前异常走晨检+人工兜底。
- **k8s 扩展性**：主控对抽象使服务域侧控制器未来可入 k8s 集群（daemon 对模型不变、宿主形态变）；本地域侧随桌面宿主，通信经主控对抽象与算力宿主解耦。

---

## 六、常见误区（本教程核心价值）

| 误区 | 正解 |
| --- | --- |
| TriMLC/TriRLC 是 TriMC/TriLC 的「新版本」，老的会退役 | 四名四角色，非新旧版本、无退役一说（CEO 定谳）。「TriLC 改名 TriRLC」只是同一个 R 面本地控制器的更名 |
| TriMMC 是「TriMC 的新版服务器 runtime」 | TriMMC 由 TriMC 更名而来（同一模块），且定性是元虚拟主控（FADE 灌宿主+落盘），不是自建编排内核 |
| 本机 8711+8713 双 daemon 是冗余或过渡期双跑 | 不同面各一套：8713=M 面本地控制器，8711=R 面本地控制器，并行是机制设计非冗余 |
| 周平面回流跑在 8711 | 本地周平面回流自动化宿主＝8713 TriMLC cron（误派 8711 已废止） |
| MMC 的 M=Machine（服务域机器） | 第 1 位字母定面（M=Meta-Virtual/R=Reality），第 2 位 M=Main——机器含义已被 1e 勘正废除 |
| `../TriLC/`、`../TriMC/` 目录不存在＝模块没了 | 物理目录已随仓改名：TriLC→TriRLC（2026-08-31）、TriMC→TriMMC（2026-09）；兼容路径名保留，CLI bin（如 `trilc`）等兼容面改名随发布分批执行 |

---

## 七、历史演进三波（一分钟版）

| 时点 | 事件 | 对新人的意义 |
| --- | --- | --- |
| 2026-08-21 | 三元宇宙重定义：TriMC→TriMMC、TriLC→TriRLC 更名，新增 TriMLC/TriRMC 两模块（架构说明 V0.5） | 读到 8 月旧文档时按 §5 别名治理换算 |
| 2026-09-17 | CEO 双控制器定性随录：8713/8711 端口对照+各面独立保活入册（白皮书修订 1c）——两套并行属机制设计非冗余 | 别再把双 daemon 当过渡态 |
| 2026-09-18 | CEO 四 daemon 角色矩阵定谳通报+命名语源勘正（修订 1d/1e）：四名四角色、面×域绑定写死、三主控对、k8s 注 | 本文的事实基线时点 |

alias 治理细则（历史名如何换算、哪些路径保留）：`docs/三元宇宙架构与模块说明.md` §5。

---

## 八、学习路径与真源回链

**先读什么、后读什么**：

1. 本文（四格大图 + 自证）→ 2. `docs/三元宇宙架构与模块说明.md` §4/§5 + 端口部署表（模块职责与命名治理正身）→ 3. `docs/tmv-whitepaper.md` §3.1（三层模型与两对系统策略）→ 4. 想看循环怎么转 → [三角优化循环教程](trimc-trilc-devrepo-triangle-loop.md)（dev 仓 × TriRLC × TriMMC 动态循环）→ 5. 想看 git/发布面 → `docs/github-repo-governance.md`。

| 主题 | 真源 |
| --- | --- |
| 四格表/端口表/主控对/命名语源 | `docs/三元宇宙架构与模块说明.md` §4、§5、端口部署表（:119 起） |
| 三层模型与两对系统策略 | `docs/tmv-whitepaper.md` §3.1 + 附录 B 修订 1c/1d/1e |
| git 星型拓扑 | `docs/github-repo-governance.md` |
| 四 daemon 仓源码 | `../TriMMC/`、`../TriRLC/`（README 均在）；`../TriRMC/` |
| 历史名换算 | 架构说明 §5 命名与别名治理 |

---

> 本教程维护：RAndDTrainer（小吴）。更新触发：四 daemon 矩阵、端口、保活或命名治理有新定谳时，由 CEOChiefOfStaff 同步后更新。
