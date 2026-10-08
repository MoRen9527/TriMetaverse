# CTO 模拟投递探针命令单 · 10:00 挂载窗第④步（FSD 执行·CTO 复核）

- sourceOfTruth: 本件（trees/lg066-window-order-20261009/cto-notify-probe-command-card-20261009.md）
- syncMode: final（命令单·窗序 c1c6c492 第④步供给件）
- lastSyncedAt: 2026-10-09T03:58:00+08:00（见 commit 时刻断言，落款纪律=date 现查）
- 执行位: FSD（10:00 挂载窗第④步·d7693c6 优雅重启毕后）；复核位: CTO（贴读数回传）
- 前序: 窗序①置位断言两读数绿+②重启毕+③healthz 绿 之后跑本单

## 判据勘定（窗序终稿「模拟投递 200」拆双刻——如实中间态）

| 探针 | 源席 | 预期 | 实证语义 |
| --- | --- | --- | --- |
| **A 正对照** | m-cos | **HTTP 200** | 链路四跳通+新代码 target_daemon=trimlc 修正生效+bod 在 trimlc 名册=8713 侧件毕实证（BOD「200 两刻」落此） |
| **B 如实中间态** | power-gate | **HTTP 403** | sg 源席白名单缺口按预期仍在（今晚 sg 件落位前闸真身通知失败=已知未修，防误判「修完」） |

**两刻齐=A 通过+B 得 403 ⇒ 晨窗毕探 PASS**；A 非 200=fail 停报；B 非 403（得 200/400）=异常停报（缺口形态变了须勘）。

## 命令形（Git Bash·逐条贴读数）

```bash
# P1 提取 token 入 shell 变量（sed 形防 grep -P locale 坑；值面零出机只验长度）
TOKEN=$(tr -d '\r' < "$LOCALAPPDATA/trimlc-daemon-channel.cmd" | sed -nE 's/^set TRIMC_NOTIFY_SG_TOKEN=(.*)$/\1/p')
echo "token_len=${#TOKEN}"          # 预期 token_len=64；0=提取失败停（401 勿投）

# P2 探针 A：m-cos 源正对照（预期 200；落一条 PROBE 通知属预期副作用）
curl -sS -o /dev/null -w 'probeA=%{http_code}\n' -X POST http://127.0.0.1:18710/internal/v1/notify \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"source_seat":"m-cos","target_daemon":"trimlc","target_seat":"bod","title":"[PROBE] LG-069 挂载窗探针A","body":"notify chain probe after d7693c6","urgent":"normal"}'

# P3 探针 B：power-gate 源如实中间态（预期 403；零副作用=sg 拒收无写面）
curl -sS -o /dev/null -w 'probeB=%{http_code}\n' -X POST http://127.0.0.1:18710/internal/v1/notify \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"source_seat":"power-gate","target_daemon":"trimlc","target_seat":"bod","title":"[PROBE] LG-069 挂载窗探针B","body":"whitelist gap expected 403","urgent":"normal"}'

# P4 清变量收尾
unset TOKEN
```

## 读数回报形（FSD 贴四行回 CTO 复核）

```
token_len=64
probeA=200
probeB=403
(探针 A 通知已落 bod 信箱属预期)
```

## 注记

- 18710=本地 SSH 隧道→sg TriMMC 8712（keeper 在位=勘修 03:4x 实锚；若 connection refused 先查 keeper 进程再报）。
- P2/P3 的 `urgent:normal` 必填（枚举校验）；`-d` 全形照抄勿增删字段（403/400 语义锚已勘定）。
- **禁**以本单替代闸真身验证：今晚 sg 白名单件落位后，power-gate 形重探预期 200 才=归零锚（另行排）。
- 本单与勘修毕报（03:4x）同源命令形，P1 形已在勘修实弹跑通（token_len=64）。
