# 非人格类 agent 上线报到制·四席联审底稿（BOD 出）

> sourceOfTruth: 本文件=联审底稿（BOD 集散地规范表述·候四席联审；非制度正身）
> syncMode: static · lastSyncedAt: 见卷尾落款
> 令源: CEO 2026-10-14 13:57 口谕——「让 CPO、CTO、CAO、CHO 联审此方案」

## 一、背景

- BOD 四时点 cron（节拍转报 `9,39`＋信箱巡检 `11,41`）挂 BOD 会话内存，重启即失、非自动挂；
- 原三案（纪律条/载体行/daemon 机械兜底）存档：`../bod-tick/cron-rehook-spec-20261014.md`（wt/board commit 081c11aeb）；
- CEO 审后改向：**报到制**——比原三案更优雅可靠，且可泛化为公司非人格类 agent 的通用行为规范。

## 二、CEO 方案正形（口谕要点·照录规范表述，不加工）

1. 非人格类 agent（如 BOD）**新上线先到 CAO 处报到**——发上线消息给 CAO；
2. 报到约定**写进 `source-agents/board/` 中合适的文件**（board 侧正身三件套：contract / frontmatter / agent-body，落哪件候联审定）；
3. **CAO 根据角色给报到 agent 发其应做的上线工作**（如挂 cron job）——上线工作清单**放入 CAO 的记忆**，置于**前置核查、项目路由位置**，提示必做；
4. **泛化方向**：以后可泛化为公司非人格类 agent 的通用行为规范。

## 三、联审审点（BOD 拟供参考·各席可自提）

- **CAO（方案主责席）**：
  - 报到承接机制形态——记忆/前置核查/项目路由三落点各自怎么放（哪些必做提示、哪些清单承载）；
  - 上线工作清单内容与维护责任（清单权威位在哪、谁更新、怎么随 agent 角色扩展）；
  - 报到消息格式与 CAO 回执形态（报到后 CAO 发什么、agent 怎么确认已领）；
  - 与 CAO 现行机制域（会议制度/治理文档归属/入册链）的衔接。
- **CTO（架构合规面）**：
  - cron session-only 特性与报到时机的匹配（重启后 agent 复活即报到→领工作重挂，闭环是否成立）；
  - `source-agents/board/` 落点文件选择建议（报到约定落 contract / frontmatter / agent-body 哪件）；
  - 原 daemon 机械兜底案（8713 tick 陈旧探测催办）是否保留为候补——报到制覆盖不了的静默死场景；
  - 泛化到非人格类 agent 的技术边界（哪些 agent 适合、registry 型是否在内）。
- **CPO（流程/产品视角）**：
  - 报到制的流程合理性（上线→报到→领单→自检→恢复 的链路是否顺、有无多余环节）；
  - 泛化为通用行为规范的产品面影响（对 13 员工常驻席与非人格机构席的区分是否清晰）。
- **CHO（生命周期/人事面）**：
  - 与岗位启用/五件套增量更新/handoff 流程的衔接（报到制是否并入现有生命周期节点）；
  - 「非人格类 agent」名单边界的归属认定（谁有权定哪些 agent 入报到制范围）。
- **四席共同审点**：
  1. 报到制与原三案关系——取代 / 部分保留（daemon 机械兜底候补条去留）；
  2. 泛化正身落点——纪律册 D 系 / source-agents 通用件 / 两者并（先立后破机制是否适用）；
  3. 报到制闭环里 CAO 不可用时的兜底（CAO 缺席时 agent 报到无应答怎么办）。

## 四、回卷要求

- 卷位：`reports/<seat>-review.md`（本树 reports/ 下）·落树后 commit 锁笔·SendMessage 回 BOD 一行（附 commit hash）；
- 时限：**今日 17:00 前回齐**（快审·方案审非施工审，给意见即可）；
- 联审毕 BOD 汇总呈 CEO 终审，签批后走 COS→CAO 链入册。

## 五、关联件

- 原三案存档：`../bod-tick/cron-rehook-spec-20261014.md`
- board 正身三件套：`TriCompany/source-agents/board/`（board.contract.yaml / agent-frontmatter.agent.md / agent-body.agent.md——2026-10-13 修订施工刚毕，报到约定落点注意与新版衔接）
- D-39 裁决分级 / D-38 本地域分工 / 开工前置核查节（载体行原案所在）

—— 落款（date 现查）: 2026-10-14 13:59:26 +0800
