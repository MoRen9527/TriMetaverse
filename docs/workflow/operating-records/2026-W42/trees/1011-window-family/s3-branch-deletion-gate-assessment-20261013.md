# S3 评估件 · 删分支无闸（本地→服务域流水线接通·大表清零服务域批③）

- 出件位: sg duty 值席（BOD 10-13 03:22 令·今晨裁启·候窗令面只评估不实施）
- 评估对象: sg 三 bare（TriMetaverse.git/TriRMC.git/TriCompany.git/TriMMC.git）分支删除面闸位
- 证据全部来自本周值席 firsthand 操作与在卷勘验（零推测面）

## 一、现状面（四实锚）

1. **删除无闸**：TriRMC.git pre-receive 拒非 FF 更新（--force 亦拒·LG-066 窗实测）但**不拒 ref delete**——本席 10-09 删枝重建（s2-token-gate-failclosed）删除路径畅通无闸。
2. **删后零痕**：/srv/git/TriRMC.git/logs/refs/heads/ **空**（reflog 未挂）——删除事件不落任何 who/when/from-sha。
3. **未知名删除实害已成**：10-09 s2 分支日间被未知手删除，CTO 被迫行为学勘验（21:47 双读数数秒翻转实证并发操作者）——取证成本实付（S2 补推卷在案）。
4. **root 残留伴生病**：TriCompany.git objects root 属主 24 项＋TriMMC.git 25 项（root 通道 push 无 G-5 归还扫尾）——fleet push 全堵一次（unable to migrate objects 实测）。

## 二、风险面

- 协作裸仓 13+ 值席位并行，删一键=部署线断链（s2 案例：部署分支一度无影，终验面险无锚）；
- 误删不可溯（reflog 缺）+不可考（操作登记缺）双盲；
- 脚手架型 git 操作（删枝重建/收编）与误操作同通道无区分面。

## 三、闸选项分级（评估·不实施）

| 级 | 闸 | 形 | 成本 | 收益 |
|---|---|---|---|---|
| a（最小·建议即挂） | **reflog 强制** | 三（四）bare 各一行 `git config core.logAllRefUpdates true`（仓主 fleet 可执行·非 root） | ≈0 | 删除留 who/when/from-sha——CTO 双读数翻转类勘验即可免 |
| b（中·候维护窗） | **删除禁令** | update hook 增条款：`newrev=0000000000000000000000000000000000000000`（删除特征）→exit 1 附指引（删除须 BOD 令+值席执行·受控删除白名单路径） | hook 编辑+受控删除流程 | 防误删硬闸 |
| c（配套·随制度批） | **操作登记** | 删除类操作凭令编号入卷（对齐 D 系纪律） | 制度面 | 闭环 who/凭据 |

## 四、建议

a 即挂（四 bare·零破坏零流程成本）；b 候维护窗（hook 面编辑走窗）；c 随制度批。**本件只评估零实施**（窗令面候 BOD）。

—— sg 值席 COS，2026-10-13 03:4x +0800（date 现查落款·D-47 双保险）
