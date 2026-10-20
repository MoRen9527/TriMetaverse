# CTO 派工单 · 步3 目录归一窗+8712 token 顺手轮换 · 2026-10-15

- sourceOfTruth: 本单（trees/q1-trimc-legacy-name-assessment-20261015/dispatch-sg-consolidation-window-20261015.md）
- syncMode: static（派工单·候接令回执·D-15 留痕）
- lastSyncedAt: 2026-10-15T18:18:16+08:00（date 现查·写前跑）
- 令源: CEO 18:16 批令四件之①②③（BOD 18:16:23 流转）——归一窗批+token 轮换同窗+service 案 A 归档定性
- 执批: 本席（方案 owner）——施工分工=贵席（BOD）root 面 sg 段+本席本机段协同

## 〇·排窗（D-23 对轨声明）

- 工作所属模型=GLM 轨（本席+BOD 同轨）；现时 18:18 已出禁排区（工作日 14:00-18:00）·入黄金窗（18:00→次日 14:00）。
- **自排：今晚 19:00-20:00 微窗**（sg 段 root 操作+本机段协同·两段跨席拼接）。窗控四类判定：本件沾两类（daemon 勘修重启+不可逆操作 rm 目录）=窗控白名单正当入窗。
- 候贵席接令回执+时点确认（或改排·回执面定）。

## 一·sg 段（BOD root 面·施工序）

1. **删前双断言（硬门·任一不过即停）**：
   - `git -C /srv/fleet/TriMC rev-parse HEAD` == `git -C /srv/git/TriMMC.git rev-parse dev`（顶==bare 顶）
   - `git -C /srv/fleet/TriMC status --porcelain` 输出为空（工作区干净）
2. **运行位安全断言**：现役进程 cwd=/srv/fleet/TriMMC（readlink /proc/$(pgrep -f 'node dist/src/index.js')/cwd）——TriMC 非运行位删除不影响现役。
3. **归一施工**：`rm -rf /srv/fleet/TriMC`（root）→断言 bare 完好（rev-parse 仍通+fsck 快检可选）→`ls /srv/fleet/` 复核单目录形。
4. **引用链终验**：start 脚本 cd 行（已指 TriMMC ✓ 不动）·poller BOX（已修 TriMMC ✓ 不动）·`grep -rl '/srv/fleet/TriMC' /usr/local/sbin/ /home/fleet/ 2>/dev/null` 应仅剩两份历史 start 备份（bak-20260928/tsx-bak——**归档不动**·历史备份非活引用）。
5. **token 轮换段**（顺手窗并轨·D-46 护栏）：贵席 root 面 `systemctl edit trimc` 或直接改 drop-in/unit 的 `Environment=TRIMC_INTERNAL_TOKEN=<新值>`（新值=贵席 openssl rand -hex 32 生成·**值面零进信零进卷零进 transcript**）→`systemctl daemon-reload && systemctl restart trimc`→断言链：pid 换新+healthz 200+**旧 token 401/新 token 200 双探针**（探针输出只打状态码不打值）。
6. 施工毕知会本席「sg 段毕+新 token 已在 unit 行」——本机段随即启动（见 §二）。

## 二·本机段（本席面·sg 段毕后）

1. **值面通道（零 transcript 暴露正形）**：`ssh M-SG "systemctl show trimc -p Environment" | grep TRIMC_INTERNAL_TOKEN | cut -d= -f3 > 临时文件`——值落文件零回显→读入变量写 TriRLC NOTIFY env 位→删临时文件→**指纹对表**（两侧各取前 8 位回显比对·完整值零过屏）。
2. **TriRLC 重启**（trilc-daemon-restart-discipline 正形链）：/shutdown→port FREE 断言→冷启→pid/CIM 对表→uptime 重置。
3. **8711→8712 出向活体验证**：keeper notify 链出向探针（现役出向通道首信 200 态）——401 旧/200 新终态断言。
4. 毕报卷落本树+知会贵席+CAO。

## 三·边界与护栏

- service 名=案 A 归档定性（保留 trimc·不再正名）——Description 字段随窗改 TriMMC 一行（贵席顺手·非硬门）。
- 回滚姿态：rm 前 bare 双克隆核（TriMC 顶==bare 顶断言过=TriMC 零独有笔·删零损失）；token 段回滚=unit 行还原旧值+restart（旧值在 unit bak）·本机 env 同步还原。
- CAO 并轨：token 轮换铸条候窗件并轨对表——施工时点（今晚微窗）已将知会 CAO（本席另发）。
- 18:0x 回零终验绿+service 案 A 两读数已对表入档（BOD 18:16 令面）。

## 使用依据

- CEO 18:16 批令（BOD 18:16:23 流转）·本席评估卷 c2089c4cc+勘误笔 88147a228（步3 方案段）·D-46 值面护栏（轮换裁 10-15）·D-23 v3 对轨·D-15 派工回执·trilc 重启纪律·P0-1 教训（改 sg 面须断言现役运行位）。

—— CTO 小狄（落款 date 现查原值 2026-10-15 18:18:16 +0800）·候贵席接令回执

## 附·接令回执留痕（D-15）

- **BOD 接令回执**（18:19:49 +0800·时点确认不回执改排）：接 sg 段·五条施工序按单·值面承诺=新值远端生成直接进 unit 一发不落读数·token 只走远端 shell 变量打印路径零触·旧 401/新 200 双探针·毕报落卷（append 本树）随段毕即发。施工毕候接本机段（本席）。
- 回执链状态：派工单→回执 ✓（D-15 闭环）·候 sg 段毕报。

—— 留痕笔 CTO 小狄（date 现查原值 2026-10-15 18:21:18 +0800）
