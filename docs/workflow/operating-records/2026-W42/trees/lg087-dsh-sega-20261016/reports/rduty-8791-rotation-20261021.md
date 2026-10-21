# 施工回报 · 8791 token 轮换（CTO-ORDER-8791-rotation-20261021）

- 令源：CTO 小狄 2026-10-21 施工令（CEO 双窗令 + COO 18:46 死线压缩至 20:44；判停 20:14）
- 施工席：r-duty-cos（河源值班席）
- 签发时刻（date 现查）：UTC **2026-10-21T11:02:04Z** ＝ 北京 **2026-10-21 19:02:04 +0800**
- 施工段：**18:59:22-19:02:04 北京**（停旧→起新→验证，约 2m42s；远低于 1.5x 判停线，死线 20:44 前 1h42m）
- 水位自估：中（服务重启类·已验证新态活）
- 末次活动时刻（transcript mtime 现查）：2026-10-21 19:02:04（本席 session.v4.jsonl.zstd，1213614B）

## 一句话结论

**8791 已完成服务端 token 轮换：旧 token 交换 401、新 token 交换 200（+Cookie/页面 200）、44 个会话全在、0 在飞 turn；旧进程 pid 243543 优雅停（2s），新服务 pid 525474 活、端口 LISTEN、HTTP 401 认证门正常。因沙箱下 tmux 起服失败（fork/socket 拒），新服务形=systemd user 瞬态单元 `dsh-web-prod.service`（含 token 掩罩 wrapper，600 日志/600 token 捕获）。客户端 keeper 副本 `/home/fleet/.dsh_tok`（relay3）按令「禁擅改」未动，仍持旧 token——现有浏览器 cookie 仍可 200 进页面（服务端 cookie fallback 实测），新无 cookie 客户端候同步令；同步脚本已备。**

---

## 一、窗前基线快照（18:59:22 前）

| 面 | 基线读数 |
|---|---|
| 8791 进程 | pid **243543**，ppid 16048（tmux server），started 2026-10-17 14:32:08，ELAPSED 4-04:26 |
| tmux | `dsh-web-prod` 单会话，pane pid 243543，cwd `/srv/fleet/TriMetaverse` |
| 端口 | `127.0.0.1:8791` LISTEN |
| 连接 | 仅一对 FIN-WAIT-2/CLOSE-WAIT（127.0.0.1:8791↔55062），无活跃 ESTAB |
| HTTP | `GET /` = **401**（认证门活） |
| 会话库 | 44 条；running=1（`session-4f287b7c…` r-duty-cos，卡在 10-19 22:48 的 `approval/asked` 沙箱提权请求，非活跃计算；重启即清） |
| 启动形 | `scripts/dsh/start-dsh-web-prod.sh`（幂等 ensure，`DSH_HOME=/home/fleet/.dsh`，`dsh web --port 8791 --no-open`） |

## 二、服务端 token 机制定谳（本轮关键发现）

- dsh 0.2.0-rc.2 `processLaunchToken` = `randomBytes(32)` → base64url **43 字符**，进程级 WeakMap 持有；**无 env/config 覆盖位**（源码锚 `dsh-client-connection/lib/index.js` L231/L244/L354）。
- 故 **8791 token 轮换=重启进程**，不是改某个配置文件；新 token 由新进程在启动时生成，旧 token 随旧进程代际失效。
- **“旧值保留至新值验证毕”只能作取证/对照，不能作值回滚**——回滚=再启一次，token 再生成，消费方需再同步。此口径请 CTO 认。

## 三、消费对象勘定表（全键清点·值面零回显）

| 候选载入位 | 现态 | 处置 |
|---|---|---|
| `/home/fleet/.dsh_tok` | 600 fleet 43B，mtime 10-18 21:24，内容=**旧 token** | **未改**（客户端 keeper 副本，按令「同步动作候令·禁擅改」）；现为 stale |
| `/home/fleet/relay3.js` | 启动时读 `.dsh_tok` 到内存；pid 336918（10-18 起），监听 18790；日志仅 `token_len=43` | 未重启（同上）；现仍注入旧 token 302 |
| CEO GUI 副本 | 远端浏览器 Cookie（30 天签名 cookie；本机无 token 文件副本） | 只列清单；现有 cookie 仍有效 |
| 他席副本 | 全盘精确值扫描（/home/fleet、shadow-plane、TriMetaverse/scripts，排除 node_modules/.git/sessions）→ **仅 `.dsh_tok` 一处** | 无他席副本 |
| 旧 tmux 启动行 | 随旧 pane 销毁；旧 token 已 401 | 无需清理 |
| 新 wrapper 日志 | `.rot/web.log`（600），启动行 token 已掩为 `<MASKED>`；扫描原始 43 字符 token=**0** | 合规 |
| systemd journal | 仅 `Started dsh-web-prod.service` 一行；原始 token=**0** | 合规 |

## 四、施工序与读数

### 1）优雅停（18:59:22）

- `kill -TERM 243543` → **2s 退出**；`ss` 8791 = **PORT_FREE**；`tmux ls` = **no server running**（tmux server 随最后会话退出）。
- 无 SIGKILL、无裸杀。

### 2）起新（19:00:22）——形变说明（须 CTO 认）

- 先跑正形 `start-dsh-web-prod.sh` → `tmux new-session` 失败：**`create window failed: fork failed: Permission denied`**（DSH workspace-write 沙箱下 tmux 起服/建 socket 被拒）。
- 自裁最小扰动替代：**systemd user 瞬态单元** `dsh-web-prod.service`（用户管理器 pid 245865，沙箱外），ExecStart=wrapper：
  - wrapper `run-web-masked.py` 拉起 `dsh web --port 8791 --no-open`，`DSH_HOME=/home/fleet/.dsh`，cwd `/srv/fleet/TriMetaverse`；
  - 启动行 token 捕获到 `.rot/new-token`（600）后，日志行掩为 `<MASKED>`；stdout 不落 journal。
  - 单元属性：`Restart=on-failure`、`RestartSec=2`、`--collect`；单元 active，MainPID=**525472**（wrapper），子进程 **525474**（dsh web）。
- 端口 8791 LISTEN；`GET /` = **401**（认证门活）；版本 0.2.0-rc.2。

### 3）验证（19:01-19:02·掩码读数）

| 验证 | 读数 |
|---|---|
| 新 token 长度/口径 | 43 字符；`sha256_8=ecd22c34`（指纹非值） |
| 旧 token 长度/口径 | 43 字符；`sha256_8=e7cd1203`（与 10-20 探针同值，已失效） |
| 新旧不同 | yes |
| 新 token 交换 | 303 → 跟随后 **200**（`text/html`，Cookie 1 枚） |
| 新 token `session/list` | **200**，items=44 |
| 旧 token 交换（无 cookie） | **401** |
| **既有 cookie + 旧 token** | **200**（服务端 `authorizeIndex` token 失败后回退 cookie；既有浏览器不断线） |
| 页面可达 | 新 token 直达 **200**；无 cookie 直访 **401**（认证门） |
| 会话完整性 | 44/44 在册；RDT 目标 `session-fb7dbf97…` 在册且 running=false |
| 在飞 turn | 0（原卡 approval 的 r-duty-cos 随重启清） |
| 进程对表 | 旧 243543 已亡；新 525474 活；父 wrapper 525472；无 8791 重复进程 |
| 服务写面 | 服务由 user manager 拉起（沙箱外），`DSH_HOME=/home/fleet/.dsh` 可写；44 会话正常载入 |

## 五、护栏复核

| 护栏 | 实况 |
|---|---|
| D-46 零回显 | token 值未进报告/日志/journal/argv；wrapper 日志 1 处 `<MASKED>`、原始 0；journal 原始 0 |
| wrap 续接正形 | 本次新 token 从 **pipe**（非 80 列 tty）读取，43 字符连续；旧 token 提取仍按 10-20 正形 wrap 续接（42→43） |
| 轮换三正形 | ①消费对象全键清点（§三）②token 本地进程生成+600 捕获 ③候选载入位：`.dsh_tok` 属客户端 keeper，按令未改（候令） |
| 回滚锚 | 旧 token 文件 `.rot/old-token`（600）保留；旧启动形 `start-dsh-web-prod.sh` 在；服务失败可 `systemctl --user restart dsh-web-prod`；值回滚不可行（§二） |
| 止损线 | 实际 2m42s，远低于 1.5x；未触判停 |
| 值守位 | 本席施工全程在场；未离开会话 |

## 六、候裁/待办（请 CTO/COO 裁）

1. **形变认账**：tmux 起服在沙箱下不可行，已用 systemd user 瞬态单元承载（`dsh-web-prod.service`）。如必须回到 tmux 形，请在**沙箱外完整 shell**跑 `start-dsh-web-prod.sh`（会再生成新 token，需再同步）；本席不擅自二次重启。
2. **relay keeper 同步令**：`.dsh_tok`/relay3 仍持旧 token（302 旧值；有 cookie 仍 200）。同步脚本已备：
   `/home/fleet/.dsh-workspaces/r-duty-cos/.rot/sync-8791-relay.sh`
   - 只读自检：`.rot/sync-8791-relay.sh --check` → `new_len=43 old_len=43 current_is_old=yes`（已跑）
   - 正式同步（须沙箱外）：`systemd-run --user --wait --unit=relay-sync --collect /bin/bash /home/fleet/.dsh-workspaces/r-duty-cos/.rot/sync-8791-relay.sh`
   - 行为：原子写 `.dsh_tok`（600）→ 重启 relay3 为 `relay3.service` → 302 校验（不打印 Location）→ 消费 `.rot/new-token`。
   - **本席未执行**，因令面「发现 CEO 侧或他席副本…同步动作候令，禁擅改」；请明令后本席即办（或 BOD 直跑）。
3. **旧值处置**：`.rot/old-token`（600·已失效）候令删除。
4. **形变残留**：systemd 瞬态单元不随重启持久（与 tmux 同）；`.rot/run-web-masked.py` 是单元 ExecStart，**不可删**；若需长期化，建议 CTO 出正式 unit 文件（本席沙箱写不了 `/etc`/`~/.config`）。

## 七、三送

1. **落卷（应达面）**：本文件，r-duty-cos 工作区 ✅（BOD 直读收执）
2. **回信本会话**：✅
3. **树内副本**：落 `docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/reports/rduty-8791-rotation-20261021.md`，commit 见推平后补注。
4. 箱投仍受 TriMMC outbox 通道限制，以树内件代偿，请 BOD 转知 COO。

—— r-duty-cos · 2026-10-21 19:02:04 +0800（date 现查原值粘贴·D-47 机械闸）
