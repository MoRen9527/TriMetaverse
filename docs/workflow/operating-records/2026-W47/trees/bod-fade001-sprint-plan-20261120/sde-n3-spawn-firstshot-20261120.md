# SDE B7 N3 首拍读数卷（WO-B7-NS8 承·spawn 七席起跑毕·七席齐+gate PASS+N4 双兑付读数齐收）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/sde-n3-spawn-firstshot-20261120.md·N3 首拍读数正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=CTO N1/N2 裁卷 682ae060b（N3 放行 APPROVE·护栏五条照役）+COO WO-B7-NS8-20261120（§二 N3 行）
- 判定: **N3=毕（七席齐零缺席零不完整·gate_pass=True·verdict_adjust=PASS）——首拍 rc=0 值面+七席齐门禁双双过；N4 双兑付读数一拍齐收（§三）**

## §一 · DCE 四步执行实录（每步自检）

| 步 | 动作 | 读数 | 判 |
|---|---|---|---|
| 0 | 对象面勘定 | 62/63 先例 run_dir 正形=/var/lib/trirmc/cron/runs/shift-W46-20261119T090551Z（plan.json/close.json/convene/seats 全套在·62 拍 rescore 重拍=f5 序列覆盖写既定先例形）——本拍=对该 run_dir rescore 再拍（ns8 形） | ✓ 定谳 |
| 1 | 改前快照（回滚锚） | convene/ 全树+rescore 两 log 三件→/tmp/ns8-pre-snapshot-*（TS=20261119T214654Z·fleet 属主 cp -a） | ✓ |
| 2 | dry 核形 | loop_autoreview --dry→four_gate 四断言全 ok（①migrate n=0=0②W47 树 n=3③必迁族无缺④close verdict=pass run_state=pending_manifest 值域合法态）·gate_pass=true·seats_planned 七席全 | ✓ |
| 3 | 实弹起跑 | `sudo -u fleet nohup python3 loop_autoreview.py --run-dir <62拍> --spawn`（timeout_s=900 缺省·log=rescore-spawn-ns8.log）——PID=2738440（fleet 属主）·首行「spawn cos…」·存活断言双进程过 | ✓ |
| 4 | 收口 | 七席逐席「sheet 落卷（改善意见面完整）」×7·aggregate-initial.json 68564B 落卷·主进程退·链毕 | ✓ |

插曲如实（零真发不计拍数·R6 先例语）：首发起跑被本机 shell 层 $R 预展开拦截（展开空串→Permission denied）——勘正=heredoc 单引号定界形重发（本地零展开远端展开）——零真发·远端进程零断·与 R6 拍发侧「--data-binary 漏 @」同族嵌套展开坑。

## §二 · N3 首拍终态读数（门禁对表：spawn rc=0 值面·七席齐）

- **七席齐 ✓**：sheets_n=**7**·missing_seats=**[]**·incomplete_faces=**[]**（改善意见必付面全完整·fail-closed 排除零触）——convene_mode=auto·SEATS 七席全（cos/coo/cao/cpo/cto/cho/cfo）。
- **逐席落卷时序（+08）**：cos 05:54→coo 05:58→cao 06:03→cpo 06:08→cto 06:12→cho 06:18→cfo 06:22——逐席串行 spawn·每席 4-6min·全席「sheet 落卷（改善意见面完整）」。
- **four_gate 终态 ✓**：gate_pass=**True**·verdict_adjust=**PASS**（非 RETRY 降）——四断言终值同 dry 形（close verdict=pass run_state=pending_manifest 合法态）。
- **聚合初判（自动前段·终审签认位保留）**：per_criterion I1=3.07/I2=1.93/I3=1.5·total=**6.5**·seats_counted=7「全席形」——主观 I 族基座值面（35 分制·threshold=95 挂七席联审平均分面=客观 65+主观 35 语义·候 N5 全谱链毕终形段）。
- 改善意见聚合三题在卷（imp_topics_n=3·68564B aggregate-initial.json）。
- check_time=**2026-11-19T22:22:43Z**（+8=06:22:43·aggregate 落卷终戳）——首拍全程 05:47 起跑→06:22 走毕≈35min。

## §三 · N4 双兑付读数（回卷 B6 卷 §二·CTO 读数消费面）

1. **fallback 终验拍②=下拍 failed=0 ✓（B6 §二判据②终闭兑付）**：本拍=修 B fallback 链后首个全量负载拍——spawn 七席全 rc=0·failed 面=missing_seats[]+incomplete_faces[]+缺席注零——**failed=0 值面直证**·GLM 真答落卷（62 拍先例反向=11-19 17:05 rc=1 全断供给零·本拍翻转实锚）。B6 卷 §二「ns8 后首拍读数回卷即②闭·随 ns8 自身首拍自然兑付·零额外窗」承录兑现。
2. **修 D-2 spawn timeout 实拍终验 ✓**：timeout_s=900 缺省（CLI ns3 扩展注·B4 卷「600 足容」承录对照）——**实拍值面=每席用时 4-6min（240-360s）全席<600s**·零 timeout 断席·七席 rc=0 sheet 全落——600s 足容实拍终验兑付。

## §四 · 护栏遵守对表

首拍 rc≠0/failed≠0 候裁线未触（rc=0/failed=0 双绿）·禁重试风暴未触发·GLM env 机器内注入零经手零回显（D-46）·GLM 速率=逐席串行天然限速·回滚锚三面未触发（快照三件 /tmp 在位=第五锚佐备）·异常三形（gate 误放行/字段漂移/fail-closed 未闭合）零命中（gate_pass=True 判定单值源=close.json 落卷真值·四断言逐项 detail 在卷）。gate 首用 awaiting-ruling 形态=本拍未触（rescore 段非轮间门消费面——ns8 手动循环形态照 D1 §一A 款三·候 N5 全轮段 gate 行为读数如实记）。

## §五 · 使用依据

- CTO N1/N2 裁卷 cto-n1n2-verdict-20261120.md（682ae060b·N3 APPROVE+护栏五条+域勘窗两裁定）+判据卷 cto-n1n2-gate-verdict-criteria-20261120.md（779c99aa0）
- COO WO-B7-NS8-20261120（4837052995·§二 N3/N4 行+§三护栏四族）
- CTO B6 收口卷 cto-b6-closeout-20261120.md（b7a4227bb·§二判据②载体面+§三双兑付承录）
- cto-fixD2-closeout-20261119（B4 卷·timeout 600 足容承录+回滚锚三面）
- heyuan 活体：62 拍 run_dir 值面+loop_autoreview.py CLI（dry 核形+实弹）+rescore-spawn-ns8.log 全程+convene/seats 七席卷+aggregate-initial.json
- D-24（机位活体现探）/D-46（值面零回显）/D-47（落款=date 现查原值）

—— SDE 小布（m-sde·B7 N3 首拍收口+N4 双兑付读数候 CTO 读数）·写前现查 2026-11-19T22:29:41Z（+8=2026-11-20 06:29:41·date 现查原值·D-47 正形）
