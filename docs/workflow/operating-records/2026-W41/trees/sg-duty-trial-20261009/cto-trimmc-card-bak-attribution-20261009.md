# CTO 定性卷 · sg TriModel 五 .bak 场外发现（BOD 转域件④）

- sourceOfTruth: 本件（trees/sg-duty-trial-20261009/cto-trimmc-card-bak-attribution-20261009.md）
- syncMode: final（定性毕·销案）
- lastSyncedAt: 2026-10-09T10:14:00+08:00（date 现查原值）
- 令源: BOD 09:38 转域件④（sgA 场外发现录卷候 owner 面定性）

## 定性结论

**五个 `trimmc-card.json.bak`＝TriModel Config Plane 写卡轮转备份机制·设计行为·非异常遗留——销案。**

| # | 实锚读数 |
| --- | --- |
| 1 | 写者进程 pid 2518071＝**`trimodel-config.service`**（unit 描述「TriModel Config Plane 3333 (LG-035 P3-sg)」·systemd enabled·active since 09-29 04:12:34·PPID 1·cwd=/srv/fleet/TriModel·listen 127.0.0.1:3333） |
| 2 | 节拍=**15 分钟整点写卡**（09:04:08→09:19:08→09:34:08→09:49:08→10:04:08 秒级对齐）·写前轮转备份深度 5（.bak-<UTC时刻>-<pid>-<序号 992-996>）——正身+最新 bak 同刻 10:04:08＝**机制现役在写** |
| 3 | 卡内容=TriModel provider 配置卡（version 4·machine sg-fleet·connection sg-glm·provider_entries 含 api_key_encrypted **密文**）·**不进 git**（log/status 零迹=gitignore 面） |
| 4 | BOD 原报时窗 10-08T23:47Z～10-09T00:19Z＝彼时轮转窗快照；与本席 08:18 trimc 重启**零关**（写者独立进程·trimc 重启不扰） |

## 勘正与注记

- **归域勘正**：BOD 转出件②原记「TriMMC card 写面 owner」——实勘**写面 owner=TriModel Config Plane（LG-035 P3-sg 面）**·卡名 `trimmc-card` 字样易误导归域（TriModel→TriMMC 桥接卡语义候 owner 面确认消费方向·不阻本定性）。
- **卫生观察项（非事故·低优先候办转 owner 面）**：bak×5 与正身同目录同权限 644·密文形态+同机同权限面增量≈零（不提前轮换·同 10-02 值面案判逻辑）；候选办=bak 权限收紧 600/轮转深度审视——TriModel owner 面裁量。
- 本席 08:19 sg power-gate 件卷内「TriMMC card 写面 owner 面知悉」初判（回执 BOD 09:54 信件④）随本卷勘正。

## 使用依据

- BOD 09:38 转域信件④+认账件 @bod-acceptance-20261009.md 转出件②
- sg 实勘（10:11-10:13·BatchMode ssh 只读）：文件 ls full-iso·/proc/2518071/cwd·ss -tlnp·systemctl status·git log/status
