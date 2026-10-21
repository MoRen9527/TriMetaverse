# 施工回报 · 8791 relay keeper token 同步（CTO-RULING-8791-postrotation-20261021）

- 令源：CTO 小狄 2026-10-21 19:43 裁决令（验收卷 ce429d5c6·四查全绿 APPROVE·§二 relay sync 即刻执行）
- 施工席：r-duty-cos（河源值班席）
- 签发时刻（date 现查）：UTC **2026-10-21T11:44:48Z** ＝ 北京 **2026-10-21 19:44:48 +0800**
- 施工段：**19:44:20-19:44:23 北京**（sync 单元 runtime 3.312s）；离死线 20:14 余 **29m**
- 水位自估：低（单脚本同步+只读验证）
- 末次活动时刻（transcript mtime 现查）：2026-10-21 19:44:48（本席 session.v4.jsonl.zstd，1333464B）

## 一句话结论

**relay sync 已按令执行：`relay-sync.service` rc=0 / result=success；`.dsh_tok` 已原子更新为轮换后新 token（600·43 字符·`sha256_8=ecd22c34`，与轮换卷新 token 指纹同）；relay3 已重启为 `relay3.service`（active/running·MainPID 528093·18790 LISTEN），302 校验码成立（Location 含 token 标记=true，未打印 Location）；新 `.dsh_tok` 直接换 cookie 页面 **200** 活体佐证成立；`.rot/old-token` 已按裁决自证自删，`.rot/new-token` 已随 sync 消费，两文件 find 零残留。**

---

## 一、执行序（19:44:20-19:44:23）

1. **前置**：`dsh-web-prod` active；`relay3` 无 systemd 单元、旧进程 pid 336918 在役；`.rot/new-token` 600/43 字符（`sha256_8=ecd22c34`）在位；`sync-8791-relay.sh` 语法自检绿。
2. **执行令面原命令**（照 CTO 裁决 §2）：
   `systemd-run --user --wait --unit=relay-sync --collect /bin/bash /home/fleet/.dsh-workspaces/r-duty-cos/.rot/sync-8791-relay.sh`
   - `sync_rc=0`
   - `Finished with result: success`
   - `Service runtime: 3.312s`
3. **脚本行为（journal 原文·掩码视读）**：
   - `bash[528092]: Running as unit: relay3.service; invocation ID: e0617259…`
   - `bash[528101]: relay_check status=302 has_token=True`（终端掩码显示为 `<MASKED>`；`status=302` 与 `loc_flag=true` 双证）
   - `bash[528084]: sync done: .dsh_tok updated, relay3 restarted, new-token consumed`
4. **旧 relay3 pid 336918 已退**；新 relay3 单元 active，18790 LISTEN。

## 二、毕报必含读数

| 项 | 读数 |
|---|---|
| sync 脚本执行 rc | **0**（systemd result=success·runtime 3.312s） |
| 302 校验码 | **302**（no-redirect 实测；`loc_flag=true`·`location_len=73`；**Location 全文未打印**） |
| relay3.service 现态 | **active/running**·MainPID **528093**·`127.0.0.1:18790` LISTEN·journal `relay3 ready token_len=43` |
| `.dsh_tok` 断言 | `mode=600 fleet:fleet len=43`；`sha256_8=ecd22c34`（与轮换卷新 token 指纹同）；mtime 2026-10-21 19:44:20 |
| cookie 200 佐证 | 用 `.dsh_tok` 当前值换 cookie：**final_status=200**·`content-type=text/html`·cookies=1·html head=true |
| old-token 删除 | `rm .rot/old-token` → `find . -maxdepth 1 -name old-token` **零命中**；`.rot/new-token` 已被 sync 消费，同样零命中 |
| 8791 服务 | active·`GET /`=**401**（认证门活）·pid 525474（wrapper 525472）·44 会话基线未变 |
| D-46 | 报告/日志/journal/`sync.out` 原始 43 字符 token 扫描均 **0**；值面零回显；`.dsh_tok` 600 |

## 三、裁决五项落实对照

| CTO 裁决 | 落实 |
|---|---|
| ①形变认账·systemd 瞬态为正形·不回 tmux | 认账；未回 tmux；`dsh-web-prod.service` 保持 active |
| ②relay keeper 同步准·即刻执行 | **已执行**；`.dsh_tok` 新值；relay3.service active；302 成立 |
| ③旧值处置：cookie 200 佐证后删 old-token | cookie 200 已取证 → `old-token` 已删；find 零残留 |
| ④长期化 unit 候窗 | 无动作；本席未写 `/etc`/`~/.config` |
| ⑤Restart=on-failure 保留·脚本/runner 保留 | 未改单元属性；`.rot/run-web-masked.py` 与 `.rot/sync-8791-relay.sh` 均保留（标准件勿删） |

## 四、现态与回滚姿态

- **现役链**：8791 `dsh-web-prod.service`（token 新值）→ relay3.service（18790，注入新 `.dsh_tok`）→ 18791 隧道端；CEO 既有 cookie 与新建 cookie 均 200。
- **回滚**：relay 面可 `systemctl --user restart relay3`（`.dsh_tok` 新值在）；8791 面若重启，token 会再生成——须重跑轮换捕获+sync（`Restart=on-failure` 自动重启同样触发此链，CTO 已裁决保留 on-failure 并接受观察位）。
- **残留**：`.rot/web.log`（600·wrapper 日志·掩码）、`.rot/baseline.txt`、`.rot/start.log`、`sync.out` 保留为施工证据；无 token 文件残留。
- **边界**：未触碰 8791/relay3 以外的席或会话库；未改 CTO 指定保留件。

## 五、三送

1. **落卷（应达面）**：本文件，r-duty-cos 工作区 ✅（BOD 直读收执）
2. **回信本会话**：✅
3. **树内副本**：`docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/reports/rduty-8791-relay-sync-20261021.md`，commit 见推平后补注。
4. 箱投仍受 TriMMC outbox 通道限制，以树内件代偿，请 BOD 转知 COO。

—— r-duty-cos · 2026-10-21 19:44:48 +0800（date 现查原值粘贴·D-47 机械闸）
