# 周工作平面·任务书·树 三级体系重设计（产品设计稿 V3·整改版）

- sourceOfTruth: 本文件（产品设计段正身；定稿后条款沉淀入 TriCompany 协议真源）
- syncMode: manual
- lastSyncedAt: 2026-10-23
- 令源: CEO 2026-10-23 10:34:07 四条令 + 10:48:47 架构勘正·程序先行 + 10:54:50 出稿令 + 11:30:56 D1-D8 批 + 13:45:56 四条修订与留痕之问（本 V3 整改依据）
- 修订记录: V1=初稿（bc844154b）；V2=D1-D8 整改（d4db35ab）；V3=CEO 13:45:56 修订——D1 周形确认、D2 助读段回归、D5 命令名 wp/weekplane、大表沿用 task-inventory-日期.md 传统名、新增留痕三层设计（§2.1·答「git mv 旧周怎么留痕」）、迁移物清单三类含周级表（company-demand/daily-progress 等）；**V3 定稿通过（CEO 18:36:43）**；V3.1=工作流讨论定谳（CEO 19:09/19:18）——触发起点=wp charter-create 登记成功（§五·甲）、FADE 实例拆立两条独立实例 011/012 零共用耦合（§五·乙·一实例一固化流程·甲案升级沿用因耦合度高被否）；**V3.2=树链勘正（CEO 21:01:31）——charter 层 chain 字段改 roles（团队名单·COO 定组队·无序·任务书整体不走树不走链）、树层改任务树 sequence 节点序列（cos 开树 cos 收口·首尾必 cos 程序断言·干活席 ⊆ charter roles）、COS 盯序照树逐位检查完成度/断点故障恢复（§1.3 重构+§四命令面+§五乙+§八同步）**；**V3.3=实施分段表列勘正（CEO 21:40/21:43 两步）——列名「树序列示例」→「参与 roles 示例」→「roles 组合示例」（§九 规划层尚未拆树）；列值由箭头单向序列改 roles 无序组合（正式名单立单时 COO 定·正式 sequence 拆树时程序断言定形·表下注）**
- 设计者: BOD（董事会治理席）·把关: CEO 逐条批
- 实施原则（CEO 定）: 按 FADE 规范以程序和 CLI 形成工作流把控整个进度；执行/检查等固定与规范类操作**程序先行**，程序不可解再升 agent 智能兜底
- 病灶输入: 四病灶实锚 + 大表刷态滞后族三笔实锚
- 防四类复发: ①树散落各周 ②周平面迁移不彻底 ③任务不连续 ④每次汇报不准确

---

## 一、领域实体与挂接（概念模型）

### 1.1 四个一等实体

| 实体 | 是什么 | 状态机 | 归属（唯一父） |
|---|---|---|---|
| **周平面 WeekPlane** | 一周的经营账本（机器读唯一真源） | active → inactive（D4） | 无（时间轴顶） |
| **任务书 Charter** | 一件未完成任务的完整单据（叙述+团队名单 roles+树清单+状态） | open → in_progress → done / cancelled / frozen | 恰一个周平面 |
| **树 Tree** | 任务书下的一步施工单元（一树一文件夹） | pending → in_progress → done / blocked | 恰一个任务书 |
| **节点 Node** | 树内一个席位的施工步骤 | pending → in_progress → done | 恰一棵树 |

### 1.2 挂接链（CEO 勘正正形）

**周 → 任务书 → 树 → 节点**，单链两级挂接：

- 树**不直接挂周**（§六十六 勘正：否则周迁移后指针乱指上几周）。
- 任务书挂周：每周账本自含完整任务书清单 = 本周新开 + 上周平移未毕——**新周账本即完整视图，指针不出周**。
- 迁移搬运单位 = **任务书整本**（其下树、节点报告、卷全部随任务书走）。
- 树毕在任务书内记账，不动周账本；**全部树毕 → 任务书毕 → 才从周账本销账**。
- **周状态机（D4 批）**：全库同时至多一个 `active` 周；已平移的周降 `inactive` 留档只读。**「只查 active 即知现役周工作平面在哪」**。

### 1.3 团队名单与任务树（CEO 令④·2026-10-23 21:01 勘正）

- 任务书立单时**必须写明团队名单**：`roles: [cos, cpo, cto, fsd, ste, sde]`（**COO 定组队**——定哪些人参与）。名单无序，**不设整体链**：任务书整体不走树不走链。
- **任务树才有序**：每棵任务树节点序列 **cos 开树、cos 收口**（`sequence` 首尾必 cos，程序断言）；树内干活席 ⊆ 任务书 roles（断言）。
- COS 盯参与顺序：照树序列逐位派工、逐位检查完成度（`wp check` 程序先行），断点即故障恢复锚。

### 1.4 任务书排序与优先级（D8 批）

- 任务书**不设并行上限**。
- 排序规则：`order` 字段定全局顺序；**高优先级（priority: high）任务书排在低优先级之前被拆树**；未设优先级的按默认顺序（order 递增）排好。
- 拆树与树开工一律按此全局顺序推进（`wp charter-split` / `wp tree-start` 程序按序校验）。

---

## 二、文件系统布局（树不散落的物理保证）

```
operating-records/
  2026-W44/                          ← 周目录
    wp-2026-W44.json                 ← 周账本（机器读·唯一真源·D1 批周形）
    plane-status.md                  ← wp status 渲染（人读快照）
    task-inventory-20261023.md       ← 大表（render 产物·人看只读·沿用传统名）
    company-demand-pool.md           ← 需求池（滚动平移·§2.2）
    daily-progress.md                ← 周日志（快照留档+新周新建·§2.2）
    plane-shift-log.md               ← 迁移留痕卷（migrate 写·§2.1）
    charters/                        ← 本周全部任务书
      CH-20261023-001-agenda001/     ← ID=CH-日期-序号-助读段（D2 V3 修订）
        charter.md                   ← 任务书叙述面（令源/目标/验收）
        reports/                     ← 任务书级卷（毕报/收口卷）
        trees/
          t1-kanjian/                ← 树文件夹（树跟任务书走·D3 批）
            tree.json                ← 树账（节点/序列/状态/串行位）
            node-reports/            ← 节点执行报告
              01-cos-20261023110000.md
              02-cto-20261023143000.md
          t2-zhenggai/
      CH-20260929-001-xxx/           ← 上周平移来的未毕任务书（整本在位）
  archive/
    charters/
      CH-20260812-003-xxx/           ← 已毕任务书归档（D7 批）
        archive-meta.json            ← originWeek / closeWeek（起止周可查）
```

### 2.1 留痕三层（答 CEO 13:45:56 之问：git mv 旧周文件怎么留痕）

**git mv 不删任何历史**——搬走的只是「文件现在住哪」，历史三层全在：

| 层 | 留什么 | 怎么查 |
|---|---|---|
| ①**旧周账本快照**（最重要） | 迁移时旧周 `wp-2026-W40.json` 降 inactive 但**一字不改原样保留**——charter 清单、树状态、节点报告清单全在，=「那周发生了什么」的完整时刻快照 | 直接读旧周 wp |
| ②**迁移留痕卷** | migrate 执行时在旧周目录写 `plane-shift-log.md`：迁出清单（哪些 charter→迁往哪周）+迁入清单+执行时点+对表断言读数——人开旧周目录一眼看到「本周末毕任务书已迁往 W41」 | 开旧周目录读卷 |
| ③**git 历史** | git mv 保留全部历史——`git log --follow <新路径>` 可溯文件一生全部提交；卷内引用一律带 commit SHA 锚（立规），SHA 永可达 | git log --follow / SHA 锚 |

**归档同构**（答「归档是否影响开始/结束/过程周留痕」）：已毕任务书搬进 archive/ 时，archive-meta.json 记 originWeek+closeWeek；且**每个相关周（开始周/平移过的中间周/结束周）的 wp 账本里都保留该 charter 的当时状态记录**（账本永不搬改，只有 charter 目录搬家）——**账本留痕、目录搬家**：查任何一周=读那本 inactive wp，当时全部 charter 与状态俱在。

### 2.2 迁移物清单（CEO 13:45:56 增补：周级表纳入迁移管理）

migrate 管的完整清单，三类：

| 类 | 物 | 迁移方式 |
|---|---|---|
| **整本平移** | 未毕任务书整本（charters/ 下） | git mv 整本目录 |
| **滚动平移** | company-demand-pool.md（未消化需求段平移·已消化留原周）；unresolved-items.md（active/frozen 平移·done 关闭留原周——沿旧 SOP carry-over 逻辑） | 程序拆段平移+原周留全量快照 |
| **快照新建** | daily-progress.md（旧周原样留档=发生周日志快照·新周新建空文件）；scoring-ledger 等结算类周表（留发生周·新周按需新建） | 原周留档+新周新建+wp carryIn 登记 |

- 周级表逐项列入 wp 账本 `planeFiles` 段（各自 status：carried/snapshotted/new）——迁移是否彻底程序可断言。

---

## 三、周账本 wp-*.json（schema V2）

### 3.1 顶层

```json
{
  "schema": "wp-v2",
  "week": "2026-W44",
  "status": "active",
  "timebox": { "startAt": "...", "endAt": "..." },
  "charters": [ "…见 3.2…" ],
  "planeFiles": { "company-demand-pool": "carried", "daily-progress": "new", "...": "..." },
  "carryIn": { "from": "2026-W43", "count": 3, "ids": ["CH-..."] },
  "carryOut": null,
  "closeout": null,
  "meta": { "version": 3, "updatedBy": "wp-cli", "lastUpdated": "…" }
}
```

- `status`: `active`（现役·全库唯一）/ `inactive`（已平移留档·只读）。`wp status` / `wp check` 默认只对 active 周操作。

### 3.2 任务书对象

```json
{
  "id": "CH-20261023-001-agenda001",
  "title": "供应链审计整改（AGENDA-001）",
  "origin": "new",
  "carriedFrom": null,
  "carryCount": 0,
  "status": "in_progress",
  "priority": null,
  "order": 1,
  "owner": "cos",
  "roles": ["cos","cpo","cto","fsd","ste","sde"],
  "trees": [
    {
      "id": "t1-kanjian",
      "seq": 1,
      "title": "勘验",
      "status": "done",
      "sequence": ["cos","cto","cos"],
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

- **ID 正形（D2·V3 修订）**：`CH-YYYYMMDD-NNN-<助读段>`——CEO 13:45:56 批助读段回归；助读段=小写短词（slug），仅助读不改唯一性（唯一性锚=CH-日期-序号）。

### 3.3 schema 硬规则（防病灶复发）

1. **杂记禁入账本**：risks/回迁登记/会议纪要等一律出账本，归 `plane-notes.md` 或周目录卷文件。
2. **carry 字段结构化**：`carryIn/carryOut` 只存 id 清单+计数；4 周+⚠️ / 8 周+⚠️⚠️ 预警由 `carryCount` 程序判定。
3. **单一写入口**：wp-*.json 只由 wp-cli（python）写；每写必原子替换+回读断言。
4. **账实一致自检**：`wp check` 比对账本树清单 vs `charters/` 目录实盘，不一致即 FAIL。
5. **inactive 账本禁改**：已平移周账本只读（留痕三层之①的保证）。

---

## 四、CLI 命令族（程序先行主面·D5 批 python 实现）

工具栈 **python**（本机解释器正形=`python` 3.12；`python3` 是 WindowsApps 存根禁用）。**命令名=`wp`（weekplane 为全名别名）**——D5 V3 修订。全命令幂等可重跑，写后自检。

| 命令 | 干什么 | 程序自检 |
|---|---|---|
| `wp init --week 2026-W44 --from 2026-W43` | 建新周骨架+执行迁移 | 见 migrate |
| `wp migrate --from W --to W'` | 迁移：§2.2 三类清单全跑（任务书整本 git mv+周级表滚动/快照+carryIn/Out 登记+旧周降 inactive+旧周写 plane-shift-log.md） | **对表断言：上周末毕清单==新周 carryIn 清单，差一件即 FAIL 不落账**；planeFiles 状态断言；原周 status=inactive 落定 |
| `wp render` | 从账本生成 task-inventory-日期.md（大表）+ plane-status.md | 渲染后账本 hash 不变（只读证明） |
| `wp charter-create --week W --title T --slug S --roles … [--priority high]` | 立任务书（ID=CH-日期-序号-助读段·写团队名单） | id 唯一断言；roles 非空含 cos |
| `wp charter-split --id C --tree "seq,title,sequence"…` | 拆树（写串行 seq+任务树节点序列·按 D8 全局顺序） | 序列首尾=cos 断言；干活席 ⊆ charter roles 断言；顺序断言 |
| `wp tree-start --charter C --tree T` | 树开工 | **串行闸：前 seq 树非 done 即拒开**；全局顺序闸 |
| `wp tree-done --charter C --tree T` | 树毕 | 节点全 done+报告齐全断言 |
| `wp report-add --charter C --tree T --node N --seat S --file F` | 节点报告登记 | 文件存在+命名规范断言 |
| `wp check` | 照树序点名：每在役树当前节点、报告缺口、账实比对 | 输出检查单（COS 检查工具面） |
| `wp status` | 一口读数：active 周定位+total/open/carried/预警/在役树 | 按 status=active 定位现役周 |

### 4.1 agent 兜底位（程序不可解才升）

| 情形 | 处置 |
|---|---|
| 迁移对表 FAIL（数量不符/目录缺） | 升 agent 勘因 → 勘不了升 CEO |
| 任务书去留（继续/冻结/关闭裁决） | agent 呈 BOD/CEO 裁，裁毕程序执行 |
| 名单要改/树要拆子树 | agent 判 → 程序改账本 |
| 历史卷归属判读（存量归位·W40 起逐周整理） | agent 判读 → CLI 执行归位 |

---

## 五、执行工作流（FADE 实例挂接·全流程程序介入点）

### 五·甲 FADE 实例挂接（CEO 19:09/19:18 定谳）

**一实例一固化流程**——三级体系是共用底座（wp 账本+wp CLI 工具族），底座上跑**两条各自独立的固化流程，各挂各的实例号**：

| 实例号 | 固化流程 | 骨架 | 与旧实例关系 |
|---|---|---|---|
| **FADE-011** | 周平面迁移（wp migrate 流程） | 对表断言→物理搬→降 inactive→留痕三层→render | 新立·旧 FADE-001 现役任务跑完自然退役·无继承包袱 |
| **FADE-012** | 计划任务自动拾取（charter 流程） | 铸单登记→拆树注册→挂平面→自动拾取→自治执行→收口回执 | 新立·旧 FADE-006 同上退役 |

- 两实例**各自十段工件、各自试卷、各自评分**；共用面仅 wp CLI 工具族（工具级复用，非流程耦合）。
- 编号裁录：甲案（001/006 升级沿用）因耦合度高被否（CEO 19:18：011 若作共用模块，将来周报相关实例都要对接、通用性未证、历史包袱重）；乙案（拆立两独立实例）定。

### 五·乙 派单工作流（FADE-012·触发起点 CEO 19:09 定谳）

**触发起点 = `wp charter-create` 登记成功那一刻**（FADE 协议口径：十段自事件触发/登记起算；CEO 批与 BOD 转达=前置输入段，不计段但必留归因锚）：

```
[前置输入段·不计段·必留归因锚]
CEO 批令（归因锚①: 批文时点）
 → BOD 转达（归因锚②: 审计卷 §NN 锚）
[触发段·十段起算]
 → COS 收令 → 第一动作 wp charter-create（程序登记=触发完成）
    · charter.origin 必录: 令源时点+批文锚+转达卷锚（归因链进账本）
    · 判定机械可验: 账本有此 charter 且 origin 齐=已触发；无=未触发·零争议
 → COS/COO: wp charter-split（拆树·串行 seq·按 D8 全局顺序=高优先级在前）
 → 派工（照树序点名·树序列写在单上）
 → 逐树串行:
     wp tree-start → 节点开工 → 干活 → wp report-add（节点执行报告落盘）
     → 节点毕 → 下节点 → … → wp tree-done（报告齐才放行）
 → 下一棵树（串行闸程序强制）→ 全树毕 → charter done
 → wp render（大表 task-inventory 自动消账）
```

- **中断恢复**：读树账 `tree.json` nodes[] 即知断点（哪个节点 done、哪个 in_progress、报告在哪）。
- **排窗与段取消**：唯一序列=任务书全局顺序（D8）内的树串行 seq。任务书间不设上限并行，任务书内树严格串行。

### 五·丙 周平面迁移工作流（FADE-011·独立成节）

```
[前置] 周日 23:50 cron（TriRMC 执行点）或 CEO/COO 手动令
[触发] wp migrate 启动·对表断言通过=触发确认（十段起算）
 → ①对表断言: 上周末毕清单 == 新周 carryIn 清单（差一件即 FAIL 不落账·agent 兜底勘因）
 → ②物理搬: 未毕 charter 整本 git mv 至新周（§2.2 三类清单·含周级表）
 → ③降激活: 旧周 wp 账本置 inactive（快照一字不改=时刻留痕）
 → ④留痕: plane-shift-log.md 迁移卷（迁出迁入清单+时点+断言读数）
 → ⑤新周 render: wp-新周.json + task-inventory 自含完整视图
 → wp check 账实比对收口
```

- 迁移链首迁实例=M1-M5（§七·D6 批）；M4 干跑=W42→W43 dry-run 验程序。

---

## 六、防四类复发映射（FADE 查缺补漏）

| 复发问题 | 机制 |
|---|---|
| ①树散落各周 | 树物理挂 charter 下（D3）+迁移整本物理搬+原周降 inactive（D4·零指针） |
| ②迁移不彻底 | migrate 对表断言 FAIL 不落账 + wp check 账实比对 + planeFiles 状态断言 + 「只查 active」定位 + shift log 留痕卷 |
| ③任务不连续 | 串行闸 + 节点报告强制（tree-done 断言）+ 树账断点可续 |
| ④汇报不准确 | 账本唯一真源 + 大表/读数全是 render 产物（人人同源）+ check 现勘 |
| （附）历史留痕 | 留痕三层（§2.1）：inactive 账本快照+shift log+git --follow·归档=archive-meta+各周账本 closed 记录 |

---

## 七、迁移实例链（D6 批·存量整顿与程序验证合一）

CEO 批正形：**W40→W41→W42 逐周整理，整理完 W42→W43 干跑验程序，最后 W43→W44 真迁**。

| 步 | 活 | 性质 |
|---|---|---|
| M1 | W40 账本 V2 化：散树归组 charter（agent 判读映射表→CLI 归位→wp-2026-W40.json 重构）+周级表归类（§2.2 三类） | 存量整顿+程序实战① |
| M2 | `wp migrate --from W40 --to W41`（W41 同法先 V2 化） | 逐周真迁·对表断言每步验程序 |
| M3 | `wp migrate --from W41 --to W42`（W42 同法先 V2 化） | 逐周真迁 |
| M4 | `wp migrate --from W42 --to W43 --dry-run` | **干跑验程序**（对表 vs 人工现勘） |
| M5 | `wp migrate --from W43 --to W44` | **真迁**（新制首迁·大表 task-inventory 首 render） |

- 每步迁移=一次程序验证：对表断言 FAIL 即停，升 agent 勘因。
- W40-W42 各周 V2 化时的散树归组映射表呈 CEO 抽查后再执行。
- 干跑只输出将执行动作不写入；人工比对一致才放行真迁。

---

## 八、与现行制度衔接（定稿后改哪些真源）

| 文件 | 改动 |
|---|---|
| weekly-plane-shift-sop.md | V2：人工流程改 wp migrate CLI 流程（含 D6 迁移链+§2.2 三类清单配方） |
| dynamic-task-tree-protocol.md（TriCompany 真源） | V0.7：两级挂接+树序列必填（首尾 cos）+节点报告程序强制+周状态机 active/inactive+留痕三层 |
| onboard-work-registry.md | 树序检查节（wp check 为 COS 检查正形） |
| 大表惯例 | task-inventory 手工刷态废止 → task-inventory-日期.md render 产物制（**名沿用·制更新**） |
| 窗账本 window-ledger.md | 排窗段制废止随四条令② |
| **fade-registry.md（TriCompany 真源）** | **新立 FADE-011（周平面迁移）/FADE-012（自动拾取）两条独立实例登记（§五·甲）·旧 FADE-001/006 标注退役路径（现役任务跑完自然退役·评分历史不追改）** |

---

## 九、实施分段（候 CEO 重审确认）

| 段 | 活 | roles 组合示例 |
|---|---|---|
| S1 | 设计稿重审定稿（本轮 V3 候审） | cos、CEO |
| S2 | wp-cli 骨架（python·migrate/render/check/status 最小集） | cos、cto、fsd、ste |
| S3 | 迁移链 M1-M3（W40→W41→W42 逐周整理+真迁） | cos、agent 判读、fsd/sde、ste |
| S4 | M4 干跑（W42→W43 dry-run 对表）+ M5 真迁（W43→W44） | cos、coo、ste |
| S5 | 制度真源回写（§八）+ 值席培训 | cos、cao、cho |

> 注（CEO 21:40/21:43 勘正）：本表=实施规划层，各段尚未立单拆树——本列为**该段组队 roles 组合**（无序名单·非单向链·非正式字段）；正式名单于立单时 COO 定（charter.roles），正式任务树 `sequence` 于 `wp charter-split` 拆树时程序断言定形（首尾必 cos）。

---

## 十、验收门（S4 出口）

1. M1-M3 逐周迁移对表断言全绿，零人工修账。
2. M4 干跑输出与人工现勘一致（逐件比对）。
3. 散树清零：W40-W43 顶层 trees/ 无残留树目录（全归 charter 或 archive）。
4. 一致性抽验：task-inventory 渲染内容与 wp-*.json 现读一致（三抽三中）。
5. 留痕抽验：任取一迁移后旧周——inactive wp 快照完整+shift log 在位+git log --follow 可溯（三层齐）。
6. 中断恢复实测：任一在役树人为中断→读树账即续。
7. CEO 走查过关：大表人看体验+账本机器读体验双确认。

---

## 十一、决策点裁录（CEO 批文全录）

| # | 决策点 | CEO 批 |
|---|---|---|
| D1 | 账本名 | **wp-周.json**（13:45:56 批「可以用周」·`wp-2026-W44.json` 定形） |
| D2 | 任务书 ID | CH-日期-序号（11:30:56 批）+**助读段回归**（13:45:56 批）→正形 `CH-YYYYMMDD-NNN-<助读段>` |
| D3 | 树物理位置 | 批（charters/<任务书>/trees/） |
| D4 | 迁移方式 | 物理搬+原周留档+周平面降 inactive（只查 active 定位）+**留痕三层补强**（V3 §2.1·答 13:45:56 留痕之问） |
| D5 | CLI 栈与名 | python（11:30:56）+**命令名 wp 或 weekplane**（13:45:56 批）→命令名 `wp`·weekplane 全名别名 |
| D6 | 首迁实例 | W40→W41→W42 逐周整理，W42→W43 干跑验程序，再 W43→W44 |
| D7 | 已毕归档位 | 批 archive/charters/（originWeek+closeWeek 必填）+**归档留痕同构补强**（V3 §2.1） |
| D8 | 并行度与排序 | 不设上限；默认顺序排好；高优先级在前拆树 |
| D9 | 大表名 | **沿用传统名 task-inventory-日期.md**（13:45:56 批·不叫 bigtable·render 产物制不变） |
| D10 | 周级表迁移 | **company-demand-pool/daily-progress 等周级表纳入迁移管理**（13:45:56 批）→§2.2 三类清单（整本平移/滚动平移/快照新建·分类细节候批） |
