# LG-022 Wave 1 构建包旧名勘验清单

## 文档同步元信息

- sourceOfTruth: TriMetaverse/docs/execution/lg-022-wave1-build-pack-survey.md
- syncMode: source-only
- lastSyncedAt: 2026-09-01（勘验批，小贾 r5；解冻令 U-20260901-01 Wave 1，董事会令「Wave 1 构建包勘验照令即起」）
- 方法：`grep -rn "TriLC|TriMC"`（排除 TriRLC/TriMMC/TriMLC 后）全景 147 处/30 文件+核心件逐行明细；两 ps1 BOM 头字节实检

## 一、总览

| 层 | 判定 | 量级 |
| --- | --- | --- |
| A 活断链 | **下次打包必炸，最高优** | 2 文件 2 处 |
| B 产物/安装面对齐 | Wave 1 主体（随下个 v* tag） | ~11 文件 ~95 处 |
| C 自洽别名 | 能跑，纯一致性低优 | CI 4 处+e2e ~24 处 |
| D 契约/历史锚 | **不动**（照 Wave 0 第 7 条扩展口径） | 其余 |
| E 文件名对齐候选 | 候董事会裁 | 数件脚本名 |

## 二、A 类·活断链（实锤）

| 文件：行 | 内容 | 断链原因 |
| --- | --- | --- |
| scripts/pack-pc/bundle.ps1:5 | `$TriLCSrc = "..\..\..\TriLC"` | 源仓目录已改名 D:\Code\ai\TriRLC（09-01 目录改名终局），下次 bundle 必炸 |
| scripts/build-desktop.ps1:28 | `$TriLCPath = "..\TriLC"` | 同上，TriCade 桌面打包必炸 |

## 三、B 类·产物/安装面对齐明细

1. **install-tricade.ps1（33 处）**：`$ServiceName="TriLC"`（L20/162）、`$TriLCDir="$InstallDir\trilc"`（L37，安装目录名）、HKCU Run 键 `TriLC`（L169，卸载清理）、**schtasks 清理段（L177-185 删 "TriLC Daemon"——对齐时须双名兼容：旧 TriLC Daemon+新 TriRLC Daemon 都清，防换名残留）**、nssm 段（L539-544 AppParameters/AppDirectory/Description "TriLC Local Controller Daemon"）、函数名 `Set-TriLCWeeklyPlaneRoot`/`Install-TriLCService`（L482/501，内部标识符）、文案多处。
2. **build-desktop.ps1（10 处）**：staging 产物目录 `trilc\`（L91-94）、步骤文案。
3. **pack-pc/bundle.ps1（17 处）**：包内目录 `tri-lc\`（L42/45/49/52）、源路径参数名 `$TriLCSrc`、文案。
4. **pack-pc/start.bat（13 处）**：`start "TriLC"` 窗口名（L38）、echo 文案；`%TRI_LC_DIR%` env 名属 pack 内部契约（对齐 TRI_RLC_DIR 候裁，改则 bundle/start 同批）。
5. **verify-trilc-service-s0.ps1（7 处）**：`$ServiceName="TriLC"`（L24）+**MSI CA 名 `InstallTriLCService`/`UninstallTriLCService` 引用（L98/113/245/254——CA 名改动牵 MSI 打包工程内部，深水面候裁：只对齐脚本侧服务名，CA 名随 MSI 工程改造另批）**。
6. **smoke-test-tricade.ps1（4）/verify-trilc-24h.ps1（2）/verify-nssm-service.ps1（2）/verify-trilc-service-manual.ps1（3）**：服务名引用+日志文案。
7. **其余散件**：fix-nssm-registry.ps1（5）/fix-nssm-paused.ps1（1）/fix-settings-and-launch.ps1（1）/dev-reset-init.mjs（4）/migrate-contract-v3.mjs（4）/git-six-repo-*.ps1（2+2）/export-tree-nodes.ps1（5）等——服务名/路径/文案，随 B 批顺带。

## 四、C 类·自洽别名（能跑，低优）

- **build-tricade.yml（4 处）**：checkout `repository: .../TriMMC` **已对齐新 repo 名 ✓**；`path: TriMC`（L114）为本地检出席位别名，L141 `TriMC/package-lock.json` 同别名引用=自洽能跑——统一为 TriMMC 纯一致性（对齐批顺带，零风险）。
- **e2e 套件（~24 处）**：测试环境自建自销的自洽引用（路径/env/文案），随 B 批顺带或独立低优。

## 五、D 类·契约/历史锚（不动）

TRILC_* env 变量名（Wave 0 第 7 条代码契约）、CLI 命令名 `trilc`（trilc.cmd/trilc start 等）、npm 包名 `trimc@0.1.0`、`trimodel` 包与 `@trimetaverse` scope、数据文件名（cron.db/sessions.db/keys.json）、`TRI_LC_DIR` 内部 env（候裁外）、docs 生成类文案（gen_tutorial_trees.py 等）。

## 六、E 类·文件名对齐候选（候裁）

verify-trilc-24h.ps1 / verify-trilc-service-*.ps1 / smoke-test-tricade.ps1 等脚本文件名本身+CLAUDE.md「Common Commands」引用段（其中 `trilc start/status` 等命令名属 CLI 契约不动，仅脚本文件名引用行随 E 类）。改名影响 CEO 使用习惯+文档引用，候裁后另批。

## 七、BOM 与纪律

- install-tricade.ps1（660 行）/verify-trilc-24h.ps1（202 行）头字节 `efbbbf`=**UTF-8 BOM 在位 ✓**；对齐批改后 BOM 纪律照旧（ps1-utf8-bom 要求）。
- 「不回溯破坏已装基座」：全部对齐只影响下次打包/安装路径；本机现役基座（TriRLC Daemon schtasks+双 daemon cmd 实例）不受安装脚本改动影响。

## 八、量级与排期建议

- 改动估算：**~120 处/~15 文件**（A 全改+B 全改+C 顺带；D/E 不动）。
- 建议一个工程窗完成：A+B+C 单批对齐+E2E/打包冒烟（bundle.ps1 dry 链路跑通为验收）；MSI CA 名深水面与 E 类文件名候裁后另批。
- 版本 bump 随下个 v* tag 发布（照 U-20260901-01 Wave 1 原文）。
