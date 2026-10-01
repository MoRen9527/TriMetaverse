# R-HY trirmc.service（8712 面）退役卷

- sourceOfTruth: 本件（CEO 2026-10-01 10:43 令「河源 8712 无用也退役」；BOD 勘定无用成立后执行）
- syncMode: final
- lastSyncedAt: 2026-10-01 10:5x +0800（date 现查）

## 勘定链（无用判定依据）

1. **unit 归属**：河源两 TriRMC unit 分野——`trirmc.service`（127.0.0.1:8712，cron enabled jobCount:3）vs `trirmc-mc.service`（0.0.0.0:8710 对外，cron disabled 0 job=quadmig-2 面，**M2 主链用此**）；两进程同批 09-29 03:03:47 启动、独立 unit（PPID 均 1）
2. **今晨勘误勘正**：10-01 晨勘「河源 TriRMC cron 面=disabled+0 job 无 cron 配置键」**勘的是 8710（trirmc-mc）面**——8712（trirmc.service）面实有 3 job；本件随记勘正
3. **3 job 明细（脱敏判定面）**：weekly-plane-shift（cron/enabled）+rmc-orchestrate-tick（cron/enabled）+tricompany-pull（cron/enabled）——**三者 hasNext 全 False+lastRun 全 None=F-3 同款死态**（next_run_at NULL 永不调度；家族性缺陷跨机实证：TriRLC/TriMC 代码基 cron store 族，sg TriMMC 8712 agent-core job-store 实现无此缺陷=正形，佐证 batch-09 件1 结论）
4. **无用定性**：三 job=①weekly-plane-shift 双跑残留（主责已回切 sg b00b0070；从未跑过=歪打正着避免双跑污染）②rmc-orchestrate-tick 旧档（08-30 runAs 炸后废弃）③tricompany-pull 旧档——`trirmc.service`=旧部署副本无在役职责（合 09-13「部署副本≠权威位」原则）→**退役成立**

## 退役工序实录（10:5x）

1. 存档：is-enabled 原值=enabled；unit 脱敏 31 行→河源 `/root/trirmc-retire-archive-20261001.unit`
2. `systemctl stop trirmc` 完成
3. `systemctl disable trirmc` 完成（摘 multi-user.target.wants）
4. 四重验证：inactive/disabled/8712 零监听/进程灭 ✓
5. **零误伤复探**：8710 trirmc-mc 机内三击 200（0.001s 级稳定）+监听原样（pid 1670411）——午窗主链无损✓

## 回滚锚（全程可逆）

- unit 本体未删；复役=`systemctl enable trirmc && systemctl start trirmc`
- 存档卷：河源 `/root/trirmc-retire-archive-20261001.unit`
- 注意：复役即带回 3 死 job——F-3 未修复前它们仍永不调度（无害但无意义）；若复役建议先裁 3 job 去留

## 范围外注记（候令不动）

- **trimodel.service（河源 3333）**：在役（enabled/active/3333 监听 1）——`trirmc.service` unit 内有 09-29 SDE P1 升级窗卡面 tier1 接线注记（TRIRMC_TRIMODEL_API_URL=127.0.0.1:3333+EnvironmentFile 单一真源引用）；trirmc 8712 退役后该接线关系消灭，**trimodel 本身是否退役候 CEO 另令**（不在「8712」令范围内，BOD 不擅动）
- 河源拓扑终态：对外=8710（trirmc-mc）唯一；8711（trilc-headless）已退（见 rhy-trilc-retirement.md）；8712（trirmc）已退；3333（trimodel）在役候令

## 连带

- 记忆条 weekly-plane-shift-executor：08-26 段已勘正（TriLC 退役注记）；本件再补 trirmc.service 8712 面退役+今晨勘误（cron 面实勘对象分野）
- F-3 病毒面清单更新：本机 TriMLC 8713（候今晚修）+河源 trirmc 8712（随本退役消灭）——家族源收敛至本机一處
