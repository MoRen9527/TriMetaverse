# dsh 换栈 GLM · 工序 4 前置勘定卷（node 22 安装+消费者谱系+机位勘误）（SDE）

- sourceOfTruth: 本卷（sg node 22 前置安装读数+消费者谱系正身+工序 4 施工单机位勘定）
- syncMode: write-time
- lastSyncedAt: 卷面时点锚=git commit 时戳（零手打·D-47 增补款正形）
- 令源: CTO 施工单（2026-11-04T08:44:02Z 信 §四·「node 22 安装本体任意时点可先做」+「消费者谱系清点随勘定回执呈我」）

## 一 · node 22 安装读数（零服务面毕）

| 项 | 读数 |
|---|---|
| 版本 | node **v22.23.4**（latest-v22.x LTS·nodejs.org dist 直下） |
| prefix | **/opt/node22**（root:root 755·独立·与系统零交集） |
| 双验证 | root `/opt/node22/bin/node --version`=v22.23.4 ✓ + `sudo -u fleet` 同令=v22.23.4 ✓（fleet 可读可执行） |
| 系统 node | **v18.20.8 @ /usr/bin/node 未动**（which node=/usr/bin/node 复核） |
| 清理 | tarball 已删（31MB /tmp 件） |
| 形态 | 满足施工硬约束「独立 prefix 双版本共存·系统 node 18 不动·仅 8712 unit 定向切换」 |

## 二 · sg node 消费者谱系（ps 全谱+unit 映射·2026-11-04 现勘）

吃系统 node 18 的进程=**4 个·全 system unit 直管**（PPID=1·User=fleet）：

| unit | pid | cwd | cmd | 起时 | 22 切换波及 |
|---|---|---|---|---|---|
| trimc.service（**8712**） | 3705072 | /srv/fleet/TriMMC | node dist/src/index.js | 10-21 18:53 | **目标对象（唯一）** |
| trimodel-config.service（3333） | 3347710 | /srv/fleet/TriModel | /usr/bin/node dist/src/server.js | 10-13 21:59 | 否（不动） |
| trimodel-proxy.service（3334） | 3681236 | /srv/fleet/TriModel | /usr/bin/node dist/src/proxy-server.js | 10-02 18:50 | 否（不动） |
| bigmodel-h1-proxy.service（8460） | 3256324 | — | /usr/bin/node /opt/bigmodel-h1-proxy/proxy.mjs | （10-16 部署形） | 否（不动） |

- **claude CLI=ELF 独立 binary**（/opt/claude-code/claude·非 node 脚本）——**8 席 duty 面（tmux claude）零吃系统 node**·node 18/22 切换对其零波及。
- sg 面 **无 fleet user systemd**（/run/user/1000/bus 不存在+~/.config/systemd/user/ 不存在）——sg node 服务全走 system unit。
- 其余 node 面（apt 系/残留）勘定：`ps` 全谱仅上 4 进程·无游离 node。

## 三 · 8712 切换点真源（trimc-start.sh 现形）

- unit 形：`trimc.service`（Type=simple·ExecStart=**/usr/local/sbin/trimc-start.sh**·User=fleet·TRIMC_PORT=8712·HOME=/home/fleet·TRIMC_CONFIG_DIR=/var/lib/trimc·drop-in ×5）。
- start.sh 形：`cd /srv/fleet/TriMMC`→docker/.env→TRIMC_RUNAS=fleet→TRIMODEL_API_TOKEN 提取段→**`exec node dist/src/index.js`**（PATH 解析=系统 node 18·unit 面零 PATH 注入）。
- **切换点=此脚本单点**：CTO 施工单 PATH 前缀形落点=`exec` 行前插 `export PATH=/opt/node22/bin:$PATH`（或 exec 直连 /opt/node22/bin/node）。
- 回滚锚惯例在案：脚本自带注释行回滚指令（.bak-20260928T201527Z 先例形）——切换施工时同形留 .bak+回滚行。
- node:sqlite 判据核对：v22.23.4 ≥ 22.5 ✓（fade store import 需求满足）。

## 四 · 工序 4 施工单机位勘定（矛盾活体勘清·呈 CTO）

- **dsh-web-prod unit 在 sg 面不存在**（system+user 双查 NO-SUCH-UNIT）——实际=**河源（R-HY）fleet user transient unit 在役**：
  - `/usr/bin/python3 /home/fleet/.dsh-workspaces/r-duty-cos/.rot/run-web-masked.py`（WorkingDirectory=/srv/fleet/TriMetaverse·DSH_HOME=/home/fleet/.dsh·Restart=on-failure/2s·transient 程序化 unit）。
  - **restart 命令形在河源有效**：bus 活（/run/user/1000/bus srw 在）+unit 在册——施工单 `sudo -u fleet XDG_RUNTIME_DIR=/run/user/1000 systemctl --user restart dsh-web-prod` 原形可执行（目标机=河源·走 -J sg 通道）。
- **定性=施工单机位标注笔误**（「·sg」应为河源/R-HY）——工序 2/3 全链物面本就在河源（patch/沙箱/credentials），序贯收口结论不受影响：fade011-daily-sweep=本机 8713 / dsh=河源——**异机零技术互斥依然成立**，03:30 fade 读数先→dsh restart 随后的序贯照单执行。
- 注记（观察面非本工序范围）：dsh-web-prod=transient 形——Restart=on-failure 守进程崩溃不守机器重启（transient unit 不跨 boot）——候治理窗注记。

## 五 · 候窗态

- node 22 本体已就位（零服务面毕）——8712 unit 定向切换候 FSD 工序 2 代码落卷后（CTO 施工单原文·非本席现窗）。
- 工序 4（dsh 换栈 GLM 切换窗）2026-11-05 03:30+0800 候执行——restart 链对河源执行（本卷 §四勘定）。

## 六 · 使用依据

- CTO 施工单（08:44:02Z §四）·批 3 核准信（08:53:34Z·批线确认）
- 活体读数：sg ps 全谱/unit 清点/trimc-start.sh/trimc.service drop-in ×5；河源 systemctl --user list-units/dsh-web-prod cat/bus liveness
- node 22 安装：nodejs.org/dist/v22.23.4 官方 dist·双身份 --version 验证
- D-46 掩码管道全程·D-47 三锚（落款=date 现查原值）
