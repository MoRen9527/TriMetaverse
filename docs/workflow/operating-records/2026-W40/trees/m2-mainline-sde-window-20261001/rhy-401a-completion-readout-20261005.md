# 件 b·R-HY 401 a 项完工验证读数卷（10-05 上午）

- 执行: m-sde（SDE 小布）；令源=BOD 09:32 现窗令（CEO 09:30「3 个否决前挪，现在就干」）件②
- 时点: 读数现采 2026-10-05T02:07:35Z（=10:07:35+08，date 现查锚）
- **终态: 401 a 项（token 同步+8713 重启）完工——实际生效时点=2026-10-04 03:07:55+08（channel.cmd 冷启），本窗完成完工验证闭环**
- **勘误声明**: 压缩前「现症=TLS 断链」定性**撤销**——系把 09-13 前旧日志尾误读为现在时（stderr.log mtime=09-13 00:43 / channel.err mtime=09-09 死文件实锚，教训=日志尾不作现在时证据，必验 mtime）

## 一、BOD 令要求对照

| 令项 | 要求 | 实锚 |
| --- | --- | --- |
| token 同步 | channel.cmd 与 R-HY api-token.env 值面对表 | ✅ 三点全对：两侧 token 段 len64 / head=`3608` / tail=`cee7`（掩码形态，全值零回显） |
| 8713 重启照 D-04 | trilc 权威路径/watchdog 自然拉起，禁裸杀 | ✅ 零手动重启需求——10-04 03:07:55 冷启已覆盖（时序双锚见 §二） |
| 完工锚必含进程内生效验证（healthz 绿≠生效） | 目标变更值面探针 | ✅ 四层实锚见 §三：含 face-events mlc pull ok 主锚（进程内 token 通过 R-HY fail-closed 门的行为级实证） |

## 二、token 面双锚

1. **值面三点对表**：本机 `trimlc-daemon-channel.cmd` L11（mtime 2026-10-03 02:52:48）↔ R-HY `/srv/fleet/trimodel-data/api-token.env` L1——len64/head/tail 全同。
2. **进程时序锚**：8713（pid 13756）启动=2026-10-04 03:07:55（Win32_Process CreationDate 实锚）＞ channel.cmd mtime 10-03 02:52 → 进程 env 必带新值；父链实锚=cmd.exe /c channel.cmd（冷启经启动器，env 全套继承）。

## 三、进程内生效验证四层实锚（10-05 现采）

| 层 | 探针 | 读数 |
| --- | --- | --- |
| ① 8713 健康面 | `GET /healthz` | ok:true / uptime 111330s / cron 7 jobs / degraded:false（背景项） |
| ② node 同款双态探针（OpenSSL 形=8713 运行时同款） | fetch `https://8.155.54.79/v1/config/keys` 带 NODE_EXTRA_CA_CERTS | **带真 token → HTTP-200**（config.keys 返回）；**无效 token → HTTP-401**（`Unauthorized: invalid or missing API token`，fail-closed 正常）——token 门行为面全绿 |
| ③ **D-04 主锚：face-events mlc 转 ok** | R-HY `/srv/fleet/trimodel-data/face-ledger.json` | `"mlc": last_pull_at=2026-10-05T01:59:40.296Z, last_pull_result="ok"`；face-events.jsonl 尾条 `{"face":"mlc","etype":"pull","result":"ok","detail":"pull served, card absent"}`——**8713 进程内 token 通过 R-HY 401 门的最强行为级实证**（09:59:40+08 达成） |
| ④ 链路持续健康 | face-events 尾部+channel.log | rmc face 02:03:38Z pull ok applied 持续；channel.log 至 10:03 零新失败痕 |

## 四、勘误卷宗：TLS 断链定性撤销（如实录）

1. **误判形成**：压缩前以 tail 尾部读到 `fetch failed` 族判「现症=TLS 层」——tail 的是 channel.err / stderr.log，两文件 mtime 实为 **09-09 / 09-13**（三周前死文件），fetch failed 全部是 09-13 前旧痕。
2. **假阳性探针**：mingw64 curl（Schannel 形）exit 60 系 Schannel 对该证书链/信任锚语义的**工具特有假象**——node（8713 同款 OpenSSL 形）同探针 200 绿。结论：curl Schannel 形不外推 node 行为，daemon 行为验证以 node 探针为权威。
3. **无 CA env 对照**：剥 NODE_EXTRA_CA_CERTS 复现 `DEPTH_ZERO_SELF_SIGNED_CERT`——解释 09-13 前旧痕成因（当时进程无有效 CA env），反证现进程带有效 CA（当前零失败痕）。
4. **教训入库**：日志尾≠现在时；活体验证顺序=mtime 先行 → 活体探针 → 日志佐证（活体优先诊断法族新案例）。

## 五、时间线闭环（401 挂账 → 完工）

| 时点 | 事件 |
| --- | --- |
| 09-30 | 挂账判词「pull_denied：信任面 TLS 已通，token 门未放行」（候明晚窗） |
| 10-03 02:52 | channel.cmd 更新落盘（token L11+CA env L14，mtime 实锚） |
| 10-04 03:07:55 | 8713 冷启（watchdog 自然拉起通道形态，非裸杀）——**a 项两动作（token 同步+重启）此刻生效** |
| 10-05 09:59:40 | face-events mlc pull ok（本卷主锚） |
| 10-05 10:07 | 本窗完工验证闭环，401 a 项销账候选 |

## 六、使用依据

- BOD 09:32 现窗令（件②完工锚要求）+09-30 实证教训（healthz 绿≠生效）
- D-04 时刻纪律（本卷时点均现查）；键值掩码纪律（len+head4+tail4，全值零回显）
- 活体探针：8713 healthz / Win32_Process 进程链 / node fetch 双态 / R-HY face-ledger+face-events 只读
- 勘误教训：活体优先诊断法（LG-035 族）延伸案例——日志面必验 mtime 方可作现在时证据
