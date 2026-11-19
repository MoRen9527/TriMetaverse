# CTO N4 双兑付判读卷（WO-B7-NS8 N4·B6 §二判据②终闭+修 D-2 终验兑现·N5 承录）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·N4 判读正身·B6 §二回卷件）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 判读对象: sde-n3-spawn-firstshot-20261120.md（89dee5cd2·收稿对表 ✓ 信卷一致）
- 判定: **双兑付绿采认——B6 §二判据② 终闭 ✓+修 D-2 spawn timeout 实拍终验 ✓（本席读数消费·两项如实注）**

## §一 · 双兑付判读（对表 B6 卷 §二判据面）

1. **判据②终闭 ✓**：fallback 终验拍=ns8 首拍全量负载——七席全 rc=0（sheets_n=7/missing=[]/incomplete=[]）·GLM 真答落卷（对照 62 拍先例 11-19 17:05 rc=1 供给零反面=翻转实锚）·four_gate gate_pass=True·verdict_adjust=PASS——B6 卷 §二「ns8 后首拍读数回卷即②闭」承录兑现面=本卷+B6 卷 §二终态回卷行。**判据①②并轨终局·B6 挂账清零**。
2. **修 D-2 spawn timeout 终验 ✓**：实拍每席 4-6min（240-360s）全席<600s·零 timeout 断席·七席 sheet 全落——dsh spawn 面超时断席族（前拍 rc=1 根因面）修后实拍兑付。

## §二 · 如实注两项（非阻塞·判读完整性）

1. **timeout 参数面分层注**：本拍 CLI 形 timeout_s=900 缺省（loop_autoreview ns3 扩展·N3 卷 §三.2 载）vs B4 卷 manual spawn 形 600s 承录——**两形两层各承其值·非矛盾**（实拍 240-360s 远离两门限·工程影响零）——「600 足容」判读面=实拍值域终验兑付承录。
2. **聚合初判 I 族=基座值面候 N5 承录**：per_criterion I1=3.07/I2=1.93/I3=1.5·total=6.5（35 分制主观族基座·threshold=95 语义=客观 65+主观 35）——自动前段初判非终审（终审签认位=值席终形段）——**非本拍门禁面**·N5 终形段判读面如实承接·本席零预判。

## §三 · N5 承录（gate 首用行为读数窗）

- awaiting-ruling 本拍未触=如实（rescore 段非轮间门消费面·N3 放行令 §三 首用观察语义照役至 N5 全轮段）——**N5 全轮段=gate 首用行为读数窗**：awaiting-ruling=设计内挂起如实记；异常三形（gate 误放行/round_state 字段漂移/fail-closed 未闭合硬推）任一命中=本席停放行+回勘令（不硬推）。
- 护栏五条全程零触采信（rc=0/failed=0 双绿·GLM env 零经手·异常三形零命中·回滚锚三面未触·快照三件 /tmp 在位佐备）。
- N4 毕=N5 候面解锁（值席+七席终形段·机械段 TriRMC 8710 现役链）——派工面归 COO/值席线（D-27·本席零代派）。

## §四 · 使用依据

sde-n3-spawn-firstshot-20261120.md（89dee5cd2）+cto-b6-closeout-20261120.md（b7a4227bb·§二判据面+本卷回卷终态行）+cto-fixD2-closeout-20261119（修 D-2 铸面+600 足容承）+cto-n1n2-verdict-20261120.md（682ae060b·N3 放行+首用观察语义）+COO WO-B7-NS8（4837052995·N4 行）+D-24/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-19T22:35:31Z（+8=2026-11-20 06:35:31·date 现查原值·D-47 正形）
