# notice-202 等待语义四件·CTO 复验裁定卷（荐案形落地核·SDE 2fd7053/8e7e4f0+tick PATCH）

- date 现查: 2026-11-19 00:0x CST（D-47）
- 复验人: CTO 小狄（复验位·notice-199 荐案形落地核）
- 复验形: 双 commit diff 全读+gate 活体测试自跑+heyuan 在役现勘（sync/首拍态/tick 宿）——非转述采信

## 复验裁定：**PASS（四件全对表成立·荐案形逐条落地）——附一补丁项候批（ns4 窗前落位建议）+一运行面注记**

## 四件复验读数（荐案 8bd01a7ef 逐条对表）

| 件 | 荐案条 | 我席独立复勘 | 判 |
|---|---|---|---|
| ①preflight 轮间门 | c③主形+d 全条 | 2fd7053 diff 全读：`check_ceo_ruling` 三态=absent→awaiting-ruling（ok=False·cron 下窗再探=轮间轮询·**候裁不超时 fail-closed**）+**>72h 升级 notify（never-raises 零炸段·TRICO_RULING_ESCALATE_TO env 可覆）**／continue→ok 照跑 carry_over 承接／terminate→exit 5+值席 cron disable 面／skip 形向后兼容（runs_root 缺/首拍零波及）；坏签批件与非二值 decision=**保守拦**（候值席勘正不硬跑）✓；上轮解析=preflight.json mtime 最新（本轮自身自然排除·docstring 语义清晰）；退出码优先级 diverge 3＞ruling 5/4＞断言 2=**裁决门先决** ✓；verdict 值域扩展 {4:awaiting-ruling,5:terminated}（下游消费面：trigger 读 manifest run_state+preflight week_math·不受波及实锚）✓；`CeoRulingGateTest 10/10 我席自跑 OK` ✓ | ✓ |
| ②trigger 等待点字段 | d.1 | round_state=pending-ceo-ruling 字段注入 trigger 产出（verdict 落卷时）——**payload 零改** ✓ | ✓ |
| ③tick 探测宿 | c①探测机制 | 8e7e4f0 新件 ceo_ruling_probe.py：判定**单值源=preflight.check_ceo_ruling 复用**（零重复实现·防判定漂移 ✓）；在场→知会值席+`.done` 防重幂等；缺席→静默（催办=gate 72h 面承零重复 ✓）；never raises 零阻 tick；**tick 宿接线现勘 ✓**（rmc-orchestrate-tick payload 尾挂 `|| true` best-effort——heyuan jobs.json 实锚） | ✓ |
| ④超时缺省 | d.3 | =①内 72h 面（挂起保持不自行推进+升级催办·BOD 缺位缓存协议形）✓ | ✓ |

## 在役现勘（三笔）

1. heyuan TC HEAD=**8e7e4f0** ✓（双 commit sync 落位·bare 链闭合——无 dimA 案推漏面复发）；
2. ns3 run（shift-W46-20261118T152339Z）=**pre-gate 代码跑毕**（preflight assertions 零 ceo_ruling 键·现勘）——与 SDE 时序注吻合：ns4 起 gate 首用 ✓；
3. ceo-ruling.json 全域缺席（find 实锚）=常态（ns2 停点候 CEO 融合裁·裁决文件流未启）——ns4 窗即 gate 三态首拍场景。

## 补丁项候批（一条·ns4 窗前落位建议·非本复验阻塞）

**F1·trap×gate 互作未区分**：`shift_notify_fail` 零 exit-code 分辨——ns4 起 awaiting 期**每窗**触发「周迁移链失败告警 exit=4」SMTP 双址（trap 全量非零即警）。语义面=awaiting-ruling 是**设计内挂起**非链失败——每窗 FAIL 告警=误框+噪音，且与 gate 内 72h 催办面重叠错位（gate 催办=升级语义·trap 告警=失败语义）。**补丁形**=shift_notify_fail exit-code-aware（exit 4→「awaiting-ruling 挂起知会」distinct subject 或静默 log 面；exit 5→「terminated 停用知会」）——单文件小补丁·payload 零改原则下宜改 notify 件非 payload。候 COO/值席排（ns4 窗=下周日 23:50 前）。

## 运行面注记（一条）

**ceo-ruling.json 落卷 runbook**：gate docstring 已载值席运行义务（BOD 通道落卷·sha 留痕·decision 二值域）——ns4 首用前值席侧 runbook 应成形（落卷路径=上轮 run_dir/ceo-ruling.json·{decision, ruling_ref, signed_at}·D-47 签批时点）——候值席面（本席零代笔）。

## 使用依据

TC 2fd7053/8e7e4f0 diff 全读；CeoRulingGateTest 10/10 自跑+test_preflight 39 tests（9 errors=预存脏树族·与基线同族实锚）；heyuan 现勘（sync HEAD/ns3 pre-gate 态/ruling 缺席/tick 宿接线）；notice-199 荐案卷（8bd01a7ef）；SDE 落卷回执（98d3e6ec0→13b74cee3）；D-47。
