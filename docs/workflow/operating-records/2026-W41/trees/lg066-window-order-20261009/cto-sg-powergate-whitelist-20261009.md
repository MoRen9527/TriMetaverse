# CTO sg power-gate 白名单件留痕卷（提前窗执行·BOD 08:15 令）

- sourceOfTruth: 本件（trees/lg066-window-order-20261009/cto-sg-powergate-whitelist-20261009.md）
- syncMode: final（执行留痕·毕）
- lastSyncedAt: 2026-10-09T08:24:00+08:00（date 现查见 commit）
- 令源: CEO 08:14 原令「sg 件不用等，能提前就提前」→BOD 08:15 转令（重启三带+毕探针三刻+活体保活）

## 一、改码与构建

- 白名单正身：sg `/srv/fleet/TriMMC/src/notify/outbox.ts` L65 `SOURCE_SEAT_WHITELIST`——`['m-duty-cos','bod','m-cos','m-coo']` → 尾加 `'power-gate'`（sed 精确字面替换·git diff 断言=精确一行）。
- 构建：`npm run build`（tsc）——dist/src/notify/outbox.js 含 power-gate=1 断言 ✓。
- **既有类型错误如实归因**：tsc 报 2 处（src/onboarding/session-initializer.ts TS2345+src/contracts/resolver.ts）——与本次改动零交集（模块隔离+错误类型与数组字面量无关；outbox 零错误 grep 计数 0）；**未 stash 复验，既有定性系推断+隔离证据，如实注记**。tsc emit 非 noEmitOnError 形，dist 照常产出。
- **管道退出码坑如实记**：`npm run build | tail` 的 BUILD_EXIT=0 系 tail 退出码非 tsc——后改用错误族分布 grep 断言（chained-command-assert 家族再+1）。

## 二、重启三带（BOD 令全绿）

| 带 | 读数 | 判 |
| --- | --- | --- |
| ① 重启前 jobs 备份 | `jobs.json.bak-x1-powergate-20261009T0816Z`（cp 毕·root 属主已 chown 归还 fleet） | ✓ |
| ② jobs 存续值面验 | 顶层 {$schema,version,jobs}·jobs=obj:**10**（与 BOD 基线对表）·重启前后同读 | ✓ |
| ③ executor 首轮滚动探 | cron/logs 08:18 两笔新笔（新 pid 下调度面活）+/tmp/trimc-run.log mtime 08:19 活跃 | ✓ |

- 重启本身：`systemctl restart trimc`——OLD_PID=3961889 → NEW_PID=1728191·active·8712 监听随新 pid ✓。

## 三、毕探针三刻（BOD 令全绿）

1. **8712 healthz=200** ✓（sg 本地）。
2. **power-gate 源模拟投递=200**（本机→18710 隧道→sg 8712→白名单新条→outbox——端到端全链·**昨晚 403 缺口闭合锚**）+**m-cos 存量源回归对照=200**（扩条不回归）✓。
3. **四跳尾实证**：8713 poller 60s 拉取——notify-mailbox.json（`D:/Code/ai/TriMLC/`·cwd 默认落位非 trilc-channel·勘勘路时走弯一次如实记）mtime 08:19·letters=1330·尾两笔=power-gate(00:19:49Z)+m-cos(00:19:50Z) 值面解析实证 ✓。
4. **notifyFailures 归零路径知会**：8713 healthz 现值=7 冻结（探针通知非闸事件不触发计数；清零=下次真闸事件成功投递自动清零·powerMonitor dispatchNotify 设计）——8713 未重启（活体保活），计数面与 sg 件解耦。

## 四、收尾与留痕

- **root 属主清点归还**：`find -user root -newermt 08:14` 初查 1 件（jobs 备份）→chown fleet → 复验 **0 件残留**（TriMMC 仓+trimc 数据目录）。
- sg TriMMC 仓 commit：`decba1f`（白名单一行）→ bare 并行笔收编 merge → bare 顶 **0e12959**（ls-remote 对表一致）。
- sg 仓 git 纪律坑如实记：root 会话 merge 须带 `-c user.name/email`（无 identity 即 fatal——commit 带 merge 忘带，二跑补）。

## 使用依据

- BOD 08:15 令（CEO 08:14 原令）；LG-069 勘修毕报（03:4x·403/400 实锚）；命令单 @377e90b5（token sed 提取形复用·token_len=64）；sudo 白名单 R-HY 件与 sg 件为两物分记（R-HY=LG-066 施工面 15 行·sg=notify 源席面 5 席）。
