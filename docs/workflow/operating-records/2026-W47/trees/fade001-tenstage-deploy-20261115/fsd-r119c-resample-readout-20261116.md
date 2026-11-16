# r119①c 勘定+重采执行读数卷（客观题试卷出卷评分形·CEO 09:57 问责整改令）

- 执行: m-duty-fsd；两形对表勘定→重采落卷→CAO 形另轨留用三段毕

## 一、两形对表勘定（工序①）

| 形 | 本体 | 判据面 | 定性 |
| --- | --- | --- | --- |
| 现采形（第 10 轮首采） | CAO 评估单 A/F/H roster-assessment 判据列 | md5 对表/alarm 触发行/dive+拍频——**迁移质量证据采集** | 与试卷形实质不同 ✓ |
| CEO 令面（试卷出卷评分形） | fade-001 内部客观题试卷判分 | rubric-firstshoot.json 九族 verdict_rule 原文（STE 考卷判据真源） | **重采正形** |

**勘定结论：两形实质不同成立** → 转试卷出卷评分形重采（CAO 形另轨留用不废）。

## 二、重采落卷（工序②）

- run_dir collection-score.json **重采落位**（试卷出卷评分形）：entries A/F/H 三族逐条 verdict_rule 对表判分（rationale 引 verdict_rule 原文+读数锚）——A=jobs.json 活体 md5 十阶段形基准落卷值/F=成跑零触发满分形/H=首拍断言形+dive 读数+拍频档
- 判分=pass 三族（读数面全绿：A md5 录得 7accfca1...+nextRun 滚动+qualify/trap/RC_guard 十阶段形在位；F 零触发满分形；H 断言形+dive 卷+拍频档）

## 三、CAO 形另轨留用（工序③）

- CAO roster-assessment 原卷=「迁移质量证据面」**另轨留用不废不删**（原卷即档）——两形并立各按各面（与 A 族两基准禁互判同族纪律）

## 四、门读数与残面

- sg 可读三面收采全毕（A md5/F 零触发实证/H dive 卷+拍频档）；engine 消费面（_judge_collection 二值制）对形就绪——重采卷=试卷形 entries（消费面判读=family_id 逐条对形 ✓）
- 残面如实：A 族十阶段形基准 md5 若与 dev dive 落卷值有异=对表候 dev 面（本读数=活体实录为基准落卷正形候选）

## 五、使用依据

r119①c 令（CEO 09:57 问责整改令承转）；rubric-firstshoot.json 九族 verdict_rule（STE 考卷判据真源）；CAO 采集单 20261116（现采形正身）；cto-dive-final-ruling/sde-loop10 读数卷（H/F 读数锚）
