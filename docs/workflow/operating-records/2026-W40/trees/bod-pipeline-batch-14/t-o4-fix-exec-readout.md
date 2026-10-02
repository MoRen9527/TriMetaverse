# batch-14 件① 执行读数卷（T-O4 冲突标记解除·五条顺序照裁）

- 执行: m-duty-fsd（FD/sg 值席）；裁卷正身=t-o4-conflict-verdict.md（1c5633e5）；工艺=前向修复不重写历史（88a6988 留史）

## 执行锚总表（五条）

| 条 | 动作 | 锚 | 门读数 |
| --- | --- | --- | --- |
| ①源侧解冲突 | 四件（agent-body/agent-frontmatter/席位文件/contract.yaml）10 hunk 全采 sg-server/dev 侧措辞，零润色 | TriCompany **966c180**（41 行纯删=标记+HEAD 侧） | **冲突标记 grep=0** ✓；典形「确定性执行规程（FADE DCE 段）」六面在位（body 3/frontmatter 1/contract 2/seat 3+soul/session-body 各 1） |
| ②双面重渲 | 管线真写 copilot+claude | TMV 随 ⑤ commit 3c556b26（21 件 +19/−87） | **derived_drift=0 双面** ✓；updated 1+1（SDE 面单件） |
| ③三断言 | 冲突标记/正名/drift | 同上 | **三绿**：冲突标记 0 ✓／「TriMC 正式」双面 0 ✓／derived_drift=0 ✓ |
| ④Registry 门+全量门 | TriMMC 套件复跑 | — | **Registry 6/6（13 席断言在内）回归达成**；全量 **476/473/0/3 恒等零新增** ✓ |
| ⑤冲突标记断言升格永久门 | sync 第二段前置断言增补（渲染输入面零容忍，非基线递减形） | TMV **3c556b26** | 自测：冲突标记 0 ✓+旧名 0/2 基线放行 ✓ |

## 观察注（如实，非门内项）

- SDE 源内 :11 句形两代并存（seat 文件=TriMMC 正式宿主切换+deployment-engineer.json binding；agent-body=无 token+senior-deployment-engineer.json binding）——渲染面正确投影 agent-body 件（管线无异常）；源内句形/binding 名不一致=LG-059 邻族候裁料，不阻本件门。

## 使用依据

裁卷 t-o4-conflict-verdict.md（1c5633e5）；STE e94c8b3d 验段卷（转引）；TriCompany 966c180/TMV 3c556b26 diff 为改动唯一真源
