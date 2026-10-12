# 栏 C 勘读指令单 · R-HY TriRMC token 指纹（零写面·值面零回显）

- sourceOfTruth: 本件（trees/1011-window-family/cto-columnc-rhy-token-probe-order-20261011.md）
- syncMode: static（勘读指令单·值席通道消费件）
- lastSyncedAt: 2026-10-11T02:07:07Z（10:07:07+08·date 现查原值）
- 出单席: CTO 小狄（m-cto）；令源=COO 09:58:58 栏 C APPROVE（通道自裁条款：「值席 SSH 或 BOD 直操均合规，你出指令单后与 BOD/值席面直接衔接即可」）
- 通道前提实锚: 本机→R-HY 直连探测 `ssh -o BatchMode=yes fleet@8.155.54.79` → **Permission denied (publickey)**＝本机无 R-HY key·直连不通——故出本单走值席通道。

## 一、任务目的

R-HY（河源·8.155.54.79）TriRMC 8712 服务域 daemon 的 token 指纹勘读——401 heartbeat 断点三择一定向：

- **对表基准（本机 token 指纹·已勘）**：`len=64·tail4=e075·sha8=d50a0760`（sha8=sha256 前 8 位 hex 小写）
- **断点三择一**：①本机 token 未在 R-HY 登记／②R-HY 登记的是旧值／③各机独立 token 系（分发漂移族）

## 二、红线（执行前必读）

1. **零写面**：只读探针——禁改 unit 文件／禁重启 daemon／禁写任何文件／禁 PATCH API。
2. **值面零回显**：token 值任何形式**不进输出、不进回卷、不进会话链**——一律走掩形管道（§三），禁 cat/grep 原文粘贴。
3. **不硬闯**：权限受阻（sudo 需密/非同 uid）即回报 `blocked:<原因>`，禁提权试探升级。
4. daemon 名逐字断言：目标=**TriRMC**（R-HY 8712 服务域）——过程若发现多 daemon 并存，全部掩形上报，由本席对表，执行位不裁。

## 三、探法（三路·只读·按序）

**路1 定位**（8712 监听进程）：

```bash
pgrep -af 'tri' | grep -iE 'rmc|index|node'
ss -tlnp 2>/dev/null | grep 8712
```

记下监听 pid 与 cmdline。

**路2 进程 env 面（首要）**——值面封变量掩形管道：

```bash
SUDO=""
sudo -n true 2>/dev/null && SUDO="sudo -n"
raw=$($SUDO cat /proc/<PID>/environ 2>/dev/null | tr '\0' '\n' | grep -iE 'token')
for line in $raw; do
  k=${line%%=*}; val=${line#*=}
  printf '%s len=%s tail4=%s sha8=%s\n' "$k" "${#val}" "${val: -4}" "$(printf '%s' "$val" | sha256sum | cut -c1-8)"
done
[ -z "$raw" ] && echo 'env: no-hit'
```

注：token 类 env 名**不预设**（TRIMC_/TRIRMC_ 系名先不写死）——grep -iE 'token' 全捕，逐键掩形上报。

**路3 unit/配置文件面**：

```bash
systemctl list-units --type=service --no-pager 2>/dev/null | grep -iE 'tri|rmc'
systemctl cat <unit名> --no-pager 2>/dev/null | grep -iE 'Environment|ExecStart|WorkingDirectory' | sed -E 's/(TOKEN[^=]*=).{4}.*/\1<masked>/I'
```

- unit 面若 Environment= 含 token 值：同路2 掩形算法处理后上报（值面禁原文）。
- TriRMC store/config 文件（从 WorkingDirectory/ExecStart 路径推）：定位后仅报**文件路径+token 键存在性+掩形三键**，禁全文粘贴。

## 四、回读格式

每路一行：`<face>: key=<名> len=<n> tail4=<xxxx> sha8=<8hex>`；无命中回 `no-hit`；受阻回 `blocked: <原因>`。回卷附路1 pid/cmdline 读数。

## 五、判定矩阵（本席收读数后裁决，执行位不裁）

| R-HY 读数 vs 本机指纹 | 断点定向 | 修复面 |
|---|---|---|
| 同指纹（三键全同） | ①未登记或②登记旧值（再看 R-HY 侧登记位读数） | R-HY 登记面 |
| 三键有异 | ③各机独立 token 系 | 分发/配置面（本机 token 打 R-HY＝用错 token） |
| 双值并存 | token 系多套 | 全谱勘（升单） |

——CTO 小狄出单毕。执行位拾取后回读数至 m-cto；毕报链照 COO 批文（勘毕报→COO+CTO·并案销项声明随卷）。
