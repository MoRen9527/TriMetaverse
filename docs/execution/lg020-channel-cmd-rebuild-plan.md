# TriMLC-Channel cmd 重建方案（LG-020 线·§8.5.1 悬案处置前置件）

- sourceOfTruth: TriMetaverse/docs/execution/lg020-channel-cmd-rebuild-plan.md
- syncMode: source-only｜lastSyncedAt: 2026-09-05
- 性质：CEO 提权动作卡前置方案（CTO 域拟；提权执行=CEO 管理员终端）

## 一、现勘事实（2026-09-05 勘定书在卷）

- 启动件 `C:\Users\jedih\AppData\Local\trilc-daemon-channel.cmd` **缺失**（文件系统硬事实，不涉权限面）——即使 TriMLC-Channel 任务在册，打火必败（cmd 缺即败）=§8.5.1 悬案根因候选。
- TriMLC-Channel 任务在/缺**本席不可决**（powershell Get-ScheduledTask=Medium 盲区 §8.5.1 在册；cmd schtasks 通道输出空）——CEO 管理员终端一行枚举定谳。
- 8713 连接拒=既知候令态（服务未起）。

## 二、CEO 提权动作卡（管理员终端，顺序执行）

1. **枚举定谳**：`schtasks /query /fo LIST /v | findstr /i "TriMLC"`——在册→跳 2 只补 cmd；缺席→2+3 全做。
2. **cmd 重建落位**：`C:\Users\jedih\AppData\Local\trilc-daemon-channel.cmd` 写入（内容骨架见 §三；**token 现取现注不入方案明文**——恢复源=中央面侧登记或 §8.4 期手执记录）。
3. **任务重挂（若缺席）**：§8.4 双口径正身照录——PowerShell（已跑成先例）：`schtasks /Create /TN "TriMLC-Channel" /SC ONSTART /DELAY 0001:30 /TR "C:\Users\jedih\AppData\Local\trilc-daemon-channel.cmd" /RU SYSTEM /F`。
4. **打火验证**：手动 `schtasks /Run /TN "TriMLC-Channel"`→`curl http://127.0.0.1:8713/healthz` 预期 ok——**§8.5.1 弧线注意**：/Run 撞 ONSTART+DELAY 队列怪癖（打火无痕则读 taskrun.log 判层，§8.5.1 判读条在卷）。

## 三、cmd 内容骨架（env 全集照通道 spec §四；token 现取现注）

```cmd
rem TriMLC channel daemon launcher (rebuilt 2026-09-05, LG-020)
set TRILC_CHANNEL_MODE=1
set TRILC_PORT=8713
set TRILC_DATA_DIR=%LOCALAPPDATA%\trilc-channel
set TRILC_CWD=D:\Code\ai\trimlc-channel
set TRIMC_BASE_URL=http://47.245.122.61:8710
set TRIMC_INTERNAL_TOKEN=<现取现注：中央面 token>
set TRIMODEL_API_TOKEN=<现取现注：现役值>
set TRILC_ENV_FILE=D:\Code\ai\.env
C:\Program Files\nodejs\node.exe D:\Code\ai\TriRLC\dist\index.js >> %LOCALAPPDATA%\trilc-channel\channel.log 2>&1
```

（node 路径/env 键集以 §8.4 期 CEO 手执记录为准复核，本骨架为结构示意；dist 路径按河源教训对齐现役构建位。）

## 四、CRLF/编码教训条款（§8.5.1 弧线在案）

1. cmd 文件**行尾强制 CRLF**（LF 使 cmd 解析行为未定义）——写入后 `file` 或十六进制核 `0D 0A`；
2. cmd 文件**禁 BOM**（BOM 炸 cmd 首行——与 ps1 BOM 纪律相反，双纪律并存按文件类型分立）；
3. 内容纯 ASCII（rem 注记禁中文，防 GBK/UTF-8 编码面事故——FSD emoji 崩启同族）；
4. 重建件与任务引用路径**逐字符一致**（大小写+扩展名）。

## 五、校验条款（四步）

1. cmd 文件在位+CRLF+无 BOM+纯 ASCII 四断言；
2. 任务在册（枚举复核）+State=Ready；
3. 手动 Run 打火→8713 healthz 首绿（`"ok":true`）；
4. ONSTART 自启验证候系统重启窗（§8.5.1 验收顺延条款不变）。

## 六、P4 硬前置链（本方案位）

cmd 重挂毕+8713 healthz 首绿→董事会发 P4 开窗令（硬停 22:00 不变）→窗内五事项（执行单另线 FSD 备妥中）。
