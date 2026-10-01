# ed4babe8 幽灵引用实址定性读数卷（BOD 流水线 batch-12 件②·LG-040 T-O4 溯源令）

- date 现查: 2026-10-02 05:1x–05:2x CST（0-9 段内 ✓）
- 勘验人: CTO 小狄；边界: 只读勘验零写生产面 ✓、零敏感值出机 ✓
- **结论一句话: 幽灵不成立——ed4babe8 系活址实 commit（sg TMV 四 ref 可达/origin/dev 祖先/内容在树），「两机三仓查无实址」系勘验方法学误判，最可能机理=跨仓哈希误检；失效的是勘验，不是引用。**

## 一、引用链勘明（引用处/实址/断裂点）

**引用处**：
1. 树面催办件 `2026-W39/trees/duty-urge-morning/urge-bod-five-sweep-3pcs.md:9`（投递 09-24 23:4x）：「树 ed4babe8 引用『CTO 侧收口出表（66cf587）』两机三仓查无实址（幽灵引用）」；
2. 台账链三日行（task-inventory 0925/0928/0930）：「T-O4 勘正态=溯源令在 CTO（ed4babe8 幽灵引用实址定性）候 CTO 排窗」。

**实址（双锚全活）**：
- `ed4babe8` = **TriMetaverse** `docs(workflow)` commit：2026-09-24 10:50:50 +0800，TriMMC Orchestrator，改 `trees/duty-urge-morning/master-table.json`（+58/−12，LG-040 CTO 侧收口出表行）；sg TMV 现勘：`cat-file -t`=commit、`log --all` 命中、reflog 3 笔、`branch --contains`=dev+wt/board+github/dev+github/wt/board、`merge-base --is-ancestor origin/dev`=✓；
- `66cf587` = **TriCompany** feat(lg-040) commit（09-24，T-O4 代码面收口，消息全文实勘）——活址。

**断裂点: 无仓库层断裂。** 内容面亦零损：master-table.json LG-040 行现势原文在树（「CTO 侧收口（66cf587 已推 TC dev…）——出表，销账走 COS 收口→BOD 验收链」）。

## 二、失效机理定性

- **主机理（高置信）：跨仓哈希误检。** ed4babe8 属 TMV 命名空间、66cf587 属 TC 命名空间；「三仓查无」若含在 TMV 查 66cf587、或在 TC 查 ed4babe8，落空为构造性必然——跨仓哈希互查必不中，与引用真伪无关。
- **佐证（时间线+不可变性）**：commit 09-24 10:50 早于发令催办 09-24 23:4x 十三小时；TMV origin/dev reflog 八笔**全为 fast-forward fetch**（无 force/无 rewrite）——git 不可变性下「曾在而后无」不可能，勘验时点若方法正确必可解析。
- **次要待排除（低置信，如实注）**：勘验面若为浅克隆/剪枝态或短哈希前缀错位 grep，亦可假阴性——**两机之 dev 机面读数本席不可达，勘不到如实报勘不到**；但 sg TMV 四 ref 可达+reflog 无 force 已足证「引用自始有效」在 sg 面成立，dev 侧纵有相异读数不改本结论。
- 勘验方所用具体方法/仓清单未留痕树面——其误判细节属该面读数，本席不代拟。

## 三、影响面

1. **台账误导挂账 7 日**：LG-040 行 09-25→10-02 被挂「勘正态候 CTO 排窗」，实为主线 09-24 双锚已闭（执行 66cf587+出表 ed4babe8）——台账行勘正素材见 §四；
2. **催办链成本**：五单催办+溯源令两轮 BOD/CTO 车道占用——**教训条（建议入册）**：跨仓 commit 引用勘验必须带仓定语（`仓名@哈希` 形），禁裸哈希跨仓互查；
3. **内容面零损**：master-table.json 与双 commit 均无需任何修复动作（无可修之物）；
4. **LG-040 残差真态**：仅 T-O4b 守卫对表+pytest 供给两项 follow-up（t-o4-batch-report.md 在卷），主线已闭。

## 四、LG-040 行随更素材（工序④，可直接摘）

> T-O4 已收口双锚：执行=66cf587（TC dev，09-24，门 184OK+5OK+smoke 绿）；出表=ed4babe8（TMV dev，09-24，master-table LG-040 行）。「幽灵引用」定性=勘验跨仓哈希误检（batch-12 件②卷），无仓库面断裂；残差=T-O4b 守卫对表+pytest 供给（follow-up 清单在 t-o4-batch-report.md）。

## 使用依据

`git cat-file`/`log --all`/`reflog`/`branch --contains`/`merge-base --is-ancestor`（TMV 现势五读数）；`git -C TriCompany cat-file/log`（66cf587 活址+消息全文）；ed4babe8 `show -s`（元数据+改动面）；master-table.json LG-040 行现势读数；urge-bod-five-sweep-3pcs.md（引用处+投递时点）；task-inventory 0925/0928/0930 三日行；W39 daily-progress 198 行（出表事件旁证）；t-o4-batch-report.md（残差清单）。
