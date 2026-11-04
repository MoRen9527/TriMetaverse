# P3 event-watch 首验探针件（2026-11-04·试触用·候观察窗毕撤除）

- sourceOfTruth: 本件（首验试触探针·非真源）
- syncMode: watch-probe
- lastSyncedAt: 2026-11-04T12:01:40+08:00（date 现查原值·写前锚）

## 探针说明

本件为 file-family-maintenance P3 event-watch 接入首验的**受控试触探针件**（CTO 终裁 2026-11-04T11:47:28+08 授权链·COO 触发令 11:44:57+08 项 4「首验=对接入目录变更触发真 run 证据卷」）。

- 触发面：本件写入使 `docs/execution/` 目录指纹变化（watch 首扫基线 fp=a6a658d1 之后首变）→应触发一次真 FADE run（fade011-ew 接入窗）
- 撤除：观察窗毕由 SDE 撤除本件（撤除动作=第二次指纹变化·如实注记不重复取证据）

## 试触证据锚

- 试触时刻：2026-11-04T12:01:40+08:00（本件落盘）
- 候验读数：fade.watch 探针 audit 面 run id+终态+触发文件路径·run 树=`docs/workflow/operating-records/2026-W45/trees/fade011-ew-runs/<runId>`
