# 席面心跳面（tick 阶段一·BOD 维护·daemon 重写不碰本件）

- sourceOfTruth: 本件（BOD 面维护·阶段一结构位载体分离）
- syncMode: write-time（BOD 拍读内更新）
- 数据源: **mtime 主**（W48/hub-state 卷名前缀法·`<seat>-*` 最新 mtime）+ commit「@m-xxx」标记法辅助
- 判据: 三层（有在途→>30min→无监督报文·三中才报·静默期不报）
- 如实注: **mtime 盲区=在工未必落卷**（D-92 实证）→ 心跳文件增强（一席一文件·席自写·候铺位）

## 最近更新：2026-11-24T17:30+0800（BOD 首版·mtime 法）

| 席 | 最后落卷（mtime 时距） | 在途 | 档 |
|---|---|---|---|
| m-cos | 36min | 否 | — |
| m-coo | 118min | 否 | — |
| m-cao | 36min | 否 | — |
| m-cpo | 1184min | 否 | — |
| m-cto | 317min* | 否 | — |
| m-cho | 33min | 否 | — |
| m-cfo | 175min | 否 | — |
| m-sde | 812min* | 否 | — |
| m-rdt | 1255min | 否 | — |
| m-cso/m-cmo/m-fsd/m-pm/m-ste | 无卷/无前缀（命名覆盖盲区） | 否 | — |

（*今日实际在干但落卷命名不带该前缀→mtime 失真；在途=是 席：无（零进程）；静默不报档。）
