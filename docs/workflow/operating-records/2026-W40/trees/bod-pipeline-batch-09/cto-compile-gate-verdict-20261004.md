# CTO·编译门四处 TS2322 勘定终谳卷（BOD 件①勘定第②步读数回传处理）

- sourceOfTruth: 本件（件①勘定终谳正身；令源=BOD 勘定第②步读数回传 2026-10-04 03:2x）
- syncMode: final
- lastSyncedAt: 2026-10-04 03:43:05 +0800（date 现查贴原值；03:4x 坐实回填+TriCode 拉平毕回填）
- 定性席: CTO 小狄（m-cto）；全链只读独立勘（tsc 一手+diff 对表+ls-remote 活体断言）

## 一、终谳（总）

**四处 TS2322 根因=2fb1292（batch-15 件③，本席终裁 2026-10-02 21:25）PathsSchema 四件套 optional 化的类型真值变更，TriMLC 消费端类型面未跟**——「实现裁决改、消费端未跟」族的类型版（同族先例：LG-029 改名测试未跟、TriMLC 正名测试未跟）。**非本机依赖旧、非本机环境态坏——与四行裁答初判方向相反，勘定读数定谳反转。**

## 二、定谳链（全实锚）

1. **错误形状精确对表（铁证）**：`tsc --noEmit` 一手勘=**4 处**（非卷记 3 处）TS2322 `string | undefined`→`string`，位 contract-resolver.ts L173(soul)/L176(memory)/L177(colleagues)/L178(social)——恰为 PathsSchema 四件套四行；L174/175（agent_body/agent_frontmatter，2fb1292 保持必填）零错。2fb1292 diff 实锚：四件套 `z.string().min(1)`→`.min(1).optional()`，推断类型 string→string | undefined。零巧合空间。
2. **方向反转依据**：TriCompany 两机同顶 20cf17f（BOD 读数+本机侧对上）→「依赖对齐」无目标；本机 agent-core dist/index.d.ts 构建时点 **2026-10-03 10:40 晚于** 2fb1292（10-02 21:25）=本机 dist 含新类型真值（types 字段指向 dist/index.d.ts，package.json 实锚）。sg clone check=0 错唯一自洽通道：**sg 的 agent-core dist 为旧构建（不含 2fb1292）=旧类型假绿**。sg 侧一条验证坐实（候值席通道，不阻塞本谳——四错形状已自证）：`ls -la node_modules/@tricompany/agent-core`（symlink or 复制快照）+ dist/index.d.ts mtime + PathsSchema soul 行 optional 有无。
   - **坐实回填（BOD 代勘三查 03:4x，值席两轮未拾取运维小窗留痕）**：查1 agent-core=真 symlink→`../../../TriCompany/packages/agent-core`（链接建时 10-04 01:45=F-3 克隆窗）；查2 sg dist/index.d.ts mtime=**10-01 19:38**，早于 2fb1292（10-02 21:25）=「旧构建不含 2fb1292」铁证；查3 源面 L28 `soul: z.string().min(1).optional()`+L107 注释自证与修法对表。——**三查全中，本谳闭合**。
3. **候选灭**：TriMLC 工作区零脏面（仅 untracked scripts/digest-inbox.mjs，非 src 面）；tsconfig 同仓同笔；typescript 本机 5.9.3（sg 版本差即使存在也不产生「恰四件套四行全中」的精确形状）。
4. **连带发现**：Registry family 合同（board/BS）走 loadOne 五件套组装在 roster 案复跑已实锚 warn（paths 适配面）——修对后应**连带消除**（family 分支早退后 Registry 不再走四件套路径组装），一石二鸟。

## 三、修法裁决（归 FSD 维护批④余块；severity 维护批级不变，9-21 老码 dist 跑稳+tsx 不 type-check）

- 方向：**TriMLC 消费端类型面适配**（禁回滚 2fb1292=本席终裁正形；禁 tsconfig exclude 糊弄）。
- 正形：loadOne **family 分支**——`family !== 'Role'`（Registry 简形）早退 return null（附一条定性 warn 日志），Role 形四件套运行时必有（2fb1292 superRefine 强约束维持）类型收窄照旧、`Required<AgentContract['paths']>` 声明成立。
- **禁 `!` 裸断言**：Registry 合同运行时 paths.soul 真为 undefined（四件套 optional 化的语义本体），裸断言会把 undefined 静默放进 readFileSafe——类型门改运行时雷，禁止。
- 验收门：tsc --noEmit 0 错 + board/BS loadOne warn 消失 + roster-gating 全绿（roster 族修案在批B，无冲突面）+ `loaded 13/13` 双锚不变。
- **sg 侧追平预告（防二次踩坑）**：sg dist=10-01 旧构建，任何时点重建（含跑 agent-core 包门 test script 自带 build）将使 sg TriMLC check **翻出同形 4 错=预期行为非回归**（类型真值追平，非 sg 环境坏）。顺序建议：TriMLC 修稿先合入→两机拉平→再重建 agent-core dist，则两侧一次到位全绿。
- 分界照旧：架构面（family 分支语义）=本席本卷已裁；实现面（稿码）=FSD，稿面候本席审。

## 四、TriCode 并笔裁定

- 活体断言（ls-remote origin dev）：sg bare dev=**a3893ba 已推平**——BOD「未推或并行线」勘正：**已推，sg 树未拉**。本机 TriCode status 干净（STE 事故后零残留）✓。
- 裁定：**sg 值席一轮 `git pull --ff-only` 即闭，零本机动作**。两笔面定性独立验属实：d20cb6b=docs only（README +26 行）、a3893ba=package.json 测试脚本 1 行，均非类型面。——**执行毕（BOD 代跑 03:4x 留痕）：sg 树顶=a3893ba 拉平 ✓ 本件闭合**。

## 五、勘误自报（两条）

1. F-3 卷 L48「三处 TS2322」→实勘**四处**（本卷 tsc 一手勘）；四行裁答沿引未复数——卷面互引读数未回溯实锚族再添一证（候 CAO 条与 roster 案并档）。
2. 四行裁答「依赖对齐 APPROVE」初裁方向**作废**——勘定前置闸门读数回传后定谳反转（闸门设计正常工作：方向裁发出时已标注候勘定后定谳）。

## 使用依据

- BOD 勘定第②步读数回传（03:2x）；F-3 卷 f618e9440 续篇（26815fd0 勘正版）
- tsc --noEmit 一手勘（4 处 L173/176/177/178，03:3x）；contract-resolver.ts L158-187 实读
- 2fb1292 diff（agent-contract.ts +44/-6：PathsSchema 四件套 optional 化+superRefine Role 强约束+io_contract nullish+interfaces optional）；agent-core package.json types→dist/index.d.ts；dist mtime 10-03 10:40 vs 2fb1292 10-02 21:25
- TriCode log/merge-base/show --stat/ls-remote（origin/dev=a3893ba 活体）；TriMLC status 零脏面；typescript 5.9.3
- roster 定性卷 fcf9bf0a（board/BS loadOne warn 实锚引用）
