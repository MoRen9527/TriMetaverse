# BOD 裁决留痕 · 河源 trilc-headless 归宿：裁②正式退役（归档注记形）

- sourceOfTruth: 本件（trees/lg066-window-order-20261009/bod-ruling-trilc-headless-retire-archive-20261009.md）
- syncMode: final（D-39 BOD 待裁全域授权·裁毕入账留痕即生效·事后呈报知情）
- lastSyncedAt: 2026-10-09 11:44:10 +0800（date 现查原值）
- 裁决席: 董事会 BOD
- 定性卷: CTO 三勘卷 c3d88ca0（主仓 dev 顶·bare 验真）——trilc-headless=TriRMC autonomy-001 服务域伴生件，非历史误装

## 一、裁项（CTO 三选候裁）

**裁②：正式退役=归档注记形**。

- trilc-headless.service 维持 **disabled 现态不动**（不 enable 不 start，亦不删）
- 归档注记入档（本件+CTO 定性卷即注记正身）：定性=TriRMC autonomy-001 伴生件；现役零消费；停摆零感知；物理形态保留
- **unit 文件与 /srv/fleet/TriLC 目录保留不删**——物理退役（删 unit/目录）候 RDT/R 面规划确认 autonomy-001 无未来需求后再议（未来件，不设窗不挂账）

## 二、判据事实（BOD 活体实勘 11:40-11:43 河源 R-HY）

| # | 事实 | 探锚 |
|---|---|---|
| 1 | TriRMC cron store 现役 3 job：weekly-plane-shift / rmc-orchestrate-tick / tricompany-pull，**零 autonomy 相关 job** | /srv/fleet/TriRMC/data/cron/jobs.json 键名提取 11:41 |
| 2 | journal -u trirmc 2026-10-05 以来 autonomy 提及=**0 次** | journalctl grep -ci 11:39 |
| 3 | trilc-headless 10-01 SIGTERM+disabled 停摆 8 天，TriRMC 服务域 10-04 恢复后运行正常=**消费缺位零感知** | CTO 三勘卷勘三+拍报 trirmc=active 连续在案 |
| 4 | ExecStart=node /srv/fleet/TriLC/dist/cli.js run --port 8711（独立部署实例，非本机 8711 副本） | systemctl cat 11:39 |

三选判据对表：①恢复=判据不满足（零消费）；③迁移重构=无需求驱动；②退役=判据满足（无消费+停摆零感知=事实上已不再需要）。

## 三、命名防混注记（防后人再混淆）

trilc-headless unit Description 内「TriRLC」字样属**历史名残留**（该实例装于 2026-08-31 TriLC→TriRLC 改名前，所指=TriLC 仓库 headless 执行节点），与 **R 面本地域 TriRLC 8711 正身（本机 dev）零涉**。后续任何人读 unit Description 遇「TriRLC」字样须先过机位矩阵断言（memory: daemon-plane-locality-matrix）。

## 四、知会链

- CTO：裁定知情+三选闭合（定性卷 c3d88ca0 为伴生定性正身，本件为归宿正身）
- COO：知情并入 LG-066 窗后收口面（本件不新增窗内施工项——disabled 态零动作）
- CEO：事后呈报知情
