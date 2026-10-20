# FSD 施工毕报 · FUZZY-TS gate merge 收编豁免 · 2026-10-15

- sourceOfTruth: 本卷（docs/workflow/operating-records/2026-W42/trees/fuzzy-ts-gate-merge-exemption-20261014/fsd-fuzzy-ts-merge-exempt-exec-20261015.md）
- syncMode: static（单窗毕报）
- lastSyncedAt: 2026-10-15T01:37:54Z（date 现查原值·UtcNow 形）
- 令源: CTO 派工单（本树 dispatch-cto-fsd.md·10-15 勘正转直跑形态·CTO 勘正信 09:29:40 +0800）
- 施工位: FSD 小全（m-fsd）

## 一、hook 正身位置与改动点

- **正身**: `TriMetaverse/.git/hooks/pre-commit`（fuzzy-timestamp gate 段 L14 区；ledger JSON gate 段**零动**）。
- **改动锚**: 终版 md5=`2a4fbe229530885daf82f71857b87c9f`；施工前备份=`pre-commit.bak-pre-mergeexempt-20261015`（md5=`0947dcfc36682df018c2cce743441b07`·同目录·回滚=copy 回）。
- **形态限制（如实标记）**: `.git/hooks/` 不受版本管理——hook 无仓内版本面，备份即回滚锚；终版全文以活体文件+双 hash 锚为准（本卷不录全文——hook 内含 gate 模式串本体，录旧稿即自缠被拦·本卷若需引用只录结构描述）。
- diff 规模: 对备份 29 变更行（fuzzy 段重构·ledger 段逐字节未动）。

## 二、实现形（判定面设计）

MERGE_HEAD 在（merge commit 态）→ 逐 staged 文件（同款两 exclude pathspec）判净新增：

- `t1` = index 对 HEAD 的 + 行（剥 `+` 前缀·sort）
- `t2` = `git show MERGE_HEAD:<file>` 全量内容行（sort）
- 净新增 = `comm -23 t1 t2`
- fuzzy 模式只对**净新增集**跑——命中才拦。

**判定面用父系内容集而非 merge-base..MERGE_HEAD diff 变更集**（施工中自纠一次）：diff 变更集漏「board 侧未动而 merge 择边收编的 dev 既有行」（案由精确形）——内容集判定全形覆盖：纯收编/冲突任一侧择边=豁免，两父系皆无的手工净新增=拦。且不依赖 merge-base（无关历史 merge 同样正确）。ff 不产 commit 天然不触发。

**豁免域一致性**: 净新增判定与全量形同款 exclude（docs/memory/** + trees/**/*archive*.md）——BOD 10:58/10-13 两裁豁免域不因本改弱化。

## 三、门禁读数（沙箱七态全 PASS 9/9）

临时沙箱仓（mktemp）+真 hook 拷入+真 commit 触发：

| 态 | 场景 | 期望 | 实测 |
| --- | --- | --- | --- |
| S1 | 非 merge 普通 commit 新增模糊行 | 拦 | PASS rc=1 gated（**拦截回归零弱化**） |
| S2/S2b | 非 merge 干净 commit（dev/board 侧） | 放行 | PASS |
| S3 | merge --no-ff 无冲突纯收编 | 放行 | PASS（**豁免态**） |
| S4 | **案由精确形**: merge 冲突择 board 侧收编既有模糊行 | 放行 | PASS（**豁免态**） |
| S4b | board 侧 commit 保留既有模糊行（未动行不进 diff） | 放行 | PASS |
| S5 | 混合 merge: 择边收编+手工净新增模糊行 | 拦且只拦新增 | PASS rc=1·hits **只含 handmade 行·legacy 行零出现**（拦截面精确收窄实证） |
| S6 | ledger gate 段（坏 JSON） | 拦 | PASS rc=1 gated（**第一段零动回归**） |
| S7 | memory/** 豁免域模糊行 | 放行 | PASS（**exclude 面不弱化**） |

施工中抓修两 bug（均门禁期自纠·未出窗）：①初版 `_ts_excl` 双 pathspec 单变量赋值=sh 幽灵命令执行（第二 pathspec 被当命令跑·且 exclude 只生效一半）——改写死；②t1 未剥 `+` 前缀→comm 零匹配全判净新增（S4 案由形仍拦）——活体诊断（merge 态当场 dump t1/t2/comm）抓根因·加 `sed 's/^+//'`。沙箱脚本自身两轮自污染（stderr 日志入仓被 `git add -A` stage）也系门禁期自纠——终版日志移仓外+精确 add。

## 四、既有拦截回归与历史案例

- **else 全量分支逻辑逐语义未动**（仅模糊模式串提取为变量 `_ts_pat`+grep 形等价重构）——原拦截面（非 merge commit）行为不变（S1/S2 回归实证）。
- 历史拦截案例同型覆盖：10-14 COO 模糊时点案（gate 首拦他席并行笔·COS merge 环节·案值后缀形略）=S5 同型（入库环节含模糊占位被拦）复验 PASS。
- **真仓实操复验（如实标记）**: 沙箱已覆盖 merge 三形（无冲突/冲突择边/混合）；真仓 wt/board↔dev 合流实操候**下一次自然合流场景**活体验证（hook 已就位·不造真仓 commit）——候 CTO 认定此点门关闭方式（自然场景回填 or 沙箱证据即足）。

## 五、已知限制（识别即标记）

1. **squash merge 不设 MERGE_HEAD**→走全量形照拦——若实操合流用 squash 形则案由场景仍被拦（候实操合流形勘定·若 squash 为常态再扩 CHERRY_PICK_HEAD/SQUASH 面判定·候 CTO 裁）。
2. cherry-pick（CHERRY_PICK_HEAD）同未扩面——同上候裁。
3. hook 无版本管理（`.git/hooks/` 不入仓）——多机/重装场景 hook 需重新部署（现 dev 机单点·sg 侧合流面若用 pre-commit 需同步部署·候 CTO 知会）。

## 六、CAO 纪律面衔接

派工单 §二约束③：CAO 纪律册条款注记（merge 收编豁免面入 D-47 族谱 gate 正形段）随 R 窗 CAO 自理——本卷供其引用锚（hook 改动点 hash+判定面语义）。

## 使用依据

- CTO 派工单 dispatch-cto-fsd.md（裁语照录+施工四步+验收门·10-15 直跑勘正）
- COS 派工裁源（裁二出路 c·gate 拦截面收窄到新引入内容的 commit 动作）
- 纪律册 D-47 族谱 gate 跨席拦截面正形段（拦≠拦错·三步正形·时点两形分野）
- 沙箱七态实证读数（本卷 §三）
