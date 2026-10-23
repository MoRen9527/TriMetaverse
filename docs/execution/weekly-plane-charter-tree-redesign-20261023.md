# 周工作平面·任务书·树 三级体系重设计（产品设计稿 V1）

- sourceOfTruth: 本文件（产品设计段正身；定稿后条款沉淀入 TriCompany 协议真源）
- syncMode: manual
- lastSyncedAt: 2026-10-23
- 令源: CEO 2026-10-23 10:34:07 整顿四条令 + 10:48:47 架构勘正与程序先行原则 + 10:54:50「按这个理解出设计稿」
- 设计者: BOD（董事会治理席）·把关: CEO 逐条批
- 实施原则（CEO 定）: 按 FADE 规范以程序和 CLI 形成工作流把控整个进度；执行/检查等固定与规范类操作**程序先行**，程序不可解再升 agent 智能兜底
- 病灶输入: 四病灶实锚（账实脱节 activeTrees=0 vs 实盘 20 棵 / 树散落各周 doneTreesFromPreviousWeek=65 棵堆叠 / 账本当记事本 risks 91 条·carry_over 残留 / 窗段切碎任务）+ 大表刷态滞后族三笔实锚
- 防四类复发: ①树散落各周 ②周平面迁移不彻底 ③任务不连续 ④每次汇报不准确

---

## 一、领域实体与挂接（概念模型）

### 1.1 四个一等实体

| 实体 | 是什么 | 状态机 | 归属（唯一父） |
|---|---|---|---|
| **周平面 WeekPlane** | 一周的经营账本（机器读唯一真源） | active → closed | 无（时间轴顶） |
| **任务书 Charter** | 一件未完成任务的完整单据（叙述+树清单+链+状态） | open → in_progress → done / cancelled / frozen | 恰一个周平面 |
| **树 Tree** | 任务书下的一步施工单元（一树一文件夹） | pending → in_progress → done / blocked | 恰一个任务书 |
| **节点 Node** | 树内一个席位的施工步骤 | pending → in_progress → done | 恰一棵树 |

### 1.2 挂接链（CEO 勘正正形）

**周 → 任务书 → 树 → 节点**，单链两级挂接：

- 树**不直接挂周**（§六十六 勘正：否则周迁移后指针乱指上几周）。
- 任务书挂周：每周账本自含完整任务书清单 = 本周新开 + 上周平移未毕——**新周账本即完整视图，指针不出周**。
- 迁移搬运单位 = **任务书整本**（其下树、节点报告、卷全部随任务书走）。
- 树毕在任务书内记账，不动周账本；**全部树毕 → 任务书毕 → 才从周账本销账**。

### 1.3 树链（CEO 令④）

- 任务书立单时**必须写明参与者链**：`chain: [cos, cpo, cto, fsd, ste, sde, cos]`——cos 起 cos 终。
- 链即派工单：COO 派工照链点名；COS 照链逐点检查执行情况（`plane check` 程序先行）。
- 树级链可细化（树内节点序列即链的具体展开），但必须与任务书链兼容（树链 ⊆ 任务书链）。

---

## 二、文件系统布局（树不散落的物理保证）

```
operating-records/
  2026-W44/                          ← 周目录
    plane.json                       ← 周账本（机器读·唯一真源）
    plane-status.md                  ← plane status 渲染（人读快照）
    bigtable.md                      ← 大表（render 产物·人看只读）
    charters/                        ← 本周全部任务书
      CH-20261023-001-agenda001/
        charter.md                   ← 任务书叙述面（令源/目标/验收）
        reports/                     ← 任务书级卷（毕报/收口卷）
        trees/
          t1-kanjian/                ← 树文件夹（树跟任务书走）
            tree.json                ← 树账（节点/链/状态/串行位）
            node-reports/            ← 节点执行报告
              01-cos-20261023110000.md
              02-cto-20261023143000.md
          t2-zhenggai/
      CH-20260929-001-xxx/           ← 上周平移来的未毕任务书（整本在位）
```

- **决策点 D3（已按 CEO 勘正推荐）**：树物理目录挂 `charters/<任务书>/trees/` 下，**不在周的顶层 trees/ 下**——物理挂接与逻辑挂接一致，散落无处发生。
- **决策点 D4（推荐·物理搬）**：周迁移 = `git mv` 任务书整本目录到新周 `charters/` 下。零指针残留；旧路径引用断链风险以「卷内引用一律带 commit SHA 锚」立规兜住（git log --follow 可溯）。
- 大表 `bigtable.md` 与 `plane-status.md` 均为**渲染产物**（程序从 plane.json 生成），人工只读不改——改状态=改账本再 render。

---

## 三、周账本 plane.json（schema V2）

### 3.1 顶层

```json
{
  "schema": "plane-v2",
  "week": "2026-W44",
  "status": "active",
  "timebox": { "startAt": "...", "endAt": "..." },
  "charters": [ "…见 3.2…" ],
  "carryIn": { "from": "2026-W43", "count": 3, "ids": ["CH-..."] },
  "carryOut": null,
  "closeout": null,
  "meta": { "version": 3, "updatedBy": "plane-cli", "lastUpdated": "…" }
}
```

### 3.2 任务书对象

```json
{
  "id": "CH-20261023-001-agenda001",
  "title": "供应链审计整改",
  "origin": "new",
  "carriedFrom": null,
  "carryCount": 0,
  "status": "in_progress",
  "owner": "cos",
  "chain": ["cos","cpo","cto","fsd","ste","sde","cos"],
  "order": 1,
  "trees": [
    {
      "id": "t1-kanjian",
      "seq": 1,
      "title": "勘验",
      "status": "done",
      "chain": ["cos","cto","cos"],
      "dir": "charters/CH-20261023-001-agenda001/trees/t1-kanjian/",
      "nodes": [
        { "seq": 1, "seat": "cos", "status": "done",
          "report": "node-reports/01-cos-20261023110000.md" },
        { "seq": 2, "seat": "cto", "status": "done",
          "report": "node-reports/02-cto-20261023143000.md" }
      ]
    },
    { "id": "t2-zhenggai", "seq": 2, "title": "整改", "status": "pending", "...": "..." }
  ]
}
```

### 3.3 schema 硬规则（防病灶复发）

1. **杂记禁入账本**：risks/回迁登记/会议纪要等一律出账本，归 `plane-notes.md` 或周目录卷文件——账本只存结构化任务面（根治 risks 91 条记事本形）。
2. **carry 字段结构化**：`carryIn/carryOut` 只存 id 清单+计数；4 周+⚠️ / 8 周+⚠️⚠️ 预警由 `carryCount` 程序判定（沿旧 SOP 预警等级）。
3. **单一写入口**：plane.json 只由 plane-cli 写（人/agent 不手编 JSON）；每写必原子替换+回读断言。
4. **账实一致自检**：`plane check` 比对账本树清单 vs `charters/` 目录实盘，不一致即 FAIL（根治 activeTrees=0 vs 20 棵）。

---

## 四、CLI 命令族（程序先行主面）

工具名暂定 `plane`（候选 wpc / triplane，见 D5）。全命令幂等可重跑，写后自检。

| 命令 | 干什么 | 程序自检 |
|---|---|---|
| `plane init --week 2026-W44 --from 2026-W43` | 建新周骨架+执行迁移 | 见 migrate |
| `plane migrate --from W --to W'` | 迁移：扫上周末毕任务书→整本 git mv 到新周→carryIn/Out 登记 | **对表断言：上周末毕清单 == 新周 carryIn 清单，差一件即 FAIL 不落账**；旧周标记 closed |
| `plane render` | 从账本生成 bigtable.md + plane-status.md | 渲染后账本 hash 不变（只读证明） |
| `charter create --week W --title T --chain …` | 立任务书（账本登记+目录骨架） | id 唯一断言 |
| `charter split --id C --tree "seq,title,chain"…` | 拆树（写串行 seq+树链） | 树链 ⊆ 任务书链断言 |
| `tree start --charter C --tree T` | 树开工 | **串行闸：前 seq 树非 done 即拒开**（防任务不连续） |
| `tree done --charter C --tree T` | 树毕 | 节点全 done+报告齐全断言 |
| `report add --charter C --tree T --node N --seat S --file F` | 节点报告登记（复制/校验落 node-reports/） | 文件存在+命名规范断言 |
| `plane check` | 照链点名：每在役树当前节点、报告缺口、账实比对 | 输出检查单；COS 检查执行情况的工具面 |
| `plane status` | 一口读数：total/open/carried/预警/在役树 | 全部从账本现读（人人同一份=汇报同源） |

### 4.1 agent 兜底位（程序不可解才升）

| 情形 | 处置 |
|---|---|
| 迁移对表 FAIL（数量不符/目录缺） | 升 agent 勘因 → 勘不了升 CEO |
| 任务书去留（继续/冻结/关闭裁决） | agent 呈 BOD/CEO 裁，裁毕程序执行 |
| 链要改/树要拆子树 | agent 判 → 程序改账本 |
| 历史卷归属判读（存量归位） | agent 判读 → CLI 执行归位 |

---

## 五、执行工作流（全链程序介入点）

```
CEO 令
 → COS: charter create（立单·写链）
 → COS/COO: charter split（拆树·串行 seq）
 → 派工（照链点名·树链写在单上）
 → 逐树串行:
     tree start → 节点开工 → 干活 → report add（节点执行报告落盘）
     → 节点毕 → 下节点 → … → tree done（报告齐才放行）
 → 下一棵树（串行闸程序强制）
 → 全树毕 → charter done → plane render（大表自动消账）
 → 周日: plane migrate（未毕任务书整本平移·对表断言）
 → plane render（新周大表·自含完整视图）
```

- **中断恢复**：任一席/任一窗中断后，读树账 `tree.json` nodes[] 即知断点（哪个节点 done、哪个 in_progress、报告在哪）——协议 V0.6 checkpoint 制度落成程序强制。
- **排窗与段取消**：无「独占窗/段1段2」编排；唯一序列=树的串行 seq。并发约束降级为「同时 in_progress 的树=1/任务书」（多任务书可并行，任务书内串行）。

---

## 六、防四类复发映射（FADE 查缺补漏）

| 复发问题 | 机制 |
|---|---|
| ①树散落各周 | 树物理挂 charter 下（D3）+迁移整本平移（D4 物理搬·零指针） |
| ②迁移不彻底 | migrate 对表断言 FAIL 不落账 + plane check 账实比对 + 旧周 closed 标记 |
| ③任务不连续 | 串行闸 + 节点报告强制（tree done 断言）+ 树账断点可续 |
| ④汇报不准确 | 账本唯一真源 + 大表/读数全是 render 产物（人人同源）+ check 现勘 |

---

## 七、存量整顿（W40-W43 散树一次性归位）

1. **盘点**：CLI 扫四周 trees/ 全目录 → 产出「树 × 周 × 卷证据」清单（程序先行）。
2. **归组**：按任务书归组映射——历史卷归属判读 agent 兜底（程序不可解），映射表呈 CEO 抽查。
3. **归位**：CLI 按映射执行 git mv 到对应 charter 目录 + 账本回填 → `plane check` 全绿收口。
4. 已销账/已毕任务书的树归档位：`operating-records/archive/charters/`（或原周 closed 归档，见 D6）。

---

## 八、与现行制度衔接（定稿后改哪些真源）

| 文件 | 改动 |
|---|---|
| weekly-plane-shift-sop.md | V2：人工流程改 plane migrate CLI 流程 |
| dynamic-task-tree-protocol.md（TriCompany 真源） | V0.7：两级挂接+树链必填+节点报告程序强制 |
| onboard-work-registry.md | 树链检查节（plane check 为 COS 检查正形） |
| 大表惯例 | task-inventory 手工制废止 → bigtable.md render 产物制 |
| 窗账本 window-ledger.md | 排窗段制废止随四条令② |

---

## 九、实施分段（候 CEO 裁）

| 段 | 活 | 参与者链（自示例） |
|---|---|---|
| S1 | 设计稿把关定稿（本轮） | cos→CEO→cos |
| S2 | 存量归位（§七·四周散树清零） | cos→bod→agent 判读→sde/cto 执行→ste 验→cos |
| S3 | CLI 实现（plane 命令族） | cos→cto→fsd→ste→sde→cos |
| S4 | 首迁实例（W43→W44 用新制真迁+大表首 render） | cos→coo→cos 值席→ste 验→cos |
| S5 | 制度真源回写（§八）+ 值席培训 | cos→cao→cho→cos |

---

## 十、验收门（S4 出口）

1. W43→W44 首迁：migrate 对表断言全绿，零人工修账。
2. 散树清零：W40-W43 顶层 trees/ 无残留树目录（全归 charter 或 archive）。
3. 一致性抽验：bigtable.md 渲染内容与 plane.json 现读一致（三抽三中）。
4. 中断恢复实测：任一在役树人为中断→读树账即续（§五断点恢复）。
5. CEO 走查过关：大表人看体验+账本机器读体验双确认。

---

## 十一、候 CEO 把关决策点

| # | 决策点 | 候选 | 推荐 |
|---|---|---|---|
| D1 | 账本文件名 | a) `plane.json` 新名 b) 沿用 `OP-YYYYMM-Wnn-001.json` | **a**（新制新名，旧 OP 归档只读；工具断链风险低——CLI 一并新写） |
| D2 | 任务书 ID 形态 | a) `CH-YYYYMMDD-NNN-<slug>` b) 沿用现命名（AGENDA-xxx/task-charter-*） | **a**（现有名作 title 别名字段保留） |
| D3 | 树物理位置 | a) charters/<任务书>/trees/（物理+逻辑一致）b) 周顶层 trees/ 仅账本逻辑挂 charter | **a**（按 CEO 勘正「树跟任务书走」） |
| D4 | 迁移方式 | a) 物理搬（git mv 任务书整本）b) 留原位+指针 | **a**（零指针残留；引用立规=SHA 锚） |
| D5 | CLI 工具栈与名 | a) node·`plane` b) python·`wpc` c) 其他 | **a**（与 TriRLC/TriMLC 同栈，本机 node 3.12 已在役） |
| D6 | 首迁实例 | a) W42→W43 干跑复盘 b) W43→W44 真迁 c) 先干跑后真迁 | **c**（干跑验程序·真迁验制度） |
| D7 | 已毕任务书归档位 | a) operating-records/archive/charters/ b) 留发生周 closed | **a**（集中归档·四周散树有统一去处；原周留 closed 指针行） |
| D8 | 多任务书并行度 | a) 任意并行 b) 上限 2-3 in_progress | **b**（防回到全面铺开·上下文涣散） |
