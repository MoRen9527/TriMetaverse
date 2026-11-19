# fade-001 进化流程图（loop+fade+7席联审+flag 三态状态机）

- sourceOfTruth: 本卷（BOD 集散绘图·CEO 定谳机制可视化）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: CEO 口谕 2026-11-18（分数结构两裁 14:55→notice-180 / 无头勘检 13:59→notice-181 / 概念勘正 14:21→notice-182 / flag 三态定谳 14:36→notice-183）+绘图令 14:42:16+0800
- 伴随件: `fade001-loop-flag-evolution-flowchart.html`（浏览器直开图纸版·双主题）

## 图一 · 进化 loop 主流程（debug / test / prod 三路）

```mermaid
flowchart TD
  T(["周平面迁移触发"]) --> M{"进化 flag"}
  M -->|prod 生产模式| SHIP["prod 生产轮：十阶段单轮直走<br/>（无进化 loop）→ 周迁移交付"]
  M -->|"debug / test 进化模式"| R["登记 run_id · run_dir"]

  subgraph TEN["fade-001 十阶段"]
    direction TB
    Q["Qualify 预检"] --> P["Plan Skill · 规划卷"]
    P --> D["DCE · 确定性执行周迁移"]
    D --> V["Verify 验证"]
    V --> S1["Score CLI · 机判"]
    S1 --> S2["Score Skill · 评卷"]
    S2 --> S3["Close Skill · 终判"]
    S3 --> S4["Close CLI 收口"]
  end
  R --> Q

  subgraph JR["loop 尾段 · 7席联审（无头 · 程序闭环）"]
    direction TB
    JV["convene 召集 7 席<br/>dsh headless spawn"] --> AG["aggregate 聚合<br/>每席 100 制打分 → 均分＋改善意见"]
  end
  S4 --> JV

  AG --> DEC{"联审均分 > 95 ?"}
  DEC -->|"是"| EXIT(["跳出进化 loop"])
  DEC -->|"否"| F{"flag"}
  F -->|debug| CEO["联审停 · 上送 CEO 呈批<br/>CEO 批意见融合 7 席改善意见"]
  CEO --> CD{"CEO 裁"}
  CD -->|"退出"| EXIT
  CD -->|"进下一轮"| NX["loop 下一轮<br/>（8 轮上限熔断）"]
  F -->|test| NX
  NX -.->|"未达上限"| R
  NX -.->|"达 8 轮上限"| FUSE(["熔断停 · 候 CEO"])
  EXIT --> FIN["进化 ok · flag→prod · 关进化"]
  FIN -.-> T
```

## 图二 · flag 生命周期（切换权 = CEO 令）

```mermaid
stateDiagram-v2
  [*] --> debug: fade 不成熟 · 人工辅助开发（联审停 · CEO 呈批）
  debug --> test: fade-001 成熟 · CEO 令切换（无 CEO 自进化 · 8 轮上限）
  test --> prod: 进化 ok · 分数 > 95 关进化
  prod --> test: 非重大变更需进化（适配毕 > 95 关进化回 prod）
  prod --> debug: 重大变更（CEO 参与把控进化）
  prod --> [*]: 用于生产 · 周工作平面迁移
```

## 参数卡

| 面 | 定谳 |
|---|---|
| 卷面分数 | 100 制＝客观题 65＋主观题 35（比例不合理 COS 代裁改定呈报） |
| 联审判据 | 7 席各 100 制打分取均分，>95 跳出 loop（边界 ≥95 COS 勘定备案） |
| 改善意见 | 双 topic 必付＋三件套（rationale/evidence_ref/check_time），缺=fail-closed；CEO 批意见融合面在 debug 态 |
| 保险丝 | test 态 8 轮上限熔断候 CEO |
| 权属 | flag 三态切换权=CEO 令（权属不变·notice-182 G4 承） |
| 现役映射 | r1 案形态（converge→候 CEO 终认→意见融合裁进/出）≈debug 态现行实例（勘定归 COS 规划卷呈报） |

## 终端 ASCII 简版

```
                        ┌─────────────────────────────────────────┐
                        │  flag 状态机（切换权 = CEO 令）          │
                        │                                         │
                        │  [debug]──成熟·CEO令──>[test]──进化ok──>[prod]
                        │     ↑                      │              │        │
                        │     └──重大变更────────────┘              │        │
                        │                非重大变更(适配毕>95)↺回prod │        │
                        └─────────────────────────────────────────┘

  周迁移触发
     │
     ├─ flag=prod ──> 十阶段单轮直走 ──> 周迁移交付（无进化 loop）
     │
     └─ flag=debug/test ──> 进化 loop 一轮：
            fade-001 十阶段
            (触发→登记→Qualify→Plan Skill→DCE→Verify→Score CLI
             →Score Skill→Close Skill→Close CLI)
                 │
                 ▼
            7席联审尾段（无头·程序闭环）
            convene(dsh headless)→每席100制打分→aggregate(均分+改善意见)
                 │
                 ▼
            均分 > 95 ? ──是──> 跳出 loop ──> flag→prod 关进化
                 │否
                 ├─ debug: 联审停→上送CEO呈批→批意见融合7席改善意见→CEO裁进/出
                 └─ test : 直进下一轮（8轮上限熔断候CEO）
                        │
                        └──> 回到下一轮 fade-001
```

## 图三 · 程序控制面运行图（2026-11-19 19:52 CEO 双裁后的应然运行态）

- 令源: CEO 口谕 2026-11-19 19:52:52+0800（裁 a「停手工判卷·评卷段程序化重跑」批＋「轮间编排收归程序面」批＋运行图更新令）
- 本图=图一机制定谳之上的**控制权归属图**：谁驱动哪个环节。图一/图二机制不变，变的是控制面。

```mermaid
flowchart TD
  CEO2["CEO 裁令<br/>（进轮/停/融合裁）"] -->|notice 经 COS 流转| V2["值席 COS · 监督面<br/>写控制指令 · 不手动起跑轮"]

  subgraph CTRL["程序控制面（轮间编排收归后）"]
    RN["Runner 程序<br/>轮间编排驱动"]
    ST["run 状态机<br/>stage 逐段记录 · fail-closed"]
  end
  V2 -->|"控制指令入队<br/>程序消费"| RN

  RN -->|"起跑 / 失败段重跑"| LOOP["fade-001 十阶段 + 7席联审<br/>段内全程序化 spawn（notice-198 形）"]
  LOOP -->|"段完成 · 落卷真值"| ST
  LOOP -->|"spawn 失败 rc≠0"| ERR["段报错停 · 错误冒泡<br/>禁人肉接管（人工判卷路径废止 ✕）"]
  ERR -->|"监督面读到错误报文"| FIX["修供给 / 修程序<br/>（值席 r114 节律 + BOD 拍读监督 · 施工归域）"]
  FIX -->|"修复毕 · 重跑指令"| RN

  ST -->|"全段绿"| DEC2{"联审均分 > 95 ?"}
  DEC2 -->|"否 · 融合改善意见"| CEO2
  DEC2 -->|"是"| EXIT2(["跳出 loop · flag→prod 关进化"])
```

### 控制面对照表（改前现病 → 改后应然）

| 面 | 改前（ns8 实录现病） | 改后（本图应然·CEO 19:52 双裁） |
| --- | --- | --- |
| 轮间推进 | runner 11-15 capped 后=值席 agent 手动起跑每轮 | 程序面 runner/脚本化轮推进驱动（「收归程序面」裁） |
| 段内 spawn 失败 | 值席域裁转人工判卷兜底（ns8 2.5h 在途） | 段报错停 fail-closed·错误冒泡→修供给→**程序重跑该段** |
| 人工判卷 | ns2 先例·ns8 复用 | **废止 ✕**（禁人肉接管段内工作·本款即时生效） |
| agent 角色 | 段内接管＋轮间起跑 | 纯监督面（r114 节律报/拍读数/催办）·执行面零触 |
| CEO 裁令消费 | notice→值席手动起跑 | notice→控制指令入队→**程序消费** |

—— BOD（集散绘图·锚笔在案至第 185 轮）·落卷时戳锚=commit %cI（零手打·D-47 零占位）
