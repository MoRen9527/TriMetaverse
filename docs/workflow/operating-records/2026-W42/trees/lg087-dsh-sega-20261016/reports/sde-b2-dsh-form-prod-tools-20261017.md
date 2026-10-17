# SDE 施工卷 · B2 接位段 dsh 生产形五裁执行+start 脚本施工+冒烟（实例已 ensure·候 CTO GUI 主操）· 2026-10-17

- sourceOfTruth: docs/workflow/operating-records/2026-W42/trees/lg087-dsh-sega-20261016/reports/sde-b2-dsh-form-prod-tools-20261017.md
- syncMode: static（施工卷·料齐候毕锚）
- lastSyncedAt: 2026-10-17 06:32:48Z（+8=14:32:48 北京·date 现查原值·D-47 正形）
- 执行席: SDE 小布（m-sde）·charter-2026-W42-006 B2 接位段
- 施工位: 河源 R-HY（生产 ~/.dsh·8791）

## CTO 五裁执行对表（14:30:11）

| 裁 | 执行 | 判 |
| --- | --- | --- |
| ①单实例共用 | start 脚本 DSH_HOME=/home/fleet/.dsh 主 HOME·非 13 进程 | ✓ |
| ②端口 8791 默认 loopback | --port 8791·不显式 --host·活体 LISTEN 127.0.0.1:8791 | ✓ |
| ③独立 tmux dsh-web-prod | 会话名 dsh-web-prod·与 13 席位会话分离（B14 实例处置挂账另议） | ✓ |
| ④三验③挂窗2 | 接位判定门=①②毕锚+实例健康断言·过渡桥不裁采认 | ✓ |
| ⑤start 脚本即写 | segb-tools-20261017/start-dsh-web-prod.sh（root 755·本仓 scripts/dsh/ 同步在档） | ✓ |

## start-dsh-web-prod.sh 施工+冒烟三轮

- 段语义：ensure（幂等·残迹态 FATAL 禁盲清护栏）+健康断言（http_code/绑定/版本三断言）+席会话 GUI 指针段。
- **冒烟一轮抓 bug**：`curl -w '%{http_code}' || echo 000` 失败时 -w 已输出 000 再追加→000000→幂等误判跳过起（实例没起）——修=去 `\|\| echo 000`（-w 失败自出 000）。
- 冒烟二轮（实起）：tmux dsh-web-prod 起·http_code=**401**（认证门壳活）·LISTEN 127.0.0.1:8791·版本 0.2.0-rc.2 ✓。
- 冒烟三轮（幂等复验）：「已有实例应答 401→幂等跳过起」——幂等分支真工作 ✓。
- 脚本注记勘正：壳活判读=200/303/**401**（认证门应答）·000=FAIL。

## 第四件料答（会话通路原样——诚实答：curl/API 通路不存在）

- P0 层 2 勘定链实锚（施工卷 ef494bebb）：Host API 逆向三探零命中·传输=Gateway Remote 协议（非 REST）·无文档化 REST 面——四次实跑验 preset join 用 boot log 挂载行断言，**未跑过会话创建 curl**。
- 正形通路=GUI 人机形（零自研·B1 cos 手测同形）：ssh -L 8791 隧道→本机浏览器 127.0.0.1:8791（token capture-pane 自读零转报）→GUI 选 preset r-duty-cto 建会话→主操发首句。
- 缺口候裁：a 案 WS（窗2 #7）或 cos 代测形。

## 现势

- 生产实例已活（ensure 段 SDE 施工毕）——候 CTO GUI 主操（r-duty-cto preset 会话+首句毕锚①②）。
- B3 预派在案：coo 席参数全备·双信号节拍（CTO 毕锚①+COO 准退②已到）——候①齐即开工（模板复活→四断言→退役三步照 COO 交接卷清点正身）。

## 使用依据

- CTO 五裁信 14:30:11+料齐信 14:27:32·COO 准退信 14:31（交接卷 cec22f512b）
- P0 层 2 勘定链（ef494bebb·Gateway Remote 非 REST 实锚）·B1 cos 手测形
- dsh 入口活体勘（06:29：0.2.0-rc.2·~/.dsh 无 .env=store 接管实证）

落款=SDE 小布 2026-10-17 06:32:48Z（+8=14:32:48 北京·date 现查原值·发毕对表）
