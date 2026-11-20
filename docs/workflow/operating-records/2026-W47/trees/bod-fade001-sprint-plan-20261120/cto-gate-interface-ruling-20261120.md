# CTO gate 现役件接口定谳卷（D3-D8 解冻前置·三方对表毕·FREEZE 解除裁）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/·gate 接口定谳正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 正形）
- 令源: BOD 催令（D3-D8 解冻前置·gate 接口定谳·CEO 10:10 催办制恢复延续 14:00）——本席 D2 终审卷（c74b4b1f3 §三候决②）裁定「真件接入前必须 git 全谱溯源+接口对表勘毕才接线·零勘直接线=FREEZE」——本卷=该勘定之施工
- 勘定方法: 六仓 hash 存在性扫描（cat-file）→fetch 后对象库直读三 commit diff 全读→骨架码面实勘→D1 §一C 设计对表——三方对表（A 现役件/B 骨架承形/C 设计形）非转述采信

## §一 · 现役件 A 定位与接口全谱（勘定主结论）

**「notice-202 三态 gate 现役件」=TriCompany `runtime/cognition/` CEO 裁决门族——谱系三笔全定位**（六仓扫描：本地 TC 检出落后致零命中·fetch sg-server 后三 hash 全命中 commit——见 §四根因）：

| commit | 件 | 接口面 |
|---|---|---|
| 2fd7053 | preflight.py +141 行（check_ceo_ruling 本体）+joint_review_trigger.py +4 行（round_state=pending-ceo-ruling 注入）+test_preflight.py +113 行（CeoRulingGateTest 10 案） | `check_ceo_ruling(runs_root: str\|None, now_ts: datetime\|None=None) -> dict`：返回 `{ok, state, detail, prev_run_dir?, prev_run_age_h?, escalated?, ruling_ref?, signed_at?}`——state 值域=**skip / awaiting-ruling / continue / terminated** 四值；退出码映射=awaiting→4（挂起不超时 fail-closed·cron 下窗再探）/continue→0/terminated→5（job 停用=值席 cron disable）/skip→ok=True 零阻断（向后兼容）；真值源=上轮 run_dir/ceo-ruling.json `{decision: continue\|terminate, ruling_ref, signed_at}` 二值域·坏卷/非二值=**保守拦**（→awaiting-ruling 候勘非硬跑）；72h 升级=_notify_blocking 催办（TRICO_RULING_ESCALATE_TO env 可覆·never raises） |
| 8e7e4f0 | ceo_ruling_probe.py 新件 64 行（tick 宿探测探针） | 判定**单值源=check_ceo_ruling 复用**（零重复实现）；在场（continue/terminate）→知会值席+`.done` 防重幂等；缺席→静默 exit 0（催办=preflight 72h 面承零重复）；never raises 零阻 tick（payload 尾 `|| true`）；退出码 0=常态/2=探测面异常如实审计 |
| a1488a9 | shift_notify_fail.py +37 行（F1 exit-code-aware 补丁） | exit 4 awaiting-ruling=**静默 log 形**（形 B 勘定采认·设计内态零 SMTP）；exit 5 terminated=distinct subject 停用知会；其余码链失败告警原形零动+F1ExitCodeAwareTest 3 案 |

- 现役件 A 消费域=**CEO 裁决文件流（轮间门）**——真值源=值席经 BOD 通道落卷 ceo-ruling.json（sha 留痕）。
- 复验谱系：本席 bd1786e2d（四件复验 PASS）+5ae2460d9（F1 补丁复验 PASS·「等待语义线五环全闭」）——定稿承③引的两卷即此。

## §二 · 三方对表定谳（A 现役件 × B 骨架承形 × C D1 §一C 设计）

**B=骨架承形**（TMV/.fade/fsd-drafts/runtime/cognition/score_skill.py·270 行实勘）：`GATE_STATES=("continue","terminate","absent")`+`gate_probe_fn() -> str` 注入形+verdict 族=pass/terminated/absent/blocked_seq_lock/fail；docstring 自注「生产形=notice-202 三态 gate 现役件接入·候窗」。

**C=D1 §一C**：判决链=「cos 判决卷替代/并列 ceo-ruling 面——**事件源双轨并读形**：debug=CEO 候批（**202 门**）/evolution decision=COS 判决卷（eviction_decision: evolve|hold）·**两卷齐=迭代放行**（AND 门）」。

**定谳·接线三层结构**（D3/D4/D5 接线正形）：

| 层 | 面 | 正形 |
|---|---|---|
| 层 1·CEO 裁决门 | debug 态候批（202 门） | **现役件 A 原样复用零改动**（check_ceo_ruling+ceo-ruling.json 文件流+probe tick 件+F1 补丁·单值源纪律）——C「202 门」直指此件 |
| 层 2·COS 判决门 | evolution decision 事件源 | **A 的同构仿形新实现**（check_cos_decision：真值源=run_dir/cos-score.json eviction_decision evolve\|hold 二值域·四态值域/保守拦/fail-closed 挂起/退出码映射/72h 升级面全同构承）——「替代/并列 ceo-ruling 面·双轨并读」的落位=与层 1 AND 门并读——仿形非改现役件（现役件零触碰） |
| 层 3·席位等待门 | spawn 七席编排等待 | **骨架 B gate_probe_fn 注入形为准**（白盒 31 案资产保值）——生产探针=薄适配件（调层 1/层 2 dict→投影 state 字串·Skill 本体零改动） |

### 校准项五件（B vs A 漂移面·接线时逐项落实）

1. **值域命名**：B `absent` ↔ A `awaiting-ruling`（挂起态正名）——接线定谳=gate state 面统一 A 值域四值（含 skip 向后兼容）；Skill verdict 落卷面 B 族保留（`absent` verdict=挂起面落卷·映射表 A state→verdict：awaiting-ruling/skip→absent）。
2. **返回形**：B `gate_probe_fn() -> str` 简化注入 vs A dict 全谱——定谳=**B 签名保持 str 注入形**（31 案白盒零改动）·生产探针内做 dict→str 投影（适配件承转换·detail/age/escalated 面留在探针审计 log）。
3. **72h 升级面**：层 1/层 2 自带同构承；层 3 席位等待门超时候升级语义=候 D3 接线窗细勘（**候窗项非阻塞**）。
4. **幂等/防重**：层 2 仿形含 `.done` 同款；层 3 verdict 落卷即幂等锚——同构成立零新增。
5. **never raises**：层 2/3 探测面同款承（零阻宿·白盒案补）——层 1 现役件已自带。

## §三 · FREEZE 解除裁与施工窗注记

- **解除**：gate 现役件接口定谳=本卷——「零勘直接线 FREEZE」前置条件消解。D3 进化判据接线/D4 COS 综合判决形/D5 close 接线全部**解冻**（接线正形=§二三层结构+校准五件）。
- **施工窗注记**：本卷只裁接口面——接线施工面仍候 COO 统排（WO-RW1 批 2 语境不变·D-27 v4）——BOD 催令问「勘定需配窗/候件」答：**勘定毕零候件零候窗**·施工候统排。
- 层 2 同构仿形施工时白盒对表=CeoRulingGateTest 10 案镜像族（check_cos_decision 同款十案形）+骨架 31 案回归锚零漂移。

## §四 · 附带勘定发现（如实入账）

1. **「定稿承③谱系零命中」根因勘定**：D2 终审时 fsd 报谱系零命中=**本地 TC 检出落后**（2fd7053/8e7e4f0/a1488a9 在 sg-server TC dev·fetch 后全命中）——非件不存在。实锚一条入值面纪律族：**hash 断言前先 fetch（检出落后≠件不存在）**。
2. **落位纪律项·实锚路径补**：score_skill.py+test_score_skill.py 现落 **TMV/.fade/fsd-drafts/runtime/cognition/**（gitignore 面·零 git 版本锚）——收口窗部署项①「代码面进 git 真源位」正解路径=**迁 TC runtime/cognition/ 落仓**（与令 1 件 score_cli 系同域·6992f64 谱系已在 TC 现役位）——已有清单项·本卷补精确实锚。
3. **check_seq_lock 双定义行号实锚**：骨架 47 行首定义+70 行第二定义（后定义覆盖）——STE 已实勘逐行同文零行为差·部署窗前置勘去重维持（先跑 31 案+146 全树回归锚绿后勘·行号实锚补记）。

## §五 · 使用依据

BOD 催令（gate 接口定谳·D3-D8 解冻前置）+TC 2fd7053/8e7e4f0/a1488a9 diff 全读（fetch sg-server 后对象库直读）+骨架 score_skill.py 270 行实勘（TMV/.fade/fsd-drafts/）+D1 设计卷 v3-final §一C+定稿承记（bd1786e2d/5ae2460d9 复验谱系）+本席 D2 终审卷（c74b4b1f3 候决②裁定原文）+D-15/D-24/D-46/D-47。

——CTO 小狄（m-cto）·写前现查 2026-11-20T02:18:00Z（+8=2026-11-20 10:18:00·date 现查原值·D-47 正形）
