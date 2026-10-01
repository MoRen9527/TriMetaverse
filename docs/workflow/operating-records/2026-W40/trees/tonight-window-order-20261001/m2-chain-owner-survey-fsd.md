# M2 密值窗链 item5→回滚锚设防→改指→A1 归属勘实卷（FD/sg 值席，BOD 20:3x 令③）

- 执行: m-duty-fsd；令源=BOD 20:3x 回复④（勘实单件，呈 BOD+COO 双面）；性质=只读勘证
- 勘面基线: tonight-window-order-20261001.md（BOD 勘正版）/token-rotation-trimc-internal-runbook-20261001.md（三裁后版）/m2-mainline-sde-window-20261001/window-readout-01.md/task-inventory-20260930.md（LG-054/056 行）/weekly-meeting-2026-W40.md 11:59-14:5x 段

## 归属判定表（四段逐段）

| 段 | 内容 | 归属面 | 判据锚 |
| --- | --- | --- | --- |
| item5 | 键值窗链第五件修毕 | **候 SDE 定义补锚后定**（高概率 SDE/伴窗面） | 窗结构序「键值窗→item5 修毕→回滚锚门→改指」（COO 11:59 判定令）；SDE window-readout:39 引其为 item1/2 解冻前置——**item5 工序本体定义未见于 sg 可读文档**（键值窗链自有工序单在 SDE 车道树候补锚），勿盲派 |
| 回滚锚设防 | 三锚窗前就位 | **三面各执行位自落**：token 锚=本机 channel.cmd bak+sg .env/drop-in bak（root）；F-3 锚=dev TriMLC git revert；键值链锚=随 item5 定义面 | runbook §五（窗前就位+异常即停）+裁 A-b「回滚锚各自独立」 |
| 改指 | daemon TRIMODEL_API_URL 指向变更 | **SDE 车道**（主链 item1：两 daemon 改指，sg 8712 实锚+他 daemon 面） | 勘误版车道划分（SDE=item1/2/4）+window-readout:40 |
| A1 | LG-056 周迁移本机对齐自然终验 | **dev 8713 face**（对齐 job F-3 修复后自动复役；修复前兜底=值席手跑 SOP 手动档）+验收=BOD 哨位 10-04 自然验收 | task-inventory LG-056 行实锚（本机 8713 对齐 job F-3 影响空转中） |

## 连锁段三变更 face 分布总判（并窗结构对表）

- F-3 应用+8713 冷起=**dev**（已派本机 COS e31278fd，补丁稿 566fd195 暂存备好）
- token 轮换=**本机+sg root 代执链**（runbook §三 序 1-8 双面；sg 侧非 FSD 面）
- 键值窗链 item5=**候 SDE 补锚**（上表）
- sg-FSD 可承执行面=**零**（token sg 侧=root 代执链；消费方清单先勘已交 20:09 读数）

## 联动协调点（窗内防冲突，承 window-readout:40 显式提出）

token 轮换工序 3/4（sg drop-in+systemctl restart trimmc+job PATCH）与 SDE item1 改指**同 daemon 面**（sg 8712）——两变更须并批一次 restart 或 COO 定先后，防二次重启与中间态冲突。请编排层（COO）标注联动序。

## 使用依据

窗令树卷勘正版；runbook 三裁后版（b87a7a31）；SDE window-readout-01；task-inventory LG-054/056 行；weekly-meeting 11:59 判定令转录
