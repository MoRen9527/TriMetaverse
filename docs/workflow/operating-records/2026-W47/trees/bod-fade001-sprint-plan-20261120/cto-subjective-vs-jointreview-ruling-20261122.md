# CTO 勘定卷·主观分（cos+coo 两席）vs 七席联审（loop 尾段）两机制分离（CEO 勘正执行·2026-11-22）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/cto-subjective-vs-jointreview-ruling-20261122.md·勘定正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 承接: CEO 勘正（BOD 转达原话「主观题不需要七席联审啊，七席联审是 fade-001 结束才会做，主观分是 cos+coo 判分的啊」）
- 本卷=四件勘定（①两席正形 ②七席归联审段 ③P2 落点复核 ④debug 轮产出定性）

## §一 · 事实链勘定（落错源头）

1. **原始正形**：`score_skill_spawn.py` SEATS=("cos","coo")=**段 7 评分（主观分 10 权重）的本职**——cos 判 initial+coo 判 joint=两席判分形（原代码正确）；
2. **昨日令②**：CEO「7 席必须 7 席（score_skill_spawn 现两席=判错·恢复七席名单）」——**落错源头=此令把七席指向 score_skill（评分段）**；
3. **P2 实施**：SEATS 两席→七席装进 score_skill_spawn（评分段）——按令执行·**落点错**（评分段被迫扩七席）；
4. **今日 CEO 勘正**：主观分=cos+coo 两席（原形对）·七席联审=loop 尾段（fade-001 结束才做）——**两机制分离定谳**。

## §二 · 校正形（两机制分离）

| 机制 | 归属段 | 席数 | 产出 | 生效态 |
|---|---|---|---|---|
| **主观分**（主观域 10 权重） | 段 7 score_skill（每轮跑） | **2 席（cos+coo）** | scores（I1/I2/I3）+summary→score.json subjective 域回填 | **恢复原形=P2 回滚 SEATS** |
| **七席联审** | **loop 尾段·fade-001 结束**（非每轮） | 7 席（COS/COO/CAO/CPO/CTO/CHO/CFO） | 每席 100 制·全席达线 95 判进化·**improvements→任务书** | future 件（独立 spawn 面·非评分段内） |

**P2 回滚形**：SEATS 恢复 ("cos","coo")——`SCORE_SKILL_SEATS` env 回滚形已在（当时设计的回滚锚=现用于正形恢复）·零代码改=env 切回。

## §三 · 今天 debug 轮七席产出定性（如实档不追改）

- **跑的是=被误装的评分段**（debug 轮段 7 score_skill 跑七席 spawn·P2 生效后）——七席各 -1 items/charter（charter-20261122T091742Z）=**评分段误装七席的产物**（improvements 五字段 7/7 也是评分段跑的）；
- **定性=误装段产物·如实档不追改**（CEO 面批不批任务书=CEO 裁·来源标注「误装评分段·非联审尾段」）；
- **后续按正形重跑**：评分段恢复两席后 debug 轮=两席评分（正形）·七席联审=loop 尾段 future 件（其 improvements→任务书链的验证=future）。

## §四 · 前置机制归属重划（P4/P5/A/A3 经验）

1. **P4 面**（flag 四态/opinions 注入/钩子/挂载）=**联审段机制设计正确**（debug 态联审·钩子产任务书）——但执行面 tie 在 score_skill_spawn（评分段跑七席）=错——**正形=联审段独立 spawn 面**（我此前裁「B 专门 spawn 否」**随勘正=反转为是**：七席联审=loop 尾段独立面·与评分段分离——**B 形现在正确**）；
2. **A/A3 经验**（judge 输出加 improvements/位置效应）→**迁移到联审段 prompt 设计**（评分段不需要 improvements）；
3. **P5 的 100 制**→联审段每席 100 制（与评分段 I 族量纲分离——评分段两席 I 读数照旧）；
4. **P2 七席 SEATS=回滚**（评分段恢复两席）。

## §五 · 自领（技术 owner 失守·两处）

1. **第一次**：b596ece00 我裁「两席（源码锚）=正形」——**当时是对的**——但 CEO 昨日令后我「撤回」接受七席（礼仪上撤回对·**技术上不该翻**：源码两席=设计真源·我该坚持并**追问「七席装哪一段」**——缺失的这句追问=整个落错的避免点）；
2. **第二次**：「源码现状≠设计真源」教训**用错方向**（我把源码两席当「退化态」接受——实际源码=正形·CEO 令=落点错）——**教训修正：源码锚与令面冲突时，先问「令面指向哪一段/哪个机制」再判「现状是否退化」**——技术 owner 的职责=把「两机制分离」的架构事实摆到令面前（本卷即此形）。

## §六 · 使用依据

CEO 勘正原话（BOD 转达）+本席 P2 卷（817cef78 面·SEATS 七席实施）+A 优化形卷（25759aee 面）+r9/debug 轮读数（d29eeb890/台账 905）+score_skill_spawn.py 源码（SEATS 原两席）+D-15/D-24/D-27 v4/D-46/D-47/D-76/D-84。

——CTO 小狄（m-cto）·写前现查 〔commit 时戳锚·D-47 正形〕
