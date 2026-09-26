# 裁决记录·波④ 发现-A（stub restore 八连败）+ 三项候裁（TASK-TRIMODEL-RECOVERY-LADDER-01）

- sourceOfTruth: 本件（波④ 发现-A 裁决正身；D-15 枢纽留痕件）
- syncMode: final
- lastSyncedAt: 2026-09-26 11:1x +0800（date 现查 11:08 Bash）
- 发现席: STE 小柯（F2 臂停臂上报+根因实锤补充，两报在卷）
- 证据卷: ste-wave4-execution-log.md（F1/F2 节+发现-A 根因实锤节）

## 发现-A 定性（采 STE 补充实锤，修正前报）

**根因=channel cmd PATH guard v2 回归（2026-09-26 引入），非 daemon cron 环境固有盲区**：

- guard v2（FSD 修 daemon spawn env-cwd 断所加）把 PATH 钉成瘦四段（System32/Wbem/WindowsPowerShell），**不含 `C:\nvm4w\nodejs`**；
- 生效时点=daemon pid 45972 启动 ≈08:01:56（FSD 落钉位重启笔）——波③ 05:53:56 restore-done 成功样本在 guard 前（旧 env 含桌面 PATH），本波 09:08 首试即败，八连败全落瘦 PATH 窗内，时间线自洽；
- launch.cmd 用 node 全路径故 L1 复活链不受影响；stub 裸调 `cmd /c "node …"` 独踩。

定性：**环境支撑面回归（FSD 改动引入），非 core 纪律缺陷、非波③ 交付缺陷**——波③ 接线验证在当时的桌面 PATH 环境是真实的；guard 改动时缺「guard 后环境可达性自检」步是流程缺角（见裁示④）。STE 八连败取证+log 全量回读使根因可归位——前置核验与取证纪律价值再实证。

## 枢纽裁决（CTO，2026-09-26 11:1x）

### 裁示① 修法：guard 行追加 nodejs 段（根因位修复）

- **裁可**：channel cmd L29-31 guard 追加 `;C:\nvm4w\nodejs`——根因在 guard 把 node 从环境拿掉，恢复环境=修根因，且一处改动覆盖全部 spawn 面（stub+未来 cron job+daemon 链）。
- **否**：stub 改 node 全路径——绕过根因且新增硬编码漂移面（版本切换/路径迁移风险），未来新增 cron job 再踩同雷。
- nvm4w 的 `C:\nvm4w\nodejs` 为 junction 指向当前版本，路径稳定，追加安全。
- **附带建议（入候办非强制门）**：guard 行后补一行可达性自检（`where node` 断言，失败即 daemon 日志 ERROR）——防同类回归再犯；FSD 修复时顺手落，不单列波次。

### 裁示② 时序：先出窗还原→FSD 修复重启→重进窗补验；25/25 手动线不等

1. **STE 先履行出窗还原**（臂间停顿正当时）：删 DRILL WINDOW 钉位→（FSD 侧统一重启）→出窗三读数核验（healthz 200/cron 拾取态正常/钉位键零残留+flag 零残留——STE 已报 flag 自愈清零、release-3333.flag 零残留，核验后签）。
2. **FSD 修复**：guard 追加段+按重启纪律重启（TriMLC 8713 同族纪律：stop 前验监听 pid==pidfile pid→stop→改→start）+重启时**一并重落 DRILL WINDOW 钉位**（重进窗，新窗计时起算）+`where node` 自验读数随报。
3. **STE 重进窗**：F2 补验门（一轮最小实弹：占位→L1 检测→flag 落盘→cron 拾取→restore-done→**drill-settings.json/drill-audit.log 首次产生**（钉位触达实证）→真活体 hash 零变化）→毕则 F2 闭臂→接 F3→F4→F5。
4. **25/25 对照不等修复**：STE 手动跑（`node D:\Code\ai\TriMLC\dist\cli.js model restore-direct`，逐案 env 钉沙箱）不依赖 daemon cron PATH，候修复窗期间继续——时序利用最优。对照表 T2d disposition 改道与形态映射（F-1 双载体等）候本席验收时逐条对。

### 裁示③ 超窗追认

超窗 ~38min（cap 10:07，收证 ~10:45）**录档追认，不当罚项**——超窗原因=八连败取证+log 全量回读，系发现-A 取证义务的必要代价。窗管理条款补注：**超窗随报有因→录档追认；无因超窗→下窗收紧**。

### 裁示④ F1 闭臂+发现-B/观察-1/观察-2 处置

- **F1 闭臂**：7 断言全 ✓（33.7s 拉起/38.3s health 200/log 逐字/新 pid 25208/L2 零误触发/hash 零接触）——F1 臂 PASS。
- **发现-B（auth-dead 误报）**：挂账候办，**波④ 不修**。理由：①本波=沙箱演练，误报实弹样本是宝贵设计输入，F3 臂实弹 auth-dead 分支还能补厚读数；②keys 探针二次确认（确认轮数/间隔参数）=防线判定面变更，演练中动判定逻辑=基线漂移，候 CEO 测试窗后另批；③挂账条目与「正式恢复梯启用前 restore 写目标语义显式知情」（wave4-dispatch-gap-ruling 候办）**合并为正式启用门禁两条件**：keys 探针稳健性处置（二次确认设计，输入=本轮+F3 误报读数）+restore 写目标知情裁决。
- **观察-1（watchdog 拉起前不验端口持有者）**：STE「无害 fail-safe 方向」定性认——录档挂账，与发现-B 同族（探针 8s 超时线稳健性），并入同一候办条。波④ 不动拉起逻辑。
- **观察-2（L1「≤70s」口径）**：口径注记入终报——**「≤70s」断言口径仅对 connect-refused 型进程死成立**；慢应答/黑洞型注入不在口径内（PS5.1 IWR -TimeoutSec 对可连不应答失控，v2 35min 实证）。注入技术三代迭代（v1 SO_REUSEADDR 二绑/v2 IWR 失控/v3 独占+accept 即关）作为测试工艺资产留卷。

### F2 臂状态

**未闭，候补验**——主注入链六断言绿（L1 检测节律 rounds~71s/flag 契约逐字×6/cron 拾取 17-19s≤2min/fail-closed 保留×8/自愈清 flag×2/真活体零接触全程 hash 491F…78B2 不变）；restore 子链断=发现-A（已裁修法），补验门见裁示②第 3 步。dispatch-wave4 验收门①「任一臂不符→停下上报不硬走」程序履行正确。

## 使用依据

STE 停臂上报+根因实锤补充（2026-09-26 10:5x/11:0x）；ste-wave4-execution-log.md；dispatch-wave4.md（7f1c62ed）验收门①④；wave4-dispatch-gap-ruling.md（1e305b34）窗管理四条款；trilc-daemon-restart 纪律（同族 TriMLC）；BOD 预口径②防线继承铁律。
