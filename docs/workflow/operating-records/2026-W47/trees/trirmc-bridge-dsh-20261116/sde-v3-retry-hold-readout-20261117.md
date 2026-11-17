# SDE patch-runner 复跑挂账卷（修面进展实证+新根因三段实锚·止损线照走候 FSD 三修）

- sourceOfTruth: 本卷（复跑挂账卷正身·承 v3-patchrunner-hold 卷）
- syncMode: write-time
- 执行席: SDE 小布；令源=BOD 裁 135 续 patch-runner 实弹复跑令（三机同锚 346158a·止损线照走）
- 执行窗: 2026-11-17T1xZ 段（复跑实录）
- 判定: **复跑红（delivered=[]+failures=7 席全同形）——修面进展实证（①②双缺陷修绿）+新根因三段实锚=版本矩阵检查源面错位（候 FSD 三修）·挂账候裁零恋战**

## §一 · 修面进展实证（①②双缺陷修绿）

| 缺陷 | 修面 | 复跑实证 |
|---|---|---|
| ①session_id 形不匹配 | is_session_id_form 三形直通函数落装（L51+L83/L92 调用） | overlay 产出成功（前 ValueError 形直通修毕·首行=条目行零注释） |
| ②overlay yml 解析 | 首行注释删 | **YAMLException 消失=解析过·插件加载进版本检查段**（修面实效实锚） |

- 河源检出=346158a（三机同锚 ✓·值席 pull 毕）

## §二 · 新根因三段实锚（复跑红读数·fail-visible 防线正形拒）

- **delivered=[]+failures=7 席全同形 rc=1**：stderr 全形=**"fsd-adopt-runner: dsh 1.0.0 not in supported matrix [0.2.0-rc.2, 0.2.2-rc.3] — refuse to run (fail-visible)"**（七席逐字一致）
- **双源版本错位实锚**：dsh CLI `--version`=**0.2.0-rc.2**（本席前勘）vs **dsh 安装域 package.json version=1.0.0**（插件 supported matrix 检查读取源）——**插件读包 version·matrix=[CLI 版本族]——检查源面错位实锚**（读包 version 应读 CLI 真形版本/matrix 形面候修）
- **fail-visible 防线=插件设计面正形**（matrix 外=refuse 非静默——拒面正形·错在检查源面非防线语义）

## §三 · 候修面（FSD 三修·候 CTO 复核）

1. 版本检查源修正（读 CLI 真形版本/或 `dsh --version` 子进程探形）
2. 或 matrix 形面补（supported matrix 含安装域 version 族——矩阵语义=CTO 面）
3. 修毕复验=单席 patch-runner 直跑（对照本卷七席 fail 形基线）

## §四 · 挂账面遵行

止损线照走（挂账零恋战·legacy 缺省面零漂维持）✓｜护栏四族+D-46 照走 ✓｜修面进展①②=在卷实证（非弃面）

## 使用依据

BOD 裁 135 续复跑令（三机同锚 346158a）；FSD 修笔 346158a（is_session_id_form 三形直通+注释删）；复跑 failures 七席实录；dsh --version 前勘读数；本卷现采实锚。

—— SDE 小布（毕报=落卷+SendMessage 直达值席·卷面时戳=commit %cI）
