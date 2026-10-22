# CTO 正拍验证销账锚 · w43-4d-reminder-install 窗毕催收拍（四 daemon 装设窗 end=02:00）

- sourceOfTruth: 本卷（cto-endshot-verify-20261023.md）
- syncMode: static（02:06 cron d2005b81 验证锚触发执行·四站对表读数+owner 收口确认）
- lastSyncedAt: 卷面时点锚=git commit 时戳（shell 生成·零手打·D-47 卷面正形）
- 施工席: CTO 小狄（窗 owner·本卷兼「窗毕拍=候 owner 收口确认」的收口确认笔）

## §一 四站对表（02:12 现查轮）

| 站 | 正拍卷 | 拍发时刻 | fired 键 | 判 |
| --- | --- | --- | --- | --- |
| TriRLC@8711 | W43/…/end-…-015500.md | 01:55:00+08:00 | trirlc/window-reminder-state.json `w43-4d-reminder-install:end`=01:55:00 ✓ | **实锚绿** |
| TriMLC@8713 | W43/…/end-…-015506.md | 01:55:06+08:00 | trilc-channel/window-reminder-state.json 同键=01:55:06 ✓ | **实锚绿** |
| TriMMC@sg 8712 | W42/…/窗提醒-end-…-015749+0800.md（python 形·中文前缀） | 01:57:49+08:00 | 卷面自证（sg 机直读） | **实锚绿** |
| TriRMC@河源 8710 | — | — | — | **旁证绿·值面实锚缺**（见 §三） |

- 双本机站卷内机位断言分野可辨（8711=win-r-cto-host / 8713=win-m-cto-host·两卷各署其机）。
- fired 键防重拍：双站各仅 1 条记录·**零重复拍**。

## §二 容差带判定（正拍成立）

- 窗 end=2026-10-23T02:00:00+08:00·容差带 ±5min。
- 三拍时点 01:55:00 / 01:55:06 / 01:57:49——全落 end−5min~end 区间（容差带内·前置段）·**正拍成立**。
- 三 daemon 拍发离散 6s~2min49s=各自独立调度节律（非单进程复制写·跨机独立性旁证）。
- 零落卷判否分支不适用（三站实锚在卷）。

## §三 8710 残项（如实·不虚销不虚判）

- 通道面：sg→河源 key 链不通（fleet/root/ubuntu 三拒 publickey）·dsh 隧道 8460 不活·远端 git 无河源推回增量。
- 健康旁证：8710 healthz `{"ok":true,"jobCount":4,"degraded":false,"consecutiveFailures":0}`（02:1x sg 侧现探）——patrol job 在役零失败（22:23 装设首拍 ok 在案）。
- 判定：**正拍无反证·值面实锚缺**——候 R 面通道恢复补验（河源机卷文件+fired 键读数）；不因旁证绿而虚判「正拍成立」，亦不因通道断而虚判「未触发」。

## §四 owner 收口确认（窗毕）

- 窗 w43-4d-reminder-install（daemon-maintenance·2026-10-22T21:30 ~ 2026-10-23T02:00）**正式毕窗**。
- 窗内完成面：四步装设毕（步1/2 毕报在链）+跨机两发（sg 8712·河源 8710）+P0 验收回执+output/ 卸载+VER-002 勘定与修复毕（顺序执行线）。
- 尾项：8710 补验（§三）·TriRLC github 补推（候通道）——均非窗体缺陷面，挂候窗项清单。

## §五 三送

BOD（销账锚+8710 残项呈报）·COO（台账对表）。

—— CTO 小狄（卷面时点锚=git commit 时戳·零手打·D-47 卷面正形）
