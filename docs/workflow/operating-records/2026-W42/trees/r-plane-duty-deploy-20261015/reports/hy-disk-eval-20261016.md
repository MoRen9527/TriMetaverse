# SDE 评估卷 · 河源机硬盘空间评估（COO 派工·只读·代码仓复制步前置）

- tree-id: —（charter 正卷树 reports/·原树续用·COO 10:29:43 派工树锚）
- charter: charter-2026-W42-001
- syncMode: static（评估卷·令源=COO 2026-10-16T10:29:43+08:00 派工·只读非窗直跑）
- lastSyncedAt: 2026-10-16 10:33:00+08:00（date 现查原值随发）
- 执行席: SDE 小布（m-sde）；止损=零改动断言（df/du 外零命令·全程纯只读 ✓）

## 河源 R-HY 硬盘读数（10:30-10:32）

| 面 | 读数 |
| --- | --- |
| df -h 主挂载点 | /dev/vda3：40G 总·**7.7G 用·30G 可用（21%）**·/boot/efi 197M（4%） |
| df -i inode | /dev/vda3：2,608,144 总·197,236 用·**2,410,908 可用（8%）** |
| du /srv/fleet/ | **1.9G** 总占 |
| du 子目录顶 | TriMetaverse **812M**·dsh 519M·TriModel 121M·trimodel-test 107M·TriLC 85M·TriCompany 65M·TriModel.bak 63M·TriRMC 61M·TriCode 49M·余 <5M |

## sg M 面同构对照（10:31）

| 面 | sg 读数 | 河源读数 | 差 |
| --- | --- | --- | --- |
| /srv/fleet/ 总占 | 2.2G | 1.9G | -0.3G（河源少工作产物） |
| TriMetaverse 仓 | **1008M** | 812M | -196M（sg 面多分支态/产物） |
| / 盘 40G 用量 | 19G（49%） | 7.7G（21%） | 河源更空 |

## 评估结论

**结论行：够（充裕）**——依据数字：

1. 复制上限参照=sg 面 /srv/fleet/ 全套 **2.2G**（含 TriMetaverse 1008M 形态）——河源可用 **30G**，全量复制后 / 盘占用仅升 ~5.5 个百分点（21%→~26%）。
2. 单仓参照=sg TriMetaverse **1008M** 上限——河源现 TriMetaverse 812M 在位（增量收编面 ~200M 级）——30G 余量下零压力。
3. inode 面：复制万级文件量 vs **241 万空余**（8% 现用）——零压力。
4. 零改动断言 ✓：全程 df/du 两命令族·无任何写面。

## 使用依据

- COO 派工 2026-10-16T10:29:43+08:00（分件表①②·门禁=结论行在卷+D-47 正形·毕报直回 COO 抄 COS）
- 活体读数：河源 df -h/df -i/du（/srv/fleet/ 全子目录）·sg df/du（TriMetaverse+fleet 对照）——2026-10-16 10:30-10:32 双机现勘
