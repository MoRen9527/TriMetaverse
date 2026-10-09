# CTO 模拟投递探针命令单 · 10:00 挂载窗第④步（FSD 执行·CTO 复核）

- sourceOfTruth: 本件（trees/lg066-window-order-20261009/cto-notify-probe-command-card-20261009.md）
- syncMode: final（命令单·窗序 c1c6c492 第④步供给件）
- lastSyncedAt: 2026-10-09T03:58:00+08:00（见 commit 时刻断言，落款纪律=date 现查）
- 执行位: FSD（10:00 挂载窗第④步·d7693c6 优雅重启毕后）；复核位: CTO（贴读数回传）
- 前序: 窗序①置位断言两读数绿+②重启毕+③healthz 绿 之后跑本单

## 判据勘定（窗序终稿「模拟投递 200」拆双刻——如实中间态）

| 探针 | 源席 | 预期 | 实证语义 |
| --- | --- | --- | --- |
| **A 存量源回归对照** | m-cos | **HTTP 200** | 链路四跳通+新代码 target_daemon=trimlc 修正生效+存量源不回归（BOD「200 两刻」落此） |
| **B 新增源生效实证** | power-gate | **HTTP 200**（08:26 勘定） | sg 白名单 power-gate 件落位生效持续实证（缺口已闭合·403 判据作废） |

**判据勘定记录（08:26·CTO 裁）**：本卷初版 B=403 系「白名单缺口如实中间态」判据——08:26 sg SOURCE_SEAT_WHITELIST 加 power-gate 落位（留痕 @f5559cee·端到端 200+信箱落盘实证），判据前提消失，**B 预期勘 403→200**。勘后语义：A 验存量源不回归+B 验新增源生效，**双 200=晨窗毕探 PASS**；任一非 200（A/B 得 403/400）=白名单回退或配置漂移=异常停报。窗内 B 重测价值=8713 优雅重启（d7693c6 随车）后链路复验（隧道 keeper 与 8713 poller 不受重启扰动）。

## 命令形（Git Bash·逐条贴读数）

```bash
# P1 提取 token 入 shell 变量（sed 形防 grep -P locale 坑；值面零出机只验长度）
TOKEN=$(tr -d '\r' < "$LOCALAPPDATA/trimlc-daemon-channel.cmd" | sed -nE 's/^set TRIMC_NOTIFY_SG_TOKEN=(.*)$/\1/p')
echo "token_len=${#TOKEN}"          # 预期 token_len=64；0=提取失败停（401 勿投）

# P2 探针 A：m-cos 源正对照（预期 200；落一条 PROBE 通知属预期副作用）
curl -sS -o /dev/null -w 'probeA=%{http_code}\n' -X POST http://127.0.0.1:18710/internal/v1/notify \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"source_seat":"m-cos","target_daemon":"trimlc","target_seat":"bod","title":"[PROBE] LG-069 挂载窗探针A","body":"notify chain probe after d7693c6","urgent":"normal"}'

# P3 探针 B：power-gate 源新增生效实证（预期 200·08:26 勘定·重启后链路复验）
curl -sS -o /dev/null -w 'probeB=%{http_code}\n' -X POST http://127.0.0.1:18710/internal/v1/notify \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"source_seat":"power-gate","target_daemon":"trimlc","target_seat":"bod","title":"[PROBE] LG-069 挂载窗探针B","body":"power-gate source live check after 8713 restart","urgent":"normal"}'

# P4 清变量收尾
unset TOKEN
```

## 读数回报形（FSD 贴四行回 CTO 复核）

```
token_len=64
probeA=200
probeB=200
(探针 A/B 通知落 bod 信箱各一笔属预期)
```

## 注记

- 18710=本地 SSH 隧道→sg TriMMC 8712（keeper 在位=勘修 03:4x 实锚；若 connection refused 先查 keeper 进程再报）。
- P2/P3 的 `urgent:normal` 必填（枚举校验）；`-d` 全形照抄勿增删字段（403/400 语义锚已勘定）。
- 闸真身归零锚**已落**（08:26 sg 件提前窗毕·power-gate 端到端 200+信箱落盘实证·留痕 @f5559cee）——窗内探针 B 系重启后链路复验非首次验证。
- 本单与勘修毕报（03:4x）同源命令形，P1 形已在勘修实弹跑通（token_len=64）。
