# SDE 毕报卷 · TriMLC 卫生三件（卫①卫②卫③全毕）

- sourceOfTruth: 本卷（trees/trimlc-hygiene-20261015/sde-hygiene-closeout-20261015.md）
- syncMode: static（毕报留档卷·令源=BOD 直跑派工 2026-10-15 09:09（CEO 令·不等窗））
- lastSyncedAt: 2026-10-15 09:14:23+08:00（date 现查原值）
- 执行席: SDE 小布（m-sde）；对象=TriMLC 仓（D:\Code\ai\TriMLC·branch=dev）；毕报=COS 链（BOD 令文路由）+COO 终验

## 三笔 commit（时序）

| 笔 | hash | 内容 | 体量 |
| --- | --- | --- | --- |
| 卫②A 建锚 | `6c11a9c` | 19 个 notify-mailbox-backup-pre-bod-*.json 先 add 入库建恢复锚（git rm 形态前置） | 64588 insertions |
| 卫②B 清理 | `ddc4d45` | git rm 16 个（1342…2112 时序族·留最近 3 余档） | 51928 deletions |
| 卫①+卫③ | `25940ad` | .gitignore 补两条+scripts/digest-inbox.mjs 收编入库 | 89 insertions |

## 各件读数

- **卫②**（备份清理·留 3 清 16）：删前抽验 3 余档（2242/2212/2142）`json.load` OK 全通过→19 件先入库（6c11a9c·untracked 直删无 git 历史不可恢复，故先建锚正形）→git rm 16（ddc4d45）→删后工作区断言：余档恰 2242/2212/2142 三件 ✓。
- **卫①**（.gitignore 补两条）：`dist-bak-pre-*/`（449 构建产物·实勘现有规则 `dist.bak*/` 带点形匹配不上连字符目录名——系 449 文件一直 untracked 的根因，本条正中缺口非重复）+`notify-mailbox-backup-pre-*.json`（挡未来新增）。
- **卫③**（digest-inbox.mjs 归位）：勘验已在 `scripts/` 正位（untracked 态）→本笔收编入库完成归位。

## 差异面如实记（令文 vs 实况）

1. json 族实数 **19 非令文 20**→按 COO 裁定意图「留最近 3 个余档（mtime 降序）」执行=留 3 清 16（非令文字面清 17）。
2. **git rm 形态前提不成立**：19 件全部 untracked（git 历史零记录·直删不可恢复）——正形=先 add 入库建锚（6c11a9c）再 git rm（ddc4d45），贴令文「git rm 形态（仓内文件 git 历史可恢复）」意图。
3. **异族 2 个未动**（不在令文 glob 内）：`notify-mailbox.backup-20261011T140859.json`、`notify-mailbox.json.bak-pre-bod-onboard-ack-20261014`——候权属面裁处。
4. gitignore 现有尾段 `dist.bak*/` 带点形系历史规则缺口（非本批引入）。

## 终验读数（供 COO·令文指定两断言）

- **470 未提交清零断言** ✓：git status untracked 残留=**2**（仅异族 2 个）；dist-bak 两目录 449 文件+json 16 删除面全从 `??` 面消失。
- **gitignore 生效断言** ✓：`git check-ignore` 形+status 对表双证——`dist-bak-pre-*/` 与 `notify-mailbox-backup-pre-*.json` 两规则生效（匹配面不再出现在 untracked）。

## 使用依据

- BOD 直跑派工（09:09·卫①补两条/卫②留3清17 git rm 形态+抽验 3/卫③归位 scripts/·毕报经 COS 链+COO 终验）
- 活体勘验：TriMLC 仓 git status/git log/git rm·json.load 抽验·gitignore check-ignore
- 记忆条：closeout-commit-hygiene（毕后 commit）/append-script-openw-double-blow（避坑）
