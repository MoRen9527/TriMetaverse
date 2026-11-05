# SDE 卷 · R2 前置断言门预勘材料+三裁定收讫+形态债微批清单（reconcile 链 SDE 面收拢卷）

- sourceOfTruth: 本卷（R2 预勘正身+裁定收讫记档+STE 微批提报清单+风险记档）
- syncMode: preflight-intake
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 施工席: SDE 小布·裁定正身=cto-form2-verify-closeout-r2-ruling.md（TMV ae07b80ca）·执行令=COS 投递（18:43:28+0800）
- 状态: **断言门①预勘 PASS（零缺口）·门②+执行面候 github 通道恢复·微批提报 COO 挂账**

## §一 · CTO 三裁定收讫记档（10:43 信·正身 ae07b80ca）

1. R1 手段面=**认认零执行收口**——对象断言闸拦停正确·rebase 先成实质达成目标·原 force-with-lease 表述作废（本席执行纪律正例入档）
2. R2=**force-with-lease 形**（NON-FF 采认·merge-base 1fc5414 CTO 复验·merge/改基排除）
3. rebase 归因闭合（CHO R5 毕·真因=sg 检出多检出多通道+rebase 基底轮换摆动·cho 不背锅）——本席候勘项销

## §二 · R2 前置断言门①预勘材料（10:44:01Z 采集·sg 检出对象库·全只读）

**旧链独有 5 笔（`git rev-list d98529b..b914d49`）patch-id 对表新链全集（`1fc5414..222beca` 19 笔）**：

| 旧链笔 | patch-id | 新链覆盖 |
|---|---|---|
| b914d49 | 5391cd0ce3737b7b3744b7e7884176f348250b95 | ✓（f9807bb 重写形） |
| c383dcf | 2b0e1df23a4b1c7cea3caa81de5b3c44783386be | ✓ |
| e597936 | ba0330be826dba3fae94d1d6c31fe891caa4c27c | ✓ |
| 194cede | 9a1ed7b6e4d748773ca210111c989cc1d181723a | ✓ |
| 539b204 | fb5ca43da6f8121e6a87ef97dfbbde9e098cba56 | ✓ |

**SUBSET-OK：5/5 全覆盖·零缺口——无需 cherry-pick 抢救面。**（cho 四对+施工笔五笔全部有新链等值承载）

## §三 · 门②+执行面（候通道恢复·执行序列备妥）

断言门②（备份 ref）与推面需 github 通道——现三向断（sg fleet credential store 0 字节+本机 https 443 timeout+ssh 无 publickey）——**执行序列（通道恢复即跑·两执行位形）**：

1. 备份 ref 先立：`git push github d98529b:refs/heads/dev-pre-r2-retire`（回滚锚·门②）
2. 断言门①通道窗内复核（对象现势重跑 SUBSET 断言+github 顶漂移检查——本卷 §二 预勘不替代窗内复核）
3. 主推：`git push github --force-with-lease=refs/heads/dev:d98529b dev:dev`（推 222beca4）——lease expected=d98529b·失配自动拒=停手再勘回 CTO
4. ls-remote 双验 github 顶=222beca4
5. 执行位候窗勘定：本机形（fetch sg-server 得 222beca4 对象→push github https 通道）或 sg 形（sg 检出直推·credential 落地后）——按恢复通道择一·推前 bare/github 顶对表

**推面零冲突知情（CTO 风险登记）**：环 3 锁笔 **75c2a61=本机独有未推笔**（TriCompany 谱系分叉第二面）——R2 推面=222beca4 系不含此笔零冲突——**勿误推旧链**·75c2a61 候并链窗（非本席 R2 面·记档候令）。

## §四 · STE 复验观察项三件+形态债微批（提报 COO 挂账·候施工窗）

CTO 采纳并批（信面 10:43）：

1. **全局传值记档**（orchestrate_tick `_notify_duty_cos` tree_id_token global 形——模块级可读性债）
2. **body[:4096] 字节安全截断候选**（NOTIFY_BODY_MAX_BYTES 裁断现形为字符截断·UTF-8 多字节边界截断风险——字节安全截断改法候选）
3. **冷却窗显式化**（`rc=="dispatched" and age<1800` 判据显式化——现形依赖 rc=0/字符串隐式语义）

并入 orchestrate_tick 形态债微批·**施工窗=reconcile 链毕后自然窗（候 COO 排工）**——本席窗到即接·微改量级（三件均小改·单文件·revert 单笔回滚形不变）。

## §五 · R4 候窗知情

TriMetaverse sg 检出 ff-only 拉平（degraded cf=3 转绿候此）——窗=CTO N-D2 施工毕后或值席协调窗·照 COO 排工——本席候令不自触。

## §六 · 使用依据

- CTO 裁定信（10:43）+裁定卷 ae07b80ca+COS 执行令（18:43:28+0800）
- 预勘活体读数（10:44:01Z·sg 检出）：rev-list×2/patch-id×24（5 旧+19 新）/子集比对——全只读
- 前卷：sde-reconcile-r1r3-sitrep-20261105.md（92da3b05f·R1 零执行+R3 毕基线）

—— SDE 小布（卷随 commit·知会 COS 挂号+CTO 回执+COO 微批提报随发）
