# SDE weekly-plane-shift rc=2 深勘定性回执（COS 准令·只读零直改·62 拍精确失败点定位毕）

- sourceOfTruth: 本卷（trees/bod-fade001-sprint-plan-20261120/sde-wpshift-rc2-diagnosis-20261120.md·rc=2 深勘定性回执正身）
- syncMode: write-time
- lastSyncedAt: 卷面时戳锚=git commit 时戳（零手打·D-47 增补款正形）
- 执行席: SDE 小布（m-sde）；令源=COS 准令 weekly-plane-shift rc=2 深勘（只读诊断面·零直改·窗口=批 1 毕报后顺手窗）+WO-RW1 批 3（只读勘零写面）
- 判定: **精确失败点=score_skill_spawn 段（62 拍 job log 尾段 `[p1] score_skill_spawn rc=2` 实锚）·rc=2 载体=score_skill_spawn 模块（spawn 波缺席席全 absent→自身 exit 2）·根因=GLM 供给异常波（journal fallback 链 6min 刷屏旁证）→trap 通知链已实发——非主链 bug 非 fetch/网络面**

## §一 · 证据链五层（全程只读·零写面）

| 层 | 来源 | 读数 |
|---|---|---|
| L1 | jobs API payload.command 全文 | 主链 13 段（preflight→qualify→pull→plan→dce→verify→score_cli→rubric→**score_skill_spawn**→close_skill→close_cli→notify_done→trigger best-effort→arrival）+`set -eo pipefail`+trap shift_notify_fail 通知链+WP4 修订（11-18 pull/主链 fail 必显）+score_cli rc=2 **显式容忍条款**（`[ "$score_rc" -eq 2 ]`——rc 2 在此链有已知语义） |
| L2 | 62 拍 run_dir 文件时序 | 主链五件 17:11 批量落（plan/dce/verify/score/rubric）→score-skill.json 17:17→**arrival.json 缺席**（尾段未到）·close.json/manifest.json 20:41=f5 rescore 波覆盖写（非 62 拍原生） |
| L3 | journalctl 62 拍段 | 17:05:51 起跑→**17:11:41 failed rc=2**（lastDuration 349797ms 精确吻合）+job 执行日志路径在卷+旁证=**17:06-17:11 全窗 trimodel fallback 链 active 刷屏**（GLM 供给异常·逐次调用走 3 节点 fallback） |
| L4 | 62 拍 job log 尾段（1518 行/60069B） | **`[p1] score_skill_spawn rc=2`（stdout 面实锚）**+score-skill.json 值面：**seats=[cos,coo] 双席 absent=true rc=1**（raw_out 空会话·err=tricompass-context 注册段截断=会话起而零产出）+hard_order_gate ok=true（客观分先于主观分硬序闭合）+**`[shift_notify_fail] chain-fail alert sent (dual-address blocking)`**=trap 通知链已实发+stderr 拼接止于 fetch 行（[p1] 行在 stdout→不进 daemon lastError 拼接·机理实证） |
| L5 | state 交叉 | consecutiveErrors=**5**（58-62 拍连败=家族性五周同 error 非 62 拍孤发）·runCount=63·nextRunAtMs=**11-22T15:50Z**（周日 23:50=修复后首个全量拍） |

## §二 · 因果链定谳（精确失败点定性）

1. **根因**：62 拍（11-19 17:05:51+08）GLM 供给异常波——journal 17:06-17:11 六分钟 fallback 链 active 刷屏=供给不稳窗活体旁证。
2. **传导**：spawn 波 cos/coo 双席会话起而零产出（rc=1 absent·双席全缺）→score_skill_spawn 模块缺席席全缺→**自身 exit 2**→主链 `|| { echo "[p1] …"; exit "$RC"; }` 触发→`set -e` 整链 exit 2。
3. **通知**：trap 段 shift_notify_fail --chain-exit 2 **实发**（dual-address blocking）——62 拍失败通知面成（非零通知盲区）。
4. **daemon 记账**：lastError=「command exited with code 2」+stderr 尾段（fetch 行）——stderr 拼接面不含 stdout 的 [p1] 行=表面只见 fetch 行的迷惑形态机理定谳。
5. **与 N3 卷互证**：N3 卷「62 拍先例反向=11-19 17:05 rc=1 全断供给零」——rc=1=spawn 波层·rc=2=job 主链传形态（score_skill_spawn 对 spawn rc=1 的转译）——**同源两级**。
6. **CTO 早判勘正实锚**：fetch 段输出正常（stderr 尾=fetch 成功列 ref）=**非网络抖动族直证**（上卷 §三 已注·本次 journal+log 双面补强）。

## §三 · 修复面现状与翻转候拍

- **修复已落**：修 B fallback 链——62 拍后同 run_dir rescore 波 f5（20:07/20:36）+ns8（今晨 06:22）**全绿翻转实锚**（N3 卷 §三 spawn 七席全 rc=0 值面直证）。
- **翻转候拍**：next 全量拍=**2026-11-22T15:50:00Z（周日 23:50 北京）**——修复后首个 job 级全量拍·lastRunStatus 翻转 ok=终验读数（候拍面·无人为干预需求）。
- **遗留候选（本令边界外如实报）**：58-61 拍四拍连败谱未逐拍勘（家族面候选=同 GLM 供给窗族·候另令征深勘）·score_skill_spawn rc=2 语义码（缺席席全缺→2）码面确认归 fsd 域（本席运行面定性承）·score_cli rc=2 容忍条款与 score_skill_spawn rc=2 不容忍的对称性设计问题（候选反馈面·不属本令改面）。

## §四 · 护栏遵守

全程只读零写面 ✓（jobs API/journalctl/run_dir ls/job log tail 四面纯读）｜job 现役件禁直改 ✓（payload.command 零触碰）｜D-46（token 变量形零回显·journal keys 段 daemon 自掩码旁注）✓｜D-47（落款=date 现查原值）✓｜机位活体现探（D-24·heyuan 8710 面正名通道）✓｜repo git 操作零涉（无写面无 git 触碰）✓。

## §五 · 使用依据

- COS 准令 weekly-plane-shift rc=2 深勘（只读诊断·精确失败点定位·产出=定性回执随卷+信面一行）+WO-RW1 批 3 行
- 活体读数：jobs API payload.command 全文+62 拍 run_dir 时序（ls -la）+journalctl -u trirmc 17:05-17:25 段+62 拍 job log 尾 40 行（路径 journal 直给）
- N3 首拍卷（sde-n3-spawn-firstshot-20261120.md §三·62 拍 rc=1 全断供给反向互证+修 B fallback 翻转实锚）
- 本席上卷 sde-rw1-batch23-readings-20261120.md §三（lastError 全文初勘·62 拍同窗·fetch 正常初判）
- D-24/D-46/D-47

—— SDE 小布（m-sde·rc=2 深勘定性收口·精确失败点=score_skill_spawn 段·翻转候拍 11-22 周日窗）·写前现查 2026-11-20T02:52:05Z（+8=2026-11-20 10:52:05·date 现查原值·D-47 正形）
