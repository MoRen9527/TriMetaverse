# STE·A 层 graceful 验证卷（FSD 施工卷 ste 验位，COO 14:4x 派）

- sourceOfTruth: 本件（A 层 graceful 验证卷；对象=fsd-alayer-graceful-readout-20261003.md 五验点）
- syncMode: static（验毕毕报→BOD 复核链）
- lastSyncedAt: 2026-10-03T06:49:02Z（date 现查）
- 验证席: STE 小柯（m-ste）；零转抄 ✓（四态/静态断言/活体链全部独立复测，FSD 读数仅对表）

## 一、验点读数总表（五项全过）

| # | 验点 | 本席独立读数 | 判 |
| --- | --- | --- | --- |
| ①a | healthz 探针 | HTTP **200** | ✓ |
| ①b | 无令 /internal/v1/config/show | HTTP **401** | ✓ |
| ①c | 错令（64 位零串） | HTTP **401** | ✓ |
| ①d | **主锚·对令**（env 文件管道取值 X-Internal-Token，token-len=64 零回显） | HTTP **200** | ✓ |
| ①e | 加验·/healthz?x=1 带参非豁免形 | HTTP **401** | ✓（精确豁免语义活体成立） |
| ② | daemon.env 静态断言 | size=**677B**/lines=**10**/CR=**10**（全行 CRLF）/键名十枚/尾键=**TRILC_INTERNAL_TOKEN** | ✓ 与 FSD 写后断言全对表 |
| ③ | pidfile==监听 | .trimetaverse/trilc-8711.pid=**52752**==8711 监听 pid=**52752**==daemon.log `ready — pid=52752` | ✓ 三点一值 |
| ④ | 两项勘正认读 | 见 §三，均认 | ✓ |
| ⑤ | 回滚锚面确认 | 见 §四，成立（确认未执行） | ✓ |

## 二、独立复得实锚

- **四态+加验探针**：curl 状态码 only（body /dev/null），token 经 `sed -n 's/^TRILC_INTERNAL_TOKEN=//p'|tr -d '\r'` 管道提取未入会话链。
- **值源链活体闭合**：对令 200 的令值取自 trirlc-daemon.env L10 → 审定单 §41 主锚语义（env 文件→gate→过门）端到端独立复现，非仅状态面。
- **目标文件勘定**：`%LOCALAPPDATA%\trirlc\daemon\trirlc-daemon.env`（mtime 10-03 14:29=FSD 写窗吻合）；邻接 trirlc-daemon.ps1/cmd（9-30 代）为启动器族。
- **进程面**：pid 52752=node TriRLC/dist/index.js；8711 监听（Get-NetTCPConnection）OwningProcess=52752；config-cache.json mtime 14:46=daemon 活体持续写。

## 三、勘正认读（④）

1. **ps1 90s 超时 daemon 幸存=非缺陷**：认。独立旁证=daemon 52752 现存活（cli.js start daemonize=detached 子进程形，ps1 链被杀不波及）——与卷勘正①机制自洽。
2. **「face-events mlc pull」系 R-HY 窗借用语汇、本机 8713/8711 零直链**：认。与既有拓扑事实一致（本机 8713 channel 走 127.0.0.1:18710 TriMMC 隧道面；keys 源=R-HY 8711 桥）——本机 A 层主锚=对令 200 已独立复得，勘正②不削弱验证结论。

## 四、回滚锚确认（⑤）

卷 §三「daemon.env 删 L10（TRILC_INTERNAL_TOKEN）+stop/ps1 链重启=回原全拒态」：**成立**——gate 令源=该 env 文件单键，键删→无有效令→全拒态复原；单行回滚零级联。本席确认锚面，未执行回滚（执行属回滚窗授权面）。

## 五、值面泄漏两案如实记档（候定性，不隐瞒）

1. **FSD 自查案认收**：channel.cmd 勘时 awk 第二规则泄四键值头 15-21 字符入会话链（同盘同 ACL 面，10-02 三 token 先例同形）——本席认收事实面，定性归 BOD/CAO。
2. **本席验证侧操作瑕疵自曝**：四态探针前寻址阶段误触 `/d/Code/ai/.env`（非目标文件，137 行），键名提取 sed 对无 `=` 注释行不截断，L2 一条疑似 OpenAI key（# 注释态）泄入会话链；即停枚举，该文件非验证对象、未入卷读数。同族（键名提取边界未先断言行形），并入案 1 候定性；工具侧修法候议=键名提取前先滤注释行+断言行含 `=` 再截断。

## 六、判定

**PASS——四态独立复绿+静态断言全对表+活体三点一值+回滚锚成立**；D-04 完工锚三层（辅锚1/辅锚2/主锚）独立复核全绿。A 层 graceful 施工质量门过，候 BOD 复核链。

## 七、使用依据

- COO 14:4x 验证派（五验点）；FSD 卷 fsd-alayer-graceful-readout-20261003.md（对表）；审定单 cbd0abab（§41 主锚语义）
- 实锚：四态+加验 curl 读数（06:4xZ）；trirlc-daemon.env 静态断言+键名面；.trimetaverse/trilc-8711.pid；Get-NetTCPConnection 8711；Win32_Process 52752 命令行；daemon.log ready 行；TriRLC src/paths.ts（pidfile 8711 命名空间）+src/config/env.ts（TRILC_ENV_FILE 候选链）
- 关联纪律：值面零出机（管道提取+指纹形）；禁裸杀（零 stop/start 动作，本验全程零写面零重启）；D-04 完工锚三层
