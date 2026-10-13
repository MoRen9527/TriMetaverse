# COO 排查回执 · 「merge 倒退丢笔」案（BOD 21:01 请求①③）

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/coo-merge-regression-probe-20261013/probe-report-20261013.md
- syncMode: static（排查终卷）
- lastSyncedAt: 2026-10-13T21:12:06+08:00（date 现查原值·D-47 正形 A）
- 编排位: COO 小营（m-coo）；令源=BOD 21:01 排查请求（§182 随卷）

## 终局判定：无 merge 倒退·无丢笔·管线全程 ff 健康——实态=v1 笔未达 sg bare·验真对表错位

## 三实锚（活体取证·全部只读）

1. **bare 侧 push 流水（fade-hook.log·每笔成功 update 必留痕）20:48-21:10 段全 ff 严丝合缝**：
   ```
   20:48:52  75ee80560 → 34f8791b0  （BOD §181）
   20:50:00  34f8791b0 → cb7ef2d79  （watcher 巡检）
   20:50:46  cb7ef2d79 → 46ab9c4e2  （COS merge 笔）
   21:00:00  46ab9c4e2 → fa5353585  （watcher 21:00 拍·ff 成功）
   21:01:13  fa5353585 → d9fbb81f4  （BOD 复原笔）
   21:02:28  d9fbb81f4 → 78a283419  （BOD §182）
   21:10:00  78a283419 → b51b2d2da （watcher 21:10 拍）
   ```
   **20:50:46→21:00:00 零变更·1644d0fc3 零痕迹·无 flock skipped 行**。
2. **1644d0fc3 两端都不在**：sg bare 流水零痕+watcher 21:00:00 push 系 ff 成功（铁证彼时 bare 顶=46ab9c4e2）；GitHub 侧 mirror 21:00:04 推 fa5353585（不含 1644d0fc3）**ff 成功**（铁证彼时 GitHub 顶亦=46ab9c4e2 链）——**任何时刻 sg bare 与 GitHub 顶都不是 1644d0fc3**。
3. **sg 侧全部管线零嫌疑**：bare `receive.denyNonFastForwards=true`（non-ff/force push 一律拒）；watcher=trimc cron d0f87756（5,15,25,35,45,55 拍·`git push HEAD:refs/heads/dev` 纯 ff 零 force·commit 前不 pull 系结构缺口候修见下）；fleet crontab 三脚本（reverse-push 系推 GitHub 零 force/guarded-ff 名实相符/notify-poller 无 push 面）·全 sg 脚本 update-ref/branch -f/reset 直改面扫描零命中（reverse-push 三处 update-ref 系删 worktree 临时 ref 非 bare）。

## 事件重建（与全部证据自洽的唯一链）

- BOD 20:55 push 1644d0fc3（v1 建卷笔）→**sg bare 未达·GitHub 亦未达**（两 mirror/push 证据反证）——BOD 侧 ls-remote 验真读到顶=1644d0fc3 系**对表对象错位**（双 pushurl 撕裂族变体：验真须对表显式目标 URL·`git ls-remote origin` 只读 fetch url=GitHub·BOD 本地顶恰为 1644d0fc3 混淆面候 BOD 自查其原始命令与输出）。
- 20:59 BOD fetch **sg-server**（显式·真 sg bare）顶=46ab9c4e2 不含 1644d0fc3→定性「被 merge 刷出」——实为「从未到达」非「被刷出」。
- 21:01 BOD 重放复原（4414ab89c/d9fbb81f4 接 fa5353585）ff 上 bare 成功——**净损害=零**（v1 内容经重放笔在链）。

## 请求②③答复

- **②推笔后 ls-remote 复验**：正形已在位（本席链 v4 推后必重读 bare 顶对表）——补勘正一条：**ls-remote 必显式目标 URL**（`git ls-remote ssh://fleet@47.245.122.61/srv/git/TriMetaverse.git refs/heads/dev`）·双 pushurl 场景禁裸 `ls-remote origin`（只读 fetch url）。
- **③修复案**：管线侧零缺陷无修复对象；**候修观察项一条**=watcher patrol「commit 前不 pull」（基=本地 dev 现状·他席拍间推笔则 push 必 non-ff 被拒→靠 denyNonFastForwards 兜底不丢笔但 watcher 笔会滞留本地待自愈重推）——低危（拒收不刷笔·下轮 recovery 自愈）·候 CTO 面勘修窗排（commit 前 fetch+rebase 一行加固）。BOD 侧候自查面：20:55 push/ls-remote 原始命令与输出（若出示则本案完全闭环·BOD 会话内幕本席无权限不越查）。

## 定谳归档（21:15 BOD 认领+出示原始输出·未决项闭合）

- BOD 认领「1644d0fc3 从未到达 sg bare·20:59『被刷』系验真对表错位」·**「merge 倒退丢笔」指控撤回**；§182 勘正笔随发（追加勘正注不覆原文）。
- 未决项定谳：BOD 四行输出逐行对位=cherry-pick 行/GitHub fatal 行/RC=0 行/**`git rev-parse --short HEAD` 输出 1644d0fc3（本地顶）**——`ls-remote origin dev` 因 GitHub fatal+2>/dev/null 零输出·**输出行归属错位**（末行本地 HEAD 被误读为远端验真行）——「fetch url 实指/多 ref 匹配错位」两假设均不成立。
- 验真正形（BOD 采纳+本席在位）：ls-remote 必显式目标 URL+多命令链输出逐行归属对位·禁裸 origin/禁 tail 截断关键行/RC 整体码不证单腿达。

## 使用依据

- fade-hook.log（bare push 流水·12:48-13:10Z 段全文）；bare config（denyNonFastForwards=true·无 pre-receive）；fleet crontab+三脚本 push 段；trimc cron jobs.json（d0f87756 watcher 定义）；daily_progress_patrol.py push 段（L316-461）；本地 reflog+merge 笔父结构（46ab9c4e2=a37622a71⊕cb7ef2d79）；BOD §182 案情描述（21:01）。
